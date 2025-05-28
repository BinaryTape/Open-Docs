[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% プラグインは、WebJars が提供するクライアントサイドライブラリの配信を可能にします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) プラグインは、[WebJars](https://www.webjars.org/) が提供するクライアントサイドライブラリの配信を可能にします。これにより、JavaScript や CSS ライブラリなどのアセットを [ファット JAR](server-fatjar.md) の一部としてパッケージ化できます。

## 依存関係の追加 {id="add_dependencies"}
`%plugin_name%` を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `%artifact_name%` 依存関係を追加します。

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 必要なクライアントサイドライブラリの依存関係を追加します。以下の例は、Bootstrap アーティファクトを追加する方法を示しています。

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  `$bootstrap_version` を `bootstrap` アーティファクトの必要なバージョン (例: `%bootstrap_version%`) に置き換えることができます。

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% の設定 {id="configure"}

デフォルトでは、`%plugin_name%` は `/webjars` パスで WebJars アセットを配信します。以下の例は、これを変更して `/assets` パスで WebJars アセットを配信する方法を示しています。

```kotlin
```
{src="snippets/webjars/src/main/kotlin/com/example/Application.kt" include-lines="3,6-7,10-13,17"}

例えば、`org.webjars:bootstrap` 依存関係をインストールしている場合、以下のように `bootstrap.css` を追加できます。

```html
```
{src="snippets/webjars/src/main/resources/files/index.html" include-lines="3,8-9"}

なお、`%plugin_name%` を使用すると、依存関係のバージョンを、それらをロードするために使用するパスを変更することなく、変更できます。

> 完全な例はこちらで見つけることができます: [webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。