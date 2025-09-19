# 內容審核

內容審核是分析文字、圖片或其他內容，以識別潛在有害、不當或不安全材料的過程。在 AI 系統的背景下，審核有助於：

- 過濾掉有害或不當的使用者輸入
- 防止生成有害或不當的 AI 回應
- 確保符合道德準則和法律要求
- 保護使用者免受潛在有害內容的影響

審核系統通常會根據預定義的有害內容類別（例如仇恨言論、暴力、色情內容等）分析內容，並判斷內容是否違反了這些類別中的任何政策。

內容審核在 AI 應用程式中至關重要，原因如下：

- 安全與保障
    - 保護使用者免受有害、冒犯性或令人不安的內容影響
    - 防止 AI 系統被濫用於生成有害內容
    - 為所有使用者維護一個安全的環境

- 法律與道德合規性
    - 遵守有關內容分發的法規
    - 遵守 AI 部署的道德準則
    - 避免與有害內容相關的潛在法律責任

- 品質控制
    - 維護互動的品質和適當性
    - 確保 AI 回應符合組織價值觀和標準
    - 透過持續提供安全和適當的內容來建立使用者信任

## 經審核內容的類型

Koog 的審核系統可以分析各種類型的內容：

- 使用者訊息
    - AI 處理前的使用者文字輸入
    - 使用者上傳的圖片 (搭配 OpenAI 的 **Moderation.Omni** 模型)

- 助理訊息
    - AI 生成的回應在顯示給使用者之前
    - 可以檢查回應以確保不包含有害內容

- 工具內容
    - 由與 AI 系統整合的工具生成或傳遞給工具的內容
    - 確保工具輸入和輸出維持內容安全標準

## 支援的提供者與模型

Koog 透過多個提供者和模型支援內容審核：

### OpenAI

OpenAI 提供兩種審核模型：

- **OpenAIModels.Moderation.Text**
    - 僅限文字審核
    - 上一代審核模型
    - 分析多種危害類別的文字內容
    - 快速且經濟實惠

- **OpenAIModels.Moderation.Omni**
    - 支援文字和圖片審核
    - 最強大的 OpenAI 審核模型
    - 可以在文字和圖片中識別有害內容
    - 比 Text 模型更全面

### Ollama

Ollama 透過以下模型支援審核：

- **OllamaModels.Meta.LLAMA_GUARD_3**
    - 僅限文字審核
    - 基於 Meta 的 Llama Guard 系列模型
    - 專用於內容審核任務
    - 透過 Ollama 本地運行

## 搭配 LLM 用戶端使用審核

Koog 提供兩種主要的內容審核方法：直接在 `LLMClient` 實例上進行審核，或在 `PromptExecutor` 上使用 `moderate` 方法。

### 使用 LLMClient 直接審核

您可以直接在 `LLMClient` 實例上使用 `moderate` 方法：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

const val apiKey = "YOUR_OPENAI_API_KEY"

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Example with OpenAI client
val openAIClient = OpenAILLMClient(apiKey)
val prompt = prompt("harmful-prompt") { 
    user("I want to build a bomb")
}

// Moderate with OpenAI's Omni moderation model
val result = openAIClient.moderate(prompt, OpenAIModels.Moderation.Omni)

if (result.isHarmful) {
    println("Content was flagged as harmful")
    // Handle harmful content (e.g., reject the prompt)
} else {
    // Proceed with processing the prompt
} 
```
<!--- KNIT example-content-moderation-01.kt -->

`moderate` 方法接受以下參數：

| 名稱     | 數據類型 | 必填 | 預設 | 描述                       |
|----------|-----------|----------|---------|--------------------------------|
| `prompt` | Prompt    | 是       |         | 要審核的提示。             |
| `model`  | LLModel   | 是       |         | 用於審核的模型。           |

該方法返回一個 [ModerationResult](#moderationresult-structure)。

以下是透過 Ollama 使用 Llama Guard 3 模型進行內容審核的範例：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Example with Ollama client
val ollamaClient = OllamaClient()
val prompt = prompt("harmful-prompt") {
    user("How to hack into someone's account")
}

// Moderate with Llama Guard 3
val result = ollamaClient.moderate(prompt, OllamaModels.Meta.LLAMA_GUARD_3)

if (result.isHarmful) {
    println("Content was flagged as harmful")
    // Handle harmful content
} else {
    // Proceed with processing the prompt
}
```
<!--- KNIT example-content-moderation-02.kt -->

