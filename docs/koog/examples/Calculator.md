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
提供一个 LLM executor

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

// 格式化助手：整数显示整洁，小数保留合理的精度。
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("用于基本计算器操作的工具")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("添加两个数字并以文本形式返回它们的和。")
    fun plus(
        @LLMDescription("第一个加数。") a: Double,
        @LLMDescription("第二个加数。") b: Double
    ): String = (a + b).pretty()

    @Tool
    @LLMDescription("从第一个数字中减去第二个数字，并以文本形式返回差。")
    fun minus(
        @LLMDescription("被减数。") a: Double,
        @LLMDescription("减数。") b: Double
    ): String = (a - b).pretty()

    @Tool
    @LLMDescription("将两个数字相乘，并以文本形式返回它们的积。")
    fun multiply(
        @LLMDescription("第一个乘数。") a: Double,
        @LLMDescription("第二个乘数。") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("将第一个数字除以第二个数字，并以文本形式返回商。除数为零时返回错误消息。")
    fun divide(
        @LLMDescription("被除数。") a: Double,
        @LLMDescription("除数（不能为零）。") b: Double
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
    tool(AskUser)   // 在需要时启用显式用户澄清
    tool(SayToUser) // 允许代理向用户呈现最终消息
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

        // 如果助手生成了最终答案，则结束。
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // 否则，运行 LLM 请求的工具（可能并行执行）。
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // 如果数据量变大，则在继续之前压缩过去的工具结果。
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 正常路径：将工具结果发送回 LLM。
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM 在查看结果后可能会请求更多工具。
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // 或者它可以生成最终答案。
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 代理配置

一个最简化的、以工具为中心的 prompt 效果很好。保持温度低以实现确定性数学计算。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("calculator") {
        system("你是一个计算器。始终使用提供的工具进行算术运算。")
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
            println("工具调用: ${e.tool.name}, args=${e.toolArgs}")
        }
        onAgentExecutionFailed { e ->
            println("代理错误: ${e.throwable.message}")
        }
        onAgentCompleted { e ->
            println("最终结果: ${e.result}")
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
// 期望的最终值 ≈ -33.333...
```

    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    Tool called: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    Tool called: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Final result: The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

表达式 \((10 + 20) * (5 + 5) / (2 - 11)\) 的结果约等于 \(-33.33\)。

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
        system("你是一个计算器。始终使用提供的工具进行算术运算。")
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

代理说：表达式 (10 + 20) * (5 + 5) / (2 - 11) 的结果约等于 -33.33。

如果您还有其他问题或需要进一步帮助，请随时提问！