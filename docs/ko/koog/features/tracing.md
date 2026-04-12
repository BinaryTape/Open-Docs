# 트레이싱 (Tracing)

이 페이지에는 AI 에이전트에 대한 포괄적인 트레이싱 기능을 제공하는 트레이싱(Tracing) 기능에 대한 세부 정보가 포함되어 있습니다.

## 기능 개요 (Feature overview)

트레이싱 기능은 다음을 포함하여 에이전트 실행에 대한 자세한 정보를 캡처하는 강력한 모니터링 및 디버깅 도구입니다:

- 전략(Strategy) 실행
- LLM 호출
- LLM 스트리밍 (시작, 프레임, 완료, 에러)
- 도구(Tool) 호출
- 에이전트 그래프 내의 노드 실행

이 기능은 에이전트 파이프라인의 주요 이벤트를 가로채서 구성 가능한 메시지 프로세서로 전달하는 방식으로 작동합니다. 이러한 프로세서는 트레이스 정보를 로그 파일이나 파일 시스템의 다른 유형의 파일과 같은 다양한 목적지로 출력할 수 있어, 개발자가 에이전트 동작에 대한 통찰력을 얻고 문제를 효과적으로 해결할 수 있도록 돕습니다.

### 이벤트 흐름 (Event flow)

1. 트레이싱 기능이 에이전트 파이프라인의 이벤트를 가로챕니다.
2. 구성된 메시지 필터를 기반으로 이벤트를 필터링합니다.
3. 필터링된 이벤트는 등록된 메시지 프로세서로 전달됩니다.
4. 메시지 프로세서는 이벤트를 포맷팅하여 각각의 목적지로 출력합니다.

## 구성 및 초기화

### 기본 설정 (Basic setup)

트레이싱 기능을 사용하려면 다음 단계가 필요합니다:

1. 하나 이상의 메시지 프로세서를 준비합니다 (기존 프로세서를 사용하거나 직접 생성할 수 있습니다).
2. 에이전트에 `Tracing`을 설치합니다.
3. 메시지 필터를 구성합니다 (선택 사항).
4. 해당 기능에 메시지 프로세서를 추가합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
    import ai.koog.agents.core.feature.model.events.ToolCallStartingEvent
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import io.github.oshai.kotlinlogging.KotlinLogging
    import kotlinx.io.buffered
    import kotlinx.io.files.Path
    import kotlinx.io.files.SystemFileSystem
    -->
    ```kotlin
    // 트레이스 메시지의 목적지로 사용될 로거/파일 정의 
    val logger = KotlinLogging.logger { }
    val outputPath = Path("/path/to/trace.log")
    
    // 에이전트 생성
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            // 트레이스 이벤트를 처리하도록 메시지 프로세서 구성
            addMessageProcessor(TraceFeatureMessageLogWriter(logger))
            addMessageProcessor(TraceFeatureMessageFileWriter.create(outputPath))
        }
    }
    ```
    <!--- KNIT example-tracing-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import org.slf4j.LoggerFactory;
    import java.nio.file.Path;
    public class exampleTracingJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 트레이스 메시지의 목적지로 사용될 로거/파일 정의
    var logger = LoggerFactory.getLogger("tracing");
    var outputPath = Path.of("/path/to/trace.log");

    // 에이전트 생성
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            // 트레이스 이벤트를 처리하도록 메시지 프로세서 구성
            config.addMessageProcessor(TraceFeatureMessageLogWriter.create(logger));
            config.addMessageProcessor(TraceFeatureMessageFileWriter.create(outputPath));
        })
        .build();
    ```
    <!--- KNIT exampleTracingJava01.java -->

### 메시지 필터링 (Message filtering)

모든 기존 이벤트를 처리하거나 특정 기준에 따라 일부만 선택할 수 있습니다.
메시지 필터를 사용하면 어떤 이벤트가 처리될지 제어할 수 있습니다. 이는 에이전트 실행의 특정 측면에 집중할 때 유용합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.feature.model.events.*
    import ai.koog.agents.example.exampleTracing01.outputPath
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.model.events.*;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava02 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            var agent = AIAgent.builder()
                .promptExecutor(PromptExecutor.builder().ollama().build())
                .llmModel(OllamaModels.Meta.LLAMA_3_2)
                .install(Tracing.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    var fileWriter = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    config.addMessageProcessor(fileWriter);

    // LLM 관련 이벤트만 필터링
    fileWriter.setMessageFilter(message ->
        message instanceof LLMCallStartingEvent || message instanceof LLMCallCompletedEvent
    );

    // 도구 관련 이벤트만 필터링
    fileWriter.setMessageFilter(message ->
        message instanceof ToolCallStartingEvent ||
            message instanceof ToolCallCompletedEvent ||
            message instanceof ToolValidationFailedEvent ||
            message instanceof ToolCallFailedEvent
    );

    // 노드 실행 이벤트만 필터링
    fileWriter.setMessageFilter(message ->
        message instanceof NodeExecutionStartingEvent || message instanceof NodeExecutionCompletedEvent
    );
    ```
    <!--- KNIT exampleTracingJava02.java -->

