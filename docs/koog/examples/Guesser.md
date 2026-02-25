# 使用 Koog 构建猜数字智能体

[:material-github: 在 GitHub 上打开](https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb){ .md-button }

让我们构建一个虽然小巧但有趣的智能体，它能猜出你心中所想的数字。我们将利用 Koog 的工具调用 (tool-calling) 功能来提出针对性问题，并使用经典的二分查找策略进行收敛。其结果是一个符合惯例的 Kotlin Notebook，你可以直接将其放入文档中。

我们将保持代码简洁，流程透明：几个微型工具、一段精炼的提示词以及一个交互式命令行循环。

## 设置

此 Notebook 假设：
- 你正在运行已启用 Koog 的 Kotlin Notebook。
- 环境变量 `OPENAI_API_KEY` 已设置。智能体通过 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` 使用该密钥。

加载 Koog 内核：

```kotlin
%useLatestDescriptors
%use koog
```

## 工具：提出针对性问题

工具是 LLM 可以调用的、描述良好的微型函数。我们将提供三个：
- `lessThan(value)`：“你的数字是否小于该值？”
- `greaterThan(value)`：“你的数字是否大于该值？”
- `proposeNumber(value)`：“你的数字是否等于该值？”（在范围缩小后使用）

每个工具都会返回一个简单的 "YES"/"NO" 字符串。辅助函数 `ask` 实现了一个极简的 Y/n 循环并验证输入。通过 `@LLMDescription` 提供的描述可帮助模型正确选择工具。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

class GuesserTool : ToolSet {

    @Tool
    @LLMDescription("询问用户其数字是否严格小于给定值。")
    fun lessThan(
        @LLMDescription("用于与所猜数字进行比较的值。") value: Int
    ): String = ask("你的数字是否小于 $value?", value)

    @Tool
    @LLMDescription("询问用户其数字是否严格大于给定值。")
    fun greaterThan(
        @LLMDescription("用于与所猜数字进行比较的值。") value: Int
    ): String = ask("你的数字是否大于 $value?", value)

    @Tool
    @LLMDescription("询问用户其数字是否完全等于给定数字。仅在缩小答案范围后使用此工具。")
    fun proposeNumber(
        @LLMDescription("用于与所猜数字进行比较的值。") value: Int
    ): String = ask("你的数字是否等于 $value?", value)

    fun ask(question: String, value: Int): String {
        print("$question [Y/n]: ")
        val input = readln()
        println(input)

        return when (input.lowercase()) {
            "", "y", "yes" -> "YES"
            "n", "no" -> "NO"
            else -> {
                println("输入无效！请重试。")
                ask(question, value)
            }
        }
    }
}
```

## 工具注册表

向智能体公开你的工具。我们还添加了一个内置的 `SayToUser` 工具，以便智能体能直接向用户显示消息。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## 智能体配置

我们只需要一段简短的、以工具为导向的系统提示词。我们将建议使用二分查找策略，并将 `temperature = 0.0` 以获得稳定、确定的行为。在这里，我们使用 OpenAI 的推理模型 `GPT4oMini` 进行清晰的规划。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = """
            你是一个猜数字智能体。你的目标是猜出用户心中所想的数字。
            
            请遵循以下步骤：
            1. 首先请用户思考一个 1 到 100 之间的数字。
            2. 使用 less_than 和 greater_than 工具来缩小范围。
                a. 如果既不大于也不小于，请使用 propose_number 工具。
            3. 一旦确定了数字，请使用 propose_number 工具检查你的猜测是否正确。
            4. 如果猜测正确，祝贺用户。如果没有，请继续猜测。
            
            你的猜测策略要高效。二分查找法非常有效。
        """.trimIndent(),
    temperature = 0.0,
    toolRegistry = toolRegistry
)
```

## 运行

- 思考一个 1 到 100 之间的数字。
- 输入 `start` 开始游戏。
- 使用 `Y`/`Enter` 表示“是”，`n` 表示“否”来回答智能体的问题。智能体应该在大约 7 步内锁定你的数字。

```kotlin
import kotlinx.coroutines.runBlocking

println("猜数字游戏开始！")
println("请思考一个 1 到 100 之间的数字，我会尝试猜出它。")
println("输入 'start' 开始游戏。")

val initialMessage = readln()
runBlocking {
    agent.run(initialMessage)
}
```

## 工作原理

- 智能体读取系统提示词并规划二分查找。
- 在每次迭代中，它会调用你的一个工具：`lessThan`、`greaterThan` 或（确定时）`proposeNumber`。
- 辅助函数 `ask` 收集你的 Y/n 输入，并向模型返回干净的 "YES"/"NO" 信号。
- 当获得确认后，它会通过 `SayToUser` 向你表示祝贺。

## 扩展

- 通过调整系统提示词来更改范围（例如 1..1000）。
- 添加 `between(low, high)` 工具以进一步减少调用次数。
- 更换模型或执行器（例如使用 Ollama 执行器和本地模型），同时保留相同的工具。
- 将猜测结果或产出持久化到存储中以供分析。

## 故障排除

- 缺少密钥：确保你的环境中设置了 `OPENAI_API_KEY`。
- 找不到内核：确保 `%useLatestDescriptors` 和 `%use koog` 执行成功。
- 工具未被调用：确认 `ToolRegistry` 包含了 `GuesserTool()`，并且提示词中的名称与你的工具函数相匹配。