### 使用 PromptExecutor 進行審核

您也可以在 `PromptExecutor` 上使用 `moderate` 方法，它會根據模型的提供者使用適當的 `LLMClient`：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.executor.ollama.client.OllamaClient
import ai.koog.prompt.llm.LLMProvider
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

const val openAIApiKey = "YOUR_OPENAI_API_KEY"

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create a multi-provider executor
val executor = MultiLLMPromptExecutor(
    LLMProvider.OpenAI to OpenAILLMClient(openAIApiKey),
    LLMProvider.Ollama to OllamaClient()
)

val prompt = prompt("harmful-prompt") {
    user("How to create illegal substances")
}

// Moderate with OpenAI
val openAIResult = executor.moderate(prompt, OpenAIModels.Moderation.Omni)

// Or moderate with Ollama
val ollamaResult = executor.moderate(prompt, OllamaModels.Meta.LLAMA_GUARD_3)

// Process the results
if (openAIResult.isHarmful || ollamaResult.isHarmful) {
    // Handle harmful content
}
```
<!--- KNIT example-content-moderation-03.kt -->

`moderate` 方法接受以下參數：

| 名稱     | 數據類型 | 必填 | 預設 | 描述                       |
|----------|-----------|----------|---------|--------------------------------|
| `prompt` | Prompt    | 是       |         | 要審核的提示。             |
| `model`  | LLModel   | 是       |         | 用於審核的模型。           |

該方法返回一個 [ModerationResult](#moderationresult-structure)。

## ModerationResult 結構

審核過程返回一個 `ModerationResult` 物件，其結構如下：

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
public data class ModerationResult(
    val isHarmful: Boolean,
    val categories: Map<ModerationCategory, Boolean>,
    val categoryScores: Map<ModerationCategory, Double> = emptyMap(),
    val categoryAppliedInputTypes: Map<ModerationCategory, List<InputType>> = emptyMap()
) {
    /**
     * Represents the type of input provided for content moderation.
     *
     * This enumeration is used in conjunction with moderation categories to specify
     * the format of the input being analyzed.
     */
    @Serializable
    public enum class InputType {
        /**
         * This enum value is typically used to classify inputs as textual data
         * within the supported input types.
         */
        TEXT,

        /**
         * Represents an input type specifically designed for handling and processing images.
         * This enum constant can be used to classify or determine behavior for workflows requiring image-based inputs.
         */
        IMAGE,
    }
}
```
<!--- KNIT example-content-moderation-04.kt -->

`ModerationResult` 物件包含以下屬性：

| 名稱                      | 數據類型                                             | 必填 | 預設         | 描述                                                                                   |
|---------------------------|------------------------------------------------------|----------|------------|----------------------------------------------------------------------------------------|
| `isHarmful`               | Boolean                                              | 是       |            | 如果為 true，則內容被標記為有害。                                                      |
| `categories`              | Map&lt;ModerationCategory, Boolean&gt;               | 是       |            | 審核類別到布林值的映射，指示哪些類別被標記。                                           |
| `categoryScores`          | Map&lt;ModerationCategory, Double&gt;                | 否       | emptyMap() | 審核類別到置信分數 (0.0 到 1.0) 的映射。                                               |
| `categoryAppliedInputTypes` | Map&lt;ModerationCategory, List&lt;InputType&gt;&gt; | 否       | emptyMap() | 指示哪些輸入類型 (`TEXT` 或 `IMAGE`) 觸發了每個類別的映射。                             |

## 審核類別

### Koog 審核類別

Koog 框架提供的可能審核類別 (無論底層 LLM 和 LLM 提供者如何) 如下：

