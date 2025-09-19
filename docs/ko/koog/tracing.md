# 트레이싱

이 페이지는 AI 에이전트를 위한 포괄적인 트레이싱 기능을 제공하는 트레이싱 기능에 대한 세부 정보를 포함합니다.

## 기능 개요

트레이싱 기능은 에이전트 실행에 대한 상세 정보를 캡처하는 강력한 모니터링 및 디버깅 도구이며, 포함하는 정보는 다음과 같습니다:

- 전략 실행
- LLM 호출
- 도구 호출
- 에이전트 그래프 내 노드 실행

이 기능은 에이전트 파이프라인의 주요 이벤트를 가로채어 구성 가능한 메시지 처리기로 전달하는 방식으로 작동합니다. 이 처리기들은 트레이스 정보를 로그 파일 또는 파일 시스템의 다른 유형 파일과 같은 다양한 대상으로 출력할 수 있으며, 이를 통해 개발자는 에이전트 동작에 대한 통찰력을 얻고 문제를 효과적으로 해결할 수 있습니다.

### 이벤트 흐름

1. 트레이싱 기능은 에이전트 파이프라인의 이벤트를 가로챕니다.
2. 이벤트는 구성된 메시지 필터를 기반으로 필터링됩니다.
3. 필터링된 이벤트는 등록된 메시지 처리기로 전달됩니다.
4. 메시지 처리기는 이벤트를 포맷하고 각 대상에 출력합니다.

## 구성 및 초기화

### 기본 설정

트레이싱 기능을 사용하려면 다음이 필요합니다:

1. 하나 이상의 메시지 처리기가 있어야 합니다(기존 처리기를 사용하거나 직접 생성할 수 있습니다).
2. 에이전트에 `Tracing`을(를) 설치합니다.
3. 메시지 필터를 구성합니다(선택 사항).
4. 기능에 메시지 처리기를 추가합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.ToolCallEvent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
-->
```kotlin
// 트레이스 메시지의 대상으로 사용될 로거/파일 정의 
val logger = KotlinLogging.logger { }
val outputPath = Path("/path/to/trace.log")

// 에이전트 생성
val agent = AIAgent(
   promptExecutor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
      // 트레이스 이벤트를 처리하도록 메시지 처리기 구성
      addMessageProcessor(TraceFeatureMessageLogWriter(logger))
      addMessageProcessor(
         TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
         )
      )

      // 선택적으로 메시지 필터링
      messageFilter = { message ->
         // LLM 호출 및 도구 호출만 트레이스
         message is AfterLLMCallEvent || message is ToolCallEvent
      }
   }
}
```
<!--- KNIT example-tracing-01.kt -->

### 메시지 필터링

