[//]: # (title: 自定义客户端插件)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
学习如何创建自己的自定义客户端插件。
</link-summary>

从 v2.2.0 开始，Ktor 提供了一个新的 API，用于创建自定义客户端[插件](client-plugins.md)。通常，此 API 不需要理解 Ktor 的内部概念，例如 pipelines、phases 等。相反，你可以使用一组处理器（例如 `onRequest`、`onResponse` 等）访问[处理请求和响应](#call-handling)的不同阶段。

## 创建并安装你的第一个插件 {id="first-plugin"}

在本节中，我们将演示如何创建并安装你的第一个插件，该插件将为每个[请求](client-requests.md)添加一个自定义请求头：

1. 要创建插件，请调用 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 函数，并将插件名称作为参数传递：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // Configure the plugin ...
   }
   ```
   
   此函数返回 `ClientPlugin` 实例，该实例将用于安装插件。

2. 要为每个请求追加自定义请求头，你可以使用 `onRequest` 处理器，该处理器提供对请求参数的访问：
   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

3. 要[安装插件](client-plugins.md#install)，请将创建的 `ClientPlugin` 实例传递给客户端配置块中的 `install` 函数：
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
你可以在此处找到完整示例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。在接下来的章节中，我们将了解如何提供插件配置以及如何处理请求和响应。

## 提供插件配置 {id="plugin-configuration"}

[上一节](#first-plugin)演示了如何创建为每个响应追加预定义自定义请求头的插件。让我们让这个插件更有用，并提供一个配置，用于传递任何自定义请求头的名称和值：

1. 首先，你需要定义一个配置类：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="14-17"}

2. 要在插件中使用此配置，请将配置类引用传递给 `createApplicationPlugin`：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="3-12"}

   鉴于插件配置字段是可变的，建议将它们保存到局部变量中。

3. 最后，你可以如下安装和配置插件：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-15,18"}

> 你可以在此处找到完整示例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 处理请求和响应 {id="call-handling"}

自定义插件提供了一组专用处理器，用于访问处理请求和响应的不同阶段，例如：
- `onRequest` 和 `onResponse` 分别允许你处理请求和响应。
- `transformRequestBody` 和 `transformResponseBody` 可用于对请求和响应正文应用必要的转换。

还有 `on(...)` 处理器，它允许你调用特定的钩子 (hook)，这可能有助于处理调用的其他阶段。
下表按执行顺序列出了所有处理器：

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

<include from="client-custom-plugins.md" element-id="onRequest"/>
<include from="client-custom-plugins.md" element-id="transformRequestBody"/>
<include from="client-custom-plugins.md" element-id="onResponse"/>
<include from="client-custom-plugins.md" element-id="transformResponseBody"/>
<include from="client-custom-plugins.md" element-id="onClose"/>

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
在请求处理中，<code>SetupRequest</code> 钩子最先执行。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此处理器为每个 HTTP <a href="client-requests.md">请求</a>执行，并允许你修改它。
</p>
<p>
<emphasis>
示例：<a anchor="example-custom-header"/>
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
允许你转换<a href="client-requests.md" anchor="body">请求正文</a>。
在此处理器中，你需要将正文序列化为 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
（例如 <code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>），
或者如果你的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：<a anchor="data-transformation"/>
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
<code>Send</code> 钩子提供了检查响应并在需要时发起额外请求的能力。
这对于处理重定向、重试请求、身份验证等可能很有用。
</p>
<p>
<emphasis>
示例：<a anchor="authentication"/>
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
<code>SendingRequest</code> 钩子为每个请求执行，
即使它不是由用户发起的。
例如，如果一个请求导致重定向，<code>onRequest</code> 处理器将仅针对原始请求执行，而 <code>on(SendingRequest)</code> 将对原始请求和重定向请求都会执行。
同样，如果你使用 <code>on(Send)</code> 发起一个额外的请求，
处理器的执行顺序如下：
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
示例：<a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
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
此处理器为每个传入的 HTTP <a href="client-requests.md">响应</a>执行，并允许你以各种方式检查它：例如记录响应、保存 cookie 等。
</p>
<p>
<emphasis>
示例：<a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
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
允许你转换<a href="client-responses.md" anchor="body">响应正文</a>。
此处理器为每个 <code>HttpResponse.body</code> 调用而调用。
你需要将正文反序列化为 <code>requestedType</code> 的实例，
或者如果你的转换不适用，则返回 <code>null</code>。
</p>
<p>
<emphasis>
示例：<a anchor="data-transformation"/>
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
允许你清理此插件分配的资源。
当客户端<a href="client-create-and-configure.md" anchor="close-client">关闭</a>时，此处理器会被调用。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 共享调用状态 {id="call-state"}

自定义插件允许你共享与调用相关的任何值，以便你可以在处理此调用的任何处理器中访问此值。此值作为具有唯一键的属性存储在 `call.attributes` 集合中。以下示例演示了如何使用属性来计算从发送请求到接收响应之间的时间：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt" include-lines="3-18"}

你可以在此处找到完整示例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 访问客户端配置 {id="client-config"}

你可以使用 `client` 属性访问客户端配置，它返回 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 实例。
以下示例展示了如何获取客户端使用的[代理地址](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 示例 {id="examples"}

以下代码示例演示了几个自定义插件的示例。
你可以在此处找到结果项目：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自定义请求头 {id="example-custom-header"}

展示了如何创建一个为每个请求添加自定义请求头的插件：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt"}

### 记录请求头 {id="example-log-headers"}

演示了如何创建一个记录请求和响应头的插件：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/LoggingHeaders.kt"}

### 响应时间 {id="example-response-time"}

展示了如何创建一个测量从发送请求到接收响应之间的时间的插件：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt"}

### 数据转换 {id="data-transformation"}

展示了如何使用 `transformRequestBody` 和 `transformResponseBody` 钩子转换请求和响应正文：

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

你可以在此处找到完整示例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 身份验证 {id="authentication"}

一个 Ktor 示例项目，展示了如果在收到服务器的未授权响应后，如何使用 `on(Send)` 钩子向 `Authorization` 请求头添加 bearer token：

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

你可以在此处找到完整示例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。