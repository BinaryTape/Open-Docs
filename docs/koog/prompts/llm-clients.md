# LLM 客户端

LLM 客户端旨在与 LLM 提供商直接交互。每个客户端都实现了 `LLMClient` 接口，该接口提供了用于执行 prompt 和流式传输响应的方法。

当你使用单个 LLM 提供商且不需要高级生命周期管理时，你可以使用 LLM 客户端。如果你需要管理多个 LLM 提供商，请使用 [prompt 执行器](prompt-executors.md)。

下表展示了可用的 LLM 客户端及其功能。`*` 符号表示在“**备注**”列中提供了附加说明。

| LLM 提供商                                        | LLMClient                                                                                                                                                                                                   | 工具<br/>调用 | 流式传输 | 多重<br/>选择 | 嵌入 | 内容审核 | <div style="width:50px">模型<br/>列出</div> | <div style="width:200px">备注</div>                                                                                        |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|------------------|------|------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [OpenAI](https://platform.openai.com/docs/overview) | [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)                | ✓                | ✓         | ✓                | ✓    | ✓*         | ✓                                       | 通过 OpenAI Moderation API 支持内容审核。                                                                                   |
| [Anthropic](https://www.anthropic.com/)             | [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)      | ✓                | ✓         | -                | -    | -          | -                                       | -                                                                                                                           |
| [Google](https://ai.google.dev/)                    | [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)                  | ✓                | ✓         | ✓                | ✓    | -          | ✓                                       | -                                                                                                                           |
| [DeepSeek](https://www.deepseek.com/)               | [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)         | ✓                | ✓         | ✓                | -    | -          | ✓                                       | 与 OpenAI 兼容的聊天客户端。                                                                                                |
| [OpenRouter](https://openrouter.ai/)                | [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html) | ✓                | ✓         | ✓                | -    | -          | ✓                                       | 与 OpenAI 兼容的路由客户端。                                                                                                |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)   | [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html)              | ✓                | ✓         | -                | ✓    | ✓*         | -                                       | 仅限 JVM 的 AWS SDK 客户端，支持多种模型系列。内容审核需要 Guardrails 配置。                                                    |
| [Mistral](https://mistral.ai/)                      | [MistralAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-mistralai-client/ai.koog.prompt.executor.clients.mistralai/-mistral-a-i-l-l-m-client/index.html)    | ✓                | ✓         | ✓                | ✓    | ✓*         | ✓                                       | 与 OpenAI 兼容的客户端，通过 Mistral `v1/moderations` 端点支持内容审核。                                                      |
| [Alibaba](https://www.alibabacloud.com/en?_p_lc=1)  | [DashScopeLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-dashscope-client/ai.koog.prompt.executor.clients.dashscope/-dashscope-l-l-m-client/index.html)      | ✓                | ✓         | ✓                | -    | -          | ✓                                       | 与 OpenAI 兼容的客户端，公开提供商特有的参数 (`enableSearch`, `parallelToolCalls`, `enableThinking`)。                      |
| [Ollama](https://ollama.com/)                       | [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)                            | ✓                | ✓         | -                | ✓    | ✓          | -                                       | 具有模型管理 API 的本地服务器客户端。                                                                                       |

## 运行 prompt

要使用 LLM 客户端运行 prompt，请执行以下操作：

1.  创建一个 LLM 客户端来处理应用程序与 LLM 提供商之间的连接。
2.  调用 `execute()` 方法，并传入 prompt 和 LLM 作为实参。

以下示例展示了如何使用 `OpenAILLMClient` 运行 prompt：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    // 创建一个 OpenAI 客户端
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 创建一个 prompt
    val prompt = prompt("prompt_name", LLMParams()) {
        // 添加系统消息以设置上下文
        system("You are a helpful assistant.")

        // 添加用户消息
        user("Tell me about Kotlin")

        // 你也可以添加助手消息以提供少样本示例
        assistant("Kotlin is a modern programming language...")

        // 添加另一个用户消息
        user("What are its key features?")
    }

    // 运行 prompt
    val response = client.execute(prompt, OpenAIModels.Chat.GPT4o)
    // 打印响应
    println(response)
}
```
<!--- KNIT example-llm-clients-01.kt -->

## 流式传输响应

!!! note
    适用于所有 LLM 客户端。

当你需要在响应生成时对其进行处理时，你可以使用 `executeStreaming()` 方法来流式传输模型输出：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.streaming.StreamFrame
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
-->
<!--- SUFFIX
}
-->
```kotlin
// 使用你的 API 密钥设置 OpenAI 客户端
val token = System.getenv("OPENAI_API_KEY")
val client = OpenAILLMClient(token)

val response = client.executeStreaming(
    prompt = prompt("stream_demo") { user("Stream this response in short chunks.") },
    model = OpenAIModels.Chat.GPT4_1
)

response.collect { event ->
    when (event) {
        is StreamFrame.Append -> println(event.text)
        is StreamFrame.ToolCall -> println("
Tool call: ${event.name}")
        is StreamFrame.End -> println("
[done] Reason: ${event.finishReason}")
    }
}
```
<!--- KNIT example-llm-clients-02.kt -->

## 多重选择

!!! note
    适用于除 `GoogleLLMClient`、`BedrockLLMClient` 和 `OllamaClient` 之外的所有 LLM 客户端。

你可以通过使用 `executeMultipleChoices()` 方法，在单次调用中请求模型的多个替代响应。它还需要在要执行的 prompt 中额外指定 [`numberOfChoices`](structured-prompts.md#prompt-parameters) LLM 参数。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val choices = client.executeMultipleChoices(
        prompt = prompt("n_best", params = LLMParams(numberOfChoices = 3)) {
            system("You are a creative assistant.")
            user("Give me three different opening lines for a story.")
        },
        model = OpenAIModels.Chat.GPT4o
    )

    choices.forEachIndexed { i, choice ->
        val text = choice.joinToString(" ") { it.content }
        println("Line #${i + 1}: $text")
    }
}
```
<!--- KNIT example-llm-clients-03.kt -->

!!! tip
    你也可以通过向 prompt 中添加 [`numberOfChoices`](structured-prompts.md#prompt-parameters) LLM 参数来请求多重选择。

## 列出可用模型

!!! note
    适用于除 `GoogleLLMClient`、`BedrockLLMClient` 和 `OllamaClient` 之外的所有 LLM 客户端。

要获取 LLM 客户端支持的可用模型 ID 列表，请使用 `models()` 方法：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val ids: List<String> = client.models()
    ids.forEach { println(it) }
}
```
<!--- KNIT example-llm-clients-04.kt -->

## 嵌入

!!! note
    适用于 `OpenAILLMClient`、`GoogleLLMClient`、`BedrockLLMClient`、`MistralAILLMClient` 和 `OllamaClient`。

你可以使用 `embed()` 方法将文本转换为嵌入向量。选择一个嵌入模型，并将你的文本传递给此方法：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val embedding = client.embed(
        text = "This is a sample text for embedding",
        model = OpenAIModels.Embeddings.TextEmbedding3Large
    )

    println("Embedding size: ${embedding.size}")
}
```
<!--- KNIT example-llm-clients-05.kt -->

## 内容审核

!!! note
    适用于以下 LLM 客户端：`OpenAILLMClient`、`BedrockLLMClient`、`MistralAILLMClient`、`OllamaClient`。

你可以使用 `moderate()` 方法配合内容审核模型来检测 prompt 是否包含不当内容：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLLClient(apiKey)

    val result = client.moderate(
        prompt = prompt("moderation") {
            user("This is a test message that may contain offensive content.")
        },
        model = OpenAIModels.Moderation.Omni
    )

    println(result)
}
```
<!--- KNIT example-llm-clients-06.kt -->

## 与 prompt 执行器的集成

[Prompt 执行器](prompt-executors.md) 封装了 LLM 客户端，并提供额外功能，例如路由、回退以及跨提供商的统一使用。建议将其用于生产环境，因为它们在处理多个提供商时提供了灵活性。