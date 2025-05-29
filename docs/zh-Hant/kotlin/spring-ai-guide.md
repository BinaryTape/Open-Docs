[//]: # (title: 建立使用 Spring AI 回答基於 Qdrant 中文件問題的 Kotlin 應用程式 — 教程)

在本教程中，您將學習如何建立一個 Kotlin 應用程式，該程式使用 [Spring AI](https://spring.io/projects/spring-ai) 來連接大型語言模型 (LLM)，將文件儲存於向量資料庫中，並利用這些文件的上下文回答問題。

在本教程中，您將使用以下工具：

*   [Spring Boot](https://spring.io/projects/spring-boot) 作為設定和執行網頁應用程式的基礎。
*   [Spring AI](https://spring.io/projects/spring-ai) 以與 LLM 互動並執行基於上下文的檢索。
*   [IntelliJ IDEA](https://www.jetbrains.com/idea/) 用於產生專案並實作應用程式邏輯。
*   [Qdrant](https://qdrant.tech/) 作為用於相似性搜尋的向量資料庫。
*   [Docker](https://www.docker.com/) 用於本地執行 Qdrant。
*   [OpenAI](https://platform.openai.com) 作為 LLM 提供者。

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

    > 如果您使用 IntelliJ IDEA 社群版 (Community Edition) 或其他 IDE，您可以使用[網頁型專案產生器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)來產生 Spring Boot 專案。
    >
    {style="tip"}

2.  在 [OpenAI 平台](https://platform.openai.com/api-keys)上建立一個 OpenAI API 金鑰以存取 API。
3.  安裝 [Docker](https://www.docker.com/) 以在本地執行 Qdrant 向量資料庫。
4.  安裝 Docker 後，開啟您的終端機並執行以下指令以啟動容器：

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## 建立專案

> 您可以使用 [Spring Boot 網頁型專案產生器](https://start.spring.io/)作為替代方案來產生您的專案。
>
{style="note"}

在 IntelliJ IDEA Ultimate Edition 中建立一個新的 Spring Boot 專案：

1.  在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
2.  在左側面板中，選擇 **New Project** | **Spring Boot**。
3.  在 **New Project** 視窗中指定以下欄位和選項：

    *   **Name**：springAIDemo
    *   **Language**：Kotlin
    *   **Type**：Gradle - Kotlin

        > 此選項指定建置系統和 DSL。
        >
        {style="tip"}

    *   **Package name**：com.example.springaidemo
    *   **JDK**：Java JDK

        > 本教程使用 **Oracle OpenJDK version 21.0.1**。如果您沒有安裝 JDK，可以從下拉式清單中下載。
        >
        {style="note"}

    *   **Java**：17

   ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  確保您已指定所有欄位，然後點擊 **Next**。
5.  在 **Spring Boot** 欄位中選擇最新的穩定版 Spring Boot。

6.  選擇本教程所需的以下依賴項：

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant Vector Database**

   ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  點擊 **Create** 以產生並設定專案。

    > IDE 將會產生並開啟一個新專案。下載並匯入專案依賴項可能需要一些時間。
    >
    {style="tip"}

之後，您可以在 **Project view** 中看到以下結構：

![Spring Boot project view](spring-ai-project-view.png){width=400}

產生的 Gradle 專案對應於 Maven 的標準目錄佈局：

*   `main/kotlin` 資料夾下包含應用程式所屬的套件和類別。
*   應用程式的進入點是 `SpringAiDemoApplication.kt` 檔案的 `main()` 方法。

## 更新專案配置

1.  使用以下內容更新您的 `build.gradle.kts` Gradle 建置檔：

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
    ```

2.  將您的 `springAiVersion` 更新為 `1.0.0-M6`：

    ```kotlin
    extra["springAiVersion"] = "1.0.0-M6"
    ```

3.  點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案。
4.  使用以下內容更新您的 `src/main/resources/application.properties` 檔案：

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

    > 將您的 OpenAI API 金鑰設定到 `spring.ai.openai.api-key` 屬性。
    >
    {style="note"}

5.  執行 `SpringAiDemoApplication.kt` 檔案以啟動 Spring Boot 應用程式。應用程式啟動後，在瀏覽器中開啟 [Qdrant collections](http://localhost:6333/dashboard#/collections) 頁面以查看結果：

    ![Qdrant collections](qdrant-collections.png){width=700}

## 建立控制器以載入和搜尋文件

建立一個 Spring `@RestController` 以搜尋文件並將其儲存到 Qdrant 集合中：

1.  在 `src/main/kotlin/org/example/springaidemo` 目錄中，建立一個名為 `KotlinSTDController.kt` 的新檔案，並加入以下程式碼：

    ```kotlin
    package org.example.springaidemo
    
    // Imports the required Spring and utility classes
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

    // Data class representing the chat request payload
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
            // Loads a list of documents from the Kotlin documentation
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // Base URL for the documents
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // Retrieves each document from the URL and adds it to the vector store
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // Builds a document with a random UUID
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

2.  更新 `SpringAiDemoApplication.kt` 檔案以宣告一個 `RestTemplate` Bean：

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

3.  執行應用程式。
4.  在終端機中，向 `/kotlin/load-docs` 端點發送 POST 請求以載入文件：

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  文件載入後，您可以透過 GET 請求搜尋它們：

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

    ![GET request results](spring-ai-get-results.png){width="700"}

> 您也可以在 [Qdrant collections](http://localhost:6333/dashboard#/collections) 頁面查看結果。
>
{style="tip"}

## 實作 AI 聊天端點

文件載入後，最後一步是新增一個端點，透過 Spring AI 的檢索增強生成 (Retrieval-Augmented Generation, RAG) 支援，利用 Qdrant 中的文件回答問題：

1.  開啟 `KotlinSTDController.kt` 檔案，並匯入以下類別：

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

2.  將 `ChatClient.Builder` 加入控制器的建構函式參數：

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

3.  在控制器類別中，建立一個 `ChatClient` 實例和一個查詢轉換器：

    ```kotlin
    // Builds the chat client with a simple logging advisor
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    // Builds the query transformer used to rewrite the input query
    private val rqtBuilder = RewriteQueryTransformer.builder().chatClientBuilder(chatClientBuilder)
    ```

4.  在 `KotlinSTDController.kt` 檔案底部，新增一個 `chatAsk()` 端點，並加入以下邏輯：

    ```kotlin
        @PostMapping("/chat/ask")
        fun chatAsk(@RequestBody request: ChatRequest): String? {
            // Defines the prompt template with placeholders
            val promptTemplate = PromptTemplate(
                """
                {query}.
                Please provide a concise answer based on the {target} documentation.
            """.trimIndent()
            )
    
            // Creates the prompt by substituting placeholders with actual values
            val prompt: Prompt =
                promptTemplate.create(mapOf("query" to request.query, "target" to "Kotlin standard library"))
    
            // Configures the retrieval advisor to augment the query with relevant documents
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
    
            // Sends the prompt to the LLM with the retrieval advisor and get the response
            val response = chatClient.prompt(prompt)
                .advisors(retrievalAdvisor)
                .call()
                .content()
            logger.info("Chat response generated for query: '${request.query}'")
            return response
        }
    ```

5.  執行應用程式。
6.  在終端機中，向新端點發送 POST 請求以查看結果：

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

    ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

恭喜！您現在擁有一個 Kotlin 應用程式，可以連接到 OpenAI 並利用儲存在 Qdrant 中文件的上下文來回答問題。
嘗試使用不同的查詢或匯入其他文件以探索更多可能性。

您可以在 [Spring AI demo GitHub 儲存庫](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo) 中查看已完成的專案，或在 [Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master) 中探索其他 Spring AI 範例。