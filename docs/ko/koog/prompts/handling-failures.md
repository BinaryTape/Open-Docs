# 실패 처리

이 페이지에서는 내장된 재시도(retry) 및 타임아웃(timeout) 메커니즘을 사용하여 LLM 클라이언트와 프롬프트 실행기(prompt executor)의 실패를 처리하는 방법을 설명합니다.

## 재시도 기능

LLM 제공업체와 작업할 때, 속도 제한(rate limit)이나 일시적인 서비스 사용 불가와 같은 일시적 오류가 발생할 수 있습니다.
`RetryingLLMClient` 데코레이터는 모든 LLM 클라이언트에 자동 재시도 로직을 추가합니다.

### 기본 사용법

기존 클라이언트를 재시도 기능으로 래핑합니다:

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
// 모든 클라이언트를 재시도 기능으로 래핑합니다.
val client = OpenAILLMClient(apiKey)
val resilientClient = RetryingLLMClient(client)

// 이제 모든 작업은 일시적인 오류 발생 시 자동으로 재시도됩니다.
val response = resilientClient.execute(prompt, OpenAIModels.Chat.GPT4o)
```
<!--- KNIT example-handling-failures-01.kt -->

### 재시도 동작 구성

기본적으로 `RetryingLLMClient`는 최대 3번의 재시도, 1초의 초기 지연, 그리고 30초의 최대 지연으로 LLM 클라이언트를 구성합니다.
`RetryingLLMClient`에 전달되는 `RetryConfig`를 사용하여 다른 재시도 구성을 지정할 수 있습니다.
예를 들어:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 미리 정의된 구성 사용
val conservativeClient = RetryingLLMClient(
    delegate = client,
    config = RetryConfig.CONSERVATIVE
)
```
<!--- KNIT example-handling-failures-02.kt -->

Koog는 몇 가지 미리 정의된 재시도 구성을 제공합니다:

| 구성                 | 최대 시도 횟수 | 초기 지연 | 최대 지연 | 사용 사례                                                      |
|----------------------|----------------|-----------|-----------|----------------------------------------------------------------|
| `RetryConfig.DISABLED` | 1 (재시도 없음) | -         | -         | 개발, 테스트 및 디버깅.                                          |
| `RetryConfig.CONSERVATIVE` | 3              | 2초       | 30초      | 신뢰성이 속도보다 중요한 백그라운드 또는 예약된 작업.        |
| `RetryConfig.AGGRESSIVE`   | 5              | 500ms     | 20초      | 일시적 오류로부터의 빠른 복구가 API 호출 감소보다 중요한 중요 작업. |
| `RetryConfig.PRODUCTION`   | 3              | 1초       | 20초      | 일반적인 프로덕션 사용.                                          |

이들을 직접 사용하거나 사용자 지정 구성을 생성할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryingLLMClient
import kotlin.time.Duration.Companion.seconds

