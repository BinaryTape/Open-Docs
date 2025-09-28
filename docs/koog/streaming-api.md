# 流式 API

## 简介

Koog 的 **流式 API** 允许您以 `Flow<StreamFrame>` 的形式**增量地消费 LLM 输出**。您的代码无需等待完整响应，即可：

- 在助手文本到达时进行渲染，
- 实时检测**工具调用**并对其进行操作，
- 了解流何时**结束**以及结束的原因。

该流携带着**类型化的帧**：

- `StreamFrame.Append(text: String)` — 增量助手文本
- `StreamFrame.ToolCall(id: String?, name: String, content: String)` — 工具调用（安全地合并）
- `StreamFrame.End(finishReason: String?)` — 流结束标记

提供了辅助函数来提取纯文本、将帧转换为 `Message.Response` 对象，以及安全地**合并分块的工具调用**。

---

## 流式 API 概述

借助流式处理，您可以：

- 处理到达的数据（提高 UI 响应能力）
- 即时解析结构化信息（Markdown/JSON 等）
- 在对象完成时发出它们
- 实时触发工具

您可以操作**帧**本身，也可以操作从帧派生的**纯文本**。

---
## 用法

### 直接处理帧

这是最通用的方法：对每种帧类型做出反应。

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

值得注意的是，您可以通过直接使用原始字符串流来解析输出。这种方法使您对解析过程具有更大的灵活性和控制力。

以下是一个带有输出结构 Markdown 定义的原始字符串流：

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
    // Access the raw string chunks directly
    stream.collect { chunk ->
        // Process each chunk of text as it arrives
        println("Received chunk: $chunk") // The chunks together will be structured as a text following the mdDefinition schema
    }
}
```
<!--- KNIT example-streaming-api-02.kt -->

### 处理原始文本流（派生）

如果您有期望 `Flow<String>` 的现有流式解析器，可以通过 `filterTextOnly()` 派生文本块，或使用 `collectText()` 收集它们。

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

### 在事件处理程序中监听流事件

您可以在[代理事件](agent-events.md)中监听流事件。

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
    onToolExecutionStarting { context ->
        println("
🔧 Using ${context.tool.name} with ${context.toolArgs}... ")
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

### 将帧转换为 `Message.Response`

您可以将收集到的帧列表转换为标准消息对象：
- `toAssistantMessageOrNull()`
- `toToolCallMessages()`
- `toMessageResponses()`

---

## 示例

### 流式传输时的结构化数据（Markdown 示例）

尽管可以使用原始字符串流，但通常使用[结构化数据](structured-output.md)更方便。

结构化数据方法包括以下关键组件：

1.  **MarkdownStructuredDataDefinition**：一个帮助您定义 Markdown 格式结构化数据的 schema 和 examples 的类。
2.  **markdownStreamingParser**：一个用于创建解析器（该解析器处理 Markdown 数据块流并发出事件）的函数。

以下部分提供了处理结构化数据流的分步说明和代码示例。

#### 1. 定义你的数据结构

首先，定义一个 data class 来表示您的结构化数据：

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

#### 2. 定义 Markdown 结构

使用 `MarkdownStructuredDataDefinition` 类创建一个定义，用于指定您的数据应如何在 Markdown 中进行结构化：

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

#### 3. 为你的数据结构创建解析器

`markdownStreamingParser` 为不同的 Markdown 元素提供了多个处理程序：

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

使用已定义处理程序，您可以实现一个函数，该函数使用 `markdownStreamingParser` 函数解析 Markdown 流并发出您的数据对象。

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

#### 4. 在你的代理策略中使用解析器

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
         updatePrompt { user(booksDescription) }
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

### 高级用法：使用工具进行流式处理

您还可以将流式 API 与工具结合使用，以在数据到达时进行处理。以下部分简要介绍了如何定义工具并将其与流式数据一起使用。

### 1. 为你的数据结构定义工具

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

class BookTool(): SimpleTool<Book>() {
    
    companion object { const val NAME = "book" }

    override suspend fun doExecute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }

    override val argsSerializer: KSerializer<Book>
        get() = Book.serializer()

    override val name: String = NAME
    override val description: String = "A tool to parse book information from Markdown"
}
```
<!--- KNIT example-streaming-api-08.kt -->

### 2. 将工具与流式数据结合使用

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
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

### 3. 在你的代理配置中注册工具

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

## 最佳实践

1.  **定义清晰的结构**：为您的数据创建清晰明确的 Markdown 结构。

2.  **提供良好的示例**：在您的 `MarkdownStructuredDataDefinition` 中包含全面的示例以指导 LLM。

3.  **处理不完整数据**：在从流中解析数据时，始终检测空值或空数据。

4.  **清理资源**：使用 `onFinishStream` 处理程序清理资源并处理任何剩余数据。

5.  **处理错误**：为格式错误的 Markdown 或意外数据实现适当的错误处理。

6.  **测试**：使用各种输入场景（包括部分数据块和格式错误的输入）测试您的解析器。

7.  **并行处理**：对于独立的数据项，考虑使用并行工具调用以获得更好的性能。