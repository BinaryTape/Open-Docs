[//]: # (title: リクエストの処理)

<show-structure for="chapter" depth="3"/>

<link-summary>ルートハンドラー内で受信リクエストを処理する方法を学習します。</link-summary>

Ktorでは、[ルートハンドラー](server-routing.md#define_route)内で受信リクエストを処理し、[レスポンス](server-responses.md)を送信できます。リクエストの処理中に、さまざまな操作を実行できます。
*   [リクエスト情報](#request_information)（ヘッダー、Cookieなど）の取得。
*   [パスパラメータ](#path_parameters)の値の取得。
*   [クエリ文字列](#query_parameters)のパラメータの取得。
*   [ボディコンテンツ](#body_contents)（データオブジェクト、フォームパラメータ、ファイルなど）の受信。

## 一般的なリクエスト情報 {id="request_information"}
ルートハンドラー内では、[call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html)プロパティを使用してリクエストにアクセスできます。これにより[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)インスタンスが返され、さまざまなリクエストパラメータにアクセスできます。たとえば、以下のコードスニペットはリクエストURIを取得する方法を示しています。
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text)メソッドは、クライアントにレスポンスを返すために使用されます。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)オブジェクトを使用すると、さまざまなリクエストデータにアクセスできます。例：
*   ヘッダー  
    すべてのリクエストヘッダーにアクセスするには、[ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html)プロパティを使用します。また、`acceptEncoding`、`contentType`、`cacheControl`などの専用拡張関数を使用して特定のヘッダーにアクセスすることもできます。
*   Cookie  
    [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html)プロパティは、リクエストに関連するCookieへのアクセスを提供します。Cookieを使用したセッションの処理方法については、[セッション](server-sessions.md)のセクションを参照してください。
*   接続の詳細  
    ホスト名、ポート、スキームなどの接続詳細にアクセスするには、[ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html)プロパティを使用します。
*   `X-Forwarded-` ヘッダー  
    HTTPプロキシまたはロードバランサーを介して渡されたリクエストに関する情報を取得するには、[](server-forward-headers.md)プラグインをインストールし、[ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html)プロパティを使用します。

## パスパラメータ {id="path_parameters"}
リクエストを処理する際、`call.parameters`プロパティを使用して[パスパラメータ](server-routing.md#path_parameter)の値にアクセスできます。例えば、以下のコードスニペットの`call.parameters["login"]`は、`/user/admin`パスに対して_admin_を返します。
[object Promise]

## クエリパラメータ {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>のパラメータにアクセスするには、[ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html)プロパティを使用できます。例えば、`/products?price=asc`へのリクエストが行われた場合、次のように`price`クエリパラメータにアクセスできます。

[object Promise]

[ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html)関数を使用して、クエリ文字列全体を取得することもできます。

## ボディコンテンツ {id="body_contents"}
このセクションでは、`POST`、`PUT`、または`PATCH`で送信されたボディコンテンツを受信するを方法示します。

### Rawペイロード {id="raw"}

生のボディペイロードにアクセスし、手動でパースするには、受信するペイロードの型を受け入れる[ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)関数を使用します。
次のHTTPリクエストがあるとします。

[object Promise]

このリクエストのボディを、指定された型のオブジェクトとして以下のいずれかの方法で受信できます。

-   **文字列**

    リクエストボディを文字列値として受信するには、`call.receive<String>()`を使用します。
    また、[receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html)を使用して同じ結果を得ることもできます。
    [object Promise]
-   **ByteArray**

    リクエストのボディをバイト配列として受信するには、`call.receive<ByteArray>()`を呼び出します。
    [object Promise]
-   **ByteReadChannel**

    `call.receive<ByteReadChannel>()`または[receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html)を使用して、バイトシーケンスの非同期読み取りを可能にする[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を受信できます。
    [object Promise]

    以下のサンプルは、`ByteReadChannel`を使用してファイルをアップロードする方法を示しています。
    [object Promise]

完全な例はこちらにあります：[post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### オブジェクト {id="objects"}
Ktorは、リクエストのメディアタイプをネゴシエートし、コンテンツを必要な型のオブジェクトに逆シリアル化するための[ContentNegotiation](server-serialization.md)プラグインを提供します。リクエストのコンテンツを受信して変換するには、データクラスをパラメータとして受け入れる[ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)関数を呼び出します。
[object Promise]

[](server-serialization.md)でさらに詳しく学習できます。

### フォームパラメータ {id="form_parameters"}
Ktorでは、[receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html)関数を使用して、`x-www-form-urlencoded`と`multipart/form-data`の両方のタイプで送信されたフォームパラメータを受信できます。以下の例は、ボディにフォームパラメータが渡される[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の`POST`リクエストを示しています。
[object Promise]

コードでパラメータ値は次のように取得できます。
[object Promise]

完全な例はこちらにあります：[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### マルチパートフォームデータ {id="form_data"}

マルチパートリクエストの一部として送信されたファイルを受信するには、[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)関数を呼び出し、必要に応じて各パートをループ処理します。

マルチパートリクエストデータは順次処理されるため、その特定のパートに直接アクセスすることはできません。さらに、これらのリクエストにはフォームフィールド、ファイル、バイナリデータなど、異なる種類のパートが含まれる場合があり、それぞれ異なる方法で処理する必要があります。

以下の例は、ファイルを受信してファイルシステムに保存する方法を示しています。

[object Promise]

#### デフォルトのファイルサイズ制限

デフォルトでは、受信できるバイナリおよびファイルアイテムの許可されるサイズは50MBに制限されています。受信したファイルまたはバイナリアイテムが50MBの制限を超えると、`IOException`がスローされます。

デフォルトのフォームフィールド制限を上書きするには、`.receiveMultipart()`を呼び出すときに`formFieldLimit`パラメータを渡します。

[object Promise]

この例では、新しい制限は100MBに設定されています。

#### フォームフィールド

`PartData.FormItem`はフォームフィールドを表し、その値は`value`プロパティを介してアクセスできます。

[object Promise]

#### ファイルのアップロード

`PartData.FileItem`はファイルアイテムを表します。ファイルのアップロードはバイトストリームとして処理できます。

[object Promise]

[.provider()](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)関数は`ByteReadChannel`を返し、これによりデータをインクリメンタルに読み取ることができます。`.copyAndClose()`関数を使用して、ファイルの内容を指定された宛先に書き込み、適切なリソースクリーンアップを保証します。

アップロードされたファイルのサイズを決定するには、`post`ハンドラー内で`Content-Length`[ヘッダー値](#request_information)を取得できます。

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### リソースのクリーンアップ

フォームの処理が完了すると、各パートは`.dispose()`関数を使用して破棄され、リソースが解放されます。

[object Promise]

このサンプルを実行する方法については、[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)を参照してください。