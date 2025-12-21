# 代理程式用戶端協定

代理程式用戶端協定 (Agent Client Protocol, ACP) 是一種標準化協定，它使戶端應用程式能夠透過一致、雙向的介面與 AI 代理程式進行通訊。

ACP 提供了一種結構化的方式讓代理程式與用戶端互動，支援即時事件串流、工具呼叫通知以及工作階段生命週期管理。

Koog 框架提供了與 ACP 的整合，使您能夠建構符合 ACP 規範的代理程式，以便與標準化的用戶端應用程式進行通訊。

若要了解有關此協定的更多資訊，請參閱 [Agent Client Protocol](https://agentclientprotocol.com) 文件。

## 與 Koog 整合

Koog 框架使用 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) 與 ACP 整合，並在 `agents-features-acp` 模組中提供額外的 API 擴充功能。

此整合讓 Koog 代理程式能夠執行以下操作：

*   與符合 ACP 規範的用戶端應用程式通訊
*   傳送有關代理程式執行的即時更新（工具呼叫、想法、完成）
*   自動處理標準 ACP 事件與通知
*   在 Koog 訊息格式與 ACP 內容區塊之間進行轉換

### 主要元件

以下是 Koog 中 ACP 整合的主要元件：

| 元件                                                                                                                                              | 說明                                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------ |
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                     | 啟用 Koog 代理程式與 ACP 用戶端之間通訊的主要功能。                   |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                  | 用於在 Koog 和 ACP 格式之間轉換訊息的工具程式。                   |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                       | `AcpAgent` 功能的配置類別。                                                |

## 開始使用

ACP 依賴項預設 **不** 包含在 `koog-agents` 元依賴項中。
您必須明確地將 ACP 模組加入您的專案。

### 依賴項

要在您的專案中使用 ACP，請加入以下依賴項：

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

### 1. 實作 ACP 代理程式支援

Koog ACP 整合基於 [Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk)。
SDK 提供了 `AgentSupport` 和 `AgentSession` 介面，您需要實作它們才能將您的代理程式連接到 ACP 用戶端。
`AgentSupport` 管理代理程式工作階段的建立和載入。該介面實作對於所有代理程式來說幾乎相同，我們將進一步提供範例實作。
`AgentSession` 管理代理程式的實例化、呼叫和控制執行時間。在 `prompt` 方法內部，您將定義並執行 Koog 代理程式。

若要將 ACP 與 Koog 搭配使用，您需要實作 ACP SDK 中的 `AgentSupport` 和 `AgentSession` 介面：

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
import kotlinx.datetime.Clock
import kotlinx.serialization.json.JsonElement
import ai.koog.agents.core.dsl.builder.strategy

val promptExecutor: PromptExecutor = TODO()
val protocol: Protocol = TODO()
val clock: Clock = Clock.System
-->
```kotlin
// Implement AgentSession to manage the lifecycle of a Koog agent
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
        // Define your strategy here
    }    
    override suspend fun cancel() {
        agentJob?.cancel()
    }
}
```
<!--- KNIT example-agent-client-protocol-02.kt -->

### 2. 配置 AcpAgent 功能

`AcpAgent` 功能可以透過 `AcpConfig` 進行配置：

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
        // Required: The unique session identifier for the ACP connection
        this.sessionId = sessionIdValue

        // Required: The protocol instance used for sending requests and notifications
        this.protocol = protocol

        // Required: A coroutine-based producer scope for sending events
        this.eventsProducer = this@channelFlow

        // Optional: Whether to register default notification handlers (default: true)
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

主要配置選項：

*   `sessionId`：ACP 連線的唯一工作階段識別碼
*   `protocol`：用於傳送請求和通知給 ACP 用戶端的協定實例
*   `eventsProducer`：用於傳送事件的基於協程的生產者作用域
*   `setDefaultNotifications`：是否註冊預設通知處理器（預設值：`true`）

### 3. 處理傳入的提示

使用提供的擴充功能將 ACP 內容區塊轉換為 Koog 訊息：

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
import com.agentclientprotocol.model.ContentBlock
import kotlinx.datetime.Clock

val clock: Clock = Clock.System
val existingPrompt: Prompt = TODO()
val acpContent: List<ContentBlock> = TODO()
-->
```kotlin
// Convert ACP content blocks to Koog message
val koogMessage = acpContent.toKoogMessage(clock)

// Append to existing prompt
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## 預設通知處理器

當啟用 `setDefaultNotifications` 時，`AcpAgent` 功能會自動處理：

1.  **代理程式完成**：當代理程式成功完成時，傳送帶有 `StopReason.END_TURN` 的 `PromptResponseEvent`
2.  **代理程式執行失敗**：傳送帶有適當停止原因的 `PromptResponseEvent`：
    *   當超出最大迭代次數時，為 `StopReason.MAX_TURN_REQUESTS`
    *   對於其他執行失敗，為 `StopReason.REFUSAL`
3.  **LLM 回應**：將 LLM 回應轉換並作為 ACP 事件傳送（文字、工具呼叫、推理）
4.  **工具呼叫生命週期**：報告工具呼叫狀態變更：
    *   當工具呼叫開始時，為 `ToolCallStatus.IN_PROGRESS`
    *   當工具呼叫成功時，為 `ToolCallStatus.COMPLETED`
    *   當工具呼叫失敗時，為 `ToolCallStatus.FAILED`

## 傳送自訂事件

您可以使用 `sendEvent` 方法將自訂事件傳送給 ACP 用戶端：

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
// Access the ACP feature and send custom events
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// Access the ACP feature and send custom events
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

此外，您可以在 `withAcpAgent` 內部使用 `protocol` 並傳送自訂通知或請求：
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
// Access the ACP feature and send custom events
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// Access the ACP feature and send custom events
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 訊息轉換

該模組提供了在 Koog 和 ACP 訊息格式之間轉換的工具程式：

### ACP 到 Koog

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogContentPart
import ai.koog.agents.features.acp.toKoogMessage
import com.agentclientprotocol.model.ContentBlock
import kotlinx.datetime.Clock

val clock: Clock = Clock.System
val acpContentBlocks: List<ContentBlock> = TODO()
val acpContentBlock: ContentBlock = TODO()
-->
```kotlin
// Convert ACP content blocks to Koog message
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// Convert single ACP content block to Koog content part
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
// Convert Koog response message to ACP events
val acpEvents = koogResponseMessage.toAcpEvents()

// Convert Koog content part to ACP content block
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 重要注意事項

### 使用 channelFlow 進行事件串流

使用 `channelFlow` 允許從不同的協程傳送事件：

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // Install AcpAgent with this@channelFlow as eventsProducer
}
```

### 同步代理程式執行

使用互斥鎖 (Mutex) 同步對代理程式實例的存取，因為協定不應在先前的執行完成之前觸發新的執行：

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // Create and run agent
}
```

### 手動通知處理

如果您需要自訂通知處理，請設定 `setDefaultNotifications = false` 並根據規範處理所有代理程式事件：

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // Implement custom event handling
}
}
```

## 平台支援

ACP 功能目前僅在 JVM 平台上可用，因為它依賴於 JVM 專用的 ACP Kotlin SDK。

## 使用範例

完整的範例可以在 [Koog 儲存庫](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp)中找到。

### 執行範例

1.  執行 ACP 範例應用程式：
    ```shell
    ./gradlew :examples:simple-examples:run
    ```

2.  為 ACP 代理程式輸入一個請求：
    ```shell
    Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
    ```

3.  觀察控制台中顯示的事件追蹤，它會顯示代理程式的執行、工具呼叫和完成狀態。