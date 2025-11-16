# 기능형 에이전트

기능형 에이전트는 복잡한 전략 그래프를 구축하지 않고 작동하는 경량형 AI 에이전트입니다.
대신, 에이전트 로직은 사용자 입력을 처리하고, LLM과 상호 작용하며, 선택적으로 도구를 호출하고, 최종 결과물을 생성하는 람다 함수로 구현됩니다. 이는 단일 LLM 호출을 수행하거나, 여러 LLM 호출을 순차적으로 처리하거나, 사용자 입력뿐만 아니라 LLM 및 도구 출력에 기반하여 반복(loop)할 수 있습니다.

!!! tip
    - 첫 번째 MVP로 [기본 에이전트](basic-agents.md)를 이미 가지고 있지만, 작업별 제한 사항에 부딪히는 경우, 기능형 에이전트를 사용하여 사용자 지정 로직을 프로토타입으로 만드세요. 기록 압축 및 자동 상태 관리(state management)를 포함한 대부분의 Koog 기능을 사용하면서도 일반 코틀린으로 사용자 지정 제어 흐름(control flow)을 구현할 수 있습니다.
    - 프로덕션 수준의 요구사항을 위해서는 기능형 에이전트를 전략 그래프를 사용하는 [복잡한 워크플로 에이전트](complex-workflow-agents.md)로 리팩터링(refactor)하세요. 이는 내결함성(fault-tolerance)을 위한 제어 가능한 롤백(rollback)을 통한 영속성(persistence)과 중첩된 그래프 이벤트(nested graph event)를 포함한 고급 OpenTelemetry 트레이싱(tracing)을 제공합니다.

이 페이지에서는 최소한의 기능형 에이전트를 생성하고 도구를 사용하여 확장하는 데 필요한 단계를 안내합니다.

## 사전 요구 사항

시작하기 전에 다음 사항을 확인하세요.

-   작동하는 Kotlin/JVM 프로젝트.
-   Java 17+ 설치.
-   AI 에이전트 구현에 사용되는 LLM 제공업체의 유효한 API 키. 사용 가능한 모든 제공업체 목록은 [LLM 제공업체(LLM providers)](llm-providers.md)를 참조하세요.
-   (선택 사항) 해당 제공업체를 사용하는 경우 Ollama가 로컬에 설치 및 실행 중.

!!! tip
    API 키는 환경 변수 또는 보안 구성 관리 시스템을 사용하여 저장하세요.
    소스 코드에 API 키를 직접 하드코딩(hardcoding)하는 것을 피하세요.

## 의존성 추가

`AIAgent` 클래스는 Koog에서 에이전트를 생성하기 위한 메인 클래스입니다.
클래스 기능을 사용하려면 빌드 구성에 다음 의존성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
사용 가능한 모든 설치 방법은 [Koog 설치(Install Koog)](getting-started.md#install-koog)를 참조하세요.

## 최소 기능형 에이전트 생성

최소 기능형 에이전트를 생성하려면 다음을 수행하세요.

1.  에이전트가 처리할 입력 및 출력 타입을 선택하고 해당 `AIAgent<Input, Output>` 인스턴스를 생성합니다.
    이 가이드에서는 `String`을 수신하고 반환하는 `AIAgent<String, String>`을 사용합니다.
2.  시스템 프롬프트, 프롬프트 실행기(prompt executor), LLM을 포함한 필수 매개변수를 제공합니다.
3.  `functionalStrategy {...}` DSL 메서드로 래핑된 람다 함수로 에이전트 로직을 정의합니다.

다음은 사용자 텍스트를 지정된 LLM으로 보내고 단일 어시스턴트 메시지를 반환하는 최소 기능형 에이전트의 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an AIAgent instance and provide a system prompt, prompt executor, and LLM
// AIAgent 인스턴스를 생성하고 시스템 프롬프트, 프롬프트 실행기, LLM을 제공합니다.
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // Define the agent logic
        // 에이전트 로직을 정의합니다.
        // Make one LLM call
        // LLM 호출을 한 번 수행합니다.
        val response = requestLLM(input)
        // Extract and return the assistant message content from the response
        // 응답에서 어시스턴트 메시지 내용을 추출하여 반환합니다.
        response.asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
// 사용자 입력을 사용하여 에이전트를 실행하고 결과를 출력합니다.
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

에이전트는 다음 출력을 생성할 수 있습니다.

```
The answer to 12 × 9 is 108.
```

이 에이전트는 단일 LLM 호출을 수행하고 어시스턴트 메시지 내용을 반환합니다.
에이전트 로직을 확장하여 여러 순차적인 LLM 호출을 처리할 수 있습니다. 예를 들어:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an AIAgent instance and provide a system prompt, prompt executor, and LLM
// AIAgent 인스턴스를 생성하고 시스템 프롬프트, 프롬프트 실행기, LLM을 제공합니다.
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // Define the agent logic
        // 에이전트 로직을 정의합니다.
        // The first LLM call to produce an initial draft based on the user input
        // 사용자 입력에 기반한 초기 초안을 생성하는 첫 번째 LLM 호출
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // The second LLM call to improve the draft by prompting the LLM again with the draft content
        // 초안 내용을 사용하여 LLM에 다시 프롬프트하여 초안을 개선하는 두 번째 LLM 호출
        val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
        // The final LLM call to format the improved text and return the final formatted result
        // 개선된 텍스트를 포맷하고 최종 포맷된 결과를 반환하는 최종 LLM 호출
        requestLLM("Format the result as bold.").asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
// 사용자 입력을 사용하여 에이전트를 실행하고 결과를 출력합니다.
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

에이전트는 다음 출력을 생성할 수 있습니다.

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## 도구 추가

많은 경우, 기능형 에이전트는 데이터 읽기 및 쓰기 또는 API 호출과 같은 특정 작업을 완료해야 합니다.
Koog에서는 이러한 기능을 도구로 노출하고 LLM이 에이전트 로직 내에서 도구를 호출하도록 합니다.

이 장에서는 위에 생성된 최소 기능형 에이전트를 가져와 도구를 사용하여 에이전트 로직을 확장하는 방법을 시연합니다.

1) 애너테이션 기반 도구를 생성합니다. 자세한 내용은 [애너테이션 기반 도구(Annotation-based tools)](annotation-based-tools.md)를 참조하세요.

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
@LLMDescription("Simple multiplier")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("Multiplies two numbers and returns the result")
    fun multiply(a: Int, b: Int): Int {
        val result = a * b
        return result
    }
}
```
<!--- KNIT example-functional-agent-03.kt -->

사용 가능한 도구에 대해 자세히 알아보려면 [도구 개요(Tool overview)](tools-overview.md)를 참조하세요.

2) 도구를 등록하여 에이전트가 사용할 수 있도록 합니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val toolRegistry = ToolRegistry {
    tools(MathTools())
}
```
<!--- KNIT example-functional-agent-04.kt -->

