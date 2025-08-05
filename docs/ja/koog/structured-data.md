# 構造化データ処理

## はじめに

構造化データ処理APIは、大規模言語モデル (LLM) からのレスポンスが特定のデータ構造に準拠することを保証する方法を提供します。
これは、自由形式のテキストではなく、予測可能で適切に整形されたデータが必要な信頼性の高いAIアプリケーションを構築するために非常に重要です。

このページでは、構造化データ処理APIを使用してデータ構造を定義し、スキーマを生成し、LLMに構造化されたレスポンスをリクエストする方法を説明します。

## 主要なコンポーネントと概念

構造化データ処理APIは、いくつかの主要なコンポーネントで構成されています。

1.  **データ構造の定義**: `kotlinx.serialization`およびLLM固有のアノテーションでアノテーションされたKotlinデータクラス。
2.  **JSONスキーマの生成**: KotlinデータクラスからJSONスキーマを生成するツール。
3.  **構造化されたLLMリクエスト**: 定義された構造に準拠するLLMからのレスポンスをリクエストするメソッド。
4.  **レスポンスの処理**: 構造化されたレスポンスの処理と検証。

## データ構造の定義

構造化データ処理APIを使用する最初のステップは、Kotlinデータクラスを使用してデータ構造を定義することです。

### 基本構造

```kotlin
@Serializable
@SerialName("WeatherForecast")
@LLMDescription("Weather forecast for a given location")
data class WeatherForecast(
    @property:LLMDescription("Temperature in Celsius")
    val temperature: Int,
    @property:LLMDescription("Weather conditions (e.g., sunny, cloudy, rainy)")
    val conditions: String,
    @property:LLMDescription("Chance of precipitation in percentage")
    val precipitation: Int
)
```

### 主要なアノテーション

-   `@Serializable`: クラスが`kotlinx.serialization`で動作するために必要です。
-   `@SerialName`: シリアライズ時に使用する名前を指定します。
-   `@LLMDescription`: LLMにクラスの説明を提供します。フィールドのアノテーションには、`@property:LLMDescription`を使用します。

### サポートされる機能

APIは広範なデータ構造機能をサポートしています。

#### ネストされたクラス

```kotlin
@Serializable
@SerialName("WeatherForecast")
data class WeatherForecast(
    // Other fields
    @property:LLMDescription("Coordinates of the location")
    val latLon: LatLon
) {
    @Serializable
    @SerialName("LatLon")
    data class LatLon(
        @property:LLMDescription("Latitude of the location")
        val lat: Double,
        @property:LLMDescription("Longitude of the location")
        val lon: Double
    )
}
```

#### コレクション (リストとマップ)

```kotlin
@Serializable
@SerialName("WeatherForecast")
data class WeatherForecast(
    // Other fields
    @property:LLMDescription("List of news articles")
    val news: List<WeatherNews>,
    @property:LLMDescription("Map of weather sources")
    val sources: Map<String, WeatherSource>
)
```

#### 列挙型

```kotlin
@Serializable
@SerialName("Pollution")
enum class Pollution { Low, Medium, High }
```

#### シールドクラスによるポリモーフィズム

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
        @property:LLMDescription("Wind speed in km/h")
        val windSpeed: Double
    ) : WeatherAlert()

    @Serializable
    @SerialName("FloodAlert")
    data class FloodAlert(
        override val severity: Severity,
        override val message: String,
        @property:LLMDescription("Expected rainfall in mm")
        val expectedRainfall: Double
    ) : WeatherAlert()
}
```

## JSONスキーマの生成

データ構造を定義したら、`JsonStructuredData`クラスを使用してそれらからJSONスキーマを生成できます。

```kotlin
val weatherForecastStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaFormat = JsonSchemaGenerator.SchemaFormat.JsonSchema,
    examples = exampleForecasts,
    schemaType = JsonStructuredData.JsonSchemaType.SIMPLE
)
```

### スキーマ形式のオプション

-   `JsonSchema`: 標準JSONスキーマ形式。
-   `Simple`: 一部のモデルでより効果的に機能する可能性がある簡略化されたスキーマ形式ですが、ポリモーフィズムのサポートがないなどの制限があります。

### スキーマタイプのオプション

以下のスキーマタイプがサポートされています。

*   `SIMPLE`: 簡略化されたスキーマタイプです。
    -   標準JSONフィールドのみをサポートします。
    -   定義、URL参照、再帰チェックをサポートしません。
    -   **ポリモーフィズムをサポートしません**。
    -   より多くの言語モデルでサポートされています。
    -   よりシンプルなデータ構造に使用されます。

*   `FULL`: より包括的なスキーマタイプです。
    -   定義、URL参照、再帰チェックを含む高度なJSONスキーマ機能をサポートします。
    -   **ポリモーフィズムをサポートします**: シールドクラスやインターフェースとその実装と連携できます。
    -   サポートする言語モデルは少なくなります。
    -   継承階層を持つ複雑なデータ構造に使用されます。

### 例の提供

LLMが期待される形式を理解するのに役立つ例を提供できます。

```kotlin
val exampleForecasts = listOf(
    WeatherForecast(
        temperature = 25,
        conditions = "Sunny",
        precipitation = 0,
        // Other fields
    ),
    WeatherForecast(
        temperature = 18,
        conditions = "Cloudy",
        precipitation = 30,
        // Other fields
    )
)
```

## 構造化されたレスポンスのリクエスト

Koogでは、構造化されたレスポンスをリクエストする方法が2つあります。

-   プロンプトエグゼキューターとその`executeStructured`または`executeStructuredOneShot`メソッドを使用して、単一のLLM呼び出しを行います。
-   エージェントのユースケースおよびエージェント戦略への統合のために構造化出力リクエストを作成します。

### プロンプトエグゼキューターの使用

構造化された出力を返す単一のLLM呼び出しを行うには、プロンプトエグゼキューターとその`executeStructured`メソッドを使用します。
このメソッドはプロンプトを実行し、自動出力強制を適用することで、レスポンスが適切に構造化されることを保証します。このメソッドは、以下の方法で構造化出力のパースの信頼性を高めます。

-   構造化出力の指示を元のプロンプトに注入します。
-   強化されたプロンプトを実行して、生のレスポンスを受け取ります。
-   直接のパースが失敗した場合、別のLLM呼び出しを使用してレスポンスをパースまたは強制変換します。

`[execute(prompt, structure)]`が単に生のレスポンスをパースしようとし、形式が正確に一致しない場合に失敗するのとは異なり、このメソッドは追加のLLM処理を通じて、非構造化または不正な形式の出力を期待される構造に変換するために積極的に機能します。

`executeStructured`メソッドの使用例を次に示します。

```kotlin
// Define a simple, single-provider prompt executor
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// Make an LLM call that returns a structured response
val structuredResponse = promptExecutor.executeStructured(
        // Define the prompt (both system and user messages)
        prompt = prompt("structured-data") {
            system(
                """
                You are a weather forecasting assistant.
                When asked for a weather forecast, provide a realistic but fictional forecast.
                """.trimIndent()
            )
            user(
              "What is the weather forecast for Amsterdam?"
            )
        },
        // Provide the expected data structure to the LLM
        structure = weatherForecastStructure,
        // Define the main model that will execute the request
        mainModel = OpenAIModels.CostOptimized.GPT4oMini,
        // Set the maximum number of retries to get a proper structured response
        retries = 5,
        // Set the LLM used for output coercion (transformation of malformed outputs)
        fixingModel = OpenAIModels.Chat.GPT4o
    )
```

この例は、[生成されたJSONスキーマ](#generating-json-schemas)（`weatherForecastStructure`という名前）に依存しており、これは[定義されたデータ構造](#defining-data-structures)と[例](#providing-examples)に基づいています。

`executeStructured`メソッドは以下の引数を取ります。

| 名前          | データ型      | 必須 | デフォルト                  | 説明                                                                                                                                     |
|---------------|----------------|------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `prompt`      | Prompt         | はい |                           | 実行するプロンプト。詳細については、[Prompt API](prompt-api.md)を参照してください。                                                                  |
| `structure`   | StructuredData | はい |                           | スキーマとパースロジックを持つ構造化データ定義。詳細については、[データ構造の定義](#defining-data-structures)を参照してください。 |
| `mainModel`   | LLModel        | はい |                           | プロンプトを実行するメインモデル。                                                                                                         |
| `retries`     | Integer        | いいえ | `1`                       | レスポンスを適切な構造化出力にパースする試行回数。                                                                                             |
| `fixingModel` | LLModel        | いいえ | `OpenAIModels.Chat.GPT4o` | 出力強制（不正な形式の出力を期待される構造に変換）を処理するモデル。                                                                               |

`executeStructured`に加えて、プロンプトエグゼキューターで`executeStructuredOneShot`メソッドを使用することもできます。主な違いは、`executeStructuredOneShot`が自動的に強制変換を処理しないため、不正な形式の出力を手動で適切な構造化されたものに変換する必要があることです。

`executeStructuredOneShot`メソッドは以下の引数を取ります。

| 名前        | データ型      | 必須 | デフォルト | 説明                                                   |
|-------------|----------------|------|------------|--------------------------------------------------------|
| `prompt`    | Prompt         | はい |            | 実行するプロンプト。                                   |
| `structure` | StructuredData | はい |            | スキーマとパースロジックを持つ構造化データ定義。       |
| `model`     | LLModel        | はい |            | プロンプトを実行するモデル。                           |

### エージェントのユースケースにおける構造化データレスポンス

LLMに構造化されたレスポンスをリクエストするには、`writeSession`内で`requestLLMStructured`メソッドを使用します。

```kotlin
val structuredResponse = llm.writeSession {
    this.requestLLMStructured(
        structure = weatherForecastStructure,
        fixingModel = OpenAIModels.Chat.GPT4o,
    )
}
```

`fixingModel`パラメーターは、リトライ時の再パースまたはエラー修正に使用する言語モデルを指定します。これにより、常に有効なレスポンスが得られるようにします。

#### エージェント戦略との統合

構造化データ処理をエージェント戦略に統合できます。

```kotlin
val agentStrategy = strategy("weather-forecast") {
    val setup by nodeLLMRequest()

    val getStructuredForecast by node<Message.Response, String> { _ ->
        val structuredResponse = llm.writeSession {
            this.requestLLMStructured(
                structure = forecastStructure,
                fixingModel = OpenAIModels.Chat.GPT4o,
            )
        }

        """
        Response structure:
        $structuredResponse
        """.trimIndent()
    }

    edge(nodeStart forwardTo setup)
    edge(setup forwardTo getStructuredForecast)
    edge(getStructuredForecast forwardTo nodeFinish)
}
```

#### 完全なコードサンプル

構造化データ処理APIを使用する完全な例を次に示します。

```kotlin
// Note: Import statements are omitted for brevity
@Serializable
@SerialName("SimpleWeatherForecast")
@LLMDescription("Simple weather forecast for a location")
data class SimpleWeatherForecast(
    @property:LLMDescription("Location name")
    val location: String,
    @property:LLMDescription("Temperature in Celsius")
    val temperature: Int,
    @property:LLMDescription("Weather conditions (e.g., sunny, cloudy, rainy)")
    val conditions: String
)

val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY is not set")

fun main(): Unit = runBlocking {
    // Create sample forecasts
    val exampleForecasts = listOf(
        SimpleWeatherForecast(
            location = "New York",
            temperature = 25,
            conditions = "Sunny"
        ),
        SimpleWeatherForecast(
            location = "London",
            temperature = 18,
            conditions = "Cloudy"
        )
    )

    // Generate JSON Schema
    val forecastStructure = JsonStructuredData.createJsonStructure<SimpleWeatherForecast>(
        schemaFormat = JsonSchemaGenerator.SchemaFormat.JsonSchema,
        examples = exampleForecasts,
        schemaType = JsonStructuredData.JsonSchemaType.SIMPLE
    )

    // Define the agent strategy
    val agentStrategy = strategy("weather-forecast") {
        val setup by nodeLLMRequest()
  
        val getStructuredForecast by node<Message.Response, String> { _ ->
            val structuredResponse = llm.writeSession {
                this.requestLLMStructured(
                    structure = forecastStructure,
                    fixingModel = OpenAIModels.Chat.GPT4o,
                )
            }
  
            """
            Response structure:
            $structuredResponse
            """.trimIndent()
        }
  
        edge(nodeStart forwardTo setup)
        edge(setup forwardTo getStructuredForecast)
        edge(getStructuredForecast forwardTo nodeFinish)
    }

    // Configure and run the agent
    val agentConfig = AIAgentConfig(
        prompt = prompt("weather-forecast-prompt") {
            system(
                """
                You are a weather forecasting assistant.
                When asked for a weather forecast, provide a realistic but fictional forecast.
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

    runner.run("Get weather forecast for Paris")
}
```

## ベストプラクティス

1.  **明確な説明を使用する**: `@LLMDescription`アノテーションを使用して明確で詳細な説明を提供し、LLMが期待されるデータを理解するのに役立てます。

2.  **例を提供する**: 有効なデータ構造の例を含め、LLMをガイドします。

3.  **エラーを適切に処理する**: LLMが有効な構造を生成しない場合に備えて、適切なエラー処理を実装します。

4.  **適切なスキーマタイプを使用する**: 必要に応じて、使用しているLLMの機能に基づいて適切なスキーマ形式とタイプを選択します。

5.  **異なるモデルでテストする**: 異なるLLMは構造化された形式に従う能力が異なる場合があるため、可能であれば複数のモデルでテストします。

6.  **シンプルに始める**: シンプルな構造から始め、必要に応じて徐々に複雑さを追加します。

7.  **ポリモーフィズムの慎重な使用**: APIはシールドクラスによるポリモーフィズムをサポートしていますが、LLMが正しく処理することがより難しい場合があることに注意してください。