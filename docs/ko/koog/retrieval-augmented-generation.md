---
status: beta
---

# 검색 증강 생성 (RAG)

--8<-- "versioning-snippets.md:beta"

Koog는 검색 증강 생성 (Retrieval-augmented generation, RAG)을 위한 빌딩 블록을 제공합니다: 텍스트 임베딩, 임베딩된 문서 저장, 그리고 쿼리에 가장 관련성 높은 결과 검색.

이 페이지에서는 현재 `rag` 모듈에서 사용할 수 있는 기능과 사용법을 중점적으로 다룹니다.

## Koog가 현재 제공하는 것

현재 RAG 지원은 두 개의 모듈로 나뉩니다:

- `rag-base`: 검색, 저장, 검색 요청, 필터링, 파일/문서 제공자를 위한 공통 추상화
- `rag-vector`: 문서 임베딩과 벡터 저장소를 결합한 로컬 구현체

## EmbeddingStorage를 사용한 문서 임베딩 및 검색

`rag-vector` 모듈의 `EmbeddingStorage`를 사용하면 즉시 사용 가능한 가장 완전한 RAG 플로우를 구축할 수 있습니다. 이는 `DocumentEmbedder`(문서를 벡터로 변환)와 `VectorStorageBackend`(벡터를 영구 저장)를 결합합니다.

단계는 다음과 같습니다:

1. 임베딩 모델(Ollama 또는 OpenAI)을 기반으로 하는 `Embedder`를 생성합니다.
2. 파일 내용을 읽고 임베더에 작업을 위임하는 `JVMTextDocumentEmbedder`를 생성합니다.
3. 인메모리 또는 파일 기반 백엔드를 사용하는 `EmbeddingStorage`를 생성합니다.
4. `add()`로 문서를 추가합니다.
5. `search(SimilaritySearchRequest(...))`로 검색합니다.

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
    // 1. 로컬 Ollama 모델을 기반으로 하는 임베더 생성
    val embedder = LLMEmbedder(
        client = OllamaClient(),
        model = OllamaModels.Embeddings.NOMIC_EMBED_TEXT
    )

    // 2. 파일을 읽고 텍스트를 임베딩하는 JVM 문서 임베더 생성
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 3. 인메모리 백엔드를 사용하는 EmbeddingStorage 생성
    val storage = EmbeddingStorage(
        embedder = documentEmbedder,
        storage = InMemoryVectorStorageBackend()
    )

    // 4. 저장소에 문서 추가
    storage.add(
        listOf(
            Path.of("./docs/faq.txt"),
            Path.of("./docs/pricing.txt"),
            Path.of("./docs/getting-started.txt")
        )
    )

    // 5. 가장 관련성 높은 문서 검색
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

## 에이전트 도구로 관련성 검색 제공하기 (에이전트 기반 RAG)

검색된 모든 문서를 미리 프롬프트에 주입하는 대신, RAG 저장소를 에이전트가 필요할 때 호출하는 도구로 노출할 수 있습니다. 이를 통해 에이전트는 언제 무엇을 검색할지 스스로 제어할 수 있습니다.

