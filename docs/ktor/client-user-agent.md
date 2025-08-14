[//]: # (title: User agent)

<primary-label ref="client-plugin"/>

[UserAgent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-user-agent) 插件会将 `User-Agent` 标头添加到所有[请求](client-requests.md)中。

## 添加依赖项 {id="add_dependencies"}

`UserAgent` 仅需要 [ktor-client-core](client-dependencies.md) 构件，无需任何特定的依赖项。

## 安装和配置 UserAgent {id="install_plugin"}

要安装 `UserAgent`，请在[客户端配置代码块](client-create-and-configure.md#configure-client)中将其传递给 `install` 函数。然后，使用 `agent` 属性来指定 `User-Agent` 值：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
// ...
val client = HttpClient(CIO) {
    install(UserAgent) {
        agent = "Ktor client"
    }
}
```

Ktor 还允许你使用对应的函数，添加类似浏览器或 curl 的 `User-Agent` 值：

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... or
    CurlUserAgent()
}
```