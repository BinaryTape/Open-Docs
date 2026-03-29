## 创建与配置子图

以下章节提供了在创建智能体工作流子图时的代码模板和常见模式。

### 基本子图创建

自定义子图通常使用以下模式创建：

* 具有指定工具选择策略的子图：

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
            // 为此子图定义节点和边
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
            // 为此子图定义节点和边
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava01.java -->

* 具有指定工具列表的子图（来自定义的工具库中的工具子集）：

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
            // 为此子图定义节点和边
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
            // 为此子图定义节点和边
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava02.java -->

有关参数和参数值的更多信息，请参阅 `subgraph` [API 参考](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph)。有关工具的更多信息，请参阅[工具](tools-overview.md)。

以下代码示例显示了自定义子图的实际实现：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.forwardTo
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
            // 为此子图定义节点和边
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.ext.tool.AskUser;
    import ai.koog.agents.ext.tool.SayToUser;
    import ai.koog.prompt.message.Message;
    import java.util.List;
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

    var sendInput = AIAgentNode.llmRequest();
    var executeToolCall = AIAgentNode.executeTool();
    var sendToolResult = AIAgentNode.llmSendToolResult();

    var mySubgraph = AIAgentSubgraph.builder()
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 为此子图定义节点和边
            subgraph
                .edge(subgraph.nodeStart, sendInput)
                .edge(AIAgentEdge.builder()
                    .from(sendInput)
                    .to(executeToolCall)
                    .onIsInstance(Message.Tool.Call.class)
                    .build()
                )
                .edge(executeToolCall, sendToolResult)
                .edge(AIAgentEdge.builder()
                    .from(sendToolResult)
                    .to(subgraph.nodeFinish)
                    .onIsInstance(Message.Assistant.class)
                    .transformed(Message.Assistant::getContent)
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

### 在子图中配置工具

可以通过多种方式为子图配置工具：

* 直接在子图定义中配置：

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
        // 子图定义
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
            // 子图定义
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava04.java -->

* 从工具库中配置：

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
        // 子图定义
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
            // 子图定义
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava05.java -->

* 在执行期间动态配置：

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
    // 创建一组工具
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
            // 创建一组工具
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

## 高级子图技巧

### 多部分策略

复杂的工作流可以分解为多个子图，每个子图处理过程中的特定部分：

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
          // 处理初始输入
       }

       val reasoning by subgraph<A, B>(
       ) {
          // 根据处理后的输入进行推理
       }

       val toolRun by subgraph<B, C>(
          // 来自工具库的可选工具子集
          tools = listOf(firstTool, secondTool)
       ) {
          // 根据推理运行工具
       }

       val responseGeneration by subgraph<C, String>(
       ) {
          // 根据工具结果生成响应
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
            // 处理初始输入
        })
        .build();

    var reasoning = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 根据处理后的输入进行推理
        })
        .build();

    var toolRun = AIAgentSubgraph.builder()
        // 来自工具库的可选工具子集
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 根据推理运行工具
        })
        .build();

    var responseGeneration = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 根据工具结果生成响应
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

## 最佳做法

使用子图时，请遵循以下最佳做法：

1. **将复杂工作流分解为子图**：每个子图应具有清晰、集中的职责。

2. **仅传递必要的上下文**：仅传递后续子图正常运行所需的信息。

3. **记录子图依赖关系**：清晰地记录每个子图对前序子图的预期以及它为后续子图提供的内容。

4. **孤立测试子图**：在将子图集成到策略中之前，确保每个子图在各种输入下都能正确工作。

5. **考虑 Token 使用情况**：注意 Token 使用情况，尤其是在子图之间传递大量历史记录时。

## 故障排除

### 工具不可用

如果子图中工具不可用：

- 检查工具是否已在工具库中正确注册。

### 子图未按定义和预期的顺序运行

如果子图未按定义的顺序执行：

- 检查策略定义，确保子图按正确的顺序排列。
- 验证每个子图是否正确地将其输出传递给下一个子图。
- 确保您的子图与子图的其余部分相连，并且可以从开始（和结束）节点到达。注意条件边，确保它们涵盖了继续执行的所有可能条件，以免在子图或节点中阻塞。