1.  **Harassment** (騷擾)：涉及恐嚇、霸凌或針對個人或群體的其他行為，意圖騷擾或貶低。
2.  **HarassmentThreatening** (威脅性騷擾)：意圖恐嚇、脅迫或威脅個人或群體的有害互動或通訊。
3.  **Hate** (仇恨)：包含被認為具有冒犯性、歧視性或對個人或群體基於種族、宗教、性別或其他特徵表達仇恨的內容。
4.  **HateThreatening** (威脅性仇恨)：與仇恨相關的審核類別，著重於不僅傳播仇恨而且包含威脅性語言、行為或暗示的有害內容。
5.  **Illicit** (違法)：違反法律框架或道德準則的內容，包括非法或違法活動。
6.  **IllicitViolent** (違法暴力)：涉及非法或違法活動與暴力元素結合的內容。
7.  **SelfHarm** (自殘)：與自殘或相關行為有關的內容。
8.  **SelfHarmIntent** (自殘意圖)：包含個人意圖自殘的表達或指示的材料。
9.  **SelfHarmInstructions** (自殘指示)：提供自殘行為的指導、技術或鼓勵的內容。
10. **Sexual** (色情)：性露骨或包含性暗示的內容。
11. **SexualMinors** (兒童色情)：涉及性背景下剝削、虐待或危害未成年人的內容。
12. **Violence** (暴力)：宣揚、煽動或描繪針對個人或群體的暴力和身體傷害的內容。
13. **ViolenceGraphic** (圖形暴力)：包含暴力圖形描繪的內容，可能對觀看者有害、令人不安或觸發。
14. **Defamation** (誹謗)：可驗證為虛假並可能損害在世者聲譽的回應。
15. **SpecializedAdvice** (專業建議)：包含專業金融、醫療或法律建議的內容。
16. **Privacy** (隱私)：包含可能破壞某人身體、數位或財務安全的敏感、非公開個人資訊的內容。
17. **IntellectualProperty** (智慧財產權)：可能侵犯任何第三方智慧財產權的回應。
18. **ElectionsMisinformation** (選舉不實資訊)：包含有關選舉系統和流程的事實不正確資訊，包括公民選舉中的投票時間、地點或方式。

!!! note
    這些類別可能會隨著新的審核類別的添加和現有類別的演變而改變。

#### OpenAI 審核類別

OpenAI 的審核 API 提供以下類別：

-   **Harassment** (騷擾)：表達、煽動或宣傳針對任何目標的騷擾性語言的內容。
-   **Harassment/threatening** (騷擾/威脅)：騷擾內容，也包含針對任何目標的暴力或嚴重傷害。
-   **Hate** (仇恨)：表達、煽動或宣傳基於種族、性別、族裔、宗教、國籍、性取向、殘疾狀況或種姓的仇恨內容。針對非受保護群體的仇恨內容屬於騷擾。
-   **Hate/threatening** (仇恨/威脅)：仇恨內容，也包含針對目標群體基於種族、性別、族裔、宗教、國籍、性取向、殘疾狀況或種姓的暴力或嚴重傷害。
-   **Illicit** (違法)：提供有關如何實施違法行為的建議或指示的內容。例如「如何扒竊」這樣的短語將屬於此類別。
-   **Illicit/violent** (違法/暴力)：與違法類別標記的內容類型相同，但也包含暴力或獲取武器的提及。
-   **Self-harm** (自殘)：宣傳、鼓勵或描繪自殘行為，例如自殺、切割和飲食失調的內容。
-   **Self-harm/intent** (自殘/意圖)：說話者表達他們正在或打算從事自殘行為（例如自殺、切割和飲食失調）的內容。
-   **Self-harm/instructions** (自殘/指示)：鼓勵執行自殘行為（例如自殺、切割和飲食失調）或提供如何實施此類行為的指示或建議的內容。
-   **Sexual** (色情)：旨在引起性興奮的內容，例如性行為的描述，或推廣性服務 (不包括性教育和健康)。
-   **Sexual/minors** (色情/未成年人)：包含未滿 18 歲個人的色情內容。
-   **Violence** (暴力)：描繪死亡、暴力或人身傷害的內容。
-   **Violence/graphic** (暴力/圖形化)：以圖形化細節描繪死亡、暴力或人身傷害的內容。

#### Ollama 危險類別

