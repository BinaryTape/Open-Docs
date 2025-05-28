`[//]: # (title: 転送されたヘッダー)`

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) および [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) プラグインを使用すると、Ktorサーバーがリバースプロキシの背後に配置されている場合に、リバースプロキシヘッダーを処理して元の[リクエスト](server-requests.md)に関する情報を取得できます。これは[ロギング](server-logging.md)の目的で役立つ場合があります。

* `ForwardedHeaders` は `Forwarded` ヘッダー ([RFC 7239](https://tools.ietf.org/html/rfc7239)) を処理します。
* `XForwardedHeaders` は以下の `X-Forwarded-` ヘッダーを処理します。
   - `X-Forwarded-Host`/`X-Forwarded-Server` 
   - `X-Forwarded-For` 
   - `X-Forwarded-By`
   - `X-Forwarded-Proto`/`X-Forwarded-Protocol`
   - `X-Forwarded-SSL`/`Front-End-Https`

> `Forwarded` ヘッダーの改ざんを防ぐため、アプリケーションがリバースプロキシ接続のみを受け入れる場合にこれらのプラグインをインストールしてください。
> 
{type="note"}

## 依存関係の追加 {id="add_dependencies"}
`ForwardedHeaders`/`XForwardedHeaders` プラグインを使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## プラグインのインストール {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>
</tabs>

`ForwardedHeaders`/`XForwardedHeaders` をインストールした後、[call.request.origin](#request_info) プロパティを使用して元のリクエストに関する情報を取得できます。

## リクエスト情報の取得 {id="request_info"}

### プロキシリクエスト情報 {id="proxy_request_info"}

プロキシリクエストに関する情報を取得するには、[ルートハンドラ](server-routing.md#define_route)内で [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) プロパティを使用します。
以下のコードスニペットは、プロキシアドレスとリクエストが送信されたホストに関する情報を取得する方法を示しています。

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17-19,25"}

### 元のリクエスト情報 {id="original-request-information"}

元のリクエストに関する情報を読み取るには、[call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) プロパティを使用します。

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17,20-21,25"}

以下の表は、`ForwardedHeaders`/`XForwardedHeaders` がインストールされているかどうかによって、`call.request.origin` によって公開される異なるプロパティの値を示しています。

![リクエストの図](forwarded-headers.png){width="706"}

| プロパティ               | ForwardedHeadersなしの場合 | ForwarderHeadersありの場合 |
|------------------------|--------------------------|-----------------------|
| `origin.localHost`     | _web-server_             | _web-server_          |
| `origin.localPort`     | _8080_                   | _8080_                |
| `origin.serverHost`    | _web-server_             | _proxy_               |
| `origin.serverPort`    | _8080_                   | _80_                  |
| `origin.remoteHost`    | _proxy_                  | _client_              |
| `origin.remotePort`    | _32864_                  | _32864_               |

> 完全な例はこちらで見つけることができます: [forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## ForwardedHeadersの設定 {id="configure"}

リクエストが複数のプロキシを経由する場合、`ForwardedHeaders`/`XForwardedHeaders` を設定する必要がある場合があります。
この場合、`X-Forwarded-For` には各後続プロキシのすべてのIPアドレスが含まれます。例:

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

デフォルトでは、`XForwardedHeader` は `X-Forwarded-For` の最初の値を `call.request.origin.remoteHost` プロパティに割り当てます。
[IPアドレスを選択するためのカスタムロジック](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)を提供することもできます。
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) は、これに対して以下のAPIを公開しています。

- `useFirstProxy` と `useLastProxy` を使用すると、それぞれIPアドレスのリストから最初の値または最後の値を取得できます。
- `skipLastProxies` は右から指定された数のエントリをスキップし、次のエントリを取得します。
   例として、`proxiesCount` パラメータが `3` の場合、以下のヘッダーに対して `origin.remoteHost` は `10.0.0.123` を返します。
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `skipKnownProxies` は指定されたエントリをリストから削除し、最後のエントリを取得します。
   例として、この関数に `listOf("proxy-1", "proxy-3")` を渡した場合、以下のヘッダーに対して `origin.remoteHost` は `proxy-2` を返します。
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `extractEdgeProxy` を使用すると、`X-Forward-*` ヘッダーから値を抽出するためのカスタムロジックを提供できます。