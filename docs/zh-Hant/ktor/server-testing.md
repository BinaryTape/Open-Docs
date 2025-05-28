[//]: # (title: Ktor Server 中的測試)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>必備依賴項</b>：<code>io.ktor:ktor-server-test-host</code>、<code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
了解如何使用特殊的測試引擎測試您的伺服器應用程式。
</link-summary>

Ktor 提供了一個特殊的測試引擎，它不會建立網頁伺服器、不會綁定到通訊端，也不會發出任何真實的 HTTP 請求。相反地，它直接與內部機制掛鉤，並直接處理應用程式呼叫。與執行完整的網頁伺服器進行測試相比，這會導致測試執行速度更快。

## 新增依賴項 {id="add-dependencies"}
為了測試伺服器 Ktor 應用程式，您需要在建置腳本中包含以下構件：
* 新增 `ktor-server-test-host` 依賴項：

   <var name="artifact_name" value="ktor-server-test-host"/>
   <include from="lib.topic" element-id="add_ktor_artifact_testing"/>

* 新增 `kotlin-test` 依賴項，它提供了一組用於在測試中執行斷言的實用函數：

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  <include from="lib.topic" element-id="add_artifact_testing"/>

> 為了測試 [Native 伺服器](server-native.md#add-dependencies)，請將測試構件新增至 `nativeTest` 原始碼集。

## 測試概覽 {id="overview"}

若要使用測試引擎，請遵循以下步驟：
1. 建立一個 JUnit 測試類別和一個測試函數。
2. 使用 [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 函數來設定一個在本機執行的測試應用程式的配置實例。
3. 在測試應用程式內使用 [Ktor HTTP 用戶端](client-create-and-configure.md)實例來向您的伺服器發出請求、接收回應並執行斷言。

以下程式碼演示了如何測試最簡單的 Ktor 應用程式，該應用程式接受對 `/` 路徑發出的 GET 請求並回應純文字。

<tabs>
<tab title="測試">

```kotlin
```
{src="snippets/engine-main/src/test/kotlin/EngineMainTest.kt"}

</tab>

<tab title="應用程式">

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

可執行的程式碼範例在此處提供：[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## 測試應用程式 {id="test-app"}

### 步驟 1：配置測試應用程式 {id="configure-test-app"}

測試應用程式的配置可能包括以下步驟：
- [新增應用程式模組](#add-modules)
- （可選）[新增路由](#add-routing)
- （可選）[自訂環境](#environment)
- （可選）[模擬外部服務](#external-services)

> 預設情況下，配置好的測試應用程式會在 [第一次用戶端呼叫](#make-request) 時啟動。
> 或者，您可以呼叫 `startApplication` 函數來手動啟動應用程式。
> 如果您需要測試應用程式的 [生命週期事件](server-events.md#predefined-events)，這可能很有用。

#### 新增應用程式模組 {id="add-modules"}

為了測試應用程式，其 [模組](server-modules.md) 應該載入到 `testApplication` 中。為此，您必須 [明確載入您的模組](#explicit-module-loading) 或 [配置環境](#configure-env) 以從配置檔案載入它們。

##### 明確載入模組 {id="explicit-module-loading"}

若要手動將模組新增至測試應用程式，請使用 `application` 函數：

```kotlin
```
{src="snippets/embedded-server-modules/src/test/kotlin/EmbeddedServerTest.kt" include-symbol="testModule1"}

#### 從配置檔案載入模組 {id="configure-env"}

如果您想從配置檔案載入模組，請使用 `environment` 函數來指定您的測試配置檔案：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

當您需要在測試期間模擬不同環境或使用自訂配置設定時，此方法很有用。

> 您也可以在 `application` 區塊內部存取 `Application` 實例。

#### 新增路由 {id="add-routing"}

您可以使用 `routing` 函數將路由新增至您的測試應用程式。
這對於以下用例可能很方便：
- 您可以新增應測試的 [特定路由](server-routing.md#route_extension_function)，而不是將 [模組新增](#add-modules) 到測試應用程式。
- 您可以新增僅在測試應用程式中所需的路由。以下範例展示了如何新增用於在測試中初始化使用者 [會話](server-sessions.md) 的 `/login-test` 端點：
   ```kotlin
   ```
   {src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,31-35,51"}
   
   您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 自訂環境 {id="environment"}

若要為測試應用程式建立自訂環境，請使用 `environment` 函數。
例如，若要為測試使用自訂配置，您可以在 `test/resources` 資料夾中建立一個配置檔案，並使用 `config` 屬性載入它：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

指定配置屬性的另一種方法是使用 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)。如果您想在應用程式啟動之前存取應用程式配置，這可能很有用。以下範例展示了如何使用 `config` 屬性將 `MapApplicationConfig` 傳遞給 `testApplication` 函數：

```kotlin
```
{src="snippets/engine-main-custom-environment/src/test/kotlin/ApplicationTest.kt" include-lines="10-14,21"}

#### 模擬外部服務 {id="external-services"}

Ktor 允許您使用 `externalServices` 函數模擬外部服務。
在此函數中，您需要呼叫 `hosts` 函數，該函數接受兩個參數：
- `hosts` 參數接受外部服務的 URL。
- `block` 參數允許您配置作為外部服務模擬的 `Application`。您可以為此 `Application` 配置路由並安裝外掛。

以下範例展示了如何使用 `externalServices` 來模擬 Google API 返回的 JSON 回應：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,36-47,51"}

您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 步驟 2：（可選）配置用戶端 {id="configure-client"}

`testApplication` 使用 `client` 屬性提供對具有預設配置的 HTTP 用戶端的存取。
如果您需要自訂用戶端並安裝額外的外掛，您可以使用 `createClient` 函數。例如，要在測試 POST/PUT 請求中 [傳送 JSON 資料](#json-data)，您可以安裝 [ContentNegotiation](client-serialization.md) 外掛：
```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-40,48"}

### 步驟 3：發出請求 {id="make-request"}

為了測試您的應用程式，請使用 [配置好的用戶端](#configure-client) 來發出 [請求](client-requests.md) 並接收 [回應](client-responses.md)。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) 展示了如何測試處理 `POST` 請求的 `/customer` 端點：

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-44,48"}

### 步驟 4：斷言結果 {id="assert"}

收到 [回應](#make-request) 後，您可以透過使用 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 程式庫提供的斷言來驗證結果：

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-48"}

## 測試 POST/PUT 請求 {id="test-post-put"}

### 傳送表單資料 {id="form-data"}

為了在測試 POST/PUT 請求中傳送表單資料，您需要設定 `Content-Type` 標頭並指定請求主體。為此，您可以使用 [header](client-requests.md#headers) 和 [setBody](client-requests.md#body) 函數。以下範例展示了如何使用 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送表單資料。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

以下來自 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 範例的測試展示了如何使用 `x-www-form-urlencoded` 內容類型傳送帶有表單參數的測試請求。請注意，[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 函數用於從鍵/值對列表編碼表單參數。

<tabs>
<tab title="測試">

```kotlin
```
{src="snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"}

</tab>

<tab title="應用程式">

```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="3-16,45-46"}

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

以下程式碼演示了如何建立 `multipart/form-data` 並測試檔案上傳。您可以在此處找到完整範例：[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<tabs>
<tab title="測試">

```kotlin
```
{src="snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt"}

</tab>

<tab title="應用程式">

```kotlin
```
{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt"}

</tab>
</tabs>

### 傳送 JSON 資料 {id="json-data"}

為了在測試 POST/PUT 請求中傳送 JSON 資料，您需要建立一個新的用戶端並安裝 [ContentNegotiation](client-serialization.md) 外掛，該外掛允許以特定格式序列化/反序列化內容。在請求內部，您可以使用 `contentType` 函數指定 `Content-Type` 標頭，並使用 [setBody](client-requests.md#body) 指定請求主體。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) 展示了如何測試處理 `POST` 請求的 `/customer` 端點。

<tabs>
<tab title="測試">

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="3-11,31-48"}

</tab>

<tab title="應用程式">

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="3-16,25-31,38-44"}

</tab>
</tabs>

## 在測試期間保留 Cookie {id="preserving-cookies"}

如果您需要在測試時在請求之間保留 Cookie，則需要建立一個新的用戶端並安裝 [HttpCookies](client-cookies.md) 外掛。在以下來自 [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 範例的測試中，由於 Cookie 被保留，每次請求後重新載入計數都會增加。

<tabs>
<tab title="測試">

```kotlin
```
{src="snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt"}

</tab>

<tab title="應用程式">

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="3-38"}

</tab>
</tabs>

## 測試 HTTPS {id="https"}

如果您需要測試 [HTTPS 端點](server-ssl.md)，請使用 [URLBuilder.protocol](client-requests.md#url) 屬性更改用於發出請求的協定：

```kotlin
```
{src="snippets/ssl-engine-main/src/test/kotlin/ApplicationTest.kt" include-lines="3-22"}

您可以在此處找到完整範例：[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## 測試 WebSocket {id="testing-ws"}

您可以使用用戶端提供的 [WebSockets](client-websockets.topic) 外掛來測試 [WebSocket 對話](server-websockets.md)：

```kotlin
```
{src="snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"}

## 使用 HttpClient 進行端到端測試 {id="end-to-end"}
除了測試引擎之外，您還可以使用 [Ktor HTTP 用戶端](client-create-and-configure.md) 對您的伺服器應用程式進行端到端測試。
在以下範例中，HTTP 用戶端向 `TestServer` 發出測試請求：

```kotlin
```
{src="snippets/embedded-server/src/test/kotlin/EmbeddedServerTest.kt"}

如需完整範例，請參考以下範例：
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)：一個待測試的範例伺服器。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e)：包含用於設定測試伺服器的輔助類別和函數。