## 서브그래프 생성 및 구성

다음 섹션에서는 에이전트 워크플로(agentic workflows)를 위한 서브그래프 생성 시 사용할 수 있는 코드 템플릿과 일반적인 패턴을 제공합니다.

### 기본 서브그래프 생성

커스텀 서브그래프는 일반적으로 다음과 같은 패턴을 사용하여 생성됩니다:

* 지정된 도구 선택 전략(tool selection strategy)을 사용하는 서브그래프:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    typealias StrategyInput = Unit
    typealias StrategyOutput = Unit
    typealias Input = Unit
    typealias Output = Unit
    val strategy =
    -->
    ```kotlin
    strategy<StrategyInput, StrategyOutput>("strategy-name") {
        val subgraphIdentifier by subgraph<Input, Output>(
            name = "subgraph-name",
            toolSelectionStrategy = ToolSelectionStrategy.ALL
        ) {
            // 이 서브그래프를 위한 노드와 에지 정의
        }
    
        nodeStart then subgraphIdentifier then nodeFinish
    }
    ```
    <!--- KNIT example-custom-subgraphs-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.agent.entity.ToolSelectionStrategy;
    class exampleCustomSubgraphsJava01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var strategyBuilder = AIAgentGraphStrategy.builder("strategy-name")
        .withInput(String.class)
        .withOutput(String.class);

    var subgraphIdentifier = AIAgentSubgraph.builder("subgraph-name")
        .withToolSelectionStrategy(ToolSelectionStrategy.ALL.INSTANCE)
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 이 서브그래프를 위한 노드와 에지 정의
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava01.java -->

