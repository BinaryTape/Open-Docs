# プロンプトエグゼキューター

プロンプトエグゼキューターは、1つまたは複数のLLMクライアントのライフサイクルを管理できるようにする高レベルの抽象化を提供します。
統一されたインターフェースを通じて複数のLLMプロバイダーを利用でき、プロバイダー固有の詳細を抽象化しながら、プロバイダー間の動的な切り替えやフォールバックを行うことができます。

## エグゼキューターの種類

Koogは、[`PromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.model.PromptExecutor) インターフェースを実装する3つの主要なプロンプトエグゼキューターを提供しています。

| 種類 | <div style="width:175px">クラス</div> | 説明 |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| シングルプロバイダー | [`SingleLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) | 1つのプロバイダーに対する単一のLLMクライアントをラップします。エージェントが単一のLLMプロバイダー内でのモデルの切り替えのみを必要とする場合に、このエグゼキューターを使用します。 |
| マルチプロバイダー | [`MultiLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor)   | 複数のLLMクライアントをラップし、LLMプロバイダーに基づいて呼び出しをルーティングします。リクエストされたクライアントが利用できない場合に、オプションで設定されたフォールバックプロバイダーとLLMを使用できます。エージェントが異なるプロバイダーのLLMを切り替える必要がある場合に、このエグゼキューターを使用します。 |
| ルーティング | [`RoutingLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.RoutingLLMPromptExecutor) | ルーティング戦略を使用して、特定のLLMモデルへのリクエストを複数のクライアントインスタンスに分散します。レート制限の回避、スループットの向上、ロードバランシングによるフェイルオーバー戦略の実装を行う場合に、このエグゼキューターを使用します。 |

## シングルプロバイダーエグゼキューターの作成

特定のLLMプロバイダー向けのプロンプトエグゼキューターを作成するには、以下の手順を実行します。

