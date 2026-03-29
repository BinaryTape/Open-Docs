# 検索拡張生成 (RAG)

Koogは、検索拡張生成（RAG）のためのビルディングブロックを提供します。これには、テキストの埋め込み、埋め込まれたドキュメントの保存、およびクエリに対して最も関連性の高い結果の取得が含まれます。

このページでは、現在の `rag` モジュールで利用可能な機能とその使用方法について説明します。

## Koogが現在提供しているもの

現在のRAGサポートは、2つのモジュールに分かれています。

- `rag-base`: 検索、ストレージ、検索リクエスト、フィルタリング、およびファイル/ドキュメントプロバイダーのための共通の抽象化
- `rag-vector`: ドキュメントの埋め込みとベクトルストレージを組み合わせたローカル実装

## EmbeddingStorageを使用したドキュメントの埋め込みと検索

最も完成された標準的なRAGフローは、`rag-vector` モジュールの `EmbeddingStorage` を使用します。これは、`DocumentEmbedder`（ドキュメントをベクトルに変換）と `VectorStorageBackend`（ベクトルを永続化）を組み合わせたものです。

手順は以下の通りです。

1. 埋め込みモデル（OllamaまたはOpenAI）を基盤とする `Embedder` を作成します。
2. ファイルの内容を読み取り、embedderに処理を委譲する `JVMTextDocumentEmbedder` を作成します。
3. メモリ内またはファイルベースのバックエンドを使用して `EmbeddingStorage` を作成します。
4. `add()` でドキュメントを追加します。
5. `search(SimilaritySearchRequest(...))` で検索します。

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
    // 1. ローカルのOllamaモデルを基盤とするembedderを作成する
    val embedder = LLMEmbedder(
        client = OllamaClient(),
        model = OllamaModels.Embeddings.NOMIC_EMBED_TEXT
    )

    // 2. ファイルを読み取ってテキストを埋め込むJVMドキュメントembedderを作成する
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 3. メモリ内バックエンドを使用してEmbeddingStorageを作成する
    val storage = EmbeddingStorage(
        embedder = documentEmbedder,
        storage = InMemoryVectorStorageBackend()
    )

    // 4. ストレージにドキュメントを追加する
    storage.add(
        listOf(
            Path.of("./docs/faq.txt"),
            Path.of("./docs/pricing.txt"),
            Path.of("./docs/getting-started.txt")
        )
    )

    // 5. 最も関連性の高いドキュメントを検索する
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

## エージェントツールとしての関連性検索の提供（エージェント型RAG）

取得したすべてのドキュメントを事前にプロンプトに注入する代わりに、RAGストレージをツールとして公開し、エージェントが必要に応じて呼び出すようにすることができます。これにより、エージェントは「いつ」「何を」検索するかを制御できるようになります。

以下の例では、`SearchStorage`（`EmbeddingStorage` が実装している基本検索インターフェース）を `@Tool` および `@LLMDescription` アノテーションが付いた関数でラップし、エージェントが使用できるように `ToolRegistry` に登録しています。

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

    // RAGストレージを作成する
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    val ragStorage: SearchStorage<Path, SimilaritySearchRequest> = EmbeddingStorage(documentEmbedder, InMemoryVectorStorageBackend())

    const val apiKey = "apikey"
    -->
    <!--- SUFFIX
    -->
    ```kotlin
    // RAGストレージを検索するツールを定義する
    @Tool
    @LLMDescription("クエリに関連するドキュメントをナレッジベースから検索します。最も関連性の高いドキュメントの内容を返します。")
    suspend fun searchKnowledgeBase(
        @LLMDescription("必要な情報を説明する検索クエリ")
        query: String,
        @LLMDescription("返されるドキュメントの最大数")
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
            // 検索ツールを登録し、エージェントを作成する
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

このアプローチにより、エージェントはユーザーのクエリに基づいて検索ツールを呼び出すタイミングを決定します。これは、エージェントが多様なリクエストを処理し、その一部のみがナレッジベースの検索を必要とする場合に便利です。

## 利用可能な実装

### ベクトルストレージバックエンド

- `InMemoryVectorStorageBackend`: ベクトルをメモリ内に保存します。テストやプロトタイプに適しています。
- `FileVectorStorageBackend`: 再起動後も維持されるよう、ベクトルをディスクに永続化します。
- `JVMFileVectorStorageBackend`: `java.nio.file.Path` を使用するJVM固有のファイルベースのバックエンドです。

### ドキュメント埋め込み器（Document embedders）

- `TextDocumentEmbedder`: ドキュメントとパスの型によってパラメータ化された、汎用的なドキュメント・ツー・テキスト埋め込み器です。
- `JVMTextDocumentEmbedder`: `java.nio.file.Path` からファイルを読み取るJVM固有の埋め込み器です。

### 統合ストレージ実装

- `EmbeddingStorage`: 任意の `DocumentEmbedder` と `VectorStorageBackend` を組み合わせます。
- `InMemoryDocumentEmbeddingStorage`: `EmbeddingStorage` + `InMemoryVectorStorageBackend` の便利なショートカットです。
- `FileDocumentEmbeddingStorage`: `EmbeddingStorage` + `FileVectorStorageBackend` の便利なショートカットです。
- `JVMFileDocumentEmbeddingStorage`: JVMファイルベースの埋め込みストレージです。
- `TextFileDocumentEmbeddingStorage`: テキストドキュメント用のファイルベースのストレージです。
- `JVMFileEmbeddingStorage`: テキストドキュメント用のJVMファイルベースのストレージです。

## 現在の制限事項

組み込みのフローはローカル実装やリファレンス実装には役立ちますが、まだ完全な本番環境用RAGプラットフォームではありません。

重要な制限事項：

- 組み込みの実装は類似性検索（similarity search）のみをサポートしています。
- `rag` モジュールには組み込みのチャンク分割（chunking）パイプラインがありません。
- メタデータが豊富な本番用レコードのモデリングはまだ制限されています。
- 本番環境用ベクトルデータベース（Pinecone, Weaviate, pgvector, Milvus）の統合は、現在の `rag` モジュールでは提供されていません。

カスタムバックエンドを構築する場合は、`rag-base` の抽象化から開始し、独自のストレージアダプターを実装してください。

## 開始地点の選択

以下の場合は `rag-vector` を使用してください：

- ローカルのRAGプロトタイプが必要な場合
- シンプルなリファレンス実装が必要な場合
- Koog内での埋め込みと検索のフローを試したい場合

以下の場合は `rag-base` を使用してください：

- 独自のストレージバックエンドを構築する場合
- 外部のベクトルデータベースを統合する場合
- 他のKoogモジュールで抽象化を再利用したい場合

## 関連項目

- [埋め込み（Embeddings）](embeddings.md)