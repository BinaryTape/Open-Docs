# 模型上下文協議

模型上下文協議 (MCP) 是一個標準化協議，讓 AI 代理能夠透過一致的介面與外部工具和服務互動。

MCP 將工具和提示暴露為 AI 代理可以呼叫的 API 端點。每個工具都有一個特定的名稱和一個輸入綱要，該綱要使用 JSON 綱要格式描述其輸入和輸出。

Koog 框架提供了與 MCP 伺服器的整合，使您能夠將 MCP 工具整合到您的 Koog 代理中。

要了解更多關於該協議的資訊，請參閱 [Model Context Protocol](https://modelcontextprotocol.io) 文件。

## MCP 伺服器

MCP 伺服器實作模型上下文協議，並為 AI 代理與工具和服務互動提供標準化方式。

您可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到隨時可用的 MCP 伺服器。

MCP 伺服器支援以下傳輸協議與代理通訊：

*   標準輸入/輸出 (stdio) 傳輸協議，用於與作為獨立程序運行的 MCP 伺服器通訊。例如，Docker 容器或命令列工具。
*   伺服器推送事件 (SSE) 傳輸協議（可選），用於透過 HTTP 與 MCP 伺服器通訊。

## 與 Koog 整合

Koog 框架透過 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 與 MCP 整合，並在 `agent-mcp` 模組中提供了額外的 API 擴展。

此整合使 Koog 代理能夠執行以下操作：

*   透過各種傳輸機制 (stdio, SSE) 連接到 MCP 伺服器。
*   從 MCP 伺服器中檢索可用工具。
*   將 MCP 工具轉換為 Koog 工具介面。
*   在工具註冊表中註冊轉換後的工具。
*   使用 LLM 提供的參數呼叫 MCP 工具。

### 主要元件

以下是 Koog 中 MCP 整合的主要元件：

| 元件                                                                                                                                                              | 描述                                                                                                   |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------|
| [`McpTool`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool/index.html)                                                                          | 作為 Koog 工具介面與 MCP SDK 之間的橋樑。                                                                  |
| [`McpToolDescriptorParser`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-descriptor-parser/index.html)                                        | 將 MCP 工具定義解析為 Koog 工具描述符格式。                                                              |
| [`McpToolRegistryProvider`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-registry-provider/index.html?query=object%20McpToolRegistryProvider) | 建立透過各種傳輸機制 (stdio, SSE) 連接到 MCP 伺服器的 MCP 工具註冊表。                                 |

## 開始使用

### 1. 設定 MCP 連線

要將 MCP 與 Koog 結合使用，您需要設定連線：

1.  啟動 MCP 伺服器（作為程序、Docker 容器或網路服務）。
2.  建立與伺服器通訊的傳輸機制。

MCP 伺服器支援 stdio 和 SSE 傳輸機制與代理通訊，因此您可以使用其中一種方式連接。

#### 使用 stdio 連線

此協議用於 MCP 伺服器作為獨立程序執行時。以下是使用 stdio 傳輸設定 MCP 連線的範例：

```kotlin
// Start an MCP server (for example, as a process)
val process = ProcessBuilder("path/to/mcp/server").start()

// Create the stdio transport 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```

#### 使用 SSE 連線

此協議用於 MCP 伺服器作為網路服務執行時。以下是使用 SSE 傳輸設定 MCP 連線的範例：

```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```

### 2. 建立工具註冊表

一旦您建立了 MCP 連線，就可以透過以下其中一種方式，使用 MCP 伺服器中的工具建立工具註冊表：

*   使用提供的傳輸機制進行通訊。例如：

    ```kotlin
    // Create a tool registry with tools from the MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "my-client",
        version = "1.0.0"
    )
    ```

*   使用連接到 MCP 伺服器的現有 MCP 客戶端。例如：

    ```kotlin
    // Create a tool registry from an existing MCP client
    val toolRegistry = McpToolRegistryProvider.fromClient(
        mcpClient = existingMcpClient
    )
    ```

### 3. 與您的代理整合

要將 MCP 工具與您的 Koog 代理結合使用，您需要將工具註冊表註冊到代理中：

```kotlin
// Create an agent with the tools
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)

// Run the agent with a task that uses an MCP tool
val result = agent.run("Use the MCP tool to perform a task")
```

## 直接使用 MCP 工具

除了透過代理執行工具外，您也可以直接執行它們：

1.  從工具註冊表中檢索特定工具。
2.  使用標準 Koog 機制和特定參數執行工具。

以下是一個範例：

```kotlin
// Get a tool 
val tool = toolRegistry.getTool("tool-name") as McpTool

// Create arguments for the tool
val args = McpTool.Args(buildJsonObject { 
    put("parameter1", "value1")
    put("parameter2", "value2")
})

// Run the tool with the given arguments
val toolResult = tool.execute(args)

// Print the result
println(toolResult)
```

您也可以從註冊表中檢索所有可用的 MCP 工具：

```kotlin
// Get all tools
val tools = toolRegistry.tools
```

## 使用範例

### Google 地圖 MCP 整合

此範例演示如何使用 MCP 連接到 [Google 地圖](https://mcp.so/server/google-maps/modelcontextprotocol) 伺服器以獲取地理資料：

```kotlin
// Start the Docker container with the Google Maps MCP server
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// Create the ToolRegistry with tools from the MCP server
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)

// Create and run the agent
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```

### Playwright MCP 整合

此範例演示如何使用 MCP 連接到 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 伺服器以進行網路自動化：

```kotlin
// Start the Playwright MCP server
val process = ProcessBuilder(
    "npx", "@playwright/mcp@latest", "--port", "8931"
).start()

// Create the ToolRegistry with tools from the MCP server
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
)

// Create and run the agent
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")