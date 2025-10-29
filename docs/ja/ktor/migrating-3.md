[//]: # (title: 2.2.x から 3.0.x への移行)

<show-structure for="chapter" depth="3"/>

このガイドでは、Ktorアプリケーションを2.2.xバージョンから3.0.xへ移行する方法について説明します。

## Ktorサーバー {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment`、および `Application`

`ApplicationEngine`、`ApplicationEnvironment`、および`Application`インスタンス間の設定可能性を向上させ、分離をより明確にするために、いくつかの設計変更が導入されました。

v3.0.0より前では、`ApplicationEngine`が`ApplicationEnvironment`を管理し、それがさらに`Application`を管理していました。

しかし、現在の設計では、`Application`は`ApplicationEngine`と`ApplicationEnvironment`の両方を作成、所有、初期化する責任を負います。

この再構築には、以下の破壊的変更が伴います。

- [`ApplicationEngineEnvironmentBuilder`および`applicationEngineEnvironment`クラスの名称変更](#renamed-classes)。
- [`ApplicationEngineEnvironment`から`start()`および`stop()`メソッドの削除](#ApplicationEnvironment)。
- [`commandLineEnvironment()`の削除](#CommandLineConfig)。
- [`ServerConfigBuilder`の導入](#ServerConfigBuilder)。
- [`embeddedServer()`が`ApplicationEngine`ではなく`EmbeddedServer`を返すように変更](#EmbeddedServer)。

これらの変更は、以前のモデルに依存する既存のコードに影響を与えます。

#### クラス名の変更 {id="renamed-classes"}

| パッケージ                 | 2.x.x                                 | 3.0.x                           |
|----------------------------|---------------------------------------|---------------------------------|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment`        | `applicationEnvironment`        |

#### `ApplicationEngineEnvironment`から`start()`および`stop()`メソッドが削除されました {id="ApplicationEnvironment"}

`ApplicationEngineEnvironment`が[`ApplicationEnvironment`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/index.html)に統合されたため、`start()`および`stop()`メソッドは[`ApplicationEngine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/index.html)を介してのみアクセスできるようになりました。

| 2.x.x                                                 | 3.0.x                                |
|-------------------------------------------------------|--------------------------------------|
| `ApplicationEngineEnvironment.start()`                | `ApplicationEngine.start()`          |
| `ApplicationEngineEnvironment.stop()`                 | `ApplicationEngine.stop()`           |

さらに、以下の表で削除されたプロパティと、それに対応する現在の所有権のリストを確認できます。

| 2.x.x                                           | 3.0.x                                        |
|-------------------------------------------------|----------------------------------------------|
| `ApplicationEngineEnvironment.connectors`       | `ApplicationEngine.Configuration.connectors` |
| `ApplicationEnvironment.developmentMode`        | `Application.developmentMode`                |
| `ApplicationEnvironment.monitor`                | `Application.monitor`                        |
| `ApplicationEnvironment.parentCoroutineContext` | `Application.parentCoroutineContext`         |
| `ApplicationEnvironment.rootPath`               | `Application.rootPath`                       |

所有権の変更は、以下の例で示すことができます。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import org.slf4j.helpers.NOPLogger

fun defaultServer(module: Application.() -> Unit) =
  embeddedServer(CIO,
    environment = applicationEngineEnvironment {
      log = NOPLogger.NOP_LOGGER
      connector { 
          port = 8080
      }
      module(module)
    }
  )
```

{validate="false"}

```kotlin
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import org.slf4j.helpers.NOPLogger

fun defaultServer(module: Application.() -> Unit) =
  embeddedServer(CIO,
    environment = applicationEnvironment { log = NOPLogger.NOP_LOGGER },
    configure = {
      connector {
          port = 8080
      }
    },
    module
  )
```

</compare>

#### `commandLineEnvironment()`が削除されました {id="CommandLineConfig"}

コマンドライン引数から`ApplicationEngineEnvironment`インスタンスを作成するために使用されていた`commandLineEnvironment()`関数は、Ktor `3.0.0`で削除されました。代わりに、コマンドライン引数を設定オブジェクトに解析するために[`CommandLineConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html)関数を使用できます。

アプリケーションを`commandLineEnvironment`から`CommandLineConfig`に移行するには、`commandLineEnvironment()`を以下に示すように`configure`ブロックで置き換えてください。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, commandLineEnvironment(args) {
        connector { port = 8080 }
        module {
            routing {
                get("/") {
                    call.respondText("Hello, world!")
                }
            }
        }
    }) {
        requestReadTimeoutSeconds = 5
        responseWriteTimeoutSeconds = 5
    }.start(wait = true)
}
```

```kotlin
fun main(args: Array<String>) {
    embeddedServer(
        factory = Netty,
        configure = {
            val cliConfig = CommandLineConfig(args)
            takeFrom(cliConfig.engineConfig)
            loadCommonConfiguration(cliConfig.rootConfig.environment.config)
        }
    ) {
        routing {
            get("/") {
                call.respondText("Hello, world!")
            }
        }
    }.start(wait = true)
}
```

</compare>

`embeddedServer`でのコマンドライン設定の詳細については、[コードでの設定](server-configuration-code.topic#command-line)トピックを参照してください。

#### `ServerConfigBuilder`の導入 {id="ServerConfigBuilder"}

新しいエンティティである[`ServerConfigBuilder`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html)がサーバープロパティを設定するために導入され、以前の`ApplicationPropertiesBuilder`の設定メカニズムを置き換えます。`ServerConfigBuilder`は、以前`ApplicationProperties`によって管理されていたモジュール、パス、および環境の詳細を保持する[`ServerConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config/index.html)クラスのインスタンスを構築するために使用されます。

以下の表は、主な変更点をまとめたものです。

| パッケージ                 | 2.x.x                          | 3.0.x                 |
|----------------------------|--------------------------------|-----------------------|
| `io.ktor:ktor-server-core` | `ApplicationProperties`        | `ServerConfig`        |
| `io.ktor:ktor-server-core` | `ApplicationPropertiesBuilder` | `ServerConfigBuilder` |

さらに、`embeddedServer()`関数では、この新しい設定アプローチを反映するために`applicationProperties`属性が`rootConfig`に名称変更されました。

`embeddedServer()`を使用する際は、`applicationProperties`属性を`rootConfig`に置き換えてください。
以下は、`developmentMode`を明示的に`true`に設定してサーバーを構成するために`serverConfig`ブロックを使用する例です。

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty,
        serverConfig {
            developmentMode = true
            module(Application::module)
        },
        configure = {
            connector { port = 12345 }
        }
    ).start(wait = true)
}
```

#### `EmbeddedServer`の導入 {id="EmbeddedServer"}

[`EmbeddedServer`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html)クラスが導入され、`embeddedServer()`関数の戻り値の型として`ApplicationEngine`の代わりに使われるようになりました。

モデル変更の詳細については、YouTrackの[KTOR-3857の課題](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design)を参照してください。

### テスト

##### `withTestApplication`および`withApplication`が削除されました

`2.0.0`リリースで[非推奨になった](migration-to-20x.md#testing-api)`withTestApplication`関数と`withApplication`関数は、`ktor-server-test-host`パッケージから削除されました。

代わりに、既存の[Ktorクライアント](client-create-and-configure.md)インスタンスと共に`testApplication`関数を使用し、サーバーにリクエストを送信して結果を検証してください。

以下のテストでは、`handleRequest`関数が`client.get`リクエストに置き換えられています。

<compare first-title="1.x.x" second-title="3.0.x">

```kotlin
@Test
fun testRootLegacyApi() {
    withTestApplication(Application::module) {
        handleRequest(HttpMethod.Get, "/").apply {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("Hello, world!", response.content)
        }
    }
}
```

```kotlin
@Test
fun testRoot() = testApplication {
    val response = client.get("/")
    assertEquals(HttpStatusCode.OK, response.status)
    assertEquals("Hello, world!", response.bodyAsText())
}
```

</compare>

詳細については、[Ktorサーバーでのテスト](server-testing.md)を参照してください。

#### `TestApplication`モジュールの読み込み {id="test-module-loading"}

`TestApplication`は、設定ファイル (例: `application.conf`) からモジュールを自動的に読み込まなくなりました。代わりに、`testApplication`関数内で[明示的にモジュールを読み込む](#explicit-module-loading)か、[設定ファイルを手動で読み込む](#configure-env)必要があります。

##### 明示的なモジュールの読み込み {id="explicit-module-loading"}

モジュールを明示的に読み込むには、`testApplication`内で`application`関数を使用します。このアプローチでは、読み込むモジュールを手動で指定でき、テスト設定をより細かく制御できます。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
  @Test
  fun testRoot() = testApplication {
    client.get("/").apply {
      assertEquals(HttpStatusCode.OK, status)
      assertEquals("Hello World!", bodyAsText())
    }
  }
}
```

