# 建立一個簡單的吸塵器代理

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

在此筆記本中，我們將探索如何使用新的 Kotlin agents 架構實作一個基本的反射式代理 (reflex agent)。
我們的範例將是經典的「吸塵器世界 (vacuum world)」問題 ——
一個包含兩個位置（可能為乾淨或髒污）的簡單環境，以及一個需要清理它們的代理。

首先，讓我們了解我們的環境模型：

```kotlin
import kotlin.random.Random

/**
 * 代表一個具有兩個位置（A 和 B）的簡單吸塵器世界。
 *
 * 此環境追蹤：
 * - 吸塵器代理的當前位置（'A' 或 'B'）
 * - 每個位置的清潔狀態（true = 髒污，false = 乾淨）
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

`VacuumEnv` 類別模擬了我們的簡單世界：
- 兩個位置由字元 'A' 和 'B' 表示
- 每個位置可以是乾淨或髒污（隨機初始化）
- 代理在任何給定時間都可以在任一位置
- 代理可以感知其當前位置以及是否髒污
- 代理可以採取操作：移動到特定位置或清理當前位置

## 為吸塵器代理建立工具
現在，讓我們定義我們的 AI 代理將用於與環境互動的工具：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * 為 LLM 代理提供控制吸塵器機器人的工具。
 * 所有方法都會修改或讀取傳遞給建構函式的 VacuumEnv。
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

`VacuumTools` 類別在我們的 LLM 代理與環境之間建立了一個介面：

- 它實作了 Kotlin AI Agents 架構中的 `ToolSet`
- 每個工具都加上了 `@Tool` 註解，並帶有給 LLM 的描述
- 這些工具允許代理感知其環境並採取行動
- 每個方法都會傳回一個描述操作結果的字串

## 設定代理
接下來，我們將設定並建立我們的 AI 代理：

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

在此設定中：

1. 我們建立環境的執行個體
2. 我們建立與 OpenAI GPT-4o 模型的連線
3. 我們註冊代理可以使用的工具
4. 我們定義一個系統提示 (system prompt)，賦予代理其目標和行為規則
5. 我們使用帶有對話策略 (chat strategy) 的 `AIAgent` 建構函式來建立代理

## 執行代理

最後，讓我們執行我們的代理：

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    Agent says: Currently in cell A. It's already clean.
    Agent says: Moved to cell B. It's already clean.

當我們執行此程式碼時：

1. 代理收到開始清理的初始提示
2. 它使用其工具來感知環境並做出決定
3. 它會持續清理直到兩個格子都乾淨為止
4. 在整個過程中，它會讓使用者了解它正在做什麼

```kotlin
// 最後我們可以透過列印環境狀態來驗證工作是否已完成

env
```

    location=B, dirtyA=false, dirtyB=false