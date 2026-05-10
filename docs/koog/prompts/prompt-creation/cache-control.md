# Prompt 缓存控制

Prompt 缓存控制允许您指示受支持的 LLM 提供者在服务器端存储 prompt 的一部分，以便后续共享相同前缀的请求可以从缓存中提供服务，而无需重新处理 token。
这可以降低多轮对话、大型系统 prompt 或固定工具定义等重复性工作负载的延迟和成本。

!!! note "Prompt 缓存 vs. 响应缓存"
    Prompt 缓存控制是一个**提供者端 (provider-side)** 功能：提供者存储 prompt 前缀，而不是响应。这与 [`CachedPromptExecutor`](../llm-response-caching.md) 不同，后者在本地存储完整的 LLM 响应，从而使完全相同的 prompt 可以完全跳过网络调用。

Koog 支持 **Anthropic** 和 **Amazon Bedrock** 的 prompt 缓存控制。

## Anthropic

Anthropic 支持两种互补的 prompt 缓存方法。

### 自动缓存（请求级）

在 [`AnthropicParams`](../../llm-parameters.md) 上设置 `cacheControl` 属性并将其传递给您的 prompt。
Anthropic 将自动在请求中最后一个可缓存块处放置缓存断点，而无需您手动为单个消息添加注解。
这是多轮对话的推荐方法。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import ai.koog.prompt.executor.clients.anthropic.AnthropicParams
    import kotlinx.coroutines.runBlocking

    fun main() = runBlocking {
        val client = AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY"))
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    // 启用自动缓存，使用默认的 5 分钟 TTL
    val params = AnthropicParams(cacheControl = AnthropicCacheControl.Default)

    val prompt = prompt("assistant", params = params) {
        system("You are a helpful assistant with a very long system prompt...")
        user("What can you help me with?")
    }

    val response = client.execute(prompt, AnthropicModels.Sonnet_4)
    println(response)
    ```
    <!--- KNIT example-cache-control-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 启用自动缓存，使用默认的 5 分钟 TTL
    AnthropicParams params = new AnthropicParams(
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null,
        AnthropicCacheControl.Default.INSTANCE
    );

    Prompt prompt = Prompt.builder("assistant")
        .system("You are a helpful assistant with a very long system prompt...")
        .user("What can you help me with?")
        .build()
        .withParams(params);
    ```
    <!--- KNIT example-cache-control-java-01.java -->

### 手动缓存（块级）

为单个消息或工具定义附加 `cacheControl` 实参，以便在特定位置放置缓存断点。到被注解块（含该块）为止的所有内容都符合缓存条件。

#### 系统消息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import kotlinx.coroutines.runBlocking

    fun main() = runBlocking {
        val client = AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY"))
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("assistant") {
        // 将系统 prompt 缓存 1 小时
        system("You are a knowledgeable assistant...", AnthropicCacheControl.OneHour)
        user("Summarize the latest AI research.")
    }

    val response = client.execute(prompt, AnthropicModels.Sonnet_4)
    println(response)
    ```
    <!--- KNIT example-cache-control-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("assistant")
        // 将系统 prompt 缓存 1 小时
        .system("You are a knowledgeable assistant...", AnthropicCacheControl.OneHour.INSTANCE)
        .user("Summarize the latest AI research.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-02.java -->

#### 用户和助手消息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import ai.koog.prompt.message.ContentPart
    import kotlinx.coroutines.runBlocking

    fun main() = runBlocking {
        val client = AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY"))
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("conversation") {
        system("You are a helpful assistant.")
        // 在大型用户消息（例如文档内容）后进行缓存
        user(listOf(ContentPart.Text("Here is a long document: ...")), AnthropicCacheControl.Default)
        assistant("I have read the document.", AnthropicCacheControl.Default)
        user("Summarize it.")
    }

    val response = client.execute(prompt, AnthropicModels.Sonnet_4)
    println(response)
    ```
    <!--- KNIT example-cache-control-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("conversation")
        .system("You are a helpful assistant.")
        // 在大型用户消息（例如文档内容）后进行缓存
        .user(List.of(new ContentPart.Text("Here is a long document: ...")), AnthropicCacheControl.Default.INSTANCE)
        .assistant("I have read the document.", AnthropicCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-03.java -->

#### 工具定义

当工具列表在许多请求中固定不变时，缓存最后一个工具定义意味着所有工具架构都会被一起缓存。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolDescriptor
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    -->

    ```kotlin
    val searchTool = ToolDescriptor(
        name = "web_search",
        description = "Search the web for information.",
        requiredParameters = listOf(
            ToolParameterDescriptor("query", "Search query", ToolParameterType.String)
        ),
        // 缓存到此为止（含此项）的所有工具定义
        cacheControl = AnthropicCacheControl.Default
    )
    ```
    <!--- KNIT example-cache-control-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ToolDescriptor searchTool = new ToolDescriptor(
        "web_search",
        "Search the web for information.",
        List.of(
            new ToolParameterDescriptor("query", "Search query", ToolParameterType.String.INSTANCE)
        ),
        Collections.emptyList(),
        // 缓存到此为止（含此项）的所有工具定义
        AnthropicCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-04.java -->

### 缓存 TTL 选项

| 选项 | TTL | 价格乘数 |
|-------------------------------|----------|-------------------------|
| `AnthropicCacheControl.Default` | 5 分钟 | 1.25× 基础输入价格 |
| `AnthropicCacheControl.OneHour` | 1 小时 | 2× 基础输入价格 |

缓存写入的费用高于常规输入 token，但缓存读取的费用更低。有关当前定价，请参阅 [Anthropic prompt 缓存文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)。

### 监控缓存用量

Anthropic 在响应用量中报告缓存统计数据。这些数据可通过原始 API 响应访问，并可通过跟踪或日志记录功能进行观察。

| 字段 | 含义 |
|-----------------------------|------------------------------------------------------|
| `cacheReadInputTokens` | 从现有缓存条目中读取的 token 数 |
| `cacheCreationInputTokens` | 写入新缓存条目的 token 数 |

### 结合自动缓存与块级缓存

两种模式可以同时使用。块级 `cacheControl` 标记可让您对断点位置进行细粒度控制，而 `AnthropicParams` 中的请求级 `cacheControl` 则自动处理对话的尾部。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicParams
    -->

    ```kotlin
    // 块级：将系统 prompt 固定在 1 小时缓存层级中
    // 自动：让 Anthropic 管理对话尾部的断点
    val params = AnthropicParams(cacheControl = AnthropicCacheControl.Default)

    val prompt = prompt("combined", params = params) {
        system("You are a helpful assistant...", AnthropicCacheControl.OneHour)
        user("Hello!")
    }
    ```
    <!--- KNIT example-cache-control-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 块级：将系统 prompt 固定在 1 小时缓存层级中
    // 自动：让 Anthropic 管理对话尾部的断点
    AnthropicParams params = new AnthropicParams(
        AnthropicCacheControl.Default.INSTANCE
    );

    Prompt prompt = Prompt.builder("combined")
        .system("You are a helpful assistant...", AnthropicCacheControl.OneHour.INSTANCE)
        .user("Hello!")
        .build()
        .withParams(params);
    ```
    <!--- KNIT example-cache-control-java-05.java -->

---

## Amazon Bedrock

Amazon Bedrock 通过 Converse API 使用块级缓存模型。当在消息或工具上设置 `cacheControl` 时，Bedrock 会在被注解的元素之后立即插入一个 `CachePoint` 块。

!!! note
    Bedrock prompt 缓存是仅限 JVM 的功能，因为 Bedrock 客户端本身仅支持 JVM。

### 系统消息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.bedrock.BedrockCacheControl
    import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
    import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import ai.koog.prompt.executor.clients.bedrock.BedrockRegions
    import ai.koog.prompt.executor.clients.bedrock.StaticBearerTokenProvider
    import kotlinx.coroutines.runBlocking
    
    fun main() = runBlocking {
        val client = BedrockLLMClient(
            identityProvider = StaticBearerTokenProvider(token = "test-token"),
            settings = BedrockClientSettings(region = BedrockRegions.US_EAST_1.regionCode),
        )
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("assistant") {
        // 使用默认 TTL 缓存系统 prompt
        system("You are a knowledgeable assistant...", BedrockCacheControl.Default)
        user("What is prompt caching?")
    }

    val response = client.execute(prompt, BedrockModels.AnthropicClaude4Sonnet)
    println(response)
    ```
    <!--- KNIT example-cache-control-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("assistant")
        // 使用默认 TTL 缓存系统 prompt
        .system("You are a knowledgeable assistant...", BedrockCacheControl.Default.INSTANCE)
        .user("What is prompt caching?")
        .build();
    ```
    <!--- KNIT example-cache-control-java-06.java -->

### 用户和助手消息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.bedrock.BedrockCacheControl
    import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
    import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import ai.koog.prompt.executor.clients.bedrock.BedrockRegions
    import ai.koog.prompt.executor.clients.bedrock.StaticBearerTokenProvider
    import kotlinx.coroutines.runBlocking
    
    fun main() = runBlocking {
        val client = BedrockLLMClient(
            identityProvider = StaticBearerTokenProvider(token = "test-token"),
            settings = BedrockClientSettings(region = BedrockRegions.US_EAST_1.regionCode),
        )
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("conversation") {
        system("You are a helpful assistant.")
        // 在大型上下文消息后进行缓存
        user("Here is the document: ...", BedrockCacheControl.FiveMinutes)
        assistant("I have read the document.", BedrockCacheControl.Default)
        user("Summarize it.")
    }

    val response = client.execute(prompt, BedrockModels.AnthropicClaude4Sonnet)
    println(response)
    ```
    <!--- KNIT example-cache-control-07.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("conversation")
        .system("You are a helpful assistant.")
        // 在大型上下文消息后进行缓存
        .user("Here is the document: ...", BedrockCacheControl.FiveMinutes.INSTANCE)
        .assistant("I have read the document.", BedrockCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-07.java -->

### 工具定义

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolDescriptor
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.prompt.executor.clients.bedrock.BedrockCacheControl
    -->

    ```kotlin
    val searchTool = ToolDescriptor(
        name = "web_search",
        description = "Search the web for information.",
        requiredParameters = listOf(
            ToolParameterDescriptor("query", "Search query", ToolParameterType.String)
        ),
        // 缓存到此为止（含此项）的所有工具定义
        cacheControl = BedrockCacheControl.Default
    )
    ```
    <!--- KNIT example-cache-control-08.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ToolDescriptor searchTool = new ToolDescriptor(
        "web_search",
        "Search the web for information.",
        List.of(
            new ToolParameterDescriptor("query", "Search query", ToolParameterType.String.INSTANCE)
        ),
        Collections.emptyList(),
        // 缓存到此为止（含此项）的所有工具定义
        BedrockCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-08.java -->

### 缓存 TTL 选项

| 选项 | TTL |
|--------------------------------|-----------|
| `BedrockCacheControl.Default` | 提供者默认值（不发送显式 TTL） |
| `BedrockCacheControl.FiveMinutes` | 5 分钟 |
| `BedrockCacheControl.OneHour` | 1 小时 |

有关支持的模型和定价，请参阅 [Amazon Bedrock prompt 缓存文档](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)。

---

## 选择缓存策略

| 情况 | 推荐方法 |
|---------------------------------------------------|-------------------------------------------------------------|
| 具有大型固定系统 prompt 的多轮聊天 | Anthropic 自动缓存或 Bedrock 系统级块级缓存 |
| 在请求中重复使用的稳定工具定义 | 在最后一个工具定义上使用块级 `cacheControl` |
| 作为用户上下文传递的长文档 | 在用户消息上使用块级 `cacheControl` |
| 任意多轮对话 (Anthropic) | 通过 `AnthropicParams.cacheControl` 进行自动缓存 |
| 需要 1 小时缓存保留 | `AnthropicCacheControl.OneHour` / `BedrockCacheControl.OneHour` |