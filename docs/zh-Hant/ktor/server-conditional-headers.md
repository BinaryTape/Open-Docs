[//]: # (title: 條件式標頭)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>需要的依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外執行時間或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 外掛程式會避免在內容自上次請求後未變更的情況下，傳送內容主體。這是透過使用以下標頭來實現的：
* `Last-Modified` 回應標頭包含資源修改時間。例如，如果客戶端請求包含 `If-Modified-Since` 值，Ktor 僅在資源於指定日期之後被修改時才傳送完整回應。請注意，對於[靜態檔案](server-static-content.md)，Ktor 會在[安裝](#install_plugin) `ConditionalHeaders` 後自動附加 `Last-Modified` 標頭。
* `Etag` 回應標頭是特定資源版本的識別碼。例如，如果客戶端請求包含 `If-None-Match` 值，則在該值與 `Etag` 相符的情況下，Ktor 將不會傳送完整回應。您可以在[配置](#configure) `ConditionalHeaders` 時指定 `Etag` 值。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
        以下程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內，這是 <code>Application</code> 類別的擴充函式。
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
    

    <p>
        <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定的路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這將會很有用。
    </p>
    

## 配置標頭 {id="configure"}

若要配置 `%plugin_name%`，您需要在 `install` 區塊內呼叫 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 函式。此函式提供對指定 <code>ApplicationCall</code> 和 <code>OutgoingContent</code> 的資源版本清單的存取權限。您可以透過使用 [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 和 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 類別物件來指定所需的版本。

下面的程式碼片段展示了如何為 CSS 新增 `Etag` 和 `Last-Modified` 標頭：
[object Promise]

您可以在此處找到完整範例：[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。