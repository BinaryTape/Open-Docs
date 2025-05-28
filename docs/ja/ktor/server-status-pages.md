[//]: # (title: ステータスページ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% は、Ktorアプリケーションがスローされた例外またはステータスコードに基づいて、あらゆる失敗状態に適切に応答できるようにします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) プラグインを使用すると、Ktorアプリケーションはスローされた例外またはステータスコードに基づいて、あらゆる失敗状態に適切に[応答](server-responses.md)できます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% の設定 {id="configure"}

`%plugin_name%` プラグインには、主に3つの設定オプションが用意されています。

- [exceptions](#exceptions): マッピングされた例外クラスに基づいて応答を設定します
- [status](#status): ステータスコードの値に応答を設定します
- [statusFile](#status-file): クラスパスからのファイル応答を設定します

### 例外 {id="exceptions"}

`exception` ハンドラを使用すると、`Throwable` 例外が発生した呼び出しを処理できます。最も基本的なケースでは、任意の例外に対して `500` HTTPステータスコードを設定できます。

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

特定の例外をチェックして、必要なコンテンツで応答することもできます。

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12-19,24"}

### ステータス {id="status"}

`status` ハンドラは、ステータスコードに基づいて特定のコンテンツで応答する機能を提供します。以下の例は、サーバーでリソースが見つからない場合（`404` ステータスコード）にリクエストに応答する方法を示しています。

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,20-22,24"}

### ステータスファイル {id="status-file"}

`statusFile` ハンドラを使用すると、ステータスコードに基づいてHTMLページを提供できます。プロジェクトに `resources` フォルダに `error401.html` と `error402.html` のHTMLページが含まれているとします。この場合、次のように `statusFile` を使用して `401` および `402` ステータスコードを処理できます。
```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,23-24"}

`statusFile` ハンドラは、設定されたステータスのリスト内で、`#` 文字をステータスコードの値に置き換えます。

> 完全な例は、こちらで見つけることができます: [status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。