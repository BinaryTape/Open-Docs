# シングルランエージェント

`AIAgent`クラスは、KotlinアプリケーションでAIエージェントを作成するためのコアコンポーネントです。

最小限の構成でシンプルなエージェントを構築することも、カスタム戦略、ツール、構成、およびカスタム入出力タイプを定義することで、高度な機能を備えた洗練されたエージェントを作成することもできます。

このページでは、カスタマイズ可能なツールと構成を備えたシングルランエージェントを作成するために必要な手順を説明します。

シングルランエージェントは、単一の入力を処理し、応答を提供します。
そのタスクを完了し、応答を提供するために、ツール呼び出しの単一サイクル内で動作します。
このエージェントは、メッセージまたはツール結果のいずれかを返すことができます。
ツールレジストリがエージェントに提供された場合、ツール結果が返されます。

もし実験するためにシンプルなエージェントを構築することが目的であれば、エージェントを作成する際にプロンプトエクゼキューターとLLMのみを提供すれば十分です。
しかし、より柔軟性とカスタマイズ性を求める場合は、オプションのパラメータを渡してエージェントを構成できます。
構成オプションの詳細については、[API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)を参照してください。

## 前提条件

- AIエージェントの実装に使用するLLMプロバイダーの有効なAPIキーを持っていること。利用可能なすべてのプロバイダーのリストについては、[Overview](index.md)を参照してください。

!!! tip
    APIキーを保存するには、環境変数または安全な構成管理システムを使用してください。
    APIキーをソースコードに直接ハードコードすることは避けてください。

## シングルランエージェントの作成

### 1. 依存関係の追加

`AIAgent`機能を使用するには、必要なすべての依存関係をビルド構成に含めます。

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    // Ktorクライアントの依存関係を明示的に含める
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

利用可能なすべてのインストール方法については、[Installation](index.md#installation)を参照してください。

### 2. エージェントの作成

エージェントを作成するには、`AIAgent`クラスのインスタンスを作成し、`promptExecutor`および`llmModel`パラメータを指定します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-single-run-01.kt -->

### 3. システムプロンプトの追加

システムプロンプトは、エージェントの動作を定義するために使用されます。プロンプトを提供するには、`systemPrompt`パラメータを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-single-run-02.kt -->

### 4. LLM出力の構成

`temperature`パラメータを使用して、LLM出力生成の温度を指定します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```
<!--- KNIT example-single-run-03.kt -->

### 5. ツールの追加

エージェントは特定のタスクを完了するためにツールを使用します。
組み込みツールを使用することも、必要に応じて独自のカスタムツールを実装することもできます。

ツールを構成するには、エージェントが利用できるツールを定義する`toolRegistry`パラメータを使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    }
)
```
<!--- KNIT example-single-run-04.kt -->
この例では、`SayToUser`は組み込みツールです。カスタムツールの作成方法については、[Tools](tools-overview.md)を参照してください。

### 6. エージェントのイテレーションの調整

エージェントが停止を余儀なくされるまでに実行できる最大ステップ数を、`maxIterations`パラメータを使用して指定します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 30
)
```
<!--- KNIT example-single-run-05.kt -->

### 7. エージェント実行時のイベント処理

シングルランエージェントはカスタムイベントハンドラをサポートしています。
イベントハンドラの使用はエージェントの作成に必須ではありませんが、テスト、デバッグ、または連鎖的なエージェントのインタラクションのためのフックを作成するのに役立つ場合があります。

エージェントのインタラクションを監視するための`EventHandler`機能の使用方法の詳細については、[Event Handlers](agent-event-handlers.md)を参照してください。

### 8. エージェントの実行

エージェントを実行するには、`run()`関数を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 100
)

fun main() = runBlocking {
    val result = agent.run("Hello! How can you help me?")
}
```
<!--- KNIT example-single-run-06.kt -->

エージェントは次の出力を生成します。

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?