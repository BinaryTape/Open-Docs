# A2A 클라이언트

A2A 클라이언트를 사용하면 네트워크를 통해 A2A 호환 에이전트와 통신할 수 있습니다.
이 클라이언트는 [A2A 프로토콜 사양](https://a2a-protocol.org/latest/specification/)의 완벽한 구현을 제공하며, 에이전트 검색, 메시지 교환, 작업 관리 및 실시간 스트리밍 응답을 처리합니다.

## 개요

A2A 클라이언트는 애플리케이션과 A2A 호환 에이전트 사이의 가교 역할을 합니다.
프로토콜 준수를 유지하고 견고한 세션 관리를 제공하면서 전체 통신 수명 주기를 조율합니다.

## 핵심 구성 요소

### A2AClient

완전한 A2A 프로토콜을 구현하는 메인 클라이언트 클래스입니다. 다음을 수행하는 중앙 코디네이터 역할을 합니다.

-   플러그형 리졸버를 통해 연결 및 에이전트 검색을 **관리합니다.**
-   자동 프로토콜 준수를 통해 메시지 교환 및 작업 동작을 **조율합니다.**
-   에이전트가 지원하는 경우 스트리밍 응답 및 실시간 통신을 **처리합니다.**
-   견고한 애플리케이션을 위한 포괄적인 오류 처리 및 폴백(fallback) 메커니즘을 **제공합니다.**

`A2AClient`는 두 가지 필수 매개변수를 받습니다.

*   네트워크 통신 계층을 처리하는 `ClientTransport`
*   에이전트 검색 및 메타데이터 검색을 처리하는 `AgentCardResolver`

`A2AClient` 인터페이스는 A2A 에이전트와 상호 작용하기 위한 몇 가지 주요 메서드를 제공합니다.

*   `connect` 메서드 - 에이전트에 연결하고 에이전트의 기능을 검색합니다. 이 메서드는 에이전트가 수행할 수 있는 작업을 발견하고 `AgentCard`를 캐시합니다.
*   `sendMessage` 메서드 - 에이전트에 메시지를 보내고 간단한 요청-응답 패턴에 대한 단일 응답을 받습니다.
*   `sendMessageStreaming` 메서드 - 실시간 응답을 위한 스트리밍 지원과 함께 메시지를 보냅니다. 이 메서드는 부분 메시지 및 작업 업데이트를 포함하는 이벤트 `Flow`를 반환합니다.
*   `getTask` 메서드 - 특정 작업의 상태 및 세부 정보를 쿼리합니다.
*   `cancelTask` 메서드 - 에이전트가 취소를 지원하는 경우 실행 중인 작업을 취소합니다.
*   `cachedAgentCard` 메서드 - 네트워크 요청 없이 캐시된 에이전트 카드를 가져옵니다. `connect`가 아직 호출되지 않은 경우 null을 반환합니다.

### ClientTransport

`ClientTransport` 인터페이스는 하위 수준 네트워크 통신을 처리하는 반면, A2A 클라이언트는 프로토콜 로직을 관리합니다.
이는 트랜스포트(transport) 관련 세부 정보를 추상화하여 다양한 프로토콜을 원활하게 사용할 수 있도록 합니다.

#### HTTP JSON-RPC 트랜스포트

A2A 에이전트를 위한 가장 일반적인 트랜스포트입니다.

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // Agent endpoint URL
    httpClient = HttpClient(CIO) {                // Optional: custom HTTP client
        install(ContentNegotiation) {
            json()
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 30000
        }
    }
)
```

### AgentCardResolver

`AgentCardResolver` 인터페이스는 에이전트 메타데이터 및 기능을 검색합니다.
이는 다양한 소스에서 에이전트 검색을 가능하게 하며 최적의 성능을 위한 캐싱 전략을 지원합니다.

#### URL 에이전트 카드 리졸버

A2A 규칙을 따르는 HTTP 엔드포인트에서 에이전트 카드를 가져옵니다.

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // Base URL of the agent service
    path = "/.well-known/agent-card.json",           // Standard agent card location
    httpClient = HttpClient(CIO),                    // Optional: custom HTTP client
)
```

## 빠른 시작

### 1. 클라이언트 생성

트랜스포트와 에이전트 카드 리졸버를 정의하고 클라이언트를 생성합니다.

```kotlin
// HTTP JSON-RPC transport
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// Agent card resolver
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// Create client
val client = A2AClient(transport, agentCardResolver)
```

### 2. 연결 및 검색

에이전트에 연결하고 카드를 검색합니다.
에이전트 카드를 사용하면 해당 기능을 쿼리하고 다른 작업을 수행할 수 있습니다. 예를 들어, 스트리밍을 지원하는지 확인할 수 있습니다.

```kotlin
// Connect and retrieve agent capabilities
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. 메시지 전송

에이전트에 메시지를 보내고 단일 응답을 받습니다.
응답은 에이전트가 직접 응답한 경우 메시지이거나, 에이전트가 작업을 수행 중인 경우 작업 이벤트일 수 있습니다.

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// Handle response
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // Stream partial responses
    }
    is TaskEvent -> {
        if (event.final) {
            println("
Task completed")
        }
    }
}
```

### 4. 스트리밍 메시지 전송

A2A 클라이언트는 실시간 통신을 위한 스트리밍 응답을 지원합니다.
단일 응답을 받는 대신, 메시지 및 작업 업데이트를 포함하는 이벤트 `Flow`를 반환합니다.

```kotlin
// Check if agent supports streaming
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // Stream partial responses
            }
            is TaskStatusUpdateEvent -> {
                if (event.final) {
                    println("
Task completed")
                }
            }
        }
    }
} else {
    // Fallback to non-streaming
    val response = client.sendMessage(request)
    // Handle single response
}
```

### 5. 작업 관리

A2A 클라이언트는 서버 작업의 상태를 묻고 취소함으로써 서버 작업을 제어하는 메서드를 제공합니다.

```kotlin
// Query task status
val taskRequest = Request(data = TaskQueryParams(taskId = "task-123"))
val taskResponse = client.getTask(taskRequest)
val task = taskResponse.data

println("Task state: ${task.status.state}")

// Cancel running task
if (task.status.state == TaskState.Working) {
    val cancelRequest = Request(data = TaskIdParams(taskId = "task-123"))
    val cancelledTask = client.cancelTask(cancelRequest).data
    println("Task cancelled: ${cancelledTask.status.state}")
}