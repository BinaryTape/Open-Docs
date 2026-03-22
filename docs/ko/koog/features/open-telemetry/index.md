# OpenTelemetry 지원

이 페이지는 AI 에이전트의 트레이싱 및 모니터링을 위한 Koog 에이전트 프레임워크에서의 OpenTelemetry 지원에 대한 세부 정보를 제공합니다.

## 개요

OpenTelemetry는 애플리케이션에서 텔레메트리 데이터(트레이스)를 생성, 수집 및 내보내기 위한 도구를 제공하는 관측성(observability) 프레임워크입니다. Koog OpenTelemetry 기능은 AI 에이전트가 텔레메트리 데이터를 수집하도록 계측(instrument)할 수 있게 하며, 이를 통해 다음과 같은 작업을 수행할 수 있습니다:

- 에이전트 성능 및 동작 모니터링
- 복잡한 에이전트 워크플로의 문제 디버깅
- 에이전트 실행 흐름 시각화
- LLM 호출 및 도구 사용 추적
- 에이전트 동작 패턴 분석

## 주요 OpenTelemetry 개념

- **스팬(Spans)**: 스팬은 분산 트레이스 내의 개별 작업 단위 또는 연산을 나타냅니다. 에이전트 실행, 함수 호출, LLM 호출 또는 도구 호출과 같은 애플리케이션 내 특정 활동의 시작과 끝을 나타냅니다.
- **속성(Attributes)**: 속성은 스팬과 같은 텔레메트리 관련 항목에 대한 메타데이터를 제공합니다. 속성은 키-값(key-value) 쌍으로 표현됩니다.
- **이벤트(Events)**: 이벤트는 스팬의 수명 주기 동안 발생한 주목할 만한 특정 시점(스팬 관련 이벤트)을 나타냅니다.
- **익스포터(Exporters)**: 익스포터는 수집된 텔레메트리 데이터를 다양한 백엔드나 목적지로 전송하는 역할을 하는 컴포넌트입니다.
- **컬렉터(Collectors)**: 컬렉터는 텔레메트리 데이터를 수신, 처리 및 내보냅니다. 애플리케이션과 관측성 백엔드 사이의 중개자 역할을 합니다.
- **샘플러(Samplers)**: 샘플러는 샘플링 전략에 따라 트레이스를 기록할지 여부를 결정합니다. 텔레메트리 데이터의 양을 관리하는 데 사용됩니다.
- **리소스(Resources)**: 리소스는 텔레메트리 데이터를 생성하는 엔티티를 나타냅니다. 리소스에 대한 정보를 제공하는 키-값 쌍인 리소스 속성으로 식별됩니다.

Koog의 OpenTelemetry 기능은 다음과 같은 다양한 에이전트 이벤트에 대해 스팬을 자동으로 생성합니다:

- 에이전트 실행 시작 및 종료
- 노드 실행
- LLM 호출
- 도구 호출

## 설치

Koog에서 OpenTelemetry를 사용하려면 에이전트에 OpenTelemetry 기능을 추가하세요:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
                // 설정 옵션이 여기에 들어갑니다
            }
        }
    )
    ```
    <!--- KNIT example-opentelemetry-support-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava01 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var agent = AIAgent.builder()
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .install(OpenTelemetry.Feature, config -> {
            // 설정 옵션이 여기에 들어갑니다
        })
        .build();
    ```
    <!--- KNIT exampleOpentelemetrySupportJava01.java -->

## 설정

### 기본 설정

에이전트에서 OpenTelemetry 기능을 설정할 때 사용할 수 있는 속성의 전체 목록은 다음과 같습니다:

| 이름 | 데이터 유형 | 기본값 | 설명 |
|------------------|--------------------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 계측되는 서비스의 이름. |
| `serviceVersion` | `String`           | 현재 Koog 라이브러리 버전 | 계측되는 서비스의 버전. |
| `isVerbose`      | `Boolean`          | `false`                      | OpenTelemetry 설정 디버깅을 위한 상세 로깅 활성화 여부. |
| `sdk`            | `OpenTelemetrySdk` |                              | 텔레메트리 수집에 사용할 OpenTelemetry SDK 인스턴스. |
| `tracer`         | `Tracer`           |                              | 스팬 생성에 사용되는 OpenTelemetry 트레이서 인스턴스. |

