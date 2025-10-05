[//]: # (title: Ktor 3.3.0の新機能)

<show-structure for="chapter,procedure" depth="2"/>

_[リリース日: 2025年9月11日](releases.md#release-details)_

Ktor 3.3.0は、サーバー、クライアント、およびツール全体にわたる新機能を提供します。本機能リリースの主な内容は以下の通りです。

*   [静的リソースのカスタムフォールバックメカニズム](#custom-fallback)
*   [OpenAPI仕様の生成](#openapi-spec-gen)
*   [HTTP/2クリアテキスト (h2c) のサポート](#http2-h2c-support)
*   [実験的なWebRTCクライアント](#webrtc-client)

## Ktorサーバー

### 静的リソースのカスタムフォールバック {id="custom-fallback"}

Ktor 3.3.0では、静的コンテンツ向けの新しい `fallback()` 関数が導入され、リクエストされたリソースが見つからなかった場合のカスタム動作を定義できるようになりました。

常に同じフォールバックファイルを提供する `default()` とは異なり、`fallback()` は元のリクエストパスと現在の `ApplicationCall` へのアクセスを提供します。これにより、リダイレクト、カスタムステータスコードの返却、または異なるファイルの動的な提供が可能です。

カスタムフォールバック動作を定義するには、`staticFiles()`、`staticResources()`、`staticZip()`、または `staticFileSystem()` 内で `fallback()` 関数を使用します。

```kotlin
staticFiles("/files", File("textFiles")) {
    fallback { requestedPath, call ->
        when {
            requestedPath.endsWith(".php") -> call.respondRedirect("/static/index.html") // absolute path
            requestedPath.endsWith(".kt") -> call.respondRedirect("Default.kt") // relative path
            requestedPath.endsWith(".xml") -> call.respond(HttpStatusCode.Gone)
            else -> call.respondFile(File("files/index.html"))
        }
    }
}
```

### 静的コンテンツのLastModifiedおよびEtagヘッダー

Ktor 3.3.0では、静的リソースに対する `ETag` および `LastModified` ヘッダーのサポートが導入されました。[`ConditionalHeaders`](server-conditional-headers.md) プラグインがインストールされている場合、条件付きヘッダーを処理して、前回のリクエスト以降に変更がないコンテンツのボディの送信を回避できます。

```kotlin
staticFiles("/filesWithEtagAndLastModified", File("files")) {
    etag { resource -> EntityTagVersion("etag") }
    lastModified { resource -> GMTDate() }
}
```

これらの値は、各リソースに基づいて動的に計算され、レスポンスに適用されます。

また、事前定義されたプロバイダーを使用することもできます。例えば、リソースコンテンツのSHA‑256ハッシュを使用して強力な `ETag` を生成できます。

```kotlin
staticFiles("/filesWithStrongGeneratedEtag", File("files")) {
    etag(ETagProvider.StrongSha256)
}
```

### 開発モードの自動リロードの制限

Ktor 3.2.0で導入された[サスペンドモジュール関数のサポート](whats-new-320.md#suspendable-module-functions)により、ブロッキングモジュール参照を使用するアプリケーションでオートリロードが機能しなくなるというリグレッションが発生しました。

このリグレッションは3.3.0でも引き続き存在し、オートリロードは `suspend` 関数モジュールおよび設定参照でのみ機能します。

サポートされるモジュール宣言の例:

```kotlin
// Supported — suspend function reference
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// Supported — configuration reference (application.conf / application.yaml)
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

将来のリリースで、ブロッキング関数参照のサポートを回復する予定です。それまでは、`development` モードでは `suspend` モジュールまたは設定参照を優先してください。

### HTTP/2クリアテキスト (h2c) のサポート {id="http2-h2c-support"}

Ktor 3.3.0では、Nettyエンジン向けにHTTP/2クリアテキスト (h2c) のサポートが導入され、TLS暗号化なしでのHTTP/2通信が可能になります。
この設定は、通常、ローカルテストやプライベートネットワークなどの信頼された環境で使用されます。

h2cを有効にするには、エンジン設定で `enableH2c` フラグを `true` に設定します。
詳細については、[TLSなしのHTTP/2](server-http2.md#http-2-without-tls) を参照してください。

## Ktorクライアント

### SSEレスポンスボディバッファ

これまで、SSEエラー後に `response.bodyAsText()` を呼び出そうとすると、二重消費の問題により失敗していました。

Ktor 3.3.0では、すでに処理されたSSEデータをデバッグやエラー処理のためにキャプチャできる設定可能な診断バッファが導入されました。

[SSEプラグイン](client-server-sent-events.topic) をインストールする際に、バッファをグローバルに設定できます。

```kotlin
install(SSE) {
    bufferPolicy = SSEBufferPolicy.LastEvents(10)
}
```

または呼び出しごとに:

```kotlin
client.sse(url, { bufferPolicy(SSEBufferPolicy.All) }) {
    // …
}
```

SSEストリームが消費されると、クライアントは処理されたデータのスナップショットをメモリ内バッファに保持します (ネットワークから再読み込みすることはありません)。エラーが発生した場合、ログ記録や診断のために `response?.bodyAsText()` を安全に呼び出すことができます。

詳細については、[レスポンスバッファリング](client-server-sent-events.topic#response-buffering) を参照してください。

### WebRTCクライアント {id="webrtc-client"}

今回のリリースでは、マルチプラットフォームプロジェクトでのピアツーピアリアルタイム通信向けの実験的なWebRTCクライアントサポートが導入されます。

WebRTCは、ビデオ通話、マルチプレイヤーゲーム、共同作業ツールなどのアプリケーションを可能にします。このリリースにより、JavaScript/WasmおよびAndroidターゲット間でピア接続を確立し、データチャネルを交換するための統一されたKotlin APIを使用できるようになりました。iOS、JVMデスクトップ、Nativeなどの追加ターゲットは将来のリリースで計画されています。

`HttpClient` と同様に、プラットフォームのエンジンを選択し、設定を提供することで `WebRtcClient` を作成できます。

<TabItem title="JS/Wasm" group-key="js-wasm">

```kotlin
val jsClient = WebRtcClient(JsWebRtc) {
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>
<TabItem title="Android" group-key="android">

```kotlin
val androidClient = WebRtcClient(AndroidWebRtc) {
    context = appContext // Required: provide Android context
    defaultConnectionConfig = {
        iceServers = listOf(WebRtc.IceServer("stun:stun.l.google.com:19302"))
    }
}
```

</TabItem>

一度作成されると、クライアントはInteractive Connectivity Establishment (ICE) を使用してピアツーピア接続を確立できます。ネゴシエーションが完了すると、ピアはデータチャネルを開いてメッセージを交換できます。

```kotlin
val connection = client.createPeerConnection()

// Add a remote ICE candidate (received via your signaling channel)
connection.addIceCandidate(WebRtc.IceCandidate(candidateString, sdpMid, sdpMLineIndex))

// Wait until all local candidates are gathered
connection.awaitIceGatheringComplete()

// Listen for incoming data channel events
connection.dataChannelEvents.collect { event ->
   when (event) {
     is Open -> println("Another peer opened a chanel: ${event.channel}")
     is Closed -> println("Data channel is closed")
     is Closing, is BufferedAmountLow, is Error -> println(event)
   }
}

// Create a channel and send/receive messages
val channel = connection.createDataChannel("chat")
channel.send("hello")
val answer = channel.receiveText()
```

使用方法と制限の詳細については、[WebRTCクライアント](client-webrtc.md) のドキュメントを参照してください。

### OkHttpバージョンの更新

Ktor 3.3.0では、Ktorクライアントの `OkHttp` エンジンがOkHttp 5.1.0（以前は4.12.0）を使用するようにアップグレードされました。このメジャーバージョンアップは、OkHttpと直接やり取りするプロジェクトでAPIの変更をもたらす可能性があります。そのようなプロジェクトは互換性を確認する必要があります。

### 統一されたOkHttp SSEセッション

OkHttpエンジンは、以前導入された `OkHttpSSESession` に代わり、Server-Sent Events (SSE) の標準APIを使用するようになりました。
この変更により、すべてのクライアントエンジンでSSEの処理が統一され、OkHttp固有の実装の制限が解消されます。

## Gradleプラグイン

### OpenAPI仕様の生成 {id="openapi-spec-gen"}
<secondary-label ref="experimental"/>

Ktor 3.3.0では、Gradleプラグインとコンパイラプラグインを介した実験的なOpenAPI生成機能が導入されました。これにより、ビルド時にアプリケーションコードから直接OpenAPI仕様を生成できます。

以下の機能を提供します:
- Ktorルート定義を分析し、ネストされたルート、ローカル拡張、およびリソースパスをマージします。
- 前置されるKDocアノテーションを解析してOpenAPIメタデータを提供します。これには以下が含まれます:
    - パス、クエリ、ヘッダー、クッキー、およびボディパラメータ
    - レスポンスコードとタイプ
    - セキュリティ、説明、非推奨、および外部ドキュメントリンク
- `call.receive()` および `call.respond()` からリクエストおよびレスポンスボディを推論します。

#### OpenAPI仕様の生成

KtorルートおよびKDocアノテーションからOpenAPI仕様ファイルを生成するには、次のコマンドを使用します。

```shell
./gradlew buildOpenApi
```

#### 仕様の提供

生成された仕様をランタイムで利用可能にするには、[OpenAPI](server-openapi.md) または [SwaggerUI](server-swagger-ui.md) プラグインを使用できます。

次の例は、OpenAPIエンドポイントで生成された仕様ファイルを提供します。

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}
```

この機能の詳細については、[OpenAPI仕様の生成](openapi-spec-generation.md) を参照してください。

## 共有

### Jettyバージョンの更新

Jettyサーバーおよびクライアントエンジンは、Jetty 12を使用するようにアップグレードされました。ほとんどのアプリケーションにとって、このアップグレードは完全に後方互換性がありますが、クライアントおよびサーバーコードは内部的に更新されたJetty APIを活用するようになりました。

プロジェクトがJetty APIを直接使用している場合、破壊的変更があることに注意してください。詳細については、[公式のJetty移行ガイド](https://jetty.org/docs/jetty/12.1/programming-guide/migration/11-to-12.html) を参照してください。