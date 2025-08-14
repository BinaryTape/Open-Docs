[//]: # (title: 2.2.x から 3.0.x への移行)

<show-structure for="chapter" depth="3"/>

このガイドでは、Ktor アプリケーションをバージョン 2.2.x から 3.0.x へ移行する方法について説明します。

## Ktor サーバー {id="server"}

### `ApplicationEngine`、`ApplicationEnvironment`、および `Application`

設定の柔軟性を向上させ、`ApplicationEngine`、`ApplicationEnvironment`、`Application` の各インスタンス間の分離をより明確にするために、いくつかの設計変更が導入されました。

v3.0.0 より前は、`ApplicationEngine` が `ApplicationEnvironment` を管理し、さらに `ApplicationEnvironment` が `Application` を管理していました。

しかし、現在の設計では、`Application` が `ApplicationEngine` と `ApplicationEnvironment` の両方を作成、所有、初期化する責任を負います。

この再構築に伴い、以下の破壊的変更が導入されています。

- [`ApplicationEngineEnvironmentBuilder` と `applicationEngineEnvironment` クラスが名称変更されました](#renamed-classes)。
- [`start()` メソッドと `stop()` メソッドが `ApplicationEngineEnvironment` から削除されました](#ApplicationEnvironment)。
- [`commandLineEnvironment()` が削除されました](#CommandLineConfig)。
- [`ServerConfigBuilder` の導入](#ServerConfigBuilder)。
- [`embeddedServer()` が `ApplicationEngine` の代わりに `EmbeddedServer` を返すようになりました](#EmbeddedServer)。

これらの変更は、以前のモデルに依存している既存のコードに影響を与えます。

#### 名称変更されたクラス {id="renamed-classes"}

| パッケージ                 | 2.x.x                                 | 3.0.x                           |
|----------------------------|---------------------------------------|---------------------------------|
| `io.ktor:ktor-server-core` | `ApplicationEngineEnvironmentBuilder` | `ApplicationEnvironmentBuilder` |
| `io.ktor:ktor-server-core` | `applicationEngineEnvironment`        | `applicationEnvironment`        |

#### `start()` メソッドと `stop()` メソッドが `ApplicationEngineEnvironment` から削除されました {id="ApplicationEnvironment"}

`ApplicationEngineEnvironment` が [`ApplicationEnvironment`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-environment/index.html) に統合されたことで、`start()` メソッドと `stop()` メソッドは、[`ApplicationEngine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/index.html) からのみアクセスできるようになりました。

| 2.x.x                                                 | 3.0.x                                |
|-------------------------------------------------------|--------------------------------------|
| `ApplicationEngineEnvironment.start()`                | `ApplicationEngine.start()`          |
| `ApplicationEngineEnvironment.stop()`                 | `ApplicationEngine.stop()`           |

さらに、以下の表では、削除されたプロパティとその現在の所有者の一覧を示します。

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

#### `commandLineEnvironment()` が削除されました {id="CommandLineConfig"}

コマンドライン引数から `ApplicationEngineEnvironment` インスタンスを作成するために使用されていた `commandLineEnvironment()` 関数は、Ktor `3.0.0` で削除されました。代わりに、コマンドライン引数を設定オブジェクトにパースするために、[`CommandLineConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html) 関数を使用できます。

アプリケーションを `commandLineEnvironment` から `CommandLineConfig` に移行するには、`commandLineEnvironment()` を以下の `configure` ブロックに置き換えます。

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

</compare>

`embeddedServer` を使用したコマンドライン設定の詳細については、[コードでの設定](server-configuration-code.topic#command-line) のトピックを参照してください。

#### `ServerConfigBuilder` の導入 {id="ServerConfigBuilder"}

サーバープロパティを設定するための新しいエンティティ、[`ServerConfigBuilder`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config-builder/index.html) が導入され、以前の `ApplicationPropertiesBuilder` の設定メカニズムを置き換えます。
`ServerConfigBuilder` は、以前 `ApplicationProperties` によって管理されていたモジュール、パス、環境の詳細を保持するようになった [`ServerConfig`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-config/index.html) クラスのインスタンスを構築するために使用されます。

以下の表に、主な変更点をまとめます。

| パッケージ                 | 2.x.x                          | 3.0.x                 |
|----------------------------|--------------------------------|-----------------------|
| `io.ktor:ktor-server-core` | `ApplicationProperties`        | `ServerConfig`        |
| `io.ktor:ktor-server-core` | `ApplicationPropertiesBuilder` | `ServerConfigBuilder` |

さらに、`embeddedServer()` 関数では、この新しい設定アプローチを反映するために、`applicationProperties` 属性が `rootConfig` に名称変更されました。

`embeddedServer()` を使用する際は、`applicationProperties` 属性を `rootConfig` に置き換えてください。
以下に、`developmentMode` を明示的に `true` に設定してサーバーを構成するために `serverConfig` ブロックを使用する例を示します。

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

[`EmbeddedServer`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-embedded-server/index.html) クラスが導入され、`embeddedServer()` 関数の戻り値の型として `ApplicationEngine` の代わりに使用されるようになりました。

モデル変更の詳細については、YouTrack の [issue KTOR-3857](https://youtrack.jetbrains.com/issue/KTOR-3857/Environment-Engine-Application-Design) を参照してください。

### テスト

##### `withTestApplication` および `withApplication` が削除されました

以前 [`2.0.0` リリースで非推奨とされていた](migration-to-20x.md#testing-api) `withTestApplication` および `withApplication` 関数は、`ktor-server-test-host` パッケージから削除されました。

代わりに、`testApplication` 関数と既存の [Ktor クライアント](client-create-and-configure.md) インスタンスを使用して、サーバーへのリクエストを行い、結果を検証してください。

以下のテストでは、`handleRequest` 関数が `client.get` リクエストに置き換えられています。

<compare first-title="1.x.x" second-title="3.0.x">

</compare>

詳細については、[](server-testing.md) を参照してください。

#### `TestApplication` モジュールローディング {id="test-module-loading"}

`TestApplication` は、設定ファイル (例: `application.conf`) からモジュールを自動的にロードしなくなりました。代わりに、`testApplication` 関数内で [モジュールを明示的にロードする](#explicit-module-loading) か、[設定ファイルを手動でロードする](#configure-env) 必要があります。

##### 明示的なモジュールローディング {id="explicit-module-loading"}

モジュールを明示的にロードするには、`testApplication` 内で `application` 関数を使用します。このアプローチにより、ロードするモジュールを手動で指定でき、テスト設定をより細かく制御できます。

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

##### 設定ファイルからのモジュールロード {id="configure-env"}

設定ファイルからモジュールをロードしたい場合は、`environment` 関数を使用してテスト用の設定ファイルを指定します。

For more information on configuring the test application, see the [](server-testing.md) section.

### `CallLogging` プラグインのパッケージが名称変更されました

[`CallLogging`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/index.html) プラグインのパッケージは、タイプミスにより名称変更されました。

| 2.x.x                               | 3.0.x                                |
|-------------------------------------|--------------------------------------|
| `io.ktor.server.plugins.callloging` | `io.ktor.server.plugins.calllogging` |

### `ktor-server-host-common` モジュールが削除されました

`Application` が `ApplicationEngine` の知識を必要とするため、`ktor-server-host-common` モジュールの内容は `ktor-server-core`、具体的には [`io.ktor.server.engine`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/index.html) パッケージに統合されました。

それに応じて依存関係が更新されていることを確認してください。ほとんどの場合、`ktor-server-host-common` の依存関係を削除するだけで済みます。

### `Locations` プラグインが削除されました

Ktor サーバーの `Locations` プラグインは削除されました。タイプセーフなルーティングを作成するには、代わりに [Resources プラグイン](server-resources.md) を使用してください。これには、以下の変更が必要です。

*   `io.ktor:ktor-server-locations` アーティファクトを `io.ktor:ktor-server-resources` に置き換えます。

*   `Resources` プラグインは Kotlin シリアライゼーションプラグインに依存しています。シリアライゼーションプラグインを追加するには、[kotlinx.serialization セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup) を参照してください。

*   プラグインのインポートを `io.ktor.server.locations.*` から `io.ktor.server.resources.*` に更新します。

*   さらに、`io.ktor.resources` から `Resource` モジュールをインポートします。

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

`Resources` の使用に関する詳細については、[](server-resources.md) を参照してください。

### WebSockets 設定における `java.time` の置き換え

[WebSockets](server-websockets.md) プラグインの設定が更新され、`pingPeriod` および `timeout` プロパティに Kotlin の [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) が使用されるようになりました。これにより、以前の `java.time.Duration` の使用が置き換えられ、より Kotlin らしい体験を提供します。

既存のコードを新しい形式に移行するには、`kotlin.time.Duration` クラスの拡張関数とプロパティを使用して期間を構築します。以下の例では、`Duration.ofSeconds()` が Kotlin の `seconds` 拡張に置き換えられています。

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

他の期間設定についても、必要に応じて同様の Kotlin の期間拡張 (`minutes`, `hours` など) を使用できます。詳細については、[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) のドキュメントを参照してください。

### サーバーソケットの `.bind()` がサスペンディング関数になりました

JS および WasmJS 環境での非同期操作をサポートするため、[`TCPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-tcp-socket-builder/index.html) と [`UDPSocketBuilder`](https://api.ktor.io/ktor-network/io.ktor.network.sockets/-u-d-p-socket-builder/index.html) の両方におけるサーバーソケットの `.bind()` 関数がサスペンディング関数に更新されました。これは、`.bind()` へのすべての呼び出しがコルーチン内で行われる必要があることを意味します。

移行するには、`.bind()` がコルーチンまたはサスペンディング関数内からのみ呼び出されていることを確認してください。以下は `runBlocking` を使用する例です。

```kotlin
  runBlocking {
    val selectorManager = SelectorManager(Dispatchers.IO)
    val serverSocket = aSocket(selectorManager).tcp().bind("127.0.0.1", 9002)
    //...
}
```

ソケットの操作に関する詳細については、[ソケットのドキュメント](server-sockets.md) を参照してください。

## マルチパートフォームデータ

### バイナリおよびファイルアイテムの新しいデフォルト制限

Ktor 3.0.0 では、[`ApplicationCall.receiveMultipart()`](https://api.ktor.io/older/3.0.0/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html) を使用してバイナリおよびファイルアイテムを受信する際に、デフォルトで 50MB の制限が導入されました。受信したファイルまたはバイナリアイテムが 50MB の制限を超えると、`IOException` がスローされます。

#### デフォルト制限のオーバーライド

以前のアプリケーションが明示的な設定なしに 50MB を超えるファイルを処理することに依存していた場合、予期せぬ動作を避けるためにコードを更新する必要があります。

デフォルト制限をオーバーライドするには、`.receiveMultipart()` を呼び出す際に `formFieldLimit` パラメータを渡します。

### `PartData.FileItem.streamProvider()` が非推奨になりました

Ktor の以前のバージョンでは、`PartData.FileItem` 内の `.streamProvider()` 関数は、ファイルアイテムの内容に `InputStream` としてアクセスするために使用されていました。Ktor 3.0.0 から、この関数は非推奨になりました。

アプリケーションを移行するには、`.streamProvider()` を [`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 関数に置き換えてください。`.provider()` 関数は `ByteReadChannel` を返します。これは、バイトのストリームを増分的に読み取るための、コルーチンフレンドリーな非ブロッキング抽象化です。
その後、`ByteReadChannel` が提供する [`.copyTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-to.html) または [`.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) メソッドを使用して、チャネルからファイル出力にデータを直接ストリームできます。

以下の例では、`.copyAndClose()` メソッドが `ByteReadChannel` からファイルの `WritableByteChannel` にデータを転送します。

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

完全な例とマルチパートフォームデータの操作に関する詳細については、[マルチパートフォームデータの要求処理](server-requests.md#form_data) を参照してください。

### セッション暗号化メソッドの更新

`Sessions` プラグインが提供する暗号化メソッドが、セキュリティを強化するために更新されました。

具体的には、以前は復号化されたセッション値から MAC を導出していた `SessionTransportTransformerEncrypt` メソッドが、暗号化された値から MAC を計算するようになりました。

既存のセッションとの互換性を確保するため、Ktor は `backwardCompatibleRead` プロパティを導入しました。現在の設定では、`SessionTransportTransformerEncrypt` のコンストラクタにこのプロパティを含めます。

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

Ktor でのセッション暗号化の詳細については、[](server-sessions.md#sign_encrypt_session) を参照してください。

## Ktor クライアント

### `HttpResponse` の `content` プロパティの名称変更

Ktor 3.0.0 より前は、[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) の `content` プロパティは、ネットワークから読み取られた応答コンテンツへの生の `ByteReadChannel` を提供していました。Ktor 3.0.0 からは、その目的をより適切に反映するために、`content` プロパティが `rawContent` に名称変更されました。

### `SocketTimeoutException` が typealias になりました

`io.ktor.client.network.sockets` パッケージの [`SocketTimeoutException`](https://api.ktor.io/older/3.0.0/ktor-client/ktor-client-core/io.ktor.client.network.sockets/-socket-timeout-exception/index.html) が、Kotlin クラスから Java クラスのエイリアスに変換されました。この変更は、特定のケースで `NoClassDefFoundError` を引き起こす可能性があり、既存のコードの更新が必要になる場合があります。

アプリケーションを移行するには、コードが古いクラスを参照しておらず、最新の Ktor バージョンでコンパイルされていることを確認してください。以下に、例外チェックを更新する方法を示します。

<compare type="top-bottom" first-title="2.x.x" second-title="3.0.x">
</compare>

## 共有モジュール

### `kotlinx-io` への移行

3.0.0 リリースで、Ktor は `kotlinx-io` ライブラリの使用に移行しました。これは、Kotlin ライブラリ全体で標準化された効率的な I/O API を提供します。この変更により、パフォーマンスが向上し、メモリ割り当てが削減され、I/O 処理が簡素化されます。プロジェクトが Ktor の低レベル I/O API と連携している場合は、互換性を確保するためにコードを更新する必要があるかもしれません。

これは、[`ByteReadChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-read-channel.html) や [`ByteWriteChannel`](https://api.ktor.io/older/3.0.0/ktor-io/io.ktor.utils.io/-byte-write-channel/index.html) など、多くのクラスに影響を与えます。さらに、以下の Ktor クラスは `kotlinx-io` によってバックアップされるようになり、以前の実装は非推奨になりました。

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

非推奨の API は Ktor 4.0 までサポートされますが、できるだけ早く移行することをお勧めします。アプリケーションを移行するには、`kotlinx-io` の対応するメソッドを利用するようにコードを更新してください。

#### 例: ストリーミング I/O

大きなファイルをダウンロードしており、効率的なストリーミングソリューションが必要な場合は、手動でのバイト配列処理を `kotlinx-io` の最適化されたストリーミング API に置き換えることができます。

Ktor 2.x では、大きなファイルのダウンロード処理は通常、`ByteReadChannel.readRemaining()` を使用して利用可能なバイトを手動で読み取り、`File.appendBytes()` を使用してファイルに書き込むことを含んでいました。

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

このアプローチには、複数のメモリ割り当てと冗長なデータコピーが含まれていました。

Ktor 3.x では、`ByteReadChannel.readRemaining()` は `Source` を返すようになり、`Source.transferTo()` を使用してデータをストリーミングできるようになりました。

このアプローチは、チャネルからファイルのシンクにデータを直接転送するため、メモリ割り当てを最小限に抑え、パフォーマンスを向上させます。

完全な例については、[client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming) を参照してください。

> API の置き換えに関する詳細については、[`kotlinx-io` ドキュメント](https://kotlinlang.org/api/kotlinx-io/) を参照してください。

### 属性キーが厳密な型の一致を要求するようになりました

Ktor 3.0.0 では、[`AttributeKey`](https://api.ktor.io/older/3.0.0/ktor-utils/io.ktor.util/-attribute-key.html) インスタンスが同一性によって比較されるようになり、値を格納および取得する際に厳密な型の一致が必要になります。これにより、型安全性が確保され、型ミスマッチによる意図しない動作が防止されます。

以前は、`getOrNull<Any>()` を使用して `AttributeKey<Boolean>` をフェッチするなど、格納されたものとは異なるジェネリック型で属性を取得することが可能でした。

アプリケーションを移行するには、取得する型が格納された型と正確に一致するようにしてください。

```kotlin
val attrs = Attributes()

attrs.put(AttributeKey<Boolean>("key"), true)
attrs.getOrNull<Boolean>("key")
```

### 空のアーティファクトの削除

Ktor 1.0.0 以降、空のアーティファクト `io.ktor:ktor` が誤って [Maven](https://repo1.maven.org/maven2/io/ktor/ktor/) に公開されていました。このアーティファクトは Ktor 3.0.0 から削除されました。

もしあなたのプロジェクトがこのアーティファクトを依存関係として含んでいる場合、安全に削除できます。