!!! note
`sdk` 및 `tracer` 속성은 접근할 수 있는 공개(public) 속성이지만, 아래에 나열된 공개 메서드를 통해서만 설정할 수 있습니다.

`OpenTelemetryConfig` 클래스에는 다양한 설정 항목과 관련된 동작을 나타내는 메서드도 포함되어 있습니다. 다음은 기본적인 설정 항목들을 사용하여 OpenTelemetry 기능을 설치하는 예시입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 서비스 정보 설정
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 로깅 익스포터 추가
        addSpanExporter(LoggingSpanExporter.create())
    }
    ```
    <!--- KNIT example-opentelemetry-support-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava02 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 서비스 정보 설정
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 로깅 익스포터 추가
        config.addSpanExporter(LoggingSpanExporter.create());
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava02.java -->

사용 가능한 메서드에 대한 참조는 아래 섹션을 확인하세요.

#### setServiceInfo

이름과 버전을 포함한 서비스 정보를 설정합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | 예      |               | 계측되는 서비스의 이름. |
| `serviceVersion`   | String    | 예      |               | 계측되는 서비스의 버전. |

#### addSpanExporter

외부 시스템으로 텔레메트리 데이터를 전송하기 위한 스팬 익스포터를 추가합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | 예      |               | 사용자 정의 스팬 익스포터 목록에 추가할 `SpanExporter` 인스턴스. |

#### addSpanProcessor

익스포트되기 전에 스팬을 처리할 스팬 프로세서 팩토리를 추가합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|-------------|-----------------------------------|----------|---------------|--------------------------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 예      |               | 지정된 익스포터에 대한 스팬 프로세서를 생성하는 함수입니다. 익스포터별로 처리를 커스터마이징할 수 있게 해줍니다. |

#### addResourceAttributes

서비스에 대한 추가 컨텍스트를 제공하기 위해 리소스 속성을 추가합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 예      |               | 서비스에 대한 추가 세부 정보를 제공하는 키-값 쌍. |

#### setSampler

어떤 스팬을 수집할지 제어하기 위한 샘플링 전략을 설정합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | 예      |               | OpenTelemetry 설정에 사용할 샘플러 인스턴스. |

#### setVerbose

상세 로깅을 활성화하거나 비활성화합니다. 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | 예      | `false`       | true인 경우, 애플리케이션이 더 상세한 텔레메트리 데이터를 수집합니다. |

!!! note

    OpenTelemetry 스팬의 일부 콘텐츠는 보안상의 이유로 기본적으로 마스킹됩니다. 예를 들어, LLM 메시지는 실제 메시지 내용 대신 `HIDDEN:non-empty`로 마스킹됩니다. 실제 내용을 확인하려면 `verbose` 인수의 값을 `true`로 설정하세요.

#### setSdk

미리 구성된 `OpenTelemetrySdk` 인스턴스를 주입합니다.

- `setSdk(sdk)`를 호출하면 제공된 SDK가 있는 그대로 사용되며, `addSpanExporter`, `addSpanProcessor`, `addResourceAttributes` 또는 `setSampler`를 통해 적용된 모든 사용자 정의 설정은 무시됩니다.
- 트레이서의 계측 범위(instrumentation scope) 이름/버전은 서비스 정보와 일치하도록 조정됩니다.

| 이름 | 데이터 유형 | 필수 여부 | 설명 |
|-------|--------------------|----------|---------------------------------------|
| `sdk` | `OpenTelemetrySdk` | 예      | 에이전트에서 사용할 SDK 인스턴스. |

### 고급 설정

더욱 고급 설정을 위해 다음과 같은 구성 옵션을 커스터마이징할 수도 있습니다:

- 샘플러(Sampler): 수집되는 데이터의 빈도와 양을 조절하기 위해 샘플링 전략을 구성합니다.
- 리소스 속성(Resource attributes): 텔레메트리 데이터를 생성하는 프로세스에 대한 정보를 추가합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.sdk.trace.samplers.Sampler
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 서비스 정보 설정
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 로깅 익스포터 추가
        addSpanExporter(LoggingSpanExporter.create())
        
        // 샘플러 설정
        setSampler(Sampler.traceIdRatioBased(0.5)) 
    
        // 리소스 속성 추가
        addResourceAttributes(mapOf(
            AttributeKey.stringKey("custom.attribute") to "custom-value")
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.sdk.trace.samplers.Sampler;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 서비스 정보 설정
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 로깅 익스포터 추가
        config.addSpanExporter(LoggingSpanExporter.create());

        // 샘플러 설정
        config.setSampler(Sampler.traceIdRatioBased(0.5));

        // 리소스 속성 추가
        config.addResourceAttributes(Map.of(
            AttributeKey.stringKey("custom.attribute"), "custom-value"
        ));
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava03.java -->

#### 샘플러(Sampler)

샘플러를 정의하려면, 사용하려는 샘플링 전략을 나타내는 `opentelemetry-java` SDK의 `Sampler` 클래스(`io.opentelemetry.sdk.trace.samplers.Sampler`) 메서드를 사용하세요.

기본 샘플링 전략은 다음과 같습니다:

- `Sampler.alwaysOn()`: 모든 스팬(트레이스)을 샘플링하는 기본 샘플링 전략입니다.

사용 가능한 샘플러 및 샘플링 전략에 대한 자세한 정보는 OpenTelemetry [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 문서를 참조하세요.

#### 리소스 속성(Resource attributes)

리소스 속성은 텔레메트리 데이터를 생성하는 프로세스에 대한 추가 정보를 나타냅니다. Koog에는 기본적으로 설정되는 리소스 속성 집합이 포함되어 있습니다:

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 속성의 기본값은 `ai.koog`이며, `service.version` 기본값은 현재 사용 중인 Koog 라이브러리 버전입니다.

기본 리소스 속성 외에도 사용자 정의 속성을 추가할 수 있습니다. Koog의 OpenTelemetry 설정에 사용자 정의 속성을 추가하려면, 키와 값을 인수로 받는 `addResourceAttributes()` 메서드를 사용하세요.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
    -->
    <!--- SUFFIX
            }
        }
    )
    -->
    ```kotlin
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
    ```
    <!--- KNIT example-opentelemetry-support-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava04 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .install(OpenTelemetry.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    config.addResourceAttributes(Map.of(
        AttributeKey.stringKey("custom.attribute"), "custom-value"
    ));
    ```
    <!--- KNIT exampleOpentelemetrySupportJava04.java -->

