# 概觀

代理程式使用工具來執行特定任務或存取外部系統。

## 工具工作流程

Koog 框架為使用工具提供以下工作流程：

1. 建立自訂工具或使用內建工具之一。
2. 將工具新增至工具註冊表。
3. 將工具註冊表傳遞給代理程式。
4. 與代理程式一同使用工具。

### 可用的工具類型

Koog 框架中有三種類型的工具：

- 內建工具，為代理程式與使用者互動以及對話管理提供功能。有關詳細資訊，請參閱 [內建工具](built-in-tools.md)。
- 基於註解的自訂工具，可讓您將函數作為工具暴露給 LLM。有關詳細資訊，請參閱 [基於註解的工具](annotation-based-tools.md)。
- 使用進階 API 建立的自訂工具，可讓您控制工具參數、中繼資料、執行邏輯以及其註冊和呼叫方式。有關詳細資訊，請參閱 [進階實作](advanced-tool-implementation.md)。

### 工具註冊表

在代理程式中使用工具之前，您必須將其新增至工具註冊表。
工具註冊表管理代理程式可用的所有工具。

工具註冊表的主要功能：

- 組織工具。
- 支援合併多個工具註冊表。
- 提供依名稱或類型檢索工具的方法。

要了解更多資訊，請參閱 [ToolRegistry](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)。

以下是建立工具註冊表並將工具新增至其中的範例：

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
}
```

若要合併多個工具註冊表，請執行以下操作：

```kotlin
val firstToolRegistry = ToolRegistry {
    tool(FirstSampleTool())
}

val secondToolRegistry = ToolRegistry {
    tool(SecondSampleTool())
}

val newRegistry = firstToolRegistry + secondToolRegistry
```

### 將工具傳遞給代理程式

為了使代理程式能夠使用工具，您需要在建立代理程式時提供一個包含該工具的工具註冊表作為引數：

```kotlin
// 代理程式初始化
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant with strong mathematical skills.",
    llmModel = OpenAIModels.Chat.GPT4o,
    // 將您的工具註冊表傳遞給代理程式
    toolRegistry = toolRegistry
)
```

### 呼叫工具

在您的代理程式程式碼中有數種呼叫工具的方式。建議的方法是使用代理程式環境中提供的方法，而不是直接呼叫工具，因為這可確保工具操作在代理程式環境中得到正確處理。

!!! tip
    請確保您已在工具中實作正確的 [錯誤處理](agent-events.md) 以防止代理程式失敗。

這些工具是在由 `AIAgentLLMWriteSession` 表示的特定會話上下文內呼叫的。
它提供了數種呼叫工具的方法，以便您可以：

- 呼叫帶有給定引數的工具。
- 依名稱和給定引數呼叫工具。
- 依提供的工具類別和引數呼叫工具。
- 呼叫指定類型的工具，並帶有給定引數。
- 呼叫返回原始字串結果的工具。

有關更多詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)。

#### 平行工具呼叫

您還可以使用 `toParallelToolCallsRaw` 擴展函數來平行呼叫工具。例如：

```kotlin
@Serializable
data class Book(
    val bookName: String,
    val author: String,
    val description: String
) : ToolArgs

/*...*/

val myNode by node<Unit, Unit> { _ ->
    llm.writeSession {
        flow {
            emit(Book("Book 1", "Author 1", "Description 1"))
        }.toParallelToolCallsRaw(BookTool::class).collect()
    }
}
```

#### 從節點呼叫工具

當使用節點建立代理程式工作流程時，您可以使用特殊節點來呼叫工具：

* **nodeExecuteTool**：呼叫單一工具並返回其結果。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)。

* **nodeExecuteSingleTool**：呼叫帶有提供引數的特定工具。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-single-tool.html)。

* **nodeExecuteMultipleTools**：執行多個工具呼叫並返回其結果。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)。

* **nodeLLMSendToolResult**：將工具結果發送給 LLM 並取得回應。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)。

* **nodeLLMSendMultipleToolResults**：將多個工具結果發送給 LLM。有關詳細資訊，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)。