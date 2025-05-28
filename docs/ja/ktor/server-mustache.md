[//]: # (title: マスタッシュ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorでは、[Mustacheテンプレート](https://github.com/spullara/mustache.java) をアプリケーション内でビューとして使用するために、[Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) プラグインをインストールできます。

## 依存関係を追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Mustacheをインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install`ブロック内で、Mustacheテンプレートをロードするための[MustacheFactory][mustache_factory]を[設定](#template_loading)できます。

## Mustacheを設定 {id="configure"}
### テンプレートのロードを設定 {id="template_loading"}
テンプレートをロードするには、`mustacheFactory`プロパティに[MustacheFactory][mustache_factory]を割り当てる必要があります。例えば、以下のコードスニペットは、Ktorが現在のクラスパスに対する`templates`パッケージ内のテンプレートを探すことを可能にします。
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="3-6,11-15,22"}

### テンプレートをレスポンスとして送信 {id="use_template"}
`resources/templates`に`index.hbs`テンプレートがあるとします。
```html
```
{src="snippets/mustache/src/main/resources/templates/index.hbs"}

ユーザーのデータモデルは次のようになります。
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="24"}

指定された[ルート](server-routing.md)でテンプレートを使用するには、`MustacheContent`を`call.respond`メソッドに次のように渡します。
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="17-20"}