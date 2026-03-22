# 장기 메모리 (Long-term memory)

기능 (실험적)

`LongTermMemory` 기능은 두 가지 독립적인 설정 그룹을 통해 Koog AI 에이전트에 영구 메모리를 추가합니다:
- **Retrieval (검색)** — 메모리 저장소에서 관련 컨텍스트를 가져와 LLM 프롬프트를 보강합니다 (검색 증강 생성 또는 RAG)
- **Ingestion (수집)** — 나중에 검색할 수 있도록 대화 메시지를 메모리 저장소에 저장합니다

## 빠른 시작 (Quick Start)

> **참고:** `LongTermMemory`는 실험적 API입니다. 코드에 `@OptIn(ExperimentalAgentsApi::class)` 어노테이션을 추가하거나 파일 상단에 `@file:OptIn(ExperimentalAgentsApi::class)`를 추가하세요.

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    val myStorage = InMemoryRecordStorage() // 또는 사용 중인 벡터 DB 어댑터

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

    agent.run("우리가 어제 무엇을 논의했지?")
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

    Object result = agent.run("우리가 어제 무엇을 논의했지?");
    ```

## 검색 전용 (Retrieval Only - RAG)

이미 데이터가 채워진 지식 베이스가 있는 경우 수집 없이 검색만 사용하십시오:

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 선택 사항: 특정 네임스페이스/컬렉션으로 범위를 제한
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

### 프롬프트 보강 도구 (Prompt Augmenters)

| 보강 도구 | 동작 |
|---|---|
| `SystemPromptAugmenter()` | 프롬프트 시작 부분에 시스템 메시지로 컨텍스트를 삽입합니다 (시스템 메시지가 없으면 아무 작업도 수행하지 않음) |
| `UserPromptAugmenter()` | 마지막 사용자 메시지 앞에 별도의 사용자 메시지로 컨텍스트를 삽입합니다 |
| `PromptAugmenter { prompt, context -> ... }` | 람다를 통한 사용자 정의 보강 |

### 검색 전략 (Search Strategies)

| 전략 | 동작 |
|-----------------------------------------------------------|--------------------------|
| `KeywordSearchStrategy()` | 전체 텍스트/어휘 키워드 매칭 |
| `SimilaritySearchStrategy()` | 벡터 유사성 기반 의미론적 검색 |
| `query -> new KeywordSearchRequest(query, 20, 0.0, null)` | 람다를 통한 사용자 정의 검색 |

## 수집 전용 (Ingestion Only)

시간이 지남에 따라 메모리 저장소를 구축하려면 검색 없이 수집 기능만 사용하십시오:

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 선택 사항: 특정 네임스페이스/컬렉션으로 범위를 제한
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

### 수집 시점 (Ingestion Timing)

| 시점 | 동작 |
|---|---|
| `ON_LLM_CALL` | 각 LLM 호출/스트림 시 메시지를 수집합니다 (세션 내 RAG 가능) |
| `ON_AGENT_COMPLETION` | 에이전트 실행이 완료될 때 모든 메시지를 한꺼번에 수집합니다 |

## 전략 노드에서 장기 메모리 액세스하기

전략 노드 내부에서 `withLongTermMemory { }`를 사용하여 직접 검색하거나 레코드를 추가할 수 있습니다:

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // 수동으로 레코드 추가
        val record = MemoryRecord(content = "중요한 사실")
        this.getIngestionStorage()?.add(listOf(record), ingestionSettings?.namespace)

        // 수동으로 검색
        val request = SimilaritySearchRequest(query = input, limit = 5)
        val results = this.getRetrievalStorage()?.search(request, retrievalSettings?.namespace)
    }
}
```

`longTermMemory()`를 사용하여 기능 인스턴스를 직접 가져올 수 있습니다:

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.getIngestionStorage()
}
```

## 사용자 정의 메모리 레코드 추출기 (Custom Memory Record Extractor)

`MemoryRecordExtractor`를 구현하여 저장 전에 메시지가 변환되는 방식을 제어할 수 있습니다:

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

## 사용자 정의 저장소 구현하기 (Implementing Custom Storage)

`RetrievalStorage` 및/또는 `IngestionStorage`를 구현하여 벡터 데이터베이스에 연결할 수 있습니다:

```kotlin
class MyVectorDbStorage : RetrievalStorage, IngestionStorage {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult> {
        // 벡터 DB 쿼리 수행
    }

    override suspend fun add(
        records: List<MemoryRecord>, namespace: String?
    ) {
        // 벡터 DB에 데이터 삽입/업데이트(Upsert)
    }
}
```

테스트를 위해서는 키워드 기반 검색을 지원하며 레코드를 메모리에 보관하는 기본 제공 `InMemoryRecordStorage`를 사용하십시오.