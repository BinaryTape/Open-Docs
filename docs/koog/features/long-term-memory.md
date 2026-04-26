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
                searchStrategy = SimilaritySearchStrategy(topK = 5)
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
                    .withSearchStrategy(
                        SearchStrategy.builder().similarity().withTopK(5).build()
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

### 查询提取器 (Query Extractors)

默认情况下，检索流程使用最后一条用户消息作为搜索查询。您可以通过提供 `QueryExtractor` 来自定义此行为：

| 提取器 | 行为 |
|---|---|
| `LastUserMessageQueryExtractor()` | 使用最后一条用户消息的内容（默认） |
| `QueryExtractor { prompt -> ... }` | 通过 lambda表达式进行自定义提取 |

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myStorage
            queryExtractor = QueryExtractor { prompt ->
                // 将最后两条用户消息合并为搜索查询
                prompt.messages
                    .filter { it.role == Message.Role.User }
                    .takeLast(2)
                    .joinToString(" ") { it.content }
                    .ifEmpty { null }
            }
        }
    }
    ```

=== "Java"

    ```java
    var retrievalSettings = new LongTermMemory.RetrievalSettingsBuilder()
        .withStorage(myStorage)
        .withQueryExtractor(prompt -> {
            var userMessages = prompt.getMessages().stream()
                .filter(m -> m.getRole() == Message.Role.User)
                .toList();
            if (userMessages.isEmpty()) return null;
            return userMessages.get(userMessages.size() - 1).getContent();
        })
        .build();
    ```

### 搜索策略 (Search Strategies)

| 策略 | 行为 |
|-----------------------------------------------------------|--------------------------|
| `SimilaritySearchStrategy()` | 向量相似度语义搜索 — **默认** |
| `query -> new SimilaritySearchRequest(query, 20, 0, 0.0, null)` | 通过 lambda表达式进行自定义搜索 |

## 仅摄取

使用摄取而不开启检索，可以随时间推移构建记忆存储：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 可选：作用域限定为特定的命名空间/集合
            extractionStrategy = FilteringExtractionStrategy(
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
        .withExtractionStrategy(
            ExtractionStrategy.builder()
                .filtering()
                .withExtractRoles(new HashSet<>(Arrays.asList(Message.Role.User, Message.Role.Assistant)))
                .withLastMessageOnly(false)
                .build()
        )
        .withTiming(IngestionTiming.ON_LLM_CALL)
        .build();
    ```

### 摄取时机 (Ingestion Timing)

| 时机 | 行为 |
|---|---|
| `ON_LLM_CALL` | 提示词消息在每次 LLM 调用开始前摄取；助手输出在完成或流式传输完成后摄取。支持会话内 RAG。 |
| `ON_AGENT_COMPLETION` | 最终累积的会话提示词/历史记录在智能体运行完成时一次性摄取。 |

## 禁用自动行为

默认情况下，检索和摄取是自动运行的（分别在 LLM 调用之前和之后）。您可以禁用自动行为，同时仍然可以从策略节点内部访问配置好的存储和策略：

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myStorage
            enableAutomaticRetrieval = false  // 不进行自动提示词增强
        }
        ingestion {
            storage = myStorage
            enableAutomaticIngestion = false  // 不进行自动消息持久化
        }
    }
    ```

=== "Java"

    ```java
    config.retrieval(
        new LongTermMemory.RetrievalSettingsBuilder()
            .withStorage(myStorage)
            .withEnableAutomaticRetrieval(false)
            .build()
    );
    config.ingestion(
        new LongTermMemory.IngestionSettingsBuilder()
            .withStorage(myStorage)
            .withEnableAutomaticIngestion(false)
            .build()
    );
    ```

这为您提供了三种清晰的模式：

1. **全自动**（默认）：安装功能，配置存储 — 检索和摄取将自动工作。
2. **仅手动**：设置 `enableAutomaticRetrieval = false` / `enableAutomaticIngestion = false`，并在图策略节点中使用存储和策略。
3. **混合**：将自动摄取与手动检索相结合（反之亦然）。

## 从策略节点访问长期记忆

在策略节点内使用 `withLongTermMemory { }` 直接搜索或添加记录：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // 手动添加记录
        val record = MemoryRecord(content = "important fact")
        ingestionStorage?.add(listOf(record), namespace = "my-namespace")

        // 手动搜索
        val request = SimilaritySearchRequest(queryText = input, limit = 5)
        val results = retrievalStorage?.search(request, namespace = "my-namespace")
    }
}
```

使用 `longTermMemory()` 直接获取功能实例：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.ingestionStorage
}
```

## 自定义提取策略

实现 `ExtractionStrategy` 以控制消息在存储前的转换方式：

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val summarizingExtractor = ExtractionStrategy { messages ->
    messages
        .filter { it.role == Message.Role.Assistant }
        .map { MemoryRecord(content = summarize(it.content)) }
}

install(LongTermMemory) {
    ingestion {
        storage = myStorage
        extractionStrategy = summarizingExtractor
    }
}
```

## 实现自定义存储

实现 `SearchStorage` 和/或 `WriteStorage` 以连接到您的向量数据库：

```kotlin
class MyVectorDbStorage : SearchStorage<TextDocument, SearchRequest>, WriteStorage<TextDocument> {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult<TextDocument>> {
        // 查询您的向量数据库
    }

    override suspend fun add(
        records: List<TextDocument>, namespace: String?
    ) {
        // 更新或插入到您的向量数据库
    }
}
```

为了进行测试，可以使用内置的 `InMemoryRecordStorage`，它将记录保存在内存中。它同时接受 `KeywordSearchRequest` 和 `SimilaritySearchRequest`，但两者都实现为简单的不区分大小写的子字符串匹配（无向量嵌入）。