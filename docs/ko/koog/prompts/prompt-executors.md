# 프롬프트 실행기

프롬프트 실행기는 하나 또는 여러 LLM 클라이언트의 수명 주기를 관리할 수 있는 상위 수준 추상화를 제공합니다.
제공업체별 세부 사항을 추상화하여 통합된 인터페이스를 통해 여러 LLM 제공업체와 작업할 수 있으며,
이들 간의 동적 전환 및 대체 기능을 지원합니다.

## 실행기 유형

Koog는 [`PromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 인터페이스를 구현하는 두 가지 주요 프롬프트 실행기 유형을 제공합니다.

| 유형            | <div style="width:175px">클래스</div>                                                                                                                               | 설명                                                                                                                                                                                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 단일 제공업체 | [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 단일 제공업체용 단일 LLM 클라이언트를 래핑합니다. 에이전트가 단일 LLM 제공업체 내에서 모델 간 전환만 필요한 경우 이 실행기를 사용하세요.                                                                                                                     |
| 다중 제공업체  | [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)   | 여러 LLM 클라이언트를 래핑하고 LLM 제공업체에 따라 호출을 라우팅합니다. 요청된 클라이언트를 사용할 수 없을 때 구성된 대체 제공업체와 LLM을 선택적으로 사용할 수 있습니다. 에이전트가 다른 제공업체의 LLM 간에 전환해야 하는 경우 이 실행기를 사용하세요. |

## 단일 제공업체 실행기 생성

특정 LLM 제공업체용 프롬프트 실행기를 생성하려면 다음을 수행합니다.

1.  해당 API 키로 특정 제공업체용 LLM 클라이언트를 구성합니다.
2.  [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html)를 사용하여 프롬프트 실행기를 생성합니다.

다음은 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = MultiLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-executors-01.kt -->

## 다중 제공업체 실행기 생성

여러 LLM 제공업체와 함께 작동하는 프롬프트 실행기를 생성하려면 다음을 수행합니다.

1.  필요한 LLM 제공업체용 클라이언트를 해당 API 키로 구성합니다.
2.  구성된 클라이언트를 [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html) 클래스 생성자에 전달하여 여러 LLM 제공업체를 사용하는 프롬프트 실행기를 생성합니다.

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLMProvider
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()

val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient
)
```
<!--- KNIT example-prompt-executors-02.kt -->

## 미리 정의된 프롬프트 실행기

더 빠른 설정을 위해 Koog는 일반적인 제공업체를 위한 즉시 사용 가능한 실행기 구현을 제공합니다.

다음 표에는 특정 LLM 클라이언트로 구성된 `SingleLLMPromptExecutor`를 반환하는 **미리 정의된 단일 제공업체 실행기**가 포함되어 있습니다.

| LLM 제공업체   | 프롬프트 실행기                                                                                                                                                                             | 설명                                                                           |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| OpenAI         | [simpleOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-a-i-executor.html)                                  | `OpenAILLMClient`를 래핑하고 OpenAI 모델로 프롬프트를 실행합니다.                    |
| OpenAI         | [simpleAzureOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-azure-open-a-i-executor.html)                       | Azure OpenAI 서비스를 사용하도록 구성된 `OpenAILLMClient`를 래핑합니다.               |
| Anthropic      | [simpleAnthropicExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-anthropic-executor.html)                              | `AnthropicLLMClient`를 래핑하고 Anthropic 모델로 프롬프트를 실행합니다.              |
| Google         | [simpleGoogleAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-google-a-i-executor.html)                              | `GoogleLLMClient`를 래핑하고 Google 모델로 프롬프트를 실행합니다.                    |
| OpenRouter     | [simpleOpenRouterExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-router-executor.html)                           | `OpenRouterLLMClient`를 래핑하고 OpenRouter로 프롬프트를 실행합니다.                   |
| Amazon Bedrock | [simpleBedrockExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor.html)                                  | `BedrockLLMClient`를 래핑하고 AWS Bedrock으로 프롬프트를 실행합니다.                     |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor-with-bearer-token.html) | `BedrockLLMClient`를 래핑하고 제공된 Bedrock API 키를 사용하여 요청을 보냅니다. |
| Mistral        | [simpleMistralAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-mistral-a-i-executor.html)                            | `MistralAILLMClient`를 래핑하고 Mistral 모델로 프롬프트를 실행합니다.                |
| Ollama         | [simpleOllamaAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-ollama-a-i-executor.html)                              | `OllamaClient`를 래핑하고 Ollama로 프롬프트를 실행합니다.                              |

다음은 미리 정의된 단일 및 다중 제공업체 실행기를 생성하는 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// Create a MultiLLMPromptExecutor with OpenAI, Anthropic, and Google LLM clients
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-executors-03.kt -->

## 프롬프트 실행

프롬프트 실행기를 사용하여 프롬프트를 실행하려면 다음을 수행합니다.

