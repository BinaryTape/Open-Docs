# LLM 参数

本页面提供 Koog 代理框架中 LLM 参数的详细信息。LLM 参数允许您控制和自定义语言模型的行为。

## 概述

LLM 参数是配置选项，允许您微调语言模型生成响应的方式。这些参数控制响应的随机性、长度、格式和工具使用等方面。通过调整参数，您可以优化模型行为，以适应不同的用例，从创意内容生成到确定性结构化输出。

在 Koog 中，`LLMParams` 类整合了 LLM 参数，并提供了一致的接口来配置语言模型行为。您可以通过以下方式使用 LLM 参数：

- 创建 prompt 时：

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
        // Add a system message to set the context
        system("You are a helpful assistant.")

        // Add a user message
        user("Tell me about Kotlin")
    }
    ```
    <!--- KNIT example-llm-parameters-01.kt -->

    关于 prompt 创建的更多信息，请参见 [Prompt API](prompt-api.md)。

- 创建 subgraph 时：

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

    关于如何创建和实现您自己的 subgraph 的更多信息，请参见 [Custom subgraphs](custom-subgraphs.md)。

- 在 LLM 写入会话中更新 prompt 时：

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

    关于会话的更多信息，请参见 [LLM sessions and manual history management](sessions.md)。

## LLM 参数参考

下表提供了 `LLMParams` 类中包含的 LLM 参数的参考，这些参数受 Koog 默认支持的所有 LLM 提供商支持。
关于某些提供商特有的参数列表，请参见 [Provider-specific parameters](#provider-specific-parameters)。

| 参数                    | 类型                           | 描述                                                                                                                                                                             |
|-------------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`           | Double                         | 控制输出的随机性。较高的值（例如 0.7-1.0）会生成更多样化和创造性的响应，而较低的值会生成更具确定性和更集中的响应。                                                    |
| `maxTokens`             | Integer                        | 响应中要生成的最大 token 数量。用于控制响应长度。                                                                                                                                |
| `numberOfChoices`       | Integer                        | 要生成的备选响应数量。必须大于 0。                                                                                                                                               |
| `speculation`           | String                         | 一个推测性配置字符串，影响模型行为，旨在提高结果速度和准确性。仅某些模型支持，但可以极大地提高速度和准确性。                                                           |
| `schema`                | Schema                         | 定义模型响应格式的结构，支持 JSON 等结构化输出。更多信息，请参见 [Schema](#schema)。                                                                                               |
| `toolChoice`            | ToolChoice                     | 控制语言模型的工具调用行为。更多信息，请参见 [Tool choice](#tool-choice)。                                                                                                       |
| `user`                  | String                         | 发出请求的用户的标识符，可用于跟踪。                                                                                                                                             |
| `additionalProperties`  | Map&lt;String, JsonElement&gt; | 可用于存储特定模型提供商的自定义参数的附加属性。                                                                                                                                 |

关于每个参数的默认值列表，请参见相应的 LLM 提供商文档：

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api-reference/parameters)

## Schema

`Schema` 接口定义了模型响应格式的结构。Koog 支持 JSON schema，如下文各节所述。

### JSON schema

JSON schema 允许您从语言模型请求结构化的 JSON 数据。Koog 支持以下两种 JSON schema 类型：

1. **基础 JSON Schema** (`LLMParams.Schema.JSON.Basic`)：用于基本的 JSON 处理功能。这种格式主要关注嵌套数据定义，而不涉及高级 JSON Schema 功能。

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

2. **标准 JSON Schema** (`LLMParams.Schema.JSON.Standard`)：表示符合 [json-schema.org](https://json-schema.org/) 的标准 JSON schema。这种格式是官方 JSON Schema 规范的真子集。请注意，不同 LLM 提供商之间的实现可能有所不同，因为并非所有提供商都支持完整的 JSON schema。

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

## 工具选择

`ToolChoice` 类控制语言模型如何使用工具。它提供以下选项：

* `LLMParams.ToolChoice.Named`: 语言模型调用指定的工具。接受表示要调用的工具名称的 `name` 字符串实参。
* `LLMParams.ToolChoice.All`: 语言模型调用所有工具。
* `LLMParams.ToolChoice.None`: 语言模型不调用工具，只生成文本。
* `LLMParams.ToolChoice.Auto`: 语言模型自动决定是否调用工具以及调用哪个工具。
* `LLMParams.ToolChoice.Required`: 语言模型至少调用一个工具。

以下是使用 `LLMParams.ToolChoice.Named` 类调用特定工具的示例：

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-01.kt -->

## 提供商特有的参数

Koog 支持某些 LLM 提供商特有的参数。这些参数扩展了基础 `LLMParams` 类，并增加了提供商特有的功能。以下类包含每个提供商特有的参数：

- `DeepSeekParams`：DeepSeek 模型特有的参数。
- `OpenRouterParams`：OpenRouter 模型特有的参数。
- `OpenAIChatParams`：OpenAI Chat Completions API 特有的参数。
- `OpenAIResponsesParams`：OpenAI Responses API 特有的参数。

以下是 Koog 中提供商特有参数的完整参考：

| 参数                | 提供商                                          | 类型                   | 描述                                                                                                                                                                                                                                                                                                                                                                                                                       |
|---------------------|-------------------------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topP`              | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Double                 | 也称为核采样。通过向子集添加具有最高概率值的 token 来创建下一个 token 的子集，直到它们的概率总和达到指定的 `topP` 值。取值大于 0.0 且小于或等于 1.0。                                                                                                                                                   |
| `logprobs`          | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Boolean                | 如果为 `true`，则包含输出 token 的对数概率。                                                                                                                                                                                                                                                                                                                                                                           |
| `topLogprobs`       | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Integer                | 每个位置上最可能的 top token 数量。取值范围为 0-20。要求 `logprobs` 参数设置为 `true`。                                                                                                                                                                                                                                                                                                                         |
| `frequencyPenalty`  | OpenAI Chat, DeepSeek, OpenRouter               | Double                 | 惩罚频繁出现的 token 以减少重复。较高的 `frequencyPenalty` 值会产生更多的措辞变化并减少重复。取值范围为 -2.0 到 2.0。                                                                                                                                                                                                                                        |
| `presencePenalty`   | OpenAI Chat, DeepSeek, OpenRouter               | Double                 | 防止模型重复使用已包含在输出中的 token。较高的值鼓励引入新的 token 和主题。取值范围为 -2.0 到 2.0。                                                                                                                                                                                                                                |
| `stop`              | OpenAI Chat, DeepSeek, OpenRouter               | List&lt;String&gt;     | 字符串列表，当模型遇到其中任何一个时，表示它应该停止生成内容。例如，要让模型在生成两个换行符时停止生成内容，请将停止序列指定为 `stop = listOf("/n/n")`。                                                                                                                                                                                |
| `parallelToolCalls` | OpenAI Chat, OpenAI Responses                   | Boolean                | 如果为 `true`，则可以并行运行多个工具调用。                                                                                                                                                                                                                                                                                                                                                                                |
| `promptCacheKey`    | OpenAI Chat, OpenAI Responses                   | String                 | 用于 prompt 缓存的稳定缓存键。OpenAI 使用它来缓存类似请求的响应。                                                                                                                                                                                                                                                                                                                                                                      |
| `safetyIdentifier`  | OpenAI Chat, OpenAI Responses                   | String                 | 稳定且唯一的身份识别符，可用于检测违反 OpenAI 政策的用户。                                                                                                                                                                                                                                                                                                                                  |
| `serviceTier`       | OpenAI Chat, OpenAI Responses                   | ServiceTier            | OpenAI 处理层级选择，让您可以优先考虑性能或成本。更多信息，请参见 [ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html) 的 API 文档。                                                                               |
| `store`             | OpenAI Chat, OpenAI Responses                   | Boolean                | 如果为 `true`，提供商可能会存储输出以供以后检索。                                                                                                                                                                                                                                                                                                                                                                     |
| `audio`             | OpenAI Chat                                     | OpenAIAudioConfig      | 使用支持音频的模型时的音频输出配置。更多信息，请参见 [OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html) 的 API 文档。                                                                                                   |
| `reasoningEffort`   | OpenAI Chat                                     | ReasoningEffort        | 指定模型将使用的推理工作级别。更多信息和可用值，请参见 [ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html) 的 API 文档。                                                                                |
| `webSearchOptions`  | OpenAI Chat                                     | OpenAIWebSearchOptions | 配置网络搜索工具的使用（如果支持）。更多信息，请参见 [OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html) 的 API 文档。                                                                                                    |
| `background`        | OpenAI Responses                                | Boolean                | 在后台运行响应。                                                                                                                                                                                                                                                                                                                                                                                                |
| `include`           | OpenAI Responses                                | List&lt;String&gt;     | 要包含的附加输出部分。更多信息，请参阅 OpenAI 文档中关于 [include](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include) 参数的说明。                                                                                                                                                                               |
| `maxToolCalls`      | OpenAI Responses                                | Int                    | 此响应中允许的最大内置工具调用总数。取值等于或大于 `0`。                                                                                                                                                                                                                                                                                                                                                 |
| `reasoning`         | OpenAI Responses                                | ReasoningConfig        | 支持推理的模型推理配置。更多信息，请参见 [ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html) 的 API 文档。                                                                                                                         |
| `truncation`        | OpenAI Responses                                | Truncation             | 接近上下文窗口时的截断策略。更多信息，请参见 [Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html) 的 API 文档。                                                                                                                                      |
| `topK`              | OpenRouter                                      | Int                    | 生成输出时要考虑的 top token 数量。取值等于或大于 1。                                                                                                                                                                                                                                                                                                                                                            |
| `repetitionPenalty` | OpenRouter                                      | Double                 | 惩罚 token 重复。对于已出现在输出中的 token，其下一个 token 概率将除以 `repetitionPenalty` 的值，这使得它们在 `repetitionPenalty > 1` 时再次出现的可能性降低。取值大于 0.0 且小于或等于 2.0。                                                                                                                                       |
| `minP`              | OpenRouter                                      | Double                 | 过滤掉其相对于最可能 token 的相对概率低于定义 `minP` 值的 token。取值范围为 0.0-0.1。                                                                                                                                                                                                                                                                                                                  |
| `topA`              | OpenRouter                                      | Double                 | 根据模型置信度动态调整采样窗口。如果模型置信度高（存在占主导地位的高概率下一个 token），则将采样窗口限制为少数 top token。如果置信度低（存在许多概率相似的 token），则在采样窗口中保留更多 token。取值范围为 0.0-0.1（包含）。值越高意味着更大的动态适应性。 |
| `transforms`        | OpenRouter                                      | List&lt;String&gt;     | 上下文转换列表。定义当上下文超出模型的 token 限制时如何进行转换。默认转换是 `middle-out`，它从 prompt 的中间截断。使用空列表表示不进行转换。更多信息，请参见 OpenRouter 文档中的 [Message Transforms](https://openrouter.ai/docs/features/message-transforms)。                                                       |
| `models`            | OpenRouter                                      | List&lt;String&gt;     | 请求允许的模型列表。                                                                                                                                                                                                                                                                                                                                                                                            |
| `route`             | OpenRouter                                      | String                 | 请求路由标识符。                                                                                                                                                                                                                                                                                                                                                                                                        |
| `provider`          | OpenRouter                                      | ProviderPreferences    | 模型提供商偏好。更多信息，请参见 [ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html) 的 API 文档。                                                                                                                                     |

以下示例展示了使用提供商特有的 `OpenRouterParams` 类定义的 OpenRouter LLM 参数：

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

## 用法示例

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
<!--- KNIT example-llm-parameters-03.kt -->

### 推理控制

您通过控制模型推理的提供商特有参数来实现推理控制。
当使用 OpenAI Chat API 和支持推理的模型时，可以使用 `reasoningEffort` 参数来控制模型在提供响应之前生成多少推理 token：

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

此外，在无状态模式下使用 OpenAI Responses API 时，您会保留推理项的加密历史记录，并在每次对话轮次中将其发送给模型。加密是在 OpenAI 侧完成的，您需要通过将请求中的 `include` 参数设置为 `reasoning.encrypted_content` 来请求加密的推理 token。然后，您可以在后续对话轮次中将加密的推理 token 传回给模型。

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

### 自定义参数

要添加可能为提供商特有且 Koog 默认不支持的自定义参数，请使用 `additionalProperties` 属性，如下例所示。

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

### 设置和覆盖参数

下面的代码示例展示了如何定义一组您可能主要使用的 LLM 参数，然后通过部分覆盖原始集合中的值并向其添加新值来创建另一组参数。这允许您定义大多数请求通用的参数，同时添加更具体的参数组合，而无需重复通用参数。

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

生成的 `overrideParams` 集合中的值等同于：

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