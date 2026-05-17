# LLM 參數

本頁面提供有關 Koog 代理框架中 LLM 參數的詳細資訊。LLM 參數讓您可以控制並自訂語言模型的行為。

## 總覽

LLM 參數是用於微調語言模型產生回應方式的配置選項。這些參數控制回應的隨機性、長度、格式和工具使用等面向。透過調整參數，您可以針對不同的使用案例優化模型行為，從創意內容生成到確定性的結構化輸出。

在 Koog 中，`LLMParams` 類別整合了 LLM 參數，並為配置語言模型行為提供了統一的介面。您可以透過以下方式使用 LLM 參數：

- 建立提示詞時：

=== "Kotlin"

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
        // 新增系統訊息以設定上下文
        system("You are a helpful assistant.")

        // 新增使用者訊息
        user("Tell me about Kotlin")
    }
    ```
    <!--- KNIT example-llm-parameters-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("dev-assistant")
        .withParams(new LLMParams(
            0.7,         // temperature
            500,         // maxTokens
            1,           // numberOfChoices
            null,        // speculation
            null,        // schema
            LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
            null,        // user
            null         // additionalProperties
        ))
        .system("You are a helpful assistant.")
        .user("Tell me about Kotlin")
        .build();
    ```
    <!--- KNIT example-llm-parameters-java-01.java -->

如需更多關於提示詞建立的資訊，請參閱 [提示詞](prompts/prompt-creation/index.md)。

- 建立子圖時：

=== "Kotlin"

    <!--- INCLUDE
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
        parallelTools = false,
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-llm-parameters-java-02.java -->

