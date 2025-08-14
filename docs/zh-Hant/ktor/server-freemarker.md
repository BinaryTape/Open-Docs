[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您無需額外的執行時或虛擬機器即可執行伺服器。">原生伺服器</Links> 支援</b>：✖️
    </p>
    
</tldr>

Ktor 允許您透過安裝 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 插件，在您的應用程式中使用 [FreeMarker 模板](https://freemarker.apache.org/) 作為視圖。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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
    

## 安裝 FreeMarker {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴充函式。
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
    

在 <code>install</code> 區塊內部，您可以[配置](#configure)所需的 [TemplateLoader][freemarker_template_loading] 來載入 FreeMarker 模板。

## 配置 FreeMarker {id="configure"}
### 配置模板載入 {id="template_loading"}
要載入模板，您需要將所需的 [TemplateLoader][freemarker_template_loading] 類型分配給 <code>templateLoader</code> 屬性。例如，以下程式碼片段使 Ktor 能夠在相對於目前類路徑的 <code>templates</code> 套件中查找模板：
[object Promise]

### 在回應中傳送模板 {id="use_template"}
想像一下您在 <code>resources/templates</code> 中有 <code>index.ftl</code> 模板：
[object Promise]

用戶的資料模型如下所示：
[object Promise]

要將模板用於指定的[路由](server-routing.md)，請透過以下方式將 <code>FreeMarkerContent</code> 傳遞給 <code>call.respond</code> 方法：
[object Promise]