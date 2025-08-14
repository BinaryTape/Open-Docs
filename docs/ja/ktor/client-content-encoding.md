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
ContentEncodingプラグインを使用すると、指定された圧縮アルゴリズム（「gzip」や「deflate」など）を有効にし、その設定を構成できます。
</link-summary>

Ktorクライアントは、指定された圧縮アルゴリズム（`gzip`や`deflate`など）を有効にし、その設定を構成できる[ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding)プラグインを提供します。このプラグインには主に3つの目的があります。
*   `Accept-Encoding`ヘッダーを指定された品質値で設定します。
*   オプションでリクエストボディをエンコードします。
*   [サーバーから受信したコンテンツ](client-responses.md#body)をデコードして、元のペイロードを取得します。

## 依存関係の追加 {id="add_dependencies"}
`ContentEncoding`を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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

    <p>
        Ktorクライアントに必要なアーティファクトの詳細については、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係の追加</Links>を参照してください。
    </p>

## ContentEncodingのインストール {id="install_plugin"}
`ContentEncoding`をインストールするには、[クライアント構成ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
```

## ContentEncodingの構成 {id="configure_plugin"}
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)は、`deflate`と`gzip`エンコーダーをクライアント上で指定された品質値で有効にする方法を示しています。

[object Promise]

必要に応じて、`ContentEncoder`インターフェースを実装してカスタムエンコーダーを作成し、`customEncoder`関数に渡すことができます。

## リクエストボディのエンコード {id="encode_request_body"}
リクエストボディをエンコードするには、[HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)ブロック内で`compress()`関数を使用します。
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