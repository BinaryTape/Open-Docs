[//]: # (title: リクエストの処理)

<show-structure for="chapter" depth="3"/>

<link-summary>ルートハンドラ内で受信リクエストを処理する方法を学習します。</link-summary>

Ktorを使用すると、[ルートハンドラ](server-routing.md#define_route)内で受信リクエストを処理し、[レスポンス](server-responses.md)を送信できます。リクエストを処理する際に、様々なアクションを実行できます。

* ヘッダーやCookieなどの[リクエスト情報](#request_information)を取得する。
* [パスパラメータ](#path_parameters)の値を取得する。
* [クエリ文字列](#query_parameters)のパラメータを取得する。
* データオブジェクト、フォームパラメータ、ファイルなどの[ボディコンテンツ](#body_contents)を受信する。

## 一般的なリクエスト情報 {id="request_information"}
ルートハンドラ内で、`[call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html)` プロパティを使用してリクエストにアクセスできます。これは `[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)` インスタンスを返し、様々なリクエストパラメータへのアクセスを提供します。例えば、以下のコードスニペットはリクエストURIの取得方法を示しています。

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
`[call.respondText()](server-responses.md#plain-text)` メソッドは、クライアントにレスポンスを送信するために使用されます。

`[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)` オブジェクトを使用すると、例えば以下のような様々なリクエストデータにアクセスできます。

* **ヘッダー**

  すべてのリクエストヘッダーにアクセスするには、`[ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html)` プロパティを使用します。
  `acceptEncoding`、`contentType`、`cacheControl` などの専用の拡張関数を使用して、特定のヘッダーにアクセスすることもできます。

* **Cookie**  

  `[ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html)` プロパティは、リクエストに関連するCookieへのアクセスを提供します。Cookieを使用したセッションの処理方法については、[セッション](server-sessions.md)のセクションを参照してください。

* **接続の詳細**

  ホスト名、ポート、スキームなどの接続の詳細にアクセスするには、`[ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html)` プロパティを使用します。

* **`X-Forwarded-` ヘッダー**

  HTTPプロキシまたはロードバランサーを介して渡されたリクエストに関する情報を取得するには、[Forwarded headers](server-forward-headers.md) プラグインをインストールし、`[ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html)` プロパティを使用します。

## パスパラメータ {id="path_parameters"}
リクエストを処理する際、`call.parameters` プロパティを使用して[パスパラメータ](server-routing.md#path_parameter)の値にアクセスできます。例えば、以下のコードスニペットの `call.parameters["login"]` は、`/user/admin` パスに対して _admin_ を返します。

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## クエリパラメータ {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>のパラメータにアクセスするには、`[ApplicationRequest.queryParameters()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html)` プロパティを使用できます。例えば、`/products?price=asc` へのリクエストがあった場合、次のように `price` クエリパラメータにアクセスできます。

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // Show products from the lowest price to the highest
    }
}
```

`[ApplicationRequest.queryString()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html)` 関数を使用して、クエリ文字列全体を取得することもできます。

## ボディコンテンツ {id="body_contents"}
このセクションでは、`POST`、`PUT`、または `PATCH` で送信されたボディコンテンツを受信する方法を示します。

### 生のペイロード {id="raw"}

生のボディペイロードにアクセスして手動でパースするには、受信するペイロードの型を受け入れる `[ApplicationCall.receive()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)` 関数を使用します。以下のHTTPリクエストがあるとします。

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

このリクエストのボディは、以下のいずれかの方法で指定された型のオブジェクトとして受信できます。

- **String**

   リクエストボディをString値として受信するには、`call.receive<String>()` を使用します。
   `[receiveText()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html)` を使用しても同じ結果が得られます。
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **ByteArray**

   リクエストのボディをバイト配列として受信するには、`call.receive<ByteArray>()` を呼び出します。
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   `call.receive<ByteReadChannel>()` または `[receiveChannel()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html)` を使用して、バイトシーケンスの非同期読み取りを可能にする `[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)` を受信できます。
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readString()
       call.respondText(text)
   }
   ```

   以下のサンプルは、`ByteReadChannel` を使用してファイルをアップロードする方法を示しています。
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

> Ktorチャンネルと`RawSink`、`RawSource`、`OutputStream`などの型との変換については、[I/O相互運用性](io-interoperability.md)を参照してください。
>
{style="tip"}

> 完全な例は [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data) で確認できます。

### オブジェクト {id="objects"}

Ktorは、リクエストのメディアタイプをネゴシエートし、コンテンツを必要な型のオブジェクトにデシリアライズするための `[ContentNegotiation](server-serialization.md)` プラグインを提供します。

リクエストのコンテンツを受信して変換するには、データクラスをパラメータとして受け入れる `[ApplicationCall.receive()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)` 関数を呼び出します。

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 詳細については、[Ktorサーバーでのコンテンツネゴシエーションとシリアライゼーション](server-serialization.md) を参照してください。

### フォームパラメータ {id="form_parameters"}
Ktorは、`[receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html)` 関数を使用して、`x-www-form-urlencoded` および `multipart/form-data` 型の両方で送信されたフォームパラメータを受信できます。以下の例は、ボディにフォームパラメータを渡す `[HTTP client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)` の `POST` リクエストを示しています。
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

コード内でパラメータ値を次のように取得できます。
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 完全な例は [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) で確認できます。

### マルチパートフォームデータ {id="form_data"}

マルチパートリクエストの一部として送信されたファイルを受信するには、`[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)` 関数を呼び出し、必要に応じて各パートをループ処理します。

マルチパートリクエストデータは順次処理されるため、特定のパートに直接アクセスすることはできません。さらに、これらのリクエストには、フォームフィールド、ファイル、バイナリデータなど、異なる種類のパートが含まれる場合があり、それぞれ異なる方法で処理する必要があります。

この例は、ファイルを受信してファイルシステムに保存する方法を示しています。

```kotlin
import io.ktor.server.application.*
import io.ktor.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import java.io.File

fun Application.main() {
    routing {
        post("/upload") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val file = File("uploads/$fileName")
                        part.provider().copyAndClose(file.writeChannel())
                    }

                    else -> {}
                }
                part.dispose()
            }

            call.respondText("$fileDescription is uploaded to 'uploads/$fileName'")
        }
    }
}
```

#### デフォルトのファイルサイズ制限

デフォルトでは、受信できるバイナリおよびファイルアイテムの許可されるサイズは50MBに制限されています。受信したファイルまたはバイナリアイテムが50MBの制限を超えると、`IOException` がスローされます。

デフォルトのフォームフィールド制限をオーバーライドするには、`.receiveMultipart()` を呼び出す際に `formFieldLimit` パラメータを渡します。

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

この例では、新しい制限が100MBに設定されています。

#### フォームフィールド

`PartData.FormItem` はフォームフィールドを表し、その値は `value` プロパティを通じてアクセスできます。

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### ファイルアップロード

`PartData.FileItem` はファイルアイテムを表します。ファイルアップロードはバイトストリームとして処理できます。

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

`[.provider()](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)` 関数は `ByteReadChannel` を返し、これによりデータを増分的に読み取ることができます。
`.copyAndClose()` 関数を使用することで、適切なリソースクリーンアップを保証しながら、ファイルコンテンツを指定された宛先に書き込みます。

アップロードされたファイルのサイズを決定するには、`post` ハンドラ内で `Content-Length` [ヘッダー値](#request_information)を取得できます。

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### リソースのクリーンアップ

フォーム処理が完了すると、各パートは `.dispose()` 関数を使用してリソースを解放するために破棄されます。

```kotlin
part.dispose()
```

> このサンプルの実行方法については、[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file) を参照してください。