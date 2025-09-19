# 概述

Koog 是一个基于 Kotlin 的框架，旨在完全以地道的 Kotlin 构建和运行 AI 智能体。它允许你创建能够与工具交互、处理复杂工作流以及与用户通信的智能体。

该框架支持以下类型的智能体：

*   单次运行智能体，配置最少，处理单个输入并提供响应。此类智能体在单个工具调用周期内运行，以完成其任务并提供响应。
*   复杂工作流智能体，具备高级功能，支持自定义策略和配置。

## 主要特性

Koog 的主要特性包括：

-   **多平台开发**：使用 Kotlin Multiplatform 在 JVM、JS、WasmJS、Android 和 iOS 目标平台部署智能体。
-   **可靠性与容错性**：通过内置重试处理故障，并借助智能体持久化特性在执行期间的特定点恢复智能体状态。
-   **智能历史记录压缩**：使用先进的内置历史记录压缩技术，在长时间运行的对话中保持上下文的同时优化 token 用量。
-   **企业级集成**：利用与 Spring Boot 和 Ktor 等流行 JVM 框架的集成，将 Koog 嵌入到你的应用程序中。
-   **通过 OpenTelemetry 导出器实现可观测性**：通过内置支持流行的可观测性提供商（W&B Weave、Langfuse）来监控和调试应用程序。
-   **LLM 切换与无缝历史记录适应**：可以在任何时候切换到不同的 LLM 而不丢失现有的对话历史记录，或在多个 LLM 提供商之间重新路由。
-   **与 JVM 和 Kotlin 应用程序集成**：使用专为 JVM 和 Kotlin 开发者设计的、地道的类型安全 Kotlin DSL 构建 AI 智能体。
-   **模型上下文协议集成**：在 AI 智能体中使用 Model Context Protocol (MCP) 工具。
-   **知识检索与记忆**：通过向量嵌入、排序文档存储和共享智能体记忆，在对话中留存和检索知识。
-   **强大的 Streaming API**：通过流式支持和并行工具调用来实时处理响应。
-   **模块化特性系统**：通过可组合架构自定义智能体功能。
-   **灵活的图工作流**：使用直观的基于图的工作流来设计复杂的智能体行为。
-   **自定义工具创建**：通过访问外部系统和 API 的工具来增强你的智能体。
-   **全面的追踪**：通过详细且可配置的追踪来调试和监控智能体执行。

## 可用的 LLM 提供商和平台

你可以使用以下 LLM 提供商和平台的 LLM 来为你的智能体功能提供支持：

- Google
- OpenAI
- Anthropic
- DeepSeek
- OpenRouter
- Ollama
- Bedrock

关于将这些提供商与专用 LLM 客户端一起使用的详细指导，请参考 [运行带 LLM 客户端的提示词](prompt-api.md#running-prompts-with-llm-clients)。

## 安装

要使用 Koog，你需要将所有必要的依赖项包含在你的构建配置中。

### Gradle

#### Gradle (Kotlin DSL)

1.  将依赖项添加到 `build.gradle.kts` 文件：

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
    }
    ```

2.  确保在仓库列表中包含 `mavenCentral()`。

#### Gradle (Groovy)

1.  将依赖项添加到 `build.gradle` 文件：

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
    }
    ```

2.  确保在仓库列表中包含 `mavenCentral()`。

### Maven

1.  将依赖项添加到 `pom.xml` 文件：

    ```
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  确保在仓库列表中包含 `mavenCentral`。

## 快速开始示例

为了帮助你快速开始使用 AI 智能体，以下是一个单次运行智能体的快速示例：

!!! note
    在运行该示例之前，请将相应的 API 密钥指定为环境变量。关于详细信息，请参见[开始使用](single-run-agents.md)。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY") // or Anthropic, Google, OpenRouter, etc.

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```
<!--- KNIT example-index-01.kt -->
关于更多详细信息，请参见[开始使用](single-run-agents.md)。