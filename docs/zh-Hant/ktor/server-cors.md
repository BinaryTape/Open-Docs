[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="模組允許您透過分組路由來組織應用程式。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

如果您的伺服器需要處理[跨來源請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，
您需要安裝並配置
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html)
Ktor 外掛。此外掛允許您配置允許的主機、HTTP 方法、客戶端設定的標頭等等。

## 添加依賴 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛<a href="#install">安裝</a>到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段顯示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫中。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 中，該模組是 <code>Application</code> 類別的擴展函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 外掛也可以<a href="#install-route">安裝到特定的路由</a>。
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能會很有用。
</p>

> 如果您將 `CORS` 外掛安裝到特定的路由，您需要將 `options` [處理器](server-routing.md#define_route)添加到此路由。這允許 Ktor 正確回應 CORS 預檢請求。

## 配置 CORS {id="configure"}

CORS 特定的配置設定由
[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)
類別提供。讓我們看看如何配置這些設定。

### 概述 {id="overview"}

假設您有一個伺服器正在監聽 `8080` 埠，帶有 `/customer` [路由](server-routing.md)回應 [JSON](server-serialization.md#send_data) 資料。以下程式碼片段顯示了從在另一個埠上工作的客戶端使用 Fetch API 發出的範例請求，以使此請求成為跨來源請求：

```javascript
function saveCustomer() {
    fetch('http://0.0.0.0:8080/customer',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({id: 3, firstName: "Jet", lastName: "Brains"})
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

```

若要允許後端發出此類請求，您需要如下配置 `CORS` 外掛：

```kotlin
install(CORS) {
    allowHost("0.0.0.0:8081")
    allowHeader(HttpHeaders.ContentType)
}
```

您可以在此處找到完整的範例：[cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### 主機 {id="hosts"}

若要指定可以發出跨來源請求的允許主機，請使用 `allowHost` 函數。除了主機名稱，您還可以指定埠號、子網域列表或支援的 HTTP 方案。

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

預設情況下，`%plugin_name%` 外掛允許 `GET`、`POST` 和 `HEAD` HTTP 方法。若要添加額外的方法，請使用 `allowMethod` 函數。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 允許標頭 {id="headers"}

預設情況下，`%plugin_name%` 外掛允許由 `Access-Control-Allow-Headers` 管理的以下客戶端標頭：

* `Accept`
* `Accept-Language`
* `Content-Language`

若要允許額外的標頭，請使用 `allowHeader` 函數。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

若要允許自訂標頭，請使用 `allowHeaders` 或 `allowHeadersPrefixed` 函數。例如，以下程式碼片段顯示如何允許以 `custom-` 為字首的標頭。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 請注意，`allowHeaders` 或 `allowHeadersPrefixed` 需要將 [allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html) 屬性設定為 `true`，以處理非簡單的內容類型。

### 公開標頭 {id="expose-headers"}

`Access-Control-Expose-Headers` 標頭將指定的標頭添加到瀏覽器中 JavaScript 可以訪問的允許列表中。
若要配置這類標頭，請使用 `exposeHeader` 函數。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 憑證 {id="credentials"}

預設情況下，瀏覽器不會隨跨來源請求傳送憑證資訊（例如 cookie 或身份驗證資訊）。若要允許傳遞此資訊，請使用 `allowCredentials` 屬性將 `Access-Control-Allow-Credentials` 回應標頭設定為 `true`。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 其他 {id="misc"}

`%plugin_name%` 外掛還允許您指定其他 CORS 相關設定。例如，您可以使用 `maxAgeInSeconds` 來指定預檢請求的回應可以被快取多長時間，而無需傳送另一個預檢請求。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

您可以從 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html) 了解其他配置選項。