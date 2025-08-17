[//]: # (title: アプリケーション監視)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktorは、イベントを使用することでサーバーアプリケーションを監視する機能を提供します。
アプリケーションのライフサイクル（アプリケーションの開始、停止など）に関連する事前定義されたイベントを処理したり、特定のケースを処理するためにカスタムイベントを使用したりできます。また、[MonitoringEvent](server-custom-plugins.md#handle-app-events)フックを使用して、カスタムプラグインのイベントを処理することもできます。

## イベント定義 {id="event-definition"}

各イベントは、[EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html)クラスのインスタンスによって表現されます。
このクラスには、イベントに渡される値の型を指定する`T`型パラメータがあります。この値は、ラムダ引数として[イベントハンドラー](#handle-events-application)内でアクセスできます。たとえば、ほとんどの[事前定義されたイベント](#predefined-events)は`Application`をパラメータとして受け入れるため、イベントハンドラー内でアプリケーションのプロパティにアクセスできます。

[カスタムイベント](#custom-events)の場合、このイベントに必要な型パラメータを渡すことができます。
以下のコードスニペットは、`ApplicationCall`インスタンスを受け入れるカスタム`NotFoundEvent`を作成する方法を示しています。

```kotlin
val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
```

[カスタムイベント](#custom-events)セクションでは、サーバーがリソースに対して`404 Not Found`ステータスコードを返したときに、カスタムプラグインでこのイベントを発生させる方法を示しています。

### 事前定義されたアプリケーションイベント {id="predefined-events"}

Ktorは、アプリケーションのライフサイクルに関連する以下の事前定義されたイベントを提供します。

- [ApplicationStarting](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-stopped.html)

たとえば、`ApplicationStopped`イベントを購読して、アプリケーションリソースを解放できます。

## アプリケーションでイベントを処理する {id="handle-events-application"}

指定された`Application`インスタンスのイベントを処理するには、`monitor`プロパティを使用します。
このプロパティは、アプリケーションイベントを処理できる以下の関数を公開する[Events](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-events/index.html)インスタンスへのアクセスを提供します。

- `subscribe`: [EventDefinition](#event-definition)で指定されたイベントを購読します。
- `unsubscribe`: [EventDefinition](#event-definition)で指定されたイベントの購読を解除します。
- `raise`: 指定された値で[EventDefinition](#event-definition)で指定されたイベントを発生させます。
  > [カスタムイベント](#custom-events)セクションでは、カスタムイベントを発生させる方法を示します。

`subscribe` / `unsubscribe`関数は、`T`値を持つ`EventDefinition`インスタンスをラムダ引数として受け入れます。
以下の例は、`ApplicationStarted`イベントを購読し、イベントハンドラーでメッセージを[ログ](server-logging.md)する方法を示しています。

```kotlin
fun Application.module() {
    monitor.subscribe(ApplicationStarted) { application ->
        application.environment.log.info("Server is started")
    }
}
```

この例では、`ApplicationStopped`イベントを処理する方法を確認できます。

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

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)を参照してください。

## カスタムプラグインでイベントを処理する {id="handle-events-plugin"}

`MonitoringEvent`フックを使用して、[カスタムプラグイン](server-custom-plugins.md#handle-app-events)でイベントを処理できます。
以下の例は、`ApplicationMonitoringPlugin`プラグインを作成し、`ApplicationStarted`および`ApplicationStopped`イベントを処理する方法を示しています。

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

完全な例はこちらから確認できます: [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## カスタムイベント {id="custom-events"}

このセクションでは、サーバーがリソースに対して`404 Not Found`ステータスコードを返したときに発生するカスタムイベントを作成する方法を見ていきます。

1. まず、[イベント定義](#event-definition)を作成する必要があります。
   以下のコードスニペットは、`ApplicationCall`をパラメータとして受け入れるカスタム`NotFoundEvent`イベントを作成する方法を示しています。

   ```kotlin
   val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
   ```
2. イベントを発生させるには、`Events.raise`関数を呼び出します。以下のサンプルは、`ResponseSent` [フック](server-custom-plugins.md#other)を処理して、呼び出しのステータスコードが`404`の場合に新しく作成されたイベントを発生させる方法を示しています。

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
3. アプリケーションで作成されたイベントを処理するには、プラグインを[インストール](server-plugins.md#install)します。

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
   }
   ```

4. 次に、`Events.subscribe`を使用してイベントを購読します。

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
       monitor.subscribe(NotFoundEvent) { call ->
           log.info("No page was found for the URI: ${call.request.uri}")
       }
   }
   ```

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)を参照してください。