# A2A サーバー

A2A サーバーを使用すると、標準化された A2A (Agent-to-Agent) プロトコルを通じて AI エージェントを公開できます。これは [A2A プロトコル仕様](https://a2a-protocol.org/latest/specification/) の完全な実装を提供し、クライアントリクエストの処理、エージェントロジックの実行、複雑なタスクライフサイクルの管理、およびリアルタイムのストリーミングレスポンスをサポートします。

## 依存関係

プロジェクトで A2A サーバーを使用するには、以下の依存関係を `build.gradle.kts` に追加してください。

```kotlin
dependencies {
    // A2A サーバーのコアライブラリ
    implementation("ai.koog:a2a-server:$koogVersion")

    // HTTP JSON-RPC トランスポート (最も一般的)
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktor サーバーエンジン (ニーズに合わせて選択)
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

## 概要

A2A サーバーは、A2A プロトコルのトランスポート層とカスタムエージェントロジックの間の架け橋として機能します。
プロトコルへの準拠を維持し、堅牢なセッション管理を提供しながら、リクエストライフサイクル全体をオーケストレートします。

## コアコンポーネント

### A2AServer

完全な A2A プロトコルを実装するメインのサーバークラスです。以下を行う中心的なコーディネーターとして機能します。

- プロトコル仕様に対する受信リクエストの **検証 (Validate)**
- 並行セッションとタスクライフサイクルの **管理 (Manage)**
- トランスポート、ストレージ、ビジネスロジック層間の通信の **オーケストレーション (Orchestrate)**
- メッセージ送信、タスク照会、キャンセル、プッシュ通知など、すべてのプロトコル操作の **処理 (Handle)**

`A2AServer` は 2 つの必須パラメータを受け取ります。

* `AgentExecutor`: エージェントのビジネスロジックの実装を定義します
* `AgentCard`: エージェントの機能とメタデータを定義します

また、ストレージやトランスポートの動作をカスタマイズするために使用できる、いくつかのオプションパラメータも受け取ります。

### AgentExecutor

`AgentExecutor` インターフェースは、エージェントのコアとなるビジネスロジックを実装する場所です。
これは、A2A プロトコルと特定の AI エージェント機能の間のブリッジとして機能します。
エージェントの実行を開始するには、エージェントのロジックを定義する `execute` メソッドを実装する必要があります。
エージェントをキャンセルするには、`cancel` メソッドを実装する必要があります。

```kotlin
class MyAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // ここにエージェントのロジックを記述
    }

    override suspend fun cancel(
        context: RequestContext<TaskIdParams>,
        eventProcessor: SessionEventProcessor,
        agentJob: Deferred<Unit>?
    ) {
        // ここでエージェントをキャンセル（オプション）
    }
}
```

`RequestContext` は、現在のセッションの `contextId` や `taskId`、送信された `message`、リクエストの `params` など、現在のリクエストに関する豊富な情報を提供します。

`SessionEventProcessor` はクライアントと通信します。

- **`sendMessage(message)`**: 即時レスポンスを送信します (チャット形式のインタラクション)
- **`sendTaskEvent(event)`**: タスク関連の更新を送信します (長時間実行される操作)

```kotlin
// 即時レスポンス用 (チャットボットなど)
eventProcessor.sendMessage(
    Message(
        messageId = generateId(),
        role = Role.Agent,
        parts = listOf(TextPart("こちらが回答です！")),
        contextId = context.contextId
    )
)

// タスクベースの操作用
eventProcessor.sendTaskEvent(
    TaskStatusUpdateEvent(
        contextId = context.contextId,
        taskId = context.taskId,
        status = TaskStatus(
            state = TaskState.Working,
            message = Message(/* 進捗状況の更新 */),
            timestamp = Clock.System.now()
        ),
        final = false  // さらなる更新が続く場合
    )
)
```

### AgentCard

`AgentCard` は、エージェントの自己記述マニフェストとして機能します。エージェントができること、通信方法、およびセキュリティ要件をクライアントに伝えます。

```kotlin
val agentCard = AgentCard(
    // 基本的な識別情報
    name = "高度なレシピ・アシスタント",
    description = "料理のアドバイス、レシピ生成、食事の計画に特化した AI エージェント",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // オプション: 複数のトランスポート・サポート
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 機能の宣言
    capabilities = AgentCapabilities(
        streaming = true,              // リアルタイムレスポンスのサポート
        pushNotifications = true,      // 非同期通知の送信
        stateTransitionHistory = true  // タスク履歴の維持
    ),

    // コンテンツタイプのサポート
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 使用可能なセキュリティスキームの定義
    securitySchemes = mapOf(
        "bearer" to HTTPAuthSecurityScheme(
            scheme = "Bearer",
            bearerFormat = "JWT",
            description = "JWT トークン認証"
        ),
        "api-key" to APIKeySecurityScheme(
            `in` = In.Header,
            name = "X-API-Key",
            description = "サービス認証用 API キー"
        )
    ),

    // セキュリティ要件の指定 (要件の論理和 OR)
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // オプション 1: read/write スコープを持つ JWT
        mapOf("api-key" to emptyList())              // オプション 2: API キー
    ),

    // 認証済みユーザー向けの拡張カードを有効化
    supportsAuthenticatedExtendedCard = true,
    
    // スキル / 機能
    skills = listOf(
        AgentSkill(
            id = "recipe-generation",
            name = "レシピ生成",
            description = "食材、食事制限、好みに基づいてカスタムレシピを生成します",
            tags = listOf("料理", "レシピ", "栄養"),
            examples = listOf(
                "キノコを使ったビーガンパスタのレシピを作って",
                "鶏肉、ライス、野菜があります。何が作れますか？"
            )
        ),
        AgentSkill(
            id = "meal-planning",
            name = "食事計画",
            description = "週間の食事プランを作成し、買い物リストを生成します",
            tags = listOf("食事計画", "栄養", "ショッピング")
        )
    ),

    // オプション: ブランディング
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### トランスポート層

