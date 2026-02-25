# Langfuse 导出器

Koog 提供内置支持，可将智能体跟踪导出到 [Langfuse](https://langfuse.com/)，这是一个用于 AI 应用程序的可观测性与分析平台。
通过集成 Langfuse，您可以可视化、分析并调试您的 Koog 智能体如何与 LLM、API 及其他组件交互。

有关 Koog 的 OpenTelemetry 支持的背景信息，请参阅 [OpenTelemetry 支持](https://docs.koog.ai/opentelemetry-support/)。

---

## 设置说明

1. 创建 Langfuse 项目。遵循 [在 Langfuse 中创建新项目](https://langfuse.com/docs/get-started#create-new-project-in-langfuse) 的设置指南。
2. 获取 API 凭据。按照 [Langfuse API 密钥在哪里？](https://langfuse.com/faq/all/where-are-langfuse-api-keys) 中的说明检索您的 Langfuse `public key` 和 `secret key`。
3. 将 Langfuse 主机、私钥和密钥传递给 Langfuse 导出器。
这可以通过将它们作为参数提供给 `addLangfuseExporter()` 函数来实现，或者通过设置如下所示的环境变量来实现：

```bash
   export LANGFUSE_HOST="https://cloud.langfuse.com"
   export LANGFUSE_PUBLIC_KEY="<your-public-key>"
   export LANGFUSE_SECRET_KEY="<your-secret-key>"
```

## 配置

要启用 Langfuse 导出，请安装 **OpenTelemetry 功能**并添加 `LangfuseExporter`。
该导出器在后台使用 `OtlpHttpSpanExporter` 将跟踪发送到 Langfuse 的 OpenTelemetry 端点。

### 示例：带有 Langfuse 跟踪的智能体

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
        llmModel = OpenAIModels.Chat.GPT4oMini,
        systemPrompt = "You are a code assistant. Provide concise code examples."
    ) {
        install(OpenTelemetry) {
            addLangfuseExporter()
        }
    }

    println("Running agent with Langfuse tracing")

    val result = agent.run("Tell me a joke about programming")

    println("Result: $result
See traces on the Langfuse instance")
}
```
<!--- KNIT example-langfuse-exporter-01.kt -->

## 跟踪属性

Langfuse 使用跟踪级属性，通过会话、环境、标签和其他元数据等功能来增强可观测性。
`addLangfuseExporter` 函数支持 `traceAttributes` 参数，该参数接受 `CustomAttribute` 对象列表。

这些属性被添加到每个跟踪的根 `InvokeAgentSpan` span 中，并启用 Langfuse 的高级功能。您可以传递 Langfuse 支持的任何属性 - 请参阅 [Langfuse OpenTelemetry 文档中的完整列表](https://langfuse.com/integrations/native/opentelemetry#trace-level-attributes)。

常见属性：
- **会话** (`langfuse.session.id`)：将相关跟踪分组，以便进行聚合指标分析、成本分析和评分。
- **环境**：将生产环境跟踪与开发和暂存环境隔离，以便进行更清晰的分析。
- **标签** (`langfuse.trace.tags`)：使用功能名称、实验 ID 或客户细分标记跟踪（字符串数组）。

### 包含会话和标签的示例

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
        llmModel = OpenAIModels.Chat.GPT4oMini,
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

    // 具有相同会话 ID 的多次运行将在 Langfuse 中被分组
    agent.run("What is Kotlin?")
    agent.run("Show me a coroutine example")
}
```
<!--- KNIT example-langfuse-exporter-02.kt -->

## 跟踪的内容

启用后，Langfuse 导出器会捕获与 Koog 的通用 OpenTelemetry 集成相同的 span，包括：

- **智能体生命周期事件**：智能体启动、停止、错误
- **LLM 交互**：提示词、响应、token 使用情况、延迟
- **工具调用**：工具调用的执行跟踪
- **系统上下文**：模型名称、环境、Koog 版本等元数据

Koog 还会捕获 Langfuse 显示 [智能体图 (Agent Graphs)](https://langfuse.com/docs/observability/features/agent-graphs) 所需的 span 属性。

出于安全原因，OpenTelemetry span 的某些内容默认会被遮掩。
要使内容在 Langfuse 中可用，请在 OpenTelemetry 配置中使用 [setVerbose](opentelemetry-support.md#setverbose) 方法，并将其 `verbose` 参数设置为 `true`，如下所示：

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
![Langfuse 跟踪](img/opentelemetry-langfuse-exporter-light.png#only-light)
![Langfuse 跟踪](img/opentelemetry-langfuse-exporter-dark.png#only-dark)

有关 Langfuse OpenTelemetry 跟踪的更多详细信息，请参阅：  
[Langfuse OpenTelemetry 文档](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint)。

---

## 故障排除

### Langfuse 中没有出现跟踪
- 仔细检查您的环境中是否设置了 `LANGFUSE_HOST`、`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY`。
- 如果运行在自托管的 Langfuse 上，请确认从您的应用程序环境可以访问 `LANGFUSE_HOST`。
- 验证公钥/密钥对是否属于正确的项目。