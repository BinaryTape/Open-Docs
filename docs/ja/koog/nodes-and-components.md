# 事前定義されたノードとコンポーネント

ノードは、Koogフレームワークにおけるエージェントワークフローの基本的な構成要素です。各ノードはワークフロー内の特定の操作または変換を表し、エッジを使用して接続することで実行フローを定義できます。

一般的に、ノードを使用すると、複雑なロジックを再利用可能なコンポーネントとしてカプセル化し、さまざまなエージェントワークフローに簡単に統合できます。このガイドでは、エージェント戦略で使用できる既存のノードについて説明します。

詳細なリファレンスドキュメントについては、[APIリファレンス](https://api.koog.ai/index.html)を参照してください。

## ユーティリティノード

### nodeDoNothing

何もせずに入力を出力として返すシンプルなパススルーノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-do-nothing.html)を参照してください。

このノードは次の目的で使用できます。

- グラフにプレースホルダーノードを作成する。
- データを変更せずに接続点を作成する。

以下に例を示します。

```kotlin
val passthrough by nodeDoNothing<String>("passthrough")

edge(someNode forwardTo passthrough)
edge(passthrough forwardTo anotherNode)
```

## LLMノード

### nodeUpdatePrompt

提供されたプロンプトビルダーを使用して、LLMプロンプトにメッセージを追加するノードです。これは、実際のLLMリクエストを行う前に会話コンテキストを変更する場合に役立ちます。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-update-prompt.html)を参照してください。

このノードは次の目的で使用できます。

- プロンプトにシステム指示を追加する。
- 会話にユーザーメッセージを挿入する。
- 後続のLLMリクエストのためのコンテキストを準備する。

以下に例を示します。

```kotlin
val setupContext by nodeUpdatePrompt("setupContext") {
    system("You are a helpful assistant specialized in Kotlin programming.")
    user("I need help with Kotlin coroutines.")
}
```

### nodeLLMSendMessageOnlyCallingTools

ユーザーメッセージをLLMプロンプトに追加し、LLMがツールのみを呼び出せる応答を取得するノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-only-calling-tools.html)を参照してください。

### nodeLLMSendMessageForceOneTool

ユーザーメッセージをLLMプロンプトに追加し、LLMに特定のツールを使用させるノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-message-force-one-tool.html)を参照してください。

### nodeLLMRequest

ユーザーメッセージをLLMプロンプトに追加し、オプションでツール使用を含む応答を取得するノードです。ノードの設定によって、メッセージの処理中にツール呼び出しが許可されるかどうかが決まります。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request.html)を参照してください。

このノードは次の目的で使用できます。

- 現在のプロンプトに対するLLM応答を生成し、LLMがツール呼び出しを生成できるかどうかを制御する。

以下に例を示します。

```kotlin
val processQuery by nodeLLMRequest("processQuery", allowToolCalls = true)
edge(someNode forwardTo processQuery)
```

### nodeLLMRequestStructured

ユーザーメッセージをLLMプロンプトに追加し、エラー修正機能を備えたLLMから構造化データを要求するノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-structured.html)を参照してください。

### nodeLLMRequestStreaming

ユーザーメッセージをLLMプロンプトに追加し、ストリームデータ変換の有無にかかわらずLLM応答をストリームするノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-streaming.html)を参照してください。

### nodeLLMRequestMultiple

ユーザーメッセージをLLMプロンプトに追加し、ツール呼び出しが有効な複数のLLM応答を取得するノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-request-multiple.html)を参照してください。

このノードは次の目的で使用できます。

- 複数のツール呼び出しを必要とする複雑なクエリを処理する。
- 複数のツール呼び出しを生成する。
- 複数の並行アクションを必要とするワークフローを実装する。

以下に例を示します。

```kotlin
val processComplexQuery by nodeLLMRequestMultiple("processComplexQuery")
edge(someNode forwardTo processComplexQuery)
```

### nodeLLMCompressHistory

現在のLLMプロンプト（メッセージ履歴）を要約に圧縮し、メッセージを簡潔な要約（TL;DR）に置き換えるノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-compress-history.html)を参照してください。
これは、履歴を圧縮してトークン使用量を削減することで、長い会話を管理するのに役立ちます。

