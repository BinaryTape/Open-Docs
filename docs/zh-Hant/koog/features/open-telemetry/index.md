# OpenTelemetry 支援

此頁面提供有關 Koog 代理架構對 OpenTelemetry 支援的詳細資訊，用於追蹤和監控您的 AI 代理。

## 總覽

OpenTelemetry 是一個可觀測性架構，提供用於從您的應用程式產生、收集和匯出遙測資料（追蹤）的工具。Koog OpenTelemetry 特性允許您對 AI 代理進行檢測以收集遙測資料，這可以幫助您：

- 監控代理效能和行為
- 在複雜的代理工作流中偵錯問題
- 視覺化代理的執行流程
- 追蹤 LLM 呼叫和工具使用情況
- 分析代理行為模式

## OpenTelemetry 關鍵概念

- **Span**：Span 代表分散式追蹤中的單個工作單元或操作。它們指出應用程式中特定活動的開始和結束，例如代理執行、函式呼叫、LLM 呼叫或工具呼叫。
- **屬性 (Attribute)**：屬性提供有關遙測相關項目（如 Span）的元資料。屬性以鍵值對的形式表示。
- **事件 (Event)**：事件是 Span 生命週期中的特定時間點（與 Span 相關的事件），代表發生的某些可能值得注意的事情。
- **匯出器 (Exporter)**：匯出器是負責將收集到的遙測資料發送到各種後端或目的地的組件。
- **收集器 (Collector)**：收集器接收、處理並匯出遙測資料。它們充當您的應用程式與可觀測性後端之間的中介。
- **採樣器 (Sampler)**：採樣器根據採樣策略決定是否應記錄追蹤。它們用於管理遙測資料的數量。
- **資源 (Resource)**：資源代表產生遙測資料的實體。它們由資源屬性識別，這些屬性是提供有關資源資訊的鍵值對。

Koog 中的 OpenTelemetry 特性會自動為各種代理事件建立 Span，包括：

- 代理執行開始和結束
- 節點執行
- LLM 呼叫
- 工具呼叫

## 安裝

要在 Koog 中使用 OpenTelemetry，請將 OpenTelemetry 特性新增到您的代理中：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        installFeatures = {
            install(OpenTelemetry) {
                // 在此處進行配置選項設定
            }
        }
    )
    ```
    <!--- KNIT example-opentelemetry-support-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava01 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var agent = AIAgent.builder()
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .install(OpenTelemetry.Feature, config -> {
            // 在此處進行配置選項設定
        })
        .build();
    ```
    <!--- KNIT exampleOpentelemetrySupportJava01.java -->

## 配置

### 基本配置

以下是在代理中配置 OpenTelemetry 特性時設定的可用屬性完整清單：

| 名稱             | 資料型別           | 預設值                | 說明                                                                  |
|------------------|--------------------|-----------------------|------------------------------------------------------------------------------|
| `serviceName`    | `String`           | `ai.koog`             | 正在進行檢測的服務名稱。                                  |
| `serviceVersion` | `String`           | 目前 Koog 程式庫版本 | 正在進行檢測的服務版本。                               |
| `isVerbose`      | `Boolean`          | `false`               | 是否啟用詳細記錄，用於對 OpenTelemetry 配置進行偵錯。 |
| `sdk`            | `OpenTelemetrySdk` |                       | 用於遙測收集的 OpenTelemetry SDK 執行個體。              |
| `tracer`         | `Tracer`           |                       | 用於建立 Span 的 OpenTelemetry tracer 執行個體。                   |

!!! note
`sdk` 和 `tracer` 屬性是您可以存取的公開屬性，但您只能使用下面列出的公開方法來設定它們。

