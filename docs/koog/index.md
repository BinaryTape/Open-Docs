# 概述

Koog 是一个基于 Kotlin 的框架，旨在完全以地道的 Kotlin 构建和运行 AI 智能体。它允许你创建能够与工具交互、处理复杂工作流以及与用户通信的智能体。

该框架支持以下类型的智能体：

*   单次运行智能体，配置最少，处理单个输入并提供响应。此类智能体在单个工具调用周期内运行，以完成其任务并提供响应。
*   复杂工作流智能体，具备高级功能，支持自定义策略和配置。

## 主要特性

Koog 的主要特性包括：

-   **纯 Kotlin 实现**：完全以自然和地道的 Kotlin 构建 AI 智能体。
-   **MCP 集成**：连接到 Model Control Protocol，以增强模型管理。
-   **嵌入能力**：使用向量嵌入进行语义搜索和知识检索。
-   **自定义工具创建**：通过访问外部系统和 API 的工具来扩展你的智能体。
-   **即用型组件**：利用预构建解决方案来加速常见 AI 工程挑战的开发。
-   **智能历史记录压缩**：使用各种预构建策略，在保持对话上下文的同时优化 token 用量。
-   **强大的 Streaming API**：通过流式支持和并行工具调用来实时处理响应。
-   **持久化智能体记忆**：实现跨会话甚至跨不同智能体的知识留存。
-   **全面的追踪**：通过详细且可配置的追踪来调试和监控智能体执行。
-   **灵活的图工作流**：使用直观的基于图的工作流来设计复杂的智能体行为。
-   **模块化特性系统**：通过可组合架构自定义智能体功能。
-   **可伸缩架构**：处理从简单聊天机器人到企业应用程序的各种工作负载。
-   **多平台**：通过 Kotlin Multiplatform 在 JVM、JS、WasmJS 目标平台运行智能体。

# 可用的 LLM 提供商和平台

你可以使用以下 LLM 提供商和平台的 LLM 来为你的智能体功能提供支持：

-   Google
-   OpenAI
-   Anthropic
-   OpenRouter
-   Ollama

# 安装

要使用 Koog，你需要将所有必要的依赖项包含在你的构建配置中。

## Gradle

### Gradle (Kotlin DSL)

1.  将依赖项添加到 `build.gradle.kts` 文件：

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
    }
    ```

2.  确保在仓库列表中包含 `mavenCentral()`。

### Gradle (Groovy)

1.  将依赖项添加到 `build.gradle` 文件：

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
    }
    ```

2.  确保在仓库列表中包含 `mavenCentral()`。

## Maven

1.  将依赖项添加到 `pom.xml` 文件：

    ```
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  确保在仓库列表中包含 `mavenCentral`。

# 快速开始示例

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
            executor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
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