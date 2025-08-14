[//]: # (title: 在 Ktor 伺服器中追蹤請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="call-id"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不額外使用執行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>：✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 伺服器外掛程式允許您透過使用唯一的呼叫 ID 來追蹤客戶端請求。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 外掛程式可讓您透過使用唯一的請求 ID 或呼叫 ID 來端對端追蹤客戶端請求。通常，在 Ktor 中使用呼叫 ID 的方式如下所示：
1. 首先，您需要透過以下其中一種方式取得特定請求的呼叫 ID：
   * 反向代理（例如 Nginx）或雲端供應商（例如 [Heroku](heroku.md)）可能會在特定標頭中新增呼叫 ID，例如 `X-Request-Id`。在這種情況下，Ktor 允許您[檢索](#retrieve)呼叫 ID。
   * 否則，如果請求沒有附帶呼叫 ID，您可以在 Ktor 伺服器上[產生](#generate)它。
2. 接下來，Ktor 會使用預定義的字典[驗證](#verify)已檢索/已產生呼叫 ID。您也可以提供自己的條件來驗證呼叫 ID。
3. 最後，您可以將呼叫 ID [傳送](#send)到客戶端，放在特定標頭中，例如 `X-Request-Id`。

結合使用 `%plugin_name%` 和 [CallLogging](server-call-logging.md) 有助於您透過將呼叫 ID [放入 MDC](#put-call-id-mdc) 上下文並設定日誌記錄器以顯示每個請求的呼叫 ID 來排除呼叫問題。

> 在客戶端，Ktor 提供了 [CallId](client-call-id.md) 外掛程式來追蹤客戶端請求。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置指令碼中包含 <code>%artifact_name%</code> artifact：
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
        要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函數。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴充函數。
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
    

## 設定 %plugin_name% {id="configure"}

### 檢索呼叫 ID {id="retrieve"}

`%plugin_name%` 提供了幾種檢索呼叫 ID 的方式：

* 要從指定標頭中檢索呼叫 ID，請使用 `retrieveFromHeader` 函數，例如：
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   您還可以使用 `header` 函數在同一個標頭中[檢索並傳送呼叫 ID](#send)。

* 如果需要，您可以從 `ApplicationCall` 中檢索呼叫 ID：
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
請注意，所有檢索到的呼叫 ID 都會使用預設字典進行[驗證](#verify)。

### 產生呼叫 ID {id="generate"}

如果傳入請求不包含呼叫 ID，您可以使用 `generate` 函數產生它：
* 以下範例展示了如何從預定義的字典中產生具有特定長度的呼叫 ID：
   ```kotlin
   install(CallId) {
       generate(10, "abcde12345")
   }
   ```
* 在以下範例中，`generate` 函數接受一個用於產生呼叫 ID 的區塊：
   ```kotlin
   install(CallId) {
       val counter = atomic(0)
       generate {
           "generated-call-id-${counter.getAndIncrement()}"
       }
   }
   ```

### 驗證呼叫 ID {id="verify"}

所有[檢索](#retrieve)/[產生](#generate)的呼叫 ID 都會使用預設字典進行驗證，該字典如下所示：

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
這表示包含大寫字母的呼叫 ID 將無法通過驗證。如果需要，您可以透過使用 `verify` 函數來應用較不嚴格的規則：

[object Promise]

您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### 將呼叫 ID 傳送至客戶端 {id="send"}

在[檢索](#retrieve)/[產生](#generate)呼叫 ID 後，您可以將其傳送至客戶端：

* `header` 函數可用於[檢索呼叫 ID](#retrieve) 並在同一個標頭中傳送它：

   [object Promise]

  您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

* `replyToHeader` 函數會在指定標頭中傳送呼叫 ID：
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

* 如果需要，您可以使用 `ApplicationCall` 在[回應](server-responses.md)中傳送呼叫 ID：
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## 將呼叫 ID 放入 MDC {id="put-call-id-mdc"}

結合使用 `%plugin_name%` 和 [CallLogging](server-call-logging.md) 有助於您透過將呼叫 ID 放入 MDC 上下文並設定日誌記錄器以顯示每個請求的呼叫 ID 來排除呼叫問題。為此，請在 `CallLogging` 設定區塊內呼叫 `callIdMdc` 函數，並指定要放入 MDC 上下文中的所需鍵：

[object Promise]

此鍵可以傳遞給[日誌記錄器設定](server-logging.md#configure-logger)以在日誌中顯示呼叫 ID。例如，`logback.xml` 檔案可能如下所示：
[object Promise]

您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。