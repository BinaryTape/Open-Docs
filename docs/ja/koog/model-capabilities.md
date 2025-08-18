Koogは、さまざまなLLMプロバイダーの大規模言語モデル（LLM）とプロバイダーに依存しない方法で連携するための、一連の抽象化と実装を提供します。このセットには、以下のクラスが含まれます。

-   **LLMCapability**: LLMがサポートできるさまざまな機能を定義するクラス階層。例えば、以下のような機能があります。
    -   応答のランダム性を制御するための温度調整
    -   外部システム連携のためのツール統合
    -   視覚データ処理のための視覚処理
    -   ベクトル表現のための埋め込み生成
    -   テキスト生成タスクのための補完
    -   構造化データ（SimpleおよびFullバリアントのJSON）のためのスキーマ対応
    -   探索的な応答のための推測

-   **LLModel**: プロバイダー、一意の識別子、サポートされる機能を持つ特定のLLMを表すデータクラス。

これは、異なるLLMプロバイダーと統一された方法で連携するための基盤となり、アプリケーションがプロバイダー固有の詳細を抽象化しながら、さまざまなモデルと連携することを可能にします。

## LLM機能

LLM機能は、大規模言語モデルがサポートできる特定の特徴や機能を表します。Koogフレームワークでは、機能は特定のモデルができることと、どのように構成できるかを定義するために使用されます。各機能は、`LLMCapability` クラスのサブクラスまたはデータオブジェクトとして表されます。

アプリケーションでLLMを使用するために構成する際、`LLModel` インスタンスを作成するときに、サポートする機能を `capabilities` リストに追加して指定します。これにより、フレームワークはモデルと適切に連携し、その機能を適切に使用できます。

### コア機能

以下のリストには、Koogフレームワークでモデルが利用できる、コアとなるLLM固有の機能が含まれています。

-   **Speculation** (`LLMCapability.Speculation`): モデルが、さまざまな確度で推測的または探索的な応答を生成できるようにします。より広範な潜在的結果が望まれるクリエイティブなシナリオや仮説的なシナリオで役立ちます。

-   **Temperature** (`LLMCapability.Temperature`): モデルの応答のランダム性または創造性のレベルを調整できます。高い温度値はより多様な出力を生成し、低い値はより焦点を絞った決定論的な応答につながります。

-   **Tools** (`LLMCapability.Tools`): 外部ツールの利用または統合をサポートすることを示します。この機能により、モデルは特定のツールを実行したり、外部システムと連携したりできます。

-   **Tool choice** (`LLMCapability.ToolChoice`): LLMでのツール呼び出しの動作を構成します。モデルに応じて、以下のように構成できます。
    -   テキスト生成とツール呼び出しのどちらかを自動的に選択する
    -   テキストではなくツール呼び出しのみを生成する
    -   ツール呼び出しではなくテキストのみを生成する
    -   定義されたツールの中から特定のツールを強制的に呼び出す

-   **Multiple choices** (`LLMCapability.MultipleChoices`): モデルが単一のプロンプトに対して複数の独立した応答選択肢を生成できるようにします。

### メディア処理機能

以下のリストは、画像や音声などのメディアコンテンツを処理するための一連の機能を表します。

-   **Vision** (`LLMCapability.Vision`): 視覚データを処理、分析し、そこから洞察を推測する、視覚ベースの機能のためのクラスです。
    以下の種類の視覚データをサポートします。
    -   **Image** (`LLMCapability.Vision.Image`): 画像分析、認識、解釈などの画像関連の視覚タスクを処理します。
    -   **Video** (`LLMCapability.Vision.Video`): ビデオコンテンツの分析と理解を含むビデオデータを処理します。

-   **Audio** (`LLMCapability.Audio`): 転写（文字起こし）、音声生成、音声ベースのインタラクションなどの音声関連機能を提供します。

-   **Document** (`LLMCapability.Document`): ドキュメントベースの入出力を処理することを可能にします。

### テキスト処理機能

以下の機能リストは、テキスト生成および処理機能を表します。

-   **Embedding** (`LLMCapability.Embed`): モデルが入力テキストからベクトル埋め込みを生成できるようにし、類似性比較、クラスタリング、その他のベクトルベースの分析を可能にします。

-   **Completion** (`LLMCapability.Completion`): 与えられた入力コンテキストに基づいてテキストまたはコンテンツを生成することを含みます。例えば、文の補完、提案の生成、または入力データに合わせたコンテンツの作成などです。

