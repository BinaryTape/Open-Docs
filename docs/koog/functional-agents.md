# 函数式代理

函数式代理是轻量级 AI 代理，无需构建复杂的策略图即可运行。
相反，代理逻辑被实现为一个处理用户输入、与 LLM 交互、（可选地）调用工具并生成最终输出的 lambda 函数。它可以执行单次 LLM 调用、按顺序处理多次 LLM 调用，或者根据用户输入以及 LLM 和工具的输出进行循环。

!!! tip
    - 如果你已经拥有一个[基础代理](basic-agents.md)作为第一个 MVP，但遇到了特定任务的限制，请使用函数式代理来构建自定义逻辑的原型。你可以在使用纯 Kotlin 实现自定义控制流的同时，仍然使用大多数 Koog 功能，包括历史记录压缩和自动状态管理。
    - 对于生产级需求，请将你的函数式代理重构为带有策略图的[复杂工作流代理](complex-workflow-agents.md)。这可以为容错提供具有可控回滚功能的持久化，以及具有嵌套图事件的高级 OpenTelemetry 跟踪。

本页面将引导你完成创建一个最小化函数式代理并使用工具对其进行扩展的必要步骤。

## 先决条件

在开始之前，请确保你具备以下条件：

- 一个可以运行的 Kotlin/JVM 项目。
- 已安装 Java 17+。
- 来自用于实现 AI 代理的 LLM 提供商的有效 API 密钥。有关所有可用提供商的列表，请参阅 [LLM 提供商](llm-providers.md)。
- （可选）如果你使用 Ollama 提供商，请确保已在本地安装并运行。

!!! tip
    使用环境变量或安全的配置管理系统来存储你的 API 密钥。
    避免直接在源代码中硬编码 API 密钥。

## 添加依赖项

`AIAgent` 类是 Koog 中创建代理的核心类。
在你的构建配置中包含以下依赖项以使用该类的功能：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
有关所有可用的安装方法，请参阅[安装 Koog](getting-started.md#install-koog)。

## 创建最小化函数式代理

要创建一个最小化函数式代理，请执行以下操作：

1. 选择代理处理的输入和输出类型，并创建一个相应的 `AIAgent<Input, Output>` 实例。
   在本指南中，我们使用 `AIAgent<String, String>`，这意味着代理接收并返回 `String`。
2. 提供所需的参数，包括系统提示词、提示词执行器和 LLM。
3. 使用包装在 `functionalStrategy {...}` DSL 方法中的 lambda 函数定义代理逻辑。

以下是一个最小化函数式代理的示例，它将用户文本发送到指定的 LLM 并返回单条助手消息。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 创建一个 AIAgent 实例并提供系统提示词、提示词执行器和 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定义代理逻辑
        // 执行一次 LLM 调用
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

该代理可以生成以下输出：

```
The answer to 12 × 9 is 108.
```

此代理执行单次 LLM 调用并返回助手消息内容。
你可以扩展代理逻辑以处理多次连续的 LLM 调用。例如：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 创建一个 AIAgent 实例并提供系统提示词、提示词执行器和 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定义代理逻辑
        // 第一次 LLM 调用，根据用户输入生成初稿
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // 第二次 LLM 调用，通过再次提示 LLM 并带上草稿内容来改进草稿
        val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
        // 最后的 LLM 调用，格式化改进后的文本并返回最终格式化的结果
        requestLLM("Format the result as bold.").asAssistantMessage().content
    }
)

// 使用用户输入运行代理并打印结果
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

该代理可以生成以下输出：

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
在 Koog 中，你可以将这些能力作为工具公开，并让 LLM 在代理逻辑中调用它们。

本章将采用上面创建的最小化函数式代理，并演示如何使用工具扩展代理逻辑。

1) 创建一个基于注解的工具。有关更多详细信息，请参阅[基于注解的工具](annotation-based-tools.md)。

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
--> 
```kotlin
@LLMDescription("Simple multiplier")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("Multiplies two numbers and returns the result")
    fun multiply(a: Int, b: Int): Int {
        val result = a * b
        return result
    }
}
```
<!--- KNIT example-functional-agent-03.kt -->

要了解有关可用工具的更多信息，请参阅[工具概述](tools-overview.md)。

2) 注册工具以使其对代理可用。

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

3) 将工具注册表传递给代理，以便 LLM 能够请求并使用可用的工具。

4) 扩展代理逻辑以识别工具调用、执行请求的工具、将结果发回给 LLM，并重复该过程直到不再有工具调用。

!!! note
    仅当 LLM 继续发出工具调用时才使用循环。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    strategy = functionalStrategy { input -> // 定义使用工具调用扩展后的代理逻辑
        // 将用户输入发送给 LLM
        var responses = requestLLMMultiple(input)

        // 仅在 LLM 请求工具时进行循环
        while (responses.containsToolCalls()) {
            // 从响应中提取工具调用
            val pendingCalls = extractToolCalls(responses)
            // 执行工具并返回结果
            val results = executeMultipleTools(pendingCalls)
            // 将工具结果发回给 LLM。LLM 可能会调用更多工具或返回最终输出
            responses = sendMultipleToolResults(results)
        }

        // 当不再有工具调用时，从响应中提取并返回助手消息内容
        responses.single().asAssistantMessage().content
    }
)

// 使用用户输入运行代理并打印结果
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

该代理可以生成以下输出：

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 下一步

- 了解如何使用[结构化输出 API](structured-output.md) 返回结构化数据。
- 尝试为代理添加更多[工具](tools-overview.md)。
- 通过 [EventHandler](agent-events.md) 功能提高可观测性。
- 了解如何通过[历史记录压缩](history-compression.md)处理长时间运行的对话。