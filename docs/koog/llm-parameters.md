# LLM 参数

本页面详细介绍了 Koog 代理框架中的 LLM 参数。LLM 参数允许您控制和自定义语言模型的行为。

## 概览

LLM 参数是允许您微调语言模型生成响应方式的配置选项。这些参数控制响应的随机性、长度、格式和工具使用等方面。通过调整参数，您可以针对不同的用例优化模型行为，从创意内容生成到确定性的结构化输出。

在 Koog 中，`LLMParams` 类整合了 LLM 参数，并为配置语言模型行为提供了一致的接口。您可以通过以下方式使用 LLM 参数：

- 在创建提示词时：

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
        // 添加系统消息以设置上下文
        system("You are a helpful assistant.")

        // 添加用户消息
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

有关提示词创建的更多信息，请参阅[提示词](prompts/prompt-creation/index.md)。

- 在创建子图时：

=== "Kotlin"

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

有关 Koog 中现有子图类型的更多信息，请参阅[预定义子图](nodes-and-components.md#predefined-subgraphs)。要了解如何创建和实现您自己的子图，请参阅[自定义子图](custom-subgraphs.md)。

- 在 LLM 写入会话中更新提示词时：

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

有关会话的更多信息，请参阅 [LLM 会话和手动历史记录管理](sessions.md)。

## LLM 参数参考

下表提供了 `LLMParams` 类中包含的 LLM 参数参考，Koog 提供的所有开箱即用的 LLM 提供商均支持这些参数。
有关某些提供商特定的参数列表，请参阅[提供商特定参数](#provider-specific-parameters)。

| 参数 | 类型 | 描述 |
|------------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`          | Double                         | 控制输出的随机性。较高的值（如 0.7–1.0）会产生更多样化和更具创造性的响应，而较低的值会产生更具确定性和更集中的响应。 |
| `maxTokens`            | Integer                        | 响应中生成的最大 token 数量。用于控制响应长度。 |
| `numberOfChoices`      | Integer                        | 要生成的备选响应数量。必须大于 0。 |
| `speculation`          | String                         | 影响模型行为的推测性配置字符串，旨在提高结果速度和准确性。仅某些模型支持，但可能会极大提高速度和准确性。 |
| `schema`               | Schema                         | 定义模型响应格式的结构，支持 JSON 等结构化输出。有关更多信息，请参阅 [Schema](#schema)。 |
| `toolChoice`           | ToolChoice                     | 控制语言模型的工具调用行为。有关更多信息，请参阅[工具选择](#tool-choice)。 |
| `user`                 | String                         | 发起请求的用户的标识符，可用于跟踪目的。 |
| `additionalProperties` | Map&lt;String, JsonElement&gt; | 可用于存储特定于某些模型提供商的自定义参数的附加属性。 |

有关每个参数默认值的列表，请参阅相应的 LLM 提供商文档：

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- 阿里巴巴 ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))
- [Ollama](https://docs.ollama.com/api/openai-compatibility)

## Schema

`Schema` 接口定义了模型响应格式的结构。
Koog 支持 JSON schema，如下节所述。

### JSON schema

JSON schema 允许您向语言模型请求结构化的 JSON 数据。Koog 支持以下两种类型的 JSON schema：

1) **基础 JSON Schema** (`LLMParams.Schema.JSON.Basic`)：用于基础 JSON 处理能力。此格式主要侧重于嵌套数据定义，不包含高级 JSON Schema 功能。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonArray
    import kotlinx.serialization.json.JsonPrimitive
    -->
    ```kotlin
    // 使用基础 JSON schema 创建参数
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
    // 使用基础 JSON schema 创建参数
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

2) **标准 JSON Schema** (`LLMParams.Schema.JSON.Standard`)：表示符合 [json-schema.org](https://json-schema.org/) 的标准 JSON schema。此格式是官方 JSON Schema 规范的子集。请注意，不同 LLM 提供商的具体实现可能会有所不同，因为并非所有提供商都支持完整的 JSON schema。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import kotlinx.serialization.json.JsonObject
    import kotlinx.serialization.json.JsonPrimitive
    import kotlinx.serialization.json.JsonArray
    -->
    ```kotlin
    // 使用标准 JSON schema 创建参数
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
    // 使用标准 JSON schema 创建参数
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

## 工具选择

`ToolChoice` 类控制语言模型如何使用工具。它提供以下选项：

* `LLMParams.ToolChoice.Named`：语言模型调用指定的工具。接受一个表示要调用的工具名称的 `name` 字符串参数。
* `LLMParams.ToolChoice.All`：语言模型调用所有工具。
* `LLMParams.ToolChoice.None`：语言模型不调用工具，仅生成文本。
* `LLMParams.ToolChoice.Auto`：语言模型自动决定是否调用工具以及调用哪个工具。
* `LLMParams.ToolChoice.Required`：语言模型至少调用一个工具。

以下是使用 `LLMParams.ToolChoice.Named` 类调用特定工具的示例：

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

## 提供商特定参数

Koog 支持某些 LLM 提供商的特定参数。这些参数扩展了基础 `LLMParams` 类并添加了特定于提供商的功能。以下类包含各提供商特定的参数：

- `OpenAIChatParams`：特定于 OpenAI Chat Completions API 的参数。
- `OpenAIResponsesParams`：特定于 OpenAI Responses API 的参数。
- `GoogleParams`：特定于 Google 模型的参数。
- `AnthropicParams`：特定于 Anthropic 模型的参数。
- `MistralAIParams`：特定于 Mistral 模型的参数。
- `DeepSeekParams`：特定于 DeepSeek 模型的参数。
- `OpenRouterParams`：特定于 OpenRouter 模型的参数。
- `DashscopeParams`：特定于阿里巴巴模型的参数。
- `OllamaParams`：特定于 Ollama 模型的参数。

以下是 Koog 中提供商特定参数的完整参考：

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

以下示例展示了使用提供商特定的 `OpenRouterParams` 类定义的 OpenRouter LLM 参数：

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

## 使用示例

### 基础用法

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    // 具有限制长度的基础参数集
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
    // 具有限制长度的基础参数集
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

### 推理控制

您可以通过控制模型推理的提供商特定参数来实现推理控制。
当使用 OpenAI Chat API 以及支持推理的模型时，使用 `reasoningEffort` 参数来控制模型在提供响应之前生成的推理 token 数量：

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

此外，在以无状态模式使用 OpenAI Responses API 时，您会保留推理项的加密历史记录，并在每一轮对话中将其发送给模型。加密是在 OpenAI 端完成的，您需要在请求中将 `include` 参数设置为 `reasoning.encrypted_content` 来请求加密的推理 token。
然后，您可以在接下来的对话轮次中将加密的推理 token 传回给模型。

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

### 自定义参数

要添加可能是特定于提供商且 Koog 开箱即用不支持的自定义参数，请使用 `additionalProperties` 属性，如以下示例所示。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    import ai.koog.prompt.params.additionalPropertiesOf
    -->
    ```kotlin
    // 为特定的模型提供商添加自定义参数
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
    // 为特定的模型提供商添加自定义参数
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

### 设置与覆盖参数

下面的代码示例展示了如何定义一组您可能主要使用的 LLM 参数，然后通过部分覆盖原始集合中的值并向其添加新值来创建另一组参数。
这允许您定义大多数请求通用的参数，同时添加更具体的参数组合，而无需重复通用参数。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    // 定义默认参数
    val defaultParams = LLMParams(
        temperature = 0.7,
        maxTokens = 150,
        toolChoice = LLMParams.ToolChoice.Auto
    )

    // 创建带有一些覆盖值的参数，其余使用默认值
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
    // 定义默认参数
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

    // 创建带有一些覆盖值的参数，其余使用默认值
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

生成的 `overrideParams` 集合中的值等同于以下内容：

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