# イベントハンドラー

イベントハンドラーを使用すると、ログ記録、テスト、デバッグ、およびエージェントの動作拡張のために、エージェントのワークフロー中に特定のイベントを監視し、対応できます。

## 機能概要

EventHandler機能を使用すると、様々なエージェントイベントにフックできます。これは以下のイベント委譲メカニズムとして機能します。

- AIエージェント操作のライフサイクルを管理する。
- ワークフローの様々な段階を監視し、対応するためのフックを提供する。
- エラー処理と回復を可能にする。
- ツールの呼び出し追跡と結果処理を容易にする。

<!--## Key components

The EventHandler entity consists of five main handler types:

- Initialization handler that executes at the initialization of an agent run
- Result handler that processes successful results from agent operations
- Error handler that handles exceptions and errors that occur during execution
- Tool call listener that notifies when a tool is about to be invoked
- Tool result listener that processes the results after a tool has been called-->

### インストールと設定

EventHandler機能は、`EventHandler` クラスを介してエージェントのワークフローと統合されます。
このクラスは、様々なエージェントイベントのコールバックを登録する方法を提供し、エージェント設定の機能としてインストールできます。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler/index.html)を参照してください。

この機能をインストールし、エージェントのイベントハンドラーを設定するには、以下の手順を実行します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
handleEvents {
    // ツール呼び出しを処理
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
    }
    // エージェントが実行を完了したときにトリガーされるイベントを処理
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // その他のイベントハンドラー
}
```
<!--- KNIT example-event-handlers-01.kt -->

イベントハンドラーの設定に関する詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-features/agents-features-event-handler/ai.koog.agents.features.eventHandler.feature/-event-handler-config/index.html)を参照してください。

エージェント作成時に `handleEvents` 拡張関数を使用してイベントハンドラーを設定することもできます。
この関数は、イベントハンドラー機能をインストールし、エージェントのイベントハンドラーを設定します。以下に例を示します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
){
    handleEvents {
        // ツール呼び出しを処理
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // エージェントが実行を完了したときにトリガーされるイベントを処理
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // その他のイベントハンドラー
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->