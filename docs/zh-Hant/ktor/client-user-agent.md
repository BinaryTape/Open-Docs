[//]: # (title: 使用者代理)

<primary-label ref="client-plugin"/>

[UserAgent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-user-agent) 插件會將 `User-Agent` 標頭新增至所有[請求](client-requests.md)。

## 新增依賴項 {id="add_dependencies"}

`UserAgent` 只需 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的依賴項。

## 安裝並配置 UserAgent {id="install_plugin"}

要安裝 `UserAgent`，請在 [客戶端配置區塊](client-create-and-configure.md#configure-client) 內將其傳遞給 `install` 函式。然後，使用 `agent` 屬性來指定 `User-Agent` 值：

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

Ktor 也允許您使用對應的函式來新增類似瀏覽器或 cURL 的 `User-Agent` 值：

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... or
    CurlUserAgent()
}
```