[//]: # (title: 默认请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
DefaultRequest 插件允许你为所有请求配置默认参数。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 插件允许你为所有[请求](client-requests.md)配置默认参数：例如指定基础 URL、添加标头、配置查询参数等。

## 添加依赖项 {id="add_dependencies"}

`DefaultRequest` 只要求 [ktor-client-core](client-dependencies.md) 构件，不需要任何特定的依赖项。

## 安装 DefaultRequest {id="install_plugin"}

要安装 `DefaultRequest`，请将其传递给[客户端配置代码块](client-create-and-configure.md#configure-client)内的 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

或者调用 `defaultRequest` 函数并[配置](#configure)所需的请求参数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## 配置 DefaultRequest {id="configure"}

### 基础 URL {id="url"}

`DefaultRequest` 允许你配置 URL 的基础部分，该部分将与[请求 URL](client-requests.md#url) 合并。
例如，下面的 `url` 函数为所有请求指定了一个基础 URL：

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

如果你使用上述配置的客户端发出以下请求，...

```kotlin
val response: HttpResponse = client.get("welcome.html")
```

... 结果 URL 将是以下内容：`https://ktor.io/docs/welcome.html`。
关于基础 URL 和请求 URL 如何合并的更多信息，请参见 [DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)。

### URL 参数 {id="url-params"}

`url` 函数还允许你单独指定 URL 组件，例如：
- HTTP 方案；
- 主机名；
- 基础 URL 路径；
- 查询参数。

```kotlin
url {
    protocol = URLProtocol.HTTPS
    host = "ktor.io"
    path("docs/")
    parameters.append("token", "abc123")
}
```

### 标头 {id="headers"}

要为每个请求添加特定标头，请使用 `header` 函数：

```kotlin
defaultRequest {
    header("X-Custom-Header", "Hello")
}
```

为避免重复标头，你可以使用 `appendIfNameAbsent`、`appendIfNameAndValueAbsent` 和 `contains` 函数：

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

### Unix 域套接字

> Unix 域套接字仅在 CIO 引擎中受支持。
>
{style="note"}

你可以[使用 Unix 域套接字构建单个请求](client-requests.md#specify-a-unix-domain-socket)，
但你也可以使用套接字参数配置默认请求。

为此，请将带有套接字路径的 `unixSocket` 调用传递给 `defaultRequest` 函数，
例如：

```kotlin
val client = HttpClient(CIO)

// Sending a single request to a Unix domain socket
val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}

// Setting up the socket for all requests from that client
val clientDefault = HttpClient(CIO) {
    defaultRequest {
        unixSocket("/tmp/test-unix-socket-ktor.sock")
    }    
}

val response: HttpResponse = clientDefault.get("/")
```

## 示例 {id="example"}

以下示例使用了以下 `DefaultRequest` 配置：
* `url` 函数定义了 HTTP 方案、主机、基础 URL 路径和查询参数。
* `header` 函数为所有请求添加了自定义标头。

```kotlin
val client = HttpClient(CIO) {
    defaultRequest {
        url {
            protocol = URLProtocol.HTTPS
            host = "ktor.io"
            path("docs/")
            parameters.append("token", "abc123")
        }
        header("X-Custom-Header", "Hello")
    }
}
```

此客户端发出的以下请求只指定了后面的路径段，并自动应用为 `DefaultRequest` 配置的参数：

```kotlin
val response: HttpResponse = client.get("welcome.html")
println(response.status)
```

你可以在这里找到完整示例：[client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。