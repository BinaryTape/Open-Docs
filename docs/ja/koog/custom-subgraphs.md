## サブグラフの作成と設定

以下のセクションでは、エージェント・ワークフロー用のサブグラフ作成におけるコードテンプレートと一般的なパターンを紹介します。

### 基本的なサブグラフの作成

カスタムサブグラフは、通常以下のパターンを使用して作成されます。

* 指定されたツール選択戦略を持つサブグラフ:

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
            // このサブグラフのノードとエッジを定義する
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
            // このサブグラフのノードとエッジを定義する
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava01.java -->

* 指定されたツールリスト（定義済みのツール・レジストリからのツールのサブセット）を持つサブグラフ:

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
            // このサブグラフのノードとエッジを定義する
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
            // このサブグラフのノードとエッジを定義する
        })
        .build();

    var strategy = strategyBuilder
        .edge(strategyBuilder.nodeStart, subgraphIdentifier)
        .edge(subgraphIdentifier, strategyBuilder.nodeFinish)
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava02.java -->

パラメータおよびパラメータ値の詳細については、`subgraph` の [APIリファレンス](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph) を参照してください。ツールに関する詳細は、[ツール](tools/index.md) を参照してください。

以下のコードサンプルは、カスタムサブグラフの実際の実装例を示しています。

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
            // このサブグラフのノードとエッジを定義する
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
            // このサブグラフのノードとエッジを定義する
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

### サブグラフでのツールの設定

ツールは、いくつかの方法でサブグラフに対して設定できます。

* サブグラフの定義で直接設定する:

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
        // サブグラフの定義
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
            // サブグラフの定義
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava04.java -->

* ツール・レジストリから設定する:

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
        // サブグラフの定義
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
            // サブグラフの定義
        })
        .build();
    ```
    <!--- KNIT exampleCustomSubgraphsJava05.java -->

* 実行中に動的に設定する:

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
    // ツールのセットを作成する
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
            // ツールのセットを作成する
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

## 高度なサブグラフの手法

### マルチパート戦略

複雑なワークフローは、プロセスの特定のパートをそれぞれ担当する複数のサブグラフに分割できます。

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
          // 初期の入力を処理する
       }

       val reasoning by subgraph<A, B>(
       ) {
          // 処理された入力に基づいて推論を実行する
       }

       val toolRun by subgraph<B, C>(
          // ツール・レジストリからのツールのオプションのサブセット
          tools = listOf(firstTool, secondTool)
       ) {
          // 推論に基づいてツールを実行する
       }

       val responseGeneration by subgraph<C, String>(
       ) {
          // ツールの結果に基づいてレスポンスを生成する
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
            // 初期の入力を処理する
        })
        .build();

    var reasoning = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 処理された入力に基づいて推論を実行する
        })
        .build();

    var toolRun = AIAgentSubgraph.builder()
        // ツール・レジストリからのツールのオプションのサブセット
        .limitedTools(List.of(firstTool, secondTool))
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // 推論に基づいてツールを実行する
        })
        .build();

    var responseGeneration = AIAgentSubgraph.builder()
        .withInput(String.class)
        .withOutput(String.class)
        .define(subgraph -> {
            // ツールの結果に基づいてレスポンスを生成する
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

## ベストプラクティス

サブグラフを扱う際は、以下のベストプラクティスに従ってください。

1. **複雑なワークフローをサブグラフに分割する**: 各サブグラフは、明確で集中した責任を持つ必要があります。

2. **必要なコンテキストのみを渡す**: 後続のサブグラフが正しく機能するために必要な情報のみを渡します。

3. **サブグラフの依存関係をドキュメント化する**: 各サブグラフが前のサブグラフから何を期待し、後続のサブグラフに何を提供するかを明確にドキュメント化します。

4. **サブグラフを単体でテストする**: 戦略に統合する前に、各サブグラフがさまざまな入力に対して正しく動作することを確認します。

5. **トークン使用量を考慮する**: 特にサブグラフ間で大規模な履歴を渡す場合は、トークンの使用量に注意してください。

## トラブルシューティング

### ツールが利用できない

サブグラフでツールが利用できない場合:

- ツールがツール・レジストリに正しく登録されているか確認してください。

### サブグラフが定義された、期待通りの順序で実行されない

サブグラフが定義された順序で実行されない場合:

- 戦略の定義をチェックして、サブグラフが正しい順序でリストされているか確認してください。
- 各サブグラフがその出力を次のサブグラフに正しく渡しているか検証してください。
- サブグラフが残りのサブグラフと接続されており、開始（start）から終了（finish）まで到達可能であることを確認してください。条件付きエッジ（conditional edges）を使用する場合は、サブグラフやノードでブロックされないよう、継続するためのすべての可能な条件をカバーするように注意してください。

## 例

以下の例は、実世界のシナリオにおいて、エージェント戦略を作成するためにサブグラフがどのように使用されるかを示しています。
このコードサンプルには、`researchSubgraph`、`planSubgraph`、`executeSubgraph` という3つの定義済みサブグラフが含まれており、各サブグラフはアシスタント・フロー内で明確に定義された、それぞれ異なる目的を持っています。

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
    // エージェント戦略を定義する
    val strategy = strategy<String, String>("assistant") {

        // ツール呼び出しを含むサブグラフ
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
    // エージェント戦略を定義する
    var strategyBuilder = AIAgentGraphStrategy.builder("assistant")
        .withInput(String.class)
        .withOutput(String.class);

    // ツール呼び出しを含むサブグラフ
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