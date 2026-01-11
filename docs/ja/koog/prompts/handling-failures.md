# 失敗の処理

このページでは、LLMクライアントおよびプロンプトエグゼキューターにおける失敗を、組み込みのリトライおよびタイムアウトメカニズムを使用して処理する方法について説明します。

## リトライ機能

LLMプロバイダーと連携する場合、レート制限や一時的なサービス利用不可などの一時的なエラーが発生する可能性があります。
`RetryingLLMClient`デコレーターは、任意のLLMクライアントに自動リトライロジックを追加します。

### 基本的な使い方

既存のクライアントをリトライ機能でラップします:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY")
        val prompt = prompt("test") {
            user("Hello")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 任意のクライアントをリトライ機能でラップします
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// これで、すべての操作は一時的なエラー発生時に自動的にリトライされます
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-handling-failures-01.kt -->

### リトライ動作の構成

デフォルトでは、`RetryingLLMClient`は、LLMクライアントを最大3回の再試行、1秒の初期遅延、30秒の最大遅延で構成します。
`RetryingLLMClient`に渡される`RetryConfig`を使用して、異なるリトライ設定を指定できます。例:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 定義済み設定を使用する
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)
```
<!--- KNIT example-handling-failures-02.kt -->

Koogは、いくつかの定義済みリトライ設定を提供します:

| 設定                 | 最大試行回数 | 初期遅延 | 最大遅延 | ユースケース                                                                         |
|----------------------|--------------|----------|----------|--------------------------------------------------------------------------------------|
| `RetryConfig.DISABLED`     | 1 (リトライなし) | -        | -        | 開発、テスト、デバッグ。                                                             |
| `RetryConfig.CONSERVATIVE` | 3            | 2秒      | 30秒     | 信頼性が速度よりも重要なバックグラウンドまたはスケジュールされたタスク。             |
| `RetryConfig.AGGRESSIVE`   | 5            | 500ミリ秒 | 20秒     | 一時的なエラーからの迅速な回復がAPI呼び出しの削減よりも重要な重要な操作。            |
| `RetryConfig.PRODUCTION`   | 3            | 1秒      | 20秒     | 一般的なプロダクション利用。                                                         |

これらを直接使用することも、カスタム設定を作成することもできます:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// またはカスタム設定を作成する
val customClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig(
        maxAttempts = 5,
        initialDelay = 1.seconds,
        maxDelay = 30.seconds,
        backoffMultiplier = 2.0,
        jitterFactor = 0.2
    )
)
```
<!--- KNIT example-handling-failures-03.kt -->

### リトライエラーパターン

デフォルトでは、`RetryingLLMClient`は一般的な一時的なエラーを認識します。
この動作は、[`RetryConfig.retryablePatterns`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/retryable-patterns.html)パターンによって制御されます。
各パターンは、失敗したリクエストのエラーメッセージをチェックし、リトライすべきかどうかを判断する
[`RetryablePattern`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retryable-pattern/index.html)
によって表されます。

Koogは、サポートされているすべてのLLMプロバイダーで機能する、定義済みのリトライ設定とパターンを提供します。
デフォルト設定を維持することも、特定のニーズに合わせてカスタマイズすることもできます。

#### パターンタイプ

以下のパターンタイプを使用し、それらを任意に組み合わせて使用できます:

*   `RetryablePattern.Status`: エラーメッセージ内の特定のHTTPステータスコード（`429`、`500`、`502`など）に一致します。
*   `RetryablePattern.Keyword`: エラーメッセージ内のキーワード（`rate limit`や`request timeout`など）に一致します。
*   `RetryablePattern.Regex`: エラーメッセージ内の正規表現に一致します。
*   `RetryablePattern.Custom`: ラムダ関数を使用したカスタムロジックに一致します。

いずれかのパターンが`true`を返した場合、そのエラーはリトライ可能とみなされ、LLMクライアントはリクエストをリトライできます。

#### デフォルトパターン

リトライ設定をカスタマイズしない限り、以下のパターンがデフォルトで使用されます:

*   **HTTPステータスコード**:
    *   `429`: レート制限
    *   `500`: 内部サーバーエラー
    *   `502`: 不良なゲートウェイ
    *   `503`: サービス利用不可
    *   `504`: ゲートウェイタイムアウト
    *   `529`: Anthropic過負荷

*   **エラーキーワード**:
    *   rate limit (レート制限)
    *   too many requests (リクエストが多すぎます)
    *   request timeout (リクエストタイムアウト)
    *   connection timeout (接続タイムアウト)
    *   read timeout (読み取りタイムアウト)
    *   write timeout (書き込みタイムアウト)
    *   connection reset by peer (ピアによる接続リセット)
    *   connection refused (接続拒否)
    *   temporarily unavailable (一時的に利用不可)
    *   service unavailable (サービス利用不可)

これらのデフォルトパターンは、Koogでは[`RetryConfig.DEFAULT_PATTERNS`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/-companion/-d-e-f-a-u-l-t_-p-a-t-t-e-r-n-s.html)として定義されています。

#### カスタムパターン

