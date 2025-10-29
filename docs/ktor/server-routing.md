[//]: # (title: 路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
路由是用于处理服务器应用程序中传入请求的核心插件。
</link-summary>

路由是 Ktor 用于处理服务器应用程序中传入请求的核心 [插件](server-plugins.md)。当客户端向特定 URL（例如，`/hello`）发出请求时，路由机制允许我们定义如何处理此请求。

## 安装路由 {id="install_plugin"}

可以通过以下方式安装路由插件：

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

鉴于路由插件在任何应用程序中都非常常见，Ktor 提供了一个便捷的 `routing` 函数，使得安装路由变得更简单。在下面的代码片段中，`install(RoutingRoot)` 被 `routing` 函数取代：

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## 定义路由处理程序 {id="define_route"}

[安装](#install_plugin)路由插件后，你可以在 `routing` 内部调用 [route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 函数来定义路由：
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

Ktor 还提供了一系列函数，使得定义路由处理程序更加容易和简洁。例如，你可以用一个 [get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 函数来替换之前的代码，该函数现在只需要接收 URL 和处理请求的代码：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
类似地，Ktor 为所有其他动词（即 `put`、`post`、`head` 等）都提供了函数。

总而言之，你需要指定以下设置来定义一个路由：

* **HTTP 动词**

  选择 HTTP 动词，例如 `GET`、`POST`、`PUT` 等。最方便的方式是使用专门的动词函数，例如 `get`、`post`、`put` 等。

* **路径模式**

  指定一个用于 [匹配 URL 路径](#match_url) 的路径模式，例如 `/hello`、`/customer/{id}`。你可以将路径模式直接传递给 `get`/`post`/etc. 函数，或者使用 `route` 函数来分组 [路由处理程序](#multiple_routes) 并定义 [嵌套路由](#nested_routes)。
  
* **处理程序**

  指定如何处理 [请求](server-requests.md) 和 [响应](server-responses.md)。在处理程序内部，你可以访问 `ApplicationCall`，处理客户端请求并发送响应。

## 指定路径模式 {id="match_url"}

传递给 [路由](#define_route) 函数（`route`、`get`、`post` 等）的路径模式用于匹配 URL 的 _路径_ 部分。路径可以包含由斜杠 `/` 字符分隔的一系列路径段。

> 注意，Ktor 区分带尾部斜杠和不带尾部斜杠的路径。你可以通过 [安装](server-plugins.md#install) `IgnoreTrailingSlash` 插件来改变此行为。

下面是几个路径示例：
* `/hello`  
  包含单个路径段的路径。
* `/order/shipment`  
  包含多个路径段的路径。你可以将此类路径原样传递给 [route/get/etc.](#define_route) 函数，或者通过 [嵌套](#multiple_routes) 多个 `route` 函数来组织子路由。
* `/user/{login}`  
  带 `login` [路径参数](#path_parameter) 的路径，其值可在路由处理程序内部访问。
* `/user/*`  
  带 [通配符](#wildcard) 的路径，匹配任何路径段。
* `/user/{...}`  
  带 [尾部通配符](#tailcard) 的路径，匹配 URL 路径的其余所有部分。
* `/user/{param...}`  
  包含带 [尾部通配符的路径参数](#path_parameter_tailcard) 的路径。
* `Regex("/.+/hello")`  
  包含 [正则表达式](#regular_expression) 的路径，匹配路径段直到并包括最后一次出现的 `/hello`。

### 通配符 {id="wildcard"}
_通配符_（`*`）匹配任何路径段且不能为空。例如，`/user/*` 匹配 `/user/john`，但不匹配 `/user`。

### 尾部通配符 {id="tailcard"}
_尾部通配符_（`{...}`）匹配 URL 路径的其余所有部分，可以包含多个路径段，并且可以为空。例如，`/user/{...}` 匹配 `/user/john/settings` 以及 `/user`。

### 路径参数 {id="path_parameter"}
_路径参数_（`{param}`）匹配一个路径段并将其捕获为名为 `param` 的参数。此路径段是强制性的，但你可以通过添加问号使其可选：`{param?}`。例如：
* `/user/{login}` 匹配 `/user/john`，但不匹配 `/user`。
* `/user/{login?}` 匹配 `/user/john` 以及 `/user`。
   > 请注意，可选的路径参数 `{param?}` 只能用在路径的末尾。
   >
   {type="note"}

要访问路由处理程序内的参数值，请使用 `call.parameters` 属性。例如，在下面的代码片段中，`call.parameters["login"]` 对于 `/user/admin` 路径将返回 _admin_：
```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

> 如果请求包含查询字符串，`call.parameters` 也包含此查询字符串的参数。要了解如何在处理程序内部访问查询字符串及其参数，请参见 [查询参数](server-requests.md#query_parameters)。

### 带尾部通配符的路径参数 {id="path_parameter_tailcard"}

带尾部通配符的路径参数（`{param...}`）匹配 URL 路径的其余所有部分，并将每个路径段的多个值以 `param` 为键放入参数中。例如，`/user/{param...}` 匹配 `/user/john/settings`。
要访问路由处理程序内部的路径段值，请使用 `call.parameters.getAll("param")`。对于上述示例，`getAll` 函数将返回一个包含 _john_ 和 _settings_ 值的数组。

### 正则表达式 {id="regular_expression"}

正则表达式可以与所有定义路由处理程序的函数一起使用：`route`、`get`、`post` 等。

> 要了解更多关于正则表达式的信息，请参见 [Kotlin 文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)。

让我们编写一个匹配任何以 `/hello` 结尾的路径的路由。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
通过此路由定义，任何传入的以 `/hello` 结尾的路径请求，例如 `/foo/hello`、`/bar/baz/hello` 等，都将被匹配。

#### 在处理程序中访问路径部分

在正则表达式中，命名组是一种捕获与模式匹配的字符串特定部分并为其分配名称的方式。
语法 `(?<name>pattern)` 用于定义命名组，其中 `name` 是组的名称，`pattern` 是匹配该组的正则表达式模式。

通过在路由函数中定义命名组，你可以捕获路径的一部分，然后在处理程序函数中，可以使用 `call.parameters` 对象访问捕获的参数。

例如，你可以定义一个路由，匹配包含整数标识符后跟 `/hello` 的路径请求。

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
在下面的代码中，`(?<id>\d+)` 命名组用于从请求路径中捕获整数标识符 `id`，并且 `call.parameters` 属性用于在处理程序函数中访问捕获的 `id` 参数。

未命名的组不能在正则表达式路由处理程序内部访问，但你可以使用它们来匹配路径。例如，路径 `hello/world` 将被匹配，而 `hello/World` 则不会：

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
此外，整个路径段需要被正则表达式消耗。例如，路径模式 `get(Regex("[a-z]+"))` 不会匹配路径 `"hello1"`，但会匹配路径 `hello/1` 中的 `hello` 部分，并将 `/1` 留给下一个路由。

## 定义多个路由处理程序 {id="multiple_routes"}

### 按动词函数分组路由 {id="group_by_verb"}

如果你想定义多个路由处理程序，这在任何应用程序中都是常见情况，你只需将它们添加到 `routing` 函数中：

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

在这种情况下，每个路由都有自己的函数，并响应特定的端点和 HTTP 动词。

### 按路径分组路由 {id="group_by_path"}

另一种方法是按路径分组，即你定义路径，然后将该路径的动词作为嵌套函数放置，使用 `route` 函数：

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

### 嵌套路由 {id="nested_routes"}

无论你如何分组，Ktor 还允许你将子路由作为参数传递给 `route` 函数。这对于定义逻辑上是其他资源的子资源的资源很有用。以下示例展示了如何响应 `/order/shipment` 的 `GET` 和 `POST` 请求：

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

因此，每个 `route` 调用都会生成一个单独的路径段。

## 路由扩展函数 {id="route_extension_function"}

一种常见的模式是在 `Route` 类型上使用扩展函数来定义实际的路由，这使得我们可以轻松访问动词，并避免将所有路由都放在一个 `routing` 函数中造成的混乱。你可以独立于你决定如何分组路由来应用此模式。因此，第一个示例可以用更清晰的方式表示：

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

有关演示此方法的完整示例，请参见 [legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)。

> 为了使我们的应用程序在可维护性方面实现可伸缩性，建议遵循某些 [结构化模式](server-application-structure.md)。
>
> {type="note"}

## 追踪路由 {id="trace_routes"}

配置了 [日志](server-logging.md) 后，Ktor 会启用路由追踪，帮助你确定某些路由未被执行的原因。例如，如果你 [运行](server-run.md) 应用程序并向指定的端点发出请求，应用程序的输出可能如下所示：

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

> 要在 [原生服务器](server-native.md) 上启用路由追踪，在 [运行](server-run.md) 应用程序时将 _TRACE_ 值传递给 `KTOR_LOG_LEVEL` 环境变量。
>
> {type="note"}