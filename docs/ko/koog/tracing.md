# 트레이싱

이 페이지는 AI 에이전트를 위한 포괄적인 트레이싱 기능을 제공하는 트레이싱 기능에 대한 세부 정보를 포함합니다.

## 기능 개요

트레이싱 기능은 에이전트 실행에 대한 상세 정보를 캡처하는 강력한 모니터링 및 디버깅 도구이며, 포함하는 정보는 다음과 같습니다:

- 전략 실행
- LLM 호출
- LLM 스트리밍 (시작, 프레임, 완료, 오류)
- 도구 호출
- 에이전트 그래프 내 노드 실행

이 기능은 에이전트 파이프라인의 주요 이벤트를 가로채어 구성 가능한 메시지 처리기로 전달하는 방식으로 작동합니다. 이러한 처리기들은 트레이스 정보를 로그 파일 또는 파일 시스템의 다른 유형 파일과 같은 다양한 대상으로 출력할 수 있으며, 이를 통해 개발자는 에이전트 동작에 대한 통찰력을 얻고 문제를 효과적으로 해결할 수 있습니다.

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
import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
import ai.koog.agents.core.feature.model.events.ToolCallStartingEvent
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
        addMessageProcessor(TraceFeatureMessageFileWriter(
            outputPath,
            { path: Path -> SystemFileSystem.sink(path).buffered() }
        ))
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
import ai.koog.agents.example.exampleTracing01.outputPath
import ai.koog.agents.features.tracing.feature.Tracing
import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem

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

val fileWriter = TraceFeatureMessageFileWriter(
    outputPath,
    { path: Path -> SystemFileSystem.sink(path).buffered() }
)

addMessageProcessor(fileWriter)

// LLM 관련 이벤트만 필터링
fileWriter.setMessageFilter { message ->
    message is LLMCallStartingEvent || message is LLMCallCompletedEvent
}

// 도구 관련 이벤트만 필터링
fileWriter.setMessageFilter { message -> 
    message is ToolCallStartingEvent ||
           message is ToolCallCompletedEvent ||
           message is ToolValidationFailedEvent ||
           message is ToolCallFailedEvent
}

// 노드 실행 이벤트만 필터링
fileWriter.setMessageFilter { message -> 
    message is NodeExecutionStartingEvent || message is NodeExecutionCompletedEvent
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
    ├── AgentStartingEvent
    ├── AgentCompletedEvent
    ├── AgentExecutionFailedEvent
    ├── StrategyStartingEvent
    ├── StrategyCompletedEvent
    ├── NodeExecutionStartingEvent
    ├── NodeExecutionCompletedEvent
    ├── LLMCallStartingEvent
    ├── LLMCallCompletedEvent
    ├── LLMStreamingStartingEvent
    ├── LLMStreamingFrameReceivedEvent
    ├── LLMStreamingFailedEvent
    ├── LLMStreamingCompletedEvent
    ├── ToolCallStartingEvent
    ├── ToolValidationFailedEvent
    ├── ToolCallFailedEvent
    └── ToolCallCompletedEvent
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
    
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath, 
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )
    addMessageProcessor(fileWriter)
    
    // LLM 호출만 트레이스
    fileWriter.setMessageFilter { message ->
        message is LLMCallStartingEvent || message is LLMCallCompletedEvent
    }
}
```
<!--- KNIT example-tracing-05.kt -->

### 특정 이벤트를 원격 엔드포인트로 트레이싱

네트워크를 통해 이벤트 데이터를 보내야 할 때 원격 엔드포인트로 트레이싱을 사용합니다. 일단 시작되면, 원격 엔드포인트로의 트레이싱은 지정된 포트 번호에서 경량 서버를 시작하고 Kotlin 서버 전송 이벤트 (SSE)를 통해 이벤트를 전송합니다.

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
import ai.koog.agents.core.feature.model.events.AgentCompletedEvent
import ai.koog.agents.core.feature.model.events.DefinedFeatureEvent
import ai.koog.agents.core.feature.remote.client.config.DefaultClientConnectionConfig
import ai.koog.agents.core.feature.remote.client.FeatureMessageRemoteClient
import ai.koog.utils.io.use
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
                if (event is AgentCompletedEvent) {
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