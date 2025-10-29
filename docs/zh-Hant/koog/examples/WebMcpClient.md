# 使用 Bright Data 與 Koog 的 The Web MCP 進行網路爬蟲

[:material-github: 在 GitHub 上開啟](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: 下載 .kt](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

在本教學中，您將會把一個 Koog 代理程式連接到 Bright Data 的 Web MCP 伺服器，並讓它執行網路爬蟲和資料收集任務。我們將展示如何透過 Model Context Protocol (模型上下文協定)，利用 Bright Data 強大的網路爬蟲基礎架構來搜尋關於 Koog.ai 的資訊。

我們將保持簡潔和可重現性，專注於一個最小但實用的代理程式 + 工具設定，您可以將其調整以滿足您自己的網路爬蟲需求。

## 前置需求

-   一個已匯出為環境變數 `OPENAI_API_KEY` 的 OpenAI API 金鑰
-   一個已匯出為環境變數 `BRIGHT_DATA_API_TOKEN` 的 Bright Data API 權杖
-   `PATH` 中可用的 Node.js 和 npx
-   具有 Koog 依賴項的 Kotlin 開發環境

**提示**：Bright Data MCP 伺服器提供了企業級的網路爬蟲工具，能夠處理複雜的網站、CAPTCHA 和反機器人措施。

## 1) 設定您的 API 憑證

我們從環境變數讀取兩個 API 金鑰，以確保機密資訊的安全，並將其從您的程式碼中移除。

```kotlin
// Get API keys from environment variables
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("OPENAI_API_KEY environment variable is not set")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")
```

## 2) 啟動 Bright Data 的 The Web MCP 伺服器

我們將使用 `npx` 啟動 Bright Data 的 MCP 伺服器，並使用您的 API 權杖對其進行配置。該伺服器將透過 Model Context Protocol (模型上下文協定) 公開網路爬蟲功能。

```kotlin
println("Starting Bright Data MCP server...")

// Start the Bright Data MCP server as a separate process
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// Set the API_TOKEN environment variable for the MCP server process
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// Start the process
val process = processBuilder.start()

// Give the process a moment to start
Thread.sleep(2000)
```

## 3) 從 Koog 連接並建立代理程式

我們使用 OpenAI 執行器建構一個 Koog `AIAgent`，並透過 STDIO 傳輸將其工具註冊表連接到 Bright Data MCP 伺服器。然後，我們將探索可用的工具並執行網路爬蟲任務。

```kotlin
println("Creating STDIO transport...")
try {
    // Create the STDIO transport
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("Creating tool registry...")
    
    // Create a tool registry with tools from the Bright Data MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // Print available tools (optional - for debugging)
    println("Available tools from Bright Data MCP server:")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // Create the agent with MCP tools
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
    
    println("
Agent response:")
    println(result)
    
} catch (e: Exception) {
    println("Error: ${e.message}")
    e.printStackTrace()
} finally {
    println("Shutting down MCP server...")
    process.destroyForcibly()
}
```

## 4) 完整的程式碼範例

以下是使用 Bright Data 的 The Web MCP 進行網路爬蟲的完整工作範例：

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * 此函數為程式的進入點，展示了 AI 驅動的網路爬蟲與資料收集。
 *
 * 此函數初始化 Bright Data MCP 伺服器，設定工具整合，
 * 並定義一個 AI 代理程式以與網路爬蟲工具互動。它展示了
 * 以下主要操作：
 *
 * 1. 使用子處理程序啟動 Bright Data MCP 伺服器，並進行適當的 API 權杖配置。
 * 2. 透過 STDIO 傳輸通訊，配置來自 MCP 伺服器的工具註冊表。
 * 3. 建立一個利用 OpenAI GPT-4o 模型並具有網路爬蟲功能的 AI 代理程式。
 * 4. 執行代理程式以執行指定任務（例如，搜尋和分析有關 Koog.ai 的網頁內容）。
 * 5. 執行後透過關閉 MCP 伺服器處理程序來進行清理。
 *
 * 此函數用於教學目的，展示如何將 MCP (Model Context Protocol)
 * 伺服器與 AI 代理程式整合，用於網頁資料收集和分析。
 * 它要求設定 OPENAI_API_KEY 和 BRIGHT_DATA_API_TOKEN 環境變數。
 */
fun main() = runBlocking {
    // Get API keys from environment variables
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("OPENAI_API_KEY environment variable is not set")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("BRIGHT_DATA_API_TOKEN environment variable is not set")

    println("Starting Bright Data MCP server...")

    // Start the Bright Data MCP server as a separate process
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // Set the API_TOKEN environment variable for the MCP server process
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // Start the process
    val process = processBuilder.start()

    // Give the process a moment to start
    Thread.sleep(2000)

    println("Creating STDIO transport...")

    try {
        // Create the STDIO transport
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("Creating tool registry...")
        
        // Create a tool registry with tools from the Bright Data MCP server
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // Print available tools (optional - for debugging)
        println("Available tools from Bright Data MCP server:")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // Create the agent with MCP tools
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "You are a helpful assistant with access to web scraping and data collection tools from Bright Data. You can help users gather information from websites, analyze web data, and provide insights.",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("Please search for Koog.ai and tell me what is it and who invented it")
        
        println("
Agent response:")
        println(result)
        
    } catch (e: Exception) {
        println("Error: ${e.message}")
        e.printStackTrace()
    } finally {
        println("Shutting down MCP server...")
        process.destroyForcibly()
    }
}
```

## 故障排除

-   **連線問題**：如果代理程式無法連接到 MCP 伺服器，請確保已透過 `npx @brightdata/mcp` 正確安裝 Bright Data MCP 套件。
-   **API 權杖錯誤**：請仔細檢查您的 `BRIGHT_DATA_API_TOKEN` 是否有效，並具有網路爬蟲所需的權限。
-   **OpenAI 身份驗證**：驗證您的 `OPENAI_API_KEY` 環境變數是否已正確設定，且 API 金鑰有效。
-   **處理程序逾時**：如果伺服器啟動時間較長，請增加 `Thread.sleep(2000)` 的持續時間。

## 後續步驟

-   **探索不同的查詢**：嘗試爬取不同的網站或搜尋各種主題。
-   **自訂工具整合**：在 Bright Data 的網路爬蟲功能之外，新增您自己的工具。
-   **進階爬取**：利用 Bright Data 的進階功能，例如住宅代理、CAPTCHA 解決方案和 JavaScript 渲染。
-   **資料處理**：將爬取到的資料與其他 Koog 代理程式結合，進行分析和洞察。
-   **生產部署**：將此模式整合到您的應用程式中，實現自動化網頁資料收集。

## 您學到了什麼

本教學展示了如何：
-   設定和配置 Bright Data 的 The Web MCP
-   透過 STDIO 傳輸將 Koog AI 代理程式連接到外部 MCP 伺服器
-   使用自然語言指令執行 AI 驅動的網路爬蟲任務
-   處理適當的資源清理和錯誤管理
-   為生產就緒的網路爬蟲應用程式建構程式碼

Koog 的 AI 代理程式功能與 Bright Data 的企業級網路爬蟲基礎架構相結合，為自動化資料收集和分析工作流程提供了強大的基礎。