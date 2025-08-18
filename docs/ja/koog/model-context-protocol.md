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

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// Start an MCP server (for example, as a process)
val process = ProcessBuilder("path/to/mcp/server").start()

// Create the stdio transport 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### SSEで接続する

このプロトコルは、MCPサーバーがウェブサービスとして実行される場合に使用されます。SSEトランスポートを使用してMCP接続をセットアップする例を以下に示します。

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. ツールレジストリを作成する

MCP接続が確立されたら、以下のいずれかの方法でMCPサーバーのツールを使用してツールレジストリを作成できます。

*   通信のために提供されたトランスポートメカニズムを使用します。例：

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

*   MCPサーバーに接続されたMCPクライアントを使用します。例：
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

### 3. エージェントと統合する

KoogエージェントでMCPツールを使用するには、ツールレジストリをエージェントに登録する必要があります。
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
    executor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// Run the agent with a task that uses an MCP tool
val result = agent.run("MCPツールを使用してタスクを実行")
```
<!--- KNIT example-model-context-protocol-05.kt -->

## MCPツールを直接操作する

エージェントを介してツールを実行するだけでなく、直接実行することもできます。

1.  ツールレジストリから特定のツールを取得します。
2.  標準のKoogメカニズムを使用して、特定の引数でツールを実行します。

以下に例を示します。

<!--- INCLUDE
import ai.koog.agents.mcp.McpTool
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient

val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient
)
-->
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
<!--- KNIT example-model-context-protocol-06.kt -->

利用可能なすべてのMCPツールをレジストリから取得することもできます。

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.example.exampleModelContextProtocol04.existingMcpClient
import kotlinx.coroutines.runBlocking

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
// Get all tools
val tools = toolRegistry.tools
```
<!--- KNIT example-model-context-protocol-07.kt -->

## 使用例

### Google Maps MCP統合

この例は、MCPを使用して地理データのために[Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) サーバーに接続する方法を示しています。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.mcp.McpToolRegistryProvider
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
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCP統合

この例は、MCPを使用してウェブ自動化のために[Playwright](https://mcp.so/server/playwright-mcp/microsoft) サーバーに接続する方法を示しています。

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
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("ブラウザを開き、jetbrains.comに移動し、すべてのCookieを受け入れ、ツールバーのAIをクリック")
```
<!--- KNIT example-model-context-protocol-07.kt -->