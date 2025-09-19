# Koog を使用したツール呼び出しを行う電卓エージェントの構築

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

このミニチュートリアルでは、**Koog** のツール呼び出し機能を活用した電卓エージェントを構築します。
以下を学びます。
- 算術演算のための小さく純粋な**ツール**を設計する方法
- Koog の複数呼び出し戦略を使用して、**並列**ツール呼び出しを調整する方法
- 透明性のための軽量な**イベントロギング**を追加する方法
- OpenAI (およびオプションで Ollama) とともに実行する方法

API は簡潔でイディオマティックな Kotlin に保ち、予測可能な結果を返し、エッジケース（ゼロ除算など）も適切に処理します。

## セットアップ

Koog が利用可能な Kotlin Notebook 環境にいることを前提としています。
LLM エグゼキュータを提供します。

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 電卓ツール

ツールは、明確な責務を持つ小さく純粋な関数です。
より高い精度のため `Double` を使用し、出力を一貫してフォーマットします。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// Format helper: integers render cleanly, decimals keep reasonable precision.
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

私たちのツール（および対話/ロギング用の2つの組み込みツール）を公開します。

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // enables explicit user clarification when needed
    tool(SayToUser) // allows the agent to present the final message to the user
    tools(CalculatorTools())
}
```

## 戦略：複数ツール呼び出し（オプションの圧縮機能付き）

この戦略では、LLM は（`plus`、`minus`、`multiply`、`divide` のように）**複数のツール呼び出しを一度に提案**し、その結果を返送します。
トークンの使用量が大きくなりすぎた場合、続行する前にツール結果の履歴を**圧縮**します。

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

        // If the assistant produced a final answer, finish.
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // Otherwise, run the tools LLM requested (possibly several in parallel).
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // If we’re getting large, compress past tool results before continuing.
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // Normal path: send tool results back to the LLM.
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM might request more tools after seeing results.
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // Or it can produce the final answer.
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## エージェント設定

最小限でツールを優先するプロンプトがうまく機能します。決定論的な計算のため、temperature は低く保ちます。

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
        onToolCall { e ->
            println("Tool called: ${e.tool.name}, args=${e.toolArgs}")
        }
        onAgentRunError { e ->
            println("Agent error: ${e.throwable.message}")
        }
        onAgentFinished { e ->
            println("Final result: ${e.result}")
        }
    }
}
```

## 試してみる

エージェントは式を並列ツール呼び出しに分解し、きれいにフォーマットされた結果を返すべきです。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// Expected final value ≈ -33.333...
```

    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    Tool called: plus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    Tool called: minus, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    Tool called: multiply, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Tool called: divide, args=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    Final result: The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

    The result of the expression \((10 + 20) * (5 + 5) / (2 - 11)\) is approximately \(-33.33\).

## 並列呼び出しを強制してみる

モデルに、必要なすべてのツールを一度に呼び出すように依頼します。
それでも、正しい計画と安定した実行が見られるはずです。

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

## Ollama で実行する

ローカル推論を希望する場合は、エグゼキュータとモデルを入れ替えてください。

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
```