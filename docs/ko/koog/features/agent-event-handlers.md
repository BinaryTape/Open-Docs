# 이벤트 핸들러

로깅, 테스트, 디버깅 및 에이전트 동작 확장을 위해 이벤트 핸들러를 사용하여 에이전트 워크플로 중의 특정 이벤트를 모니터링하고 응답할 수 있습니다.

## 기능 개요

EventHandler 기능은 다양한 에이전트 이벤트에 연결(hook)할 수 있게 해줍니다. 이는 다음과 같은 이벤트 위임 메커니즘 역할을 합니다:

- AI 에이전트 작업의 생명 주기(lifecycle)를 관리합니다.
- 워크플로의 다양한 단계에서 모니터링 및 응답을 위한 훅을 제공합니다.
- 오류 처리 및 복구를 가능하게 합니다.
- 도구 호출 추적 및 결과 처리를 용이하게 합니다.

<!--## 주요 구성 요소

EventHandler 엔티티는 다섯 가지 주요 핸들러 유형으로 구성됩니다:

- 에이전트 실행 초기화 시 실행되는 초기화 핸들러
- 에이전트 작업의 성공적인 결과를 처리하는 결과 핸들러
- 실행 중 발생한 예외 및 오류를 처리하는 오류 핸들러
- 도구가 호출되기 직전에 알림을 주는 도구 호출 리스너
- 도구 호출 후 결과를 처리하는 도구 결과 리스너-->

### 설치 및 설정

EventHandler 기능은 `EventHandler` 클래스를 통해 에이전트 워크플로와 통합됩니다. 이 클래스는 다양한 에이전트 이벤트에 대한 콜백을 등록하는 방법을 제공하며, 에이전트 구성에서 기능(feature)으로 설치할 수 있습니다. 자세한 내용은 [API 참조](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)를 확인하세요.

기능을 설치하고 에이전트에 대한 이벤트 핸들러를 설정하려면 다음과 같이 하세요:

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
        // 도구 호출 처리
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // 에이전트가 실행을 완료했을 때 트리거되는 이벤트 처리
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 기타 이벤트 핸들러
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
            // 도구 호출 처리
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 에이전트가 실행을 완료했을 때 트리거되는 이벤트 처리
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-01.java -->

이벤트 핸들러 설정에 대한 자세한 내용은 [API 참조](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)를 확인하세요.

에이전트를 생성할 때 `handleEvents` 확장 함수를 사용하여 이벤트 핸들러를 설정할 수도 있습니다. 이 함수는 이벤트 핸들러 기능을 설치하고 에이전트에 대한 이벤트 핸들러를 함께 구성합니다. 다음은 예시입니다:

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
            // 도구 호출 처리
            onToolCallStarting { eventContext ->
                println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
            }
            // 에이전트가 실행을 완료했을 때 트리거되는 이벤트 처리
            onAgentCompleted { eventContext ->
                println("Agent finished with result: ${eventContext.result}")
            }

            // 기타 이벤트 핸들러
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
            // 도구 호출 처리
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // 에이전트가 실행을 완료했을 때 트리거되는 이벤트 처리
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-02.java -->