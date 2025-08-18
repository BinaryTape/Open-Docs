[//]: # (title: 伺服器插件)

<show-structure for="chapter" depth="2"/>

<link-summary>
插件提供常見功能，例如序列化、內容編碼、壓縮等等。
</link-summary>

Ktor 中典型的請求/回應管道如下所示：

![請求回應管道](request-response-pipeline.png){width="600"}

它始於一個請求，該請求被路由到特定的處理器，由我們的應用程式邏輯處理，並最終作出回應。

## 使用插件新增功能 {id="add_functionality"}

許多應用程式需要超出應用程式邏輯範圍的常見功能。這可能包括序列化和內容編碼、壓縮、標頭、Cookie 支援等。所有這些都在 Ktor 中透過我們稱之為 **插件** 的方式提供。

如果我們查看先前的管道圖，插件位於請求/回應與應用程式邏輯之間：

![插件管道](plugin-pipeline.png){width="600"}

當請求進來時：

* 它透過路由機制被路由到正確的處理器
* 在交給處理器之前，它會經過一個或多個插件
* 處理器（應用程式邏輯）處理請求
* 在回應傳送給客戶端之前，它會經過一個或多個插件

## 路由是一種插件 {id="routing"}

插件的設計方式旨在提供最大的靈活性，並允許它們存在於請求/回應管道的任何部分。事實上，我們直到現在一直稱之為 `routing` 的，不過就是一個插件。

![路由作為插件](plugin-pipeline-routing.png){width="600"}

## 添加插件依賴 {id="dependency"}
大多數插件都需要特定的依賴項。例如，`CORS` 插件需要在建構腳本中添加 `ktor-server-cors` 構件：

<var name="artifact_name" value="ktor-server-cors"/>
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

## 安裝插件 {id="install"}

插件通常在伺服器的初始化階段使用 `install` 函式進行配置，該函式將一個插件作為參數。根據您 [建立伺服器](server-create-and-configure.topic) 的方式，您可以在 `embeddedServer` 呼叫內部安裝插件...

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS)
        install(Compression)
        // ...
    }.start(wait = true)
}
```

... 或指定的 [模組](server-modules.md)：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun Application.module() {
    install(CORS)
    install(Compression)
    // ...
}
```

除了攔截請求和回應之外，插件還可以有一個可選的配置區塊，在此步驟中進行配置。

例如，在安裝 [Cookies](server-sessions.md#cookie) 時，我們可以設定某些參數，例如我們希望 Cookie 儲存在何處，或者它們的名稱：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 安裝插件到特定路由 {id="install-route"}

在 Ktor 中，您不僅可以全域安裝插件，還可以將其安裝到特定的 [路由](server-routing.md)。如果您需要針對不同的應用程式資源使用不同的插件配置，這可能很有用。例如，以下 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes) 顯示如何為 `/index` 路由添加指定的 [快取標頭](server-caching-headers.md)：

```kotlin
route("/index") {
    install(CachingHeaders) {
        options { call, content -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 1800)) }
    }
    get {
        call.respondText("Index page")
    }
}
```

請注意，以下規則適用於同一個插件的多個安裝：
* 安裝到特定路由的插件配置會覆寫其 [全域配置](#install)。
* 路由會合併相同路由的安裝，且最後一次安裝會生效。例如，對於這樣的應用程式...

   ```kotlin
   routing {
       route("index") {
           install(CachingHeaders) { /* First configuration */ }
           get("a") {
               // ...
           }
       }
       route("index") {
           install(CachingHeaders) { /* Second configuration */ }
           get("b") {
               // ...
           }
       }
   }
   ```
   {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // 第一次配置 }"}

   ... 對 `/index/a` 和 `/index/b` 的兩個呼叫都僅由插件的第二次安裝處理。

## 預設、可用和自訂插件 {id="default_available_custom"}

預設情況下，Ktor 不會啟用任何插件，因此您需要根據應用程式所需的功能自行安裝插件。

然而，Ktor 確實提供各種隨附的插件。您可以在 [Ktor 插件註冊表](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server) 中查看這些插件的完整列表。

此外，您還可以建立自己的 [自訂插件](server-custom-plugins.md)。