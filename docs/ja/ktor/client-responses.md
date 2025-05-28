[//]: # (title: レスポンスの受信)

<show-structure for="chapter" depth="2"/>

<link-summary>
レスポンスの受信方法、レスポンスボディの取得方法、レスポンスパラメータの取得方法を学びます。
</link-summary>

[HTTPリクエストを作成する](client-requests.md)ために使用されるすべての関数（`request`、`get`、`post`など）は、
[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
オブジェクトとしてレスポンスを受信することを許可します。

`HttpResponse`は、[レスポンスボディ](#body)をさまざまな方法（生バイト、JSONオブジェクトなど）で取得し、
ステータスコード、コンテンツタイプ、ヘッダーなどの[レスポンスパラメータ](#parameters)を取得するために必要なAPIを公開しています。
例えば、パラメータなしの`GET`リクエストに対する`HttpResponse`は、次のようにして受信できます。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

## レスポンスパラメータの受信 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
クラスを使用すると、ステータスコード、ヘッダー、HTTPバージョンなど、さまざまなレスポンスパラメータを取得できます。

### ステータスコード {id="status"}

レスポンスのステータスコードを取得するには、
[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html)
プロパティを使用します。

```kotlin
```

{src="snippets/_misc_client/ResponseTypes.kt" include-lines="1-4,9,11,15-17"}

### ヘッダー {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
プロパティを使用すると、すべてのレスポンスヘッダーを含む[Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html)マップを取得できます。
さらに、`HttpResponse`は特定のヘッダー値を受信するための以下の関数を公開しています。

* `contentType`： `Content-Type`ヘッダー値
* `charset`： `Content-Type`ヘッダー値からのcharset
* `etag`： `E-Tag`ヘッダー値
* `setCookie`： `Set-Cookie`ヘッダー値
  > Ktorは、呼び出し間でクッキーを保持できる[HttpCookies](client-cookies.md)プラグインも提供しています。

## レスポンスボディの受信 {id="body"}

### 生ボディ {id="raw"}

レスポンスの生ボディを受信するには、`body`関数を呼び出し、必要な型をパラメータとして渡します。
以下のコードスニペットは、生ボディを[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)として受信する方法を示しています。

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,12"}

同様に、ボディを[`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)として取得できます。

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,13"}

以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)は、
レスポンスを`ByteArray`として取得し、ファイルに保存する方法を示しています。

```kotlin
```
{src="snippets/client-download-file/src/main/kotlin/com/example/Downloader.kt" include-lines="12-24"}

上記の例にある[`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html)拡張関数は、ダウンロードの進行状況を表示するために使用されます。

このアプローチは、レスポンス全体を一度にメモリにロードするため、大きなファイルでは問題となる可能性があります。
メモリ使用量を削減するには、データを[チャンクでストリーミング](#streaming)することを検討してください。

### JSONオブジェクト {id="json"}

[ContentNegotiation](client-serialization.md)プラグインをインストールすると、
レスポンスを受信する際にJSONデータをデータクラスにデシリアライズできます。

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

詳細については、[](client-serialization.md#receive_send_data)を参照してください。

> ContentNegotiationプラグインは、[クライアント](client-serialization.md)と[サーバー](server-serialization.md)の両方で利用可能です。
> 使用ケースに適切なものを使用していることを確認してください。

### データのストリーミング {id="streaming"}

`HttpResponse.body`関数を呼び出してボディを取得すると、Ktorはレスポンスをメモリで処理し、完全なレスポンスボディを返します。
レスポンス全体を待つのではなく、レスポンスを順次チャンクで取得する必要がある場合は、
スコープ付きの[execute](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html)ブロックを持つ`HttpStatement`を使用してください。
以下の[実行可能な例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)は、
レスポンスコンテンツをチャンク（バイトパケット）で受信し、ファイルに保存する方法を示しています。

```kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

この例では、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)が非同期でデータを読み取るために使用されています。
`ByteReadChannel.readRemaining()`を使用すると、チャネル内の利用可能なすべてのバイトが取得され、
`Source.transferTo()`はデータを直接ファイルに書き込み、不要なアロケーションを削減します。

追加の処理なしでレスポンスボディをファイルに保存するには、代わりに
[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html)関数を使用できます。

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}