{validate="false"}

```kotlin
import com.example.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
  @Test
  fun testRoot() = testApplication {
    application {
      configureRouting()
    }
    client.get("/").apply {
      assertEquals(HttpStatusCode.OK, status)
      assertEquals("Hello World!", bodyAsText())
    }
  }
}

```

{validate="false"}

</compare>

##### 設定ファイルからモジュールを読み込む {id="configure-env"}

設定ファイルからモジュールを読み込みたい場合は、`environment`関数を使用してテストの設定ファイルを指定します。

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

テストアプリケーションの設定の詳細については、[Ktorサーバーでのテスト](server-testing.md)セクションを参照してください。

### `CallLogging`プラグインパッケージが名称変更されました

[`CallLogging`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html)プラグインパッケージは、タイプミスにより名称変更されました。

| 2.x.x                               | 3.0.x                                |
|-------------------------------------|--------------------------------------|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common`モジュールが削除されました

`Application`が`ApplicationEngine`の知識を必要とするため、`ktor-server-host-common`モジュールの内容は`ktor-server-core`、具体的には[`io.ktor.server.engine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/index.html)パッケージに統合されました。

それに応じて依存関係が更新されていることを確認してください。ほとんどの場合、`ktor-server-host-common`の依存関係を削除するだけで済みます。

