# 測試

## 總覽

測試功能為 Koog 框架中的 AI 代理管道、子圖和工具互動提供了全面的測試框架。它使開發人員能夠使用模擬 LLM (大型語言模型) 執行器、工具註冊表和代理環境來建立受控的測試環境。

### 目的

此功能的主要目的是透過以下方式促進基於代理的 AI 功能的測試：

- 模擬 LLM 對特定提示的回應
- 模擬工具呼叫及其結果
- 測試代理管道子圖及其結構
- 驗證資料在代理節點中是否正確流動
- 為預期行為提供斷言

## 配置與初始化

### 設定測試依賴

在設定測試環境之前，請確保已新增以下依賴：
<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
// build.gradle.kts
dependencies {
   testImplementation("ai.koog:agents-test:LATEST_VERSION")
   testImplementation(kotlin("test"))
}
```
<!--- KNIT example-testing-01.kt -->
### 模擬 LLM 回應

測試的基本形式涉及模擬 LLM 回應以確保確定性行為。您可以使用 `MockLLMBuilder` 和相關實用程式來執行此操作。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.testing.tools.getMockExecutor

val toolRegistry = ToolRegistry {}

-->
```kotlin
// 建立模擬 LLM 執行器
val mockLLMApi = getMockExecutor(toolRegistry) {
  // 模擬簡單的文字回應
  mockLLMAnswer("Hello!") onRequestContains "Hello"

  // 模擬預設回應
  mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
}
```
<!--- KNIT example-testing-02.kt -->

### 模擬工具呼叫

您可以根據輸入模式模擬 LLM 呼叫特定的工具：
<!--- INCLUDE
import ai.koog.agents.core.tools.*
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.testing.tools.getMockExecutor
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

public object CreateTool : Tool<CreateTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val message: String
    )

    override suspend fun execute(args: Args): String = args.message
}

public object SearchTool : Tool<SearchTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String
    )

    override suspend fun execute(args: Args): String = args.query
}

public object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String
    )

    override suspend fun execute(args: Args): String = args.query
}

typealias PositiveToneTool = SayToUser
typealias NegativeToneTool = SayToUser

val mockLLMApi = getMockExecutor {
-->
<!--- SUFFIX
}
-->
```kotlin
// 模擬工具呼叫回應
mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

// 模擬工具行為 - 最簡單的形式，不使用 lambda
mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

// 當您需要執行額外動作時使用 lambda
mockTool(NegativeToneTool) alwaysTells {
  // 執行額外動作
  println("Negative tone tool called")

  // 返回結果
  "The text has a negative tone."
}

// 根據特定參數模擬工具行為
mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

// 根據條件式參數匹配模擬工具行為
mockTool(SearchTool) returns "Found results" onArgumentsMatching { args ->
  args.query.contains("important")
}
```
<!--- KNIT example-testing-03.kt -->

上述範例展示了模擬工具的不同方式，從簡單到複雜：

1.  `alwaysReturns`: 最簡單的形式，直接返回一個值，不使用 lambda。
2.  `alwaysTells`: 當您需要執行額外動作時使用 lambda。
3.  `returns...onArguments`: 為精確的參數匹配返回特定結果。
4.  `returns...onArgumentsMatching`: 根據自訂參數條件返回結果。

### 啟用測試模式

要在代理上啟用測試模式，請在 `AIAgent` 建構函式區塊內使用 `withTesting()` 函數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.withTesting
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

// 建立啟用測試的代理
fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// 建立啟用測試的代理
AIAgent(
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    llmModel = llmModel
) {
    // 啟用測試模式
    withTesting()
}
```
<!--- KNIT example-testing-04.kt -->

## 進階測試

### 測試圖結構

在測試詳細的節點行為和邊緣連接之前，驗證代理圖的整體結構很重要。這包括檢查所有所需的節點是否存在並在預期的子圖中正確連接。

測試功能提供了一種全面的方式來測試代理的圖結構。這種方法對於具有多個子圖和相互連接節點的複雜代理特別有價值。

