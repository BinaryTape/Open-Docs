# Model Context Protocol

Model Context Protocol (MCP) は、AIエージェントが一定のインターフェースを通じて外部のツールやサービスとやり取りできるようにするための標準化されたプロトコルです。

MCPは、AIエージェントが呼び出し可能なAPIエンドポイントとして、ツールやプロンプトを公開します。各ツールには特定の名前があり、JSON Schema形式を使用して入出力を記述する入力スキーマ（input schema）を持っています。

KoogフレームワークはMCPサーバーとの統合を提供しており、MCPツールをKoogエージェントに組み込むことができます。

プロトコルの詳細については、[Model Context Protocol](https://modelcontextprotocol.io) のドキュメントを参照してください。

## MCPサーバー

MCPサーバーはModel Context Protocolを実装し、AIエージェントがツールやサービスとやり取りするための標準化された方法を提供します。

すぐに利用可能なMCPサーバーは、[MCP Marketplace](https://mcp.so/) または [MCP DockerHub](https://hub.docker.com/u/mcp) で見つけることができます。

MCPサーバーは、エージェントと通信するために以下のトランスポートプロトコルをサポートしています：

* **標準入出力 (stdio) トランスポートプロトコル**: 別個のプロセスとして実行されているMCPサーバー（例：DockerコンテナやCLIツール）と通信するために使用されます。
* **Server-sent events (SSE) トランスポートプロトコル (オプション)**: HTTP経由でMCPサーバーと通信するために使用されます。

## Koogとの統合

Koogフレームワークは、`agent-mcp` モジュールで提供される追加のAPI拡張機能とともに、[MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk) を使用してMCPと統合します。

この統合により、Koogエージェントは以下を行うことができます：

* 様々なトランスポートメカニズム（stdio、SSE）を通じてMCPサーバーに接続する。
* MCPサーバーから利用可能なツールを取得する。
* MCPツールをKoogのツールインターフェースに変換する。
* 変換されたツールをツールレジストリに登録する。
* LLMから提供された引数を使用してMCPツールを呼び出す。

### 主要コンポーネント

KoogにおけるMCP統合の主なコンポーネントは以下の通りです：

| コンポーネント | 説明 |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`McpTool`](api:agents-mcp::ai.koog.agents.mcp.McpTool) | KoogのツールインターフェースとMCP SDKの間のブリッジとして機能します。 |
| [`McpToolDescriptorParser`](api:agents-mcp::ai.koog.agents.mcp.McpToolDescriptorParser) | MCPツールの定義をKoogのツール記述子フォーマットにパースします。 |
| [`McpToolRegistryProvider`](api:agents-mcp::ai.koog.agents.mcp.McpToolRegistryProvider) | 様々なトランスポートメカニズム（stdio、SSE）を通じてMCPサーバーに接続するMCPツールレジストリを作成します。 |

## はじめに

### 1. MCP接続をセットアップする

KoogでMCPを使用するには、接続をセットアップする必要があります：

1. MCPサーバーを起動します（プロセス、Dockerコンテナ、またはWebサービスとして）。
2. サーバーと通信するためのトランスポートメカニズムを作成します。

MCPサーバーは、エージェントと通信するためにstdioおよびSSEトランスポートメカニズムをサポートしているため、そのいずれかを使用して接続できます。

#### stdioによる接続

このプロトコルは、MCPサーバーが別個のプロセスとして実行されている場合に使用されます。以下は、stdioトランスポートを使用してMCP接続をセットアップする例です：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import ai.koog.agents.mcp.defaultStdioTransport
-->
```kotlin
// MCPサーバーを起動する（例：プロセスとして）
val process = ProcessBuilder("path/to/mcp/server").start()

// stdioトランスポートを作成する
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```
<!--- KNIT example-model-context-protocol-01.kt -->

#### SSEによる接続

このプロトコルは、MCPサーバーがWebサービスとして実行されている場合に使用されます。以下は、SSEトランスポートを使用してMCP接続をセットアップする例です：

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// SSEトランスポートを作成する
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. ツールレジストリを作成する

MCP接続ができたら、以下のいずれかの方法でMCPサーバーのツールを含むツールレジストリを作成できます：

* 通信用のトランスポートメカニズムを使用する場合。例：

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
// MCPサーバーのツールを使用してツールレジストリを作成する
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = transport,
    serverInfo = McpServerInfo(url = "http://localhost:8931", command = "path/to/mcp/server"),
    name = "my-client",
    version = "1.0.0"
)
```
<!--- KNIT example-model-context-protocol-03.kt -->

* MCPサーバーに接続されたMCPクライアントを使用する場合。例：
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
// 既存のMCPクライアントからツールレジストリを作成する
val toolRegistry = McpToolRegistryProvider.fromClient(
    mcpClient = existingMcpClient,
    serverInfo = McpServerInfo(url = "http://localhost:8931")
)
```
<!--- KNIT example-model-context-protocol-04.kt -->

