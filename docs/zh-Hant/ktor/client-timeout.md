[//]: # (title: 逾時)

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

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) 插件允許您配置以下逾時：
* __請求逾時__ — 處理 HTTP 呼叫所需的時間週期：從傳送請求到接收回應。
* __連線逾時__ — 用戶端應與伺服器建立連線的時間週期。
* __Socket 逾時__ — 與伺服器交換資料時，兩個資料封包之間的最大非活動時間。

您可以為所有請求或僅特定請求指定這些逾時。

## 新增相依性 {id="add_dependencies"}
`HttpTimeout` 僅需要 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的相依性。

## 安裝 HttpTimeout {id="install_plugin"}

要安裝 `HttpTimeout`，請在[用戶端配置區塊](client-create-and-configure.md#configure-client)內的 `install` 函數中傳遞它：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(HttpTimeout)
}
```

## 配置逾時 {id="configure_plugin"}

要配置逾時，您可以使用對應的屬性：

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  指定了整個 HTTP 呼叫的逾時，從傳送請求到接收回應。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  指定了與伺服器建立連線的逾時。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  指定了與伺服器交換資料時，兩個資料封包之間的最大非活動時間逾時。

您可以在 `install` 區塊內為所有請求指定逾時。下面的程式碼範例展示了如何使用 `requestTimeoutMillis` 設定請求逾時：
```kotlin
val client = HttpClient(CIO) {
    install(HttpTimeout) {
        requestTimeoutMillis = 1000
    }
}
```

如果您只需要為特定請求設定逾時，請使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) 屬性：

```kotlin
val response: HttpResponse = client.get("http://0.0.0.0:8080/path1") {
    timeout {
        requestTimeoutMillis = 3000
    }
}
```

請注意，為特定請求指定的逾時會覆寫 `install` 區塊中的全域逾時。

在逾時的情況下，Ktor 會拋出 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 對於特定的[引擎](client-engines.md)有一些限制。下表顯示了這些引擎支援哪些逾時：

| 引擎                             | 請求逾時 | 連線逾時 | Socket 逾時 |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |