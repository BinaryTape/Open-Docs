[//]: # (title: 在 Ktor Client 中使用 OpenTelemetry 進行分散式追蹤)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>
<var name="plugin_name" value="KtorClientTelemetry"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.opentelemetry.instrumentation:opentelemetry-ktor-3.0</code>
</p>
<var name="example_name" value="opentelemetry"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 與 [OpenTelemetry](https://opentelemetry.io/) 整合 — 這是個用於收集遙測資料（例如追蹤、指標和日誌）的開源可觀察性框架。它提供了一種標準方式來對應用程式進行儀表化，並將資料匯出到 Grafana 或 Jaeger 等監控和可觀察性工具。

`%plugin_name%` 外掛允許您自動追蹤送出的 HTTP 請求。它會擷取諸如方法、URL 和狀態碼等中繼資料，並在服務之間傳播追蹤上下文。您也可以自訂 Span 屬性或使用您自己的 OpenTelemetry 設定。

> 在伺服器端，OpenTelemetry 提供了 [KtorServerTelemetry](server-opentelemetry.md) 外掛，用於對傳入您伺服器的 HTTP 請求進行儀表化。

undefined
undefined

## 安裝 %plugin_name% {id="install_plugin"}

若要安裝 `%plugin_name%` 外掛，請將其傳遞給 [client 配置區塊](client-create-and-configure.md#configure-client) 內部的 `install` 函式，並設定 [已配置的 `OpenTelemetry` 實例](#configure-otel)：

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

您可以自訂 Ktor client 如何記錄和匯出用於送出 HTTP 呼叫的 OpenTelemetry Span。以下選項允許您調整哪些請求被追蹤、Span 如何命名、它們包含哪些屬性、哪些標頭被擷取，以及 Span 類型如何確定。

> 有關這些概念的更多資訊，請參閱 [OpenTelemetry 追蹤文件](https://opentelemetry.io/docs/concepts/signals/traces/)。

undefined
undefined

### 擷取回應標頭

若要將特定的 HTTP 回應標頭擷取為 Span 屬性，請使用 `capturedResponseHeaders` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedResponseHeaders(HttpHeaders.ContentType, CUSTOM_HEADER)
}
```

undefined

## 下一步

一旦您安裝並配置了 `%plugin_name%`，您可以驗證 Span 是否正在被建立和傳播，方法是向一個也啟用了遙測功能的服務傳送請求 — 例如使用 [`KtorServerTelemetry`](server-opentelemetry.md) 的服務。在諸如 [Jaeger](https://www.jaegertracing.io/)、[Zipkin](https://zipkin.io/) 或 [Grafana Tempo](https://grafana.com/oss/tempo/) 等可觀察性後端中檢視追蹤的兩端，將確認分散式追蹤正在端到端地運作。