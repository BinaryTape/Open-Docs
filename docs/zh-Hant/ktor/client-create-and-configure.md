[//]: # (title: 建立與配置客戶端)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何建立與配置 Ktor 客戶端。</link-summary>

在新增了[客戶端依賴項](client-dependencies.md)後，您可以透過建立 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 類別實例並傳遞一個[引擎](client-engines.md)作為參數來實例化客戶端：

```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

在此範例中，我們使用 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。您也可以省略引擎：

```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

在這種情況下，客戶端將根據[新增到建置腳本中](client-dependencies.md#engine-dependency)的構件 (artifacts) 自動選擇一個引擎。您可以從 [](client-engines.md#default) 文件章節中了解客戶端如何選擇引擎。

## 配置客戶端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置客戶端，您可以將一個額外的函數參數傳遞給客戶端建構函數。[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) 類別是用於配置客戶端的基礎類別。例如，您可以使用 `expectSuccess` 屬性來啟用[回應驗證](client-response-validation.md)：

```kotlin
```
{src="snippets/_misc_client/BasicClientConfig.kt"}

### 引擎配置 {id="engine-config"}
您可以使用 `engine` 函數配置一個引擎：

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfig.kt"}

請參閱[引擎 (Engines)](client-engines.md) 章節以獲取更多詳細資訊。

### 外掛程式 {id="plugins"}
要安裝外掛程式，您需要將其傳遞給 [客戶端配置區塊](#configure-client)內的 `install` 函數。例如，您可以透過安裝 [Logging](client-logging.md) 外掛程式來記錄 HTTP 呼叫：

```kotlin
```
{src="snippets/_misc_client/InstallLoggingPlugin.kt"}

您也可以在 `install` 區塊內配置外掛程式。例如，對於 [Logging](client-logging.md) 外掛程式，您可以指定記錄器 (logger)、記錄級別 (logging level) 和過濾記錄訊息的條件：
```kotlin
```
{src="snippets/client-logging/src/main/kotlin/com/example/Application.kt" include-lines="13-22"}

請注意，特定外掛程式可能需要單獨的[依賴項](client-dependencies.md)。

## 使用客戶端 {id="use-client"}
在您[新增](client-dependencies.md)了所有必要的依賴項並建立客戶端之後，您可以使用它來[發出請求](client-requests.md)並[接收回應](client-responses.md)。

## 關閉客戶端 {id="close-client"}

在您完成 HTTP 客戶端的工作後，您需要釋放資源：執行緒 (threads)、連線 (connections) 以及協程 (coroutines) 的 `CoroutineScope`。為此，請呼叫 `HttpClient.close` 函數：

```kotlin
client.close()
```

請注意，`close` 函數禁止建立新的請求，但不會終止當前活躍的請求。資源只會在所有客戶端請求完成後才會釋放。

如果您需要將 `HttpClient` 用於單個請求，請呼叫 `use` 函數，該函數會在執行代碼區塊後自動呼叫 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 請注意，建立 `HttpClient` 並非廉價操作，在有多個請求的情況下，最好重複使用其實例。