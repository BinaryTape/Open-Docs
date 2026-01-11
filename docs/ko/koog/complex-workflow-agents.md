# 복잡한 워크플로 에이전트

기본 에이전트 외에도, `AIAgent` 클래스를 사용하면 사용자 지정 전략, 도구, 구성 및 사용자 지정 입/출력 타입을 정의하여 복잡한 워크플로를 처리하는 에이전트를 빌드할 수 있습니다.

!!! tip
    Koog가 처음이고 가장 간단한 에이전트를 만들고 싶다면 [기본 에이전트](basic-agents.md)부터 시작하세요.

이러한 에이전트를 생성하고 구성하는 과정은 일반적으로 다음 단계를 포함합니다.

1.  LLM과 통신하기 위한 프롬프트 실행기를 제공합니다.
2.  에이전트 워크플로를 제어하는 전략을 정의합니다.
3.  에이전트 동작을 구성합니다.
4.  에이전트가 사용할 도구를 구현합니다.
5.  이벤트 처리, 메모리 또는 추적과 같은 선택적 기능을 추가합니다.
6.  사용자 입력으로 에이전트를 실행합니다.

## 전제 조건

-   AI 에이전트를 구현하는 데 사용되는 LLM 제공자의 유효한 API 키가 있어야 합니다. 사용 가능한 모든 제공자 목록은 [LLM 제공자](llm-providers.md)를 참조하세요.

!!! tip
    환경 변수 또는 보안 구성 관리 시스템을 사용하여 API 키를 저장하세요.
    소스 코드에 API 키를 직접 하드코딩하지 마세요.

## 복잡한 워크플로 에이전트 생성

### 1. 의존성 추가

`AIAgent` 기능을 사용하려면 빌드 구성에 필요한 모든 의존성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

사용 가능한 모든 설치 방법에 대해서는 [Koog 설치](getting-started.md#install-koog)를 참조하세요.

### 2. 프롬프트 실행기 제공

프롬프트 실행기는 프롬프트를 관리하고 실행합니다.
사용할 LLM 제공자에 따라 프롬프트 실행기를 선택할 수 있습니다.
또한, 사용 가능한 LLM 클라이언트 중 하나를 사용하여 사용자 지정 프롬프트 실행기를 생성할 수 있습니다.
더 자세히 알아보려면 [프롬프트 실행기](prompts/prompt-executors.md)를 참조하세요.

예를 들어, OpenAI 프롬프트 실행기를 제공하려면 `simpleOpenAIExecutor` 함수를 호출하고 OpenAI 서비스 인증에 필요한 API 키를 제공해야 합니다.

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행하세요:

1)  필요한 LLM 제공자를 위한 클라이언트를 해당 API 키로 구성합니다. 예를 들어:
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-complex-workflow-agents-02.kt -->
2)  구성된 클라이언트를 `MultiLLMPromptExecutor` 클래스 생성자에 전달하여 여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성합니다:
<!--- INCLUDE
import ai.koog.agents.example.exampleComplexWorkflowAgents02.anthropicClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.googleClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.openAIClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-complex-workflow-agents-03.kt -->

### 3. 전략 정의

전략은 노드와 엣지를 사용하여 에이전트의 워크플로를 정의합니다. 이 전략은 임의의 입력 및 출력 타입을 가질 수 있으며, 이는 `strategy` 함수 제네릭 매개변수로 지정될 수 있습니다. 이는 또한 `AIAgent`의 입/출력 타입이 됩니다.
입력과 출력 모두의 기본 타입은 `String`입니다.

!!! tip
    전략에 대해 더 자세히 알아보려면 [사용자 지정 전략 그래프](custom-strategy-graphs.md)를 참조하세요.

#### 3.1. 노드와 엣지 이해하기

노드와 엣지는 전략의 빌딩 블록입니다.

노드는 에이전트 전략의 처리 단계를 나타냅니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
class InputType

class OutputType

val transformedOutput = OutputType()
val strategy = strategy<InputType, OutputType>("Simple calculator") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 입력을 처리하고 출력을 반환합니다.
    // llm.writeSession을 사용하여 LLM과 상호 작용할 수 있습니다.
    // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->

!!! tip
    에이전트 전략에서 사용할 수 있는 사전 정의된 노드도 있습니다. 더 자세히 알아보려면 [사전 정의된 노드 및 컴포넌트](nodes-and-components.md)를 참조하세요.

엣지는 노드 간의 연결을 정의합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // 입력을 처리하고 출력을 반환합니다.
        // llm.writeSession을 사용하여 LLM과 상호 작용할 수 있습니다.
        // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // 입력을 처리하고 출력을 반환합니다.
        // llm.writeSession을 사용하여 LLM과 상호 작용할 수 있습니다.
        // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 기본 엣지
edge(sourceNode forwardTo targetNode)

// 조건이 있는 엣지
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 이 엣지를 따르려면 true를, 건너뛰려면 false를 반환합니다.
    output.contains("specific text")
})

// 변환이 있는 엣지
edge(sourceNode forwardTo targetNode transformed { output ->
    // 출력을 대상 노드로 전달하기 전에 변환합니다.
    "Modified: $output"
})

// 결합된 조건 및 변환
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->

#### 3.2. 전략 구현하기

에이전트 전략을 구현하려면 `strategy` 함수를 호출하고 노드와 엣지를 정의합니다. 예를 들어:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 전략을 위한 노드를 정의합니다.
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 노드 간의 엣지를 정의합니다.
    // 시작 -> 입력 전송
    edge(nodeStart forwardTo nodeSendInput)

    // 입력 전송 -> 완료
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 입력 전송 -> 도구 실행
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 도구 실행 -> 도구 결과 전송
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 도구 결과 전송 -> 완료
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 함수를 사용하면 여러 서브그래프를 정의할 수 있으며, 각 서브그래프는 자체 노드 및 엣지 세트를 포함합니다.
    이 접근 방식은 간소화된 전략 빌더를 사용하는 것보다 더 많은 유연성과 기능을 제공합니다.
    서브그래프에 대해 더 자세히 알아보려면 [서브그래프](subgraphs-overview.md)를 참조하세요.

### 4. 에이전트 구성

구성으로 에이전트 동작을 정의합니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
-->
```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        당신은 간단한 계산기 도우미입니다.
        계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
        사용자가 입력을 제공할 때, 더하고 싶은 숫자를 추출합니다.
        입력은 "5와 7을 더해줘", "5 + 7", 또는 "5 7"과 같은 다양한 형식일 수 있습니다.
        두 숫자를 추출하고 계산기 도구를 사용하여 더합니다.
        항상 계산과 결과를 보여주는 명확하고 친근한 메시지로 응답하세요.
        """.trimIndent()
)
```
<!--- KNIT example-complex-workflow-agents-07.kt -->

더 고급 구성을 위해서는 에이전트가 사용할 LLM을 지정하고 에이전트가 응답하기 위해 수행할 수 있는 최대 반복 횟수를 설정할 수 있습니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                당신은 간단한 계산기 도우미입니다.
                계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
                사용자가 입력을 제공할 때, 더하고 싶은 숫자를 추출합니다.
                입력은 "5와 7을 더해줘", "5 + 7", 또는 "5 7"과 같은 다양한 형식일 수 있습니다.
                두 숫자를 추출하고 계산기 도구를 사용하여 더합니다.
                항상 계산과 결과를 보여주는 명확하고 친근한 메시지로 응답하세요.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```
<!--- KNIT example-complex-workflow-agents-08.kt -->

### 5. 도구 구현 및 도구 레지스트리 설정

도구를 사용하면 에이전트가 특정 작업을 수행할 수 있습니다.
에이전트가 도구를 사용할 수 있게 하려면 도구 레지스트리에 추가합니다.
예를 들어:
<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 두 숫자를 더할 수 있는 간단한 계산기 도구를 구현합니다.
@LLMDescription("기본 산술 연산을 수행하는 도구")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("두 숫자를 함께 더하고 그 합계를 반환합니다.")
    fun add(
        @LLMDescription("더할 첫 번째 숫자 (정수 값)")
        num1: Int,

        @LLMDescription("더할 두 번째 숫자 (정수 값)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 도구를 도구 레지스트리에 추가합니다.
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

도구에 대해 더 자세히 알아보려면 [도구](tools-overview.md)를 참조하세요.

### 6. 기능 설치

기능을 사용하면 에이전트에 새로운 기능을 추가하고, 동작을 수정하며, 외부 시스템 및 리소스에 대한 액세스를 제공하고, 에이전트 실행 중에 이벤트를 로깅하고 모니터링할 수 있습니다.
다음 기능들을 사용할 수 있습니다:

-   EventHandler
-   AgentMemory
-   Tracing

기능을 설치하려면 `install` 함수를 호출하고 해당 기능을 인수로 제공합니다.
예를 들어, 이벤트 핸들러 기능을 설치하려면 다음을 수행해야 합니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// EventHandler 기능을 설치합니다.
installFeatures = {
    install(EventHandler) {
        onAgentStarting { eventContext: AgentStartingContext ->
            println("에이전트 시작: ${eventContext.agent.id}")
        }
        onAgentCompleted { eventContext: AgentCompletedContext ->
            println("결과: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

기능 구성에 대해 더 자세히 알아보려면 전용 페이지를 참조하세요.

### 7. 에이전트 실행

이전 단계에서 생성된 구성 옵션으로 에이전트를 생성하고 제공된 입력으로 실행합니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.example.exampleComplexWorkflowAgents01.promptExecutor
import ai.koog.agents.example.exampleComplexWorkflowAgents06.agentStrategy
import ai.koog.agents.example.exampleComplexWorkflowAgents07.agentConfig
import ai.koog.agents.example.exampleComplexWorkflowAgents09.toolRegistry
import ai.koog.agents.features.eventHandler.feature.EventHandler
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("에이전트 시작: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("결과: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("더할 두 숫자를 입력하세요 (예: 'add 5 and 7' 또는 '5 + 7'):")

        // 사용자 입력을 읽고 에이전트로 전송합니다.
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("에이전트가 반환한 내용: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 구조화된 데이터 작업

`AIAgent`는 LLM 출력에서 구조화된 데이터를 처리할 수 있습니다. 더 자세한 내용은 [구조화된 데이터 처리](structured-output.md)를 참조하세요.

## 병렬 도구 호출 사용

`AIAgent`는 병렬 도구 호출을 지원합니다. 이 기능은 여러 도구를 동시에 처리할 수 있게 하여 독립적인 작업의 성능을 향상시킵니다.

더 자세한 내용은 [병렬 도구 호출](tools-overview.md#parallel-tool-calls)을 참조하세요.

## 전체 코드 예시

다음은 에이전트의 전체 구현입니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

-->
```kotlin
// 환경 변수의 API 키를 사용하여 OpenAI 실행기를 사용합니다.
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 간단한 전략을 생성합니다.
val agentStrategy = strategy("Simple calculator") {
    // 전략을 위한 노드를 정의합니다.
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 노드 간의 엣지를 정의합니다.
    // 시작 -> 입력 전송
    edge(nodeStart forwardTo nodeSendInput)

    // 입력 전송 -> 완료
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 입력 전송 -> 도구 실행
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 도구 실행 -> 도구 결과 전송
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 도구 결과 전송 -> 완료
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// 에이전트를 구성합니다.
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                당신은 간단한 계산기 도우미입니다.
                계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
                사용자가 입력을 제공할 때, 더하고 싶은 숫자를 추출합니다.
                입력은 "5와 7을 더해줘", "5 + 7", 또는 "5 7"과 같은 다양한 형식일 수 있습니다.
                두 숫자를 추출하고 계산기 도구를 사용하여 더합니다.
                항상 계산과 결과를 보여주는 명확하고 친근한 메시지로 응답하세요.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 두 숫자를 더할 수 있는 간단한 계산기 도구를 구현합니다.
@LLMDescription("기본 산술 연산을 수행하는 도구")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("두 숫자를 함께 더하고 그 합계를 반환합니다.")
    fun add(
        @LLMDescription("더할 첫 번째 숫자 (정수 값)")
        num1: Int,

        @LLMDescription("더할 두 번째 숫자 (정수 값)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// 도구를 도구 레지스트리에 추가합니다.
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 에이전트를 생성합니다.
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("에이전트 시작: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("결과: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("더할 두 숫자를 입력하세요 (예: 'add 5 and 7' 또는 '5 + 7'):")

        // 사용자 입력을 읽고 에이전트로 전송합니다.
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("에이전트가 반환한 내용: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->