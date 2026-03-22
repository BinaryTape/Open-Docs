# 문서 저장소

Koog는 LLM(대규모 언어 모델)과 함께 사용할 수 있는 최신 검색 가능 정보 소스를 제공할 수 있도록, 문서에서 정보를 저장하고 검색하는 RAG(검색 증강 생성, Retrieval-Augmented Generation)를 지원합니다.

## 주요 RAG 기능

일반적인 RAG 시스템의 핵심 구성 요소는 다음과 같습니다.

- **문서 저장소(Document storage)**: 정보가 포함된 문서, 파일 또는 텍스트 청크(chunk)의 저장소입니다.
- **벡터 임베딩(Vector embeddings)**: 의미론적 의미를 포착하는 텍스트의 수치적 표현입니다. Koog의 임베딩에 대한 자세한 내용은 [임베딩](embeddings.md)을 참조하세요.
- **검색 메커니즘(Retrieval mechanism)**: 쿼리를 기반으로 가장 관련성 높은 문서를 찾는 시스템입니다.
- **생성 컴포넌트(Generation component)**: 검색된 정보를 사용하여 응답을 생성하는 LLM입니다.

RAG는 기존 LLM의 몇 가지 한계를 해결합니다.

- **지식 차단(Knowledge cutoff)**: RAG는 학습 데이터에 국한되지 않고 가장 최신 정보에 접근할 수 있습니다.
- **환각(Hallucinations)**: 검색된 문서에 응답의 근거를 둠으로써, RAG는 허구의 정보 생성을 줄입니다.
- **도메인 특화(Domain specificity)**: 지식 베이스를 큐레이팅하여 RAG를 특정 도메인에 맞게 조정할 수 있습니다.
- **투명성(Transparency)**: 정보의 출처를 인용할 수 있어 시스템의 설명 가능성을 높여줍니다.

## RAG 시스템에서 정보 찾기

RAG 시스템에서 관련 정보를 찾는 과정은 문서를 벡터 임베딩으로 저장하고, 사용자 쿼리와의 유사도를 기준으로 순위를 매기는 작업을 포함합니다. 이 접근 방식은 PDF, 이미지, 텍스트 파일 또는 개별 텍스트 청크를 포함한 다양한 문서 유형에서 작동합니다.

이 프로세스는 다음을 포함합니다:

1. **문서 임베딩(Document embedding)**: 문서를 의미론적 의미를 포착하는 벡터 표현으로 변환합니다.
2. **벡터 저장소(Vector storage)**: 빠른 검색을 위해 이러한 임베딩을 효율적으로 저장합니다.
3. **유사도 검색(Similarity search)**: 쿼리 임베딩과 가장 유사한 임베딩을 가진 문서를 찾습니다.
4. **랭킹(Ranking)**: 관련성 점수에 따라 문서의 순서를 정렬합니다.

## Koog에서 RAG 시스템 구현하기

Koog에서 RAG 시스템을 구현하려면 아래 단계를 따르세요.

1. Ollama 또는 OpenAI를 사용하여 임베더를 생성합니다. 임베더는 LLM 클라이언트 인스턴스와 모델을 파라미터로 받는 `LLMEmbedder` 클래스의 인스턴스입니다. 자세한 내용은 [임베딩](embeddings.md)을 참조하세요.
2. 생성된 일반 임베더를 기반으로 문서 임베더를 생성합니다.
3. 문서 저장소를 생성합니다.
4. 저장소에 문서를 추가합니다.
5. 정의된 쿼리를 사용하여 가장 관련성 높은 문서를 찾습니다.

