# 为何选择 Koog

Koog 旨在以 JetBrains 级别的质量解决实际问题。
它提供先进的 AI 算法、开箱即用的经验证技术、Kotlin DSL 以及超越传统框架的强大多平台支持。

## 与 JVM 和 Kotlin 应用程序集成

Koog 提供了一种专为 JVM 和 Kotlin 开发者设计的 Kotlin 领域特定语言 (DSL)。
这确保了与基于 Kotlin 和 Java 的应用程序的平滑集成，
显著提高了生产力并增强了整体开发者体验。

## JetBrains 产品的实际验证

Koog 为包括内部 AI 代理在内的多个 JetBrains 产品提供支持。
这种实际集成确保了 Koog 能够根据实际用例持续进行测试、完善和验证。
它专注于实践中的有效方法，融合了广泛反馈和实际产品场景中的见解。
这种集成赋予了 Koog 区别于其他框架的优势。

## 开箱即用的高级解决方案

Koog 包含预构建的可组合解决方案，可简化并加速智能体系统的开发，使其区别于仅提供基本组件的框架：

*   **多种历史压缩策略。** Koog 开箱即用地提供了先进的策略来压缩和管理长期对话，无需手动尝试各种方法。凭借机器学习工程师测试和完善的精心调优的提示、技术和算法，您可以依靠经验证的方法来提高性能。关于压缩策略的更多细节，请参阅[历史压缩](https://docs.koog.ai/history-compression/)。要了解 Koog 如何在实际场景中处理压缩和上下文管理，请查阅[这篇文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
*   **无缝 LLM 切换。** 您可以在任何时候将对话切换到不同的大型语言模型 (LLM)，并使用一组新的可用工具，而不会丢失现有对话历史。Koog 会自动重写历史并处理不可用的工具，从而实现平滑过渡和自然的交互流程。
*   **高级持久化。** Koog 允许您恢复完整的智能体状态机，而不仅仅是聊天消息。这使得检查点、故障恢复，甚至回溯到状态机执行中任何时间点的功能成为可能。
*   **健壮的重试组件。** Koog 包含一个重试机制，允许您将智能体系统中的任何一组操作封装起来，并反复重试直到满足可配置的条件。您可以提供反馈并调整每次尝试，以确保可靠的结果。如果 LLM 调用超时、工具未能按预期工作或出现网络问题，Koog 可确保您的智能体即使在暂时性故障期间也能保持弹性和高效运行。有关更多技术细节，请参阅[重试功能](https://docs.koog.ai/history-compression/)。
*   **带有 Markdown DSL 的结构化类型化流式传输。** Koog 流式传输 LLM 输出，并使用 Markdown DSL 将其解析为结构化、类型化的事件。您可以为标题、项目符号点或正则表达式模式等特定元素注册处理程序，并实时接收仅相关的部分。这种方法通过 Markdown 提供人类可读的反馈，并使用结构化类型提供机器可解析的数据，有效消除了透明度不足的问题，并增强了用户体验。它确保了可预测的输出和具有渐进式内容渲染的动态用户界面。

## 广泛集成、多平台支持、增强可观测性

Koog 支持在各种平台和环境中开发和部署智能体应用程序：

*   **多平台支持**。您可以在 JVM、JS、WasmJS、Android 和 iOS 目标平台部署您的智能体应用程序。
*   **广泛的 AI 集成**。Koog 集成了主要的 LLM 提供商，包括 OpenAI 和 Anthropic，以及 Bedrock 等企业级 AI 云。它还支持 Ollama 等本地模型。有关可用提供商的完整列表，请参阅[LLM 提供商](https://docs.koog.ai/llm-providers/)。
*   **OpenTelemetry 支持**。Koog 提供与 [W&B Weave](https://wandb.ai/site/weave/) 和 [Langfuse](https://langfuse.com/) 等流行的可观测性提供商的开箱即用集成，用于监控和调试 AI 应用程序。借助原生 OpenTelemetry 支持，您可以使用系统中已有的相同工具来跟踪、记录和测量您的智能体。要了解更多信息，请参阅 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。
*   **Spring Boot 和 Ktor 集成**。Koog 与广泛使用的企业环境集成。
    *   如果您有 Ktor 服务器，您可以将 Koog 作为插件安装，使用配置文件配置提供商，并直接从任何路由调用智能体，而无需手动连接 LLM 客户端。
    *   对于 Spring Boot，Koog 提供即用型 bean 和自动配置的 LLM 客户端，使您能够轻松开始构建 AI 驱动的工作流。

## 与机器学习工程师和产品团队协作

Koog 的独特优势在于其与 JetBrains 机器学习工程师和产品团队的直接协作。
这确保了使用 Koog 构建的特性不仅是理论性的，而是基于实际产品需求进行测试和完善的。
这意味着 Koog 融入了：

*   **精心调优的提示和策略**，针对实际性能进行了优化。
*   **经验证的工程方法**，通过产品开发发现和验证，例如其独特的历史压缩策略。您可以在[这篇详细文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)中了解更多信息。
*   **持续改进**，帮助 Koog 保持高效并适应不断变化的需求。

## 对开发者社区的承诺

Koog 团队深度致力于建设一个强大的开发者社区。
通过积极收集和整合反馈，Koog 不断发展以有效满足开发者的需求。
我们正在积极扩展对多样 AI 架构、全面基准、详细用例指南
和教育资源的支持，以赋能开发者。

## 从何开始

*   在[概述](https://docs.koog.ai/)中探索 Koog 的能力。
*   通过我们的[入门指南](https://docs.koog.ai/getting-started/)构建您的第一个 Koog 智能体。
*   在 Koog [发布说明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md)中查看最新更新。
*   从[示例](https://docs.koog.ai/examples/)中学习。