特定のニーズに合わせてカスタムパターンを定義できます:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),   // 特定のステータスコード
        RetryablePattern.Keyword("quota"),  // エラーメッセージ内のキーワード
        RetryablePattern.Regex(Regex("ERR_\\d+")),  // カスタム正規表現パターン
        RetryablePattern.Custom { error ->  // カスタムロジック
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-handling-failures-04.kt -->

デフォルトの`RetryConfig.DEFAULT_PATTERNS`にカスタムパターンを追加することもできます:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = RetryConfig.DEFAULT_PATTERNS + listOf(
        RetryablePattern.Keyword("custom_error")
    )
)
```
<!--- KNIT example-handling-failures-05.kt -->

### ストリーミングとリトライ

ストリーミング操作はオプションでリトライできます。この機能はデフォルトで無効になっています。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val baseClient = OpenAILLMClient(System.getenv("OPENAI_API_KEY"))
        val prompt = prompt("test") {
            user("Generate a story")
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val config = RetryConfig(
    maxAttempts = 3
)

val client = RetryingLLMClient(baseClient, config)
val stream = client.executeStreaming(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-handling-failures-06.kt -->

!!!note
    ストリーミングのリトライは、最初のトークンを受信する前に発生した接続失敗にのみ適用されます。
    ストリーミングが開始された後は、リトライロジックは無効になります。ストリーミング中にエラーが発生した場合、操作は終了します。

### プロンプトエグゼキューターとリトライ

プロンプトエグゼキューターと連携する場合、エグゼキューターを作成する前に、基盤となるLLMクライアントをリトライメカニズムでラップすることができます。
プロンプトエグゼキューターの詳細については、[プロンプトエグゼキューター](prompt-executors.md)を参照してください。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
import aws.sdk.kotlin.runtime.auth.credentials.StaticCredentialsProvider

-->
```kotlin
// リトライ機能付き単一プロバイダーエグゼキューター
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
    RetryConfig.PRODUCTION
)
val executor = MultiLLMPromptExecutor(resilientClient)

// 柔軟なクライアント設定を備えた複数プロバイダーエグゼキューター
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrockクライアントには、AWS SDKの組み込みリトライ機能がすでに含まれています
    LLMProvider.Bedrock to BedrockLLMClient(
        identityProvider = StaticCredentialsProvider {
            accessKeyId = System.getenv("AWS_ACCESS_KEY_ID")
            secretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY")
            sessionToken = System.getenv("AWS_SESSION_TOKEN")
        },
    ),
)
```
<!--- KNIT example-handling-failures-07.kt -->

## タイムアウト設定

すべてのLLMクライアントは、ハングするリクエストを防ぐためにタイムアウト設定をサポートしています。
クライアント作成時に、[`ConnectionTimeoutConfig`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-connection-timeout-config/index.html)クラスを使用してネットワーク接続のタイムアウト値を指定できます。

`ConnectionTimeoutConfig`には、以下のプロパティがあります:

| プロパティ               | デフォルト値       | 説明                                   |
|------------------------|--------------------|----------------------------------------|
| `connectTimeoutMillis` | 60秒 (60,000)      | サーバーへの接続を確立する最大時間。   |
| `requestTimeoutMillis` | 15分 (900,000)     | リクエスト全体が完了する最大時間。     |
| `socketTimeoutMillis`  | 15分 (900,000)     | 確立された接続上でデータを待機する最大時間。 |

これらの値は、特定のニーズに合わせてカスタマイズできます。例:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.ConnectionTimeoutConfig
import ai.koog.prompt.executor.clients.openai.OpenAIClientSettings
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient

val apiKey = System.getenv("OPENAI_API_KEY")    
-->
```kotlin
val client = OpenAILLMClient(
    apiKey = apiKey,
    settings = OpenAIClientSettings(
        timeoutConfig = ConnectionTimeoutConfig(
            connectTimeoutMillis = 5000,    // 接続確立まで5秒
            requestTimeoutMillis = 60000,    // リクエスト全体で60秒
            socketTimeoutMillis = 120000   // ソケット上のデータで120秒
        )
    )
)
```
<!--- KNIT example-handling-failures-08.kt -->

!!! tip
    長時間実行される呼び出しやストリーミング呼び出しの場合は、`requestTimeoutMillis`および`socketTimeoutMillis`に高い値を設定してください。

## エラーハンドリング

プロダクション環境でLLMを使用する場合、以下を含むエラーハンドリングを実装する必要があります:

-   予期せぬエラーを処理するための**try-catchブロック**。
-   デバッグのために**コンテキストを含むエラーをログに記録**すること。
-   重要な操作のための**フォールバック**。
-   再発する問題を特定するための**リトライパターンの監視**。

以下にエラーハンドリングの例を示します:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
-->
```kotlin
fun main() {
    runBlocking {
        val logger = LoggerFactory.getLogger("Example")
        val resilientClient = RetryingLLMClient(
            OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
            RetryConfig.PRODUCTION
        )
        val prompt = prompt("test") { user("Hello") }
        val model = OpenAIModels.Chat.GPT4o

        fun processResponse(response: Any) { /* 実装 */ }
        fun scheduleRetryLater() { /* 実装 */ }
        fun notifyAdministrator() { /* 実装 */ }
        fun useDefaultResponse() { /* 実装 */ }

        try {
            val response = resilientClient.execute(prompt, model)
            processResponse(response)
        } catch (e: Exception) {
            logger.error("LLM operation failed", e)

            when {
                e.message?.contains("rate limit") == true -> {
                    // 特にレート制限を処理する
                    scheduleRetryLater()
                }
                e.message?.contains("invalid api key") == true -> {
                    // 認証エラーを処理する
                    notifyAdministrator()
                }
                else -> {
                    // 代替ソリューションにフォールバックする
                    useDefaultResponse()
                }
            }
        }
    }
}
```
<!--- KNIT example-handling-failures-09.kt -->