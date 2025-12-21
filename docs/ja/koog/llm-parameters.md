# LLMパラメータ

このページでは、KoogエージェントフレームワークにおけるLLMパラメータの詳細を説明します。LLMパラメータを使用すると、言語モデルの動作を制御およびカスタマイズできます。

## 概要

LLMパラメータは、言語モデルが応答を生成する方法を微調整できる設定オプションです。これらのパラメータは、応答のランダム性、長さ、フォーマット、ツール使用などの側面を制御します。パラメータを調整することで、創造的なコンテンツ生成から決定論的な構造化出力まで、さまざまなユースケースに合わせてモデルの動作を最適化できます。

Koogでは、`LLMParams`クラスがLLMパラメータを組み込み、言語モデルの動作を設定するための一貫したインターフェースを提供します。LLMパラメータは以下の方法で使用できます。

- プロンプトを作成する場合:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val prompt = prompt(
    id = "dev-assistant",
    params = LLMParams(
        temperature = 0.7,
        maxTokens = 500
    )
) {
    // Add a system message to set the context
    system("You are a helpful assistant.")

    // Add a user message
    user("Tell me about Kotlin")
}
```
<!--- KNIT example-llm-parameters-01.kt -->

プロンプトの作成に関する詳細については、「[Prompts](prompts/structured-prompts.md)」を参照してください。

- サブグラフを作成する場合:

<!--- INCLUDE
import ai.koog.agents.core.agent.ToolCalls
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.params.LLMParams

val searchTool = SayToUser
val calculatorTool = SayToUser
val weatherTool = SayToUser

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processQuery by subgraphWithTask<String, String>(
    tools = listOf(searchTool, calculatorTool, weatherTool),
    llmModel = OpenAIModels.Chat.GPT4o,
    llmParams = LLMParams(
        temperature = 0.7,
        maxTokens = 500
    ),
    runMode = ToolCalls.SEQUENTIAL,
    assistantResponseRepeatMax = 3,
) { userQuery ->
    """
    You are a helpful assistant that can answer questions about various topics.
    Please help with the following query:
    $userQuery
    """
}
```
<!--- KNIT example-llm-parameters-02.kt -->

