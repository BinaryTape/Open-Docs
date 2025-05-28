[//]: # (title: CSS DSL)

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

CSS DSLは[HTML DSL](server-html-dsl.md)を拡張し、[kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md)ラッパーを使用することでKotlinでスタイルシートを記述できるようにします。

> スタイルシートを静的コンテンツとして提供する方法は、[](server-static-content.md)を参照してください。

## 依存関係を追加する {id="add_dependencies"}
CSS DSLは[インストール](server-plugins.md#install)は不要ですが、ビルドスクリプトに以下のアーティファクトを含める必要があります。

1. HTML DSL用の`ktor-server-html-builder`アーティファクト:

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <include from="lib.topic" element-id="add_ktor_artifact"/>
   
2. CSSをビルドするための`kotlin-css-jvm`アーティファクト:

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <include from="lib.topic" element-id="add_artifact"/>
   
   `$kotlin_css_version`を、例えば`%kotlin_css_version%`のように、`kotlin-css`アーティファクトの必要なバージョンに置き換えることができます。

## CSSを提供する {id="serve_css"}

CSSレスポンスを送信するには、`ApplicationCall`を拡張し、スタイルシートを文字列にシリアライズして`CSS`コンテンツタイプでクライアントに送信するための`respondCss`メソッドを追加する必要があります。

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="39-41"}

次に、必要な[ルート](server-routing.md)内でCSSを提供できます。

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="25-35"}

最後に、[HTML DSL](server-html-dsl.md)で作成されたHTMLドキュメントに、指定されたCSSを使用できます。

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

完全な例は、こちらで見つけることができます: [css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。