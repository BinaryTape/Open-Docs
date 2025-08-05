# Model Context Protocol

Model Context Protocol (MCP) は、AIエージェントが外部ツールやサービスと一貫したインターフェースを通じて連携できるようにする、標準化されたプロトコルです。

MCPは、AIエージェントが呼び出すことができるAPIエンドポイントとしてツールとプロンプトを公開します。各ツールには特定の名前と、JSON Schema形式を使用してその入力と出力を記述する入力スキーマがあります。

KoogフレームワークはMCPサーバーとの統合を提供し、MCPツールをKoogエージェントに組み込むことを可能にします。

プロトコルの詳細については、[Model Context Protocol](https://modelcontextprotocol.io) のドキュメントを参照してください。

## MCPサーバー

MCPサーバーはModel Context Protocolを実装し、AIエージェントがツールやサービスと連携するための標準化された方法を提供します。

すぐに使えるMCPサーバーは、[MCP Marketplace](https://mcp.so/) または [MCP DockerHub](https://hub.docker.com/u/mcp) で見つけることができます。

MCPサーバーは、エージェントとの通信に以下のトランスポートプロトコルをサポートしています。

*   標準入出力 (stdio) トランスポートプロトコル：別個のプロセスとして実行されるMCPサーバーとの通信に使用されます。例えば、DockerコンテナやCLIツールなど。
*   サーバー送信イベント (SSE) トランスポートプロトコル (オプション)：HTTP経由でMCPサーバーと通信するために使用されます。

## Koogとの統合

Koogフレームワークは、`agent-mcp`モジュールで提供される追加のAPI拡張とともに、[MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) を使用してMCPと統合します。

この統合により、Koogエージェントは以下の操作を実行できます。

*   さまざまなトランスポートメカニズム (stdio、SSE) を介してMCPサーバーに接続する。
*   MCPサーバーから利用可能なツールを取得する。
*   MCPツールをKoogツールインターフェースに変換する。
*   変換されたツールをツールレジストリに登録する。
*   LLMによって提供される引数でMCPツールを呼び出す。

### 主要なコンポーネント

KoogにおけるMCP統合の主要なコンポーネントは以下の通りです。

| コンポーネント                                                                                                                                                           | 説明                                                                                                |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`McpTool`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool/index.html)                                                                          | KoogツールインターフェースとMCP SDK間のブリッジとして機能します。                  |
| [`McpToolDescriptorParser`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-descriptor-parser/index.html)                                        | MCPツール定義をKoogツールディスクリプタ形式に解析します。                                          |
| [`McpToolRegistryProvider`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-registry-provider/index.html?query=object%20McpToolRegistryProvider) | さまざまなトランスポートメカニズム (stdio、SSE) を介してMCPサーバーに接続するMCPツールレジストリを作成します。 |

## はじめに

### 1. MCP接続をセットアップする

KoogでMCPを使用するには、接続をセットアップする必要があります。

1.  MCPサーバーを起動します (プロセス、Dockerコンテナ、またはウェブサービスとして)。
2.  サーバーと通信するためのトランスポートメカニズムを作成します。

MCPサーバーはエージェントと通信するためにstdioとSSEトランスポートメカニズムをサポートしているため、いずれかを使用して接続できます。

#### stdioで接続する

このプロトコルは、MCPサーバーが別個のプロセスとして実行される場合に使用されます。stdioトランスポートを使用してMCP接続をセットアップする例を以下に示します。

```kotlin
// Start an MCP server (for example, as a process)
val process = ProcessBuilder("path/to/mcp/server").start()

// Create the stdio transport 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```

#### SSEで接続する

このプロトコルは、MCPサーバーがウェブサービスとして実行される場合に使用されます。SSEトランスポートを使用してMCP接続をセットアップする例を以下に示します。

```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```

### 2. ツールレジストリを作成する

MCP接続が確立されたら、以下のいずれかの方法でMCPサーバーのツールを使用してツールレジストリを作成できます。

*   通信のために提供されたトランスポートメカニズムを使用します。例：

    ```kotlin
    // Create a tool registry with tools from the MCP server
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "my-client",
        version = "1.0.0"
    )
    ```

*   MCPサーバーに接続されたMCPクライアントを使用します。例：

    ```kotlin
    // Create a tool registry from an existing MCP client
    val toolRegistry = McpToolRegistryProvider.fromClient(
        mcpClient = existingMcpClient
    )
    ```

### 3. エージェントと統合する

KoogエージェントでMCPツールを使用するには、ツールレジストリをエージェントに登録する必要があります。

```kotlin
// Create an agent with the tools
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)

// Run the agent with a task that uses an MCP tool
val result = agent.run("MCPツールを使用してタスクを実行")
```

## MCPツールを直接操作する

エージェントを介してツールを実行するだけでなく、直接実行することもできます。

1.  ツールレジストリから特定のツールを取得します。
2.  標準のKoogメカニズムを使用して、特定の引数でツールを実行します。

以下に例を示します。

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

利用可能なすべてのMCPツールをレジストリから取得することもできます。

```kotlin
// Get all tools
val tools = toolRegistry.tools
```

## 使用例

### Google Maps MCP統合

この例は、MCPを使用して地理データのために[Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) サーバーに接続する方法を示しています。

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
agent.run("ドイツ、ミュンヘンのJetbrains Officeの標高を取得できますか？")
```

### Playwright MCP統合

この例は、MCPを使用してウェブ自動化のために[Playwright](https://mcp.so/server/playwright-mcp/microsoft) サーバーに接続する方法を示しています。

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
agent.run("ブラウザを開き、jetbrains.comに移動し、すべてのCookieを受け入れ、ツールバーのAIをクリック")
```