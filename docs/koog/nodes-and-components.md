# 预定义 node 和组件

Node 是 Koog 框架中 agent 工作流的基本构建块。
每个 node 代表工作流中的特定操作或转换，它们可以使用 edge 连接起来以定义执行流。

通常，它们让你可以将复杂逻辑封装到可重用组件中，这些组件可以轻松集成到不同的 agent 工作流中。本指南将引导你了解可用于 agent 策略的现有 node。

关于更详细的参考文档，请参见 [API reference](https://api.koog.ai/index.html)。

## 实用程序 node

### nodeDoNothing

一个简单的直通 node，它不执行任何操作并将输入作为输出返回。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-do-nothing.html)。

你可以将此 node 用于以下目的：

- 在你的图中创建 placeholder node。
- 创建连接点而不修改数据。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val passthrough by nodeDoNothing<String>("passthrough")

edge(nodeStart forwardTo passthrough)
edge(passthrough forwardTo nodeFinish)
```
<!--- KNIT example-nodes-and-component-01.kt -->

## LLM node

### nodeUpdatePrompt

一个使用所提供的 prompt 构建器向 LLM prompt 添加消息的 node。
这对于在进行实际 LLM 请求之前修改对话上下文很有用。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-update-prompt.html)。

你可以将此 node 用于以下目的：

- 向 prompt 添加系统指令。
- 将用户消息插入对话中。
- 为后续 LLM 请求准备上下文。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeUpdatePrompt

typealias Input = Unit
typealias Output = Unit

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val firstNode by node<Input, Output> {
    // Transform input to output
}

val secondNode by node<Output, Output> {
    // Transform output to output
}

// Node will get the value of type Output as input from the previous node and path through it to the next node
val setupContext by nodeUpdatePrompt<Output>("setupContext") {
    system("You are a helpful assistant specialized in Kotlin programming.")
    user("I need help with Kotlin coroutines.")
}

edge(firstNode forwardTo setupContext)
edge(setupContext forwardTo secondNode)
```
<!--- KNIT example-nodes-and-component-02.kt -->

### nodeLLMSendMessageOnlyCallingTools

一个将用户消息附加到 LLM prompt 并获取 LLM 只能调用 tool 的响应的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-only-calling-tools.html)。

### nodeLLMSendMessageForceOneTool

一个将用户消息附加到 LLM prompt 并强制 LLM 使用特定 tool 的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-force-one-tool.html)。

### nodeLLMRequest

一个将用户消息附加到 LLM prompt 并获取带可选 tool 使用的响应的 node。node 配置决定了在处理消息期间是否允许 tool 调用。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request.html)。

你可以将此 node 用于以下目的：

- 为当前 prompt 生成 LLM 响应，控制 LLM 是否允许生成 tool 调用。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest("requestLLM", allowToolCalls = true)
edge(getUserQuestion forwardTo requestLLM)
```
<!--- KNIT example-nodes-and-component-03.kt -->

### nodeLLMRequestStructured

一个将用户消息附加到 LLM prompt 并从 LLM 请求带纠错能力的结构化数据的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-structured.html)。

### nodeLLMRequestStreaming

一个将用户消息附加到 LLM prompt 并流式传输 LLM 响应，带或不带流数据转换的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-streaming.html)。

### nodeLLMRequestMultiple

一个将用户消息附加到 LLM prompt 并获取多个启用 tool 调用的 LLM 响应的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-multiple.html)。

你可以将此 node 用于以下目的：

- 处理需要多次 tool 调用的复杂查询。
- 生成多个 tool 调用。
- 实现需要多个并行操作的工作流。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getComplexUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
edge(getComplexUserQuestion forwardTo requestLLMMultipleTools)
```
<!--- KNIT example-nodes-and-component-04.kt -->

### nodeLLMCompressHistory

一个将当前 LLM prompt（消息 history）压缩为摘要，用简洁摘要（TL;DR）替换消息的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-compress-history.html)。
这对于通过压缩 history 来减少 token 使用以管理长对话很有用。

关于 history 压缩的更多信息，请参见 [History compression](history-compression.md)。

你可以将此 node 用于以下目的：

