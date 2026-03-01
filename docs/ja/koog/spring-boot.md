# Spring Boot 統合

Koogは、オートコンフィグレーション（自動設定）スターターを通じてシームレスなSpring Boot統合を提供します。これにより、最小限のセットアップでSpring BootアプリケーションにAIエージェントを簡単に組み込むことができます。

## 概要

`koog-spring-boot-starter` は、アプリケーションのプロパティに基づいてLLMクライアントを自動的に構成し、依存性注入（Dependency Injection）ですぐに使用できるBeanを提供します。以下を含むすべての主要なLLMプロバイダーをサポートしています。

- OpenAI
- Anthropic
- Google
- OpenRouter
- DeepSeek
- Ollama

## はじめに

### 1. 依存関係の追加

KoogのSpring Bootスターターと [Ktor Client Engine](https://ktor.io/docs/client-engines.html#jvm) を `build.gradle.kts` または `pom.xml` に追加します。

```kotlin
dependencies {
    implementation("ai.koog:koog-spring-boot-starter:$koogVersion")
    implementation("io.ktor:ktor-client-okhttp-jvm:$ktorVersion")
}
```

### 2. プロバイダーの設定

`application.properties` で利用したいLLMプロバイダーを設定します。

```properties
# OpenAI の設定
ai.koog.openai.enabled=true
ai.koog.openai.api-key=${OPENAI_API_KEY}
ai.koog.openai.base-url=https://api.openai.com
# Anthropic の設定  
ai.koog.anthropic.enabled=true
ai.koog.anthropic.api-key=${ANTHROPIC_API_KEY}
ai.koog.anthropic.base-url=https://api.anthropic.com
# Google の設定
ai.koog.google.enabled=true
ai.koog.google.api-key=${GOOGLE_API_KEY}
ai.koog.google.base-url=https://generativelanguage.googleapis.com
# OpenRouter の設定
ai.koog.openrouter.enabled=true
ai.koog.openrouter.api-key=${OPENROUTER_API_KEY}
ai.koog.openrouter.base-url=https://openrouter.ai
# DeepSeek の設定
ai.koog.deepseek.enabled=true
ai.koog.deepseek.api-key=${DEEPSEEK_API_KEY}
ai.koog.deepseek.base-url=https://api.deepseek.com
# Ollama の設定 (ローカル - APIキーは不要)
ai.koog.ollama.enabled=true
ai.koog.ollama.base-url=http://localhost:11434
```

または、YAML形式（`application.yml`）を使用する場合：

```yaml
ai:
    koog:
        openai:
            enabled: true
            api-key: ${OPENAI_API_KEY}
            base-url: https://api.openai.com
        anthropic:
            enabled: true
            api-key: ${ANTHROPIC_API_KEY}
            base-url: https://api.anthropic.com
        google:
            enabled: true
            api-key: ${GOOGLE_API_KEY}
            base-url: https://generativelanguage.googleapis.com
        openrouter:
            enabled: true
            api-key: ${OPENROUTER_API_KEY}
            base-url: https://openrouter.ai
        deepseek:
            enabled: true
            api-key: ${DEEPSEEK_API_KEY}
            base-url: https://api.deepseek.com
        ollama:
            enabled: true # 有効にするには明示的に `true` を設定してください !!!
            base-url: http://localhost:11434
```

プロバイダーを有効化するために、`ai.koog.PROVIDER.api-key` と `ai.koog.PROVIDER.enabled` の両方のプロパティが使用されます。

OpenAI、Anthropic、GoogleのようにAPIキーをサポートしているプロバイダーの場合、`ai.koog.PROVIDER.enabled` はデフォルトで `true` に設定されます。

OllamaのようにAPIキーをサポートしていないプロバイダーの場合、`ai.koog.PROVIDER.enabled` はデフォルトで `false` に設定されており、アプリケーション設定で明示的に有効にする必要があります。

プロバイダーのベースURLは、Spring Bootスターター内でデフォルト値が設定されていますが、アプリケーションで上書きすることも可能です。

!!! tip "環境変数"
    APIキーを安全に保ち、バージョン管理に含めないために、環境変数を使用することをお勧めします。
    Springの設定では、LLMプロバイダーのよく知られた環境変数を使用します。
    例えば、環境変数 `OPENAI_API_KEY` を設定するだけで、OpenAIのSpring設定がアクティブになります。

| LLMプロバイダー | 環境変数 |
|--------------|-----------------------|
| Open AI      | `OPENAI_API_KEY`      |
| Anthropic    | `ANTHROPIC_API_KEY`   |
| Google       | `GOOGLE_API_KEY`      |
| OpenRouter   | `OPENROUTER_API_KEY`  |
| DeepSeek     | `DEEPSEEK_API_KEY`    |

### 3. インジェクトと使用

自動構成されたエグゼキューター（executor）をサービスにインジェクトします。

```kotlin
@Service
class AIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
    private val anthropicExecutor: MultiLLMPromptExecutor?
) {

    suspend fun generateResponse(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
            user(input)
        }

        return when {
            openAIExecutor != null -> {
                val result = openAIExecutor.execute(prompt)
                result.text
            }
            anthropicExecutor != null -> {
                val result = anthropicExecutor.execute(prompt)
                result.text
            }
            else -> throw IllegalStateException("No LLM provider configured")
        }
    }
}
```

## 高度な使い方

### RESTコントローラーの例

自動構成されたエグゼキューターを使用して、チャットエンドポイントを作成します。

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val anthropicExecutor: MultiLLMPromptExecutor?
) {

    @PostMapping
    suspend fun chat(@RequestBody request: ChatRequest): ResponseEntity<ChatResponse> {
        return if (anthropicExecutor != null) {
            try {
                val prompt = prompt {
                    system("You are a helpful assistant")
                    user(request.message)
                }

                val result = anthropicExecutor.execute(prompt)
                ResponseEntity.ok(ChatResponse(result.text))
            } catch (e: Exception) {
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ChatResponse("Error processing request"))
            }
        } else {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ChatResponse("AI service not configured"))
        }
    }
}

