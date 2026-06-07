---
status: beta
---

# Model Context Protocol

--8<-- "versioning-snippets.md:beta"

Model Context Protocol (MCP) 是一种标准化协议，允许 AI 代理通过统一接口与外部工具和服务进行交互。

MCP 将工具和提示公开为 AI 代理可以调用的 API 端点。每个工具都有一个特定的名称和一个输入架构，该架构使用 JSON Schema 格式描述其输入和输出。

Koog 框架提供了与 MCP 服务器的集成，使您能够将 MCP 工具合并到您的 Koog 代理中。

要了解有关该协议的更多信息，请参阅 [Model Context Protocol](https://modelcontextprotocol.io) 文档。

## MCP 服务器

MCP 服务器实现了 Model Context Protocol，并为 AI 代理与工具和服务进行交互提供了一种标准化的方式。

您可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到开箱即用的 MCP 服务器。

MCP 服务器支持以下传输协议与代理通信：

* 标准输入/输出 (stdio) 传输协议：用于与作为独立进程运行的 MCP 服务器进行通信。例如，Docker 容器或 CLI 工具。
* 服务器发送事件 (SSE) 传输协议（可选）：用于通过 HTTP 与 MCP 服务器进行通信。

## 与 Koog 集成

Koog 框架使用 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 与 MCP 集成，并在 `agent-mcp` 模块中提供了额外的 API 扩展。

此集成允许 Koog 代理执行以下操作：

* 通过各种传输机制（stdio、SSE）连接到 MCP 服务器。
* 从 MCP 服务器检索可用工具。
* 将 MCP 工具转换为 Koog 工具接口。
* 在工具注册表中注册转换后的工具。
* 使用 LLM 提供的实参调用 MCP 工具。

### 核心组件

以下是 Koog 中 MCP 集成的主要组件：

| 组件                                                                                                                                                           | 描述                                                                                                |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`McpTool`](api:agents-mcp::ai.koog.agents.mcp.McpTool)                                                                          | 作为 Koog 工具接口与 MCP SDK 之间的桥梁。                  |                                                                              |
| [`McpToolDescriptorParser`](api:agents-mcp::ai.koog.agents.mcp.McpToolDescriptorParser)                                        | 将 MCP 工具定义解析为 Koog 工具描述符格式。                                          |
| [`McpToolRegistryProvider`](api:agents-mcp::ai.koog.agents.mcp.McpToolRegistryProvider) | 创建工具注册表，通过各种传输机制（stdio、SSE）连接到 MCP 服务器。 |

## 快速入门

### 1. 设置 MCP 连接

要在 Koog 中使用 MCP，您需要设置一个连接：

1. 启动一个 MCP 服务器（作为进程、Docker 容器或 Web 服务）。
2. 创建一个传输机制以与服务器通信。

MCP 服务器支持 stdio 和 SSE 传输机制与代理通信，因此您可以使用其中之一进行连接。

#### 通过 stdio 连接

当 MCP 服务器作为独立进程运行时使用此协议。以下是使用 stdio 传输设置 MCP 连接的示例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.defaultStdioTransport
-->
```kotlin
// 启动一个 MCP 服务器（例如，作为一个进程）
val process = ProcessBuilder("path/to/mcp/server").start()

// 创建 stdio 传输 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### 通过 SSE 连接

当 MCP 服务器作为 Web 服务运行时使用此协议。以下是使用 SSE 传输设置 MCP 连接的示例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// 创建 SSE 传输
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. 创建工具注册表

建立 MCP 连接后，您可以通过以下方式之一使用来自 MCP 服务器的工具创建工具注册表：

* 使用提供的传输机制进行通信。例如：

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
// 使用来自 MCP 服务器的工具创建工具注册表
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    serverInfo = McpServerInfo(url = "http://localhost:8931", command = "path/to/mcp/server"),
    name = "my-client",
    version = "1.0.0"
)
```
<!--- KNIT example-model-context-protocol-03.kt -->

* 使用连接到 MCP 服务器的 MCP 客户端。例如：
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
// 从现有的 MCP 客户端创建工具注册表
val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient,
    serverInfo = McpServerInfo(url = "http://localhost:8931")
)
```
<!--- KNIT example-model-context-protocol-04.kt -->

### 3. 与您的代理集成

要在 Koog 代理中使用 MCP 工具，您需要在代理中注册该工具注册表：
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
// 创建包含工具的代理
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// 运行代理以执行使用 MCP 工具的任务
val result = agent.run("Use the MCP tool to perform a task")
```
<!--- KNIT example-model-context-protocol-05.kt -->

[//]: # (## 直接使用 MCP 工具)

[//]: # ()
[//]: # (除了通过代理运行工具外，您还可以直接运行它们：)

[//]: # ()
[//]: # (1. 从工具注册表中检索特定工具。)

[//]: # (2. 使用标准 Koog 机制以特定实参运行该工具。)

[//]: # ()
[//]: # (示例如下：)

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

[//]: # (// 获取工具 )

[//]: # (val tool = toolRegistry.getTool&#40;"tool-name"&#41; as McpTool)

[//]: # ()
[//]: # (// 为工具创建实参)

[//]: # (val args = McpTool.Args&#40;buildJsonObject { )

[//]: # (    put&#40;"parameter1", JsonPrimitive&#40;"value1"&#41;&#41;)

[//]: # (    put&#40;"parameter2", JsonPrimitive&#40;"value2"&#41;&#41;)

[//]: # (}&#41;)

[//]: # ()
[//]: # (// 使用给定实参运行工具)

[//]: # (val toolResult = tool.execute&#40;args&#41;)

[//]: # ()
[//]: # (// 打印结果)

[//]: # (println&#40;toolResult&#41;)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-06.kt -->)

[//]: # ()
[//]: # (您还可以从注册表中检索所有可用的 MCP 工具：)

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

[//]: # (// 获取所有工具)

[//]: # (val tools = toolRegistry.tools)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-07.kt -->)

## 使用示例

### Google Maps MCP 集成

此示例演示如何使用 MCP 连接到 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 服务器以获取地理数据：

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
// 启动包含 Google Maps MCP 服务器的 Docker 容器
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// 使用来自 MCP 服务器的工具创建 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromProcess(process = process)

// 创建并运行代理
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCP 集成

此示例演示如何使用 MCP 连接到 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 服务器进行 Web 自动化：

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
// 启动 Playwright MCP 服务器
val process = ProcessBuilder(
    "npx", "@playwright/mcp@latest", "--port", "8931"
).start()

// 使用来自 MCP 服务器的工具创建 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:8931")

// 创建并运行代理
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")
```
<!--- KNIT example-model-context-protocol-07.kt -->