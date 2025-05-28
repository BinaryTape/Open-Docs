[//]: # (title: 從 2.0.x 遷移到 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南提供了如何將您的 Ktor 應用程式從 2.0.x 版本遷移到 2.2.x 版本的說明。

> 被標記為 `WARNING` 棄用 (deprecation) 級別的 API 將會繼續運作，直到 3.0.0 版本發佈。
> 您可以從 [Deprecated](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 了解更多關於棄用級別的資訊。

## Ktor 伺服器 {id="server"}

### Cookie {id="cookies"}
從 v2.2.0 開始，以下與設定 [回應 Cookie](server-responses.md#cookies) 相關的 API 成員有所變更：
- 傳遞給 `append` 函數的 `maxAge` 參數類型從 `Int` 變更為 `Long`。
- `appendExpired` 函數已棄用。請改用帶有 `expires` 參數的 `append` 函數。

### 請求位址資訊 {id="request-address-info"}

從 2.2.0 版本開始，用於獲取請求所針對的主機名稱/埠的 `RequestConnectionPoint.host` 和 `RequestConnectionPoint.port` 屬性已棄用。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

請改用 `RequestConnectionPoint.serverHost` 和 `RequestConnectionPoint.serverPort`。
我們也新增了 `localHost`/`localPort` 屬性，它們會回傳接收請求的主機名稱/埠。您可以從 [](server-forward-headers.md#original-request-information) 了解更多資訊。

### 合併設定 {id="merge-configs"}
在 v2.2.0 之前，`List<ApplicationConfig>.merge()` 函數用於合併應用程式設定。
如果兩個設定具有相同的鍵，則結果設定會取第一個設定的值。
此版本引入了以下 API 來改進此行為：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：此函數與 `merge()` 的工作方式相同，並取第一個設定的值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：結果設定會取第二個設定的值。

## Ktor 客戶端 {id="client"}

### 快取：持久性儲存 {id="persistent-storage"}

從 v2.2.0 開始，以下與回應 [快取](client-caching.md) 相關的 API 已棄用：
- `HttpCacheStorage` 類別已被 `CacheStorage` 介面取代，該介面可用於為所需平台實作持久性儲存。
- `publicStorage`/`privateStorage` 屬性已被接受 `CacheStorage` 實例的相應函數取代。

### 自訂外掛 {id="custom-plugins"}

從 2.2.0 版本開始，Ktor 提供了一個新的 API 用於建立自訂客戶端外掛。
要了解更多資訊，請參閱 [](client-custom-plugins.md)。

## 新記憶體模型 {id="new-mm"}

從 v2.2.0 開始，Ktor 使用 Kotlin 的 1.7.20 版本，其中新的 Kotlin/Native 記憶體模型已 [預設啟用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
這表示您無需為針對 [Kotlin/Native](client-engines.md#native) 的 [原生伺服器](server-native.md) 或客戶端引擎明確啟用它。