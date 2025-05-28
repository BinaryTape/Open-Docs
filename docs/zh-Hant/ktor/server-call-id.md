[//]: # (title: 追蹤 Ktor 伺服器中的請求)

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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 伺服器外掛程式 (plugin) 允許您透過使用唯一的呼叫 ID (call ID) 來追蹤客戶端請求。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 外掛程式 (plugin) 允許您透過使用唯一的請求 ID (request ID) 或呼叫 ID (call ID) 來端對端地追蹤客戶端請求。通常，在 Ktor 中使用呼叫 ID (call ID) 的方式可能如下：
1.  首先，您需要透過以下其中一種方式來取得特定請求的呼叫 ID (call ID)：
    *   反向代理 (reverse proxy)（例如 Nginx）或雲端供應商 (cloud provider)（例如 [Heroku](heroku.md)）可能會在特定的標頭 (header) 中新增呼叫 ID (call ID)，例如 `X-Request-Id`。在這種情況下，Ktor 允許您[檢索](#retrieve)呼叫 ID (call ID)。
    *   否則，如果請求沒有帶有呼叫 ID (call ID)，您可以在 Ktor 伺服器上[產生](#generate)它。
2.  接下來，Ktor 會使用預定義的字典[驗證](#verify)所檢索/產生的呼叫 ID (call ID)。您也可以提供自己的條件來驗證呼叫 ID (call ID)。
3.  最後，您可以將呼叫 ID (call ID) 在特定標頭 (header) 中[傳送](#send)給客戶端，例如 `X-Request-Id`。

將 `%plugin_name%` 與 [CallLogging](server-call-logging.md) 一起使用，透過將呼叫 ID (call ID)[放入](#put-call-id-mdc) MDC 上下文 (context) 中，並配置日誌記錄器 (logger) 以顯示每個請求的呼叫 ID (call ID)，有助於您排除呼叫故障。

> 在客戶端，Ktor 提供了 [CallId](client-call-id.md) 外掛程式 (plugin) 用於追蹤客戶端請求。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

### 檢索呼叫 ID {id="retrieve"}

`%plugin_name%` 提供了幾種檢索呼叫 ID (call ID) 的方式：

*   若要從指定標頭 (header) 檢索呼叫 ID (call ID)，請使用 `retrieveFromHeader` 函數，例如：
    ```kotlin
    install(CallId) {
        retrieveFromHeader(HttpHeaders.XRequestId)
    }
    ```
    您也可以使用 `header` 函數在同一個標頭 (header) 中[檢索並傳送呼叫 ID](#send)。

*   如有需要，您可以從 `ApplicationCall` 檢索呼叫 ID (call ID)：
    ```kotlin
    install(CallId) {
        retrieve { call ->
            call.request.header(HttpHeaders.XRequestId)
        }
    }
    ```
請注意，所有檢索到的呼叫 ID (call ID) 都會使用預設字典[驗證](#verify)。

### 產生呼叫 ID {id="generate"}

如果傳入請求不包含呼叫 ID (call ID)，您可以使用 `generate` 函數來產生它：
*   以下範例展示如何從預定義的字典中產生特定長度的呼叫 ID (call ID)：
    ```kotlin
    install(CallId) {
        generate(10, "abcde12345")
    }
    ```
*   在以下範例中，`generate` 函數接受一個區塊 (block) 用於產生呼叫 ID (call ID)：
    ```kotlin
    install(CallId) {
        val counter = atomic(0)
        generate {
            "generated-call-id-${counter.getAndIncrement()}"
        }
    }
    ```

### 驗證呼叫 ID {id="verify"}

所有[檢索](#retrieve)/[產生](#generate)的呼叫 ID (call ID) 都會使用預設字典進行驗證，該字典如下所示：

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
這表示包含大寫字母的呼叫 ID (call ID) 將無法通過驗證。如有需要，您可以透過使用 `verify` 函數來應用較不嚴格的規則：

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13,15-18"}

您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### 將呼叫 ID 傳送給客戶端 {id="send"}

在[檢索](#retrieve)/[產生](#generate)呼叫 ID (call ID) 後，您可以將其傳送給客戶端：

*   `header` 函數可用於[檢索呼叫 ID](#retrieve) 並將其在同一個標頭 (header) 中傳送：

    ```kotlin
    ```
    {src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13-14,18"}

    您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

*   `replyToHeader` 函數在指定標頭 (header) 中傳送呼叫 ID (call ID)：
    ```kotlin
    install(CallId) {
        replyToHeader(HttpHeaders.XRequestId)
    }
    ```

*   如有需要，您可以使用 `ApplicationCall` 在[回應](server-responses.md)中傳送呼叫 ID (call ID)：
    ```kotlin
    reply { call, callId ->
        call.response.header(HttpHeaders.XRequestId, callId)
    }
    ```

## 將呼叫 ID 放入 MDC {id="put-call-id-mdc"}

將 `%plugin_name%` 與 [CallLogging](server-call-logging.md) 一起使用，透過將呼叫 ID (call ID) 放入 MDC 上下文 (context) 中並配置日誌記錄器 (logger) 以顯示每個請求的呼叫 ID (call ID)，有助於您排除呼叫故障。為此，請在 `CallLogging` 配置區塊 (block) 內部呼叫 `callIdMdc` 函數，並指定要放入 MDC 上下文 (context) 的所需鍵 (key)：

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="19-21"}

此鍵 (key) 可以傳遞給[日誌記錄器配置](server-logging.md#configure-logger)以在日誌中顯示呼叫 ID (call ID)。例如，`logback.xml` 檔案可能如下所示：
```
```
{style="block" src="snippets/call-id/src/main/resources/logback.xml" include-lines="2-6"}

您可以在此處找到完整範例：[call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。