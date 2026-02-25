# ドキュメントストレージ

最新かつ検索可能な情報源を大規模言語モデル（LLM）で利用できるようにするために、Koog はドキュメントからの情報の保存と取得を行うリソース拡張生成（RAG: Resource-Augmented Generation）をサポートしています。

## RAG の主な機能

一般的な RAG システムのコアコンポーネントには以下のものが含まれます：

- **ドキュメントストレージ**: 情報を含むドキュメント、ファイル、またはテキストチャンクのリポジトリ。
- **ベクトルエンベディング**: セマンティックな（意味的な）意味を捉えたテキストの数値表現。Koog におけるエンベディングの詳細については、[エンベディング](embeddings.md) を参照してください。
- **検索（リトリーバル）メカニズム**: クエリに基づいて最も関連性の高いドキュメントを見つけるシステム。
- **生成コンポーネント**: 取得した情報を使用して回答を生成する LLM。

RAG は、従来の LLM のいくつかの制限に対処します：

- **知識のカットオフ**: RAG は、学習データに限定されず、最新の情報にアクセスできます。
- **ハルシネーション（幻覚）**: 取得したドキュメントに基づいて回答を生成することで、捏造された情報を減らします。
- **ドメイン特化**: ナレッジベースをキュレーションすることで、RAG を特定のドメインに合わせて調整できます。
- **透明性**: 情報のソースを引用できるため、システムの透明性が高まります。

## RAG システムでの情報検索

RAG システムで関連情報を検索するには、ドキュメントをベクトルエンベディングとして保存し、ユーザーのクエリとの類似性に基づいてランク付けします。このアプローチは、PDF、画像、テキストファイル、あるいは個々のテキストチャンクなど、さまざまなドキュメントタイプで機能します。

プロセスは以下の通りです：

1. **ドキュメントのエンベディング**: ドキュメントを、そのセマンティックな意味を捉えたベクトル表現に変換します。
2. **ベクトルストレージ**: 素早い検索のために、これらのエンベディングを効率的に保存します。
3. **類似性検索**: クエリのエンベディングに最も類似したエンベディングを持つドキュメントを見つけます。
4. **ランキング**: 関連性スコアに従ってドキュメントを順序付けます。

## Koog での RAG システムの実装

Koog で RAG システムを実装するには、以下の手順に従います：

1. Ollama または OpenAI を使用してエンベッダーを作成します。エンベッダーは `LLMEmbedder` クラスのインスタンスであり、LLM クライアントのインスタンスとモデルをパラメータとして受け取ります。詳細については、[エンベディング](embeddings.md) を参照してください。
2. 作成した汎用エンベッダーに基づいて、ドキュメントエンベッダーを作成します。
3. ドキュメントストレージを作成します。
4. ストレージにドキュメントを追加します。
5. 定義されたクエリを使用して、最も関連性の高いドキュメントを検索します。

この一連の手順は、特定のユーザークエリに対して最も関連性の高いドキュメントを返す *関連性検索* フローを表しています。上記の手順全体を実装する方法を示すコードサンプルを以下に示します。

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
// Ollama を使用してエンベッダーを作成する
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
// OpenAI のエンベディングを使用する場合は以下のようになります：
// val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

// JVM 特化のドキュメントエンベッダーを作成する
val documentEmbedder = JVMTextDocumentEmbedder(embedder)

// メモリ内ベクトルストレージを使用して、ランク付けされたドキュメントストレージを作成する
val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

// ストレージにドキュメントを保存する
rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
// ... 必要に応じてさらにドキュメントを保存
rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

// ユーザーのクエリに対して最も関連性の高いドキュメントを検索する
val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

