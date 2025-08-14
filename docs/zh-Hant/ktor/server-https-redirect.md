[//]: # (title: HttpsRedirect)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>必要依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在無需額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) 外掛程式會在處理呼叫之前，將所有 HTTP 請求重新導向到 [HTTPS 對應項目](server-ssl.md)。依預設，資源會傳回 `301 Moved Permanently`，但可以將其設定為 `302 Found`。

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
        若要 <a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，
        請將其傳遞給指定 <Links href="/ktor/server-modules" summary="模組允許您透過將路由分組來組織您的應用程式。">模組</Links> 中的 <code>install</code> 函式。
        下列程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
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
    

上述程式碼會安裝 `%plugin_name%` 外掛程式並使用預設組態。

>當位於反向代理之後，您需要安裝 `ForwardedHeader` 或 `XForwardedHeader` 外掛程式以正確偵測 HTTPS 請求。如果您在安裝其中一個外掛程式後遇到無限重新導向，請參閱 [此 FAQ 條目](FAQ.topic#infinite-redirect) 以取得更多詳細資訊。
>
{type="note"}

## 設定 %plugin_name% {id="configure"}

下列程式碼片段展示了如何設定所需的 HTTPS 連接埠，並為所請求的資源傳回 `301 Moved Permanently`：

[object Promise]

您可以在此處找到完整的範例：[ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect)。