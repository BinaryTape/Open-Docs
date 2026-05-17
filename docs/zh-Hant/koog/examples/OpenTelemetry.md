# 使用 Koog 與 OpenTelemetry：追蹤您的 AI 代理程式

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

此筆記本示範如何將基於 OpenTelemetry 的追蹤功能加入 Koog AI 代理程式。我們將：
- 將 span 發送到主控台以進行快速的本機偵錯。
- 將 span 匯出到 OpenTelemetry Collector 並在 Jaeger 中查看。

先決條件：
- 已安裝 Docker/Docker Compose
- 環境變數 `OPENAI_API_KEY` 中有可用的 OpenAI API 金鑰

在執行筆記本之前，請啟動本機 OpenTelemetry 堆疊（Collector + Jaeger）：
```bash
./docker-compose up -d
```
代理程式執行後，開啟 Jaeger UI：
- http://localhost:16686

稍後若要停止服務：
```bash
docker-compose down
```

---

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import io.opentelemetry.exporter.logging.LoggingSpanExporter
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter

```

## 設定 OpenTelemetry 匯出器

在下一個資料格中，我們：
- 建立一個 Koog AIAgent
- 安裝 OpenTelemetry 功能
- 加入兩個 span 匯出器：
  - LoggingSpanExporter 用於主控台記錄
  - OTLP gRPC 匯出器，發送到 http://localhost:4317 (Collector)

這呼應了範例說明：主控台記錄用於本機偵錯，而 OTLP 用於在 Jaeger 中查看追蹤。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // 加入主控台記錄器以進行本機偵錯
        addSpanExporter(LoggingSpanExporter.create())

        // 將追蹤發送到 OpenTelemetry collector
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## 執行代理程式並在 Jaeger 中查看追蹤

執行下一個資料格以觸發一個簡單的提示詞。您應該會看到：
- 來自 LoggingSpanExporter 的主控台 span 記錄
- 匯出到您本機 OpenTelemetry Collector 並可在 Jaeger (http://localhost:16686) 中查看的追蹤

提示：在您執行資料格後，使用 Jaeger 搜尋功能來尋找最近的追蹤。

```kotlin
import ai.koog.agents.utils.use
import kotlinx.coroutines.runBlocking

runBlocking {
    agent.use { agent ->
        println("Running agent with OpenTelemetry tracing...")

        val result = agent.run("Tell me a joke about programming")

        "Agent run completed with result: '$result'.
Check Jaeger UI at http://localhost:16686 to view traces"
    }
}
```

## 清理與疑難排解

完成後：

- 停止服務：
  ```bash
  docker-compose down
  ```

- 如果您在 Jaeger 中沒有看到追蹤：
  - 確保堆疊正在執行：`./docker-compose up -d` 並等待幾秒鐘讓其啟動。
  - 驗證連接埠：
    - Collector (OTLP gRPC)：http://localhost:4317
    - Jaeger UI：http://localhost:16686
  - 檢查容器記錄：`docker-compose logs --tail=200`
  - 確認您的 `OPENAI_API_KEY` 已在執行筆記本的環境中設定。
  - 確保匯出器中的端點與 collector 相符：`http://localhost:4317`。

- 預期的 span：
  - Koog 代理程式生命週期
  - LLM 請求／回應元資料
  - 任何工具執行的 span（如果您有加入工具）

您現在可以對代理程式進行反覆運算，並觀察追蹤管線中的變化。