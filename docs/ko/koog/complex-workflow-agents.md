# 복잡한 워크플로 에이전트

기본적인 에이전트 외에도, `AIAgent` 클래스를 사용하면 커스텀 전략(Strategies), 도구(Tools), 설정(Configurations) 및 커스텀 입력/출력 타입을 정의하여 복잡한 워크플로를 처리하는 에이전트를 빌드할 수 있습니다.

!!! tip
    Koog를 처음 사용하며 가장 간단한 에이전트를 만들고 싶다면, [기본 에이전트](basic-agents.md)부터 시작하세요.

이러한 에이전트를 생성하고 설정하는 과정은 일반적으로 다음 단계로 구성됩니다:

1. LLM과 통신할 프롬프트 실행기(Prompt executor)를 제공합니다.
2. 에이전트 워크플로를 제어하는 전략(Strategy)을 정의합니다.
3. 에이전트 동작을 설정합니다.
4. 에이전트가 사용할 도구(Tools)를 구현합니다.
5. 이벤트 처리, 메모리 또는 트레이싱(Tracing)과 같은 선택적 기능을 추가합니다.
6. 사용자 입력으로 에이전트를 실행합니다.

## 사전 준비 사항

- AI 에이전트 구현에 사용되는 LLM 제공업체의 유효한 API 키가 있어야 합니다. 사용 가능한 모든 제공업체 목록은 [LLM 제공업체](llm-providers.md)를 참조하세요.

!!! tip
    API 키를 저장할 때는 환경 변수나 보안 설정 관리 시스템을 사용하세요. 소스 코드에 API 키를 직접 하드코딩하는 것은 피해야 합니다.

## 복잡한 워크플로 에이전트 생성하기

### 1. 의존성 추가

`AIAgent` 기능을 사용하려면 빌드 설정에 필요한 모든 의존성을 포함하세요:

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

사용 가능한 모든 설치 방법은 [Koog 설치하기](getting-started.md#install-koog)를 참조하세요.

### 2. 프롬프트 실행기 제공

프롬프트 실행기(Prompt executors)는 프롬프트를 관리하고 실행합니다.
사용하려는 LLM 제공업체에 따라 프롬프트 실행기를 선택할 수 있습니다.
또한, 사용 가능한 LLM 클라이언트 중 하나를 사용하여 커스텀 프롬프트 실행기를 만들 수도 있습니다.
자세한 내용은 [프롬프트 실행기](prompts/prompt-executors.md)를 참조하세요.

예를 들어, OpenAI 프롬프트 실행기를 제공하려면 `simpleOpenAIExecutor` 함수를 호출하고 OpenAI 서비스 인증에 필요한 API 키를 전달해야 합니다:

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

여러 LLM 제공업체와 함께 작동하는 프롬프트 실행기를 만들려면 다음을 수행하세요:

1) 해당 API 키를 사용하여 필요한 LLM 제공업체의 클라이언트를 설정합니다. 예:
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
2) 설정된 클라이언트를 `MultiLLMPromptExecutor` 클래스 생성자에 전달하여 여러 LLM 제공업체를 지원하는 프롬프트 실행기를 생성합니다:
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

전략(Strategy)은 노드(Nodes)와 에지(Edges)를 사용하여 에이전트의 워크플로를 정의합니다. 전략은 임의의 입력 및 출력 타입을 가질 수 있으며, 이는 `strategy` 함수의 제네릭 파라미터에 지정할 수 있습니다. 이러한 타입은 `AIAgent` 자체의 입력/출력 타입이 되기도 합니다.
입력과 출력의 기본 타입은 `String`입니다.

!!! tip
    전략에 대해 더 자세히 알아보려면 [커스텀 전략 그래프](custom-strategy-graphs.md)를 참조하세요.

#### 3.1. 노드와 에지 이해하기

노드와 에지는 전략의 구성 요소입니다.

노드(Nodes)는 에이전트 전략에서의 처리 단계를 나타냅니다.

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
    // llm.writeSession을 사용하여 LLM과 상호작용할 수 있습니다.
    // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->

!!! tip
    에이전트 전략에서 사용할 수 있는 미리 정의된 노드들도 있습니다. 자세한 내용은 [사전 정의된 노드 및 컴포넌트](nodes-and-components.md)를 참조하세요.

에지(Edges)는 노드 간의 연결을 정의합니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // 입력을 처리하고 출력을 반환합니다.
        // llm.writeSession을 사용하여 LLM과 상호작용할 수 있습니다.
        // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // 입력을 처리하고 출력을 반환합니다.
        // llm.writeSession을 사용하여 LLM과 상호작용할 수 있습니다.
        // callTool, callToolRaw 등을 사용하여 도구를 호출할 수 있습니다.
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 기본 에지
edge(sourceNode forwardTo targetNode)

// 조건이 있는 에지
edge(sourceNode forwardTo targetNode onCondition { output ->
    // 이 에지를 따라가려면 true를, 건너뛰려면 false를 반환합니다.
    output.contains("specific text")
})

// 변환이 있는 에지
edge(sourceNode forwardTo targetNode transformed { output ->
    // 대상 노드로 전달하기 전에 출력을 변환합니다.
    "Modified: $output"
})

// 조건과 변환이 결합된 형태
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->

#### 3.2. 전략 구현

에이전트 전략을 구현하려면 `strategy` 함수를 호출하고 노드와 에지를 정의합니다. 예:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 전략을 위한 노드 정의
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 노드 간의 에지 정의
    // 시작 -> 입력 보내기
    edge(nodeStart forwardTo nodeSendInput)

    // 입력 보내기 -> 완료
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 입력 보내기 -> 도구 실행
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 도구 실행 -> 도구 결과 보내기
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 도구 결과 보내기 -> 완료
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 함수를 사용하면 각각 고유한 노드와 에지 집합을 포함하는 여러 서브그래프(Subgraphs)를 정의할 수 있습니다.
    이 방식은 단순화된 전략 빌더를 사용하는 것에 비해 더 많은 유연성과 기능을 제공합니다.
    서브그래프에 대해 더 자세히 알아보려면 [서브그래프 개요](subgraphs-overview.md)를 참조하세요.

### 4. 에이전트 설정

설정(Configuration)을 통해 에이전트의 동작을 정의합니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
-->
```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        당신은 간단한 계산기 어시스턴트입니다.
        계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
        사용자가 입력을 제공하면 더하고 싶어 하는 숫자를 추출하세요.
        입력은 "5와 7을 더해줘", "5 + 7", 또는 그냥 "5 7"과 같이 다양한 형식이 될 수 있습니다.
        두 숫자를 추출하고 계산기 도구를 사용하여 더하세요.
        항상 계산 과정과 결과를 보여주는 명확하고 친절한 메시지로 응답하세요.
        """.trimIndent()
)
```
<!--- KNIT example-complex-workflow-agents-07.kt -->

더 고급 설정의 경우, 에이전트가 사용할 LLM을 지정하고 에이전트가 응답하기 위해 수행할 수 있는 최대 반복(Iterations) 횟수를 설정할 수 있습니다:
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
                당신은 간단한 계산기 어시스턴트입니다.
                계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
                사용자가 입력을 제공하면 더하고 싶어 하는 숫자를 추출하세요.
                입력은 "5와 7을 더해줘", "5 + 7", 또는 그냥 "5 7"과 같이 다양한 형식이 될 수 있습니다.
                두 숫자를 추출하고 계산기 도구를 사용하여 더하세요.
                항상 계산 과정과 결과를 보여주는 명확하고 친절한 메시지로 응답하세요.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```
<!--- KNIT example-complex-workflow-agents-08.kt -->

### 5. 도구 구현 및 도구 레지스트리 설정

도구(Tools)를 사용하면 에이전트가 특정 작업을 수행할 수 있습니다.
에이전트가 도구를 사용할 수 있게 하려면 도구 레지스트리(Tool registry)에 추가해야 합니다.
예:
<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 두 숫자를 더할 수 있는 간단한 계산기 도구 구현
@LLMDescription("기본적인 산술 연산을 수행하기 위한 도구")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("두 숫자를 더하고 그 합계를 반환합니다")
    fun add(
        @LLMDescription("더할 첫 번째 숫자 (정수 값)")
        num1: Int,

        @LLMDescription("더할 두 번째 숫자 (정수 값)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "$num1 와 $num2 의 합계는 $sum 입니다."
    }
}

// 도구 레지스트리에 도구 추가
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

도구에 대해 더 자세히 알아보려면 [도구 개요](tools-overview.md)를 참조하세요.

### 6. 기능 설치

기능(Features)을 사용하면 에이전트에 새로운 역량을 추가하거나, 동작을 수정하고, 외부 시스템 및 리소스에 대한 접근을 제공하며, 에이전트가 실행되는 동안 이벤트를 로그에 기록하고 모니터링할 수 있습니다.
다음 기능들을 사용할 수 있습니다:

- EventHandler
- AgentMemory
- Tracing

기능을 설치하려면 `install` 함수를 호출하고 기능을 인자로 제공하세요.
예를 들어, 이벤트 핸들러 기능을 설치하려면 다음과 같이 수행합니다:
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// EventHandler 기능 설치
installFeatures = {
    install(EventHandler) {
        onAgentStarting { eventContext: AgentStartingContext ->
            println("에이전트 시작 중: ${eventContext.agent.id}")
        }
        onAgentCompleted { eventContext: AgentCompletedContext ->
            println("결과: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

기능 설정에 대해 더 자세히 알아보려면 전용 페이지를 참조하세요.

### 7. 에이전트 실행

이전 단계에서 생성한 설정 옵션으로 에이전트를 생성하고 제공된 입력으로 실행합니다:
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
                println("에이전트 시작 중: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("결과: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("더할 두 숫자를 입력하세요 (예: '5와 7을 더해줘' 또는 '5 + 7'):")

        // 사용자 입력을 읽어 에이전트에게 전달
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("에이전트 반환값: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 구조화된 데이터 작업하기

`AIAgent`는 LLM 출력에서 구조화된 데이터를 처리할 수 있습니다. 자세한 내용은 [구조화된 데이터 처리](structured-output.md)를 참조하세요.

## 병렬 도구 호출 사용하기

`AIAgent`는 병렬 도구 호출을 지원합니다. 이 기능을 사용하면 여러 도구를 동시에 처리할 수 있어 독립적인 작업의 성능을 향상시킬 수 있습니다.

자세한 내용은 [병렬 도구 호출](tools-overview.md#parallel-tool-calls)을 참조하세요.

## 전체 코드 샘플

다음은 에이전트의 전체 구현 코드입니다:
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
// 환경 변수의 API 키를 사용하여 OpenAI 실행기 사용
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// 간단한 전략 생성
val agentStrategy = strategy("Simple calculator") {
    // 전략을 위한 노드 정의
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // 노드 간의 에지 정의
    // 시작 -> 입력 보내기
    edge(nodeStart forwardTo nodeSendInput)

    // 입력 보내기 -> 완료
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 입력 보내기 -> 도구 실행
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // 도구 실행 -> 도구 결과 보내기
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // 도구 결과 보내기 -> 완료
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// 에이전트 설정
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                당신은 간단한 계산기 어시스턴트입니다.
                계산기 도구를 사용하여 두 숫자를 더할 수 있습니다.
                사용자가 입력을 제공하면 더하고 싶어 하는 숫자를 추출하세요.
                입력은 "5와 7을 더해줘", "5 + 7", 또는 그냥 "5 7"과 같이 다양한 형식이 될 수 있습니다.
                두 숫자를 추출하고 계산기 도구를 사용하여 더하세요.
                항상 계산 과정과 결과를 보여주는 명확하고 친절한 메시지로 응답하세요.
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 두 숫자를 더할 수 있는 간단한 계산기 도구 구현
@LLMDescription("기본적인 산술 연산을 수행하기 위한 도구")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("두 숫자를 더하고 그 합계를 반환합니다")
    fun add(
        @LLMDescription("더할 첫 번째 숫자 (정수 값)")
        num1: Int,

        @LLMDescription("더할 두 번째 숫자 (정수 값)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "$num1 와 $num2 의 합계는 $sum 입니다."
    }
}

// 도구 레지스트리에 도구 추가
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// 에이전트 생성
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("에이전트 시작 중: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("결과: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("더할 두 숫자를 입력하세요 (예: '5와 7을 더해줘' 또는 '5 + 7'):")

        // 사용자 입력을 읽어 에이전트에게 전달
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("에이전트 반환값: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->