# Agent 事件

Agent 事件是在 agent 工作流程中發生動作或互動。其包含：

- Agent 生命週期事件
- 策略事件
- 節點事件
- LLM 呼叫事件
- 工具呼叫事件

## 事件處理器

您可以在 agent 工作流程期間，透過使用事件處理器來監控並回應特定事件，以用於日誌記錄、測試、除錯以及擴展 agent 行為。

`EventHandler` 功能讓您掛鉤至各種 agent 事件。其作為一個事件委派機制，用於：

- 管理 AI agent 操作的生命週期。
- 提供用於監控和回應工作流程不同階段的掛鉤。
- 啟用錯誤處理和復原。
- 促進工具呼叫追蹤和結果處理。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 安裝與組態

`EventHandler` 功能透過 `EventHandler` 類別整合至 agent 工作流程中，該類別提供一種方式來註冊不同 agent 事件的回呼，並且可以作為一項功能安裝在 agent 組態中。詳細資訊請參閱 [API reference](https://api.koog.
ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler/index.html)。

若要為 agent 安裝此功能並設定事件處理器，請執行以下操作：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX
}
-->

```kotlin
handleEvents {
    // Handle tool calls
    onToolCall { eventContext ->
        println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
    }
    // Handle event triggered when the agent completes its execution
    onAgentFinished { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // Other event handlers
}
```
<!--- KNIT example-events-01.kt -->

關於事件處理器組態的更多詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler-config/index.html)。

您也可以在建立 agent 時，使用 `handleEvents` 擴展函數來設定事件處理器。此函數也會安裝事件處理器功能，並為 agent 設定事件處理器。這是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
-->
```kotlin
val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
){
    handleEvents {
        // Handle tool calls
        onToolCall { eventContext ->
            println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
        }
        // Handle event triggered when the agent completes its execution
        onAgentFinished { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // Other event handlers
    }
}
```
<!--- KNIT example-events-02.kt -->