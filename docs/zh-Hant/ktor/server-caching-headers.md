[//]: # (title: 快取標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 並允許您在沒有額外運行時或虛擬機器下運行伺服器。">Native server</Links> 支援</b>：✅
</p>
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 插件增加了配置用於 HTTP 快取的 `Cache-Control` 和 `Expires` 標頭的能力。您可以透過以下方式[配置快取](#configure)：
- 為特定的內容類型配置不同的快取策略，例如圖片、CSS 和 JavaScript 檔案等。
- 在不同層級指定快取選項：應用程式層級的全域配置、路由層級的配置，或針對特定呼叫的配置。

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

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來建構應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函數。
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
<p>
    <code>%plugin_name%</code> 插件也可以<a href="#install-route">安裝到特定路由</a>。
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能會很有用。
</p>

安裝 `%plugin_name%` 後，您可以 [配置](#configure) 各種內容類型的快取設定。

## 配置快取 {id="configure"}
若要配置 `%plugin_name%` 插件，您需要定義 [options](https://api.ktor.io/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 函數，為給定的 `ApplicationCall` 和內容類型提供指定的快取選項。來自 [caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 範例的程式碼片段展示了如何為純文字和 HTML 新增帶有 `max-age` 選項的 `Cache-Control` 標頭：

```kotlin
fun Application.module() {
    routing {
        install(CachingHeaders) {
            options { call, content ->
                when (content.contentType?.withoutParameters()) {
                    ContentType.Text.Plain -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 3600))
                    ContentType.Text.Html -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 60))
                    else -> null
                }
            }
        }
    }
}
```

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 物件接受 `Cache-Control` 和 `Expires` 標頭值作為參數：

*   `cacheControl` 參數接受一個 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 值。您可以使用 `CacheControl.MaxAge` 來指定 `max-age` 參數和相關設定，例如可見性、重新驗證選項等。您可以使用 `CacheControl.NoCache`/`CacheControl.NoStore` 來停用快取。
*   `expires` 參數允許您將 `Expires` 標頭指定為 `GMTDate` 或 `ZonedDateTime` 值。

### 路由層級 {id="configure-route"}

您不僅可以全域安裝插件，還可以安裝到 [特定路由](server-plugins.md#install-route)。例如，以下範例展示了如何為 `/index` 路由新增指定的快取標頭：

```kotlin
route("/index") {
    install(CachingHeaders) {
        options { call, content -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 1800)) }
    }
    get {
        call.respondText("Index page")
    }
}
```

### 呼叫層級 {id="configure-call"}

如果您需要更精細的快取設定，您可以使用 `ApplicationCall.caching` 屬性在呼叫層級配置快取選項。以下範例展示了如何根據使用者是否登入來配置快取選項：

```kotlin
route("/profile") {
    get {
        val userLoggedIn = true
        if(userLoggedIn) {
            call.caching = CachingOptions(CacheControl.NoStore(CacheControl.Visibility.Private))
            call.respondText("Profile page")
        } else {
            call.caching = CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 900))
            call.respondText("Login page")
        }
    }
}
```

> 若要登入使用者，您可以使用 [Authentication](server-auth.md) 和 [Sessions](server-sessions.md) 插件。