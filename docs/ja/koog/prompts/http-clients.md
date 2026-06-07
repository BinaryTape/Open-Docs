# HTTP クライアント

Koog のすべての LLM クライアントは、[`KoogHttpClient`](api:http-client-core::ai.koog.http.client.KoogHttpClient) を必要とします。これは、フレームワークがプロバイダーと通信するために使用する抽象的な HTTP コントラクト（契約）です。クライアントの構築時にこれを渡します。

この `KoogHttpClient` は自身で構築することも可能ですが、実際には非常に手間がかかります。プロバイダーごとに固有のベース URL、認証ヘッダーの形式、Content-Type、および SSE（Server-Sent Events）の規約があるためです。プロバイダーごとにこれらを正しく設定する手間を省くために存在するのが [`KoogHttpClient.Factory`](api:http-client-core::ai.koog.http.client.KoogHttpClient.Factory) です。`Factory` を渡すと、プロバイダークライアントはその API に適したパラメータを使用して `Factory.create(...)` を呼び出します。

標準では、Ktor、JDK の `HttpClient`、OkHttp、そして Spring の `WebClient` という 4 つのバックエンドファクトリが提供されており、独自のファクトリを実装することも可能です。

## 仕組み

1 つのファクトリで任意のプロバイダーに対応できます。バックエンドを一度選択すれば、複数のクライアントにわたって使用できます。

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

## サポートされているHTTPクライアントの種類

| モジュール | 備考 |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [`http-client-ktor`](api:http-client-ktor::)                            | 非JVMターゲットから使用可能な唯一のバックエンド。 |
| [`http-client-java`](api:http-client-java::)                            | JDK 11以降の `java.net.http.HttpClient` をラップします。 |
| [`http-client-okhttp`](api:http-client-okhttp::)                        | OkHttp をベースにしています。Androidに適しています。 |
| [`http-client-spring-webclient`](api:http-client-spring-webclient::)    | Spring の `WebClient` をベースにしています。 |

## 便利なAPIとファクトリの自動検出

JVM および Android では、ファクトリを明示的に渡さずに各 LLM クライアントを構築できます。

内部では、[`HttpClientFactoryResolver`](api:http-client-core::ai.koog.http.client.HttpClientFactoryResolver) が `java.util.ServiceLoader` を使用して、実行時のクラスパスから `KoogHttpClient.Factory` を解決します。

- すべてのバックエンドモジュールが `ServiceLoader` への登録を提供しています。
- 解決が成功するのは、実行時のクラスパスにファクトリがちょうど 1 つだけ存在する場合のみです。
- `prompt-executor-llms-all` は `http-client-ktor` を `runtimeOnly` 依存関係として宣言しているため、コンパイル時にそのモジュールを意識することなく、デフォルトで Ktor が使用されます。
- `simple<Provider>Executor(apiKey)` および `PromptExecutorBuilder.<provider>(apiKey)` も同じ解決パスを使用します。

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

現在、KMP（Kotlin Multiplatform）では自動検出はサポートされていないため、JVM 以外ではこれらの便利なメソッドは利用できません。`commonMain` からは、ファクトリを明示的に渡してください。

### 自動検出の注意点

- **実行時のクラスパスにバックエンドが存在しない場合** → 初回解決時に `IllegalStateException` が発生します。バックエンドモジュールをクラスパスに追加するか、ファクトリを明示的に渡してください。
- **2つ以上のバックエンドが存在する場合** → 同様の例外が発生します。メッセージには見つかったプロバイダーの名前が表示されます。Gradle で 1 つを除いてすべて除外するか（対象の依存関係に対して `exclude(module = "http-client-ktor")` を使用）、呼び出し箇所で明示的にファクトリを渡してください。

## カスタムバックエンド

`KoogHttpClient.Factory` を実装するクラスであれば、どのようなクラスでも動作します。JVM で自動検出可能にするには、`ServiceLoader` プロバイダーとして登録します。

```
src/main/resources/META-INF/services/ai.koog.http.client.KoogHttpClient$Factory
```

このファイルには、ファクトリクラスの完全修飾名を 1 行記述します。リテラルの `$`（ネストされた `Factory` クラスの区切り文字）は正しい表記です。ファイル名は `KoogHttpClient.Factory` ではなく `KoogHttpClient$Factory` となります。

自動検出を利用したくない場合は、登録をスキップして、すべての場所で明示的にファクトリを渡してください。