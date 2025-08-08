# 高级实现

本节介绍为需要增强灵活性和定制行为的场景设计的高级 API。通过这种方法，你可以完全控制一个工具，包括其形参、元数据、执行逻辑，以及如何注册和调用它。

这种控制级别非常适合创建复杂的工具，以扩展基本用例，实现与代理会话和工作流的无缝集成。

本页描述了如何实现工具、通过注册表管理工具、调用工具以及在基于节点的代理架构中使用工具。

!!! note
    高级工具 API 是多平台的。这使得你可以在不同平台之间使用相同的工具。

## 工具实现

Koog 框架为实现工具提供了以下方法：

*   使用 `Tool` 基类实现所有工具。当你需要返回非文本结果或需要完全控制工具行为时，应使用此类别。
*   使用 `SimpleTool` 类，它扩展了基础 `Tool` 类并简化了返回文本结果的工具创建。对于工具只需要返回文本的场景，你应该使用此方法。

这两种方法使用相同的核心组件，但在实现方式和返回结果方面有所不同。

### Tool 类

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象类是 Koog 中创建工具的基类。它允许你创建接受特定实参类型（`Args`）并返回各种类型结果（`Result`）的工具。

每个工具都包含以下组件：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                                                   |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义工具所需实参的可序列化数据类。此类别必须实现 [`ToolArgs`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/-args/index.html) 接口。对于不需要实参的工具，你可以使用内置的 `ToolArgs.Empty` 实现。 |
| `Result`                                 | 工具返回的结果类型。此类型必须实现 [`ToolResult`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/index.html) 接口，它可以是 `ToolResult.Text`、`ToolResult.Boolean`、`ToolResult.Number`，或是 `ToolResult.JSONSerializable` 的自定义实现。 |
| `argsSerializer`                         | 覆盖的变量，定义如何反序列化工具的实参。另请参见 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                  |
| `descriptor`                             | 覆盖的变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/>- `optionalParameters`（默认为空）<br/>另请参见 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                        |
| `execute()`                              | 实现工具逻辑的函数。它接受 `Args` 类型的实参并返回 `Result` 类型的结果。另请参见 [execute()]()。                                                                                                                                         |

!!! tip
    请确保你的工具拥有清晰的描述和定义良好的形参名称，以便 LLM 更容易理解和正确使用它们。

#### 使用示例

以下是一个使用 `Tool` 类实现的自定义工具示例，它返回一个数值结果：

```kotlin
// 实现一个简单的计算器工具，用于添加两个数字
object CalculatorTool : Tool<CalculatorTool.Args, ToolResult.Number>() {
    
    // 计算器工具的实参
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

    // Args 类的序列化器
    override val argsSerializer = Args.serializer()

    // 工具描述符
    override val descriptor: ToolDescriptor = ToolDescriptor(
        name = "calculator",
        description = "A simple calculator that can add two digits (0-9).",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "digit1",
                description = "The first digit to add (0-9)",
                type = ToolParameterType.Integer
            ),
            ToolParameterDescriptor(
                name = "digit2",
                description = "The second digit to add (0-9)",
                type = ToolParameterType.Integer
            )
        )
    )

    // 添加两个数字的函数
    override suspend fun execute(args: Args): ToolResult.Number {
        val sum = args.digit1 + args.digit2
        return ToolResult.Number(sum)
    }
}
```

在实现工具之后，你需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。

有关更多详细信息，请参见 [API 参考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 类

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具创建。

每个简单工具都包含以下组件：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义自定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                                                        |
| `argsSerializer`                         | 覆盖的变量，定义如何序列化工具的实参。另请参见 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 覆盖的变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/> - `optionalParameters`（默认为空）<br/> 另请参见 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 描述工具执行的主要操作的覆盖函数。它接受 `Args` 类型的实参并返回一个 `String`。另请参见 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    请确保你的工具拥有清晰的描述和定义良好的形参名称，以便 LLM 更容易理解和正确使用它们。

#### 使用示例

以下是一个使用 `SimpleTool` 实现的自定义工具示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
-->
```kotlin
// 创建一个将字符串表达式转换为双精度浮点值的工具
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // 定义工具实参
    @Serializable
    data class Args(val expression: String, val comment: String) : ToolArgs

    // Args 类的序列化器
    override val argsSerializer = Args.serializer()

    // 工具描述符
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
    
    // 使用提供的实参执行工具的函数
    override suspend fun doExecute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }
    
    // 将字符串表达式转换为双精度浮点值的函数
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```

在实现工具之后，你需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。