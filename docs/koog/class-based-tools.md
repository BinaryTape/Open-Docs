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

每个工具包含以下组件：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                               | 定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                                                                                                                                                                                           |
| `Result`                             | 工具返回的可序列化结果类型。如果您希望以自定义格式呈现工具结果，请继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 类并实现 `textForLLM(): String` 方法                                                                                                          |
| `argsSerializer`                     | 重写变量，定义工具实参的反序列化方式。另请参见 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                                                                                                                       |
| `resultSerializer`                   | 重写变量，定义工具结果的反序列化方式。另请参见 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您选择继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，请考虑使用 `ToolResultUtils.toTextSerializer()` |
| `descriptor`                         | 重写变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/>- `optionalParameters`（默认为空）<br/>另请参见 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                               |
| `execute()`                          | 实现工具逻辑的函数。它接受 `Args` 类型的实参并返回 `Result` 类型的结果。另请参见 [execute()]()。                                                                                                                                                                                                                                                  |

!!! tip
    确保您的工具具有清晰的描述和定义良好的参数名称，以便 LLM 更容易理解和正确使用它们。

#### 使用示例

这是一个使用 `Tool` 类实现自定义工具并返回数值结果的示例：

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// 实现一个简单的计算器工具，用于添加两个数字
object CalculatorTool : Tool<CalculatorTool.Args, Int>(
    argsSerializer = Args.serializer(),
    resultSerializer = Int.serializer(),
    name = "calculator",
    description = "A simple calculator that can add two digits (0-9)."
) {

    // 计算器工具的实参
    @Serializable
    data class Args(
        @property:LLMDescription("要添加的第一个数字（0-9）")
        val digit1: Int,
        @property:LLMDescription("要添加的第二个数字（0-9）")
        val digit2: Int
    ) {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // 添加两个数字的函数
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

实现工具后，您需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。

有关更多详细信息，请参见 [API 参考](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

### SimpleTool 类

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具的创建。

每个简单工具包含以下组件：

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
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.Serializable
-->
```kotlin
// 创建一个将字符串表达式转换为双精度值的工具
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
    argsSerializer = Args.serializer(),
    name = "cast_to_double",
    description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
) {
    // 定义工具实参
    @Serializable
    data class Args(
        @property:LLMDescription("要转换为双精度值的表达式")
        val expression: String,
        @property:LLMDescription("关于如何处理表达式的注释")
        val comment: String
    )

    // 使用提供的实参执行工具的函数
    override suspend fun execute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }

    // 将字符串表达式转换为双精度值的函数
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### 以自定义格式将工具结果发送给 LLM

如果您对发送给 LLM 的 JSON 结果不满意（例如，在某些情况下，如果工具输出以 Markdown 格式结构化，LLM 可以更好地工作），您必须遵循以下步骤：
1. 实现 `ToolResult.TextSerializable` 接口，并覆盖 `textForLLM()` 方法
2. 覆盖 `resultSerializer`，使用 `ToolResultUtils.toTextSerializer<T>()`

#### 示例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// 一个编辑文件的工具
object EditFile : Tool<EditFile.Args, EditFile.Result>(
    argsSerializer = Args.serializer(),
    resultSerializer = Result.serializer(),
    name = "edit_file",
    description = "Edits the given file"
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

        // 工具完成后，LLM 将看到的文本输出（Markdown 格式）。
        fun textForLLM(): String = markdown {
            if (patchApplyResult is PatchApplyResult.Success) {
                line {
                    bold("Successfully").text(" edited file (patch applied)")
                }
            } else {
                line {
                    text("File was ")
                        .bold("not")
                        .text(" modified (patch application failed: ${(patchApplyResult as PatchApplyResult.Failure).reason})")
                }
            }
        }

        override fun toString(): String = textForLLM()
    }

    // 使用提供的实参执行工具的函数
    override suspend fun execute(args: Args): Result {
        return TODO("Implement file edit")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt --> 

实现工具后，您需要将其添加到工具注册表，然后与代理一起使用。有关详细信息，请参见 [工具注册表](tools-overview.md#tool-registry)。