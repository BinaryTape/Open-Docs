## サブグラフの作成と設定

以下のセクションでは、エージェントワークフロー用のサブグラフを作成する際のコードテンプレートと一般的なパターンについて説明します。

### 基本的なサブグラフの作成

カスタムサブグラフは通常、以下のパターンを使用して作成されます。

* 特定のツール選択戦略を持つサブグラフ：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name",
       toolSelectionStrategy = ToolSelectionStrategy.ALL
   ) {
        // Define nodes and edges for this subgraph
    }
}
```

* 特定のツールリスト（定義されたツールレジストリからのツールのサブセット）を持つサブグラフ：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name", 
       tools = listOf(firstToolName, secondToolName)
   ) {
        // Define nodes and edges for this subgraph
    }
}
```

パラメータおよびパラメータ値の詳細については、`subgraph` [APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)を参照してください。ツールの詳細については、[ツール](tools-overview.md)を参照してください。

以下のコードサンプルは、カスタムサブグラフの実際の実装を示しています。

```kotlin
strategy("my-strategy") {
   val mySubgraph by subgraph<String, String>(
      tools = listOf(myTool1, myTool2)
   ) {
        // Define nodes and edges for this subgraph
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

### サブグラフでのツールの設定

ツールは、いくつかの方法でサブグラフに設定できます。

* サブグラフの定義内で直接：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = listOf(AskUser)
 ) {
    // Subgraph definition
 }
```

* ツールレジストリから：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = toolRegistry.getTool("AskUser")
) {
   // Subgraph definition
}
```

[//]: # (TODO: @maria.tigina この件が可能か確認する)
* 実行時に動的に：
```kotlin
// Make a set of tools
val newTools = context.llm.writeSession {
    val selectedTools = this.requestLLMStructured<SelectedTools>(/*...*/)
    tools.filter { it.name in selectedTools.structure.tools.toSet() }
}

// Pass the tools to the context
val context = context.copyWithTools(newTools)
```

## 高度なサブグラフのテクニック

### マルチパート戦略

複雑なワークフローは複数のサブグラフに分割でき、それぞれがプロセスの特定の部分を処理します。

```kotlin
strategy("complex-workflow") {
   val inputProcessing by subgraph<String, A>(
   ) {
      // Process the initial input
   }

   val reasoning by subgraph<A, B>(
   ) {
      // Perform reasoning based on the processed input
   }

   val toolRun by subgraph<B, C>(
      // Optional subset of tools from the tool registry
      tools = listOf(tool1, too2)
   ) {
      // Run tools based on the reasoning
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // Generate a response based on the tool results
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```

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

- ツールがツールレジストリに正しく登録されていることを確認してください。

### サブグラフが定義された期待される順序で実行されない

サブグラフが定義された順序で実行されない場合：

- サブグラフが正しい順序でリストされていることを確認するために、戦略の定義をチェックしてください。
- 各サブグラフがその出力を次のサブグラフに正しく渡していることを確認してください。
- サブグラフが残りのサブグラフと接続されており、開始（および終了）から到達可能であることを確認してください。条件付きエッジには注意し、サブグラフやノードでブロックされないように、考えられるすべての条件をカバーするようにしてください。

## 例

以下の例は、サブグラフを使用して実際のシナリオでエージェント戦略を作成する方法を示しています。
このコードサンプルには、`researchSubgraph`、`planSubgraph`、`executeSubgraph`という3つの定義済みサブグラフが含まれており、各サブグラフはアシスタントフロー内で定義された個別の目的を持っています。

```kotlin
// Define the agent strategy
val strategy = strategy("assistant") {
    // A subgraph that includes a tool call
    val researchSubgraph by subgraph<String, String>(
        "name",
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
        "research_subgraph",
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
        "research_subgraph",
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