[//]: # (title: CSS DSL)

<tldr>
<p>
<b>必要的依賴</b>：<code>io.ktor:ktor-server-html-builder</code>、<code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

CSS DSL 擴展了 [HTML DSL](server-html-dsl.md)，允許您透過使用 [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 封裝器，在 Kotlin 中編寫樣式表。

> 了解如何從 [](server-static-content.md) 提供靜態內容形式的樣式表。

## 加入依賴項 {id="add_dependencies"}
CSS DSL 不需要[安裝](server-plugins.md#install)，但需要在建置腳本中包含以下構件：

1. 用於 HTML DSL 的 `ktor-server-html-builder` 構件：

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <include from="lib.topic" element-id="add_ktor_artifact"/>
   
2. 用於建置 CSS 的 `kotlin-css-jvm` 構件：

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <include from="lib.topic" element-id="add_artifact"/>
   
   您可以將 `$kotlin_css_version` 替換為 `kotlin-css` 構件的所需版本，例如 `%kotlin_css_version%`。

## 提供 CSS {id="serve_css"}

要傳送 CSS 回應，您需要透過加入 `respondCss` 方法來擴展 `ApplicationCall`，以便將樣式表序列化為字串，並以 `CSS` 內容類型傳送給客戶端：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="39-41"}

然後，您可以在所需的 [路由](server-routing.md) 內提供 CSS：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="25-35"}

最後，您可以將指定的 CSS 用於使用 [HTML DSL](server-html-dsl.md) 建立的 HTML 文件：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

您可以在此找到完整範例：[css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。