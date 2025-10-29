# LLM 세션 및 수동 기록 관리

이 페이지에서는 LLM 세션에 대한 자세한 정보를 제공하며, 읽기 및 쓰기 세션으로 작업하는 방법, 대화 기록을 관리하는 방법, 언어 모델에 요청을 보내는 방법을 포함합니다.

## 소개

LLM 세션은 언어 모델(LLM)과 상호작용하는 구조화된 방법을 제공하는 기본적인 개념입니다. 이들은 대화 기록을 관리하고, LLM에 대한 요청을 처리하며, 도구를 실행하고 응답을 처리하기 위한 일관된 인터페이스를 제공합니다.

## LLM 세션 이해하기

LLM 세션은 언어 모델과 상호작용하기 위한 컨텍스트를 나타냅니다. 다음을 캡슐화합니다:

- 대화 기록 (프롬프트)
- 사용 가능한 도구
- LLM에 요청을 보내는 메서드
- 대화 기록을 업데이트하는 메서드
- 도구를 실행하는 메서드

세션은 `AIAgentLLMContext` 클래스에 의해 관리되며, 이 클래스는 읽기 및 쓰기 세션을 생성하기 위한 메서드를 제공합니다.

### 세션 유형

Koog 프레임워크는 두 가지 유형의 세션을 제공합니다:

1.  **쓰기 세션** (`AIAgentLLMWriteSession`): 프롬프트와 도구를 수정하고, LLM 요청을 보내고, 도구를 실행할 수 있도록 허용합니다. 쓰기 세션에서 변경된 내용은 LLM 컨텍스트에 다시 유지됩니다.

2.  **읽기 세션** (`AIAgentLLMReadSession`): 프롬프트와 도구에 대한 읽기 전용 접근을 제공합니다. 이는 변경 없이 현재 상태를 검사하는 데 유용합니다.

주요 차이점은 쓰기 세션은 대화 기록을 수정할 수 있는 반면, 읽기 세션은 수정할 수 없다는 것입니다.

### 세션 라이프사이클

세션에는 정의된 라이프사이클이 있습니다:

1.  **생성**: `llm.writeSession { ... }` 또는 `llm.readSession { ... }`을 사용하여 세션이 생성됩니다.
2.  **활성 단계**: 람다 블록이 실행되는 동안 세션이 활성화됩니다.
3.  **종료**: 람다 블록이 완료되면 세션은 자동으로 닫힙니다.

세션은 `AutoCloseable` 인터페이스를 구현하여 예외가 발생하더라도 제대로 정리되도록 보장합니다.

## LLM 세션 사용하기

### 세션 생성하기

세션은 `AIAgentLLMContext` 클래스의 확장 함수를 사용하여 생성됩니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating a write session
llm.writeSession {
    // Session code here
}

// Creating a read session
llm.readSession {
    // Session code here
}
```
<!--- KNIT example-sessions-01.kt -->

이 함수들은 세션의 컨텍스트 내에서 실행되는 람다 블록을 받습니다. 블록이 완료되면 세션은 자동으로 닫힙니다.

### 세션 스코프 및 스레드 안정성

세션은 스레드 안정성을 보장하기 위해 읽기-쓰기 잠금(read-write lock)을 사용합니다:

- 여러 읽기 세션이 동시에 활성화될 수 있습니다.
- 한 번에 하나의 쓰기 세션만 활성화될 수 있습니다.
- 쓰기 세션은 다른 모든 세션(읽기 및 쓰기 모두)을 차단합니다.

이는 동시 수정으로 인해 대화 기록이 손상되지 않도록 보장합니다.

### 세션 속성 접근하기

세션 내에서 프롬프트와 도구에 접근할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.readSession {
    val messageCount = prompt.messages.size
    val availableTools = tools.map { it.name }
}
```
<!--- KNIT example-sessions-02.kt -->

쓰기 세션에서는 이러한 속성을 수정할 수도 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolDescriptor

val newTools = listOf<ToolDescriptor>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Modify the prompt
    appendPrompt {
        user("New user message")
    }

    // Modify the tools
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

자세한 내용은 [AIAgentLLMReadSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-read-session/index.html) 및 [AIAgentLLMWriteSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)의 상세 API 레퍼런스를 참조하십시오.

## LLM 요청 보내기

### 기본 요청 메서드

LLM 요청을 보내는 가장 일반적인 메서드는 다음과 같습니다:

1.  `requestLLM()`: 현재 프롬프트와 도구로 LLM에 요청을 보내 단일 응답을 반환합니다.

