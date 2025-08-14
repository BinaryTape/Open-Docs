[//]: # (title: カスタムクライアントプラグイン)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
独自のカスタムクライアントプラグインを作成する方法を学びます。
</link-summary>

v2.2.0以降、Ktorはカスタムクライアント[プラグイン](client-plugins.md)を作成するための新しいAPIを提供しています。一般的に、このAPIはパイプラインやフェーズなどのKtor内部の概念を理解する必要はありません。
代わりに、`onRequest`や`onResponse`などの一連のハンドラーを使用して、[リクエストとレスポンスの処理](#call-handling)のさまざまなステージにアクセスできます。

## 最初のプラグインを作成してインストールする {id="first-plugin"}

このセクションでは、各[リクエスト](client-requests.md)にカスタムヘッダーを追加する最初のプラグインを作成してインストールする方法を示します。

1.  プラグインを作成するには、[createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html)関数を呼び出し、プラグイン名を引数として渡します。
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        // Configure the plugin ...
    }
    ```
    
    この関数は、プラグインをインストールするために使用される`ClientPlugin`インスタンスを返します。

2.  各リクエストにカスタムヘッダーを追加するには、リクエストパラメーターへのアクセスを提供する`onRequest`ハンドラーを使用できます。
    [object Promise]

3.  プラグインを[インストール](client-plugins.md#install)するには、作成した`ClientPlugin`インスタンスをクライアントの設定ブロック内の`install`関数に渡します。
    ```kotlin
    import com.example.plugins.*
    
    val client = HttpClient(CIO) {
        install(CustomHeaderPlugin)
    }
    ```
    
    
完全な例は[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)にあります。以下のセクションでは、プラグインの設定を提供し、リクエストとレスポンスを処理する方法について説明します。

## プラグイン設定を提供する {id="plugin-configuration"}

[前のセクション](#first-plugin)では、事前定義されたカスタムヘッダーを各レスポンスに追加するプラグインを作成する方法を示しました。このプラグインをより便利にするために、任意のカスタムヘッダー名と値を渡すための設定を提供しましょう。

1.  まず、設定クラスを定義する必要があります。

    [object Promise]

2.  この設定をプラグインで使用するには、設定クラスの参照を`createApplicationPlugin`に渡します。

    [object Promise]

    プラグイン設定フィールドは可変であるため、ローカル変数に保存することをお勧めします。

3.  最後に、次のようにプラグインをインストールおよび設定できます。

    [object Promise]

> 完全な例は[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)にあります。

## リクエストとレスポンスを処理する {id="call-handling"}

カスタムプラグインは、一連の専用ハンドラーを使用して、リクエストとレスポンスの処理のさまざまなステージへのアクセスを提供します。例えば:
- `onRequest`と`onResponse`は、それぞれリクエストとレスポンスを処理できます。
- `transformRequestBody`と`transformResponseBody`は、リクエストとレスポンスのボディに必要な変換を適用するために使用できます。

また、呼び出しの他のステージを処理するのに役立つ可能性のある特定のフックを呼び出すことができる`on(...)`ハンドラーもあります。
以下の表は、すべてのハンドラーが実行される順序でリストされています。

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

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
このハンドラーは各HTTP <Links href="/ktor/client-requests" summary="リクエストURL、HTTPメソッド、ヘッダー、リクエストのボディなど、さまざまなリクエストパラメーターを作成し指定する方法を学びます。">リクエスト</Links>に対して実行され、それを変更できます。
</p>
<p>
<emphasis>
例: undefined
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
<a href="#body">リクエストボディ</a>を変換できます。
このハンドラーでは、ボディを
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
（例えば、<code>TextContent</code>、<code>ByteArrayContent</code>、または<code>FormDataContent</code>）にシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: undefined
</emphasis>
</p>
</td>
</tr>
</snippet>
<snippet id="onResponse">
<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
このハンドラーは各HTTP <Links href="/ktor/client-requests" summary="リクエストURL、HTTPメソッド、ヘッダー、リクエストのボディなど、さまざまなリクエストパラメーターを作成し指定する方法を学びます。">レスポンス</Links>に対して実行され、
レスポンスのログ記録、クッキーの保存など、さまざまな方法で検査できます。
</p>
<p>
<emphasis>
例: undefined, undefined
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
<a href="#body">レスポンスボディ</a>を変換できます。
このハンドラーは<code>HttpResponse.body</code>の呼び出しごとに起動されます。
ボディを<code>requestedType</code>のインスタンスにデシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: undefined
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
このハンドラーはクライアントが<a href="#close-client">閉じられた</a>ときに呼び出されます。
</td>
</tr>
</snippet>

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
<code>SetupRequest</code>フックはリクエスト処理で最初に実行されます。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
このハンドラーは各HTTP <Links href="/ktor/client-requests" summary="リクエストURL、HTTPメソッド、ヘッダー、リクエストのボディなど、さまざまなリクエストパラメーターを作成し指定する方法を学びます。">リクエスト</Links>に対して実行され、それを変更できます。
</p>
<p>
<emphasis>
例: undefined
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
<a href="#body">リクエストボディ</a>を変換できます。
このハンドラーでは、ボディを
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
（例えば、<code>TextContent</code>、<code>ByteArrayContent</code>、または<code>FormDataContent</code>）にシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: undefined
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
<code>Send</code>フックは、レスポンスを検査し、必要に応じて追加のリクエストを開始する機能を提供します。
これは、リダイレクトの処理、リクエストの再試行、認証などに役立つ場合があります。
</p>
<p>
<emphasis>
例: undefined
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
<code>SendingRequest</code>フックは、ユーザーによって開始されたものでなくても、すべてのリクエストに対して実行されます。
例えば、リクエストがリダイレクトされた場合、<code>onRequest</code>ハンドラーは元のリクエストに対してのみ実行されますが、<code>on(SendingRequest)</code>は元のリクエストとリダイレクトされたリクエストの両方に対して実行されます。
同様に、<code>on(Send)</code>を使用して追加のリクエストを開始した場合、ハンドラーは次のように順序付けされます。
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
例: undefined, undefined
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
このハンドラーは各HTTP <Links href="/ktor/client-requests" summary="リクエストURL、HTTPメソッド、ヘッダー、リクエストのボディなど、さまざまなリクエストパラメーターを作成し指定する方法を学びます。">レスポンス</Links>に対して実行され、
レスポンスのログ記録、クッキーの保存など、さまざまな方法で検査できます。
</p>
<p>
<emphasis>
例: undefined, undefined
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
<a href="#body">レスポンスボディ</a>を変換できます。
このハンドラーは<code>HttpResponse.body</code>の呼び出しごとに起動されます。
ボディを<code>requestedType</code>のインスタンスにデシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: undefined
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
このハンドラーはクライアントが<a href="#close-client">閉じられた</a>ときに呼び出されます。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 呼び出しの状態を共有する {id="call-state"}

カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、その呼び出しを処理する任意のハンドラー内でこの値にアクセスできます。この値は、`call.attributes`コレクション内に一意のキーを持つ属性として保存されます。以下の例は、属性を使用してリクエストの送信とレスポンスの受信の間の時間を計算する方法を示しています。

[object Promise]

完全な例は[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)にあります。

## クライアント設定にアクセスする {id="client-config"}

`client`プロパティを使用してクライアント設定にアクセスできます。これは[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)インスタンスを返します。
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
結果のプロジェクトは[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)にあります。

### カスタムヘッダー {id="example-custom-header"}

各リクエストにカスタムヘッダーを追加するプラグインを作成する方法を示します。

[object Promise]

### ヘッダーのログ記録 {id="example-log-headers"}

リクエストとレスポンスのヘッダーをログに記録するプラグインを作成する方法を示します。

[object Promise]

### レスポンスタイム {id="example-response-time"}

リクエストの送信とレスポンスの受信の間の時間を測定するプラグインを作成する方法を示します。

[object Promise]

### データ変換 {id="data-transformation"}

`transformRequestBody`と`transformResponseBody`フックを使用して、リクエストとレスポンスのボディを変換する方法を示します。

<tabs>
<tab title="DataTransformation.kt">

[object Promise]

</tab>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="User.kt">

[object Promise]

</tab>
</tabs>

完全な例は[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)にあります。

### 認証 {id="authentication"}

サーバーから不正なレスポンスが受信された場合に、`on(Send)`フックを使用して`Authorization`ヘッダーにベアラー（Bearer）トークンを追加する方法を示すKtorプロジェクトのサンプルです。

<tabs>
<tab title="Auth.kt">

[object Promise]

</tab>
<tab title="Application.kt">

[object Promise]

</tab>
</tabs>

完全な例は[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)にあります。