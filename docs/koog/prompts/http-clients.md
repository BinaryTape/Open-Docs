# HTTP 客户端

Koog 中的每个 LLM 客户端都需要一个 [`KoogHttpClient`](api:http-client-core::ai.koog.http.client.KoogHttpClient) —— 这是框架用于与提供商通信的抽象 HTTP 契约。您在构造时传入一个即可。

您可以自己构建 `KoogHttpClient`，但这需要不少工作：每个提供商都有自己的基础 URL、认证标头格式、content-type 和 SSE 约定。准确处理每个提供商的这些细节正是 [`KoogHttpClient.Factory`](api:http-client-core::ai.koog.http.client.KoogHttpClient.Factory) 存在的意义。您传入一个 `Factory`，提供商客户端会使用符合其 API 的参数调用 `Factory.create(...)`。

开箱即提供四种后端工厂 —— Ktor、JDK `HttpClient`、OkHttp 和 Spring 的 `WebClient` —— 您也可以实现自己的工厂。

## 工作原理

一个工厂适用于任何提供商：只需选择一次后端，即可在各个客户端中使用。

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

## 支持的 HTTP 客户端变体

| 模块 | 说明 |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [`http-client-ktor`](api:http-client-ktor::)                            | 唯一可用于非 JVM 目标的后端。 |
| [`http-client-java`](api:http-client-java::)                            | 包装了 JDK 11+ 的 `java.net.http.HttpClient`。 |
| [`http-client-okhttp`](api:http-client-okhttp::)                        | 由 OkHttp 提供支持。对 Android 友好。 |
| [`http-client-spring-webclient`](api:http-client-spring-webclient::)    | 由 Spring `WebClient` 提供支持。 |

## 便捷 API 与工厂自动发现

在 JVM 和 Android 上，您可以直接构造每个 LLM 客户端，而无需显式传递工厂。

在后台，[`HttpClientFactoryResolver`](api:http-client-core::ai.koog.http.client.HttpClientFactoryResolver) 使用 `java.util.ServiceLoader` 从运行时类路径解析 `KoogHttpClient.Factory`：

- 每个后端模块都提供了一个 `ServiceLoader` 注册。
- 仅当运行时类路径中恰好有一个可见的工厂时，解析才会成功。
- `prompt-executor-llms-all` 将 `http-client-ktor` 声明为 `runtimeOnly` 依赖项，因此您默认会获得 Ktor，且在编译时不会暴露该模块。
- `simple<Provider>Executor(apiKey)` 和 `PromptExecutorBuilder.<provider>(apiKey)` 使用相同的解析路径。

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

目前 KMP 尚不支持自动发现，因此这些便捷方法在 JVM 之外也无法使用。在 `commonMain` 中，请显式传递一个 `Factory`。

### 自动发现的陷阱

- **运行时类路径中没有后端** → 首次解析时抛出 `IllegalStateException`。请将后端模块添加到运行时类路径，或显式传递一个 `Factory`。
- **有两个或更多后端** → 抛出相同的异常；消息会列出它找到的提供商。请使用 Gradle 排除除一个以外的所有后端（在引起冲突的依赖项上使用 `exclude(module = "http-client-ktor")`），或在调用处显式传递一个 `Factory`。

## 自定义后端

任何实现 `KoogHttpClient.Factory` 的类都可以使用。要使其在 JVM 上支持自动发现，请将其注册为 `ServiceLoader` 提供商：

```
src/main/resources/META-INF/services/ai.koog.http.client.KoogHttpClient$Factory
```

该文件包含一行内容：工厂类的完全限定名。字面量 `$`（嵌套 `Factory` 类的分隔符）是正确的 —— 文件名应为 `KoogHttpClient$Factory`，而不是 `KoogHttpClient.Factory`。

如果您不想要自动发现，请跳过注册并在所有地方显式传递您的工厂。