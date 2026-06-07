# 基于类的工具

本节介绍了专为需要更高灵活性和自定义行为的场景而设计的 API。
在 Kotlin 中使用这种方法，您可以完全控制工具，包括其形参、元数据、执行逻辑以及如何注册和调用。在 Java 中，工具是使用基于注解的方法创建的，并采用基于反射的注册。

这种级别的控制非常适合创建扩展基本用例的复杂工具，从而实现与智能体会话和流水线的无缝集成。

本页介绍了如何在 Kotlin 和 Java 中实现工具、通过注册表管理工具、调用工具，以及在基于节点的智能体架构中使用工具。

!!! note
    该 API 是 Kotlin 的多平台 API。Java 工具使用基于注解的方法实现，并通过反射进行注册。这使您可以在 Kotlin 的不同平台之间使用相同的工具，而 Java 则提供完整的 JVM 互操作性。

## 工具实现

Koog 框架提供了以下实现工具的方法：

对于 Kotlin：

*   为所有工具使用基类 `Tool`。当您需要返回非文本结果或需要对工具行为进行完全控制时，应使用此类。
*   使用扩展了基类 `Tool` 的 `SimpleTool` 类，它简化了返回文本结果的工具的创建。对于工具仅需返回文本的场景，应使用此方法。

这两种方法都使用相同的核心组件，但在实现和返回的结果上有所不同。

对于 Java：

*   使用基于注解的方法（`@Tool` 和 `@LLMDescription`）以及基于反射的注册。这是推荐的 Java 互操作方法，因为由于挂起函数的限制，不支持从 Java 子类化 Kotlin 的 `Tool` 或 `SimpleTool`。

### Tool 类 (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象类是在 Kotlin 中创建工具的基类。
它允许您创建接受特定参数类型 (`Args`) 并返回各种类型结果 (`Result`) 的工具。

每个工具由以下组件组成：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义工具所需形参的可序列化数据类。                                                                                                                                                                                                                                                                                                                                                             |
| `Result`                                 | 工具返回的结果的可序列化类型。如果您想以自定义格式呈现工具结果，请继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 类并实现 `textForLLM(): String` 方法。                                                                                                           |
| `argsSerializer`                         | 定义如何反序列化工具形参的重写变量。另请参阅 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                                                                                                                                                        |
| `resultSerializer`                       | 定义如何反序列化工具结果的重写变量。另请参阅 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)。如果您选择继承 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)，请考虑使用 `ToolResultUtils.toTextSerializer()`。 |
| `descriptor`                             | 指定工具元数据的重写变量：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/>- `optionalParameters`（默认为空）<br/>另请参阅 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。                                                                                                                                |
| `execute()`                              | 实现工具逻辑的函数。它接受类型为 `Args` 的实参并返回类型为 `Result` 的结果。另请参阅 [execute()]()。                                                                                                                                                                                                                                                                                  |

