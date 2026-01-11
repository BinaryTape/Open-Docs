# OpenTelemetry 支援

本頁詳細介紹了 Koog 代理框架對 OpenTelemetry 的支援，用於追蹤和監控您的 AI 代理。

## 概述

OpenTelemetry 是一個可觀測性框架，提供工具用於從您的應用程式產生、收集和匯出遙測資料 (追蹤)。Koog 的 OpenTelemetry 功能允許您為您的 AI 代理加入檢測，以收集遙測資料，這可以幫助您：

- 監控代理效能與行為
- 調試複雜代理工作流程中的問題
- 可視化代理的執行流程
- 追蹤 LLM 呼叫和工具使用
- 分析代理行為模式

## OpenTelemetry 關鍵概念

- **Span**：Span 代表分散式追蹤中的獨立工作單元或操作。它們指示應用程式中特定活動的開始與結束，例如代理執行、函式呼叫、LLM 呼叫或工具呼叫。
- **Attribute**：Attribute 提供關於遙測相關項目（例如 Span）的元資料。Attribute 以鍵值對的形式表示。
- **Event**：Event 是 Span 生命週期中在特定時間點發生的事件（與 Span 相關的事件），代表了可能值得注意的事情。
- **Exporter**：Exporter 是負責將已收集的遙測資料發送到各種後端或目的地的元件。
- **Collector**：Collector 接收、處理和匯出遙測資料。它們在您的應用程式和您的可觀測性後端之間充當中介者。
- **Sampler**：Sampler 根據採樣策略決定是否應記錄追蹤。它們用於管理遙測資料的量。
- **Resource**：Resource 代表產生遙測資料的實體。它們由 Resource Attribute 識別，Resource Attribute 是提供關於 Resource 資訊的鍵值對。

Koog 中的 OpenTelemetry 功能會自動為各種代理事件建立 Span，包括：

- 代理執行開始與結束
- 節點執行
- LLM 呼叫
- 工具呼叫

## 安裝

若要在 Koog 中使用 OpenTelemetry，請將 OpenTelemetry 功能添加到您的代理中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
            // Configuration options go here
        }
    }
)
```
<!--- KNIT example-opentelemetry-support-01.kt -->

## 配置

### 基本配置

以下是為代理配置 OpenTelemetry 功能時可設定的可用屬性完整列表：

| 名稱             | 資料型別          | 預設值                | 描述                                                                  |
|------------------|--------------------|------------------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`                    | 被檢測服務的名稱。                                                          |
| `serviceVersion` | `String`           | 目前的 Koog 函式庫版本 | 被檢測服務的版本。                                                          |
| `isVerbose`      | `Boolean`          | `false`                      | 是否啟用詳細日誌記錄以調試 OpenTelemetry 配置。                             |
| `sdk`            | `OpenTelemetrySdk` |                              | 用於遙測資料收集的 OpenTelemetry SDK 實例。                                |
| `tracer`         | `Tracer`           |                              | 用於建立 Span 的 OpenTelemetry Tracer 實例。                               |

!!! note
    `sdk` 和 `tracer` 屬性是您可以存取的公共屬性，但您只能使用下方列出的公共方法來設定它們。

