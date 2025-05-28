[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorでは、[FreeMarkerプラグイン](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker)をインストールすることで、アプリケーション内で[FreeMarkerテンプレート](https://freemarker.apache.org/)をビューとして使用できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## FreeMarkerをインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install`ブロック内で、FreeMarkerテンプレートをロードするために必要な[TemplateLoader][freemarker_template_loading]を[設定](#configure)できます。

## FreeMarkerを設定する {id="configure"}
### テンプレートのロードを設定する {id="template_loading"}
テンプレートをロードするには、`templateLoader`プロパティに必要な[TemplateLoader][freemarker_template_loading]型を割り当てる必要があります。たとえば、以下のコードスニペットは、Ktorが現在のクラスパスに対する`templates`パッケージ内のテンプレートを検索できるようにします。
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-14,21"}

### レスポンスでテンプレートを送信する {id="use_template"}
`resources/templates`ディレクトリに`index.ftl`テンプレートがあるものとします。
```html
```
{src="snippets/freemarker/src/main/resources/templates/index.ftl"}

ユーザーのデータモデルは次のようになります。
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="23"}

指定された[ルート](server-routing.md)でテンプレートを使用するには、`FreeMarkerContent`を`call.respond`メソッドに次のように渡します。
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}