아래 예제는 `SearchStorage`(`EmbeddingStorage`가 구현하는 기본 검색 인터페이스)를 `@Tool` 및 `@LLMDescription` 어노테이션이 달린 함수로 감싼 다음, 에이전트가 사용할 수 있도록 `ToolRegistry`에 등록하는 방법을 보여줍니다.

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

    // RAG 저장소 생성
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    val ragStorage: SearchStorage<Path, SimilaritySearchRequest> = EmbeddingStorage(documentEmbedder, InMemoryVectorStorageBackend())

    const val apiKey = "apikey"
    -->
    <!--- SUFFIX
    -->
    ```kotlin
    // RAG 저장소를 검색하는 도구 정의
    @Tool
    @LLMDescription("지식 베이스에서 쿼리와 관련된 문서를 검색합니다. 가장 관련성이 높은 문서의 내용을 반환합니다.")
    suspend fun searchKnowledgeBase(
        @LLMDescription("필요한 정보에 대한 검색 쿼리")
        query: String,
        @LLMDescription("반환할 문서의 최대 개수")
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
            return "다음에 대한 관련 문서를 찾을 수 없습니다: $query"
        }

        val response = StringBuilder("${results.size}개의 관련 문서를 찾았습니다:
\n")
        results.forEachIndexed { index, result ->
            val content = Files.readString(result.document)
            response.append("문서 ${index + 1}: ${result.document.fileName}")
            response.append(" (점수: ${"%.2f".format(result.score.value)})
")
            response.append("내용: $content
\n")
        }
        return response.toString()
    }

    fun main() {
        runBlocking {
            // 검색 도구를 등록하고 에이전트 생성
            val tools = ToolRegistry {
                tool(::searchKnowledgeBase.asTool())
            }

            val agent = AIAgent(
                toolRegistry = tools,
                promptExecutor = simpleOpenAIExecutor(apiKey),
                llmModel = OpenAIModels.Chat.GPT4o
            )

            val response = agent.run("환불 정책이 어떻게 되나요?")
            println("에이전트 응답: $response")
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

이러한 방식을 통해 에이전트는 사용자의 쿼리에 따라 검색 도구를 호출할 시점을 스스로 결정합니다. 이는 에이전트가 다양한 요청을 처리하며 그중 일부만 지식 베이스 조회가 필요한 경우에 유용합니다.

## 사용 가능한 구현체

### 벡터 저장소 백엔드 (Vector storage backends)

- `InMemoryVectorStorageBackend`: 벡터를 메모리에 저장합니다. 테스트 및 프로토타입에 적합합니다.
- `FileVectorStorageBackend`: 재시작 후에도 유지되도록 벡터를 디스크에 저장합니다.
- `JVMFileVectorStorageBackend`: `java.nio.file.Path`를 사용하는 JVM 전용 파일 기반 백엔드입니다.

### 문서 임베더 (Document embedders)

- `TextDocumentEmbedder`: 문서 및 경로 유형에 따라 매개변수화된 일반적인 문서-텍스트 임베더입니다.
- `JVMTextDocumentEmbedder`: `java.nio.file.Path`에서 파일을 읽는 JVM 전용 임베더입니다.

### 결합된 저장소 구현체 (Combined storage implementations)

- `EmbeddingStorage`: 임의의 `DocumentEmbedder`와 임의의 `VectorStorageBackend`를 결합합니다.
- `InMemoryDocumentEmbeddingStorage`: `EmbeddingStorage` + `InMemoryVectorStorageBackend`를 위한 편의용 구현체입니다.
- `FileDocumentEmbeddingStorage`: `EmbeddingStorage` + `FileVectorStorageBackend`를 위한 편의용 구현체입니다.
- `JVMFileDocumentEmbeddingStorage`: JVM 파일 기반 임베딩 저장소입니다.
- `TextFileDocumentEmbeddingStorage`: 텍스트 문서용 파일 기반 저장소입니다.
- `JVMFileEmbeddingStorage`: 텍스트 문서용 JVM 파일 기반 저장소입니다.

## 현재 제한 사항

내장된 플로우는 로컬 및 참조 구현에는 유용하지만, 아직 완전한 프로덕션용 RAG 플랫폼은 아닙니다.

주요 제한 사항:

- 내장된 구현체는 유사도 검색(similarity search)만 지원합니다.
- `rag` 모듈에는 내장된 청킹 파이프라인(chunking pipeline)이 없습니다.
- 메타데이터가 풍부한 프로덕션 레코드 모델링은 아직 제한적입니다.
- 프로덕션급 벡터 데이터베이스 연동(Pinecone, Weaviate, pgvector, Milvus)은 현재 `rag` 모듈에서 제공되지 않습니다.

사용자 정의 백엔드를 구축하려는 경우, `rag-base` 추상화에서 시작하여 자체 저장소 어댑터를 구현하세요.

## 시작하기 위한 선택 가이드

다음의 경우 `rag-vector`를 사용하세요:

- 로컬 RAG 프로토타입을 원하는 경우
- 단순한 참조 구현체가 필요한 경우
- Koog 내부의 임베딩 및 검색 플로우를 실험하고 싶은 경우

다음의 경우 `rag-base`를 사용하세요:

- 자체 저장소 백엔드를 구축하는 경우
- 외부 벡터 데이터베이스를 연동하려는 경우
- 다른 Koog 모듈에서 추상화를 재사용하려는 경우

## 참고 항목

- [임베딩(Embeddings)](embeddings.md)