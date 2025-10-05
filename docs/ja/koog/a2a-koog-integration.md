# A2AとKoogの統合

KoogはA2Aプロトコルとのシームレスな統合を提供し、KoogエージェントをA2Aサーバーとして公開したり、Koogエージェントを他のA2A準拠エージェントに接続したりすることを可能にします。

## 概要

この統合により、主に2つのパターンが実現されます。

1.  **KoogエージェントをA2Aサーバーとして公開する** - KoogエージェントをA2Aプロトコル経由で発見可能にし、アクセスできるようにする
2.  **KoogエージェントをA2Aエージェントに接続する** - Koogエージェントが他のA2A準拠エージェントと通信できるようにする

## KoogエージェントをA2Aサーバーとして公開する

### A2A機能を持つKoogエージェントの定義

まずKoogエージェントを定義しましょう。エージェントのロジックは様々ですが、ここではツールを持つ基本的なシングルランエージェントの例を示します。
このエージェントはユーザーからのメッセージを再保存し、それをLLMに転送します。
LLMの応答にツール呼び出しが含まれている場合、エージェントはツールを実行し、その結果をLLMに転送します。
LLMの応答にアシスタントメッセージが含まれている場合、エージェントはそのアシスタントメッセージをユーザーに送信して終了します。

入力リサイズ時に、エージェントは入力メッセージと共にタスク提出イベントをA2Aクライアントに送信します。
各ツール呼び出し時に、エージェントはツール呼び出しとその結果と共にタスク作業中イベントをA2Aクライアントに送信します。
アシスタントメッセージ時に、エージェントはアシスタントメッセージと共にタスク完了イベントをA2Aクライアントに送信します。

```kotlin
/**
 * A2A機能を持つKoogエージェントを作成します
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
        // ここにツールを宣言します
    },
    strategy = strategy<A2AMessage, Unit>("test") {
        val nodeSetup by node<A2AMessage, Unit> { inputMessage ->
            // A2AメッセージをKoogメッセージに変換するためのコンビニエンス関数
            val input = inputMessage.toKoogMessage()
            llm.writeSession {
                updatePrompt {
                    message(input)
                }
            }
            // A2Aクライアントに更新イベントを送信します
            withA2AAgentServer {
                sendTaskUpdate("Request submitted: ${input.content}", TaskState.Submitted)
            }
        }

        // LLMを呼び出す
        val nodeLLMRequest by node<Unit, Message> {
            llm.writeSession {
                requestLLM()
            }
        }

        // ツールを実行する
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

        // アシスタントメッセージを送信する
        val nodeProcessAssistant by node<String, Unit> { assistantMessage ->
            withA2AAgentServer {
                sendTaskUpdate(assistantMessage, TaskState.Completed)
            }
        }

        edge(nodeStart forwardTo nodeSetup)
        edge(nodeSetup forwardTo nodeLLMRequest)

        // LLMからツール呼び出しが返された場合、ツール処理ノードに転送し、LLMに戻します
        edge(nodeLLMRequest forwardTo nodeProcessTool onToolCall { true })
        edge(nodeProcessTool forwardTo nodeLLMRequest)

        // LLMからアシスタントメッセージが返された場合、アシスタント処理ノードに転送し、その後完了します
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
 * A2Aクライアントにタスク更新イベントを送信するためのコンビニエンス関数
 * @param content メッセージの内容
 * @param state タスクの状態
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

## `A2AAgentServer`機能の仕組み

`A2AAgentServer`は、KoogエージェントとA2Aプロトコル間のシームレスな統合を可能にするKoogエージェント機能です。
`A2AAgentServer`機能は、Koogエージェント内でA2Aクライアントと通信するために使用される`RequestContext`および`SessionEventProcessor`エンティティへのアクセスを提供します。

この機能をインストールするには、エージェントで`install`関数を呼び出し、`A2AAgentServer`機能と`RequestContext`および`SessionEventProcessor`を渡します。

```kotlin
// 機能をインストールします
agent.install(A2AAgentServer) {
    this.context = context
    this.eventProcessor = eventProcessor
}
```

Koogエージェントのストラテジーからこれらのエンティティにアクセスするために、この機能は`withA2AAgentServer`関数を提供しており、これによりエージェントノードがその実行コンテキスト内でA2Aサーバー機能にアクセスできるようになります。
この関数はインストールされた`A2AAgentServer`機能を取得し、アクションブロックのレシーバーとして提供します。

```kotlin
// エージェントノード内での使用例
withA2AAgentServer {
    // ここで'this'はA2AAgentServerインスタンスです
    sendTaskUpdate("Processing your request...", TaskState.Working)
}
```

### A2Aサーバーの開始

サーバーを実行すると、KoogエージェントはA2Aプロトコル経由で発見可能になり、アクセスできるようになります。

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
// サーバーのセットアップ
val server = A2AServer(agentExecutor = KoogAgentExecutor(), agentCard = agentCard)
val transport = HttpJSONRPCServerTransport(server)
transport.start(engineFactory = CIO, port = 8080, path = "/chat", wait = true)
```

## KoogエージェントをA2Aエージェントに接続する

### A2Aクライアントを作成し、A2Aサーバーに接続する

```kotlin
val transport = HttpJSONRPCClientTransport(url = "http://localhost:9999/koog")
val agentCardResolver =
    UrlAgentCardResolver(baseUrl = "http://localhost:9999", path = "/koog")
val client = A2AClient(transport = transport, agentCardResolver = agentCardResolver)

val agentId = "koog"
client.connect()
```

### Koogエージェントを作成し、A2Aクライアントを`A2AAgentClient`機能に追加する

KoogエージェントからA2Aエージェントに接続するには、A2Aエージェントへの接続用のクライアントAPIを提供する`A2AAgentClient`機能を使用できます。
クライアントの原則はサーバーと同じです。つまり、機能をインストールし、`A2AAgentClient`機能と`RequestContext`および`SessionEventProcessor`を渡します。

```kotlin
val agent = AIAgent(
    promptExecutor = MultiLLMPromptExecutor(
        LLMProvider.Google to GoogleLLMClient("api-key")
    ),
    toolRegistry = ToolRegistry {
        // ここにツールを宣言します
    },
    strategy = strategy<String, Unit>("test") {

        val nodeCheckStreaming by nodeA2AClientGetAgentCard().transform { it.capabilities.streaming }

        val nodeA2ASendMessageStreaming by nodeA2AClientSendMessageStreaming()
        val nodeA2ASendMessage by nodeA2AClientSendMessage()

        val nodeProcessStreaming by node<Flow<Response<Event>>, Unit> {
            it.collect { response ->
                when (response.data) {
                    is Task -> {
                        // タスクを処理する
                    }

                    is A2AMessage -> {
                        // メッセージを処理する
                    }

                    is TaskStatusUpdateEvent -> {
                        // タスクステータス更新を処理する
                    }

                    is TaskArtifactUpdateEvent -> {
                        // タスクアーティファクト更新を処理する
                    }
                }
            }
        }

        val nodeProcessEvent by node<CommunicationEvent, Unit> { event ->
            when (event) {
                is Task -> {
                    // タスクを処理する
                }

                is A2AMessage -> {
                    // メッセージを処理する
                }
            }
        }

        // ストリーミングがサポートされている場合、メッセージを送信し、応答を処理して終了します
        edge(nodeStart forwardTo nodeCheckStreaming transformed { agentId })
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessageStreaming
                onCondition { it == true } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessageStreaming forwardTo nodeProcessStreaming)
        edge(nodeProcessStreaming forwardTo nodeFinish)

        // ストリーミングがサポートされていない場合、メッセージを送信し、応答を処理して終了します
        edge(
            nodeCheckStreaming forwardTo nodeA2ASendMessage
                onCondition { it == false } transformed { buildA2ARequest(agentId) }
        )
        edge(nodeA2ASendMessage forwardTo nodeProcessEvent)
        edge(nodeProcessEvent forwardTo nodeFinish)

        // ストリーミングがサポートされていない場合、メッセージを送信し、応答を処理して終了します
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