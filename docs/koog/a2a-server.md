# A2A 服务器

A2A 服务器允许您通过标准化的 A2A (Agent-to-Agent) 协议公开 AI 智能体。它提供了 [A2A 协议规范](https://a2a-protocol.org/latest/specification/) 的完整实现，处理客户端请求、执行智能体逻辑、管理复杂的任务生命周期，并支持实时流式响应。

## 依赖项

要在项目中使用 A2A 服务器，请将以下依赖项添加到您的 `build.gradle.kts` 中：

```kotlin
dependencies {
    // A2A 服务器核心库
    implementation("ai.koog:a2a-server:$koogVersion")

    // HTTP JSON-RPC 传输层（最常用）
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor 服务器引擎（选择适合您需求的引擎）
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

## 概览

A2A 服务器充当 A2A 协议传输层与您的自定义智能体逻辑之间的桥梁。它在保持协议合规性并提供强大的会话管理的同时，协调整个请求生命周期。

## 核心组件

### A2AServer

实现完整 A2A 协议的主服务器类。它作为中心协调器：

- **验证**传入请求是否符合协议规范
- **管理**并发会话和任务生命周期
- **编排**传输层、存储层和业务逻辑层之间的通信
- **处理**所有协议操作：消息发送、任务查询、取消、推送通知

`A2AServer` 接受两个必选形参：

* `AgentExecutor`：定义智能体的业务逻辑实现
* `AgentCard`：定义智能体能力和元数据

以及一些可选形参，可用于自定义其存储和传输行为。

### AgentExecutor

`AgentExecutor` 接口是您实现智能体核心业务逻辑的地方。它充当 A2A 协议与您特定 AI 智能体能力之间的桥梁。要开始执行您的智能体，您必须实现 `execute` 方法，在该方法中定义您的智能体逻辑。要取消智能体，您必须实现 `cancel` 方法。

```kotlin
class MyAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 此处编写智能体逻辑
    }

    override suspend fun cancel(
        context: RequestContext<TaskIdParams>,
        eventProcessor: SessionEventProcessor,
        agentJob: Deferred<Unit>?
    ) {
        // 此处取消智能体，可选
    }
}
```

`RequestContext` 提供了有关当前请求的丰富信息，包括当前会话的 `contextId` 和 `taskId`、发送的 `message` 以及请求的 `params`。

`SessionEventProcessor` 与客户端进行通信：

- **`sendMessage(message)`**：发送即时响应（聊天式交互）
- **`sendTaskEvent(event)`**：发送任务相关更新（长时间运行的操作）

```kotlin
// 用于即时响应（如聊天机器人）
eventProcessor.sendMessage(
    Message(
        messageId = generateId(),
        role = Role.Agent,
        parts = listOf(TextPart("这是您的答案！")),
        contextId = context.contextId
    )
)

// 用于基于任务的操作
eventProcessor.sendTaskEvent(
    TaskStatusUpdateEvent(
        contextId = context.contextId,
        taskId = context.taskId,
        status = TaskStatus(
            state = TaskState.Working,
            message = Message(/* 进度更新 */),
            timestamp = Clock.System.now()
        ),
        final = false  // 后续还有更新
    )
)
```

### AgentCard

`AgentCard` 是您智能体的自描述清单。它告知客户端您的智能体可以做什么、如何与其通信以及有哪些安全要求。

```kotlin
val agentCard = AgentCard(
    // 基本身份
    name = "高级食谱助手",
    description = "专注于烹饪建议、食谱生成和用餐规划的 AI 智能体",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信设置
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 可选：支持多种传输方式
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 能力声明
    capabilities = AgentCapabilities(
        streaming = true,              // 支持实时流式响应
        pushNotifications = true,      // 发送异步通知
        stateTransitionHistory = true  // 维护任务历史记录
    ),

    // 内容类型支持
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 定义可用的安全方案
    securitySchemes = mapOf(
        "bearer" to HTTPAuthSecurityScheme(
            scheme = "Bearer",
            bearerFormat = "JWT",
            description = "JWT 令牌身份验证"
        ),
        "api-key" to APIKeySecurityScheme(
            `in` = In.Header,
            name = "X-API-Key",
            description = "用于服务身份验证的 API 密钥"
        )
    ),

    // 指定安全要求（要求的逻辑“或”关系）
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // 选项 1：带 read/write 范围的 JWT
        mapOf("api-key" to emptyList())              // 选项 2：API 密钥
    ),

    // 为已通过身份验证的用户启用扩展卡片
    supportsAuthenticatedExtendedCard = true,
    
    // 技能/能力
    skills = listOf(
        AgentSkill(
            id = "recipe-generation",
            name = "食谱生成",
            description = "根据食材、饮食限制和偏好生成自定义食谱",
            tags = listOf("烹饪", "食谱", "营养"),
            examples = listOf(
                "制作一份带蘑菇的纯素意面食谱",
                "我有鸡肉、米饭和蔬菜。我能做点什么？"
            )
        ),
        AgentSkill(
            id = "meal-planning",
            name = "用餐规划",
            description = "规划每周饮食并生成购物清单",
            tags = listOf("用餐规划", "营养", "购物")
        )
    ),

    // 可选：品牌化
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### 传输层

A2A 本身支持多种用于与客户端通信的传输协议。目前，Koog 提供了基于 HTTP 的 JSON-RPC 服务器传输层实现。

#### HTTP JSON-RPC 传输层

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor 引擎 (CIO, Netty, Jetty)
    port = 8080,                   // 服务器端口
    path = "/a2a",                 // API 端点路径
    wait = true                    // 阻塞直到服务器停止
)
```

### 存储

A2A 服务器使用可插拔的存储架构，将不同类型的数据分开。所有存储实现都是可选的，开发时默认使用内存变体。

- **TaskStorage**：任务生命周期管理 - 存储并管理任务状态、历史记录和工件
- **MessageStorage**：对话历史记录 - 管理对话上下文中的消息历史记录
- **PushNotificationConfigStorage**：Webhook 管理 - 管理用于异步通知的 Webhook 配置

## 快速入门

### 1. 创建 AgentCard
定义您的智能体能力和元数据。
```kotlin
val agentCard = AgentCard(
    name = "IO 助手",
    description = "专注于输入修改的 AI 智能体",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信设置
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 能力声明
    capabilities =
        AgentCapabilities(
            streaming = true,              // 支持实时流式响应
            pushNotifications = true,      // 发送异步通知
            stateTransitionHistory = true  // 维护任务历史记录
        ),

    // 内容类型支持
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 技能/能力
    skills = listOf(
        AgentSkill(
            id = "echo",
            name = "echo",
            description = "回显用户消息",
            tags = listOf("io"),
        )
    )
)
```

### 2. 创建 AgentExecutor
执行器负责实现智能体逻辑，处理传入请求并发送响应。

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

        // 将用户消息回显回去
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("您说的是：$userText")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### 2. 创建服务器
将智能体执行器和智能体卡片传递给服务器。

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 3. 添加传输层
创建一个传输层并启动服务器。
```kotlin
// HTTP JSON-RPC 传输层
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,
    port = 8080,
    path = "/agent",
    wait = true
)
```

## 智能体实现模式

### 简单响应智能体
如果您的智能体只需要响应单条消息，您可以将其实现为简单智能体。如果智能体执行逻辑不复杂且不耗时，也可以使用此模式。

```kotlin
class SimpleAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("来自智能体的问候！")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### 基于任务的智能体
如果您的智能体执行逻辑复杂且需要多个步骤，您可以将其实现为基于任务的智能体。如果智能体执行逻辑耗时且涉及挂起操作，也可以使用此模式。
```kotlin
class TaskAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 发送运行中状态
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

        // 执行工作...

        // 发送完成状态
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