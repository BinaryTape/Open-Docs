[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="模組允許您透過分組路由來組織應用程式。">原生伺服器</Links> 支援</b>: ✖️
</p>
</tldr>

Ktor 允許您透過安裝 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 插件，將 [Pebble 模板](https://pebbletemplates.io/) 作為您應用程式中的視圖使用。

## 加入依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> 構件包含在建置腳本中：
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

## 安裝 Pebble {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>至應用程式，
    請在指定的 <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links> 中將其傳遞給 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ...在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ...在明確定義的 <code>module</code> 內部，此為 <code>Application</code> 類別的擴展函數。
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

在 `install` 區塊內部，您可以[配置](#configure) [PebbleEngine.Builder][pebble_engine_builder] 以用於載入 Pebble 模板。

## 配置 Pebble {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入模板，您需要配置如何使用 [PebbleEngine.Builder][pebble_engine_builder] 載入模板。例如，以下程式碼片段使 Ktor 能夠查找相對於當前 classpath 的 `templates` 套件中的模板：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.pebble.*
import io.ktor.server.response.*

fun Application.module() {
    install(Pebble) {
        loader(ClasspathLoader().apply {
            prefix = "templates"
        })
    }
}
```

### 在回應中傳送模板 {id="use_template"}
想像您在 `resources/templates` 中有一個 `index.html` 模板：

```html
<html>
    <body>
        <h1>Hello, {{user.name}}</h1>
    </body>
</html>
```

使用者的資料模型如下所示：

```kotlin
data class User(val id: Int, val name: String)
```

若要將模板用於指定的[路由](server-routing.md)，請以下列方式將 `PebbleContent` 傳遞給 `call.respond` 方法：

```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(PebbleContent("index.html", mapOf("user" to sampleUser)))
}
```