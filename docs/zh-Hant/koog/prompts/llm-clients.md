# LLM 客戶端

LLM 客戶端專為與 LLM 供應商直接互動而設計。每個客戶端都實作了 [`LLMClient`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-l-l-m-client/index.html) 介面，該介面提供用於執行提示和串流回應的方法。

當您只與單一 LLM 供應商合作且不需要進階生命週期管理時，可以使用 LLM 客戶端。如果您需要管理多個 LLM 供應商，請使用 [提示執行器](prompt-executors.md)。

下表顯示了可用的 LLM 客戶端及其功能。

| LLM 供應商                                        | LLMClient                                                                                                                                                                                                   | 工具<br/>呼叫 | 串流 | 多重<br/>選擇 | 嵌入 | 內容審核 | <div style="width:50px">模型<br/>列舉</div> | <div style="width:200px">備註</div>                                                                                        |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|----------------------|------------|------------|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [OpenAI](https://platform.openai.com/docs/overview) | [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)                | ✓                | ✓         | ✓                    | ✓          | ✓[^1]      | ✓                                               |                                                                                                                             |
| [Anthropic](https://www.anthropic.com/)             | [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)      | ✓                | ✓         | -                    | -          | -          | -                                               | -                                                                                                                           |
| [Google](https://ai.google.dev/)                    | [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)                  | ✓                | ✓         | ✓                    | ✓          | -          | ✓                                               | -                                                                                                                           |
| [DeepSeek](https://www.deepseek.com/)               | [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)         | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | 與 OpenAI 相容的聊天客戶端。                                                                                              |
| [OpenRouter](https://openrouter.ai/)                | [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html) | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | 與 OpenAI 相容的路由器客戶端。                                                                                            |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)   | [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html)              | ✓                | ✓         | -                    | ✓          | ✓[^2]      | -                                               | 僅限 JVM 的 AWS SDK 客戶端，支援多種模型家族。                                                              |
| [Mistral](https://mistral.ai/)                      | [MistralAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-mistralai-client/ai.koog.prompt.executor.clients.mistralai/-mistral-a-i-l-l-m-client/index.html)    | ✓                | ✓         | ✓                    | ✓          | ✓[^3]      | ✓                                               | 與 OpenAI 相容的客戶端。                                                                                                   |
| [Alibaba](https://www.alibabacloud.com/en?_p_lc=1)  | [DashScopeLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-dashscope-client/ai.koog.prompt.executor.clients.dashscope/-dashscope-l-l-m-client/index.html)      | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | 與 OpenAI 相容的客戶端，公開了供應商特定的參數 (`enableSearch`、`parallelToolCalls`、`enableThinking`)。 |
| [Ollama](https://ollama.com/)                       | [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)                            | ✓                | ✓         | -                    | ✓          | ✓          | -                                               | 具有模型管理 API 的本地伺服器客戶端。                                                                             |

## 執行提示

若要使用 LLM 客戶端執行提示，請執行以下步驟：

1. 建立一個 LLM 客戶端，負責處理應用程式與 LLM 供應商之間的連線。
2. 呼叫 `execute()` 方法，並將提示和 LLM 作為引數。

以下範例展示如何使用 `OpenAILLMClient` 執行提示：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    // 建立一個 OpenAI 客戶端
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // 建立一個提示
    val prompt = prompt("prompt_name", LLMParams()) {
        // 增加系統訊息以設定上下文
        system("You are a helpful assistant.")

        // 增加使用者訊息
        user("Tell me about Kotlin")

        // 您也可以增加助理訊息以提供少量範例
        assistant("Kotlin is a modern programming language...")

        // 增加另一個使用者訊息
        user("What are its key features?")
    }

    // 執行提示
    val response = client.execute(prompt, OpenAIModels.Chat.GPT4o)
    // 列印回應
    println(response)
}
```
<!--- KNIT example-llm-clients-01.kt -->

## 串流回應

!!! note
    適用於所有 LLM 客戶端。

當您需要處理模型即時產生的回應時，
您可以使用 `executeStreaming()` 方法來串流模型輸出：

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
// 使用您的 API 金鑰設定 OpenAI 客戶端
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

## 多重選擇

!!! note
    適用於所有 LLM 客戶端，除了 `GoogleLLMClient`、`BedrockLLMClient` 和 `OllamaClient`。

您可以使用 `executeMultipleChoices()` 方法在單次呼叫中從模型請求多個替代回應。
這需要在執行提示中額外指定 [`numberOfChoices`](prompt-creation/index.md#prompt-parameters) LLM 參數。

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
            system("您是一位富有創意的助理。")
            user("給我三個不同的故事開頭。")
        },
        model = OpenAIModels.Chat.GPT4o
    )

    choices.forEachIndexed { i, choice ->
        val text = choice.joinToString(" ") { it.content }
        println("開頭 #${i + 1}: $text")
    }
}
```
<!--- KNIT example-llm-clients-03.kt -->

## 列出可用模型

!!! note
    適用於所有 LLM 客戶端，除了 `GoogleLLMClient`、`BedrockLLMClient` 和 `OllamaClient`。

若要取得 LLM 客戶端支援的可用模型 ID 清單，請使用 `models()` 方法：

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
    適用於 `OpenAILLMClient`、`GoogleLLMClient`、`BedrockLLMClient`、`MistralAILLMClient` 和 `OllamaClient`。

您可以使用 `embed()` 方法將文本轉換為嵌入向量。
請選擇一個嵌入模型並將您的文本傳遞給此方法：

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

## 內容審核

!!! note
    適用於以下 LLM 客戶端：`OpenAILLMClient`、`BedrockLLMClient`、`MistralAILLMClient`、`OllamaClient`。

您可以使用 `moderate()` 方法搭配內容審核模型來檢查提示是否包含不當內容：

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
            user("這是一個可能包含冒犯性內容的測試訊息。")
        },
        model = OpenAIModels.Moderation.Omni
    )

    println(result)
}
```
<!--- KNIT example-llm-clients-06.kt -->

## 與提示執行器的整合

[提示執行器](prompt-executors.md) 封裝 LLM 客戶端並提供額外功能，例如路由、備援和跨供應商的統一使用方式。
由於它們在處理多個供應商時提供彈性，因此建議用於生產環境。

[^1]: 透過 OpenAI Moderation API 支援內容審核。
[^2]: 內容審核需要 Guardrails 配置。
[^3]: 透過 Mistral `v1/moderations` 端點支援內容審核。