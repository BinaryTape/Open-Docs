# W&B Weave 익스포터(exporter)

Koog는 AI 애플리케이션의 관측성(observability) 및 분석을 위한 Weights & Biases의 개발자 도구인 [W&B Weave](https://wandb.ai/site/weave/)로 에이전트 트레이스(agent traces)를 내보낼 수 있는 내장 지원을 제공합니다.  
Weave 통합을 통해 프롬프트, 컴플리션(completions), 시스템 컨텍스트, 실행 트레이스를 캡처하고 W&B 워크스페이스에서 직접 시각화할 수 있습니다.

Koog의 OpenTelemetry 지원에 대한 배경 지식은 [OpenTelemetry 지원](https://docs.koog.ai/opentelemetry-support/)을 참조하세요.

---

## 설정 지침

1. [https://wandb.ai](https://wandb.ai)에서 W&B 계정을 생성합니다.
2. [https://wandb.ai/authorize](https://wandb.ai/authorize)에서 API 키를 가져옵니다.
3. [https://wandb.ai/home](https://wandb.ai/home)의 W&B 대시보드를 방문하여 엔티티(entity) 이름을 찾습니다.
   엔티티는 일반적으로 개인 계정인 경우 사용자 이름이고, 팀/조직 이름일 수도 있습니다.
4. 프로젝트 이름을 정의합니다. 프로젝트를 미리 생성할 필요는 없으며, 첫 번째 트레이스가 전송될 때 자동으로 생성됩니다.
5. Weave 엔티티, 프로젝트 이름 및 API 키를 Weave 익스포터에 전달합니다.
   이는 `addWeaveExporter()` 함수에 파라미터로 제공하거나, 아래와 같이 환경 변수를 설정하여 수행할 수 있습니다.

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```
<!--- KNIT example-weave-exporter-01.txt -->

## 구성

Weave 내보내기를 활성화하려면 **OpenTelemetry 피처(feature)**를 설치하고 `WeaveExporter`를 추가하세요.  
익스포터는 `OtlpHttpSpanExporter`를 통해 Weave의 OpenTelemetry 엔드포인트를 사용합니다.

### 예시: Weave 트레이싱이 적용된 에이전트

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
        val entity = System.getenv()["WEAVE_ENTITY"] 
            ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
        
        val projectName = System.getenv()["WEAVE_PROJECT_NAME"] 
            ?: "koog-tracing"
        
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.GPT4oMini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                addWeaveExporter()
            }
        }
    
        println("Running agent with Weave tracing")
    
        val result = agent.run("Tell me a joke about programming")
        println("Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces")
    }
    ```
    <!--- KNIT example-weave-exporter-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.Optional;
    public class exampleWeaveExporterJava01 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var entity = Optional.ofNullable(System.getenv("WEAVE_ENTITY"))
            .filter(env -> !env.isBlank())
            .orElseThrow(() -> new IllegalArgumentException("WEAVE_ENTITY is not set"));

        var projectName = Optional.ofNullable(System.getenv("WEAVE_PROJECT_NAME"))
            .filter(env -> !env.isBlank())
            .orElse("koog-tracing");

        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.GPT4oMini)
            .systemPrompt("You are a helpful assistant.")
            .install(OpenTelemetry.Feature, config ->
                config.addWeaveExporter(null, entity, projectName)
            )
            .build();

        System.out.println("Running agent with Weave tracing");

        var result = agent.run("Tell me a joke about programming");
        System.out.println("Result: " + result + "
See traces on https://wandb.ai/" + entity + "/" + projectName + "/weave/traces");
    }
    ```
    <!--- KNIT exampleWeaveExporterJava01.java -->

## 트레이스 대상

활성화되면 Weave 익스포터는 다음을 포함하여 Koog의 일반 OpenTelemetry 통합과 동일한 스팬(spans)을 캡처합니다.

- **에이전트 수명 주기 이벤트**: 에이전트 시작, 중지, 오류
- **LLM 상호작용**: 프롬프트, 컴플리션, 지연 시간(latency)
- **도구 호출(Tool calls)**: 도구 호출에 대한 실행 트레이스
- **시스템 컨텍스트**: 모델 이름, 환경, Koog 버전과 같은 메타데이터

보안상의 이유로 OpenTelemetry 스팬의 일부 콘텐츠는 기본적으로 마스킹됩니다.
콘텐츠를 Weave에서 사용할 수 있게 하려면 OpenTelemetry 구성에서 [setVerbose](opentelemetry-support.md#setverbose) 메서드를 사용하고 다음과 같이 `verbose` 인자를 `true`로 설정하세요.

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
        addWeaveExporter()
        setVerbose(true)
    }
    ```
    <!--- KNIT example-weave-exporter-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import java.util.List;
    import java.util.UUID;
    public class exampleWeaveExporterJava02 {
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
        config.addWeaveExporter();
        config.setVerbose(true);
    })
    ```
    <!--- KNIT exampleWeaveExporterJava02.java -->

W&B Weave에서 시각화하면 트레이스는 다음과 같이 나타납니다.
![W&B Weave traces](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave traces](img/opentelemetry-weave-exporter-dark.png#only-dark)

자세한 내용은 공식 [Weave OpenTelemetry 문서](https://weave-docs.wandb.ai/guides/tracking/otel/)를 참조하세요.

---

## 문제 해결

### Weave에 트레이스가 나타나지 않음
- 환경에 `WEAVE_API_KEY`, `WEAVE_ENTITY`, `WEAVE_PROJECT_NAME`이 설정되어 있는지 확인하세요.
- W&B 계정이 지정된 엔티티 및 프로젝트에 액세스할 수 있는지 확인하세요.

### 인증 오류
- `WEAVE_API_KEY`가 유효한지 확인하세요.
- API 키에는 선택한 엔티티에 대한 트레이스 쓰기 권한이 있어야 합니다.

### 연결 문제
- 사용자 환경에서 W&B의 OpenTelemetry 수집 엔드포인트에 대한 네트워크 액세스가 가능한지 확인하세요.