# A2A 服务器

A2A 服务器使您能够通过标准化的 A2A (Agent-to-Agent) 协议公开 AI 代理。它提供了 [A2A 协议规范](https://a2a-protocol.org/latest/specification/) 的完整实现，负责处理客户端请求、执行代理逻辑、管理复杂的任务生命周期，并支持实时流式响应。

## 依赖项

要在您的项目中配置 A2A 服务器，请将以下依赖项添加到您的 `build.gradle.kts` 文件中：

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

## 概述

A2A 服务器充当 A2A 协议传输层与您的自定义代理逻辑之间的桥梁。它编排整个请求生命周期，同时保持协议合规性并提供健壮的会话管理。

## 核心组件

### A2AServer

实现完整 A2A 协议的主要服务器类。它充当中心协调器，负责：

- **验证** 传入请求是否符合协议规范
- **管理** 并发会话和任务生命周期
- **编排** 传输层、存储层和业务逻辑层之间的通信
- **处理** 所有协议操作：消息发送、任务查询、取消和推送通知

`A2AServer` 接受两个必填形参：

* `AgentExecutor`，它定义了代理的业务逻辑实现
* `AgentCard`，它定义了代理能力和元数据

以及一些可选形参，可用于自定义其存储和传输行为。

### AgentExecutor

`AgentExecutor` 接口是您实现代理核心业务逻辑的地方。它充当 A2A 协议与您特定的 AI 代理能力之间的桥梁。要启动代理的执行，您必须实现 `execute` 方法来定义代理的逻辑。要取消代理，您必须实现 `cancel` 方法。

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

`RequestContext` 提供有关当前请求的丰富信息，包括当前会话的 `contextId` 和 `taskId`、发送的 `message` 以及请求的 `params`。

`SessionEventProcessor` 与客户端通信：

- **`sendMessage(message)`**：发送即时响应（聊天式交互）
- **`sendTaskEvent(event)`**：发送任务相关的更新（长时间运行的操作）

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

`AgentCard` 作为代理的自描述清单。它告知客户端代理的能力、如何与其通信以及具有哪些安全要求。

```kotlin
val agentCard = AgentCard(
    // 基本身份
    name = "Advanced Recipe Assistant",
    description = "AI agent specialized in cooking advice, recipe generation, and meal planning",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信设置
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 可选：支持多种传输
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 能力声明
    capabilities = AgentCapabilities(
        streaming = true,              // Support real-time responses
        pushNotifications = true,      // Send async notifications
        stateTransitionHistory = true  // Maintain task history
    ),

    // 内容类型支持
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 定义可用的安全方案
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

    // 指定安全要求（要求的逻辑或）
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // 选项 1：具有读/写范围的 JWT
        mapOf("api-key" to emptyList())              // 选项 2：API 密钥
    ),

    // 为经过身份验证的用户启用扩展卡
    supportsAuthenticatedExtendedCard = true,
    
    // 技能/能力
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

    // 可选：品牌信息
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### 传输层

A2A 本身支持多种传输协议用于与客户端通信。目前，Koog 提供了基于 HTTP 的 JSON-RPC 服务器传输实现。

#### HTTP JSON-RPC 传输

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor engine (CIO, Netty, Jetty)
    port = 8080,                   // Server port
    path = "/a2a",                 // API endpoint path
    wait = true                    // Block until server stops
)
```

### 存储

A2A 服务器采用可插拔存储架构，分离不同类型的数据。所有存储实现都是可选的，并在开发时默认为内存变体。

- **TaskStorage**：任务生命周期管理 - 存储和管理任务状态、历史记录和构件
- **MessageStorage**：对话历史记录 - 管理对话上下文中的消息历史记录
- **PushNotificationConfigStorage**：Webhook 管理 - 管理用于异步通知的 webhook 配置

## 快速开始

### 1. 创建 AgentCard
定义代理的能力和元数据。
```kotlin
val agentCard = AgentCard(
    name = "IO Assistant",
    description = "AI agent specialized in input modification",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信设置
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 能力声明
    capabilities =
        AgentCapabilities(
            streaming = true,              // Support real-time responses
            pushNotifications = true,      // Send async notifications
            stateTransitionHistory = true  // Maintain task history
        ),

    // 内容类型支持
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 技能/能力
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

### 2. 创建一个 AgentExecutor
执行器管理代理逻辑，处理传入请求并发送响应。

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

### 2. 创建服务器
将代理执行器和代理卡传递给服务器。

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 3. 添加传输层
创建一个传输层并启动服务器。
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

## 代理实现模式

### 简单响应代理
如果您的代理只需要响应单个消息，您可以将其实现为简单代理。如果代理执行逻辑不复杂且不耗时，也可以使用此模式。

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

### 基于任务的代理
如果代理的执行逻辑复杂且需要多个步骤，您可以将其实现为基于任务的代理。如果代理执行逻辑耗时且需要挂起，也可以使用此模式。
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
```