[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>必備依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="模組允許您透過將路由分組來建構應用程式。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

Ktor 允許您透過安裝 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 外掛程式，在應用程式中將 [Velocity 範本](https://velocity.apache.org/engine/) 作為視圖使用。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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

## 安裝 Velocity {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，請在指定的 <Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來建構應用程式。">模組</Links> 中將其傳遞給 <code>install</code> 函數。以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的一個擴展函數。
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

您可以選擇安裝 `VelocityTools` 外掛程式，以便能夠新增標準和自訂的 [Velocity 工具](#velocity_tools)。

## 配置 Velocity {id="configure"}
### 配置範本載入 {id="template_loading"}
在 `install` 區塊內部，您可以配置 [VelocityEngine][velocity_engine]。例如，如果您想使用來自 classpath 的範本，請為 `classpath` 使用資源載入器：
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

### 在回應中傳送範本 {id="use_template"}
假設您在 `resources/templates` 中有一個 `index.vl` 範本：
```html
<html>
    <body>
        <h1>Hello, $user.name</h1>
    </body>
</html>
```

用戶的資料模型如下所示：
```kotlin
data class User(val id: Int, val name: String)
```

若要將範本用於指定的 [路由](server-routing.md)，請透過以下方式將 `VelocityContent` 傳遞給 `call.respond` 方法：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(VelocityContent("templates/index.vl", mapOf("user" to sampleUser)))
}
```

### 新增 Velocity 工具 {id="velocity_tools"}

如果您已經[安裝](#install_plugin)了 `VelocityTools` 外掛程式，您可以在 `install` 區塊內存取 `EasyFactoryConfiguration` 實例，以新增標準和自訂的 Velocity 工具，例如：

```kotlin
install(VelocityTools) {
    engine {
        // Engine configuration
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // Add a default tool
    tool("foo", MyCustomTool::class.java) // Add a custom tool
}