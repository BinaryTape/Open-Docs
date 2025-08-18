[//]: # (title: 在 Ktor Client 中追蹤請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
%plugin_name% 用戶端外掛程式允許您使用唯一的呼叫 ID 來追蹤用戶端請求。
</link-summary>

%plugin_name% 外掛程式允許您使用唯一的呼叫 ID 端到端追蹤用戶端請求。這在微服務架構中特別有用，無論請求經過多少服務，都可以追蹤呼叫。

呼叫範圍可能在其協程環境中已經包含一個呼叫 ID。預設情況下，意外掛程式使用目前環境來檢索呼叫 ID，並使用 `HttpHeaders.XRequestId` 標頭將其新增到特定呼叫的環境中。

此外，如果一個範圍沒有呼叫 ID，您可以[配置該外掛程式](#configure)來生成並應用一個新的呼叫 ID。

> 在伺服器上，Ktor 提供了 [CallId](server-call-id.md) 外掛程式用於追蹤用戶端請求。

## 新增依賴 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> 構件包含在建置腳本中：
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
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code>...
</p>
<list>
    <li>
        ...在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ...在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的一個擴充函數。
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

## 配置 %plugin_name% {id="configure"}

%plugin_name% 外掛程式配置由
[CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html)
類別提供，允許您生成一個呼叫 ID 並將
其新增到呼叫環境中。

### 生成呼叫 ID

透過以下方式之一為特定請求生成呼叫 ID：

*   `useCoroutineContext` 屬性（預設啟用）新增了一個生成器，該生成器使用目前的 `CoroutineContext` 來檢索呼叫 ID。若要禁用此功能，請將 `useCoroutineContext` 設定為 `false`：

 ```kotlin
 install(CallId) {
     useCoroutineContext = false
 }
 ```

> 在 Ktor 伺服器中，使用 [CallId 外掛程式](server-call-id.md) 將呼叫 ID 新增到 `CoroutineContext`。

*   `generate()` 函數允許您為傳出請求生成一個呼叫 ID。如果生成呼叫 ID 失敗，它會回傳 `null`。

 ```kotlin
 install(CallId) {
     generate { "call-id-client-2" }
 }
 ```

您可以根據多種方法來生成呼叫 ID。透過這種方式，將應用第一個非空值。

### 新增呼叫 ID

檢索呼叫 ID 後，您可以選擇以下選項將其新增到請求中：

*   `intercept()` 函數允許您透過使用 `CallIdInterceptor` 將呼叫 ID 新增到請求中。

 ```kotlin
 install(ClientCallId) {
     intercept { request, callId ->
         request.header(HttpHeaders.XRequestId, callId)
     }
 }
 ```

*   `addToHeader()` 函數將呼叫 ID 新增到指定的標頭。它接受一個標頭作為參數，預設為 `HttpHeaders.XRequestId`。

 ```kotlin
 install(CallId) {
     addToHeader(HttpHeaders.XRequestId)
 }
 ```

## 範例

在以下範例中，Ktor 用戶端的 `%plugin_name%` 外掛程式被配置為生成新的呼叫 ID 並將其新增到標頭：

 ```kotlin
 val client = HttpClient(CIO) {
     install(CallId) {
         generate { "call-id-client" }
         addToHeader(HttpHeaders.XRequestId)
     }
 }
 ```

該外掛程式使用協程環境來獲取呼叫 ID，並利用 `generate()` 函數生成一個新的呼叫 ID。然後，第一個非空的呼叫 ID 會使用 `addToHeader()` 函數應用到請求標頭。

在 Ktor 伺服器中，呼叫 ID 可以透過 [CallId 伺服器外掛程式](server-call-id.md)的 [retrieve](server-call-id.md#retrieve) 函數從標頭中檢索。

 ```kotlin
 install(CallId) {
     retrieveFromHeader(HttpHeaders.XRequestId)
 }
 ```

透過這種方式，Ktor 伺服器會檢索請求指定標頭的 ID，並將其應用於呼叫的 `callId` 屬性。

有關完整範例，
請參閱 [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)