# 复杂工作流代理

除了单次运行代理，`AIAgent` 类还允许您通过定义自定义策略、工具和配置来构建处理复杂工作流的代理。

创建和配置此类代理的过程通常包括以下步骤：

1. 提供一个提示执行器与 LLM 通信。
2. 定义一个控制代理工作流的策略。
3. 配置代理行为。
4. 实现供代理使用的工具。
5. 添加可选特性，例如事件处理、记忆或追踪。
6. 使用用户输入运行代理。

## 前提条件

- 您拥有用于实现 AI 代理的 LLM 提供商提供的有效 API 密钥。有关所有可用提供商的列表，请参见 [概述](index.md)。

!!! tip
    使用环境变量或安全的配置管理系统来存储您的 API 密钥。
    避免将 API 密钥直接硬编码到源代码中。

## 创建单次运行代理

### 1. 添加依赖项

要使用 `AIAgent` 功能，请在您的构建配置中包含所有必要的依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

有关所有可用的安装方法，请参见 [安装](index.md#installation)。

### 2. 提供提示执行器

提示执行器管理并运行提示。
您可以根据计划使用的 LLM 提供商选择提示执行器。
此外，您可以使用其中一个可用的 LLM 客户端创建自定义提示执行器。
欲了解更多信息，请参见 [提示执行器](prompt-api.md#prompt-executors)。

例如，要提供 OpenAI 提示执行器，您需要调用 `simpleOpenAIExecutor` 函数，并提供与 OpenAI 服务进行身份验证所需的 API 密钥：

```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```

要创建与多个 LLM 提供商协作的提示执行器，请执行以下操作：

1. 使用相应的 API 密钥配置所需 LLM 提供商的客户端。例如：
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2. 将配置好的客户端传递给 `DefaultMultiLLMPromptExecutor` 类构造函数，以创建支持多个 LLM 提供商的提示执行器：
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```

### 3. 定义策略

策略通过使用节点和边来定义代理的工作流。

#### 3.1. 理解节点和边

节点和边是策略的构建块。

节点代表代理策略中的处理步骤。

```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 处理输入并返回输出
    // 您可以使用 llm.writeSession 与 LLM 交互
    // 您可以使用 callTool, callToolRaw 等调用工具
    transformedOutput
}
```
!!! tip
    还有一些预定义节点可供您在代理策略中使用。欲了解更多信息，请参见 [预定义节点和组件](nodes-and-components.md)。

边定义了节点之间的连接。

```kotlin
// 基本边
edge(sourceNode forwardTo targetNode)

// 带条件的边
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 返回 true 以跟随此边，返回 false 以跳过此边
    output.contains("specific text")
})

// 带转换的边
edge(sourceNode forwardTo targetNode transformed { output ->
    // 在将输出传递给目标节点之前对其进行转换
    "Modified: $output"
})

// 条件和转换组合
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
#### 3.2. 实现策略

要实现代理策略，请调用 `strategy` 函数并定义节点和边。例如：

