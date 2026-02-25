# 为 Koog agent 编写 Weave 跟踪

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Weave.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Weave.ipynb
){ .md-button }

本笔记本演示了如何使用 OpenTelemetry (OTLP) 将 Koog agent 的跟踪记录到 W&B Weave。
您将创建一个简单的 Koog `AIAgent`，启用 Weave 导出器，运行一个提示词，并在 Weave UI 中查看丰富的跟踪。

背景信息请参阅 Weave OpenTelemetry 文档：https://weave-docs.wandb.ai/guides/tracking/otel/

## 前提条件

在运行示例之前，请确保您拥有：

- 一个 Weave/W&B 帐号：https://wandb.ai
- 从 https://wandb.ai/authorize 获取您的 API 密钥，并将其公开为环境变量：`WEAVE_API_KEY`
- 您的 Weave 实体（团队或用户名）名称公开为 `WEAVE_ENTITY`
    - 您可以在 W&B 仪表板上找到它：https://wandb.ai/home（左侧边栏“Teams”）
- 一个公开为 `WEAVE_PROJECT_NAME` 的项目名称（如果未设置，本示例使用 `koog-tracing`）
- 一个公开为 `OPENAI_API_KEY` 的 OpenAI API 密钥，用于运行 Koog agent

示例 (macOS/Linux)：
```bash
export WEAVE_API_KEY=...  # Weave 要求
export WEAVE_ENTITY=your-team-or-username
export WEAVE_PROJECT_NAME=koog-tracing
export OPENAI_API_KEY=...
```

## 笔记本设置

我们使用最新的 Kotlin Jupyter 描述符。如果您已将 Koog 预配置为 `%use` 插件，可以取消下面这一行的注释。

```kotlin
%useLatestDescriptors
//%use koog

```

## 创建 agent 并启用 Weave 跟踪

我们构建一个最小化的 `AIAgent` 并安装带有 Weave 导出器的 `OpenTelemetry` 功能。
该导出器使用您的环境配置将 OTLP span 发送到 Weave：
- `WEAVE_API_KEY` — Weave 身份验证
- `WEAVE_ENTITY` — 拥有跟踪记录的团队/用户
- `WEAVE_PROJECT_NAME` — 存储跟踪记录的 Weave 项目

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

## 运行 agent 并在 Weave 中查看跟踪

执行一个简单的提示词。完成后，打开打印的链接以在 Weave 中查看跟踪。
您应该能看到 agent 运行、模型调用以及其他已插桩操作的 span。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Weave tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on https://wandb.ai/$entity/$projectName/weave/traces"
}

```

## 故障排除

- 如果您没有看到跟踪记录，请验证您的环境中是否设置了 `WEAVE_API_KEY`、`WEAVE_ENTITY` 和 `WEAVE_PROJECT_NAME`。
- 确保您的网络允许向 Weave 的 OTLP 端点发送出站 HTTPS 请求。
- 确认您的 OpenAI 密钥有效，且您的帐户可以访问所选模型。