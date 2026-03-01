# 为什么选择 Koog

Koog 旨在以 JetBrains 级的质量解决现实世界的问题。它提供先进的 AI 算法、开箱即用的成熟技术、Kotlin DSL，以及超越传统框架的强大 multiplatform（多平台）支持。

## 与 JVM 和 Kotlin 应用程序集成

Koog 提供专门为 JVM 和 Kotlin 开发者设计的 Kotlin 领域专用语言 (DSL)。这确保了与 Kotlin 和基于 Java 的应用程序的无缝集成，显著提高了生产力并提升了整体开发者体验。

## 经 JetBrains 产品实际验证

Koog 为多个 JetBrains 产品提供支持，包括内部 AI agent（智能体）。这种实际集成确保了 Koog 针对实际用例不断进行测试、完善和验证。它专注于实践中有效的内容，结合了来自广泛反馈和真实产品场景的见解。这种集成赋予了 Koog 与众不同的优势，使其脱颖而出。

## 开箱即用的高级解决方案

Koog 包含预构建的可组合解决方案，旨在简化并加速 agent 系统 (agentic systems) 的开发，使其区别于仅提供基础组件的框架：

* **多种历史记录压缩策略。** Koog 开箱即提供用于压缩和管理长期运行对话的高级策略，无需手动尝试各种方法。通过由 ML 工程师测试和完善的微调提示词 (prompt)、技术和算法，您可以依靠经过验证的方法来提高性能。有关压缩策略的更多详细信息，请参阅 [历史记录压缩](https://docs.koog.ai/history-compression/)。要探索 Koog 如何在现实场景中处理压缩和上下文管理，请查看[这篇文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
* **无缝 LLM 切换。** 您可以随时将对话切换到具有一组新可用工具的不同大型语言模型 (LLM)，而不会丢失现有的对话历史记录。Koog 会自动重写历史记录并处理不可用的工具，从而实现平滑过渡和自然的交互流。
* **高级持久化。** Koog 允许您恢复完整的 agent 状态机，而不仅仅是聊天消息。这支持了检查点 (checkpoint)、故障恢复，甚至能够回退到状态机执行中的任何一点。
* **强大的重试组件。** Koog 包含一种重试机制，允许您封装 agent 系统中的任何操作集，并重复执行，直到满足可配置的条件。您可以提供反馈并调整每次尝试，以确保结果可靠。如果 LLM 调用超时、工具未按预期工作或存在网络问题，Koog 可确保您的 agent 保持韧性并有效运行，即使在临时故障期间也是如此。更多技术细节请参见 [重试功能](https://docs.koog.ai/history-compression/)。
* **结合 Markdown DSL 的结构化类型流。** Koog 会流式传输 LLM 输出，并使用 Markdown DSL 将其解析为结构化的类型化事件。您可以为特定元素（如标题、列表项或正则模式）注册处理程序 (handler)，并实时仅接收相关部分。这种方法使用 Markdown 提供人类可读的反馈，并使用结构化类型提供机器可解析的数据，有效地消除了透明度不足的问题并增强了用户体验。它确保了可预测的输出以及带有渐进式内容渲染的动态用户界面。

## 广泛集成、多平台支持与增强的可观测性

Koog 支持在各种平台和环境中开发和部署 agent 应用程序：

* **多平台支持。** 您可以将 agent 应用程序部署到 JVM、JS、WasmJS、Android 和 iOS 目标平台。
* **广泛的 AI 集成。** Koog 与主要的 LLM 提供商（包括 OpenAI 和 Anthropic）以及企业级 AI 云（如 Bedrock）集成。它还支持本地模型（如 Ollama）。有关可用提供商的完整列表，请参阅 [LLM 提供商](https://docs.koog.ai/llm-providers/)。
* **OpenTelemetry 支持。** Koog 为 [W&B Weave](https://wandb.ai/site/weave/) 和 [Langfuse](https://langfuse.com/) 等流行的可观测性提供商提供开箱即用的集成，用于监控和调试 AI 应用程序。通过原生 OpenTelemetry 支持，您可以使用系统中已有的工具对 agent 进行跟踪 (trace)、记录日志和衡量指标。要了解更多信息，请参阅 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。
* **Spring Boot 和 Ktor 集成。** Koog 与广泛使用的企业级环境集成。
    * 如果您拥有 Ktor 服务器，可以将 Koog 作为插件 (plugin) 安装，使用配置文件配置提供商，并直接从任何路由调用 agent，而无需手动连接 LLM 客户端。
    * 对于 Spring Boot，Koog 提供即用型 bean 和自动配置的 LLM 客户端，让您可以轻松开始构建 AI 驱动的工作流。

## 与 ML 工程师和产品团队协作

Koog 的独特优势在于它与 JetBrains ML 工程师和产品团队的直接协作。这确保了使用 Koog 构建的功能不仅仅是理论上的，而是基于真实产品需求进行了测试和完善。这意味着 Koog 包含：

* **微调提示词和策略**：针对实际性能进行了优化。
* **经过验证的工程方法**：在产品开发过程中发现并验证，例如其独特的历史记录压缩策略。您可以在[这篇详细文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)中了解更多信息。
* **持续改进**：帮助 Koog 保持高效并适应不断变化的需求。

## 对开发者社区的承诺

Koog 团队致力于建立一个强大的开发者社区。通过积极收集和吸纳反馈，Koog 不断发展以有效满足开发者的需求。我们正积极扩展对多样化 AI 架构的支持、全面的基准测试、详细的用例指南和教育资源，以赋能开发者。

## 从哪里开始

* 在 [概览](index.md) 中探索 Koog 的功能。
* 参考我们的 [快速入门](quickstart.md) 指南构建您的第一个 Koog agent。
* 在 Koog [发布说明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
* 从 [示例](https://docs.koog.ai/examples/) 中学习。