#### 基本結構測試

首先驗證代理圖的基本結構：

<!--- INCLUDE

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

-->
<!--- SUFFIX
}
-->
```kotlin
AIAgent(
    // 建構函式參數
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    llmModel = llmModel
) {
    testGraph<String, String>("test") {
        val firstSubgraph = assertSubgraphByName<String, String>("first")
        val secondSubgraph = assertSubgraphByName<String, String>("second")

        // 斷言子圖連接
        assertEdges {
            startNode() alwaysGoesTo firstSubgraph
            firstSubgraph alwaysGoesTo secondSubgraph
            secondSubgraph alwaysGoesTo finishNode()
        }

        // 驗證第一個子圖
        verifySubgraph(firstSubgraph) {
            val start = startNode()
            val finish = finishNode()

            // 斷言節點名稱
            val askLLM = assertNodeByName<String, Message.Response>("callLLM")
            val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")

            // 斷言節點可達性
            assertReachable(start, askLLM)
            assertReachable(askLLM, callTool)
        }
    }
}
```
<!--- KNIT example-testing-05.kt -->

### 測試節點行為

節點行為測試可讓您驗證代理圖中的節點是否為給定輸入產生預期的輸出。這對於確保代理的邏輯在不同情境下正確運作至關重要。

#### 基本節點測試

從單個節點的簡單輸入和輸出驗證開始：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {

    // 測試基本文字回應
    askLLM withInput "Hello" outputs assistantMessage("Hello!")

    // 測試工具呼叫回應
    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))
}
```
<!--- KNIT example-testing-06.kt -->

上面的範例展示了如何測試以下行為：
1. 當 LLM 節點收到 `Hello` 作為輸入時，它會回應一個簡單的文字訊息。
2. 當它收到 `Solve task` 時，它會回應一個工具呼叫。

#### 測試執行工具的節點

您也可以測試執行工具的節點：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription

object SolveTool : SimpleTool<SolveTool.Args>(
    argsSerializer = Args.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {
    @Serializable
    data class Args(
        @property:LLMDescription("Message from the agent")
        val message: String
    )

    override suspend fun execute(args: Args): String {
        return args.message
    }
}

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 測試帶有特定參數的工具執行
    callTool withInput toolCallMessage(
        SolveTool,
        SolveTool.Args("solve")
    ) outputs toolResult(SolveTool, SolveTool.Args("solve"), "solved")
}
```
<!--- KNIT example-testing-07.kt -->

這會驗證當工具執行節點收到特定的工具呼叫簽名時，它會產生預期的工具結果。

#### 進階節點測試

對於更複雜的情境，您可以測試具有結構化輸入和輸出的節點：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {

    @Serializable
    data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String,
        val depth: Int
    )

    override suspend fun execute(args: Args): String = args.query
}

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 測試對同一節點的不同輸入
    askLLM withInput "Simple query" outputs assistantMessage("Simple response")

    // 測試帶有複雜參數
    askLLM withInput "Complex query with parameters" outputs toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3)
    )
}
```
<!--- KNIT example-testing-08.kt -->

您也可以測試具有詳細結果結構的複雜工具呼叫情境：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

object AnalyzeTool : Tool<AnalyzeTool.Args, AnalyzeTool.Result>(
    argsSerializer = Args.serializer(),
    resultSerializer = Result.serializer(),
    name = "message",
    description = "Service tool, used by the agent to talk with user"
) {
    @Serializable
    data class Args(
        val query: String,
        val depth: Int
    )

    @Serializable
    data class Result(
        val analysis: String,
        val confidence: Double,
        val metadata: Map<String, String> = mapOf()
    )

    override suspend fun execute(args: Args): Result {
        return Result(
            args.query, 0.95,
            mapOf("source" to "mock", "timestamp" to "2023-06-15")
        )
    }
}

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 測試具有結構化結果的複雜工具呼叫
    callTool withInput toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "complex", depth = 5)
    ) outputs toolResult(AnalyzeTool, AnalyzeTool.Args(query = "complex", depth = 5), AnalyzeTool.Result(
        analysis = "Detailed analysis",
        confidence = 0.95,
        metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
    ))
}
```
<!--- KNIT example-testing-09.kt -->

