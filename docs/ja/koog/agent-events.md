# エージェントイベント

エージェントイベントは、エージェントのワークフローの一部として発生するアクションまたはインタラクションです。これらには以下が含まれます。

- エージェントライフサイクルイベント
- ストラテジーイベント
- ノードイベント
- LLM呼び出しイベント
- ツール呼び出しイベント

## イベントハンドラー

エージェントのワークフロー中に特定のイベントを監視し、それに応答するために、イベントハンドラーをロギング、テスト、デバッグ、およびエージェントの振る舞いの拡張に利用できます。

`EventHandler` 機能は、さまざまなエージェントイベントにフックすることを可能にします。これは、以下のイベント委譲メカニズムとして機能します。

- AIエージェント操作のライフサイクルを管理します。
- ワークフローのさまざまな段階を監視し、それに応答するためのフックを提供します。
- エラー処理と回復を可能にします。
- ツール呼び出しの追跡と結果処理を促進します。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### インストールと設定

`EventHandler` 機能は、`EventHandler` クラスを介してエージェントのワークフローに統合されます。このクラスは、異なるエージェントイベントのコールバックを登録する方法を提供し、エージェント設定の機能としてインストールできます。詳細については、[API リファレンス](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler/index.html)を参照してください。

この機能をインストールし、エージェントのイベントハンドラーを設定するには、次のようにします。

```kotlin
{
    install(EventHandler){
        // ここにイベントハンドラーを定義します。
        onToolCall = { stage, tool, toolArgs ->
            // ツール呼び出しイベントを処理します。
        }

        onAgentFinished = { strategyName, result ->
            // エージェントの実行が完了したときにトリガーされるイベントを処理します。
        }

        // その他のイベントハンドラーを定義します。
    }
}
```

イベントハンドラーの設定に関する詳細については、[API リファレンス](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.local.features.eventHandler.feature/-event-handler-config/index.html)を参照してください。

エージェントを作成する際に、`handleEvents` 拡張関数を使用してイベントハンドラーを設定することもできます。この関数もイベントハンドラー機能をインストールし、エージェントのイベントハンドラーを設定します。例を次に示します。

```kotlin
val agent = AIAgent(
    // Initialization options
){
    handleEvents {
        // ツール呼び出しを処理
        onToolCall = { stage, tool, toolArgs ->
            println("Tool called: ${tool.name} with args $toolArgs")
        }
        // エージェントの実行が完了したときにトリガーされるイベントを処理
        onAgentFinished = { strategyName, result ->
            println("Agent finished with result: $result")
        }

        // その他のイベントハンドラー
    }
}