# OpenTelemetry 支援

本頁提供有關 Koog agentic 架構支援 OpenTelemetry 的詳細資訊，用於執行緒（tracing）與監視您的 AI 代理。

## 概觀

OpenTelemetry 是一個觀測能力架構，提供用於從應用程式產生、收集與匯出遙測資料（trace）的工具。Koog 的 OpenTelemetry 功能允許您對 AI 代理進行檢測以收集遙測資料，這可以幫助您：

- 監視代理效能與行為
- 在複雜的代理工作流中偵錯問題
- 將代理的執行流程視覺化
- 追蹤 LLM 呼叫與工具使用情況
- 分析代理行為模式

## OpenTelemetry 關鍵概念

- **Span**：span 代表分散式追蹤中的單個工作單元或操作。它們指示應用程式中特定活動的開始與結束，例如代理執行、函式呼叫、LLM 呼叫或工具呼叫。
- **Attribute**：attribute 提供有關遙測相關項目（如 span）的元資料。Attribute 以鍵值對（key-value pairs）形式表示。
- **Event**：event 是 span 生命週期中的特定時間點（與 span 相關的事件），代表發生的某些可能值得注意的事情。
- **Exporter**：exporter 是負責將收集到的遙測資料發送到各種後端或目的地的組件。
- **Collector**：collector 接收、處理並匯出遙測資料。它們充當您的應用程式與觀測能力後端之間的媒介。
- **Sampler**：sampler 根據採樣策略決定是否應記錄追蹤。它們用於管理遙測資料量。
- **Resource**：resource 代表產生遙測資料的實體。它們由 resource attribute 識別，這些 attribute 是提供有關資源資訊的鍵值對。

Koog 中的 OpenTelemetry 功能會自動為各種代理事件建立 span，包括：

- 代理執行開始與結束
- 節點（Node）執行
- LLM 呼叫
- 工具呼叫

## 安裝

要在 Koog 中使用 OpenTelemetry，請將 OpenTelemetry 功能新增至您的代理：

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

以下是在代理中配置 OpenTelemetry 功能時可設定的可用屬性完整清單：

