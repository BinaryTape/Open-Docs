# 内容审核

内容审核是对文本、图像或其他内容进行分析的过程，旨在识别潜在有害、不当或不安全的信息。在 AI 系统中，审核有助于：

- 过滤掉有害或不当的用户输入
- 防止生成有害或不当的 AI 响应
- 确保符合道德准则和法律要求
- 保护用户免受潜在有害内容的侵害

审核系统通常会根据预定义的有害内容类别（例如仇恨言论、暴力、色情内容等）分析内容，并判断内容是否违反了这些类别中的任何政策。

内容审核在 AI 应用中至关重要，原因如下：

- 安全性
    - 保护用户免受有害、冒犯性或令人不安的内容侵害
    - 防止滥用 AI 系统生成有害内容
    - 为所有用户维护一个安全的环境

- 法律和道德合规
    - 遵守内容分发的相关法规
    - 遵循 AI 部署的道德准则
    - 避免与有害内容相关的潜在法律责任

- 质量控制
    - 保持交互的质量和适宜性
    - 确保 AI 响应符合组织价值观和标准
    - 通过持续提供安全和适宜的内容来建立用户信任

## 审核内容的类型

Koog 的审核系统可以分析各种类型的内容：

- 用户消息
    - 经 AI 处理前的用户文本输入
    - 用户上传的图像（使用 OpenAI 的 **Moderation.Omni** 模型）

- 助手消息
    - AI 生成的、向用户展示前的响应
    - 可以检测响应以确保它们不包含有害内容

- 工具内容
    - 由集成到 AI 系统中的工具生成或传递给工具的内容
    - 确保工具的输入和输出符合内容安全标准

## 支持的提供商和模型

Koog 通过多个提供商和模型支持内容审核：

### OpenAI

OpenAI 提供两种审核模型：

- **OpenAIModels.Moderation.Text**
    - 仅限文本审核
    - 上一代审核模型
    - 根据多种有害类别分析文本内容
    - 快速且经济高效

- **OpenAIModels.Moderation.Omni**
    - 同时支持文本和图像审核
    - 最强大的 OpenAI 审核模型
    - 可以识别文本和图像中的有害内容
    - 比 Text 模型更全面

### Ollama

Ollama 通过以下模型支持审核：

- **OllamaModels.Meta.LLAMA_GUARD_3**
    - 仅限文本审核
    - 基于 Meta 的 Llama Guard 模型家族
    - 专用于内容审核任务
    - 通过 Ollama 在本地运行

## 将审核与 LLM 客户端配合使用

Koog 提供两种主要的内容审核方法：直接对 `LLMClient` 实例进行审核，或在 `PromptExecutor` 上使用 `moderate` 方法。

### 使用 LLMClient 直接审核

您可以直接在 LLMClient 实例上使用 `moderate` 方法：

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

`moderate` 方法接受以下实参：

| 名称       | 数据类型   | 必填 | 默认值 | 描述             |
|----------|----------|----|------|----------------|
| `prompt` | Prompt   | 是  |      | 要审核的提示。      |
| `model`  | LLModel  | 是  |      | 用于审核的模型。     |

该方法返回一个 [ModerationResult](#moderationresult-structure)。

以下是使用 Ollama 通过 Llama Guard 3 模型进行内容审核的示例：

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

### 使用 PromptExecutor 审核

您也可以在 PromptExecutor 上使用 `moderate` 方法，它会根据模型的提供商使用相应的 LLMClient：

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

`moderate` 方法接受以下实参：

| 名称       | 数据类型   | 必填 | 默认值 | 描述             |
|----------|----------|----|------|----------------|
| `prompt` | Prompt   | 是  |      | 要审核的提示。      |
| `model`  | LLModel  | 是  |      | 用于审核的模型。     |

该方法返回一个 [ModerationResult](#moderationresult-structure)。

## ModerationResult 结构

审核过程会返回一个结构如下的 `ModerationResult` 对象：

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

`ModerationResult` 对象包含以下属性：

| 名称                        | 数据类型                                            | 必填 | 默认值   | 描述                                                                                  |
|---------------------------|---------------------------------------------------|----|--------|-------------------------------------------------------------------------------------|
| `isHarmful`               | Boolean                                           | 是  |        | 如果为 true，则内容被标记为有害。                                                              |
| `categories`              | Map&lt;ModerationCategory, Boolean&gt;            | 是  |        | 一个从审核类别到布尔值的映射，指示哪些类别被标记。                                                        |
| `categoryScores`          | Map&lt;ModerationCategory, Double&gt;             | 否  | emptyMap() | 一个从审核类别到置信度分数（0.0 到 1.0）的映射。                                                      |
| `categoryAppliedInputTypes` | Map&lt;ModerationCategory, List&lt;InputType&gt;&gt; | 否  | emptyMap() | 一个映射，指示哪些输入类型（`TEXT` 或 `IMAGE`）触发了每个类别。                                                |

## 审核类别

### Koog 审核类别

Koog 框架提供的可能审核类别（无论底层 LLM 和 LLM 提供商如何）如下：

1.  **Harassment**：涉及恐吓、欺凌或旨在骚扰或贬低个人或群体的其他行为的内容。
2.  **HarassmentThreatening**：旨在恐吓、胁迫或威胁个人或群体的有害交互或通信。
3.  **Hate**：包含被认为具有冒犯性、歧视性或基于种族、宗教、性别或其他特征表达对个人或群体仇恨的内容。
4.  **HateThreatening**：与仇恨相关的审核类别，侧重于不仅传播仇恨还包含威胁性语言、行为或暗示的有害内容。
5.  **Illicit**：违反法律框架或道德准则的内容，包括非法或不正当活动。
6.  **IllicitViolent**：结合了非法或不正当活动与暴力元素的内容。
7.  **SelfHarm**：与自残或相关行为有关的内容。
8.  **SelfHarmIntent**：包含个人自残意图表达或迹象的材料。
9.  **SelfHarmInstructions**：提供自残行为指导、技术或鼓励的内容。
10. **Sexual**：色情或包含性暗示的内容。
11. **SexualMinors**：涉及性背景下对未成年人剥削、虐待或危害的内容。
12. **Violence**：推广、煽动或描述对个人或群体施加暴力和身体伤害的内容。
13. **ViolenceGraphic**：包含暴力血腥描绘的内容，可能对观看者有害、令人不安或引发不适。
14. **Defamation**：经核实为虚假且可能损害在世者声誉的响应。
15. **SpecializedAdvice**：包含专业金融、医疗或法律建议的内容。
16. **Privacy**：包含敏感的、非公开的个人信息，可能损害个人人身、数字或财务安全的内容。
17. **IntellectualProperty**：可能侵犯任何第三方知识产权的响应。
18. **ElectionsMisinformation**：包含关于选举系统和流程事实不准确信息的内容，包括公民选举中的投票时间、地点或方式。

!!! note
    这些类别可能会随着新审核类别的添加而发生变化，现有类别也可能随着时间演进。

#### OpenAI 审核类别

OpenAI 的审核 API 提供以下类别：

- **Harassment**：表达、煽动或推广针对任何目标的骚扰性语言的内容。
- **Harassment/threatening**：包含暴力或对任何目标造成严重伤害的骚扰内容。
- **Hate**：表达、煽动或推广基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的仇恨内容。针对非受保护群体的仇恨内容属于骚扰。
- **Hate/threatening**：包含暴力或对目标群体造成严重伤害的仇恨内容，目标群体基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓。
- **Illicit**：提供实施非法行为建议或指导的内容。例如“如何扒窃”之类的短语就属于此类。
- **Illicit/violent**：与 Illicit 类别标记的内容类型相同，但还包括暴力或获取武器的提及。
- **Self-harm**：推广、鼓励或描述自残行为的内容，例如自杀、割伤和饮食失调。
- **Self-harm/intent**：说话者表达其正在进行或打算进行自残行为的内容，例如自杀、割伤和饮食失调。
- **Self-harm/instructions**：鼓励进行自残行为的内容，例如自杀、割伤和饮食失调，或者提供实施此类行为的说明或建议的内容。
- **Sexual**：旨在引起性兴奋的内容，例如性活动的描述，或推广性服务的内容（不包括性教育和健康）。
- **Sexual/minors**：包含未满 18 岁个人的性内容。
- **Violence**：描绘死亡、暴力或人身伤害的内容。
- **Violence/graphic**：以图形细节描绘死亡、暴力或人身伤害的内容。

#### Ollama 风险类别

Ollama 的 Llama Guard 模型使用以下风险类别：

- **S1 - Violent crimes**：促成、鼓励或认可暴力犯罪行为的响应，包括：
    - 针对个人的非法暴力，例如恐怖主义、种族灭绝、谋杀、仇恨驱动的暴力犯罪、虐待儿童、攻击、殴打、绑架。
    - 针对动物的非法暴力，例如虐待动物。

- **S2 - Non-violent crimes**：促成、鼓励或认可非暴力犯罪行为的响应，包括：
    - 个人犯罪，例如人口贩运、威胁、恐吓、仇恨驱动的非暴力犯罪
    - 金融犯罪，例如欺诈、诈骗、洗钱
    - 财产犯罪，例如盗窃、纵火、故意破坏
    - 毒品犯罪，例如制造或使用受管制物质
    - 武器犯罪，例如生产无证枪支
    - 网络犯罪，例如黑客行为

- **S3 - Sex-related crimes**：促成、鼓励或认可性相关犯罪行为的响应，包括：
    - 性贩运
    - 性侵犯，例如强奸
    - 性骚扰（身体、口头或视觉）
    - 卖淫

- **S4 - Child sexual exploitation**：包含、描述、促成、鼓励或认可儿童性虐待的响应。

- **S5 - Defamation**：经核实为虚假且可能损害在世者声誉的响应。

- **S6 - Specialized advice**：包含专业金融、医疗或法律建议，或表明危险活动或物体是安全的响应。

- **S7 - Privacy**：包含敏感的、非公开的个人信息，可能损害个人人身、数字或财务安全的响应。

- **S8 - Intellectual property**：可能侵犯任何第三方知识产权的响应。

- **S9 - Indiscriminate weapons**：促成、鼓励或认可制造不分皂白武器的响应，包括：
    - 化学武器，例如神经毒气
    - 生物武器，例如炭疽
    - 放射性武器，例如钴弹
    - 核武器，例如裂变炸弹
    - 高当量爆炸物，例如集束弹药

- **S10 - Hate**：基于敏感的个人特征（例如种族、肤色、民族、国籍、残疾、宗教信仰、种姓、性取向、性别、性别认同或严重疾病）贬低或非人化他人的响应。

- **S11 - Suicide and self-harm**：促成、鼓励或认可故意自残行为的响应，包括：
    - 自杀
    - 自伤，例如割伤
    - 饮食失调

- **S12 - Sexual content**：包含色情内容的响应。

- **S13 - Elections misinformation**：包含关于选举系统和流程事实不准确信息的内容，包括公民选举中的投票时间、地点或方式。

#### 提供商之间的类别映射

下表显示了 Ollama 和 OpenAI 审核类别之间的映射：

| Ollama 类别                                                                     | 最接近的 OpenAI 审核类别或类别                                  | 备注                                                                |
|---------------------------------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------|
| **S1 – Violent crimes**                                                         | `illicit/violent`, `violence` <br>(`violence/graphic` 当描述血腥时) | 涵盖暴力不法行为的指示或认可，以及暴力内容本身。                           |
| **S2 – Non‑violent crimes**                                                     | `illicit`                                                       | 提供或鼓励非暴力犯罪活动（欺诈、黑客、制毒等）。                           |
| **S3 – Sex‑related crimes**                                                     | `illicit/violent` (强奸、贩运等)<br>`sexual` (性侵描述)      | 暴力性不法行为结合了非法指示和色情内容。                              |
| **S4 – Child sexual exploitation**                                              | `sexual/minors`                                                 | 任何涉及未成年人的性内容。                                           |
| **S5 – Defamation**                                                             | **UNIQUE**                                                      | OpenAI 的类别中没有专门的诽谤标记。                                  |
| **S6 – Specialized advice** (医疗、法律、金融、危险活动“安全”声明) | **UNIQUE**                                                      | 未直接体现在 OpenAI 模式中。                                        |
| **S7 – Privacy** (暴露的个人数据、人肉搜索)                                    | **UNIQUE**                                                      | OpenAI 审核中没有直接的隐私泄露类别。                                |
| **S8 – Intellectual property**                                                  | **UNIQUE**                                                      | 版权/知识产权问题在 OpenAI 中不属于审核类别。                            |
| **S9 – Indiscriminate weapons**                                                 | `illicit/violent`                                               | 制造或部署大规模杀伤性武器的指令属于暴力非法内容。                       |
| **S10 – Hate**                                                                  | `hate` (贬低) <br>`hate/threatening` (暴力或杀人仇恨)       | 受保护类别的范围相同。                                            |
| **S11 – Suicide and self‑harm**                                                 | `self-harm`, `self-harm/intent`, `self-harm/instructions`     | 与 OpenAI 的三种自残子类型完全匹配。                                |
| **S12 – Sexual content** (情色内容)                                             | `sexual`                                                        | 普通成人情色内容（未成年人将转为 `sexual/minors`）。                 |
| **S13 – Elections misinformation**                                              | **UNIQUE**                                                      | 选举过程虚假信息在 OpenAI 类别中未被单独列出。                           |

## 审核结果示例

### OpenAI 审核示例（有害内容）

OpenAI 提供特定的 `/moderations` API，以以下 JSON 格式提供响应：

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

在 Koog 中，上述响应的结构映射到以下响应：
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

### OpenAI 审核示例（安全内容）

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

在 Koog 中，上述 OpenAI 响应的呈现方式如下：

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

### Ollama 审核示例（有害内容）

Ollama 的审核格式与 OpenAI 的方法显著不同。
Ollama 中没有特定的与审核相关的 API 端点。
相反，Ollama 使用通用聊天 API。

Ollama 审核模型（例如 `llama-guard3`）以纯文本结果（助手消息）响应，其中第一行始终是 `unsafe` 或 `safe`，接下来的行包含逗号分隔的 Ollama 风险类别。

例如：

```text
unsafe
S1,S10
```

这在 Koog 中被转换为以下结果：

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

### Ollama 审核示例（安全内容）

以下是 Ollama 响应内容为安全的示例：

```text
safe
```

Koog 转换此响应的方式如下：

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