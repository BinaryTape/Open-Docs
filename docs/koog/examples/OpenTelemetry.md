# 使用 Koog 集成 OpenTelemetry：跟踪您的 AI 智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/OpenTelemetry.ipynb
){ .md-button }

本笔记本演示了如何为 Koog AI 智能体添加基于 OpenTelemetry 的跟踪。我们将：
- 将 span 发送到控制台以进行快速本地调试。
- 将 span 导出到 OpenTelemetry Collector 并在 Jaeger 中查看。

准备工作：
- 已安装 Docker/Docker Compose
- 环境变量 `OPENAI_API_KEY` 中提供 OpenAI API 密钥

在运行笔记本之前，启动本地 OpenTelemetry 技术栈（Collector + Jaeger）：
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

在下一个单元格中，我们：
- 创建一个 Koog AIAgent
- 安装 OpenTelemetry 功能
- 添加两个 span 导出器：
  - 用于控制台日志的 LoggingSpanExporter
  - 指向 http://localhost:4317 (Collector) 的 OTLP gRPC 导出器

这与示例描述相对应：控制台日志用于本地调试，OTLP 用于在 Jaeger 中查看跟踪。

```kotlin
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "You are a code assistant. Provide concise code examples."
) {
    install(OpenTelemetry) {
        // 添加控制台日志记录器用于本地调试
        addSpanExporter(LoggingSpanExporter.create())

        // 发送跟踪到 OpenTelemetry collector
        addSpanExporter(
            OtlpGrpcSpanExporter.builder()
                .setEndpoint("http://localhost:4317")
                .build()
        )
    }
}
```

## 运行智能体并在 Jaeger 中查看跟踪

执行下一个单元格以触发一个简单的提示词。您应该会看到：
- 来自 LoggingSpanExporter 的控制台 span 日志
- 导出到本地 OpenTelemetry Collector 并在 Jaeger (http://localhost:16686) 中可见的跟踪

提示：运行单元格后，使用 Jaeger 的搜索功能查找最近的跟踪。

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

## 清理与故障排除

完成后：

- 停止服务：
  ```bash
  docker-compose down
  ```

- 如果您在 Jaeger 中没有看到跟踪：
  - 确保技术栈正在运行：`./docker-compose up -d` 并给它几秒钟启动时间。
  - 验证端口：
    - Collector (OTLP gRPC)：http://localhost:4317
    - Jaeger UI：http://localhost:16686
  - 检查容器日志：`docker-compose logs --tail=200`
  - 确认运行笔记本的环境中已设置 `OPENAI_API_KEY`。
  - 确保导出器中的端点与 collector 匹配：`http://localhost:4317`。

- 预期看到的 span：
  - Koog 智能体生命周期
  - LLM 请求/响应元数据
  - 任何工具执行 span（如果您添加了工具）

您现在可以对智能体进行迭代并观察跟踪流水线中的变化。