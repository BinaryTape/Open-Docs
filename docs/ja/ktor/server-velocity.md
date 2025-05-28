[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor では、[Velocity テンプレート](https://velocity.apache.org/engine/)をアプリケーション内のビューとして使用するために、[Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) プラグインをインストールできます。

## 依存関係を追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Velocity をインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

オプションとして、標準およびカスタムの [Velocity ツール](#velocity_tools) を追加する機能を持つ `VelocityTools` プラグインをインストールできます。

## Velocity を設定 {id="configure"}
### テンプレートの読み込みを設定 {id="template_loading"}
`install` ブロック内で、[VelocityEngine][velocity_engine] を設定できます。例えば、クラスパスからテンプレートを使用したい場合は、`classpath` のリソースローダーを使用します。
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="3-4,7-9,12-16,23"}

### レスポンスでテンプレートを送信 {id="use_template"}
`resources/templates` に `index.vl` テンプレートがあると想像してください。
```html
```
{src="snippets/velocity/src/main/resources/templates/index.vl"}

ユーザーのデータモデルは次のようになります。
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="25"}

指定された [ルート](server-routing.md) でテンプレートを使用するには、`VelocityContent` を `call.respond` メソッドに次のように渡します。
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}

### Velocity ツールを追加 {id="velocity_tools"}

`VelocityTools` プラグインを [インストール](#install_plugin) した場合、`install` ブロック内で `EasyFactoryConfiguration` インスタンスにアクセスして、標準およびカスタムの Velocity ツールを追加できます。例えば次のようになります。

```kotlin
install(VelocityTools) {
    engine {
        // エンジンの設定
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // デフォルトツールを追加
    tool("foo", MyCustomTool::class.java) // カスタムツールを追加
}