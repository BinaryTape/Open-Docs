# 使用 OpenTelemetry 將 Koog 代理追蹤至 Langfuse

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

本筆記本示範如何使用 OpenTelemetry 將 Koog 代理的追蹤匯出至您的 Langfuse 實例。您將設定環境變數，執行一個簡單的代理，然後在 Langfuse 中檢查跨度與追蹤。

## 您將學到什麼

- Koog 如何與 OpenTelemetry 整合以發出追蹤
- 如何透過環境變數配置 Langfuse 匯出器
- 如何執行代理並在 Langfuse 中查看其追蹤

## 先決條件

- 一個 Langfuse 專案（主機 URL、公鑰、密鑰）
- 用於 LLM 執行器的 OpenAI API 金鑰
- 在您的 shell 中設定的環境變數：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # or your self-hosted URL
export LANGFUSE_PUBLIC_KEY=pk_...
export LANGFUSE_SECRET_KEY=sk_...
```

```kotlin
%useLatestDescriptors
//%use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * 示範將 Koog 代理追蹤至 [Langfuse](https://langfuse.com/)
 *
 * 代理追蹤會匯出至：
 * - 使用 [OtlpHttpSpanExporter] 的 Langfuse OTLP 端點實例
 *
 * 若要執行此範例：
 *  1. 依照 [此處](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的說明設定 Langfuse 專案和憑證
 *  2. 依照 [此處](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 的說明取得 Langfuse 憑證
 *  3. 設定 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 環境變數
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry 文件</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## 配置代理和 Langfuse 匯出器

在下一個單元格中，我們：

- 建立一個使用 OpenAI 作為 LLM 執行器的 AIAgent
- 安裝 OpenTelemetry 功能並新增 Langfuse 匯出器
- 依賴環境變數進行 Langfuse 配置

在底層，Koog 會為代理生命週期、LLM 呼叫和工具執行（如果有的話）發出跨度。Langfuse 匯出器會透過 OpenTelemetry 端點將這些跨度傳送至您的 Langfuse 實例。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Langfuse tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on the Langfuse instance"
}

```

## 執行代理並查看追蹤

執行下一個單元格以觸發一個簡單的提示。這將產生匯出到您 Langfuse 專案的跨度。

### 在 Langfuse 中查看的位置

1. 開啟您的 Langfuse 儀表板並選擇您的專案
2. 導覽至「追蹤/跨度」視圖
3. 尋找您執行此單元格時附近的近期條目
4. 深入查看跨度以了解：
   - 代理生命週期事件
   - LLM 請求/回應中繼資料
   - 錯誤（如果有的話）

### 疑難排解

- 沒有顯示追蹤？
  - 仔細檢查 LANGFUSE_HOST、LANGFUSE_PUBLIC_KEY、LANGFUSE_SECRET_KEY
  - 確保您的網路允許對 Langfuse 端點的對外 HTTPS 連線
  - 驗證您的 Langfuse 專案處於活動狀態，並且金鑰屬於正確的專案
- 身份驗證錯誤
  - 在 Langfuse 中重新產生金鑰並更新環境變數
- OpenAI 問題
  - 確認 OPENAI_API_KEY 已設定且有效