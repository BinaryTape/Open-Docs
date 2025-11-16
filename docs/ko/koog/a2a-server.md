# A2A 서버

A2A 서버를 사용하면 표준화된 A2A(Agent-to-Agent) 프로토콜을 통해 AI 에이전트를 노출할 수 있습니다. 이 서버는 [A2A 프로토콜 사양](https://a2a-protocol.org/latest/specification/)의 완벽한 구현을 제공하여 클라이언트 요청을 처리하고, 에이전트 로직을 실행하며, 복잡한 태스크 수명 주기를 관리하고, 실시간 스트리밍 응답을 지원합니다.

## 의존성

프로젝트에서 A2A 서버를 사용하려면 `build.gradle.kts`에 다음 의존성을 추가하세요:

```kotlin
dependencies {
    // Core A2A server library
    implementation("ai.koog:a2a-server:$koogVersion")

    // HTTP JSON-RPC transport (most common)
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor server engine (choose one that fits your needs)
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

## 개요

A2A 서버는 A2A 프로토콜 전송 계층과 사용자 지정 에이전트 로직 사이의 다리 역할을 합니다. 프로토콜 준수를 유지하고 강력한 세션 관리를 제공하면서 전체 요청 수명 주기를 조율합니다.

## 핵심 구성 요소

### A2AServer

완벽한 A2A 프로토콜을 구현하는 주요 서버 클래스입니다. 이는 다음과 같은 중앙 코디네이터 역할을 합니다.

- 프로토콜 사양에 따라 수신 요청을 **검증**합니다.
- 동시 세션 및 태스크 수명 주기를 **관리**합니다.
- 전송, 저장소 및 비즈니스 로직 계층 간의 통신을 **조율**합니다.
- 메시지 전송, 태스크 조회, 취소, 푸시 알림과 같은 모든 프로토콜 작업을 **처리**합니다.

`A2AServer`는 두 가지 필수 파라미터를 허용합니다.

* `AgentExecutor`: 에이전트의 비즈니스 로직 구현을 정의합니다.
* `AgentCard`: 에이전트 기능 및 메타데이터를 정의합니다.

또한 저장소 및 전송 동작을 사용자 지정하는 데 사용할 수 있는 여러 선택적 파라미터도 있습니다.

### AgentExecutor

`AgentExecutor` 인터페이스는 에이전트의 핵심 비즈니스 로직을 구현하는 곳입니다. 이는 A2A 프로토콜과 특정 AI 에이전트 기능 사이의 다리 역할을 합니다. 에이전트 실행을 시작하려면 에이전트 로직을 정의하는 `execute` 메서드를 구현해야 합니다. 에이전트를 취소하려면 `cancel` 메서드를 구현해야 합니다.

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

`SessionEventProcessor`는 클라이언트와 통신합니다.

- **`sendMessage(message)`**: 즉각적인 응답을 보냅니다(채팅 스타일 상호 작용).
- **`sendTaskEvent(event)`**: 태스크 관련 업데이트를 보냅니다(장기 실행 작업).

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

`AgentCard`는 에이전트의 자기 설명 매니페스트 역할을 합니다. 이는 클라이언트에게 에이전트가 무엇을 할 수 있는지, 어떻게 통신하는지, 어떤 보안 요구 사항을 가지는지 알려줍니다.

```kotlin
val agentCard = AgentCard(
    // 기본 식별
    name = "고급 레시피 도우미",
    description = "요리 조언, 레시피 생성 및 식단 계획에 특화된 AI 에이전트",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 통신 설정
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // (선택 사항) 다중 전송 지원
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 기능 선언
    capabilities = AgentCapabilities(
        streaming = true,              // 실시간 응답 지원
        pushNotifications = true,      // 비동기 알림 전송
        stateTransitionHistory = true  // 태스크 기록 유지
    ),

    // 콘텐츠 유형 지원
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 사용 가능한 보안 스키마 정의
    securitySchemes = mapOf(
        "bearer" to HTTPAuthSecurityScheme(
            scheme = "Bearer",
            bearerFormat = "JWT",
            description = "JWT 토큰 인증"
        ),
        "api-key" to APIKeySecurityScheme(
            `in` = In.Header,
            name = "X-API-Key",
            description = "서비스 인증을 위한 API 키"
        )
    ),

    // 보안 요구 사항 지정 (요구 사항의 논리적 OR)
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // 옵션 1: 읽기/쓰기 스코프를 가진 JWT
        mapOf("api-key" to emptyList())              // 옵션 2: API 키
    ),

    // 인증된 사용자를 위한 확장 카드 활성화
    supportsAuthenticatedExtendedCard = true,
    
    // 스킬/기능
    skills = listOf(
        AgentSkill(
            id = "recipe-generation",
            name = "레시피 생성",
            description = "재료, 식단 제한 및 선호도에 따라 맞춤형 레시피를 생성",
            tags = listOf("cooking", "recipes", "nutrition"),
            examples = listOf(
                "버섯을 넣은 비건 파스타 레시피 만들기",
                "닭고기, 쌀, 채소가 있어요. 무엇을 만들 수 있나요?"
            )
        ),
        AgentSkill(
            id = "meal-planning",
            name = "식단 계획",
            description = "주간 식단 계획 및 장보기 목록 생성",
            tags = listOf("meal-planning", "nutrition", "shopping")
        )
    ),

    // (선택 사항) 브랜딩
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### 전송 계층

A2A 자체는 클라이언트와 통신하기 위해 여러 전송 프로토콜을 지원합니다. 현재 Koog는 HTTP를 통한 JSON-RPC 서버 전송 구현을 제공합니다.

#### HTTP JSON-RPC 전송

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor engine (CIO, Netty, Jetty)
    port = 8080,                   // Server port
    path = "/a2a",                 // API endpoint path
    wait = true                    // Block until server stops
)
```

### 저장소

A2A 서버는 다양한 유형의 데이터를 분리하는 플러그형 저장소 아키텍처를 사용합니다. 모든 저장소 구현은 선택 사항이며, 개발용으로는 인메모리(in-memory) 변형을 기본값으로 사용합니다.

- **TaskStorage**: 태스크 수명 주기 관리 - 태스크 상태, 기록 및 아티팩트 저장 및 관리
- **MessageStorage**: 대화 기록 - 대화 컨텍스트 내에서 메시지 기록 관리
- **PushNotificationConfigStorage**: 웹훅 관리 - 비동기 알림을 위한 웹훅 구성 관리

## 빠른 시작

### 1. AgentCard 생성
에이전트의 기능과 메타데이터를 정의하세요.
```kotlin
val agentCard = AgentCard(
    name = "IO 도우미",
    description = "입력 수정에 특화된 AI 에이전트",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 통신 설정
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 기능 선언
    capabilities =
        AgentCapabilities(
            streaming = true,              // 실시간 응답 지원
            pushNotifications = true,      // 비동기 알림 전송
            stateTransitionHistory = true  // 태스크 기록 유지
        ),

    // 콘텐츠 유형 지원
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 스킬/기능
    skills = listOf(
        AgentSkill(
            id = "echo",
            name = "에코",
            description = "사용자 메시지를 다시 에코합니다",
            tags = listOf("io"),
        )
    )
)
```

### 2. AgentExecutor 생성
실행기에서는 에이전트 로직을 구현하고, 수신 요청을 처리하며, 응답을 보냅니다.

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
에이전트 실행기와 에이전트 카드를 서버에 전달하세요.

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 4. 전송 계층 추가
전송 계층을 생성하고 서버를 시작하세요.
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

## 에이전트 구현 패턴

### 단순 응답 에이전트

에이전트가 단일 메시지에만 응답해야 하는 경우, 이를 간단한 에이전트로 구현할 수 있습니다. 에이전트 실행 로직이 복잡하거나 시간이 많이 소요되지 않는 경우에도 사용할 수 있습니다.

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

### 태스크 기반 에이전트

에이전트의 실행 로직이 복잡하고 여러 단계가 필요한 경우, 이를 태스크 기반 에이전트로 구현할 수 있습니다. 에이전트 실행 로직이 시간이 많이 소요되고 일시 중단(suspending)될 수 있는 경우에도 사용할 수 있습니다.
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