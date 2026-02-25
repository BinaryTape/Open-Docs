# Koog를 사용하여 숫자 맞추기 에이전트 빌드하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

사용자가 생각하고 있는 숫자를 맞추는 작지만 재미있는 에이전트를 만들어 보겠습니다. Koog의 도구 호출(tool-calling) 기능을 활용하여 타겟 질문을 던지고, 전형적인 이진 탐색(binary search) 전략을 사용하여 정답에 수렴하도록 할 것입니다. 결과물은 문서에 바로 활용할 수 있는 관용적인 코틀린 노트북(Kotlin Notebook) 형태입니다.

코드는 최소한으로 유지하고 흐름은 투명하게 구성하겠습니다. 몇 개의 작은 도구와 간결한 프롬프트, 그리고 대화형 CLI 루프를 사용합니다.

## 설정

이 노트북은 다음을 가정합니다:
- Koog를 사용할 수 있는 코틀린 노트북 환경에서 실행 중입니다.
- 환경 변수 `OPENAI_API_KEY`가 설정되어 있습니다. 에이전트는 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))`를 통해 이 키를 사용합니다.

Koog 커널을 로드합니다:

```kotlin
%useLatestDescriptors
%use koog
```

## 도구: 타겟 질문 던지기

도구는 LLM이 호출할 수 있는 설명이 잘 된 작은 함수들입니다. 여기서는 다음 세 가지를 제공합니다:
- `lessThan(value)`: "당신의 숫자가 value보다 작습니까?"
- `greaterThan(value)`: "당신의 숫자가 value보다 큽니까?"
- `proposeNumber(value)`: "당신의 숫자가 value와 같습니까?" (범위가 좁혀졌을 때 사용)

각 도구는 단순한 "YES"/"NO" 문자열을 반환합니다. 헬퍼 함수 `ask`는 최소한의 Y/n 루프를 구현하고 입력을 검증합니다. `@LLMDescription`을 통한 설명은 모델이 도구를 올바르게 선택하는 데 도움을 줍니다.

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

## 도구 레지스트리 (Tool Registry)

도구를 에이전트에게 노출합니다. 에이전트가 사용자에게 메시지를 직접 표시할 수 있도록 내장 도구인 `SayToUser`도 추가합니다.

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## 에이전트 설정

도구 중심의 짧은 시스템 프롬프트만 있으면 충분합니다. 이진 탐색 전략을 제안하고, 안정적이고 결정론적인 동작을 위해 `temperature = 0.0`으로 설정합니다. 여기서는 명확한 계획 수립을 위해 OpenAI의 추론 모델인 `GPT4oMini`를 사용합니다.

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

- 1에서 100 사이의 숫자를 생각하세요.
- `start`를 입력하여 시작합니다.
- 에이전트의 질문에 `Y`/`Enter`(예) 또는 `n`(아니요)으로 답하세요. 에이전트는 약 7단계 내에 숫자를 찾아낼 것입니다.

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

## 작동 원리

- 에이전트는 시스템 프롬프트를 읽고 이진 탐색을 계획합니다.
- 각 반복 단계에서 `lessThan`, `greaterThan` 또는 (확신이 들 때) `proposeNumber` 중 하나의 도구를 호출합니다.
- 헬퍼 함수 `ask`는 사용자의 Y/n 입력을 수집하여 모델에 깨끗한 "YES"/"NO" 신호를 반환합니다.
- 확인을 받으면 `SayToUser`를 통해 축하 메시지를 보냅니다.

## 확장하기

- 시스템 프롬프트를 수정하여 범위를 변경해 보세요 (예: 1..1000).
- 호출 횟수를 더 줄이기 위해 `between(low, high)` 도구를 추가해 보세요.
- 동일한 도구를 유지하면서 모델이나 실행기(executor)를 교체해 보세요 (예: Ollama 실행기와 로컬 모델 사용).
- 분석을 위해 추측 내용이나 결과를 저장소에 유지해 보세요.

## 문제 해결

- 키 누락: 환경 변수에 `OPENAI_API_KEY`가 설정되어 있는지 확인하세요.
- 커널을 찾을 수 없음: `%useLatestDescriptors`와 `%use koog`가 성공적으로 실행되었는지 확인하세요.
- 도구가 호출되지 않음: `ToolRegistry`에 `GuesserTool()`이 포함되어 있는지, 그리고 프롬프트의 이름이 도구 함수와 일치하는지 확인하세요.