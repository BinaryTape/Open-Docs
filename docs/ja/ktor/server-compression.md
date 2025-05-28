[//]: # (title: 圧縮)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorは、[Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html)プラグインを使用することで、レスポンスボディを圧縮し、リクエストボディを解凍する機能を提供します。
`gzip` や `deflate` を含む様々な圧縮アルゴリズムを使用したり、データ圧縮の必要な条件（コンテンツタイプやレスポンスサイズなど）を指定したり、特定の要求パラメータに基づいてデータを圧縮したりすることもできます。

> `%plugin_name%` プラグインは現在、`SSE` レスポンスをサポートしていないことに注意してください。
>
{style="warning"}

> Ktorで事前に圧縮された静的ファイルを配信する方法については、[](server-static-content.md#precompressed) を参照してください。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

これにより、サーバー上で `gzip`、`deflate`、`identity` エンコーダが有効になります。
次の章では、特定のエンコーダのみを有効にし、データを圧縮するための条件を設定する方法について説明します。
追加されたすべてのエンコーダは、必要に応じてリクエストボディを解凍するために使用されることに注意してください。

## 圧縮設定の構成 {id="configure"}

圧縮は、特定のエンコーダのみを有効にしたり、その優先順位を指定したり、特定のコンテンツタイプのみを圧縮したりするなど、複数の方法で設定できます。

### 特定のエンコーダの追加 {id="add_specific_encoders"}

特定のエンコーダのみを有効にするには、対応する拡張関数を呼び出します。例：

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

各圧縮アルゴリズムの優先順位は、`priority` プロパティを設定することで指定できます。

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

上記の例では、`deflate` の方が優先度の値が高く、`gzip` よりも優先されます。サーバーはまず [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) ヘッダー内の [quality](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) 値を確認し、その後指定された優先順位を考慮することに注意してください。

### コンテンツタイプの構成 {id="configure_content_type"}

デフォルトでは、Ktor は `audio`、`video`、`image`、`text/event-stream` などの特定のコンテンツタイプを圧縮しません。
`matchContentType` を呼び出して圧縮するコンテンツタイプを選択したり、`excludeContentType` を使用して目的のメディアタイプを圧縮から除外したりできます。以下のコードスニペットは、`gzip` を使用してJavaScriptコードを圧縮し、`deflate` を使用してすべてのテキストサブタイプを圧縮する方法を示しています。

```kotlin
```

{src="snippets/compression/src/main/kotlin/compression/Application.kt" include-lines="12-13,15-19,21-25"}

完全な例はこちらで確認できます: [compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)。

### レスポンスサイズの構成 {id="configure_response_size"}

`%plugin_name%` プラグインを使用すると、指定された値を超えないサイズのレスポンスに対する圧縮を無効にできます。
これを行うには、目的の値（バイト単位）を `minimumSize` 関数に渡します。

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### カスタム条件の指定 {id="specify_custom_conditions"}

必要に応じて、`condition` 関数を使用してカスタム条件を提供し、特定の要求パラメータに応じてデータを圧縮できます。以下のコードスニペットは、指定されたURIに対するリクエストを圧縮する方法を示しています。

```kotlin
install(Compression) {
    gzip {
        condition {
            request.uri == "/orders"
        }
    }
}
```

## HTTPSセキュリティ {id="security"}

圧縮が有効になっているHTTPSは、[BREACH](https://en.wikipedia.org/wiki/BREACH)攻撃に対して脆弱です。この攻撃を軽減するために様々な方法を使用できます。
例えば、リファラーヘッダーがクロスサイトリクエストを示している場合は常に圧縮を無効にすることができます。Ktorでは、リファラーヘッダーの値をチェックすることでこれを行うことができます。

```kotlin
install(Compression) {
    gzip {
        condition {
            request.headers[HttpHeaders.Referrer]?.startsWith("https://my.domain/") == true
        }
    }
}
```

## カスタムエンコーダの実装 {id="custom_encoder"}

必要に応じて、[ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html) インターフェースを実装することで、独自のエンコーダを提供できます。
実装例については、[GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41) を参照してください。