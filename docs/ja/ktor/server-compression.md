[//]: # (title: 圧縮)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor は Kotlin/Native をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

Ktor は、[Compression](https://api.ktor.io/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html) プラグインを使用することで、レスポンスボディの圧縮とリクエストボディの解凍機能を提供します。
`gzip` や `deflate` などの様々な圧縮アルゴリズムを使用したり、データ圧縮に必要な条件（コンテンツタイプやレスポンスサイズなど）を指定したり、特定の要求パラメータに基づいてデータを圧縮したりすることも可能です。

> `%plugin_name%` プラグインは現在、`SSE` レスポンスをサポートしていないことに注意してください。
>
{style="warning"}

> Ktor で事前に圧縮された静的ファイルをどのように提供するかについては、[事前圧縮ファイル](server-static-content.md#precompressed) を参照してください。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
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

## %plugin_name% のインストール {id="install_plugin"}

<p>
    <code>%plugin_name%</code> プラグインをアプリケーションに<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内で <code>install</code> 関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code> クラスの拡張関数である、明示的に定義された <code>module</code> 内。
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

これにより、サーバー上で `gzip`、`deflate`、`identity` エンコーダーが有効になります。
次の章では、特定のエンコーダーのみを有効にし、データを圧縮するための条件を構成する方法について説明します。
追加されたすべてのエンコーダーは、必要に応じてリクエストボディを解凍するために使用されることに注意してください。

## 圧縮設定の構成 {id="configure"}

圧縮は複数の方法で構成できます。特定のエンコーダーのみを有効にしたり、その優先順位を指定したり、特定のコンテンツタイプのみを圧縮したりできます。

### 特定のエンコーダーの追加 {id="add_specific_encoders"}

特定のエンコーダーのみを有効にするには、対応する拡張関数を呼び出します。例えば、次のようになります。

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

各圧縮アルゴリズムの優先度は、`priority` プロパティを設定することで指定できます。

```kotlin
install(Compression) {
    gzip {
        priority = 0.9
    }
    deflate {
        priority = 1.0
    }
}
```

上記の例では、`deflate` の方が高い優先度値を持つため、`gzip` よりも優先されます。サーバーはまず [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) ヘッダー内の [品質値 (quality values)](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) を確認し、その後に指定された優先度を考慮することに注意してください。

### コンテンツタイプの構成 {id="configure_content_type"}

デフォルトでは、Ktor は `audio`、`video`、`image`、`text/event-stream` などの特定のコンテンツタイプを圧縮しません。
`matchContentType` を呼び出して圧縮するコンテンツタイプを選択したり、`excludeContentType` を使用して圧縮から除外するメディアタイプを指定したりできます。以下のコードスニペットは、`gzip` を使用してJavaScriptコードを圧縮し、`deflate` を使用してすべてのテキストサブタイプを圧縮する方法を示しています。

```kotlin
install(Compression) {
    gzip {
        matchContentType(
            ContentType.Application.JavaScript
        )
    }
    deflate {
        matchContentType(
            ContentType.Text.Any
        )
    }
}
```

完全な例はこちらで確認できます: [compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)。

### レスポンスサイズの構成 {id="configure_response_size"}

`%plugin_name%` プラグインを使用すると、指定された値を超えないサイズのレスポンスに対する圧縮を無効にできます。これを行うには、目的の値を (バイト単位で) `minimumSize` 関数に渡します。

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### カスタム条件の指定 {id="specify_custom_conditions"}

必要に応じて、`condition` 関数を使用してカスタム条件を提供し、特定のリクエストパラメータに応じてデータを圧縮できます。以下のコードスニペットは、指定されたURIへのリクエストを圧縮する方法を示しています。

```kotlin
install(Compression) {
    gzip {
        condition {
            request.uri == "/orders"
        }
    }
}
```

## HTTPS セキュリティ {id="security"}

圧縮が有効になっている HTTPS は、[BREACH](https://en.wikipedia.org/wiki/BREACH) 攻撃に対して脆弱です。この攻撃を軽減するには様々な方法があります。たとえば、リファラーヘッダーがクロスサイトリクエストを示している場合、圧縮を無効にすることができます。Ktor では、これはリファラーヘッダーの値をチェックすることで実現できます。

```kotlin
install(Compression) {
    gzip {
        condition {
            request.headers[HttpHeaders.Referrer]?.startsWith("https://my.domain/") == true
        }
    }
}
```

## カスタムエンコーダーの実装 {id="custom_encoder"}

必要に応じて、[ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html) インターフェースを実装することで独自のエンコーダーを提供できます。
実装例として [GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41) を参照してください。