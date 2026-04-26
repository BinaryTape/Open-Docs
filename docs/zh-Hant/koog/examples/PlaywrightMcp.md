# 使用 Playwright MCP 與 Koog 驅動瀏覽器

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

在這個筆記本中，您將會把 Koog agent 連接到 Playwright 的模型內容協定 (MCP) 伺服器，並讓它驅動真實的瀏覽器來完成任務：開啟 jetbrains.com、接受 Cookie，並點擊工具列中的 AI 區塊。

我們將保持內容簡單且可重現，專注於一個極簡但實用的 agent + 工具設定，您可以發佈並重複使用。

```kotlin
%useLatestDescriptors
%use koog

```

## 前置需求
- 已匯出為環境變數的 OpenAI API 金鑰：`OPENAI_API_KEY`
- 您的 PATH 中有 Node.js 和 npx 可供使用
- 具備可透過 `%use koog` 使用 Koog 的 Kotlin Jupyter 筆記本環境

提示：在 headful 模式下執行 Playwright MCP 伺服器，以觀察瀏覽器自動化執行的步驟。

## 1) 提供您的 OpenAI API 金鑰
我們從 `OPENAI_API_KEY` 環境變數中讀取 API 金鑰。這可以確保秘密資訊不會留在筆記本中。

```kotlin
// Get the API key from environment variables
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) 啟動 Playwright MCP 伺服器
我們將使用 `npx` 在本機啟動 Playwright 的 MCP 伺服器。預設情況下，它會公開一個 SSE 端點，我們可以從 Koog 連接該端點。

```kotlin
// Start the Playwright MCP server via npx
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) 從 Koog 連接並執行 agent
我們建立一個帶有 OpenAI 執行器的極簡 Koog `AIAgent`，並將其工具註冊表透過 SSE 指向 MCP 伺服器。接著我們要求它完全透過工具來完成瀏覽器任務。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("Connecting to Playwright MCP server...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931/sse")
    )
    println("Successfully connected to Playwright MCP server")

    // Create the agent
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("Sending request: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) 關閉 MCP 處理程序
在執行結束時，請務必清理外部處理程序。

```kotlin
// Shutdown the Playwright MCP process
println("Closing connection to Playwright MCP server")
process.destroy()

```

## 疑難排解
- 如果 agent 無法連接，請確保 MCP 伺服器正在 `http://localhost:8931` 上執行。
- 如果您沒有看到瀏覽器，請確保已安裝 Playwright 且能夠在您的系統上啟動瀏覽器。
- 如果您收到來自 OpenAI 的身份驗證錯誤，請再次檢查 `OPENAI_API_KEY` 環境變數。

## 下一步
- 嘗試不同的網站或流程。MCP 伺服器公開了一套豐富的 Playwright 工具。
- 更換 LLM 模型，或為 Koog agent 增加更多工具。
- 將此流程整合到您的應用程式中，或將筆記本發佈為文件。