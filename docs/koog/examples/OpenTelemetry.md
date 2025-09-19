# 使用 Koog 集成 OpenTelemetry：跟踪你的 AI 智能体

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

此 Notebook 演示了如何为 Koog AI 智能体添加基于 OpenTelemetry 的跟踪功能。我们将：
- 将 Span 发送到控制台，以便快速进行本地调试。
- 将 Span 导出到 OpenTelemetry Collector 并在 Jaeger 中查看。

先决条件：
- 已安装 Docker/Docker Compose
- OpenAI API 密钥已在环境变量 `OPENAI_API_KEY` 中可用

在运行 Notebook 之前，启动本地 OpenTelemetry 栈（Collector + Jaeger）：
```bash
./docker-compose up -d
```
智能体运行后，打开 Jaeger UI：
- http://localhost:16686

稍后停止服务：
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

## 配置 OpenTelemetry 导出器

在下一个单元格中，我们将：
- 创建一个 Koog AIAgent
- 安装 OpenTelemetry 特性
- 添加两个 Span 导出器：
  - LoggingSpanExporter 用于控制台日志
  - OTLP gRPC 导出器，发送至 http://localhost:4317 (Collector)

这与示例描述相符：控制台日志用于本地调试，OTLP 用于在 Jaeger 中查看跟踪。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
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

## 运行智能体并在 Jaeger 中查看跟踪

执行下一个单元格以触发一个简单的提示。你将看到：
- 来自 LoggingSpanExporter 的控制台 Span 日志
- 导出到本地 OpenTelemetry Collector 并在 http://localhost:16686 的 Jaeger 中可见的跟踪

提示：运行单元格后，使用 Jaeger 搜索来查找最近的跟踪。

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

## 清理和故障排除

完成后：

- 停止服务：
  ```bash
  docker-compose down
  ```

- 如果你在 Jaeger 中没有看到跟踪：
  - 确保栈正在运行：`./docker-compose up -d` 并等待几秒钟启动。
  - 验证端口：
    - Collector (OTLP gRPC)：http://localhost:4317
    - Jaeger UI：http://localhost:16686
  - 检查容器日志：`docker-compose logs --tail=200`
  - 确认你的 `OPENAI_API_KEY` 已在 Notebook 运行的环境中设置。
  - 确保导出器中的端点与 Collector 匹配：`http://localhost:4317`。

- 预期会有哪些 Span：
  - Koog 智能体生命周期
  - LLM 请求/响应元数据
  - 任何工具执行 Span（如果你添加了工具）

现在，你可以迭代你的智能体并观察跟踪流水线中的变化。