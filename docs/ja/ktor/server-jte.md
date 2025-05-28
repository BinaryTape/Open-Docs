[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktorでは、[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html)プラグインをインストールすることで、アプリケーション内で[JTEテンプレート](https://github.com/casid/jte)をビューとして使用できます。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> `.kte`ファイルを扱うには、`gg.jte:jte-kotlin`アーティファクトをプロジェクトに追加する必要があります。

## %plugin_name%をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install`ブロック内で、JTEテンプレートの読み込み方法を[設定](#configure)できます。

## %plugin_name%を設定する {id="configure"}
### テンプレートの読み込みを設定する {id="template_loading"}
JTEテンプレートを読み込むには、以下の手順が必要です。
1.  テンプレートコードを解決するために使用する`CodeResolver`を作成します。たとえば、指定されたディレクトリからテンプレートを読み込むように`DirectoryCodeResolver`を設定したり、アプリケーションリソースからテンプレートを読み込むように`ResourceCodeResolver`を設定したりできます。
2.  `templateEngine`プロパティを使用してテンプレートエンジンを指定します。これは、作成された`CodeResolver`を使用してテンプレートをネイティブのJava/Kotlinコードに変換します。

たとえば、以下のコードスニペットは、Ktorが`templates`ディレクトリ内でJTEテンプレートを検索できるようにします。

```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-10,13-17,24"}

### レスポンスでテンプレートを送信する {id="use_template"}
`templates`ディレクトリに`index.kte`テンプレートがあるとします。
```html
```
{src="snippets/jte/templates/index.kte"}

指定された[ルート](server-routing.md)でテンプレートを使用するには、以下のように`JteContent`を`call.respond`メソッドに渡します。
```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="19-22"}