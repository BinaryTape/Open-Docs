## 서브그래프 생성 및 구성

다음 섹션에서는 에이전트 워크플로(agentic workflows)를 위한 서브그래프 생성 시 사용할 수 있는 코드 템플릿과 일반적인 패턴을 제공합니다.

### 기본 서브그래프 생성

커스텀 서브그래프는 일반적으로 다음과 같은 패턴을 사용하여 생성됩니다:

* 지정된 도구 선택 전략(tool selection strategy)을 사용하는 서브그래프:
<!--- INCLUDE
import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
import ai.koog.agents.core.dsl.builder.strategy

typealias StrategyInput = Unit
typealias StrategyOutput = Unit

typealias Input = Unit
typealias Output = Unit

val str = 
-->
```kotlin
strategy<StrategyInput, StrategyOutput>("strategy-name") {
    val subgraphIdentifier by subgraph<Input, Output>(
        name = "subgraph-name",
        toolSelectionStrategy = ToolSelectionStrategy.ALL
    ) {
        // 이 서브그래프를 위한 노드와 에지 정의
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

* 지정된 도구 목록(정의된 도구 레지스트리의 도구 하위 집합)을 사용하는 서브그래프:
<!--- INCLUDE
import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias StrategyInput = Unit
typealias StrategyOutput = Unit

typealias Input = Unit
typealias Output = Unit

val firstTool = SayToUser
val secondTool = AskUser

val str = 
-->
```kotlin
strategy<StrategyInput, StrategyOutput>("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name", 
       tools = listOf(firstTool, secondTool)
   ) {
        // 이 서브그래프를 위한 노드와 에지 정의
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

매개변수 및 매개변수 값에 대한 자세한 내용은 `subgraph` [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph)를 참고하세요. 도구에 대한 자세한 내용은 [도구(Tools)](tools-overview.md)를 참고하세요.

다음 코드 예제는 커스텀 서브그래프의 실제 구현 방식을 보여줍니다:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

val firstTool = SayToUser
val secondTool = AskUser

val str = 
-->
```kotlin
strategy<String, String>("my-strategy") {
   val mySubgraph by subgraph<String, String>(
      tools = listOf(firstTool, secondTool)
   ) {
        // 이 서브그래프를 위한 노드와 에지 정의
        val sendInput by nodeLLMRequest()
        val executeToolCall by nodeExecuteTool()
        val sendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo sendInput)
        edge(sendInput forwardTo executeToolCall onToolCall { true })
        edge(executeToolCall forwardTo sendToolResult)
        edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
    }
}
```
<!--- KNIT example-custom-subgraphs-03.kt -->

### 서브그래프 내 도구 구성

서브그래프에 도구를 구성하는 방법에는 여러 가지가 있습니다:

* 서브그래프 정의에서 직접 구성:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser

val str = strategy<String, String>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = listOf(AskUser)
 ) {
    // 서브그래프 정의
 }
```
<!--- KNIT example-custom-subgraphs-04.kt -->

* 도구 레지스트리(tool registry)에서 구성:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolRegistry

val toolRegistry = ToolRegistry.EMPTY
val str = strategy<String, String>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val mySubgraph by subgraph<String, String>(
    tools = listOf(toolRegistry.getTool("AskUser"))
) {
    // 서브그래프 정의
}
```
<!--- KNIT example-custom-subgraphs-05.kt -->