2.  `requestLLMMultiple()`: 현재 프롬프트와 도구로 LLM에 요청을 보내 여러 응답을 반환합니다.

3.  `requestLLMWithoutTools()`: 현재 프롬프트로 LLM에 요청을 보내지만 도구 없이 단일 응답을 반환합니다.

4.  `requestLLMForceOneTool`: 현재 프롬프트와 도구로 LLM에 요청을 보내 하나의 도구 사용을 강제합니다.

5.  `requestLLMOnlyCallingTools`: 도구만 사용하여 처리되어야 하는 LLM에 요청을 보냅니다.

예시:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a request with tools enabled
    val response = requestLLM()

    // Make a request without tools
    val responseWithoutTools = requestLLMWithoutTools()

    // Make a request that returns multiple responses
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### 요청 작동 방식

LLM 요청은 요청 메서드 중 하나를 명시적으로 호출할 때 이루어집니다. 이해해야 할 핵심 사항은 다음과 같습니다:

1.  **명시적 호출**: 요청은 `requestLLM()`, `requestLLMWithoutTools()` 등과 같은 메서드를 호출할 때만 발생합니다.
2.  **즉시 실행**: 요청 메서드를 호출하면 요청이 즉시 이루어지며, 응답이 수신될 때까지 메서드는 블록됩니다.
3.  **자동 기록 업데이트**: 쓰기 세션에서는 응답이 대화 기록에 자동으로 추가됩니다.
4.  **암시적 요청 없음**: 시스템은 암시적 요청을 하지 않습니다. 요청 메서드를 명시적으로 호출해야 합니다.

### 도구를 사용한 요청 메서드

도구를 활성화한 상태에서 요청을 보낼 때, LLM은 텍스트 응답 대신 도구 호출로 응답할 수 있습니다. 요청 메서드는 이를 투명하게 처리합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    val response = requestLLM()

    // The response might be a tool call or a text response
    if (response is Message.Tool.Call) {
        // Handle tool call
    } else {
        // Handle text response
    }
}
```
<!--- KNIT example-sessions-05.kt -->

실제로 에이전트 그래프가 이 라우팅을 자동으로 처리하므로 응답 유형을 수동으로 확인할 필요는 없습니다.

### 구조화된 및 스트리밍 요청

더 고급 사용 사례를 위해 플랫폼은 구조화된 및 스트리밍 요청을 위한 메서드를 제공합니다:

1.  `requestLLMStructured()`: LLM이 특정 구조화된 형식으로 응답을 제공하도록 요청합니다.

2.  `requestLLMStructuredOneShot()`: `requestLLMStructured()`와 유사하지만 재시도나 수정이 없습니다.

3.  `requestLLMStreaming()`: LLM에 스트리밍 요청을 보내 응답 청크의 흐름을 반환합니다.

예시:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleParallelNodeExecution07.JokeRating

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a structured request
    val structuredResponse = requestLLMStructured<JokeRating>()

    // Make a streaming request
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // Process each chunk as it arrives
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 대화 기록 관리하기

### 프롬프트 업데이트하기

쓰기 세션에서는 `appendPrompt` 메서드를 사용하여 프롬프트(대화 기록)에 메시지를 추가할 수 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlinx.datetime.Clock

val myToolResult = Message.Tool.Result(
    id = "",
    tool = "",
    content = "",
    metaInfo = RequestMetaInfo(Clock.System.now())
)

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    appendPrompt {
        // Add a system message
        system("You are a helpful assistant.")

        // Add a user message
        user("Hello, can you help me with a coding question?")

        // Add an assistant message
        assistant("Of course! What's your question?")

        // Add a tool result
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

또한 `rewritePrompt` 메서드를 사용하여 프롬프트를 완전히 다시 작성할 수도 있습니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val filteredMessages = emptyList<Message>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    rewritePrompt { oldPrompt ->
        // Create a new prompt based on the old one
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### 응답 시 자동 기록 업데이트

쓰기 세션에서 LLM 요청을 보내면 응답이 대화 기록에 자동으로 추가됩니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Add a user message
    appendPrompt {
        user("What's the capital of France?")
    }

    // Make a request – the response is automatically added to the history
    val response = requestLLM()

    // The prompt now includes both the user message and the model's response
}
```
<!--- KNIT example-sessions-09.kt -->

이러한 자동 기록 업데이트는 쓰기 세션의 핵심 기능으로, 대화가 자연스럽게 흘러가도록 보장합니다.

### 기록 압축

장기 실행 대화의 경우, 기록이 커져 많은 토큰을 소비할 수 있습니다. 플랫폼은 기록 압축을 위한 메서드를 제공합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Compress the history using a TLDR approach
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

