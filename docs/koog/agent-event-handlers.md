# 事件处理程序

您可以通过使用事件处理程序来监控并响应智能体工作流中的特定事件，从而实现日志记录、测试、调试和扩展智能体行为。

## 特性概述

EventHandler 特性让您能够挂钩到各种智能体事件。它作为一个事件委托机制，具有以下功能：

- 管理 AI 智能体操作的生命周期。
- 提供钩子，用于监控和响应工作流的不同阶段。
- 实现错误处理和恢复。
- 促进工具调用跟踪和结果处理。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 安装与配置

EventHandler 特性通过 `EventHandler` 类与智能体工作流集成，该类提供了一种为不同智能体事件注册回调的方法，并且可以作为智能体配置中的一个特性进行安装。详情请参见 [API 参考](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html)。

要为智能体安装此特性并配置事件处理程序，请执行以下操作：

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
    // 处理工具调用
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.tool.name} with args ${eventContext.toolArgs}")
    }
    // 处理智能体完成执行时触发的事件
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 其他事件处理程序
}
```
<!--- KNIT example-event-handlers-01.kt -->

有关事件处理程序配置的更多详细信息，请参见 [API 参考](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler-config/index.html)。

您还可以在创建智能体时使用 `handleEvents` 扩展函数来设置事件处理程序。此函数还会为智能体安装 EventHandler 特性并配置事件处理程序。以下是一个示例：

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
        // 处理工具调用
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.tool.name} with args ${eventContext.toolArgs}")
        }
        // 处理智能体完成执行时触发的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件处理程序
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->