[//]: # (title: 條件式標頭)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">Native server</Links> 支援</b>: ✅
</p>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 外掛程式可避免在內容自上次請求後未發生變化時發送其內容主體。這是透過使用以下標頭來實現的：
*   `Last-Modified` 回應標頭包含資源修改時間。例如，如果用戶端請求包含 `If-Modified-Since` 值，Ktor 將僅在資源於給定日期之後被修改時才發送完整回應。請注意，對於[靜態檔案](server-static-content.md)，Ktor 會在[安裝](#install_plugin) `ConditionalHeaders` 後自動附加 `Last-Modified` 標頭。
*   `Etag` 回應標頭是特定資源版本的識別碼。例如，如果用戶端請求包含 `If-None-Match` 值，則當此值與 `Etag` 匹配時，Ktor 將不會發送完整回應。您可以在[配置](#configure) `ConditionalHeaders` 時指定 `Etag` 值。

## 添加依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的一個擴充函數。
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
    <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定路由</a>。
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能會很有用。
</p>

## 配置標頭 {id="configure"}

要配置 `%plugin_name%`，您需要在 <code>install</code> 區塊內部呼叫 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 函數。此函數提供了存取給定 <code>ApplicationCall</code> 和 <code>OutgoingContent</code> 的資源版本列表。您可以透過使用 [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 和 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 類別物件來指定所需的版本。

以下程式碼片段展示了如何為 CSS 添加 <code>Etag</code> 和 <code>Last-Modified</code> 標頭：
```kotlin
install(ConditionalHeaders) {
    val file = File("src/main/kotlin/com/example/Application.kt")
    version { call, outgoingContent ->
        when (outgoingContent.contentType?.withoutParameters()) {
            ContentType.Text.CSS -> listOf(
                EntityTagVersion(file.lastModified().hashCode().toString()),
                LastModifiedVersion(Date(file.lastModified()))
            )
            else -> emptyList()
        }
    }
}
```

您可以在這裡找到完整範例：[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。