모든 기존 이벤트를 처리하거나 특정 기준에 따라 일부 이벤트를 선택할 수 있습니다.
메시지 필터는 처리할 이벤트를 제어할 수 있도록 합니다. 이는 에이전트 실행의 특정 측면에 집중하는 데 유용합니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.*
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
   promptExecutor = simpleOllamaAIExecutor(),
   llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
   install(Tracing) {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// LLM 관련 이벤트만 필터링
messageFilter = { message -> 
    message is BeforeLLMCallEvent || message is AfterLLMCallEvent
}

// 도구 관련 이벤트만 필터링
messageFilter = { message -> 
    message is ToolCallEvent ||
           message is ToolCallResultEvent ||
           message is ToolValidationErrorEvent ||
           message is ToolCallFailureEvent
}

// 노드 실행 이벤트만 필터링
messageFilter = { message -> 
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```
<!--- KNIT example-tracing-02.kt -->

### 대량 트레이스 볼륨

복잡한 전략이나 장기 실행 에이전트의 경우 트레이스 이벤트의 볼륨이 상당할 수 있습니다. 이벤트 볼륨을 관리하려면 다음 방법을 사용하는 것을 고려하십시오:

- 특정 메시지 필터를 사용하여 이벤트 수를 줄입니다.
- 버퍼링 또는 샘플링 기능이 있는 사용자 지정 메시지 처리기를 구현합니다.
- 로그 파일이 너무 커지는 것을 방지하기 위해 파일 로테이션을 사용합니다.

### 의존성 그래프

트레이싱 기능은 다음 의존성을 가집니다:

```
Tracing
├── AIAgentPipeline (for intercepting events)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (from ai.koog.agents.core.feature.model)
    ├── AIAgentStartedEvent
    ├── AIAgentFinishedEvent
    ├── AIAgentRunErrorEvent
    ├── AIAgentStrategyStartEvent
    ├── AIAgentStrategyFinishedEvent
    ├── AIAgentNodeExecutionStartEvent
    ├── AIAgentNodeExecutionEndEvent
    ├── LLMCallStartEvent
    ├── LLMCallWithToolsStartEvent
    ├── LLMCallEndEvent
    ├── LLMCallWithToolsEndEvent
    ├── ToolCallEvent
    ├── ToolValidationErrorEvent
    ├── ToolCallFailureEvent
    └── ToolCallResultEvent
```

## 예시 및 빠른 시작

### 로거로 기본 트레이싱

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.runBlocking
-->
```kotlin
// 로거 생성
val logger = KotlinLogging.logger { }

fun main() {
    runBlocking {
       // 트레이싱을 사용하여 에이전트 생성
       val agent = AIAgent(
          promptExecutor = simpleOllamaAIExecutor(),
          llmModel = OllamaModels.Meta.LLAMA_3_2,
       ) {
          install(Tracing) {
             addMessageProcessor(TraceFeatureMessageLogWriter(logger))
          }
       }

       // 에이전트 실행
       agent.run("Hello, agent!")
    }
}
```
<!--- KNIT example-tracing-03.kt -->

## 오류 처리 및 예외 상황

### 메시지 처리기 없음

트레이싱 기능에 메시지 처리기가 추가되지 않으면 경고가 기록됩니다:

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

이 기능은 여전히 이벤트를 가로채지만, 어디에서도 처리되거나 출력되지 않습니다.

### 리소스 관리

메시지 처리기는 적절히 해제되어야 하는 리소스(예: 파일 핸들)를 보유할 수 있습니다. `use` 확장 함수를 사용하여 적절한 정리를 보장하십시오:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
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
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// 에이전트 생성
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val writer = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// 에이전트 실행
agent.run(input)
// 블록이 종료될 때 작성기가 자동으로 닫힙니다.
```
<!--- KNIT example-tracing-04.kt -->

### 특정 이벤트를 파일로 트레이싱

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.BeforeLLMCallEvent
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
        // 에이전트 생성
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
    // LLM 호출만 트레이스
    messageFilter = { message ->
        message is BeforeLLMCallEvent || message is AfterLLMCallEvent
    }
    addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-05.kt -->

### 특정 이벤트를 원격 엔드포인트로 트레이싱

네트워크를 통해 이벤트 데이터를 보내야 할 때 원격 엔드포인트로 트레이싱을 사용합니다. 일단 시작되면, 원격 엔드포인트로의 트레이싱은 지정된 포트 번호에서 경량 서버를 시작하고 Kotlin 서버-센트 이벤트(SSE)를 통해 이벤트를 전송합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// 에이전트 생성
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    val connectionConfig = DefaultServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(
        connectionConfig = connectionConfig
    )

    install(Tracing) {
        addMessageProcessor(writer)
    }
}
// 에이전트 실행
agent.run(input)
// 블록이 종료될 때 작성기가 자동으로 닫힙니다.
```
<!--- KNIT example-tracing-06.kt -->

클라이언트 측에서는 `FeatureMessageRemoteClient`를 사용하여 이벤트를 수신하고 역직렬화할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.feature.model.events.AIAgentFinishedEvent
import ai.koog.agents.core.feature.model.events.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.DefaultClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.agents.utils.use
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.consumeAsFlow

const val input = "What's the weather like in New York?"
const val port = 4991
const val host = "localhost"

fun main() {
   runBlocking {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
val clientConfig = DefaultClientConnectionConfig(host = host, port = port, protocol = URLProtocol.HTTP)
val agentEvents = mutableListOf<DefinedFeatureEvent>()

val clientJob = launch {
    FeatureMessageRemoteClient(connectionConfig = clientConfig, scope = this).use { client ->
        val collectEventsJob = launch {
            client.receivedMessages.consumeAsFlow().collect { event ->
                // 서버에서 이벤트 수집
                agentEvents.add(event as DefinedFeatureEvent)

                // 에이전트 완료 시 이벤트 수집 중지
                if (event is AIAgentFinishedEvent) {
                    cancel()
                }
            }
        }
        client.connect()
        collectEventsJob.join()
        client.healthCheck()
    }
}

listOf(clientJob).joinAll()
```
<!--- KNIT example-tracing-07.kt -->

## API 문서

트레이싱 기능은 다음 핵심 구성 요소를 가진 모듈식 아키텍처를 따릅니다:

1. [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-tracing/index.html): 에이전트 파이프라인의 이벤트를 가로채는 주요 기능 클래스.
2. [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.feature/-trace-feature-config/index.html): 기능 동작을 사용자 지정하기 위한 구성 클래스.
3. 메시지 처리기: 트레이스 이벤트를 처리하고 출력하는 구성 요소:
    - [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-log-writer/index.html): 트레이스 이벤트를 로거에 기록합니다.
    - [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-file-writer/index.html): 트레이스 이벤트를 파일에 기록합니다.
    - [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.features.tracing.writer/-trace-feature-message-remote-writer/index.html): 트레이스 이벤트를 원격 서버로 보냅니다.

## FAQ 및 문제 해결

다음 섹션에는 트레이싱 기능과 관련된 자주 묻는 질문과 답변이 포함되어 있습니다. 

### 에이전트 실행의 특정 부분만 트레이스하려면 어떻게 해야 합니까?

`messageFilter` 속성을 사용하여 이벤트를 필터링합니다. 예를 들어, LLM 호출만 트레이스하려면:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
import ai.koog.agents.core.feature.model.events.BeforeLLMCallEvent
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
        // 에이전트 생성
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
   // LLM 호출만 트레이스
   messageFilter = { message ->
      message is BeforeLLMCallEvent || message is AfterLLMCallEvent
   }
   addMessageProcessor(writer)
}
```
<!--- KNIT example-tracing-08.kt -->

### 여러 메시지 처리기를 사용할 수 있습니까?

예, 여러 메시지 처리기를 추가하여 동시에 다른 대상으로 트레이스할 수 있습니다:

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
      // 에이전트 생성
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
<!--- KNIT example-tracing-09.kt -->

### 사용자 지정 메시지 처리기를 어떻게 생성할 수 있습니까?

`FeatureMessageProcessor` 인터페이스를 구현하십시오:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.model.events.AIAgentNodeExecutionStartEvent
import ai.koog.agents.core.feature.model.events.AfterLLMCallEvent
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
      // 에이전트 생성
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

    // 처리기의 현재 열린 상태
    private var _isOpen = MutableStateFlow(false)

    override val isOpen: StateFlow<Boolean>
        get() = _isOpen.asStateFlow()
    
    override suspend fun processMessage(message: FeatureMessage) {
        // 사용자 지정 처리 로직
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // 노드 시작 이벤트 처리
            }

            is AfterLLMCallEvent -> {
                // LLM 호출 종료 이벤트 처리
           }
            // 다른 이벤트 유형 처리 
        }
    }

    override suspend fun close() {
        // 설정된 연결 닫기
    }
}

// 사용자 지정 처리기 사용
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}
```
<!--- KNIT example-tracing-10.kt -->

