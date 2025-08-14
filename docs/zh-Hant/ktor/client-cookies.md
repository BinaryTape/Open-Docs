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
HttpCookies 外掛程式會自動處理 Cookie，並在呼叫之間將其保存在儲存區中。
</link-summary>

Ktor 客戶端允許您以以下方式手動處理 Cookie：
* `cookie` 函數允許您將 Cookie 附加到 [特定請求](client-requests.md#cookies)。
* `setCookie` 函數使您能夠解析在 [回應](client-responses.md#headers) 中接收到的 `Set-Cookie` 標頭值。

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) 外掛程式會自動處理 Cookie，並在呼叫之間將其保存在儲存區中。預設情況下，它使用記憶體內儲存區，但您也可以使用 [CookiesStorage](#custom_storage) 實作持久性儲存。

## 新增依賴項 {id="add_dependencies"}
`HttpCookies` 只需 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的依賴項。

## 安裝並設定 HttpCookies {id="install_plugin"}

若要安裝 `HttpCookies`，請將其傳遞給 [客戶端設定區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：
[object Promise]

這足以使 Ktor 客戶端能夠在請求之間保留 Cookie。您可以在此處找到完整範例：[client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies)。

`HttpCookies` 外掛程式還允許您透過使用 `ConstantCookiesStorage` 向每個請求新增一組特定的 Cookie。這在驗證伺服器回應的測試案例中可能很有用。下面的範例顯示了如何向特定網域的所有請求新增指定的 Cookie：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 取得 Cookie {id="get_cookies"}

客戶端提供 `cookies` 函數來取得指定 URL 的所有 Cookie：

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 自訂 Cookie 儲存 {id="custom_storage"}

如有需要，您可以透過實作 [CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html) 介面來建立自訂 Cookie 儲存：

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