1.  프롬프트 실행기를 생성합니다.
2.  `execute()` 메서드를 사용하여 특정 LLM으로 프롬프트를 실행합니다.

다음은 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an OpenAI executor
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// Execute a prompt
val response = promptExecutor.execute(
    prompt = prompt("demo") { user("Summarize this.") },
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-executors-04.kt -->

이렇게 하면 `GPT4o` 모델로 프롬프트가 실행되고 응답이 반환됩니다.

!!! note
    프롬프트 실행기는 스트리밍, 다중 선택 생성, 콘텐츠 조정 등 다양한 기능을 사용하여 프롬프트를 실행하는 메서드를 제공합니다.
    프롬프트 실행기는 LLM 클라이언트를 래핑하므로, 각 실행기는 해당 클라이언트의 기능을 지원합니다.
    자세한 내용은 [LLM 클라이언트](llm-clients.md)를 참조하세요.

## 제공업체 간 전환

`MultiLLMPromptExecutor`를 사용하여 여러 LLM 제공업체와 작업할 때, 제공업체 간에 전환할 수 있습니다.
과정은 다음과 같습니다.

1.  사용하려는 각 제공업체에 대한 LLM 클라이언트 인스턴스를 생성합니다.
2.  LLM 제공업체를 LLM 클라이언트에 매핑하는 `MultiLLMPromptExecutor`를 생성합니다.
3.  `execute()` 메서드의 인수로 전달된 해당 클라이언트의 모델로 프롬프트를 실행합니다.
    프롬프트 실행기는 모델 제공업체에 따라 해당 클라이언트를 사용하여 프롬프트를 실행합니다.

다음은 제공업체 간 전환 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.dsl.prompt
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
-->
<!--- SUFFIX
}
-->
```kotlin
// Create LLM clients for OpenAI, Anthropic, and Google providers
val openAIClient = OpenAILLMClient("OPENAI_API_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_API_KEY")
val googleClient = GoogleLLMClient("GOOGLE_API_KEY")

// Create a MultiLLMPromptExecutor that maps LLM providers to LLM clients
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Anthropic to anthropicClient,
    LLMProvider.Google to googleClient
)

// Create a prompt
val p = prompt("demo") { user("Summarize this.") }

// Run the prompt with an OpenAI model; the prompt executor automatically switches to the OpenAI client
val openAIResult = executor.execute(p, OpenAIModels.Chat.GPT4o)

// Run the prompt with an Anthropic model; the prompt executor automatically switches to the Anthropic client
val anthropicResult = executor.execute(p, AnthropicModels.Sonnet_3_5)
```
<!--- KNIT example-prompt-executors-05.kt -->

요청된 클라이언트를 사용할 수 없을 때 선택적으로 대체 LLM 제공업체와 모델을 구성할 수 있습니다.
자세한 내용은 [대체 구성](#configuring-fallbacks)을 참조하세요.

## 대체 구성

다중 제공업체 프롬프트 실행기는 요청된 LLM 클라이언트를 사용할 수 없을 때 대체 LLM 제공업체 및 모델을 사용하도록 구성할 수 있습니다.
대체 메커니즘을 구성하려면 `MultiLLMPromptExecutor` 생성자에 `fallback` 매개변수를 제공합니다.

<!--- INCLUDE
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.llm.OllamaModels
import ai.koog.prompt.llm.LLMProvider
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()

val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient,
    fallback = MultiLLMPromptExecutor.FallbackPromptExecutorSettings(
        fallbackProvider = LLMProvider.Ollama,
        fallbackModel = OllamaModels.Meta.LLAMA_3_2
    )
)
```
<!--- KNIT example-prompt-executors-06.kt -->

`MultiLLMPromptExecutor`에 포함되지 않은 LLM 제공업체의 모델을 전달하면 프롬프트 실행기는 대체 모델을 사용합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.executor.clients.google.GoogleModels
import ai.koog.prompt.llm.OllamaModels
import ai.koog.prompt.llm.LLMProvider
import kotlinx.coroutines.runBlocking

val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val ollamaClient = OllamaClient()

val multiExecutor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Ollama to ollamaClient,
    fallback = MultiLLMPromptExecutor.FallbackPromptExecutorSettings(
        fallbackProvider = LLMProvider.Ollama,
        fallbackModel = OllamaModels.Meta.LLAMA_3_2
    )
)

fun main() = runBlocking {
-->
<!--- SUFFIX
}
-->
```kotlin
// Create a prompt
val p = prompt("demo") { user("Summarize this") }
// If you pass a Google model, the prompt executor will use the fallback model, as the Google client is not included
val response = multiExecutor.execute(p, GoogleModels.Gemini2_5Pro)
```
<!--- KNIT example-prompt-executors-07.kt -->

!!! note
    대체 기능은 `execute()` 및 `executeMultipleChoices()` 메서드에만 사용할 수 있습니다.