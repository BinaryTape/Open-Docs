# 테스트

## 개요

테스트 기능은 Koog 프레임워크에서 AI 에이전트 파이프라인, 서브그래프, 도구 상호작용을 테스트하기 위한 포괄적인 프레임워크를 제공합니다. 이를 통해 개발자는 모의 LLM(거대 언어 모델) 실행기, 도구 레지스트리, 에이전트 환경을 갖춘 제어된 테스트 환경을 구축할 수 있습니다.

### 목적

이 기능의 주요 목적은 다음을 통해 에이전트 기반 AI 기능의 테스트를 용이하게 하는 것입니다:

- 특정 프롬프트에 대한 LLM 응답 모의
- 도구 호출 및 그 결과 시뮬레이션
- 에이전트 파이프라인 서브그래프 및 그 구조 테스트
- 에이전트 노드를 통한 데이터의 올바른 흐름 검증
- 예상되는 동작에 대한 어설션 제공

## 구성 및 초기화

### 테스트 종속성 설정

테스트 환경을 설정하기 전에 다음 종속성을 추가했는지 확인하십시오:
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
### LLM 응답 모의

테스트의 기본 형태는 결정론적 동작을 보장하기 위해 LLM 응답을 모의하는 것입니다. 이는 `MockLLMBuilder` 및 관련 유틸리티를 사용하여 수행할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.testing.tools.getMockExecutor
import ai.koog.agents.testing.tools.mockLLMAnswer

val toolRegistry = ToolRegistry {}

-->
```kotlin
// Create a mock LLM executor
val mockLLMApi = getMockExecutor(toolRegistry) {
  // Mock a simple text response
  mockLLMAnswer("Hello!") onRequestContains "Hello"

  // Mock a default response
  mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
}
```
<!--- KNIT example-testing-02.kt -->

### 도구 호출 모의

입력 패턴에 따라 LLM이 특정 도구를 호출하도록 모의할 수 있습니다:
<!--- INCLUDE
import ai.koog.agents.core.tools.*
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.testing.tools.getMockExecutor
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

public object CreateTool : Tool<CreateTool.Args, String>() {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val message: String
    )

    override val argsSerializer: KSerializer<Args> = Args.serializer()
    override val resultSerializer: KSerializer<String> = String.serializer()

    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

    override suspend fun execute(args: Args): String = args.message
}

public object SearchTool : Tool<SearchTool.Args, String>() {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String
    )

    override val argsSerializer: KSerializer<Args> = Args.serializer()
    override val resultSerializer: KSerializer<String> = String.serializer()

    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

    override suspend fun execute(args: Args): String = args.query
}

public object AnalyzeTool : Tool<AnalyzeTool.Args, String>() {
    /**
    * Represents the arguments for the [AskUser] tool
    *
    * @property message The message to be used as an argument for the tool's execution.
    */
    @Serializable
    public data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String
    )

    override val argsSerializer: KSerializer<Args> = Args.serializer()
    override val resultSerializer: KSerializer<String> = String.serializer()

    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

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
mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

// Mock tool behavior with conditional argument matching
mockTool(SearchTool) returns "Found results" onArgumentsMatching { args ->
  args.query.contains("important")
}
```
<!--- KNIT example-testing-03.kt -->

위 예시는 도구를 모의하는 다양한 방법을 간단한 것부터 복잡한 것까지 보여줍니다:

1.  `alwaysReturns`: 가장 간단한 형태로, 람다 없이 직접 값을 반환합니다.
2.  `alwaysTells`: 추가 작업을 수행해야 할 때 람다를 사용합니다.
3.  `returns...onArguments`: 정확한 인수 일치에 대해 특정 결과를 반환합니다.
4.  `returns...onArgumentsMatching`: 사용자 지정 인수 조건에 따라 결과를 반환합니다.

### 테스트 모드 활성화

에이전트에서 테스트 모드를 활성화하려면 `AIAgent` 생성자 블록 내에서 `withTesting()` 함수를 사용하세요:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.withTesting
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

// Create the agent with testing enabled
fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// Create the agent with testing enabled
AIAgent(
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    llmModel = llmModel
) {
    // Enable testing mode
    withTesting()
}
```
<!--- KNIT example-testing-04.kt -->

## 고급 테스트

### 그래프 구조 테스트

상세한 노드 동작 및 엣지 연결을 테스트하기 전에, 에이전트 그래프의 전체 구조를 검증하는 것이 중요합니다. 여기에는 필요한 모든 노드가 존재하고 예상되는 서브그래프에 올바르게 연결되어 있는지 확인하는 것이 포함됩니다.

테스트 기능은 에이전트의 그래프 구조를 테스트하는 포괄적인 방법을 제공합니다. 이 접근 방식은 여러 서브그래프와 상호 연결된 노드를 가진 복잡한 에이전트에 특히 유용합니다.

#### 기본 구조 테스트

에이전트 그래프의 기본적인 구조를 검증하는 것부터 시작하십시오:

<!--- INCLUDE

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolResult
import ai.koog.agents.example.exampleCustomNodes11.ToolArgs
import ai.koog.agents.example.exampleTesting02.mockLLMApi
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
    // Constructor arguments
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    llmModel = llmModel
) {
    testGraph<String, String>("test") {
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
            val callTool = assertNodeByName<ToolArgs, ToolResult>("executeTool")

            // Assert node reachability
            assertReachable(start, askLLM)
            assertReachable(askLLM, callTool)
        }
    }
}
```
<!--- KNIT example-testing-05.kt -->

### 노드 동작 테스트

노드 동작 테스트는 에이전트 그래프의 노드가 주어진 입력에 대해 예상되는 출력을 생성하는지 확인할 수 있게 합니다. 이는 에이전트의 로직이 다양한 시나리오에서 올바르게 작동하는지 확인하는 데 중요합니다.

#### 기본 노드 테스트

개별 노드에 대한 간단한 입력 및 출력 유효성 검사부터 시작하십시오:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {

    // Test basic text responses
    askLLM withInput "Hello" outputs assistantMessage("Hello!")

    // Test tool call responses
    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))
}
```
<!--- KNIT example-testing-06.kt -->

위 예시는 다음 동작을 테스트하는 방법을 보여줍니다:
1.  LLM 노드가 `Hello`를 입력으로 받으면, 간단한 텍스트 메시지로 응답합니다.
2.  `Solve task`를 받으면, 도구 호출로 응답합니다.

#### 도구 실행 노드 테스트

도구를 실행하는 노드도 테스트할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription

object SolveTool : SimpleTool<SolveTool.Args>() {
    @Serializable
    data class Args(
        @property:LLMDescription("Message from the agent")
        val message: String
    )

    override val argsSerializer: KSerializer<Args> = Args.serializer()
 
    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

    override suspend fun doExecute(args: Args): String {
        return args.message
    }
}

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // Test tool runs with specific arguments
    callTool withInput toolCallMessage(
        SolveTool,
        SolveTool.Args("solve")
    ) outputs toolResult(SolveTool, "solved")
}
```
<!--- KNIT example-testing-07.kt -->

이는 도구 실행 노드가 특정 도구 호출 서명을 받으면 예상되는 도구 결과를 생성하는지 검증합니다.

#### 고급 노드 테스트

더 복잡한 시나리오의 경우, 구조화된 입력 및 출력을 가진 노드를 테스트할 수 있습니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

object AnalyzeTool : Tool<AnalyzeTool.Args, String>() {

    @Serializable
    data class Args(
        @property:LLMDescription("Message from the agent")
        val query: String,
        val depth: Int
    )

    override val argsSerializer: KSerializer<Args> = Args.serializer()
    override val resultSerializer: KSerializer<String> = String.serializer()
 
    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

    override suspend fun execute(args: Args): String = args.query
}

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // Test with different inputs to the same node
    askLLM withInput "Simple query" outputs assistantMessage("Simple response")

    // Test with complex parameters
    askLLM withInput "Complex query with parameters" outputs toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3)
    )
}
```
<!--- KNIT example-testing-08.kt -->

상세한 결과 구조를 사용하여 복잡한 도구 호출 시나리오를 테스트할 수도 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

object AnalyzeTool : Tool<AnalyzeTool.Args, AnalyzeTool.Result>() {
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

    override val argsSerializer: KSerializer<Args> = Args.serializer()
    override val resultSerializer: KSerializer<Result> = Result.serializer()
 
    override val name = "message"
    override val description = "Service tool, used by the agent to talk with user"

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
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // Test a complex tool call with a structured result
    callTool withInput toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "complex", depth = 5)
    ) outputs toolResult(AnalyzeTool, AnalyzeTool.Result(
        analysis = "Detailed analysis",
        confidence = 0.95,
        metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
    ))
}
```
<!--- KNIT example-testing-09.kt -->

이러한 고급 테스트는 노드가 복잡한 데이터 구조를 올바르게 처리하는지 확인하는 데 도움이 되며, 이는 정교한 에이전트 동작에 필수적입니다.

### 엣지 연결 테스트

엣지 연결 테스트는 에이전트의 그래프가 한 노드에서 다른 적절한 다음 노드로 출력을 올바르게 라우팅하는지 확인할 수 있게 합니다. 이를 통해 에이전트가 다양한 출력에 따라 의도된 워크플로 경로를 따르는지 보장합니다.

#### 기본 엣지 테스트

간단한 엣지 연결 테스트부터 시작하십시오:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val giveFeedback = assertNodeByName<String, Message.Response>("giveFeedback")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // Test text message routing
    askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

    // Test tool call routing
    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
}
```
<!--- KNIT example-testing-10.kt -->

