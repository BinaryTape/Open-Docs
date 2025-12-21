# 概觀

代理程式使用工具來執行特定任務或存取外部系統。

## 工具工作流程

Koog 框架為使用工具提供以下工作流程：

1.  建立自訂工具或使用其中一個內建工具。
2.  將工具新增至工具註冊表。
3.  將工具註冊表傳遞給代理程式。
4.  與代理程式一同使用工具。

### 可用的工具類型

Koog 框架中有三種類型的工具：

-   內建工具，為代理程式與使用者互動以及對話管理提供功能。有關詳細資訊，請參閱 [內建工具](built-in-tools.md)。
-   基於註解的自訂工具，可讓您將函式作為工具暴露給 LLM。有關詳細資訊，請參閱 [基於註解的工具](annotation-based-tools.md)。
-   自訂工具，可讓您控制工具參數、中繼資料、執行邏輯以及其註冊和呼叫方式。有關詳細資訊，請參閱 [基於類別的工具](class-based-tools.md)。

### 工具註冊表

在您於代理程式中使用工具之前，必須將其新增至工具註冊表。
工具註冊表管理代理程式可用的所有工具。

工具註冊表的主要功能：

-   組織工具。
-   支援合併多個工具註冊表。
-   提供依名稱或類型檢索工具的方法。

要了解更多資訊，請參閱 [ToolRegistry](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)。

以下是建立工具註冊表並將工具新增至其中的範例：

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
-->
```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
}
```
<!--- KNIT example-tools-overview-01.kt -->

若要合併多個工具註冊表，請執行以下操作：

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias FirstSampleTool = AskUser
typealias SecondSampleTool = SayToUser
-->
```kotlin
val firstToolRegistry = ToolRegistry {
    tool(FirstSampleTool)
}

val secondToolRegistry = ToolRegistry {
    tool(SecondSampleTool)
}

val newRegistry = firstToolRegistry + secondToolRegistry
```
<!--- KNIT example-tools-overview-02.kt -->

### 將工具傳遞給代理程式

為了使代理程式能夠使用工具，您需要在建立代理程式時提供一個包含該工具的工具註冊表作為引數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
// Agent initialization
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant with strong mathematical skills.",
    llmModel = OpenAIModels.Chat.GPT4o,
    // Pass your tool registry to the agent
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-tools-overview-03.kt -->

### 呼叫工具

在您的代理程式程式碼中有數種呼叫工具的方式。建議的方法是使用代理程式環境中提供的方法，而不是直接呼叫工具，因為這可確保工具操作在代理程式環境中得到正確處理。

!!! tip
    請確保您已在工具中實作正確的 [錯誤處理](agent-event-handlers.md) 以防止代理程式失敗。

這些工具是在由 `AIAgentLLMWriteSession` 表示的特定會話上下文內呼叫的。
它提供了數種呼叫工具的方法，以便您可以：

-   呼叫帶有給定引數的工具。
-   依其名稱和給定引數呼叫工具。
-   依提供的工具類別和引數呼叫工具。
-   呼叫指定類型的工具，並帶有給定引數。
-   呼叫返回原始字串結果的工具。

有關更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)。

#### 平行工具呼叫

您還可以使用 `toParallelToolCallsRaw` 擴展函數來平行呼叫工具。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.SimpleTool
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)

class BookTool() : SimpleTool<Book>(
    argsSerializer = Book.serializer(),
    name = NAME,
    description = "A tool to parse book information from Markdown"
) {
    companion object {
        const val NAME = "book"
    }

    override suspend fun execute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }
}

val strategy = strategy<Unit, Unit>("strategy-name") {

    /*...*/

    val myNode by node<Unit, Unit> { _ ->
        llm.writeSession {
            flow {
                emit(Book("Book 1", "Author 1", "Description 1"))
            }.toParallelToolCallsRaw(BookTool::class).collect()
        }
    }
}

```
<!--- KNIT example-tools-overview-04.kt -->

#### 從節點呼叫工具

當使用節點建立代理程式工作流程時，您可以使用特殊節點來呼叫工具：

*   **nodeExecuteTool**：呼叫單一工具呼叫並返回其結果。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)。

*   **nodeExecuteSingleTool**：呼叫帶有提供引數的特定工具。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-single-tool.html)。

*   **nodeExecuteMultipleTools**：執行多個工具呼叫並返回其結果。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)。

*   **nodeLLMSendToolResult**：將工具結果發送給 LLM 並取得回應。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)。

*   **nodeLLMSendMultipleToolResults**：將多個工具結果發送給 LLM。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)。

## 將代理程式作為工具使用

該框架提供將任何 AI 代理程式轉換為可供其他代理程式使用的工具的能力。
這項強大的功能可讓您建立分層代理程式架構，其中專業代理程式可以被更高層次的協調代理程式作為工具呼叫。

### 將代理程式轉換為工具

若要將代理程式轉換為工具，請使用 `AIAgentService` 和 `createAgentTool()` 擴展函數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
val analysisToolRegistry = ToolRegistry {}

-->
```kotlin
// Create a specialized agent service, responsible for creating financial analysis agents.
val analysisAgentService = AIAgentService(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a financial analysis specialist.",
    toolRegistry = analysisToolRegistry
)

// Create a tool that would run financial analysis agent once called.
val analysisAgentTool = analysisAgentService.createAgentTool(
    agentName = "analyzeTransactions",
    agentDescription = "Performs financial transaction analysis",
    inputDescription = "Transaction analysis request",
)
```
<!--- KNIT example-tools-overview-05.kt -->

### 在其他代理程式中使用代理程式工具

一旦轉換為工具，您可以將代理程式工具新增至另一個代理程式的工具註冊表：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

-->
```kotlin
// Create a coordinator agent that can use specialized agents as tools
val coordinatorAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You coordinate different specialized services.",
    toolRegistry = ToolRegistry {
        tool(analysisAgentTool)
        // Add other tools as needed
    }
)
```
<!--- KNIT example-tools-overview-06.kt -->

### 代理程式工具執行

當呼叫代理程式工具時：

1.  引數會根據輸入描述符反序列化。
2.  封裝的代理程式會使用反序列化輸入來執行。
3.  代理程式的輸出會序列化並作為工具結果傳回。

### 將代理程式作為工具的好處

-   **模組化**：將複雜的工作流程分解為專業代理程式。
-   **可重用性**：在多個協調代理程式中重複使用相同的專業代理程式。
-   **職責分離**：每個代理程式都可以專注於其特定領域。