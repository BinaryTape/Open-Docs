[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">Native server</Links> 支援</b>: ✅
</p>
</tldr>

HTML DSL 將 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 程式庫整合到 Ktor 中，允許您使用 HTML 區塊回應客戶端。透過 HTML DSL，您可以用 Kotlin 編寫純 HTML，將變數插入視圖中，甚至使用範本建構複雜的 HTML 版面配置。

## 新增依賴項 {id="add_dependencies"}
HTML DSL 不需要 [安裝](server-plugins.md#install)，但需要 `%artifact_name%` 構件。您可以將其包含在建置指令碼中，如下所示：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>
  

## 在回應中發送 HTML {id="html_response"}
若要發送 HTML 回應，請在所需的 [路由](server-routing.md) 內呼叫 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 方法。
以下範例展示了一個範例 HTML DSL 和一個將發送給客戶端的對應 HTML：

<Tabs>
<TabItem title="Kotlin">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.html.*
import io.ktor.http.*
import io.ktor.server.routing.*
import kotlinx.html.*

fun Application.module() {
    routing {
        get("/") {
            val name = "Ktor"
            call.respondHtml(HttpStatusCode.OK) {
                head {
                    title {
                        +name
                    }
                }
                body {
                    h1 {
                        +"Hello from $name!"
                    }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="HTML">

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

</TabItem>
</Tabs>

以下 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl) 展示了如何回應一個用於從使用者收集 [憑證資訊](server-form-based-auth.md) 的 HTML 表單：

<Tabs>
<TabItem title="Kotlin">

```kotlin
get("/login") {
    call.respondHtml {
        body {
            form(action = "/login", encType = FormEncType.applicationXWwwFormUrlEncoded, method = FormMethod.post) {
                p {
                    +"Username:"
                    textInput(name = "username")
                }
                p {
                    +"Password:"
                    passwordInput(name = "password")
                }
                p {
                    submitInput() { value = "Login" }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="HTML">

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

</TabItem>
</Tabs>

您可以從 [表單參數](server-requests.md#form_parameters) 了解如何在伺服器端接收表單參數。

> 若要了解更多關於使用 kotlinx.html 生成 HTML 的資訊，請參閱 [kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)。

## 範本 {id="templates"}

除了生成純 HTML 外，Ktor 還提供了一個範本引擎，可用於建構複雜的版面配置。您可以為 HTML 頁面的不同部分建立範本的層次結構，例如，用於整個頁面的根範本，用於頁面標頭和頁尾的子範本等等。Ktor 暴露了以下用於處理範本的 API：

1. 若要回應基於指定範本建構的 HTML，請呼叫 [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 方法。
2. 若要建立範本，您需要實作 [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 介面並覆寫提供 HTML 的 `Template.apply` 方法。
3. 在建立的範本類別中，您可以定義不同內容類型的佔位符：
    * [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html) 用於插入內容。[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html) 可用於插入多次出現的內容（例如，列表項目）。
    * [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html) 可用於插入子範本並建立巢狀版面配置。
    

### 範例 {id="example"}
讓我們看看 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)，了解如何使用範本建立分層版面配置。假設我們有以下 HTML：
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
我們可以將此頁面的版面配置分成兩個部分：
* 用於頁面標頭的根版面配置範本和用於文章的子範本。
* 用於文章內容的子範本。

讓我們逐步實作這些版面配置：
  
1. 呼叫 `respondHtmlTemplate` 方法並將範本類別作為參數傳遞。在我們的案例中，這是應實作 `Template` 介面的 `LayoutTemplate` 類別：
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           // ...
       }
   }
   ```
   在此區塊內，我們將能夠存取範本並指定其屬性值。這些值將替換範本類別中指定的佔位符。我們將在下一步建立 `LayoutTemplate` 並定義其屬性。
  
2. 根版面配置範本如下所示：
   ```kotlin
   class LayoutTemplate: Template<HTML> {
       val header = Placeholder<FlowContent>()
       val content = TemplatePlaceholder<ArticleTemplate>()
       override fun HTML.apply() {
           body {
               h1 {
                   insert(header)
               }
               insert(ArticleTemplate(), content)
           }
       }
   }
   ```

   該類別暴露了兩個屬性：
   * `header` 屬性指定了插入 `h1` 標籤內的內容。
   * `content` 屬性指定了用於文章內容的子範本。

3. 子範本如下所示：
   ```kotlin
   class ArticleTemplate : Template<FlowContent> {
       val articleTitle = Placeholder<FlowContent>()
       val articleText = Placeholder<FlowContent>()
       val list = TemplatePlaceholder<ListTemplate>()
       override fun FlowContent.apply() {
           article {
               h2 {
                   insert(articleTitle)
               }
               p {
                   insert(articleText)
               }
               insert(ListTemplate(), list)
           }
       }
   }
   ```

   此範本暴露了 `articleTitle`、`articleText` 和 `list` 屬性，其值將插入 `article` 內部。

4. 若要提供範本的值列表，請建立以下新類別： 
   ```kotlin
   class ListTemplate : Template<FlowContent> {
       val item = PlaceholderList<UL, FlowContent>()
       override fun FlowContent.apply() {
           if (!item.isEmpty()) {
               ul {
                   each(item) {
                       li {
                           if (it.first) {
                               b {
                                   insert(it)
                               }
                           } else {
                               insert(it)
                           }
                       }
                   }
               }
           }
       }
   }
   ```

   此範本使用 `PlaceholderList` 類別從提供的項目生成無序列表 (`UL`)。
   它還將第一個項目包裝在 `<b>` 元素中以強調。

5. 現在我們準備好發送使用指定屬性值建構的 HTML 了：
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           header {
               +"Ktor"
           }
           content {
               articleTitle {
                   +"Hello from Ktor!"
               }
               articleText {
                   +"Kotlin Framework for creating connected systems."
               }
               list {
                   item { +"One" }
                   item { +"Two" }
               }
           }
       }
   }
   ```

您可以在此處找到完整範例：[html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。