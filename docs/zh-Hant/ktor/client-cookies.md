[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
`HttpCookies` 插件會自動處理 Cookie，並將其保留在儲存中，以便在呼叫之間使用。
</link-summary>

Ktor 用戶端允許您透過以下方式手動處理 Cookie：
* `cookie` 函數允許您將 Cookie 附加到 [特定請求](client-requests.md#cookies)。
* `setCookie` 函數讓您能夠解析從 [回應](client-responses.md#headers) 中接收到的 `Set-Cookie` 標頭值。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) 插件會自動處理 Cookie，並在呼叫之間將其保留在儲存中。預設情況下，它使用記憶體內儲存，但您也可以使用 [CookiesStorage](#custom_storage) 實作持久性儲存。

## 新增依賴 {id="add_dependencies"}
`HttpCookies` 只需要 [ktor-client-core](client-dependencies.md) 構件，並且不需要任何特定的依賴。

## 安裝和配置 HttpCookies {id="install_plugin"}

要安裝 `HttpCookies`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：
```kotlin
```
{src="snippets/client-cookies/src/main/kotlin/com/example/Application.kt" include-lines="16-18"}

這足以讓 Ktor 用戶端在請求之間保留 Cookie。您可以在此處找到完整的範例：[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies` 插件還允許您透過使用 `ConstantCookiesStorage`，向每個請求新增一組特定的 Cookie。這在驗證伺服器回應的測試案例中可能很有用。以下範例顯示如何將指定的 Cookie 新增到特定網域的所有請求：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 取得 Cookie {id="get_cookies"}

用戶端提供 `cookies` 函數以取得指定 URL 的所有 Cookie：

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

您可以使用 [AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt) 作為參考。