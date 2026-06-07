---
status: beta
---

# 檢索增強生成 (RAG)

--8<-- "versioning-snippets.md:beta"

Koog 提供檢索增強生成 (RAG) 的建置區塊：嵌入文本、存儲已嵌入的文件，以及為查詢檢索最相關的結果。

本頁面重點介紹目前的 `rag` 模組中提供哪些功能以及如何使用。

## Koog 目前提供的功能

目前對 RAG 的支援分為兩個模組：

- `rag-base`：用於檢索、存儲、搜尋請求、篩選以及檔案/文件提供者的通用抽象
- `rag-vector`：結合文件嵌入與向量存儲的本機實作

## 使用 EmbeddingStorage 嵌入與檢索文件

最完整的開箱即用 RAG 流程使用 `rag-vector` 模組中的 `EmbeddingStorage`。它結合了 `DocumentEmbedder`（將文件轉換為向量）與 `VectorStorageBackend`（將向量持久化）。

步驟如下：

1. 建立一個由嵌入模型（Ollama 或 OpenAI）支援的 `Embedder`。
2. 建立一個 `JVMTextDocumentEmbedder`，用於讀取檔案內容並委派給嵌入器。
3. 建立一個具有記憶體內或以檔案為基礎的後端的 `EmbeddingStorage`。
4. 使用 `add()` 新增文件。
5. 使用 `search(SimilaritySearchRequest(...))` 進行搜尋。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.embeddings.local.LLMEmbedder
    import ai.koog.prompt.executor.ollama.client.OllamaClient
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import ai.koog.rag.base.storage.search.SimilaritySearchRequest
    import ai.koog.rag.vector.embedder.JVMTextDocumentEmbedder
    import ai.koog.rag.vector.backend.InMemoryVectorStorageBackend
    import ai.koog.rag.vector.storage.EmbeddingStorage
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
    // 1. 建立一個由本機 Ollama 模型支援的嵌入器
    val embedder = LLMEmbedder(
        client = OllamaClient(),
        model = OllamaModels.Embeddings.NOMIC_EMBED_TEXT
    )

    // 2. 建立一個 JVM 文件嵌入器，用於讀取檔案並嵌入其文本
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 3. 建立一個具有記憶體內後端的 EmbeddingStorage
    val storage = EmbeddingStorage(
        embedder = documentEmbedder,
        storage = InMemoryVectorStorageBackend()
    )

    // 4. 將文件新增至存儲空間
    storage.add(
        listOf(
            Path.of("./docs/faq.txt"),
            Path.of("./docs/pricing.txt"),
            Path.of("./docs/getting-started.txt")
        )
    )

    // 5. 搜尋最相關的文件
    val results = storage.search(
        SimilaritySearchRequest(
            queryText = "How do I reset my password?",
            limit = 3,
            minScore = 0.5
        )
    )

    results.forEach { result ->
        println("${result.document} (score: ${result.score.value})")
    }
    ```
    <!--- KNIT example-retrieval-augmented-generation-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-retrieval-augmented-generation-java-01.java -->

## 將相關性搜尋作為 Agent 工具提供（在代理式 RAG 中）

與其預先將所有檢索到的文件注入到提示詞中，您可以將 RAG 存儲空間公開為 Agent 根據需求呼叫的工具。這讓 Agent 能夠控制何時進行搜尋以及搜尋什麼。

下面的範例將 `SearchStorage`（`EmbeddingStorage` 實作的基本搜尋介面）封裝在標註有 `@Tool` 和 `@LLMDescription` 的函式中，然後將其註冊到 `ToolRegistry` 中供 Agent 使用。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.asTool
    import ai.koog.embeddings.local.LLMEmbedder
    import ai.koog.prompt.executor.ollama.client.OllamaClient
    import ai.koog.prompt.executor.ollama.client.OllamaModels
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.rag.base.storage.SearchStorage
    import ai.koog.rag.base.storage.search.SimilaritySearchRequest
    import ai.koog.rag.vector.embedder.JVMTextDocumentEmbedder
    import ai.koog.rag.vector.backend.InMemoryVectorStorageBackend
    import ai.koog.rag.vector.storage.EmbeddingStorage
    import kotlinx.coroutines.runBlocking
    import java.nio.file.Files
    import java.nio.file.Path

    // 建立 RAG 存儲空間
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    val ragStorage: SearchStorage<Path, SimilaritySearchRequest> = EmbeddingStorage(documentEmbedder, InMemoryVectorStorageBackend())

    const val apiKey = "apikey"
    -->
    <!--- SUFFIX
    -->
    ```kotlin
    // 定義一個搜尋 RAG 存儲空間的工具
    @Tool
    @LLMDescription("Search the knowledge base for documents relevant to a query. Returns the content of the most relevant documents.")
    suspend fun searchKnowledgeBase(
        @LLMDescription("The search query describing what information you need")
        query: String,
        @LLMDescription("Maximum number of documents to return")
        count: Int
    ): String {
        val results = ragStorage.search(
            SimilaritySearchRequest(
                queryText = query,
                limit = count,
                minScore = 0.5
            )
        )

        if (results.isEmpty()) {
            return "No relevant documents found for: $query"
        }

        val response = StringBuilder("Found ${results.size} relevant documents:
\n")
        results.forEachIndexed { index, result ->
            val content = Files.readString(result.document)
            response.append("Document ${index + 1}: ${result.document.fileName}")
            response.append(" (score: ${"%.2f".format(result.score.value)})
")
            response.append("Content: $content
\n")
        }
        return response.toString()
    }

    fun main() {
        runBlocking {
            // 註冊搜尋工具並建立 Agent
            val tools = ToolRegistry {
                tool(::searchKnowledgeBase.asTool())
            }

            val agent = AIAgent(
                toolRegistry = tools,
                promptExecutor = simpleOpenAIExecutor(apiKey),
                llmModel = OpenAIModels.Chat.GPT4o
            )

            val response = agent.run("What is your refund policy?")
            println("Agent response: $response")
        }
    }
    ```
    <!--- KNIT example-retrieval-augmented-generation-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-retrieval-augmented-generation-java-02.java -->

透過這種方法，Agent 會根據使用者的查詢決定何時呼叫搜尋工具。當 Agent 處理多樣化的請求，且只有其中一部分需要查詢知識庫時，這非常有用。

## 可用的實作

### 向量存儲後端

- `InMemoryVectorStorageBackend`：將向量存儲在記憶體中；適用於測試和原型
- `FileVectorStorageBackend`：將向量持久化到磁碟，以便在重新啟動後保持持久性
- `JVMFileVectorStorageBackend`：使用 `java.nio.file.Path` 的 JVM 特定檔案後端

### 文件嵌入器

- `TextDocumentEmbedder`：通用的文件對文本嵌入器，透過文件與路徑型別進行參數化
- `JVMTextDocumentEmbedder`：從 `java.nio.file.Path` 讀取檔案的 JVM 特定嵌入器

### 組合存儲實作

- `EmbeddingStorage`：組合任何 `DocumentEmbedder` 與任何 `VectorStorageBackend`
- `InMemoryDocumentEmbeddingStorage`：`EmbeddingStorage` + `InMemoryVectorStorageBackend` 的便利捷徑
- `FileDocumentEmbeddingStorage`：`EmbeddingStorage` + `FileVectorStorageBackend` 的便利捷徑
- `JVMFileDocumentEmbeddingStorage`：JVM 檔案型嵌入存儲
- `TextFileDocumentEmbeddingStorage`：文本文件的檔案型存儲
- `JVMFileEmbeddingStorage`：JVM 文本文件的檔案型存儲

## 目前的限制

內建流程對於本機和參考實作非常有用，但目前還不是一個完整的生產環境 RAG 平台。

重要限制：

- 內建實作僅支援相似度搜尋
- `rag` 模組中沒有內建的分塊 (chunking) 管線
- 富含元資料的生產環境記錄建模仍然受限
- 目前的 `rag` 模組未提供生產環境向量資料庫整合（Pinecone、Weaviate、pgvector、Milvus）

如果您正在構建自定義後端，請從 `rag-base` 抽象開始並實作您自己的存儲配接器。

## 選擇從何處開始

在以下情況使用 `rag-vector`：

- 您想要一個本機 RAG 原型
- 您想要一個簡單的參考實作
- 您想要在 Koog 內部實驗嵌入與檢索流程

在以下情況使用 `rag-base`：

- 您正在構建自己的存儲後端
- 您想要整合外部向量資料庫
- 您想要在另一個 Koog 模組中重用這些抽象

## 另請參閱

- [嵌入](embeddings.md)