이 단계 시퀀스는 주어진 사용자 쿼리에 대해 가장 관련성 높은 문서를 반환하는 *관련성 검색(relevance search)* 흐름을 나타냅니다. 다음은 위에서 설명한 전체 단계 시퀀스를 구현하는 방법을 보여주는 코드 샘플입니다.

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
    // Ollama를 사용하여 임베더 생성
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 다음과 같이 OpenAI 임베딩을 사용할 수도 있습니다:
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)

    // JVM 전용 문서 임베더 생성
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 인메모리 벡터 저장소를 사용하는 랭킹 문서 저장소 생성
    val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())

    // 저장소에 문서 저장
    rankedDocumentStorage.store(Path.of("./my/documents/doc1.txt"))
    rankedDocumentStorage.store(Path.of("./my/documents/doc2.txt"))
    rankedDocumentStorage.store(Path.of("./my/documents/doc3.txt"))
    // ... 필요한 만큼 더 많은 문서를 저장합니다
    rankedDocumentStorage.store(Path.of("./my/documents/doc100.txt"))

    // 사용자 쿼리에 대해 가장 관련성 높은 문서 찾기
    val query = "I want to open a bank account but I'm getting a 404 when I open your website. I used to be your client with a different account 5 years ago before you changed your firm name"
    val relevantFiles = rankedDocumentStorage.mostRelevantDocuments(query, count = 3)

    // 관련 파일 처리
    relevantFiles.forEach { file ->
        println("Relevant file: ${file.toAbsolutePath()}")
        // 필요에 따라 파일 콘텐츠 처리
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

### AI 에이전트가 사용할 수 있도록 관련성 검색 제공하기

랭킹 문서 저장소 시스템이 구축되면, 이를 사용하여 AI 에이전트가 사용자 질문에 답할 때 관련 컨텍스트를 제공하도록 할 수 있습니다. 이는 에이전트가 정확하고 문맥에 맞는 응답을 제공하는 능력을 향상시킵니다.

다음은 AI 에이전트가 문서 저장소에서 정보를 가져와 쿼리에 답할 수 있도록 정의된 RAG 시스템을 구현하는 예시입니다.

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
    // Ollama를 사용하여 임베더 생성
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 다음과 같이 OpenAI 임베딩을 사용할 수도 있습니다:
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)
    // JVM 전용 문서 임베더 생성
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    // 인메모리 벡터 저장소를 사용하는 랭킹 문서 저장소 생성
    val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())
    const val apiKey = "apikey"
    -->
    ```kotlin
    suspend fun solveUserRequest(query: String) {
        // 문서 제공자로부터 상위 5개의 문서 검색
        val relevantDocuments = rankedDocumentStorage.mostRelevantDocuments(query, count = 5)

        // 관련 컨텍스트를 가진 AI 에이전트 생성
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
            model = OpenAIModels.Chat.GPT4o, // 또는 원하는 다른 모델
            maxAgentIterations = 100,
        )

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey),
            llmModel = OpenAIModels.Chat.GPT4o
        )

        // 에이전트를 실행하여 응답 받기
        val response = agent.run(query)

        // 응답 반환 또는 처리
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

### 관련성 검색을 도구로 제공하기

문서 콘텐츠를 컨텍스트로 직접 제공하는 대신, 에이전트가 필요할 때 관련성 검색을 수행할 수 있도록 도구를 구현할 수도 있습니다. 이를 통해 에이전트는 문서 저장소를 언제 어떻게 사용할지 더 유연하게 결정할 수 있습니다.

다음은 관련성 검색 도구를 구현하는 예시입니다.

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
    // Ollama를 사용하여 임베더 생성
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    // 다음과 같이 OpenAI 임베딩을 사용할 수도 있습니다:
    // val embedder = LLMEmbedder(OpenAILLMClient("API_KEY"), OpenAIModels.Embeddings.TextEmbeddingAda3Large)
    // JVM 전용 문서 임베더 생성
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    // 인메모리 벡터 저장소를 사용하는 랭킹 문서 저장소 생성
    val rankedDocumentStorage = EmbeddingBasedDocumentStorage(documentEmbedder, InMemoryVectorStorage())
    const val apiKey = "apikey"
    -->
    ```kotlin
    @Tool
    @LLMDescription("임의의 주제에 관한 관련 문서를 검색합니다(존재하는 경우). 가장 관련성 높은 문서의 콘텐츠를 반환합니다.")
    suspend fun searchDocuments(
        @LLMDescription("관련 문서를 검색할 쿼리")
        query: String,
        @LLMDescription("문서의 최대 개수")
        count: Int
    ): String {
        val relevantDocuments =
            rankedDocumentStorage.mostRelevantDocuments(query, count = count, similarityThreshold = 0.9).toList()

        if (!relevantDocuments.isEmpty()) {
            return "쿼리에 대한 관련 문서를 찾을 수 없습니다: $query"
        }

        val result = StringBuilder("${relevantDocuments.size}개의 관련 문서를 찾았습니다:
\n")

        relevantDocuments.forEachIndexed { index, document ->
            val content = Files.readString(document)
            result.append("문서 ${index + 1}: ${document.fileName}
")
            result.append("콘텐츠: $content
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

이 접근 방식을 사용하면 에이전트는 사용자의 쿼리에 따라 검색 도구를 사용할지 여부를 스스로 결정할 수 있습니다. 이는 여러 문서의 정보가 필요하거나 에이전트가 특정 세부 정보를 검색해야 하는 복잡한 쿼리에 특히 유용합니다.

## 기존 벡터 저장소 및 문서 임베더 구현체

RAG 시스템을 더 편리하고 쉽게 구현할 수 있도록, Koog는 벡터 저장소, 문서 임베딩 및 결합된 임베딩/저장소 컴포넌트에 대해 즉시 사용 가능한 여러 구현체를 제공합니다.

### 벡터 저장소

#### InMemoryVectorStorage

문서와 해당 벡터 임베딩을 메모리에 저장하는 간단한 인메모리 구현체입니다. 테스트나 소규모 애플리케이션에 적합합니다.

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

자세한 내용은 [InMemoryVectorStorage](api:vector-storage::ai.koog.rag.vector.InMemoryVectorStorage) 레퍼런스를 참조하세요.

#### FileVectorStorage

문서와 해당 벡터 임베딩을 디스크에 저장하는 파일 기반 구현체입니다. 애플리케이션 재시작 후에도 데이터가 유지되어야 하는 영구 저장소에 적합합니다.

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

자세한 내용은 [FileVectorStorage](api:vector-storage::ai.koog.rag.vector.FileVectorStorage) 레퍼런스를 참조하세요.

#### JVMFileVectorStorage

`java.nio.file.Path`와 함께 작동하는 `FileVectorStorage`의 JVM 전용 구현체입니다.

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

자세한 내용은 [JVMFileVectorStorage](api:vector-storage::ai.koog.rag.vector.JVMFileVectorStorage) 레퍼런스를 참조하세요.

### 문서 임베더

#### TextDocumentEmbedder

텍스트로 변환할 수 있는 모든 문서 유형에 작동하는 일반 구현체입니다.

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

자세한 내용은 [TextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.TextDocumentEmbedder) 레퍼런스를 참조하세요.

#### JVMTextDocumentEmbedder

`java.nio.file.Path`와 함께 작동하는 JVM 전용 구현체입니다.

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

자세한 내용은 [JVMTextDocumentEmbedder](api:vector-storage::ai.koog.rag.vector.JVMTextDocumentEmbedder) 레퍼런스를 참조하세요.

### 결합된 저장소 구현체

#### EmbeddingBasedDocumentStorage

문서 임베더와 벡터 저장소를 결합하여 문서를 저장하고 순위를 매기는 완전한 솔루션을 제공합니다.

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

자세한 내용은 [EmbeddingBasedDocumentStorage](api:vector-storage::ai.koog.rag.vector.EmbeddingBasedDocumentStorage) 레퍼런스를 참조하세요.

#### InMemoryDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage`의 인메모리 구현체입니다.

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

자세한 내용은 [InMemoryDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.InMemoryDocumentEmbeddingStorage) 레퍼런스를 참조하세요.

#### FileDocumentEmbeddingStorage

`EmbeddingBasedDocumentStorage`의 파일 기반 구현체입니다.

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

자세한 내용은 [FileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.FileDocumentEmbeddingStorage) 레퍼런스를 참조하세요.

#### JVMFileDocumentEmbeddingStorage

`FileDocumentEmbeddingStorage`의 JVM 전용 구현체입니다.

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

자세한 내용은 [JVMFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMFileDocumentEmbeddingStorage) 레퍼런스를 참조하세요.

#### JVMTextFileDocumentEmbeddingStorage

`JVMTextDocumentEmbedder`와 `JVMFileVectorStorage`를 결합한 JVM 전용 구현체입니다.

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

자세한 내용은 [JVMTextFileDocumentEmbeddingStorage](api:vector-storage::ai.koog.rag.vector.JVMTextFileDocumentEmbeddingStorage) 레퍼런스를 참조하세요.

이러한 구현체들은 다양한 환경에서 문서 임베딩 및 벡터 저장소 작업을 수행할 수 있도록 유연하고 확장 가능한 프레임워크를 제공합니다.

## 사용자 정의 벡터 저장소 및 문서 임베더 구현하기

사용자 정의 문서 임베더와 벡터 저장소 솔루션을 구현하여 Koog의 벡터 저장소 프레임워크를 확장할 수 있습니다. 이는 특수한 문서 유형이나 저장 요구 사항이 있는 작업을 할 때 특히 유용합니다.

다음은 PDF 문서용 사용자 정의 문서 임베더를 구현하는 예시입니다.

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
    // PDFDocument 클래스 정의
    class PDFDocument(private val path: Path) {
        fun readText(): String {
            // PDF 라이브러리를 사용하여 PDF에서 텍스트 추출
            return "Text extracted from PDF at $path"
        }
    }

    // PDFDocument용 DocumentProvider 구현
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

    // PDFDocument용 DocumentEmbedder 구현
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

    // PDF 문서용 커스텀 벡터 저장소 생성
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

    // 사용 예시
    suspend fun main() {
        val pdfProvider = PDFDocumentProvider()
        val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
        val pdfEmbedder = PDFDocumentEmbedder(embedder)
        val storage = InMemoryVectorStorage<PDFDocument>()
        val pdfStorage = PDFVectorStorage(pdfProvider, pdfEmbedder, storage)

        // PDF 문서 저장
        val pdfDocument = PDFDocument(Path.of("./documents/sample.pdf"))
        pdfStorage.store(pdfDocument)

        // 관련 PDF 문서 쿼리
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

## 임베딩 기반이 아닌 사용자 정의 RankedDocumentStorage 구현하기

임베딩 기반 문서 랭킹은 강력하지만, 임베딩에 의존하지 않는 사용자 정의 랭킹 메커니즘을 구현하고 싶은 시나리오가 있을 수 있습니다. 예를 들어 다음과 같은 기준에 따라 문서의 순위를 매길 수 있습니다:

- PageRank와 유사한 알고리즘
- 키워드 빈도
- 문서의 최신성
- 사용자 상호작용 기록
- 도메인 특화 휴리스틱

다음은 간단한 키워드 기반 랭킹 접근 방식을 사용하는 사용자 정의 `RankedDocumentStorage`를 구현하는 예시입니다.

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
            // 쿼리를 키워드로 분할
            val keywords = query.lowercase().split(Regex("\\W+")).filter { it.length > 2 }

            // 각 문서 처리
            storage.allDocuments().collect { document ->
                // 문서 텍스트 가져오기
                val documentText = documentProvider.text(document).toString().lowercase()

                // 키워드 빈도를 기반으로 간단한 유사도 점수 계산
                var similarity = 0.0
                for (keyword in keywords) {
                    val count = countOccurrences(documentText, keyword)
                    if (count > 0) {
                        similarity += count.toDouble() / documentText.length * 1000
                    }
                }

                // 유사도 점수와 함께 문서 발행
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

이 구현은 문서 텍스트에 나타나는 쿼리 키워드의 빈도를 기반으로 문서의 순위를 매깁니다. 이 방식을 TF-IDF(Term Frequency-Inverse Document Frequency)나 BM25와 같은 더 정교한 알고리즘으로 확장할 수도 있습니다.

또 다른 예시는 최신 문서를 우선시하는 시간 기반 랭킹 시스템입니다.

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

                // 수명에 따른 감쇠 계수 계산 (최신 문서일수록 높은 점수 부여)
                val decayFactor = Math.exp(-0.01 * ageInHours)

                emit(RankedDocument(document, decayFactor))
            }
        }

        // RankedDocumentStorage에서 요구하는 기타 메서드 구현
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

`RankedDocumentStorage` 인터페이스를 구현함으로써, 나머지 RAG 인프라를 그대로 활용하면서 특정 사용 사례에 맞게 설계된 사용자 정의 랭킹 메커니즘을 만들 수 있습니다.

Koog의 유연한 설계를 통해 다양한 저장 및 랭킹 전략을 믹스 앤 매치하여 특정 요구 사항을 충족하는 시스템을 구축할 수 있습니다.