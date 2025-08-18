# 에이전트 이벤트

에이전트 이벤트는 에이전트 워크플로의 일부로 발생하는 동작 또는 상호 작용입니다. 다음을 포함합니다:

- 에이전트 라이프사이클 이벤트
- 전략 이벤트
- 노드 이벤트
- LLM 호출 이벤트
- 도구 호출 이벤트

## 이벤트 핸들러

로깅, 테스트, 디버깅, 그리고 에이전트 동작 확장을 위해 에이전트 워크플로 중에 이벤트 핸들러를 사용하여 특정 이벤트를 모니터링하고 응답할 수 있습니다.

`EventHandler` 기능은 다양한 에이전트 이벤트에 연결할 수 있도록 합니다. 이는 다음과 같은 이벤트 위임 메커니즘으로 작동합니다:

- AI 에이전트 작업의 라이프사이클을 관리합니다.
- 워크플로의 다양한 단계에서 모니터링하고 응답하기 위한 훅(hook)을 제공합니다.
- 오류 처리 및 복구를 가능하게 합니다.
- 도구 호출 추적 및 결과 처리를 용이하게 합니다.

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### 설치 및 구성

`EventHandler` 기능은 `EventHandler` 클래스를 통해 에이전트 워크플로와 통합됩니다. 이 클래스는 다양한 에이전트 이벤트에 대한 콜백을 등록하는 방법을 제공하며, 에이전트 구성에 기능으로 설치될 수 있습니다. 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler/index.html)를 참조하세요.

에이전트에 기능을 설치하고 이벤트 핸들러를 구성하려면 다음을 수행하세요.

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
    // 도구 호출 처리
    onToolCall { eventContext ->
        println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
    }
    // 에이전트 실행 완료 시 트리거되는 이벤트 처리
    onAgentFinished { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // 다른 이벤트 핸들러
}
```
<!--- KNIT example-events-01.kt -->

이벤트 핸들러 구성에 대한 자세한 내용은 [API 참조](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler-config/index.html)를 참조하세요.

에이전트를 생성할 때 `handleEvents` 확장 함수를 사용하여 이벤트 핸들러를 설정할 수도 있습니다. 이 함수는 또한 이벤트 핸들러 기능을 설치하고 에이전트에 대한 이벤트 핸들러를 구성합니다. 다음은 예시입니다.

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
        // 도구 호출 처리
        onToolCall { eventContext ->
            println("Tool called: ${eventContext.tool} with args ${eventContext.toolArgs}")
        }
        // 에이전트 실행 완료 시 트리거되는 이벤트 처리
        onAgentFinished { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // 다른 이벤트 핸들러
    }
}
```
<!--- KNIT example-events-02.kt -->