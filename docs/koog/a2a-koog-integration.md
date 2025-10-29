# A2A 和 Koog 整合

Koog 提供了与 A2A 协议的无缝整合，允许你将 Koog 代理暴露为 A2A 服务器，并将 Koog 代理连接到其他符合 A2A 规范的代理。

## 依赖项

A2A Koog 整合需要特定的特性模块，具体取决于你的用例：

### 用于将 Koog 代理暴露为 A2A 服务器

将这些依赖项添加到你的 `build.gradle.kts`：

```kotlin
dependencies {
    // Koog A2A 服务器整合特性
    implementation("ai.koog:agents-features-a2a-server:$koogVersion")

    // HTTP JSON-RPC 传输
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor 服务器引擎（选择适合你需求的）
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

### 用于将 Koog 代理连接到 A2A 代理

将这些依赖项添加到你的 `build.gradle.kts`：

```kotlin
dependencies {
    // Koog A2A 客户端整合特性
    implementation("ai.koog:agents-features-a2a-client:$koogVersion")

    // HTTP JSON-RPC 传输
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor 客户端引擎（选择适合你需求的）
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概述

该整合实现了两种主要模式：

1.  **将 Koog 代理暴露为 A2A 服务器** - 使你的 Koog 代理通过 A2A 协议可发现和可访问
2.  **将 Koog 代理连接到 A2A 代理** - 让你的 Koog 代理与其他符合 A2A 规范的代理通信

## 将 Koog 代理暴露为 A2A 服务器

### 定义具有 A2A 特性的 Koog 代理

首先定义一个 Koog 代理。代理的逻辑可以有所不同，但这里是一个带有工具的基本单次运行代理的示例。
该代理重新保存用户的消息，并将其转发给 LLM。
如果 LLM 响应包含工具调用，代理将执行该工具并将结果转发给 LLM。
如果 LLM 响应包含助手消息，代理将助手消息发送给用户并完成。

当输入调整时，代理将一个任务已提交事件连同输入消息发送给 A2A 客户端。
在每次工具调用时，代理将一个任务处理中事件连同工具调用和结果发送给 A2A 客户端。
在助手消息时，代理将一个任务完成事件连同助手消息发送给 A2A 客户端。

```kotlin
/**
 * 创建一个具有 A2A 特性的 Koog 代理
 */
@OptIn(ExperimentalUuidApi::class)
private fun createAgent(
    context: RequestContext<MessageSendParams>,
    eventProcessor: SessionEventProcessor,
) = AIAgent(
    promptExecutor = MultiLLMPromptExecutor(
        LLMProvider.Google to GoogleLLMClient("api-key")
    ),
    toolRegistry = ToolRegistry {
        // 在此处声明工具
    },
    strategy = strategy<A2AMessage, Unit>("test") {
        val nodeSetup by node<A2AMessage, Unit> { inputMessage ->
            // 将 A2A 消息转换为 Koog 消息的便捷函数
            val input = inputMessage.toKoogMessage()
            llm.writeSession {
                appendPrompt {
                    message(input)
                }
            }
            // 向 A2A 客户端发送更新事件
            withA2AAgentServer {
                sendTaskUpdate("Request submitted: ${input.content}", TaskState.Submitted)
            }
        }

        // 调用 LLM
        val nodeLLMRequest by node<Unit, Message> {
            llm.writeSession {
                requestLLM()
            }
        }

        // 执行工具
        val nodeProcessTool by node<Message.Tool.Call, Unit> { toolCall ->
            withA2AAgentServer {
                sendTaskUpdate("Executing tool: ${toolCall.content}", TaskState.Working)
            }

            val toolResult = environment.executeTool(toolCall)

            llm.writeSession {
                appendPrompt {
                    tool {
                        result(toolResult)
                    }
                }
            }
            withA2AAgentServer {
                sendTaskUpdate("Tool result: ${toolResult.content}", TaskState.Working)
            }
        }

        // 发送助手消息
        val nodeProcessAssistant by node<String, Unit> { assistantMessage ->
            withA2AAgentServer {
                sendTaskUpdate(assistantMessage, TaskState.Completed)
            }
        }

        edge(nodeStart forwardTo nodeSetup)
        edge(nodeSetup forwardTo nodeLLMRequest)

        // 如果 LLM 返回工具调用，则转发到工具处理节点，然后返回给 LLM
        edge(nodeLLMRequest forwardTo nodeProcessTool onToolCall { true })
        edge(nodeProcessTool forwardTo nodeLLMRequest)

        // 如果 LLM 返回助手消息，则转发到助手处理节点，然后完成
        edge(nodeLLMRequest forwardTo nodeProcessAssistant onAssistantMessage { true })
        edge(nodeProcessAssistant forwardTo nodeFinish)
    },
    agentConfig = AIAgentConfig(
        prompt = prompt("agent") { system("You are a helpful assistant.") },
        model = GoogleModels.Gemini2_5Pro,
        maxAgentIterations = 10
    ),
) {
    install(A2AAgentServer) {
        this.context = context
        this.eventProcessor = eventProcessor
    }
}

/**
 * 将任务更新事件发送给 A2A 客户端的便捷函数
 * @param content 消息内容
 * @param state 任务状态
 */
@OptIn(ExperimentalUuidApi::class)
private suspend fun A2AAgentServer.sendTaskUpdate(
    content: String,
    state: TaskState,
) {
    val message = A2AMessage(
        messageId = Uuid.random().toString(),
        role = Role.Agent,
        parts = listOf(
            TextPart(content)
        ),
        contextId = context.contextId,
        taskId = context.taskId,
    )

    val task = Task(
        id = context.taskId,
        contextId = context.contextId,
        status = TaskStatus(
            state = state,
            message = message,
            timestamp = Clock.System.now(),
        )
    )
    eventProcessor.sendTaskEvent(task)
}
```

## A2AAgentServer 特性机制

`A2AAgentServer` 是一个 Koog 代理特性，实现了 Koog 代理与 A2A 协议之间的无缝整合。`A2AAgentServer` 特性提供了对 `RequestContext` 和 `SessionEventProcessor` 实体的访问，这些实体用于在 Koog 代理内部与 A2A 客户端通信。

要安装该特性，请在代理上调用 `install` 函数，并传入 `A2AAgentServer` 特性以及 `RequestContext` 和 `SessionEventProcessor`：
```kotlin
// 安装特性
install(A2AAgentServer) {
    this.context = context
    this.eventProcessor = eventProcessor
}
```

要从 Koog 代理策略访问这些实体，该特性提供了一个 `withA2AAgentServer` 函数，允许代理节点在其执行上下文中访问 A2A 服务器能力。它检索已安装的 `A2AAgentServer` 特性，并将其作为动作代码块的接收者。

```kotlin
// 在代理节点中的用法
withA2AAgentServer {
    // 'this' 现在是 A2AAgentServer 实例
    eventProcessor.sendTaskUpdate("Processing your request...", TaskState.Working)
}
```

### 启动 A2A 服务器
运行服务器后，Koog 代理将通过 A2A 协议可发现和可访问。

```kotlin
val agentCard = AgentCard(
    name = "Koog Agent",
    url = "http://localhost:9999/koog",
    description = "Simple universal agent powered by Koog",
    version = "1.0.0",
    protocolVersion = "0.3.0",
    preferredTransport = TransportProtocol.JSONRPC,
    capabilities = AgentCapabilities(streaming = true),
    defaultInputModes = listOf("text"),
    defaultOutputModes = listOf("text"),
    skills = listOf(
        AgentSkill(
            id = "koog",
            name = "Koog Agent",
            description = "Universal agent powered by Koog. Supports tool calling.",
            tags = listOf("chat", "tool"),
        )
    )
)
// 服务器设置
val server = A2AServer(agentExecutor = KoogAgentExecutor(), agentCard = agentCard)
val transport = HttpJSONRPCServerTransport(server)
transport.start(engineFactory = Netty, port = 8080, path = "/chat", wait = true)
```

## 将 Koog 代理连接到 A2A 代理

### 创建 A2A 客户端并连接到 A2A 服务器

```kotlin
val transport = HttpJSONRPCClientTransport(url = "http://localhost:9999/koog")
val agentCardResolver =
    UrlAgentCardResolver(baseUrl = "http://localhost:9999", path = "/koog")
val client = A2AClient(transport = transport, agentCardResolver = agentCardResolver)

val agentId = "koog"
client.connect()
```

### 创建 Koog 代理并将 A2A 客户端添加到 A2AAgentClient 特性
要从你的 Koog 代理连接到 A2A 代理，你可以使用 A2AAgentClient 特性，它提供了一个用于连接 A2A 代理的客户端 API。
客户端的原理与服务器相同：你安装该特性并传入 `A2AAgentClient` 特性以及 `RequestContext` 和 `SessionEventProcessor`。

```kotlin
val agent = AIAgent(
    promptExecutor = MultiLLMPromptExecutor(
        LLMProvider.Google to GoogleLLMClient("api-key")
    ),
    toolRegistry = ToolRegistry {
        // 在此处声明工具
    },
    strategy = strategy<String, Unit>("test") {

        val nodeCheckStreaming by nodeA2AClientGetAgentCard().transform { it.capabilities.streaming }

        val nodeA2ASendMessageStreaming by nodeA2AClientSendMessageStreaming()
        val nodeA2ASendMessage by nodeA2AClientSendMessage()

        val nodeProcessStreaming by node<Flow<Response<Event>>, Unit> {
            it.collect { response ->
                when (response.data) {
                    is Task -> {
                        // 处理任务
                    }

                    is A2AMessage -> {
                        // 处理消息
                    }

                    is TaskStatusUpdateEvent -> {
                        // 处理任务状态更新
                    }

                    is TaskArtifactUpdateEvent -> {
                        // 处理任务构件更新
                    }
                }
            }
        }

        val nodeProcessEvent by node<CommunicationEvent, Unit> { event ->
            when (event) {
                is Task -> {
                    // 处理任务
                }

                is A2AMessage -> {
                    // 处理消息
                }
            }
        }

        // 如果支持流式传输，则发送消息，处理响应并完成
        edge(nodeStart forwardTo nodeCheckStreaming transformed { agentId })
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessageStreaming
                onCondition { it == true } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessageStreaming forwardTo nodeProcessStreaming)
        edge(nodeProcessStreaming forwardTo nodeFinish)

        // 如果不支持流式传输，则发送消息，处理响应并完成
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessage
                onCondition { it == false } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessage forwardTo nodeProcessEvent)
        edge(nodeProcessEvent forwardTo nodeFinish)

        // 如果未能获取代理卡，则打印消息并完成
        edge(nodeCheckStreaming forwardTo nodeFinish onCondition { it == null }
            transformed { println("Failed to get agents card") }
        )

    },
    agentConfig = AIAgentConfig(
        prompt = prompt("agent") { system("You are a helpful assistant.") },
        model = GoogleModels.Gemini2_5Pro,
        maxAgentIterations = 10
    ),
) {
    install(A2AAgentClient) {
        this.a2aClients = mapOf(agentId to client)
    }
}

@OptIn(ExperimentalUuidApi::class)
private fun AIAgentGraphContextBase.buildA2ARequest(agentId: String): A2AClientRequest<MessageSendParams> =
    A2AClientRequest(
        agentId = agentId,
        callContext = ClientCallContext.Default,
        params = MessageSendParams(
            message = A2AMessage(
                messageId = Uuid.random().toString(),
                role = Role.User,
                parts = listOf(
                    TextPart(agentInput as String)
                )
            )
        )
    )