如需更多關於 Koog 中現有子圖型別的資訊，請參閱 [預定義子圖](nodes-and-components.md#predefined-subgraphs)。若要了解如何建立並實作您自己的子圖，請參閱 [自訂子圖](custom-subgraphs.md)。

- 在 LLM 寫入工作階段中更新提示詞時：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-llm-parameters-java-03.java -->

如需更多關於工作階段的資訊，請參閱 [LLM 工作階段與手動歷程記錄管理](sessions.md)。

## LLM 參數參考

下表提供了 `LLMParams` 類別中包含的 LLM 參數參考，這些參數受 Koog 開箱即用的所有 LLM 提供者支援。
如需特定提供者專用參數的清單，請參閱 [提供者專用參數](#provider-specific-parameters)。

| 參數 | 型別 | 說明 |
|------------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`          | Double                         | 控制輸出中的隨機性。較高的值（如 0.7–1.0）會產生更多樣化且具創意的回應，而較低的值則會產生更具確定性且專注的回應。 |
| `maxTokens`            | Integer                        | 回應中產生的最大 token 數量。用於控制回應長度。 |
| `numberOfChoices`      | Integer                        | 要產生的替代回應數量。必須大於 0。 |
| `speculation`          | String                         | 一個影響模型行為的投機配置字串，旨在提高結果的速度與準確性。僅部分模型支援，但可能大幅提升速度與準確性。 |
| `schema`               | Schema                         | 定義模型回應格式的結構，啟用如 JSON 的結構化輸出。如需更多資訊，請參閱 [架構](#schema)。 |
| `toolChoice`           | ToolChoice                     | 控制語言模型的工具呼叫行為。如需更多資訊，請參閱 [工具選擇](#tool-choice)。 |
| `user`                 | String                         | 發出請求的使用者識別碼，可用於追蹤用途。 |
| `additionalProperties` | Map&lt;String, JsonElement&gt; | 可用於儲存特定模型提供者之自訂參數的額外屬性。 |

如需各個參數預設值的清單，請參閱相應的 LLM 提供者文件：

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- 阿里巴巴 ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))
- [Ollama](https://docs.ollama.com/api/openai-compatibility)

## 架構 (Schema)

`Schema` 介面定義了模型回應格式的結構。
Koog 支援 JSON 架構，如下面各節所述。

### JSON 架構

JSON 架構讓您可以向語言模型要求結構化的 JSON 資料。Koog 支援以下兩種類型的 JSON 架構：

1) **基礎 JSON 架構** (`LLMParams.Schema.JSON.Basic`)：用於基礎的 JSON 處理能力。此格式主要關注巢狀資料定義，不包含進階的 JSON 架構功能。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonArray
    import kotlinx.serialization.json.JsonPrimitive
    -->
    ```kotlin
    // 使用基礎 JSON 架構建立參數
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 使用基礎 JSON 架構建立參數
    LLMParams jsonParams = new LLMParams(
        0.2,         // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        new LLMParams.Schema.JSON.Basic(
            "PersonInfo",
            new JsonObject(Map.of(
                "type", new JsonPrimitive("object"),
                "properties", new JsonObject(Map.of(
                    "name", new JsonObject(Map.of("type", new JsonPrimitive("string"))),
                    "age", new JsonObject(Map.of("type", new JsonPrimitive("number"))),
                    "skills", new JsonObject(Map.of(
                        "type", new JsonPrimitive("array"),
                        "items", new JsonObject(Map.of("type", new JsonPrimitive("string")))
                    ))
                )),
                "additionalProperties", new JsonPrimitive(false),
                "required", new JsonArray(List.of(
                    new JsonPrimitive("name"),
                    new JsonPrimitive("age"),
                    new JsonPrimitive("skills")
                ))
            ))
        ),
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,        // user
        null         // additionalProperties
    );
    ```
    <!--- KNIT example-llm-parameters-java-04.java -->

2) **標準 JSON 架構** (`LLMParams.Schema.JSON.Standard`)：表示符合 [json-schema.org](https://json-schema.org/) 的標準 JSON 架構。此格式是官方 JSON 架構規範的正當子集。請注意，不同 LLM 提供者的特性可能有所不同，因為並非所有提供者都支援完整的 JSON 架構。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonPrimitive
    import kotlinx.serialization.json.JsonArray
    -->
    ```kotlin
    // 使用標準 JSON 架構建立參數
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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 使用標準 JSON 架構建立參數
    LLMParams standardJsonParams = new LLMParams(
        0.2,         // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        new LLMParams.Schema.JSON.Standard(
            "ProductCatalog",
            new JsonObject(Map.of(
                "type", new JsonPrimitive("object"),
                "properties", new JsonObject(Map.of(
                    "products", new JsonObject(Map.of(
                        "type", new JsonPrimitive("array"),
                        "items", new JsonObject(Map.of(
                            "type", new JsonPrimitive("object"),
                            "properties", new JsonObject(Map.of(
                                "id", new JsonObject(Map.of("type", new JsonPrimitive("string"))),
                                "name", new JsonObject(Map.of("type", new JsonPrimitive("string"))),
                                "price", new JsonObject(Map.of("type", new JsonPrimitive("number"))),
                                "description", new JsonObject(Map.of("type", new JsonPrimitive("string")))
                            )),
                            "additionalProperties", new JsonPrimitive(false),
                            "required", new JsonArray(List.of(
                                new JsonPrimitive("id"),
                                new JsonPrimitive("name"),
                                new JsonPrimitive("price"),
                                new JsonPrimitive("description")
                            ))
                        ))
                    ))
                )),
                "additionalProperties", new JsonPrimitive(false),
                "required", new JsonArray(List.of(new JsonPrimitive("products")))
            ))
        ),
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,        // user
        null         // additionalProperties
    );
    ```
    <!--- KNIT example-llm-parameters-java-05.java -->

## 工具選擇 (Tool choice)

`ToolChoice` 類別控制語言模型如何使用工具。它提供以下選項：

* `LLMParams.ToolChoice.Named`：語言模型呼叫指定的工具。接受代表要呼叫工具名稱的 `name` 字串引數。
* `LLMParams.ToolChoice.All`：語言模型呼叫所有工具。
* `LLMParams.ToolChoice.None`：語言模型不呼叫工具，僅產生文字。
* `LLMParams.ToolChoice.Auto`：語言模型自動決定是否呼叫工具以及呼叫哪個工具。
* `LLMParams.ToolChoice.Required`：語言模型至少呼叫一個工具。

以下是使用 `LLMParams.ToolChoice.Named` 類別呼叫特定工具的範例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    val specificToolParams = LLMParams(
        toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
    )
    ```
    <!--- KNIT example-llm-parameters-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMParams specificToolParams = new LLMParams(
        null,        // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        new LLMParams.ToolChoice.Named("calculator"), // toolChoice
        null,        // user
        null         // additionalProperties
    );
    ```
    <!--- KNIT example-llm-parameters-java-06.java -->

## 提供者專用參數

Koog 支援部分 LLM 提供者的專用參數。這些參數擴充了基礎的 `LLMParams` 類別並加入特定提供者的功能。以下類別包含各個提供者的專用參數：

- `OpenAIChatParams`：OpenAI Chat Completions API 的專用參數。
- `OpenAIResponsesParams`：OpenAI Responses API 的專用參數。
- `GoogleParams`：Google 模型的專用參數。
- `AnthropicParams`：Anthropic 模型的專用參數。
- `MistralAIParams`：Mistral 模型的專用參數。
- `DeepSeekParams`：DeepSeek 模型的專用參數。
- `OpenRouterParams`：OpenRouter 模型的專用參數。
- `DashscopeParams`：阿里巴巴模型的專用參數。
- `OllamaParams`：Ollama 模型的專用參數。

以下是 Koog 中提供者專用參數的完整參考：

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

=== "Ollama"

    --8<--
    llm-parameters-snippets.md:heading
    llm-parameters-snippets.md:think
    --8<--

以下範例顯示使用提供者專用的 `OpenRouterParams` 類別定義 OpenRouter LLM 參數：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    OpenRouterParams openRouterParams = new OpenRouterParams(
        0.7,         // temperature
        500,         // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        null,        // toolChoice
        null,        // user
        null,        // additionalProperties
        0.5,         // frequencyPenalty
        null,        // logprobs
        null,        // minP
        Arrays.asList("anthropic/claude-3-opus", "anthropic/claude-3-sonnet"), // models
        0.5,         // presencePenalty
        null,        // provider
        1.1,         // repetitionPenalty
        null,        // route
        null,        // stop
        null,        // topA
        40,          // topK
        null,        // topLogprobs
        0.9,         // topP
        Arrays.asList("middle-out") // transforms
    );
    ```
    <!--- KNIT example-llm-parameters-java-07.java -->

