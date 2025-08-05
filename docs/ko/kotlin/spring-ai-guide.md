[//]: # (title: Qdrant에 저장된 문서를 기반으로 질문에 답변하는 Spring AI를 사용하는 Kotlin 앱 구축 — 튜토리얼)

이 튜토리얼에서는 [Spring AI](https://spring.io/projects/spring-ai)를 사용하여 LLM에 연결하고, 문서를 벡터 데이터베이스에 저장하며, 해당 문서의 컨텍스트를 사용하여 질문에 답변하는 Kotlin 앱을 구축하는 방법을 배웁니다.

이 튜토리얼 동안 다음 도구를 사용합니다:

*   [Spring Boot](https://spring.io/projects/spring-boot): 웹 애플리케이션을 구성하고 실행하는 기본 도구입니다.
*   [Spring AI](https://spring.io/projects/spring-ai): LLM과 상호 작용하고 컨텍스트 기반 검색을 수행합니다.
*   [IntelliJ IDEA](https://www.jetbrains.com/idea/): 프로젝트를 생성하고 애플리케이션 로직을 구현합니다.
*   [Qdrant](https://qdrant.tech/): 유사성 검색을 위한 벡터 데이터베이스입니다.
*   [Docker](https://www.docker.com/): Qdrant를 로컬에서 실행합니다.
*   [OpenAI](https://platform.openai.com): LLM 제공자입니다.

## 시작하기 전에

1.  [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html) 최신 버전을 다운로드하여 설치합니다.

    > IntelliJ IDEA Community Edition 또는 다른 IDE를 사용하는 경우, [웹 기반 프로젝트 생성기](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)를 사용하여 Spring Boot 프로젝트를 생성할 수 있습니다.
    >
    {style="tip"}

2.  API에 액세스하기 위해 [OpenAI 플랫폼](https://platform.openai.com/api-keys)에서 OpenAI API 키를 생성합니다.
3.  Qdrant 벡터 데이터베이스를 로컬에서 실행하기 위해 [Docker](https://www.docker.com/)를 설치합니다.
4.  Docker 설치 후, 터미널을 열고 다음 명령어를 실행하여 컨테이너를 시작합니다:

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## 프로젝트 생성

> 프로젝트를 생성하는 다른 방법으로 [Spring Boot 웹 기반 프로젝트 생성기](https://start.spring.io/)를 사용할 수 있습니다.
>
{style="note"}

IntelliJ IDEA Ultimate Edition에서 새 Spring Boot 프로젝트를 생성합니다:

1.  IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2.  왼쪽 패널에서 **New Project** | **Spring Boot**를 선택합니다.
3.  **New Project** 창에서 다음 필드와 옵션을 지정합니다:

    *   **Name**: springAIDemo
    *   **Language**: Kotlin
    *   **Type**: Gradle - Kotlin

        > 이 옵션은 빌드 시스템과 DSL을 지정합니다.
        >
        {style="tip"}

    *   **Package name**: com.example.springaidemo
    *   **JDK**: Java JDK

        > 이 튜토리얼에서는 **Oracle OpenJDK 버전 21.0.1**을 사용합니다.
        > JDK가 설치되어 있지 않으면 드롭다운 목록에서 다운로드할 수 있습니다.
        >
        {style="note"}

    *   **Java**: 17

        > Java 17이 설치되어 있지 않으면 JDK 드롭다운 목록에서 다운로드할 수 있습니다.
        >
        {style="tip"}

    ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  모든 필드를 지정했는지 확인하고 **Next**를 클릭합니다.
5.  **Spring Boot** 필드에서 최신 안정화 Spring Boot 버전을 선택합니다.

6.  이 튜토리얼에 필요한 다음 종속성을 선택합니다:

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant Vector Database**

    ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  **Create**를 클릭하여 프로젝트를 생성하고 설정합니다.

    > IDE가 새 프로젝트를 생성하고 엽니다. 프로젝트 종속성을 다운로드하고 가져오는 데 시간이 걸릴 수 있습니다.
    >
    {style="tip"}

이후 **Project view**에서 다음 구조를 확인할 수 있습니다:

![Spring Boot project view](spring-ai-project-view.png){width=400}

생성된 Gradle 프로젝트는 Maven의 표준 디렉토리 레이아웃에 해당합니다:

*   `main/kotlin` 폴더 아래에는 애플리케이션에 속하는 패키지와 클래스가 있습니다.
*   애플리케이션의 진입점은 `SpringAiDemoApplication.kt` 파일의 `main()` 메서드입니다.

## 프로젝트 구성 업데이트

1.  다음과 같이 `build.gradle.kts` Gradle 빌드 파일을 업데이트합니다:

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
    ```

2.  `springAiVersion`을 `1.0.0`으로 설정합니다:

    ```kotlin
    extra["springAiVersion"] = "1.0.0"
    ```

3.  **Sync Gradle Changes** 버튼을 클릭하여 Gradle 파일을 동기화합니다.
4.  다음과 같이 `src/main/resources/application.properties` 파일을 업데이트합니다:

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

    > `spring.ai.openai.api-key` 속성에 OpenAI API 키를 설정합니다.
    >
    {style="note"}

5.  `SpringAiDemoApplication.kt` 파일을 실행하여 Spring Boot 애플리케이션을 시작합니다.
    실행되면 브라우저에서 [Qdrant collections](http://localhost:6333/dashboard#/collections) 페이지를 열어 결과를 확인합니다:

    ![Qdrant collections](qdrant-collections.png){width=700}

## 문서를 로드하고 검색하는 컨트롤러 생성

문서를 검색하고 Qdrant 컬렉션에 저장하는 Spring `@RestController`를 생성합니다:

1.  `src/main/kotlin/org/example/springaidemo` 디렉토리에 `KotlinSTDController.kt`라는 새 파일을 생성하고 다음 코드를 추가합니다:

    ```kotlin
    package org.example.springaidemo

    // 필요한 Spring 및 유틸리티 클래스 임포트
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
            // Kotlin 문서에서 문서 목록 로드
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // 문서의 기본 URL
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // URL에서 각 문서를 검색하여 벡터 저장소에 추가
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // 임의의 UUID로 문서 생성
                        .id(Uuid.random().toString())
                        .text(it)
                        .metadata("topic", topic)
                        .build()
                    vectorStore.add(listOf(doc))
                    logger.info("문서 $topic이 로드되었습니다.")
                } ?: logger.warn("토픽 $topic에 대한 문서 로드 실패")
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
            logger.info("쿼리 '$query'에 대해 ${results?.size ?: 0}개 문서 발견")
            return results
        }
    }
    ```
    {collapsible="true"}

2.  `RestTemplate` 빈을 선언하도록 `SpringAiDemoApplication.kt` 파일을 업데이트합니다:

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
4.  터미널에서 `/kotlin/load-docs` 엔드포인트로 POST 요청을 보내 문서를 로드합니다:

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  문서가 로드되면 GET 요청으로 검색할 수 있습니다:

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

    ![GET request results](spring-ai-get-results.png){width="700"}

> [Qdrant collections](http://localhost:6333/dashboard#/collections) 페이지에서 결과를 확인할 수도 있습니다.
>
{style="tip"}

## AI 채팅 엔드포인트 구현

문서가 로드되면 마지막 단계는 Spring AI의 RAG(Retrieval-Augmented Generation) 지원을 통해 Qdrant에 있는 문서를 사용하여 질문에 답변하는 엔드포인트를 추가하는 것입니다:

1.  `KotlinSTDController.kt` 파일을 열고 다음 클래스를 임포트합니다:

    ```kotlin
    import org.springframework.ai.chat.client.ChatClient
    import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
    import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor
    import org.springframework.ai.chat.prompt.Prompt
    import org.springframework.ai.chat.prompt.PromptTemplate
    import org.springframework.web.bind.annotation.RequestBody
    ```

2.  `ChatRequest` 데이터 클래스를 정의합니다:

    ```kotlin
    // 채팅 쿼리용 요청 페이로드 나타냄
    data class ChatRequest(val query: String, val topK: Int = 3)
    ```

3.  컨트롤러의 생성자 매개변수에 `ChatClient.Builder`를 추가합니다:

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

4.  컨트롤러 클래스 내부에 `ChatClient` 인스턴스를 생성합니다:

    ```kotlin
    // 간단한 로깅 어드바이저로 채팅 클라이언트 빌드
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    ```

5.  `KotlinSTDController.kt` 파일 하단에 다음 로직으로 새로운 `chatAsk()` 엔드포인트를 추가합니다:

    ```kotlin
    @PostMapping("/chat/ask")
    fun chatAsk(@RequestBody request: ChatRequest): String? {
        // 플레이스홀더를 사용하여 프롬프트 템플릿 정의
        val promptTemplate = PromptTemplate(
            """
            {query}.
            Please provide a concise answer based on the "Kotlin standard library" documentation.
        """.trimIndent()
        )

        // 실제 값으로 플레이스홀더를 대체하여 프롬프트 생성
        val prompt: Prompt =
            promptTemplate.create(mapOf("query" to request.query))

        // 관련 문서로 쿼리를 보강하도록 검색 어드바이저 구성
        val retrievalAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
            .searchRequest(
                SearchRequest.builder()
                    .similarityThreshold(0.7)
                    .topK(request.topK)
                    .build()
            )
            .promptTemplate(promptTemplate)
            .build()

        // 검색 어드바이저와 함께 LLM에 프롬프트 전송하고 생성된 콘텐츠 검색
        val response = chatClient.prompt(prompt)
            .advisors(retrievalAdvisor)
            .call()
            .content()
        logger.info("쿼리 '${request.query}'에 대한 채팅 응답 생성됨")
        return response
    }
    ```

6.  애플리케이션을 실행합니다.
7.  터미널에서 새 엔드포인트로 POST 요청을 보내 결과를 확인합니다:

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

    ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

축하합니다! 이제 OpenAI에 연결하고 Qdrant에 저장된 문서에서 검색된 컨텍스트를 사용하여 질문에 답변하는 Kotlin 앱을 갖게 되었습니다.
다른 쿼리로 실험하거나 다른 문서를 임포트하여 더 많은 가능성을 탐색해보세요.

완성된 프로젝트는 [Spring AI 데모 GitHub 저장소](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)에서 볼 수 있으며, 다른 Spring AI 예제는 [Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master)에서 살펴볼 수 있습니다.