### 대규모 트레이스 볼륨 (Large trace volumes)

복잡한 전략을 가졌거나 장기 실행되는 에이전트의 경우, 트레이스 이벤트의 양이 상당할 수 있습니다. 이벤트 양을 관리하려면 다음 방법들을 고려해 보세요:

- 특정 메시지 필터를 사용하여 이벤트 수를 줄입니다.
- 버퍼링 또는 샘플링 기능을 갖춘 커스텀 메시지 프로세서를 구현합니다.
- 로그 파일이 너무 커지지 않도록 파일 로테이션(File rotation)을 사용합니다.

### 의존성 그래프 (Dependency graph)

트레이싱 기능은 다음과 같은 의존성을 가집니다:

```
Tracing
├── AIAgentPipeline (이벤트 가로채기용)
├── TraceFeatureConfig
│   └── FeatureConfig
├── Message Processors
│   ├── TraceFeatureMessageLogWriter
│   │   └── FeatureMessageLogWriter
│   ├── TraceFeatureMessageFileWriter
│   │   └── FeatureMessageFileWriter
│   └── TraceFeatureMessageRemoteWriter
│       └── FeatureMessageRemoteWriter
└── Event Types (ai.koog.agents.core.feature.model에서 제공)
    ├── AgentStartingEvent
    ├── AgentCompletedEvent
    ├── AgentExecutionFailedEvent
    ├── AgentClosingEvent
    ├── GraphStrategyStartingEvent
    ├── FunctionalStrategyStartingEvent
    ├── StrategyCompletedEvent
    ├── NodeExecutionStartingEvent
    ├── NodeExecutionCompletedEvent
    ├── NodeExecutionFailedEvent
    ├── SubgraphExecutionStartingEvent
    ├── SubgraphExecutionCompletedEvent
    ├── SubgraphExecutionFailedEvent
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
<!--- KNIT example-tracing-01.txt -->

## 예제 및 퀵스타트 (Examples and quickstarts)

### 로거로의 기본 트레이싱

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import io.github.oshai.kotlinlogging.KotlinLogging
    import kotlinx.coroutines.runBlocking
    fun main() = runBlocking {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // 로거 생성
    val logger = KotlinLogging.logger { }

    // 트레이싱이 적용된 에이전트 생성
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
    ```
    <!--- KNIT example-tracing-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import org.slf4j.LoggerFactory;
    public class exampleTracingJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 로거 생성
    var logger = LoggerFactory.getLogger("tracing");

    // 트레이싱이 적용된 에이전트 생성
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(TraceFeatureMessageLogWriter.create(logger));
        })
        .build();

    // 에이전트 실행
    agent.run("Hello, agent!");
    ```
    <!--- KNIT exampleTracingJava03.java -->

## 에러 처리 및 예외 케이스 (Error handling and edge cases)

### 메시지 프로세서가 없는 경우

트레이싱 기능에 메시지 프로세서가 추가되지 않은 경우, 다음과 같은 경고 로그가 출력됩니다:

```
Tracing Feature. No feature out stream providers are defined. Trace streaming has no target.
```
<!--- KNIT example-tracing-02.txt -->

이 기능은 여전히 이벤트를 가로채지만, 어디로도 처리되거나 출력되지 않습니다.

### 리소스 관리 (Resource management)

메시지 프로세서는 적절히 해제되어야 하는 리소스(예: 파일 핸들)를 보유할 수 있습니다. `use` 확장 함수를 사용하여 적절한 정리를 보장하세요:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTracing01.outputPath
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    val writer = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    // 에이전트 생성
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(writer)
        }
    }

    // 에이전트 실행
    agent.run(input)

    // 블록을 종료할 때 writer가 자동으로 닫힘
    ```
    <!--- KNIT example-tracing-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava04 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            String input = "What's the weather like in New York?";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var writer = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    // 에이전트 생성
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(writer);
        })
        .build();

    // 에이전트 실행
    agent.run(input);

    // 블록을 종료할 때 writer가 자동으로 닫힘
    ```
    <!--- KNIT exampleTracingJava04.java -->

### 파일로 특정 이벤트 트레이싱

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent
    import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent
    import ai.koog.agents.example.exampleTracing01.outputPath
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    val fileWriter = TraceFeatureMessageFileWriter(
        outputPath,
        { path: Path -> SystemFileSystem.sink(path).buffered() }
    )

    // 에이전트 생성
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(fileWriter)

            // LLM 호출만 트레이싱
            fileWriter.setMessageFilter { message ->
                message is LLMCallStartingEvent || message is LLMCallCompletedEvent
            }
        }
    }
    ```
    <!--- KNIT example-tracing-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.model.events.LLMCallCompletedEvent;
    import ai.koog.agents.core.feature.model.events.LLMCallStartingEvent;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    public class exampleTracingJava05 {
        public static void main(String[] args) {
            var outputPath = Path.of("/path/to/trace.log");
            String input = "What's the weather like in New York?";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var fileWriter = TraceFeatureMessageFileWriter.create(
        outputPath,
        path -> { try { return Files.newOutputStream(path); } catch (IOException e) { throw new UncheckedIOException(e); }}
    );

    // 에이전트 생성
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(fileWriter);

            // LLM 호출만 트레이싱
            fileWriter.setMessageFilter(message ->
                message instanceof LLMCallStartingEvent || message instanceof LLMCallCompletedEvent
            );
        })
        .build();
    ```
    <!--- KNIT exampleTracingJava05.java -->

### 원격 엔드포인트로 특정 이벤트 트레이싱

네트워크를 통해 이벤트 데이터를 전송해야 할 때 원격 엔드포인트로의 트레이싱을 사용합니다. 원격 엔드포인트 트레이싱이 시작되면 지정된 포트 번호에서 가벼운 서버를 실행하고 Kotlin 서버 전송 이벤트(SSE, Server-Sent Events)를 통해 이벤트를 전송합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig
    import ai.koog.agents.features.tracing.feature.Tracing
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    val connectionConfig = DefaultServerConnectionConfig(host = host, port = port)
    val writer = TraceFeatureMessageRemoteWriter(connectionConfig)

    // 에이전트 생성
    val agent = AIAgent(
        promptExecutor = simpleOllamaAIExecutor(),
        llmModel = OllamaModels.Meta.LLAMA_3_2,
    ) {
        install(Tracing) {
            addMessageProcessor(writer)
        }
    }

    // 에이전트 실행
    agent.run(input)

    // 블록을 종료할 때 writer가 자동으로 닫힘
    ```
    <!--- KNIT example-tracing-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.feature.remote.server.config.DefaultServerConnectionConfig;
    import ai.koog.agents.features.tracing.feature.Tracing;
    import ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.io.IOException;
    import java.io.UncheckedIOException;
    public class exampleTracingJava06 {
        public static void main(String[] args) {
            String input = "What's the weather like in New York?";
            int port = 4991;
            String host = "localhost";
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var connectionConfig = new DefaultServerConnectionConfig(host, port);
    var writer = new TraceFeatureMessageRemoteWriter(connectionConfig);

    // 에이전트 생성
    var agent = AIAgent.builder()
        .promptExecutor(PromptExecutor.builder().ollama().build())
        .llmModel(OllamaModels.Meta.LLAMA_3_2)

        .install(Tracing.Feature, config -> {
            config.addMessageProcessor(writer);
        })
        .build();

    // 에이전트 실행
    agent.run(input);

    // 블록을 종료할 때 writer가 자동으로 닫힘
    ```
    <!--- KNIT exampleTracingJava06.java -->

클라이언트 측에서는 `FeatureMessageRemoteClient`를 사용하여 이벤트를 수신하고 역직렬화할 수 있습니다.

=== "Kotlin"

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
                    // 서버로부터 이벤트 수집
                    agentEvents.add(event as DefinedFeatureEvent)
    
                    // 에이전트가 종료되면 이벤트 수집 중단
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

## API 문서 (API documentation)

트레이싱 기능은 다음과 같은 핵심 구성 요소가 포함된 모듈형 아키텍처를 따릅니다:

1. [Tracing](api:agents-features-trace::ai.koog.agents.features.tracing.feature.Tracing): 에이전트 파이프라인의 이벤트를 가로채는 메인 기능 클래스입니다.
2. [TraceFeatureConfig](api:agents-features-trace::ai.koog.agents.features.tracing.feature.TraceFeatureConfig): 기능 동작을 사용자 정의하기 위한 구성 클래스입니다.
3. 메시지 프로세서: 트레이스 이벤트를 처리하고 출력하는 구성 요소입니다:
    - [TraceFeatureMessageLogWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageLogWriter): 트레이스 이벤트를 로거에 씁니다.
    - [TraceFeatureMessageFileWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageFileWriter): 트레이스 이벤트를 파일에 씁니다.
    - [TraceFeatureMessageRemoteWriter](api:agents-features-trace::ai.koog.agents.features.tracing.writer.TraceFeatureMessageRemoteWriter): 트레이스 이벤트를 원격 서버로 전송합니다.