## 使用範例

### 基礎用法

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    // 一組具有限制長度的基礎參數
    val basicParams = LLMParams(
        temperature = 0.7,
        maxTokens = 150,
        toolChoice = LLMParams.ToolChoice.Auto
    )
    ```
    <!--- KNIT example-llm-parameters-08.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 一組具有限制長度的基礎參數
    LLMParams basicParams = new LLMParams(
        0.7,         // temperature
        150,         // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,        // user
        null         // additionalProperties
    );
    ```
    <!--- KNIT example-llm-parameters-java-08.java -->

### 推理控制 (Reasoning control)

您可以透過控制模型推理的提供者專用參數來實作推理控制。
當使用 OpenAI Chat API 且模型支援推理時，請使用 `reasoningEffort` 參數來控制模型在提供回應前產生多少推理 token：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    OpenAIChatParams openAIReasoningEffortParams = new OpenAIChatParams(
        null,        // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        null,        // toolChoice
        null,        // user
        null,        // additionalProperties
        null,        // audio
        null,        // frequencyPenalty
        null,        // logprobs
        null,        // parallelToolCalls
        null,        // presencePenalty
        null,        // promptCacheKey
        ReasoningEffort.MEDIUM, // reasoningEffort
        null,        // safetyIdentifier
        null,        // serviceTier
        null,        // stop
        null,        // store
        null,        // topLogprobs
        null,        // topP
        null         // webSearchOptions
    );
    ```
    <!--- KNIT example-llm-parameters-java-09.java -->

此外，當在無狀態模式下使用 OpenAI Responses API 時，您會保留推理項目的加密歷程記錄，並在每次對話輪次中將其傳送給模型。加密是在 OpenAI 端完成的，您需要透過在請求中將 `include` 參數設定為 `reasoning.encrypted_content` 來要求加密的推理 token。
接著，您可以在後續的對話輪次中將加密的推理 token 傳回給模型。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    OpenAIResponsesParams openAIStatelessReasoningParams = new OpenAIResponsesParams(
        null,        // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        null,        // toolChoice
        null,        // user
        null,        // additionalProperties
        null,        // background
        Arrays.asList(OpenAIInclude.REASONING_ENCRYPTED_CONTENT), // include
        null,        // logprobs
        null,        // maxToolCalls
        null,        // parallelToolCalls
        null,        // promptCacheKey
        null,        // reasoning
        null,        // safetyIdentifier
        null,        // serviceTier
        null,        // store
        null,        // topLogprobs
        null,        // topP
        null         // truncation
    );
    ```
    <!--- KNIT example-llm-parameters-java-10.java -->

