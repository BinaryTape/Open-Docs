# 概览

Koog 是一个开源的 JetBrains 框架，用于构建具有符合语言习惯的、类型安全的 Kotlin DSL 的 AI 智能体，专门为 JVM 和 Kotlin 开发者设计。
它允许您创建可以与工具交互、处理复杂工作流并与用户交流的智能体。

您可以通过模块化功能系统自定义智能体功能，并使用 Kotlin Multiplatform 将您的智能体部署到 JVM、JS、WasmJS、Android 和 iOS 目标。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**快速入门**](quickstart.md)

    ---

    构建并运行您的第一个 AI 智能体

-   :material-book-open-variant:{ .lg .middle } [**术语表**](glossary.md)

    ---

    学习核心术语

</div>

## 智能体

详细了解[智能体概览](agents/index.md)以及如何使用 Koog 创建不同类型的智能体：

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基础智能体**](agents/basic-agents.md)

    ---

    使用适用于大多数常见用例的预定义策略

-   :material-function:{ .lg .middle } [**函数式智能体**](agents/functional-agents.md)

    ---

    使用纯 Kotlin 将自定义逻辑定义为 lambda 函数 

-   :material-graph-outline:{ .lg .middle } [**基于图的智能体**](agents/graph-based-agents.md)

    ---

    将自定义工作流实现为策略图

-   :material-list-status:{ .lg .middle } [**规划者智能体**](agents/planner-agents/index.md)

    ---

    迭代地构建和执行计划，直到状态符合预期条件

</div>

## 核心组件

详细了解 Koog 智能体的核心组件：

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**提示词 (Prompts)**](prompts/index.md)

    ---

    创建、管理并运行驱动智能体与 LLM 交互的提示词

-   :material-strategy:{ .lg .middle } [**策略 (Strategies)**](predefined-agent-strategies.md)

    ---

    将智能体的预期工作流设计为有向图

-   :material-tools:{ .lg .middle } [**工具 (Tools)**](tools-overview.md)

    ---

    使智能体能够与外部数据源和服务进行交互

-   :material-toy-brick-outline:{ .lg .middle } [**功能 (Features)**](features-overview.md)

    ---

    扩展并增强 AI 智能体的功能

</div>

## 高级用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**历史压缩**](history-compression.md)

    ---

    使用先进技术在保持长期对话上下文的同时优化 token 使用量

-   :material-floppy:{ .lg .middle } [**智能体持久化**](agent-persistence.md)

    ---

    在执行期间的特定点恢复智能体状态
        

-   :material-code-braces:{ .lg .middle } [**结构化输出**](structured-output.md)

    ---

    以结构化格式生成响应

-   :material-waves:{ .lg .middle } [**流式 API (Streaming API)**](streaming-api.md)

    ---

    通过流式支持和并行工具调用实时处理响应

-   :material-database-search:{ .lg .middle } [**知识检索**](embeddings.md)

    ---

    使用[向量嵌入](embeddings.md)、[分级文档存储](ranked-document-storage.md)和[共享智能体内存](agent-memory.md)在对话中保留和检索知识

-   :material-timeline-text:{ .lg .middle } [**跟踪 (Tracing)**](tracing.md)

    ---

    通过详细的、可配置的跟踪来调试和监控智能体执行

-   :material-timeline-text:{ .lg .middle } [**长期记忆**](long-term-memory.md)

    ---

    集成向量数据库和记忆提供程序，用于 RAG 和持久化记忆。

</div>

## 集成

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**模型上下文协议 (MCP)**](model-context-protocol.md)

    ---

    在 AI 智能体中直接使用 MCP 工具

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    将 Koog 添加到您的 Spring 应用程序中

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    将 Koog 与 Ktor 服务器集成

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    使用流行的可观测性工具跟踪、记录并测量您的智能体

-   :material-lan:{ .lg .middle } [**A2A 协议**](a2a-protocol-overview.md)

    ---

    通过共享协议连接智能体和服务

</div>