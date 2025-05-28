[//]: # (title: リクエストの処理)

<show-structure for="chapter" depth="3"/>

<link-summary>ルートハンドラー内で受信リクエストを処理する方法について学びます。</link-summary>

Ktorでは、[ルートハンドラー](server-routing.md#define_route)内で受信リクエストを処理し、[レスポンス](server-responses.md)を送信できます。リクエストを処理する際に、さまざまなアクションを実行できます。
* ヘッダーやCookieなどの[リクエスト情報](#request_information)を取得する。
* [パスパラメーター](#path_parameters)の値を取得する。
* [クエリ文字列](#query_parameters)のパラメーターを取得する。
* データオブジェクト、フォームパラメーター、ファイルなどの[ボディコンテンツ](#body_contents)を受信する。

## 一般的なリクエスト情報 {id="request_information"}
ルートハンドラー内では、[call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html)プロパティを使用してリクエストにアクセスできます。これは[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)インスタンスを返し、様々なリクエストパラメーターへのアクセスを提供します。例えば、以下のコードスニペットはリクエストURIを取得する方法を示しています。
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> [call.respondText](server-responses.md#plain-text)メソッドは、クライアントに応答を返すために使用されます。

[ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)オブジェクトを使用すると、様々なリクエストデータにアクセスできます。例えば：
* ヘッダー  
  すべてのリクエストヘッダーにアクセスするには、[ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html)プロパティを使用します。また、`acceptEncoding`、`contentType`、`cacheControl`などの専用の拡張関数を使用して特定のヘッダーにアクセスすることもできます。
* Cookie  
  [ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html)プロパティは、リクエストに関連するCookieへのアクセスを提供します。Cookieを使用したセッションの処理方法については、[セッション](server-sessions.md)のセクションを参照してください。
* 接続詳細  
  [ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html)プロパティを使用して、ホスト名、ポート、スキームなどの接続詳細にアクセスします。
* `X-Forwarded-` ヘッダー  
  HTTPプロキシまたはロードバランサーを介して渡されたリクエストに関する情報を取得するには、[](server-forward-headers.md)プラグインをインストールし、[ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html)プロパティを使用します。

## パスパラメーター {id="path_parameters"}
リクエストを処理する際に、`call.parameters`プロパティを使用して[パスパラメーター](server-routing.md#path_parameter)の値にアクセスできます。例えば、以下のコードスニペットの`call.parameters["login"]`は、`/user/admin`というパスに対して_admin_を返します。
```kotlin
```
{src="snippets/_misc/RouteParameter.kt"}

## クエリパラメーター {id="query_parameters"}

<emphasis tooltip="query_string">クエリ文字列</emphasis>のパラメーターにアクセスするには、[ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-parameters.html)プロパティを使用できます。例えば、リクエストが`/products?price=asc`に対して行われた場合、次のように`price`クエリパラメーターにアクセスできます。

```kotlin
```
{src="snippets/_misc/QueryParameter.kt"}

[ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html)関数を使用すると、クエリ文字列全体を取得することもできます。

## ボディコンテンツ {id="body_contents"}
このセクションでは、`POST`、`PUT`、または`PATCH`で送信されたボディコンテンツを受信する方法を示します。

### 生のペイロード {id="raw"}

生のボディペイロードにアクセスし、手動でパースするには、受信するペイロードの型を受け入れる[ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)関数を使用します。
以下のHTTPリクエストがあるとします。

```HTTP
```
{src="snippets/post-raw-data/post.http" include-lines="1-4"}

このリクエストのボディを、指定された型のオブジェクトとして次のいずれかの方法で受信できます。

- **String**

   リクエストボディをString値として受信するには、`call.receive<String>()`を使用します。
   [receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html)を使用しても同じ結果を得ることができます。
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="13-16"}
- **ByteArray**

   リクエストのボディをバイト配列として受信するには、`call.receive<ByteArray>()`を呼び出します。
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="18-22"}
- **ByteReadChannel**

   `call.receive<ByteReadChannel>()`または[receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html)を使用して、バイトシーケンスの非同期読み取りを可能にする[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)を受信できます。
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="23-27"}

   以下のサンプルは、`ByteReadChannel`を使用してファイルをアップロードする方法を示しています。
   ```kotlin
   ```
   {src="snippets/post-raw-data/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

完全な例はこちらにあります: [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data)。

### オブジェクト {id="objects"}
Ktorは、リクエストのメディアタイプをネゴシエートし、コンテンツを必要な型のオブジェクトにデシリアライズするための[ContentNegotiation](server-serialization.md)プラグインを提供します。リクエストのコンテンツを受信して変換するには、データクラスをパラメーターとして受け入れる[ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)関数を呼び出します。
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="38-42"}

詳細については、[](server-serialization.md)を参照してください。

### フォームパラメーター {id="form_parameters"}
Ktorでは、[receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html)関数を使用して、`x-www-form-urlencoded`と`multipart/form-data`の両方のタイプで送信されたフォームパラメーターを受信できます。以下の例は、ボディでフォームパラメーターが渡される[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)の`POST`リクエストを示しています。
```HTTP
```
{src="snippets/post-form-parameters/post.http"}

コードでパラメーター値を取得する方法は次のとおりです。
```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="12-16"}

完全な例はこちらにあります: [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)。

### マルチパートフォームデータ {id="form_data"}

マルチパートリクエストの一部として送信されたファイルを受信するには、
[.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html)関数を呼び出し、
必要に応じて各パートをループ処理します。

マルチパートリクエストデータは順次処理されるため、特定のパートに直接アクセスすることはできません。
さらに、これらのリクエストには、フォームフィールド、ファイル、バイナリデータなど、
異なる種類のパートが含まれる場合があり、それぞれ異なる方法で処理する必要があります。

この例では、ファイルを受信してファイルシステムに保存する方法を示します。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="3-39"}

#### デフォルトのファイルサイズ制限

デフォルトでは、受信できるバイナリおよびファイルアイテムの許容サイズは50MBに制限されています。
受信したファイルまたはバイナリアイテムが50MBの制限を超えると、`IOException`がスローされます。

デフォルトのフォームフィールド制限をオーバーライドするには、
`.receiveMultipart()`を呼び出すときに`formFieldLimit`パラメーターを渡します。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="17"}

この例では、新しい制限が100MBに設定されています。

#### フォームフィールド

`PartData.FormItem`はフォームフィールドを表し、その値は`value`プロパティを介してアクセスできます。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20-23,32"}

#### ファイルアップロード

`PartData.FileItem`はファイルアイテムを表します。ファイルアップロードをバイトストリームとして処理できます。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="20,25-29,32"}

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html)
関数は`ByteReadChannel`を返します。これにより、データを段階的に読み取ることができます。
次に、`.copyAndClose()`関数を使用して、適切なリソースクリーンアップを確保しながら、
ファイルコンテンツを指定された宛先に書き込みます。

アップロードされたファイルサイズを決定するには、`post`ハンドラー内で`Content-Length`
[ヘッダー値](#request_information)を取得できます。

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### リソースのクリーンアップ

フォーム処理が完了すると、各パートは`.dispose()`関数を使用して破棄され、リソースが解放されます。

```kotlin
```

{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt" include-lines="33"}

このサンプルを実行する方法については、
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)を参照してください。