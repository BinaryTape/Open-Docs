[//]: # (title: 應用程式監控)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<p>
    <b>Code example</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 提供了使用事件監控伺服器應用程式的功能。
您可以處理與應用程式生命週期相關的預定義事件（應用程式啟動、停止等），或使用自訂事件來處理特定情況。您也可以使用 [MonitoringEvent](server-custom-plugins.md#handle-app-events) 掛鉤來處理自訂外掛程式的事件。

## 事件定義 {id="event-definition"}

每個事件都由 [EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html) 類別實例表示。此類別具有一個 `T` 類型參數，用於指定傳遞給事件的值類型。此值可以在 [事件處理器](#handle-events-application) 中作為 Lambda 參數存取。例如，大多數 [預定義事件](#predefined-events) 都接受 `Application` 作為參數，允許您在事件處理器內部存取應用程式屬性。

對於 [自訂事件](#custom-events)，您可以傳遞此事件所需的類型參數。
下面的程式碼片段展示了如何建立一個接受 `ApplicationCall` 實例的自訂 `NotFoundEvent`。

```kotlin
val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
```

[自訂事件](#custom-events) 部分展示了當伺服器對資源返回 `404 Not Found` 狀態碼時，如何在自訂外掛程式中引發此事件。

### 預定義應用程式事件 {id="predefined-events"}

Ktor 提供了以下與應用程式生命週期相關的預定義事件：

- [ApplicationStarting](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopped.html)

例如，您可以訂閱 `ApplicationStopped` 事件以釋放應用程式資源。

## 在應用程式中處理事件 {id="handle-events-application"}

要處理指定 `Application` 實例的事件，請使用 `monitor` 屬性。
此屬性提供對 [Events](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-events/index.html) 實例的存取，該實例公開了以下函數，允許您處理應用程式事件：

- `subscribe`: 訂閱由 [EventDefinition](#event-definition) 指定的事件。
- `unsubscribe`: 取消訂閱由 [EventDefinition](#event-definition) 指定的事件。
- `raise`: 以指定的值引發由 [EventDefinition](#event-definition) 指定的事件。
  > [自訂事件](#custom-events) 部分展示了如何引發自訂事件。

`subscribe` / `unsubscribe` 函數接受帶有 `T` 值的 `EventDefinition` 實例作為 Lambda 參數。
以下範例展示了如何訂閱 `ApplicationStarted` 事件並在事件處理器中 [記錄](server-logging.md) 訊息：

```kotlin
fun Application.module() {
    monitor.subscribe(ApplicationStarted) { application ->
        application.environment.log.info("Server is started")
    }
}
```

在此範例中，您可以看到如何處理 `ApplicationStopped` 事件：

```kotlin
fun Application.module() {
    monitor.subscribe(ApplicationStopped) { application ->
        application.environment.log.info("Server is stopped")
        // Release resources and unsubscribe from events
        monitor.unsubscribe(ApplicationStarted) {}
        monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

有關完整範例，請參閱 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 在自訂外掛程式中處理事件 {id="handle-events-plugin"}

您可以使用 `MonitoringEvent` 掛鉤在 [自訂外掛程式](server-custom-plugins.md#handle-app-events) 中處理事件。
以下範例展示了如何建立 `ApplicationMonitoringPlugin` 外掛程式並處理 `ApplicationStarted`
和 `ApplicationStopped` 事件：

```kotlin
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
        // Release resources and unsubscribe from events
        application.monitor.unsubscribe(ApplicationStarted) {}
        application.monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

您可以在此處找到完整範例：[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 自訂事件 {id="custom-events"}

在本節中，我們將探討如何建立一個在伺服器對資源返回 `404 Not Found` 狀態碼時引發的自訂事件。

1. 首先，您需要建立 [事件定義](#event-definition)。
   下面的程式碼片段展示了如何建立一個接受 `ApplicationCall` 作為參數的自訂 `NotFoundEvent` 事件。

   ```kotlin
   val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
   ```
2. 要引發事件，請呼叫 `Events.raise` 函數。以下範例展示了如何處理 `ResponseSent` [掛鉤](server-custom-plugins.md#other)，以便在呼叫的狀態碼為 `404` 時引發新建立的事件。

   ```kotlin
   import io.ktor.events.EventDefinition
   import io.ktor.http.*
   import io.ktor.server.application.*
   import io.ktor.server.application.hooks.*
   
   val ApplicationMonitoringPlugin = createApplicationPlugin(name = "ApplicationMonitoringPlugin") {
       on(ResponseSent) { call ->
           if (call.response.status() == HttpStatusCode.NotFound) {
               this@createApplicationPlugin.application.monitor.raise(NotFoundEvent, call)
           }
       }
   }
   ```
3. 要在 Application 中處理建立的事件，請 [安裝](server-plugins.md#install) 外掛程式：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
   }
   ```

4. 然後，使用 `Events.subscribe` 訂閱事件：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
       monitor.subscribe(NotFoundEvent) { call ->
           log.info("No page was found for the URI: ${call.request.uri}")
       }
   }
   ```

有關完整範例，請參閱 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。