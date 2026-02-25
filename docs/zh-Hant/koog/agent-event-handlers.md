# 事件處理常式

您可以使用用於記錄、測試、偵錯及擴充 agent 行為的事件處理常式，在 agent 工作流程期間監控並回應特定事件。

## 功能概覽

EventHandler 功能讓您可以攔截各種 agent 事件。它作為一種事件委派機制，具備以下功能：

- 管理 AI agent 作業的生命週期。
- 為工作流程的不同階段提供監控和回應的掛鉤。
- 啟用錯誤處理與復原。
- 促進工具調用追蹤與結果處理。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 安裝與配置

EventHandler 功能透過 `EventHandler` 類別與 agent 工作流程整合，該類別提供了一種為不同 agent 事件註冊回呼的方法，並可以作為一種功能安裝在 agent 配置中。如需詳細資訊，請參閱 [API 參考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)。

要安裝此功能並為 agent 配置事件處理常式，請執行以下操作：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
handleEvents {
    // 處理工具調用
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
    }
    // 處理 agent 完成執行時觸發的事件
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 其他事件處理常式
}
```
<!--- KNIT example-event-handlers-01.kt -->

關於事件處理常式配置的更多詳細資訊，請參閱 [API 參考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)。

您也可以在建立 agent 時使用 `handleEvents` 擴充函式來設定事件處理常式。此函式還會安裝事件處理常式功能並為 agent 配置事件處理常式。以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
){
    handleEvents {
        // 處理工具調用
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // 處理 agent 完成執行時觸發的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件處理常式
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->