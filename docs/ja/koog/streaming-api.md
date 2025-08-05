# ストリーミングAPI

## はじめに

KoogフレームワークのストリーミングAPIを使用すると、大規模言語モデル（LLM）からの構造化データを、応答全体を待つことなく、到着と同時に処理できます。
このページでは、ストリーミングAPIを使用してMarkdown形式の構造化データを効率的に処理する方法について説明します。

## ストリーミングAPIの概要

ストリーミングAPIは、LLMの応答から構造化データをリアルタイムで処理することを可能にします。応答全体を待つ代わりに、以下のことができます。

- データがチャンクで到着するたびに処理する
- 構造化情報をその場でパースする
- 構造化されたオブジェクトが完成したら出力する
- これらのオブジェクトを即座に処理する（収集またはツールに渡す）

このアプローチは、特に以下の利点を提供するため、非常に有用です。

- ユーザーインターフェースの応答性を向上させる
- 大規模な応答を効率的に処理する
- リアルタイムデータ処理パイプラインを実装する

ストリーミングAPIでは、出力を.md形式の*構造化データ*として、または*プレーンテキスト*のチャンクのセットとしてパースできます。

## 生の文字列ストリームを操作する

生の文字列ストリームを直接操作して出力をパースできることに注意することが重要です。
このアプローチにより、パース処理に対する柔軟性と制御が向上します。

以下は、出力構造のMarkdown定義を含む生の文字列ストリームの例です。

