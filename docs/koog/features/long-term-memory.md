# 长期记忆

功能（实验性）

`LongTermMemory` 功能通过两组独立的设置向 Koog AI 智能体添加持久化记忆：
- **检索 (Retrieval)** — 使用来自存储的相关上下文增强 LLM 提示词（检索增强生成或 RAG）
- **摄取 (Ingestion)** — 将对话消息持久化到存储中以便将来检索

## 快速入门

> **注意：** `LongTermMemory` 是一个实验性 API。请使用 `@OptIn(ExperimentalAgentsApi::class)` 注解您的代码，或在文件顶部添加 `@file:OptIn(ExperimentalAgentsApi::class)`。

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    val myStorage = InMemoryRecordStorage() // 或者您的向量数据库适配器

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

    agent.run("What did we discuss yesterday?")
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

    Object result = agent.run("What did we discuss yesterday?");
    ```

## 仅检索 (RAG)

当您拥有预填充的知识库时，可以使用检索而不开启摄取：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 可选：作用域限定为特定的命名空间/集合
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

### 提示词增强器 (Prompt Augmenters)

| 增强器 | 行为 |
|---|---|
| `SystemPromptAugmenter()` | 在提示词开头作为系统消息插入上下文（如果没有系统消息则为无操作） |
| `UserPromptAugmenter()` | 在最后一条用户消息之前，作为一条独立的用户消息插入上下文 |
| `PromptAugmenter { prompt, context -> ... }` | 通过 lambda表达式进行自定义增强 |

### 搜索策略 (Search Strategies)

| 策略 | 行为 |
|-----------------------------------------------------------|--------------------------|
| `KeywordSearchStrategy()` | 全文/词法关键字匹配 |
| `SimilaritySearchStrategy()` | 向量相似度语义搜索 |
| `query -> new KeywordSearchRequest(query, 20, 0.0, null)` | 通过 lambda表达式进行自定义搜索 |

## 仅摄取

使用摄取而不开启检索，可以随时间推移构建存储：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 可选：作用域限定为特定的命名空间/集合
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

### 摄取时机 (Ingestion Timing)

| 触发时机 | 行为 |
|---|---|
| `ON_LLM_CALL` | 在每次 LLM 调用/流式传输时摄取消息（支持会话内 RAG） |
| `ON_AGENT_COMPLETION` | 在智能体运行完成时一次性摄取所有消息 |

## 从策略节点访问长期记忆

在策略节点内使用 `withLongTermMemory { }` 直接搜索或添加记录：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // 手动添加记录
        val record = MemoryRecord(content = "important fact")
        this.getIngestionStorage()?.add(listOf(record), ingestionSettings?.namespace)

        // 手动搜索
        val request = SimilaritySearchRequest(query = input, limit = 5)
        val results = this.getRetrievalStorage()?.search(request, retrievalSettings?.namespace)
    }
}
```

使用 `longTermMemory()` 直接获取功能实例：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.getIngestionStorage()
}
```

## 自定义记忆记录提取器

实现 `MemoryRecordExtractor` 以控制消息在存储前的转换方式：

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

## 实现自定义存储

实现 `RetrievalStorage` 和/或 `IngestionStorage` 以连接到您的向量数据库：

```kotlin
class MyVectorDbStorage : RetrievalStorage, IngestionStorage {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult> {
        // 查询您的向量数据库
    }

    override suspend fun add(
        records: List<MemoryRecord>, namespace: String?
    ) {
        // 更新或插入到您的向量数据库
    }
}
```

为了进行测试，可以使用内置的 `InMemoryRecordStorage`，它将记录保存在内存中并支持基于关键字的搜索。