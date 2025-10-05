# A2A 및 Koog 통합

Koog는 A2A 프로토콜과의 원활한 통합을 제공하여, Koog 에이전트를 A2A 서버로 노출하고
Koog 에이전트를 다른 A2A 호환 에이전트에 연결할 수 있도록 합니다.

## 개요

이 통합은 두 가지 주요 패턴을 가능하게 합니다:

1.  **Koog 에이전트를 A2A 서버로 노출** - A2A 프로토콜을 통해 Koog 에이전트를 검색하고 접근할 수 있도록 합니다.
2.  **Koog 에이전트를 A2A 에이전트에 연결** - Koog 에이전트가 다른 A2A 호환 에이전트와 통신하도록 합니다.

## Koog 에이전트를 A2A 서버로 노출

### A2A 기능을 사용하여 Koog 에이전트 정의

먼저 Koog 에이전트를 정의해 봅시다. 에이전트의 로직은 다양할 수 있지만, 여기 도구를 포함한 기본적인 단일 실행 에이전트 예시가 있습니다.
이 에이전트는 사용자로부터 받은 메시지를 다시 저장하고, 이를 LLM(대규모 언어 모델)으로 전달합니다.
LLM 응답에 도구 호출이 포함되어 있으면 에이전트는 도구를 실행하고 그 결과를 LLM으로 전달합니다.
LLM 응답에 어시스턴트 메시지가 포함되어 있으면 에이전트는 어시스턴트 메시지를 사용자에게 보내고 작업을 완료합니다.

입력 크기 조정 시, 에이전트는 입력 메시지와 함께 작업 제출(task submitted) 이벤트를 A2A 클라이언트에 보냅니다.
각 도구 호출 시, 에이전트는 도구 호출 및 결과와 함께 작업 중(task working) 이벤트를 A2A 클라이언트에 보냅니다.
어시스턴트 메시지 수신 시, 에이전트는 어시스턴트 메시지와 함께 작업 완료(task complete) 이벤트를 A2A 클라이언트에 보냅니다.

```kotlin
/**
 * Create a Koog agent with A2A feature
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
        // Declare tools here
    },
    strategy = strategy<A2AMessage, Unit>("test") {
        val nodeSetup by node<A2AMessage, Unit> { inputMessage ->
            // Convenience function to transform A2A message into Koog message
            val input = inputMessage.toKoogMessage()
            llm.writeSession {
                updatePrompt {
                    message(input)
                }
            }
            // Send update event to A2A client
            withA2AAgentServer {
                sendTaskUpdate("Request submitted: ${input.content}", TaskState.Submitted)
            }
        }

        // Calling llm
        val nodeLLMRequest by node<Unit, Message> {
            llm.writeSession {
                requestLLM()
            }
        }

        // Executing tool
        val nodeProcessTool by node<Message.Tool.Call, Unit> { toolCall ->
            withA2AAgentServer {
                sendTaskUpdate("Executing tool: ${toolCall.content}", TaskState.Working)
            }

            val toolResult = environment.executeTool(toolCall)

            llm.writeSession {
                updatePrompt {
                    tool {
                        result(toolResult)
                    }
                }
            }
            withA2AAgentServer {
                sendTaskUpdate("Tool result: ${toolResult.content}", TaskState.Working)
            }
        }

        // Sending assistant message
        val nodeProcessAssistant by node<String, Unit> { assistantMessage ->
            withA2AAgentServer {
                sendTaskUpdate(assistantMessage, TaskState.Completed)
            }
        }

        edge(nodeStart forwardTo nodeSetup)
        edge(nodeSetup forwardTo nodeLLMRequest)

        // If a tool call is returned from llm, forward to the tool processing node and then back to llm
        edge(nodeLLMRequest forwardTo nodeProcessTool onToolCall { true })
        edge(nodeProcessTool forwardTo nodeLLMRequest)

        // If an assistant message is returned from llm, forward to the assistant processing node and then to finish
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
 * Convenience function to send task update event to A2A client
 * @param content The message content
 * @param state The task state
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

## A2AAgentServer 기능 메커니즘

`A2AAgentServer`는 Koog 에이전트와 A2A 프로토콜 간의 원활한 통합을 가능하게 하는 Koog 에이전트 기능입니다.
`A2AAgentServer` 기능은 `RequestContext` 및 `SessionEventProcessor` 엔티티에 대한 접근을 제공하며, 이들은 Koog 에이전트 내부의 A2A 클라이언트와 통신하는 데 사용됩니다.

이 기능을 설치하려면, 에이전트에서 `install` 함수를 호출하고 `A2AAgentServer` 기능과 함께 `RequestContext` 및 `SessionEventProcessor`를 전달합니다.
```kotlin
// Install the feature
agent.install(A2AAgentServer) {
    this.context = context
    this.eventProcessor = eventProcessor
}
```

Koog 에이전트 전략에서 이러한 엔티티에 접근하려면, 이 기능은 `withA2AAgentServer` 함수를 제공하여 에이전트 노드가 실행 컨텍스트 내에서 A2A 서버 기능에 접근할 수 있도록 합니다.
이 함수는 설치된 `A2AAgentServer` 기능을 검색하여 액션 블록의 리시버(receiver)로 제공합니다.

```kotlin
// Usage within agent nodes
withA2AAgentServer {
    // 'this' is now A2AAgentServer instance
    sendTaskUpdate("Processing your request...", TaskState.Working)
}
```

### A2A 서버 시작
서버를 실행한 후 Koog 에이전트는 A2A 프로토콜을 통해 검색 및 접근 가능하게 됩니다.

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
// Server setup
val server = A2AServer(agentExecutor = KoogAgentExecutor(), agentCard = agentCard)
val transport = HttpJSONRPCServerTransport(server)
transport.start(engineFactory = CIO, port = 8080, path = "/chat", wait = true)
```

## Koog 에이전트를 A2A 에이전트에 연결

### A2A 클라이언트 생성 및 A2A 서버에 연결

```kotlin
val transport = HttpJSONRPCClientTransport(url = "http://localhost:9999/koog")
val agentCardResolver =
    UrlAgentCardResolver(baseUrl = "http://localhost:9999", path = "/koog")
val client = A2AClient(transport = transport, agentCardResolver = agentCardResolver)

val agentId = "koog"
client.connect()
```

### Koog 에이전트 생성 및 A2AAgentClient 기능에 A2A 클라이언트 추가
Koog 에이전트에서 A2A 에이전트에 연결하려면, `A2AAgentClient` 기능을 사용할 수 있으며, 이는 A2A 에이전트에 연결하기 위한 클라이언트 API를 제공합니다.
클라이언트의 원리는 서버와 동일합니다: 기능을 설치하고 `A2AAgentClient` 기능과 함께 `RequestContext` 및 `SessionEventProcessor`를 전달합니다.

```kotlin
val agent = AIAgent(
    promptExecutor = MultiLLMPromptExecutor(
        LLMProvider.Google to GoogleLLMClient("api-key")
    ),
    toolRegistry = ToolRegistry {
        // declare tools here
    },
    strategy = strategy<String, Unit>("test") {

        val nodeCheckStreaming by nodeA2AClientGetAgentCard().transform { it.capabilities.streaming }

        val nodeA2ASendMessageStreaming by nodeA2AClientSendMessageStreaming()
        val nodeA2ASendMessage by nodeA2AClientSendMessage()

        val nodeProcessStreaming by node<Flow<Response<Event>>, Unit> {
            it.collect { response ->
                when (response.data) {
                    is Task -> {
                        // Process task
                    }

                    is A2AMessage -> {
                        // Process message
                    }

                    is TaskStatusUpdateEvent -> {
                        // Process task status update
                    }

                    is TaskArtifactUpdateEvent -> {
                        // Process task artifact update
                    }
                }
            }
        }

        val nodeProcessEvent by node<CommunicationEvent, Unit> { event ->
            when (event) {
                is Task -> {
                    // Process task
                }

                is A2AMessage -> {
                    // Process message
                }
            }
        }

        // If streaming is supported, send a message, process response and finish
        edge(nodeStart forwardTo nodeCheckStreaming transformed { agentId })
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessageStreaming
                onCondition { it == true } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessageStreaming forwardTo nodeProcessStreaming)
        edge(nodeProcessStreaming forwardTo nodeFinish)

        // If streaming is not supported, send a message, process response and finish
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessage
                onCondition { it == false } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessage forwardTo nodeProcessEvent)
        edge(nodeProcessEvent forwardTo nodeFinish)

        // If streaming is not supported, send a message, process response and finish
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