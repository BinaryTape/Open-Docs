[//]: # (title: リクエストの作成)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

</tldr>

<link-summary>
リクエストの作成方法と、リクエストURL、HTTPメソッド、ヘッダー、リクエストボディなどのさまざまなリクエストパラメータの指定方法を学びます。
</link-summary>

[クライアントを設定](client-create-and-configure.md)した後、HTTPリクエストの作成を開始できます。これを行う主要な方法は、URLをパラメータとして受け取る
[`.request()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html)
関数を使用することです。この関数内で、さまざまなリクエストパラメータを設定できます。

*   `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS`、`PATCH`などのHTTPメソッドを指定します。
*   URLを文字列として設定するか、そのコンポーネント（ドメイン、パス、クエリパラメータなど）を個別に設定します。
*   Unixドメインソケットを使用します。
*   ヘッダーとCookieを追加します。
*   リクエストボディ（プレーンテキスト、データオブジェクト、フォームパラメータなど）を含めます。

これらのパラメータは、[`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)クラスによって公開されています。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 関数は、`HttpResponse` オブジェクトとしてレスポンスを返します。`HttpResponse` は、文字列、JSONオブジェクトなどのさまざまな形式でレスポンスボディを取得したり、ステータスコード、コンテンツタイプ、ヘッダーなどのレスポンスパラメータを取得したりするために必要なAPIを公開しています。詳細については、[](client-responses.md) を参照してください。

> `.request()` は停止関数 (suspending function) であり、コルーチンまたは別の停止関数内から呼び出す必要があります。停止関数について詳しくは、[コルーチンの基礎](https://kotlinlang.org/docs/coroutines-basics.html) を参照してください。

### HTTPメソッドの指定 {id="http-method"}

`.request()` 関数を呼び出すとき、`method` プロパティを使用して目的のHTTPメソッドを指定できます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

`.request()` に加えて、`HttpClient` は [`.get()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)、[`.post()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html)、[`.put()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html) などの基本的なHTTPメソッド用の特定の関数を提供します。上記の例は、`.get()` 関数を使用して簡略化できます。

[object Promise]

どちらの例でも、リクエストURLは文字列として指定されています。[`HttpRequestBuilder`](#url) を使用して、URLコンポーネントを個別に設定することもできます。

## リクエストURLの指定 {id="url"}

Ktorクライアントでは、リクエストURLを複数の方法で設定できます。

### URL全体を文字列として渡す

[object Promise]

### URLコンポーネントを個別に設定する

[object Promise]

この場合、`HttpRequestBuilder` が提供する `url` パラメータが使用されます。これは [`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) のインスタンスを受け入れ、複雑なURLを構築するためのより柔軟な機能を提供します。

> すべてのリクエストのベースURLを設定するには、[`DefaultRequest`](client-default-request.md#url) プラグインを使用します。

### パスセグメント {id="path_segments"}

前の例では、URLパス全体が `URLBuilder.path` プロパティを使用して指定されました。
代わりに、`appendPathSegments()` 関数を使用して個々のパスセグメントを渡すことができます。

[object Promise]

デフォルトでは、`appendPathSegments` はパスセグメントを[エンコード][percent_encoding]します。
エンコーディングを無効にするには、代わりに `appendEncodedPathSegments()` を使用します。

### クエリパラメータ {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>パラメータを追加するには、`URLBuilder.parameters` プロパティを使用します。

[object Promise]

デフォルトでは、`parameters` はクエリパラメータを[エンコード][percent_encoding]します。
エンコーディングを無効にするには、代わりに `encodedParameters()` を使用します。

> クエリパラメータがない場合でも `?` 文字を保持するには、`trailingQuery` プロパティを使用できます。

### URLフラグメント {id="url-fragment"}

ハッシュマーク `#` は、URLの末尾近くにオプションのフラグメントを導入します。
`fragment` プロパティを使用してURLフラグメントを設定できます。

[object Promise]

デフォルトでは、`fragment` はURLフラグメントを[エンコード][percent_encoding]します。
エンコーディングを無効にするには、代わりに `encodedFragment()` を使用します。

## リクエストパラメータの設定 {id="parameters"}

HTTPメソッド、ヘッダー、Cookieを含む様々なリクエストパラメータを指定できます。特定のクライアントのすべてのリクエストに対してデフォルトパラメータを設定する必要がある場合は、[`DefaultRequest`](client-default-request.md) プラグインを使用します。

### ヘッダー {id="headers"}

ヘッダーをリクエストに追加するには、いくつかの方法があります。

#### 複数のヘッダーを追加する

[`headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html) 関数を使用すると、複数のヘッダーを一度に追加できます。

[object Promise]

#### 単一のヘッダーを追加する

[`header`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html) 関数を使用すると、単一のヘッダーを追加できます。

#### 認証に `basicAuth` または `bearerAuth` を使用する

`basicAuth` および `bearerAuth` 関数は、対応するHTTPスキームで `Authorization` ヘッダーを追加します。

> 高度な認証設定については、[](client-auth.md) を参照してください。

### Cookie {id="cookies"}

Cookieを送信するには、[`cookie()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html) 関数を使用します。

[object Promise]

Ktorは、呼び出し間でCookieを保持できる [`HttpCookies`](client-cookies.md) プラグインも提供しています。このプラグインがインストールされている場合、`cookie()` 関数を使用して追加されたCookieは無視されます。

## リクエストボディの設定 {id="body"}

リクエストボディを設定するには、[`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) が提供する `setBody()` 関数を呼び出します。この関数は、プレーンテキスト、任意のクラスインスタンス、フォームデータ、バイト配列など、さまざまな種類のペイロードを受け入れます。

### テキスト {id="text"}

プレーンテキストをボディとして送信するには、次のように実装できます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### オブジェクト {id="objects"}

[`ContentNegotiation`](client-serialization.md) プラグインを有効にすると、JSONとしてリクエストボディ内にクラスインスタンスを送信できます。これを行うには、クラスインスタンスを `setBody()` 関数に渡し、[`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 関数を使用してコンテンツタイプを `application/json` に設定します。

[object Promise]

詳細については、[](client-serialization.md) を参照してください。

### フォームパラメータ {id="form_parameters"}

Ktorクライアントは、`application/x-www-form-urlencoded` タイプのフォームパラメータを送信するための [`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 関数を提供しています。次の例はその使用法を示しています。

[object Promise]

*   `url` は、リクエストを行うためのURLを指定します。
*   `formParameters` は、`parameters` を使用して構築されたフォームパラメータのセットです。

完全な例については、[client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form) を参照してください。

> URLにエンコードされたフォームパラメータを送信するには、`encodeInQuery` を `true` に設定します。

### ファイルのアップロード {id="upload_file"}

フォームでファイルを送信する必要がある場合は、次のアプローチを使用できます。

*   [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 関数を使用します。この場合、境界は自動的に生成されます。
*   `post` 関数を呼び出し、`MultiPartFormDataContent` インスタンスを `setBody` 関数に渡します。`MultiPartFormDataContent` コンストラクタでは、境界値を渡すこともできます。

どちらのアプローチでも、[`formData {}`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html) 関数を使用してフォームデータを構築する必要があります。

#### `.submitFormWithBinaryData()` の使用

`.submitFormWithBinaryData()` 関数は、境界を自動的に生成し、ファイルの内容が `.readBytes()` を使用してメモリに安全に読み込めるほど小さい単純なユースケースに適しています。

[object Promise]

完全な例については、[client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload) を参照してください。

#### `MultiPartFormDataContent` の使用

大規模または動的なコンテンツを効率的にストリーミングするには、`InputProvider` とともに `MultiPartFormDataContent` を使用できます。`InputProvider` を使用すると、ファイルデータをメモリに完全にロードするのではなく、バッファリングされたストリームとして提供できるため、大きなファイルに適しています。`MultiPartFormDataContent` を使用すると、`onUpload` コールバックを使用してアップロードの進行状況を監視することもできます。

[object Promise]

マルチプラットフォームプロジェクトでは、`InputProvider` と一緒に `SystemFileSystem.source()` を使用できます。

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

カスタムの境界とコンテンツタイプを使用して `MultiPartFormDataContent` を手動で構築することもできます。

[object Promise]

完全な例については、[client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress) を参照してください。

### バイナリデータ {id="binary"}

`application/octet-stream` コンテンツタイプでバイナリデータを送信するには、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) インスタンスを `setBody()` 関数に渡します。
たとえば、[`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 関数を使用してファイルの読み取りチャネルを開くことができます。

[object Promise]

完全な例については、[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data) を参照してください。

## 並列リクエスト {id="parallel_requests"}

デフォルトでは、複数のリクエストを順次送信する場合、クライアントは前のリクエストが完了するまですべての呼び出しを停止します。複数のリクエストを同時に実行するには、[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) または [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 関数を使用します。次の例は、`async()` を使用して2つのリクエストを並行して実行する方法を示しています。

[object Promise]

完全な例については、[client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests) を参照してください。

## リクエストのキャンセル {id="cancel-request"}

リクエストをキャンセルするには、そのリクエストを実行しているコルーチンをキャンセルします。
[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 関数は、実行中のコルーチンをキャンセルするために使用できる `Job` を返します。

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

詳細については、[キャンセルとタイムアウト](https://kotlinlang.org/docs/cancellation-and-timeouts.html) を参照してください。