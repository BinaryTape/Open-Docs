# 處理失敗

本頁介紹如何使用內建的重試與逾時機制，為 LLM 用戶端和提示執行器處理失敗。

## 重試功能

使用 LLM 供應商時，可能會發生暫時性錯誤，例如速率限制或服務暫時不可用。`RetryingLLMClient` 裝飾器會為任何 LLM 用戶端新增自動重試邏輯。

### 基本用法

將任何現有用戶端包裝重試功能：

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
// 將任何用戶端包裝重試功能
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// 現在，所有操作都會在暫時性錯誤時自動重試
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-handling-failures-01.kt -->

### 配置重試行為

依預設，`RetryingLLMClient` 會將 LLM 用戶端配置為最多 3 次重試嘗試、1 秒的初始延遲以及 30 秒的最大延遲。您可以透過傳遞給 `RetryingLLMClient` 的 `RetryConfig` 來指定不同的重試配置。例如：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 使用預定義的配置
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)
```
<!--- KNIT example-handling-failures-02.kt -->

Koog 提供數種預定義的重試配置：

| 配置                 | 最大嘗試次數 | 初始延遲 | 最大延遲 | 使用情境                                                                                                     |
|----------------------|--------------|----------|----------|--------------------------------------------------------------------------------------------------------------|
| `RetryConfig.DISABLED`     | 1 (不重試)   | -        | -        | 開發、測試與偵錯。                                                                                           |
| `RetryConfig.CONSERVATIVE` | 3            | 2s       | 30s      | 可靠性比速度更重要的背景或排程任務。                                                                       |
| `RetryConfig.AGGRESSIVE`   | 5            | 500ms    | 20s      | 從暫時性錯誤中快速復原比減少 API 呼叫更重要的關鍵操作。                                                    |
| `RetryConfig.PRODUCTION`   | 3            | 1s       | 20s      | 一般生產環境使用。                                                                                           |

您可以直接使用它們或建立自訂配置：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 或建立自訂配置
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

### 重試錯誤模式

依預設，`RetryingLLMClient` 會識別常見的暫時性錯誤。此行為由 [`RetryConfig.retryablePatterns`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/retryable-patterns.html) 模式控制。每個模式由
[`RetryablePattern`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retryable-pattern/index.html) 表示，它會檢查來自失敗請求的錯誤訊息，並判斷是否應該重試。

Koog 提供預定義的重試配置和模式，適用於所有支援的 LLM 供應商。您可以保留預設值，或根據您的特定需求進行自訂。

#### 模式類型

您可以使用以下模式類型並將它們任意組合：

*   `RetryablePattern.Status`：比對錯誤訊息中的特定 HTTP 狀態碼 (例如 `429`、`500`、`502` 等)。
*   `RetryablePattern.Keyword`：比對錯誤訊息中的關鍵字 (例如 `rate limit` 或 `request timeout`)。
*   `RetryablePattern.Regex`：比對錯誤訊息中的正規表達式。
*   `RetryablePattern.Custom`：使用 lambda 函數比對自訂邏輯。

如果任何模式回傳 `true`，該錯誤被視為可重試的，且 LLM 用戶端會重試請求。

#### 預設模式

除非您自訂重試配置，否則預設使用以下模式：

*   **HTTP 狀態碼**：
    *   `429`：速率限制
    *   `500`：內部伺服器錯誤
    *   `502`：無效閘道
    *   `503`：服務不可用
    *   `504`：閘道逾時
    *   `529`：Anthropic 超載

*   **錯誤關鍵字**：
    *   rate limit (速率限制)
    *   too many requests (過多請求)
    *   request timeout (請求逾時)
    *   connection timeout (連線逾時)
    *   read timeout (讀取逾時)
    *   write timeout (寫入逾時)
    *   connection reset by peer (對方重設連線)
    *   connection refused (連線拒絕)
    *   temporarily unavailable (暫時不可用)
    *   service unavailable (服務不可用)

這些預設模式在 Koog 中定義為 [`RetryConfig.DEFAULT_PATTERNS`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/-companion/-d-e-f-a-u-l-t_-p-a-t-t-e-r-n-s.html)。

#### 自訂模式

您可以定義自訂模式以滿足您的特定需求：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),   // 特定狀態碼
        RetryablePattern.Keyword("quota"),  // 錯誤訊息中的關鍵字
        RetryablePattern.Regex(Regex("ERR_\\d+")),  // 自訂正規表達式模式
        RetryablePattern.Custom { error ->  // 自訂邏輯
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-handling-failures-04.kt -->

您也可以將自訂模式附加到預設的 `RetryConfig.DEFAULT_PATTERNS`：

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

### 串流重試

串流操作可選擇性地重試。此功能預設為停用。

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
    串流重試僅適用於在收到第一個 token 之前發生的連線失敗。串流開始後，重試邏輯會停用。如果串流期間發生錯誤，操作將會終止。

### 提示執行器的重試

使用提示執行器時，您可以在建立執行器之前，將底層 LLM 用戶端包裝重試機制。要了解有關提示執行器的更多資訊，請參閱 [提示執行器](prompt-executors.md)。

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
// 具有重試功能的單一供應商執行器
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
    RetryConfig.PRODUCTION
)
val executor = MultiLLMPromptExecutor(resilientClient)

// 具有彈性用戶端配置的多供應商執行器
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 用戶端已內建 AWS SDK 重試 
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

## 逾時配置

所有 LLM 用戶端都支援逾時配置以防止請求掛起。您可以在建立用戶端時，使用
[`ConnectionTimeoutConfig`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-connection-timeout-config/index.html) 類別指定網路連線的逾時值。

`ConnectionTimeoutConfig` 具有以下屬性：

| 屬性                 | 預設值              | 說明                                           |
|----------------------|---------------------|------------------------------------------------|
| `connectTimeoutMillis` | 60 秒 (60,000)      | 建立與伺服器連線所需的最大時間。             |
| `requestTimeoutMillis` | 15 分鐘 (900,000)   | 整個請求完成所需的最大時間。                 |
| `socketTimeoutMillis`  | 15 分鐘 (900,000)   | 等待已建立連線上資料所需的最大時間。         |

您可以根據您的特定需求自訂這些值。例如：

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
            connectTimeoutMillis = 5000,    // 建立連線的 5 秒
            requestTimeoutMillis = 60000,    // 整個請求的 60 秒
            socketTimeoutMillis = 120000   // Socket 上資料的 120 秒
        )
    )
)
```
<!--- KNIT example-handling-failures-08.kt -->

!!! tip
    對於長時間執行或串流呼叫，請為 `requestTimeoutMillis` 和 `socketTimeoutMillis` 設定更高的值。

## 錯誤處理

在生產環境中使用 LLM 時，您需要實作錯誤處理，包括：

*   **Try-catch 區塊**以處理意外錯誤。
*   **記錄帶有上下文的錯誤**以進行偵錯。
*   **備援**以應對關鍵操作。
*   **監控重試模式**以識別重複出現的問題。

以下是一個錯誤處理的範例：

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

        fun processResponse(response: Any) { /* 實作 */ }
        fun scheduleRetryLater() { /* 實作 */ }
        fun notifyAdministrator() { /* 實作 */ }
        fun useDefaultResponse() { /* 實作 */ }

        try {
            val response = resilientClient.execute(prompt, model)
            processResponse(response)
        } catch (e: Exception) {
            logger.error("LLM operation failed", e)

            when {
                e.message?.contains("rate limit") == true -> {
                    // 專門處理速率限制
                    scheduleRetryLater()
                }
                e.message?.contains("invalid api key") == true -> {
                    // 處理驗證錯誤
                    notifyAdministrator()
                }
                else -> {
                    // 回退到替代方案
                    useDefaultResponse()
                }
            }
        }
    }
}
```
<!--- KNIT example-handling-failures-09.kt -->