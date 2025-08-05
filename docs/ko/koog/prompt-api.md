# 프롬프트 API

프롬프트 API를 사용하면 Kotlin DSL을 통해 잘 구성된 프롬프트를 생성하고, 다양한 LLM 제공자에 대해 실행하며, 여러 형식으로 응답을 처리할 수 있습니다.

## 프롬프트 생성

프롬프트 API는 Kotlin DSL을 사용하여 프롬프트를 생성합니다. 다음 유형의 메시지를 지원합니다:

- `system`: LLM의 컨텍스트와 지시사항을 설정합니다.
- `user`: 사용자 입력을 나타냅니다.
- `assistant`: LLM 응답을 나타냅니다.

다음은 간단한 프롬프트의 예시입니다:

```kotlin
val prompt = prompt("prompt_name", LLMParams()) {
    // 컨텍스트를 설정하기 위한 시스템 메시지 추가
    system("You are a helpful assistant.")

    // 사용자 메시지 추가
    user("Tell me about Kotlin")

    // 퓨샷(few-shot) 예시를 위해 어시스턴트 메시지를 추가할 수도 있습니다.
    assistant("Kotlin is a modern programming language...")

    // 또 다른 사용자 메시지 추가
    user("What are its key features?")
}
```

## 프롬프트 실행

특정 LLM으로 프롬프트를 실행하려면 다음을 수행해야 합니다:

1.  애플리케이션과 LLM 제공자 간의 연결을 처리하는 해당 LLM 클라이언트를 생성합니다. 예를 들면 다음과 같습니다:
    ```kotlin
    // OpenAI 클라이언트 생성
    val client = OpenAILLMClient(apiKey)
    ```
2.  `execute` 메서드를 프롬프트와 LLM을 인수로 사용하여 호출합니다.
    ```kotlin
    // 프롬프트 실행
    val response = client.execute(
        prompt = prompt,
        model = OpenAIModels.Chat.GPT4o  // 다른 모델을 선택할 수 있습니다.
    )
    ```

다음 LLM 클라이언트를 사용할 수 있습니다:

*   [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)
*   [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)
*   [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)
*   [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html)
*   [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)

다음은 프롬프트 API 사용의 간단한 예시입니다:

```kotlin
fun main() {
    // API 키로 OpenAI 클라이언트 설정
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 프롬프트 생성
    val prompt = prompt("prompt_name", LLMParams()) {
        // 컨텍스트를 설정하기 위한 시스템 메시지 추가
        system("You are a helpful assistant.")

        // 사용자 메시지 추가
        user("Tell me about Kotlin")

        // 퓨샷(few-shot) 예시를 위해 어시스턴트 메시지를 추가할 수도 있습니다.
        assistant("Kotlin is a modern programming language...")

        // 또 다른 사용자 메시지 추가
        user("What are its key features?")
    }

    // 프롬프트 실행 및 응답 받기
    val response = client.execute(prompt = prompt, model = OpenAIModels.Chat.GPT4o)
    println(response)
}
```

## 프롬프트 실행기

프롬프트 실행기는 LLM과 상호작용하는 더 높은 수준의 방법을 제공하며, 클라이언트 생성 및 관리의 세부 사항을 처리합니다.

프롬프트 실행기를 사용하여 프롬프트를 관리하고 실행할 수 있습니다.
사용하려는 LLM 제공자에 따라 프롬프트 실행기를 선택하거나, 사용 가능한 LLM 클라이언트 중 하나를 사용하여 커스텀 프롬프트 실행기를 생성할 수 있습니다.

Koog 프레임워크는 여러 프롬프트 실행기를 제공합니다:

-   **단일 제공자 실행기 (Single provider executors)**:
    -   `simpleOpenAIExecutor`: OpenAI 모델로 프롬프트를 실행하기 위한 실행기.
    -   `simpleAnthropicExecutor`: Anthropic 모델로 프롬프트를 실행하기 위한 실행기.
    -   `simpleGoogleExecutor`: Google 모델로 프롬프트를 실행하기 위한 실행기.
    -   `simpleOpenRouterExecutor`: OpenRouter로 프롬프트를 실행하기 위한 실행기.
    -   `simpleOllamaExecutor`: Ollama로 프롬프트를 실행하기 위한 실행기.

-   **다중 제공자 실행기 (Multi-provider executor)**:
    -   `DefaultMultiLLMPromptExecutor`: 여러 LLM 제공자와 함께 작업하기 위한 실행기.

### 단일 제공자 실행기 생성

특정 LLM 제공자를 위한 프롬프트 실행기를 생성하려면 해당 함수를 사용합니다.
예를 들어, OpenAI 프롬프트 실행기를 생성하려면 `simpleOpenAIExecutor` 함수를 호출하고 OpenAI 서비스 인증에 필요한 API 키를 제공해야 합니다:

1.  프롬프트 실행기 생성:
    ```kotlin
    // OpenAI 실행기 생성
    val promptExecutor = simpleOpenAIExecutor(apiToken)
    ```
2.  특정 LLM으로 프롬프트 실행:
    ```kotlin
    // 프롬프트 실행
    val response = promptExecutor.execute(
        prompt = prompt,
        model = OpenAIModels.Chat.GPT4o
    )
    ```

### 다중 제공자 실행기 생성

여러 LLM 제공자와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행합니다:

1.  필요한 LLM 제공자를 위한 클라이언트를 해당 API 키로 구성합니다. 예를 들면 다음과 같습니다:
    ```kotlin
    val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
    val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
    val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
    ```
2.  구성된 클라이언트들을 `DefaultMultiLLMPromptExecutor` 클래스 생성자에 전달하여 여러 LLM 제공자를 지원하는 프롬프트 실행기를 생성합니다:
    ```kotlin
    val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
    ```
3.  특정 LLM으로 프롬프트 실행:
    ```kotlin
    val response = multiExecutor.execute(
        prompt = prompt,
        model = OpenAIModels.Chat.GPT4o
    )