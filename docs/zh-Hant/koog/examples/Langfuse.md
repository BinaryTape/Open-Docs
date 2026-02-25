# 透過 OpenTelemetry 將 Koog Agent 追蹤至 Langfuse

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

此筆記本展示如何使用 OpenTelemetry 將 Koog Agent 追蹤匯出至您的 Langfuse 執行個體。您將設定環境變數、執行一個簡單的 Agent，然後在 Langfuse 中檢查 span 和追蹤。

## 您將學到什麼

- Koog 如何與 OpenTelemetry 整合以發送追蹤
- 如何透過環境變數配置 Langfuse 匯出器
- 如何執行 Agent 並在 Langfuse 中查看其追蹤

## 前提條件

- 一個 Langfuse 專案（主機 URL、公鑰、私鑰）
- 用於 LLM 執行器的 OpenAI API 金鑰
- 在您的 shell 中設定環境變數：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # 或您的自代管 URL
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
 * Koog Agent 追蹤至 [Langfuse](https://langfuse.com/) 的範例
 *
 * Agent 追蹤會匯出至：
 * - 使用 [OtlpHttpSpanExporter] 的 Langfuse OTLP 端點執行個體
 *
 * 要執行此範例：
 *  1. 按照[此處](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)所述設定 Langfuse 專案與憑據
 *  2. 按照[此處](https://langfuse.com/faq/all/where-are-langfuse-api-keys)所述獲取 Langfuse 憑據
 *  3. 設定 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 環境變數
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry 文件</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## 配置 Agent 與 Langfuse 匯出器

在下一個資料格中，我們：

- 建立一個使用 OpenAI 作為 LLM 執行器的 AIAgent
- 安裝 OpenTelemetry 功能並新增 Langfuse 匯出器
- 依賴環境變數進行 Langfuse 配置

在底層，Koog 會為 Agent 生命週期、LLM 呼叫和工具執行（如果有）發送 span。Langfuse 匯出器會透過 OpenTelemetry 端點將這些 span 傳送到您的 Langfuse 執行個體。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Langfuse tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on the Langfuse instance"
}

```

## 執行 Agent 並查看追蹤

執行下一個資料格以觸發簡單的提示詞。這將產生匯出到您 Langfuse 專案的 span。

### 在 Langfuse 中查看哪裡

1. 開啟您的 Langfuse 儀表板並選擇您的專案
2. 導覽至 Traces/Spans 檢視
3. 尋找您執行此資料格時間點附近的最新項目
4. 深入查看 span 以了解：
   - Agent 生命週期事件
   - LLM 請求／回應元資料
   - 錯誤（如果有）

### 疑難排解

- 沒有顯示追蹤？
  - 再次檢查 LANGFUSE_HOST、LANGFUSE_PUBLIC_KEY、LANGFUSE_SECRET_KEY
  - 確保您的網路允許向 Langfuse 端點發送出站 HTTPS 請求
  - 驗證您的 Langfuse 專案是否處於啟用狀態，且金鑰屬於正確的專案
- 驗證錯誤
  - 在 Langfuse 中重新產生金鑰並更新環境變數
- OpenAI 問題
  - 確認 OPENAI_API_KEY 已設定且有效