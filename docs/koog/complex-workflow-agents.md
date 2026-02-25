# 复杂工作流代理

除了基础代理外，`AIAgent` 类还允许你通过定义自定义策略、工具、配置以及自定义输入/输出类型，来构建处理复杂工作流的代理。

!!! tip
    如果你是 Koog 的新手并想要创建最简单的代理，请从 [基础代理](basic-agents.md) 开始。

创建和配置此类代理的过程通常包括以下步骤：

1. 提供一个 Prompt 执行器 (Prompt executor) 以与 LLM 通信。
2. 定义一个控制代理工作流的策略。
3. 配置代理行为。
4. 实现供代理使用的工具。
5. 添加可选功能，如事件处理、内存或跟踪。
6. 使用用户输入运行代理。

## 前提条件

- 你拥有用于实现 AI 代理的 LLM 提供者提供的有效 API 密钥。有关所有可用提供者的列表，请参阅 [LLM 提供者](llm-providers.md)。

!!! tip
    使用环境变量或安全的配置管理系统来存储你的 API 密钥。避免直接在源代码中硬编码 API 密钥。

## 创建复杂工作流代理

### 1. 添加依赖项

要使用 `AIAgent` 功能，请在你的构建配置中包含所有必要的依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

有关所有可用的安装方法，请参阅 [安装 Koog](getting-started.md#install-koog)。

### 2. 提供 Prompt 执行器

Prompt 执行器用于管理和运行 Prompt。
你可以根据计划使用的 LLM 提供者选择 Prompt 执行器。
此外，你还可以使用其中一个可用的 LLM 客户端创建自定义 Prompt 执行器。
要了解更多信息，请参阅 [Prompt 执行器](prompts/prompt-executors.md)。

例如，要提供 OpenAI Prompt 执行器，你需要调用 `simpleOpenAIExecutor` 函数，并为其提供与 OpenAI 服务进行身份验证所需的 API 密钥：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

要创建一个可与多个 LLM 提供者协同工作的 Prompt 执行器，请执行以下操作：

1) 为所需的 LLM 提供者配置客户端及相应的 API 密钥。例如：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-complex-workflow-agents-02.kt -->
2) 将配置好的客户端传递给 `MultiLLMPromptExecutor` 类构造函数，以创建一个具有多个 LLM 提供者的 Prompt 执行器：
<!--- INCLUDE
import ai.koog.agents.example.exampleComplexWorkflowAgents02.anthropicClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.googleClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.openAIClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-complex-workflow-agents-03.kt -->

### 3. 定义策略

策略通过使用节点和边缘来定义代理的工作流。它可以具有任意输入和输出类型，这些类型可以在 `strategy` 函数的泛型参数中指定。这些也将成为 `AIAgent` 的输入/输出类型。输入和输出的默认类型均为 `String`。

!!! tip
    要详细了解策略，请参阅 [自定义策略图](custom-strategy-graphs.md)

#### 3.1. 理解节点和边缘

节点和边缘是策略的构建块。

节点代表代理策略中的处理步骤。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
class InputType

class OutputType

val transformedOutput = OutputType()
val strategy = strategy<InputType, OutputType>("Simple calculator") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 处理输入并返回输出
    // 你可以使用 llm.writeSession 与 LLM 交互
    // 你可以使用 callTool、callToolRaw 等调用工具
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->

!!! tip
    在代理策略中，你还可以使用一些预定义节点。要了解更多信息，请参阅 [预定义节点和组件](nodes-and-components.md)。

边缘定义了节点之间的连接。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // 处理输入并返回输出
        // 你可以使用 llm.writeSession 与 LLM 交互
        // 你可以使用 callTool、callToolRaw 等调用工具
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // 处理输入并返回输出
        // 你可以使用 llm.writeSession 与 LLM 交互
        // 你可以使用 callTool、callToolRaw 等调用工具
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 基础边缘
edge(sourceNode forwardTo targetNode)

// 带条件的边缘
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 返回 true 以遵循此边缘，返回 false 则跳过
    output.contains("specific text")
})

// 带转换的边缘
edge(sourceNode forwardTo targetNode transformed { output ->
    // 在将输出传递给目标节点之前对其进行转换
    "Modified: $output"
})

