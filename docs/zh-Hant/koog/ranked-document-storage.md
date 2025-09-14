# 文件儲存

為了讓您能為大型語言模型 (LLM) 提供最新且可搜尋的資訊來源，Koog 支援資源增強生成 (RAG) 以儲存並從文件中檢索資訊。

## RAG 的主要功能

常見 RAG 系統的核心組件包括：

- **文件儲存**：包含資訊的文件、檔案或文字區塊儲存庫。
- **向量嵌入**：捕捉語義含義的文字數值表示。有關 Koog 中嵌入的更多資訊，請參閱 [嵌入](embeddings.md)。
- **檢索機制**：根據查詢找到最相關文件的系統。
- **生成組件**：使用檢索到的資訊生成回應的 LLM。

RAG 解決了傳統 LLM 的多項限制：

- **知識截止點**：RAG 可以存取最新資訊，不受訓練資料限制。
- **幻覺**：透過將回應基於檢索到的文件，RAG 減少了虛構資訊。
- **領域專一性**：RAG 可以透過策劃知識庫來針對特定領域進行客製化。
- **透明度**：可以引用資訊來源，使系統更具可解釋性。

## 在 RAG 系統中尋找資訊

在 RAG 系統中尋找相關資訊，涉及將文件儲存為向量嵌入，並根據其與使用者查詢的相似度進行排名。此方法適用於各種文件類型，包括 PDF、圖片、文字檔，甚至是單獨的文字區塊。

此流程涉及：

1.  **文件嵌入**：將文件轉換為捕捉其語義含義的向量表示。
2.  **向量儲存**：高效儲存這些嵌入以實現快速檢索。
3.  **相似度搜尋**：尋找其嵌入與查詢嵌入最相似的文件。
4.  **排名**：依據其相關性分數對文件進行排序。

## 在 Koog 中實作 RAG 系統

要在 Koog 中實作 RAG 系統，請遵循以下步驟：

1.  使用 Ollama 或 OpenAI 建立嵌入器。嵌入器是 `LLMEmbedder` 類別的一個實例，它將 LLM 用戶端實例和模型作為參數。有關更多資訊，請參閱 [嵌入](embeddings.md)。
2.  根據已建立的通用嵌入器建立一個文件嵌入器。
3.  建立文件儲存。
4.  將文件新增至儲存。
5.  使用定義的查詢尋找最相關文件。

此步驟序列代表一個「*相關性搜尋*」流程，它會針對給定的使用者查詢傳回最相關的文件。以下是展示如何實作上述整個步驟序列的程式碼範例：

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
// 使用 Ollama 建立嵌入器
val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
// 您也可以使用 OpenAI 嵌入：
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// 建立 JVM 特定文件嵌入器
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// 使用記憶體內向量儲存建立排名文件儲存
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

// 將文件儲存至儲存
rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
// ... 視需要儲存更多文件
rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

// 尋找使用者查詢的最相關文件
val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

// 處理相關檔案
relevantFiles.forEach { file ->
    println("Relevant file: ${file.toAbsolutePath()}")
    // 視需要處理檔案內容
}
```
<!--- KNIT example-ranked-document-storage-01.kt -->

### 為 AI 代理提供相關性搜尋功能

一旦您擁有具排名功能的文件儲存系統，您就可以使用它為 AI 代理提供相關上下文，以回答使用者查詢。這將增強代理提供準確且符合上下文的回應能力。

以下是實作定義的 RAG 系統的範例，以使 AI 代理能夠透過從文件儲存中獲取資訊來回答查詢：

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
    // 從文件提供者檢索前 5 個文件
    val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

    // 建立一個具相關上下文的 AI 代理
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
        model = OpenAIModels.Chat.GPT4o, // 或您選擇的其他模型
        maxAgentIterations = 100,
    )

    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o
    )

    // 執行代理以獲取回應
    val response = agent.run(query)

    // 傳回或處理回應
    println("Agent response: $response")
}
```
<!--- KNIT example-ranked-document-storage-02.kt -->

### 將相關性搜尋作為工具提供

您也可以實作一個工具，讓代理能夠根據需求執行相關性搜尋，而不是直接提供文件內容作為上下文。這使得代理在決定何時以及如何使用文件儲存方面具有更大的彈性。

以下是實作相關性搜尋工具的範例：

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
@LLMDescription("搜尋任何主題的相關文件（如果存在）。傳回最相關文件的內容。")
suspend fun searchDocuments(
    @LLMDescription("用於搜尋相關文件的查詢")
    query: String,
    @LLMDescription("文件的最大數量")
    count: Int
): String {
    val relevantDocuments =
        rankedDocumentStorage.mostRelevantDocuments(query, count = count, similarityThreshold = 0.9).toList()

    if (relevantDocuments.isEmpty()) { // Corrected from !relevantDocuments.isEmpty() based on logical flow
        return "找不到與查詢：$query 相關的文件"
    }

    val result = StringBuilder("找到 ${relevantDocuments.size} 個相關文件：
\n")

    relevantDocuments.forEachIndexed { index, document ->
        val content = Files.readString(document)
        result.append("文件 ${index + 1}：${document.fileName}
")
        result.append("內容：$content
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

透過這種方法，代理可以根據您的查詢決定何時使用搜尋工具。這對於可能需要來自多個文件的資訊，或當代理需要搜尋特定細節的複雜查詢特別有用。

## 向量儲存和文件嵌入提供者的現有實作

為了方便和更容易實作 RAG 系統，Koog 提供了多種現成的向量儲存、文件嵌入以及組合嵌入和儲存組件的實作。

### 向量儲存

#### InMemoryVectorStorage

一個簡單的記憶體內實作，用於在記憶體中儲存文件及其向量嵌入。適用於測試或小型應用程式。

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

有關更多資訊，請參閱 [InMemoryVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-vector-storage/index.html) 參考。

#### FileVectorStorage

一個基於檔案的實作，用於在磁碟上儲存文件及其向量嵌入。適用於跨應用程式重啟的持久儲存。

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

有關更多資訊，請參閱 [FileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-vector-storage/index.html) 參考。

#### JVMFileVectorStorage

`FileVectorStorage` 的 JVM 特定實作，與 `java.nio.file.Path` 搭配使用。

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

有關更多資訊，請參閱 [JVMFileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-vector-storage/index.html) 參考。

### 文件嵌入器

#### TextDocumentEmbedder

一個通用實作，適用於任何可轉換為文字的文件類型。

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

有關更多資訊，請參閱 [TextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-text-document-embedder/index.html) 參考。

#### JVMTextDocumentEmbedder

一個 JVM 特定實作，與 `java.nio.file.Path` 搭配使用。

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

有關更多資訊，請參閱 [JVMTextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-document-embedder/index.html) 參考。

### 組合儲存實作

#### EmbeddingBasedDocumentStorage

結合文件嵌入器和向量儲存，為儲存和排名文件提供完整的解決方案。

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

有關更多資訊，請參閱 [EmbeddingBasedDocumentStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-embedding-based-document-storage/index.html) 參考。

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的記憶體內實作。

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

有關更多資訊，請參閱 [InMemoryDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-document-embedding-storage/index.html) 參考。

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的檔案實作。

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

有關更多資訊，請參閱 [FileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-document-embedding-storage/index.html) 參考。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` 的 JVM 特定實作。

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

有關更多資訊，請參閱 [JVMFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-document-embedding-storage/index.html) 參考。

#### JVMTextFileDocumentEmbeddingStorage

一個 JVM 特定實作，結合了 `JVMTextDocumentEmbedder` 和 `JVMFileVectorStorage`。

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

有關更多資訊，請參閱 [JVMTextFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-file-document-embedding-storage/index.html) 參考。

這些實作為在各種環境中處理文件嵌入和向量儲存提供了靈活且可擴展的框架。

## 實作您自己的向量儲存和文件嵌入器

您可以透過實作自己的自訂文件嵌入器和向量儲存解決方案來擴展 Koog 的向量儲存框架。這在處理特殊文件類型或儲存需求時特別有用。

以下是為 PDF 文件實作自訂文件嵌入器的範例：

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
// 定義一個 PDFDocument 類別
class PDFDocument(private val path: Path) {
    fun readText(): String {
        // 使用 PDF 函式庫從 PDF 中提取文字
        return "Text extracted from PDF at $path"
    }
}

// 為 PDFDocument 實作 DocumentProvider
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

// 為 PDFDocument 實作 DocumentEmbedder
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

// 為 PDF 文件建立自訂向量儲存
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

// 使用範例
suspend fun main() {
    val pdfProvider = PDFDocumentProvider()
    val embedder = LLMEmbedder(OllamaClient(), OllamaEmbeddingModels.NOMIC_EMBED_TEXT)
    val pdfEmbedder = PDFDocumentEmbedder(embedder)
    val storage = InMemoryVectorStorage<PDFDocument>()
    val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

    // 儲存 PDF 文件
    val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
    pdfStorage.store(pdfDocument)

    // 查詢相關的 PDF 文件
    val relevantPDFs = pdfStorage.mostRelevantDocuments("information about climate change", count = 3)

}
```
<!--- KNIT example-ranked-document-storage-14.kt -->

## 實作自訂非嵌入式 RankedDocumentStorage

雖然基於嵌入的文件排名功能強大，但在某些情況下，您可能希望實作不依賴嵌入的自訂排名機制。例如，您可能希望根據以下內容對文件進行排名：

- 類似 PageRank 的演算法
- 關鍵字頻率
- 文件時效性
- 使用者互動歷史
- 領域特定啟發式方法

以下是實作一個使用簡單關鍵字排名方法的自訂 `RankedDocumentStorage` 的範例：

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
        // 將查詢拆分為關鍵字
        val keywords = query.lowercase().split(Regex("\\W+")).filter { it.length > 2 }

        // 處理每個文件
        storage.allDocuments().collect { document ->
            // 獲取文件文字
            val documentText = documentProvider.text(document).toString().lowercase()

            // 根據關鍵字頻率計算簡單的相似度分數
            var similarity = 0.0
            for (keyword in keywords) {
                val count = countOccurrences(documentText, keyword)
                if (count > 0) {
                    similarity += count.toDouble() / documentText.length * 1000
                }
            }

            // 發出文件及其相似度分數
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

此實作根據查詢關鍵字在文件文字中出現的頻率對文件進行排名。您可以透過更複雜的演算法（例如詞頻-逆文件頻率 (TF-IDF) 或 BM25）來擴展此方法。

另一個範例是優先考慮近期文件的基於時間的排名系統：

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

            // 根據文件時效性計算衰減因子（較新的文件獲得較高分數）
            val decayFactor = Math.exp(-0.01 * ageInHours)

            emit(RankedDocument(document, decayFactor))
        }
    }

    // 實作 RankedDocumentStorage 中的其他必要方法
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

透過實作 `RankedDocumentStorage` 介面，您可以建立針對特定使用案例量身定制的自訂排名機制，同時仍可利用 RAG 基礎設施的其餘部分。

Koog 設計的靈活性允許您混合搭配不同的儲存和排名策略，以建立滿足您特定需求的系統。