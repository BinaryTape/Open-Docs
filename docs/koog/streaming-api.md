# 流式 API

## 简介

Koog 框架中的流式 API 允许您在大型语言模型 (LLM) 的结构化数据到达时立即处理它们，而无需等待整个响应。
本页解释了如何使用流式 API 来高效处理 Markdown 格式的结构化数据。

## 流式 API 概述

流式 API 实现了对 LLM 响应中结构化数据的实时处理。您无需等待完整响应，即可：

- 在数据块到达时进行处理
- 即时解析结构化信息
- 在结构化对象完成时发出它们
- 立即处理这些对象（收集或传递给工具）

这种方法特别有用，因为它提供了以下优势：

- 提高用户界面的响应能力
- 高效处理大型响应
- 实现实时数据处理流水线

流式 API 允许将输出解析为 .md 格式的*结构化数据*，或者解析为一系列*纯文本*数据块。

## 使用原始字符串流

值得注意的是，您可以通过直接使用原始字符串流来解析输出。
这种方法使您对解析过程具有更大的灵活性和控制力。

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
<!--- KNIT example-streaming-api-01.kt -->

以下是一个没有定义的原始字符串流的示例：

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
llm.writeSession {
    val stream = requestLLMStreaming()
    // Access the raw string chunks directly
    stream.collect { chunk ->
        // Process each chunk of text as it arrives
        println("Received chunk: $chunk") // The chunks will not be structured in a specific way
    }
}
```
<!--- KNIT example-streaming-api-02.kt -->

## 使用结构化数据流

尽管可以使用原始字符串流，但通常使用[结构化数据](structured-data.md)更方便。

结构化数据方法包括以下关键组件：

1. **MarkdownStructuredDataDefinition**：一个帮助您定义 Markdown 格式结构化数据的 schema 和 examples 的类。
2. **markdownStreamingParser**：一个用于创建解析器（该解析器处理 Markdown 数据块流并发出事件）的函数。

以下部分提供了处理结构化数据流的分步说明和代码示例。

### 1. 定义你的数据结构

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

### 2. 定义 Markdown 结构

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

### 3. 为你的数据结构创建解析器

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
<!--- KNIT example-streaming-api-05.kt -->

使用已定义处理程序，您可以实现一个函数，该函数使用 `markdownStreamingParser` 函数解析 Markdown 流并发出您的数据对象。

<!--- INCLUDE
import ai.koog.agents.example.exampleStreamingApi08.Book
import ai.koog.prompt.structure.markdown.markdownStreamingParser
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

-->
```kotlin
fun parseMarkdownStreamToBooks(markdownStream: Flow<String>): Flow<Book> {
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
      }.parseStream(markdownStream)
   }
}
```
<!--- KNIT example-streaming-api-06.kt -->

### 4. 在你的代理策略中使用解析器

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi08.Book
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

## 高级用法：使用工具进行流式处理

您还可以将流式 API 与工具结合使用，以在数据到达时进行处理。以下部分简要介绍了如何定义工具并将其与流式数据一起使用。

### 1. 为你的数据结构定义工具

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
   val title: String,
   val author: String,
   val description: String
) : ToolArgs

class BookTool(): SimpleTool<Book>() {
   companion object {
      const val NAME = "book"
   }

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

### 2. 将工具与流式数据结合使用

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

1. **定义清晰的结构**：为您的数据创建清晰明确的 Markdown 结构。

2. **提供良好的示例**：在您的 `MarkdownStructuredDataDefinition` 中包含全面的示例以指导 LLM。

3. **处理不完整数据**：在从流中解析数据时，始终检测空值或空数据。

4. **清理资源**：使用 `onFinishStream` 处理程序清理资源并处理任何剩余数据。

5. **处理错误**：为格式错误的 Markdown 或意外数据实现适当的错误处理。

6. **测试**：使用各种输入场景（包括部分数据块和格式错误的输入）测试您的解析器。

7. **并行处理**：对于独立的数据项，考虑使用并行工具调用以获得更好的性能。