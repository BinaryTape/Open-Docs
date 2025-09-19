# 建立一個簡單的掃地機器人代理程式

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

在本筆記本中，我們將探索如何使用新的 Kotlin 代理程式框架來實作一個基本的反應式代理程式。
我們的範例將是經典的「掃地機器人世界」問題 —
一個具有兩個位置的簡單環境，這些位置可以是乾淨或髒污的，以及一個需要清潔它們的代理程式。

首先，讓我們了解我們的環境模型：

```kotlin
import kotlin.random.Random

/**
 * 代表一個具有兩個位置（A 和 B）的簡單掃地機器人世界。
 *
 * 環境會追蹤：
 * - 掃地機器人代理程式的目前位置（'A' 或 'B'）
 * - 每個位置的乾淨狀態（true = 髒污, false = 乾淨）
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

`VacuumEnv` 類別為我們的簡單世界建模：
- 兩個位置由字元 'A' 和 'B' 代表
- 每個位置可以是乾淨或髒污的（隨機初始化）
- 代理程式在任何給定時間都可以位於任一位置
- 代理程式可以感知其目前位置以及該位置是否髒污
- 代理程式可以採取行動：移動到特定位置或清潔目前位置

## 為掃地機器人代理程式建立工具
現在，讓我們定義我們的 AI 代理程式將用來與環境互動的工具：

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * 為 LLM 代理程式提供控制掃地機器人的工具。
 * 所有方法都會改變或讀取傳遞給建構函式的 VacuumEnv。
 */
@LLMDescription("控制兩格掃地機器人世界的工具")
class VacuumTools(private val env: VacuumEnv) : ToolSet {

    @Tool
    @LLMDescription("返回目前位置以及是否髒污")
    fun sense(): String {
        val (loc, dirty) = env.percept()
        return "location=$loc, dirty=$dirty, locations=${env.worldLayout()}"
    }

    @Tool
    @LLMDescription("清潔目前單元格")
    fun clean(): String = env.clean()

    @Tool
    @LLMDescription("將代理程式移動到單元格 A")
    fun moveLeft(): String = env.moveLeft()

    @Tool
    @LLMDescription("將代理程式移動到單元格 B")
    fun moveRight(): String = env.moveRight()
}
```

`VacuumTools` 類別在我們的 LLM 代理程式與環境之間建立了一個介面：

- 它實作了 Kotlin AI 代理程式框架中的 `ToolSet`
- 每個工具都使用 `@Tool` 註解，並帶有供 LLM 使用的描述
- 這些工具允許代理程式感知其環境並採取行動
- 每個方法都返回一個描述行動結果的字串

## 設定代理程式
接下來，我們將配置並建立我們的 AI 代理程式：

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
val apiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY 環境變數未設定")
val executor = simpleOpenAIExecutor(apiToken = apiToken)

val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tool(AskUser)
    tools(VacuumTools(env).asTools())
}

val systemVacuumPrompt = """
    你是一個生活在標記為 A 和 B 的兩格世界中的反應式掃地機器人代理程式。
    你的目標：使用提供的工具，使兩格都乾淨。
    首先，呼叫 sense() 來檢查你的位置。然後決定：如果髒污 → clean(); 否則 moveLeft()/moveRight()。
    繼續直到兩格都乾淨為止，然後告訴使用者「完成」。
    使用 sayToUser 告知使用者每個步驟。
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

1. 我們建立一個環境實例
2. 我們建立與 OpenAI GPT-4o 模型的連線
3. 我們註冊代理程式可以使用的工具
4. 我們定義了一個系統提示，其中包含代理程式的目標和行為規則
5. 我們使用 `AIAgent` 建構函式並帶有聊天策略來建立代理程式

## 執行代理程式

最後，讓我們執行我們的代理程式：

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("請開始清潔")
}
```

    代理程式說：目前在單元格 A。它已經乾淨了。
    代理程式說：移動到單元格 B。它已經乾淨了。

當我們執行這段程式碼時：

1. 代理程式接收到開始清潔的初始提示
2. 它使用其工具感知環境並做出決策
3. 它繼續清潔直到兩格都乾淨為止
4. 在整個過程中，它會讓使用者知悉其所做之事

```kotlin
// 最後，我們可以透過列印環境狀態來驗證工作是否完成

env
```

    location=B, dirtyA=false, dirtyB=false