這些進階測試有助於確保您的節點正確處理複雜的資料結構，這對於複雜的代理行為至關重要。

### 測試邊緣連接

邊緣連接測試可讓您驗證代理的圖是否正確地將輸出從一個節點路由到適當的下一個節點。這確保您的代理根據不同的輸出遵循預期的工作流程路徑。

#### 基本邊緣測試

從簡單的邊緣連接測試開始：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val giveFeedback = assertNodeByName<String, Message.Response>("giveFeedback")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 測試文字訊息路由
    askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

    // 測試工具呼叫路由
    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
}
```
<!--- KNIT example-testing-10.kt -->

此範例驗證了以下行為：
1. 當 LLM 節點輸出簡單的文字訊息時，流程會導向 `giveFeedback` 節點。
2. 當它輸出工具呼叫時，流程會導向 `callTool` 節點。

#### 測試條件式路由

您可以根據輸出的內容測試更複雜的路由邏輯：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val askForInfo = assertNodeByName<String, ReceivedToolResult>("askForInfo")
                val processRequest = assertNodeByName<String, Message.Response>("processRequest")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 不同的文字回應可以路由到不同的節點
    askLLM withOutput assistantMessage("Need more information") goesTo askForInfo
    askLLM withOutput assistantMessage("Ready to proceed") goesTo processRequest
}
```
<!--- KNIT example-testing-11.kt -->

#### 進階邊緣測試

對於複雜的代理，您可以根據工具結果中的結構化資料測試條件式路由：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val processResult = assertNodeByName<String, Message.Response>("processResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 根據工具結果內容測試路由
    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
    ) goesTo processResult
}
```
<!--- KNIT example-testing-12.kt -->

您也可以根據不同的結果屬性測試複雜的決策路徑：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val finish = assertNodeByName<String, Message.Response>("finish")
                val verifyResult = assertNodeByName<String, Message.Response>("verifyResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 根據信心水準路由到不同節點
    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Complete", confidence = 0.9)
    ) goesTo finish

    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Uncertain", confidence = 0.3)
    ) goesTo verifyResult
}
```
<!--- KNIT example-testing-13.kt -->

這些進階邊緣測試有助於確保您的代理根據節點輸出的內容和結構做出正確的決策，這對於建立智慧、上下文感知的工作流程至關重要。

## 完整測試範例

這是一個展示完整測試情境的用戶故事：

您正在開發一個語氣分析代理，用於分析文字的語氣並提供回饋。該代理使用工具來偵測正面、負面和中性語氣。

