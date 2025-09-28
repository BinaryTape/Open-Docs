Koog 提供了一組抽象和實作，用於以供應商無關 (provider-agnostic) 的方式使用來自各種大型語言模型 (LLMs) 供應商的模型。這組類別包含以下內容：

-   **LLMCapability**: 一個類別層次結構，定義了 LLMs 可以支援的各種功能，例如：
    -   用於控制回應隨機性的溫度調整
    -   用於外部系統互動的工具整合
    -   用於處理視覺資料的視覺處理
    -   用於向量表示的嵌入生成
    -   用於文本生成任務的完成
    -   用於結構化資料的結構描述支援 (JSON，含簡易和完整變體)
    -   用於探索性回應的推測

-   **LLModel**: 一個資料類別，表示一個特定的 LLM 及其供應商、唯一識別符和支援的功能。

這為以統一方式與不同 LLM 供應商互動奠定了基礎，讓應用程式能夠使用各種模型，同時抽象化供應商特定的細節。

## LLM 功能

LLM 功能代表大型語言模型可以支援的特定特性或功能。在 Koog 框架中，功能用於定義特定模型能做什麼以及如何配置。每個功能都表示為 `LLMCapability` 類別的子類別或資料物件。

在您的應用程式中配置 LLM 以供使用時，您透過在建立 `LLModel` 實例時將其新增到 `capabilities` 清單中，來指定它支援哪些功能。這讓框架能夠正確地與模型互動並適當地使用其特性。

### 核心功能

以下清單包含 Koog 框架中可用於模型的核心、LLM 特定功能：

-   **推測** (`LLMCapability.Speculation`): 讓模型生成具有不同程度可能性的推測性或探索性回應。對於需要更廣泛潛在結果的創意或假設性場景很有用。

-   **溫度** (`LLMCapability.Temperature`): 允許調整模型回應的隨機性或創意程度。較高的溫度值會產生更多樣化的輸出，而較低的值會產生更集中且確定性的回應。

-   **工具** (`LLMCapability.Tools`): 表示支援外部工具使用或整合。此功能讓模型執行特定工具或與外部系統互動。

-   **工具選擇** (`LLMCapability.ToolChoice`): 配置工具呼叫與 LLM 的運作方式。根據模型，它可以配置為：
    -   自動在生成文本或工具呼叫之間選擇
    -   僅生成工具呼叫，從不生成文本
    -   僅生成文本，從不生成工具呼叫
    -   強制呼叫定義工具中的特定工具

-   **多重選擇** (`LLMCapability.MultipleChoices`): 讓模型針對單一提示生成多個獨立的回覆選擇。

### 媒體處理功能

以下清單代表一套用於處理圖像或音訊等媒體內容的功能：

-   **視覺** (`LLMCapability.Vision`): 一個用於基於視覺的功能的類別，可處理、分析並推斷視覺資料中的見解。
    支援以下類型的視覺資料：
    -   **圖像** (`LLMCapability.Vision.Image`): 處理圖像相關的視覺任務，例如圖像分析、識別和解讀。
    -   **視訊** (`LLMCapability.Vision.Video`): 處理視訊資料，包括分析和理解視訊內容。

-   **音訊** (`LLMCapability.Audio`): 提供音訊相關功能，例如轉錄、音訊生成或基於音訊的互動。

-   **文件** (`LLMCapability.Document`): 啟用對基於文件的輸入和輸出的處理。

### 文本處理功能

以下功能清單代表文本生成和處理功能：

-   **嵌入** (`LLMCapability.Embed`): 讓模型從輸入文本生成向量嵌入，從而實現相似性比較、分群和其他基於向量的分析。

-   **完成** (`LLMCapability.Completion`): 包括根據給定輸入上下文生成文本或內容，例如完成句子、生成建議或產生與輸入資料一致的內容。

-   **提示快取** (`LLMCapability.PromptCaching`): 支援提示的快取功能，潛在地提高重複或相似查詢的效能。

-   **調節** (`LLMCapability.Moderation`): 讓模型分析文本中潛在的有害內容，並根據騷擾、仇恨言論、自殘、性內容、暴力等各種類別進行分類。

### 結構描述功能

以下清單指示與處理結構化資料相關的功能：

-   **結構描述** (`LLMCapability.Schema`): 一個用於結構化結構描述功能的類別，與使用特定格式的資料互動和編碼相關。
    包含對以下格式的支援：
    -   **JSON** (`LLMCapability.Schema.JSON`): JSON 結構描述支援，具有不同級別：
        -   **基本** (`LLMCapability.Schema.JSON.Basic`): 提供輕量級或基本 JSON 處理功能。
        -   **標準** (`LLMCapability.Schema.JSON.Standard`): 提供全面的 JSON 結構描述支援，用於複雜資料結構。

## 建立模型 (LLModel) 配置

若要以通用、供應商無關的方式定義模型，請建立 `LLModel` 類別的實例作為模型配置，並使用以下參數：

| 名稱              | 資料類型                 | 必要 | 預設 | 說明                                                                                                                                                                                   |
|-------------------|---------------------------|------|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | 是   |      | LLM 的供應商，例如 Google 或 OpenAI。這用於識別建立或託管模型的公司或組織。                                                                                                                    |
| `id`              | String                    | 是   |      | LLM 實例的唯一識別符。這通常表示特定的模型版本或名稱。例如，`gpt-4-turbo`、`claude-3-opus`、`llama-3-2`。                                                                                             |
| `capabilities`    | List&lt;LLMCapability&gt; | 是   |      | LLM 支援的功能清單，例如溫度調整、工具使用或基於結構描述的任務。這些功能定義了模型能做什麼以及如何配置它。                                                                                       |
| `contextLength`   | Long                      | 是   |      | LLM 的上下文長度。這是 LLM 可處理的最大 Token 數。                                                                                                                                              |
| `maxOutputTokens` | Long                      | 否   | `null` | 供應商可為 LLM 生成的最大 Token 數。                                                                                                                                                           |

### 範例

本節提供了使用不同功能建立 `LLModel` 實例的詳細範例。

以下程式碼表示具有核心功能的基礎 LLM 配置：

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

以下模型配置是一個具有視覺能力的多模態 LLM：

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

一個具有音訊處理能力的 LLM：

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

除了建立 `LLModel` 實例並必須指定所有相關參數之外，Koog 還包含預定義模型及其支援功能的配置集合。
若要使用預定義的 Ollama 模型，請如下指定：

<!--- INCLUDE
import ai.koog.prompt.llm.OllamaModels

-->

```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```

<!--- KNIT example-model-capabilities-04.kt -->

若要檢查模型是否支援特定功能，請使用 `contains` 方法檢查 `capabilities` 清單中是否存在該功能：

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.llm.OllamaModels

val basicModel = OllamaModels.Meta.LLAMA_3_2
val visionModel = OllamaModels.Meta.LLAMA_3_2

-->

```kotlin
// Check if models support specific capabilities
val supportsTools = basicModel.capabilities.contains(LLMCapability.Tools) // true
val supportsVideo = visionModel.capabilities.contains(LLMCapability.Vision.Video) // false

// Check for schema capabilities
val jsonCapability = basicModel.capabilities.filterIsInstance<LLMCapability.Schema.JSON>().firstOrNull()
val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
```

<!--- KNIT example-model-capabilities-05.kt -->

### 各模型支援的 LLM 功能

本參考資料顯示了不同供應商的每個模型支援哪些 LLM 功能。

在下表中：

-   `✓` 表示模型支援該功能
-   `-` 表示模型不支援該功能
-   對於 JSON Schema，`Full` 或 `Simple` 表示模型支援的 JSON Schema 變體

??? "Google 模型"
    #### Google 模型

    | 模型                  | 溫度 | JSON Schema | 完成 | 多重選擇 | 工具 | 工具選擇 | 視覺 (圖像) | 視覺 (視訊) | 音訊 |
    |-----------------------|------|-------------|------|----------|------|----------|-------------|-------------|------|
    | Gemini2_5Pro          | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_5Flash        | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_5FlashLite    | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_0Flash        | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_0Flash001     | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_0FlashLite    | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |
    | Gemini2_0FlashLite001 | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | ✓           | ✓    |

