[//]: # (title: 服务器插件)

<show-structure for="chapter" depth="2"/>

<link-summary>
插件提供常见功能，例如序列化、内容编码、压缩等。
</link-summary>

Ktor 中典型的请求/响应管道如下所示：

![Request Response Pipeline](request-response-pipeline.png){width="600"}

它始于一个请求，该请求被路由到特定处理器，由我们的应用逻辑处理，最后发出响应。

## 使用插件添加功能 {id="add_functionality"}

许多应用程序需要超出应用逻辑范围的常见功能。这可能包括序列化和内容编码、压缩、请求头、Cookie 支持等。所有这些都通过 Ktor 中我们称之为 **插件 (Plugins)** 的方式提供。

如果我们查看之前的管道图，插件位于请求/响应和应用逻辑之间：

![Plugin pipeline](plugin-pipeline.png){width="600"}

当请求进入时：

*   它通过路由机制被路由到正确的处理器
*   在移交给处理器之前，它会经过一个或多个插件
*   处理器（应用逻辑）处理请求
*   在响应发送给客户端之前，它会经过一个或多个插件

## 路由是一种插件 {id="routing"}

插件的设计旨在提供最大的灵活性，并允许它们存在于请求/响应管道的任何阶段。
事实上，我们迄今为止所称的 `routing` 也不过是一个插件。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## 添加插件依赖 {id="dependency"}
大多数插件都需要特定的依赖。例如，`CORS` 插件要求在构建脚本中添加 `ktor-server-cors` 工件：

<var name="artifact_name" value="ktor-server-cors"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装插件 {id="install"}

插件通常在服务器的初始化阶段进行配置，使用接受插件作为参数的 `install` 函数。根据你[创建服务器](server-create-and-configure.topic)的方式，你可以在 `embeddedServer` 调用中安装插件...

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS)
        install(Compression)
        // ...
    }.start(wait = true)
}
```

... 或指定的[模块](server-modules.md)：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun Application.module() {
    install(CORS)
    install(Compression)
    // ...
}
```

除了拦截请求和响应外，插件还可以拥有一个可选的配置部分，该部分在此步骤中进行配置。

例如，安装 [Sessions](server-sessions.md#cookie) 时，我们可以设置某些参数，例如我们希望将 Cookie 存储在哪里，或者它们的名称：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 为特定路由安装插件 {id="install-route"}

在 Ktor 中，你不仅可以全局安装插件，还可以为特定[路由](server-routing.md)安装插件。如果你需要为不同的应用程序资源使用不同的插件配置，这可能会很有用。例如，下面的[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)展示了如何为 `/index` 路由添加指定的[缓存头](server-caching-headers.md)：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

请注意，以下规则适用于同一插件的多次安装：
*   安装到特定路由的插件配置会覆盖其[全局配置](#install)。
*   路由会合并同一路由的安装，并且最后一次安装会生效。例如，对于这样的应用程序...

   ```kotlin
   routing {
       route("index") {
           install(CachingHeaders) { /* First configuration */ }
           get("a") {
               // ...
           }
       }
       route("index") {
           install(CachingHeaders) { /* Second configuration */ }
           get("b") {
               // ...
           }
       }
   }
   ```
   {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // First configuration }"}

   ... 对 `/index/a` 和 `/index/b` 的两次调用都只由插件的第二次安装处理。

## 默认、可用和自定义插件 {id="default_available_custom"}

默认情况下，Ktor 不会激活任何插件，因此你需要根据应用程序所需的功能自行安装插件。

然而，Ktor 确实提供了各种开箱即用的插件。你可以在 [Ktor 插件注册表 (Ktor Plugin Registry)](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server) 中查看完整的列表。

此外，你还可以创建自己的[自定义插件](server-custom-plugins.md)。