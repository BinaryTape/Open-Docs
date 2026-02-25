# 使用 Koog 建立數字猜測 Agent

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

讓我們建立一個小巧但有趣的 Agent，它能猜出你心中所想的一個數字。我們將利用 Koog 的工具呼叫 (tool-calling) 功能來提出針對性問題，並使用經典的二元搜尋策略來收斂範圍。最終將產出一個道地的 Kotlin Notebook，你可以直接將其放入文件中。

我們將保持程式碼極簡且流程透明：包含幾個微型工具、簡潔的提示詞 (prompt) 以及一個互動式 CLI 迴圈。

## 設定

此筆記本假設：
- 你正在執行已安裝 Koog 的 Kotlin Notebook。
- 已設定環境變數 `OPENAI_API_KEY`。Agent 透過 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` 使用它。

載入 Koog 核心：

```kotlin
%useLatestDescriptors
%use koog
```

## 工具：提出針對性問題

工具是 LLM 可以呼叫的小型、描述詳盡的函式。我們將提供三個：
- `lessThan(value)`：「你的數字是否小於該值？」
- `greaterThan(value)`：「你的數字是否大於該值？」
- `proposeNumber(value)`：「你的數字是否等於該值？」（當範圍縮小時使用）

每個工具都會回傳簡單的 "YES"/"NO" 字串。輔助程式 `ask` 實作了一個極簡的 Y/n 迴圈並驗證輸入。透過 `@LLMDescription` 提供的描述可協助模型正確選擇工具。

```kotlin
import ai.koog.agents.core.tools.annotations.Tool

class GuesserTool : ToolSet {

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY less than a given value.")
    fun lessThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number less than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is STRICTLY greater than a given value.")
    fun greaterThan(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number greater than $value?", value)

    @Tool
    @LLMDescription("Asks the user if his number is EXACTLY equal to the given number. Only use this tool once you've narrowed down your answer.")
    fun proposeNumber(
        @LLMDescription("A value to compare the guessed number with.") value: Int
    ): String = ask("Is your number equal to $value?", value)

    fun ask(question: String, value: Int): String {
        print("$question [Y/n]: ")
        val input = readln()
        println(input)

        return when (input.lowercase()) {
            "", "y", "yes" -> "YES"
            "n", "no" -> "NO"
            else -> {
                println("Invalid input! Please, try again.")
                ask(question, value)
            }
        }
    }
}
```

## 工具註冊表 (Tool Registry)

將你的工具公開給 Agent。我們還新增了一個內建的 `SayToUser` 工具，讓 Agent 能直接向使用者傳達訊息。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## Agent 配置

我們只需要一個簡短且以工具為導向的系統提示詞。我們將建議使用二元搜尋策略，並將 `temperature` 設為 `0.0` 以獲得穩定、具決定性的行為。這裡我們使用 OpenAI 的推理模型 `GPT4oMini` 來進行清晰的規劃。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = """
            You are a number guessing agent. Your goal is to guess a number that the user is thinking of.
            
            Follow these steps:
            1. Start by asking the user to think of a number between 1 and 100.
            2. Use the less_than and greater_than tools to narrow down the range.
                a. If it's neither greater nor smaller, use the propose_number tool.
            3. Once you're confident about the number, use the propose_number tool to check if your guess is correct.
            4. If your guess is correct, congratulate the user. If not, continue guessing.
            
            Be efficient with your guessing strategy. A binary search approach works well.
        """.trimIndent(),
    temperature = 0.0,
    toolRegistry = toolRegistry
)
```

## 執行

- 心中想一個 1 到 100 之間的數字。
- 輸入 `start` 開始。
- 以 `Y`/`Enter` 代表「是」或以 `n` 代表「否」來回答 Agent 的問題。Agent 應該會在約 7 個步驟內鎖定你的數字。

```kotlin
import kotlinx.coroutines.runBlocking

println("Number Guessing Game started!")
println("Think of a number between 1 and 100, and I'll try to guess it.")
println("Type 'start' to begin the game.")

val initialMessage = readln()
runBlocking {
    agent.run(initialMessage)
}
```

## 運作原理

- Agent 讀取系統提示詞並規劃二元搜尋。
- 在每次迭代中，它會呼叫你的一個工具：`lessThan`、`greaterThan` 或（當確定時）`proposeNumber`。
- 輔助程式 `ask` 收集你的 Y/n 輸入，並將乾淨的 "YES"/"NO" 信號回傳給模型。
- 當獲得確認時，它會透過 `SayToUser` 向你祝賀。

## 擴充功能

- 透過調整系統提示詞來更改範圍（例如 1..1000）。
- 新增 `between(low, high)` 工具以進一步減少呼叫次數。
- 在保持相同工具的情況下，更換模型或執行器 (executor)（例如，使用 Ollama 執行器和本機模型）。
- 將猜測結果或產出持久化到存儲庫中以進行分析。

## 疑難排解

- 缺少金鑰：確保環境中已設定 `OPENAI_API_KEY`。
- 找不到核心：確保 `%useLatestDescriptors` 和 `%use koog` 已成功執行。
- 工具未被呼叫：確認 `ToolRegistry` 包含 `GuesserTool()`，且提示詞中的名稱與你的工具函式相符。