# Koog 에이전트를 위한 Weave 트레이싱

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

이 노트북은 OpenTelemetry (OTLP)를 사용하여 Koog 에이전트를 W&B Weave에 트레이싱하는 방법을 보여줍니다.
간단한 Koog `AIAgent`를 생성하고, Weave 익스포터를 활성화하고, 프롬프트를 실행한 다음
Weave UI에서 풍부한 트레이스를 볼 것입니다.

배경 정보는 Weave OpenTelemetry 문서를 참조하세요: https://weave-docs.wandb.ai/guides/tracking/otel/

## 사전 요구 사항

예제를 실행하기 전에 다음 사항을 확인하세요:

- Weave/W&B 계정: https://wandb.ai
- https://wandb.ai/authorize 에서 얻은 API 키를 환경 변수 `WEAVE_API_KEY`로 노출
- Weave 엔티티(팀 또는 사용자) 이름을 `WEAVE_ENTITY`로 노출
  - W&B 대시보드 https://wandb.ai/home (왼쪽 사이드바 "Teams")에서 찾을 수 있습니다.
- `WEAVE_PROJECT_NAME`으로 노출된 프로젝트 이름 (설정되지 않은 경우, 이 예제는 `koog-tracing`을 사용합니다)
- Koog 에이전트를 실행하기 위해 `OPENAI_API_KEY`로 노출된 OpenAI API 키

예시 (macOS/Linux):
```bash
export WEAVE_API_KEY=...  # required by Weave
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## 노트북 설정

최신 Kotlin Jupyter 디스크립터를 사용합니다. Koog가 `%use` 플러그인으로 사전 구성되어 있다면,
아래 줄의 주석을 해제할 수 있습니다.

```kotlin
%useLatestDescriptors
//%use koog

```

## 에이전트 생성 및 Weave 트레이싱 활성화

최소한의 `AIAgent`를 구성하고 Weave 익스포터와 함께 `OpenTelemetry` 기능을 설치합니다.
이 익스포터는 환경 설정을 사용하여 OTLP 스팬을 Weave로 보냅니다:
- `WEAVE_API_KEY` — Weave 인증
- `WEAVE_ENTITY` — 트레이스를 소유하는 팀/사용자
- `WEAVE_PROJECT_NAME` — 트레이스를 저장할 Weave 프로젝트

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"

val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addWeaveExporter(
            weaveEntity = entity,
            weaveProjectName = projectName
        )
    }
}

```

## 에이전트 실행 및 Weave에서 트레이스 확인

간단한 프롬프트를 실행합니다. 완료 후, 인쇄된 링크를 열어 Weave에서 트레이스를 확인하세요.
에이전트 실행, 모델 호출, 그리고 기타 계측된 작업에 대한 스팬을 볼 수 있을 것입니다.

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Weave tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces"
}

```

## 문제 해결

- 트레이스가 보이지 않으면 `WEAVE_API_KEY`, `WEAVE_ENTITY`, `WEAVE_PROJECT_NAME`이 환경에 설정되어 있는지 확인하세요.
- 네트워크가 Weave의 OTLP 엔드포인트로 아웃바운드 HTTPS를 허용하는지 확인하세요.
- OpenAI 키가 유효하며 선택한 모델에 계정에서 접근할 수 있는지 확인하세요.