data class ChatRequest(val message: String)
data class ChatResponse(val response: String)
```

### 複数プロバイダーのサポート

フォールバックロジックを使用して複数のプロバイダーを処理します。

```kotlin
@Service
class RobustAIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
    private val anthropicExecutor: MultiLLMPromptExecutor?,
    private val openRouterExecutor: MultiLLMPromptExecutor?
) {

    suspend fun generateWithFallback(input: String): String {
        val prompt = prompt {
            system("You are a helpful AI assistant")
            user(input)
        }

        val executors = listOfNotNull(openAIExecutor, anthropicExecutor, openRouterExecutor)

        for (executor in executors) {
            try {
                val result = executor.execute(prompt)
                return result.text
            } catch (e: Exception) {
                logger.warn("Executor failed, trying next: ${e.message}")
                continue
            }
        }

        throw IllegalStateException("All AI providers failed")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(RobustAIService::class.java)
    }
}
```

### 設定プロパティの使用

カスタムロジックのために設定プロパティをインジェクトすることもできます。

```kotlin
@Service
class ConfigurableAIService(
    private val openAIExecutor: MultiLLMPromptExecutor?,
    @Value("\${ai.koog.openai.api-key:}") private val openAIKey: String
) {

    fun isOpenAIConfigured(): Boolean = openAIKey.isNotBlank() && openAIExecutor != null

    suspend fun processIfConfigured(input: String): String? {
        return if (isOpenAIConfigured()) {
            val result = openAIExecutor!!.execute(prompt { user(input) })
            result.text
        } else {
            null
        }
    }
}
```

## 設定リファレンス

### 利用可能なプロパティ

| プロパティ | 説明 | Beanの条件 | デフォルト値 |
|-------------------------------|---------------------|-----------------------------------------------------------------|---------------------------------------------|
| `ai.koog.openai.api-key`      | OpenAI API キー     | `openAIExecutor` Bean に必要                                    | -                                           |
| `ai.koog.openai.base-url`     | OpenAI ベース URL    | オプション                                                       | `https://api.openai.com`                    |
| `ai.koog.anthropic.api-key`   | Anthropic API キー  | `anthropicExecutor` Bean に必要                                 | -                                           |
| `ai.koog.anthropic.base-url`  | Anthropic ベース URL | オプション                                                       | `https://api.anthropic.com`                 |
| `ai.koog.google.api-key`      | Google API キー     | `googleExecutor` Bean に必要                                    | -                                           |
| `ai.koog.google.base-url`     | Google ベース URL    | オプション                                                       | `https://generativelanguage.googleapis.com` |
| `ai.koog.openrouter.api-key`  | OpenRouter API キー | `openRouterExecutor` Bean に必要                                | -                                           |
| `ai.koog.openrouter.base-url` | OpenRouter ベース URL| オプション                                                       | `https://openrouter.ai`                     |
| `ai.koog.deepseek.api-key`    | DeepSeek API キー   | `deepSeekExecutor` Bean に必要                                  | -                                           |
| `ai.koog.deepseek.base-url`   | DeepSeek ベース URL  | オプション                                                       | `https://api.deepseek.com`                  |
| `ai.koog.ollama.base-url`     | Ollama ベース URL    | いずれかの `ai.koog.ollama.*` プロパティで `ollamaExecutor` Bean が有効化 | `http://localhost:11434`                    |

