## 서브그래프 생성 및 구성

다음 섹션에서는 에이전트 워크플로를 위한 서브그래프 생성에 필요한 코드 템플릿과 일반적인 패턴을 제공합니다.

### 기본 서브그래프 생성

사용자 지정 서브그래프는 일반적으로 다음 패턴을 사용하여 생성됩니다:

* 특정 도구 선택 전략을 사용하는 서브그래프:
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
        // 이 서브그래프에 대한 노드와 엣지를 정의합니다.
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

* 특정 도구 목록(정의된 도구 레지스트리에서 가져온 도구의 부분 집합)을 사용하는 서브그래프:
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
        // 이 서브그래프에 대한 노드와 엣지를 정의합니다.
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

매개변수 및 매개변수 값에 대한 자세한 내용은 `subgraph` [API 참조](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)를 참조하세요. 도구에 대한 자세한 내용은 [도구](tools-overview.md)를 참조하세요.

다음 코드 예제는 사용자 지정 서브그래프의 실제 구현을 보여줍니다:

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
        // 이 서브그래프에 대한 노드와 엣지를 정의합니다.
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

### 서브그래프에서 도구 구성하기

도구는 여러 가지 방법으로 서브그래프에 대해 구성할 수 있습니다:

* 서브그래프 정의에 직접:
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

* 도구 레지스트리에서:
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

* 실행 중에 동적으로:
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
// 도구 집합 만들기
this.llm.writeSession {
    tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
}
```
<!--- KNIT example-custom-subgraphs-06.kt -->

## 고급 서브그래프 기술

### 다중 부분 전략

복잡한 워크플로는 여러 서브그래프로 분해될 수 있으며, 각 서브그래프는 프로세스의 특정 부분을 처리합니다:
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
      // 초기 입력을 처리합니다.
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 처리된 입력을 기반으로 추론을 수행합니다.
   }

   val toolRun by subgraph<B, C>(
      // 도구 레지스트리에서 가져온 도구의 선택적 부분 집합
      tools = listOf(firstTool, secondTool)
   ) {
      // 추론을 기반으로 도구를 실행합니다.
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 도구 결과를 기반으로 응답을 생성합니다.
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```
<!--- KNIT example-custom-subgraphs-07.kt -->

## 모범 사례

서브그래프를 사용할 때 다음 모범 사례를 따르세요.

1.  **복잡한 워크플로를 서브그래프로 분해하세요**: 각 서브그래프는 명확하고 집중된 책임을 가져야 합니다.

2.  **필요한 컨텍스트만 전달하세요**: 후속 서브그래프가 올바르게 작동하는 데 필요한 정보만 전달하세요.

3.  **서브그래프 종속성을 문서화하세요**: 각 서브그래프가 이전 서브그래프로부터 무엇을 기대하고 후속 서브그래프에 무엇을 제공하는지 명확하게 문서화하세요.

4.  **서브그래프를 격리하여 테스트하세요**: 각 서브그래프가 전략에 통합되기 전에 다양한 입력에서 올바르게 작동하는지 확인하세요.

5.  **토큰 사용량을 고려하세요**: 특히 서브그래프 간에 많은 히스토리를 전달할 때 토큰 사용량을 유의하세요.

## 문제 해결

### 도구를 사용할 수 없는 경우

서브그래프에서 도구를 사용할 수 없는 경우:

*   도구가 도구 레지스트리에 올바르게 등록되었는지 확인하세요.

### 서브그래프가 정의되고 예상되는 순서로 실행되지 않는 경우

서브그래프가 정의된 순서로 실행되지 않는 경우:

*   서브그래프가 올바른 순서로 나열되어 있는지 전략 정의를 확인하세요.
*   각 서브그래프가 출력을 다음 서브그래프에 올바르게 전달하는지 확인하세요.
*   서브그래프가 나머지 서브그래프와 연결되어 있고 시작(및 종료)에서 도달 가능한지 확인하세요. 서브그래프나 노드에서 막히지 않도록 계속 진행하기 위한 모든 가능한 조건을 포함하도록 조건부 엣지에 유의하세요.

## 예시

다음 예시는 실제 시나리오에서 에이전트 전략을 생성하기 위해 서브그래프가 어떻게 사용되는지를 보여줍니다.
이 코드 예제에는 `researchSubgraph`, `planSubgraph`, `executeSubgraph` 세 가지 정의된 서브그래프가 포함되어 있으며, 각 서브그래프는 어시스턴트 흐름 내에서 정의되고 뚜렷한 목적을 가집니다.
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.prompt.dsl.prompt
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

class WebSearchTool: SimpleTool<WebSearchTool.Args>() {
    @Serializable
    class Args(val query: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("web_search", "Search on the web")
    
    override suspend fun doExecute(args: Args): String {
        return "Searching for ${args.query} on the web..."
    }
}

class DoAction: SimpleTool<DoAction.Args>() {
    @Serializable
    class Args(val action: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("do_action", "Do something")

    override suspend fun doExecute(args: Args): String {
        return "Doing action..."
    }
}

class DoAnotherAction: SimpleTool<DoAnotherAction.Args>() {
    @Serializable
    class Args(val action: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("do_another_action", "Do something other")

    override suspend fun doExecute(args: Args): String {
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
                            "문제가 주어졌고, 이를 해결할 수 있는 방법에 대한 연구 결과가 주어졌습니다." +
                                    "주어진 작업을 해결하기 위한 단계별 계획을 세우세요."
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
                            "작업과 이를 실행하기 위한 상세 계획이 주어졌습니다." +
                                    "관련 도구를 호출하여 실행을 수행하세요."
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