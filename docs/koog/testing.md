# 测试

## 概述

测试特性为 Koog 框架中的 AI 智能体流水线、子图和工具交互提供了全面的框架。它使开发者能够创建受控的测试环境，其中包含模拟的 LLM (大型语言模型) 执行器、工具注册表和智能体环境。

### 目的

此特性的主要目的是通过以下方式促进基于智能体的 AI 特性的测试：

- 模拟 LLM 对特定提示的响应
- 模拟工具调用及其结果
- 测试智能体流水线子图及其结构
- 验证数据在智能体节点中的正确流向
- 为预期行为提供断言

## 配置与初始化

### 设置测试依赖项

在设置测试环境之前，请确保已添加以下依赖项：
   ```kotlin
   // build.gradle.kts
   dependencies {
       testImplementation("ai.koog:agents-test:LATEST_VERSION")
       testImplementation(kotlin("test"))
   }
   ```

### 模拟 LLM 响应

基本的测试形式涉及模拟 LLM 响应以确保确定性行为。您可以使用 `MockLLMBuilder` 和相关实用工具来完成此操作。

```kotlin
// Create a mock LLM executor
val mockLLMApi = getMockExecutor(toolRegistry, eventHandler) {
  // Mock a simple text response
  mockLLMAnswer("Hello!") onRequestContains "Hello"

  // Mock a default response
  mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
}
```

### 模拟工具调用

您可以模拟 LLM 根据输入模式调用特定工具：

```kotlin
// Mock a tool call response
mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

// Mock tool behavior - simplest form without lambda
mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

// Using lambda when you need to perform extra actions
mockTool(NegativeToneTool) alwaysTells {
  // Perform some extra action
  println("Negative tone tool called")

  // Return the result
  "The text has a negative tone."
}

// Mock tool behavior based on specific arguments
mockTool(AnalyzeTool) returns AnalyzeTool.Result("Detailed analysis") onArguments AnalyzeTool.Args("analyze deeply")

// Mock tool behavior with conditional argument matching
mockTool(SearchTool) returns SearchTool.Result("Found results") onArgumentsMatching { args ->
  args.query.contains("important")
}
```

上述示例演示了模拟工具的不同方式，从简单到复杂：

1. `alwaysReturns`: 最简单的形式，直接返回一个值，不带 lambda 表达式。
2. `alwaysTells`: 当您需要执行额外操作时使用 lambda 表达式。
3. `returns...onArguments`: 对精确的实参匹配返回特定结果。
4. `returns...onArgumentsMatching`: 根据自定义实参条件返回结果。

### 启用测试模式

要在智能体上启用测试模式，请在 `AIAgent` 构造函数代码块中使用 `withTesting()` 函数：

```kotlin
// Create the agent with testing enabled
AIAgent(
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    strategy = strategy,
    eventHandler = eventHandler,
    agentConfig = agentConfig,
) {
    // Enable testing mode
    withTesting()
}
```

## 高级测试

### 测试图结构

在测试详细的节点行为和边连接之前，验证智能体图的整体结构非常重要。这包括检查所有所需节点是否存在并已在预期子图中正确连接。

测试特性提供了一种全面的方式来测试智能体的图结构。这种方法对于具有多个子图和相互连接节点的复杂智能体特别有价值。

#### 基本结构测试

首先验证智能体图的基本结构：

```kotlin
AIAgent(
    // Constructor arguments
    toolRegistry = toolRegistry,
    strategy = strategy,
    eventHandler = eventHandler,
    agentConfig = agentConfig,
    promptExecutor = mockLLMApi,
) {
    testGraph("test") {
        val firstSubgraph = assertSubgraphByName<String, String>("first")
        val secondSubgraph = assertSubgraphByName<String, String>("second")

        // Assert subgraph connections
        assertEdges {
            startNode() alwaysGoesTo firstSubgraph
            firstSubgraph alwaysGoesTo secondSubgraph
            secondSubgraph alwaysGoesTo finishNode()
        }

        // Verify the first subgraph
        verifySubgraph(firstSubgraph) {
            val start = startNode()
            val finish = finishNode()

            // Assert nodes by name
            val askLLM = assertNodeByName<String, Message.Response>("callLLM")
            val callTool = assertNodeByName<ToolCall.Signature, ToolCall.Result>("executeTool")

            // Assert node reachability
            assertReachable(start, askLLM)
            assertReachable(askLLM, callTool)
        }
    }
}
```

### 测试节点行为

节点行为测试让您能够验证智能体图中的节点是否对给定输入产生预期输出。这对于确保智能体逻辑在不同场景下正常工作至关重要。

#### 基本节点测试

从单个节点的简单输入和输出验证开始：

```kotlin
assertNodes {
    // Test basic text responses
    askLLM withInput "Hello" outputs Message.Assistant("Hello!")

    // Test tool call responses
    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))
}
```

