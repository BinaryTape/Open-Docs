# 文件存儲

為了讓您能提供最新且可搜尋的資訊來源，以便與大型語言模型 (LLM) 配合使用，Koog 支援資源增強生成 (Resource-Augmented Generation, RAG)，用於從文件中存儲與檢索資訊。

## RAG 核心功能

常見 RAG 系統的核心組件包括：

- **文件存儲 (Document storage)**：包含資訊的文件、檔案或文字區塊 (text chunks) 的存儲庫。
- **向量嵌入 (Vector embedding)**：捕捉語意特徵的文字數值表示法。有關 Koog 中嵌入的更多資訊，請參閱 [Embeddings](embeddings.md)。
- **檢索機制 (Retrieval mechanism)**：根據查詢尋找最相關文件的系統。
- **生成組件 (Generation component)**：使用檢索到的資訊來生成回應的 LLM。

RAG 解決了傳統 LLM 的幾個限制：

- **知識截止 (Knowledge cutoff)**：RAG 可以存取最新資訊，而不僅限於訓練資料。
- **幻覺 (Hallucinations)**：透過將回應建立在檢索到的文件中，RAG 減少了捏造的資訊。
- **領域特定性 (Domain specificity)**：RAG 可以透過策劃知識庫來針對特定領域進行調整。
- **透明度 (Transparency)**：可以引用資訊來源，使系統更具可解釋性。

## 在 RAG 系統中尋找資訊

在 RAG 系統中尋找相關資訊涉及將文件存儲為向量嵌入，並根據它們與使用者查詢的相似度進行排序 (Ranking)。此方法適用於各種文件類型，包括 PDF、圖片、文字檔，甚至個別的文字區塊。

該過程包括：

1. **文件嵌入 (Document embedding)**：將文件轉換為捕捉其語意特徵的向量表示。
2. **向量存儲 (Vector storage)**：有效率地存儲這些嵌入以便快速檢索。
3. **相似度搜尋 (Similarity search)**：尋找其嵌入與查詢嵌入最相似的文件。
4. **排序 (Ranking)**：依文件的相關性評分進行排序。

## 在 Koog 中實作 RAG 系統

要在 Koog 中實作 RAG 系統，請遵循以下步驟：

1. 使用 Ollama 或 OpenAI 建立一個嵌入器 (embedder)。此嵌入器是 `LLMEmbedder` 類別的執行個體，它接收一個 LLM 客戶端執行個體和模型作為參數。如需更多資訊，請參閱 [Embeddings](embeddings.md)。
2. 根據建立的一般嵌入器建立文件嵌入器。
3. 建立文件存儲。
4. 將文件新增至存儲中。
5. 使用定義的查詢尋找最相關的文件。

這組步驟代表了一個*相關性搜尋*流程，該流程會回傳給定使用者查詢最相關的文件。以下是示範如何實作上述完整步驟序列的程式碼範例：

=== "Kotlin"

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
    // 使用 Ollama 建立嵌入器
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 您也可以透過以下方式使用 OpenAI 嵌入：
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

    // 建立一個 JVM 特定的文件嵌入器
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 使用記憶體內向量存儲建立一個排序的文件存儲
    val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

    // 將文件存放在存儲中
    rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
    rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
    rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
    // ... 根據需要存儲更多文件
    rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

    // 為使用者查詢尋找最相關的文件
    val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
    val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

    // 處理相關檔案
    relevantFiles.forEach { file ->
        println("Relevant file: ${file.toAbsolutePath()}")
        // 根據需要處理檔案內容
    }
    ```
    <!--- KNIT example-ranked-document-storage-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-01.java -->

### 提供相關性搜尋供 AI 代理使用

一旦您擁有了排序文件存儲系統，您就可以使用它為 AI 代理 (AI agent) 提供相關上下文，以回答使用者查詢。這增強了代理提供準確且符合上下文回應的能力。

以下是一個範例，說明如何為 AI 代理實作定義的 RAG 系統，使其能夠透過從文件存儲獲取資訊來回答查詢：

=== "Kotlin"

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
    // 使用 Ollama 建立嵌入器
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 您也可以透過以下方式使用 OpenAI 嵌入：
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)
    // 建立一個 JVM 特定的文件嵌入器
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    // 使用記憶體內向量存儲建立一個排序的文件存儲
    val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())
    const val apiKey = "apikey"
    -->
    ```kotlin
    suspend fun solveUserRequest(query: String) {
        // 從文件提供者檢索前 5 個文件
        val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

        // 使用相關上下文建立 AI 代理
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
            model = OpenAIModels.Chat.GPT4o, // 或您選擇的其他模型
            maxAgentIterations = 100,
        )

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )

        // 執行代理以獲取回應
        val response = agent.run(query)

        // 回傳或處理回應
        println("Agent response: $response")
    }
    ```
    <!--- KNIT example-ranked-document-storage-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-02.java -->

### 將相關性搜尋作為工具提供

除了直接提供文件內容作為上下文外，您還可以實作一個工具，讓代理根據需求執行相關性搜尋。這使得代理在決定何時以及如何使用文件存儲方面具有更大的靈活性。

以下是實作相關性搜尋工具的範例：

=== "Kotlin"

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
    // 使用 Ollama 建立嵌入器
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 您也可以透過以下方式使用 OpenAI 嵌入：
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)
    // 建立一個 JVM 特定的文件嵌入器
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    // 使用記憶體內向量存儲建立一個排序的文件存儲
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-03.java -->

透過這種方法，代理可以根據您的查詢決定何時使用搜尋工具。這對於可能需要多個文件中的資訊或代理需要搜尋特定細節的複雜查詢特別有用。

## 現有的向量存儲與文件嵌入提供者實作

為了方便且更輕鬆地實作 RAG 系統，Koog 提供了多個開箱即用的向量存儲、文件嵌入以及組合嵌入與存儲組件的實作。

### 向量存儲

#### InMemoryVectorStorage

一個簡單的記憶體內實作，將文件及其向量嵌入存儲在記憶體中。適用於測試或小規模應用程式。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.rag.vector.InMemoryVectorStorage
    import java.nio.file.Path
    -->
    ```kotlin
    val inMemoryStorage = InMemoryVectorStorage<Path>()
    ```
    <!--- KNIT example-ranked-document-storage-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    InMemoryVectorStorage<Path> inMemoryStorage = new InMemoryVectorStorage<>();
    ```
    <!--- KNIT example-ranked-document-storage-java-04.java -->

