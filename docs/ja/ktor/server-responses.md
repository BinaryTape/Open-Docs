[//]: # (title: レスポンスの送信)

<show-structure for="chapter" depth="2"/>

<link-summary>さまざまな種類のレスポンスを送信する方法を学びます。</link-summary>

Ktorでは、受信する[リクエスト](server-requests.md)を処理し、[ルートハンドラ](server-routing.md#define_route)内でレスポンスを送信できます。プレーンテキスト、HTMLドキュメントとテンプレート、シリアライズされたデータオブジェクトなど、さまざまな種類のレスポンスを送信できます。また、各レスポンスに対して、コンテンツタイプ、ヘッダー、クッキーなど、さまざまな[レスポンスパラメータ](#parameters)を設定することも可能です。

ルートハンドラ内では、レスポンスを操作するために以下のAPIが利用可能です。
* 特定のコンテンツタイプを送信するための関数群（例: [`call.respondText`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html)、[`call.respondHtml`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html)など）。
* レスポンス内で[任意のデータ](#payload)を送信できる[`call.respond`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html)関数。例えば、[ContentNegotiation](server-serialization.md)プラグインが有効な場合、特定の形式でシリアライズされたデータオブジェクトを送信できます。
* [レスポンスパラメータ](#parameters)へのアクセスを提供し、ステータスコードの設定、ヘッダーの追加、クッキーの設定を可能にする[`ApplicationResponse`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/index.html)オブジェクトを返す[`call.response`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/response.html)プロパティ。
* リダイレクトを追加する機能を提供する[`call.respondRedirect`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html)。

## レスポンスペイロードを設定する {id="payload"}
### プレーンテキスト {id="plain-text"}
レスポンスでプレーンテキストを送信するには、[`call.respondText`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html)関数を使用します。
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktorは、クライアントにHTMLレスポンスを送信する主な2つの方法を提供します。
* Kotlin HTML DSLを使用してHTMLを構築する。
* FreeMarker、VelocityなどのJVMテンプレートエンジンを使用する。

Kotlin DSLを使用して構築したHTMLを送信するには、[`call.respondHtml`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html)関数を使用します。
```kotlin
```
{src="snippets/html/src/main/kotlin/com/example/Application.kt" include-lines="12-28"}

レスポンスでテンプレートを送信するには、特定のコンテンツとともに[`call.respond`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html)関数を呼び出します。
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}

... または適切な[`call.respondTemplate`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html)関数を使用します。
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
[](server-templating.md)ヘルプセクションで詳細を確認できます。

### オブジェクト {id="object"}
Ktorでデータオブジェクトのシリアライズを有効にするには、[ContentNegotiation](server-serialization.md)プラグインをインストールし、必要なコンバータ（例: JSON）を登録する必要があります。その後、[`call.respond`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html)関数を使用して、レスポンスでデータオブジェクトを渡すことができます。

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="32-36"}

完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

[//]: # (TODO: Check link for LocalPathFile)

### ファイル {id="file"}

クライアントにファイルのコンテンツで応答するには、2つのオプションがあります。

- `File`リソースの場合、[`call.respondFile`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-file.html)関数を使用します。
- `Path`リソースの場合、[`LocalPathContent`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html)クラスとともに`call.respond()`関数を使用します。

以下のコードサンプルは、レスポンスで指定されたファイルを送信し、`Content-Disposition`[ヘッダー](#headers)を追加することで、このファイルをダウンロード可能にする方法を示しています。

```kotlin
```
{src="snippets/download-file/src/main/kotlin/com/example/DownloadFile.kt" include-lines="3-35"}

このサンプルには2つのプラグインがインストールされていることに注意してください。
- [PartialContent](server-partial-content.md)は、サーバーが`Range`ヘッダーを持つリクエストに応答し、コンテンツの一部のみを送信できるようにします。
- [AutoHeadResponse](server-autoheadresponse.md)は、`GET`が定義されているすべてのルートに対して`HEAD`リクエストに自動的に応答する機能を提供します。これにより、クライアントアプリケーションは`Content-Length`ヘッダー値を読み取ることでファイルサイズを決定できます。

完全なコードサンプルについては、[download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)を参照してください。

### 生のペイロード {id="raw"}
生のボディペイロードを送信する必要がある場合は、[`call.respondBytes`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-bytes.html)関数を使用します。

## レスポンスパラメータを設定する {id="parameters"}
### ステータスコード {id="status"}
レスポンスのステータスコードを設定するには、[`ApplicationResponse.status`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/status.html)を呼び出します。定義済みのステータスコード値を渡すことができます。
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
... またはカスタムステータスコードを指定します。
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

[ペイロード](#payload)を送信するための関数には、ステータスコードを指定するためのオーバーロードがあることに注意してください。

### コンテンツタイプ {id="content-type"}
[ContentNegotiation](server-serialization.md)プラグインがインストールされている場合、Ktorは[レスポンス](#payload)のコンテンツタイプを自動的に選択します。必要に応じて、対応するパラメータを渡すことでコンテンツタイプを手動で指定できます。例えば、以下のコードスニペットの`call.respondText`関数は、`ContentType.Text.Plain`をパラメータとして受け入れます。
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### ヘッダー {id="headers"}
レスポンスで特定のヘッダーを送信するには、いくつかの方法があります。
* [`ApplicationResponse.headers`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/headers.html)コレクションにヘッダーを追加します。
   ```kotlin
   get("/") {
       call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* [`ApplicationResponse.header`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/header.html)関数を呼び出します。
   ```kotlin
   get("/") {
       call.response.header(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* 具体的なヘッダーを指定するための専用関数（例: `ApplicationResponse.etag`、`ApplicationResponse.link`など）を使用します。
   ```kotlin
   get("/") {
       call.response.etag("7c876b7e")
   }
   ```
  
* カスタムヘッダーを追加するには、その名前を文字列値として上記のいずれかの関数に渡します（例:）。
   ```kotlin
   get("/") {
       call.response.header("Custom-Header", "Some value")
   }
   ```

> 標準の`Server`および`Date`ヘッダーを各レスポンスに追加するには、[DefaultHeaders](server-default-headers.md)プラグインをインストールします。
>
{type="tip"}

### クッキー {id="cookies"}
レスポンスで送信されるクッキーを設定するには、[`ApplicationResponse.cookies`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/cookies.html)プロパティを使用します。
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktorはクッキーを使用してセッションを処理する機能も提供します。[Sessions](server-sessions.md)セクションで詳細を確認できます。

## リダイレクト {id="redirect"}
リダイレクトレスポンスを生成するには、[`respondRedirect`](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html)関数を呼び出します。
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}