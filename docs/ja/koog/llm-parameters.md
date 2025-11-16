# LLMパラメータ

このページでは、KoogエージェントフレームワークにおけるLLMパラメータの詳細を説明します。LLMパラメータを使用すると、言語モデルの動作を制御およびカスタマイズできます。

## 概要

LLMパラメータは、言語モデルが応答を生成する方法を微調整できる設定オプションです。これらのパラメータは、応答のランダム性、長さ、フォーマット、ツール使用などの側面を制御します。パラメータを調整することで、創造的なコンテンツ生成から決定論的な構造化出力まで、さまざまなユースケースに合わせてモデルの動作を最適化できます。

Koogでは、`LLMParams`クラスがLLMパラメータを組み込み、言語モデルの動作を設定するための一貫したインターフェースを提供します。LLMパラメータは以下の方法で使用できます。

- プロンプトを作成する場合:

    <!--- INCLUDE
    import ai.koog.prompt.prompt
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
        // コンテキストを設定するためのシステムメッセージを追加
        system("You are a helpful assistant.")

        // ユーザーメッセージを追加
        user("Tell me about Kotlin")
    }
    ```
    <!--- KNIT example-llm-parameters-01.kt -->

    プロンプトの作成に関する詳細については、「[Prompt API](prompt-api.md)」を参照してください。

- サブグラフを作成する場合:

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.ext.tool.SayToUser
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.agents.ext.agent.subgraphWithTask
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
        llmparams = LLMParams(
            temperature = 0.7,
            maxTokens = 500,
        )
    ) { userQuery ->
        """
        You are a helpful assistant that can answer questions about various topics.
        Please help with the following query:
        $userQuery
        """
    }
    ```
    <!--- KNIT example-llm-parameters-02.kt -->

    独自のサブグラフの作成と実装に関する詳細については、「[Custom subgraphs](custom-subgraphs.md)」を参照してください。

- LLMライトセッションでプロンプトを更新する場合:

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
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

    セッションに関する詳細については、「[LLM sessions and manual history management](sessions.md)」を参照してください。

## LLMパラメータリファレンス

