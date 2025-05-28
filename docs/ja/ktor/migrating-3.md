[//]: # (title: 2.2.x から 3.0.x への移行)

<show-structure for="chapter" depth="3"/>

このガイドでは、Ktorアプリケーションをバージョン2.2.xから3.0.xへ移行する方法について説明します。

## Ktorサーバー {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment`、および `Application`

`ApplicationEngine`、`ApplicationEnvironment`、および `Application` の各インスタンス間の設定可能性を向上させ、より明確な分離を提供するために、いくつかの設計変更が導入されました。

v3.0.0より前は、`ApplicationEngine`が`ApplicationEnvironment`を管理し、`ApplicationEnvironment`が`Application`を管理していました。

しかし、現在の設計では、`Application`が`ApplicationEngine`と`ApplicationEnvironment`の両方の作成、所有、および初期化を担当します。

この再構築には、以下の破壊的変更が伴います。

-   [`ApplicationEngineEnvironmentBuilder` クラスと `applicationEngineEnvironment` クラスの名前が変更されました](#renamed-classes)。
-   [`ApplicationEngineEnvironment` から `start()` メソッドと `stop()` メソッドが削除されました](#ApplicationEnvironment)。
-   [`commandLineEnvironment()` が削除されました](#CommandLineConfig)。
-   [`ServerConfigBuilder` の導入](#ServerConfigBuilder)。
-   [`embeddedServer()` が `ApplicationEngine` の代わりに `EmbeddedServer` を返します](#EmbeddedServer)。

これらの変更は、以前のモデルに依存する既存のコードに影響を与えます。

#### 名前が変更されたクラス {id="renamed-classes"}

| Package                    | 2.x.x                                 | 3.0.x                           |
|----------------------------|---------------------------------------|---------------------------------|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment`        | `applicationEnvironment`        |

#### `ApplicationEngineEnvironment` から `start()` メソッドと `stop()` メソッドが削除されました {id="ApplicationEnvironment"}

`ApplicationEngineEnvironment` が [`ApplicationEnvironment`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/index.html) にマージされたことにより、`start()` メソッドと `stop()` メソッドは、[`ApplicationEngine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/index.html) を介してのみアクセスできるようになりました。

| 2.x.x                                                 | 3.0.x                                |
|-------------------------------------------------------|--------------------------------------|
| `ApplicationEngineEnvironment.start()`                | `ApplicationEngine.start()`          |
| `ApplicationEngineEnvironment.stop()`                 | `ApplicationEngine.stop()`           |

さらに、以下の表では、削除されたプロパティとその現在の対応する所有者の一覧を確認できます。

| 2.x.x                                           | 3.0.x                                        |
|-------------------------------------------------|----------------------------------------------|
| `ApplicationEngineEnvironment.connectors`       | `ApplicationEngine.Configuration.connectors` |
| `ApplicationEnvironment.developmentMode`        | `Application.developmentMode`                |
| `ApplicationEnvironment.monitor`                | `Application.monitor`                        |
| `ApplicationEnvironment.parentCoroutineContext` | `Application.parentCoroutineContext`         |
| `ApplicationEnvironment.rootPath`               | `Application.rootPath`                       |

所有権の変更は、以下の例で説明できます。

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

#### `commandLineEnvironment()` が削除されました {id="CommandLineConfig"}

コマンドライン引数から `ApplicationEngineEnvironment` インスタンスを作成するために使用されていた `commandLineEnvironment()` 関数は、Ktor `3.0.0` で削除されました。代わりに、[`CommandLineConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html) 関数を使用して、コマンドライン引数を設定オブジェクトにパースできます。

アプリケーションを `commandLineEnvironment` から `CommandLineConfig` へ移行するには、`commandLineEnvironment()` を以下に示すように `configure` ブロックに置き換えます。

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
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="13,58-72"}

</compare>

`embeddedServer` を使用したコマンドライン設定の詳細については、[コードでの設定](server-configuration-code.topic#command-line)のトピックを参照してください。

#### `ServerConfigBuilder` の導入 {id="ServerConfigBuilder"}

サーバープロパティを設定するための新しいエンティティである [`ServerConfigBuilder`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html) が導入され、以前の `ApplicationPropertiesBuilder` の設定メカニズムに取って代わりました。`ServerConfigBuilder` は [`ServerConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config/index.html) クラスのインスタンスを構築するために使用され、このクラスが以前は `ApplicationProperties` によって管理されていたモジュール、パス、および環境の詳細を保持するようになりました。

以下の表に、主な変更点をまとめます。

| Package                    | 2.x.x                          | 3.0.x                 |
|----------------------------|--------------------------------|-----------------------|
| `io.ktor:ktor-server-core` | `ApplicationProperties`        | `ServerConfig`        |
| `io.ktor:ktor-server-core` | `ApplciationPropertiesBuilder` | `ServerConfigBuilder` |

さらに、`embeddedServer()` 関数では、この新しい設定アプローチを反映するために、`applicationProperties` 属性が `rootConfig` に名前変更されました。

`embeddedServer()` を使用する場合、`applicationProperties` 属性を `rootConfig` に置き換えます。以下は、`serverConfig` ブロックを使用して `developmentMode` を明示的に `true` に設定してサーバーを構成する例です。

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

#### `EmbeddedServer` の導入 {id="EmbeddedServer"}

[`EmbeddedServer`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html) クラスが導入され、`embeddedServer()` 関数の戻り値の型として `ApplicationEngine` を置き換えるために使用されます。

モデル変更の詳細については、YouTrackの[イシュー KTOR-3857](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design) を参照してください。

### テスト

##### `withTestApplication` と `withApplication` が削除されました

[`2.0.0` リリースで以前に非推奨とされていた](migration-to-20x.md#testing-api) `withTestApplication` および `withApplication` 関数は、`ktor-server-test-host` パッケージから削除されました。

代わりに、`testApplication` 関数を既存の [Ktorクライアント](client-create-and-configure.md) インスタンスとともに使用して、サーバーへのリクエストを行い、結果を検証してください。

以下のテストでは、`handleRequest` 関数が `client.get` リクエストに置き換えられています。

<compare first-title="1.x.x" second-title="3.0.x">

```kotlin
```

{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="18-26"}

```kotlin
```

{src="https://raw.githubusercontent.com/ktorio/ktor-documentation/refs/heads/2.3.12/codeSnippets/snippets/engine-main/src/test/kotlin/EngineMainTest.kt"
include-lines="11-16"}

</compare>

詳細については、[](server-testing.md) を参照してください。

#### `TestApplication` モジュールのロード {id="test-module-loading"}

`TestApplication` は、設定ファイル（例: `application.conf`）からモジュールを自動的にロードしなくなりました。代わりに、`testApplication` 関数内で[モジュールを明示的にロードする](#explicit-module-loading)か、[設定ファイルを手動でロードする](#configure-env)必要があります。

##### 明示的なモジュールのロード {id="explicit-module-loading"}

モジュールを明示的にロードするには、`testApplication` 関数内で `application` 関数を使用します。このアプローチにより、ロードするモジュールを手動で指定でき、テスト設定をより細かく制御できます。

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

##### 設定ファイルからモジュールをロード {id="configure-env"}

設定ファイルからモジュールをロードしたい場合は、`environment` 関数を使用してテスト用の設定ファイルを指定します。

```kotlin
```

{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

テストアプリケーションの設定に関する詳細については、[](server-testing.md) セクションを参照してください。

### `CallLogging` プラグインのパッケージ名が変更されました

[`CallLogging`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html) プラグインのパッケージ名は、タイプミスにより変更されました。

| 2.x.x                               | 3.0.x                                |
|-------------------------------------|--------------------------------------|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common` モジュールが削除されました

`Application` が `ApplicationEngine` の知識を必要とするため、`ktor-server-host-common` モジュールの内容は `ktor-server-core` にマージされ、具体的には [`io.ktor.server.engine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/index.html) パッケージに統合されました。

依存関係が適切に更新されていることを確認してください。ほとんどの場合、`ktor-server-host-common` の依存関係は削除しても問題ありません。

### `Locations` プラグインが削除されました

Ktorサーバーの `Locations` プラグインは削除されました。タイプセーフなルーティングを作成するには、代わりに[Resourcesプラグイン](server-resources.md)を使用してください。これには以下の変更が必要です。

*   `io.ktor:ktor-server-locations` アーティファクトを `io.ktor:ktor-server-resources` に置き換えます。

*   `Resources` プラグインはKotlinシリアライゼーションプラグインに依存しています。シリアライゼーションプラグインを追加するには、[kotlinx.serializationのセットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)を参照してください。

*   プラグインのインポートを `io.ktor.server.locations.*` から `io.ktor.server.resources.*` に更新します。

*   さらに、`Resource` モジュールを `io.ktor.resources` からインポートします。

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

`Resources` の操作に関する詳細については、[](server-resources.md) を参照してください。

### WebSockets設定における `java.time` の置き換え

[WebSockets](server-websockets.md) プラグインの設定は、`pingPeriod` および `timeout` プロパティにKotlinの [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) を使用するように更新されました。これにより、以前の `java.time.Duration` の使用が置き換えられ、よりイディオマティックなKotlinの体験が提供されます。

既存のコードを新しい形式に移行するには、`kotlin.time.Duration` クラスの拡張関数とプロパティを使用して期間を構築します。以下の例では、`Duration.ofSeconds()` がKotlinの `seconds` 拡張に置き換えられています。

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

他の期間設定でも、必要に応じて同様のKotlin期間拡張（`minutes`、`hours` など）を使用できます。詳細については、[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) のドキュメントを参照してください。

### サーバーソケットの `.bind()` が中断関数になりました

JSおよびWasmJS環境での非同期操作をサポートするため、[`TCPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-tcp-socket-builder/index.html) と [`UDPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-u-d-p-socket-builder/index.html) の両方におけるサーバーソケットの `.bind()` 関数が中断関数に更新されました。これは、`.bind()` へのすべての呼び出しがコルーチン内で行われる必要があることを意味します。

移行するには、`.bind()` がコルーチンまたは中断関数内でのみ呼び出されるようにしてください。以下に `runBlocking` を使用する例を示します。

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

ソケットの操作に関する詳細については、[ソケットのドキュメント](server-sockets.md)を参照してください。

## マルチパートフォームデータ

### バイナリおよびファイルアイテムの新しいデフォルト制限

Ktor 3.0.0では、[`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html) を使用してバイナリおよびファイルアイテムを受信するためのデフォルト制限として50MBが導入されました。受信したファイルまたはバイナリアイテムが50MBの制限を超えると、`IOException` がスローされます。

#### デフォルト制限の上書き

アプリケーションが以前、明示的な設定なしに50MBを超えるファイルを処理することに依存していた場合、予期しない動作を避けるためにコードを更新する必要があります。

デフォルト制限を上書きするには、`.receiveMultipart()` を呼び出す際に `formFieldLimit` パラメータを渡します。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="17"}

### `PartData.FileItem.streamProvider()` が非推奨になりました

以前のバージョンのKtorでは、`PartData.FileItem` の `.streamProvider()` 関数は、ファイルアイテムのコンテンツに `InputStream` としてアクセスするために使用されていました。Ktor 3.0.0からは、この関数は非推奨になりました。

アプリケーションを移行するには、`.streamProvider()` を [`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 関数に置き換えます。`.provider()` 関数は `ByteReadChannel` を返します。これは、バイトのストリームを段階的に読み取るためのコルーチンフレンドリーな非ブロッキング抽象化です。その後、`ByteReadChannel` が提供する [`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html) または [`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) メソッドを使用して、チャネルからファイルの出力へ直接データをストリーミングできます。

この例では、`.copyAndClose()` メソッドが `ByteReadChannel` からファイルの `WritableByteChannel` へデータを転送します。

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

完全な例とマルチパートフォームデータの操作に関する詳細については、[マルチパートフォームデータのリクエスト処理](server-requests.md#form_data)を参照してください。

### セッション暗号化方式の更新

`Sessions` プラグインによって提供される暗号化方式は、セキュリティを強化するために更新されました。

具体的には、以前は復号化されたセッション値からMACを導出していた `SessionTransportTransformerEncrypt` メソッドが、暗号化された値からMACを計算するようになりました。

既存のセッションとの互換性を確保するため、Ktorは `backwardCompatibleRead` プロパティを導入しました。現在の設定では、`SessionTransportTransformerEncrypt` のコンストラクタにこのプロパティを含めてください。

```kotlin
install(Sessions) {
  cookie<UserSession>("user_session") {
    // ...
    transform(
      SessionTransportTransformerEncrypt(
        secretEncryptKey, // your encrypt key here
        secretSignKey, // your sign key here
        backwardCompatibleRead = true
      )
    )
  }
}
```

Ktorにおけるセッション暗号化の詳細については、[](server-sessions.md#sign_encrypt_session) を参照してください。

## Ktorクライアント

### `HttpResponse` の `content` プロパティの名前変更

Ktor 3.0.0より前は、[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) の `content` プロパティは、ネットワークから読み取られる応答コンテンツへの生の `ByteReadChannel` を提供していました。Ktor 3.0.0からは、その目的をよりよく反映するために、`content` プロパティは `rawContent` に名前が変更されました。

### `SocketTimeoutException` が型エイリアスになりました

`io.ktor.client.network.sockets` パッケージの [`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html) は、KotlinクラスからJavaクラスのエイリアスに変換されました。この変更は、特定のケースで `NoClassDefFoundError` を引き起こす可能性があり、既存のコードの更新が必要になる場合があります。

アプリケーションを移行するには、コードが古いクラスを参照しておらず、最新のKtorバージョンでコンパイルされていることを確認してください。例外チェックを更新する方法を以下に示します。

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
    <code-block lang="kotlin">
    if (exception is io.ktor.client.network.sockets.SocketTimeoutException) { ... }
    </code-block>
    <code-block lang="kotlin">
    if (exception is java.net.SocketTimeoutException) { ... }
    </code-block>
</compare>

## 共有モジュール

### `kotlinx-io` への移行

3.0.0リリースに伴い、Ktorは `kotlinx-io` ライブラリを使用するように移行しました。このライブラリは、Kotlinライブラリ全体で標準化された効率的なI/O APIを提供します。この変更により、パフォーマンスが向上し、メモリ割り当てが削減され、I/O処理が簡素化されます。プロジェクトがKtorの低レベルI/O APIとやり取りする場合、互換性を確保するためにコードを更新する必要がある場合があります。

これは、[`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html) や [`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html) などの多くのクラスに影響を与えます。さらに、以下のKtorクラスは現在 `kotlinx-io` によってサポートされており、以前の実装は非推奨になりました。

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

非推奨のAPIはKtor 4.0までサポートされますが、できるだけ早く移行することをお勧めします。アプリケーションを移行するには、`kotlinx-io` の対応するメソッドを利用するようにコードを更新してください。

#### 例: ストリーミングI/O

大きなファイルのダウンロードを処理しており、効率的なストリーミングソリューションが必要な場合、手動のバイト配列処理を `kotlinx-io` の最適化されたストリーミングAPIに置き換えることができます。

Ktor 2.xでは、大きなファイルのダウンロード処理は通常、`ByteReadChannel.readRemaining()` を使用して利用可能なバイトを手動で読み取り、`File.appendBytes()` を使用してファイルに書き込むことを伴いました。

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

Ktor 3.xでは、`ByteReadChannel.readRemaining()` は `Source` を返すようになり、`Source.transferTo()` を使用したデータのストリーミングが可能になりました。

```Kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

このアプローチは、チャネルからファイルのシンクへ直接データを転送するため、メモリ割り当てを最小限に抑え、パフォーマンスを向上させます。

完全な例については、[client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming) を参照してください。

> APIの置き換えに関する詳細については、[`kotlinx-io` のドキュメント](https://kotlinlang.org/api/kotlinx-io/)を参照してください。

### 属性キーが厳密な型一致を要求するように変更されました

Ktor 3.0.0では、[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html) インスタンスはIDによって比較されるようになり、値を格納および取得する際に厳密な型一致が要求されます。これにより、型安全性が確保され、型不一致によって引き起こされる意図しない動作が防止されます。

以前は、`AttributeKey<Boolean>` をフェッチするために `getOrNull<Any>()` を使用するなど、格納された型とは異なるジェネリック型で属性を取得することが可能でした。

アプリケーションを移行するには、取得する型が格納された型と完全に一致するようにしてください。

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 空のアーティファクトの削除

Ktor 1.0.0以降、空のアーティファクト `io.ktor:ktor` が誤って[Maven](https://repo1.maven.org/maven2/io/ktor/ktor/)に公開されていました。このアーティファクトは、Ktor 3.0.0以降削除されました。

プロジェクトにこのアーティファクトが依存関係として含まれている場合、安全に削除できます。