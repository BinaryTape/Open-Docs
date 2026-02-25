[//]: # (title: 從 2.0.x 遷移至 2.2.x)

<show-structure for="chapter" depth="2"/>

本指南提供有關如何將您的 Ktor 應用程式從 2.0.x 版本遷移至 2.2.x 的說明。

> 標記為 `WARNING` 棄用等級的 API 將持續運作直到 3.0.0 版本發佈。
> 您可以從 [已棄用](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 了解更多關於棄用等級的資訊。

## Ktor 伺服器 {id="server"}

### Cookies {id="cookies"}
在 v2.2.0 中，與配置 [回應 Cookies](server-responses.md#cookies) 相關的以下 API 成員已變更：
- 傳遞給 `append` 函式的 `maxAge` 參數型別從 `Int` 變更為 `Long`。
- `appendExpired` 函式已被棄用。請改用帶有 `expires` 參數的 `append` 函式。

### 請求位址資訊 {id="request-address-info"}

從 2.2.0 版本開始，用於獲取發出請求之主機名稱/通訊埠的 `RequestConnectionPoint.host` 與 `RequestConnectionPoint.port` 屬性已被棄用。

```kotlin
get("/hello") {
    val originHost = call.request.origin.host
    val originPort = call.request.origin.port
}

```

請改用 `RequestConnectionPoint.serverHost` 與 `RequestConnectionPoint.serverPort`。
我們還新增了 `localHost`/`localPort` 屬性，用於傳回接收請求的主機名稱/通訊埠。
您可以從 [原始請求資訊](server-forward-headers.md#original-request-information) 了解更多資訊。

### 合併配置 {id="merge-configs"}
在 v2.2.0 之前，`List<ApplicationConfig>.merge()` 函式用於合併應用程式配置。
若兩個配置具有相同的金鑰，則產生的配置將採用第一個配置的值。
在此版本中，引入了以下 API 以改進此行為：
- `public fun ApplicationConfig.withFallback(other: ApplicationConfig): ApplicationConfig`：此函式的工作方式與 `merge()` 相同，並從第一個配置中獲取值。
- `public fun ApplicationConfig.mergeWith(other: ApplicationConfig): ApplicationConfig`：產生的配置將從第二個配置中獲取值。

## Ktor 用戶端 {id="client"}

### 快取：持久化存儲 {id="persistent-storage"}

在 v2.2.0 中，與回應 [快取](client-caching.md) 相關的以下 API 已被棄用：
- `HttpCacheStorage` 類別已被 `CacheStorage` 介面取代，該介面可用於為所需平台實作持久化存儲。
- `publicStorage`/`privateStorage` 屬性已被接受 `CacheStorage` 執行個體的對應函式取代。

### 自訂外掛程式 {id="custom-plugins"}

從 2.2.0 版本發佈開始，Ktor 提供了一個用於建立自訂用戶端外掛程式的新 API。
若要了解更多，請參閱 [自訂用戶端外掛程式](client-custom-plugins.md)。

## 新記憶體模型 {id="new-mm"}

在 v2.2.0 中，Ktor 使用 1.7.20 版本的 Kotlin，其中新的 Kotlin/Native 記憶體模型已 [預設啟用](https://kotlinlang.org/docs/whatsnew1720.html#the-new-kotlin-native-memory-manager-enabled-by-default)。
這意味著您不需要為針對 [Kotlin/Native](client-engines.md#native) 的 [原生伺服器](server-native.md) 或用戶端引擎顯式啟用它。