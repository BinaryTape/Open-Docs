# A2Aサーバー

A2Aサーバーを使用すると、標準化されたA2A (Agent-to-Agent) プロトコルを介してAIエージェントを公開できます。これは、[A2Aプロトコル仕様](https://a2a-protocol.org/latest/specification/)の完全な実装を提供し、クライアントリクエストの処理、エージェントロジックの実行、複雑なタスクライフサイクルの管理、およびリアルタイムのストリーミング応答をサポートします。

## 依存関係

プロジェクトでA2Aサーバーを使用するには、`build.gradle.kts` に次の依存関係を追加します。

```kotlin
dependencies {
    // コアA2Aサーバーライブラリ
    implementation("ai.koog:a2a-server:$koogVersion")

    // HTTP JSON-RPCトランスポート (最も一般的)
    implementation("ai.koog:a2a-transport-server-jsonrpc-http:$koogVersion")

    // Ktorサーバーエンジン (ニーズに合わせていずれかを選択)
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
}
```

## 概要

A2Aサーバーは、A2Aプロトコルのトランスポート層とカスタムエージェントロジック間の架け橋として機能します。プロトコル準拠を維持しながらリクエストライフサイクル全体を調整し、堅牢なセッション管理を提供します。

## コアコンポーネント

### A2AServer

完全なA2Aプロトコルを実装する主要なサーバークラスです。これは、以下を行う中央の調整役として機能します。

- プロトコル仕様に対する受信リクエストを**検証します**
- 並行セッションとタスクのライフサイクルを**管理します**
- トランスポート層、ストレージ層、ビジネスロジック層間の通信を**調整します**
- メッセージ送信、タスククエリ、キャンセル、プッシュ通知といったすべてのプロトコル操作を**処理します**

`A2AServer` は2つの必須パラメータを受け取ります。

* エージェントのビジネスロジック実装を定義する `AgentExecutor`
* エージェントの機能とメタデータを定義する `AgentCard`

また、そのストレージとトランスポートの動作をカスタマイズするために使用できる、いくつかのオプションパラメータがあります。

### AgentExecutor

`AgentExecutor` インターフェースは、エージェントのコアビジネスロジックを実装する場所です。これは、A2Aプロトコルと特定のAIエージェント機能の間の架け橋として機能します。エージェントの実行を開始するには、エージェントのロジックを定義する `execute` メソッドを実装する必要があります。エージェントをキャンセルするには、`cancel` メソッドを実装する必要があります。

```kotlin
class MyAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // ここにエージェントロジックを記述
    }

    override suspend fun cancel(
        context: RequestContext<TaskIdParams>,
        eventProcessor: SessionEventProcessor,
        agentJob: Deferred<Unit>?
    ) {
        // ここでエージェントをキャンセル、オプション
    }
}
```

`RequestContext` は、現在のセッションの `contextId` と `taskId`、送信された `message`、リクエストの `params` など、現在のリクエストに関する豊富な情報を提供します。

`SessionEventProcessor` はクライアントと通信します。

- **`sendMessage(message)`**: 即時応答を送信します (チャット形式の対話)
- **`sendTaskEvent(event)`**: タスク関連の更新を送信します (長時間実行される操作)

```kotlin
// 即時応答の場合 (チャットボットなど)
eventProcessor.sendMessage(
    Message(
        messageId = generateId(),
        role = Role.Agent,
        parts = listOf(TextPart("Here's your answer!")),
        contextId = context.contextId
    )
)

// タスクベースの操作の場合
eventProcessor.sendTaskEvent(
    TaskStatusUpdateEvent(
        contextId = context.contextId,
        taskId = context.taskId,
        status = TaskStatus(
            state = TaskState.Working,
            message = Message(/* progress update */),
            timestamp = Clock.System.now()
        ),
        final = false  // さらに更新が続く
    )
)
```

### AgentCard

`AgentCard` はエージェントの自己記述マニフェストとして機能します。これは、エージェントが何ができるか、どのように通信するか、どのようなセキュリティ要件があるかをクライアントに伝えます。

```kotlin
val agentCard = AgentCard(
    // 基本情報
    name = "Advanced Recipe Assistant",
    description = "AI agent specialized in cooking advice, recipe generation, and meal planning",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // オプション: 複数トランスポートのサポート
    additionalInterfaces = listOf(
        AgentInterface("https://api.example.com/a2a", TransportProtocol.JSONRPC),
    ),

    // 機能宣言
    capabilities = AgentCapabilities(
        streaming = true,              // リアルタイム応答をサポート
        pushNotifications = true,      // 非同期通知を送信
        stateTransitionHistory = true  // タスク履歴を保持
    ),

    // コンテンツタイプサポート
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // 利用可能なセキュリティスキームを定義
    securitySchemes = mapOf(
        "bearer" to HTTPAuthSecurityScheme(
            scheme = "Bearer",
            bearerFormat = "JWT",
            description = "JWT token authentication"
        ),
        "api-key" to APIKeySecurityScheme(
            `in` = In.Header,
            name = "X-API-Key",
            description = "API key for service authentication"
        )
    ),

    // セキュリティ要件を指定 (要件の論理OR)
    security = listOf(
        mapOf("bearer" to listOf("read", "write")),  // オプション1: 読み書きスコープ付きJWT
        mapOf("api-key" to emptyList())              // オプション2: APIキー
    ),

    // 認証済みユーザー向けに拡張カードを有効化
    supportsAuthenticatedExtendedCard = true,
    
    // スキル/機能
    skills = listOf(
        AgentSkill(
            id = "recipe-generation",
            name = "Recipe Generation",
            description = "Generate custom recipes based on ingredients, dietary restrictions, and preferences",
            tags = listOf("cooking", "recipes", "nutrition"),
            examples = listOf(
                "Create a vegan pasta recipe with mushrooms",
                "I have chicken, rice, and vegetables. What can I make?"
            )
        ),
        AgentSkill(
            id = "meal-planning",
            name = "Meal Planning",
            description = "Plan weekly meals and generate shopping lists",
            tags = listOf("meal-planning", "nutrition", "shopping")
        )
    ),

    // オプション: ブランド
    iconUrl = "https://example.com/agent-icon.png",
    documentationUrl = "https://docs.example.com/recipe-agent",
    provider = AgentProvider(
        organization = "CookingAI Inc.",
        url = "https://cookingai.com"
    )
)
```

### トランスポート層

A2A自体は、クライアントと通信するために複数のトランスポートプロトコルをサポートしています。現在、Koog は HTTP 上での JSON-RPC サーバートランスポートの実装を提供しています。

#### HTTP JSON-RPC トランスポート

```kotlin
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,           // Ktorエンジン (CIO, Netty, Jetty)
    port = 8080,                   // サーバーポート
    path = "/a2a",                 // APIエンドポイントパス
    wait = true                    // サーバーが停止するまでブロック
)
```

### ストレージ

A2Aサーバーは、異なる種類のデータを分離するプラガブルなストレージアーキテクチャを使用します。すべてのストレージ実装はオプションであり、開発用にデフォルトでインメモリ版が使用されます。

- **`TaskStorage`**: タスクライフサイクル管理 - タスクの状態、履歴、アーティファクトを保存および管理します
- **`MessageStorage`**: 会話履歴 - 会話コンテキスト内のメッセージ履歴を管理します
- **`PushNotificationConfigStorage`**: Webhook管理 - 非同期通知用のWebhook構成を管理します

## クイックスタート

### 1. AgentCard の作成
エージェントの機能とメタデータを定義します。
```kotlin
val agentCard = AgentCard(
    name = "IO Assistant",
    description = "AI agent specialized in input modification",
    version = "2.1.0",
    protocolVersion = "0.3.0",

    // 通信設定
    url = "https://api.example.com/a2a",
    preferredTransport = TransportProtocol.JSONRPC,

    // 機能宣言
    capabilities =
        AgentCapabilities(
            streaming = true,              // リアルタイム応答をサポート
            pushNotifications = true,      // 非同期通知を送信
            stateTransitionHistory = true  // タスク履歴を保持
        ),

    // コンテンツタイプサポート
    defaultInputModes = listOf("text/plain", "text/markdown", "image/jpeg"),
    defaultOutputModes = listOf("text/plain", "text/markdown", "application/json"),

    // スキル/機能
    skills = listOf(
        AgentSkill(
            id = "echo",
            name = "echo",
            description = "Echoes back user messages",
            tags = listOf("io"),
        )
    )
)
```

### 2. AgentExecutor の作成
エグゼキューターはエージェントロジックを実装し、受信リクエストを処理して応答を送信します。

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

        // ユーザーのメッセージをエコーバック
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("You said: $userText")),
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
トランスポート層を作成し、サーバーを起動します。
```kotlin
// HTTP JSON-RPCトランスポート
val transport = HttpJSONRPCServerTransport(server)
transport.start(
    engineFactory = CIO,
    port = 8080,
    path = "/agent",
    wait = true
)
```

## エージェント実装パターン

### シンプルな応答エージェント
エージェントが単一のメッセージに応答するだけでよい場合、シンプルなエージェントとして実装できます。エージェントの実行ロジックが複雑でなく、時間もかからない場合にも使用できます。

```kotlin
class SimpleAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        val response = Message(
            messageId = UUID.randomUUID().toString(),
            role = Role.Agent,
            parts = listOf(TextPart("Hello from agent!")),
            contextId = context.contextId,
            taskId = context.taskId
        )

        eventProcessor.sendMessage(response)
    }
}
```

### タスクベースのエージェント
エージェントの実行ロジックが複雑で複数のステップを必要とする場合、タスクベースのエージェントとして実装できます。エージェントの実行ロジックが時間のかかるもので、中断を伴う場合にも使用できます。
```kotlin
class TaskAgentExecutor : AgentExecutor {
    override suspend fun execute(
        context: RequestContext<MessageSendParams>,
        eventProcessor: SessionEventProcessor
    ) {
        // 処理中のステータスを送信
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