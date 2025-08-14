[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必要的相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行階段或虛擬機器下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

<link-summary>
`%plugin_name%` 插件可啟用 WebJars 提供的用戶端函式庫服務。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 插件可啟用 [WebJars](https://www.webjars.org/) 提供的用戶端函式庫服務。它允許您將 JavaScript 和 CSS 函式庫等資產打包作為 [fat JAR](server-fatjar.md) 的一部分。

## 新增相依性 {id="add_dependencies"}
若要啟用 `%plugin_name%`，您需要在建置指令碼中包含以下構件：
* 新增 `%artifact_name%` 相依性：

  
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
    

* 新增一個所需用戶端函式庫的相依性。以下範例展示如何新增 Bootstrap 構件：

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  
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
    
  
  您可以用 `bootstrap` 構件的所需版本替換 `$bootstrap_version`，例如 `%bootstrap_version%`。

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>至應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函式。
        以下程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
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
    

## 配置 %plugin_name% {id="configure"}

依預設，`%plugin_name%` 會在 `/webjars` 路徑上提供 WebJars 資產。以下範例展示如何變更此設定，並在 `/assets` 路徑上提供任何 WebJars 資產：

[object Promise]

例如，如果您已安裝 `org.webjars:bootstrap` 相依性，您可以如下新增 `bootstrap.css`：

[object Promise]

請注意，`%plugin_name%` 允許您變更相依性的版本，而無需變更用於載入它們的路徑。

> 您可以在此處找到完整的範例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。