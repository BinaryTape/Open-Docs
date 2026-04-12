Koog 提供了一組抽象和實作，用於以與供應商無關的方式處理來自各個大型語言模型 (LLM) 供應商的模型。這套工具包含以下類別：

- **LLMCapability**：一個類別階層結構，定義了 LLM 可以支援的各種功能，例如：
    - 溫度調整：用於控制回應的隨機性
    - 工具整合：用於與外部系統互動
    - 視覺處理：用於處理視覺資料
    - 嵌入 (Embedding) 產生：用於向量表示
    - 補全 (Completion)：用於文字產生任務
    - 架構支援：用於結構化資料（包含 Simple 與 Full 變體的 JSON）
    - 推測 (Speculation)：用於探索性回應

- **LLModel**：一個資料類別，表示具有其供應商、唯一識別碼和支援功能的特定 LLM。

這可作為以統一方式與不同 LLM 供應商互動的基礎，允許應用程式在使用各種模型時，抽象化掉特定供應商的細節。

## LLM 功能

LLM 功能代表大型語言模型可以支援的特定特性或功能性。在 Koog 架構中，功能用於定義特定模型可以執行什麼操作以及如何進行配置。每項功能都表示為 `LLMCapability` 類別的子類別或資料物件。

在配置應用程式中使用的 LLM 時，您可以在建立 `LLModel` 執行個體時將支援的功能新增至 `capabilities` 列表來指定它們。這讓架構能夠正確地與模型互動並適當地使用其功能。

### 核心功能

下方列表包含 Koog 架構中模型可用的核心、LLM 特有功能：

- **推測** (`LLMCapability.Speculation`)：讓模型以不同的可能性程度產生推測性或探索性回應。適用於需要更廣泛潛在結果的創意或假設場景。

- **溫度** (`LLMCapability.Temperature`)：允許調整模型回應的隨機性或創意程度。較高的溫度值會產生更多樣化的輸出，而較低的值則會產生更集中且確定性的回應。

- **工具** (`LLMCapability.Tools`)：表示支援外部工具使用或整合。此功能讓模型執行特定工具或與外部系統互動。

- **工具選擇** (`LLMCapability.ToolChoice`)：配置工具呼叫在 LLM 中的運作方式。根據模型的不同，可以配置為：
    - 自動在產生文字或工具呼叫之間做出選擇
    - 僅產生工具呼叫，不產生文字
    - 僅產生文字，不產生工具呼叫
    - 強制呼叫已定義工具中的特定工具

- **多重選擇** (`LLMCapability.MultipleChoices`)：讓模型對單個提示詞產生多個獨立的回覆選擇。

### 媒體處理功能

以下列表代表一組用於處理圖像或音訊等媒體內容的功能：

- **視覺** (`LLMCapability.Vision`)：一個用於視覺功能的類別，可處理、分析視覺資料並從中推斷洞察。
  支援以下類型的視覺資料：
    - **圖像** (`LLMCapability.Vision.Image`)：處理與圖像相關的視覺任務，例如圖像分析、識別和解讀。
    - **影片** (`LLMCapability.Vision.Video`)：處理影片資料，包括分析和理解影片內容。

- **音訊** (`LLMCapability.Audio`)：提供音訊相關功能，例如轉錄、音訊產生或基於音訊的互動。

- **文件** (`LLMCapability.Document`)：啟用基於文件的輸入和輸出的處理。

### 文字處理功能

以下功能列表代表文字產生與處理功能：

- **嵌入** (`LLMCapability.Embed`)：讓模型從輸入文字產生向量嵌入，從而實現相似性比較、分群和其他基於向量的分析。

- **補全** (`LLMCapability.Completion`)：包含根據給定的輸入上下文產生文字或內容，例如補全句子、產生建議或產出與輸入資料一致的內容。

- **提示詞快取** (`LLMCapability.PromptCaching`)：支援提示詞的快取功能，可提升重複或相似查詢的效能。

- **審核** (`LLMCapability.Moderation`)：讓模型分析文字中潛在的有害內容，並根據各種細節分類，例如騷擾、仇恨言論、自殘、性內容、暴力等。

### 架構功能

下方列表指出與處理結構化資料相關的功能：

- **架構** (`LLMCapability.Schema`)：一個用於結構化架構功能的類別，與使用特定格式進行資料互動和編碼相關。
  包含對以下格式的支援：
    - **JSON** (`LLMCapability.Schema.JSON`)：支援不同層級的 JSON 架構：
        - **基本** (`LLMCapability.Schema.JSON.Basic`)：提供輕量級或基本的 JSON 處理功能。
        - **標準** (`LLMCapability.Schema.JSON.Standard`)：為複雜的資料結構提供全面的 JSON 架構支援。

## 建立模型 (LLModel) 配置

若要以通用、與供應商無關的方式定義模型，請建立 `LLModel` 類別的執行個體作為模型配置，並使用以下參數：

