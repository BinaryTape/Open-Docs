# OpenTelemetry를 사용하여 Koog 에이전트의 Langfuse 트레이싱

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

이 노트북은 OpenTelemetry를 사용하여 Koog 에이전트 트레이스를 Langfuse 인스턴스로 내보내는 방법을 보여줍니다. 환경 변수를 설정하고, 간단한 에이전트를 실행한 다음, Langfuse에서 스팬과 트레이스를 검사합니다.

## 학습할 내용

- Koog가 OpenTelemetry와 통합하여 트레이스를 내보내는 방법
- 환경 변수를 통해 Langfuse 익스포터를 구성하는 방법
- 에이전트를 실행하고 Langfuse에서 해당 트레이스를 보는 방법

## 전제 조건

- Langfuse 프로젝트 (호스트 URL, 공개 키, 비밀 키)
- LLM 실행기를 위한 OpenAI API 키
- 셸에 설정된 환경 변수:

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # or your self-hosted URL
export LANGFUSE_PUBLIC_KEY=pk_...
export LANGFUSE_SECRET_KEY=sk_...
```

```kotlin
%useLatestDescriptors
//%use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * [Langfuse](https://langfuse.com/)로 Koog 에이전트 트레이스를 하는 예시
 *
 * 에이전트 트레이스는 다음으로 내보내집니다:
 * - [OtlpHttpSpanExporter]를 사용하여 Langfuse OTLP 엔드포인트 인스턴스
 *
 * 이 예시를 실행하려면:
 *  1. [여기](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)에 설명된 대로 Langfuse 프로젝트 및 자격 증명 설정
 *  2. [여기](https://langfuse.com/faq/all/where-are-langfuse-api-keys)에 설명된 대로 Langfuse 자격 증명 가져오기
 *  3. `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` 환경 변수 설정
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry 문서</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## 에이전트 및 Langfuse 익스포터 구성

다음 셀에서는 다음을 수행합니다:

- OpenAI를 LLM 실행기로 사용하는 AIAgent를 생성합니다.
- OpenTelemetry 기능을 설치하고 Langfuse 익스포터를 추가합니다.
- Langfuse 구성에 환경 변수를 활용합니다.

내부적으로 Koog는 에이전트 라이프사이클, LLM 호출 및 도구 실행(있는 경우)에 대한 스팬을 내보냅니다. Langfuse 익스포터는 OpenTelemetry 엔드포인트를 통해 해당 스팬을 Langfuse 인스턴스로 전송합니다.

```kotlin
import kotlinx.coroutines.runBlocking

println("Langfuse 트레이싱을 사용하여 에이전트 실행 중")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "결과: $result
Langfuse 인스턴스에서 트레이스 확인"
}
```

## 에이전트 실행 및 트레이스 보기

다음 셀을 실행하여 간단한 프롬프트를 트리거합니다. 이는 Langfuse 프로젝트로 내보내지는 스팬을 생성합니다.

### Langfuse에서 확인할 위치

1.  Langfuse 대시보드를 열고 프로젝트를 선택합니다.
2.  트레이스/스팬 보기로 이동합니다.
3.  이 셀을 실행한 시간대에 최근 항목을 찾습니다.
4.  스팬을 자세히 살펴보면 다음을 볼 수 있습니다:
    - 에이전트 라이프사이클 이벤트
    - LLM 요청/응답 메타데이터
    - 오류 (있는 경우)

### 문제 해결

- 트레이스가 표시되지 않습니까?
  - LANGFUSE_HOST, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY를 다시 확인하십시오.
  - 네트워크가 Langfuse 엔드포인트로의 아웃바운드 HTTPS를 허용하는지 확인하십시오.
  - Langfuse 프로젝트가 활성 상태이고 키가 올바른 프로젝트에 속하는지 확인하십시오.
- 인증 오류
  - Langfuse에서 키를 다시 생성하고 환경 변수를 업데이트하십시오.
- OpenAI 문제
  - OPENAI_API_KEY가 설정되어 있고 유효한지 확인하십시오.