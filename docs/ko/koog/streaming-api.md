# 스트리밍 API

## 서론

Koog의 **스트리밍 API**를 사용하면 **LLM 출력**을 `Flow<StreamFrame>` 형태로 **점진적으로** 소비할 수 있습니다. 전체 응답을 기다리지 않고도 코드는 다음을 수행할 수 있습니다.

- 어시스턴트 텍스트가 도착하는 대로 렌더링
- **도구 호출**을 실시간으로 감지하고 이에 따라 조치
- 스트림이 **언제 종료되는지**와 그 이유를 파악

스트림은 **타입이 지정된 프레임**을 전달합니다.

- `StreamFrame.Append(text: String)` — 점진적인 어시스턴트 텍스트
- `StreamFrame.ToolCall(id: String?, name: String, content: String)` — 도구 호출 (안전하게 결합됨)
- `StreamFrame.End(finishReason: String?)` — 스트림 종료 마커

일반 텍스트를 추출하고, 프레임을 `Message.Response` 객체로 변환하며, **청크로 분할된 도구 호출**을 안전하게 결합하는 헬퍼가 제공됩니다.

---

## 스트리밍 API 개요

스트리밍을 통해 다음을 수행할 수 있습니다.

- 데이터가 도착하는 즉시 처리 (UI 응답성 향상)
- 즉석에서 구조화된 정보 파싱 (마크다운/JSON 등)
- 객체가 완성되는 즉시 방출
- 도구를 실시간으로 트리거

**프레임** 자체 또는 프레임에서 파생된 **일반 텍스트**로 작업할 수 있습니다.

---
## 사용법

### 프레임과 직접 작업하기

이것은 가장 일반적인 접근 방식입니다. 각 프레임 종류에 반응합니다.

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

원시 문자열 스트림과 직접 작업하여 출력을 파싱할 수 있다는 점에 유의해야 합니다.
이 접근 방식은 파싱 프로세스에 대한 더 많은 유연성과 제어 기능을 제공합니다.

다음은 출력 구조의 마크다운 정의가 포함된 원시 문자열 스트림입니다.

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

### 원시 텍스트 스트림(파생)과 작업하기

`Flow<String>`을 예상하는 기존 스트리밍 파서가 있는 경우, `filterTextOnly()`를 통해 텍스트 청크를 파생하거나 `collectText()`로 수집할 수 있습니다.

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

### 이벤트 핸들러에서 스트림 이벤트 수신하기

[에이전트 이벤트](agent-events.md)에서 스트림 이벤트를 수신할 수 있습니다.

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
🔧 Using ${context.tool.name} with ${context.toolArgs}... ")
    }
    onStreamFrame { context ->
        (context.streamFrame as? StreamFrame.Append)?.let { frame ->
            print(frame.text)
        }
    }
    onStreamError { context -> 
        println("❌ Error: ${context.error}")
    }
    onAfterStream {
        println("🏁 Done")
    }
}
```
<!--- KNIT example-streaming-api-02-02.kt -->

### 프레임을 `Message.Response`로 변환하기

수집된 프레임 목록을 표준 메시지 객체로 변환할 수 있습니다.
- `toAssistantMessageOrNull()`
- `toToolCallMessages()`
- `toMessageResponses()`

---

## 예시

### 스트리밍 중 구조화된 데이터 (마크다운 예시)

원시 문자열 스트림으로 작업하는 것이 가능하지만, [구조화된 데이터](structured-output.md)로 작업하는 것이 종종 더 편리합니다.

구조화된 데이터 접근 방식은 다음과 같은 주요 구성 요소를 포함합니다.

1.  **MarkdownStructuredDataDefinition**: 마크다운 형식으로 구조화된 데이터에 대한 스키마 및 예제를 정의하는 데 도움이 되는 클래스입니다.
2.  **markdownStreamingParser**: 마크다운 청크 스트림을 처리하고 이벤트를 방출하는 파서를 생성하는 함수입니다.

아래 섹션에서는 구조화된 데이터 스트림을 처리하는 것과 관련된 단계별 지침과 코드 샘플을 제공합니다.

#### 1. 데이터 구조 정의

먼저 구조화된 데이터를 나타내는 데이터 클래스를 정의합니다.

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

#### 2. 마크다운 구조 정의

`MarkdownStructuredDataDefinition` 클래스를 사용하여 마크다운에서 데이터가 어떻게 구조화되어야 하는지를 지정하는 정의를 생성합니다.

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

#### 3. 데이터 구조를 위한 파서 생성

`markdownStreamingParser`는 다양한 마크다운 요소에 대한 여러 핸들러를 제공합니다.

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

정의된 핸들러를 사용하여 `markdownStreamingParser` 함수를 통해 마크다운 스트림을 파싱하고 데이터 객체를 방출하는 함수를 구현할 수 있습니다.

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

#### 4. 에이전트 전략에서 파서 사용

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

### 고급 사용법: 도구와 함께 스트리밍

스트리밍 API를 도구와 함께 사용하여 데이터가 도착하는 즉시 처리할 수도 있습니다. 다음 섹션에서는 도구를 정의하고 스트리밍 데이터와 함께 사용하는 방법에 대한 간략한 단계별 가이드를 제공합니다.

### 1. 데이터 구조를 위한 도구 정의

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

### 2. 스트리밍 데이터와 함께 도구 사용

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

### 3. 에이전트 구성에 도구 등록

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

## 모범 사례

1.  **명확한 구조 정의**: 데이터에 대한 명확하고 모호하지 않은 마크다운 구조를 생성합니다.

2.  **좋은 예시 제공**: LLM을 안내하기 위해 `MarkdownStructuredDataDefinition`에 포괄적인 예시를 포함합니다.

3.  **불완전한 데이터 처리**: 스트림에서 데이터를 파싱할 때 항상 null 또는 비어 있는 값을 확인합니다.

4.  **리소스 정리**: `onFinishStream` 핸들러를 사용하여 리소스를 정리하고 남아 있는 데이터를 처리합니다.

5.  **오류 처리**: 잘못된 형식의 마크다운 또는 예기치 않은 데이터에 대해 적절한 오류 처리를 구현합니다.

6.  **테스트**: 부분 청크 및 잘못된 형식의 입력을 포함하여 다양한 입력 시나리오로 파서를 테스트합니다.

7.  **병렬 처리**: 독립적인 데이터 항목의 경우, 더 나은 성능을 위해 병렬 도구 호출 사용을 고려하십시오.