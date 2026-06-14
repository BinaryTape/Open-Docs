Koog 提供了一套抽象和实现，用于以不依赖供应商的方式处理来自各种大型语言模型 (LLM) 供应商的 LLM。该套件包含以下类：

- **LLMCapability**：一个类层次结构，定义了 LLM 可以支持的各种功能，例如：
    - 温度调节 (Temperature adjustment)，用于控制响应的随机性
    - 工具集成 (Tool integration)，用于与外部系统交互
    - 视觉处理 (Vision processing)，用于处理视觉数据
    - 嵌入生成 (Embedding generation)，用于向量表示
    - 补全 (Completion)，用于文本生成任务
    - 架构支持 (Schema support)，用于结构化数据（包含基础 (Simple) 和完整 (Full) 变体的 JSON）
    - 推测 (Speculation)，用于探索性响应

- **LLModel**：一个数据类，表示特定的 LLM 及其供应商、唯一标识符和支持的功能。

这为以统一方式与不同 LLM 供应商进行交互奠定了基础，允许应用程序在屏蔽供应商特定细节的同时使用各种模型。

## LLM 功能

LLM 功能代表了大型语言模型可以支持的特定特性或功能。在 Koog 框架中，功能用于定义特定模型可以执行的操作以及如何对其进行配置。每种功能都表示为 `LLMCapability` 类的子类或数据对象。

在为应用程序配置要使用的 LLM 时，您可以在创建 `LLModel` 实例时将模型支持的功能添加到 `capabilities` 列表中。这使框架能够正确地与模型交互并适当地使用其特性。

### 核心功能

下面的列表包含了 Koog 框架中模型可用的核心、LLM 特有功能：

- **推测** (`LLMCapability.Speculation`)：允许模型以不同程度的可能性生成推测性或探索性响应。适用于需要更广泛潜在结果的创意或假设场景。

- **温度** (`LLMCapability.Temperature`)：允许调节模型的响应随机性或创造力水平。较高的温度值会产生更多样化的输出，而较低的值会产生更集中且确定性的响应。

- **工具** (`LLMCapability.Tools`)：表示支持外部工具的使用或集成。此功能允许模型运行特定的工具或与外部系统交互。

- **工具选择** (`LLMCapability.ToolChoice`)：配置工具调用如何与 LLM 配合工作。根据模型的不同，可以将其配置为：
    - 在生成文本或工具调用之间自动选择
    - 仅生成工具调用，从不生成文本
    - 仅生成文本，从不生成工具调用
    - 强制调用定义的工具中的特定工具

- **多个选项** (`LLMCapability.MultipleChoices`)：允许模型针对单个提示词生成多个独立的回复选项。

### 媒体处理功能

以下列表代表了一套用于处理图像或音频等媒体内容的功能：

- **视觉** (`LLMCapability.Vision`)：一个用于基于视觉的功能的类，用于处理、分析并从视觉数据中推断见解。
  支持以下类型的视觉数据：
    - **图像** (`LLMCapability.Vision.Image`)：处理图像相关的视觉任务，如图像分析、识别和解读。
    - **视频** (`LLMCapability.Vision.Video`)：处理视频数据，包括分析和理解视频内容。

- **音频** (`LLMCapability.Audio`)：提供音频相关的功能，如转录、音频生成或基于音频的交互。

- **文档** (`LLMCapability.Document`)：支持处理基于文档的输入和输出。

### 文本处理功能

以下功能列表代表了文本生成和处理功能：

- **嵌入** (`LLMCapability.Embed`)：允许模型从输入文本生成向量嵌入，从而实现相似性比较、聚类和其他基于向量的分析。

- **补全** (`LLMCapability.Completion`)：包括根据给定的输入上下文生成文本或内容，例如补全句子、生成建议或生成与输入数据一致的内容。

- **提示词缓存** (`LLMCapability.PromptCaching`)：支持提示词的缓存功能，可能提高重复或相似查询的性能。

- **审核** (`LLMCapability.Moderation`)：允许模型分析文本中潜在的有害内容，并根据各种类别（如骚扰、仇恨言论、自残、性内容、暴力等）对其进行分类。

### 架构功能

下面的列表说明了与处理结构化数据相关的功能：

- **架构** (`LLMCapability.Schema`)：一个用于结构化架构功能的类，涉及使用特定格式的数据交互和编码。
  包括对以下格式的支持：
    - **JSON** (`LLMCapability.Schema.JSON`)：不同级别的 JSON 架构支持：
        - **基础** (`LLMCapability.Schema.JSON.Basic`)：提供轻量级或基础的 JSON 处理功能。
        - **标准** (`LLMCapability.Schema.JSON.Standard`)：为复杂数据结构提供全面的 JSON 架构支持。

## 创建模型 (LLModel) 配置

要以通用的、不依赖供应商的方式定义模型，请使用以下参数创建一个 `LLModel` 类的实例作为模型配置：

| 名称 | 数据类型 | 必选 | 默认 | 描述 |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider` | LLMProvider | 是 | | LLM 供应商，例如 Google 或 OpenAI。这标识了创建或托管模型的公司或组织。 |
| `id` | String | 是 | | LLM 实例的唯一标识符。这通常表示特定的模型版本或名称。例如，`gpt-4-turbo`、`claude-3-opus`、`llama-3-2`。 |
| `capabilities` | List&lt;LLMCapability&gt; | 是 | | LLM 支持的功能列表，例如温度调节、工具使用或基于架构的任务。这些功能定义了模型可以执行的操作以及如何对其进行配置。 |
| `contextLength` | Long | 是 | | LLM 的上下文长度。这是 LLM 可以处理的最大令牌数量。 |
| `maxOutputTokens` | Long | 否 | `null` | 供应商可为 LLM 生成的最大令牌数量。 |

### 示例

本节提供了创建具有不同功能的 `LLModel` 实例的详细示例。

下面的代码表示一个具有核心功能的底层 LLM 配置：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability;
    import ai.koog.prompt.llm.LLMProvider;
    import ai.koog.prompt.llm.LLModel;
    import java.util.List;

    class ExampleModelCapabilities01 {
    -->
    ```java
    LLModel basicModel = new LLModel(
        LLMProvider.OpenAI,
        "gpt-4-turbo",
        List.of(
            LLMCapability.Temperature.INSTANCE,
            LLMCapability.Tools.INSTANCE,
            LLMCapability.Schema.JSON.Standard.INSTANCE
        ),
        128_000L
    );
    ```
    <!--- SUFFIX
    }
    -->
    <!--- KNIT example-model-capabilities-java-01.java -->

下面的模型配置是一个具有视觉功能的多模态 LLM：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability;
    import ai.koog.prompt.llm.LLMProvider;
    import ai.koog.prompt.llm.LLModel;
    import java.util.List;

    class ExampleModelCapabilities02 {
    -->
    ```java
    LLModel visionModel = new LLModel(
        LLMProvider.OpenAI,
        "gpt-4-vision",
        List.of(
            LLMCapability.Temperature.INSTANCE,
            LLMCapability.Vision.Image.INSTANCE,
            LLMCapability.MultipleChoices.INSTANCE
        ),
        1_047_576L,
        32_768L
    );
    ```
    <!--- SUFFIX
    }
    -->
    <!--- KNIT example-model-capabilities-java-02.java -->

一个具有音频处理功能的 LLM：

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability;
    import ai.koog.prompt.llm.LLMProvider;
    import ai.koog.prompt.llm.LLModel;
    import java.util.List;

    class ExampleModelCapabilities03 {
    -->
    ```java
    LLModel audioModel = new LLModel(
        LLMProvider.Anthropic,
        "claude-3-opus",
        List.of(
            LLMCapability.Audio.INSTANCE,
            LLMCapability.Temperature.INSTANCE,
            LLMCapability.PromptCaching.INSTANCE
        ),
        200_000L
    );
    ```
    <!--- SUFFIX
    }
    -->
    <!--- KNIT example-model-capabilities-java-03.java -->

除了通过 `LLModel` 实例创建模型并必须指定所有相关参数外，Koog 还包含一系列预定义模型及其支持功能的配置。
要使用预定义的 Ollama 模型，请按如下方式指定：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.executor.ollama.client.OllamaModels

    -->
    ```kotlin
    val metaModel = OllamaModels.Meta.LLAMA_3_2
    ```
    <!--- KNIT example-model-capabilities-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import ai.koog.prompt.llm.LLModel;

    class ExampleModelCapabilities04 {
    -->
    ```java
    LLModel metaModel = OllamaModels.Meta.LLAMA_3_2;
    ```
    <!--- SUFFIX
    }
    -->
    <!--- KNIT example-model-capabilities-java-04.java -->

要检查模型是否支持特定功能，请使用 `contains` 方法检查 `capabilities` 列表中是否存在该功能：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability
    import ai.koog.prompt.executor.ollama.client.OllamaModels

    val basicModel = OllamaModels.Meta.LLAMA_3_2
    val visionModel = OllamaModels.Meta.LLAMA_3_2

    -->
    ```kotlin
    // 检查模型是否支持特定功能
    val supportsTools = basicModel.supports(LLMCapability.Tools) // true
    val supportsVideo = visionModel.supports(LLMCapability.Vision.Video) // false

    // 检查架构功能
    val jsonCapability = basicModel.capabilities?.filterIsInstance<LLMCapability.Schema.JSON>()?.firstOrNull()
    val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
    ```
    <!--- KNIT example-model-capabilities-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability;
    import ai.koog.prompt.llm.LLModel;
    import ai.koog.prompt.executor.ollama.client.OllamaModels;
    import java.util.Objects;

    class ExampleModelCapabilities05 {

    LLModel basicModel = OllamaModels.Meta.LLAMA_3_2;
    LLModel visionModel = OllamaModels.Meta.LLAMA_3_2;
    -->
    ```java
    // 检查模型是否支持特定功能
    boolean supportsTools = basicModel.supports(LLMCapability.Tools.INSTANCE); // true
    boolean supportsVideo = visionModel.supports(LLMCapability.Vision.Video.INSTANCE); // false

    // 检查架构功能
    LLMCapability jsonCapability = basicModel.getCapabilities().stream()
        .filter(c -> c instanceof LLMCapability.Schema.JSON)
        .map(c -> (LLMCapability.Schema.JSON) c)
        .findFirst()
        .orElse(null);
    boolean hasFullJsonSupport = jsonCapability instanceof LLMCapability.Schema.JSON.Standard; // true
    ```
    <!--- SUFFIX
    }
    -->
    <!--- KNIT example-model-capabilities-java-05.java -->

### 各模型的 LLM 功能

本参考展示了不同供应商的每个模型支持哪些 LLM 功能。

在下表中：

- `✓` 表示模型支持该功能
- `-` 表示模型不支持该功能
- 对于 JSON 架构 (JSON Schema)，`Full` (完整) 或 `Simple` (简单) 表示模型支持哪种 JSON 架构功能变体

??? "Google 模型"
    #### Google 模型

    | 模型 | 温度 | JSON 架构 | 补全 | 多个选项 | 工具 | 工具选择 | 视觉（图像） | 视觉（视频） | 音频 |
    |------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|
    | Gemini2_5Pro           | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_5FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash         | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0Flash001      | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite     | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |
    | Gemini2_0FlashLite001  | ✓           | Full        | ✓          | ✓                | ✓     | ✓           | ✓              | ✓              | ✓     |

??? "OpenAI 模型"
    #### OpenAI 模型

    | 模型 | 温度 | JSON 架构 | 补全 | 多个选项 | 工具 | 工具选择 | 视觉（图像） | 视觉（视频） | 音频 | 推测 | 审核 |
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

??? "Anthropic 模型"
    #### Anthropic 模型

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） |
    |------------|-------------|-------------|------------|-------|-------------|----------------|
    | Fable_5    | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Opus_4_6   | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Opus_4_5   | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Opus_4_1   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Opus_4     | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4_6 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4_5 | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Sonnet_4   | ✓           | -           | ✓          | ✓     | ✓           | ✓              |
    | Haiku_4_5  | ✓           | Full        | ✓          | ✓     | ✓           | ✓              |
    | Haiku_3    | ✓           | -           | ✓          | ✓     | ✓           | ✓              |

??? "Ollama 模型"
    #### Ollama 模型

    ##### Meta 模型

    | 模型 | 温度 | JSON 架构 | 工具 | 审核 |
    |---------------|-------------|-------------|-------|------------|
    | LLAMA_3_2_3B  | ✓           | Simple      | ✓     | -          |
    | LLAMA_3_2     | ✓           | Simple      | ✓     | -          |
    | LLAMA_4       | ✓           | Simple      | ✓     | -          |
    | LLAMA_GUARD_3 | -           | -           | -     | ✓          |

    ##### Alibaba 模型

    | 模型 | 温度 | JSON 架构 | 工具 |
    |--------------------|-------------|-------------|-------|
    | QWEN_2_5_05B       | ✓           | Simple      | ✓     |
    | QWEN_3_06B         | ✓           | Simple      | ✓     |
    | QWQ                | ✓           | Simple      | ✓     |
    | QWEN_CODER_2_5_32B | ✓           | Simple      | ✓     |

    ##### Groq 模型

    | 模型 | 温度 | JSON 架构 | 工具 |
    |---------------------------|-------------|-------------|-------|
    | LLAMA_3_GROK_TOOL_USE_8B  | ✓           | Full        | ✓     |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓           | Full        | ✓     |

    ##### Granite 模型

    | 模型 | 温度 | JSON 架构 | 工具 | 视觉（图像） |
    |--------------------|-------------|-------------|-------|----------------|
    | GRANITE_3_2_VISION | ✓           | Simple      | ✓     | ✓              |

??? "DeepSeek 模型"
    #### DeepSeek 模型

    | 模型 | 温度 | JSON 架构 | 补全 | 推测 | 工具 | 工具选择 | 视觉（图像） |
    |------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | DeepSeekChat     | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |
    | DeepSeekReasoner | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |

??? "OpenRouter 模型"
    #### OpenRouter 模型

    | 模型 | 温度 | JSON 架构 | 补全 | 推测 | 工具 | 工具选择 | 视觉（图像） |
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

??? "Bedrock 模型"
    #### Bedrock 模型

    Bedrock 模型通过 AWS Bedrock 访问，并使用 InvokeModel 或 Converse API。
    标记为 **(C)** 的模型仅支持 Converse，且需要 `BedrockAPIMethod.Converse`。

    ##### Anthropic Claude (通过 Bedrock)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |-----------------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | AnthropicClaudeFable5       | ✓           | Full        | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude47Opus       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude46Opus       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude45Opus       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude41Opus       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude4Opus        | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude4_6Sonnet    | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude4_5Sonnet    | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude4Sonnet      | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude4_5Haiku     | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | AnthropicClaude3Haiku       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |

    ##### Amazon Nova

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | AmazonNovaMicro  | ✓           | -           | ✓          | ✓     | -           | -              | -        |
    | AmazonNovaLite   | ✓           | -           | ✓          | ✓     | -           | -              | -        |
    | AmazonNovaPro    | ✓           | -           | ✓          | ✓     | -           | -              | -        |
    | AmazonNovaPremier| ✓           | -           | ✓          | ✓     | -           | -              | -        |

    ##### Meta Llama (通过 Bedrock)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |--------------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | MetaLlama3_3_70BInstruct | ✓           | -           | ✓          | ✓     | ✓           | -              | -        |
    | MetaLlama3_2_90BInstruct | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | MetaLlama3_2_11BInstruct | ✓           | -           | ✓          | ✓     | ✓           | ✓              | ✓        |
    | MetaLlama3_2_3BInstruct  | ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_2_1BInstruct  | ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_1_405BInstruct| ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_1_70BInstruct | ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_1_8BInstruct  | ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_0_70BInstruct | ✓           | -           | ✓          | -     | -           | -              | -        |
    | MetaLlama3_0_8BInstruct  | ✓           | -           | ✓          | -     | -           | -              | -        |

    ##### Moonshot Kimi (仅限 Converse)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |--------------------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | MoonshotKimiK2_5 **(C)**       | ✓           | -           | ✓          | ✓     | ✓           | ✓              | -        |
    | MoonshotKimiK2Thinking **(C)** | ✓           | -           | ✓          | ✓     | ✓           | -              | -        |

    ##### MiniMax (仅限 Converse)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |---------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | MiniMaxM2_5 **(C)** | ✓           | -           | ✓          | ✓     | ✓           | -              | -        |

    ##### OpenAI GPT-OSS (仅限 Converse)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |--------------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | OpenAIGptOss120B **(C)** | ✓           | Full        | ✓          | ✓     | ✓           | -              | -        |
    | OpenAIGptOss20B **(C)**  | ✓           | Full        | ✓          | ✓     | ✓           | -              | -        |

    ##### Google Gemma 3 (仅限 Converse)

    | 模型 | 温度 | JSON 架构 | 补全 | 工具 | 工具选择 | 视觉（图像） | 文档 |
    |----------------------------|-------------|-------------|------------|-------|-------------|----------------|----------|
    | GoogleGemma3_27BIt **(C)** | ✓           | Full        | ✓          | ✓     | ✓           | ✓              | ✓        |
    | GoogleGemma3_12BIt **(C)** | ✓           | Full        | ✓          | ✓     | ✓           | ✓              | ✓        |
    | GoogleGemma3_4BIt **(C)**  | ✓           | -           | ✓          | ✓     | ✓           | ✓              | -        |

    ##### 嵌入模型

    | 模型 | 嵌入 |
    |----------------------------|-------|
    | CohereEmbedV4              | ✓     |
    | CohereEmbedEnglishV3       | ✓     |
    | CohereEmbedMultilingualV3  | ✓     |
    | AmazonTitanEmbedTextV2     | ✓     |
    | AmazonTitanEmbedText       | ✓     |