`OpenTelemetryConfig` 類別還包含代表與不同配置項目相關動作的方法。以下是使用一組基本配置項目安裝 OpenTelemetry 功能的範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
}
```
<!--- KNIT example-opentelemetry-support-02.kt -->

有關可用方法的參考，請參閱以下章節。

#### setServiceInfo

設定服務資訊，包括名稱和版本。接受以下引數：

| 名稱               | 資料型別 | 必需 | 預設值 | 描述                                                 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | 是       |               | 被檢測服務的名稱。                                          |
| `serviceVersion`   | String    | 是       |               | 被檢測服務的版本。                                          |

#### addSpanExporter

添加一個 Span Exporter，用於將遙測資料發送到外部系統。接受以下引數：

| 名稱       | 資料型別      | 必需 | 預設值 | 描述                                                                   |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | 是       |               | 要添加到自訂 Span Exporter 列表中的 `SpanExporter` 實例。 |

#### addSpanProcessor

添加一個 Span Processor 工廠，用於在匯出 Span 之前處理它們。接受以下引數：

| 名稱        | 資料型別                         | 必需 | 預設值 | 描述                                                                                   |
|-------------|-----------------------------------|----------|---------------|----------------------------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 是       |               | 一個函式，用於為給定的 Exporter 建立 Span Processor。它允許您為每個 Exporter 自訂處理過程。 |

#### addResourceAttributes

添加 Resource Attribute 以提供關於服務的額外上下文。接受以下引數：

| 名稱         | 資料型別                 | 必需 | 預設值 | 描述                                                            |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 是       |               | 提供關於服務額外細節的鍵值對。                                         |

#### setSampler

設定採樣策略以控制哪些 Span 被收集。接受以下引數：

| 名稱      | 資料型別 | 必需 | 預設值 | 描述                                                      |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | 是       |               | 要為 OpenTelemetry 配置設定的 Sampler 實例。                      |

#### setVerbose

啟用或禁用詳細日誌記錄。接受以下引數：

| 名稱      | 資料型別 | 必需 | 預設值 | 描述                                                     |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | 是       | `false`       | 如果為 true，應用程式會收集更詳細的遙測資料。 |

!!! note
    OpenTelemetry Span 的某些內容預設會被遮罩，出於安全原因。例如，LLM 訊息會被遮罩為 `HIDDEN:non-empty`，而不是實際訊息內容。若要取得內容，請將 `verbose` 引數的值設定為 `true`。

#### setSdk

注入預先配置的 OpenTelemetrySdk 實例。

- 當您呼叫 `setSdk(sdk)` 時，所提供的 SDK 會按原樣使用，並且透過 `addSpanExporter`、`addSpanProcessor`、`addResourceAttributes` 或 `setSampler` 應用的任何自訂配置都將被忽略。
- Tracer 的檢測範圍名稱/版本會與您的服務資訊對齊。

| 名稱 | 資料型別         | 必需 | 描述                           |
|------|-------------------|----------|---------------------------------------|
| `sdk`| `OpenTelemetrySdk`| 是       | 要在代理中使用的 SDK 實例。 |

### 進階配置

對於更進階的配置，您還可以自訂以下配置選項：

- Sampler：配置採樣策略以調整收集資料的頻率和數量。
- Resource Attribute：添加更多關於產生遙測資料的程序的資訊。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.sdk.trace.samplers.Sampler

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Set your service configuration
    setServiceInfo("my-agent-service", "1.0.0")
    
    // Add the Logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    
    // Set the sampler 
    setSampler(Sampler.traceIdRatioBased(0.5)) 

    // Add resource attributes
    addResourceAttributes(mapOf(
        AttributeKey.stringKey("custom.attribute") to "custom-value")
    )
}
```
<!--- KNIT example-opentelemetry-support-03.kt -->

#### Sampler

若要定義 Sampler，請使用 `opentelemetry-java` SDK 中 `Sampler` 類別 (`io.opentelemetry.sdk.trace.samplers.Sampler`) 的對應方法，該方法代表您想要使用的採樣策略。

預設採樣策略如下：

- `Sampler.alwaysOn()`：預設採樣策略，其中每個 Span (追蹤) 都會被採樣。

