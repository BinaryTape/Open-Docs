# 프롬프트

프롬프트는 대규모 언어 모델(LLM)이 응답을 생성하도록 안내하는 지침입니다.
프롬프트는 LLM과의 상호 작용 내용과 구조를 정의합니다.
이 섹션에서는 Koog를 사용하여 프롬프트를 생성하고 실행하는 방법을 설명합니다.

## 프롬프트 생성

Koog에서 모든 프롬프트는 [**Prompt**](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.dsl/-prompt/index.html)
객체로 표현됩니다. Prompt 객체는 다음을 포함합니다:

- **ID**: 프롬프트의 고유 식별자.
- **Messages**: LLM과의 대화를 나타내는 메시지 목록.
- **Parameters**: 선택적 [LLM 구성 매개변수](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.params/-l-l-m-params/index.html)
  (예: `temperature`, `tool choice` 등).

모든 Prompt 객체는 Kotlin DSL을 사용하여 정의된 구조화된 프롬프트로, 대화의 구조를 지정할 수 있게 해줍니다.

!!! note
    AI 에이전트는 Prompt 객체를 생성하는 대신 간단한 텍스트 프롬프트를 제공할 수 있도록 합니다.
    이들은 텍스트 프롬프트를 Prompt 객체로 자동 변환하여 LLM으로 보내 실행합니다.
    이는 단일 요청만 실행하면 되는 [기본 에이전트](basic-agents.md)에 유용합니다.

<div class="grid cards" markdown>

-   :material-code-braces:{ .lg .middle } [**구조화된 프롬프트**](structured-prompts.md)

    ---

    복잡한 다중 턴 대화를 위한 타입-세이프(type-safe)한 구조화된 프롬프트를 생성합니다.

-   :material-multimedia:{ .lg .middle } [**다중 모드 입력**](multimodal-inputs.md)

    ---

    구조화된 프롬프트에서 텍스트와 함께 이미지, 오디오, 비디오, 문서를 전송합니다.

</div>

## 프롬프트 실행

Koog는 LLM에 대해 프롬프트를 실행하기 위한 두 가지 추상화 수준을 제공합니다: LLM 클라이언트와 프롬프트 실행기.
이들은 Prompt 객체만 허용하며, AI 에이전트 없이 직접 프롬프트 실행에 사용될 수 있습니다.
클라이언트와 실행기 모두에 대한 실행 흐름은 동일합니다:

```mermaid
flowchart TB
    A([Kotlin DSL로 빌드된 Prompt])
    B{LLM 클라이언트 또는 프롬프트 실행기}
    C[LLM 제공자]
    D([애플리케이션으로의 응답])

    A -->|"전달"| B
    B -->|"요청 전송"| C
    C -->|"응답 반환"| B
    B -->|"결과 반환"| D
```

<div class="grid cards" markdown>

-   :material-arrow-right-bold:{ .lg .middle } [**LLM 클라이언트**](llm-clients.md)

    ---

    특정 LLM 제공자와 직접 상호 작용하기 위한 저수준 인터페이스입니다.
    단일 제공자와 작업하고 고급 수명 주기 관리가 필요하지 않을 때 사용합니다.

-   :material-swap-horizontal:{ .lg .middle } [**프롬프트 실행기**](prompt-executors.md)

    ---

    하나 이상의 LLM 클라이언트의 수명 주기를 관리하는 고수준 추상화입니다.
    여러 제공자에서 프롬프트를 실행하기 위한 통합 API가 필요하고, 이들 간의 동적 전환 및 대체 기능이 필요할 때 사용합니다.

</div>

간단한 텍스트 프롬프트를 실행하려면 Kotlin DSL을 사용하여 Prompt 객체로 감싸거나,
이 작업을 자동으로 수행하는 AI 에이전트를 사용하세요.
에이전트의 실행 흐름은 다음과 같습니다:

```mermaid
flowchart TB
    A([애플리케이션])
    B{{구성된 AI 에이전트}}
    C["텍스트 프롬프트"]
    D["Prompt 객체"]
    E{{프롬프트 실행기}}
    F[LLM 제공자]

    A -->|"텍스트로 run() 실행"| B
    B -->|"수신"| C
    C -->|"변환"| D
    D -->|"통해 전송"| E
    E -->|"호출"| F
    F -->|"응답"| E
    E -->|"결과 전송"| B
    B -->|"결과 전송"| A
```

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

val apiKey = System.getenv("OPENAI_API_KEY")

fun main() = runBlocking {
-->
<!--- SUFFIX
}
-->
```kotlin
// 에이전트 생성
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o
)

// 에이전트 실행
val result = agent.run("What is Koog?")
```
<!--- KNIT example-prompts-01.kt -->

## 성능 최적화 및 실패 처리

Koog는 프롬프트 실행 시 성능을 최적화하고 실패를 처리할 수 있도록 합니다.

<div class="grid cards" markdown>

-   :material-cached:{ .lg .middle } [**LLM 응답 캐싱**](llm-response-caching.md)

    ---

    LLM 응답을 캐시하여 반복되는 요청에 대한 성능을 최적화하고 비용을 절감합니다.

-   :material-shield-check:{ .lg .middle } [**실패 처리**](handling-failures.md)

    ---

    애플리케이션에서 내장된 재시도, 타임아웃 및 기타 오류 처리 메커니즘을 사용합니다.

</div>