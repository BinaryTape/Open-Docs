[//]: # (title: コンテンツエンコーディング)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentEncodingプラグインを使用すると、指定された圧縮アルゴリズム（`gzip`や`deflate`など）を有効にし、その設定を構成できます。
</link-summary>

Ktorクライアントは、指定された圧縮アルゴリズム（`gzip`や`deflate`など）を有効にし、その設定を構成できる[`ContentEncoding`](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding)プラグインを提供します。このプラグインには、主に3つの目的があります。
* 指定された品質値で`Accept-Encoding`ヘッダーを設定します。
* オプションでリクエストボディをエンコードします。
* サーバーから受信したコンテンツをデコードして、元のペイロードを取得します。

## 依存関係を追加する {id="add_dependencies"}
`ContentEncoding`を使用するには、`%artifact_name%`アーティファクトをビルドスクリプトに含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## ContentEncodingをインストールする {id="install_plugin"}
`ContentEncoding`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内の`install`関数に渡します。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
```

## ContentEncodingを設定する {id="configure_plugin"}
以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)は、クライアントで`deflate`および`gzip`エンコーダーを指定された品質値で有効にする方法を示しています。

```kotlin
```
{src="snippets/client-content-encoding/src/main/kotlin/com/example/Application.kt" include-lines="16-21"}

必要に応じて、`ContentEncoder`インターフェースを実装してカスタムエンコーダーを作成し、`customEncoder`関数に渡すことができます。

## リクエストボディをエンコードする {id="encode_request_body"}
リクエストボディをエンコードするには、[`HttpRequestBuilder`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)ブロック内で`compress()`関数を使用します。
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