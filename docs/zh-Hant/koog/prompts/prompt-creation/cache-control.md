# Prompt 快取控制

Prompt 快取控制可讓您指示支援的 LLM 提供者在伺服器端儲存 Prompt 的一部分，以便共用相同前綴的後續請求可以從快取中提供服務，而不是重新處理 Token。
這可以降低多輪對話、大型系統 Prompt 或固定工具定義等重複工作負載的延遲和成本。

!!! note "Prompt 快取 vs. 回應快取"
    Prompt 快取控制是一項 **提供者端 (provider-side)** 的功能：提供者儲存的是 Prompt 前綴，而非回應。這與 [`CachedPromptExecutor`](../llm-response-caching.md) 不同，後者是在本機儲存完整的 LLM 回應，以便相同的 Prompt 可以完全跳過網路呼叫。

Koog 支援 **Anthropic** 和 **Amazon Bedrock** 的 Prompt 快取控制。

## Anthropic

Anthropic 支援兩種互補的 Prompt 快取方法。

### 自動快取 (請求層級)

在 [`AnthropicParams`](../../llm-parameters.md) 上設定 `cacheControl` 屬性，並將其傳遞給您的 Prompt。
Anthropic 會自動將快取中斷點放置在請求中最後一個可快取的區塊，您無需手動為個別訊息標註。
這是多輪對話的建議做法。

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
    // 啟用預設 5 分鐘 TTL 的自動快取
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
    // 啟用預設 5 分鐘 TTL 的自動快取
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

### 手動快取 (區塊層級)

將 `cacheControl` 引數附加到個別訊息或工具定義中，以將快取中斷點放置在特定位置。到該標註區塊為止（包含該區塊）的所有內容皆符合快取資格。

#### 系統訊息

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
        // 將系統 Prompt 快取 1 小時
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
        // 將系統 Prompt 快取 1 小時
        .system("You are a knowledgeable assistant...", AnthropicCacheControl.OneHour.INSTANCE)
        .user("Summarize the latest AI research.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-02.java -->

#### 使用者與助手訊息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
    import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
    import ai.koog.prompt.message.MessagePart
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
        // 在大型使用者訊息（例如：文件內容）之後進行快取
        user(listOf(MessagePart.Text("Here is a long document: ...", cacheControl = AnthropicCacheControl.Default)))
        assistant(listOf(MessagePart.Text("I have read the document.")))
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
        // 在大型使用者訊息（例如：文件內容）之後進行快取
        .user(List.of(new ContentPart.Text("Here is a long document: ...")), AnthropicCacheControl.Default.INSTANCE)
        .assistant("I have read the document.", AnthropicCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-03.java -->

#### 工具定義

當工具列表在多個請求中保持不變時，快取最後一個工具定義意味著所有工具結構 (schema) 都會被一起快取。

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
        // 快取到此工具定義為止（包含此定義）的所有工具定義
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
        // 快取到此工具定義為止（包含此定義）的所有工具定義
        AnthropicCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-04.java -->

### 快取 TTL 選項

| 選項 | TTL | 價格倍率 |
|-------------------------------|----------|-------------------------|
| `AnthropicCacheControl.Default` | 5 分鐘 | 1.25× 基礎輸入價格 |
| `AnthropicCacheControl.OneHour` | 1 小時 | 2× 基礎輸入價格 |

快取寫入的費用高於一般輸入 Token，但快取讀取更便宜。請參閱 [Anthropic Prompt 快取文件](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) 以瞭解最新定價。

### 監控快取使用情況

Anthropic 在回應的使用情況 (usage) 中回報快取統計資訊。這些資訊可透過原始 API 回應存取，並可透過追蹤或記錄功能進行觀察。

| 欄位 | 意義 |
|-----------------------------|------------------------------------------------------|
| `cacheReadInputTokens` | 從現有快取項目中讀取的 Token 數量 |
| `cacheCreationInputTokens` | 寫入新快取項目的 Token 數量 |

### 結合自動快取與區塊層級快取

這兩種模式可以同時使用。區塊層級的 `cacheControl` 標記可讓您精細控制中斷點位置，而 `AnthropicParams` 中的請求層級 `cacheControl` 則會自動處理對話的尾端。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicParams
    -->

    ```kotlin
    // 區塊層級：將系統 Prompt 固定在 1 小時快取層級
    // 自動：讓 Anthropic 管理對話尾端的中斷點
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
    // 區塊層級：將系統 Prompt 固定在 1 小時快取層級
    // 自動：讓 Anthropic 管理對話尾端的中斷點
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

Amazon Bedrock 透過 Converse API 使用區塊層級快取模型。
當在訊息或工具上設定 `cacheControl` 時，Bedrock 會在被標註的元素之後立即插入一個 `CachePoint` 區塊。

!!! note
    Bedrock Prompt 快取是僅限 JVM 的功能，因為 Bedrock 用戶端本身僅限 JVM 使用。

### 系統訊息

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
        // 使用預設 TTL 快取系統 Prompt
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
        // 使用預設 TTL 快取系統 Prompt
        .system("You are a knowledgeable assistant...", BedrockCacheControl.Default.INSTANCE)
        .user("What is prompt caching?")
        .build();
    ```
    <!--- KNIT example-cache-control-java-06.java -->

### 使用者與助手訊息

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.bedrock.BedrockCacheControl
    import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
    import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
    import ai.koog.prompt.executor.clients.bedrock.BedrockModels
    import ai.koog.prompt.executor.clients.bedrock.BedrockRegions
    import ai.koog.prompt.executor.clients.bedrock.StaticBearerTokenProvider
    import ai.koog.prompt.message.MessagePart
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
        // 在大型內容訊息之後進行快取
        user("Here is the document: ...", BedrockCacheControl.FiveMinutes)
        assistant(listOf(MessagePart.Text("I have read the document.")))
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
        // 在大型內容訊息之後進行快取
        .user("Here is the document: ...", BedrockCacheControl.FiveMinutes.INSTANCE)
        .assistant("I have read the document.", BedrockCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-07.java -->

### 工具定義

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
        // 快取到此工具定義為止（包含此定義）的所有工具定義
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
        // 快取到此工具定義為止（包含此定義）的所有工具定義
        BedrockCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-08.java -->

### 快取 TTL 選項

| 選項 | TTL |
|--------------------------------|-----------|
| `BedrockCacheControl.Default` | 提供者預設值（不傳送明確的 TTL） |
| `BedrockCacheControl.FiveMinutes` | 5 分鐘 |
| `BedrockCacheControl.OneHour` | 1 小時 |

請參閱 [Amazon Bedrock Prompt 快取文件](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html) 以瞭解支援的模型與定價。

---

## 選擇快取策略

| 情境 | 建議做法 |
|---------------------------------------------------|-------------------------------------------------------------|
| 具有大型固定系統 Prompt 的多輪聊天 | Anthropic 自動快取或 Bedrock 在系統訊息上的區塊層級快取 |
| 在請求之間重複使用的穩定工具定義 | 在最後一個工具定義上設定區塊層級 `cacheControl` |
| 作為使用者內容傳遞的長文件 | 在使用者訊息上設定區塊層級 `cacheControl` |
| 任意多輪對話 (Anthropic) | 透過 `AnthropicParams.cacheControl` 進行自動快取 |
| 需要 1 小時的快取保留時間 | `AnthropicCacheControl.OneHour` / `BedrockCacheControl.OneHour` |