# 函数式代理

函数式代理是轻量级的 AI 代理，它们无需构建复杂的策略图即可运行。
相反，代理逻辑被实现为一个 lambda 函数，该函数处理用户输入，与 LLM 交互，
可选地调用工具，并生成最终输出。它能够执行单次 LLM 调用，按序处理多个 LLM 调用，或根据用户输入以及 LLM 和工具输出进行循环。

!!! tip
    - 如果您已经拥有一个简单的 [基础代理](basic-agents.md) 作为您的第一个 MVP，但在特定任务中遇到限制，请使用函数式代理来原型化自定义逻辑。您可以在纯 Kotlin 中实现自定义控制流，同时仍可使用大多数 Koog 特性，包括历史记录压缩和自动状态管理。
    - 对于生产级需求，请将您的函数式代理重构为带有策略图的 [复杂工作流代理](complex-workflow-agents.md)。这提供了具有可控回滚的持久性，以实现容错性，以及具有嵌套图事件的高级 OpenTelemetry 追踪。

本页面将指导您完成创建最小函数式代理并使用工具对其进行扩展的必要步骤。

## 前提条件

开始之前，请确保您已具备以下条件：

- 一个可用的 Kotlin/JVM 项目。
- 已安装 Java 17+。
- 一个来自 LLM 提供者的有效 API 密钥，用于实现 AI 代理。有关所有可用提供者的列表，请参阅 [LLM 提供者](llm-providers.md)。
- （可选）如果您使用 Ollama 提供者，请确保其已安装并在本地运行。

!!! tip
    使用环境变量或安全的配置管理系统来存储您的 API 密钥。
    避免将 API 密钥直接硬编码到您的源代码中。

## 添加依赖项

`AIAgent` 类是 Koog 中创建代理的主类。
在您的构建配置中包含以下依赖项以使用该类的功能：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
有关所有可用的安装方法，请参阅 [安装 Koog](getting-started.md#install-koog)。

## 创建最小函数式代理

要创建最小函数式代理，请执行以下操作：

1. 选择代理处理的输入和输出类型，并创建相应的 `AIAgent<Input, Output>` 实例。
   在本指南中，我们使用 `AIAgent<String, String>`，这意味着代理接收并返回 `String`。
2. 提供所需的形参，包括系统提示、提示执行器和 LLM。
3. 使用封装在 `functionalStrategy {...}` DSL 方法中的 lambda 函数定义代理逻辑。

以下是一个最小函数式代理的示例，它将用户文本发送到指定的 LLM 并返回单个助手消息。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 创建 AIAgent 实例并提供系统提示、提示执行器和 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定义代理逻辑
        // 进行一次 LLM 调用
        val response = requestLLM(input)
        // 从响应中提取并返回助手消息内容
        response.asAssistantMessage().content
    }
)

// 使用用户输入运行代理并打印结果
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

该代理可以产生以下输出：

```
The answer to 12 × 9 is 108.
```

此代理进行一次 LLM 调用并返回助手消息内容。
您可以扩展代理逻辑以处理多个顺序 LLM 调用。例如：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 创建 AIAgent 实例并提供系统提示、提示执行器和 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定义代理逻辑
        // 第一次 LLM 调用，根据用户输入生成初始草稿
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // 第二次 LLM 调用，通过使用草稿内容再次提示 LLM 来改进草稿
        val improved = requestLLM("Improve and clarify: $draft").asAssistantMessage().content
        // 最终的 LLM 调用，以格式化改进的文本并返回最终格式化的结果
        requestLLM("Format the result as bold: $improved").asAssistantMessage().content
    }
)

// 使用用户输入运行代理并打印结果
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

该代理可以产生以下输出：

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## 添加工具

在许多情况下，函数式代理需要完成特定任务，例如读取和写入数据或调用 API。
在 Koog 中，您可以将此类能力作为工具暴露，并让 LLM 在代理逻辑中调用它们。

本章将以上面创建的最小函数式代理为例，演示如何使用工具扩展代理逻辑。

1) 创建一个基于注解的工具。有关更多详细信息，请参阅 [基于注解的工具](annotation-based-tools.md)。

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
@LLMDescription("简单乘法器")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("将两个数字相乘并返回结果")
    fun multiply(a: Int, b: Int): Int {
        val result = a * b
        return result
    }
}
```
<!--- KNIT example-functional-agent-03.kt -->

要了解有关可用工具的更多信息，请参阅 [工具概览](tools-overview.md)。

2) 注册工具以使其可供代理使用。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val toolRegistry = ToolRegistry {
    tools(MathTools())
}
```
<!--- KNIT example-functional-agent-04.kt -->

3) 将工具注册表传递给代理，以使 LLM 能够请求和使用可用工具。

4) 扩展代理逻辑以识别工具调用、执行请求的工具、将其结果发送回 LLM，并重复该过程直到没有工具调用剩余。

!!! note
    仅当 LLM 继续发出工具调用时才使用循环。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.containsToolCalls
import ai.koog.agents.core.dsl.extension.executeMultipleTools
import ai.koog.agents.core.dsl.extension.extractToolCalls
import ai.koog.agents.core.dsl.extension.requestLLMMultiple
import ai.koog.agents.core.dsl.extension.sendMultipleToolResults
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val toolRegistry = ToolRegistry {
            tools(MathTools())
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val mathWithTools = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant. When multiplication is needed, use the multiplication tool.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    toolRegistry = toolRegistry,
    strategy = functionalStrategy { input -> // 定义扩展了工具调用的代理逻辑
        // 将用户输入发送到 LLM
        var responses = requestLLMMultiple(input)

        // 仅当 LLM 请求工具时才循环
        while (responses.containsToolCalls()) {
            // 从响应中提取工具调用
            val pendingCalls = extractToolCalls(responses)
            // 执行工具并返回结果
            val results = executeMultipleTools(pendingCalls)
            // 将工具结果发送回 LLM。LLM 可能会调用更多工具或返回最终输出
            responses = sendMultipleToolResults(results)
        }

        // 当没有工具调用剩余时，从响应中提取并返回助手消息内容
        responses.single().asAssistantMessage().content
    }
)

// 使用用户输入运行代理并打印结果
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

该代理可以产生以下输出：

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 接下来

- 了解如何使用 [结构化输出 API](structured-output.md) 返回结构化数据。
- 尝试向代理添加更多 [工具](tools-overview.md)。
- 使用 [EventHandler](agent-events.md) 特性提高可观测性。
- 了解如何使用 [历史记录压缩](history-compression.md) 处理长对话。