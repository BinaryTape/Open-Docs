# 测试

## 概述

测试功能为 Koog 框架中的 AI 代理流水线、子图以及工具交互提供了一个全面的测试框架。它使开发者能够使用模拟 (Mock) LLM（大语言模型）执行器、工具库和代理环境来创建受控的测试环境。

### 目的

此功能的主要目的是通过以下方式促进基于代理的 AI 功能的测试：

- 针对特定提示词模拟 LLM 响应
- 模拟工具调用及其结果
- 测试代理流水线子图及其结构
- 验证数据在代理节点间的正确流向
- 为预期行为提供断言

## 配置与初始化

### 设置测试依赖项

在设置测试环境之前，请确保已添加以下依赖项：

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
// build.gradle.kts
dependencies {
   testImplementation("ai.koog:agents-test:LATEST_VERSION")
   testImplementation(kotlin("test"))
}
```
<!--- KNIT example-testing-01.kt -->

### 模拟 LLM 响应

测试的基本形式涉及模拟 LLM 响应以确保行为的确定性。您可以使用 `MockLLMBuilder` 和相关实用程序来执行此操作。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.testing.tools.getMockExecutor
    val toolRegistry = ToolRegistry {}
    -->
    ```kotlin
    // 创建模拟 LLM 执行器
    val mockLLMApi = getMockExecutor {
      // 模拟简单的文本响应
      mockLLMAnswer("Hello!") onRequestContains "Hello"

      // 模拟默认响应
      mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
    }
    ```
    <!--- KNIT example-testing-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.testing.tools.MockExecutor;
    import ai.koog.prompt.executor.model.PromptExecutor;

    // 创建工具库（空）
    ToolRegistry toolRegistry = ToolRegistry.builder().build();

    // 创建模拟 LLM 执行器
    PromptExecutor mockLLMApi = MockExecutor.builder()
        .toolRegistry(toolRegistry)
        .mockLLMAnswer("Hello!").onRequestContains("Hello")
        .mockLLMAnswer("I don't know how to answer that.").asDefaultResponse()
        .build();
    ```
    <!--- KNIT example-testing-java-01.java -->

### 模拟工具调用

您可以根据输入模式模拟 LLM 调用特定的工具：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.ext.tool.SayToUser
    import ai.koog.agents.testing.tools.getMockExecutor
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    public object CreateTool : Tool<CreateTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * 代表 [AskUser] 工具的实参
        *
        * @property message 用作工具执行实参的消息。
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("来自代理的消息")
            val message: String
        )
        override suspend fun execute(args: Args): String = args.message
    }
    public object SearchTool : Tool<SearchTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * 代表 [AskUser] 工具的实参
        *
        * @property message 用作工具执行实参的消息。
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("来自代理的消息")
            val query: String
        )
        override suspend fun execute(args: Args): String = args.query
    }
    public object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * 代表 [AskUser] 工具的实参
        *
        * @property message 用作工具执行实参的消息。
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("来自代理的消息")
            val query: String
        )
        override suspend fun execute(args: Args): String = args.query
    }
    typealias PositiveToneTool = SayToUser
    typealias NegativeToneTool = SayToUser
    val mockLLMApi = getMockExecutor {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // 模拟工具调用响应
    mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

    // 模拟工具行为 - 不带 lambda 的最简形式
    mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

    // 需要执行额外操作时使用 lambda
    mockTool(NegativeToneTool) alwaysTells {
      // 执行一些额外操作
      println("Negative tone tool called")

      // 返回结果
      "The text has a negative tone."
    }

    // 根据特定实参模拟工具行为
    mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

    // 使用条件实参匹配模拟工具行为
    mockTool(SearchTool) returns "Found results" onArgumentsMatching { args ->
      args.query.contains("important")
    }
    ```
    <!--- KNIT example-testing-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-02.java -->

上面的示例演示了模拟工具的不同方式，从简单到复杂：

1. `alwaysReturns`：最简单的形式，直接返回一个值而不使用 lambda。
2. `alwaysTells`：当您需要执行额外操作时使用 lambda。
3. `returns...onArguments`：为精确匹配的实参返回特定结果。
4. `returns...onArgumentsMatching`：根据自定义实参条件返回结果。

### 启用测试模式

要在代理上启用测试模式，请在 AIAgent 构造函数块中使用 `withTesting()` 函数：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.withTesting
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    val llmModel = OpenAIModels.Chat.GPT4o
    // 创建启用了测试模式的代理
    fun main() {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // 创建启用了测试模式的代理
    AIAgent(
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        // 启用测试模式
        withTesting()
    }
    ```
    <!--- KNIT example-testing-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-03.java -->

## 高级测试

### 测试图结构

在测试详细的节点行为和边连接之前，验证代理图的整体结构非常重要。这包括检查所有必需的节点是否存在，并已在预期的子图中正确连接。

测试功能提供了一种全面的方式来测试代理的图结构。对于具有多个子图和互连节点的复杂代理，这种方法特别有价值。

#### 基础结构测试

从验证代理图的基础结构开始：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    AIAgent(
        // 构造函数实参
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            val firstSubgraph = assertSubgraphByName<String, String>("first")
            val secondSubgraph = assertSubgraphByName<String, String>("second")

            // 断言子图连接
            assertEdges {
                startNode() alwaysGoesTo firstSubgraph
                firstSubgraph alwaysGoesTo secondSubgraph
                secondSubgraph alwaysGoesTo finishNode()
            }

            // 验证第一个子图
            verifySubgraph(firstSubgraph) {
                val start = startNode()
                val finish = finishNode()

                // 按名称断言节点
                val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")

                // 断言节点可达性
                assertReachable(start, askLLM)
                assertReachable(askLLM, callTool)
            }
        }
    }
    ```
    <!--- KNIT example-testing-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-04.java -->

### 测试节点行为

节点行为测试允许您验证代理图中的节点是否针对给定输入产生了预期输出。
这对于确保代理逻辑在不同场景下正常运行至关重要。

#### 基础节点测试

从对单个节点进行简单的输入和输出验证开始：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting03.CreateTool
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {

        // 测试基础文本响应
        askLLM withInput "Hello" outputs assistantMessage("Hello!")

        // 测试工具调用响应
        askLLM withInput "Solve task" outputs assistantMessage(CreateTool, CreateTool.Args("solve"))
    }
    ```
    <!--- KNIT example-testing-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-05.java -->

