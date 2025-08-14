# 사전 정의된 노드 및 컴포넌트

노드는 Koog 프레임워크의 에이전트 워크플로를 구성하는 근본적인 빌딩 블록입니다. 각 노드는 워크플로 내에서 특정 작업이나 변환을 나타내며, 엣지를 사용하여 연결되어 실행 흐름을 정의합니다.

일반적으로 노드를 사용하면 복잡한 로직을 재사용 가능한 컴포넌트로 캡슐화하여 다양한 에이전트 워크플로에 쉽게 통합할 수 있습니다. 이 가이드에서는 에이전트 전략에서 사용할 수 있는 기존 노드에 대해 설명합니다.

자세한 참조 문서는 [API 레퍼런스](https://api.koog.ai/index.html)를 참조하세요.

## 유틸리티 노드

### nodeDoNothing

아무 작업도 하지 않고 입력을 출력으로 반환하는 간단한 패스스루 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-do-nothing.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 그래프에 플레이스홀더 노드를 생성합니다.
- 데이터를 수정하지 않고 연결 지점을 생성합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val passthrough by nodeDoNothing<String>("passthrough")

edge(nodeStart forwardTo passthrough)
edge(passthrough forwardTo nodeFinish)
```
<!--- KNIT example-nodes-and-component-01.kt -->

## LLM 노드

### nodeUpdatePrompt

제공된 프롬프트 빌더를 사용하여 LLM 프롬프트에 메시지를 추가하는 노드입니다. 이는 실제 LLM 요청을 하기 전에 대화 컨텍스트를 수정하는 데 유용합니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-update-prompt.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 프롬프트에 시스템 지침을 추가합니다.
- 대화에 사용자 메시지를 삽입합니다.
- 후속 LLM 요청을 위한 컨텍스트를 준비합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeUpdatePrompt

typealias Input = Unit
typealias Output = Unit

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val firstNode by node<Input, Output> {
    // Transform input to output
}

val secondNode by node<Output, Output> {
    // Transform output to output
}

// Node will get the value of type Output as input from the previous node and path through it to the next node
val setupContext by nodeUpdatePrompt<Output>("setupContext") {
    system("You are a helpful assistant specialized in Kotlin programming.")
    user("I need help with Kotlin coroutines.")
}

edge(firstNode forwardTo setupContext)
edge(setupContext forwardTo secondNode)
```
<!--- KNIT example-nodes-and-component-02.kt -->

### nodeLLMSendMessageOnlyCallingTools

LLM 프롬프트에 사용자 메시지를 추가하고 LLM이 도구만 호출할 수 있는 응답을 받는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-only-calling-tools.html)를 참조하세요.

### nodeLLMSendMessageForceOneTool

LLM 프롬프트에 사용자 메시지를 추가하고 LLM이 특정 도구를 사용하도록 강제하는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-force-one-tool.html)를 참조하세요.

### nodeLLMRequest

LLM 프롬프트에 사용자 메시지를 추가하고 선택적 도구 사용과 함께 응답을 받는 노드입니다. 노드 설정은 메시지 처리 중에 도구 호출이 허용되는지 여부를 결정합니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- LLM이 도구 호출을 생성할 수 있는지 제어하여 현재 프롬프트에 대한 LLM 응답을 생성합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest("requestLLM", allowToolCalls = true)
edge(getUserQuestion forwardTo requestLLM)
```
<!--- KNIT example-nodes-and-component-03.kt -->

### nodeLLMRequestStructured

LLM 프롬프트에 사용자 메시지를 추가하고 오류 수정 기능과 함께 LLM으로부터 구조화된 데이터를 요청하는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-structured.html)를 참조하세요.

### nodeLLMRequestStreaming

LLM 프롬프트에 사용자 메시지를 추가하고 스트림 데이터 변환 유무에 관계없이 LLM 응답을 스트리밍하는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-streaming.html)를 참조하세요.

### nodeLLMRequestMultiple

LLM 프롬프트에 사용자 메시지를 추가하고 도구 호출이 활성화된 여러 LLM 응답을 받는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-multiple.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 여러 도구 호출이 필요한 복잡한 쿼리를 처리합니다.
- 여러 도구 호출을 생성합니다.
- 여러 병렬 작업이 필요한 워크플로를 구현합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeDoNothing

val strategy = strategy<String, String>("strategy_name") {
    val getComplexUserQuestion by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
edge(getComplexUserQuestion forwardTo requestLLMMultipleTools)
```
<!--- KNIT example-nodes-and-component-04.kt -->

### nodeLLMCompressHistory

현재 LLM 프롬프트(메시지 기록)를 요약으로 압축하여 메시지를 간결한 요약(TL;DR)으로 대체하는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-compress-history.html)를 참조하세요. 이는 기록을 압축하여 토큰 사용량을 줄임으로써 긴 대화를 관리하는 데 유용합니다.

기록 압축에 대한 자세한 내용은 [기록 압축](history-compression.md)을 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 토큰 사용량을 줄이기 위해 긴 대화를 관리합니다.
- 컨텍스트를 유지하기 위해 대화 기록을 요약합니다.
- 장기 실행 에이전트에서 메모리 관리를 구현합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMCompressHistory
import ai.koog.agents.core.dsl.extension.nodeDoNothing
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy

val strategy = strategy<String, String>("strategy_name") {
    val generateHugeHistory by nodeDoNothing<String>()
-->
<!--- SUFFIX
}
-->
```kotlin
val compressHistory by nodeLLMCompressHistory<String>(
    "compressHistory",
    strategy = HistoryCompressionStrategy.FromLastNMessages(10),
    preserveMemory = true
)
edge(generateHugeHistory forwardTo compressHistory)
```
<!--- KNIT example-nodes-and-component-05.kt -->

## 도구 노드

### nodeExecuteTool

단일 도구 호출을 실행하고 그 결과를 반환하는 노드입니다. 이 노드는 LLM이 수행한 도구 호출을 처리하는 데 사용됩니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- LLM이 요청한 도구를 실행합니다.
- LLM 결정에 대한 응답으로 특정 작업을 처리합니다.
- 외부 기능을 에이전트 워크플로에 통합합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.onToolCall

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLM by nodeLLMRequest()
val executeTool by nodeExecuteTool()
edge(requestLLM forwardTo executeTool onToolCall { true })
```
<!--- KNIT example-nodes-and-component-06.kt -->

### nodeLLMSendToolResult

프롬프트에 도구 결과를 추가하고 LLM 응답을 요청하는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 도구 실행 결과를 처리합니다.
- 도구 출력에 기반한 응답을 생성합니다.
- 도구 실행 후 대화를 계속합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeTool by nodeExecuteTool()
val sendToolResultToLLM by nodeLLMSendToolResult()
edge(executeTool forwardTo sendToolResultToLLM)
```
<!--- KNIT example-nodes-and-component-07.kt -->

### nodeExecuteMultipleTools

여러 도구 호출을 실행하는 노드입니다. 이 호출들은 선택적으로 병렬로 실행될 수 있습니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 여러 도구를 병렬로 실행합니다.
- 여러 도구 실행이 필요한 복잡한 워크플로를 처리합니다.
- 도구 호출을 일괄 처리하여 성능을 최적화합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequestMultiple
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools
import ai.koog.agents.core.dsl.extension.onMultipleToolCalls

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val requestLLMMultipleTools by nodeLLMRequestMultiple()
val executeMultipleTools by nodeExecuteMultipleTools()
edge(requestLLMMultipleTools forwardTo executeMultipleTools onMultipleToolCalls { true })
```
<!--- KNIT example-nodes-and-component-08.kt -->

### nodeLLMSendMultipleToolResults

프롬프트에 여러 도구 결과를 추가하고 여러 LLM 응답을 받는 노드입니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)를 참조하세요.

이 노드는 다음 목적으로 사용할 수 있습니다:

- 여러 도구 실행 결과를 처리합니다.
- 여러 도구 호출을 생성합니다.
- 여러 병렬 작업이 포함된 복잡한 워크플로를 구현합니다.

예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults
import ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val executeMultipleTools by nodeExecuteMultipleTools()
val sendMultipleToolResultsToLLM by nodeLLMSendMultipleToolResults()
edge(executeMultipleTools forwardTo sendMultipleToolResultsToLLM)
```
<!--- KNIT example-nodes-and-component-09.kt -->

## 사전 정의된 서브그래프

프레임워크는 일반적으로 사용되는 패턴과 워크플로를 캡슐화하는 사전 정의된 서브그래프를 제공합니다. 이러한 서브그래프는 기본 노드 및 엣지 생성을 자동으로 처리하여 복잡한 에이전트 전략 개발을 간소화합니다.

사전 정의된 서브그래프를 사용하면 다양한 인기 파이프라인을 구현할 수 있습니다. 예시는 다음과 같습니다:

1. 데이터를 준비합니다.
2. 작업을 실행합니다.
3. 작업 결과를 검증합니다. 결과가 올바르지 않으면 피드백 메시지와 함께 2단계로 돌아가서 조정합니다.

### subgraphWithTask

제공된 도구를 사용하여 특정 작업을 수행하고 구조화된 결과를 반환하는 서브그래프입니다. 이 서브그래프는 더 큰 워크플로 내에서 자체 포함된 작업을 처리하도록 설계되었습니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-task.html)를 참조하세요.

이 서브그래프는 다음 목적으로 사용할 수 있습니다:

- 더 큰 워크플로 내에서 특정 작업을 처리하는 특수 컴포넌트를 생성합니다.
- 명확한 입력 및 출력 인터페이스로 복잡한 로직을 캡슐화합니다.
- 작업별 도구, 모델 및 프롬프트를 설정합니다.
- 자동 압축으로 대화 기록을 관리합니다.
- 구조화된 에이전트 워크플로 및 작업 실행 파이프라인을 개발합니다.
- LLM 작업 실행에서 구조화된 결과를 생성합니다.

서브그래프에 텍스트로 작업을 제공하고, 필요한 경우 LLM을 설정하고, 필요한 도구를 제공하면 서브그래프가 작업을 처리하고 해결합니다. 예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.agent.subgraphWithTask

val searchTool = SayToUser
val calculatorTool = SayToUser
val weatherTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processQuery by subgraphWithTask<String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    llmModel = OpenAIModels.Chat.GPT4o,
) { userQuery ->
    """
    You are a helpful assistant that can answer questions about various topics.
    Please help with the following query:
    $userQuery
    """
}
```
<!--- KNIT example-nodes-and-component-10.kt -->

### subgraphWithVerification

`subgraphWithTask`의 특수 버전으로, 작업이 올바르게 수행되었는지 확인하고 발생한 문제에 대한 세부 정보를 제공합니다. 이 서브그래프는 유효성 검사 또는 품질 확인이 필요한 워크플로에 유용합니다. 자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-verification.html)를 참조하세요.

이 서브그래프는 다음 목적으로 사용할 수 있습니다:

- 작업 실행의 정확성을 확인합니다.
- 워크플로에 품질 관리 프로세스를 구현합니다.
- 자체 검증 컴포넌트를 생성합니다.
- 성공/실패 상태 및 상세 피드백을 포함한 구조화된 검증 결과를 생성합니다.

이 서브그래프는 LLM이 워크플로의 끝에서 검증 도구를 호출하여 작업이 성공적으로 완료되었는지 확인하도록 보장합니다. 이는 이 검증이 최종 단계로 수행되도록 보장하며, 작업이 성공적으로 완료되었는지 여부를 나타내고 상세한 피드백을 제공하는 `VerifiedSubgraphResult`를 반환합니다. 예시는 다음과 같습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.agents.ext.agent.subgraphWithVerification

val runTestsTool = SayToUser
val analyzeTool = SayToUser
val readFileTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val verifyCode by subgraphWithVerification<String>(
    tools = listOf(runTestsTool, analyzeTool, readFileTool),
    llmModel = AnthropicModels.Sonnet_3_7
) { codeToVerify ->
    """
    You are a code reviewer. Please verify that the following code meets all requirements:
    1. It compiles without errors
    2. All tests pass
    3. It follows the project's coding standards

    Code to verify:
    $codeToVerify
    """
}
```
<!--- KNIT example-nodes-and-component-11.kt -->

## 사전 정의된 전략 및 일반적인 전략 패턴

프레임워크는 다양한 노드를 결합한 사전 정의된 전략을 제공합니다. 노드는 엣지를 사용하여 작업의 흐름을 정의하며, 각 엣지를 따라야 할 시점을 지정하는 조건이 함께 제공됩니다.

필요한 경우 이러한 전략을 에이전트 워크플로에 통합할 수 있습니다.

### 단일 실행 전략

단일 실행 전략은 에이전트가 입력을 한 번 처리하고 결과를 반환하는 비대화형 사용 사례를 위해 설계되었습니다.

복잡한 로직이 필요하지 않은 간단한 프로세스를 실행해야 할 때 이 전략을 사용할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*

-->
```kotlin

public fun singleRunStrategy(): AIAgentStrategy<String, String> = strategy("single_run") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```
<!--- KNIT example-nodes-and-component-12.kt -->

### 도구 기반 전략

도구 기반 전략은 특정 작업을 수행하기 위해 도구에 크게 의존하는 워크플로를 위해 설계되었습니다. 일반적으로 LLM 결정에 따라 도구를 실행하고 결과를 처리합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.entity.AIAgentStrategy
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.tools.ToolRegistry

-->
```kotlin
fun toolBasedStrategy(name: String, toolRegistry: ToolRegistry): AIAgentStrategy<String, String> {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        // Define the flow of the agent
        edge(nodeStart forwardTo nodeSendInput)

        // If the LLM responds with a message, finish
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // If the LLM calls a tool, execute it
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // Send the tool result back to the LLM
        edge(nodeExecuteTool forwardTo nodeSendToolResult)

        // If the LLM calls another tool, execute it
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the LLM responds with a message, finish
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```
<!--- KNIT example-nodes-and-component-13.kt -->

### 스트리밍 데이터 전략

스트리밍 데이터 전략은 LLM으로부터 스트리밍 데이터를 처리하도록 설계되었습니다. 일반적으로 스트리밍 데이터를 요청하고, 이를 처리하며, 처리된 데이터로 도구를 호출할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi08.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
    // Describe the node containing the output stream parsing
    val getMdOutput by node<String, List<Book>> { booksDescription ->
        val books = mutableListOf<Book>()
        val mdDefinition = markdownBookDefinition()

        llm.writeSession {
            updatePrompt { user(booksDescription) }
            // Initiate the response stream in the form of the definition `mdDefinition`
            val markdownStream = requestLLMStreaming(mdDefinition)
            // Call the parser with the result of the response stream and perform actions with the result
            parseMarkdownStreamToBooks(markdownStream).collect { book ->
                books.add(book)
                println("Parsed Book: ${book.title} by ${book.author}")
            }
        }

        books
    }
    // Describe the agent's graph making sure the node is accessible
    edge(nodeStart forwardTo getMdOutput)
    edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-nodes-and-component-14.kt -->