이 예시는 다음 동작을 검증합니다:
1.  LLM 노드가 간단한 텍스트 메시지를 출력하면, 흐름은 `giveFeedback` 노드로 향합니다.
2.  도구 호출을 출력하면, 흐름은 `callTool` 노드로 향합니다.

#### 조건부 라우팅 테스트

출력 내용을 기반으로 더 복잡한 라우팅 로직을 테스트할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val askForInfo = assertNodeByName<String, ReceivedToolResult>("askForInfo")
                val processRequest = assertNodeByName<String, Message.Response>("processRequest")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // Different text responses can route to different nodes
    askLLM withOutput assistantMessage("Need more information") goesTo askForInfo
    askLLM withOutput assistantMessage("Ready to proceed") goesTo processRequest
}
```
<!--- KNIT example-testing-11.kt -->

#### 고급 엣지 테스트

정교한 에이전트의 경우, 도구 결과의 구조화된 데이터를 기반으로 조건부 라우팅을 테스트할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val processResult = assertNodeByName<String, Message.Response>("processResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // Test routing based on tool result content
    callTool withOutput toolResult(
        AnalyzeTool, 
        AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
    ) goesTo processResult
}
```
<!--- KNIT example-testing-12.kt -->

또한 다양한 결과 속성을 기반으로 복잡한 결정 경로를 테스트할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val finish = assertNodeByName<String, Message.Response>("finish")
                val verifyResult = assertNodeByName<String, Message.Response>("verifyResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
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
<!--- KNIT example-testing-13.kt -->

이러한 고급 엣지 테스트는 에이전트가 노드 출력의 내용과 구조를 기반으로 올바른 결정을 내리는지 확인하는 데 도움이 되며, 이는 지능적이고 상황 인식적인 워크플로를 생성하는 데 필수적입니다.

## 전체 테스트 예시

다음은 전체 테스트 시나리오를 보여주는 사용자 스토리입니다:

텍스트의 어조를 분석하고 피드백을 제공하는 **어조 분석 에이전트**를 개발하고 있습니다. 이 에이전트는 긍정적, 부정적, 중립적 어조를 감지하는 도구를 사용합니다.

이 에이전트를 테스트하는 방법은 다음과 같습니다:

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
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
<!--- KNIT example-testing-14.kt -->

여러 서브그래프를 가진 더 복잡한 에이전트의 경우, 그래프 구조도 테스트할 수 있습니다:

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
<!--- KNIT example-testing-15.kt -->

## API 레퍼런스

테스트 기능과 관련된 전체 API 레퍼런스는 [agents-test](https://api.koog.ai/agents/agents-test/index.html) 모듈의 레퍼런스 문서를 참조하십시오.

## FAQ 및 문제 해결

#### 특정 도구 응답을 어떻게 모의할 수 있나요?

`MockLLMBuilder`의 `mockTool` 메서드를 사용하십시오:
<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val mockExecutor = getMockExecutor {
    mockTool(myTool) alwaysReturns myResult

    // Or with conditions
    mockTool(myTool) returns myResult onArguments myArgs
}
```
<!--- KNIT example-testing-16.kt -->

#### 복잡한 그래프 구조를 어떻게 테스트할 수 있나요?

서브그래프 어설션, `verifySubgraph`, 그리고 노드 레퍼런스를 사용하십시오:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {
    AIAgent(
        // Constructor arguments
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
        // Get references to nodes
        val nodeA = assertNodeByName<Unit, String>("nodeA")
        val nodeB = assertNodeByName<String, String>("nodeB")

        // Assert reachability
        assertReachable(nodeA, nodeB)

        // Assert edge connections
        assertEdges {
            nodeA.withOutput("result") goesTo nodeB
        }
    }
}
```
<!--- KNIT example-testing-17.kt -->

#### 입력에 따라 다른 LLM 응답을 어떻게 시뮬레이션할 수 있나요?

패턴 일치 메서드를 사용하십시오:

<!--- INCLUDE
import ai.koog.agents.testing.tools.getMockExecutor
import ai.koog.agents.testing.tools.mockLLMAnswer

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

### 문제 해결

#### 모의 실행기가 항상 기본 응답을 반환합니다

패턴 일치가 올바른지 확인하십시오. 패턴은 대소문자를 구분하며 지정된 대로 정확히 일치해야 합니다.

#### 도구 호출이 가로채지지 않습니다

다음을 확인하십시오:

1.  도구 레지스트리가 올바르게 설정되었는지.
2.  도구 이름이 정확히 일치하는지.
3.  도구 동작이 올바르게 구성되었는지.

#### 그래프 어설션이 실패합니다

1.  노드 이름이 올바른지 확인하십시오.
2.  그래프 구조가 예상과 일치하는지 확인하십시오.
3.  `startNode()` 및 `finishNode()` 메서드를 사용하여 올바른 진입점과 종료점을 가져오십시오.