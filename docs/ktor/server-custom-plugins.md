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
了解如何创建自己的自定义插件。
</link-summary>

从 v2.0.0 开始，Ktor 提供了一种新的 API 用于创建自定义 [插件](server-plugins.md)。通常，此 API 不需要理解 Ktor 内部概念，例如管道线、阶段等。相反，你可以使用 `onCall`、`onCallReceive` 和 `onCallRespond` 处理程序，来访问 [处理请求和响应](#call-handling) 的不同阶段。

> 本主题中描述的 API 适用于 v2.0.0 及更高版本。对于旧版本，你可以使用 [基本 API](server-custom-plugins-base-api.md)。

## 创建并安装你的第一个插件 {id="first-plugin"}

在本节中，我们将演示如何创建并安装你的第一个插件。你可以使用在 [](server-create-a-new-project.topic) 教程中创建的应用程序作为起始项目。

1.  要创建插件，请调用
    [createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html)
    函数并传递插件名称：
    [object Promise]

    此函数返回 `ApplicationPlugin` 实例，该实例将在下一步中用于安装插件。
    > 还有
    [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html)
    函数，允许你创建可以 [安装到特定路由] 的插件。
2.  要 [安装插件](server-plugins.md#install)，请将创建的 `ApplicationPlugin` 实例传递给应用程序初始化代码中的 `install` 函数：
    [object Promise]
3.  最后，[运行](server-run.md) 你的应用程序，以在控制台输出中看到插件的欢迎信息：
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO Application - Responding at http://0.0.0.0:8080
    ```

你可以在此处找到完整示例：[SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
在以下部分中，我们将探讨如何在不同阶段处理调用并提供插件配置。

## 处理调用 {id="call-handling"}

在你的自定义插件中，你可以通过使用一组处理程序来 [处理请求](server-requests.md) 和 [响应](server-responses.md)，这些处理程序提供了对调用不同阶段的访问：

*   [onCall](#on-call) 允许你获取请求/响应信息、修改响应参数（例如，追加自定义标头）等。
*   [onCallReceive](#on-call-receive) 允许你获取并转换从客户端接收的数据。
*   [onCallRespond](#on-call-respond) 允许你在将数据发送到客户端之前对其进行转换。
*   [on(...)](#other) 允许你调用可能有助于处理调用其他阶段或调用期间发生的异常的特定钩子。
*   如果需要，你可以使用 `call.attributes` 在不同处理程序之间共享 [调用状态](#call-state)。

### onCall {id="on-call"}

`onCall` 处理程序接受 `ApplicationCall` 作为 lambda 实参。这允许你访问请求/响应信息并修改响应参数（例如，[追加自定义标头](#custom-header)）。如果你需要转换请求/响应正文，请使用 [onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)。

#### 示例 1: 请求日志记录 {id="request-logging"}

以下示例展示了如何使用 `onCall` 创建一个用于记录传入请求的自定义插件：

[object Promise]

如果你安装此插件，应用程序将在控制台中显示请求的 URL，例如：

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 示例 2: 自定义标头 {id="custom-header"}

此示例演示了如何创建一个为每个响应追加自定义标头的插件：

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

结果是，一个自定义标头将被添加到所有响应中：

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

请注意，此插件中的自定义标头名称和值是硬编码的。你可以通过提供一个 [配置](#plugin-configuration) 来传递所需的自定义标头名称/值，从而使此插件更灵活。

### onCallReceive {id="on-call-receive"}

`onCallReceive` 处理程序提供 `transformBody` 函数，允许你转换从客户端接收的数据。假设客户端发出一个示例 `POST` 请求，其正文中包含 `text/plain` 格式的 `10`：

[object Promise]

要将此 [正文作为整数值接收](server-requests.md#objects)，你需要为 `POST` 请求创建一个路由处理程序，并以 `Int` 实参调用 `call.receive`：

[object Promise]

现在，我们来创建一个插件，它接收一个整数值正文并对其加 `1`。为此，我们需要按如下方式在 `onCallReceive` 内部处理 `transformBody`：

[object Promise]

上述代码片段中的 `transformBody` 工作方式如下：

1.  `TransformBodyContext` 是一个 [lambda 接收者](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)，它包含有关当前请求的类型信息。在上述示例中，`TransformBodyContext.requestedType` 属性用于检测请求的数据类型。
2.  `data` 是一个 lambda 实参，它允许你将请求正文作为 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 接收并将其转换为所需的类型。在上述示例中，`ByteReadChannel.readUTF8Line` 用于读取请求正文。
3.  最后，你需要转换并返回数据。在我们的示例中，`1` 被添加到接收到的整数值。

你可以在此处找到完整示例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond` 也提供 `transformBody` 处理程序，允许你转换要发送给客户端的数据。当路由处理程序中调用 `call.respond` 函数时，此处理程序将被执行。让我们继续 [onCallReceive](#on-call-receive) 中的示例，其中在 `POST` 请求处理程序中接收一个整数值：

[object Promise]

调用 `call.respond` 会调用 `onCallRespond`，这反过来允许你转换要发送到客户端的数据。例如，下面的代码片段展示了如何将 `1` 添加到初始值：

[object Promise]

你可以在此处找到完整示例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### 其他有用的处理程序 {id="other"}

除了 `onCall`、`onCallReceive` 和 `onCallRespond` 处理程序外，Ktor 还提供了一组特定的钩子，可能有助于处理调用的其他阶段。
你可以使用 `on` 处理程序来处理这些钩子，该处理程序接受一个 `Hook` 作为形参。
这些钩子包括：

-   `CallSetup` 是处理调用的第一步。
-   `ResponseBodyReadyForSend` 当响应正文经过所有转换并准备好发送时被调用。
-   `ResponseSent` 当响应成功发送到客户端时被调用。
-   `CallFailed` 当调用因异常而失败时被调用。
-   [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)
    在 [认证](server-auth.md) 凭据检测后执行。以下示例展示了如何使用此钩子实现
    授权：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下示例展示了如何处理 `CallSetup`：

```kotlin
on(CallSetup) { call->
    // ...
}
```

> 还有 `MonitoringEvent` 钩子，它允许你 [处理应用程序事件](#handle-app-events)，例如应用程序启动或关闭。

### 共享调用状态 {id="call-state"}

自定义插件允许你共享与调用相关的任何值，因此你可以在处理此调用的任何处理程序内部访问此值。此值作为具有唯一键的属性存储在 `call.attributes` 集合中。以下示例演示了如何使用属性计算从接收请求到读取正文之间的时间：

[object Promise]

如果你发出 `POST` 请求，插件将在控制台中打印一个延迟：

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

你可以在此处找到完整示例：[DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> 你还可以在 [路由处理程序](server-requests.md#request_information) 中访问调用属性。

## 处理应用程序事件 {id="handle-app-events"}

[on](#other) 处理程序提供了使用 `MonitoringEvent` 钩子处理与应用程序生命周期相关事件的能力。
例如，你可以将以下 [预定义事件](server-events.md#predefined-events) 传递给 `on` 处理程序：

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

以下代码片段展示了如何使用 `ApplicationStopped` 处理应用程序关闭：

[object Promise]

这可能有助于释放应用程序资源。

## 提供插件配置 {id="plugin-configuration"}

[自定义标头](#custom-header) 示例演示了如何创建一个为每个响应追加预定义自定义标头的插件。让我们使这个插件更有用，并提供一个配置来传递所需的自定义标头名称/值。

1.  首先，你需要定义一个配置类：

    [object Promise]

2.  要在插件中使用此配置，请将配置类引用传递给 `createApplicationPlugin`：

    [object Promise]

    鉴于插件配置字段是可变的，建议将其保存在局部变量中。

3.  最后，你可以按如下方式安装和配置插件：

    [object Promise]

> 你可以在此处找到完整示例：[CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### 文件中的配置 {id="configuration-file"}

Ktor 允许你在 [配置文件](server-create-and-configure.topic#engine-main) 中指定插件设置。
让我们看看如何为 `CustomHeaderPlugin` 实现这一点：

1.  首先，将插件设置的新组添加到 `application.conf` 或 `application.yaml` 文件中：

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    [object Promise]

    </tab>
    <tab title="application.yaml" group-key="yaml">

    [object Promise]

    </tab>
    </tabs>

    在我们的示例中，插件设置存储在 `http.custom_header` 组中。

2.  要访问配置文件属性，请将 `ApplicationConfig` 传递给配置类的构造函数。
    `tryGetString` 函数返回指定的属性值：

    [object Promise]

3.  最后，将 `http.custom_header` 值赋给 `createApplicationPlugin` 函数的 `configurationPath` 形参：

    [object Promise]

> 你可以在此处找到完整示例：[CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## 访问应用程序设置 {id="app-settings"}

### 配置 {id="config"}

你可以使用 `applicationConfig` 属性访问服务器配置，它返回
`[ApplicationConfig]` 实例。以下示例展示了如何获取服务器使用的主机和端口：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 环境 {id="environment"}

要访问应用程序的环境，请使用 `environment` 属性。例如，此属性允许你确定是否启用了 [开发模式](server-development-mode.topic)：

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

## 其他 {id="misc"}

### 存储插件状态 {id="plugin-state"}

要存储插件的状态，你可以从处理程序 lambda 中捕获任何值。请注意，建议通过使用并发数据结构和原子数据类型来使所有状态值线程安全：

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

*   我可以使用自定义插件处理可挂起数据库吗？

    可以。所有处理程序都是挂起函数，因此你可以在插件内部执行任何可挂起数据库操作。但不要忘记为特定调用释放资源（例如，通过使用 [on(ResponseSent)](#other)）。

*   如何使用自定义插件处理阻塞式数据库？

    由于 Ktor 使用协程和挂起函数，向阻塞式数据库发出请求可能很危险，因为执行阻塞式调用的协程可能会被阻塞，然后永远挂起。为了防止这种情况，你需要创建一个单独的 [CoroutineContext]：
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    然后，一旦你的上下文被创建，将对数据库的每次调用包装到 `withContext` 调用中：
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }
    ```