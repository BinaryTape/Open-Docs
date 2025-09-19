# Koog 代理的 Weave 追踪

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

本 Notebook 演示了如何使用 OpenTelemetry (OTLP) 将 Koog 代理追踪到 W&B Weave。你将创建一个简单的 Koog `AIAgent`，启用 Weave 导出器，运行一个提示词，并在 Weave UI 中查看丰富的追踪信息。

关于背景信息，请参见 Weave OpenTelemetry 文档：https://weave-docs.wandb.ai/guides/tracking/otel/

## 先决条件

在运行示例之前，请确保你已具备：

- 一个 Weave/W&B 账户：https://wandb.ai
- 你的 API 密钥（来自 https://wandb.ai/authorize），并将其作为环境变量 `WEAVE_API_KEY` 暴露。
- 你的 Weave 实体（团队或用户）名称，并将其作为 `WEAVE_ENTITY` 暴露。
  - 在你的 W&B 仪表盘（https://wandb.ai/home，左侧边栏“Teams”）上查找。
- 一个项目名称，并将其作为 `WEAVE_PROJECT_NAME` 暴露（如果未设置，本示例将使用 `koog-tracing`）。
- 一个 OpenAI API 密钥，并将其作为 `OPENAI_API_KEY` 暴露，以运行 Koog 代理。

示例 (macOS/Linux)：
```bash
export WEAVE_API_KEY=...  # Weave 所需
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## Notebook 设置

我们使用最新的 Kotlin Jupyter 描述符。如果你已将 Koog 预配置为 `%use` 插件，可以取消注释下面的行。

```kotlin
%useLatestDescriptors
//%use koog

```

## 创建一个代理并启用 Weave 追踪

我们构建了一个最小的 `AIAgent`，并安装了带有 Weave 导出器的 `OpenTelemetry` 特性。该导出器使用你的环境配置向 Weave 发送 OTLP span：
- `WEAVE_API_KEY` — Weave 认证
- `WEAVE_ENTITY` — 追踪信息的归属团队/用户
- `WEAVE_PROJECT_NAME` — 存储追踪信息的 Weave 项目

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
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
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

## 运行代理并在 Weave 中查看追踪信息

执行一个简单的提示词。完成后，打开打印的链接以在 Weave 中查看追踪信息。你应该会看到代理运行、模型调用以及其他已插桩操作的 span。

```kotlin
import kotlinx.coroutines.runBlocking

println("正在运行带有 Weave 追踪的代理")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "结果: $result
在 https://wandb.ai/$entity/$projectName/weave/traces 上查看追踪信息"
}

```

## 故障排除

- 如果你看不到追踪信息，请检测你的环境中是否已设置 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 确保你的网络允许出站 HTTPS 连接到 Weave 的 OTLP 端点。
- 确认你的 OpenAI 密钥有效，并且所选模型可从你的账户访问。