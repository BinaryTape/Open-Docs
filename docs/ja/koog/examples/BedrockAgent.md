# AWS BedrockとKoogフレームワークを使用したAIエージェントの構築

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

KoogフレームワークとAWS Bedrockの統合を使用して、インテリジェントなAIエージェントを作成するための包括的なガイドへようこそ。このノートブックでは、自然言語のコマンドを通じてシンプルなスイッチデバイスを制御できる、実用的なエージェントの構築手順を説明します。

## 学習内容

- Kotlinのアノテーションを使用してAIエージェント用のカスタムツールを定義する方法
- LLM駆動型エージェントのためのAWS Bedrock統合の設定
- ツールレジストリ（Tool Registry）の作成とエージェントへの接続
- コマンドを理解し実行できるインタラクティブなエージェントの構築

## 事前準備

- 適切な権限を持つAWS Bedrockへのアクセス権
- 設定済みのAWS認証情報（アクセスキーとシークレットキー）
- Kotlinコルーチンに関する基本的な理解

それでは、最初のBedrock駆動型AIエージェントの構築を始めましょう！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// エージェントが制御する、状態を保持するシンプルなデバイスクラス
class Switch {
    private var state: Boolean = false

    fun switch(on: Boolean) {
        state = on
    }

    fun isOn(): Boolean {
        return state
    }
}

