[//]: # (title: レスポンスの受信)

<show-structure for="chapter" depth="2"/>

<link-summary>
レスポンスの受信方法、レスポンスボディの取得方法、レスポンスパラメータの取得方法を学びます。
</link-summary>

[HTTPリクエストを作成](client-requests.md)するために使用されるすべての関数（`request`、`get`、`post`など）は、`HttpResponse` オブジェクトとしてレスポンスを受け取ることができます。

`HttpResponse` は、さまざまな方法（生バイト、JSONオブジェクトなど）で[レスポンスボディ](#body)を取得し、ステータスコード、コンテンツタイプ、ヘッダーなどの[レスポンスパラメータ](#parameters)を取得するために必要なAPIを公開しています。
例えば、パラメータなしの `GET` リクエストに対する `HttpResponse` は、次のように受け取ることができます。

[object Promise]

## レスポンスパラメータの受信 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) クラスを使用すると、ステータスコード、ヘッダー、HTTPバージョンなど、さまざまなレスポンスパラメータを取得できます。

### ステータスコード {id="status"}

レスポンスのステータスコードを取得するには、[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) プロパティを使用します。

[object Promise]

### ヘッダー {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) プロパティを使用すると、すべてのレスポンスヘッダーを含む [`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) マップを取得できます。さらに、`HttpResponse` は特定のヘッダー値を受信するための以下の関数を公開しています。

*   `contentType` は `Content-Type` ヘッダー値用
*   `charset` は `Content-Type` ヘッダー値からのcharset用
*   `etag` は `E-Tag` ヘッダー値用
*   `setCookie` は `Set-Cookie` ヘッダー値用
  > Ktor は、呼び出し間でクッキーを保持できる [HttpCookies](client-cookies.md) プラグインも提供しています。

## レスポンスボディの受信 {id="body"}

### 生のボディ {id="raw"}

レスポンスの生のボディを受信するには、`body` 関数を呼び出し、必要な型をパラメータとして渡します。以下のコードスニペットは、生のボディを [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) として受信する方法を示しています。

[object Promise]

同様に、ボディを [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) として取得することもできます。

[object Promise]

以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)は、レスポンスを `ByteArray` として取得し、ファイルに保存する方法を示しています。

[object Promise]

上記の例の [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 拡張関数は、ダウンロードの進行状況を表示するために使用されます。

ストリーミングではないリクエストの場合、レスポンスボディは自動的にメモリにロードされ、キャッシュされるため、繰り返しアクセスが可能です。これは小さなペイロードには効率的ですが、大きなレスポンスでは高いメモリ使用量につながる可能性があります。

大きなレスポンスを効率的に処理するには、レスポンスをメモリに保存せずに増分的に処理する[ストリーミングアプローチ](#streaming)を使用します。

### JSONオブジェクト {id="json"}

[ContentNegotiation](client-serialization.md) プラグインがインストールされている場合、レスポンスを受信する際にJSONデータをデータクラスに逆シリアル化できます。

[object Promise]

詳細については、[](client-serialization.md#receive_send_data) を参照してください。

> ContentNegotiation プラグインは、[クライアント](client-serialization.md)と[サーバー](server-serialization.md)の両方で利用できます。ユースケースに応じて適切なものを使用してください。

### データストリーミング {id="streaming"}

`HttpResponse.body` 関数を呼び出してボディを取得すると、Ktor はレスポンスをメモリで処理し、完全なレスポンスボディを返します。レスポンス全体を待つ代わりに、レスポンスのチャンクを順次取得する必要がある場合は、スコープ付きの[execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)ブロックを持つ `HttpStatement` を使用します。
以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)は、レスポンスコンテンツをチャンク（バイトパケット）で受信し、ファイルに保存する方法を示しています。

[object Promise]

この例では、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) はデータを非同期に読み取るために使用されます。`ByteReadChannel.readRemaining()` を使用すると、チャネル内のすべての利用可能なバイトが取得され、一方 `Source.transferTo()` はデータを直接ファイルに書き込み、不要なアロケーションを削減します。

余分な処理なしでレスポンスボディをファイルに保存するには、代わりに [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 関数を使用できます。

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}