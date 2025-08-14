[//]: # (title: 在 Ktor 客戶端中追蹤請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依賴</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

</tldr>

<link-summary>
%plugin_name% 客戶端外掛程式允許您使用唯一的呼叫 ID 追蹤客戶端請求。
</link-summary>

%plugin_name% 外掛程式允許您使用唯一的呼叫 ID，從頭到尾追蹤客戶端請求。這在微服務架構中特別有用，無論請求經過多少服務，都能追蹤呼叫。

呼叫範圍在其協程上下文 (coroutine context) 中可能已經有一個呼叫 ID。預設情況下，意外掛程式使用當前上下文擷取呼叫 ID，並使用 `HttpHeaders.XRequestId` 標頭將其添加到特定呼叫的上下文中。

此外，如果一個範圍沒有呼叫 ID，您可以[配置此外掛程式](#configure)以生成並應用一個新的呼叫 ID。

> 在伺服器端，Ktor 提供了 [CallId](server-call-id.md) 外掛程式用於追蹤客戶端請求。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
        要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
        下面的程式碼片段展示瞭如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code>（即 <code>Application</code> 類的擴充功能函數）內部。
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

%plugin_name% 外掛程式配置，由
[CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html)
類別提供，允許您生成呼叫 ID 並將其添加到呼叫上下文中。

### 生成呼叫 ID

以下列其中一種方式為特定請求生成呼叫 ID：

* <code>useCoroutineContext</code> 屬性（預設啟用）會添加一個生成器，該生成器使用當前的 <code>CoroutineContext</code> 擷取呼叫 ID。要禁用此功能，請將 <code>useCoroutineContext</code> 設定為 <code>false</code>：

 [object Promise]

> 在 Ktor 伺服器中，使用 [CallId 外掛程式](server-call-id.md) 將呼叫 ID 添加到 <code>CoroutineContext</code> 中。

* <code>generate()</code> 函數允許您為傳出請求生成呼叫 ID。如果無法生成呼叫 ID，它將返回 <code>null</code>。

 [object Promise]

您可以使用多種方法生成呼叫 ID。這樣，第一個非空值將被應用。

### 新增呼叫 ID

擷取呼叫 ID 後，您可以選擇以下選項將其添加到請求中：

* <code>intercept()</code> 函數允許您使用 <code>CallIdInterceptor</code> 將呼叫 ID 添加到請求中。

 [object Promise]

* <code>addToHeader()</code> 函數將呼叫 ID 添加到指定的標頭中。它接受一個標頭作為參數，預設為 <code>HttpHeaders.XRequestId</code>。

 [object Promise]

## 範例

在以下範例中，Ktor 客戶端的 <code>%plugin_name%</code> 外掛程式配置為生成新的呼叫 ID 並將其添加到標頭中：

 [object Promise]

此外掛程式使用協程上下文獲取呼叫 ID，並利用 <code>generate()</code> 函數生成一個新的。然後，使用 <code>addToHeader()</code> 函數將第一個非空呼叫 ID 應用於請求標頭。

在 Ktor 伺服器中，然後可以使用 [伺服器 CallId 外掛程式](server-call-id.md) 中的 [retrieve](server-call-id.md#retrieve) 函數從標頭中擷取呼叫 ID。

 [object Promise]

透過這種方式，Ktor 伺服器會擷取請求中指定標頭的 ID，並將其應用於呼叫的 <code>callId</code> 屬性。

有關完整範例，請參閱 [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)