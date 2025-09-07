# 概要

Koogは、AIエージェントを完全にKotlinのイディオムに沿って構築および実行するために設計された、Kotlinベースのフレームワークです。
これにより、ツールと対話し、複雑なワークフローを処理し、ユーザーと通信できるエージェントを作成できます。

このフレームワークは、以下の種類のエージェントをサポートしています。

* 最小限の設定で単一の入力を処理し、応答を提供するシングルランエージェント。
  このタイプのエージェントは、ツール呼び出しの単一サイクル内で動作し、タスクを完了して応答を提供します。
* カスタム戦略と構成をサポートする高度な機能を備えた複雑なワークフローエージェント。

## 主な機能

Koogの主な機能は以下のとおりです。

- **純粋なKotlin実装**: 自然でイディオムに沿ったKotlinでAIエージェントを完全に構築します。
- **MCP統合**: モデル制御プロトコルに接続し、強化されたモデル管理を実現します。
- **埋め込み機能**: ベクトル埋め込みを使用して、セマンティック検索と知識検索を行います。
- **カスタムツール作成**: 外部システムやAPIにアクセスするツールでエージェントを拡張します。
- **すぐに使えるコンポーネント**: 一般的なAIエンジニアリングの課題に対する事前構築されたソリューションで開発を加速します。
- **インテリジェントな履歴圧縮**: さまざまな事前構築された戦略を使用して、会話のコンテキストを維持しながらトークン使用量を最適化します。
- **強力なストリーミングAPI**: ストリーミングサポートと並行ツール呼び出しにより、リアルタイムで応答を処理します。
- **永続的なエージェントメモリ**: セッション間、さらには異なるエージェント間でも知識の保持を可能にします。
- **包括的なトレース**: 詳細で構成可能なトレースを使用して、エージェントの実行をデバッグおよび監視します。
- **柔軟なグラフワークフロー**: 直感的なグラフベースのワークフローを使用して、複雑なエージェントの動作を設計します。
- **モジュラー機能システム**: コンポーザブルなアーキテクチャを通じてエージェントの機能をカスタマイズします。
- **スケーラブルなアーキテクチャ**: シンプルなチャットボットからエンタープライズアプリケーションまで、あらゆるワークロードを処理します。
- **マルチプラットフォーム**: Kotlin Multiplatformを使用して、JVM、JS、WasmJS、およびiOSターゲットでエージェントを実行します。

## 利用可能なLLMプロバイダーとプラットフォーム

エージェントの機能を強化するために使用できるLLMプロバイダーとプラットフォームは次のとおりです。

- Google
- OpenAI
- Anthropic
- DeepSeek
- OpenRouter
- Ollama
- Bedrock

これらのプロバイダーを専用のLLMクライアントで使用する方法の詳細については、[LLMクライアントでのプロンプトの実行](prompt-api.md#running-prompts-with-llm-clients)を参照してください。

## インストール

Koogを使用するには、ビルド構成に必要なすべての依存関係を含める必要があります。

### Gradle

#### Gradle (Kotlin DSL)

1. `build.gradle.kts`ファイルに依存関係を追加します。

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
    }
    ```

2. `mavenCentral()`がリポジトリのリストに含まれていることを確認してください。

#### Gradle (Groovy)

1. `build.gradle`ファイルに依存関係を追加します。

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
    }
    ```

2. `mavenCentral()`がリポジトリのリストに含まれていることを確認してください。

### Maven

1. `pom.xml`ファイルに依存関係を追加します。

    ```
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2. `mavenCentral`がリポジトリのリストに含まれていることを確認してください。

## クイックスタートの例

AIエージェントの利用を始めるのに役立つよう、シングルランエージェントの簡単な例を以下に示します。

!!! note
    例を実行する前に、対応するAPIキーを環境変数として割り当ててください。詳細については、[はじめに](single-run-agents.md)を参照してください。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY") // or Anthropic, Google, OpenRouter, etc.

        val agent = AIAgent(
            executor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```
<!--- KNIT example-index-01.kt -->
詳細については、[はじめに](single-run-agents.md)を参照してください。