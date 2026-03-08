[//]: # (title: レスポンスの受信)

<show-structure for="chapter" depth="3"/>

<link-summary>
レスポンスの受信、レスポンスボディの取得、およびレスポンスパラメータの取得方法について学びます。
</link-summary>

[HTTPリクエストを行う](client-requests.md)ために使用されるすべての関数（`request`、`get`、`post`など）では、レスポンスを[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)オブジェクトとして受け取ることができます。

`HttpResponse`は、[レスポンスボディ](#body)をさまざまな方法（生のバイト、JSONオブジェクトなど）で取得したり、ステータスコード、コンテントタイプ、ヘッダーなどの[レスポンスパラメータ](#parameters)を取得したりするために必要なAPIを提供します。
例えば、パラメータなしの`GET`リクエストに対して`HttpResponse`を以下のように受け取ることができます。

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## レスポンスパラメータの取得 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)クラスを使用すると、ステータスコード、ヘッダー、HTTPバージョンなどのさまざまなレスポンスパラメータを取得できます。

### ステータスコード {id="status"}

レスポンスのステータスコードを取得するには、[`HttpResponse.status`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/status.html)プロパティを使用します。

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

val httpResponse: HttpResponse = client.get("https://ktor.io/")
if (httpResponse.status.value in 200..299) {
    println("Successful response!")
}
```

### ヘッダー {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)プロパティを使用すると、すべてのレスポンスヘッダーを含む[`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html)マップを取得できます。

さらに、`HttpResponse`クラスは、特定のヘッダー値を受信するための以下の関数を提供しています。

* `contentType()`: `Content-Type`ヘッダーの値。
* `charset()`: `Content-Type`ヘッダー値の文字セット。
* `etag()`: `E-Tag`ヘッダーの値。
* `setCookie()`: `Set-Cookie`ヘッダーの値。
  > Ktorは、コール間でクッキーを保持できる[`HttpCookies`](client-cookies.md)プラグインも提供しています。

#### ヘッダー値の分割

ヘッダーにカンマまたはセミコロンで区切られた複数の値が含まれている可能性がある場合は、`.getSplitValues()`関数を使用して、ヘッダーからすべての分割された値を取得できます。

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val headers: Headers = httpResponse.headers

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```

通常の`get`演算子を使用すると、分割されずに値が返されます。

```kotlin
val values = headers["X-Multi-Header"]!!
// ["1, 2", "3"]
```

## レスポンスボディの取得 {id="body"}

### 生のボディ {id="raw"}

レスポンスの生のボディを受信するには、`body`関数を呼び出し、必要な型をパラメータとして渡します。以下のコードスニペットは、生のボディを[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)として受信する方法を示しています。

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

同様に、ボディを[`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)として取得できます。

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)は、レスポンスを`ByteArray`として取得し、ファイルに保存する方法を示しています。

```kotlin
    val client = HttpClient()
    val file = File.createTempFile("files", "index")

    runBlocking {
        val httpResponse: HttpResponse = client.get("https://ktor.io/") {
            onDownload { bytesSentTotal, contentLength ->
                println("Received $bytesSentTotal bytes from $contentLength")
            }
        }
        val responseBody: ByteArray = httpResponse.body()
        file.writeBytes(responseBody)
        println("A file saved to ${file.path}")
    }
```

上記の例の[`onDownload()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/on-download.html)拡張関数は、ダウンロードの進行状況を表示するために使用されています。

ストリーミングではないリクエストの場合、レスポンスボディは自動的にロードされ、メモリにキャッシュされるため、繰り返しアクセスが可能です。これは小さなペイロードには効率的ですが、大きなレスポンスではメモリ使用量が高くなる可能性があります。

大きなレスポンスを効率的に処理するには、レスポンスをメモリに保存せずに段階的に処理する[ストリーミングアプローチ](#streaming)を使用してください。

### JSONオブジェクト {id="json"}

[ContentNegotiation](client-serialization.md)プラグインがインストールされている場合、レスポンスを受信したときにJSONデータをデータクラスにデシリアライズできます。

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

詳細については、[データの受信と送信](client-serialization.md#receive_send_data)を参照してください。

> ContentNegotiationプラグインは、[クライアント](client-serialization.md)と[サーバー](server-serialization.md)の両方で使用できます。ケースに合わせて適切な方を使用してください。

### マルチパートフォームデータ {id="multipart"}

マルチパートフォームデータを含むレスポンスを受信する場合、そのボディを[`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html)インスタンスとして読み取ることができます。これにより、レスポンスに含まれるフォームフィールドやファイルを処理できます。