### `Locations`プラグインが削除されました

Ktorサーバー用の`Locations`プラグインは削除されました。タイプセーフなルーティングを作成するには、代わりに[Resourcesプラグイン](server-resources.md)を使用してください。これには以下の変更が必要です。

*   `io.ktor:ktor-server-locations`アーティファクトを`io.ktor:ktor-server-resources`に置き換えます。

*   `Resources`プラグインはKotlin serializationプラグインに依存します。serializationプラグインを追加するには、[kotlinx.serializationのセットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)を参照してください。

*   プラグインのインポートを`io.ktor.server.locations.*`から`io.ktor.server.resources.*`に更新します。

*   さらに、`io.ktor.resources`から`Resource`モジュールをインポートします。

以下の例は、これらの変更を実装する方法を示しています。

<compare first-title="2.2.x" second-title="3.0.x">

```kotlin
import io.ktor.server.locations.*

@Location("/articles")
class article(val value: Int)

fun Application.module() {
    install(Locations)
    routing {
        get<article> {
            // Get all articles ...
            call.respondText("List of articles")
        }
    }
}
```

```kotlin
import io.ktor.resources.Resource
import io.ktor.server.resources.*

@Resource("/articles")
class Articles(val value: Int)

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> {
            // Get all articles ...
            call.respondText("List of articles")
        }
    }
}
```

</compare>

`Resources`の操作の詳細については、[タイプセーフなルーティング](server-resources.md)を参照してください。

### WebSockets設定における`java.time`の置き換え

[WebSockets](server-websockets.md)プラグインの設定は、`pingPeriod`および`timeout`プロパティにKotlinの[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)を使用するように更新されました。これにより、以前の`java.time.Duration`の使用が、よりKotlinらしい体験のために置き換えられます。

既存のコードを新しい形式に移行するには、`kotlin.time.Duration`クラスの拡張関数とプロパティを使用して期間を構築します。以下の例では、`Duration.ofSeconds()`がKotlinの`seconds`拡張に置き換えられています。

<compare first-title="2.x.x" second-title="3.0.x">

```kotlin
import java.time.Duration
  
install(WebSockets) {
    pingPeriod = Duration.ofSeconds(15)
    timeout = Duration.ofSeconds(15)
    //..
}
```

```kotlin
import kotlin.time.Duration.Companion.seconds

install(WebSockets) {
    pingPeriod = 15.seconds
    timeout = 15.seconds
    //..
}
```

</compare>

他の期間設定にも、必要に応じて同様のKotlin期間拡張（`minutes`、`hours`など）を使用できます。詳細については、[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)のドキュメントを参照してください。

### サーバーソケットの`.bind()`がsuspend関数になりました

JSおよびWasmJS環境での非同期操作をサポートするため、[`TCPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-tcp-socket-builder/index.html)と[`UDPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-u-d-p-socket-builder/index.html)の両方で、サーバーソケットの`.bind()`関数がsuspend関数に更新されました。これは、`.bind()`へのすべての呼び出しがコルーチン内で行われる必要があることを意味します。

移行するには、`.bind()`がコルーチンまたはsuspend関数内でのみ呼び出されるようにしてください。以下は`runBlocking`を使用する例です。

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

ソケットの操作の詳細については、[ソケットのドキュメント](server-sockets.md)を参照してください。

## マルチパートフォームデータ

### バイナリおよびファイルアイテムの新しいデフォルト制限