A2A 自体は、クライアントとの通信のために複数のトランスポートプロトコルをサポートしています。
現在、Koog は HTTP を介した JSON-RPC サーバー・トランスポートの実装を提供しています。

#### HTTP JSON-RPC トランスポート

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktor エンジン (CIO, Netty, Jetty)
    port = 8080,                   // サーバーポート
    path = "/a2a",                 // API エンドポイントパス
    wait = true                    // サーバーが停止するまでブロック
)
```

### ストレージ

A2A サーバーは、異なるタイプのデータを分離するプラグ可能なストレージアーキテクチャを使用しています。
すべてのストレージ実装はオプションであり、開発用にはデフォルトでインメモリ版が使用されます。

- **TaskStorage**: タスクライフサイクル管理 - タスクの状態、履歴、アーティファクトを保存および管理します。
- **MessageStorage**: 会話履歴 - 会話コンテキスト内のメッセージ履歴を管理します。
- **PushNotificationConfigStorage**: Webhook 管理 - 非同期通知用の Webhook 設定を管理します。

## クイックスタート

### 1. AgentCard の作成
エージェントの機能とメタデータを定義します。
```kotlin
val agentCard = AgentCard(
    name = "IO アシスタント",
    description = "入力の加工に特化した AI エージェント",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 機能の宣言
    capabilities =
        AgentCapabilities(
            streaming = true,              // リアルタイムレスポンスのサポート
            pushNotifications = true,      // 非同期通知の送信
            stateTransitionHistory = true  // タスク履歴の維持
        ),

    // コンテンツタイプのサポート
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // スキル / 機能
    skills = listOf(
        AgentSkill(
            id = "echo",
            name = "エコー",
            description = "ユーザーメッセージをそのまま返します",
            tags = listOf("io"),
        )
    )
)
```

### 2. AgentExecutor の作成
エグゼキューターでエージェントロジックを実装し、受信リクエストを処理してレスポンスを送信します。

```kotlin
class EchoAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val userMessage = context.params.message
        val userText = userMessage.parts
            .filterIsInstance<TextPart>()
            .joinToString(" ") { it.text }

        // ユーザーのメッセージをそのまま返す
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("あなたが言ったこと: $userText")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### 2. サーバーの作成
エージェントエグゼキューターとエージェントカードをサーバーに渡します。

```kotlin
val server = A2AServer(
    agentExecutor = EchoAgentExecutor(),
    agentCard = agentCard
)
```

### 3. トランスポート層の追加
トランスポート層を作成し、サーバーを開始します。
```kotlin
// HTTP JSON-RPC トランスポート
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,
    port = 8080,
    path = "/agent",
    wait = true
)
```

## エージェント実装パターン

### シンプルレスポンス・エージェント
単一のメッセージに対して応答するだけでよい場合は、シンプルなエージェントとして実装できます。
エージェントの実行ロジックが複雑でなく、時間がかからない場合にも使用できます。

```kotlin
class SimpleAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("エージェントからの挨拶です！")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### タスクベース・エージェント
エージェントの実行ロジックが複雑で、複数のステップを必要とする場合は、タスクベースのエージェントとして実装できます。
エージェントの実行ロジックに時間がかかり、中断（サスペンド）が必要な場合にも適しています。
```kotlin
class TaskAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 処理中ステータスを送信
        eventProcessor.sendTaskEvent(
            TaskStatusUpdateEvent(
                contextId = context.contextId,
                taskId = context.taskId,
                status = TaskStatus(
                    state = TaskState.Working,
                    timestamp = Clock.System.now()
                ),
                final = false
            )
        )

        // 処理を実行...

        // 完了を送信
        eventProcessor.sendTaskEvent(
            TaskStatusUpdateEvent(
                contextId = context.contextId,
                taskId = context.taskId,
                status = TaskStatus(
                    state = TaskState.Completed,
                    timestamp = Clock.System.now()
                ),
                final = true
            )
        )
    }
}