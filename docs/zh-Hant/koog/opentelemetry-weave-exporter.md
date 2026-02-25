# W&B Weave 匯出器

Koog 提供內建支援，可將 agent 追蹤匯出至 [W&B Weave](https://wandb.ai/site/weave/)，這是 Weights & Biases 推出的一款開發者工具，用於 AI 應用程式的可觀測性與分析。
透過 Weave 整合，您可以擷取提示詞、補全、系統內文與執行追蹤，並直接在您的 W&B 工作區中進行視覺化。

關於 Koog 的 OpenTelemetry 支援背景，請參閱 [OpenTelemetry 支援](https://docs.koog.ai/opentelemetry-support/)。

---

## 設定說明

1. 在 [https://wandb.ai](https://wandb.ai) 註冊一個 W&B 帳戶。
2. 從 [https://wandb.ai/authorize](https://wandb.ai/authorize) 取得您的 API 金鑰。
3. 前往您的 W&B 儀表板 [https://wandb.ai/home](https://wandb.ai/home) 尋找您的實體 (entity) 名稱。如果是個人帳戶，您的實體通常是您的使用者名稱，或者是您的團隊／組織名稱。
4. 為您的專案定義一個名稱。您不需要預先建立專案，它會在傳送第一個追蹤時自動建立。
5. 將 Weave 實體、專案名稱和 API 金鑰傳遞給 Weave 匯出器。
   您可以將這些資訊作為參數傳遞給 `addWeaveExporter()` 函式，或透過設定環境變數來完成，如下所示：

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```

## 配置

若要啟用 Weave 匯出，請安裝 **OpenTelemetry feature** 並新增 `WeaveExporter`。
此匯出器透過 `OtlpHttpSpanExporter` 使用 Weave 的 OpenTelemetry 端點。

### 範例：具有 Weave 追蹤功能的 agent

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
    val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"
    
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a code assistant. Provide concise code examples."
    ) {
        install(OpenTelemetry) {
            addWeaveExporter()
        }
    }

    println("Running agent with Weave tracing")

    val result = agent.run("Tell me a joke about programming")

    println("Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces")
}
```
<!--- KNIT example-weave-exporter-01.kt -->

## 追蹤內容

啟用後，Weave 匯出器會擷取與 Koog 一般 OpenTelemetry 整合相同的 span，包括：

- **Agent 生命周期事件**：agent 啟動、停止、錯誤
- **LLM 互動**：提示詞、補全、延遲
- **工具呼叫**：工具叫用的執行追蹤
- **系統內文**：模型名稱、環境、Koog 版本等元資料

出於安全原因，OpenTelemetry span 的部分內容預設會被遮蓋。
若要讓這些內容在 Weave 中可用，請在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，並將其 `verbose` 引數設為 `true`，如下所示：

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
    addWeaveExporter()
    setVerbose(true)
}
```
<!--- KNIT example-weave-exporter-02.kt -->

在 W&B Weave 中進行視覺化時，追蹤如下所示：
![W&B Weave traces](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave traces](img/opentelemetry-weave-exporter-dark.png#only-dark)

如需更多細節，請參閱官方的 [Weave OpenTelemetry 文件](https://weave-docs.wandb.ai/guides/tracking/otel/)。

---

## 疑難排解

### Weave 中未出現追蹤
- 確認您的環境中已設定 `WEAVE_API_KEY`、`WEAVE_ENTITY` 與 `WEAVE_PROJECT_NAME`。
- 確保您的 W&B 帳戶具有存取指定實體與專案的權限。

### 驗證錯誤
- 檢查您的 `WEAVE_API_KEY` 是否有效。
- API 金鑰必須具有為所選實體寫入追蹤的權限。

### 連線問題
- 確保您的環境具有連往 W&B OpenTelemetry 擷取端點的網路存取權限。