上面的示例演示了如何测试以下行为：
1. 当 LLM 节点接收到 `Hello` 作为输入时，它以简单的文本消息作为响应。
2. 当接收到 `Solve task` 时，它以工具调用作为响应。

#### 测试工具运行节点

您还可以测试运行工具的节点：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    object SolveTool : SimpleTool<SolveTool.Args>(
        argsType = typeToken<Args>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("来自代理的消息")
            val message: String
        )
        override suspend fun execute(args: Args): String {
            return args.message
        }
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 使用特定实参测试工具运行
        callTool withInput ToolCalls(listOf(toolCallMessagePart(
            SolveTool,
            SolveTool.Args("solve")
        ))) outputs ReceivedToolResults(listOf(toolResult(SolveTool, SolveTool.Args("solve"), "solved")))
    }
    ```
    <!--- KNIT example-testing-07.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-06.java -->

这验证了当工具执行节点收到特定的工具调用签名时，它会产生预期的工具结果。

#### 高级节点测试

对于更复杂的场景，您可以测试具有结构化输入和输出的节点：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("来自代理的消息")
            val query: String,
            val depth: Int
        )
        override suspend fun execute(args: Args): String = args.query
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 测试同一节点的不同输入
        askLLM withInput "Simple query" outputs assistantMessage("Simple response")

        // 测试复杂参数
        askLLM withInput "Complex query with parameters" outputs assistantMessage(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3)
        )
    }
    ```
    <!--- KNIT example-testing-08.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-07.java -->

您还可以测试具有详细结果结构的复杂工具调用场景：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    object AnalyzeTool : Tool<AnalyzeTool.Args, AnalyzeTool.Result>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Result>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            val query: String,
            val depth: Int
        )
        @Serializable
        data class Result(
            val analysis: String,
            val confidence: Double,
            val metadata: Map<String, String> = mapOf()
        )
        override suspend fun execute(args: Args): Result {
            return Result(
                args.query, 0.95,
                mapOf("source" to "mock", "timestamp" to "2023-06-15")
            )
        }
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 测试带结构化结果的复杂工具调用
        callTool withInput ToolCalls(listOf(toolCallMessagePart(
            AnalyzeTool,
            AnalyzeTool.Args(query = "complex", depth = 5)
        ))) outputs ReceivedToolResults(listOf(toolResult(AnalyzeTool, AnalyzeTool.Args(query = "complex", depth = 5), AnalyzeTool.Result(
            analysis = "Detailed analysis",
            confidence = 0.95,
            metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
        ))))
    }
    ```
    <!--- KNIT example-testing-09.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-08.java -->

这些高级测试有助于确保您的节点能够正确处理复杂的数据结构，这对于精密的代理行为至关重要。

### 测试边连接

边连接测试允许您验证代理图是否正确地将一个节点的输出路由到适当的下一个节点。这可以确保您的代理根据不同的输出遵循预期的工作流路径。

#### 基础边测试

从简单的边连接测试开始：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting03.CreateTool
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import kotlinx.serialization.KSerializer
    import kotlinx.serialization.Serializable
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val giveFeedback = assertNodeByName<String, Message.Assistant>("giveFeedback")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 测试文本消息路由
        askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

        // 测试工具调用路由
        askLLM withOutput assistantMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
    }
    ```
    <!--- KNIT example-testing-10.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-09.java -->

此示例验证了以下行为：
1. 当 LLM 节点输出简单的文本消息时，流程将定向到 `giveFeedback` 节点。
2. 当它输出工具调用时，流程将定向到 `callTool` 节点。

#### 测试条件路由

您可以根据输出内容测试更复杂的路由逻辑：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val askForInfo = assertNodeByName<String, ReceivedToolResult>("askForInfo")
                    val processRequest = assertNodeByName<String, Message.Assistant>("processRequest")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 不同的文本响应可以路由到不同的节点
        askLLM withOutput assistantMessage("Need more information") goesTo askForInfo
        askLLM withOutput assistantMessage("Ready to proceed") goesTo processRequest
    }
    ```
    <!--- KNIT example-testing-11.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-10.java -->

#### 高级边测试

对于复杂的代理，您可以根据工具结果中的结构化数据测试条件路由：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting09.AnalyzeTool
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val processResult = assertNodeByName<String, Message.Assistant>("processResult")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 根据工具结果内容测试路由
        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
        ))) goesTo processResult
    }
    ```
    <!--- KNIT example-testing-12.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-11.java -->

您还可以基于不同的结果属性测试复杂的决策路径：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting09.AnalyzeTool
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val finish = assertNodeByName<String, Message.Assistant>("finish")
                    val verifyResult = assertNodeByName<String, Message.Assistant>("verifyResult")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 根据置信度级别路由到不同的节点
        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Complete", confidence = 0.9)
        ))) goesTo finish

        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Uncertain", confidence = 0.3)
        ))) goesTo verifyResult
    }
    ```
    <!--- KNIT example-testing-13.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-12.java -->

这些高级边测试有助于确保您的代理根据节点输出的内容和结构做出正确的决策，这对于创建智能且具有上下文感知能力的工作流至关重要。

## 完整测试示例

这是一个展示完整测试场景的用户情景：

您正在开发一个音调分析代理，用于分析文本的音调并提供反馈。该代理使用工具来检测正面、负面和中性的音调。

以下是测试此代理的方法：

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    @Test
    fun testToneAgent() = runTest {
        // 创建一个列表来跟踪工具调用
        var toolCalls = mutableListOf<String>()
        var result: String? = null

        // 创建工具库
        val toolRegistry = ToolRegistry {
            // 一个特殊的工具，此类代理所必需
            tool(SayToUser)

            with(ToneTools) {
                tools()
            }
        }

        // 创建事件处理程序
        val eventHandler = EventHandler {
            onToolCallStarting { tool, args ->
                println("[DEBUG_LOG] Tool called: tool ${tool.name}, args $args")
                toolCalls.add(tool.name)
            }

            handleError {
                println("[DEBUG_LOG] An error occurred: ${it.message}
${it.stackTraceToString()}")
                true
            }

            handleResult {
                println("[DEBUG_LOG] Result: $it")
                result = it
            }
        }

        val positiveText = "I love this product!"
        val negativeText = "Awful service, hate the app."
        val defaultText = "I don't know how to answer this question."

        val positiveResponse = "The text has a positive tone."
        val negativeResponse = "The text has a negative tone."
        val neutralResponse = "The text has a neutral tone."

        val mockLLMApi = getMockExecutor(toolRegistry, eventHandler) {
            // 为不同的输入文本设置 LLM 响应
            mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
            mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
            mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

            // 模拟 LLM 在工具返回结果时仅以工具响应作为响应的行为
            mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
            mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
            mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

            mockLLMAnswer(defaultText).asDefaultResponse

            // 工具模拟 (Mock)
            mockTool(PositiveToneTool) alwaysTells {
                toolCalls += "Positive tone tool called"
                positiveResponse
            }
            mockTool(NegativeToneTool) alwaysTells {
                toolCalls += "Negative tone tool called"
                negativeResponse
            }
            mockTool(NeutralToneTool) alwaysTells {
                toolCalls += "Neutral tone tool called"
                neutralResponse
            }
        }

        // 创建策略
        val strategy = toneStrategy("tone_analysis")

        // 创建代理配置
        val agentConfig = AIAgentConfig(
            prompt = prompt("test-agent") {
                system(
                    """
                    You are an question answering agent with access to the tone analysis tools.
                    You need to answer 1 question with the best of your ability.
                    Be as concise as possible in your answers.
                    DO NOT ANSWER ANY QUESTIONS THAT ARE BESIDES PERFORMING TONE ANALYSIS!
                    DO NOT HALLUCINATE!
                """.trimIndent()
                )
            },
            model = mockk<LLModel>(relaxed = true),
            maxAgentIterations = 10
        )

        // 创建启用了测试模式的代理
        val agent = AIAgent(
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            strategy = strategy,
            eventHandler = eventHandler,
            agentConfig = agentConfig,
        ) {
            withTesting()
        }

        // 测试正面文本
        agent.run(positiveText)
        assertEquals("The text has a positive tone.", result, "Positive tone result should match")
        assertEquals(1, toolCalls.size, "One tool is expected to be called")

        // 测试负面文本
        agent.run(negativeText)
        assertEquals("The text has a negative tone.", result, "Negative tone result should match")
        assertEquals(2, toolCalls.size, "Two tools are expected to be called")

        // 测试中性文本
        agent.run(defaultText)
        assertEquals("The text has a neutral tone.", result, "Neutral tone result should match")
        assertEquals(3, toolCalls.size, "Three tools are expected to be called")
    }
    ```
    <!--- KNIT example-testing-14.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-13.java -->

对于具有多个子图的更复杂的代理，您还可以测试图结构：

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    @Test
    fun testMultiSubgraphAgentStructure() = runTest {
        val strategy = strategy("test") {
            val firstSubgraph by subgraph(
                "first",
                tools = listOf(DummyTool, CreateTool, SolveTool)
            ) {
                val callLLM by nodeLLMRequest(allowToolCalls = false)
                val executeTool by nodeExecuteTools()
                val sendToolResult by nodeLLMSendToolResults()
                val giveFeedback by node<String, String> { input ->
                    llm.writeSession {
                        appendPrompt {
                            user("Call tools! Don't chat!")
                        }
                    }
                    input
                }

                edge(nodeStart forwardTo callLLM)
                edge(callLLM forwardTo executeTool onToolCalls { true })
                edge(callLLM forwardTo giveFeedback onTextMessage { true })
                edge(giveFeedback forwardTo giveFeedback transformed { it })
                edge(executeTool forwardTo nodeFinish transformed { it.toolResults.first().output })
            }

            val secondSubgraph by subgraph<String, String>("second") {
                edge(nodeStart forwardTo nodeFinish)
            }

            edge(nodeStart forwardTo firstSubgraph)
            edge(firstSubgraph forwardTo secondSubgraph)
            edge(secondSubgraph forwardTo nodeFinish)
        }

        val toolRegistry = ToolRegistry {
            tool(DummyTool)
            tool(CreateTool)
            tool(SolveTool)
        }

        val mockLLMApi = getMockExecutor(toolRegistry) {
            mockLLMAnswer("Hello!") onRequestContains "Hello"
            mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"
        }

        val basePrompt = prompt("test") {}

        AIAgent(
            toolRegistry = toolRegistry,
            strategy = strategy,
            eventHandler = EventHandler {},
            agentConfig = AIAgentConfig(prompt = basePrompt, model = OpenAIModels.Chat.GPT4o, maxAgentIterations = 100),
            promptExecutor = mockLLMApi,
        ) {
            testGraph("test") {
                val firstSubgraph = assertSubgraphByName<String, String>("first")
                val secondSubgraph = assertSubgraphByName<String, String>("second")

                assertEdges {
                    startNode() alwaysGoesTo firstSubgraph
                    firstSubgraph alwaysGoesTo secondSubgraph
                    secondSubgraph alwaysGoesTo finishNode()
                }

                verifySubgraph(firstSubgraph) {
                    val start = startNode()
                    val finish = finishNode()

                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val giveFeedback = assertNodeByName<Any?, Any?>("giveFeedback")

                    assertReachable(start, askLLM)
                    assertReachable(askLLM, callTool)

                    assertNodes {
                        askLLM withInput "Hello" outputs assistantMessage("Hello!")
                        askLLM withInput "Solve task" outputs assistantMessage(CreateTool, CreateTool.Args("solve"))

                        callTool withInput ToolCalls(listOf(toolCallMessagePart(
                            SolveTool,
                            SolveTool.Args("solve")
                        ))) outputs ReceivedToolResults(listOf(toolResult(SolveTool, SolveTool.Args("solve"), "solved")))

                        callTool withInput ToolCalls(listOf(toolCallMessagePart(
                            CreateTool,
                            CreateTool.Args("solve")
                        ))) outputs ReceivedToolResults(listOf(toolResult(CreateTool, CreateTool.Args("solve"), "created")))
                    }

                    assertEdges {
                        askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback
                        askLLM withOutput assistantMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
                    }
                }
            }
        }
    }
    ```
    <!--- KNIT example-testing-15.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-14.java -->

## API 参考

有关与测试功能相关的完整 API 参考，请参阅 [agents-test](api:agents-test::) 模块的参考文档。

## 常见问题解答与故障排除

#### 如何模拟特定的工具响应？

使用 `MockLLMBuilder` 中的 `mockTool` 方法：

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    val mockExecutor = getMockExecutor {
        mockTool(myTool) alwaysReturns myResult

        // 或带有条件
        mockTool(myTool) returns myResult onArguments myArgs
    }
    ```
    <!--- KNIT example-testing-16.kt -->

