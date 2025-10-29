# A2Aクライアント

A2Aクライアントを使用すると、ネットワーク経由でA2A準拠のエージェントと通信できます。
これは、[A2Aプロトコル仕様](https://a2a-protocol.org/latest/specification/)の完全な実装を提供し、エージェントディスカバリ、メッセージ交換、タスク管理、およびリアルタイムストリーミング応答を処理します。

## 依存関係

プロジェクトでA2Aクライアントを使用するには、次の依存関係を`build.gradle.kts`に追加します。

```kotlin
dependencies {
    // Core A2A client library
    implementation("ai.koog:a2a-client:$koogVersion")

    // HTTP JSON-RPC transport (most common)
    implementation("ai.koog:a2a-transport-client-jsonrpc-http:$koogVersion")

    // Ktor client engine (choose one that fits your needs)
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}
```

## 概要

A2Aクライアントは、あなたのアプリケーションとA2A準拠のエージェント間の橋渡し役として機能します。
プロトコル準拠を維持し、堅牢なセッション管理を提供しながら、通信ライフサイクル全体を調整します。

## コアコンポーネント

### A2AClient

完全なA2Aプロトコルを実装する主要なクライアントクラスです。これは、以下を担う中心的なコーディネーターです。

- プラグイン可能なリゾルバーを通じて、接続とエージェントディスカバリを**管理し**ます
- 自動プロトコル準拠により、メッセージ交換とタスク操作を**調整し**ます
- エージェントがサポートする場合、ストリーミング応答とリアルタイム通信を**処理し**ます
- 堅牢なアプリケーションのために、包括的なエラー処理とフォールバックメカニズムを**提供します**

`A2AClient`は2つの必須パラメーターを受け取ります。

* ネットワーク通信層を処理する`ClientTransport`
* エージェントディスカバリとメタデータ取得を処理する`AgentCardResolver`

`A2AClient`インターフェースは、A2Aエージェントとやり取りするためのいくつかの主要なメソッドを提供します。

* `connect`メソッド - エージェントに接続し、その機能を取得します。これにより、エージェントができることを発見し、AgentCardをキャッシュします
* `sendMessage`メソッド - シンプルなリクエスト・レスポンスパターン向けに、エージェントにメッセージを送信し、単一の応答を受け取ります
* `sendMessageStreaming`メソッド - リアルタイム応答向けにストリーミングサポート付きでメッセージを送信します。これにより、部分的なメッセージやタスク更新を含むイベントの`Flow`を返します
* `getTask`メソッド - 特定のタスクのステータスと詳細をクエリします
* `cancelTask`メソッド - エージェントがキャンセルをサポートしている場合、実行中のタスクをキャンセルします
* `cachedAgentCard`メソッド - ネットワークリクエストを行わずに、キャッシュされたエージェントカードを取得します。`connect`がまだ呼び出されていない場合は`null`を返します

### ClientTransport

`ClientTransport`インターフェースは低レベルのネットワーク通信を処理し、A2Aクライアントがプロトコルロジックを管理します。
これにより、トランスポート固有の詳細が抽象化され、異なるプロトコルをシームレスに使用できるようになります。

#### HTTP JSON-RPC トランスポート

A2Aエージェントで最も一般的なトランスポートです。

```kotlin
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a",        // エージェントエンドポイントURL
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

`AgentCardResolver`インターフェースはエージェントのメタデータと機能を取得します。
これにより、さまざまなソースからのエージェントディスカバリが可能になり、最適なパフォーマンスのためにキャッシュ戦略をサポートします。

#### URL Agent Card リゾルバー

A2Aの慣例に従ってHTTPエンドポイントからエージェントカードを取得します。

```kotlin
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",           // エージェントサービスのベースURL
    path = "/.well-known/agent-card.json",           // 標準のエージェントカードロケーション
    httpClient = HttpClient(CIO),                    // オプション：カスタムHTTPクライアント
)
```

## クイックスタート

### 1. クライアントの作成

トランスポートとエージェントカードリゾルバーを定義し、クライアントを作成します。

```kotlin
// HTTP JSON-RPC transport
val transport = HttpJSONRPCClientTransport(
    url = "https://agent.example.com/a2a"
)

// Agent card resolver
val agentCardResolver = UrlAgentCardResolver(
    baseUrl = "https://agent.example.com",
    path = "/.well-known/agent-card.json"
)

// Create client
val client = A2AClient(transport, agentCardResolver)
```

### 2. 接続とディスカバリ

エージェントに接続し、そのカードを取得します。
エージェントのカードを持つことで、その機能のクエリを実行したり、他の操作を実行したりできます。例えば、ストリーミングをサポートしているか確認できます。

```kotlin
// エージェントに接続し、その機能を取得
client.connect()
val agentCard = client.cachedAgentCard()

println("Connected to: ${agentCard.name}")
println("Supports streaming: ${agentCard.capabilities.streaming}")
```

### 3. メッセージの送信

エージェントにメッセージを送信し、単一の応答を受け取ります。
応答は、エージェントが直接応答した場合はメッセージ、またはエージェントがタスクを実行中の場合はタスクイベントのいずれかです。

```kotlin
val message = Message(
    messageId = UUID.randomUUID().toString(),
    role = Role.User,
    parts = listOf(TextPart("Hello, agent!")),
    contextId = "conversation-1"
)

val request = Request(data = MessageSendParams(message))
val response = client.sendMessage(request)

// 応答の処理
when (val event = response.data) {
    is Message -> {
        val text = event.parts
            .filterIsInstance<TextPart>()
            .joinToString { it.text }
        print(text) // 部分的な応答をストリーミング
    }
    is TaskEvent -> {
        if (event.final) {
            println("
Task completed") // タスク完了
        }
    }
}
```

### 4. メッセージをストリーミングで送信

A2Aクライアントは、リアルタイム通信のためにストリーミング応答をサポートしています。
単一の応答を受け取る代わりに、メッセージとタスク更新を含むイベントの`Flow`を返します。

```kotlin
// エージェントがストリーミングをサポートしているか確認
if (client.cachedAgentCard()?.capabilities?.streaming == true) {
    client.sendMessageStreaming(request).collect { response ->
        when (val event = response.data) {
            is Message -> {
                val text = event.parts
                    .filterIsInstance<TextPart>()
                    .joinToString { it.text }
                print(text) // 部分的な応答をストリーミング
            }
            is TaskStatusUpdateEvent -> {
                if (event.final) {
                    println("
Task completed") // タスク完了
                }
            }
        }
    }
} else {
    // ストリーミングなしにフォールバック
    val response = client.sendMessage(request)
    // 単一の応答を処理
}
```

### 5. タスクの管理

A2Aクライアントは、サーバータスクのステータスを問い合わせたり、キャンセルしたりすることで、それらを制御するためのメソッドを提供します。

```kotlin
// タスクステータスのクエリ
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