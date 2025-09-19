# 使用 Playwright MCP 和 Koog 驅動瀏覽器

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/PlaywrightMcp.ipynb
){ .md-button }

在本筆記本中，你將把一個 Koog 代理連接到 Playwright 的模型上下文協定 (Model Context Protocol, MCP) 伺服器，並讓它驅動一個真實的瀏覽器來完成一項任務：打開 jetbrains.com，接受 Cookie，並點擊工具列中的「AI」區塊。

我們將保持內容簡潔且可重現，專注於一個最小化但實際的代理 + 工具設置，以便你可以發布和重複使用。

```kotlin
%useLatestDescriptors
%use koog

```

## 前置條件
- 一個已匯出為環境變數 `OPENAI_API_KEY` 的 OpenAI API 金鑰
- Node.js 和 npx 在你的 PATH 中可用
- 具備 Koog 並可透過 `%use koog` 使用的 Kotlin Jupyter 筆記本環境

提示：以可視化模式運行 Playwright MCP 伺服器，以觀察瀏覽器自動執行這些步驟。

## 1) 提供你的 OpenAI API 金鑰
我們從 `OPENAI_API_KEY` 環境變數中讀取 API 金鑰。這能確保機密資訊不會儲存在筆記本中。

```kotlin
// Get the API key from environment variables
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 2) 啟動 Playwright MCP 伺服器
我們將使用 `npx` 在本地啟動 Playwright 的 MCP 伺服器。預設情況下，它將公開一個我們可以用 Koog 連接的 SSE 端點。

```kotlin
// Start the Playwright MCP server via npx
val process = ProcessBuilder(
    "npx",
    "@playwright/mcp@latest",
    "--port",
    "8931"
).start()

```

## 3) 從 Koog 連接並運行代理
我們構建一個最小的 Koog `AIAgent`，搭配 OpenAI 執行器，並將其工具註冊表指向透過 SSE 連接的 MCP 伺服器。接著，我們要求它嚴格透過工具來完成瀏覽器任務。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    println("正在連接到 Playwright MCP 伺服器...")
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
    )
    println("成功連接到 Playwright MCP 伺服器")

    // Create the agent
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiToken),
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = toolRegistry,
    )

    val request = "Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar"
    println("正在傳送請求: $request")

    agent.run(
        request + ". " +
            "You can only call tools. Use the Playwright tools to complete this task."
    )
}

```

## 4) 關閉 MCP 程序
在你的執行結束時，務必清理外部程序。

```kotlin
// Shutdown the Playwright MCP process
println("正在關閉與 Playwright MCP 伺服器的連接")
process.destroy()

```

## 疑難排解
- 如果代理無法連接，請確保 MCP 伺服器正在 `http://localhost:8931` 上運行。
- 如果你沒有看到瀏覽器，請確保 Playwright 已安裝，並且能夠在你的系統上啟動瀏覽器。
- 如果你從 OpenAI 收到身份驗證錯誤，請仔細檢查 `OPENAI_API_KEY` 環境變數。

## 後續步驟
- 嘗試不同的網站或流程。MCP 伺服器公開了豐富的 Playwright 工具集。
- 更換 LLM 模型，或為 Koog 代理添加更多工具。
- 將此流程整合到你的應用程式中，或將筆記本發布為文件。