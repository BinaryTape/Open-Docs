# Datadog 익스포터

Koog는 전용 LLM 관찰성(Observability) 기능을 갖춘 모니터링 및 분석 플랫폼인 [Datadog](https://www.datadoghq.com/)으로 에이전트 트레이스(trace)를 내보낼 수 있는 기본 지원을 제공합니다.
Datadog 통합을 통해 Koog 에이전트가 LLM, API 및 기타 구성 요소와 상호 작용하는 방식을 시각화, 분석 및 디버깅할 수 있습니다.

Koog의 OpenTelemetry 지원에 대한 배경 지식은 [OpenTelemetry 지원](https://docs.koog.ai/opentelemetry-support/) 문서를 참조하세요.

---

## 설정 지침

1) [https://www.datadoghq.com/](https://www.datadoghq.com/)에서 Datadog 계정을 생성합니다.

2) [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys)에서 API 키를 가져옵니다.

3) Datadog 익스포터에 Datadog API 키를 전달합니다.
이는 `addDatadogExporter()` 함수의 파라미터로 제공하거나, 환경 변수를 설정하여 수행할 수 있습니다.

```bash
export DD_API_KEY="<your-api-key>"
```

4) (선택 사항) Datadog 사이트를 구성합니다. Datadog은 여러 리전에서 운영됩니다. 기본적으로 익스포터는 트레이스를 `datadoghq.com`(US1 리전)으로 전송합니다.
다른 리전을 사용하려면 `DD_SITE` 환경 변수를 설정하거나 `addDatadogExporter()`에 `datadogSite` 파라미터를 전달하세요.

```bash
export DD_SITE="datadoghq.eu"
```

일반적인 사이트 값:

| 사이트 | 리전 |
|------|--------|
| `datadoghq.com` | US1 (기본값) |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1 (일본) |

<!--- KNIT example-datadog-exporter-01.txt -->

## 구성

Datadog 내보내기를 활성화하려면 **OpenTelemetry 기능(feature)**을 설치하고 `DatadogExporter`를 추가하세요.
익스포터는 내부적으로 `OtlpHttpSpanExporter`를 사용하여 Datadog의 OTLP 인테이크(intake) 엔드포인트로 트레이스를 직접 전송합니다.

### 예시: Datadog 트레이싱을 사용한 에이전트

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addDatadogExporter()
            }
        }

        println("Running agent with Datadog tracing")

        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces in Datadog LLM Observability")
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleDatadogExporterJava01 {
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
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config ->
                config.addDatadogExporter()
            )
            .build();

        System.out.println("Running agent with Datadog tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces in Datadog LLM Observability");
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava01.java -->

## 트레이스 속성 (Trace attributes)

`addDatadogExporter` 함수는 리소스 수준 속성 맵을 받는 `traceAttributes` 파라미터를 지원합니다.
이러한 속성은 내보내는 모든 스팬(span)에 추가되며, 애플리케이션별 메타데이터로 트레이스에 태그를 지정하는 데 유용합니다.

일반적인 속성:
- **env**: 환경 이름 (예: `production`, `staging`, `development`)
- **service.name**: 서비스 또는 애플리케이션 이름
- **version**: 배포 추적을 위한 애플리케이션 버전

### 트레이스 속성을 사용한 예시

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
            install(OpenTelemetry) {
                addDatadogExporter(
                    datadogSite = "datadoghq.eu",  // EU 리전 사용
                    traceAttributes = mapOf(
                        "env" to "production",
                        "service.name" to "my-agent",
                        "version" to "1.0.0"
                    )
                )
            }
        }

        println("Running agent with Datadog tracing")

        agent.run("What is Kotlin?")
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Map;
    public class exampleDatadogExporterJava02 {
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
            .systemPrompt("You are a helpful assistant.")
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .install(OpenTelemetry.Feature, config ->
                config.addDatadogExporter(
                    null,                           // DD_API_KEY 환경 변수 사용
                    "datadoghq.eu",                 // EU 리전 사용
                    null,                           // 기본 타임아웃
                    Map.of(
                        "env", "production",
                        "service.name", "my-agent",
                        "version", "1.0.0"
                    )
                ))
            .build();

        System.out.println("Running agent with Datadog tracing");

        agent.run("What is Kotlin?");
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava02.java -->

## 커스텀 익스포터 래핑 (Custom exporter wrapping)

익스포터를 등록하기 전에 커스텀 데코레이터로 감싸야 하는 경우 `buildDatadogExporter()` 함수를 사용할 수 있습니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.sdk.trace.export.SpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    class MyCustomSpanExporter(private val delegate: SpanExporter) : SpanExporter by delegate
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        val exporter = buildDatadogExporter()
        val wrapped = MyCustomSpanExporter(exporter) // 예: 속성 후처리
        addSpanExporter(wrapped)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-04.kt -->

## 트레이싱 대상

활성화되면 Datadog 익스포터는 다음을 포함하여 Koog의 일반 OpenTelemetry 통합과 동일한 스팬을 캡처합니다.

- **에이전트 라이프사이클 이벤트**: 에이전트 시작, 중지, 오류
- **LLM 상호작용**: 프롬프트, 응답, 토큰 사용량, 지연 시간(latency)
- **도구 호출**: 도구 호출에 대한 실행 트레이스
- **시스템 컨텍스트**: 모델 이름, 환경, Koog 버전과 같은 메타데이터

익스포터에는 스팬을 Datadog의 LLM Observability 제품으로 라우팅하기 위해 `dd-otlp-source: llmobs` 헤더가 포함됩니다.

보안상의 이유로 OpenTelemetry 스팬의 일부 콘텐츠는 기본적으로 마스킹됩니다.
Datadog에서 콘텐츠를 사용할 수 있게 하려면 OpenTelemetry 구성에서 [setVerbose](opentelemetry-support.md#setverbose) 메서드를 사용하고 다음과 같이 `verbose` 인수를 `true`로 설정하세요.

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
        addDatadogExporter()
        setVerbose(true)
    }
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT example-datadog-exporter-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleDatadogExporterJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .systemPrompt("You are a helpful assistant.")
                .llmModel(OpenAIModels.Chat.GPT4oMini)
                .
    -->
    <!--- SUFFIX
            .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addDatadogExporter();
        config.setVerbose(true);
    })
    ```
    <!--- TODO: Enable KNIT after PR #1591 is merged: KNIT exampleDatadogExporterJava03.java -->

Datadog의 LLM Observability 및 OpenTelemetry 지원에 대한 자세한 내용은 다음을 참조하세요.

- [Datadog LLM Observability 문서](https://docs.datadoghq.com/llm_observability/)
- [Datadog OTLP API 인테이크](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)

---

## 문제 해결

### Datadog에 트레이스가 나타나지 않음
- 환경에 `DD_API_KEY`가 설정되어 있는지 다시 확인하세요.
- Datadog 리전에 맞는 올바른 `DD_SITE`를 사용하고 있는지 확인하세요 (미국은 `datadoghq.com`, 유럽은 `datadoghq.eu`).
- API 키에 트레이스를 보낼 수 있는 필요한 권한이 있는지 확인하세요.

### 인증 오류
- `DD_API_KEY`가 유효하고 활성 상태인지 확인하세요.
- API 키는 [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys)에서 확인할 수 있습니다.

### 연결 문제
- 사용자 환경에서 Datadog OTLP 인테이크 엔드포인트(`https://otlp.<site>/v1/traces`)에 대한 네트워크 접근 권한이 있는지 확인하세요.
- 아웃바운드 연결을 차단할 수 있는 방화벽이나 프록시 설정을 확인하세요.