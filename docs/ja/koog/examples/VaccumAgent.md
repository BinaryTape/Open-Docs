# シンプルな掃除機エージェントの構築

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

このノートブックでは、新しい Kotlin agents フレームワークを使用して、基本的な反応型エージェント（reflex agent）を実装する方法について説明します。
例として、古典的な「掃除機の世界（vacuum world）」問題を取り上げます。
これは、きれいか汚れているかのどちらかの状態を持つ2つの場所と、それらを掃除する必要があるエージェントで構成されるシンプルな環境です。

まず、環境モデルについて理解しましょう。

```kotlin
import kotlin.random.Random

/**
 * 2つの場所（AとB）を持つシンプルな掃除機の世界を表します。
 *
 * 環境は以下の状態を追跡します：
 * - 掃除機エージェントの現在位置（'A' または 'B'）
 * - 各場所の清掃状態（true = 汚れている、false = きれい）
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

`VacuumEnv` クラスはシンプルな世界をモデル化しています：
- 2つの場所は文字 'A' と 'B' で表されます。
- 各場所は、きれいか汚れているかのいずれかの状態になります（ランダムに初期化されます）。
- エージェントは、任意の時点でどちらかの場所に存在できます。
- エージェントは現在の場所と、そこが汚れているかどうかを知覚（perceive）できます。
- エージェントは、特定の場所への移動や、現在の場所の掃除といったアクションを実行できます。

## 掃除機エージェント用ツールの作成
次に、AIエージェントが環境と対話するために使用するツールを定義します。

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * LLMエージェントが掃除機ロボットを制御するためのツールを提供します。
 * すべてのメソッドは、コンストラクタに渡された VacuumEnv の状態を変更または読み取ります。
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

`VacuumTools` クラスは、LLMエージェントと環境の間のインターフェースを作成します：

- Kotlin AI Agents フレームワークの `ToolSet` を実装しています。
- 各ツールは `@Tool` でアノテーションされ、LLM用の説明（description）が付与されています。
- これらのツールにより、エージェントは環境を感知し、アクションを実行できるようになります。
- 各メソッドは、アクションの結果を説明する文字列を返します。

## エージェントのセットアップ
次に、AIエージェントの設定と作成を行います。

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

このセットアップでは以下のことを行っています：

1. 環境のインスタンスを作成します。
2. OpenAIのGPT-4oモデルへの接続をセットアップします。
3. エージェントが使用できるツールを登録します。
4. エージェントの目標と行動ルールを規定するシステムプロンプトを定義します。
5. チャット戦略（chat strategy）を用いた `AIAgent` コンストラクタを使用してエージェントを作成します。

## エージェントの実行

最後に、エージェントを実行してみましょう。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    エージェント：現在はセルAにいます。すでにきれいです。
    エージェント：セルBに移動しました。すでにきれいです。

このコードを実行すると：

1. エージェントは掃除を開始するための初期プロンプトを受け取ります。
2. ツールを使用して環境を感知し、意思決定を行います。
3. 両方のセルがきれいになるまで掃除を続けます。
4. プロセスの間、エージェントは何を行っているかをユーザーに伝え続けます。

```kotlin
// 最後に、環境の状態を出力して作業が完了したことを確認できます。

env
```

    location=B, dirtyA=false, dirtyB=false