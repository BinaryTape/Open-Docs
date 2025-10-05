# Koog를 사용하여 툴 호출 계산기 에이전트 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

이 미니 튜토리얼에서는 **Koog** 툴 호출을 기반으로 하는 계산기 에이전트를 구축합니다.
다음 방법을 배우게 됩니다.
- 산술 연산을 위한 작고 순수한 **툴** 설계하기
- Koog의 다중 호출 전략을 사용하여 **병렬** 툴 호출 오케스트레이션하기
- 투명성을 위한 경량 **이벤트 로깅** 추가하기
- OpenAI (선택적으로 Ollama)와 함께 실행하기

API는 깔끔하고 코틀린다우며(idiomatic Kotlin), 예측 가능한 결과를 반환하고 (0으로 나누기와 같은) 예외 상황을 우아하게 처리합니다.

## 설정

Koog를 사용할 수 있는 Kotlin Notebook 환경에 있다고 가정합니다.
LLM 실행기를 제공하세요.

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 계산기 툴

툴은 명확한 계약(규칙)을 가진 작고 순수한 함수입니다.
더 나은 정밀도를 위해 `Double`을 사용하고 출력을 일관되게 포맷할 것입니다.

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// Format helper: integers render cleanly, decimals keep reasonable precision.
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("Tools for basic calculator operations")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("Adds two numbers and returns the sum as text.")
    fun plus(
        @LLMDescription("First addend.") a: Double,
        @LLMDescription("Second addend.") b: Double
    ): String = (a + b).pretty()

    @Tool
    @LLMDescription("Subtracts the second number from the first and returns the difference as text.")
    fun minus(
        @LLMDescription("Minuend.") a: Double,
        @LLMDescription("Subtrahend.") b: Double
    ): String = (a - b).pretty()

    @Tool
    @LLMDescription("Multiplies two numbers and returns the product as text.")
    fun multiply(
        @LLMDescription("First factor.") a: Double,
        @LLMDescription("Second factor.") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("Divides the first number by the second and returns the quotient as text. Returns an error message on division by zero.")
    fun divide(
        @LLMDescription("Dividend.") a: Double,
        @LLMDescription("Divisor (must not be zero).") b: Double
    ): String = if (abs(b) < 1e-12) {
        "ERROR: Division by zero"
    } else {
        (a / b).pretty()
    }
}
```

## 툴 레지스트리

우리의 툴을 노출합니다 (상호 작용/로깅을 위한 두 가지 내장 툴과 함께).

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // enables explicit user clarification when needed
    tool(SayToUser) // allows the agent to present the final message to the user
    tools(CalculatorTools())
}
```

## 전략: 다중 툴 호출 (선택적 압축 포함)

이 전략은 LLM이 **여러 툴 호출을 동시에** (예: `plus`, `minus`, `multiply`, `divide`) 제안하고 그 결과를 다시 보내도록 합니다.
토큰 사용량이 너무 많아지면, 계속하기 전에 툴 결과 기록을 **압축**합니다.

```kotlin
import ai.koog.agents.core.environment.ReceivedToolResult

object CalculatorStrategy {
    private const val MAX_TOKENS_THRESHOLD = 1000

    val strategy = strategy<String, String>("test") {
        val callLLM by nodeLLMRequestMultiple()
        val executeTools by nodeExecuteMultipleTools(parallelTools = true)
        val sendToolResults by nodeLLMSendMultipleToolResults()
        val compressHistory by nodeLLMCompressHistory<List<ReceivedToolResult>>()

        edge(nodeStart forwardTo callLLM)

        // 어시스턴트가 최종 답변을 생성했으면 종료합니다.
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // 그렇지 않으면, LLM이 요청한 툴을 실행합니다 (병렬로 여러 개일 수 있음).
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // 사용량이 많아지면, 계속하기 전에 이전 툴 결과를 압축합니다.
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 일반 경로: 툴 결과를 LLM으로 다시 보냅니다.
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM은 결과를 본 후 더 많은 툴을 요청할 수 있습니다.
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // 또는 최종 답변을 생성할 수 있습니다.
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 에이전트 구성

최소한의 툴 우선 프롬프트가 잘 작동합니다. 확정적 계산을 위해 온도를 낮게 유지합니다.

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("calculator") {
        system("You are a calculator. Always use the provided tools for arithmetic.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50
)
```

```kotlin
import ai.koog.agents.features.eventHandler.feature.handleEvents

val agent = AIAgent(
    promptExecutor = executor,
    strategy = CalculatorStrategy.strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
) {
    handleEvents {
        onToolCallStarting { e ->
            println("툴 호출 시작됨: ${e.tool.name}, args=${e.toolArgs}")
        }
        onAgentExecutionFailed { e ->
            println("에이전트 실행 실패: ${e.throwable.message}")
        }
        onAgentCompleted { e ->
            println("최종 결과: ${e.result}")
        }
    }
}
```

## 실행해보기

에이전트는 표현식을 병렬 툴 호출로 분해하고 깔끔하게 포맷된 결과를 반환해야 합니다.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// Expected final value ≈ -33.333...
```

    툴 호출 시작됨: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    툴 호출 시작됨: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    툴 호출 시작됨: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    툴 호출 시작됨: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    툴 호출 시작됨: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    툴 호출 시작됨: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    최종 결과: The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

    The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

## 병렬 호출 강제 실행해보기

모델에게 필요한 모든 툴을 한 번에 호출하도록 요청합니다.
여전히 올바른 계획과 안정적인 실행을 볼 수 있을 것입니다.

```kotlin
runBlocking {
    agent.run("Use tools to calculate (10 + 20) * (5 + 5) / (2 - 11). Please call all the tools at once.")
}
```

    툴 호출 시작됨: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    툴 호출 시작됨: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    툴 호출 시작됨: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    툴 호출 시작됨: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    툴 호출 시작됨: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    최종 결과: The result of \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-3.33\).

    The result of \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-3.33\).

## Ollama와 함께 실행하기

로컬 추론을 선호하는 경우 실행기와 모델을 교체하세요.

```kotlin
val ollamaExecutor: PromptExecutor = simpleOllamaAIExecutor()

val ollamaAgentConfig = AIAgentConfig(
    prompt = prompt("calculator", LLMParams(temperature = 0.0)) {
        system("You are a calculator. Always use the provided tools for arithmetic.")
    },
    model = OllamaModels.Meta.LLAMA_3_2,
    maxAgentIterations = 50
)

val ollamaAgent = AIAgent(
    promptExecutor = ollamaExecutor,
    strategy = CalculatorStrategy.strategy,
    agentConfig = ollamaAgentConfig,
    toolRegistry = toolRegistry
)

runBlocking {
    ollamaAgent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
```

    에이전트 응답: The result of the expression (10 + 20) * (5 + 5) / (2 - 11) is approximately -33.33.

    If you have any more questions or need further assistance, feel free to ask!