[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% は、`X-HTTP-Method-Override` ヘッダー内にHTTP動詞をトンネルする機能を可能にします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html)プラグインは、`X-HTTP-Method-Override` ヘッダー内にHTTP動詞をトンネルする機能を可能にします。
これは、サーバーAPIが複数のHTTP動詞（`GET`、`PUT`、`POST`、`DELETE`など）を処理するものの、特定の制限によりクライアントが限られた一連の動詞（たとえば、`GET`や`POST`など）しか使用できない場合に役立ちます。
たとえば、クライアントが`X-Http-Method-Override`ヘッダーを`DELETE`に設定してリクエストを送信した場合、Ktorは、このリクエストを`delete` [ルートハンドラー](server-routing.md#define_route)を使用して処理します。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% の設定 {id="configure"}

デフォルトでは、`%plugin_name%` は`X-Http-Method-Override` ヘッダーをチェックして、リクエストを処理すべきルートを決定します。
`headerName` プロパティを使用して、ヘッダー名をカスタマイズできます。

## 例 {id="example"}

以下のHTTPリクエストは`POST`動詞を使用し、`X-Http-Method-Override`ヘッダーが`DELETE`に設定されています:

```http request
```
{src="snippets/json-kotlinx-method-override/post.http"}

このようなリクエストを`delete` [ルートハンドラー](server-routing.md#define_route)を使用して処理するには、`%plugin_name%` をインストールする必要があります:

```kotlin
```
{src="snippets/json-kotlinx-method-override/src/main/kotlin/com/example/Application.kt"}

完全な例はこちらで見つけることができます: [json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。