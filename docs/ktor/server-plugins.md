[//]: # (title: 服务器插件)

<show-structure for="chapter" depth="2"/>

<link-summary>
插件提供常见功能，例如序列化、内容编码、压缩等。
</link-summary>

Ktor 中典型的请求/响应流水线如下所示：

![Request Response Pipeline](request-response-pipeline.png){width="600"}

它始于一个请求，该请求会被路由到特定的处理程序，由我们的应用程序逻辑处理，并最终得到响应。

## 使用插件添加功能 {id="add_functionality"}

许多应用程序需要常见功能，这些功能超出了应用程序逻辑的范围。例如序列化和内容编码、压缩、请求头、Cookie 支持等。所有这些功能都在 Ktor 中通过我们称之为 **插件** 的方式提供。

如果我们查看之前的流水线图，插件位于请求/响应与应用程序逻辑之间：

![Plugin pipeline](plugin-pipeline.png){width="600"}

当请求进入时：

*   它通过路由机制路由到正确的处理程序
*   在交给处理程序之前，它会经过一个或多个插件
*   处理程序（应用程序逻辑）处理该请求
*   在响应发送到客户端之前，它会经过一个或多个插件

## 路由是一个插件 {id="routing"}

插件的设计旨在提供最大的灵活性，并且允许它们存在于请求/响应流水线的任何环节。事实上，我们迄今为止所称的 `routing` 也不过是一个插件。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## 添加插件依赖项 {id="dependency"}
大多数插件都需要特定的依赖项。例如，`CORS` 插件需要将 `ktor-server-cors` artifact 添加到构建脚本中：

<var name="artifact_name" value="ktor-server-cors"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安装插件 {id="install"}

插件通常在服务器的初始化阶段进行配置，使用以插件作为形参的 `install` 函数。根据您 [创建服务器](server-create-and-configure.topic) 的方式，您可以在 `embeddedServer` 调用中安装插件...

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

... 或指定的 [模块](server-modules.md)：

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

除了拦截请求和响应之外，插件还可以有一个可选的配置部分，该部分在此步骤中进行配置。

例如，在安装 [Cookies](server-sessions.md#cookie) 时，我们可以设置某些参数，例如我们希望 Cookie 存储在哪里，或者它们的名称：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 将插件安装到特定路由 {id="install-route"}

在 Ktor 中，您不仅可以全局安装插件，还可以将其安装到特定的 [路由](server-routing.md)。如果您需要针对不同的应用程序资源使用不同的插件配置，这可能会很有用。例如，下面的 [示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes) 展示了如何为 `/index` 路由添加指定的 [缓存头](server-caching-headers.md)：

```kotlin
route("/index") {
    install(CachingHeaders) {
        options { call, content -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 1800)) }
    }
    get {
        call.respondText("Index page")
    }
}
```

请注意，以下规则适用于同一插件的多次安装：
*   安装到特定路由的插件配置会 **覆盖** 其 [全局配置](#install)。
*   路由会合并相同路由的安装，并且最后一次安装生效。例如，对于以下应用程序...

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

   ... 对 `/index/a` 和 `/index/b` 的两次调用都仅由该插件的第二次安装处理。

## 默认、可用和自定义插件 {id="default_available_custom"}

默认情况下，Ktor 不激活任何插件，因此，您需要根据应用程序的功能需求安装插件。

然而，Ktor 确实提供了各种开箱即用的插件。您可以在 [Ktor 插件注册表](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server) 中查看这些插件的完整列表。

此外，您还可以创建自己的 [自定义插件](server-custom-plugins.md)。