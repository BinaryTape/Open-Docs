[//]: # (title: レスポンスの送信)

<show-structure for="chapter" depth="2"/>

<link-summary>さまざまな種類のレスポンスを送信する方法を学ぶ</link-summary>

Ktorを使用すると、受信した[リクエスト](server-requests.md)を処理し、[ルートハンドラー](server-routing.md#define_route)内でレスポンスを送信できます。プレーンテキスト、HTMLドキュメントやテンプレート、シリアライズされたデータオブジェクトなど、さまざまな種類のレスポンスを送信できます。各レスポンスに対して、コンテンツタイプ、ヘッダー、Cookieなどのさまざまな[レスポンスパラメーター](#parameters)を設定することもできます。

ルートハンドラー内では、レスポンスを操作するために以下のAPIが利用可能です:
* [特定のコンテンツタイプを送信するための](#payload)関数群（例: [call.respondText](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-text.html)、[call.respondHtml](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html.html)など）。
* [call.respond](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond.html)関数は、レスポンス内に[あらゆるデータを送信する](#payload)ことを可能にします。例えば、[ContentNegotiation](server-serialization.md)プラグインが有効な場合、特定のフォーマットでシリアライズされたデータオブジェクトを送信できます。
* [call.response](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call/response.html)プロパティは、[レスポンスパラメーター](#parameters)へのアクセスを提供し、ステータスコードの設定、ヘッダーの追加、Cookieの設定を可能にする[ApplicationResponse](https://api.ktor.io/ktor-server-core/io.ktor.server.response/-application-response/index.html)オブジェクトを返します。
* [call.respondRedirect](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-redirect.html)は、リダイレクトを追加する機能を提供します。

## レスポンスペイロードの設定 {id="payload"}
### プレーンテキスト {id="plain-text"}
レスポンスでプレーンテキストを送信するには、[call.respondText](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-text.html)関数を使用します。
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktorは、クライアントにHTMLレスポンスを送信する2つの主要な方法を提供します:
* Kotlin HTML DSLを使用してHTMLを構築する。
* FreeMarker、VelocityなどのJVMテンプレートエンジンを使用する。

Kotlin DSLを使用して構築したHTMLを送信するには、[call.respondHtml](https://api.ktor.io/ktor-server-html-builder/io.ktor.server.html/respond-html.html)関数を使用します。
```kotlin
routing {
    get("/") {
        val name = "Ktor"
        call.respondHtml(HttpStatusCode.OK) {
            head {
                title {
                    +name
                }
            }
            body {
                h1 {
                    +"Hello from $name!"
                }
            }
        }
    }
}
```

レスポンスでテンプレートを送信するには、[call.respond](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond.html)関数を特定のコンテンツとともに呼び出します...
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(FreeMarkerContent("index.ftl", mapOf("user" to sampleUser)))
}
```

...または適切な[call.respondTemplate](https://api.ktor.io/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html)関数を使用します:
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
詳細については、[Templating](server-templating.md)ヘルプセクションを参照してください。

### オブジェクト {id="object"}
Ktorでデータオブジェクトのシリアライズを有効にするには、[ContentNegotiation](server-serialization.md)プラグインをインストールし、必要なコンバーター（例: JSON）を登録する必要があります。その後、[call.respond](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond.html)関数を使用してレスポンスでデータオブジェクトを渡すことができます:

```kotlin
routing {
    get("/customer/{id}") {
        val id: Int by call.parameters
        val customer: Customer = customerStorage.find { it.id == id }!!
        call.respond(customer)
```

完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

[//]: # (TODO: Check link for LocalPathFile)

### ファイル {id="file"}

クライアントにファイルのコンテンツをレスポンスとして送信するには、2つのオプションがあります:

- `File`リソースの場合、[call.respondFile](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-file.html)関数を使用します。
- `Path`リソースの場合、[LocalPathContent](https://api.ktor.io/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html)クラスと共に`call.respond()`関数を使用します。

以下のコードサンプルは、レスポンスで指定されたファイルを送信し、`Content-Disposition` [ヘッダー](#headers)を追加することで、このファイルをダウンロード可能にする方法を示しています:

```kotlin
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.plugins.partialcontent.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.nio.file.Path

fun Application.main() {
    install(PartialContent)
    install(AutoHeadResponse)
    routing {
        get("/download") {
            val file = File("files/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }
        get("/downloadFromPath") {
            val filePath = Path.of("files/file.txt")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "file.txt")
                    .toString()
            )
            call.respond(LocalPathContent(filePath))
        }
    }
```

このサンプルには、2つのプラグインがインストールされていることに注意してください:
- [PartialContent](server-partial-content.md)は、サーバーが`Range`ヘッダーを持つリクエストに応答し、コンテンツの一部のみを送信できるようにします。
- [AutoHeadResponse](server-autoheadresponse.md)は、`GET`が定義されているすべてのルートに対して`HEAD`リクエストに自動的に応答する機能を提供します。これにより、クライアントアプリケーションは`Content-Length`ヘッダー値を読み取ることでファイルサイズを決定できます。

完全なコードサンプルについては、[download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)を参照してください。

### 生のペイロード {id="raw"}
生のボディペイロードを送信する必要がある場合は、[call.respondBytes](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-bytes.html)関数を使用します。

## レスポンスパラメーターの設定 {id="parameters"}
### ステータスコード {id="status"}
レスポンスのステータスコードを設定するには、[ApplicationResponse.status](https://api.ktor.io/ktor-server-core/io.ktor.server.response/-application-response/status.html)を呼び出します。事前に定義されたステータスコード値を渡すことができます...
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
...またはカスタムステータスコードを指定できます:
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

[ペイロード](#payload)を送信する関数には、ステータスコードを指定するためのオーバーロードがあることに注意してください。

### コンテンツタイプ {id="content-type"}
インストールされている[ContentNegotiation](server-serialization.md)プラグインを使用すると、Ktorは[レスポンス](#payload)のコンテンツタイプを自動的に選択します。必要に応じて、対応するパラメーターを渡すことで、コンテンツタイプを手動で指定できます。例えば、以下のコードスニペットの`call.respondText`関数は、`ContentType.Text.Plain`をパラメーターとして受け入れます:
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### ヘッダー {id="headers"}
レスポンスで特定のヘッダーを送信するには、いくつかの方法があります:
* [ApplicationResponse.headers](https://api.ktor.io/ktor-server-core/io.ktor.server.response/-application-response/headers.html)コレクションにヘッダーを追加します:
   ```kotlin
   get("/") {
       call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* [ApplicationResponse.header](https://api.ktor.io/ktor-server-core/io.ktor.server.response/header.html)関数を呼び出します:
   ```kotlin
   get("/") {
       call.response.header(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* 具体的なヘッダーを指定するための専用関数を使用します（例えば、`ApplicationResponse.etag`、`ApplicationResponse.link`などです）。
   ```kotlin
   get("/") {
       call.response.etag("7c876b7e")
   }
   ```
  
* カスタムヘッダーを追加するには、その名前を文字列値として上記のいずれかの関数に渡します。例えば:
   ```kotlin
   get("/") {
       call.response.header("Custom-Header", "Some value")
   }
   ```

> 各レスポンスに標準の`Server`および`Date`ヘッダーを追加するには、[DefaultHeaders](server-default-headers.md)プラグインをインストールします。
>
{type="tip"}

### Cookie {id="cookies"}
レスポンスで送信されるCookieを設定するには、[ApplicationResponse.cookies](https://api.ktor.io/ktor-server-core/io.ktor.server.response/-application-response/cookies.html)プロパティを使用します:
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktorは、Cookieを使用してセッションを処理する機能も提供します。詳細については、[Sessions](server-sessions.md)セクションを参照してください。

## リダイレクト {id="redirect"}
リダイレクトレスポンスを生成するには、[respondRedirect](https://api.ktor.io/ktor-server-core/io.ktor.server.response/respond-redirect.html)関数を呼び出します:
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}