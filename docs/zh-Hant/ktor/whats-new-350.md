[//]: # (title: Ktor 3.5.0 的新功能)

<show-structure for="chapter,procedure" depth="2"/>

_[發布日期：2026 年 5 月 15 日](releases.md#release-details)_

Ktor 3.5.0 針對伺服器與用戶端提供了一系列改進。本次功能發布的重點包括：

* [支援 RFC 7616 摘要驗證（Digest authentication）](#rfc-7616-digest-auth)
* [根配置（Root configuration）data class 對應](#config-data-class-mapping)
* [僅在修改時傳送工作階段 Cookie](#session-cookies)
* [OkHttp 與 Apache5 用戶端引擎中的自訂 DNS 解析器](#custom-dns-resolvers)

## Ktor 伺服器

### 支援 RFC 7616 摘要驗證（Digest authentication） {id="rfc-7616-digest-auth"}

Ktor 3.5.0 更新了 [`digest` 驗證提供者](server-digest-auth.md)以符合 [RFC 7616](https://datatracker.ietf.org/doc/html/rfc7616) 規範，提升了安全性並增加了對現代 Digest 功能的支援。

本版本引入了以下變更：

* 您現在可以使用 `algorithms` 屬性配置多個雜湊演算法。當指定多個值時，Ktor 會傳送多個 `WWW-Authenticate` 標頭，以便用戶端可以選擇支援的最強選項。
* 引入了 `DigestAlgorithm` 與 `DigestQop` 列舉（enums）以取代基於字串的配置。
* `digestProvider {}` lambda 現在會接收一個 `algorithm` 參數，允許您動態計算正確的摘要。
* 根據 RFC 7616，`qop` 參數現在已包含在驗證挑戰（authentication challenges）中。
* 增加了對基於工作階段（session-based）演算法的支援，例如 `SHA-256-sess` 與 `SHA-512-256-sess`。
* 增加了對 RFC 7616 使用者名稱雜湊（`userhash`）的支援，以改善隱私保護。

以下範例顯示如何從舊版配置遷移到符合 RFC 7616 的 API：

<compare type="left-right" first-title="舊版" second-title="RFC 7616">

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        algorithmName = "MD5"  // 已棄用的屬性
        digestProvider { userName, realm ->
            // 不含 algorithm 參數的舊簽章
            getMd5Digest("$userName:$realm:$password")
        }
    }
}
```

```kotlin
install(Authentication) {
    digest("auth") {
        realm = "MyRealm"
        // 同時支援現代與舊版用戶端
        algorithms = listOf(DigestAlgorithm.SHA_512_256, DigestAlgorithm.MD5)
        digestProvider { userName, realm, algorithm ->
            // 新簽章會接收 algorithm
            val password = getPassword(userName) ?: return@digestProvider null
            algorithm.toDigester().digest("$userName:$realm:$password".toByteArray())
        }
    }
}
```
</compare>

現有的配置仍可繼續運作，無需變更。然而，對於新應用程式，建議：

* 使用安全的演算法，例如 `SHA-512-256` 或 `SHA-256`。
* 更新 `digestProvider` 以使用新的 `algorithms` 參數。
* 除非為了與舊版用戶端相容，否則請避免使用基於 `MD5` 的演算法。

如需完整指南，請參閱 [Ktor 伺服器中的摘要驗證](server-digest-auth.md)。

### 自訂提供者中的掛起（Suspending）`.authenticate()` 多載

[自訂驗證提供者](server-auth.md#custom-auth-provider) 現在可以實作掛起（suspending）版本的 `DynamicProviderConfig.authenticate()` 函式。`.authenticate()` 函式接受一個掛起 lambda，因此您可以在驗證過程中直接呼叫協同程式 API：

```kotlin
install(Authentication) {
  provider("custom") {
    authenticate { context ->
      delay(10.milliseconds)
      context.principal(null)
    }
  }
}
```

### 根配置（Root configuration）data class 對應 {id="config-data-class-mapping"}

`ApplicationConfig` 現在提供 `.getAs()` 函式，用於將整個配置反序列化為一個 data class。

以前，反序列化僅限於單個屬性，需要透過 `.property()` 函式進行存取。有了根級別的支援，您可以將完整的配置結構直接對應到單個 data class：

<compare type="top-bottom" first-title="之前" second-title="之後">

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)

val app = ApplicationConfig("application.yaml").property("app").getAs<App>()
val security = ApplicationConfig("application.yaml").property("security").getAs<Security>()
```

```kotlin
@Serializable data class App(val port: Int, val host: String)
@Serializable data class Security(val clientId: String, val clientSecret: String)
@Serializable data class Config(val app: App, val security: Security)

val config = ApplicationConfig("application.yaml").getAs<Config>()
```

</compare>

### 必要的請求參數輔助函式

Ktor 3.5.0 引入了一組新的擴充函式，簡化了從 `ApplicationCall` 存取必要請求資料的操作。

以前，驗證必要的請求資料通常需要重複的 null 檢查和標籤返回（labeled returns）。為了改進此工作流程，Ktor 現在提供以下新的擴充函式：

* `ApplicationCall.requireQueryParameter()` — 從請求 URL 中檢索必要的查詢參數。如果參數缺失，則拋出例外。
* `ApplicationCall.requireHeader()` — 檢索必要的 HTTP 標頭值。如果請求中不存在該標頭，則拋出例外。
* `ApplicationCall.requireCookie()` — 檢索必要的 Cookie 值，並可選擇使用指定的編碼對其進行解碼。如果 Cookie 缺失，則拋出例外。
* `RoutingCall.requirePathParameter()` — 從路由定義中檢索必要的路徑參數。如果比對的路由中不存在該參數，則拋出例外。

每個函式都會傳回一個非 null 值，如果值缺失，則會拋出 `MissingRequestParameterException`。

<compare>

```kotlin
post("/checkout") {
  val userId = call.request.cookies["userId"]
    ?: return@post call.respondText(
      "Login required",
      status = HttpStatusCode.Forbidden
    )

  val amount = call.request.queryParameters["amount"]?.toLongOrNull()
    ?: return@post call.respondText(
     "Amount missing",
     status = HttpStatusCode.BadRequest
  )
  
  // 業務邏輯
}
```

```kotlin
post("/checkout") {
    val userId = call.requireCookie("userId")
    val amount = call.requireQueryParameter("amount").toLong()

    // 業務邏輯
}
```

</compare>

### `ktor-network` 的 ES 模組相容性

我們修復了在啟用 ES 模組時無法使用 `ktor-network` 及其所有依賴模組的問題。

為了幫助防止未來發生迴歸（regression），我們的 JavaScript 測試基礎結構現在預設同時針對 ES2015 和 ES 模組。

> 有關 Kotlin/JS 模組系統和 ES2015 支援的更多資訊，請參閱：
> * [JavaScript 模組](https://kotlinlang.org/docs/js-modules.html)
> * [對 ES2015 特性的支援](https://kotlinlang.org/docs/js-project-setup.html#support-for-es2015-features)
>
{style="tip"}

### 僅在修改時傳送工作階段 Cookie {id="session-cookies"}

Ktor 3.5.0 為 [工作階段 (Sessions)](server-sessions.md) 外掛程式引入了一個新選項，僅在工作階段資料發生變化時才傳送該資料（例如，基於 Cookie 的工作階段的 `Set-Cookie` 標頭）。

預設情況下，工作階段資料會在每次回應時傳送以保留現有行為。若要僅在修改時傳送，請在工作階段 Cookie 配置中啟用 `sendOnlyIfModified` 標記：

```kotlin
install(Sessions) {
    cookie<MySession>("SESSION") {
        sendOnlyIfModified = true
    }
}
```

## Ktor 用戶端

### OkHttp 與 Apache5 引擎中的自訂 DNS 解析器 {id="custom-dns-resolvers"}

Ktor 3.5.0 在 OkHttp 與 Apache5 用戶端引擎中增加了對配置自訂 DNS 解析器的一等支援。

以前，您需要透過存取引擎特定的內部細節來配置自訂 DNS 解析，例如 OkHttp 中的 `config {}` 或 Apache5 中的 `configureConnectionManager { setDnsResolver(...) }`。Ktor 現在在每個引擎上公開了專用的配置屬性，以提供一致且型別安全的 API。

#### OkHttp

您現在可以使用 `OkHttpConfig.dns` 屬性在 OkHttp 中配置自訂 DNS 解析器：

```kotlin
HttpClient(OkHttp) {
    engine {
        dns = Dns { hostname -> listOf(InetAddress.getByName("127.0.0.1")) }
    }
}
```

如果您未配置 `dns` 屬性，OkHttp 引擎將繼續使用 OkHttp 預設的 `Dns.SYSTEM` 解析器。

#### Apache5

您現在可以使用 `Apache5EngineConfig.dnsResolver` 屬性在 Apache5 中配置自訂 DNS 解析器：

```kotlin
HttpClient(Apache5) {
    engine {
        dnsResolver = SystemDefaultDnsResolver.INSTANCE
    }
}
```

如果未配置 `dnsResolver` 屬性，Apache5 引擎將繼續使用 Apache 用戶端預設的 DNS 解析器。