# 构建一个简单的吸尘器智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

[//]: # (title: 构建一个简单的吸尘器智能体)

在本 Notebook 中，我们将探索如何使用新的 Kotlin 智能体框架实现一个基本的反射式智能体。我们的示例将是经典的“吸尘器世界”问题——一个包含两个位置的简单环境，这两个位置可以是干净的或脏污的，并且有一个智能体需要清洁它们。

首先，让我们了解我们的环境模型：

```kotlin
import kotlin.random.Random

/**
 * 代表一个包含两个位置（A 和 B）的简单吸尘器世界。
 *
 * 环境跟踪以下信息：
 * - 吸尘器智能体的当前位置（'A' 或 'B'）
 * - 每个位置的清洁状态（true = 脏污，false = 干净）
 */
class VacuumEnv {
    var location: Char = 'A'
        private set

    private val status = mutableMapOf(
        'A' to Random.nextBoolean(),
        'B' to Random.nextBoolean()
    )

    fun percept(): Pair<Char, Boolean> = location to status.getValue(location)

    fun clean(): String {
        status[location] = false
        return "cleaned"
    }

    fun moveLeft(): String {
        location = 'A'
        return "move to A"
    }

    fun moveRight(): String {
        location = 'B'
        return "move to B"
    }

    fun isClean(): Boolean = status.values.all { it }

    fun worldLayout(): String = "${status.keys}"

    override fun toString(): String = "location=$location, dirtyA=${status['A']}, dirtyB=${status['B']}"
}
```

`VacuumEnv` 类为我们的简单世界建模：
- 两个位置由字符 'A' 和 'B' 表示
- 每个位置可以是干净的或脏污的（随机初始化）
- 智能体可以在任何给定时间位于任一位置
- 智能体可以感知其当前位置以及它是否脏污
- 智能体可以采取行动：移动到特定位置或清洁当前位置

## 为吸尘器智能体创建工具

现在，让我们定义我们的 AI 智能体将用于与环境交互的工具：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * 提供工具供 LLM 智能体控制吸尘机器人。
 * 所有方法要么修改，要么读取传递给构造函数的 VacuumEnv。
 */
@LLMDescription("Tools for controlling a two-cell vacuum world")
class VacuumTools(private val env: VacuumEnv) : ToolSet {

    @Tool
    @LLMDescription("Returns current location and whether it is dirty")
    fun sense(): String {
        val (loc, dirty) = env.percept()
        return "location=$loc, dirty=$dirty, locations=${env.worldLayout()}"
    }

    @Tool
    @LLMDescription("Cleans the current cell")
    fun clean(): String = env.clean()

    @Tool
    @LLMDescription("Moves the agent to cell A")
    fun moveLeft(): String = env.moveLeft()

    @Tool
    @LLMDescription("Moves the agent to cell B")
    fun moveRight(): String = env.moveRight()
}
```

`VacuumTools` 类在我们的 LLM 智能体和环境之间创建了一个接口：

- 它实现了 Kotlin AI 智能体框架中的 `ToolSet`
- 每个工具都使用 `@Tool` 注解，并附有供 LLM 使用的描述
- 这些工具使智能体能够感知其环境并采取行动
- 每个方法都返回一个描述行动结果的字符串

## 设置智能体

接下来，我们将配置并创建我们的 AI 智能体：

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.agents.ext.agent.chatAgentStrategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.params.LLMParams

val env = VacuumEnv()
val apiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(apiToken = apiToken)

val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tools(VacuumTools(env).asTools())
}

val systemVacuumPrompt = """
    你是一个反射式吸尘器智能体，生活在一个名为 A 和 B 的双单元格世界中。
    你的目标：使用提供的工具，清洁这两个单元格。
    首先，调用 sense() 探查你所在的位置。然后决定：如果脏污 → 调用 clean()；否则调用 moveLeft()/moveRight()。
    继续，直到两个单元格都干净为止，然后告诉用户“done”。
    使用 sayToUser 告知用户每个步骤。
""".trimIndent()

val agentConfig = AIAgentConfig(
    prompt = prompt("chat", params = LLMParams(temperature = 1.0)) {
        system(systemVacuumPrompt)
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50,
)

val agent = AIAgent(
    promptExecutor = executor,
    strategy = chatAgentStrategy(),
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)
```

在此设置中：

1. 我们创建了一个环境实例
2. 我们建立了与 OpenAI GPT-4o 模型的连接
3. 我们注册了智能体可以使用的工具
4. 我们定义了一个系统提示，赋予智能体其目标和行为规则
5. 我们使用 `AIAgent` 构造函数和聊天策略创建了智能体

## 运行智能体

最后，让我们运行我们的智能体：

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    智能体说：当前位于单元格 A。它已经干净了。
    智能体说：已移动到单元格 B。它已经干净了。

当我们运行这段代码时：

1. 智能体接收到初始提示以开始清洁
2. 它使用工具感知环境并做出决策
3. 它继续清洁，直到两个单元格都干净
4. 在整个过程中，它告知用户它正在做什么

```kotlin
// 最后，我们可以通过打印环境状态来验证工作是否完成

env
```

    location=B, dirtyA=false, dirtyB=false