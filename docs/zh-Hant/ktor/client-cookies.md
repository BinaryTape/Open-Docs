[//]: # (title: Cookie)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookies外掛程式會自動處理Cookie，並將其保存在存儲中以供呼叫之間使用。
</link-summary>

Ktor用戶端允許您透過以下方式手動處理Cookie：
* `cookie`函式允許您將Cookie附加到[特定請求](client-requests.md#cookies)。
* `setCookie`函式讓您能夠解析從[回應](client-responses.md#headers)中接收到的`Set-Cookie`標頭值。

[HttpCookies](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html)外掛程式會自動處理Cookie，並將其保存在存儲中以供呼叫之間使用。
預設情況下，它使用記憶體內存儲，但您也可以使用[CookiesStorage](#custom_storage)實作持久化存儲。

## 新增相依性 {id="add_dependencies"}
`HttpCookies`只需要[ktor-client-core](client-dependencies.md)構件，不需要任何特定的相依性。

## 安裝與配置 HttpCookies {id="install_plugin"}

要安裝`HttpCookies`，請將其傳遞給[用戶端配置區塊](client-create-and-configure.md#configure-client)內的`install`函式：
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

這足以讓Ktor用戶端在請求之間保留Cookie。您可以在此處找到完整的範例：[client-cookies](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-cookies)。

`HttpCookies`外掛程式還允許您使用`ConstantCookiesStorage`為每個請求新增一組特定的Cookie。這在驗證伺服器回應的測試案例中可能非常有用。下方的範例展示了如何為特定網域的所有請求新增指定的Cookie：

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 獲取 Cookie {id="get_cookies"}

用戶端提供`cookies`函式以獲取指定URL的所有Cookie：

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 自訂 Cookie 存儲 {id="custom_storage"}

如果需要，您可以透過實作[CookiesStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html)介面來建立自訂的Cookie存儲：

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

您可以參考[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)作為參考。