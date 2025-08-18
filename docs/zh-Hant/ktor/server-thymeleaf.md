[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

Ktor 允許您透過安裝 [Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 插件，在您的應用程式中使用 [Thymeleaf 模板](https://www.thymeleaf.org/)作為視圖。

## 新增依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在構建腳本中包含 <code>%artifact_name%</code> artifact：
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

## 安裝 Thymeleaf {id="install_plugin"}

<p>
    要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，
    請在指定的<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
    下面的程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在顯式定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的擴展函數。
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

## 設定 Thymeleaf {id="configure"}
### 設定模板載入 {id="template_loading"}
在 <code>install</code> 區塊內部，您可以設定 <code>ClassLoaderTemplateResolver</code>。例如，下面的程式碼片段讓 Ktor 能夠在相對於目前類別路徑的 <code>templates</code> 套件中查找 <code>*.html</code> 模板：
```kotlin
import io.ktor.server.application.*
import io.ktor.server.thymeleaf.*
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver

fun Application.module() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
}
```

### 在響應中傳送模板 {id="use_template"}
想像您在 <code>resources/templates</code> 中有一個 <code>index.html</code> 模板：
```html
<html xmlns:th="http://www.thymeleaf.org">
    <body>
        <h1 th:text="'Hello, ' + ${user.name}"></h1>
    </body>
</html>
```

使用者的資料模型如下所示：
```kotlin
data class User(val id: Int, val name: String)
```

若要將此模板用於指定的[路由](server-routing.md)，請透過以下方式將 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) 傳遞給 <code>call.respond</code> 方法：
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(ThymeleafContent("index", mapOf("user" to sampleUser)))
}
```

## 範例：自動重新載入 Thymeleaf 模板 {id="auto-reload"}

以下範例顯示了在使用[開發模式](server-development-mode.topic)時如何自動重新載入 Thymeleaf 模板。

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.thymeleaf.*
import org.thymeleaf.templateresolver.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(Thymeleaf) {
        setTemplateResolver((if (developmentMode) {
            FileTemplateResolver().apply {
                cacheManager = null
                prefix = "src/main/resources/templates/"
            }
        } else {
            ClassLoaderTemplateResolver().apply {
                prefix = "templates/"
            }
        }).apply {
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        get("/index") {
            val sampleUser = User(1, "John")
            call.respond(ThymeleafContent("index", mapOf("user" to sampleUser)))
        }
    }
}

data class User(val id: Int, val name: String)

```

您可以在此處找到完整的範例：[thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。