!!! note "Java 实现"
    在 Java 中，不要子类化 `Tool<Args, Result>`，而是使用带有 `@Tool` 和 `@LLMDescription` 的基于注解的方法。框架通过反射自动处理序列化和注册。有关更多详细信息，请参阅下面的[基于注解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    确保您的工具有清晰的描述和定义良好的形参名称，以便 LLM 更容易理解并正确使用它们。在 Kotlin 中使用 `descriptor` 属性；在 Java 中使用 `@LLMDescription` 注解。

#### 使用示例

以下是使用 `Tool` 类实现返回数字结果的自定义工具的示例：

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
        description = "A simple calculator that can add two digits (0-9)."
    ) {

        // 计算器工具的参数
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        ) {
            init {
                require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
                require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
            }
        }

        // 将两个数字相加的函数
        override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
    }
    ```
    <!--- KNIT example-class-based-tools-01.kt -->

在实现工具后，您需要将其添加到工具注册表中，然后与智能体一起使用。有关详细信息，请参阅[工具注册表](../tools/index.md#tool-registry)。

有关更多详细信息，请参阅 [API 参考手册](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)。

#### 从工具中读取智能体上下文

需要智能体完整状态（LLM 上下文、运行 ID、配置、存储等）的工具扩展 `AgentContextAwareTool<Args, Result>` 而不是 `Tool<Args, Result>`。框架会注入驱动调用的实时 `AIAgentContext`，工具将其作为类型化形参接收，而不是从实参架构中读取它。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.context.AIAgentContext
    import ai.koog.agents.core.agent.tools.AgentContextAwareTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 一个读取驱动调用的实时 AIAgentContext 的工具。
    object TracingCalculatorTool : AgentContextAwareTool<TracingCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "tracing_calculator",
        description = "Adds two digits and emits a log line tagged with the agent run id."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, context: AIAgentContext): Int {
            val runId = context.runId
            // ... 将 runId 用于横切关注点上下文（日志、跟踪、关联）
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-01.kt -->

`AgentContextAwareTool` 由框架通过框架代表工具管理的逐调用 `ToolCallMetadata` 辅助通道进行分派。在智能体运行之外调用此类工具会抛出 `IllegalStateException`，因为没有注入 `AIAgentContext`；生产代码应始终通过 `ContextualAgentEnvironment`，单元测试可以通过 `ToolCallMetadata.of(AgentContextAwareTool.AgentContextKey to context)` 显式提供上下文。

#### 读取原始逐调用元数据

少数工具希望读取由调用者或功能贡献的 *非* 智能体上下文条目（例如由可观测性功能贡献的分布式跟踪 span ID）。这些工具直接扩展 `ToolBase<Args, Result>`，它公开了完整的 `ToolCallMetadata` 包：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolBase
    import ai.koog.agents.core.tools.ToolCallMetadata
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    object SpanAwareCalculatorTool : ToolBase<SpanAwareCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "span_aware_calculator",
        description = "Adds two digits, propagating a tracing span id from caller or feature metadata."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, metadata: ToolCallMetadata): Int {
            val traceSpanId = metadata["trace.span.id"] as? String
            // ... 将 traceSpanId 用于横切关注点上下文（日志、跟踪、关联）
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-02.kt -->

调用者可以通过 `SafeTool.execute(args, serializer, metadata)` 或直接通过 `AIAgentEnvironment.executeTool(toolCall, metadata)` 传递元数据。功能可以在安装期间通过调用 `pipeline.provideToolCallMetadata(this) { eventContext -> mapOf(...) }` 为每个工具调用贡献元数据。在键冲突时，调用者提供的元数据始终优先于功能贡献。

扩展 `Tool<Args, Result>` 并重写 `execute(args)` 的现有工具继续保持原样工作：框架通过相同的路径分派它们并丢弃任何 `ToolCallMetadata`。要选择使用元数据，请切换到 `AgentContextAwareTool`（类型化上下文访问）或 `ToolBase`（原始包访问）。

### SimpleTool 类 (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象类扩展了 `Tool<Args, ToolResult.Text>`，并简化了返回文本结果的工具的创建。

每个简单工具由以下组件组成：

| <div style="width:110px">组件</div> | 描述                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 定义自定义工具所需形参的可序列化数据类。                                                                                                                                                                                                                         |
| `argsSerializer`                         | 定义如何序列化工具形参的重写变量。另请参阅 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)。                                                                                             |
| `descriptor`                             | 指定工具元数据的重写变量：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（默认为空）<br/> - `optionalParameters`（默认为空）<br/> 另请参阅 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)。 |
| `doExecute()`                            | 描述工具执行的主要操作的重写函数。它接受类型为 `Args` 的实参并返回一个 `String`。另请参阅 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)。                                          |

!!! note "Java 实现"
    在 Java 中，等效的方法是使用返回 `String` 的基于注解的方法。框架会自动处理文本结果的包装。有关更多详细信息，请参阅下面的[基于注解的方法 (Java)](#annotation-based-methods-java)。

!!! tip
    确保您的工具有清晰的描述和定义良好的形参名称，以便 LLM 更容易理解并正确使用它们向。在 Kotlin 中使用 `descriptor` 和构造函数形参；在 Java 中使用 `@Tool` 和 `@LLMDescription` 注解。

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
        description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
    ) {
        // 定义工具参数
        @Serializable
        data class Args(
            @property:LLMDescription("An expression to case to double")
            val expression: String,
            @property:LLMDescription("A comment on how to process the expression")
            val comment: String
        )

        // 使用提供的参数执行工具的函数
        override suspend fun execute(args: Args): String {
            return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
        }

        // 将字符串表达式转换为 double 值的函数
        private fun castToDouble(expression: String): Double {
            return expression.toDoubleOrNull() ?: 0.0
        }
    }
    ```
    <!--- KNIT example-class-based-tools-02.kt -->