| 名稱             | 資料型別           | 預設值                | 說明                                                                  |
|------------------|--------------------|-----------------------|-----------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`             | 正在檢測的服務名稱。                                                  |
| `serviceVersion` | `String`           | 當前 Koog 程式庫版本 | 正在檢測的服務版本。                                                  |
| `isVerbose`      | `Boolean`          | `false`               | 是否啟用詳細記錄以進行 OpenTelemetry 配置偵錯。                       |
| `sdk`            | `OpenTelemetrySdk` |                       | 用於遙測收集的 OpenTelemetry SDK 執行個體。                           |
| `tracer`         | `Tracer`           |                       | 用於建立 span 的 OpenTelemetry tracer 執行個體。                      |

!!! note
    `sdk` 與 `tracer` 屬性是您可以存取的公開屬性，但您只能使用下面列出的公開方法來設定它們。

`OpenTelemetryConfig` 類別還包含代表與不同配置項目相關操作的方法。以下是使用一組基本配置項目安裝 OpenTelemetry 功能的範例：

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

設定服務資訊，包括名稱與版本。接受以下引數：

| 名稱               | 資料型別 | 是否必填 | 預設值 | 說明                         |
|--------------------|----------|----------|--------|------------------------------|
| `serviceName`      | String   | 是       |        | 正在檢測的服務名稱。         |
| `serviceVersion`   | String   | 是       |        | 正在檢測的服務版本。         |

#### addSpanExporter

新增 span exporter 以將遙測資料發送到外部系統。接受以下引數：

| 名稱       | 資料型別       | 是否必填 | 預設值 | 說明                                                         |
|------------|----------------|----------|--------|--------------------------------------------------------------|
| `exporter` | `SpanExporter` | 是       |        | 要新增到自訂 span exporter 清單中的 `SpanExporter` 執行個體。 |

#### addSpanProcessor

新增 span processor 工廠，在匯出 span 之前對其進行處理。接受以下引數：

| 名稱        | 資料型別                          | 是否必填 | 預設值 | 說明                                                                             |
|-------------|-----------------------------------|----------|--------|----------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 是       |        | 為給定 exporter 建立 span processor 的函式。讓您可以針對每個 exporter 自訂處理。 |

#### addResourceAttributes

新增 resource attribute 以提供有關服務的額外內容。接受以下引數：

| 名稱         | 資料型別                  | 是否必填 | 預設值 | 說明                                           |
|--------------|---------------------------|----------|--------|------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 是       |        | 提供有關服務額外詳細資訊的鍵值對（key-value pairs）。 |

#### setSampler

設定採樣策略以控制收集哪些 span。接受以下引數：

| 名稱      | 資料型別  | 是否必填 | 預設值 | 說明                                         |
|-----------|-----------|----------|--------|----------------------------------------------|
| `sampler` | `Sampler` | 是       |        | 為 OpenTelemetry 配置設定的 sampler 執行個體。 |

#### setVerbose

啟用或停用詳細記錄。接受以下引數：

| 名稱      | 資料型別  | 是否必填 | 預設值  | 說明                                           |
|-----------|-----------|----------|---------|------------------------------------------------|
| `verbose` | `Boolean` | 是       | `false` | 如果為 true，應用程式會收集更詳細的遙測資料。 |

!!! note

    出於安全性原因，OpenTelemetry span 的某些內容預設會被遮罩。例如，LLM 訊息會被遮罩為 `HIDDEN:non-empty` 而非實際的訊息內容。要獲取內容，請將 `verbose` 引數的值設定為 `true`。

#### setSdk

注入預先配置的 OpenTelemetrySdk 執行個體。

- 當您呼叫 setSdk(sdk) 時，提供的 SDK 會按原樣使用，並且任何透過 addSpanExporter、addSpanProcessor、addResourceAttributes 或 setSampler 套用的自訂配置都將被忽略。
- Tracer 的檢測作用域名稱/版本會與您的服務資訊保持一致。

| 名稱  | 資料型別           | 是否必填 | 說明                         |
|-------|--------------------|----------|------------------------------|
| `sdk` | `OpenTelemetrySdk` | 是       | 在代理中使用的 SDK 執行個體。 |

### 進階配置

對於更進階的配置，您還可以自訂以下配置選項：

- Sampler：配置採樣策略以調整收集資料的頻率與數量。
- Resource attributes：新增有關正在產生遙測資料的處理程序的更多資訊。

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

要定義 sampler，請使用 `opentelemetry-java` SDK 中 `Sampler` 類別（`io.opentelemetry.sdk.trace.samplers.Sampler`）的相應方法，該方法代表您要使用的採樣策略。

預設採樣策略如下：

- `Sampler.alwaysOn()`：預設採樣策略，對每個 span（trace）進行採樣。

有關可用 sampler 與採樣策略的更多資訊，請參閱 OpenTelemetry [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 文件。

#### Resource attributes

Resource attribute 代表有關產生遙測資料的處理程序的額外資訊。Koog 包含一組預設設定的 resource attribute：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 屬性的預設值為 `ai.koog`，而預設 `service.version` 值為目前使用的 Koog 程式庫版本。

除了預設的 resource attribute 之外，您還可以新增自訂屬性。要在 Koog 的 OpenTelemetry 配置中新增自訂屬性，請在 OpenTelemetry 配置中使用 `addResourceAttributes()` 方法，該方法接受鍵（key）與值（value）作為其引數。

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

## Span 型別與屬性

OpenTelemetry 功能會自動建立不同型別的 span 來追蹤代理中的各種操作：

- **CreateAgentSpan**：在您執行代理時建立，在代理關閉或處理程序結束時關閉。
- **InvokeAgentSpan**：代理的調用。
- **StrategySpan**：代理策略（頂層執行流）的執行。
- **NodeExecuteSpan**：代理策略中節點的執行。這是 Koog 特有的自訂 span。
- **SubgraphExecuteSpan**：代理策略中子圖的執行。這是 Koog 特有的自訂 span。
- **InferenceSpan**：LLM 呼叫。
- **ExecuteToolSpan**：工具呼叫。
- **McpClientSpan**：MCP (Model Context Protocol) 用戶端操作。此 span 遵循 MCP 的 OpenTelemetry 語意慣例。

Span 以巢狀階層結構組織。以下是 span 結構的範例：

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

### Span 屬性

Span attribute 提供與 span 相關的元資料。每個 span 都有其屬性集，而某些 span 也可能重複屬性。

Koog 支援一系列預定義屬性，這些屬性遵循 OpenTelemetry 的 [生成式 AI 事件語意慣例](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)。例如，該慣例定義了一個名為 `gen_ai.conversation.id` 的屬性，這通常是 span 的必填屬性。在 Koog 中，此屬性的值是代理執行的唯一識別碼，當您呼叫 `agent.run()` 方法時會自動設定。

此外，Koog 還包含 Koog 特有的自訂屬性。您可以透過 `koog.` 前綴辨識大多數這些屬性。以下是可用的自訂屬性：

- `koog.strategy.name`：代理策略的名稱。策略是一個與 Koog 相關的實體，描述代理的目的。用於 `StrategySpan` span。
- `koog.node.id`：正在執行的節點識別碼（名稱）。用於 `NodeExecuteSpan` span。
- `koog.node.input`：在執行開始時傳遞給節點的輸入。節點啟動時存在於 `NodeExecuteSpan` 上。
- `koog.node.output`：節點完成時產生的輸出。節點成功完成時存在於 `NodeExecuteSpan` 上。
- `koog.subgraph.id`：正在執行的子圖識別碼（名稱）。用於 `SubgraphExecuteSpan` span。
- `koog.subgraph.input`：在執行開始時傳遞給子圖的輸入。子圖啟動時存在於 `SubgraphExecuteSpan` 上。
- `koog.subgraph.output`：子圖完成時產生的輸出。子圖成功完成時存在於 `SubgraphExecuteSpan` 上。

### 事件

Span 也可以附加 *event*。Event 描述了發生相關事情的特定時間點。例如，當 LLM 呼叫開始或結束時。Event 也有屬性，此外還包括 event *主體欄位（body fields）*。

支援以下符合 OpenTelemetry [生成式 AI 事件語意慣例](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) 的事件型別：

- **SystemMessageEvent**：傳遞給模型的系統指令。
- **UserMessageEvent**：傳遞給模型的用戶訊息。
- **AssistantMessageEvent**：傳遞給模型的助理訊息。
- **ToolMessageEvent**：來自工具或函式呼叫並傳遞給模型的響應。
- **ChoiceEvent**：來自模型的響應訊息。
- **ModerationResponseEvent**：模型審核結果或訊號。

!!! note   
    `optentelemetry-java` SDK 在新增事件時不支援事件主體欄位參數。因此，在 Koog 的 OpenTelemetry 支援中，事件主體欄位是一個單獨的屬性，其鍵為 `body`，值型別為字串。該字串包含事件主體欄位的內容或負載，通常是一個類似 JSON 的物件。有關事件主體欄位的範例，請參閱 [OpenTelemetry 文件](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有關 `opentelemetry-java` 對事件主體欄位的支援狀態，請參閱相關的 [GitHub issue](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## Exporters

Exporter 將收集到的遙測資料發送到 OpenTelemetry Collector 或其他型別的目的地或後端實作。要新增 exporter，請在安裝 OpenTelemetry 功能時使用 `addSpanExporter()` 方法。該方法接受以下引數：

| 名稱       | 資料型別     | 是否必填 | 預設值 | 說明                                                         |
|------------|--------------|----------|--------|--------------------------------------------------------------|
| `exporter` | SpanExporter | 是       |        | 要新增到自訂 span exporter 清單中的 SpanExporter 執行個體。 |

以下章節提供有關 `opentelemetry-java` SDK 中一些最常用 exporter 的資訊。

!!! note
    如果您沒有配置任何自訂 exporter，Koog 預設將使用控制台 LoggingSpanExporter。這有助於本機開發與偵錯。

### Logging exporter

將追蹤資訊輸出到控制台的記錄匯出器（logging exporter）。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

這種類型的匯出對於開發與偵錯目的非常有用。

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

### OpenTelemetry HTTP exporter

OpenTelemetry HTTP exporter (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，透過 HTTP 將 span 資料發送到後端。

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

### OpenTelemetry gRPC exporter

OpenTelemetry gRPC exporter (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它透過 gRPC 將遙測資料匯出到後端，並允許您定義接收資料的後端、collector 或端點的主機與連接埠。預設連接埠為 `4317`。

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

Langfuse 為 LLM/代理工作負載提供追蹤視覺化與分析。

您可以使用幫助函式將 Koog 配置為直接將 OpenTelemetry 追蹤匯出到 Langfuse：

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

請閱讀有關與 Langfuse 整合的 [完整文件](opentelemetry-langfuse-exporter.md)。

## 與 W&B Weave 整合

W&B Weave 為 LLM/代理工作負載提供追蹤視覺化與分析。與 W&B Weave 的整合可以透過預定義的 exporter 進行配置：

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

請閱讀有關與 W&B Weave 整合的 [完整文件](opentelemetry-weave-exporter.md)。

## 與 Jaeger 整合

Jaeger 是一個受歡迎的分散式追蹤系統，可與 OpenTelemetry 配合使用。Koog 存儲庫（repository）中 `examples` 目錄下的 `opentelemetry` 資料夾包含一個在 Koog 代理中使用 OpenTelemetry 與 Jaeger 的範例。

### 前提條件

要使用 Koog 與 Jaeger 測試 OpenTelemetry，請使用提供的 `docker-compose.yaml` 檔案執行以下指令來啟動 Jaeger OpenTelemetry all-in-one 處理程序：

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

要存取 Jaeger UI 並查看您的追蹤，請開啟 `http://localhost:16686`。

### 範例

為了匯出用於 Jaeger 的遙測資料，範例使用了 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 與 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

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

1. **Jaeger、Langfuse 或 W&B Weave 中沒有出現追蹤**
    - 確保服務正在執行且 OpenTelemetry 連接埠 (4317) 可供存取。
    - 檢查 OpenTelemetry exporter 是否配置了正確的端點。
    - 確保在代理執行後等待幾秒鐘，以便匯出追蹤。

2. **遺漏 span 或追蹤不完整**
    - 驗證代理執行是否成功完成。
    - 確保您沒有在代理執行後過快關閉應用程式。
    - 在代理執行後新增延遲，以便有時間匯出 span。

3. **span 數量過多**
    - 考慮透過配置 `sampler` 屬性來使用不同的採樣策略。
    - 例如，使用 `Sampler.traceIdRatioBased(0.1)` 僅對 10% 的追蹤進行採樣。

4. **span 配接器（adapter）互相覆蓋**
    - 目前，OpenTelemetry 代理功能不支援套用多個 span 配接器 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) 遙測支援

Koog 遵循 [官方 MCP OpenTelemetry 語意慣例](https://github.com/open-telemetry/semantic-conventions/pull/2083)，為 MCP 操作提供全面的 OpenTelemetry 檢測。

### 概觀

MCP 遙測支援包括：

- 使用 MCP 特有的屬性**自動豐富**工具執行 span
- 用於 MCP 用戶端操作（tools/call）的**用戶端檢測**
- **完全符合語意慣例**，包括所有必要、條件性必要與建議的屬性

### MCP 屬性

MCP 遙測遵循 OpenTelemetry 語意慣例，包含以下屬性群組：

**必要屬性：**
- `mcp.method.name`：MCP 方法名稱（例如 "tools/call"）

**條件性必要屬性：**
- `gen_ai.tool.name`：當操作涉及工具時
- `gen_ai.prompt.name`：當操作涉及提示詞（prompt）時
- `jsonrpc.request.id`：當執行請求時（非通知）
- `error.type`：當操作失敗時

**建議屬性：**
- `mcp.session.id`：工作階段識別碼
- `mcp.protocol.version`：MCP 協定版本（例如 "2025-06-18"）
- `network.transport`：傳輸類型（stdio 為 "pipe"，HTTP 為 "tcp"）
- `server.address` 與 `server.port`：用於用戶端操作

### Span 命名慣例

MCP span 遵循命名慣例：`{mcp.method.name} {target}`

其中 `{target}` 是工具名稱或提示詞名稱（如果適用）。範例：
- `"tools/call search"` - 呼叫名為 "search" 的工具

### 最佳實務

- 處理持久性 MCP 工作階段時，**務必設定工作階段 ID**，以實現工作階段追蹤
- 從 JSON-RPC 請求中**傳播請求 ID**，以進行完整的請求追蹤
- **監視指標**以識別 MCP 操作中的效能瓶頸

### 範例：具備遙測功能的完整 MCP 用戶端

```kotlin
// Create MCP tools registry
val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")

// Create agent with OpenTelemetry enabled and pass the tool registry
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry
) {
    install(OpenTelemetry) {
        setServiceInfo("mcp-agent-service", "1.0.0")
        addSpanExporter(LoggingSpanExporter.create())
    }
}

// Run agent - MCP tool calls will be automatically instrumented
agent.use {
    it.run("Use the search tool to find information")
}
```

此設定遵循 OpenTelemetry 最佳實務與語意慣例，僅需極少的程式碼變更即可為 MCP 操作提供完整的觀測能力。