- 管理长对话以减少 token 使用。
- 总结对话 history 以保持上下文。
- 在长时间运行的 agent 中实现内存管理。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeDoNothing
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy

val strategy = strategy<String, String>("strategy_name") {
    val generateHugeHistory by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<String>(
    "compressHistory",
    strategy = HistoryCompressionStrategy.FromLastNMessages(10),
    preserveMemory = true
)
edge(generateHugeHistory forwardTo compressHistory)
```
<!--- KNIT example-nodes-and-component-05.kt -->

## Tool node

### nodeExecuteTool

一个执行单个 tool 调用并返回其结果的 node。此 node 用于处理 LLM 发出的 tool 调用。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)。

你可以将此 node 用于以下目的：

- 执行 LLM 请求的 tool。
- 响应 LLM 决策处理特定操作。
- 将外部功能集成到 agent 工作流中。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.onToolCall

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest()
val executeTool by nodeExecuteTool()
edge(requestLLM forwardTo executeTool onToolCall { true })
```
<!--- KNIT example-nodes-and-component-06.kt -->

### nodeLLMSendToolResult

一个将 tool 结果添加到 prompt 并请求 LLM 响应的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)。

你可以将此 node 用于以下目的：

- 处理 tool 执行的结果。
- 根据 tool 输出生成响应。
- 在 tool 执行后继续对话。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeTool by nodeExecuteTool()
val sendToolResultToLLM by nodeLLMSendToolResult()
edge(executeTool forwardTo sendToolResultToLLM)
```
<!--- KNIT example-nodes-and-component-07.kt -->

### nodeExecuteMultipleTools

一个执行多个 tool 调用的 node。这些调用可以选择并行执行。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)。

你可以将此 node 用于以下目的：

- 并行执行多个 tool。
- 处理需要多个 tool 执行的复杂工作流。
- 通过批量处理 tool 调用来优化性能。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools
import ai.koog.agents.core.dsl.extension.onMultipleToolCalls

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
val executeMultipleTools by nodeExecuteMultipleTools()
edge(requestLLMMultipleTools forwardTo executeMultipleTools onMultipleToolCalls { true })
```
<!--- KNIT example-nodes-and-component-08.kt -->

### nodeLLMSendMultipleToolResults

一个将多个 tool 结果添加到 prompt 并获取多个 LLM 响应的 node。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)。

你可以将此 node 用于以下目的：

- 处理多个 tool 执行的结果。
- 生成多个 tool 调用。
- 实现带多个并行操作的复杂工作流。

例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeMultipleTools by nodeExecuteMultipleTools()
val sendMultipleToolResultsToLLM by nodeLLMSendMultipleToolResults()
edge(executeMultipleTools forwardTo sendMultipleToolResultsToLLM)
```
<!--- KNIT example-nodes-and-component-09.kt -->

## 预定义 subgraph

框架提供了预定义的 subgraph，它们封装了常用模式和工作流。这些 subgraph 通过自动处理基础 node 和 edge 的创建来简化复杂 agent 策略的开发。

通过使用预定义的 subgraph，你可以实现各种流行的 pipeline。例如：

1.  准备数据。
2.  运行任务。
3.  验证任务结果。如果结果不正确，带反馈消息返回步骤 2 以进行调整。

### subgraphWithTask

一个使用所提供 tool 执行特定任务并返回结构化结果的 subgraph。此 subgraph 旨在处理更大工作流中的自包含任务。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-task.html)。

你可以将此 subgraph 用于以下目的：

- 创建在更大工作流中处理特定任务的特殊组件。
- 封装具有清晰输入和输出接口的复杂逻辑。
- 配置任务特有的 tool、模型和 prompt。
- 通过自动压缩管理对话 history。
- 开发结构化 agent 工作流和任务执行 pipeline。
- 从 LLM 任务执行生成结构化结果。

你可以以文本形式向 subgraph 提供任务，并在需要时配置 LLM 并提供必要的 tool，subgraph 将处理并解决该任务。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.agent.subgraphWithTask

val searchTool = SayToUser
val calculatorTool = SayToUser
val weatherTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processQuery by subgraphWithTask<String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    llmModel = OpenAIModels.Chat.GPT4o,
) { userQuery ->
    """
    You are a helpful assistant that can answer questions about various topics.
    Please help with the following query:
    $userQuery
    """
}
```
<!--- KNIT example-nodes-and-component-10.kt -->

