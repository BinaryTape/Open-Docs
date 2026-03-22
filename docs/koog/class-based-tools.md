# 基于类的工具

本节介绍了专为需要更高灵活性和定制化行为的场景而设计的 API。
通过这种在 Kotlin 中的方法，您可以完全控制工具，包括其形参、元数据、执行逻辑以及注册和调用方式。在 Java 中，工具是使用基于注解的方法创建的，并配合基于反射的注册。

这种控制级别非常适合创建扩展基础用例的复杂工具，从而实现与智能体会话和工作流的无缝集成。

本页介绍了如何在 Kotlin 和 Java 中实现工具、通过注册表管理工具、调用工具，以及如何在基于节点的智能体架构中使用工具。

!!! note
    对于 Kotlin，该 API 是多平台的。Java 工具使用基于注解的方法实现，并针对反射进行注册。这让您可以在 Kotlin 的不同平台之间使用相同的工具，而 Java 则提供了完整的 JVM 互操作性。

## 工具实现

Koog 框架提供了以下工具实现方法：

针对 Kotlin：

*   为所有工具使用基类 `Tool`。当您需要返回非文本结果或需要完全控制工具行为时，应使用此类。
*   使用扩展了基类 `Tool` 的 `SimpleTool` 类，它简化了返回文本结果的工具的创建。对于工具仅需返回文本的场景，应使用此方法。

这两种方法都使用相同的核心组件，但在实现方式和返回结果上有所不同。

针对 Java：

*   使用基于注解的方法（`@Tool` 和 `@LLMDescription`）并配合基于反射的注册。这是 Java 互操作性的推荐方法，因为由于挂起函数限制，不支持从 Java 继承 Kotlin 的 `Tool` 或 `SimpleTool`。

### Tool 类 (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象类是 Kotlin 中创建工具的基类。
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

!!! note "Java 实现"
    在 Java 中，不要继承 `Tool<Args, Result>`，而是使用带有 `@Tool` 和 `@LLMDescription` 的基于注解的方法。框架通过反射自动处理序列化和注册。有关更多详细信息，请参阅下文的[基于注解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    确保您的工具有清晰的描述和明确定义的形参名称，以便 LLM 更容易理解并正确使用它们。在 Kotlin 中，使用 `descriptor` 属性；在 Java 中，使用 `@LLMDescription` 注解。

#### 使用示例

以下是使用 `Tool` 类实现返回数值结果的自定义工具示例：

=== "Kotlin"

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

### SimpleTool 类 (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具的创建。

每个简单工具由以下组件组成：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义自定义工具所需实参的可序列化数据类。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 重写的变量，定义如何序列化工具的实参。另请参阅 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 重写的变量，指定工具元数据：<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (默认为空)<br/> - `optionalParameters` (默认为空)<br/> 另请参阅 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 重写的函数，描述工具执行的主要操作。它接收 `Args` 类型的实参并返回 `String`。另请参阅 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! note "Java 实现"
    在 Java 中，等效的方法是使用返回 `String` 的基于注解的方法。框架会自动处理文本结果的包装。有关更多详细信息，请参阅下文的[基于注解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    确保您的工具有清晰的描述和明确定义的形参名称，以便 LLM 更容易理解并正确使用它们。在 Kotlin 中，使用 `descriptor` 和构造函数参数；在 Java 中，使用 `@Tool` 和 `@LLMDescription` 注解。

#### 使用示例 

以下是在 Kotlin 中使用 `SimpleTool` 实现自定义工具的示例：

=== "Kotlin"

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

### 基于注解的方法 (Java)

要在 Java 中实现工具，不要继承 `Tool` 或 `SimpleTool`，而是使用带有 `@Tool` 和 `@LLMDescription` 的基于注解的方法。Koog 通过反射自动处理序列化和注册。要了解更多关于实现的细节，请参阅下面的 Java 示例。

#### 使用示例

这是一个在 Java 中实现工具的示例，相当于在 Kotlin 中使用 `Tool` 类。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Java 等效实现：将工具实现为 Java 方法，并通过 ToolRegistry.builder() 进行注册。
    // 这是推荐的 Java 互操作路径，而不是继承 Kotlin 的 Tool 基类。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "一个可以将两个数字 (0-9) 相加的简单计算器。")
        public static int calculator(
                @LLMDescription(description = "要相加的第一个数字 (0-9)") int digit1,
                @LLMDescription(description = "要相加的第二个数字 (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 必须是单个数字 (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 必须是单个数字 (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注意：不支持从 Java 继承 Kotlin 的 Tool<TArgs, TResult> 并重写挂起的 execute(...)。
    // Java 互操作使用基于反射的注册，将 Java 方法注册为工具。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

这是一个在 Java 中实现工具的示例，相当于在 Kotlin 中使用 `SimpleTool` 类。本示例实现了一个返回文本结果的简单工具。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleTool 的 Java 等效实现：提供一个 Java 方法并将其注册为工具。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "将传入的表达式转换为 double，如果表达式不可转换，则返回 0.0")
        public static String castToDouble(
                @LLMDescription(description = "要转换为 double 的表达式") String expression,
                @LLMDescription(description = "关于如何处理该表达式的注释") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "结果: " + value + ", 注释为: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注意：不需要从 Java 继承 Kotlin 的 SimpleTool<TArgs>；注册 Java 方法是惯用方法。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### 以自定义格式向 LLM 发送工具结果

针对 Kotlin：

如果您对发送给 LLM 的 JSON 结果不满意（例如，在某些情况下，如果工具输出被结构化为 Markdown 格式，LLM 可能会表现得更好），您必须执行以下步骤：

1. 实现 `ToolResult.TextSerializable` 接口，并重写 `textForLLM()` 方法。
2. 使用 `ToolResultUtils.toTextSerializer<T>()` 重写 `resultSerializer`。

针对 Java：

直接从您的注解方法返回格式化文本（如 Markdown）作为 `String`。框架会自动处理。

#### 示例

以下示例显示了 Kotlin 和 Java 中的自定义格式化输出：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;

    // Java 等效实现：直接从 Java 方法向 LLM 返回 Markdown 文本，并将其注册为工具。
    // 这避免了需要自定义可序列化的 Result 类型（这需要 Kotlin 序列化支持）。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "编辑给定的文件")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: 实现文件编辑逻辑；下面是展示 Markdown 输出的占位符
            boolean success = false;
            if (success) {
                return "**成功** 编辑了文件（已应用补丁）";
            } else {
                return "文件 **未** 被修改（补丁应用失败: 原因）";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注意：如果您需要从 Java 获取结构化的自定义 Result 对象，则必须公开 Kotlin @Serializable 类型
    // 或另一个可感知序列化程序的类型。返回 String 在 Koog 的 Java 互操作中可以开箱即用。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

在 Kotlin 或 Java 中实现工具后，您需要将其添加到工具注册表中，然后与智能体一起使用。
有关详细信息，请参阅[工具注册表](tools-overview.md#tool-registry)。