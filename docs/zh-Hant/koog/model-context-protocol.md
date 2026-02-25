# Model Context Protocol

Model Context Protocol (MCP) 是一種標準化協定，讓 AI 代理（AI agents）能透過一致的介面與外部工具和服務進行互動。

MCP 將工具和提示（prompts）公開為 AI 代理可以呼叫的 API 端點。每個工具都有特定的名稱，並有一個使用 JSON Schema 格式描述其輸入和輸出的輸入結構（input schema）。

Koog 架構提供了與 MCP 伺服器的整合，使您能夠將 MCP 工具納入您的 Koog 代理中。

若要進一步了解該協定，請參閱 [Model Context Protocol](https://modelcontextprotocol.io) 文件。

## MCP 伺服器

MCP 伺服器實作了 Model Context Protocol，並為 AI 代理與工具和服務的互動提供標準化方式。

您可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到現成可用的 MCP 伺服器。

MCP 伺服器支援以下傳輸協定來與代理通訊：

*   **標準輸入/輸出 (stdio)** 傳輸協定：用於與作為獨立程序（process）執行的 MCP 伺服器通訊。例如，Docker 容器或命令列工具。
*   **伺服器傳送事件 (SSE)** 傳輸協定（選用）：用於透過 HTTP 與 MCP 伺服器通訊。

## 與 Koog 整合

Koog 架構使用 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 並搭配 `agent-mcp` 模組中提供的額外 API 擴充功能來與 MCP 整合。

此整合讓 Koog 代理可以執行以下操作：

*   透過各種傳輸機制（stdio、SSE）連線至 MCP 伺服器。
*   從 MCP 伺服器獲取可用的工具。
*   將 MCP 工具轉換為 Koog 工具介面。
*   將轉換後的工具註冊到工具註冊表（tool registry）中。
*   使用 LLM 提供的引數（arguments）呼叫 MCP 工具。

### 核心組件

以下是 Koog 中 MCP 整合的主要組件：

| 組件                                                                                                                                                           | 說明                                                                                                |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`McpTool`](api:agents-mcp::ai.koog.agents.mcp.McpTool)                                                                          | 作為 Koog 工具介面與 MCP SDK 之間的橋樑。                  |                                                                              |
| [`McpToolDescriptorParser`](api:agents-mcp::ai.koog.agents.mcp.McpToolDescriptorParser)                                        | 將 MCP 工具定義剖析為 Koog 工具描述符格式。                                          |
| [`McpToolRegistryProvider`](api:agents-mcp::ai.koog.agents.mcp.McpToolRegistryProvider) | 建立 MCP 工具註冊表，透過各種傳輸機制（stdio、SSE）連線至 MCP 伺服器。 |

## 快速入門

### 1. 設定 MCP 連線

要在 Koog 中使用 MCP，您需要設定一個連線：

1. 啟動一個 MCP 伺服器（作為程序、Docker 容器或 Web 服務）。
2. 建立一個傳輸機制與伺服器通訊。 

MCP 伺服器支援 stdio 和 SSE 傳輸機制來與代理通訊，因此您可以選擇其中之一進行連線。

#### 透過 stdio 連線

當 MCP 伺服器作為獨立程序執行時使用此協定。以下是使用 stdio 傳輸設定 MCP 連線的範例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.defaultStdioTransport
-->
```kotlin
// 啟動一個 MCP 伺服器（例如，作為一個程序）
val process = ProcessBuilder("path/to/mcp/server").start()

// 建立 stdio 傳輸 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### 透過 SSE 連線

當 MCP 伺服器作為 Web 服務執行時使用此協定。以下是使用 SSE 傳輸設定 MCP 連線的範例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// 建立 SSE 傳輸
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. 建立工具註冊表

建立 MCP 連線後，您可以透過以下方式之一，使用來自 MCP 伺服器的工具建立工具註冊表：

*   使用提供的傳輸機制進行通訊。例如：

<!--- INCLUDE
import ai.koog.agents.example.exampleModelContextProtocol01.transport
import ai.koog.agents.mcp.metadata.McpServerInfo
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
// 使用來自 MCP 伺服器的工具建立工具註冊表
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    serverInfo = McpServerInfo(url = "http://localhost:8931", command = "path/to/mcp/server"),
    name = "my-client",
    version = "1.0.0"
)
```
<!--- KNIT example-model-context-protocol-03.kt -->

*   使用已連線至 MCP 伺服器的 MCP 用戶端。例如：
<!--- INCLUDE
import ai.koog.agents.mcp.metadata.McpServerInfo
import ai.koog.agents.mcp.McpToolRegistryProvider
import io.modelcontextprotocol.kotlin.sdk.types.Implementation
import io.modelcontextprotocol.kotlin.sdk.client.Client
import kotlinx.coroutines.runBlocking

val existingMcpClient = Client(clientInfo = Implementation(name = "mcpClient", version = "dev"))

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 從現有的 MCP 用戶端建立工具註冊表
val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient,
    serverInfo = McpServerInfo(url = "http://localhost:8931")
)
```
<!--- KNIT example-model-context-protocol-04.kt -->

### 3. 與您的代理整合

要在您的 Koog 代理中使用 MCP 工具，您需要向代理註冊該工具註冊表：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.singleRunStrategy
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import kotlinx.coroutines.runBlocking
import ai.koog.agents.mcp.metadata.McpServerInfo
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient

val executor = simpleOllamaAIExecutor()
val strategy = singleRunStrategy()

fun main() {
    runBlocking {
        val toolRegistry = McpToolRegistryProvider.fromClient(
            mcpClient = existingMcpClient,
            serverInfo = McpServerInfo(url = "http://localhost:8931")
        )
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 建立包含工具的代理
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// 執行執行任務並使用 MCP 工具的代理
val result = agent.run("Use the MCP tool to perform a task")
```
<!--- KNIT example-model-context-protocol-05.kt -->

[//]: # (## 直接操作 MCP 工具)

[//]: # ()
[//]: # (除了透過代理執行工具外，您也可以直接執行它們：)

[//]: # ()
[//]: # (1. 從工具註冊表中獲取特定工具。)

[//]: # (2. 使用標準 Koog 機制，搭配特定引數執行工具。)

[//]: # ()
[//]: # (範例如下：)

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

[//]: # (// 獲取工具 )

[//]: # (val tool = toolRegistry.getTool&#40;"tool-name"&#41; as McpTool)

[//]: # ()
[//]: # (// 為工具建立引數)

[//]: # (val args = McpTool.Args&#40;buildJsonObject { )

[//]: # (    put&#40;"parameter1", JsonPrimitive&#40;"value1"&#41;&#41;)

[//]: # (    put&#40;"parameter2", JsonPrimitive&#40;"value2"&#41;&#41;)

[//]: # (}&#41;)

[//]: # ()
[//]: # (// 使用指定的引數執行工具)

[//]: # (val toolResult = tool.execute&#40;args&#41;)

[//]: # ()
[//]: # (// 印出結果)

[//]: # (println&#40;toolResult&#41;)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-06.kt -->)

[//]: # ()
[//]: # (您也可以從註冊表中獲取所有可用的 MCP 工具：)

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

[//]: # (// 獲取所有工具)

[//]: # (val tools = toolRegistry.tools)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-07.kt -->)

## 使用範例

### Google Maps MCP 整合

此範例展示如何使用 MCP 連線至 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 伺服器以獲取地理資料：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.fromProcess
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
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
// 啟動帶有 Google Maps MCP 伺服器的 Docker 容器
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// 建立帶有來自 MCP 伺服器工具的 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromProcess(process = process)

// 建立並執行代理
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCP 整合

此範例展示如何使用 MCP 連線至 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 伺服器進行網頁自動化：

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
// 啟動 Playwright MCP 伺服器
val process = ProcessBuilder(
    "npx", "@playwright/mcp@latest", "--port", "8931"
).start()

// 建立帶有來自 MCP 伺服器工具的 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:8931")

// 建立並執行代理
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")
```
<!--- KNIT example-model-context-protocol-07.kt -->