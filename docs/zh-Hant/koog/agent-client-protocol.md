# Agent Client Protocol

Agent Client Protocol (ACP) 是一種開源的標準化協定，讓用戶端應用程式能透過一致的雙向介面與 AI 代理 (agent) 進行通訊。
透過在您的 Koog 代理中實作 ACP，您可以確保它能輕鬆整合到任何符合 ACP 規範的環境中，例如 IDE。

若要了解更多，請參閱 [Agent Client Protocol] 文件。

## 與 Koog 整合

Koog 架構透過 [ACP Kotlin SDK] 搭配額外的 API 擴充功能與 ACP 整合。
此整合提供：

*   為 Koog 代理與符合 ACP 規範的用戶端應用程式提供標準化通訊
*   自動更新工具呼叫、代理想法與補全的執行狀態
*   在 Koog 的多模態訊息格式與 ACP 的內容區塊之間進行無縫訊息轉換
*   將 Koog 代理狀態的生命週期對應至 ACP 工作階段事件

!!! note

    由於 [ACP Kotlin SDK] 是 JVM 特有的，因此 ACP 整合目前僅適用於 JVM 平台。

### 新增相依性

ACP 支援是一個選用的 [功能 (feature)](features/index.md)，預設情況下 Koog 不提供。
若要為您的 Koog 代理實作 ACP，請新增 [ai.koog:agents-features-acp](https://mvnrepository.com/artifact/ai.koog/agents-features-acp) 的相依性，該模組本身相依於 [com.agentclientprotocol:acp](https://mvnrepository.com/artifact/com.agentclientprotocol/acp)。

例如，在 `build.gradle.kts` 的情況下：

```kotlin
dependencies {
    implementation("ai.koog:agents-features-acp:$koogVersion")
}
```

### 為 Koog 代理啟用 ACP

若要將 Koog 代理的內部 [事件系統](agent-events.md) 與 ACP 協定連接，請安裝 `ai.koog.agents.features.acp.AcpAgent` 功能 (feature)。
安裝後，它會監聽生命週期事件（如工具呼叫或 LLM 回應）並將其傳送至 ACP 用戶端。

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

關鍵設定選項：

*   **`sessionId`**：識別目前對話工作階段的唯一字串。
*   **`protocol`**：用於底層通訊的 [`com.agentclientprotocol.protocol.Protocol`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/protocol/Protocol.kt) 執行個體。
*   **`eventsProducer`**：用於傳送 ACP 事件的 `kotlinx.coroutines.channels.ProducerScope<Event>`。
    若要了解更多，請參閱 [事件串流](#event-streaming)。
*   **`setDefaultNotifications`**：是否為代理生命週期事件註冊預設通知處理常式。
    若要了解更多，請參閱 [處理代理通知](#handling-agent-notifications)。

此代理必須在下一章所述的 ACP 工作階段範圍內執行。

### 實作啟用 ACP 的代理

若要將您的 Koog 代理連接至 ACP 用戶端，請實作來自 [ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) 的兩個核心介面：

- [`AgentSupport`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSupport.kt)：管理代理的識別資訊、能力與工作階段生命週期（建立或載入工作階段）。
- [`AgentSession`](https://github.com/agentclientprotocol/kotlin-sdk/blob/master/acp/src/commonMain/kotlin/com/agentclientprotocol/agent/AgentSession.kt)：管理單個對話工作階段，處理 `prompt` 執行並管理取消。

在 `AgentSession` 的 `prompt()` 方法內，是您應該初始化並執行啟用 ACP 的 Koog 代理的地方。
以下是一個範例：

=== "AgentSession"

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
    
            // 確保一次僅執行一個代理工作階段
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
                    loadSession = false, // 如果您實作了工作階段持久化，請設為 true
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
            throw UnsupportedOperationException("尚未實作工作階段載入")
        }
    }
    ```
    <!--- KNIT example-agent-client-protocol-03.kt -->

## 事件串流

範例中的 `AgentSession` 定義了一個傳回事件 `channelFlow` 的 `prompt()` 函式。
接著您安裝 `AcpAgent` 功能 (feature)，並將 `this@channelFlow` 作為 `eventsProducer`。
這讓您能從不同的協程傳送事件。

## 執行同步

範例中的 `AgentSession` 使用互斥鎖 (mutex) 來同步對代理執行個體的存取，因為在先前的執行完成之前，ACP 不應觸發新的代理執行。
為此，建立並執行代理的操作會發生在為定義的互斥鎖所設的 `withLock` 範圍內。

您也在 `channelFlow` 範圍內以延遲工作 `agentJob` 的方式非同步執行代理，以確保代理不會被過早取消。

## 處理 ACP 用戶端輸入

ACP 用戶端將使用者輸入作為 [`ContentBlock`](https://agentclientprotocol.com/protocol/schema#contentblock) 物件列表傳送。
若要在 Koog 中處理這些內容，請使用 `List<ContentBlock>.toKoogMessage()` 擴充函式將 ACP 內容區塊轉換為 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)，並將其附加到您的[代理提示](prompts/index.md)。

範例中的 `AgentSession` 定義了一個私有函式，用於在 ACP 工作階段中擴充初始代理提示：

<!--- INCLUDE
import ai.koog.agents.features.acp.toKoogMessage
import ai.koog.prompt.dsl.Prompt
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

    需要一個 `KoogClock` 執行個體來為訊息標記時間戳記。

若要了解更多，請參閱 [轉換訊息](#converting-messages)。

## 轉換訊息

`agents-features-acp` 模組提供了擴充函式，可在 Koog 的內部訊息型別與 [ACP 內容區塊](https://agentclientprotocol.com/protocol/content) 之間進行無縫轉換。

在接收來自 ACP 用戶端的輸入時，請使用以下函式：

- `List<ContentBlock>.toKoogMessage()`：將 ACP 內容區塊列表轉換為 [`Message.User`](api:prompt-model::ai.koog.prompt.message.Message.User)
- `ContentBlock.toKoogContentPart()`：將單個 ACP 內容區塊轉換為 [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart)

使用以下函式從 Koog 訊息建構 ACP 事件或內容區塊：

- `Message.Response.toAcpEvents()`：將 [`Message.Response`](api:prompt-model::ai.koog.prompt.message.Message.Response) 轉換為 ACP 工作階段更新事件列表
- `ContentPart.toAcpContentBlock()`：將 [`ContentPart`](api:prompt-model::ai.koog.prompt.message.ContentPart) 轉換為單個 ACP 內容區塊

## 處理代理通知

預設情況下，`setDefaultNotifications` 設為 `true`，且啟用 ACP 的代理會自動處理以下通知：

- **代理完成**

    當代理成功完成時，傳送帶有 `StopReason.END_TURN` 的 `PromptResponseEvent`

- **代理執行失敗**

    傳送帶有適當停止原因的 `PromptResponseEvent`：

    - `StopReason.MAX_TURN_REQUESTS`：當代理超過最大迭代次數時
    - `StopReason.REFUSAL`：用於其他執行失敗
  
- **LLM 回應**

    將 LLM 回應轉換並傳送為 ACP 事件（文字、工具呼叫、推理）

- **工具呼叫生命週期**

    報告工具呼叫狀態變更：

    - `ToolCallStatus.IN_PROGRESS`：當工具呼叫開始時
    - `ToolCallStatus.COMPLETED`：當工具呼叫成功時
    - `ToolCallStatus.FAILED`：當工具呼叫失敗時

如果您想要自訂通知處理，請將 `setDefaultNotifications = false` 並根據規範處理代理事件。

## 傳送自訂事件

除了自動通知外，您可以在代理執行期間的任何時間點，使用 `withAcpAgent` 區塊內的 `sendEvent` 向 ACP 用戶端傳送自訂事件。
這對於進度更新、自訂狀態訊息或計畫更新非常有用。

您可以在 `AIAgentContext` 中執行此操作，例如在節點中：

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

您也可以存取底層的 `protocol` 來向用戶端傳送自訂請求，例如身分驗證請求：

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

## 範例

您可以在 Koog 存儲庫的 [/examples](https://github.com/JetBrains/koog/tree/develop/examples/) 下找到 Koog 代理的運作範例。

### 執行基於主控台的 ACP 用戶端

此範例執行一個基於主控台的 ACP 用戶端，該用戶端與一個簡單的 Koog 代理互動。

1. 開啟 [/examples/simple-examples](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/)。
2. 請參閱 [README](https://github.com/JetBrains/koog/blob/develop/examples/simple-examples/README.md) 以取得有關為 LLM 提供者設定 API 金鑰的資訊。
3. 執行 `runExampleAcpApp` Gradle 工作。
4. 當 ACP 用戶端在主控台中啟動時，為代理輸入一個請求，例如：
    ```text
    List files in the current directory and create a new file named 'acp-test.txt' with the content 'Hello from ACP!'.
    ```
5. 觀察主控台中的事件追蹤，它顯示了 Koog 事件如何轉換為 ACP 事件並傳送至用戶端。

### 將啟用 ACP 的 Koog 代理連接至 JetBrains IDE

此範例示範如何建立一個啟用 ACP 的代理並連接至 IntelliJ IDEA。

1. 開啟 [/examples/acp-agent](https://github.com/JetBrains/koog/tree/develop/examples/acp-agent)
2. 執行 `installDist` Gradle 工作。
3. 這應該會建立代理的可執行檔：`build/install/acp-agent/bin/acp-agent`
   （Windows 為 `acp-agent.bat`）。
4. 開啟 IntelliJ IDEA（或另一個 JetBrains IDE）。
5. 前往 **AI Chat** > **Options** > **Add Custom Agent**。
6. 在開啟的 `acp.json` 檔案中，貼上以下內容：

    ```json
    {
        "agent_servers": {
            "Koog Agent": {
                "command": "/absolute/path/to/acp-agent/build/install/acp-agent/bin/acp-agent",
                "args": [],
                "env": {
                    "OPENAI_API_KEY": "在此貼上您的 API 金鑰"
                }
            }
        }
    }
    ```

    設定參數：

    - `agent_servers`：包含一個或多個代理設定的物件
    - `Koog Agent`：在 IDE 的代理選取器中顯示的名稱
    - `command`：代理可執行檔的絕對路徑
    - `args`：命令列引數（此代理為空）
    - `env`：傳遞給代理處理序的環境變數（在此範例中為 OpenAI API 金鑰）

7. 該代理應該會在 **AI Chat** 工具視窗中變為可用狀態。

若要了解更多有關將自訂代理新增至 IDE 的資訊，請參閱 [AI Assistant 文件](https://www.jetbrains.com/help/ai-assistant/acp.html#add-custom-agent)以及[這篇部落格文章](https://blog.jetbrains.com/ai/2026/02/koog-x-acp-connect-an-agent-to-your-ide-and-more/)。

[Agent Client Protocol]: https://agentclientprotocol.com
[ACP Kotlin SDK]: https://github.com/agentclientprotocol/kotlin-sdk