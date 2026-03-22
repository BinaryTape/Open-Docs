# 事件處理常式

您可以使用事件處理常式來監控並回應代理工作流程中的特定事件，進而實現記錄、測試、偵錯及擴充代理行為。

## 功能概覽

`EventHandler` 功能讓您能夠掛鉤（hook）到各種代理事件。它作為一種事件委派機制，具備以下作用：

- 管理 AI 代理操作的生命週期。
- 提供用於監控和回應工作流程不同階段的掛鉤。
- 啟用錯誤處理與恢復。
- 促進工具調用追蹤與結果處理。

### 安裝與配置

`EventHandler` 功能透過 `EventHandler` 類別與代理工作流程整合，該類別提供了一種為不同代理事件註冊回呼（callback）的方法，並可作為功能安裝在代理配置中。有關詳細資訊，請參閱 [API 參考資料](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)。

若要安裝此功能並為代理配置事件處理常式，請執行以下操作：

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
        // 處理工具調用
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // 處理代理完成執行時觸發的事件
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 其他事件處理常式
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
            // 處理工具調用
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 處理代理完成執行時觸發的事件
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-01.java -->

有關事件處理常式配置的更多詳細資訊，請參閱 [API 參考資料](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)。

您也可以在建立代理時，使用 `handleEvents` 擴充函式設定事件處理常式。此函式同樣會安裝事件處理常式功能並為代理進行配置。以下是一個範例：

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
            // 處理工具調用
            onToolCallStarting { eventContext ->
                println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
            }
            // 處理代理完成執行時觸發的事件
            onAgentCompleted { eventContext ->
                println("Agent finished with result: ${eventContext.result}")
            }

            // 其他事件處理常式
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
            // 處理工具調用
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 處理代理完成執行時觸發的事件
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-02.java -->