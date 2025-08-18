[//]: # (title: 自定义客户端插件)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
了解如何创建您自己的自定义客户端插件。
</link-summary>

从 v2.2.0 开始，Ktor 提供了一个新的 API 来创建自定义客户端[插件](client-plugins.md)。一般来说，此 API 不需要理解 Ktor 内部概念，例如流水线、阶段等。
相反，您可以使用 `onRequest`、`onResponse` 等一组处理器，访问[请求和响应处理](#call-handling)的不同阶段。

## 创建并安装您的第一个插件 {id="first-plugin"}

在本节中，我们将演示如何创建并安装您的第一个插件，该插件会向每个[请求](client-requests.md)添加自定义标头：

1. 要创建插件，请调用 `createClientPlugin` [函数](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html)，并将插件名称作为实参传递：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // 配置插件 ...
   }
   ```
   此函数返回 `ClientPlugin` 实例，该实例将用于安装插件。

2. 要向每个请求追加自定义标头，您可以使用 `onRequest` 处理器，它提供对请求形参的访问：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       onRequest { request, _ ->
           request.headers.append("X-Custom-Header", "Default value")
       }
   }
   
   ```

3. 要[安装插件](client-plugins.md#install)，请将创建的 `ClientPlugin` 实例传递给客户端配置代码块内的 `install` 函数：
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
您可以在这里找到完整示例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。
在以下章节中，我们将探讨如何提供插件配置以及处理请求和响应。

## 提供插件配置 {id="plugin-configuration"}

[上一节](#first-plugin)演示了如何创建插件，该插件会向每个请求追加预定义自定义标头。让我们让这个插件更有用，并提供一个配置，用于传递任何自定义标头名称和值：

1. 首先，您需要定义一个配置类：

   ```kotlin
   class CustomHeaderPluginConfig {
       var headerName: String = "X-Custom-Header"
       var headerValue: String = "Default value"
   }
   ```

2. 要在插件中使用此配置，请将配置类引用传递给 `createClientPlugin`：

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

   鉴于插件配置字段是可变的，建议将其保存在局部变量中。

3. 最后，您可以按如下方式安装和配置插件：

   ```kotlin
   val client = HttpClient(CIO) {
       install(CustomHeaderConfigurablePlugin) {
           headerName = "X-Custom-Header"
           headerValue = "Hello, world!"
       }
   }
   ```

> 您可以在这里找到完整示例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 处理请求和响应 {id="call-handling"}

自定义插件提供对处理请求和响应不同阶段的访问，方法是使用一组专用处理器，例如：
- `onRequest` 和 `onResponse` 分别允许您处理请求和响应。
- `transformRequestBody` 和 `transformResponseBody` 可用于对请求和响应正文应用必要的转换。

还有 `on(...)` 处理器，它允许您调用可能有助于处理调用其他阶段的特定钩子。
下表列出了所有处理器及其执行顺序：

<Tabs>
<TabItem title="基本钩子">

<table>

<tr>
<td>
处理器
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
此处理器为每个 HTTP <Links href="/ktor/client-requests" summary="了解如何发出请求并指定各种请求形参：请求 URL、HTTP 方法、标头和请求正文。">请求</Links>执行，并允许您修改它。
</p>
<p>
<emphasis>
示例：<a href="#example-custom-header">自定义标头</a>
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
允许您转换<a href="#body">请求正文</a>。
在此处理器中，您需要将正文序列化为
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例如，`TextContent`、`ByteArrayContent` 或 `FormDataContent`），
或者如果您的转换不适用，则返回 `null`。
</p>
<p>
<emphasis>
示例：<a href="#data-transformation">数据转换</a>
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
此处理器为每个传入的 HTTP <Links href="/ktor/client-requests" summary="了解如何发出请求并指定各种请求形参：请求 URL、HTTP 方法、标头和请求正文。">响应</Links>执行，并允许您
以各种方式探查它：记录响应、保存 cookie 等。
</p>
<p>
<emphasis>
示例：<a href="#example-log-headers">日志记录标头</a>、<a href="#example-response-time">响应时间</a>
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
允许您转换<a href="#body">响应正文</a>。
此处理器为每个 `HttpResponse.body` 调用而调用。
您需要将正文反序列化为 `requestedType` 的实例，
或者如果您的转换不适用，则返回 `null`。
</p>
<p>
<emphasis>
示例：<a href="#data-transformation">数据转换</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onClose</code>
</td>
<td>
允许您清理此插件分配的资源。
此处理器在客户端[关闭](#close-client)时调用。
</td>
</tr>

</table>

</TabItem>
<TabItem title="所有钩子">

<table>

<tr>
<td>
处理器
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
`SetupRequest` 钩子在请求处理中首先执行。
</td>
</tr>

<snippet id="onRequest">

<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此处理器为每个 HTTP <Links href="/ktor/client-requests" summary="了解如何发出请求并指定各种请求形参：请求 URL、HTTP 方法、标头和请求正文。">请求</Links>执行，并允许您修改它。
</p>
<p>
<emphasis>
示例：<a href="#example-custom-header">自定义标头</a>
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
允许您转换<a href="#body">请求正文</a>。
在此处理器中，您需要将正文序列化为
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例如，`TextContent`、`ByteArrayContent` 或 `FormDataContent`），
或者如果您的转换不适用，则返回 `null`。
</p>
<p>
<emphasis>
示例：<a href="#data-transformation">数据转换</a>
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
`Send` 钩子提供了探查响应并在需要时启动额外请求的能力。
这对于处理重定向、重试请求、身份验证等可能很有用。
</p>
<p>
<emphasis>
示例：<a href="#authentication">身份验证</a>
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
`SendingRequest` 钩子为每个请求执行，
即使它不是由用户发起的。
例如，如果请求导致重定向，`onRequest` 处理器将仅为原始请求执行，而 `on(SendingRequest)` 将为原始请求和重定向请求都执行。
同样，如果您使用 `on(Send)` 发起额外请求，处理器的顺序将如下所示：
</p>
<code-block lang="Console" code="--&gt; onRequest&#10;--&gt; on(Send)&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse"/>
<p>
<emphasis>
示例：<a href="#example-log-headers">日志记录标头</a>、<a href="#example-response-time">响应时间</a>
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
此处理器为每个传入的 HTTP <Links href="/ktor/client-requests" summary="了解如何发出请求并指定各种请求形参：请求 URL、HTTP 方法、标头和请求正文。">响应</Links>执行，并允许您
以各种方式探查它：记录响应、保存 cookie 等。
</p>
<p>
<emphasis>
示例：<a href="#example-log-headers">日志记录标头</a>、<a href="#example-response-time">响应时间</a>
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
允许您转换<a href="#body">响应正文</a>。
此处理器为每个 `HttpResponse.body` 调用而调用。
您需要将正文反序列化为 `requestedType` 的实例，
或者如果您的转换不适用，则返回 `null`。
</p>
<p>
<emphasis>
示例：<a href="#data-transformation">数据转换</a>
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
允许您清理此插件分配的资源。
此处理器在客户端[关闭](#close-client)时调用。
</td>
</tr>

</snippet>

</table>

</TabItem>
</Tabs>

### 共享调用状态 {id="call-state"}

自定义插件允许您共享与调用相关的任何值，以便您可以在处理此调用的任何处理器内部访问此值。
此值以具有唯一键的属性形式存储在 `call.attributes` 集合中。
下面的示例演示了如何使用属性来计算发送请求和接收响应之间的时间：

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

您可以在这里找到完整示例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 访问客户端配置 {id="client-config"}

您可以使用 `client` 属性访问客户端配置，该属性返回 `HttpClient` 实例。
下面的示例展示了如何获取客户端使用的[代理地址](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 示例 {id="examples"}

下面的代码示例演示了自定义插件的几个示例。
您可以在这里找到最终项目：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自定义标头 {id="example-custom-header"}

展示了如何创建向每个请求添加自定义标头的插件：

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

### 日志记录标头 {id="example-log-headers"}

演示了如何创建记录请求和响应标头的插件：

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

### 响应时间 {id="example-response-time"}

展示了如何创建测量发送请求和接收响应之间时间的插件：

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

### 数据转换 {id="data-transformation"}

展示了如何使用 `transformRequestBody` 和 `transformResponseBody` 钩子转换请求和响应正文：

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

您可以在这里找到完整示例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 身份验证 {id="authentication"}

一个 Ktor 示例项目，展示了如何使用 `on(Send)` 钩子，以便在从服务器收到未经授权的响应时，向 `Authorization` 标头添加一个不记名令牌：

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

您可以在这里找到完整示例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。