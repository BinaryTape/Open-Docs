[//]: # (title: Koog 搭配 OpenTelemetry：追蹤您的 AI 代理程式)
# Koog 搭配 OpenTelemetry：追蹤您的 AI 代理程式

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

這份筆記本示範如何為 Koog AI 代理程式新增基於 OpenTelemetry 的追蹤。我們將會：
- 將 span 發送到控制台以進行快速本機除錯。
- 將 span 匯出到 OpenTelemetry Collector 並在 Jaeger 中查看。

先決條件：
- 已安裝 Docker/Docker Compose
- OpenAI API 金鑰已設定為環境變數 `OPENAI_API_KEY`

在執行這份筆記本之前，請啟動本機 OpenTelemetry 堆疊 (Collector + Jaeger)：
```bash
./docker-compose up -d
```
代理程式執行後，開啟 Jaeger UI：
- http://localhost:16686

稍後停止服務：
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

在下一個單元格中，我們將：
- 建立一個 Koog AIAgent
- 安裝 OpenTelemetry 功能
- 新增兩個 span 匯出器：
  - 用於控制台日誌的 LoggingSpanExporter
  - OTLP gRPC 匯出器到 http://localhost:4317 (Collector)

這與範例描述相符：用於本機除錯的控制台日誌以及用於在 Jaeger 中查看追蹤的 OTLP。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
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
```

## 執行代理程式並在 Jaeger 中查看追蹤

執行下一個單元格以觸發一個簡單的提示。您應該會看到：
- 來自 LoggingSpanExporter 的控制台 span 日誌
- 匯出到您的本機 OpenTelemetry Collector 並在 http://localhost:16686 的 Jaeger 中可見的追蹤

提示：執行單元格後，使用 Jaeger 搜尋功能尋找最近的追蹤。

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

- 如果您在 Jaeger 中看不到追蹤：
  - 確保堆疊正在執行：`./docker-compose up -d` 並給它幾秒鐘啟動。
  - 驗證連接埠：
    - Collector (OTLP gRPC)：http://localhost:4317
    - Jaeger UI：http://localhost:16686
  - 檢查容器日誌：`docker-compose logs --tail=200`
  - 確認您的 `OPENAI_API_KEY` 已在筆記本執行的環境中設定。
  - 確保匯出器中的端點與 Collector 相符：`http://localhost:4317`。

預期的 span：
- Koog 代理程式生命週期
- LLM 請求/回應中繼資料
- 任何工具執行 span (如果您新增工具)

您現在可以迭代您的代理程式並觀察追蹤管線中的變更。