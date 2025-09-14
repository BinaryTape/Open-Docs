# 模型上下文协议

模型上下文协议 (MCP) 是一种标准化协议，它允许 AI 智能体通过一致的接口与外部工具和服务进行交互。

MCP 将工具和提示作为 API 端点公开，AI 智能体可以调用这些端点。每个工具都有一个特定的名称，以及一个使用 JSON Schema 格式描述其输入和输出的输入模式。

Koog 框架提供了与 MCP 服务器的集成，使你能够将 MCP 工具整合到你的 Koog 智能体中。

关于该协议的更多信息，请参阅 [Model Context Protocol](https://modelcontextprotocol.io) 文档。

## MCP 服务器

MCP 服务器实现了 Model Context Protocol，并为 AI 智能体与工具和服务交互提供了一种标准化方式。

你可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到可直接使用的 MCP 服务器。

MCP 服务器支持以下传输协议与智能体进行通信：

*   标准输入/输出 (stdio) 传输协议，用于与作为独立进程运行的 MCP 服务器通信。例如，Docker 容器或 CLI 工具。
*   服务器发送事件 (SSE) 传输协议（可选），用于通过 HTTP 与 MCP 服务器通信。

## 与 Koog 集成

Koog 框架使用 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 并结合 `agent-mcp` 模块中提供的额外 API 扩展来与 MCP 集成。

此集成允许 Koog 智能体执行以下操作：

*   通过各种传输机制 (stdio, SSE) 连接到 MCP 服务器。
*   从 MCP 服务器检索可用的工具。
*   将 MCP 工具转换为 Koog 工具接口。
*   在工具注册表中注册转换后的工具。
*   使用 LLM 提供的实参调用 MCP 工具。

### 关键组件

以下是 Koog 中 MCP 集成的主要组件：

| 组件                                                                                                                                                             | 描述                                                                                                       |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| [`McpTool`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool/index.html)                                                                           | 作为 Koog 工具接口与 MCP SDK 之间的桥梁。                                                                  |
| [`McpToolDescriptorParser`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-descriptor-parser/index.html)                                         | 将 MCP 工具定义解析为 Koog 工具描述符格式。                                                                |
| [`McpToolRegistryProvider`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-registry-provider/index.html?query=object%20McpToolRegistryProvider) | 创建 MCP 工具注册表，通过各种传输机制 (stdio, SSE) 连接到 MCP 服务器。                                     |

## 入门

### 1. 设置 MCP 连接

要将 MCP 与 Koog 结合使用，你需要设置一个连接：

1.  启动一个 MCP 服务器（作为进程、Docker 容器或 Web 服务）。
2.  创建一个传输机制来与服务器通信。

MCP 服务器支持 stdio 和 SSE 传输机制与智能体通信，因此你可以使用其中之一进行连接。

#### 使用 stdio 连接

当 MCP 服务器作为独立进程运行时，使用此协议。以下是使用 stdio 传输设置 MCP 连接的示例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.defaultStdioTransport
-->
```kotlin
// 启动一个 MCP 服务器（例如，作为进程）
val process = ProcessBuilder("path/to/mcp/server").start()

// 创建 stdio 传输
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### 使用 SSE 连接

当 MCP 服务器作为 Web 服务运行时，使用此协议。以下是使用 SSE 传输设置 MCP 连接的示例：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// 创建 SSE 传输
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. 创建工具注册表

获得 MCP 连接后，你可以通过以下方式之一从 MCP 服务器创建带有工具的工具注册表：

*   使用提供的传输机制进行通信。例如：

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
// 从 MCP 服务器创建带有工具的工具注册表
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    name = "my-client",
    version = "1.0.0"
)
```
<!--- KNIT example-model-context-protocol-03.kt -->

*   使用连接到 MCP 服务器的现有 MCP 客户端。例如：
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
// 从现有 MCP 客户端创建工具注册表
val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient
)
```
<!--- KNIT example-model-context-protocol-04.kt -->

### 3. 与你的智能体集成

要将 MCP 工具与你的 Koog 智能体结合使用，你需要向智能体注册工具注册表：
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
// 创建带有工具的智能体
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// 运行智能体，执行使用 MCP 工具的任务
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

## 使用示例

### Google Maps MCP 集成

此示例演示了如何使用 MCP 连接到 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 服务器以获取地理数据：

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
// 启动带有 Google Maps MCP 服务器的 Docker 容器
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// 从 MCP 服务器创建带有工具的 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)

// 创建并运行智能体
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCP 集成

此示例演示了如何使用 MCP 连接到 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 服务器以实现 Web 自动化：

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

// 从 MCP 服务器创建带有工具的 ToolRegistry
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
)

// 创建并运行智能体
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")
```
<!--- KNIT example-model-context-protocol-07.kt -->