```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 定义策略的节点
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定义节点之间的边
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
!!! tip
    `strategy` 函数允许您定义多个子图，每个子图包含其自身的节点和边集。
    这种方法与使用简化的策略构建器相比，提供了更大的灵活性和功能性。
    欲了解更多关于子图的信息，请参见 [子图](subgraphs-overview.md)。

### 4. 配置代理

使用配置定义代理行为：

```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        您是一个简单的计算器助手。
        您可以使用计算器工具将两个数字相加。
        当用户提供输入时，提取他们想要相加的数字。
        输入可能是各种格式，例如“add 5 and 7”、“5 + 7”或仅仅是“5 7”。
        提取这两个数字并使用计算器工具将它们相加。
        始终以清晰友好的消息回应，显示计算过程和结果。
        """.trimIndent()
)
```

对于更高级的配置，您可以指定代理将使用的 LLM，并设置代理为响应而执行的最大迭代次数：

```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                您是一个简单的计算器助手。
                您可以使用计算器工具将两个数字相加。
                当用户提供输入时，提取他们想要相加的数字。
                输入可能是各种格式，例如“add 5 and 7”、“5 + 7”或仅仅是“5 7”。
                提取这两个数字并使用计算器工具将它们相加。
                始终以清晰友好的消息回应，显示计算过程和结果。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```

### 5. 实现工具并设置工具注册表

工具让您的代理执行特定任务。
要使工具可供代理使用，请将其添加到工具注册表。
例如：

```kotlin
// 实现一个可以相加两个数字的简单计算器工具
@LLMDescription("用于执行基本算术操作的工具")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("将两个数字相加并返回它们的和")
    fun add(
        @LLMDescription("第一个要相加的数字（整数值）")
        num1: Int,

        @LLMDescription("第二个要相加的数字（整数值）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return " $num1 和 $num2 的和是: $sum"
    }
}

// 将工具添加到工具注册表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```

欲了解更多关于工具的信息，请参见 [工具](tools-overview.md)。

### 6. 安装特性

特性允许您为代理添加新功能、修改其行为、提供对外部系统和资源的访问，并在代理运行时记录和监控事件。
以下特性可用：

- EventHandler
- AgentMemory
- Tracing

要安装该特性，请调用 `install` 函数并将该特性作为实参提供。
例如，要安装事件处理特性，您需要执行以下操作：

```kotlin
installFeatures = {
    // 安装 EventHandler 特性
    install(EventHandler) {
        onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
            println("正在启动策略: ${strategy.name}")
        }
        onAgentFinished { strategyName: String, result: String? ->
            println("结果: $result")
        }
    }
}
```

欲了解更多关于特性配置的信息，请参见专用页面。

### 7. 运行代理

使用前一阶段创建的配置选项创建代理，并使用提供的输入运行它：

```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted = { strategy: AIAgentStrategy, agent: AIAgent ->
                println("正在启动策略: ${strategy.name}")
            }
            onAgentFinished = { strategyName: String, result: String? ->
                println("结果: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("输入两个数字进行相加（例如，'add 5 and 7' 或 '5 + 7'）：")

    // 读取用户输入并将其发送给代理
    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}
```

## 处理结构化数据

`AIAgent` 可以处理来自 LLM 输出的结构化数据。欲了解更多详情，请参见 [Streaming API](streaming-api.md)。

## 使用并行工具调用

`AIAgent` 支持并行工具调用。此特性允许您并发处理多个工具，从而提高独立操作的性能。

欲了解更多详情，请参见 [并行工具调用](tools-overview.md#parallel-tool-calls)。

## 完整代码示例

以下是代理的完整实现：

```kotlin
// 使用来自环境变量的 API 密钥来使用 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 创建一个简单的策略
val agentStrategy = strategy("Simple calculator") {
    // 定义策略的节点
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 定义节点之间的边
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
                您是一个简单的计算器助手。
                您可以使用计算器工具将两个数字相加。
                当用户提供输入时，提取他们想要相加的数字。
                输入可能是各种格式，例如“add 5 and 7”、“5 + 7”或仅仅是“5 7”。
                提取这两个数字并使用计算器工具将它们相加。
                始终以清晰友好的消息回应，显示计算过程和结果。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 实现一个可以相加两个数字的简单计算器工具
@LLMDescription("用于执行基本算术操作的工具")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("将两个数字相加并返回它们的和")
    fun add(
        @LLMDescription("第一个要相加的数字（整数值）")
        num1: Int,

        @LLMDescription("第二个要相加的数字（整数值）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return " $num1 和 $num2 的和是: $sum"
    }
}

// 将工具添加到工具注册表
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 创建代理
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        // 安装 EventHandler 特性
        install(EventHandler) {
            onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
                println("正在启动策略: ${strategy.name}")
            }
            onAgentFinished { strategyName: String, result: String? ->
                println("结果: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("输入两个数字进行相加（例如，'add 5 and 7' 或 '5 + 7'）：")

    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}