# 테스트 (Testing)

## 개요 (Overview)

테스트 기능은 Koog 프레임워크에서 AI 에이전트 파이프라인(pipeline), 서브그래프(subgraph), 그리고 도구 상호작용을 테스트하기 위한 포괄적인 프레임워크를 제공합니다. 이를 통해 개발자는 모의(mock) LLM(대규모 언어 모델) 실행기, 도구 레지스트리(registry) 및 에이전트 환경을 사용하여 통제된 테스트 환경을 구축할 수 있습니다.

### 목적

이 기능의 주요 목적은 다음과 같은 방법을 통해 에이전트 기반 AI 기능의 테스트를 용이하게 하는 것입니다:

- 특정 프롬프트에 대한 LLM 응답을 모의 처리(Mocking)
- 도구 호출 및 그 결과 시뮬레이션
- 에이전트 파이프라인 서브그래프 및 구조 테스트
- 에이전트 노드를 통한 데이터의 올바른 흐름 검증
- 기대되는 동작에 대한 단언(assertion) 제공

## 설정 및 초기화

### 테스트 의존성 설정

테스트 환경을 설정하기 전에 다음 의존성을 추가했는지 확인하세요:

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

### LLM 응답 모의하기(Mocking)

테스트의 가장 기본적인 형태는 결정론적(deterministic) 동작을 보장하기 위해 LLM 응답을 모의 처리하는 것입니다. 이는 `MockLLMBuilder` 및 관련 유틸리티를 사용하여 수행할 수 있습니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.testing.tools.getMockExecutor
    val toolRegistry = ToolRegistry {}
    -->
    ```kotlin
    // 모의 LLM 실행기 생성
    val mockLLMApi = getMockExecutor {
      // 간단한 텍스트 응답 모의 처리
      mockLLMAnswer("Hello!") onRequestContains "Hello"

      // 기본 응답 모의 처리
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

    // 도구 레지스트리 생성(비어 있음)
    ToolRegistry toolRegistry = ToolRegistry.builder().build();

    // 모의 LLM 실행기 생성
    PromptExecutor mockLLMApi = MockExecutor.builder()
        .toolRegistry(toolRegistry)
        .mockLLMAnswer("Hello!").onRequestContains("Hello")
        .mockLLMAnswer("I don't know how to answer that.").asDefaultResponse()
        .build();
    ```
    <!--- KNIT example-testing-java-01.java -->

### 도구 호출 모의하기(Mocking)

입력 패턴에 따라 특정 도구를 호출하도록 LLM을 모의 처리할 수 있습니다:

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
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
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
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
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
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
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
    // 도구 호출 응답 모의 처리
    mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

    // 도구 동작 모의 처리 - 람다 없는 가장 단순한 형태
    mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

    // 추가 작업이 필요한 경우 람다 사용
    mockTool(NegativeToneTool) alwaysTells {
      // 추가 작업 수행
      println("Negative tone tool called")

      // 결과 반환
      "The text has a negative tone."
    }

    // 특정 인자를 기반으로 도구 동작 모의 처리
    mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

    // 조건부 인자 매칭을 사용한 도구 동작 모의 처리
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

위 예시들은 단순한 방식부터 복잡한 방식까지 도구를 모의 처리하는 다양한 방법을 보여줍니다:

1. `alwaysReturns`: 가장 단순한 형태로, 람다 없이 값을 직접 반환합니다.
2. `alwaysTells`: 추가 작업을 수행해야 할 때 람다를 사용합니다.
3. `returns...onArguments`: 정확히 일치하는 인자에 대해 특정 결과를 반환합니다.
4. `returns...onArgumentsMatching`: 사용자 정의 인자 조건에 따라 결과를 반환합니다.

### 테스트 모드 활성화

에이전트에서 테스트 모드를 활성화하려면 `AIAgent` 생성자 블록 내에서 `withTesting()` 함수를 사용하세요:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.withTesting
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    val llmModel = OpenAIModels.Chat.GPT4o
    // 테스트가 활성화된 에이전트 생성
    fun main() {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // 테스트가 활성화된 에이전트 생성
    AIAgent(
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        // 테스트 모드 활성화
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

## 고급 테스트

### 그래프 구조 테스트

상세한 노드 동작과 엣지(edge) 연결을 테스트하기 전에, 에이전트 그래프의 전반적인 구조를 검증하는 것이 중요합니다. 여기에는 필요한 모든 노드가 존재하고 예상되는 서브그래프 내에 제대로 연결되어 있는지 확인하는 것이 포함됩니다.

테스트 기능은 에이전트의 그래프 구조를 테스트하는 포괄적인 방법을 제공합니다. 이 접근 방식은 여러 서브그래프와 상호 연결된 노드가 있는 복잡한 에이전트의 경우 특히 유용합니다.

#### 기본 구조 테스트

에이전트 그래프의 근본적인 구조를 검증하는 것부터 시작하세요:

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
        // 생성자 인자
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            val firstSubgraph = assertSubgraphByName<String, String>("first")
            val secondSubgraph = assertSubgraphByName<String, String>("second")

            // 서브그래프 연결 단언(Assert)
            assertEdges {
                startNode() alwaysGoesTo firstSubgraph
                firstSubgraph alwaysGoesTo secondSubgraph
                secondSubgraph alwaysGoesTo finishNode()
            }

            // 첫 번째 서브그래프 검증
            verifySubgraph(firstSubgraph) {
                val start = startNode()
                val finish = finishNode()

                // 이름으로 노드 단언
                val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")

                // 노드 도달 가능성(reachability) 단언
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

### 노드 동작 테스트

노드 동작 테스트를 통해 에이전트 그래프의 노드가 주어진 입력에 대해 기대되는 출력을 생성하는지 확인할 수 있습니다. 이는 다양한 시나리오에서 에이전트의 로직이 올바르게 작동하는지 보장하는 데 매우 중요합니다.

#### 기본 노드 테스트

개별 노드에 대한 단순한 입력 및 출력 검증부터 시작하세요:

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
            // 생성자 인자
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

        // 기본 텍스트 응답 테스트
        askLLM withInput "Hello" outputs assistantMessage("Hello!")

        // 도구 호출 응답 테스트
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

위 예시는 다음 동작을 테스트하는 방법을 보여줍니다:
1. LLM 노드가 입력으로 `Hello`를 받으면, 단순한 텍스트 메시지로 응답합니다.
2. `Solve task`를 받으면 도구 호출로 응답합니다.

#### 도구 실행 노드 테스트

도구를 실행하는 노드도 테스트할 수 있습니다:

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
            @property:LLMDescription("Message from the agent")
            val message: String
        )
        override suspend fun execute(args: Args): String {
            return args.message
        }
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 생성자 인자
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
        // 특정 인자를 사용한 도구 실행 테스트
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

이 테스트는 도구 실행 노드가 특정 도구 호출 서명을 받을 때 기대되는 도구 결과를 생성하는지 검증합니다.

#### 고급 노드 테스트

더 복잡한 시나리오의 경우, 구조화된 입력과 출력을 사용하여 노드를 테스트할 수 있습니다:

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
            @property:LLMDescription("Message from the agent")
            val query: String,
            val depth: Int
        )
        override suspend fun execute(args: Args): String = args.query
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // 생성자 인자
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
        // 동일한 노드에 대한 서로 다른 입력 테스트
        askLLM withInput "Simple query" outputs assistantMessage("Simple response")

        // 복잡한 파라미터를 사용한 테스트
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

상세한 결과 구조를 가진 복잡한 도구 호출 시나리오도 테스트할 수 있습니다:

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
            // 생성자 인자
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
        // 구조화된 결과를 가진 복잡한 도구 호출 테스트
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

이러한 고급 테스트는 노드가 복잡한 데이터 구조를 올바르게 처리하는지 확인하는 데 도움이 되며, 이는 정교한 에이전트 동작에 필수적입니다.

### 엣지(Edge) 연결 테스트

엣지 연결 테스트를 통해 에이전트 그래프가 한 노드의 출력을 적절한 다음 노드로 올바르게 라우팅(routing)하는지 확인할 수 있습니다. 이를 통해 에이전트가 서로 다른 출력을 기반으로 의도된 워크플로 경로를 따르는지 보장합니다.

#### 기본 엣지 테스트

단순한 엣지 연결 테스트부터 시작하세요:

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
            // 생성자 인자
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
        // 텍스트 메시지 라우팅 테스트
        askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

        // 도구 호출 라우팅 테스트
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

이 예시는 다음 동작을 검증합니다:
1. LLM 노드가 단순한 텍스트 메시지를 출력하면, 흐름이 `giveFeedback` 노드로 향합니다.
2. 도구 호출을 출력하면, 흐름이 `callTool` 노드로 향합니다.

#### 조건부 라우팅 테스트

출력 내용에 따른 더 복잡한 라우팅 로직을 테스트할 수 있습니다:

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
            // 생성자 인자
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
        // 서로 다른 텍스트 응답이 다른 노드로 라우팅될 수 있음
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

#### 고급 엣지 테스트

정교한 에이전트의 경우, 도구 결과의 구조화된 데이터를 기반으로 조건부 라우팅을 테스트할 수 있습니다:

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
            // 생성자 인자
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
        // 도구 결과 내용을 기반으로 라우팅 테스트
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

서로 다른 결과 속성에 따른 복잡한 의사결정 경로를 테스트할 수도 있습니다:

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
            // 생성자 인자
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
        // 신뢰도 수준에 따라 다른 노드로 라우팅
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

이러한 고급 엣지 테스트는 에이전트가 노드 출력의 내용과 구조를 기반으로 올바른 결정을 내리는지 확인하는 데 도움이 되며, 이는 지능적이고 문맥을 인식하는 워크플로를 만드는 데 필수적입니다.

## 전체 테스트 예시

다음은 전체 테스트 시나리오를 보여주는 사용자 스토리(user story)입니다:

텍스트의 어조를 분석하고 피드백을 제공하는 어조 분석 에이전트를 개발하고 있다고 가정해 봅시다. 에이전트는 긍정적, 부정적 및 중립적 어조를 감지하기 위해 도구를 사용합니다.

이 에이전트를 테스트하는 방법은 다음과 같습니다:

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
        // 도구 호출을 추적하기 위한 리스트 생성
        var toolCalls = mutableListOf<String>()
        var result: String? = null

        // 도구 레지스트리 생성
        val toolRegistry = ToolRegistry {
            // 이런 유형의 에이전트에 필요한 특수 도구
            tool(SayToUser)

            with(ToneTools) {
                tools()
            }
        }

        // 이벤트 핸들러 생성
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
            // 다양한 입력 텍스트에 대한 LLM 응답 설정
            mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
            mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
            mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

            // 도구가 결과를 반환할 때 LLM이 도구 응답으로만 대답하는 동작 모의 처리
            mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
            mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
            mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

            mockLLMAnswer(defaultText).asDefaultResponse

            // 도구 모의 처리(Mock)
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

        // 전략(strategy) 생성
        val strategy = toneStrategy("tone_analysis")

        // 에이전트 설정 생성
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

        // 테스트가 활성화된 에이전트 생성
        val agent = AIAgent(
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            strategy = strategy,
            eventHandler = eventHandler,
            agentConfig = agentConfig,
        ) {
            withTesting()
        }

        // 긍정적인 텍스트 테스트
        agent.run(positiveText)
        assertEquals("The text has a positive tone.", result, "Positive tone result should match")
        assertEquals(1, toolCalls.size, "One tool is expected to be called")

        // 부정적인 텍스트 테스트
        agent.run(negativeText)
        assertEquals("The text has a negative tone.", result, "Negative tone result should match")
        assertEquals(2, toolCalls.size, "Two tools are expected to be called")

        // 중립적인 텍스트 테스트
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

여러 서브그래프가 있는 더 복잡한 에이전트의 경우, 그래프 구조도 테스트할 수 있습니다:

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
                val executeTool by nodeExecuteToolsAndGetResults()
                val sendToolResult by nodeLLMSendToolResults()
                val giveFeedback by node<String, String> { input ->
                    llm.writeSession {
                        appendPrompt {
                            user("Call tools! Don't chat!")
                        }
                    }
                    input
                }

                edge(nodeStart forwardTo callLLM asUserMessage { it })
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

## API 참조

테스트 기능과 관련된 전체 API 참조는 [agents-test](api:agents-test::) 모듈의 참조 문서를 확인하세요.

## FAQ 및 문제 해결

#### 특정 도구 응답을 어떻게 모의 처리(Mock)하나요?

`MockLLMBuilder`에서 `mockTool` 메서드를 사용하세요:

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

        // 또는 조건을 사용하여
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

#### 복잡한 그래프 구조를 어떻게 테스트할 수 있나요?

서브그래프 단언, `verifySubgraph` 및 노드 참조를 사용하세요:

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
            // 생성자 인자
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
            // 노드에 대한 참조 가져오기
            val nodeA = assertNodeByName<Unit, String>("nodeA")
            val nodeB = assertNodeByName<String, String>("nodeB")

            // 도달 가능성 단언
            assertReachable(nodeA, nodeB)

            // 엣지 연결 단언
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

#### 입력에 따라 다른 LLM 응답을 어떻게 시뮬레이션하나요?

패턴 매칭 메서드를 사용하세요:

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

### 문제 해결

#### 모의(Mock) 실행기가 항상 기본 응답만 반환합니다.

패턴 매칭이 올바른지 확인하세요. 패턴은 대소문자를 구분하며 지정된 대로 정확히 일치해야 합니다.

#### 도구 호출이 가로채지지(intercepted) 않습니다.

다음을 확인하세요:

1. 도구 레지스트리가 올바르게 설정되었는지 확인합니다.
2. 도구 이름이 정확히 일치하는지 확인합니다.
3. 도구 작업(action)이 올바르게 구성되었는지 확인합니다.

#### 그래프 단언이 실패합니다.

1. 노드 이름이 올바른지 확인합니다.
2. 그래프 구조가 예상과 일치하는지 확인합니다.
3. 올바른 진입점과 진출점을 얻으려면 `startNode()` 및 `finishNode()` 메서드를 사용하세요.