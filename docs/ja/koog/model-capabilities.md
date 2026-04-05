Koogは、さまざまなLLMプロバイダーのLarge Language Models（LLM）を、プロバイダーに依存しない方法で扱うための抽象化と実装のセットを提供します。このセットには以下のクラスが含まれています。

- **LLMCapability**: LLMがサポートできるさまざまな機能を定義するクラス階層です。例として以下のようなものがあります：
    - 応答のランダム性を制御するためのTemperature（温度）調整
    - 外部システムとの連携のためのツール統合
    - 視覚データを扱うためのビジョン処理
    - ベクトル表現のための埋め込み（Embedding）生成
    - テキスト生成タスクのための補完（Completion）
    - 構造化データ（SimpleおよびFullバリアントのJSON）のスキーマサポート
    - 探索的な応答のための推測（Speculation）

- **LLModel**: プロバイダー、一意識別子、およびサポートされる機能を備えた特定のLLMを表すデータクラスです。

これは、統一された方法で異なるLLMプロバイダーと対話するための基盤として機能し、プロバイダー固有の詳細を抽象化しながら、アプリケーションがさまざまなモデルで動作できるようにします。

## LLMの機能 (LLM capabilities)

LLMの機能は、Large Language Modelがサポートできる特定の機能や特性を表します。Koogフレームワークでは、機能を使用して特定のモデルができることや、その設定方法を定義します。各機能は、`LLMCapability`クラスのサブクラスまたはデータオブジェクトとして表されます。

アプリケーションで使用するためにLLMを設定する際、`LLModel`インスタンスを作成する時に`capabilities`リストに機能を追加することで、そのモデルがサポートする機能を指定します。これにより、フレームワークはモデルと適切に対話し、その機能を適切に使用できるようになります。

### コア機能

以下のリストには、Koogフレームワークのモデルで利用可能な、コアとなるLLM固有の機能が含まれています。

- **推測** (`LLMCapability.Speculation`): モデルが、さまざまな可能性の程度を伴う推測的または探索的な応答を生成できるようにします。より広範な潜在的結果が望まれる、創造的または仮説的なシナリオに有用です。

- **Temperature** (`LLMCapability.Temperature`): モデルの応答のランダム性や創造性のレベルを調整できるようにします。Temperatureの値が高いほど多様な出力が生成され、低いほど集中的で決定論的な応答になります。

- **ツール** (`LLMCapability.Tools`): 外部ツールの使用または統合のサポートを示します。この機能により、モデルは特定のツールを実行したり、外部システムと対話したりできます。

- **ツール選択** (`LLMCapability.ToolChoice`): LLMでのツール呼び出しの動作を設定します。モデルに応じて、以下のように設定できます：
    - テキスト生成かツール呼び出しのどちらかを自動的に選択する
    - ツール呼び出しのみを生成し、テキストは生成しない
    - テキストのみを生成し、ツール呼び出しは行わない
    - 定義されたツールの中から特定のツールの呼び出しを強制する

- **複数の選択肢** (`LLMCapability.MultipleChoices`): 単一のプロンプトに対して、モデルが複数の独立した返答の選択肢を生成できるようにします。

### メディア処理機能

以下のリストは、画像や音声などのメディアコンテンツを処理するための機能のセットを表しています。

- **ビジョン** (`LLMCapability.Vision`): 視覚データから洞察を処理、分析、推論するビジョンベースの機能のためのクラスです。
  以下のタイプの視覚データをサポートしています：
    - **画像** (`LLMCapability.Vision.Image`): 画像分析、認識、解釈などの画像関連のビジョンタスクを処理します。
    - **ビデオ** (`LLMCapability.Vision.Video`): ビデオコンテンツの分析や理解を含む、ビデオデータを処理します。

- **オーディオ** (`LLMCapability.Audio`): 文字起こし、オーディオ生成、またはオーディオベースのインタラクションなどのオーディオ関連機能を提供します。

- **ドキュメント** (`LLMCapability.Document`): ドキュメントベースの入力および出力の処理を可能にします。

### テキスト処理機能

以下の機能リストは、テキスト生成および処理機能を表しています。

- **埋め込み** (`LLMCapability.Embed`): モデルが入力テキストからベクトル埋め込み（embeddings）を生成できるようにし、類似性の比較、クラスタリング、その他のベクトルベースの分析を可能にします。

- **補完** (`LLMCapability.Completion`): 文章の補完、提案の生成、入力データに沿ったコンテンツの作成など、与えられた入力コンテキストに基づいたテキストやコンテンツの生成を含みます。

- **プロンプトキャッシュ** (`LLMCapability.PromptCaching`): プロンプトのキャッシュ機能をサポートし、繰り返しのクエリや類似のクエリに対するパフォーマンスを向上させる可能性があります。

- **モデレーション** (`LLMCapability.Moderation`): モデルがテキストを有害な可能性のあるコンテンツについて分析し、ハラスメント、ヘイトスピーチ、自傷行為、性的コンテンツ、暴力などのさまざまなカテゴリに従って分類できるようにします。

