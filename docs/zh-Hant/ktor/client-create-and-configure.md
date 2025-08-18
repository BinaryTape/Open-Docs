[//]: # (title: 建立和設定客戶端)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何建立和設定 Ktor 客戶端。</link-summary>

在新增 [客戶端依賴](client-dependencies.md) 後，您可以透過建立 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 類別實例並傳遞一個 [引擎](client-engines.md) 作為參數來實例化客戶端：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

在此範例中，我們使用 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。
您也可以省略引擎：

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

在此情況下，客戶端將根據 [建置腳本中新增](client-dependencies.md#engine-dependency) 的構件自動選擇一個引擎。您可以從 [預設引擎](client-engines.md#default) 文件部分了解客戶端如何選擇引擎。

## 設定客戶端 {id="configure-client"}

### 基本設定 {id="basic-config"}

若要設定客戶端，您可以將額外的函式參數傳遞給客戶端建構函式。
[HttpClientConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client-config/index.html) 類別是設定客戶端的基礎類別。
例如，您可以使用 `expectSuccess` 屬性啟用 [回應驗證](client-response-validation.md)：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

### 引擎設定 {id="engine-config"}
您可以使用 `engine` 函式設定引擎：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    engine {
        // Configure an engine
    }
}
```

有關其他詳細資訊，請參閱 [引擎](client-engines.md) 部分。

### 外掛程式 {id="plugins"}
若要安裝外掛程式，您需要將其傳遞給 [客戶端設定區塊](#configure-client) 內的 `install` 函式。例如，您可以透過安裝 [Logging](client-logging.md) 外掛程式來記錄 HTTP 呼叫：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

您也可以在 `install` 區塊內設定外掛程式。例如，對於 [Logging](client-logging.md) 外掛程式，您可以指定記錄器、記錄級別和篩選記錄訊息的條件：
```kotlin
val client = HttpClient(CIO) {
    install(Logging) {
        logger = Logger.DEFAULT
        level = LogLevel.HEADERS
        filter { request ->
            request.url.host.contains("ktor.io")
        }
        sanitizeHeader { header -> header == HttpHeaders.Authorization }
    }
}
```

請注意，特定的外掛程式可能需要單獨的 [依賴](client-dependencies.md)。

## 使用客戶端 {id="use-client"}
在您 [新增](client-dependencies.md) 所有必要的依賴並建立客戶端後，您可以使用它來 [發出請求](client-requests.md) 並 [接收回應](client-responses.md)。

## 關閉客戶端 {id="close-client"}

在您完成使用 HTTP 客戶端後，您需要釋放資源：執行緒、連線和用於協程的 `CoroutineScope`。為此，請呼叫 `HttpClient.close` 函式：

```kotlin
client.close()
```

請注意，`close` 函式禁止建立新請求，但不會終止目前活躍的請求。資源只會在所有客戶端請求完成後才會被釋放。

如果您需要將 `HttpClient` 用於單一請求，請呼叫 `use` 函式，它會在執行程式碼區塊後自動呼叫 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 請注意，建立 `HttpClient` 並非廉價操作，在有多個請求的情況下最好重複使用其實例。