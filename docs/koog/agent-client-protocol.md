# Agent Client Protocol

Agent Client Protocol (ACP) 是一种标准化协议，使客户端应用程序能够通过一致的双向接口与 AI 智能体（Agent）进行通信。

ACP 为智能体与客户端的交互提供了一种结构化方式，支持实时事件流、工具调用通知和会话生命周期管理。

Koog 框架提供了对 ACP 的集成，使您能够构建符合 ACP 规范的智能体，从而与标准化的客户端应用程序进行通信。

要了解有关该协议的更多信息，请参阅 [Agent Client Protocol](https://agentclientprotocol.com) 文档。

## 与 Koog 集成

Koog 框架通过使用 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) 以及 `agents-features-acp` 模块中的额外 API 扩展来实现与 ACP 的集成。

此集成使 Koog 智能体能够执行以下操作：

* 与符合 ACP 规范的客户端应用程序通信
* 发送有关智能体执行的实时更新（工具调用、思考、补全）
* 自动处理标准的 ACP 事件和通知
* 在 Koog 消息格式与 ACP 内容块（content blocks）之间进行转换

### 核心组件

以下是 Koog 中 ACP 集成的主要组件：

| 组件                                                                                                                                         | 描述                                                                            |
|---------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                   | 启用 Koog 智能体与 ACP 客户端之间通信的主要功能。       |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                 | 用于在 Koog 和 ACP 格式之间转换消息的实用工具。                        |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                      | AcpAgent 功能的配置类。                                          |

## 快速入门

默认情况下，`koog-agents` 元依赖项中**不**包含 ACP 依赖项。
您必须显式地向项目中添加 ACP 模块。

### 依赖项

要在项目中使用 ACP，请添加以下依赖项：

<!--- INCLUDE
/**
-->
<!--- SUFFIX
**/
-->
```kotlin
dependencies {
    implementation("ai.koog:agents-features-acp:$koogVersion")
}
```
<!--- KNIT example-agent-client-protocol-01.kt -->

### 1. 实现 ACP 智能体支持

Koog 的 ACP 集成基于 [Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk)。
该 SDK 提供了 `AgentSupport` 和 `AgentSession` 接口，您需要实现这些接口才能将您的智能体连接到 ACP 客户端。
`AgentSupport` 负责管理智能体会话的创建和加载。该接口的实现在所有智能体中几乎相同，我们将在下文中提供一个示例实现。
`AgentSession` 负责管理智能体的实例化、调用并控制运行时。在 `prompt` 方法内部，您将定义并运行 Koog 智能体。

要在 Koog 中使用 ACP，您需要实现来自 ACP SDK 的 `AgentSupport` 和 `AgentSession` 接口：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
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
import kotlin.time.Clock
import kotlinx.serialization.json.JsonElement
import ai.koog.agents.core.dsl.builder.strategy

val promptExecutor: PromptExecutor = TODO()
val protocol: Protocol = TODO()
val clock: Clock = Clock.System
-->
```kotlin
// 实现 AgentSession 以管理 Koog 智能体的生命周期
class KoogAgentSession(
    override val sessionId: SessionId,
    private val promptExecutor: PromptExecutor,
    private val protocol: Protocol,
    private val clock: Clock,
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

        agentMutex.withLock {
            val agent = AIAgent(
                promptExecutor = promptExecutor,
                agentConfig = agentConfig,
                strategy = myStrategy()
            ) {
                install(AcpAgent) {
                    this.sessionId = this@KoogAgentSession.sessionId.value
                    this.protocol = this@KoogAgentSession.protocol
                    this.eventsProducer = this@channelFlow
                    this.setDefaultNotifications = true
                }
            }

            agentJob = async { agent.run(Unit) }
            agentJob?.await()
        }
    }

    private fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
        return withMessages { messages ->
            messages + listOf(content.toKoogMessage(clock))
        }
    }
    
    private fun myStrategy() = strategy<Unit, Unit>("") {
        // 在此处定义您的策略
    }    
    override suspend fun cancel() {
        agentJob?.cancel()
    }
}
```
<!--- KNIT example-agent-client-protocol-02.kt -->

### 2. 配置 AcpAgent 功能

`AcpAgent` 功能可以通过 `AcpConfig` 进行配置：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.features.acp.AcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.protocol.Protocol
import kotlinx.coroutines.flow.channelFlow

val promptExecutor: PromptExecutor = TODO()
val protocol: Protocol = TODO()
val sessionIdValue: String = "session-123"
val agentConfig: AIAgentConfig = TODO()
private fun myStrategy(): AIAgentGraphStrategy<Unit, Unit> = TODO()

