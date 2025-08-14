[//]: # (title: 应用程序监控)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

Ktor 通过使用事件提供了监控服务器应用程序的能力。
你可以处理与应用程序生命周期相关的预定义事件（应用程序启动、停止等），或者你可以使用自定义事件来处理特定情况。你还可以使用 [MonitoringEvent](server-custom-plugins.md#handle-app-events) 钩子来处理自定义插件的事件。

## 事件定义 {id="event-definition"}

每个事件都由 [EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html) 类实例表示。此类有一个 `T` 类型参数，用于指定传递给事件的值的类型。此值可以作为 lambda 实参在 [事件处理器](#handle-events-application) 中访问。例如，大多数 [预定义事件](#predefined-events) 接受 `Application` 作为形参，允许你在事件处理器内部访问应用程序属性。

对于 [自定义事件](#custom-events)，你可以传递此事件所需的类型形参。
下面的代码片段展示了如何创建一个接受 `ApplicationCall` 实例的自定义 `NotFoundEvent`。

[object Promise]

[](#custom-events) 章节展示了当服务器针对某个资源返回 `404 Not Found` 状态码时，如何在自定义插件中触发此事件。

### 预定义应用程序事件 {id="predefined-events"}

Ktor 提供了以下与应用程序生命周期相关的预定义事件：

- [ApplicationStarting](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopped.html)

例如，你可以订阅 `ApplicationStopped` 事件来释放应用程序资源。

## 在应用程序中处理事件 {id="handle-events-application"}

要处理指定 `Application` 实例的事件，请使用 `monitor` 属性。
此属性提供对 [Events](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-events/index.html) 实例的访问，该实例暴露了以下函数，允许你处理应用程序事件：

- `subscribe`: 订阅由 [EventDefinition](#event-definition) 指定的事件。
- `unsubscribe`: 取消订阅由 [EventDefinition](#event-definition) 指定的事件。
- `raise`: 使用指定值触发由 [EventDefinition](#event-definition) 指定的事件。
  > [](#custom-events) 章节展示了如何触发自定义事件。

`subscribe` / `unsubscribe` 函数接受 `EventDefinition` 实例，其中 `T` 值作为 lambda 实参。
以下示例展示了如何订阅 `ApplicationStarted` 事件并在事件处理器中 [记录](server-logging.md) 一条消息：

[object Promise]

在此示例中，你可以看到如何处理 `ApplicationStopped` 事件：

[object Promise]

有关完整示例，请参见 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 在自定义插件中处理事件 {id="handle-events-plugin"}

你可以使用 `MonitoringEvent` 钩子在 [自定义插件](server-custom-plugins.md#handle-app-events) 中处理事件。
以下示例展示了如何创建 `ApplicationMonitoringPlugin` 插件并处理 `ApplicationStarted` 和 `ApplicationStopped` 事件：

[object Promise]

你可以在此处找到完整示例：[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 自定义事件 {id="custom-events"}

在本节中，我们将了解如何创建一个自定义事件，该事件在服务器返回 `404 Not Found` 状态码时触发。

1. 首先，你需要创建 [事件定义](#event-definition)。
   下面的代码片段展示了如何创建一个接受 `ApplicationCall` 作为参数的自定义 `NotFoundEvent` 事件。

   [object Promise]
2. 要触发该事件，请调用 `Events.raise` 函数。下面的示例展示了如何处理 `ResponseSent` [钩子](server-custom-plugins.md#other)，以便在调用的状态码为 `404` 时触发新创建的事件。

   [object Promise]
3. 要在 Application 中处理创建的事件，请 [安装](server-plugins.md#install) 插件：

   [object Promise]

4. 然后，使用 `Events.subscribe` 订阅事件：

   [object Promise]

有关完整示例，请参见 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。