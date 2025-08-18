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

サーバーが[クロスオリジンリクエスト](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)を処理するように想定されている場合、[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html) Ktorプラグインをインストールして設定する必要があります。このプラグインを使用すると、許可されたホスト、HTTPメソッド、クライアントによって設定されたヘッダーなどを設定できます。

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
    <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
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
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>構成が必要な場合に役立ちます。
</p>

> <code>CORS</code>プラグインを特定のルートにインストールする場合、このルートに<code>options</code> [ハンドラー](server-routing.md#define_route)を追加する必要があります。これにより、KtorはCORSプリフライトリクエストに正しく応答できます。

## CORSの設定 {id="configure"}

CORS固有の設定は、[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)クラスによって公開されています。これらの設定を構成する方法を見てみましょう。

### 概要 {id="overview"}

<code>8080</code>ポートでリッスンし、<code>/customer</code> [ルート](server-routing.md)が[JSON](server-serialization.md#send_data)データを応答するサーバーがあるとします。以下のコードスニペットは、別のポートで動作するクライアントからFetch APIを使用して行われたサンプルリクエストを示しており、このリクエストがクロスオリジンになるようにしています。

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

バックエンド側でこのようなリクエストを許可するには、<code>CORS</code>プラグインを次のように構成する必要があります:

```kotlin
install(CORS) {
    allowHost("0.0.0.0:8081")
    allowHeader(HttpHeaders.ContentType)
}
```

完全な例はこちらで確認できます: [cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors)。

### ホスト {id="hosts"}

クロスオリジンリクエストを行うことができる許可されたホストを指定するには、<code>allowHost</code>関数を使用します。ホスト名の他に、ポート番号、サブドメインのリスト、またはサポートされているHTTPスキームを指定できます。

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

デフォルトでは、<code>%plugin_name%</code>プラグインは<code>GET</code>、<code>POST</code>、<code>HEAD</code>のHTTPメソッドを許可します。追加のメソッドを追加するには、<code>allowMethod</code>関数を使用します。

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### ヘッダーの許可 {id="headers"}

デフォルトでは、<code>%plugin_name%</code>プラグインは<code>Access-Control-Allow-Headers</code>によって管理される以下のクライアントヘッダーを許可します:

*   <code>Accept</code>
*   <code>Accept-Language</code>
*   <code>Content-Language</code>

追加のヘッダーを許可するには、<code>allowHeader</code>関数を使用します。

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

カスタムヘッダーを許可するには、<code>allowHeaders</code>関数または<code>allowHeadersPrefixed</code>関数を使用します。例えば、以下のコードスニペットは、<code>custom-</code>で始まるヘッダーを許可する方法を示しています。

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> <code>allowHeaders</code>または<code>allowHeadersPrefixed</code>は、非単純なコンテンツタイプの場合、[allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html)プロパティを<code>true</code>に設定する必要があることに注意してください。

### ヘッダーの公開 {id="expose-headers"}

<code>Access-Control-Expose-Headers</code>ヘッダーは、ブラウザのJavaScriptがアクセスできる許可リストに指定されたヘッダーを追加します。このようなヘッダーを構成するには、<code>exposeHeader</code>関数を使用します。

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

<code>%plugin_name%</code>プラグインは、他のCORS関連の設定も指定できます。例えば、<code>maxAgeInSeconds</code>を使用すると、プリフライトリクエストに対する応答を、別のプリフライトリクエストを送信することなくキャッシュできる期間を指定できます。

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

その他の設定オプションについては、[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)で確認できます。