[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行時間或虛擬機器即可執行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

Ktor 允許您透過安裝 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 外掛程式，在應用程式中使用 [FreeMarker 範本](https://freemarker.apache.org/) 作為視圖。

## 新增依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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

## 安裝 FreeMarker {id="install_plugin"}

<p>
    要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
    請在指定的<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函式。
    下面的程式碼片段演示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函式呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函式。
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

在 `install` 區塊內部，您可以[配置](#configure)所需的 [TemplateLoader][freemarker_template_loading] 以載入 FreeMarker 範本。

## 配置 FreeMarker {id="configure"}
### 配置範本載入 {id="template_loading"}
要載入範本，您需要將所需的 [TemplateLoader][freemarker_template_loading] 類型指派給 `templateLoader` 屬性。例如，下面的程式碼片段啟用 Ktor 在相對於當前類別路徑的 `templates` 套件中查找範本：
```kotlin
import freemarker.cache.*
import io.ktor.server.application.*
import io.ktor.server.freemarker.*

fun Application.module() {
    install(FreeMarker) {
        templateLoader = ClassTemplateLoader(this::class.java.classLoader, "templates")
    }
}
```

### 在回應中傳送範本 {id="use_template"}
想像您在 `resources/templates` 中有一個 `index.ftl` 範本：
```html
<html>
    <body>
        <h1>Hello, ${user.name}!</h1>
    </body>
</html>
```

使用者的資料模型如下所示：
```kotlin
data class User(val id: Int, val name: String)
```

要將範本用於指定的 [route](server-routing.md)，請透過以下方式將 `FreeMarkerContent` 傳遞給 `call.respond` 方法：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(FreeMarkerContent("index.ftl", mapOf("user" to sampleUser)))
}