# A2Aクライアント

A2Aクライアントを使用すると、ネットワーク経由でA2A準拠のエージェントと通信できます。
これは[A2Aプロトコル仕様](https://a2a-protocol.org/latest/specification/)の完全な実装を提供し、エージェントの検出、メッセージ交換、タスク管理、およびリアルタイムのストリーミングレスポンスを処理します。

## 依存関係

プロジェクトでA2Aクライアントを使用するには、以下の依存関係を `build.gradle.kts` に追加してください：

```kotlin
dependencies {
    // コアA2Aクライアントライブラリ
    implementation("ai.koog:a2a-client:$koogVersion")

    // HTTP JSON-RPCトランスポート（最も一般的）
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktorクライアントエンジン（ニーズに合わせて選択してください）
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概要

A2Aクライアントは、アプリケーションとA2A準拠のエージェント間のブリッジ（架け橋）として機能します。
プロトコルへの準拠を維持し、堅牢なセッション管理を提供しながら、通信ライフサイクル全体をオーケストレートします。

## コアコンポーネント

### A2AClient

完全なA2Aプロトコルを実装するメインクライアントクラスです。以下の役割を担う中心的なコーディネーターとして機能します：

- プラグ可能なリゾルバー（resolver）を通じて、接続とエージェントの検出を**管理**する
- プロトコルへの自動的な準拠により、メッセージ交換とタスク操作を**オーケストレート**する
- エージェントがサポートしている場合、ストリーミングレスポンスとリアルタイム通信を**処理**する
- 堅牢なアプリケーションのために、包括的なエラーハンドリングとフォールバックメカニズムを**提供**する

`A2AClient` は2つの必須パラメータを受け取ります：

* `ClientTransport`: ネットワーク通信レイヤーを処理します
* `AgentCardResolver`: エージェントの検出とメタデータの取得を処理します

`A2AClient` インターフェースは、A2Aエージェントと対話するためのいくつかの主要なメソッドを提供します：

* `connect` メソッド - エージェントに接続してその機能を収集します。これにより、エージェントができることを検出し、AgentCardをキャッシュします。
* `sendMessage` メソッド - 単純なリクエスト・レスポンスパターンのために、エージェントにメッセージを送信し、単一のレスポンスを受け取ります。
* `sendMessageStreaming` メソッド - リアルタイムレスポンスのためにストリーミングサポート付きでメッセージを送信します。部分的なメッセージやタスクの更新を含むイベントの `Flow` を返します。
* `getTask` メソッド - 特定のタスクのステータスと詳細を照会します。
* `cancelTask` メソッド - エージェントがキャンセルをサポートしている場合、実行中のタスクをキャンセルします。
* `cachedAgentCard` メソッド - ネットワークリクエストを行わずにキャッシュされたエージェントカードを取得します。`connect` がまだ呼び出されていない場合は null を返します。

### ClientTransport

`ClientTransport` インターフェースは、A2Aクライアントがプロトコルロジックを管理する一方で、低レベルのネットワーク通信を処理します。
トランスポート固有の詳細を抽象化し、異なるプロトコルをシームレスに使用できるようにします。

#### HTTP JSON-RPCトランスポート

A2Aエージェントで最も一般的なトランスポートです：

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // エージェントのエンドポイントURL
    httpClient = HttpClient(CIO) {                // オプション：カスタムHTTPクライアント
        install(ContentNegotiation) {
            json()
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 30000
        }
    }
)
```

### AgentCardResolver

`AgentCardResolver` インターフェースは、エージェントのメタデータと機能を取得します。
さまざまなソースからのエージェント検出を可能にし、最適なパフォーマンスのためのキャッシング戦略をサポートします。

#### URL Agent Card Resolver

A2Aの慣習に従い、HTTPエンドポイントからエージェントカードを取得します：

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // エージェントサービスのベースURL
    path = "/.well-known/agent-card.json",           // 標準的なエージェントカードの場所
    httpClient = HttpClient(CIO),                    // オプション：カスタムHTTPクライアント
)
```

## クイックスタート

### 1. クライアントの作成

トランスポートとエージェントカードリゾルバーを定義し、クライアントを作成します。

```kotlin
// HTTP JSON-RPCトランスポート
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// エージェントカードリゾルバー
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// クライアントの作成
val client = A2AClient(transport, agentCardResolver)
```

### 2. 接続と検出

エージェントに接続してそのカードを取得します。
エージェントのカードを取得することで、その機能を照会し、他の操作（例：ストリーミングをサポートしているかどうかの確認など）を実行できるようになります。

```kotlin
// エージェントに接続して機能を収集
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. メッセージの送信

エージェントにメッセージを送信し、単一のレスポンスを受け取ります。
レスポンスは、エージェントが直接応答した場合はメッセージになり、エージェントがタスクを実行している場合はタスクイベントになります。

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// レスポンスの処理
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // 部分的なレスポンスをストリーム出力
    }
    is TaskEvent -> {
        if (event.final) {
            println("
Task completed")
        }
    }
}
```

### 4. メッセージのストリーミング送信

A2Aクライアントは、リアルタイム通信のためのストリーミングレスポンスをサポートしています。
単一のレスポンスを受け取る代わりに、メッセージとタスクの更新を含むイベントの `Flow` を返します。

```kotlin
// エージェントがストリーミングをサポートしているか確認
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // 部分的なレスポンスをストリーム出力
            }
            is TaskStatusUpdateEvent -> {
                if (event.final) {
                    println("
Task completed")
                }
            }
        }
    }
} else {
    // 非ストリーミングへのフォールバック
    val response = client.sendMessage(request)
    // 単一のレスポンスを処理
}
```

### 5. タスクの管理

A2Aクライアントは、ステータスの照会やキャンセルを行うことで、サーバータスクを制御するメソッドを提供します。

```kotlin
// タスクステータスの照会
val taskRequest = Request(data = TaskQueryParams(taskId = "task-123"))
val taskResponse = client.getTask(taskRequest)
val task = taskResponse.data

println("Task state: ${task.status.state}")

// 実行中のタスクをキャンセル
if (task.status.state == TaskState.Working) {
    val cancelRequest = Request(data = TaskIdParams(taskId = "task-123"))
    val cancelledTask = client.cancelTask(cancelRequest).data
    println("Task cancelled: ${cancelledTask.status.state}")
}