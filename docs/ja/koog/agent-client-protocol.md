# エージェントクライアントプロトコル

エージェントクライアントプロトコル（ACP）は、クライアントアプリケーションがAIエージェントと一貫した双方向インターフェースを通じて通信することを可能にする標準化されたプロトコルです。

ACPは、リアルタイムのイベントストリーミング、ツール呼び出し通知、セッションライフサイクル管理をサポートし、エージェントがクライアントと対話するための構造化された方法を提供します。

KoogフレームワークはACPとの統合を提供し、標準化されたクライアントアプリケーションと通信できるACP準拠のエージェントを構築できるようにします。

プロトコルの詳細については、[Agent Client Protocol](https://agentclientprotocol.com)のドキュメントを参照してください。

## Koogとの統合

Koogフレームワークは、`agents-features-acp`モジュール内の追加API拡張機能とともに、[ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk)を使用してACPと統合します。

この統合により、Koogエージェントは以下の操作を実行できます。

*   ACP準拠のクライアントアプリケーションと通信する
*   エージェントの実行（ツール呼び出し、思考、完了）に関するリアルタイムの更新を送信する
*   標準的なACPイベントと通知を自動的に処理する
*   Koogメッセージ形式とACPコンテンツブロック間で変換する

### 主要コンポーネント

KoogにおけるACP統合の主要コンポーネントは以下のとおりです。

| コンポーネント                                                                                                                                    | 説明                                                                                |
|:--------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                   | KoogエージェントとACPクライアント間の通信を可能にする主要機能。                     |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                 | KoogとACP形式間でメッセージを変換するためのユーティリティ。                         |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                      | AcpAgent機能のコンフィグレーションクラス。                                          |

## はじめに

ACPの依存関係は、`koog-agents`メタ依存関係にデフォルトでは**含まれていません**。
プロジェクトにACPモジュールを明示的に追加する必要があります。

### 依存関係

プロジェクトでACPを使用するには、以下の依存関係を追加します。

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

### 1. ACPエージェントのサポートを実装する

KoogのACP統合は、[Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk)に基づいています。
SDKは、エージェントをACPクライアントに接続するために実装する必要がある`AgentSupport`と`AgentSession`インターフェースを提供します。
`AgentSupport`はエージェントセッションの作成とロードを管理します。このインターフェースの実装はすべてのエージェントでほぼ同じであり、後ほど実装例を提供します。
`AgentSession`はエージェントのインスタンス化、呼び出し、およびランタイムを制御します。`prompt`メソッド内でKoogエージェントを定義し、実行します。

KoogでACPを使用するには、ACP SDKから`AgentSupport`および`AgentSession`インターフェースを実装する必要があります。

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

### 2. AcpAgent機能を設定する

`AcpAgent`機能は`AcpConfig`を通じて設定できます。

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
        // 必須: ACP接続用の一意のセッション識別子
        this.sessionId = sessionIdValue

        // 必須: リクエストと通知の送信に使用されるプロトコルインスタンス
        this.protocol = protocol

        // 必須: イベント送信用のコルーチンベースのプロデューサスコープ
        this.eventsProducer = this@channelFlow

        // オプション: デフォルトの通知ハンドラを登録するかどうか (デフォルト: true)
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

主要な設定オプション:

-   `sessionId`: ACP接続用の一意のセッション識別子
-   `protocol`: ACPクライアントにリクエストと通知を送信するために使用されるプロトコルインスタンス
-   `eventsProducer`: イベント送信用のコルーチンベースのプロデューサスコープ
-   `setDefaultNotifications`: デフォルトの通知ハンドラを登録するかどうか（デフォルト: `true`）

### 3. 着信プロンプトを処理する

提供されている拡張関数を使用して、ACPコンテンツブロックをKoogメッセージに変換します。

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
// ACPコンテンツブロックをKoogメッセージに変換
val koogMessage = acpContent.toKoogMessage(clock)

// 既存のプロンプトに追加
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## デフォルトの通知ハンドラ

`setDefaultNotifications`が有効な場合、AcpAgent機能は自動的に以下を処理します。

1.  **エージェントの完了**: エージェントが正常に完了したときに、`StopReason.END_TURN`を持つ`PromptResponseEvent`を送信します。
2.  **エージェントの実行失敗**: 適切な停止理由を持つ`PromptResponseEvent`を送信します。
    -   `StopReason.MAX_TURN_REQUESTS`: 最大イテレーション数を超過した場合
    -   `StopReason.REFUSAL`: その他の実行失敗の場合
3.  **LLM応答**: LLM応答をACPイベント（テキスト、ツール呼び出し、推論）として変換し、送信します。
4.  **ツール呼び出しのライフサイクル**: ツール呼び出しのステータス変更を報告します。
    -   `ToolCallStatus.IN_PROGRESS`: ツール呼び出しが開始されたとき
    -   `ToolCallStatus.COMPLETED`: ツール呼び出しが成功したとき
    -   `ToolCallStatus.FAILED`: ツール呼び出しが失敗したとき

## カスタムイベントの送信

`sendEvent`メソッドを使用して、カスタムイベントをACPクライアントに送信できます。

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
// ACP機能にアクセスし、カスタムイベントを送信
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

さらに、`withAcpAgent`内で`protocol`を使用し、カスタム通知やリクエストを送信できます。
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
// ACP機能にアクセスし、カスタムイベントを送信
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## メッセージ変換

このモジュールは、KoogとACPのメッセージ形式間で変換するためのユーティリティを提供します。

### ACPからKoogへ

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
// ACPコンテンツブロックをKoogメッセージに変換
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// 単一のACPコンテンツブロックをKoogコンテンツパートに変換
val contentPart = acpContentBlock.toKoogContentPart()
```
<!--- KNIT example-agent-client-protocol-07.kt -->

### KoogからACPへ

<!--- INCLUDE
import ai.koog.agents.features.acp.toAcpContentBlock
import ai.koog.agents.features.acp.toAcpEvents
import ai.koog.prompt.message.ContentPart
import ai.koog.prompt.message.Message

val koogResponseMessage: Message.Assistant = TODO()
val koogContentPart: ContentPart = TODO()
-->
```kotlin
// Koog応答メッセージをACPイベントに変換
val acpEvents = koogResponseMessage.toAcpEvents()

// KoogコンテンツパートをACPコンテンツブロックに変換
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 重要な注意事項

### イベントストリーミングにchannelFlowを使用する

異なるコルーチンからイベントを送信できるように`channelFlow`を使用します。

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // eventsProducerとしてthis@channelFlowを持つAcpAgentをインストール
}
```

### エージェントの実行を同期する

プロトコルは前回の実行が終了するまで新しい実行をトリガーすべきではないため、ミューテックスを使用してエージェントインスタンスへのアクセスを同期します。

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // エージェントを作成して実行
}
```

### 手動での通知処理

カスタム通知処理が必要な場合は、`setDefaultNotifications = false`を設定し、仕様に従ってすべてのエージェントイベントを処理します。

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // カスタムイベント処理を実装
}
```

## プラットフォームサポート

ACP機能は現在、JVMプラットフォームのみで利用可能です。これは、JVM固有のACP Kotlin SDKに依存しているためです。

## 使用例

完全な動作例は、[Koogリポジトリ](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp)で確認できます。

### 例の実行

1.  ACPサンプルアプリケーションを実行します。
```shell
./gradlew :examples:simple-examples:run
```

2.  ACPエージェントにリクエストを入力します。
```shell
Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
```

3.  エージェントの実行、ツール呼び出し、完了ステータスを示すコンソールのイベントトレースを観察します。