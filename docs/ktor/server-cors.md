[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并且允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

如果您的服务器需要处理[跨域请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，
您需要安装并配置
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktor 插件。此插件允许您配置允许的主机、HTTP 方法、客户端设置的请求头等。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 插件也可以<a href="#install-route">安装到特定的路由</a>。
        如果您需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
    </p>
    

> 如果您将 `CORS` 插件安装到特定路由，您需要向此路由添加
`options` [处理程序](server-routing.md#define_route)。这使得 Ktor 能够正确响应 CORS
预检请求。

## 配置 CORS {id="configure"}

CORS 特有的配置设置由
[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)
类公开。让我们看看如何配置这些设置。

### 概述 {id="overview"}

假设您有一个服务器在 `8080` 端口监听，并且 `/customer` [路由](server-routing.md)响应
[JSON](server-serialization.md#send_data) 数据。下面的代码片段展示了一个使用 Fetch API 从
另一个端口上运行的客户端发起的示例请求，该请求是跨域的：

[object Promise]

为了允许后端处理此类请求，您需要按如下方式配置 `CORS` 插件：

[object Promise]

您可以在这里找到完整的示例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### 主机 {id="hosts"}

要指定可以发起跨域请求的允许主机，请使用 `allowHost` 函数。除了主机名，
您还可以指定端口号、子域列表或支持的 HTTP 方案。

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

要允许来自任何主机的跨域请求，请使用 `anyHost` 函数。

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTP 方法 {id="methods"}

默认情况下，<code>%plugin_name%</code> 插件允许 `GET`、`POST` 和 `HEAD` HTTP 方法。要添加其他方法，请使用
`allowMethod` 函数。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 允许请求头 {id="headers"}

默认情况下，<code>%plugin_name%</code> 插件允许由 `Access-Control-Allow-Headers` 管理的以下客户端请求头：

* `Accept`
* `Accept-Language`
* `Content-Language`

要允许其他请求头，请使用 `allowHeader` 函数。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

要允许自定义请求头，请使用 `allowHeaders` 或 `allowHeadersPrefixed` 函数。例如，下面的代码片段
展示了如何允许以 `custom-` 为前缀的请求头。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 请注意，`allowHeaders` 或 `allowHeadersPrefixed` 需要将
[allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html)
属性设置为 `true`，以支持非简单内容类型。

### 暴露请求头 {id="expose-headers"}

`Access-Control-Expose-Headers` 请求头将指定的请求头添加到浏览器中 JavaScript 可以
访问的允许列表。
要配置此类请求头，请使用 `exposeHeader` 函数。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 凭据 {id="credentials"}

默认情况下，浏览器不会随跨域请求发送凭据信息（例如 cookie 或认证信息）。
要允许传递此信息，请使用 `allowCredentials` 属性将 `Access-Control-Allow-Credentials` 响应头设置为 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 其他 {id="misc"}

<code>%plugin_name%</code> 插件还允许您指定其他 CORS 相关设置。例如，您可以使用
`maxAgeInSeconds` 来指定预检请求的响应可以缓存多长时间，而无需发送另一个
预检请求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

您可以从 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 了解其他配置选项。