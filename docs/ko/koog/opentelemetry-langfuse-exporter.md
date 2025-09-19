# Langfuse 익스포터

Koog는 AI 애플리케이션의 관측 가능성 및 분석 플랫폼인 [Langfuse](https://langfuse.com/)로 에이전트 트레이스를 내보내는 내장 지원을 제공합니다.  
Langfuse 통합을 통해 Koog 에이전트가 LLM, API 및 기타 구성 요소와 상호 작용하는 방식을 시각화하고, 분석하고, 디버그할 수 있습니다.

Koog의 OpenTelemetry 지원에 대한 배경 정보는 [OpenTelemetry 지원](https://docs.koog.ai/opentelemetry-support/) 문서를 참조하세요.

---

### 설정 지침

1.  Langfuse 프로젝트를 생성합니다. [Langfuse에서 새 프로젝트 생성](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 설정 가이드를 따르세요.
2.  API 자격 증명을 얻습니다. [Langfuse API 키는 어디에 있나요?](https://langfuse.com/faq/all/where-are-langfuse-api-keys)에 설명된 대로 Langfuse `public key`와 `secret key`를 검색합니다.
3.  Langfuse 호스트, 공개 키, 및 비밀 키를 Langfuse 익스포터에 전달합니다.  
    이는 `addLangfuseExporter()` 함수의 매개변수로 제공하거나, 아래와 같이 환경 변수를 설정하여 수행할 수 있습니다.

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 구성

Langfuse 내보내기를 활성화하려면 **OpenTelemetry 기능**을 설치하고 `LangfuseExporter`를 추가합니다.  
익스포터는 내부적으로 `OtlpHttpSpanExporter`를 사용하여 Langfuse의 OpenTelemetry 엔드포인트로 트레이스를 보냅니다.

### 예시: Langfuse 트레이싱을 사용하는 에이전트

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
        systemPrompt = "You are a code assistant. Provide concise code examples."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter()
        }
    }

    println("Langfuse 트레이싱으로 에이전트 실행 중")

    val result = agent.run("Tell me a joke about programming")

    println("결과: $result
Langfuse 인스턴스에서 트레이스를 확인하세요")
}
```
<!--- KNIT example-langfuse-exporter-01.kt -->

## 트레이스되는 내용

활성화되면 Langfuse 익스포터는 Koog의 일반적인 OpenTelemetry 통합과 동일한 스팬을 캡처하며, 다음을 포함합니다:

-   **에이전트 생명 주기 이벤트**: 에이전트 시작, 중지, 오류
-   **LLM 상호 작용**: 프롬프트, 응답, 토큰 사용량, 지연 시간
-   **도구 호출**: 도구 호출을 위한 실행 트레이스
-   **시스템 컨텍스트**: 모델 이름, 환경, Koog 버전과 같은 메타데이터

Koog는 [에이전트 그래프](https://langfuse.com/docs/observability/features/agent-graphs)를 표시하기 위해 Langfuse가 요구하는 스팬 속성도 캡처합니다.

Langfuse에서 시각화될 때, 트레이스는 다음과 같이 나타납니다:
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opnetelemetry-langfuse-exporter-dark.png#only-dark)

Langfuse OpenTelemetry 트레이싱에 대한 자세한 내용은 다음을 참조하세요:  
[Langfuse OpenTelemetry 문서](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint).

---

## 문제 해결

### Langfuse에 트레이스가 나타나지 않음
-   `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, 및 `LANGFUSE_SECRET_KEY`가 환경에 설정되어 있는지 다시 확인하세요.
-   자체 호스팅 Langfuse에서 실행 중인 경우, `LANGFUSE_HOST`가 애플리케이션 환경에서 도달 가능한지 확인하세요.
-   공개/비밀 키 쌍이 올바른 프로젝트에 속하는지 확인하세요.