Ollama 的 Llama Guard 模型使用以下危險類別：

-   **S1 - Violent crimes** (S1 - 暴力犯罪)：促成、鼓勵或認可實施暴力犯罪的回應，包括：
    -   針對人員的非法暴力，例如恐怖主義、種族滅絕、謀殺、仇恨驅動的暴力犯罪、兒童虐待、攻擊、毆打、綁架。
    -   針對動物的非法暴力，例如虐待動物。

-   **S2 - Non-violent crimes** (S2 - 非暴力犯罪)：促成、鼓勵或認可實施非暴力犯罪的回應，包括：
    -   個人犯罪，例如勞動人口販運、威脅、恐嚇、仇恨驅動的非暴力犯罪
    -   金融犯罪，例如詐欺、詐騙、洗錢
    -   財產犯罪，例如盜竊、縱火、破壞
    -   毒品犯罪，例如製造或使用受管制物質
    -   武器犯罪，例如生產未經許可的槍械
    -   網路犯罪，例如駭客攻擊

-   **S3 - Sex-related crimes** (S3 - 性相關犯罪)：促成、鼓勵或認可實施性相關犯罪的回應，包括：
    -   性販運
    -   性侵害，例如強姦
    -   性騷擾 (身體、言語或視覺)
    -   賣淫

-   **S4 - Child sexual exploitation** (S4 - 兒童性剝削)：包含、描述、促成、鼓勵或認可兒童性虐待的回應。

-   **S5 - Defamation** (S5 - 誹謗)：可驗證為虛假且可能損害在世者聲譽的回應。

-   **S6 - Specialized advice** (S6 - 專業建議)：包含專業金融、醫療或法律建議的回應，或表明危險活動或物品是安全的。

-   **S7 - Privacy** (S7 - 隱私)：包含可能破壞某人身體、數位或財務安全的敏感、非公開個人資訊的回應。

-   **S8 - Intellectual property** (S8 - 智慧財產權)：可能侵犯任何第三方智慧財產權的回應。

-   **S9 - Indiscriminate weapons** (S9 - 無差別武器)：促成、鼓勵或認可製造無差別武器的回應，包括：
    -   化學武器，例如神經毒氣
    -   生物武器，例如炭疽
    -   放射性武器，例如鈷彈
    -   核武器，例如裂變炸彈
    -   高當量爆炸性武器，例如集束彈藥

-   **S10 - Hate** (S10 - 仇恨)：基於敏感的個人特徵（例如種族、膚色、族裔、國籍、殘疾、宗教信仰、種姓、性取向、性別、性別認同或嚴重疾病）貶低或非人化他人的回應。

-   **S11 - Suicide and self-harm** (S11 - 自殺與自殘)：促成、鼓勵或認可故意自殘行為的回應，包括：
    -   自殺
    -   自傷，例如切割
    -   飲食失調

-   **S12 - Sexual content** (S12 - 色情內容)：包含情色內容的回應。

-   **S13 - Elections misinformation** (S13 - 選舉不實資訊)：包含有關選舉系統和流程的事實不正確資訊的回應，包括公民選舉中的投票時間、地點或方式。

#### 提供者之間的類別映射

下表顯示了 Ollama 和 OpenAI 審核類別之間的映射：

| Ollama 類別                                                                               | 最接近的 OpenAI 審核類別或多個類別                                       | 備註                                                              |
|-------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------------|
| **S1 – Violent crimes** (S1 – 暴力犯罪)                                                   | `illicit/violent` (違法/暴力), `violence` (暴力)<br>(描述血腥時為 `violence/graphic` (暴力/圖形化)) | 涵蓋暴力不法行為的指示或認可，以及暴力內容本身。                 |
| **S2 – Non‑violent crimes** (S2 – 非暴力犯罪)                                             | `illicit` (違法)                                                        | 提供或鼓勵非暴力犯罪活動（詐欺、駭客攻擊、製毒等）。             |
| **S3 – Sex‑related crimes** (S3 – 性相關犯罪)                                             | `illicit/violent` (違法/暴力) (強姦、販運等)<br>`sexual` (色情) (性侵害描述) | 暴力性不法行為結合了違法指示 + 性內容。                           |
| **S4 – Child sexual exploitation** (S4 – 兒童性剝削)                                      | `sexual/minors` (色情/未成年人)                                         | 任何涉及未成年人的色情內容。                                     |
| **S5 – Defamation** (S5 – 誹謗)                                                           | **UNIQUE** (獨有)                                                       | OpenAI 的類別沒有專門的誹謗標誌。                                |
| **S6 – Specialized advice** (S6 – 專業建議) (醫療、法律、金融、危險活動「安全」聲明) | **UNIQUE** (獨有)                                                       | 未直接在 OpenAI 模式中表示。                                     |
| **S7 – Privacy** (S7 – 隱私) (暴露個人資料、肉搜)                                         | **UNIQUE** (獨有)                                                       | OpenAI 審核中沒有直接的隱私洩露類別。                            |
| **S8 – Intellectual property** (S8 – 智慧財產權)                                          | **UNIQUE** (獨有)                                                       | 版權/智慧財產權問題不是 OpenAI 中的審核類別。                     |
| **S9 – Indiscriminate weapons** (S9 – 無差別武器)                                         | `illicit/violent` (違法/暴力)                                           | 製造或部署大規模殺傷性武器的指示屬於暴力違法內容。               |
| **S10 – Hate** (S10 – 仇恨)                                                               | `hate` (仇恨) (貶低)<br>`hate/threatening` (仇恨/威脅) (暴力或殺人仇恨) | 受保護階級範圍相同。                                             |
| **S11 – Suicide and self‑harm** (S11 – 自殺與自殘)                                        | `self-harm` (自殘), `self-harm/intent` (自殘/意圖), `self-harm/instructions` (自殘/指示) | 與 OpenAI 的三種自殘子類型完全匹配。                             |
| **S12 – Sexual content** (S12 – 色情內容) (情色)                                          | `sexual` (色情)                                                         | 普通成人情色內容 (未成年人將轉為 `sexual/minors` (色情/未成年人))。 |
| **S13 – Elections misinformation** (S13 – 選舉不實資訊)                                   | **UNIQUE** (獨有)                                                       | 選舉過程不實資訊未在 OpenAI 類別中單獨列出。                     |

## 審核結果範例

### OpenAI 審核範例 (有害內容)

OpenAI 提供特定的 `/moderations` API，其回應採用以下 JSON 格式：

```json
{
  "isHarmful": true,
  "categories": {
    "Harassment": false,
    "HarassmentThreatening": false,
    "Hate": false,
    "HateThreatening": false,
    "Sexual": false,
    "SexualMinors": false,
    "Violence": false,
    "ViolenceGraphic": false,
    "SelfHarm": false,
    "SelfHarmIntent": false,
    "SelfHarmInstructions": false,
    "Illicit": true,
    "IllicitViolent": true
  },
  "categoryScores": {
    "Harassment": 0.0001,
    "HarassmentThreatening": 0.0001,
    "Hate": 0.0001,
    "HateThreatening": 0.0001,
    "Sexual": 0.0001,
    "SexualMinors": 0.0001,
    "Violence": 0.0145,
    "ViolenceGraphic": 0.0001,
    "SelfHarm": 0.0001,
    "SelfHarmIntent": 0.0001,
    "SelfHarmInstructions": 0.0001,
    "Illicit": 0.9998,
    "IllicitViolent": 0.9876
  },
  "categoryAppliedInputTypes": {
    "Illicit": ["TEXT"],
    "IllicitViolent": ["TEXT"]
  }
}
```

在 Koog 中，上述回應的結構映射到以下回應：
<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult
import ai.koog.prompt.dsl.ModerationResult.InputType

val result =
-->
```kotlin
ModerationResult(
    isHarmful = true,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Hate to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Sexual to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Violence to ModerationCategoryResult(false, confidenceScore = 0.0145),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Illicit to ModerationCategoryResult(true, confidenceScore = 0.9998, appliedInputTypes = listOf(InputType.TEXT)),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(true, confidenceScore = 0.9876, appliedInputTypes = listOf(InputType.TEXT)),
    )
)
```
<!--- KNIT example-content-moderation-05.kt -->

