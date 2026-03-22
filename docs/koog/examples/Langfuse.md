# 通过 OpenTelemetry 将 Koog 智能体跟踪至 Langfuse

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

本笔记本展示了如何使用 OpenTelemetry 将 Koog 智能体跟踪导出到您的 Langfuse 实例。您将设置环境变量，运行一个简单的智能体，然后在 Langfuse 中检查 span 和跟踪。

## 您将学习到

- Koog 如何与 OpenTelemetry 集成以发出跟踪
- 如何通过环境变量配置 Langfuse 导出器
- 如何运行智能体并在 Langfuse 中查看其跟踪

## 前提条件

- 一个 Langfuse 项目（主机 URL、公钥、密钥）
- 用于 LLM 执行器的 OpenAI API 密钥
- 在您的 shell 中设置环境变量：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # 或您的自托管 URL
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
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * Koog 智能体跟踪至 [Langfuse](https://langfuse.com/) 的示例
 *
 * 智能体跟踪将导出至：
 * - 使用 [OtlpHttpSpanExporter] 的 Langfuse OTLP 端点实例
 *
 * 要运行此示例：
 *  1. 按照[此处](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)所述设置 Langfuse 项目和凭据
 *  2. 按照[此处](https://langfuse.com/faq/all/where-are-langfuse-api-keys)所述获取 Langfuse 凭据
 *  3. 设置 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 环境变量
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry 文档</a>
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

## 配置智能体和 Langfuse 导出器

在下一个单元格中，我们：

- 创建一个使用 OpenAI 作为 LLM 执行器的 AIAgent
- 安装 OpenTelemetry 功能并添加 Langfuse 导出器
- 依赖环境变量进行 Langfuse 配置

在底层，Koog 会为智能体生命周期、LLM 调用和工具执行（如果有）发出 span。Langfuse 导出器通过 OpenTelemetry 端点将这些 span 发送到您的 Langfuse 实例。

```kotlin
import kotlinx.coroutines.runBlocking

println("Running agent with Langfuse tracing")

runBlocking {
    val result = agent.run("Tell me a joke about programming")
    "Result: $result
See traces on the Langfuse instance"
}

```

## 运行智能体并查看跟踪

执行下一个单元格以触发一个简单的提示词。这将生成导出到您的 Langfuse 项目的 span。

### 在 Langfuse 中查看位置

1. 打开您的 Langfuse 仪表板并选择您的项目
2. 导航至跟踪 (Traces)/Span 视图
3. 查找您运行此单元格时间前后的近期条目
4. 钻取 span 以查看：
   - 智能体生命周期事件
   - LLM 请求/响应元数据
   - 错误（如果有）

### 故障排除

- 没有显示跟踪？
  - 仔细检查 LANGFUSE_HOST、LANGFUSE_PUBLIC_KEY、LANGFUSE_SECRET_KEY
  - 确保您的网络允许向 Langfuse 端点发送传出 HTTPS 请求
  - 验证您的 Langfuse 项目是否处于活动状态，并且密钥属于正确的项目
- 身份验证错误
  - 在 Langfuse 中重新生成密钥并更新环境变量
- OpenAI 问题
  - 确认 OPENAI_API_KEY 已设置且有效