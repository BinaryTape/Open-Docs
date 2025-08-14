[//]: # (title: 快取標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="模組允許您透過分組路由來組織您的應用程式。">Native 伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 插件增加了配置用於 HTTP 快取的 <code>Cache-Control</code> 和 <code>Expires</code> 標頭的能力。您可以透過以下方式[配置快取](#configure)：
- 配置針對特定內容類型（例如圖片、CSS 和 JavaScript 檔案等等）的不同快取策略。
- 在不同層級指定快取選項：在應用程式層級全域地、在路由層級，或針對特定的呼叫。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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
        若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函數。下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
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
    

    <p>
        <code>%plugin_name%</code> 插件也可以<a href="#install-route">安裝到特定的路由</a>。如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這將會很有用。
    </p>
    

安裝 <code>%plugin_name%</code> 後，您可以[配置](#configure)針對各種內容類型的快取設定。

## 配置快取 {id="configure"}
若要配置 <code>%plugin_name%</code> 插件，您需要定義 [options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 函數，以提供給定 <code>ApplicationCall</code> 和內容類型的指定快取選項。[caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 範例中的程式碼片段展示了如何為純文字和 HTML 新增帶有 <code>max-age</code> 選項的 <code>Cache-Control</code> 標頭：

[object Promise]

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 物件接受 <code>Cache-Control</code> 和 <code>Expires</code> 標頭值作為參數：

*   <code>cacheControl</code> 參數接受一個 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 值。您可以使用 <code>CacheControl.MaxAge</code> 來指定 <code>max-age</code> 參數和相關設定，例如可見性、重新驗證選項等等。您可以透過使用 <code>CacheControl.NoCache</code>/<code>CacheControl.NoStore</code> 來禁用快取。
*   <code>expires</code> 參數允許您將 <code>Expires</code> 標頭指定為 <code>GMTDate</code> 或 <code>ZonedDateTime</code> 值。

### 路由層級 {id="configure-route"}

您可以將插件不僅可以全域地安裝，也可以安裝到[特定的路由](server-plugins.md#install-route)。例如，下面的範例展示了如何為 <code>/index</code> 路由新增指定的快取標頭：

[object Promise]

### 呼叫層級 {id="configure-call"}

如果您需要更精細的快取設定，您可以在呼叫層級使用 <code>ApplicationCall.caching</code> 屬性配置快取選項。下面的範例展示了如何根據使用者是否登入來配置快取選項：

[object Promise]

> 對於登入使用者，您可以使用 [Authentication](server-auth.md) 和 [Sessions](server-sessions.md) 插件。