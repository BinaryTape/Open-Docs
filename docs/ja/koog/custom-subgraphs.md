## サブグラフの作成と設定

以下のセクションでは、エージェントワークフロー用のサブグラフを作成する際のコードテンプレートと一般的なパターンについて説明します。

### 基本的なサブグラフの作成

カスタムサブグラフは通常、以下のパターンを使用して作成されます。

*   特定のツール選択戦略を持つサブグラフ：
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
            // このサブグラフのノードとエッジを定義します
        }
    }
    ```
    <!--- KNIT example-custom-subgraphs-01.kt -->

*   特定のツールリスト（定義されたツールレジストリからのツールのサブセット）を持つサブグラフ：
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
            // このサブグラフのノードとエッジを定義します
        }
    }
    ```
    <!--- KNIT example-custom-subgraphs-02.kt -->

パラメータおよびパラメータ値の詳細については、`subgraph` [APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)を参照してください。ツールの詳細については、[ツール](tools-overview.md)を参照してください。

以下のコードサンプルは、カスタムサブグラフの実際の実装を示しています。

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
        // このサブグラフのノードとエッジを定義します
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

### サブグラフでのツールの設定

ツールは、いくつかの方法でサブグラフに設定できます。

*   サブグラフの定義内で直接：
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
        // サブグラフの定義
     }
    ```
    <!--- KNIT example-custom-subgraphs-04.kt -->

*   ツールレジストリから：
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
        // サブグラフの定義
    }
    ```
    <!--- KNIT example-custom-subgraphs-05.kt -->

*   実行時に動的に：
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
    // ツールのセットを作成します
    this.llm.writeSession {
        tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
    }
    ```
    <!--- KNIT example-custom-subgraphs-06.kt -->

## 高度なサブグラフのテクニック

### マルチパート戦略

複雑なワークフローは複数のサブグラフに分割でき、それぞれがプロセスの特定の部分を処理します。
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
      // 初期入力を処理します
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 処理された入力に基づいて推論を実行します
   }

   val toolRun by subgraph<B, C>(
      // ツールレジストリからのオプションのツールサブセット
      tools = listOf(firstTool, secondTool)
   ) {
      // 推論に基づいてツールを実行します
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // ツールの結果に基づいて応答を生成します
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```
<!--- KNIT example-custom-subgraphs-07.kt -->

## ベストプラクティス

サブグラフを操作する際は、以下のベストプラクティスに従ってください。

1.  **複雑なワークフローをサブグラフに分割する**：各サブグラフは明確で集中した責任を持つべきです。

2.  **必要なコンテキストのみを渡す**：後続のサブグラフが正しく機能するために必要な情報のみを渡します。

3.  **サブグラフの依存関係を文書化する**：各サブグラフが前のサブグラフから何を期待し、後続のサブグラフに何を提供するのかを明確に文書化します。

4.  **サブグラフを単独でテストする**：各サブグラフを戦略に統合する前に、様々な入力で正しく動作することを確認します。

5.  **トークン使用量を考慮する**：特にサブグラフ間で大量の履歴を渡す場合は、トークン使用量を意識してください。

## トラブルシューティング

### ツールが利用できない

サブグラフでツールが利用できない場合：

-   ツールがツールレジストリに正しく登録されていることを確認してください。

### サブグラフが定義された期待される順序で実行されない

サブグラフが定義された順序で実行されない場合：

-   サブグラフが正しい順序でリストされていることを確認するために、戦略の定義をチェックしてください。
-   各サブグラフがその出力を次のサブグラフに正しく渡していることを確認してください。
-   サブグラフが残りのサブグラフと接続されており、開始（および終了）から到達可能であることを確認してください。条件付きエッジには注意し、サブグラフやノードでブロックされないように、考えられるすべての条件をカバーするようにしてください。

## 例

以下の例は、サブグラフを使用して実際のシナリオでエージェント戦略を作成する方法を示しています。
このコードサンプルには、`researchSubgraph`、`planSubgraph`、`executeSubgraph`という3つの定義済みサブグラフが含まれており、各サブグラフはアシスタントフロー内で定義された個別の目的を持っています。
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
// エージェント戦略を定義します
val strategy = strategy<String, String>("assistant") {
    // ツール呼び出しを含むサブグラフ

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
                            "問題と、それを解決するための調査結果が与えられます。" +
                                    "与えられたタスクを解決するための計画を段階的に作成してください。"
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
                            "タスクと、それを実行するための詳細な計画が与えられます。" +
                                    "関連するツールを呼び出して実行してください。"
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