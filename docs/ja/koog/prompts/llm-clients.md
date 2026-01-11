# LLMクライアント

LLMクライアントは、LLMプロバイダーとの直接的な対話のために設計されています。
各クライアントは、プロンプトの実行と応答のストリーミングのためのメソッドを提供する[`LLMClient`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/ai.koog.prompt.executor.clients/-l-l-m-client/index.html)インターフェースを実装しています。

単一のLLMプロバイダーと連携し、高度なライフサイクル管理を必要としない場合は、LLMクライアントを使用できます。
複数のLLMプロバイダーを管理する必要がある場合は、[プロンプトエクゼキュータ](prompt-executors.md)を使用してください。

以下の表は、利用可能なLLMクライアントとその機能を示しています。

| LLMプロバイダー                                        | LLMClient                                                                                                                                                                                                   | ツール<br/>呼び出し | ストリーミング | 複数の<br/>選択肢 | 埋め込み | モデレーション | <div style="width:50px">モデル<br/>リスト</div> | <div style="width:200px">注記</div>                                                                                        |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------|----------------------|------------|------------|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [OpenAI](https://platform.openai.com/docs/overview) | [OpenAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai/-open-a-i-l-l-m-client/index.html)                | ✓                | ✓         | ✓                    | ✓          | ✓[^1]      | ✓                                               |                                                                                                                             |
| [Anthropic](https://www.anthropic.com/)             | [AnthropicLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-anthropic-client/ai.koog.prompt.executor.clients.anthropic/-anthropic-l-l-m-client/index.html)      | ✓                | ✓         | -                    | -          | -          | -                                               | -                                                                                                                           |
| [Google](https://ai.google.dev/)                    | [GoogleLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-google-client/ai.koog.prompt.executor.clients.google/-google-l-l-m-client/index.html)                  | ✓                | ✓         | ✓                    | ✓          | -          | ✓                                               | -                                                                                                                           |
| [DeepSeek](https://www.deepseek.com/)               | [DeepSeekLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-deepseek-client/ai.koog.prompt.executor.clients.deepseek/-deep-seek-l-l-m-client/index.html)         | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI互換のチャットクライアント。                                                                                              |
| [OpenRouter](https://openrouter.ai/)                | [OpenRouterLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter/-open-router-l-l-m-client/index.html) | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | OpenAI互換のルータークライアント。                                                                                            |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)   | [BedrockLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-bedrock-client/ai.koog.prompt.executor.clients.bedrock/-bedrock-l-l-m-client/index.html)              | ✓                | ✓         | -                    | ✓          | ✓[^2]      | -                                               | 複数のモデルファミリーをサポートするJVM専用のAWS SDKクライアント。                                                              |
| [Mistral](https://mistral.ai/)                      | [MistralAILLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-mistralai-client/ai.koog.prompt.executor.clients.mistralai/-mistral-a-i-l-l-m-client/index.html)    | ✓                | ✓         | ✓                    | ✓          | ✓[^3]      | ✓                                               | OpenAI互換クライアント。                                                                                                   |
| [Alibaba](https://www.alibabacloud.com/en?_p_lc=1)  | [DashScopeLLMClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-dashscope-client/ai.koog.prompt.executor.clients.dashscope/-dashscope-l-l-m-client/index.html)      | ✓                | ✓         | ✓                    | -          | -          | ✓                                               | プロバイダー固有のパラメーター (`enableSearch`、`parallelToolCalls`、`enableThinking`) を公開するOpenAI互換クライアント。 |
| [Ollama](https://ollama.com/)                       | [OllamaClient](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-ollama-client/ai.koog.prompt.executor.ollama.client/-ollama-client/index.html)                            | ✓                | ✓         | -                    | ✓          | ✓          | -                                               | モデル管理APIを備えたローカルサーバークライアント。                                                                             |

## プロンプトの実行

LLMクライアントを使用してプロンプトを実行するには、次の手順を実行します。

1.  アプリケーションとLLMプロバイダー間の接続を処理するLLMクライアントを作成します。
2.  プロンプトとLLMを引数として`execute()`メソッドを呼び出します。

以下は、`OpenAILLMClient`を使用してプロンプトを実行する例です。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.params.LLMParams
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() = runBlocking {
    // Create an OpenAI client
    val token = System.getenv("OPENAI_API_KEY")
    val client = OpenAILLMClient(token)

    // Create a prompt
    val prompt = prompt("prompt_name", LLMParams()) {
        // Add a system message to set the context
        system("You are a helpful assistant.")

        // Add a user message
        user("Tell me about Kotlin")

        // You can also add assistant messages for few-shot examples
        assistant("Kotlin is a modern programming language...")

        // Add another user message
        user("What are its key features?")
    }

    // Run the prompt
    val response = client.execute(prompt, OpenAIModels.Chat.GPT4o)
    // Print the response
    println(response)
}
```
<!--- KNIT example-llm-clients-01.kt -->

## 応答のストリーミング

!!! note
    すべてのLLMクライアントで利用可能です。

応答が生成されるにつれて処理する必要がある場合、
`executeStreaming()`メソッドを使用してモデルの出力をストリーミングできます。

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
// Set up the OpenAI client with your API key
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

## 複数の選択肢

!!! note
    `GoogleLLMClient`、`BedrockLLMClient`、および`OllamaClient`を除くすべてのLLMクライアントで利用可能です

`executeMultipleChoices()`メソッドを使用することで、単一の呼び出しでモデルから複数の代替応答をリクエストできます。
これには、実行されるプロンプト内で、追加で[`numberOfChoices`](prompt-creation/index.md#prompt-parameters) LLMパラメーターを指定する必要があります。

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

## 利用可能なモデルのリスト表示

!!! note
    `GoogleLLMClient`、`BedrockLLMClient`、および`OllamaClient`を除くすべてのLLMクライアントで利用可能です。

LLMクライアントがサポートする利用可能なモデルIDのリストを取得するには、`models()`メソッドを使用します。

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

## 埋め込み

!!! note
    `OpenAILLMClient`、`GoogleLLMClient`、`BedrockLLMClient`、`MistralAILLMClient`、および`OllamaClient`で利用可能です。

`embed()`メソッドを使用してテキストを埋め込みベクトルに変換します。
埋め込みモデルを選択し、このメソッドにテキストを渡します。

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

## モデレーション

!!! note
    以下のLLMクライアントで利用可能です: `OpenAILLMClient`、`BedrockLLMClient`、`MistralAILLMClient`、`OllamaClient`。

モデレーションモデルと`moderate()`メソッドを使用して、プロンプトに不適切なコンテンツが含まれていないかを確認できます。

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
            user("This is a test message that may contain offensive content.")
        },
        model = OpenAIModels.Moderation.Omni
    )

    println(result)
}
```
<!--- KNIT example-llm-clients-06.kt -->

## プロンプトエクゼキュータとの統合

[プロンプトエクゼキュータ](prompt-executors.md)はLLMクライアントをラップし、ルーティング、フォールバック、プロバイダー間での統一された利用などの追加機能を提供します。
複数のプロバイダーと連携する際に柔軟性を提供するため、本番環境での使用が推奨されます。

[^1]: OpenAI Moderation APIを介したモデレーションをサポートしています。
[^2]: モデレーションにはGuardrailsの設定が必要です。
[^3]: Mistral `v1/moderations` エンドポイントを介したモデレーションをサポートしています。