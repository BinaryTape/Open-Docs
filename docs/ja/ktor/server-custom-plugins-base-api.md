[//]: # (title: カスタムプラグイン - ベースAPI)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

> v2.0.0以降、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)のための新しい簡素化されたAPIを提供しています。
>
{type="note"}

Ktorは、一般的な機能を実装し、複数のアプリケーションで再利用できるカスタム[プラグイン](server-plugins.md)を開発するためのAPIを公開しています。このAPIを使用すると、異なる[パイプライン](#pipelines)フェーズをインターセプトして、リクエスト/レスポンス処理にカスタムロジックを追加できます。例えば、`Monitoring`フェーズをインターセプトして、着信リクエストをログに記録したり、メトリクスを収集したりできます。

## プラグインを作成する {id="create"}
カスタムプラグインを作成するには、以下の手順に従います。

1. プラグインクラスを作成し、以下のいずれかのインターフェースを実装する[コンパニオンオブジェクトを宣言](#create-companion)します。
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html) (プラグインをアプリケーションレベルで動作させる場合)。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html) (プラグインを[特定のルートにインストール](server-plugins.md#install-route)できる場合)。
2. このコンパニオンオブジェクトの`key`および`install`メンバーを[実装](#implement)します。
3. [プラグイン設定](#plugin-configuration)を提供します。
4. 必要なパイプラインフェーズをインターセプトして[呼び出しを処理](#call-handling)します。
5. [プラグインをインストール](#install)します。

### コンパニオンオブジェクトを作成する {id="create-companion"}

カスタムプラグインのクラスは、`BaseApplicationPlugin`または`BaseRouteScopedPlugin`インターフェースを実装するコンパニオンオブジェクトを持つ必要があります。
`BaseApplicationPlugin`インターフェースは3つの型パラメータを受け入れます。
- このプラグインと互換性のあるパイプラインの型。
- このプラグインの[設定オブジェクトの型](#plugin-configuration)。
- プラグインオブジェクトのインスタンス型。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 'key'および'install'メンバーを実装する {id="implement"}

`BaseApplicationPlugin`インターフェースの子孫として、コンパニオンオブジェクトは2つのメンバーを実装する必要があります。
- `key`プロパティはプラグインを識別するために使用されます。Ktorはすべての属性のマップを持っており、各プラグインは指定されたキーを使用して自身をこのマップに追加します。
- `install`関数は、プラグインの動作を設定するために使用されます。ここでは、パイプラインをインターセプトしてプラグインインスタンスを返す必要があります。パイプラインをインターセプトして呼び出しを処理する方法については、[次の章](#call-handling)で説明します。

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

### 呼び出しを処理する {id="call-handling"}

カスタムプラグインでは、[既存のパイプラインフェーズ](#pipelines)または新しく定義されたフェーズをインターセプトすることで、リクエストとレスポンスを処理できます。例えば、[Authentication](server-auth.md)プラグインは、デフォルトのパイプラインに`Authenticate`および`Challenge`というカスタムフェーズを追加します。したがって、特定のパイプラインをインターセプトすることで、呼び出しの異なるステージにアクセスできます。例えば:

- `ApplicationCallPipeline.Monitoring`: このフェーズをインターセプトすることは、リクエストロギングやメトリクス収集に利用できます。
- `ApplicationCallPipeline.Plugins`: レスポンスパラメータを変更するために使用できます。例えば、カスタムヘッダーを追加するなどです。
- `ApplicationReceivePipeline.Transform` および `ApplicationSendPipeline.Transform`: クライアントから受信したデータを取得し、[変換](#transform)したり、データを送信し返す前に変換したりできます。

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

このプラグインでは、カスタムヘッダーの名前と値がハードコードされていることに注意してください。必要なカスタムヘッダーの名前/値を渡すための[設定を提供](#plugin-configuration)することで、このプラグインをより柔軟にすることができます。

> カスタムプラグインを使用すると、呼び出しに関連する任意の値を共有できるため、その呼び出しを処理する任意のハンドラ内でこの値にアクセスできます。詳細については、[](server-custom-plugins.md#call-state)を参照してください。

### プラグイン設定を提供する {id="plugin-configuration"}

[前の章](#call-handling)では、各レスポンスに事前定義されたカスタムヘッダーを追加するプラグインの作成方法を示しました。このプラグインをより便利にし、必要なカスタムヘッダーの名前/値を渡すための設定を提供しましょう。まず、プラグインのクラス内に設定クラスを定義する必要があります。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="11-14"}

プラグイン設定フィールドは可変であるため、ローカル変数に保存することをお勧めします。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="7-14,27"}

最後に、`install`関数で、この設定を取得し、そのプロパティを使用できます。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="7-27"}

### プラグインをインストールする {id="install"}

カスタムプラグインをアプリケーションに[インストール](server-plugins.md#install)するには、`install`関数を呼び出し、目的の[設定](#plugin-configuration)パラメータを渡します。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/Application.kt" include-lines="12-15"}

## 例 {id="examples"}

以下のコードスニペットは、カスタムプラグインのいくつかの例を示しています。
実行可能なプロジェクトはここで見つけることができます: [custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### リクエストロギング {id="request-logging"}

以下の例は、着信リクエストをロギングするためのカスタムプラグインを作成する方法を示しています。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/RequestLogging.kt"}

### カスタムヘッダー {id="custom-header"}

この例は、各レスポンスにカスタムヘッダーを追加するプラグインを作成する方法を示しています。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

### ボディ変換 {id="transform"}

以下の例は、次の方法を示しています。
- クライアントから受信したデータを変換する。
- クライアントに送信するデータを変換する。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/DataTransformation.kt"}

## パイプライン {id="pipelines"}

Ktorにおける[パイプライン](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)とは、1つ以上の順序付けられたフェーズにグループ化されたインターセプターの集合です。各インターセプターは、リクエスト処理の前後にカスタムロジックを実行できます。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html)は、アプリケーション呼び出しを実行するためのパイプラインです。このパイプラインは5つのフェーズを定義しています。

- `Setup`: 呼び出しとその属性を処理のために準備するために使用されるフェーズ。
- `Monitoring`: 呼び出しをトレースするためのフェーズです。リクエストロギング、メトリクス収集、エラー処理などに役立つ場合があります。
- `Plugins`: [呼び出しを処理](#call-handling)するために使用されるフェーズです。ほとんどのプラグインはこのフェーズでインターセプトします。
- `Call`: 呼び出しを完了するために使用されるフェーズ。
- `Fallback`: 未処理の呼び出しを処理するためのフェーズ。

## パイプラインフェーズと新しいAPIハンドラのマッピング {id="mapping"}

v2.0.0以降、Ktorは[カスタムプラグインの作成](server-custom-plugins.md)のための新しい簡素化されたAPIを提供しています。
一般的に、このAPIは、パイプライン、フェーズなどの内部Ktor概念の理解を必要としません。代わりに、`onCall`、`onCallReceive`、`onCallRespond`などの様々なハンドラを使用して、[リクエストとレスポンスの処理](#call-handling)の異なるステージにアクセスできます。
以下の表は、パイプラインフェーズが新しいAPIのハンドラにどのようにマッピングされるかを示しています。

| ベースAPI                               | 新しいAPI                                                 |
|----------------------------------------|---------------------------------------------------------|
| `ApplicationCallPipeline.Setup` の前      | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| `Authentication.ChallengePhase` の後    | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |