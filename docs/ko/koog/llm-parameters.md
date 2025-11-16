# LLM 매개변수

이 페이지에서는 Koog 에이전트 프레임워크의 LLM 매개변수에 대한 세부 정보를 제공합니다. LLM 매개변수를 사용하면 언어 모델의 동작을 제어하고 사용자 지정할 수 있습니다.

## 개요

LLM 매개변수는 언어 모델이 응답을 생성하는 방식을 미세 조정할 수 있는 구성 옵션입니다. 이러한 매개변수는 응답의 무작위성, 길이, 형식 및 도구 사용과 같은 측면을 제어합니다. 매개변수를 조정하여 창의적인 콘텐츠 생성부터 결정론적 구조화된 출력까지 다양한 사용 사례에 대한 모델 동작을 최적화할 수 있습니다.

Koog에서 `LLMParams` 클래스는 LLM 매개변수를 통합하고 언어 모델 동작을 구성하기 위한 일관된 인터페이스를 제공합니다. LLM 매개변수는 다음과 같은 방법으로 사용할 수 있습니다.

- 프롬프트 생성 시:

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

    프롬프트 생성에 대한 자세한 내용은 [프롬프트 API](prompt-api.md)를 참조하세요.

- 서브그래프 생성 시:

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

    자신만의 서브그래프를 생성하고 구현하는 방법에 대한 자세한 내용은 [사용자 지정 서브그래프](custom-subgraphs.md)를 참조하세요.

- LLM 쓰기 세션에서 프롬프트 업데이트 시:

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

각 매개변수의 기본값 목록은 해당 LLM 공급자 설명서를 참조하세요.

- [OpenAI Chat](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI Responses](https://platform.openai.com/docs/api-reference/responses/create)
- [DeepSeek](https://api-docs.deepseek.com/api/create-chat-completion#request)
- [OpenRouter](https://openrouter.ai/docs/api-reference/parameters)

## 스키마

`Schema` 인터페이스는 모델의 응답 형식에 대한 구조를 정의합니다. Koog는 아래 섹션에 설명된 JSON 스키마를 지원합니다.

### JSON 스키마

JSON 스키마를 사용하면 언어 모델에서 구조화된 JSON 데이터를 요청할 수 있습니다. Koog는 다음 두 가지 유형의 JSON 스키마를 지원합니다.

1.  **기본 JSON 스키마** (`LLMParams.Schema.JSON.Basic`): 기본 JSON 처리 기능에 사용됩니다. 이 형식은 고급 JSON 스키마 기능 없이 주로 중첩 데이터 정의에 중점을 둡니다.

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

2.  **표준 JSON 스키마** (`LLMParams.Schema.JSON.Standard`): [json-schema.org](https://json-schema.org/)에 따른 표준 JSON 스키마를 나타냅니다. 이 형식은 공식 JSON 스키마 사양의 적절한 부분 집합입니다. 모든 LLM 공급자가 전체 JSON 스키마를 지원하는 것은 아니므로 공급자마다 형식이 다를 수 있다는 점에 유의하세요.

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
                                "id" to JsonPrimitive("string")),
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

`ToolChoice` 클래스는 언어 모델이 도구를 사용하는 방법을 제어합니다. 다음과 같은 옵션을 제공합니다.

*   `LLMParams.ToolChoice.Named`: 언어 모델이 지정된 도구를 호출합니다. 호출할 도구의 이름을 나타내는 `name` 문자열 인수를 사용합니다.
*   `LLMParams.ToolChoice.All`: 언어 모델이 모든 도구를 호출합니다.
*   `LLMParams.ToolChoice.None`: 언어 모델이 도구를 호출하지 않고 텍스트만 생성합니다.
*   `LLMParams.ToolChoice.Auto`: 언어 모델이 도구를 호출할지 여부와 호출할 도구를 자동으로 결정합니다.
*   `LLMParams.ToolChoice.Required`: 언어 모델이 하나 이상의 도구를 호출합니다.

다음은 특정 도구를 호출하기 위해 `LLMParams.ToolChoice.Named` 클래스를 사용하는 예시입니다.

<!--- INCLUDE
import ai.koog.prompt.params.LLMParams
-->
```kotlin
val specificToolParams = LLMParams(
    toolChoice = LLMParams.ToolChoice.Named(name = "calculator")
)
```
<!--- KNIT example-llm-parameters-01.kt -->

## 공급자별 매개변수

Koog는 일부 LLM 공급자에 대해 공급자별 매개변수를 지원합니다. 이러한 매개변수는 기본 `LLMParams` 클래스를 확장하고 공급자별 기능을 추가합니다. 다음 클래스에는 공급자별 매개변수가 포함되어 있습니다.

-   `DeepSeekParams`: DeepSeek 모델에 특정한 매개변수.
-   `OpenRouterParams`: OpenRouter 모델에 특정한 매개변수.
-   `OpenAIChatParams`: OpenAI Chat Completions API에 특정한 매개변수.
-   `OpenAIResponsesParams`: OpenAI Responses API에 특정한 매개변수.

다음은 Koog에서 공급자별 매개변수의 전체 참조입니다.

| 매개변수           | 공급자                                           | 유형                   | 설명                                                                                                                                                                                                                                                                                                                                                                                                                        |
|---------------------|-----------------------------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topP`              | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Double                 | nucleus 샘플링이라고도 합니다. 확률의 합계가 지정된 `topP` 값에 도달할 때까지 가장 높은 확률 값을 가진 토큰을 하위 집합에 추가하여 다음 토큰의 하위 집합을 만듭니다. 0.0보다 크고 1.0보다 작거나 같은 값을 사용합니다.                                                                                                                                                   |
| `logprobs`          | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Boolean                | `true`인 경우, 출력 토큰에 대한 로그 확률을 포함합니다.                                                                                                                                                                                                                                                                                                                                                                           |
| `topLogprobs`       | OpenAI Chat, OpenAI Responses, DeepSeek, OpenRouter | Integer                | 위치당 가장 가능성 있는 상위 토큰 수. 0–20 범위의 값을 사용합니다. `logprobs` 매개변수를 `true`로 설정해야 합니다.                                                                                                                                                                                                                                                                                                                         |
| `frequencyPenalty`  | OpenAI Chat, DeepSeek, OpenRouter                   | Double                 | 반복을 줄이기 위해 빈번한 토큰에 페널티를 부여합니다. `frequencyPenalty` 값이 높을수록 더 큰 구문 변화와 반복 감소가 발생합니다. -2.0에서 2.0 범위의 값을 사용합니다.                                                                                                                                                                                                         |
| `presencePenalty`   | OpenAI Chat, DeepSeek, OpenRouter                   | Double                 | 모델이 이미 출력에 포함된 토큰을 재사용하는 것을 방지합니다. 값이 높을수록 새로운 토큰과 주제의 도입을 장려합니다. -2.0에서 2.0 범위의 값을 사용합니다.                                                                                                                                                                                                                                |
| `stop`              | OpenAI Chat, DeepSeek, OpenRouter                   | List&lt;String&gt;     | 모델이 해당 문자열 중 하나를 만나면 콘텐츠 생성을 중단해야 함을 알리는 문자열입니다. 예를 들어, 모델이 두 개의 새 줄을 생성할 때 콘텐츠 생성을 중단하게 하려면 정지 시퀀스를 `stop = listOf("/n/n")`으로 지정합니다.                                                                                                                                                                                |
| `parallelToolCalls` | OpenAI Chat, OpenAI Responses                       | Boolean                | `true`인 경우, 여러 도구 호출을 병렬로 실행할 수 있습니다.                                                                                                                                                                                                                                                                                                                                                                                |
| `promptCacheKey`    | OpenAI Chat, OpenAI Responses                       | String                 | 프롬프트 캐싱을 위한 안정적인 캐시 키입니다. OpenAI는 이를 사용하여 유사한 요청에 대한 응답을 캐시합니다.                                                                                                                                                                                                                                                                                                                                       |
| `safetyIdentifier`  | OpenAI Chat, OpenAI Responses                       | String                 | OpenAI 정책을 위반하는 사용자를 감지하는 데 사용될 수 있는 안정적이고 고유한 사용자 식별자입니다.                                                                                                                                                                                                                                                                                                                                  |
| `serviceTier`       | OpenAI Chat, OpenAI Responses                       | ServiceTier            | 성능을 비용보다 우선시하거나 그 반대로 할 수 있는 OpenAI 처리 티어 선택입니다. 자세한 내용은 [ServiceTier](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-service-tier/index.html)에 대한 API 설명서를 참조하세요.                                                                               |
| `store`             | OpenAI Chat, OpenAI Responses                       | Boolean                | `true`인 경우, 공급자는 나중에 검색할 수 있도록 출력을 저장할 수 있습니다.                                                                                                                                                                                                                                                                                                                                                                     |
| `audio`             | OpenAI Chat                                         | OpenAIAudioConfig      | 오디오 기능이 있는 모델을 사용할 때의 오디오 출력 구성입니다. 자세한 내용은 [OpenAIAudioConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-audio-config/index.html)에 대한 API 설명서를 참조하세요.                                                                                                   |
| `reasoningEffort`   | OpenAI Chat                                         | ReasoningEffort        | 모델이 사용할 추론 노력 수준을 지정합니다. 자세한 내용 및 사용 가능한 값은 [ReasoningEffort](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-reasoning-effort/index.html)에 대한 API 설명서를 참조하세요.                                                                                |
| `webSearchOptions`  | OpenAI Chat                                         | OpenAIWebSearchOptions | 웹 검색 도구 사용을 구성합니다(지원되는 경우). 자세한 내용은 [OpenAIWebSearchOptions](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client-base/ai.koog.prompt.executor.clients.openai.base.models/-open-a-i-web-search-options/index.html)에 대한 API 설명서를 참조하세요.                                                                                                    |
| `background`        | OpenAI Responses                                    | Boolean                | 백그라운드에서 응답을 실행합니다.                                                                                                                                                                                                                                                                                                                                                                                                |
| `include`           | OpenAI Responses                                    | List&lt;String&gt;     | 포함할 추가 출력 섹션. 자세한 내용은 OpenAI 설명서에서 [include](https://platform.openai.com/docs/api-reference/responses/create#responses-create-include) 매개변수에 대해 알아보세요.                                                                                                                                                                                                              |
| `maxToolCalls`      | OpenAI Responses                                    | Int                    | 이 응답에서 허용되는 내장 도구 호출의 최대 총 수. `0`보다 크거나 같은 값을 사용합니다.                                                                                                                                                                                                                                                                                                                  |
| `reasoning`         | OpenAI Responses                                    | ReasoningConfig        | 추론 기능이 있는 모델에 대한 추론 구성입니다. 자세한 내용은 [ReasoningConfig](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-reasoning-config/index.html)에 대한 API 설명서를 참조하세요.                                                                                          |
| `truncation`        | OpenAI Responses                                    | Truncation             | 컨텍스트 창에 가까워질 때의 잘림 전략입니다. 자세한 내용은 [Truncation](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openai-client/ai.koog.prompt.executor.clients.openai.models/-truncation/index.html)에 대한 API 설명서를 참조하세요.                                                                                                                                      |
| `topK`              | OpenRouter                                          | Int                    | 출력을 생성할 때 고려할 상위 토큰 수. 1보다 크거나 같은 값을 사용합니다.                                                                                                                                                                                                                                                                                                                             |
| `repetitionPenalty` | OpenRouter                                          | Double                 | 토큰 반복에 페널티를 부여합니다. 출력에 이미 나타난 토큰에 대한 다음 토큰 확률은 `repetitionPenalty` 값으로 나뉘어 `repetitionPenalty > 1`인 경우 다시 나타날 가능성이 낮아집니다. 0.0보다 크고 2.0보다 작거나 같은 값을 사용합니다.                                                                                                                                       |
| `minP`              | OpenRouter                                          | Double                 | 가장 가능성 있는 토큰에 대한 상대 확률이 정의된 `minP` 값보다 낮은 토큰을 필터링합니다. 0.0–0.1 범위의 값을 사용합니다.                                                                                                                                                                                                                                                                                   |
| `topA`              | OpenRouter                                          | Double                 | 모델 신뢰도를 기반으로 샘플링 창을 동적으로 조정합니다. 모델이 확신하는 경우(지배적인 고확률 다음 토큰이 있는 경우) 샘플링 창을 몇 개의 상위 토큰으로 제한합니다. 신뢰도가 낮은 경우(유사한 확률을 가진 많은 토큰이 있는 경우) 샘플링 창에 더 많은 토큰을 유지합니다. 0.0–0.1 범위(포함)의 값을 사용합니다. 값이 높을수록 동적 적응력이 커집니다. |
| `transforms`        | OpenRouter                                          | List&lt;String&gt;     | 컨텍스트 변환 목록. 컨텍스트가 모델의 토큰 제한을 초과할 때 컨텍스트가 변환되는 방식을 정의합니다. 기본 변환은 프롬프트 중간부터 잘라내는 `middle-out`입니다. 변환이 없으면 빈 목록을 사용합니다. 자세한 내용은 OpenRouter 설명서의 [메시지 변환](https://openrouter.ai/docs/features/message-transforms)을 참조하세요.                                                       |
| `models`            | OpenRouter                                          | List&lt;String&gt;     | 요청에 허용되는 모델 목록입니다.                                                                                                                                                                                                                                                                                                                                                                                            |
| `route`             | OpenRouter                                          | String                 | 요청 라우팅 식별자.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `provider`          | OpenRouter                                          | ProviderPreferences    | 모델 공급자 기본 설정. 자세한 내용은 [ProviderPreferences](https://api.koog.ai/prompt/prompt-executor/prompt-executor-clients/prompt-executor-openrouter-client/ai.koog.prompt.executor.clients.openrouter.models/-provider-preferences/index.html)에 대한 API 설명서를 참조하세요.                                                                                                                                     |

다음 예시는 공급자별 `OpenRouterParams` 클래스를 사용하여 정의된 OpenRouter LLM 매개변수를 보여줍니다.

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
<!--- KNIT example-llm-parameters-03.kt -->

### 추론 제어

모델 추론을 제어하는 공급자별 매개변수를 통해 추론 제어를 구현합니다.
OpenAI Chat API 및 추론을 지원하는 모델을 사용하는 경우, `reasoningEffort` 매개변수를 사용하여
모델이 응답을 제공하기 전에 생성하는 추론 토큰 수를 제어할 수 있습니다.

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
<!--- KNIT example-llm-parameters-05.kt -->

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
<!--- KNIT example-llm-parameters-06.kt -->

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
<!--- KNIT example-llm-parameters-07.kt -->

결과 `overrideParams` 집합의 값은 다음과 같습니다.

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