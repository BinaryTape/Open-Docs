# Datadog 익스포터

Koog는 관찰성(observability) 데이터에 대한 오픈 표준인 [OpenTelemetry](https://opentelemetry.io/)를 사용하여 에이전트 트레이스(trace)를 내보냅니다.
이러한 트레이스를 [Datadog](https://www.datadoghq.com/)으로 전송하기 위해 Koog에는 별도의 수동 인스트루멘테이션(instrumentation) 없이 사용할 수 있는 기본 제공 OpenTelemetry 익스포터가 포함되어 있습니다.

연결이 완료되면 Datadog의 [OpenTelemetry 지원](https://docs.datadoghq.com/opentelemetry/)을 통해 에이전트가 LLM, 도구 및 외부 API와 상호 작용하는 방식을 시각화, 분석 및 디버깅할 수 있습니다.

---

## 설정 지침

1. [https://www.datadoghq.com/](https://www.datadoghq.com/)에서 Datadog 계정을 생성합니다.

2. [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys)에서 API 키를 가져옵니다.

3. [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter) 함수의 파라미터로 제공하거나, 환경 변수를 통해 API 키를 전달합니다.
```bash
export DD_API_KEY="<your-api-key>"
```
4. (선택 사항) US1(`datadoghq.com`) 이외의 Datadog 리전을 사용하려면 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)에 사이트를 파라미터로 전달하거나 환경 변수를 설정하세요.
```bash
export DD_SITE="datadoghq.eu"
```
지원되는 사이트:

| 사이트 | 리전 |
|------|--------|
| `datadoghq.com` | US1 (기본값) |
| `datadoghq.eu` | EU1 |
| `us3.datadoghq.com` | US3 |
| `us5.datadoghq.com` | US5 |
| `ap1.datadoghq.com` | AP1 (일본) |

<!--- KNIT example-datadog-exporter-01.txt -->

## 구성

Datadog 내보내기를 활성화하려면 **OpenTelemetry 기능(feature)**을 설치하고 [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)를 호출하세요.

### 기본 예시

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
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
    <!--- KNIT example-datadog-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.agents.features.opentelemetry.integration.datadog.DatadogKt;
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
                DatadogKt.addDatadogExporter(config)
            )
            .build();

        System.out.println("Running agent with Datadog tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces in Datadog LLM Observability");
    }
    ```
    <!--- KNIT exampleDatadogExporterJava01.java -->

## 트레이스 속성 (Trace attributes)

Koog가 에이전트 활동을 Datadog으로 보낼 때, 이는 *스팬(span)*의 연속으로 수행됩니다. 스팬은 LLM 호출이나 도구 실행과 같은 개별 작업 기록입니다. 관련 스팬들은 하나의 *트레이스(trace)*로 그룹화되며, 이는 시작부터 끝까지 전체 에이전트 실행을 나타냅니다.

[`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)는 트레이스를 내보내는 애플리케이션을 설명하는 키-값 쌍의 맵인 `resourceAttributes` 파라미터를 허용합니다. 이러한 속성은 모든 스팬에 추가되어, Datadog에서 환경(environment)이나 버전(version)과 같은 속성별로 트레이스를 필터링하고 그룹화하기 쉽게 해줍니다.

일반적인 속성:

- **env**: 환경 이름 (예: `production`, `staging` 또는 `development`)
- **service.name**: 서비스 또는 애플리케이션 이름
- **version**: 배포 간의 동작을 비교하는 데 유용한 애플리케이션 버전

### 트레이스 속성을 사용한 예시

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
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
                    url = "datadoghq.eu",  // EU 리전 사용
                    resourceAttributes = mapOf(
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
    <!--- KNIT example-datadog-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.agents.features.opentelemetry.integration.datadog.DatadogKt;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
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
                DatadogKt.addDatadogExporter(
                    config,
                    null,                            // datadogApiKey: DD_API_KEY 환경 변수 사용
                    "datadoghq.eu"                   // url: EU 리전 사용
                ))
            .build();

        System.out.println("Running agent with Datadog tracing");

        agent.run("What is Kotlin?");
    }
    ```
    <!--- KNIT exampleDatadogExporterJava02.java -->

    !!! note
        Java에서 `resourceAttributes`를 설정하는 것은 현재 지원되지 않습니다. 이는 내부 Kotlin 함수가 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 파라미터(값 클래스)를 포함하고 있어, 해당 파라미터 이후의 모든 오버로드에 대해 JVM 이름 망글링(mangling)이 발생하기 때문입니다. `resourceAttributes`가 필요한 경우 위의 Kotlin 예제를 사용하세요.

## 여러 백엔드로 전송하기

Datadog과 다른 백엔드에 동시에 트레이스를 보내려면, [`addDatadogExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter)를 통해 Datadog을 등록하고 [`addSpanExporter()`](api:agents-features-opentelemetry::ai.koog.agents.features.opentelemetry.feature.OpenTelemetryConfig.addSpanExporter)를 통해 두 번째 익스포터를 추가하세요. 각 호출은 독립적인 배치 스팬 프로세서(batch span processor)를 등록하므로 두 백엔드로 병렬로 내보내집니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
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
        addDatadogExporter()
        addSpanExporter(
            OtlpHttpSpanExporter.builder()
                .setEndpoint("http://localhost:4318/v1/traces")
                .build()
        )
    }
    ```
    <!--- KNIT example-datadog-exporter-03.kt -->

## 트레이싱 대상

Datadog 익스포터는 Koog의 일반 OpenTelemetry 통합과 동일한 활동을 캡처합니다. 캡처되는 스팬의 전체 목록과 LLM 프롬프트 및 응답 콘텐츠를 포함하는 방법은 [트레이싱 대상](index.md#what-gets-traced)을 참조하세요.

Datadog의 OpenTelemetry 지원에 대한 자세한 내용은 [Datadog OTLP API 인테이크](https://docs.datadoghq.com/opentelemetry/guide/otlp_api/)를 참조하세요.

---

## 문제 해결

- **트레이스가 나타나지 않음**: `DD_API_KEY` 및 `DD_SITE`가 올바르게 설정되었는지 확인하세요 ([설정 지침](#setup-instructions) 참조).
- **인증 오류**: [Organization Settings > API Keys](https://app.datadoghq.com/organization-settings/api-keys)에서 키가 활성 상태인지 확인하세요.
- **연결 문제**: 사용자 환경에서 `https://otlp.<DD_SITE>/v1/traces`에 접속할 수 있는지 확인하세요. 예를 들어, US1의 경우 `https://otlp.datadoghq.com/v1/traces`입니다.

일반적인 문제 해결 방법은 [문제 해결](index.md#troubleshooting)을 참조하세요.