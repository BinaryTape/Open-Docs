## サブグラフの作成と設定

以下のセクションでは、エージェント・ワークフロー用のサブグラフ作成におけるコードテンプレートと一般的なパターンを紹介します。

### 基本的なサブグラフの作成

カスタムサブグラフは、通常以下のパターンを使用して作成されます。

* 指定されたツール選択戦略を持つサブグラフ:
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
        // このサブグラフのノードとエッジを定義する
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

* 指定されたツールリスト（定義済みのツール・レジストリからのツールのサブセット）を持つサブグラフ:
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
        // このサブグラフのノードとエッジを定義する
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

パラメータおよびパラメータ値の詳細については、`subgraph` の [APIリファレンス](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph) を参照してください。ツールに関する詳細は、[ツール](tools-overview.md) を参照してください。

以下のコードサンプルは、カスタムサブグラフの実際の実装例を示しています。

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
        // このサブグラフのノードとエッジを定義する
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

ツールは、いくつかの方法でサブグラフに対して設定できます。

* サブグラフの定義で直接設定する:
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

* ツール・レジストリから設定する:
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

* 実行中に動的に設定する:
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
// ツールのセットを作成する
this.llm.writeSession {
    tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
}
```
<!--- KNIT example-custom-subgraphs-06.kt -->

## 高度なサブグラフの手法

### マルチパート戦略

複雑なワークフローは、プロセスの特定のパートをそれぞれ担当する複数のサブグラフに分割できます。
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
このコードサンプルには、`researchSubgraph`、`planSubgraph`、`executeSubgraph` という3つの定義済みサブグラフが含まれており、各サブグラフはアシスタント・フロー内で明確に異なる目的を持っています。
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
// エージェント戦略を定義する
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