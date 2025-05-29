[//]: # (title: Qdrant에 저장된 문서를 기반으로 질문에 답변하는 Spring AI를 사용하는 Kotlin 앱 구축 — 튜토리얼)

이 튜토리얼에서는 [스프링 AI (Spring AI)](https://spring.io/projects/spring-ai)를 사용하여 LLM에 연결하고, 벡터 데이터베이스 (vector database)에 문서를 저장하며, 해당 문서의 컨텍스트를 활용하여 질문에 답변하는 Kotlin 앱을 구축하는 방법을 배웁니다.

이 튜토리얼을 진행하는 동안 다음 도구들을 사용하게 됩니다.

*   [스프링 부트 (Spring Boot)](https://spring.io/projects/spring-boot): 웹 애플리케이션을 구성하고 실행하기 위한 기반.
*   [스프링 AI (Spring AI)](https://spring.io/projects/spring-ai): LLM과 상호작용하고 컨텍스트 기반 검색을 수행.
*   [IntelliJ IDEA (인텔리제이 IDEA)](https://www.jetbrains.com/idea/): 프로젝트를 생성하고 애플리케이션 로직을 구현.
*   [Qdrant (크런트)](https://qdrant.tech/): 유사성 검색을 위한 벡터 데이터베이스 (vector database).
*   [Docker (도커)](https://www.docker.com/): Qdrant를 로컬에서 실행.
*   [OpenAI (오픈AI)](https://platform.openai.com): LLM 제공자.

## 시작하기 전에

1.  [IntelliJ IDEA Ultimate Edition (인텔리제이 IDEA 얼티밋 에디션)](https://www.jetbrains.com/idea/download/index.html)의 최신 버전을 다운로드하여 설치합니다.

    > IntelliJ IDEA Community Edition (커뮤니티 에디션) 또는 다른 IDE (통합 개발 환경)를 사용하는 경우, [웹 기반 프로젝트 생성기](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)를 사용하여 스프링 부트 (Spring Boot) 프로젝트를 생성할 수 있습니다.
    >
    {style="tip"}

2.  API에 접근하기 위해 [OpenAI 플랫폼](https://platform.openai.com/api-keys)에서 OpenAI API 키 (API key)를 생성합니다.
3.  Qdrant 벡터 데이터베이스 (vector database)를 로컬에서 실행하기 위해 [Docker (도커)](https://www.docker.com/)를 설치합니다.
4.  Docker 설치 후 터미널을 열고 다음 명령어를 실행하여 컨테이너를 시작합니다.

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## 프로젝트 생성

> 프로젝트 생성의 대안으로 [스프링 부트 (Spring Boot) 웹 기반 프로젝트 생성기](https://start.spring.io/)를 사용할 수 있습니다.
>
{style="note"}

IntelliJ IDEA Ultimate Edition (인텔리제이 IDEA 얼티밋 에디션)에서 새로운 스프링 부트 (Spring Boot) 프로젝트를 생성합니다.

1.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2.  왼쪽 패널에서 **New Project** | **Spring Boot**를 선택합니다.
3.  **New Project** 창에서 다음 필드와 옵션을 지정합니다.

    *   **Name**: springAIDemo
    *   **Language**: Kotlin
    *   **Type**: Gradle - Kotlin

      > 이 옵션은 빌드 시스템과 DSL (Domain-Specific Language)을 지정합니다.
      >
      {style="tip"}

    *   **Package name**: com.example.springaidemo
    *   **JDK**: Java JDK

      > 이 튜토리얼은 **Oracle OpenJDK 버전 21.0.1**을 사용합니다.
      > JDK가 설치되어 있지 않다면 드롭다운 목록에서 다운로드할 수 있습니다.
      >
      {style="note"}

    *   **Java**: 17

   ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  모든 필드를 올바르게 지정했는지 확인하고 **Next**를 클릭합니다.
5.  **Spring Boot** 필드에서 최신 안정 버전의 스프링 부트 (Spring Boot)를 선택합니다.

6.  이 튜토리얼에 필요한 다음 의존성 (dependency)들을 선택합니다.

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant 벡터 데이터베이스 (Vector Database)**

   ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  **Create**를 클릭하여 프로젝트를 생성하고 설정합니다.

   > IDE (통합 개발 환경)가 새 프로젝트를 생성하고 엽니다. 프로젝트 의존성 (dependency)을 다운로드하고 임포트하는 데 시간이 걸릴 수 있습니다.
   >
   {style="tip"}

이 단계를 마치면 **프로젝트 뷰 (Project view)**에서 다음 구조를 확인할 수 있습니다.

![Spring Boot project view](spring-ai-project-view.png){width=400}

생성된 Gradle 프로젝트는 Maven의 표준 디렉터리 레이아웃 (Maven's standard directory layout)과 일치합니다.

*   `main/kotlin` 폴더 아래에 애플리케이션에 속하는 패키지와 클래스가 있습니다.
*   애플리케이션의 진입점은 `SpringAiDemoApplication.kt` 파일의 `main()` 메서드입니다.

## 프로젝트 구성 업데이트

1.  `build.gradle.kts` Gradle 빌드 파일을 다음과 같이 업데이트합니다.

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
    ```

2.  `springAiVersion`을 `1.0.0-M6`으로 업데이트합니다.

    ```kotlin
    extra["springAiVersion"] = "1.0.0-M6"
    ```

3.  **Gradle 변경 사항 동기화** 버튼을 클릭하여 Gradle 파일을 동기화합니다.
4.  `src/main/resources/application.properties` 파일을 다음과 같이 업데이트합니다.

    ```text
    # OpenAI
    spring.ai.openai.api-key=YOUR_OPENAI_API_KEY
    spring.ai.openai.chat.options.model=gpt-4o-mini
    spring.ai.openai.embedding.options.model=text-embedding-ada-002
    # Qdrant
    spring.ai.vectorstore.qdrant.host=localhost
    spring.ai.vectorstore.qdrant.port=6334
    spring.ai.vectorstore.qdrant.collection-name=kotlinDocs
    spring.ai.vectorstore.qdrant.initialize-schema=true
    ```

    > `spring.ai.openai.api-key` 속성에 OpenAI API 키 (API key)를 설정하세요.
    >
    {style="note"}

5.  `SpringAiDemoApplication.kt` 파일을 실행하여 스프링 부트 (Spring Boot) 애플리케이션을 시작합니다. 애플리케이션이 실행되면 브라우저에서 [Qdrant 컬렉션 (Qdrant collections)](http://localhost:6333/dashboard#/collections) 페이지를 열어 결과를 확인합니다.

   ![Qdrant collections](qdrant-collections.png){width=700}

## 문서를 로드하고 검색하는 컨트롤러 생성

문서를 검색하고 Qdrant 컬렉션 (Qdrant collections)에 저장하기 위한 Spring `@RestController`를 생성합니다.

1.  `src/main/kotlin/org/example/springaidemo` 디렉터리에 `KotlinSTDController.kt`라는 새 파일을 생성하고 다음 코드를 추가합니다.

    ```kotlin
    package org.example.springaidemo
    
    // 필요한 Spring 및 유틸리티 클래스를 임포트합니다.
    import org.slf4j.LoggerFactory
    import org.springframework.ai.document.Document
    import org.springframework.ai.vectorstore.SearchRequest
    import org.springframework.ai.vectorstore.VectorStore
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RequestParam
    import org.springframework.web.bind.annotation.RestController
    import org.springframework.web.client.RestTemplate
    import kotlin.uuid.ExperimentalUuidApi
    import kotlin.uuid.Uuid

    // 채팅 요청 페이로드를 나타내는 데이터 클래스
    data class ChatRequest(val query: String, val topK: Int = 3)

    @RestController
    @RequestMapping("/kotlin")
    class KotlinSTDController(
    private val restTemplate: RestTemplate,
    private val vectorStore: VectorStore,
    ) {
    private val logger = LoggerFactory.getLogger(this::class.java)

        @OptIn(ExperimentalUuidApi::class)
        @PostMapping("/load-docs")
        fun load() {
            // Kotlin 문서에서 문서 목록을 로드합니다.
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // 문서의 기본 URL
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // URL에서 각 문서를 검색하여 벡터 스토어에 추가합니다.
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // 무작위 UUID로 문서를 빌드합니다.
                        .id(Uuid.random().toString())
                        .text(it)
                        .metadata("topic", topic)
                        .build()
                    vectorStore.add(listOf(doc))
                    logger.info("Document $topic loaded.")
                } ?: logger.warn("Failed to load document for topic: $topic")
            }
        }

        @GetMapping("docs")
        fun query(
            @RequestParam query: String = "operations, filtering, and transformations",
            @RequestParam topK: Int = 2
        ): List<Document>? {
            val searchRequest = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .build()
            val results = vectorStore.similaritySearch(searchRequest)
            logger.info("Found ${results?.size ?: 0} documents for query: '$query'")
            return results
        }
    }
    ```
   {collapsible="true"}

2.  `SpringAiDemoApplication.kt` 파일을 업데이트하여 `RestTemplate` 빈 (bean)을 선언합니다.

    ```kotlin
    package org.example.springaidemo
    
    import org.springframework.boot.autoconfigure.SpringBootApplication
    import org.springframework.boot.runApplication
    import org.springframework.context.annotation.Bean
    import org.springframework.web.client.RestTemplate
    
    @SpringBootApplication
    class SpringAiDemoApplication {
    
        @Bean
        fun restTemplate(): RestTemplate = RestTemplate()
    }
    
    fun main(args: Array<String>) {
        runApplication<SpringAiDemoApplication>(*args)
    }
    ```
   {collapsible="true"}

3.  애플리케이션을 실행합니다.
4.  터미널에서 `/kotlin/load-docs` 엔드포인트로 POST 요청을 보내 문서를 로드합니다.

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  문서가 로드되면 GET 요청으로 검색할 수 있습니다.

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

   ![GET request results](spring-ai-get-results.png){width="700"}

> [Qdrant 컬렉션 (Qdrant collections)](http://localhost:6333/dashboard#/collections) 페이지에서도 결과를 확인할 수 있습니다.
>
{style="tip"}

## AI 채팅 엔드포인트 구현

문서가 로드되면, 마지막 단계는 스프링 AI (Spring AI)의 검색 증강 생성 (Retrieval-Augmented Generation, RAG) 지원을 통해 Qdrant에 있는 문서를 사용하여 질문에 답변하는 엔드포인트를 추가하는 것입니다.

1.  `KotlinSTDController.kt` 파일을 열고 다음 클래스를 임포트합니다.

    ```kotlin
    import org.springframework.ai.chat.client.ChatClient
    import org.springframework.ai.chat.client.advisor.RetrievalAugmentationAdvisor
    import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
    import org.springframework.ai.chat.prompt.Prompt
    import org.springframework.ai.chat.prompt.PromptTemplate
    import org.springframework.ai.rag.preretrieval.query.transformation.RewriteQueryTransformer
    import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever
    import org.springframework.web.bind.annotation.RequestBody
    ```

2.  컨트롤러의 생성자 매개변수에 `ChatClient.Builder`를 추가합니다.

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

3.  컨트롤러 클래스 내부에 `ChatClient` 인스턴스와 쿼리 변환기 (query transformer)를 생성합니다.

    ```kotlin
    // 간단한 로깅 어드바이저로 채팅 클라이언트를 빌드합니다.
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    // 입력 쿼리를 다시 작성하는 데 사용되는 쿼리 변환기를 빌드합니다.
    private val rqtBuilder = RewriteQueryTransformer.builder().chatClientBuilder(chatClientBuilder)
    ```

4.  `KotlinSTDController.kt` 파일 하단에 다음 로직을 가진 새로운 `chatAsk()` 엔드포인트를 추가합니다.

    ```kotlin
        @PostMapping("/chat/ask")
        fun chatAsk(@RequestBody request: ChatRequest): String? {
            // 플레이스홀더를 사용하여 프롬프트 템플릿을 정의합니다.
            val promptTemplate = PromptTemplate(
                """
                {query}.
                {target} 문서에 기반하여 간결한 답변을 제공해 주세요.
            """.trimIndent()
            )
    
            // 실제 값으로 플레이스홀더를 대체하여 프롬프트를 생성합니다.
            val prompt: Prompt =
                promptTemplate.create(mapOf("query" to request.query, "target" to "Kotlin standard library"))
    
            // 관련 문서로 쿼리를 증강하도록 검색 어드바이저를 구성합니다.
            val retrievalAdvisor = RetrievalAugmentationAdvisor.builder()
                .documentRetriever(
                    VectorStoreDocumentRetriever.builder()
                        .similarityThreshold(0.7)
                        .topK(request.topK)
                        .vectorStore(vectorStore)
                        .build()
                )
                .queryTransformers(rqtBuilder.promptTemplate(promptTemplate).build())
                .build()
    
            // 검색 어드바이저를 사용하여 LLM에 프롬프트를 보내고 응답을 받습니다.
            val response = chatClient.prompt(prompt)
                .advisors(retrievalAdvisor)
                .call()
                .content()
            logger.info("Chat response generated for query: '${request.query}'")
            return response
        }
    ```

5.  애플리케이션을 실행합니다.
6.  터미널에서 새 엔드포인트로 POST 요청을 보내 결과를 확인합니다.

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

   ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

축하합니다! 이제 OpenAI에 연결하고 Qdrant에 저장된 문서에서 검색된 컨텍스트를 사용하여 질문에 답변하는 Kotlin 앱을 갖게 되었습니다. 다양한 쿼리를 시도하거나 다른 문서를 임포트하여 더 많은 가능성을 탐색해 보세요.

완성된 프로젝트는 [Spring AI 데모 GitHub 저장소 (Spring AI demo GitHub repository)](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)에서 확인할 수 있으며, [Kotlin AI 예제 (Kotlin AI Examples)](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master)에서 다른 Spring AI 예제를 탐색할 수 있습니다.