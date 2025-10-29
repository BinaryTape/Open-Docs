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
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✅
</p>
</tldr>

如果你的服务器需要处理[跨域请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，则需要安装并配置 [CORS](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktor 插件。此插件允许你配置允许的主机、HTTP 方法、客户端设置的请求头等等。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要将 <code>%artifact_name%</code> artifact 添加到构建脚本中：
</p>
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

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 插件也可以<a href="#install-route">安装到特定的路由</a>。如果你需要为不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
</p>

> 如果你将 `CORS` 插件安装到特定的路由，你需要为该路由添加 `options` [处理程序](server-routing.md#define_route)。这允许 Ktor 正确响应 CORS 预检请求。

## 配置 CORS {id="configure"}

CORS 特有的配置设置由 [CORSConfig](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 类公开。让我们看看如何配置这些设置。

### 概述 {id="overview"}

假设你有一个服务器正在监听 `8080` 端口，其中 `/customer` [路由](server-routing.md)响应 [JSON](server-serialization.md#send_data) 数据。以下代码片段展示了一个使用 Fetch API 从在另一个端口上运行的客户端发出的示例请求，以使此请求成为跨域请求：

```javascript
function saveCustomer() {
    fetch('http://0.0.0.0:8080/customer',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({id: 3, firstName: "Jet", lastName: "Brains"})
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

```

要在后端允许此类请求，你需要按如下方式配置 `CORS` 插件：

```kotlin
install(CORS) {
    allowHost("0.0.0.0:8081")
    allowHeader(HttpHeaders.ContentType)
}
```

你可以在此处找到完整示例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

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

### 允许请求头 {id="headers"}

默认情况下，`%plugin_name%` 插件允许由 `Access-Control-Allow-Headers` 管理的以下客户端请求头：

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

要允许自定义请求头，请使用 `allowHeaders` 或 `allowHeadersPrefixed` 函数。例如，以下代码片段展示了如何允许以 `custom-` 为前缀的请求头。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 请注意，对于非简单内容类型，`allowHeaders` 或 `allowHeadersPrefixed` 需要将 [allowNonSimpleContentTypes](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html) 属性设置为 `true`。

### 暴露请求头 {id="expose-headers"}

`Access-Control-Expose-Headers` 请求头将指定的请求头添加到浏览器中 JavaScript 可以访问的允许列表中。要配置此类请求头，请使用 `exposeHeader` 函数。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 凭据 {id="credentials"}

默认情况下，浏览器不会随跨域请求发送凭据信息（例如 cookie 或身份验证信息）。要允许传递此信息，请使用 `allowCredentials` 属性将 `Access-Control-Allow-Credentials` 响应头设置为 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 其他 {id="misc"}

`%plugin_name%` 插件还允许你指定其他与 CORS 相关的设置。例如，你可以使用 `maxAgeInSeconds` 来指定预检请求的响应可以被缓存多久，而无需发送另一个预检请求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

你可以从 [CORSConfig](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 中了解其他配置选项。