[//]: # (title: 伺服器外掛)

<show-structure for="chapter" depth="2"/>

<link-summary>
外掛提供常見功能，例如序列化、內容編碼、壓縮等。
</link-summary>

Ktor 中典型的請求/回應管線如下所示：

![請求回應管線](request-response-pipeline.png){width="600"}

它始於一個請求，該請求被路由到一個特定的處理器，由我們的應用程式邏輯處理，並最終作出回應。

## 透過外掛新增功能 {id="add_functionality"}

許多應用程式需要超出應用程式邏輯範圍的常見功能。這可能是序列化和內容編碼、壓縮、標頭、Cookie 支援等。所有這些在 Ktor 中都透過我們稱之為**外掛**的方式提供。

如果我們查看先前的管線圖，外掛位於請求/回應與應用程式邏輯之間：

![外掛管線](plugin-pipeline.png){width="600"}

當請求進來時：

*   它透過路由機制路由到正確的處理器
*   在移交給處理器之前，它會經過一個或多個外掛
*   處理器（應用程式邏輯）處理請求
*   在回應傳送給客戶端之前，它會經過一個或多個外掛

## 路由是一個外掛 {id="routing"}

外掛的設計旨在提供最大的靈活性，並允許它們存在於請求/回應管線的任何區段中。
事實上，我們到目前為止稱之為 `routing` 的，不過就是一個外掛。

![路由作為外掛](plugin-pipeline-routing.png){width="600"}

## 新增外掛相依性 {id="dependency"}
大多數外掛都需要特定的相依性。例如，`CORS` 外掛需要將 `ktor-server-cors` Artifact 加入到建置腳本中：

<var name="artifact_name" value="ktor-server-cors"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝外掛 {id="install"}

外掛通常在伺服器的初始化階段使用 `install` 函式進行配置，該函式將外掛作為參數。根據您 [建立伺服器](server-create-and-configure.topic) 的方式，您可以在 `embeddedServer` 呼叫內部安裝外掛...

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

...或指定的 [模組](server-modules.md)：

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

除了攔截請求和回應之外，外掛還可以有一個選用的配置區段，該區段在此步驟中進行配置。

例如，在安裝 [Cookie](server-sessions.md#cookie) 時，我們可以設定某些參數，例如我們希望 Cookie 儲存在何處，或者它們的名稱：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
}
```

### 將外掛安裝到特定路由 {id="install-route"}

在 Ktor 中，您不僅可以全域安裝外掛，還可以將其安裝到特定的 [路由](server-routing.md)。如果您需要為不同的應用程式資源提供不同的外掛配置，這可能很有用。例如，下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes) 展示了如何為 `/index` 路由新增指定的 [快取標頭](server-caching-headers.md)：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

請注意，以下規則適用於同一外掛的多個安裝：
*   安裝到特定路由的外掛配置會覆寫其 [全域配置](#install)。
*   路由會合併相同路由的安裝，且最後一次安裝會生效。例如，對於這樣的應用程式...

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

   ...對 `/index/a` 和 `/index/b` 的兩個呼叫都僅由外掛的第二次安裝處理。

## 預設、可用及自訂外掛 {id="default_available_custom"}

預設情況下，Ktor 不會啟用任何外掛，因此由您決定安裝應用程式所需功能的外掛。

然而，Ktor 確實提供了多種開箱即用的外掛。您可以在 [Ktor 外掛註冊表](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server) 中查看這些外掛的完整列表。

此外，您還可以建立自己的 [自訂外掛](server-custom-plugins.md)。