# 模型上下文協議

模型上下文協議 (MCP) 是一個標準化的協議，讓 AI 代理能夠透過一致的介面與外部工具和服務互動。

MCP 將工具和提示暴露為 AI 代理可以呼叫的 API 端點。每個工具都有一個特定的名稱和一個輸入綱要，該綱要使用 JSON 綱要格式描述其輸入和輸出。

Koog 框架提供了與 MCP 伺服器的整合，使您能夠將 MCP 工具整合到您的 Koog 代理中。

要了解更多關於該協議的資訊，請參閱 [Model Context Protocol](https://modelcontextprotocol.io) 文件。

## MCP 伺服器

MCP 伺服器實作模型上下文協議，並為 AI 代理與工具和服務互動提供標準化方式。

您可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到隨時可用的 MCP 伺服器。

MCP 伺服器支援以下傳輸協議與代理通訊：

*   標準輸入/輸出 (stdio) 傳輸協議，用於與作為獨立程序運行的 MCP 伺服器通訊。例如，一個 Docker 容器或一個命令列工具。
*   伺服器推送事件 (SSE) 傳輸協議（可選），用於透過 HTTP 與 MCP 伺服器通訊。

## 與 Koog 整合

Koog 框架透過 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 與 MCP 整合，並在 `agent-mcp` 模組中提供了額外的 API 擴展。

此整合讓 Koog 代理能夠執行以下操作：

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

1.  啟動一個 MCP 伺服器（作為程序、Docker 容器或網路服務）。
2.  建立一個傳輸機制以與伺服器通訊。

MCP 伺服器支援 stdio 和 SSE 傳輸機制與代理通訊，因此您可以使用其中一種方式連接。

#### 使用 stdio 連線

此協議用於 MCP 伺服器作為獨立程序執行時。以下是使用 stdio 傳輸設定 MCP 連線的範例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.defaultStdioTransport
-->
```kotlin
// Start an MCP server (for example, as a process)
val process = ProcessBuilder("path/to/mcp/server").start()

// Create the stdio transport 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### 使用 SSE 連線

此協議用於 MCP 伺服器作為網路服務執行時。以下是使用 SSE 傳輸設定 MCP 連線的範例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. 建立工具註冊表

一旦您建立了 MCP 連線，就可以透過以下其中一種方式，使用 MCP 伺服器中的工具建立工具註冊表：

*   使用提供的傳輸機制進行通訊。例如：

<!--- INCLUDE
import ai.koog.agents.example.exampleModelContextProtocol01.transport
import ai.koog.agents.mcp.McpToolRegistryProvider
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create a tool registry with tools from the MCP server
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    name = "my-client",
    version = "1.0.0"
)
```
<!--- KNIT example-model-context-protocol-03.kt -->

*   使用連接到 MCP 伺服器的現有 MCP 客戶端。例如：
<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import io.modelcontextprotocol.kotlin.sdk.Implementation
import io.modelcontextprotocol.kotlin.sdk.client.Client
import kotlinx.coroutines.runBlocking

val existingMcpClient =  Client(clientInfo = Implementation(name = "mcpClient", version = "dev"))

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create a tool registry from an existing MCP client
val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient
)
```
<!--- KNIT example-model-context-protocol-04.kt -->

### 3. 與您的代理整合

要將 MCP 工具與您的 Koog 代理結合使用，您需要將工具註冊表註冊到代理中：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.singleRunStrategy
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import kotlinx.coroutines.runBlocking
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient

val executor = simpleOllamaAIExecutor()
val strategy = singleRunStrategy()

fun main() {
    runBlocking {
        val toolRegistry = McpToolRegistryProvider.fromClient(
            mcpClient = existingMcpClient
        )
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an agent with the tools
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// Run the agent with a task that uses an MCP tool
val result = agent.run("Use the MCP tool to perform a task")
```
<!--- KNIT example-model-context-protocol-05.kt -->

[//]: # (## Working directly with MCP tools)

[//]: # ()
[//]: # (In addition to running tools through the agent, you can also run them directly:)

[//]: # ()
[//]: # (1. Retrieve a specific tool from the tool registry.)

[//]: # (2. Run the tool with specific arguments using the standard Koog mechanism.)

[//]: # ()
[//]: # (Here is an example:)

[//]: # (<!--- INCLUDE)

[//]: # (import ai.koog.agents.mcp.McpTool)

[//]: # (import kotlinx.serialization.json.JsonPrimitive)

[//]: # (import kotlinx.serialization.json.buildJsonObject)

[//]: # (import ai.koog.agents.mcp.McpToolRegistryProvider)

[//]: # (import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient)

[//]: # ()
[//]: # ()
[//]: # (val toolRegistry = McpToolRegistryProvider.fromClient&#40;)

[//]: # (    mcpClient = existingMcpClient)

[//]: # (&#41;)

[//]: # (-->)

[//]: # (```kotlin)

[//]: # (// Get a tool )

[//]: # (val tool = toolRegistry.getTool&#40;"tool-name"&#41; as McpTool)

[//]: # ()
[//]: # (// Create arguments for the tool)

[//]: # (val args = McpTool.Args&#40;buildJsonObject { )

[//]: # (    put&#40;"parameter1", JsonPrimitive&#40;"value1"&#41;&#41;)

[//]: # (    put&#40;"parameter2", JsonPrimitive&#40;"value2"&#41;&#41;)

[//]: # (}&#41;)

[//]: # ()
[//]: # (// Run the tool with the given arguments)

[//]: # (val toolResult = tool.execute&#40;args&#41;)

[//]: # ()
[//]: # (// Print the result)

[//]: # (println&#40;toolResult&#41;)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-06.kt -->)

[//]: # ()
[//]: # (You can also retrieve all available MCP tools from the registry:)

[//]: # ()
[//]: # (<!--- INCLUDE)

[//]: # (import ai.koog.agents.mcp.McpToolRegistryProvider)

[//]: # (import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient)

[//]: # (import kotlinx.coroutines.runBlocking)

[//]: # ()
[//]: # (fun main&#40;&#41; {)

[//]: # (    runBlocking {)

[//]: # (        val toolRegistry = McpToolRegistryProvider.fromClient&#40;)

[//]: # (            mcpClient = existingMcpClient)

[//]: # (        &#41;)

[//]: # (-->)

[//]: # (<!--- SUFFIX)

[//]: # (    })

[//]: # (})

[//]: # (-->)

[//]: # (```kotlin)

[//]: # (// Get all tools)

[//]: # (val tools = toolRegistry.tools)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-07.kt -->)

## 使用範例

### Google 地圖 MCP 整合

此範例演示如何使用 MCP 連接到 [Google 地圖](https://mcp.so/server/google-maps/modelcontextprotocol) 伺服器以獲取地理資料：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.mcp.defaultStdioTransport
import kotlinx.coroutines.runBlocking

const val googleMapsApiKey = ""
const val openAIApiToken = ""
fun main() {
    runBlocking { 
-->
<!--- SUFFIX
    }
}
-->
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
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCP 整合

此範例演示如何使用 MCP 連接到 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 伺服器以進行網路自動化：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

val openAIApiToken = ""

fun main() {
    runBlocking { 
-->
<!--- SUFFIX
    }
}
-->
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
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")
```
<!--- KNIT example-model-context-protocol-07.kt -->