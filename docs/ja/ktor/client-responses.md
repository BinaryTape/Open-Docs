[//]: # (title: レスポンスの受信)

<show-structure for="chapter" depth="2"/>

<link-summary>
レスポンスを受信する方法、レスポンスボディを取得する方法、およびレスポンスパラメーターを取得する方法を学びます。
</link-summary>

[HTTPリクエストの作成](client-requests.md)に使用されるすべての関数 (`request`、`get`、`post` など) を使用すると、
[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
オブジェクトとしてレスポンスを受信できます。

`HttpResponse` は、[レスポンスボディ](#body)をさまざまな方法 (生のバイト、JSON オブジェクトなど) で取得し、
ステータスコード、コンテンツタイプ、ヘッダーなどの[レスポンスパラメーター](#parameters)を取得するために必要なAPIを公開します。
たとえば、パラメーターなしの `GET` リクエストに対する `HttpResponse` は次のように受信できます。

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## レスポンスパラメーターの受信 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
クラスを使用すると、ステータスコード、ヘッダー、HTTPバージョンなど、さまざまなレスポンスパラメーターを取得できます。

### ステータスコード {id="status"}

レスポンスのステータスコードを取得するには、
[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html)
プロパティを使用します。

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

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
プロパティを使用すると、すべてのレスポンスヘッダーを含む
[Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) マップを取得できます。
さらに、`HttpResponse` は特定のヘッダー値を受信するための以下の関数を公開しています。

*   `contentType` は `Content-Type` ヘッダー値用です。
*   `charset` は `Content-Type` ヘッダー値からのcharset用です。
*   `etag` は `E-Tag` ヘッダー値用です。
*   `setCookie` は `Set-Cookie` ヘッダー値用です。
    > Ktor は、呼び出し間で Cookie を保持できる [HttpCookies](client-cookies.md) プラグインも提供しています。

## レスポンスボディの受信 {id="body"}

### 生のボディ {id="raw"}

レスポンスの生のボディを受信するには、`body` 関数を呼び出し、必要な型をパラメーターとして渡します。
以下のコードスニペットは、生のボディを[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)として受信する方法を示しています。

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

同様に、[`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)としてボディを取得できます。

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)は、
レスポンスを`ByteArray`として取得し、ファイルに保存する方法を示しています。

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

上記の例の[`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html)
拡張関数は、ダウンロードの進行状況を表示するために使用されます。

ストリーミングではないリクエストの場合、レスポンスボディは自動的にメモリにロードされキャッシュされるため、繰り返しアクセスできます。
これは小さなペイロードに対しては効率的ですが、大きなレスポンスの場合にはメモリ使用量が高くなる可能性があります。

大規模なレスポンスを効率的に処理するには、レスポンスをメモリに保存せずに増分的に処理する[ストリーミングアプローチ](#streaming)を使用します。

### JSON オブジェクト {id="json"}

[ContentNegotiation](client-serialization.md) プラグインがインストールされている場合、レスポンスを受信する際にJSONデータをデータクラスにデシリアライズできます。

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

詳細については、[データの送受信](client-serialization.md#receive_send_data)を参照してください。

> ContentNegotiation プラグインは、[クライアント](client-serialization.md)と[サーバー](server-serialization.md)の両方で利用できます。ご自身のケースに適切なものを使用してください。

### ストリーミングデータ {id="streaming"}

`HttpResponse.body` 関数を呼び出してボディを取得すると、Ktor はレスポンスをメモリで処理し、完全なレスポンスボディを返します。
レスポンス全体を待つのではなく、レスポンスのチャンクを順番に取得する必要がある場合は、スコープ付きの
[execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)
ブロックで `HttpStatement` を使用します。
以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)は、
レスポンスコンテンツをチャンク (バイトパケット) で受信し、ファイルに保存する方法を示しています。

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining()
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

この例では、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)
を使用してデータを非同期に読み取ります。`ByteReadChannel.readRemaining()` を使用すると、チャネル内の利用可能なすべてのバイトが取得され、
`Source.transferTo()` はデータをファイルに直接書き込むため、不要な割り当てが削減されます。

追加の処理なしでレスポンスボディをファイルに保存するには、代わりに
[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html)関数を使用できます。

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}