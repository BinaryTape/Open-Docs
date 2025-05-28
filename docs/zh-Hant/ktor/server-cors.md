[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

如果您的伺服器需要處理[跨來源請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，您需要安裝並配置 [CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktor 外掛。此外掛允許您配置允許的主機、HTTP 方法、用戶端設定的標頭等等。

## 添加依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

> 如果您將 `CORS` 外掛安裝到特定路由，您需要將 `options` [處理器](server-routing.md#define_route)添加到此路由。這允許 Ktor 正確回應 CORS 預檢請求。

## 配置 CORS {id="configure"}

CORS 特定的配置設定由 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 類別提供。讓我們看看如何配置這些設定。

### 概覽 {id="overview"}

假設您有一個伺服器在 `8080` 埠監聽，且 `/customer` [路由](server-routing.md)回應 [JSON](server-serialization.md#send_data) 資料。下面的程式碼片段顯示了從另一個埠運行的用戶端使用 Fetch API 發出的範例請求，以使其成為跨來源請求：

```javascript
```

{src="snippets/cors/files/js/script.js" initial-collapse-state="collapsed" collapsed-title="
fetch('http://0.0.0.0:8080/customer')"}

若要在後端允許此類請求，您需要如下配置 `CORS` 外掛：

```kotlin
```

{src="snippets/cors/src/main/kotlin/com/example/Application.kt" include-lines="47-50"}

您可以在此處找到完整範例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### 主機 {id="hosts"}

若要指定可以發出跨來源請求的允許主機，請使用 `allowHost` 函數。除了主機名稱之外，您還可以指定埠號、子網域名稱列表或支援的 HTTP 方案。

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

若要允許來自任何主機的跨來源請求，請使用 `anyHost` 函數。

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTP 方法 {id="methods"}

預設情況下，`%plugin_name%` 外掛允許 `GET`、`POST` 和 `HEAD` HTTP 方法。若要添加額外方法，請使用 `allowMethod` 函數。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 允許標頭 {id="headers"}

預設情況下，`%plugin_name%` 外掛允許以下由 `Access-Control-Allow-Headers` 管理的用戶端標頭：

* `Accept`
* `Accept-Language`
* `Content-Language`

若要允許額外標頭，請使用 `allowHeader` 函數。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

若要允許自訂標頭，請使用 `allowHeaders` 或 `allowHeadersPrefixed` 函數。例如，下面的程式碼片段展示了如何允許以 `custom-` 為前綴的標頭。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 請注意，`allowHeaders` 或 `allowHeadersPrefixed` 要求針對非簡單內容類型將 [allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html) 屬性設定為 `true`。

### 暴露標頭 {id="expose-headers"}

`Access-Control-Expose-Headers` 標頭將指定的標頭添加到瀏覽器中 JavaScript 可以存取的允許列表。若要配置此類標頭，請使用 `exposeHeader` 函數。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 憑證 {id="credentials"}

預設情況下，瀏覽器不會隨跨來源請求發送憑證資訊（例如：Cookie 或驗證資訊）。若要允許傳遞此資訊，請使用 `allowCredentials` 屬性將 `Access-Control-Allow-Credentials` 回應標頭設定為 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 其他 {id="misc"}

`%plugin_name%` 外掛還允許您指定其他 CORS 相關設定。例如，您可以使用 `maxAgeInSeconds` 來指定預檢請求的回應可以被快取多久，而無需再次發送預檢請求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

您可以從 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 了解其他配置選項。