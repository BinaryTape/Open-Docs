# LLMセッションと手動での履歴管理

このページでは、LLMセッションについて、読み書きセッションの操作方法、会話履歴の管理、言語モデルへのリクエスト方法など、詳細情報を提供します。

## はじめに

LLMセッションは、言語モデル（LLM）とやり取りするための構造化された方法を提供する基本的な概念です。これらは会話履歴を管理し、LLMへのリクエストを処理し、ツールを実行して応答を処理するための一貫したインターフェースを提供します。

## LLMセッションの理解

LLMセッションは、言語モデルとやり取りするためのコンテキストを表します。これは以下をカプセル化します。

- 会話履歴（プロンプト）
- 利用可能なツール
- LLMへのリクエストを行うメソッド
- 会話履歴を更新するメソッド
- ツールを実行するメソッド

セッションは、読み書きセッションを作成するメソッドを提供する `AIAgentLLMContext` クラスによって管理されます。

### セッションの種類

Koogフレームワークは2種類のセッションを提供します。

1.  **書き込みセッション** (`AIAgentLLMWriteSession`): プロンプトとツールを変更し、LLMリクエストを行い、ツールを実行できます。書き込みセッションで行われた変更は、LLMコンテキストに永続化されます。

2.  **読み取りセッション** (`AIAgentLLMReadSession`): プロンプトとツールへの読み取り専用アクセスを提供します。これらは、変更を加えることなく現在の状態を検査するのに役立ちます。

主な違いは、書き込みセッションは会話履歴を変更できるのに対し、読み取りセッションは変更できない点です。

### セッションのライフサイクル

セッションには明確なライフサイクルがあります。

1.  **作成**: セッションは `llm.writeSession { ... }` または `llm.readSession { ... }` を使用して作成されます。
2.  **アクティブフェーズ**: ラムダブロックが実行されている間、セッションはアクティブです。
3.  **終了**: ラムダブロックが完了すると、セッションは自動的に閉じられます。

セッションは `AutoCloseable` インターフェースを実装しており、例外が発生した場合でも適切にクリーンアップされることを保証します。

## LLMセッションの操作

### セッションの作成

セッションは `AIAgentLLMContext` クラスの拡張関数を使用して作成されます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
// Creating a write session
llm.writeSession {
    // Session code here
}

// Creating a read session
llm.readSession {
    // Session code here
}
```
<!--- KNIT example-sessions-01.kt -->

これらの関数は、セッションのコンテキスト内で実行されるラムダブロックを受け取ります。ブロックが完了すると、セッションは自動的に閉じられます。

### セッションスコープとスレッドセーフティ

セッションはスレッドセーフティを確保するために読み書きロックを使用します。

- 複数の読み取りセッションを同時にアクティブにできます。
- 書き込みセッションは一度に1つのみアクティブにできます。
- 書き込みセッションは、他のすべてのセッション（読み取りおよび書き込みの両方）をブロックします。

これにより、会話履歴が同時変更によって破損しないことが保証されます。

### セッションプロパティへのアクセス

セッション内では、プロンプトとツールにアクセスできます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.readSession {
    val messageCount = prompt.messages.size
    val availableTools = tools.map { it.name }
}
```
<!--- KNIT example-sessions-02.kt -->

書き込みセッションでは、これらのプロパティを変更することもできます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolDescriptor

val newTools = listOf<ToolDescriptor>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Modify the prompt
    appendPrompt {
        user("New user message")
    }

    // Modify the tools
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

詳細については、[AIAgentLLMReadSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-read-session/index.html) および [AIAgentLLMWriteSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html) の詳細なAPIリファレンスを参照してください。

## LLMリクエストの作成

### 基本的なリクエストメソッド

LLMリクエストを行うための最も一般的なメソッドは次のとおりです。

1.  `requestLLM()`: 現在のプロンプトとツールを使用してLLMにリクエストを行い、単一の応答を返します。

2.  `requestLLMMultiple()`: 現在のプロンプトとツールを使用してLLMにリクエストを行い、複数の応答を返します。

3.  `requestLLMWithoutTools()`: 現在のプロンプトを使用するがツールなしでLLMにリクエストを行い、単一の応答を返します。

4.  `requestLLMForceOneTool`: 現在のプロンプトとツールを使用してLLMにリクエストを行い、1つのツールの使用を強制します。

5.  `requestLLMOnlyCallingTools`: ツールのみを使用することによって処理されるべきLLMへのリクエストを行います。

例:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a request with tools enabled
    val response = requestLLM()

    // Make a request without tools
    val responseWithoutTools = requestLLMWithoutTools()

    // Make a request that returns multiple responses
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### リクエストの仕組み

LLMリクエストは、リクエストメソッドのいずれかを明示的に呼び出したときに作成されます。理解すべき重要な点は次のとおりです。

1.  **明示的な呼び出し**: リクエストは、`requestLLM()`、`requestLLMWithoutTools()` などのメソッドを呼び出したときにのみ発生します。
2.  **即時実行**: リクエストメソッドを呼び出すと、リクエストはすぐに作成され、メソッドは応答が受信されるまでブロックします。
3.  **自動履歴更新**: 書き込みセッションでは、応答は会話履歴に自動的に追加されます。
4.  **暗黙のリクエストなし**: システムは暗黙的なリクエストを行いません。リクエストメソッドを明示的に呼び出す必要があります。

### ツールを使用するリクエストメソッド

ツールが有効な状態でリクエストを行うと、LLMはテキスト応答の代わりにツール呼び出しで応答する場合があります。リクエストメソッドはこれを透過的に処理します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    val response = requestLLM()

    // The response might be a tool call or a text response
    if (response is Message.Tool.Call) {
        // Handle tool call
    } else {
        // Handle text response
    }
}
```
<!--- KNIT example-sessions-05.kt -->

実際には、エージェントグラフがこのルーティングを自動的に処理するため、通常は応答タイプを手動で確認する必要はありません。

### 構造化リクエストとストリーミングリクエスト

より高度なユースケースのために、このプラットフォームは構造化リクエストとストリーミングリクエストのメソッドを提供します。

1.  `requestLLMStructured()`: 特定の構造化された形式で応答を提供するようLLMに要求します。

2.  `requestLLMStructuredOneShot()`: `requestLLMStructured()` に似ていますが、リトライや修正はありません。

3.  `requestLLMStreaming()`: LLMにストリーミングリクエストを行い、応答チャンクのフローを返します。

例:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleParallelNodeExecution07.JokeRating

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Make a structured request
    val structuredResponse = requestLLMStructured<JokeRating>()

    // Make a streaming request
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // Process each chunk as it arrives
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 会話履歴の管理

### プロンプトの更新

書き込みセッションでは、`appendPrompt` メソッドを使用してプロンプト（会話履歴）にメッセージを追加できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlinx.datetime.Clock

val myToolResult = Message.Tool.Result(
    id = "",
    tool = "",
    content = "",
    metaInfo = RequestMetaInfo(Clock.System.now())
)

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    appendPrompt {
        // Add a system message
        system("You are a helpful assistant.")

        // Add a user message
        user("Hello, can you help me with a coding question?")

        // Add an assistant message
        assistant("Of course! What's your question?")

        // Add a tool result
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

また、`rewritePrompt` メソッドを使用してプロンプトを完全に書き換えることもできます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message

val filteredMessages = emptyList<Message>()

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    rewritePrompt { oldPrompt ->
        // Create a new prompt based on the old one
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### 応答時の履歴自動更新

書き込みセッションでLLMリクエストを行うと、応答は会話履歴に自動的に追加されます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Add a user message
    appendPrompt {
        user("What's the capital of France?")
    }

    // Make a request – the response is automatically added to the history
    val response = requestLLM()

    // The prompt now includes both the user message and the model's response
}
```
<!--- KNIT example-sessions-09.kt -->

この自動履歴更新は書き込みセッションの主要な機能であり、会話が自然に流れることを保証します。

### 履歴の圧縮

長時間実行される会話では、履歴が大きくなり、多くのトークンを消費する可能性があります。このプラットフォームは履歴を圧縮するためのメソッドを提供します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Compress the history using a TLDR approach
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

