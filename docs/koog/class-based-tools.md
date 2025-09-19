# 基于类的工具

本节介绍专为需要增强灵活性和自定义行为的场景而设计的 API。通过这种方法，您可以完全控制工具，包括其参数、元数据、执行逻辑以及注册和调用方式。

这种级别的控制非常适合创建能够扩展基本用例的复杂工具，从而实现与代理会话和工作流的无缝集成。

本页介绍如何实现工具、通过注册表管理工具、调用工具以及在基于节点的代理架构中使用工具。

!!! note
    此 API 是多平台的。这使得您可以在不同平台使用相同的工具。

## 工具实现

Koog 框架提供以下工具实现方法：

*   对于所有工具，使用基类 `Tool`。当您需要返回非文本结果或需要完全控制工具行为时，应使用此基类。
*   使用 `SimpleTool` 类，该类扩展了基类 `Tool` 并简化了返回文本结果的工具的创建。当工具仅需要返回文本时，应使用此方法。

这两种方法使用相同的核心组件，但在实现和返回结果方面有所不同。

### Tool 类

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象类是 Koog 中创建工具的基类。它允许您创建接受特定实参类型 (`Args`) 并返回各种类型 (`Result`) 结果的工具。

每个工具都包含以下组件：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                                                   |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                               | 定义工具所需实参的可序列化数据类。此数据类必须实现 [`ToolArgs`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/-args/index.html) 接口。对于不需要实参的工具，您可以使用内置的 `ToolArgs.Empty` 实现。 |
| `Result`                             | 工具返回的结果类型。此类型必须实现 [`ToolResult`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/index.html) 接口，可以是 `ToolResult.Text`、`ToolResult.Boolean`、`ToolResult.Number`，或是 `ToolResult.JSONSerializable` 的自定义实现。 |
| `argsSerializer`                     | 重写变量，定义工具实参的反序列化方式。另请参见 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                  |
| `descriptor`                         | 重写变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/>- `optionalParameters`（默认为空）<br/>另请参见 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                        |
| `execute()`                          | 实现工具逻辑的函数。它接受 `Args` 类型的实参并返回 `Result` 类型的结果。另请参见 [execute()]()。                                                                                                                                         |

!!! tip
    确保您的工具具有清晰的描述和定义良好的参数名称，以便 LLM 更容易理解和正确使用它们。

#### 使用示例

这是一个使用 `Tool` 类实现自定义工具并返回数值结果的示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolResult
import kotlinx.serialization.Serializable
-->
```kotlin
// Implement a simple calculator tool that adds two digits
object CalculatorTool : Tool<CalculatorTool.Args, ToolResult.Number>() {
    
    // Arguments for the calculator tool
    @Serializable
    data class Args(
        val digit1: Int,
        val digit2: Int
    ) : ToolArgs {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor: ToolDescriptor = ToolDescriptor(
        name = "calculator",
        description = "A simple calculator that can add two digits (0-9).",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "digit1",
                description = "The first digit to add (0-9)",
                type = ToolParameterType.Integer
            )
        ),
        optionalParameters = listOf(
            ToolParameterDescriptor(
                name = "digit2",
                description = "The second digit to add (0-9)",
                type = ToolParameterType.Integer
            )
        )
    )

    // Function to add two digits
    override suspend fun execute(args: Args): ToolResult.Number {
        val sum = args.digit1 + args.digit2
        return ToolResult.Number(sum)
    }
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

实现工具后，您需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。

有关更多详细信息，请参见 [API 参考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 类

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具的创建。

每个简单工具都包含以下组件：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                              |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                               | 定义自定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                                                        |
| `argsSerializer`                     | 重写变量，定义工具实参的序列化方式。另请参见 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                         | 重写变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/> - `optionalParameters`（默认为空）<br/> 另请参见 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                        | 重写函数，描述工具执行的主要操作。它接受 `Args` 类型的实参并返回一个 `String`。另请参见 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    确保您的工具具有清晰的描述和定义良好的参数名称，以便 LLM 更容易理解和正确使用它们。

#### 使用示例 

这是一个使用 `SimpleTool` 实现自定义工具的示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
-->
```kotlin
// Create a tool that casts a string expression to a double value
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // Define tool arguments
    @Serializable
    data class Args(val expression: String, val comment: String) : ToolArgs

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor = ToolDescriptor(
        name = "cast_to_double",
        description = "casts the passed expression to double or returns 0.0 if the expression is not castable",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "expression", description = "An expression to case to double", type = ToolParameterType.String
            )
        ),
        optionalParameters = listOf(
            ToolParameterDescriptor(
                name = "comment",
                description = "A comment on how to process the expression",
                type = ToolParameterType.String
            )
        )
    )
    
    // Function that executes the tool with the provided arguments
    override suspend fun doExecute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }
    
    // Function to cast a string expression to a double value
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

实现工具后，您需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。