// 组合条件和转换
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->

#### 3.2. 实现策略

要实现代理策略，请调用 `strategy` 函数并定义节点和边缘。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 为策略定义节点
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定义节点之间的边缘
    // 开始 -> 发送输入
    edge(nodeStart forwardTo nodeSendInput)

    // 发送输入 -> 完成
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 发送输入 -> 执行工具
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 执行工具 -> 发送工具结果
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 发送工具结果 -> 完成
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 函数允许你定义多个子图，每个子图包含自己的一组节点和边缘。与使用简化的策略构建器相比，这种方法提供了更多的灵活性和功能。要详细了解子图，请参阅 [子图概览](subgraphs-overview.md)。

### 4. 配置代理

使用配置定义代理行为：
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
-->
```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        You are a simple calculator assistant.
        You can add two numbers together using the calculator tool.
        When the user provides input, extract the numbers they want to add.
        The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
        Extract the two numbers and use the calculator tool to add them.
        Always respond with a clear, friendly message showing the calculation and result.
        """.trimIndent()
)
```
<!--- KNIT example-complex-workflow-agents-07.kt -->

对于更高级的配置，你可以指定代理将使用的 LLM，并设置代理响应时可以执行的最大迭代次数：
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```
<!--- KNIT example-complex-workflow-agents-08.kt -->

### 5. 实现工具并设置工具注册表

工具让你的代理能够执行特定任务。
要使工具对代理可用，请将其添加到工具注册表中。
例如：
<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 实现一个可以相加两个数字的简单计算器工具
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 将工具添加到工具注册表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

要详细了解工具，请参阅 [工具](tools-overview.md)。

### 6. 安装功能

功能允许你为代理添加新能力、修改其行为、提供对外部系统和资源的访问，以及在代理运行时记录和监控事件。
以下功能可用：

- EventHandler
- AgentMemory
- Tracing

要安装功能，请调用 `install` 函数并将该功能作为参数提供。
例如，要安装事件处理程序功能，你需要执行以下操作：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// 安装 EventHandler 功能
installFeatures = {
    install(EventHandler) {
        onAgentStarting { eventContext: AgentStartingContext ->
            println("Starting agent: ${eventContext.agent.id}")
        }
        onAgentCompleted { eventContext: AgentCompletedContext ->
            println("Result: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

要了解有关功能配置的更多信息，请参阅专用页面。

### 7. 运行代理

使用前一阶段创建的配置选项创建代理，并使用提供的输入运行它：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.example.exampleComplexWorkflowAgents01.promptExecutor
import ai.koog.agents.example.exampleComplexWorkflowAgents06.agentStrategy
import ai.koog.agents.example.exampleComplexWorkflowAgents07.agentConfig
import ai.koog.agents.example.exampleComplexWorkflowAgents09.toolRegistry
import ai.koog.agents.features.eventHandler.feature.EventHandler
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("Starting agent: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("Result: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

        // 读取用户输入并发送给代理
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("The agent returned: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 处理结构化数据

`AIAgent` 可以处理来自 LLM 输出的结构化数据。有关更多详细信息，请参阅 [结构化数据处理](structured-output.md)。

## 使用并行工具调用

`AIAgent` 支持并行工具调用。此功能允许你并发处理多个工具，从而提高独立操作的性能。

有关更多详细信息，请参阅 [并行工具调用](tools-overview.md#parallel-tool-calls)。

## 完整代码示例

以下是代理的完整实现：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

-->
```kotlin
// 使用来自环境变量 API 密钥的 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 创建一个简单的策略
val agentStrategy = strategy("Simple calculator") {
    // 为策略定义节点
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定义节点之间的边缘
    // 开始 -> 发送输入
    edge(nodeStart forwardTo nodeSendInput)

    // 发送输入 -> 完成
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 发送输入 -> 执行工具
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 执行工具 -> 发送工具结果
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 发送工具结果 -> 完成
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// 配置代理
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 实现一个可以相加两个数字的简单计算器工具
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 将工具添加到工具注册表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 创建代理
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("Starting agent: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("Result: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

        // 读取用户输入并发送给代理
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("The agent returned: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->