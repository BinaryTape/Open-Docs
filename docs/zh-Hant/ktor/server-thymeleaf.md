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
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您無需額外執行環境或虛擬機器即可執行伺服器。">原生伺服器</Links>支援</b>：✖️
    </p>
    
</tldr>

Ktor 允許您透過安裝 [Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 外掛程式，在您的應用程式中使用 [Thymeleaf 範本](https://www.thymeleaf.org/)作為視圖。

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
    

## 安裝 Thymeleaf {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
        請將它傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函式。
        下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code>...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函式。
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
    

## 配置 Thymeleaf {id="configure"}
### 配置範本載入 {id="template_loading"}
在 `install` 區塊內部，您可以配置 `ClassLoaderTemplateResolver`。例如，下面的程式碼片段使 Ktor 能夠在相對於目前類別路徑的 `templates` 套件中查找 `*.html` 範本：
[object Promise]

### 在回應中傳送範本 {id="use_template"}
想像您在 `resources/templates` 中有一個 `index.html` 範本：
[object Promise]

使用者的資料模型如下所示：
[object Promise]

若要為指定的[路由](server-routing.md)使用範本，請以下列方式將 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) 傳遞給 `call.respond` 方法：
[object Promise]

## 範例：自動重新載入 Thymeleaf 範本 {id="auto-reload"}

下面的範例展示了在啟用[開發模式](server-development-mode.topic)時如何自動重新載入 Thymeleaf 範本。

[object Promise]

您可以在這裡找到完整的範例：[thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。