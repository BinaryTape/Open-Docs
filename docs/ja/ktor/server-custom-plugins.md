[//]: # (title: カスタムサーバープラグイン)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
独自のカスタムプラグインを作成する方法を学びます。
</link-summary>

v2.0.0以降、Ktorはカスタム[プラグイン](server-plugins.md)を作成するための新しいAPIを提供しています。一般的に、このAPIはパイプライン、フェーズなどの内部Ktor概念を理解する必要はありません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`ハンドラーを使用して、[リクエストとレスポンスの処理](#call-handling)のさまざまなステージにアクセスできます。

> このトピックで説明されているAPIはv2.0.0以降で有効です。古いバージョンについては、[ベースAPI](server-custom-plugins-base-api.md)を使用できます。

## 最初のプラグインを作成してインストールする {id="first-plugin"}

このセクションでは、最初のプラグインを作成してインストールする方法を説明します。[新しいKtorプロジェクトの作成、オープン、実行](server-create-a-new-project.topic)チュートリアルで作成されたアプリケーションを開始プロジェクトとして使用できます。

1. プラグインを作成するには、[createApplicationPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/create-application-plugin.html)関数を呼び出し、プラグイン名を渡します。
   ```kotlin
   import io.ktor.server.application.*
   
   val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
       println("SimplePlugin is installed!")
   }
   ```

   この関数は、次のステップでプラグインをインストールするために使用される`ApplicationPlugin`インスタンスを返します。
   > また、[特定のルートにインストール](server-plugins.md#install-route)できるプラグインを作成できる[createRouteScopedPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html)関数もあります。
2. [プラグインをインストール](server-plugins.md#install)するには、作成した`ApplicationPlugin`インスタンスをアプリケーションの初期化コードの`install`関数に渡します。
   ```kotlin
   fun Application.module() {
       install(SimplePlugin)
   }
   ```
3. 最後に、アプリケーションを[実行](server-run.md)して、コンソール出力でプラグインの挨拶を確認します。
   ```Bash
   2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
   SimplePlugin is installed!
   2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```

完全な例はこちらで見つけることができます: [SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
以下のセクションでは、さまざまなステージで呼び出しを処理する方法と、プラグインの構成を提供する方法について説明します。

## 呼び出しの処理 {id="call-handling"}

カスタムプラグインでは、呼び出しのさまざまなステージにアクセスできる一連のハンドラーを使用して、[リクエスト](server-requests.md)と[レスポンス](server-responses.md)を処理できます。

* [onCall](#on-call)を使用すると、リクエスト/レスポンス情報を取得したり、レスポンスパラメータ（例えば、[カスタムヘッダーの追加](#custom-header)）を変更したりできます。
* [onCallReceive](#on-call-receive)を使用すると、クライアントから受信したデータを取得および変換できます。
* [onCallRespond](#on-call-respond)を使用すると、データをクライアントに送信する前に変換できます。
* [on(...)](#other)を使用すると、呼び出しの他のステージや呼び出し中に発生した例外を処理するのに役立つ特定のフックを呼び出すことができます。
* 必要に応じて、`call.attributes`を使用して異なるハンドラー間で[呼び出しの状態](#call-state)を共有できます。

### onCall {id="on-call"}

`onCall`ハンドラーは`ApplicationCall`をラムダ引数として受け入れます。これにより、リクエスト/レスポンス情報にアクセスし、レスポンスパラメータ（例えば、[カスタムヘッダーの追加](#custom-header)）を変更できます。リクエスト/レスポンスボディを変換する必要がある場合は、[onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)を使用します。

#### 例1: リクエストのログ記録 {id="request-logging"}

以下の例は、`onCall`を使用して受信リクエストをログに記録するためのカスタムプラグインを作成する方法を示しています。

```kotlin
val RequestLoggingPlugin = createApplicationPlugin(name = "RequestLoggingPlugin") {
    onCall { call ->
        call.request.origin.apply {
            println("Request URL: $scheme://$localHost:$localPort$uri")
        }
    }
}
```

このプラグインをインストールすると、アプリケーションはコンソールにリクエストされたURLを表示します。例えば、

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 例2: カスタムヘッダー {id="custom-header"}

この例は、各レスポンスにカスタムヘッダーを追加するプラグインを作成する方法を示しています。

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

結果として、カスタムヘッダーがすべてのレスポンスに追加されます。

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

このプラグインのカスタムヘッダー名と値はハードコードされていることに注意してください。必要なカスタムヘッダー名/値を渡すための[設定](#plugin-configuration)を提供することで、このプラグインをより柔軟にすることができます。

### onCallReceive {id="on-call-receive"}

`onCallReceive`ハンドラーは`transformBody`関数を提供し、クライアントから受信したデータを変換できます。クライアントがボディに`text/plain`として`10`を含むサンプル`POST`リクエストを行うとします。

```HTTP
POST http://localhost:8080/transform-data
Content-Type: text/plain

10

```

このボディを整数値として[受信する](server-requests.md#objects)には、`POST`リクエストのルートハンドラーを作成し、`Int`パラメータを指定して`call.receive`を呼び出す必要があります。

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
}
```

次に、ボディを整数値として受け取り、それに`1`を追加するプラグインを作成しましょう。これを行うには、`onCallReceive`内で`transformBody`を次のように処理する必要があります。

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

上記のコードスニペットの`transformBody`は次のように機能します。

1. `TransformBodyContext`は、現在のリクエストに関する型情報を含む[ラムダレシーバー](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)です。上記の例では、`TransformBodyContext.requestedType`プロパティが要求されたデータ型をチェックするために使用されます。
2. `data`は、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)としてリクエストボディを受信し、必要な型に変換できるラムダ引数です。上記の例では、`ByteReadChannel.readUTF8Line`がリクエストボディを読み取るために使用されます。
3. 最後に、データを変換して返す必要があります。この例では、受信した整数値に`1`が追加されます。

完全な例はこちらで見つけることができます: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond`も`transformBody`ハンドラーを提供し、クライアントに送信されるデータを変換できます。このハンドラーは、ルートハンドラーで`call.respond`関数が呼び出されたときに実行されます。[onCallReceive](#on-call-receive)の例を引き続き使用し、`POST`リクエストハンドラーで整数値を受信します。

```kotlin
post("/transform-data") {
    val data = call.receive<Int>()
    call.respond(data)
}
```

`call.respond`を呼び出すと`onCallRespond`が呼び出され、これによりクライアントに送信されるデータを変換できます。例えば、以下のコードスニペットは、初期値に`1`を追加する方法を示しています。

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

完全な例はこちらで見つけることができます: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### その他の便利なハンドラー {id="other"}

`onCall`、`onCallReceive`、`onCallRespond`ハンドラーに加えて、Ktorは呼び出しの他のステージを処理するのに役立つ一連の特定のフックを提供します。
これらのフックは、`Hook`をパラメータとして受け取る`on`ハンドラーを使用して処理できます。
これらのフックには以下が含まれます。

- `CallSetup`は、呼び出し処理の最初のステップとして呼び出されます。
- `ResponseBodyReadyForSend`は、レスポンスボディがすべての変換を通過し、送信準備が整ったときに呼び出されます。
- `ResponseSent`は、レスポンスがクライアントに正常に送信されたときに呼び出されます。
- `CallFailed`は、呼び出しが例外で失敗したときに呼び出されます。
- [AuthenticationChecked](https://api.ktor.io/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)は、[認証](server-auth.md)資格情報がチェックされた後に実行されます。以下の例は、このフックを使用して認可を実装する方法を示しています: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下の例は、`CallSetup`を処理する方法を示しています。

```kotlin
on(CallSetup) { call->
    // ...
}
```

> また、アプリケーションの起動やシャットダウンなどの[アプリケーションイベントを処理](#handle-app-events)できる`MonitoringEvent`フックもあります。

### 呼び出しの状態を共有する {id="call-state"}

カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、この呼び出しを処理する任意のハンドラー内でこの値にアクセスできます。この値は、`call.attributes`コレクション内で一意のキーを持つ属性として保存されます。以下の例は、リクエストの受信とボディの読み取りの間の時間を計算するために属性を使用する方法を示しています。

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

`POST`リクエストを行うと、プラグインはコンソールに遅延を出力します。

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

完全な例はこちらで見つけることができます: [DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> [ルートハンドラー](server-requests.md#request_information)で呼び出し属性にアクセスすることもできます。

## アプリケーションイベントの処理 {id="handle-app-events"}

[on](#other)ハンドラーは、`MonitoringEvent`フックを使用してアプリケーションのライフサイクルに関連するイベントを処理する機能を提供します。
例えば、以下の[事前定義されたイベント](server-events.md#predefined-events)を`on`ハンドラーに渡すことができます。

- `ApplicationStarting`
- `ApplicationStarted`
- `ApplicationStopPreparing`
- `ApplicationStopping`
- `ApplicationStopped`

以下のコードスニペットは、`ApplicationStopped`を使用してアプリケーションのシャットダウンを処理する方法を示しています。

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
        // Release resources and unsubscribe from events
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

これはアプリケーションリソースを解放するのに役立つかもしれません。

## プラグイン構成の提供 {id="plugin-configuration"}

[カスタムヘッダー](#custom-header)の例は、事前定義されたカスタムヘッダーを各レスポンスに追加するプラグインを作成する方法を示しています。このプラグインをより便利にし、必要なカスタムヘッダー名/値を渡すための構成を提供しましょう。

1. まず、設定クラスを定義する必要があります。

   ```kotlin
   class PluginConfiguration {
       var headerName: String = "Custom-Header-Name"
       var headerValue: String = "Default value"
   }
   ```

2. この設定をプラグインで使用するには、設定クラスの参照を`createApplicationPlugin`に渡します。

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

   プラグインの構成フィールドは可変であるため、ローカル変数に保存することをお勧めします。

3. 最後に、プラグインを次のようにインストールおよび構成できます。

   ```kotlin
   install(CustomHeaderPlugin) {
       headerName = "X-Custom-Header"
       headerValue = "Hello, world!"
   }
   ```

> 完全な例はこちらで見つけることができます: [CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### ファイルでの構成 {id="configuration-file"}

Ktorでは、[設定ファイル](server-create-and-configure.topic#engine-main)でプラグイン設定を指定できます。
`CustomHeaderPlugin`でこれを実現する方法を見てみましょう。

1. まず、プラグイン設定を含む新しいグループを`application.conf`または`application.yaml`ファイルに追加します。

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

   この例では、プラグイン設定は`http.custom_header`グループに保存されます。

2. 設定ファイルのプロパティにアクセスするには、`ApplicationConfig`を構成クラスのコンストラクタに渡します。
   `tryGetString`関数は指定されたプロパティ値を返します。

   ```kotlin
   class CustomHeaderConfiguration(config: ApplicationConfig) {
       var headerName: String = config.tryGetString("header_name") ?: "Custom-Header-Name"
       var headerValue: String = config.tryGetString("header_value") ?: "Default value"
   }
   ```

3. 最後に、`http.custom_header`の値を`createApplicationPlugin`関数の`configurationPath`パラメータに割り当てます。

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

> 完全な例はこちらで見つけることができます: [CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## アプリケーション設定へのアクセス {id="app-settings"}

### 構成 {id="config"}

`applicationConfig`プロパティを使用してサーバー構成にアクセスできます。これは[ApplicationConfig](https://api.ktor.io/ktor-server-core/io.ktor.server.config/-application-config/index.html)インスタンスを返します。以下の例は、サーバーが使用するホストとポートを取得する方法を示しています。

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 環境 {id="environment"}

アプリケーションの環境にアクセスするには、`environment`プロパティを使用します。例えば、このプロパティを使用すると、[開発モード](server-development-mode.topic)が有効になっているかどうかを判断できます。

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

## その他 {id="misc"}

### プラグインの状態を保存する {id="plugin-state"}

プラグインの状態を保存するには、ハンドラーラムダから任意の値をキャプチャできます。すべての状態値をスレッドセーフにするために、並行データ構造とアトミックデータ型を使用することをお勧めします。

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

### データベース {id="databases"}

* サスペンド可能なデータベースでカスタムプラグインを使用できますか？

  はい。すべてのハンドラーはサスペンド関数であるため、プラグイン内で任意のサスペンド可能なデータベース操作を実行できます。ただし、特定の呼び出しのためにリソースを解放するのを忘れないでください（例えば、[on(ResponseSent)](#other)を使用するなど）。

* ブロッキングデータベースでカスタムプラグインを使用する方法は？

  Ktorはコルーチンとサスペンド関数を使用するため、ブロッキングデータベースへのリクエストを行うことは危険な場合があります。なぜなら、ブロッキング呼び出しを実行するコルーチンがブロックされ、その後永久にサスペンドされる可能性があるからです。これを防ぐには、個別の[CoroutineContext](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)を作成する必要があります。
   ```kotlin
   val databaseContext = newSingleThreadContext("DatabaseThread")
   ```
  次に、コンテキストが作成されたら、データベースへの各呼び出しを`withContext`呼び出しでラップします。
   ```kotlin
   onCall {
       withContext(databaseContext) {
           database.access(...) // some call to your database
       }
   }