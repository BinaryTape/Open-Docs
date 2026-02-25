# LLMセッションと手動履歴管理

このページでは、読み取りおよび書き込みセッションの使用方法、会話履歴の管理、および言語モデルへのリクエスト送信方法など、LLMセッションに関する詳細な情報を提供します。

## はじめに

LLMセッションは、言語モデル（LLM）とやり取りするための構造化された手法を提供する基本的な概念です。これらは会話履歴の管理、LLMへのリクエストの処理、およびツールの実行やレスポンス処理のための統一されたインターフェースを提供します。

## LLMセッションの理解

LLMセッションは、言語モデルとやり取りするためのコンテキスト（文脈）を表します。これには以下のものがカプセル化されています：

- 会話履歴（プロンプト）
- 利用可能なツール
- LLMへのリクエスト送信メソッド
- 会話履歴の更新メソッド
- ツールの実行メソッド

セッションは `AIAgentLLMContext` クラスによって管理され、このクラスが読み取りおよび書き込みセッションを作成するためのメソッドを提供します。

### セッションの種類

Koogフレームワークは、2種類のセッションを提供します：

1. **書き込みセッション** (`AIAgentLLMWriteSession`): プロンプトやツールの変更、LLMリクエストの送信、およびツールの実行が可能です。書き込みセッションで行われた変更は、LLMコンテキストに反映（永続化）されます。

2. **読み取りセッション** (`AIAgentLLMReadSession`): プロンプトやツールへの読み取り専用アクセスを提供します。状態を変更せずに現在の内容を確認するのに適しています。

主な違いは、書き込みセッションは会話履歴を変更できるのに対し、読み取りセッションは変更できない点です。

### セッションのライフサイクル

セッションには定義されたライフサイクルがあります：

1. **作成**: `llm.writeSession { ... }` または `llm.readSession { ... }` を使用してセッションが作成されます。
2. **アクティブフェーズ**: ラムダブロックが実行されている間、セッションはアクティブです。
3. **終了**: ラムダブロックが完了すると、セッションは自動的に閉じられます。

セッションは `AutoCloseable` インターフェースを実装しており、例外が発生した場合でも適切にクリーンアップされることが保証されます。

## LLMセッションの操作

### セッションの作成

セッションは、`AIAgentLLMContext` クラスの拡張関数を使用して作成されます：

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
// 書き込みセッションの作成
llm.writeSession {
    // セッションのコードをここに記述
}

// 読み取りセッションの作成
llm.readSession {
    // セッションのコードをここに記述
}
```
<!--- KNIT example-sessions-01.kt -->

これらの関数は、セッションのコンテキスト内で実行されるラムダブロックを受け取ります。ブロックが完了すると、セッションは自動的に閉じられます。

### セッションのスコープとスレッド安全性

セッションはスレッド安全性を確保するために読み書きロック（read-write lock）を使用します：

- 複数の読み取りセッションを同時にアクティブにできます。
- 書き込みセッションは一度に1つだけアクティブにできます。
- 書き込みセッションは、他のすべてのセッション（読み取り・書き込みの両方）をブロックします。

これにより、並行した変更によって会話履歴が破損しないことが保証されます。

### セッションプロパティへのアクセス

セッション内では、プロンプトやツールにアクセスできます：

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

書き込みセッションでは、これらのプロパティを変更することもできます：

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
    // プロンプトの変更
    appendPrompt {
        user("New user message")
    }

    // ツールの変更
    tools = newTools
}
```
<!--- KNIT example-sessions-03.kt -->

詳細については、[AIAgentLLMReadSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMReadSession) および [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) の詳細なAPIリファレンスを参照してください。

## LLMリクエストの送信

### 基本的なリクエストメソッド

LLMリクエストを送信するための最も一般的なメソッドは以下の通りです：

1. `requestLLM()`: 現在のプロンプトとツールを使用してLLMにリクエストを送信し、単一のレスポンスを返します。

2. `requestLLMMultiple()`: 現在のプロンプトとツールを使用してLLMにリクエストを送信し、複数のレスポンスを返します。

3. `requestLLMWithoutTools()`: 現在のプロンプトを使用し、ツールは使用せずにLLMにリクエストを送信し、単一のレスポンスを返します。

4. `requestLLMForceOneTool`: 現在のプロンプトとツールを使用してLLMにリクエストを送信し、1つのツールの使用を強制します。

5. `requestLLMOnlyCallingTools`: ツールのみを使用して処理されるべきリクエストをLLMに送信します。

例：

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
    // ツールを有効にしてリクエストを送信
    val response = requestLLM()

    // ツールなしでリクエストを送信
    val responseWithoutTools = requestLLMWithoutTools()

    // 複数のレスポンスを返すリクエストを送信
    val responses = requestLLMMultiple()
}
```
<!--- KNIT example-sessions-04.kt -->

### リクエストの仕組み

LLMリクエストは、いずれかのリクエストメソッドを明示的に呼び出したときに送信されます。理解しておくべき重要なポイントは以下の通りです：

1. **明示的な呼び出し**: リクエストは、`requestLLM()` や `requestLLMWithoutTools()` などのメソッドを呼び出したときにのみ発生します。
2. **即時実行**: リクエストメソッドを呼び出すと、リクエストは即座に実行され、レスポンスを受信するまでメソッドはブロックされます。
3. **履歴の自動更新**: 書き込みセッションでは、レスポンスが自動的に会話履歴に追加されます。
4. **暗黙的なリクエストなし**: システムは暗黙的なリクエストを行いません。リクエストメソッドを明示的に呼び出す必要があります。

### ツールを使用したリクエストメソッド

ツールを有効にしてリクエストを送信すると、LLMはテキストレスポンスの代わりにツール呼び出し（tool call）を返すことがあります。リクエストメソッドはこれを透過的に処理します：

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

    // レスポンスはツール呼び出し、またはテキストレスポンスの可能性があります
    if (response is Message.Tool.Call) {
        // ツール呼び出しの処理
    } else {
        // テキストレスポンスの処理
    }
}
```
<!--- KNIT example-sessions-05.kt -->

実際には、エージェントグラフがこのルーティングを自動的に処理するため、通常はレスポンスの型を手動でチェックする必要はありません。

### 構造化リクエストとストリーミングリクエスト

より高度なユースケースのために、プラットフォームは構造化リクエストとストリーミングリクエストのためのメソッドを提供しています：

1. `requestLLMStructured()`: LLMに対して、特定の構造化されたフォーマットでレスポンスを返すようリクエストします。

2. `requestLLMStructuredOneShot()`: `requestLLMStructured()` と同様ですが、再試行や修正は行われません。

3. `requestLLMStreaming()`: LLMに対してストリーミングリクエストを送信し、レスポンスチャンクの Flow を返します。

例：

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
    // 構造化リクエストを送信
    val structuredResponse = requestLLMStructured<JokeRating>()

    // ストリーミングリクエストを送信
    val responseStream = requestLLMStreaming()
    responseStream.collect { chunk ->
        // 各チャンクが到着するたびに処理
    }
}
```
<!--- KNIT example-sessions-06.kt -->

## 会話履歴の管理

### プロンプトの更新

書き込みセッションでは、`appendPrompt` メソッドを使用してプロンプト（会話履歴）にメッセージを追加できます：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.RequestMetaInfo
import kotlin.time.Clock

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
        // システムメッセージの追加
        system("You are a helpful assistant.")

        // ユーザーメッセージの追加
        user("Hello, can you help me with a coding question?")

        // アシスタントメッセージの追加
        assistant("Of course! What's your question?")

        // ツール結果の追加
        tool {
            result(myToolResult)
        }
    }
}
```
<!--- KNIT example-sessions-07.kt -->

また、`rewritePrompt` メソッドを使用してプロンプトを完全に書き換えることも可能です：

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
        // 古いプロンプトを基に新しいプロンプトを作成
        oldPrompt.copy(messages = filteredMessages)
    }
}
```
<!--- KNIT example-sessions-08.kt -->

### レスポンス時の履歴の自動更新

書き込みセッションでLLMリクエストを送信すると、レスポンスは自動的に会話履歴に追加されます：

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
    // ユーザーメッセージを追加
    appendPrompt {
        user("What's the capital of France?")
    }

    // リクエストを送信 – レスポンスは自動的に履歴に追加される
    val response = requestLLM()

    // この時点でプロンプトには、ユーザーメッセージとモデルのレスポンスの両方が含まれている
}
```
<!--- KNIT example-sessions-09.kt -->

この自動的な履歴更新は書き込みセッションの主要な機能であり、会話が自然に流れるようにします。

### 履歴の圧縮

