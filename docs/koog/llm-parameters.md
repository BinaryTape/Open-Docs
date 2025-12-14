# LLM 参数

本页面提供了 Koog 代理框架中 LLM 参数的详细信息。LLM 参数允许您控制和自定义语言模型的行为。

## 概述

LLM 参数是配置选项，允许您微调语言模型生成响应的方式。这些参数控制响应的随机性、长度、格式和工具使用等方面。通过调整参数，您可以优化模型行为，以适应不同的用例，从创意内容生成到确定性结构化输出。

在 Koog 中，`LLMParams` 类整合了 LLM 参数，并提供了一致的接口来配置语言模型行为。您可以通过以下方式使用 LLM 参数：

- 创建 prompt 时：

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

关于 prompt 创建的更多信息，请参见 [提示](prompt-api.md)。

- 创建 subgraph 时：

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

关于 Koog 中现有 subgraph 类型的更多信息，请参见 [预定义 subgraph](nodes-and-components.md#predefined-subgraphs)。关于如何创建和实现您自己的 subgraph，请参见 [自定义 subgraph](custom-subgraphs.md)。

- 在 LLM 写入会话中更新 prompt 时：

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

关于会话的更多信息，请参见 [LLM 会话和手动历史记录管理](sessions.md)。

## LLM 参数参考

下表提供了 `LLMParams` 类中包含的 LLM 参数的参考，这些参数受 Koog 默认支持的所有 LLM 提供商支持。
关于某些提供商特有的参数列表，请参见 [提供商特有的参数](#provider-specific-parameters)。

| 参数                    | 类型                           | 描述                                                                                                                                                                             |
|-------------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`           | Double                         | 控制输出的随机性。较高的值（例如 0.7–1.0）会生成更多样化和创造性的响应，而较低的值会生成更具确定性和更集中的响应。                                                    |
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
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- Alibaba ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))

## Schema

`Schema` 接口定义了模型响应格式的结构。
Koog 支持 JSON schema，如下文各节所述。

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

*   `LLMParams.ToolChoice.Named`: 语言模型调用指定的工具。接受表示要调用的工具名称的 `name` 字符串实参。
*   `LLMParams.ToolChoice.All`: 语言模型调用所有工具。
*   `LLMParams.ToolChoice.None`: 语言模型不调用工具，只生成文本。
*   `LLMParams.ToolChoice.Auto`: 语言模型自动决定是否调用工具以及调用哪个工具。
*   `LLMParams.ToolChoice.Required`: 语言模型至少调用一个工具。

以下是使用 `LLMParams.ToolChoice.Named` 类调用特定工具的示例：

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-06.kt -->

## 提供商特有的参数

Koog 支持某些 LLM 提供商特有的参数。这些参数扩展了基础 `LLMParams` 类，并增加了提供商特有的功能。以下类包含每个提供商特有的参数：

- `OpenAIChatParams`: OpenAI Chat Completions API 特有的参数。
- `OpenAIResponsesParams`: OpenAI Responses API 特有的参数。
- `GoogleParams`: Google 模型特有的参数。
- `AnthropicParams`: Anthropic 模型特有的参数。
- `MistralAIParams`: Mistral 模型特有的参数。
- `DeepSeekParams`: DeepSeek 模型特有的参数。
- `OpenRouterParams`: OpenRouter 模型特有的参数。
- `DashscopeParams`: Alibaba 模型特有的参数。

以下是 Koog 中提供商特有参数的完整参考：

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
<!--- KNIT example-llm-parameters-07.kt -->

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
<!--- KNIT example-llm-parameters-08.kt -->

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
<!--- KNIT example-llm-parameters-09.kt -->

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
<!--- KNIT example-llm-parameters-10.kt -->

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
<!--- KNIT example-llm-parameters-11.kt -->

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
<!--- KNIT example-llm-parameters-12.kt -->

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
<!--- KNIT example-llm-parameters-13.kt -->