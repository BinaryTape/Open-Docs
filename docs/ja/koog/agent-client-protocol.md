# エージェントクライアントプロトコル (Agent Client Protocol)

エージェントクライアントプロトコル (Agent Client Protocol: ACP) は、クライアントアプリケーションが一貫した双方向インターフェースを介して AI エージェントと通信できるようにする標準化されたプロトコルです。

ACP は、エージェントがクライアントとやり取りするための構造化された方法を提供し、リアルタイムのイベントストリーミング、ツール呼び出し通知、およびセッションのライフサイクル管理をサポートします。

Koog フレームワークは ACP との統合を提供しており、標準化されたクライアントアプリケーションと通信できる ACP 準拠のエージェントを構築できます。

プロトコルの詳細については、[Agent Client Protocol](https://agentclientprotocol.com) のドキュメントを参照してください。

## Koog との統合

Koog フレームワークは、[ACP Kotlin SDK](https://github.com/agentclientprotocol/kotlin-sdk) を使用し、`agents-features-acp` モジュールの追加 API 拡張機能を介して ACP と統合します。

この統合により、Koog エージェントは以下のことが可能になります。

* ACP 準拠のクライアントアプリケーションとの通信
* エージェントの実行に関するリアルタイムの更新（ツールの呼び出し、思考、完了）の送信
* 標準的な ACP イベントと通知の自動処理
* Koog のメッセージ形式と ACP のコンテンツブロック間の変換

### 主要なコンポーネント

Koog における ACP 統合の主なコンポーネントは以下の通りです。

| コンポーネント | 説明 |
|---------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [`AcpAgent`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/index.html)                                   | Koog エージェントと ACP クライアント間の通信を可能にするメイン機能です。 |
| [`MessageConverters`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-message-converters/index.html)                 | Koog と ACP 形式間でメッセージを変換するためのユーティリティです。 |
| [`AcpConfig`](https://api.koog.ai/agents/agents-features-acp/ai.koog.agents.features.acp/-acp-agent/-acp-config/index.html)                      | AcpAgent 機能の構成クラスです。 |

## はじめに

ACP の依存関係は、`koog-agents` メタ依存関係にはデフォルトで**含まれていません**。
プロジェクトに ACP モジュールを明示的に追加する必要があります。

### 依存関係

プロジェクトで ACP を使用するには、以下の依存関係を追加してください。

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

### 1. ACP エージェントサポートの実装

Koog の ACP 統合は [Kotlin ACP SDK](https://github.com/agentclientprotocol/kotlin-sdk) に基づいています。
この SDK は、エージェントを ACP クライアントに接続するために実装する必要がある `AgentSupport` および `AgentSession` インターフェースを提供します。
`AgentSupport` は、エージェントセッションの作成と読み込みを管理します。このインターフェースの実装は、ほとんどすべてのエージェントでほぼ同じです。実装例は後述します。
`AgentSession` は、エージェントのインスタンス化、呼び出し、および実行時の制御を管理します。`prompt` メソッド内で Koog エージェントを定義して実行します。

Koog で ACP を使用するには、ACP SDK の `AgentSupport` および `AgentSession` インターフェースを実装する必要があります。

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
// Koog エージェントのライフサイクルを管理するために AgentSession を実装する
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
        // ここにストラテジーを定義
    }    
    override suspend fun cancel() {
        agentJob?.cancel()
    }
}
```
<!--- KNIT example-agent-client-protocol-02.kt -->

### 2. AcpAgent 機能の構成

`AcpAgent` 機能は `AcpConfig` を通じて構成できます。

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
        // 必須: ACP 接続用の一意のセッション識別子
        this.sessionId = sessionIdValue

        // 必須: リクエストや通知の送信に使用されるプロトコルインスタンス
        this.protocol = protocol

        // 必須: イベント送信用のコルーチンベースのプロデューサースコープ
        this.eventsProducer = this@channelFlow

        // オプション: デフォルトの通知ハンドラーを登録するかどうか (デフォルト: true)
        this.setDefaultNotifications = true
    }
}
```
<!--- KNIT example-agent-client-protocol-03.kt -->

主な構成オプション:

- `sessionId`: ACP 接続用の一意のセッション識別子
- `protocol`: ACP クライアントへのリクエストや通知の送信に使用されるプロトコルインスタンス
- `eventsProducer`: イベント送信用のコルーチンベースのプロデューサースコープ
- `setDefaultNotifications`: デフォルトの通知ハンドラーを登録するかどうか (デフォルト: `true`)

### 3. 入力プロンプトの処理

提供されている拡張関数を使用して、ACP コンテンツブロックを Koog メッセージに変換します。

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
// ACP コンテンツブロックを Koog メッセージに変換
val koogMessage = acpContent.toKoogMessage(clock)

// 既存のプロンプトに追加
fun Prompt.appendPrompt(content: List<ContentBlock>): Prompt {
    return withMessages { messages ->
        messages + listOf(content.toKoogMessage(clock))
    }
}
```
<!--- KNIT example-agent-client-protocol-04.kt -->

## デフォルトの通知ハンドラー

`setDefaultNotifications` が有効な場合、AcpAgent 機能は以下を自動的に処理します。

1. **エージェントの完了**: エージェントが正常に完了したときに、`StopReason.END_TURN` を含む `PromptResponseEvent` を送信します。
2. **エージェント実行の失敗**: 適切な停止理由を含む `PromptResponseEvent` を送信します。
    - 最大反復回数を超えた場合は `StopReason.MAX_TURN_REQUESTS`
    - その他の実行失敗については `StopReason.REFUSAL`
3. **LLM のレスポンス**: LLM のレスポンスを ACP イベント（テキスト、ツール呼び出し、推論）として変換し、送信します。
4. **ツール呼び出しのライフサイクル**: ツール呼び出しのステータス変更を報告します。
    - ツール呼び出し開始時の `ToolCallStatus.IN_PROGRESS`
    - ツール呼び出し成功時の `ToolCallStatus.COMPLETED`
    - ツール呼び出し失敗時の `ToolCallStatus.FAILED`

## カスタムイベントの送信

`sendEvent` メソッドを使用して、ACP クライアントにカスタムイベントを送信できます。

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
// ACP 機能にアクセスし、カスタムイベントを送信する
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// ACP 機能にアクセスし、カスタムイベントを送信する
withAcpAgent {
    sendEvent(
        Event.SessionUpdateEvent(
            SessionUpdate.PlanUpdate(plan.entries)
        )
    )
}
```
<!--- KNIT example-agent-client-protocol-05.kt -->

さらに、`withAcpAgent` 内で `protocol` を使用して、カスタムの通知やリクエストを送信することも可能です。
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
// ACP 機能にアクセスし、カスタムイベントを送信する
    val node by node<Unit, Unit>() {
-->
<!--- SUFFIX

    }
}
-->
```kotlin
// ACP 機能にアクセスし、カスタムイベントを送信する
withAcpAgent {
    protocol.sendRequest<AuthenticateRequest, AuthenticateResponse>(
        AcpMethod.AgentMethods.Authenticate,
        AuthenticateRequest(methodId = AuthMethodId("Google"))
    )
}
```
<!--- KNIT example-agent-client-protocol-06.kt -->

## メッセージ変換

このモジュールは、Koog と ACP メッセージ形式間の変換を行うためのユーティリティを提供します。

### ACP から Koog へ

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
// ACP コンテンツブロックを Koog メッセージに変換
val koogMessage = acpContentBlocks.toKoogMessage(clock)

// 単一の ACP コンテンツブロックを Koog コンテンツパートに変換
val contentPart = acpContentBlock.toKoogContentPart()
```
<!--- KNIT example-agent-client-protocol-07.kt -->

### Koog から ACP へ

<!--- INCLUDE
import ai.koog.agents.features.acp.toAcpContentBlock
import ai.koog.agents.features.acp.toAcpEvents
import ai.koog.prompt.message.ContentPart
import ai.koog.prompt.message.Message

val koogResponseMessage: Message.Assistant = TODO()
val koogContentPart: ContentPart = TODO()
-->
```kotlin
// Koog レスポンスメッセージを ACP イベントに変換
val acpEvents = koogResponseMessage.toAcpEvents()

// Koog コンテンツパートを ACP コンテンツブロックに変換
val acpContentBlock = koogContentPart.toAcpContentBlock()
```
<!--- KNIT example-agent-client-protocol-08.kt -->

## 重要な注意点

### イベントストリーミングには channelFlow を使用する

異なるコルーチンからのイベント送信を可能にするために、`channelFlow` を使用してください。

```kotlin
override suspend fun prompt(
    content: List<ContentBlock>,
    _meta: JsonElement?
): Flow<Event> = channelFlow {
    // eventsProducer として this@channelFlow を指定して AcpAgent をインストール
}
```

### エージェントの実行の同期化

プロトコルは前の実行が終了するまで新しい実行をトリガーすべきではないため、ミューテックス（Mutex）を使用してエージェントインスタンスへのアクセスを同期してください。

```kotlin
private val agentMutex = Mutex()

agentMutex.withLock {
    // エージェントの作成と実行
}
```

### 手動での通知処理

カスタムの通知処理が必要な場合は、`setDefaultNotifications = false` に設定し、仕様に従ってすべてのエージェントイベントを処理してください。

```kotlin
install(AcpAgent) {
    this.setDefaultNotifications = false
    // カスタムイベント処理の実装
}
```

## プラットフォームのサポート

ACP 機能は、JVM 固有である ACP Kotlin SDK に依存しているため、現在は JVM プラットフォームでのみ利用可能です。

## 使用例

完全な動作例は、[Koog リポジトリ](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/acp)にあります。

### 例の実行

1. ACP サンプルアプリケーションを実行します。
```shell
./gradlew :examples:simple-examples:run
```

2. ACP エージェントへのリクエストを入力します。
```shell
Move file `my-file.md` to folder `my-folder` and append title '## My File' to the file content
```

3. コンソールに表示されるイベントトレースで、エージェントの実行、ツール呼び出し、および完了ステータスを確認してください。