# 概述

代理使用工具来执行特定任务或访问外部系统。

## 工具工作流

Koog 框架提供了以下用于处理工具的工作流：

1.  创建自定义工具或使用内置工具之一。
2.  将工具添加到工具注册表。
3.  将工具注册表传递给代理。
4.  将工具与代理一起使用。

### 可用的工具类型

Koog 框架中有三种类型的工具：

-   内置工具，提供代理与用户交互和对话管理功能。有关详细信息，请参见 [内置工具](built-in-tools.md)。
-   基于注解的自定义工具，允许您将函数公开为 LLM 的工具。有关详细信息，请参见 [基于注解的工具](annotation-based-tools.md)。
-   基于类的自定义工具，允许您控制工具形参、元数据、执行逻辑以及如何注册和调用它。有关详细信息，请参见 [基于类的工具](class-based-tools.md)。

### 工具注册表

在使用工具之前，您必须将其添加到工具注册表。工具注册表管理代理可用的所有工具。

工具注册表的主要特性：

-   组织工具。
-   支持合并多个工具注册表。
-   提供按名称或类型检索工具的方法。

要了解更多信息，请参见 [ToolRegistry](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)。

这是一个关于如何创建工具注册表并向其中添加工具的示例：

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

要合并多个工具注册表，请执行以下操作：

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

### 将工具传递给代理

要使代理能够使用工具，您需要在创建代理时提供一个包含该工具的工具注册表作为实参：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
// 代理初始化
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant with strong mathematical skills.",
    llmModel = OpenAIModels.Chat.GPT4o,
    // 将工具注册表传递给代理
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-tools-overview-03.kt -->

### 调用工具

在您的代理代码中，有几种方式可以调用工具。推荐的方法是使用代理上下文中提供的方法，而不是直接调用工具，因为这可以确保在代理环境中正确处理工具操作。

!!! tip
    确保您已在工具中实现适当的 [错误处理](agent-events.md) 以防止代理失败。

工具在由 `AIAgentLLMWriteSession` 表示的特定会话上下文中被调用。它提供了几种调用工具的方法，以便您可以：

-   使用给定实参调用工具。
-   按其名称和给定实参调用工具。
-   按提供的工具类和实参调用工具。
-   使用给定实参调用指定类型的工具。
-   调用返回原始字符串结果的工具。

有关更多详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)。

#### 并行工具调用

您还可以使用 `toParallelToolCallsRaw` 扩展并行调用工具。例如：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)

class BookTool() : SimpleTool<Book>() {
    companion object {
        const val NAME = "book"
    }

    override suspend fun doExecute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }

    override val argsSerializer: KSerializer<Book>
        get() = Book.serializer()

    override val name = NAME
    override val description = "A tool to parse book information from Markdown"
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

当使用节点构建代理工作流时，您可以使用特殊节点来调用工具：

*   **nodeExecuteTool**：调用单个工具调用并返回其结果。有关详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)。

*   **nodeExecuteSingleTool**：它使用提供的实参调用特定工具。有关详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-single-tool.html)。

*   **nodeExecuteMultipleTools**：它执行多个工具调用并返回其结果。有关详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)。

*   **nodeLLMSendToolResult**：它向 LLM 发送工具结果并获取响应。有关详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)。

*   **nodeLLMSendMultipleToolResults**：它向 LLM 发送多个工具结果。有关详细信息，请参见 [API reference](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)。

## 将代理用作工具

该框架提供了将任意 AI 代理转换为工具的能力，该工具可供其他代理使用。这项强大的特性使您能够创建层次化代理架构，其中专门的代理可以作为工具被更高层级的编排代理调用。

### 将代理转换为工具

要将代理转换为工具，请使用 `asTool()` 扩展函数：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.asTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
val analysisToolRegistry = ToolRegistry {}

-->
```kotlin
// 创建一个专门的代理
val analysisAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You are a financial analysis specialist.",
    toolRegistry = analysisToolRegistry
)

// 将代理转换为工具
val analysisAgentTool = analysisAgent.asTool(
    agentName = "analyzeTransactions",
    agentDescription = "Performs financial transaction analysis",
    inputDescription = "Transaction analysis request",
)
```
<!--- KNIT example-tools-overview-05.kt -->

### 在其他代理中使用代理工具

一旦转换为工具，您可以将代理工具添加到另一个代理的工具注册表：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

-->
```kotlin
// 创建一个协调代理，它可以使用专门的代理作为工具
val coordinatorAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You coordinate different specialized services.",
    toolRegistry = ToolRegistry {
        tool(analysisAgentTool)
        // 按需添加其他工具
    }
)
```
<!--- KNIT example-tools-overview-06.kt -->

### 代理工具执行

当调用代理工具时：

1.  实参根据输入描述符进行反序列化。
2.  包装的代理使用反序列化的输入执行。
3.  代理的输出被序列化并作为工具结果返回。

### 将代理用作工具的优势

-   **模块化**：将复杂的工作流分解为专门的代理。
-   **可重用性**：在多个协调代理中重用相同的专门代理。
-   **关注点分离**：每个代理可以专注于其特定的领域。