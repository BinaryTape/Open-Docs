[//]: # (title: AutoHeadResponse)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% は、GET が定義されているすべてのルートに対して HEAD リクエストに自動的に応答する機能を提供します。
</link-summary>

The [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) プラグインは、`GET` が定義されているすべてのルートに対して `HEAD` リクエストに自動的に応答する機能を提供します。実際のコンテンツを取得する前にクライアント側で応答を何らかの形で処理する必要がある場合、別の [head](server-routing.md#define_route) ハンドラーを作成する手間を省くために、%plugin_name% を使用できます。例えば、[respondFile](server-responses.md#file) 関数を呼び出すと、応答に `Content-Length` および `Content-Type` ヘッダーが自動的に追加され、ファイルをダウンロードする前に、クライアント側でこの情報を取得できます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 使用方法
この機能を利用するには、アプリケーションに `AutoHeadResponse` プラグインをインストールする必要があります。

```kotlin
```
{src="snippets/autohead/src/main/kotlin/com/example/Application.kt" include-lines="3-15"}

この例では、`/home` ルートは、この動詞に対する明示的な定義がないにもかかわらず、`HEAD` リクエストに応答するようになります。

重要な点として、このプラグインを使用している場合、同じ `GET` ルートに対するカスタム `HEAD` 定義は無視されます。

## オプション
%plugin_name% は、追加の設定オプションを提供しません。