# Google Maps MCP 搭配 Koog：從零到海拔高度的 Kotlin Notebook

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/GoogleMapsMcp.ipynb
){ .md-button }

在這篇簡短的部落格式逐步指南中，我們將把 Koog 連接到 Google Maps 的模型上下文協議 (Model Context Protocol, MCP) 伺服器。我們將使用 Docker 啟動該伺服器，探索可用的工具，並讓 AI 代理程式執行地址的地理編碼並獲取其海拔高度 — 所有這些都可以在 Kotlin Notebook 中完成。

最後，您將獲得一個可重現的端對端範例，您可以將其整合到您的工作流程或文件中。

```kotlin
%useLatestDescriptors
%use koog

```

## 先決條件
在執行以下單元格之前，請確保您已具備：

- Docker 已安裝並正在運行
- 一個有效的 Google Maps API 金鑰，並已匯出為環境變數：`GOOGLE_MAPS_API_KEY`
- 一個 OpenAI API 金鑰，並已匯出為 `OPENAI_API_KEY`

您可以在 shell 中設定它們，例如 (macOS/Linux 範例)：

```bash
export GOOGLE_MAPS_API_KEY="<your-key>"
export OPENAI_API_KEY="<your-openai-key>"
```

```kotlin
// 從環境變數中獲取 API 金鑰
val googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY") ?: error("GOOGLE_MAPS_API_KEY environment variable not set")
val openAIApiToken = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")

```

## 啟動 Google Maps MCP 伺服器 (Docker)
我們將使用官方的 `mcp/google-maps` 映像。該容器將透過 MCP 暴露 `maps_geocode` 和 `maps_elevation` 等工具。我們透過環境變數傳遞 API 金鑰，並以附加模式啟動它，以便 Notebook 可以透過 stdio 與其通訊。

```kotlin
// 啟動帶有 Google Maps MCP 伺服器的 Docker 容器
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
Koog 可以透過 stdio 連接到 MCP 伺服器。在這裡，我們從正在運行的程序中建立一個工具註冊表，並印出已探索到的工具及其描述符。

```kotlin
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)
toolRegistry.tools.forEach {
    println(it.name)
    println(it.descriptor)
}

```

## 使用 OpenAI 建立 AI 代理程式
接下來，我們將組裝一個由 OpenAI 執行器和模型支援的簡單代理程式。該代理程式將能夠透過我們剛建立的註冊表呼叫 MCP 伺服器暴露的工具。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)

```

## 詢問海拔高度：先地理編碼，再獲取海拔高度
我們提示代理程式找出位於德國慕尼黑的 JetBrains 辦公室的海拔高度。說明明確地告訴代理程式只能使用可用的工具，以及哪些工具優先用於該任務。

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
完成後，停止 Docker 程序，以免有任何程序在背景運行。

```kotlin
process.destroy()

```

## 疑難排解與後續步驟
- 如果容器無法啟動，請檢查 Docker 是否正在運行，以及您的 `GOOGLE_MAPS_API_KEY` 是否有效。
- 如果代理程式無法呼叫工具，請重新執行探索單元格，以確保工具註冊表已填入。
- 嘗試使用可用的 Google Maps 工具進行其他提示，例如路線規劃或地點搜尋。

接下來，考慮組合多個 MCP 伺服器 (例如，用於網頁自動化的 Playwright + Google Maps)，並讓 Koog 協調工具使用以完成更豐富的任務。