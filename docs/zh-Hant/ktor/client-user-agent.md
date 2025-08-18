[//]: # (title: 使用者代理)

<primary-label ref="client-plugin"/>

[UserAgent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-user-agent) 外掛會新增一個 `User-Agent` 標頭到所有[請求](client-requests.md)。

## 新增相依性 {id="add_dependencies"}

`UserAgent` 只需要 [ktor-client-core](client-dependencies.md) 構件，並且不需要任何特定的相依性。

## 安裝並設定 UserAgent {id="install_plugin"}

要安裝 `UserAgent`，請在一個[用戶端組態區塊](client-create-and-configure.md#configure-client)內將其傳遞給 `install` 函數。然後，使用 `agent` 屬性來指定 `User-Agent` 值：

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

Ktor 也允許您使用對應的函數來新增一個瀏覽器或 curl 類似的 `User-Agent` 值：

```kotlin
val client = HttpClient(CIO) {
    BrowserUserAgent()
    // ... 或
    CurlUserAgent()
}

```