您可以這樣測試此代理：

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
@Test
fun testToneAgent() = runTest {
    // 建立一個列表來追蹤工具呼叫
    var toolCalls = mutableListOf<String>()
    var result: String? = null

    // 建立工具註冊表
    val toolRegistry = ToolRegistry {
        // 一個特殊工具，此類代理需要
        tool(SayToUser)

        with(ToneTools) {
            tools()
        }
    }

    // 建立事件處理器
    val eventHandler = EventHandler {
        onToolCallStarting { tool, args ->
            println("[DEBUG_LOG] Tool called: tool ${tool.name}, args $args")
            toolCalls.add(tool.name)
        }

        handleError {
            println("[DEBUG_LOG] An error occurred: ${it.message}
${it.stackTraceToString()}")
            true
        }

        handleResult {
            println("[DEBUG_LOG] Result: $it")
            result = it
        }
    }

    val positiveText = "I love this product!"
    val negativeText = "Awful service, hate the app."
    val defaultText = "I don't know how to answer this question."

    val positiveResponse = "The text has a positive tone."
    val negativeResponse = "The text has a negative tone."
    val neutralResponse = "The text has a neutral tone."

    val mockLLMApi = getMockExecutor(toolRegistry, eventHandler) {
        // 為不同的輸入文字設定 LLM 回應
        mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
        mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
        mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

        // 模擬當工具返回結果時，LLM 僅以工具回應來回應的行為
        mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
        mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
        mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

        mockLLMAnswer(defaultText).asDefaultResponse

        // 工具模擬
        mockTool(PositiveToneTool) alwaysTells {
            toolCalls += "Positive tone tool called"
            positiveResponse
        }
        mockTool(NegativeToneTool) alwaysTells {
            toolCalls += "Negative tone tool called"
            negativeResponse
        }
        mockTool(NeutralToneTool) alwaysTells {
            toolCalls += "Neutral tone tool called"
            neutralResponse
        }
    }

    // 建立策略
    val strategy = toneStrategy("tone_analysis")

    // 建立代理配置
    val agentConfig = AIAgentConfig(
        prompt = prompt("test-agent") {
            system(
                """
                You are an question answering agent with access to the tone analysis tools.
                You need to answer 1 question with the best of your ability.
                Be as concise as possible in your answers.
                DO NOT ANSWER ANY QUESTIONS THAT ARE BESIDES PERFORMING TONE ANALYSIS!
                DO NOT HALLUCINATE!
            """.trimIndent()
            )
        },
        model = mockk<LLModel>(relaxed = true),
        maxAgentIterations = 10
    )

    // 建立啟用測試的代理
    val agent = AIAgent(
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        strategy = strategy,
        eventHandler = eventHandler,
        agentConfig = agentConfig,
    ) {
        withTesting()
    }

    // 測試正面文字
    agent.run(positiveText)
    assertEquals("The text has a positive tone.", result, "Positive tone result should match")
    assertEquals(1, toolCalls.size, "One tool is expected to be called")

    // 測試負面文字
    agent.run(negativeText)
    assertEquals("The text has a negative tone.", result, "Negative tone result should match")
    assertEquals(2, toolCalls.size, "Two tools are expected to be called")

    //測試中性文字
    agent.run(defaultText)
    assertEquals("The text has a neutral tone.", result, "Neutral tone result should match")
    assertEquals(3, toolCalls.size, "Three tools are expected to be called")
}
```
<!--- KNIT example-testing-14.kt -->

對於具有多個子圖的更複雜代理，您還可以測試圖結構：

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
@Test
fun testMultiSubgraphAgentStructure() = runTest {
    val strategy = strategy("test") {
        val firstSubgraph by subgraph(
            "first",
            tools = listOf(DummyTool, CreateTool, SolveTool)
        ) {
            val callLLM by nodeLLMRequest(allowToolCalls = false)
            val executeTool by nodeExecuteTool()
            val sendToolResult by nodeLLMSendToolResult()
            val giveFeedback by node<String, String> { input ->
                llm.writeSession {
                    appendPrompt {
                        user("Call tools! Don't chat!")
                    }
                }
                input
            }

            edge(nodeStart forwardTo callLLM)
            edge(callLLM forwardTo executeTool onToolCall { true })
            edge(callLLM forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo executeTool onToolCall { true })
            edge(executeTool forwardTo nodeFinish transformed { it.content })
        }

        val secondSubgraph by subgraph<String, String>("second") {
            edge(nodeStart forwardTo nodeFinish)
        }

        edge(nodeStart forwardTo firstSubgraph)
        edge(firstSubgraph forwardTo secondSubgraph)
        edge(secondSubgraph forwardTo nodeFinish)
    }

    val toolRegistry = ToolRegistry {
        tool(DummyTool)
        tool(CreateTool)
        tool(SolveTool)
    }

    val mockLLMApi = getMockExecutor(toolRegistry) {
        mockLLMAnswer("Hello!") onRequestContains "Hello"
        mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"
    }

    val basePrompt = prompt("test") {}

    AIAgent(
        toolRegistry = toolRegistry,
        strategy = strategy,
        eventHandler = EventHandler {},
        agentConfig = AIAgentConfig(prompt = basePrompt, model = OpenAIModels.Chat.GPT4o, maxAgentIterations = 100),
        promptExecutor = mockLLMApi,
    ) {
        testGraph("test") {
            val firstSubgraph = assertSubgraphByName<String, String>("first")
            val secondSubgraph = assertSubgraphByName<String, String>("second")

            assertEdges {
                startNode() alwaysGoesTo firstSubgraph
                firstSubgraph alwaysGoesTo secondSubgraph
                secondSubgraph alwaysGoesTo finishNode()
            }

            verifySubgraph(firstSubgraph) {
                val start = startNode()
                val finish = finishNode()

                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val giveFeedback = assertNodeByName<Any?, Any?>("giveFeedback")

                assertReachable(start, askLLM)
                assertReachable(askLLM, callTool)

                assertNodes {
                    askLLM withInput "Hello" outputs Message.Assistant("Hello!")
                    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))

                    callTool withInput toolCallSignature(
                        SolveTool,
                        SolveTool.Args("solve")
                    ) outputs toolResult(SolveTool, "solved")

                    callTool withInput toolCallSignature(
                        CreateTool,
                        CreateTool.Args("solve")
                    ) outputs toolResult(CreateTool, "created")
                }

                assertEdges {
                    askLLM withOutput Message.Assistant("Hello!") goesTo giveFeedback
                    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
                }
            }
        }
    }
}
```
<!--- KNIT example-testing-15.kt -->

## API 參考

有關測試功能的完整 API 參考，請參閱 [agents-test](https://api.koog.ai/agents/agents-test/index.html) 模組的參考文件。

## 常見問題與故障排除

#### 如何模擬特定的工具回應？

在 `MockLLMBuilder` 中使用 `mockTool` 方法：
<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val mockExecutor = getMockExecutor {
    mockTool(myTool) alwaysReturns myResult

    // 或有條件地
    mockTool(myTool) returns myResult onArguments myArgs
}
```
<!--- KNIT example-testing-16.kt -->

#### 如何測試複雜的圖結構？

使用子圖斷言、`verifySubgraph` 和節點參考：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {
    AIAgent(
        // 建構函式參數
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
testGraph<Unit, String>("test") {
    val mySubgraph = assertSubgraphByName<Unit, String>("mySubgraph")

    verifySubgraph(mySubgraph) {
        // 取得節點的參考
        val nodeA = assertNodeByName<Unit, String>("nodeA")
        val nodeB = assertNodeByName<String, String>("nodeB")

        // 斷言可達性
        assertReachable(nodeA, nodeB)

        // 斷言邊緣連接
        assertEdges {
            nodeA.withOutput("result") goesTo nodeB
        }
    }
}
```
<!--- KNIT example-testing-17.kt -->

#### 如何根據輸入模擬不同的 LLM 回應？

使用模式匹配方法：

<!--- INCLUDE
import ai.koog.agents.testing.tools.getMockExecutor

val promptExecutor = 
-->
```kotlin
getMockExecutor {
    mockLLMAnswer("Response A") onRequestContains "topic A"
    mockLLMAnswer("Response B") onRequestContains "topic B"
    mockLLMAnswer("Exact response") onRequestEquals "exact question"
    mockLLMAnswer("Conditional response") onCondition { it.contains("keyword") && it.length > 10 }
}
```
<!--- KNIT example-testing-18.kt -->

### 故障排除

#### 模擬執行器總是返回預設回應

檢查您的模式匹配是否正確。模式區分大小寫，並且必須與指定內容完全匹配。

#### 工具呼叫未被攔截

確保：

1.  工具註冊表已正確設定。
2.  工具名稱完全匹配。
3.  工具動作已正確配置。

#### 圖斷言失敗

1.  驗證節點名稱是否正確。
2.  檢查圖結構是否符合您的預期。
3.  使用 `startNode()` 和 `finishNode()` 方法取得正確的進入點和退出點。