有關可用 Sampler 和採樣策略的更多資訊，請參閱 OpenTelemetry [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 文件。

#### Resource Attribute

Resource Attribute 代表關於產生遙測資料的程序的額外資訊。Koog 包含一組預設設定的 Resource Attribute：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` Attribute 的預設值為 `ai.koog`，而預設的 `service.version` 值是目前使用的 Koog 函式庫版本。

除了預設的 Resource Attribute 外，您還可以添加自訂 Attribute。要在 Koog 的 OpenTelemetry 配置中添加自訂 Attribute，請使用 OpenTelemetry 配置中的 `addResourceAttributes()` 方法，該方法接受一個鍵和一個值作為其引數。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.api.common.AttributeKey

const val apiKey = "api-key"
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    installFeatures = {
        install(OpenTelemetry) {
-->
<!--- SUFFIX
        }
    }
)
-->
```kotlin
addResourceAttributes(mapOf(
    AttributeKey.stringKey("custom.attribute") to "custom-value")
)
```
<!--- KNIT example-opentelemetry-support-04.kt -->

## Span 類型和屬性

OpenTelemetry 功能會自動建立不同類型的 Span，以追蹤代理中的各種操作：

- **CreateAgentSpan**：在您運行代理時建立，在代理關閉或程序終止時關閉。
- **InvokeAgentSpan**：代理的調用。
- **StrategySpan**：代理策略的執行（頂層執行流程）。
- **NodeExecuteSpan**：代理策略中節點的執行。這是一個自訂的、Koog 特定的 Span。
- **SubgraphExecuteSpan**：代理策略中子圖的執行。這是一個自訂的、Koog 特定的 Span。
- **InferenceSpan**：LLM 呼叫。
- **ExecuteToolSpan**：工具呼叫。

Span 以巢狀的、階層式的結構組織。以下是一個 Span 結構的範例：

```text
CreateAgentSpan
    InvokeAgentSpan
        StrategySpan
            NodeExecuteSpan
                InferenceSpan
            NodeExecuteSpan
                ExecuteToolSpan
            SubgraphExecuteSpan
                NodeExecuteSpan
                    InferenceSpan
```

### Span Attribute

Span Attribute 提供與 Span 相關的元資料。每個 Span 都有其自己的一組 Attribute，而某些 Span 也可以重複 Attribute。

Koog 支援一組預定義的 Attribute，這些 Attribute 遵循 OpenTelemetry 的 [生成式 AI 事件語義約定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)。例如，約定定義了一個名為 `gen_ai.conversation.id` 的 Attribute，這通常是 Span 的必需 Attribute。在 Koog 中，此 Attribute 的值是代理運行 (run) 的唯一識別碼，在您呼叫 `agent.run()` 方法時自動設定。

此外，Koog 還包含自訂的、Koog 特定的 Attribute。您可以透過 `koog.` 前綴識別這些 Attribute 中的大多數。以下是可用的自訂 Attribute：

- `koog.strategy.name`：代理策略的名稱。策略是一個與 Koog 相關的實體，描述代理的目的。用於 `StrategySpan` Span。
- `koog.node.id`：正在執行的節點的識別碼 (名稱)。用於 `NodeExecuteSpan` Span。
- `koog.node.input`：在執行開始時傳遞給節點的輸入。當節點開始時出現在 `NodeExecuteSpan` 上。
- `koog.node.output`：節點完成時產生的輸出。當節點成功完成時出現在 `NodeExecuteSpan` 上。
- `koog.subgraph.id`：正在執行的子圖的識別碼 (名稱)。用於 `SubgraphExecuteSpan` Span。
- `koog.subgraph.input`：在執行開始時傳遞給子圖的輸入。當子圖開始時出現在 `SubgraphExecuteSpan` 上。
- `koog.subgraph.output`：子圖完成時產生的輸出。當子圖成功完成時出現在 `SubgraphExecuteSpan` 上。

### Event

Span 還可以有一個附加到其上的「Event」。Event 描述了在特定時間點發生的相關事情。例如，當 LLM 呼叫開始或完成時。Event 也具有 Attribute，並且還包含 Event 「主體欄位」。

以下 Event 類型遵循 OpenTelemetry 的 [生成式 AI 事件語義約定](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) 獲得支援：

- **SystemMessageEvent**：傳遞給模型的系統指令。
- **UserMessageEvent**：傳遞給模型的使用者訊息。
- **AssistantMessageEvent**：傳遞給模型的助手訊息。
- **ToolMessageEvent**：傳遞給模型的來自工具或函式呼叫的回應。
- **ChoiceEvent**：來自模型的回應訊息。
- **ModerationResponseEvent**：模型審核結果或訊號。

!!! note
    `opentelemetry-java` SDK 在添加 Event 時不支援 Event 主體欄位參數。因此，在 Koog 的 OpenTelemetry 支援中，Event 主體欄位是一個單獨的 Attribute，其鍵為 `body` 且值類型為字串。該字串包含 Event 主體欄位的內容或負載，通常是一個類似 JSON 的物件。有關 Event 主體欄位的範例，請參閱 [OpenTelemetry 文件](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有關 `opentelemetry-java` 中 Event 主體欄位支援狀態，請參閱相關的 [GitHub issue](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## Exporter

Exporter 將收集到的遙測資料發送到 OpenTelemetry Collector 或其他類型的目的地或後端實作。若要添加 Exporter，請在安裝 OpenTelemetry 功能時使用 `addSpanExporter()` 方法。該方法接受以下引數：

| 名稱       | 資料型別    | 必需 | 預設 | 描述                                                                 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | 是       |         | 要添加到自訂 Span Exporter 列表中的 `SpanExporter` 實例。 |

以下章節提供了關於 `opentelemetry-java` SDK 中一些最常用 Exporter 的資訊。

!!! note
    如果您未配置任何自訂 Exporter，Koog 將預設使用主控台 LoggingSpanExporter。這有助於本地開發和調試。

### 日誌 Exporter

將追蹤資訊輸出到控制台的日誌 Exporter。`LoggingSpanExporter` 
(`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

這種匯出類型對於開發和調試目的非常有用。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    // Add the logging exporter
    addSpanExporter(LoggingSpanExporter.create())
    // Add more exporters as needed
}
```
<!--- KNIT example-opentelemetry-support-05.kt -->

### OpenTelemetry HTTP Exporter

OpenTelemetry HTTP Exporter (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK 
(`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，透過 HTTP 將 Span 資料發送到後端。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import java.util.concurrent.TimeUnit

