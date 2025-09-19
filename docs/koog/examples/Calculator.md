# 使用 Koog 构建工具调用计算器代理

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

在本迷你教程中，我们将构建一个由 **Koog** 工具调用驱动的计算器代理。
您将学习如何：
- 设计用于算术的轻量、纯粹的 **工具**
- 使用 Koog 的多调用策略协调**并行**工具调用
- 添加轻量级的**事件日志**以提高透明度
- 使用 OpenAI（以及可选的 Ollama）运行

我们将保持 API 整洁，使用惯用的 Kotlin 风格，返回可预测的结果，并优雅地处理边缘情况（例如除以零）。

## 设置

我们假设您处于一个已安装 Koog 的 Kotlin Notebook 环境中。
提供一个 LLM executor。

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 计算器工具

工具是带有清晰契约的轻量、纯粹的函数。
我们将使用 `Double` 以获得更好的精度，并始终如一地格式化输出。

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

## 工具注册表

公开我们的工具（加上两个用于交互/日志的内置工具）。

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // enables explicit user clarification when needed
    tool(SayToUser) // allows the agent to present the final message to the user
    tools(CalculatorTools())
}
```

## 策略：多个工具调用（带可选压缩）

此策略允许 LLM **一次性**提出**多个工具调用**（例如，`plus`、`minus`、`multiply`、`divide`），然后将结果发送回去。
如果令牌使用量过大，我们会在继续之前**压缩**工具结果的历史记录。

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

        // If the assistant produced a final answer, finish.
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // Otherwise, run the tools LLM requested (possibly several in parallel).
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // If we’re getting large, compress past tool results before continuing.
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // Normal path: send tool results back to the LLM.
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM might request more tools after seeing results.
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // Or it can produce the final answer.
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 代理配置

一个最简化的、以工具为中心的 prompt 效果很好。保持温度低以实现确定性数学计算。

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
        onToolCall { e ->
            println("Tool called: ${e.tool.name}, args=${e.toolArgs}")
        }
        onAgentRunError { e ->
            println("Agent error: ${e.throwable.message}")
        }
        onAgentFinished { e ->
            println("Final result: ${e.result}")
        }
    }
}
```

## 试用

代理应该将表达式分解为并行工具调用并返回格式整洁的结果。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// Expected final value ≈ -33.333...
```

    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    Tool called: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    Tool called: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Final result: The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

结果为表达式 \((10 + 20) * (5 + 5) / (2 - 11)\) 约等于 \(-33.33\)。

## 尝试强制并行调用

要求模型一次性调用所有必要的工具。
您仍然应该看到正确的计划和稳定的执行。

```kotlin
runBlocking {
    agent.run("Use tools to calculate (10 + 20) * (5 + 5) / (2 - 11). Please call all the tools at once.")
}
```

    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    Tool called: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    Tool called: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Final result: The result of \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-3.33\).

\((10 + 20) * (5 + 5) / (2 - 11)\) 的结果约等于 \(-3.33\)。

## 使用 Ollama 运行

如果您更喜欢本地推断，可以交换 executor 和 model。

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

    Agent says: The result of the expression (10 + 20) * (5 + 5) / (2 - 11) is approximately -33.33.

如果您还有其他问题或需要进一步帮助，请随时提问！