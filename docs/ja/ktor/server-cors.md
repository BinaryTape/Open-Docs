[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
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

サーバーが[クロスオリジンリクエスト](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)を処理するように想定されている場合、
[CORS](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktorプラグインをインストールして設定する必要があります。このプラグインを使用すると、許可されたホスト、HTTPメソッド、クライアントによって設定されたヘッダーなどを設定できます。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります:
</p>
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

## %plugin_name%のインストール {id="install_plugin"}

<p>
    <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ...<code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ...明示的に定義された<code>module</code>内（<code>Application</code>クラスの拡張関数）。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>構成が必要な場合に役立ちます。
</p>

> `CORS`プラグインを特定のルートにインストールする場合、このルートに
`options` [ハンドラー](server-routing.md#define_route)を追加する必要があります。これにより、KtorはCORS
プリフライトリクエストに正しく応答できます。

## CORSの設定 {id="configure"}

CORS固有の設定は、
[CORSConfig](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)
クラスによって公開されています。これらの設定を構成する方法を見てみましょう。

### 概要 {id="overview"}

<code>8080</code>ポートでリッスンし、`/customer` [ルート](server-routing.md)が
[JSON](server-serialization.md#send_data)データを応答するサーバーがあるとします。以下のコードスニペットは、
別のポートで動作するクライアントからFetch APIを使用して行われたサンプルリクエストを示しており、このリクエストがクロスオリジンになるようにしています。

```javascript
function saveCustomer() {
    fetch('http://0.0.0.0:8080/customer',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({id: 3, firstName: "Jet", lastName: "Brains"})
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

```

バックエンド側でこのようなリクエストを許可するには、`CORS`プラグインを次のように構成する必要があります:

```kotlin
install(CORS) {
    allowHost("0.0.0.0:8081")
    allowHeader(HttpHeaders.ContentType)
}
```

完全な例はこちらで確認できます: [cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### ホスト {id="hosts"}

クロスオリジンリクエストを行うことができる許可されたホストを指定するには、`allowHost`関数を使用します。ホスト名の他に、
ポート番号、サブドメインのリスト、またはサポートされているHTTPスキームを指定できます。

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

任意のホストからのクロスオリジンリクエストを許可するには、`anyHost`関数を使用します。

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTPメソッド {id="methods"}

デフォルトでは、`%plugin_name%`プラグインは`GET`、`POST`、`HEAD`のHTTPメソッドを許可します。追加のメソッドを追加するには、
`allowMethod`関数を使用します。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### ヘッダーの許可 {id="headers"}

デフォルトでは、`%plugin_name%`プラグインは`Access-Control-Allow-Headers`によって管理される以下のクライアントヘッダーを許可します:

*   `Accept`
*   `Accept-Language`
*   `Content-Language`

追加のヘッダーを許可するには、`allowHeader`関数を使用します。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

カスタムヘッダーを許可するには、`allowHeaders`関数または`allowHeadersPrefixed`関数を使用します。例えば、以下のコードスニペットは、
`custom-`で始まるヘッダーを許可する方法を示しています。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> `allowHeaders`または`allowHeadersPrefixed`は、非単純なコンテンツタイプの場合、
[allowNonSimpleContentTypes](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html)
プロパティを`true`に設定する必要があることに注意してください。

### ヘッダーの公開 {id="expose-headers"}

`Access-Control-Expose-Headers`ヘッダーは、ブラウザのJavaScriptがアクセスできる許可リストに指定されたヘッダーを追加します。
このようなヘッダーを構成するには、`exposeHeader`関数を使用します。

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 認証情報 {id="credentials"}

デフォルトでは、ブラウザはクロスオリジンリクエストで認証情報（クッキーや認証情報など）を送信しません。この情報の受け渡しを許可するには、
`allowCredentials`プロパティを使用して`Access-Control-Allow-Credentials`応答ヘッダーを`true`に設定します。

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### その他 {id="misc"}

`%plugin_name%`プラグインは、他のCORS関連の設定も指定できます。例えば、
`maxAgeInSeconds`を使用すると、プリフライトリクエストに対する応答を、別のプリフライトリクエストを送信することなくキャッシュできる期間を指定できます。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

その他の設定オプションについては、
[CORSConfig](https://api.ktor.io/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)で確認できます。