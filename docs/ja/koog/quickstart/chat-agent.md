# メモリ機能を備えたチャットエージェントの構築

このガイドでは、[ChatMemory](../chat-memory.md) 機能を使用して、複数のやり取りにわたって以前のメッセージを記憶する対話型チャットエージェントを作成する方法を説明します。

## 前提条件

--8<-- "quickstart-snippets.md:prerequisites"

## Koog と Memory 機能のインストール

=== "Gradle (Kotlin)"

    ```kotlin title="build.gradle.kts"
    dependencies {
        implementation("ai.koog:koog-agents:0.7.0")
        implementation("ai.koog:agents-features-memory:0.7.0")
    }
    ```

=== "Gradle (Groovy)"

    ```groovy title="build.gradle"
    dependencies {
        implementation 'ai.koog:koog-agents:0.7.0'
        implementation 'ai.koog:agents-features-memory:0.7.0'
    }
    ```

=== "Maven"

    ```xml title="pom.xml"
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>0.7.0</version>
    </dependency>
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>agents-features-memory-jvm</artifactId>
        <version>0.7.0</version>
    </dependency>
    ```

## API キーの設定

--8<-- "quickstart-snippets.md:api-key"

## 作成するもの

以下の機能を備えたコマンドラインチャットエージェントを作成します。

- ループ内でユーザー入力を受け付ける
- 各メッセージを LLM に送信する
- `agent.run()` の呼び出しをまたいで会話履歴全体を記憶する
- スライディングウィンドウを使用してコンテキストサイズを制限する

ChatMemory がない場合、`agent.run()` を呼び出すたびに新しい会話が開始されます。つまり、エージェントはそれ以前の発言内容を知りません。ChatMemory は、各実行前に以前のメッセージを自動的に読み込み、実行後に更新された履歴を保存することで、この問題を解決します。

## チャットエージェントの作成

=== "OpenAI"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // ここにツールを登録します
        }

        simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OpenAIModels.Chat.GPT5_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20) // 直近の 20 メッセージのみを保持する
                }
            }

            while (true) {
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
")
            }
        }
    }
    ```

=== "Anthropic"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // ここにツールを登録します
        }

        simpleAnthropicExecutor(System.getenv("ANTHROPIC_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = AnthropicModels.Sonnet4_1,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
")
            }
        }
    }
    ```

=== "Google"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.google.GoogleModels
    import ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // ここにツールを登録します
        }

        simpleGoogleAIExecutor(System.getenv("GOOGLE_API_KEY")).use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = GoogleModels.Gemini2_5Pro,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
")
            }
        }
    }
    ```

=== "Ollama"

    <!--- INCLUDE
    import ai.koog.agents.chatMemory.feature.ChatMemory
    import ai.koog.agents.chatMemory.feature.InMemoryChatHistoryProvider
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
    -->
    ```kotlin
    suspend fun main() {
        val sessionId = "my-conversation"

        val toolRegistry = ToolRegistry {
            // ここにツールを登録します
        }

        simpleOllamaAIExecutor().use { executor ->
            val agent = AIAgent(
                promptExecutor = executor,
                llmModel = OllamaModels.Meta.LLAMA_3_2,
                systemPrompt = "You are a helpful assistant.",
                toolRegistry = toolRegistry,
            ) {
                install(ChatMemory) {
                    windowSize(20)
                }
            }

            while (true) {
                print("You: ")
                val input = readln().trim()
                if (input == "/bye") break
                if (input.isEmpty()) continue

                val reply = agent.run(input, sessionId)
                println("Assistant: $reply
")
            }
        }
    }
    ```

## 仕組み

上記の例には 3 つの重要な部分があります。

### 1. ChatMemory のインストール

ChatMemory は、エージェントのビルダーブロック内で[機能 (feature)](../features-overview.md)としてインストールされます。

```kotlin
AIAgent(
    promptExecutor = executor,
    llmModel = OpenAIModels.Chat.GPT5_2,
    systemPrompt = "You are a helpful assistant.",
    toolRegistry = toolRegistry,
) {
    install(ChatMemory) {
        windowSize(20) // 直近の 20 メッセージのみを保持する
    }
}
```

`windowSize(20)` [プリプロセッサ (preprocessor)](../chat-memory.md#preprocessors) は、会話のコンテキストを制限内に保ち、直近の 20 メッセージのみが保持されるようにします。これがないと、会話が長くなるにつれてプロンプトのサイズが無制限に大きくなってしまいます。

### 2. 一貫したセッション ID の使用

`agent.run()` の 2 番目の引数はセッション ID です。

```kotlin
val reply = agent.run(input, sessionId)
```

ChatMemory は、この ID を使用して会話を読み込み、保存します。同じセッション ID を使用するすべての呼び出しは、同じ履歴を共有します。異なるセッション ID は、完全に隔離された会話を生成します。

### 3. チャットループ

`while` ループの各イテレーションでは、以下の処理が行われます。

1. ユーザー入力を読み取る
2. `agent.run(input, sessionId)` を呼び出す — LLM がプロンプトを確認する前に、ChatMemory が自動的に以前の履歴を読み込む
3. レスポンスを出力する
4. ChatMemory が、更新された履歴（新しいユーザーメッセージとアシスタントのレスポンスを含む）を自動的に保存する

## セッションの例

```
You: My name is Alice.
Assistant: Nice to meet you, Alice! How can I help you today?

You: What's my favorite color? It's blue.
Assistant: Got it — your favorite color is blue!

You: What's my name?
Assistant: Your name is Alice!
```

3 番目のメッセージを処理する前に ChatMemory が以前のやり取りを読み込んだため、エージェントは正しく 「Your name is Alice!」 と答えることができます。

## 次のステップ

- 会話履歴をフィルタリングおよび変換するための [プリプロセッサ (preprocessors)](../chat-memory.md#preprocessors) について学ぶ
- 永続的なストレージのための [カスタム履歴プロバイダー (custom history provider)](../chat-memory.md#custom-history-providers) を実装する
- HTTP 経由でチャットセッションを管理するための、Spring Boot を使用した [バックエンドのユースケース](../chat-memory.md#typical-use-case-backend-applications) を確認する
- クラッシュリカバリのシナリオにおける [ChatMemory と Persistence (永続化) の違い](../chat-memory.md#chatmemory-vs-persistence) を理解する
- 機能の完全なリファレンスについては、[Chat Memory](../chat-memory.md) を参照してください。