### 基于注解的方法 (Java)

要在 Java 中实现工具，不要子类化 `Tool` 或 `SimpleTool`，而是使用带有 `@Tool` 和 `@LLMDescription` 的基于注解的方法。Koog 通过反射自动处理序列化和注册。要详细了解实现，请参阅下面的 Java 示例。

#### 使用示例

这是 Java 中工具实现的示例，等效于在 Kotlin 中使用 `Tool` 类。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Java 等效项：将工具实现为 Java 方法，并通过 ToolRegistry.builder() 进行注册。
    // 这是推荐的 Java 互操作路径，而不是子类化 Kotlin Tool 基类。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "A simple calculator that can add two digits (0-9).")
        public static int calculator(
                @LLMDescription(description = "The first digit to add (0-9)") int digit1,
                @LLMDescription(description = "The second digit to add (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 must be a single digit (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 must be a single digit (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注意：不支持从 Java 子类化 Kotlin Tool<TArgs, TResult> 并重写挂起的 execute(...)。
    // Java 互操作使用基于反射的 Java 方法注册作为工具。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

以下是 Java 中工具实现的示例，等效于在 Kotlin 中使用 `SimpleTool` 类。此示例实现了一个返回文本结果的简单工具。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleTool 的 Java 等效项：提供一个 Java 方法并将其注册为工具。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "casts the passed expression to double or returns 0.0 if the expression is not castable")
        public static String castToDouble(
                @LLMDescription(description = "An expression to case to double") String expression,
                @LLMDescription(description = "A comment on how to process the expression") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "Result: " + value + ", the comment was: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注意：不需要从 Java 扩展 Kotlin SimpleTool<TArgs>；注册 Java 方法是惯用方法。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### 以自定义格式向 LLM 发送工具结果

对于 Kotlin：

如果您对发送给 LLM 的 JSON 结果不满意（在某些情况下，如果工具输出被结构化为 Markdown 等格式，LLM 的工作效果会更好），您必须遵循以下步骤：

1.  实现 `ToolResult.TextSerializable` 接口，并重写 `textForLLM()` 方法。
2.  使用 `ToolResultUtils.toTextSerializer<T>()` 重写 `resultSerializer`。

对于 Java：

从您的注解方法直接返回格式化文本（如 Markdown）作为 `String`。框架会自动处理此操作。

#### 示例

以下示例展示了 Kotlin 和 Java 中的自定义格式化输出：

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
        description = "Edits the given file"
    ) {
        // 定义工具参数
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

            // 在工具完成后 LLM 可见的文本输出（Markdown 格式）。
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

        // 使用提供的参数执行工具的函数
        override suspend fun execute(args: Args): Result {
            return TODO("Implement file edit")
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

    // Java 等效项：从 Java 方法直接向 LLM 返回 Markdown 文本，并将其注册为工具。
    // 这避免了需要自定义可序列化的 Result 类型（这需要 Kotlin 序列化支持）。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "Edits the given file")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: 实现文件编辑逻辑；下面是说明 Markdown 输出的占位符
            boolean success = false;
            if (success) {
                return "**Successfully** edited file (patch applied)";
            } else {
                return "File was **not** modified (patch application failed: reason)";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注意：如果您需要来自 Java 的结构化自定义 Result 对象，则必须公开 Kotlin @Serializable 类型
    // 或另一个感知序列化程序的类型。返回 String 可以直接与 Koog 的 Java 互操作配合使用。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

在 Kotlin 或 Java 中实现工具后，您需要将其添加到工具注册表中，然后与智能体一起使用。
有关详细信息，请参阅[工具注册表](../tools/index#tool-registry)。