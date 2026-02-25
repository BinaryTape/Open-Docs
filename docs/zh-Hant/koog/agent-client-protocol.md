# Agent Client Protocol

Agent Client Protocol (ACP) 是一種標準化通訊協定，讓用戶端應用程式能透過一致的雙向介面與 AI 代理 (agent) 進行通訊。

ACP 為代理與用戶端互動提供了一種結構化方式，支援即時事件串流、工具呼叫通知以及工作階段生命週期管理。

Koog 架構提供了與 ACP 的整合，讓您能夠建置符合 ACP 規範的代理，並與標準化的用戶端應用程式進行通訊。

若要了解更多關於此通訊協定的資訊，請參閱 [Agent Client Protocol](https://agentclientprotocol.com) 文件。

## 與 Koog 整合

Koog 架構使用 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) 並搭配 `agents-features-acp` 模組中的額外 API 擴充套件來整合 ACP。

此整合讓 Koog 代理可以執行以下操作：

* 與符合 ACP 規範的用戶端應用程式進行通訊
* 傳送關於代理執行的即時更新（工具呼叫、想法、補全）
* 自動處理標準 ACP 事件與通知
* 在 Koog 訊息格式與 ACP 內容區塊之間進行轉換

### 核心組件

以下是 Koog 中 ACP 整合的主要組件：

| 組件                                                                                                                                              | 說明                                                                                   |
|---------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                   | 啟用 Koog 代理與 ACP 用戶端之間通訊的主要功能 (feature)。                              |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                 | 用於在 Koog 與 ACP 格式之間轉換訊息的公用程式。                                       |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                      | AcpAgent 功能的設定類別。                                                              |

## 快速入門

ACP 相依性預設 **不** 包含在 `koog-agents` 元相依性 (meta-dependency) 中。
您必須明確地將 ACP 模組新增至您的專案。

### 相依性

若要在專案中使用 ACP，請新增以下相依性：

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

### 1. 實作 ACP 代理支援

Koog 的 ACP 整合是以 [Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk) 為基礎。
該 SDK 提供了 `AgentSupport` 與 `AgentSession` 介面，您需要實作這些介面才能將您的代理連接至 ACP 用戶端。
`AgentSupport` 負責管理代理工作階段的建立與載入。對於所有代理而言，此介面的實作幾乎相同，我們稍後會提供範例實作。
`AgentSession` 負責管理代理的具現化、叫用以及控制執行階段。在 `prompt` 方法中，您將定義並執行 Koog 代理。

若要在 Koog 中使用 ACP，您需要實作來自 ACP SDK 的 `AgentSupport` 與 `AgentSession` 介面：

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
// 實作 AgentSession 以管理 Koog 代理的生命週期
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
        // 在此定義您的策略
    }    
    override suspend fun cancel() {
        agentJob?.cancel()
    }
}
```
<!--- KNIT example-agent-client-protocol-02.kt -->

### 2. 設定 AcpAgent 功能 (feature)

`AcpAgent` 功能可以透過 `AcpConfig` 進行設定：

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
        // 必填：ACP 連線的唯一工作階段識別符
        this.sessionId = sessionIdValue

        // 必填：用於傳送請求與通知的協定執行個體
        this.protocol = protocol

        // 必填：用於傳送事件的協程型產生器範疇 (producer scope)
        this.eventsProducer = this@channelFlow

        // 選填：是否註冊預設通知處理常式（預設值：true）
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

關鍵設定選項：

- `sessionId`：ACP 連線的唯一工作階段識別符
- `protocol`：用於向 ACP 用戶端傳送請求與通知的協定執行個體
- `eventsProducer`：用於傳送事件的協程型產生器範疇 (producer scope)
- `setDefaultNotifications`：是否註冊預設通知處理常式（預設值為 `true`）

### 3. 處理傳入的提示

使用提供的擴充功能將 ACP 內容區塊轉換為 Koog 訊息：

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
// 將 ACP 內容區塊轉換為 Koog 訊息
val koogMessage = acpContent.toKoogMessage(clock)

// 附加到現有提示
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## 預設通知處理常式

當啟用 `setDefaultNotifications` 時，AcpAgent 功能會自動處理：

1. **代理完成**：當代理成功完成時，傳送帶有 `StopReason.END_TURN` 的 `PromptResponseEvent`
2. **代理執行失敗**：傳送帶有適當停止原因的 `PromptResponseEvent`：
    - `StopReason.MAX_TURN_REQUESTS` 表示超過最大迭代次數
    - `StopReason.REFUSAL` 表示其他執行失敗
3. **LLM 回應**：將 LLM 回應轉換並傳送為 ACP 事件（文字、工具呼叫、推理）
4. **工具呼叫生命週期**：報告工具呼叫狀態變更：
    - `ToolCallStatus.IN_PROGRESS` 當工具呼叫開始時
    - `ToolCallStatus.COMPLETED` 當工具呼叫成功時
    - `ToolCallStatus.FAILED` 當工具呼叫失敗時

## 傳送自訂事件

您可以使用 `sendEvent` 方法向 ACP 用戶端傳送自訂事件：

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
// 存取 ACP 功能並傳送自訂事件
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// 存取 ACP 功能並傳送自訂事件
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

此外，您可以在 `withAcpAgent` 中使用 `protocol` 並傳送自訂通知或請求：
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
// 存取 ACP 功能並傳送自訂事件
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// 存取 ACP 功能並傳送自訂事件
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## 訊息轉換

此模組提供了在 Koog 與 ACP 訊息格式之間轉換的公用程式：

### ACP 轉 Koog

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
// 將 ACP 內容區塊轉換為 Koog 訊息
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// 將單個 ACP 內容區塊轉換為 Koog 內容部分 (content part)
val contentPart = acpContentBlock.toKoogContentPart()
```
<!--- KNIT example-agent-client-protocol-07.kt -->

### Koog 轉 ACP

<!--- INCLUDE
import ai.koog.agents.features.acp.toAcpContentBlock
import ai.koog.agents.features.acp.toAcpEvents
import ai.koog.prompt.message.ContentPart
import ai.koog.prompt.message.Message

val koogResponseMessage: Message.Assistant = TODO()
val koogContentPart: ContentPart = TODO()
-->
```kotlin
// 將 Koog 回應訊息轉換為 ACP 事件
val acpEvents = koogResponseMessage.toAcpEvents()

// 將 Koog 內容部分 (content part) 轉換為 ACP 內容區塊
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 重要注意事項

### 使用 channelFlow 進行事件串流

使用 `channelFlow` 以便能從不同的協程傳送事件：

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // 安裝 AcpAgent 並將 this@channelFlow 作為 eventsProducer
}
```

### 同步代理執行

使用互斥鎖 (mutex) 來同步對代理執行個體的存取，因為在先前的執行完成之前，協定不應觸發新的執行：

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // 建立並執行代理
}
```

### 手動處理通知

如果您需要自訂通知處理，請將 `setDefaultNotifications = false` 並根據規範處理所有代理事件：

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // 實作自訂事件處理
}
```

## 平台支援

ACP 功能目前僅適用於 JVM 平台，因為它依賴於 JVM 特有的 ACP Kotlin SDK。

## 使用範例

完整的運作範例可以在 [Koog 存儲庫](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp) 中找到。

### 執行範例

1. 執行 ACP 範例應用程式：
```shell
./gradlew :examples:simple-examples:run
```

2. 為 ACP 代理輸入一個請求：
```shell
Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
```

3. 觀察主控台中的事件追蹤，其顯示代理的執行、工具呼叫以及完成狀態。