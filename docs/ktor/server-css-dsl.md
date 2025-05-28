[//]: # (title: CSS DSL)

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

CSS DSL 扩展了 [HTML DSL](server-html-dsl.md)，并允许你使用 [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 包装器在 Kotlin 中编写样式表。

> 了解如何从 [](server-static-content.md) 作为静态内容提供样式表。

## 添加依赖项 {id="add_dependencies"}
CSS DSL 不需要[安装](server-plugins.md#install)，但需要在构建脚本中包含以下工件：

1. 用于 HTML DSL 的 `ktor-server-html-builder` 工件：

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <include from="lib.topic" element-id="add_ktor_artifact"/>

2. 用于构建 CSS 的 `kotlin-css-jvm` 工件：

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <include from="lib.topic" element-id="add_artifact"/>

   你可以将 `$kotlin_css_version` 替换为 `kotlin-css` 工件所需的版本，例如 `%kotlin_css_version%`。

## 提供 CSS {id="serve_css"}

要发送 CSS 响应，你需要通过添加 `respondCss` 方法来扩展 `ApplicationCall`，以便将样式表序列化为字符串，并以 `CSS` 内容类型将其发送给客户端：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="39-41"}

然后，你可以在所需的[路由](server-routing.md)中提供 CSS：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="25-35"}

最后，你可以将指定的 CSS 用于使用 [HTML DSL](server-html-dsl.md) 创建的 HTML 文档：

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

你可以在这里找到完整的示例：[css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。