# 事件处理程序

您可以通过使用事件处理程序进行日志记录、测试、调试以及扩展代理行为，从而在代理工作流中监控并响应特定事件。

## 特性概览

EventHandler 特性允许您挂接到各种代理事件。它作为一种事件委托机制，可以：

- 管理 AI 代理操作的生命周期。
- 提供用于监控和响应工作流不同阶段的钩子。
- 启用错误处理和恢复。
- 促进工具调用跟踪和结果处理。

<!--## 核心组件

EventHandler 实体由五种主要处理程序类型组成：

- 初始化处理程序：在代理运行初始化时执行
- 结果处理程序：处理代理操作成功的运行结果
- 错误处理程序：处理执行过程中发生的异常和错误
- 工具调用监听器：在工具即将被调用时发出通知
- 工具结果监听器：在工具调用完成后处理结果-->

### 安装与配置

EventHandler 特性通过 `EventHandler` 类与代理工作流集成，该类提供了一种为不同代理事件注册回调的方法，并且可以作为代理配置中的一个特性进行安装。有关详情，请参阅 [API 参考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)。

要安装该特性并为代理配置事件处理程序，请执行以下操作：

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
    // 处理工具调用
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
    }
    // 处理代理完成执行时触发的事件
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 其他事件处理程序
}
```
<!--- KNIT example-event-handlers-01.kt -->

有关事件处理程序配置的更多详细信息，请参阅 [API 参考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)。

您还可以在创建代理时使用 `handleEvents` 扩展函数来设置事件处理程序。此函数同样会安装事件处理程序特性并为代理配置事件处理程序。示例如下：

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
        // 处理工具调用
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // 处理代理完成执行时触发的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件处理程序
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->