또한 전략 그래프에서 `nodeLLMCompressHistory` 노드를 사용하여 특정 지점에서 기록을 압축할 수도 있습니다.

기록 압축 및 압축 전략에 대한 자세한 내용은 [기록 압축](history-compression.md)을 참조하십시오.

## 세션에서 도구 실행하기

### 도구 호출하기

쓰기 세션은 도구 호출을 위한 여러 메서드를 제공합니다:

1.  `callTool(tool, args)`: 참조로 도구를 호출합니다.

2.  `callTool(toolName, args)`: 이름으로 도구를 호출합니다.

3.  `callTool(toolClass, args)`: 클래스로 도구를 호출합니다.

4.  `callToolRaw(toolName, args)`: 이름으로 도구를 호출하고 원시 문자열 결과를 반환합니다.

예시:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser

val myTool = AskUser
val myArgs = AskUser.Args("this is a string")

typealias MyTool = AskUser

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Call a tool by reference
    val result = callTool(myTool, myArgs)

    // Call a tool by name
    val result2 = callTool("myToolName", myArgs)

    // Call a tool by class
    val result3 = callTool(MyTool::class, myArgs)

    // Call a tool and get the raw result
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### 병렬 도구 실행

여러 도구를 병렬로 실행하려면 쓰기 세션은 `Flow`에 대한 확장 함수를 제공합니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import kotlinx.coroutines.flow.flow

typealias MyTool = AskUser

val data = ""
fun parseDataToArgs(data: String) = flow { emit(AskUser.Args(data)) }

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Run tools in parallel
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // Process each result
    }

    // Run tools in parallel and get raw results
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // Process each raw result
    }
}
```
<!--- KNIT example-sessions-12.kt -->

이는 많은 양의 데이터를 효율적으로 처리하는 데 유용합니다.

## 모범 사례

LLM 세션을 사용할 때는 다음 모범 사례를 따르십시오:

1.  **올바른 세션 유형 사용**: 대화 기록을 수정해야 할 때는 쓰기 세션을 사용하고, 읽기만 필요할 때는 읽기 세션을 사용하십시오.

2.  **세션을 짧게 유지**: 세션은 특정 작업에 집중하고 가능한 한 빨리 닫아 리소스를 해제해야 합니다.

3.  **예외 처리**: 리소스 누수를 방지하기 위해 세션 내에서 예외를 처리해야 합니다.

4.  **기록 크기 관리**: 장기 실행 대화의 경우 토큰 사용량을 줄이기 위해 기록 압축을 사용하십시오.

5.  **고수준 추상화 선호**: 가능하면 노드 기반 API를 사용하십시오. 예를 들어, 세션과 직접 작업하는 대신 `nodeLLMRequest`를 사용하십시오.

6.  **스레드 안정성 유의**: 쓰기 세션은 다른 세션을 차단하므로 쓰기 작업을 가능한 한 짧게 유지해야 합니다.

7.  **복잡한 데이터에는 구조화된 요청 사용**: LLM이 구조화된 데이터를 반환하도록 해야 할 경우, 자유 형식 텍스트를 파싱하는 대신 `requestLLMStructured`를 사용하십시오.

8.  **긴 응답에는 스트리밍 사용**: 긴 응답의 경우, 응답이 도착하는 대로 처리하기 위해 `requestLLMStreaming`을 사용하십시오.

## 문제 해결

### 세션이 이미 닫힘

만약 `Cannot use session after it was closed`와 같은 오류가 발생한다면, 이는 람다 블록이 완료된 후에 세션을 사용하려고 시도하고 있다는 의미입니다. 모든 세션 작업이 세션 블록 내에서 수행되는지 확인하십시오.

### 기록이 너무 큼

기록이 너무 커져 너무 많은 토큰을 소비하는 경우, 기록 압축 기술을 사용하십시오:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
}
```
<!--- KNIT example-sessions-13.kt -->

자세한 내용은 [기록 압축](history-compression.md)을 참조하십시오.

### 도구를 찾을 수 없음

도구를 찾을 수 없다는 오류가 발생하면 다음을 확인하십시오:

- 도구가 도구 레지스트리에 올바르게 등록되어 있는지.
- 올바른 도구 이름 또는 클래스를 사용하고 있는지.

## API 문서

자세한 내용은 [AIAgentLLMSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-session/index.html) 및 [AIAgentLLMContext](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.context/-a-i-agent-l-l-m-context/index.html) 전체 레퍼런스를 참조하십시오.