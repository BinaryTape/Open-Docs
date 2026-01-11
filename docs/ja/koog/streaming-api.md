# ストリーミングAPI

## はじめに

Koogの**ストリーミングAPI**を使用すると、`Flow<StreamFrame>`として**LLMの出力をインクリメンタルに**消費できます。完全な応答を待つ代わりに、コードは以下のことができます。

- アシスタントテキストが到着するとすぐにレンダリングする
- **ツール呼び出し**をリアルタイムで検出し、それに基づいて動作する
- ストリームがいつ**終了したか、そしてその理由を知る

ストリームは**型付けされたフレーム**を運びます。

- `StreamFrame.Append(text: String)` — インクリメンタルなアシスタントテキスト
- `StreamFrame.ToolCall(id: String?, name: String, content: String)` — ツール呼び出し（安全に結合されます）
- `StreamFrame.End(finishReason: String?)` — ストリーム終了マーカー

プレーンテキストを抽出し、フレームを`Message.Response`オブジェクトに変換し、安全に**チャンク化されたツール呼び出しを結合する**ためのヘルパーが提供されています。

---

## ストリーミングAPIの概要

ストリーミングを使用すると、次のことができます。

- データが到着するとすぐに処理する（UIの応答性を向上させます）
- 構造化情報をその場でパースする（Markdown/JSONなど）
- オブジェクトが完成するとすぐに発行する
- ツールをリアルタイムでトリガーする

**フレーム**自体を操作することも、フレームから派生した**プレーンテキスト**を操作することもできます。

---
## 使用方法

### フレームを直接操作する