-   **Prompt caching** (`LLMCapability.PromptCaching`): プロンプトのキャッシング機能をサポートし、繰り返しまたは類似のクエリのパフォーマンスを潜在的に向上させます。

-   **Moderation** (`LLMCapability.Moderation`): モデルが潜在的に有害なコンテンツのためにテキストを分析し、ハラスメント、ヘイトスピーチ、自傷行為、性的コンテンツ、暴力などのさまざまなカテゴリに基づいて分類できるようにします。

### スキーマ機能

以下のリストは、構造化データの処理に関連する機能を示します。

-   **Schema** (`LLMCapability.Schema`): 特定の形式を使用したデータインタラクションとエンコーディングに関連する構造化スキーマ機能のためのクラスです。
    以下の形式をサポートします。
    -   **JSON** (`LLMCapability.Schema.JSON`): さまざまなレベルのJSONスキーマサポート:
        -   **Basic** (`LLMCapability.Schema.JSON.Basic`): 軽量または基本的なJSON処理機能を提供します。
        -   **Standard** (`LLMCapability.Schema.JSON.Standard`): 複雑なデータ構造に対する包括的なJSONスキーマサポートを提供します。

## モデル (LLModel) 設定の作成

モデルを普遍的でプロバイダー非依存な方法で定義するには、`LLModel` クラスのインスタンスとして以下のパラメータでモデル設定を作成します。

| 名前              | データ型                 | 必須 | デフォルト | 説明                                                                                                                                                                                           |
|-------------------|---------------------------|------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider`        | LLMProvider               | はい   |            | LLMのプロバイダー（GoogleやOpenAIなど）。これはモデルを作成またはホストしている企業や組織を識別します。                                                                                                    |
| `id`              | String                    | はい   |            | LLMインスタンスの一意の識別子。通常、これは特定のモデルバージョンまたは名前を表します。例えば、`gpt-4-turbo`、`claude-3-opus`、`llama-3-2`など。                                                                  |
| `capabilities`    | List&lt;LLMCapability&gt; | はい   |            | LLMがサポートする機能のリスト（温度調整、ツール使用、スキーマベースのタスクなど）。これらの機能は、モデルができることと、どのように構成できるかを定義します。                                                                  |
| `contextLength`   | Long                      | はい   |            | LLMのコンテキスト長。これはLLMが処理できる最大トークン数です。                                                                                                                                                   |
| `maxOutputTokens` | Long                      | いいえ | `null`     | LLMのプロバイダーによって生成できる最大トークン数。                                                                                                                                                   |

### 例

このセクションでは、さまざまな機能を持つ`LLModel`インスタンスを作成する詳細な例を示します。

以下のコードは、コア機能を持つ基本的なLLM構成を表しています。

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

以下のモデル構成は、視覚機能を備えたマルチモーダルLLMです。

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

音声処理機能を備えたLLM:

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

`LLModel` インスタンスとしてモデルを作成し、関連するすべてのパラメータを指定する必要があるだけでなく、Koogには、サポートされる機能を持つ事前定義されたモデルとその構成のコレクションが含まれています。
事前定義されたOllamaモデルを使用するには、次のように指定します。

<!--- INCLUDE
import ai.koog.prompt.llm.OllamaModels

-->
```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```
<!--- KNIT example-model-capabilities-04.kt -->

モデルが特定の機能をサポートしているかどうかを確認するには、`contains` メソッドを使用して `capabilities` リストにその機能が存在するかをチェックします。

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

### モデルごとのLLM機能

このリファレンスは、さまざまなプロバイダーの各モデルでどのLLM機能がサポートされているかを示しています。

以下の表では:

-   `✓` は、モデルがその機能をサポートしていることを示します。
-   `-` は、モデルがその機能をサポートしていないことを示します。
-   JSONスキーマについては、`Full` または `Simple` が、モデルがサポートするJSONスキーマ機能のどのバリアントであるかを示します。

#### Googleモデル

| モデル                 | 温度 | JSONスキーマ | 補完 | 複数選択肢 | ツール | ツール選択 | 視覚 (画像) | 視覚 (ビデオ) | 音声 |
|------------------------|------|-------------|------|----------|------|----------|-----------|-----------|----|
| Gemini2_5Pro           | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini2_5Flash         | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |
| Gemini2_0Flash         | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini2_0Flash001      | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini2_0FlashLite     | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini2_0FlashLite001  | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini1_5Pro           | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini1_5ProLatest     | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini1_5Pro002        | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini1_5Flash         | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | ✓         | ✓  |
| Gemini1_5FlashLatest   | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |
| Gemini1_5Flash002      | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |
| Gemini1_5Flash8B       | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |
| Gemini1_5Flash8B001    | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |
| Gemini1_5Flash8BLatest | ✓    | Full        | ✓    | ✓        | -    | -        | ✓         | ✓         | ✓  |

#### OpenAIモデル

| モデル                 | 温度 | JSONスキーマ | 補完 | 複数選択肢 | ツール | ツール選択 | 視覚 (画像) | 視覚 (ビデオ) | 音声 | 推測 | モデレーション |
|------------------------|------|-------------|------|----------|------|----------|-----------|-----------|----|------|------------|
| Reasoning.GPT4oMini  | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | -         | -  | ✓    | -          |
| Reasoning.O3Mini     | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | -         | -         | -  | ✓    | -          |
| Reasoning.O1Mini     | -    | Full        | ✓    | ✓        | -    | -        | -         | -         | -  | ✓    | -          |
| Reasoning.O3         | -    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | -         | -  | ✓    | -          |
| Reasoning.O1         | -    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | -         | -  | ✓    | -          |
| Chat.GPT4o           | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | -         | -  | ✓    | -          |
| Chat.GPT4_1          | ✓    | Full        | ✓    | ✓        | ✓    | ✓        | ✓         | -         | -  | ✓    | -          |
| Audio.GPT4oMiniAudio | ✓    | -           | ✓    | -        | ✓    | ✓        | -         | -         | ✓  | -    | -          |
| Audio.GPT4oAudio     | ✓    | -           | ✓    | -        | ✓    | ✓        | -         | -         | ✓  | -    | -          |
| Moderation.Omni      | -    | -           | -    | -        | -    | -        | ✓         | -         | -  | -    | ✓          |
| Moderation.Text      | -    | -           | -    | -        | -    | -        | -         | -         | -  | -    | ✓          |

#### Anthropicモデル

| モデル     | 温度 | JSONスキーマ | 補完 | ツール | ツール選択 | 視覚 (画像) |
|------------|------|-------------|------|------|----------|-----------|
| Opus_4     | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Sonnet_4   | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Sonnet_3_7 | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Haiku_3_5  | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Sonnet_3_5 | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Haiku_3    | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |
| Opus_3     | ✓    | Full        | ✓    | ✓    | ✓        | ✓         |

#### Ollamaモデル

##### Metaモデル

| モデル          | 温度 | JSONスキーマ | ツール | モデレーション |
|---------------|------|-------------|------|------------|
| LLAMA_3_2_3B  | ✓    | Simple      | ✓    | -          |
| LLAMA_3_2     | ✓    | Simple      | ✓    | -          |
| LLAMA_4       | ✓    | Simple      | ✓    | -          |
| LLAMA_GUARD_3 | -    | -           | -    | ✓          |

##### Alibabaモデル

| モデル               | 温度 | JSONスキーマ | ツール |
|--------------------|------|-------------|------|
| QWEN_2_5_05B       | ✓    | Simple      | ✓    |
| QWEN_3_06B         | ✓    | Simple      | ✓    |
| QWQ                | ✓    | Simple      | ✓    |
| QWEN_CODER_2_5_32B | ✓    | Simple      | ✓    |

##### Groqモデル

| モデル                      | 温度 | JSONスキーマ | ツール |
|---------------------------|------|-------------|------|
| LLAMA_3_GROK_TOOL_USE_8B  | ✓    | Full        | ✓    |
| LLAMA_3_GROK_TOOL_USE_70B | ✓    | Full        | ✓    |

##### Graniteモデル

| モデル               | 温度 | JSONスキーマ | ツール | 視覚 (画像) |
|--------------------|------|-------------|------|-----------|
| GRANITE_3_2_VISION | ✓    | Simple      | ✓    | ✓         |

#### OpenRouterモデル

| モデル                | 温度 | JSONスキーマ | 補完 | 推測 | ツール | ツール選択 | 視覚 (画像) |
|---------------------|------|-------------|------|------|------|----------|-----------|
| Phi4Reasoning       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Claude3Opus         | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Claude3Sonnet       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Claude3Haiku        | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| GPT4                | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| GPT4o               | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| GPT4Turbo           | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| GPT35Turbo          | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Gemini15Pro         | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Gemini15Flash       | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Llama3              | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Llama3Instruct      | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Mistral7B           | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Mixtral8x7B         | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | -         |
| Claude3VisionSonnet | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Claude3VisionOpus   | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |
| Claude3VisionHaiku  | ✓    | Full        | ✓    | ✓    | ✓    | ✓        | ✓         |