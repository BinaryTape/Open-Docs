[//]: # (title: 超時)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) 外掛程式允許您設定以下超時：
* __請求超時__ — 處理 HTTP 呼叫所需的時間段：從傳送請求到接收回應。
* __連線超時__ — 客戶端應與伺服器建立連線的時間段。
* __通訊端超時__ — 與伺服器交換資料時兩個資料封包之間的最大閒置時間。

您可以為所有請求或僅特定請求指定這些超時。

## 新增相依性 {id="add_dependencies"}
`HttpTimeout` 只需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定相依性。

## 安裝 HttpTimeout {id="install_plugin"}

若要安裝 `HttpTimeout`，請將其傳遞給 [客戶端設定區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 設定超時 {id="configure_plugin"}

若要設定超時，您可以使用對應的屬性：

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  指定整個 HTTP 呼叫的超時，從傳送請求到接收回應。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  指定與伺服器建立連線的超時。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  指定與伺服器交換資料時，兩個資料封包之間的最大閒置時間的超時。

您可以在 `install` 區塊內為所有請求指定超時。下面的程式碼範例展示如何使用 `requestTimeoutMillis` 設定請求超時：
[object Promise]

如果您只需要為特定請求設定超時，請使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) 屬性：

[object Promise]

請注意，為特定請求指定的超時會覆寫來自 `install` 區塊的全域超時。

在超時的情況下，Ktor 會擲回 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 對於特定 [引擎](client-engines.md) 有一些限制。下表顯示了這些引擎支援哪些超時：

| 引擎                             | 請求超時        | 連線超時        | 通訊端超時     |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |