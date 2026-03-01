# 流式传输 API

## 简介

Koog 的**流式传输 API** 允许您以 `Flow<StreamFrame>` 的形式**增量消耗 LLM 输出**。您的代码无需等待完整响应，而是可以：

- 在助手文本到达时立即进行渲染，
- 实时检测**工具调用**并对其采取操作，
- 了解流何时**结束**以及结束原因。

该流携带组织为两类的**类型化帧**：

**增量帧 (Delta frames)**（增量/部分内容）：
- `StreamFrame.TextDelta(text: String, index: Int?)` — 增量助手文本
- `StreamFrame.ReasoningDelta(text: String?, summary: String?, index: Int?)` — 增量推理文本与摘要
- `StreamFrame.ToolCallDelta(id: String?, name: String?, content: String?, index: Int?)` — 部分工具调用

**完整帧 (Complete frames)**（完整内容）：
- `StreamFrame.TextComplete(text: String)` — 完整助手文本
- `StreamFrame.ReasoningComplete(text: List<String>, summary: List<String>?)` — 带有可选摘要的完整推理内容
- `StreamFrame.ToolCallComplete(id: String?, name: String, content: String)` — 完整工具调用

**结束标记**：
- `StreamFrame.End(finishReason: String?)` — 流结束标记

本库还提供了辅助程序来提取纯文本、将帧转换为 `Message.Response` 对象，以及安全地**合并分块的工具调用**。

---

## 流式传输 API 概览

通过流式传输，您可以：

- 在数据到达时立即处理（提高 UI 响应性）
- 实时解析结构化信息（Markdown/JSON 等）
- 在对象完成时立即发送
- 实时触发工具
- 实时访问模型推理过程（适用于支持的模型）

您可以直接操作**帧**，也可以操作从帧派生的**纯文本**。

### 增量帧 vs 完整帧

流式传输 API 区分两种类型的帧：

- **增量帧** (`DeltaFrame`) — 以分块形式到达的增量/部分内容。这些帧非常适合在内容流式传输时进行实时显示。例如：`TextDelta`、`ReasoningDelta`、`ToolCallDelta`。

- **完整帧** (`CompleteFrame`) — 在该内容类型的所有增量内容接收完毕后发送的完整内容。这些帧适用于最终处理以及转换为 `Message.Response` 对象。例如：`TextComplete`、`ReasoningComplete`、`ToolCallComplete`。

通常，您会使用增量帧进行 UI 更新，使用完整帧来提取最终的结构化数据。

---
## 用法

### 直接操作帧

这是最通用的方法：针对每种帧类型做出反应。

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
    appendPrompt { user("给我讲个笑话，然后调用一个带有 JSON 参数的工具。") }

    val stream = requestLLMStreaming() // Flow<StreamFrame>

    stream.collect { frame ->
        when (frame) {
            is StreamFrame.TextDelta -> print(frame.text)
            is StreamFrame.ReasoningDelta -> print("[Reasoning] text=${frame.text} summary=${frame.summary}")
            is StreamFrame.ToolCallComplete -> {
                println("
🔧 工具调用: ${frame.name} 参数=${frame.content}")
                // 可选：进行延迟解析
                // val json = frame.contentJson
            }
            is StreamFrame.End -> println("
[END] 原因=${frame.finishReason}")
            else -> {} // 处理其他类型的帧（TextComplete、ToolCallDelta 等）
        }
    }
}
```
<!--- KNIT example-streaming-api-01.kt -->

值得注意的是，您也可以通过直接操作原始字符串流来解析输出。
这种方法在解析过程中为您提供了更大的灵活性和控制力。

以下是带有输出结构 Markdown 定义的原始字符串流：

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
    // 直接访问原始字符串块
    stream.collect { chunk ->
        // 在每个文本块到达时进行处理
        println("收到块: $chunk") // 这些块组合在一起将成为符合 mdDefinition 架构的结构化文本
    }
}
```
<!--- KNIT example-streaming-api-02.kt -->

### 操作推理帧

支持推理的模型（如 Claude Sonnet 4.5 或 GPT-o1）在流式传输期间会发送推理帧。您可以访问推理过程及其摘要：

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
    appendPrompt { user("解决这个复杂的问题：...") }

    val stream = requestLLMStreaming()
    val reasoningSteps = mutableListOf<String>()
    val summarySteps = mutableListOf<String>()

    stream.collect { frame ->
        when (frame) {
            is StreamFrame.ReasoningDelta -> {
                frame.text?.let { 
                    reasoningSteps.add(it)
                    print(frame.text) // 在推理内容到达时显示
                }
                frame.summary?.let {
                    summarySteps.add(it)
                    print(frame.summary) // 在推理摘要到达时显示
                }
            }
            is StreamFrame.ReasoningComplete -> {
                // 访问完整的推理内容
                println("
完整推理过程: ${frame.text.joinToString("")}")
                println("摘要: ${frame.summary?.joinToString("") ?: "无"}")
            }
            is StreamFrame.TextDelta -> print(frame.text)
            is StreamFrame.End -> println("
[END]")
            else -> {}
        }
    }
}
```
<!--- KNIT example-streaming-api-reasoning-01.kt -->

### 操作原始文本流（派生）

如果您已有期望 `Flow<String>` 的流式解析器，
可以通过 `filterTextOnly()` 派生文本块，或使用 `collectText()` 收集它们。

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

    // 在文本块到来时进行流式传输：
    frames.filterTextOnly().collect { chunk -> print(chunk) }

    // 或者在结束后将所有文本收集到一个字符串中：
    val fullText = frames.collectText()
    println("
---
$fullText")
}
```
<!--- KNIT example-streaming-api-02-01.kt -->

### 在事件处理程序中侦听流事件

您可以在[智能体事件处理程序](agent-event-handlers.md)中侦听流事件。

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
🔧 正在使用 ${context.toolName}，参数为 ${context.toolArgs}... ")
    }
    onLLMStreamingFrameReceived { context ->
        when (val frame = context.streamFrame) {
            is StreamFrame.TextDelta -> print(frame.text)
            is StreamFrame.ReasoningDelta -> print("[Reasoning] text=${frame.text} summary=${frame.summary}")
            else -> {} // 根据需要处理其他类型的帧
        }
    }
    onLLMStreamingFailed { context ->
        println("❌ 错误: ${context.error}")
    }
    onLLMStreamingCompleted {
        println("🏁 完成")
    }
}
```
<!--- KNIT example-streaming-api-02-02.kt -->

### 将帧转换为 `Message.Response`

您可以将收集到的帧列表转换为标准消息对象：
- `toAssistantMessageOrNull()` — 从文本帧中提取 `Message.Assistant`
- `toReasoningMessageOrNull()` — 从推理帧中提取 `Message.Reasoning`
- `toToolCallMessages()` — 从工具调用帧中提取 `Message.Tool.Call`
- `toMessageResponses()` — 将所有完整帧转换为其对应的 `Message.Response` 对象

---

## 示例

### 流式传输时的结构化数据（Markdown 示例）

虽然可以操作原始字符串流，但通常操作[结构化数据](structured-output.md)会更方便。

结构化数据方法包含以下核心组件：

1. **MarkdownStructureDefinition**：一个辅助类，用于定义 Markdown 格式结构化数据的架构和示例。
2. **markdownStreamingParser**：一个用于创建解析器的函数，该解析器处理 Markdown 块流并发送事件。

以下各节提供了与处理结构化数据流相关的分步说明和代码示例。

#### 1. 定义数据结构

首先，定义一个数据类来表示您的结构化数据：

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

使用 `MarkdownStructureDefinition` 类创建一个定义，指定数据在 Markdown 中的结构：

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
            header(1, "了不起的盖茨比")
            bulleted {
                item("F. Scott Fitzgerald")
                item("一部背景设定在爵士时代的小说，讲述了杰伊·盖茨比对黛西·布坎南无私爱情的故事。")
            }
        }
    })
}
```
<!--- KNIT example-streaming-api-04.kt -->

#### 3. 为数据结构创建解析器

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
    // 处理 1 级标题（级别范围从 1 到 6）
    onHeader(1) { headerText -> }
    // 处理项目符号
    onBullet { bulletText -> }
    // 处理代码块
    onCodeBlock { codeBlockContent -> }
    // 处理匹配正则表达式模式的行
    onLineMatching(Regex("pattern")) { line -> }
    // 处理流结束
    onFinishStream { remainingText -> }
}
```
<!--- KNIT example-streaming-api-05.kt -->

使用定义好的处理程序，您可以实现一个函数，该函数使用 `markdownStreamingParser` 函数解析 Markdown 流并发送您的数据对象。

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

         // 处理在响应流中接收到 Markdown 标题的事件
         onHeader(1) { headerText ->
            // 如果之前有书籍，则将其发送
            if (currentBookTitle.isNotEmpty() && bulletPoints.isNotEmpty()) {
               val author = bulletPoints.getOrNull(0) ?: ""
               val description = bulletPoints.getOrNull(1) ?: ""
               emit(Book(currentBookTitle, author, description))
            }

            currentBookTitle = headerText
            bulletPoints.clear()
         }

         // 处理在响应流中接收到 Markdown 项目列表的事件
         onBullet { bulletText ->
            bulletPoints.add(bulletText)
         }

         // 处理响应流结束
         onFinishStream {
            // 如果存在最后一本书，则将其发送
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

#### 4. 在智能体策略中使用解析器

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStreamingApi03.Book
import ai.koog.agents.example.exampleStreamingApi04.markdownBookDefinition
import ai.koog.agents.example.exampleStreamingApi06.parseMarkdownStreamToBooks
-->
```kotlin
val agentStrategy = strategy<String, List<Book>>("library-assistant") {
   // 描述包含输出流解析的节点
   val getMdOutput by node<String, List<Book>> { booksDescription ->
      val books = mutableListOf<Book>()
      val mdDefinition = markdownBookDefinition()

      llm.writeSession {
         appendPrompt { user(booksDescription) }
         // 以 'mdDefinition' 定义的形式启动响应流
         val markdownStream = requestLLMStreaming(mdDefinition)
         // 使用响应流的结果调用解析器并对结果执行操作
         parseMarkdownStreamToBooks(markdownStream).collect { book ->
            books.add(book)
            println("已解析的书籍: ${book.title} 作者 ${book.author}")
         }
      }

      books
   }
   // 描述智能体的图，确保节点可访问
   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
}
```
<!--- KNIT example-streaming-api-07.kt -->

### 高级用法：配合工具进行流式传输

您还可以将流式传输 API 与工具结合使用，在数据到达时对其进行处理。
以下各节提供了有关如何定义工具并在流式传输数据中使用它的简要分步指南。

### 1. 为您的数据结构定义工具

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
    description = "一个用于从 Markdown 中解析书籍信息的工具"
) {

    companion object { const val NAME = "book" }

    override suspend fun execute(args: Book): String {
        println("${args.title} 作者 ${args.author}:
 ${args.description}")
        return "完成"
    }
}
```
<!--- KNIT example-streaming-api-08.kt -->

### 2. 在流式传输数据中使用该工具

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
            /* 其他可能的选项:
                callTool(BookTool::class, book)
                callTool<BookTool>(book)
                findTool(BookTool::class).execute(book)
            */
         }

         // 我们可以发起并行工具调用
         parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(toolClass=BookTool::class).collect {
            println("工具调用结果: $it")
         }
      }
   }

   edge(nodeStart forwardTo getMdOutput)
   edge(getMdOutput forwardTo nodeFinish)
 }
```
<!--- KNIT example-streaming-api-09.kt -->

### 3. 在智能体配置中注册工具

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleStreamingApi08.BookTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

-->
```kotlin
val toolRegistry = ToolRegistry {
    tool(BookTool())
}

val runner = AIAgent(
    promptExecutor = simpleOpenAIExecutor("OPENAI_API_KEY"),
    llmModel = OpenAIModels.Chat.GPT4o,
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-streaming-api-10.kt -->

## 最佳做法

1. **定义清晰的结构**：为您的数据创建清晰且无歧义的 Markdown 结构。

2. **提供良好的示例**：在 `MarkdownStructureDefinition` 中包含详尽的示例以引导 LLM。

3. **处理不完整数据**：在解析来自流的数据时，务必检查 null 或空值。

4. **清理资源**：使用 `onFinishStream` 处理程序来清理资源并处理任何剩余数据。

5. **处理错误**：针对格式错误的 Markdown 或非预期数据实现适当的错误处理。

6. **测试**：在各种输入场景下测试您的解析器，包括部分块和格式错误的输入。

7. **并行处理**：对于独立的数据项，考虑使用并行工具调用以获得更好的性能。