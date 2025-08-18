Koog는 다양한 LLM(대규모 언어 모델) 제공자의 LLM과 제공자에 구애받지 않는 방식으로 작업하기 위한 일련의 추상화 및 구현체를 제공합니다. 해당 세트에는 다음 클래스가 포함됩니다.

-   **LLMCapability**: LLM이 지원할 수 있는 다양한 기능을 정의하는 클래스 계층 구조로, 다음을 포함합니다.
    -   응답 무작위성 제어를 위한 온도(Temperature) 조절
    -   외부 시스템 상호작용을 위한 도구 통합
    -   시각적 데이터 처리를 위한 시각(Vision) 처리
    -   벡터 표현 생성을 위한 임베딩(Embedding) 생성
    -   텍스트 생성 작업을 위한 완성(Completion)
    -   구조화된 데이터(Simple 및 Full 변형을 포함하는 JSON)를 위한 스키마(Schema) 지원
    -   탐색적 응답을 위한 추론(Speculation)

-   **LLModel**: 특정 LLM과 해당 제공자, 고유 식별자 및 지원되는 기능을 나타내는 데이터 클래스입니다.

이는 다양한 LLM 제공자와 통합된 방식으로 상호작용하기 위한 기반을 제공하여, 애플리케이션이 제공자별 세부 정보를 추상화하면서 다양한 모델과 작업할 수 있도록 합니다.

## LLM 기능

LLM 기능은 대규모 언어 모델이 지원할 수 있는 특정 기능 또는 동작을 나타냅니다. Koog 프레임워크에서 기능은 특정 모델이 무엇을 할 수 있고 어떻게 구성될 수 있는지 정의하는 데 사용됩니다. 각 기능은 `LLMCapability` 클래스의 서브클래스 또는 데이터 객체로 표현됩니다.

애플리케이션에서 LLM을 사용하도록 구성할 때, `LLModel` 인스턴스를 생성할 때 `capabilities` 목록에 기능을 추가하여 지원하는 기능을 지정합니다. 이를 통해 프레임워크는 모델과 올바르게 상호작용하고 해당 기능을 적절하게 사용할 수 있습니다.

### 핵심 기능

아래 목록에는 Koog 프레임워크의 모델에서 사용할 수 있는 핵심적인 LLM별 기능이 포함됩니다.

-   **추론(Speculation)** (`LLMCapability.Speculation`): 모델이 다양한 가능성 수준으로 추론적이거나 탐색적인 응답을 생성하도록 합니다. 더 넓은 범위의 잠재적 결과가 필요한 창의적이거나 가설적인 시나리오에 유용합니다.

-   **온도(Temperature)** (`LLMCapability.Temperature`): 모델 응답의 무작위성 또는 창의성 수준을 조절할 수 있도록 합니다. 높은 온도 값은 더 다양한 출력을 생성하는 반면, 낮은 값은 더 집중적이고 결정론적인 응답으로 이어집니다.

-   **도구(Tools)** (`LLMCapability.Tools`): 외부 도구 사용 또는 통합 지원을 나타냅니다. 이 기능은 모델이 특정 도구를 실행하거나 외부 시스템과 상호작용하도록 합니다.

-   **도구 선택(Tool choice)** (`LLMCapability.ToolChoice`): LLM과 함께 도구 호출이 어떻게 작동하는지 구성합니다. 모델에 따라 다음을 수행하도록 구성할 수 있습니다.
    -   텍스트 생성과 도구 호출 중 자동으로 선택
    -   텍스트는 생성하지 않고 도구 호출만 생성
    -   도구 호출은 생성하지 않고 텍스트만 생성
    -   정의된 도구 중에서 특정 도구 호출 강제

-   **다중 선택(Multiple choices)** (`LLMCapability.MultipleChoices`): 모델이 단일 프롬프트에 대해 여러 개의 독립적인 응답 선택지를 생성하도록 합니다.

### 미디어 처리 기능

다음 목록은 이미지 또는 오디오와 같은 미디어 콘텐츠를 처리하기 위한 기능 집합을 나타냅니다.

-   **시각(Vision)** (`LLMCapability.Vision`): 시각 데이터를 처리, 분석하고 통찰력을 추론하는 시각 기반 기능을 위한 클래스입니다.
    다음 유형의 시각 데이터를 지원합니다.
    -   **이미지(Image)** (`LLMCapability.Vision.Image`): 이미지 분석, 인식 및 해석과 같은 이미지 관련 시각 작업을 처리합니다.
    -   **비디오(Video)** (`LLMCapability.Vision.Video`): 비디오 콘텐츠 분석 및 이해를 포함하여 비디오 데이터를 처리합니다.

-   **오디오(Audio)** (`LLMCapability.Audio`): 전사(Transcription), 오디오 생성 또는 오디오 기반 상호작용과 같은 오디오 관련 기능을 제공합니다.

-   **문서(Document)** (`LLMCapability.Document`): 문서 기반 입력 및 출력의 처리 및 조작을 가능하게 합니다.

### 텍스트 처리 기능

다음 기능 목록은 텍스트 생성 및 처리 기능을 나타냅니다.

-   **임베딩(Embedding)** (`LLMCapability.Embed`): 모델이 입력 텍스트에서 벡터 임베딩을 생성하도록 하여 유사성 비교, 클러스터링 및 기타 벡터 기반 분석을 가능하게 합니다.

-   **완성(Completion)** (`LLMCapability.Completion`): 주어진 입력 컨텍스트를 기반으로 텍스트 또는 콘텐츠 생성을 포함하며, 문장 완성, 제안 생성 또는 입력 데이터와 일치하는 콘텐츠 생성과 같은 작업을 수행합니다.

-   **프롬프트 캐싱(Prompt caching)** (`LLMCapability.PromptCaching`): 프롬프트 캐싱 기능을 지원하여 반복되거나 유사한 쿼리에 대한 성능을 잠재적으로 향상시킵니다.

-   **중재(Moderation)** (`LLMCapability.Moderation`): 모델이 잠재적으로 유해한 콘텐츠에 대해 텍스트를 분석하고 괴롭힘, 혐오 발언, 자해, 성적 콘텐츠, 폭력 등 다양한 범주로 분류하도록 합니다.

### 스키마 기능

아래 목록은 구조화된 데이터 처리와 관련된 기능을 나타냅니다.

-   **스키마(Schema)** (`LLMCapability.Schema`): 특정 형식을 사용하여 데이터 상호작용 및 인코딩과 관련된 구조화된 스키마 기능을 위한 클래스입니다.
    다음 형식 지원을 포함합니다.
    -   **JSON** (`LLMCapability.Schema.JSON`): 다양한 수준의 JSON 스키마 지원:
        -   **기본(Basic)** (`LLMCapability.Schema.JSON.Basic`): 경량 또는 기본 JSON 처리 기능을 제공합니다.
        -   **표준(Standard)** (`LLMCapability.Schema.JSON.Standard`): 복잡한 데이터 구조를 위한 포괄적인 JSON 스키마 지원을 제공합니다.

## 모델 (LLModel) 구성 생성

보편적이고 제공자에 구애받지 않는 방식으로 모델을 정의하려면, 다음 파라미터와 함께 `LLModel` 클래스의 인스턴스로 모델 구성을 생성합니다.

| 이름              | 데이터 타입                 | 필수 | 기본값 | 설명                                                                                                             |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | 예       |         | LLM의 제공자입니다. Google 또는 OpenAI와 같습니다. 이는 모델을 생성하거나 호스팅하는 회사 또는 조직을 식별합니다.       |
| `id`              | String                    | 예       |         | LLM 인스턴스의 고유 식별자입니다. 일반적으로 특정 모델 버전 또는 이름을 나타냅니다. 예를 들어, `gpt-4-turbo`, `claude-3-opus`, `llama-3-2`입니다. |
| `capabilities`    | List&lt;LLMCapability&gt; | 예       |         | LLM이 지원하는 기능 목록입니다. 온도 조절, 도구 사용 또는 스키마 기반 작업과 같습니다. 이 기능들은 모델이 무엇을 할 수 있고 어떻게 구성될 수 있는지 정의합니다. |
| `contextLength`   | Long                      | 예       |         | LLM의 컨텍스트 길이입니다. 이는 LLM이 처리할 수 있는 최대 토큰 수입니다.                                            |
| `maxOutputTokens` | Long                      | 아니요   | `null`  | LLM에 대해 제공자가 생성할 수 있는 최대 토큰 수입니다.                                                              |

### 예시

이 섹션에서는 다양한 기능을 가진 `LLModel` 인스턴스를 생성하는 자세한 예시를 제공합니다.

아래 코드는 핵심 기능을 포함하는 기본 LLM 구성을 나타냅니다.

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.llm.LLModel

-->
```kotlin
val basicModel = LLModel(
    provider = LLMProvider.OpenAI,
    id = "gpt-4-turbo",
    capabilities = listOf(
        LLMCapability.Temperature,
        LLMCapability.Tools,
        LLMCapability.Schema.JSON.Standard
    ),
    contextLength = 128_000
)
```
<!--- KNIT example-model-capabilities-01.kt -->

아래 모델 구성은 시각 기능을 갖춘 멀티모달 LLM입니다.

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.llm.LLModel

-->
```kotlin
val visionModel = LLModel(
    provider = LLMProvider.OpenAI,
    id = "gpt-4-vision",
    capabilities = listOf(
        LLMCapability.Temperature,
        LLMCapability.Vision.Image,
        LLMCapability.MultipleChoices
    ),
    contextLength = 1_047_576,
    maxOutputTokens = 32_768
)
```
<!--- KNIT example-model-capabilities-02.kt -->

오디오 처리 기능을 갖춘 LLM:

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.llm.LLModel

-->
```kotlin
val audioModel = LLModel(
    provider = LLMProvider.Anthropic,
    id = "claude-3-opus",
    capabilities = listOf(
        LLMCapability.Audio,
        LLMCapability.Temperature,
        LLMCapability.PromptCaching
    ),
    contextLength = 200_000
)
```
<!--- KNIT example-model-capabilities-03.kt -->

`LLModel` 인스턴스로 모델을 생성하고 모든 관련 파라미터를 지정해야 하는 것 외에도, Koog는 지원되는 기능을 포함하는 미리 정의된 모델 및 구성 모음을 포함합니다.
미리 정의된 Ollama 모델을 사용하려면 다음과 같이 지정하십시오.

<!--- INCLUDE
import ai.koog.prompt.llm.OllamaModels

-->
```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```
<!--- KNIT example-model-capabilities-04.kt -->

모델이 특정 기능을 지원하는지 확인하려면 `capabilities` 목록에서 기능의 존재 여부를 확인하기 위해 `contains` 메서드를 사용하십시오.

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.OllamaModels

val basicModel = OllamaModels.Meta.LLAMA_3_2
val visionModel = OllamaModels.Meta.LLAMA_3_2

-->
```kotlin
// 모델이 특정 기능을 지원하는지 확인
val supportsTools = basicModel.capabilities.contains(LLMCapability.Tools) // true
val supportsVideo = visionModel.capabilities.contains(LLMCapability.Vision.Video) // false

// 스키마 기능 확인
val jsonCapability = basicModel.capabilities.filterIsInstance<LLMCapability.Schema.JSON>().firstOrNull()
val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
```
<!--- KNIT example-model-capabilities-05.kt -->

### 모델별 LLM 기능

이 참조는 다양한 제공자에 걸쳐 각 모델이 어떤 LLM 기능을 지원하는지 보여줍니다.

아래 표에서:

-   `✓`는 모델이 해당 기능을 지원함을 나타냅니다.
-   `-`는 모델이 해당 기능을 지원하지 않음을 나타냅니다.
-   JSON 스키마의 경우, `Full` 또는 `Simple`은 모델이 지원하는 JSON 스키마 기능의 변형을 나타냅니다.

#### Google 모델

| 모델                  | 온도 | JSON 스키마 | 완성 | 다중 선택 | 도구 | 도구 선택 | 시각(이미지) | 시각(비디오) | 오디오 |
|------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|
| Gemini2_5Pro           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini2_5Flash         | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |
| Gemini2_0Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini2_0Flash001      | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini2_0FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini2_0FlashLite001  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini1_5Pro           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini1_5ProLatest     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini1_5Pro002        | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini1_5Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
| Gemini1_5FlashLatest   | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |
| Gemini1_5Flash002      | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |
| Gemini1_5Flash8B       | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |
| Gemini1_5Flash8B001    | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |
| Gemini1_5Flash8BLatest | ✓           | Full        | ✓          | ✓                | -     | -           | ✓              | ✓              | ✓     |

#### OpenAI 모델

| 모델                | 온도 | JSON 스키마 | 완성 | 다중 선택 | 도구 | 도구 선택 | 시각(이미지) | 시각(비디오) | 오디오 | 추론 | 중재 |
|----------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|-------------|------------|
| Reasoning.GPT4oMini  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
| Reasoning.O3Mini     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | -              | -              | -     | ✓           | -          |
| Reasoning.O1Mini     | -           | Full        | ✓          | ✓                | -     | -           | -              | -              | -     | ✓           | -          |
| Reasoning.O3         | -           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
| Reasoning.O1         | -           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
| Chat.GPT4o           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
| Chat.GPT4_1          | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
| Audio.GPT4oMiniAudio | ✓           | -           | ✓          | -                | ✓     | ✓           | -              | -              | ✓     | -           | -          |
| Audio.GPT4oAudio     | ✓           | -           | ✓          | -                | ✓     | ✓           | -              | -              | ✓     | -           | -          |
| Moderation.Omni      | -           | -           | -          | -                | -     | -           | ✓              | -              | -     | -           | ✓          |
| Moderation.Text      | -           | -           | -          | -                | -     | -           | -              | -              | -     | -           | ✓          |

#### Anthropic 모델

| 모델      | 온도 | JSON 스키마 | 완성 | 도구 | 도구 선택 | 시각(이미지) |
|------------|-------------|-------------|------------|-------|-------------|----------------|
| Opus_4     | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Sonnet_4   | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Sonnet_3_7 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Haiku_3_5  | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Sonnet_3_5 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Haiku_3    | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
| Opus_3     | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |

#### Ollama 모델

##### Meta 모델

| 모델         | 온도 | JSON 스키마 | 도구 | 중재 |
|---------------|-------------|-------------|-------|------------|
| LLAMA_3_2_3B  | ✓           | Simple      | ✓     | -          |
| LLAMA_3_2     | ✓           | Simple      | ✓     | -          |
| LLAMA_4       | ✓           | Simple      | ✓     | -          |
| LLAMA_GUARD_3 | -           | -           | -     | ✓          |

##### Alibaba 모델

| 모델              | 온도 | JSON 스키마 | 도구 |
|--------------------|-------------|-------------|-------|
| QWEN_2_5_05B       | ✓           | Simple      | ✓     |
| QWEN_3_06B         | ✓           | Simple      | ✓     |
| QWQ                | ✓           | Simple      | ✓     |
| QWEN_CODER_2_5_32B | ✓           | Simple      | ✓     |

##### Groq 모델

| 모델                     | 온도 | JSON 스키마 | 도구 |
|---------------------------|-------------|-------------|-------|
| LLAMA_3_GROK_TOOL_USE_8B  | ✓           | Full        | ✓     |
| LLAMA_3_GROK_TOOL_USE_70B | ✓           | Full        | ✓     |

##### Granite 모델

| 모델              | 온도 | JSON 스키마 | 도구 | 시각(이미지) |
|--------------------|-------------|-------------|-------|----------------|
| GRANITE_3_2_VISION | ✓           | Simple      | ✓     | ✓              |

#### OpenRouter 모델

| 모델               | 온도 | JSON 스키마 | 완성 | 추론 | 도구 | 도구 선택 | 시각(이미지) |
|---------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
| Phi4Reasoning       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Claude3Opus         | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Claude3Sonnet       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Claude3Haiku        | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| GPT4                | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| GPT4o               | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| GPT4Turbo           | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| GPT35Turbo          | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Gemini15Pro         | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Gemini15Flash       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Llama3              | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Llama3Instruct      | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Mistral7B           | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Mixtral8x7B         | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
| Claude3VisionSonnet | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Claude3VisionOpus   | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
| Claude3VisionHaiku  | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |