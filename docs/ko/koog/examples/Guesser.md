# Koog로 숫자 맞추기 에이전트 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

당신이 생각하는 숫자를 맞추는 작지만 재미있는 에이전트를 만들어 봅시다. Koog의 도구 호출(tool-calling) 기능을 활용하여 대상 질문을 하고 고전적인 이진 탐색(binary search) 전략을 사용하여 수렴하도록 할 것입니다. 그 결과는 문서에 바로 적용할 수 있는 관용적인 Kotlin Notebook이 됩니다.

코드는 최소한으로 유지하고 흐름은 투명하게 할 것입니다. 몇 개의 작은 도구, 간결한 프롬프트, 그리고 대화형 CLI 루프로 구성됩니다.

## 설정

이 노트북은 다음을 가정합니다:
- Koog를 사용할 수 있는 Kotlin Notebook에서 실행 중입니다.
- 환경 변수 `OPENAI_API_KEY`가 설정되어 있습니다. 에이전트는 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))`를 통해 이를 사용합니다.

Koog 커널을 로드합니다:

```kotlin
%useLatestDescriptors
%use koog
```

## 도구: 대상 질문하기

도구는 LLM(Large Language Model)이 호출할 수 있는 작고 잘 설명된 함수입니다. 세 가지를 제공할 것입니다:
- `lessThan(value)`: "당신의 숫자가 value보다 작습니까?"
- `greaterThan(value)`: "당신의 숫자가 value보다 큽니까?"
- `proposeNumber(value)`: "당신의 숫자가 value와 같습니까?" (범위가 좁아지면 사용)

각 도구는 간단한 "YES"/"NO" 문자열을 반환합니다. 헬퍼 함수 `ask`는 최소한의 Y/n 루프를 구현하고 입력을 검증합니다. `@LLMDescription`을 통한 설명은 모델이 도구를 올바르게 선택하는 데 도움이 됩니다.

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

class GuesserTool : ToolSet {

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY less than a given value.")
    fun lessThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number less than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY greater than a given value.")
    fun greaterThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number greater than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is EXACTLY equal to the given number. Only use this tool once you've narrowed down your answer.")
    fun proposeNumber(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number equal to $value?", value)

    fun ask(question: String, value: Int): String {
        print("$question [Y/n]: ")
        val input = readln()
        println(input)

        return when (input.lowercase()) {
            "", "y", "yes" -> "YES"
            "n", "no" -> "NO"
            else -> {
                println("Invalid input! Please, try again.")
                ask(question, value)
            }
        }
    }
}
```

## 도구 레지스트리

에이전트에 도구를 노출합니다. 또한 에이전트가 사용자에게 직접 메시지를 전달할 수 있도록 내장 `SayToUser` 도구를 추가합니다.

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## 에이전트 구성

짧고 도구 중심적인 시스템 프롬프트면 충분합니다. 우리는 이진 탐색 전략을 제안하고 안정적이고 결정론적인 동작을 위해 `temperature = 0.0`을 유지할 것입니다. 여기서는 명확한 계획을 위해 OpenAI의 추론 모델 `GPT4oMini`를 사용합니다.

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = """
            You are a number guessing agent. Your goal is to guess a number that the user is thinking of.
            
            Follow these steps:
            1. Start by asking the user to think of a number between 1 and 100.
            2. Use the less_than and greater_than tools to narrow down the range.
                a. If it's neither greater nor smaller, use the propose_number tool.
            3. Once you're confident about the number, use the propose_number tool to check if your guess is correct.
            4. If your guess is correct, congratulate the user. If not, continue guessing.
            
            Be efficient with your guessing strategy. A binary search approach works well.
        """.trimIndent(),
    temperature = 0.0,
    toolRegistry = toolRegistry
)
```

## 실행하기

- 1에서 100 사이의 숫자를 생각하십시오.
- 시작하려면 `start`를 입력하세요.
- 에이전트의 질문에 "예"는 `Y`/`Enter`로, "아니오"는 `n`으로 답하세요. 에이전트는 약 7단계 안에 당신의 숫자를 정확히 맞출 것입니다.

```kotlin
import kotlinx.coroutines.runBlocking

println("Number Guessing Game started!")
println("Think of a number between 1 and 100, and I'll try to guess it.")
println("Type 'start' to begin the game.")

val initialMessage = readln()
runBlocking {
    agent.run(initialMessage)
}
```

## 작동 방식

- 에이전트는 시스템 프롬프트를 읽고 이진 탐색을 계획합니다.
- 각 반복에서 에이전트는 `lessThan`, `greaterThan` 또는 (확실할 때) `proposeNumber` 중 하나를 호출합니다.
- 헬퍼 함수 `ask`는 당신의 Y/n 입력을 수집하고 깨끗한 "YES"/"NO" 신호를 모델에 다시 반환합니다.
- 확인을 받으면 `SayToUser`를 통해 당신을 축하합니다.

## 확장하기

- 시스템 프롬프트를 조정하여 범위를 변경하십시오 (예: 1..1000).
- `between(low, high)` 도구를 추가하여 호출 횟수를 더 줄이십시오.
- 동일한 도구를 유지하면서 모델이나 실행기(executor)를 교체하십시오 (예: Ollama 실행기와 로컬 모델 사용).
- 분석을 위해 추측 또는 결과를 저장소에 유지하십시오.

## 문제 해결

- 키 누락: `OPENAI_API_KEY`가 환경에 설정되어 있는지 확인하십시오.
- 커널을 찾을 수 없음: `%useLatestDescriptors` 및 `%use koog`가 성공적으로 실행되었는지 확인하십시오.
- 도구가 호출되지 않음: `ToolRegistry`에 `GuesserTool()`이 포함되어 있고 프롬프트의 이름이 도구 함수와 일치하는지 확인하십시오.