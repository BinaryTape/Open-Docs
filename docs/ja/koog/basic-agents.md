# 基本的なエージェント

`AIAgent`クラスは、KotlinアプリケーションでAIエージェントを作成するためのコアコンポーネントです。

最小限の設定でシンプルなエージェントを構築することも、カスタムのストラテジー、ツール、設定、およびカスタムの入力/出力タイプを定義することで、高度な機能を備えた洗練されたエージェントを作成することもできます。

このページでは、カスタマイズ可能なツールと設定を使用して、基本的なエージェントを作成するために必要な手順を説明します。

基本的なエージェントは、単一の入力を処理し、レスポンスを返します。
タスクを完了してレスポンスを提供するために、ツール呼び出し（tool-calling）の単一のサイクル内で動作します。
このエージェントは、メッセージまたはツール実行結果のいずれかを返すことができます。
ツール実行結果は、エージェントにツールレジストリ（tool registry）が提供されている場合に返されます。

実験用のシンプルなエージェントを構築することが目的であれば、作成時にプロンプトエグゼキュータ（prompt executor）とLLMのみを指定できます。
しかし、より高い柔軟性とカスタマイズ性が必要な場合は、オプションのパラメータを渡してエージェントを構成できます。
構成オプションの詳細については、[API reference](api:agents-core::ai.koog.agents.core.agent.AIAgent) を参照してください。

## 前提条件

- AIエージェントを実装するために使用するLLMプロバイダーの有効なAPIキーが必要です。利用可能なすべてのプロバイダーの一覧については、[LLM providers](llm-providers.md) を参照してください。

!!! tip
    APIキーの保存には、環境変数または安全な構成管理システムを使用してください。
    ソースコードにAPIキーを直接ハードコードすることは避けてください。

## 基本的なエージェントの作成

### 1. 依存関係を追加する

`AIAgent`機能を使用するには、ビルド構成に必要なすべての依存関係を含めます。

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

利用可能なすべてのインストール方法については、[Install Koog](getting-started.md#install-koog) を参照してください。

### 2. エージェントを作成する

エージェントを作成するには、`AIAgent`クラスのインスタンスを作成し、`promptExecutor`と`llmModel`パラメータを指定します。

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
<!--- KNIT example-basic-01.kt -->

### 3. システムプロンプトを追加する

システムプロンプトは、エージェントの動作を定義するために使用されます。プロンプトを指定するには、`systemPrompt`パラメータを使用します。

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
<!--- KNIT example-basic-02.kt -->

### 4. LLM出力を構成する

`temperature`パラメータを使用して、LLM出力生成の「temperature（温度）」を指定します。

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
<!--- KNIT example-basic-03.kt -->

### 5. ツールを追加する

エージェントは、特定のタスクを完了するためにツールを使用します。
必要に応じて、組み込みツールを使用するか、独自のカスタムツールを実装できます。

ツールを構成するには、エージェントが利用可能なツールを定義する `toolRegistry` パラメータを使用します。

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
<!--- KNIT example-basic-04.kt -->
この例では、`SayToUser` が組み込みツールです。カスタムツールの作成方法については、[Tools](tools-overview.md) を参照してください。

### 6. エージェントのイテレーションを調整する

`maxIterations`パラメータを使用して、エージェントが強制停止されるまでに実行できる最大ステップ数を指定します。

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
<!--- KNIT example-basic-05.kt -->

### 7. エージェント実行中のイベントを処理する

基本的なエージェントは、カスタムイベントハンドラーをサポートしています。
エージェントの作成にイベントハンドラーは必須ではありませんが、テスト、デバッグ、または連鎖的なエージェントインタラクションのフックを作成する際に役立つ場合があります。

エージェントのインタラクションを監視するための `EventHandler` 機能の使用方法の詳細については、[Event Handlers](agent-event-handlers.md) を参照してください。

### 8. エージェントを実行する

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
<!--- KNIT example-basic-06.kt -->

エージェントは以下の出力を生成します：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?