# AWS BedrockとKoogフレームワークによるAIエージェントの構築

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

AWS Bedrock連携を備えたKoogフレームワークを使用して、インテリジェントなAIエージェントを作成するためのこの包括的なガイドへようこそ。このノートブックでは、自然言語コマンドを通じてシンプルなスイッチデバイスを制御できる機能的なエージェントを構築する手順を説明します。

## 学習内容

- Kotlinアノテーションを使用してAIエージェントのカスタムツールを定義する方法
- LLM駆動型エージェントのためにAWS Bedrock連携を設定する方法
- ツールレジストリを作成し、それらをエージェントに接続する方法
- コマンドを理解し実行できるインタラクティブなエージェントを構築する方法

## 前提条件

- 適切な権限を持つAWS Bedrockへのアクセス
- AWS認証情報（アクセスキーとシークレットキー）が設定済みであること
- Kotlinコルーチンに関する基本的な理解

早速、最初のBedrock駆動型AIエージェントの構築に取り掛かりましょう！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// エージェントが制御するシンプルな状態保持デバイス
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
 * AIエージェントにスイッチ操作を公開するToolSet実装。
 *
 * 主要な概念:
 * - @Toolアノテーションは、メソッドをエージェントから呼び出し可能としてマークします
 * - @LLMDescriptionは、LLMに自然言語の説明を提供します
 * - ToolSetインターフェースは、関連するツールをグループ化できます
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("Switches the state of the switch to on or off")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "スイッチは正常に${if (state) "オン" else "オフ"}になりました"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch (on or off)")
    fun getCurrentState(): String {
        return "スイッチは現在${if (switch.isOn()) "オン" else "オフ"}です"
    }
}
```

```kotlin
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools

// スイッチインスタンスを作成
val switch = Switch()

// スイッチツールを使ってツールレジストリを構築
val toolRegistry = ToolRegistry {
    // ToolSetを個々のツールに変換し、登録します
    tools(SwitchTools(switch).asTools())
}

println("✅ ツールレジストリが${toolRegistry.tools.size}個のツールで作成されました:")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ ツールレジストリが2つのツールで作成されました:
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// Bedrockクライアント設定を構成
val bedrockSettings = BedrockClientSettings(
    region = region, // お好みのAWSリージョンを選択してください
    maxRetries = maxRetries // 失敗したリクエストに対するリトライ回数
)

println("🌐 Bedrockがリージョン: $region に設定されました")
println("🔄 最大リトライ回数が: $maxRetries に設定されました")
```

    🌐 Bedrockがリージョン: us-west-2 に設定されました
    🔄 最大リトライ回数が: 3 に設定されました

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 環境変数から認証情報を使用してBedrock LLMエグゼキュータを作成
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrockエグゼキュータが正常に初期化されました")
println("💡 ヒント: AWS_BEDROCK_ACCESS_KEY と AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数を設定してください")
```

    🔐 Bedrockエグゼキュータが正常に初期化されました
    💡 ヒント: AWS_BEDROCK_ACCESS_KEY と AWS_BEDROCK_SECRET_ACCESS_KEY 環境変数を設定してください

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 最先端の推論モデル
    systemPrompt = """
        あなたはスイッチデバイスを制御する、役立つアシスタントです。

        できること:
        - リクエストに応じてスイッチをオンまたはオフにする
        - スイッチの現在の状態を確認する
        - 行っていることを説明する

        常にスイッチの現在の状態を明確にし、実行されたアクションを確認してください。
    """.trimIndent(),
    temperature = 0.1, // 一貫性のある、集中した応答のため低い温度設定
    toolRegistry = toolRegistry
)

println("🤖 AIエージェントが正常に作成されました！")
println("📋 システムプロンプトが設定されました")
println("🛠️  利用可能なツール: ${toolRegistry.tools.size}")
println("🎯 モデル: ${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  温度: 0.1 (集中した応答)")
```

    🤖 AIエージェントが正常に作成されました！
    📋 システムプロンプトが設定されました
    🛠️  利用可能なツール: 2
    🎯 モデル: LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  温度: 0.1 (集中した応答)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 スイッチツール付きのBedrockエージェント - 準備完了！")
println("💬 次のことを私に尋ねることができます:")
println("   • スイッチをオン/オフにする")
println("   • 現在のスイッチの状態を確認する")
println("   • スイッチに関する質問をする")
println()
println("💡 例: 「スイッチをオンにしてください」または「現在の状態は？」")
println("📝 リクエストを入力してください:")

val input = readln()
println("
🤖 リクエストを処理中...")

runBlocking {
    val response = agent.run(input)
    println("
✨ エージェントの応答:")
    println(response)
}
```

    🎉 スイッチツール付きのBedrockエージェント - 準備完了！
    💬 次のことを私に尋ねることができます:
       • スイッチをオン/オフにする
       • 現在のスイッチの状態を確認する
       • スイッチに関する質問をする
    
    💡 例: 「スイッチをオンにしてください」または「現在の状態は？」
    📝 リクエストを入力してください:

    実行が中断されました

## 何が起こったのか？ 🎯

エージェントを実行すると、舞台裏で以下の魔法が起こります:

1.  **自然言語処理**: あなたの入力はBedrockを介してClaude 3.5 Sonnetに送信されます
2.  **意図認識**: モデルはあなたがスイッチで何をしたいかを理解します
3.  **ツール選択**: あなたのリクエストに基づいて、エージェントはどのツールを呼び出すかを決定します
4.  **アクション実行**: 適切なツールメソッドがスイッチオブジェクトで呼び出されます
5.  **応答生成**: エージェントは発生したことについて自然言語で応答を生成します

これはKoogフレームワークの核となる能力を示しています — 自然言語理解とプログラムによるアクションのシームレスな統合です。

## 次のステップと拡張

さらに進めてみませんか？以下にいくつかのアイデアがあります。

### 🔧 強化されたツール

```kotlin
@Tool
@LLMDescription("Sets a timer to automatically turn off the switch after specified seconds")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("Gets the switch usage statistics and history")
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
    // ... other config
    features = listOf(
        MemoryFeature(), // 過去のやり取りを記憶
        LoggingFeature()  // すべてのアクションを追跡
    )
)
```

### 🔄 高度なワークフロー

```kotlin
// 条件ロジックを含む多段階ワークフロー
@Tool
@LLMDescription("Executes evening routine: dims lights, locks doors, sets thermostat")
fun eveningRoutine(): String
```

## 主要なポイント

✅ **ツールは関数**: どのKotlin関数もエージェントの機能になり得る
✅ **アノテーションが動作を決定する**: `@Tool`と`@LLMDescription`は関数を発見可能にする
✅ **ToolSetは機能を整理する**: 関連するツールを論理的にグループ化する
✅ **レジストリはツールボックス**: `ToolRegistry`は利用可能なすべてのエージェント機能を含む
✅ **エージェントがすべてを調整する**: `AIAgent`はLLMインテリジェンスとツールを組み合わせる

Koogフレームワークを使えば、自然言語を理解し、現実世界のアクションを実行できる洗練されたAIエージェントを非常に簡単に構築できます。シンプルなものから始め、必要に応じてツールや機能を追加してエージェントの機能を拡張してください。

**楽しいエージェント構築を！** 🚀

## エージェントのテスト

エージェントの動作を確認しましょう！エージェントは自然言語リクエストを理解し、提供したツールを使用してスイッチを制御できるようになりました。

**次のコマンドを試してください:**
- 「スイッチをオンにして」
- 「現在の状態は？」
- 「オフにして」
- 「スイッチはオンですか、オフですか？」