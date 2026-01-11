# 故障处理

本页介绍如何使用内置的重试和超时机制处理 LLM 客户端和提示词执行器的故障。

## 重试功能

使用 LLM 提供方时，可能会发生瞬时错误，例如速率限制或临时服务不可用。`RetryingLLMClient` 装饰器为任何 LLM 客户端添加了自动重试逻辑。

### 基本用法

使用重试能力包装任何现有客户端：

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
// 使用重试能力包装任何客户端
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// 现在所有操作都将在瞬时错误发生时自动重试
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-handling-failures-01.kt -->

### 配置重试行为

默认情况下，`RetryingLLMClient` 会为 LLM 客户端配置最多 3 次重试尝试、1 秒的初始延迟和 30 秒的最大延迟。你可以通过向 `RetryingLLMClient` 传递 `RetryConfig` 来指定不同的重试配置。例如：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 使用预定义配置
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)
```
<!--- KNIT example-handling-failures-02.kt -->

Koog 提供了几种预定义的重试配置：

| 配置 | 最大尝试次数 | 初始延迟 | 最大延迟 | 用例 |
|---|---|---|---|---|
| `RetryConfig.DISABLED` | 1 (不重试) | - | - | 开发、测试和调试。 |
| `RetryConfig.CONSERVATIVE` | 3 | 2s | 30s | 后台或计划任务，其中可靠性比速度更重要。 |
| `RetryConfig.AGGRESSIVE` | 5 | 500ms | 20s | 关键操作，其中从瞬时错误中快速恢复比减少 API 调用更重要。 |
| `RetryConfig.PRODUCTION` | 3 | 1s | 20s | 一般生产使用。 |

你可以直接使用它们，也可以创建自定义配置：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 或者创建自定义配置
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

### 重试错误模式

默认情况下，`RetryingLLMClient` 识别常见的瞬时错误。此行为由 [`RetryConfig.retryablePatterns`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/retryable-patterns.html) 模式控制。每个模式都由
[`RetryablePattern`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retryable-pattern/index.html) 表示，它检查失败请求的错误消息并确定是否应该重试。

Koog 提供了预定义的重试配置和模式，适用于所有支持的 LLM 提供方。你可以保留默认值，也可以根据特定需求进行自定义。

#### 模式类型

你可以使用以下模式类型并组合任意数量的模式：

*   `RetryablePattern.Status`：匹配错误消息中的特定 HTTP 状态码（例如 `429`、`500`、`502` 等）。
*   `RetryablePattern.Keyword`：匹配错误消息中的关键词（例如 `rate limit` 或 `request timeout`）。
*   `RetryablePattern.Regex`：匹配错误消息中的正则表达式。
*   `RetryablePattern.Custom`：使用 lambda 函数匹配自定义逻辑。

如果任何模式返回 `true`，则该错误被认为是可重试的，LLM 客户端可以重试请求。

#### 默认模式

除非你自定义重试配置，否则默认使用以下模式：

*   **HTTP 状态码**：
    *   `429`：速率限制
    *   `500`：内部服务器错误
    *   `502`：错误的网关
    *   `503`：服务不可用
    *   `504`：网关超时
    *   `529`：Anthropic 过载

*   **错误关键词**：
    *   rate limit
    *   too many requests
    *   request timeout
    *   connection timeout
    *   read timeout
    *   write timeout
    *   connection reset by peer
    *   connection refused
    *   temporarily unavailable
    *   service unavailable

这些默认模式在 Koog 中定义为 [`RetryConfig.DEFAULT_PATTERNS`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/-companion/-d-e-f-a-u-l-t_-p-a-t-t-e-r-n-s.html)。

#### 自定义模式

你可以根据特定需求定义自定义模式：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),   // 特定状态码
        RetryablePattern.Keyword("quota"),  // 错误消息中的关键词
        RetryablePattern.Regex(Regex("ERR_\\d+")),  // 自定义正则表达式模式
        RetryablePattern.Custom { error ->  // 自定义逻辑
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-handling-failures-04.kt -->

你还可以将自定义模式添加到默认的 `RetryConfig.DEFAULT_PATTERNS` 中：

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

### 带重试的流式传输

流式操作可以选择性地重试。此功能默认禁用。

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
    流式传输重试仅适用于在收到第一个令牌之前发生的连接失败。流式传输开始后，重试逻辑将禁用。如果流式传输期间发生错误，操作将被终止。

### 提示词执行器带重试

使用提示词执行器时，你可以在创建执行器之前，使用重试机制包装底层 LLM 客户端。关于提示词执行器的更多信息，请参见 [提示词执行器](prompt-executors.md)。

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
// 带重试的单提供方执行器
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
    RetryConfig.PRODUCTION
)
val executor = MultiLLMPromptExecutor(resilientClient)

// 带灵活客户端配置的多提供方执行器
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 客户端已经内置了 AWS SDK 重试
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

## 超时配置

所有 LLM 客户端都支持超时配置，以防止请求挂起。你可以在创建客户端时，使用 [`ConnectionTimeoutConfig`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-connection-timeout-config/index.html) 类为网络连接指定超时值。

`ConnectionTimeoutConfig` 具有以下属性：

| 属性 | 默认值 | 描述 |
|---|---|---|
| `connectTimeoutMillis` | 60 秒 (60,000) | 建立到服务器连接的最大时间。 |
| `requestTimeoutMillis` | 15 分钟 (900,000) | 整个请求完成的最大时间。 |
| `socketTimeoutMillis` | 15 分钟 (900,000) | 等待通过已建立连接传输数据的最大时间。 |

你可以根据特定需求自定义这些值。例如：

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
            connectTimeoutMillis = 5000,    // 5 秒用于建立连接
            requestTimeoutMillis = 60000,    // 60 秒用于整个请求
            socketTimeoutMillis = 120000   // 120 秒用于套接字上的数据
        )
    )
)
```
<!--- KNIT example-handling-failures-08.kt -->

!!! tip
    对于长时间运行或流式传输调用，请为 `requestTimeoutMillis` 和 `socketTimeoutMillis` 设置更高的值。

## 错误处理

在生产环境中处理 LLM 时，你需要实现错误处理，包括：

-   **Try-catch 代码块**：处理意外错误。
-   **记录带上下文的错误**：用于调试。
-   **备用方案**：用于关键操作。
-   **监控重试模式**：识别重复出现的问题。

以下是一个错误处理的例子：

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

        fun processResponse(response: Any) { /* implmenentation */ }
        fun scheduleRetryLater() { /* implmenentation */ }
        fun notifyAdministrator() { /* implmenentation */ }
        fun useDefaultResponse() { /* implmenentation */ }

        try {
            val response = resilientClient.execute(prompt, model)
            processResponse(response)
        } catch (e: Exception) {
            logger.error("LLM operation failed", e)

            when {
                e.message?.contains("rate limit") == true -> {
                    // 具体处理速率限制
                    scheduleRetryLater()
                }
                e.message?.contains("invalid api key") == true -> {
                    // 处理认证错误
                    notifyAdministrator()
                }
                else -> {
                    // 回退到替代解决方案
                    useDefaultResponse()
                }
            }
        }
    }
}
```
<!--- KNIT example-handling-failures-09.kt -->