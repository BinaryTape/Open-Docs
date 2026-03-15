# LLMパラメータ

このページでは、KoogエージェントフレームワークにおけるLLMパラメータの詳細について説明します。LLMパラメータを使用すると、言語モデルの動作を制御およびカスタマイズできます。

## 概要

LLMパラメータは、言語モデルがレスポンスを生成する方法を微調整するための構成オプションです。これらのパラメータは、レスポンスのランダム性、長さ、フォーマット、ツールの使用などの側面を制御します。パラメータを調整することで、クリエイティブなコンテンツ生成から決定的な構造化出力まで、さまざまなユースケースに合わせてモデルの動作を最適化できます。

Koogでは、`LLMParams`クラスにLLMパラメータが組み込まれており、言語モデルの動作を構成するための一貫したインターフェースを提供します。LLMパラメータは以下の方法で使用できます。

- プロンプトを作成する場合：

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
    // コンテキストを設定するためのシステムメッセージを追加する
    system("You are a helpful assistant.")

    // ユーザーメッセージを追加する
    user("Tell me about Kotlin")
}
```
<!--- KNIT example-llm-parameters-01.kt -->

プロンプト作成の詳細については、[プロンプト](prompts/prompt-creation/index.md)を参照してください。

- サブグラフを作成する場合：

<!--- INCLUDE
import ai.koog.agents.core.agent.ToolCalls
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
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

Koogの既存のサブグラフタイプの詳細については、[事前定義されたサブグラフ](nodes-and-components.md#predefined-subgraphs)を参照してください。独自のサブグラフを作成および実装する方法については、[カスタムサブグラフ](custom-subgraphs.md)を参照してください。

- LLM書き込みセッションでプロンプトを更新する場合：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
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

セッションの詳細については、[LLMセッションと手動履歴管理](sessions.md)を参照してください。

## LLMパラメータリファレンス

以下の表は、`LLMParams`クラスに含まれ、Koogで標準提供されているすべてのLLMプロバイダーでサポートされているLLMパラメータのリファレンスです。
一部のプロバイダーに固有のパラメータのリストについては、[プロバイダー固有のパラメータ](#provider-specific-parameters)を参照してください。

| パラメータ | 型 | 説明 |
|------------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature` | Double | 出力のランダム性を制御します。0.7～1.0などの高い値はより多様でクリエイティブなレスポンスを生成し、低い値はより決定的で焦点の絞られたレスポンスを生成します。 |
| `maxTokens` | Integer | レスポンスで生成するトークンの最大数。レスポンスの長さを制御するのに役立ちます。 |
| `numberOfChoices` | Integer | 生成する代替レスポンスの数。0より大きい必要があります。 |
| `speculation` | String | モデルの動作に影響を与える推論的な構成文字列で、結果の速度と精度を高めるように設計されています。特定のモデルでのみサポートされていますが、速度と精度を大幅に向上させる可能性があります。 |
| `schema` | Schema | モデルのレスポンス形式の構造を定義し、JSONなどの構造化出力を可能にします。詳細については、[スキーマ](#schema)を参照してください。 |
| `toolChoice` | ToolChoice | 言語モデルのツール呼び出し動作を制御します。詳細については、[ツール選択](#tool-choice)を参照してください。 |
| `user` | String | リクエストを行うユーザーの識別子で、トラッキングの目的に使用できます。 |
| `additionalProperties` | Map&lt;String, JsonElement&gt; | 特定のモデルプロバイダーに固有のカスタムパラメータを格納するために使用できる追加のプロパティ。 |

各パラメータのデフォルト値のリストについては、対応するLLMプロバイダーのドキュメントを参照してください：

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- Alibaba ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))

## スキーマ

`Schema`インターフェースは、モデルのレスポンス形式の構造を定義します。
Koogは、以下のセクションで説明するようにJSONスキーマをサポートしています。

### JSONスキーマ

JSONスキーマを使用すると、言語モデルから構造化されたJSONデータをリクエストできます。Koogは以下の2種類のJSONスキーマをサポートしています。

