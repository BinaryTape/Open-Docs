[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行時或虛擬機器下運行伺服器。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

Ktor 透過安裝 [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html) 外掛，讓您可以在應用程式中使用 [JTE 模板](https://github.com/casid/jte) 作為視圖。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建構腳本中包含 <code>%artifact_name%</code> 構件：
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

> 若要處理 <code>.kte</code> 檔案，您需要將 <code>gg.jte:jte-kotlin</code> 構件新增到您的專案。

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛 <a href="#install">安裝</a> 到應用程式，
    請將其傳遞給指定 <Links href="/ktor/server-modules" summary="模組可讓您透過群組化路由來建構您的應用程式。">模組</Links> 中的 <code>install</code> 函數。
    以下程式碼片段顯示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類的擴展函數。
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

在 <code>install</code> 區塊內部，您可以[配置](#configure)如何載入 JTE 模板。

## 配置 %plugin_name% {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入 JTE 模板，您需要：
1. 建立一個用於解析模板程式碼的 <code>CodeResolver</code>。例如，您可以配置 <code>DirectoryCodeResolver</code> 從給定目錄載入模板，或配置 <code>ResourceCodeResolver</code> 從應用程式資源載入模板。
2. 使用 <code>templateEngine</code> 屬性指定一個模板引擎，該引擎使用已建立的 <code>CodeResolver</code> 將模板轉換為原生的 Java/Kotlin 程式碼。

例如，以下程式碼片段使 Ktor 能夠在 <code>templates</code> 目錄中查找 JTE 模板：

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

### 在回應中傳送模板 {id="use_template"}
假設您在 <code>templates</code> 目錄中有名為 <code>index.kte</code> 的模板：
```html
@param id: Int
@param name: String
<html>
    <body>
        <h1>Hello, ${name}!</h1>
    </body>
</html>
```

若要將該模板用於指定的[路由](server-routing.md)，請以以下方式將 <code>JteContent</code> 傳遞給 <code>call.respond</code> 方法：
```kotlin
get("/index") {
    val params = mapOf("id" to 1, "name" to "John")
    call.respond(JteContent("index.kte", params))
}
```