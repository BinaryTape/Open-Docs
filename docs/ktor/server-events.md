[//]: # (title: 应用程序监控)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

Ktor 提供了通过使用事件来监控您的服务器应用程序的能力。
您可以处理与应用程序生命周期相关的预定义事件（应用程序启动、停止等），也可以使用自定义事件来处理特定情况。您还可以使用 [MonitoringEvent](server-custom-plugins.md#handle-app-events) 钩子处理自定义插件的事件。

## 事件定义 {id="event-definition"}

每个事件都由 [EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html) 类实例表示。
此类具有一个 `T` 类型参数，用于指定传递给事件的值的类型。此值可以在 [事件处理器](#handle-events-application) 中作为 lambda 参数访问。例如，大多数 [预定义事件](#predefined-events) 接受 `Application` 作为参数，允许您在事件处理器内部访问应用程序属性。

对于 [自定义事件](#custom-events)，您可以传递此事件所需的类型参数。
以下代码片段展示了如何创建一个接受 `ApplicationCall` 实例的自定义 `NotFoundEvent`。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="25"}

[](#custom-events) 部分展示了当服务器返回资源的 `404 Not Found` 状态码时，如何在自定义插件中触发此事件。

### 预定义应用程序事件 {id="predefined-events"}

Ktor 提供了以下与应用程序生命周期相关的预定义事件：

- [ApplicationStarting](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopped.html)

例如，您可以订阅 `ApplicationStopped` 事件以释放应用程序资源。

## 在应用程序中处理事件 {id="handle-events-application"}

要处理指定 `Application` 实例的事件，请使用 `monitor` 属性。
此属性提供对 [Events](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-events/index.html) 实例的访问，该实例公开了以下函数，允许您处理应用程序事件：

- `subscribe`: 订阅由 [EventDefinition](#event-definition) 指定的事件。
- `unsubscribe`: 取消订阅由 [EventDefinition](#event-definition) 指定的事件。
- `raise`: 触发由 [EventDefinition](#event-definition) 指定的事件，并带有所指定的值。
  > [](#custom-events) 部分展示了如何触发自定义事件。

`subscribe` / `unsubscribe` 函数接受带有 `T` 值的 `EventDefinition` 实例作为 lambda 参数。
以下示例展示了如何订阅 `ApplicationStarted` 事件并在事件处理器中 [记录](server-logging.md) 消息：

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11,13-15,30"}

在此示例中，您可以看到如何处理 `ApplicationStopped` 事件：

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11,16-21,30"}

有关完整示例，请参阅 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 在自定义插件中处理事件 {id="handle-events-plugin"}

您可以使用 `MonitoringEvent` 钩子在 [自定义插件](server-custom-plugins.md#handle-app-events) 中处理事件。
以下示例展示了如何创建 `ApplicationMonitoringPlugin` 插件并处理 `ApplicationStarted` 和 `ApplicationStopped` 事件：

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="3-17,23"}

您可以在此处找到完整示例：[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 自定义事件 {id="custom-events"}

在本节中，我们将探讨如何创建一个自定义事件，该事件在服务器为资源返回 `404 Not Found` 状态码时触发。

1.  首先，您需要创建 [事件定义](#event-definition)。
    以下代码片段展示了如何创建一个接受 `ApplicationCall` 作为参数的自定义 `NotFoundEvent` 事件。

    ```kotlin
    ```
    {src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="25"}
2.  要触发事件，请调用 `Events.raise` 函数。以下示例展示了如何处理 `ResponseSent` [钩子](server-custom-plugins.md#other) 以在调用的状态码为 `404` 时触发新创建的事件。

    ```kotlin
    ```
    {src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="3-8,18-23"}
3.  要应用程序中处理已创建的事件，请 [安装](server-plugins.md#install) 插件：

    ```kotlin
    ```
    {src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11-12,30"}

4.  然后，使用 `Events.subscribe` 订阅事件：

    ```kotlin
    ```
    {src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11-12,22-24,30"}

有关完整示例，请参阅 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。