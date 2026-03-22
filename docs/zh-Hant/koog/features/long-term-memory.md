# 長期記憶

功能（實驗性）

`LongTermMemory` 功能透過兩組獨立的設定為 Koog AI 代理增加持久性記憶：
- **Retrieval**（檢索） — 使用來自記憶存儲（檢索增強生成，即 RAG）的相關上下文來增強 LLM 提示詞。
- **Ingestion**（攝取） — 將對話訊息持久化到記憶存儲中，以供未來檢索。

## 快速入門

> **注意：** `LongTermMemory` 是實驗性 API。請在您的程式碼標註 `@OptIn(ExperimentalAgentsApi::class)`，或在檔案頂部加入 `@file:OptIn(ExperimentalAgentsApi::class)`。

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    val myStorage = InMemoryRecordStorage() // 或您的向量資料庫適配器

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

    agent.run("我們昨天討論了什麼？")
    ```

=== "Java"

    ```java
    InMemoryRecordStorage myStorage = new InMemoryRecordStorage();

    AIAgent agent = AIAgent.builder()
        .promptExecutor(executor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("您是一位樂於助人的助手。")
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

    Object result = agent.run("我們昨天討論了什麼？");
    ```

## 僅檢索 (RAG)

當您已有預先填充的知識庫時，請使用不含攝取的檢索：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 選填：限定於特定的命名空間/集合
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

### 提示詞增強器 (Prompt Augmenters)

| 增強器 | 行為 |
|---|---|
| `SystemPromptAugmenter()` | 在提示詞開頭插入上下文作為系統訊息（若無系統訊息則不執行任何操作） |
| `UserPromptAugmenter()` | 在最後一則使用者訊息前插入上下文作為獨立的使用者訊息 |
| `PromptAugmenter { prompt, context -> ... }` | 透過 Lambda 進行自訂增強 |

### 搜尋策略 (Search Strategies)

| 策略 | 行為 |
|-----------------------------------------------------------|--------------------------|
| `KeywordSearchStrategy()` | 全文/詞法關鍵字比對 |
| `SimilaritySearchStrategy()` | 向量相似度語義搜尋 |
| `query -> new KeywordSearchRequest(query, 20, 0.0, null)` | 透過 Lambda 進行自訂搜尋 |

## 僅攝取

使用不含檢索的攝取來隨著時間建立記憶存儲：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 選填：限定於特定的命名空間/集合
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

### 攝取時機 (Ingestion Timing)

| 時機 | 行為 |
|---|---|
| `ON_LLM_CALL` | 在每次 LLM 呼叫/串流時攝取訊息（啟用工作階段內 RAG） |
| `ON_AGENT_COMPLETION` | 在代理執行完成時一次攝取所有訊息 |

## 從策略節點存取長期記憶

在策略節點內使用 `withLongTermMemory { }` 來直接搜尋或新增記錄：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // 手動新增記錄
        val record = MemoryRecord(content = "重要事實")
        this.getIngestionStorage()?.add(listOf(record), ingestionSettings?.namespace)

        // 手動搜尋
        val request = SimilaritySearchRequest(query = input, limit = 5)
        val results = this.getRetrievalStorage()?.search(request, retrievalSettings?.namespace)
    }
}
```

使用 `longTermMemory()` 直接獲取功能執行個體：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.getIngestionStorage()
}
```

## 自訂記憶記錄擷取器

實作 `MemoryRecordExtractor` 以控制訊息在存儲前的轉換方式：

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

## 實作自訂存儲

實作 `RetrievalStorage` 和/或 `IngestionStorage` 以連接到您的向量資料庫：

```kotlin
class MyVectorDbStorage : RetrievalStorage, IngestionStorage {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult> {
        // 查詢您的向量資料庫
    }

    override suspend fun add(
        records: List<MemoryRecord>, namespace: String?
    ) {
        // 更新或插入（Upsert）至您的向量資料庫
    }
}
```

進行測試時，請使用內建的 `InMemoryRecordStorage`，它將記錄保留在記憶體中並支援基於關鍵字的搜尋。