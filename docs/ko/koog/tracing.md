# 트레이싱

이 페이지는 AI 에이전트를 위한 포괄적인 트레이싱 기능을 제공하는 트레이싱 기능에 대한 세부 정보를 포함합니다.

## 기능 개요

트레이싱 기능은 에이전트 실행에 대한 상세 정보를 캡처하는 강력한 모니터링 및 디버깅 도구입니다. 포함하는 정보는 다음과 같습니다:

- 에이전트 생성 및 초기화
- 전략 실행
- LLM 호출
- 도구 호출
- 에이전트 그래프 내 노드 실행

이 기능은 에이전트 파이프라인의 주요 이벤트를 가로채어 구성 가능한 메시지 처리기로 전달하는 방식으로 작동합니다. 이 처리기들은 트레이스 정보를 로그 파일 또는 파일 시스템과 같은 다양한 대상으로 출력할 수 있으며, 이를 통해 개발자는 에이전트 동작에 대한 통찰력을 얻고 문제를 효과적으로 해결할 수 있습니다.

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

```kotlin
// 트레이스 메시지의 대상으로 사용될 로거/파일 정의
val logger = LoggerFactory.create("my.trace.logger")
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/trace.log")

// 에이전트 생성
val agent = AIAgent(...) {
    install(Tracing) {
        // 트레이스 이벤트를 처리하도록 메시지 처리기 구성
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
        addMessageProcessor(TraceFeatureMessageFileWriter(outputPath, fileSystem::sink))

        // 선택적으로 메시지 필터링
        messageFilter = { message ->
            // LLM 호출 및 도구 호출만 트레이스
            message is LLMCallStartEvent || message is ToolCallEvent
        }
    }
}
```

### 메시지 필터링

모든 기존 이벤트를 처리하거나 특정 기준에 따라 일부 이벤트를 선택할 수 있습니다. 메시지 필터를 사용하면 처리할 이벤트를 제어할 수 있습니다. 이는 에이전트 실행의 특정 측면에 집중하는 데 유용합니다:

```kotlin
// LLM 관련 이벤트만 필터링
messageFilter = { message ->
    message is LLMCallStartEvent ||
            message is LLMCallEndEvent ||
            message is LLMCallWithToolsStartEvent ||
            message is LLMCallWithToolsEndEvent
}

// 도구 관련 이벤트만 필터링
messageFilter = { message ->
    message is ToolCallsEvent ||
            message is ToolCallResultEvent ||
            message is ToolValidationErrorEvent ||
            message is ToolCallFailureEvent
}

// 노드 실행 이벤트만 필터링
messageFilter = { message ->
    message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
}
```

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

```kotlin
// 로거 생성
val logger = LoggerFactory.create("my.agent.trace")

// 트레이싱을 사용하여 에이전트 생성
val agent = AIAgent(...) {
    install(Tracing) {
        addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    }
}

// 에이전트 실행
agent.run("Hello, agent!")
```

## 오류 처리 및 예외 상황

### 메시지 처리기 없음

트레이싱 기능에 메시지 처리기가 추가되지 않으면 경고가 기록됩니다:

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```

이 기능은 여전히 이벤트를 가로채지만, 어디에서도 처리되거나 출력되지 않습니다.

### 리소스 관리

메시지 처리기는 적절히 해제되어야 하는 리소스(예: 파일 핸들)를 보유할 수 있습니다. `use` 확장 함수를 사용하여 적절한 정리를 보장하십시오:

```kotlin
TraceFeatureMessageFileWriter(fs, path).use { writer ->
    // 작성기 사용
    install(Tracing) {
        addMessageProcessor(writer)
    }

    // 에이전트 실행
    agent.run(input)

    // 블록이 종료될 때 작성기가 자동으로 닫힙니다.
}
```

### 특정 이벤트를 파일로 트레이싱

```kotlin
// 파일 작성기 생성
val fs = JVMFileSystemProvider.ReadWrite
val path = Paths.get("/path/to/llm-calls.log")
val writer = TraceFeatureMessageFileWriter(fs, path)