const val apiKey = ""
const val AUTH_STRING = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry HTTP exporter 
   addSpanExporter(
      OtlpHttpSpanExporter.builder()
         // Set the maximum time to wait for the collector to process an exported batch of spans 
         .setTimeout(30, TimeUnit.SECONDS)
         // Set the OpenTelemetry endpoint to connect to
         .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
         // Add the authorization header
         .addHeader("Authorization", "Basic $AUTH_STRING")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-06.kt -->

### OpenTelemetry gRPC Exporter

OpenTelemetry gRPC Exporter (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK 
(`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它透過 gRPC 將遙測資料匯出到後端，並允許您定義接收資料的後端、Collector 或端點的主機和連接埠。預設連接埠為 `4317`。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
   // Add OpenTelemetry gRPC exporter 
   addSpanExporter(
      OtlpGrpcSpanExporter.builder()
          // Set the host and the port
         .setEndpoint("http://localhost:4317")
         .build()
   )
}
```
<!--- KNIT example-opentelemetry-support-07.kt -->

## 與 Langfuse 整合

Langfuse 為 LLM/代理工作負載提供追蹤視覺化和分析。

您可以配置 Koog，使用輔助函式將 OpenTelemetry 追蹤直接匯出到 Langfuse：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    addLangfuseExporter(
        langfuseUrl = "https://cloud.langfuse.com",
        langfusePublicKey = "...",
        langfuseSecretKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-08.kt -->

請參閱關於與 Langfuse 整合的 [完整文件](opentelemetry-langfuse-exporter.md)。

## 與 W&B Weave 整合

W&B Weave 為 LLM/代理工作負載提供追蹤視覺化和分析。與 W&B Weave 的整合可以透過預定義的 Exporter 進行配置：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    addWeaveExporter(
        weaveOtelBaseUrl = "https://trace.wandb.ai",
        weaveEntity = "my-team",
        weaveProjectName = "my-project",
        weaveApiKey = "..."
    )
}
```
<!--- KNIT example-opentelemetry-support-09.kt -->

請參閱關於與 W&B Weave 整合的 [完整文件](opentelemetry-weave-exporter.md)。

## 與 Jaeger 整合

Jaeger 是一個流行的分散式追蹤系統，可與 OpenTelemetry 協同工作。Koog 儲存庫中 `examples` 目錄下的 `opentelemetry` 目錄包含一個將 OpenTelemetry 與 Jaeger 和 Koog 代理一起使用的範例。

### 先決條件

若要測試 OpenTelemetry 與 Koog 和 Jaeger 的整合，請使用提供的 `docker-compose.yaml` 檔案，執行以下命令來啟動 Jaeger OpenTelemetry 一體化程序：

```bash
docker compose up -d
```

提供的 Docker Compose YAML 檔案包含以下內容：

```yaml
# docker-compose.yaml
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:1.39
    container_name: jaeger-all-in-one
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "4317:4317"
      - "16686:16686"
```

若要存取 Jaeger UI 並查看您的追蹤，請開啟 `http://localhost:16686`。

### 範例

若要匯出遙測資料以在 Jaeger 中使用，此範例使用 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` 
(`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 和 `OtlpGrpcSpanExporter` 
(`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

以下是完整的程式碼範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.utils.io.use
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "open-ai-api-key"

-->
```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(openAIApiKey),
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // Add a console logger for local debugging
                addSpanExporter(LoggingSpanExporter.create())

                // Send traces to OpenTelemetry collector
                addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                )
            }
        }

        agent.use { agent ->
            println("Running the agent with OpenTelemetry tracing...")

            val result = agent.run("Tell me a joke about programming")

            println("Agent run completed with result: '$result'." +
                    "
Check Jaeger UI at http://localhost:16686 to view traces")
        }
    }
}
```
<!--- KNIT example-opentelemetry-support-10.kt -->

## 疑難排解

### 常見問題

1.  **Jaeger、Langfuse 或 W&B Weave 中沒有出現追蹤**
    -   確保服務正在運行，並且 OpenTelemetry 連接埠 (4317) 可存取。
    -   檢查 OpenTelemetry Exporter 是否配置了正確的端點。
    -   確保在代理執行後等待幾秒鐘，以便追蹤匯出。

2.  **Span 缺失或不完整追蹤**
    -   驗證代理執行是否成功完成。
    -   確保您沒有在代理執行後過快關閉應用程式。
    -   在代理執行後添加延遲，以便為 Span 匯出留出時間。

3.  **過多的 Span 數量**
    -   考慮透過配置 `sampler` 屬性來使用不同的採樣策略。
    -   例如，使用 `Sampler.traceIdRatioBased(0.1)` 來僅採樣 10% 的追蹤。

4.  **Span 適配器相互覆蓋**
    -   目前，OpenTelemetry 代理功能不支援應用多個 Span 適配器 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。