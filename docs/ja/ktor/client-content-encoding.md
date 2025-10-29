[//]: # (title: コンテンツエンコーディング)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
ContentEncoding プラグインを使用すると、指定された圧縮アルゴリズム (gzip や deflate など) を有効にし、その設定を構成できます。
</link-summary>

Ktor クライアントは、指定された圧縮アルゴリズム (<code>gzip</code> や <code>deflate</code> など) を有効にし、その設定を構成できる [ContentEncoding](https://api.ktor.io/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) プラグインを提供します。このプラグインには、主に3つの目的があります。
* 指定されたQ値（品質値）を持つ `Accept-Encoding` ヘッダーを設定します。
* 必要に応じてリクエストボディをエンコードします。
* [サーバーから受信したコンテンツ](client-responses.md#body)をデコードし、元のペイロードを取得します。

## 依存関係の追加 {id="add_dependencies"}
`ContentEncoding` を使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含める必要があります。

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
<p>
    Ktor クライアントに必要なアーティファクトについては、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係の追加</Links>から詳細を確認できます。
</p>

## ContentEncoding のインストール {id="install_plugin"}
`ContentEncoding` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の `install` 関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
```

## ContentEncoding の構成 {id="configure_plugin"}
以下の [例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)は、指定されたQ値（品質値）でクライアントの `deflate` および `gzip` エンコーダを有効にする方法を示しています。

```kotlin
val client = HttpClient(CIO) {
    install(ContentEncoding) {
        deflate(1.0F)
        gzip(0.9F)
    }
}
```

必要に応じて、`ContentEncoder` インターフェースを実装してカスタムエンコーダを作成し、`customEncoder` 関数に渡すことができます。

## リクエストボディのエンコード {id="encode_request_body"}
リクエストボディをエンコードするには、[HttpRequestBuilder](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) ブロック内で `compress()` 関数を使用します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
client.post("/upload") {
    compress("gzip")
    setBody(someLongBody)
}