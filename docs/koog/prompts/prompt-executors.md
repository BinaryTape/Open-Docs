# Prompt 执行器

Prompt 执行器提供了一种更高层级的抽象，让你可以管理一个或多个 LLM 客户端的生命周期。你可以通过统一接口使用多个 LLM 提供商，抽象出提供商特有的细节，并支持它们之间的动态切换和回退功能。

## 执行器类型

Koog 提供了两种主要类型的 prompt 执行器，它们都实现了 [`PromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) 接口：

| 类型            | <div style="width:175px">Class</div>                                                                                                                               | 描述                                                                                                                                                                                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 单提供商        | [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 封装一个 LLM 客户端，用于一个提供商。如果你的代理只要求在单个 LLM 提供商内切换模型，请使用此执行器。                                                                                                                                                            |
| 多提供商        | [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)   | 封装多个 LLM 客户端，并根据 LLM 提供商路由调用。当请求的客户端不可用时，它可以选择使用已配置的回退提供商和 LLM。如果你的代理需要在不同提供商的 LLM 之间切换，请使用此执行器。                                                                                     |

## 创建单提供商执行器

要为一个特定的 LLM 提供商创建 prompt 执行器，请执行以下操作：

1. 为特定提供商配置一个 LLM 客户端，并提供相应的 API 密钥。
2. 使用 [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) 创建一个 prompt 执行器。

示例如下：

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = MultiLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-executors-01.kt -->

## 创建多提供商执行器

要创建一个能与多个 LLM 提供商配合使用的 prompt 执行器，请执行以下操作：

1. 为所需的 LLM 提供商配置客户端，并提供相应的 API 密钥。
2. 将已配置的客户端传递给 [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html) 类构造函数，以创建一个支持多个 LLM 提供商的 prompt 执行器。

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

## 预定义 prompt 执行器

为了加快设置速度，Koog 为常用提供商提供了开箱即用的执行器实现。

下表包含了**预定义的单提供商执行器**，它们返回配置了特定 LLM 客户端的 `SingleLLMPromptExecutor`。

| LLM 提供商   | Prompt 执行器                                                                                                                                                                             | 描述                                                                      |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| OpenAI         | [simpleOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-a-i-executor.html)                                  | 封装了 `OpenAILLMClient`，使用 OpenAI 模型运行 prompt。                    |
| OpenAI         | [simpleAzureOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-azure-open-a-i-executor.html)                       | 封装了配置用于使用 Azure OpenAI 服务的 `OpenAILLMClient`。               |
| Anthropic      | [simpleAnthropicExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-anthropic-executor.html)                              | 封装了 `AnthropicLLMClient`，使用 Anthropic 模型运行 prompt。              |
| Google         | [simpleGoogleAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-google-a-i-executor.html)                              | 封装了 `GoogleLLMClient`，使用 Google 模型运行 prompt。                    |
| OpenRouter     | [simpleOpenRouterExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-router-executor.html)                           | 封装了 `OpenRouterLLMClient`，使用 OpenRouter 运行 prompt。                   |
| Amazon Bedrock | [simpleBedrockExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor.html)                                  | 封装了 `BedrockLLMClient`，使用 AWS Bedrock 运行 prompt。                     |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor-with-bearer-token.html) | 封装了 `BedrockLLMClient`，并使用提供的 Bedrock API 密钥发送请求。 |
| Mistral        | [simpleMistralAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-mistral-a-i-executor.html)                            | 封装了 `MistralAILLMClient`，使用 Mistral 模型运行 prompt。                |
| Ollama         | [simpleOllamaAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-ollama-a-i-executor.html)                              | 封装了 `OllamaClient`，使用 Ollama 运行 prompt。                              |

示例如下，展示了如何创建预定义的单提供商和多提供商执行器：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
// 创建一个 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 创建一个包含 OpenAI、Anthropic 和 Google LLM 客户端的 MultiLLMPromptExecutor
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-executors-03.kt -->

## 运行 prompt

要使用 prompt 执行器运行 prompt，请执行以下操作：

1. 创建一个 prompt 执行器。
2. 使用 `execute()` 方法，通过特定 LLM 运行 prompt。

示例如下：

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
// 创建一个 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 执行 prompt
val response = promptExecutor.execute(
    prompt = prompt("demo") { user("Summarize this.") },
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-executors-04.kt -->

这将使用 `GPT4o` 模型运行 prompt 并返回响应。

!!! note
    prompt 执行器提供了使用各种功能运行 prompt 的方法，例如流式传输、多项选择生成和内容审核。
    由于 prompt 执行器封装了 LLM 客户端，每个执行器都支持相应客户端的功能。
    更多详情，请参考 [LLM 客户端](llm-clients.md)。

## 在提供商之间切换

当你使用 `MultiLLMPromptExecutor` 处理多个 LLM 提供商时，你可以在它们之间进行切换。
过程如下：

1. 为你想使用的每个提供商创建一个 LLM 客户端实例。
2. 创建一个将 LLM 提供商映射到 LLM 客户端的 `MultiLLMPromptExecutor`。
3. 运行 prompt 时，将相应客户端中的模型作为实参传递给 `execute()` 方法。prompt 执行器将根据模型提供商使用相应客户端来运行 prompt。

以下是提供商之间切换的示例：

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
// 为 OpenAI、Anthropic 和 Google 提供商创建 LLM 客户端
val openAIClient = OpenAILLMClient("OPENAI_API_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_API_KEY")
val googleClient = GoogleLLMClient("GOOGLE_API_KEY")

// 创建一个将 LLM 提供商映射到 LLM 客户端的 MultiLLMPromptExecutor
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Anthropic to anthropicClient,
    LLMProvider.Google to googleClient
)

// 创建一个 prompt
val p = prompt("demo") { user("Summarize this.") }

// 使用 OpenAI 模型运行 prompt；prompt 执行器会自动切换到 OpenAI 客户端
val openAIResult = executor.execute(p, OpenAIModels.Chat.GPT4o)

// 使用 Anthropic 模型运行 prompt；prompt 执行器会自动切换到 Anthropic 客户端
val anthropicResult = executor.execute(p, AnthropicModels.Sonnet_3_5)
```
<!--- KNIT example-prompt-executors-05.kt -->

你可以选择性地配置一个回退 LLM 提供商和模型，以便在请求的客户端不可用时使用。
更多详情，请参考 [配置回退](#configuring-fallbacks)。

## 配置回退

当请求的 LLM 客户端不可用时，多提供商 prompt 执行器可以配置为使用回退 LLM 提供商和模型。
要配置回退机制，请向 `MultiLLMPromptExecutor` 构造函数提供 `fallback` 形参：

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

如果你传递了一个未包含在 `MultiLLMPromptExecutor` 中的 LLM 提供商的模型，
prompt 执行器将使用回退模型：

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
// 创建一个 prompt
val p = prompt("demo") { user("Summarize this") }
// 如果你传递了一个 Google 模型，prompt 执行器将使用回退模型，因为 Google 客户端未包含在内
val response = multiExecutor.execute(p, GoogleModels.Gemini2_5Pro)
```
<!--- KNIT example-prompt-executors-07.kt -->

!!! note
    回退机制仅适用于 `execute()` 和 `executeMultipleChoices()` 方法。