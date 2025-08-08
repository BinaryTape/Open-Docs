# 스트리밍 API

## 서론

Koog 프레임워크의 스트리밍 API를 사용하면 전체 응답을 기다리지 않고 **대규모 언어 모델(LLM)**에서 도착하는 **구조화된 데이터**를 즉시 처리할 수 있습니다.
이 페이지에서는 스트리밍 API를 사용하여 마크다운 형식의 구조화된 데이터를 효율적으로 처리하는 방법을 설명합니다.

## 스트리밍 API 개요

스트리밍 API는 LLM 응답에서 구조화된 데이터를 실시간으로 처리할 수 있도록 합니다. 전체 응답을 기다리는 대신 다음을 수행할 수 있습니다.

- 데이터가 청크(chunk) 단위로 도착하는 즉시 처리
- 즉석에서(on the fly) 구조화된 정보 파싱
- 구조화된 객체가 완성되는 즉시 방출(emit)
- 이러한 객체를 즉시 처리 (수집하거나 도구에 전달)

이러한 접근 방식은 다음과 같은 이점을 제공하므로 특히 유용합니다.

- 사용자 인터페이스의 응답성 향상
- 대규모 응답의 효율적인 처리
- 실시간 데이터 처리 파이프라인 구현

스트리밍 API를 사용하면 출력을 `.md` 형식의 *구조화된 데이터* 또는 *일반 텍스트* 청크(chunk) 세트로 파싱할 수 있습니다.

## 원시 문자열 스트림으로 작업하기

원시 문자열 스트림으로 직접 작업하여 출력을 파싱할 수 있다는 점에 유의해야 합니다.
이 접근 방식은 파싱 프로세스에 대한 더 많은 유연성과 제어 기능을 제공합니다.

다음은 출력 구조의 마크다운 정의가 포함된 원시 문자열 스트림입니다.

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

다음은 정의가 없는 원시 문자열 스트림의 예시입니다.

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

## 구조화된 데이터 스트림으로 작업하기

원시 문자열 스트림으로 작업하는 것이 가능하지만,
[구조화된 데이터](structured-data.md)로 작업하는 것이 종종 더 편리합니다.

구조화된 데이터 접근 방식은 다음과 같은 주요 구성 요소를 포함합니다.

1.  **MarkdownStructuredDataDefinition**: 마크다운 형식으로 구조화된 데이터에 대한 스키마 및 예제를 정의하는 데 도움이 되는 클래스입니다.
2.  **markdownStreamingParser**: 마크다운 청크 스트림을 처리하고 이벤트를 방출하는 파서를 생성하는 함수입니다.

아래 섹션에서는 구조화된 데이터 스트림을 처리하는 것과 관련된 단계별 지침과 코드 샘플을 제공합니다.

### 1. 데이터 구조 정의

먼저 구조화된 데이터를 나타내는 데이터 클래스를 정의합니다.

```kotlin
@Serializable
data class Book(
    val bookName: String,
    val author: String,
    val description: String
)
```

### 2. 마크다운 구조 정의

`MarkdownStructuredDataDefinition` 클래스를 사용하여 마크다운에서 데이터가 어떻게 구조화되어야 하는지를 지정하는 정의를 생성합니다.

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

### 3. 데이터 구조를 위한 파서 생성

`markdownStreamingParser`는 다양한 마크다운 요소에 대한 여러 핸들러를 제공합니다.

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

정의된 핸들러를 사용하여 `markdownStreamingParser` 함수를 통해 마크다운 스트림을 파싱하고 데이터 객체를 방출하는 함수를 구현할 수 있습니다.

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

### 4. 에이전트 전략에서 파서 사용

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

## 고급 사용법: 도구와 함께 스트리밍

스트리밍 API를 도구와 함께 사용하여 데이터가 도착하는 즉시 처리할 수도 있습니다. 다음 섹션에서는 도구를 정의하고 스트리밍 데이터와 함께 사용하는 방법에 대한 간략한 단계별 가이드를 제공합니다.

### 1. 데이터 구조를 위한 도구 정의

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

### 2. 스트리밍 데이터와 함께 도구 사용

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

### 3. 에이전트 구성에 도구 등록

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

## 모범 사례

1.  **명확한 구조 정의**: 데이터에 대한 명확하고 모호하지 않은 마크다운 구조를 생성합니다.

2.  **좋은 예시 제공**: LLM을 안내하기 위해 `MarkdownStructuredDataDefinition`에 포괄적인 예시를 포함합니다.

3.  **불완전한 데이터 처리**: 스트림에서 데이터를 파싱할 때 항상 null 또는 비어 있는 값을 확인합니다.

4.  **리소스 정리**: `onFinishStream` 핸들러를 사용하여 리소스를 정리하고 남아 있는 데이터를 처리합니다.

5.  **오류 처리**: 잘못된 형식의 마크다운 또는 예기치 않은 데이터에 대해 적절한 오류 처리를 구현합니다.

6.  **테스트**: 부분 청크 및 잘못된 형식의 입력을 포함하여 다양한 입력 시나리오로 파서를 테스트합니다.

7.  **병렬 처리**: 독립적인 데이터 항목의 경우, 더 나은 성능을 위해 병렬 도구 호출 사용을 고려하십시오.

```