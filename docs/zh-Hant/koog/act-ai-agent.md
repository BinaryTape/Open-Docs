# FunctionalAIAgent：如何逐步建置單次執行 Agent

FunctionalAIAgent 是一個輕量級、非圖形化的 Agent，您可以透過簡單的迴圈來控制它。在以下情況下可以使用它：
- 在自訂迴圈中呼叫一次或幾次 LLM；
- 選擇性地在 LLM 回合之間呼叫工具；
- 傳回最終值（字串、資料類別等），而無需建置完整的策略圖。

您將在本指南中執行以下操作：
1) 建立一個「Hello, World」FunctionalAIAgent。
2) 新增工具並讓 Agent 呼叫它。
3) 新增特性（事件處理常式）以觀察行為。
4) 透過歷程記錄壓縮來控制上下文。
5) 學習常用技巧、常見陷阱與常見問題。

## 1) 先決條件
您需要一個 PromptExecutor（實際與 LLM 通訊的物件）。如需進行本機實驗，您可以使用 Ollama 執行器：

```kotlin
val exec = simpleOllamaAIExecutor()
```

您還需要選擇一個模型，例如：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

就這樣 —— 我們將把這兩者都注入到 Agent 工廠中。

## 2) 您的第一個 Agent（Hello, World）
目標：將使用者的文字傳送到 LLM 並傳回單個助理訊息作為字串。

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

發生了什麼事？
- requestLLMMultiple(input) 傳送使用者輸入並接收一個或多個助理訊息。
- 我們傳回唯一的訊息內容（典型的單次嘗試流程）。

提示：如果您想傳回結構化資料，請剖析內容或使用結構化資料 API。

## 3) 新增工具（Agent 如何呼叫您的函式）
目標：讓模型透過工具操作一個微型裝置。

```kotlin
class Switch {
    private var on = false
    fun on() { on = true }
    fun off() { on = false }
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
- extractToolCalls(...) 讀取要執行哪些工具以及使用哪些引數。
- executeMultipleTools(...) 針對您的 ToolRegistry 執行它們。
- sendMultipleToolResults(...) 將結果傳回給 LLM 並獲取下一個回應。

## 4) 透過特性觀察行為（EventHandler）
目標：將每次工具呼叫列印到主控台。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCallStarting { e -> println("Tool called: ${e.tool.name}, args: ${e.toolArgs}") }
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

您可以透過這種方式安裝的其他特性包括串流權杖和追蹤；請參閱側邊欄中的相關文件。

## 5) 控制上下文（歷程記錄壓縮）
長對話可能會超過模型的上下文視窗。使用權杖使用量來決定何時壓縮歷程記錄：

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

請使用適合您的模型和提示詞大小的閾值。

## 常用技巧
- 傳回結構化輸出
  - 要求 LLM 格式化 JSON 並對其進行剖析；或使用結構化資料 API。
- 驗證工具輸入
  - 在工具函式中執行驗證並傳回明確的錯誤訊息。
- 每次請求一個 Agent 執行個體
  - 每個 Agent 執行個體一次僅限單次執行。如果您需要並行，請建立新的執行個體。
- 自訂輸出型別
  - 變更 functionalAIAgent<String, MyResult> 並從迴圈中傳回一個資料類別。

## 疑難排解與常見陷阱
- 「Agent 已經在執行中」
  - FunctionalAIAgent 防止在同一執行個體上並行執行。請勿在平行協同程式之間共用一個執行個體；請為每次執行建立新的 Agent 或等待完成。
- 模型輸出為空或非預期
  - 檢查您的系統提示詞。列印中間回應。考慮加入幾次嘗試（few-shot）範例。
- 迴圈永不結束
  - 確保在沒有工具呼叫時跳出迴圈；為了安全起見，請加入保護措施／逾時設定。
- 上下文溢位
  - 監控 latestTokenUsage() 並呼叫 compressHistory()。

## 參考（快速）
建構函式

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfig,
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

重要型別
- FunctionalAIAgent<Input, Output>
- AIAgentFunctionalContext
- AIAgentConfig / AIAgentConfigBase
- PromptExecutor
- ToolRegistry
- FeatureContext 與特性介面

查看原始碼：agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt