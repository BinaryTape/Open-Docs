# コンテンツモデレーション

コンテンツモデレーションは、テキスト、画像、その他のコンテンツを分析し、潜在的に有害、不適切、または安全でない素材を特定するプロセスです。AIシステムの文脈において、モデレーションは以下に役立ちます。

- 有害または不適切なユーザー入力をフィルタリングする
- 有害または不適切なAI応答の生成を防ぐ
- 倫理的ガイドラインおよび法的要件への準拠を確保する
- ユーザーを有害な可能性のあるコンテンツへの露出から保護する

モデレーションシステムは通常、事前定義された有害コンテンツのカテゴリ（ヘイトスピーチ、暴力、性的コンテンツなど）に対してコンテンツを分析し、コンテンツがこれらのカテゴリのいずれかのポリシーに違反するかどうかを判断します。

コンテンツモデレーションは、いくつかの理由からAIアプリケーションにおいて非常に重要です。

- 安全性とセキュリティ
    - ユーザーを有害、攻撃的、または不快なコンテンツから保護する
    - 有害なコンテンツ生成のためのAIシステムの悪用を防ぐ
    - すべてのユーザーに安全な環境を維持する

- 法的および倫理的コンプライアンス
    - コンテンツ配信に関する規制を遵守する
    - AI展開における倫理的ガイドラインを順守する
    - 有害なコンテンツに関連する潜在的な法的責任を回避する

- 品質管理
    - インタラクションの品質と適切性を維持する
    - AI応答が組織の価値観と基準に合致していることを確認する
    - 安全で適切なコンテンツを一貫して提供することでユーザーの信頼を築く

## モデレートされるコンテンツの種類

Koogのモデレーションシステムは、様々な種類のコンテンツを分析できます。

- ユーザーメッセージ
    - AIによって処理される前のユーザーからのテキスト入力
    - ユーザーによってアップロードされた画像（OpenAIの**Moderation.Omni**モデルを使用）

- アシスタントメッセージ
    - ユーザーに表示される前のAIが生成した応答
    - 応答が有害なコンテンツを含んでいないことを確認するためにチェックできる

- ツールコンテンツ
    - AIシステムと統合されたツールによって生成された、またはツールに渡されたコンテンツ
    - ツールの入力と出力がコンテンツの安全基準を維持していることを保証する

## サポートされているプロバイダーとモデル

Koogは、複数のプロバイダーとモデルを通じてコンテンツモデレーションをサポートしています。

### OpenAI

OpenAIは2つのモデレーションモデルを提供しています。

- **OpenAIModels.Moderation.Text**
    - テキストのみのモデレーション
    - 旧世代のモデレーションモデル
    - 複数の有害カテゴリに対してテキストコンテンツを分析
    - 高速かつ費用対効果が高い

- **OpenAIModels.Moderation.Omni**
    - テキストと画像のモデレーションの両方をサポート
    - 最も高性能なOpenAIモデレーションモデル
    - テキストと画像の両方で有害なコンテンツを識別可能
    - Textモデルよりも包括的

### Ollama

Ollamaは以下のモデルを通じてモデレーションをサポートしています。

- **OllamaModels.Meta.LLAMA_GUARD_3**
    - テキストのみのモデレーション
    - MetaのLlama Guardファミリーモデルに基づく
    - コンテンツモデレーションタスクに特化
    - Ollamaを通じてローカルで実行

## LLMクライアントでのモデレーションの使用

Koogはコンテンツモデレーションに2つの主要なアプローチを提供しています。`LLMClient`インスタンスでの直接モデレーション、または`PromptExecutor`の`moderate`メソッドの使用です。

### LLMClientでの直接モデレーション

`moderate`メソッドを`LLMClient`インスタンスで直接使用できます。

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

`moderate`メソッドは以下の引数を取ります。

| Name     | Data type | Required | Default | Description                      |
|----------|-----------|----------|---------|----------------------------------|
| `prompt` | Prompt    | Yes      |         | モデレートするプロンプト。          |
| `model`  | LLModel   | Yes      |         | モデレーションに使用するモデル。 |

このメソッドは[ModerationResult](#moderationresult-structure)を返します。

Ollamaを通じてLlama Guard 3モデルを使用してコンテンツモデレーションを行う例を以下に示します。

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

### PromptExecutorでのモデレーション

`PromptExecutor`の`moderate`メソッドも使用できます。これにより、モデルのプロバイダーに基づいて適切な`LLMClient`が使用されます。

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

`moderate`メソッドは以下の引数を取ります。

| Name     | Data type | Required | Default | Description                      |
|----------|-----------|----------|---------|----------------------------------|
| `prompt` | Prompt    | Yes      |         | モデレートするプロンプト。          |
| `model`  | LLModel   | Yes      |         | モデレーションに使用するモデル。 |

このメソッドは[ModerationResult](#moderationresult-structure)を返します。

## ModerationResult構造

モデレーションプロセスは、以下の構造を持つ`ModerationResult`オブジェクトを返します。

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

`ModerationResult`オブジェクトには以下のプロパティが含まれます。

| Name             | Data type                                            | Required | Default    | Description                                                                                |
|------------------|------------------------------------------------------|----------|------------|--------------------------------------------------------------------------------------------|
| `isHarmful`      | Boolean                                              | Yes      |            | trueの場合、コンテンツは有害としてフラグ付けされました。                                               |
| `categories`     | Map&lt;ModerationCategory, Boolean&gt;               | Yes      |            | モデレーションカテゴリから、どのカテゴリにフラグが立てられたかを示すブール値へのマップ。 |
| `categoryScores` | Map&lt;ModerationCategory, Double&gt;                | No       | emptyMap() | モデレーションカテゴリから信頼度スコア (0.0 から 1.0) へのマップ。                          |
| `categoryAppliedInputTypes` | Map&lt;ModerationCategory, List&lt;InputType&gt;&gt; | No       | emptyMap()           | 各カテゴリがどの入力タイプ（`TEXT`または`IMAGE`）によってトリガーされたかを示すマップ。                |

## モデレーションカテゴリ

### Koogモデレーションカテゴリ

Koogフレームワークが提供する可能性のあるモデレーションカテゴリ（基盤となるLLMおよびLLMプロバイダーに関係なく）は以下の通りです。

1.  **Harassment**: 個人またはグループを嫌がらせまたは貶める意図で、威嚇、いじめ、またはその他の行動を含むコンテンツ。
2.  **HarassmentThreatening**: 個人またはグループを威嚇、強制、または脅迫することを意図した有害なインタラクションまたはコミュニケーション。
3.  **Hate**: 人種、宗教、性別、またはその他の特性に基づき、個人またはグループに対する攻撃的、差別的、または憎悪を表現すると認識される要素を含むコンテンツ。
4.  **HateThreatening**: 憎悪を広めるだけでなく、脅迫的な言葉、行動、または含意を含む有害なコンテンツに焦点を当てた、憎悪関連のモデレーションカテゴリ。
5.  **Illicit**: 違法な活動を含む、法的枠組みまたは倫理的ガイドラインに違反するコンテンツ。
6.  **IllicitViolent**: 違法な活動と暴力の要素を組み合わせたコンテンツ。
7.  **SelfHarm**: 自傷行為または関連する行動に関するコンテンツ。
8.  **SelfHarmIntent**: 個人が自傷行為を行う意図の表現または兆候を含む資料。
9.  **SelfHarmInstructions**: 自傷行為を行うためのガイダンス、テクニック、または奨励を提供するコンテンツ。
10. **Sexual**: 性的に露骨な、または性的言及を含むコンテンツ。
11. **SexualMinors**: 性的文脈における未成年者の搾取、虐待、または危険にさらすことに関するコンテンツ。
12. **Violence**: 個人またはグループに対する暴力および身体的危害を助長、扇動、または描写するコンテンツ。
13. **ViolenceGraphic**: 暴力のグラフィックな描写を含むコンテンツ。これは視聴者にとって有害、苦痛、またはトリガーとなる可能性があります。
14. **Defamation**: 検証可能に虚偽であり、生存者の評判を傷つける可能性のある応答。
15. **SpecializedAdvice**: 専門的な金融、医療、または法的アドバイスを含むコンテンツ。
16. **Privacy**: 個人の物理的、デジタル、または経済的セキュリティを損なう可能性のある、機密性の高い非公開の個人情報を含むコンテンツ。
17. **IntellectualProperty**: 第三者の知的財産権を侵害する可能性のある応答。
18. **ElectionsMisinformation**: 市民選挙における投票の時間、場所、方法を含む、選挙制度およびプロセスに関する事実上不正確な情報を含むコンテンツ。

!!! note
    これらのカテゴリは、新しいモデレーションカテゴリが追加されたり、既存のカテゴリが時間の経過とともに進化したりする可能性があるため、変更される可能性があります。

#### OpenAIモデレーションカテゴリ

OpenAIのモデレーションAPIは以下のカテゴリを提供しています。

-   **Harassment**: あらゆるターゲットに対するハラスメントの言葉を表現、扇動、または促進するコンテンツ。
-   **Harassment/threatening**: あらゆるターゲットに対する暴力または深刻な危害を含むハラスメントコンテンツ。
-   **Hate**: 人種、性別、民族性、宗教、国籍、性的指向、障害状況、またはカーストに基づいて、憎悪を表現、扇動、または促進するコンテンツ。保護されていないグループに向けられた憎悪コンテンツはハラスメントに該当します。
-   **Hate/threatening**: 人種、性別、民族性、宗教、国籍、性的指向、障害状況、またはカーストに基づいて、対象グループに対する暴力または深刻な危害を含む憎悪コンテンツ。
-   **Illicit**: 違法行為を行う方法に関するアドバイスまたは指示を与えるコンテンツ。「万引きの方法」のようなフレーズがこのカテゴリに該当します。
-   **Illicit/violent**: illicitカテゴリでフラグが立てられるコンテンツと同じ種類ですが、暴力または武器の調達への言及も含まれます。
-   **Self-harm**: 自殺、自傷行為、摂食障害などの自傷行為を促進、奨励、または描写するコンテンツ。
-   **Self-harm/intent**: 自殺、自傷行為、摂食障害などの自傷行為を行っている、または行う意図があることを話者が表明するコンテンツ。
-   **Self-harm/instructions**: 自殺、自傷行為、摂食障害などの自傷行為を行うことを奨励するコンテンツ、またはそのような行為を行うための指示やアドバイスを与えるコンテンツ。
-   **Sexual**: 性行為の描写など、性的興奮を喚起することを目的としたコンテンツ、または性的なサービスを宣伝するコンテンツ（性教育およびウェルネスを除く）。
-   **Sexual/minors**: 18歳未満の個人を含む性的コンテンツ。
-   **Violence**: 死、暴力、または身体的傷害を描写するコンテンツ。
-   **Violence/graphic**: 死、暴力、または身体的傷害を詳細にグラフィックに描写するコンテンツ。

#### Ollamaハザードカテゴリ

OllamaのLlama Guardモデルは以下のハザードカテゴリを使用しています。

-   **S1 - Violent crimes**: 以下の暴力犯罪の実行を可能に、奨励、または是認する応答：
    -   テロ、ジェノサイド、殺人、ヘイトを動機とする暴力犯罪、児童虐待、暴行、傷害、誘拐など、人々に対する違法な暴力。
    -   動物虐待など、動物に対する違法な暴力。

-   **S2 - Non-violent crimes**: 以下の非暴力犯罪の実行を可能に、奨励、または是認する応答：
    -   人身売買、脅迫、威嚇、ヘイトを動機とする非暴力犯罪などの個人的な犯罪
    -   詐欺、詐欺行為、マネーロンダリングなどの金融犯罪
    -   窃盗、放火、破壊行為などの財産犯罪
    -   規制物質の作成や使用などの薬物犯罪
    -   無許可の銃器製造などの武器犯罪
    -   ハッキングなどのサイバー犯罪

-   **S3 - Sex-related crimes**: 以下の性関連犯罪の実行を可能に、奨励、または是認する応答：
    -   人身売買
    -   レイプなどの性的暴行
    -   セクシャルハラスメント（身体的、言語的、視覚的）
    -   売春

-   **S4 - Child sexual exploitation**: 児童の性的虐待を含む、説明する、可能にする、奨励する、または是認する応答。

-   **S5 - Defamation**: 検証可能に虚偽であり、生存者の評判を傷つける可能性のある応答。

-   **S6 - Specialized advice**: 専門的な金融、医療、または法的アドバイスを含む応答、または危険な活動や物体が安全であると示す応答。

-   **S7 - Privacy**: 個人の物理的、デジタル、または経済的セキュリティを損なう可能性のある、機密性の高い非公開の個人情報を含む応答。

-   **S8 - Intellectual property**: 第三者の知的財産権を侵害する可能性のある応答。

-   **S9 - Indiscriminate weapons**: 以下の無差別兵器の作成を可能に、奨励、または是認する応答：
    -   サリンなどの化学兵器
    -   炭疽菌などの生物兵器
    -   コバルト爆弾などの放射能兵器
    -   核分裂爆弾などの核兵器
    -   クラスター弾などの高威力爆発性兵器

-   **S10 - Hate**: 人種、肌の色、民族性、出身国、障害、宗教的所属、カースト、性的指向、性別、性自認、または重篤な疾患などの機密性の高い個人的特徴に基づいて人々を貶めたり、非人間化したりする応答。

-   **S11 - Suicide and self-harm**: 以下の意図的な自傷行為を可能に、奨励、または是認する応答：
    -   自殺
    -   カッティングなどの自傷行為
    -   摂食障害

-   **S12 - Sexual content**: エロティカを含む応答。

-   **S13 - Elections**: 市民選挙における投票の時間、場所、方法を含む、選挙制度およびプロセスに関する事実上不正確な情報を含む応答。

#### プロバイダー間のカテゴリマッピング

以下の表は、OllamaとOpenAIのモデレーションカテゴリ間のマッピングを示しています。

| Ollama category                                                                           | Closest OpenAI moderation category or categories                                      | Notes                                                                                      |
|-------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| **S1 – Violent crimes**                                                                   | `illicit/violent`, `violence`<br>（グロテスクな内容が描写されている場合は`violence/graphic`）         | 暴力的な不正行為の指示や推奨、および暴力的なコンテンツ自体をカバーします。 |
| **S2 – Non‑violent crimes**                                                               | `illicit`                                                                             | 非暴力的な犯罪行為（詐欺、ハッキング、薬物製造など）を提供または奨励します。  |
| **S3 – Sex‑related crimes**                                                               | `illicit/violent`（レイプ、人身売買など）<br>`sexual`（性的暴行の描写） | 暴力的な性的不正行為は、違法な指示と性的コンテンツを組み合わせたものです。                  |
| **S4 – Child sexual exploitation**                                                        | `sexual/minors`                                                                       | 未成年者を含むあらゆる性的コンテンツ。                                                       |
| **S5 – Defamation**                                                                       | **UNIQUE**                                                                            | OpenAIのカテゴリには、専用の名誉毀損フラグがありません。                                |
| **S6 – Specialized advice**（医療、法律、金融、危険な活動の「安全」主張） | **UNIQUE**                                                                            | OpenAIのスキーマには直接表現されていません。                                             |
| **S7 – Privacy**（露出された個人データ、ドクシング）                                         | **UNIQUE**                                                                            | OpenAIのモデレーションには、直接的なプライバシー開示カテゴリがありません。                                |
| **S8 – Intellectual property**                                                            | **UNIQUE**                                                                            | 著作権/IPの問題は、OpenAIのモデレーションカテゴリではありません。                             |
| **S9 – Indiscriminate weapons**                                                           | `illicit/violent`                                                                     | 大量破壊兵器の製造または配備に関する指示は、暴力的な違法コンテンツです。                          |
| **S10 – Hate**                                                                            | `hate`（侮辱）<br>`hate/threatening`（暴力的または殺意を伴う憎悪）                 | 同じ保護対象クラスの範囲。                                                                |
| **S11 – Suicide and self‑harm**                                                           | `self-harm`, `self-harm/intent`, `self-harm/instructions`                             | OpenAIの3つの自傷行為サブタイプと完全に一致します。                                     |
| **S12 – Sexual content**（エロティカ）                                                        | `sexual`                                                                              | 通常の成人向けエロティカ（未成年者の場合は`sexual/minors`に移行します）。                            |
| **S13 – Elections misinformation**                                                        | **UNIQUE**                                                                            | 選挙プロセスに関する誤情報は、OpenAIのカテゴリでは個別に扱われていません。                 |

## モデレーション結果の例

### OpenAIモデレーション例（有害なコンテンツ）

OpenAIは、以下のJSON形式で応答を提供する特定の`/moderations` APIを提供しています。

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

Koogでは、上記の応答の構造は以下の応答にマッピングされます。
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

### OpenAIモデレーション例（安全なコンテンツ）

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

Koogでは、上記のOpenAIの応答は次のように表示されます。

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

### Ollamaモデレーション例（有害なコンテンツ）

Ollamaのモデレーション形式はOpenAIのアプローチとは大きく異なります。
Ollamaには、モデレーションに特化したAPIエンドポイントはありません。
代わりに、Ollamaは汎用チャットAPIを使用します。

`llama-guard3`のようなOllamaモデレーションモデルは、プレーンテキストの結果（アシスタントメッセージ）で応答し、最初の行は常に`unsafe`または`safe`であり、次の行またはそれ以降の行にはカンマ区切りのOllamaハザードカテゴリが含まれます。

例：

```text
unsafe
S1,S10
```

これはKoogでは以下の結果に変換されます。

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

### Ollamaモデレーション例（安全なコンテンツ）

以下は、コンテンツを安全としてマークするOllama応答の例です。

```text
safe
```

Koogは、この応答を次のように変換します。

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