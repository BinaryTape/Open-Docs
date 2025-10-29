[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

Ktor 允许你通过安装 [%plugin_name%](https://api.ktor.io/ktor-server-jte/io.ktor.server.jte/-jte.html) 插件，在应用程序中使用 [JTE 模板](https://github.com/casid/jte) 作为视图。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
</p>
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

> 要处理 `.kte` 文件，你需要将 `gg.jte:jte-kotlin` artifact 添加到你的项目中。

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
    请将其传递给指定 <Links href="/ktor/server-modules" summary="模块允许你通过分组路由来组织应用程序。">模块</Links> 中的 <code>install</code> 函数。
    下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，它是一个 <code>Application</code> 类的扩展函数。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

在 `install` 代码块内部，你可以[配置](#configure)如何加载 JTE 模板。

## 配置 %plugin_name% {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载 JTE 模板，你需要：
1. 创建一个 `CodeResolver` 用于解析模板代码。例如，你可以配置 `DirectoryCodeResolver` 从给定目录加载模板，或者配置 `ResourceCodeResolver` 从应用程序资源加载模板。
2. 使用 `templateEngine` 属性指定模板引擎，它使用已创建的 `CodeResolver` 将模板转换为原生 Java/Kotlin 代码。

例如，下面的代码片段使 Ktor 能够在 `templates` 目录中查找 JTE 模板：

```kotlin
import gg.jte.TemplateEngine
import gg.jte.resolve.DirectoryCodeResolver
import io.ktor.server.application.*
import io.ktor.server.jte.*
import java.nio.file.Path

fun Application.module() {
    install(Jte) {
        val resolver = DirectoryCodeResolver(Path.of("templates"))
        templateEngine = TemplateEngine.create(resolver, gg.jte.ContentType.Html)
    }
}
```

### 在响应中发送模板 {id="use_template"}
假设你在 `templates` 目录中有 `index.kte` 模板：
```html
@param id: Int
@param name: String
<html>
    <body>
        <h1>Hello, ${name}!</h1>
    </body>
</html>
```

要将模板用于指定的 [路由](server-routing.md)，请按照以下方式将 `JteContent` 传递给 `call.respond` 方法：
```kotlin
get("/index") {
    val params = mapOf("id" to 1, "name" to "John")
    call.respond(JteContent("index.kte", params))
}