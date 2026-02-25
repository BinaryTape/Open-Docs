# 提示执行器

提示执行器提供了一种更高级别的抽象，让您可以管理一个或多个 LLM 客户端的生命周期。
您可以通过统一接口与多个 LLM 提供商协作，从特定提供商的细节中抽象出来，并在它们之间进行动态切换和回退。

## 执行器类型

Koog 提供了两种主要类型的提示执行器，它们实现了 [`PromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.model.PromptExecutor) 接口：

| 类型 | <div style="width:175px">类</div> | 描述 |
|-----------------|-----------------|-----------------|
| 单提供商 | [`SingleLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) | 包装单个提供商的单个 LLM 客户端。如果您的智能体仅需要在单个 LLM 提供商内的模型之间切换，请使用此执行器。 |
| 多提供商 | [`MultiLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor) | 包装多个 LLM 客户端，并根据 LLM 提供商路由调用。当请求的客户端不可用时，它可以选择性地使用配置的回退提供商和 LLM。如果您的智能体需要在不同提供商的 LLM 之间切换，请使用此执行器。 |

## 创建单提供商执行器

要为特定的 LLM 提供商创建提示执行器，请执行以下操作：

1. 使用相应的 API 密钥为特定提供商配置 LLM 客户端。
2. 使用 [`SingleLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) 创建提示执行器。

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

要创建可与多个 LLM 提供商协作的提示执行器，请执行以下操作：

1. 使用相应的 API 密钥为所需的 LLM 提供商配置客户端。
2. 将配置好的客户端传递给 [`MultiLLMPromptExecutor`](api:prompt-executor-llms::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor) 类构造函数，以创建包含多个 LLM 提供商的提示执行器。

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

## 预定义提示执行器

为了更快地进行设置，Koog 为常用提供商提供了现成的执行器实现。

下表包含了返回配置有特定 LLM 客户端的 `SingleLLMPromptExecutor` 的**预定义单提供商执行器**。

| LLM 提供商 | 提示执行器 | 描述 |
|----------------|----------------|----------------|
| OpenAI | [simpleOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor) | 包装使用 OpenAI 模型运行提示的 `OpenAILLMClient`。 |
| OpenAI | [simpleAzureOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAzureOpenAIExecutor) | 包装为使用 Azure OpenAI Service 而配置的 `OpenAILLMClient`。 |
| Anthropic | [simpleAnthropicExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor) | 包装使用 Anthropic 模型运行提示的 `AnthropicLLMClient`。 |
| Google | [simpleGoogleAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor) | 包装使用 Google 模型运行提示的 `GoogleLLMClient`。 |
| OpenRouter | [simpleOpenRouterExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor) | 包装使用 OpenRouter 运行提示的 `OpenRouterLLMClient`。 |
| Amazon Bedrock | [simpleBedrockExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutor) | 包装使用 AWS Bedrock 运行提示的 `BedrockLLMClient`。 |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken) | 包装 `BedrockLLMClient` 并使用提供的 Bedrock API 密钥发送请求。 |
| Mistral | [simpleMistralAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor) | 包装使用 Mistral 模型运行提示的 `MistralAILLMClient`。 |
| Ollama | [simpleOllamaAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor) | 包装使用 Ollama 运行提示的 `OllamaClient`。 |

下面是创建预定义单提供商和多提供商执行器的示例：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
// 创建 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 使用 OpenAI、Anthropic 和 Google LLM 客户端创建 MultiLLMPromptExecutor
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-executors-03.kt -->

## 运行提示

要使用提示执行器运行提示，请执行以下操作：

1. 创建提示执行器。
2. 使用 `execute()` 方法运行带有特定 LLM 的提示。

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
// 创建 OpenAI 执行器
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// 执行提示
val response = promptExecutor.execute(
    prompt = prompt("demo") { user("Summarize this.") },
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-executors-04.kt -->

这将使用 `GPT4o` 模型运行提示并返回响应。

!!! note
    提示执行器提供了使用各种能力运行提示的方法，例如流式处理、多项选择生成和内容审核。由于提示执行器包装了 LLM 客户端，每个执行器都支持相应客户端的功能。详情请参阅 [LLM 客户端](llm-clients.md)。

## 在提供商之间切换

当您使用 `MultiLLMPromptExecutor` 与多个 LLM 提供商协作时，可以在它们之间进行切换。过程如下：

1. 为您想要使用的每个提供商创建一个 LLM 客户端实例。
2. 创建一个将 LLM 提供商映射到 LLM 客户端的 `MultiLLMPromptExecutor`。
3. 将来自相应客户端的模型作为参数传递给 `execute()` 方法来运行提示。提示执行器将根据模型提供商使用相应的客户端来运行提示。

在提供商之间切换的示例如下：

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

// 创建提示
val p = prompt("demo") { user("Summarize this.") }

// 使用 OpenAI 模型运行提示；提示执行器会自动切换到 OpenAI 客户端
val openAIResult = executor.execute(p, OpenAIModels.Chat.GPT4o)

// 使用 Anthropic 模型运行提示；提示执行器会自动切换到 Anthropic 客户端
val anthropicResult = executor.execute(p, AnthropicModels.Opus_4_6)
```
<!--- KNIT example-prompt-executors-05.kt -->

您可以选择配置回退 LLM 提供商和模型，以便在请求的客户端不可用时使用。详情请参阅[配置回退](#configuring-fallbacks)。

## 配置回退

可以配置多提供商提示执行器，以便在请求的 LLM 客户端不可用时使用回退 LLM 提供商和模型。要配置回退机制，请向 `MultiLLMPromptExecutor` 构造函数提供 `fallback` 参数：

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

如果您传递的模型所属的 LLM 提供商未包含在 `MultiLLMPromptExecutor` 中，提示执行器将使用回退模型：

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
// 创建提示
val p = prompt("demo") { user("Summarize this") }
// 如果您传递一个 Google 模型，提示执行器将使用回退模型，因为不包含 Google 客户端
val response = multiExecutor.execute(p, GoogleModels.Gemini2_5Pro)
```
<!--- KNIT example-prompt-executors-07.kt -->

!!! note
    回退功能仅适用于 `execute()` 和 `executeMultipleChoices()` 方法。