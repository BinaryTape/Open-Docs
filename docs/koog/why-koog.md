# 为什么选择 Koog

Koog 旨在以 JetBrains 级的质量解决现实世界的问题。
它提供先进的 AI 算法、开箱即用的成熟技术、Kotlin DSL、流式 Java API，以及超越传统框架的强大多平台支持。

它的首要重点是可靠性 —— 使 AI agent 能够放心地用于要求苛刻的企业级环境。

## 与 Java 和 Kotlin 应用程序集成

Koog 提供专门为 Kotlin 开发者设计的 Kotlin 领域专用语言 (DSL)，以及为 Java 用户提供的流式 Java API。
同一个框架在两种 JVM 语言中都提供了原生感，确保无缝集成到 Kotlin 和 Java 应用程序中，同时显著提高生产力并提升整体开发者体验。

## 经 JetBrains 产品实际验证

Koog 为多个 JetBrains 产品提供支持，包括内部 AI agent。
这种实际集成确保了 Koog 针对实际用例不断进行测试、完善和验证。
它专注于实践中有效的内容，结合了来自广泛反馈和真实产品场景的见解。
这种集成赋予了 Koog 与众不同的优势，使其脱颖而出。

## 开箱即用的高级解决方案

Koog 包含预构建的可组合解决方案，旨在简化并加速 agent 系统 (agentic systems) 的开发，使其区别于仅提供基础组件的框架：

* **基于领域建模的图工作流。** 将 AI 工作流建模为构建在经过验证的领域模型之上的显式图。通过将需求表达为结构化 data class，而不是依赖朴素的提示词编写，您可以实现对 agent 行为的精确控制，并显著提高可靠性和可预测性。
* **多种历史记录压缩策略。** Koog 开箱即提供用于压缩和管理长期运行对话的高级策略，无需手动尝试各种方法。通过由 ML 工程师测试和完善的微调提示词、技术和算法，您可以依靠经过验证的方法来提高性能。有关压缩策略的更多详细信息，请参阅 [历史记录压缩](https://docs.koog.ai/history-compression/)。要探索 Koog 如何在现实场景中处理压缩和上下文管理，请查看[这篇文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)。
* **高级持久化（持久执行）。** Koog 允许您恢复完整的 agent 状态机，而不仅仅是聊天消息。这支持了检查点、故障恢复，甚至能够回退到状态机执行中的任何一点。
* **全现代 agent 模式，一个框架。** 图工作流、GOAP (目标导向动作规划) 和 LLM 规划、多 agent 编排 —— 完全支持且完全可组合。构建您的用例所需的精确 agent。
* **无缝 LLM 切换。** 您可以随时将对话切换到具有一组新可用工具的不同大型语言模型 (LLM)，而不会丢失现有的对话历史记录。Koog 会自动重写历史记录并处理不可用的工具，从而实现平滑过渡和自然的交互流。
* **强大的重试组件。** Koog 包含一种重试机制，允许您封装 agent 系统中的任何操作集，并重复执行，直到满足可配置的条件。您可以提供反馈并调整每次尝试，以确保结果可靠。如果 LLM 调用超时、工具未按预期工作或存在网络问题，Koog 可确保您的 agent 保持韧性并有效运行，即使在临时故障期间也是如此。更多技术细节请参见 [重试功能](https://docs.koog.ai/history-compression/)。

## 广泛集成、多平台支持与增强的可观测性

Koog 支持在各种平台和环境中开发和部署 agent 应用程序：

* **Spring Boot、Spring AI 和 Ktor 集成。** Koog 与广泛使用的企业级环境集成。
    * 对于 Spring Boot，Koog 提供即用型 bean 和自动配置的 LLM 客户端，让您可以轻松开始构建 AI 驱动的工作流。
    * 如果您已经在使用 Spring AI 来实现 LLM 和 RAG 功能，可以将 Koog 作为编排和 agent 框架叠加在顶层。这允许您利用 Spring AI 广泛集成的同时，受益于 Koog 先进、可靠且具有成本效益的 AI 工作流。
    * 如果您拥有 Ktor 服务器，可以将 Koog 作为插件安装，使用配置文件配置提供商，并直接从任何路由调用 agent，而无需手动连接 LLM 客户端。
* **多平台支持。** 您可以将 agent 应用程序部署到 JVM、JS、WasmJS、Android 和 iOS 目标平台。
* **广泛的 AI 集成。** Koog 与主要的 LLM 提供商（包括 OpenAI、Anthropic、Google、DeepSeek、Mistral、Alibaba）以及企业级 AI 云（如 Bedrock）集成。它还支持本地模型（如 Ollama）。有关可用提供商的完整列表，请参阅 [LLM 提供商](https://docs.koog.ai/llm-providers/)。
* **OpenTelemetry 支持。** Koog 为 [W&B Weave](https://wandb.ai/site/weave/)、[Langfuse](https://langfuse.com/) 和 [DataDog](https://www.datadoghq.com/) 等流行的可观测性提供商提供开箱即用的集成，用于监控和调试 AI 应用程序。通过原生 OpenTelemetry 支持，您可以使用系统中已有的工具对 agent 进行跟踪、记录日志和衡量指标。要了解更多信息，请参阅 [OpenTelemetry](https://docs.koog.ai/opentelemetry-support/)。

## 与 ML 工程师和产品团队协作

Koog 的独特优势在于它与 JetBrains ML 工程师和产品团队的直接协作。
这确保了使用 Koog 构建的功能不仅仅是理论上的，而是基于真实产品需求进行了测试和完善。
这意味着 Koog 包含：

* **微调提示词和策略**：针对实际性能进行了优化。
* **经过验证的工程方法**：在产品开发过程中发现并验证，例如其独特的历史记录压缩策略。您可以在[这篇详细文章](https://blog.jetbrains.com/ai/2025/07/when-tool-calling-becomes-an-addiction-debugging-llm-patterns-in-koog/)中了解更多信息。
* **持续改进**：帮助 Koog 保持高效并适应不断变化的需求。

## 对开发者社区的承诺

Koog 团队致力于建立一个强大的开发者社区。
通过积极收集和吸纳反馈，Koog 不断发展以有效满足开发者的需求。
我们正积极扩展对多样化 AI 架构的支持、全面的基准测试、详细的用例指南和教育资源，以赋能开发者。

## 从哪里开始

* 在 [概览](index.md) 中探索 Koog 的功能。
* 参考我们的 [快速入门](quickstart.md) 指南构建您的第一个 Koog agent。
* 在 Koog [发布说明](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md) 中查看最新更新。
* 从 [示例](https://docs.koog.ai/examples/) 中学习。