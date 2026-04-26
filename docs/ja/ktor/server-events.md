[//]: # (title: アプリケーションのモニタリング)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktorは、イベントを使用してサーバーアプリケーションをモニタリングする機能を提供します。
アプリケーションのライフサイクルに関連する定義済みのイベント（アプリケーションの開始、停止など）を処理したり、特定のケースを処理するためにカスタムイベントを使用したりできます。また、[MonitoringEvent](server-custom-plugins.md#handle-app-events)フックを使用して、カスタムプラグインのイベントを処理することもできます。

## イベント定義 {id="event-definition"}

各イベントは、[EventDefinition](https://api.ktor.io/ktor-events/io.ktor.events/-event-definition/index.html)クラスのインスタンスによって表されます。このクラスには、イベントに渡される値の型を指定する `T` 型パラメータがあります。この値には、[イベントハンドラー](#handle-events-application)内でラムダの引数としてアクセスできます。例えば、ほとんどの[定義済みのイベント](#predefined-events)は、パラメータとして `Application` を受け取るため、イベントハンドラー内でアプリケーションのプロパティにアクセスできます。

[カスタムイベント](#custom-events)では、そのイベントに必要な型パラメータを渡すことができます。
以下のコードスニペットは、`ApplicationCall` インスタンスを受け取るカスタムの `NotFoundEvent` を作成する方法を示しています。

```kotlin
val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
```

[カスタムイベント](#custom-events)のセクションでは、サーバーがリソースに対して `404 Not Found` ステータスコードを返したときに、カスタムプラグイン内でこのイベントを発生させる方法について説明します。

### 定義済みのアプリケーションイベント {id="predefined-events"}

Ktorは、アプリケーションのライフサイクルに関連する以下の定義済みイベントを提供しています：

- [ApplicationStarting](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-starting.html)
- [ApplicationStarted](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-started.html)
- [ServerReady](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-server-ready.html)
- [ApplicationStopPreparing](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stop-preparing.html)
- [ApplicationStopping](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stopping.html)
- [ApplicationStopped](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-stopped.html)

例えば、アプリケーションのリソースを解放するために `ApplicationStopped` イベントをサブスクライブできます。

## アプリケーションでのイベント処理 {id="handle-events-application"}

指定された `Application` インスタンスのイベントを処理するには、`monitor` プロパティを使用します。
このプロパティは、アプリケーションイベントを処理するための以下の関数を公開する [Events](https://api.ktor.io/ktor-events/io.ktor.events/-events/index.html) インスタンスへのアクセスを提供します：

- `subscribe`: [EventDefinition](#event-definition) で指定されたイベントをサブスクライブします。
- `unsubscribe`: [EventDefinition](#event-definition) で指定されたイベントのサブスクライブを解除します。
- `raise`: 指定された値を使用して、 [EventDefinition](#event-definition) で指定されたイベントを発生させます。
  > [カスタムイベント](#custom-events)セクションでは、カスタムイベントを発生させる方法について説明します。

`subscribe` / `unsubscribe` 関数は、`T` 型の値をラムダ引数として受け取る `EventDefinition` インスタンスを引数に取ります。
以下の例は、`ApplicationStarted` イベントをサブスクライブし、イベントハンドラーでメッセージを[ログ](server-logging.md)に記録する方法を示しています：

```kotlin
fun Application.module() {
    monitor.subscribe(ApplicationStarted) { application ->
        application.environment.log.info("Server is started")
    }
}
```

この例では、`ApplicationStopped` イベントを処理する方法を確認できます：

```kotlin
fun Application.module() {
    monitor.subscribe(ApplicationStopped) { application ->
        application.environment.log.info("Server is stopped")
        // リソースを解放し、イベントの購読を解除する
        monitor.unsubscribe(ApplicationStarted) {}
        monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/events)を参照してください。

## カスタムプラグインでのイベント処理 {id="handle-events-plugin"}

`MonitoringEvent` フックを使用して、[カスタムプラグイン](server-custom-plugins.md#handle-app-events)内でイベントを処理できます。
以下の例は、`ApplicationMonitoringPlugin` プラグインを作成し、`ApplicationStarted` と `ApplicationStopped` イベントを処理する方法を示しています：

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
        // リソースを解放し、イベントの購読を解除する
        application.monitor.unsubscribe(ApplicationStarted) {}
        application.monitor.unsubscribe(ApplicationStopped) {}
    }
}
```

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/events)にあります。

## カスタムイベント {id="custom-events"}

このセクションでは、サーバーがリソースに対して `404 Not Found` ステータスコードを返したときに発生するカスタムイベントを作成する方法を見ていきます。

1. まず、[イベント定義](#event-definition)を作成する必要があります。
   以下のコードスニペットは、`ApplicationCall` をパラメータとして受け取るカスタムの `NotFoundEvent` イベントを作成する方法を示しています。

   ```kotlin
   val NotFoundEvent: EventDefinition<ApplicationCall> = EventDefinition()
   ```
2. イベントを発生させるには、`Events.raise` 関数を呼び出します。以下のサンプルは、コールのステータスコードが `404` の場合に、新しく作成されたイベントを発生させるために `ResponseSent` [フック](server-custom-plugins.md#other)を処理する方法を示しています。

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
3. アプリケーションで作成したイベントを処理するには、プラグインを[インストール](server-plugins.md#install)します：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
   }
   ```

4. 次に、`Events.subscribe` を使用してイベントをサブスクライブします：

   ```kotlin
   fun Application.module() {
       install(ApplicationMonitoringPlugin)
       monitor.subscribe(NotFoundEvent) { call ->
           log.info("No page was found for the URI: ${call.request.uri}")
       }
   }
   ```

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/events)を参照してください。