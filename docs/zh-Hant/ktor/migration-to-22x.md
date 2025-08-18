[//]: # (title: 從 2.0.x 遷移到 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南提供了如何將您的 Ktor 應用程式從 2.0.x 版本遷移到 2.2.x 的說明。

> 標記為 `WARNING` 廢棄等級的 API 將會持續運作直到 3.0.0 版本發行。
> 您可以在 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 中了解更多關於廢棄等級的資訊。

## Ktor 伺服器 {id="server"}

### Cookie {id="cookies"}
從 v2.2.0 起，以下與配置 [回應 Cookie](server-responses.md#cookies) 相關的 API 成員有所變動：
- 傳遞給 `append` 函數的 `maxAge` 參數類型從 `Int` 變更為 `Long`。
- `appendExpired` 函數已廢棄。請改用帶有 `expires` 參數的 `append` 函數。

### 請求位址資訊 {id="request-address-info"}

從 2.2.0 版本開始，用於取得發出請求的主機名稱/埠的 `RequestConnectionPoint.host` 和 `RequestConnectionPoint.port` 屬性已廢棄。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}
```

請改用 `RequestConnectionPoint.serverHost` 和 `RequestConnectionPoint.serverPort`。我們也新增了 `localHost`/`localPort` 屬性，它們會回傳收到請求的主機名稱/埠。您可以在 [原始請求資訊](server-forward-headers.md#original-request-information) 中了解更多資訊。

### 合併配置 {id="merge-configs"}
在 v2.2.0 之前，`List<ApplicationConfig>.merge()` 函數用於合併應用程式配置。
如果兩個配置具有相同的鍵，則產生的配置將採用第一個配置中的值。
透過此版本，引入了以下 API 以改進此行為：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：此函數的工作方式與 `merge()` 相同，並從第一個配置中取值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：產生的配置將採用第二個配置中的值。

## Ktor 用戶端 {id="client"}

### 快取：持久儲存 {id="persistent-storage"}

從 v2.2.0 起，以下與回應 [快取](client-caching.md) 相關的 API 已廢棄：
- `HttpCacheStorage` 類別已被 `CacheStorage` 介面取代，該介面可用於為所需平台實作持久儲存。
- `publicStorage`/`privateStorage` 屬性已被接受 `CacheStorage` 實例的對應函數取代。

### 自訂外掛 {id="custom-plugins"}

從 2.2.0 版本發行開始，Ktor 提供了一個用於建立自訂用戶端外掛的新 API。
若要了解更多資訊，請參閱 [自訂用戶端外掛](client-custom-plugins.md)。

## 新記憶體模型 {id="new-mm"}

從 v2.2.0 起，Ktor 使用 Kotlin 的 1.7.20 版本，其中新的 Kotlin/Native 記憶體模型是 [預設啟用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default) 的。
這意味著您無需為 [原生伺服器](server-native.md) 或目標為 [Kotlin/Native](client-engines.md#native) 的用戶端引擎明確啟用它。