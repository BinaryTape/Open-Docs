# 使用 Koog 整合 Google Maps MCP：在 Kotlin Notebook 中從零開始獲取海拔資料

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

在這篇簡短的部落格風格逐步解說中，我們將把 Koog 連接到 Google Maps 的模型上下文協定 (Model Context Protocol, MCP) 伺服器。我們將使用 Docker 啟動伺服器、探索可用工具，並讓 AI 代理對地址進行地理編碼並獲取其海拔——這一切都在 Kotlin Notebook 中完成。

最後，您將擁有一個可重現的端到端範例，可以將其套用至您的工作流程或文件中。

```kotlin
%useLatestDescriptors
%use koog

```

## 前置條件
在執行下方的程式碼資料格之前，請確保您已具備：

- 已安裝並執行 Docker
- 一個有效的 Google Maps API 金鑰，並匯出為環境變數：`GOOGLE_MAPS_API_KEY`
- 一個匯出為 `OPENAI_API_KEY` 的 OpenAI API 金鑰

您可以在 shell 中像這樣設定它們（macOS/Linux 範例）：

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// Get the API key from environment variables
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 啟動 Google Maps MCP 伺服器 (Docker)
我們將使用官方的 `mcp/google-maps` 映像。該容器將透過 MCP 暴露 `maps_geocode` 和 `maps_elevation` 等工具。我們透過環境變數傳遞 API 金鑰，並以附接 (attached) 模式啟動，以便 notebook 可以透過 stdio 與其通訊。

```kotlin
// Start the Docker container with the Google Maps MCP server
val process = ProcessBuilder(
    "docker",
    "run",
    "-i",
    "-e",
    "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

```

## 透過 McpToolRegistry 探索工具
Koog 可以透過 stdio 連接到 MCP 伺服器。在這裡，我們從執行中的處理序建立工具註冊表，並列印出探索到的工具及其描述符。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## 使用 OpenAI 構建 AI 代理
接下來，我們組裝一個由 OpenAI 執行器和模型支援的簡單代理。該代理將能夠透過我們剛剛建立的註冊表呼叫 MCP 伺服器所提供的工具。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 請求海拔：先進行地理編碼，再獲取海拔
我們提示代理尋找 JetBrains 慕尼黑辦公室的海拔。指令明確地告訴代理僅使用可用工具，以及在該任務中優先使用哪些工具。

```kotlin
import kotlinx.coroutines.runBlocking

val request = "Get elevation of the Jetbrains Office in Munich, Germany?"
runBlocking {
    agent.run(
        request +
            "You can only call tools. Get it by calling maps_geocode and maps_elevation tools."
    )
}

```

## 清理
完成後，請停止 Docker 處理序，以免任何內容在背景執行。

```kotlin
process.destroy()

```

## 疑難排解與後續步驟
- 如果容器無法啟動，請檢查 Docker 是否正在執行以及您的 `GOOGLE_MAPS_API_KEY` 是否有效。
- 如果代理無法呼叫工具，請重新執行探索工具的程式碼資料格，以確保工具註冊表已填充內容。
- 嘗試使用可用的 Google Maps 工具進行其他提示，例如路線規劃或地點搜尋。

接下來，可以考慮組合多個 MCP 伺服器（例如，用於 Web 自動化的 Playwright + Google Maps），並讓 Koog 編排工具的使用以執行更豐富的任務。