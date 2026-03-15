# 概览

Agent 使用工具来执行特定任务或访问外部系统。

## 工具工作流

Koog 框架为使用工具提供了以下工作流：

1. 创建自定义工具或使用内置工具。
2. 将工具添加到工具注册表。
3. 将工具注册表传递给 Agent。
4. 在 Agent 中使用该工具。

### 可用工具类型

Koog 框架中有三种类型的工具：

- 提供 Agent 与用户交互及会话管理功能的内置工具。详见[内置工具](built-in-tools.md)。
- 基于注解的自定义工具，让您可以将函数作为工具暴露给 LLM。详见[基于注解的工具](annotation-based-tools.md)。
- 自定义工具，让您可以控制工具参数、元数据、执行逻辑以及注册和调用的方式。详见[基于类的工具](class-based-tools.md)。

### 工具注册表

在 Agent 中使用工具之前，必须先将其添加到工具注册表。
工具注册表管理 Agent 可用的所有工具。

工具注册表的主要特性：

- 组织工具。
- 支持合并多个工具注册表。
- 提供按名称或类型检索工具的方法。

要了解更多信息，请参阅 [ToolRegistry](api:agents-tools::ai.koog.agents.core.tools.ToolRegistry)。

以下是如何创建工具注册表并将工具添加到其中的示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
-->
```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
}
```
<!--- KNIT example-tools-overview-01.kt -->

若要合并多个工具注册表，请执行以下操作：

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias FirstSampleTool = AskUser
typealias SecondSampleTool = SayToUser
-->
```kotlin
val firstToolRegistry = ToolRegistry {
    tool(FirstSampleTool)
}

val secondToolRegistry = ToolRegistry {
    tool(SecondSampleTool)
}

val newRegistry = firstToolRegistry + secondToolRegistry
```
<!--- KNIT example-tools-overview-02.kt -->

### 将工具传递给 Agent

为了让 Agent 能够使用工具，您需要在创建 Agent 时提供一个包含该工具的工具注册表作为实参：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
// Agent 初始化
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant with strong mathematical skills.",
    llmModel = OpenAIModels.Chat.GPT4o,
    // 将您的工具注册表传递给 Agent
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-tools-overview-03.kt -->

### 调用工具

在 Agent 代码中调用工具的方法有多种。建议使用 Agent 上下文中提供的方法，而不是直接调用工具，因为这可以确保在 Agent 环境中妥当处理工具操作。

!!! tip
    确保在工具中实现了适当的[错误处理](agent-event-handlers.md)，以防止 Agent 失败。

工具在由 `AIAgentLLMWriteSession` 表示的特定会话上下文中被调用。
它提供了多种调用工具的方法，以便您可以：

- 使用给定的实参调用工具。
- 通过名称和给定的实参调用工具。
- 通过提供的工具类和实参调用工具。
- 使用给定的实参调用指定类型的工具。
- 调用返回原始字符串结果的工具。

更多详情请参阅 [API 参考](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession)。

#### 并行工具调用

您还可以使用 `toParallelToolCallsRaw` 扩展并行调用工具。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.serialization.typeToken
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)

class BookTool() : SimpleTool<Book>(
    argsType = typeToken<Book>(),
    name = NAME,
    description = "A tool to parse book information from Markdown"
) {
    companion object {
        const val NAME = "book"
    }

    override suspend fun execute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }
}

val strategy = strategy<Unit, Unit>("strategy-name") {

    /*...*/

    val myNode by node<Unit, Unit> { _ ->
        llm.writeSession {
            flow {
                emit(Book("Book 1", "Author 1", "Description 1"))
            }.toParallelToolCallsRaw(BookTool::class).collect()
        }
    }
}

```
<!--- KNIT example-tools-overview-04.kt -->

#### 从节点调用工具

在使用节点构建 Agent 工作流时，可以使用特殊节点来调用工具：

* **nodeExecuteTool**：执行单个工具调用并返回其结果。详见 [API 参考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool)。

* **nodeExecuteSingleTool**：使用提供的实参调用特定工具。详见 [API 参考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool)。

* **nodeExecuteMultipleTools**：执行多个工具调用并返回其结果。详见 [API 参考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools)。

* **nodeLLMSendToolResult**：将工具结果发送给 LLM 并获取响应。详见 [API 参考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult)。

* **nodeLLMSendMultipleToolResults**：将多个工具结果发送给 LLM。详见 [API 参考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults)。

## 将 Agent 作为工具使用

该框架提供了将任何 AI Agent 转换为可供其他 Agent 使用的工具的能力。
这一强大的功能使您能够创建分层 Agent 架构，其中专门的 Agent 可以被高级编排 Agent 作为工具调用。

### 将 Agent 转换为工具

要将 Agent 转换为工具，请使用 `AIAgentService` 和 `createAgentTool()` 扩展函数：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.serialization.typeToken

const val apiKey = ""
val analysisToolRegistry = ToolRegistry {}

-->
```kotlin
// 创建专门的 Agent 服务，负责创建财务分析 Agent。
val analysisAgentService = AIAgentService(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a financial analysis specialist.",
    toolRegistry = analysisToolRegistry
)

// 创建一个在调用时运行财务分析 Agent 的工具。
val analysisAgentTool = analysisAgentService.createAgentTool(
    agentName = "analyzeTransactions",
    agentDescription = "Performs financial transaction analysis",
    inputDescription = "Transaction analysis request",
    inputType = typeToken<String>(),
)
```
<!--- KNIT example-tools-overview-05.kt -->

### 在其他 Agent 中使用 Agent 工具

转换为工具后，您可以将该 Agent 工具添加到另一个 Agent 的工具注册表中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

-->
```kotlin
// 创建一个协调 Agent，可以使用专门的 Agent 作为工具
val coordinatorAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You coordinate different specialized services.",
    toolRegistry = ToolRegistry {
        tool(analysisAgentTool)
        // 根据需要添加其他工具
    }
)
```
<!--- KNIT example-tools-overview-06.kt -->

### Agent 工具执行

当 Agent 工具被调用时：

1. 实参根据输入描述符进行反序列化。
2. 被包装的 Agent 使用反序列化后的输入执行。
3. Agent 的输出被序列化并作为工具结果返回。

### 将 Agent 作为工具的好处

- **模块化**：将复杂的工作流拆分为专门的 Agent。
- **可复用性**：在多个协调 Agent 中使用相同的专门 Agent。
- **关注点分离**：每个 Agent 都可以专注于其特定领域。