## 示例

以下示例展示了如何在实际场景中使用子图创建智能体策略。
该代码示例包含三个定义的子图：`researchSubgraph`、`planSubgraph` 和 `executeSubgraph`，其中每个子图在助手流程中都有明确且不同的目的。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.forwardTo
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.dsl.builder.subgraph
    import ai.koog.agents.core.dsl.extension.nodeExecuteTool
    import ai.koog.agents.core.dsl.extension.nodeLLMRequest
    import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
    import ai.koog.agents.core.dsl.extension.onAssistantMessage
    import ai.koog.agents.core.dsl.extension.onToolCall
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
    // 定义智能体策略
    val strategy = strategy<String, String>("assistant") {

        // 包含工具调用的子图
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

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentEdge;
    import ai.koog.agents.core.agent.entity.AIAgentGraphStrategy;
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;
    import ai.koog.agents.core.tools.reflect.ToolSet;
    import ai.koog.prompt.dsl.Prompt;
    import ai.koog.prompt.message.Message;
    import java.util.Collections;
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
    // 定义智能体策略
    var strategyBuilder = AIAgentGraphStrategy.builder("assistant")
        .withInput(String.class)
        .withOutput(String.class);

    // 包含工具调用的子图
    var nodeCallLLM = AIAgentNode.llmRequest();
    var nodeExecuteTool = AIAgentNode.executeTool();
    var nodeSendToolResult = AIAgentNode.llmSendToolResult();

    var researchSubgraph = AIAgentSubgraph.builder("research_subgraph")
        .limitedTools(new WebSearchToolSet())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(subgraph.nodeStart, nodeCallLLM)
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLM)
                    .to(nodeExecuteTool)
                    .onIsInstance(Message.Tool.Call.class)
                    .build()
                )
                .edge(nodeExecuteTool, nodeSendToolResult)
                .edge(AIAgentEdge.builder()
                    .from(nodeSendToolResult)
                    .to(nodeExecuteTool)
                    .onIsInstance(Message.Tool.Call.class)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLM)
                    .to(subgraph.nodeFinish)
                    .onIsInstance(Message.Assistant.class)
                    .transformed(Message.Assistant::getContent)
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
    var nodeCallLLMPlan = AIAgentNode.llmRequest();

    var planSubgraph = AIAgentSubgraph.builder("plan_subgraph")
        .limitedTools(Collections.emptyList())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(subgraph.nodeStart, nodeUpdatePrompt)
                .edge(nodeUpdatePrompt, nodeCallLLMPlan)
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMPlan)
                    .to(subgraph.nodeFinish)
                    .onIsInstance(Message.Assistant.class)
                    .transformed(Message.Assistant::getContent)
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

    var nodeCallLLMExecute = AIAgentNode.llmRequest();
    var nodeExecuteToolExecute = AIAgentNode.executeTool();
    var nodeSendToolResultExecute = AIAgentNode.llmSendToolResult();

    var executeSubgraph = AIAgentSubgraph.builder("execute_subgraph")
        .limitedTools(new ActionToolSet())
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            subgraph
                .edge(subgraph.nodeStart, nodeUpdatePromptExecute)
                .edge(nodeUpdatePromptExecute, nodeCallLLMExecute)
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMExecute)
                    .to(nodeExecuteToolExecute)
                    .onIsInstance(Message.Tool.Call.class)
                    .build()
                )
                .edge(nodeExecuteToolExecute, nodeSendToolResultExecute)
                .edge(AIAgentEdge.builder()
                    .from(nodeSendToolResultExecute)
                    .to(nodeExecuteToolExecute)
                    .onIsInstance(Message.Tool.Call.class)
                    .build()
                )
                .edge(AIAgentEdge.builder()
                    .from(nodeCallLLMExecute)
                    .to(subgraph.nodeFinish)
                    .onIsInstance(Message.Assistant.class)
                    .transformed(Message.Assistant::getContent)
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