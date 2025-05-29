[//]: # (title: Qdrantに保存されたドキュメントに基づいてSpring AIを使用し質問に回答するKotlinアプリの構築 — チュートリアル)

このチュートリアルでは、[Spring AI](https://spring.io/projects/spring-ai)を使用してLLMに接続し、ドキュメントをベクターデータベースに保存し、それらのドキュメントのコンテキストを使用して質問に回答するKotlinアプリを構築する方法を学びます。

このチュートリアルでは、以下のツールを使用します。

*   [Spring Boot](https://spring.io/projects/spring-boot)：Webアプリケーションの構成と実行の基盤として。
*   [Spring AI](https://spring.io/projects/spring-ai)：LLMとの対話とコンテキストベースの検索実行に。
*   [IntelliJ IDEA](https://www.jetbrains.com/idea/)：プロジェクトの生成とアプリケーションロジックの実装に。
*   [Qdrant](https://qdrant.tech/)：類似性検索のためのベクターデータベースとして。
*   [Docker](https://www.docker.com/)：Qdrantをローカルで実行するために。
*   [OpenAI](https://platform.openai.com)：LLMプロバイダーとして。

## 開始する前に

1.  [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールします。

    > IntelliJ IDEA Community Editionまたは別のIDEを使用している場合は、[Webベースのプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)を使用してSpring Bootプロジェクトを生成できます。
    >
    {style="tip"}

2.  APIにアクセスするために、[OpenAIプラットフォーム](https://platform.openai.com/api-keys)でOpenAI APIキーを作成します。
3.  Qdrantベクターデータベースをローカルで実行するために[Docker](https://www.docker.com/)をインストールします。
4.  Dockerをインストールした後、ターミナルを開き、次のコマンドを実行してコンテナを起動します。

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## プロジェクトを作成する

> プロジェクトを生成する代替手段として、[Spring Boot Webベースのプロジェクトジェネレーター](https://start.spring.io/)を使用できます。
>
{style="note"}

IntelliJ IDEA Ultimate Editionで新しいSpring Bootプロジェクトを作成します。

1.  IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
2.  左側のパネルで、**New Project** | **Spring Boot** を選択します。
3.  **New Project**ウィンドウで、以下のフィールドとオプションを指定します。

    *   **Name**: springAIDemo
    *   **Language**: Kotlin
    *   **Type**: Gradle - Kotlin

        > このオプションは、ビルドシステムとDSLを指定します。
        >
        {style="tip"}

    *   **Package name**: com.example.springaidemo
    *   **JDK**: Java JDK

        > このチュートリアルでは、**Oracle OpenJDK version 21.0.1**を使用します。
        > JDKがインストールされていない場合、ドロップダウンリストからダウンロードできます。
        >
        {style="note"}

    *   **Java**: 17

   ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  すべてのフィールドを指定したことを確認し、**Next** をクリックします。
5.  **Spring Boot**フィールドで、最新の安定版Spring Bootバージョンを選択します。

6.  このチュートリアルに必要な以下の依存関係を選択します。

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant Vector Database**

   ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  **Create** をクリックして、プロジェクトを生成およびセットアップします。

   > IDEは新しいプロジェクトを生成して開きます。プロジェクトの依存関係をダウンロードしてインポートするのに時間がかかる場合があります。
   >
   {style="tip"}

この後、**Project view** で以下の構造を確認できます。

![Spring Boot project view](spring-ai-project-view.png){width=400}

生成されたGradleプロジェクトは、Mavenの標準ディレクトリレイアウトに対応しています。

*   `main/kotlin`フォルダーの下には、アプリケーションに属するパッケージとクラスがあります。
*   アプリケーションのエントリポイントは、`SpringAiDemoApplication.kt`ファイルの`main()`メソッドです。

## プロジェクト構成を更新する

1.  `build.gradle.kts` Gradleビルドファイルを次のように更新します。

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
    ```

2.  `springAiVersion`を`1.0.0-M6`に更新します。

    ```kotlin
    extra["springAiVersion"] = "1.0.0-M6"
    ```

3.  **Sync Gradle Changes**ボタンをクリックして、Gradleファイルを同期します。
4.  `src/main/resources/application.properties`ファイルを次のように更新します。

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

    > `spring.ai.openai.api-key`プロパティにOpenAI APIキーを設定します。
    >
    {style="note"}

5.  `SpringAiDemoApplication.kt`ファイルを実行して、Spring Bootアプリケーションを起動します。
    実行されたら、ブラウザで[Qdrant collections](http://localhost:6333/dashboard#/collections)ページを開いて結果を確認します。

    ![Qdrant collections](qdrant-collections.png){width=700}

## ドキュメントのロードと検索を行うコントローラーを作成する

ドキュメントを検索し、Qdrantコレクションに保存するためのSpring `@RestController`を作成します。

1.  `src/main/kotlin/org/example/springaidemo`ディレクトリに、`KotlinSTDController.kt`という新しいファイルを作成し、以下のコードを追加します。

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

2.  `SpringAiDemoApplication.kt`ファイルを更新して、`RestTemplate` Beanを宣言します。

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

3.  アプリケーションを実行します。
4.  ターミナルで、`/kotlin/load-docs`エンドポイントにPOSTリクエストを送信してドキュメントをロードします。

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  ドキュメントがロードされたら、GETリクエストで検索できます。

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

    ![GET request results](spring-ai-get-results.png){width="700"}

> [Qdrant collections](http://localhost:6333/dashboard#/collections)ページでも結果を閲覧できます。
>
{style="tip"}

## AIチャットエンドポイントを実装する

ドキュメントがロードされたら、最終ステップとして、Spring AIのRetrieval-Augmented Generation (RAG)サポートを通じて、Qdrant内のドキュメントを使用して質問に回答するエンドポイントを追加します。

1.  `KotlinSTDController.kt`ファイルを開き、以下のクラスをインポートします。

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

2.  コントローラーのコンストラクタパラメータに`ChatClient.Builder`を追加します。

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

3.  コントローラークラス内に、`ChatClient`インスタンスとクエリトランスフォーマーを作成します。

    ```kotlin
    // Builds the chat client with a simple logging advisor
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    // Builds the query transformer used to rewrite the input query
    private val rqtBuilder = RewriteQueryTransformer.builder().chatClientBuilder(chatClientBuilder)
    ```

4.  `KotlinSTDController.kt`ファイルの最後に、以下のロジックを持つ新しい`chatAsk()`エンドポイントを追加します。

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

5.  アプリケーションを実行します。
6.  ターミナルで、新しいエンドポイントにPOSTリクエストを送信して結果を確認します。

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

    ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

おめでとうございます！Qdrantに保存されたドキュメントから取得したコンテキストを使用して、OpenAIに接続し質問に回答するKotlinアプリが完成しました。
さまざまなクエリを試したり、他のドキュメントをインポートして、さらに多くの可能性を探ってみてください。

完成したプロジェクトは[Spring AI demo GitHubリポジトリ](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)で表示できます。また、[Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master)で他のSpring AIの例を探索することもできます。