# 프롬프트 캐싱 제어 (Prompt caching control)

프롬프트 캐싱 제어를 통해 지원되는 LLM 제공자가 프롬프트의 일부를 서버 측에 저장하도록 지시할 수 있습니다. 이를 통해 동일한 접두사(prefix)를 공유하는 후속 요청을 토큰 재처리 대신 캐시에서 처리할 수 있습니다.
이는 멀티턴 대화(multi-turn conversations), 대규모 시스템 프롬프트 또는 고정된 도구 정의와 같이 반복적인 작업 부하에 대해 지연 시간(latency)과 비용을 모두 줄여줍니다.

!!! note "프롬프트 캐싱 vs. 응답 캐싱"
    프롬프트 캐싱 제어는 **제공자 측(provider-side)** 기능입니다. 제공자는 응답이 아닌 프롬프트 접두사를 저장합니다. 이는 전체 LLM 응답을 로컬에 저장하여 동일한 프롬프트에 대해 네트워크 호출을 완전히 건너뛰는 [`CachedPromptExecutor`](../llm-response-caching.md)와는 다릅니다.

Koog는 **Anthropic** 및 **Amazon Bedrock**에 대한 프롬프트 캐싱 제어를 지원합니다.

## Anthropic

Anthropic은 프롬프트 캐싱에 대해 두 가지 보완적인 접근 방식을 지원합니다.

### 자동 캐싱 (요청 수준)

[`AnthropicParams`](../../llm-parameters.md)에서 `cacheControl` 속성을 설정하고 이를 프롬프트에 전달합니다.
Anthropic은 개별 메시지에 주석을 달지 않아도 요청의 마지막 캐싱 가능한 블록에 자동으로 캐시 중단점(cache breakpoint)을 배치합니다.
이 방식은 멀티턴 대화에 권장되는 접근 방식입니다.

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
    // 기본 5분 TTL로 자동 캐싱 활성화
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
    // 기본 5분 TTL로 자동 캐싱 활성화
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

### 수동 캐싱 (블록 수준)

개별 메시지나 도구 정의에 `cacheControl` 인자를 추가하여 특정 위치에 캐시 중단점을 배치합니다. 주석이 달린 블록을 포함하여 그 앞의 모든 내용이 캐싱 대상이 됩니다.

