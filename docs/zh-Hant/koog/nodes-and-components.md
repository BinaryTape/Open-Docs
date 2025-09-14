# 預定義節點與元件

節點是 Koog 框架中代理工作流程的基本構成要素。
每個節點代表工作流程中的一個特定操作或轉換，它們可以透過邊 (edge) 連接，以定義執行流程。

一般來說，它們允許您將複雜的邏輯封裝到可重複使用的元件中，以便輕鬆整合到
不同的代理工作流程。本指南將引導您了解可以在代理策略中使用的現有節點。

如需更詳細的參考文件，請參閱 [API reference](https://api.koog.ai/index.html)。

## 實用節點

### nodeDoNothing

一個簡單的傳遞式 (pass-through) 節點，它不做任何事情，僅將輸入作為輸出返回。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-do-nothing.html)。

您可以將此節點用於以下目的：

- 在您的圖形中建立一個佔位節點。
- 建立一個連接點而不修改資料。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val passthrough by nodeDoNothing<String>("passthrough")

edge(nodeStart forwardTo passthrough)
edge(passthrough forwardTo nodeFinish)
```
<!--- KNIT example-nodes-and-component-01.kt -->

## LLM 節點

### nodeUpdatePrompt

一個使用提供的提示詞建構器 (prompt builder) 將訊息新增到 LLM 提示詞的節點。
這對於在發出實際 LLM 請求之前修改對話上下文非常有用。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-update-prompt.html)。

您可以將此節點用於以下目的：

- 將系統指令新增到提示詞。
- 將使用者訊息插入對話。
- 為後續的 LLM 請求準備上下文。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeUpdatePrompt

typealias Input = Unit
typealias Output = Unit

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val firstNode by node<Input, Output> {
    // Transform input to output
}

val secondNode by node<Output, Output> {
    // Transform output to output
}

// Node will get the value of type Output as input from the previous node and path through it to the next node
val setupContext by nodeUpdatePrompt<Output>("setupContext") {
    system("You are a helpful assistant specialized in Kotlin programming.")
    user("I need help with Kotlin coroutines.")
}

edge(firstNode forwardTo setupContext)
edge(setupContext forwardTo secondNode)
```
<!--- KNIT example-nodes-and-component-02.kt -->

### nodeLLMSendMessageOnlyCallingTools

一個將使用者訊息附加到 LLM 提示詞，並獲得 LLM 只能呼叫工具的回應的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-only-calling-tools.html)。

### nodeLLMSendMessageForceOneTool

一個將使用者訊息附加到 LLM 提示詞，並強制 LLM 使用特定工具的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-force-one-tool.html)。

### nodeLLMRequest

一個將使用者訊息附加到 LLM 提示詞，並獲得帶有可選工具使用功能的回應的節點。節點配置決定了在處理訊息期間是否允許
工具呼叫。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request.html)。

您可以將此節點用於以下目的：

- 為當前提示詞生成 LLM 回應，控制 LLM 是否允許生成工具呼叫。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest("requestLLM", allowToolCalls = true)
edge(getUserQuestion forwardTo requestLLM)
```
<!--- KNIT example-nodes-and-component-03.kt -->

### nodeLLMRequestStructured

一個將使用者訊息附加到 LLM 提示詞，並向 LLM 請求帶有錯誤校正功能的結構化資料的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-structured.html)。

### nodeLLMRequestStreaming

一個將使用者訊息附加到 LLM 提示詞，並串流傳輸 LLM 回應（可選串流資料轉換）的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-streaming.html)。

### nodeLLMRequestMultiple

一個將使用者訊息附加到 LLM 提示詞，並獲得多個已啟用工具呼叫的 LLM 回應的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-multiple.html)。

您可以將此節點用於以下目的：

- 處理需要多個工具呼叫的複雜查詢。
- 生成多個工具呼叫。
- 實作一個需要多個平行動作的工作流程。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getComplexUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
edge(getComplexUserQuestion forwardTo requestLLMMultipleTools)
```
<!--- KNIT example-nodes-and-component-04.kt -->

### nodeLLMCompressHistory

一個將當前 LLM 提示詞（訊息歷史記錄）壓縮為摘要，並以簡潔摘要 (TL;DR) 取代訊息的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-compress-history.html)。
這對於透過壓縮歷史記錄來減少 token 用量，從而管理冗長對話非常有用。

要了解更多關於歷史記錄壓縮的資訊，請參閱 [History compression](history-compression.md)。

您可以將此節點用於以下目的：

- 管理冗長對話以減少 token 用量。
- 總結對話歷史記錄以保持上下文。
- 在長時間執行的代理中實作記憶體管理。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeDoNothing
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy

val strategy = strategy<String, String>("strategy_name") {
    val generateHugeHistory by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<String>(
    "compressHistory",
    strategy = HistoryCompressionStrategy.FromLastNMessages(10),
    preserveMemory = true
)
edge(generateHugeHistory forwardTo compressHistory)
```
<!--- KNIT example-nodes-and-component-05.kt -->

## 工具節點

### nodeExecuteTool

一個執行單一工具呼叫並返回其結果的節點。此節點用於處理 LLM 發出的工具呼叫。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)。

您可以將此節點用於以下目的：

- 執行 LLM 請求的工具。
- 處理 LLM 決策所觸發的特定動作。
- 將外部功能整合到代理工作流程中。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.onToolCall

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest()
val executeTool by nodeExecuteTool()
edge(requestLLM forwardTo executeTool onToolCall { true })
```
<!--- KNIT example-nodes-and-component-06.kt -->

### nodeLLMSendToolResult

一個將工具結果新增到提示詞並請求 LLM 回應的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)。

您可以將此節點用於以下目的：

- 處理工具執行的結果。
- 根據工具輸出生成回應。
- 在工具執行後繼續對話。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeTool by nodeExecuteTool()
val sendToolResultToLLM by nodeLLMSendToolResult()
edge(executeTool forwardTo sendToolResultToLLM)
```
<!--- KNIT example-nodes-and-component-07.kt -->

### nodeExecuteMultipleTools

一個執行多個工具呼叫的節點。這些呼叫可以選擇性地平行執行。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)。

您可以將此節點用於以下目的：

- 平行執行多個工具。
- 處理需要多個工具執行的複雜工作流程。
- 透過批次處理工具呼叫來最佳化效能。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools
import ai.koog.agents.core.dsl.extension.onMultipleToolCalls

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
val executeMultipleTools by nodeExecuteMultipleTools()
edge(requestLLMMultipleTools forwardTo executeMultipleTools onMultipleToolCalls { true })
```
<!--- KNIT example-nodes-and-component-08.kt -->

### nodeLLMSendMultipleToolResults

一個將多個工具結果新增到提示詞，並獲得多個 LLM 回應的節點。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)。

您可以將此節點用於以下目的：

- 處理多個工具執行的結果。
- 生成多個工具呼叫。
- 實作具有多個平行動作的複雜工作流程。

以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeMultipleTools by nodeExecuteMultipleTools()
val sendMultipleToolResultsToLLM by nodeLLMSendMultipleToolResults()
edge(executeMultipleTools forwardTo sendMultipleToolResultsToLLM)
```
<!--- KNIT example-nodes-and-component-09.kt -->

## 預定義子圖

該框架提供了預定義的子圖，用於封裝常用模式和工作流程。這些子圖透過自動處理基本節點和邊的建立，簡化了複雜代理策略的開發。

透過使用預定義的子圖，您可以實作各種流行管道。以下是一個範例：

1. 準備資料。
2. 執行任務。
3. 驗證任務結果。如果結果不正確，請返回步驟 2 並提供回饋訊息以進行調整。

### subgraphWithTask

一個使用提供的工具執行特定任務並返回結構化結果的子圖。此子圖旨在處理較大工作流程中的獨立任務。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-task.html)。

您可以將此子圖用於以下目的：

- 建立在較大工作流程中處理特定任務的特殊元件。
- 封裝具有清晰輸入和輸出介面的複雜邏輯。
- 配置任務專用的工具、模型和提示詞。
- 透過自動壓縮管理對話歷史記錄。
- 開發結構化代理工作流程和任務執行管道。
- 從 LLM 任務執行中生成結構化結果。

您可以將任務以文字形式提供給子圖，如果需要，配置 LLM，並提供必要的工具，子圖將處理並解決該任務。以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.agent.subgraphWithTask

val searchTool = SayToUser
val calculatorTool = SayToUser
val weatherTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processQuery by subgraphWithTask<String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    llmModel = OpenAIModels.Chat.GPT4o,
) { userQuery ->
    """
    You are a helpful assistant that can answer questions about various topics.
    Please help with the following query:
    $userQuery
    """
}
```
<!--- KNIT example-nodes-and-component-10.kt -->

