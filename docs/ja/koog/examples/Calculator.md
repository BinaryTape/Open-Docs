# Koog を使用したツール呼び出し計算機エージェントの構築

[:material-github: GitHub で表示](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb をダウンロード](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

このミニチュートリアルでは、**Koog** のツール呼び出し機能を活用した計算機エージェントを構築します。
以下の内容を学習します：
- 算術演算のための小規模で純粋な**ツール**の設計
- Koog のマルチコール戦略（multiple-call strategy）による**並列**ツール呼び出しのオーケストレーション
- 透明性を高めるための軽量な**イベントロギング**の追加
- OpenAI（およびオプションで Ollama）での実行

API は整理された慣習的な Kotlin 形式に保ち、予測可能な結果を返し、ゼロ除算のようなエッジケースを適切に処理します。

## セットアップ

Koog が利用可能な Kotlin Notebook 環境を想定しています。
LLM エグゼキュータを提供します。

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 計算機ツール

ツールは、明確なコントラクトを持つ小規模で純粋な関数です。
精度を高めるために `Double` を使用し、出力を一貫した形式でフォーマットします。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// フォーマットヘルパー：整数はきれいに表示し、小数は適切な精度を維持します。
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("Tools for basic calculator operations")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("Adds two numbers and returns the sum as text.")
    fun plus(
        @LLMDescription("First addend.") a: Double,
        @LLMDescription("Second addend.") b: Double
    ): String = (a + b).pretty()

    @Tool
    @LLMDescription("Subtracts the second number from the first and returns the difference as text.")
    fun minus(
        @LLMDescription("Minuend.") a: Double,
        @LLMDescription("Subtrahend.") b: Double
    ): String = (a - b).pretty()

    @Tool
    @LLMDescription("Multiplies two numbers and returns the product as text.")
    fun multiply(
        @LLMDescription("First factor.") a: Double,
        @LLMDescription("Second factor.") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("Divides the first number by the second and returns the quotient as text. Returns an error message on division by zero.")
    fun divide(
        @LLMDescription("Dividend.") a: Double,
        @LLMDescription("Divisor (must not be zero).") b: Double
    ): String = if (abs(b) < 1e-12) {
        "ERROR: Division by zero"
    } else {
        (a / b).pretty()
    }
}
```

## ツールレジストリ

ツールを公開します（対話とロギングのための 2 つの組み込みツールも含まれます）。

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // 必要に応じてユーザーに明示的な確認を求めることを可能にします
    tool(SayToUser) // エージェントがユーザーに最終メッセージを提示することを可能にします
    tools(CalculatorTools())
}
```

## 戦略：複数のツール呼び出し（オプションの圧縮機能付き）

この戦略により、LLM は一度に**複数のツール呼び出し**（例：`plus`、`minus`、`multiply`、`divide`）を提案し、その結果をまとめて送り返すことができます。
トークン使用量が大きくなりすぎた場合は、継続する前にツール実行結果の履歴を**圧縮**します。

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

        // アシスタントが最終回答を生成した場合は終了。
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // それ以外の場合は、LLM が要求したツールを実行します（複数のツールを並列に実行する可能性があります）。
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // トークン量が多くなった場合、継続する前に過去のツール実行結果を圧縮します。
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 通常のパス：ツール実行結果を LLM に送り返します。
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // 結果を確認した後、LLM がさらにツールを要求する可能性があります。
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // または、最終回答を生成します。
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## エージェントの設定

ツール利用を重視した最小限のプロンプトが効果的です。決定論的な計算を行うために、temperature（温度）を低く設定します。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("calculator") {
        system("You are a calculator. Always use the provided tools for arithmetic.")
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
            println("Tool called: ${e.tool.name}, args=${e.toolArgs}")
        }
        onAgentExecutionFailed { e ->
            println("Agent error: ${e.throwable.message}")
        }
        onAgentCompleted { e ->
            println("Final result: ${e.result}")
        }
    }
}
```

## 試してみる

エージェントは式を並列のツール呼び出しに分解し、きれいにフォーマットされた結果を返します。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// 期待される最終値 ≈ -33.333...
```

    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    Tool called: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    Tool called: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Final result: The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

    The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

## 並列呼び出しの強制を試す

必要なすべてのツールを一度に呼び出すようモデルに依頼します。
正しい計画と安定した実行が確認できるはずです。

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

    The result of \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-3.33\).

## Ollama での実行

ローカルでの推論を好む場合は、エグゼキュータとモデルを入れ替えます。

```kotlin
val ollamaExecutor: PromptExecutor = simpleOllamaAIExecutor()

val ollamaAgentConfig = AIAgentConfig(
    prompt = prompt("calculator", LLMParams(temperature = 0.0)) {
        system("You are a calculator. Always use the provided tools for arithmetic.")
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

    If you have any more questions or need further assistance, feel free to ask!