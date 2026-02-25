# A2A 서버

A2A 서버를 사용하면 표준화된 A2A (Agent-to-Agent) 프로토콜을 통해 AI 에이전트를 외부로 제공할 수 있습니다. 이는 [A2A 프로토콜 사양](https://a2a-protocol.org/latest/specification/)에 대한 완전한 구현을 제공하며, 클라이언트 요청 처리, 에이전트 로직 실행, 복잡한 작업 생명 주기(task lifecycle) 관리 및 실시간 스트리밍 응답 지원을 담당합니다.

## 의존성 (Dependencies)

프로젝트에서 A2A 서버를 사용하려면 `build.gradle.kts`에 다음 의존성을 추가하세요:

```kotlin
dependencies {
    // 코어 A2A 서버 라이브러리
    implementation("ai.koog:a2a-server:$koogVersion")

    // HTTP JSON-RPC 전송 (가장 일반적임)
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor 서버 엔진 (필요에 맞는 것을 선택하세요)
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

## 개요 (Overview)

A2A 서버는 A2A 프로토콜 전송 계층(transport layer)과 사용자 정의 에이전트 로직 사이의 가교 역할을 합니다. 
프로토콜 준수를 유지하고 강력한 세션 관리를 제공하면서 전체 요청 생명 주기를 조율(orchestrate)합니다.

## 핵심 구성 요소 (Core components)

### A2AServer

전체 A2A 프로토콜을 구현하는 메인 서버 클래스입니다. 다음과 같은 중앙 조율자 역할을 합니다:

- 들어오는 요청이 프로토콜 사양에 맞는지 **검증(Validate)**
- 동시 세션 및 작업 생명 주기 **관리(Manage)**
- 전송, 저장소, 비즈니스 로직 계층 간의 통신 **조율(Orchestrate)**
- 메시지 전송, 작업 조회, 취소, 푸시 알림 등 모든 프로토콜 작업 **처리(Handle)**

`A2AServer`는 두 개의 필수 파라미터를 받습니다:

* 에이전트의 비즈니스 로직 구현을 정의하는 `AgentExecutor`
* 에이전트의 기능과 메타데이터를 정의하는 `AgentCard`

또한 저장소 및 전송 동작을 커스터마이징하는 데 사용할 수 있는 여러 선택적 파라미터를 제공합니다.

### AgentExecutor

`AgentExecutor` 인터페이스는 에이전트의 핵심 비즈니스 로직을 구현하는 곳입니다. 
A2A 프로토콜과 구체적인 AI 에이전트 기능 사이의 연결 고리 역할을 합니다.
에이전트 실행을 시작하려면 에이전트 로직을 정의하는 `execute` 메서드를 구현해야 합니다.
에이전트를 취소하려면 `cancel` 메서드를 구현해야 합니다.

```kotlin
class MyAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // Agent logic here
    }

    override suspend fun cancel(
        context: RequestContext<TaskIdParams>,
        eventProcessor: SessionEventProcessor,
        agentJob: Deferred<Unit>?
    ) {
        // Cancel agent here, optional
    }
}
```

`RequestContext`는 현재 세션의 `contextId` 및 `taskId`, 전송된 `message`, 요청의 `params`를 포함하여 현재 요청에 대한 풍부한 정보를 제공합니다.

`SessionEventProcessor`는 클라이언트와 통신합니다:

- **`sendMessage(message)`**: 즉각적인 응답 전송 (채팅 방식의 상호작용)
- **`sendTaskEvent(event)`**: 작업 관련 업데이트 전송 (장시간 실행되는 작업)

```kotlin
// For immediate responses (like chatbots)
eventProcessor.sendMessage(
    Message(
        messageId = generateId(),
        role = Role.Agent,
        parts = listOf(TextPart("Here's your answer!")),
        contextId = context.contextId
    )
)

// For task-based operations
eventProcessor.sendTaskEvent(
    TaskStatusUpdateEvent(
        contextId = context.contextId,
        taskId = context.taskId,
        status = TaskStatus(
            state = TaskState.Working,
            message = Message(/* progress update */),
            timestamp = Clock.System.now()
        ),
        final = false  // More updates to come
    )
)
```

### AgentCard

`AgentCard`는 에이전트의 자기 기술적(self-describing) 매니페스트(manifest) 역할을 합니다. 클라이언트에게 에이전트가 무엇을 할 수 있는지, 어떻게 통신하는지, 그리고 어떤 보안 요구 사항이 있는지 알려줍니다.

```kotlin
val agentCard = AgentCard(
    // Basic Identity
    name = "Advanced Recipe Assistant",
    description = "AI agent specialized in cooking advice, recipe generation, and meal planning",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // Communication Settings
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // Optional: Multiple transport support
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // Capabilities Declaration
    capabilities = AgentCapabilities(
        streaming = true,              // Support real-time responses
        pushNotifications = true,      // Send async notifications
        stateTransitionHistory = true  // Maintain task history
    ),

    // Content Type Support
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // Define available security schemes
    securitySchemes = mapOf(
        "bearer" to HTTPAuthSecurityScheme(
            scheme = "Bearer",
            bearerFormat = "JWT",
            description = "JWT token authentication"
        ),
        "api-key" to APIKeySecurityScheme(
            `in` = In.Header,
            name = "X-API-Key",
            description = "API key for service authentication"
        )
    ),

    // Specify security requirements (logical OR of requirements)
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // Option 1: JWT with read/write scopes
        mapOf("api-key" to emptyList())              // Option 2: API key
    ),

    // Enable extended card for authenticated users
    supportsAuthenticatedExtendedCard = true,
    
    // Skills/Capabilities
    skills = listOf(
        AgentSkill(
            id = "recipe-generation",
            name = "Recipe Generation",
            description = "Generate custom recipes based on ingredients, dietary restrictions, and preferences",
            tags = listOf("cooking", "recipes", "nutrition"),
            examples = listOf(
                "Create a vegan pasta recipe with mushrooms",
                "I have chicken, rice, and vegetables. What can I make?"
            )
        ),
        AgentSkill(
            id = "meal-planning",
            name = "Meal Planning",
            description = "Plan weekly meals and generate shopping lists",
            tags = listOf("meal-planning", "nutrition", "shopping")
        )
    ),

    // Optional: Branding
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### 전송 계층 (Transport Layer)

