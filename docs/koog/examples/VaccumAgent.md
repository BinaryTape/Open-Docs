# 构建一个简单的吸尘器智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

在本笔记本中，我们将探索如何使用新的 Kotlin 智能体框架实现一个基础的反应式智能体 (reflex agent)。
我们的示例将采用经典的“吸尘器世界”问题 ——
这是一个包含两个位置的简单环境，位置状态可以是干净或脏，而智能体需要清理它们。

首先，让我们了解我们的环境模型：

```kotlin
import kotlin.random.Random

/**
 * 表示一个包含两个位置（A 和 B）的简单吸尘器世界。
 *
 * 环境跟踪：
 * - 吸尘器智能体的当前位置（'A' 或 'B'）
 * - 每个位置的清洁状态（true = 脏，false = 干净）
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

`VacuumEnv` 类对我们的简单世界进行了建模：
- 两个位置由字符 'A' 和 'B' 表示
- 每个位置可以是干净的或脏的（随机初始化）
- 智能体在任何给定时间都可以位于任一位置
- 智能体可以感知其当前位置以及该位置是否脏
- 智能体可以执行操作：移动到特定位置或清理当前位置

## 为吸尘器智能体创建工具
现在，让我们定义 AI 智能体将用于与环境交互的工具：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * 为 LLM 智能体提供控制吸尘器机器人的工具。
 * 所有方法都会修改或读取传递给构造函数的 VacuumEnv。
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
- 每个工具都使用 `@Tool` 进行了注解，并为 LLM 提供了描述
- 工具允许智能体感知其环境并执行操作
- 每个方法都返回一个描述操作结果的字符串

## 设置智能体
接下来，我们将配置并创建 AI 智能体：

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
    You are a reflex vacuum-cleaner agent living in a two-cell world labelled A and B.
    Your goal: make both cells clean, using the provided tools.
    First, call sense() to inspect where you are. Then decide: if dirty → clean(); else moveLeft()/moveRight().
    Continue until both cells are clean, then tell the user "done".
    Use sayToUser to inform the user about each step.
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

1. 我们创建环境的一个实例
2. 我们建立与 OpenAI GPT-4o 模型的连接
3. 我们注册智能体可以使用的工具
4. 我们定义一个系统提示词，赋予智能体目标和行为规则
5. 我们使用带有聊天策略的 `AIAgent` 构造函数创建智能体

## 运行智能体

最后，让我们运行智能体：

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    Agent says: Currently in cell A. It's already clean.
    Agent says: Moved to cell B. It's already clean.

当我们运行这段代码时：

1. 智能体接收到开始清理的初始提示词
2. 它使用工具来感知环境并做出决策
3. 它持续清理，直到两个格子都变干净
4. 在整个过程中，它会不断向用户通报它正在执行的操作

```kotlin
// 最后，我们可以通过打印环境状态来验证工作是否完成

env
```

    location=B, dirtyA=false, dirtyB=false