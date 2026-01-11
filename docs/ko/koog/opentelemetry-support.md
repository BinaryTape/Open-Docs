# OpenTelemetry 지원

이 페이지는 AI 에이전트의 추적 및 모니터링을 위한 Koog 에이전트 프레임워크의 OpenTelemetry 지원에 대한 세부 정보를 제공합니다.

## 개요

OpenTelemetry는 애플리케이션에서 텔레메트리 데이터(추적)를 생성, 수집 및 내보내기 위한 도구를 제공하는 관측 가능성(observability) 프레임워크입니다. Koog OpenTelemetry 기능은 AI 에이전트에 계측(instrument)을 적용하여 텔레메트리 데이터를 수집할 수 있도록 하며, 이는 다음을 돕습니다:

- 에이전트 성능 및 동작 모니터링
- 복잡한 에이전트 워크플로우에서 문제 디버깅
- 에이전트 실행 흐름 시각화
- LLM 호출 및 도구 사용 추적
- 에이전트 동작 패턴 분석

## 주요 OpenTelemetry 개념

- **스팬(Span)**: 스팬은 분산 추적 내의 개별 작업 단위 또는 연산을 나타냅니다. 이는 에이전트 실행, 함수 호출, LLM 호출 또는 도구 호출과 같은 애플리케이션 내의 특정 활동의 시작과 끝을 나타냅니다.
- **속성(Attribute)**: 속성은 스팬과 같은 텔레메트리 관련 항목에 대한 메타데이터를 제공합니다. 속성은 키-값 쌍으로 표현됩니다.
- **이벤트(Event)**: 이벤트는 스팬의 수명 동안 특정 시점(스팬 관련 이벤트)에 발생한 잠재적으로 주목할 만한 일을 나타냅니다.
- **익스포터(Exporter)**: 익스포터는 수집된 텔레메트리 데이터를 다양한 백엔드 또는 대상으로 전송하는 역할을 하는 구성 요소입니다.
- **컬렉터(Collector)**: 컬렉터는 텔레메트리 데이터를 수신, 처리 및 내보냅니다. 이들은 애플리케이션과 관측 가능성 백엔드 사이의 중간자 역할을 합니다.
- **샘플러(Sampler)**: 샘플러는 샘플링 전략에 따라 추적을 기록할지 여부를 결정합니다. 이들은 텔레메트리 데이터의 양을 관리하는 데 사용됩니다.
- **리소스(Resource)**: 리소스는 텔레메트리 데이터를 생성하는 엔티티를 나타냅니다. 이들은 리소스에 대한 정보를 제공하는 키-값 쌍인 리소스 속성으로 식별됩니다.

Koog의 OpenTelemetry 기능은 다음을 포함하여 다양한 에이전트 이벤트에 대한 스팬을 자동으로 생성합니다:

- 에이전트 실행 시작 및 종료
- 노드 실행
- LLM 호출
- 도구 호출

## 설치

Koog와 함께 OpenTelemetry를 사용하려면 OpenTelemetry 기능을 에이전트에 추가하세요:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
            // Configuration options go here
        }
    }
)
```
<!--- KNIT example-opentelemetry-support-01.kt -->

## 구성

### 기본 구성

다음은 에이전트에서 OpenTelemetry 기능을 구성할 때 설정할 수 있는 사용 가능한 속성 전체 목록입니다:

| 이름             | 데이터 유형          | 기본값                       | 설명                                                     |
|:-----------------|:-------------------|:---------------------------|:---------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                  | 계측되는 서비스의 이름입니다.                                |
| `serviceVersion` | `String`           | 현재 Koog 라이브러리 버전 | 계측되는 서비스의 버전입니다.                                |
| `isVerbose`      | `Boolean`          | `false`                    | OpenTelemetry 구성을 디버깅하기 위한 상세 로깅을 활성화할지 여부입니다. |
| `sdk`            | `OpenTelemetrySdk` |                            | 텔레메트리 수집에 사용할 OpenTelemetry SDK 인스턴스입니다. |
| `tracer`         | `Tracer`           |                            | 스팬 생성을 위해 사용되는 OpenTelemetry 트레이서 인스턴스입니다. |

!!! note
    `sdk` 및 `tracer` 속성은 접근 가능한 공개 속성이지만, 아래에 나열된 공개 메서드를 통해서만 설정할 수 있습니다.

`OpenTelemetryConfig` 클래스에는 다양한 구성 항목과 관련된 작업을 나타내는 메서드도 포함되어 있습니다. 다음은 기본 구성 항목 집합으로 OpenTelemetry 기능을 설치하는 예시입니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

사용 가능한 메서드에 대한 참조는 아래 섹션을 참조하세요.

#### setServiceInfo

이름과 버전을 포함한 서비스 정보를 설정합니다. 다음 인수를 사용합니다:

| 이름             | 데이터 유형 | 필수 | 기본값 | 설명                                 |
|:-----------------|:----------|:---|:-----|:-------------------------------------|
| `serviceName`    | String    | 예 |      | 계측되는 서비스의 이름입니다.            |
| `serviceVersion` | String    | 예 |      | 계측되는 서비스의 버전입니다.            |

#### addSpanExporter

외부 시스템으로 텔레메트리 데이터를 전송할 스팬 익스포터를 추가합니다. 다음 인수를 사용합니다:

| 이름       | 데이터 유형      | 필수 | 기본값 | 설명                                                                   |
|:-----------|:---------------|:---|:-----|:-----------------------------------------------------------------------|
| `exporter` | `SpanExporter` | 예 |      | 사용자 정의 스팬 익스포터 목록에 추가될 `SpanExporter` 인스턴스입니다. |

#### addSpanProcessor

스팬이 내보내지기 전에 처리할 스팬 프로세서 팩토리를 추가합니다. 다음 인수를 사용합니다:

| 이름        | 데이터 유형                       | 필수 | 기본값 | 설명                                                                         |
|:------------|-----------------------------------|:---|:-----|:-----------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 예 |      | 주어진 익스포터에 대한 스팬 프로세서를 생성하는 함수입니다. 익스포터별 처리를 사용자 정의할 수 있습니다. |

#### addResourceAttributes

서비스에 대한 추가 컨텍스트를 제공하기 위해 리소스 속성을 추가합니다. 다음 인수를 사용합니다:

| 이름         | 데이터 유형                 | 필수 | 기본값 | 설명                                 |
|:-------------|:--------------------------|:---|:-----|:-------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 예 |      | 서비스에 대한 추가 세부 정보를 제공하는 키-값 쌍입니다. |

#### setSampler

어떤 스팬을 수집할지 제어하기 위한 샘플링 전략을 설정합니다. 다음 인수를 사용합니다:

| 이름      | 데이터 유형 | 필수 | 기본값 | 설명                                     |
|:----------|:----------|:---|:-----|:-----------------------------------------|
| `sampler` | `Sampler` | 예 |      | OpenTelemetry 구성을 위해 설정할 샘플러 인스턴스입니다. |

#### setVerbose

상세 로깅을 활성화 또는 비활성화합니다. 다음 인수를 사용합니다:

| 이름      | 데이터 유형 | 필수 | 기본값  | 설명                                                         |
|:----------|:----------|:---|:------|:-------------------------------------------------------------|
| `verbose` | `Boolean` | 예 | `false` | true인 경우, 애플리케이션은 더 상세한 텔레메트리 데이터를 수집합니다. |

!!! note
    보안상의 이유로 OpenTelemetry 스팬의 일부 내용은 기본적으로 마스킹됩니다. 예를 들어, LLM 메시지는 실제 메시지 내용 대신 `HIDDEN:non-empty`로 마스킹됩니다. 내용을 얻으려면 `verbose` 인수의 값을 `true`로 설정하십시오.

#### setSdk

사전 구성된 `OpenTelemetrySdk` 인스턴스를 주입합니다.

- `setSdk(sdk)`를 호출하면 제공된 SDK가 그대로 사용되며, `addSpanExporter`, `addSpanProcessor`, `addResourceAttributes`, `setSampler`를 통해 적용된 모든 사용자 정의 구성은 무시됩니다.
- 트레이서의 계측 범위 이름/버전은 서비스 정보와 일치합니다.

| 이름 | 데이터 유형        | 필수 | 설명                                |
|:-----|:-------------------|:---|:------------------------------------|
| `sdk`| `OpenTelemetrySdk` | 예 | 에이전트에서 사용할 SDK 인스턴스입니다. |

### 고급 구성

더 고급 구성을 위해서는 다음 구성 옵션을 사용자 정의할 수도 있습니다:

- 샘플러: 수집된 데이터의 빈도와 양을 조정하기 위한 샘플링 전략을 구성합니다.
- 리소스 속성: 텔레메트리 데이터를 생성하는 프로세스에 대한 추가 정보를 추가합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.sdk.trace.samplers.Sampler

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    
    // Set the sampler 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // Add resource attributes
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### 샘플러

샘플러를 정의하려면 `opentelemetry-java` SDK의 `Sampler` 클래스(`io.opentelemetry.sdk.trace.samplers.Sampler`)에 해당하는 메서드를 사용하여 원하는 샘플링 전략을 나타내세요.

기본 샘플링 전략은 다음과 같습니다:

- `Sampler.alwaysOn()`: 모든 스팬(추적)이 샘플링되는 기본 샘플링 전략입니다.

사용 가능한 샘플러 및 샘플링 전략에 대한 자세한 내용은 OpenTelemetry [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 문서를 참조하세요.

#### 리소스 속성

리소스 속성은 텔레메트리 데이터를 생성하는 프로세스에 대한 추가 정보를 나타냅니다. Koog는 기본적으로 설정되는 리소스 속성 집합을 포함합니다:

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 속성의 기본값은 `ai.koog`이며, `service.version`의 기본값은 현재 사용 중인 Koog 라이브러리 버전입니다.

기본 리소스 속성 외에도 사용자 정의 속성을 추가할 수 있습니다. Koog의 OpenTelemetry 구성에 사용자 정의 속성을 추가하려면 키와 값을 인수로 받는 OpenTelemetry 구성의 `addResourceAttributes()` 메서드를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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

## 스팬 유형 및 속성

OpenTelemetry 기능은 에이전트의 다양한 작업을 추적하기 위해 자동으로 여러 유형의 스팬을 생성합니다:

- **CreateAgentSpan**: 에이전트를 실행할 때 생성되며, 에이전트가 종료되거나 프로세스가 종료될 때 닫힙니다.
- **InvokeAgentSpan**: 에이전트 호출.
- **StrategySpan**: 에이전트 전략의 실행(최상위 실행 흐름).
- **NodeExecuteSpan**: 에이전트 전략에서 노드의 실행. 이는 Koog 고유의 사용자 정의 스팬입니다.
- **SubgraphExecuteSpan**: 에이전트 전략 내 서브그래프의 실행. 이는 Koog 고유의 사용자 정의 스팬입니다.
- **InferenceSpan**: LLM 호출.
- **ExecuteToolSpan**: 도구 호출.

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

### 스팬 속성

스팬 속성은 스팬과 관련된 메타데이터를 제공합니다. 각 스팬은 고유한 속성 집합을 가지며, 일부 스팬은 속성을 반복할 수도 있습니다.

Koog는 OpenTelemetry의 [생성형 AI 이벤트에 대한 시맨틱 컨벤션](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)을 따르는 사전 정의된 속성 목록을 지원합니다. 예를 들어, 이 컨벤션은 일반적으로 스팬의 필수 속성인 `gen_ai.conversation.id`라는 속성을 정의합니다. Koog에서 이 속성의 값은 에이전트 실행의 고유 식별자이며, `agent.run()` 메서드를 호출할 때 자동으로 설정됩니다.

또한 Koog는 Koog 고유의 사용자 정의 속성을 포함합니다. 대부분의 속성은 `koog.` 접두사로 식별할 수 있습니다. 사용 가능한 사용자 정의 속성은 다음과 같습니다:

- `koog.strategy.name`: 에이전트 전략의 이름. 전략은 에이전트의 목적을 설명하는 Koog 관련 엔티티입니다. `StrategySpan` 스팬에서 사용됩니다.
- `koog.node.id`: 실행 중인 노드의 식별자(이름). `NodeExecuteSpan` 스팬에서 사용됩니다.
- `koog.node.input`: 실행 시작 시 노드에 전달된 입력. 노드가 시작될 때 `NodeExecuteSpan`에 존재합니다.
- `koog.node.output`: 완료 시 노드가 생성한 출력. 노드가 성공적으로 완료될 때 `NodeExecuteSpan`에 존재합니다.
- `koog.subgraph.id`: 실행 중인 서브그래프의 식별자(이름). `SubgraphExecuteSpan` 스팬에서 사용됩니다.
- `koog.subgraph.input`: 실행 시작 시 서브그래프에 전달된 입력. 서브그래프가 시작될 때 `SubgraphExecuteSpan`에 존재합니다.
- `koog.subgraph.output`: 완료 시 서브그래프가 생성한 출력. 서브그래프가 성공적으로 완료될 때 `SubgraphExecuteSpan`에 존재합니다.

### 이벤트

스팬에는 스팬에 첨부된 _이벤트_도 있을 수 있습니다. 이벤트는 관련 있는 일이 발생한 특정 시점을 설명합니다. 예를 들어, LLM 호출이 시작되거나 종료될 때. 이벤트는 속성을 가지며, 추가적으로 이벤트 _본문 필드_를 포함합니다.

OpenTelemetry의 [생성형 AI 이벤트에 대한 시맨틱 컨벤션](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/)에 따라 다음 이벤트 유형이 지원됩니다:

- **SystemMessageEvent**: 모델에 전달된 시스템 지시사항.
- **UserMessageEvent**: 모델에 전달된 사용자 메시지.
- **AssistantMessageEvent**: 모델에 전달된 어시스턴트 메시지.
- **ToolMessageEvent**: 모델에 전달된 도구 또는 함수 호출의 응답.
- **ChoiceEvent**: 모델의 응답 메시지.
- **ModerationResponseEvent**: 모델의 조정 결과 또는 신호.

!!! note
    `opentelemetry-java` SDK는 이벤트를 추가할 때 이벤트 본문 필드 매개변수를 지원하지 않습니다. 따라서 Koog의 OpenTelemetry 지원에서는 이벤트 본문 필드가 키가 `body`이고 값 유형이 문자열인 별도의 속성으로 처리됩니다. 이 문자열에는 일반적으로 JSON과 같은 객체인 이벤트 본문 필드의 내용 또는 페이로드가 포함됩니다. 이벤트 본문 필드의 예시는 [OpenTelemetry 문서](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)를 참조하세요. `opentelemetry-java`의 이벤트 본문 필드 지원 상태는 관련 [GitHub 이슈](https://github.com/open-telemetry/semantic-conventions/issues/1870)를 참조하세요.

## 익스포터

익스포터는 수집된 텔레메트리 데이터를 OpenTelemetry 컬렉터 또는 다른 유형의 대상이나 백엔드 구현으로 전송합니다. 익스포터를 추가하려면 OpenTelemetry 기능을 설치할 때 `addSpanExporter()` 메서드를 사용하세요. 이 메서드는 다음 인수를 사용합니다:

| 이름       | 데이터 유형    | 필수 | 기본값 | 설명                                                                   |
|:-----------|:-------------|:---|:-----|:-----------------------------------------------------------------------|
| `exporter` | SpanExporter | 예 |      | 사용자 정의 스팬 익스포터 목록에 추가될 `SpanExporter` 인스턴스입니다. |

아래 섹션에서는 `opentelemetry-java` SDK에서 가장 일반적으로 사용되는 익스포터 중 일부에 대한 정보를 제공합니다.

!!! note
    사용자 정의 익스포터를 구성하지 않으면 Koog는 기본적으로 콘솔 `LoggingSpanExporter`를 사용합니다. 이는 로컬 개발 및 디버깅에 도움이 됩니다.

### 로깅 익스포터

콘솔에 추적 정보를 출력하는 로깅 익스포터입니다. `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`)는 `opentelemetry-java` SDK의 일부입니다.

이러한 유형의 내보내기는 개발 및 디버깅 목적으로 유용합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Add the logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    // Add more exporters as needed
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTP 익스포터

OpenTelemetry HTTP 익스포터(`OtlpHttpSpanExporter`)는 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`)의 일부이며, HTTP를 통해 스팬 데이터를 백엔드로 전송합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import java.util.concurrent.TimeUnit

