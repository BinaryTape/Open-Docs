# Langfuse 匯出器

Koog 提供內建支援，可將 Agent 追蹤匯出至 [Langfuse](https://langfuse.com/)，這是一個用於 AI 應用程式觀測性與分析的平台。
透過 Langfuse 整合，您可以視覺化、分析並偵錯您的 Koog Agent 如何與 LLM、API 及其他元件互動。

有關 Koog 的 OpenTelemetry 支援背景資訊，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

## 設定說明

1. 建立 Langfuse 專案。請參考 [在 Langfuse 中建立新專案](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的設定指南。
2. 取得 API 憑據。按照 [Langfuse API 金鑰在哪裡？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 中的說明，擷取您的 Langfuse `public key`（公鑰）和 `secret key`（私鑰）。
3. 將 Langfuse 主機、私鑰和公鑰傳遞給 Langfuse 匯出器。
這可以透過將它們作為參數提供給 `addLangfuseExporter()` 函式來完成，或者透過設定如下所示的環境變數來完成：

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 配置

要啟用 Langfuse 匯出，請安裝 **OpenTelemetry 功能** 並新增 `LangfuseExporter`。  
此匯出器在底層使用 `OtlpHttpSpanExporter` 將追蹤傳送到 Langfuse 的 OpenTelemetry 端點。

### 範例：具備 Langfuse 追蹤功能的 Agent

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
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4oMini,
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

## 追蹤屬性

Langfuse 使用追蹤層級的屬性，透過工作階段、環境、標籤及其他元資料等功能來增強觀測性。
`addLangfuseExporter` 函式支援 `traceAttributes` 參數，該參數接受 `CustomAttribute` 物件清單。

這些屬性會被新增到每個追蹤的根 `InvokeAgentSpan` 範圍（span）中，並啟用 Langfuse 的進階功能。您可以傳遞
Langfuse 支援的任何屬性 - 請參閱 [Langfuse OpenTelemetry 文件中的完整清單](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)。

常用屬性：
- **工作階段** (`langfuse.session.id`)：將相關追蹤分組，以便進行聚合指標、成本分析和評分。
- **環境**：將實際運作環境的追蹤與開發和預備環境隔離，以進行更清晰的分析。
- **標籤** (`langfuse.trace.tags`)：使用功能名稱、實驗 ID 或客戶群體（字串陣列）為追蹤加上標籤。

### 包含工作階段與標籤的範例

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
import java.util.UUID
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    val sessionId = UUID.randomUUID().toString()

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a helpful assistant."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter(
                traceAttributes = listOf(
                    CustomAttribute("langfuse.session.id", sessionId),
                    CustomAttribute("langfuse.trace.tags", listOf("chat", "kotlin", "production"))
                )
            )
        }
    }

    // 具有相同工作階段 ID 的多次執行將在 Langfuse 中分組
    agent.run("What is Kotlin?")
    agent.run("Show me a coroutine example")
}
```
<!--- KNIT example-langfuse-exporter-02.kt -->

## 追蹤內容

啟用後，Langfuse 匯出器會擷取與 Koog 通用 OpenTelemetry 整合相同的範圍 (span)，包括：

- **Agent 生命週期事件**：Agent 啟動、停止、錯誤
- **LLM 互動**：提示詞、回應、權杖 (token) 使用量、延遲
- **工具呼叫**：工具調用的執行追蹤
- **系統上下文**：元資料，例如模型名稱、環境、Koog 版本

Koog 還會擷取 Langfuse 顯示 [Agent 圖表](https://langfuse.com/docs/observability/features/agent-graphs) 所需的範圍屬性。

出於安全性考量，OpenTelemetry 範圍的部分內容預設會被遮蔽。
若要使內容在 Langfuse 中可用，請在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，並將其 `verbose` 引數設為 `true`，如下所示：

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
    addLangfuseExporter()
    setVerbose(true)
}
```
<!--- KNIT example-langfuse-exporter-03.kt -->

在 Langfuse 中視覺化時，追蹤如下所示：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

有關 Langfuse OpenTelemetry 追蹤的更多詳細資訊，請參閱：  
[Langfuse OpenTelemetry 文件](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)。

---

## 疑難排解

### Langfuse 中沒有出現任何追蹤
- 再次確認環境中已設定 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY`。
- 如果執行的是自行託管的 Langfuse，請確認從您的應用程式環境可以連線到 `LANGFUSE_HOST`。
- 驗證公鑰/私鑰配對是否屬於正確的專案。