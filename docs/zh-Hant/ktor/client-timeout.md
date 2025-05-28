[//]: # (title: 逾時)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-timeout"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpTimeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout) 外掛程式讓您可以配置以下逾時設定：
* __請求逾時__ — 處理 HTTP 呼叫所需的時間，從傳送請求到接收回應為止。
* __連線逾時__ — 用戶端與伺服器建立連線所需的時間。
* __通訊端逾時__ — 與伺服器交換資料時，兩個資料封包之間的最大非活動時間。

您可以為所有請求或僅為特定請求指定這些逾時。

## 新增相依性 {id="add_dependencies"}
`HttpTimeout` 只需要 `[ktor-client-core](client-dependencies.md)` 構件，不需要任何特定的相依性。

## 安裝 HttpTimeout {id="install_plugin"}

要安裝 `HttpTimeout`，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內將其傳遞給 `install` 函數：
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

要配置逾時，您可以使用相應的屬性：

* [requestTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/request-timeout-millis.html)
  指定整個 HTTP 呼叫的逾時，從傳送請求到接收回應為止。
* [connectTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/connect-timeout-millis.html)
  指定與伺服器建立連線的逾時。
* [socketTimeoutMillis](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-timeout-config/socket-timeout-millis.html)
  指定與伺服器交換資料時，兩個資料封包之間的最大非活動時間的逾時。

您可以在 `install` 區塊內為所有請求指定逾時。下方的程式碼範例展示如何使用 `requestTimeoutMillis` 設定請求逾時：
```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="17-21"}

如果您需要僅為特定請求設定逾時，請使用 [HttpRequestBuilder.timeout](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/timeout.html) 屬性：

```kotlin
```
{src="/snippets/client-timeout/src/main/kotlin/com/example/Application.kt" include-lines="24-28"}

請注意，為特定請求指定的逾時會覆寫 `install` 區塊中的全域逾時。

如果發生逾時，Ktor 會拋出 `HttpRequestTimeoutException`、`ConnectTimeoutException` 或 `SocketTimeoutException`。

## 限制 {id="limitations"}

`HttpTimeout` 對於特定的 `[引擎](client-engines.md)` 存在一些限制。下表顯示了這些引擎支援的逾時類型：

| 引擎                             | 請求逾時 | 連線逾時 | 通訊端逾時 |
|------------------------------------|-----------------|-----------------|----------------|
| [Darwin](client-engines.md#darwin) | ✅️              | ✖️              | ✅️             |
| [JavaScript](client-engines.md#js) | ✅               | ✖️              | ✖️             |
| [Curl](client-engines.md#curl)     | ✅               | ✅️              | ✖️             |
| [MockEngine](client-testing.md)    | ✅               | ✖️              | ✅              |