A2A 자체는 클라이언트와 통신하기 위해 여러 전송 프로토콜을 지원합니다. 
현재 Koog는 HTTP 기반의 JSON-RPC 서버 전송 구현을 제공합니다.

#### HTTP JSON-RPC 전송 (HTTP JSON-RPC Transport)

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor engine (CIO, Netty, Jetty)
    port = 8080,                   // Server port
    path = "/a2a",                 // API endpoint path
    wait = true                    // Block until server stops
)
```

### 저장소 (Storage)

A2A 서버는 서로 다른 유형의 데이터를 분리하는 플러그형 저장소 아키텍처를 사용합니다.
모든 저장소 구현은 선택 사항이며, 개발용으로 기본 제공되는 인메모리(in-memory) 구현체가 기본으로 사용됩니다.

- **TaskStorage**: 작업 생명 주기 관리 - 작업 상태, 이력 및 아티팩트(artifacts)를 저장하고 관리합니다.
- **MessageStorage**: 대화 이력 - 대화 컨텍스트 내의 메시지 이력을 관리합니다.
- **PushNotificationConfigStorage**: 웹훅(Webhook) 관리 - 비동기 알림을 위한 웹훅 구성을 관리합니다.

## 빠른 시작 (Quickstart)

### 1. AgentCard 생성
에이전트의 기능과 메타데이터를 정의합니다.
```kotlin
val agentCard = AgentCard(
    name = "IO Assistant",
    description = "AI agent specialized in input modification",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // Communication Settings
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // Capabilities Declaration
    capabilities =
        AgentCapabilities(
            streaming = true,              // Support real-time responses
            pushNotifications = true,      // Send async notifications
            stateTransitionHistory = true  // Maintain task history
        ),

    // Content Type Support
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // Skills/Capabilities
    skills = listOf(
        AgentSkill(
            id = "echo",
            name = "echo",
            description = "Echoes back user messages",
            tags = listOf("io"),
        )
    )
)
```

### 2. AgentExecutor 생성
Executor는 에이전트 로직을 구현하고, 들어오는 요청을 처리하며 응답을 보냅니다.

```kotlin
class EchoAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val userMessage = context.params.message
        val userText = userMessage.parts
            .filterIsInstance<TextPart>()
            .joinToString(" ") { it.text }

        // Echo the user's message back
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("You said: $userText")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### 3. 서버 생성
에이전트 Executor와 AgentCard를 서버에 전달합니다.

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 4. 전송 계층 추가
전송 계층을 생성하고 서버를 시작합니다.
```kotlin
// HTTP JSON-RPC transport
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,
    port = 8080,
    path = "/agent",
    wait = true
)
```

## 에이전트 구현 패턴 (Agent Implementation Patterns)

### 단순 응답 에이전트 (Simple Response Agent)
에이전트가 단일 메시지에만 응답하면 되는 경우 단순 에이전트로 구현할 수 있습니다. 
에이전트 실행 로직이 복잡하지 않고 시간이 많이 걸리지 않는 경우에도 사용할 수 있습니다.

```kotlin
class SimpleAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("Hello from agent!")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### 작업 기반 에이전트 (Task-Based Agent)
에이전트의 실행 로직이 복잡하고 여러 단계가 필요한 경우 작업 기반 에이전트로 구현할 수 있습니다.
에이전트 실행 로직이 시간이 오래 걸리거나 중단(suspending)이 필요한 경우에도 사용할 수 있습니다.
```kotlin
class TaskAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // Send working status
        eventProcessor.sendTaskEvent(
            TaskStatusUpdateEvent(
                contextId = context.contextId,
                taskId = context.taskId,
                status = TaskStatus(
                    state = TaskState.Working,
                    timestamp = Clock.System.now()
                ),
                final = false
            )
        )

        // Do work...

        // Send completion
        eventProcessor.sendTaskEvent(
            TaskStatusUpdateEvent(
                contextId = context.contextId,
                taskId = context.taskId,
                status = TaskStatus(
                    state = TaskState.Completed,
                    timestamp = Clock.System.now()
                ),
                final = true
            )
        )
    }
}