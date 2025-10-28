# 에이전트 이벤트

에이전트 이벤트는 에이전트 워크플로의 일부로 발생하는 동작 또는 상호 작용입니다. 다음을 포함합니다:

- 에이전트 라이프사이클 이벤트
- 전략 이벤트
- 노드 실행 이벤트
- LLM 호출 이벤트
- LLM 스트리밍 이벤트
- 도구 실행 이벤트

참고: 기능(Feature) 이벤트는 `agents-core` 모듈에 정의되어 있으며, `ai.koog.agents.core.feature.model.events` 패키지 아래에 있습니다. 예를 들어, `agents-features-trace`, `agents-features-debugger`, `agents-features-event-handler`와 같은 기능들은 이러한 이벤트를 사용하여 에이전트 실행 중에 생성된 메시지를 처리하고 전달합니다.

## 사전 정의된 이벤트 유형

Koog는 사용자 정의 메시지 프로세서에서 사용할 수 있는 사전 정의된 이벤트 유형을 제공합니다. 사전 정의된 이벤트는 관련 엔티티에 따라 여러 카테고리로 분류될 수 있습니다:

- [에이전트 이벤트](#agent-events)
- [전략 이벤트](#strategy-events)
- [노드 이벤트](#node-events)
- [LLM 호출 이벤트](#llm-call-events)
- [LLM 스트리밍 이벤트](#llm-streaming-events)
- [도구 실행 이벤트](#tool-execution-events)

### 에이전트 이벤트

#### AgentStartingEvent

에이전트 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름      | 데이터 타입 | 필수 | 기본값 | 설명                        |
|-----------|-----------|----|------|-----------------------------|
| `agentId` | String    | Yes  |      | AI 에이전트의 고유 식별자. |
| `runId`   | String    | Yes  |      | AI 에이전트 실행의 고유 식별자. |

#### AgentCompletedEvent

에이전트 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름      | 데이터 타입 | 필수 | 기본값 | 설명                                        |
|-----------|-----------|----|------|---------------------------------------------|
| `agentId` | String    | Yes  |      | AI 에이전트의 고유 식별자.                  |
| `runId`   | String    | Yes  |      | AI 에이전트 실행의 고유 식별자.             |
| `result`  | String    | Yes  |      | 에이전트 실행 결과입니다. 결과가 없는 경우 `null`일 수 있습니다. |

#### AgentExecutionFailedEvent

에이전트 실행 중 오류 발생을 나타냅니다. 다음 필드를 포함합니다:

| 이름      | 데이터 타입  | 필수 | 기본값 | 설명                                                                                                                              |
|-----------|--------------|----|------|-----------------------------------------------------------------------------------------------------------------------------------|
| `agentId` | String       | Yes  |      | AI 에이전트의 고유 식별자.                                                                                                        |
| `runId`   | String       | Yes  |      | AI 에이전트 실행의 고유 식별자.                                                                                                   |
| `error`   | AIAgentError | Yes  |      | 에이전트 실행 중에 발생한 특정 오류입니다. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하세요. |

#### AgentClosingEvent

에이전트의 종료 또는 중단을 나타냅니다. 다음 필드를 포함합니다:

| 이름      | 데이터 타입 | 필수 | 기본값 | 설명                        |
|-----------|-----------|----|------|-----------------------------|
| `agentId` | String    | Yes  |      | AI 에이전트의 고유 식별자. |

<a id="aiagenterror"></a>
`AIAgentError` 클래스는 에이전트 실행 중 발생한 오류에 대한 자세한 정보를 제공합니다. 다음 필드를 포함합니다:

| 이름         | 데이터 타입 | 필수 | 기본값 | 설명                                     |
|--------------|-----------|----|------|------------------------------------------|
| `message`    | String    | Yes  |      | 특정 오류에 대한 자세한 정보를 제공하는 메시지입니다. |
| `stackTrace` | String    | Yes  |      | 마지막으로 실행된 코드까지의 스택 레코드 모음입니다.    |
| `cause`      | String    | No   | null | 오류의 원인(사용 가능한 경우).                 |

### 전략 이벤트

#### GraphStrategyStartingEvent

그래프 기반 전략 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름            | 데이터 타입         | 필수 | 기본값 | 설명                                    |
|-----------------|---------------------|----|------|-----------------------------------------|
| `runId`         | String              | Yes  |      | 전략 실행의 고유 식별자.                |
| `strategyName`  | String              | Yes  |      | 전략의 이름입니다.                      |
| `graph`         | StrategyEventGraph  | Yes  |      | 전략 워크플로를 나타내는 그래프 구조입니다. |

#### FunctionalStrategyStartingEvent

함수형(functional) 전략 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름            | 데이터 타입 | 필수 | 기본값 | 설명                         |
|-----------------|-----------|----|------|------------------------------|
| `runId`         | String    | Yes  |      | 전략 실행의 고유 식별자.     |
| `strategyName`  | String    | Yes  |      | 전략의 이름입니다.           |

#### StrategyCompletedEvent

전략 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 | 기본값 | 설명                                   |
|----------------|-----------|----|------|----------------------------------------|
| `runId`        | String    | Yes  |      | 전략 실행의 고유 식별자.               |
| `strategyName` | String    | Yes  |      | 전략의 이름입니다.                     |
| `result`       | String    | Yes  |      | 실행 결과입니다. 결과가 없는 경우 `null`일 수 있습니다. |

### 노드 이벤트

#### NodeExecutionStartingEvent

노드 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입 | 필수 | 기본값 | 설명                           |
|------------|-----------|----|------|--------------------------------|
| `runId`    | String    | Yes  |      | 전략 실행의 고유 식별자.       |
| `nodeName` | String    | Yes  |      | 실행이 시작된 노드의 이름입니다. |
| `input`    | String    | Yes  |      | 노드의 입력값입니다.           |

#### NodeExecutionCompletedEvent

노드 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입 | 필수 | 기본값 | 설명                           |
|------------|-----------|----|------|--------------------------------|
| `runId`    | String    | Yes  |      | 전략 실행의 고유 식별자.       |
| `nodeName` | String    | Yes  |      | 실행이 종료된 노드의 이름입니다. |
| `input`    | String    | Yes  |      | 노드의 입력값입니다.           |
| `output`   | String    | Yes  |      | 노드에 의해 생성된 출력값입니다. |

#### NodeExecutionFailedEvent

노드 실행 중에 발생한 오류를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입  | 필수 | 기본값 | 설명                                                                                                                              |
|------------|--------------|----|------|-----------------------------------------------------------------------------------------------------------------------------------|
| `runId`    | String       | Yes  |      | 전략 실행의 고유 식별자.                                                                                                        |
| `nodeName` | String       | Yes  |      | 오류가 발생한 노드의 이름입니다.                                                                                                  |
| `error`    | AIAgentError | Yes  |      | 노드 실행 중에 발생한 특정 오류입니다. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하세요. |

### LLM 호출 이벤트

#### LLMCallStartingEvent

LLM 호출의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름     | 데이터 타입 | 필수 | 기본값 | 설명                                                                                   |
|----------|-------------|----|------|----------------------------------------------------------------------------------------|
| `runId`  | String      | Yes  |      | LLM 실행의 고유 식별자.                                                                |
| `prompt` | Prompt      | Yes  |      | 모델로 전송되는 프롬프트입니다. 자세한 내용은 [Prompt](#prompt)를 참조하세요. |
| `model`  | String      | Yes  |      | `llm_provider:model_id` 형식의 모델 식별자입니다.                                    |
| `tools`  | List&lt;String&gt; | Yes  |      | 모델이 호출할 수 있는 도구 목록입니다.                                                 |

<a id="prompt"></a>
`Prompt` 클래스는 메시지 목록, 고유 식별자, 언어 모델 설정에 대한 선택적 매개변수로 구성된 프롬프트의 데이터 구조를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입        | 필수 | 기본값      | 설명                                         |
|------------|--------------------|----|-----------|----------------------------------------------|
| `messages` | List&lt;Message&gt;      | Yes  |           | 프롬프트가 구성되는 메시지 목록입니다.         |
| `id`       | String             | Yes  |           | 프롬프트의 고유 식별자입니다.                |
| `params`   | LLMParams          | No   | LLMParams() | LLM이 콘텐츠를 생성하는 방식을 제어하는 설정입니다. |

#### LLMCallCompletedEvent

LLM 호출의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름                 | 데이터 타입              | 필수 | 기본값 | 설명                                        |
|----------------------|--------------------------|----|------|---------------------------------------------|
| `runId`              | String                   | Yes  |      | LLM 실행의 고유 식별자.                     |
| `prompt`             | Prompt                   | Yes  |      | 호출에 사용된 프롬프트입니다.                 |
| `model`              | String                   | Yes  |      | `llm_provider:model_id` 형식의 모델 식별자입니다. |
| `responses`          | List&lt;Message.Response&gt;   | Yes  |      | 모델에 의해 반환된 하나 이상의 응답입니다.      |
| `moderationResponse` | ModerationResult         | No   | null | 조정(moderation) 응답(있는 경우).           |

### LLM 스트리밍 이벤트

#### LLMStreamingStartingEvent

LLM 스트리밍 호출의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름     | 데이터 타입 | 필수 | 기본값 | 설명                         |
|----------|-------------|----|------|------------------------------|
| `runId`  | String      | Yes  |      | LLM 실행의 고유 식별자.      |
| `prompt` | Prompt      | Yes  |      | 모델로 전송되는 프롬프트입니다. |
| `model`  | String      | Yes  |      | `llm_provider:model_id` 형식의 모델 식별자입니다. |
| `tools`  | List&lt;String&gt; | Yes  |      | 모델이 호출할 수 있는 도구 목록입니다. |

#### LLMStreamingFrameReceivedEvent

LLM으로부터 수신된 스트리밍 프레임을 나타냅니다. 다음 필드를 포함합니다:

| 이름    | 데이터 타입 | 필수 | 기본값 | 설명                           |
|---------|-----------|----|------|--------------------------------|
| `runId` | String    | Yes  |      | LLM 실행의 고유 식별자.        |
| `frame` | StreamFrame | Yes  |      | 스트림에서 수신된 프레임입니다. |

#### LLMStreamingFailedEvent

LLM 스트리밍 호출 중 오류 발생을 나타냅니다. 다음 필드를 포함합니다:

| 이름    | 데이터 타입  | 필수 | 기본값 | 설명                                                                                                                              |
|---------|--------------|----|------|-----------------------------------------------------------------------------------------------------------------------------------|
| `runId` | String       | Yes  |      | LLM 실행의 고유 식별자.                                                                                                         |
| `error` | AIAgentError | Yes  |      | 스트리밍 중에 발생한 특정 오류입니다. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하세요. |

#### LLMStreamingCompletedEvent

LLM 스트리밍 호출의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름     | 데이터 타입 | 필수 | 기본값 | 설명                         |
|----------|-------------|----|------|------------------------------|
| `runId`  | String      | Yes  |      | LLM 실행의 고유 식별자.      |
| `prompt` | Prompt      | Yes  |      | 모델로 전송되는 프롬프트입니다. |
| `model`  | String      | Yes  |      | `llm_provider:model_id` 형식의 모델 식별자입니다. |
| `tools`  | List&lt;String&gt; | Yes  |      | 모델이 호출할 수 있는 도구 목록입니다. |

### 도구 실행 이벤트

#### ToolExecutionStartingEvent

모델이 도구를 호출하는 이벤트를 나타냅니다. 다음 필드를 포함합니다:

| 이름          | 데이터 타입 | 필수 | 기본값 | 설명                                |
|---------------|-------------|----|------|-------------------------------------|
| `runId`       | String      | Yes  |      | 전략/에이전트 실행의 고유 식별자.   |
| `toolCallId`  | String      | No   | null | 도구 호출 식별자(사용 가능한 경우). |
| `toolName`    | String      | Yes  |      | 도구의 이름입니다.                  |
| `toolArgs`    | JsonObject  | Yes  |      | 도구에 제공되는 인수입니다.         |

#### ToolValidationFailedEvent

도구 호출 중 유효성 검사 오류 발생을 나타냅니다. 다음 필드를 포함합니다:

| 이름          | 데이터 타입 | 필수 | 기본값 | 설명                                |
|---------------|-------------|----|------|-------------------------------------|
| `runId`       | String      | Yes  |      | 전략/에이전트 실행의 고유 식별자.   |
| `toolCallId`  | String      | No   | null | 도구 호출 식별자(사용 가능한 경우). |
| `toolName`    | String      | Yes  |      | 유효성 검사에 실패한 도구의 이름입니다. |
| `toolArgs`    | JsonObject  | Yes  |      | 도구에 제공되는 인수입니다.         |
| `error`       | String      | Yes  |      | 유효성 검사 오류 메시지입니다.      |

#### ToolExecutionFailedEvent

도구 실행 실패를 나타냅니다. 다음 필드를 포함합니다:

| 이름          | 데이터 타입  | 필수 | 기본값 | 설명                                                                                                                                                      |
|---------------|--------------|----|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `runId`       | String       | Yes  |      | 전략/에이전트 실행의 고유 식별자.                                                                                                                       |
| `toolCallId`  | String       | No   | null | 도구 호출 식별자(사용 가능한 경우).                                                                                                                     |
| `toolName`    | String       | Yes  |      | 도구의 이름입니다.                                                                                                                                      |
| `toolArgs`    | JsonObject   | Yes  |      | 도구에 제공되는 인수입니다.                                                                                                                             |
| `error`       | AIAgentError | Yes  |      | 도구를 호출하려 할 때 발생한 특정 오류입니다. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하세요. |

#### ToolExecutionCompletedEvent

결과를 반환하는 성공적인 도구 호출을 나타냅니다. 다음 필드를 포함합니다:

| 이름          | 데이터 타입 | 필수 | 기본값 | 설명                           |
|---------------|-----------|----|------|--------------------------------|
| `runId`       | String    | Yes  |      | 실행의 고유 식별자.            |
| `toolCallId`  | String    | No   | null | 도구 호출 식별자.              |
| `toolName`    | String    | Yes  |      | 도구의 이름입니다.             |
| `toolArgs`    | JsonObject | Yes  |      | 도구에 제공된 인수입니다.      |
| `result`      | String    | Yes  |      | 도구 호출 결과(nullable). |

## 자주 묻는 질문 및 문제 해결

다음 섹션에는 추적(Tracing) 기능과 관련된 자주 묻는 질문과 답변이 포함되어 있습니다.

### 에이전트 실행의 특정 부분만 추적하려면 어떻게 해야 하나요?

`messageFilter` 속성을 사용하여 이벤트를 필터링합니다. 예를 들어, LLM 호출만 추적하려면 다음을 사용합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
            val writer = TraceFeatureMessageFileWriter(
                outputPath,
                { path: Path -> SystemFileSystem.sink(path).buffered() }
            )
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath, 
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )
    addMessageProcessor(fileWriter)
    
    // LLM 호출만 추적
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-tracing-01.kt -->

### 여러 메시지 프로세서를 사용할 수 있나요?

네, 여러 메시지 프로세서를 추가하여 동시에 다른 대상으로 추적할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

const val input = "What's the weather like in New York?"
val syncOpener = { path: Path -> SystemFileSystem.sink(path).buffered() }
val logger = KotlinLogging.logger {}
val connectionConfig = DefaultServerConnectionConfig(host = ai.koog.agents.example.exampleTracing06.host, port = ai.koog.agents.example.exampleTracing06.port)

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, syncOpener))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```
<!--- KNIT example-tracing-02.kt -->

### 사용자 정의 메시지 프로세서를 어떻게 생성할 수 있나요?

`FeatureMessageProcessor` 인터페이스를 구현하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.NodeExecutionStartingEvent
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.message.FeatureMessage
import ai.koog.agents.core.feature.message.FeatureMessageProcessor
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

fun main() {
    runBlocking {
        // Creating an agent
        val agent = AIAgent(
            promptExecutor = simpleOllamaAIExecutor(),
            llmModel = OllamaModels.Meta.LLAMA_3_2,
        ) {
-->
<!--- SUFFIX
        }
    }
}
-->
```kotlin
class CustomTraceProcessor : FeatureMessageProcessor() {

    // 프로세서의 현재 열린 상태
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // 사용자 정의 처리 로직
        when (message) {
            is NodeExecutionStartingEvent -> {
                // 노드 시작 이벤트 처리
            }

            is LLMCallCompletedEvent -> {
                // LLM 호출 종료 이벤트 처리 
            }
            // 다른 이벤트 유형 처리 
        }
    }

    override suspend fun close() {
        // 설정된 연결 닫기
    }
}

// 사용자 정의 프로세서 사용
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-03.kt -->

메시지 프로세서로 처리할 수 있는 기존 이벤트 유형에 대한 자세한 내용은 [사전 정의된 이벤트 유형](#predefined-event-types)을 참조하세요.