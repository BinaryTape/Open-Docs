# HTTP 用戶端

Koog 中的每個 LLM 用戶端都需要一個 [`KoogHttpClient`](api:http-client-core::ai.koog.http.client.KoogHttpClient) — 這是該架構用於與提供者通訊的抽象 HTTP 合約。您在建構時需傳入一個實例。

您可以自行實作 `KoogHttpClient`，但這是一項繁重的工作：每個提供者都有其專屬的基礎 URL、認證標頭格式、content-type 以及 SSE 慣例。確保每個提供者的這些細節都正確無誤，正是 [`KoogHttpClient.Factory`](api:http-client-core::ai.koog.http.client.KoogHttpClient.Factory) 存在的目的，旨在減輕您的負擔。您只需傳入一個 `Factory`，提供者用戶端便會根據其 API 所需的參數呼叫 `Factory.create(...)`。

現有的四個後端工廠提供開箱即用的支援 — Ktor、JDK `HttpClient`、OkHttp 以及 Spring 的 `WebClient` — 且您也可以實作自己的工廠。

## 運作方式

同一個工廠可用於任何提供者：只需選擇一次後端，即可在各個用戶端之間共用。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.http.client.ktor.KtorKoogHttpClient
    import ai.koog.prompt.executor.clients.anthropic.AnthropicClientSettings
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
    import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings
    import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
    -->
    ```kotlin
    fun main() {
        val factory = KtorKoogHttpClient.Factory()

        val openai = OpenAILLMClient(
            apiKey = System.getenv("OPENAI_API_KEY"),
            settings = OpenAIClientSettings(),
            httpClientFactory = factory,
        )

        val anthropic = AnthropicLLMClient(
            apiKey = System.getenv("ANTHROPIC_API_KEY"),
            settings = AnthropicClientSettings(),
            httpClientFactory = factory,
        )
    }
    ```
    <!--- KNIT example-http-clients-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.http.client.ktor.KtorKoogHttpClient;
    import ai.koog.prompt.executor.clients.anthropic.AnthropicClientSettings;
    import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient;
    import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings;
    import ai.koog.prompt.executor.clients.openai.OpenAILLMClient;

    KtorKoogHttpClient.Factory factory = new KtorKoogHttpClient.Factory();

    OpenAILLMClient openai = new OpenAILLMClient(
        System.getenv("OPENAI_API_KEY"),
        new OpenAIClientSettings(),
        factory
    );

    AnthropicLLMClient anthropic = new AnthropicLLMClient(
        System.getenv("ANTHROPIC_API_KEY"),
        new AnthropicClientSettings(),
        factory
    );
    ```
    <!--- KNIT example-http-clients-java-01.java -->

## 支援的 HTTP 用戶端類型

| 模組 | 說明 |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [`http-client-ktor`](api:http-client-ktor::)                            | 唯一可用於非 JVM 目標的後端。 |
| [`http-client-java`](api:http-client-java::)                            | 包裝了 JDK 11+ 的 `java.net.http.HttpClient`。 |
| [`http-client-okhttp`](api:http-client-okhttp::)                        | 由 OkHttp 提供支援。對 Android 友善。 |
| [`http-client-spring-webclient`](api:http-client-spring-webclient::)    | 由 Spring `WebClient` 提供支援。 |

## 便利的 API 與工廠自動探索

在 JVM 和 Android 上，您可以直接建構每個 LLM 用戶端，而無需明確傳入工廠。

在幕後，[`HttpClientFactoryResolver`](api:http-client-core::ai.koog.http.client.HttpClientFactoryResolver) 會使用 `java.util.ServiceLoader` 從執行時 classpath 中解析 `KoogHttpClient.Factory`：

- 每個後端模組都提供了一個 `ServiceLoader` 註冊。
- 只有當執行時 classpath 上恰好有一個可見的工廠時，解析才會成功。
- `prompt-executor-llms-all` 將 `http-client-ktor` 宣告為 `runtimeOnly` 相依性，因此預設情況下您會獲得 Ktor，而無需在編譯時暴露該模組。
- `simple<Provider>Executor(apiKey)` 與 `PromptExecutorBuilder.<provider>(apiKey)` 使用相同的解析路徑。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    fun main() {
        val apiKey = System.getenv("OPENAI_API_KEY")

        val client = OpenAILLMClient(apiKey)
        val executor = simpleOpenAIExecutor(apiKey)
    }
    ```
    <!--- KNIT example-http-clients-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import static ai.koog.prompt.executor.clients.openai.OpenAIClientFactory.openAIClient;
    import static ai.koog.prompt.executor.llms.all.SimplePromptExecutors.simpleOpenAIExecutor;

    String apiKey = System.getenv("OPENAI_API_KEY");

    OpenAILLMClient client = openAIClient(apiKey);
    PromptExecutor executor = simpleOpenAIExecutor(apiKey);
    ```
    <!--- KNIT example-http-clients-java-02.java -->

目前 KMP 尚不支援自動探索，因此在 JVM 之外也無法使用這些便利方法。在 `commonMain` 中，請明確傳入一個 `Factory`。

### 自動探索的注意事項

- **執行時 classpath 上沒有任何後端** → 在第一次解析時會拋出 `IllegalStateException`。請將一個後端模組加入執行時 classpath，或者明確傳入一個 `Factory`。
- **有兩個或多個後端** → 會拋出相同的異常；訊息中會列出它找到的所有提供者。請使用 Gradle 排除除一個以外的所有後端（在有衝突的相依性上使用 `exclude(module = "http-client-ktor")`），或在呼叫點明確傳入一個 `Factory`。

## 自訂後端

任何實作了 `KoogHttpClient.Factory` 的類別均可運作。若要使其在 JVM 上可自動探索，請將其註冊為 `ServiceLoader` 提供者：

```
src/main/resources/META-INF/services/ai.koog.http.client.KoogHttpClient$Factory
```

該檔案包含一行：工廠類別的完全限定名稱。巢狀 `Factory` 類別使用 `$` 作為分隔符號是正確的 — 檔案名稱應為 `KoogHttpClient$Factory`，而非 `KoogHttpClient.Factory`。

如果您不希望使用自動探索，請跳過註冊步驟，並在各處明確傳入您的工廠。