会話が長くなると、履歴が膨大になり、多くのトークンを消費する可能性があります。プラットフォームは履歴を圧縮するためのメソッドを提供しています：

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
    // TLDR（要約）アプローチを使用して履歴を圧縮する
    replaceHistoryWithTLDR(HistoryCompressionStrategy.WholeHistory, preserveMemory = true)
}
```
<!--- KNIT example-sessions-10.kt -->

また、ストラテジーグラフ内で `nodeLLMCompressHistory` ノードを使用して、特定のポイントで履歴を圧縮することもできます。

履歴の圧縮と圧縮戦略に関する詳細は、[履歴の圧縮](history-compression.md)を参照してください。

## セッションでのツールの実行

### ツールの呼び出し

書き込みセッションは、ツールを呼び出すためのいくつかのメソッドを提供します：

1. `callTool(tool, args)`: 参照によってツールを呼び出します。

2. `callTool(toolName, args)`: 名前によってツールを呼び出します。

3. `callTool(toolClass, args)`: クラスによってツールを呼び出します。

4. `callToolRaw(toolName, args)`: 名前によってツールを呼び出し、生の文字列の結果を返します。

例：

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
    // 参照によるツールの呼び出し
    val result = callTool(myTool, myArgs)

    // 名前によるツールの呼び出し
    val result2 = callTool("myToolName", myArgs)

    // クラスによるツールの呼び出し
    val result3 = callTool(MyTool::class, myArgs)

    // ツールを呼び出し、生の結果を取得
    val rawResult = callToolRaw("myToolName", myArgs)
}
```
<!--- KNIT example-sessions-11.kt -->

### ツールの並列実行

複数のツールを並列に実行するために、書き込みセッションは `Flow` の拡張関数を提供します：

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
    // ツールを並列に実行
    parseDataToArgs(data).toParallelToolCalls(MyTool::class).collect { result ->
        // 各結果を処理
    }

    // ツールを並列に実行し、生の結果を取得
    parseDataToArgs(data).toParallelToolCallsRaw(MyTool::class).collect { rawResult ->
        // 各生の結果を処理
    }
}
```
<!--- KNIT example-sessions-12.kt -->

これは、大量のデータを効率的に処理する場合に便利です。

## ベストプラクティス

LLMセッションを操作する際は、以下のベストプラクティスに従ってください：

1. **適切なセッションタイプを使用する**: 会話履歴を変更する必要がある場合は書き込みセッションを使用し、読み取るだけでよい場合は読み取りセッションを使用してください。

2. **セッションを短く保つ**: セッションは特定のタスクに集中させ、リソースを解放するためにできるだけ早く閉じるようにしてください。

3. **例外を処理する**: リソースリークを防ぐため、セッション内で例外を適切に処理してください。

4. **履歴のサイズを管理する**: 長時間の会話では、トークンの使用量を減らすために履歴の圧縮を使用してください。

5. **抽象度の高いAPIを優先する**: 可能な場合は、ノードベースのAPI（例：直接セッションを操作する代わりに `nodeLLMRequest` を使用するなど）を利用してください。

6. **スレッド安全性に留意する**: 書き込みセッションは他のセッションをブロックすることを念頭に置き、書き込み操作は可能な限り短くしてください。

7. **複雑なデータには構造化リクエストを使用する**: LLMに構造化されたデータを返させる必要がある場合は、自由形式のテキストをパースするのではなく、`requestLLMStructured` を使用してください。

8. **長いレスポンスにはストリーミングを使用する**: 長いレスポンスの場合は、`requestLLMStreaming` を使用してレスポンスが届くたびに逐次処理するようにしてください。

## トラブルシューティング

### セッションが既に閉じられている (Session already closed)

`Cannot use session after it was closed` のようなエラーが表示される場合、ラムダブロックが完了した後にセッションを使用しようとしています。すべてのセッション操作がセッションブロック内で行われていることを確認してください。

### 履歴が大きすぎる (History too large)

履歴が大きくなりすぎてトークンを大量に消費する場合は、履歴圧縮テクニックを使用してください：

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
    // 直近10メッセージを残して圧縮する
    replaceHistoryWithTLDR(HistoryCompressionStrategy.FromLastNMessages(10), preserveMemory = true)
}
```
<!--- KNIT example-sessions-13.kt -->

詳細は、[履歴の圧縮](history-compression.md)を参照してください。

### ツールが見つからない (Tool not found)

ツールが見つからないというエラーが表示される場合は、以下を確認してください：

- ツールがツールレジストリに正しく登録されているか。
- 正しいツール名またはクラスを使用しているか。

## APIドキュメント

詳細については、[AIAgentLLMSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMSession) および [AIAgentLLMContext](api:agents-core::ai.koog.agents.core.agent.context.AIAgentLLMContext) の全リファレンスを参照してください。