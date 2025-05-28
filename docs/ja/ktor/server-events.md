[//]: # (title: アプリケーションのモニタリング)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="events"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

Ktorはイベントを使用することで、サーバーアプリケーションをモニタリングする機能を提供します。
アプリケーションのライフサイクルに関連する事前定義されたイベント（アプリケーションの開始、停止など）を処理したり、特定のケースを処理するためにカスタムイベントを使用したりできます。また、[MonitoringEvent](server-custom-plugins.md#handle-app-events)フックを使用して、カスタムプラグインのイベントを処理することもできます。

## イベント定義 {id="event-definition"}

各イベントは、[EventDefinition](https://api.ktor.io/ktor-shared/ktor-events/io.ktor.events/-event-definition/index.html)クラスのインスタンスによって表現されます。このクラスには、イベントに渡される値の型を指定する`T`型パラメータがあります。この値は、[イベントハンドラー](#handle-events-application)でラムダ引数としてアクセスできます。たとえば、[事前定義されたイベント](#predefined-events)のほとんどは、`Application`をパラメータとして受け入れ、イベントハンドラー内でアプリケーションのプロパティにアクセスできます。

[カスタムイベント](#custom-events)の場合、このイベントに必要な型パラメータを渡すことができます。
以下のコードスニペットは、`ApplicationCall`インスタンスを受け入れるカスタム`NotFoundEvent`を作成する方法を示しています。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="25"}

[](#custom-events)セクションでは、サーバーがリソースに対して`404 Not Found`ステータスコードを返したときに、カスタムプラグインでこのイベントを発生させる方法を示しています。

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
- `raise`: [EventDefinition](#event-definition)で指定されたイベントを、指定された値で発生させます。
  > [](#custom-events)セクションでは、カスタムイベントを発生させる方法を示しています。

`subscribe` / `unsubscribe`関数は、`T`値を持つ`EventDefinition`インスタンスをラムダ引数として受け入れます。
以下の例は、`ApplicationStarted`イベントを購読し、イベントハンドラーでメッセージを[ログ](server-logging.md)に出力する方法を示しています。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11,13-15,30"}

この例では、`ApplicationStopped`イベントを処理する方法を示しています。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11,16-21,30"}

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)を参照してください。

## カスタムプラグインでイベントを処理する {id="handle-events-plugin"}

[カスタムプラグイン](server-custom-plugins.md#handle-app-events)では、`MonitoringEvent`フックを使用してイベントを処理できます。
以下の例は、`ApplicationMonitoringPlugin`プラグインを作成し、`ApplicationStarted`および`ApplicationStopped`イベントを処理する方法を示しています。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="3-17,23"}

完全な例は、こちらにあります: [events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)。

## カスタムイベント {id="custom-events"}

このセクションでは、サーバーがリソースに対して`404 Not Found`ステータスコードを返したときに発生するカスタムイベントを作成する方法について見ていきます。

1. まず、[イベント定義](#event-definition)を作成する必要があります。
   以下のコードスニペットは、`ApplicationCall`をパラメータとして受け入れるカスタム`NotFoundEvent`イベントを作成する方法を示しています。

   ```kotlin
   ```
   {src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="25"}
2. イベントを発生させるには、`Events.raise`関数を呼び出します。以下のサンプルは、呼び出しのステータスコードが`404`である場合に、新しく作成されたイベントを発生させるために`ResponseSent` [フック](server-custom-plugins.md#other)を処理する方法を示しています。

   ```kotlin
   ```
   {src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" include-lines="3-8,18-23"}
3. アプリケーションで作成されたイベントを処理するには、プラグインを[インストール](server-plugins.md#install)します。

   ```kotlin
   ```
   {src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11-12,30"}

4. 次に、`Events.subscribe`を使用してイベントを購読します。

   ```kotlin
   ```
   {src="snippets/events/src/main/kotlin/com/example/Application.kt" include-lines="11-12,22-24,30"}

完全な例については、[events](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/events)を参照してください。