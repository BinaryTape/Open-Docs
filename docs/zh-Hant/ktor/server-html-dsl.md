[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

HTML DSL 將 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 函式庫整合到 Ktor 中，讓您可以以 HTML 區塊回應客戶端。透過 HTML DSL，您可以用 Kotlin 編寫純 HTML、將變數插入到視圖中，甚至可以使用模板 (templates) 建構複雜的 HTML 版面配置。

## 新增依賴 {id="add_dependencies"}
HTML DSL 不需要[安裝](server-plugins.md#install)，但需要 `%artifact_name%` 構件。您可以將其包含在建構腳本中，如下所示：

<include from="lib.topic" element-id="add_ktor_artifact"/>
  

## 在回應中傳送 HTML {id="html_response"}
若要傳送 HTML 回應，請在所需的[路由](server-routing.md)內呼叫 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 方法。
以下範例展示了一個 HTML DSL 範例及其將傳送給客戶端的對應 HTML：

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

以下[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)展示了如何使用 HTML 表單回應，該表單用於從使用者收集[憑證資訊](server-form-based-auth.md)：

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

您可以從 [](server-requests.md#form_parameters) 了解如何在伺服器端接收表單參數。

> 若要了解更多關於使用 kotlinx.html 生成 HTML 的資訊，請參閱 [kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)。

## 模板 {id="templates"}

除了生成純 HTML 之外，Ktor 還提供了一個模板引擎，可用於建構複雜的版面配置。您可以為 HTML 頁面的不同部分建立模板階層，例如，整個頁面的根模板、頁首和頁尾的子模板等等。Ktor 提供了以下 API 用於處理模板：

1.  要根據指定模板建構的 HTML 作為回應，請呼叫 [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 方法。
2.  若要建立模板，您需要實作 [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 介面並覆寫 `Template.apply` 方法以提供 HTML。
3.  在建立的模板類別中，您可以為不同的內容類型定義佔位符：
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html) 用於插入內容。 [PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html) 可用於插入多次出現的內容（例如，列表項目）。
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html) 可用於插入子模板並建立巢狀版面配置。
    

### 範例 {id="example"}
讓我們透過[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)來看看如何使用模板建立階層式版面配置。假設我們有以下 HTML：
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
我們可以將此頁面的版面配置分為兩部分：
*   用於頁首的根版面配置模板和用於文章的子模板。
*   用於文章內容的子模板。

讓我們逐步實作這些版面配置：
  
1.  呼叫 `respondHtmlTemplate` 方法並將模板類別作為參數傳遞。在我們的範例中，這是應該實作 `Template` 介面的 `LayoutTemplate` 類別：
    ```kotlin
    get("/") {
        call.respondHtmlTemplate(LayoutTemplate()) {
            // ...
        }
    }
    ```
    在此區塊內，我們將能夠存取模板並指定其屬性值。這些值將替換模板類別中指定的佔位符。我們將在下一步建立 `LayoutTemplate` 並定義其屬性。
  
2.  根版面配置模板將如下所示：
    ```kotlin
    ```
    {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="34-45"}

    此類別暴露兩個屬性：
    *   `header` 屬性指定插入 `h1` 標籤內的內容。
    *   `content` 屬性指定文章內容的子模板。

3.  子模板將如下所示：
    ```kotlin
    ```
    {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="47-62"}

    此模板暴露 `articleTitle`、`articleText` 和 `list` 屬性，其值將被插入到 `article` 內。

4.  若要提供一個值列表作為模板，請建立以下新類別：
    ```kotlin
    ```
    {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="64-83"}

    此模板使用 `PlaceholderList` 類別從提供的項目生成無序列表 (`UL`)。
    它還將第一個項目包裝在 `<b>` 元素中以強調。

5.  現在我們已準備好傳送使用指定屬性值建構的 HTML：
    ```kotlin
    ```
    {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="12-30"}

您可以在此處找到完整範例：[html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。