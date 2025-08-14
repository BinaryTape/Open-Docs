[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在不需額外執行時或虛擬機器下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

HTML DSL 將 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 函式庫整合到 Ktor 中，並允許您使用 HTML 區塊回應用戶端。透過 HTML DSL，您可以用 Kotlin 撰寫純粹的 HTML，將變數插入視圖中，甚至可以使用範本建立複雜的 HTML 版面配置。

## 新增依賴項 {id="add_dependencies"}
HTML DSL 不需要 [安裝](server-plugins.md#install)，但需要 `%artifact_name%` 構件。您可以按以下方式將其包含在建置腳本中：

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  

## 在回應中傳送 HTML {id="html_response"}
若要傳送 HTML 回應，請在所需的 [路由](server-routing.md) 內呼叫 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 方法。
以下範例展示了一個 HTML DSL 範例以及將傳送給用戶端的對應 HTML：

<tabs>
<tab title="Kotlin">

[object Promise]

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

以下 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl) 展示了如何使用 HTML 表單回應，該表單用於從用戶收集 [憑證資訊](server-form-based-auth.md)：

<tabs>
<tab title="Kotlin">

[object Promise]

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

您可以從 [](server-requests.md#form_parameters) 學習如何在伺服器端接收表單參數。

> 若要深入了解如何使用 kotlinx.html 產生 HTML，請參閱 [kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)。

## 範本 {id="templates"}

除了產生純 HTML 之外，Ktor 還提供一個範本引擎，可用於建構複雜的版面配置。您可以為 HTML 頁面的不同部分建立範本階層，例如，整個頁面的根範本、頁首和頁尾的子範本等等。Ktor 提供了以下用於處理範本的 API：

1. 若要回應基於指定範本建構的 HTML，請呼叫 [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 方法。
2. 若要建立範本，您需要實作 [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 介面並覆寫提供 HTML 的 `Template.apply` 方法。
3. 在建立的範本類別中，您可以為不同的內容類型定義佔位符：
    * [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html) 用於插入內容。[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html) 可用於插入多次出現的內容 (例如，列表項目)。
    * [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html) 可用於插入子範本並建立巢狀版面配置。
    

### 範例 {id="example"}
讓我們看看如何使用範本建立階層式版面配置的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。想像我們有以下 HTML：
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
我們可以將此頁面的版面配置分成兩部分：
* 用於頁首的根版面配置範本以及用於文章的子範本。
* 用於文章內容的子範本。

讓我們逐步實作這些版面配置：
  
1. 呼叫 `respondHtmlTemplate` 方法並傳遞一個範本類別作為參數。在我們的例子中，這是應該實作 `Template` 介面的 `LayoutTemplate` 類別：
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           // ...
       }
   }
   ```
   在區塊內部，我們將能夠存取範本並指定其屬性值。這些值將替換範本類別中指定的佔位符。我們將在下一步中建立 `LayoutTemplate` 並定義其屬性。
  
2. 根版面配置範本將如下所示：
   [object Promise]

   該類別公開了兩個屬性：
   * `header` 屬性指定內容，插入到 `h1` 標籤內。
   * `content` 屬性指定一個子範本，用於文章內容。

3. 子範本將如下所示：
   [object Promise]

   此範本公開了 `articleTitle`、`articleText` 和 `list` 屬性，其值將插入到 `article` 內部。

4. 若要將值列表作為範本提供，請建立以下新類別： 
   [object Promise]

   此範本使用 `PlaceholderList` 類別從提供的項目生成無序列表 (`UL`)。
   它也將第一個項目包裹在 `<b>` 元素中以示強調。

5. 現在我們準備好傳送 HTML，使用指定的屬性值建構的 HTML：
   [object Promise]

您可以在這裡找到完整的範例：[html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。