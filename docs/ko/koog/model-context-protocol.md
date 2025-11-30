# 모델 컨텍스트 프로토콜

모델 컨텍스트 프로토콜 (MCP)은 AI 에이전트가 일관된 인터페이스를 통해 외부 도구 및 서비스와 상호 작용할 수 있도록 하는 표준화된 프로토콜입니다.

MCP는 AI 에이전트가 호출할 수 있는 API 엔드포인트로 도구와 프롬프트를 노출합니다. 각 도구에는 특정 이름과 JSON 스키마 형식으로 입력 및 출력을 설명하는 입력 스키마가 있습니다.

Koog 프레임워크는 MCP 서버와의 통합을 제공하여, MCP 도구를 Koog 에이전트에 통합할 수 있도록 합니다.

프로토콜에 대해 더 자세히 알아보려면 [모델 컨텍스트 프로토콜](https://modelcontextprotocol.io) 문서를 참조하세요.

## MCP 서버

MCP 서버는 모델 컨텍스트 프로토콜을 구현하고 AI 에이전트가 도구 및 서비스와 상호 작용할 수 있는 표준화된 방법을 제공합니다.

바로 사용할 수 있는 MCP 서버는 [MCP 마켓플레이스](https://mcp.so/) 또는 [MCP DockerHub](https://hub.docker.com/u/mcp)에서 찾을 수 있습니다.

MCP 서버는 에이전트와 통신하기 위해 다음 전송 프로토콜을 지원합니다:

*   별도의 프로세스로 실행되는 MCP 서버(예: Docker 컨테이너 또는 CLI 도구)와 통신하는 데 사용되는 표준 입/출력(stdio) 전송 프로토콜.
*   HTTP를 통해 MCP 서버와 통신하는 데 사용되는 서버 전송 이벤트(SSE) 전송 프로토콜 (선택 사항).

## Koog와 통합

Koog 프레임워크는 `agent-mcp` 모듈에 제시된 추가 API 확장을 포함하는 [MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk)를 사용하여 MCP와 통합됩니다.

이 통합을 통해 Koog 에이전트는 다음을 수행할 수 있습니다:

*   다양한 전송 메커니즘(stdio, SSE)을 통해 MCP 서버에 연결합니다.
*   MCP 서버에서 사용 가능한 도구를 검색합니다.
*   MCP 도구를 Koog 도구 인터페이스로 변환합니다.
*   변환된 도구를 도구 레지스트리에 등록합니다.
*   LLM이 제공한 인수로 MCP 도구를 호출합니다.

### 주요 구성 요소

Koog에서 MCP 통합의 주요 구성 요소는 다음과 같습니다:

| 구성 요소                                                                                                                                                           | 설명                                                                                                |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`McpTool`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool/index.html)                                                                          | Koog 도구 인터페이스와 MCP SDK 사이의 다리 역할을 합니다.                  |
| [`McpToolDescriptorParser`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-descriptor-parser/index.html)                                        | MCP 도구 정의를 Koog 도구 디스크립터 형식으로 파싱합니다.                                          |
| [`McpToolRegistryProvider`](https://api.koog.ai/agents/agents-mcp/ai.koog.agents.mcp/-mcp-tool-registry-provider/index.html?query=object%20McpToolRegistryProvider) | 다양한 전송 메커니즘(stdio, SSE)을 통해 MCP 서버에 연결하는 MCP 도구 레지스트리를 생성합니다. |

## 시작하기

### 1. MCP 연결 설정

Koog에서 MCP를 사용하려면 연결을 설정해야 합니다:

1.  MCP 서버를 시작합니다(프로세스, Docker 컨테이너 또는 웹 서비스 중 하나로).
2.  서버와 통신할 전송 메커니즘을 생성합니다.

MCP 서버는 에이전트와 통신하기 위해 stdio 및 SSE 전송 메커니즘을 지원하므로, 이 중 하나를 사용하여 연결할 수 있습니다.

#### stdio로 연결

이 프로토콜은 MCP 서버가 별도의 프로세스로 실행될 때 사용됩니다. 다음은 stdio 전송을 사용하여 MCP 연결을 설정하는 예시입니다:

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

#### SSE로 연결

이 프로토콜은 MCP 서버가 웹 서비스로 실행될 때 사용됩니다. 다음은 SSE 전송을 사용하여 MCP 연결을 설정하는 예시입니다:

<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
-->
```kotlin
// Create the SSE transport
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```
<!--- KNIT example-model-context-protocol-02.kt -->

### 2. 도구 레지스트리 생성

MCP 연결이 완료되면, 다음 방법 중 하나로 MCP 서버의 도구를 포함하는 도구 레지스트리를 생성할 수 있습니다:

*   통신을 위해 제공된 전송 메커니즘을 사용합니다. 예:

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

*   MCP 서버에 연결된 MCP 클라이언트를 사용합니다. 예:
<!--- INCLUDE
import ai.koog.agents.mcp.McpToolRegistryProvider
import io.modelcontextprotocol.kotlin.sdk.types.Implementation
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

### 3. 에이전트와 통합

Koog 에이전트와 함께 MCP 도구를 사용하려면, 도구 레지스트리를 에이전트에 등록해야 합니다:
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

[//]: # (## MCP 도구 직접 사용)

[//]: # ()
[//]: # (에이전트를 통해 도구를 실행하는 것 외에도 직접 실행할 수도 있습니다:)

[//]: # ()
[//]: # (1. 도구 레지스트리에서 특정 도구를 검색합니다.)

[//]: # (2. 표준 Koog 메커니즘을 사용하여 특정 인수로 도구를 실행합니다.)

[//]: # ()
[//]: # (다음은 예시입니다:)

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

[//]: # (// 도구 가져오기 )

[//]: # (val tool = toolRegistry.getTool&#40;"tool-name"&#41; as McpTool)

[//]: # ()
[//]: # (// 도구 인자 생성)

[//]: # (val args = McpTool.Args&#40;buildJsonObject { )

[//]: # (    put&#40;"parameter1", JsonPrimitive&#40;"value1"&#41;&#41;)

[//]: # (    put&#40;"parameter2", JsonPrimitive&#40;"value2"&#41;&#41;)

[//]: # (}&#41;)

[//]: # ()
[//]: # (// 주어진 인자로 도구 실행)

[//]: # (val toolResult = tool.execute&#40;args&#41;)

[//]: # ()
[//]: # (// 결과 출력)

[//]: # (println&#40;toolResult&#41;)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-06.kt -->)

[//]: # ()
[//]: # (레지스트리에서 사용 가능한 모든 MCP 도구를 검색할 수도 있습니다:)

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

[//]: # (// 모든 도구 가져오기)

[//]: # (val tools = toolRegistry.tools)

[//]: # (```)

[//]: # (<!--- KNIT example-model-context-protocol-07.kt -->)

## 사용 예시

### Google Maps MCP 통합

이 예시는 MCP를 사용하여 지리 데이터용 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 서버에 연결하는 방법을 보여줍니다:

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

### Playwright MCP 통합

이 예시는 MCP를 사용하여 웹 자동화용 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 서버에 연결하는 방법을 보여줍니다:

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