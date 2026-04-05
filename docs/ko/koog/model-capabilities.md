Koog는 다양한 LLM 제공자의 대규모 언어 모델(LLM)을 제공자 독립적인(provider-agnostic) 방식으로 작업하기 위한 일련의 추상화 및 구현을 제공합니다. 이 세트에는 다음 클래스들이 포함됩니다:

- **LLMCapability**: LLM이 지원할 수 있는 다음과 같은 다양한 기능을 정의하는 클래스 계층 구조입니다:
    - 응답의 무작위성을 제어하기 위한 온도(Temperature) 조절
    - 외부 시스템 상호작용을 위한 도구(Tool) 통합
    - 시각적 데이터 처리를 위한 비전(Vision) 처리
    - 벡터 표현을 위한 임베딩(Embedding) 생성
    - 텍스트 생성 작업을 위한 컴플리션(Completion)
    - 구조화된 데이터(Simple 및 Full 변종이 있는 JSON)를 위한 스키마(Schema) 지원
    - 탐색적 응답을 위한 스펙큘레이션(Speculation)

- **LLModel**: 제공자, 고유 식별자 및 지원되는 기능을 가진 특정 LLM을 나타내는 데이터 클래스입니다.

이는 다양한 LLM 제공자와 통일된 방식으로 상호작용하기 위한 기초 역할을 하며, 애플리케이션이 제공자별 세부 사항을 추상화하면서 다양한 모델과 작업할 수 있도록 합니다.

## LLM 기능 (LLM capabilities)

LLM 기능은 대규모 언어 모델이 지원할 수 있는 특정 기능이나 특징을 나타냅니다. Koog 프레임워크에서 기능은 특정 모델이 무엇을 할 수 있고 어떻게 구성될 수 있는지 정의하는 데 사용됩니다. 각 기능은 `LLMCapability` 클래스의 서브클래스 또는 데이터 객체로 표현됩니다.

애플리케이션에서 사용할 LLM을 구성할 때, `LLModel` 인스턴스를 생성할 때 `capabilities` 리스트에 추가하여 해당 모델이 지원하는 기능을 지정합니다. 이를 통해 프레임워크는 모델과 적절하게 상호작용하고 해당 기능을 적절하게 사용할 수 있습니다.

### 핵심 기능 (Core capabilities)

아래 목록에는 Koog 프레임워크의 모델에서 사용할 수 있는 핵심 LLM 전용 기능이 포함되어 있습니다:

- **스펙큘레이션** (`LLMCapability.Speculation`): 모델이 다양한 가능성을 가진 추측성 또는 탐색적 응답을 생성하도록 합니다. 더 넓은 범위의 잠재적 결과가 필요한 창의적이거나 가상적인 시나리오에 유용합니다.

- **온도** (`LLMCapability.Temperature`): 모델 응답의 무작위성 또는 창의성 수준을 조절할 수 있게 합니다. 온도가 높을수록 더 다양한 결과물이 생성되고, 낮을수록 더 집중적이고 결정론적인 응답이 생성됩니다.

- **도구** (`LLMCapability.Tools`): 외부 도구 사용 또는 통합 지원을 나타냅니다. 이 기능을 통해 모델은 특정 도구를 실행하거나 외부 시스템과 상호작용할 수 있습니다.

- **도구 선택** (`LLMCapability.ToolChoice`): LLM에서 도구 호출이 작동하는 방식을 구성합니다. 모델에 따라 다음과 같이 구성할 수 있습니다:
    - 텍스트 생성과 도구 호출 중 자동으로 선택
    - 텍스트 없이 도구 호출만 생성
    - 도구 호출 없이 텍스트만 생성
    - 정의된 도구 중 특정 도구를 강제로 호출

- **다중 선택** (`LLMCapability.MultipleChoices`): 모델이 단일 프롬프트에 대해 여러 개의 독립적인 응답 선택지를 생성하도록 합니다.

### 미디어 처리 기능 (Media processing capabilities)

다음 목록은 이미지나 오디오와 같은 미디어 콘텐츠를 처리하기 위한 기능 세트를 나타냅니다:

- **비전** (`LLMCapability.Vision`): 시각적 데이터로부터 통찰력을 처리, 분석 및 추론하는 비전 기반 기능을 위한 클래스입니다.
  다음과 같은 유형의 시각적 데이터를 지원합니다:
    - **이미지** (`LLMCapability.Vision.Image`): 이미지 분석, 인식 및 해석과 같은 이미지 관련 비전 작업을 처리합니다.
    - **비디오** (`LLMCapability.Vision.Video`): 비디오 콘텐츠 분석 및 이해를 포함한 비디오 데이터를 처리합니다.

- **오디오** (`LLMCapability.Audio`): 전사(transcription), 오디오 생성 또는 오디오 기반 상호작용과 같은 오디오 관련 기능을 제공합니다.

- **문서** (`LLMCapability.Document`): 문서 기반 입력 및 출력의 처리 및 핸들링을 가능하게 합니다.

### 텍스트 처리 기능 (Text processing capabilities)

다음 기능 목록은 텍스트 생성 및 처리 기능을 나타냅니다:

- **임베딩** (`LLMCapability.Embed`): 모델이 입력 텍스트에서 벡터 임베딩을 생성할 수 있도록 하여 유사도 비교, 클러스터링 및 기타 벡터 기반 분석을 가능하게 합니다.

- **컴플리션** (`LLMCapability.Completion`): 문장 완성, 제안 생성 또는 입력 데이터와 일치하는 콘텐츠 생성과 같이 주어진 입력 컨텍스트를 기반으로 텍스트 또는 콘텐츠를 생성하는 것을 포함합니다.

- **프롬프트 캐싱** (`LLMCapability.PromptCaching`): 프롬프트에 대한 캐싱 기능을 지원하여 반복되거나 유사한 쿼리에 대한 성능을 잠재적으로 향상시킵니다.

- **모더레이션** (`LLMCapability.Moderation`): 모델이 잠재적으로 유해한 콘텐츠에 대해 텍스트를 분석하고 괴롭힘, 혐오 표현, 자해, 성적 콘텐츠, 폭력 등과 같은 다양한 카테고리에 따라 분류할 수 있도록 합니다.

### 스키마 기능 (Schema capabilities)

아래 목록은 구조화된 데이터 처리와 관련된 기능을 나타냅니다:

- **스키마** (`LLMCapability.Schema`): 특정 형식을 사용한 데이터 상호작용 및 인코딩과 관련된 구조화된 스키마 기능을 위한 클래스입니다.
  다음 형식에 대한 지원을 포함합니다:
    - **JSON** (`LLMCapability.Schema.JSON`): 다음과 같은 서로 다른 수준의 JSON 스키마 지원:
        - **기본** (`LLMCapability.Schema.JSON.Basic`): 경량화되거나 기본적인 JSON 처리 기능을 제공합니다.
        - **표준** (`LLMCapability.Schema.JSON.Standard`): 복잡한 데이터 구조에 대한 포괄적인 JSON 스키마 지원을 제공합니다.

## 모델(LLModel) 구성 생성하기

범용적이고 제공자 독립적인 방식으로 모델을 정의하려면, 다음 파라미터를 사용하여 `LLModel` 클래스의 인스턴스로 모델 구성을 생성하십시오:

| 이름 | 데이터 타입 | 필수 여부 | 기본값 | 설명 |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | 예 |         | Google 또는 OpenAI와 같은 LLM 제공자입니다. 이는 모델을 생성하거나 호스팅하는 회사 또는 조직을 식별합니다. |
| `id`              | String                    | 예 |         | LLM 인스턴스의 고유 식별자입니다. 이는 일반적으로 특정 모델 버전이나 이름을 나타냅니다. 예를 들어, `gpt-4-turbo`, `claude-3-opus`, `llama-3-2`. |
| `capabilities`    | List&lt;LLMCapability&gt; | 예 |         | 온도 조절, 도구 사용 또는 스키마 기반 작업과 같이 LLM에서 지원하는 기능 리스트입니다. 이 기능들은 모델이 무엇을 할 수 있고 어떻게 구성될 수 있는지 정의합니다. |
| `contextLength`   | Long                      | 예 |         | LLM의 컨텍스트 길이입니다. 이는 LLM이 처리할 수 있는 최대 토큰 수입니다. |
| `maxOutputTokens` | Long                      | 아니요 | `null`  | 해당 LLM에 대해 제공자가 생성할 수 있는 최대 토큰 수입니다. |

### 예제

이 섹션에서는 다양한 기능을 가진 `LLModel` 인스턴스를 생성하는 자세한 예제를 제공합니다.

아래 코드는 핵심 기능을 갖춘 기본 LLM 구성을 나타냅니다:

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

아래 모델 구성은 비전 기능을 갖춘 멀티모달 LLM입니다:

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

오디오 처리 기능을 갖춘 LLM입니다:

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

모델을 `LLModel` 인스턴스로 직접 생성하고 모든 관련 파라미터를 지정해야 하는 것 외에도, Koog에는 지원되는 기능이 포함된 미리 정의된 모델 및 구성 모음이 포함되어 있습니다.
미리 정의된 Ollama 모델을 사용하려면 다음과 같이 지정하십시오:

<!--- INCLUDE
import ai.koog.prompt.executor.ollama.client.OllamaModels

-->

```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```

<!--- KNIT example-model-capabilities-04.kt -->

모델이 특정 기능을 지원하는지 확인하려면 `contains` 메서드를 사용하여 `capabilities` 리스트에 해당 기능이 있는지 확인하십시오:

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.executor.ollama.client.OllamaModels

val basicModel = OllamaModels.Meta.LLAMA_3_2
val visionModel = OllamaModels.Meta.LLAMA_3_2

-->

```kotlin
// 모델이 특정 기능을 지원하는지 확인
val supportsTools = basicModel.supports(LLMCapability.Tools) // true
val supportsVideo = visionModel.supports(LLMCapability.Vision.Video) // false

// 스키마 기능 확인
val jsonCapability = basicModel.capabilities?.filterIsInstance<LLMCapability.Schema.JSON>()?.firstOrNull()
val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
```

<!--- KNIT example-model-capabilities-05.kt -->

### 모델별 LLM 기능

이 참조표는 각 제공자의 모델별로 어떤 LLM 기능이 지원되는지 보여줍니다.

아래 표에서:

- `✓`는 모델이 해당 기능을 지원함을 나타냅니다.
- `-`는 모델이 해당 기능을 지원하지 않음을 나타냅니다.
- JSON 스키마의 경우, `Full` 또는 `Simple`은 모델이 지원하는 JSON 스키마 기능의 변종을 나타냅니다.

??? "Google 모델"
    #### Google 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 컴플리션 | 다중 선택 | 도구 | 도구 선택 | 비전 (이미지) | 비전 (비디오) | 오디오 |
    |------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|
    | Gemini2_5Pro           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash001      | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite001  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |

??? "OpenAI 모델"
    #### OpenAI 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 컴플리션 | 다중 선택 | 도구 | 도구 선택 | 비전 (이미지) | 비전 (비디오) | 오디오 | 스펙큘레이션 | 모더레이션 |
    |--------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|-------------|------------|
    | Reasoning.O4Mini         | -           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Reasoning.O3Mini         | -           | Full        | ✓          | ✓                | ✓     | ✓           | -              | -              | -     | ✓           | -          |
    | Reasoning.O3             | -           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Reasoning.O1             | -           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Chat.GPT4o               | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Chat.GPT4_1              | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Chat.GPT5                | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Chat.GPT5Mini            | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Chat.GPT5Nano            | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Audio.GptAudio           | ✓           | -           | ✓          | -                | ✓     | ✓           | -              | -              | ✓     | -           | -          |
    | Audio.GPT4oMiniAudio     | ✓           | -           | ✓          | -                | ✓     | ✓           | -              | -              | ✓     | -           | -          |
    | Audio.GPT4oAudio         | ✓           | -           | ✓          | -                | ✓     | ✓           | -              | -              | ✓     | -           | -          |
    | CostOptimized.GPT4_1Nano | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | CostOptimized.GPT4_1Mini | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | CostOptimized.GPT4oMini  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | -              | -     | ✓           | -          |
    | Moderation.Omni          | -           | -           | -          | -                | -     | -           | ✓              | -              | -     | -           | ✓          |

??? "Anthropic 모델"
    #### Anthropic 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 컴플리션 | 도구 | 도구 선택 | 비전 (이미지) |
    |------------|-------------|-------------|------------|-------|-------------|----------------|
    | Opus_4_6   | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Opus_4_5   | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Opus_4_1   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Opus_4     | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4_6 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4_5 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Haiku_4_5  | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Haiku_3    | ✓           | -           | ✓          | ✓     | ✓           | ✓              |

??? "Ollama 모델"
    #### Ollama 모델

    ##### Meta 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 도구 | 모더레이션 |
    |---------------|-------------|-------------|-------|------------|
    | LLAMA_3_2_3B  | ✓           | Simple      | ✓     | -          |
    | LLAMA_3_2     | ✓           | Simple      | ✓     | -          |
    | LLAMA_4       | ✓           | Simple      | ✓     | -          |
    | LLAMA_GUARD_3 | -           | -           | -     | ✓          |

    ##### Alibaba 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 도구 |
    |--------------------|-------------|-------------|-------|
    | QWEN_2_5_05B       | ✓           | Simple      | ✓     |
    | QWEN_3_06B         | ✓           | Simple      | ✓     |
    | QWQ                | ✓           | Simple      | ✓     |
    | QWEN_CODER_2_5_32B | ✓           | Simple      | ✓     |

    ##### Groq 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 도구 |
    |---------------------------|-------------|-------------|-------|
    | LLAMA_3_GROK_TOOL_USE_8B  | ✓           | Full        | ✓     |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓           | Full        | ✓     |

    ##### Granite 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 도구 | 비전 (이미지) |
    |--------------------|-------------|-------------|-------|----------------|
    | GRANITE_3_2_VISION | ✓           | Simple      | ✓     | ✓              |

??? "DeepSeek 모델"
    #### DeepSeek 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 컴플리션 | 스펙큘레이션 | 도구 | 도구 선택 | 비전 (이미지) |
    |------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | DeepSeekChat     | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |
    | DeepSeekReasoner | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |

??? "OpenRouter 모델"
    #### OpenRouter 모델

    | 모델 | 온도(Temperature) | JSON 스키마 | 컴플리션 | 스펙큘레이션 | 도구 | 도구 선택 | 비전 (이미지) |
    |---------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | Phi4Reasoning       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Claude3Opus         | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3Sonnet       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3Haiku        | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3_5Sonnet     | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3_7Sonnet     | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude4Sonnet       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude4_1Opus       | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | GPT4oMini           | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | GPT5                | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | GPT5Mini            | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | GPT5Nano            | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | GPT_OSS_120b        | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | GPT4                | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | GPT4o               | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | GPT4Turbo           | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | GPT35Turbo          | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Llama3              | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Llama3Instruct      | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Mistral7B           | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Mixtral8x7B         | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Claude3VisionSonnet | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3VisionOpus   | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Claude3VisionHaiku  | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | DeepSeekV30324      | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | -              |
    | Gemini2_5FlashLite  | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Gemini2_5Flash      | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |
    | Gemini2_5Pro        | ✓           | Full        | ✓          | ✓           | ✓     | ✓           | ✓              |