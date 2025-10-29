[//]: # (title: 部分內容)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>伺服器範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>客戶端範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Modules 允許您透過分組路由來組織您的應用程式。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 外掛程式新增了處理 [HTTP 範圍請求](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)的支援，用於僅將 HTTP 訊息的一部分傳送回客戶端。此外掛程式對於串流內容或恢復部分下載非常有用。

`%plugin_name%` 有以下限制：
- 僅適用於 `HEAD` 和 `GET` 請求，如果客戶端嘗試將 `Range` 標頭與其他方法一起使用，則返回 `405 Method Not Allowed`。
- 僅適用於已定義 `Content-Length` 標頭的回應。
- 在提供範圍時停用 [壓縮](server-compression.md)。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
    將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules 允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴展函數。
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
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 組態，這可能會很有用。
</p>

若要了解如何使用 `%plugin_name%` 透過 HTTP 範圍請求提供檔案，請參閱[檔案](server-responses.md#file)部分。