また、戦略グラフの `nodeLLMCompressHistory` ノードを使用して、特定のポイントで履歴を圧縮することもできます。

履歴の圧縮と圧縮戦略の詳細については、[履歴の圧縮](history-compression.md) を参照してください。

## セッションでのツールの実行

### ツールの呼び出し

書き込みセッションは、ツールを呼び出すためのいくつかのメソッドを提供します。

1.  `callTool(tool, args)`: 参照によってツールを呼び出します。

2.  `callTool(toolName, args)`: 名前によってツールを呼び出します。

3.  `callTool(toolClass, args)`: クラスによってツールを呼び出します。

4.  `callToolRaw(toolName, args)`: 名前によってツールを呼び出し、生の文字列結果を返します。

例:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.core.agent.session.callTool
import ai.koog.agents.core.agent.session.callToolRaw

val myTool = AskUser
val myArgs = AskUser.Args("this is a string")

typealias MyTool = AskUser

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Call a tool by reference
    val result = callTool(myTool, myArgs)

    // Call a tool by name
    val result2 = callTool("myToolName", myArgs)

    // Call a tool by class
    val result3 = callTool(MyTool::class, myArgs)

    // Call a tool and get the raw result
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### 並行ツール実行

複数のツールを並行して実行するために、書き込みセッションは `Flow` の拡張関数を提供します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import kotlinx.coroutines.flow.flow

typealias MyTool = AskUser

val data = ""
fun parseDataToArgs(data: String) = flow { emit(AskUser.Args(data)) }

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    // Run tools in parallel
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // Process each result
    }

    // Run tools in parallel and get raw results
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // Process each raw result
    }
}
```
<!--- KNIT example-sessions-12.kt -->

これは、大量のデータを効率的に処理するのに役立ちます。

## ベストプラクティス

LLMセッションを操作する際は、次のベストプラクティスに従ってください。

1.  **適切なセッションタイプを使用する**: 会話履歴を変更する必要がある場合は書き込みセッションを、読み取るだけでよい場合は読み取りセッションを使用してください。

2.  **セッションを短く保つ**: セッションは特定のタスクに集中し、リソースを解放するためにできるだけ早く閉じるべきです。

3.  **例外を処理する**: リソースリークを防ぐため、セッション内で例外を確実に処理してください。

4.  **履歴サイズを管理する**: 長時間実行される会話では、履歴圧縮を使用してトークン使用量を削減してください。

5.  **高レベルの抽象化を優先する**: 可能な場合は、セッションと直接やり取りするのではなく、ノードベースのAPI（例: `nodeLLMRequest`）を使用してください。

6.  **スレッドセーフティに留意する**: 書き込みセッションは他のセッションをブロックすることを覚えておいてください。そのため、書き込み操作は可能な限り短くしてください。

7.  **複雑なデータには構造化リクエストを使用する**: LLMに構造化されたデータを返させたい場合は、自由形式のテキストを解析するのではなく、`requestLLMStructured` を使用してください。

8.  **長い応答にはストリーミングを使用する**: 長い応答の場合、`requestLLMStreaming` を使用して、応答が到着するにつれて処理してください。

## トラブルシューティング

### セッションがすでに閉じられている

「`Cannot use session after it was closed`」などのエラーが表示される場合、ラムダブロックが完了した後にセッションを使用しようとしています。すべてのセッション操作がセッションブロック内で実行されていることを確認してください。

### 履歴が大きすぎる

履歴が大きくなりすぎて多くのトークンを消費する場合、履歴圧縮技術を使用してください。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.HistoryCompressionStrategy
import ai.koog.agents.core.dsl.extension.replaceHistoryWithTLDR

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
}
```
<!--- KNIT example-sessions-13.kt -->

詳細については、[履歴の圧縮](history-compression.md) を参照してください。

### ツールが見つからない

ツールが見つからないというエラーが表示される場合、次の点を確認してください。

- ツールがツールレジストリに正しく登録されているか。
- 正しいツール名またはクラスを使用しているか。

## APIドキュメント

詳細については、[AIAgentLLMSession](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-session/index.html) および [AIAgentLLMContext](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.context/-a-i-agent-l-l-m-context/index.html) の完全なリファレンスを参照してください。