const val apiKey = ""
const val AUTH_STRING = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry HTTP exporter 
   addSpanExporter(
      OtlpHttpSpanExporter.builder()
         // Set the maximum time to wait for the collector to process an exported batch of spans 
         .setTimeout(30, TimeUnit.SECONDS)
         // Set the OpenTelemetry endpoint to connect to
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // Add the authorization header
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPC 익스포터

OpenTelemetry gRPC 익스포터(`OtlpGrpcSpanExporter`)는 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)의 일부입니다. gRPC를 통해 텔레메트리 데이터를 백엔드로 내보내며, 데이터를 수신하는 백엔드, 컬렉터 또는 엔드포인트의 호스트와 포트를 정의할 수 있습니다. 기본 포트는 `4317`입니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry gRPC exporter 
   addSpanExporter(
      OtlpGrpcSpanExporter.builder()
          // Set the host and the port
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## Langfuse와 통합

Langfuse는 LLM/에이전트 워크로드에 대한 추적 시각화 및 분석을 제공합니다.

헬퍼 함수를 사용하여 Koog가 OpenTelemetry 추적을 Langfuse로 직접 내보내도록 구성할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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

Langfuse와의 통합에 대한 [전체 문서](opentelemetry-langfuse-exporter.md)를 참조하세요.

## W&B Weave와 통합

W&B Weave는 LLM/에이전트 워크로드에 대한 추적 시각화 및 분석을 제공합니다. W&B Weave와의 통합은 사전 정의된 익스포터를 통해 구성할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
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

W&B Weave와의 통합에 대한 [전체 문서](opentelemetry-weave-exporter.md)를 참조하세요.

## Jaeger와 통합

Jaeger는 OpenTelemetry와 연동되는 인기 있는 분산 추적 시스템입니다. Koog 리포지토리의 `examples` 내 `opentelemetry` 디렉터리에는 Jaeger 및 Koog 에이전트와 함께 OpenTelemetry를 사용하는 예시가 포함되어 있습니다.

### 전제 조건

Koog 및 Jaeger로 OpenTelemetry를 테스트하려면 제공된 `docker-compose.yaml` 파일을 사용하여 다음 명령을 실행하여 Jaeger OpenTelemetry 올인원 프로세스를 시작하세요:

```bash
docker compose up -d
```

제공된 Docker Compose YAML 파일에는 다음 내용이 포함되어 있습니다:

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

Jaeger UI에 접근하여 추적을 보려면 `http://localhost:16686`을 여세요.

### 예시

Jaeger에서 사용할 텔레메트리 데이터를 내보내기 위해 이 예시에서는 `opentelemetry-java` SDK의 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 및 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)를 사용합니다.