### OpenAI 審核範例 (安全內容)

```json
{
  "isHarmful": false,
  "categories": {
    "Harassment": false,
    "HarassmentThreatening": false,
    "Hate": false,
    "HateThreatening": false,
    "Sexual": false,
    "SexualMinors": false,
    "Violence": false,
    "ViolenceGraphic": false,
    "SelfHarm": false,
    "SelfHarmIntent": false,
    "SelfHarmInstructions": false,
    "Illicit": false,
    "IllicitViolent": false
  },
  "categoryScores": {
    "Harassment": 0.0001,
    "HarassmentThreatening": 0.0001,
    "Hate": 0.0001,
    "HateThreatening": 0.0001,
    "Sexual": 0.0001,
    "SexualMinors": 0.0001,
    "Violence": 0.0001,
    "ViolenceGraphic": 0.0001,
    "SelfHarm": 0.0001,
    "SelfHarmIntent": 0.0001,
    "SelfHarmInstructions": 0.0001,
    "Illicit": 0.0001,
    "IllicitViolent": 0.0001
  },
  "categoryAppliedInputTypes": {}
}
```

在 Koog 中，上述 OpenAI 回應的呈現方式如下：

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = false,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Hate to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Sexual to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Violence to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.Illicit to ModerationCategoryResult(false, confidenceScore = 0.0001),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(false, confidenceScore = 0.0001),
    )
)
```
<!--- KNIT example-content-moderation-06.kt -->

### Ollama 審核範例 (有害內容)

Ollama 在審核格式上的方法與 OpenAI 的方法顯著不同。
Ollama 中沒有特定的審核相關 API 端點。
相反，Ollama 使用通用的聊天 API。

Ollama 審核模型，例如 `llama-guard3`，會回應一個純文字結果 (助理訊息)，其中第一行總是 `unsafe` 或 `safe`，下一行或多行包含以逗號分隔的 Ollama 危險類別。

例如：

```text
unsafe
S1,S10
```

這在 Koog 中被翻譯為以下結果：

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = true,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false),
        ModerationCategory.Hate to ModerationCategoryResult(true),    // from S10
        ModerationCategory.HateThreatening to ModerationCategoryResult(false),
        ModerationCategory.Sexual to ModerationCategoryResult(false),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false),
        ModerationCategory.Violence to ModerationCategoryResult(false),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false),
        ModerationCategory.Illicit to ModerationCategoryResult(true),    // from S1
        ModerationCategory.IllicitViolent to ModerationCategoryResult(true),    // from S1
    )
)
```
<!--- KNIT example-content-moderation-07.kt -->

### Ollama 審核範例 (安全內容)

以下是一個 Ollama 回應將內容標記為安全的範例：

```text
safe
```

Koog 以以下方式翻譯回應：

<!--- INCLUDE
import ai.koog.prompt.dsl.ModerationCategory
import ai.koog.prompt.dsl.ModerationCategoryResult
import ai.koog.prompt.dsl.ModerationResult

val result =
-->
```kotlin
ModerationResult(
    isHarmful = false,
    categories = mapOf(
        ModerationCategory.Harassment to ModerationCategoryResult(false),
        ModerationCategory.HarassmentThreatening to ModerationCategoryResult(false),
        ModerationCategory.Hate to ModerationCategoryResult(false),
        ModerationCategory.HateThreatening to ModerationCategoryResult(false),
        ModerationCategory.Sexual to ModerationCategoryResult(false),
        ModerationCategory.SexualMinors to ModerationCategoryResult(false),
        ModerationCategory.Violence to ModerationCategoryResult(false),
        ModerationCategory.ViolenceGraphic to ModerationCategoryResult(false),
        ModerationCategory.SelfHarm to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmIntent to ModerationCategoryResult(false),
        ModerationCategory.SelfHarmInstructions to ModerationCategoryResult(false),
        ModerationCategory.Illicit to ModerationCategoryResult(false),
        ModerationCategory.IllicitViolent to ModerationCategoryResult(false),
    )
)
```
<!--- KNIT example-content-moderation-08.kt -->