=== "Java"

    <!--- INCLUDE
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-15.java -->

#### 如何测试复杂的图结构？

使用子图断言、`verifySubgraph` 和节点引用：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 构造函数实参
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    testGraph<Unit, String>("test") {
        val mySubgraph = assertSubgraphByName<Unit, String>("mySubgraph")

        verifySubgraph(mySubgraph) {
            // 获取节点引用
            val nodeA = assertNodeByName<Unit, String>("nodeA")
            val nodeB = assertNodeByName<String, String>("nodeB")

            // 断言可达性
            assertReachable(nodeA, nodeB)

            // 断言边连接
            assertEdges {
                nodeA.withOutput("result") goesTo nodeB
            }
        }
    }
    ```
    <!--- KNIT example-testing-17.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-16.java -->

#### 如何根据输入模拟不同的 LLM 响应？

使用模式匹配方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.testing.tools.getMockExecutor
    val promptExecutor = 
    -->
    ```kotlin
    getMockExecutor {
        mockLLMAnswer("Response A") onRequestContains "topic A"
        mockLLMAnswer("Response B") onRequestContains "topic B"
        mockLLMAnswer("Exact response") onRequestEquals "exact question"
        mockLLMAnswer("Conditional response") onCondition { it.contains("keyword") && it.length > 10 }
    }
    ```
    <!--- KNIT example-testing-18.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.testing.tools.MockExecutor;
    import ai.koog.prompt.executor.model.PromptExecutor;

    PromptExecutor promptExecutor = MockExecutor.builder()
        .mockLLMAnswer("Response A").onRequestContains("topic A")
        .mockLLMAnswer("Response B").onRequestContains("topic B")
        .mockLLMAnswer("Exact response").onRequestEquals("exact question")
        .mockLLMAnswer("Conditional response").onCondition(s -> s.contains("keyword") && s.length() > 10)
        .build();
    ```
    <!--- KNIT example-testing-java-17.java -->

### 故障排除

#### 模拟执行器总是返回默认响应

检查您的模式匹配是否正确。模式区分大小写，且必须与指定的完全匹配。

#### 工具调用未被拦截

确保：

1. 工具库已正确设置。
2. 工具名称完全匹配。
3. 工具操作配置正确。

#### 图断言失败

1. 验证节点名称是否正确。
2. 检查图结构是否符合您的预期。
3. 使用 `startNode()` 和 `finishNode()` 方法获取正确的入口点和出口点。