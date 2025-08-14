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

Ktorはv2.0.0以降、カスタム[プラグイン](server-plugins.md)を作成するための新しいAPIを提供しています。一般的に、このAPIはパイプライン、フェーズなどの内部Ktorコンセプトの理解を必要としません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`ハンドラーを使用して、[リクエストとレスポンスの処理](#call-handling)の様々なステージにアクセスできます。

> このトピックで説明されているAPIはv2.0.0以降に適用されます。古いバージョンでは、[ベースAPI](server-custom-plugins-base-api.md)を使用できます。

## 最初のプラグインを作成してインストールする {id="first-plugin"}

このセクションでは、最初のプラグインを作成してインストールする方法を説明します。[新しいプロジェクトを作成する](server-create-a-new-project.topic)チュートリアルで作成したアプリケーションを、開始プロジェクトとして使用できます。

1.  プラグインを作成するには、[createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html)関数を呼び出し、プラグイン名を渡します。
    [object Promise]

    この関数は`ApplicationPlugin`インスタンスを返します。これは次のステップでプラグインをインストールするために使用されます。
    > [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html)関数もあり、これは[特定のルートにインストールできる](server-plugins.md#install-route)プラグインを作成できます。
2.  [プラグインをインストールする](server-plugins.md#install)には、作成した`ApplicationPlugin`インスタンスをアプリケーションの初期化コード内の`install`関数に渡します。
    [object Promise]
3.  最後に、アプリケーションを[実行](server-run.md)して、コンソール出力でプラグインの挨拶を確認します。
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```

