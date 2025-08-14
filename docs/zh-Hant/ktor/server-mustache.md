[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

Ktor 允許您通過安裝 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 插件，在您的應用程式中使用 [Mustache 模板](https://github.com/spullara/mustache.java) 作為視圖。

## 新增依賴項 {id="add_dependencies"}

    <p>
        為了使用 <code>%plugin_name%</code>，您需要在構建腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

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
    

## 安裝 Mustache {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織您的應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。下面的程式碼片段演示瞭如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的擴展函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

在 <code>install</code> 區塊內部，您可以[配置](#template_loading) [MustacheFactory][mustache_factory] 以載入 Mustache 模板。

## 配置 Mustache {id="configure"}
### 配置模板載入 {id="template_loading"}
為了載入模板，您需要將 [MustacheFactory][mustache_factory] 賦予 <code>mustacheFactory</code> 屬性。例如，下面的程式碼片段使 Ktor 能夠在相對於當前 classpath 的 <code>templates</code> 套件中查找模板：
[object Promise]

### 在響應中傳送模板 {id="use_template"}
假設您在 <code>resources/templates</code> 中有一個 <code>index.hbs</code> 模板：
[object Promise]

使用者資料模型如下所示：
[object Promise]

要將模板用於指定的[路由](server-routing.md)，請以下列方式將 <code>MustacheContent</code> 傳遞給 <code>call.respond</code> 方法：
[object Promise]