これは最も一般的なアプローチであり、各フレームの種類に反応します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.streaming.StreamFrame

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    appendPrompt { user("Tell me a joke, then call a tool with JSON args.") }

    val stream = requestLLMStreaming() // Flow<StreamFrame>

    stream.collect { frame ->
        when (frame) {
            is StreamFrame.Append -> print(frame.text)
            is StreamFrame.ToolCall -> {
                println("
🔧 Tool call: ${frame.name} args=${frame.content}")
                // Optionally parse lazily:
                // val json = frame.contentJson
            }
            is StreamFrame.End -> println("
[END] reason=${frame.finishReason}")
        }
    }
}
```
<!--- KNIT example-streaming-api-01.kt -->

生の文字列ストリームを直接操作して出力をパースできることに注意することが重要です。
このアプローチにより、パース処理に対する柔軟性と制御が向上します。

以下は、出力構造のMarkdown定義を含む生の文字列ストリームです。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.structure.markdown.MarkdownStructureDefinition

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
fun markdownBookDefinition(): MarkdownStructureDefinition {
    return MarkdownStructureDefinition("name", schema = { /*...*/ })
}

val mdDefinition = markdownBookDefinition()

llm.writeSession {
    val stream = requestLLMStreaming(mdDefinition)
    // Access the raw string chunks directly
    stream.collect { chunk ->
        // Process each chunk of text as it arrives
        println("Received chunk: $chunk") // The chunks together will be structured as a text following the mdDefinition schema
    }
}
```
<!--- KNIT example-streaming-api-02.kt -->

### 生のテキストストリーム（派生）を操作する

既存のストリーミングパーサーが`Flow<String>`を期待する場合、
`filterTextOnly()`でテキストチャンクを派生させるか、`collectText()`でそれらを収集します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.streaming.filterTextOnly
import ai.koog.prompt.streaming.collectText

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    val frames = requestLLMStreaming()

    // Stream text chunks as they come:
    frames.filterTextOnly().collect { chunk -> print(chunk) }

    // Or, gather all text into one String after End:
    val fullText = frames.collectText()
    println("
---
$fullText")
}
```
<!--- KNIT example-streaming-api-02-01.kt -->

### イベントハンドラでストリームイベントをリッスンする

[エージェントイベントハンドラ](agent-event-handlers.md)でストリームイベントをリッスンできます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.agent.GraphAIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.streaming.StreamFrame
import ai.koog.prompt.structure.markdown.MarkdownStructureDefinition

fun GraphAIAgent.FeatureContext.installStreamingApi() {
-->
<!--- SUFFIX
}
-->
```kotlin
handleEvents {
    onToolCallStarting { context ->
        println("
🔧 Using ${context.toolName} with ${context.toolArgs}... ")
    }
    onLLMStreamingFrameReceived { context ->
        (context.streamFrame as? StreamFrame.Append)?.let { frame ->
            print(frame.text)
        }
    }
    onLLMStreamingFailed { context -> 
        println("❌ Error: ${context.error}")
    }
    onLLMStreamingCompleted {
        println("🏁 Done")
    }
}
```
<!--- KNIT example-streaming-api-02-02.kt -->

### フレームを`Message.Response`に変換する

収集されたフレームのリストを標準のメッセージオブジェクトに変換できます。
- `toAssistantMessageOrNull()`
- `toToolCallMessages()`
- `toMessageResponses()`

---

## 例

### ストリーミング中の構造化データ（Markdownの例）

生の文字列ストリームを操作することも可能ですが、
[構造化データ](structured-output.md)を操作する方がより便利な場合が多くあります。

構造化データのアプローチには、以下の主要なコンポーネントが含まれます。

1.  **MarkdownStructureDefinition**: Markdown形式で構造化データのスキーマと例を定義するのに役立つクラス。
2.  **markdownStreamingParser**: Markdownチャンクのストリームを処理し、イベントを発行するパーサーを作成する関数。

以下のセクションでは、構造化データのストリームを処理することに関連する段階的な手順とコードサンプルを提供します。

#### 1. データ構造を定義する

まず、構造化データを表すデータクラスを定義します。

<!--- INCLUDE
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)
```
<!--- KNIT example-streaming-api-03.kt -->

#### 2. Markdown構造を定義する

`MarkdownStructureDefinition`クラスを使用して、Markdownでデータがどのように構造化されるべきかを指定する定義を作成します。

<!--- INCLUDE
import ai.koog.prompt.markdown.markdown
import ai.koog.prompt.structure.markdown.MarkdownStructureDefinition
-->
```kotlin
fun markdownBookDefinition(): MarkdownStructureDefinition {
    return MarkdownStructureDefinition("bookList", schema = {
        markdown {
            header(1, "title")
            bulleted {
                item("author")
                item("description")
            }
        }
    }, examples = {
        markdown {
            header(1, "The Great Gatsby")
            bulleted {
                item("F. Scott Fitzgerald")
                item("A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.")
            }
        }
    })
}
```
<!--- KNIT example-streaming-api-04.kt -->

#### 3. データ構造のパーサーを作成する

`markdownStreamingParser`は、さまざまなMarkdown要素に対応する複数のハンドラを提供します。

<!--- INCLUDE
import ai.koog.agents.example.exampleStreamingApi03.Book
import ai.koog.prompt.structure.markdown.markdownStreamingParser
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

fun parseMarkdownStreamToBooks(markdownStream: Flow<String>): Flow<Book> {
    return flow {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
markdownStreamingParser {
    // Handle level 1 headings (level ranges from 1 to 6)
    onHeader(1) { headerText -> }
    // Handle bullet points
    onBullet { bulletText -> }
    // Handle code blocks
    onCodeBlock { codeBlockContent -> }
    // Handle lines matching a regex pattern
    onLineMatching(Regex("pattern")) { line -> }
    // Handle the end of the stream
    onFinishStream { remainingText -> }
}
```
<!--- KNIT example-streaming-api-05.kt -->

定義されたハンドラを使用して、`markdownStreamingParser`関数でMarkdownストリームをパースし、データオブジェクトを発行する関数を実装できます。

<!--- INCLUDE
import ai.koog.agents.example.exampleStreamingApi03.Book
import ai.koog.prompt.structure.markdown.markdownStreamingParser
import ai.koog.prompt.streaming.StreamFrame
import ai.koog.prompt.streaming.filterTextOnly
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

-->
```kotlin
fun parseMarkdownStreamToBooks(markdownStream: Flow<StreamFrame>): Flow<Book> {
   return flow {
      markdownStreamingParser {
         var currentBookTitle = ""
         val bulletPoints = mutableListOf<String>()

         // Handle the event of receiving the Markdown header in the response stream
         onHeader(1) { headerText ->
            // If there was a previous book, emit it
            if (currentBookTitle.isNotEmpty() && bulletPoints.isNotEmpty()) {
               val author = bulletPoints.getOrNull(0) ?: ""
               val description = bulletPoints.getOrNull(1) ?: ""
               emit(Book(currentBookTitle, author, description))
            }

            currentBookTitle = headerText
            bulletPoints.clear()
         }

         // Handle the event of receiving the Markdown bullets list in the response stream
         onBullet { bulletText ->
            bulletPoints.add(bulletText)
         }

         // Handle the end of the response stream
         onFinishStream {
            // Emit the last book, if present
            if (currentBookTitle.isNotEmpty() && bulletPoints.isNotEmpty()) {
               val author = bulletPoints.getOrNull(0) ?: ""
               val description = bulletPoints.getOrNull(1) ?: ""
               emit(Book(currentBookTitle, author, description))
            }
         }
      }.parseStream(markdownStream.filterTextOnly())
   }
}
```
<!--- KNIT example-streaming-api-06.kt -->

#### 4. エージェント戦略でパーサーを使用する

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi03.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
   // Describe the node containing the output stream parsing
   val getMdOutput by node<String, List<Book>> { booksDescription ->
      val books = mutableListOf<Book>()
      val mdDefinition = markdownBookDefinition()

      llm.writeSession {
         appendPrompt { user(booksDescription) }
         // Initiate the response stream in the form of the definition `mdDefinition`
         val markdownStream = requestLLMStreaming(mdDefinition)
         // Call the parser with the result of the response stream and perform actions with the result
         parseMarkdownStreamToBooks(markdownStream).collect { book ->
            books.add(book)
            println("Parsed Book: ${book.title} by ${book.author}")
         }
      }

      books
   }
   // Describe the agent's graph making sure the node is accessible
   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-streaming-api-07.kt -->

### 高度な使用法：ツールとのストリーミング

ストリーミングAPIをツールと組み合わせて使用し、データが到着と同時に処理することもできます。
以下のセクションでは、ツールを定義し、ストリーミングデータで使用する方法について簡単な段階的ガイドを提供します。

### 1. データ構造のツールを定義する

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.example.exampleStreamingApi03.Book
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

-->
```kotlin
@Serializable
data class Book(
   val title: String,
   val author: String,
   val description: String
)

class BookTool(): SimpleTool<Book>(
    argsSerializer = Book.serializer(),
    name = NAME,
    description = "A tool to parse book information from Markdown"
) {

    companion object { const val NAME = "book" }

    override suspend fun execute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }
}
```
<!--- KNIT example-streaming-api-08.kt -->

### 2. ストリーミングデータでツールを使用する

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
import ai.koog.agents.example.exampleStreamingApi08.BookTool
import ai.koog.agents.core.agent.session.callToolRaw

-->
```kotlin
val agentStrategy = strategy<String, Unit>("library-assistant") {
   val getMdOutput by node<String, Unit> { input ->
      val mdDefinition = markdownBookDefinition()

      llm.writeSession {
         appendPrompt { user(input) }
         val markdownStream = requestLLMStreaming(mdDefinition)

         parseMarkdownStreamToBooks(markdownStream).collect { book ->
            callToolRaw(BookTool.NAME, book)
            /* Other possible options:
                callTool(BookTool::class, book)
                callTool<BookTool>(book)
                findTool(BookTool::class).execute(book)
            */
         }

         // We can make parallel tool calls
         parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(toolClass=BookTool::class).collect {
            println("Tool call result: $it")
         }
      }
   }

   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
 }
```
<!--- KNIT example-streaming-api-09.kt -->

### 3. エージェント構成でツールを登録する

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleComplexWorkflowAgents01.token
import ai.koog.agents.example.exampleComplexWorkflowAgents06.agentStrategy
import ai.koog.agents.example.exampleComplexWorkflowAgents07.agentConfig
import ai.koog.agents.example.exampleStreamingApi08.BookTool
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

-->
```kotlin
val toolRegistry = ToolRegistry {
   tool(BookTool())
}

val runner = AIAgent(
   promptExecutor = simpleOpenAIExecutor(token),
   toolRegistry = toolRegistry,
   strategy = agentStrategy,
   agentConfig = agentConfig
)
```
<!--- KNIT example-streaming-api-10.kt -->

## ベストプラクティス

1.  **明確な構造を定義する**: データのために明確で曖昧さのないMarkdown構造を作成します。

2.  **良い例を提供する**: `MarkdownStructureDefinition`に包括的な例を含めて、LLMをガイドします。

3.  **不完全なデータを処理する**: ストリームからデータをパースする際は、常にnullまたは空の値をチェックします。

4.  **リソースをクリーンアップする**: `onFinishStream`ハンドラを使用して、リソースをクリーンアップし、残りのデータを処理します。

5.  **エラーを処理する**: 不正な形式のMarkdownや予期せぬデータに対して、適切なエラー処理を実装します。

6.  **テスト**: パーサーを、部分的なチャンクや不正な形式の入力を含む、さまざまな入力シナリオでテストします。

7.  **並列処理**: 独立したデータ項目については、パフォーマンス向上のために並列ツール呼び出しの使用を検討します。