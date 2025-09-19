[//]: # (title: 构建一个使用 Spring AI 的 Kotlin 应用，基于存储在 Qdrant 中的文档来回答问题 — 教程)

在本教程中，你将学习如何构建一个使用 [Spring AI](https://spring.io/projects/spring-ai) 的 Kotlin 应用，该应用能够连接到 LLM，将文档存储到向量数据库中，并使用这些文档中的上下文来回答问题。

在本教程中，你将使用以下工具：

*   [Spring Boot](https://spring.io/projects/spring-boot) 作为配置和运行 Web 应用程序的基础。
*   [Spring AI](https://spring.io/projects/spring-ai) 用于与 LLM 交互并执行基于上下文的检索。
*   [IntelliJ IDEA](https://www.jetbrains.com/idea/) 用于生成项目和实现应用程序逻辑。
*   [Qdrant](https://qdrant.tech/) 作为用于相似性搜索的向量数据库。
*   [Docker](https://www.docker.com/) 用于在本地运行 Qdrant。
*   [OpenAI](https://platform.openai.com) 作为 LLM 提供商。

## 开始之前

1.  下载并安装最新版本的 [IntelliJ IDEA Ultimate Edition](https://www.jetbrains.com/idea/download/index.html)。

    > 如果你使用 IntelliJ IDEA Community Edition 或其他 IDE，你可以使用 [基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin) 来生成 Spring Boot 项目。
    >
    {style="tip"}

2.  在 [OpenAI 平台](https://platform.openai.com/api-keys) 上创建一个 OpenAI API 密钥以访问 API。
3.  安装 [Docker](https://www.docker.com/) 以在本地运行 Qdrant 向量数据库。
4.  安装 Docker 后，打开你的终端并运行以下命令来启动容器：

    ```bash
    docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
    ```

## 创建项目

> 你可以使用 [Spring Boot 基于 Web 的项目生成器](https://start.spring.io/) 作为替代方案来生成你的项目。
>
{style="note"}

在 IntelliJ IDEA Ultimate Edition 中创建一个新的 Spring Boot 项目：

1.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
2.  在左侧面板中，选择 **New Project** | **Spring Boot**。
3.  在 **New Project** 窗口中指定以下字段和选项：

    *   **Name**：springAIDemo
    *   **Language**：Kotlin
    *   **Type**：Gradle - Kotlin

        > 此选项指定了构建系统和 DSL。
        >
        {style="tip"}

    *   **Package name**：com.example.springaidemo
    *   **JDK**：Java JDK

        > 本教程使用 **Oracle OpenJDK version 21.0.1**。如果你没有安装 JDK，可以从下拉列表中下载。
        >
        {style="note"}

    *   **Java**：17

        > 如果你没有安装 Java 17，可以从 JDK 下拉列表中下载。
        >
        {style="tip"}

   ![Create Spring Boot project](create-spring-ai-project.png){width=800}

4.  确保你已指定所有字段，然后点击 **Next**。
5.  在 **Spring Boot** 字段中选择最新的稳定 Spring Boot 版本。

6.  选择本教程所需的以下依赖项：

    *   **Web | Spring Web**
    *   **AI | OpenAI**
    *   **SQL | Qdrant Vector Database**

   ![Set up Spring Boot project](spring-ai-dependencies.png){width=800}

7.  点击 **Create** 生成并设置项目。

    > IDE 将生成并打开一个新项目。下载和导入项目依赖项可能需要一些时间。
    >
    {style="tip"}

之后，你将在 **Project** 视图中看到以下结构：

![Spring Boot project view](spring-ai-project-view.png){width=400}

生成的 Gradle 项目对应于 Maven 的标准目录布局：

*   应用程序的包和类位于 `main/kotlin` 文件夹下。
*   应用程序的入口点是 `SpringAiDemoApplication.kt` 文件的 `main()` 方法。

## 更新项目配置

1.  使用以下内容更新你的 `build.gradle.kts` Gradle 构建文件：

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.spring") version "%kotlinVersion%"
        // 其他插件
    }
   ```

2.  将 `springAiVersion` 设置为 `1.0.0`：

   ```kotlin
   extra["springAiVersion"] = "1.0.0"
   ```

3.  点击 **Sync Gradle Changes** 按钮以同步 Gradle 文件。
4.  使用以下内容更新你的 `src/main/resources/application.properties` 文件：

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

   > 将你的 OpenAI API 密钥设置到 `spring.ai.openai.api-key` 属性。
   >
   {style="note"}

5.  运行 `SpringAiDemoApplication.kt` 文件以启动 Spring Boot 应用程序。运行后，在浏览器中打开 [Qdrant collections](http://localhost:6333/dashboard#/collections) 页面以查看结果：

   ![Qdrant 集合](qdrant-collections.png){width=700}

## 创建控制器以加载和搜索文档

创建一个 Spring `@RestController` 来搜索文档并将它们存储到 Qdrant 集合中：

1.  在 `src/main/kotlin/org/example/springaidemo` 目录中，创建一个名为 `KotlinSTDController.kt` 的新文件，并添加以下代码：

    ```kotlin
    package org.example.springaidemo

    // 导入所需的 Spring 和工具类
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
            // 从 Kotlin 文档加载文档列表
            val kotlinStdTopics = listOf(
                "collections-overview", "constructing-collections", "iterators", "ranges", "sequences",
                "collection-operations", "collection-transformations", "collection-filtering", "collection-plus-minus",
                "collection-grouping", "collection-parts", "collection-elements", "collection-ordering",
                "collection-aggregate", "collection-write", "list-operations", "set-operations",
                "map-operations", "read-standard-input", "opt-in-requirements", "scope-functions", "time-measurement",
            )
            // 文档的基础 URL
            val url = "https://raw.githubusercontent.com/JetBrains/kotlin-web-site/refs/heads/master/docs/topics/"
            // 从 URL 检索每个文档并将其添加到向量存储
            kotlinStdTopics.forEach { topic ->
                val data = restTemplate.getForObject("$url$topic.md", String::class.java)
                data?.let { it ->
                    val doc = Document.builder()
                        // 构建一个带随机 UUID 的文档
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

2.  更新 `SpringAiDemoApplication.kt` 文件以声明一个 `RestTemplate` bean：

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

3.  运行应用程序。
4.  在终端中，向 `/kotlin/load-docs` 端点发送 POST 请求以加载文档：

    ```bash
    curl -X POST http://localhost:8080/kotlin/load-docs
    ```

5.  文档加载后，你可以通过 GET 请求搜索它们：

    ```Bash
    curl -X GET http://localhost:8080/kotlin/docs
    ```

   ![GET request results](spring-ai-get-results.png){width="700"}

> 你也可以在 [Qdrant collections](http://localhost:6333/dashboard#/collections) 页面上查看结果。
>
{style="tip"}

## 实现 AI 聊天端点

文档加载后，最后一步是添加一个端点，该端点通过 Spring AI 的检索增强生成 (RAG) 支持，使用 Qdrant 中的文档来回答问题：

1.  打开 `KotlinSTDController.kt` 文件，并导入以下类：

    ```kotlin
    import org.springframework.ai.chat.client.ChatClient
    import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor
    import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor
    import org.springframework.ai.chat.prompt.Prompt
    import org.springframework.ai.chat.prompt.PromptTemplate
    import org.springframework.web.bind.annotation.RequestBody
    ```

2.  定义一个 `ChatRequest` 数据类：

    ```kotlin
    // 表示聊天查询的请求负载
    data class ChatRequest(val query: String, val topK: Int = 3)
    ```

3.  将 `ChatClient.Builder` 添加到控制器的构造函数形参中：

    ```kotlin
    class KotlinSTDController(
        private val chatClientBuilder: ChatClient.Builder,
        private val restTemplate: RestTemplate,
        private val vectorStore: VectorStore,
    )
    ```

4.  在控制器类内部，创建一个 `ChatClient` 实例：

    ```kotlin
    // 使用简单的日志通知器构建聊天客户端
    private val chatClient = chatClientBuilder.defaultAdvisors(SimpleLoggerAdvisor()).build()
    ```

5.  在你的 `KotlinSTDController.kt` 文件底部，添加一个新的 `chatAsk()` 端点，包含以下逻辑：

    ```kotlin
    @PostMapping("/chat/ask")
    fun chatAsk(@RequestBody request: ChatRequest): String? {
        // 定义带有占位符的提示模板
        val promptTemplate = PromptTemplate(
            """
            {query}.
            Please provide a concise answer based on the "Kotlin standard library" documentation.
        """.trimIndent()
        )

        // 通过将占位符替换为实际值来创建提示
        val prompt: Prompt =
            promptTemplate.create(mapOf("query" to request.query))

        // 配置检索通知器以使用相关文档增强查询
        val retrievalAdvisor = QuestionAnswerAdvisor.builder(vectorStore)
            .searchRequest(
                SearchRequest.builder()
                    .similarityThreshold(0.7)
                    .topK(request.topK)
                    .build()
            )
            .promptTemplate(promptTemplate)
            .build()

        // 将提示发送到带有检索通知器的 LLM 并检索生成的内容
        val response = chatClient.prompt(prompt)
            .advisors(retrievalAdvisor)
            .call()
            .content()
        logger.info("Chat response generated for query: '${request.query}'")
        return response
    }
    ```

6.  运行应用程序。
7.  在终端中，向新端点发送 POST 请求以查看结果：

    ```bash
    curl -X POST "http://localhost:8080/kotlin/chat/ask" \
         -H "Content-Type: application/json" \
         -d '{"query": "What are the performance implications of using lazy sequences in Kotlin for large datasets?", "topK": 3}'
    ```

   ![OpenAI 对聊天请求的回答](open-ai-chat-endpoint.png){width="700"}

恭喜！你现在拥有一个 Kotlin 应用，它能够连接到 OpenAI 并使用从存储在 Qdrant 中的文档中检索到的上下文来回答问题。尝试使用不同的查询或导入其他文档，以探索更多可能性。

你可以在 [Spring AI 演示 GitHub 版本库](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master/projects/spring-ai/springAI-demo) 中查看已完成的项目，或在 [Kotlin AI Examples](https://github.com/Kotlin/Kotlin-AI-Examples/tree/master) 中探索其他 Spring AI 示例。