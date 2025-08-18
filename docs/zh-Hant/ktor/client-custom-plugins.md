[//]: # (title: 客戶端自訂外掛)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
了解如何建立您自己的自訂客戶端外掛。
</link-summary>

從 v2.2.0 開始，Ktor 提供了一組新的 API，用於建立自訂客戶端[外掛](client-plugins.md)。一般而言，此 API 不需要瞭解 Ktor 內部概念，例如 pipelines、phases 等等。相反地，您可以使用一組處理常式（例如 `onRequest`、`onResponse` 等等），存取[處理請求和回應](#call-handling)的不同階段。

## 建立並安裝您的第一個外掛 {id="first-plugin"}

在本節中，我們將展示如何建立並安裝您的第一個外掛，該外掛會為每個[請求](client-requests.md)新增自訂標頭：

1.  若要建立外掛，請呼叫 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 函式並傳入外掛名稱作為引數：
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        // 設定外掛...
    }
    ```
    
    此函式會傳回 `ClientPlugin` 實例，該實例將用於安裝外掛。

2.  若要為每個請求附加自訂標頭，您可以使用 `onRequest` 處理常式，它提供對請求參數的存取：
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        onRequest { request, _ ->
            request.headers.append("X-Custom-Header", "Default value")
        }
    }
    
    ```

3.  若要[安裝外掛](client-plugins.md#install)，請將建立的 `ClientPlugin` 實例傳遞給客戶端設定區塊內的 `install` 函式：
    ```kotlin
    import com.example.plugins.*
    
    val client = HttpClient(CIO) {
        install(CustomHeaderPlugin)
    }
    ```
    
    
您可以在此處找到完整範例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。在以下章節中，我們將探討如何提供外掛設定以及處理請求和回應。

## 提供外掛設定 {id="plugin-configuration"}

[上一節](#first-plugin)展示了如何建立一個外掛，該外掛會為每個回應附加預定義的自訂標頭。讓我們使這個外掛更有用，並提供一個設定，用於傳遞任何自訂標頭名稱和值：

1.  首先，您需要定義一個設定類別：

    ```kotlin
    class CustomHeaderPluginConfig {
        var headerName: String = "X-Custom-Header"
        var headerValue: String = "Default value"
    }
    ```

2.  若要在外掛中使用此設定，請將設定類別參考傳遞給 `createApplicationPlugin`：

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

    鑑於外掛設定欄位是可變的，建議將它們儲存到區域變數中。

3.  最後，您可以如下所示安裝並設定此外掛：

    ```kotlin
    val client = HttpClient(CIO) {
        install(CustomHeaderConfigurablePlugin) {
            headerName = "X-Custom-Header"
            headerValue = "Hello, world!"
        }
    }
    ```

> 您可以在此處找到完整範例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 處理請求和回應 {id="call-handling"}

自訂外掛使用一組專用處理常式，提供對處理請求和回應不同階段的存取，例如：
-   `onRequest` 和 `onResponse` 分別允許您處理請求和回應。
-   `transformRequestBody` 和 `transformResponseBody` 可用於對請求和回應主體應用必要的轉換。

還有 `on(...)` 處理常式，它允許您呼叫特定的掛鉤 (hook)，這對於處理呼叫的其他階段可能很有用。
下表列出了所有處理常式及其執行順序：

<Tabs>
<TabItem title="基本掛鉤">

<table>

<tr>
<td>
處理常式
</td>
<td>
描述
</td>
</tr>

<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此處理常式會對每個 HTTP <Links href="/ktor/client-requests" summary="了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求的主體。">請求</Links>執行，並允許您修改它。
</p>
<p>
<emphasis>
範例：<a href="#example-custom-header">自訂標頭</a>
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
允許您轉換<a href="#body">請求主體</a>。
在此處理常式中，您需要將主體序列化為
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
(例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>)
或者，如果您的轉換不適用，則傳回 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a href="#data-transformation">資料轉換</a>
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
此處理常式會對每個傳入的 HTTP <Links href="/ktor/client-requests" summary="了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求的主體。">回應</Links>執行，並允許您以各種方式檢查它：記錄回應、儲存 Cookie 等等。
</p>
<p>
<emphasis>
範例：<a href="#example-log-headers">記錄標頭</a>、<a href="#example-response-time">回應時間</a>
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
允許您轉換<a href="#body">回應主體</a>。
每次呼叫 <code>HttpResponse.body</code> 時，此處理常式都會被呼叫。
您需要將主體解序列化為 <code>requestedType</code> 的實例
或者，如果您的轉換不適用，則傳回 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a href="#data-transformation">資料轉換</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onClose</code>
</td>
<td>
允許您清理此外掛所分配的資源。
當客戶端<a href="#close-client">關閉</a>時，會呼叫此處理常式。
</td>
</tr>

</table>

</TabItem>
<TabItem title="所有掛鉤">

<table>

<tr>
<td>
處理常式
</td>
<td>
描述
</td>
</tr>

<tr>
<td>
<code>on(SetupRequest)</code>
</td>
<td>
在請求處理中，<code>SetupRequest</code> 掛鉤會最先執行。
</td>
</tr>

<snippet id="onRequest">

<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此處理常式會對每個 HTTP <Links href="/ktor/client-requests" summary="了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求的主體。">請求</Links>執行，並允許您修改它。
</p>
<p>
<emphasis>
範例：<a href="#example-custom-header">自訂標頭</a>
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
允許您轉換<a href="#body">請求主體</a>。
在此處理常式中，您需要將主體序列化為
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
(例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>)
或者，如果您的轉換不適用，則傳回 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a href="#data-transformation">資料轉換</a>
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
<code>Send</code> 掛鉤提供檢查回應並在需要時啟動額外請求的能力。
這對於處理重新導向、重試請求、驗證等等可能很有用。
</p>
<p>
<emphasis>
範例：<a href="#authentication">驗證</a>
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
即使請求不是由使用者啟動，<code>SendingRequest</code> 掛鉤也會對每個請求執行。
例如，如果請求導致重新導向，則 <code>onRequest</code> 處理常式只會對原始請求執行，而 <code>on(SendingRequest)</code> 則會對原始請求和重新導向的請求都執行。
同樣地，如果您使用 <code>on(Send)</code> 啟動額外請求，處理常式將按以下順序排列：
</p>
<code-block lang="Console" code="--&gt; onRequest&#10;--&gt; on(Send)&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse"/>
<p>
<emphasis>
範例：<a href="#example-log-headers">記錄標頭</a>、<a href="#example-response-time">回應時間</a>
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
此處理常式會對每個傳入的 HTTP <Links href="/ktor/client-requests" summary="了解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求的主體。">回應</Links>執行，並允許您以各種方式檢查它：記錄回應、儲存 Cookie 等等。
</p>
<p>
<emphasis>
範例：<a href="#example-log-headers">記錄標頭</a>、<a href="#example-response-time">回應時間</a>
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
允許您轉換<a href="#body">回應主體</a>。
每次呼叫 <code>HttpResponse.body</code> 時，此處理常式都會被呼叫。
您需要將主體解序列化為 <code>requestedType</code> 的實例
或者，如果您的轉換不適用，則傳回 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a href="#data-transformation">資料轉換</a>
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
允許您清理此外掛所分配的資源。
當客戶端<a href="#close-client">關閉</a>時，會呼叫此處理常式。
</td>
</tr>

</snippet>

</table>

</TabItem>
</Tabs>

### 共用呼叫狀態 {id="call-state"}

自訂外掛允許您共用與呼叫相關的任何值，以便您能夠在任何處理此呼叫的處理常式內部存取此值。此值會儲存為在 `call.attributes` 集合中帶有唯一的鍵的屬性。以下範例展示了如何使用屬性計算傳送請求和接收回應之間的時間：

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

在此處可以找到完整範例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 存取客戶端設定 {id="client-config"}

您可以使用 `client` 屬性存取您的客戶端設定，它會傳回 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 實例。以下範例展示了如何取得客戶端使用的[代理位址](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 範例 {id="examples"}

以下程式碼範例展示了自訂外掛的幾個範例。您可以在此處找到最終專案：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自訂標頭 {id="example-custom-header"}

展示如何建立為每個請求新增自訂標頭的外掛：

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

### 記錄標頭 {id="example-log-headers"}

展示如何建立記錄請求和回應標頭的外掛：

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

### 回應時間 {id="example-response-time"}

展示如何建立測量傳送請求和接收回應之間時間的外掛：

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

### 資料轉換 {id="data-transformation"}

展示如何使用 `transformRequestBody` 和 `transformResponseBody` 掛鉤轉換請求和回應主體：

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

在此處可以找到完整範例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 驗證 {id="authentication"}

一個 Ktor 範例專案，展示如何使用 `on(Send)` 掛鉤，在從伺服器收到未經授權的回應時，將承載權杖新增到 `Authorization` 標頭：

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

在此處可以找到完整範例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。