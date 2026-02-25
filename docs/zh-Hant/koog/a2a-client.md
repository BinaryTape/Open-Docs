# A2A 用戶端

A2A 用戶端讓您能夠透過網路與符合 A2A 規範的 Agent 進行通訊。
它提供了 [A2A 協定規範](https://a2a-protocol.org/latest/specification/) 的完整實作，處理 Agent 探索、訊息交換、任務管理以及即時串流回應。

## 相依性

要在您的專案中使用 A2A 用戶端，請將以下相依性新增至您的 `build.gradle.kts`：

```kotlin
dependencies {
    // A2A 用戶端核心程式庫
    implementation("ai.koog:a2a-client:$koogVersion")

    // HTTP JSON-RPC 傳輸 (最常見)
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor 用戶端引擎 (選擇一個符合您需求的引擎)
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概覽

A2A 用戶端作為您的應用程式與符合 A2A 規範 Agent 之間的橋樑。
它編排整個通訊生命週期，同時保持協定合規性並提供強健的工作階段管理。

## 核心元件

### A2AClient

實作完整 A2A 協定的主要用戶端類別。它作為核心協調器，負責：

- 透過可插拔的解析器**管理**連線與 Agent 探索
- 在自動符合協定規範的情況下，**編排**訊息交換與任務操作
- 當 Agent 支援時，**處理**串流回應與即時通訊
- 為強健的應用程式**提供**全面的錯誤處理與備援機制

`A2AClient` 接受兩個必要參數：

* `ClientTransport`：處理網路通訊層
* `AgentCardResolver`：處理 Agent 探索與元資料擷取

`A2AClient` 介面提供了幾個與 A2A Agent 互動的關鍵方法：

* `connect` 方法 - 用於連線至 Agent 並擷取其功能，這會探索 Agent 的能力並快取 AgentCard
* `sendMessage` 方法 - 用於向 Agent 傳送訊息並接收單一回應，適用於簡單的請求-回應模式
* `sendMessageStreaming` 方法 - 用於傳送支援串流的訊息以獲得即時回應，這會傳回一個包含部分訊息與任務更新等事件的 Flow
* `getTask` 方法 - 用於查詢特定任務的狀態與詳細資訊
* `cancelTask` 方法 - 如果 Agent 支援取消，則用於取消執行中的任務
* `cachedAgentCard` 方法 - 用於獲取快取的 Agent 卡片而無需發起網路請求，如果尚未呼叫 connect，則傳回 null

### ClientTransport

`ClientTransport` 介面處理低階網路通訊，而 A2A 用戶端則管理協定邏輯。
它抽象化了特定傳輸細節，讓您可以無縫使用不同的協定。

#### HTTP JSON-RPC 傳輸

A2A Agent 最常用的傳輸方式：

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // Agent 端點 URL
    httpClient = HttpClient(CIO) {                // 選填：自訂 HTTP 用戶端
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

`AgentCardResolver` 介面用於擷取 Agent 元資料與功能。
它支援從各種來源探索 Agent，並支援快取策略以達到最佳效能。

#### URL Agent 卡片解析器

依照 A2A 慣例從 HTTP 端點擷取 Agent 卡片：

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // Agent 服務的基礎 URL
    path = "/.well-known/agent-card.json",           // 標準 Agent 卡片位置
    httpClient = HttpClient(CIO),                    // 選填：自訂 HTTP 用戶端
)
```

## 快速入門

### 1. 建立用戶端

定義傳輸與 Agent 卡片解析器，然後建立用戶端。

```kotlin
// HTTP JSON-RPC 傳輸
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// Agent 卡片解析器
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// 建立用戶端
val client = A2AClient(transport, agentCardResolver)
```

### 2. 連線與探索

連線至 Agent 並擷取其卡片。
擁有 Agent 的卡片後，您就可以查詢其功能並執行其他操作，例如檢查它是否支援串流。

```kotlin
// 連線並擷取 Agent 功能
client.connect()
val agentCard = client.cachedAgentCard()

println("已連線至：${agentCard.name}")
println("支援串流：${agentCard.capabilities.streaming}")
```

### 3. 傳送訊息

向 Agent 傳送訊息並接收單一回應。
如果 Agent 直接回應，回應可以是該訊息；或者如果 Agent 正在執行任務，則回應可以是任務事件。

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// 處理回應
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // 串流部分回應
    }
    is TaskEvent -> {
        if (event.final) {
            println("
任務已完成")
        }
    }
}
```

### 4. 傳送串流訊息

A2A 用戶端支援串流回應以進行即時通訊。
它不會只接收單一回應，而是會傳回包含訊息與任務更新事件的 `Flow`。

```kotlin
// 檢查 Agent 是否支援串流
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // 串流部分回應
            }
            is TaskStatusUpdateEvent -> {
                if (event.final) {
                    println("
任務已完成")
                }
            }
        }
    }
} else {
    // 備援至非串流模式
    val response = client.sendMessage(request)
    // 處理單一回應
}
```

### 5. 管理任務

A2A 用戶端提供了透過查詢狀態與取消任務來控制伺服器任務的方法。

```kotlin
// 查詢任務狀態
val taskRequest = Request(data = TaskQueryParams(taskId = "task-123"))
val taskResponse = client.getTask(taskRequest)
val task = taskResponse.data

println("任務狀態：${task.status.state}")

// 取消執行中的任務
if (task.status.state == TaskState.Working) {
    val cancelRequest = Request(data = TaskIdParams(taskId = "task-123"))
    val cancelledTask = client.cancelTask(cancelRequest).data
    println("任務已取消：${cancelledTask.status.state}")
}