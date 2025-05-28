[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

HTML DSL 将 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 库集成到 Ktor 中，允许你向客户端响应 HTML 块。借助 HTML DSL，你可以使用 Kotlin 编写纯 HTML，将变量插入到视图中，甚至使用模板构建复杂的 HTML 布局。

## 添加依赖项 {id="add_dependencies"}
HTML DSL 无需[安装](server-plugins.md#install)，但需要 `%artifact_name%` 工件。你可以按如下方式将其包含在构建脚本中：

<include from="lib.topic" element-id="add_ktor_artifact"/>
  

## 发送 HTML 响应 {id="html_response"}
要发送 HTML 响应，请在所需的[路由](server-routing.md)内调用 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 方法。
下面的示例展示了 HTML DSL 示例以及将发送到客户端的相应 HTML：

<tabs>
<tab title="Kotlin">

```kotlin
```
{src="snippets/html/src/main/kotlin/com/example/Application.kt" include-lines="3-8,11-29"}

</tab>
<tab title="HTML">

```html
<html>
<head>
    <title>Ktor</title>
</head>
<body>
<h1>Hello from Ktor!</h1>
</body>
</html>
```

</tab>
</tabs>

以下[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)展示了如何响应 HTML 表单，该表单用于从用户处收集[凭据信息](server-form-based-auth.md)：

<tabs>
<tab title="Kotlin">

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="36-54"}

</tab>
<tab title="HTML">

```html
<html>
<body>
<form action="/login" enctype="application/x-www-form-urlencoded" method="post">
    <p>Username:<input type="text" name="username"></p>
    <p>Password:<input type="password" name="password"></p>
    <p><input type="submit" value="Login"></p>
</form>
</body>
</html>
```

</tab>
</tabs>

你可以从 [](server-requests.md#form_parameters) 了解如何在服务器端接收表单参数。

> 要了解更多关于使用 kotlinx.html 生成 HTML 的信息，请参阅 [kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)。

## 模板 {id="templates"}

除了生成纯 HTML 外，Ktor 还提供了一个模板引擎，可用于构建复杂的布局。你可以为 HTML 页面的不同部分创建模板层次结构，例如，用于整个页面的根模板，用于页面页眉和页脚的子模板等。Ktor 暴露了以下用于处理模板的 API：

1.  要使用指定模板构建 HTML 并进行响应，请调用 [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 方法。
2.  要创建模板，你需要实现 [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 接口并重写 `Template.apply` 方法来提供 HTML。
3.  在创建的模板类中，你可以为不同的内容类型定义占位符：
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html) 用于插入内容。[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html) 可用于插入多次出现的内容（例如，列表项）。
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html) 可用于插入子模板并创建嵌套布局。
    

### 示例 {id="example"}
让我们通过[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)了解如何使用模板创建分层布局。假设我们有以下 HTML：
```html
<body>
<h1>Ktor</h1>
<article>
    <h2>Hello from Ktor!</h2>
    <p>Kotlin Framework for creating connected systems.</p>
    <ul>
       <li><b>One</b></li>
       <li>Two</li>
    </ul>
</article>
</body>
```
我们可以将此页面的布局分为两部分：
*   页眉的根布局模板和文章的子模板。
*   文章内容的子模板。

让我们逐步实现这些布局：
  
1.  调用 `respondHtmlTemplate` 方法，并传入一个模板类作为参数。在本例中，它是应实现 `Template` 接口的 `LayoutTemplate` 类：
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           // ...
       }
   }
   ```
   在该块内部，我们将能够访问模板并指定其属性值。这些值将替换模板类中指定的占位符。我们将在下一步中创建 `LayoutTemplate` 并定义其属性。
  
2.  根布局模板将如下所示：
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="34-45"}

   该类暴露了两个属性：
   *   `header` 属性指定插入到 `h1` 标签内的内容。
   *   `content` 属性指定文章内容的子模板。

3.  子模板将如下所示：
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="47-62"}

   此模板暴露了 `articleTitle`、`articleText` 和 `list` 属性，其值将插入到 `article` 中。

4.  要将值列表作为模板提供，请创建以下新类：
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="64-83"}

   此模板使用 `PlaceholderList` 类从提供的项生成无序列表（UL）。
   它还将第一个项包装在 `<b>` 元素中以进行强调。

5.  现在，我们准备好发送使用指定属性值构建的 HTML：
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="12-30"}

你可以在此处找到完整示例：[html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。