`OpenTelemetryConfig` 類別還包含代表與不同配置項目相關之操作的方法。以下是安裝具有基本配置項目集的 OpenTelemetry 特性範例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 設定您的服務配置
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 新增記錄匯出器
        addSpanExporter(LoggingSpanExporter.create())
    }
    ```
    <!--- KNIT example-opentelemetry-support-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava02 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 設定您的服務配置
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 新增記錄匯出器
        config.addSpanExporter(LoggingSpanExporter.create());
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava02.java -->

有關可用方法的參考，請參閱以下章節。

#### setServiceInfo

設定服務資訊，包括名稱和版本。接受以下引數：

| 名稱               | 資料型別 | 必填 | 預設值 | 說明                                                 |
|--------------------|-----------|----------|---------------|-------------------------------------------------------------|
| `serviceName`      | String    | 是      |               | 正在進行檢測的服務名稱。                 |
| `serviceVersion`   | String    | 是      |               | 正在進行檢測的服務版本。              |

#### addSpanExporter

新增 Span 匯出器以將遙測資料發送到外部系統。接受以下引數：

| 名稱       | 資料型別      | 必填 | 預設值 | 說明                                                                   |
|------------|----------------|----------|---------------|-------------------------------------------------------------------------------|
| `exporter` | `SpanExporter` | 是      |               | 要新增到自訂 Span 匯出器清單中的 `SpanExporter` 執行個體。 |

#### addSpanProcessor

新增 Span 處理器工廠，以便在匯出 Span 之前對其進行處理。接受以下引數：

| 名稱        | 資料型別                         | 必填 | 預設值 | 說明                                                                                                  |
|-------------|-----------------------------------|----------|---------------|--------------------------------------------------------------------------------------------------------------|
| `processor` | `(SpanExporter) -> SpanProcessor` | 是      |               | 為給定匯出器建立 Span 處理器的函式。允許您為每個匯出器自訂處理過程。   |

#### addResourceAttributes

新增資源屬性以提供有關服務的額外上下文。接受以下引數：

| 名稱         | 資料型別                 | 必填 | 預設值 | 說明                                                            |
|--------------|---------------------------|----------|---------------|------------------------------------------------------------------------|
| `attributes` | `Map<AttributeKey<T>, T>` | 是      |               | 提供有關服務額外詳細資訊的鍵值對。 |

#### setSampler

設定採樣策略以控制收集哪些 Span。接受以下引數：

| 名稱      | 資料型別 | 必填 | 預設值 | 說明                                                      |
|-----------|-----------|----------|---------------|------------------------------------------------------------------|
| `sampler` | `Sampler` | 是      |               | 為 OpenTelemetry 配置設定的採樣器執行個體。 |

#### setVerbose

啟用或停用詳細記錄。接受以下引數：

| 名稱      | 資料型別 | 必填 | 預設值 | 說明                                                     |
|-----------|-----------|----------|---------------|-----------------------------------------------------------------|
| `verbose` | `Boolean` | 是      | `false`       | 如果為 true，則應用程式會收集更詳細的遙測資料。 |

!!! note

    出於安全原因，OpenTelemetry Span 的某些內容預設會被遮蔽。例如，LLM 訊息會被遮蔽為 `HIDDEN:non-empty` 而不是實際的訊息內容。要獲取內容，請將 `verbose` 引數的值設定為 `true`。

#### setSdk

插入預先配置的 OpenTelemetrySdk 執行個體。

- 當您呼叫 setSdk(sdk) 時，將按原樣使用提供的 SDK，並忽略透過 addSpanExporter、addSpanProcessor、addResourceAttributes 或 setSampler 套用的任何自訂配置。
- Tracer 的檢測範圍名稱／版本將與您的服務資訊保持一致。

| 名稱  | 資料型別          | 必填 | 說明                           |
|-------|--------------------|----------|---------------------------------------|
| `sdk` | `OpenTelemetrySdk` | 是      | 在代理中使用的 SDK 執行個體。 |

#### addMetricExporter

新增指標匯出器以將指標資料發送到外部系統。接受以下引數：

| 名稱            | 資料型別         | 必填 | 預設值 | 說明                                                                  |
|-----------------|------------------|----------|---------------|------------------------------------------------------------------------------|
| `exporter`      | `MetricExporter` | 是      |               | 要註冊到定期指標讀取器中的 `MetricExporter` 執行個體。     |
| `meterInterval` | `Duration`       | 否       | `1 s`         | 指標讀取之間的間隔。也可以作為 `java.time.Duration` 使用。 |

如果沒有註冊指標匯出器，Koog 將回退到主控台 `LoggingMetricExporter`，以便在本地開發期間可以看到指標。

#### addMetricFilter

限制為特定指標檢測儀器報告的屬性鍵。這會安裝一個 OpenTelemetry `View`，該視圖會捨棄未列出的任何屬性。接受以下引數：

| 名稱            | 資料型別      | 必填 | 預設值 | 說明                                                 |
|-----------------|---------------|----------|---------------|-------------------------------------------------------------|
| `metricName`    | `String`      | 是      |               | 要套用篩選器的指標檢測儀器名稱。   |
| `keysToRetain`  | `Set<String>` | 是      |               | 此指標應保留的屬性鍵。 |

使用此功能可防止高基數屬性（例如，請求識別碼）使您的指標後端膨脹，同時仍然能匯出指標本身。

### 進階配置

對於更進階的配置，您還可以自訂以下配置選項：

- 採樣器 (Sampler)：配置採樣策略以調整收集資料的頻率和數量。
- 資源屬性 (Resource attributes)：新增有關產生遙測資料之程序的更多資訊。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.sdk.trace.samplers.Sampler
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 設定您的服務配置
        setServiceInfo("my-agent-service", "1.0.0")
        
        // 新增記錄匯出器
        addSpanExporter(LoggingSpanExporter.create())
        
        // 設定採樣器 
        setSampler(Sampler.traceIdRatioBased(0.5)) 
    
        // 新增資源屬性
        addResourceAttributes(mapOf(
            AttributeKey.stringKey("custom.attribute") to "custom-value")
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.sdk.trace.samplers.Sampler;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava03 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 設定您的服務配置
        config.setServiceInfo("my-agent-service", "1.0.0");

        // 新增記錄匯出器
        config.addSpanExporter(LoggingSpanExporter.create());

        // 設定採樣器
        config.setSampler(Sampler.traceIdRatioBased(0.5));

        // 新增資源屬性
        config.addResourceAttributes(Map.of(
            AttributeKey.stringKey("custom.attribute"), "custom-value"
        ));
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava03.java -->

#### 採樣器 (Sampler)

要定義採樣器，請使用 `opentelemetry-java` SDK 中 `Sampler` 類別 (`io.opentelemetry.sdk.trace.samplers.Sampler`) 的相應方法，該方法代表您要使用的採樣策略。

預設採樣策略如下：

- `Sampler.alwaysOn()`：預設採樣策略，其中每個 Span（追蹤）都會被採樣。

有關可用採樣器和採樣策略的更多資訊，請參閱 OpenTelemetry [Sampler](https://opentelemetry.io/docs/languages/java/sdk/#sampler) 文件。

#### 資源屬性

資源屬性代表有關產生遙測資料之程序的額外資訊。Koog 包含一組預設設定的資源屬性：

- `service.name`
- `service.version`
- `service.instance.time`
- `os.type`
- `os.version`
- `os.arch`

`service.name` 屬性的預設值為 `ai.koog`，而預設的 `service.version` 值是目前使用的 Koog 程式庫版本。

除了預設資源屬性外，您還可以新增自訂屬性。要在 Koog 的 OpenTelemetry 配置中新增自訂屬性，請在 OpenTelemetry 配置中使用 `addResourceAttributes()` 方法，該方法接受鍵和值作為其引數。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.api.common.AttributeKey
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.api.common.AttributeKey;
    import java.util.Map;
    public class exampleOpentelemetrySupportJava04 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .install(OpenTelemetry.Feature, config -> {
    -->
    <!--- SUFFIX
                })
                .build();
        }
    }
    -->
    ```java
    config.addResourceAttributes(Map.of(
        AttributeKey.stringKey("custom.attribute"), "custom-value"
    ));
    ```
    <!--- KNIT exampleOpentelemetrySupportJava04.java -->

## 追蹤內容

OpenTelemetry 特性會擷取以下代理活動：

- **代理生命週期事件**：代理啟動、停止、錯誤
- **LLM 互動**：提示詞、回應、權杖 (token) 使用量、延遲和失敗（當 LLM 呼叫拋出異常時，Span 會標記為 Span 狀態 `ERROR` 和 `error.type`）
- **工具呼叫**：工具調用的執行追蹤
- **系統上下文**：元資料，如模型名稱、環境、Koog 版本

預設情況下，LLM 提示詞和回應的內容在匯出的 Span 中會被遮蔽，以避免洩漏敏感資料。要包含完整內容，請呼叫 [`setVerbose(true)`](#setverbose)。

有關個別 Span 類型和屬性的詳細明細，請參閱 [Span 類型與屬性](#span-types-and-attributes)。

## Span 類型與屬性

OpenTelemetry 特性會自動建立不同類型的 Span，以追蹤代理中的各種操作：

- **CreateAgentSpan**：在您執行代理時建立，在代理關閉或程序終止時關閉。
- **InvokeAgentSpan**：代理的調用。
- **StrategySpan**：代理策略（頂層執行流程）的執行。
- **NodeExecuteSpan**：代理策略中節點的執行。這是一個自訂的、Koog 特定的 Span。
- **SubgraphExecuteSpan**：代理策略中子圖的執行。這是一個自訂的、Koog 特定的 Span。
- **InferenceSpan**：LLM 呼叫。
- **ExecuteToolSpan**：工具呼叫。
- **McpClientSpan**：MCP (Model Context Protocol) 用戶端操作。此 Span 遵循 MCP 的 OpenTelemetry 語意規範。

Span 以巢狀、階層結構組織。以下是 Span 結構的範例：

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
<!--- KNIT example-opentelemetry-support-01.txt -->

### Span 屬性

Span 屬性提供與 Span 相關的元資料。每個 Span 都有其屬性集，而某些 Span 也可以重複屬性。

Koog 支援一組預定義屬性，這些屬性遵循 OpenTelemetry 的 [產生式 AI 事件語意規範 (Semantic conventions for generative AI events)](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)。例如，該規範定義了一個名為 `gen_ai.conversation.id` 的屬性，這通常是 Span 的必填屬性。在 Koog 中，此屬性的值是代理執行的唯一識別碼，當您呼叫 `agent.run()` 方法時會自動設定。

此外，Koog 還包含自訂的、Koog 特定的屬性。您可以透過 `koog.` 前綴識別大多數此類屬性。以下是可用的自訂屬性：

- `koog.strategy.name`：代理策略的名稱。策略是一個與 Koog 相關的實體，描述了代理的目的。用於 `StrategySpan` Span 中。
- `koog.node.id`：正在執行的節點識別碼（名稱）。用於 `NodeExecuteSpan` Span 中。
- `koog.node.input`：在執行開始時傳遞給節點的輸入。當節點啟動時存在於 `NodeExecuteSpan` 上。
- `koog.node.output`：節點完成後產生的輸出。當節點成功完成時存在於 `NodeExecuteSpan` 上。
- `koog.subgraph.id`：正在執行的子圖識別碼（名稱）。用於 `SubgraphExecuteSpan` Span 中。
- `koog.subgraph.input`：在執行開始時傳遞給子圖的輸入。當子圖啟動時存在於 `SubgraphExecuteSpan` 上。
- `koog.subgraph.output`：子圖完成後產生的輸出。當子圖成功完成時存在於 `SubgraphExecuteSpan` 上。

### 事件

Span 還可以附加一個 *事件 (event)*。事件描述了發生相關事情的特定時間點。例如，當 LLM 呼叫開始或結束時。事件也具有屬性，並且額外包含事件 *主體欄位 (body fields)*。

支援以下符合 OpenTelemetry [產生式 AI 事件語意規範 (Semantic conventions for generative AI events)](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/) 的事件類型：

- **SystemMessageEvent**：傳遞給模型的系統指令。
- **UserMessageEvent**：傳遞給模型的用戶訊息。
- **AssistantMessageEvent**：傳遞給模型的助理訊息。
- **ToolMessageEvent**：傳遞給模型的工具或函式呼叫回應。
- **ChoiceEvent**：來自模型的回應訊息。
- **ModerationResponseEvent**：模型審核結果或訊號。

!!! note   
`optentelemetry-java` SDK 在新增事件時不支援事件主體欄位參數。因此，在 Koog 的 OpenTelemetry 支援中，事件主體欄位是一個單獨的屬性，其鍵為 `body`，值型別為字串。該字串包含事件主體欄位的內容或酬載，通常是一個類似 JSON 的物件。有關事件主體欄位的範例，請參閱 [OpenTelemetry 文件](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-events/#examples)。有關 `opentelemetry-java` 中對事件主體欄位的支援狀態，請參閱相關的 [GitHub 問題](https://github.com/open-telemetry/semantic-conventions/issues/1870)。

## 指標

除了 Span 之外，OpenTelemetry 特性還會發出遵循 OpenTelemetry [產生式 AI 指標語意規範 (Semantic conventions for GenAI metrics)](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-metrics/) 的指標。指標透過經由 [addMetricExporter](#addmetricexporter) 配置的 meter provider 匯出；如果沒有註冊匯出器，預設會使用主控台 `LoggingMetricExporter`。

註冊了以下儀器：

| 名稱                                | 儀器類型 | 單位    | 說明                                                                                                 |
|-------------------------------------|------------|---------|-------------------------------------------------------------------------------------------------------------|
| `gen_ai.client.token.usage`         | 分佈圖 (Histogram)  | `{token}` | 針對每次 LLM 呼叫報告的權杖使用量，依 `gen_ai.token.type` (`input`/`output`) 拆分。                    |
| `gen_ai.client.operation.duration`  | 分佈圖 (Histogram)  | `s`     | 產生式 AI 操作的持續時間 — 包括 `text_completion` (LLM 呼叫) 和 `execute_tool` (工具調用)。    |
| `koog.gen_ai.client.tool.call.count`| 計數器 (Counter)    | `{call}` | 由代理執行的工具呼叫的 Koog 特定計數器，按工具名稱和呼叫狀態標記。          |

根據語意規範建議，提供了明確的直方圖分區邊界 (histogram bucket boundaries)：

- `gen_ai.client.token.usage`: `[1, 4, 16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216, 67108864]`
- `gen_ai.client.operation.duration`: `[0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.28, 2.56, 5.12, 10.24, 20.48, 40.96, 81.92]`

### gen_ai.provider.name

每個資料點都帶有 `gen_ai.provider.name` 屬性：

- 對於 `text_completion` 操作，其值為 LLM 提供者 ID（例如 `openai`、`anthropic`）。
- 對於 `execute_tool` 操作，其值為 `koog`，因為工具執行是在程序內發生的，而不是針對第三方提供者。MCP 工具執行保留此值，並透過相應 Span 上的獨立 `mcp.*` 屬性呈現 MCP 特定詳細資訊，因此工具指標能保持低基數。

### error.type

根據產生式 AI 語意規範要求，僅在失敗的 `gen_ai.client.operation.duration` 資料點上設定 `error.type`。該值是導致失敗之錯誤的標準 Java 類別名稱，因此它受限於異常階層結構，可以安全地用作指標維度：

- `AIAgentError` 的子類別 — 用於 `execute_tool` 失敗和工具驗證失敗。
- LLM 用戶端或代理執行階段拋出的任何 `Throwable` — 用於透過代理層級失敗掛鉤呈現的 `text_completion` 失敗。
- `_OTHER` — 當進行中的操作在代理關閉時被排清且沒有相關錯誤時的回退值。

成功操作不會設定此屬性。

### restrictToolNameCardinality

工具指標會標記 `gen_ai.tool.name`。如果您公開的工具名稱是動態或使用者產生的，則工具名稱基數可能會無限增長。使用 `restrictToolNameCardinality` 可將許可清單之外的任何名稱對應到單一備援值。

對於適用於任何儀器和任何屬性鍵的特定指標屬性篩選，請使用 [addMetricFilter](#addmetricfilter)。

## 匯出器

匯出器將收集到的遙測資料發送到 OpenTelemetry 收集器或其他類型的目的地或後端實作。要新增匯出器，請在安裝 OpenTelemetry 特性時使用 `addSpanExporter()` 方法。該方法接受以下引數：

| 名稱       | 資料型別    | 必填 | 預設 | 說明                                                                 |
|------------|--------------|----------|---------|-----------------------------------------------------------------------------|
| `exporter` | SpanExporter | 是      |         | 要新增到自訂 Span 匯出器清單中的 SpanExporter 執行個體。 |

以下章節提供有關 `opentelemetry-java` SDK 中一些最常用匯出器的資訊。

!!! note
如果您不配置任何自訂匯出器，Koog 預設將使用主控台 LoggingSpanExporter。這有助於在本機開發和偵錯期間使用。

### 記錄匯出器

將追蹤資訊輸出到主控台的記錄匯出器。`LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 是 `opentelemetry-java` SDK 的一部分。

