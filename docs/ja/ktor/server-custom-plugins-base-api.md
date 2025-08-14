[//]: # (title: カスタムプラグイン - ベースAPI)

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

> v2.0.0以降、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)用の新しい簡略化されたAPIを提供します。
>
{type="note"}

Ktorは、一般的な機能を実装し、複数のアプリケーションで再利用できるカスタム[プラグイン](server-plugins.md)を開発するためのAPIを提供します。このAPIを使用すると、さまざまな[パイプライン](#pipelines)フェーズをインターセプトして、リクエスト/レスポンス処理にカスタムロジックを追加できます。たとえば、`Monitoring`フェーズをインターセプトして、受信リクエストをログに記録したり、メトリクスを収集したりできます。

## プラグインの作成 {id="create"}
カスタムプラグインを作成するには、以下の手順に従います。

1.  プラグインクラスを作成し、以下のいずれかのインターフェースを実装する[コンパニオンオブジェクトを宣言](#create-companion)します。
    *   [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html): プラグインがアプリケーションレベルで動作する場合。
    *   [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html): プラグインが[特定のルートにインストール](server-plugins.md#install-route)できる場合。
2.  このコンパニオンオブジェクトの`key`および`install`メンバーを[実装](#implement)します。
3.  [プラグイン設定](#plugin-configuration)を提供します。
4.  必要なパイプラインフェーズをインターセプトして[呼び出しを処理](#call-handling)します。
5.  [プラグインをインストール](#install)します。

### コンパニオンオブジェクトの作成 {id="create-companion"}

カスタムプラグインのクラスには、`BaseApplicationPlugin`または`BaseRouteScopedPlugin`インターフェースを実装するコンパニオンオブジェクトが必要です。
`BaseApplicationPlugin`インターフェースは3つの型パラメータを受け入れます。
*   このプラグインが互換性のあるパイプラインの型。
*   このプラグイン用の[設定オブジェクト型](#plugin-configuration)。
*   プラグインオブジェクトのインスタンス型。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 'key' と 'install' メンバーの実装 {id="implement"}

`BaseApplicationPlugin`インターフェースの継承者として、コンパニオンオブジェクトは2つのメンバーを実装する必要があります。
*   `key`プロパティはプラグインを識別するために使用されます。Ktorはすべてのアトリビュートのマップを持っており、各プラグインは指定されたキーを使用して自身をこのマップに追加します。
*   `install`関数は、プラグインの動作を構成するために使用されます。ここでは、パイプラインをインターセプトしてプラグインインスタンスを返す必要があります。パイプラインをインターセプトして呼び出しを処理する方法については、[次の章](#call-handling)で説明します。

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

カスタムプラグインでは、[既存のパイプラインフェーズ](#pipelines)または新しく定義されたフェーズをインターセプトすることで、リクエストとレスポンスを処理できます。たとえば、[Authentication](server-auth.md)プラグインは、デフォルトのパイプラインに`Authenticate`と`Challenge`というカスタムフェーズを追加します。したがって、特定のパイプラインをインターセプトすることで、呼び出しのさまざまな段階にアクセスできます。たとえば、次のとおりです。

*   `ApplicationCallPipeline.Monitoring`: このフェーズをインターセプトすると、リクエストのログ記録やメトリクス収集に使用できます。
*   `ApplicationCallPipeline.Plugins`: レスポンスパラメータを変更するために使用できます。たとえば、カスタムヘッダーを追加する、などです。
*   `ApplicationReceivePipeline.Transform` および `ApplicationSendPipeline.Transform`: クライアントから受信したデータを取得および[変換](#transform)したり、データを返送する前に変換したりできます。

以下の例は、`ApplicationCallPipeline.Plugins`フェーズをインターセプトして、各レスポンスにカスタムヘッダーを追加する方法を示しています。

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

このプラグインでは、カスタムヘッダー名と値がハードコードされていることに注意してください。必要なカスタムヘッダー名/値を渡すための[設定を提供](#plugin-configuration)することで、このプラグインをより柔軟にすることができます。

> カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、この呼び出しを処理するすべてのハンドラー内でこの値にアクセスできます。詳細については、[](server-custom-plugins.md#call-state)を参照してください。

### プラグイン設定の提供 {id="plugin-configuration"}

[前の章](#call-handling)では、事前定義されたカスタムヘッダーを各レスポンスに追加するプラグインの作成方法を示しました。このプラグインをより便利にするために、必要なカスタムヘッダー名/値を渡すための設定を提供しましょう。まず、プラグインのクラス内に設定クラスを定義する必要があります。

[object Promise]

プラグイン設定フィールドは可変であるため、それらをローカル変数に保存することをお勧めします。

[object Promise]

最後に、`install`関数内でこの設定を取得し、そのプロパティを使用できます

[object Promise]

### プラグインのインストール {id="install"}

カスタムプラグインをアプリケーションに[インストール](server-plugins.md#install)するには、`install`関数を呼び出し、目的の[設定](#plugin-configuration)パラメータを渡します。

[object Promise]

## 例 {id="examples"}

以下のコードスニペットは、カスタムプラグインのいくつかの例を示しています。
実行可能なプロジェクトはこちらにあります: [custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### リクエストのロギング {id="request-logging"}

以下の例は、受信リクエストをロギングするためのカスタムプラグインの作成方法を示しています。

[object Promise]

### カスタムヘッダー {id="custom-header"}

この例は、各レスポンスにカスタムヘッダーを追加するプラグインの作成方法を示しています。

[object Promise]

### ボディの変換 {id="transform"}

以下の例は、次の方法を示しています。
*   クライアントから受信したデータを変換する。
*   クライアントに送信するデータを変換する。

[object Promise]

## パイプライン {id="pipelines"}

Ktorの[パイプライン](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)は、1つ以上の順序付けられたフェーズにグループ化されたインターセプターの集合です。各インターセプターは、リクエスト処理の前後にカスタムロジックを実行できます。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html)は、アプリケーション呼び出しを実行するためのパイプラインです。このパイプラインは5つのフェーズを定義しています。

*   `Setup`: 呼び出しとそのアトリビュートを処理のために準備するために使用されるフェーズ。
*   `Monitoring`: 呼び出しをトレースするためのフェーズです。リクエストのロギング、メトリクスの収集、エラー処理などに役立つ場合があります。
*   `Plugins`: [呼び出しを処理](#call-handling)するために使用されるフェーズ。ほとんどのプラグインはこのフェーズでインターセプトします。
*   `Call`: 呼び出しを完了するために使用されるフェーズ。
*   `Fallback`: 未処理の呼び出しを処理するためのフェーズ。

## パイプラインフェーズと新しいAPIハンドラの対応付け {id="mapping"}

v2.0.0以降、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)用の新しい簡略化されたAPIを提供します。
一般的に、このAPIはパイプライン、フェーズなどのKtor内部概念の理解を必要としません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`などのさまざまなハンドラを使用して、[リクエストとレスポンスの処理](#call-handling)の異なる段階にアクセスできます。
以下の表は、パイプラインフェーズが新しいAPIのハンドラにどのように対応付けられるかを示しています。

| ベースAPI                              | 新しいAPI                                               |
|:---------------------------------------|:--------------------------------------------------------|
| `ApplicationCallPipeline.Setup` より前 | [on(CallFailed)](server-custom-plugins.md#other)       |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)        |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)             |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive) |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond) |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)     |
| `Authentication.ChallengePhase` より後 | [on(AuthenticationChecked)](server-custom-plugins.md#other) |