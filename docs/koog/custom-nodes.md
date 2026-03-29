# 自定义节点实现

本页提供了关于如何在 Koog 框架中实现自定义节点的详细说明。通过创建执行特定操作的可重用组件，自定义节点可让您扩展代理工作流的功能。

要了解更多关于什么是图节点、它们的用法以及现有默认节点的信息，请参阅[图节点](nodes-and-components.md)。

## 节点架构概览

在深入了解实现细节之前，了解 Koog 框架中节点的架构非常重要。节点是代理工作流的基础构建块，其中每个节点代表工作流中的特定操作或转换。您可以使用边连接节点，边定义了节点之间的执行流。

每个节点都有一个 `execute` 方法，该方法接收一个输入并产生一个输出，然后该输出会被传递给工作流中的下一个节点。

## 实现一个自定义节点

自定义节点的实现范围很广，从在输入数据上执行基本逻辑并返回输出的简单实现，到接受形参并在运行之间保持状态的复杂节点实现。

### 基本节点实现

在图中实现自定义节点并定义自定义逻辑的最简单方法是使用以下模式：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava01 {
        static class Input {}
        static class Output {}
        static Output returnValue = new Output();
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(Input.class)
        .withOutput(Output.class)
        .withAction((input, ctx) -> {
            // 处理
            return returnValue;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava01.java -->

上述代码代表了一个具有预定义 `Input` 和 `Output` 类型的自定义节点 `myNode`，带有可选的名称字符串实参 (`node_name`)。在 Kotlin 中，您可以使用 `node` DSL 函数。在 Java 中，您可以使用 `AIAgentNode.builder()` 模式。

在实际示例中，这是一个获取字符串输入并返回输入长度的简单节点：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 处理
            return input.length();
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava02.java -->

另一种创建自定义节点的方法是将其提取到可重用函数中。在 Kotlin 中，您可以在 `AIAgentSubgraphBuilderBase` 上定义一个调用 `node` 函数的扩展函数。在 Java 中，您可以将节点构建器调用提取到帮助程序方法中。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 自定义逻辑
            return input; // 将输入作为输出返回（透传）
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava03.java -->

这会创建一个执行某些自定义逻辑但在不修改的情况下将输入作为输出返回的透传节点。

### 带有额外实参的节点

您可以创建接受实参以自定义其行为的节点：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    String arg1 = "value1";
    int arg2 = 42;

    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 在您的自定义逻辑中使用 arg1 和 arg2
            return input; // 将输入作为输出返回
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava04.java -->

### 参数化节点

您可以定义带有泛型输入和输出类型形参的节点。在 Kotlin 中，您可以使用带有 `reified` 类型形参的 `inline` 函数。在 Java 中，您在构建节点时需显式指定类型。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，构建节点时需显式指定类型
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 执行一些额外的操作
            // 将输入作为输出返回
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava05.java -->

### 有状态节点

如果您的节点需要在多次运行之间保持状态，可以使用闭包变量。在 Kotlin 中，您在封闭函数中声明一个变量。在 Java 中，由于 lambda 捕获必须是事实上的 final，因此您可以使用 `AtomicInteger` 等线程安全包装器。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import java.util.concurrent.atomic.AtomicInteger;
    class exampleCustomNodesJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中使用 AtomicInteger（或类似物），因为 lambda 捕获必须是事实上的 final
    AtomicInteger counter = new AtomicInteger(0);

    var myStatefulNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            int count = counter.incrementAndGet();
            System.out.println("节点已执行 " + count + " 次");
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava06.java -->

## 节点输入和输出类型

节点可以具有不同的输入和输出类型。在 Kotlin 和 Java 中，这些类型都被指定为泛型类型形参：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava07 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var stringToIntNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 处理
            return Integer.parseInt(input); // 将字符串转换为整数
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava07.java -->

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

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava08 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var loggingNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("正在处理输入：" + input);
            return input; // 将输入作为输出返回
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava08.java -->

### 转换节点

转换输入数据并产生修改后的输出的节点。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava09 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var upperCaseNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("正在处理输入：" + input);
            return input.toUpperCase(); // 将输入转换为大写
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava09.java -->

### LLM 交互节点

与 LLM 进行交互的节点。在 Kotlin 中，您可以对 LLM 会话进行精细控制。在 Java 中，您通常使用预构建的工厂方法（如 `AIAgentNode.llmRequest()`），这些方法会自动处理提示词构建。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    class exampleCustomNodesJava10 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，LLM 交互是使用预构建的工厂节点处理的。
    // AIAgentNode.llmRequest() 会创建一个节点，该节点将输入字符串作为用户消息
    // 发送到 LLM 并返回响应。在图中执行该节点时，提示词文本将作为
    // 该节点的输入提供。
    var summarizeTextNode = AIAgentNode.llmRequest(true, "node_name");

    // 要从 LLM 响应中提取文本内容，请链接一个单独的节点：
    var extractContent = AIAgentNode.builder("extract-content")
        .withInput(Message.Response.class)
        .withOutput(String.class)
        .withAction((response, ctx) -> response.getContent())
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava10.java -->

!!! note
    上面的 Kotlin 示例展示了对 LLM 会话的精细控制（自定义提示词构建、显式调用 `requestLLMWithoutTools`）。Java API 提供了更高级别的工厂方法（如 `AIAgentNode.llmRequest()`），这些方法会自动处理提示词构建 —— 输入字符串会直接成为用户消息。对于大多数用例，这已经足够了；对于高级提示词自定义，请组合多个节点或使用自定义子图。

### 工具运行节点

执行工具的自定义节点。在 Kotlin 中，您可以手动构造工具调用并执行它们。在 Java 中，您通常使用将工具编排委托给 LLM 的子图。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    class exampleCustomNodesJava11 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 在 Java 中，通过 Java 构建器 API 无法实现直接执行工具（如 Kotlin 示例所示）。
    // 相反，应使用一个将工具调用委托给 LLM 的子图，由 LLM 决定何时以及如何调用工具：
    var toolSubgraph = AIAgentSubgraph.builder("tool-subgraph")
        .withInput(String.class)
        .withOutput(String.class)
        .withTask(input -> "使用 my_tool，输入为：" + input)
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava11.java -->

!!! note
    Kotlin 示例通过手动构造 `Message.Tool.Call` 并调用 `environment.executeTool()` 演示了低级工具执行。Java API 鼓励使用带有 `withTask()` 的子图这种更高级的方法，由 LLM 自动编排工具调用。若要限制可用的工具，请在 `.withInput()` 之前链接 `.limitedTools(List.of(myTool))`。