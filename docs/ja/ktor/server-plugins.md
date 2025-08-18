[//]: # (title: サーバープラグイン)

<show-structure for="chapter" depth="2"/>

<link-summary>
プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの共通機能を提供します。
</link-summary>

Ktorにおける一般的なリクエスト/レスポンスパイプラインは以下のようになります。

![Request Response Pipeline](request-response-pipeline.png){width="600"}

リクエストから始まり、特定のハンドラーにルーティングされ、アプリケーションロジックによって処理され、最終的にレスポンスが返されます。

## プラグインで機能を追加する {id="add_functionality"}

多くのアプリケーションでは、アプリケーションロジックの範囲外となる共通機能が必要です。これには、シリアライゼーション、コンテンツエンコーディング、圧縮、ヘッダー、Cookieのサポートなどが含まれます。これらすべては、Ktorでは**プラグイン (Plugins)** と呼ばれるものによって提供されます。

前のパイプライン図を見ると、プラグインはリクエスト/レスポンスとアプリケーションロジックの間に位置しています。

![Plugin pipeline](plugin-pipeline.png){width="600"}

リクエストが来たとき：

*   ルーティングメカニズムを通じて正しいハンドラーにルーティングされる
*   ハンドラーに渡される前に、1つまたは複数のプラグインを経由する
*   ハンドラー（アプリケーションロジック）がリクエストを処理する
*   レスポンスがクライアントに送信される前に、1つまたは複数のプラグインを経由する

## ルーティングもプラグインである {id="routing"}

プラグインは最大限の柔軟性を提供するように設計されており、リクエスト/レスポンスパイプラインのどのセグメントにも存在できるようにしています。実際、これまで`routing`と呼んでいたものは、単なるプラグインに過ぎません。

![Routing as a Plugin](plugin-pipeline-routing.png){width="600"}

## プラグインの依存関係を追加する {id="dependency"}
ほとんどのプラグインは特定の依存関係を必要とします。例えば、`CORS`プラグインでは、ビルドスクリプトに`ktor-server-cors`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-server-cors"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## プラグインをインストールする {id="install"}

プラグインは通常、サーバーの初期化フェーズで、プラグインをパラメータとして取る`install`関数を使用して設定されます。[サーバーの作成方法](server-create-and-configure.topic)に応じて、`embeddedServer`呼び出しの内部でプラグインをインストールできます...

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

...または指定された[モジュール](server-modules.md)でインストールできます。

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

例えば、[Cookie](server-sessions.md#cookie)をインストールする際に、Cookieをどこに保存するか、その名前など、特定のパラメータを設定できます。

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 特定のルートにプラグインをインストールする {id="install-route"}

Ktorでは、プラグインをグローバルにインストールするだけでなく、特定の[ルート](server-routing.md)にもインストールできます。これは、異なるアプリケーションリソースに対して異なるプラグイン構成が必要な場合に役立ちます。例えば、以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)は、`/index`ルートに指定された[キャッシュヘッダー](server-caching-headers.md)を追加する方法を示しています。

```kotlin
route("/index") {
    install(CachingHeaders) {
        options { call, content -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 1800)) }
    }
    get {
        call.respondText("Index page")
    }
}
```

同じプラグインが複数インストールされている場合、以下のルールが適用されることに注意してください。
*   特定のルートにインストールされたプラグインの設定は、その[グローバル設定](#install)を上書きします。
*   ルーティングは同じルートのインストールをマージし、最後のインストールが優先されます。例えば、このようなアプリケーションの場合...

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
    {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // 最初の設定 }"}

    ...`/index/a`と`/index/b`への両方の呼び出しは、プラグインの2番目のインストールのみによって処理されます。

## デフォルト、利用可能なプラグイン、カスタムプラグイン {id="default_available_custom"}

デフォルトでは、Ktorはどのプラグインもアクティベートしないため、アプリケーションが必要とする機能のためにプラグインをインストールするかどうかは、あなた次第です。

しかしながら、Ktorは箱から出してすぐに使える様々なプラグインを提供しています。これらの完全なリストは、[Ktor Plugin Registry](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server)で確認できます。

さらに、独自の[カスタムプラグイン](server-custom-plugins.md)を作成することもできます。