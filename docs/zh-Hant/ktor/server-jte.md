[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外執行時環境或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

Ktor 允許您透過安裝 [%plugin_name%] 外掛程式，在您的應用程式中將 [JTE 模板](https://github.com/casid/jte) 作為視圖使用。

## 新增依賴 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建構腳本中包含 <code>%artifact_name%</code> artifact：
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
    

> 為了處理 `.kte` 檔案，您需要將 `gg.jte:jte-kotlin` artifact 新增到您的專案中。

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式中，
        請將其傳遞給指定 <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links> 中的 <code>install</code> 函數。
        下方的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的擴充功能函數。
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
    

在 <code>install</code> 區塊內部，您可以[配置](#configure)如何載入 JTE 模板。

## 配置 %plugin_name% {id="configure"}
### 配置模板載入 {id="template_loading"}
若要載入 JTE 模板，您需要：
1. 建立一個用於解析模板程式碼的 `CodeResolver`。例如，您可以配置 `DirectoryCodeResolver` 從指定目錄載入模板，或配置 `ResourceCodeResolver` 從應用程式資源載入模板。
2. 使用 `templateEngine` 屬性指定一個模板引擎，它使用已建立的 `CodeResolver` 將模板轉換為原生 Java/Kotlin 程式碼。

例如，下方的程式碼片段使 Ktor 能夠在 `templates` 目錄中查找 JTE 模板：

[object Promise]

### 在回應中傳送模板 {id="use_template"}
假設您在 `templates` 目錄中擁有 `index.kte` 模板：
[object Promise]

若要將該模板用於指定的[路由](server-routing.md)，請依照以下方式將 `JteContent` 傳遞給 `call.respond` 方法：
[object Promise]