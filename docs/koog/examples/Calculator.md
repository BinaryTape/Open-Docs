# 使用 Koog 构建支持工具调用的计算器智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

在本简短教程中，我们将构建一个由 **Koog** 工具调用驱动的计算器智能体。
你将学习如何：
- 为算术运算设计小巧、纯净的**工具 (tools)**
- 使用 Koog 的多重调用策略编排**并行**工具调用
- 添加轻量级**事件日志记录**以提高透明度
- 使用 OpenAI（以及可选的 Ollama）运行

我们将保持 API 整洁且符合 Kotlin 惯例，返回可预测的结果并优雅地处理边缘情况（如除以零）。

## 设置

我们假设你处于已安装 Koog 的 Kotlin Notebook 环境中。
提供一个 LLM 执行器。

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("请设置 OPENAI_API_KEY 环境变量")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 计算器工具

工具是具有清晰契约的小巧、纯净的函数。
我们将使用 `Double` 以获得更好的精度，并保持输出格式的一致性。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// 格式化辅助程序：整数清晰呈现，小数保持合理的精度。
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("用于基础计算器操作的工具")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("将两个数字相加并以文本形式返回和。")
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
    @LLMDescription("将两个数字相乘并以文本形式返回积。")
    fun multiply(
        @LLMDescription("第一个因数。") a: Double,
        @LLMDescription("第二个因数。") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("将第一个数字除以第二个数字，并以文本形式返回商。除以零时返回错误消息。")
    fun divide(
        @LLMDescription("被除数。") a: Double,
        @LLMDescription("除数（不能为零）。") b: Double
    ): String = if (abs(b) < 1e-12) {
        "错误：除以零"
    } else {
        (a / b).pretty()
    }
}
```

## 工具注册表

公开我们的工具（以及两个用于交互/日志记录的内置工具）。

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // 在需要时启用明确的用户澄清
    tool(SayToUser) // 允许智能体向用户呈现最终消息
    tools(CalculatorTools())
}
```

## 策略：多工具调用（可选压缩）

此策略允许 LLM **同时提出多个工具调用**（例如 `plus`、`minus`、`multiply`、`divide`），然后将结果发回。
如果 token 使用量增长过大，我们会在继续之前**压缩**工具结果的历史记录。

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

        // 否则，运行 LLM 请求的工具（可能并行运行多个）。
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // 如果变得很大，在继续之前压缩过去的工具结果。
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 正常路径：将工具结果发回给 LLM。
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM 在看到结果后可能会请求更多工具。
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // 或者它可以生成最终答案。
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 智能体配置

以工具为导向的简洁提示词效果很好。保持较低的 temperature 以获得确定性的数学运算结果。

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
            println("工具已调用：${e.tool.name}, 参数=${e.toolArgs}")
        }
        onAgentExecutionFailed { e ->
            println("智能体错误：${e.throwable.message}")
        }
        onAgentCompleted { e ->
            println("最终结果：${e.result}")
        }
    }
}
```

## 试一试

智能体应该将表达式分解为并行的工具调用，并返回格式整齐的结果。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// 预期最终值 ≈ -33.333...
```

    工具已调用：plus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    工具已调用：plus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    工具已调用：minus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    工具已调用：multiply, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    工具已调用：divide, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    工具已调用：divide, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    最终结果：表达式 \((10 + 20) * (5 + 5) / (2 - 11)\) 的结果大约是 \(-33.33\)。

    表达式 \((10 + 20) * (5 + 5) / (2 - 11)\) 的结果大约是 \(-33.33\)。

## 尝试强制并行调用

要求模型一次性调用所有需要的工具。
你仍然应该看到正确的方案和稳定的执行。

```kotlin
runBlocking {
    agent.run("使用工具计算 (10 + 20) * (5 + 5) / (2 - 11)。请一次性调用所有工具。")
}
```

    工具已调用：plus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    工具已调用：plus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    工具已调用：minus, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    工具已调用：multiply, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    工具已调用：divide, 参数=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    最终结果：\((10 + 20) * (5 + 5) / (2 - 11)\) 的结果大约是 \(-3.33\)。

    \((10 + 20) * (5 + 5) / (2 - 11)\) 的结果大约是 \(-3.33\)。

## 使用 Ollama 运行

如果你更喜欢本地推理，请更换执行器和模型。

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

    智能体说：表达式 (10 + 20) * (5 + 5) / (2 - 11) 的结果大约是 -33.33。

    如果您还有任何问题或需要进一步的帮助，请随时提问！