3) LLM이 사용 가능한 도구를 요청하고 사용할 수 있도록 툴 레지스트리(tool registry)를 에이전트에 전달합니다.

4) 도구 호출을 식별하고, 요청된 도구를 실행하고, 그 결과를 LLM으로 다시 전송하고, 더 이상 도구 호출이 남아 있지 않을 때까지 이 프로세스를 반복하도록 에이전트 로직을 확장합니다.

!!! note
    LLM이 계속 도구 호출을 발행하는 경우에만 루프를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.containsToolCalls
import ai.koog.agents.core.dsl.extension.executeMultipleTools
import ai.koog.agents.core.dsl.extension.extractToolCalls
import ai.koog.agents.core.dsl.extension.requestLLMMultiple
import ai.koog.agents.core.dsl.extension.sendMultipleToolResults
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val toolRegistry = ToolRegistry {
            tools(MathTools())
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val mathWithTools = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant. When multiplication is needed, use the multiplication tool.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    toolRegistry = toolRegistry,
    strategy = functionalStrategy { input -> // Define the agent logic extended with tool calls
        // 도구 호출로 확장된 에이전트 로직을 정의합니다.
        // Send the user input to the LLM
        // 사용자 입력을 LLM으로 보냅니다.
        var responses = requestLLMMultiple(input)

        // Only loop while the LLM requests tools
        // LLM이 도구를 요청하는 동안에만 루프를 실행합니다.
        while (responses.containsToolCalls()) {
            // Extract tool calls from the response
            // 응답에서 도구 호출을 추출합니다.
            val pendingCalls = extractToolCalls(responses)
            // Execute the tools and return the results
            // 도구를 실행하고 결과를 반환합니다.
            val results = executeMultipleTools(pendingCalls)
            // Send the tool results back to the LLM. The LLM may call more tools or return a final output
            // 도구 결과를 LLM으로 다시 보냅니다. LLM은 더 많은 도구를 호출하거나 최종 결과물을 반환할 수 있습니다.
            responses = sendMultipleToolResults(results)
        }

        // When no tool calls remain, extract and return the assistant message content from the response
        // 더 이상 도구 호출이 남아 있지 않으면, 응답에서 어시스턴트 메시지 내용을 추출하여 반환합니다.
        responses.single().asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
// 사용자 입력을 사용하여 에이전트를 실행하고 결과를 출력합니다.
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

에이전트는 다음 출력을 생성할 수 있습니다.

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 다음 단계

-   [구조화된 출력 API(Structured output API)](structured-output.md)를 사용하여 구조화된 데이터를 반환하는 방법을 알아보세요.
-   에이전트에 더 많은 [도구](tools-overview.md)를 추가하는 실험을 해보세요.
-   [EventHandler](agent-events.md) 기능으로 가시성(observability)을 개선하세요.
-   [기록 압축(History compression)](history-compression.md)으로 장기 실행 대화(long-running conversation)를 처리하는 방법을 알아보세요.