Koogに存在するサブグラフの種類に関する詳細については、「[Predefined subgraphs](nodes-and-components.md#predefined-subgraphs)」を参照してください。独自のサブグラフの作成と実装に関する詳細については、「[Custom subgraphs](custom-subgraphs.md)」を参照してください。

- LLMライトセッションでプロンプトを更新する場合:

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.params.LLMParams
val strategy = strategy<Unit, Unit>("strategy-name") {
val node by node<Unit, Unit> {
-->
<!--- SUFFIX
   }
}
-->
```kotlin
llm.writeSession {
    changeLLMParams(
        LLMParams(
            temperature = 0.7,
            maxTokens = 500
        )
    )
}
```
<!--- KNIT example-llm-parameters-03.kt -->

セッションに関する詳細については、「[LLMセッションと手動履歴管理](sessions.md)」を参照してください。

## LLMパラメータリファレンス

以下の表は、`LLMParams`クラスに含まれており、Koogで既製として利用可能なすべてのLLMプロバイダーでサポートされているLLMパラメータのリファレンスです。
一部のプロバイダーに固有のパラメータのリストについては、「[プロバイダー固有のパラメータ](#provider-specific-parameters)」を参照してください。

| パラメータ             | 型                             | 説明                                                                                                                                                                                      |
|---------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`         | Double                         | 応答のランダム性を制御します。0.7～1.0のような高い値は、より多様で創造的な応答を生成する一方、低い値はより決定論的で集中的な応答を生成します。            |
| `maxTokens`           | Integer                        | 応答で生成するトークンの最大数。応答の長さを制御するのに役立ちます。                                                                                                                                  |
| `numberOfChoices`     | Integer                        | 生成する代替応答の数。0より大きい必要があります。                                                                                                                                                           |
| `speculation`         | String                         | 結果の速度と精度を高めるように設計された、モデルの動作に影響を与える推測的な設定文字列。特定のモデルのみがサポートしていますが、速度と精度を大幅に向上させる可能性があります。 |
| `schema`              | Schema                         | モデルの応答フォーマットの構造を定義し、JSONのような構造化された出力を可能にします。詳細については、「[スキーマ](#schema)」を参照してください。                                                      |
| `toolChoice`          | ToolChoice                     | 言語モデルのツール呼び出し動作を制御します。詳細については、「[ツール選択](#tool-choice)」を参照してください。                                                                                    |
| `user`                | String                         | リクエストを行うユーザーの識別子で、追跡目的で使用できます。                                                                                                                                            |
| `additionalProperties`| Map&lt;String, JsonElement&gt; | 特定のモデルプロバイダーに固有のカスタムパラメータを格納するために使用できる追加プロパティ。                                                                                          |

各パラメータのデフォルト値のリストについては、対応するLLMプロバイダーのドキュメントを参照してください。

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- Alibaba ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))

## スキーマ

`Schema`インターフェースは、モデルの応答フォーマットの構造を定義します。
Koogは、以下のセクションで説明するように、JSONスキーマをサポートしています。

### JSONスキーマ

JSONスキーマを使用すると、言語モデルから構造化されたJSONデータを要求できます。Koogは以下の2種類のJSONスキーマをサポートしています。

1) **基本JSONスキーマ** (`LLMParams.Schema.JSON.Basic`): 基本的なJSON処理機能に使用されます。このフォーマットは主に、高度なJSONスキーマ機能を持たないネストされたデータ定義に焦点を当てています。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonPrimitive
-->
```kotlin
// Create parameters with a basic JSON schema
val jsonParams = LLMParams(
    temperature = 0.2,
    schema = LLMParams.Schema.JSON.Basic(
        name = "PersonInfo",
        schema = JsonObject(mapOf(
            "type" to JsonPrimitive("object"),
            "properties" to JsonObject(
                mapOf(
                    "name" to JsonObject(mapOf("type" to JsonPrimitive("string"))),
                    "age" to JsonObject(mapOf("type" to JsonPrimitive("number"))),
                    "skills" to JsonObject(
                        mapOf(
                            "type" to JsonPrimitive("array"),
                            "items" to JsonObject(mapOf("type" to JsonPrimitive("string")))
                        )
                    )
                )
            ),
            "additionalProperties" to JsonPrimitive(false),
            "required" to JsonArray(listOf(JsonPrimitive("name"), JsonPrimitive("age"), JsonPrimitive("skills")))
        ))
    )
)
```
<!--- KNIT example-llm-parameters-04.kt -->

2) **標準JSONスキーマ** (`LLMParams.Schema.JSON.Standard`): [json-schema.org](https://json-schema.org/)に従った標準JSONスキーマを表します。このフォーマットは、公式JSONスキーマ仕様の適切なサブセットです。すべてのLLMプロバイダーが完全なJSONスキーマをサポートしているわけではないため、LLMプロバイダーによって特性が異なる場合があることに注意してください。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.JsonArray
-->
```kotlin
// Create parameters with a standard JSON schema
val standardJsonParams = LLMParams(
    temperature = 0.2,
    schema = LLMParams.Schema.JSON.Standard(
        name = "ProductCatalog",
        schema = JsonObject(mapOf(
            "type" to JsonPrimitive("object"),
            "properties" to JsonObject(mapOf(
                "products" to JsonObject(mapOf(
                    "type" to JsonPrimitive("array"),
                    "items" to JsonObject(mapOf(
                        "type" to JsonPrimitive("object"),
                        "properties" to JsonObject(mapOf(
                            "id" to JsonObject(mapOf("type" to JsonPrimitive("string"))),
                            "name" to JsonObject(mapOf("type" to JsonPrimitive("string"))),
                            "price" to JsonObject(mapOf("type" to JsonPrimitive("number"))),
                            "description" to JsonObject(mapOf("type" to JsonPrimitive("string")))
                        )),
                        "additionalProperties" to JsonPrimitive(false),
                        "required" to JsonArray(listOf(JsonPrimitive("id"), JsonPrimitive("name"), JsonPrimitive("price"), JsonPrimitive("description")))
                    ))
                ))
            )),
            "additionalProperties" to JsonPrimitive(false),
            "required" to JsonArray(listOf(JsonPrimitive("products")))
        ))
    )
)
```
<!--- KNIT example-llm-parameters-05.kt -->

## ツール選択

`ToolChoice`クラスは、言語モデルがツールを使用する方法を制御します。以下のオプションを提供します。

* `LLMParams.ToolChoice.Named`: 言語モデルは指定されたツールを呼び出します。呼び出すツールの名前を表す`name`文字列引数を取ります。
* `LLMParams.ToolChoice.All`: 言語モデルはすべてのツールを呼び出します。
* `LLMParams.ToolChoice.None`: 言語モデルはツールを呼び出さず、テキストのみを生成します。
* `LLMParams.ToolChoice.Auto`: 言語モデルは、ツールを呼び出すかどうか、およびどのツールを呼び出すかを自動的に決定します。
* `LLMParams.ToolChoice.Required`: 言語モデルは少なくとも1つのツールを呼び出します。

ここに、特定のツールを呼び出すために`LLMParams.ToolChoice.Named`クラスを使用する例を示します。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-06.kt -->

## プロバイダー固有のパラメータ

Koogは、一部のLLMプロバイダー向けにプロバイダー固有のパラメータをサポートしています。これらのパラメータは、基本の`LLMParams`クラスを拡張し、プロバイダー固有の機能を追加します。以下のクラスには、プロバイダーごとに固有のパラメータが含まれています。

- `OpenAIChatParams`: OpenAI Chat Completions APIに固有のパラメータ。
- `OpenAIResponsesParams`: OpenAI Responses APIに固有のパラメータ。
- `GoogleParams`: Googleモデルに固有のパラメータ。
- `AnthropicParams`: Anthropicモデルに固有のパラメータ。
- `MistralAIParams`: Mistralモデルに固有のパラメータ。
- `DeepSeekParams`: DeepSeekモデルに固有のパラメータ。
- `OpenRouterParams`: OpenRouterモデルに固有のパラメータ。
- `DashscopeParams`: Alibabaモデルに固有のパラメータ。

Koogにおけるプロバイダー固有のパラメータの完全なリファレンスを以下に示します。

=== "OpenAI Chat"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:audio
    llm-parameters-snippets.md:frequencyPenalty
    llm-parameters-snippets.md:logprobs
    llm-parameters-snippets.md:parallelToolCalls
    llm-parameters-snippets.md:presencePenalty
    llm-parameters-snippets.md:promptCacheKey
    llm-parameters-snippets.md:reasoningEffort
    llm-parameters-snippets.md:safetyIdentifier
    llm-parameters-snippets.md:serviceTier
    llm-parameters-snippets.md:stop
    llm-parameters-snippets.md:store
    llm-parameters-snippets.md:topLogprobs
    llm-parameters-snippets.md:topP
    llm-parameters-snippets.md:webSearchOptions
    --8<--

=== "OpenAI Responses"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:background
    llm-parameters-snippets.md:include
    llm-parameters-snippets.md:logprobs
    llm-parameters-snippets.md:maxToolCalls
    llm-parameters-snippets.md:parallelToolCalls
    llm-parameters-snippets.md:promptCacheKey
    llm-parameters-snippets.md:reasoning
    llm-parameters-snippets.md:safetyIdentifier
    llm-parameters-snippets.md:serviceTier
    llm-parameters-snippets.md:store
    llm-parameters-snippets.md:topLogprobs
    llm-parameters-snippets.md:topP
    llm-parameters-snippets.md:truncation
    --8<--

=== "Google"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:thinkingConfig
    llm-parameters-snippets.md:topK
    llm-parameters-snippets.md:topP
    --8<--

=== "Anthropic"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:container
    llm-parameters-snippets.md:mcpServers
    llm-parameters-snippets.md:serviceTier
    llm-parameters-snippets.md:stopSequences
    llm-parameters-snippets.md:thinking
    llm-parameters-snippets.md:topK
    llm-parameters-snippets.md:topP
    --8<--

=== "Mistral"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:frequencyPenalty
    llm-parameters-snippets.md:parallelToolCalls
    llm-parameters-snippets.md:presencePenalty
    llm-parameters-snippets.md:promptMode
    llm-parameters-snippets.md:randomSeed
    llm-parameters-snippets.md:safePrompt
    llm-parameters-snippets.md:stop
    llm-parameters-snippets.md:topP
    --8<--

=== "DeepSeek"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:frequencyPenalty
    llm-parameters-snippets.md:logprobs
    llm-parameters-snippets.md:presencePenalty
    llm-parameters-snippets.md:stop
    llm-parameters-snippets.md:topLogprobs
    llm-parameters-snippets.md:topP
    --8<--

=== "OpenRouter"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:frequencyPenalty
    llm-parameters-snippets.md:logprobs
    llm-parameters-snippets.md:minP
    llm-parameters-snippets.md:models
    llm-parameters-snippets.md:presencePenalty
    llm-parameters-snippets.md:provider
    llm-parameters-snippets.md:repetitionPenalty
    llm-parameters-snippets.md:route
    llm-parameters-snippets.md:stop
    llm-parameters-snippets.md:topA
    llm-parameters-snippets.md:topK
    llm-parameters-snippets.md:topLogprobs
    llm-parameters-snippets.md:topP
    llm-parameters-snippets.md:transforms
    --8<--

=== "Alibaba (DashScope)"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:enableSearch
    llm-parameters-snippets.md:enableThinking
    llm-parameters-snippets.md:frequencyPenalty
    llm-parameters-snippets.md:logprobs
    llm-parameters-snippets.md:parallelToolCalls
    llm-parameters-snippets.md:presencePenalty
    llm-parameters-snippets.md:stop
    llm-parameters-snippets.md:topLogprobs
    llm-parameters-snippets.md:topP
    --8<--

以下の例は、プロバイダー固有の`OpenRouterParams`クラスを使用して定義されたOpenRouter LLMパラメータを示しています。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openrouter.OpenRouterParams
-->
```kotlin
val openRouterParams = OpenRouterParams(
    temperature = 0.7,
    maxTokens = 500,
    frequencyPenalty = 0.5,
    presencePenalty = 0.5,
    topP = 0.9,
    topK = 40,
    repetitionPenalty = 1.1,
    models = listOf("anthropic/claude-3-opus", "anthropic/claude-3-sonnet"),
    transforms = listOf("middle-out")
)
```
<!--- KNIT example-llm-parameters-07.kt -->

## 使用例

### 基本的な使用法

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
// A basic set of parameters with limited length 
val basicParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)
```
<!--- KNIT example-llm-parameters-08.kt -->

### 推論制御

モデルの推論を制御するプロバイダー固有のパラメータを介して、推論制御を実装します。
OpenAI Chat APIと推論をサポートするモデルを使用する場合、`reasoningEffort`パラメータを使用して、モデルが応答を提供する前に生成する推論トークンの数を制御します。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAIChatParams
import ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort
-->
```kotlin
val openAIReasoningEffortParams = OpenAIChatParams(
    reasoningEffort = ReasoningEffort.MEDIUM
)
```
<!--- KNIT example-llm-parameters-09.kt -->

さらに、ステートレスモードでOpenAI Responses APIを使用する場合、推論アイテムの暗号化された履歴を保持し、会話の各ターンでモデルに送信します。暗号化はOpenAI側で行われ、リクエストの`include`パラメータを`reasoning.encrypted_content`に設定して、暗号化された推論トークンを要求する必要があります。
その後、次の会話ターンで暗号化された推論トークンをモデルに渡すことができます。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAIResponsesParams
import ai.koog.prompt.executor.clients.openai.models.OpenAIInclude
-->
```kotlin
val openAIStatelessReasoningParams = OpenAIResponsesParams(
    include = listOf(OpenAIInclude.REASONING_ENCRYPTED_CONTENT)
)
```
<!--- KNIT example-llm-parameters-10.kt -->

### カスタムパラメータ

プロバイダー固有でKoogで既製としてサポートされていないカスタムパラメータを追加するには、以下の例に示すように`additionalProperties`プロパティを使用します。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import ai.koog.prompt.params.additionalPropertiesOf
-->
```kotlin
// Add custom parameters for specific model providers
val customParams = LLMParams(
    additionalProperties = additionalPropertiesOf(
        "top_p" to 0.95,
        "frequency_penalty" to 0.5,
        "presence_penalty" to 0.5
    )
)
```
<!--- KNIT example-llm-parameters-11.kt -->

### パラメータの設定とオーバーライド

以下のコードサンプルは、主に利用したいLLMパラメータのセットを定義し、元のセットの値を部分的にオーバーライドしたり、新しい値を追加したりして別のセットを作成する方法を示しています。
これにより、ほとんどのリクエストに共通のパラメータを定義しつつ、共通パラメータを繰り返すことなく、より具体的なパラメータの組み合わせを追加できます。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
// Define default parameters
val defaultParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)

// Create parameters with some overrides, using defaults for the rest
val overrideParams = LLMParams(
    temperature = 0.2,
    numberOfChoices = 3
).default(defaultParams)
```
<!--- KNIT example-llm-parameters-12.kt -->

結果として得られる`overrideParams`セットの値は、以下と等価です。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val overrideParams = LLMParams(
    temperature = 0.2,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto,
    numberOfChoices = 3
)
```
<!--- KNIT example-llm-parameters-13.kt -->