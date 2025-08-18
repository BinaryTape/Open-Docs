# LLM 会话与手动历史记录管理

本页详细介绍了 LLM 会话，包括如何使用读写会话、管理对话历史记录以及向语言模型发送请求。

## 简介

LLM 会话是一个基本概念，它提供了一种与语言模型 (LLMs) 交互的结构化方式。它们管理对话历史记录、处理 LLM 请求，并提供一致的接口来运行工具和处理响应。

## 理解 LLM 会话

LLM 会话代表了与语言模型交互的上下文。它封装了：

- 对话历史记录 (prompt)
- 可用工具
- 向 LLM 发送请求的方法
- 更新对话历史记录的方法
- 运行工具的方法

会话由 `AIAgentLLMContext` 类管理，该类提供了创建读写会话的方法。

### 会话类型

Koog framework 提供了两种会话类型：

1. **写入会话** (`AIAgentLLMWriteSession`)：允许修改 prompt 和工具、发送 LLM 请求以及运行工具。在写入会话中所做的更改会持久化回 LLM 上下文。

2. **读取会话** (`AIAgentLLMReadSession`)：提供对 prompt 和工具的只读访问。它们对于探查当前状态而无需进行更改很有用。

关键区别在于写入会话可以修改对话历史记录，而读取会话不能。

### 会话生命周期

会话具有明确定义的生命周期：

1. **创建**：使用 `llm.writeSession { ... }` 或 `llm.readSession { ... }` 创建会话。
2. **活跃阶段**：当 lambda 代码块执行时，会话处于活跃状态。
3. **终止**：当 lambda 代码块完成时，会话会自动关闭。

会话实现了 `AutoCloseable` 接口，确保即使发生异常也能正确清理。

## 使用 LLM 会话

### 创建会话

会话是使用 `AIAgentLLMContext` 类的扩展函数创建的：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating a write session
llm.writeSession {
    // Session code here
}

// Creating a read session
llm.readSession {
    // Session code here
}
```
<!--- KNIT example-sessions-01.kt -->

这些函数接受一个 lambda 代码块，该代码块在会话的上下文中运行。当该代码块完成时，会话会自动关闭。

### 会话作用域与线程安全

会话使用读写锁来确保线程安全：

- 多个读取会话可以同时活跃。
- 一次只能有一个写入会话处于活跃状态。
- 写入会话会阻塞所有其他会话（包括读取和写入会话）。

这确保了对话历史记录不会因并发修改而损坏。

### 访问会话属性

在会话中，你可以访问 prompt 和工具：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.readSession {
    val messageCount = prompt.messages.size
    val availableTools = tools.map { it.name }
}
```
<!--- KNIT example-sessions-02.kt -->

在写入会话中，你还可以修改这些属性：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolDescriptor

val newTools = listOf<ToolDescriptor>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Modify the prompt
    updatePrompt {
        user("New user message")
    }

    // Modify the tools
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

关于更多信息，请参见 [AIAgentLLMReadSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-read-session/index.html) 和 [AIAgentLLMWriteSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html) 的详细 API 参考。

## 发送 LLM 请求

### 基本请求方法

发送 LLM 请求最常用的方法有：

1. `requestLLM()`：使用当前 prompt 和工具向 LLM 发送请求，返回单个响应。

2. `requestLLMMultiple()`：使用当前 prompt 和工具向 LLM 发送请求，返回多个响应。

3. `requestLLMWithoutTools()`：使用当前 prompt 但不带任何工具向 LLM 发送请求，返回单个响应。

4. `requestLLMForceOneTool`：使用当前 prompt 和工具向 LLM 发送请求，强制使用一个工具。

5. `requestLLMOnlyCallingTools`：向 LLM 发送请求，该请求应仅通过使用工具来处理。

示例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a request with tools enabled
    val response = requestLLM()

    // Make a request without tools
    val responseWithoutTools = requestLLMWithoutTools()

    // Make a request that returns multiple responses
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### 请求的工作原理

当你显式调用其中一个请求方法时，LLM 请求就会被发送。需要理解的关键点是：

1. **显式调用**：请求仅在你调用 `requestLLM()`、`requestLLMWithoutTools()` 等方法时发生。
2. **即时执行**：当你调用请求方法时，请求会立即发送，并且该方法会阻塞直到收到响应。
3. **自动历史记录更新**：在写入会话中，响应会自动添加到对话历史记录中。
4. **无隐式请求**：系统不会发送隐式请求；你需要显式调用请求方法。

### 带工具的请求方法

当发送带工具的请求时，LLM 可能会以工具调用而非文本响应进行回应。请求方法会透明地处理这种情况：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    val response = requestLLM()

    // The response might be a tool call or a text response
    if (response is Message.Tool.Call) {
        // Handle tool call
    } else {
        // Handle text response
    }
}
```
<!--- KNIT example-sessions-05.kt -->

在实践中，你通常无需手动检测响应类型，因为 agent 图会自动处理此路由。

### 结构化与流式请求

对于更高级的用例，平台提供了结构化和流式请求的方法：

1. `requestLLMStructured()`：请求 LLM 以特定的结构化格式提供响应。

2. `requestLLMStructuredOneShot()`：类似于 `requestLLMStructured()`，但没有重试或更正。

3. `requestLLMStreaming()`：向 LLM 发送流式请求，返回响应块的 flow。

示例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleParallelNodeExecution07.JokeRating

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a structured request
    val structuredResponse = requestLLMStructured<JokeRating>()

    // Make a streaming request
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // Process each chunk as it arrives
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 管理对话历史记录

### 更新 prompt

在写入会话中，你可以使用 `updatePrompt` 方法更新 prompt（对话历史记录）：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlinx.datetime.Clock

val myToolResult = Message.Tool.Result(
    id = "",
    tool = "",
    content = "",
    metaInfo = RequestMetaInfo(Clock.System.now())
)

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    updatePrompt {
        // Add a system message
        system("You are a helpful assistant.")

        // Add a user message
        user("Hello, can you help me with a coding question?")

        // Add an assistant message
        assistant("Of course! What's your question?")

        // Add a tool result
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

你还可以使用 `rewritePrompt` 方法完全重写 prompt：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val filteredMessages = emptyList<Message>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    rewritePrompt { oldPrompt ->
        // Create a new prompt based on the old one
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### 响应时自动更新历史记录

当你在写入会话中发送 LLM 请求时，响应会自动添加到对话历史记录中：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Add a user message
    updatePrompt {
        user("What's the capital of France?")
    }

    // Make a request – the response is automatically added to the history
    val response = requestLLM()

    // The prompt now includes both the user message and the model's response
}
```
<!--- KNIT example-sessions-09.kt -->

这种自动历史记录更新是写入会话的关键特性，确保对话自然流畅。

### 历史记录压缩

对于长时间运行的对话，历史记录可能会变得很大并消耗大量 token。平台提供了压缩历史记录的方法：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Compress the history using a TLDR approach
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

你还可以在策略图中（strategy graph）使用 `nodeLLMCompressHistory` 节点在特定点压缩历史记录。

关于历史记录压缩和压缩策略的更多信息，请参见[历史记录压缩](history-compression.md)。

## 在会话中运行工具

### 调用工具

写入会话提供了几种调用工具的方法：

1. `callTool(tool, args)`：按引用调用工具。

2. `callTool(toolName, args)`：按名称调用工具。

3. `callTool(toolClass, args)`：按类调用工具。

4. `callToolRaw(toolName, args)`：按名称调用工具并返回原始字符串结果。

示例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser

val myTool = AskUser
val myArgs = AskUser.Args("this is a string")

typealias MyTool = AskUser

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Call a tool by reference
    val result = callTool(myTool, myArgs)

    // Call a tool by name
    val result2 = callTool("myToolName", myArgs)

    // Call a tool by class
    val result3 = callTool(MyTool::class, myArgs)

    // Call a tool and get the raw result
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### 并行工具运行

要在并行运行多个工具，写入会话提供了 `Flow` 上的扩展函数：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import kotlinx.coroutines.flow.flow

typealias MyTool = AskUser

val data = ""
fun parseDataToArgs(data: String) = flow { emit(AskUser.Args(data)) }

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Run tools in parallel
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // Process each result
    }

    // Run tools in parallel and get raw results
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // Process each raw result
    }
}
```
<!--- KNIT example-sessions-12.kt -->

这对于高效处理大量数据很有用。

## 最佳实践

在使用 LLM 会话时，请遵循以下最佳实践：

1. **使用正确的会话类型**：当你需要修改对话历史记录时使用写入会话，当你只需要读取它时使用读取会话。

2. **保持会话简短**：会话应专注于特定任务，并尽快关闭以释放资源。

3. **处理异常**：确保在会话中处理异常，以防止资源泄漏。

4. **管理历史记录大小**：对于长时间运行的对话，请使用历史记录压缩来减少 token 使用。

5. **优先使用高级抽象**：如果可能，请使用基于节点的 API。例如，使用 `nodeLLMRequest` 而非直接使用会话。

6. **注意线程安全**：请记住，写入会话会阻塞其他会话，因此请尽可能缩短写入操作。

7. **对复杂数据使用结构化请求**：当你需要 LLM 返回结构化数据时，请使用 `requestLLMStructured` 而非解析自由格式文本。

8. **对长响应使用流式传输**：对于长响应，请使用 `requestLLMStreaming` 来处理到达的响应。

## 故障排除

### 会话已关闭

如果你看到诸如 `Cannot use session after it was closed` 的错误，则表示你正在尝试在其 lambda 代码块完成之后使用会话。请确保所有会话操作都在会话代码块内执行。

### 历史记录过大

如果你的历史记录变得太大并消耗了过多的 token，请使用历史记录压缩技术：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
}
```
<!--- KNIT example-sessions-13.kt -->

关于更多信息，请参见[历史记录压缩](history-compression.md)

### 未找到工具

如果你看到有关未找到工具的错误，请检查：

- 该工具已在工具注册表中正确注册。
- 你正在使用正确的工具名称或类。

## API 文档

关于更多信息，请参见完整的 [AIAgentLLMSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-session/index.html) 和 [AIAgentLLMContext](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.context/-a-i-agent-l-l-m-context/index.html) 参考。