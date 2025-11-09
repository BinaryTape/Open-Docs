[//]: # (title: Ktor 3.2.0の新機能)

<show-structure for="chapter,procedure" depth="2"/>

_[リリース日: 2025年6月12日](releases.md#release-details)_

この機能リリースの主なハイライトは以下のとおりです。

*   [バージョンカタログ](#published-version-catalog)
*   [依存性注入](#dependency-injection)
*   [ファーストクラスのHTMXサポート](#htmx-integration)
*   [サスペンド可能なモジュール関数](#suspendable-module-functions)

## Ktorサーバー

### サスペンド可能なモジュール関数

Ktor 3.2.0から、[アプリケーションモジュール](server-modules.md)がサスペンド関数をサポートするようになりました。

> サスペンドモジュールのサポートが導入されたことにより、開発モードでの自動リロードはブロッキング関数参照では機能しなくなりました。詳細については、[開発モードの自動リロードの退行](#regression)を参照してください。
>
{style="warning"}

以前は、Ktorモジュール内で非同期関数を追加するには、サーバー作成時にデッドロックを引き起こす可能性のある`runBlocking`ブロックが必要でした。

```kotlin
fun Application.installEvents() {
    val kubernetesConnection = runBlocking {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

これで`suspend`キーワードを使用できるようになり、アプリケーション起動時に非同期コードが記述できます。

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

#### 並行モジュール読み込み

`ktor.application.startup = concurrent`というGradleプロパティを追加することで、並行モジュール読み込みをオプトインすることもできます。
これにより、すべてのアプリケーションモジュールが独立して起動されるため、1つがサスペンドしても他のモジュールはブロックされません。
これにより、依存性注入のための非シーケンシャルな読み込みが可能になり、場合によっては読み込み速度が向上します。

詳細については、[並行モジュール読み込み](server-modules.md#concurrent-module-loading)を参照してください。

### 設定ファイルのデシリアライゼーション

Ktor 3.2.0では、`Application`クラスの新しい`.property()`拡張関数により、型付き設定ロードが導入されました。これにより、構造化された設定セクションをKotlinデータクラスに直接デシリアライズできるようになります。

この機能により、設定値へのアクセスが簡素化され、ネストされた設定やグループ化された設定を扱う際のボイラープレートが大幅に削減されます。

以下の**application.yaml**ファイルを考えてみましょう。

```yaml
database:
   url: "$DATABASE_URL:jdbc:postgresql://localhost:5432/postgres"
   username: "$DATABASE_USER:ktor_admin"
   password: "$DATABASE_PASSWORD:ktor123!"
```

以前は、各設定値を個別に取得する必要がありました。新しい`.property()`拡張関数を使用すると、設定セクション全体を一度にロードできます。

<compare>
<code-block lang="kotlin" code="data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig = DatabaseConfig(&#10;    url = environment.config.property(&quot;database.url&quot;).getString(),&#10;    username = environment.config.property(&quot;database.username&quot;).getString(),&#10;    password = environment.config.property(&quot;database.password&quot;).getString(),&#10;  )&#10;  // use configuration&#10;}"/>
<code-block lang="kotlin" code="@Serializable &#10;data class DatabaseConfig(&#10;    val url: String,&#10;    val username: String,&#10;    val password: String? = null,&#10;)&#10;&#10;fun Application.module() {&#10;  val databaseConfig: DatabaseConfig = property(&quot;database&quot;)&#10;  // use configuration&#10;}"/>
</compare>

この機能は、HOCONとYAMLの両方の設定形式をサポートし、デシリアライゼーションには`kotlinx.serialization`を使用します。

### `ApplicationTestBuilder`が`client`を設定可能に

Ktor 3.2.0から、`ApplicationTestBuilder`クラスの`client`プロパティが可変になりました。以前は読み取り専用でした。
この変更により、独自のテストクライアントを設定し、`ApplicationTestBuilder`クラスが利用可能な場所であればどこでも再利用できるようになります。例えば、拡張関数内からクライアントにアクセスできます。

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

Ktor 3.2.0では、依存性注入 (DI) のサポートが導入され、設定ファイルやアプリケーションコードから直接依存関係を管理・接続することが容易になりました。新しいDIプラグインは、依存関係の解決を簡素化し、非同期ロードをサポートし、自動クリーンアップを提供し、テストとのスムーズな統合を実現します。

<var name="artifact_name" value="ktor-server-di" />

DIを使用するには、`%artifact_name%`アーティファクトをビルドスクリプトに含めます。

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### 基本的な依存関係の登録

ラムダ、関数参照、またはコンストラクタ参照を使用して依存関係を登録できます。

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

#### 設定ベースの依存関係登録

設定ファイルでクラスパス参照を使用して、宣言的に依存関係を設定できます。これは関数とクラスの両方の参照をサポートします。

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

引数は、`@Property`や`@Named`のようなアノテーションを介して自動的に解決されます。

#### 依存関係の解決と注入

##### 依存関係の解決

依存関係を解決するには、プロパティ委譲または直接解決を使用できます。

```kotlin
// Using property delegation
val service: GreetingService by dependencies

// Direct resolution
val service = dependencies.resolve<GreetingService>()
```

##### 非同期依存関係解決

非同期ロードをサポートするために、サスペンド関数を使用できます。

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

DIプラグインは、すべての依存関係が準備されるまで`resolve()`呼び出しを自動的にサスペンドします。

##### アプリケーションモジュールへの注入

モジュールパラメータを指定することで、依存関係をアプリケーションモジュールに直接注入できます。KtorはDIコンテナからそれらを解決します。

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

特定のキーを持つ依存関係を注入するには、`@Named`を使用します。

```kotlin
fun Application.userRepository(@Named("mongo") database: Database) {
    // Uses the dependency named "mongo"
}
```

##### プロパティと設定の注入

`@Property`を使用して、設定値を直接注入します。

```yaml
connection:
  domain: api.example.com
  path: /v1
  protocol: https
```

```kotlin
val connection: Connection = application.property("connection")
```

これにより、構造化された設定の作業が簡素化され、プリミティブ型の自動パースがサポートされます。

詳細と高度な使用法については、[依存性注入](server-dependency-injection.md)を参照してください。

### 開発モードの自動リロードの退行 {id="regression"}

サスペンド関数のサポートの副次的な影響として、ブロッキング関数参照 (`Application::myModule`) は現在、キャスト時に匿名内部クラスにラップされます。これにより、関数名が安定した参照として保持されなくなるため、自動リロードが機能しなくなります。

これは、`development`モードでの自動リロードは、サスペンド関数モジュールと設定参照でのみ機能することを意味します。

```kotlin
// Suspend function reference
embeddedServer(Netty, port = 8080, module = Application::mySuspendModule)

// Configuration reference
ktor {
    application {
        modules = [ com.example.ApplicationKt.mySuspendModule ]
    }
}
```

## Ktorクライアント

### `SaveBodyPlugin`と`HttpRequestBuilder.skipSavingBody()`は非推奨に

Ktor 3.2.0以前は、`SaveBodyPlugin`がデフォルトでインストールされていました。これはレスポンスボディ全体をメモリにキャッシュし、複数回アクセスできるようにしていました。レスポンスボディの保存を避けるには、このプラグインを明示的に無効にする必要がありました。

Ktor 3.2.0から、`SaveBodyPlugin`は非推奨となり、すべての非ストリーミングリクエストに対してレスポンスボディを自動的に保存する新しい内部プラグインに置き換えられました。これにより、リソース管理が改善され、HTTPレスポンスのライフサイクルが簡素化されます。

`HttpRequestBuilder.skipSavingBody()`も非推奨です。ボディをキャッシュせずにレスポンスを処理する必要がある場合は、代わりにストリーミングアプローチを使用してください。

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

### `.wrapWithContent()`と`.wrap()`拡張関数は非推奨に

Ktor 3.2.0では、[`.wrapWithContent()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap-with-content.html)および[`.wrap()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.observer/wrap.html)拡張関数は、新しい`.replaceResponse()`関数に置き換えられ非推奨になりました。

`.wrapWithContent()`と`.wrap()`関数は、元のレスポンスボディを`ByteReadChannel`に置き換えますが、これは一度しか読み取ることができません。
同じチャネルインスタンスが関数（新しいチャネルを返す）の代わりに直接渡されると、ボディを複数回読み取ることができません。
これにより、レスポンスボディにアクセスする異なるプラグイン間の互換性が失われる可能性があります。なぜなら、最初にボディを読み取るプラグインがボディを消費してしまうからです。

```kotlin
// rawContentから一度デコードされたチャネルでボディを置き換えます
val decodedBody = decode(response.rawContent)
val decodedResponse = call.wrapWithContent(decodedBody).response

// 最初の呼び出しはボディを返します
decodedResponse.bodyAsText()

// その後の呼び出しは空文字列を返します
decodedResponse.bodyAsText() 
```

この問題を回避するには、代わりに`.replaceResponse()`関数を使用してください。
これは、アクセスごとに新しいチャネルを返すラムダを受け入れ、他のプラグインとの安全な統合を保証します。

```kotlin
// アクセスごとに新しいデコードされたチャネルでボディを置き換えます
call.replaceResponse {
    decode(response.rawContent)
}
```

### 解決されたIPアドレスへのアクセス

`io.ktor.network.sockets.InetSocketAddress`インスタンスの新しい`.resolveAddress()`関数を使用できるようになりました。
この関数を使用すると、関連付けられたホストの解決された生IPアドレスを取得できます。

```kotlin
val address = InetSocketAddress("sample-proxy-server", 1080)
val rawAddress = address.resolveAddress()
```

これは、解決されたIPアドレスを`ByteArray`として返します。アドレスを解決できない場合は`null`を返します。
返される`ByteArray`のサイズはIPバージョンによって異なり、IPv4アドレスの場合は4バイト、IPv6アドレスの場合は16バイトになります。
JSおよびWasmプラットフォームでは、`.resolveAddress()`は常に`null`を返します。

### HTTPキャッシュのクリア

必要に応じて、新しい[`CacheStorage`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html)メソッドを使用してキャッシュされたHTTPレスポンスをクリアできるようになりました。

*   `.removeAll(url)` は、指定されたURLに一致するすべてのキャッシュエントリを削除します。
*   `.remove(url, varyKeys)` は、指定されたURLと`Vary`キーに一致する特定のキャッシュエントリを削除します。

これらのメソッドは、キャッシュ無効化と、古くなった、または特定のキャッシュされたレスポンスを管理する方法をより詳細に制御できるようにします。

## 共通

### HTMX統合

Ktor 3.2.0では、[HTMX](https://htmx.org/)の実験的サポートが導入されました。HTMXは、`hx-get`や`hx-swap`などのHTML属性を介した動的なインタラクションを可能にするモダンなJavaScriptライブラリです。KtorのHTMX統合は以下を提供します。

- ヘッダーに基づいてHTMXリクエストを処理するHTMX対応ルーティング。
- KotlinでHTMX属性を生成するためのHTML DSL拡張。
- 文字列リテラルを排除するためのHTMXヘッダー定数と値。

KtorのHTMXサポートは、3つの実験的モジュールで利用可能です。

| モジュール             | 説明                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | コア定義とヘッダー定数      |
| `ktor-htmx-html`   | Kotlin HTML DSLとの統合       |
| `ktor-server-htmx` | HTMX固有のリクエストのルーティングサポート |

すべてのAPIは`@ExperimentalKtorApi`でマークされており、`@OptIn(ExperimentalKtorApi::class)`によるオプトインが必要です。
詳細については、[HTMX統合](htmx-integration.md)を参照してください。

## Unixドメインソケット

3.2.0では、KtorクライアントをUnixドメインソケットに接続し、Ktorサーバーをそのようなソケットをリッスンするように設定できます。
現在、UnixドメインソケットはCIOエンジンでのみサポートされています。

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

Ktorクライアントを使用してそのソケットに接続する例：

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

[デフォルトリクエスト](client-default-request.md#unix-domain-sockets)でもUnixドメインソケットを使用できます。

## インフラストラクチャ

### 公開されたバージョンカタログ

このリリースにより、公式の[公開されたバージョンカタログ](server-dependencies.topic#using-version-catalog)を使用して、すべてのKtor依存関係を一元的に管理できるようになりました。これにより、依存関係でKtorのバージョンを手動で宣言する必要がなくなります。

カタログをプロジェクトに追加するには、**settings.gradle.kts**でGradleのバージョンカタログを設定し、モジュールの**build.gradle.kts**ファイルで参照します。

<Tabs>
<TabItem title="settings.gradle.kts">

```kotlin
dependencyResolutionManagement {
    versionCatalogs {
        create("ktorLibs") {
            from("io.ktor:ktor-version-catalog:%ktor_version%")
        }
    }
}
```

</TabItem>
<TabItem title="build.gradle.kts">

```kotlin
dependencies {
    implementation(ktorLibs.client.core)
    implementation(ktorLibs.client.cio)
    // ...
}
```

</TabItem>
</Tabs>

## Gradleプラグイン

### 開発モードの有効化

Ktor 3.2.0では、開発モードの有効化が簡素化されました。以前は、開発モードを有効にするには`application`ブロックで明示的な設定が必要でした。現在では、`ktor.development`プロパティを使用して、動的または明示的に有効にできます。

*   プロジェクトプロパティに基づいて開発モードを動的に有効にする。
    ```kotlin
    ktor {
        development = project.ext.has("development")
    }
    ```
*   開発モードを明示的にtrueに設定する。

    ```kotlin
    ktor {
        development = true
    }
    ```

デフォルトでは、`ktor.development`の値は、Gradleプロジェクトプロパティまたはシステムプロパティ`io.ktor.development`のいずれかが定義されている場合に、自動的に解決されます。これにより、Gradle CLIフラグを使用して開発モードを直接有効にすることができます。

```bash
./gradlew run -Pio.ktor.development=true