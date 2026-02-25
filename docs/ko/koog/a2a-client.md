# A2A 클라이언트

A2A 클라이언트를 사용하면 네트워크를 통해 A2A 규격(A2A-compliant) 에이전트와 통신할 수 있습니다.
이 클라이언트는 [A2A 프로토콜 사양(A2A protocol specification)](https://a2a-protocol.org/latest/specification/)의 완전한 구현을 제공하며, 에이전트 검색(agent discovery), 메시지 교환, 태스크 관리 및 실시간 스트리밍 응답을 처리합니다.

## 의존성(Dependencies)

프로젝트에서 A2A 클라이언트를 사용하려면 `build.gradle.kts`에 다음 의존성을 추가하세요:

```kotlin
dependencies {
    // 핵심 A2A 클라이언트 라이브러리
    implementation("ai.koog:a2a-client:$koogVersion")

    // HTTP JSON-RPC 트랜스포트 (가장 일반적임)
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor 클라이언트 엔진 (필요에 맞는 것을 선택하세요)
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 개요

A2A 클라이언트는 애플리케이션과 A2A 규격 에이전트 사이의 가교 역할을 합니다.
프로토콜 준수를 유지하고 견고한 세션 관리를 제공하면서 전체 통신 수명 주기를 조율합니다.

## 핵심 구성 요소

### A2AClient

전체 A2A 프로토콜을 구현하는 메인 클라이언트 클래스입니다. 다음과 같은 작업을 수행하는 중앙 코디네이터 역할을 합니다:

- 플러그형 리졸버(resolver)를 통한 연결 및 에이전트 검색 **관리**
- 자동화된 프로토콜 준수를 통한 메시지 교환 및 태스크 작업 **조율**
- 에이전트가 지원하는 경우 스트리밍 응답 및 실시간 통신 **처리**
- 견고한 애플리케이션을 위한 포괄적인 에러 처리 및 폴백(fallback) 메커니즘 **제공**

`A2AClient`는 두 개의 필수 파라미터를 받습니다:

* `ClientTransport`: 네트워크 통신 레이어를 처리합니다.
* `AgentCardResolver`: 에이전트 검색 및 메타데이터 조회를 처리합니다.

`A2AClient` 인터페이스는 A2A 에이전트와 상호작용하기 위한 몇 가지 주요 메서드를 제공합니다:

* `connect` 메서드 - 에이전트에 연결하여 기능을 조회합니다. 에이전트가 수행 가능한 작업을 검색하고 `AgentCard`를 캐싱합니다.
* `sendMessage` 메서드 - 에이전트에 메시지를 보내고 단일 응답을 받습니다. 단순한 요청-응답 패턴에 사용됩니다.
* `sendMessageStreaming` 메서드 - 실시간 응답을 위한 스트리밍 지원과 함께 메시지를 보냅니다. 부분 메시지 및 태스크 업데이트를 포함하는 Flow 이벤트를 반환합니다.
* `getTask` 메서드 - 특정 태스크의 상태와 상세 정보를 쿼리합니다.
* `cancelTask` 메서드 - 에이전트가 취소를 지원하는 경우 실행 중인 태스크를 취소합니다.
* `cachedAgentCard` 메서드 - 네트워크 요청 없이 캐시된 에이전트 카드를 가져옵니다. `connect`가 아직 호출되지 않은 경우 null을 반환합니다.

### ClientTransport

`ClientTransport` 인터페이스는 저수준(low-level) 네트워크 통신을 처리하며, A2A 클라이언트는 프로토콜 로직을 관리합니다.
트랜스포트별 상세 구현을 추상화하여 다양한 프로토콜을 원활하게 사용할 수 있도록 해줍니다.

#### HTTP JSON-RPC 트랜스포트

A2A 에이전트에서 가장 흔히 사용되는 트랜스포트입니다:

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // 에이전트 엔드포인트 URL
    httpClient = HttpClient(CIO) {                // 선택 사항: 커스텀 HTTP 클라이언트
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

`AgentCardResolver` 인터페이스는 에이전트 메타데이터와 기능을 조회합니다.
다양한 소스에서 에이전트 검색을 가능하게 하며, 최적의 성능을 위한 캐싱 전략을 지원합니다.

#### URL 에이전트 카드 리졸버(URL Agent Card Resolver)

A2A 컨벤션을 따르는 HTTP 엔드포인트에서 에이전트 카드를 가져옵니다:

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // 에이전트 서비스의 베이스 URL
    path = "/.well-known/agent-card.json",           // 표준 에이전트 카드 위치
    httpClient = HttpClient(CIO),                    // 선택 사항: 커스텀 HTTP 클라이언트
)
```

## 퀵스타트

### 1. 클라이언트 생성

트랜스포트와 에이전트 카드 리졸버를 정의하고 클라이언트를 생성합니다.

```kotlin
// HTTP JSON-RPC 트랜스포트
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// 에이전트 카드 리졸버
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// 클라이언트 생성
val client = A2AClient(transport, agentCardResolver)
```

### 2. 연결 및 검색

에이전트에 연결하고 카드를 가져옵니다.
에이전트 카드가 있으면 기능을 쿼리하거나 스트리밍 지원 여부 확인과 같은 다른 작업을 수행할 수 있습니다.

```kotlin
// 연결 및 에이전트 기능 조회
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. 메시지 전송

에이전트에 메시지를 보내고 단일 응답을 받습니다.
응답은 에이전트가 직접 응답한 경우 메시지이거나, 에이전트가 태스크를 수행 중인 경우 태스크 이벤트일 수 있습니다.

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// 응답 처리
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // 부분 응답들 출력
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
단일 응답 대신 메시지와 태스크 업데이트를 포함하는 `Flow` 이벤트를 반환합니다.

```kotlin
// 에이전트의 스트리밍 지원 여부 확인
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // 부분 응답 스트리밍 출력
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
    // 비스트리밍 방식으로 폴백(Fallback)
    val response = client.sendMessage(request)
    // 단일 응답 처리
}
```

### 5. 태스크 관리

A2A 클라이언트는 태스크 상태를 요청하거나 취소하여 서버 태스크를 제어하는 메서드를 제공합니다.

```kotlin
// 태스크 상태 쿼리
val taskRequest = Request(data = TaskQueryParams(taskId = "task-123"))
val taskResponse = client.getTask(taskRequest)
val task = taskResponse.data

println("Task state: ${task.status.state}")

// 실행 중인 태스크 취소
if (task.status.state == TaskState.Working) {
    val cancelRequest = Request(data = TaskIdParams(taskId = "task-123"))
    val cancelledTask = client.cancelTask(cancelRequest).data
    println("Task cancelled: ${cancelledTask.status.state}")
}