* 지정된 도구 목록(정의된 도구 레지스트리의 도구 하위 집합)을 사용하는 서브그래프:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.ext.tool.SayToUser
    typealias StrategyInput = Unit
    typealias StrategyOutput = Unit
    typealias Input = Unit
    typealias Output = Unit
    val firstTool = SayToUser
    val secondTool = AskUser
    val strategy =
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.ext.tool.AskUser;
    import ai.koog.agents.ext.tool.SayToUser;
    import java.util.List;
    class exampleCustomSubgraphsJava02 {
        public static void main(String[] args) {
            var firstTool = SayToUser.INSTANCE;
            var secondTool = AskUser.INSTANCE;
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var strategyBuilder = AIAgentGraphStrategy.builder("strategy-name")
        .withInput(String.class)
        .withOutput(String.class);

    var subgraphIdentifier = AIAgentSubgraph.builder("subgraph-name")
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 이 서브그래프를 위한 노드와 에지 정의
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava02.java -->

매개변수 및 매개변수 값에 대한 자세한 내용은 `subgraph` [API 레퍼런스](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph)를 참고하세요. 도구에 대한 자세한 내용은 [도구(Tools)](tools/index.md)를 참고하세요.

다음 코드 예제는 커스텀 서브그래프의 실제 구현 방식을 보여줍니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.*
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.ext.tool.SayToUser
    val firstTool = SayToUser
    val secondTool = AskUser
    val strategy =
    -->
    ```kotlin
    strategy<String, String>("my-strategy") {
       val mySubgraph by subgraph<String, String>(
          tools = listOf(firstTool, secondTool)
       ) {
            // 이 서브그래프를 위한 노드와 에지 정의
            val sendInput by nodeLLMRequest()
            val executeToolCall by nodeExecuteTools()
            val sendToolResult by nodeLLMSendToolResults()

            edge(nodeStart forwardTo sendInput)
            edge(sendInput forwardTo executeToolCall onToolCalls { true })
            edge(executeToolCall forwardTo sendToolResult)
            edge(sendToolResult forwardTo nodeFinish onTextMessage { true })
        }
    }
    ```
    <!--- KNIT example-custom-subgraphs-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.ext.tool.AskUser;
    import ai.koog.agents.ext.tool.SayToUser;
    import ai.koog.prompt.message.Message;
    import ai.koog.prompt.message.MessagePart;
    import java.util.List;
    import java.util.stream.Collectors;
    class exampleCustomSubgraphsJava03 {
        public static void main(String[] args) {
            var firstTool = SayToUser.INSTANCE;
            var secondTool = AskUser.INSTANCE;
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var strategyBuilder = AIAgentGraphStrategy.builder("my-strategy")
            .withInput(String.class)
            .withOutput(String.class);

    var sendInput = AIAgentNode.llmRequest(null);
    var executeToolCall = AIAgentNode.executeTools(null);
    var sendToolResult = AIAgentNode.llmSendToolResults(null);

    var mySubgraph = AIAgentSubgraph.builder()
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 이 서브그래프를 위한 노드와 에지 정의
            subgraph
                .edge(AIAgentEdge.builder()
                    .from(subgraph.nodeStart)
                    .to(sendInput)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(sendInput)
                    .to(executeToolCall)
                    .onToolCalls()
                    .build()
                )
                .edge(executeToolCall, sendToolResult)
                .edge(AIAgentEdge.builder()
                    .from(sendToolResult)
                    .to(subgraph.nodeFinish)
                    .onTextMessage()
                    .build()
                )
                .build();

        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, mySubgraph)
        .edge(mySubgraph, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava03.java -->

### 서브그래프 내 도구 구성

서브그래프에 도구를 구성하는 방법에는 여러 가지가 있습니다:

* 서브그래프 정의에서 직접 구성:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.ext.tool.AskUser
    val strategy = strategy<String, String>("my-strategy") {
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.ext.tool.AskUser;
    import java.util.List;
    class exampleCustomSubgraphsJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var mySubgraph = AIAgentSubgraph.builder()
        .limitedTools(List.of(AskUser.INSTANCE))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 서브그래프 정의
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava04.java -->

* 도구 레지스트리(tool registry)에서 구성:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.tools.ToolRegistry
    val toolRegistry = ToolRegistry.EMPTY
    val strategy = strategy<String, String>("my-strategy") {
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.tools.ToolRegistry;
    import java.util.List;
    class exampleCustomSubgraphsJava05 {
        public static void main(String[] args) {
            var toolRegistry = ToolRegistry.builder().build();
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var mySubgraph = AIAgentSubgraph.builder()
        .limitedTools(List.of(toolRegistry.getTool("AskUser")))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 서브그래프 정의
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava05.java -->

* 실행 중 동적으로 구성:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    val strategy = strategy<String, String>("my-strategy") {
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import java.util.List;
    import java.util.stream.Collectors;
    class exampleCustomSubgraphsJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var node = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 도구 세트 생성
            ctx.getLlm().writeSession(session -> {
                session.setTools(session.getTools().stream()
                    .filter(t -> List.of("first_tool_name", "second_tool_name").contains(t.getName()))
                    .collect(Collectors.toList()));
                return null;
            });
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava06.java -->

## 고급 서브그래프 기법

### 멀티 파트 전략(Multi-part strategies)

복잡한 워크플로는 각 프로세스의 특정 부분을 처리하는 여러 서브그래프로 나눌 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.ext.tool.SayToUser
    typealias A = Unit
    typealias B = Unit
    typealias C = Unit
    val firstTool = AskUser
    val secondTool = SayToUser
    val strategy =
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.ext.tool.AskUser;
    import ai.koog.agents.ext.tool.SayToUser;
    import java.util.List;
    class exampleCustomSubgraphsJava07 {
        public static void main(String[] args) {
            var firstTool = AskUser.INSTANCE;
            var secondTool = SayToUser.INSTANCE;
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var strategyBuilder = AIAgentGraphStrategy.builder("complex-workflow")
            .withInput(String.class)
            .withOutput(String.class);

    var inputProcessing = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 초기 입력 처리
        })
        .build();

    var reasoning = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 처리된 입력을 바탕으로 추론 수행
        })
        .build();

    var toolRun = AIAgentSubgraph.builder()
        // 도구 레지스트리에서 선택된 도구의 하위 집합(선택 사항)
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 추론을 바탕으로 도구 실행
        })
        .build();

    var responseGeneration = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 도구 결과를 바탕으로 응답 생성
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, inputProcessing)
        .edge(inputProcessing, reasoning)
        .edge(reasoning, toolRun)
        .edge(toolRun, responseGeneration)
        .edge(responseGeneration, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava07.java -->

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

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.nodeExecuteTools
    import ai.koog.agents.core.dsl.extension.nodeLLMRequest
    import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResults
    import ai.koog.agents.core.dsl.extension.onTextMessage
    import ai.koog.agents.core.dsl.extension.onToolCalls
    import ai.koog.agents.core.tools.SimpleTool
    import ai.koog.agents.core.tools.ToolDescriptor
    import ai.koog.prompt.dsl.prompt
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    class WebSearchTool: SimpleTool<WebSearchTool.Args>(
        argsType = typeToken<Args>(),
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
        argsType = typeToken<Args>(),
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
        argsType = typeToken<Args>(),
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
            val nodeExecuteTool by nodeExecuteTools()
            val nodeSendToolResult by nodeLLMSendToolResults()

            edge(nodeStart forwardTo nodeCallLLM)
            edge(nodeCallLLM forwardTo nodeExecuteTool onToolCalls { true })
            edge(nodeExecuteTool forwardTo nodeSendToolResult)
            edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCalls { true })
            edge(nodeCallLLM forwardTo nodeFinish onTextMessage { true })
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
            edge(nodeCallLLM forwardTo nodeFinish onTextMessage { true })
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
            val nodeExecuteTool by nodeExecuteTools()
            val nodeSendToolResult by nodeLLMSendToolResults()

            edge(nodeStart forwardTo nodeUpdatePrompt)
            edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
            edge(nodeCallLLM forwardTo nodeExecuteTool onToolCalls { true })
            edge(nodeExecuteTool forwardTo nodeSendToolResult)
            edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCalls { true })
            edge(nodeCallLLM forwardTo nodeFinish onTextMessage { true })
        }

        nodeStart then researchSubgraph then planSubgraph then executeSubgraph then nodeFinish
    }
    ```
    <!--- KNIT example-custom-subgraphs-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.Prompt;
    import ai.koog.prompt.message.Message;
    import ai.koog.prompt.message.MessagePart;
    import java.util.Collections;
    import java.util.stream.Collectors;
    public class exampleCustomSubgraphsJava08 {
        static class WebSearchToolSet implements ToolSet {
            @Tool
            @LLMDescription("Search on the web")
            public String webSearch(@LLMDescription("The search query") String query) {
                return "Searching for " + query + " on the web...";
            }
        }
        static class ActionToolSet implements ToolSet {
            @Tool
            @LLMDescription("Do something")
            public String doAction(@LLMDescription("The action to perform") String action) {
                return "Doing action...";
            }
            @Tool
            @LLMDescription("Do something other")
            public String doAnotherAction(@LLMDescription("The action to perform") String action) {
                return "Doing another action...";
            }
        }
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // 에이전트 전략 정의
    var strategyBuilder = AIAgentGraphStrategy.builder("assistant")
        .withInput(String.class)
        .withOutput(String.class);

    // 도구 호출을 포함하는 서브그래프
    var nodeCallLLM = AIAgentNode.llmRequest(null);
    var nodeExecuteTool = AIAgentNode.executeTools(null);
    var nodeSendToolResult = AIAgentNode.llmSendToolResults(null);

    var researchSubgraph = AIAgentSubgraph.builder("research_subgraph")
        .limitedTools(new WebSearchToolSet())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(AIAgentEdge.builder()
                    .from(subgraph.nodeStart)
                    .to(nodeCallLLM)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLM)
                    .to(nodeExecuteTool)
                    .onToolCalls()
                    .build()
                )
                .edge(nodeExecuteTool, nodeSendToolResult)
                .edge(AIAgentEdge.builder()
                    .from(nodeSendToolResult)
                    .to(nodeExecuteTool)
                    .onToolCalls()
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLM)
                    .to(subgraph.nodeFinish)
                    .onTextMessage()
                    .build()
                )
                .build();
        })
        .build();

    var nodeUpdatePrompt = AIAgentNode.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((research, ctx) -> {
            ctx.getLlm().writeSession(session -> {
                session.setPrompt(Prompt.builder("research_prompt")
                    .system(
                        "You are given a problem and some research on how it can be solved." +
                        "Make step by step a plan on how to solve given task."
                    )
                    .user("Research: " + research)
                    .build());
                return null;
            });
            return "Task: " + ctx.getAgentInput();
        })
        .build();
    var nodeCallLLMPlan = AIAgentNode.llmRequest(null);

    var planSubgraph = AIAgentSubgraph.builder("plan_subgraph")
        .limitedTools(Collections.emptyList())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(subgraph.nodeStart, nodeUpdatePrompt)
                .edge(AIAgentEdge.builder()
                    .from(nodeUpdatePrompt)
                    .to(nodeCallLLMPlan)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMPlan)
                    .to(subgraph.nodeFinish)
                    .onTextMessage()
                    .build()
                )
                .build();
        })
        .build();

    var nodeUpdatePromptExecute = AIAgentNode.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((plan, ctx) -> {
            ctx.getLlm().writeSession(session -> {
                session.setPrompt(Prompt.builder("execute_prompt")
                    .system(
                        "You are given a task and detailed plan how to execute it." +
                        "Perform execution by calling relevant tools."
                    )
                    .user("Execute: " + plan)
                    .user("Plan: " + plan)
                    .build());
                return null;
            });
            return "Task: " + ctx.getAgentInput();
        })
        .build();

    var nodeCallLLMExecute = AIAgentNode.llmRequest(null);
    var nodeExecuteToolExecute = AIAgentNode.executeTools(null);
    var nodeSendToolResultExecute = AIAgentNode.llmSendToolResults(null);

    var executeSubgraph = AIAgentSubgraph.builder("execute_subgraph")
        .limitedTools(new ActionToolSet())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(subgraph.nodeStart, nodeUpdatePromptExecute)
                .edge(AIAgentEdge.builder()
                    .from(nodeUpdatePromptExecute)
                    .to(nodeCallLLMExecute)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMExecute)
                    .to(nodeExecuteToolExecute)
                    .onToolCalls()
                    .build()
                )
                .edge(nodeExecuteToolExecute, nodeSendToolResultExecute)
                .edge(AIAgentEdge.builder()
                    .from(nodeSendToolResultExecute)
                    .to(nodeExecuteToolExecute)
                    .onToolCalls()
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMExecute)
                    .to(subgraph.nodeFinish)
                    .onIsInstance(Message.Assistant.class)
                    .onTextMessage()
                    .build()
                )
                .build();
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, researchSubgraph)
        .edge(researchSubgraph, planSubgraph)
        .edge(planSubgraph, executeSubgraph)
        .edge(executeSubgraph, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava08.java -->