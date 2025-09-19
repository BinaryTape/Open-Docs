# Spring Bootとの統合

Koogは、その自動構成スターターを通じてシームレスなSpring Bootとの統合を提供し、最小限のセットアップでAIエージェントをSpring Bootアプリケーションに簡単に組み込むことができます。

## 概要

`koog-spring-boot-starter`は、アプリケーションプロパティに基づいてLLMクライアントを自動的に構成し、依存性注入のためにすぐに使えるBeanを提供します。OpenAI、Anthropic、Google、OpenRouter、DeepSeek、Ollamaを含むすべての主要なLLMプロバイダーをサポートしています。

## はじめに

### 1. 依存関係の追加

`build.gradle.kts`にSpring Bootスターターを追加します。

```kotlin
dependencies {
    implementation("ai.koog:koog-spring-boot-starter:$koogVersion")
}
```

### 2. プロバイダーの構成

`application.properties`でお好みのLLMプロバイダーを構成します。

```properties
# OpenAI Configuration
ai.koog.openai.api-key=${OPENAI_API_KEY}
ai.koog.openai.base-url=https://api.openai.com
# Anthropic Configuration  
ai.koog.anthropic.api-key=${ANTHROPIC_API_KEY}
ai.koog.anthropic.base-url=https://api.anthropic.com
# Google Configuration
ai.koog.google.api-key=${GOOGLE_API_KEY}
ai.koog.google.base-url=https://generativelanguage.googleapis.com
# OpenRouter Configuration
ai.koog.openrouter.api-key=${OPENROUTER_API_KEY}
ai.koog.openrouter.base-url=https://openrouter.ai
# DeepSeek Configuration
ai.koog.deepseek.api-key=${DEEPSEEK_API_KEY}
ai.koog.deepseek.base-url=https://api.deepseek.com
# Ollama Configuration (local - no API key required)
ai.koog.ollama.base-url=http://localhost:11434
```

またはYAML形式（`application.yml`）を使用します。

```yaml
ai:
    koog:
        openai:
            api-key: ${OPENAI_API_KEY}
            base-url: https://api.openai.com
        anthropic:
            api-key: ${ANTHROPIC_API_KEY}
            base-url: https://api.anthropic.com
        google:
            api-key: ${GOOGLE_API_KEY}
            base-url: https://generativelanguage.googleapis.com
        openrouter:
            api-key: ${OPENROUTER_API_KEY}
            base-url: https://openrouter.ai
        deepseek:
            api-key: ${DEEPSEEK_API_KEY}
            base-url: https://api.deepseek.com
        ollama:
            base-url: http://localhost:11434
```

!!! tip "環境変数"
APIキーをセキュアに保ち、バージョン管理から除外するために、環境変数を使用することをお勧めします。

### 3. 注入と利用

自動構成されたエグゼキューターをサービスに注入します。

```kotlin
@Service
class AIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?
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

## 高度な使用法

### RESTコントローラーの例

自動構成されたエグゼキューターを使用してチャットエンドポイントを作成します。

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(
    private val anthropicExecutor: SingleLLMPromptExecutor?
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

### 複数のプロバイダーのサポート

フォールバックロジックを使用して複数のプロバイダーを処理します。

```kotlin
@Service
class RobustAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
    private val anthropicExecutor: SingleLLMPromptExecutor?,
    private val openRouterExecutor: SingleLLMPromptExecutor?
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
                logger.warn("エグゼキューターが失敗しました。次を試します: ${e.message}")
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

### 構成プロパティ

カスタムロジックのために構成プロパティを注入することもできます。

```kotlin
@Service
class ConfigurableAIService(
    private val openAIExecutor: SingleLLMPromptExecutor?,
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

## 構成リファレンス

### 利用可能なプロパティ

| プロパティ                      | 説明             | Bean条件                                      | デフォルト                                  |
|-------------------------------|------------------|-----------------------------------------------|---------------------------------------------|
| `ai.koog.openai.api-key`      | OpenAI APIキー   | `openAIExecutor` Beanに必要                     | -                                           |
| `ai.koog.openai.base-url`     | OpenAIベースURL  | オプション                                      | `https://api.openai.com`                    |
| `ai.koog.anthropic.api-key`   | Anthropic APIキー | `anthropicExecutor` Beanに必要                  | -                                           |
| `ai.koog.anthropic.base-url`  | AnthropicベースURL | オプション                                      | `https://api.anthropic.com`                 |
| `ai.koog.google.api-key`      | Google APIキー   | `googleExecutor` Beanに必要                     | -                                           |
| `ai.koog.google.base-url`     | GoogleベースURL  | オプション                                      | `https://generativelanguage.googleapis.com` |
| `ai.koog.openrouter.api-key`  | OpenRouter APIキー | `openRouterExecutor` Beanに必要                 | -                                           |
| `ai.koog.openrouter.base-url` | OpenRouterベースURL| オプション                                      | `https://openrouter.ai`                     |
| `ai.koog.deepseek.api-key`    | DeepSeek APIキー   | `deepSeekExecutor` Beanに必要                   | -                                           |
| `ai.koog.deepseek.base-url`   | DeepSeekベースURL  | オプション                                      | `https://api.deepseek.com`                  |
| `ai.koog.ollama.base-url`     | OllamaベースURL    | いずれかの`ai.koog.ollama.*`プロパティが`ollamaExecutor` Beanを有効にします | `http://localhost:11434`                    |

### Bean名

自動構成は、以下のBeanを作成します（構成されている場合）。

- `openAIExecutor` - OpenAIエグゼキューター (`ai.koog.openai.api-key`が必要)
- `anthropicExecutor` - Anthropicエグゼキューター (`ai.koog.anthropic.api-key`が必要)
- `googleExecutor` - Googleエグゼキューター (`ai.koog.google.api-key`が必要)
- `openRouterExecutor` - OpenRouterエグゼキューター (`ai.koog.openrouter.api-key`が必要)
- `deepSeekExecutor` - DeepSeekエグゼキューター (`ai.koog.deepseek.api-key`が必要)
- `ollamaExecutor` - Ollamaエグゼキューター (いずれかの`ai.koog.ollama.*`プロパティが必要)

## トラブルシューティング

### 一般的な問題

**Beanが見つからないエラー:**

```
No qualifying bean of type 'SingleLLMPromptExecutor' available
```

**解決策:** プロパティファイルに少なくとも1つのプロバイダーが構成されていることを確認してください。

**複数のBeanエラー:**

```
Multiple qualifying beans of type 'SingleLLMPromptExecutor' available
```

**解決策:** `@Qualifier`を使用して、どのBeanを使用するかを指定します。

```kotlin
@Service
class MyService(
    @Qualifier("openAIExecutor") private val openAIExecutor: SingleLLMPromptExecutor,
    @Qualifier("anthropicExecutor") private val anthropicExecutor: SingleLLMPromptExecutor
) {
    // ...
}
```

**APIキーがロードされない:**

```
API key is required but not provided
```

**解決策:** 環境変数が適切に設定され、Spring Bootアプリケーションからアクセス可能であることを確認してください。

## ベストプラクティス

1.  **環境変数**: APIキーには常に環境変数を使用します
2.  **null許容な注入**: プロバイダーが構成されていないケースを処理するために、null許容な型 (`SingleLLMPromptExecutor?`) を使用します
3.  **フォールバックロジック**: 複数のプロバイダーを使用する際には、フォールバックメカニズムを実装します
4.  **エラーハンドリング**: 本番コードでは常にエグゼキューター呼び出しをtry-catchブロックで囲みます
5.  **テスト**: 実際のAPI呼び出しを避けるためにテストでモックを使用します
6.  **構成の検証**: エグゼキューターを使用する前に利用可能であることを確認します

## 次のステップ

-   基本的なAIワークフローを構築するために、[シングルランエージェント](single-run-agents.md)について学びます
-   高度なユースケースには[複雑なワークフローエージェント](complex-workflow-agents.md)を探求します
-   エージェントの機能を拡張するために[ツール概要](tools-overview.md)を参照してください
-   実世界の実装については[例](examples.md)をチェックしてください
-   フレームワークをよりよく理解するために[主要な概念](key-concepts.md)を読んでください