다음은 전체 코드 샘플입니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.utils.io.use
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "open-ai-api-key"

-->
```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // Add a console logger for local debugging
                addSpanExporter(LoggingSpanExporter.create())

                // Send traces to OpenTelemetry collector
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
}
```
<!--- KNIT example-opentelemetry-support-10.kt -->

## 문제 해결

### 일반적인 문제

1. **Jaeger, Langfuse 또는 W&B Weave에 추적이 나타나지 않음**
    - 서비스가 실행 중이고 OpenTelemetry 포트(4317)에 접근 가능한지 확인하십시오.
    - OpenTelemetry 익스포터가 올바른 엔드포인트로 구성되었는지 확인하십시오.
    - 추적을 내보내기 위해 에이전트 실행 후 몇 초 정도 기다려야 합니다.

2. **스팬 누락 또는 불완전한 추적**
    - 에이전트 실행이 성공적으로 완료되는지 확인하십시오.
    - 에이전트 실행 후 너무 빨리 애플리케이션을 닫지 않도록 하십시오.
    - 스팬이 내보내질 시간을 허용하도록 에이전트 실행 후 지연을 추가하십시오.

3. **과도한 수의 스팬**
    - `sampler` 속성을 구성하여 다른 샘플링 전략을 사용하는 것을 고려하십시오.
    - 예를 들어, 추적의 10%만 샘플링하려면 `Sampler.traceIdRatioBased(0.1)`을 사용하십시오.

4. **스팬 어댑터가 서로를 재정의합니다**
    - 현재 OpenTelemetry 에이전트 기능은 여러 스팬 어댑터를 적용하는 것을 지원하지 않습니다 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter).