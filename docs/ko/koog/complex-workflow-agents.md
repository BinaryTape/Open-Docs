# 복잡한 워크플로 에이전트

단일 실행 에이전트 외에도, `AIAgent` 클래스를 사용하면 사용자 지정 전략, 도구, 구성을 정의하여 복잡한 워크플로를 처리하는 에이전트를 빌드할 수 있습니다.

이러한 에이전트를 생성하고 구성하는 프로세스는 일반적으로 다음 단계를 포함합니다.

1.  LLM과 통신하기 위한 프롬프트 실행기를 제공합니다.
2.  에이전트 워크플로를 제어하는 전략을 정의합니다.
3.  에이전트 동작을 구성합니다.
4.  에이전트가 사용할 도구를 구현합니다.
5.  이벤트 처리, 메모리, 추적과 같은 선택적 기능을 추가합니다.
6.  사용자 입력으로 에이전트를 실행합니다.

## 전제 조건

-   AI 에이전트를 구현하는 데 사용되는 LLM 제공자의 유효한 API 키가 있어야 합니다. 사용 가능한 모든 제공자 목록은 [개요](index.md)를 참조하세요.

!!! 팁
    환경 변수 또는 보안 구성 관리 시스템을 사용하여 API 키를 저장하세요.
    소스 코드에 API 키를 직접 하드코딩하지 마세요.

## 단일 실행 에이전트 생성

### 1. 의존성 추가

`AIAgent` 기능을 사용하려면 빌드 구성에 필요한 모든 의존성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

사용 가능한 모든 설치 방법에 대해서는 [설치](index.md#installation)를 참조하세요.

### 2. 프롬프트 실행기 제공

프롬프트 실행기는 프롬프트를 관리하고 실행합니다.
사용할 LLM 제공자에 따라 프롬프트 실행기를 선택할 수 있습니다.
또한, 사용 가능한 LLM 클라이언트 중 하나를 사용하여 사용자 지정 프롬프트 실행기를 생성할 수 있습니다.
더 자세히 알아보려면 [프롬프트 실행기](prompt-api.md#prompt-executors)를 참조하세요.

예를 들어, OpenAI 프롬프트 실행기를 제공하려면 `simpleOpenAIExecutor` 함수를 호출하고 OpenAI 서비스 인증에 필요한 API 키를 제공해야 합니다.

```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```

여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행하세요.

1.  필요한 LLM 제공자를 위한 클라이언트를 해당 API 키로 구성합니다. 예를 들어:
    ```kotlin
    val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
    val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
    val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
    ```
2.  여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하기 위해 구성된 클라이언트를 `DefaultMultiLLMPromptExecutor` 클래스 생성자에 전달합니다.
    ```kotlin
    val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
    ```

### 3. 전략 정의

전략은 노드와 엣지를 사용하여 에이전트의 워크플로를 정의합니다.

#### 3.1. 노드와 엣지 이해하기

노드와 엣지는 전략의 빌딩 블록입니다.

노드는 에이전트 전략의 처리 단계를 나타냅니다.

```kotlin
val processNode by node<InputType, OutputType> { input ->
    // Process the input and return an output
    // You can use llm.writeSession to interact with the LLM
    // You can call tools using callTool, callToolRaw, etc.
    transformedOutput
}
```
!!! 팁
    에이전트 전략에서 사용할 수 있는 사전 정의된 노드도 있습니다. 더 자세히 알아보려면 [사전 정의된 노드 및 컴포넌트](nodes-and-components.md)를 참조하세요.

엣지는 노드 간의 연결을 정의합니다.

```kotlin
// Basic edge
edge(sourceNode forwardTo targetNode)

// Edge with condition
edge(sourceNode forwardTo targetNode onCondition { output ->
    // Return true to follow this edge, false to skip it
    output.contains("specific text")
})

// Edge with transformation
edge(sourceNode forwardTo targetNode transformed { output ->
    // Transform the output before passing it to the target node
    "Modified: $output"
})

// Combined condition and transformation
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
#### 3.2. 전략 구현하기

에이전트 전략을 구현하려면 `strategy` 함수를 호출하고 노드와 엣지를 정의합니다. 예를 들어:

```kotlin
val agentStrategy = strategy("Simple calculator") {
    // Define nodes for the strategy
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // Define edges between nodes
    // Start -> Send input
    edge(nodeStart forwardTo nodeSendInput)

    // Send input -> Finish
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // Send input -> Execute tool
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // Execute tool -> Send the tool result
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // Send the tool result -> finish
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
!!! 팁
    `strategy` 함수를 사용하면 여러 서브그래프를 정의할 수 있으며, 각 서브그래프는 자체 노드 및 엣지 세트를 포함합니다.
    이 접근 방식은 간소화된 전략 빌더를 사용하는 것보다 더 많은 유연성과 기능을 제공합니다.
    서브그래프에 대해 더 자세히 알아보려면 [서브그래프](subgraphs-overview.md)를 참조하세요.

### 4. 에이전트 구성

구성으로 에이전트 동작을 정의합니다.

```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        You are a simple calculator assistant.
        You can add two numbers together using the calculator tool.
        When the user provides input, extract the numbers they want to add.
        The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
        Extract the two numbers and use the calculator tool to add them.
        Always respond with a clear, friendly message showing the calculation and result.
        """.trimIndent()
)
```

더 고급 구성을 위해서는 에이전트가 사용할 LLM을 지정하고 에이전트가 응답하기 위해 수행할 수 있는 최대 반복 횟수를 설정할 수 있습니다.

```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```

### 5. 도구 구현 및 도구 레지스트리 설정

도구를 사용하면 에이전트가 특정 작업을 수행할 수 있습니다.
에이전트가 도구를 사용할 수 있게 하려면 도구 레지스트리에 추가합니다.
예를 들어:

```kotlin
// Implement a simple calculator tool that can add two numbers
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// Add the tool to the tool registry
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```

도구에 대해 더 자세히 알아보려면 [도구](tools-overview.md)를 참조하세요.

### 6. 기능 설치

기능을 사용하면 에이전트에 새로운 기능을 추가하고, 동작을 수정하며, 외부 시스템 및 리소스에 대한 액세스를 제공하고, 에이전트 실행 중에 이벤트를 로깅하고 모니터링할 수 있습니다.
다음 기능들을 사용할 수 있습니다:

-   EventHandler
-   AgentMemory
-   Tracing

기능을 설치하려면 `install` 함수를 호출하고 해당 기능을 인수로 제공합니다.
예를 들어, 이벤트 핸들러 기능을 설치하려면 다음을 수행해야 합니다.

```kotlin
installFeatures = {
    // install the EventHandler feature
    install(EventHandler) {
        onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
            println("Starting strategy: ${strategy.name}")
        }
        onAgentFinished { strategyName: String, result: String? ->
            println("Result: $result")
        }
    }
}
```

기능 구성에 대해 더 자세히 알아보려면 전용 페이지를 참조하세요.

### 7. 에이전트 실행

이전 단계에서 생성된 구성 옵션으로 에이전트를 생성하고 제공된 입력으로 실행합니다.

```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted = { strategy: AIAgentStrategy, agent: AIAgent ->
                println("Starting strategy: ${strategy.name}")
            }
            onAgentFinished = { strategyName: String, result: String? ->
                println("Result: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

    // Read the user input and send it to the agent
    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}
```

## 구조화된 데이터 작업

`AIAgent`는 LLM 출력에서 구조화된 데이터를 처리할 수 있습니다. 더 자세한 내용은 [스트리밍 API](streaming-api.md)를 참조하세요.

## 병렬 도구 호출 사용

`AIAgent`는 병렬 도구 호출을 지원합니다. 이 기능은 여러 도구를 동시에 처리할 수 있게 하여 독립적인 작업의 성능을 향상시킵니다.

더 자세한 내용은 [병렬 도구 호출](tools-overview.md#parallel-tool-calls)을 참조하세요.

## 전체 코드 예시

다음은 에이전트의 전체 구현입니다.

```kotlin
// Use the OpenAI executor with an API key from an environment variable
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// Create a simple strategy
val agentStrategy = strategy("Simple calculator") {
    // Define nodes for the strategy
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // Define edges between nodes
    // Start -> Send input
    edge(nodeStart forwardTo nodeSendInput)

    // Send input -> Finish
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // Send input -> Execute tool
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // Execute tool -> Send the tool result
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // Send the tool result -> finish
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// Configure the agent
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                You are a simple calculator assistant.
                You can add two numbers together using the calculator tool.
                When the user provides input, extract the numbers they want to add.
                The input might be in various formats like "add 5 and 7", "5 + 7", or just "5 7".
                Extract the two numbers and use the calculator tool to add them.
                Always respond with a clear, friendly message showing the calculation and result.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// Implement a simple calculator tool that can add two numbers
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// Add the tool to the tool registry
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// Create the agent
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        // install the EventHandler feature
        install(EventHandler) {
            onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
                println("Starting strategy: ${strategy.name}")
            }
            onAgentFinished { strategyName: String, result: String? ->
                println("Result: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("Enter two numbers to add (e.g., 'add 5 and 7' or '5 + 7'):")

    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}