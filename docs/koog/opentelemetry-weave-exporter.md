# W&B Weave 导出器

Koog 提供内置支持，可将智能体追踪导出到 [W&B Weave](https://wandb.ai/site/weave/)，
Weights & Biases 提供的这款开发者工具专用于 AI 应用程序的可观测性和分析。
通过 Weave 集成，你可以捕获提示、补全、系统上下文和执行追踪，并将其直接可视化到你的 W&B 工作区中。

关于 Koog 的 OpenTelemetry 支持的背景信息，请参见 [OpenTelemetry 支持](https://docs.koog.ai/opentelemetry-support/)。

---

## 设置说明

1.  在 [https://wandb.ai](https://wandb.ai) 注册一个 W&B 账户。
2.  从 [https://wandb.ai/authorize](https://wandb.ai/authorize) 获取你的 API 密钥。
3.  访问你的 W&B 仪表盘 [https://wandb.ai/home](https://wandb.ai/home) 查找你的 `entity` 名称。
    如果这是个人账户，你的 `entity` 通常是你的用户名；如果是团队/组织账户，则是你的团队/组织名称。
4.  为你的项目定义一个名称。你无需提前创建项目，当第一个追踪被发送时，它将自动创建。
5.  将 Weave `entity`、项目名称和 API 密钥传递给 Weave 导出器。
    这可以通过将它们作为形参传递给 `addWeaveExporter()` 函数来完成，
    或者通过设置环境变量，如下所示：

```bash
export WEAVE_API_KEY="<your-api-key>"
export WEAVE_ENTITY="<your-entity>"
export WEAVE_PROJECT_NAME="koog-tracing"
```

## 配置

要启用 Weave 导出，请安装 **OpenTelemetry 特性** 并添加 `WeaveExporter`。
该导出器通过 `OtlpHttpSpanExporter` 使用 Weave 的 OpenTelemetry 端点。

### 示例：使用 Weave 追踪的智能体

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
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
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

## 追踪内容

启用后，Weave 导出器会捕获与 Koog 的通用 OpenTelemetry 集成相同的 spans，包括：

-   **智能体生命周期事件**：智能体启动、停止、错误
-   **LLM 交互**：提示、补全、延迟
-   **工具调用**：工具调用的执行追踪
-   **系统上下文**：元数据，例如模型名称、环境、Koog 版本

在 W&B Weave 中可视化时，追踪显示如下：
![W&B Weave 追踪](img/opentelemetry-weave-exporter-light.png#only-light)
![W&B Weave 追踪](img/opentelemetry-weave-exporter-dark.png#only-dark)

更多详细信息，请参见官方的 [Weave OpenTelemetry 文档](https://weave-docs.wandb.ai/guides/tracking/otel/)。

---

## 故障排除

### Weave 中没有出现追踪
-   确认 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME` 已在你的环境中设置。
-   确保你的 W&B 账户拥有访问指定 `entity` 和项目的权限。

### 认证错误
-   检查你的 `WEAVE_API_KEY` 是否有效。
-   API 密钥必须具有写入选定 `entity` 的追踪的权限。

### 连接问题
-   确保你的环境具有访问 W&B 的 OpenTelemetry 摄入端点的网络权限。