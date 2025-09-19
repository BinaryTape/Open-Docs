# 構造化出力

## はじめに

構造化出力 API (Structured Output API) は、大規模言語モデル (LLM) からの応答が特定のデータ構造に準拠していることを保証する方法を提供します。
これは、自由形式のテキストではなく、予測可能で適切に整形されたデータが必要な信頼性の高い AI アプリケーションを構築する上で非常に重要です。

このページでは、この API を使用してデータ構造を定義し、スキーマを生成し、LLM から構造化された応答を要求する方法について説明します。

## 主要なコンポーネントと概念

構造化出力 API は、いくつかの主要なコンポーネントで構成されています。

1.  **データ構造の定義**: `kotlinx.serialization` および LLM 固有のアノテーションでアノテーションされた Kotlin データクラス。
2.  **JSON スキーマの生成**: Kotlin データクラスから JSON スキーマを生成するツール。
3.  **構造化 LLM リクエスト**: 定義された構造に準拠する LLM からの応答を要求するメソッド。
4.  **応答の処理**: 構造化された応答の処理と検証。

## データ構造の定義

構造化出力 API を使用する最初のステップは、Kotlin データクラスを使用してデータ構造を定義することです。

### 基本的な構造

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
@SerialName("WeatherForecast")
@LLMDescription("特定の場所の天気予報")
data class WeatherForecast(
    @property:LLMDescription("摂氏での気温")
    val temperature: Int,
    @property:LLMDescription("天気状況 (例: 晴れ、曇り、雨)")
    val conditions: String,
    @property:LLMDescription("降水確率 (パーセンテージ)")
    val precipitation: Int
)
```
<!--- KNIT example-structured-data-01.kt -->

### 主要なアノテーション

-   `@Serializable`: クラスが `kotlinx.serialization` で機能するために必要です。
-   `@SerialName`: シリアライズ時に使用する名前を指定します。
-   `@LLMDescription`: LLM に対してクラスの説明を提供します。フィールドのアノテーションには `@property:LLMDescription` を使用します。

### サポートされる機能

API は、広範なデータ構造機能をサポートしています。

#### ネストされたクラス

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
@SerialName("WeatherForecast")
data class WeatherForecast(
    // Other fields
    @property:LLMDescription("場所の座標")
    val latLon: LatLon
) {
    @Serializable
    @SerialName("LatLon")
    data class LatLon(
        @property:LLMDescription("場所の緯度")
        val lat: Double,
        @property:LLMDescription("場所の経度")
        val lon: Double
    )
}
```
<!--- KNIT example-structured-data-02.kt -->

#### コレクション (リストとマップ)

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import io.ktor.http.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WeatherNews(val temperature: Double)

@Serializable
data class WeatherSource(val url: Url)
-->
```kotlin
@Serializable
@SerialName("WeatherForecast")
data class WeatherForecast(
    // Other fields
    @property:LLMDescription("ニュース記事のリスト")
    val news: List<WeatherNews>,
    @property:LLMDescription("天気情報源のマップ")
    val sources: Map<String, WeatherSource>
)
```
<!--- KNIT example-structured-data-03.kt -->

#### Enum

<!--- INCLUDE
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
@SerialName("Pollution")
enum class Pollution { Low, Medium, High }
```
<!--- KNIT example-structured-data-04.kt -->

#### sealed クラスによるポリモーフィズム

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
@SerialName("WeatherAlert")
sealed class WeatherAlert {
    abstract val severity: Severity
    abstract val message: String

    @Serializable
    @SerialName("Severity")
    enum class Severity { Low, Moderate, Severe, Extreme }

    @Serializable
    @SerialName("StormAlert")
    data class StormAlert(
        override val severity: Severity,
        override val message: String,
        @property:LLMDescription("風速 (km/h)")
        val windSpeed: Double
    ) : WeatherAlert()

    @Serializable
    @SerialName("FloodAlert")
    data class FloodAlert(
        override val severity: Severity,
        override val message: String,
        @property:LLMDescription("予想降水量 (mm)")
        val expectedRainfall: Double
    ) : WeatherAlert()
}
```
<!--- KNIT example-structured-data-05.kt -->

### 例の提供

LLM が期待される形式を理解できるように、例を提供することができます。

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData03.WeatherNews
import ai.koog.agents.example.exampleStructuredData03.WeatherSource
import io.ktor.http.*
-->
```kotlin
val exampleForecasts = listOf(
  WeatherForecast(
    news = listOf(WeatherNews(0.0), WeatherNews(5.0)),
    sources = mutableMapOf(
      "openweathermap" to WeatherSource(Url("https://api.openweathermap.org/data/2.5/weather")),
      "googleweather" to WeatherSource(Url("https://weather.google.com"))
    )
    // Other fields
  ),
  WeatherForecast(
    news = listOf(WeatherNews(25.0), WeatherNews(35.0)),
    sources = mutableMapOf(
      "openweathermap" to WeatherSource(Url("https://api.openweathermap.org/data/2.5/weather")),
      "googleweather" to WeatherSource(Url("https://weather.google.com"))
    )
  )
)

```
<!--- KNIT example-structured-data-06.kt -->

## 構造化された応答の要求

Koog では、構造化された出力を使用できる主要なレイヤーが 3 つあります。

1.  **プロンプトエグゼキューター層**: プロンプトエグゼキューターを使用して直接 LLM 呼び出しを行う
2.  **エージェント LLM コンテキスト層**: 会話コンテキストのためにエージェントセッション内で使用する
3.  **ノード層**: 構造化された出力機能を備えた再利用可能なエージェントノードを作成する

### レイヤー 1: プロンプトエグゼキューター

プロンプトエグゼキューター層は、構造化された LLM 呼び出しを行う最も直接的な方法を提供します。単一のスタンドアロンリクエストには `executeStructured` メソッドを使用します。

このメソッドはプロンプトを実行し、以下の方法で応答が適切に構造化されるようにします。

-   [モデル機能](./model-capabilities.md)に基づいて、最適な構造化出力アプローチを自動的に選択します。
-   必要に応じて、構造化出力命令を元のプロンプトに挿入します。
-   利用可能な場合は、ネイティブの構造化出力サポートを使用します。
-   解析が失敗した場合は、補助的な LLM を介して自動エラー修正を提供します。

`executeStructured` メソッドの使用例を以下に示します。

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData06.exampleForecasts
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.structure.executeStructured
import ai.koog.prompt.structure.StructureFixingParser
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// シンプルな単一プロバイダープロンプトエグゼキューターを定義
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// 構造化された応答を返す LLM 呼び出しを行う
val structuredResponse = promptExecutor.executeStructured<WeatherForecast>(
        // プロンプトを定義 (システムメッセージとユーザーメッセージの両方)
        prompt = prompt("structured-data") {
            system(
                """
                あなたは天気予報アシスタントです。
                天気予報を求められたら、現実的だが架空の予報を提供してください。
                """.trimIndent()
            )
            user(
              "アムステルダムの天気予報は？"
            )
        },
        // リクエストを実行するメインモデルを定義
        model = OpenAIModels.CostOptimized.GPT4oMini,
        // オプション: モデルが形式を理解するのに役立つ例を提供
        examples = exampleForecasts,
        // オプション: エラー修正のための修正パーサーを提供
        fixingParser = StructureFixingParser(
            fixingModel = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
```
<!--- KNIT example-structured-data-07.kt -->

`executeStructured` メソッドは以下の引数を取ります。

| 名前           | データ型              | 必須 | デフォルト       | 説明                                                                                                  |
|----------------|------------------------|----------|---------------|-------------------------------------------------------------------------------------------------------|
| `prompt`       | Prompt                 | はい      |               | 実行するプロンプトです。詳細については、[Prompt API](prompt-api.md) を参照してください。              |
| `model`        | LLModel                | はい      |               | プロンプトを実行するメインモデルです。                                                                |
| `examples`     | List<T>                | いいえ       | `emptyList()` | モデルが期待される形式を理解するのに役立つ例のオプションリストです。                                  |
| `fixingParser` | StructureFixingParser? | いいえ       | `null`        | 不正な形式の応答を、補助的な LLM を使用して解析エラーをインテリジェントに修正することで処理するオプションのパーサーです。 |

このメソッドは、正常に解析された構造化データまたはエラーを含む `Result<StructuredResponse<T>>` を返します。

### レイヤー 2: エージェント LLM コンテキスト

エージェント LLM コンテキスト層では、エージェントセッション内で構造化された応答を要求できます。これは、フローの特定のポイントで構造化データが必要な会話エージェントを構築するのに役立ちます。

エージェントベースのインタラクションのために、`writeSession` 内で `requestLLMStructured` メソッドを使用します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData06.exampleForecasts
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<Unit, Unit>("strategy-name") {
    val node by node<Unit, Unit> {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val structuredResponse = llm.writeSession {
    requestLLMStructured<WeatherForecast>(
        examples = exampleForecasts,
        fixingParser = StructureFixingParser(
            fixingModel = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
}
```
<!--- KNIT example-structured-data-08.kt -->

`fixingParser` パラメーターは、リトライ中の補助 LLM 処理を介して不正な形式の応答を処理するための設定を指定します。これにより、常に有効な応答が得られるようになります。

#### エージェント戦略との統合

構造化データ処理をエージェント戦略に統合できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import ai.koog.prompt.structure.StructureFixingParser
-->
```kotlin
val agentStrategy = strategy("weather-forecast") {
    val setup by nodeLLMRequest()

    val getStructuredForecast by node<Message.Response, String> { _ ->
        val structuredResponse = llm.writeSession {
            requestLLMStructured<WeatherForecast>(
                fixingParser = StructureFixingParser(
                    fixingModel = OpenAIModels.Chat.GPT4o,
                    retries = 3
                )
            )
        }

        """
        応答構造:
        $structuredResponse
        """.trimIndent()
    }

    edge(nodeStart forwardTo setup)
    edge(setup forwardTo getStructuredForecast)
    edge(getStructuredForecast forwardTo nodeFinish)
}
```
<!--- KNIT example-structured-data-09.kt -->

### レイヤー 3: ノード層

ノード層は、エージェントワークフローにおける構造化出力のための最高レベルの抽象化を提供します。`nodeLLMRequestStructured` を使用して、構造化データを処理する再利用可能なエージェントノードを作成します。

これは、以下のエージェントノードを作成します。
-   `String` 入力 (ユーザーメッセージ) を受け取ります
-   メッセージを LLM プロンプトに追加します
-   LLM から構造化された出力を要求します
-   `Result<StructuredResponse<MyStruct>>` を返します

#### ノード層の例

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMRequestStructured
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData06.exampleForecasts
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.StructuredResponse
import ai.koog.prompt.structure.StructureFixingParser
-->
```kotlin
val agentStrategy = strategy("weather-forecast") {
    val setup by node<Unit, String> { _ ->
        "アムステルダムの天気予報を提供してください"
    }
    
    // デリゲート構文を使用して構造化出力ノードを作成
    val getWeatherForecast by nodeLLMRequestStructured<WeatherForecast>(
        name = "forecast-node",
        examples = exampleForecasts,
        fixingParser = StructureFixingParser(
            fixingModel = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
    
    val processResult by node<Result<StructuredResponse<WeatherForecast>>, String> { result ->
        when {
            result.isSuccess -> {
                val forecast = result.getOrNull()?.structure
                "天気予報: $forecast"
            }
            result.isFailure -> {
                "構造化された予報の取得に失敗しました: ${result.exceptionOrNull()?.message}"
            }
            else -> "不明な結果の状態"
        }
    }

    edge(nodeStart forwardTo setup)
    edge(setup forwardTo getWeatherForecast)
    edge(getWeatherForecast forwardTo processResult)
    edge(processResult forwardTo nodeFinish)
}
```
<!--- KNIT example-structured-data-10.kt -->

#### 完全なコードサンプル

構造化出力 API の使用例を以下に示します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.message.Message
import ai.koog.prompt.structure.json.generator.BasicJsonSchemaGenerator
import ai.koog.prompt.structure.json.JsonStructuredData
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
// 注: インポート文は簡潔にするために省略されています
@Serializable
@SerialName("SimpleWeatherForecast")
@LLMDescription("場所のシンプルな天気予報")
data class SimpleWeatherForecast(
    @property:LLMDescription("地点名")
    val location: String,
    @property:LLMDescription("摂氏での気温")
    val temperature: Int,
    @property:LLMDescription("天気状況 (例: 晴れ、曇り、雨)")
    val conditions: String
)

val token = System.getenv("OPENAI_KEY") ?: error("環境変数 OPENAI_KEY が設定されていません")

fun main(): Unit = runBlocking {
    // サンプルの予報を作成
    val exampleForecasts = listOf(
        SimpleWeatherForecast(
            location = "ニューヨーク",
            temperature = 25,
            conditions = "晴れ"
        ),
        SimpleWeatherForecast(
            location = "ロンドン",
            temperature = 18,
            conditions = "曇り"
        )
    )

    // JSON スキーマを生成
    val forecastStructure = JsonStructuredData.createJsonStructure<SimpleWeatherForecast>(
        schemaGenerator = BasicJsonSchemaGenerator.Default,
        examples = exampleForecasts
    )

    // エージェント戦略を定義
    val agentStrategy = strategy("weather-forecast") {
        val setup by nodeLLMRequest()
  
        val getStructuredForecast by node<Message.Response, String> { _ ->
            val structuredResponse = llm.writeSession {
                requestLLMStructured<SimpleWeatherForecast>()
            }
  
            """
            応答構造:
            $structuredResponse
            """.trimIndent()
        }
  
        edge(nodeStart forwardTo setup)
        edge(setup forwardTo getStructuredForecast)
        edge(getStructuredForecast forwardTo nodeFinish)
    }

    // エージェントを設定して実行
    val agentConfig = AIAgentConfig(
        prompt = prompt("weather-forecast-prompt") {
            system(
                """
                あなたは天気予報アシスタントです。
                天気予報を求められたら、現実的だが架空の予報を提供してください。
                """.trimIndent()
            )
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 5
    )

    val runner = AIAgent(
        promptExecutor = simpleOpenAIExecutor(token),
        toolRegistry = ToolRegistry.EMPTY,
        strategy = agentStrategy,
        agentConfig = agentConfig
    )

    runner.run("パリの天気予報を取得")
}
```
<!--- KNIT example-structured-data-11.kt -->

## 高度な使用法

上記の例では、モデル機能に基づいて最適な構造化出力アプローチを自動的に選択する簡易 API を示しました。
構造化出力プロセスをより詳細に制御するために、手動でのスキーマ作成とプロバイダー固有の設定を備えた高度な API を使用できます。

### 手動でのスキーマ作成と設定

自動スキーマ生成に頼る代わりに、`JsonStructuredData.createJsonStructure` を使用してスキーマを明示的に作成し、`StructuredOutput` クラスを介して構造化出力の動作を手動で設定できます。

主な違いは、`examples` や `fixingParser` のような単純なパラメーターを渡す代わりに、以下をきめ細かく制御できる `StructuredOutputConfig` オブジェクトを作成することです。

-   **スキーマ生成**: 特定のジェネレーター (Standard、Basic、またはプロバイダー固有) を選択
-   **出力モード**: ネイティブ構造化出力サポート 対 手動プロンプト
-   **プロバイダーマッピング**: 異なる LLM プロバイダーに対する異なる設定
-   **フォールバック戦略**: プロバイダー固有の設定が利用できない場合のデフォルトの動作

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData06.exampleForecasts
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.structure.executeStructured
import ai.koog.prompt.structure.StructuredOutput
import ai.koog.prompt.structure.StructuredOutputConfig
import ai.koog.prompt.structure.StructureFixingParser
import ai.koog.prompt.structure.json.JsonStructuredData
import ai.koog.prompt.structure.json.generator.StandardJsonSchemaGenerator
import ai.koog.prompt.executor.clients.openai.structure.OpenAIBasicJsonSchemaGenerator
import ai.koog.prompt.llm.LLMProvider
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 異なるジェネレーターで異なるスキーマ構造を作成
val genericStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = StandardJsonSchemaGenerator,
    examples = exampleForecasts
)

val openAiStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = OpenAIBasicJsonSchemaGenerator,
    examples = exampleForecasts
)

val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// 高度な API は、単純なパラメーターの代わりに StructuredOutputConfig を使用します
val structuredResponse = promptExecutor.executeStructured(
    prompt = prompt("structured-data") {
        system("あなたは天気予報アシスタントです。")
        user("アムステルダムの天気予報は？")
    },
    model = OpenAIModels.CostOptimized.GPT4oMini,
    config = StructuredOutputConfig(
        byProvider = mapOf(
            LLMProvider.OpenAI to StructuredOutput.Native(openAiStructure),
        ),
        default = StructuredOutput.Manual(genericStructure),
        fixingParser = StructureFixingParser(
            fixingModel = AnthropicModels.Haiku_3_5,
            retries = 2
        )
    )
)
```
<!--- KNIT example-structured-data-12.kt -->

### スキーマジェネレーター

ニーズに応じて、異なるスキーマジェネレーターが利用可能です。

-   **StandardJsonSchemaGenerator**: ポリモーフィズム、定義、再帰参照をサポートする完全な JSON スキーマ
-   **BasicJsonSchemaGenerator**: ポリモーフィズムのサポートがない簡易スキーマで、より多くのモデルと互換性があります
-   **Provider-specific generators**: 特定の LLM プロバイダー (OpenAI、Google など) 向けに最適化されたスキーマ

### すべてのレイヤーでの使用法

高度な設定は、API の 3 つのすべてのレイヤーで一貫して機能します。メソッド名は同じままですが、パラメーターが単純な引数からより高度な `StructuredOutputConfig` に変わります。

-   **プロンプトエグゼキューター**: `executeStructured(prompt, model, config: StructuredOutputConfig<T>)`
-   **エージェント LLM コンテキスト**: `requestLLMStructured(config: StructuredOutputConfig<T>)`
-   **ノード層**: `nodeLLMRequestStructured(config: StructuredOutputConfig<T>)`

簡易 API (`examples` および `fixingParser` パラメーターのみを使用) はほとんどのユースケースで推奨されますが、高度な API は必要に応じて追加の制御を提供します。

## ベストプラクティス

1.  **明確な説明を使用する**: LLM が期待されるデータを理解できるように、`@LLMDescription` アノテーションを使用して明確で詳細な説明を提供します。

2.  **例を提供する**: LLM をガイドするために、有効なデータ構造の例を含めます。

3.  **エラーを適切に処理する**: LLM が有効な構造を生成しない可能性がある場合に備え、適切なエラー処理を実装します。

4.  **適切なスキーマタイプを使用する**: ニーズと使用する LLM の機能に基づいて、適切なスキーマ形式とタイプを選択します。

5.  **異なるモデルでテストする**: LLM によっては、構造化された形式に従う能力が異なる場合があるため、可能であれば複数のモデルでテストしてください。

6.  **シンプルに始める**: シンプルな構造から始め、必要に応じて徐々に複雑さを追加します。

7.  **ポリモーフィズムを慎重に使用する**: API は sealed クラスによるポリモーフィズムをサポートしていますが、LLM が正しく処理するにはより困難になる可能性があることに注意してください。