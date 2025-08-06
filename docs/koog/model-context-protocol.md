# 模型上下文协议

模型上下文协议 (MCP) 是一种标准化协议，它允许 AI 智能体通过一致的接口与外部工具和服务进行交互。

MCP 将工具和提示作为 API 端点公开，AI 智能体可以调用这些端点。每个工具都有一个特定的名称，以及一个使用 JSON Schema 格式描述其输入和输出的输入模式。

Koog 框架提供了与 MCP 服务器的集成，使你能够将 MCP 工具整合到你的 Koog 智能体中。

要了解有关该协议的更多信息，请参阅 [Model Context Protocol](https://modelcontextprotocol.io) 文档。

## MCP 服务器

MCP 服务器实现了 Model Context Protocol，并为 AI 智能体与工具和服务交互提供了一种标准化方式。

你可以在 [MCP Marketplace](https://mcp.so/) 或 [MCP DockerHub](https://hub.docker.com/u/mcp) 中找到可直接使用的 MCP 服务器。

MCP 服务器支持以下传输协议与智能体进行通信：

*   标准输入/输出 (stdio) 传输协议，用于与作为独立进程运行的 MCP 服务器通信。例如，Docker 容器或 CLI 工具。
*   服务器发送事件 (SSE) 传输协议（可选），用于通过 HTTP 与 MCP 服务器通信。

## 与 Koog 集成

Koog 框架使用 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 并结合 `agent-mcp` 模块中提供的额外 API 扩展来与 MCP 集成。

此集成允许 Koog 智能体执行以下操作：

*   通过各种传输机制（stdio、SSE）连接到 MCP 服务器。
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
| [`McpToolRegistryProvider`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-registry-provider/index.html?query=object%20McpToolRegistryProvider) | 创建 MCP 工具注册表，通过各种传输机制（stdio、SSE）连接到 MCP 服务器。                                     |

## 入门

### 1. 设置 MCP 连接

要将 MCP 与 Koog 结合使用，你需要设置一个连接：

1.  启动一个 MCP 服务器（作为进程、Docker 容器或 Web 服务）。
2.  创建一个传输机制来与服务器通信。

MCP 服务器支持 stdio 和 SSE 传输机制与智能体通信，因此你可以使用其中之一进行连接。

#### 使用 stdio 连接

当 MCP 服务器作为独立进程运行时，使用此协议。以下是使用 stdio 传输设置 MCP 连接的示例：

```kotlin
// Start an MCP server (for example, as a process)
val process = ProcessBuilder("path/to/mcp/server").start()

// Create the stdio transport 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```

#### 使用 SSE 连接

当 MCP 服务器作为 Web 服务运行时，使用此协议。以下是使用 SSE 传输设置 MCP 连接的示例：

```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```

### 2. 创建工具注册表

获得 MCP 连接后，你可以通过以下方式之一从 MCP 服务器创建带有工具的工具注册表：

*   使用提供的传输机制进行通信。例如：

    ```kotlin
    // Create a tool registry with tools from the MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "my-client",
        version = "1.0.0"
    )
    ```

*   使用连接到 MCP 服务器的现有 MCP 客户端。例如：

    ```kotlin
    // Create a tool registry from an existing MCP client
    val toolRegistry = McpToolRegistryProvider.fromClient(
        mcpClient = existingMcpClient
    )
    ```

### 3. 与你的智能体集成

要将 MCP 工具与你的 Koog 智能体结合使用，你需要向智能体注册工具注册表：

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

除了通过智能体运行工具之外，你还可以直接运行它们：

1.  从工具注册表中检索特定工具。
2.  使用标准 Koog 机制以特定实参运行该工具。

以下是一个示例：

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

你还可以从注册表中检索所有可用的 MCP 工具：

```kotlin
// Get all tools
val tools = toolRegistry.tools
```

## 使用示例

### Google Maps MCP 集成

此示例演示了如何使用 MCP 连接到 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 服务器以获取地理数据：

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

### Playwright MCP 集成

此示例演示了如何使用 MCP 连接到 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 服务器以实现 Web 自动化：

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