[//]: # (title: 路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
路由是處理伺服器應用程式中傳入請求的核心外掛。
</link-summary>

路由是 Ktor 核心[外掛](server-plugins.md)，用於處理伺服器應用程式中的傳入請求。當用戶端向特定 URL（例如，`/hello`）發出請求時，路由機制允許我們定義如何處理此請求。

## 安裝路由 {id="install_plugin"}

路由外掛可透過以下方式安裝：

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

鑑於路由外掛在任何應用程式中都非常常見，有一個方便的 `routing` 函式，使路由安裝更簡單。在下方程式碼片段中，`install(RoutingRoot)` 被取代為 `routing` 函式：

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## 定義路由處理器 {id="define_route"}

在[安裝](#install_plugin)路由外掛後，您可以在 `routing` 內部呼叫 [route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 函式來定義路由：
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

Ktor 也提供了一系列函式，讓定義路由處理器更加容易和簡潔。例如，您可以將前面的程式碼替換為一個 [get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 函式，該函式現在只需要接收 URL 和處理請求的程式碼：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同樣地，Ktor 為所有其他動詞（即 `put`、`post`、`head` 等等）提供了函式。

總結來說，您需要指定以下設定來定義路由：

* **HTTP 動詞**

  選擇 HTTP 動詞，例如 `GET`、`POST`、`PUT` 等等。最方便的方式是使用專用的動詞函式，例如 `get`、`post`、`put` 等等。

* **路徑模式**

  指定用於[匹配 URL 路徑](#match_url)的路徑模式，例如 `/hello`、`/customer/{id}`。您可以將路徑模式直接傳遞給 `get`/`post`/等等函式，或者您可以使用 `route` 函式來分組[路由處理器](#multiple_routes)並定義[巢狀路由](#nested_routes)。
  
* **處理器**

  指定如何處理[請求](server-requests.md)和[回應](server-responses.md)。在處理器內部，您可以存取 `ApplicationCall`、處理用戶端請求並傳送回應。

## 指定路徑模式 {id="match_url"}

傳遞給 [routing](#define_route) 函式（`route`、`get`、`post` 等）的路徑模式用於匹配 URL 的_路徑_部分。路徑可以包含由斜線 `/` 字元分隔的路徑區段序列。

> 請注意，Ktor 區分帶有和不帶尾部斜線的路徑。您可以透過[安裝](server-plugins.md#install) `IgnoreTrailingSlash` 外掛來更改此行為。

以下是幾個路徑範例：
* `/hello`  
  包含單個路徑區段的路徑。
* `/order/shipment`  
  包含多個路徑區段的路徑。您可以將此類路徑原樣傳遞給 [route/get/等等](#define_route) 函式，或透過[巢狀](#multiple_routes)多個 `route` 函式來組織子路由。
* `/user/{login}`  
  帶有 `login` [路徑參數](#path_parameter)的路徑，其值可以在路由處理器內部存取。
* `/user/*`  
  帶有[萬用字元](#wildcard)的路徑，該萬用字元匹配任何路徑區段。
* `/user/{...}`  
  帶有[尾部萬用字元](#tailcard)的路徑，該萬用字元匹配 URL 路徑的所有其餘部分。
* `/user/{param...}`  
  包含[帶尾部萬用字元的路徑參數](#path_parameter_tailcard)的路徑。
* `Regex("/.+/hello")`  
  包含[正規表示式](#regular_expression)的路徑，該正規表示式匹配路徑區段，直到（包括）最後一個 `/hello` 出現。

### 萬用字元 {id="wildcard"}
_萬用字元_ (`*`) 匹配任何路徑區段且不能缺失。例如，`/user/*` 匹配 `/user/john`，但不匹配 `/user`。

### 尾部萬用字元 {id="tailcard"}
_尾部萬用字元_ (`{...}`) 匹配 URL 路徑的所有其餘部分，可以包含多個路徑區段，並且可以為空。例如，`/user/{...}` 匹配 `/user/john/settings` 以及 `/user`。

### 路徑參數 {id="path_parameter"}
_路徑參數_ (`{param}`) 匹配路徑區段並將其捕獲為名為 `param` 的參數。此路徑區段是強制性的，但您可以透過添加問號使其成為可選的：`{param?}`。例如：
* `/user/{login}` 匹配 `/user/john`，但不匹配 `/user`。
* `/user/{login?}` 匹配 `/user/john` 以及 `/user`。
   > 請注意，可選的路徑參數 `{param?}` 只能用於路徑的末尾。
   >
   {type="note"}

若要存取路由處理器內部的參數值，請使用 `call.parameters` 屬性。例如，下方程式碼片段中的 `call.parameters["login"]` 對於 `/user/admin` 路徑將返回 _admin_：
[object Promise]

> 如果請求包含查詢字串，`call.parameters` 也包含此查詢字串的參數。若要了解如何在處理器內部存取查詢字串及其參數，請參閱 [](server-requests.md#query_parameters)。

### 帶尾部萬用字元的路徑參數 {id="path_parameter_tailcard"}

帶尾部萬用字元的路徑參數 (`{param...}`) 匹配 URL 路徑的所有其餘部分，並將每個路徑區段的多個值放入以 `param` 為鍵的參數中。例如，`/user/{param...}` 匹配 `/user/john/settings`。
若要存取路由處理器內部的路徑區段值，請使用 `call.parameters.getAll("param")`。對於上述範例，`getAll` 函式將返回包含 _john_ 和 _settings_ 值的一個陣列。

### 正規表示式 {id="regular_expression"}

正規表示式可以與所有定義路由處理器函式的函式一起使用：`route`、`get`、`post` 等等。

> 若要了解更多關於正規表示式的資訊，請參閱 [Kotlin 文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)。

讓我們編寫一個匹配任何以 `/hello` 結尾路徑的路由。

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

在正規表示式中，命名群組是一種捕獲字串中匹配模式的特定部分並為其指定名稱的方式。
語法 `(?<name>pattern)` 用於定義命名群組，其中 `name` 是群組的名稱，而 `pattern` 是匹配該群組的正規表示式模式。

透過在路由函式中定義命名群組，您可以捕獲路徑的一部分，然後在處理器函式中，您可以使用 `call.parameters` 物件存取捕獲的參數。

例如，您可以定義一個路由，該路由匹配包含一個整數識別碼後接 `/hello` 的路徑請求。

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
在下面的程式碼中，命名群組 `(?<id>\d+)` 用於從請求路徑中捕獲整數識別碼 `id`，且 `call.parameters` 屬性用於在處理器函式中存取捕獲的 `id` 參數。

未命名的群組無法在正規表示式路由處理器內部存取，但您可以使用它們來匹配路徑。例如，路徑 `hello/world` 將被匹配，而 `hello/World` 不會：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
此外，整個路徑區段需要被正規表示式消費。例如，路徑模式 `get(Regex("[a-z]+"))` 不會匹配路徑 `"hello1"`，但會匹配路徑 `hello/1` 中的 `hello` 部分，並將 `/1` 留給下一個路由。

## 定義多個路由處理器 {id="multiple_routes"}

### 按動詞函式分組路由 {id="group_by_verb"}

如果您想定義多個路由處理器（這當然是任何應用程式的情況），您只需將它們添加到 `routing` 函式中：

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

### 按路徑分組路由 {id="group_by_path"}

另一種方式是按路徑分組這些路由，透過這種方式，您可以定義路徑，然後使用 `route` 函式將該路徑的動詞作為巢狀函式放置：

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

無論您如何分組，Ktor 也允許您將子路由作為 `route` 函式的參數。這對於定義邏輯上是其他資源子資源的資源很有用。
以下範例展示了如何回應對 `/order/shipment` 的 `GET` 和 `POST` 請求：

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

因此，每個 `route` 呼叫都會產生一個單獨的路徑區段。

傳遞給 [routing](#define_route) 函式（`route`、`get`、`post` 等）的路徑模式用於匹配 URL 的_路徑_部分。路徑可以包含由斜線 `/` 字元分隔的路徑區段序列。

## 路由擴充函式 {id="route_extension_function"}

一種常見的模式是在 `Route` 類型上使用擴充函式來定義實際路由，讓使用者可以輕鬆存取動詞並消除將所有路由放在單一路由函式中的雜亂。您可以獨立於您決定如何分組路由的方式來應用此模式。因此，第一個範例可以以更簡潔的方式呈現：

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

有關展示此方法的完整範例，請參閱 [legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)。

> 為了讓我們的應用程式在可維護性方面能夠擴展，建議遵循某些[結構化模式](server-application-structure.md)。

## 追蹤路由 {id="trace_routes"}

設定[日誌記錄](server-logging.md)後，Ktor 啟用路由追蹤，協助您判斷某些路由為何未執行。
例如，如果您[執行](server-run.md)應用程式並向指定端點發出請求，應用程式的輸出可能如下所示：

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

> 若要在 [Native 伺服器](server-native.md)上啟用路由追蹤，請在[執行](server-run.md)應用程式時，將 _TRACE_ 值傳遞給 `KTOR_LOG_LEVEL` 環境變數。