## 스팬 유형 및 속성

OpenTelemetry 기능은 에이전트의 다양한 작업을 추적하기 위해 서로 다른 유형의 스팬을 자동으로 생성합니다:

- **CreateAgentSpan**: 에이전트를 실행할 때 생성되며, 에이전트가 종료되거나 프로세스가 종료될 때 닫힙니다.
- **InvokeAgentSpan**: 에이전트의 호출을 나타냅니다.
- **StrategySpan**: 에이전트 전략(최상위 실행 흐름)의 실행을 나타냅니다.
- **NodeExecuteSpan**: 에이전트 전략 내 노드의 실행을 나타냅니다. 이는 Koog 전용 커스텀 스팬입니다.
- **SubgraphExecuteSpan**: 에이전트 전략 내 서브그래프의 실행을 나타냅니다. 이는 Koog 전용 커스텀 스팬입니다.
- **InferenceSpan**: LLM 호출을 나타냅니다.
- **ExecuteToolSpan**: 도구 호출을 나타냅니다.
- **McpClientSpan**: MCP(Model Context Protocol) 클라이언트 연산을 나타냅니다. 이 스팬은 MCP를 위한 OpenTelemetry 시맨틱 컨벤션을 따릅니다.

스팬은 중첩된 계층 구조로 구성됩니다. 다음은 스팬 구조의 예시입니다:

```text
CreateAgentSpan
    InvokeAgentSpan
        StrategySpan
            NodeExecuteSpan
                InferenceSpan
            NodeExecuteSpan
                ExecuteToolSpan
            SubgraphExecuteSpan
                NodeExecuteSpan
                    InferenceSpan
```
<!--- KNIT example-opentelemetry-support-01.txt -->

### 스팬 속성

