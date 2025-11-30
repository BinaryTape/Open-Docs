# 使用 OpenTelemetry 将 Koog 代理追踪到 Langfuse

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Langfuse.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Langfuse.ipynb
){ .md-button }

本 Notebook 演示了如何使用 OpenTelemetry 将 Koog 代理追踪数据导出到你的 Langfuse 实例。你将设置环境变量、运行一个简单的代理，然后探查 Langfuse 中的 span 和追踪。

## 你将学到什么

- Koog 如何与 OpenTelemetry 集成以发出追踪数据
- 如何通过环境变量配置 Langfuse 导出器
- 如何运行代理并在 Langfuse 中查看其追踪

## 前提条件

- 一个 Langfuse 项目（主机 URL、公钥、密钥）
- 用于 LLM 执行器的 OpenAI API 密钥
- 在你的 shell 中设置环境变量：

```bash
export OPENAI_API_KEY=sk-...
export LANGFUSE_HOST=https://cloud.langfuse.com # or your self-hosted URL
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
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

/**
 * Koog 代理追踪到 [Langfuse](https://langfuse.com/) 的示例
 *
 * 代理追踪数据被导出到：
 * - 使用 [OtlpHttpSpanExporter] 的 Langfuse OTLP 端点实例
 *
 * 要运行此示例：
 *  1. 按照 [此处](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的说明设置 Langfuse 项目和凭据
 *  2. 按照 [此处](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 的说明获取 Langfuse 凭据
 *  3. 设置 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 环境变量
 *
 * @see <a href="https://langfuse.com/docs/opentelemetry/get-started#opentelemetry-endpoint">Langfuse OpenTelemetry Docs</a>
 */
val agent = AIAgent(
    executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4oMini,
    systemPrompt = "你是一位代码助手。请提供简洁的代码示例。"
) {
    install(OpenTelemetry) {
        addLangfuseExporter()
    }
}
```

## 配置代理和 Langfuse 导出器

在下一个单元格中，我们：

- 创建一个使用 OpenAI 作为 LLM 执行器的 AIAgent
- 安装 OpenTelemetry 特性并添加 Langfuse 导出器
- 依靠环境变量进行 Langfuse 配置

在底层，Koog 会为代理生命周期、LLM 调用和工具执行（如果有）发出 span。Langfuse 导出器通过 OpenTelemetry 端点将这些 span 发送到你的 Langfuse 实例。

```kotlin
import kotlinx.coroutines.runBlocking

println("正在运行带 Langfuse 追踪的代理")

runBlocking {
    val result = agent.run("给我讲个关于编程的笑话")
    "结果: $result
在 Langfuse 实例上查看追踪"
}

```

## 运行代理并查看追踪

执行下一个单元格以触发一个简单的提示。这将生成并导出到你的 Langfuse 项目的 span。

### 在 Langfuse 中查看的位置

1. 打开你的 Langfuse 控制面板并选择你的项目
2. 导航到追踪/Span 视图
3. 查找你在运行此单元格时附近的最新条目
4. 深入到 span 中查看：
   - 代理生命周期事件
   - LLM 请求/响应元数据
   - 错误（如果有）

### 故障排除

- 没有显示追踪数据？
  - 仔细检查 LANGFUSE_HOST、LANGFUSE_PUBLIC_KEY、LANGFUSE_SECRET_KEY
  - 确保你的网络允许出站 HTTPS 到 Langfuse 端点
  - 验证你的 Langfuse 项目是否活跃，并且密钥属于正确的项目
- 认证错误
  - 在 Langfuse 中重新生成密钥并更新环境变量
- OpenAI 问题
  - 确认 OPENAI_API_KEY 已设置且有效