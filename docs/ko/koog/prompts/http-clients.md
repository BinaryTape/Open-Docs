# HTTP 클라이언트

Koog의 모든 LLM 클라이언트는 프레임워크가 프로바이더와 통신하는 데 사용하는 추상 HTTP 규약인 [`KoogHttpClient`](api:http-client-core::ai.koog.http.client.KoogHttpClient)를 필요로 합니다. 생성 시점에 이를 전달해야 합니다.

`KoogHttpClient`를 직접 빌드할 수도 있지만, 이는 상당히 번거로운 작업입니다. 각 프로바이더마다 고유한 베이스 URL, 인증 헤더 형태, 콘텐츠 타입(content-type), SSE 컨벤션이 있기 때문입니다. 프로바이더마다 이러한 설정을 정확하게 맞추는 수고를 덜어주기 위해 [`KoogHttpClient.Factory`](api:http-client-core::ai.koog.http.client.KoogHttpClient.Factory)가 존재합니다. 사용자가 `Factory`를 전달하면, 프로바이더 클라이언트는 해당 API에 맞는 파라미터를 사용하여 `Factory.create(...)`를 호출합니다.

Ktor, JDK `HttpClient`, OkHttp, Spring `WebClient` 등 네 가지 백엔드 팩토리가 기본으로 제공되며, 직접 구현할 수도 있습니다.

## 작동 방식

하나의 팩토리가 모든 프로바이더에 작동하므로, 백엔드를 한 번 선택하면 여러 클라이언트에서 사용할 수 있습니다.

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

## 지원되는 HTTP 클라이언트 종류

| 모듈                                                                    | 참고 사항                                              |
|-------------------------------------------------------------------------|----------------------------------------------------|
| [`http-client-ktor`](api:http-client-ktor::)                            | non-JVM 타겟에서 사용할 수 있는 유일한 백엔드입니다.      |
| [`http-client-java`](api:http-client-java::)                            | JDK 11+의 `java.net.http.HttpClient`를 래핑합니다.      |
| [`http-client-okhttp`](api:http-client-okhttp::)                        | OkHttp를 기반으로 합니다. Android 친화적입니다.                |
| [`http-client-spring-webclient`](api:http-client-spring-webclient::)    | Spring `WebClient`를 기반으로 합니다.                      |

## 편의 API 및 팩토리 자동 감지

JVM 및 Android에서는 팩토리를 명시적으로 전달하지 않고도 각 LLM 클라이언트를 생성할 수 있습니다.

내부적으로 [`HttpClientFactoryResolver`](api:http-client-core::ai.koog.http.client.HttpClientFactoryResolver)는 `java.util.ServiceLoader`를 사용하여 런타임 클래스패스에서 `KoogHttpClient.Factory`를 찾아냅니다:

- 모든 백엔드 모듈은 `ServiceLoader` 등록 정보를 제공합니다.
- 런타임 클래스패스에 정확히 하나의 팩토리가 보일 때만 확인(resolution)에 성공합니다.
- `prompt-executor-llms-all`은 `http-client-ktor`를 `runtimeOnly` 의존성으로 선언하므로, 컴파일 타임에 해당 모듈이 노출되지 않고도 기본적으로 Ktor를 사용할 수 있습니다.
- `simple<Provider>Executor(apiKey)`와 `PromptExecutorBuilder.<provider>(apiKey)`도 동일한 확인 경로를 사용합니다.

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

현재 KMP에서는 자동 감지가 지원되지 않으므로, JVM 이외의 환경에서는 이러한 편의 메서드를 사용할 수 없습니다. `commonMain`에서는 `Factory`를 명시적으로 전달하십시오.

### 자동 감지 시 주의사항

- **런타임 클래스패스에 백엔드가 없는 경우** → 첫 번째 확인 시 `IllegalStateException`이 발생합니다. 런타임 클래스패스에 백엔드 모듈을 추가하거나 `Factory`를 명시적으로 전달하십시오.
- **두 개 이상의 백엔드가 있는 경우** → 동일한 예외가 발생하며, 메시지에는 발견된 프로바이더들의 이름이 표시됩니다. Gradle을 사용하여 하나를 제외한 나머지를 제외(`exclude(module = "http-client-ktor")` 등)하거나 호출 시점에서 `Factory`를 명시적으로 전달하십시오.

## 커스텀 백엔드

`KoogHttpClient.Factory`를 구현하는 모든 클래스를 사용할 수 있습니다. JVM에서 자동 감지가 가능하게 하려면 이를 `ServiceLoader` 프로바이더로 등록하십시오:

```
src/main/resources/META-INF/services/ai.koog.http.client.KoogHttpClient$Factory
```

이 파일에는 팩토리 클래스의 정규화된 이름(fully qualified name)을 한 줄로 적습니다. 리터럴 `$`(중첩된 `Factory` 클래스의 구분자)가 맞습니다. 즉, 파일명은 `KoogHttpClient.Factory`가 아니라 `KoogHttpClient$Factory`여야 합니다.

자동 감지를 원하지 않는다면 등록 과정을 건너뛰고 모든 곳에 팩토리를 명시적으로 전달하십시오.