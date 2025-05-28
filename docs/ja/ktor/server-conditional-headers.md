[//]: # (title: 条件付きヘッダー)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html)プラグインは、前回のリクエスト以降コンテンツが変更されていない場合、そのボディの送信を回避します。これは、以下のヘッダーを使用することで実現されます:
*   `Last-Modified` レスポンスヘッダーには、リソースの最終更新時刻が含まれます。例えば、クライアントのリクエストに `If-Modified-Since` の値が含まれている場合、Ktorは、指定された日付以降にリソースが変更された場合にのみ、完全なレスポンスを送信します。なお、[静的ファイル](server-static-content.md)の場合、Ktorは`ConditionalHeaders`を[インストール](#install_plugin)した後、`Last-Modified`ヘッダーを自動的に追加します。
*   `Etag` レスポンスヘッダーは、特定のリソースバージョンの識別子です。例えば、クライアントのリクエストに `If-None-Match` の値が含まれている場合、この値が`Etag`と一致すると、Ktorは完全なレスポンスを送信しません。`ConditionalHeaders` を[設定](#configure)する際に、`Etag` の値を指定できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## ヘッダーを設定する {id="configure"}

`%plugin_name%` を設定するには、`install` ブロック内で [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 関数を呼び出す必要があります。この関数は、指定された `ApplicationCall` および `OutgoingContent` のリソースバージョンのリストへのアクセスを提供します。[EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) および [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) クラスオブジェクトを使用することで、必要なバージョンを指定できます。

以下のコードスニペットは、CSSに `Etag` および `Last-Modified` ヘッダーを追加する方法を示しています:
```kotlin
```
{src="snippets/conditional-headers/src/main/kotlin/com/example/Application.kt" include-lines="16-27"}

完全な例は以下で確認できます: [conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。