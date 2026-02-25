# LLM 客户端

LLM 客户端旨在直接与 LLM 提供者交互。
每个客户端都实现了 [`LLMClient`](api:prompt-executor-clients::ai.koog.prompt.executor.clients.LLMClient) 接口，该接口提供了执行 prompt 和流式传输响应的方法。

当你使用单个 LLM 提供者且不需要高级生命周期管理时，可以使用 LLM 客户端。
如果你需要管理多个 LLM 提供者，请使用 [prompt 执行器](prompt-executors.md)。

下表显示了可用的 LLM 客户端及其功能。

| LLM 提供者 | LLMClient | 工具调用 | 流式传输 | 多个选项 | 嵌入 | 审核 | <div style="width:50px">模型列表</div> | <div style="width:200px">备注</div> |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|----------------------|------------|------------|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [OpenAI](https://platform.openai.com/docs/overview) | [OpenAILLMClient](api:prompt-executor-openai-client::ai.koog.prompt.executor.clients.openai.OpenAILLMClient)                | ✓                | ✓         | ✓                    | ✓          | ✓[^1]      | ✓                                               |                                                                                                                             |
| [Anthropic](https://www.anthropic.com/)             | [AnthropicLLMClient](api:prompt-executor-anthropic-client::ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient)      | ✓                | ✓         | -                    | -          | -          | -                                               | -                                                                                                                           |
| [Google](https://ai.google.dev/)                    | [GoogleLLMClient](api:prompt-executor-google-client::ai.koog.prompt.executor.clients.google.GoogleLLMClient)                  | ✓                | ✓         | ✓                    | ✓          | -          | ✓                                               | -                                                                                                                           |
| [DeepSeek](https://www.deepseek.com/)               | [DeepSeekLLMClient](api:prompt-executor-deepseek-client::ai.koog.prompt.executor.clients.deepseek.DeepSeekLLMClient)         | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI 兼容的聊天客户端。 |
| [OpenRouter](https://openrouter.ai/)                | [OpenRouterLLMClient](api:prompt-executor-openrouter-client::ai.koog.prompt.executor.clients.openrouter.OpenRouterLLMClient) | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI 兼容的路由客户端。 |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)   | [BedrockLLMClient](api:prompt-executor-bedrock-client::ai.koog.prompt.executor.clients.bedrock.BedrockLLMClient)              | ✓                | ✓         | -                    | ✓          | ✓[^2]      | -                                               | 仅限 JVM 的 AWS SDK 客户端，支持多个模型系列。 |
| [Mistral](https://mistral.ai/)                      | [MistralAILLMClient](api:prompt-executor-mistralai-client::ai.koog.prompt.executor.clients.mistralai.MistralAILLMClient)    | ✓                | ✓         | ✓                    | ✓          | ✓[^3]      | ✓                                               | OpenAI 兼容的客户端。 |
| [Alibaba](https://www.alibabacloud.com/en?_p_lc=1)  | [DashScopeLLMClient](api:prompt-executor-dashscope-client::ai.koog.prompt.executor.clients.dashscope.DashscopeLLMClient)      | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI 兼容的客户端，公开了特定于提供者的参数（`enableSearch`、`parallelToolCalls`、`enableThinking`）。 |
| [Ollama](https://ollama.com/)                       | [OllamaClient](api:prompt-executor-ollama-client::ai.koog.prompt.executor.ollama.client.OllamaClient)                            | ✓                | ✓         | -                    | ✓          | ✓          | -                                               | 具有模型管理 API 的本地服务器客户端。 |

## 运行 prompt

要使用 LLM 客户端运行 prompt，请执行以下操作：

1. 创建一个 LLM 客户端，用于处理应用程序与 LLM 提供者之间的连接。
2. 调用 `execute()` 方法，并将 prompt 和 LLM 作为实参。

以下是使用 `OpenAILLMClient` 运行 prompt 的示例：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    // 创建 OpenAI 客户端
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 创建 prompt
    val prompt = prompt("prompt_name", LLMParams()) {
        // 添加系统消息以设置上下文
        system("你是一个得力的助手。")

        // 添加用户消息
        user("跟我讲讲 Kotlin")

        // 你也可以为少样本示例添加助手消息
        assistant("Kotlin 是一门现代编程语言...")

        // 添加另一条用户消息
        user("它的主要特性是什么？")
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

当你需要处理实时生成的响应时，可以使用 `executeStreaming()` 方法来流式传输模型输出。

流式传输 API 提供了不同的帧类型：
- **增量帧 (Delta frames)** (`TextDelta`、`ReasoningDelta`、`ToolCallDelta`) —— 以分块形式到达的增量内容
- **完成帧 (Complete frames)** (`TextComplete`、`ReasoningComplete`、`ToolCallComplete`) —— 接收到所有增量后的完整内容
- **结束帧 (End frame)** (`End`) —— 带有结束原因的流完成信号

对于支持推理的模型（如 Claude Sonnet 4.5 或 GPT-o1），在流式传输期间会发出推理帧。
有关使用帧的更多详细信息，请参阅 [流式传输 API 文档](../streaming-api.md)。

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
    prompt = prompt("stream_demo") { user("以短块形式流式传输此响应。") },
    model = OpenAIModels.Chat.GPT4_1
)

response.collect { frame ->
    when (frame) {
        is StreamFrame.TextDelta -> print(frame.text)
        is StreamFrame.ReasoningDelta -> print("[推理] ${frame.text}")
        is StreamFrame.ToolCallComplete -> println("
工具调用：${frame.name}")
        is StreamFrame.End -> println("
[完成] 原因：${frame.finishReason}")
        else -> {} // 如果需要，处理其他帧类型
    }
}
```
<!--- KNIT example-llm-clients-02.kt -->

## 多个选项

!!! note
    适用于除 `GoogleLLMClient`、`BedrockLLMClient` 和 `OllamaClient` 之外的所有 LLM 客户端。

你可以通过使用 `executeMultipleChoices()` 方法，在单次调用中向模型请求多个备选响应。
这需要在执行的 prompt 中额外指定 [`numberOfChoices`](prompt-creation/index.md#prompt-parameters) LLM 参数。

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
            system("你是一个富有创意的助手。")
            user("给我三个不同的故事开场白。")
        },
        model = OpenAIModels.Chat.GPT4o
    )

    choices.forEachIndexed { i, choice ->
        val text = choice.joinToString(" ") { it.content }
        println("第 #${i + 1} 行：$text")
    }
}
```
<!--- KNIT example-llm-clients-03.kt -->

## 列出可用模型

!!! note
    适用于除 `AnthropicLLMClient`、`BedrockLLMClient` 和 `OllamaClient` 之外的所有 LLM 客户端。

要获取 LLM 客户端支持的可用模型 ID 列表，请使用 `models()` 方法：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.llm.LLModel
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(apiKey)

    val models: List<LLModel> = client.models()
    models.forEach { println(it.id) }
}
```
<!--- KNIT example-llm-clients-04.kt -->

## 嵌入 (Embeddings)

!!! note
    适用于 `OpenAILLMClient`、`GoogleLLMClient`、`BedrockLLMClient`、`MistralAILLMClient` 和 `OllamaClient`。

你可以使用 `embed()` 方法将文本转换为嵌入向量。
选择一个嵌入模型并将你的文本传递给此方法：

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
        text = "这是一段用于嵌入的示例文本",
        model = OpenAIModels.Embeddings.TextEmbedding3Large
    )

    println("嵌入大小：${embedding.size}")
}
```
<!--- KNIT example-llm-clients-05.kt -->

## 审核

!!! note
    适用于以下 LLM 客户端：`OpenAILLMClient`、`BedrockLLMClient`、`MistralAILLMClient`、`OllamaClient`。

你可以将 `moderate()` 方法与审核模型结合使用，检查 prompt 是否包含不当内容：

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

    val result = client.moderate(
        prompt = prompt("moderation") {
            user("这是一条可能包含攻击性内容的测试消息。")
        },
        model = OpenAIModels.Moderation.Omni
    )

    println(result)
}
```
<!--- KNIT example-llm-clients-06.kt -->

## 与 prompt 执行器集成

[Prompt 执行器](prompt-executors.md)封装了 LLM 客户端，并提供附加功能，如路由、回退以及跨提供者的统一用法。
推荐在生产环境中使用它们，因为它们在处理多个提供者时提供了灵活性。

[^1]: 支持通过 OpenAI Moderation API 进行审核。
[^2]: 审核需要 Guardrails 配置。
[^3]: 支持通过 Mistral `v1/moderations` 端点进行审核。