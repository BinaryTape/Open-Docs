# 概述

Koog 是一个开源的 JetBrains 框架，用于构建 AI 智能体，它采用专为 JVM 和 Kotlin 开发者设计的、地道的、类型安全的 Kotlin DSL。它允许你创建能够与工具交互、处理复杂工作流以及与用户通信的智能体。

你可以使用模块化特性系统自定义智能体功能，并通过 Kotlin Multiplatform 将你的智能体部署到 JVM、JS、WasmJS、Android 和 iOS 目标平台。

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**开始使用**](getting-started.md)

    ---

    构建并运行你的第一个 AI 智能体

-   :material-book-open-variant:{ .lg .middle } [**术语表**](glossary.md)

    ---

    学习基本术语

</div>

## 智能体类型

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**基本智能体**](basic-agents.md)

    ---

    创建并运行处理单个输入并提供响应的智能体

-   :material-script-text-outline:{ .lg .middle } [**函数式智能体**](functional-agents.md)

    ---

    创建并运行具备纯 Kotlin 中自定义逻辑的轻量智能体

-   :material-graph-outline:{ .lg .middle } [**复杂工作流智能体**](complex-workflow-agents.md)

    ---

    创建并运行处理复杂工作流并具备自定义策略的智能体

-   :material-state-machine:{ .lg .middle } [**规划智能体**](planner-agents.md)

    ---

    创建并运行迭代构建和执行计划的智能体

</div>

## 核心功能

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**提示词**](prompts/index.md)

    ---

    创建提示词，使用 LLM 客户端或提示词执行器运行它们，
    在 LLM 和提供商之间切换，并通过内置重试处理故障

-   :material-wrench:{ .lg .middle } [**工具**](tools-overview.md)

    ---

    通过内置、基于注解或基于类的工具来增强你的智能体，
    这些工具可以访问外部系统和 API

-   :material-share-variant-outline:{ .lg .middle } [**策略**](predefined-agent-strategies.md)

    ---

    使用直观的基于图的工作流来设计复杂的智能体行为

-   :material-bell-outline:{ .lg .middle } [**事件**](agent-events.md)

    ---

    使用预定义处理器监控和处理智能体生命周期、策略、节点、LLM 调用和工具调用事件

</div>

## 高级用法

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**历史记录压缩**](history-compression.md)

    ---

    使用先进技术，在长时间运行的对话中保持上下文的同时优化 token 用量

-   :material-state-machine:{ .lg .middle } [**智能体持久化**](agent-persistence.md)

    ---

    在执行期间的特定点恢复智能体状态
        

-   :material-code-braces:{ .lg .middle } [**结构化输出**](structured-output.md)

    ---

    以结构化格式生成响应

-   :material-waves:{ .lg .middle } [**Streaming API**](streaming-api.md)

    ---

    通过流式支持和并行工具调用来实时处理响应

-   :material-database-search:{ .lg .middle } [**知识检索**](embeddings.md)

    ---

    通过 [向量嵌入](embeddings.md)、[排序文档存储](ranked-document-storage.md) 和 [共享智能体记忆](agent-memory.md)，在对话中留存和检索知识

-   :material-timeline-text:{ .lg .middle } [**追踪**](tracing.md)

    ---

    通过详细且可配置的追踪来调试和监控智能体执行

</div>

## 集成

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    在 AI 智能体中直接使用 MCP 工具

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    将 Koog 添加到你的 Spring 应用程序

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    将 Koog 与 Ktor 服务器集成

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    使用流行的可观测性工具追踪、日志和测量你的智能体

-   :material-lan:{ .lg .middle } [**A2A Protocol**](a2a-protocol-overview.md)

    ---

    通过共享协议连接智能体和服务

</div>