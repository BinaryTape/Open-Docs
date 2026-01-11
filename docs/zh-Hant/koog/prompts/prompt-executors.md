# 提示詞執行器

提示詞執行器提供更高層次的抽象，讓您能夠管理一個或多個 LLM 客戶端的生命週期。
您可以透過統一的介面與多個 LLM 供應商合作，抽象化供應商特定的細節，
並支援在它們之間動態切換和備援。

## 執行器類型

Koog 提供兩種主要類型的提示詞執行器，它們都實作了 [`PromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 介面：

| 類型            | <div style="width:175px">類別</div>                                                                                                                               | 描述                                                                                                                                                                                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 單一供應商      | [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 包裝單一供應商的單一 LLM 客戶端。如果您的代理程式只需要在單一 LLM 供應商內的不同模型之間切換，請使用此執行器。                                                                                                                                                            |
| 多供應商        | [`MultiLLMPromptExecutor`](https://api.koog.prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)   | 包裝多個 LLM 客戶端並根據 LLM 供應商路由呼叫。當請求的客戶端不可用時，它可以選擇使用已配置的備援供應商和 LLM。如果您的代理程式需要在不同供應商的 LLM 之間切換，請使用此執行器。                                                                                              |

## 建立單一供應商執行器

若要為特定的 LLM 供應商建立提示詞執行器，請執行以下步驟：

1. 為特定供應商配置一個 LLM 客戶端及其對應的 API 金鑰。
2. 使用 [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) 建立一個提示詞執行器。

以下是一個範例：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = MultiLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-executors-01.kt -->

## 建立多供應商執行器

若要建立一個支援多個 LLM 供應商的提示詞執行器，請執行以下步驟：

1. 為所需的 LLM 供應商配置客戶端及其對應的 API 金鑰。
2. 將已配置的客戶端傳遞給 [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html) 類別的建構函式，以建立一個支援多個 LLM 供應商的提示詞執行器。

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

## 預先定義的提示詞執行器

為了加快設定速度，Koog 為常見供應商提供了現成的執行器實作。

下表包含 **預先定義的單一供應商執行器**，它們回傳配置了特定 LLM 客戶端的 `SingleLLMPromptExecutor`。

| LLM 供應商   | 提示詞執行器                                                                                                                                                                             | 描述                                                                                                                                                                           |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OpenAI         | [simpleOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-a-i-executor.html)                                  | 包裝了 `OpenAILLMClient`，用於執行 OpenAI 模型的提示詞。                                                                                                                        |
| OpenAI         | [simpleAzureOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-azure-open-a-i-executor.html)                       | 包裝了配置用於 Azure OpenAI Service 的 `OpenAILLMClient`。                                                                                                                     |
| Anthropic      | [simpleAnthropicExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-anthropic-executor.html)                              | 包裝了 `AnthropicLLMClient`，用於執行 Anthropic 模型的提示詞。                                                                                                                   |
| Google         | [simpleGoogleAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-google-a-i-executor.html)                              | 包裝了 `GoogleLLMClient`，用於執行 Google 模型的提示詞。                                                                                                                         |
| OpenRouter     | [simpleOpenRouterExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-router-executor.html)                           | 包裝了 `OpenRouterLLMClient`，用於執行 OpenRouter 的提示詞。                                                                                                                         |
| Amazon Bedrock | [simpleBedrockExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor.html)                                  | 包裝了 `BedrockLLMClient`，用於執行 AWS Bedrock 的提示詞。                                                                                                                     |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor-with-bearer-token.html) | 包裝了 `BedrockLLMClient`，並使用提供的 Bedrock API 金鑰發送請求。                                                                                                                   |
| Mistral        | [simpleMistralAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-mistral-a-i-executor.html)                            | 包裝了 `MistralAILLMClient`，用於執行 Mistral 模型的提示詞。                                                                                                                     |
| Ollama         | [simpleOllamaAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-ollama-a-i-executor.html)                              | 包裝了 `OllamaClient`，用於執行 Ollama 的提示詞。                                                                                                                                   |

以下是建立預先定義的單一和多供應商執行器的範例：

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

## 執行提示詞

若要使用提示詞執行器執行提示詞，請執行以下步驟：

1. 建立一個提示詞執行器。
2. 使用 `execute()` 方法以特定的 LLM 執行提示詞。

以下是一個範例：

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

這將使用 `GPT4o` 模型執行提示詞並回傳回應。

!!! note
    提示詞執行器提供了使用各種功能執行提示詞的方法，例如串流、多選題生成和內容審核。由於提示詞執行器包裝了 LLM 客戶端，因此每個執行器都支援對應客戶端的功能。詳細資訊請參考 [LLM 客戶端](llm-clients.md)。

## 在供應商之間切換

當您使用 `MultiLLMPromptExecutor` 與多個 LLM 供應商合作時，您可以在它們之間切換。流程如下：

1. 為您想要使用的每個供應商建立一個 LLM 客戶端實例。
2. 建立一個將 LLM 供應商對應到 LLM 客戶端的 `MultiLLMPromptExecutor`。
3. 使用 `execute()` 方法，並將來自對應客戶端的一個模型作為參數傳遞，以執行提示詞。提示詞執行器將根據模型供應商使用對應的客戶端來執行提示詞。

以下是在供應商之間切換的範例：

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

您可以選擇配置一個備援 LLM 供應商和模型，以便在請求的客戶端不可用時使用。詳細資訊請參考 [配置備援](#configuring-fallbacks)。

## 配置備援

當請求的 LLM 客戶端不可用時，多供應商提示詞執行器可以配置為使用備援 LLM 供應商和模型。若要配置備援機制，請將 `fallback` 參數提供給 `MultiLLMPromptExecutor` 建構函式：

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

如果您傳遞一個未包含在 `MultiLLMPromptExecutor` 中的 LLM 供應商模型，提示詞執行器將使用備援模型：

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
    備援僅適用於 `execute()` 和 `executeMultipleChoices()` 方法。