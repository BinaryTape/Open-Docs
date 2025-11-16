# LLM 參數

本頁提供關於 Koog 代理式框架中 LLM 參數的詳細資訊。LLM 參數讓您能夠控制和自訂語言模型的行為。

## 總覽

LLM 參數是配置選項，讓您可以微調語言模型生成回應的方式。這些參數控制回應的隨機性、長度、格式和工具使用等方面。透過調整這些參數，您可以為不同的使用案例優化模型行為，從創意內容生成到確定性結構化輸出。

在 Koog 中，`LLMParams` 類別整合了 LLM 參數，並提供了一個一致的介面來配置語言模型的行為。您可以透過以下方式使用 LLM 參數：

- 建立提示時：

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
        // 新增系統訊息以設定上下文
        system("You are a helpful assistant.")

        // 新增使用者訊息
        user("Tell me about Kotlin")
    }
    ```
    <!--- KNIT example-llm-parameters-01.kt -->

    有關提示建立的更多資訊，請參閱 [Prompt API](prompt-api.md)。

- 建立子圖時：

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

    有關如何建立和實作您自己的子圖的更多資訊，請參閱 [Custom subgraphs](custom-subgraphs.md)。

- 在 LLM 寫入工作階段中更新提示時：

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

    有關工作階段的更多資訊，請參閱 [LLM sessions and manual history management](sessions.md)。

## LLM 參數參考

下表提供了 `LLMParams` 類別中包含的 LLM 參數的參考，這些參數受 Koog 開箱即用的所有 LLM 供應商支援。有關某些供應商特有的參數列表，請參閱 [特定供應商參數](#provider-specific-parameters)。

| 參數                     | 類型                           | 描述                                                                                                                                                                                                |
|--------------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`            | Double                         | 控制輸出的隨機性。較高的值（例如 0.7–1.0）會產生更多樣化和有創意的回應，而較低的值則會產生更具確定性和重點的回應。                                                                                        |
| `maxTokens`              | Integer                        | 回應中要生成的最大符元數。對於控制回應長度很有用。                                                                                                                                                      |
| `numberOfChoices`        | Integer                        | 要生成的替代回應數量。必須大於 0。                                                                                                                                                                  |
| `speculation`            | String                         | 一個推測配置字串，影響模型行為，旨在提高結果的速度和準確性。僅由某些模型支援，但可以大大提高速度和準確性。                                                                                              |
| `schema`                 | Schema                         | 定義模型回應格式的結構，啟用像 JSON 這樣的結構化輸出。有關更多資訊，請參閱 [Schema](#schema)。                                                                                                   |
| `toolChoice`             | ToolChoice                     | 控制語言模型的工具呼叫行為。有關更多資訊，請參閱 [Tool choice](#tool-choice)。                                                                                                                       |
| `user`                   | String                         | 發出請求的使用者識別碼，可用於追蹤目的。                                                                                                                                                            |
| `additionalProperties`   | Map&lt;String, JsonElement&gt; | 可用於儲存特定模型供應商的自訂參數的其他屬性。                                                                                                                                                      |

有關每個參數的預設值列表，請參閱相應的 LLM 供應商文件：

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api-reference/parameters)

## 綱要

`Schema` 介面定義了模型回應格式的結構。Koog 支援 JSON 綱要，如下方章節所述。

### JSON 綱要

JSON 綱要讓您可以從語言模型請求結構化的 JSON 資料。Koog 支援以下兩種 JSON 綱要：

1.  **基本 JSON 綱要** (`LLMParams.Schema.JSON.Basic`)：用於基本的 JSON 處理功能。這種格式主要側重於巢狀資料定義，而不包含進階的 JSON Schema 功能。

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonArray
    import kotlinx.serialization.json.JsonPrimitive
    -->
    ```kotlin
    // 建立帶有基本 JSON 綱要的參數
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

2.  **標準 JSON 綱要** (`LLMParams.Schema.JSON.Standard`)：代表符合 [json-schema.org](https://json-schema.org/) 的標準 JSON 綱要。這種格式是官方 JSON Schema 規範的適當子集。請注意，不同 LLM 供應商的風格可能有所不同，因為並非所有供應商都支援完整的 JSON 綱要。

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonPrimitive
    import kotlinx.serialization.json.JsonArray
    -->
    ```kotlin
    // 建立帶有標準 JSON 綱要的參數
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

## 工具選擇

`ToolChoice` 類別控制語言模型如何使用工具。它提供以下選項：

*   `LLMParams.ToolChoice.Named`：語言模型呼叫指定的工具。接受表示要呼叫的工具名稱的 `name` 字串引數。
*   `LLMParams.ToolChoice.All`：語言模型呼叫所有工具。
*   `LLMParams.ToolChoice.None`：語言模型不呼叫工具，僅生成文字。
*   `LLMParams.ToolChoice.Auto`：語言模型自動決定是否呼叫工具以及呼叫哪個工具。
*   `LLMParams.ToolChoice.Required`：語言模型至少呼叫一個工具。

以下是使用 `LLMParams.ToolChoice.Named` 類別呼叫特定工具的範例：

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-01.kt -->

## 特定供應商參數

Koog 支援某些 LLM 供應商的特定供應商參數。這些參數擴展了基礎 `LLMParams` 類別，並增加了特定供應商的功能。以下類別包含每個供應商特有的參數：

-   `DeepSeekParams`：DeepSeek 模型特有的參數。
-   `OpenRouterParams`：OpenRouter 模型特有的參數。
-   `OpenAIChatParams`：OpenAI Chat Completions API 特有的參數。
-   `OpenAIResponsesParams`：OpenAI Responses API 特有的參數。

以下是 Koog 中特定供應商參數的完整參考：

| 參數                  | 供應商                                            | 類型                   | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-----------------------|---------------------------------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topP`                | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Double                 | 也稱為核子取樣。透過將具有最高機率值的符元新增到子集中，直到其機率總和達到指定的 `topP` 值，從而建立下一個符元的子集。接受大於 0.0 且小於或等於 1.0 的值。                                                                                                                                                                                                                                                |
| `logprobs`            | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Boolean                | 如果為 `true`，則包含輸出符元的對數機率。                                                                                                                                                                                                                                                                                                                                                                                                          |
| `topLogprobs`         | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Integer                | 每個位置最有可能的頂部符元數量。接受 0–20 範圍內的值。需要將 `logprobs` 參數設定為 `true`。                                                                                                                                                                                                                                                                                                                                                       |
| `frequencyPenalty`    | OpenAI Chat, DeepSeek, OpenRouter                 | Double                 | 懲罰頻繁出現的符元以減少重複。較高的 `frequencyPenalty` 值會導致詞語變化更大並減少重複。接受 -2.0 到 2.0 範圍內的值。                                                                                                                                                                                                                                                                                                                                     |
| `presencePenalty`     | OpenAI Chat, DeepSeek, OpenRouter                 | Double                 | 防止模型重複使用已包含在輸出中的符元。較高的值鼓勵引入新的符元和主題。接受 -2.0 到 2.0 範圍內的值。                                                                                                                                                                                                                                                                                                                                             |
| `stop`                | OpenAI Chat, DeepSeek, OpenRouter                 | List&lt;String&gt;     | 當模型遇到任何這些字串時，會停止生成內容。例如，要讓模型在產生兩個換行符時停止生成內容，請將停止序列指定為 `stop = listOf("/n/n")`。                                                                                                                                                                                                                                                                                                                                           |
| `parallelToolCalls`   | OpenAI Chat, OpenAI Responses                     | Boolean                | 如果為 `true`，多個工具呼叫可以平行執行。                                                                                                                                                                                                                                                                                                                                                                                                               |
| `promptCacheKey`      | OpenAI Chat, OpenAI Responses                     | String                 | 用於提示快取的穩定快取鍵。OpenAI 使用它來快取相似請求的回應。                                                                                                                                                                                                                                                                                                                                                                                                     |
| `safetyIdentifier`    | OpenAI Chat, OpenAI Responses                     | String                 | 一個穩定且唯一的使用者識別碼，可用於偵測違反 OpenAI 政策的使用者。                                                                                                                                                                                                                                                                                                                                                                                                |
| `serviceTier`         | OpenAI Chat, OpenAI Responses                     | ServiceTier            | OpenAI 處理層級選擇，讓您可以在效能和成本之間進行優先排序，反之亦然。有關更多資訊，請參閱 [ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html) 的 API 文件。                                                                                                                                             |
| `store`               | OpenAI Chat, OpenAI Responses                     | Boolean                | 如果為 `true`，供應商可能會儲存輸出以供稍後擷取。                                                                                                                                                                                                                                                                                                                                                                                                    |
| `audio`               | OpenAI Chat                                       | OpenAIAudioConfig      | 使用支援音訊的模型時的音訊輸出配置。有關更多資訊，請參閱 [OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html) 的 API 文件。                                                                                                                                                                   |
| `reasoningEffort`     | OpenAI Chat                                       | ReasoningEffort        | 指定模型將使用的推理工作量等級。有關更多資訊和可用值，請參閱 [ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html) 的 API 文件。                                                                                                                                              |
| `webSearchOptions`    | OpenAI Chat                                       | OpenAIWebSearchOptions | 配置網路搜尋工具使用（如果支援）。有關更多資訊，請參閱 [OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html) 的 API 文件。                                                                                                                                                                  |
| `background`          | OpenAI Responses                                  | Boolean                | 在背景中執行回應。                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `include`             | OpenAI Responses                                  | List&lt;String&gt;     | 要包含的其他輸出部分。有關更多資訊，請參閱 OpenAI 文件中關於 [include](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include) 參數的說明。                                                                                                                                                                                                              |
| `maxToolCalls`        | OpenAI Responses                                  | Int                    | 此回應中允許的最大內建工具呼叫總數。接受大於或等於 `0` 的值。                                                                                                                                                                                                                                                                                                                                                                                                               |
| `reasoning`           | OpenAI Responses                                  | ReasoningConfig        | 支援推理的模型之推理配置。有關更多資訊，請參閱 [ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html) 的 API 文件。                                                                                                                         |
| `truncation`          | OpenAI Responses                                  | Truncation             | 接近上下文視窗時的截斷策略。有關更多資訊，請參閱 [Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html) 的 API 文件。                                                                                                                                      |
| `topK`                | OpenRouter                                        | Int                    | 生成輸出時要考慮的頂部符元數量。接受大於或等於 1 的值。                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `repetitionPenalty`   | OpenRouter                                        | Double                 | 懲罰符元重複。如果 `repetitionPenalty > 1`，已出現在輸出中的符元的下一個符元機率將除以 `repetitionPenalty` 的值，這使得它們再次出現的可能性降低。接受大於 0.0 且小於或等於 2.0 的值。                                                                                                                                                                                                     |
| `minP`                | OpenRouter                                        | Double                 | 過濾掉相對於最有可能符元的機率低於定義的 `minP` 值的符元。接受 0.0–0.1 範圍內的值。                                                                                                                                                                                                                                                                                                                                                                                       |
| `topA`                | OpenRouter                                        | Double                 | 根據模型置信度動態調整取樣視窗。如果模型有信心（存在主要的、高機率的下一個符元），它會將取樣視窗限制在幾個頂部符元。如果置信度低（存在許多機率相似的符元），則會在取樣視窗中保留更多符元。接受 0.0–0.1（含）範圍內的值。值越高表示動態適應性越強。 |
| `transforms`          | OpenRouter                                        | List&lt;String&gt;     | 上下文轉換列表。定義當上下文超出模型符元限制時如何轉換。預設轉換是 `middle-out`，它從提示的中間截斷。使用空列表表示不進行轉換。有關更多資訊，請參閱 OpenRouter 文件中的 [Message Transforms](https://openrouter.ai/docs/features/message-transforms)。                                                       |
| `models`              | OpenRouter                                        | List&lt;String&gt;     | 請求允許的模型列表。                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `route`               | OpenRouter                                        | String                 | 請求路由識別碼。                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `provider`            | OpenRouter                                        | ProviderPreferences    | 模型供應商偏好設定。有關更多資訊，請參閱 [ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html) 的 API 文件。                                                                                                                                     |

以下範例展示了使用特定供應商的 `OpenRouterParams` 類別定義 OpenRouter LLM 參數：

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

## 使用範例

### 基本用法

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
// 一組具有有限長度的基本參數
val basicParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)
```
<!--- KNIT example-llm-parameters-03.kt -->

### 推理控制

您可以透過控制模型推理的特定供應商參數來實施推理控制。當使用 OpenAI Chat API 和支援推理的模型時，請使用 `reasoningEffort` 參數來控制模型在提供回應之前生成多少推理符元：

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

此外，當在無狀態模式下使用 OpenAI Responses API 時，您會保留推理項目的加密歷史記錄，並在每個對話回合中將其發送到模型。加密在 OpenAI 端完成，您需要透過將請求中的 `include` 參數設定為 `reasoning.encrypted_content` 來請求加密的推理符元。然後，您可以在後續的對話回合中將加密的推理符元傳回給模型。

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

### 自訂參數

若要新增可能為特定供應商且 Koog 不支援的自訂參數，請使用以下範例所示的 `additionalProperties` 屬性。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
import ai.koog.prompt.params.additionalPropertiesOf
-->
```kotlin
// 為特定模型供應商新增自訂參數
val customParams = LLMParams(
    additionalProperties = additionalPropertiesOf(
        "top_p" to 0.95,
        "frequency_penalty" to 0.5,
        "presence_penalty" to 0.5
    )
)
```
<!--- KNIT example-llm-parameters-06.kt -->

### 設定與覆寫參數

下方的程式碼範例展示了如何定義一組您可能主要使用的 LLM 參數，然後透過部分覆寫原始集合中的值並新增新值來建立另一組參數。這讓您可以定義大多數請求通用的參數，同時也能添加更具體的參數組合，而無需重複通用參數。

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
// 定義預設參數
val defaultParams = LLMParams(
    temperature = 0.7,
    maxTokens = 150,
    toolChoice = LLMParams.ToolChoice.Auto
)

// 建立帶有部分覆寫的參數，其餘使用預設值
val overrideParams = LLMParams(
    temperature = 0.2,
    numberOfChoices = 3
).default(defaultParams)
```
<!--- KNIT example-llm-parameters-07.kt -->

最終的 `overrideParams` 集合中的值等同於以下內容：

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