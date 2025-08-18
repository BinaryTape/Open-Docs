[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links> 支持</b>: ✖️
</p>
</tldr>

Ktor 允许您通过安装 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 插件，在应用程序中使用 [Velocity 模板](https://velocity.apache.org/engine/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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

## 安装 Velocity {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
    请将其传递给指定 <Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织您的应用程序。">模块</Links> 中的 <code>install</code> 函数。
    以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的模块（它是 <code>Application</code> 类的扩展函数）内部。
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

可选地，您可以安装 `VelocityTools` 插件，以便能够添加标准和自定义的 [Velocity 工具](#velocity_tools)。

## 配置 Velocity {id="configure"}
### 配置模板加载 {id="template_loading"}
在 `install` 代码块内部，您可以配置 [VelocityEngine][velocity_engine]。例如，如果您想使用 classpath 中的模板，请为 classpath 使用资源加载器：
```kotlin
import io.ktor.server.application.*
import io.ktor.server.velocity.*
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader
import org.apache.velocity.runtime.RuntimeConstants

fun Application.module() {
    install(Velocity) {
        setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath")
        setProperty("classpath.resource.loader.class", ClasspathResourceLoader::class.java.name)
    }
}
```

### 在响应中发送模板 {id="use_template"}
假设您在 `resources/templates` 中有 `index.vl` 模板：
```html
<html>
    <body>
        <h1>Hello, $user.name</h1>
    </body>
</html>
```

用户的数据模型如下所示：
```kotlin
data class User(val id: Int, val name: String)
```

要将该模板用于指定的 [route](server-routing.md)，请按如下方式将 `VelocityContent` 传递给 `call.respond` 方法：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(VelocityContent("templates/index.vl", mapOf("user" to sampleUser)))
}
```

### 添加 Velocity 工具 {id="velocity_tools"}

如果您已经[安装](#install_plugin)了 `VelocityTools` 插件，您可以在 `install` 代码块内部访问 `EasyFactoryConfiguration` 实例，以便添加标准和自定义的 Velocity 工具，例如：

```kotlin
install(VelocityTools) {
    engine {
        // 引擎配置
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // 添加一个默认工具
    tool("foo", MyCustomTool::class.java) // 添加一个自定义工具
}