val apiKey = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(apiKey)
-->
```kotlin
// 또는 사용자 지정 구성 생성
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

### 재시도 오류 패턴

기본적으로 `RetryingLLMClient`는 일반적인 일시적 오류를 인식합니다.
이 동작은 [`RetryConfig.retryablePatterns`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/retryable-patterns.html) 패턴에 의해 제어됩니다.
각 패턴은 실패한 요청의 오류 메시지를 확인하고 재시도해야 하는지 여부를 결정하는
[`RetryablePattern`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retryable-pattern/index.html)
으로 표현됩니다.

Koog는 지원되는 모든 LLM 제공업체에서 작동하는 미리 정의된 재시도 구성 및 패턴을 제공합니다.
기본값을 유지하거나 특정 요구사항에 맞게 사용자 지정할 수 있습니다.

#### 패턴 유형

다음 패턴 유형을 사용하고 원하는 만큼 조합할 수 있습니다:

* `RetryablePattern.Status`: 오류 메시지에서 특정 HTTP 상태 코드(예: `429`, `500`, `502` 등)와 일치합니다.
* `RetryablePattern.Keyword`: 오류 메시지에서 키워드(예: `rate limit` 또는 `request timeout`)와 일치합니다.
* `RetryablePattern.Regex`: 오류 메시지에서 정규 표현식과 일치합니다.
* `RetryablePattern.Custom`: 람다 함수를 사용하여 사용자 지정 로직과 일치합니다.

어떤 패턴이라도 `true`를 반환하면 해당 오류는 재시도 가능하다고 간주되며, LLM 클라이언트는 요청을 재시도할 수 있습니다.

#### 기본 패턴

재시도 구성을 사용자 지정하지 않는 한, 다음 패턴이 기본적으로 사용됩니다:

*   **HTTP 상태 코드**:
    *   `429`: 속도 제한
    *   `500`: 내부 서버 오류
    *   `502`: 잘못된 게이트웨이
    *   `503`: 서비스 이용 불가
    *   `504`: 게이트웨이 타임아웃
    *   `529`: Anthropic 과부하

*   **오류 키워드**:
    *   `rate limit` (속도 제한)
    *   `too many requests` (요청 과다)
    *   `request timeout` (요청 타임아웃)
    *   `connection timeout` (연결 타임아웃)
    *   `read timeout` (읽기 타임아웃)
    *   `write timeout` (쓰기 타임아웃)
    *   `connection reset by peer` (피어에 의한 연결 재설정)
    *   `connection refused` (연결 거부됨)
    *   `temporarily unavailable` (일시적으로 이용 불가)
    *   `service unavailable` (서비스 이용 불가)

이러한 기본 패턴은 Koog에서 [`RetryConfig.DEFAULT_PATTERNS`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients.retry/-retry-config/-companion/-d-e-f-a-u-l-t_-p-a-t-t-e-r-n-s.html)로 정의되어 있습니다.

#### 사용자 지정 패턴

특정 요구사항에 맞게 사용자 지정 패턴을 정의할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.executor.clients.retry.RetryConfig
import ai.koog.prompt.executor.clients.retry.RetryablePattern
-->
```kotlin
val config = RetryConfig(
    retryablePatterns = listOf(
        RetryablePattern.Status(429),   // 특정 상태 코드
        RetryablePattern.Keyword("quota"),  // 오류 메시지의 키워드
        RetryablePattern.Regex(Regex("ERR_\\d+")),  // 사용자 지정 정규식 패턴
        RetryablePattern.Custom { error ->  // 사용자 지정 로직
            error.contains("temporary") && error.length > 20
        }
    )
)
```
<!--- KNIT example-handling-failures-04.kt -->

기본 `RetryConfig.DEFAULT_PATTERNS`에 사용자 지정 패턴을 추가할 수도 있습니다:

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

### 재시도를 통한 스트리밍

스트리밍 작업은 선택적으로 재시도될 수 있습니다. 이 기능은 기본적으로 비활성화되어 있습니다.

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
    스트리밍 재시도는 첫 번째 토큰을 받기 전에 발생하는 연결 실패에만 적용됩니다.
    스트리밍이 시작된 후에는 재시도 로직이 비활성화됩니다.
    스트리밍 중 오류가 발생하면 작업은 종료됩니다.

### 프롬프트 실행기를 사용한 재시도

프롬프트 실행기와 함께 작업할 때, 실행기를 생성하기 전에 기본 LLM 클라이언트를 재시도 메커니즘으로 래핑할 수 있습니다.
프롬프트 실행기에 대해 자세히 알아보려면 [프롬프트 실행기](prompt-executors.md)를 참조하세요.

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
// 재시도를 지원하는 단일 제공업체 실행기
val resilientClient = RetryingLLMClient(
    OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
    RetryConfig.PRODUCTION
)
val executor = MultiLLMPromptExecutor(resilientClient)

// 유연한 클라이언트 구성을 가진 다중 제공업체 실행기
val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to RetryingLLMClient(
        OpenAILLMClient(System.getenv("OPENAI_API_KEY")),
        RetryConfig.CONSERVATIVE
    ),
    LLMProvider.Anthropic to RetryingLLMClient(
        AnthropicLLMClient(System.getenv("ANTHROPIC_API_KEY")),
        RetryConfig.AGGRESSIVE  
    ),
    // Bedrock 클라이언트는 이미 내장된 AWS SDK 재시도 기능을 가지고 있습니다.
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

## 타임아웃 구성

모든 LLM 클라이언트는 요청이 중단되는 것을 방지하기 위해 타임아웃 구성을 지원합니다.
클라이언트를 생성할 때 [`ConnectionTimeoutConfig`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-connection-timeout-config/index.html) 클래스를 사용하여 네트워크 연결에 대한 타임아웃 값을 지정할 수 있습니다.

`ConnectionTimeoutConfig`에는 다음과 같은 속성이 있습니다:

| 속성                   | 기본값              | 설명                                                  |
|------------------------|---------------------|-------------------------------------------------------|
| `connectTimeoutMillis` | 60초 (60,000)       | 서버에 대한 연결을 설정하는 최대 시간.                |
| `requestTimeoutMillis` | 15분 (900,000)      | 전체 요청이 완료되는 최대 시간.                       |
| `socketTimeoutMillis`  | 15분 (900,000)      | 설정된 연결을 통해 데이터를 기다리는 최대 시간.       |

특정 요구사항에 맞게 이 값들을 사용자 지정할 수 있습니다. 예를 들어:

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
            connectTimeoutMillis = 5000,    // 연결을 설정하는 데 5초
            requestTimeoutMillis = 60000,    // 전체 요청에 60초
            socketTimeoutMillis = 120000   // 소켓을 통해 데이터를 주고받는 데 120초
        )
    )
)
```
<!--- KNIT example-handling-failures-08.kt -->

!!! tip
    장시간 실행되거나 스트리밍되는 호출의 경우 `requestTimeoutMillis` 및 `socketTimeoutMillis`에 더 높은 값을 설정하세요.

## 오류 처리

프로덕션 환경에서 LLM과 함께 작업할 때 다음을 포함한 오류 처리를 구현해야 합니다:

-   예상치 못한 오류를 처리하기 위한 **Try-catch 블록**.
-   디버깅을 위해 **맥락과 함께 오류 로깅**.
-   중요 작업에 대한 **대체(Fallback)**.
-   반복되는 문제를 식별하기 위한 **재시도 패턴 모니터링**.

오류 처리의 예시는 다음과 같습니다:

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

        fun processResponse(response: Any) { /* 구현 */ }
        fun scheduleRetryLater() { /* 구현 */ }
        fun notifyAdministrator() { /* 구현 */ }
        fun useDefaultResponse() { /* 구현 */ }

        try {
            val response = resilientClient.execute(prompt, model)
            processResponse(response)
        } catch (e: Exception) {
            logger.error("LLM 작업 실패", e)

            when {
                e.message?.contains("rate limit") == true -> {
                    // 속도 제한을 구체적으로 처리
                    scheduleRetryLater()
                }
                e.message?.contains("invalid api key") == true -> {
                    // 인증 오류 처리
                    notifyAdministrator()
                }
                else -> {
                    // 대체 솔루션으로 폴백(fallback)
                    useDefaultResponse()
                }
            }
        }
    }
}
```
<!--- KNIT example-handling-failures-09.kt -->