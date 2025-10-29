# A2A 客戶端
A2A 客戶端讓您能夠透過網路與遵循 A2A 規範的代理進行通訊。
它提供了[A2A 協定規範](https://a2a-protocol.org/latest/specification/)的完整實作，處理代理發現、訊息交換、任務管理和即時串流回應。

## 依賴項
要在您的專案中使用 A2A 客戶端，請將以下依賴項新增至您的 `build.gradle.kts`：

```kotlin
dependencies {
    // Core A2A client library
    implementation("ai.koog:a2a-client:$koogVersion")

    // HTTP JSON-RPC transport (most common)
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor client engine (choose one that fits your needs)
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概述
A2A 客戶端充當您的應用程式與遵循 A2A 規範的代理之間的橋樑。
它協調整個通訊生命週期，同時保持協定合規性並提供穩健的會話管理。

## 核心組件

### A2AClient
實作完整 A2A 協定的主要客戶端類別。它作為中央協調器，負責：

- **透過**可插拔的解析器**管理**連線和代理發現
- **協調**訊息交換和任務操作，並自動遵循協定
- **在**代理支援時**處理**串流回應和即時通訊
- **為**穩健的應用程式**提供**全面的錯誤處理和備援機制

`A2AClient` 接受兩個必要參數：

* `ClientTransport`，負責處理網路通訊層
* `AgentCardResolver`，負責處理代理發現和中繼資料擷取

`A2AClient` 介面提供了幾個與 A2A 代理互動的關鍵方法：

* `connect` 方法 - 用於連線到代理並擷取其功能，它會發現代理能做什麼並快取 AgentCard
* `sendMessage` 方法 - 用於向代理傳送訊息並接收單一回應，適用於簡單的請求-回應模式
* `sendMessageStreaming` 方法 - 用於傳送支援串流的訊息以獲取即時回應，它會傳回一個包含部分訊息和任務更新的事件 Flow
* `getTask` 方法 - 用於查詢特定任務的狀態和詳細資訊
* `cancelTask` 方法 - 用於取消執行中的任務，如果代理支援取消功能
* `cachedAgentCard` 方法 - 用於獲取快取的代理卡，無需發出網路請求；如果尚未呼叫 `connect`，則傳回 null

### ClientTransport
`ClientTransport` 介面處理低階網路通訊，而 A2A 客戶端則管理協定邏輯。
它抽象化了傳輸層特定細節，讓您能夠無縫地使用不同協定。

#### HTTP JSON-RPC 傳輸層
A2A 代理最常見的傳輸層：

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
`AgentCardResolver` 介面擷取代理中繼資料和功能。
它支援從各種來源發現代理，並支援快取策略以達到最佳效能。

#### URL 代理卡解析器
從遵循 A2A 慣例的 HTTP 端點擷取代理卡：

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // Base URL of the agent service
    path = "/.well-known/agent-card.json",           // Standard agent card location
    httpClient = HttpClient(CIO),                    // Optional: custom HTTP client
)
```

## 快速入門

### 1. 建立客戶端
定義傳輸層和代理卡解析器，然後建立客戶端。

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

### 2. 連線與發現
連線到代理並擷取其卡片。擁有代理的卡片讓您能夠查詢其功能並執行其他操作，例如檢查它是否支援串流。

```kotlin
// Connect and retrieve agent capabilities
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. 傳送訊息
傳送訊息給代理並接收單一回應。如果代理直接回應，則回應可以是訊息；如果代理正在執行任務，則回應可以是任務事件。

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

### 4. 傳送串流訊息
A2A 客戶端支援串流回應以進行即時通訊。
它不是接收單一回應，而是傳回一個包含訊息和任務更新的事件 `Flow`。

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

### 5. 管理任務
A2A 客戶端提供了方法，讓您能夠透過查詢伺服器任務的狀態和取消它們來控制這些任務。

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