### 自訂參數

若要新增特定提供者專用且 Koog 未原生支援的自訂參數，請使用 `additionalProperties` 屬性，如下例所示。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import ai.koog.prompt.params.additionalPropertiesOf
    -->
    ```kotlin
    // 為特定的模型提供者新增自訂參數
    val customParams = LLMParams(
        additionalProperties = additionalPropertiesOf(
            "top_p" to 0.95,
            "frequency_penalty" to 0.5,
            "presence_penalty" to 0.5
        )
    )
    ```
    <!--- KNIT example-llm-parameters-11.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 為特定的模型提供者新增自訂參數
    LLMParams customParams = new LLMParams(
        null,        // temperature
        null,        // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        null,        // toolChoice
        null,        // user
        AdditionalPropertiesKt.additionalPropertiesOf(
            "top_p", 0.95,
            "frequency_penalty", 0.5,
            "presence_penalty", 0.5
        )
    );
    ```
    <!--- KNIT example-llm-parameters-java-11.java -->

### 設定與覆寫參數

下方的程式碼範例顯示如何定義一組您可能主要使用的 LLM 參數，然後透過部分覆寫原始組合中的值並新增新值來建立另一組參數。
這讓您可以定義大多數請求通用的參數，同時加入更具體的參數組合，而無需重複通用參數。

=== "Kotlin"

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

    // 建立具有部分覆寫的參數，其餘部分使用預設值
    val overrideParams = LLMParams(
        temperature = 0.2,
        numberOfChoices = 3
    ).default(defaultParams)
    ```
    <!--- KNIT example-llm-parameters-12.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 定義預設參數
    LLMParams defaultParams = new LLMParams(
        0.7,         // temperature
        150,         // maxTokens
        1,           // numberOfChoices
        null,        // speculation
        null,        // schema
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,        // user
        null         // additionalProperties
    );

    // 建立具有部分覆寫的參數，其餘部分使用預設值
    LLMParams overrideParams = new LLMParams(
        0.2,         // temperature
        null,        // maxTokens
        3,           // numberOfChoices
        null,        // speculation
        null,        // schema
        null,        // toolChoice
        null,        // user
        null         // additionalProperties
    ).applyDefaults(defaultParams);
    ```
    <!--- KNIT example-llm-parameters-java-12.java -->

產生的 `overrideParams` 組合中的值等同於以下內容：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    LLMParams overrideParams = new LLMParams(
        0.2,         // temperature
        150,         // maxTokens
        3,           // numberOfChoices
        null,        // speculation
        null,        // schema
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,        // user
        null         // additionalProperties
    );
    ```
    <!--- KNIT example-llm-parameters-java-13.java -->