스팬 속성은 스팬과 관련된 메타데이터를 제공합니다. 각 스팬은 고유한 속성 집합을 가지며, 일부 스팬은 속성을 반복해서 가질 수도 있습니다.

Koog는 OpenTelemetry의 [생성형 AI 이벤트를 위한 시맨틱 컨벤션(Semantic conventions for generative AI events)](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)을 따르는 미리 정의된 속성 목록을 지원합니다. 예를 들어, 이 컨벤션은 보통 스팬에 필수적인 `gen_ai.conversation.id`라는 속성을 정의합니다. Koog에서 이 속성의 값은 에이전트 실행의 고유 식별자이며, `agent.run()` 메서드를 호출할 때 자동으로 설정됩니다.

또한 Koog에는 Koog 전용 커스텀 속성도 포함되어 있습니다. 이러한 속성 대부분은 `koog.` 접두사로 식별할 수 있습니다. 사용 가능한 커스텀 속성은 다음과 같습니다:

- `koog.strategy.name`: 에이전트 전략의 이름. 전략은 에이전트의 목적을 설명하는 Koog 관련 엔티티입니다. `StrategySpan` 스팬에서 사용됩니다.
- `koog.node.id`: 실행 중인 노드의 식별자(이름). `NodeExecuteSpan` 스팬에서 사용됩니다.
- `koog.node.input`: 실행 시작 시 노드에 전달된 입력. 노드가 시작될 때 `NodeExecuteSpan`에 존재합니다.
- `koog.node.output`: 실행 완료 시 노드에서 생성된 출력. 노드가 성공적으로 완료될 때 `NodeExecuteSpan`에 존재합니다.
- `koog.subgraph.id`: 실행 중인 서브그래프의 식별자(이름). `SubgraphExecuteSpan` 스팬에서 사용됩니다.
- `koog.subgraph.input`: 실행 시작 시 서브그래프에 전달된 입력. 서브그래프가 시작될 때 `SubgraphExecuteSpan`에 존재합니다.
- `koog.subgraph.output`: 실행 완료 시 서브그래프에서 생성된 출력. 서브그래프가 성공적으로 완료될 때 `SubgraphExecuteSpan`에 존재합니다.

### 이벤트

스팬에는 _이벤트(event)_를 첨부할 수 있습니다. 이벤트는 LLM 호출이 시작되거나 종료된 시점과 같이 관련 있는 일이 발생한 특정 시점을 설명합니다. 이벤트 또한 속성을 가지며 추가적으로 이벤트 _바디 필드(body fields)_를 포함합니다.

OpenTelemetry의 [생성형 AI 이벤트를 위한 시맨틱 컨벤션(Semantic conventions for generative AI events)](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)에 따라 다음과 같은 이벤트 유형이 지원됩니다:

- **SystemMessageEvent**: 모델에 전달된 시스템 지침.
- **UserMessageEvent**: 모델에 전달된 사용자 메시지.
- **AssistantMessageEvent**: 모델에 전달된 어시스턴트 메시지.
- **ToolMessageEvent**: 모델에 전달된 도구 또는 함수 호출의 응답.
- **ChoiceEvent**: 모델의 응답 메시지.
- **ModerationResponseEvent**: 모델의 모더레이션(moderation) 결과 또는 신호.

!!! note   
`optentelemetry-java` SDK는 이벤트를 추가할 때 이벤트 바디 필드 파라미터를 지원하지 않습니다. 따라서 Koog의 OpenTelemetry 지원에서 이벤트 바디 필드는 키가 `body`이고 값 유형이 문자열인 별도의 속성으로 처리됩니다. 이 문자열에는 일반적으로 JSON과 유사한 객체인 이벤트 바디 필드의 내용이나 페이로드가 포함됩니다. 이벤트 바디 필드의 예시는 [OpenTelemetry 문서](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)를 참조하세요. `opentelemetry-java`에서의 이벤트 바디 필드 지원 상태에 대해서는 관련 [GitHub 이슈](https://github.com/open-telemetry/semantic-conventions/issues/1870)를 참조하세요.

## 익스포터(Exporters)

익스포터는 수집된 텔레메트리 데이터를 OpenTelemetry 컬렉터 또는 다른 유형의 목적지나 백엔드 구현체로 전송합니다. 익스포터를 추가하려면 OpenTelemetry 기능을 설치할 때 `addSpanExporter()` 메서드를 사용하세요. 이 메서드는 다음 인수를 사용합니다:

| 이름 | 데이터 유형 | 필수 여부 | 기본값 | 설명 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | 예 | | 사용자 정의 스팬 익스포터 목록에 추가할 SpanExporter 인스턴스. |

아래 섹션에서는 `opentelemetry-java` SDK에서 가장 흔히 사용되는 몇 가지 익스포터에 대한 정보를 제공합니다.

!!! note
사용자 정의 익스포터를 구성하지 않으면 Koog는 기본적으로 콘솔 LoggingSpanExporter를 사용합니다. 이는 로컬 개발 및 디버깅 중에 도움이 됩니다.

### 로깅 익스포터

콘솔에 트레이스 정보를 출력하는 로깅 익스포터입니다. `LoggingSpanExporter`(`io.opentelemetry.exporter.logging.LoggingSpanExporter`)는 `opentelemetry-java` SDK의 일부입니다.

이 유형의 익스포터는 개발 및 디버깅 목적으로 유용합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 로깅 익스포터 추가
        addSpanExporter(LoggingSpanExporter.create())
        // 필요에 따라 더 많은 익스포터 추가
    }
    ```
    <!--- KNIT example-opentelemetry-support-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava05 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 로깅 익스포터 추가
        config.addSpanExporter(LoggingSpanExporter.create());
        // 필요에 따라 더 많은 익스포터 추가
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava05.java -->

### OpenTelemetry HTTP 익스포터

OpenTelemetry HTTP 익스포터(`OtlpHttpSpanExporter`)는 `opentelemetry-java` SDK(`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`)의 일부이며 HTTP를 통해 백엔드로 스팬 데이터를 전송합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import java.util.concurrent.TimeUnit
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    const val AUTH_STRING = ""
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // OpenTelemetry HTTP 익스포터 추가 
        addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // 컬렉터가 익스포트된 스팬 배치를 처리하기까지 기다릴 최대 시간 설정 
                .setTimeout(30, TimeUnit.SECONDS)
                // 연결할 OpenTelemetry 엔드포인트 설정
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 인증 헤더 추가
                .addHeader("Authorization", "Basic $AUTH_STRING")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
    import java.util.concurrent.TimeUnit;
    public class exampleOpentelemetrySupportJava06 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            String AUTH_STRING = "";
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // OpenTelemetry HTTP 익스포터 추가
        config.addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // 컬렉터가 익스포트된 스팬 배치를 처리하기까지 기다릴 최대 시간 설정
                .setTimeout(30, TimeUnit.SECONDS)
                // 연결할 OpenTelemetry 엔드포인트 설정
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 인증 헤더 추가
                .addHeader("Authorization", "Basic " + AUTH_STRING)
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava06.java -->

### OpenTelemetry gRPC 익스포터

OpenTelemetry gRPC 익스포터(`OtlpGrpcSpanExporter`)는 `opentelemetry-java` SDK(`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)의 일부입니다. 이는 gRPC를 통해 백엔드로 텔레메트리 데이터를 내보내며, 데이터를 수신하는 백엔드, 컬렉터 또는 엔드포인트의 호스트와 포트를 정의할 수 있게 해줍니다. 기본 포트는 `4317`입니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // OpenTelemetry gRPC 익스포터 추가 
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // 호스트 및 포트 설정
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava07 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // OpenTelemetry gRPC 익스포터 추가
        config.addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // 호스트 및 포트 설정
                .setEndpoint("http://localhost:4317")
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava07.java -->

## Langfuse 연동

Langfuse는 LLM/에이전트 워크로드에 대한 트레이스 시각화 및 분석을 제공합니다.

