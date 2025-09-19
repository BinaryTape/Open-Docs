# 히스토리 압축

AI 에이전트는 사용자 메시지, 어시스턴트 응답, 도구 호출 및 도구 응답을 포함하는 메시지 히스토리를 유지합니다.
이 히스토리는 에이전트가 전략을 따르면서 각 상호작용마다 증가합니다.

장기 실행 대화의 경우, 히스토리가 커져 많은 토큰을 소비할 수 있습니다.
히스토리 압축은 전체 메시지 목록을 에이전트의 추가 작동에 필요한 중요한 정보만 포함하는 하나 또는 여러 메시지로 요약하여 이를 줄이는 데 도움이 됩니다.

히스토리 압축은 에이전트 시스템의 주요 과제를 해결합니다:

- 컨텍스트 사용 최적화. 집중되고 작은 컨텍스트는 LLM 성능을 향상시키고 토큰 제한 초과로 인한 실패를 방지합니다.
- 성능 향상. 히스토리를 압축하면 LLM이 처리하는 메시지 수가 줄어들어 응답 속도가 빨라집니다.
- 정확성 향상. 관련 정보에 집중하면 LLM이 집중력을 유지하고 방해 없이 작업을 완료하는 데 도움이 됩니다.
- 비용 절감. 불필요한 메시지를 줄이면 토큰 사용량이 감소하여 API 호출의 전체 비용이 줄어듭니다.

## 히스토리를 압축해야 하는 시점

히스토리 압축은 에이전트 워크플로의 특정 단계에서 수행됩니다:

- 에이전트 전략의 논리적 단계 (서브그래프) 사이.
- 컨텍스트가 너무 길어질 때.

## 히스토리 압축 구현

에이전트에서 히스토리 압축을 구현하는 주요 접근 방식은 두 가지입니다:

- 전략 그래프에서.
- 커스텀 노드에서.

### 전략 그래프에서의 히스토리 압축

전략 그래프에서 히스토리를 압축하려면 `nodeLLMCompressHistory` 노드를 사용해야 합니다.
압축을 수행할 단계를 결정하는 방법에 따라 다음 시나리오를 사용할 수 있습니다:

* 히스토리가 너무 길어질 때 압축하려면 헬퍼 함수를 정의하고 다음 로직으로 `nodeLLMCompressHistory` 노드를 전략 그래프에 추가할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.environment.ReceivedToolResult
-->
```kotlin
// 히스토리가 메시지 100개 이상이면 너무 길다고 정의
private suspend fun AIAgentContext.historyIsTooLong(): Boolean = llm.readSession { prompt.messages.size > 100 }

val strategy = strategy<String, String>("execute-with-history-compression") {
    val callLLM by nodeLLMRequest()
    val executeTool by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    // LLM 히스토리를 압축하고 다음 노드를 위해 현재 ReceivedToolResult를 유지
    val compressHistory by nodeLLMCompressHistory<ReceivedToolResult>()

    edge(nodeStart forwardTo callLLM)
    edge(callLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(callLLM forwardTo executeTool onToolCall { true })

    // 히스토리가 너무 길면 도구 실행 후 히스토리 압축
    edge(executeTool forwardTo compressHistory onCondition { historyIsTooLong() })
    edge(compressHistory forwardTo sendToolResult)
    // 그렇지 않으면 다음 LLM 요청으로 진행
    edge(executeTool forwardTo sendToolResult onCondition { !historyIsTooLong() })

    edge(sendToolResult forwardTo executeTool onToolCall { true })
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
}
```
<!--- KNIT example-history-compression-01.kt -->

이 예시에서 전략은 각 도구 호출 후에 히스토리가 너무 긴지 확인합니다.
히스토리는 도구 결과를 LLM으로 다시 보내기 전에 압축됩니다. 이렇게 하면 긴 대화 중에 컨텍스트가 증가하는 것을 방지할 수 있습니다.

