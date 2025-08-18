# 文档存储

为了让你能为大型语言模型 (LLM) 提供最新且可搜索的信息源，Koog 支持资源增强生成 (RAG) 以存储和检索文档中的信息。

## 关键 RAG 特性

通用 RAG 系统的核心组件包括：

-   **文档存储**：包含信息的文档、文件或文本块的文档库。
-   **向量嵌入**：捕获语义含义的文本数值表示。关于 Koog 中嵌入的更多信息，请参见 [Embeddings](embeddings.md)。
-   **检索机制**：根据查询查找最相关文档的系统。
-   **生成组件**：使用检索到的信息生成回复的 LLM。

RAG 解决了传统 LLM 的若干限制：

-   **知识截止**：RAG 可以访问最新信息，不受训练数据限制。
-   **幻觉**：通过基于检索到的文档来支撑回复，RAG 减少了虚构信息。
-   **领域特有性**：RAG 可以通过整理知识库来适应特定领域。
-   **透明度**：可以引用信息来源，使系统更具可解释性。

## 在 RAG 系统中查找信息

在 RAG 系统中查找相关信息涉及将文档存储为向量嵌入，并根据它们与用户查询的相似性进行排序。此方法适用于各种文档类型，包括 PDF、图片、文本文件，甚至单个文本块。

该过程包括：

1.  **文档嵌入**：将文档转换为捕获其语义含义的向量表示。
2.  **向量存储**：高效存储这些嵌入以实现快速检索。
3.  **相似性搜索**：查找其嵌入与查询嵌入最相似的文档。
4.  **排序**：按相关性分数对文档进行排序。

## 在 Koog 中实现 RAG 系统

要在 Koog 中实现 RAG 系统，请按照以下步骤操作：

1.  使用 Ollama 或 OpenAI 创建一个嵌入器。该嵌入器是 `LLMEmbedder` 类的一个实例，它将 LLM 客户端实例和模型作为形参。关于更多信息，请参见 [Embeddings](embeddings.md)。
2.  基于已创建的通用嵌入器创建文档嵌入器。
3.  创建文档存储。
4.  将文档添加到存储中。
5.  使用已定义的查询查找最相关的文档。

这一系列步骤代表了一个“相关性搜索”流程，它会返回给定用户查询的最相关文档。以下是一个代码示例，演示了如何实现上述整个步骤序列：

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

### 为 AI 代理提供相关性搜索

一旦你拥有一个排序后的文档存储系统，就可以用它为 AI 代理提供相关上下文，以回答用户查询。这增强了代理提供准确且上下文适用的回复的能力。

以下是一个示例，展示了如何为 AI 代理实现已定义的 RAG 系统，以便能够从文档存储中获取信息来回答查询：

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

### 将相关性搜索作为工具提供

除了直接提供文档内容作为上下文之外，你还可以实现一个工具，允许代理按需执行相关性搜索。这使得代理在决定何时以及如何使用文档存储方面拥有更大的灵活性。

以下是一个示例，展示了如何实现相关性搜索工具：

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
@LLMDescription("搜索任何主题的相关文档（如果存在）。返回最相关文档的内容。")
suspend fun searchDocuments(
    @LLMDescription("用于搜索相关文档的查询")
    query: String,
    @LLMDescription("最大文档数量")
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

通过这种方法，代理可以根据你的查询决定何时使用搜索工具。这对于可能需要来自多个文档的信息或代理需要搜索特定细节的复杂查询特别有用。

## 向量存储和文档嵌入提供程序的现有实现

为了方便和更容易地实现 RAG 系统，Koog 提供了几个开箱即用的实现，用于向量存储、文档嵌入以及组合嵌入和存储组件。

### 向量存储

#### InMemoryVectorStorage

一个简单的内存实现，将文档及其向量嵌入存储在内存中。适用于测试或小型应用程序。

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

关于更多信息，请参见 [InMemoryVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-vector-storage/index.html) 参考文档。

#### FileVectorStorage

一个基于文件的实现，将文档及其向量嵌入存储在磁盘上。适用于跨应用程序重启的持久化存储。

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

关于更多信息，请参见 [FileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-vector-storage/index.html) 参考文档。

#### JVMFileVectorStorage

一个 JVM 特有的 `FileVectorStorage` 实现，适用于 `java.nio.file.Path`。

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

关于更多信息，请参见 [JVMFileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-vector-storage/index.html) 参考文档。

### 文档嵌入器

#### TextDocumentEmbedder

一个通用实现，适用于任何可以转换为文本的文档类型。

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

关于更多信息，请参见 [TextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-text-document-embedder/index.html) 参考文档。

#### JVMTextDocumentEmbedder

一个 JVM 特有的实现，适用于 `java.nio.file.Path`。

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

关于更多信息，请参见 [JVMTextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-document-embedder/index.html) 参考文档。

### 组合存储实现

#### EmbeddingBasedDocumentStorage

结合了文档嵌入器和向量存储，提供了一个用于存储和排序文档的完整解决方案。

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

关于更多信息，请参见 [EmbeddingBasedDocumentStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-embedding-based-document-storage/index.html) 参考文档。

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的内存实现。

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

关于更多信息，请参见 [InMemoryDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-document-embedding-storage/index.html) 参考文档。

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的文件实现。

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

关于更多信息，请参见 [FileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-document-embedding-storage/index.html) 参考文档。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` 的 JVM 特有实现。

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

关于更多信息，请参见 [JVMFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-document-embedding-storage/index.html) 参考文档。

#### JVMTextFileDocumentEmbeddingStorage

一个 JVM 特有的实现，结合了 `JVMTextDocumentEmbedder` 和 `JVMFileVectorStorage`。

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

关于更多信息，请参见 [JVMTextFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-file-document-embedding-storage/index.html) 参考文档。

这些实现提供了一个灵活且可扩展的框架，用于在各种环境中处理文档嵌入和向量存储。

## 实现你自己的向量存储和文档嵌入器

你可以通过实现自己的自定义文档嵌入器和向量存储解决方案来扩展 Koog 的向量存储框架。这在处理专门的文档类型或存储需求时特别有用。

以下是实现 PDF 文档自定义文档嵌入器的示例：

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
// 定义一个 PDFDocument 类
class PDFDocument(private val path: Path) {
    fun readText(): String {
        // Use a PDF library to extract text from the PDF
        return "Text extracted from PDF at $path"
    }
}

// 为 PDFDocument 实现一个 DocumentProvider
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

// 为 PDFDocument 实现一个 DocumentEmbedder
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

// 为 PDF 文档创建一个自定义向量存储
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

// 使用示例
suspend fun main() {
    val pdfProvider = PDFDocumentProvider()
    val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
    val pdfEmbedder = PDFDocumentEmbedder(embedder)
    val storage = InMemoryVectorStorage<PDFDocument>()
    val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

    // 存储 PDF 文档
    val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
    pdfStorage.store(pdfDocument)

    // 查询相关的 PDF 文档
    val relevantPDFs = pdfStorage.mostRelevantDocuments("information about climate change", count = 3)

}
```
<!--- KNIT example-ranked-document-storage-14.kt -->

## 实现自定义的非基于嵌入的 RankedDocumentStorage

虽然基于嵌入的文档排序功能强大，但在某些场景下你可能希望实现不依赖嵌入的自定义排序机制。例如，你可能希望根据以下条件对文档进行排序：

-   类似 PageRank 的算法
-   关键词频率
-   文档的新近度
-   用户交互历史
-   领域特有的启发式方法

以下是一个示例，展示了如何实现一个使用简单关键词排序方法的自定义 `RankedDocumentStorage`：

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
        // 将查询拆分为关键词
        val keywords = query.lowercase().split(Regex("\\W+")).filter { it.length > 2 }

        // 处理每个文档
        storage.allDocuments().collect { document ->
            // 获取文档文本
            val documentText = documentProvider.text(document).toString().lowercase()

            // 根据关键词频率计算一个简单的相似性分数
            var similarity = 0.0
            for (keyword in keywords) {
                val count = countOccurrences(documentText, keyword)
                if (count > 0) {
                    similarity += count.toDouble() / documentText.length * 1000
                }
            }

            // 发出文档及其相似性分数
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

此实现根据查询关键词在文档文本中出现的频率对文档进行排序。你可以使用更复杂的算法（例如 TF-IDF（词频-逆文档频率）或 BM25）来扩展此方法。

另一个示例是优先处理最新文档的基于时间的排序系统：

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

            // 根据文档时长计算衰减因子（新文档得分更高）
            val decayFactor = Math.exp(-0.01 * ageInHours)

            emit(RankedDocument(document, decayFactor))
        }
    }

    // 实现 RankedDocumentStorage 的其他所需方法
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

通过实现 `RankedDocumentStorage` 接口，你可以创建针对特定用例的自定义排序机制，同时仍然利用 RAG 基础设施的其余部分。

Koog 设计的灵活性允许你混合和匹配不同的存储和排序策略，以构建满足你特定需求的系统。