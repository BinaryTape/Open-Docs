[//]: # (title: 在 Ktor 用戶端使用 OpenTelemetry 進行分散式追蹤)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>必要相依性</b>：<code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 與 [OpenTelemetry](https://opentelemetry.io/) 整合 — 這是一個開源的可觀測性框架，用於收集追蹤 (traces)、指標 (metrics) 和記錄 (logs) 等遙測資料。它提供了一種標準化的方式來對應用程式進行檢測，並將資料匯出到 Grafana 或 Jaeger 等監控與可觀測性工具。

`%plugin_name%` 外掛程式可讓您自動追蹤傳出的 HTTP 請求。它會擷取方法 (method)、URL 和狀態碼等元資料，並在服務之間傳遞追蹤上下文。您還可以自訂 span 屬性或使用自己的 OpenTelemetry 配置。

> 在伺服器端，OpenTelemetry 提供了 [KtorServerTelemetry](server-opentelemetry.md) 外掛程式，用於對進入伺服器的 HTTP 請求進行檢測。

## 安裝 %plugin_name% {id="install_plugin"}

要安裝 `%plugin_name%` 外掛程式，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式，並設定 [已配置的 `OpenTelemetry` 執行個體](#configure-otel)：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...

val client = HttpClient(CIO) {
    val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-client")

    install(%plugin_name%) {
        setOpenTelemetry(openTelemetry)
    }
}
```

## 配置追蹤

您可以自訂 Ktor 用戶端如何記錄和匯出傳出 HTTP 呼叫的 OpenTelemetry span。以下選項允許您調整哪些請求被追蹤、span 如何命名、它們包含哪些屬性、擷取哪些標頭，以及如何決定 span 類型。

> 如需有關這些概念的更多資訊，請參閱 [OpenTelemetry 追蹤文件](https://opentelemetry.io/docs/concepts/signals/traces/)。

### 擷取回應標頭

若要將特定的 HTTP 回應標頭擷取為 span 屬性，請使用 `capturedResponseHeaders` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

## 後續步驟

安裝並配置好 `%plugin_name%` 後，您可以透過向同樣啟用了遙測功能的服務（例如使用 [`KtorServerTelemetry`](server-opentelemetry.md) 的服務）發送請求，來驗證 span 是否正在建立和傳遞。在 [Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/) 或 [Grafana Tempo](https://grafana.com/oss/tempo/) 等可觀測性後端查看追蹤的兩端，即可確認分散式追蹤是否正在端到端運作。