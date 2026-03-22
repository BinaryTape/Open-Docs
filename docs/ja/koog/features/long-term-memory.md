# 長期メモリ (Long-term memory)

機能 (実験的)

`LongTermMemory`機能は、2つの独立した設定グループを介してKoog AIエージェントに永続的なメモリを追加します。
- **Retrieval (検索)** — メモリストレージからの関連するコンテキストを使用してLLMプロンプトを拡張します（検索拡張生成、Retrieval-Augmented Generation または RAG）。
- **Ingestion (取り込み)** — 将来の検索のために、会話メッセージをメモリストレージに永続化します。

## クイックスタート

> **注意:** `LongTermMemory`は実験的なAPIです。コードに`@OptIn(ExperimentalAgentsApi::class)`を付与するか、ファイルの先頭に`@file:OptIn(ExperimentalAgentsApi::class)`を追加してください。

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    val myStorage = InMemoryRecordStorage() // または独自のベクトルDBアダプター

    @OptIn(ExperimentalAgentsApi::class)
    val agent = AIAgent(
        promptExecutor = executor,
        strategy = singleRunStrategy(),
        agentConfig = agentConfig,
        toolRegistry = ToolRegistry.EMPTY
    ) {
        install(LongTermMemory) {
            retrieval {
                storage = myStorage
                searchStrategy = KeywordSearchStrategy(topK = 5)
            }
        }
    }

    agent.run("昨日は何を話しましたか？")
    ```

=== "Java"

    ```java
    InMemoryRecordStorage myStorage = new InMemoryRecordStorage();

    AIAgent agent = AIAgent.builder()
        .promptExecutor(executor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .install(LongTermMemory.Feature, config -> {
            config.retrieval(
                new LongTermMemory.RetrievalSettingsBuilder()
                    .withStorage(myStorage)
                    .withSearchStrategy(query ->
                        new KeywordSearchRequest(query, 15, 0.5, null)
                    )
                    .build()
            );
        })
        .build();

    Object result = agent.run("昨日は何を話しましたか？");
    ```

## Retrievalのみ (RAG)

すでにデータが投入済みの知識ベースがある場合は、取り込み（Ingestion）なしで検索（Retrieval）のみを使用します。

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myVectorDbStorage
            namespace = "my-collection"  // オプション：特定のネームスペース/コレクションにスコープを限定
            searchStrategy = SimilaritySearchStrategy(topK = 3, similarityThreshold = 0.7)
            promptAugmenter = SystemPromptAugmenter()
        }
    }
    ```

=== "Java"

    ```java
    var retrievalSettings = new LongTermMemory.RetrievalSettingsBuilder()
        .withStorage(myVectorDbStorage)
        .withSearchStrategy(
            SearchStrategy.builder().similarity().withTopK(3).withSimilarityThreshold(0.7).build()
        )
        .withPromptAugmenter(PromptAugmenter.builder().system().build())
        .build();
    ```

### Prompt Augmenters (プロンプト拡張機能)

| Augmenter | 動作 |
|---|---|
| `SystemPromptAugmenter()` | プロンプトの開始位置にシステムメッセージとしてコンテキストを挿入します（システムメッセージがない場合は何もしません）。 |
| `UserPromptAugmenter()` | 最後のユーザーメッセージの前に、別のユーザーメッセージとしてコンテキストを挿入します。 |
| `PromptAugmenter { prompt, context -> ... }` | ラムダによるカスタム拡張。 |

### Search Strategies (検索戦略)

| Strategy | 動作 |
|-----------------------------------------------------------|--------------------------|
| `KeywordSearchStrategy()` | 全文検索/レキシカルキーワードマッチング |
| `SimilaritySearchStrategy()` | ベクトル類似性によるセマンティック検索 |
| `query -> new KeywordSearchRequest(query, 20, 0.0, null)` | ラムダによるカスタム検索 |

## Ingestionのみ

RetrievalなしでIngestionのみを使用して、時間の経過とともにメモリストレージを構築します。

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // オプション：特定のネームスペース/コレクションにスコープを限定
            extractor = FilteringMemoryRecordExtractor(
                messageRolesToExtract = setOf(Message.Role.User, Message.Role.Assistant)
            )
            timing = IngestionTiming.ON_LLM_CALL
        }
    }
    ```

=== "Java"

    ```java
    var ingestionSettings = new LongTermMemory.IngestionSettingsBuilder()
        .withStorage(myVectorDbStorage)
        .withExtractor(
            MemoryRecordExtractor.builder()
                .filtering()
                .withExtractRoles(new HashSet<>(Arrays.asList(Message.Role.User, Message.Role.Assistant)))
                .withLastMessageOnly(false)
                .build()
        )
        .withTiming(IngestionTiming.ON_LLM_CALL)
        .build();
    ```

### Ingestion Timing (取り込みのタイミング)

| Timing | 動作 |
|---|---|
| `ON_LLM_CALL` | 各LLM呼び出し/ストリームごとにメッセージを取り込みます（セッション内RAGが可能になります）。 |
| `ON_AGENT_COMPLETION` | エージェントの実行完了時に、すべてのメッセージを一度に取り込みます。 |

## ストラテジーノードからの長期メモリへのアクセス

ストラテジーノード内で `withLongTermMemory { }` を使用して、レコードの検索や追加を直接行います。

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // レコードを手動で追加
        val record = MemoryRecord(content = "重要な事実")
        this.getIngestionStorage()?.add(listOf(record), ingestionSettings?.namespace)

        // 手動で検索
        val request = SimilaritySearchRequest(query = input, limit = 5)
        val results = this.getRetrievalStorage()?.search(request, retrievalSettings?.namespace)
    }
}
```

`longTermMemory()` を使用して、機能のインスタンスを直接取得します。

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.getIngestionStorage()
}
```

## カスタムメモリレコードエクストラクター (Custom Memory Record Extractor)

保存前にメッセージがどのように変換されるかを制御するには、`MemoryRecordExtractor`を実装します。

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val summarizingExtractor = MemoryRecordExtractor { messages ->
    messages
        .filter { it.role == Message.Role.Assistant }
        .map { MemoryRecord(content = summarize(it.content)) }
}

install(LongTermMemory) {
    ingestion {
        storage = myStorage
        extractor = summarizingExtractor
    }
}
```

## カスタムストレージの実装

独自のベクトルデータベースに接続するには、`RetrievalStorage` または `IngestionStorage`（あるいはその両方）を実装します。

```kotlin
class MyVectorDbStorage : RetrievalStorage, IngestionStorage {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult> {
        // ベクトルDBにクエリを実行
    }

    override suspend fun add(
        records: List<MemoryRecord>, namespace: String?
    ) {
        // ベクトルDBにアップサートを実行
    }
}
```

テスト用には、キーワードベースの検索機能を備え、レコードをメモリ内に保持する組み込みの `InMemoryRecordStorage` を使用してください。