#### 시스템 메시지

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
        // 시스템 프롬프트를 1시간 동안 캐싱
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
        // 시스템 프롬프트를 1시간 동안 캐싱
        .system("You are a knowledgeable assistant...", AnthropicCacheControl.OneHour.INSTANCE)
        .user("Summarize the latest AI research.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-02.java -->

#### 사용자 및 어시스턴트 메시지

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
        // 큰 사용자 메시지(예: 문서 내용) 이후에 캐싱
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
        // 큰 사용자 메시지(예: 문서 내용) 이후에 캐싱
        .user(List.of(new ContentPart.Text("Here is a long document: ...")), AnthropicCacheControl.Default.INSTANCE)
        .assistant("I have read the document.", AnthropicCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-03.java -->

#### 도구 정의

도구 목록이 여러 요청에 걸쳐 고정되어 있는 경우, 마지막 도구 정의를 캐싱하면 모든 도구 스키마가 함께 캐싱됩니다.

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
        // 이 도구 정의를 포함하여 이전의 모든 도구 정의를 캐싱
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
        // 이 도구 정의를 포함하여 이전의 모든 도구 정의를 캐싱
        AnthropicCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-04.java -->

### 캐시 TTL 옵션

| 옵션 | TTL | 가격 배수 |
|-------------------------------|----------|-------------------------|
| `AnthropicCacheControl.Default`  | 5분 | 기본 입력 가격의 1.25배 |
| `AnthropicCacheControl.OneHour`  | 1시간 | 기본 입력 가격의 2배 |

캐시 쓰기는 일반 입력 토큰보다 높은 요율로 청구되지만, 캐시 읽기는 더 저렴합니다.
현재 가격은 [Anthropic 프롬프트 캐싱 문서](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)를 참조하세요.

### 캐시 사용량 모니터링

Anthropic은 응답 사용량(usage)에 캐시 통계를 보고합니다. 이는 원본 API 응답을 통해 액세스할 수 있으며 트레이싱 또는 로깅 기능을 통해 관찰할 수 있습니다.

| 필드 | 의미 |
|-----------------------------|------------------------------------------------------|
| `cacheReadInputTokens`      | 기존 캐시 항목에서 읽은 토큰 수 |
| `cacheCreationInputTokens`  | 새 캐시 항목에 기록된 토큰 수 |

### 자동 및 블록 수준 캐싱 결합

두 모드를 동시에 사용할 수 있습니다. 블록 수준 `cacheControl` 마커는 중단점 위치에 대한 세밀한 제어를 제공하며, `AnthropicParams`의 요청 수준 `cacheControl`은 대화의 나머지 뒷부분을 자동으로 처리합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.anthropic.AnthropicCacheControl
    import ai.koog.prompt.executor.clients.anthropic.AnthropicParams
    -->

    ```kotlin
    // 블록 수준: 시스템 프롬프트를 1시간 캐시 계층에 고정
    // 자동: Anthropic이 대화 뒷부분의 중단점을 관리하도록 설정
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
    // 블록 수준: 시스템 프롬프트를 1시간 캐시 계층에 고정
    // 자동: Anthropic이 대화 뒷부분의 중단점을 관리하도록 설정
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

Amazon Bedrock은 Converse API를 통해 블록 수준 캐싱 모델을 사용합니다.
메시지나 도구에 `cacheControl`이 설정되면, Bedrock은 해당 요소 바로 뒤에 `CachePoint` 블록을 삽입합니다.

!!! note
    Bedrock 프롬프트 캐싱은 Bedrock 클라이언트 자체가 JVM 전용이므로 JVM 전용 기능입니다.

### 시스템 메시지

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
    import kotlin.time.Clock
    
    fun main() = runBlocking {
        val client = BedrockLLMClient(
            identityProvider = StaticBearerTokenProvider(token = "test-token"),
            settings = BedrockClientSettings(region = BedrockRegions.US_EAST_1.regionCode),
            clock = Clock.System
        )
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("assistant") {
        // 기본 TTL을 사용하여 시스템 프롬프트 캐싱
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
        // 기본 TTL을 사용하여 시스템 프롬프트 캐싱
        .system("You are a knowledgeable assistant...", BedrockCacheControl.Default.INSTANCE)
        .user("What is prompt caching?")
        .build();
    ```
    <!--- KNIT example-cache-control-java-06.java -->

### 사용자 및 어시스턴트 메시지

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
    import kotlin.time.Clock
    
    fun main() = runBlocking {
        val client = BedrockLLMClient(
            identityProvider = StaticBearerTokenProvider(token = "test-token"),
            settings = BedrockClientSettings(region = BedrockRegions.US_EAST_1.regionCode),
            clock = Clock.System
        )
    -->
    <!--- SUFFIX
    }
    -->

    ```kotlin
    val prompt = prompt("conversation") {
        system("You are a helpful assistant.")
        // 큰 컨텍스트 메시지 이후에 캐싱
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
        // 큰 컨텍스트 메시지 이후에 캐싱
        .user("Here is the document: ...", BedrockCacheControl.FiveMinutes.INSTANCE)
        .assistant("I have read the document.", BedrockCacheControl.Default.INSTANCE)
        .user("Summarize it.")
        .build();
    ```
    <!--- KNIT example-cache-control-java-07.java -->

### 도구 정의

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
        // 이 도구 정의를 포함하여 이전의 모든 도구 정의를 캐싱
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
        // 이 도구 정의를 포함하여 이전의 모든 도구 정의를 캐싱
        BedrockCacheControl.Default.INSTANCE
    );
    ```
    <!--- KNIT example-cache-control-java-08.java -->

### 캐시 TTL 옵션

| 옵션 | TTL |
|--------------------------------|-----------|
| `BedrockCacheControl.Default`  | 제공자 기본값 (명시적 TTL 전송 안 함) |
| `BedrockCacheControl.FiveMinutes` | 5분 |
| `BedrockCacheControl.OneHour`  | 1시간 |

지원되는 모델 및 가격은 [Amazon Bedrock 프롬프트 캐싱 문서](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)를 참조하세요.

---

## 캐싱 전략 선택하기

| 상황 | 권장 접근 방식 |
|---------------------------------------------------|-------------------------------------------------------------|
| 대규모 고정 시스템 프롬프트가 있는 멀티턴 채팅 | Anthropic 자동 캐싱 또는 시스템에 Bedrock 블록 수준 적용 |
| 여러 요청에서 재사용되는 안정적인 도구 정의 | 마지막 도구 정의에 블록 수준 `cacheControl` 적용 |
| 사용자 컨텍스트로 전달되는 긴 문서 | 사용자 메시지에 블록 수준 `cacheControl` 적용 |
| 임의의 멀티턴 대화 (Anthropic) | `AnthropicParams.cacheControl`을 통한 자동 캐싱 |
| 1시간 캐시 유지가 필요한 경우 | `AnthropicCacheControl.OneHour` / `BedrockCacheControl.OneHour` |