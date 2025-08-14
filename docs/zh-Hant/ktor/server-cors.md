[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

如果您的伺服器需要處理 [跨來源請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，
您需要安裝並設定
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html)
Ktor 外掛程式。此外掛程式允許您設定允許的主機、HTTP 方法、客戶端設定的標頭等等。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
        以下程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫中。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 中，該模組是 <code>Application</code> 類別的擴充功能函式。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能很有用。
    </p>
    

> 如果您將 `CORS` 外掛程式安裝到特定路由，您需要為此路由新增
`options` [處理器](server-routing.md#define_route)。這使得 Ktor 能夠正確回應 CORS
預檢請求。

## 設定 CORS {id="configure"}

CORS 特定的配置設定由
[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)
類別公開。讓我們看看如何配置這些設定。

### 概述 {id="overview"}

假設您有一個伺服器監聽 `8080` 埠，其中 `/customer` [路由](server-routing.md)回應
[JSON](server-serialization.md#send_data) 資料。以下程式碼片段顯示了從客戶端（在另一個埠上工作）使用 Fetch API 發出的範例請求，以使此請求成為跨來源請求：

[object Promise]

為了在後端允許此類請求，您需要按如下方式配置 `CORS` 外掛程式：

[object Promise]

您可以在這裡找到完整範例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### 主機 {id="hosts"}

若要指定可以發出跨來源請求的允許主機，請使用 `allowHost` 函式。除了主機名稱之外，
您還可以指定埠號、子網域列表或支援的 HTTP 方案。

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

若要允許來自任何主機的跨來源請求，請使用 `anyHost` 函式。

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTP 方法 {id="methods"}

預設情況下，<code>%plugin_name%</code> 外掛程式允許 `GET`、`POST` 和 `HEAD` HTTP 方法。若要新增其他方法，請使用
`allowMethod` 函式。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 允許標頭 {id="headers"}

預設情況下，<code>%plugin_name%</code> 外掛程式允許由 `Access-Control-Allow-Headers` 管理的以下客戶端標頭：

* `Accept`
* `Accept-Language`
* `Content-Language`

若要允許其他標頭，請使用 `allowHeader` 函式。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

若要允許自訂標頭，請使用 `allowHeaders` 或 `allowHeadersPrefixed` 函式。例如，以下程式碼片段
顯示了如何允許以 `custom-` 為前綴的標頭。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 請注意，對於非簡單內容類型，`allowHeaders` 或 `allowHeadersPrefixed` 需要將
[allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html)
屬性設定為 `true`。

### 公開標頭 {id="expose-headers"}

`Access-Control-Expose-Headers` 標頭會將指定的標頭新增到瀏覽器中的 JavaScript 可以存取的允許清單中。
若要配置此類標頭，請使用 `exposeHeader` 函式。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 憑證 {id="credentials"}

預設情況下，瀏覽器不會隨跨來源請求傳送憑證資訊（例如 cookie 或身份驗證資訊）。
若要允許傳遞此資訊，請使用
`allowCredentials` 屬性將 `Access-Control-Allow-Credentials` 回應標頭設定為 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 雜項 {id="misc"}

<code>%plugin_name%</code> 外掛程式也允許您指定其他 CORS 相關設定。例如，您可以
使用 `maxAgeInSeconds` 來指定預檢請求的回應可以快取多久，而無需傳送另一個
預檢請求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

您可以從 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 了解其他配置選項。