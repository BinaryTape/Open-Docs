# 概要

Koogは、AIエージェントを完全にKotlinのイディオムに沿って構築および実行するために設計された、Kotlinベースのフレームワークです。
これにより、ツールと対話し、複雑なワークフローを処理し、ユーザーと通信できるエージェントを作成できます。

このフレームワークは、以下の種類のエージェントをサポートしています。

* 最小限の設定で単一の入力を処理し、応答を提供するシングルランエージェント。
  このタイプのエージェントは、ツール呼び出しの単一サイクル内で動作し、タスクを完了して応答を提供します。
* カスタム戦略と構成をサポートする高度な機能を備えた複雑なワークフローエージェント。

## 主な機能

Koogの主な機能は以下のとおりです。

-   **マルチプラットフォーム開発**: Kotlin Multiplatformを使用して、JVM、JS、WasmJS、Android、およびiOSターゲットにわたってエージェントをデプロイします。
-   **信頼性と耐障害性**: 組み込みのリトライ機能で障害を処理し、エージェント永続化機能を使用して、実行中の特定の時点でエージェントの状態を復元します。
-   **インテリジェントな履歴圧縮**: 高度な組み込み履歴圧縮技術を使用し、長時間の会話でコンテキストを維持しながらトークン使用量を最適化します。
-   **エンタープライズ対応の統合**: Spring BootやKtorなどの人気のJVMフレームワークとの統合を活用し、Koogをアプリケーションに組み込みます。
-   **OpenTelemetryエクスポーターによる可観測性 (Observability)**: 人気の可観測性プロバイダー (W&B Weave, Langfuse) に対する組み込みサポートにより、アプリケーションの監視とデバッグを行います。
-   **LLMの切り替えとシームレスな履歴適応**: 既存の会話履歴を失うことなく、いつでも別のLLMに切り替えたり、複数のLLMプロバイダー間でルーティングしたりできます。
-   **JVMおよびKotlinアプリケーションとの統合**: JVMおよびKotlin開発者向けに特別に設計された、イディオムに沿った型安全なKotlin DSLでAIエージェントを構築します。
-   **モデルコンテキストプロトコル (MCP) 統合**: AIエージェントでモデルコンテキストプロトコル (MCP) ツールを使用します。
-   **知識検索とメモリ**: ベクトル埋め込み、ランク付けされたドキュメントストレージ、および共有エージェントメモリを使用して、会話全体で知識を保持および検索します。
-   **強力なストリーミングAPI**: ストリーミングサポートと並行ツール呼び出しにより、リアルタイムで応答を処理します。
-   **モジュラー機能システム**: コンポーザブルなアーキテクチャを通じてエージェントの機能をカスタマイズします。
-   **柔軟なグラフワークフロー**: 直感的なグラフベースのワークフローを使用して、複雑なエージェントの動作を設計します。
-   **カスタムツール作成**: 外部システムやAPIにアクセスするツールでエージェントを拡張します。
-   **包括的なトレース**: 詳細で構成可能なトレースを使用して、エージェントの実行をデバッグおよび監視します。

## 利用可能なLLMプロバイダーとプラットフォーム

エージェントの機能を強化するために利用できるLLMプロバイダーとプラットフォームは次のとおりです。

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
            promptExecutor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
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