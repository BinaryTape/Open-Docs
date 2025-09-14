# ドキュメントストレージ

大規模言語モデル（LLM）で使用するための最新かつ検索可能な情報ソースを提供できるように、Koog は検索拡張生成（RAG）をサポートしており、ドキュメントからの情報の保存と取得を可能にします。

## 主な RAG 機能

一般的な RAG システムのコアコンポーネントには以下が含まれます。

-   **ドキュメントストレージ**: 情報を含むドキュメント、ファイル、またはテキストチャンクのリポジトリ。
-   **ベクトル埋め込み**: テキストのセマンティックな意味を捉える数値表現。Koog の埋め込みに関する詳細は、[埋め込み](embeddings.md) を参照してください。
-   **検索メカニズム**: クエリに基づいて最も関連性の高いドキュメントを見つけるシステム。
-   **生成コンポーネント**: 取得された情報を使用して応答を生成する LLM。

RAG は、従来の LLM のいくつかの制限に対処します。

-   **知識のカットオフ**: RAG は、トレーニングデータに限定されず、最新の情報にアクセスできます。
-   **ハルシネーション**: 検索されたドキュメントに基づいて応答を根拠とすることで、RAG は捏造された情報を削減します。
-   **ドメイン特異性**: RAG は、ナレッジベースをキュレーションすることで、特定のドメインに合わせて調整できます。
-   **透明性**: 情報源を引用できるため、システムの透明性が向上します。

## RAG システムにおける情報検索

RAG システムで関連情報を検索するには、ドキュメントをベクトル埋め込みとして保存し、ユーザーのクエリとの類似性に基づいてランク付けします。このアプローチは、PDF、画像、テキストファイル、さらには個々のテキストチャンクを含む様々なドキュメントタイプで機能します。

このプロセスには以下が含まれます。

1.  **ドキュメントの埋め込み**: ドキュメントを、そのセマンティックな意味を捉えるベクトル表現に変換します。
2.  **ベクトルストレージ**: これらの埋め込みを効率的に保存し、迅速な検索を可能にします。
3.  **類似性検索**: クエリ埋め込みに最も類似している埋め込みを持つドキュメントを検索します。
4.  **ランク付け**: ドキュメントをその関連性スコアで順序付けします。

## Koog での RAG システムの実装

Koog で RAG システムを実装するには、以下の手順に従います。

1.  Ollama または OpenAI を使用してエンベッダーを作成します。エンベッダーは `LLMEmbedder` クラスのインスタンスであり、LLM クライアントインスタンスとモデルをパラメータとして受け取ります。詳細については、[埋め込み](embeddings.md) を参照してください。
2.  作成した汎用エンベッダーに基づいてドキュメントエンベッダーを作成します。
3.  ドキュメントストレージを作成します。
4.  ドキュメントをストレージに追加します。
5.  定義されたクエリを使用して最も関連性の高いドキュメントを検索します。

この一連のステップは、特定のユーザーのクエリに対して最も関連性の高いドキュメントを返す*関連性検索*フローを表しています。以下に、上記の全手順を実装する方法を示すコードサンプルを示します。

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

### AI エージェントが使用する関連性検索の提供

ランク付けされたドキュメントストレージシステムがあれば、それを使用して AI エージェントにユーザーのクエリに応答するための関連コンテキストを提供できます。これにより、エージェントが正確で文脈に合った応答を提供する能力が向上します。

