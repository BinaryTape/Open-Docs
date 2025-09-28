Koog 提供了一套抽象和实现，用于以独立于提供商的方式处理来自各种 LLM 提供商的大型语言模型 (LLM)。其中包括以下类：

- **LLMCapability**：一个类层次结构，定义了 LLM 可支持的各种能力，例如：
    - 用于控制响应随机性的温度调整
    - 用于外部系统交互的工具集成
    - 用于处理视觉数据的视觉处理
    - 用于向量表示的嵌入生成
    - 用于文本生成任务的补全
    - 用于结构化数据的 Schema 支持（带 Simple 和 Full 变体的 JSON）
    - 用于探索性响应的推测

- **LLModel**：一个数据类，表示具有其提供商、唯一标识符和支持能力的特定 LLM。

这为以统一方式与不同 LLM 提供商进行交互奠定了基础，允许应用程序处理各种模型，同时抽象出提供商特有的细节。

## LLM 能力

LLM 能力表示大型语言模型可以支持的特定特性或功能。在 Koog 框架中，能力用于定义特定模型可以做什么以及如何配置它。每种能力都表示为 `LLMCapability` 类的子类或数据对象。

在您的应用程序中配置 LLM 以供使用时，您通过在创建 `LLModel` 实例时将它们添加到 `capabilities` list 中来指定它支持哪些能力。这允许框架正确地与模型交互并适当地使用其特性。

### 核心能力

下面的列表包含了 Koog 框架中模型可用的核心、LLM 特有的能力：

- **推测** (`LLMCapability.Speculation`)：让模型生成具有不同可能性程度的推测性或探索性响应。适用于需要更广泛潜在结果的创造性或假设场景。

- **温度** (`LLMCapability.Temperature`)：允许调整模型的响应随机性或创造力水平。较高的温度值会产生更多样化的输出，而较低的值会导致更专注和确定性的响应。

- **工具** (`LLMCapability.Tools`)：表示支持外部工具使用或集成。此能力让模型运行特定工具或与外部系统交互。

- **工具选择** (`LLMCapability.ToolChoice`)：配置工具调用如何与 LLM 协同工作。根据模型，它可以配置为：
    - 自动选择生成文本或工具调用
    - 仅生成工具调用，从不生成文本
    - 仅生成文本，从不生成工具调用
    - 强制调用已定义工具中的特定工具

- **多项选择** (`LLMCapability.MultipleChoices`)：让模型为单个提示生成多个独立的回复选择。

### 媒体处理能力

以下列表表示用于处理图像或音频等媒体内容的一组能力：

- **视觉** (`LLMCapability.Vision`)：一个用于基于视觉的能力的类，可处理、分析和推断视觉数据中的洞察。
支持以下类型的视觉数据：
    - **图像** (`LLMCapability.Vision.Image`)：处理图像相关的视觉任务，例如图像分析、识别和解释。
    - **视频** (`LLMCapability.Vision.Video`)：处理视频数据，包括分析和理解视频内容。

- **音频** (`LLMCapability.Audio`)：提供与音频相关的功能，例如转录、音频生成或基于音频的交互。

- **文档** (`LLMCapability.Document`)：启用对基于文档的输入和输出的处理。

### 文本处理能力

以下能力列表表示文本生成和处理功能：

- **嵌入** (`LLMCapability.Embed`)：让模型从输入文本生成向量嵌入，从而实现相似度比较、聚类及其他基于向量的分析。

- **补全** (`LLMCapability.Completion`)：包括根据给定输入上下文生成文本或内容，例如补全句子、生成建议或生成与输入数据一致的内容。

- **提示缓存** (`LLMCapability.PromptCaching`)：支持提示的缓存功能，潜在地提高重复或相似查询的性能。

- **内容审核** (`LLMCapability.Moderation`)：让模型分析文本中潜在有害内容，并根据骚扰、仇恨言论、自残、色情内容、暴力等各种类别进行分类。

### Schema 能力

下面的列表指示与处理结构化数据相关的能力：

- **Schema** (`LLMCapability.Schema`)：一个用于结构化 Schema 能力的类，与使用特定格式进行数据交互和编码相关。
包括对以下格式的支持：
    - **JSON** (`LLMCapability.Schema.JSON`)：JSON Schema 支持，具有不同级别：
        - **基础** (`LLMCapability.Schema.JSON.Basic`)：提供轻量级或基础的 JSON 处理能力。
        - **标准** (`LLMCapability.Schema.JSON.Standard`)：提供全面的 JSON Schema 支持，适用于复杂数据结构。

## 创建模型 (LLModel) 配置

为了以通用、与提供商无关的方式定义模型，请创建 `LLModel` 类实例作为模型配置，并使用以下参数：

| 名称              | 数据类型                 | 必需 | 默认值 | 描述                                                                                                                                                                                    |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | Yes      |         | LLM 提供商，例如 Google 或 OpenAI。这标识了创建或托管模型的公司或组织。                                                                                                                              |
| `id`              | String                    | Yes      |         | LLM 实例的唯一标识符。这通常表示特定的模型版本或名称。例如，`gpt-4-turbo`、`claude-3-opus`、`llama-3-2`。                              |
| `capabilities`    | List&lt;LLMCapability&gt; | Yes      |         | LLM 支持的能力列表，例如温度调整、工具使用或基于 Schema 的任务。这些能力定义了模型可以做什么以及如何配置它。 |
| `contextLength`   | Long                      | Yes      |         | LLM 的上下文长度。这是 LLM 可处理的最大 token 数量。                                                                                                       |
| `maxOutputTokens` | Long                      | No       | `null`  | 提供商可为 LLM 生成的最大 token 数量。                                                                                                                |

### 示例

本节提供了使用不同能力创建 `LLModel` 实例的详细示例。

以下代码表示具有核心能力的基础 LLM 配置：

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

以下模型配置是一个具有视觉能力的多模态 LLM：

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

一个具有音频处理能力的 LLM：

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

除了创建 `LLModel` 实例并指定所有相关参数之外，Koog 还包含一个预定义模型及其配置（包含支持的能力）的集合。
要使用预定义的 Ollama 模型，请按如下方式指定：

<!--- INCLUDE
import ai.koog.prompt.llm.OllamaModels

-->

```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```

<!--- KNIT example-model-capabilities-04.kt -->

要检测模型是否支持特定能力，请使用 `contains` 方法检测 `capabilities` list 中是否存在该能力：

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.OllamaModels

val basicModel = OllamaModels.Meta.LLAMA_3_2
val visionModel = OllamaModels.Meta.LLAMA_3_2

-->

```kotlin
// 检测模型是否支持特定能力
val supportsTools = basicModel.capabilities.contains(LLMCapability.Tools) // true
val supportsVideo = visionModel.capabilities.contains(LLMCapability.Vision.Video) // false

// 检测 Schema 能力
val jsonCapability = basicModel.capabilities.filterIsInstance<LLMCapability.Schema.JSON>().firstOrNull()
val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
```

<!--- KNIT example-model-capabilities-05.kt -->

### 按模型划分的 LLM 能力

此参考显示了不同提供商的每个模型支持哪些 LLM 能力。

在下表中：

- `✓` 表示模型支持该能力
- `-` 表示模型不支持该能力
- 对于 JSON Schema，`Full` 或 `Simple` 表示模型支持哪种 JSON Schema 能力变体

??? "Google models"
    #### Google models

    | Model                  | Temperature | JSON Schema | Completion | Multiple Choices | Tools | Tool Choice | Vision (Image) | Vision (Video) | Audio |
    |------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|
    | Gemini2_5Pro           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash001      | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite001  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |

??? "OpenAI models"
    #### OpenAI models

    | Model                    | Temperature | JSON Schema | Completion | Multiple Choices | Tools | Tool Choice | Vision (Image) | Vision (Video) | Audio | Speculation | Moderation |
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

??? "Anthropic models"
    #### Anthropic models

    | Model      | Temperature | JSON Schema | Completion | Tools | Tool Choice | Vision (Image) |
    |------------|-------------|-------------|------------|-------|-------------|----------------|
    | Opus_4_1   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Opus_4     | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_3_7 | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Haiku_3_5  | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_3_5 | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Haiku_3    | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Opus_3     | ✓           | -           | ✓          | ✓     | ✓           | ✓              |

??? "Ollama models"
    #### Ollama models

    ##### Meta models

    | Model         | Temperature | JSON Schema | Tools | Moderation |
    |---------------|-------------|-------------|-------|------------|
    | LLAMA_3_2_3B  | ✓           | Simple      | ✓     | -          |
    | LLAMA_3_2     | ✓           | Simple      | ✓     | -          |
    | LLAMA_4       | ✓           | Simple      | ✓     | -          |
    | LLAMA_GUARD_3 | -           | -           | -     | ✓          |

    ##### Alibaba models

    | Model              | Temperature | JSON Schema | Tools |
    |--------------------|-------------|-------------|-------|
    | QWEN_2_5_05B       | ✓           | Simple      | ✓     |
    | QWEN_3_06B         | ✓           | Simple      | ✓     |
    | QWQ                | ✓           | Simple      | ✓     |
    | QWEN_CODER_2_5_32B | ✓           | Simple      | ✓     |

    ##### Groq models

    | Model                     | Temperature | JSON Schema | Tools |
    |---------------------------|-------------|-------------|-------|
    | LLAMA_3_GROK_TOOL_USE_8B  | ✓           | Full        | ✓     |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓           | Full        | ✓     |

    ##### Granite models

    | Model              | Temperature | JSON Schema | Tools | Vision (Image) |
    |--------------------|-------------|-------------|-------|----------------|
    | GRANITE_3_2_VISION | ✓           | Simple      | ✓     | ✓              |

??? "DeepSeek models"
    #### DeepSeek models

    | Model            | Temperature | JSON Schema | Completion | Speculation | Tools | Tool Choice | Vision (Image) |
    |------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | DeepSeekChat     | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |
    | DeepSeekReasoner | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |

??? "OpenRouter models"
    #### OpenRouter models

    | Model               | Temperature | JSON Schema | Completion | Speculation | Tools | Tool Choice | Vision (Image) |
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