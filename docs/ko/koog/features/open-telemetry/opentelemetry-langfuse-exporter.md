# Langfuse 익스포터

Koog는 AI 애플리케이션의 관측 가능성(observability) 및 분석을 위한 플랫폼인 [Langfuse](https://langfuse.com/)로 에이전트 트레이스를 내보낼 수 있는 내장 지원을 제공합니다.
Langfuse 연동을 통해 Koog 에이전트가 LLM, API 및 기타 컴포넌트와 상호작용하는 방식을 시각화하고 분석하며 디버깅할 수 있습니다.

Koog의 OpenTelemetry 지원에 관한 배경 지식은 [OpenTelemetry 지원](https://docs.koog.ai/opentelemetry-support/)을 참조하세요.

---

## 설정 방법

1. Langfuse 프로젝트를 생성합니다. [Langfuse에서 새 프로젝트 생성](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)의 설정 가이드를 따르세요.
2. API 자격 증명을 가져옵니다. [Langfuse API 키는 어디에 있나요?](https://langfuse.com/faq/all/where-are-langfuse-api-keys)에 설명된 대로 Langfuse `public key`와 `secret key`를 확인합니다.
3. Langfuse 호스트, 퍼블릭 키(public key), 시크릿 키(secret key)를 Langfuse 익스포터에 전달합니다.
   이는 `addLangfuseExporter()` 함수의 파라미터로 제공하거나, 아래와 같이 환경 변수를 설정하여 수행할 수 있습니다.

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```
<!--- KNIT example-langfuse-exporter-01.txt -->

## 구성

Langfuse 내보내기를 활성화하려면 **OpenTelemetry 피처(feature)**를 설치하고 `LangfuseExporter`를 추가합니다.  
익스포터는 내부적으로 `OtlpHttpSpanExporter`를 사용하여 Langfuse의 OpenTelemetry 엔드포인트로 트레이스를 전송합니다.

### 예시: Langfuse 트레이싱이 적용된 에이전트

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
                addLangfuseExporter()
            }
        }
    
        println("Running agent with Langfuse tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on the Langfuse instance")
    }
    ```
    <!--- KNIT example-langfuse-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleLangfuseExporterJava01 {
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
                config.addLangfuseExporter()
            )
            .build();

        System.out.println("Running agent with Langfuse tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on the Langfuse instance");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava01.java -->

## 트레이스 속성 (Trace attributes)

Langfuse는 세션, 환경, 태그 및 기타 메타데이터와 같은 기능을 통해 관측 가능성을 높이기 위해 트레이스 레벨 속성을 사용합니다.
`addLangfuseExporter` 함수는 `CustomAttribute` 객체 리스트를 받는 `traceAttributes` 파라미터를 지원합니다.

이러한 속성들은 각 트레이스의 루트 `InvokeAgentSpan` 스팬에 추가되어 Langfuse의 고급 기능을 활성화합니다. Langfuse에서 지원하는 모든 속성을 전달할 수 있습니다. [Langfuse의 OpenTelemetry 문서에 있는 전체 목록](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)을 확인하세요.

일반적인 속성:
- **세션(Sessions)** (`langfuse.session.id`): 집계된 메트릭, 비용 분석 및 스코어링을 위해 관련 트레이스를 그룹화합니다.
- **환경(Environments)**: 더 깨끗한 분석을 위해 운영(production) 트레이스를 개발 및 스테이징 환경과 분리합니다.
- **태그(Tags)** (`langfuse.trace.tags`): 피처 이름, 실험 ID 또는 고객 세그먼트로 트레이스에 레이블을 지정합니다 (문자열 배열).

### 세션과 태그를 사용한 예시

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    import java.util.UUID
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    fun main() = runBlocking {
        val sessionId = UUID.randomUUID().toString()
    
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a helpful assistant."
        ) {
            install(OpenTelemetry) {
                addLangfuseExporter(
                    traceAttributes = listOf(
                        CustomAttribute("langfuse.session.id", sessionId),
                        CustomAttribute("langfuse.trace.tags", listOf("chat", "kotlin", "production"))
                    )
                )
            }
        }
    
        println("Running agent with Langfuse tracing")

        // 동일한 세션 ID를 가진 여러 실행은 Langfuse에서 하나로 그룹화됩니다.
        agent.run("What is Kotlin?")
        agent.run("Show me a coroutine example")
    }
    ```
    <!--- KNIT example-langfuse-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava02 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var sessionId = UUID.randomUUID().toString();

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .systemPrompt("You are a helpful assistant.")
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .install(OpenTelemetry.Feature, config ->
                config.addLangfuseExporter(
                    null, null, null, null,
                    List.of(
                        new CustomAttribute("langfuse.session.id", sessionId),
                        new CustomAttribute("langfuse.trace.tags", List.of("chat", "kotlin", "production"))
                    )
                ))
            .build();

        System.out.println("Running agent with Langfuse tracing");

        // 동일한 세션 ID를 가진 여러 실행은 Langfuse에서 하나로 그룹화됩니다.
        agent.run("How to setup Langfuse integration in Koog agent?");
        agent.run("Show me a Java API  example");
    }
    ```
    <!--- KNIT exampleLangfuseExporterJava02.java -->

## 트레이스 대상

활성화되면 Langfuse 익스포터는 다음과 같은 Koog의 일반 OpenTelemetry 연동과 동일한 스팬(span)을 캡처합니다.

- **에이전트 수명 주기 이벤트**: 에이전트 시작, 중지, 오류
- **LLM 상호작용**: 프롬프트, 응답, 토큰 사용량, 지연 시간(latency)
- **도구 호출(Tool calls)**: 도구 호출에 대한 실행 트레이스
- **시스템 컨텍스트**: 모델 이름, 환경, Koog 버전과 같은 메타데이터

Koog는 Langfuse에서 [에이전트 그래프(Agent Graphs)](https://langfuse.com/docs/observability/features/agent-graphs)를 표시하는 데 필요한 스팬 속성도 캡처합니다.

보안상의 이유로 OpenTelemetry 스팬의 일부 내용은 기본적으로 마스킹됩니다.
Langfuse에서 내용을 확인할 수 있게 하려면, OpenTelemetry 구성에서 [setVerbose](opentelemetry-support.md#setverbose) 메서드를 사용하고 `verbose` 인자를 다음과 같이 `true`로 설정하세요.

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
        addLangfuseExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-langfuse-exporter-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleLangfuseExporterJava03 {
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
        config.addLangfuseExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleLangfuseExporterJava03.java -->

Langfuse에서 시각화하면 트레이스는 다음과 같이 나타납니다:
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

Langfuse OpenTelemetry 트레이싱에 대한 자세한 내용은 다음을 참조하세요:  
[Langfuse OpenTelemetry 문서](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint).

---

## 문제 해결

### Langfuse에 트레이스가 나타나지 않음
- `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`가 환경 변수에 올바르게 설정되어 있는지 다시 확인하세요.
- 자체 호스팅(self-hosted) Langfuse를 사용하는 경우, 애플리케이션 환경에서 `LANGFUSE_HOST`에 접속 가능한지 확인하세요.
- 퍼블릭/시크릿 키 쌍이 올바른 프로젝트에 속해 있는지 확인하세요.