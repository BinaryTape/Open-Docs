[//]: # (title: 在 Ktor Server 中使用 OpenTelemetry 進行分散式追蹤)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>
<var name="plugin_name" value="KtorServerTelemetry"/>
<var name="package_name" value="io.opentelemetry.instrumentation"/>
<var name="artifact_name" value="opentelemetry-ktor-3.0"/>

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

<snippet id="opentelemetry-description">

Ktor 與 [OpenTelemetry](https://opentelemetry.io/) 整合 — 這是一個開源的可觀測性框架，用於收集
遙測資料，例如追蹤 (traces)、指標 (metrics) 和日誌 (logs)。它提供了一種標準方式來儀器化應用程式並將資料
匯出到 Grafana 或 Jaeger 等監控和可觀測性工具。

</snippet>

`%plugin_name%` 外掛程式在 Ktor 伺服器應用程式中啟用傳入 HTTP 請求的分散式追蹤。它
會自動建立包含路由、HTTP 方法和狀態碼資訊的 [span](https://opentelemetry.io/docs/concepts/signals/traces/#spans)，從傳入請求標頭中提取現有的追蹤上下文 (trace context)，並允許
自訂 span 名稱、屬性 (attributes) 和 span 種類 (span kinds)。

> 在客戶端，OpenTelemetry 提供了 [KtorClientTelemetry](client-opentelemetry.md) 外掛程式，用於收集
> 對外部服務發出 HTTP 呼叫的追蹤。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
</p>

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.opentelemetry.instrumentation:opentelemetry-ktor-3.0:%opentelemetry_version%&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="             &lt;dependencies&gt;&#10;              &lt;dependency&gt;&#10;                &lt;groupId&gt;io.opentelemetry.instrumentation&lt;/groupId&gt;&#10;                &lt;artifactId&gt;opentelemetry-ktor-3.0&lt;/artifactId&gt;&#10;                &lt;version&gt;%opentelemetry_version%&lt;/version&gt;&#10;              &lt;/dependency&gt;&#10;            &lt;/dependencies&gt;"/>
    </TabItem>
</Tabs>

## 配置 OpenTelemetry {id="configure-otel"}

在您的 Ktor 應用程式中安裝 `%plugin_name%` 外掛程式之前，您需要配置並初始化一個
`OpenTelemetry` 實例。此實例負責管理遙測資料，包括追蹤和指標。

### 自動配置

配置 OpenTelemetry 的常見方式是使用
[`AutoConfiguredOpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk-extension-autoconfigure/latest/io/opentelemetry/sdk/autoconfigure/AutoConfiguredOpenTelemetrySdk.html)。
這透過根據系統屬性和環境變數自動配置匯出器 (exporters) 和資源 (resources) 來簡化設定。

您仍然可以自訂自動偵測到的配置 — 例如，透過新增一個 `service.name` 資源
屬性：

```kotlin
package com.example

import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.sdk.autoconfigure.AutoConfiguredOpenTelemetrySdk
import io.opentelemetry.semconv.ServiceAttributes

fun getOpenTelemetry(serviceName: String): OpenTelemetry {

    return AutoConfiguredOpenTelemetrySdk.builder().addResourceCustomizer { oldResource, _ ->
        oldResource.toBuilder()
            .putAll(oldResource.attributes)
            .put(ServiceAttributes.SERVICE_NAME, serviceName)
            .build()
    }.build().openTelemetrySdk
}

```

### 程式化配置

若要在程式碼中定義匯出器、處理器 (processors) 和傳播器 (propagators)，而不是依賴基於環境的配置，您可以使用
[`OpenTelemetrySdk`](https://javadoc.io/doc/io.opentelemetry/opentelemetry-sdk/latest/io/opentelemetry/sdk/OpenTelemetrySdk.html)。

以下範例展示了如何使用 OTLP 匯出器、一個 span 處理器
和一個追蹤上下文傳播器來程式化配置 OpenTelemetry：

```kotlin
import io.opentelemetry.api.OpenTelemetry
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator
import io.opentelemetry.context.propagation.ContextPropagators
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor

fun configureOpenTelemetry(): OpenTelemetry {
    val spanExporter = OtlpGrpcSpanExporter.builder()
        .setEndpoint("http://localhost:4317")
        .build()

    val tracerProvider = SdkTracerProvider.builder()
        .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
        .build()

    return OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
        .buildAndRegisterGlobal()
}
```

如果您需要完全控制遙測設定，或者您的部署環境無法依賴
自動配置，請使用此方法。

> 如需更多資訊，請參閱
> [OpenTelemetry SDK 元件文件](https://opentelemetry.io/docs/languages/java/sdk/#sdk-components)。
>
{style="tip"}

## 安裝 %plugin_name% {id="install_plugin"}

若要將 `%plugin_name%` 外掛程式[安裝](server-plugins.md#install)到應用程式，請在指定的[模組](server-modules.md)中將其傳遞給 `install` 函數，
並設定[已配置的 `OpenTelemetry` 實例](#configure-otel)：

<Tabs>
<TabItem title="embeddedServer">

```kotlin
    import io.ktor.server.engine.*
    import io.ktor.server.netty.*
    import io.ktor.server.application.*
    import %package_name%.*

    fun main() {
        embeddedServer(Netty, port = 8080) {
            val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

            install(%plugin_name%){
                setOpenTelemetry(openTelemetry)
            }
            // ...
        }.start(wait = true)
    }
```
</TabItem>
<TabItem title="module">

```kotlin

    import io.ktor.server.application.*
    import %package_name%.*
    // ...

    fun Application.module() {
        val openTelemetry = getOpenTelemetry(serviceName = "opentelemetry-ktor-sample-server")

        install(%plugin_name%){
            setOpenTelemetry(openTelemetry)
        }
        // ...
    }
```
</TabItem>
</Tabs>

> 確保在安裝任何其他日誌或遙測相關的外掛程式之前安裝 `%plugin_name%`。
>
{style="note"}

## 配置追蹤 {id="configuration"}

您可以自訂 Ktor 伺服器記錄和匯出 OpenTelemetry span 的方式。以下選項可讓您調整
哪些請求被追蹤、span 如何命名、它們包含哪些屬性以及 span 種類如何確定。

> 如需這些概念的更多資訊，請參閱
> [OpenTelemetry 追蹤文件](https://opentelemetry.io/docs/concepts/signals/traces/)。

### 追蹤額外的 HTTP 方法 {id="config-known-methods"}

預設情況下，此外掛程式會追蹤標準 HTTP 方法 (`GET`、`POST`、`PUT` 等)。若要追蹤額外或自訂方法，
請配置 `knownMethods` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    knownMethods(HttpMethod.DefaultMethods + CUSTOM_METHOD)
}
```

### 擷取標頭 {id="config-request-headers"}

若要將特定的 HTTP 請求標頭包含為 span 屬性，請使用 `capturedRequestHeaders` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    capturedRequestHeaders(HttpHeaders.UserAgent)
}
```

### 選擇 span 種類 {id="config-span-kind"}

若要根據請求特性覆寫 span 種類 (例如 `SERVER`、`CLIENT`、`PRODUCER`、`CONSUMER`)，
請使用 `spanKindExtractor` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    spanKindExtractor {
        if (httpMethod == HttpMethod.Post) {
            SpanKind.PRODUCER
        } else {
            SpanKind.CLIENT
        }
    }
}
```

### 新增自訂屬性 {id="config-custom-attributes"}

若要在 span 的開始或結束時附加自訂屬性，請使用 `attributesExtractor` 屬性：

```kotlin
install(%plugin_name%) {
    // ...
    attributesExtractor {
        onStart {
            attributes.put("start-time", System.currentTimeMillis())
        }
        onEnd {
            attributes.put("end-time", Instant.now().toEpochMilli())
        }
    }
}
```

### 額外屬性 {id="additional-properties"}

若要微調整個應用程式的追蹤行為，您還可以配置額外的 OpenTelemetry 屬性，
例如傳播器、屬性限制以及啟用/禁用儀器化。如需更多詳情，請參閱
[OpenTelemetry Java 配置指南](https://opentelemetry.io/docs/languages/java/configuration/)。

## 使用 Grafana LGTM 驗證遙測資料

若要視覺化並驗證您的遙測資料，您可以將追蹤、指標和日誌匯出到分散式追蹤後端，
例如 Grafana。`grafana/otel-lgtm` 一體化映像包含了 [Grafana](https://grafana.com/)、
[Tempo](https://grafana.com/oss/tempo/) (追蹤)、[Loki](https://grafana.com/oss/loki/) (日誌) 和
[Mimir](https://grafana.com/oss/mimir/) (指標)。

### 使用 Docker Compose

建立一個包含以下內容的 **docker-compose.yml** 檔案：

```yaml
services:
  grafana-lgtm:
    image: grafana/otel-lgtm:latest
    ports:
      - "4317:4317"   # OTLP gRPC 接收器 (追蹤、指標、日誌)
      - "4318:4318"   # OTLP HTTP 接收器
      - "3000:3000"   # Grafana 使用者介面
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped
```

若要啟動 Grafana LGTM 一體化容器，請執行以下命令：

```shell
docker compose up -d
```

### 使用 Docker CLI

或者，您可以使用 Docker 命令列直接執行 Grafana：

```shell
docker run -d --name grafana_lgtm \
    -p 4317:4317 \   # OTLP gRPC 接收器 (追蹤、指標、日誌)
    -p 4318:4318 \   # OTLP HTTP 接收器
    -p 3000:3000 \   # Grafana 使用者介面
    -e GF_SECURITY_ADMIN_USER=admin \
    -e GF_SECURITY_ADMIN_PASSWORD=admin \
    grafana/otel-lgtm:latest
```

### 應用程式匯出配置

若要將遙測資料從您的 Ktor 應用程式傳送到 OTLP 端點，請配置 OpenTelemetry SDK 以使用 gRPC
協定。您可以在建構 SDK 之前透過環境變數設定這些值：

```shell
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

或使用 JVM 旗標：

```text
-Dotel.traces.exporter=otlp -Dotel.exporter.otlp.protocol=grpc -Dotel.exporter.otlp.endpoint=http://localhost:4317
```

### 存取 Grafana UI

一旦執行，Grafana UI 將可在 [http://localhost:3000/](http://localhost:3000/) 存取。

<procedure>
    <step>
        在 <a href="http://localhost:3000/">http://localhost:3000/</a> 開啟 Grafana UI。
    </step>
    <step>
        使用預設憑證登入：
        <list>
            <li><ui-path>使用者：</ui-path><code>admin</code></li>
            <li><ui-path>密碼：</ui-path><code>admin</code></li>
        </list>
    </step>
    <step>
        在左側導覽選單中，前往 <ui-path>鑽取 (Drilldown) → 追蹤 (Traces)</ui-path>：
        <img src="opentelemetry-grafana-ui.png" alt="Grafana UI Drilldown traces view" width="706" corners="rounded"/>
        進入 <ui-path>追蹤 (Traces)</ui-path> 視圖後，您可以：
        <list>
            <li>選擇費率 (Rate)、錯誤 (Errors) 或持續時間 (Duration) 指標。</li>
            <li>應用 span 篩選器 (例如，依服務名稱或 span 名稱) 以縮小您的資料範圍。</li>
            <li>檢視追蹤、檢查詳細資訊並與 span 時間軸互動。</li>
        </list>
    </step>
</procedure>