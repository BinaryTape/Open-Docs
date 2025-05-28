[//]: # (title: 在 Ktor 客户端中追踪请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
CallId 客户端插件允许您使用唯一的调用 ID 追踪客户端请求。
</link-summary>

CallId 插件允许您使用唯一的调用 ID 端到端地追踪客户端请求。这在微服务架构中特别有用，可以跟踪请求，无论请求通过多少服务。

调用范围（calling scope）可能已在其协程上下文中包含调用 ID。默认情况下，该插件使用当前上下文检索调用 ID，并使用 `HttpHeaders.XRequestId` 头部将其添加到特定调用的上下文中。

此外，如果一个范围没有调用 ID，您可以[配置插件](#configure)以生成并应用一个新的调用 ID。

> 在服务器端，Ktor 提供了 [CallId](server-call-id.md) 插件用于追踪客户端请求。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 CallId 插件 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 CallId 插件 {id="configure"}

CallId 插件的配置，由 [CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html) 类提供，允许您生成调用 ID 并将其添加到调用上下文中。

### 生成调用 ID

通过以下方式之一为特定请求生成调用 ID：

* `useCoroutineContext` 属性（默认启用）添加一个生成器，该生成器使用当前的 `CoroutineContext` 检索调用 ID。要禁用此功能，请将 `useCoroutineContext` 设置为 `false`：

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34-35,37"}

> 在 Ktor 服务器中，使用 [CallId 插件](server-call-id.md)将调用 ID 添加到 `CoroutineContext`。

* `generate()` 函数允许您为传出请求生成调用 ID。如果它未能生成调用 ID，则返回 `null`。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34,36-37"}

您可以使用多种方法来生成调用 ID。通过这种方式，将应用第一个非空值。

### 添加调用 ID

检索到调用 ID 后，您可以通过以下选项将其添加到请求中：

* `intercept()` 函数允许您使用 `CallIdInterceptor` 将调用 ID 添加到请求中。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="23-27"}

* `addToHeader()` 函数将调用 ID 添加到指定的头部。它接受一个头部作为参数，默认为 `HttpHeaders.XRequestId`。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="18,20-21"}

## 示例

在以下示例中，Ktor 客户端的 `CallId` 插件配置为生成新的调用 ID 并将其添加到头部：

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="17-22"}

该插件使用协程上下文获取调用 ID，并利用 `generate()` 函数生成一个新的调用 ID。然后，第一个非空的调用 ID 将使用 `addToHeader()` 函数应用于请求头部。

在 Ktor 服务器中，可以从头部中检索调用 ID，使用[服务器端 CallId 插件](server-call-id.md)的 [retrieve](server-call-id.md#retrieve) 函数。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="29-30,33"}

通过这种方式，Ktor 服务器检索请求中指定头部的 ID，并将其应用于调用的 `callId` 属性。

有关完整示例，请参阅 [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)