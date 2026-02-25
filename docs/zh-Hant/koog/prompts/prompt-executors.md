# Prompt 執行器

Prompt 執行器提供更高層級的抽象，讓您可以管理一個或多個 LLM 用戶端的生命週期。
您可以透過統一的介面與多個 LLM 提供者協作，將特定提供者的細節抽象化，
並在它們之間進行動態切換與備援。

## 執行器類型

Koog 提供兩類實作了 [`PromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.model.PromptExecutor) 介面的主要 Prompt 執行器：

| 類型 | <div style="width:175px">類別</div> | 說明 |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 單一提供者 | [`SingleLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) | 封裝單一提供者的單一 LLM 用戶端。如果您的代理只需要在單一 LLM 提供者內部的模型之間進行切換，請使用此執行器。 |
| 多個提供者 | [`MultiLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor) | 封裝多個 LLM 用戶端，並根據 LLM 提供者路由呼叫。當請求的用戶端無法使用時，它可以選擇性地使用配置的備援提供者與 LLM。如果您的代理需要在不同提供者的 LLM 之間切換，請使用此執行器。 |

## 建立單一提供者執行器

若要為特定的 LLM 提供者建立 Prompt 執行器，請執行以下操作：

1. 為特定提供者配置包含對應 API 金鑰的 LLM 用戶端。
2. 使用 [`SingleLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) 建立 Prompt 執行器。

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

## 建立多個提供者執行器

若要建立可與多個 LLM 提供者協作的 Prompt 執行器，請執行以下操作：

1. 為需要的 LLM 提供者配置包含對應 API 金鑰的用戶端。
2. 將配置好的用戶端傳遞給 [`MultiLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor) 類別建構函式，以建立具有多個 LLM 提供者的 Prompt 執行器。

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

## 預定義的 Prompt 執行器

為了更快速的設定，Koog 為常見的提供者提供了即開即用的執行器實作。

下表包含返回配置了特定 LLM 用戶端的 `SingleLLMPromptExecutor` 的 **預定義單一提供者執行器**。

| LLM 提供者 | Prompt 執行器 | 說明 |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| OpenAI | [simpleOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor) | 封裝使用 OpenAI 模型執行 Prompt 的 `OpenAILLMClient`。 |
| OpenAI | [simpleAzureOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAzureOpenAIExecutor) | 封裝配置為使用 Azure OpenAI Service 的 `OpenAILLMClient`。 |
| Anthropic | [simpleAnthropicExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor) | 封裝使用 Anthropic 模型執行 Prompt 的 `AnthropicLLMClient`。 |
| Google | [simpleGoogleAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor) | 封裝使用 Google 模型執行 Prompt 的 `GoogleLLMClient`。 |
| OpenRouter | [simpleOpenRouterExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor) | 封裝與 OpenRouter 搭配執行 Prompt 的 `OpenRouterLLMClient`。 |
| Amazon Bedrock | [simpleBedrockExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutor) | 封裝與 AWS Bedrock 搭配執行 Prompt 的 `BedrockLLMClient`。 |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken) | 封裝 `BedrockLLMClient` 並使用提供的 Bedrock API 金鑰發送請求。 |
| Mistral | [simpleMistralAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor) | 封裝使用 Mistral 模型執行 Prompt 的 `MistralAILLMClient`。 |
| Ollama | [simpleOllamaAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor) | 封裝與 Ollama 搭配執行 Prompt 的 `OllamaClient`。 |

以下是建立預定義的單一提供者與多個提供者執行器的範例：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
// 建立一個 OpenAI 執行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 建立具有 OpenAI、Anthropic 和 Google LLM 用戶端的 MultiLLMPromptExecutor
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-executors-03.kt -->

## 執行 Prompt

若要使用 Prompt 執行器執行 Prompt，請執行以下操作：

1. 建立一個 Prompt 執行器。
2. 使用 `execute()` 方法搭配特定的 LLM 執行 Prompt。

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
// 建立一個 OpenAI 執行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 執行一個 Prompt
val response = promptExecutor.execute(
    prompt = prompt("demo") { user("Summarize this.") },
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-executors-04.kt -->

這將使用 `GPT4o` 模型執行 Prompt 並傳回回應。

!!! note
    Prompt 執行器提供了使用各種功能執行 Prompt 的方法，例如串流、多重選擇產生和內容審查。
    由於 Prompt 執行器封裝了 LLM 用戶端，因此每個執行器都支援對應用戶端的功能。
    如需詳細資訊，請參閱 [LLM 用戶端](llm-clients.md)。

## 在提供者之間切換

當您使用 `MultiLLMPromptExecutor` 與多個 LLM 提供者協作時，您可以在它們之間切換。
流程如下：

1. 為您想要使用的每個提供者建立一個 LLM 用戶端執行個體。
2. 建立一個將 LLM 提供者對應到 LLM 用戶端的 `MultiLLMPromptExecutor`。
3. 使用對應用戶端的模型執行 Prompt，並將其作為引數傳遞給 `execute()` 方法。
   Prompt 執行器將根據模型提供者使用對應的用戶端來執行 Prompt。

以下是在提供者之間切換的範例：

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
// 為 OpenAI、Anthropic 和 Google 提供者建立 LLM 用戶端
val openAIClient = OpenAILLMClient("OPENAI_API_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_API_KEY")
val googleClient = GoogleLLMClient("GOOGLE_API_KEY")

// 建立一個將 LLM 提供者對應到 LLM 用戶端的 MultiLLMPromptExecutor
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Anthropic to anthropicClient,
    LLMProvider.Google to googleClient
)

// 建立一個 Prompt
val p = prompt("demo") { user("Summarize this.") }

// 使用 OpenAI 模型執行 Prompt；Prompt 執行器會自動切換到 OpenAI 用戶端
val openAIResult = executor.execute(p, OpenAIModels.Chat.GPT4o)

// 使用 Anthropic 模型執行 Prompt；Prompt 執行器會自動切換到 Anthropic 用戶端
val anthropicResult = executor.execute(p, AnthropicModels.Opus_4_6)
```
<!--- KNIT example-prompt-executors-05.kt -->

您可以選擇性地配置一個備援 LLM 提供者與模型，以便在請求的用戶端無法使用時使用。
如需詳細資訊，請參閱 [配置備援](#configuring-fallbacks)。

## 配置備援

多個提供者 Prompt 執行器可以配置為在請求的 LLM 用戶端無法使用時使用備援 LLM 提供者與模型。
若要配置備援機制，請向 `MultiLLMPromptExecutor` 建構函式提供 `fallback` 參數：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.executor.ollama.client.OllamaModels
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

如果您傳遞一個不包含在 `MultiLLMPromptExecutor` 中的 LLM 提供者的模型，
Prompt 執行器將會使用備援模型：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.executor.clients.google.GoogleModels
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
// 建立一個 Prompt
val p = prompt("demo") { user("Summarize this") }
// 如果您傳遞一個 Google 模型，Prompt 執行器將會使用備援模型，因為不包含 Google 用戶端
val response = multiExecutor.execute(p, GoogleModels.Gemini2_5Pro)
```
<!--- KNIT example-prompt-executors-07.kt -->

!!! note
    備援僅適用於 `execute()` 與 `executeMultipleChoices()` 方法。