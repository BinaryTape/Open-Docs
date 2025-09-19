# 流式 API

## 簡介

Koog 的 **流式 API** 讓您能夠以 `Flow<StreamFrame>` 形式**逐步接收 LLM 輸出**。您的程式碼可以不必等待完整回應，而是：

- 在輔助程式文字抵達時進行渲染，
- 即時偵測**工具呼叫**並據此行動，
- 知道資料流何時**結束**以及原因。

資料流會傳遞**型別化框架**：

- `StreamFrame.Append(text: String)` — 增量輔助程式文字
- `StreamFrame.ToolCall(id: String?, name: String, content: String)` — 工具呼叫 (安全地組合)
- `StreamFrame.End(finishReason: String?)` — 資料流結束標記

提供了輔助函數，用於提取純文字、將框架轉換為 `Message.Response` 物件，並安全地**組合分塊的工具呼叫**。

---

## 流式 API 概覽

透過流式處理，您可以：

- 處理抵達的資料 (改善 UI 響應能力)
- 即時解析結構化資訊 (Markdown/JSON/等)
- 在物件完成時發出它們
- 即時觸發工具

您可以操作**框架**本身，或者操作從框架衍生的**純文字**。

---
## 用法

### 直接操作框架

這是最通用的方法：對每種框架類型做出反應。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.streaming.StreamFrame
import ai.koog.prompt.structure.markdown.MarkdownStructuredDataDefinition

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    updatePrompt { user("Tell me a joke, then call a tool with JSON args.") }

    val stream = requestLLMStreaming() // Flow<StreamFrame>

    stream.collect { frame ->
        when (frame) {
            is StreamFrame.Append -> print(frame.text)
            is StreamFrame.ToolCall -> {
                println("
🔧 Tool call: ${frame.name} args=${frame.content}")
                // 可選地延遲解析：
                // val json = frame.contentJson
            }
            is StreamFrame.End -> println("
[結束] reason=${frame.finishReason}")
        }
    }
}
```
<!--- KNIT example-streaming-api-01.kt -->

值得注意的是，您可以透過直接使用原始字串流來解析輸出。這種方法讓您對解析過程擁有更大的靈活性和控制權。

以下是帶有輸出結構 Markdown 定義的原始字串流：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.structure.markdown.MarkdownStructuredDataDefinition

val strategy = strategy<String, String>("strategy_name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
fun markdownBookDefinition(): MarkdownStructuredDataDefinition {
    return MarkdownStructuredDataDefinition("name", schema = { /*...*/ })
}

val mdDefinition = markdownBookDefinition()

llm.writeSession {
    val stream = requestLLMStreaming(mdDefinition)
    // 直接存取原始字串區塊
    stream.collect { chunk ->
        // 處理每個抵達的文字區塊
        println("Received chunk: $chunk") // 這些區塊會共同構成遵循 mdDefinition 結構描述的文字
    }
}
```
<!--- KNIT example-streaming-api-02.kt -->

### 操作原始文字流 (衍生)

如果您有預期 `Flow<String>` 的現有流式解析器，可以透過 `filterTextOnly()` 衍生文字區塊，或使用 `collectText()` 收集它們。

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

    // 串流傳遞文字區塊：
    frames.filterTextOnly().collect { chunk -> print(chunk) }

    // 或者，在結束後將所有文字收集到一個 String 中：
    val fullText = frames.collectText()
    println("
---
$fullText")
}
```
<!--- KNIT example-streaming-api-02-01.kt -->

### 在事件處理器中監聽資料流事件

您可以在 [代理事件](agent-events.md) 中監聽資料流事件。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.agent.GraphAIAgent
import ai.koog.agents.features.eventHandler.feature.handleEvents
import ai.koog.prompt.streaming.StreamFrame

fun GraphAIAgent.FeatureContext.installStreamingApi() {
-->
<!--- SUFFIX
}
-->
```kotlin
handleEvents {
    onToolCall { context ->
        println("
🔧 使用 ${context.tool.name} 搭配 ${context.toolArgs}... ")
    }
    onStreamFrame { context ->
        (context.streamFrame as? StreamFrame.Append)?.let { frame ->
            print(frame.text)
        }
    }
    onStreamError { context -> 
        println("❌ 錯誤：${context.error}")
    }
    onAfterStream {
        println("🏁 完成")
    }
}
```
<!--- KNIT example-streaming-api-02-02.kt -->

### 將框架轉換為 `Message.Response`

您可以將收集到的框架列表轉換為標準訊息物件：
- `toAssistantMessageOrNull()`
- `toToolCallMessages()`
- `toMessageResponses()`

---

## 範例

### 流式處理中的結構化資料 (Markdown 範例)

儘管可以使用原始字串流，但通常使用 [結構化資料](structured-output.md) 會更方便。

結構化資料方法包括以下關鍵組件：

1.  **MarkdownStructuredDataDefinition**：一個類別，可幫助您定義 Markdown 格式結構化資料的結構描述和範例。
2.  **markdownStreamingParser**：一個函數，用於創建一個解析器，該解析器處理 Markdown 區塊流並發出事件。

以下部分提供了與處理結構化資料流相關的逐步說明和程式碼範例。

#### 1. 定義您的資料結構

首先，定義一個資料類別來表示您的結構化資料：

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolArgs
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
): ToolArgs
```
<!--- KNIT example-streaming-api-03.kt -->

#### 2. 定義 Markdown 結構

使用 `MarkdownStructuredDataDefinition` 類別創建一個定義，指定您的資料應如何在 Markdown 中結構化：

<!--- INCLUDE
import ai.koog.prompt.markdown.markdown
import ai.koog.prompt.structure.markdown.MarkdownStructuredDataDefinition
-->
```kotlin
fun markdownBookDefinition(): MarkdownStructuredDataDefinition {
    return MarkdownStructuredDataDefinition("bookList", schema = {
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

#### 3. 為您的資料結構建立解析器

`markdownStreamingParser` 為不同的 Markdown 元素提供了多個處理器：

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
    // 處理一級標題 (級別範圍從 1 到 6)
    onHeader(1) { headerText -> }
    // 處理項目符號
    onBullet { bulletText -> }
    // 處理程式碼區塊
    onCodeBlock { codeBlockContent -> }
    // 處理符合正則表達式模式的行
    onLineMatching(Regex("pattern")) { line -> }
    // 處理資料流結束
    onFinishStream { remainingText -> }
}
```
<!--- KNIT example-streaming-api-05.kt -->

使用定義的處理器，您可以實作一個函數，該函數使用 `markdownStreamingParser` 函數解析 Markdown 流並發出您的資料物件。

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

         // 處理在回應資料流中接收到 Markdown 標題的事件
         onHeader(1) { headerText ->
            // 如果存在上一本書，則發出它
            if (currentBookTitle.isNotEmpty() && bulletPoints.isNotEmpty()) {
               val author = bulletPoints.getOrNull(0) ?: ""
               val description = bulletPoints.getOrNull(1) ?: ""
               emit(Book(currentBookTitle, author, description))
            }

            currentBookTitle = headerText
            bulletPoints.clear()
         }

         // 處理在回應資料流中接收到 Markdown 項目符號列表的事件
         onBullet { bulletText ->
            bulletPoints.add(bulletText)
         }

         // 處理回應資料流的結束
         onFinishStream {
            // 發出最後一本書（如果存在）
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

#### 4. 在您的代理策略中使用解析器

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi03.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
   // 描述包含輸出資料流解析的節點
   val getMdOutput by node<String, List<Book>> { booksDescription ->
      val books = mutableListOf<Book>()
      val mdDefinition = markdownBookDefinition()

      llm.writeSession {
         updatePrompt { user(booksDescription) }
         // 以 `mdDefinition` 的定義形式啟動回應資料流
         val markdownStream = requestLLMStreaming(mdDefinition)
         // 使用回應資料流的結果呼叫解析器並對結果執行操作
         parseMarkdownStreamToBooks(markdownStream).collect { book ->
            books.add(book)
            println("Parsed Book: ${book.title} by ${book.author}")
         }
      }

      books
   }
   // 描述代理的圖形，確保節點可存取
   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-streaming-api-07.kt -->

### 進階用法：搭配工具進行流式處理

您還可以將流式 API 與工具結合使用，以便在資料抵達時進行處理。以下部分提供了有關如何定義工具並將其與流式資料配合使用的簡要逐步指南。

### 1. 為您的資料結構定義工具

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.example.exampleStreamingApi03.Book
import kotlinx.serialization.KSerializer

-->
```kotlin
class BookTool(): SimpleTool<Book>() {
    
    companion object { const val NAME = "book" }

    override suspend fun doExecute(args: Book): String {
        println("${args.title} by ${args.author}:
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
<!--- KNIT example-streaming-api-08.kt -->

### 2. 將工具與流式資料結合使用

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
import ai.koog.agents.example.exampleStreamingApi08.BookTool

-->
```kotlin
val agentStrategy = strategy<String, Unit>("library-assistant") {
   val getMdOutput by node<String, Unit> { input ->
      val mdDefinition = markdownBookDefinition()

      llm.writeSession {
         updatePrompt { user(input) }
         val markdownStream = requestLLMStreaming(mdDefinition)

         parseMarkdownStreamToBooks(markdownStream).collect { book ->
            callToolRaw(BookTool.NAME, book as ToolArgs)
            /* 其他可能的選項：
                callTool(BookTool::class, book)
                callTool<BookTool>(book)
                findTool(BookTool::class).execute(book)
            */
         }

         // 我們可以進行平行工具呼叫
         parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(toolClass=BookTool::class).collect {
            println("工具呼叫結果: $it")
         }
      }
   }

   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
 }
```
<!--- KNIT example-streaming-api-09.kt -->

### 3. 在您的代理配置中註冊工具

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

## 最佳實踐

1.  **定義清晰的結構**：為您的資料建立清晰且無歧義的 Markdown 結構。

2.  **提供良好的範例**：在您的 `MarkdownStructuredDataDefinition` 中包含全面的範例，以指導 LLM。

3.  **處理不完整資料**：從資料流解析資料時，務必檢查空值或空白值。

4.  **清理資源**：使用 `onFinishStream` 處理器來清理資源並處理任何剩餘資料。

5.  **處理錯誤**：對格式錯誤的 Markdown 或未預期的資料實作適當的錯誤處理。

6.  **測試**：使用各種輸入情境測試您的解析器，包括部分區塊和格式錯誤的輸入。

7.  **平行處理**：對於獨立的資料項目，考慮使用平行工具呼叫以獲得更好的效能。