[//]: # (title: カスタムクライアントプラグイン)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
独自のカスタムクライアントプラグインを作成する方法を学びます。
</link-summary>

v2.2.0 から、Ktor はカスタムクライアント[プラグイン](client-plugins.md)を作成するための新しいAPIを提供します。一般的に、このAPIはパイプライン、フェーズなどの内部 Ktor コンセプトを理解する必要がありません。代わりに、`onRequest`、`onResponse`などの一連のハンドラーを使用して、[リクエストとレスポンスの処理](#call-handling)の様々なステージにアクセスできます。

## 最初のプラグインを作成してインストールする {id="first-plugin"}

このセクションでは、各[リクエスト](client-requests.md)にカスタムヘッダーを追加する最初のプラグインを作成およびインストールする方法を示します。

1.  プラグインを作成するには、[createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 関数を呼び出し、引数としてプラグイン名を渡します。
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        // Configure the plugin ...
    }
    ```
    
    この関数は、プラグインのインストールに使用される `ClientPlugin` インスタンスを返します。

2.  各リクエストにカスタムヘッダーを付加するには、リクエストパラメーターにアクセスできる `onRequest` ハンドラーを使用できます。
    ```kotlin
    ```
    {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

3.  [プラグインをインストールする](client-plugins.md#install)には、作成した `ClientPlugin` インスタンスをクライアントの設定ブロック内の `install` 関数に渡します。
    ```kotlin
    import com.example.plugins.*
    
    val client = HttpClient(CIO) {
        install(CustomHeaderPlugin)
    }
    ```
    
    
完全な例はこちらで確認できます: [CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。
以下のセクションでは、プラグイン設定の提供とリクエストおよびレスポンスの処理について説明します。

## プラグイン設定を提供する {id="plugin-configuration"}

[前のセクション](#first-plugin)では、事前定義されたカスタムヘッダーを各レスポンスに付加するプラグインの作成方法を示しました。このプラグインをより便利にし、任意のカスタムヘッダー名と値を渡すための設定を提供しましょう。

1.  まず、設定クラスを定義する必要があります。

    ```kotlin
    ```
    {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="14-17"}

2.  この設定をプラグインで使用するには、設定クラスの参照を `createApplicationPlugin` に渡します。

    ```kotlin
    ```
    {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="3-12"}

    プラグイン設定フィールドはミュータブルであるため、ローカル変数に保存することをお勧めします。

3.  最後に、次のようにプラグインをインストールおよび設定できます。

    ```kotlin
    ```
    {src="snippets/client-custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-15,18"}

> 完全な例はこちらで確認できます: [CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## リクエストとレスポンスを処理する {id="call-handling"}

カスタムプラグインは、リクエストとレスポンスの処理の様々なステージに、一連の専用ハンドラーを使用してアクセスできるようにします。例:
- `onRequest` と `onResponse` は、それぞれリクエストとレスポンスを処理できるようにします。
- `transformRequestBody` と `transformResponseBody` は、リクエストおよびレスポンスボディに必要な変換を適用するために使用できます。

また、`on(...)` ハンドラーもあり、これはコールに関する他のステージを処理するのに役立つ可能性のある特定のフックを呼び出すことができます。
以下のテーブルは、実行される順序ですべてのハンドラーをリストしています。

<tabs>
<tab title="基本的なフック">

<table>
<tr>
<td>
ハンドラー
</td>
<td>
説明
</td>
</tr>

<include from="client-custom-plugins.md" element-id="onRequest"/>
<include from="client-custom-plugins.md" element-id="transformRequestBody"/>
<include from="client-custom-plugins.md" element-id="onResponse"/>
<include from="client-custom-plugins.md" element-id="transformResponseBody"/>
<include from="client-custom-plugins.md" element-id="onClose"/>

</table>

</tab>
<tab title="すべてのフック">

<table>
<tr>
<td>
ハンドラー
</td>
<td>
説明
</td>
</tr>

<tr>
<td>
<code>on(SetupRequest)</code>
</td>
<td>
<code>SetupRequest</code> フックは、リクエスト処理で最初に実行されます。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
このハンドラーは、各HTTP [リクエスト](client-requests.md)に対して実行され、それを変更できます。
</p>
<p>
<emphasis>
例: <a anchor="example-custom-header"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformRequestBody">
<tr>
<td>
<code>transformRequestBody</code>
</td>
<td>
<p>
[リクエストボディ](client-requests.md#body)を変換できるようにします。
このハンドラーでは、ボディを
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
(例: <code>TextContent</code>、<code>ByteArrayContent</code>、<code>FormDataContent</code>)
にシリアライズするか、変換が適用できない場合は <code>null</code> を返す必要があります。
</p>
<p>
<emphasis>
例: <a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<tr>
<td>
<code>on(Send)</code>
</td>
<td>
<p>
<code>Send</code> フックは、レスポンスを検査し、必要に応じて追加のリクエストを開始する機能を提供します。
これは、リダイレクト、リクエストの再試行、認証などの処理に役立ちます。
</p>
<p>
<emphasis>
例: <a anchor="authentication"/>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>on(SendingRequest)</code>
</td>
<td>
<p>
<code>SendingRequest</code> フックは、ユーザーによって開始されたものでない場合でも、すべてのリクエストに対して実行されます。
たとえば、リクエストがリダイレクトにつながる場合、<code>onRequest</code> ハンドラーは元のリクエストに対してのみ実行されますが、
<code>on(SendingRequest)</code> は元のリクエストとリダイレクトされたリクエストの両方に対して実行されます。
同様に、<code>on(Send)</code> を使用して追加のリクエストを開始した場合、
ハンドラーは次のように順序付けられます。
</p>

```Console
--> onRequest
--> on(Send)
--> on(SendingRequest)
<-- onResponse
--> on(SendingRequest)
<-- onResponse
```

<p>
<emphasis>
例: <a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>

<snippet id="onResponse">
<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
このハンドラーは、各受信HTTP [レスポンス](client-requests.md)に対して実行され、
レスポンスのログ記録、クッキーの保存など、様々な方法で検査できるようにします。
</p>
<p>
<emphasis>
例: <a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformResponseBody">
<tr>
<td>
<code>transformResponseBody</code>
</td>
<td>
<p>
[レスポンスボディ](client-responses.md#body)を変換できるようにします。
このハンドラーは、各 <code>HttpResponse.body</code> 呼び出しに対して呼び出されます。
ボディを <code>requestedType</code> のインスタンスにデシリアライズするか、
変換が適用できない場合は <code>null</code> を返す必要があります。
</p>
<p>
<emphasis>
例: <a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="onClose">
<tr>
<td>
<code>onClose</code>
</td>
<td>
このプラグインによって割り当てられたリソースをクリーンアップできます。
このハンドラーはクライアントが[クローズ](client-create-and-configure.md#close-client)されたときに呼び出されます。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### コール状態を共有する {id="call-state"}

カスタムプラグインは、コールに関連する任意の値を共有できるため、このコールを処理する任意のハンドラー内でこの値にアクセスできます。
この値は、一意のキーを持つ属性として `call.attributes` コレクションに保存されます。
以下の例は、属性を使用してリクエストの送信からレスポンスの受信までの時間を計算する方法を示しています。

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt" include-lines="3-18"}

完全な例はこちらで確認できます: [ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## クライアント設定にアクセスする {id="client-config"}

`client` プロパティを使用してクライアント設定にアクセスできます。これは [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) インスタンスを返します。
以下の例は、クライアントが使用する[プロキシアドレス](client-proxy.md)を取得する方法を示しています。

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 例 {id="examples"}

以下のコードサンプルは、カスタムプラグインのいくつかの例を示しています。
結果のプロジェクトは[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)で確認できます。

### カスタムヘッダー {id="example-custom-header"}

各リクエストにカスタムヘッダーを追加するプラグインを作成する方法を示します。

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt"}

### ヘッダーのロギング {id="example-log-headers"}

リクエストとレスポンスのヘッダーをログに記録するプラグインを作成する方法を示します。

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/LoggingHeaders.kt"}

### レスポンス時間 {id="example-response-time"}

リクエストの送信からレスポンスの受信までの時間を測定するプラグインを作成する方法を示します。

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt"}

### データ変換 {id="data-transformation"}

`transformRequestBody` と `transformResponseBody` フックを使用してリクエストおよびレスポンスボディを変換する方法を示します。

<tabs>
<tab title="DataTransformation.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/plugins/DataTransformation.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="User.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/model/User.kt"}

</tab>
</tabs>

完全な例はこちらで確認できます: [client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 認証 {id="authentication"}

サーバーから未承認のレスポンスが受信された場合に、`on(Send)` フックを使用して `Authorization` ヘッダーにベアラー（bearer）トークンを追加する方法を示す Ktor サンプルプロジェクトです。

<tabs>
<tab title="Auth.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/plugins/Auth.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

完全な例はこちらで確認できます: [client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。