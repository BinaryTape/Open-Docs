# 基于类的工具

本节介绍了专为需要更高灵活性和定制化行为的场景而设计的 API。
通过这种方法，您可以完全控制工具，包括其参数、元数据、执行逻辑以及注册和调用方式。

这种控制级别非常适合创建扩展基础用例的复杂工具，从而实现与智能体会话和工作流的无缝集成。

本页介绍了如何实现工具、通过注册表管理工具、调用工具，以及如何在基于节点的智能体架构中使用工具。

!!! note
    该 API 是多平台的。这让您可以在不同平台之间使用相同的工具。

## 工具实现

Koog 框架提供了以下工具实现方法：

*   为所有工具使用 `Tool` 基类。当您需要返回非文本结果或需要完全控制工具行为时，应使用此类。
*   使用扩展了 `Tool` 基类的 `SimpleTool` 类，它简化了返回文本结果的工具的创建。对于工具仅需返回文本的场景，应使用此方法。

这两种方法都使用相同的核心组件，但在实现方式和返回结果上有所不同。

### Tool 类

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象类是 Koog 中创建工具的基类。
它允许您创建接收特定实参类型 (`Args`) 并返回各种类型结果 (`Result`) 的工具。

每个工具由以下组件组成：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                                                                                                                                                            |
| `Result`                                 | 工具返回的结果的可序列化类型。如果您想以自定义格式呈现工具结果，请继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 类并实现 `textForLLM(): String` 方法。                                                                                                          |
| `argsSerializer`                         | 重写的变量，定义如何反序列化工具的实参。另请参阅 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                                                                                                                       |
| `resultSerializer`                       | 重写的变量，定义如何反序列化工具的结果。另请参阅 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您选择继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，请考虑使用 `ToolResultUtils.toTextSerializer()`。 |
| `descriptor`                             | 重写的变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (默认为空)<br/>- `optionalParameters` (默认为空)<br/>另请参阅 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                               |
| `execute()`                              | 实现工具逻辑的函数。它接收 `Args` 类型的实参并返回 `Result` 类型的结果。另请参阅 [execute()]()。                                                                                                                                                                                                                                                                                 |

!!! tip
    确保您的工具有清晰的描述和明确定义的形参名称，以便 LLM 更容易理解并正确使用它们。

#### 使用示例

以下是使用 `Tool` 类实现返回数值结果的自定义工具示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// 实现一个简单的计算器工具，将两个数字相加
object CalculatorTool : Tool<CalculatorTool.Args, Int>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Int>(),
    name = "calculator",
    description = "一个可以将两个数字 (0-9) 相加的简单计算器。"
) {

    // 计算器工具的实参
    @Serializable
    data class Args(
        @property:LLMDescription("要相加的第一个数字 (0-9)")
        val digit1: Int,
        @property:LLMDescription("要相加的第二个数字 (0-9)")
        val digit2: Int
    ) {
        init {
            require(digit1 in 0..9) { "digit1 必须是单个数字 (0-9)" }
            require(digit2 in 0..9) { "digit2 必须是单个数字 (0-9)" }
        }
    }

    // 执行两个数字相加的函数
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

实现工具后，您需要将其添加到工具注册表中，然后与智能体一起使用。有关详细信息，请参阅[工具注册表](tools-overview.md#tool-registry)。

欲了解更多详情，请参阅 [API 参考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 类

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具的创建。

每个简单工具由以下组件组成：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义自定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 重写的变量，定义如何序列化工具的实参。另请参阅 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 重写的变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (默认为空)<br/> - `optionalParameters` (默认为空)<br/> 另请参阅 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 重写的函数，描述工具执行的主要操作。它接收 `Args` 类型的实参并返回 `String`。另请参阅 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! tip
    确保您的工具有清晰的描述和明确定义的形参名称，以便 LLM 更容易理解并正确使用它们。

#### 使用示例 

以下是使用 `SimpleTool` 实现自定义工具的示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
-->
```kotlin
// 创建一个将字符串表达式转换为 double 值的工具
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
    argsType = typeToken<Args>(),
    name = "cast_to_double",
    description = "将传入的表达式转换为 double，如果表达式不可转换，则返回 0.0"
) {
    // 定义工具实参
    @Serializable
    data class Args(
        @property:LLMDescription("要转换为 double 的表达式")
        val expression: String,
        @property:LLMDescription("关于如何处理该表达式的注释")
        val comment: String
    )

    // 使用提供的实参执行工具的函数
    override suspend fun execute(args: Args): String {
        return "结果: ${castToDouble(args.expression)}, " + "注释为: ${args.comment}"
    }

    // 将字符串表达式转换为 double 值的函数
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### 以自定义格式向 LLM 发送工具结果

如果您对发送给 LLM 的 JSON 结果不满意（在某些情况下，如果工具输出被结构化为 Markdown 格式，LLM 可能会表现得更好），您必须执行以下步骤：
1. 实现 `ToolResult.TextSerializable` 接口，并重写 `textForLLM()` 方法。
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 重写 `resultSerializer`。

#### 示例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// 一个编辑文件的工具
object EditFile : Tool<EditFile.Args, EditFile.Result>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Result>(),
    name = "edit_file",
    description = "编辑给定的文件"
) {
    // 定义工具实参
    @Serializable
    public data class Args(
        val path: String,
        val original: String,
        val replacement: String
    )

    @Serializable
    public data class Result(
        private val patchApplyResult: PatchApplyResult
    ) {

        @Serializable
        public sealed interface PatchApplyResult {
            @Serializable
            public data class Success(val updatedContent: String) : PatchApplyResult

            @Serializable
            public sealed class Failure(public val reason: String) : PatchApplyResult
        }

        // 工具完成后对 LLM 可见的文本输出（Markdown 格式）。
        fun textForLLM(): String = markdown {
            if (patchApplyResult is PatchApplyResult.Success) {
                line {
                    bold("成功").text(" 编辑了文件（已应用补丁）")
                }
            } else {
                line {
                    text("文件 ")
                        .bold("未")
                        .text(" 被修改（补丁应用失败: ${(patchApplyResult as PatchApplyResult.Failure).reason}）")
                }
            }
        }

        override fun toString(): String = textForLLM()
    }

    // 使用提供的实参执行工具的函数
    override suspend fun execute(args: Args): Result {
        return TODO("实现文件编辑")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt -->

实现工具后，您需要将其添加到工具注册表中，然后与智能体一起使用。
有关详细信息，请参阅[工具注册表](tools-overview.md#tool-registry)。