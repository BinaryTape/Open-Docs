# 使用 Koog 构建猜数智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

让我们构建一个虽小但有趣的智能体，来猜测你心中所想的数字。我们将依靠 Koog 的工具调用功能，提出有针对性的问题，并使用经典的二分查找策略来收敛结果。最终产出一个符合 Kotlin 习惯的 Notebook，你可以直接将其嵌入到文档中。

我们将使代码保持最少，流程保持透明：一些小工具、一个简洁的提示词，以及一个交互式的命令行界面循环。

## 设置

本 Notebook 假设：
- 你正在运行一个已安装 Koog 的 Kotlin Notebook。
- 环境变量 `OPENAI_API_KEY` 已设置。智能体通过 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` 使用它。

加载 Koog 内核：

```kotlin
%useLatestDescriptors
%use koog
```

## 工具：提出有针对性的问题

工具是大型语言模型 (LLM) 可以调用的小型、描述清晰的函数。我们将提供三个工具：
- `lessThan(value)`：“你的数字是否小于 value？”
- `greaterThan(value)`：“你的数字是否大于 value？”
- `proposeNumber(value)`：“你的数字是否等于 value？”（当区间收紧后使用）

每个工具都返回一个简单的 "YES"/"NO" 字符串。辅助函数 `ask` 实现了一个最小化的 Y/n 循环并验证输入。通过 `@LLMDescription` 提供的描述有助于模型正确选择工具。

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

## 工具注册表

将你的工具暴露给智能体。我们还添加了一个内置的 `SayToUser` 工具，以便智能体可以直接向用户呈现消息。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## 智能体配置

一个简短、以工具为中心的系统提示词就足够了。我们将建议一个二分查找策略，并保持 `temperature = 0.0` 以实现稳定、确定性的行为。这里我们使用 OpenAI 的推理模型 `GPT4oMini` 进行清晰的规划。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = """
            你是一个猜数智能体。你的目标是猜测用户心中所想的数字。
            
            请遵循以下步骤：
            1. 首先请用户想一个介于 1 到 100 之间的数字。
            2. 使用 less_than 和 greater_than 工具来缩小区间。
                a. 如果既不大也不小，则使用 propose_number 工具。
            3. 一旦你对数字确信无疑，使用 propose_number 工具来检测你的猜测是否正确。
            4. 如果你的猜测正确，祝贺用户。如果不对，则继续猜测。
            
            请使用高效的猜数策略。二分查找方法效果很好。
        """.trimIndent(),
    temperature = 0.0,
    toolRegistry = toolRegistry
)
```

## 运行

- 想一个介于 1 到 100 之间的数字。
- 输入 `start` 开始。
- 使用 `Y`/`Enter` 回答智能体的问题表示“是”，`n` 表示“否”。智能体应该在大约 7 步内锁定你的数字。

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

## 工作原理

- 智能体读取系统提示词并规划二分查找。
- 在每次迭代中，它会调用你的其中一个工具：`lessThan`、`greaterThan` 或（当确定时）`proposeNumber`。
- 辅助函数 `ask` 收集你的 Y/n 输入并向模型返回一个清晰的 "YES"/"NO" 信号。
- 当它得到确认时，通过 `SayToUser` 祝贺你。

## 扩展

- 通过调整系统提示词来改变区间（例如，1..1000）。
- 添加一个 `between(low, high)` 工具以进一步减少调用。
- 切换模型或执行器（例如，使用 Ollama 执行器和本地模型），同时保持相同的工具。
- 将猜测或结果持久化到存储中以进行分析。

## 故障排除

- 缺少密钥：确保你的环境变量中设置了 `OPENAI_API_KEY`。
- 未找到内核：确保 `%useLatestDescriptors` 和 `%use koog` 已成功执行。
- 未调用工具：确认 `ToolRegistry` 包含了 `GuesserTool()` 并且提示词中的名称与你的工具函数匹配。