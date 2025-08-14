# 結構化資料處理

## 介紹

結構化資料處理 API 提供了一種方法，可確保大型語言模型 (LLM) 的回應符合特定的資料結構。這對於建構可靠的 AI 應用程式至關重要，因為您需要可預測、格式良好的資料，而不是自由形式的文字。

本頁說明如何使用結構化資料處理 API 來定義資料結構、產生綱要，以及從 LLM 請求結構化回應。

## 關鍵元件與概念

結構化資料處理 API 由幾個關鍵元件組成：

1.  **資料結構定義**：標註有 `kotlinx.serialization` 和 LLM 特定標註的 Kotlin 資料類別。
2.  **JSON 綱要產生**：從 Kotlin 資料類別產生 JSON 綱要的工具。
3.  **結構化 LLM 請求**：從 LLM 請求符合所定義結構的回應的方法。
4.  **回應處理**：處理並驗證結構化回應。

## 定義資料結構

使用結構化資料處理 API 的第一步是使用 Kotlin 資料類別定義您的資料結構。

### 基本結構

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
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
<!--- KNIT example-structured-data-01.kt -->

### 關鍵標註

-   `@Serializable`：`kotlinx.serialization` 需與該類別搭配使用。
-   `@SerialName`：指定序列化時使用的名稱。
-   `@LLMDescription`：為 LLM 提供類別的描述。對於欄位標註，請使用 `@property:LLMDescription`。

### 支援的功能

此 API 支援廣泛的資料結構功能：

#### 巢狀類別

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
<!--- KNIT example-structured-data-02.kt -->

#### 集合 (清單與映射)

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
    @property:LLMDescription("List of news articles")
    val news: List<WeatherNews>,
    @property:LLMDescription("Map of weather sources")
    val sources: Map<String, WeatherSource>
)
```
<!--- KNIT example-structured-data-03.kt -->

#### 列舉

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

#### 具密封類別的多型

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
<!--- KNIT example-structured-data-05.kt -->

## 產生 JSON 綱要

定義資料結構後，您可以使用 `JsonStructuredData` 類別從中產生 JSON 綱要：

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData07.exampleForecasts
import ai.koog.prompt.structure.json.generator.BasicJsonSchemaGenerator
import ai.koog.prompt.structure.json.JsonStructuredData
-->
```kotlin
val weatherForecastStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = BasicJsonSchemaGenerator.Default,
    examples = exampleForecasts
)
```
<!--- KNIT example-structured-data-06.kt -->

### 綱要格式選項

-   `JsonSchema`：標準 JSON 綱要格式。
-   `Simple`：一種簡化的綱要格式，可能與某些模型搭配使用效果更好，但有例如不支援多型等限制。

### 綱要類型選項

支援以下綱要類型

*   `SIMPLE`：一種簡化的綱要類型：
    -   僅支援標準 JSON 欄位
    -   不支援定義、URL 參考和遞迴檢查
    -   **不支援多型**
    -   由更多語言模型支援
    -   用於較簡單的資料結構

*   `FULL`：一種更全面的綱要類型：
    -   支援進階 JSON 綱要功能，包括定義、URL 參考和遞迴檢查
    -   **支援多型**：可與密封類別或介面及其實作搭配使用
    -   由較少語言模型支援
    -   用於具有繼承層次的複雜資料結構

### 提供範例

您可以提供範例以協助 LLM 了解預期的格式：

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
<!--- KNIT example-structured-data-07.kt -->

## 請求結構化回應

在 Koog 中有兩種請求結構化回應的方式：

-   使用提示執行器及其 `executeStructured` 或 `executeStructuredOneShot` 方法進行單次 LLM 呼叫。
-   為代理程式使用案例建立結構化輸出請求，並將其整合到代理程式策略中。

### 使用提示執行器

若要進行傳回結構化輸出的單次 LLM 呼叫，請使用提示執行器及其 `executeStructured` 方法。此方法執行提示並透過應用自動輸出強制轉型來確保回應結構正確。該方法透過以下方式增強結構化輸出解析的可靠性：

-   將結構化輸出指令注入原始提示中。
-   執行增強後的提示以接收原始回應。
-   如果直接解析失敗，則使用單獨的 LLM 呼叫來解析或強制轉型回應。

與 `[execute(prompt, structure)]` 僅嘗試解析原始回應並在格式不完全符合時失敗不同，此方法透過額外的 LLM 處理，主動將非結構化或格式錯誤的輸出轉換為預期的結構。

以下是使用 `executeStructured` 方法的範例：

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData06.weatherForecastStructure
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.structure.executeStructured
import ai.koog.prompt.structure.StructuredOutput
import ai.koog.prompt.structure.StructuredOutputConfig
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
        // Define the main model that will execute the request
        model = OpenAIModels.CostOptimized.GPT4oMini,
        // Provide the structured data configuration
        config = StructuredOutputConfig(
            default = StructuredOutput.Manual(weatherForecastStructure),
            fixingParser = StructureFixingParser(
                fixingModel = OpenAIModels.Chat.GPT4o,
                retries = 3
            )
        )
    )
```
<!--- KNIT example-structured-data-08.kt -->

