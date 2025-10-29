[//]: # (title: リクエストの送信)

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
リクエストの送信方法と、リクエストURL、HTTPメソッド、ヘッダー、リクエストボディなど、さまざまなリクエストパラメーターの指定方法を学びます。
</link-summary>

[クライアントの設定](client-create-and-configure.md)後、HTTPリクエストの送信を開始できます。これを行う主な方法は、URLをパラメーターとして受け取る[`.request()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/request.html)関数を使用することです。この関数内で、さまざまなリクエストパラメーターを設定できます。

*   `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS`、`PATCH`などのHTTPメソッドを指定します。
*   URLを文字列として設定するか、そのコンポーネント（ドメイン、パス、クエリパラメーターなど）を個別に設定します。
*   Unixドメインソケットを使用します。
*   ヘッダーとCookieを追加します。
*   リクエストボディ（例：プレーンテキスト、データオブジェクト、フォームパラメーター）を含めます。

これらのパラメーターは[`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)クラスによって公開されます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()`関数は、`HttpResponse`オブジェクトとしてレスポンスを返します。`HttpResponse`は、文字列、JSONオブジェクトなどのさまざまな形式でレスポンスボディを取得するために必要なAPI、およびステータスコード、コンテンツタイプ、ヘッダーなどのレスポンスパラメーターを取得するためのAPIを公開しています。詳細については、[レスポンスの受信](client-responses.md)を参照してください。

> `.request()`は停止関数（suspending function）であり、コルーチンまたは別の停止関数内から呼び出す必要があります。停止関数の詳細については、[コルーチンの基本](https://kotlinlang.org/docs/coroutines-basics.html)を参照してください。

### HTTPメソッドの指定 {id="http-method"}

`.request()`関数を呼び出す際に、`method`プロパティを使用して目的のHTTPメソッドを指定できます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

`.request()`に加えて、`HttpClient`は、[`.get()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/get.html)、[`.post()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/post.html)、[`.put()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/put.html)などの基本的なHTTPメソッドに特化した関数を提供します。上記の例は、`.get()`関数を使用すると簡略化できます。

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

どちらの例でも、リクエストURLは文字列として指定されています。[`HttpRequestBuilder`](#url)を使用してURLコンポーネントを個別に設定することもできます。

## リクエストURLの指定 {id="url"}

Ktorクライアントでは、さまざまな方法でリクエストURLを設定できます。

### URL文字列全体を渡す

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

### URLコンポーネントを個別に設定する

```kotlin
client.get {
    url {
        protocol = URLProtocol.HTTPS
        host = "ktor.io"
        path("docs/welcome.html")
    }
}
```

この場合、`HttpRequestBuilder`によって提供される`url`パラメーターが使用されます。これは[`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html)のインスタンスを受け入れ、複雑なURLを構築するためのより多くの柔軟性を提供します。

> すべてのリクエストのベースURLを設定するには、[`DefaultRequest`](client-default-request.md#url)プラグインを使用します。

### パスセグメント {id="path_segments"}

前の例では、`URLBuilder.path`プロパティを使用してURLパス全体が指定されました。または、`appendPathSegments()`関数を使用して個々のパスセグメントを渡すこともできます。

```kotlin
client.get("https://ktor.io") {
    url {
        appendPathSegments("docs", "welcome.html")
    }
}
```

デフォルトでは、`appendPathSegments`はパスセグメントを[エンコード][percent_encoding]します。エンコーディングを無効にするには、代わりに`appendEncodedPathSegments()`を使用します。

### クエリパラメーター {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>パラメーターを追加するには、`URLBuilder.parameters`プロパティを使用します。

```kotlin
client.get("https://ktor.io") {
    url {
        parameters.append("token", "abc123")
    }
}
```

デフォルトでは、`parameters`はクエリパラメーターを[エンコード][percent_encoding]します。エンコーディングを無効にするには、代わりに`encodedParameters()`を使用します。

> `trailingQuery`プロパティは、クエリパラメーターがない場合でも`?`文字を保持するために使用できます。

### URLフラグメント {id="url-fragment"}

ハッシュマーク`#`は、URLの末尾近くにオプションのフラグメントを導入します。`fragment`プロパティを使用してURLフラグメントを設定できます。

```kotlin
client.get("https://ktor.io") {
    url {
        fragment = "some_anchor"
    }
}
```

デフォルトでは、`fragment`はURLフラグメントを[エンコード][percent_encoding]します。エンコーディングを無効にするには、代わりに`encodedFragment()`を使用します。

## Unixドメインソケットの指定

> Unixドメインソケットは、CIOエンジンでのみサポートされています。
> KtorサーバーでUnixソケットを使用するには、それに応じて[サーバーを設定](server-configuration-code.topic#cio-code)します。
>
{style="note"}

Unixドメインソケットをリッスンしているサーバーにリクエストを送信するには、CIOクライアントを使用する際に`unixSocket()`関数を呼び出します。

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

[デフォルトのリクエスト](client-default-request.md#unix-domain-sockets)の一部としてUnixドメインソケットを設定することもできます。

## リクエストパラメーターの設定 {id="parameters"}

HTTPメソッド、ヘッダー、Cookieなど、さまざまなリクエストパラメーターを指定できます。特定のクライアントのすべてのリクエストに対してデフォルトのパラメーターを設定する必要がある場合は、[`DefaultRequest`](client-default-request.md)プラグインを使用します。

### ヘッダー {id="headers"}

リクエストにヘッダーを追加する方法はいくつかあります。

#### 複数のヘッダーを追加する

[`headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/headers.html)関数を使用すると、一度に複数のヘッダーを追加できます。

```kotlin
client.get("https://ktor.io") {
    headers {
        append(HttpHeaders.Accept, "text/html")
        append(HttpHeaders.Authorization, "abc123")
        append(HttpHeaders.UserAgent, "ktor client")
    }
}
```

#### 単一のヘッダーを追加する

[`header`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/header.html)関数を使用すると、単一のヘッダーを追加できます。

#### 認証に`basicAuth`または`bearerAuth`を使用する

`basicAuth`および`bearerAuth`関数は、対応するHTTPスキームを持つ`Authorization`ヘッダーを追加します。

> 高度な認証設定については、[Ktorクライアントでの認証と認可](client-auth.md)を参照してください。

### Cookie {id="cookies"}

Cookieを送信するには、[`cookie()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/cookie.html)関数を使用します。

```kotlin
client.get("https://ktor.io") {
    cookie(name = "user_name", value = "jetbrains", expires = GMTDate(
        seconds = 0,
        minutes = 0,
        hours = 10,
        dayOfMonth = 1,
        month = Month.APRIL,
        year = 2023
    ))
}
```

Ktorには、呼び出し間でCookieを保持できる[`HttpCookies`](client-cookies.md)プラグインも用意されています。このプラグインがインストールされている場合、`cookie()`関数を使用して追加されたCookieは無視されます。

## リクエストボディの設定 {id="body"}

リクエストボディを設定するには、[`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)によって提供される`setBody()`関数を呼び出します。この関数は、プレーンテキスト、任意のクラスインスタンス、フォームデータ、バイト配列など、さまざまな種類のペイロードを受け入れます。

### テキスト {id="text"}

プレーンテキストをボディとして送信する方法は以下の通りです。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### オブジェクト {id="objects"}

[`ContentNegotiation`](client-serialization.md)プラグインを有効にすると、リクエストボディ内でクラスインスタンスをJSONとして送信できます。これを行うには、クラスインスタンスを`setBody()`関数に渡し、[`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html)関数を使用してコンテンツタイプを`application/json`に設定します。

```kotlin
val response: HttpResponse = client.post("http://localhost:8080/customer") {
    contentType(ContentType.Application.Json)
    setBody(Customer(3, "Jet", "Brains"))
}
```

詳細については、[Ktorクライアントにおけるコンテンツネゴシエーションとシリアライゼーション](client-serialization.md)を参照してください。

### フォームパラメーター {id="form_parameters"}

Ktorクライアントは、`application/x-www-form-urlencoded`タイプのフォームパラメーターを送信するための[`submitForm()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form.html)関数を提供します。以下の例はその使用方法を示しています。

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.submitForm(
    url = "http://localhost:8080/signup",
    formParameters = parameters {
        append("username", "JetBrains")
        append("email", "example@jetbrains.com")
        append("password", "foobar")
        append("confirmation", "foobar")
    }
)
```

*   `url`はリクエストを行うためのURLを指定します。
*   `formParameters`は`parameters`を使用して構築されたフォームパラメーターのセットです。

完全な例については、[client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)を参照してください。

> URLでエンコードされたフォームパラメーターを送信するには、`encodeInQuery`を`true`に設定します。

### ファイルのアップロード {id="upload_file"}

フォームでファイルを送信する必要がある場合、次のアプローチを使用できます。

*   [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html)関数を使用します。この場合、境界が自動的に生成されます。
*   `post`関数を呼び出し、[`MultiPartFormDataContent`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html)インスタンスを`setBody`関数に渡します。`MultiPartFormDataContent`コンストラクターでは、境界値を渡すこともできます。

どちらのアプローチでも、[`formData {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/form-data.html)関数を使用してフォームデータを構築する必要があります。

#### `.submitFormWithBinaryData()`の使用

`.submitFormWithBinaryData()`関数は、境界を自動的に生成し、ファイルの内容が`.readBytes()`を使用して安全にメモリに読み込めるほど小さい単純なユースケースに適しています。

```kotlin
        val client = HttpClient(CIO)

        val response: HttpResponse = client.submitFormWithBinaryData(
            url = "http://localhost:8080/upload",
            formData = formData {
                append("description", "Ktor logo")
                append("image", File("ktor_logo.png").readBytes(), Headers.build {
                    append(HttpHeaders.ContentType, "image/png")
                    append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                })
            }
        )
```

完全な例については、[client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)を参照してください。

#### `MultiPartFormDataContent`の使用

大量または動的なコンテンツを効率的にストリーミングするには、`InputProvider`とともに`MultiPartFormDataContent`を使用できます。`InputProvider`を使用すると、ファイルデータ全体をメモリにロードするのではなく、バッファリングされたストリームとして供給できるため、大規模なファイルに適しています。`MultiPartFormDataContent`を使用すると、`onUpload`コールバックを使用してアップロードの進行状況を監視することもできます。

```kotlin
        val client = HttpClient(CIO)

        val file = File("ktor_logo.png")

        val response: HttpResponse = client.post("http://localhost:8080/upload") {
            setBody(
                MultiPartFormDataContent(
                    formData {
                        append("description", "Ktor logo")
                        append(
                            "image",
                            InputProvider { file.inputStream().asInput().buffered() },
                            Headers.build {
                                append(HttpHeaders.ContentType, "image/png")
                                append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                            }
                        )
                    },
                    boundary = "WebAppBoundary"
                )
            )
            onUpload { bytesSentTotal, contentLength ->
                println("Sent $bytesSentTotal bytes from $contentLength")
            }
        }
```

マルチプラットフォームプロジェクトでは、`InputProvider`とともに`SystemFileSystem.source()`を使用できます。

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

カスタムの境界とコンテンツタイプを持つ`MultiPartFormDataContent`を手動で構築することもできます。

```kotlin
fun customMultiPartMixedDataContent(parts: List<PartData>): MultiPartFormDataContent {
    val boundary = "WebAppBoundary"
    val contentType = ContentType.MultiPart.Mixed.withParameter("boundary", boundary)
    return MultiPartFormDataContent(parts, boundary, contentType)
}
```

完全な例については、[client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)を参照してください。

### バイナリデータ {id="binary"}

`application/octet-stream`コンテンツタイプでバイナリデータを送信するには、[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)インスタンスを`setBody()`関数に渡します。たとえば、[`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html)関数を使用してファイルの読み取りチャネルを開くことができます。

```kotlin
val response = client.post("http://0.0.0.0:8080/upload") {
    setBody(File("ktor_logo.png").readChannel())
}
```

完全な例については、[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)を参照してください。

## 並列リクエスト {id="parallel_requests"}

デフォルトでは、複数のリクエストを順次送信すると、クライアントは前のリクエストが完了するまで各呼び出しを中断（suspend）します。複数のリクエストを同時に実行するには、[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)または[`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)関数を使用します。次の例は、`async()`を使用して2つのリクエストを並列に実行する方法を示しています。

```kotlin
coroutineScope {
    // Parallel requests
    val firstRequest: Deferred<String> = async { client.get("http://localhost:8080/path1").bodyAsText() }
    val secondRequest: Deferred<String> = async { client.get("http://localhost:8080/path2").bodyAsText() }
    val firstRequestContent = firstRequest.await()
    val secondRequestContent = secondRequest.await()
}
```

完全な例については、[client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)を参照してください。

## リクエストのキャンセル {id="cancel-request"}

リクエストをキャンセルするには、そのリクエストを実行しているコルーチンをキャンセルします。[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)関数は、実行中のコルーチンをキャンセルするために使用できる`Job`を返します。

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

詳細については、[キャンセルとタイムアウト](https://kotlinlang.org/docs/cancellation-and-timeouts.html)を参照してください。