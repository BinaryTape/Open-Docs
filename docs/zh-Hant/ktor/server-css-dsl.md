[//]: # (title: CSS DSL)

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

CSS DSL 擴展了 [HTML DSL](server-html-dsl.md)，允許您使用 [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 包裝器在 Kotlin 中編寫樣式表。

> 了解如何從 [](server-static-content.md) 提供樣式表作為靜態內容。

## 新增依賴項 {id="add_dependencies"}
CSS DSL 無需[安裝](server-plugins.md#install)，但需要在建置腳本中包含以下構件：

1. `ktor-server-html-builder` 構件用於 HTML DSL：

   <var name="artifact_name" value="ktor-server-html-builder"/>
   
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
    
   
2. `kotlin-css-jvm` 構件用於建構 CSS：

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   
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
    
   
   您可以將 `$kotlin_css_version` 取代為 `kotlin-css` 構件的所需版本，例如 `%kotlin_css_version%`。

## 提供 CSS {id="serve_css"}

若要傳送 CSS 回應，您需要擴展 `ApplicationCall`，透過新增 `respondCss` 方法將樣式表序列化為字串，並以 `CSS` 內容類型傳送給用戶端：

[object Promise]

然後，您可以在所需的 [route](server-routing.md) 內提供 CSS：

[object Promise]

最後，您可以將指定的 CSS 用於使用 [HTML DSL](server-html-dsl.md) 建立的 HTML 文件：

[object Promise]

您可以在這裡找到完整的範例：[css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。