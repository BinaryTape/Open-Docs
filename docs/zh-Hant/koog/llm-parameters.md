# LLM 參數

本頁提供關於 Koog 代理式框架中 LLM 參數的詳細資訊。LLM 參數讓您能夠控制和自訂語言模型的行為。

## 總覽

LLM 參數是配置選項，讓您可以微調語言模型生成回應的方式。這些參數控制回應的隨機性、長度、格式和工具使用等方面。透過調整參數，您可以為不同的使用案例優化模型行為，從創意內容生成到確定性結構化輸出。

在 Koog 中，`LLMParams` 類別整合了 LLM 參數，並提供了一個一致的介面來配置語言模型的行為。您可以透過以下方式使用 LLM 參數：

- 建立提示時：

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

有關提示建立的更多資訊，請參閱 [Prompts](prompt-api.md)。

- 建立子圖時：

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

有關 Koog 中現有子圖類型的更多資訊，請參閱 [Predefined subgraphs](nodes-and-components.md#predefined-subgraphs)。要了解如何建立和實作您自己的子圖，請參閱 [Custom subgraphs](custom-subgraphs.md)。

- 在 LLM 寫入工作階段中更新提示時：

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
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- Alibaba ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))

## 綱要

`Schema` 介面定義了模型回應格式的結構。Koog 支援 JSON 綱要，如下方章節所述。

### JSON 綱要

JSON 綱要讓您可以從語言模型請求結構化的 JSON 資料。Koog 支援以下兩種 JSON 綱要：

1) **基本 JSON 綱要** (`LLMParams.Schema.JSON.Basic`)：用於基本的 JSON 處理功能。這種格式主要側重於巢狀資料定義，而不包含進階的 JSON Schema 功能。

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

2) **標準 JSON 綱要** (`LLMParams.Schema.JSON.Standard`)：代表符合 [json-schema.org](https://json-schema.org/) 的標準 JSON 綱要。這種格式是官方 JSON Schema 規範的適當子集。請注意，不同 LLM 供應商的風格可能有所不同，因為並非所有供應商都支援完整的 JSON 綱要。

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
<!--- KNIT example-llm-parameters-06.kt -->

## 特定供應商參數

Koog 支援某些 LLM 供應商的特定供應商參數。這些參數擴展了基礎 `LLMParams` 類別，並增加了特定供應商的功能。以下類別包含每個供應商特有的參數：

-   `OpenAIChatParams`：OpenAI Chat Completions API 特有的參數。
-   `OpenAIResponsesParams`：OpenAI Responses API 特有的參數。
-   `GoogleParams`：Google 模型特有的參數。
-   `AnthropicParams`：Anthropic 模型特有的參數。
-   `MistralAIParams`：Mistral 模型特有的參數。
-   `DeepSeekParams`：DeepSeek 模型特有的參數。
-   `OpenRouterParams`：OpenRouter 模型特有的參數。
-   `DashscopeParams`：Alibaba 模型特有的參數。

以下是 Koog 中特定供應商參數的完整參考：

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
<!--- KNIT example-llm-parameters-07.kt -->

## 使用範例

### 基本用法

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
<!--- KNIT example-llm-parameters-09.kt -->

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
<!--- KNIT example-llm-parameters-10.kt -->

### 自訂參數

若要新增可能為特定供應商且 Koog 不支援的自訂參數，請使用以下範例所示的 `additionalProperties` 屬性。

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

### 設定與覆寫參數

下方的程式碼範例展示了如何定義一組您可能主要使用的 LLM 參數，然後透過部分覆寫原始集合中的值並新增新值來建立另一組參數。這讓您可以定義大多數請求通用的參數，同時也能添加更具體的參數組合，而無需重複通用參數。

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
<!--- KNIT example-llm-parameters-13.kt -->