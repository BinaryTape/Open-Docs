# プロンプト・キャッシング制御

プロンプト・キャッシング制御を使用すると、サポートされているLLMプロバイダーに対して、プロンプトの一部をサーバー側に保存するように指示できます。これにより、同じプレフィックスを共有する後続のリクエストにおいて、トークンを再処理する代わりにキャッシュから提供できるようになります。
これは、マルチターン会話、大規模なシステムプロンプト、または固定のツール定義など、繰り返しの多いワークロードにおいて、レイテンシとコストの両方を削減します。

!!! note "プロンプト・キャッシング vs レスポンス・キャッシング"
    プロンプト・キャッシング制御は**プロバイダー側**の機能です。プロバイダーはレスポンスではなく、プロンプトのプレフィックスを保存します。これは、LLMのレスポンス全体をローカルに保存して、同一のプロンプトに対するネットワーク呼び出しを完全にスキップする[`CachedPromptExecutor`](../llm-response-caching.md)とは異なります。

Koogは、**Anthropic** と **Amazon Bedrock** のプロンプト・キャッシング制御をサポートしています。

## Anthropic

Anthropicは、プロンプト・キャッシングに対して2つの補完的なアプローチをサポートしています。

### 自動キャッシング（リクエスト・レベル）

[`AnthropicParams`](../../llm-parameters.md) の `cacheControl` プロパティを設定し、それをプロンプトに渡します。
Anthropicは、個々のメッセージに注釈を付ける必要なく、リクエスト内の最後のキャッシュ可能なブロックに自動的にキャッシュ・ブレークポイントを配置します。
これは、マルチターン会話に推奨されるアプローチです。

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
    // デフォルトの5分間のTTLで自動キャッシングを有効にする
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
    // デフォルトの5分間のTTLで自動キャッシングを有効にする
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

### 手動キャッシング（ブロック・レベル）

個々のメッセージやツール定義に `cacheControl` 引数を付与することで、特定の位置にキャッシュ・ブレークポイントを配置します。注釈を付けたブロックまでのすべてがキャッシングの対象となります。

#### システムメッセージ

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
        // システムプロンプトを1時間キャッシュする
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
        // システムプロンプトを1時間キャッシュする
        .system("You are a knowledgeable assistant...", AnthropicCacheControl.OneHour.INSTANCE)
        .user("Summarize the latest AI research.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-02.java -->

#### ユーザーおよびアシスタントメッセージ

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
        // 大規模なユーザーメッセージ（例：ドキュメントの内容）の後にキャッシュする
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
        // 大規模なユーザーメッセージ（例：ドキュメントの内容）の後にキャッシュする
        .user(List.of(new ContentPart.Text("Here is a long document: ...")), AnthropicCacheControl.Default.INSTANCE)
        .assistant("I have read the document.", AnthropicCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-03.java -->

#### ツール定義

ツールリストが多くのリクエストにわたって固定されている場合、最後のツール定義をキャッシュすることで、すべてのツールスキーマがまとめてキャッシュされます。

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
        // この定義を含む、それ以前のすべてのツール定義をキャッシュする
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
        // この定義を含む、それ以前のすべてのツール定義をキャッシュする
        AnthropicCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-04.java -->

### キャッシュTTLオプション

| オプション | TTL | 価格倍率 |
| :--- | :--- | :--- |
| `AnthropicCacheControl.Default` | 5分 | 基本入力価格の1.25倍 |
| `AnthropicCacheControl.OneHour` | 1時間 | 基本入力価格の2倍 |

キャッシュの書き込みは通常の入力トークンよりも高いレートで課金されますが、キャッシュの読み取りは安価になります。
現在の価格設定については、[Anthropicのプロンプト・キャッシング・ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)を参照してください。

### キャッシュ使用状況のモニタリング

Anthropicは、レスポンスの使用統計（usage）でキャッシュ統計をレポートします。これらは生のAPIレスポンスを介してアクセス可能であり、トレーシングやロギング機能を通じて観察できます。

| フィールド | 意味 |
| :--- | :--- |
| `cacheReadInputTokens` | 既存のキャッシュエントリから読み取られたトークン |
| `cacheCreationInputTokens` | 新しいキャッシュエントリに書き込まれたトークン |

### 自動キャッシングとブロック・レベル・キャッシングの組み合わせ

両方のモードを同時に使用できます。ブロック・レベルの `cacheControl` マーカーによりブレークポイントの位置を細かく制御でき、`AnthropicParams` のリクエスト・レベルの `cacheControl` により会話の末尾を自動的に処理できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicParams
    -->

    ```kotlin
    // ブロック・レベル：システムプロンプトを1時間キャッシュ層に固定する
    // 自動：Anthropicに会話末尾のブレークポイント管理を任せる
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
    // ブロック・レベル：システムプロンプトを1時間キャッシュ層に固定する
    // 自動：Anthropicに会話末尾のブレークポイント管理を任せる
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

Amazon Bedrockは、Converse APIを介したブロック・レベル・キャッシング・モデルを使用します。
メッセージまたはツールに `cacheControl` が設定されると、Bedrockは注釈を付けた要素の直後に `CachePoint` ブロックを挿入します。

!!! note
    Bedrockのプロンプト・キャッシングは、Bedrockクライアント自体がJVM専用であるため、JVM専用の機能です。

### システムメッセージ

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
        // デフォルトのTTLを使用してシステムプロンプトをキャッシュする
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
        // デフォルトのTTLを使用してシステムプロンプトをキャッシュする
        .system("You are a knowledgeable assistant...", BedrockCacheControl.Default.INSTANCE)
        .user("What is prompt caching?")
        .build();
    ```
    <!--- KNIT example-cache-control-java-06.java -->

### ユーザーおよびアシスタントメッセージ

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
        // 大規模なコンテキストメッセージの後にキャッシュする
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
        // 大規模なコンテキストメッセージの後にキャッシュする
        .user("Here is the document: ...", BedrockCacheControl.FiveMinutes.INSTANCE)
        .assistant("I have read the document.", BedrockCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-07.java -->

### ツール定義

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
        // この定義を含む、それ以前のすべてのツール定義をキャッシュする
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
        // この定義を含む、それ以前のすべてのツール定義をキャッシュする
        BedrockCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-08.java -->

### キャッシュTTLオプション

| オプション | TTL |
| :--- | :--- |
| `BedrockCacheControl.Default` | プロバイダーのデフォルト（明示的なTTLは送信されません） |
| `BedrockCacheControl.FiveMinutes` | 5分 |
| `BedrockCacheControl.OneHour` | 1時間 |

サポートされているモデルと価格については、[Amazon Bedrockのプロンプト・キャッシング・ドキュメント](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)を参照してください。

---

## キャッシング戦略の選択

| 状況 | 推奨されるアプローチ |
| :--- | :--- |
| 大規模で固定されたシステムプロンプトを使用するマルチターンチャット | Anthropicの自動キャッシング、またはBedrockのシステムに対するブロック・レベル |
| リクエスト間で再利用される安定したツール定義 | 最後のツール定義におけるブロック・レベルの `cacheControl` |
| ユーザーコンテキストとして渡される長いドキュメント | ユーザーメッセージにおけるブロック・レベルの `cacheControl` |
| 任意のマルチターン会話（Anthropic） | `AnthropicParams.cacheControl` による自動キャッシング |
| 1時間のキャッシュ保持が必要な場合 | `AnthropicCacheControl.OneHour` / `BedrockCacheControl.OneHour` |