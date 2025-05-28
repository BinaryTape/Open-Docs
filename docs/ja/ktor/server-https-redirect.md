[//]: # (title: HTTPSリダイレクト)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html)プラグインは、呼び出しを処理する前にすべてのHTTPリクエストを[HTTPS対応](server-ssl.md)にリダイレクトします。デフォルトでは、リソースは`301 Moved Permanently`を返しますが、`302 Found`になるように設定することもできます。

## 依存関係を追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%をインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

上記のコードは、デフォルト設定で`%plugin_name%`プラグインをインストールします。

>リバースプロキシの背後にある場合、HTTPSリクエストを適切に検出するには、`ForwardedHeader`または`XForwardedHeader`プラグインをインストールする必要があります。これらのプラグインのいずれかをインストールした後に無限リダイレクトが発生する場合は、詳細について[このFAQエントリ](FAQ.topic#infinite-redirect)を確認してください。
>
{type="note"}

## %plugin_name%を構成 {id="configure"}

以下のコードスニペットは、目的のHTTPSポートを設定し、要求されたリソースに対して`301 Moved Permanently`を返す方法を示しています。

```kotlin
```
{src="snippets/ssl-engine-main-redirect/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

完全な例はこちらで確認できます: [ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect)。