[//]: # (title: 建立與配置用戶端)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何建立與配置 Ktor 用戶端。</link-summary>

在新增 [用戶端相依性](client-dependencies.md) 後，您可以透過建立 [HttpClient](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client/index.html) 類別執行個體並傳遞 [引擎](client-engines.md) 作為參數，來將用戶端具現化：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

在此範例中，我們使用 [CIO](https://api.ktor.io/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 引擎。
您也可以省略引擎：

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

在這種情況下，用戶端會根據 [在組建指令碼中新增](client-dependencies.md#engine-dependency) 的構件自動選擇引擎。您可以從 [預設引擎](client-engines.md#default) 文件章節了解用戶端如何選擇引擎。

## 配置用戶端 {id="configure-client"}

### 基本配置 {id="basic-config"}

要配置用戶端，您可以向用戶端建構函式傳遞一個額外的功能性參數。 
[HttpClientConfig](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client-config/index.html) 類別是配置用戶端的基底類別。 
例如，您可以使用 `expectSuccess` 屬性來啟用 [回應驗證](client-response-validation.md)：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    expectSuccess = true
}
```

### 引擎配置 {id="engine-config"}
您可以使用 `engine` 函式來配置引擎：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO) {
    engine {
        // 配置引擎
    }
}
```

如需更多詳細資訊，請參閱 [引擎](client-engines.md) 章節。

### 外掛程式 {id="plugins"}
要安裝外掛程式，您需要將其傳遞給 [用戶端配置區塊](#configure-client) 內的 `install` 函式。例如，您可以透過安裝 [Logging](client-logging.md) 外掛程式來記錄 HTTP 呼叫：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

您也可以在 `install` 區塊內配置外掛程式。例如，對於 [Logging](client-logging.md) 外掛程式，您可以指定記錄器、記錄層級以及篩選日誌訊息的條件：
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

請注意，特定的外掛程式可能需要個別的 [相依性](client-dependencies.md)。

## 使用用戶端 {id="use-client"}
在您 [新增](client-dependencies.md) 了所有必要的相依性並建立了用戶端之後，您可以使用它來 [發送請求](client-requests.md) 並 [接收回應](client-responses.md)。 

## 關閉用戶端 {id="close-client"}

當您完成 HTTP 用戶端的工作後，需要釋放資源：執行緒、連線以及用於協同程式的 `CoroutineScope`。要執行此操作，請呼叫 `HttpClient.close` 函式：

```kotlin
client.close()
```

請注意，`close` 函式會禁止建立新請求，但不會終止目前作用中的請求。資源僅在所有用戶端請求完成後才會釋放。

如果您需要將 `HttpClient` 用於單次請求，請呼叫 `use` 函式，它會在執行程式碼區塊後自動呼叫 `close`：

```kotlin
val status = HttpClient().use { client ->
    // ...
}
```

> 請注意，建立 `HttpClient` 並非低開銷的操作，在有多個請求的情況下，最好重複使用其執行個體。