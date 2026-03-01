# Agent

AI Agent 是能够进行推理、做出决策、与环境交互并采取行动以实现特定目标的自主系统。
在 Koog 中，AI Agent 不仅仅是一个 LLM 的包装器；
它是一个为 JVM 生态系统设计的结构化、类型安全的状态机。

Koog Agent 基于以下核心概念构建：

- [prompt 执行器](../prompts/prompt-executors.md)负责管理和执行 prompt，使 Agent 能够与 LLM 交互进行推理和决策。
- [策略](../nodes-and-components.md)定义了 Agent 的工作流。它可以是有向图、函数或规划器的形式。请参阅 [Agent 类型](#agent-types)。
- Agent 可以使用[工具](../tools-overview.md)与外部数据源和服务进行交互。
- 您可以使用[功能](../features-overview.md)来扩展和增强 AI Agent 的功能性。

!!! tip

    有关创建和运行最小化 Agent 的信息，请参阅[快速入门](../quickstart.md)。

## Agent 类型

根据您需要执行的任务，Koog 提供了几种 Agent 类型：

- [基础 Agent](basic-agents.md) 非常适合不需要任何自定义逻辑的简单任务。这些 Agent 实现了一种适用于大多数常见用例的预定义策略。
- [基于图的 Agent](graph-based-agents.md) 提供了对 Agent 工作流、状态管理和可视化的完全控制和灵活性。
- [函数式 Agent](functional-agents.md) 使您能够快速将自定义逻辑原型化为一个可以访问 Agent 上下文的函数。
- [规划器 Agent](planner-agents/index.md) 可以通过迭代循环自主规划并执行多步任务，直到达到所需的最终状态。

## Agent 配置

Agent 配置定义了 Agent 的执行参数，包括初始 prompt、语言模型和迭代限制。

!!! tip

    有关创建和运行最小化 Agent 的信息，请参阅[快速入门](../quickstart.md)。

对于简单的 Agent，除了强制性的 prompt 执行器和语言模型外，您还可以直接在 Agent 构造函数中指定初始系统 prompt 和其他一些参数：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "你是一个得力的助手。",
    temperature = 0.7,
    maxIterations = 10
)
```
<!--- KNIT example-agent-config-01.kt -->

或者，您可以创建一个 [`AIAgentConfig`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.config/-a-i-agent-config/index.html) 实例来更细粒度地定义 Agent 的行为和参数，然后将其传递给 Agent 构造函数。这使您能够定义包含多条消息、对话历史记录、LLM 参数以及其他执行参数的复杂 prompt。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt(
        id = "assistant",
        params = LLMParams(
            temperature = 0.7
        )
    ) {
        system("你是一个得力的助手。")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    agentConfig = agentConfig
)
```
<!--- KNIT example-agent-config-02.kt -->

以下是 `AIAgentConfig` 的参数：

- `prompt` 定义初始 [prompt](../prompts/prompt-creation/index.md) 和 [LLM 参数](../llm-parameters.md)。

- `model` 指定 Agent 与之交互的语言模型。您可以使用预定义模型之一，也可以[创建自定义模型配置](../model-capabilities.md#creating-a-model-llmodel-configuration)。

- `maxAgentIterations` 限制 Agent 在终止前可以执行的最大步骤数。每一步都是 Agent 工作流中的一个[节点](../nodes-and-components.md)。

- `missingToolsConversionStrategy` 定义 Agent 执行期间处理缺失工具的策略。

[//]: # (TODO 在工具部分编写关于缺失工具的内容并从此处链接)

- `responseProcessor` 可用于定义自定义响应处理程序。例如，它可以审核和验证响应内容、更改响应格式或记录响应。

[//]: # (TODO 在某处编写关于响应处理的内容？)