[//]: # (title: 應用程式監控)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 提供透過事件來監控伺服器應用程式的功能。
您可以處理與應用程式生命週期相關的預定義事件（應用程式啟動、停止等），或者可以使用自訂事件來處理特定案例。您也可以使用 [MonitoringEvent](server-custom-plugins.md#handle-app-events) 掛鉤來處理自訂外掛程式的事件。

## 事件定義 {id="event-definition"}

每個事件均由 [EventDefinition](https://api.ktor.io/ktor-events/io.ktor.events/-event-definition/index.html) 類別執行個體表示。此類別具有一個 `T` 型別參數，用於指定傳遞給事件的值的型別。此值可以在 [事件處理常式](#handle-events-application) 中作為 Lambda 引數進行存取。例如，大多數 [預定義事件](#predefined-events) 都接受 `Application` 作為參數，允許您在事件處理常式內存取應用程式屬性。

對於 [自訂事件](#custom-events)，您可以傳遞此事件所需的型別參數。
下方的程式碼片段展示了如何建立一個接受 `ApplicationCall` 執行個體的自訂 `NotFoundEvent`。

```kotlin
val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
```

[自訂事件](#custom-events) 章節展示了當伺服器針對資源傳回 `404 Not Found` 狀態碼時，如何在自訂外掛程式中引發此事件。

### 預定義應用程式事件 {id="predefined-events"}

Ktor 提供以下與應用程式生命週期相關的預定義事件：

- [ApplicationStarting](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stopped.html)

例如，您可以訂閱 `ApplicationStopped` 事件以釋放應用程式資源。

## 在應用程式中處理事件 {id="handle-events-application"}

若要處理指定 `Application` 執行個體的事件，請使用 `monitor` 屬性。
此屬性提供對 [Events](https://api.ktor.io/ktor-events/io.ktor.events/-events/index.html) 執行個體的存取，該執行個體公開了以下允許您處理應用程式事件的函式：

- `subscribe`：訂閱由 [EventDefinition](#event-definition) 指定的事件。
- `unsubscribe`：取消訂閱由 [EventDefinition](#event-definition) 指定的事件。
- `raise`：以指定的值引發由 [EventDefinition](#event-definition) 指定的事件。
  > [自訂事件](#custom-events) 章節展示了如何引發自訂事件。

`subscribe` / `unsubscribe` 函式接受 `EventDefinition` 執行個體，並將 `T` 值作為 Lambda 引數。
下方的範例展示了如何訂閱 `ApplicationStarted` 事件並在事件處理常式中[記錄](server-logging.md)訊息：

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
        // 釋放資源並取消訂閱事件
        monitor.unsubscribe(ApplicationStarted) {}
        monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

如需完整範例，請參閱 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 在自訂外掛程式中處理事件 {id="handle-events-plugin"}

您可以使用 `MonitoringEvent` 掛鉤在 [自訂外掛程式](server-custom-plugins.md#handle-app-events) 中處理事件。
下方的範例展示了如何建立 `ApplicationMonitoringPlugin` 外掛程式並處理 `ApplicationStarted` 與 `ApplicationStopped` 事件：

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
        // 釋放資源並取消訂閱事件
        application.monitor.unsubscribe(ApplicationStarted) {}
        application.monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

您可以在此處找到完整範例：[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## 自訂事件 {id="custom-events"}

在此章節中，我們將探討如何建立一個在伺服器針對資源傳回 `404 Not Found` 狀態碼時引發的自訂事件。

1. 首先，您需要建立 [事件定義](#event-definition)。
   下方的程式碼片段展示了如何建立一個接受 `ApplicationCall` 作為參數的自訂 `NotFoundEvent` 事件。

   ```kotlin
   val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
   ```
2. 若要引發事件，請呼叫 `Events.raise` 函式。下方的範例展示了如何處理 `ResponseSent` [掛鉤](server-custom-plugins.md#other)，如果呼叫的狀態碼為 `404`，則引發新建立的事件。

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
3. 若要在應用程式中處理建立的事件，請 [安裝](server-plugins.md#install) 該外掛程式：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
   }
   ```

4. 接著，使用 `Events.subscribe` 訂閱該事件：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
       monitor.subscribe(NotFoundEvent) { call ->
           log.info("No page was found for the URI: ${call.request.uri}")
       }
   }
   ```

如需完整範例，請參閱 [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。