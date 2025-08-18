[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookies 插件會自動處理 Cookie，並將它們保留在儲存中以供呼叫之間使用。
</link-summary>

Ktor 客戶端允許您透過以下方式手動處理 Cookie：
* `cookie` 函式允許您將 Cookie 附加到 [特定請求](client-requests.md#cookies)。
* `setCookie` 函式使您能夠解析在 [回應](client-responses.md#headers) 中接收到的 `Set-Cookie` 標頭值。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) 插件會自動處理 Cookie 並將它們保留在呼叫之間的儲存中。預設情況下，它使用記憶體內儲存，但您也可以使用 [CookiesStorage](#custom_storage) 實作持久性儲存。

## 新增依賴項 {id="add_dependencies"}
`HttpCookies` 僅需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的依賴項。

## 安裝和配置 HttpCookies {id="install_plugin"}

要安裝 `HttpCookies`，將其傳遞給 [客戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

這足以使 Ktor 客戶端在請求之間保留 Cookie。您可以在這裡找到完整的範例：[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies` 插件還允許您透過使用 `ConstantCookiesStorage` 將一組特定的 Cookie 新增到每個請求中。這在驗證伺服器回應的測試案例中可能很有用。以下範例展示了如何將指定的 Cookie 新增到特定網域的所有請求中：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 取得 Cookie {id="get_cookies"}

客戶端提供了 `cookies` 函式以取得用於指定 URL 的所有 Cookie：

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 自訂 Cookie 儲存 {id="custom_storage"}

如果需要，您可以透過實作 [CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html) 介面來建立自訂 Cookie 儲存：

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

您可以將 [AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt) 作為參考。