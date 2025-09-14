# Agent 事件

Agent 事件是作为 Agent 工作流一部分发生的操作或交互。它们包括：

- Agent 生命周期事件
- 策略事件
- 节点事件
- LLM 调用事件
- 工具调用事件

## 事件处理程序

您可以通过使用事件处理程序来监控和响应 Agent 工作流期间的特定事件，以实现日志记录、测试、调试和扩展 Agent 行为。

EventHandler 特性让您可以挂钩到各种 Agent 事件。它作为一种事件委托机制，可以：

- 管理 AI Agent 操作的生命周期。
- 提供挂钩点，用于监控和响应工作流的不同阶段。
- 启用错误处理和恢复。
- 促进工具调用跟踪和结果处理。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 安装与配置

EventHandler 特性通过 `EventHandler` 类集成到 Agent 工作流中，该类提供了一种为不同 Agent 事件注册回调的方式，并且可以作为一项特性安装到 Agent 配置中。有关详情，请参见 [API reference](https://api.koog.
ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler/index.html)。

要为 Agent 安装该特性并配置事件处理程序，请执行以下操作：

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
    onToolCall { eventContext ->
        println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
    }
    // 处理 Agent 完成执行时触发的事件
    onAgentFinished { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 其他事件处理程序
}
```
<!--- KNIT example-events-01.kt -->

有关事件处理程序配置的更多详情，请参见 [API reference](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler-config/index.html)。

您还可以在创建 Agent 时使用 `handleEvents` 扩展函数来设置事件处理程序。此函数还会安装事件处理程序特性并为 Agent 配置事件处理程序。以下是一个示例：

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
        onToolCall { eventContext ->
            println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
        }
        // 处理 Agent 完成执行时触发的事件
        onAgentFinished { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件处理程序
    }
}
```
<!--- KNIT example-events-02.kt -->