/**
 * AIエージェントにスイッチ操作を公開するToolSetの実装。
 *
 * 主な概念:
 * - @Tool アノテーションは、メソッドをエージェントから呼び出し可能としてマークします
 * - @LLMDescription は、LLM用の自然言語による説明を提供します
 * - ToolSet インターフェースは、関連するツールをグループ化することを可能にします
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("スイッチの状態をオンまたはオフに切り替えます")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "スイッチを正常に${if (state) "オン" else "オフ"}にしました"
    }

    @Tool
    @LLMDescription("現在のスイッチの状態（オンまたはオフ）を返します")
    fun getCurrentState(): String {
        return "スイッチは現在${if (switch.isOn()) "オン" else "オフ"}です"
    }
}
```

```kotlin
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools

// スイッチのインスタンスを作成
val switch = Switch()

// スイッチツールを使用してツールレジストリを構築
val toolRegistry = ToolRegistry {
    // ToolSetを個別のツールに変換して登録
    tools(SwitchTools(switch).asTools())
}

println("✅ ${toolRegistry.tools.size} 個のツールを含むツールレジストリが作成されました:")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 2 個のツールを含むツールレジストリが作成されました:
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// Bedrockクライアントの設定を構成
val bedrockSettings = BedrockClientSettings(
    region = region, // 希望するAWSリージョンを選択
    maxRetries = maxRetries // 失敗したリクエストの最大リトライ回数
)

println("🌐 Bedrockがリージョン $region で設定されました")
println("🔄 最大リトライ回数: $maxRetries")
```

    🌐 Bedrockがリージョン us-west-2 で設定されました
    🔄 最大リトライ回数: 3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 環境変数からの認証情報を使用してBedrock LLMエグゼキューターを作成
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY 環境変数が設定されていません"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数が設定されていません"),
    settings = bedrockSettings
)

println("🔐 Bedrockエグゼキューターが正常に初期化されました")
println("💡 ヒント: AWS_BEDROCK_ACCESS_KEY と AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数を設定してください")
```

    🔐 Bedrockエグゼキューターが正常に初期化されました
    💡 ヒント: AWS_BEDROCK_ACCESS_KEY と AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数を設定してください

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 最先端の推論モデル
    systemPrompt = """
        あなたはスイッチデバイスを制御する親切なアシスタントです。

        以下のことが可能です：
        - 要求に応じてスイッチをオンまたはオフにする
        - スイッチの現在の状態を確認する
        - 自分の行動について説明する

        常にスイッチの現在の状態を明確にし、実行したアクションを報告してください。
    """.trimIndent(),
    temperature = 0.1, // 一貫性のある集中したレスポンスのための低い温度設定
    toolRegistry = toolRegistry
)

println("🤖 AIエージェントが正常に作成されました！")
println("📋 システムプロンプトが設定されました")
println("🛠️  利用可能なツール: ${toolRegistry.tools.size}")
println("🎯 モデル: ${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  温度 (Temperature): 0.1 (集中したレスポンス)")
```

    🤖 AIエージェントが正常に作成されました！
    📋 システムプロンプトが設定されました
    🛠️  利用可能なツール: 2
    🎯 モデル: LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  温度 (Temperature): 0.1 (集中したレスポンス)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 スイッチツールを備えたBedrockエージェント - 準備完了！")
println("💬 以下のことを依頼できます：")
println("   • スイッチのオン/オフを切り替える")
println("   • 現在のスイッチの状態を確認する")
println("   • スイッチに関する質問をする")
println()
println("💡 例: 「スイッチをオンにしてください」または「今の状態はどうなっていますか？」")
println("📝 リクエストを入力してください:")

val input = readln()
println("
🤖 リクエストを処理中...")

runBlocking {
    val response = agent.run(input)
    println("
✨ エージェントのレスポンス:")
    println(response)
}
```

    🎉 スイッチツールを備えたBedrockエージェント - 準備完了！
    💬 以下のことを依頼できます：
       • スイッチのオン/オフを切り替える
       • 現在のスイッチの状態を確認する
       • スイッチに関する質問をする
    
    💡 例: 「スイッチをオンにしてください」または「今の状態はどうなっていますか？」
    📝 リクエストを入力してください:

    実行が中断されました

## 何が起きたのか？ 🎯

エージェントを実行すると、舞台裏では以下のような魔法が起こっています：

1.  **自然言語処理 (NLP)**: あなたの入力がBedrockを通じてClaude 3.5 Sonnetに送信されます。
2.  **意図の認識 (Intent Recognition)**: モデルは、あなたがスイッチに対して何をしたいのかを理解します。
3.  **ツールの選択**: リクエストに基づいて、エージェントはどのツールを呼び出すべきかを決定します。
4.  **アクションの実行**: スイッチオブジェクトに対して適切なツールメソッドが呼び出されます。
5.  **レスポンスの生成**: エージェントは何が起きたかについて自然言語でレスポンスを構築します。

これは、自然言語理解とプログラムによるアクションのシームレスな統合という、Koogフレームワークの核心的なパワーを示しています。

## 次のステップと拡張

さらに進める準備はできましたか？以下に探索のためのアイデアをいくつか挙げます：

### 🔧 強化されたツール
```kotlin
@Tool
@LLMDescription("指定された秒数後にスイッチを自動的にオフにするタイマーを設定します")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("スイッチの使用統計と履歴を取得します")
fun getUsageStats(): String
```

### 🌐 複数のデバイス
```kotlin
class HomeAutomationTools : ToolSet {
    @Tool fun controlLight(room: String, on: Boolean): String
    @Tool fun setThermostat(temperature: Double): String
    @Tool fun lockDoor(doorName: String): String
}
```

### 🧠 メモリとコンテキスト
```kotlin
val agent = AIAgent(
    executor = executor,
    // ... その他の設定
    features = listOf(
        MemoryFeature(), // 過去のやり取りを記憶
        LoggingFeature()  // すべてのアクションを追跡
    )
)
```

### 🔄 高度なワークフロー
```kotlin
// 条件付きロジックを含むマルチステップのワークフロー
@Tool
@LLMDescription("夜のルーチンを実行：照明を暗くし、ドアをロックし、サーモスタットを設定します")
fun eveningRoutine(): String
```

## 主なポイント

✅ **ツールは関数である**: どのようなKotlin関数もエージェントの能力になり得ます。
✅ **アノテーションが動作を駆動する**: `@Tool` と `@LLMDescription` によって関数が発見可能になります。
✅ **ToolSetが機能を整理する**: 関連するツールを論理的にグループ化します。
✅ **レジストリは道具箱である**: `ToolRegistry` には利用可能なすべてのエージェント機能が含まれます。
✅ **エージェントがすべてをオーケストレーションする**: `AIAgent` がLLMのインテリジェンスとツールを統合します。

Koogフレームワークを使用すると、自然言語を理解し、現実世界のアクションを実行できる洗練されたAIエージェントを非常に簡単に構築できます。シンプルに始め、必要に応じてより多くのツールや機能を追加して、エージェントの能力を広げていきましょう。

**ハッピー・エージェント・ビルディング！** 🚀

## エージェントのテスト

エージェントの動作を確認する時間です！エージェントは自然言語のリクエストを理解し、提供されたツールを使用してスイッチを制御できるようになりました。

**以下のコマンドを試してみてください：**
- 「スイッチをつけて」
- 「現在の状態を教えて」
- 「オフにしてくれますか？」
- 「スイッチはオンですか、オフですか？」