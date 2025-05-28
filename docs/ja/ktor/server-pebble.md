[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorでは、[Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble)プラグインをインストールすることで、アプリケーション内で[Pebbleテンプレート](https://pebbletemplates.io/)をビューとして使用できます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Pebbleのインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install`ブロック内で、Pebbleテンプレートをロードするための[PebbleEngine.Builder][pebble_engine_builder]を[設定](#configure)できます。

## Pebbleの設定 {id="configure"}
### テンプレートのロード設定 {id="template_loading"}
テンプレートをロードするには、[PebbleEngine.Builder][pebble_engine_builder]を使用してテンプレートのロード方法を設定する必要があります。例えば、以下のコードスニペットは、Ktorが現在のクラスパスに対する`templates`パッケージ内でテンプレートを探すように設定します。

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-16,23"}

### レスポンスでテンプレートを送信 {id="use_template"}
`resources/templates`に`index.html`テンプレートがあると想像してください。

```html
```
{src="snippets/pebble/src/main/resources/templates/index.html"}

ユーザーのデータモデルは以下のようになります。

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="25"}

指定された[ルート](server-routing.md)でテンプレートを使用するには、`PebbleContent`を`call.respond`メソッドに次のように渡します。

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}