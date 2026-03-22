# 事件处理程序

您可以通过使用事件处理程序来进行日志记录、测试、调试和扩展智能体行为，从而监控并响应智能体工作流中的特定事件。

## 功能概览

EventHandler 功能允许您挂钩到各种智能体事件中。它作为一个事件委托机制，负责：

- 管理 AI 智能体操作的生命周期。
- 提供用于监控和响应工作流不同阶段的钩子。
- 启用错误处理和恢复。
- 促进工具调用跟踪和结果处理。

<!--## 核心组件

EventHandler 实体由五种主要的处理程序类型组成：

- 初始化处理程序：在智能体运行初始化时执行
- 结果处理程序：处理智能体操作的成功结果
- 错误处理程序：处理执行过程中发生的异常和错误
- 工具调用监听器：在工具即将被调用时发出通知
- 工具结果监听器：在工具调用完成后处理结果-->

### 安装与配置

EventHandler 功能通过 `EventHandler` 类与智能体工作流集成，该类提供了一种为不同智能体事件注册回调的方法，并可以作为一项功能安装在智能体配置中。有关详细信息，请参阅 [API 参考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)。

要安装该功能并为智能体配置事件处理程序，请执行以下操作：

=== "Kotlin"

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
        // 处理智能体完成其执行时触发的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件处理程序
    }
    ```
    <!--- KNIT example-event-handlers-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
        .llmModel(OllamaModels.Meta.LLAMA_3_2)
        .install(EventHandler.Feature, cfg -> {
            // 处理工具调用
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 处理智能体完成其执行时触发的事件
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-01.java -->

有关事件处理程序配置的更多详细信息，请参阅 [API 参考](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)。

您还可以在创建智能体时使用 `handleEvents` 扩展函数来设置事件处理程序。此函数同样会安装事件处理程序功能并为智能体配置事件处理程序。示例如下：

=== "Kotlin"

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
            // 处理智能体完成其执行时触发的事件
            onAgentCompleted { eventContext ->
                println("Agent finished with result: ${eventContext.result}")
            }

            // 其他事件处理程序
        }
    }
    ```
    <!--- KNIT example-event-handlers-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
        .llmModel(OllamaModels.Meta.LLAMA_3_2)
        .install(EventHandler.Feature, cfg -> {
            // 处理工具调用
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 处理智能体完成其执行时触发的事件
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-02.java -->