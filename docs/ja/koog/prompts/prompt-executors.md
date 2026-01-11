# プロンプトエクゼキュータ

プロンプトエクゼキュータは、1つまたは複数のLLMクライアントのライフサイクルを管理できる、より高レベルの抽象化を提供します。
統一されたインターフェースを通じて複数のLLMプロバイダと連携でき、プロバイダ固有の詳細から抽象化され、
それらの間の動的な切り替えやフォールバックが可能です。

## エクゼキュータの種類

Koogは、[`PromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-model/ai.koog.prompt.executor.model/-prompt-executor/index.html) インターフェースを実装する、主に2つのタイプのプロンプトエクゼキュータを提供します。

| タイプ            | <div style="width:175px">クラス</div>                                                                                                                               | 説明                                                                                                                                                                                                                                                          |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 単一プロバイダ    | [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) | 単一のプロバイダに対して単一のLLMクライアントをラップします。エージェントが単一のLLMプロバイダ内でモデルを切り替えることのみを必要とする場合に、このエクゼキュータを使用します。                                                                                                                     |
| 複数プロバイダ    | [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html)   | 複数のLLMクライアントをラップし、LLMプロバイダに基づいて呼び出しをルーティングします。オプションで、要求されたクライアントが利用できない場合に、設定されたフォールバックプロバイダとLLMを使用できます。エージェントが異なるプロバイダのLLMを切り替える必要がある場合に、このエクゼキュータを使用します。 |

## 単一プロバイダエクゼキュータの作成

特定のLLMプロバイダのプロンプトエクゼキュータを作成するには、以下を実行します。

1.  特定のプロバイダ向けに、対応するAPIキーを使用してLLMクライアントを設定します。
2.  [`SingleLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-single-l-l-m-prompt-executor/index.html) を使用してプロンプトエクゼキュータを作成します。

例を以下に示します。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = MultiLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-executors-01.kt -->

## 複数プロバイダエクゼキュータの作成

複数のLLMプロバイダと連携するプロンプトエクゼキュータを作成するには、以下を実行します。

1.  必要なLLMプロバイダ向けに、対応するAPIキーを使用してクライアントを設定します。
2.  設定されたクライアントを [`MultiLLMPromptExecutor`](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms/ai.koog.prompt.executor.llms/-multi-l-l-m-prompt-executor/index.html) クラスのコンストラクタに渡し、複数のLLMプロバイダを持つプロンプトエクゼキュータを作成します。

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

## 定義済みプロンプトエクゼキュータ

より迅速なセットアップのために、Koogは一般的なプロバイダ向けのすぐに使えるエクゼキュータ実装を提供しています。

以下の表は、特定のLLMクライアントで構成された `SingleLLMPromptExecutor` を返す**定義済み単一プロバイダエクゼキュータ**を含みます。

| LLMプロバイダ   | プロンプトエクゼキュータ                                                                                                                                                                             | 説明                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| OpenAI         | [simpleOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-a-i-executor.html)                                  | OpenAIモデルでプロンプトを実行する `OpenAILLMClient` をラップします。                            |
| OpenAI         | [simpleAzureOpenAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-azure-open-a-i-executor.html)                       | Azure OpenAI Serviceを使用するように構成された `OpenAILLMClient` をラップします。                |
| Anthropic      | [simpleAnthropicExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-anthropic-executor.html)                              | Anthropicモデルでプロンプトを実行する `AnthropicLLMClient` をラップします。                      |
| Google         | [simpleGoogleAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-google-a-i-executor.html)                              | Googleモデルでプロンプトを実行する `GoogleLLMClient` をラップします。                            |
| OpenRouter     | [simpleOpenRouterExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-open-router-executor.html)                           | OpenRouterでプロンプトを実行する `OpenRouterLLMClient` をラップします。                          |
| Amazon Bedrock | [simpleBedrockExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor.html)                                  | AWS Bedrockでプロンプトを実行する `BedrockLLMClient` をラップします。                            |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-bedrock-executor-with-bearer-token.html) | `BedrockLLMClient` をラップし、提供されたBedrock APIキーを使用してリクエストを送信します。 |
| Mistral        | [simpleMistralAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-mistral-a-i-executor.html)                            | Mistralモデルでプロンプトを実行する `MistralAILLMClient` をラップします。                        |
| Ollama         | [simpleOllamaAIExecutor](https://api.koog.ai/prompt/prompt-executor/prompt-executor-llms-all/ai.koog.prompt.executor.llms.all/simple-ollama-a-i-executor.html)                              | Ollamaでプロンプトを実行する `OllamaClient` をラップします。                                     |

定義済みの単一および複数プロバイダエクゼキュータを作成する例を以下に示します。

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

## プロンプトの実行

プロンプトエクゼキュータを使用してプロンプトを実行するには、以下を実行します。

1.  プロンプトエクゼキュータを作成します。
2.  `execute()` メソッドを使用して、特定のLLMでプロンプトを実行します。

例を以下に示します。

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

これにより、`GPT4o` モデルでプロンプトが実行され、応答が返されます。

!!! note
    プロンプトエクゼキュータは、ストリーミング、複数選択肢生成、コンテンツモデレーションなど、さまざまな機能を使用してプロンプトを実行するメソッドを提供します。
    プロンプトエクゼキュータはLLMクライアントをラップするため、各エクゼキュータは対応するクライアントの機能をサポートします。
    詳細については、[LLMクライアント](llm-clients.md)を参照してください。

## プロバイダ間の切り替え

`MultiLLMPromptExecutor` を使用して複数のLLMプロバイダと連携する場合、それらを切り替えることができます。
そのプロセスは以下のとおりです。

1.  使用する各プロバイダのLLMクライアントインスタンスを作成します。
2.  LLMプロバイダをLLMクライアントにマッピングする `MultiLLMPromptExecutor` を作成します。
3.  `execute()` メソッドの引数として渡された、対応するクライアントのモデルでプロンプトを実行します。プロンプトエクゼキュータは、モデルプロバイダに基づいて対応するクライアントを使用してプロンプトを実行します。

プロバイダ間を切り替える例を以下に示します。

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

要求されたクライアントが利用できない場合に備えて、オプションでフォールバックLLMプロバイダとモデルを設定できます。詳細については、[フォールバックの設定](#configuring-fallbacks)を参照してください。

## フォールバックの設定

複数プロバイダのプロンプトエクゼキュータは、要求されたLLMクライアントが利用できない場合に、フォールバックLLMプロバイダとモデルを使用するように設定できます。
フォールバックメカニズムを設定するには、`MultiLLMPromptExecutor` コンストラクタに `fallback` パラメータを指定します。

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

`MultiLLMPromptExecutor` に含まれていないLLMプロバイダのモデルを渡した場合、プロンプトエクゼキュータはフォールバックモデルを使用します。

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
    フォールバックは、`execute()` および `executeMultipleChoices()` メソッドでのみ利用可能です。