// 関連ファイルを処理する
relevantFiles.forEach { file ->
    println("Relevant file: ${file.toAbsolutePath()}")
    // 必要に応じてファイルの内容を処理する
}
```
<!--- KNIT example-ranked-document-storage-01.kt -->

### AI エージェントによる関連性検索の利用

ランク付けされたドキュメントストレージシステムが構築できれば、それを使用して AI エージェントにユーザーのクエリに答えるための関連コンテキストを提供できます。これにより、エージェントが正確で文脈に適した回答を提供する能力が向上します。

以下は、ドキュメントストレージから情報を取得してクエリに回答できるように、定義された RAG システムを AI エージェントに実装する例です：

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

// Create an embedder using Ollama
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
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
    // ドキュメントプロバイダーから上位 5 つのドキュメントを取得する
    val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

    // 関連するコンテキストを持つ AI エージェントを作成する
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
        model = OpenAIModels.Chat.GPT4o, // またはお好みの別のモデル
        maxAgentIterations = 100,
    )

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o
    )

    // エージェントを実行して回答を取得する
    val response = agent.run(query)

    // 回答を返却または処理する
    println("Agent response: $response")
}
```
<!--- KNIT example-ranked-document-storage-02.kt -->

### 関連性検索をツールとして提供する

ドキュメントの内容を直接コンテキストとして提供する代わりに、エージェントが必要に応じて関連性検索を実行できるようにする「ツール」を実装することもできます。これにより、エージェントはドキュメントストレージをいつどのように使用するかをより柔軟に決定できるようになります。

以下は、関連性検索ツールを実装する例です：

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

// Create an embedder using Ollama
val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
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

このアプローチにより、エージェントはクエリに基づいて検索ツールを使用するかどうかを判断できます。これは、複数のドキュメントからの情報を必要とする複雑なクエリや、エージェントが特定の詳細を検索する必要がある場合に特に役立ちます。

## ベクトルストレージとドキュメントエンベディングプロバイダーの既存の実装

RAG システムの利便性を高め、実装を容易にするために、Koog はベクトルストレージ、ドキュメントエンベディング、およびエンベディングとストレージを組み合わせたコンポーネントのいくつかの即時利用可能な実装を提供しています。

### ベクトルストレージ

#### InMemoryVectorStorage

ドキュメントとそのベクトルエンベディングをメモリ内に保存するシンプルなメモリ内実装です。テストや小規模なアプリケーションに適しています。

<!--- INCLUDE
import ai.koog.rag.vector.InMemoryVectorStorage
import java.nio.file.Path
-->
```kotlin
val inMemoryStorage = InMemoryVectorStorage<Path>()
```
<!--- KNIT example-ranked-document-storage-04.kt -->

詳細については、[InMemoryVectorStorage](api:vector-storage::ai.koog.rag.vector.InMemoryVectorStorage) リファレンスを参照してください。

#### FileVectorStorage

ドキュメントとそのベクトルエンベディングをディスク上に保存するファイルベースの実装です。アプリケーションの再起動後もデータを保持する永続ストレージに適しています。

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

詳細については、[FileVectorStorage](api:vector-storage::ai.koog.rag.vector.FileVectorStorage) リファレンスを参照してください。

#### JVMFileVectorStorage

`java.nio.file.Path` を処理する `FileVectorStorage` の JVM 特化実装です。

<!--- INCLUDE
import ai.koog.rag.vector.JVMFileVectorStorage
import java.nio.file.Path
-->
```kotlin
val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
```
<!--- KNIT example-ranked-document-storage-06.kt -->

詳細については、[JVMFileVectorStorage](api:vector-storage::ai.koog.rag.vector.JVMFileVectorStorage) リファレンスを参照してください。

### ドキュメントエンベッダー

#### TextDocumentEmbedder

テキストに変換可能な任意のドキュメントタイプで動作する汎用実装です。

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

詳細については、[TextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.TextDocumentEmbedder) リファレンスを参照してください。

#### JVMTextDocumentEmbedder

`java.nio.file.Path` を処理する JVM 特化の実装です。

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

詳細については、[JVMTextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.JVMTextDocumentEmbedder) リファレンスを参照してください。

### 統合ストレージ実装

#### EmbeddingBasedDocumentStorage

ドキュメントエンベッダーとベクトルストレージを組み合わせて、ドキュメントの保存とランク付けのための完全なソリューションを提供します。

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

詳細については、[EmbeddingBasedDocumentStorage](api:vector-storage::ai.koog.rag.vector.EmbeddingBasedDocumentStorage) リファレンスを参照してください。

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` のメモリ内実装です。

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

詳細については、[InMemoryDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.InMemoryDocumentEmbeddingStorage) リファレンスを参照してください。

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

詳細については、[FileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.FileDocumentEmbeddingStorage) リファレンスを参照してください。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` の JVM 特化実装です。

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

