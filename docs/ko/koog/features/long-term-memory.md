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
                searchStrategy = SimilaritySearchStrategy(topK = 5)
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
                    .withSearchStrategy(
                        SearchStrategy.builder().similarity().withTopK(5).build()
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

### 쿼리 추출기 (Query Extractors)

기본적으로 검색 흐름은 마지막 사용자 메시지를 검색 쿼리로 사용합니다. `QueryExtractor`를 제공하여 이를 사용자 정의할 수 있습니다:

| 추출기 | 동작 |
|---|---|
| `LastUserMessageQueryExtractor()` | 마지막 사용자 메시지의 콘텐츠를 사용합니다 (기본값) |
| `QueryExtractor { prompt -> ... }` | 람다를 통한 사용자 정의 추출 |

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myStorage
            queryExtractor = QueryExtractor { prompt ->
                // 마지막 두 사용자 메시지를 결합하여 검색 쿼리로 사용
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

### 검색 전략 (Search Strategies)

| 전략 | 동작 |
|-----------------------------------------------------------|--------------------------|
| `SimilaritySearchStrategy()` | 벡터 유사성 기반 의미론적 검색 — **기본값** |
| `query -> new SimilaritySearchRequest(query, 20, 0, 0.0, null)` | 람다를 통한 사용자 정의 검색 |

## 수집 전용 (Ingestion Only)

시간이 지남에 따라 메모리 저장소를 구축하려면 검색 없이 수집 기능만 사용하십시오:

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        ingestion {
            storage = myVectorDbStorage
            namespace = "my-collection"  // 선택 사항: 특정 네임스페이스/컬렉션으로 범위를 제한
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

### 수집 시점 (Ingestion Timing)

| 시점 | 동작 |
|---|---|
| `ON_LLM_CALL` | 각 LLM 호출이 시작되기 전에 프롬프트 메시지를 수집하고, 완료 또는 스트림 완료 후에 어시스턴트 출력을 수집합니다. 세션 내 RAG를 가능하게 합니다. |
| `ON_AGENT_COMPLETION` | 에이전트 실행이 완료될 때 최종 누적된 세션 프롬프트/히스토리를 한꺼번에 수집합니다. |

## 자동 동작 비활성화 (Disabling Automatic Behavior)

기본적으로 검색과 수집은 자동으로 실행됩니다 (각각 LLM 호출 전후). 자동 동작을 비활성화하면서도 전략 노드 내부에서 설정된 저장소 및 전략에 액세스할 수 있습니다:

=== "Kotlin"

    ```kotlin
    @OptIn(ExperimentalAgentsApi::class)
    install(LongTermMemory) {
        retrieval {
            storage = myStorage
            enableAutomaticRetrieval = false  // 자동 프롬프트 보강 없음
        }
        ingestion {
            storage = myStorage
            enableAutomaticIngestion = false  // 자동 메시지 저장 없음
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

이를 통해 세 가지 깔끔한 모드를 사용할 수 있습니다:

1. **전체 자동 (Full automatic)** (기본값): 기능을 설치하고 저장소를 설정하면 검색과 수집이 자동으로 작동합니다.
2. **수동 전용 (Manual only)**: `enableAutomaticRetrieval = false` / `enableAutomaticIngestion = false`로 설정하고 그래프 전략 노드에서 저장소와 전략을 사용합니다.
3. **하이브리드 (Hybrid)**: 자동 수집과 수동 검색을 결합합니다 (또는 그 반대).

## 전략 노드에서 장기 메모리 액세스하기 (Accessing Long-Term Memory from Strategy Nodes)

전략 노드 내부에서 `withLongTermMemory { }`를 사용하여 직접 검색하거나 레코드를 추가할 수 있습니다:

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    withLongTermMemory {
        // 수동으로 레코드 추가
        val record = MemoryRecord(content = "중요한 사실")
        ingestionStorage?.add(listOf(record), namespace = "my-namespace")

        // 수동으로 검색
        val request = SimilaritySearchRequest(queryText = input, limit = 5)
        val results = retrievalStorage?.search(request, namespace = "my-namespace")
    }
}
```

`longTermMemory()`를 사용하여 기능 인스턴스를 직접 가져올 수 있습니다:

```kotlin
@OptIn(ExperimentalAgentsApi::class)
val myNode by node<String, Unit> {
    val memory = longTermMemory()
    val storage = memory.ingestionStorage
}
```

## 사용자 정의 추출 전략 (Custom Extraction Strategy)

`ExtractionStrategy`를 구현하여 저장 전에 메시지가 변환되는 방식을 제어할 수 있습니다:

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

## 사용자 정의 저장소 구현하기 (Implementing Custom Storage)

`SearchStorage` 및/또는 `WriteStorage`를 구현하여 벡터 데이터베이스에 연결할 수 있습니다:

```kotlin
class MyVectorDbStorage : SearchStorage<TextDocument, SearchRequest>, WriteStorage<TextDocument> {
    override suspend fun search(
        request: SearchRequest, namespace: String?
    ): List<SearchResult<TextDocument>> {
        // 벡터 DB 쿼리 수행
    }

    override suspend fun add(
        records: List<TextDocument>, namespace: String?
    ) {
        // 벡터 DB에 데이터 삽입/업데이트(Upsert)
    }
}
```

테스트를 위해서는 레코드를 메모리에 보관하는 기본 제공 `InMemoryRecordStorage`를 사용하십시오. 이는 `KeywordSearchRequest`와 `SimilaritySearchRequest`를 모두 지원하지만, 두 가지 모두 단순한 대소문자 구분 없는 부분 문자열 매칭으로 구현되어 있습니다 (벡터 임베딩 없음).