### subgraphWithVerification

一個 `subgraphWithTask` 的特殊版本，用於驗證任務是否正確執行並提供遇到的任何問題的詳細資訊。此子圖對於需要驗證或品質檢查的工作流程非常有用。如需詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-verification.html)。

您可以將此子圖用於以下目的：

- 驗證任務執行的正確性。
- 在您的工作流程中實作品質控制流程。
- 建立自我驗證元件。
- 生成帶有成功/失敗狀態和詳細回饋的結構化驗證結果。

該子圖確保 LLM 在工作流程結束時呼叫驗證工具，以檢查任務是否成功完成。它保證此驗證作為最後一步執行，並返回一個 `VerifiedSubgraphResult`，指示任務是否成功完成並提供詳細回饋。
以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.agents.ext.agent.subgraphWithVerification

val runTestsTool = SayToUser
val analyzeTool = SayToUser
val readFileTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val verifyCode by subgraphWithVerification<String>(
    tools = listOf(runTestsTool, analyzeTool, readFileTool),
    llmModel = AnthropicModels.Sonnet_3_7
) { codeToVerify ->
    """
    You are a code reviewer. Please verify that the following code meets all requirements:
    1. It compiles without errors
    2. All tests pass
    3. It follows the project's coding standards

    Code to verify:
    $codeToVerify
    """
}
```
<!--- KNIT example-nodes-and-component-11.kt -->

## 預定義策略與常見策略模式

該框架提供了結合各種節點的預定義策略。
節點透過邊連接以定義操作流程，並帶有指定何時遵循每條邊的條件。

如果需要，您可以將這些策略整合到您的代理工作流程中。

### 單次執行策略

單次執行策略專為非互動式使用情境設計，其中代理處理輸入一次並返回結果。

當您需要運行不需要複雜邏輯的直接流程時，可以使用此策略。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*

-->
```kotlin

public fun singleRunStrategy(): AIAgentGraphStrategy<String, String> = strategy("single_run") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```
<!--- KNIT example-nodes-and-component-12.kt -->

### 基於工具的策略

基於工具的策略專為高度依賴工具執行特定操作的工作流程設計。
它通常根據 LLM 決策執行工具並處理結果。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.tools.ToolRegistry

-->
```kotlin
fun toolBasedStrategy(name: String, toolRegistry: ToolRegistry): AIAgentGraphStrategy<String, String> {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        // Define the flow of the agent
        edge(nodeStart forwardTo nodeSendInput)

        // If the LLM responds with a message, finish
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // If the LLM calls a tool, execute it
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // Send the tool result back to the LLM
        edge(nodeExecuteTool forwardTo nodeSendToolResult)

        // If the LLM calls another tool, execute it
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the LLM responds with a message, finish
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```
<!--- KNIT example-nodes-and-component-13.kt -->

### 串流資料策略

串流資料策略專為處理來自 LLM 的串流資料而設計。它通常請求
串流資料，處理它，並可能使用處理後的資料呼叫工具。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi08.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
    // Describe the node containing the output stream parsing
    val getMdOutput by node<String, List<Book>> { booksDescription ->
        val books = mutableListOf<Book>()
        val mdDefinition = markdownBookDefinition()

        llm.writeSession {
            updatePrompt { user(booksDescription) }
            // Initiate the response stream in the form of the definition `mdDefinition`
            val markdownStream = requestLLMStreaming(mdDefinition)
            // Call the parser with the result of the response stream and perform actions with the result
            parseMarkdownStreamToBooks(markdownStream).collect { book ->
                books.add(book)
                println("Parsed Book: ${book.title} by ${book.author}")
            }
        }

        books
    }
    // Describe the agent's graph making sure the node is accessible
    edge(nodeStart forwardTo getMdOutput)
    edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-nodes-and-component-14.kt -->