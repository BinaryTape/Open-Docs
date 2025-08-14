[//]: # (title: サーバープラグイン)

<show-structure for="chapter" depth="2"/>

<link-summary>
プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。
</link-summary>

Ktorにおける典型的なリクエスト/レスポンスパイプラインは以下のようになります。

![Request Response Pipeline](request-response-pipeline.png){width="600"}

これはリクエストから始まり、特定のリクエストハンドラーにルーティングされ、アプリケーションロジックによって処理され、最終的にレスポンスが返されます。

## プラグインで機能を追加する {id="add_functionality"}

多くのアプリケーションでは、アプリケーションロジックの範囲外にある共通の機能が必要です。これには、シリアライゼーションやコンテンツエンコーディング、圧縮、ヘッダー、クッキーサポートなどが含まれます。これらのすべては、Ktorでは**プラグイン**と呼ばれるものによって提供されます。

前述のパイプライン図を見ると、プラグインはリクエスト/レスポンスとアプリケーションロジックの間に位置しています。

![Plugin pipeline](plugin-pipeline.png){width="600"}

リクエストが到着すると：

*   ルーティングメカニズムを介して適切なハンドラーにルーティングされます
*   ハンドラーに渡される前に、1つ以上のプラグインを経由します
*   ハンドラー（アプリケーションロジック）がリクエストを処理します
*   レスポンスがクライアントに送信される前に、1つ以上のプラグインを経由します

## ルーティングもプラグインです {id="routing"}

プラグインは最大限の柔軟性を提供するように設計されており、リクエスト/レスポンスパイプラインのどのセグメントにも存在できます。実際、これまで`routing`と呼んできたものは、プラグインに他なりません。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## プラグインの依存関係を追加する {id="dependency"}
ほとんどのプラグインは特定の依存関係を必要とします。例えば、`CORS`プラグインでは、ビルドスクリプトに`ktor-server-cors`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-server-cors"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>

## プラグインのインストール {id="install"}

プラグインは通常、サーバーの初期化フェーズで、プラグインをパラメータとして取る`install`関数を使用して設定されます。[サーバーを作成する方法](server-create-and-configure.topic)に応じて、`embeddedServer`呼び出し内でプラグインをインストールできます...

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

...または指定された[モジュール](server-modules.md)で：

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

リクエストとレスポンスをインターセプトするだけでなく、プラグインにはこのステップで設定されるオプションの構成セクションを持つことができます。

例えば、[クッキー](server-sessions.md#cookie)をインストールする際に、クッキーをどこに保存するか、またはその名前など、特定のパラメータを設定できます：

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
}
```

### 特定のルーティングへのプラグインのインストール {id="install-route"}

Ktorでは、プラグインをグローバルにだけでなく、特定の[ルーティング](server-routing.md)にもインストールできます。これは、異なるアプリケーションリソースに対して異なるプラグイン構成が必要な場合に役立ちます。例えば、以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)は、`/index`ルーティングに指定された[キャッシュヘッダー](server-caching-headers.md)を追加する方法を示しています：

[object Promise]

同じプラグインが複数インストールされている場合、以下のルールが適用されることに注意してください：
*   特定のルーティングにインストールされたプラグインの設定は、その[グローバル設定](#install)を上書きします。
*   ルーティングは同じルーティングに対するインストールをマージし、最後のインストールが優先されます。例えば、このようなアプリケーションの場合...

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

   ... `/index/a`と`/index/b`の両方の呼び出しは、プラグインの2番目のインストールのみによって処理されます。

## デフォルト、利用可能、およびカスタムプラグイン {id="default_available_custom"}

デフォルトでは、Ktorはどのプラグインもアクティブにしません。そのため、アプリケーションが必要とする機能を有効にするプラグインをインストールするのは開発者次第です。

しかしKtorは、すぐに使える様々なプラグインを提供しています。これらの完全なリストは、[Ktor Plugin Registry](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server)で確認できます。

さらに、独自の[カスタムプラグイン](server-custom-plugins.md)を作成することもできます。