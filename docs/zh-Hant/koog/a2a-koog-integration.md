# A2A 與 Koog 整合

Koog 提供了與 A2A 協定的無縫整合，讓您可以將 Koog 代理程式公開為 A2A 伺服器，並將 Koog 代理程式連接到其他符合 A2A 協定的代理程式。

## 依賴項

A2A Koog 整合需要根據您的使用情境，加入特定的功能模組：

### 用於將 Koog 代理程式公開為 A2A 伺服器

將這些依賴項加入您的 `build.gradle.kts`：

```kotlin
dependencies {
    // Koog A2A 伺服器整合功能
    implementation("ai.koog:agents-features-a2a-server:$koogVersion")

    // HTTP JSON-RPC 傳輸
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor 伺服器引擎 (請選擇適合您需求的)
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

### 用於連接 Koog 代理程式至 A2A 代理程式

將這些依賴項加入您的 `build.gradle.kts`：

```kotlin
dependencies {
    // Koog A2A 客戶端整合功能
    implementation("ai.koog:agents-features-a2a-client:$koogVersion")

    // HTTP JSON-RPC 傳輸
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor 客戶端引擎 (請選擇適合您需求的)
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概述

此整合支援兩種主要模式：

1.  **將 Koog 代理程式公開為 A2A 伺服器** - 透過 A2A 協定讓您的 Koog 代理程式可被發現與存取
2.  **連接 Koog 代理程式至 A2A 代理程式** - 讓您的 Koog 代理程式能與其他符合 A2A 協定的代理程式通訊

## 將 Koog 代理程式公開為 A2A 伺服器

### 定義具有 A2A 功能的 Koog 代理程式

讓我們先定義一個 Koog 代理程式。代理程式的邏輯可能有所不同，但這裡是一個包含工具的基本單次執行代理程式範例。
此代理程式會重新儲存來自使用者的訊息，並將其轉發給 LLM。
如果 LLM 回應包含工具呼叫，代理程式會執行該工具並將結果轉發給 LLM。
如果 LLM 回應包含助理訊息，代理程式會將助理訊息傳送給使用者並完成任務。

當輸入處理時，代理程式會將包含輸入訊息的任務提交事件傳送給 A2A 客戶端。
每次工具呼叫時，代理程式會將包含工具呼叫和結果的任務執行中事件傳送給 A2A 客戶端。
當收到助理訊息時，代理程式會將包含助理訊息的任務完成事件傳送給 A2A 客戶端。

```kotlin
/**
 * 建立一個具有 A2A 功能的 Koog 代理程式
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
        // 在此宣告工具
    },
    strategy = strategy<A2AMessage, Unit>("test") {
        val nodeSetup by node<A2AMessage, Unit> { inputMessage ->
            // 將 A2A 訊息轉換為 Koog 訊息的便捷函式
            val input = inputMessage.toKoogMessage()
            llm.writeSession {
                appendPrompt {
                    message(input)
                }
            }
            // 將更新事件傳送給 A2A 客戶端
            withA2AAgentServer {
                sendTaskUpdate("Request submitted: ${input.content}", TaskState.Submitted)
            }
        }

        // 呼叫 LLM
        val nodeLLMRequest by node<Unit, Message> {
            llm.writeSession {
                requestLLM()
            }
        }

        // 執行工具
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

        // 傳送助理訊息
        val nodeProcessAssistant by node<String, Unit> { assistantMessage ->
            withA2AAgentServer {
                sendTaskUpdate(assistantMessage, TaskState.Completed)
            }
        }

        edge(nodeStart forwardTo nodeSetup)
        edge(nodeSetup forwardTo nodeLLMRequest)

        // 如果 LLM 返回工具呼叫，轉發至工具處理節點，然後再返回 LLM
        edge(nodeLLMRequest forwardTo nodeProcessTool onToolCall { true })
        edge(nodeProcessTool forwardTo nodeLLMRequest)

        // 如果 LLM 返回助理訊息，轉發至助理處理節點，然後完成
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
 * 將任務更新事件傳送給 A2A 客戶端的便捷函式
 * @param content 訊息內容
 * @param state 任務狀態
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

## A2AAgentServer 功能機制

`A2AAgentServer` 是一個 Koog 代理程式功能，它實現了 Koog 代理程式與 A2A 協定之間的無縫整合。
`A2AAgentServer` 功能提供了對 `RequestContext` 和 `SessionEventProcessor` 實體的存取，這些實體用於 Koog 代理程式內部與 A2A 客戶端通訊。

要安裝此功能，請在代理程式上呼叫 `install` 函式，並傳遞 `A2AAgentServer` 功能以及 `RequestContext` 和 `SessionEventProcessor`：

```kotlin
// 安裝此功能
install(A2AAgentServer) {
    this.context = context
    this.eventProcessor = eventProcessor
}
```

為了從 Koog 代理程式策略中存取這些實體，此功能提供了一個 `withA2AAgentServer` 函式，允許代理程式節點在其執行上下文內存取 A2A 伺服器功能。
它會檢索已安裝的 `A2AAgentServer` 功能，並將其作為動作區塊的接收者。

```kotlin
// 在代理程式節點中的用法
withA2AAgentServer {
    // 此處的 'this' 是 A2AAgentServer 實例
    eventProcessor.sendTaskUpdate("正在處理您的請求...", TaskState.Working)
}
```

### 啟動 A2A 伺服器
運行伺服器後，Koog 代理程式將可透過 A2A 協定被發現與存取。

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
// 伺服器設定
val server = A2AServer(agentExecutor = KoogAgentExecutor(), agentCard = agentCard)
val transport = HttpJSONRPCServerTransport(server)
transport.start(engineFactory = Netty, port = 8080, path = "/chat", wait = true)
```

## 連接 Koog 代理程式至 A2A 代理程式

### 建立 A2A 客戶端並連接至 A2A 伺服器

```kotlin
val transport = HttpJSONRPCClientTransport(url = "http://localhost:9999/koog")
val agentCardResolver =
    UrlAgentCardResolver(baseUrl = "http://localhost:9999", path = "/koog")
val client = A2AClient(transport = transport, agentCardResolver = agentCardResolver)

val agentId = "koog"
client.connect()
```

### 建立 Koog 代理程式並將 A2A 客戶端添加到 A2AAgentClient 功能

要從您的 Koog 代理程式連接到 A2A 代理程式，您可以使用 A2AAgentClient 功能，它提供了用於連接 A2A 代理程式的客戶端 API。
客戶端的原則與伺服器相同：您安裝該功能並傳遞 `A2AAgentClient` 功能以及 `RequestContext` 和 `SessionEventProcessor`。

```kotlin
val agent = AIAgent(
    promptExecutor = MultiLLMPromptExecutor(
        LLMProvider.Google to GoogleLLMClient("api-key")
    ),
    toolRegistry = ToolRegistry {
        // 在此宣告工具
    },
    strategy = strategy<String, Unit>("test") {

        val nodeCheckStreaming by nodeA2AClientGetAgentCard().transform { it.capabilities.streaming }

        val nodeA2ASendMessageStreaming by nodeA2AClientSendMessageStreaming()
        val nodeA2ASendMessage by nodeA2AClientSendMessage()

        val nodeProcessStreaming by node<Flow<Response<Event>>, Unit> {
            it.collect { response ->
                when (response.data) {
                    is Task -> {
                        // 處理任務
                    }

                    is A2AMessage -> {
                        // 處理訊息
                    }

                    is TaskStatusUpdateEvent -> {
                        // 處理任務狀態更新
                    }

                    is TaskArtifactUpdateEvent -> {
                        // 處理任務 Artifact 更新
                    }
                }
            }
        }

        val nodeProcessEvent by node<CommunicationEvent, Unit> { event ->
            when (event) {
                is Task -> {
                    // 處理任務
                }

                is A2AMessage -> {
                    // 處理訊息
                }
            }
        }

        // 如果支援串流，傳送訊息，處理回應並完成
        edge(nodeStart forwardTo nodeCheckStreaming transformed { agentId })
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessageStreaming
                onCondition { it == true } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessageStreaming forwardTo nodeProcessStreaming)
        edge(nodeProcessStreaming forwardTo nodeFinish)

        // 如果不支援串流，傳送訊息，處理回應並完成
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessage
                onCondition { it == false } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessage forwardTo nodeProcessEvent)
        edge(nodeProcessEvent forwardTo nodeFinish)

        // 如果不支援串流，傳送訊息，處理回應並完成
        edge(nodeCheckStreaming forwardTo nodeFinish onCondition { it == null }
            transformed { println("無法取得代理程式卡片") }
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