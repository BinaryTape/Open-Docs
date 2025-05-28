[//]: # (title: 部分コンテンツ)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>サーバーの例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>クライアントの例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html)プラグインは、クライアントにHTTPメッセージの一部のみを送信するために使用される[HTTPレンジリクエスト](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)の処理をサポートします。このプラグインは、コンテンツのストリーミングや部分的なダウンロードの再開に役立ちます。

`%plugin_name%`には以下の制限事項があります:
- `HEAD`および`GET`リクエストでのみ機能し、クライアントが他のメソッドで`Range`ヘッダーを使用しようとした場合、`405 Method Not Allowed`を返します。
- `Content-Length`ヘッダーが定義されているレスポンスでのみ機能します。
- レンジを配信する場合、[圧縮](server-compression.md)を無効にします。

## 依存関係を追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%をインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

`%plugin_name%`を使用してHTTPレンジリクエストでファイルを配信する方法については、[](server-responses.md#file)セクションを参照してください。