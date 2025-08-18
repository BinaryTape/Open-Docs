[//]: # (title: CSS DSL)

<tldr>
<p>
<b>必要的依賴項</b>：<code>io.ktor:ktor-server-html-builder</code>、<code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

CSS DSL 擴展了 [HTML DSL](server-html-dsl.md)，允許您透過使用 [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 包裝器在 Kotlin 中撰寫樣式表。

> 了解如何從 [提供靜態內容](server-static-content.md) 將樣式表作為靜態內容提供。

## 添加依賴項 {id="add_dependencies"}
CSS DSL 不需要 [安裝](server-plugins.md#install)，但需要在建構腳本中包含以下構件：

1. 用於 HTML DSL 的 `ktor-server-html-builder` 構件：

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

2. 用於建構 CSS 的 `kotlin-css-jvm` 構件：

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${%version%}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

   您可以將 `$kotlin_css_version` 替換為 `kotlin-css` 構件所需的版本，例如 `%kotlin_css_version%`。

## 提供 CSS {id="serve_css"}

要發送 CSS 回應，您需要透過添加 `respondCss` 方法來擴展 `ApplicationCall`，以將樣式表序列化為字串，並以 `CSS` 內容類型將其發送給客戶端：

```kotlin
suspend inline fun ApplicationCall.respondCss(builder: CssBuilder.() -> Unit) {
    this.respondText(CssBuilder().apply(builder).toString(), ContentType.Text.CSS)
}
```

然後，您可以在所需的 [路由](server-routing.md) 內提供 CSS：

```kotlin
get("/styles.css") {
    call.respondCss {
        body {
            backgroundColor = Color.darkBlue
            margin = Margin(0.px)
        }
        rule("h1.page-title") {
            color = Color.white
        }
    }
}
```

最後，您可以使用指定的 CSS，用於使用 [HTML DSL](server-html-dsl.md) 創建的 HTML 文件：

```kotlin
get("/html-dsl") {
    call.respondHtml {
        head {
            link(rel = "stylesheet", href = "/styles.css", type = "text/css")
        }
        body {
            h1(classes = "page-title") {
                +"Hello from Ktor!"
            }
        }
    }
}
```

您可以在這裡找到完整範例：[css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。