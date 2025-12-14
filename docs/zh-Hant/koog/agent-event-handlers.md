# 事件處理器

您可以在代理程式工作流程中，透過使用事件處理器來監控和回應特定事件，以進行記錄、測試、除錯，並擴展代理程式的行為。

## 功能概述

`EventHandler` 功能讓您能夠掛接到各種代理程式事件。它作為一種事件委派機制，能夠：

-   管理 AI 代理程式操作的生命週期。
-   提供掛接點，用於監控和回應工作流程的不同階段。
-   啟用錯誤處理和復原。
-   促進工具呼叫追蹤和結果處理。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 安裝與設定

`EventHandler` 功能透過 `EventHandler` 類別整合到代理程式工作流程中，該類別提供了註冊不同代理程式事件回呼的方式，並可作為代理程式設定中的一個功能進行安裝。詳細資訊請參閱 [API reference](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html)。

若要安裝此功能並為代理程式設定事件處理器，請執行以下操作：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

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
    // 處理工具呼叫
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
    }
    // 處理代理程式完成執行時觸發的事件
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 其他事件處理器
}
```
<!--- KNIT example-event-handlers-01.kt -->

有關事件處理器設定的更多詳細資訊，請參閱 [API reference](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler-config/index.html)。

您也可以在建立代理程式時使用 `handleEvents` 擴充函式來設定事件處理器。此函式也會安裝事件處理器功能並設定代理程式的事件處理器。以下是一個範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
){
    handleEvents {
        // 處理工具呼叫
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // 處理代理程式完成執行時觸發的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件處理器
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->