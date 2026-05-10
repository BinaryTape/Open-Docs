# 示例

Koog 框架提供了一系列示例，帮助您了解如何针对不同的用例实现 AI 智能体。
示例涵盖了 **Kotlin** 和 **Java** 两种语言。
这些示例演示了您可以应用于自己应用程序的关键功能和模式。

浏览下面的示例，并点击链接在 GitHub 上查看源代码。

=== "Kotlin"

    | 示例 | 描述 |
    |-------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | [Attachments](examples/Attachments.md) | 了解如何在提示词中使用结构化 Markdown 和附件。构建包含图像的提示词，并使用 OpenAI 模型为 Instagram 帖子生成创意内容。 |
    | [Banking](examples/Banking.md) | 构建一个具有路由功能的综合 AI 银行助手，能够通过复杂的基于图的策略处理转账和交易分析。包含领域建模、工具创建和智能体组合模式。 |
    | [BedrockAgent](examples/BedrockAgent.md) | 使用集成了 AWS Bedrock 的 Koog 框架创建智能 AI 智能体。了解如何定义自定义工具、设置 AWS Bedrock，并构建能够理解自然语言命令以控制设备的交互式智能体。 |
    | [Calculator](examples/Calculator.md) | 构建一个计算器智能体，使用加、减、乘、除工具执行算术运算。演示了并行工具调用、事件日志记录和多执行器支持（OpenAI 和 Ollama）。 |
    | [Chess](examples/Chess.md) | 构建一个智能国际象棋智能体，具有复杂的领域建模、自定义工具、内存优化技术和交互式选项选择功能。演示了高级智能体策略、游戏状态管理和人机协作模式。 |
    | [GoogleMapsMcp](examples/GoogleMapsMcp.md) | 通过 Docker 将 Koog 连接到 Google Maps MCP 服务器。在 Kotlin Notebook 环境中，使用带有真实地理 API 的 AI 智能体发现工具、对地址进行地理编码并获取海拔数据。 |
    | [Guesser](examples/Guesser.md) | 构建一个数字猜谜智能体，使用工具提出有针对性的问题来实现二分搜索策略。该智能体通过策略性提问有效地缩小用户数字的范围，并演示了基于工具的交互模式。 |
    | [Langfuse](examples/Langfuse.md) | 了解如何使用 OpenTelemetry 将 Koog 智能体跟踪导出到 Langfuse。设置环境变量、运行智能体，并在 Langfuse 实例中检查 span 和跟踪，以实现全面的可观察性。 |
    | [MCP](https://github.com/JetBrains/koog/tree/develop/examples/src/main/kotlin/ai/koog/agents/example/mcp) | 模型上下文协议 (Model Context Protocol) 的集成示例，包含用于地理数据的 `GoogleMapsMcpClient` 和用于浏览器自动化的 `PlaywrightMcpClient`。 |
    | [Memory](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/memory) | 一个演示内存系统用法的客户支持智能体。该智能体使用加密的本地存储以及带有主题和作用域的适当内存组织方式，来跟踪用户的对话偏好、设备诊断和组织特定信息。 |
    | [OpenTelemetry](examples/OpenTelemetry.md) | 为 Koog AI 智能体添加基于 OpenTelemetry 的跟踪。了解如何将 span 发送到控制台进行调试，并将跟踪导出到 OpenTelemetry Collector 以在 Jaeger 中查看。包含 Docker 设置和故障排除指南。 |
    | [Planner](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/planner) | 一个任务规划系统，用于构建具有并行和顺序执行节点的执行树，为复杂的工作流动态构建执行计划。 |
    | [PlaywrightMcp](examples/PlaywrightMcp.md) | 使用 Playwright MCP 和 Koog 驱动浏览器。启动 Playwright MCP 服务器，通过 SSE 连接，并让 AI 智能体通过自然语言命令自动执行导航、接受 Cookie 和 UI 交互等 Web 任务。 |
    | [SimpleAPI](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/simpleapi) | 演示聊天智能体和具有简单 API 模式的基础智能体的示例，用于快速入门 Koog。 |
    | [StructuredData](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/structuredoutput) | 演示基于 JSON 的结构化数据输出，包含复杂的嵌套类、多态以及天气预报示例，展示了如何在智能体响应中处理类型化数据。 |
    | [SubgraphWithTask](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/subgraphwithtask) | 项目生成工具，展示了文件和目录操作，包括使用子图策略进行创建、删除和命令执行。 |
    | [Tone](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/tone) | 一个文本语气分析智能体，使用专用工具识别输入文本中的积极、消极或中性语气，演示了情感分析能力。 |
    | [UnityMcp](examples/UnityMcp.md) | 使用 Unity MCP 服务器集成，通过 AI 智能体驱动 Unity 游戏开发。通过 stdio 连接到 Unity，发现可用工具，并让智能体通过自然语言命令修改场景、放置对象并执行游戏开发任务。 |
    | [VaccumAgent](examples/VaccumAgent.md) | 使用 Koog 框架实现的基础反射智能体。涵盖了简单双单元格世界中自动化清洁任务的环境建模、工具创建和智能体行为。 |
    | [Weave](examples/Weave.md) | 了解如何使用 OpenTelemetry (OTLP) 将 Koog 智能体跟踪到 W&B Weave向。设置环境变量、运行智能体并在 Weave UI 中查看丰富的跟踪，以进行全面监控和调试。 |
    | [A2A](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a) | 演示使用 Koog 框架的智能体间 (A2A) 通信。展示了如何设置 AI 智能体之间的双向通信，实现协作式问题解决，并通过适当的消息路由和协调来管理多智能体工作流。 |

=== "Java"

    | 示例 | 描述 |                                                                                                                                                                            
    |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|                                                                                                                                                                            
    | [Calculator](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/calculator/Calculator.java) | 构建一个基于图的计算器智能体。演示了使用 `ToolSet` 定义的工具、具有类型化边和条件路由的多节点图策略、自动历史记录压缩、事件处理以及多执行器支持（OpenAI 和 Ollama）。 |
    | [FunctionalAgentChat](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/chat/FunctionalAgentChat.java) | 使用 [函数式策略](agents/functional-agents.md) 构建一个交互式聊天智能体。运行由 Llama 3.2 模型驱动的连续对话循环，接受用户输入直到输入 `/bye`。 |                                                            
    | [ChatMemoryJdbc](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/chatmemory/ChatMemoryJdbcExample.java) | 使用基于 JDBC PostgreSQL 提供程序的 [`ChatMemory`](features/chat-memory/index.md) 功能实现跨会话的对话历史持久化。演示了创建具有 24 小时 TTL、架构迁移的 JDBC 驱动聊天历史记录提供程序，以及构建带聊天内存的智能体。需要在本地或通过 Docker 运行 PostgreSQL。 |
    | [FunctionalStrategy](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/strategies/functional/FunctionalStrategyExample.java) | 实现具有类型化子任务、每步工具作用域设置以及迭代验证与修复循环的多步函数式策略，以产出经过验证的解决方案。 |                                        
    | [GoapStrategy](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/strategies/GoapStrategyExample.java) | 使用 GOAP（面向目标的动作规划）构建一个基于规划器的智能体。定义类型化信念状态、动作前置条件和目标条件，以引导迭代式问题解决和自我修正。 |                         
    | [GraphStrategy](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/strategies/GraphStrategyExample.java) | 构建一个具有通过条件边连接的类型化子图的基于图的问题解决智能体。实现一个使用 LLM 作为评审员 (LLM-as-a-judge) 来验证解决方案的问题解决流水线。 |                        
    | [CustomSubgraph](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/subgraphs/CustomSubgraphExample.java) | 构建一个多子图智能体策略。实现 3 个顺序连接的子图，分别处理使用 Web 搜索工具的研究、大纲规划以及编写最终的文章摘要。 |                                            
    | [OpenTelemetry](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/features/opentelemetry/OpenTelemetryExample.java) | 为 Koog AI 智能体添加基于 OpenTelemetry 的跟踪。配置用于本地调试的控制台日志导出器和用于在 Jaeger 中查看 span 的 OTLP/gRPC 导出器。包含 Docker 设置。 |     
    | [Langfuse](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/features/opentelemetry/langfuse/LangfuseExample.java) | 通过 OpenTelemetry 将 Koog 智能体跟踪导出到 Langfuse。演示了如何配置自定义属性（如会话 ID 和跟踪标签）以增强可观察性。 |                                               
    | [Weave](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/features/opentelemetry/weave/WeaveExample.java) | 使用 OpenTelemetry (OTLP) 将 Koog 智能体跟踪到 W&B Weave。设置环境变量、运行智能体并在 Weave UI 中查看丰富的跟踪。 |                                                            
    | [PersistenceJdbc](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples-java/src/main/java/ai/koog/agents/example/snapshot/PersistenceJdbcExample.java) | 构建一个使用基于 JDBC PostgreSQL 提供程序的 `Persistence` 功能的智能体。Persistence 功能会在每个节点执行后自动创建检查点，允许智能体在重新启动后从中断处恢复。需要在本地或通过 Docker 运行 PostgreSQL。 |