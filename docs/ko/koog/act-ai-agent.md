# FunctionalAIAgent: 단일 실행 에이전트(single‑run agent)를 단계별로 구축하는 방법

FunctionalAIAgent는 간단한 루프로 제어하는 경량의 비‑그래프(non‑graph) 에이전트입니다. 다음과 같은 경우에 사용하세요.
- 사용자 지정 루프에서 LLM을 한 번 또는 몇 번 호출할 때
- LLM 턴 사이에 선택적으로 도구를 호출할 때
- 전체 전략 그래프를 구축하지 않고 최종 값(문자열, 데이터 클래스 등)을 반환할 때

이 가이드에서 다룰 내용:
1) "Hello, World" FunctionalAIAgent 생성.
2) 도구를 추가하고 에이전트가 이를 호출하도록 하기.
3) 동작을 관찰하기 위한 기능(이벤트 핸들러) 추가.
4) 기록 압축을 통해 컨텍스트를 제어하기.
5) 일반적인 레시피, 주의사항 및 FAQ 알아보기.

## 1) 전제 조건
`PromptExecutor`(실제로 LLM과 통신하는 객체)가 필요합니다. 로컬 실험을 위해 Ollama executor를 사용할 수 있습니다.

```kotlin
val exec = simpleOllamaAIExecutor()
```

또한 모델을 선택해야 합니다. 예를 들어:

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

그게 전부입니다. 이 둘을 에이전트 팩토리에 주입할 것입니다.

## 2) 첫 번째 에이전트(Hello, World)
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

어떻게 작동하나요?
- `requestLLMMultiple(input)`는 사용자 입력을 전송하고 하나 이상의 어시스턴트 메시지를 수신합니다.
- 유일한 메시지의 내용을 반환합니다 (전형적인 단일샷(one‑shot) 흐름).

팁: 구조화된 데이터(structured data)를 반환하려면 내용을 파싱하거나 Structured Data API를 사용하세요.

## 3) 도구 추가 (에이전트가 함수를 호출하는 방법)
목표: 모델이 도구를 통해 작은 장치를 조작하도록 합니다.

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

작동 방식
- `containsToolCalls()`는 LLM에서 도구 호출 메시지를 감지합니다.
- `extractToolCalls(...)`는 실행할 도구와 인수를 읽습니다.
- `executeMultipleTools(...)`는 `ToolRegistry`에 대해 도구들을 실행합니다.
- `sendMultipleToolResults(...)`는 결과를 LLM으로 다시 보내고 다음 응답을 받습니다.

## 4) 기능(EventHandler)을 이용한 동작 관찰
목표: 모든 도구 호출을 콘솔에 출력합니다.

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCallStarting { e -> println("Tool called: ${e.tool.name}, args: ${e.toolArgs}") }
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

이런 방식으로 설치할 수 있는 다른 기능으로는 스트리밍 토큰과 트레이싱이 있습니다. 사이드바의 관련 문서를 참조하세요.

## 5) 컨텍스트 제어 (기록 압축)
긴 대화는 모델의 컨텍스트 창을 초과할 수 있습니다. 토큰 사용량을 기준으로 기록 압축 시기를 결정하세요.

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

모델과 프롬프트 크기에 적합한 임계값(threshold)을 사용하세요.

## 일반적인 레시피
- 구조화된 출력 반환
  - LLM에 JSON 형식으로 지정하도록 요청하고 파싱하거나 Structured Data API를 사용하세요.
- 도구 입력 유효성 검사
  - 도구 함수에서 유효성 검사를 수행하고 명확한 오류 메시지를 반환하세요.
- 요청당 하나의 에이전트 인스턴스
  - 각 에이전트 인스턴스는 한 번에 단일 실행됩니다. 동시성(concurrency)이 필요한 경우 새 인스턴스를 생성하세요.
- 사용자 지정 출력 유형
  - `functionalAIAgent<String, MyResult>`를 변경하고 루프에서 데이터 클래스를 반환하세요.

## 문제 해결 및 주의사항
- "에이전트가 이미 실행 중입니다"
  - FunctionalAIAgent는 동일한 인스턴스에서 동시 실행을 방지합니다. 병렬 코루틴(coroutines) 간에 하나의 인스턴스를 공유하지 마십시오. 실행마다 새 에이전트를 생성하거나 완료를 기다리십시오.
- 비어 있거나 예상치 못한 모델 출력
  - 시스템 프롬프트를 확인하세요. 중간 응답을 출력하세요. 퓨샷(few‑shot) 예제를 추가하는 것을 고려해 보세요.
- 루프가 끝나지 않음
  - 도구 호출이 없을 때 중단되도록 확인하고, 안전을 위해 가드(guards)/타임아웃을 추가하세요.
- 컨텍스트 오버플로
  - `latestTokenUsage()`를 관찰하고 `compressHistory()`를 호출하세요.

## 참조 (빠른)
생성자

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfigBase,
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

중요 유형
- FunctionalAIAgent<Input, Output>
- AIAgentFunctionalContext
- AIAgentConfig / AIAgentConfigBase
- PromptExecutor
- ToolRegistry
- FeatureContext and feature interfaces

소스 보기: agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt