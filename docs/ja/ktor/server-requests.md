[//]: # (title: リクエストの処理)

<show-structure for="chapter" depth="3"/>

<link-summary>ルートハンドラー内で受信リクエストを処理する方法について説明します。</link-summary>

Ktorでは、[ルートハンドラー](server-routing.md#define_route)内で入力リクエストを処理し、[レスポンス](server-responses.md)を送信できます。リクエストの処理時には、以下のようなさまざまなアクションを実行できます。

* ヘッダーやCookieなどの[リクエスト情報](#request_information)を取得する。
* [パスパラメータ](#path_parameters)の値を取得する。
* [クエリ文字列](#query_parameters)のパラメータを取得する。
* データオブジェクト、フォームパラメータ、ファイルなどの[ボディの内容](#body_contents)を受信する。

## 一般的なリクエスト情報 {id="request_information"}
ルートハンドラー内では、[`call.request`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call/request.html)プロパティを使用してリクエストにアクセスできます。これは[`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html)インスタンスを返し、さまざまなリクエストパラメータへのアクセスを提供します。たとえば、以下のコードスニペットはリクエストURIを取得する方法を示しています。

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
[`call.respondText()`](server-responses.md#plain-text)メソッドは、クライアントにレスポンスを返送するために使用されます。

[`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html)オブジェクトを使用すると、以下のようなさまざまなリクエストデータにアクセスできます。

* **ヘッダー**

  すべてのリクエストヘッダーにアクセスするには、[`ApplicationRequest.headers`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/headers.html)プロパティを使用します。
  また、`acceptEncoding`、`contentType`、`cacheControl`などの専用の拡張関数を使用して、特定のヘッダーにアクセスすることもできます。

* **Cookie**  

  [`ApplicationRequest.cookies`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/cookies.html)プロパティは、リクエストに関連するCookieへのアクセスを提供します。Cookieを使用したセッションの処理方法については、[セッション](server-sessions.md)セクションを参照してください。

* **接続の詳細**

  ホスト名、ポート、スキームなどの接続の詳細にアクセスするには、[`ApplicationRequest.local`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/local.html)プロパティを使用します。

* **`X-Forwarded-` ヘッダー**

  HTTPプロキシまたはロードバランサーを経由したリクエストに関する情報を取得するには、[Forwarded headers](server-forward-headers.md)プラグインをインストールし、[`ApplicationRequest.origin`](https://api.ktor.io/ktor-server-core/io.ktor.server.plugins/origin.html)プロパティを使用します。

## パスパラメータ {id="path_parameters"}
リクエストを処理する際、`call.parameters`プロパティを使用して[パスパラメータ](server-routing.md#path_parameter)の値にアクセスできます。たとえば、以下のコードスニペットの`call.parameters["login"]`は、パス`/user/admin`に対して _admin_ を返します。

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## クエリパラメータ {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>のパラメータにアクセスするには、[`ApplicationRequest.queryParameters()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html)プロパティを使用できます。たとえば、`/products?price=asc`へのリクエストが行われた場合、次のようにして`price`クエリパラメータにアクセスできます。

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // 低価格から高価格の順に商品を表示する
    }
}
```

また、[`ApplicationRequest.queryString()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/query-string.html)関数を使用してクエリ文字列全体を取得することもできます。

## ボディの内容 {id="body_contents"}
このセクションでは、`POST`、`PUT`、または`PATCH`で送信されたボディの内容を受信する方法を説明します。

### 生のペイロード {id="raw"}

生のボディペイロードにアクセスして手動で解析するには、受信するペイロードの型を受け取る[`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html)関数を使用します。次のようなHTTPリクエストがあるとします。

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

このリクエストのボディは、以下のいずれかの方法で指定した型のオブジェクトとして受信できます。

- **String**

   リクエストボディをString値として受信するには、`call.receive<String>()`を使用します。
   [`.receiveText()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-text.html)を使用して同じ結果を得ることもできます。
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **ByteArray**

   リクエストのボディをバイト配列として受信するには、`call.receive<ByteArray>()`を呼び出します。
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   `call.receive<ByteReadChannel>()`または[`.receiveChannel()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-channel.html)を使用して、バイトシーケンスの非同期読み取りを可能にする[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を受信できます。
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readString()
       call.respondText(text)
   }
   ```

   以下のサンプルは、`ByteReadChannel`を使用してファイルをアップロードする方法を示しています。
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

> Ktorのチャンネルと`RawSink`、`RawSource`、または`OutputStream`などの型との間の変換については、[I/O相互運用性](io-interoperability.md)を参照してください。
>
{style="tip"}

> 完全な例については、[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-raw-data)を参照してください。

### オブジェクト {id="objects"}

Ktorは[ContentNegotiation](server-serialization.md)プラグインを提供し、リクエストのメディアタイプをネゴシエートして、コンテンツを必要な型のオブジェクトにデシリアライズします。

リクエストのコンテンツを受信して変換するには、データクラスをパラメータとして受け取る[`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html)関数を呼び出します。

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 詳細については、[Ktor Serverにおけるコンテンツネゴシエーションとシリアライズ](server-serialization.md)を参照してください。

### フォームパラメータ {id="form_parameters"}
Ktorでは、[receiveParameters](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-parameters.html)関数を使用して、`x-www-form-urlencoded`と`multipart/form-data`の両方のタイプで送信されたフォームパラメータを受信できます。以下の例は、ボディにフォームパラメータを渡した[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の`POST`リクエストを示しています。
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

コード内でパラメータ値を取得するには、次のようにします。
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 完全な例については、[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-form-parameters)を参照してください。

### マルチパートフォームデータ {id="form_data"}

マルチパートリクエストの一部として送信されたファイルを受信するには、[`.receiveMultipart()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-multipart.html)関数を呼び出し、必要に応じて各パートをループします。

マルチパートリクエストデータは順次処理されるため、特定のパートに直接アクセスすることはできません。また、これらのリクエストには、フォームフィールド、ファイル、バイナリデータなど、異なる種類のパートが含まれる場合があり、それぞれを異なる方法で処理する必要があります。

この例では、ファイルを受信してファイルシステムに保存する方法を示します。

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

デフォルトでは、受信可能なバイナリおよびファイル項目の許容サイズは50MiBに制限されています。受信したファイルまたはバイナリ項目が50MiBの制限を超えると、`IOException`がスローされます。

デフォルトのフォームフィールド制限を上書きするには、`.receiveMultipart()`を呼び出すときに`formFieldLimit`パラメータを渡します。

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

この例では、新しい制限が100MiBに設定されています。

#### フォームフィールド

`PartData.FormItem`はフォームフィールドを表し、その値は`value`プロパティを介してアクセスできます。

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### ファイルアップロード

`PartData.FileItem`はファイル項目を表します。ファイルアップロードをバイトストリームとして処理できます。

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)関数は、データをインクリメンタルに読み取ることができる`ByteReadChannel`を返します。`.copyAndClose()`関数を使用すると、適切なリソースクリーンアップを保証しながら、ファイルの内容を指定された宛先に書き込みます。

アップロードされたファイルのサイズを特定するには、`post`ハンドラー内で`Content-Length` [ヘッダー値](#request_information)を取得できます。

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### リソースのクリーンアップ

フォームの処理が完了したら、リソースを解放するために`.dispose()`関数を使用して各パートを破棄します。

```kotlin
part.dispose()
```

> このサンプルの実行方法については、[upload-file](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/upload-file)を参照してください。