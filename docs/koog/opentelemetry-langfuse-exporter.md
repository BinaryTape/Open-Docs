# Langfuse 导出器

Koog 内置支持将代理跟踪导出到 [Langfuse](https://langfuse.com/)，一个用于 AI 应用程序可观测性和分析的平台。
通过 Langfuse 集成，您可以可视化、分析和调试您的 Koog 代理如何与 LLM、API 和其他组件进行交互。

关于 Koog 的 OpenTelemetry 支持的背景信息，请参见 [OpenTelemetry 支持](https://docs.koog.ai/opentelemetry-support/)。

---

## 设置说明

1.  创建一个 Langfuse 项目。请遵循以下设置指南：[在 Langfuse 中创建新项目](https://langfuse.com/docs/get-started#create-new-project-in-langfuse)
2.  获取 API 凭据。按照 [Langfuse API 密钥在哪里？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 中所述，检索您的 Langfuse `public key` 和 `secret key`。
3.  将 Langfuse host、public key 和 secret key 传递给 Langfuse 导出器。这可以通过将它们作为实参传递给 `addLangfuseExporter()` 函数，或者通过设置环境变量（如下所示）来完成：

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 配置

要启用 Langfuse 导出，请安装 **OpenTelemetry 特性** 并添加 `LangfuseExporter`。
该导出器在底层使用 `OtlpHttpSpanExporter` 将跟踪发送到 Langfuse 的 OpenTelemetry 端点。

### 示例：带有 Langfuse 跟踪的代理

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
        systemPrompt = "You are a code assistant. Provide concise code examples."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter()
        }
    }

    println("正在运行带有 Langfuse 跟踪的代理")

    val result = agent.run("Tell me a joke about programming")

    println("Result: $result
请在 Langfuse 实例上查看跟踪")
}
```
<!--- KNIT example-langfuse-exporter-01.kt -->

## 跟踪属性

Langfuse 使用跟踪级别的属性来增强可观测性，其特性包括会话、环境、标签及其他元数据。
`addLangfuseExporter` 函数支持一个 `traceAttributes` 形参，该形参接受一个 `CustomAttribute` 对象 list。

这些属性被添加到每个跟踪的根 `InvokeAgentSpan` span 中，并启用 Langfuse 的高级特性。您可以传递 Langfuse 支持的任何属性——请参见 [Langfuse OpenTelemetry 文档中的完整列表](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)。

常见属性：
-   **会话** (`langfuse.session.id`)：将相关跟踪分组，用于聚合指标、成本分析和评分
-   **环境**：将生产跟踪与开发和测试环境隔离，以便进行更清晰的分析
-   **标签** (`langfuse.trace.tags`)：用特性名称、实验 ID 或客户细分来标记跟踪（字符串数组）

### 带有会话和标签的示例

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.attribute.CustomAttribute
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
import java.util.UUID
-->
```kotlin
fun main() = runBlocking {
    val apiKey = "api-key"
    val sessionId = UUID.randomUUID().toString()

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.CostOptimized.GPT4oMini,
        systemPrompt = "You are a helpful assistant."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter(
                traceAttributes = listOf(
                    CustomAttribute("langfuse.session.id", sessionId),
                    CustomAttribute("langfuse.trace.tags", listOf("chat", "kotlin", "production"))
                )
            )
        }
    }

    // 使用相同会话 ID 的多次运行将在 Langfuse 中被分组
    agent.run("What is Kotlin?")
    agent.run("Show me a coroutine example")
}
```
<!--- KNIT example-langfuse-exporter-02.kt -->

## 跟踪内容

启用后，Langfuse 导出器会捕获与 Koog 的通用 OpenTelemetry 集成相同的 span，包括：

-   **代理生命周期事件**：代理启动、停止、错误
-   **LLM 交互**：提示、响应、token 使用量、延迟
-   **工具调用**：工具调用的执行跟踪
-   **系统上下文**：元数据，例如模型名称、环境、Koog 版本

Koog 还会捕获 Langfuse 所需的 span 属性，以显示 [代理图](https://langfuse.com/docs/observability/features/agent-graphs)。

出于安全原因，OpenTelemetry span 的某些内容默认会被屏蔽。
要使内容在 Langfuse 中可用，请在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，并将其 `verbose` 实参设置为 `true`，如下所示：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.opentelemetry.feature.OpenTelemetry
import ai.koog.agents.features.opentelemetry.integration.langfuse.addLangfuseExporter
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a helpful assistant."
) {
-->
<!--- SUFFIX
}
-->
```kotlin
install(OpenTelemetry) {
    addLangfuseExporter()
    setVerbose(true)
}
```
<!--- KNIT example-langfuse-exporter-03.kt -->

在 Langfuse 中可视化时，跟踪显示如下：
![Langfuse traces](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse traces](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

关于 Langfuse OpenTelemetry 跟踪的更多详细信息，请参见：
[Langfuse OpenTelemetry 文档](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)。

---

## 故障排除

### Langfuse 中未出现跟踪
-   仔细检查 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 是否已在您的环境中设置。
-   如果是在自托管的 Langfuse 上运行，请确认 `LANGFUSE_HOST` 可从您的应用程序环境中访问。
-   验证 public/secret 密钥对是否属于正确的项目。