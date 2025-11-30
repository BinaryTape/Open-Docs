# Koog 代理程式的 Weave 追蹤

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

本筆記本展示如何使用 OpenTelemetry (OTLP) 將 Koog 代理程式追蹤到 W&B Weave。您將建立一個簡單的 Koog `AIAgent`，啟用 Weave 匯出器，執行提示，並在 Weave UI 中查看豐富的追蹤。

如需背景資訊，請參閱 Weave OpenTelemetry 文件：https://weave-docs.wandb.ai/guides/tracking/otel/

## 先決條件

在執行範例之前，請確保您已完成以下事項：

- 一個 Weave/W&B 帳戶：https://wandb.ai
- 您的 API 金鑰（來自 https://wandb.ai/authorize），並以環境變數 `WEAVE_API_KEY` 形式公開
- 您的 Weave 實體（團隊或使用者）名稱，並以 `WEAVE_ENTITY` 形式公開
  - 在您的 W&B 控制面板上尋找：https://wandb.ai/home (左側邊欄「Teams」)
- 專案名稱，並以 `WEAVE_PROJECT_NAME` 形式公開（如果未設定，本範例使用 `koog-tracing`）
- 一個 OpenAI API 金鑰，並以 `OPENAI_API_KEY` 形式公開，用於執行 Koog 代理程式

範例 (macOS/Linux)：
```bash
export WEAVE_API_KEY=...  # required by Weave
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## 筆記本設定

我們使用最新的 Kotlin Jupyter 描述符。如果您已將 Koog 預先設定為 `%use` 插件，您可以取消下方行的註解。

```kotlin
%useLatestDescriptors
//%use koog

```

## 建立代理程式並啟用 Weave 追蹤

我們建構一個最小的 `AIAgent` 並安裝 `OpenTelemetry` 功能，搭配 Weave 匯出器。此匯出器使用您的環境配置將 OTLP span 發送到 Weave：
- `WEAVE_API_KEY` — 向 Weave 進行驗證
- `WEAVE_ENTITY` — 哪個團隊/使用者擁有這些追蹤
- `WEAVE_PROJECT_NAME` — 儲存追蹤的 Weave 專案

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.weave.addWeaveExporter
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

## 執行代理程式並在 Weave 中查看追蹤

執行一個簡單的提示。完成後，打開列印出的連結以在 Weave 中查看追蹤。您應該會看到代理程式執行、模型呼叫和其他檢測操作的 span。

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

- 如果您未看到追蹤，請驗證您的環境中是否已設定 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 確保您的網路允許對外的 HTTPS 連線到 Weave 的 OTLP 端點。
- 確認您的 OpenAI 金鑰有效，並且所選模型可從您的帳戶存取。