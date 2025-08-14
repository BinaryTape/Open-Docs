[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

サーバーが[クロスオリジンリクエスト](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)を処理する必要がある場合、
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktorプラグインをインストールして設定する必要があります。このプラグインを使用すると、許可されたホスト、HTTPメソッド、クライアントによって設定されるヘッダーなどを設定できます。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
    </p>
    

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
    

## %plugin_name%をインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
        指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数の呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにインストール</a>することもできます。
        これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に便利です。
    </p>
    

> `CORS`プラグインを特定のルートにインストールする場合、そのルートに`options` [ハンドラー](server-routing.md#define_route)を追加する必要があります。これにより、Ktorは`CORS`プリフライトリクエストに正しく応答できるようになります。

## CORSを設定する {id="configure"}

CORS固有の設定は、[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)クラスによって公開されています。これらの設定を構成する方法を見てみましょう。

### 概要 {id="overview"}

`8080`ポートでリッスンしており、`/customer` [ルート](server-routing.md)が[JSON](server-serialization.md#send_data)データで応答するサーバーがあるとします。以下のコードスニペットは、このリクエストをクロスオリジンにするために、別のポートで動作するクライアントからFetch APIを使用して行われたサンプルリクエストを示しています。

[object Promise]

バックエンド側でこのようなリクエストを許可するには、以下のように`CORS`プラグインを設定する必要があります。

[object Promise]

完全な例はこちらにあります: [cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### ホスト {id="hosts"}

クロスオリジンリクエストを許可するホストを指定するには、<code>allowHost</code>関数を使用します。ホスト名に加えて、ポート番号、サブドメインのリスト、またはサポートされているHTTPスキームを指定できます。

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

任意のホストからのクロスオリジンリクエストを許可するには、<code>anyHost</code>関数を使用します。

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTPメソッド {id="methods"}

デフォルトでは、<code>%plugin_name%</code>プラグインは<code>GET</code>、<code>POST</code>、<code>HEAD</code>のHTTPメソッドを許可します。追加のメソッドを許可するには、<code>allowMethod</code>関数を使用します。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### ヘッダーを許可する {id="headers"}

デフォルトでは、<code>%plugin_name%</code>プラグインは、<code>Access-Control-Allow-Headers</code>によって管理される以下のクライアントヘッダーを許可します。

*   `Accept`
*   `Accept-Language`
*   `Content-Language`

追加のヘッダーを許可するには、<code>allowHeader</code>関数を使用します。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

カスタムヘッダーを許可するには、<code>allowHeaders</code>または<code>allowHeadersPrefixed</code>関数を使用します。例えば、以下のコードスニペットは、<code>custom-</code>で始まるヘッダーを許可する方法を示しています。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> 注意点として、シンプルでないコンテンツタイプの場合、<code>allowHeaders</code>または<code>allowHeadersPrefixed</code>は[allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html)プロパティを<code>true</code>に設定する必要があります。

### ヘッダーを公開する {id="expose-headers"}

`Access-Control-Expose-Headers`ヘッダーは、ブラウザのJavaScriptがアクセスできる許可リストに指定されたヘッダーを追加します。
そのようなヘッダーを設定するには、<code>exposeHeader</code>関数を使用します。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 認証情報 {id="credentials"}

デフォルトでは、ブラウザはクロスオリジンリクエストで認証情報（クッキーや認証情報など）を送信しません。この情報の受け渡しを許可するには、<code>allowCredentials</code>プロパティを使用して<code>Access-Control-Allow-Credentials</code>応答ヘッダーを<code>true</code>に設定します。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### その他 {id="misc"}

<code>%plugin_name%</code>プラグインでは、その他の`CORS`関連設定も指定できます。例えば、<code>maxAgeInSeconds</code>を使用すると、プリフライトリクエストに対する応答が、別のプリフライトリクエストを送信することなくキャッシュされる期間を指定できます。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

その他の設定オプションについては、[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)から学ぶことができます。