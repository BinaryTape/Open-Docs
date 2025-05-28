[//]: # (title: カスタムサーバープラグイン)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
独自のカスタムプラグインを作成する方法を学びます。
</link-summary>

v2.0.0 以降、Ktor はカスタム[プラグイン](server-plugins.md)を作成するための新しい API を提供します。一般的に、この API はパイプライン、フェーズなどの Ktor の内部概念を理解する必要はありません。代わりに、`onCall`、`onCallReceive`、`onCallRespond` ハンドラを使用して、[リクエストとレスポンスの処理](#call-handling)の様々な段階にアクセスできます。

> このトピックで説明されている API は v2.0.0 以降で有効です。古いバージョンについては、[基本 API](server-custom-plugins-base-api.md) を使用できます。

## 最初のプラグインの作成とインストール {id="first-plugin"}

このセクションでは、最初のプラグインの作成とインストール方法を説明します。
[](server-create-a-new-project.topic) チュートリアルで作成したアプリケーションを開始プロジェクトとして使用できます。

1.  プラグインを作成するには、[createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html) 関数を呼び出し、プラグイン名を渡します。
    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt" include-lines="3-7"}

    この関数は、次のステップでプラグインをインストールするために使用される `ApplicationPlugin` インスタンスを返します。
    > [特定のルート](server-plugins.md#install-route)にインストールできるプラグインを作成するための [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html) 関数もあります。
2.  [プラグインをインストール](server-plugins.md#install)するには、作成した `ApplicationPlugin` インスタンスをアプリケーションの初期化コードの `install` 関数に渡します。
    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-12,32"}
3.  最後に、アプリケーションを[実行](server-run.md)して、コンソール出力でプラグインの挨拶を確認します。
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```

完全な例は、こちらにあります: [SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
以下のセクションでは、異なる段階で呼び出しを処理する方法と、プラグイン設定の提供方法について説明します。

## 呼び出しの処理 {id="call-handling"}

カスタムプラグインでは、呼び出しの様々な段階にアクセスできる一連のハンドラを使用して、[リクエスト](server-requests.md)と[レスポンス](server-responses.md)を処理できます。

*   [onCall](#on-call) を使用すると、リクエスト/レスポンス情報を取得したり、レスポンスパラメータ（例えば、カスタムヘッダの追加）を変更したりできます。
*   [onCallReceive](#on-call-receive) を使用すると、クライアントから受信したデータを取得および変換できます。
*   [onCallRespond](#on-call-respond) を使用すると、クライアントに送信する前にデータを変換できます。
*   [on(...)](#other) を使用すると、呼び出しの他の段階や呼び出し中に発生した例外を処理するのに役立つ可能性のある特定のフックを呼び出すことができます。
*   必要に応じて、`call.attributes` を使用して、異なるハンドラ間で[呼び出しの状態](#call-state)を共有できます。

### onCall {id="on-call"}

`onCall` ハンドラは `ApplicationCall` をラムダ引数として受け入れます。これにより、リクエスト/レスポンス情報にアクセスし、レスポンスパラメータ（例えば、[カスタムヘッダの追加](#custom-header)）を変更できます。リクエスト/レスポンスの本文を変換する必要がある場合は、[onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond) を使用します。

#### 例 1: リクエストロギング {id="request-logging"}

以下の例は、`onCall` を使用して、受信リクエストをロギングするカスタムプラグインを作成する方法を示しています。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/RequestLoggingPlugin.kt" include-lines="6-12"}

このプラグインをインストールすると、アプリケーションはコンソールにリクエストされた URL を表示します。例えば、次のようになります。

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 例 2: カスタムヘッダ {id="custom-header"}

この例は、各レスポンスにカスタムヘッダを追加するプラグインを作成する方法を示しています。

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

その結果、カスタムヘッダがすべてのレスポンスに追加されます。

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

このプラグインのカスタムヘッダ名と値はハードコードされていることに注意してください。必要なカスタムヘッダ名/値を渡すための[設定](#plugin-configuration)を提供することで、このプラグインをより柔軟にすることができます。

### onCallReceive {id="on-call-receive"}

`onCallReceive` ハンドラは `transformBody` 関数を提供し、クライアントから受信したデータを変換できます。クライアントがその本文に `text/plain` として `10` を含むサンプル `POST` リクエストを作成するとします。

```HTTP
```

{src="snippets/custom-plugin/post.http"}

この本文を整数値として[受信する](server-requests.md#objects)には、`POST` リクエスト用のルートハンドラを作成し、`call.receive` を `Int` パラメータで呼び出す必要があります。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="27-28,30"}

次に、本文を整数値として受信し、それに `1` を加えるプラグインを作成しましょう。これを行うには、`onCallReceive` 内で `transformBody` を次のように処理する必要があります。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt" include-lines="6-16,27"}

上記のコードスニペットの `transformBody` は次のように機能します。

1.  `TransformBodyContext` は、現在のリクエストに関する型情報を含む[ラムダレシーバ](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)です。上記の例では、`TransformBodyContext.requestedType` プロパティが要求されたデータ型をチェックするために使用されています。
2.  `data` は、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) としてリクエスト本文を受信し、それを必要な型に変換できるラムダ引数です。上記の例では、`ByteReadChannel.readUTF8Line` がリクエスト本文を読み取るために使用されています。
3.  最後に、データを変換して返す必要があります。この例では、受信した整数値に `1` が追加されます。

完全な例は、こちらにあります: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond` も `transformBody` ハンドラを提供し、クライアントに送信されるデータを変換できます。このハンドラは、ルートハンドラで `call.respond` 関数が呼び出されたときに実行されます。[onCallReceive](#on-call-receive) からの例を続けましょう。そこでは `POST` リクエストハンドラで整数値が受信されます。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="27-30"}

`call.respond` の呼び出しは `onCallRespond` を呼び出し、これによってクライアントに送信されるデータを変換できます。例えば、以下のコードスニペットは、初期値に `1` を追加する方法を示しています。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt" include-lines="18-26"}

完全な例は、こちらにあります: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### その他の便利なハンドラ {id="other"}

`onCall`、`onCallReceive`、`onCallRespond` ハンドラの他に、Ktor は呼び出しの他の段階を処理するのに役立つ可能性のある特定のフックのセットを提供します。
これらのフックは、`Hook` をパラメータとして受け取る `on` ハンドラを使用して処理できます。
これらのフックには以下が含まれます。

-   `CallSetup` は、呼び出しを処理する最初のステップとして呼び出されます。
-   `ResponseBodyReadyForSend` は、レスポンス本文がすべての変換を経て送信準備ができたときに呼び出されます。
-   `ResponseSent` は、レスポンスがクライアントに正常に送信されたときに呼び出されます。
-   `CallFailed` は、呼び出しが例外で失敗したときに呼び出されます。
-   [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html) は、[認証](server-auth.md)資格情報がチェックされた後に実行されます。以下の例は、このフックを使用して認可を実装する方法を示しています: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下の例は、`CallSetup` を処理する方法を示しています。

```kotlin
on(CallSetup) { call->
    // ...
}
```

> アプリケーションの起動やシャットダウンなどの[アプリケーションイベントを処理](#handle-app-events)できる `MonitoringEvent` フックもあります。

### 呼び出しの状態を共有する {id="call-state"}

カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、この値をこの呼び出しを処理する任意のハンドラ内でアクセスできます。この値は、`call.attributes` コレクションに一意のキーを持つ属性として格納されます。以下の例は、属性を使用してリクエストの受信から本文の読み取りまでの時間を計算する方法を示しています。

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt"
include-lines="6-18"}

`POST` リクエストを行うと、プラグインはコンソールに遅延を表示します。

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

完全な例は、こちらにあります: [DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> [ルートハンドラ](server-requests.md#request_information)で呼び出し属性にアクセスすることもできます。

## アプリケーションイベントの処理 {id="handle-app-events"}

[on](#other) ハンドラは、`MonitoringEvent` フックを使用して、アプリケーションのライフサイクルに関連するイベントを処理する機能を提供します。
例えば、以下の[事前定義されたイベント](server-events.md#predefined-events)を `on` ハンドラに渡すことができます。

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

以下のコードスニペットは、`ApplicationStopped` を使用してアプリケーションのシャットダウンを処理する方法を示しています。

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" lines="12-13,17"}

これは、アプリケーションリソースを解放するのに役立つ場合があります。

## プラグイン設定の提供 {id="plugin-configuration"}

[カスタムヘッダ](#custom-header)の例では、事前定義されたカスタムヘッダを各レスポンスに追加するプラグインを作成する方法を示しています。このプラグインをより有用にするために、必要なカスタムヘッダ名/値を渡すための設定を提供しましょう。

1.  まず、設定クラスを定義する必要があります。

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt" include-lines="18-21"}

2.  この設定をプラグインで使用するには、設定クラス参照を `createApplicationPlugin` に渡します。

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt" include-lines="5-16"}

    プラグイン設定フィールドは変更可能であるため、ローカル変数に保存することをお勧めします。

3.  最後に、次のようにプラグインをインストールして設定できます。

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="15-18"}

> 完全な例は、こちらにあります: [CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### ファイルでの設定 {id="configuration-file"}

Ktor では、プラグイン設定を[設定ファイル](server-create-and-configure.topic#engine-main)で指定できます。
`CustomHeaderPlugin` でこれを実現する方法を見てみましょう。

1.  まず、`application.conf` または `application.yaml` ファイルにプラグイン設定を持つ新しいグループを追加します。

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    ```shell
    ```
    {src="snippets/custom-plugin/src/main/resources/application.conf" include-lines="10-15"}

    </tab>
    <tab title="application.yaml" group-key="yaml">

    ```yaml
    ```
    {src="snippets/custom-plugin/src/main/resources/application.yaml" include-lines="8-11"}

    </tab>
    </tabs>

    この例では、プラグイン設定は `http.custom_header` グループに保存されています。

2.  設定ファイルのプロパティにアクセスするには、`ApplicationConfig` を設定クラスのコンストラクタに渡します。`tryGetString` 関数は、指定されたプロパティ値を返します。

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt"
    include-lines="20-23"}

3.  最後に、`http.custom_header` の値を `createApplicationPlugin` 関数の `configurationPath` パラメータに割り当てます。

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt"
    include-lines="6-18"}

> 完全な例は、こちらにあります: [CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## アプリケーション設定へのアクセス {id="app-settings"}

### 設定 {id="config"}

`applicationConfig` プロパティを使用してサーバー設定にアクセスできます。これは [ApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-application-config/index.html) インスタンスを返します。以下の例は、サーバーが使用するホストとポートを取得する方法を示しています。

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 環境 {id="environment"}

アプリケーションの環境にアクセスするには、`environment` プロパティを使用します。例えば、このプロパティを使用すると、[開発モード](server-development-mode.topic)が有効になっているかどうかを判断できます。

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

プラグインの状態を保存するには、ハンドララムダから任意の値をキャプチャできます。すべての状態値を、並行データ構造とアトミックデータ型を使用してスレッドセーフにすることをお勧めします。

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

*   サスペンド可能なデータベースでカスタムプラグインを使用できますか？

    はい。すべてのハンドラはサスペンド関数であるため、プラグイン内でサスペンド可能なデータベース操作を実行できます。ただし、特定の呼び出しのリソースの割り当て解除（例えば、[on(ResponseSent)](#other) を使用して）を忘れないでください。

*   ブロッキングデータベースでカスタムプラグインを使用する方法は？

    Ktor はコルーチンとサスペンド関数を使用するため、ブロッキングデータベースへのリクエストを行うことは危険な場合があります。ブロッキング呼び出しを実行するコルーチンがブロックされ、永久にサスペンドされる可能性があるためです。これを防ぐには、個別の [CoroutineContext](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html) を作成する必要があります。
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    その後、コンテキストが作成されたら、データベースへの各呼び出しを `withContext` 呼び出しでラップします。
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }