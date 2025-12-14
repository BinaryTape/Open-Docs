# LLM 매개변수

이 페이지에서는 Koog 에이전트 프레임워크의 LLM 매개변수에 대한 세부 정보를 제공합니다. LLM 매개변수를 사용하면 언어 모델의 동작을 제어하고 사용자 지정할 수 있습니다.

## 개요

LLM 매개변수는 언어 모델이 응답을 생성하는 방식을 미세 조정할 수 있는 구성 옵션입니다. 이러한 매개변수는 응답의 무작위성, 길이, 형식 및 도구 사용과 같은 측면을 제어합니다. 매개변수를 조정하여 창의적인 콘텐츠 생성부터 결정론적 구조화된 출력까지 다양한 사용 사례에 대한 모델 동작을 최적화할 수 있습니다.

Koog에서 `LLMParams` 클래스는 LLM 매개변수를 통합하고 언어 모델 동작을 구성하기 위한 일관된 인터페이스를 제공합니다. LLM 매개변수는 다음과 같은 방법으로 사용할 수 있습니다.

- 프롬프트 생성 시:

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

프롬프트 생성에 대한 자세한 내용은 [프롬프트](prompt-api.md)를 참조하세요.

- 서브그래프 생성 시:

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

Koog의 기존 서브그래프 유형에 대한 자세한 내용은 [사전 정의된 서브그래프](nodes-and-components.md#predefined-subgraphs)를 참조하세요. 자신만의 서브그래프를 생성하고 구현하는 방법에 대한 자세한 내용은 [사용자 지정 서브그래프](custom-subgraphs.md)를 참조하세요.

- LLM 쓰기 세션에서 프롬프트 업데이트 시:

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

세션에 대한 자세한 내용은 [LLM 세션 및 수동 기록 관리](sessions.md)를 참조하세요.

## LLM 매개변수 참조

다음 표는 `LLMParams` 클래스에 포함되고 Koog에서 바로 사용할 수 있는 모든 LLM 공급자가 지원하는 LLM 매개변수 참조를 제공합니다.
일부 공급자별 매개변수 목록은 [공급자별 매개변수](#provider-specific-parameters)를 참조하세요.

| 매개변수              | 유형                           | 설명                                                                                                                                                                                     |
|------------------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `temperature`          | Double                         | 출력의 무작위성을 제어합니다. 0.7–1.0과 같은 높은 값은 더 다양하고 창의적인 응답을 생성하는 반면, 낮은 값은 더 결정론적이고 집중된 응답을 생성합니다.            |
| `maxTokens`            | Integer                        | 응답에서 생성할 최대 토큰 수. 응답 길이를 제어하는 데 유용합니다.                                                                                                                                  |
| `numberOfChoices`      | Integer                        | 생성할 대체 응답 수. 0보다 커야 합니다.                                                                                                                                                           |
| `speculation`          | String                         | 모델 동작에 영향을 미치는 추측성 구성 문자열로, 결과 속도와 정확성을 향상시키기 위해 설계되었습니다. 특정 모델에서만 지원되지만 속도와 정확성을 크게 향상시킬 수 있습니다. |
| `schema`               | Schema                         | 모델의 응답 형식에 대한 구조를 정의하여 JSON과 같은 구조화된 출력을 가능하게 합니다. 자세한 내용은 [스키마](#schema)를 참조하세요.                                                      |
| `toolChoice`           | ToolChoice                     | 언어 모델의 도구 호출 동작을 제어합니다. 자세한 내용은 [도구 선택](#tool-choice)을 참조하세요.                                                                                    |
| `user`                 | String                         | 추적 목적으로 사용될 수 있는 요청을 하는 사용자의 식별자입니다.                                                                                                                                           |
| `additionalProperties` | Map&lt;String, JsonElement&gt; | 특정 모델 공급자별 사용자 지정 매개변수를 저장하는 데 사용할 수 있는 추가 속성입니다.                                                                                          |

각 매개변수의 기본값 목록은 해당 LLM 공급자 설명서를 참조하세요:

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [Google](https://ai.google.dev/api/generate-content#generationconfig)
- [Anthropic](https://platform.claude.com/docs/en/api/messages/create)
- [Mistral](https://docs.mistral.ai/api/#operation/chatCompletions)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api/reference/parameters)
- Alibaba ([DashScope](https://www.alibabacloud.com/help/en/model-studio/qwen-api-reference))

## 스키마

`Schema` 인터페이스는 모델의 응답 형식에 대한 구조를 정의합니다.
Koog는 아래 섹션에 설명된 JSON 스키마를 지원합니다.

### JSON 스키마

JSON 스키마를 사용하면 언어 모델에서 구조화된 JSON 데이터를 요청할 수 있습니다. Koog는 다음 두 가지 유형의 JSON 스키마를 지원합니다:

1) **기본 JSON 스키마** (`LLMParams.Schema.JSON.Basic`): 기본 JSON 처리 기능에 사용됩니다. 이 형식은 고급 JSON 스키마 기능 없이 주로 중첩 데이터 정의에 중점을 둡니다.

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

2) **표준 JSON 스키마** (`LLMParams.Schema.JSON.Standard`): [json-schema.org](https://json-schema.org/)에 따른 표준 JSON 스키마를 나타냅니다. 이 형식은 공식 JSON 스키마 사양의 적절한 부분 집합입니다. 모든 LLM 공급자가 전체 JSON 스키마를 지원하는 것은 아니므로 공급자마다 형식이 다를 수 있다는 점에 유의하세요.

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

## 도구 선택

`ToolChoice` 클래스는 언어 모델이 도구를 사용하는 방법을 제어합니다. 다음과 같은 옵션을 제공합니다:

* `LLMParams.ToolChoice.Named`: 언어 모델이 지정된 도구를 호출합니다. 호출할 도구의 이름을 나타내는 `name` 문자열 인수를 사용합니다.
* `LLMParams.ToolChoice.All`: 언어 모델이 모든 도구를 호출합니다.
* `LLMParams.ToolChoice.None`: 언어 모델이 도구를 호출하지 않고 텍스트만 생성합니다.
* `LLMParams.ToolChoice.Auto`: 언어 모델이 도구를 호출할지 여부와 호출할 도구를 자동으로 결정합니다.
* `LLMParams.ToolChoice.Required`: 언어 모델이 하나 이상의 도구를 호출합니다.

다음은 특정 도구를 호출하기 위해 `LLMParams.ToolChoice.Named` 클래스를 사용하는 예시입니다:

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-06.kt -->

## 공급자별 매개변수

Koog는 일부 LLM 공급자에 대해 공급자별 매개변수를 지원합니다. 이러한 매개변수는 기본 `LLMParams` 클래스를 확장하고 공급자별 기능을 추가합니다. 다음 클래스에는 공급자별 매개변수가 포함되어 있습니다:

- `OpenAIChatParams`: OpenAI Chat Completions API에 특정한 매개변수.
- `OpenAIResponsesParams`: OpenAI Responses API에 특정한 매개변수.
- `GoogleParams`: Google 모델에 특정한 매개변수.
- `AnthropicParams`: Anthropic 모델에 특정한 매개변수.
- `MistralAIParams`: Mistral 모델에 특정한 매개변수.
- `DeepSeekParams`: DeepSeek 모델에 특정한 매개변수.
- `OpenRouterParams`: OpenRouter 모델에 특정한 매개변수.
- `DashscopeParams`: Alibaba 모델에 특정한 매개변수.

다음은 Koog에서 공급자별 매개변수의 전체 참조입니다:

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

다음 예시는 공급자별 `OpenRouterParams` 클래스를 사용하여 정의된 OpenRouter LLM 매개변수를 보여줍니다:

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

## 사용 예시

### 기본 사용법

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

### 추론 제어

모델 추론을 제어하는 공급자별 매개변수를 통해 추론 제어를 구현합니다.
OpenAI Chat API 및 추론을 지원하는 모델을 사용하는 경우, `reasoningEffort` 매개변수를 사용하여
모델이 응답을 제공하기 전에 생성하는 추론 토큰 수를 제어할 수 있습니다:

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

또한 무상태 모드에서 OpenAI Responses API를 사용하는 경우, 암호화된 추론 항목 기록을 유지하고 모든 대화 턴에서 모델에 전송합니다. 암호화는 OpenAI 측에서 수행되며, 요청에서 `include` 매개변수를 `reasoning.encrypted_content`로 설정하여 암호화된 추론 토큰을 요청해야 합니다.
그런 다음 암호화된 추론 토큰을 다음 대화 턴에서 모델에 다시 전달할 수 있습니다.

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

### 사용자 지정 매개변수

공급자별이며 Koog에서 기본적으로 지원되지 않는 사용자 지정 매개변수를 추가하려면 아래 예시와 같이 `additionalProperties` 속성을 사용하세요.

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

### 매개변수 설정 및 재정의

아래 코드 샘플은 주로 사용하려는 LLM 매개변수 집합을 정의한 다음,
원래 집합의 값을 부분적으로 재정의하고 새 값을 추가하여 다른 집합을 생성하는 방법을 보여줍니다.
이를 통해 대부분의 요청에 공통적인 매개변수를 정의하고, 공통 매개변수를 반복할 필요 없이 더 구체적인 매개변수 조합을 추가할 수 있습니다.

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

결과 `overrideParams` 집합의 값은 다음과 같습니다:

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