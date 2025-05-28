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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

如果你的服务器需要处理[跨域请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，
则需要安装并配置
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktor 插件。
此插件允许你配置允许的主机、HTTP 方法、客户端设置的头信息等。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

> 如果你将 `CORS` 插件安装到特定路由，则需要为该路由添加 `options` [处理器](server-routing.md#define_route)。这使得 Ktor 能够正确响应 CORS 预检请求。

## 配置 CORS {id="configure"}

CORS 特定的配置设置由
[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 类提供。
让我们看看如何配置这些设置。

### 概述 {id="overview"}

假设你有一个服务器在 `8080` 端口监听，其中 `/customer` [路由](server-routing.md)响应 [JSON](server-serialization.md#send_data) 数据。
下面的代码片段展示了客户端在另一个端口上使用 Fetch API 发出的示例请求，以使其成为跨域请求：

```javascript
```

{src="snippets/cors/files/js/script.js" initial-collapse-state="collapsed" collapsed-title="
fetch('http://0.0.0.0:8080/customer')"}

为了允许后端处理此类请求，你需要按如下方式配置 `CORS` 插件：

```kotlin
```

{src="snippets/cors/src/main/kotlin/com/example/Application.kt" include-lines="47-50"}

你可以在这里找到完整示例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### 主机 {id="hosts"}

要指定可以发起跨域请求的允许主机，请使用 `allowHost` 函数。除了主机名，你还可以指定端口号、子域名列表或支持的 HTTP 方案。

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

默认情况下，`%plugin_name%` 插件允许 `GET`、`POST` 和 `HEAD` HTTP 方法。要添加其他方法，请使用 `allowMethod` 函数。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 允许的头信息 {id="headers"}

默认情况下，`%plugin_name%` 插件允许由 `Access-Control-Allow-Headers` 管理的以下客户端头信息：

*   `Accept`
*   `Accept-Language`
*   `Content-Language`

要允许其他头信息，请使用 `allowHeader` 函数。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

要允许自定义头信息，请使用 `allowHeaders` 或 `allowHeadersPrefixed` 函数。例如，下面的代码片段展示了如何允许以 `custom-` 为前缀的头信息。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 请注意，对于非简单内容类型，`allowHeaders` 或 `allowHeadersPrefixed` 需要将 [allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html) 属性设置为 `true`。

### 暴露头信息 {id="expose-headers"}

`Access-Control-Expose-Headers` 头信息将指定的头信息添加到允许列表，浏览器中的 JavaScript 可以访问这些头信息。
要配置此类头信息，请使用 `exposeHeader` 函数。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 凭据 {id="credentials"}

默认情况下，浏览器在跨域请求中不发送凭据信息（例如 Cookie 或认证信息）。为了允许传递此信息，请使用 `allowCredentials` 属性将 `Access-Control-Allow-Credentials` 响应头设置为 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 杂项 {id="misc"}

`%plugin_name%` 插件还允许你指定其他与 CORS 相关的设置。例如，你可以使用 `maxAgeInSeconds` 来指定预检请求的响应可以缓存多久，而无需发送另一个预检请求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

你可以从 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 了解其他配置选项。