以下に、ドキュメントストレージから情報を取得してクエリに応答できるように、定義された RAG システムを AI エージェントに実装する方法の例を示します。

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
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o
    )

    // Run the agent to get a response
    val response = agent.run(query)

    // Return or process the response
    println("Agent response: $response")
}
```
<!--- KNIT example-ranked-document-storage-02.kt -->

### ツールとしての関連性検索の提供

ドキュメントコンテンツを直接コンテキストとして提供する代わりに、エージェントがオンデマンドで関連性検索を実行できるツールを実装することもできます。これにより、エージェントはドキュメントストレージをいつ、どのように使用するかを決定する柔軟性が増します。

以下に、関連性検索ツールを実装する方法の例を示します。

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
@LLMDescription("任意のトピックに関する関連ドキュメントを検索します（存在する場合）。最も関連性の高いドキュメントのコンテンツを返します。")
suspend fun searchDocuments(
    @LLMDescription("関連ドキュメントを検索するクエリ")
    query: String,
    @LLMDescription("ドキュメントの最大数")
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

このアプローチにより、エージェントはあなたのクエリに基づいて検索ツールを使用するかどうかを決定できます。これは、複数のドキュメントからの情報が必要な複雑なクエリや、エージェントが特定の詳細を検索する必要がある場合に特に役立ちます。

## ベクトルストレージとドキュメント埋め込みプロバイダーの既存の実装

RAG システムの利便性と実装の容易さのために、Koog はベクトルストレージ、ドキュメント埋め込み、および結合された埋め込みとストレージコンポーネント用のいくつかのすぐに使える実装を提供しています。

### ベクトルストレージ

#### InMemoryVectorStorage

ドキュメントとそのベクトル埋め込みをメモリに保存するシンプルなインメモリ実装です。テストや小規模アプリケーションに適しています。

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

詳細については、[InMemoryVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-vector-storage/index.html) リファレンスを参照してください。

#### FileVectorStorage

ドキュメントとそのベクトル埋め込みをディスクに保存するファイルベースの実装です。アプリケーションの再起動後も永続的なストレージに適しています。

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

詳細については、[FileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-vector-storage/index.html) リファレンスを参照してください。

#### JVMFileVectorStorage

`java.nio.file.Path` で動作する `FileVectorStorage` の JVM 固有の実装です。

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

詳細については、[JVMFileVectorStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-vector-storage/index.html) リファレンスを参照してください。

### ドキュメントエンベッダー

#### TextDocumentEmbedder

テキストに変換できるあらゆるドキュメントタイプで動作する汎用的な実装です。

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

詳細については、[TextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-text-document-embedder/index.html) リファレンスを参照してください。

#### JVMTextDocumentEmbedder

`java.nio.file.Path` で動作する JVM 固有の実装です。

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

詳細については、[JVMTextDocumentEmbedder](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-document-embedder/index.html) リファレンスを参照してください。

### 結合ストレージの実装

#### EmbeddingBasedDocumentStorage

ドキュメントエンベッダーとベクトルストレージを組み合わせ、ドキュメントの保存とランク付けのための完全なソリューションを提供します。

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

詳細については、[EmbeddingBasedDocumentStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-embedding-based-document-storage/index.html) リファレンスを参照してください。

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` のインメモリ実装です。

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

詳細については、[InMemoryDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-in-memory-document-embedding-storage/index.html) リファレンスを参照してください。

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` のファイルベースの実装です。

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

詳細については、[FileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-file-document-embedding-storage/index.html) リファレンスを参照してください。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` の JVM 固有の実装です。

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

詳細については、[JVMFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-file-document-embedding-storage/index.html) リファレンスを参照してください。

#### JVMTextFileDocumentEmbeddingStorage

`JVMTextDocumentEmbedder` と `JVMFileVectorStorage` を組み合わせた JVM 固有の実装です。

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

詳細については、[JVMTextFileDocumentEmbeddingStorage](https://api.koog.ai/rag/vector-storage/ai.koog.rag.vector/-j-v-m-text-file-document-embedding-storage/index.html) リファレンスを参照してください。

これらの実装は、様々な環境でドキュメント埋め込みとベクトルストレージを扱うための柔軟で拡張可能なフレームワークを提供します。

## 独自のベクトルストレージとドキュメントエンベッダーの実装

独自のカスタムドキュメントエンベッダーとベクトルストレージソリューションを実装することで、Koog のベクトルストレージフレームワークを拡張できます。これは、特殊なドキュメントタイプやストレージ要件を扱う場合に特に役立ちます。

以下に、PDF ドキュメント用のカスタムドキュメントエンベッダーを実装する例を示します。

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

## カスタムの非埋め込みベース RankedDocumentStorage の実装

埋め込みベースのドキュメントランク付けは強力ですが、埋め込みに依存しないカスタムランク付けメカニズムを実装したいシナリオもあります。たとえば、次に基づいてドキュメントをランク付けしたい場合があります。

-   PageRank に似たアルゴリズム
-   キーワード頻度
-   ドキュメントの新しさ
-   ユーザーインタラクション履歴
-   ドメイン固有のヒューリスティック

以下に、シンプルなキーワードベースのランク付けアプローチを使用するカスタム `RankedDocumentStorage` を実装する例を示します。

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

この実装は、クエリからのキーワードがドキュメントテキストに出現する頻度に基づいてドキュメントをランク付けします。このアプローチは、TF-IDF（Term Frequency-Inverse Document Frequency）や BM25 のようなより洗練されたアルゴリズムで拡張することができます。

もう1つの例は、最近のドキュメントを優先する時間ベースのランク付けシステムです。

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

`RankedDocumentStorage` インターフェースを実装することで、RAG インフラストラクチャの残りの部分を活用しながら、特定のユースケースに合わせたカスタムランク付けメカニズムを作成できます。

Koog の設計の柔軟性により、様々なストレージ戦略とランク付け戦略を組み合わせて、特定の要件を満たすシステムを構築できます。