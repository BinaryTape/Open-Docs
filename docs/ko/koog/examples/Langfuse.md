# OpenTelemetry를 사용하여 Koog 에이전트를 Langfuse로 트레이싱하기

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

이 노트북은 OpenTelemetry를 사용하여 Koog 에이전트 트레이스(trace)를 Langfuse 인스턴스로 내보내는 방법을 보여줍니다. 환경 변수를 설정하고, 간단한 에이전트를 실행한 다음, Langfuse에서 스팬(span)과 트레이스를 확인해 보겠습니다.

## 학습 내용

- Koog가 트레이스를 생성하기 위해 OpenTelemetry와 통합되는 방식
- 환경 변수를 통해 Langfuse 익스포터(exporter)를 구성하는 방법
- 에이전트를 실행하고 Langfuse에서 트레이스를 확인하는 방법

## 사전 준비 사항

- Langfuse 프로젝트 (호스트 URL, 퍼블릭 키, 시크릿 키)
- LLM 실행기를 위한 OpenAI API 키
- 셸(shell)에 설정된 환경 변수:

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # 또는 셀프 호스팅 URL
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
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * [Langfuse](https://langfuse.com/)로 Koog 에이전트 트레이싱을 수행하는 예제입니다.
 *
 * 에이전트 트레이스는 다음으로 내보내집니다:
 * - [OtlpHttpSpanExporter]를 사용하는 Langfuse OTLP 엔드포인트 인스턴스
 *
 * 이 예제를 실행하려면:
 *  1. [여기](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)에 설명된 대로 Langfuse 프로젝트 및 자격 증명을 설정하세요.
 *  2. [여기](https://langfuse.com/faq/all/where-are-langfuse-api-keys)에 설명된 대로 Langfuse 자격 증명을 가져오세요.
 *  3. `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` 환경 변수를 설정하세요.
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

다음 셀에서는 다음 작업을 수행합니다:

- OpenAI를 LLM 실행기로 사용하는 AIAgent를 생성합니다.
- OpenTelemetry 기능을 설치하고 Langfuse 익스포터를 추가합니다.
- Langfuse 구성을 위해 환경 변수를 활용합니다.

내부적으로 Koog는 에이전트 수명 주기, LLM 호출 및 도구 실행(있는 경우)에 대한 스팬을 생성합니다. Langfuse 익스포터는 OpenTelemetry 엔드포인트를 통해 이러한 스팬을 Langfuse 인스턴스로 전송합니다.

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Langfuse tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on the Langfuse instance"
}

```

## 에이전트 실행 및 트레이스 확인

다음 셀을 실행하여 간단한 프롬프트를 트리거합니다. 그러면 Langfuse 프로젝트로 내보낼 스팬이 생성됩니다.

### Langfuse에서 확인해야 할 사항

1. Langfuse 대시보드를 열고 프로젝트를 선택합니다.
2. Traces/Spans 뷰로 이동합니다.
3. 이 셀을 실행한 시간 주변의 최근 항목을 찾습니다.
4. 스팬을 상세히 탐색하여 다음을 확인합니다:
   - 에이전트 수명 주기 이벤트
   - LLM 요청/응답 메타데이터
   - 오류 (발생한 경우)

### 문제 해결

- 트레이스가 표시되지 않나요?
  - LANGFUSE_HOST, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY를 다시 확인하세요.
  - 네트워크가 Langfuse 엔드포인트로의 아웃바운드 HTTPS 연결을 허용하는지 확인하세요.
  - Langfuse 프로젝트가 활성 상태이고 키가 올바른 프로젝트에 속해 있는지 확인하세요.
- 인증 오류
  - Langfuse에서 키를 다시 생성하고 환경 변수를 업데이트하세요.
- OpenAI 문제
  - OPENAI_API_KEY가 설정되어 있고 유효한지 확인하세요.