履歴圧縮の詳細については、[履歴圧縮](history-compression.md)を参照してください。

このノードは次の目的で使用できます。

- トークン使用量を削減するために長い会話を管理する。
- コンテキストを維持するために会話履歴を要約する。
- 長時間実行されるエージェントでメモリ管理を実装する。

以下に例を示します。

```kotlin
val compressHistory by nodeLLMCompressHistory<String>(
    "compressHistory",
    strategy = HistoryCompressionStrategy.FromLastNMessages(10),
    preserveMemory = true
)
edge(someNode forwardTo compressHistory)
```

## ツールノード

### nodeExecuteTool

単一のツール呼び出しを実行し、その結果を返すノードです。このノードは、LLMによって行われたツール呼び出しを処理するために使用されます。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)を参照してください。

このノードは次の目的で使用できます。

- LLMによって要求されたツールを実行する。
- LLMの決定に応じて特定のアクションを処理する。
- エージェントワークフローに外部機能を統合する。

以下に例を示します。

```kotlin
val executeToolCall by nodeExecuteTool("executeToolCall")
edge(llmNode forwardTo executeToolCall onToolCall { true })
```

### nodeLLMSendToolResult

ツール結果をプロンプトに追加し、LLM応答を要求するノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)を参照してください。

このノードは次の目的で使用できます。

- ツール実行の結果を処理する。
- ツール出力に基づいて応答を生成する。
- ツール実行後に会話を続ける。

以下に例を示します。

```kotlin
val processToolResult by nodeLLMSendToolResult("processToolResult")
edge(executeToolCall forwardTo processToolResult)
```

### nodeExecuteMultipleTools

複数のツール呼び出しを実行するノードです。これらの呼び出しはオプションで並行して実行できます。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)を参照してください。

このノードは次の目的で使用できます。

- 複数のツールを並行して実行する。
- 複数のツール実行を必要とする複雑なワークフローを処理する。
- ツール呼び出しをバッチ処理することでパフォーマンスを最適化する。

以下に例を示します。

```kotlin
val executeMultipleTools by nodeExecuteMultipleTools("executeMultipleTools")
edge(llmNode forwardTo executeMultipleTools)
```

### nodeLLMSendMultipleToolResults

複数のツール結果をプロンプトに追加し、複数のLLM応答を取得するノードです。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)を参照してください。

このノードは次の目的で使用できます。

- 複数のツール実行の結果を処理する。
- 複数のツール呼び出しを生成する。
- 複数の並行アクションを含む複雑なワークフローを実装する。

以下に例を示します。

```kotlin
val processMultipleToolResults by nodeLLMSendMultipleToolResults("processMultipleToolResults")
edge(executeMultipleTools forwardTo processMultipleToolResults)
```

## 事前定義されたサブグラフ

このフレームワークは、一般的に使用されるパターンとワークフローをカプセル化した事前定義されたサブグラフを提供します。これらのサブグラフは、ベースノードとエッジの作成を自動的に処理することで、複雑なエージェント戦略の開発を簡素化します。

事前定義されたサブグラフを使用すると、さまざまな一般的なパイプラインを実装できます。以下に例を示します。

1. データを準備する。
2. タスクを実行する。
3. タスク結果を検証する。結果が正しくない場合、調整を行うためのフィードバックメッセージとともにステップ2に戻る。

### subgraphWithTask

提供されたツールを使用して特定のタスクを実行し、構造化された結果を返すサブグラフです。このサブグラフは、より大きなワークフロー内で自己完結型のタスクを処理するように設計されています。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-task.html)を参照してください。

このサブグラフは次の目的で使用できます。

- より大きなワークフロー内で特定のタスクを処理する特殊なコンポーネントを作成する。
- 明確な入出力インターフェースで複雑なロジックをカプセル化する。
- タスク固有のツール、モデル、プロンプトを設定する。
- 自動圧縮で会話履歴を管理する。
- 構造化されたエージェントワークフローとタスク実行パイプラインを開発する。
- LLMタスク実行から構造化された結果を生成する。

サブグラフにタスクをテキストとして提供し、必要に応じてLLMを設定し、必要なツールを提供すると、サブグラフがそのタスクを処理して解決します。以下に例を示します。

```kotlin
val processQuery by subgraphWithTask<String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    model = OpenAIModels.Chat.GPT4o,
    shouldTLDRHistory = true
) { userQuery ->
    """
    You are a helpful assistant that can answer questions about various topics.
    Please help with the following query:
    $userQuery
    """
}
```

### subgraphWithVerification

`subgraphWithTask`の特殊なバージョンで、タスクが正しく実行されたかを確認し、発生した問題の詳細を提供します。このサブグラフは、検証または品質チェックを必要とするワークフローに役立ちます。詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-ext/ai.koog.agents.ext.agent/subgraph-with-verification.html)を参照してください。

このサブグラフは次の目的で使用できます。

- タスク実行の正確性を検証する。
- ワークフローに品質管理プロセスを実装する。
- 自己検証コンポーネントを作成する。
- 成功/失敗ステータスと詳細なフィードバックを含む構造化された検証結果を生成する。

このサブグラフは、LLMがワークフローの最後に検証ツールを呼び出し、タスクが正常に完了したかどうかをチェックすることを保証します。この検証が最終ステップとして実行されることを保証し、タスクが正常に完了したかどうかを示す`VerifiedSubgraphResult`と詳細なフィードバックを返します。
以下に例を示します。

```kotlin
val verifyCode by subgraphWithVerification(
    tools = listOf(runTestsTool, analyzeTool, readFileTool),
    model = AnthropicModels.Sonnet_3_7
) { codeToVerify ->
    """
    You are a code reviewer. Please verify that the following code meets all requirements:
    1. It compiles without errors
    2. All tests pass
    3. It follows the project's coding standards

    Code to verify:
    $codeToVerify
    """
}
```

## 事前定義された戦略と一般的な戦略パターン

このフレームワークは、さまざまなノードを組み合わせた事前定義された戦略を提供します。ノードはエッジを使用して接続され、操作のフローを定義し、各エッジをたどるタイミングを特定する条件が含まれます。

必要に応じて、これらの戦略をエージェントワークフローに統合できます。

### 単一実行戦略

単一実行戦略は、エージェントが一度入力を処理し、結果を返す非対話型のユースケース向けに設計されています。

この戦略は、複雑なロジックを必要としない単純なプロセスを実行する必要がある場合に使用できます。

```kotlin
public fun singleRunStrategy(): AIAgentStrategy = strategy("single_run") {
    val nodeCallLLM by nodeLLMRequest("sendInput")
    val nodeExecuteTool by nodeExecuteTool("nodeExecuteTool")
    val nodeSendToolResult by nodeLLMSendToolResult("nodeSendToolResult")

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeExecuteTool forwardTo nodeSendToolResult)
    edge(nodeSendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
}
```

### ツールベース戦略

ツールベース戦略は、特定の操作を実行するためにツールに大きく依存するワークフロー向けに設計されています。通常、LLMの決定に基づいてツールを実行し、結果を処理します。

```kotlin
fun toolBasedStrategy(name: String, toolRegistry: ToolRegistry): AIAgentStrategy {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        // Define the flow of the agent
        edge(nodeStart forwardTo nodeSendInput)

        // If the LLM responds with a message, finish
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // If the LLM calls a tool, execute it
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // Send the tool result back to the LLM
        edge(nodeExecuteTool forwardTo nodeSendToolResult)

        // If the LLM calls another tool, execute it
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // If the LLM responds with a message, finish
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```

### ストリーミングデータ戦略

ストリーミングデータ戦略は、LLMからのストリーミングデータを処理するために設計されています。通常、ストリーミングデータを要求し、それを処理し、処理されたデータとともにツールを呼び出す可能性があります。

```kotlin
fun streamingDataStrategy(): AIAgentStrategy = strategy("streaming-data") {
    val processStreamingData by node<Unit, String> { _ ->
        val books = mutableListOf<Book>()
        val mdDefinition = markdownBookDefinition()

        llm.writeSession {
            val markdownStream = requestLLMStreaming(mdDefinition)
            parseMarkdownStreamToBooks(markdownStream).collect { book ->
                books.add(book)
                println("Parsed Book: ${book.bookName} by ${book.author}")
            }
        }

        formatOutput(books)
    }

    edge(nodeStart forwardTo processStreamingData)
    edge(processStreamingData forwardTo nodeFinish)
}