메시지 처리기가 처리할 수 있는 기존 이벤트 유형에 대한 자세한 내용은 [사전 정의된 이벤트 유형](#predefined-event-types)을 참조하십시오.

## 사전 정의된 이벤트 유형

Koog는 사용자 지정 메시지 처리기에서 사용할 수 있는 사전 정의된 이벤트 유형을 제공합니다. 사전 정의된 이벤트는 관련 엔티티에 따라 여러 범주로 분류될 수 있습니다:

- [에이전트 이벤트](#agent-events)
- [전략 이벤트](#strategy-events)
- [노드 이벤트](#node-events)
- [LLM 호출 이벤트](#llm-call-events)
- [도구 호출 이벤트](#tool-call-events)

### 에이전트 이벤트

#### AIAgentStartedEvent

에이전트 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 여부 | 기본값               | 설명                                                               |
|----------------|-----------|----------|-----------------------|--------------------------------------------------------------------|
| `strategyName` | String    | Yes      |                       | 에이전트가 따라야 할 전략의 이름입니다.                                |
| `eventId`      | String    | No       | `AIAgentStartedEvent` | 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### AIAgentFinishedEvent

에이전트 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 여부 | 기본값                | 설명                                                               |
|----------------|-----------|----------|-----------------------|--------------------------------------------------------------------|
| `strategyName` | String    | Yes      |                       | 에이전트가 따른 전략의 이름입니다.                                     |
| `result`       | String    | Yes      |                       | 에이전트 실행 결과. 결과가 없으면 `null`일 수 있습니다.          |
| `eventId`      | String    | No       | `AIAgentFinishedEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### AIAgentRunErrorEvent

에이전트 실행 중 오류 발생을 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입    | 필수 여부 | 기본값                | 설명                                                                                                     |
|----------------|--------------|----------|-----------------------|----------------------------------------------------------------------------------------------------------|
| `strategyName` | String       | Yes      |                       | 에이전트가 따른 전략의 이름입니다.                                                                       |
| `error`        | AIAgentError | Yes      |                       | 에이전트 실행 중 발생한 특정 오류. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하십시오. |
| `eventId`      | String       | No       | `AIAgentRunErrorEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다.                                            |

<a id="aiagenterror"></a>
`AIAgentError` 클래스는 에이전트 실행 중 발생한 오류에 대한 자세한 정보를 제공합니다. 다음 필드를 포함합니다:

| 이름         | 데이터 타입 | 필수 여부 | 기본값 | 설명                                                      |
|--------------|-----------|----------|--------|-----------------------------------------------------------|
| `message`    | String    | Yes      |        | 특정 오류에 대한 자세한 정보를 제공하는 메시지입니다.       |
| `stackTrace` | String    | Yes      |        | 마지막으로 실행된 코드까지의 스택 기록 모음입니다.          |
| `cause`      | String    | No       | null   | 오류의 원인(있는 경우).                                     |

### 전략 이벤트

#### AIAgentStrategyStartEvent

전략 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 여부 | 기본값                     | 설명                                                               |
|----------------|-----------|----------|----------------------------|--------------------------------------------------------------------|
| `strategyName` | String    | Yes      |                            | 전략의 이름입니다.                                                 |
| `eventId`      | String    | No       | `AIAgentStrategyStartEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### AIAgentStrategyFinishedEvent

전략 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 여부 | 기본값                        | 설명                                                               |
|----------------|-----------|----------|-----------------------------|--------------------------------------------------------------------|
| `strategyName` | String    | Yes      |                             | 전략의 이름입니다.                                                 |
| `result`       | String    | Yes      |                             | 실행 결과.                                                         |
| `eventId`      | String    | No       | `AIAgentStrategyFinishedEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

### 노드 이벤트

#### AIAgentNodeExecutionStartEvent

노드 실행의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입 | 필수 여부 | 기본값                          | 설명                                                               |
|------------|-----------|----------|---------------------------------|--------------------------------------------------------------------|
| `nodeName` | String    | Yes      |                                 | 실행이 시작된 노드의 이름입니다.                                   |
| `input`    | String    | Yes      |                                 | 노드에 대한 입력 값입니다.                                         |
| `eventId`  | String    | No       | `AIAgentNodeExecutionStartEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### AIAgentNodeExecutionEndEvent

노드 실행의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입 | 필수 여부 | 기본값                        | 설명                                                               |
|------------|-----------|----------|-----------------------------|--------------------------------------------------------------------|
| `nodeName` | String    | Yes      |                             | 실행이 종료된 노드의 이름입니다.                                   |
| `input`    | String    | Yes      |                             | 노드에 대한 입력 값입니다.                                         |
| `output`   | String    | Yes      |                             | 노드에 의해 생성된 출력 값입니다.                                  |
| `eventId`  | String    | No       | `AIAgentNodeExecutionEndEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

### LLM 호출 이벤트

#### LLMCallStartEvent

LLM 호출의 시작을 나타냅니다. 다음 필드를 포함합니다:

| 이름      | 데이터 타입          | 필수 여부 | 기본값             | 설명                                                                        |
|-----------|--------------------|----------|--------------------|-----------------------------------------------------------------------------|
| `prompt`  | Prompt             | Yes      |                    | 모델로 전송되는 프롬프트. 자세한 내용은 [Prompt](#prompt)를 참조하십시오. |
| `tools`   | List&lt;String&gt; | Yes      |                    | 모델이 호출할 수 있는 도구 목록입니다.                                       |
| `eventId` | String             | No       | `LLMCallStartEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다.             |

<a id="prompt"></a>
`Prompt` 클래스는 메시지 목록, 고유 식별자 및 언어 모델 설정에 대한 선택적 매개변수로 구성된 프롬프트의 데이터 구조를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입           | 필수 여부 | 기본값     | 설명                                                  |
|------------|---------------------|----------|------------|-------------------------------------------------------|
| `messages` | List&lt;Message&gt; | Yes      |            | 프롬프트가 구성되는 메시지 목록입니다.                |
| `id`       | String              | Yes      |            | 프롬프트의 고유 식별자입니다.                         |
| `params`   | LLMParams           | No       | LLMParams()| LLM이 콘텐츠를 생성하는 방식을 제어하는 설정입니다.   |

#### LLMCallEndEvent

LLM 호출의 종료를 나타냅니다. 다음 필드를 포함합니다:

| 이름        | 데이터 타입                    | 필수 여부 | 기본값           | 설명                                                               |
|-------------|------------------------------|----------|-------------------|--------------------------------------------------------------------|
| `responses` | List&lt;Message.Response&gt; | Yes      |                   | 모델이 반환한 하나 이상의 응답입니다.                                |
| `eventId`   | String                       | No       | `LLMCallEndEvent` | 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

### 도구 호출 이벤트

#### ToolCallEvent

모델이 도구를 호출하는 이벤트를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입 | 필수 여부 | 기본값         | 설명                                                               |
|------------|-----------|----------|----------------|--------------------------------------------------------------------|
| `toolName` | String    | Yes      |                | 도구의 이름입니다.                                                 |
| `toolArgs` | Tool.Args | Yes      |                | 도구에 제공되는 인수입니다.                                        |
| `eventId`  | String    | No       | `ToolCallEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### ToolValidationErrorEvent

도구 호출 중 유효성 검사 오류 발생을 나타냅니다. 다음 필드를 포함합니다:

| 이름           | 데이터 타입 | 필수 여부 | 기본값                    | 설명                                                               |
|----------------|-----------|----------|----------------------------|--------------------------------------------------------------------|
| `toolName`     | String    | Yes      |                            | 유효성 검사에 실패한 도구의 이름입니다.                            |
| `toolArgs`     | Tool.Args | Yes      |                            | 도구에 제공되는 인수입니다.                                        |
| `errorMessage` | String    | Yes      |                            | 유효성 검사 오류 메시지입니다.                                     |
| `eventId`      | String    | No       | `ToolValidationErrorEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |

#### ToolCallFailureEvent

도구 호출 실패를 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입    | 필수 여부 | 기본값                | 설명                                                                                                           |
|------------|--------------|----------|-----------------------|----------------------------------------------------------------------------------------------------------------|
| `toolName` | String       | Yes      |                       | 도구의 이름입니다.                                                                                             |
| `toolArgs` | Tool.Args    | Yes      |                       | 도구에 제공되는 인수입니다.                                                                                    |
| `error`    | AIAgentError | Yes      |                       | 도구를 호출하려 할 때 발생한 특정 오류. 자세한 내용은 [AIAgentError](#aiagenterror)를 참조하십시오. |
| `eventId`  | String       | No       | `ToolCallFailureEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다.                                                  |

#### ToolCallResultEvent

결과 반환과 함께 성공적인 도구 호출을 나타냅니다. 다음 필드를 포함합니다:

| 이름       | 데이터 타입  | 필수 여부 | 기본값               | 설명                                                               |
|------------|------------|----------|-----------------------|--------------------------------------------------------------------|
| `toolName` | String     | Yes      |                       | 도구의 이름입니다.                                                 |
| `toolArgs` | Tool.Args  | Yes      |                       | 도구에 제공되는 인수입니다.                                        |
| `result`   | ToolResult | Yes      |                       | 도구 호출 결과.                                                    |
| `eventId`  | String     | No       | `ToolCallResultEvent`| 이벤트 식별자. 일반적으로 이벤트 클래스의 `simpleName`입니다. |