[//]: # (title: サーバープラグイン)

<show-structure for="chapter" depth="2"/>

<link-summary>
プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。
</link-summary>

Ktorにおける典型的なリクエスト/レスポンスパイプラインは以下のようになります。

![Request Response Pipeline](request-response-pipeline.png){width="600"}

リクエストから始まり、特定のハンドラにルーティングされ、アプリケーションロジックによって処理され、最終的にレスポンスが返されます。

## プラグインで機能を追加する {id="add_functionality"}

多くのアプリケーションは、アプリケーションロジックの範囲外にある共通機能を必要とします。これには、シリアライゼーションやコンテンツエンコーディング、圧縮、ヘッダー、クッキーサポートなどが含まれます。これらはすべて、Ktorでは**プラグイン**と呼ばれるものによって提供されます。

前のパイプライン図を見ると、プラグインはリクエスト/レスポンスとアプリケーションロジックの間に位置しています。

![Plugin pipeline](plugin-pipeline.png){width="600"}

リクエストが入ってくると：

* ルーティングメカニズムを介して適切なハンドラにルーティングされます
* ハンドラに渡される前に、1つまたは複数のプラグインを通過します
* ハンドラ（アプリケーションロジック）がリクエストを処理します
* レスポンスがクライアントに送信される前に、1つまたは複数のプラグインを通過します

## ルーティングはプラグインである {id="routing"}

プラグインは、最大限の柔軟性を提供するように設計されており、リクエスト/レスポンスパイプラインのどのセグメントにも存在できるようにします。実際、これまで`routing`と呼んでいたものは、単なるプラグインに過ぎません。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## プラグインの依存関係を追加する {id="dependency"}
ほとんどのプラグインは特定の依存関係を必要とします。例えば、`CORS`プラグインでは、ビルドスクリプトに`ktor-server-cors`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-server-cors"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## プラグインをインストールする {id="install"}

プラグインは通常、サーバーの初期化フェーズで、プラグインをパラメータとして取る`install`関数を使用して設定されます。 [サーバーの作成](server-create-and-configure.topic)方法に応じて、`embeddedServer`呼び出し内でプラグインをインストールできます...

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS)
        install(Compression)
        // ...
    }.start(wait = true)
}
```

... または指定された[モジュール](server-modules.md)でインストールできます。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun Application.module() {
    install(CORS)
    install(Compression)
    // ...
}
```

リクエストとレスポンスをインターセプトすることに加えて、プラグインはこのステップで設定されるオプションのコンフィグレーションセクションを持つことができます。

例えば、[クッキー](server-sessions.md#cookie)をインストールする際に、クッキーの保存場所や名前などの特定のパラメータを設定できます。

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
}
```

### 特定のルートにプラグインをインストールする {id="install-route"}

Ktorでは、プラグインをグローバルにインストールできるだけでなく、特定の[ルート](server-routing.md)にもインストールできます。これは、異なるアプリケーションリソースに対して異なるプラグイン設定が必要な場合に役立つことがあります。例えば、以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)は、`/index`ルートに指定された[キャッシングヘッダー](server-caching-headers.md)を追加する方法を示しています。

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

同じプラグインを複数回インストールする場合、以下のルールが適用されることに注意してください。
* 特定のルートにインストールされたプラグインの設定は、その[グローバル設定](#install)を上書きします。
* ルーティングは同じルートに対するインストールをマージし、最後のインストールが優先されます。例えば、このようなアプリケーションの場合...

   ```kotlin
   routing {
       route("index") {
           install(CachingHeaders) { /* First configuration */ }
           get("a") {
               // ...
           }
       }
       route("index") {
           install(CachingHeaders) { /* Second configuration */ }
           get("b") {
               // ...
           }
       }
   }
   ```
   {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // First configuration }"}

   ... `/index/a`と`/index/b`の両方への呼び出しは、プラグインの2番目のインストールのみによって処理されます。

## デフォルト、利用可能なプラグイン、およびカスタムプラグイン {id="default_available_custom"}

デフォルトでは、Ktorはどのプラグインもアクティブにしません。したがって、アプリケーションに必要な機能のためにプラグインをインストールするかどうかはユーザー次第です。

ただし、Ktorは標準で様々なプラグインを提供しています。これらの完全なリストは、[Ktor Plugin Registry](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server)で確認できます。

さらに、独自の[カスタムプラグイン](server-custom-plugins.md)を作成することもできます。