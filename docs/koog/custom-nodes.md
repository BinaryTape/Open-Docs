# 自定义节点实现

本页面详细介绍了如何在 Koog 框架中实现您自己的自定义节点。自定义节点允许您通过创建执行特定操作的可复用组件来扩展代理工作流的功能。

关于图节点是什么、如何使用以及现有默认节点的更多信息，请参见 [图节点](nodes-and-components.md)。

## 节点架构概述

在深入了解实现细节之前，理解 Koog 框架中节点的架构至关重要。节点是代理工作流的基本构建块，每个节点代表工作流中的特定操作或转换。您可以使用边连接节点，边定义了节点之间的执行流。

每个节点都有一个 `execute` 方法，它接受一个输入并生成一个输出，该输出随后传递给工作流中的下一个节点。

## 实现自定义节点

自定义节点的实现范围从对输入数据执行基本逻辑并返回输出的简单实现，到接受形参并在运行之间维护状态的更复杂节点实现。

### 基本节点实现

在图中实现自定义节点并定义您自己的自定义逻辑的最简单方法是使用以下模式：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = Int

val returnValue = 42

val str = strategy<Input, Output>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val myNode by node<Input, Output>("node_name") { input ->
    // Processing
    returnValue
}
```
<!--- KNIT example-custom-nodes-01.kt -->

上述代码表示一个自定义节点 `myNode`，它具有预定义的 `Input` 和 `Output` 类型，以及可选的名称字符串形参（`node_name`）。在实际示例中，这是一个接受字符串输入并返回其长度的简单节点：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val str = strategy<String, Int>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val myNode by node<String, Int>("node_name") { input ->
    // Processing
    input.length
}
```
<!--- KNIT example-custom-nodes-02.kt -->

创建自定义节点的另一种方法是在 `AIAgentSubgraphBuilderBase` 上定义一个调用 `node` 函数的扩展函数：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
fun AIAgentSubgraphBuilderBase<*, *>.myCustomNode(
    name: String? = null
): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
    // Custom logic
    input // 将输入作为输出返回（直通）
}

val myCustomNode by myCustomNode("node_name")
```
<!--- KNIT example-custom-nodes-03.kt -->

这会创建一个直通节点，它执行一些自定义逻辑，但将输入作为输出返回，不进行修改。

### 带有额外实参的节点

您可以创建接受实参以自定义其行为的节点：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
    fun AIAgentSubgraphBuilderBase<*, *>.myNodeWithArguments(
    name: String? = null,
    arg1: String,
    arg2: Int
): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
    // 在您的自定义逻辑中使用 arg1 和 arg2
    input // 将输入作为输出返回
}

val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
```
<!--- KNIT example-custom-nodes-04.kt -->

### 参数化节点

您可以定义具有输入和输出形参的节点：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy
-->

```kotlin
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
    name: String? = null,
): AIAgentNodeDelegate<T, T> = node(name) { input ->
    // 执行一些额外操作
    // 将输入作为输出返回
    input
}

val strategy = strategy<String, String>("strategy_name") {
    val myCustomNode by myParameterizedNode<String>("node_name")
}
```
<!--- KNIT example-custom-nodes-05.kt -->

### 有状态节点

如果您的节点需要在运行之间维护状态，您可以使用闭包变量：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase

typealias Input = Unit
typealias Output = Unit

-->
```kotlin
fun AIAgentSubgraphBuilderBase<*, *>.myStatefulNode(
    name: String? = null
): AIAgentNodeDelegate<Input, Output> {
    var counter = 0

    return node(name) { input ->
        counter++
        println("Node executed $counter times")
        input
    }
}
```
<!--- KNIT example-custom-nodes-06.kt -->

## 节点输入和输出类型

节点可以具有不同的输入和输出类型，它们被指定为泛型形参：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val stringToIntNode by node<String, Int>("node_name") { input: String ->
    // Processing
    input.toInt() // 将字符串转换为整数
}
```
<!--- KNIT example-custom-nodes-07.kt -->

!!! note
    输入和输出类型决定了节点如何连接到工作流中的其他节点。只有当源节点的输出类型与目标节点的输入类型兼容时，节点才能连接。

## 最佳实践

实现自定义节点时，请遵循以下最佳实践：

1.  **保持节点专注**：每个节点应执行单一、定义明确的操作。
2.  **使用描述性名称**：节点名称应清楚地表明其目的。
3.  **文档化形参**：为所有形参提供清晰的文档。
4.  **优雅地处理错误**：实现适当的错误处理以防止工作流失败。
5.  **使节点可复用**：设计节点以在不同工作流中复用。
6.  **使用类型形参**：在适当时候使用泛型类型形参，使节点更灵活。
7.  **提供默认值**：如果可能，为形参提供合理的默认值。

## 常见模式

以下章节提供了一些实现自定义节点的常见模式。

### 直通节点

执行操作但将输入作为输出返回的节点。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin

val loggingNode by node<String, String>("node_name") { input ->
    println("正在处理输入：$input")
    input // 将输入作为输出返回
}
```
<!--- KNIT example-custom-nodes-08.kt -->

### 转换节点

将输入转换为不同输出的节点。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val upperCaseNode by node<String, String>("node_name") { input ->
    println("正在处理输入：$input")
    input.uppercase() // 将输入转换为大写
}
```
<!--- KNIT example-custom-nodes-09.kt -->

### LLM 交互节点

与 LLM 交互的节点。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val summarizeTextNode by node<String, String>("node_name") { input ->
    llm.writeSession {
        appendPrompt {
            user("Please summarize the following text: $input")
        }

        val response = requestLLMWithoutTools()
        response.content
    }
}
```
<!--- KNIT example-custom-nodes-10.kt -->

### 工具运行节点

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.environment.executeTool
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.ResponseMetaInfo
import kotlinx.datetime.Clock
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.*

val toolName = "my-custom-tool"

@Serializable
data class ToolArgs(val arg1: String, val arg2: Int)

val strategy = strategy<String, String>("strategy_name") {

-->
<!--- SUFFIX
}
-->
```kotlin
val nodeExecuteCustomTool by node<String, String>("node_name") { input ->
    val toolCall = Message.Tool.Call(
        id = UUID.randomUUID().toString(),
        tool = toolName,
        metaInfo = ResponseMetaInfo.create(Clock.System),
        content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 将输入用作工具实参
    )

    val result = environment.executeTool(toolCall)
    result.content
}
```
<!--- KNIT example-custom-nodes-11.kt -->