### subgraphWithVerification

`subgraphWithTask` 的一个特殊版本，它验证任务是否正确执行并提供遇到的任何问题的详细信息。此 subgraph 对于需要验证或质量检测的工作流很有用。关于详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-verification.html)。

你可以将此 subgraph 用于以下目的：

- 验证任务执行的正确性。
- 在你的工作流中实施质量控制流程。
- 创建自验证组件。
- 生成带成功/失败状态和详细反馈的结构化验证结果。

该 subgraph 确保 LLM 在工作流结束时调用验证 tool，以检测任务是否成功完成。它保证此验证作为最后一步执行，并返回一个 `VerifiedSubgraphResult`，该结果指示任务是否成功完成并提供详细反馈。
例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.agents.ext.agent.subgraphWithVerification

val runTestsTool = SayToUser
val analyzeTool = SayToUser
val readFileTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val verifyCode by subgraphWithVerification<String>(
    tools = listOf(runTestsTool, analyzeTool, readFileTool),
    llmModel = AnthropicModels.Sonnet_3_7
) { codeToVerify ->
    """
    You are a code reviewer. Please verify that the following code meets all requirements:
    1. It compiles without errors
    2. All tests pass
    3. It follows the project's coding standards

    Code to verify:
    $codeToVerify
    """
}
```
<!--- KNIT example-nodes-and-component-11.kt -->

## 预定义策略和常见策略模式

框架提供了预定义的策略，它们组合了各种 node。
node 使用 edge 连接起来以定义操作流，并带指定何时遵循每个 edge 的条件。

如果需要，你可以将这些策略集成到你的 agent 工作流中。

### 单次运行策略

单次运行策略专为非交互式用例而设计，其中 agent 一次处理输入并返回结果。

当你需要运行不需要复杂逻辑的直接流程时，可以使用此策略。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*

-->
```kotlin

public fun singleRunStrategy(): AIAgentGraphStrategy<String, String> = strategy("single_run") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```
<!--- KNIT example-nodes-and-component-12.kt -->

### 基于 tool 的策略

基于 tool 的策略专为严重依赖 tool 执行特定操作的工作流而设计。
它通常根据 LLM 决策执行 tool 并处理结果。

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.tools.ToolRegistry

-->
```kotlin
fun toolBasedStrategy(name: String, toolRegistry: ToolRegistry): AIAgentGraphStrategy<String, String> {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        // Define the flow of the agent
        edge(nodeStart forwardTo nodeSendInput)

        // If the LLM responds with a message, finish
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // If the LLM calls a tool, execute it
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // Send the tool result back to the LLM
        edge(nodeExecuteTool forwardTo nodeSendToolResult)

        // If the LLM calls another tool, execute it
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the LLM responds with a message, finish
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```
<!--- KNIT example-nodes-and-component-13.kt -->

### 流式数据策略

流式数据策略专为处理来自 LLM 的流式数据而设计。它通常请求流式数据，处理它，并可能使用处理过的数据调用 tool。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi08.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
    // Describe the node containing the output stream parsing
    val getMdOutput by node<String, List<Book>> { booksDescription ->
        val books = mutableListOf<Book>()
        val mdDefinition = markdownBookDefinition()

        llm.writeSession {
            updatePrompt { user(booksDescription) }
            // Initiate the response stream in the form of the definition `mdDefinition`
            val markdownStream = requestLLMStreaming(mdDefinition)
            // Call the parser with the result of the response stream and perform actions with the result
            parseMarkdownStreamToBooks(markdownStream).collect { book ->
                books.add(book)
                println("Parsed Book: ${book.title} by ${book.author}")
            }
        }

        books
    }
    // Describe the agent's graph making sure the node is accessible
    edge(nodeStart forwardTo getMdOutput)
    edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-nodes-and-component-14.kt -->