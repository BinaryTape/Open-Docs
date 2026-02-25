# 기능형 에이전트 (Functional agents)

기능형 에이전트는 복잡한 전략 그래프를 구축하지 않고도 작동하는 경량 AI 에이전트입니다.
대신, 에이전트 로직은 사용자 입력을 처리하고, LLM과 상호작용하며, 선택적으로 도구를 호출하고 최종 출력을 생성하는 람다 함수로 구현됩니다. 이 에이전트는 단일 LLM 호출을 수행하거나, 여러 LLM 호출을 순차적으로 처리하거나, 사용자 입력뿐만 아니라 LLM 및 도구 출력에 따라 루프를 실행할 수 있습니다.

!!! tip
    - 첫 번째 MVP로서 [기본 에이전트](basic-agents.md)를 이미 보유하고 있지만, 특정 작업에 한계가 느껴진다면 기능형 에이전트를 사용하여 커스텀 로직을 프로토타이핑해 보세요. 히스토리 압축 및 자동 상태 관리를 포함한 대부분의 Koog 기능을 그대로 사용하면서, 순수 코틀린(plain Kotlin)으로 커스텀 제어 흐름을 구현할 수 있습니다.
    - 프로덕션 수준의 요구 사항이 필요한 경우, 기능형 에이전트를 전략 그래프가 포함된 [복잡한 워크플로우 에이전트](complex-workflow-agents.md)로 리팩토링하세요. 이는 결함 허용(fault-tolerance)을 위한 제어 가능한 롤백이 포함된 지속성(persistence)과 중첩된 그래프 이벤트가 포함된 고급 OpenTelemetry 트레이싱을 제공합니다.

이 페이지에서는 최소 기능형 에이전트를 생성하고 도구(tools)를 사용하여 이를 확장하는 데 필요한 단계를 안내합니다.

## 사전 요구 사항

시작하기 전에 다음 사항을 확인하세요.

- 작동 중인 Kotlin/JVM 프로젝트.
- Java 17 이상 설치.
- AI 에이전트를 구현하는 데 사용되는 LLM 제공자의 유효한 API 키. 사용 가능한 모든 제공자 목록은 [LLM 제공자](llm-providers.md)를 참고하세요.
- (선택 사항) Ollama 제공자를 사용하는 경우 로컬에 Ollama가 설치되어 실행 중이어야 합니다.

!!! tip
    API 키를 저장할 때는 환경 변수나 보안 구성 관리 시스템을 사용하세요.
    소스 코드에 API 키를 직접 하드코딩하지 마십시오.

## 의존성 추가

`AIAgent` 클래스는 Koog에서 에이전트를 생성하기 위한 메인 클래스입니다.
클래스 기능을 사용하려면 빌드 구성에 다음 의존성을 포함하세요.

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
사용 가능한 모든 설치 방법은 [Koog 설치](getting-started.md#install-koog)를 참고하세요.

## 최소 기능형 에이전트 생성

최소 기능형 에이전트를 생성하려면 다음을 수행하세요.

1. 에이전트가 처리할 입력 및 출력 타입을 선택하고 그에 해당하는 `AIAgent<Input, Output>` 인스턴스를 생성합니다.
   이 가이드에서는 `AIAgent<String, String>`을 사용하며, 이는 에이전트가 `String`을 받고 반환함을 의미합니다.
2. 시스템 프롬프트, 프롬프트 실행기(prompt executor), LLM을 포함한 필수 파라미터를 제공합니다.
3. `functionalStrategy {...}` DSL 메서드로 감싼 람다 함수로 에이전트 로직을 정의합니다.

다음은 사용자 텍스트를 지정된 LLM으로 보내고 단일 어시스턴트 메시지를 반환하는 최소 기능형 에이전트의 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgent 인스턴스를 생성하고 시스템 프롬프트, 프롬프트 실행기, LLM을 제공합니다.
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 에이전트 로직 정의
        // 한 번의 LLM 호출 수행
        val response = requestLLM(input)
        // 응답에서 어시스턴트 메시지 내용을 추출하여 반환
        response.asAssistantMessage().content
    }
)

