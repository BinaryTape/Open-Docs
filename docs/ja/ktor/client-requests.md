[//]: # (title: リクエストの作成)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
リクエストの作成方法と、リクエストURL、HTTPメソッド、ヘッダー、リクエストボディなど、さまざまなリクエストパラメーターの指定方法を学びます。
</link-summary>

[クライアントのセットアップ](client-create-and-configure.md)後、HTTPリクエストを作成できます。HTTPリクエストを作成する主な方法は、URLをパラメーターとして受け取る[request](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html)関数です。この関数内で、さまざまなリクエストパラメーターを設定できます。
* `GET`、`POST`、`PUT`、`DELETE`、`HEAD`、`OPTIONS`、`PATCH`などのHTTPメソッドを指定します。
* URLを文字列として指定するか、URLコンポーネント（ドメイン、パス、クエリパラメーターなど）を個別に設定します。
* ヘッダーとCookieを追加します。
* プレーンテキスト、データオブジェクト、フォームパラメーターなど、リクエストのボディを設定します。

これらのパラメーターは、[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)クラスによって公開されています。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by [[[HttpRequestBuilder|https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html]]]
}
```
{interpolate-variables="true" disable-links="false"}

この関数を使用すると、`HttpResponse`オブジェクトとしてレスポンスを受け取れることに注意してください。`HttpResponse`は、レスポンスボディをさまざまな方法（文字列、JSONオブジェクトなど）で取得し、ステータスコード、コンテンツタイプ、ヘッダーなどのレスポンスパラメーターを取得するために必要なAPIを公開しています。詳細については、[](client-responses.md)トピックを参照してください。

> `request`は中断関数であるため、リクエストはコルーチンまたは他の中断関数からのみ実行する必要があります。中断関数の呼び出しについては、[コルーチンの基本](https://kotlinlang.org/docs/coroutines-basics.html)で詳しく学ぶことができます。

### HTTPメソッドの指定 {id="http-method"}

`request`関数を呼び出す際、`method`プロパティを使用して目的のHTTPメソッドを指定できます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

`request`関数に加えて、`HttpClient`は基本的なHTTPメソッドのための特定の関数、例えば[get](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html)、[post](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html)、[put](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html)などを提供します。例えば、上記のRequestを以下のコードに置き換えることができます。
```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

どちらの例でも、リクエストURLは文字列として指定されています。また、[HttpRequestBuilder](#url)を使用してURLコンポーネントを個別に設定することもできます。

## リクエストURLの指定 {id="url"}

Ktorクライアントでは、以下の方法でリクエストURLを設定できます。

- _URL文字列全体を渡す_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}
   
- _URLコンポーネントを個別に設定する_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="22-28"}
   
   この場合、`HttpRequestBuilder`によって公開されている`url`パラメーターが使用されます。このパラメーターは[URLBuilder](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html)を受け入れ、URLの構築においてより柔軟性を提供します。

> すべてのリクエストのベースURLを設定するには、[DefaultRequest](client-default-request.md#url)プラグインを使用できます。

### パスセグメント {id="path_segments"}

前の例では、`URLBuilder.path`プロパティを使用してURLパス全体を指定しました。
`appendPathSegments`関数を使用して、個々のパスセグメントを渡すこともできます。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

`appendPathSegments`はパスセグメントを[エンコード][percent_encoding]することに注意してください。
エンコードを無効にするには、`appendEncodedPathSegments`を使用します。

### クエリパラメーター {id="query_parameters"}
<emphasis tooltip="query_string">クエリ文字列</emphasis>パラメーターを追加するには、`URLBuilder.parameters`プロパティを使用します。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="34-38"}

`parameters`はクエリパラメーターを[エンコード][percent_encoding]することに注意してください。
エンコードを無効にするには、`encodedParameters`を使用します。

> `trailingQuery`プロパティを使用すると、クエリパラメーターがない場合でも`?`文字を保持できます。

### URLフラグメント {id="url-fragment"}

ハッシュマーク`#`は、URLの末尾近くにあるオプションのフラグメントを導入します。
`fragment`プロパティを使用してURLフラグメントを設定できます。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

`fragment`はURLフラグメントを[エンコード][percent_encoding]することに注意してください。
エンコードを無効にするには、`encodedFragment`を使用します。

## リクエストパラメーターの設定 {id="parameters"}
このセクションでは、HTTPメソッド、ヘッダー、Cookieなど、さまざまなリクエストパラメーターを指定する方法について説明します。特定のクライアントのすべてのリクエストに対してデフォルトパラメーターを設定する必要がある場合は、[DefaultRequest](client-default-request.md)プラグインを使用します。

### ヘッダー {id="headers"}

リクエストにヘッダーを追加するには、以下の方法を使用できます。
- [headers](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html)関数を使用すると、複数のヘッダーを一度に追加できます。
   ```kotlin
   ```
  {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}
- [header](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html)関数を使用すると、単一のヘッダーを追加できます。
- `basicAuth`および`bearerAuth`関数は、対応するHTTPスキームで`Authorization`ヘッダーを追加します。
   > 高度な認証設定については、[](client-auth.md)を参照してください。

### Cookie {id="cookies"}
Cookieを送信するには、[cookie](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html)関数を使用します。

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="55-64"}

Ktorは、呼び出し間でCookieを保持できる[HttpCookies](client-cookies.md)プラグインも提供しています。このプラグインがインストールされている場合、`cookie`関数を使用して追加されたCookieは無視されます。

## リクエストボディの設定 {id="body"}
リクエストのボディを設定するには、[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)によって公開されている`setBody`関数を呼び出す必要があります。この関数は、プレーンテキスト、任意のクラスインスタンス、フォームデータ、バイト配列など、さまざまなタイプのペイロードを受け入れます。以下に、いくつかの例を見ていきましょう。

### テキスト {id="text"}
ボディとしてプレーンテキストを送信するには、以下の方法で実装できます。

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### オブジェクト {id="objects"}
[ContentNegotiation](client-serialization.md)プラグインを有効にすると、リクエストボディ内にクラスインスタンスをJSONとして送信できます。これを行うには、`setBody`関数にクラスインスタンスを渡し、[contentType](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html)関数を使用してコンテンツタイプを`application/json`に設定します。

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

詳細については、[](client-serialization.md)ヘルプセクションを参照してください。

### フォームパラメーター {id="form_parameters"}

Ktorクライアントは、`application/x-www-form-urlencoded`タイプのフォームパラメーターを送信するための[`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html)関数を提供します。以下の例は、その使用法を示しています。

* `url`はリクエストを行うためのURLを指定します。
* `formParameters`は`parameters`を使用して構築されたフォームパラメーターのセットです。

```kotlin
```
{src="snippets/client-submit-form/src/main/kotlin/com/example/Application.kt" include-lines="16-25"}

完全な例はこちらにあります：[client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)。

> URLでエンコードされたフォームパラメーターを送信するには、`encodeInQuery`を`true`に設定します。

### ファイルのアップロード {id="upload_file"}

フォームでファイルを送信する必要がある場合は、次のアプローチを使用できます。

- [submitFormWithBinaryData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html)関数を使用します。この場合、境界は自動的に生成されます。
- `post`関数を呼び出し、[MultiPartFormDataContent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html)インスタンスを`setBody`関数に渡します。`MultiPartFormDataContent`コンストラクターでは、境界値を渡すこともできることに注意してください。

どちらのアプローチでも、[formData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html)関数を使用してフォームデータを構築する必要があります。

<tabs>

<tab title="submitFormWithBinaryData">

```kotlin
```
{src="snippets/client-upload/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

</tab>

<tab title="MultiPartFormDataContent">

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="16-33"}

</tab>

</tabs>

`MultiPartFormDataContent`は、次のように境界とコンテンツタイプをオーバーライドすることもできます。

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

完全な例はこちらにあります。
- [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)
- [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)

### バイナリデータ {id="binary"}

`application/octet-stream`コンテンツタイプでバイナリデータを送信するには、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)インスタンスを`setBody`関数に渡します。
例えば、[File.readChannel](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html)関数を使用して、ファイルの読み取りチャネルを開き、それにデータを入力できます。

```kotlin
```
{src="snippets/client-upload-binary-data/src/main/kotlin/com/example/Application.kt" include-lines="14-16"}

完全な例はこちらにあります：[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)。

## 並列リクエスト {id="parallel_requests"}

2つのリクエストを同時に送信する場合、クライアントは最初のリクエストが完了するまで2番目のリクエストの実行を中断します。複数のリクエストを同時に実行する必要がある場合は、[launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)または[async](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)関数を使用できます。以下のコードスニペットは、2つのリクエストを非同期で実行する方法を示しています。
```kotlin
```
{src="snippets/client-parallel-requests/src/main/kotlin/com/example/Application.kt" include-lines="12,19-23,28"}

完全な例は[client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)をご覧ください。

## リクエストのキャンセル {id="cancel-request"}

リクエストをキャンセルする必要がある場合、そのリクエストを実行しているコルーチンをキャンセルできます。
[launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)関数は、実行中のコルーチンをキャンセルするために使用できる`Job`を返します。

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

詳細については、[キャンセルとタイムアウト](https://kotlinlang.org/docs/cancellation-and-timeouts.html)をご覧ください。