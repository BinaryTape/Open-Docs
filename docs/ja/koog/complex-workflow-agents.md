# 複雑なワークフローエージェント

単一実行エージェントに加え、`AIAgent` クラスを使用すると、カスタム戦略、ツール、構成、およびカスタム入出力タイプを定義することで、複雑なワークフローを処理するエージェントを構築できます。

このようなエージェントを作成および構成するプロセスには、通常、以下の手順が含まれます。

1.  LLMと通信するためのプロンプトエグゼキュータを提供します。
2.  エージェントのワークフローを制御する戦略を定義します。
3.  エージェントの動作を構成します。
4.  エージェントが使用するツールを実装します。
5.  イベント処理、メモリ、トレーシングなどのオプション機能を追加します。
6.  ユーザー入力でエージェントを実行します。

## 前提条件

-   AIエージェントの実装に使用するLLMプロバイダーから有効なAPIキーを持っていること。利用可能なすべてのプロバイダーのリストについては、「[概要](index.md)」を参照してください。

!!! tip
    APIキーは環境変数または安全な構成管理システムを使用して保存してください。
    ソースコードにAPIキーを直接ハードコーディングすることは避けてください。

## 単一実行エージェントの作成

### 1. 依存関係の追加

`AIAgent` の機能を使用するには、必要なすべての依存関係をビルド構成に含めます。

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