這種類型的匯出對於開發和偵錯目的非常有用。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 新增記錄匯出器
        addSpanExporter(LoggingSpanExporter.create())
        // 根據需要新增更多匯出器
    }
    ```
    <!--- KNIT example-opentelemetry-support-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    public class exampleOpentelemetrySupportJava05 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 新增記錄匯出器
        config.addSpanExporter(LoggingSpanExporter.create());
        // 根據需要新增更多匯出器
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava05.java -->

### OpenTelemetry HTTP 匯出器

OpenTelemetry HTTP 匯出器 (`OtlpHttpSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter`) 的一部分，它透過 HTTP 將 Span 資料發送到後端。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
    import java.util.concurrent.TimeUnit
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    const val AUTH_STRING = ""
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 新增 OpenTelemetry HTTP 匯出器 
        addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // 設定等待收集器處理匯出的批次 Span 的最長時間 
                .setTimeout(30, TimeUnit.SECONDS)
                // 設定要連接的 OpenTelemetry 端點
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 新增授權標頭
                .addHeader("Authorization", "Basic $AUTH_STRING")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
    import java.util.concurrent.TimeUnit;
    public class exampleOpentelemetrySupportJava06 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            String AUTH_STRING = "";
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 新增 OpenTelemetry HTTP 匯出器
        config.addSpanExporter(
            OtlpHttpSpanExporter.builder()
                // 設定等待收集器處理匯出的批次 Span 的最長時間
                .setTimeout(30, TimeUnit.SECONDS)
                // 設定要連接的 OpenTelemetry 端點
                .setEndpoint("http://localhost:3000/api/public/otel/v1/traces")
                // 新增授權標頭
                .addHeader("Authorization", "Basic " + AUTH_STRING)
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava06.java -->

### OpenTelemetry gRPC 匯出器

OpenTelemetry gRPC 匯出器 (`OtlpGrpcSpanExporter`) 是 `opentelemetry-java` SDK (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`) 的一部分。它透過 gRPC 將遙測資料匯出到後端，並允許您定義接收資料的後端、收集器或端點的主機和連接埠。預設連接埠為 `4317`。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        // 新增 OpenTelemetry gRPC 匯出器 
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // 設定主機和連接埠
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava07 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        // 新增 OpenTelemetry gRPC 匯出器
        config.addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                // 設定主機和連接埠
                .setEndpoint("http://localhost:4317")
                .build()
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava07.java -->