上面的示例展示了如何测试以下行为：
1. 当 LLM 节点接收到 `Hello` 作为输入时，它会回复一条简单的文本消息。
2. 当它接收到 `Solve task` 时，它会回复一个工具调用。

#### 测试工具运行节点

您还可以测试运行工具的节点：

```kotlin
assertNodes {
    // Test tool runs with specific arguments
    callTool withInput toolCallSignature(
        SolveTool,
        SolveTool.Args("solve")
    ) outputs toolResult(SolveTool, "solved")
}
```

这验证了当工具执行节点接收到特定的工具调用签名时，它会产生预期的工具结果。

#### 高级节点测试

对于更复杂的场景，您可以测试带有结构化输入和输出的节点：

```kotlin
assertNodes {
    // Test with different inputs to the same node
    askLLM withInput "Simple query" outputs Message.Assistant("Simple response")

    // Test with complex parameters
    askLLM withInput "Complex query with parameters" outputs toolCallMessage(
        AnalyzeTool, 
        AnalyzeTool.Args(query = "parameters", depth = 3)
    )
}
```

您还可以测试具有详细结果结构的复杂工具调用场景：

```kotlin
assertNodes {
    // Test a complex tool call with a structured result
    callTool withInput toolCallSignature(
        AnalyzeTool,
        AnalyzeTool.Args(query = "complex", depth = 5)
    ) outputs toolResult(AnalyzeTool, AnalyzeTool.Result(
        analysis = "Detailed analysis",
        confidence = 0.95,
        metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
    ))
}
```

这些高级测试有助于确保您的节点正确处理复杂数据结构，这对于复杂的智能体行为至关重要。

### 测试边连接

边连接测试让您能够验证智能体的图是否正确地将一个节点的输出路由到适当的下一个节点。这确保了您的智能体根据不同的输出遵循预期的工作流路径。

#### 基本边测试

从简单的边连接测试开始：

```kotlin
assertEdges {
    // Test text message routing
    askLLM withOutput Message.Assistant("Hello!") goesTo giveFeedback

    // Test tool call routing
    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
}
```

此示例验证了以下行为：
1. 当 LLM 节点输出简单文本消息时，流会定向到 `giveFeedback` 节点。
2. 当它输出工具调用时，流会定向到 `callTool` 节点。

#### 测试条件路由

您可以根据输出内容测试更复杂的路由逻辑：

```kotlin
assertEdges {
    // Different text responses can route to different nodes
    askLLM withOutput Message.Assistant("Need more information") goesTo askForInfo
    askLLM withOutput Message.Assistant("Ready to proceed") goesTo processRequest
}
```

#### 高级边测试

对于复杂的智能体，您可以根据工具结果中的结构化数据测试条件路由：

```kotlin
assertEdges {
    // Test routing based on tool result content
    callTool withOutput toolResult(
        AnalyzeTool, 
        AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
    ) goesTo processResult
}
```

您还可以根据不同的结果属性测试复杂的决策路径：

```kotlin
assertEdges {
    // Route to different nodes based on confidence level
    callTool withOutput toolResult(
        AnalyzeTool, 
        AnalyzeTool.Result(analysis = "Complete", confidence = 0.9)
    ) goesTo finish

    callTool withOutput toolResult(
        AnalyzeTool, 
        AnalyzeTool.Result(analysis = "Uncertain", confidence = 0.3)
    ) goesTo verifyResult
}
```

这些高级边测试有助于确保您的智能体根据节点输出的内容和结构做出正确决策，这对于创建智能的、上下文感知的工作流至关重要。

## 完整测试示例

这是一个演示完整测试场景的用户故事：

您正在开发一个语气分析智能体，用于分析文本的语气并提供反馈。该智能体使用工具来检测积极、消极和中性语气。

您可以按以下方式测试此智能体：

```kotlin
@Test
fun testToneAgent() = runTest {
    // Create a list to track tool calls
    var toolCalls = mutableListOf<String>()
    var result: String? = null

    // Create a tool registry
    val toolRegistry = ToolRegistry {
        // A special tool, required with this type of agent
        tool(SayToUser)

        with(ToneTools) {
            tools()
        }
    }

    // Create an event handler
    val eventHandler = EventHandler {
        onToolCall { tool, args ->
            println("[DEBUG_LOG] Tool called: tool ${tool.name}, args ${args}")
            toolCalls.add(tool.name)
        }

        handleError {
            println("[DEBUG_LOG] An error occurred: ${it.message}
${it.stackTraceToString()}")
            true
        }

        handleResult {
            println("[DEBUG_LOG] Result: ${it}")
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
        // Set up LLM responses for different input texts
        mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
        mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
        mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

        // Mock the behavior where the LLM responds with just tool responses when the tools return results
        mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
        mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
        mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

        mockLLMAnswer(defaultText).asDefaultResponse

        // Tool mocks
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

    // Create a strategy
    val strategy = toneStrategy("tone_analysis")

    // Create an agent configuration
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

    // Create an agent with testing enabled
    val agent = AIAgent(
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        strategy = strategy,
        eventHandler = eventHandler,
        agentConfig = agentConfig,
    ) {
        withTesting()
    }

    // Test the positive text
    agent.run(positiveText)
    assertEquals("The text has a positive tone.", result, "Positive tone result should match")
    assertEquals(1, toolCalls.size, "One tool is expected to be called")

    // Test the negative text
    agent.run(negativeText)
    assertEquals("The text has a negative tone.", result, "Negative tone result should match")
    assertEquals(2, toolCalls.size, "Two tools are expected to be called")

    //Test the neutral text
    agent.run(defaultText)
    assertEquals("The text has a neutral tone.", result, "Neutral tone result should match")
    assertEquals(3, toolCalls.size, "Three tools are expected to be called")
}
```

对于具有多个子图的更复杂智能体，您还可以测试图结构：

```kotlin
@Test
fun testMultiSubgraphAgentStructure() = runTest {
    val strategy = strategy("test") {
        val firstSubgraph by subgraph(
            "first",
            tools = listOf(DummyTool, CreateTool, SolveTool)
        ) {
            val callLLM by nodeLLMRequest(allowToolCalls = false)
            val executeTool by nodeExecuteTool()
            val sendToolResult by nodeLLMSendToolResult()
            val giveFeedback by node<String, String> { input ->
                llm.writeSession {
                    updatePrompt {
                        user("Call tools! Don't chat!")
                    }
                }
                input
            }

            edge(nodeStart forwardTo callLLM)
            edge(callLLM forwardTo executeTool onToolCall { true })
            edge(callLLM forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo executeTool onToolCall { true })
            edge(executeTool forwardTo nodeFinish transformed { it.content })
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

                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val giveFeedback = assertNodeByName<Any?, Any?>("giveFeedback")

                assertReachable(start, askLLM)
                assertReachable(askLLM, callTool)

                assertNodes {
                    askLLM withInput "Hello" outputs Message.Assistant("Hello!")
                    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))

                    callTool withInput toolCallSignature(
                        SolveTool,
                        SolveTool.Args("solve")
                    ) outputs toolResult(SolveTool, "solved")

                    callTool withInput toolCallSignature(
                        CreateTool,
                        CreateTool.Args("solve")
                    ) outputs toolResult(CreateTool, "created")
                }

                assertEdges {
                    askLLM withOutput Message.Assistant("Hello!") goesTo giveFeedback
                    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
                }
            }
        }
    }
}
```

## API 参考

有关测试特性的完整 API 参考，请参阅 [agents-test](https://api.koog.ai/agents/agents-test/index.html) 模块的参考文档。

## 常见问题与故障排除

#### 如何模拟特定的工具响应？

在 `MockLLMBuilder` 中使用 `mockTool` 方法：

```kotlin
val mockExecutor = getMockExecutor {
    mockTool(myTool) alwaysReturns myResult

    // Or with conditions
    mockTool(myTool) returns myResult onArguments myArgs
}
```

#### 如何测试复杂的图结构？

使用子图断言、`verifySubgraph` 和节点引用：

```kotlin
testGraph("test") {
    val mySubgraph = assertSubgraphByName<Unit, String>("mySubgraph")

    verifySubgraph(mySubgraph) {
        // Get references to nodes
        val nodeA = assertNodeByName("nodeA")
        val nodeB = assertNodeByName("nodeB")

        // Assert reachability
        assertReachable(nodeA, nodeB)

        // Assert edge connections
        assertEdges {
            nodeA.withOutput("result") goesTo nodeB
        }
    }
}
```

#### 如何根据输入模拟不同的 LLM 响应？

使用模式匹配方法：

```kotlin
getMockExecutor {
    mockLLMAnswer("Response A") onRequestContains "topic A"
    mockLLMAnswer("Response B") onRequestContains "topic B"
    mockLLMAnswer("Exact response") onRequestEquals "exact question"
    mockLLMAnswer("Conditional response") onCondition { it.contains("keyword") && it.length > 10 }
}
```

### 故障排除

#### 模拟执行器总是返回默认响应

检查您的模式匹配是否正确。模式区分大小写，并且必须与指定内容完全匹配。

#### 工具调用未被拦截

请确保：

1. 工具注册表已正确设置。
2. 工具名称完全匹配。
3. 工具动作已正确配置。

#### 图断言失败

1. 验证节点名称是否正确。
2. 检查图结构是否符合您的预期。
3. 使用 `startNode()` 和 `finishNode()` 方法获取正确的入口和出口点。