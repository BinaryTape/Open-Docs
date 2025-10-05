# A2A 伺服器

A2A 伺服器讓您能夠透過標準化的 A2A (Agent-to-Agent) 協定公開 AI 代理程式。它提供了 [A2A 協定規範](https://a2a-protocol.org/latest/specification/)的完整實作，負責處理用戶端請求、執行代理程式邏輯、管理複雜的任務生命週期，並支援即時串流回應。

## 總覽

A2A 伺服器作為 A2A 協定傳輸層與您的自訂代理程式邏輯之間的橋樑。它協調整個請求生命週期，同時保持協定合規性並提供強大的會話管理。

## 核心元件

### A2AServer

實作完整 A2A 協定的主要伺服器類別。它作為中央協調器，負責：

- **驗證**傳入請求是否符合協定規範
- **管理**並行會話和任務生命週期
- **協調**傳輸、儲存和業務邏輯層之間的通訊
- **處理**所有協定操作：訊息傳送、任務查詢、取消、推播通知

`A2AServer` 接受兩個必要參數：
* `AgentExecutor`，定義代理程式的業務邏輯實作
* `AgentCard`，定義代理程式功能和中繼資料

以及許多可用於自訂其儲存和傳輸行為的可選參數。

### AgentExecutor

`AgentExecutor` 介面是您實作代理程式核心業務邏輯的地方。它作為 A2A 協定與您的特定 AI 代理程式功能之間的橋樑。要開始執行您的代理程式，您必須實作 `execute` 方法來定義代理程式的邏輯。要取消代理程式，您必須實作 `cancel` 方法。

```kotlin
class MyAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 代理程式邏輯在此
    }

    override suspend fun cancel(
        context: RequestContext<TaskIdParams>,
        eventProcessor: SessionEventProcessor,
        agentJob: Deferred<Unit>?
    ) {
        // 在此取消代理程式，可選
    }
}
```

`RequestContext` 提供關於目前請求的豐富資訊，包括目前會話的 `contextId` 和 `taskId`、傳送的 `message` 以及請求的 `params`。

`SessionEventProcessor` 與用戶端通訊：
- **`sendMessage(message)`**：傳送即時回應（聊天風格互動）
- **`sendTaskEvent(event)`**：傳送任務相關更新（長時間執行的操作）

```kotlin
// 用於即時回應（例如聊天機器人）
eventProcessor.sendMessage(
    Message(
        messageId = generateId(),
        role = Role.Agent,
        parts = listOf(TextPart("Here's your answer!")),
        contextId = context.contextId
    )
)

// 用於任務型操作
eventProcessor.sendTaskEvent(
    TaskStatusUpdateEvent(
        contextId = context.contextId,
        taskId = context.taskId,
        status = TaskStatus(
            state = TaskState.Working,
            message = Message(/* 進度更新 */),
            timestamp = Clock.System.now()
        ),
        final = false  // 還有更多更新會到來
    )
)
```

### AgentCard

`AgentCard` 作為您的代理程式的自述清單。它告訴用戶端您的代理程式能做什麼、如何與其通訊以及它有哪些安全性要求。

```kotlin
val agentCard = AgentCard(
    // 基本身份
    name = "Advanced Recipe Assistant",
    description = "AI agent specialized in cooking advice, recipe generation, and meal planning",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通訊設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 可選：多重傳輸支援
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 功能宣告
    capabilities = AgentCapabilities(
        streaming = true,              // 支援即時回應
        pushNotifications = true,      // 傳送非同步通知
        stateTransitionHistory = true  // 維護任務歷史記錄
    ),

    // 內容類型支援
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 定義可用的安全方案
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

    // 指定安全要求（要求的邏輯 OR）
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // 選項 1：具有讀寫範圍的 JWT
        mapOf("api-key" to emptyList())              // 選項 2：API 金鑰
    ),

    // 啟用已驗證用戶的擴展卡
    supportsAuthenticatedExtendedCard = true,
    
    // 技能/功能
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

    // 可選：品牌
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### 傳輸層

A2A 本身支援多種傳輸協定，用於與用戶端通訊。Koog 目前提供透過 HTTP 的 JSON-RPC 伺服器傳輸實作。

#### HTTP JSON-RPC 傳輸

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor 引擎 (CIO, Netty, Jetty)
    port = 8080,                   // 伺服器連接埠
    path = "/a2a",                 // API 端點路徑
    wait = true                    // 阻擋直到伺服器停止
)
```

### 儲存

A2A 伺服器使用可插拔的儲存架構，分離不同類型的資料。所有儲存實作都是可選的，並預設為開發用途的記憶體內變體。

- **TaskStorage**：任務生命週期管理 – 儲存和管理任務狀態、歷史記錄和產物
- **MessageStorage**：會話歷史記錄 – 管理會話上下文中的訊息歷史記錄
- **PushNotificationConfigStorage**：Webhook 管理 – 管理用於非同步通知的 Webhook 配置

## 快速入門

### 1. 建立 AgentCard
定義您的代理程式的功能和中繼資料。
```kotlin
val agentCard = AgentCard(
    name = "IO Assistant",
    description = "AI agent specialized in input modification",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通訊設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 功能宣告
    capabilities =
        AgentCapabilities(
            streaming = true,              // 支援即時回應
            pushNotifications = true,      // 傳送非同步通知
            stateTransitionHistory = true  // 維護任務歷史記錄
        ),

    // 內容類型支援
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 技能/功能
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

### 2. 建立 AgentExecutor
執行器負責實作代理程式邏輯，處理傳入請求並傳送回應。

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

        // 將用戶訊息回應回去
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

### 2. 建立伺服器
將代理程式執行器和代理程式卡傳遞給伺服器。

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 3. 加入傳輸層
建立一個傳輸層並啟動伺服器。
```kotlin
// HTTP JSON-RPC 傳輸
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,
    port = 8080,
    path = "/agent",
    wait = true
)
```

## 代理程式實作模式

### 簡單回應代理程式
如果您的代理程式只需要回應單一訊息，您可以將其實作成一個簡單的代理程式。如果代理程式的執行邏輯不複雜且不耗時，也可以使用這種方式。

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

### 任務型代理程式
如果您的代理程式執行邏輯複雜且需要多個步驟，您可以將其實作成一個任務型代理程式。如果代理程式執行邏輯耗時且需要暫停（suspending），也可以使用這種方式。
```kotlin
class TaskAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 傳送工作狀態
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

        // 執行工作...

        // 傳送完成狀態
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