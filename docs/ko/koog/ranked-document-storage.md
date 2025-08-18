# 문서 저장소

Koog는 대규모 언어 모델 (LLM)과 함께 사용할 수 있는 최신 검색 가능한 정보 소스를 제공하기 위해 리소스 증강 생성 (RAG)을 지원하여 문서에서 정보를 저장하고 검색합니다.

## 주요 RAG 기능

일반적인 RAG 시스템의 핵심 구성 요소는 다음과 같습니다.

-   **문서 저장소**: 정보가 포함된 문서, 파일 또는 텍스트 덩어리의 저장소입니다.
-   **벡터 임베딩**: 텍스트의 의미를 포착하는 숫자 표현입니다. Koog의 임베딩에 대한 자세한 내용은 [임베딩](embeddings.md)을 참조하세요.
-   **검색 메커니즘**: 쿼리를 기반으로 가장 관련성 높은 문서를 찾는 시스템입니다.
-   **생성 구성 요소**: 검색된 정보를 사용하여 응답을 생성하는 LLM입니다.

RAG는 기존 LLM의 몇 가지 한계를 해결합니다.

-   **지식 단절**: RAG는 훈련 데이터에 국한되지 않고 최신 정보에 접근할 수 있습니다.
-   **환각 (Hallucinations)**: 검색된 문서에 응답을 기반함으로써 RAG는 조작된 정보(hallucinations)를 줄입니다.
-   **도메인 특화**: RAG는 지식 기반을 큐레이션하여 특정 도메인에 맞게 조정할 수 있습니다.
-   **투명성**: 정보의 출처를 인용할 수 있어 시스템을 더 잘 설명할 수 있습니다.

## RAG 시스템에서 정보 찾기

RAG 시스템에서 관련 정보를 찾는 것은 문서를 벡터 임베딩으로 저장하고 사용자 쿼리와의 유사성을 기반으로 순위를 매기는 것을 포함합니다. 이 접근 방식은 PDF, 이미지, 텍스트 파일 또는 개별 텍스트 덩어리를 포함한 다양한 문서 유형에서 작동합니다.

이 프로세스에는 다음이 포함됩니다.

1.  **문서 임베딩**: 문서를 의미를 포착하는 벡터 표현으로 변환합니다.
2.  **벡터 저장소**: 이러한 임베딩을 효율적으로 저장하여 빠른 검색을 가능하게 합니다.
3.  **유사성 검색**: 쿼리 임베딩과 가장 유사한 임베딩을 가진 문서를 찾습니다.
4.  **순위 지정**: 관련성 점수에 따라 문서를 정렬합니다.

## Koog에서 RAG 시스템 구현하기

Koog에서 RAG 시스템을 구현하려면 다음 단계를 따르세요.

1.  Ollama 또는 OpenAI를 사용하여 임베더를 생성합니다. 임베더는 LLM 클라이언트 인스턴스와 모델을 매개변수로 받는 `LLMEmbedder` 클래스의 인스턴스입니다. 자세한 내용은 [임베딩](embeddings.md)을 참조하세요.
2.  생성된 일반 임베더를 기반으로 문서 임베더를 생성합니다.
3.  문서 저장소를 생성합니다.
4.  저장소에 문서를 추가합니다.
5.  정의된 쿼리를 사용하여 가장 관련성 높은 문서를 찾습니다.

이 일련의 단계는 주어진 사용자 쿼리에 대해 가장 관련성 높은 문서를 반환하는 *관련성 검색* 흐름을 나타냅니다. 다음은 위에서 설명한 전체 단계 시퀀스를 구현하는 방법을 보여주는 코드 샘플입니다.

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.JVMTextDocumentEmbedder
import kotlinx.coroutines.runBlocking
import java.nio.file.Path

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an embedder using Ollama
val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
// You may also use OpenAI embeddings with:
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// Create a JVM-specific document embedder
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// Create a ranked document storage using in-memory vector storage
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

// Store documents in the storage
rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
// ... store more documents as needed
rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

// Find the most relevant documents for a user query
val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

// Process the relevant files
relevantFiles.forEach { file ->
    println("Relevant file: ${file.toAbsolutePath()}")
    // Process the file content as needed
}
```
<!--- KNIT example-ranked-document-storage-01.kt -->

### AI 에이전트가 사용할 관련성 검색 제공

순위가 매겨진 문서 저장소 시스템을 갖추면 이를 사용하여 AI 에이전트에 관련 컨텍스트를 제공하여 사용자 쿼리에 응답할 수 있습니다. 이는 에이전트가 정확하고 상황에 맞는 응답을 제공하는 능력을 향상시킵니다.

다음은 AI 에이전트가 문서 저장소에서 정보를 가져와 쿼리에 응답할 수 있도록 정의된 RAG 시스템을 구현하는 방법의 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.JVMTextDocumentEmbedder
import kotlin.io.path.pathString

// Create an embedder using Ollama
val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
// You may also use OpenAI embeddings with:
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// Create a JVM-specific document embedder
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// Create a ranked document storage using in-memory vector storage
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

const val apiKey = "apikey"

-->
```kotlin
suspend fun solveUserRequest(query: String) {
    // Retrieve top-5 documents from the document provider
    val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

    // Create an AI Agent with the relevant context
    val agentConfig = AIAgentConfig(
        prompt = prompt("context") {
            system("You are a helpful assistant. Use the provided context to answer the user's question accurately.")
            user {
                "Relevant context"
                attachments {
                    relevantDocuments.forEach {
                        file(it.pathString, "text/plain")
                    }
                }
            }
        },
        model = OpenAIModels.Chat.GPT4o, // Or a different model of your choice
        maxAgentIterations = 100,
    )

    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o
    )

    // Run the agent to get a response
    val response = agent.run(query)

    // Return or process the response
    println("Agent response: $response")
}
```
<!--- KNIT example-ranked-document-storage-02.kt -->

### 도구로써 관련성 검색 제공

문서 내용을 직접 컨텍스트로 제공하는 대신, 에이전트가 필요에 따라 관련성 검색을 수행할 수 있도록 하는 도구를 구현할 수도 있습니다. 이를 통해 에이전트는 문서 저장소를 언제 어떻게 사용할지 결정하는 데 더 많은 유연성을 가질 수 있습니다.

다음은 관련성 검색 도구를 구현하는 방법의 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.asTool
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.JVMTextDocumentEmbedder
import kotlinx.coroutines.runBlocking
import java.nio.file.Files

// Create an embedder using Ollama
val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
// You may also use OpenAI embeddings with:
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// Create a JVM-specific document embedder
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// Create a ranked document storage using in-memory vector storage
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

const val apiKey = "apikey"

-->
```kotlin
@Tool
@LLMDescription("모든 주제에 대한 관련 문서(존재하는 경우)를 검색합니다. 가장 관련성 높은 문서의 내용을 반환합니다.")
suspend fun searchDocuments(
    @LLMDescription("관련 문서를 검색할 쿼리입니다.")
    query: String,
    @LLMDescription("최대 문서 수입니다.")
    count: Int
): String {
    val relevantDocuments =
        rankedDocumentStorage.mostRelevantDocuments(query, count = count, similarityThreshold = 0.9).toList()

    if (!relevantDocuments.isEmpty()) {
        return "No relevant documents found for the query: $query"
    }

    val result = StringBuilder("Found ${relevantDocuments.size} relevant documents:
\n")

    relevantDocuments.forEachIndexed { index, document ->
        val content = Files.readString(document)
        result.append("Document ${index + 1}: ${document.fileName}
")
        result.append("Content: $content
\n")
    }

    return result.toString()
}

fun main() {
    runBlocking {
        val tools = ToolRegistry {
            tool(::searchDocuments.asTool())
        }

        val agent = AIAgent(
            toolRegistry = tools,
            executor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val response = agent.run("How to make a cake?")
        println("Agent response: $response")

    }
}
```
<!--- KNIT example-ranked-document-storage-03.kt -->

이 접근 방식을 사용하면 에이전트가 쿼리를 기반으로 검색 도구를 언제 사용할지 결정할 수 있습니다. 이는 여러 문서의 정보가 필요하거나 에이전트가 특정 세부 정보를 검색해야 하는 복잡한 쿼리에 특히 유용합니다.

## 벡터 저장소 및 문서 임베딩 제공자의 기존 구현

RAG 시스템의 편리하고 쉬운 구현을 위해 Koog는 벡터 저장소, 문서 임베딩, 그리고 결합된 임베딩 및 저장소 구성 요소에 대한 여러 가지 바로 사용 가능한 구현을 제공합니다.

### 벡터 저장소

#### InMemoryVectorStorage

문서를 메모리에 저장하고 벡터 임베딩을 수행하는 간단한 인메모리 구현입니다. 테스트 또는 소규모 애플리케이션에 적합합니다.

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

자세한 내용은 [InMemoryVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-vector-storage/index.html) 레퍼런스를 참조하세요.

#### FileVectorStorage

문서를 디스크에 저장하고 벡터 임베딩을 수행하는 파일 기반 구현입니다. 애플리케이션 재시작 전반에 걸쳐 영구 저장소에 적합합니다.

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val fileStorage = FileVectorStorage<Document, Path>(
   documentReader = documentProvider,
   fs = fileSystemProvider,
   root = rootPath
)
```
<!--- KNIT example-ranked-document-storage-05.kt -->

자세한 내용은 [FileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-vector-storage/index.html) 레퍼런스를 참조하세요.

#### JVMFileVectorStorage

`java.nio.file.Path`와 함께 작동하는 `FileVectorStorage`의 JVM 특정 구현입니다.

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

자세한 내용은 [JVMFileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-vector-storage/index.html) 레퍼런스를 참조하세요.

### 문서 임베더

#### TextDocumentEmbedder

텍스트로 변환할 수 있는 모든 문서 유형과 작동하는 일반 구현입니다.

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val textEmbedder = TextDocumentEmbedder<Document, Path>(
   documentReader = documentProvider,
   embedder = embedder
)
```
<!--- KNIT example-ranked-document-storage-07.kt -->

자세한 내용은 [TextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-text-document-embedder/index.html) 레퍼런스를 참조하세요.

#### JVMTextDocumentEmbedder

`java.nio.file.Path`와 함께 작동하는 JVM 특정 구현입니다.

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.vector.JVMTextDocumentEmbedder

-->
```kotlin
val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
val jvmTextEmbedder = JVMTextDocumentEmbedder(embedder = embedder)
```
<!--- KNIT example-ranked-document-storage-08.kt -->

자세한 내용은 [JVMTextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-document-embedder/index.html) 레퍼런스를 참조하세요.

### 결합된 저장소 구현

#### EmbeddingBasedDocumentStorage

문서 임베더와 벡터 저장소를 결합하여 문서 저장 및 순위 지정을 위한 완전한 솔루션을 제공합니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleRankedDocumentStorage02.documentEmbedder
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path

val vectorStorage = InMemoryVectorStorage<Path>()

-->
```kotlin
val embeddingStorage = EmbeddingBasedDocumentStorage(
    embedder = documentEmbedder,
    storage = vectorStorage
)
```
<!--- KNIT example-ranked-document-storage-09.kt -->

자세한 내용은 [EmbeddingBasedDocumentStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-embedding-based-document-storage/index.html) 레퍼런스를 참조하세요.

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage`의 인메모리 구현입니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleRankedDocumentStorage03.documentEmbedder
import ai.koog.rag.vector.InMemoryDocumentEmbeddingStorage
import java.nio.file.Path

typealias Document = Path
-->
```kotlin
val inMemoryEmbeddingStorage = InMemoryDocumentEmbeddingStorage<Document>(
    embedder = documentEmbedder
)

```
<!--- KNIT example-ranked-document-storage-10.kt -->

자세한 내용은 [InMemoryDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-document-embedding-storage/index.html) 레퍼런스를 참조하세요.

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage`의 파일 기반 구현입니다.

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val fileEmbeddingStorage = FileDocumentEmbeddingStorage<Document, Path>(
   embedder = documentEmbedder,
   documentProvider = documentProvider,
   fs = fileSystemProvider,
   root = rootPath
)
```
<!--- KNIT example-ranked-document-storage-11.kt -->

자세한 내용은 [FileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-document-embedding-storage/index.html) 레퍼런스를 참조하세요.

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage`의 JVM 특정 구현입니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleRankedDocumentStorage03.documentEmbedder
import ai.koog.rag.vector.JVMFileDocumentEmbeddingStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileEmbeddingStorage = JVMFileDocumentEmbeddingStorage(
   embedder = documentEmbedder,
   root = Path.of("/path/to/storage")
)
```
<!--- KNIT example-ranked-document-storage-12.kt -->

자세한 내용은 [JVMFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-document-embedding-storage/index.html) 레퍼런스를 참조하세요.

#### JVMTextFileDocumentEmbeddingStorage

`JVMTextDocumentEmbedder`와 `JVMFileVectorStorage`를 결합한 JVM 특정 구현입니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleRankedDocumentStorage08.embedder
import ai.koog.rag.vector.JVMTextFileDocumentEmbeddingStorage
import java.nio.file.Path
-->
```kotlin
val jvmTextFileEmbeddingStorage = JVMTextFileDocumentEmbeddingStorage(
   embedder = embedder,
   root = Path.of("/path/to/storage")
)
```
<!--- KNIT example-ranked-document-storage-13.kt -->

자세한 내용은 [JVMTextFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-file-document-embedding-storage/index.html) 레퍼런스를 참조하세요.

이러한 구현은 다양한 환경에서 문서 임베딩 및 벡터 저장소와 함께 작동하기 위한 유연하고 확장 가능한 프레임워크를 제공합니다.

## 자신만의 벡터 저장소 및 문서 임베더 구현하기

Koog의 벡터 저장소 프레임워크를 확장하여 자신만의 사용자 지정 문서 임베더와 벡터 저장소 솔루션을 구현할 수 있습니다. 이는 특수 문서 유형 또는 저장소 요구 사항과 함께 작업할 때 특히 유용합니다.

다음은 PDF 문서용 사용자 지정 문서 임베더를 구현하는 예시입니다.

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
import ai.koog.embeddings.base.Vector
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.embeddings.local.OllamaEmbeddingModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.RankedDocument
import ai.koog.rag.base.RankedDocumentStorage
import ai.koog.rag.base.files.DocumentProvider
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.DocumentEmbedder
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.VectorStorage
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.nio.file.Path
-->
```kotlin
// Define a PDFDocument class
class PDFDocument(private val path: Path) {
    fun readText(): String {
        // Use a PDF library to extract text from the PDF
        return "Text extracted from PDF at $path"
    }
}

// Implement a DocumentProvider for PDFDocument
class PDFDocumentProvider : DocumentProvider<Path, PDFDocument> {
    override suspend fun document(path: Path): PDFDocument? {
        return if (path.toString().endsWith(".pdf")) {
            PDFDocument(path)
        } else {
            null
        }
    }

    override suspend fun text(document: PDFDocument): CharSequence {
        return document.readText()
    }
}

// Implement a DocumentEmbedder for PDFDocument
class PDFDocumentEmbedder(private val embedder: Embedder) : DocumentEmbedder<PDFDocument> {
    override suspend fun embed(document: PDFDocument): Vector {
        val text = document.readText()
        return embed(text)
    }

    override suspend fun embed(text: String): Vector {
        return embedder.embed(text)
    }

    override fun diff(embedding1: Vector, embedding2: Vector): Double {
        return embedder.diff(embedding1, embedding2)
    }
}

// Create a custom vector storage for PDF documents
class PDFVectorStorage(
    private val pdfProvider: PDFDocumentProvider,
    private val embedder: PDFDocumentEmbedder,
    private val storage: VectorStorage<PDFDocument>
) : RankedDocumentStorage<PDFDocument> {
    override fun rankDocuments(query: String): Flow<RankedDocument<PDFDocument>> = flow {
        val queryVector = embedder.embed(query)
        storage.allDocumentsWithPayload().collect { (document, documentVector) ->
            emit(
                RankedDocument(
                    document = document,
                    similarity = 1.0 - embedder.diff(queryVector, documentVector)
                )
            )
        }
    }

    override suspend fun store(document: PDFDocument, data: Unit): String {
        val vector = embedder.embed(document)
        return storage.store(document, vector)
    }

    override suspend fun delete(documentId: String): Boolean {
        return storage.delete(documentId)
    }

    override suspend fun read(documentId: String): PDFDocument? {
        return storage.read(documentId)
    }

    override fun allDocuments(): Flow<PDFDocument> = flow {
        storage.allDocumentsWithPayload().collect {
            emit(it.document)
        }
    }
}

// Usage example
suspend fun main() {
    val pdfProvider = PDFDocumentProvider()
    val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
    val pdfEmbedder = PDFDocumentEmbedder(embedder)
    val storage = InMemoryVectorStorage<PDFDocument>()
    val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

    // Store PDF documents
    val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
    pdfStorage.store(pdfDocument)

    // Query for relevant PDF documents
    val relevantPDFs = pdfStorage.mostRelevantDocuments("information about climate change", count = 3)

}
```
<!--- KNIT example-ranked-document-storage-14.kt -->

## 임베딩 기반이 아닌 사용자 지정 RankedDocumentStorage 구현하기

임베딩 기반 문서 순위 지정이 강력하긴 하지만, 임베딩에 의존하지 않는 사용자 지정 순위 지정 메커니즘을 구현하려는 시나리오도 있습니다. 예를 들어, 다음을 기반으로 문서 순위를 지정할 수 있습니다.

-   PageRank와 유사한 알고리즘
-   키워드 빈도
-   문서의 최신성
-   사용자 상호 작용 기록
-   도메인별 휴리스틱

다음은 간단한 키워드 기반 순위 지정 접근 방식을 사용하는 사용자 지정 `RankedDocumentStorage`를 구현하는 예시입니다.

<!--- INCLUDE
import ai.koog.rag.base.DocumentStorage
import ai.koog.rag.base.RankedDocument
import ai.koog.rag.base.RankedDocumentStorage
import ai.koog.rag.base.files.DocumentProvider
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.nio.file.Path
-->
```kotlin
class KeywordBasedDocumentStorage<Document>(
    private val documentProvider: DocumentProvider<Path, Document>,
    private val storage: DocumentStorage<Document>
) : RankedDocumentStorage<Document> {

    override fun rankDocuments(query: String): Flow<RankedDocument<Document>> = flow {
        // Split the query into keywords
        val keywords = query.lowercase().split(Regex("\\W+")).filter { it.length > 2 }

        // Process each document
        storage.allDocuments().collect { document ->
            // Get the document text
            val documentText = documentProvider.text(document).toString().lowercase()

            // Calculate a simple similarity score based on keyword frequency
            var similarity = 0.0
            for (keyword in keywords) {
                val count = countOccurrences(documentText, keyword)
                if (count > 0) {
                    similarity += count.toDouble() / documentText.length * 1000
                }
            }

            // Emit the document with its similarity score
            emit(RankedDocument(document, similarity))
        }
    }

    private fun countOccurrences(text: String, keyword: String): Int {
        var count = 0
        var index = 0
        while (index != -1) {
            index = text.indexOf(keyword, index)
            if (index != -1) {
                count++
                index += keyword.length
            }
        }
        return count
    }

    override suspend fun store(document: Document, data: Unit): String {
        return storage.store(document)
    }

    override suspend fun delete(documentId: String): Boolean {
        return storage.delete(documentId)
    }

    override suspend fun read(documentId: String): Document? {
        return storage.read(documentId)
    }

    override fun allDocuments(): Flow<Document> {
        return storage.allDocuments()
    }
}
```
<!--- KNIT example-ranked-document-storage-15.kt -->

이 구현은 쿼리의 키워드가 문서 텍스트에 나타나는 빈도를 기반으로 문서 순위를 지정합니다. TF-IDF(단어 빈도-역문서 빈도) 또는 BM25와 같은 더 정교한 알고리즘으로 이 접근 방식을 확장할 수 있습니다.

또 다른 예시는 최신 문서를 우선하는 시간 기반 순위 시스템입니다.

<!--- INCLUDE
import ai.koog.rag.base.DocumentStorage
import ai.koog.rag.base.RankedDocument
import ai.koog.rag.base.RankedDocumentStorage
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.lang.System.currentTimeMillis
-->
```kotlin
class TimeBasedDocumentStorage<Document>(
    private val storage: DocumentStorage<Document>,
    private val getDocumentTimestamp: (Document) -> Long
) : RankedDocumentStorage<Document> {

    override fun rankDocuments(query: String): Flow<RankedDocument<Document>> = flow {
        val currentTime = System.currentTimeMillis()

        storage.allDocuments().collect { document ->
            val timestamp = getDocumentTimestamp(document)
            val ageInHours = (currentTime - timestamp) / (1000.0 * 60 * 60)

            // Calculate a decay factor based on age (newer documents get higher scores)
            val decayFactor = Math.exp(-0.01 * ageInHours)

            emit(RankedDocument(document, decayFactor))
        }
    }

    // Implement other required methods from RankedDocumentStorage
    override suspend fun store(document: Document, data: Unit): String {
        return storage.store(document)
    }

    override suspend fun delete(documentId: String): Boolean {
        return storage.delete(documentId)
    }

    override suspend fun read(documentId: String): Document? {
        return storage.read(documentId)
    }

    override fun allDocuments(): Flow<Document> {
        return storage.allDocuments()
    }
}
```
<!--- KNIT example-ranked-document-storage-16.kt -->

`RankedDocumentStorage` 인터페이스를 구현함으로써 나머지 RAG 인프라를 활용하면서도 특정 사용 사례에 맞춰진 사용자 지정 순위 지정 메커니즘을 생성할 수 있습니다.

Koog 설계의 유연성을 통해 다양한 저장 및 순위 지정 전략을 혼합하여 특정 요구 사항을 충족하는 시스템을 구축할 수 있습니다.