# Koog agent 的 Weave 執行緒

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

本筆記本示範如何使用 OpenTelemetry (OTLP) 將 Koog agent 追蹤到 W&B Weave。
您將建立一個簡單的 Koog `AIAgent`，啟用 Weave 匯出器，執行提示詞，並在
Weave UI 中查看豐富的追蹤。

若要了解背景資訊，請參閱 Weave OpenTelemetry 文件：https://weave-docs.wandb.ai/guides/tracking/otel/

## 前提條件

在執行範例之前，請確保您擁有：

- Weave/W&B 帳號：https://wandb.ai
- 從 https://wandb.ai/authorize 取得的 API 金鑰，並設定為環境變數：`WEAVE_API_KEY`
- 您的 Weave 實體（小組或使用者）名稱，設定為 `WEAVE_ENTITY`
  - 您可以在 W&B 儀表板中找到它：https://wandb.ai/home（左側邊欄的「Teams」）
- 設定專案名稱為 `WEAVE_PROJECT_NAME`（如果未設定，此範例將使用 `koog-tracing`）
- 設定 OpenAI API 金鑰為 `OPENAI_API_KEY` 以執行 Koog agent

範例 (macOS/Linux)：
```bash
export WEAVE_API_KEY=...  # Weave 需要
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## 筆記本設定

我們使用最新的 Kotlin Jupyter 描述符。如果您已將 Koog 預先配置為 `%use` 外掛程式，
您可以取消註解下方的行。

```kotlin
%useLatestDescriptors
//%use koog

```

## 建立 agent 並啟用 Weave 執行緒

我們建構一個極簡的 `AIAgent` 並安裝帶有 Weave 匯出器的 `OpenTelemetry` 功能。
匯出器會使用您的環境設定將 OTLP Span 傳送到 Weave：
- `WEAVE_API_KEY` — Weave 的身分驗證
- `WEAVE_ENTITY` — 哪個小組/使用者擁有這些追蹤
- `WEAVE_PROJECT_NAME` — 儲存追蹤的 Weave 專案

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val entity = System.getenv()["WEAVE_ENTITY"] ?: throw IllegalArgumentException("WEAVE_ENTITY is not set")
val projectName = System.getenv()["WEAVE_PROJECT_NAME"] ?: "koog-tracing"

val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        addWeaveExporter(
            weaveEntity = entity,
            weaveProjectName = projectName
        )
    }
}

```

## 執行 agent 並在 Weave 中查看追蹤

執行一個簡單的提示詞。完成後，開啟印出的連結以在 Weave 中查看追蹤。
您應該會看到 agent 執行、模型呼叫以及其他受檢測操作的 Span。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Weave tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces"
}

```

## 疑難排解

- 如果您沒有看到追蹤，請檢查您的環境中是否已設定 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 確保您的網路允許向 Weave 的 OTLP 端點發送傳出 HTTPS 請求。
- 確認您的 OpenAI 金鑰有效，且您的帳號可以存取選定的模型。