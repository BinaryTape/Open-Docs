# イベントハンドラー

イベントハンドラーを使用すると、エージェントのワークフロー中の特定のイベントを監視し、それに応答することができます。これはロギング、テスト、デバッグ、およびエージェントの動作拡張に役立ちます。

## 機能の概要

EventHandler機能を使用すると、さまざまなエージェントイベントにフックできます。これは、以下のような役割を果たすイベントデリゲーションメカニズムとして機能します。

- AIエージェント操作のライフサイクルを管理する。
- ワークフローのさまざまなステージを監視し、応答するためのフックを提供する。
- エラーハンドリングとリカバリを可能にする。
- ツールの呼び出し追跡と結果処理を容易にする。

<!--## 主要コンポーネント

EventHandlerエンティティは、主に5つのハンドラータイプで構成されています：

- エージェント実行の初期化時に実行される初期化ハンドラー
- エージェント操作の成功結果を処理する結果ハンドラー
- 実行中に発生した例外やエラーを処理するエラーハンドラー
- ツールが呼び出される直前に通知するツール呼び出しリスナー
- ツールが呼び出された後の結果を処理するツール結果リスナー-->

### インストールと設定

EventHandler機能は、`EventHandler` クラスを通じてエージェントのワークフローと統合されます。このクラスは、さまざまなエージェントイベントのコールバックを登録する方法を提供し、エージェント設定に機能（feature）としてインストールできます。詳細については、[APIリファレンス](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)を参照してください。

機能をインストールし、エージェントのイベントハンドラーを設定するには、次のように行います。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

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
    // ツール呼び出しを処理する
    onToolCallStarting { eventContext ->
        println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
    }
    // エージェントの実行が完了したときにトリガーされるイベントを処理する
    onAgentCompleted { eventContext ->
        println("Agent finished with result: ${eventContext.result}")
    }

    // その他のイベントハンドラー
}
```
<!--- KNIT example-event-handlers-01.kt -->

イベントハンドラーの設定に関する詳細は、[APIリファレンス](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)を参照してください。

また、エージェント作成時に `handleEvents` 拡張関数を使用してイベントハンドラーをセットアップすることもできます。この関数は、イベントハンドラー機能をインストールし、エージェントのイベントハンドラーを設定します。以下に例を示します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
){
    handleEvents {
        // ツール呼び出しを処理する
        onToolCallStarting { eventContext ->
            println("Tool called: ${eventContext.toolName} with args ${eventContext.toolArgs}")
        }
        // エージェントの実行が完了したときにトリガーされるイベントを処理する
        onAgentCompleted { eventContext ->
            println("Agent finished with result: ${eventContext.result}")
        }

        // その他のイベントハンドラー
    }
}
```
<!--- KNIT example-event-handlers-02.kt -->