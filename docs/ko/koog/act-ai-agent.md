# FunctionalAIAgent: 단계별로 싱글 런(single-run) 에이전트 구축하기

FunctionalAIAgent는 간단한 루프로 제어할 수 있는 가벼운 비그래프형(non‑graph) 에이전트입니다. 다음과 같은 경우에 사용하세요:
- 커스텀 루프 내에서 LLM을 한 번 또는 몇 번 호출하고 싶을 때
- LLM 호출 사이에 선택적으로 도구(tool)를 호출하고 싶을 때
- 전체 전략 그래프를 구축하지 않고 최종 값(문자열, 데이터 클래스 등)을 반환하고 싶을 때

이 가이드에서 다룰 내용:
1) "Hello, World" FunctionalAIAgent 만들기
2) 도구를 추가하고 에이전트가 호출하도록 설정하기
3) 동작 관찰을 위한 기능(이벤트 핸들러) 추가하기
4) 이력 압축(history compression)으로 컨텍스트 제어하기
5) 일반적인 레시피, 주의 사항 및 FAQ 학습하기

## 1) 전제 조건
`PromptExecutor`(LLM과 실제로 통신하는 객체)가 필요합니다. 로컬 테스트를 위해 Ollama 실행기를 사용할 수 있습니다:

```kotlin
val exec = simpleOllamaAIExecutor()
```

또한 사용할 모델을 선택해야 합니다. 예:

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

준비가 끝났습니다. 이제 이 두 가지를 에이전트 팩토리에 주입해 보겠습니다.

## 2) 첫 번째 에이전트 (Hello, World)
목표: 사용자의 텍스트를 LLM에 보내고 단일 어시스턴트 메시지를 문자열로 반환합니다.

```kotlin
val agent = functionalAIAgent<String, String>(
    prompt = "You are a helpful assistant.",
    promptExecutor = exec,
    model = model
) { input ->
    val responses = requestLLMMultiple(input)
    responses.single().asAssistantMessage().content
}

val result = agent.run("Say hi in one sentence")
println(result)
```

어떤 일이 일어나나요?
- `requestLLMMultiple(input)`은 사용자 입력을 보내고 하나 이상의 어시스턴트 메시지를 받습니다.
- 유일한 메시지의 내용(콘텐츠)을 반환합니다 (일반적인 원샷(one-shot) 흐름).

팁: 구조화된 데이터를 반환하려면 콘텐츠를 파싱하거나 Structured Data API를 사용하세요.

## 3) 도구 추가 (에이전트가 함수를 호출하는 방법)
목표: 모델이 도구를 통해 작은 장치를 조작할 수 있도록 합니다.

```kotlin
class Switch {
    private var on = false
    fun on() { on = true }
    fun off() { on = false }
    fun isOn() = on
}

class SwitchTools(private val sw: Switch) {
    fun turn_on() = run { sw.on(); "ok" }
    fun turn_off() = run { sw.off(); "ok" }
    fun state() = if (sw.isOn()) "on" else "off"
}

val sw = Switch()
val tools = ToolRegistry { tools(SwitchTools(sw).asTools()) }

val toolAgent = functionalAIAgent<String, String>(
    prompt = "You're responsible for running a Switch device and perform operations on it by request.",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools
) { input ->
    var responses = requestLLMMultiple(input)

    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }

    responses.single().asAssistantMessage().content
}

val out = toolAgent.run("Turn switch on")
println(out)
println("Switch is ${if (sw.isOn()) "on" else "off"}")
```

작동 원리
- `containsToolCalls()`는 LLM으로부터 도구 호출 메시지가 있는지 감지합니다.
- `extractToolCalls(...)`는 어떤 도구를 어떤 인자로 실행할지 읽어옵니다.
- `executeMultipleTools(...)`는 `ToolRegistry`를 대상으로 도구들을 실행합니다.
- `sendMultipleToolResults(...)`는 결과를 다시 LLM에 보내고 다음 응답을 받습니다.

## 4) 기능(EventHandler)을 통한 동작 관찰
목표: 모든 도구 호출을 콘솔에 출력합니다.

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCallStarting { e -> println("Tool called: ${'
    ```}{e.tool.name}, args: ${'
    ```}{e.toolArgs}") }
        }
    }
) { input ->
    var responses = requestLLMMultiple(input)
    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }
    responses.single().asAssistantMessage().content
}
```

이러한 방식으로 설치할 수 있는 다른 기능으로는 스트리밍 토큰(streaming tokens) 및 트레이싱(tracing)이 있습니다. 사이드바의 관련 문서를 참조하세요.

## 5) 컨텍스트 제어 (이력 압축)
대화가 길어지면 모델의 컨텍스트 창을 초과할 수 있습니다. 토큰 사용량을 확인하여 이력(history)을 압축할 시점을 결정하세요:

```kotlin
var responses = requestLLMMultiple(input)

while (responses.containsToolCalls()) {
    if (latestTokenUsage() > 100_000) {
        compressHistory()
    }
    val pending = extractToolCalls(responses)
    val results = executeMultipleTools(pending)
    responses = sendMultipleToolResults(results)
}
```

모델과 프롬프트 크기에 적절한 임계값을 사용하세요.

## 일반적인 레시피
- **구조화된 출력(Structured output) 반환**
  - LLM에게 JSON 형식을 요청하고 이를 파싱하거나, Structured Data API를 사용하세요.
- **도구 입력 검증**
  - 도구 함수 내에서 검증을 수행하고 명확한 에러 메시지를 반환하세요.
- **요청당 하나의 에이전트 인스턴스**
  - 각 에이전트 인스턴스는 한 번에 하나의 실행만 처리합니다. 동시성이 필요한 경우 새 인스턴스를 생성하세요.
- **커스텀 출력(Output) 타입**
  - `functionalAIAgent<String, MyResult>`와 같이 타입을 변경하고 루프에서 데이터 클래스를 반환하세요.

## 문제 해결 및 주의 사항
- **“Agent is already running”**
  - `FunctionalAIAgent`는 동일한 인스턴스에서 동시 실행을 방지합니다. 여러 코루틴에서 하나의 인스턴스를 공유하지 마세요. 실행마다 새로운 에이전트를 생성하거나 완료될 때까지 기다리세요.
- **비어 있거나 예상치 못한 모델 출력**
  - 시스템 프롬프트를 확인하세요. 중간 응답을 출력해 보세요. 퓨샷(few-shot) 예제를 추가하는 것을 고려해 보세요.
- **루프가 끝나지 않음**
  - 도구 호출이 없을 때 루프를 빠져나가는지 확인하세요. 안전을 위해 가드(guard)나 타임아웃을 추가하세요.
- **컨텍스트 오버플로**
  - `latestTokenUsage()`를 모니터링하고 `compressHistory()`를 호출하세요.

## 레퍼런스 (요약)
생성자

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfig,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    loop: suspend AIAgentFunctionalContext.(input: Input) -> Output
): AIAgent<Input, Output>

fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    prompt: String = "",
    model: LLModel = OpenAIModels.Chat.GPT4o,
    featureContext: FeatureContext.() -> Unit = {},
    func: suspend AIAgentFunctionalContext.(input: Input) -> Output,
): AIAgent<Input, Output>
```

주요 타입
- `FunctionalAIAgent<Input, Output>`
- `AIAgentFunctionalContext`
- `AIAgentConfig` / `AIAgentConfigBase`
- `PromptExecutor`
- `ToolRegistry`
- `FeatureContext` 및 기능 인터페이스

소스 코드 참조: `agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt`