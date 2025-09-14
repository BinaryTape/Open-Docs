# FunctionalAIAgent：如何逐步建立單次執行代理程式

FunctionalAIAgent 是一個輕量級、非圖形化的代理程式，您可以透過一個簡單的迴圈來控制它。在以下情況使用它：
- 在自訂迴圈中呼叫 LLM 一次或數次；
- 可選地在 LLM 輪次之間呼叫工具；
- 返回最終值（字串、資料類別等），而無需建立完整的策略圖。

您將在本指南中完成以下任務：
1) 建立一個「Hello, World」FunctionalAIAgent。
2) 新增一個工具並讓代理程式呼叫它。
3) 新增一個功能 (事件處理器) 以觀察行為。
4) 透過歷史紀錄壓縮來控制上下文。
5) 學習常見用法、陷阱和常見問題。

## 1) 前提條件
您需要一個 PromptExecutor (實際與您的 LLM 進行通訊的物件)。為了進行本地實驗，您可以使用 Ollama 執行器：

```kotlin
val exec = simpleOllamaAIExecutor()
```

您還需要選擇一個模型，例如：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

就是這樣 — 我們會將兩者注入代理程式工廠。

## 2) 您的第一個代理程式 (Hello, World)
目標：將使用者的文字發送到 LLM，並以字串形式返回單個助理訊息。

```kotlin
val agent = functionalAIAgent<String, String>(
    prompt = "You are a helpful assistant.",
    promptExecutor = exec,
    model = model
) { input ->
    val responses = requestLLMMultiple(input)
    responses.single().asAssistantMessage().content
}

val result = agent.run("Say hi in one sentence")
println(result)
```

發生了什麼？
- requestLLMMultiple(input) 發送使用者輸入並接收一個或多個助理訊息。
- 我們返回唯一訊息的內容 (典型的一次性 (one-shot) 流程)。

提示：如果您想返回結構化資料，請解析內容或使用 Structured Data API。

## 3) 新增工具 (代理程式如何呼叫您的函式)
目標：讓模型透過工具操作一個小型裝置。

```kotlin
class Switch {
    private var on = false
    fun on() { on = true }
    fun off() { off = false }
    fun isOn() = on
}

class SwitchTools(private val sw: Switch) {
    fun turn_on() = run { sw.on(); "ok" }
    fun turn_off() = run { sw.off(); "ok" }
    fun state() = if (sw.isOn()) "on" else "off"
}

val sw = Switch()
val tools = ToolRegistry { tools(SwitchTools(sw).asTools()) }

val toolAgent = functionalAIAgent<String, String>(
    prompt = "You're responsible for running a Switch device and perform operations on it by request.",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools
) { input ->
    var responses = requestLLMMultiple(input)

    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }

    responses.single().asAssistantMessage().content
}

val out = toolAgent.run("Turn switch on")
println(out)
println("Switch is ${if (sw.isOn()) "on" else "off"}")
```

運作方式
- containsToolCalls() 偵測來自 LLM 的工具呼叫訊息。
- extractToolCalls(...) 讀取要執行哪些工具以及使用哪些參數 (args)。
- executeMultipleTools(...) 根據您的 ToolRegistry 執行它們。
- sendMultipleToolResults(...) 將結果發送回 LLM 並取得下一個回應。

## 4) 透過功能 (EventHandler) 觀察行為
目標：將每次工具呼叫印到控制台。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCall { e -> println("Tool called: ${'
    ```}{e.tool.name}, args: ${'
    ```}{e.toolArgs}") }
        }
    }
) { input ->
    var responses = requestLLMMultiple(input)
    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }
    responses.single().asAssistantMessage().content
}
```

您可以透過這種方式安裝的其他功能包括流式傳輸 token 和追蹤；請參閱側邊欄中的相關文件。

## 5) 控制上下文 (歷史紀錄壓縮)
長時間的對話可能會超出模型的上下文視窗。使用 token 使用量來決定何時壓縮歷史紀錄：

```kotlin
var responses = requestLLMMultiple(input)

while (responses.containsToolCalls()) {
    if (latestTokenUsage() > 100_000) {
        compressHistory()
    }
    val pending = extractToolCalls(responses)
    val results = executeMultipleTools(pending)
    responses = sendMultipleToolResults(results)
}
```

使用一個適合您的模型和提示大小的閾值。

## 常見用法
- 返回結構化輸出
  - 要求 LLM 格式化 JSON 並解析它；或使用 Structured Data API。
- 驗證工具輸入
  - 在工具函式中執行驗證並返回清晰的錯誤訊息。
- 每個請求一個代理程式實例
  - 每個代理程式實例在同一時間只能單次執行。如果需要並行性，請建立新的實例。
- 自訂輸出類型
  - 更改 functionalAIAgent<String, MyResult> 並從迴圈中返回一個 data class。

## 故障排除與陷阱
- 「代理程式已在執行中」
  - FunctionalAIAgent 防止在同一實例上進行並行執行。不要跨並行協程共用一個實例；每次執行建立一個新的代理程式或等待完成。
- 空白或意外的模型輸出
  - 檢查您的系統提示。印出中間回應。考慮新增 few-shot 範例。
- 迴圈永不結束
  - 確保在沒有工具呼叫時中斷；為安全起見新增防護措施/逾時。
- 上下文溢出
  - 監控 latestTokenUsage() 並呼叫 compressHistory()。

## 參考 (快速)
### 建構函式

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfigBase,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    loop: suspend AIAgentFunctionalContext.(input: Input) -> Output
): AIAgent<Input, Output>

fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    prompt: String = "",
    model: LLModel = OpenAIModels.Chat.GPT4o,
    featureContext: FeatureContext.() -> Unit = {},
    func: suspend AIAgentFunctionalContext.(input: Input) -> Output,
): AIAgent<Input, Output>
```

### 重要類型
- FunctionalAIAgent<Input, Output>
- AIAgentFunctionalContext
- AIAgentConfig / AIAgentConfigBase
- PromptExecutor
- ToolRegistry
- FeatureContext 和功能介面

查看原始碼：agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt