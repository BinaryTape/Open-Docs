# 文档存储

为了让您能够提供最新且可搜索的信息源供大型语言模型 (LLM) 使用，Koog 支持资源增强生成 (RAG)，以从文档中存储和检索信息。

## RAG 核心功能

常见 RAG 系统的核心组件包括：

- **文档存储**：包含信息的文档、文件或文本块的仓库。
- **向量嵌入**：捕捉语义的文本数值表示。有关 Koog 中嵌入的更多信息，请参阅 [嵌入](embeddings.md)。
- **检索机制**：根据查询查找最相关文档的系统。
- **生成组件**：使用检索到的信息生成响应的 LLM。

RAG 解决了传统 LLM 的几个局限性：

- **知识截止**：RAG 可以访问最新信息，而不受限于训练数据。
- **幻觉**：通过将响应建立在检索到的文档之上，RAG 减少了捏造的信息。
- **领域特定性**：通过策划知识库，可以针对特定领域量身定制 RAG。
- **透明度**：可以引用信息来源，使系统更具可解释性。

## 在 RAG 系统中查找信息

在 RAG 系统中查找相关信息涉及将文档存储为向量嵌入，并根据它们与用户查询的相似度进行排序。这种方法适用于各种文档类型，包括 PDF、图像、文本文件，甚至是单个文本块。

该过程包括：

1. **文档嵌入**：将文档转换为捕捉其语义的向量表示。
2. **向量存储**：高效存储这些嵌入以便快速检索。
3. **相似度搜索**：查找嵌入与查询嵌入最相似的文档。
4. **排序**：按相关性评分对文档进行排序。

## 在 Koog 中实现 RAG 系统

要在 Koog 中实现 RAG 系统，请遵循以下步骤：

1. 使用 Ollama 或 OpenAI 创建嵌入器。嵌入器是 `LLMEmbedder` 类的实例，它接收 LLM 客户端实例和模型作为参数。有关更多信息，请参阅 [嵌入](embeddings.md)。
2. 基于创建的通用嵌入器创建文档嵌入器。
3. 创建文档存储。
4. 向存储中添加文档。
5. 使用定义的查询查找最相关的文档。

这一系列步骤代表了一个*相关性搜索*流程，它会返回给定用户查询的最相关文档。以下是一个代码示例，展示了如何实现上述整个步骤序列：

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
// 使用 Ollama 创建嵌入器
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
// 您也可以通过以下方式使用 OpenAI 嵌入：
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// 创建 JVM 特定的文档嵌入器
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// 使用内存向量存储创建排序文档存储
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

// 将文档存入存储
rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
// ... 根据需要存储更多文档
rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

// 为用户查询查找最相关的文档
val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

// 处理相关文件
relevantFiles.forEach { file ->
    println("Relevant file: ${file.toAbsolutePath()}")
    // 根据需要处理文件内容
}
```
<!--- KNIT example-ranked-document-storage-01.kt -->

### 为 AI 智能体提供相关性搜索

一旦拥有了排序文档存储系统，您就可以使用它为 AI 智能体提供相关上下文，以回答用户查询。这增强了智能体提供准确且上下文适当响应的能力。

以下是一个示例，展示了如何为 AI 智能体实现定义的 RAG 系统，使其能够通过从文档存储中获取信息来回答查询：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.JVMTextDocumentEmbedder
import kotlin.io.path.pathString

// 使用 Ollama 创建嵌入器
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
// 您也可以通过以下方式使用 OpenAI 嵌入：
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// 创建 JVM 特定的文档嵌入器
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// 使用内存向量存储创建排序文档存储
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

const val apiKey = "apikey"

-->
```kotlin
suspend fun solveUserRequest(query: String) {
    // 从文档提供程序中检索前 5 个文档
    val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

    // 使用相关上下文创建 AI 智能体
    val agentConfig = AIAgentConfig(
        prompt = prompt("context") {
            system("You are a helpful assistant. Use the provided context to answer the user's question accurately.")
            user {
                +"Relevant context:"
                relevantDocuments.forEach {
                    file(it.pathString, "text/plain")
                }
            }
        },
        model = OpenAIModels.Chat.GPT4o, // 或您选择的其他模型
        maxAgentIterations = 100,
    )

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o
    )

    // 运行智能体以获取响应
    val response = agent.run(query)

    // 返回或处理响应
    println("Agent response: $response")
}
```
<!--- KNIT example-ranked-document-storage-02.kt -->

### 将相关性搜索作为工具提供

除了直接提供文档内容作为上下文，您还可以实现一个工具，允许智能体根据需求执行相关性搜索。这使智能体在决定何时以及如何使用文档存储方面具有更大的灵活性。

以下是一个如何实现相关性搜索工具的示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.asTool
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.base.mostRelevantDocuments
import ai.koog.rag.vector.EmbeddingBasedDocumentStorage
import ai.koog.rag.vector.InMemoryVectorStorage
import ai.koog.rag.vector.JVMTextDocumentEmbedder
import kotlinx.coroutines.runBlocking
import java.nio.file.Files

// 使用 Ollama 创建嵌入器
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
// 您也可以通过以下方式使用 OpenAI 嵌入：
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// 创建 JVM 特定的文档嵌入器
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// 使用内存向量存储创建排序文档存储
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

const val apiKey = "apikey"

-->
```kotlin
@Tool
@LLMDescription("Search for relevant documents about any topic (if exists). Returns the content of the most relevant documents.")
suspend fun searchDocuments(
    @LLMDescription("Query to search relevant documents about")
    query: String,
    @LLMDescription("Maximum number of documents")
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
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val response = agent.run("How to make a cake?")
        println("Agent response: $response")

    }
}
```
<!--- KNIT example-ranked-document-storage-03.kt -->

通过这种方法，智能体可以根据您的查询决定何时使用搜索工具。这对于可能需要来自多个文档的信息的复杂查询，或者当智能体需要搜索特定细节时特别有用。

## 向量存储和文档嵌入提供程序的现有实现

为了方便且更轻松地实现 RAG 系统，Koog 为向量存储、文档嵌入以及组合嵌入和存储组件提供了几种开箱即用的实现。

### 向量存储

#### InMemoryVectorStorage

一个简单的内存实现，将文档及其向量嵌入存储在内存中。适用于测试或小规模应用。

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

有关更多信息，请参阅 [InMemoryVectorStorage](api:vector-storage::ai.koog.rag.vector.InMemoryVectorStorage) 参考。

#### FileVectorStorage

一个基于文件的实现，将文档及其向量嵌入存储在磁盘上。适用于应用程序重启后的持久化存储。

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

有关更多信息，请参阅 [FileVectorStorage](api:vector-storage::ai.koog.rag.vector.FileVectorStorage) 参考。

#### JVMFileVectorStorage

`FileVectorStorage` 的 JVM 特定实现，适用于 `java.nio.file.Path`。

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

有关更多信息，请参阅 [JVMFileVectorStorage](api:vector-storage::ai.koog.rag.vector.JVMFileVectorStorage) 参考。

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

有关更多信息，请参阅 [TextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.TextDocumentEmbedder) 参考。

#### JVMTextDocumentEmbedder

适用于 `java.nio.file.Path` 的 JVM 特定实现。

<!--- INCLUDE
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.rag.vector.JVMTextDocumentEmbedder

-->
```kotlin
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
val jvmTextEmbedder = JVMTextDocumentEmbedder(embedder = embedder)
```
<!--- KNIT example-ranked-document-storage-08.kt -->

有关更多信息，请参阅 [JVMTextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.JVMTextDocumentEmbedder) 参考。

### 组合存储实现

#### EmbeddingBasedDocumentStorage

结合了文档嵌入器和向量存储，为存储和排序文档提供完整的解决方案。

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

有关更多信息，请参阅 [EmbeddingBasedDocumentStorage](api:vector-storage::ai.koog.rag.vector.EmbeddingBasedDocumentStorage) 参考。

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

有关更多信息，请参阅 [InMemoryDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.InMemoryDocumentEmbeddingStorage) 参考。

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的基于文件的实现。

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

有关更多信息，请参阅 [FileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.FileDocumentEmbeddingStorage) 参考。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` 的 JVM 特定实现。

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