```kotlin
fun markdownBookDefinition(): MarkdownStructuredDataDefinition {
    return MarkdownStructuredDataDefinition("name", schema = { /*...*/ })
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

以下は、定義なしの生の文字列ストリームの例です。

```kotlin
llm.writeSession {
    val stream = requestLLMStreaming()
    // Access the raw string chunks directly
    stream.collect { chunk ->
        // Process each chunk of text as it arrives
        println("Received chunk: $chunk") // The chunks will not be structured in a specific way
    }
}
```

## 構造化データのストリームを操作する

生の文字列ストリームを操作することも可能ですが、
[構造化データ](structured-data.md)を操作する方がより便利な場合が多くあります。

構造化データのアプローチには、以下の主要なコンポーネントが含まれます。

1.  **MarkdownStructuredDataDefinition**: Markdown形式で構造化データのスキーマと例を定義するのに役立つクラス。
2.  **markdownStreamingParser**: Markdownチャンクのストリームを処理し、イベントを出力するパーサーを作成する関数。

以下のセクションでは、構造化データのストリームを処理することに関連する段階的な手順とコードサンプルを提供します。

### 1. データ構造を定義する

まず、構造化データを表すデータクラスを定義します。

```kotlin
@Serializable
data class Book(
    val bookName: String,
    val author: String,
    val description: String
)
```

### 2. Markdown構造を定義する

`MarkdownStructuredDataDefinition`クラスを使用して、Markdownでデータがどのように構造化されるべきかを指定する定義を作成します。

```kotlin
fun markdownBookDefinition(): MarkdownStructuredDataDefinition {
    return MarkdownStructuredDataDefinition("bookList", schema = {
        markdown {
            header(1, "bookName")
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

### 3. データ構造のパーサーを作成する

`markdownStreamingParser`は、さまざまなMarkdown要素に対応する複数のハンドラを提供します。

```kotlin
markdownStreamingParser {
    // Handle level 1 headings
    // The heading level can be from 1 to 6
    onHeader(1) { headerText ->
        // Process heading text
    }

    // Handle bullet points
    onBullet { bulletText ->
        // Process bullet text
    }

    // Handle code blocks
    onCodeBlock { codeBlockContent ->
        // Process code block content
    }

    // Handle lines matching a regex pattern
    onLineMatching(Regex("pattern")) { line ->
        // Process matching lines
    }

    // Handle the end of the stream
    onFinishStream { remainingText ->
        // Process any remaining text or perform cleanup
    }
}
```

定義されたハンドラを使用して、`markdownStreamingParser`関数でMarkdownストリームをパースし、データオブジェクトを出力する関数を実装できます。

```kotlin
fun parseMarkdownStreamToBooks(markdownStream: Flow<String>): Flow<Book> {
    return flow {
        markdownStreamingParser {
            var currentBookName = ""
            val bulletPoints = mutableListOf<String>()

            // Handle the event of receiving the Markdown header in the response stream
            onHeader(1) { headerText ->
                // If there was a previous book, emit it
                if (currentBookName.isNotEmpty() && bulletPoints.isNotEmpty()) {
                    val author = bulletPoints.getOrNull(0) ?: ""
                    val description = bulletPoints.getOrNull(1) ?: ""
                    emit(Book(currentBookName, author, description))
                }

                currentBookName = headerText
                bulletPoints.clear()
            }

            // Handle the event of receiving the Markdown bullets list in the response stream
            onBullet { bulletText ->
                bulletPoints.add(bulletText)
            }

            // Handle the end of the response stream
            onFinishStream {
                // Emit the last book, if present
                if (currentBookName.isNotEmpty() && bulletPoints.isNotEmpty()) {
                    val author = bulletPoints.getOrNull(0) ?: ""
                    val description = bulletPoints.getOrNull(1) ?: ""
                    emit(Book(currentBookName, author, description))
                }
            }
        }.parseStream(markdownStream)
    }
}
```

### 4. エージェント戦略でパーサーを使用する

```kotlin
val agentStrategy = strategy("library-assistant") {
     // Describe the node containing the output stream parsing
     val getMdOutput by node<String, String> { input ->
         val books = mutableListOf<Book>()
         val mdDefinition = markdownBookDefinition()

         llm.writeSession {
             updatePrompt { user(input) }
             // Initiate the response stream in the form of the definition `mdDefinition`
             val markdownStream = requestLLMStreaming(mdDefinition)
             // Call the parser with the result of the response stream and perform actions with the result
             parseMarkdownStreamToBooks(markdownStream).collect { book ->
                 books.add(book)
                 println("Parsed Book: ${book.bookName} by ${book.author}")
             }
         }
         // A custom function for output formatting
         formatOutput(books)
     }
     // Describe the agent's graph making sure the node is accessible
     edge(nodeStart forwardTo getMdOutput)
     edge(getMdOutput forwardTo nodeFinish)
 }
```

## 高度な使用法：ツールとのストリーミング

ストリーミングAPIをツールと組み合わせて使用し、データが到着と同時に処理することもできます。以下のセクションでは、ツールを定義し、ストリーミングデータで使用する方法について簡単な段階的ガイドを提供します。

### 1. データ構造のツールを定義する

```kotlin
class BookTool(): SimpleTool<Book>() {
    companion object {
        const val NAME = "book"
    }

    override suspend fun doExecute(args: Book): String {
        println("${args.bookName} by ${args.author}:
 ${args.description}")
        return "Done"
    }

    override val argsSerializer: KSerializer<Book>
        get() = Book.serializer()
    override val descriptor: ToolDescriptor
        get() = ToolDescriptor(
            name = NAME,
            description = "A tool to parse book information from Markdown",
            requiredParameters = listOf(),
            optionalParameters = listOf()
        )
}
```

### 2. ストリーミングデータでツールを使用する

```kotlin
val agentStrategy = strategy("library-assistant") {
     val getMdOutput by node<String, String> { input ->
         val mdDefinition = markdownBookDefinition()

         llm.writeSession {
             updatePrompt { user(input) }
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
             parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(BookTool::class).collect()
         }
         ""
     }

     edge(nodeStart forwardTo getMdOutput)
     edge(getMdOutput forwardTo nodeFinish)
 }
```

### 3. エージェント構成でツールを登録する

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

## ベストプラクティス

1.  **明確な構造を定義する**: データのための明確で曖昧さのないMarkdown構造を作成します。

2.  **良い例を提供する**: `MarkdownStructuredDataDefinition`に包括的な例を含めて、LLMをガイドします。

3.  **不完全なデータを処理する**: ストリームからデータをパースする際は、常にnullまたは空の値をチェックします。

4.  **リソースをクリーンアップする**: `onFinishStream`ハンドラを使用して、リソースをクリーンアップし、残りのデータを処理します。

5.  **エラーを処理する**: 不正な形式のMarkdownや予期せぬデータに対して、適切なエラー処理を実装します。

6.  **テスト**: パーサーを、部分的なチャンクや不正な形式の入力を含む、さまざまな入力シナリオでテストします。

7.  **並列処理**: 独立したデータ項目については、パフォーマンス向上のために並列ツール呼び出しの使用を検討します。