| 名稱 | 資料型別 | 必填 | 預設值 | 說明 |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | 是      |         | LLM 的供應商，例如 Google 或 OpenAI。這識別了建立或託管該模型的公司或組織。 |
| `id`              | String                    | 是      |         | LLM 執行個體的唯一識別碼。這通常代表特定的模型版本或名稱。例如 `gpt-4-turbo`、`claude-3-opus`、`llama-3-2`。 |
| `capabilities`    | List&lt;LLMCapability&gt; | 是      |         | LLM 支援的功能列表，例如溫度調整、工具使用或基於架構的任務。這些功能定義了模型可以做什麼以及如何進行配置。 |
| `contextLength`   | Long                      | 是      |         | LLM 的上下文長度。這是 LLM 可以處理的最大 Token 數量。 |
| `maxOutputTokens` | Long                      | 否       | `null`  | 供應商可為該 LLM 產生的最大 Token 數量。 |

### 範例

本節提供了建立具有不同功能的 `LLModel` 執行個體的詳細範例。

下方的程式碼代表一個具有核心功能的基礎 LLM 配置：

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

下方的模型配置是一個具有視覺功能的多模態 LLM：

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

一個具有音訊處理功能的 LLM：

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

除了將模型建立為 `LLModel` 執行個體並必須指定所有相關參數外，Koog 還包含了一組預定義模型及其支援功能的配置。
若要使用預定義的 Ollama 模型，請按如下方式指定：

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

若要檢查模型是否支援特定功能，請使用 `contains` 方法來檢查 `capabilities` 列表中是否存在該功能：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.llm.LLMCapability
    import ai.koog.prompt.executor.ollama.client.OllamaModels

    val basicModel = OllamaModels.Meta.LLAMA_3_2
    val visionModel = OllamaModels.Meta.LLAMA_3_2

    -->
    ```kotlin
    // 檢查模型是否支援特定功能
    val supportsTools = basicModel.supports(LLMCapability.Tools) // true
    val supportsVideo = visionModel.supports(LLMCapability.Vision.Video) // false

    // 檢查架構功能
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
    // 檢查模型是否支援特定功能
    boolean supportsTools = basicModel.supports(LLMCapability.Tools.INSTANCE); // true
    boolean supportsVideo = visionModel.supports(LLMCapability.Vision.Video.INSTANCE); // false

    // 檢查架構功能
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

此參考資料顯示了不同供應商的每個模型支援哪些 LLM 功能。

在下表中：

- `✓` 表示模型支援該功能
- `-` 表示模型不支援該功能
- 對於 JSON 架構，`Full` 或 `Simple` 表示模型支援的 JSON 架構功能變體

??? "Google 模型"
    #### Google 模型

    | 模型 | 溫度 | JSON 架構 | 補全 | 多重選擇 | 工具 | 工具選擇 | 視覺 (圖像) | 視覺 (影片) | 音訊 |
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

    | 模型 | 溫度 | JSON 架構 | 補全 | 多重選擇 | 工具 | 工具選擇 | 視覺 (圖像) | 視覺 (影片) | 音訊 | 推測 | 審核 |
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

    | 模型 | 溫度 | JSON 架構 | 補全 | 工具 | 工具選擇 | 視覺 (圖像) |
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

??? "Ollama 模型"
    #### Ollama 模型

    ##### Meta 模型

    | 模型 | 溫度 | JSON 架構 | 工具 | 審核 |
    |---------------|-------------|-------------|-------|------------|
    | LLAMA_3_2_3B  | ✓           | Simple      | ✓     | -          |
    | LLAMA_3_2     | ✓           | Simple      | ✓     | -          |
    | LLAMA_4       | ✓           | Simple      | ✓     | -          |
    | LLAMA_GUARD_3 | -           | -           | -     | ✓          |

    ##### Alibaba 模型

    | 模型 | 溫度 | JSON 架構 | 工具 |
    |--------------------|-------------|-------------|-------|
    | QWEN_2_5_05B       | ✓           | Simple      | ✓     |
    | QWEN_3_06B         | ✓           | Simple      | ✓     |
    | QWQ                | ✓           | Simple      | ✓     |
    | QWEN_CODER_2_5_32B | ✓           | Simple      | ✓     |

    ##### Groq 模型

    | 模型 | 溫度 | JSON 架構 | 工具 |
    |---------------------------|-------------|-------------|-------|
    | LLAMA_3_GROK_TOOL_USE_8B  | ✓           | Full        | ✓     |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓           | Full        | ✓     |

    ##### Granite 模型

    | 模型 | 溫度 | JSON 架構 | 工具 | 視覺 (圖像) |
    |--------------------|-------------|-------------|-------|----------------|
    | GRANITE_3_2_VISION | ✓           | Simple      | ✓     | ✓              |

??? "DeepSeek 模型"
    #### DeepSeek 模型

    | 模型 | 溫度 | JSON 架構 | 補全 | 推測 | 工具 | 工具選擇 | 視覺 (圖像) |
    |------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | DeepSeekChat     | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |
    | DeepSeekReasoner | ✓           | Full        | ✓          | -           | ✓     | ✓           | -              |

??? "OpenRouter 模型"
    #### OpenRouter 模型

    | 模型 | 溫度 | JSON 架構 | 補全 | 推測 | 工具 | 工具選擇 | 視覺 (圖像) |
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