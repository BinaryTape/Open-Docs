# 自定义节点实现

本页提供了关于如何在 Koog 框架中实现自定义节点的详细说明。通过创建执行特定操作的可重用组件，自定义节点可让您扩展代理工作流的功能。

要了解更多关于什么是图节点、它们的用法以及现有默认节点的信息，请参阅[图节点](nodes-and-components.md)。

## 节点架构概览

在深入了解实现细节之前，了解 Koog 框架中的节点架构非常重要。节点是代理工作流的基础构建块，其中每个节点代表工作流中的特定操作或转换。您可以使用边连接节点，边定义了节点之间的执行流。

每个节点都有一个 `execute` 方法，该方法接收一个输入并产生一个输出，然后该输出会被传递给工作流中的下一个节点。

## 实现一个自定义节点

自定义节点的实现范围很广，从在输入数据上执行基本逻辑并返回输出的简单实现，到接受参数并在多次运行之间保持状态的复杂节点实现。

### 基本节点实现

在图中实现自定义节点并定义自定义逻辑的最简单方法是使用以下模式：

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
    // 处理
    returnValue
}
```
<!--- KNIT example-custom-nodes-01.kt -->

上述代码代表了一个具有预定义 `Input` 和 `Output` 类型的自定义节点 `myNode`，带有可选的名称字符串实参 (`node_name`)。在实际示例中，这是一个获取字符串输入并返回输入长度的简单节点：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val str = strategy<String, Int>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val myNode by node<String, Int>("node_name") { input ->
    // 处理
    input.length
}
```
<!--- KNIT example-custom-nodes-02.kt -->

创建自定义节点的另一种方法是在 `AIAgentSubgraphBuilderBase` 上定义一个调用 `node` 函数的扩展方法：

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
    // 自定义逻辑
    input // 将输入作为输出返回（透传）
}

val myCustomNode by myCustomNode("node_name")
```
<!--- KNIT example-custom-nodes-03.kt -->

这会创建一个执行某些自定义逻辑但在不修改的情况下将输入作为输出返回的透传节点。

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

您可以定义带有输入和输出形参的节点：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy
-->

```kotlin
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
    name: String? = null,
): AIAgentNodeDelegate<T, T> = node(name) { input ->
    // 执行一些额外的操作
    // 将输入作为输出返回
    input
}

val strategy = strategy<String, String>("strategy_name") {
    val myCustomNode by myParameterizedNode<String>("node_name")
}
```
<!--- KNIT example-custom-nodes-05.kt -->

### 有状态节点

如果您的节点需要在多次运行之间保持状态，可以使用闭包变量：

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
        println("节点已执行 $counter 次")
        input
    }
}
```
<!--- KNIT example-custom-nodes-06.kt -->

## 节点输入和输出类型

节点可以具有不同的输入和输出类型，这些类型被指定为泛型形参：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val stringToIntNode by node<String, Int>("node_name") { input: String ->
    // 处理
    input.toInt() // 将字符串转换为整数
}
```
<!--- KNIT example-custom-nodes-07.kt -->

!!! note
    输入和输出类型决定了节点如何连接到工作流中的其他节点。仅当源节点的输出类型与目标节点的输入类型兼容时，才能连接节点。

## 最佳做法

实现自定义节点时，请遵循以下最佳做法：

1. **保持节点功能单一**：每个节点应执行单一且明确定义的操作。
2. **使用描述性名称**：节点名称应清楚地表明其用途。
3. **记录形参文档**：为所有形参提供清晰的文档说明。
4. **优雅地处理错误**：实现适当的错误处理以防止工作流失败。
5. **使节点可重用**：设计可在不同工作流中重用的节点。
6. **使用类型形参**：在适当时使用泛型类型形参以使节点更加灵活。
7. **提供默认值**：尽可能为形参提供合理的默认值。

## 常用模式

以下部分提供了一些实现自定义节点的常用模式。

### 透传节点

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

与 LLM 进行交互的节点。

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
            user("请总结以下文本：$input")
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
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.ResponseMetaInfo
import kotlin.time.Clock
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
        content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 使用输入作为工具实参
    )

    val result = environment.executeTool(toolCall)
    result.content
}
```
<!--- KNIT example-custom-nodes-11.kt -->