# 모델 컨텍스트 프로토콜

모델 컨텍스트 프로토콜 (MCP)은 AI 에이전트가 일관된 인터페이스를 통해 외부 도구 및 서비스와 상호 작용할 수 있도록 하는 표준화된 프로토콜입니다.

MCP는 도구와 프롬프트를 AI 에이전트가 호출할 수 있는 API 엔드포인트로 노출합니다. 각 도구에는 특정 이름과 JSON 스키마 형식으로 입력 및 출력을 설명하는 입력 스키마가 있습니다.

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
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
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

```kotlin
// MCP 서버 시작 (예: 프로세스로)
val process = ProcessBuilder("path/to/mcp/server").start()

// stdio 전송 생성 
val transport = McpToolRegistryProvider.defaultStdioTransport(process)
```

#### SSE로 연결

이 프로토콜은 MCP 서버가 웹 서비스로 실행될 때 사용됩니다. 다음은 SSE 전송을 사용하여 MCP 연결을 설정하는 예시입니다:

```kotlin
// SSE 전송 생성
val transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
```

### 2. 도구 레지스트리 생성

MCP 연결이 완료되면, 다음 방법 중 하나로 MCP 서버의 도구를 포함하는 도구 레지스트리를 생성할 수 있습니다:

*   통신을 위해 제공된 전송 메커니즘을 사용합니다. 예:

    ```kotlin
    // MCP 서버의 도구로 도구 레지스트리 생성
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = transport,
        name = "my-client",
        version = "1.0.0"
    )
    ```

*   MCP 서버에 연결된 MCP 클라이언트를 사용합니다. 예:

    ```kotlin
    // 기존 MCP 클라이언트에서 도구 레지스트리 생성
    val toolRegistry = McpToolRegistryProvider.fromClient(
        mcpClient = existingMcpClient
    )
    ```

### 3. 에이전트와 통합

Koog 에이전트와 함께 MCP 도구를 사용하려면, 도구 레지스트리를 에이전트에 등록해야 합니다:

```kotlin
// 도구를 포함한 에이전트 생성
val agent = AIAgent(
    promptExecutor = executor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry
)

// MCP 도구를 사용하는 작업으로 에이전트 실행
val result = agent.run("Use the MCP tool to perform a task")
```

## MCP 도구 직접 사용

에이전트를 통해 도구를 실행하는 것 외에도 직접 실행할 수도 있습니다:

1.  도구 레지스트리에서 특정 도구를 검색합니다.
2.  표준 Koog 메커니즘을 사용하여 특정 인수로 도구를 실행합니다.

다음은 예시입니다:

```kotlin
// 도구 가져오기 
val tool = toolRegistry.getTool("tool-name") as McpTool

// 도구 인자 생성
val args = McpTool.Args(buildJsonObject { 
    put("parameter1", "value1")
    put("parameter2", "value2")
})

// 주어진 인자로 도구 실행
val toolResult = tool.execute(args)

// 결과 출력
println(toolResult)
```

레지스트리에서 사용 가능한 모든 MCP 도구를 검색할 수도 있습니다:

```kotlin
// 모든 도구 가져오기
val tools = toolRegistry.tools
```

## 사용 예시

### Google Maps MCP 통합

이 예시는 MCP를 사용하여 지리 데이터용 [Google Maps](https://mcp.so/server/google-maps/modelcontextprotocol) 서버에 연결하는 방법을 보여줍니다:

```kotlin
// Google Maps MCP 서버로 Docker 컨테이너 시작
val process = ProcessBuilder(
    "docker", "run", "-i",
    "-e", "GOOGLE_MAPS_API_KEY=$googleMapsApiKey",
    "mcp/google-maps"
).start()

// MCP 서버의 도구로 ToolRegistry 생성
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultStdioTransport(process)
)

// 에이전트 생성 및 실행
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Get elevation of the Jetbrains Office in Munich, Germany?")
```

### Playwright MCP 통합

이 예시는 MCP를 사용하여 웹 자동화용 [Playwright](https://mcp.so/server/playwright-mcp/microsoft) 서버에 연결하는 방법을 보여줍니다:

```kotlin
// Playwright MCP 서버 시작
val process = ProcessBuilder(
    "npx", "@playwright/mcp@latest", "--port", "8931"
).start()

// MCP 서버의 도구로 ToolRegistry 생성
val toolRegistry = McpToolRegistryProvider.fromTransport(
    transport = McpToolRegistryProvider.defaultSseTransport("http://localhost:8931")
)

// 에이전트 생성 및 실행
val agent = AIAgent(
    executor = simpleOpenAIExecutor(openAIApiToken),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry,
)
agent.run("Open a browser, navigate to jetbrains.com, accept all cookies, click AI in toolbar")