### Bean 名

自動構成により、（設定されている場合）以下のBeanが作成されます。

- `openAIExecutor` - OpenAI エグゼキューター (`ai.koog.openai.api-key` が必要)
- `anthropicExecutor` - Anthropic エグゼキューター (`ai.koog.anthropic.api-key` が必要)
- `googleExecutor` - Google エグゼキューター (`ai.koog.google.api-key` が必要)
- `openRouterExecutor` - OpenRouter エグゼキューター (`ai.koog.openrouter.api-key` が必要)
- `deepSeekExecutor` - DeepSeek エグゼキューター (`ai.koog.deepseek.api-key` が必要)
- `ollamaExecutor` - Ollama エグゼキューター (いずれかの `ai.koog.ollama.*` プロパティが必要)

## トラブルシューティング

### よくある問題

**Bean が見つからないエラー:**

```
No qualifying bean of type 'MultiLLMPromptExecutor' available
```

**解決策:** プロパティファイルで少なくとも1つのプロバイダーが設定されていることを確認してください。

**複数の Bean エラー:**

```
Multiple qualifying beans of type 'MultiLLMPromptExecutor' available
```

**解決策:** `@Qualifier` を使用して、どのBeanを使用するか指定してください。

```kotlin
@Service
class MyService(
    @Qualifier("openAIExecutor") private val openAIExecutor: MultiLLMPromptExecutor,
    @Qualifier("anthropicExecutor") private val anthropicExecutor: MultiLLMPromptExecutor
) {
    // ...
}
```

**API キーがロードされない:**

```
API key is required but not provided
```

**解決策:** 環境変数が正しく設定され、Spring Bootアプリケーションからアクセス可能であることを確認してください。

## ベストプラクティス

1. **環境変数**: APIキーには常に環境変数を使用してください。
2. **Nullableなインジェクション**: プロバイダーが設定されていないケースを処理するために、Nullable型（`MultiLLMPromptExecutor?`）を使用してください。
3. **フォールバックロジック**: 複数のプロバイダーを使用する場合は、フォールバックメカニズムを実装してください。
4. **エラーハンドリング**: 本番環境のコードでは、エグゼキューターの呼び出しを常にtry-catchブロックで囲んでください。
5. **テスト**: 実際のAPI呼び出しを避けるため、テストではモックを使用してください。
6. **設定の検証**: 使用する前にエグゼキューターが利用可能かどうかを確認してください。

## 次のステップ

- [基本的なエージェント](agents/basic-agents.md) について学び、最小限のAIワークフローを構築する
- 高度なユースケースのために [グラフベースのエージェント](agents/graph-based-agents.md) を探索する
- エージェントの機能を拡張するために [ツールの概要](tools-overview.md) を参照する
- 実践的な実装については [サンプル](examples.md) を確認する
- フレームワークをより深く理解するために [用語集](glossary.md) を読む