# 使用 Koog 建構一個猜數字代理

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Guesser.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Guesser.ipynb
){ .md-button }

讓我們來建構一個小巧而有趣的代理，它能猜出你心中想的數字。我們將仰賴 Koog 的工具呼叫 (tool-calling) 功能以提出有針對性的問題，並利用經典的二元搜尋策略 (binary search strategy) 來收斂。最終成果是一個慣用的 Kotlin Notebook，你可以直接將其放入文件 (docs) 中。

我們將使程式碼保持最精簡，並讓流程清晰透明：幾個微小的工具、一個簡潔的提示 (prompt)，以及一個互動式的命令列介面 (CLI) 迴圈。

## 設定

這個 Notebook 假設：
- 您正在一個已安裝 Koog 的 Kotlin Notebook 中執行。
- 環境變數 `OPENAI_API_KEY` 已設定。代理透過 `simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))` 來使用它。

載入 Koog 核心 (kernel)：

```kotlin
%useLatestDescriptors
%use koog
```

## 工具：提出有針對性的問題

工具是小型、描述清晰的函式，大型語言模型 (LLM) 可以呼叫它們。我們將提供三個：
- `lessThan(value)`: 「您的數字小於 `value` 嗎？」
- `greaterThan(value)`: 「您的數字大於 `value` 嗎？」
- `proposeNumber(value)`: 「您的數字等於 `value` 嗎？」 （在範圍縮小後使用）

每個工具都會回傳一個簡單的 "YES"/"NO" 字串。輔助函式 `ask` 實作了一個最簡化的 Y/n 迴圈並驗證輸入。透過 `@LLMDescription` 提供的描述有助於模型正確地選擇工具。

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

## 工具註冊器

將您的工具公開給代理。我們還新增了一個內建的 `SayToUser` 工具，這樣代理就能直接向使用者顯示訊息。

```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
    tools(GuesserTool())
}
```

## 代理配置

我們只需要一個簡短、以工具為導向的系統提示 (system prompt)。我們會建議採用二元搜尋策略，並保持 `temperature = 0.0` 以獲得穩定、確定性的行為。在這裡，我們使用 OpenAI 的推理模型 `GPT4oMini` 來進行清晰的規劃。

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

## 執行它

- 想一個介於 1 到 100 之間的數字。
- 輸入 `start` 來開始。
- 使用 `Y`/`Enter` 回答代理的問題表示「是」，使用 `n` 表示「否」。代理應該能在大約 7 步內精準猜中您的數字。

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

- 代理讀取系統提示 (system prompt) 並規劃二元搜尋。
- 在每次迭代中，它會呼叫您的其中一個工具：`lessThan`、`greaterThan`，或者（當確定時）`proposeNumber`。
- 輔助函式 `ask` 收集您的 Y/n 輸入，並將乾淨的 "YES"/"NO" 訊號回傳給模型。
- 當它收到確認時，會透過 `SayToUser` 向您祝賀。

## 擴展它

- 透過調整系統提示 (system prompt) 來更改範圍（例如，1..1000）。
- 新增一個 `between(low, high)` 工具以進一步減少呼叫次數。
- 更換模型或執行器 (executor)（例如，使用 Ollama 執行器和本地模型），同時保留相同的工具。
- 將猜測結果或輸出持久化到儲存中以進行分析。

## 疑難排解

- 缺少金鑰：確保 `OPENAI_API_KEY` 已在您的環境中設定。
- 找不到核心：請確認 `%useLatestDescriptors` 和 `%use koog` 已成功執行。
- 未呼叫工具：請確認 `ToolRegistry` 包含 `GuesserTool()`，並且提示 (prompt) 中的名稱與您的工具函式相符。