// 필터링된 트레이싱으로 에이전트 생성
val agent = AIAgent(...) {
    install(Tracing) {
        // LLM 호출만 트레이스
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// 에이전트 실행
agent.run("Generate a story about a robot.")
```

### 특정 이벤트를 원격 엔드포인트로 트레이싱

```kotlin
// 파일 작성기 생성
val port = 8080
val serverConfig = ServerConnectionConfig(port = port)
val writer = TraceFeatureMessageRemoteWriter(connectionConfig = serverConfig)

// 필터링된 트레이싱으로 에이전트 생성
val agent = AIAgent(...) {
    install(Tracing) {
        // LLM 호출만 트레이스
        messageFilter = { message ->
            message is LLMCallWithToolsStartEvent || message is LLMCallWithToolsEndEvent
        }
        addMessageProcessor(writer)
    }
}

// 에이전트 실행
agent.run("Generate a story about a robot.")
```

## API 문서

트레이싱 기능은 다음 핵심 구성 요소를 가진 모듈식 아키텍처를 따릅니다:

1. [Tracing](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-tracing/index.html): 에이전트 파이프라인의 이벤트를 가로채는 주요 기능 클래스.
2. [TraceFeatureConfig](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.feature/-trace-feature-config/index.html): 기능 동작을 사용자 지정하기 위한 구성 클래스.
3. 메시지 처리기: 트레이스 이벤트를 처리하고 출력하는 구성 요소:
    - [TraceFeatureMessageLogWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-log-writer/index.html): 트레이스 이벤트를 로거에 기록합니다.
    - [TraceFeatureMessageFileWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-file-writer/index.html): 트레이스 이벤트를 파일에 기록합니다.
    - [TraceFeatureMessageRemoteWriter](https://api.koog.ai/agents/agents-features/agents-features-trace/ai.koog.agents.local.features.tracing.writer/-trace-feature-message-remote-writer/index.html): 트레이스 이벤트를 원격 서버로 보냅니다.

## FAQ 및 문제 해결

다음 섹션에는 트레이싱 기능과 관련된 자주 묻는 질문과 답변이 포함되어 있습니다.

### 에이전트 실행의 특정 부분만 트레이스하려면 어떻게 해야 합니까?

`messageFilter` 속성을 사용하여 이벤트를 필터링합니다. 예를 들어, 노드 실행만 트레이스하려면:

```kotlin
install(Tracing) {
    messageFilter = { message ->
        message is AIAgentNodeExecutionStartEvent || message is AIAgentNodeExecutionEndEvent
    }
    addMessageProcessor(writer)
}
```

### 여러 메시지 처리기를 사용할 수 있습니까?

예, 여러 메시지 처리기를 추가하여 동시에 다른 대상으로 트레이스할 수 있습니다:

```kotlin
install(Tracing) {
    addMessageProcessor(TraceFeatureMessageLogWriter(logger))
    addMessageProcessor(TraceFeatureMessageFileWriter(fs, path))
    addMessageProcessor(TraceFeatureMessageRemoteWriter(connectionConfig))
}
```

### 사용자 지정 메시지 처리기를 어떻게 생성할 수 있습니까?

`FeatureMessageProcessor` 인터페이스를 구현하십시오:

```kotlin
class CustomTraceProcessor : FeatureMessageProcessor {
    override suspend fun onMessage(message: FeatureMessage) {
        // 사용자 지정 처리 로직
        when (message) {
            is AIAgentNodeExecutionStartEvent -> {
                // 노드 시작 이벤트 처리
            }
            is LLMCallWithToolsEndEvent -> {
                // LLM 호출 종료 이벤트 처리
            }
            // 다른 이벤트 유형 처리
        }
    }
}

// 사용자 지정 처리기 사용
install(Tracing) {
    addMessageProcessor(CustomTraceProcessor())
}