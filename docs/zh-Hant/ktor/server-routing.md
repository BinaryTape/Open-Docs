[//]: # (title: 路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
路由 (Routing) 是一個核心外掛 (plugin)，用於在伺服器應用程式 (server application) 中處理傳入請求 (incoming requests)。
</link-summary>

路由 (Routing) 是 Ktor 的核心 [外掛](server-plugins.md)，用於在伺服器應用程式中處理傳入請求。當用戶端 (client) 向特定 URL (例如 `/hello`) 發出請求時，路由機制 (routing mechanism) 允許我們定義如何服務此請求。

## 安裝路由 {id="install_plugin"}

路由外掛可以透過以下方式安裝：

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

由於路由外掛在任何應用程式中都非常常見，因此有一個方便的 `routing` 函式 (function)，它使安裝路由變得更簡單。在下方的程式碼片段中，`install(RoutingRoot)` 被 `routing` 函式取代：

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## 定義路由處理器 {id="define_route"}

在 [安裝](#install_plugin) 路由外掛後，您可以在 `routing` 內部呼叫 [route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 函式來定義路由：
```kotlin
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.response.*

routing {
    route("/hello", HttpMethod.Get) {
        handle {
            call.respondText("Hello")
        }
    }
}
```

Ktor 也提供一系列函式，讓定義路由處理器 (route handler) 變得更為簡單和簡潔。例如，您可以將先前的程式碼取代為一個 [get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 函式，它現在只需要接收 URL 和處理請求的程式碼：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同樣地，Ktor 為所有其他動詞 (verb)（即 `put`、`post`、`head` 等等）提供了函式。

總之，您需要指定以下設定來定義路由：

*   **HTTP 動詞**

    選擇 HTTP 動詞，例如 `GET`、`POST`、`PUT` 等。最方便的方式是使用專用的動詞函式，例如 `get`、`post`、`put` 等。

*   **路徑模式**

    指定用於 [匹配 URL 路徑](#match_url) 的路徑模式 (path pattern)，例如 `/hello`、`/customer/{id}`。您可以將路徑模式直接傳遞給 `get`/`post`/等等函式，或者您可以使用 `route` 函式來分組 [路由處理器](#multiple_routes) 並定義 [巢狀路由](#nested_routes)。

*   **處理器**

    指定如何處理 [請求](server-requests.md) 和 [回應](server-responses.md)。在處理器內部，您可以存取 `ApplicationCall`、處理用戶端請求並傳送回應。

## 指定路徑模式 {id="match_url"}

傳遞給 [路由](#define_route) 函式 (`route`、`get`、`post` 等) 的路徑模式用於匹配 URL 的 _路徑_ 組件。路徑可以包含由斜線 `/` 字元分隔的一系列路徑片段 (path segment)。

> 請注意，Ktor 區分帶有和不帶有尾隨斜線 (trailing slash) 的路徑。您可以透過 [安裝](server-plugins.md#install) `IgnoreTrailingSlash` 外掛來更改此行為。

以下是幾個路徑範例：
*   `/hello`
    包含單一路徑片段的路徑。
*   `/order/shipment`
    包含多個路徑片段的路徑。您可以將此類路徑原樣傳遞給 [route/get/etc.](#define_route) 函式，或者透過 [巢狀化](#multiple_routes) 多個 `route` 函式來組織子路由。
*   `/user/{login}`
    帶有 `login` [路徑參數](#path_parameter) 的路徑，其值可在路由處理器內部存取。
*   `/user/*`
    帶有 [萬用字元](#wildcard) 的路徑，匹配任何路徑片段。
*   `/user/{...}`
    帶有 [尾卡](#tailcard) 的路徑，匹配 URL 路徑的其餘所有部分。
*   `/user/{param...}`
    包含 [帶尾卡的路徑參數](#path_parameter_tailcard) 的路徑。
*   `Regex("/.+/hello")`
    包含 [正規表達式](#regular_expression) 的路徑，匹配路徑片段直到並包括最後一次出現的 `/hello`。

### 萬用字元 {id="wildcard"}
_萬用字元_ (`*`) 匹配任何路徑片段且不可缺少。例如，`/user/*` 匹配 `/user/john`，但不匹配 `/user`。

### 尾卡 {id="tailcard"}
_尾卡_ (`{...}`) 匹配 URL 路徑的其餘所有部分，可以包含多個路徑片段，並且可以為空。例如，`/user/{...}` 匹配 `/user/john/settings` 以及 `/user`。

### 路徑參數 {id="path_parameter"}
_路徑參數_ (`{param}`) 匹配一個路徑片段並將其捕獲為名為 `param` 的參數。此路徑片段是強制性的，但您可以透過添加問號使其成為可選的：`{param?}`。例如：
*   `/user/{login}` 匹配 `/user/john`，但不匹配 `/user`。
*   `/user/{login?}` 匹配 `/user/john` 以及 `/user`。
    > 請注意，可選路徑參數 `{param?}` 只能用於路徑的末尾。
    >
    {type="note"}

若要在路由處理器內部存取參數值，請使用 `call.parameters` 屬性 (property)。例如，下方的程式碼片段中，`call.parameters["login"]` 將為 `/user/admin` 路徑返回 _admin_：
```kotlin
```
{src="snippets/_misc/RouteParameter.kt"}

> 如果請求包含查詢字串 (query string)，`call.parameters` 也包含此查詢字串的參數。要了解如何在處理器內部存取查詢字串及其參數，請參閱 [](server-requests.md#query_parameters)。

### 帶尾卡的路徑參數 {id="path_parameter_tailcard"}

帶尾卡的路徑參數 (`{param...}`) 匹配 URL 路徑的其餘所有部分，並將每個路徑片段的多個值放入以 `param` 為鍵的參數中。例如，`/user/{param...}` 匹配 `/user/john/settings`。
若要在路由處理器內部存取路徑片段的值，請使用 `call.parameters.getAll("param")`。對於上面的範例，`getAll` 函式將返回一個包含 _john_ 和 _settings_ 值的陣列。

### 正規表達式 {id="regular_expression"}

正規表達式 (Regular expressions) 可以用於所有定義路由處理器的函式：`route`、`get`、`post` 等等。

> 要了解更多關於正規表達式的資訊，請參閱 [Kotlin 文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)。

讓我們編寫一個匹配任何以 `/hello` 結尾的路徑的路由。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
透過此路由定義，任何傳入的以 `/hello` 結尾的路徑請求，例如 `/foo/hello`、`/bar/baz/hello` 等等，都將被匹配。

#### 在處理器中存取路徑部分

在正規表達式中，命名群組 (named groups) 是一種捕獲匹配模式的字串特定部分並為其指定名稱的方式。
語法 `(?<name>pattern)` 用於定義命名群組，其中 `name` 是群組的名稱，而 `pattern` 是匹配該群組的正規表達式模式。

透過在路由函式中定義命名群組，您可以捕獲路徑的一部分，然後在處理器函式中，您可以使用 `call.parameters` 物件 (object) 存取捕獲的參數。

例如，您可以定義一個路由，該路由匹配包含整數識別符後跟 `/hello` 的路徑請求。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("""(?<id>\d+)/hello""")) {
        val id = call.parameters["id"]!!
        call.respondText(id)
    }
}
```
在下方程式碼中，`(?<id>\d+)` 命名群組用於從請求路徑中捕獲整數識別符 `id`，並且 `call.parameters` 屬性用於在處理器函式中存取捕獲的 `id` 參數。

匿名群組 (Unnamed groups) 無法在正規表達式路由處理器內部存取，但您可以使用它們來匹配路徑。例如，路徑 `hello/world` 將被匹配，而 `hello/World` 則不會：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
此外，整個路徑片段需要被正規表達式消耗。例如，路徑模式 `get(Regex("[a-z]+"))` 將不匹配路徑 `"hello1"`，但將匹配路徑 `hello/1` 的 `hello` 部分，並將 `/1` 留給下一個路由。

## 定義多個路由處理器 {id="multiple_routes"}

### 依動詞函式分組路由 {id="group_by_verb"}

如果您想定義多個路由處理器（當然，這在任何應用程式中都是如此），您可以將它們添加到 `routing` 函式中：

```kotlin
routing {
    get("/customer/{id}") {

    }
    post("/customer") {

    }
    get("/order") {

    }
    get("/order/{id}") {
    
    }
}
```

在這種情況下，每個路由都有自己的函式，並回應特定的端點和 HTTP 動詞。

### 依路徑分組路由 {id="group_by_path"}

另一種方式是依路徑分組，您可以定義路徑，然後將該路徑的動詞作為巢狀函式放置，使用 `route` 函式：

```kotlin
routing {
    route("/customer") {
        get {

        }
        post {

        }
    }
    route("/order") {
        get {

        }
        get("/{id}") {

        }
    }
}
```

### 巢狀路由 {id="nested_routes"}

無論您如何進行分組，Ktor 也允許您將子路由 (sub-routes) 作為 `route` 函式的參數。這對於定義邏輯上是其他資源的子資源非常有用。
以下範例向我們展示如何回應發送到 `/order/shipment` 的 `GET` 和 `POST` 請求：

```kotlin
routing {
    route("/order") {
        route("/shipment") {
            get {
                
            }
            post {
                
            }
        }
    }
}
```

因此，每次 `route` 呼叫都會產生一個單獨的路徑片段。

傳遞給 [路由](#define_route) 函式 (`route`、`get`、`post` 等) 的路徑模式用於匹配 URL 的 _路徑_ 組件。路徑可以包含由斜線 `/` 字元分隔的一系列路徑片段。

## 路由擴充函式 {id="route_extension_function"}

一種常見模式是在 `Route` 型別上使用擴充函式 (extension functions) 來定義實際路由，讓我們可以輕鬆存取動詞並消除將所有路由放在單一路由函式中的混亂。您可以獨立於您決定如何分組路由的方式應用此模式。因此，第一個範例可以以更清晰的方式表示：

```kotlin
routing {
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}

fun Route.listOrdersRoute() {
    get("/order") {

    }
}

fun Route.getOrderRoute() {
    get("/order/{id}") {
        
    }
}

fun Route.totalizeOrderRoute() {
    get("/order/{id}/total") {
        
    }
}
```

有關演示此方法的完整範例，請參閱 [legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)。

> 為了我們的應用程式在可維護性方面能夠擴展，建議遵循某些 [結構模式](server-application-structure.md)。

## 追蹤路由 {id="trace_routes"}

配置 [日誌記錄](server-logging.md) 後，Ktor 啟用路由追蹤 (route tracing)，這有助於您確定某些路由未被執行的原因。例如，如果您 [執行](server-run.md) 應用程式並向指定端點發出請求，應用程式的輸出可能如下所示：

```Console
TRACE Application - Trace for [missing-page]
/, segment:0 -> SUCCESS @ /
  /, segment:0 -> SUCCESS @ /
    /(method:GET), segment:0 -> FAILURE "Not all segments matched" @ /(method:GET)
Matched routes:
  No results
Route resolve result:
  FAILURE "No matched subtrees found" @ /
```

> 若要在 [Native 伺服器](server-native.md) 上啟用路由追蹤，請在 [執行](server-run.md) 應用程式時將 _TRACE_ 值傳遞給 `KTOR_LOG_LEVEL` 環境變數。