有关更多信息，请参阅 [JVMFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMFileDocumentEmbeddingStorage) 参考。

#### JVMTextFileDocumentEmbeddingStorage

结合了 `JVMTextDocumentEmbedder` 和 `JVMFileVectorStorage` 的 JVM 特定实现。

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

有关更多信息，请参阅 [JVMTextFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMTextFileDocumentEmbeddingStorage) 参考。

这些实现为在各种环境中使用文档嵌入和向量存储提供了一个灵活且可扩展的框架。

## 实现您自己的向量存储和文档嵌入器

您可以通过实现自己的自定义文档嵌入器和向量存储解决方案来扩展 Koog 的向量存储框架。这在处理特殊的文档类型或存储要求时特别有用。

以下是为 PDF 文档实现自定义文档嵌入器的示例：

<!--- INCLUDE
import ai.koog.embeddings.base.Embedder
import ai.koog.embeddings.base.Vector
import ai.koog.embeddings.local.LLMEmbedder
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
// 定义 PDFDocument 类
class PDFDocument(private val path: Path) {
    fun readText(): String {
        // 使用 PDF 库从 PDF 中提取文本
        return "Text extracted from PDF at $path"
    }
}

// 为 PDFDocument 实现 DocumentProvider
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

// 为 PDFDocument 实现 DocumentEmbedder
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

// 为 PDF 文档创建自定义向量存储
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
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
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

## 实现自定义的非嵌入式排序文档存储 (RankedDocumentStorage)

虽然基于嵌入的文档排序功能强大，但在某些情况下，您可能希望实现不依赖嵌入的自定义排序机制。例如，您可能希望基于以下内容对文档进行排序：

- 类 PageRank 算法
- 关键词频率
- 文档的新鲜度
- 用户交互历史
- 领域特定启发式

以下是一个使用简单的基于关键词排序方法的自定义 `RankedDocumentStorage` 实现示例：

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

            // 基于关键词频率计算简单的相似度分数
            var similarity = 0.0
            for (keyword in keywords) {
                val count = countOccurrences(documentText, keyword)
                if (count > 0) {
                    similarity += count.toDouble() / documentText.length * 1000
                }
            }

            // 发射带有相似度分数的文档
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

该实现根据查询关键词在文档文本中出现的频率对文档进行排序。您可以使用更复杂的算法（如 TF-IDF（词频-逆文档频率）或 BM25）来扩展此方法。

另一个示例是优先考虑近期文档的基于时间的排序系统：

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

            // 基于时间计算衰减因子（越新的文档得分越高）
            val decayFactor = Math.exp(-0.01 * ageInHours)

            emit(RankedDocument(document, decayFactor))
        }
    }

    // 实现 RankedDocumentStorage 的其他必需方法
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

通过实现 `RankedDocumentStorage` 接口，您可以创建量身定制的自定义排序机制，同时仍能利用 RAG 基础架构的其余部分。

Koog 设计的灵活性允许您混合并搭配不同的存储和排序策略，以构建满足您特定要求的系统。