* 전략의 논리적 단계 (서브그래프) 사이에 히스토리를 압축하려면 다음과 같이 전략을 구현할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
-->
```kotlin
val strategy = strategy<String, String>("execute-with-history-compression") {
    val collectInformation by subgraph<String, String> {
        // 정보를 수집하는 단계
    }
    val compressHistory by nodeLLMCompressHistory<String>()
    val makeTheDecision by subgraph<String, String> {
        // 현재 압축된 히스토리와 수집된 정보를 기반으로 의사 결정을 내리는 단계
    }
    
    nodeStart then collectInformation then compressHistory then makeTheDecision
}
```
<!--- KNIT example-history-compression-02.kt -->

이 예시에서 히스토리는 정보 수집 단계가 완료된 후 의사 결정 단계로 진행하기 전에 압축됩니다.

### 커스텀 노드에서의 히스토리 압축

커스텀 노드를 구현하는 경우 다음과 같이 `replaceHistoryWithTLDR()` 함수를 사용하여 히스토리를 압축할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR()
}
```
<!--- KNIT example-history-compression-03.kt -->

이 접근 방식은 특정 요구 사항에 따라 커스텀 노드 로직의 어느 지점에서든 압축을 구현할 수 있는 더 많은 유연성을 제공합니다.

커스텀 노드에 대한 자세한 내용은 [커스텀 노드](custom-nodes.md)를 참조하세요.

## 히스토리 압축 전략

선택적 `strategy` 매개변수를 `nodeLLMCompressHistory(strategy=...)` 또는 `replaceHistoryWithTLDR(strategy=...)`에 전달하여 압축 프로세스를 사용자 정의할 수 있습니다.
프레임워크는 여러 내장 전략을 제공합니다.

### WholeHistory (기본값)

전체 히스토리를 현재까지 달성된 내용을 요약하는 하나의 TLDR 메시지로 압축하는 기본 전략입니다.
이 전략은 토큰 사용량을 줄이면서 전체 대화 컨텍스트에 대한 인식을 유지하려는 대부분의 일반적인 사용 사례에 적합합니다.

다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory
)
```
<!--- KNIT example-history-compression-04.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.WholeHistory)
}
```
<!--- KNIT example-history-compression-05.kt -->

### FromLastNMessages

마지막 `n`개의 메시지만 TLDR 메시지로 압축하고 이전 메시지는 완전히 폐기하는 전략입니다.
이는 에이전트의 최신 성과 (또는 최근 발견된 사실, 최신 컨텍스트)만 문제 해결에 관련이 있을 때 유용합니다.

다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.FromLastNMessages(5)
)
```
<!--- KNIT example-history-compression-06.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.FromLastNMessages(5))
}
```
<!--- KNIT example-history-compression-07.kt -->

### Chunked

이 전략은 전체 메시지 히스토리를 고정된 크기의 청크(chunk)로 분할하고 각 청크를 독립적으로 TLDR 메시지로 압축합니다.
이는 현재까지 수행된 작업의 간결한 TLDR뿐만 아니라 전체적인 진행 상황을 추적하고 싶고, 일부 오래된 정보도 중요할 수 있을 때 유용합니다.

다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.Chunked(10)
)
```
<!--- KNIT example-history-compression-08.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = HistoryCompressionStrategy.Chunked(10))
}
```
<!--- KNIT example-history-compression-09.kt -->

### RetrieveFactsFromHistory

이 전략은 제공된 개념 목록과 관련된 특정 사실을 히스토리에서 검색하여 가져옵니다.
전체 히스토리를 이러한 사실로만 변경하고 향후 LLM 요청을 위한 컨텍스트로 남겨둡니다.
이는 LLM이 작업을 더 잘 수행하는 데 어떤 정확한 사실이 관련이 있을지 알고 있을 때 유용합니다.

다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.memory.feature.history.RetrieveFactsFromHistory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = RetrieveFactsFromHistory(
        Concept(
            keyword = "user_preferences",
            // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
            description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
            // LLM은 이 개념과 관련된 여러 관련 사실을 검색합니다:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "product_details",
            // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
            description = "Brief details about products in the catalog the user has been checking",
            // LLM은 이 개념과 관련된 여러 관련 사실을 검색합니다:
            factType = FactType.MULTIPLE
        ),
        Concept(
            keyword = "issue_solved",
            // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
            description = "Was the initial user's issue resolved?",
            // LLM은 질문에 대한 단일 답변을 검색합니다:
            factType = FactType.SINGLE
        )
    )
)
```
<!--- KNIT example-history-compression-10.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR
import ai.koog.agents.memory.feature.history.RetrieveFactsFromHistory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = RetrieveFactsFromHistory(
            Concept(
                keyword = "user_preferences", 
                // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
                description = "User's preferences for the recommendation system, including the preferred conversation style, theme in the application, etc.",
                // LLM은 이 개념과 관련된 여러 관련 사실을 검색합니다:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "product_details",
                // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
                description = "Brief details about products in the catalog the user has been checking",
                // LLM은 이 개념과 관련된 여러 관련 사실을 검색합니다:
                factType = FactType.MULTIPLE
            ),
            Concept(
                keyword = "issue_solved",
                // LLM에 대한 설명 -- 구체적으로 무엇을 검색할지
                description = "Was the initial user's issue resolved?",
                // LLM은 질문에 대한 단일 답변을 검색합니다:
                factType = FactType.SINGLE
            )
        )
    )
}
```
<!--- KNIT example-history-compression-11.kt -->

## 커스텀 히스토리 압축 전략 구현

`HistoryCompressionStrategy` 추상 클래스를 확장하고 `compress` 메서드를 구현하여 자신만의 히스토리 압축 전략을 만들 수 있습니다.

다음은 예시입니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.session.AIAgentLLMWriteSession
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.prompt.message.Message
-->
```kotlin
class MyCustomCompressionStrategy : HistoryCompressionStrategy() {
    override suspend fun compress(
        llmSession: AIAgentLLMWriteSession,
        preserveMemory: Boolean,
        memoryMessages: List<Message>
    ) {
        // 1. llmSession.prompt.messages에서 현재 히스토리 처리
        // 2. 새로운 압축된 메시지 생성
        // 3. 압축된 메시지로 프롬프트 업데이트

        // 예시 구현:
        val importantMessages = llmSession.prompt.messages.filter {
            // 사용자 정의 필터링 로직
            it.content.contains("important")
        }.filterIsInstance<Message.Response>()
        
        // 참고: `llmSession`을 사용하여 LLM 요청을 수행하고, 예를 들어 `llmSession.requestLLMWithoutTools()`를 사용하여 LLM에게 작업을 수행하도록 요청할 수도 있습니다.
        // 또는 현재 모델을 변경하여(`llmSession.model = AnthropicModels.Sonnet_3_7`) 다른 LLM 모델에 요청할 수도 있지만, 나중에 다시 원래대로 변경하는 것을 잊지 마세요.

        // 필터링된 메시지로 프롬프트 구성
        composePromptWithRequiredMessages(
            llmSession,
            importantMessages,
            preserveMemory,
            memoryMessages
        )
    }
}
```
<!--- KNIT example-history-compression-12.kt -->

이 예시에서 커스텀 전략은 "important"라는 단어를 포함하는 메시지를 필터링하고 압축된 히스토리에 해당 메시지만 유지합니다.

그런 다음 다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.example.exampleHistoryCompression12.MyCustomCompressionStrategy

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = MyCustomCompressionStrategy()
)
```
<!--- KNIT example-history-compression-13.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR
import ai.koog.agents.example.exampleHistoryCompression12.MyCustomCompressionStrategy

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(strategy = MyCustomCompressionStrategy())
}
```
<!--- KNIT example-history-compression-14.kt -->

## 압축 중 메모리 보존

모든 히스토리 압축 메서드에는 압축 중에 메모리 관련 메시지를 보존할지 여부를 결정하는 `preserveMemory` 매개변수가 있습니다.
이 메시지들은 메모리에서 검색된 사실을 포함하거나 메모리 기능이 활성화되지 않았음을 나타냅니다.

`preserveMemory` 매개변수를 다음과 같이 사용할 수 있습니다:

* 전략 그래프에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<ProcessedInput>(
    strategy = HistoryCompressionStrategy.WholeHistory,
    preserveMemory = true
)
```
<!--- KNIT example-history-compression-15.kt -->

* 커스텀 노드에서:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

typealias ProcessedInput = String

val strategy = strategy<String, String>("strategy_name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(
        strategy = HistoryCompressionStrategy.WholeHistory,
        preserveMemory = true
    )
}
```
<!--- KNIT example-history-compression-16.kt -->