# 複雜工作流代理

除了基礎代理之外，`AIAgent` 類別還讓您能夠透過定義自訂策略、工具、配置以及自訂輸入/輸出型別，來建構處理複雜工作流的代理。

!!! tip
    如果您是 Koog 的新手並想建立最簡單的代理，請從 [基礎代理](basic-agents.md) 開始。

建立和配置此類代理的程式通常包括以下步驟：

1. 提供一個 prompt 執行器以與 LLM 進行通訊。
2. 定義一個控制代理工作流的策略。
3. 配置代理行為。
4. 實作供代理使用的工具。
5. 新增選用功能，例如事件處理、記憶體或執行緒（tracing）。
6. 使用使用者輸入執行代理。

## 前提條件

- 您擁有來自用於實作 AI 代理的 LLM 提供者的有效 API 金鑰。如需所有可用提供者的清單，請參閱 [LLM 提供者](llm-providers.md)。

!!! tip
    使用環境變數或安全的配置管理系統來儲存您的 API 金鑰。
    避免直接在原始碼中硬編碼 API 金鑰。

## 建立複雜工作流代理

### 1. 新增相依性

要使用 `AIAgent` 功能，請在您的組建組態中包含所有必要的相依性：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

如需所有可用的安裝方法，請參閱 [安裝 Koog](getting-started.md#install-koog)。

### 2. 提供一個 prompt 執行器

Prompt 執行器管理並執行 prompt。
您可以根據計畫使用的 LLM 提供者來選擇 prompt 執行器。
此外，您可以使用其中一個可用的 LLM 用戶端建立自訂 prompt 執行器。
若要了解更多，請參閱 [Prompt 執行器](prompts/prompt-executors.md)。

例如，要提供 OpenAI prompt 執行器，您需要呼叫 `simpleOpenAIExecutor` 函式，並為其提供與 OpenAI 服務進行驗證所需的 API 金鑰：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

要建立可與多個 LLM 提供者搭配使用的 prompt 執行器，請執行以下操作：

1) 使用對應的 API 金鑰為所需的 LLM 提供者配置用戶端。例如：
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
2) 將配置好的用戶端傳遞給 `MultiLLMPromptExecutor` 類別建構函式，以建立具有多個 LLM 提供者的 prompt 執行器：
<!--- INCLUDE
import ai.koog.agents.example.exampleComplexWorkflowAgents02.anthropicClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.googleClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.openAIClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-complex-workflow-agents-03.kt -->

### 3. 定義一個策略

策略透過使用節點（nodes）和邊（edges）來定義代理的工作流。它可以具有任意的輸入和輸出型別，
這些型別可以在 `strategy` 函式的泛型參數中指定。這些也將是 `AIAgent` 的輸入/輸出型別。
輸入和輸出的預設型別均為 `String`。

!!! tip
    若要了解更多關於策略的資訊，請參閱 [自訂策略圖](custom-strategy-graphs.md)

#### 3.1. 理解節點與邊

節點與邊是策略的建構區塊。

節點代表代理策略中的處理步驟。

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
    // 處理輸入並回傳輸出
    // 您可以使用 llm.writeSession 與 LLM 互動
    // 您可以使用 callTool、callToolRaw 等呼叫工具
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->

!!! tip
    在您的代理策略中也可以使用預定義的節點。若要了解更多，請參閱 [預定義節點與元件](nodes-and-components.md)。

邊定義了節點之間的連接。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // 處理輸入並回傳輸出
        // 您可以使用 llm.writeSession 與 LLM 互動
        // 您可以使用 callTool、callToolRaw 等呼叫工具
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // 處理輸入並回傳輸出
        // 您可以使用 llm.writeSession 與 LLM 互動
        // 您可以使用 callTool、callToolRaw 等呼叫工具
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 基礎邊
edge(sourceNode forwardTo targetNode)

// 帶條件的邊
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 回傳 true 以遵循此邊，回傳 false 則跳過
    output.contains("specific text")
})

// 帶轉換的邊
edge(sourceNode forwardTo targetNode transformed { output ->
    // 在將輸出傳遞給目標節點之前對其進行轉換
    "Modified: $output"
})

// 組合條件與轉換
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->

#### 3.2. 實作策略

要實作代理策略，請呼叫 `strategy` 函式並定義節點與邊。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 為策略定義節點
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定義節點之間的邊
    // 開始 -> 傳送輸入
    edge(nodeStart forwardTo nodeSendInput)

    // 傳送輸入 -> 完成
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 傳送輸入 -> 執行工具
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 執行工具 -> 傳送工具結果
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 傳送工具結果 -> 完成
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 函式讓您可以定義多個子圖，每個子圖包含自己的一組節點與邊。
    與使用簡化的策略建置器相比，這種方法提供了更多的靈活性和功能。
    若要了解更多關於子圖的資訊，請參閱 [子圖](subgraphs-overview.md)。

### 4. 配置代理

使用配置定義代理行為：
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

對於更進階的配置，您可以指定代理將使用的 LLM，並設定代理為回應可以執行的最大反覆運算次數：
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

### 5. 實作工具並設定工具註冊表

工具讓您的代理執行特定任務。
要使工具可供代理使用，請將其新增至工具註冊表（tool registry）。
例如：
<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 實作一個可以加總兩個數字的簡單計算機工具
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

// 將工具新增至工具註冊表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

若要了解更多關於工具的資訊，請參閱 [工具](tools-overview.md)。

### 6. 安裝功能

功能（Features）讓您可以為代理新增能力、修改其行為、提供對外部系統和資源的存取權，
以及在代理執行時記錄與監控事件。
以下是可用的功能：

- EventHandler
- AgentMemory
- Tracing（執行緒）

要安裝功能，請呼叫 `install` 函式並提供該功能作為參數。
例如，要安裝事件處理器（EventHandler）功能，您需要執行以下操作：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// 安裝 EventHandler 功能
installFeatures = {
    install(EventHandler) {
        onAgentStarting { eventContext: AgentStartingContext ->
            println("Starting agent: ${eventContext.agent.id}")
        }
        onAgentCompleted { eventContext: AgentCompletedContext ->
            println("Result: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

若要了解更多關於功能配置的資訊，請參閱專用頁面。

### 7. 執行代理

使用在先前階段建立的配置選項來建立代理，並使用提供的輸入執行它：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
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
            onAgentStarting { eventContext: AgentStartingContext ->
                println("Starting agent: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("Result: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

        // 讀取使用者輸入並傳送給代理
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("The agent returned: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 處理結構化資料

`AIAgent` 可以處理來自 LLM 輸出的結構化資料。如需更多詳細資訊，請參閱 [結構化資料處理](structured-output.md)。

## 使用並行工具呼叫

`AIAgent` 支援並行工具呼叫。此功能讓您可以同時處理多個工具，提高獨立操作的效能。

如需更多詳細資訊，請參閱 [並行工具呼叫](tools-overview.md#parallel-tool-calls)。

## 完整程式碼範例

這裡是代理的完整實作：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
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
// 使用具有來自環境變數的 API 金鑰之 OpenAI 執行器
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 建立一個簡單策略
val agentStrategy = strategy("Simple calculator") {
    // 為策略定義節點
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定義節點之間的邊
    // 開始 -> 傳送輸入
    edge(nodeStart forwardTo nodeSendInput)

    // 傳送輸入 -> 完成
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 傳送輸入 -> 執行工具
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 執行工具 -> 傳送工具結果
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 傳送工具結果 -> 完成
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// 配置代理
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

// 實作一個可以加總兩個數字的簡單計算機工具
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

// 將工具新增至工具註冊表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 建立代理
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("Starting agent: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("Result: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

        // 讀取使用者輸入並傳送給代理
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("The agent returned: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->