以下の表は、`LLMParams`クラスに含まれており、Koogで既製として利用可能なすべてのLLMプロバイダーでサポートされているLLMパラメータのリファレンスです。一部のプロバイダーに固有のパラメータのリストについては、「[プロバイダー固有のパラメータ](#provider-specific-parameters)」を参照してください。

| パラメータ             | 型                             | 説明                                                                                                                                                                                      |
|---------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`         | Double                         | 応答のランダム性を制御します。0.7～1.0のような高い値は、より多様で創造的な応答を生成する一方、低い値はより決定論的で集中的な応答を生成します。            |
| `maxTokens`           | Integer                        | 応答で生成するトークンの最大数。応答の長さを制御するのに役立ちます。                                                                                                                                  |
| `numberOfChoices`     | Integer                        | 生成する代替応答の数。0より大きい必要があります。                                                                                                                                                           |
| `speculation`         | String                         | 結果の速度と精度を高めるように設計された、モデルの動作に影響を与える推測的な設定文字列。特定のモデルのみがサポートしていますが、速度と精度を大幅に向上させる可能性があります。 |
| `schema`              | Schema                         | モデルの応答フォーマットの構造を定義し、JSONのような構造化された出力を可能にします。詳細については、「[Schema](#schema)」を参照してください。                                                      |
| `toolChoice`          | ToolChoice                     | 言語モデルのツール呼び出し動作を制御します。詳細については、「[Tool choice](#tool-choice)」を参照してください。                                                                                    |
| `user`                | String                         | リクエストを行うユーザーの識別子で、追跡目的で使用できます。                                                                                                                                            |
| `additionalProperties`| Map&lt;String, JsonElement&gt; | 特定のモデルプロバイダーに固有のカスタムパラメータを格納するために使用できる追加プロパティ。                                                                                          |

各パラメータのデフォルト値のリストについては、対応するLLMプロバイダーのドキュメントを参照してください。

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api-reference/parameters)

## スキーマ

`Schema`インターフェースは、モデルの応答フォーマットの構造を定義します。Koogは、以下のセクションで説明するように、JSONスキーマをサポートしています。

### JSONスキーマ

JSONスキーマを使用すると、言語モデルから構造化されたJSONデータを要求できます。Koogは以下の2種類のJSONスキーマをサポートしています。

1.  **基本JSONスキーマ** (`LLMParams.Schema.JSON.Basic`): 基本的なJSON処理機能に使用されます。このフォーマットは主に、高度なJSONスキーマ機能を持たないネストされたデータ定義に焦点を当てています。

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

2.  **標準JSONスキーマ** (`LLMParams.Schema.JSON.Standard`): [json-schema.org](https://json-schema.org/)に従った標準JSONスキーマを表します。このフォーマットは、公式JSONスキーマ仕様の適切なサブセットです。すべてのLLMプロバイダーが完全なJSONスキーマをサポートしているわけではないため、LLMプロバイダーによって特性が異なる場合があることに注意してください。

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

*   `LLMParams.ToolChoice.Named`: 言語モデルは指定されたツールを呼び出します。呼び出すツールの名前を表す`name`文字列引数を取ります。
*   `LLMParams.ToolChoice.All`: 言語モデルはすべてのツールを呼び出します。
*   `LLMParams.ToolChoice.None`: 言語モデルはツールを呼び出さず、テキストのみを生成します。
*   `LLMParams.ToolChoice.Auto`: 言語モデルは、ツールを呼び出すかどうか、およびどのツールを呼び出すかを自動的に決定します。
*   `LLMParams.ToolChoice.Required`: 言語モデルは少なくとも1つのツールを呼び出します。

ここに、特定のツールを呼び出すために`LLMParams.ToolChoice.Named`クラスを使用する例を示します。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-01.kt -->

## プロバイダー固有のパラメータ

Koogは、一部のLLMプロバイダー向けにプロバイダー固有のパラメータをサポートしています。これらのパラメータは、基本の`LLMParams`クラスを拡張し、プロバイダー固有の機能を追加します。以下のクラスには、プロバイダーごとに固有のパラメータが含まれています。

-   `DeepSeekParams`: DeepSeekモデルに固有のパラメータ。
-   `OpenRouterParams`: OpenRouterモデルに固有のパラメータ。
-   `OpenAIChatParams`: OpenAI Chat Completions APIに固有のパラメータ。
-   `OpenAIResponsesParams`: OpenAI Responses APIに固有のパラメータ。

Koogにおけるプロバイダー固有のパラメータの完全なリファレンスを以下に示します。

| パラメータ          | プロバイダー                                        | 型                     | 説明                                                                                                                                                                                                                                                                                                                                                                                                                        |
|--------------------|----------------------------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topP`             | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Double                 | nucleus samplingとも呼ばれます。確率値の合計が指定された`topP`値に達するまで、最も高い確率値を持つトークンをサブセットに追加することで、次のトークンのサブセットを作成します。0.0より大きく1.0以下の値を取ります。                                                                                                                                                   |
| `logprobs`         | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Boolean                | `true`の場合、出力トークンのログ確率を含めます。                                                                                                                                                                                                                                                                                                                                            |
| `topLogprobs`      | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Integer                | 位置ごとの最も可能性の高い上位トークンの数。0～20の範囲の値を取ります。`logprobs`パラメータが`true`に設定されている必要があります。                                                                                                                                                                                                                                                                                          |
| `frequencyPenalty` | OpenAI Chat, DeepSeek, OpenRouter                  | Double                 | 頻繁に出現するトークンにペナルティを課して繰り返しを減らします。`frequencyPenalty`値が高いほど、フレーズの多様性が増し、繰り返しが減少します。-2.0～2.0の範囲の値を取ります。                                                                                                                                                                                                                                        |
| `presencePenalty`  | OpenAI Chat, DeepSeek, OpenRouter                  | Double                 | モデルが出力にすでに含まれているトークンを再利用するのを防ぎます。値が高いほど、新しいトークンやトピックの導入を促します。-2.0～2.0の範囲の値を取ります。                                                                                                                                                                                                                                |
| `stop`             | OpenAI Chat, DeepSeek, OpenRouter                  | List&lt;String&gt;     | モデルがこれらのいずれかに遭遇したときに、コンテンツの生成を停止するようモデルに合図する文字列。例えば、モデルが2つの改行を生成したときにコンテンツの生成を停止させるには、停止シーケンスを`stop = listOf("/n/n")`として指定します。                                                                                                                                                 |
| `parallelToolCalls`| OpenAI Chat, OpenAI Responses                      | Boolean                | `true`の場合、複数のツール呼び出しを並行して実行できます。                                                                                                                                                                                                                                                                                                                                                 |
| `promptCacheKey`   | OpenAI Chat, OpenAI Responses                      | String                 | プロンプトキャッシュ用の安定したキャッシュキー。OpenAIはこれを使用して、類似のリクエストの応答をキャッシュします。                                                                                                                                                                                                                                                                                                                                       |
| `safetyIdentifier` | OpenAI Chat, OpenAI Responses                      | String                 | OpenAIポリシーに違反するユーザーを検出するために使用できる、安定した一意のユーザー識別子。                                                                                                                                                                                                                                                                                                                                  |
| `serviceTier`      | OpenAI Chat, OpenAI Responses                      | ServiceTier            | OpenAIの処理層選択。コストよりもパフォーマンスを優先するか、その逆かを指定できます。詳細については、[ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html)のAPIドキュメントを参照してください。                                                                               |
| `store`            | OpenAI Chat, OpenAI Responses                      | Boolean                | `true`の場合、プロバイダーは後で取得できるように出力を保存できます。                                                                                                                                                                                                                                                                                                                                                                     |
| `audio`            | OpenAI Chat                                        | OpenAIAudioConfig      | オーディオ対応モデルを使用する場合のオーディオ出力設定。詳細については、[OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html)のAPIドキュメントを参照してください。                                                                                                   |
| `reasoningEffort`  | OpenAI Chat                                        | ReasoningEffort        | モデルが使用する推論のレベルを指定します。詳細および利用可能な値については、[ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html)のAPIドキュメントを参照してください。                                                                                |
| `webSearchOptions` | OpenAI Chat                                        | OpenAIWebSearchOptions | ウェブ検索ツール使用を構成します（サポートされている場合）。詳細については、[OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html)のAPIドキュメントを参照してください。                                                                                                    |
| `background`       | OpenAI Responses                                   | Boolean                | バックグラウンドで応答を実行します。                                                                                                                                                                                                                                                                                                                                                                                                |
| `include`          | OpenAI Responses                                   | List&lt;String&gt;     | 含める追加の出力セクション。詳細については、OpenAIドキュメントの[include](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include)パラメータについて学習してください。                                                                                                                                                                                                              |
| `maxToolCalls`     | OpenAI Responses                                   | Int                    | この応答で許可される組み込みツール呼び出しの最大総数。`0`以上の値を取ります。                                                                                                                                                                                                                                                                                                                                                 |
| `reasoning`        | OpenAI Responses                                   | ReasoningConfig        | 推論可能なモデルの推論設定。詳細については、[ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html)のAPIドキュメントを参照してください。                                                                                                                         |
| `truncation`       | OpenAI Responses                                   | Truncation             | コンテキストウィンドウに近づいた場合の切り詰め戦略。詳細については、[Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html)のAPIドキュメントを参照してください。                                                                                                                                      |
| `topK`             | OpenRouter                                         | Int                    | 出力を生成する際に考慮する上位トークンの数。1以上の値を取ります。                                                                                                                                                                                                                                                                                                                                                            |
| `repetitionPenalty`| OpenRouter                                         | Double                 | トークンの繰り返しにペナルティを課します。出力に既に出現したトークンの次トークン確率は`repetitionPenalty`の値で割られるため、`repetitionPenalty > 1`の場合、再度出現する可能性が低くなります。0.0より大きく2.0以下の値を取ります。                                                                                                                                       |
| `minP`             | OpenRouter                                         | Double                 | 最も可能性の高いトークンに対する相対確率が定義された`minP`値より低いトークンを除外します。0.0～0.1の範囲の値を取ります。                                                                                                                                                                                                                                                                                                                  |
| `topA`             | OpenRouter                                         | Double                 | モデルの信頼度に基づいてサンプリングウィンドウを動的に調整します。モデルが確信している場合（支配的な高確率の次トークンがある場合）、サンプリングウィンドウを少数の上位トークンに限定します。信頼度が低い場合（類似の確率を持つ多くのトークンがある場合）、より多くのトークンをサンプリングウィンドウに保持します。0.0～0.1の範囲の値を取ります（両端を含む）。値が高いほど、動的な適応性が高まります。 |
| `transforms`       | OpenRouter                                         | List&lt;String&gt;     | コンテキスト変換のリスト。コンテキストがモデルのトークン制限を超えた場合にどのように変換されるかを定義します。デフォルトの変換は`middle-out`で、プロンプトの中央から切り詰めます。変換しない場合は空のリストを使用します。詳細については、OpenRouterドキュメントの[Message Transforms](https://openrouter.ai/docs/features/message-transforms)を参照してください。                                                       |
| `models`           | OpenRouter                                         | List&lt;String&gt;     | リクエストで許可されるモデルのリスト。                                                                                                                                                                                                                                                                                                                                                                                            |
| `route`            | OpenRouter                                         | String                 | リクエストルーティング識別子。                                                                                                                                                                                                                                                                                                                                                                                                        |
| `provider`         | OpenRouter                                         | ProviderPreferences    | モデルプロバイダーのプリファレンス。詳細については、[ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html)のAPIドキュメントを参照してください。                                                                                                                                     |

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
<!--- KNIT example-llm-parameters-02.kt -->

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
<!--- KNIT example-llm-parameters-03.kt -->

### 推論制御

モデルの推論を制御するプロバイダー固有のパラメータを介して、推論制御を実装します。OpenAI Chat APIと推論をサポートするモデルを使用する場合、`reasoningEffort`パラメータを使用して、モデルが応答を提供する前に生成する推論トークンの数を制御します。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAIChatParams
import ai.koog.prompt.executor.clients.openai.base.models.ReasoningEffort
-->
```kotlin
val openAIReasoningEffortParams = OpenAIChatParams(
    reasoningEffort = ReasoningEffort.MEDIUM
)
```
<!--- KNIT example-llm-parameters-04.kt -->

さらに、ステートレスモードでOpenAI Responses APIを使用する場合、推論アイテムの暗号化された履歴を保持し、会話の各ターンでモデルに送信します。暗号化はOpenAI側で行われ、リクエストの`include`パラメータを`reasoning.encrypted_content`に設定して、暗号化された推論トークンを要求する必要があります。その後、次の会話ターンで暗号化された推論トークンをモデルに渡すことができます。

<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAIResponsesParams
import ai.koog.prompt.executor.clients.openai.models.OpenAIInclude
-->
```kotlin
val openAIStatelessReasoningParams = OpenAIResponsesParams(
    include = listOf(OpenAIInclude.REASONING_ENCRYPTED_CONTENT)
)
```
<!--- KNIT example-llm-parameters-05.kt -->

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
<!--- KNIT example-llm-parameters-06.kt -->

### パラメータの設定とオーバーライド

以下のコードサンプルは、主に利用したいLLMパラメータのセットを定義し、元のセットの値を部分的にオーバーライドしたり、新しい値を追加したりして別のセットを作成する方法を示しています。これにより、ほとんどのリクエストに共通のパラメータを定義しつつ、共通パラメータを繰り返すことなく、より具体的なパラメータの組み合わせを追加できます。

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
<!--- KNIT example-llm-parameters-07.kt -->

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
<!--- KNIT example-llm-parameters-08.kt -->