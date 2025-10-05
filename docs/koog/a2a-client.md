# A2A Client

A2A Client 使你能够通过网络与 A2A 兼容代理进行通信。
它提供了 [A2A 协议规范](https://a2a-protocol.org/latest/specification/)的完整实现，处理代理发现、消息交换、任务管理和实时流式响应。

## 概述

A2A Client 充当你的应用程序与 A2A 兼容代理之间的桥梁。
它协调整个通信生命周期，同时保持协议合规性并提供健壮的会话管理。

## 核心组件

### A2AClient

实现完整 A2A 协议的主要客户端类。它作为中央协调器，负责：

-   通过可插拔的解析器**管理**连接和代理发现
-   通过自动协议合规性**协调**消息交换和任务操作
-   在代理支持时**处理**流式响应和实时通信
-   为健壮的应用程序**提供**全面的错误处理和回退机制

`A2AClient` 接受两个必需的形参：

*   `ClientTransport`，处理网络通信层
*   `AgentCardResolver`，处理代理发现和元数据检索

`A2AClient` 接口提供以下几个关键方法，用于与 A2A 代理交互：

*   `connect` 方法 - 连接到代理并检索其能力，它会发现代理的能力并缓存 AgentCard
*   `sendMessage` 方法 - 向代理发送消息并接收单个响应，适用于简单的请求-响应模式
*   `sendMessageStreaming` 方法 - 发送支持流式传输的消息以获取实时响应，它会返回一个事件 Flow，其中包括部分消息和任务更新
*   `getTask` 方法 - 查询特定任务的状态和详细信息
*   `cancelTask` 方法 - 如果代理支持取消，则取消正在运行的任务
*   `cachedAgentCard` 方法 - 无需发出网络请求即可获取缓存的代理卡片，如果尚未调用 connect，则返回 null

### ClientTransport

`ClientTransport` 接口处理低层网络通信，而 A2A 客户端管理协议逻辑。
它抽象化了传输特有的细节，使你能够无缝使用不同的协议。

#### HTTP JSON-RPC 传输

A2A 代理最常用的传输：

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // 代理的端点 URL
    httpClient = HttpClient(CIO) {                // 可选：自定义 HTTP 客户端
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

`AgentCardResolver` 接口检索代理元数据和能力。
它支持从各种源发现代理，并支持缓存策略以实现最佳性能。

#### URL Agent Card 解析器

从遵循 A2A 约定的 HTTP 端点获取代理卡片：

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // 代理服务的基 URL
    path = "/.well-known/agent-card.json",           // 标准代理卡片位置
    httpClient = HttpClient(CIO),                    // 可选：自定义 HTTP 客户端
)
```

## 快速开始

### 1. 创建客户端

定义传输和代理卡片解析器，然后创建客户端。

```kotlin
// HTTP JSON-RPC 传输
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// 代理卡片解析器
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// 创建客户端
val client = A2AClient(transport, agentCardResolver)
```

### 2. 连接与发现

连接到代理并检索其卡片。
拥有代理的卡片使你能够查询其能力并执行其他操作，例如，检测它是否支持流式传输。

```kotlin
// 连接并检索代理能力
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. 发送消息

向代理发送消息并接收单个响应。
如果代理直接响应，则响应可以是消息；如果代理正在执行任务，则响应可以是任务事件。

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// 处理响应
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // 流式处理部分响应
    }
    is TaskEvent -> {
        if (event.final) {
            println("
Task completed")
        }
    }
}
```

### 4. 流式发送消息

A2A Client 支持流式响应以实现实时通信。
它不会接收单个响应，而是返回一个事件 Flow，其中包括消息和任务更新。

```kotlin
// 检测代理是否支持流式传输
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // 流式处理部分响应
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
    // 回退到非流式传输
    val response = client.sendMessage(request)
    // 处理单个响应
}
```

### 5. 管理任务

A2A Client 提供方法，通过查询服务器任务的状态和取消它们来控制服务器任务。

```kotlin
// 查询任务状态
val taskRequest = Request(data = TaskQueryParams(taskId = "task-123"))
val taskResponse = client.getTask(taskRequest)
val task = taskResponse.data

println("Task state: ${task.status.state}")

// 取消正在运行的任务
if (task.status.state == TaskState.Working) {
    val cancelRequest = Request(data = TaskIdParams(taskId = "task-123"))
    val cancelledTask = client.cancelTask(cancelRequest).data
    println("Task cancelled: ${cancelledTask.status.state}")
}