* 실행 중 동적으로 구성:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val str = strategy<String, String>("my-strategy") {
    val node by node<Unit, Unit>("node_name") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 도구 세트 생성
this.llm.writeSession {
    tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
}
```
<!--- KNIT example-custom-subgraphs-06.kt -->

## 고급 서브그래프 기법

### 멀티 파트 전략(Multi-part strategies)

복잡한 워크플로는 각 프로세스의 특정 부분을 처리하는 여러 서브그래프로 나눌 수 있습니다:
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias A = Unit
typealias B = Unit
typealias C = Unit

val firstTool = AskUser
val secondTool = SayToUser

val str =
-->
```kotlin
strategy("complex-workflow") {
   val inputProcessing by subgraph<String, A>(
   ) {
      // 초기 입력 처리
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 처리된 입력을 바탕으로 추론 수행
   }

   val toolRun by subgraph<B, C>(
      // 도구 레지스트리에서 선택된 도구의 하위 집합(선택 사항)
      tools = listOf(firstTool, secondTool)
   ) {
      // 추론을 바탕으로 도구 실행
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 도구 결과를 바탕으로 응답 생성
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```
<!--- KNIT example-custom-subgraphs-07.kt -->

## 베스트 프랙티스

서브그래프를 작업할 때 다음 베스트 프랙티스를 따르세요:

1. **복잡한 워크플로를 서브그래프로 분할**: 각 서브그래프는 명확하고 집중된 책임을 가져야 합니다.

2. **필요한 컨텍스트만 전달**: 후속 서브그래프가 올바르게 작동하는 데 필요한 정보만 전달하세요.

3. **서브그래프 의존성 문서화**: 각 서브그래프가 이전 서브그래프로부터 기대하는 것과 후속 서브그래프에 제공하는 것을 명확하게 문서화하세요.

4. **서브그래프 개별 테스트**: 전략에 통합하기 전에 각 서브그래프가 다양한 입력값에 대해 올바르게 작동하는지 확인하세요.

5. **토큰 사용량 고려**: 특히 서브그래프 간에 대량의 히스토리를 전달할 때 토큰 사용량에 주의하세요.

## 트러블슈팅

### 도구를 사용할 수 없는 경우

서브그래프에서 도구를 사용할 수 없는 경우:

- 도구가 도구 레지스트리에 올바르게 등록되었는지 확인하세요.

### 서브그래프가 정의된 예상 순서대로 실행되지 않는 경우

서브그래프가 정의된 순서대로 실행되지 않는 경우:

- 전략 정의를 확인하여 서브그래프가 올바른 순서로 나열되어 있는지 확인하세요.
- 각 서브그래프가 출력을 다음 서브그래프로 올바르게 전달하고 있는지 확인하세요.
- 서브그래프가 나머지 서브그래프와 연결되어 있으며 시작(nodeStart) 및 종료(nodeFinish) 지점에서 도달 가능한지 확인하세요. 조건부 에지(conditional edges)를 사용할 때는 모든 가능한 조건을 충족하여 서브그래프나 노드에서 멈추지 않고 순서대로 진행될 수 있도록 주의하세요.

## 예제

다음 예제는 실제 시나리오에서 에이전트 전략을 생성하기 위해 서브그래프가 어떻게 사용되는지 보여줍니다.
이 코드 예제에는 `researchSubgraph`, `planSubgraph`, `executeSubgraph`라는 세 가지 서브그래프가 정의되어 있으며, 각 서브그래프는 어시스턴트 흐름 내에서 명확하고 구별되는 목적을 가집니다.
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.prompt.dsl.prompt
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

class WebSearchTool: SimpleTool<WebSearchTool.Args>(
    argsSerializer = Args.serializer(),
    name = "web_search",
    description = "Search on the web"
) {
    @Serializable
    class Args(val query: String)

    override suspend fun execute(args: Args): String {
        return "Searching for ${args.query} on the web..."
    }
}

class DoAction: SimpleTool<DoAction.Args>(
    argsSerializer = Args.serializer(),
    name = "do_action",
    description = "Do something"
) {
    @Serializable
    class Args(val action: String)

    override suspend fun execute(args: Args): String {
        return "Doing action..."
    }
}

class DoAnotherAction: SimpleTool<DoAnotherAction.Args>(
    argsSerializer = Args.serializer(),
    name = "do_another_action",
    description = "Do something other"
) {
    @Serializable
    class Args(val action: String)

    override suspend fun execute(args: Args): String {
        return "Doing another action..."
    }
}
-->
```kotlin
// 에이전트 전략 정의
val strategy = strategy<String, String>("assistant") {
    // 도구 호출을 포함하는 서브그래프

    val researchSubgraph by subgraph<String, String>(
        "research_subgraph",
        tools = listOf(WebSearchTool())
    ) {
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeCallLLM)
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val planSubgraph by subgraph(
        "plan_subgraph",
        tools = listOf()
    ) {
        val nodeUpdatePrompt by node<String, Unit> { research ->
            llm.writeSession {
                rewritePrompt {
                    prompt("research_prompt") {
                        system(
                            "You are given a problem and some research on how it can be solved." +
                                    "Make step by step a plan on how to solve given task."
                        )
                        user("Research: $research")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val executeSubgraph by subgraph<String, String>(
        "execute_subgraph",
        tools = listOf(DoAction(), DoAnotherAction()),
    ) {
        val nodeUpdatePrompt by node<String, Unit> { plan ->
            llm.writeSession {
                rewritePrompt {
                    prompt("execute_prompt") {
                        system(
                            "You are given a task and detailed plan how to execute it." +
                                    "Perform execution by calling relevant tools."
                        )
                        user("Execute: $plan")
                        user("Plan: $plan")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    nodeStart then researchSubgraph then planSubgraph then executeSubgraph then nodeFinish
}
```
<!--- KNIT example-custom-subgraphs-08.kt -->