1) **基本的なJSONスキーマ** (`LLMParams.Schema.JSON.Basic`): 基本的なJSON処理機能に使用されます。この形式は、高度なJSON Schema機能を使用せず、主にネストされたデータ定義に焦点を当てています。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonPrimitive
-->
```kotlin
// 基本的なJSONスキーマを使用してパラメータを作成する
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

2) **標準JSONスキーマ** (`LLMParams.Schema.JSON.Standard`): [json-schema.org](https://json-schema.org/)に準拠した標準的なJSONスキーマを表します。この形式は、公式のJSON Schema仕様の適切なサブセットです。すべてのLLMプロバイダーが完全なJSONスキーマをサポートしているわけではないため、プロバイダーによってフレーバーが異なる場合があることに注意してください。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.JsonArray
-->
```kotlin
// 標準的なJSONスキーマを使用してパラメータを作成する
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

`ToolChoice`クラスは、言語モデルがツールをどのように使用するかを制御します。以下のオプションを提供します：

* `LLMParams.ToolChoice.Named`: 言語モデルは指定されたツールを呼び出します。呼び出すツールの名前を表す`name`文字列引数を取ります。
* `LLMParams.ToolChoice.All`: 言語モデルはすべてのツールを呼び出します。
* `LLMParams.ToolChoice.None`: 言語モデルはツールを呼び出さず、テキストのみを生成します。
* `LLMParams.ToolChoice.Auto`: 言語モデルはツールを呼び出すかどうか、およびどのツールを呼び出すかを自動的に決定します。
* `LLMParams.ToolChoice.Required`: 言語モデルは少なくとも1つのツールを呼び出します。

以下は、`LLMParams.ToolChoice.Named`クラスを使用して特定のツールを呼び出す例です：

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

Koogは、一部のLLMプロバイダーに対してプロバイダー固有のパラメータをサポートしています。これらのパラメータは、ベースの`LLMParams`クラスを拡張し、プロバイダー固有の機能を追加します。以下のクラスには、プロバイダーごとに固有のパラメータが含まれています：

- `OpenAIChatParams`: OpenAI Chat Completions API固有のパラメータ。
- `OpenAIResponsesParams`: OpenAI Responses API固有のパラメータ。
- `GoogleParams`: Googleモデル固有のパラメータ。
- `AnthropicParams`: Anthropicモデル固有のパラメータ。
- `MistralAIParams`: Mistralモデル固有のパラメータ。
- `DeepSeekParams`: DeepSeekモデル固有のパラメータ。
- `OpenRouterParams`: OpenRouterモデル固有のパラメータ。
- `DashscopeParams`: Alibabaモデル固有のパラメータ。

以下は、Koogにおけるプロバイダー固有のパラメータの完全なリファレンスです：

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

以下の例は、プロバイダー固有の`OpenRouterParams`クラスを使用して定義されたOpenRouter LLMパラメータを示しています：

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
// 長さを制限した基本的なパラメータセット
val basicParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)
```
<!--- KNIT example-llm-parameters-08.kt -->

### 推論制御

モデルの推論を制御するプロバイダー固有のパラメータを通じて、推論制御を実装します。
OpenAI Chat APIと推論をサポートするモデルを使用する場合、`reasoningEffort`パラメータを使用して、レスポンスを提供する前にモデルが生成する推論トークンの量を制御します：

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

さらに、ステートレスモードでOpenAI Responses APIを使用する場合、推論アイテムの暗号化された履歴を保持し、会話のターンごとにモデルに送信します。暗号化はOpenAI側で行われ、リクエストの`include`パラメータを`reasoning.encrypted_content`に設定して、暗号化された推論トークンをリクエストする必要があります。
その後、次の会話のターンで暗号化された推論トークンをモデルに戻すことができます。

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

Koogで標準サポートされていない、プロバイダー固有の可能性があるカスタムパラメータを追加するには、以下の例のように`additionalProperties`プロパティを使用します。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import ai.koog.prompt.params.additionalPropertiesOf
-->
```kotlin
// 特定のモデルプロバイダー用のカスタムパラメータを追加する
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

以下のコードサンプルは、主に使用するLLMパラメータのセットを定義し、元のセットの値を部分的にオーバーライドして新しい値を追加することで別のセットを作成する方法を示しています。
これにより、ほとんどのリクエストに共通するパラメータを定義しつつ、共通のパラメータを繰り返すことなく、より具体的なパラメータの組み合わせを追加できます。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
// デフォルトパラメータを定義する
val defaultParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)

// 一部のオーバーライドを使用してパラメータを作成し、残りはデフォルトを使用する
val overrideParams = LLMParams(
    temperature = 0.2,
    numberOfChoices = 3
).default(defaultParams)
```
<!--- KNIT example-llm-parameters-12.kt -->

生成された`overrideParams`セットの値は、以下と同等です：

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