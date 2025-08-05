# 複雜工作流程代理程式

除了單次執行代理程式外，`AIAgent` 類別還允許您透過定義自訂策略、工具和設定來建構處理複雜工作流程的代理程式。

建立和配置此類代理程式的過程通常包括以下步驟：

1. 提供提示執行器以與 LLM 溝通。
2. 定義控制代理程式工作流程的策略。
3. 配置代理程式行為。
4. 實作供代理程式使用的工具。
5. 新增事件處理、記憶體或追蹤等可選功能。
6. 使用者輸入執行代理程式。

## 先決條件

- 您擁有來自用於實作 AI 代理程式的 LLM 提供者的有效 API 金鑰。有關所有可用提供者的列表，請參閱 [概述](index.md)。

!!! tip
    使用環境變數或安全的組態管理系統來儲存您的 API 金鑰。
    避免直接在原始碼中硬編碼 API 金鑰。

## 建立單次執行代理程式

### 1. 新增依賴項

若要使用 `AIAgent` 功能，請在您的建置設定中包含所有必要的依賴項：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

有關所有可用安裝方法，請參閱 [安裝](index.md#installation)。

### 2. 提供提示執行器

提示執行器管理並執行提示。
您可以根據計畫使用的 LLM 提供者選擇提示執行器。
此外，您可以使用其中一個可用的 LLM 用戶端建立自訂提示執行器。
若要了解更多資訊，請參閱 [提示執行器](prompt-api.md#prompt-executors)。

例如，若要提供 OpenAI 提示執行器，您需要呼叫 `simpleOpenAIExecutor` 函數並為其提供與 OpenAI 服務進行驗證所需的 API 金鑰：

```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```

若要建立一個可與多個 LLM 提供者配合使用的提示執行器，請執行以下操作：

1. 使用相應的 API 金鑰為所需的 LLM 提供者配置用戶端。例如：
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2. 將配置好的用戶端傳遞給 `DefaultMultiLLMPromptExecutor` 類別建構函數，以建立具有多個 LLM 提供者的提示執行器：
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```

### 3. 定義策略

策略使用節點與邊緣定義代理程式的工作流程。

#### 3.1. 理解節點與邊

節點與邊是策略的構成要素。

節點代表代理程式策略中的處理步驟。

```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 處理輸入並回傳輸出
    // 您可以使用 llm.writeSession 與 LLM 互動
    // 您可以使用 callTool、callToolRaw 等呼叫工具
    transformedOutput
}
```
!!! tip
    還有一些預定義節點可以在您的代理程式策略中使用。若要了解更多資訊，請參閱 [預定義節點和元件](nodes-and-components.md)。

邊緣定義了節點之間的連接。

```kotlin
// 基本邊緣
edge(sourceNode forwardTo targetNode)

// 帶條件的邊緣
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 回傳 true 以跟隨此邊緣，false 則跳過它
    output.contains("specific text")
})

// 帶轉換的邊緣
edge(sourceNode forwardTo targetNode transformed { output ->
    // 在將輸出傳遞給目標節點之前對其進行轉換
    "Modified: $output"
})

// 結合條件和轉換
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
#### 3.2. 實作策略

若要實作代理程式策略，請呼叫 `strategy` 函數並定義節點與邊。例如：

```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 定義策略的節點
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定義節點之間的邊緣
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
!!! tip
    `strategy` 函數允許您定義多個子圖，每個子圖包含其自身的節點和邊集。
    與使用簡化策略建構器相比，此方法提供了更大的靈活性和功能。
    若要了解有關子圖的更多資訊，請參閱 [子圖](subgraphs-overview.md)。

### 4. 配置代理程式

使用設定來定義代理程式行為：

```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        您是一個簡單的計算機助手。
        您可以使用計算機工具將兩個數字相加。
        當使用者提供輸入時，提取他們想要相加的數字。
        輸入格式可能多樣，例如「add 5 and 7」、「5 + 7」或僅「5 7」。
        提取這兩個數字並使用計算機工具將它們相加。
        始終以清晰友好的訊息回應，顯示計算和結果。
        """.trimIndent()
)
```

對於進階設定，您可以指定代理程式將使用的 LLM 並設定代理程式可執行回應的最大迭代次數：

```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                您是一個簡單的計算機助手。
                您可以使用計算機工具將兩個數字相加。
                當使用者提供輸入時，提取他們想要相加的數字。
                輸入格式可能多樣，例如「add 5 and 7」、「5 + 7」或僅「5 7」。
                提取這兩個數字並使用計算機工具將它們相加。
                始終以清晰友好的訊息回應，顯示計算和結果。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```

### 5. 實作工具並設定工具註冊中心

工具讓您的代理程式能夠執行特定任務。
若要讓工具可供代理程式使用，請將其新增到工具註冊中心。
例如：

```kotlin
// 實作一個可以將兩個數字相加的簡單計算機工具
@LLMDescription("用於執行基本算術運算的工具")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("將兩個數字相加並回傳它們的和")
    fun add(
        @LLMDescription("要相加的第一個數字（整數值）")
        num1: Int,

        @LLMDescription("要相加的第二個數字（整數值）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 將工具新增到工具註冊中心
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```

若要了解有關工具的更多資訊，請參閱 [工具](tools-overview.md)。

### 6. 安裝功能

功能讓您可以為代理程式新增新功能、修改其行為、提供對外部系統和資源的存取，
並在代理程式執行時記錄和監控事件。
提供以下功能：

- EventHandler
- AgentMemory
- Tracing

若要安裝該功能，請呼叫 `install` 函數並將該功能作為引數提供。
例如，若要安裝事件處理器功能，您需要執行以下操作：

```kotlin
installFeatures = {
    // 安裝 EventHandler 功能
    install(EventHandler) {
        onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
            println("正在啟動策略：${strategy.name}")
        }
        onAgentFinished { strategyName: String, result: String? ->
            println("結果：$result")
        }
    }
}
```

若要了解有關功能設定的更多資訊，請參閱專用頁面。

### 7. 執行代理程式

使用先前階段建立的設定選項建立代理程式，並使用提供的輸入執行它：

```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted = { strategy: AIAgentStrategy, agent: AIAgent ->
                println("正在啟動策略：${strategy.name}")
            }
            onAgentFinished = { strategyName: String, result: String? ->
                println("結果：$result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("請輸入要相加的兩個數字 (例如：'add 5 and 7' 或 '5 + 7')：")

    // 讀取使用者輸入並將其傳送給代理程式
    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}
```

## 使用結構化資料

`AIAgent` 可以處理來自 LLM 輸出的結構化資料。有關更多詳細資訊，請參閱 [Streaming API](streaming-api.md)。

## 使用平行工具呼叫

`AIAgent` 支援平行工具呼叫。此功能允許您同時處理多個工具，從而提高獨立操作的效能。

有關更多詳細資訊，請參閱 [平行工具呼叫](tools-overview.md#parallel-tool-calls)。

## 完整程式碼範例

以下是代理程式的完整實作：

```kotlin
// 使用帶有環境變數中 API 金鑰的 OpenAI 執行器
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 建立一個簡單的策略
val agentStrategy = strategy("Simple calculator") {
    // 定義策略的節點
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定義節點之間的邊緣
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

// 配置代理程式
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                您是一個簡單的計算機助手。
                您可以使用計算機工具將兩個數字相加。
                當使用者提供輸入時，提取他們想要相加的數字。
                輸入格式可能多樣，例如「add 5 and 7」、「5 + 7」或僅「5 7」。
                提取這兩個數字並使用計算機工具將它們相加。
                始終以清晰友好的訊息回應，顯示計算和結果。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 實作一個可以將兩個數字相加的簡單計算機工具
@LLMDescription("用於執行基本算術運算的工具")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("將兩個數字相加並回傳它們的和")
    fun add(
        @LLMDescription("要相加的第一個數字（整數值）")
        num1: Int,

        @LLMDescription("要相加的第二個數字（整數值）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 將工具新增到工具註冊中心
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 建立代理程式
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        // 安裝 EventHandler 功能
        install(EventHandler) {
            onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
                println("正在啟動策略：${strategy.name}")
            }
            onAgentFinished { strategyName: String, result: String? ->
                println("結果：$result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("請輸入要相加的兩個數字 (例如：'add 5 and 7' 或 '5 + 7')：")

    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}
```