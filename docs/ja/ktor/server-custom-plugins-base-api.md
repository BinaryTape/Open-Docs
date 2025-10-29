[//]: # (title: カスタムプラグイン - Base API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

> v2.0.0から、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)のための新しい簡易化されたAPIを提供します。
>
{type="note"}

Ktorは、共通の機能を実装し複数のアプリケーションで再利用できるカスタム[プラグイン](server-plugins.md)を開発するためのAPIを公開しています。このAPIにより、さまざまな[パイプライン](#pipelines)フェーズをインターセプトして、リクエスト/レスポンス処理にカスタムロジックを追加できます。例えば、`Monitoring`フェーズをインターセプトして、着信リクエストをログに記録したり、メトリクスを収集したりできます。

## プラグインの作成 {id="create"}
カスタムプラグインを作成するには、以下の手順に従います。

1.  プラグインクラスを作成し、以下のいずれかのインターフェースを実装する[コンパニオンオブジェクトを宣言](#create-companion)します。
    -   [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html): プラグインがアプリケーションレベルで機能する場合。
    -   [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html): プラグインを[特定のルートにインストール](server-plugins.md#install-route)できる場合。
2.  このコンパニオンオブジェクトの`key`と`install`メンバーを[実装](#implement)します。
3.  [プラグイン設定](#plugin-configuration)を提供します。
4.  必要なパイプラインフェーズをインターセプトして[呼び出しを処理](#call-handling)します。
5.  [プラグインをインストール](#install)します。

### コンパニオンオブジェクトの作成 {id="create-companion"}

カスタムプラグインのクラスには、`BaseApplicationPlugin`または`BaseRouteScopedPlugin`インターフェースを実装するコンパニオンオブジェクトが必要です。
`BaseApplicationPlugin`インターフェースは3つの型パラメータを受け取ります。
-   このプラグインと互換性のあるパイプラインの型。
-   このプラグインの[設定オブジェクト型](#plugin-configuration)。
-   プラグインオブジェクトのインスタンスの型。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 'key'と'install'メンバーの実装 {id="implement"}

`BaseApplicationPlugin`インターフェースの子孫として、コンパニオンオブジェクトは2つのメンバーを実装する必要があります。
-   `key`プロパティはプラグインを識別するために使用されます。Ktorはすべての属性のマップを持っており、各プラグインは指定されたキーを使用してこのマップに自身を追加します。
-   `install`関数は、プラグインの動作を設定することを可能にします。ここでパイプラインをインターセプトし、プラグインインスタンスを返します。[次の章](#call-handling)でパイプラインをインターセプトして呼び出しを処理する方法を見ていきます。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            // Intercept a pipeline ...
            return plugin
        }
    }
}
```

### 呼び出しの処理 {id="call-handling"}

カスタムプラグインでは、[既存のパイプラインフェーズ](#pipelines)または新しく定義されたパイプラインフェーズをインターセプトすることで、リクエストとレスポンスを処理できます。例えば、[Authentication](server-auth.md)プラグインは、デフォルトのパイプラインに`Authenticate`と`Challenge`というカスタムフェーズを追加します。このように特定のパイプラインをインターセプトすることで、呼び出しのさまざまな段階にアクセスできます。例えば：

-   `ApplicationCallPipeline.Monitoring`: このフェーズをインターセプトすることで、リクエストロギングやメトリクス収集に使用できます。
-   `ApplicationCallPipeline.Plugins`: レスポンスパラメータを変更するために使用でき、例えばカスタムヘッダーを追加します。
-   `ApplicationReceivePipeline.Transform` および `ApplicationSendPipeline.Transform`: クライアントから受信したデータを取得し[変換](#transform)したり、データを送信する前に変換したりできます。

以下の例は、`ApplicationCallPipeline.Plugins`フェーズをインターセプトし、各レスポンスにカスタムヘッダーを追加する方法を示しています。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header("X-Custom-Header", "Hello, world!")
            }
            return plugin
        }
    }
}
```

このプラグインのカスタムヘッダー名と値はハードコードされていることに注意してください。[設定を提供](#plugin-configuration)することで、このプラグインをより柔軟にし、必要なカスタムヘッダー名/値を渡せるようにすることができます。

> カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、その呼び出しを処理する任意のハンドラ内でこの値にアクセスできます。詳細については、[呼び出しの状態を共有](server-custom-plugins.md#call-state)を参照してください。

### プラグイン設定の提供 {id="plugin-configuration"}

[前の章](#call-handling)では、事前定義されたカスタムヘッダーを各レスポンスに追加するプラグインの作成方法を示しました。このプラグインをより有用にするため、必要なカスタムヘッダー名/値を渡すための設定を提供しましょう。まず、プラグインのクラス内に設定クラスを定義する必要があります。

```kotlin
class Configuration {
    var headerName = "Custom-Header-Name"
    var headerValue = "Default value"
}
```

プラグインの設定フィールドは可変であるため、それらをローカル変数に保存することをお勧めします。

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }
}
```

最後に、`install`関数でこの設定を取得し、そのプロパティを使用できます。

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}
```

### プラグインのインストール {id="install"}

カスタムプラグインをアプリケーションに[インストール](server-plugins.md#install)するには、`install`関数を呼び出し、目的の[設定](#plugin-configuration)パラメータを渡します。

```kotlin
install(CustomHeader) {
    headerName = "X-Custom-Header"
    headerValue = "Hello, world!"
}
```

## 例 {id="examples"}

以下のコードスニペットは、カスタムプラグインのいくつかの例を示しています。
実行可能なプロジェクトは、こちらで見つけることができます: [custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### リクエストロギング {id="request-logging"}

以下の例は、着信リクエストをログに記録するためのカスタムプラグインを作成する方法を示しています。

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.util.*

class RequestLogging {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, RequestLogging> {
        override val key = AttributeKey<RequestLogging>("RequestLogging")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): RequestLogging {
            val plugin = RequestLogging()
            pipeline.intercept(ApplicationCallPipeline.Monitoring) {
                call.request.origin.apply {
                    println("Request URL: $scheme://$localHost:$localPort$uri")
                }
            }
            return plugin
        }
    }
}

```

### カスタムヘッダー {id="custom-header"}

この例は、各レスポンスにカスタムヘッダーを追加するプラグインを作成する方法を示しています。

```kotlin
package com.example.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.util.*

class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}

```

### ボディ変換 {id="transform"}

以下の例は、次の方法を示しています。
-   クライアントから受信したデータを変換する。
-   クライアントに送信するデータを変換する。

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.util.*
import io.ktor.utils.io.*

class DataTransformation {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, DataTransformation> {
        override val key = AttributeKey<DataTransformation>("DataTransformation")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): DataTransformation {
            val plugin = DataTransformation()
            pipeline.receivePipeline.intercept(ApplicationReceivePipeline.Transform) { data ->
                val newValue = (data as ByteReadChannel).readUTF8Line()?.toInt()?.plus(1)
                if (newValue != null) {
                    proceedWith(newValue)
                }
            }
            pipeline.sendPipeline.intercept(ApplicationSendPipeline.Transform) { data ->
                if (subject is Int) {
                    val newValue = data.toString().toInt() + 1
                    proceedWith(newValue.toString())
                }
            }
            return plugin
        }
    }
}

```

## パイプライン {id="pipelines"}

Ktorの[パイプライン](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)は、1つ以上の順序付けられたフェーズにグループ化されたインターセプターの集合です。各インターセプターは、リクエストを処理する前と後にカスタムロジックを実行できます。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html)は、アプリケーションの呼び出しを実行するためのパイプラインです。このパイプラインは5つのフェーズを定義します。

-   `Setup`: 呼び出しとその属性を処理のために準備するために使用されるフェーズ。
-   `Monitoring`: 呼び出しをトレースするためのフェーズ。リクエストロギング、メトリクス収集、エラーハンドリングなどに役立ちます。
-   `Plugins`: [呼び出しを処理](#call-handling)するために使用されるフェーズ。ほとんどのプラグインはこのフェーズでインターセプトします。
-   `Call`: 呼び出しを完了するために使用されるフェーズ。
-   `Fallback`: 未処理の呼び出しを処理するためのフェーズ。

## パイプラインフェーズから新しいAPIハンドラへのマッピング {id="mapping"}

v2.0.0から、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)のための新しい簡易化されたAPIを提供します。
一般的に、このAPIはパイプライン、フェーズなどのKtor内部概念の理解を必要としません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`などのさまざまなハンドラを使用して、[リクエストとレスポンスを処理する](#call-handling)さまざまな段階にアクセスできます。
以下の表は、パイプラインフェーズが新しいAPIのハンドラにどのようにマッピングされるかを示しています。

| Base API                               | New API                                                 |
|:---------------------------------------|:--------------------------------------------------------|
| `ApplicationCallPipeline.Setup` より前     | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| `Authentication.ChallengePhase` より後 | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |