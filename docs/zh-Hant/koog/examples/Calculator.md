# 建立一個使用 Koog 工具呼叫的計算機代理程式

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Calculator.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Calculator.ipynb
){ .md-button }

在這個迷你教學中，我們將使用 **Koog** 的工具呼叫功能建立一個計算機代理程式。
你將學習如何：
- 設計用於算術運算的輕量、純粹的 **工具**
- 使用 Koog 的多重呼叫策略協調 **平行** 工具呼叫
- 加入輕量級的 **事件日誌** 以增加透明度
- 搭配 OpenAI 執行（以及可選的 Ollama）

我們將保持 API 整潔且符合 Kotlin 慣例，返回可預期的結果並優雅地處理邊際情況（例如除以零）。

## 設定

我們假設你處於一個已安裝 Koog 的 Kotlin Notebook 環境中。
提供一個 LLM 執行器

```kotlin
%useLatestDescriptors
%use koog

val OPENAI_API_KEY = System.getenv("OPENAI_API_KEY")
    ?: error("Please set the OPENAI_API_KEY environment variable")

val executor = simpleOpenAIExecutor(OPENAI_API_KEY)
```

## 計算機工具

工具是具有清晰契約的輕量、純粹的函式。
我們將使用 `Double` 來獲得更高的精確度，並一致地格式化輸出。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

// 格式輔助函式：整數清晰呈現，小數保留合理精確度。
private fun Double.pretty(): String =
    if (abs(this % 1.0) < 1e-9) this.toLong().toString() else "%.10g".format(this)

@LLMDescription("基本計算機操作的工具")
class CalculatorTools : ToolSet {

    @Tool
    @LLMDescription("將兩個數字相加並以文字形式返回總和。")
    fun plus(
        @LLMDescription("第一個加數。") a: Double,
        @LLMDescription("第二個加數。") b: Double
    ): String = (a + b).pretty()

    @Tool
    @LLMDescription("從第一個數字中減去第二個數字，並以文字形式返回差。")
    fun minus(
        @LLMDescription("被減數。") a: Double,
        @LLMDescription("減數。") b: Double
    ): String = (a - b).pretty()

    @Tool
    @LLMDescription("將兩個數字相乘並以文字形式返回乘積。")
    fun multiply(
        @LLMDescription("第一個因數。") a: Double,
        @LLMDescription("第二個因數。") b: Double
    ): String = (a * b).pretty()

    @Tool
    @LLMDescription("將第一個數字除以第二個數字，並以文字形式返回商。若除以零，則返回錯誤訊息。")
    fun divide(
        @LLMDescription("被除數。") a: Double,
        @LLMDescription("除數（不得為零）。") b: Double
    ): String = if (abs(b) < 1e-12) {
        "ERROR: Division by zero"
    } else {
        (a / b).pretty()
    }
}
```

## 工具註冊表

公開我們的工具（加上兩個用於互動/日誌記錄的內建功能）。

```kotlin
val toolRegistry = ToolRegistry {
    tool(AskUser)   // 當需要時，啟用明確的使用者澄清
    tool(SayToUser) // 允許代理程式向使用者呈現最終訊息
    tools(CalculatorTools())
}
```

## 策略：多重工具呼叫（可選壓縮）

此策略允許 LLM **一次性提出多個工具呼叫**（例如 `plus`、`minus`、`multiply`、`divide`），然後將結果傳回。
如果權杖用量變得太大，我們會在繼續之前**壓縮**工具結果的歷史記錄。

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

        // 如果助理產生了最終答案，則結束。
        edge((callLLM forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })

        // 否則，執行 LLM 請求的工具（可能有多個並行執行）。
        edge((callLLM forwardTo executeTools) onMultipleToolCalls { true })

        // 如果資料量變大，在繼續之前壓縮先前的工具結果。
        edge(
            (executeTools forwardTo compressHistory)
                onCondition { llm.readSession { prompt.latestTokenUsage > MAX_TOKENS_THRESHOLD } }
        )
        edge(compressHistory forwardTo sendToolResults)

        // 一般路徑：將工具結果傳回給 LLM。
        edge(
            (executeTools forwardTo sendToolResults)
                onCondition { llm.readSession { prompt.latestTokenUsage <= MAX_TOKENS_THRESHOLD } }
        )

        // LLM 在看到結果後可能會請求更多工具。
        edge((sendToolResults forwardTo executeTools) onMultipleToolCalls { true })

        // 或者它可以產生最終答案。
        edge((sendToolResults forwardTo nodeFinish) transformed { it.first() } onAssistantMessage { true })
    }
}
```

## 代理程式設定

一個簡潔、以工具為導向的提示運作良好。保持溫度在低點以獲得確定性數學運算。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("calculator") {
        system("你是一個計算機。請總是使用提供的工具進行算術運算。")
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
            println("呼叫工具：${e.tool.name}，引數=${e.toolArgs}")
        }
        onAgentRunError { e ->
            println("代理程式錯誤：${e.throwable.message}")
        }
        onAgentFinished { e ->
            println("最終結果：${e.result}")
        }
    }
}
```

## 試試看

代理程式應該將表達式分解為平行工具呼叫，並返回一個整潔格式化的結果。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.run("(10 + 20) * (5 + 5) / (2 - 11)")
}
// 預期最終值 ≈ -33.333...
```

    呼叫工具：plus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    呼叫工具：plus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    呼叫工具：minus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    呼叫工具：multiply，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    呼叫工具：divide，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=1.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    呼叫工具：divide，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=300.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    最終結果：表達式 \((10 + 20) * (5 + 5) / (2 - 11)\) 的結果約為 \(-33.33\)。

表達式 \((10 + 20) * (5 + 5) / (2 - 11)\) 的結果約為 \(-33.33\)。

## 嘗試強制執行平行呼叫

要求模型一次性呼叫所有必要的工具。
你仍然應該會看到正確的規劃和穩定的執行。

```kotlin
runBlocking {
    agent.run("Use tools to calculate (10 + 20) * (5 + 5) / (2 - 11). Please call all the tools at once.")
}
```

    呼叫工具：plus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=10.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=20.0})
    呼叫工具：plus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.plus(kotlin.Double, kotlin.Double): kotlin.String=5.0})
    呼叫工具：minus，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=2.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.minus(kotlin.Double, kotlin.Double): kotlin.String=11.0})
    呼叫工具：multiply，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.multiply(kotlin.Double, kotlin.Double): kotlin.String=10.0})
    呼叫工具：divide，引數=VarArgs(args={parameter #1 a of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=30.0, parameter #2 b of fun Line_4_jupyter.CalculatorTools.divide(kotlin.Double, kotlin.Double): kotlin.String=-9.0})
    最終結果：\((10 + 20) * (5 + 5) / (2 - 11)\) 的結果約為 \(-3.33\)。

\((10 + 20) * (5 + 5) / (2 - 11)\) 的結果約為 \(-3.33\)。

## 搭配 Ollama 執行

如果你偏好本地推論，請交換執行器和模型。

```kotlin
val ollamaExecutor: PromptExecutor = simpleOllamaAIExecutor()

val ollamaAgentConfig = AIAgentConfig(
    prompt = prompt("calculator", LLMParams(temperature = 0.0)) {
        system("你是一個計算機。請總是使用提供的工具進行算術運算。")
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

    代理程式說：表達式 (10 + 20) * (5 + 5) / (2 - 11) 的結果約為 -33.33。

如果您還有其他問題或需要進一步協助，請隨時提問！