도우미 함수를 사용하여 OpenTelemetry 트레이스를 Langfuse로 직접 내보내도록 Koog를 구성할 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor 
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addLangfuseExporter(
            langfuseUrl = "https://cloud.langfuse.com",
            langfusePublicKey = "...",
            langfuseSecretKey = "..."
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava08 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addLangfuseExporter(
            "https://cloud.langfuse.com",
            "...",
            "...",
            null,
            null
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava08.java -->

Langfuse 연동에 관한 [전체 문서](opentelemetry-langfuse-exporter.md)를 읽어보시기 바랍니다.

## W&B Weave 연동

W&B Weave는 LLM/에이전트 워크로드에 대한 트레이스 시각화 및 분석을 제공합니다. W&B Weave와의 연동은 미리 정의된 익스포터를 통해 구성할 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addWeaveExporter(
            weaveOtelBaseUrl = "https://trace.wandb.ai",
            weaveEntity = "my-team",
            weaveProjectName = "my-project",
            weaveApiKey = "..."
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-09.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava09 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addWeaveExporter(
            "https://trace.wandb.ai",
            "my-team",
            "my-project",
            "..."
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava09.java -->

W&B Weave 연동에 관한 [전체 문서](opentelemetry-weave-exporter.md)를 읽어보시기 바랍니다.

## Jaeger 연동

Jaeger는 OpenTelemetry와 연동되는 인기 있는 분산 트레이싱 시스템입니다. Koog 저장소 내의 `examples` 하위 `opentelemetry` 디렉토리에는 Jaeger와 Koog 에이전트를 함께 사용하는 OpenTelemetry 예제가 포함되어 있습니다.

### 사전 요구 사항

Koog 및 Jaeger로 OpenTelemetry를 테스트하려면, 다음 명령을 실행하여 제공된 `docker-compose.yaml` 파일을 통해 Jaeger OpenTelemetry 올인원(all-in-one) 프로세스를 시작하세요:

```bash
docker compose up -d
```
<!--- KNIT example-opentelemetry-support-02.txt -->

제공된 Docker Compose YAML 파일의 내용은 다음과 같습니다:

```yaml
# docker-compose.yaml
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:1.39
    container_name: jaeger-all-in-one
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "4317:4317"
      - "16686:16686"
```
<!--- KNIT example-opentelemetry-support-03.txt -->

Jaeger UI에 액세스하여 트레이스를 확인하려면 `http://localhost:16686`을 여세요.

### 예제

Jaeger에서 사용할 텔레메트리 데이터를 내보내기 위해, 이 예제에서는 `opentelemetry-java` SDK의 `LoggingSpanExporter`(`io.opentelemetry.exporter.logging.LoggingSpanExporter`)와 `OtlpGrpcSpanExporter`(`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)를 사용합니다.

다음은 전체 코드 샘플입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.utils.io.use
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
    --> 
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // 로컬 디버깅을 위한 콘솔 로거 추가
                addSpanExporter(LoggingSpanExporter.create())

                // OpenTelemetry 컬렉터로 트레이스 전송
                addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                )
            }
        }

        agent.use { agent ->
            println("Running the agent with OpenTelemetry tracing...")

            val result = agent.run("Tell me a joke about programming")

            println("Agent run completed with result: '$result'." +
                    "
Check Jaeger UI at http://localhost:16686 to view traces")
        }
    }
    ```
    <!--- KNIT example-opentelemetry-support-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava10 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.O4Mini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config -> {
                // 로컬 디버깅을 위한 콘솔 로거 추가
                config.addSpanExporter(LoggingSpanExporter.create());

                // OpenTelemetry 컬렉터로 트레이스 전송
                config.addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                );
            })
            .build();

        System.out.println("Running the agent with OpenTelemetry tracing...");

        var result = agent.run("Tell me a joke about programming");

        System.out.println(
            "Agent run completed with result: '" + result + "'." +
                "
Check Jaeger UI at http://localhost:16686 to view traces"
        );
    }
    ```
    <!--- KNIT exampleOpentelemetrySupportJava10.java -->

## 문제 해결

### 일반적인 문제들

1. **Jaeger, Langfuse 또는 W&B Weave에 트레이스가 나타나지 않음**
    - 서비스가 실행 중이며 OpenTelemetry 포트(4317)에 접근 가능한지 확인하세요.
    - OpenTelemetry 익스포터가 올바른 엔드포인트로 구성되었는지 확인하세요.
    - 트레이스가 내보내질 수 있도록 에이전트 실행 후 몇 초간 기다려야 합니다.

2. **스팬 누락 또는 불완전한 트레이스**
    - 에이전트 실행이 성공적으로 완료되는지 확인하세요.
    - 에이전트 실행 직후에 애플리케이션을 너무 빨리 종료하지 않는지 확인하세요.
    - 스팬이 내보내질 시간을 확보하기 위해 에이전트 실행 후 지연 시간을 추가하세요.

3. **과도한 수의 스팬**
    - `sampler` 속성을 구성하여 다른 샘플링 전략을 사용하는 것을 고려하세요.
    - 예를 들어, 트레이스의 10%만 샘플링하려면 `Sampler.traceIdRatioBased(0.1)`를 사용하세요.

4. **스팬 어댑터가 서로를 덮어씀**
    - 현재 OpenTelemetry 에이전트 기능은 여러 스팬 어댑터를 적용하는 것을 지원하지 않습니다. [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)

## MCP (Model Context Protocol) 텔레메트리 지원

Koog는 [공식 OpenTelemetry MCP 시맨틱 컨벤션](https://github.com/open-telemetry/semantic-conventions/pull/2083)을 따라 MCP 연산에 대한 포괄적인 OpenTelemetry 계측을 제공합니다.

### 개요

MCP 텔레메트리 지원에는 다음이 포함됩니다:

- MCP 전용 속성으로 도구 실행 스팬의 **자동 강화**
- MCP 클라이언트 연산(tools/call)을 위한 **클라이언트 측 계측**
- 모든 필수, 조건부 필수 및 권장 속성을 포함한 **전체 시맨틱 컨벤션 준수**

### MCP 속성

MCP 텔레메트리는 OpenTelemetry 시맨틱 컨벤션을 따르며 다음과 같은 속성 그룹을 포함합니다:

**필수 속성:**
- `mcp.method.name`: MCP 메서드 이름 (예: "tools/call")

**조건부 필수 속성:**
- `gen_ai.tool.name`: 연산에 도구가 포함된 경우
- `gen_ai.prompt.name`: 연산에 프롬프트가 포함된 경우
- `jsonrpc.request.id`: (알림이 아닌) 요청을 실행하는 경우
- `error.type`: 연산이 실패한 경우

**권장 속성:**
- `mcp.session.id`: 세션 식별자
- `mcp.protocol.version`: MCP 프로토콜 버전 (예: "2025-06-18")
- `network.transport`: 전송 유형 (stdio의 경우 "pipe", HTTP의 경우 "tcp")
- `server.address` 및 `server.port`: 클라이언트 연산용

### 스팬 명명 규칙

MCP 스팬은 `{mcp.method.name} {target}`이라는 명명 규칙을 따릅니다.

여기서 `{target}`은 해당되는 경우 도구 이름 또는 프롬프트 이름입니다. 예시:
- `"tools/call search"` - "search"라는 이름의 도구를 호출하는 경우

### 권장 사항

- 세션 추적을 가능하게 하려면 영구 MCP 세션으로 작업할 때 **항상 세션 ID를 설정**하세요.
- 전체 요청 트레이싱을 위해 JSON-RPC 요청의 **요청 ID를 전파**하세요.
- MCP 연산의 성능 병목 현상을 식별하기 위해 **메트릭을 모니터링**하세요.

### 예제: 텔레메트리가 포함된 전체 MCP 클라이언트

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.mcp.McpToolRegistryProvider
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.utils.io.use
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import kotlinx.coroutines.runBlocking
    fun main() {
        runBlocking {
            val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    // MCP 도구 레지스트리 생성
    val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")
    
    // OpenTelemetry가 활성화된 에이전트를 생성하고 도구 레지스트리를 전달
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry
    ) {
        install(OpenTelemetry) {
            setServiceInfo("mcp-agent-service", "1.0.0")
            addSpanExporter(LoggingSpanExporter.create())
        }
    }
    
    // 에이전트 실행 - MCP 도구 호출이 자동으로 계측됩니다
    agent.use {
        it.run("Use the search tool to find information")
    }
    ```
    <!--- KNIT example-opentelemetry-support-11.kt -->

이 구성은 OpenTelemetry의 권장 사항과 시맨틱 컨벤션을 따르면서 최소한의 코드 변경만으로 MCP 연산에 대한 완전한 관측성을 제공합니다.