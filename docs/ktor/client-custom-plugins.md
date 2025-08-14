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

从 v2.2.0 开始，Ktor 提供了一个新的 API，用于创建自定义客户端[插件](client-plugins.md)。通常，此 API 不需要理解 Ktor 的内部概念，例如 pipelines、phases 等。
相反，您可以使用一组处理器（例如 `onRequest`、`onResponse` 等）访问[处理请求和响应](#call-handling)的不同阶段。

## 创建并安装您的第一个插件 {id="first-plugin"}

在本节中，我们将演示如何创建并安装您的第一个插件，该插件会为每个[请求](client-requests.md)添加一个自定义请求头：

1. 要创建插件，请调用 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 函数，并将插件名称作为实参传入：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // 配置插件 ...
   }
   ```
   
   此函数返回 `ClientPlugin` 实例，该实例将用于安装插件。

2. 要为每个请求追加自定义请求头，您可以使用 `onRequest` 处理器，它提供对请求参数的访问：
   [object Promise]

3. 要[安装插件](client-plugins.md#install)，请将创建的 `ClientPlugin` 实例传递给客户端配置块内的 `install` 函数：
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
您可以在此处找到完整示例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。
在以下各节中，我们将探讨如何提供插件配置以及处理请求和响应。

## 提供插件配置 {id="plugin-configuration"}

[上一节](#first-plugin)演示了如何创建一个为每个响应追加预定义自定义请求头的插件。现在，让我们让这个插件更实用，并提供一个配置，用于传递任何自定义请求头名称和值：

1. 首先，您需要定义一个配置类：

   [object Promise]

2. 要在插件中使用此配置，请将配置类引用传递给 `createApplicationPlugin`：

   [object Promise]

   鉴于插件配置字段是可变的，建议将它们保存在局部变量中。

3. 最后，您可以按如下方式安装和配置插件：

   [object Promise]

> 您可以在此处找到完整示例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 处理请求和响应 {id="call-handling"}

自定义插件使用一组专用处理器，提供对处理请求和响应不同阶段的访问，例如：
- `onRequest` 和 `onResponse` 分别允许您处理请求和响应。
- `transformRequestBody` 和 `transformResponseBody` 可用于对请求体和响应体应用必要的转换。

还有一个 `on(...)` 处理器，它允许您调用可能有助于处理调用其他阶段的特定钩子。
下表列出了所有处理器及其执行顺序：

<tabs>
<tab title="基本钩子">

<table>
<tr>
<td>
处理器
</td>
<td>
描述
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此处理器会为每个 HTTP <Links href="/ktor/client-requests" summary="了解如何发起请求并指定各种请求参数：请求 URL、HTTP 方法、请求头以及请求体。">请求</Links>执行，并允许您对其进行修改。
</p>
<p>
<emphasis>
示例：未定义
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
允许您转换<a href="#body">请求体</a>。
在此处理器中，您需要将请求体序列化为
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>），
如果您的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：未定义
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
此处理器会为每个传入的 HTTP <Links href="/ktor/client-requests" summary="了解如何发起请求并指定各种请求参数：请求 URL、HTTP 方法、请求头以及请求体。">响应</Links>执行，并允许您
以各种方式探查它：记录响应、保存 cookie 等等。
</p>
<p>
<emphasis>
示例：未定义，未定义
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
允许您转换<a href="#body">响应体</a>。
此处理器在每次 <code>HttpResponse.body</code> 调用时被调用。
您需要将响应体反序列化为 <code>requestedType</code> 的实例，
如果您的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：未定义
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
当客户端<a href="#close-client">关闭</a>时，此处理器被调用。
</td>
</tr>
</snippet>

</table>

</tab>
<tab title="所有钩子">

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
<code>SetupRequest</code> 钩子在请求处理中首先执行。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此处理器会为每个 HTTP <Links href="/ktor/client-requests" summary="了解如何发起请求并指定各种请求参数：请求 URL、HTTP 方法、请求头以及请求体。">请求</Links>执行，并允许您对其进行修改。
</p>
<p>
<emphasis>
示例：未定义
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
允许您转换<a href="#body">请求体</a>。
在此处理器中，您需要将请求体序列化为
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
（例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>），
如果您的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：未定义
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
<code>Send</code> 钩子提供了探查响应并在需要时发起额外请求的能力。
这对于处理重定向、重试请求、认证等等可能很有用。
</p>
<p>
<emphasis>
示例：未定义
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
<code>SendingRequest</code> 钩子会为每个请求执行，
即使它不是由用户发起的。
例如，如果一个请求导致重定向，<code>onRequest</code> 处理器将仅为原始请求执行，而 <code>on(SendingRequest)</code> 将为原始请求和重定向请求都执行。
类似地，如果您使用 <code>on(Send)</code> 发起了一个额外请求，
处理器将按以下顺序执行：
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
示例：未定义，未定义
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
此处理器会为每个传入的 HTTP <Links href="/ktor/client-requests" summary="了解如何发起请求并指定各种请求参数：请求 URL、HTTP 方法、请求头以及请求体。">响应</Links>执行，并允许您
以各种方式探查它：记录响应、保存 cookie 等等。
</p>
<p>
<emphasis>
示例：未定义，未定义
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
允许您转换<a href="#body">响应体</a>。
此处理器在每次 <code>HttpResponse.body</code> 调用时被调用。
您需要将响应体反序列化为 <code>requestedType</code> 的实例，
如果您的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：未定义
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
当客户端<a href="#close-client">关闭</a>时，此处理器被调用。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 共享调用状态 {id="call-state"}

自定义插件允许您共享与调用相关的任何值，以便您可以在处理此调用的任何处理器内部访问此值。
此值作为具有唯一键的属性存储在 `call.attributes` 集合中。
下面的示例演示了如何使用属性来计算发送请求和接收响应之间的时间：

[object Promise]

您可以在此处找到完整示例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 访问客户端配置 {id="client-config"}

您可以使用 `client` 属性访问客户端配置，该属性返回 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 实例。
下面的示例展示了如何获取客户端使用的[代理地址](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("代理地址: $proxyAddress")
}
```

## 示例 {id="examples"}

下面的代码示例演示了自定义插件的几个示例。
您可以在此处找到最终项目：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自定义请求头 {id="example-custom-header"}

展示了如何创建插件以向每个请求添加自定义请求头：

[object Promise]

### 记录请求头 {id="example-log-headers"}

演示了如何创建记录请求头和响应头的插件：

[object Promise]

### 响应时间 {id="example-response-time"}

展示了如何创建测量发送请求和接收响应之间时间的插件：

[object Promise]

### 数据转换 {id="data-transformation"}

展示了如何使用 `transformRequestBody` 和 `transformResponseBody` 钩子来转换请求体和响应体：

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

您可以在此处找到完整示例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 认证 {id="authentication"}

一个 Ktor 示例项目，展示了如何在从服务器收到未经授权的响应时，使用 `on(Send)` 钩子向 `Authorization` 请求头添加 Bearer 令牌：

<tabs>
<tab title="Auth.kt">

[object Promise]

</tab>
<tab title="Application.kt">

[object Promise]

</tab>
</tabs>

您可以在此处找到完整示例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。