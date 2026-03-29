# 检索增强生成 (RAG)

Koog 提供了检索增强生成 (RAG) 的构建块：嵌入文本、存储嵌入文档以及为查询检索最相关的结果。

本页重点介绍当前 `rag` 模块中的可用功能以及如何使用它们。

## Koog 当前提供的功能

当前的 RAG 支持分为两个模块：

- `rag-base`: 检索、存储、搜索请求、过滤以及文件/文档提供程序的通用抽象
- `rag-vector`: 将文档嵌入与矢量存储相结合的本地实现

## 使用 EmbeddingStorage 嵌入和检索文档

最完整的开箱即用 RAG 流程使用了 `rag-vector` 模块中的 `EmbeddingStorage`。它将 `DocumentEmbedder`（将文档转换为矢量）与 `VectorStorageBackend`（持久化矢量）结合在一起。

步骤如下：

1. 创建一个由嵌入模型（Ollama 或 OpenAI）支持的 `Embedder`。
2. 创建一个读取文件内容并委托给嵌入器的 `JVMTextDocumentEmbedder`。
3. 创建一个带有内存中或基于文件的后端的 `EmbeddingStorage`。
4. 使用 `add()` 添加文档。
5. 使用 `search(SimilaritySearchRequest(...))` 进行搜索。

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
    // 1. 创建一个由本地 Ollama 模型支持的嵌入器
    val embedder = LLMEmbedder(
        client = OllamaClient(),
        model = OllamaModels.Embeddings.NOMIC_EMBED_TEXT
    )

    // 2. 创建一个读取文件并嵌入其文本的 JVM 文档嵌入器
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)

    // 3. 创建一个带有内存中后端的 EmbeddingStorage
    val storage = EmbeddingStorage(
        embedder = documentEmbedder,
        storage = InMemoryVectorStorageBackend()
    )

    // 4. 将文档添加到存储中
    storage.add(
        listOf(
            Path.of("./docs/faq.txt"),
            Path.of("./docs/pricing.txt"),
            Path.of("./docs/getting-started.txt")
        )
    )

    // 5. 搜索最相关的文档
    val results = storage.search(
        SimilaritySearchRequest(
            queryText = "如何重置密码？",
            limit = 3,
            minScore = 0.5
        )
    )

    results.forEach { result ->
        println("${result.document} (评分: ${result.score.value})")
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

## 将相关性搜索作为智能体工具提供（在智能体 RAG 中）

与其预先将所有检索到的文档注入到提示词中，您可以将 RAG 存储公开为智能体根据需要调用的工具。这使智能体能够控制何时搜索以及搜索什么内容。

下面的示例将 `SearchStorage`（`EmbeddingStorage` 实现的基础搜索接口）包装在一个带有 `@Tool` 和 `@LLMDescription` 注解的函数中，然后将其注册到 `ToolRegistry` 中供智能体使用。

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

    // 创建 RAG 存储
    val embedder = LLMEmbedder(OllamaClient(), OllamaModels.Embeddings.NOMIC_EMBED_TEXT)
    val documentEmbedder = JVMTextDocumentEmbedder(embedder)
    val ragStorage: SearchStorage<Path, SimilaritySearchRequest> = EmbeddingStorage(documentEmbedder, InMemoryVectorStorageBackend())

    const val apiKey = "apikey"
    -->
    <!--- SUFFIX
    -->
    ```kotlin
    // 定义一个搜索 RAG 存储的工具
    @Tool
    @LLMDescription("在知识库中搜索与查询相关的文档。返回最相关文档的内容。")
    suspend fun searchKnowledgeBase(
        @LLMDescription("描述您所需信息的搜索查询")
        query: String,
        @LLMDescription("要返回的最大文档数量")
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
            return "未找到与以下内容相关的文档：$query"
        }

        val response = StringBuilder("找到 ${results.size} 份相关文档：
\n")
        results.forEachIndexed { index, result ->
            val content = Files.readString(result.document)
            response.append("文档 ${index + 1}: ${result.document.fileName}")
            response.append(" (评分: ${"%.2f".format(result.score.value)})
")
            response.append("内容: $content
\n")
        }
        return response.toString()
    }

    fun main() {
        runBlocking {
            // 注册搜索工具并创建一个智能体
            val tools = ToolRegistry {
                tool(::searchKnowledgeBase.asTool())
            }

            val agent = AIAgent(
                toolRegistry = tools,
                promptExecutor = simpleOpenAIExecutor(apiKey),
                llmModel = OpenAIModels.Chat.GPT4o
            )

            val response = agent.run("你们的退款政策是什么？")
            println("智能体响应: $response")
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

通过这种方法，智能体会根据用户的查询决定何时调用搜索工具。当智能体处理各种各样的请求，且只有其中一部分需要查询知识库时，这种方式非常有用。

## 可用实现

### 矢量存储后端

- `InMemoryVectorStorageBackend`: 在内存中存储矢量；适用于测试和原型设计
- `FileVectorStorageBackend`: 将矢量持久化到磁盘，以便在重启后保持耐用性
- `JVMFileVectorStorageBackend`: 使用 `java.nio.file.Path` 的 JVM 特定文件型后端

### 文档嵌入器

- `TextDocumentEmbedder`: 通用的文档到文本嵌入器，由文档和路径类型参数化
- `JVMTextDocumentEmbedder`: 从 `java.nio.file.Path` 读取文件的 JVM 特定嵌入器

### 组合存储实现

- `EmbeddingStorage`: 将任何 `DocumentEmbedder` 与任何 `VectorStorageBackend` 组合
- `InMemoryDocumentEmbeddingStorage`: `EmbeddingStorage` + `InMemoryVectorStorageBackend` 的便捷快捷方式
- `FileDocumentEmbeddingStorage`: `EmbeddingStorage` + `FileVectorStorageBackend` 的便捷快捷方式
- `JVMFileDocumentEmbeddingStorage`: JVM 基于文件的嵌入存储
- `TextFileDocumentEmbeddingStorage`: 文本文档的基于文件的存储
- `JVMFileEmbeddingStorage`: 文本文档的 JVM 基于文件的存储

## 当前限制

内置流程对于本地和参考实现很有用，但它还不是一个完整的生产级 RAG 平台。

重要的限制包括：

- 内置实现仅支持相似度搜索
- `rag` 模块中没有内置的分块流水线
- 富元数据的生产级记录建模仍然有限
- 当前 `rag` 模块未提供生产级矢量数据库集成（Pinecone、Weaviate、pgvector、Milvus）

如果您正在构建自定义后端，请从 `rag-base` 抽象开始并实现您自己的存储适配器。

## 选择从哪里开始

在以下情况下使用 `rag-vector`：

- 您想要一个本地 RAG 原型
- 您想要一个简单的参考实现
- 您想在 Koog 内部试验嵌入和检索流程

在以下情况下使用 `rag-base`：

- 您正在构建自己的存储后端
- 您想集成外部矢量数据库
- 您想在另一个 Koog 模块中重用这些抽象

## 另请参阅

- [嵌入](embeddings.md)