如需更多資訊，請參閱 [InMemoryVectorStorage](api:vector-storage::ai.koog.rag.vector.InMemoryVectorStorage) 參考文件。

#### FileVectorStorage

一個基於檔案的實作，將文件及其向量嵌入存儲在磁碟上。適用於應用程式重新啟動後的持久化存儲。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-05.java -->

如需更多資訊，請參閱 [FileVectorStorage](api:vector-storage::ai.koog.rag.vector.FileVectorStorage) 參考文件。

#### JVMFileVectorStorage

`FileVectorStorage` 的 JVM 特定實作，可搭配 `java.nio.file.Path` 使用。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.rag.vector.JVMFileVectorStorage
    import java.nio.file.Path
    -->
    ```kotlin
    val jvmFileStorage = JVMFileVectorStorage(root = Path.of("/path/to/storage"))
    ```
    <!--- KNIT example-ranked-document-storage-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-06.java -->

如需更多資訊，請參閱 [JVMFileVectorStorage](api:vector-storage::ai.koog.rag.vector.JVMFileVectorStorage) 參考文件。

### 文件嵌入器

#### TextDocumentEmbedder

一個通用的實作，適用於任何可以轉換為文字的文件類型。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-07.java -->

如需更多資訊，請參閱 [TextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.TextDocumentEmbedder) 參考文件。

#### JVMTextDocumentEmbedder

一個 JVM 特定的實作，可搭配 `java.nio.file.Path` 使用。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMEmbedder embedder = new LLMEmbedder(new OllamaClient("http://localhost:11434"), OllamaModels.Embeddings.NOMIC_EMBED_TEXT);
    JVMTextDocumentEmbedder jvmTextEmbedder = new JVMTextDocumentEmbedder(embedder);
    ```
    <!--- KNIT example-ranked-document-storage-java-08.java -->

如需更多資訊，請參閱 [JVMTextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.JVMTextDocumentEmbedder) 參考文件。

### 組合存儲實作

#### EmbeddingBasedDocumentStorage

結合文件嵌入器和向量存儲，為文件的存儲與排序提供完整的解決方案。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMEmbedder embedder = new LLMEmbedder(new OllamaClient("http://localhost:11434"), OllamaModels.Embeddings.NOMIC_EMBED_TEXT);
    JVMTextDocumentEmbedder documentEmbedder = new JVMTextDocumentEmbedder(embedder);
    InMemoryVectorStorage<Path> vectorStorage = new InMemoryVectorStorage<>();
    
    EmbeddingBasedDocumentStorage<Path> embeddingStorage = new EmbeddingBasedDocumentStorage<>(
        documentEmbedder,
        vectorStorage
    );
    ```
    <!--- KNIT example-ranked-document-storage-java-09.java -->

如需更多資訊，請參閱 [EmbeddingBasedDocumentStorage](api:vector-storage::ai.koog.rag.vector.EmbeddingBasedDocumentStorage) 參考文件。

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的記憶體內實作。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMEmbedder embedder = new LLMEmbedder(new OllamaClient("http://localhost:11434"), OllamaModels.Embeddings.NOMIC_EMBED_TEXT);
    JVMTextDocumentEmbedder documentEmbedder = new JVMTextDocumentEmbedder(embedder);

    InMemoryDocumentEmbeddingStorage<Path> inMemoryEmbeddingStorage =
        new InMemoryDocumentEmbeddingStorage<>(documentEmbedder);
    ```
    <!--- KNIT example-ranked-document-storage-java-10.java -->

如需更多資訊，請參閱 [InMemoryDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.InMemoryDocumentEmbeddingStorage) 參考文件。

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage` 的基於檔案的實作。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-11.java -->

如需更多資訊，請參閱 [FileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.FileDocumentEmbeddingStorage) 參考文件。

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage` 的 JVM 特定實作。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMEmbedder embedder = new LLMEmbedder(new OllamaClient("http://localhost:11434"), OllamaModels.Embeddings.NOMIC_EMBED_TEXT);
    JVMTextDocumentEmbedder documentEmbedder = new JVMTextDocumentEmbedder(embedder);

    JVMFileDocumentEmbeddingStorage jvmFileEmbeddingStorage = new JVMFileDocumentEmbeddingStorage(
       documentEmbedder,
       Path.of("/path/to/storage")
    );
    ```
    <!--- KNIT example-ranked-document-storage-java-12.java -->

如需更多資訊，請參閱 [JVMFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMFileDocumentEmbeddingStorage) 參考文件。

#### JVMTextFileDocumentEmbeddingStorage

一個 JVM 特定的實作，結合了 `JVMTextDocumentEmbedder` 與 `JVMFileVectorStorage`。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMEmbedder embedder = new LLMEmbedder(new OllamaClient("http://localhost:11434"), OllamaModels.Embeddings.NOMIC_EMBED_TEXT);

    JVMTextFileDocumentEmbeddingStorage jvmTextFileEmbeddingStorage = new JVMTextFileDocumentEmbeddingStorage(
       embedder,
       Path.of("/path/to/storage")
    );
    ```
    <!--- KNIT example-ranked-document-storage-java-13.java -->

如需更多資訊，請參閱 [JVMTextFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMTextFileDocumentEmbeddingStorage) 參考文件。

這些實作提供了一個靈活且可擴充的框架，用於在各種環境中處理文件嵌入和向量存儲。

## 實作您自己的向量存儲與文件嵌入器

您可以透過實作自訂的文件嵌入器與向量存儲解決方案來擴充 Koog 的向量存儲框架。這在處理特殊文件類型或有特殊存儲需求時特別有用。

以下是實作 PDF 文件自訂文件嵌入器的範例：

=== "Kotlin"

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
    // 定義一個 PDFDocument 類別
    class PDFDocument(private val path: Path) {
        fun readText(): String {
            // 使用 PDF 程式庫從 PDF 中擷取文字
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

    // 為 PDF 文件建立自訂向量存儲
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
        val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
        val pdfEmbedder = PDFDocumentEmbedder(embedder)
        val storage = InMemoryVectorStorage<PDFDocument>()
        val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

        // 存儲 PDF 文件
        val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
        pdfStorage.store(pdfDocument)

        // 查詢相關 PDF 文件
        val relevantPDFs = pdfStorage.mostRelevantDocuments("information about climate change", count = 3)

    }
    ```
    <!--- KNIT example-ranked-document-storage-14.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-14.java -->

## 實作自訂非嵌入式 RankedDocumentStorage

雖然基於嵌入的文件排序非常強大，但在某些情況下，您可能希望實作一個不依賴嵌入的自訂排序機制。例如，您可能想要根據以下各項對文件進行排序：

- 類 PageRank 演算法
- 關鍵字頻率
- 文件的近期性 (Recency)
- 使用者互動歷史
- 領域特定的啟發式方法 (heuristics)

以下是實作一個使用簡單關鍵字排序方法的自訂 `RankedDocumentStorage` 範例：

=== "Kotlin"

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

                // 根據關鍵字頻率計算簡單的相似度評分
                var similarity = 0.0
                for (keyword in keywords) {
                    val count = countOccurrences(documentText, keyword)
                    if (count > 0) {
                        similarity += count.toDouble() / documentText.length * 1000
                    }
                }

                // 發出帶有相似度評分的文件
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-15.java -->

此實作根據查詢關鍵字出現在文件文字中的頻率來對文件進行排序。您可以使用更複雜的演算法（如 TF-IDF 或 BM25）來擴充此方法。

另一個範例是優先考慮近期文件的時間排序系統：

=== "Kotlin"

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

                // 根據存在時間計算衰減因子 (較新的文件獲得較高分)
                val decayFactor = Math.exp(-0.01 * ageInHours)

                emit(RankedDocument(document, decayFactor))
            }
        }

        // 實作來自 RankedDocumentStorage 的其他必要方法
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-ranked-document-storage-java-16.java -->

透過實作 `RankedDocumentStorage` 介面，您可以建立針對特定使用案例量身定制的自訂排序機制，同時仍然利用 RAG 基礎設施的其餘部分。

Koog 設計的靈活性允許您混合匹配不同的存儲與排序策略，以建立符合您特定需求的系統。