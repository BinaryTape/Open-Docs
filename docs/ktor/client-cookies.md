[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookies 插件自动处理 cookie，并将其在调用之间保留在存储中。
</link-summary>

Ktor 客户端允许您通过以下方式手动处理 cookie：
* `cookie` 函数允许您向[特定请求](client-requests.md#cookies)附加一个 cookie。
* `setCookie` 函数使您能够解析在[响应](client-responses.md#headers)中接收到的 `Set-Cookie` 标头值。

[HttpCookies](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) 插件自动处理 cookie，并将其在调用之间保留在存储中。默认情况下，它使用内存存储，但您也可以使用 [CookiesStorage](#custom_storage) 实现持久化存储。

## 添加依赖项 {id="add_dependencies"}
`HttpCookies` 只需 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定的依赖项。

## 安装和配置 HttpCookies {id="install_plugin"}

要安装 `HttpCookies`，请在[客户端配置块](client-create-and-configure.md#configure-client)中将其传递给 `install` 函数：
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

这足以使 Ktor 客户端在请求之间保留 cookie。您可以在此处找到完整示例：[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies` 插件还允许您通过使用 `ConstantCookiesStorage` 为每个请求添加一组特定的 cookie。这在验证服务器响应的测试用例中可能很有用。下面的示例展示了如何向特定域的所有请求添加指定的 cookie：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 获取 cookie {id="get_cookies"}

客户端提供 `cookies` 函数来获取指定 URL 的所有 cookie：

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 自定义 cookie 存储 {id="custom_storage"}

如果需要，您可以通过实现 [CookiesStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html) 接口来创建自定义 cookie 存储：

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

您可以参考 [AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)。