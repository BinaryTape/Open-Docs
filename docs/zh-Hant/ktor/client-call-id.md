[//]: # (title: 在 Ktor Client 中追蹤請求)

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
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
%plugin_name% 客戶端外掛程式允許您使用唯一的呼叫 ID 追蹤客戶端請求。
</link-summary>

%plugin_name% 外掛程式允許您使用唯一的呼叫 ID 端到端追蹤客戶端請求。在微服務架構中，它對於追蹤呼叫尤其有用，無論請求經過多少個服務。

呼叫範圍可能已在其協程上下文 (CoroutineContext) 中包含一個呼叫 ID。預設情況下，此外掛程式使用當前上下文來檢索呼叫 ID，並使用 `HttpHeaders.XRequestId` 標頭將其新增到特定呼叫的上下文。

此外，如果一個範圍沒有呼叫 ID，您可以[配置此外掛程式](#configure)來生成並應用新的呼叫 ID。

> 在伺服器端，Ktor 提供了 [CallId](server-call-id.md) 外掛程式用於追蹤客戶端請求。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

%plugin_name% 外掛程式配置，由 [CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html) 類別提供，允許您生成呼叫 ID 並將其新增到呼叫上下文。

### 生成呼叫 ID

以下列其中一種方式為特定請求生成呼叫 ID：

* 預設啟用的 `useCoroutineContext` 屬性會新增一個生成器，該生成器使用當前的 `CoroutineContext` 來檢索呼叫 ID。要禁用此功能，請將 `useCoroutineContext` 設定為 `false`：

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34-35,37"}

> 在 Ktor 伺服器中，使用 [CallId 外掛程式](server-call-id.md) 將呼叫 ID 新增到 `CoroutineContext`。

* `generate()` 函數允許您為外送請求生成呼叫 ID。如果無法生成呼叫 ID，它將返回 `null`。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34,36-37"}

您可以利用多種方法來生成呼叫 ID。這樣，第一個非 `null` 值將會被應用。

### 新增呼叫 ID

檢索到呼叫 ID 後，您可以利用以下可用選項將其新增到請求中：

* `intercept()` 函數允許您透過使用 `CallIdInterceptor` 將呼叫 ID 新增到請求中。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="23-27"}

* `addToHeader()` 函數將呼叫 ID 新增到指定的標頭。它接受一個標頭作為參數，預設為 `HttpHeaders.XRequestId`。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="18,20-21"}

## 範例

在以下範例中，Ktor 客戶端的 `%plugin_name%` 外掛程式被配置為生成新的呼叫 ID 並將其新增到標頭：

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="17-22"}

此外掛程式使用協程上下文來獲取呼叫 ID，並利用 `generate()` 函數生成一個新的呼叫 ID。然後，第一個非 `null` 的呼叫 ID 會使用 `addToHeader()` 函數應用到請求標頭。

在 Ktor 伺服器中，可以透過 [伺服器的 CallId 外掛程式](server-call-id.md) 的 [retrieve](server-call-id.md#retrieve) 函數從標頭中檢索呼叫 ID。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="29-30,33"}

透過這種方式，Ktor 伺服器會檢索請求中指定標頭的 ID，並將其應用到該呼叫的 `callId` 屬性。

有關完整範例，請參閱 [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)