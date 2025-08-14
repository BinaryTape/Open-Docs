[//]: # (title: Ktor 3.2.0 の新機能)

<show-structure for="chapter,procedure" depth="2"/>

_[リリース日: 2025年6月12日](releases.md#release-details)_

この機能リリースにおける主な変更点は以下のとおりです。

*   [バージョンカタログ](#published-version-catalog)
*   [依存性注入](#dependency-injection)
*   [ファーストクラスの HTMX サポート](#htmx-integration)
*   [中断可能なモジュール関数](#suspendable-module-functions)

## Ktor サーバー

### 中断可能なモジュール関数

Ktor 3.2.0 から、[アプリケーションモジュール](server-modules.md)が中断可能な関数をサポートするようになりました。

以前、Ktor モジュール内で非同期関数を追加するには、サーバー作成時にデッドロックを引き起こす可能性のある `runBlocking` ブロックが必要でした。

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

これで `suspend` キーワードを使用できるようになり、アプリケーション起動時に非同期コードを実行できます。

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 同時モジュールローディング

`ktor.application.startup = concurrent` Gradle プロパティを追加することで、モジュールを並行してロードすることも選択できます。
これにより、すべてのアプリケーションモジュールが独立して起動されるため、1つのモジュールが中断しても他のモジュールはブロックされません。
これにより、依存性注入のための非逐次的なローディングが可能になり、場合によってはローディングが高速化されます。

詳細については、「[同時モジュールローディング](server-modules.md#concurrent-module-loading)」を参照してください。

### 設定ファイルの逆直列化

Ktor 3.2.0 では、`Application` クラスに新しい `.property()` 拡張機能が導入され、型付き設定のロードが可能になりました。これにより、構造化された設定セクションを Kotlin のデータクラスに直接逆直列化できます。

この機能により、設定値へのアクセスが簡素化され、ネストされた設定やグループ化された設定を扱う際のボイラープレートが大幅に削減されます。

次の **application.yaml** ファイルを考えてみましょう。

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

以前は、各設定値を個別に取得する必要がありました。新しい `.property()` 拡張機能を使用すると、設定セクション全体を一度にロードできます。

<compare>
[object Promise]
[object Promise]
</compare>

この機能は、HOCON と YAML の両方の設定形式をサポートし、逆直列化には `kotlinx.serialization` を使用します。

### `ApplicationTestBuilder` の `client` が設定可能に

Ktor 3.2.0 から、`ApplicationTestBuilder` クラスの `client` プロパティが可変になりました。以前は読み取り専用でした。
この変更により、独自のテストクライアントを設定し、`ApplicationTestBuilder` クラスが利用可能な場所であればどこでも再利用できます。例えば、拡張関数内からクライアントにアクセスできます。

```kotlin
@Test
fun testRouteAfterAuthorization() = testApplication {
    // Pre-configure the client
    client = createClient {
        install(ContentNegotiation) {
            json()
        }
            
        defaultRequest { 
            contentType(ContentType.Application.Json)
        }
    }

    // Reusable test step extracted into an extension-function
    auth(token = AuthToken("swordfish"))

    val response = client.get("/route")
    assertEquals(OK, response.status)
}

private fun ApplicationTestBuilder.auth(token: AuthToken) {
    val response = client.post("/auth") {
        setBody(token)
    }
    assertEquals(OK, response.status)
}
```

### 依存性注入

Ktor 3.2.0 では、依存性注入 (DI) のサポートが導入され、設定ファイルやアプリケーションコードから直接依存性を管理・結合することが容易になりました。新しい DI プラグインは、依存性解決を簡素化し、非同期ロードをサポートし、自動クリーンアップを提供し、テストとスムーズに統合されます。

<var name="artifact_name" value="ktor-server-di" />

DI を使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含めます。

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

#### 基本的な依存性登録

ラムダ、関数参照、またはコンストラクタ参照を使用して依存性を登録できます。

```kotlin
dependencies {
  // Lambda-based
  provide<GreetingService> { GreetingServiceImpl() }

  // Function references
  provide<GreetingService>(::GreetingServiceImpl)
  provide(BankServiceImpl::class)
  provide(::createBankTeller)

  // Registering a lambda as a dependency
  provide<() -> GreetingService> { { GreetingServiceImpl() } }
}
```

#### 設定ベースの依存性登録

設定ファイル内でクラスパス参照を使用して、宣言的に依存性を設定できます。これは関数とクラスの両方の参照をサポートします。

```yaml
# application.yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
database:
  connectionUrl: postgres://localhost:3037/admin
```

```kotlin
// Repositories.kt
fun provideDatabase(@Property("database.connectionUrl") connectionUrl: String): Database =
  PostgresDatabase(connectionUrl)

class UserRepository(val db: Database) {
  // implementation 
}
```

引数は `@Property` や `@Named` などのアノテーションによって自動的に解決されます。

#### 依存性解決と注入

##### 依存性の解決

依存性を解決するには、プロパティデリゲーションまたは直接解決を使用できます。

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

##### 非同期依存性解決

非同期ロードをサポートするために、中断関数を使用できます。

```kotlin
suspend fun Application.installEvents() {
  val kubernetesConnection = dependencies.resolve() // suspends until provided
}

suspend fun Application.loadEventsConnection() {
  dependencies.provide {
    connect(property<KubernetesConfig>("app.events"))
  }
}
```

DI プラグインは、すべての依存性が準備できるまで `resolve()` 呼び出しを自動的に中断します。

##### アプリケーションモジュールへの注入

モジュールのパラメータを指定することで、依存性をアプリケーションモジュールに直接注入できます。Ktor は DI コンテナからそれらを解決します。

```yaml
ktor:
  application:
    dependencies:
      - com.example.PrintStreamProviderKt
    modules:
      - com.example.LoggingKt.logging
```

```kotlin
fun Application.logging(printStreamProvider: () -> PrintStream) {
    dependencies {
        provide<Logger> { SimpleLogger(printStreamProvider()) }
    }
}
```

特定のキーを持つ依存性を注入するには、`@Named` を使用します。

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

##### プロパティと設定の注入

設定値を直接注入するには、`@Property` を使用します。

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

これにより、構造化された設定の扱いが簡素化され、プリミティブ型の自動パースがサポートされます。

詳細と高度な使用法については、[](server-dependency-injection.md) を参照してください。

## Ktor クライアント

### `SaveBodyPlugin` と `HttpRequestBuilder.skipSavingBody()` は非推奨になりました

Ktor 3.2.0 より前は、`SaveBodyPlugin` がデフォルトでインストールされていました。これはレスポンスボディ全体をメモリにキャッシュし、複数回のアクセスを可能にしていました。レスポンスボディの保存を避けるためには、プラグインを明示的に無効にする必要がありました。

Ktor 3.2.0 から、`SaveBodyPlugin` は非推奨となり、すべての非ストリーミングリクエストに対してレスポンスボディを自動的に保存する新しい内部プラグインに置き換えられました。これにより、リソース管理が改善され、HTTP レスポンスのライフサイクルが簡素化されます。

`HttpRequestBuilder.skipSavingBody()` も非推奨です。ボディをキャッシュせずにレスポンスを処理する必要がある場合は、代わりにストリーミングアプローチを使用してください。

<compare first-title="Before" second-title="After">

```kotlin
val file = client.get("/some-file") {
    skipSavingBody()
}.bodyAsChannel()
saveFile(file)
```
```kotlin
client.prepareGet("/some-file").execute { response ->
    saveFile(response.bodyAsChannel())
}
```

</compare>

このアプローチはレスポンスを直接ストリーミングし、ボディがメモリに保存されるのを防ぎます。

### `.wrapWithContent()` および `.wrap()` 拡張関数は非推奨になりました

Ktor 3.2.0 では、[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html) および [`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html) 拡張関数は、新しい `.replaceResponse()` 関数に置き換えられ非推奨となりました。

`.wrapWithContent()` と `.wrap()` 関数は、元のレスポンスボディを `ByteReadChannel` で置き換えますが、これは一度しか読み取ることができません。
同じチャネルインスタンスが、新しいチャネルを返す関数ではなく直接渡された場合、ボディを複数回読み取ると失敗します。
これは、レスポンスボディにアクセスする異なるプラグイン間の互換性を損なう可能性があります。なぜなら、最初にそれを読み取ったプラグインがボディを消費してしまうからです。

```kotlin
// Replaces the body with a channel decoded once from rawContent
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// The first call returns the body
decodedResponse.bodyAsText()

// Subsequent calls return an empty string
decodedResponse.bodyAsText() 
```

この問題を回避するには、代わりに `.replaceResponse()` 関数を使用してください。
これは、アクセスごとに新しいチャネルを返すラムダを受け入れ、他のプラグインとの安全な統合を保証します。

```kotlin
// Replaces the body with a new decoded channel on each access
call.replaceResponse {
    decode(response.rawContent)
}
```

### 解決された IP アドレスへのアクセス

`io.ktor.network.sockets.InetSocketAddress` インスタンスで新しい `.resolveAddress()` 関数を使用できるようになりました。
この関数を使用すると、関連付けられたホストの解決された生 IP アドレスを取得できます。

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

これにより、解決された IP アドレスが `ByteArray` として返されます。アドレスを解決できない場合は `null` が返されます。
返される `ByteArray` のサイズは IP バージョンによって異なります。IPv4 アドレスの場合は 4 バイト、IPv6 アドレスの場合は 16 バイトが含まれます。
JS および Wasm プラットフォームでは、`.resolveAddress()` は常に `null` を返します。

## 共有

### HTMX 統合

Ktor 3.2.0 では、`hx-get` や `hx-swap` などの HTML 属性を介して動的なインタラクションを可能にする最新の JavaScript ライブラリである [HTMX](https://htmx.org/) の実験的なサポートが導入されました。Ktor の HTMX 統合は以下を提供します。

-   ヘッダーに基づいて HTMX リクエストを処理する HTMX 対応ルーティング。
-   Kotlin で HTMX 属性を生成するための HTML DSL 拡張機能。
-   文字列リテラルを排除するための HTMX ヘッダー定数と値。

Ktor の HTMX サポートは、3つの実験的モジュールで利用可能です。

| モジュール             | 説明                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | コア定義とヘッダー定数      |
| `ktor-htmx-html`   | Kotlin HTML DSL との統合       |
| `ktor-server-htmx` | HTMX 固有のリクエストに対するルーティングサポート |

すべての API は `@ExperimentalKtorApi` でマークされており、`@OptIn(ExperimentalKtorApi::class)` によるオプトインが必要です。
詳細については、[](htmx-integration.md) を参照してください。

## Unix ドメインソケット

3.2.0 では、Ktor クライアントを Unix ドメインソケットに接続し、Ktor サーバーをそのソケットをリッスンするように設定できます。
現在、Unix ドメインソケットは CIO エンジンのみでサポートされています。

サーバー設定の例：

```kotlin
val server = embeddedServer(CIO, configure = {
    unixConnector("/tmp/test-unix-socket-ktor.sock")
}) {
    routing {
        get("/") {
            call.respondText("Hello, Unix socket world!")
        }
    }
}
```

Ktor クライアントを使用してそのソケットに接続する例：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

[デフォルトリクエスト](client-default-request.md#unix-domain-sockets)でも Unix ドメインソケットを使用できます。

## インフラストラクチャ

### 公開されたバージョンカタログ

このリリースにより、公式の[公開されたバージョンカタログ](server-dependencies.topic#using-version-catalog)を使用して、すべての Ktor 依存関係を単一のソースから管理できるようになりました。これにより、依存関係で Ktor バージョンを手動で宣言する必要がなくなります。

カタログをプロジェクトに追加するには、**settings.gradle.kts** で Gradle のバージョンカタログを設定し、その後モジュールの **build.gradle.kts** ファイルで参照します。

<tabs>
<tab title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</tab>
<tab title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</tab>
</tabs>

## Gradle プラグイン

### 開発モードの有効化

Ktor 3.2.0 では、開発モードの有効化が簡素化されました。以前は、開発モードを有効にするには `application` ブロックでの明示的な設定が必要でした。現在は、`ktor.development` プロパティを使用して、動的または明示的に有効にできます。

*   プロジェクトプロパティに基づいて開発モードを動的に有効にする。
    ```kotlin
    ktor {
        development = project.ext.has("development")
    }
    ```
*   開発モードを明示的に `true` に設定する。

    ```kotlin
    ktor {
        development = true
    }
    ```

デフォルトでは、`ktor.development` の値は、Gradle プロジェクトプロパティまたはシステムプロパティ `io.ktor.development` のいずれかが定義されている場合に、自動的に解決されます。これにより、Gradle CLI フラグを使用して開発モードを直接有効にできます。

```bash
./gradlew run -Pio.ktor.development=true
```