完全な例は以下で確認できます: [SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
次のセクションでは、異なるステージでコールを処理する方法と、プラグインの構成を提供する方法を見ていきます。

## コールを処理する {id="call-handling"}

カスタムプラグインでは、コールの異なるステージへのアクセスを提供する一連のハンドラーを使用して、[リクエスト](server-requests.md)と[レスポンス](server-responses.md)を処理できます。

*   [onCall](#on-call)では、リクエスト/レスポンス情報を取得したり、レスポンスパラメータ（例えばカスタムヘッダーの追加）を変更したりできます。
*   [onCallReceive](#on-call-receive)では、クライアントから受信したデータを取得し、変換できます。
*   [onCallRespond](#on-call-respond)では、クライアントに送信する前にデータを変換できます。
*   [on(...)](#other)では、コールの他のステージやコール中に発生した例外を処理するのに役立つ可能性のある特定のフックを呼び出すことができます。
*   必要に応じて、`call.attributes`を使用して異なるハンドラー間で[コール状態](#call-state)を共有できます。

### onCall {id="on-call"}

`onCall`ハンドラーは`ApplicationCall`をラムダ引数として受け入れます。これにより、リクエスト/レスポンス情報にアクセスし、レスポンスパラメータ（例えば、[カスタムヘッダー](#custom-header)の追加）を変更できます。リクエスト/レスポンスボディを変換する必要がある場合は、[onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)を使用します。

#### 例1: リクエストロギング {id="request-logging"}

以下の例は、`onCall`を使用して受信リクエストをロギングするカスタムプラグインを作成する方法を示しています。

[object Promise]

このプラグインをインストールすると、アプリケーションは要求されたURLをコンソールに表示します。例:

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

結果として、すべてのレスポンスにカスタムヘッダーが追加されます。

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

このプラグインのカスタムヘッダー名と値がハードコードされていることに注意してください。必要なカスタムヘッダー名/値を渡すための[設定](#plugin-configuration)を提供することで、このプラグインをより柔軟にすることができます。

### onCallReceive {id="on-call-receive"}

`onCallReceive`ハンドラーは`transformBody`関数を提供し、クライアントから受信したデータを変換できます。クライアントがボディに`text/plain`として`10`を含むサンプル`POST`リクエストを行うとします。

[object Promise]

このボディを整数値として[受信する](server-requests.md#objects)には、`POST`リクエストのルートハンドラーを作成し、`Int`パラメータを指定して`call.receive`を呼び出す必要があります。

[object Promise]

次に、ボディを整数値として受け取り、それに`1`を追加するプラグインを作成しましょう。これを行うには、`onCallReceive`内で`transformBody`を次のように処理する必要があります。

[object Promise]

上記のコードスニペットの`transformBody`は次のように機能します。

1.  `TransformBodyContext`は、現在のリクエストに関する型情報を含む[ラムダレシーバー](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)です。上記の例では、`TransformBodyContext.requestedType`プロパティが要求されたデータ型をチェックするために使用されます。
2.  `data`は、[ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)としてリクエストボディを受信し、必要な型に変換できるラムダ引数です。上記の例では、`ByteReadChannel.readUTF8Line`がリクエストボディを読み取るために使用されます。
3.  最後に、データを変換して返す必要があります。この例では、受信した整数値に`1`が追加されます。

完全な例は以下で確認できます: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond`も`transformBody`ハンドラーを提供し、クライアントに送信されるデータを変換できます。このハンドラーは、ルートハンドラーで`call.respond`関数が呼び出されたときに実行されます。[onCallReceive](#on-call-receive)の例を続けましょう。そこでは、`POST`リクエストハンドラーで整数値が受信されます。

[object Promise]

`call.respond`を呼び出すと`onCallRespond`が起動し、これによりクライアントに送信されるデータを変換できます。例えば、以下のコードスニペットは初期値に`1`を追加する方法を示しています。

[object Promise]

完全な例は以下で確認できます: [DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### その他の便利なハンドラー {id="other"}

`onCall`、`onCallReceive`、`onCallRespond`ハンドラーとは別に、Ktorはコールの他のステージを処理するのに役立つ可能性のある一連の特定のフックを提供します。
これらのフックは、`Hook`をパラメータとして受け入れる`on`ハンドラーを使用して処理できます。
これらのフックには以下が含まれます。

-   `CallSetup`は、コール処理の最初のステップとして呼び出されます。
-   `ResponseBodyReadyForSend`は、レスポンスボディがすべての変換を経て、送信準備ができたときに呼び出されます。
-   `ResponseSent`は、レスポンスがクライアントに正常に送信されたときに呼び出されます。
-   `CallFailed`は、コールが例外で失敗したときに呼び出されます。
-   [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)は、[認証](server-auth.md)資格情報がチェックされた後に実行されます。以下の例は、このフックを使用して認可を実装する方法を示しています: [custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下の例は`CallSetup`を処理する方法を示しています。

```kotlin
on(CallSetup) { call->
    // ...
}
```

> また、`MonitoringEvent`フックがあり、アプリケーションの起動やシャットダウンなどの[アプリケーションイベントを処理](#handle-app-events)できます。

### コール状態を共有する {id="call-state"}

カスタムプラグインでは、コールに関連する任意の値を共有できるため、この値をこのコールを処理する任意のハンドラー内でアクセスできます。この値は、`call.attributes`コレクションに一意のキーを持つ属性として保存されます。以下の例は、属性を使用してリクエストの受信とボディの読み取りの間の時間を計算する方法を示しています。

[object Promise]

`POST`リクエストを行うと、プラグインはコンソールに遅延を出力します。

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

完全な例は以下で確認できます: [DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> ルートハンドラーでもコールアトリビュートにアクセスできます([リクエスト情報](server-requests.md#request_information))。

## アプリケーションイベントを処理する {id="handle-app-events"}

[on](#other)ハンドラーは、`MonitoringEvent`フックを使用して、アプリケーションのライフサイクルに関連するイベントを処理する機能を提供します。
例えば、以下の[事前定義されたイベント](server-events.md#predefined-events)を`on`ハンドラーに渡すことができます。

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

以下のコードスニペットは、`ApplicationStopped`を使用してアプリケーションのシャットダウンを処理する方法を示しています。

[object Promise]

これは、アプリケーションリソースを解放するのに役立ちます。

## プラグイン設定を提供する {id="plugin-configuration"}

[カスタムヘッダー](#custom-header)の例は、事前定義されたカスタムヘッダーを各レスポンスに追加するプラグインを作成する方法を示しています。このプラグインをより便利にし、必要なカスタムヘッダー名/値を渡すための設定を提供しましょう。

1.  まず、設定クラスを定義する必要があります。

    [object Promise]

2.  この設定をプラグインで使用するには、設定クラス参照を`createApplicationPlugin`に渡します。

    [object Promise]

    プラグイン設定フィールドは可変であるため、ローカル変数に保存することをお勧めします。

3.  最後に、プラグインを次のようにインストールして設定できます。

    [object Promise]

> 完全な例は以下で確認できます: [CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### ファイル内の設定 {id="configuration-file"}

Ktorでは、プラグイン設定を[設定ファイル](server-create-and-configure.topic#engine-main)で指定できます。`CustomHeaderPlugin`でこれを実現する方法を見てみましょう。

1.  まず、プラグイン設定を含む新しいグループを`application.conf`または`application.yaml`ファイルに追加します。

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    [object Promise]

    </tab>
    <tab title="application.yaml" group-key="yaml">

    [object Promise]

    </tab>
    </tabs>

    この例では、プラグイン設定は`http.custom_header`グループに保存されています。

2.  設定ファイルのプロパティにアクセスするには、`ApplicationConfig`をコンフィグレーションクラスのコンストラクタに渡します。`tryGetString`関数は指定されたプロパティ値を返します。

    [object Promise]

3.  最後に、`http.custom_header`の値を`createApplicationPlugin`関数の`configurationPath`パラメータに割り当てます。

    [object Promise]

> 完全な例は以下で確認できます: [CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## アプリケーション設定にアクセスする {id="app-settings"}

### 設定 {id="config"}

`applicationConfig`プロパティを使用してサーバー設定にアクセスできます。これは[ApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-application-config/index.html)インスタンスを返します。以下の例は、サーバーが使用するホストとポートを取得する方法を示しています。

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

### プラグイン状態を保存する {id="plugin-state"}

プラグインの状態を保存するには、ハンドラーラムダから任意の値をキャプチャできます。すべての状態値を、並行データ構造とアトミックデータ型を使用してスレッドセーフにすることをお勧めします。

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

    はい。すべてのハンドラーはサスペンド関数なので、プラグイン内で任意のサスペンド可能なデータベース操作を実行できます。ただし、特定のコールのリソースを解放することを忘れないでください（例えば、[on(ResponseSent)](#other)を使用するなど）。

*   ブロッキングデータベースでカスタムプラグインを使用する方法は？

    Ktorはコルーチンとサスペンド関数を使用するため、ブロッキングデータベースへのリクエストを行うことは危険な場合があります。なぜなら、ブロッキングコールを実行するコルーチンがブロックされ、永久にサスペンドされる可能性があるからです。これを防ぐには、個別の[CoroutineContext](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)を作成する必要があります。
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    次に、コンテキストが作成されたら、データベースへの各コールを`withContext`コールでラップします。
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }