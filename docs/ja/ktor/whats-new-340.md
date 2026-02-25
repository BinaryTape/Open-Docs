[//]: # (title: Ktor 3.4.0 の新機能)

<show-structure for="chapter,procedure" depth="2"/>

_[リリース日: 2026年1月23日](releases.md#release-details)_

Ktor 3.4.0 では、サーバー、クライアント、およびツールにわたって幅広い機能強化が行われました。この機能リリースの主なハイライトは以下の通りです：

* [Zstd 圧縮のサポート](#zstd-compression-support)
* [HTTP リクエストのライフサイクル](#http-request-lifecycle)
* [ランタイム OpenAPI ルートアノテーション](#runtime-openapi-route-annotations)
* [OkHttp での全二重（Duplex）ストリーミング](#duplex-streaming-for-okhttp)

## Ktor Server

### エラーハンドリングのための OAuth フォールバック

Ktor 3.4.0 では、[OAuth](server-oauth.md) 認証プロバイダーに新しい [`fallback()`](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-o-auth-authentication-provider/-config/fallback.html) 関数が導入されました。
このフォールバックは、トークン交換の失敗、ネットワークの問題、レスポンスのパースエラーなど、OAuth フローが `AuthenticationFailedCause.Error` で失敗したときに呼び出されます。

以前は、OAuth の失敗をバイパスするために、OAuth で保護されたルートで `authenticate(optional = true)` を使用していたかもしれません。
しかし、オプションの認証は資格情報が提供されない場合のチャレンジ（Challenge）を抑制するだけであり、実際の OAuth エラーはカバーしていませんでした。

新しい `fallback()` 関数は、これらのシナリオを処理するための専用のメカニズムを提供します。フォールバックでコールが処理されない場合、Ktor は `401 Unauthorized` を返します。

フォールバックを設定するには、`oauth` ブロック内で定義します：

```kotlin
install(Authentication) {
    oauth("login") {
        client = ...
        urlProvider = ...
        providerLookup = { ... }
        fallback = { cause ->
            if (cause is OAuth2RedirectError) {
                respondRedirect("/login-after-fallback")
            } else {
                respond(HttpStatusCode.Forbidden, cause.message)
            }
        }
    }
}
```

### Zstd 圧縮のサポート

[Zstd](https://github.com/facebook/zstd) 圧縮が [Compression](server-compression.md) プラグインでサポートされるようになりました。

`Zstd` は、高い圧縮率と低い圧縮時間を実現する高速な圧縮アルゴリズムであり、圧縮レベルを構成可能です。

これを有効にするには、プロジェクトに `ktor-server-compression-zstd` 依存関係を追加します：
```kotlin
implementation("io.ktor:ktor-server-compression-zstd:$ktor_version")
```

次に、`install(Compression) {}` ブロック内で、目的の設定を指定して `zstd()` 関数を呼び出します：

```kotlin
install(Compression) {
    gzip()
    deflate()
    zstd(level = 3)
    identity()
}
```

### 設定ファイルでの SSL トラストストア設定

Ktor では、アプリケーション設定ファイルを使用して、サーバーの追加の [SSL 設定](server-ssl.md#config-file)を構成できるようになりました。設定ファイルでトラストストア（Trust store）、対応するパスワード、および有効な TLS プロトコルのリストを直接指定できます。

これらの設定は `ktor.security.ssl` セクションで定義します：

```kotlin
// application.conf
ktor {
    security {
        ssl {
            // ...
            trustStore = truststore.jks
            trustStorePassword = foobar
            enabledProtocols = ["TLSv1.2", "TLSv1.3"]
        }
    }
}
```

上記のコードにおいて：
- `trustStore` – 信頼された証明書を含むトラストストアファイルへのパス。
- `trustStorePassword` – トラストストアのパスワード。
- `enabledProtocols` – 許可される TLS プロトコルのリスト。

### 部分的なレスポンスのための HTML フラグメント

Ktor は、部分的な HTML レスポンスを送信するための新しい [`.respondHtmlFragment()`](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html-fragment.html) 関数を提供するようになりました。これは、HTMX のようなツールを使用した動的な UI 更新など、完全な `<html>` ドキュメントを必要としないマークアップを生成する場合に便利です。

この新しい API は [HTML DSL](server-html-dsl.md) プラグインの一部であり、任意の要素をルートとする HTML を返すことができます：

```kotlin
get("/books.html") {
    call.respondHtmlFragment {
        div("books") {
            for (book in library.books()) {
                bookItem()
            }
        }
    }
}
```

### HTTP リクエストのライフサイクル

新しい [`HttpRequestLifecycle` プラグイン](server-http-request-lifecycle.md)を使用すると、クライアントが切断されたときに実行中の HTTP リクエスト（Inflight HTTP requests）をキャンセルできます。
これは、長時間実行されるリクエストやリソースを大量に消費するリクエストにおいて、クライアントの切断時に処理をキャンセルする必要がある場合に便利です。

この機能を有効にするには、`HttpRequestLifecycle` プラグインをインストールし、`cancelCallOnClose = true` を設定します：

```kotlin
install(HttpRequestLifecycle) {
    cancelCallOnClose = true
}

routing {
    get("/long-process") {
        try {
            while (isActive) {
                delay(10_000)
                logger.info("Very important work.")
            }
            call.respond("Completed")
        } catch (e: CancellationException) {
            logger.info("Cleaning up resources.")
        }
    }
}
```

クライアントが切断されると、リクエストを処理しているコルーチンがキャンセルされ、構造化された並行性（Structured concurrency）によってすべてのリソースのクリーンアップが処理されます。リクエストによって開始された `launch` や `async` コルーチンもすべてキャンセルされます。
現時点では、`Netty` および `CIO` エンジンのみがこれをサポートしています。

### リソースでレスポンスを返す新しいメソッド

新しい [`call.respondResource()`](server-responses.md#resource) メソッドは、[`call.respondFile()`](server-responses.md#file) と同様に動作しますが、レスポンスとしてファイルの代わりにリソースを受け取ります。

クラスパスから単一のリソースを提供するには、`call.respondResource()` を使用してリソースパスを指定します：

```kotlin
routing {
    get("/resource") {
        call.respondResource("public/index.html")
    }
}
```

### ランタイム OpenAPI ルートアノテーション

<primary-label ref="experimental"/>

Ktor 3.4.0 では `ktor-server-routing-openapi` モジュールが導入され、ランタイムアノテーションを使用して OpenAPI メタデータをルートに直接アタッチできるようになりました。これらのアノテーションは実行時にルートに適用され、ルーティングツリーの一部となるため、OpenAPI 関連のツールから利用可能になります。

この API は実験的（Experimental）であり、`@OptIn(ExperimentalKtorApi::class)` を使用したオプトインが必要です。

実行時にルートにメタデータを追加するには、`.describe {}` 拡張関数を使用します：

```kotlin
@OptIn(ExperimentalKtorApi::class)
get("/messages") {
    val query = call.parameters["q"]?.let(::parseQuery)
    call.respond(messageRepository.getMessages(query))
}.describe {
    parameters {
        query("q") {
            description = "An encoded query"
            required = false
        }
    }
    responses {
        HttpStatusCode.OK {
            description = "A list of messages"
            schema = jsonSchema<List<Message>>()
            extension("x-sample-message", testMessage)
        }
        HttpStatusCode.BadRequest {
            description = "Invalid query"
            ContentType.Text.Plain()
        }
    }
    summary = "get messages"
    description = "Retrieves a list of messages."
}
```

この API は、スタンドアロンの拡張機能として使用することも、Ktor の OpenAPI コンパイラプラグインと組み合わせてこれらの呼び出しを自動生成することもできます。[OpenAPI](server-openapi.md) および [SwaggerUI](server-swagger-ui.md) プラグインも、OpenAPI 仕様を構築する際にこのメタデータを読み取ります。

> Ktor 3.4.0 では、`SwaggerUI` および `OpenAPI` プラグインに `ktor-server-routing-openapi` 依存関係が必要になりました。
> これは意図的な破壊的変更ではなく、3.4.1 リリースで修正される予定です。
> いずれかのプラグインを使用している場合は、ランタイムエラーを避けるために手動で依存関係を追加してください。
> 
{style="warning"}

詳細と例については、[ランタイムルートアノテーション](openapi-spec-generation.md#runtime-route-annotations)を参照してください。

### API キー認証

新しい [API キー認証プラグイン](server-api-key-auth.md)を使用すると、通常は HTTP ヘッダーで各リクエストと共に渡される共有シークレットを使用して、サーバーのルートを保護できます。

`apiKey` プロバイダーは Ktor の [Authentication プラグイン](server-auth.md)と統合されており、カスタムロジックを使用した着信 API キーの検証、ヘッダー名のカスタマイズ、および標準の `authenticate` ブロックによる特定のルートの保護が可能です：

```kotlin
install(Authentication) {
    apiKey("my-api-key") {
        validate { apiKey ->
            if (apiKey == "secret-key") {
                UserIdPrincipal(apiKey)
            } else {
                null
            }
        }
    }
}

routing {
    authenticate {
        get("/") {
            val principal = call.principal<UserIdPrincipal>()!!
            call.respondText("Key: ${principal.key}")
        }
    }
}
```
API キー認証は、サービス間通信や、軽量な認証メカニズムで十分なその他のシナリオで使用できます。

詳細および構成オプションについては、[API キー認証](server-api-key-auth.md)を参照してください。

## Core

### 複数ヘッダーの解析

新しい [`Headers.getSplitValues()`](https://api.ktor.io/ktor-http/io.ktor.http/get-split-values.html) 関数は、1 行に複数の値が含まれるヘッダーの処理を簡素化します。

`getSplitValues()` 関数は、指定されたヘッダーのすべての値を返し、指定されたセパレーター（デフォルトは `,`）を使用してそれらを分割します：

```kotlin
val headers = headers {
    append("X-Multi-Header", "1, 2")
    append("X-Multi-Header", "3")
}

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```
デフォルトでは、二重引用符で囲まれた文字列内のセパレーターは無視されますが、`splitInsideQuotes = true` を設定することでこの動作を変更できます：

```kotlin
val headers = headers {
    append("X-Multi-Header", """a,"b,c",d""")
}

val forceSplit = headers.getSplitValues("X-Quoted", splitInsideQuotes = true)
// ["a", "\"b", "c\"", "d"]
```

## Ktor Client

### 認証トークンのキャッシュ制御

Ktor 3.4.0 より前は、[Basic](client-basic-auth.md) および [Bearer 認証](client-bearer-auth.md)プロバイダーを使用するアプリケーションで、ユーザーがログアウトしたり認証データを更新したりした後も、古いトークンや資格情報が送信され続けることがありました。これは、各プロバイダーが内部コンポーネントを通じて `loadTokens()` 関数の結果をキャッシュしており、このキャッシュが手動でクリアされるまでアクティブなままだったためです。

Ktor 3.4.0 では、トークンのキャッシュ動作を明示的かつ便利に制御できる新しい関数と構成オプションが導入されました。

#### 認証トークンへのアクセスとクリア

クライアントから認証プロバイダーに直接アクセスし、必要に応じてキャッシュされたトークンをクリアできるようになりました。

特定のプロバイダーのトークンをクリアするには、`.clearToken()` 関数を使用します：

```kotlin
val provider = client.authProvider<BearerAuthProvider>()
provider?.clearToken()
```

すべての認証プロバイダーを取得する：

```kotlin
val providers = client.authProviders
```

トークンのクリアをサポートするすべてのプロバイダー（現在は Basic および Bearer）からキャッシュされたトークンをクリアするには、`HttpClient.clearAuthTokens()` 関数を使用します：

```kotlin
 // ログアウト時にキャッシュされたすべての認証トークンをクリアする
fun logout() {
    client.clearAuthTokens()
    storage.deleteTokens()
}

// 資格情報が更新されたときにキャッシュされた認証トークンをクリアする
fun updateCredentials(new: Credentials) {
    storage.save(new)
    client.clearAuthTokens()  // 再読み込みを強制する
}
```

#### トークンキャッシュ動作の構成

Basic と Bearer の両方の認証プロバイダーに、新しい `cacheTokens` 構成オプションが追加されました。これにより、リクエスト間でトークンや資格情報をキャッシュするかどうかを制御できます。

例えば、資格情報が動的に提供される場合にキャッシュを無効にすることができます：

```kotlin
basic {
    cacheTokens = false  // すべてのリクエストで資格情報を読み込む
    credentials {
        getCurrentUserCredentials()
    }
}
```

キャッシュの無効化は、認証データが頻繁に変更される場合や、常に最新の状態を反映させる必要がある場合に特に便利です。

### OkHttp での全二重（Duplex）ストリーミング

OkHttp クライアントエンジンが全二重（Duplex）ストリーミングをサポートし、クライアントがリクエストボディデータの送信とレスポンスデータの受信を同時に行えるようになりました。

リクエストボディを完全に送信してからレスポンスが開始される通常の HTTP コールとは異なり、全二重モードは双方向ストリーミングをサポートし、クライアントがデータの送信と受信を並行して行うことができます。

全二重ストリーミングは HTTP/2 接続で利用可能であり、`OkHttpConfig` の新しい `duplexStreamingEnabled` プロパティを使用して有効にできます：

```kotlin
val client = HttpClient(OkHttp) {
    engine {
        duplexStreamingEnabled = true
        config {
            protocols(listOf(Protocol.H2_PRIOR_KNOWLEDGE))
        }
    }
}
```

### Apache5 コネクションマネージャーの設定

Apache5 エンジンにおいて、新しい [`configureConnectionManager {}`](https://api.ktor.io/ktor-client-apache5/io.ktor.client.engine.apache5/-apache5-engine-config/configure-connection-manager.html) 関数を使用して、コネクションマネージャーを直接設定できるようになりました。

このアプローチは、`customizeClient { setConnectionManager(...) }` を使用する従来の方法よりも推奨されます。`customizeClient` を使用すると、Ktor が管理するコネクションマネージャーが置き換えられ、エンジンの設定、タイムアウト、およびその他の内部構成がバイパスされる可能性があるためです。

<compare>

```kotlin
val client = HttpClient(Apache5) {
    engine {
        customizeClient {
            setConnectionManager(
                PoolingAsyncClientConnectionManagerBuilder.create()
                    .setMaxConnTotal(10_000)
                    .setMaxConnPerRoute(1_000)
                    .build()
            )
        }
    }
}
```

```kotlin
val client = HttpClient(Apache5) {
    engine {
        configureConnectionManager {
            setMaxConnTotal(10_000)
            setMaxConnPerRoute(1_000)
        }
    }
}
```

</compare>

新しい `configureConnectionManager {}` 関数を使用すると、ルートごとの最大接続数 (`maxConnPerRoute`) や総最大接続数 (`maxConnTotal`) などのパラメータを調整しながら、Ktor による制御を維持できます。

### ネイティブクライアントエンジン用のディスパッチャー設定

ネイティブ HTTP クライアントエンジン（`Curl`、`Darwin`、`WinHttp`）が、設定されたエンジンディスパッチャーを尊重し、デフォルトで `Dispatchers.IO` を使用するようになりました。

`dispatcher` プロパティは常にクライアントエンジンの構成で利用可能でしたが、ネイティブエンジンは以前これを無視し、常に `Dispatchers.Unconfined` を使用していました。この変更により、ネイティブエンジンは設定されたディスパッチャーを使用し、指定がない場合はデフォルトで `Dispatchers.IO` を使用するようになり、他の Ktor クライアントエンジンと動作が統一されました。

ディスパッチャーは次のように明示的に設定できます：

```kotlin
val client = HttpClient(Curl) {
    engine {
        dispatcher = Dispatchers.IO
    }
}
```
### エンジンディスパッチャーを使用した HttpStatement の実行

`HttpStatement.execute {}` および `HttpStatement.body {}` ブロックが、呼び出し元のコルーチンコンテキストではなく、HTTP エンジンのディスパッチャーで実行されるようになりました。これにより、これらのブロックがメインスレッドから呼び出されたときに誤ってブロックされるのを防ぎます。

以前は、ストリーミングレスポンスをファイルに書き込むなどの I/O 操作中に UI がフリーズするのを避けるため、ユーザーが `withContext` を使用して手動でディスパッチャーを切り替える必要がありました。今回の変更により、Ktor はこれらのブロックを自動的にエンジンのコルーチンコンテキストにディスパッチします：

<compare>

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    withContext(Dispatchers.IO) {
        val channel: ByteReadChannel = httpResponse.body()
        // 処理とデータの書き込み
    }
}
```

```kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    // 処理とデータの書き込み
}
```
</compare>

### プラグインおよびデフォルトリクエスト設定の置換

Ktor クライアントの構成において、実行時に既存の設定を置き換えるための制御がより強化されました。

#### プラグイン構成の置換

新しい [`installOrReplace()`](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/install-or-replace.html) 関数は、クライアントプラグインをインストールするか、既にインストールされている場合はその既存の構成を置き換えます。これは、プラグインを手動で削除することなく再構成する必要がある場合に便利です。

```kotlin
val client = HttpClient {
    installOrReplace(ContentNegotiation) {
        json()
    }
}
```

上記の例では、`ContentNegotiation` が既にインストールされている場合、その構成がブロック内で提供された新しいものに置き換えられます。

#### デフォルトリクエスト構成の置換

[`defaultRequest()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/default-request.html) 関数にオプションの `replace` パラメータ（デフォルトは `false`）が追加されました。`true` に設定すると、新しい構成は以前に定義されたデフォルトリクエスト設定とマージされるのではなく、それらを完全に置き換えます。

```kotlin
val client = HttpClient {
    defaultRequest(replace = true) {
        // ...
    }
}
```

これにより、クライアント設定を構成または再利用する際に、以前のデフォルトリクエスト構成を明示的にオーバーライドできます。

### `js` および `wasmJs` ターゲットの共有ソースセットのサポート

Ktor がマルチプラットフォームプロジェクトにおける [Kotlin の共有 `web` ソースセット](https://kotlinlang.org/docs/whatsnew2220.html#shared-source-set-for-js-and-wasmjs-targets)をサポートするようになり、`js` ターゲットと `wasmJs` ターゲット間で Ktor の依存関係を共有できるようになりました。これにより、HTTP クライアントやエンジンなどの Web 固有のクライアントコードを JavaScript と Wasm/JS で共有しやすくなります。

<Path>build.gradle.kts</Path> ファイルにおいて、`webMain` ソースセットで Ktor の依存関係を宣言できます：

```kotlin
kotlin {
    sourceSets {
        webMain.dependencies {
            implementation("io.ktor:ktor-client-js:%ktor_version%")
        }
    }
}
```

その後、`js` と `wasmJs` の両方のターゲットで利用可能な API を使用できます：

```kotlin
// src/webMain/kotlin/Main.kt

actual fun createClient(): HttpClient = HttpClient(Js)
```

## I/O

### `ByteReadChannel` から `RawSink` へのバイトのストリーミング

新しい [`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 関数を使用して、チャネルからバイトを読み取り、指定された `RawSink` に直接書き込むことができるようになりました。この関数は、中間バッファや手動コピーを使用せずに、大きなレスポンスやファイルのダウンロードを処理することを簡素化します。

次の例では、ファイルをダウンロードして新しいローカルファイルに書き込みます：

```kotlin
val client = HttpClient(CIO)
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()
val fileSize = 100 * 1024 * 1024

runBlocking {
    client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
        val channel: ByteReadChannel = httpResponse.body()
        channel.readTo(stream)
    }
}

println("A file saved to ${file.path}")

```

## Gradle プラグイン

### OpenAPI コンパイラ拡張

以前の OpenAPI コンパイラプラグインは、ビルド時に完全で静的な OpenAPI ドキュメントを生成していました。Ktor 3.4.0 では、代わりに実行時に OpenAPI メタデータを提供するコードを生成します。このメタデータは、仕様を提供するときに [OpenAPI](server-openapi.md) および [Swagger UI](server-swagger-ui.md) プラグインによって消費されます。

専用の `buildOpenApi` Gradle タスクは削除されました。コンパイラプラグインは通常のビルド中に自動的に適用され、ルートやアノテーションの変更は、追加の生成ステップを必要とせずに、実行中のサーバーに反映されます。

#### 構成

構成は引き続き `ktor` Gradle 拡張内の `openApi {}` ブロックを使用して行われます。ただし、`title`、`version`、`description`、`target` など、グローバルな OpenAPI メタデータを定義するために使用されていたプロパティは非推奨となり、無視されます。

グローバルな OpenAPI メタデータは、コンパイル時ではなく実行時に定義および解決されるようになりました。

コンパイラ拡張の構成は、メタデータがどのように推論および収集されるかを制御する機能オプションに限定されるようになりました。

Ktor 3.3.0 の実験的プレビューから移行するユーザー向けに、構成は次のように変更されました：

<compare>

```kotlin
// build.gradle.kts
ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        target = project.layout.projectDirectory.file("api.json")
        title = "OpenAPI example"
        version = "2.1"
        summary = "This is a sample API"
    }
}
```

```kotlin
// build.gradle.kts
ktor {
    openApi {
        // コンパイラプラグインのグローバル制御
        enabled = true
        // コールハンドラーコードからの詳細の推論を有効/無効にします
        codeInferenceEnabled = true
        // すべてのルートを分析するか、コメント付きのルートのみを分析するかを切り替えます
        onlyCommented = false
    }
}
```

</compare>