suspend fun main() = channelFlow {
-->
<!--- SUFFIX
}
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    agentConfig = agentConfig,
    strategy = myStrategy()
) {
    install(AcpAgent) {
        // 必需：ACP 连接的唯一会话标识符
        this.sessionId = sessionIdValue

        // 必需：用于发送请求和通知的协议实例
        this.protocol = protocol

        // 必需：用于发送事件的基于协程的生产者作用域
        this.eventsProducer = this@channelFlow

        // 可选：是否注册默认通知处理程序（默认值：true）
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

关键配置选项：

- `sessionId`：ACP 连接的唯一会话标识符
- `protocol`：用于向 ACP 客户端发送请求和通知的协议实例
- `eventsProducer`：一个用于发送事件的基于协程的生产者作用域
- `setDefaultNotifications`：是否注册默认通知处理程序（默认值为 `true`）

### 3. 处理传入的提示词

使用提供的扩展函数将 ACP 内容块转换为 Koog 消息：

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
import com.agentclientprotocol.model.ContentBlock
import kotlin.time.Clock

val clock: Clock = Clock.System
val existingPrompt: Prompt = TODO()
val acpContent: List<ContentBlock> = TODO()
-->
```kotlin
// 将 ACP 内容块转换为 Koog 消息
val koogMessage = acpContent.toKoogMessage(clock)

// 附加到现有提示词
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## 默认通知处理程序

当启用 `setDefaultNotifications` 时，AcpAgent 功能会自动处理：

1. **智能体完成**：当智能体成功完成时，发送带有 `StopReason.END_TURN` 的 `PromptResponseEvent`
2. **智能体执行失败**：发送带有相应停止原因的 `PromptResponseEvent`：
    - 超过最大迭代次数时发送 `StopReason.MAX_TURN_REQUESTS`
    - 其他执行失败时发送 `StopReason.REFUSAL`
3. **LLM 响应**：将 LLM 响应转换并作为 ACP 事件发送（文本、工具调用、推理）
4. **工具调用生命周期**：报告工具调用状态的变化：
    - 工具调用开始时为 `ToolCallStatus.IN_PROGRESS`
    - 工具调用成功时为 `ToolCallStatus.COMPLETED`
    - 工具调用失败时为 `ToolCallStatus.FAILED`

## 发送自定义事件

您可以使用 `sendEvent` 方法向 ACP 客户端发送自定义事件：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.features.acp.withAcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.common.Event
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.model.SessionUpdate

val promptExecutor: PromptExecutor = TODO()
val agent: AIAgent<Unit, Unit> = TODO()
val plan: Plan = TODO()

val str = strategy<Unit, Unit>("example-agent") {
// 访问 ACP 功能并发送自定义事件
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// 访问 ACP 功能并发送自定义事件
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

此外，您可以在 `withAcpAgent` 内部使用 `protocol` 并发送自定义通知或请求：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.features.acp.withAcpAgent
import ai.koog.prompt.executor.model.PromptExecutor
import com.agentclientprotocol.model.AcpMethod
import com.agentclientprotocol.model.AuthMethodId
import com.agentclientprotocol.model.AuthenticateRequest
import com.agentclientprotocol.model.AuthenticateResponse
import com.agentclientprotocol.model.Plan
import com.agentclientprotocol.protocol.sendRequest

val promptExecutor: PromptExecutor = TODO()
val agent: AIAgent<Unit, Unit> = TODO()
val plan: Plan = TODO()

val str = strategy<Unit, Unit>("example-agent") {
// 访问 ACP 功能并发送自定义事件
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// 访问 ACP 功能并发送自定义事件
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 消息转换

该模块提供了在 Koog 和 ACP 消息格式之间进行转换的实用工具：

### ACP 到 Koog

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogContentPart
import ai.koog.agents.features.acp.toKoogMessage
import com.agentclientprotocol.model.ContentBlock
import kotlin.time.Clock

val clock: Clock = Clock.System
val acpContentBlocks: List<ContentBlock> = TODO()
val acpContentBlock: ContentBlock = TODO()
-->
```kotlin
// 将 ACP 内容块转换为 Koog 消息
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// 将单个 ACP 内容块转换为 Koog 内容部分
val contentPart = acpContentBlock.toKoogContentPart()
```
<!--- KNIT example-agent-client-protocol-07.kt -->

### Koog 到 ACP

<!--- INCLUDE
import ai.koog.agents.features.acp.toAcpContentBlock
import ai.koog.agents.features.acp.toAcpEvents
import ai.koog.prompt.message.ContentPart
import ai.koog.prompt.message.Message

val koogResponseMessage: Message.Assistant = TODO()
val koogContentPart: ContentPart = TODO()
-->
```kotlin
// 将 Koog 响应消息转换为 ACP 事件
val acpEvents = koogResponseMessage.toAcpEvents()

// 将 Koog 内容部分转换为 ACP 内容块
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 重要注意事项

### 使用 channelFlow 进行事件流传输

使用 `channelFlow` 以允许从不同的协程发送事件：

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // 安装 AcpAgent，并将 this@channelFlow 作为 eventsProducer
}
```

### 同步智能体执行

使用互斥锁（mutex）来同步对智能体实例的访问，因为在当前执行完成之前，协议不应触发新的执行：

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // 创建并运行智能体
}
```

### 手动通知处理

如果您需要自定义通知处理，请设置 `setDefaultNotifications = false` 并根据规范处理所有智能体事件：

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // 实现自定义事件处理
}
```

## 平台支持

ACP 功能目前仅在 JVM 平台上可用，因为它依赖于特定于 JVM 的 ACP Kotlin SDK。

## 使用示例

完整的运行示例可以在 [Koog 仓库](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp)中找到。

### 运行示例

1. 运行 ACP 示例应用程序：
```shell
./gradlew :examples:simple-examples:run
```

2. 为 ACP 智能体输入请求：
```shell
Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
```

3. 在控制台中观察显示智能体执行、工具调用和完成状态的事件跟踪信息。