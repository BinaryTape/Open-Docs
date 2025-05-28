[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCookies 插件会自动处理 Cookie 并在调用之间将其保存在存储中。
</link-summary>

Ktor 客户端允许你通过以下方式手动处理 Cookie：
* `cookie` 函数允许你将 Cookie 附加到`[特定请求](client-requests.md#cookies)`。
* `setCookie` 函数使你能够解析在`[响应](client-responses.md#headers)`中接收到的 `Set-Cookie` 头的值。

`[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html)` 插件会自动处理 Cookie 并在调用之间将其保存在存储中。默认情况下，它使用内存存储，但你也可以使用 `[CookiesStorage](#custom_storage)` 实现持久化存储。

## 添加依赖项 {id="add_dependencies"}
`HttpCookies` 只需要 `[ktor-client-core](client-dependencies.md)` Artifact，不需要任何特定的依赖项。

## 安装和配置 HttpCookies {id="install_plugin"}

要安装 `HttpCookies`，请在 `[客户端配置块](client-create-and-configure.md#configure-client)` 内部将其传递给 `install` 函数：
```kotlin
```
{src="snippets/client-cookies/src/main/kotlin/com/example/Application.kt" include-lines="16-18"}

这足以使 Ktor 客户端能够在请求之间保持 Cookie。你可以在此处找到完整示例：`[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)`。

`HttpCookies` 插件还允许你通过使用 `ConstantCookiesStorage` 将一组特定的 Cookie 添加到每个请求中。这在验证服务器响应的测试用例中可能很有用。以下示例展示了如何将指定的 Cookie 添加到特定域的所有请求中：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 获取 Cookie {id="get_cookies"}

客户端提供了 `cookies` 函数来获取指定 URL 的所有 Cookie：

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 自定义 Cookie 存储 {id="custom_storage"}

如果需要，你可以通过实现 `[CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html)` 接口来创建自定义 Cookie 存储：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = CustomCookiesStorage()
    }
}

public class CustomCookiesStorage : CookiesStorage {
    // ...
}
```

你可以使用 `[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)` 作为参考。