Ktor 3.0.0では、[`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)を使用してバイナリおよびファイルアイテムを受信するためのデフォルトの制限が50MBに導入されました。受信したファイルまたはバイナリアイテムが50MBの制限を超えると、`IOException`がスローされます。

#### デフォルト制限のオーバーライド

アプリケーションが以前、明示的な設定なしに50MBを超えるファイルの処理に依存していた場合、予期しない動作を避けるためにコードを更新する必要があります。

デフォルト制限をオーバーライドするには、`.receiveMultipart()`を呼び出すときに`formFieldLimit`パラメーターを渡します。

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

### `PartData.FileItem.streamProvider()`が非推奨になりました

以前のバージョンのKtorでは、`PartData.FileItem`の`.streamProvider()`関数を使用して、ファイルアイテムのコンテンツに`InputStream`としてアクセスしていました。Ktor 3.0.0以降、この関数は非推奨になりました。

アプリケーションを移行するには、`.streamProvider()`を[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)関数に置き換えてください。`.provider()`関数は`ByteReadChannel`を返します。これは、バイトのストリームを増分的に読み取るための、コルーチンフレンドリーな非ブロック抽象化です。
その後、`ByteReadChannel`によって提供される[`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html)または[`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html)メソッドを使用して、チャネルからファイル出力に直接データをストリームできます。

この例では、`.copyAndClose()`メソッドが`ByteReadChannel`からファイルの`WritableByteChannel`にデータを転送します。

<compare first-title="2.x.x" second-title="3.0.x">

```kotlin
fun Application.main() {
    routing {
        post("/upload") {
            val multipart = call.receiveMultipart()
            multipart.forEachPart { partData ->
                if (partData is PartData.FileItem) {
                    var fileName = partData.originalFileName as String
                    val file = File("uploads/$fileName")
                    file.writeBytes(partData.streamProvider().readBytes())
                }
                // ...
            }
        }
    }
}
```

```kotlin
fun Application.main() {
    routing {
        post("/upload") {
            val multipart = call.receiveMultipart()
            multipart.forEachPart { partData ->
                if (partData is PartData.FileItem) {
                    var fileName = partData.originalFileName as String
                    val file = File("uploads/$fileName")
                    partData.provider().copyAndClose(file.writeChannel())
                }
                // ...
            }
        }
    }
}
```

</compare>

完全な例とマルチパートフォームデータの操作に関する詳細については、[マルチパートフォームデータの要求処理](server-requests.md#form_data)を参照してください。

### セッション暗号化メソッドの更新

`Sessions`プラグインによって提供される暗号化メソッドがセキュリティを強化するために更新されました。

具体的には、以前は復号化されたセッション値からMACを導出していた`SessionTransportTransformerEncrypt`メソッドが、暗号化された値からMACを計算するようになりました。

既存のセッションとの互換性を確保するため、Ktorは`backwardCompatibleRead`プロパティを導入しました。現在の設定では、`SessionTransportTransformerEncrypt`のコンストラクタにこのプロパティを含めます。

```kotlin
install(Sessions) {
  cookie<UserSession>("user_session") {
    // ...
    transform(
      SessionTransportTransformerEncrypt(
        secretEncryptKey, // ここに暗号化キー
        secretSignKey, // ここに署名キー
        backwardCompatibleRead = true
      )
    )
  }
}
```

Ktorのセッション暗号化の詳細については、[セッションデータの署名と暗号化](server-sessions.md#sign_encrypt_session)を参照してください。

## Ktorクライアント

### `HttpResponse`の`content`プロパティの名称変更

Ktor 3.0.0より前では、[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)の`content`プロパティは、ネットワークから読み取られた応答コンテンツへの生の`ByteReadChannel`を提供していました。Ktor 3.0.0以降、`content`プロパティは、その目的をよりよく反映するために`rawContent`に名称変更されました。

### `SocketTimeoutException`がタイプエイリアスになりました

`io.ktor.client.network.sockets`パッケージの[`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html)は、KotlinクラスからJavaクラスのエイリアスに変換されました。この変更により、特定のケースで`NoClassDefFoundError`が発生する可能性があり、既存のコードの更新が必要になる場合があります。

アプリケーションを移行するには、コードが古いクラスを参照しておらず、最新のKtorバージョンでコンパイルされていることを確認してください。例外チェックを更新する方法は次のとおりです。

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
    <code-block lang="kotlin" code="    if (exception is io.ktor.client.network.sockets.SocketTimeoutException) { ... }"/>
    <code-block lang="kotlin" code="    if (exception is java.net.SocketTimeoutException) { ... }"/>