利用可能なすべてのインストール方法については、「[インストール](index.md#installation)」を参照してください。

### 2. プロンプトエグゼキュータの提供

プロンプトエグゼキュータは、プロンプトを管理し実行します。
使用する予定のLLMプロバイダーに基づいてプロンプトエグゼキュータを選択できます。
また、利用可能なLLMクライアントのいずれかを使用してカスタムプロンプトエグゼキュータを作成することもできます。
詳細については、「[プロンプトエグゼキュータ](prompt-api.md#prompt-executors)」を参照してください。

たとえば、OpenAIプロンプトエグゼキュータを提供するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスでの認証に必要なAPIキーを渡す必要があります。

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

複数のLLMプロバイダーで動作するプロンプトエグゼキュータを作成するには、以下を実行します。

1.  必要なLLMプロバイダーのクライアントを、対応するAPIキーで構成します。たとえば、
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-complex-workflow-agents-02.kt -->
2.  構成されたクライアントを `DefaultMultiLLMPromptExecutor` クラスのコンストラクタに渡して、複数のLLMプロバイダーを持つプロンプトエグゼキュータを作成します。
<!--- INCLUDE
import ai.koog.agents.example.exampleComplexWorkflowAgents02.anthropicClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.googleClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.openAIClient
import ai.koog.prompt.executor.llms.all.DefaultMultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-complex-workflow-agents-03.kt -->

### 3. 戦略の定義

戦略は、ノードとエッジを使用してエージェントのワークフローを定義します。戦略関数ジェネリックパラメータで任意の入出力型を指定でき、これらは`AIAgent`の入出力型にもなります。入出力のデフォルト型は`String`です。

!!! tip
    戦略の詳細については、「[カスタム戦略グラフ](custom-strategy-graphs.md)」を参照してください。

#### 3.1. ノードとエッジを理解する

ノードとエッジは、戦略の構成要素です。

ノードは、エージェント戦略における処理ステップを表します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
class InputType

class OutputType

val transformedOutput = OutputType()
val strategy = strategy<InputType, OutputType>("Simple calculator") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 入力を処理して出力を返す
    // llm.writeSession を使用してLLMと対話できます
    // callTool、callToolRaw などを使用してツールを呼び出すことができます
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->
!!! tip
    エージェント戦略で使用できる事前定義されたノードもあります。詳細については、「[事前定義されたノードとコンポーネント](nodes-and-components.md)」を参照してください。

エッジはノード間の接続を定義します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // Process the input and return an output
        // You can use llm.writeSession to interact with the LLM
        // You can call tools using callTool, callToolRaw, etc.
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // Process the input and return an output
        // You can use llm.writeSession to interact with the LLM
        // You can call tools using callTool, callToolRaw, etc.
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 基本エッジ
edge(sourceNode forwardTo targetNode)

// 条件付きエッジ
edge(sourceNode forwardTo targetNode onCondition { output ->
    // このエッジをたどるには true を返し、スキップするには false を返します
    output.contains("specific text")
})

// 変換付きエッジ
edge(sourceNode forwardTo targetNode transformed { output ->
    // 出力をターゲットノードに渡す前に変換します
    "Modified: $output"
})

// 条件と変換の組み合わせ
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->
#### 3.2. 戦略の実装

エージェント戦略を実装するには、`strategy` 関数を呼び出してノードとエッジを定義します。たとえば、

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 戦略のノードを定義する
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義する
    // 開始 -> 入力送信
    edge(nodeStart forwardTo nodeSendInput)

    // 入力送信 -> 終了
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 入力送信 -> ツール実行
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // ツール実行 -> ツール結果送信
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // ツール結果送信 -> 終了
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 関数を使用すると、それぞれ独自のノードとエッジのセットを含む複数のサブグラフを定義できます。
    このアプローチは、簡易化された戦略ビルダーを使用するよりも、より高い柔軟性と機能性を提供します。
    サブグラフの詳細については、「[サブグラフ](subgraphs-overview.md)」を参照してください。

### 4. エージェントの構成

構成でエージェントの動作を定義します。
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
-->
```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        You are a simple calculator assistant.
        You can add two numbers together using the calculator tool.
        When the user provides input, extract the numbers they want to add.
        The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
        Extract the two numbers and use the calculator tool to add them.
        Always respond with a clear, friendly message showing the calculation and result.
        """.trimIndent()
)
```
<!--- KNIT example-complex-workflow-agents-07.kt -->

より高度な構成として、エージェントが使用するLLMを指定したり、エージェントが応答のために実行できる最大イテレーション数を設定したりできます。
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```
<!--- KNIT example-complex-workflow-agents-08.kt -->

### 5. ツールの実装とツールレジストリの設定

ツールを使用すると、エージェントが特定のタスクを実行できるようになります。
エージェントがツールを利用できるようにするには、それをツールレジストリに追加します。
たとえば、

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 2つの数値を加算できるシンプルな電卓ツールを実装する
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// ツールをツールレジストリに追加する
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

ツールの詳細については、「[ツール](tools-overview.md)」を参照してください。

### 6. 機能のインストール

機能を使用すると、エージェントに新しい機能を追加したり、その動作を変更したり、外部システムやリソースへのアクセスを提供したり、エージェントの実行中にイベントをログに記録および監視したりできます。
以下の機能が利用可能です。

-   EventHandler
-   AgentMemory
-   Tracing

機能をインストールするには、`install` 関数を呼び出し、引数としてその機能を提供します。
たとえば、イベントハンドラー機能をインストールするには、以下を実行する必要があります。
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.AgentFinishedContext
import ai.koog.agents.core.feature.handler.AgentStartContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// EventHandler 機能をインストールする
installFeatures = {
    install(EventHandler) {
        onBeforeAgentStarted { eventContext: AgentStartContext<*> ->
            println("戦略の開始: ${eventContext.strategy.name}")
        }
        onAgentFinished { eventContext: AgentFinishedContext ->
            println("結果: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

機能の構成の詳細については、専用ページを参照してください。

### 7. エージェントの実行

前の段階で作成した構成オプションでエージェントを作成し、提供された入力で実行します。
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.AgentFinishedContext
import ai.koog.agents.core.feature.handler.AgentStartContext
import ai.koog.agents.example.exampleComplexWorkflowAgents01.promptExecutor
import ai.koog.agents.example.exampleComplexWorkflowAgents06.agentStrategy
import ai.koog.agents.example.exampleComplexWorkflowAgents07.agentConfig
import ai.koog.agents.example.exampleComplexWorkflowAgents09.toolRegistry
import ai.koog.agents.features.eventHandler.feature.EventHandler
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted { eventContext: AgentStartContext<*> ->
                println("戦略の開始: ${eventContext.strategy.name}")
            }
            onAgentFinished { eventContext: AgentFinishedContext ->
                println("結果: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("2つの数値を入力して追加してください（例：「add 5 and 7」または「5 + 7」）：")

        // ユーザー入力を読み取り、エージェントに送信します
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("エージェントが返した内容: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 構造化データの操作

`AIAgent` はLLM出力からの構造化データを処理できます。詳細については、「[構造化データの処理](structured-data.md)」を参照してください。

## 並列ツール呼び出しの使用

`AIAgent` は並列ツール呼び出しをサポートしています。この機能により、複数のツールを同時に処理できるようになり、独立した操作のパフォーマンスが向上します。

詳細については、「[並列ツール呼び出し](tools-overview.md#parallel-tool-calls)」を参照してください。

## 完全なコードサンプル

エージェントの完全な実装を以下に示します。
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.feature.handler.AgentFinishedContext
import ai.koog.agents.core.feature.handler.AgentStartContext
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

-->
```kotlin
// 環境変数からのAPIキーを使用してOpenAIエグゼキュータを使用する
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// シンプルな戦略を作成する
val agentStrategy = strategy("Simple calculator") {
    // 戦略のノードを定義する
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義する
    // 開始 -> 入力送信
    edge(nodeStart forwardTo nodeSendInput)

    // 入力送信 -> 終了
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 入力送信 -> ツール実行
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // ツール実行 -> ツール結果送信
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // ツール結果送信 -> 終了
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// エージェントを構成する
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 2つの数値を加算できるシンプルな電卓ツールを実装する
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// ツールをツールレジストリに追加する
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// エージェントを作成する
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted { eventContext: AgentStartContext<*> ->
                println("戦略の開始: ${eventContext.strategy.name}")
            }
            onAgentFinished { eventContext: AgentFinishedContext ->
                println("結果: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("2つの数値を入力して追加してください（例：「add 5 and 7」または「5 + 7」）：")

        // ユーザー入力を読み取り、エージェントに送信します
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("エージェントが返した内容: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->