??? "OpenAI 模型"
    #### OpenAI 模型

    | 模型                    | 溫度 | JSON Schema | 完成 | 多重選擇 | 工具 | 工具選擇 | 視覺 (圖像) | 視覺 (視訊) | 音訊 | 推測 | 調節 |
    |-------------------------|------|-------------|------|----------|------|----------|-------------|-------------|------|------|------|
    | Reasoning.O4Mini        | -    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Reasoning.O3Mini        | -    | Full        | ✓    | ✓        | ✓    | ✓        | -           | -           | -    | ✓    | -    |
    | Reasoning.O3            | -    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Reasoning.O1            | -    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Chat.GPT4o              | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Chat.GPT4_1             | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Chat.GPT5               | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Chat.GPT5Mini           | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Chat.GPT5Nano           | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -           | -    | ✓    | -    |
    | Audio.GptAudio          | ✓    | -           | ✓    | -        | ✓    | ✓        | -           | -           | ✓    | -    | -    |
    | Audio.GPT4oMiniAudio    | ✓    | -           | ✓    | -        | ✓    | ✓        | -           | -           | ✓    | -    | -    |
    | Audio.GPT4oAudio        | ✓    | -           | ✓    | -        | ✓    | ✓        | -           | -           | ✓    | -    | -    |
    | CostOptimized.GPT4_1Nano| ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -            | -    | ✓    | -    |
    | CostOptimized.GPT4_1Mini| ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -            | -    | ✓    | -    |
    | CostOptimized.GPT4oMini | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓           | -            | -    | ✓    | -    |
    | Moderation.Omni         | -    | -           | -    | -        | -    | -        | ✓           | -           | -    | -    | ✓    |

??? "Anthropic 模型"
    #### Anthropic 模型

    | 模型       | 溫度 | JSON Schema | 完成 | 工具 | 工具選擇 | 視覺 (圖像) |
    |------------|------|-------------|------|------|----------|-------------|
    | Opus_4_1   | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Opus_4     | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Sonnet_4   | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Sonnet_3_7 | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Haiku_3_5  | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Sonnet_3_5 | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Haiku_3    | ✓    | -           | ✓    | ✓    | ✓        | ✓           |
    | Opus_3     | ✓    | -           | ✓    | ✓    | ✓        | ✓           |

??? "Ollama 模型"
    #### Ollama 模型

    ##### Meta 模型

    | 模型          | 溫度 | JSON Schema | 工具 | 調節 |
    |---------------|------|-------------|------|------|
    | LLAMA_3_2_3B  | ✓    | Simple      | ✓    | -    |
    | LLAMA_3_2     | ✓    | Simple      | ✓    | -    |
    | LLAMA_4       | ✓    | Simple      | ✓    | -    |
    | LLAMA_GUARD_3 | -    | -           | -    | ✓    |

    ##### Alibaba 模型

    | 模型               | 溫度 | JSON Schema | 工具 |
    |--------------------|------|-------------|------|
    | QWEN_2_5_05B       | ✓    | Simple      | ✓    |
    | QWEN_3_06B         | ✓    | Simple      | ✓    |
    | QWQ                | ✓    | Simple      | ✓    |
    | QWEN_CODER_2_5_32B | ✓    | Simple      | ✓    |

    ##### Groq 模型

    | 模型                      | 溫度 | JSON Schema | 工具 |
    |---------------------------|------|-------------|------|
    | LLAMA_3_GROK_TOOL_USE_8B  | ✓    | Full        | ✓    |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓    | Full        | ✓    |

    ##### Granite 模型

    | 模型               | 溫度 | JSON Schema | 工具 | 視覺 (圖像) |
    |--------------------|------|-------------|------|-------------|
    | GRANITE_3_2_VISION | ✓    | Simple      | ✓    | ✓           |

??? "DeepSeek 模型"
    #### DeepSeek 模型

    | 模型            | 溫度 | JSON Schema | 完成 | 推測 | 工具 | 工具選擇 | 視覺 (圖像) |
    |-----------------|------|-------------|------|------|------|----------|-------------|
    | DeepSeekChat    | ✓    | Full        | ✓    | -    | ✓    | ✓        | -           |
    | DeepSeekReasoner| ✓    | Full        | ✓    | -    | ✓    | ✓        | -           |

??? "OpenRouter 模型"
    #### OpenRouter 模型

    | 模型                | 溫度 | JSON Schema | 完成 | 推測 | 工具 | 工具選擇 | 視覺 (圖像) |
    |---------------------|------|-------------|------|------|------|----------|-------------|
    | Phi4Reasoning       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Claude3Opus         | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3Sonnet       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3Haiku        | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3_5Sonnet     | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3_7Sonnet     | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude4Sonnet       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude4_1Opus       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | GPT4oMini           | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | GPT5                | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | GPT5Mini            | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | GPT5Nano            | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | GPT_OSS_120b        | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | GPT4                | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | GPT4o               | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | GPT4Turbo           | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | GPT35Turbo          | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Llama3              | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Llama3Instruct      | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Mistral7B           | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Mixtral8x7B         | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Claude3VisionSonnet | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3VisionOpus   | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Claude3VisionHaiku  | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | DeepSeekV30324      | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -           |
    | Gemini2_5FlashLite  | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Gemini2_5Flash      | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |
    | Gemini2_5Pro        | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓           |