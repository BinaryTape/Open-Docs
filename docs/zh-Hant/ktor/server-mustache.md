[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器下運行伺服器。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

Ktor 允許您透過安裝 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 外掛程式，在應用程式中使用 [Mustache 模板](https://github.com/spullara/mustache.java) 作為視圖。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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

## 安裝 Mustache {id="install_plugin"}

<p>
    若要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來建構您的應用程式。">模組</Links>中的 <code>install</code> 函數。
    下方的程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內，這是 <code>Application</code> 類別的擴充函數。
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

在 <code>install</code> 區塊內，您可以[配置](#template_loading) [MustacheFactory][mustache_factory] 以載入 Mustache 模板。

## 配置 Mustache {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入模板，您需要將 [MustacheFactory][mustache_factory] 指派給 <code>mustacheFactory</code> 屬性。例如，下方的程式碼片段讓 Ktor 能夠在相對於當前類別路徑的 <code>templates</code> 套件中查找模板：
```kotlin
import com.github.mustachejava.DefaultMustacheFactory
import io.ktor.server.application.*
import io.ktor.server.mustache.Mustache
import io.ktor.server.mustache.MustacheContent

fun Application.module() {
    install(Mustache) {
        mustacheFactory = DefaultMustacheFactory("templates")
    }
}
```

### 在回應中傳送模板 {id="use_template"}
假設您在 <code>resources/templates</code> 中有一個 <code>index.hbs</code> 模板：
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

若要將此模板用於指定的[路由](server-routing.md)，請透過以下方式將 <code>MustacheContent</code> 傳遞給 <code>call.respond</code> 方法：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(MustacheContent("index.hbs", mapOf("user" to sampleUser)))
}
```