// 사용자 입력으로 에이전트를 실행하고 결과를 출력합니다.
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

에이전트는 다음과 같은 출력을 생성할 수 있습니다.

```
The answer to 12 × 9 is 108.
```

이 에이전트는 단일 LLM 호출을 수행하고 어시스턴트 메시지 내용을 반환합니다.
여러 개의 순차적인 LLM 호출을 처리하도록 에이전트 로직을 확장할 수 있습니다. 예를 들어:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// AIAgent 인스턴스를 생성하고 시스템 프롬프트, 프롬프트 실행기, LLM을 제공합니다.
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 에이전트 로직 정의
        // 사용자 입력을 기반으로 초기 초안을 생성하기 위한 첫 번째 LLM 호출
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // 초안 내용을 다시 프롬프트하여 개선하기 위한 두 번째 LLM 호출
        val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
        // 개선된 텍스트의 형식을 지정하고 최종 결과물을 반환하기 위한 마지막 LLM 호출
        requestLLM("Format the result as bold.").asAssistantMessage().content
    }
)

// 사용자 입력으로 에이전트를 실행하고 결과를 출력합니다.
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

에이전트는 다음과 같은 출력을 생성할 수 있습니다.

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## 도구(Tools) 추가

많은 경우 기능형 에이전트는 데이터 읽기 및 쓰기나 API 호출과 같은 특정 작업을 완료해야 합니다.
Koog에서는 이러한 기능을 도구(tools)로 노출하고 LLM이 에이전트 로직 내에서 이를 호출하도록 할 수 있습니다.

이 장에서는 위에서 생성한 최소 기능형 에이전트를 가져와 도구를 사용하여 에이전트 로직을 확장하는 방법을 보여줍니다.

1) 어노테이션 기반 도구를 생성합니다. 자세한 내용은 [어노테이션 기반 도구](annotation-based-tools.md)를 참고하세요.

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

사용 가능한 도구에 대해 더 알아보려면 [도구 개요](tools-overview.md)를 참고하세요.

2) 도구를 에이전트에서 사용할 수 있도록 등록합니다.

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

3) LLM이 사용 가능한 도구를 요청하고 사용할 수 있도록 도구 레지스트리를 에이전트에 전달합니다.

4) 도구 호출을 식별하고, 요청된 도구를 실행하고, 그 결과를 다시 LLM에 보내고, 더 이상 도구 호출이 남지 않을 때까지 이 과정을 반복하도록 에이전트 로직을 확장합니다.

!!! note
    LLM이 도구 호출을 계속 수행하는 동안에만 루프를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    strategy = functionalStrategy { input -> // 도구 호출이 확장된 에이전트 로직 정의
        // 사용자 입력을 LLM으로 전송
        var responses = requestLLMMultiple(input)

        // LLM이 도구를 요청하는 동안에만 루프 실행
        while (responses.containsToolCalls()) {
            // 응답에서 도구 호출 추출
            val pendingCalls = extractToolCalls(responses)
            // 도구 실행 및 결과 반환
            val results = executeMultipleTools(pendingCalls)
            // 도구 결과를 다시 LLM으로 전송. LLM은 더 많은 도구를 호출하거나 최종 출력을 반환할 수 있음
            responses = sendMultipleToolResults(results)
        }

        // 도구 호출이 더 이상 없으면, 응답에서 어시스턴트 메시지 내용을 추출하여 반환
        responses.single().asAssistantMessage().content
    }
)

// 사용자 입력으로 에이전트를 실행하고 결과를 출력합니다.
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

에이전트는 다음과 같은 출력을 생성할 수 있습니다.

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 다음 단계

- [구조화된 출력 API](structured-output.md)를 사용하여 구조화된 데이터를 반환하는 방법을 알아보세요.
- 에이전트에 더 많은 [도구](tools-overview.md)를 추가하는 실험을 해보세요.
- [EventHandler](agent-events.md) 기능을 사용하여 관찰 가능성(observability)을 개선하세요.
- [히스토리 압축](history-compression.md)을 통해 장시간 이어지는 대화를 처리하는 방법을 알아보세요.