以下の例は、マルチパートレスポンスからテキストフォームフィールドとファイルアップロードの両方を処理する方法を示しています。

```kotlin
val response = client.post("https://myserver.com/multipart/receive")

val multipart = response.body<MultiPartData>()

multipart.forEachPart { part ->
    when (part) {
        is PartData.FormItem -> {
            println("Form item key: ${part.name}")
            val value = part.value
            // ...
        }
        is PartData.FileItem -> {
            println("file: ${part.name}")
            println(part.originalFileName)
            val fileContent: ByteReadChannel = part.provider()
            // ...
        }
    }
    part.dispose()
}
```

#### フォームフィールド

`PartData.FormItem`はフォームフィールドを表し、その値は`value`プロパティを通じてアクセスできます。

```kotlin
when (part) {
    is PartData.FormItem -> {
        println("Form item key: ${part.name}")
        val value = part.value
        // ...
    }
}
```

#### ファイルアップロード

`PartData.FileItem`はファイル項目を表します。ファイルアップロードをバイトストリームとして処理できます。

```kotlin
when (part) {
    is PartData.FileItem -> {
        println("file: ${part.name}")
        println(part.originalFileName)
        val fileContent: ByteReadChannel = part.provider()
        // ...
    }
}
```

#### リソースのクリーンアップ

フォームの処理が完了したら、リソースを解放するために`.dispose()`関数を使用して各パーツを破棄します。

```kotlin
part.dispose()
```

### データのストリーミング {id="streaming"}

デフォルトでは、`HttpResponse.body()`を呼び出すとレスポンス全体がメモリにロードされます。大きなレスポンスやファイルのダウンロードの場合、ボディ全体を待たずにデータをチャンク単位で処理する方が適していることがよくあります。

Ktorは、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)とI/Oユーティリティを使用してこれを実現するいくつかの方法を提供しています。

#### 逐次的なチャンク処理

レスポンスをチャンク単位で逐次処理するには、スコープ付きの[`execute`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)ブロックで`HttpStatement`を使用します。

> JVMにおいて、`HttpStatement.execute {}`および`HttpStatement.body {}`のエンジンディスパッチャー実行は、後方互換性を維持するためにオプトイン方式になっています。
> JVM上のエンジンディスパッチャーでこれらのブロックを実行するには、JVMシステムプロパティ`io.ktor.client.statement.useEngineDispatcher`を`true`に設定してください（例：`-Dio.ktor.client.statement.useEngineDispatcher=true`）。
>
{style="warning"}

以下の例は、レスポンスをチャンク単位で読み取り、ファイルに保存する方法を示しています。

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize: Long = 1024 * 1024

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

`ByteReadChannel.readRemaining()`を使用するとチャネル内の利用可能なすべてのバイトを取得し、`Source.transferTo()`はデータをファイルに直接書き込むため、不要な割り当てを減らすことができます。

> ストリーミングの完全な例については、[client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)を参照してください。

#### レスポンスをファイルに直接書き込む

チャンクごとの処理が不要な単純なダウンロードの場合は、以下のいずれかのアプローチを選択できます。

- [すべてのバイトを `ByteWriteChannel` にコピーして閉じる](#copyAndClose)
- [`RawSink` にコピーする](#readTo)

##### すべてのバイトを `ByteWriteChannel` にコピーして閉じる {id="copyAndClose"}

[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html)関数は、`ByteReadChannel`から`ByteWriteChannel`にすべての残りのバイトをコピーし、両方のチャネルを自動的に閉じます。

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```

これは、チャネルを手動で管理する必要がない完全なファイルのダウンロードに便利です。

##### RawSink にコピーする {id="readTo"}

[`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html)関数は、中間バッファなしでバイトを`RawSink`に直接書き込みます。

```kotlin
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()

client.prepareGet(url).execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.readTo(stream)
}
println("A file saved to ${file.path}")

```

`.copyAndClose()`とは異なり、シンクは書き込み後も開いたままになり、転送中にエラーが発生した場合にのみ自動的に閉じられます。

> Ktorチャネルと`RawSink`、`RawSource`、`OutputStream`などの型との間の変換については、[I/Oの相互運用性](io-interoperability.md)を参照してください。
{style="tip"}