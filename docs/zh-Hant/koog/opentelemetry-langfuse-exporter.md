# Langfuse 匯出器

Koog 內建支援將代理程式追蹤匯出到 [Langfuse](https://langfuse.com/)，這是一個用於 AI 應用程式可觀察性和分析的平台。
透過 Langfuse 整合，您可以視覺化、分析和除錯您的 Koog 代理程式如何與 LLM、API 和其他元件互動。

有關 Koog 的 OpenTelemetry 支援背景資訊，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

### 設定說明

1.  建立一個 Langfuse 專案。請遵循 [在 Langfuse 中建立新專案](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的設定指南。
2.  取得 API 憑證。請按照 [Langfuse API 金鑰在哪裡？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 所述，擷取您的 Langfuse `public key` 和 `secret key`。
3.  將 Langfuse 主機、公鑰和密鑰傳遞給 Langfuse 匯出器。
    這可以透過將它們作為參數提供給 `addLangfuseExporter()` 函式來完成，
    或者如下所示設定環境變數：

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 配置

要啟用 Langfuse 匯出，請安裝 **OpenTelemetry 功能**並新增 `LangfuseExporter`。
該匯出器底層使用 `OtlpHttpSpanExporter` 將追蹤傳送到 Langfuse 的 OpenTelemetry 端點。

### 範例：具有 Langfuse 追蹤的代理程式

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    
    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
        systemPrompt = "You are a code assistant. Provide concise code examples."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter()
        }
    }

    println("Running agent with Langfuse tracing")

    val result = agent.run("Tell me a joke about programming")

    println("Result: $result
See traces on the Langfuse instance")
}
```
<!--- KNIT example-langfuse-exporter-01.kt -->

## 追蹤的內容

啟用後，Langfuse 匯出器會擷取與 Koog 一般 OpenTelemetry 整合相同的 spans，包括：

-   **代理程式生命週期事件**：代理程式啟動、停止、錯誤
-   **LLM 互動**：提示、回應、令牌使用量、延遲
-   **工具呼叫**：工具調用的執行追蹤
-   **系統上下文**：中繼資料，例如模型名稱、環境、Koog 版本

Koog 還會擷取 Langfuse 顯示 [Agent Graphs](https://langfuse.com/docs/observability/features/agent-graphs) 所需的 span 屬性。

在 Langfuse 中視覺化時，追蹤顯示如下：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

有關 Langfuse OpenTelemetry 追蹤的更多詳情，請參閱：
[Langfuse OpenTelemetry Docs](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)。

---

## 疑難排解

### Langfuse 中沒有出現追蹤
-   仔細檢查 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 是否已在您的環境中設定。
-   如果是在自行託管的 Langfuse 上執行，請確認 `LANGFUSE_HOST` 可從您的應用程式環境存取。
-   驗證公鑰/密鑰對屬於正確的專案。