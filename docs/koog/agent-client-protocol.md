# Agent Client Protocol

Agent Client Protocol (ACP) 是一种开源的标准化协议，使客户端应用程序能够通过一致的双向接口与 AI 智能体进行通信。通过在您的 Koog 智能体中实现 ACP，您可以确保它能够轻松集成到任何符合 ACP 规范的环境中，例如 IDE。

要了解更多信息，请参阅 [Agent Client Protocol] 文档。

## 与 Koog 集成

Koog 框架使用 [ACP Kotlin SDK] 以及额外的 API 扩展来实现与 ACP 的集成。此集成提供：

* Koog 智能体与符合 ACP 规范的客户端应用程序之间的标准化通信
* 工具调用、智能体思考和完成状态的自动执行更新
* Koog 多模态消息格式与 ACP 内容块 (content blocks) 之间的无缝消息转换
* Koog 智能体状态到 ACP 会话事件的生命周期映射

!!! note

    由于 [ACP Kotlin SDK] 是 JVM 特定的，因此 ACP 集成目前仅在 JVM 平台上可用。

### 添加依赖项

ACP 支持是一项可选[功能](features/index.md)，默认情况下在 Koog 中不可用。要在您的 Koog 智能体中实现 ACP，请添加 [ai.koog:agents-features-acp](https://mvnrepository.com/artifact/ai.koog/agents-features-acp) 依赖项，该依赖项本身依赖于 [com.agentclientprotocol:acp](https://mvnrepository.com/artifact/com.agentclientprotocol:acp)。

例如，在使用 `build.gradle.kts` 的情况下：

```kotlin
dependencies {
    implementation("ai.koog:agents-features-acp:$koogVersion")
}
```

### 为 Koog 智能体启用 ACP

要将 Koog 智能体的内部[事件系统](agent-events.md)与 ACP 协议桥接，请安装 `ai.koog.agents.features.acp.AcpAgent` 功能。安装后，它会侦听生命周期事件（如工具调用或 LLM 响应）并将它们发送到 ACP 客户端。

<!--- CLEAR -->
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
) {
    install(AcpAgent) {
        this.sessionId = sessionId
        this.protocol = protocol
        this.eventsProducer = eventsProducer
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-01.kt -->

关键配置选项：

*   **`sessionId`**: 标识当前对话会话的唯一字符串。
*   **`protocol`**: 用于底层通信的 [`com.agentclientprotocol.protocol.Protocol`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/protocol/Protocol.kt) 实例。
*   **`eventsProducer`**: 发送 ACP 事件的 `kotlinx.coroutines.channels.ProducerScope<Event>`。有关更多信息，请参阅[事件流](#event-streaming)。
*   **`setDefaultNotifications`**: 是否为智能体生命周期事件注册默认通知处理程序。有关更多信息，请参阅[处理智能体通知](#handling-agent-notifications)。

如后续章节所述，此智能体必须在 ACP 会话的作用域内运行。

### 实现支持 ACP 的智能体

要将您的 Koog 智能体连接到 ACP 客户端，请实现来自 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) 的两个核心接口：

- [`AgentSupport`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSupport.kt): 管理智能体的身份、能力和会话生命周期（创建或加载会话）。
- [`AgentSession`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSession.kt): 管理单个对话会话，处理 `prompt` 执行并管理取消操作。

您应该在 `AgentSession` 的 `prompt()` 方法内初始化并运行支持 ACP 的 Koog 智能体。示例如下：

=== "AgentSession"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.agents.features.acp.AcpAgent
    import ai.koog.agents.features.acp.toKoogMessage
    import ai.koog.prompt.Prompt
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.model.PromptExecutor
    import com.agentclientprotocol.agent.AgentSession
    import com.agentclientprotocol.common.Event
    import com.agentclientprotocol.model.ContentBlock
    import com.agentclientprotocol.model.SessionId
    import com.agentclientprotocol.protocol.Protocol
    import kotlinx.coroutines.Deferred
    import kotlinx.coroutines.async
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.channelFlow
    import kotlinx.coroutines.sync.Mutex
    import kotlinx.coroutines.sync.withLock
    import ai.koog.utils.time.KoogClock
    import kotlinx.serialization.json.JsonElement
    -->
    ```kotlin
    class MyAgentSession(
        override val sessionId: SessionId,
        private val promptExecutor: PromptExecutor,
        private val protocol: Protocol,
        private val clock: KoogClock
    ) : AgentSession {
    
        private var agentJob: Deferred<Unit>? = null
        private val agentMutex = Mutex()
    
        override suspend fun prompt(
            content: List<ContentBlock>,
            _meta: JsonElement?
        ): Flow<Event> = channelFlow {
            val agentConfig = AIAgentConfig(
                prompt = prompt("acp") {
                    system("You are a helpful assistant.")
                }.appendPrompt(content),
                model = OpenAIModels.Chat.GPT4o,
                maxAgentIterations = 1000
            )
    
            // 确保一次只运行一个智能体会话
            agentMutex.withLock {
                val agent = AIAgent(
                    promptExecutor = promptExecutor,
                    agentConfig = agentConfig
                ) {
                    install(AcpAgent) {
                        this.sessionId = this@MyAgentSession.sessionId.value
                        this.protocol = this@MyAgentSession.protocol
                        this.eventsProducer = this@channelFlow
                        this.setDefaultNotifications = true
                    }
                }

                agentJob = async { agent.run("Hello. How can you help me?") }
                agentJob?.await()
            }
        }
    
        private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
            return withMessages { messages ->
                messages + listOf(content.toKoogMessage(clock))
            }
        }
    
        override suspend fun cancel() {
            agentJob?.cancel()
        }
    }
    ```
    <!--- KNIT example-agent-client-protocol-02.kt -->

=== "AgentSupport"

    <!--- INCLUDE
    import ai.koog.prompt.executor.model.PromptExecutor
    import com.agentclientprotocol.agent.AgentInfo
    import com.agentclientprotocol.agent.AgentSession
    import com.agentclientprotocol.agent.AgentSupport
    import com.agentclientprotocol.client.ClientInfo
    import com.agentclientprotocol.common.Event
    import com.agentclientprotocol.common.SessionCreationParameters
    import com.agentclientprotocol.model.AgentCapabilities
    import com.agentclientprotocol.model.ContentBlock
    import com.agentclientprotocol.model.LATEST_PROTOCOL_VERSION
    import com.agentclientprotocol.model.PromptCapabilities
    import com.agentclientprotocol.model.SessionId
    import com.agentclientprotocol.protocol.Protocol
    import kotlinx.coroutines.flow.Flow
    import kotlinx.serialization.json.JsonElement
    import ai.koog.utils.time.KoogClock
    import kotlin.uuid.ExperimentalUuidApi
    import kotlin.uuid.Uuid
    class MyAgentSession(
        override val sessionId: SessionId,
        private val promptExecutor: PromptExecutor,
        private val protocol: Protocol,
        private val clock: KoogClock
    ): AgentSession {
        override suspend fun prompt(
            content: List<ContentBlock>,
            _meta: JsonElement?
        ): Flow<Event> {
            TODO("Not yet implemented")
        }
    }
    -->
    ```kotlin
    class MyAgentSupport(
        private val promptExecutor: PromptExecutor,
        private val clock: KoogClock,
        private val protocol: Protocol,
    ) : AgentSupport {
    
        override suspend fun initialize(clientInfo: ClientInfo): AgentInfo {
            return AgentInfo(
                protocolVersion = LATEST_PROTOCOL_VERSION,
                capabilities = AgentCapabilities(
                    loadSession = false, // 如果您实现了会话持久化，请设置为 true
                    promptCapabilities = PromptCapabilities(
                        audio = false,
                        image = false,
                        embeddedContext = true
                    )
                )
            )
        }
    
        @OptIn(ExperimentalUuidApi::class)
        override suspend fun createSession(sessionParameters: SessionCreationParameters): AgentSession {
            val sessionId = SessionId(Uuid.random().toString())
            return MyAgentSession(sessionId, promptExecutor, protocol, clock)
        }
    
        override suspend fun loadSession(sessionId: SessionId, sessionParameters: SessionCreationParameters): AgentSession {
            throw UnsupportedOperationException("Session loading not implemented")
        }
    }
    ```
    <!--- KNIT example-agent-client-protocol-03.kt -->

## 事件流

示例中的 `AgentSession` 定义了一个 `prompt()` 函数，该函数返回一个事件 `channelFlow`。然后，您安装 `AcpAgent` 功能，并将 `this@channelFlow` 作为 `eventsProducer`。这允许从不同的协程发送事件。

## 执行同步

示例中的 `AgentSession` 使用互斥锁 (mutex) 来同步对智能体实例的访问，因为在之前的执行完成之前，ACP 不应触发新的智能体执行。为此，创建和运行智能体发生在为定义的互斥锁指定的 `withLock` 作用域内。

您还在 `channelFlow` 作用域内以延迟作业 `agentJob` 的形式异步运行智能体，以确保智能体不会被过早取消。

## 处理 ACP 客户端输入

ACP 客户端将用户输入作为 [`ContentBlock`](https://agentclientprotocol.com/protocol/schema#contentblock) 对象列表发送。要在 Koog 中处理这些内容，请使用 `List<ContentBlock>.toKoogMessage()` 扩展函数将 ACP 内容块转换为 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)，并将其附加到您的[智能体提示词](prompts/index.md)中。

示例中的 `AgentSession` 定义了一个私有函数，用于在 ACP 会话中扩展初始智能体提示词：

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.Prompt
import com.agentclientprotocol.model.ContentBlock
import ai.koog.utils.time.KoogClock

val clock: KoogClock = KoogClock.System
-->
```kotlin
private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

!!! note

    消息的时间戳需要一个 `KoogClock` 实例。

有关更多信息，请参阅[转换消息](#converting-messages)。

## 转换消息

`agents-features-acp` 模块提供了扩展函数，可在 Koog 的内部消息类型与 [ACP 内容块](https://agentclientprotocol.com/protocol/content)之间进行无缝转换。

接收来自 ACP 客户端的输入时，请使用以下函数：

- `List<ContentBlock>.toKoogMessage()` 将 ACP 内容块列表转换为 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)
- `ContentBlock.toKoogContentPart()` 将单个 ACP 内容块转换为 [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart)

根据 Koog 消息构建 ACP 事件或内容块时，请使用以下函数：

- `Message.Response.toAcpEvents()` 将 [`Message.Response`](api:prompt-model::ai.koog.prompt.message.Message.Response) 转换为 ACP 会话更新事件列表
- `ContentPart.toAcpContentBlock()` 将 [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) 转换为单个 ACP 内容块

## 处理智能体通知

默认情况下，`setDefaultNotifications` 设置为 `true`，启用 ACP 的智能体会自动处理以下通知：

- **智能体完成**

    当智能体成功完成时，发送带有 `StopReason.END_TURN` 的 `PromptResponseEvent`

- **智能体执行失败**

    发送带有相应停止原因的 `PromptResponseEvent`：

    - 当智能体超过最大迭代次数时，发送 `StopReason.MAX_TURN_REQUESTS`
    - 对于其他执行失败，发送 `StopReason.REFUSAL`
  
- **LLM 响应**

    转换并发送 LLM 响应作为 ACP 事件（文本、工具调用、推理）

- **工具调用生命周期**

    报告工具调用状态变化：

    - 当工具调用开始时，发送 `ToolCallStatus.IN_PROGRESS`
    - 当工具调用成功时，发送 `ToolCallStatus.COMPLETED`
    - 当工具调用失败时，发送 `ToolCallStatus.FAILED`

如果您想自定义通知处理，请将 `setDefaultNotifications = false` 并根据规范处理智能体事件。

## 发送自定义事件

除了自动通知外，您还可以在智能体执行期间的任何时间点使用 `sendEvent` 在 `withAcpAgent` 块内向 ACP 客户端发送自定义事件。这对于进度更新、自定义状态消息或计划更新非常有用。

您可以在 `AIAgentContext` 内部执行此操作，例如在节点中：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.features.acp.withAcpAgent
import com.agentclientprotocol.common.Event
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.model.SessionUpdate
import com.agentclientprotocol.protocol.sendRequest
-->
```kotlin
val plan: Plan = TODO()

val strategy = strategy<Unit, Unit>("my-strategy") {
    val node by node<Unit, Unit> {
        withAcpAgent {
            sendEvent(
                Event.SessionUpdateEvent(
                    SessionUpdate.PlanUpdate(plan.entries)
                )
            )
        }
    }
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

您还可以访问底层的 `protocol` 以向客户端发送自定义请求，例如身份验证请求：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.features.acp.withAcpAgent
import com.agentclientprotocol.model.AcpMethod
import com.agentclientprotocol.model.AuthMethodId
import com.agentclientprotocol.model.AuthenticateRequest
import com.agentclientprotocol.protocol.sendRequest
-->
```kotlin
val strategy = strategy<Unit, Unit>("my-strategy") {
    val node by node<Unit, Unit> {
        withAcpAgent {
            protocol.sendRequest(
                AcpMethod.AgentMethods.Authenticate,
                AuthenticateRequest(methodId = AuthMethodId("Google"))
            )
        }
    }
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 示例

您可以在 Koog 仓库的 [/examples](https://github.com/JetBrains/koog/tree/develop/examples/) 目录下找到 Koog 智能体的运行示例。

### 运行基于控制台的 ACP 客户端

此示例运行一个基于控制台的 ACP 客户端，该客户端与一个简单的 Koog 智能体进行交互。

1. 打开 [/examples/simple-examples](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/)。
2. 请参阅 [README](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/README.md) 了解如何为 LLM 提供商配置 API 密钥。
3. 运行 `runExampleAcpApp` Gradle 任务。
4. 当 ACP 客户端在控制台中启动后，输入智能体请求，例如：
    ```text
    List files in the current directory and create a new file named 'acp-test.txt' with the content 'Hello from ACP!'.
    ```
5. 观察控制台中的事件跟踪，了解 Koog 事件如何转换为 ACP 事件并发送到客户端。

### 将支持 ACP 的 Koog 智能体连接到 JetBrains IDE

此示例演示如何创建一个支持 ACP 的智能体并连接到 IntelliJ IDEA。

1. 打开 [/examples/acp-agent](https://github.com/JetBrains/koog/tree/develop/examples/acp-agent)
2. 运行 `installDist` Gradle 任务。
3. 这应该会创建智能体可执行文件：`build/install/acp-agent/bin/acp-agent`（Windows 系统为 `acp-agent.bat`）。
4. 打开 IntelliJ IDEA（或其他 JetBrains IDE）。
5. 转到 **AI Chat** > **Options** > **Add Custom Agent**。
6. 在打开的 `acp.json` 文件中，粘贴以下内容：

    ```json
    {
        "agent_servers": {
            "Koog Agent": {
                "command": "/absolute/path/to/acp-agent/build/install/acp-agent/bin/acp-agent",
                "args": [],
                "env": {
                    "OPENAI_API_KEY": "在此粘贴您的 API 密钥"
                }
            }
        }
    }
    ```

    配置参数：

    - `agent_servers`: 包含一个或多个智能体配置的对象
    - `Koog Agent`: 在 IDE 的智能体选择器中显示的名称
    - `command`: 智能体可执行文件的绝对路径
    - `args`: 命令行参数（此智能体为空）
    - `env`: 传递给智能体进程的环境变量（在此示例中为 OpenAI API 密钥）

7. 该智能体应该会在 **AI Chat** 工具窗口中可用。

有关将自定义智能体添加到 IDE 的更多信息，请参阅 [AI Assistant 文档](https://www.jetbrains.com/help/ai-assistant/acp.html#add-custom-agent)和[这篇博客文章](https://blog.jetbrains.com/ai/2026/02/koog-x-acp-connect-an-agent-to-your-ide-and-more/)。

[Agent Client Protocol]: https://agentclientprotocol.com
[ACP Kotlin SDK]: https://github.com/agentclientprotocol/kotlin-sdk