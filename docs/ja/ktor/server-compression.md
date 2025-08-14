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

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✖️
    </p>
    
</tldr>

Ktorは、[Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html)プラグインを使用することで、レスポンスボディの圧縮およびリクエストボディの解凍機能を提供します。
`gzip`や`deflate`を含むさまざまな圧縮アルゴリズムを使用でき、データ圧縮に必要な条件（コンテンツタイプやレスポンスサイズなど）を指定したり、特定のRequestパラメーターに基づいてデータを圧縮したりすることも可能です。

> `%plugin_name%`プラグインは現在`SSE`レスポンスをサポートしていません。
>
{style="warning"}

> Ktorで事前に圧縮された静的ファイルを配信する方法については、[](server-static-content.md#precompressed)を参照してください。

## 依存関係の追加 {id="add_dependencies"}

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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
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
    

これにより、サーバー上で`gzip`、`deflate`、`identity`エンコーダーが有効になります。
次の章では、特定のエンコーダーのみを有効にし、データ圧縮の条件を設定する方法について説明します。
追加されたすべてのエンコーダーは、必要に応じてリクエストボディの解凍に使用されることに注意してください。

## 圧縮設定の構成 {id="configure"}

圧縮は複数の方法で構成できます。特定のエンコーダーのみを有効にしたり、優先度を指定したり、特定のコンテンツタイプのみを圧縮したり、などです。

### 特定のエンコーダーを追加する {id="add_specific_encoders"}

特定のエンコーダーのみを有効にするには、対応する拡張関数を呼び出します。例えば、次のようになります。

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

各圧縮アルゴリズムの優先度は、`priority`プロパティを設定することで指定できます。

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

上記の例では、`deflate`の優先度値が高く、`gzip`よりも優先されます。サーバーはまず、[Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)ヘッダー内の[品質値](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values)を調べ、次に指定された優先度を考慮することに注意してください。

### コンテンツタイプの設定 {id="configure_content_type"}

デフォルトでは、Ktorは`audio`、`video`、`image`、`text/event-stream`などの特定のコンテンツタイプを圧縮しません。
`matchContentType`を呼び出して圧縮するコンテンツタイプを選択したり、`excludeContentType`を使用して目的のメディアタイプを圧縮から除外したりできます。以下のコードスニペットは、JavaScriptコードを`gzip`で、すべてのテキストサブタイプを`deflate`で圧縮する方法を示しています。

[object Promise]

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)で確認できます。

### レスポンスサイズの設定 {id="configure_response_size"}

`%plugin_name%`プラグインを使用すると、指定された値を超えないサイズのレスポンスに対する圧縮を無効にできます。これを行うには、目的の値（バイト単位）を`minimumSize`関数に渡します。

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### カスタム条件の指定 {id="specify_custom_conditions"}

必要に応じて、`condition`関数を使用してカスタム条件を指定し、特定のRequestパラメーターに応じてデータを圧縮できます。以下のコードスニペットは、指定されたURIに対するリクエストを圧縮する方法を示しています。

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

圧縮が有効なHTTPSは、[BREACH](https://en.wikipedia.org/wiki/BREACH)攻撃に対して脆弱です。この攻撃を軽減するにはさまざまな方法があります。例えば、リファラーヘッダーがクロスサイトリクエストを示している場合、圧縮を無効にすることができます。Ktorでは、これはリファラーヘッダーの値をチェックすることで実現できます。

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

必要に応じて、[ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html)インターフェースを実装することで、独自のエンコーダーを提供できます。
実装例として、[GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41)を参照してください。