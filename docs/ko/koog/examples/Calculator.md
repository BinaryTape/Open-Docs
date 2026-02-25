# Koog로 도구 호출 계산기 에이전트 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

이 미니 튜토리얼에서는 **Koog** 도구 호출(tool-calling) 기능을 활용한 계산기 에이전트를 구축해 보겠습니다.
다음을 배우게 됩니다:
- 산술 연산을 위한 작고 순수한 **도구(tools)** 설계 방법
- Koog의 다중 호출(multiple-call) 전략을 사용하여 **병렬** 도구 호출 조율 방법
- 투명성을 위한 가벼운 **이벤트 로깅** 추가 방법
- OpenAI(및 선택적으로 Ollama)로 실행하는 방법

API를 깔끔하고 관용적인(idiomatic) Kotlin으로 유지하면서, 예측 가능한 결과를 반환하고 0으로 나누기와 같은 예외 케이스를 매끄럽게 처리할 것입니다.

## 설정 (Setup)

Koog를 사용할 수 있는 Kotlin Notebook 환경을 가정합니다.
LLM 실행기(executor)를 제공합니다.

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 계산기 도구 (Calculator Tools)

도구는 명확한 계약(contract)을 가진 작고 순수한 함수입니다.
더 나은 정밀도를 위해 `Double`을 사용하고 출력 형식을 일관되게 포맷팅합니다.

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// 포맷 헬퍼: 정수는 깔끔하게 표현하고, 소수는 적절한 정밀도를 유지합니다.
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("기본적인 계산기 연산을 위한 도구")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("두 수를 더하고 그 합을 텍스트로 반환합니다.")
    fun plus(
        @LLMDescription("첫 번째 더할 수.") a: Double,
        @LLMDescription("두 번째 더할 수.") b: Double
    ): String = (a + b).pretty()

    @Tool
    @LLMDescription("첫 번째 수에서 두 번째 수를 빼고 그 차를 텍스트로 반환합니다.")
    fun minus(
        @LLMDescription("피감수(빼임을 당하는 수).") a: Double,
        @LLMDescription("감수(빼는 수).") b: Double
    ): String = (a - b).pretty()

    @Tool
    @LLMDescription("두 수를 곱하고 그 곱을 텍스트로 반환합니다.")
    fun multiply(
        @LLMDescription("첫 번째 인수.") a: Double,
        @LLMDescription("두 번째 인수.") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("첫 번째 수를 두 번째 수로 나누고 그 몫을 텍스트로 반환합니다. 0으로 나눌 경우 에러 메시지를 반환합니다.")
    fun divide(
        @LLMDescription("피제수(나뉨수).") a: Double,
        @LLMDescription("제수(나누는 수, 0이 아니어야 함).") b: Double
    ): String = if (abs(b) < 1e-12) {
        "ERROR: Division by zero"
    } else {
        (a / b).pretty()
    }
}
```

## 도구 레지스트리 (Tool Registry)

사용할 도구들을 등록합니다 (상호작용 및 로깅을 위한 두 가지 내장 도구 포함).

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // 필요한 경우 사용자에게 명확한 확인을 요청할 수 있게 함
    tool(SayToUser) // 에이전트가 사용자에게 최종 메시지를 전달할 수 있게 함
    tools(CalculatorTools())
}
```

## 전략: 다중 도구 호출 (선택적 압축 포함)

이 전략을 사용하면 LLM이 **한 번에 여러 도구 호출**을 제안(예: `plus`, `minus`, `multiply`, `divide`)하고 그 결과를 다시 보낼 수 있습니다.
토큰 사용량이 너무 많아지면 다음 단계로 진행하기 전에 도구 결과의 이력을 **압축(compress)**합니다.

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

        // 어시스턴트가 최종 답변을 생성했다면 종료합니다.
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // 그렇지 않으면 LLM이 요청한 도구들을 실행합니다 (여러 개를 병렬로 실행할 수 있음).
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // 이력이 커지면 계속하기 전에 과거 도구 결과들을 압축합니다.
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 일반적인 경로: 도구 결과를 LLM에 다시 보냅니다.
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM은 결과를 보고 추가 도구를 요청할 수 있습니다.
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // 또는 최종 답변을 생성할 수 있습니다.
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 에이전트 설정 (Agent Configuration)

도구 중심의 최소한의 프롬프트가 효과적입니다. 결정론적인 수학 연산을 위해 온도를 낮게 유지합니다.

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("calculator") {
        system("당신은 계산기입니다. 산술 연산에는 항상 제공된 도구를 사용하세요.")
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
            println("도구 호출됨: ${e.tool.name}, 인자=${e.toolArgs}")
        }
        onAgentExecutionFailed { e ->
            println("에이전트 에러: ${e.throwable.message}")
        }
        onAgentCompleted { e ->
            println("최종 결과: ${e.result}")
        }
    }
}
```

## 시도해 보기

에이전트는 표현식을 병렬 도구 호출로 분해하고 깔끔하게 포맷팅된 결과를 반환해야 합니다.

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// 예상 최종 값 ≈ -33.333...
```

    도구 호출됨: plus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    도구 호출됨: plus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    도구 호출됨: minus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    도구 호출됨: multiply, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    도구 호출됨: divide, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    도구 호출됨: divide, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    최종 결과: 표현식 \((10 + 20) * (5 + 5) / (2 - 11)\)의 결과는 약 \(-33.33\)입니다.

    표현식 \((10 + 20) * (5 + 5) / (2 - 11)\)의 결과는 약 \(-33.33\)입니다.

## 병렬 호출 강제하기

모델에게 필요한 모든 도구를 한 번에 호출하도록 요청해 봅니다.
여전히 올바른 계획과 안정적인 실행을 확인할 수 있을 것입니다.

```kotlin
runBlocking {
    agent.run("도구를 사용하여 (10 + 20) * (5 + 5) / (2 - 11)을 계산하세요. 모든 도구를 한 번에 호출해 주세요.")
}
```

    도구 호출됨: plus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    도구 호출됨: plus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    도구 호출됨: minus, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    도구 호출됨: multiply, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    도구 호출됨: divide, 인자=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    최종 결과: \((10 + 20) * (5 + 5) / (2 - 11)\)의 결과는 약 \(-3.33\)입니다.

    \((10 + 20) * (5 + 5) / (2 - 11)\)의 결과는 약 \(-3.33\)입니다.

## Ollama로 실행하기

로컬 추론을 선호한다면 실행기와 모델을 변경할 수 있습니다.

```kotlin
val ollamaExecutor: PromptExecutor = simpleOllamaAIExecutor()

val ollamaAgentConfig = AIAgentConfig(
    prompt = prompt("calculator", LLMParams(temperature = 0.0)) {
        system("당신은 계산기입니다. 산술 연산에는 항상 제공된 도구를 사용하세요.")
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

    에이전트 답변: 표현식 (10 + 20) * (5 + 5) / (2 - 11)의 결과는 약 -33.33입니다.

    더 궁금한 점이 있거나 도움이 필요하시면 언제든지 물어보세요!