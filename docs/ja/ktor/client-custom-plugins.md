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

Ktor v2.2.0以降、カスタムクライアント[プラグイン](client-plugins.md)を作成するための新しいAPIが提供されています。一般的に、このAPIはパイプラインやフェーズなどの内部的なKtorの概念を理解する必要はありません。
代わりに、`onRequest`、`onResponse`などの一連のハンドラーを使用して、[リクエストとレスポンスの処理](#call-handling)の異なるステージにアクセスできます。

## 最初のプラグインを作成してインストールする {id="first-plugin"}

このセクションでは、各[リクエスト](client-requests.md)にカスタムヘッダーを追加する最初のプラグインを作成してインストールする方法を説明します。

1.  プラグインを作成するには、[createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html)関数を呼び出し、プラグイン名を引数として渡します。
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        // Configure the plugin ...
    }
    ```

    この関数は、プラグインをインストールするために使用される`ClientPlugin`インスタンスを返します。

2.  各リクエストにカスタムヘッダーを追加するには、リクエストパラメータへのアクセスを提供する`onRequest`ハンドラーを使用できます。
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        onRequest { request, _ ->
            request.headers.append("X-Custom-Header", "Default value")
        }
    }
    
    ```

3.  [プラグインをインストールする](client-plugins.md#install)には、作成した`ClientPlugin`インスタンスをクライアントの設定ブロック内の`install`関数に渡します。
    ```kotlin
    import com.example.plugins.*
    
    val client = HttpClient(CIO) {
        install(CustomHeaderPlugin)
    }
    ```

完全な例はこちらで見つけることができます: [CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。
以下のセクションでは、プラグインの設定を提供し、リクエストとレスポンスを処理する方法を見ていきます。

## プラグインの設定を提供する {id="plugin-configuration"}

[前のセクション](#first-plugin)では、事前に定義されたカスタムヘッダーを各レスポンスに追加するプラグインを作成する方法を示しました。このプラグインをより便利にし、任意のカスタムヘッダー名と値を渡すための設定を提供してみましょう。

1.  まず、設定クラスを定義する必要があります。

    ```kotlin
    class CustomHeaderPluginConfig {
        var headerName: String = "X-Custom-Header"
        var headerValue: String = "Default value"
    }
    ```

2.  この設定をプラグインで使用するには、設定クラスの参照を`createClientPlugin`に渡します。

    ```kotlin
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderConfigurablePlugin = createClientPlugin("CustomHeaderConfigurablePlugin", ::CustomHeaderPluginConfig) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
    
        onRequest { request, _ ->
            request.headers.append(headerName, headerValue)
        }
    }
    ```

    プラグインの設定フィールドは可変であるため、それらをローカル変数に保存することをお勧めします。

3.  最後に、次のようにプラグインをインストールして設定できます。

    ```kotlin
    val client = HttpClient(CIO) {
        install(CustomHeaderConfigurablePlugin) {
            headerName = "X-Custom-Header"
            headerValue = "Hello, world!"
        }
    }
    ```

> 完全な例はこちらで見つけることができます: [CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## リクエストとレスポンスを処理する {id="call-handling"}

カスタムプラグインは、一連の専用ハンドラーを使用して、リクエストとレスポンスを処理する異なるステージへのアクセスを提供します。例えば、次のものがあります。
-   `onRequest`と`onResponse`は、それぞれリクエストとレスポンスを処理することを可能にします。
-   `transformRequestBody`と`transformResponseBody`は、リクエストとレスポンスのボディに必要な変換を適用するために使用できます。

また、`on(...)`ハンドラーもあり、呼び出しの他のステージを処理するのに役立つ特定のフックを呼び出すことができます。
以下の表は、すべてのハンドラーが実行される順序でリストされています。

<Tabs>
<TabItem title="基本的なフック">

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
<code>onRequest</code>
</td>
<td>
<p>
このハンドラーは、各HTTP <Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、ボディなど、さまざまなリクエストパラメータを作成および指定する方法を学びます。">リクエスト</Links>に対して実行され、それを変更することができます。
</p>
<p>
<emphasis>
例: <a href="#example-custom-header">カスタムヘッダー</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>transformRequestBody</code>
</td>
<td>
<p>
<a href="#body">リクエストボディ</a>を変換することを可能にします。
このハンドラーでは、ボディを
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例えば、<code>TextContent</code>、<code>ByteArrayContent</code>、または<code>FormDataContent</code>）にシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: <a href="#data-transformation">データ変換</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
このハンドラーは、各受信HTTP <Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、ボディなど、さまざまなリクエストパラメータを作成および指定する方法を学びます。">レスポンス</Links>に対して実行され、
レスポンスを様々な方法で検査することができます: レスポンスのログ記録、クッキーの保存など。
</p>
<p>
<emphasis>
例: <a href="#example-log-headers">ヘッダーのログ記録</a>、 <a href="#example-response-time">レスポンス時間</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>transformResponseBody</code>
</td>
<td>
<p>
<a href="#body">レスポンスボディ</a>を変換することを可能にします。
このハンドラーは、各<code>HttpResponse.body</code>呼び出しに対して呼び出されます。
ボディを<code>requestedType</code>のインスタンスにデシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: <a href="#data-transformation">データ変換</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onClose</code>
</td>
<td>
このプラグインによって割り当てられたリソースをクリーンアップすることを可能にします。
このハンドラーは、クライアントが<a href="#close-client">閉じられた</a>ときに呼び出されます。
</td>
</tr>

</table>

</TabItem>
<TabItem title="すべてのフック">

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
`SetupRequest`フックは、リクエスト処理で最初に実行されます。
</td>
</tr>

<snippet id="onRequest">

<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
このハンドラーは、各HTTP <Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、ボディなど、さまざまなリクエストパラメータを作成および指定する方法を学びます。">リクエスト</Links>に対して実行され、それを変更することができます。
</p>
<p>
<emphasis>
例: <a href="#example-custom-header">カスタムヘッダー</a>
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
<a href="#body">リクエストボディ</a>を変換することを可能にします。
このハンドラーでは、ボディを
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例えば、<code>TextContent</code>、<code>ByteArrayContent</code>、または<code>FormDataContent</code>）にシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: <a href="#data-transformation">データ変換</a>
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
`Send`フックは、レスポンスを検査し、必要に応じて追加のリクエストを開始する機能を提供します。
これは、リダイレクトの処理、リクエストの再試行、認証などに役立ちます。
</p>
<p>
<emphasis>
例: <a href="#authentication">認証</a>
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
`SendingRequest`フックは、ユーザーによって開始されたものでないリクエストであっても、すべてのリクエストに対して実行されます。
例えば、リクエストがリダイレクトされた場合、`onRequest`ハンドラーは元のリクエストに対してのみ実行されますが、`on(SendingRequest)`は元のリクエストとリダイレクトされたリクエストの両方に対して実行されます。
同様に、追加のリクエストを開始するために`on(Send)`を使用した場合は、ハンドラーは次のように順序付けされます。
</p>
<code-block lang="Console" code="--&gt; onRequest&#10;--&gt; on(Send)&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse"/>
<p>
<emphasis>
例: <a href="#example-log-headers">ヘッダーのログ記録</a>、 <a href="#example-response-time">レスポンス時間</a>
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
このハンドラーは、各受信HTTP <Links href="/ktor/client-requests" summary="リクエストのURL、HTTPメソッド、ヘッダー、ボディなど、さまざまなリクエストパラメータを作成および指定する方法を学びます。">レスポンス</Links>に対して実行され、
レスポンスを様々な方法で検査することができます: レスポンスのログ記録、クッキーの保存など。
</p>
<p>
<emphasis>
例: <a href="#example-log-headers">ヘッダーのログ記録</a>、 <a href="#example-response-time">レスポンス時間</a>
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
<a href="#body">レスポンスボディ</a>を変換することを可能にします。
このハンドラーは、各<code>HttpResponse.body</code>呼び出しに対して呼び出されます。
ボディを<code>requestedType</code>のインスタンスにデシリアライズするか、
変換が適用できない場合は<code>null</code>を返す必要があります。
</p>
<p>
<emphasis>
例: <a href="#data-transformation">データ変換</a>
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
このプラグインによって割り当てられたリソースをクリーンアップすることを可能にします。
このハンドラーは、クライアントが<a href="#close-client">閉じられた</a>ときに呼び出されます。
</td>
</tr>

</snippet>

</table>

</TabItem>
</Tabs>

### 呼び出しの状態を共有する {id="call-state"}

カスタムプラグインは、呼び出しに関連する任意の値を共有できるため、この呼び出しを処理する任意のハンドラー内でこの値にアクセスできます。
この値は、`call.attributes`コレクション内に一意のキーを持つ属性として保存されます。
以下の例は、リクエストの送信からレスポンスの受信までの時間を計算するために属性を使用する方法を示しています。

```kotlin
import io.ktor.client.plugins.api.*
import io.ktor.util.*

val ResponseTimePlugin = createClientPlugin("ResponseTimePlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    on(SendingRequest) { request, content ->
        val onCallTime = System.currentTimeMillis()
        request.attributes.put(onCallTimeKey, onCallTime)
    }

    onResponse { response ->
        val onCallTime = response.call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read response delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}
```

完全な例はこちらで見つけることができます: [ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

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
結果のプロジェクトはこちらで見つけることができます: [client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### カスタムヘッダー {id="example-custom-header"}

各リクエストにカスタムヘッダーを追加するプラグインを作成する方法を示します。

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*

val CustomHeaderConfigurablePlugin = createClientPlugin("CustomHeaderConfigurablePlugin", ::CustomHeaderPluginConfig) {
    val headerName = pluginConfig.headerName
    val headerValue = pluginConfig.headerValue

    onRequest { request, _ ->
        request.headers.append(headerName, headerValue)
    }
}

class CustomHeaderPluginConfig {
    var headerName: String = "X-Custom-Header"
    var headerValue: String = "Default value"
}
```

### ヘッダーのログ記録 {id="example-log-headers"}

リクエストヘッダーとレスポンスヘッダーをログに記録するプラグインを作成する方法を示します。

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*

val LoggingHeadersPlugin = createClientPlugin("LoggingHeadersPlugin") {
    on(SendingRequest) { request, content ->
        println("Request headers:")
        request.headers.entries().forEach { entry ->
            printHeader(entry)
        }
    }

    onResponse { response ->
        println("Response headers:")
        response.headers.entries().forEach { entry ->
            printHeader(entry)
        }
    }
}

private fun printHeader(entry: Map.Entry<String, List<String>>) {
    var headerString = entry.key + ": "
    entry.value.forEach { headerValue ->
        headerString += "${headerValue};"
    }
    println("-> $headerString")
}

```

### レスポンス時間 {id="example-response-time"}

リクエストの送信からレスポンスの受信までの時間を測定するプラグインを作成する方法を示します。

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*
import io.ktor.util.*

val ResponseTimePlugin = createClientPlugin("ResponseTimePlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    on(SendingRequest) { request, content ->
        val onCallTime = System.currentTimeMillis()
        request.attributes.put(onCallTimeKey, onCallTime)
    }

    onResponse { response ->
        val onCallTime = response.call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read response delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}

```

### データ変換 {id="data-transformation"}

`transformRequestBody`と`transformResponseBody`フックを使用して、リクエストとレスポンスのボディを変換する方法を示します。

<Tabs>
<TabItem title="DataTransformation.kt">

```kotlin
package com.example.plugins

import com.example.model.*
import io.ktor.client.plugins.api.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.utils.io.*

val DataTransformationPlugin = createClientPlugin("DataTransformationPlugin") {
    transformRequestBody { request, content, bodyType ->
        if (bodyType?.type == User::class) {
            val user = content as User
            TextContent(text="${user.name};${user.age}", contentType = ContentType.Text.Plain)
        } else {
            null
        }
    }
    transformResponseBody { response, content, requestedType ->
        if (requestedType.type == User::class) {
            val receivedContent = content.readUTF8Line()!!.split(";")
            User(receivedContent[0], receivedContent[1].toInt())
        } else {
            content
        }
    }
}

```

</TabItem>
<TabItem title="Application.kt">

```kotlin
package com.example

import com.example.model.*
import com.example.plugins.*
import com.example.server.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.*

fun main() {
    startServer()
    runBlocking {
        val client = HttpClient(CIO) {
            install(DataTransformationPlugin)
        }
        val bodyAsText = client.post("http://0.0.0.0:8080/post-data") {
            setBody(User("John", 42))
        }.bodyAsText()
        val user = client.get("http://0.0.0.0:8080/get-data").body<User>()
        println("Userinfo: $bodyAsText")
        println("Username: ${user.name}, age: ${user.age}")
    }
}

```

</TabItem>
<TabItem title="User.kt">

```kotlin
package com.example.model

data class User(val name: String, val age: Int)

```

</TabItem>
</Tabs>

完全な例はこちらで見つけることができます: [client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 認証 {id="authentication"}

サーバーから認証されていないレスポンスが返された場合に、`on(Send)`フックを使用して`Authorization`ヘッダーにベアラートークンを追加する方法を示すサンプルKtorプロジェクトです。

<Tabs>
<TabItem title="Auth.kt">

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*
import io.ktor.http.*

val AuthPlugin = createClientPlugin("AuthPlugin", ::AuthPluginConfig) {
    val token = pluginConfig.token

    on(Send) { request ->
        val originalCall = proceed(request)
        originalCall.response.run { // this: HttpResponse
            if(status == HttpStatusCode.Unauthorized && headers["WWW-Authenticate"]!!.contains("Bearer")) {
                request.headers.append("Authorization", "Bearer $token")
                proceed(request)
            } else {
                originalCall
            }
        }
    }
}

class AuthPluginConfig {
    var token: String = ""
}

```

</TabItem>
<TabItem title="Application.kt">

```kotlin
package com.example

import com.example.plugins.*
import com.example.server.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.*

fun main() {
    startServer()
    runBlocking {
        val client = HttpClient(CIO) {
            install(AuthPlugin) {
                token = "abc123"
            }
        }
        val response = client.get("http://0.0.0.0:8080/")
        println(response.bodyAsText())
    }
}

```

</TabItem>
</Tabs>

完全な例はこちらで見つけることができます: [client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。