該範例依賴於基於[已定義資料結構](#定義資料結構)和[範例](#提供範例)的，名為 `weatherForecastStructure` 的[已產生 JSON 綱要](#產生-JSON-綱要)。

`executeStructured` 方法接受以下引數：

| 名稱          | 資料類型       | 必填 | 預設                      | 描述                                                                                                                                              |
|---------------|----------------|------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `prompt`      | `Prompt`       | 是   |                           | 要執行的提示。如需更多資訊，請參閱 [Prompt API](prompt-api.md)。                                                                                     |
| `structure`   | `StructuredData` | 是   |                           | 包含綱要和解析邏輯的結構化資料定義。如需更多資訊，請參閱 [定義資料結構](#定義資料結構)。                                                           |
| `mainModel`   | `LLModel`      | 是   |                           | 執行提示的主要模型。                                                                                                                              |
| `retries`     | `Integer`      | 否   | `1`                       | 將回應解析為正確結構化輸出的嘗試次數。                                                                                                            |
| `fixingModel` | `LLModel`      | 否   | `OpenAIModels.Chat.GPT4o` | 處理輸出強制轉型（將格式錯誤的輸出轉換為預期結構）的模型。                                                                                        |

除了 `executeStructured`，您還可以將 `executeStructuredOneShot` 方法與提示執行器搭配使用。主要差異在於 `executeStructuredOneShot` 不會自動處理強制轉型，因此您必須手動將格式錯誤的輸出轉換為正確的結構化輸出。

`executeStructuredOneShot` 方法接受以下引數：

| 名稱        | 資料類型       | 必填 | 預設 | 描述                                       |
|-------------|----------------|------|------|--------------------------------------------|
| `prompt`    | `Prompt`       | 是   |      | 要執行的提示。                             |
| `structure` | `StructuredData` | 是   |      | 包含綱要和解析邏輯的結構化資料定義。       |
| `model`     | `LLModel`      | 是   |      | 執行提示的模型。                           |

### 代理程式使用案例的結構化資料回應

若要從 LLM 請求結構化回應，請在 `writeSession` 中使用 `requestLLMStructured` 方法：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleStructuredData06.weatherForecastStructure
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.StructuredOutput
import ai.koog.prompt.structure.StructuredOutputConfig
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
    this.requestLLMStructured(
        config = StructuredOutputConfig(
            default = StructuredOutput.Manual(weatherForecastStructure),
            fixingParser = StructureFixingParser(
                fixingModel = OpenAIModels.Chat.GPT4o,
                retries = 3
            )
        )
    )
}
```
<!--- KNIT example-structured-data-09.kt -->

`fixingModel` 參數指定了在重試期間用於重新解析或錯誤更正的語言模型。這有助於確保您始終獲得有效回應。

#### 與代理程式策略整合

您可以將結構化資料處理整合到您的代理程式策略中：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.example.exampleStructuredData06.weatherForecastStructure
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import ai.koog.prompt.structure.StructuredOutput
import ai.koog.prompt.structure.StructuredOutputConfig
import ai.koog.prompt.structure.StructureFixingParser
-->
```kotlin
val agentStrategy = strategy("weather-forecast") {
    val setup by nodeLLMRequest()

    val getStructuredForecast by node<Message.Response, String> { _ ->
        val structuredResponse = llm.writeSession {
            this.requestLLMStructured(
                config = StructuredOutputConfig(
                    default = StructuredOutput.Manual(weatherForecastStructure),
                    fixingParser = StructureFixingParser(
                        fixingModel = OpenAIModels.Chat.GPT4o,
                        retries = 3
                    )
                )
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
<!--- KNIT example-structured-data-10.kt -->

#### 完整程式碼範例

以下是使用結構化資料處理 API 的完整範例：

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
        schemaGenerator = BasicJsonSchemaGenerator.Default,
        examples = exampleForecasts
    )

    // Define the agent strategy
    val agentStrategy = strategy("weather-forecast") {
        val setup by nodeLLMRequest()
  
        val getStructuredForecast by node<Message.Response, String> { _ ->
            val structuredResponse = llm.writeSession {
                this.requestLLMStructured<SimpleWeatherForecast>()
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
<!--- KNIT example-structured-data-11.kt -->

## 最佳實踐

1.  **使用清晰的描述**：使用 `@LLMDescription` 標註提供清晰詳細的描述，以協助 LLM 了解預期的資料。

2.  **提供範例**：包含有效資料結構的範例，以引導 LLM。

3.  **優雅地處理錯誤**：實作適當的錯誤處理，以應對 LLM 可能無法產生有效結構的情況。

4.  **使用適當的綱要類型**：根據您的需求和所使用的 LLM 功能選擇適當的綱要格式和類型。

5.  **使用不同的模型進行測試**：不同的 LLM 在遵循結構化格式方面可能具有不同的能力，因此如果可能，請使用多個模型進行測試。

6.  **從簡入手**：從簡單的結構開始，並根據需要逐步增加複雜性。

7.  **謹慎使用多型**：雖然此 API 支援具密封類別的多型，但請注意，這對於 LLM 而言可能更難以正確處理。