### 3. エージェントに統合する

KoogエージェントでMCPツールを使用するには、ツールレジストリをエージェントに登録する必要があります：
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
// ツールを備えたエージェントを作成する
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)

// MCPツールを使用するタスクでエージェントを実行する
val result = agent.run("MCPツールを使用してタスクを実行してください")
```
<!--- KNIT example-model-context-protocol-05.kt -->

[//]: # (## MCPツールを直接操作する)

[//]: # ()
[//]: # (エージェントを介してツールを実行するだけでなく、直接実行することもできます：)

[//]: # ()
[//]: # (1. ツールレジストリから特定のツールを取得します。)

[//]: # (2. 標準のKoogメカニズムを使用して、特定の引数でツールを実行します。)

[//]: # ()
[//]: # (例を以下に示します：)

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

[//]: # (// ツールを取得する)

[//]: # (val tool = toolRegistry.getTool&#40;"tool-name"&#41; as McpTool)

[//]: # ()
[//]: # (// ツールの引数を作成する)

[//]: # (val args = McpTool.Args&#40;buildJsonObject { )

[//]: # (    put&#40;"parameter1", JsonPrimitive&#40;"value1"&#41;&#41;)

[//]: # (    put&#40;"parameter2", JsonPrimitive&#40;"value2"&#41;&#41;)

[//]: # (}&#41;)

[//]: # ()
[//]: # (// 指定された引数でツールを実行する)

[//]: # (val toolResult = tool.execute&#40;args&#41;)

[//]: # ()
[//]: # (// 結果を出力する)

[//]: # (println&#40;toolResult&#41;)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-06.kt -->)

[//]: # ()
[//]: # (レジストリから利用可能なすべてのMCPツールを取得することもできます：)

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

[//]: # (// すべてのツールを取得する)

[//]: # (val tools = toolRegistry.tools)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-07.kt -->)

## 利用例

### Google Maps MCPの統合

この例では、MCPを使用して地理データ用の [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) サーバーに接続する方法を示します：

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
// Google Maps MCPサーバーを含むDockerコンテナを起動する
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// MCPサーバーのツールを使用してToolRegistryを作成する
val toolRegistry = McpToolRegistryProvider.fromProcess(process = process)

// エージェントを作成して実行する
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("ドイツ、ミュンヘンにあるJetBrainsオフィスの標高を教えてください。")
```
<!--- KNIT example-model-context-protocol-06.kt -->

### Playwright MCPの統合

この例では、MCPを使用してWebオートメーション用の [Playwright](https://mcp.so/server/playwright-mcp/microsoft) サーバーに接続する方法を示します：

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
// Playwright MCPサーバーを起動する
val process = ProcessBuilder(
    "npx", "@playwright/mcp@latest", "--port", "8931"
).start()

// MCPサーバーのツールを使用してToolRegistryを作成する
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:8931")

// エージェントを作成して実行する
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("ブラウザを開き、jetbrains.comに移動し、すべてのクッキーを承認して、ツールバーのAIをクリックしてください。")
```
<!--- KNIT example-model-context-protocol-07.kt -->