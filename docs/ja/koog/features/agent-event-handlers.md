# イベントハンドラー

エージェントのワークフローにおける特定のイベントを監視し、それらに応答するためにイベントハンドラーを使用できます。これは、ロギング、テスト、デバッグ、およびエージェントの動作の拡張に役立ちます。

## 機能の概要

EventHandler機能を使用すると、エージェントのさまざまなイベントをフックできます。これは、以下のようなイベント委譲メカニズムとして機能します。

- AIエージェント操作のライフサイクルを管理する。
- ワークフローのさまざまな段階を監視し、応答するためのフックを提供する。
- エラー処理とリカバリを可能にする。
- ツールの呼び出しの追跡と結果の処理を容易にする。

<!--## 主要なコンポーネント

EventHandlerエンティティは、主に5つのハンドラータイプで構成されています。

- エージェント実行の初期化時に実行される初期化ハンドラー
- エージェント操作の成功結果を処理する結果ハンドラー
- 実行中に発生した例外やエラーを処理するエラーハンドラー
- ツールが呼び出される直前に通知するツール呼び出しリスナー
- ツールが呼び出された後の結果を処理するツール結果リスナー-->

### インストールと設定

EventHandler機能は、`EventHandler`クラスを通じてエージェントのワークフローに統合されます。このクラスはエージェントのさまざまなイベントに対してコールバックを登録する方法を提供し、エージェント設定に機能としてインストールできます。詳細は、[APIリファレンス](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandler)を参照してください。

機能をインストールし、エージェントのイベントハンドラーを設定するには、次のようにします。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
        .llmModel(OllamaModels.Meta.LLAMA_3_2)
        .install(EventHandler.Feature, cfg -> {
            // ツール呼び出しを処理する
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // エージェントの実行が完了したときにトリガーされるイベントを処理する
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-01.java -->

イベントハンドラー設定の詳細については、[APIリファレンス](api:agents-features-event-handler::ai.koog.agents.features.eventHandler.feature.EventHandlerConfig)を参照してください。

また、エージェントの作成時に`handleEvents`拡張関数を使用してイベントハンドラーを設定することもできます。この関数は、イベントハンドラー機能をインストールし、エージェントのイベントハンドラーを構成します。以下に例を示します。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOllamaAIExecutor("http://localhost:11434"))
        .llmModel(OllamaModels.Meta.LLAMA_3_2)
        .install(EventHandler.Feature, cfg -> {
            // ツール呼び出しを処理する
            cfg.onToolCallStarting(ctx -> {
                System.out.println("Tool called: " + ctx.getToolName() + " with args " + ctx.getToolArgs());
            });
            // エージェントの実行が完了したときにトリガーされるイベントを処理する
            cfg.onAgentCompleted(ctx -> {
                System.out.println("Agent finished with result: " + ctx.getResult());
            });
        })
        .build();
    ```
    <!--- KNIT example-event-handlers-java-02.java -->