# 使用 Bright Data 的 Web MCP 與 Koog 進行網路爬蟲

[:material-github: 在 GitHub 上開啟](https://github.com/JetBrains/koog/blob/develop/examples/bright-data-mcp/){ .md-button .md-button--primary }
[:material-download: 下載 .kt](https://raw.githubusercontent.com/JetBrains/koog/develop/examples/bright-data-mcp/Main.kt){ .md-button }

在本教學中，您將把 Koog 代理連接到 Bright Data 的 Web MCP 伺服器，並讓它執行網路爬蟲和資料收集任務。我們將展示如何透過 Model Context Protocol，利用 Bright Data 強大的網路爬蟲基礎結構來搜尋關於 Koog.ai 的資訊。

我們將保持內容簡單且可重現，重點在於一個極簡但實際的代理 + 工具設定，您可以將其調整以符合自己的網路爬蟲需求。

## 前置需求

- 已匯出為環境變數的 OpenAI API 金鑰：`OPENAI_API_KEY`
- 已匯出為環境變數的 Bright Data API 權杖：`BRIGHT_DATA_API_TOKEN`
- 您的 PATH 中有 Node.js 和 npx 可供使用
- 包含 Koog 相依項的 Kotlin 開發環境

**提示**：Bright Data MCP 伺服器提供存取企業級網路爬蟲工具的權限，這些工具可以處理複雜的網站、驗證碼（CAPTCHA）以及反機器人措施。

## 1) 設定您的 API 憑據

我們從環境變數讀取這兩個 API 金鑰，以確保秘密資訊安全且不呈現在程式碼中。

```kotlin
// 從環境變數獲取 API 金鑰
val openAIApiKey = System.getenv("OPENAI_API_KEY")
    ?: error("未設定 OPENAI_API_KEY 環境變數")
val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
    ?: error("未設定 BRIGHT_DATA_API_TOKEN 環境變數")
```

## 2) 啟動 Bright Data 的 Web MCP 伺服器

我們將使用 `npx` 啟動 Bright Data 的 MCP 伺服器，並使用您的 API 權杖進行配置。該伺服器將透過 Model Context Protocol 公開網路爬蟲功能。

```kotlin
println("正在啟動 Bright Data MCP 伺服器...")

// 將 Bright Data MCP 伺服器作為獨立程序啟動
val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

// 為 MCP 伺服器程序設定 API_TOKEN 環境變數
val environment = processBuilder.environment()
environment["API_TOKEN"] = brightDataToken

// 啟動程序
val process = processBuilder.start()

// 給程序一點啟動時間
Thread.sleep(2000)
```

## 3) 從 Koog 連線並建立代理

我們建立一個帶有 OpenAI 執行器的 Koog `AIAgent`，並透過 STDIO 傳輸將其工具註冊表連接到 Bright Data MCP 伺服器。接著我們將探索可用的工具並執行網路爬蟲任務。

```kotlin
println("正在建立 STDIO 傳輸...")
try {
    // 建立 STDIO 傳輸
    val transport = McpToolRegistryProvider.defaultStdioTransport(process)
    
    println("正在建立工具註冊表...")
    
    // 從 Bright Data MCP 伺服器建立工具註冊表
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "bright-data-client",
        version = "1.0.0"
    )
    
    // 印出可用工具（選用 - 用於偵錯）
    println("來自 Bright Data MCP 伺服器的可用工具：")
    toolRegistry.tools.forEach { tool ->
        println("- ${tool.name}")
    }
    
    // 使用 MCP 工具建立代理
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(openAIApiKey),
        systemPrompt = "您是一個很有幫助的助手，可以存取 Bright Data 的網路爬蟲和資料收集工具。您可以協助使用者從網站收集資訊、分析網路資料並提供見解。",
        llmModel = OpenAIModels.Chat.GPT4o,
        temperature = 0.7,
        toolRegistry = toolRegistry,
        maxIterations = 100
    )
    
    val result = agent.run("請搜尋 Koog.ai 並告訴我它是什麼以及誰發明了它")
    
    println("
代理回應：")
    println(result)
    
} catch (e: Exception) {
    println("錯誤：${e.message}")
    e.printStackTrace()
} finally {
    println("正在關閉 MCP 伺服器...")
    process.destroyForcibly()
}
```

## 4) 完整程式碼範例

這是展示使用 Bright Data 的 Web MCP 進行網路爬蟲的完整工作範例：

```kotlin
package koog

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

/**
 * 程式入口點，展示 AI 驅動的網路爬蟲和資料收集。
 *
 * 此函式會初始化 Bright Data MCP 伺服器、設定工具整合，
 * 並定義一個 AI 代理以與網路爬蟲工具互動。它展示了
 * 以下關鍵操作：
 *
 * 1. 使用子程序啟動 Bright Data MCP 伺服器，並進行正確的 API 權杖配置。
 * 2. 透過 STDIO 傳輸通訊配置來自 MCP 伺服器的工具註冊表。
 * 3. 利用 OpenAI 的 GPT-4o 模型建立具有網路爬蟲能力的 AI 代理。
 * 4. 執行代理以執行特定任務（例如：搜尋並分析關於 Koog.ai 的網路內容）。
 * 5. 執行後關閉 MCP 伺服器程序進行清理。
 *
 * 此函式用於教學目的，展示如何將 MCP（Model Context Protocol）
 * 伺服器與 AI 代理整合，以進行網路資料收集與分析。
 * 需要設定 OPENAI_API_KEY 和 BRIGHT_DATA_API_TOKEN 環境變數。
 */
fun main() = runBlocking {
    // 從環境變數獲取 API 金鑰
    val openAIApiKey = System.getenv("OPENAI_API_KEY")
        ?: error("未設定 OPENAI_API_KEY 環境變數")
    val brightDataToken = System.getenv("BRIGHT_DATA_API_TOKEN")
        ?: error("未設定 BRIGHT_DATA_API_TOKEN 環境變數")

    println("正在啟動 Bright Data MCP 伺服器...")

    // 將 Bright Data MCP 伺服器作為獨立程序啟動
    val processBuilder = ProcessBuilder("npx", "@brightdata/mcp")

    // 為 MCP 伺服器程序設定 API_TOKEN 環境變數
    val environment = processBuilder.environment()
    environment["API_TOKEN"] = brightDataToken

    // 啟動程序
    val process = processBuilder.start()

    // 給程序一點啟動時間
    Thread.sleep(2000)

    println("正在建立 STDIO 傳輸...")

    try {
        // 建立 STDIO 傳輸
        val transport = McpToolRegistryProvider.defaultStdioTransport(process)
        
        println("正在建立工具註冊表...")
        
        // 從 Bright Data MCP 伺服器建立工具註冊表
        val toolRegistry = McpToolRegistryProvider.fromTransport(
            transport = transport,
            name = "bright-data-client",
            version = "1.0.0"
        )
        
        // 印出可用工具（選用 - 用於偵錯）
        println("來自 Bright Data MCP 伺服器的可用工具：")
        toolRegistry.tools.forEach { tool ->
            println("- ${tool.name}")
        }
        
        // 使用 MCP 工具建立代理
        val agent = AIAgent(
            executor = simpleOpenAIExecutor(openAIApiKey),
            systemPrompt = "您是一個很有幫助的助手，可以存取 Bright Data 的網路爬蟲和資料收集工具。您可以協助使用者從網站收集資訊、分析網路資料並提供見解。",
            llmModel = OpenAIModels.Chat.GPT4o,
            temperature = 0.7,
            toolRegistry = toolRegistry,
            maxIterations = 100
        )
        
        val result = agent.run("請搜尋 Koog.ai 並告訴我它是什麼以及誰發明了它")
        
        println("
代理回應：")
        println(result)
        
    } catch (e: Exception) {
        println("錯誤：${e.message}")
        e.printStackTrace()
    } finally {
        println("正在關閉 MCP 伺服器...")
        process.destroyForcibly()
    }
}
```

## 疑難排解

- **連線問題**：如果代理無法連線到 MCP 伺服器，請確保已透過 `npx @brightdata/mcp` 正確安裝 Bright Data MCP 封裝。
- **API 權杖錯誤**：請仔細檢查您的 `BRIGHT_DATA_API_TOKEN` 是否有效，且具備網路爬蟲所需的權限。
- **OpenAI 驗證**：驗證您的 `OPENAI_API_KEY` 環境變數是否正確設定且 API 金鑰有效。
- **程序逾時**：如果伺服器啟動時間較長，請增加 `Thread.sleep(2000)` 的持續時間。

## 後續步驟

- **探索不同的查詢**：嘗試爬取不同的網站或搜尋各種主題。
- **自訂工具整合**：在 Bright Data 的網路爬蟲能力之外，加入您自己的工具。
- **進階爬蟲**：利用 Bright Data 的進階功能，例如住宅代理、驗證碼求解以及 JavaScript 渲染。
- **資料處理**：將爬取的資料與其他 Koog 代理結合以進行分析與洞察。
- **正式環境部署**：將此模式整合到您的應用程式中，以實現自動化網路資料收集。

## 您學到的內容

本教學展示了如何：
- 設定與配置 Bright Data 的 Web MCP
- 透過 STDIO 傳輸將 Koog AI 代理連接到外部 MCP 伺服器
- 使用自然語言指令執行 AI 驅動的網路爬蟲任務
- 處理正確的資源清理與錯誤管理
- 為準備投入正式環境的網路爬蟲應用程式建構程式碼結構

Koog 的 AI 代理能力與 Bright Data 的企業級網路爬蟲基礎結構相結合，為自動化資料收集與分析工作流提供了強大的基礎。