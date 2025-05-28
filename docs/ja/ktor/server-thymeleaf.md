[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor では、[Thymeleaf テンプレート](https://www.thymeleaf.org/)をアプリケーション内でビューとして利用するために、[Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) プラグインをインストールできます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Thymeleaf のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## Thymeleaf の設定 {id="configure"}
### テンプレートの読み込み設定 {id="template_loading"}
`install` ブロック内で、`ClassLoaderTemplateResolver` を設定できます。例えば、以下のコードスニペットは、Ktor が現在のクラスパスを基準として `templates` パッケージ内の `*.html` テンプレートを検索できるようにします:
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="3,6-8,11-18,25"}

### テンプレートをレスポンスで送信 {id="use_template"}
`resources/templates` に `index.html` テンプレートがあるとします:
```html
```
{src="snippets/thymeleaf/src/main/resources/templates/index.html"}

ユーザーのデータモデルは次のようになります:
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="27"}

指定された [route](server-routing.md) にテンプレートを使用するには、[ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) を `call.respond` メソッドに次のように渡します:
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="20-23"}

## 例: Thymeleaf テンプレートの自動リロード {id="auto-reload"}

以下の例は、[開発モード](server-development-mode.topic)が使用されたときに Thymeleaf テンプレートを自動的にリロードする方法を示しています。

```kotlin
```
{src="snippets/thymeleaf-auto-reload/src/main/kotlin/com/example/Application.kt"}

完全な例はこちらで見つけることができます: [thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。