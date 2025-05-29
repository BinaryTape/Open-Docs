[//]: # (title: Kotlin 用于 AI 驱动的应用程序开发)

Kotlin 为构建 AI 驱动的应用程序提供了现代化且实用的基础。它可用于跨平台，与成熟的 AI 框架良好集成，并支持常见的 AI 开发模式。

> 本页介绍 Kotlin 如何在真实世界的 AI 场景中使用，并附带来自
> [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 仓库的实际工作示例。
> 
{style="note"}

## Kotlin AI 智能体框架 – Koog

[Koog](https://koog.ai) 是一个基于 Kotlin 的框架，用于在本地创建和运行 AI 智能体，无需外部服务。Koog 是 JetBrains 创新性的开源智能体框架，它使开发者能够在 JVM 生态系统中构建 AI 智能体。它提供了一个纯 Kotlin 实现，用于构建能够与工具交互、处理复杂工作流并与用户通信的智能体。

## 更多用例

Kotlin 在 AI 开发中还有许多其他用例。从将语言模型集成到后端服务，到构建 AI 驱动的用户界面，这些示例展示了 Kotlin 在各种 AI 应用程序中的多功能性。

### 检索增强生成 (Retrieval-augmented generation) 

使用 Kotlin 构建检索增强生成 (RAG) 管道，将语言模型连接到文档、向量存储或 API 等外部来源。例如：

* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): 一个 Spring Boot 应用程序，将 Kotlin 标准库文档加载到向量存储中，并支持基于文档的问答。
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): 一个使用 LangChain4j 的极简 RAG 示例。

### 基于智能体的应用程序

在 Kotlin 中构建能够使用语言模型和工具进行推理、规划和行动的 AI 智能体。例如：

* [`koog`](https://github.com/JetBrains/koog): 展示了如何使用 Kotlin 智能体框架 Koog 构建 AI 智能体。
* [`langchain4j-spring-boot`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/langchain4j/langchain4j-spring-boot): 包含一个使用 LangChain4j 构建的简单工具使用智能体。

### 思维链提示 (Chain of thought prompting)

实现引导语言模型进行多步推理的结构化提示技术。例如：

* [`LangChain4j_Overview.ipynb`](https://github.com/Kotlin/Kotlin-AI-Examples/blob/master/notebooks/langchain4j/LangChain4j_Overview.ipynb): 一个 Kotlin Notebook 演示了思维链和结构化输出。

### 后端服务中的 LLM (LLMs in backend services)

使用 Kotlin 和 Spring 将 LLM 集成到业务逻辑或 REST API 中。例如：

* [`spring-ai-examples`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/spring-ai-examples): 包含分类、聊天和摘要示例。
* [`springAI-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo): 演示了 LLM 响应与应用程序逻辑的完整集成。

### 带有 AI 的多平台用户界面

使用 Compose Multiplatform 在 Kotlin 中构建交互式 AI 驱动的用户界面。例如：

* [`mcp-demo`](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/mcp/mcp-demo): 一个连接到 Claude 和 OpenAI，并使用 Compose Multiplatform 展示响应的桌面 UI。

## 探索示例

您可以从 [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 仓库探索和运行示例。每个项目都是独立的。您可以将每个项目用作构建基于 Kotlin 的 AI 应用程序的参考或模板。

## 接下来

* 完成 [使用 Spring AI 构建 Kotlin 应用程序以基于 Qdrant 中存储的文档回答问题](spring-ai-guide.md)
  教程，以了解更多关于在 IntelliJ IDEA 中使用 Spring AI 和 Kotlin 的信息。
* 加入 [Kotlin 社区](https://kotlinlang.org/community/) 与其他使用 Kotlin 构建 AI 应用程序的开发者交流。