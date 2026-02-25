[//]: # (title: 路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
路由是伺服器應用程式中處理傳入請求的核心外掛程式。
</link-summary>

路由（Routing）是 Ktor 用於處理伺服器應用程式傳入請求的核心[外掛程式](server-plugins.md)。當用戶端向特定 URL（例如 `/hello`）發送請求時，路由機制允許我們定義該請求的服務方式。

## 安裝路由 {id="install_plugin"}

路由外掛程式可以透過以下方式安裝：

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

由於路由外掛程式在任何應用程式中都非常常見，因此有一個方便的 `routing` 函式可以簡化安裝過程。在下方的程式碼片段中，`install(RoutingRoot)` 被替換為 `routing` 函式：

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## 定義路由處理常式 {id="define_route"}

[安裝](#install_plugin)路由外掛程式後，您可以在 `routing` 內呼叫 [route](https://api.ktor.io/ktor-server-core/io.ktor.server.routing/route.html) 函式來定義路由：
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

Ktor 還提供了一系列函式，使定義路由處理常式變得更加簡單且簡潔。例如，您可以使用 [get](https://api.ktor.io/ktor-server-core/io.ktor.server.routing/get.html) 函式替換先前的程式碼，現在只需提供 URL 和處理請求的程式碼：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同樣地，Ktor 為所有其他動詞提供了函式，即 `put`、`post`、`head` 等。

總結來說，定義路由時需要指定以下設定：

* **HTTP 動詞**

  選擇 HTTP 動詞，例如 `GET`、`POST`、`PUT` 等。最方便的方法是使用專用的動詞函式，例如 `get`、`post`、`put` 等。

* **路徑模式**

  指定用於[比對 URL 路徑](#match_url)的路徑模式，例如 `/hello`、`/customer/{id}`。您可以將路徑模式直接傳遞給 `get`/`post` 等函式，也可以使用 `route` 函式來組合[路由處理常式](#multiple_routes)並定義[巢狀路由](#nested_routes)。
  
* **處理常式**

  指定如何處理[請求](server-requests.md)和[回應](server-responses.md)。在處理常式內部，您可以存取 `ApplicationCall`、處理用戶端請求並發送回應。

## 指定路徑模式 {id="match_url"}

傳遞給[路由](#define_route)函式（`route`、`get`、`post` 等）的路徑模式用於比對 URL 的 _路徑（path）_ 部分。路徑可以包含由斜線 `/` 字元分隔的一系列路徑線段（path segments）。

> 請注意，Ktor 會區分帶有和不帶有尾隨斜線的路徑。您可以透過[安裝](server-plugins.md#install) `IgnoreTrailingSlash` 外掛程式來更改此行為。

以下是幾個路徑範例：
* `/hello`  
  包含單一路徑線段的路徑。
* `/order/shipment`  
  包含多個路徑線段的路徑。您可以原封不動地將此路徑傳遞給 [route/get/等](#define_route) 函式，或透過[巢狀](#multiple_routes)多個 `route` 函式來組織子路由。
* `/user/{login}`  
  帶有 `login` [路徑參數](#path_parameter)的路徑，其值可以在路由處理常式內部存取。
* `/user/*`  
  帶有[萬用字元](#wildcard)的路徑，可比對任何路徑線段。
* `/user/{...}`  
  帶有[末端比對符 (tailcard)](#tailcard) 的路徑，可比對 URL 路徑的其餘所有部分。
* `/user/{param...}`  
  包含[帶有末端比對符的路徑參數](#path_parameter_tailcard)的路徑。
* `Regex("/.+/hello")`  
  包含[正規表示式](#regular_expression)的路徑，比對直到並包含最後一次出現 `/hello` 的路徑線段。

### 萬用字元 {id="wildcard"}
_萬用字元_ (`*`) 比對任何路徑線段，且不能缺失。例如，`/user/*` 比對 `/user/john`，但不比對 `/user`。

### 末端比對符 {id="tailcard"}
_末端比對符 (tailcard)_ (`{...}`) 比對 URL 路徑的其餘所有部分，可以包含多個路徑線段，也可以為空。例如，`/user/{...}` 既可以比對 `/user/john/settings`，也可以比對 `/user`。

### 路徑參數 {id="path_parameter"}
_路徑參數_ (`{param}`) 比對一個路徑線段，並將其擷取為名為 `param` 的參數。此路徑線段是強制性的，但您可以透過添加問號使其成為選填：`{param?}`。例如：
* `/user/{login}` 比對 `/user/john`，但不比對 `/user`。
* `/user/{login?}` 既可以比對 `/user/john`，也可以比對 `/user`。
   > 請注意，選填路徑參數 `{param?}` 只能用於路徑的末尾。
   >
   {type="note"}

要存取路由處理常式內部的參數值，請使用 `call.parameters` 屬性。例如，在下方的程式碼片段中，對於 `/user/admin` 路徑，`call.parameters["login"]` 將傳回 _admin_：
```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

> 如果請求包含查詢字串，`call.parameters` 也會包含該查詢字串的參數。要了解如何存取處理常式內部的查詢字串及其參數，請參閱[查詢參數](server-requests.md#query_parameters)。

### 帶有末端比對符的路徑參數 {id="path_parameter_tailcard"}

帶有末端比對符的路徑參數 (`{param...}`) 比對 URL 路徑的其餘所有部分，並使用 `param` 作為鍵，將每個路徑線段的多個值放入參數中。例如，`/user/{param...}` 比對 `/user/john/settings`。
要存取路由處理常式內部的路徑線段值，請使用 `call.parameters.getAll("param")`。對於上述範例，`getAll` 函式將傳回一個包含 _john_ 和 _settings_ 值的陣列。

### 正規表示式 {id="regular_expression"}

正規表示式可用於所有定義路由處理常式的函式：`route`、`get`、`post` 等。

> 若要進一步了解正規表示式，請參閱 [Kotlin 文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)。

讓我們寫一個比對任何以 `/hello` 結尾路徑的路由。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
透過此路由定義，任何指向以 `/hello` 結尾路徑的傳入請求（例如 `/foo/hello`、`/bar/baz/hello` 等）都將被比對。

#### 在處理常式中存取路徑部分

在正規表示式中，具名群組（named groups）是一種擷取字串中符合模式的特定部分並為其指定名稱的方法。
語法 `(?<name>pattern)` 用於定義具名群組，其中 `name` 是群組的名稱，而 `pattern` 是比對該群組的正規表示式模式。

透過在路由函式中定義具名群組，您可以擷取路徑的一部分，然後在處理常式函式中，您可以使用 `call.parameters` 物件存取擷取的參數。

例如，您可以定義一個路由，比對包含整數識別碼後跟 `/hello` 的路徑請求。

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
在下方的程式碼中，`(?<id>\d+)` 具名群組用於從請求路徑中擷取整數識別碼 `id`，而 `call.parameters` 屬性則用於在處理常式函式中存取擷取的 `id` 參數。

匿名群組無法在正規表示式路由處理常式內部存取，但您可以使用它們來比對路徑。例如，路徑 `hello/world` 會被比對，而 `hello/World` 則不會：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
此外，整個路徑線段都需要被正規表示式消耗。例如，路徑模式 `get(Regex("[a-z]+"))` 不會比對路徑 `"hello11"`，但會比對路徑 `hello/1` 的 `hello` 部分，並將 `/1` 留給下一個路由。

## 定義多個路由處理常式 {id="multiple_routes"}

### 按動詞函式分組路由 {id="group_by_verb"}

如果您想定義多個路由處理常式（這對於任何應用程式來說都是必然的），您只需將它們添加到 `routing` 函式中即可：

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

在這種情況下，每個路由都有自己的函式，並對應到特定的端點和 HTTP 動詞。

### 按路徑分組路由 {id="group_by_path"}

另一種方法是按路徑分組，您可以定義路徑，然後使用 `route` 函式將該路徑的動詞作為巢狀函式放置：

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

無論您如何進行分組，Ktor 還允許您將子路由作為 `route` 函式的參數。
這對於定義邏輯上為其他資源子資源的資源非常有用。
以下範例向我們展示了如何回應對 `/order/shipment` 的 `GET` 和 `POST` 請求：

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

因此，每次 `route` 呼叫都會產生一個獨立的路徑線段。

傳遞給[路由](#define_route)函式（`route`、`get`、`post` 等）的路徑模式用於比對 URL 的 _路徑（path）_ 部分。路徑可以包含由斜線 `/` 字元分隔的一系列路徑線段。

## 路由擴充函式 {id="route_extension_function"}

一種常見的模式是在 `Route` 型別上使用擴充函式來定義實際路由，這讓我們可以輕鬆存取動詞，並消除將所有路由放在單一路由函式中所造成的混亂。無論您決定如何分組路由，都可以套用此模式。因此，第一個範例可以透過更乾淨的方式表示：

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

有關示範此方法的完整範例，請參閱 [legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)。

> 為了讓應用程式在可維護性方面具有擴展性，建議遵循特定的[結構化模式](server-routing-organization.md)。

## 追蹤路由 {id="trace_routes"}

配置好[記錄](server-logging.md)後，Ktor 會啟用路由追蹤，協助您判斷某些路由未被執行的原因。
例如，如果您[執行](server-run.md)應用程式並向指定端點發送請求，應用程式的輸出可能如下所示：

```Console
TRACE Application - Trace for [missing-page]
/, segment:0 -> SUCCESS @ /
  /, segment:0 -> SUCCESS @ /
    / [(method:GET)], segment:0 -> FAILURE "Not all segments matched" @ / [(method:GET)]
Matched routes:
  No results
Route resolve result:
  FAILURE "No matched subtrees found" @ /
```

> 要在 [Native 伺服器](server-native.md)上啟用路由追蹤，請在[執行](server-run.md)應用程式時將 _TRACE_ 值傳遞給 `KTOR_LOG_LEVEL` 環境變數。