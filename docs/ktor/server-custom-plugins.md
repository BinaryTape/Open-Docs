[//]: # (title: 自定义服务器插件)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
了解如何创建您自己的自定义插件。
</link-summary>

从 v2.0.0 版本开始，Ktor 提供了一个新的 API 用于创建自定义 [插件](server-plugins.md)。通常，此 API 不需要理解 Ktor 内部概念，例如流水线、阶段等。相反，您可以通过使用 `onCall`、`onCallReceive` 和 `onCallRespond` 处理程序来访问 [请求和响应处理](#call-handling) 的不同阶段。

> 本主题中描述的 API 适用于 v2.0.0 及更高版本。对于旧版本，您可以使用 [基础 API](server-custom-plugins-base-api.md)。

## 创建并安装您的第一个插件 {id="first-plugin"}

在本节中，我们将演示如何创建并安装您的第一个插件。
您可以将 [创建、打开并运行新的 Ktor 项目](server-create-a-new-project.topic) 教程中创建的应用程序作为起始项目。

1.  要创建插件，请调用
    [createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html)
    函数并传入插件名称：
    ```kotlin
    import io.ktor.server.application.*
    
    val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
        println("SimplePlugin is installed!")
    }
    ```

    此函数返回 `ApplicationPlugin` 实例，该实例将在下一步中用于安装插件。
    > 还有一个
    [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html)
    函数允许您创建可以 [安装到特定路由](server-plugins.md#install-route) 的插件。
2.  要 [安装插件](server-plugins.md#install)，请将创建的 `ApplicationPlugin` 实例传入应用程序初始化代码中的 `install` 函数：
    ```kotlin
    fun Application.module() {
        install(SimplePlugin)
    }
    ```
3.  最后，[运行](server-run.md) 您的应用程序，在控制台输出中查看插件的欢迎信息：
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```

您可以在此处找到完整示例：[SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
在以下章节中，我们将探讨如何在不同阶段处理调用并提供插件配置。

## 处理调用 {id="call-handling"}

在您的自定义插件中，您可以使用一组提供对调用不同阶段访问权限的处理程序来 [处理请求](server-requests.md) 和 [响应](server-responses.md)：

*   [onCall](#on-call) 允许您获取请求/响应信息，修改响应参数（例如，[添加自定义标头](#custom-header)）等。
*   [onCallReceive](#on-call-receive) 允许您获取并转换从客户端接收到的数据。
*   [onCallRespond](#on-call-respond) 允许您在将数据发送到客户端之前进行转换。
*   [on(...)](#other) 允许您调用特定的钩子，这些钩子可能有助于处理调用的其他阶段或调用期间发生的异常。
*   如果需要，您可以使用 `call.attributes` 在不同处理程序之间共享 [调用状态](#call-state)。

### onCall {id="on-call"}

`onCall` 处理程序接受 `ApplicationCall` 作为 lambda 实参。这允许您访问请求/响应信息并修改响应参数（例如，[添加自定义标头](#custom-header)）。如果您需要转换请求/响应正文，请使用 [onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)。

#### 示例 1: 请求日志记录 {id="request-logging"}

以下示例展示了如何使用 `onCall` 创建一个自定义插件来记录传入请求：

```kotlin
val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}
```

如果您安装此插件，应用程序将在控制台中显示请求的 URL，例如：

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 示例 2: 自定义标头 {id="custom-header"}

此示例演示了如何创建一个插件，为每个响应添加自定义标头：

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

结果是，自定义标头将添加到所有响应中：

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

请注意，此插件中的自定义标头名称和值是硬编码的。您可以通过提供 [插件配置](#plugin-configuration) 来传入所需的自定义标头名称/值，使此插件更灵活。

### onCallReceive {id="on-call-receive"}

`onCallReceive` 处理程序提供 `transformBody` 函数，并允许您转换从客户端接收到的数据。假设客户端发出一个示例 `POST` 请求，其正文包含 `10` 作为 `text/plain`：

```HTTP
POST http://localhost:8080/transform-data
Content-Type: text/plain

10

```

要将此 [正文作为整数值接收](server-requests.md#objects)，您需要为 `POST` 请求创建路由处理程序，并调用 `call.receive` 并传入 `Int` 形参：

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
}
```

现在，我们创建一个插件，将正文作为整数值接收并为其加 `1`。为此，我们需要在 `onCallReceive` 内部处理 `transformBody`，如下所示：

```kotlin
val DataTransformationPlugin = createApplicationPlugin(name = "DataTransformationPlugin") {
    onCallReceive { call ->
        transformBody { data ->
            if (requestedType?.type == Int::class) {
                val line = data.readUTF8Line() ?: "1"
                line.toInt() + 1
            } else {
                data
            }
        }
    }
}
```

上面代码片段中的 `transformBody` 工作方式如下：

1.  `TransformBodyContext` 是一个 [lambda 接收者](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)，它包含有关当前请求的类型信息。在上面的示例中，`TransformBodyContext.requestedType` 属性用于检测请求的数据类型。
2.  `data` 是一个 lambda 实参，允许您将请求正文接收为 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 并将其转换为所需类型。在上面的示例中，`ByteReadChannel.readUTF8Line` 用于读取请求正文。
3.  最后，您需要转换并返回数据。在我们的示例中，将 `1` 添加到接收到的整数值。

您可以在此处找到完整示例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond` 也提供 `transformBody` 处理程序，并允许您转换要发送到客户端的数据。
当在路由处理程序中调用 `call.respond` 函数时，此处理程序将被执行。让我们继续 [onCallReceive](#on-call-receive) 中的示例，其中在 `POST` 请求处理程序中接收一个整数值：

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
    call.respond(data)
}
```

调用 `call.respond` 会调用 `onCallRespond`，这反过来允许您转换要发送到客户端的数据。例如，以下代码片段展示了如何将 `1` 添加到初始值：

```kotlin
onCallRespond { call ->
    transformBody { data ->
        if (data is Int) {
            (data + 1).toString()
        } else {
            data
        }
    }
}
```

您可以在此处找到完整示例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### 其他有用的处理程序 {id="other"}

除了 `onCall`、`onCallReceive` 和 `onCallRespond` 处理程序之外，Ktor 还提供了一组特定的钩子，可能有助于处理调用的其他阶段。
您可以使用接受 `Hook` 作为形参的 `on` 处理程序来处理这些钩子。
这些钩子包括：

-   `CallSetup` 作为处理调用的第一步被调用。
-   `ResponseBodyReadyForSend` 当响应正文经过所有转换并准备好发送时被调用。
-   `ResponseSent` 当响应成功发送到客户端时被调用。
-   `CallFailed` 当调用因异常而失败时被调用。
-   [AuthenticationChecked](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)
    在 [身份验证](server-auth.md) 凭据检测后执行。以下示例展示了如何使用此钩子来实现
    授权：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下示例展示了如何处理 `CallSetup`：

```kotlin
on(CallSetup) { call->
    // ...
}
```

> 还有一个 `MonitoringEvent` 钩子，允许您 [处理应用程序事件](#handle-app-events)，例如应用程序启动或关闭。

### 共享调用状态 {id="call-state"}

自定义插件允许您共享与调用相关的任何值，因此您可以在处理此调用的任何处理程序中访问此值。此值以唯一键作为属性存储在 `call.attributes` 集合中。以下示例演示了如何使用属性来计算接收请求和读取正文之间的时间：

```kotlin
val DataTransformationBenchmarkPlugin = createApplicationPlugin(name = "DataTransformationBenchmarkPlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    onCall { call ->
        val onCallTime = System.currentTimeMillis()
        call.attributes.put(onCallTimeKey, onCallTime)
    }

    onCallReceive { call ->
        val onCallTime = call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read body delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}
```

如果您发出 `POST` 请求，插件将在控制台中打印延迟：

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

您可以在此处找到完整示例：[DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> 您还可以在 [路由处理程序](server-requests.md#request_information) 中访问调用属性。

## 处理应用程序事件 {id="handle-app-events"}

[on](#other) 处理程序提供使用 `MonitoringEvent` 钩子来处理与应用程序生命周期相关的事件的能力。
例如，您可以将以下 [预定义事件](server-events.md#predefined-events) 传递给 `on` 处理程序：

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

以下代码片段展示了如何使用 `ApplicationStopped` 处理应用程序关闭：

```kotlin
package com.example.plugins

import io.ktor.events.EventDefinition
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.application.hooks.*

val ApplicationMonitoringPlugin = createApplicationPlugin(name = "ApplicationMonitoringPlugin") {
    on(MonitoringEvent(ApplicationStarted)) { application ->
        application.log.info("Server is started")
    }
    on(MonitoringEvent(ApplicationStopped)) { application ->
        application.log.info("Server is stopped")
        // 释放资源并取消订阅事件
        application.monitor.unsubscribe(ApplicationStarted) {}
        application.monitor.unsubscribe(ApplicationStopped) {}
    }
    on(ResponseSent) { call ->
        if (call.response.status() == HttpStatusCode.NotFound) {
            this@createApplicationPlugin.application.monitor.raise(NotFoundEvent, call)
        }
    }
}

val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()

```

这可能有助于释放应用程序资源。

## 提供插件配置 {id="plugin-configuration"}

[自定义标头](#custom-header) 示例演示了如何创建为每个响应添加预定义自定义标头的插件。让我们让这个插件更有用，并提供一个配置，用于传入所需的自定义标头名称/值。

1.  首先，您需要定义一个配置类：

    ```kotlin
    class PluginConfiguration {
        var headerName: String = "Custom-Header-Name"
        var headerValue: String = "Default value"
    }
    ```

2.  要在插件中使用此配置，请将配置类引用传递给 `createApplicationPlugin`：

    ```kotlin
    val CustomHeaderPlugin = createApplicationPlugin(
        name = "CustomHeaderPlugin",
        createConfiguration = ::PluginConfiguration
    ) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
        pluginConfig.apply {
            onCall { call ->
                call.response.headers.append(headerName, headerValue)
            }
        }
    }
    ```

    鉴于插件配置字段是可变的，建议将其保存在局部变量中。

3.  最后，您可以如下安装和配置插件：

    ```kotlin
    install(CustomHeaderPlugin) {
        headerName = "X-Custom-Header"
        headerValue = "Hello, world!"
    }
    ```

> 您可以在此处找到完整示例：[CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### 文件中的配置 {id="configuration-file"}

Ktor 允许您在 [配置文件](server-create-and-configure.topic#engine-main) 中指定插件设置。
让我们看看如何为 `CustomHeaderPlugin` 实现这一点：

1.  首先，将带有插件设置的新组添加到 `application.conf` 或 `application.yaml` 文件中：

    <Tabs group="config">
    <TabItem title="application.conf" group-key="hocon">

    ```shell
    http {
        custom_header {
            header_name = X-Another-Custom-Header
            header_value = Some value
        }
    }
    ```

    </TabItem>
    <TabItem title="application.yaml" group-key="yaml">

    ```yaml
    http:
      custom_header:
        header_name: X-Another-Custom-Header
        header_value: Some value
    ```

    </TabItem>
    </Tabs>

    在我们的示例中，插件设置存储在 `http.custom_header` 组中。

2.  要访问配置文件属性，请将 `ApplicationConfig` 传递给配置类构造函数。
    `tryGetString` 函数返回指定的属性值：

    ```kotlin
    class CustomHeaderConfiguration(config: ApplicationConfig) {
        var headerName: String = config.tryGetString("header_name") ?: "Custom-Header-Name"
        var headerValue: String = config.tryGetString("header_value") ?: "Default value"
    }
    ```

3.  最后，将 `http.custom_header` 值赋给 `createApplicationPlugin` 函数的 `configurationPath` 形参：

    ```kotlin
    val CustomHeaderPluginConfigurable = createApplicationPlugin(
        name = "CustomHeaderPluginConfigurable",
        configurationPath = "http.custom_header",
        createConfiguration = ::CustomHeaderConfiguration
    ) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
        pluginConfig.apply {
            onCall { call ->
                call.response.headers.append(headerName, headerValue)
            }
        }
    }
    ```

> 您可以在此处找到完整示例：[CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## 访问应用程序设置 {id="app-settings"}

### 配置 {id="config"}

您可以使用 `applicationConfig` 属性访问服务器配置，该属性返回 `ApplicationConfig` 实例。以下示例展示了如何获取服务器使用的主机和端口：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 环境 {id="environment"}

要访问应用程序的环境，请使用 `environment` 属性。例如，此属性允许您检测 [开发模式](server-development-mode.topic) 是否启用：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val isDevMode = environment?.developmentMode
   onCall { call ->
      if (isDevMode == true) {
         println("handling request ${call.request.uri}")
      }
   }
}
```

## 杂项 {id="misc"}

### 存储插件状态 {id="plugin-state"}

要存储插件的状态，您可以从处理程序 lambda 中捕获任何值。请注意，建议通过使用并发数据结构和原子数据类型使所有状态值保持线程安全：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val activeRequests = AtomicInteger(0)
   onCall {
      activeRequests.incrementAndGet()
   }
   onCallRespond {
      activeRequests.decrementAndGet()
   }
}
```

### 数据库 {id="databases"}

*   我可以使用自定义插件与可挂起数据库配合使用吗？

    可以。所有处理程序都是挂起函数，因此您可以在插件内部执行任何可挂起数据库操作。但不要忘记为特定调用释放资源（例如，通过使用 [on(ResponseSent)](#other)）。

*   如何将自定义插件与阻塞数据库配合使用？

    由于 Ktor 使用协程和挂起函数，向阻塞数据库发出请求可能很危险，因为执行阻塞调用的协程可能会被阻塞，然后永远挂起。为防止这种情况，您需要创建一个单独的 [CoroutineContext](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)：
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    然后，一旦创建了上下文，将对数据库的每个调用封装到 `withContext` 调用中：
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }
    ```