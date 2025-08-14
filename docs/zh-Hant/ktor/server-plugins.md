[//]: # (title: 伺服器外掛)

<show-structure for="chapter" depth="2"/>

<link-summary>
外掛提供常見功能，例如序列化、內容編碼、壓縮等等。
</link-summary>

Ktor 中典型的請求/回應管道如下所示：

![Request Response Pipeline](request-response-pipeline.png){width="600"}

它從一個請求開始，該請求被路由到一個特定的處理器，由我們的應用程式邏輯處理，最後做出回應。

## 使用外掛添加功能 {id="add_functionality"}

許多應用程式需要超出應用程式邏輯範圍的常見功能。這可能包括序列化和內容編碼、壓縮、標頭、Cookie 支援等。所有這些功能在 Ktor 中都透過我們稱之為 **外掛** 的方式提供。

如果我們查看先前的管道圖，外掛位於請求/回應和應用程式邏輯之間：

![Plugin pipeline](plugin-pipeline.png){width="600"}

當請求進來時：

*   它透過路由機制被路由到正確的處理器
*   在移交給處理器之前，它會經過一個或多個外掛
*   處理器（應用程式邏輯）處理請求
*   在回應發送給客戶端之前，它會經過一個或多個外掛

## 路由是一種外掛 {id="routing"}

外掛的設計方式提供了最大的靈活性，允許它們出現在請求/回應管道的任何部分。事實上，我們至今稱之為 `routing` 的，不過就是一個外掛罷了。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## 添加外掛依賴 {id="dependency"}
大多數外掛都需要特定的依賴。例如，`CORS` 外掛要求在建置腳本中添加 `ktor-server-cors` artifact：

<var name="artifact_name" value="ktor-server-cors"/>

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
    

## 安裝外掛 {id="install"}

外掛通常在伺服器的初始化階段，使用以一個外掛作為參數的 `install` 函數來配置。根據您[建立伺服器](server-create-and-configure.topic)的方式，您可以將外掛安裝在 `embeddedServer` 呼叫內部...

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

... 或指定的[模組](server-modules.md)：

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

除了攔截請求和回應之外，外掛還可以有一個可選的配置部分，在此步驟中進行配置。

例如，在安裝 [Cookies](server-sessions.md#cookie) 時，我們可以設定某些參數，例如我們希望 Cookie 儲存的位置，或它們的名稱：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 將外掛安裝到特定路由 {id="install-route"}

在 Ktor 中，您不僅可以全域安裝外掛，還可以將其安裝到特定的[路由](server-routing.md)。如果您需要針對不同的應用程式資源使用不同的外掛配置，這可能很有用。例如，下面的[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)展示了如何為 `/index` 路由添加指定的[快取標頭](server-caching-headers.md)：

[object Promise]

請注意，以下規則適用於同一外掛的多個安裝：
*   安裝到特定路由的外掛配置會覆寫其[全域配置](#install)。
*   路由會合併同一路由的安裝，並且最後一次安裝會生效。例如，對於這樣的應用程式...
   
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
   {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // 首次配置 }"}
   
   ... 對 `/index/a` 和 `/index/b` 的兩個呼叫都僅由外掛的第二次安裝處理。

## 預設、可用和自訂外掛 {id="default_available_custom"}

預設情況下，Ktor 不會啟用任何外掛，因此您需要根據應用程式所需的功能安裝外掛。

然而，Ktor 確實提供了多種開箱即用的外掛。您可以在 [Ktor Plugin Registry](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server) 中查看這些外掛的完整列表。

此外，您還可以建立自己的[自訂外掛](server-custom-plugins.md)。