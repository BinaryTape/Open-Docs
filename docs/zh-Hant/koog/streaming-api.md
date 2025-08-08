# 流式 API

## 簡介

Koog framework 中的流式 API 讓您可以在大型語言模型 (LLMs) 的結構化資料抵達時立即處理，而不是等待完整的回應。本頁面解釋如何使用流式 API 來有效率地處理 Markdown 格式的結構化資料。

## 流式 API 概覽

流式 API 能夠即時處理 LLM 回應中的結構化資料。您不必等待完整的回應，而是可以：

- 以區塊形式處理抵達的資料
- 即時解析結構化資訊
- 在結構化物件完成時發出它們
- 立即處理這些物件（收集它們或傳遞給工具）

這種方法特別有用，因為它提供了以下優點：

- 改善使用者介面的響應能力
- 有效率地處理大型回應
- 實作即時資料處理管線

流式 API 允許將輸出解析為來自 .md 格式的 *結構化資料*，或者一組 *純文字* 區塊。

## 使用原始字串流

值得注意的是，您可以透過直接使用原始字串流來解析輸出。這種方法讓您對解析過程擁有更大的靈活性和控制權。

以下是帶有輸出結構 Markdown 定義的原始字串流：

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

這是一個沒有定義的原始字串流範例：

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

## 使用結構化資料流

儘管可以使用原始字串流，但通常使用 [結構化資料](structured-data.md) 會更方便。

結構化資料方法包括以下關鍵組件：

1.  **MarkdownStructuredDataDefinition**：一個類別，可幫助您定義 Markdown 格式結構化資料的結構描述和範例。
2.  **markdownStreamingParser**：一個函數，用於創建一個解析器，該解析器處理 Markdown 區塊流並發出事件。

以下部分提供了與處理結構化資料流相關的逐步說明和程式碼範例。

### 1. 定義您的資料結構

首先，定義一個資料類別來表示您的結構化資料：

```kotlin
@Serializable
data class Book(
    val bookName: String,
    val author: String,
    val description: String
)
```

### 2. 定義 Markdown 結構

使用 `MarkdownStructuredDataDefinition` 類別創建一個定義，指定您的資料應如何在 Markdown 中結構化：

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

### 3. 為您的資料結構建立解析器

`markdownStreamingParser` 為不同的 Markdown 元素提供了多個處理器：

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

使用定義的處理器，您可以實作一個函數，該函數使用 `markdownStreamingParser` 函數解析 Markdown 流並發出您的資料物件。

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

### 4. 在您的代理策略中使用解析器

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

## 進階用法：搭配工具進行流式處理

您還可以將流式 API 與工具結合使用，以便在資料抵達時進行處理。以下部分提供了有關如何定義工具並將其與流式資料配合使用的簡要逐步指南。

### 1. 為您的資料結構定義工具

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

### 2. 將工具與流式資料結合使用

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

### 3. 在您的代理配置中註冊工具

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

## 最佳實踐

1.  **定義清晰的結構**：為您的資料建立清晰且無誤的 Markdown 結構。

2.  **提供良好的範例**：在您的 `MarkdownStructuredDataDefinition` 中包含全面的範例，以指導 LLM。

3.  **處理不完整資料**：從資料流解析資料時，務必檢查空值或空值。

4.  **清理資源**：使用 `onFinishStream` 處理器來清理資源並處理任何剩餘資料。

5.  **處理錯誤**：對格式錯誤的 Markdown 或未預期的資料實作適當的錯誤處理。

6.  **測試**：使用各種輸入情境測試您的解析器，包括部分區塊和格式錯誤的輸入。

7.  **平行處理**：對於獨立的資料項目，考慮使用平行工具呼叫以獲得更好的效能。