## 與 Langfuse 整合

Langfuse 為 LLM／代理工作負載提供追蹤視覺化和分析。

您可以使用輔助函式將 Koog 配置為直接向 Langfuse 匯出 OpenTelemetry 追蹤：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor 
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava08 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addLangfuseExporter(
            "https://cloud.langfuse.com",
            "...",
            "...",
            null,
            null
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava08.java -->

請閱讀有關與 Langfuse 整合的 [完整文件](opentelemetry-langfuse-exporter.md)。

## 與 W&B Weave 整合

W&B Weave 為 LLM／代理工作負載提供追蹤視覺化和分析。與 W&B Weave 的整合可以透過預定義的匯出器進行配置：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava09 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addWeaveExporter(
            "https://trace.wandb.ai",
            "my-team",
            "my-project",
            "..."
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava09.java -->

請閱讀有關與 W&B Weave 整合的 [完整文件](opentelemetry-weave-exporter.md)。

## 與 Datadog 整合

Datadog 為雲端規模的應用程式提供監控、可觀測性和分析。與 Datadog 的整合可以透過預定義的匯出器進行配置：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.features.opentelemetry.integration.datadog.addDatadogExporter
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant."
    ) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    install(OpenTelemetry) {
        addDatadogExporter(
            datadogApiKey = "...",
            datadogSite = "datadoghq.com"
        )
    }
    ```
    <!--- KNIT example-opentelemetry-support-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    public class exampleOpentelemetrySupportJava10 {
        public static void main(String[] args) {
            var promptExecutor = PromptExecutor.builder()
                .openAI("openai-api-key")
                .build();
            var agent = AIAgent.builder()
                .promptExecutor(promptExecutor)
                .llmModel(OpenAIModels.Chat.GPT4o)
                .systemPrompt("You are a helpful assistant.")
                .
    -->
    <!--- SUFFIX
                .build();
        }
    }
    -->
    ```java
    install(OpenTelemetry.Feature, config -> {
        config.addDatadogExporter(
            "...",           // datadogApiKey
            "datadoghq.com", // datadogSite
            null,
            null
        );
    })
    ```
    <!--- KNIT exampleOpentelemetrySupportJava10.java -->

請閱讀有關與 Datadog 整合的 [完整文件](opentelemetry-datadog-exporter.md)。

## 與 Jaeger 整合

Jaeger 是一個受歡迎的分散式追蹤系統，可與 OpenTelemetry 搭配使用。Koog 存儲庫中 `examples` 內的 `opentelemetry` 目錄包含了一個在 Jaeger 和 Koog 代理中使用 OpenTelemetry 的範例。

### 必要條件

要使用 Koog 和 Jaeger 測試 OpenTelemetry，請使用提供的 `docker-compose.yaml` 檔案，透過執行以下指令來啟動 Jaeger OpenTelemetry all-in-one 程序：

```bash
docker compose up -d
```
<!--- KNIT example-opentelemetry-support-02.txt -->

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
<!--- KNIT example-opentelemetry-support-03.txt -->

要存取 Jaeger UI 並查看您的追蹤，請開啟 `http://localhost:16686`。

### 範例

為了匯出供 Jaeger 使用的遙測資料，該範例使用了 `opentelemetry-java` SDK 中的 `LoggingSpanExporter` (`io.opentelemetry.exporter.logging.LoggingSpanExporter`) 和 `OtlpGrpcSpanExporter` (`io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`)。

以下是完整的程式碼範例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.utils.io.use
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
    import kotlinx.coroutines.runBlocking
    val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
    --> 
    ```kotlin
    fun main() = runBlocking {
        val agent = AIAgent(
            promptExecutor = promptExecutor,
            llmModel = OpenAIModels.Chat.O4Mini,
            systemPrompt = "You are a code assistant. Provide concise code examples."
        ) {
            install(OpenTelemetry) {
                // 新增主控台記錄器用於本機偵錯
                addSpanExporter(LoggingSpanExporter.create())

                // 將追蹤發送到 OpenTelemetry 收集器
                addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                )
            }
        }

        agent.use { agent ->
            println("正在執行帶有 OpenTelemetry 追蹤的代理...")

            val result = agent.run("給我講一個關於程式設計的笑話")

            println("代理執行完成，結果為：'$result'。" +
                    "
請造訪 http://localhost:16686 查看 Jaeger UI 以檢視追蹤")
        }
    }
    ```
    <!--- KNIT example-opentelemetry-support-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import io.opentelemetry.exporter.logging.LoggingSpanExporter;
    import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
    public class exampleOpentelemetrySupportJava11 {
        static PromptExecutor promptExecutor = PromptExecutor.builder()
            .openAI("openai-api-key")
            .build();
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    public static void main(String[] args) {
        var agent = AIAgent.builder()
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.O4Mini)
            .systemPrompt("You are a code assistant. Provide concise code examples.")
            .install(OpenTelemetry.Feature, config -> {
                // 新增主控台記錄器用於本機偵錯
                config.addSpanExporter(LoggingSpanExporter.create());

                // 將追蹤發送到 OpenTelemetry 收集器
                config.addSpanExporter(
                    OtlpGrpcSpanExporter.builder()
                        .setEndpoint("http://localhost:4317")
                        .build()
                );
            })
            .build();

        System.out.println("正在執行帶有 OpenTelemetry 追蹤的代理...");

        var result = agent.run("給我講一個關於程式設計的笑話");

        System.out.println(
            "代理執行完成，結果為：'" + result + "'。" +
                "
請造訪 http://localhost:16686 查看 Jaeger UI 以檢視追蹤"
        );
    }
    ```
    <!--- KNIT exampleOpentelemetrySupportJava11.java -->

## 疑難排解

### 常見問題

1. **後端中沒有出現追蹤**
    - 確認所有必要的環境變數都已在您的 shell 中設定並匯出。
    - 驗證您的 API 金鑰或密鑰是否有效、未被撤銷，且具有寫入／追蹤權限。
    - 確保服務正在執行且 OpenTelemetry 連接埠 (4317) 可供存取。
    - 檢查匯出器是否配置了正確的端點。
    - 代理執行後請等待幾秒鐘 — 追蹤可能不會立即出現。

2. **連接問題**
    - 確認您的環境可以存取匯出器的攝取端點 (intake endpoint)。
    - 檢查是否有封鎖出站 HTTPS 流量的防火牆或代理設定。

3. **缺少 Span 或追蹤不完整**
    - 確認代理執行成功完成。
    - 確保在代理執行後不要過快關閉應用程式。
    - 在代理執行後增加延遲，以便有時間匯出 Span。

4. **Span 數量過多**
    - 考慮透過配置 `sampler` 屬性來使用不同的採樣策略。
    - 例如，使用 `Sampler.traceIdRatioBased(0.1)` 僅採樣 10% 的追蹤。

5. **Span 配接器互相覆蓋**
    - 目前，OpenTelemetry 代理特性不支援套用多個 Span 配接器 [KG-265](https://youtrack.jetbrains.com/issue/KG-265/Adding-Weave-exporter-breaks-Langfuse-exporter)。

## MCP (Model Context Protocol) 遙測支援

Koog 遵循 [官方 MCP 的 OpenTelemetry 語意規範](https://github.com/open-telemetry/semantic-conventions/pull/2083)，為 MCP 操作提供全面的 OpenTelemetry 檢測。

### 總覽

MCP 遙測支援包括：

- 使用 MCP 特定屬性**自動豐富**工具執行 Span
- 為 MCP 用戶端操作 (tools/call) 提供**用戶端檢測**
- **完全符合語意規範**，包含所有必填、條件式必填和建議屬性

### MCP 屬性

MCP 遙測遵循 OpenTelemetry 語意規範，並包含以下屬性組：

**必填屬性：**
- `mcp.method.name`：MCP 方法名稱（例如 "tools/call"）

**條件式必填屬性：**
- `gen_ai.tool.name`：當操作涉及工具時
- `gen_ai.prompt.name`：當操作涉及提示詞時
- `jsonrpc.request.id`：當執行請求（而非通知）時
- `error.type`：當操作失敗時

**建議屬性：**
- `mcp.session.id`：工作階段識別碼
- `mcp.protocol.version`：MCP 協定版本（例如 "2025-06-18"）
- `network.transport`：傳輸類型（stdio 為 "pipe"，HTTP 為 "tcp"）
- `server.address` 和 `server.port`：用於用戶端操作

### Span 命名慣例

MCP Span 遵循命名慣例：`{mcp.method.name} {target}`

其中 `{target}` 在適用時為工具名稱或提示詞名稱。範例：
- `"tools/call search"` - 呼叫名為 "search" 的工具

### 最佳實務

- 在處理持久性 MCP 工作階段時，**務必設定工作階段 ID** 以啟用工作階段追蹤
- **透傳來自 JSON-RPC 請求的請求 ID**，以實現完整的請求追蹤
- **監控指標**以識別 MCP 操作中的效能瓶頸

### 範例：帶有遙測功能的完整 MCP 用戶端

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
    import ai.koog.agents.mcp.McpToolRegistryProvider
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.utils.io.use
    import io.opentelemetry.exporter.logging.LoggingSpanExporter
    import kotlinx.coroutines.runBlocking
    fun main() {
        runBlocking {
            val promptExecutor = simpleOpenAIExecutor("openai-api-key")
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    // 建立 MCP 工具註冊表
    val toolRegistry = McpToolRegistryProvider.fromSseUrl("http://localhost:3000")
    
    // 建立啟用 OpenTelemetry 的代理並傳遞工具註冊表
    val agent = AIAgent(
        promptExecutor = promptExecutor,
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        toolRegistry = toolRegistry
    ) {
        install(OpenTelemetry) {
            setServiceInfo("mcp-agent-service", "1.0.0")
            addSpanExporter(LoggingSpanExporter.create())
        }
    }
    
    // 執行代理 - MCP 工具呼叫將自動進行檢測
    agent.use {
        it.run("使用搜尋工具查找資訊")
    }
    ```
    <!--- KNIT example-opentelemetry-support-12.kt -->

此設定只需極少的程式碼變更，即可為 MCP 操作提供完整的可觀測性，並遵循 OpenTelemetry 最佳實務和語意規範。