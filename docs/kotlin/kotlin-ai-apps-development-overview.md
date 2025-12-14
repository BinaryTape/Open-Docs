[//]: # (title: Kotlin 用于 AI 驱动的应用程序开发)

Kotlin 为构建 AI 驱动的应用程序提供了一个现代化且实用的基础。它可跨平台使用，与成熟的 AI 框架良好集成，并支持常见的 AI 开发模式。

## Koog

[Koog](https://koog.ai) 是 JetBrains 推出的一个开源框架，用于构建从简单到复杂的 AI 智能体。它提供多平台支持、Spring Boot 和 Ktor 集成、惯用 DSL，以及开箱即用的生产就绪特性。

### 几行代码创建一个简单智能体

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // Use Anthropic, Google, OpenRouter, or any other provider
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://docs.koog.ai/getting-started/"><img src="get-started-with-koog.svg" width="700" alt="Koog 入门" style="block"/></a>

### 主要特性

*   **多平台开发支持**。多平台支持使得智能体应用程序开发可以面向 JVM、JavaScript、WebAssembly、Android 和 iOS。
*   **可靠性和容错性**。凭借内置重试机制，Koog 让开发者能够处理超时或工具错误等故障。智能体持久化使得恢复完整的智能体状态机成为可能，而不仅仅是聊天消息。
*   **针对长上下文的内置历史压缩技术**。Koog 提供了高级策略来压缩和管理长时间会话，无需额外设置。
*   **企业级集成**。Koog 与流行的 JVM 框架（如 [Spring Boot](https://spring.io/projects/spring-boot) 和 [Ktor](https://ktor.io)）集成。
*   **通过 OpenTelemetry Exporter 实现可观测性**。Koog 提供了与流行的可观测性提供商（如 W&B Weave 和 Langfuse）的开箱即用集成，用于监控和调试 AI 应用程序。
*   **LLM 切换和无缝历史适应**。Koog 允许在任何时候切换到具有一套新工具的不同 LLM，而不会丢失现有会话历史记录。它还支持在多个 LLM 提供商（包括 OpenAI、Anthropic、Google 等）之间重新路由。通过 Koog 与 Ollama 的集成，你可以使用本地模型在本地运行智能体。
*   **与 JVM 和 Kotlin 应用程序集成**。Koog 提供了专为 JVM 和 Kotlin 开发者设计的惯用、类型安全的 DSL。
*   **Model Context Protocol (MCP) 集成**。Koog 支持在智能体中使用 MCP 工具。
*   **知识检索与记忆**。借助嵌入、排序文档存储和共享智能体内存，Koog 本身能够在会话中主动保留知识。
*   **流式传输能力**。Koog 支持流式传输和并行工具调用，让开发者能够实时处理响应。

### 从何开始

*   在 [概览](https://docs.koog.ai/) 中探索 Koog 的功能。
*   通过 [入门指南](https://docs.koog.ai/getting-started/) 构建你的第一个 Koog 智能体。
*   在 [Koog 发布说明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
*   从 [示例](https://docs.koog.ai/examples/) 中学习。

## Model Context Protocol (MCP) Kotlin SDK

[MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk) 是 Model Context Protocol 的 Kotlin Multiplatform 实现。该 SDK 允许开发者使用 Kotlin 构建 AI 驱动的应用程序，并与跨 JVM、WebAssembly 和 iOS 的 LLM 界面集成。

借助 MCP Kotlin SDK，你可以：

*   通过将上下文处理与 LLM 交互分离，以结构化和标准化的方式为 LLM 提供上下文。
*   构建从现有服务器消费资源的 MCP 客户端。
*   创建向 LLM 公开提示、工具和资源的 MCP 服务器。
*   使用标准通信传输方式，例如 stdio、SSE 和 WebSocket。
*   处理所有 MCP 协议消息和生命周期事件。

## 探索其他 AI 驱动的应用程序场景

得益于无缝的 Java 互操作性和 Kotlin Multiplatform，你可以将 Kotlin 与成熟的 AI SDK 和框架结合，构建后端和桌面/移动 UI，并采用 RAG 和基于智能体的工作流等模式。

> 你可以探索并运行 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 版本库中的示例。每个项目都是独立的。你可以将每个项目用作参考或模板，用于构建基于 Kotlin 的 AI 应用程序。

### 连接主要模型提供商

使用 Kotlin 连接到主要模型提供商，例如 OpenAI、Anthropic、Google 等：

*   [OpenAI](https://github.com/openai/openai-java) — 适用于 OpenAI API 的官方 Java SDK。它涵盖响应和聊天、图像和音频。
*   [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) — 适用于 Claude Messages API 的官方 Java SDK。它包含用于 Vertex AI 和 Bedrock 集成的模块。
*   [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) — 官方 Java SDK，带有一个可在 Gemini API 和 Vertex AI 之间切换的单个客户端。
*   [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) — 适用于 Azure OpenAI Service 的官方 Java 客户端。它支持聊天补全和嵌入。
*   [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) — 用于调用基础模型的官方 SDK。它包括用于 Bedrock 和 Bedrock Runtime 的 Kotlin SDK 和 Java SDK。

### 创建 RAG 流水线和基于智能体的应用

*   [Spring AI](https://github.com/spring-projects/spring-ai) — 针对提示、聊天、嵌入、工具和函数调用以及向量存储的多提供商抽象。
*   [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) — 带有 Kotlin 扩展的 JVM 工具包，用于提示、工具、检索增强生成 (RAG) 流水线和智能体。

## 下一步

*   完成 [构建一个使用 Spring AI 回答问题的 Kotlin 应用](spring-ai-guide.md) 教程，了解更多关于在 IntelliJ IDEA 中使用 Spring AI 和 Kotlin 的信息
*   加入 [Kotlin 社区](https://kotlinlang.org/community/)，与其他使用 Kotlin 构建 AI 应用程序的开发者建立联系