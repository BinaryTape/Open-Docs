[//]: # (title: Ktor Server 中的測試)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>所需相依性</b>: `io.ktor:ktor-server-test-host`, `org.jetbrains.kotlin:kotlin-test`
</p>
</tldr>

<link-summary>
了解如何使用特殊的測試引擎來測試您的伺服器應用程式。
</link-summary>

Ktor 提供一個特殊的測試引擎，它不會建立網頁伺服器、不會綁定通訊端，也不會發出任何真實的 HTTP 請求。相反地，它會直接鉤入內部機制並直接處理應用程式呼叫。這使得測試執行比執行完整的網頁伺服器進行測試更快。

## 新增相依性 {id="add-dependencies"}
若要測試 Ktor 伺服器應用程式，您需要在建置腳本中包含以下構件：
* 新增 `ktor-server-test-host` 相依性：

   <var name="artifact_name" value="ktor-server-test-host"/>
   
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
    

* 新增 `kotlin-test` 相依性，它提供一組用於在測試中執行斷言的公用函數：

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  
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
    

> 若要測試 [原生伺服器](server-native.md#add-dependencies)，請將測試構件新增至 `nativeTest` 原始碼集。

## 測試概述 {id="overview"}

若要使用測試引擎，請依照以下步驟操作：
1. 建立一個 JUnit 測試類別和一個測試函數。
2. 使用 [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 函數設定一個在本機執行且已配置的測試應用程式實例。
3. 在測試應用程式內部，使用 [Ktor HTTP 客戶端](client-create-and-configure.md) 實例向您的伺服器發出請求、接收回應並執行斷言。

以下程式碼示範如何測試最簡單的 Ktor 應用程式，該應用程式接受針對 `/` 路徑發出的 GET 請求，並以純文字回應。

<tabs>
<tab title="測試">

[object Promise]

</tab>

<tab title="應用程式">

[object Promise]

</tab>
</tabs>

可執行的程式碼範例可在此處取得：[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## 測試應用程式 {id="test-app"}

### 步驟 1：配置測試應用程式 {id="configure-test-app"}

測試應用程式的配置可能包含以下步驟：
- [新增應用程式模組](#add-modules)
- (可選) [新增路由](#add-routing)
- (可選) [自訂環境](#environment)
- (可選) [模擬外部服務](#external-services)

> 預設情況下，已配置的測試應用程式會在[第一次客戶端呼叫](#make-request)時啟動。
> 您也可以選擇呼叫 `startApplication` 函數來手動啟動應用程式。
> 如果您需要測試應用程式的[生命週期事件](server-events.md#predefined-events)，這可能很有用。

#### 新增應用程式模組 {id="add-modules"}

若要測試應用程式，其[模組](server-modules.md)應該載入到 `testApplication`。為此，您必須[明確載入模組](#explicit-module-loading)或[配置環境](#configure-env)以從配置檔載入它們。

##### 明確載入模組 {id="explicit-module-loading"}

若要手動將模組新增至測試應用程式，請使用 `application` 函數：

[object Promise]

#### 從配置檔載入模組 {id="configure-env"}

如果您想從配置檔載入模組，請使用 `environment` 函數指定測試的配置檔：

[object Promise]

當您需要模擬不同的環境或在測試期間使用自訂配置設定時，此方法非常有用。

> 您也可以在 `application` 區塊中存取 `Application` 實例。

#### 新增路由 {id="add-routing"}

您可以使用 `routing` 函數將路由新增至您的測試應用程式。
這在以下使用案例中可能很方便：
- 您可以新增應測試的[特定路由](server-routing.md#route_extension_function)，而非將[模組新增](#add-modules)至測試應用程式。
- 您可以新增僅在測試應用程式中所需的路由。以下範例示範如何新增 `/login-test` 端點，該端點用於在測試中初始化使用者[工作階段](server-sessions.md)：
   [object Promise]
   
   您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 自訂環境 {id="environment"}

若要為測試應用程式建立自訂環境，請使用 `environment` 函數。
例如，若要在測試中使用自訂配置，您可以在 `test/resources` 資料夾中建立一個配置檔，並使用 `config` 屬性載入它：

[object Promise]

指定配置屬性的另一種方法是使用 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)。如果您想在應用程式啟動前存取應用程式配置，這可能很有用。以下範例示範如何使用 `config` 屬性將 `MapApplicationConfig` 傳遞給 `testApplication` 函數：

[object Promise]

#### 模擬外部服務 {id="external-services"}

Ktor 允許您使用 `externalServices` 函數模擬外部服務。
在此函數內部，您需要呼叫 `hosts` 函數，該函數接受兩個參數：
- `hosts` 參數接受外部服務的 URL。
- `block` 參數允許您配置作為外部服務模擬的 `Application`。
   您可以為此 `Application` 配置路由並安裝外掛程式。

以下範例示範如何使用 `externalServices` 模擬 Google API 返回的 JSON 回應：

[object Promise]

您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 步驟 2：(可選) 配置客戶端 {id="configure-client"}

`testApplication` 透過 `client` 屬性提供對具有預設配置的 HTTP 客戶端的存取。
如果您需要自訂客戶端並安裝額外的外掛程式，您可以使用 `createClient` 函數。例如，要在測試 POST/PUT 請求中[傳送 JSON 資料](#json-data)，您可以安裝 [ContentNegotiation](client-serialization.md) 外掛程式：
[object Promise]

### 步驟 3：發出請求 {id="make-request"}

若要測試您的應用程式，請使用[已配置的客戶端](#configure-client)發出[請求](client-requests.md)並接收[回應](client-responses.md)。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)示範如何測試處理 `POST` 請求的 `/customer` 端點：

[object Promise]

### 步驟 4：斷言結果 {id="assert"}

接收到[回應](#make-request)後，您可以透過使用 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫提供的斷言來驗證結果：

[object Promise]

## 測試 POST/PUT 請求 {id="test-post-put"}

### 傳送表單資料 {id="form-data"}

若要在測試 POST/PUT 請求中傳送表單資料，您需要設定 `Content-Type` 標頭並指定請求主體。為此，您可以分別使用 [header](client-requests.md#headers) 和 [setBody](client-requests.md#body) 函數。以下範例示範如何使用 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送表單資料。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

來自 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 範例的以下測試示範如何使用 `x-www-form-urlencoded` 內容類型傳送表單參數的測試請求。請注意，[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 函數用於從鍵/值對列表編碼表單參數。

<tabs>
<tab title="測試">

[object Promise]

</tab>

<tab title="應用程式">

[object Promise]

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

以下程式碼示範如何建構 `multipart/form-data` 並測試檔案上傳。您可以在此處找到完整範例：[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<tabs>
<tab title="測試">

[object Promise]

</tab>

<tab title="應用程式">

[object Promise]

</tab>
</tabs>

### 傳送 JSON 資料 {id="json-data"}

若要在測試 POST/PUT 請求中傳送 JSON 資料，您需要建立一個新的客戶端並安裝 [ContentNegotiation](client-serialization.md) 外掛程式，該外掛程式允許以特定格式序列化/反序列化內容。在請求內部，您可以使用 `contentType` 函數指定 `Content-Type` 標頭，並使用 [setBody](client-requests.md#body) 指定請求主體。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)示範如何測試處理 `POST` 請求的 `/customer` 端點。

<tabs>
<tab title="測試">

[object Promise]

</tab>

<tab title="應用程式">

[object Promise]

</tab>
</tabs>

## 在測試期間保留 Cookie {id="preserving-cookies"}

如果您需要在測試時在請求之間保留 Cookie，您需要建立一個新的客戶端並安裝 [HttpCookies](client-cookies.md) 外掛程式。在來自 [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 範例的以下測試中，由於 Cookie 被保留，每個請求後重載計數都會增加。

<tabs>
<tab title="測試">

[object Promise]

</tab>

<tab title="應用程式">

[object Promise]

</tab>
</tabs>

## 測試 HTTPS {id="https"}

如果您需要測試 [HTTPS 端點](server-ssl.md)，請使用 [URLBuilder.protocol](client-requests.md#url) 屬性變更用於發出請求的協定：

[object Promise]

您可以在此處找到完整範例：[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## 測試 WebSockets {id="testing-ws"}

您可以使用客戶端提供的 [WebSockets](client-websockets.topic) 外掛程式來測試 [WebSocket 對話](server-websockets.md)：

[object Promise]

## 使用 HttpClient 進行端到端測試 {id="end-to-end"}
除了測試引擎之外，您還可以使用 [Ktor HTTP 客戶端](client-create-and-configure.md) 對您的伺服器應用程式進行端到端測試。
在以下範例中，HTTP 客戶端向 `TestServer` 發出測試請求：

[object Promise]

如需完整範例，請參閱以下樣本：
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)：要測試的範例伺服器。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e)：包含用於設定測試伺服器的輔助類別和函數。