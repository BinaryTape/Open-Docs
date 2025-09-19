[//]: # (title: Qdrantに保存されたドキュメントを基に質問に回答するSpring AIを活用したKotlinアプリの構築 — チュートリアル)

このチュートリアルでは、[Spring AI](https://spring.io/projects/spring-ai) を使用してLLMに接続し、ドキュメントをベクトルデータベースに保存し、それらのドキュメントのコンテキストを使用して質問に回答するKotlinアプリの構築方法を学びます。

このチュートリアルでは、以下のツールを使用します:

*   Webアプリケーションの設定と実行の基盤として[Spring Boot](https://spring.io/projects/spring-boot)。
*   LLMとのインタラクションおよびコンテキストベースの検索のために[Spring AI](https://spring.io/projects/spring-ai)。
*   プロジェクトの生成とアプリケーションロジックの実装のために[IntelliJ IDEA](https://www.jetbrains.com/idea/)。
*   類似性検索のためのベクトルデータベースとして[Qdrant](https://qdrant.tech/)。
*   Qdrantをローカルで実行するために[Docker](https://www.docker.com/)。
*   LLMプロバイダーとして[OpenAI](https://platform.openai.com)。

## 開始する前に

1.  [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールします。

    > IntelliJ IDEA Community Edition または別のIDEを使用している場合は、[Webベースのプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) を使用してSpring Bootプロジェクトを生成できます。
    >
    {style="tip"}

2.  APIにアクセスするために、[OpenAIプラットフォーム](https://platform.openai.com/api-keys) でOpenAI APIキーを作成します。
3.  Qdrantベクトルデータベースをローカルで実行するために[Docker](https://www.docker.com/) をインストールします。
4.  Dockerのインストール後、ターミナルを開き、以下のコマンドを実行してコンテナを起動します:

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## プロジェクトを作成する

> 代替手段として、[Spring BootのWebベースプロジェクトジェネレーター](https://start.spring.io/) を使用してプロジェクトを生成することもできます。
>
{style="note"}

IntelliJ IDEA Ultimate Editionで新しいSpring Bootプロジェクトを作成します:

1.  IntelliJ IDEAで、**File** | **New** | **Project** を選択します。
2.  左側のパネルで、**New Project** | **Spring Boot** を選択します。
3.  **New Project** ウィンドウで以下のフィールドとオプションを指定します:

    *   **Name**: `springAIDemo`
    *   **Language**: `Kotlin`
    *   **Type**: `Gradle - Kotlin`

        > このオプションはビルドシステムとDSLを指定します。
        >
        {style="tip"}

    *   **Package name**: `com.example.springaidemo`
    *   **JDK**: `Java JDK`

        > このチュートリアルでは、**Oracle OpenJDK バージョン 21.0.1** を使用しています。JDKがインストールされていない場合は、ドロップダウンリストからダウンロードできます。
        >
        {style="note"}

    *   **Java**: `17`

        > Java 17がインストールされていない場合は、JDKドロップダウンリストからダウンロードできます。
        >
        {style="tip"}

    ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  すべてのフィールドを指定したことを確認し、**Next** をクリックします。
5.  **Spring Boot** フィールドで最新の安定版Spring Bootバージョンを選択します。

6.  このチュートリアルに必要な以下の依存関係を選択します:

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant Vector Database**

    ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  **Create** をクリックしてプロジェクトを生成および設定します。

    > IDEが新しいプロジェクトを生成して開きます。プロジェクトの依存関係のダウンロードとインポートには時間がかかる場合があります。
    >
    {style="tip"}

これを行うと、**Project view** に以下の構造が表示されます:

![Spring Boot project view](spring-ai-project-view.png){width=400}

生成されたGradleプロジェクトは、Mavenの標準ディレクトリレイアウトに対応しています:

*   アプリケーションに属するパッケージとクラスは`main/kotlin`フォルダの下にあります。
*   アプリケーションのエントリポイントは、`SpringAiDemoApplication.kt`ファイルの`main()`メソッドです。

## プロジェクト設定を更新する

1.  `build.gradle.kts` Gradleビルドファイルを次のように更新します:

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // Rest of the plugins
    }
    ```

2.  `springAiVersion`を`1.0.0`に設定します:

    ```kotlin
    extra["springAiVersion"] = "1.0.0"
    ```

3.  **Sync Gradle Changes** ボタンをクリックしてGradleファイルを同期します。
4.  `src/main/resources/application.properties`ファイルを次のように更新します:

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

    > OpenAI APIキーを`spring.ai.openai.api-key`プロパティに設定します。
    >
    {style="note"}

5.  `SpringAiDemoApplication.kt`ファイルを実行してSpring Bootアプリケーションを開始します。実行後、ブラウザで[Qdrant collections](http://localhost:6333/dashboard#/collections) ページを開いて結果を確認します:

    ![Qdrant collections](qdrant-collections.png){width=700}

## ドキュメントをロードして検索するコントローラーを作成する

ドキュメントを検索し、Qdrantコレクションに保存するためのSpring `@RestController` を作成します:

1.  `src/main/kotlin/org/example/springaidemo`ディレクトリに、`KotlinSTDController.kt`という新しいファイルを作成し、以下のコードを追加します:

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

2.  `SpringAiDemoApplication.kt`ファイルを更新し、`RestTemplate` beanを宣言します:

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
4.  ターミナルで、`/kotlin/load-docs`エンドポイントにPOSTリクエストを送信してドキュメントをロードします:

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  ドキュメントがロードされたら、GETリクエストで検索できます:

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

    ![GET request results](spring-ai-get-results.png){width="700"}

> 結果は[Qdrant collections](http://localhost:6333/dashboard#/collections) ページでも確認できます。
>
{style="tip"}

## AIチャットエンドポイントを実装する

ドキュメントがロードされたら、最後のステップは、Spring AIのRetrieval-Augmented Generation（RAG）サポートを介してQdrant内のドキュメントを使用して質問に回答するエンドポイントを追加することです:

1.  `KotlinSTDController.kt`ファイルを開き、以下のクラスをインポートします:

    ```kotlin
    import org.springframework.ai.chat.client.ChatClient
    import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
    import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor
    import org.springframework.ai.chat.prompt.Prompt
    import org.springframework.ai.chat.prompt.PromptTemplate
    import org.springframework.web.bind.annotation.RequestBody
    ```

2.  `ChatRequest`データクラスを定義します:

    ```kotlin
    // Represents the request payload for chat queries
    data class ChatRequest(val query: String, val topK: Int = 3)
    ```

3.  コントローラーのコンストラクタパラメータに`ChatClient.Builder`を追加します:

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

4.  コントローラークラス内で、`ChatClient`インスタンスを作成します:

    ```kotlin
    // Builds the chat client with a simple logging advisor
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    ```

5.  `KotlinSTDController.kt`ファイルの最後に、以下のロジックを持つ新しい`chatAsk()`エンドポイントを追加します:

    ```kotlin
    @PostMapping("/chat/ask")
    fun chatAsk(@RequestBody request: ChatRequest): String? {
        // Defines the prompt template with placeholders
        val promptTemplate = PromptTemplate(
            """
            {query}.
            Please provide a concise answer based on the "Kotlin standard library" documentation.
        """.trimIndent()
        )

        // Creates the prompt by substituting placeholders with actual values
        val prompt: Prompt =
            promptTemplate.create(mapOf("query" to request.query))

        // Configures the retrieval advisor to augment the query with relevant documents
        val retrievalAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
            .searchRequest(
                SearchRequest.builder()
                    .similarityThreshold(0.7)
                    .topK(request.topK)
                    .build()
            )
            .promptTemplate(promptTemplate)
            .build()

        // Sends the prompt to the LLM with the retrieval advisor and retrieves the generated content
        val response = chatClient.prompt(prompt)
            .advisors(retrievalAdvisor)
            .call()
            .content()
        logger.info("Chat response generated for query: '${request.query}'")
        return response
    }
    ```

6.  アプリケーションを実行します。
7.  ターミナルで、新しいエンドポイントにPOSTリクエストを送信して結果を確認します:

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

    ![OpenAI answer to chat request](open-ai-chat-endpoint.png){width="700"}

おめでとうございます！これで、OpenAIに接続し、Qdrantに保存されたドキュメントから取得したコンテキストを使用して質問に回答するKotlinアプリができました。
さまざまなクエリを試したり、他のドキュメントをインポートして、さらに多くの可能性を探ってみてください。

完成したプロジェクトは[Spring AI demo GitHubリポジトリ](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo)で確認できるほか、[Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master)で他のSpring AIの例を探索することもできます。