</compare>

## 共有モジュール

### `kotlinx-io`への移行

3.0.0リリースで、Ktorは`kotlinx-io`ライブラリの使用に移行しました。これは、Kotlinライブラリ全体で標準化された効率的なI/O APIを提供します。この変更により、パフォーマンスが向上し、メモリ割り当てが削減され、I/O処理が簡素化されます。プロジェクトがKtorの低レベルI/O APIとやり取りしている場合は、互換性を確保するためにコードを更新する必要がある場合があります。

これは、[`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html)や[`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html)など、多くのクラスに影響を与えます。さらに、以下のKtorクラスは現在`kotlinx-io`を基盤としており、以前の実装は非推奨になりました。

| Ktor 2.x                                  | Ktor 3.x                  |
|-------------------------------------------|---------------------------|
| `io.ktor.utils.io.core.Buffer`            | `kotlinx.io.Buffer`       |
| `io.ktor.utils.io.core.BytePacketBuilder` | `kotlinx.io.Sink`         |
| `io.ktor.utils.io.core.ByteReadPacket`    | `kotlinx.io.Source`       |
| `io.ktor.utils.io.core.Input`             | `kotlinx.io.Source`       |
| `io.ktor.utils.io.core.Output`            | `kotlinx.io.Sink`         |
| `io.ktor.utils.io.core.Sink`              | `kotlinx.io.Buffer`       |
| `io.ktor.utils.io.errors.EOFException`    | `kotlinx.io.EOFException` |
| `io.ktor.utils.io.errors.IOException`     | `kotlinx.io.IOException`  |

非推奨のAPIはKtor 4.0までサポートされますが、できるだけ早く移行することをお勧めします。アプリケーションを移行するには、`kotlinx-io`から対応するメソッドを使用するようにコードを更新してください。

#### 例：ストリーミングI/O

大規模なファイルダウンロードを処理し、効率的なストリーミングソリューションが必要な場合は、手動のバイト配列処理を`kotlinx-io`の最適化されたストリーミングAPIに置き換えることができます。

Ktor 2.xでは、大規模なファイルダウンロードの処理は、通常、`ByteReadChannel.readRemaining()`を使用して利用可能なバイトを手動で読み取り、`File.appendBytes()`を使用してファイルに書き込むことでした。

```Kotlin
val client = HttpClient(CIO)
val file = File.createTempFile("files", "index")

runBlocking {
    client.prepareGet("https://ktor.io/").execute { httpResponse ->
        val channel: ByteReadChannel = httpResponse.body()
        while (!channel.isClosedForRead) {
            val packet = channel.readRemaining(DEFAULT_BUFFER_SIZE.toLong())
            while (!packet.isEmpty) {
                val bytes = packet.readBytes()
                file.appendBytes(bytes)
                println("Received ${file.length()} bytes from ${httpResponse.contentLength()}")
            }
        }
        println("A file saved to ${file.path}")
    }
}
```

このアプローチでは、複数のメモリ割り当てと冗長なデータコピーが発生しました。

Ktor 3.xでは、`ByteReadChannel.readRemaining()`が`Source`を返すようになり、`Source.transferTo()`を使用してデータをストリーミングできるようになりました。

```Kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

このアプローチでは、チャネルからファイルのシンクにデータが直接転送され、メモリ割り当てが最小限に抑えられ、パフォーマンスが向上します。

完全な例については、[client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)を参照してください。

> APIの置き換えの詳細については、[`kotlinx-io`ドキュメント](https://kotlinlang.org/api/kotlinx-io/)を参照してください。

### Attributeキーが厳密な型の一致を要求するようになりました

Ktor 3.0.0では、[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html)インスタンスはIDによって比較され、値を格納および取得する際に厳密な型の一致を要求するようになりました。これにより、型安全性が確保され、型不一致によって引き起こされる意図しない動作が防止されます。

以前は、`getOrNull<Any>()`を使用して`AttributeKey<Boolean>`をフェッチするなど、格納された型とは異なるジェネリック型で属性を取得することが可能でした。

アプリケーションを移行するには、取得型が格納型と厳密に一致することを確認してください。

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 空のアーティファクトの削除

Ktor 1.0.0以降、空のアーティファクト`io.ktor:ktor`が誤って[Maven](https://repo1.maven.org/maven2/io/ktor/ktor/)に公開されていました。このアーティファクトはKtor 3.0.0以降削除されました。

プロジェクトにこのアーティファクトが依存関係として含まれている場合、安全に削除できます。