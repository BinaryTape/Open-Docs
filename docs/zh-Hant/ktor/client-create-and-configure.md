[//]: # (title: 建立並配置客戶端)

<show-structure for="chapter" depth="2"/>

<link-summary>學習如何建立和配置 Ktor 客戶端。</link-summary>

在新增 [客戶端依賴項](client-dependencies.md) 後，您可以透過建立 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 類別實例並傳入一個 [引擎](client-engines.md) 作為參數來實例化客戶端：

[object Promise]

在此範例中，我們使用 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。
您也可以省略引擎：

[object Promise]

在這種情況下，客戶端將根據 [建置腳本中新增](client-dependencies.md#engine-dependency) 的構件自動選擇一個引擎。您可以從 [](client-engines.md#default) 文件章節了解客戶端如何選擇引擎。

## 配置客戶端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置客戶端，您可以向客戶端建構函式傳入一個額外的函數參數。
[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) 類別是用於配置客戶端的基本類別。
例如，您可以使用 `expectSuccess` 屬性啟用 [回應驗證](client-response-validation.md)：

[object Promise]

### 引擎配置 {id="engine-config"}
您可以使用 `engine` 函數來配置引擎：

[object Promise]

更多詳細資訊請參閱 [引擎](client-engines.md) 章節。

### 插件 {id="plugins"}
要安裝插件，您需要將其傳遞到 [客戶端配置區塊](#configure-client) 內的 `install` 函數中。例如，您可以透過安裝 [Logging](client-logging.md) 插件來記錄 HTTP 呼叫：

[object Promise]

您也可以在 `install` 區塊內配置插件。例如，對於 [Logging](client-logging.md) 插件，您可以指定記錄器、記錄層級以及過濾記錄訊息的條件：
[object Promise]

請注意，特定插件可能需要單獨的 [依賴項](client-dependencies.md)。

## 使用客戶端 {id="use-client"}
在您 [新增](client-dependencies.md) 了所有必需的依賴項並建立了客戶端後，您可以使用它來 [發送請求](client-requests.md) 和 [接收回應](client-responses.md)。

## 關閉客戶端 {id="close-client"}

在使用完 HTTP 客戶端後，您需要釋放資源：執行緒、連線以及用於協程的 `CoroutineScope`。為此，請呼叫 `HttpClient.close` 函數：

```kotlin
client.close()
```

請注意，`close` 函數禁止建立新的請求，但不會終止目前活動中的請求。資源只會在所有客戶端請求完成後才釋放。

如果您需要將 `HttpClient` 用於單個請求，請呼叫 `use` 函數，該函數會在執行程式碼區塊後自動呼叫 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 請注意，建立 `HttpClient` 並非一項輕易的操作，在有多個請求的情況下，最好重複使用其實例。