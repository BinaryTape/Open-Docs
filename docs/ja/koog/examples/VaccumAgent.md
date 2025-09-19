# シンプルな掃除機エージェントを構築する

[:material-github: GitHubで開く](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynbをダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/VaccumAgent.ipynb
){ .md-button }

このノートブックでは、新しいKotlinエージェントフレームワークを使用して、基本的な反射エージェントを実装する方法を探ります。
例として、古典的な「掃除機の世界」問題を取り上げます。これは、きれいな状態または汚れた状態になり得る2つの場所と、それらをきれいにする必要があるエージェントを持つシンプルな環境です。

まず、環境モデルを理解しましょう。

```kotlin
import kotlin.random.Random

/**
 * Represents a simple vacuum world with two locations (A and B).
 *
 * The environment tracks:
 * - The current location of the vacuum agent ('A' or 'B')
 * - The cleanliness status of each location (true = dirty, false = clean)
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

`VacuumEnv`クラスは、このシンプルな世界をモデル化します。
- 2つの場所は文字「A」と「B」で表されます
- 各場所はきれいな状態または汚れた状態のいずれかであり得ます（ランダムに初期化されます）
- エージェントは任意の時点でどちらかの場所にいることができます
- エージェントは現在の場所とその場所が汚れているかどうかを知覚できます
- エージェントは、特定の場所に移動するか、現在の場所をきれいにするか、といったアクションを実行できます

## 掃除機エージェント用のツールを作成する
次に、AIエージェントが環境と対話するために使用するツールを定義しましょう。

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

/**
 * Provides tools for the LLM agent to control the vacuum robot.
 * All methods either mutate or read from the VacuumEnv passed to the constructor.
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

`VacuumTools`クラスは、LLMエージェントと環境の間にインターフェースを作成します。

- Kotlin AI Agentsフレームワークの`ToolSet`を実装します
- 各ツールは`@Tool`でアノテーションされ、LLM用の説明を持っています
- ツールを使用すると、エージェントは環境を感知し、アクションを実行できます
- 各メソッドは、アクションの結果を説明する文字列を返します

## エージェントのセットアップ
次に、AIエージェントを構成し、作成します。

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

このセットアップでは、

1.  環境のインスタンスを作成します
2.  OpenAIのGPT-4oモデルへの接続を設定します
3.  エージェントが使用できるツールを登録します
4.  エージェントの目標と行動ルールを与えるシステムプロンプトを定義します
5.  チャット戦略を用いて`AIAgent`コンストラクタでエージェントを作成します

## エージェントの実行

最後に、エージェントを実行しましょう。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("Start cleaning, please")
}
```

    Agent says: Currently in cell A. It's already clean.
    Agent says: Moved to cell B. It's already clean.

このコードを実行すると、

1.  エージェントはクリーニングを開始するための最初のプロンプトを受け取ります
2.  ツールを使用して環境を感知し、意思決定を行います
3.  両方のセルがきれいになるまでクリーニングを続けます
4.  プロセス全体を通して、エージェントは行っていることをユーザーに通知します

```kotlin
// 最後に、環境の状態を出力して作業が完了したことを検証できます

env
```

    location=B, dirtyA=false, dirtyB=false