### スキーマ機能

以下のリストは、構造化データの処理に関連する機能を示しています。

- **スキーマ** (`LLMCapability.Schema`): 特定のフォーマットを使用したデータのやり取りやエンコードに関連する、構造化スキーマ機能のためのクラスです。
  以下のフォーマットのサポートが含まれます：
    - **JSON** (`LLMCapability.Schema.JSON`): 異なるレベルのJSONスキーマサポート：
        - **Basic** (`LLMCapability.Schema.JSON.Basic`): 軽量または基本的なJSON処理機能を提供します。
        - **Standard** (`LLMCapability.Schema.JSON.Standard`): 複雑なデータ構造に対する包括的なJSONスキーマサポートを提供します。

## モデル（LLModel）設定の作成

汎用的でプロバイダーに依存しない方法でモデルを定義するには、以下のパラメータを使用して`LLModel`クラスのインスタンスとしてモデル設定を作成します。

| 名前 | データ型 | 必須 | デフォルト | 説明 |
|-------------------|---------------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `provider` | LLMProvider | はい | | GoogleやOpenAIなど、LLM의プロバイダー。これはモデルを作成またはホストしている企業や組織を識別します。 |
| `id` | String | はい | | LLMインスタンスの一意識別子。これは通常、特定のモデルのバージョンや名前を表します。例：`gpt-4-turbo`、`claude-3-opus`、`llama-3-2`。 |
| `capabilities` | List&lt;LLMCapability&gt; | はい | | Temperature調整、ツールの使用、またはスキーマベースのタスクなど、LLMによってサポートされる機能のリスト。これらの機能は、モデルができることとその設定方法を定義します。 |
| `contextLength` | Long | はい | | LLMのコンテキスト長。これはLLMが処理できる最大トークン数です。 |
| `maxOutputTokens` | Long | いいえ | `null` | プロバイダーによって生成可能なLLMの最大トークン数。 |

### 例

このセクションでは、異なる機能を備えた`LLModel`インスタンスを作成する詳細な例を紹介します。

以下のコードは、コア機能を備えた基本的なLLM設定を表しています。

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

以下のモデル設定は、ビジョン機能を備えたマルチモーダルLLMです。

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

オーディオ処理機能を備えたLLM：

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

`LLModel`インスタンスとしてモデルを作成し、関連するすべてのパラメータを指定する必要があることに加え、Koogには事前定義されたモデルと、サポートされる機能を備えたそれらの設定のコレクションが含まれています。
事前定義されたOllamaモデルを使用するには、以下のように指定します。

<!--- INCLUDE
import ai.koog.prompt.executor.ollama.client.OllamaModels

-->

```kotlin
val metaModel = OllamaModels.Meta.LLAMA_3_2
```

<!--- KNIT example-model-capabilities-04.kt -->

モデルが特定の機能をサポートしているかどうかを確認するには、`contains`メソッドを使用して、`capabilities`リスト内にその機能が存在するかどうかをチェックします。

<!--- INCLUDE
import ai.koog.prompt.llm.LLMCapability
import ai.koog.prompt.executor.ollama.client.OllamaModels

val basicModel = OllamaModels.Meta.LLAMA_3_2
val visionModel = OllamaModels.Meta.LLAMA_3_2

-->

```kotlin
// モデルが特定の機能をサポートしているかチェック
val supportsTools = basicModel.supports(LLMCapability.Tools) // true
val supportsVideo = visionModel.supports(LLMCapability.Vision.Video) // false

// スキーマ機能をチェック
val jsonCapability = basicModel.capabilities?.filterIsInstance<LLMCapability.Schema.JSON>()?.firstOrNull()
val hasFullJsonSupport = jsonCapability is LLMCapability.Schema.JSON.Standard // true
```

<!--- KNIT example-model-capabilities-05.kt -->

### モデル別LLM機能

このリファレンスは、各プロバイダーのモデルごとにどのLLM機能がサポートされているかを示しています。

以下の表において：

- `✓` はモデルがその機能をサポートしていることを示します
- `-` はモデルがその機能をサポートしていないことを示します
- JSON Schemaについては、`Full`または`Simple`が、そのモデルがサポートしているJSON Schema機能のバリアントを示します

??? "Googleモデル"
    #### Googleモデル

    | モデル | Temperature | JSON Schema | 補完 | 複数の選択肢 | ツール | ツール選択 | ビジョン (画像) | ビジョン (ビデオ) | オーディオ |
    |------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|
    | Gemini2_5Pro | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_5Flash | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_5FlashLite | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_0Flash | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_0Flash001 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_0FlashLite | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_0FlashLite001 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

??? "OpenAIモデル"
    #### OpenAIモデル

    | モデル | Temperature | JSON Schema | 補完 | 複数の選択肢 | ツール | ツール選択 | ビジョン (画像) | ビジョン (ビデオ) | オーディオ | 推測 | モデレーション |
    |--------------------------|-------------|-------------|------------|------------------|-------|-------------|----------------|----------------|-------|-------------|------------|
    | Reasoning.O4Mini | - | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Reasoning.O3Mini | - | Full | ✓ | ✓ | ✓ | ✓ | - | - | - | ✓ | - |
    | Reasoning.O3 | - | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Reasoning.O1 | - | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Chat.GPT4o | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Chat.GPT4_1 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Chat.GPT5 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Chat.GPT5Mini | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Chat.GPT5Nano | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Audio.GptAudio | ✓ | - | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - |
    | Audio.GPT4oMiniAudio | ✓ | - | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - |
    | Audio.GPT4oAudio | ✓ | - | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - |
    | CostOptimized.GPT4_1Nano | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | CostOptimized.GPT4_1Mini | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | CostOptimized.GPT4oMini | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - |
    | Moderation.Omni | - | - | - | - | - | - | ✓ | - | - | - | ✓ |

??? "Anthropicモデル"
    #### Anthropicモデル

    | モデル | Temperature | JSON Schema | 補完 | ツール | ツール選択 | ビジョン (画像) |
    |------------|-------------|-------------|------------|-------|-------------|----------------|
    | Opus_4_6 | ✓ | Full | ✓ | ✓ | ✓ | ✓ |
    | Opus_4_5 | ✓ | Full | ✓ | ✓ | ✓ | ✓ |
    | Opus_4_1 | ✓ | - | ✓ | ✓ | ✓ | ✓ |
    | Opus_4 | ✓ | - | ✓ | ✓ | ✓ | ✓ |
    | Sonnet_4_6 | ✓ | Full | ✓ | ✓ | ✓ | ✓ |
    | Sonnet_4_5 | ✓ | Full | ✓ | ✓ | ✓ | ✓ |
    | Sonnet_4 | ✓ | - | ✓ | ✓ | ✓ | ✓ |
    | Haiku_4_5 | ✓ | Full | ✓ | ✓ | ✓ | ✓ |
    | Haiku_3 | ✓ | - | ✓ | ✓ | ✓ | ✓ |

??? "Ollamaモデル"
    #### Ollamaモデル

    ##### Metaモデル

    | モデル | Temperature | JSON Schema | ツール | モデレーション |
    |---------------|-------------|-------------|-------|------------|
    | LLAMA_3_2_3B | ✓ | Simple | ✓ | - |
    | LLAMA_3_2 | ✓ | Simple | ✓ | - |
    | LLAMA_4 | ✓ | Simple | ✓ | - |
    | LLAMA_GUARD_3 | - | - | - | ✓ |

    ##### Alibabaモデル

    | モデル | Temperature | JSON Schema | ツール |
    |--------------------|-------------|-------------|-------|
    | QWEN_2_5_05B | ✓ | Simple | ✓ |
    | QWEN_3_06B | ✓ | Simple | ✓ |
    | QWQ | ✓ | Simple | ✓ |
    | QWEN_CODER_2_5_32B | ✓ | Simple | ✓ |

    ##### Groqモデル

    | モデル | Temperature | JSON Schema | ツール |
    |---------------------------|-------------|-------------|-------|
    | LLAMA_3_GROK_TOOL_USE_8B | ✓ | Full | ✓ |
    | LLAMA_3_GROK_TOOL_USE_70B | ✓ | Full | ✓ |

    ##### Graniteモデル

    | モデル | Temperature | JSON Schema | ツール | ビジョン (画像) |
    |--------------------|-------------|-------------|-------|----------------|
    | GRANITE_3_2_VISION | ✓ | Simple | ✓ | ✓ |

??? "DeepSeekモデル"
    #### DeepSeekモデル

    | モデル | Temperature | JSON Schema | 補完 | 推測 | ツール | ツール選択 | ビジョン (画像) |
    |------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | DeepSeekChat | ✓ | Full | ✓ | - | ✓ | ✓ | - |
    | DeepSeekReasoner | ✓ | Full | ✓ | - | ✓ | ✓ | - |

??? "OpenRouterモデル"
    #### OpenRouterモデル

    | モデル | Temperature | JSON Schema | 補完 | 推測 | ツール | ツール選択 | ビジョン (画像) |
    |---------------------|-------------|-------------|------------|-------------|-------|-------------|----------------|
    | Phi4Reasoning | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Claude3Opus | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3Sonnet | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3Haiku | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3_5Sonnet | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3_7Sonnet | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude4Sonnet | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude4_1Opus | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | GPT4oMini | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | GPT5 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | GPT5Mini | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | GPT5Nano | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | GPT_OSS_120b | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | GPT4 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | GPT4o | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | GPT4Turbo | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | GPT35Turbo | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Llama3 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Llama3Instruct | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Mistral7B | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Mixtral8x7B | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Claude3VisionSonnet | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3VisionOpus | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Claude3VisionHaiku | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | DeepSeekV30324 | ✓ | Full | ✓ | ✓ | ✓ | ✓ | - |
    | Gemini2_5FlashLite | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_5Flash | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |
    | Gemini2_5Pro | ✓ | Full | ✓ | ✓ | ✓ | ✓ | ✓ |