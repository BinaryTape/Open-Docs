[//]: # (title: CSS DSL)

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

CSS DSL 扩展了 [HTML DSL](server-html-dsl.md)，允许你使用 [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 包装器在 Kotlin 中编写样式表。

> 关于如何将样式表作为静态内容提供服务，请参阅 [](server-static-content.md)。

## 添加依赖项 {id="add_dependencies"}
CSS DSL 无需[安装](server-plugins.md#install)，但需要在构建脚本中包含以下 artifact：

1. 用于 HTML DSL 的 `ktor-server-html-builder` artifact：

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
    
   
2. 用于构建 CSS 的 `kotlin-css-jvm` artifact：

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
    
   
   你可以将 `$kotlin_css_version` 替换为 `kotlin-css` artifact 所需的版本，例如 `%kotlin_css_version%`。

## 提供 CSS 服务 {id="serve_css"}

要发送 CSS 响应，你需要扩展 `ApplicationCall`，通过添加 `respondCss` 方法将样式表序列化为字符串，并以 `CSS` 内容类型将其发送给客户端：

[object Promise]

然后，你可以在所需的 [路由](server-routing.md) 中提供 CSS：

[object Promise]

最后，你可以将指定的 CSS 用于使用 [HTML DSL](server-html-dsl.md) 创建的 HTML 文档：

[object Promise]

你可以在此处找到完整示例：[css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。