詳細については、[JVMFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMFileDocumentEmbeddingStorage) リファレンスを参照してください。

#### JVMTextFileDocumentEmbeddingStorage

`JVMTextDocumentEmbedder` と `JVMFileVectorStorage` を組み合わせた JVM 特化実装です。

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

詳細については、[JVMTextFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMTextFileDocumentEmbeddingStorage) リファレンスを参照してください。

これらの実装は、さまざまな環境でドキュメントエンベディングやベクトルストレージを扱うための、柔軟で拡張可能なフレームワークを提供します。

## 独自のベクトルストレージとドキュメントエンベッダーの実装

独自のカスタムドキュメントエンベッダーやベクトルストレージソリューションを実装することで、Koog のベクトルストレージフレームワークを拡張できます。これは、特殊なドキュメントタイプやストレージ要件を扱う場合に特に便利です。

以下は、PDF ドキュメント用のカスタムドキュメントエンベッダーを実装する例です：

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
// PDFDocument クラスを定義する
class PDFDocument(private val path: Path) {
    fun readText(): String {
        // PDF ライブラリを使用して PDF からテキストを抽出する
        return "Text extracted from PDF at $path"
    }
}

// PDFDocument 用の DocumentProvider を実装する
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

// PDFDocument 用の DocumentEmbedder を実装する
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

// PDF ドキュメント用のカスタムベクトルストレージを作成する
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

// 使用例
suspend fun main() {
    val pdfProvider = PDFDocumentProvider()
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    val pdfEmbedder = PDFDocumentEmbedder(embedder)
    val storage = InMemoryVectorStorage<PDFDocument>()
    val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

    // PDF ドキュメントを保存する
    val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
    pdfStorage.store(pdfDocument)

    // 関連する PDF ドキュメントを検索する
    val relevantPDFs = pdfStorage.mostRelevantDocuments("information about climate change", count = 3)

}
```
<!--- KNIT example-ranked-document-storage-14.kt -->

## エンベディングに基づかないカスタム RankedDocumentStorage の実装

エンベディングベースのドキュメントランキングは強力ですが、エンベディングに依存しないカスタムランキングメカニズムを実装したい場合もあります。例えば、以下のような基準でドキュメントをランク付けしたい場合が考えられます：

- PageRank のようなアルゴリズム
- キーワードの出現頻度
- ドキュメントの新しさ
- ユーザーのインタラクション履歴
- ドメイン固有のヒューリスティック

以下は、単純なキーワードベースのランキングアプローチを使用したカスタム `RankedDocumentStorage` の実装例です：

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
        // クエリをキーワードに分割する
        val keywords = query.lowercase().split(Regex("\\W+")).filter { it.length > 2 }

        // 各ドキュメントを処理する
        storage.allDocuments().collect { document ->
            // ドキュメントのテキストを取得する
            val documentText = documentProvider.text(document).toString().lowercase()

            // キーワードの頻度に基づいて単純な類似性スコアを計算する
            var similarity = 0.0
            for (keyword in keywords) {
                val count = countOccurrences(documentText, keyword)
                if (count > 0) {
                    similarity += count.toDouble() / documentText.length * 1000
                }
            }

            // ドキュメントとその類似性スコアを発行する
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

この実装は、クエリ内のキーワードがドキュメントテキスト内に出現する頻度に基づいてドキュメントをランク付けします。TF-IDF（単語出現頻度ー逆文書頻度）や BM25 のような、より高度なアルゴリズムを使用してこのアプローチを拡張することも可能です。

もう一つの例は、新しいドキュメントを優先する時間ベースのランキングシステムです：

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

            // 経過時間に基づいて減衰因子を計算する（新しいドキュメントほど高いスコアになる）
            val decayFactor = Math.exp(-0.01 * ageInHours)

            emit(RankedDocument(document, decayFactor))
        }
    }

    // RankedDocumentStorage から必要な他のメソッドを実装する
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

`RankedDocumentStorage` インターフェースを実装することで、RAG インフラストラクチャの残りの部分を活用しつつ、特定のユースケースに合わせたカスタムランキングメカニズムを作成できます。

Koog の設計の柔軟性により、さまざまなストレージとランキング戦略を組み合わせて、特定の要件を満たすシステムを構築できます。