1. 対応するAPIキーを使用して、特定のプロバイダーのLLMクライアントを構成します。
2. [`SingleLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.SingleLLMPromptExecutor) を使用してプロンプトエグゼキューターを作成します。

例を示します。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val promptExecutor = MultiLLMPromptExecutor(openAIClient)
```
<!--- KNIT example-prompt-executors-01.kt -->

## マルチプロバイダーエグゼキューターの作成

複数のLLMプロバイダーで動作するプロンプトエグゼキューターを作成するには、以下の手順を実行します。

1. 対応するAPIキーを使用して、必要なLLMプロバイダーのクライアントを構成します。
2. 構成したクライアントを [`MultiLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.MultiLLMPromptExecutor) クラスのコンストラクタに渡し、複数のLLMプロバイダーを持つプロンプトエグゼキューターを作成します。

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

## ルーティングエグゼキューターの作成

!!! warning "実験的API"
    ルーティング機能は実験的であり、将来のリリースで変更される可能性があります。
    これらを使用するには、`@OptIn(ExperimentalRoutingApi::class)` でオプトインしてください。

ルーティング戦略を使用して、特定のLLMモデルへのリクエストを複数のクライアントインスタンスに分散するプロンプトエグゼキューターを作成するには、以下の手順を実行します。

1. 対応するAPIキーを使用して、複数のクライアントインスタンス（同じLLMプロバイダーでも異なるプロバイダーでも可）を構成します。
2. [`RoundRobinRouter`](api:prompt-executor-model::ai.koog.prompt.executor.llms.RoundRobinRouter) などのルーティング戦略を使用してルーターを作成します。
3. ルーターを [`RoutingLLMPromptExecutor`](api:prompt-executor-model::ai.koog.prompt.executor.llms.RoutingLLMPromptExecutor) クラスのコンストラクタに渡します。

これは、レート制限の回避、スループットの向上、フェイルオーバー戦略の実装に役立ちます。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.llms.RoundRobinRouter
import ai.koog.prompt.executor.llms.RoutingLLMPromptExecutor
-->
```kotlin
// 複数のクライアントインスタンスを作成する
val openAI1 = OpenAILLMClient(apiKey = "openai-key-1")
val openAI2 = OpenAILLMClient(apiKey = "openai-key-2")
val anthropic = AnthropicLLMClient(apiKey = "anthropic-key")

// ラウンドロビン戦略でルーターを作成する
val router = RoundRobinRouter(openAI1, openAI2, anthropic)

// ルーティングエグゼキューターを作成する
val routingExecutor = RoutingLLMPromptExecutor(router)
```
<!--- KNIT example-prompt-executors-03.kt -->

このエグゼキューターでプロンプトを実行すると、OpenAIモデルへのリクエストはラウンドロビン戦略を使用して `openAI1` と `openAI2` の間で交互に行われます。Anthropicモデルへのリクエストは、ラウンドロビンがプロバイダーごとに独立したカウンターを保持するため、常に単一の `anthropic` クライアントに送られます。

[`LLMClientRouter`](api:prompt-executor-model::ai.koog.prompt.executor.llms.LLMClientRouter) インターフェースを実装するクラスを作成することで、カスタムルーティング戦略を実装することもできます。

## 定義済みプロンプトエグゼキューター

セットアップを迅速に行うために、Koogは一般的なプロバイダー向けのすぐに使用できるエグゼキューターの実装を提供しています。

以下の表は、特定のLLMクライアントで構成された `SingleLLMPromptExecutor` を返す **定義済みシングルプロバイダーエグゼキューター** です。

| LLMプロバイダー | プロンプトエグゼキューター | 説明 |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| OpenAI         | [simpleOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor)                                  | OpenAIモデルでプロンプトを実行する `OpenAILLMClient` をラップします。 |
| OpenAI         | [simpleAzureOpenAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAzureOpenAIExecutor)                       | Azure OpenAI Serviceを使用するように構成された `OpenAILLMClient` をラップします。 |
| Anthropic      | [simpleAnthropicExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleAnthropicExecutor)                              | Anthropicモデルでプロンプトを実行する `AnthropicLLMClient` をラップします。 |
| Google         | [simpleGoogleAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleGoogleAIExecutor)                              | Googleモデルでプロンプトを実行する `GoogleLLMClient` をラップします。 |
| OpenRouter     | [simpleOpenRouterExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOpenRouterExecutor)                           | OpenRouterでプロンプトを実行する `OpenRouterLLMClient` をラップします。 |
| Amazon Bedrock | [simpleBedrockExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutor)                                  | AWS Bedrockでプロンプトを実行する `BedrockLLMClient` をラップします。 |
| Amazon Bedrock | [simpleBedrockExecutorWithBearerToken](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleBedrockExecutorWithBearerToken) | `BedrockLLMClient` をラップし、提供されたBedrock APIキーを使用してリクエストを送信します。 |
| Mistral        | [simpleMistralAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleMistralAIExecutor)                            | Mistralモデルでプロンプトを実行する `MistralAILLMClient` をラップします。 |
| Ollama         | [simpleOllamaAIExecutor](api:prompt-executor-llms-all::ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor)                              | Ollamaでプロンプトを実行する `OllamaClient` をラップします。 |

以下は、定義済みのシングルおよびマルチプロバイダーエグゼキューターを作成する例です。

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import kotlinx.coroutines.runBlocking
-->
```kotlin
// OpenAIエグゼキューターを作成する
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// OpenAI、Anthropic、GoogleのLLMクライアントを使用してMultiLLMPromptExecutorを作成する
val openAIClient = OpenAILLMClient("OPENAI_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_KEY")
val googleClient = GoogleLLMClient("GOOGLE_KEY")
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-prompt-executors-04.kt -->

## プロンプトの実行

プロンプトエグゼキューターを使用してプロンプトを実行するには、以下の手順を実行します。

1. プロンプトエグゼキューターを作成します。
2. `execute()` メソッドを使用して、特定のLLMでプロンプトを実行します。

例を示します。

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
// OpenAIエグゼキューターを作成する
val promptExecutor = simpleOpenAIExecutor("OPENAI_KEY")

// プロンプトを実行する
val response = promptExecutor.execute(
    prompt = prompt("demo") { user("Summarize this.") },
    model = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-prompt-executors-05.kt -->

これにより、`GPT4o` モデルでプロンプトが実行され、レスポンスが返されます。

!!! note
    プロンプトエグゼキューターは、ストリーミング、複数選択生成、コンテンツモデレーションなど、さまざまな機能を使用してプロンプトを実行するメソッドを提供します。
    プロンプトエグゼキューターはLLMクライアントをラップしているため、各エグゼキューターは対応するクライアントの機能をサポートします。
    詳細については、[LLMクライアント](llm-clients.md) を参照してください。

## プロバイダー間の切り替え

`MultiLLMPromptExecutor` を使用して複数のLLMプロバイダーを扱う場合、それらを切り替えることができます。
プロセスは以下の通りです。

1. 使用したい各プロバイダーのLLMクライアントインスタンスを作成します。
2. LLMプロバイダーをLLMクライアントにマッピングする `MultiLLMPromptExecutor` を作成します。
3. `execute()` メソッドの引数として渡された、対応するクライアントのモデルを使用してプロンプトを実行します。
   プロンプトエグゼキューターは、モデルプロバイダーに基づいて対応するクライアントを自動的に使用してプロンプトを実行します。

プロバイダーを切り替える例を以下に示します。

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
// OpenAI、Anthropic、Googleプロバイダー用のLLMクライアントを作成する
val openAIClient = OpenAILLMClient("OPENAI_API_KEY")
val anthropicClient = AnthropicLLMClient("ANTHROPIC_API_KEY")
val googleClient = GoogleLLMClient("GOOGLE_API_KEY")

// LLMプロバイダーをLLMクライアントにマッピングするMultiLLMPromptExecutorを作成する
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to openAIClient,
    LLMProvider.Anthropic to anthropicClient,
    LLMProvider.Google to googleClient
)

// プロンプトを作成する
val p = prompt("demo") { user("Summarize this.") }

// OpenAIモデルでプロンプトを実行する。プロンプトエグゼキューターは自動的にOpenAIクライアントに切り替わる
val openAIResult = executor.execute(p, OpenAIModels.Chat.GPT4o)

// Anthropicモデルでプロンプトを実行する。プロンプトエグゼキューターは自動的にAnthropicクライアントに切り替わる
val anthropicResult = executor.execute(p, AnthropicModels.Opus_4_6)
```
<!--- KNIT example-prompt-executors-06.kt -->

オプションで、リクエストされたクライアントが利用できない場合に使用するフォールバックLLMプロバイダーとモデルを構成できます。

## フォールバックの構成

マルチプロバイダーおよびルーティングプロンプトエグゼキューターは、リクエストされたLLMクライアントが利用できない場合にフォールバックLLMプロバイダーとモデルを使用するように構成できます。
フォールバックメカニズムを構成するには、`MultiLLMPromptExecutor` または `RoutingLLMPromptExecutor` のコンストラクタに `fallback` パラメータを指定します。

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
<!--- KNIT example-prompt-executors-07.kt -->

`MultiLLMPromptExecutor` に含まれていないLLMプロバイダーのモデルを渡すと、プロンプトエグゼキューターはフォールバックモデルを使用します。

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
// プロンプトを作成する
val p = prompt("demo") { user("Summarize this") }
// Googleモデルを渡すと、Googleクライアントが含まれていないため、プロンプトエグゼキューターはフォールバックモデルを使用する
val response = multiExecutor.execute(p, GoogleModels.Gemini2_5Pro)
```
<!--- KNIT example-prompt-executors-08.kt -->

!!! note
    フォールバックは `execute()` および `executeMultipleChoices()` メソッドでのみ利用可能です。