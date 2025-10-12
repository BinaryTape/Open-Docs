# 結構化輸出

## 介紹

結構化輸出 API 提供了一種方法，以確保大型語言模型 (LLMs) 的回應符合特定的資料結構。這對於建構需要可預測、格式良好資料而非自由格式文字的可靠 AI 應用程式至關重要。

本頁說明如何使用此 API 來定義資料結構、產生 Schema，以及向 LLMs 請求結構化回應。

## 主要組成部分與概念

結構化輸出 API 包含幾個主要組成部分：

1.  **資料結構定義**：`Kotlin data class`，使用 `kotlinx.serialization` 和 LLM 特定註解進行註解。
2.  **JSON Schema 產生**：從 `Kotlin data class` 產生 `JSON Schema` 的工具。
3.  **結構化 LLM 請求**：向 `LLMs` 請求符合定義結構回應的方法。
4.  **回應處理**：處理和驗證結構化回應。

## 定義資料結構

使用結構化輸出 API 的第一步是使用 `Kotlin data class` 定義您的資料結構。

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

### 主要註解

-   `@Serializable`：`kotlinx.serialization` 處理類別所需。
-   `@SerialName`：指定序列化期間使用的名稱。
-   `@LLMDescription`：為 `LLM` 提供類別描述。對於欄位註解，請使用 `@property:LLMDescription`。

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

#### 集合 (列表和映射)

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

#### 密封類別的多型

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

### 提供範例

您可以提供範例，以幫助 `LLM` 理解預期的格式：

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

## 請求結構化回應

在 Koog 中，您可以在三個主要層級使用結構化輸出：

1.  **提示執行器層**：使用提示執行器進行直接的 `LLM` 呼叫
2.  **代理 LLM 上下文層**：在代理會話中用於對話式上下文
3.  **節點層**：建立具有結構化輸出功能的，可重複使用的代理節點

### 第 1 層：提示執行器

提示執行器層提供了進行結構化 `LLM` 呼叫最直接的方式。對於單一、獨立的請求，請使用 `executeStructured` 方法：

此方法執行提示並透過以下方式確保回應正確結構化：

-   根據 [模型功能](./model-capabilities.md) 自動選擇最佳的結構化輸出方法
-   必要時將結構化輸出指令注入原始提示
-   在可用時使用原生的結構化輸出支援
-   當解析失敗時，透過輔助 `LLM` 提供自動錯誤修正

以下是使用 `executeStructured` 方法的範例：

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
// Define a simple, single-provider prompt executor
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// Make an LLM call that returns a structured response
val structuredResponse = promptExecutor.executeStructured<WeatherForecast>(
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
        // Optional: provide examples to help the model understand the format
        examples = exampleForecasts,
        // Optional: provide a fixing parser for error correction
        fixingParser = StructureFixingParser(
            fixingModel = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
```
<!--- KNIT example-structured-data-07.kt -->

`executeStructured` 方法接受以下參數：

| 名稱           | 資料類型              | 必填 | 預設值       | 描述                                                                                                     |
|----------------|------------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------|
| `prompt`       | Prompt                 | 是       |               | 要執行的提示。更多資訊請參閱 [提示 API](prompt-api.md)。                                   |
| `model`        | LLModel                | 是       |               | 執行提示的主要模型。                                                                           |
| `examples`     | List&lt;T&gt;                | 否       | `emptyList()` | 可選的範例列表，以幫助模型理解預期的格式。                                     |
| `fixingParser` | StructureFixingParser? | 否       | `null`        | 可選的解析器，透過使用輔助 `LLM` 智慧地修正解析錯誤，來處理格式不正確的回應。 |

該方法回傳一個 `Result<StructuredResponse<T>>`，其中包含成功解析的結構化資料或錯誤。

### 第 2 層：代理 LLM 上下文

代理 `LLM` 上下文層允許您在代理會話中請求結構化回應。這對於建構在流程特定點需要結構化資料的對話式代理非常有用。

在 `writeSession` 中使用 `requestLLMStructured` 方法進行基於代理的互動：

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

`fixingParser` 參數指定了透過輔助 `LLM` 在重試期間處理格式不正確回應的配置。這有助於確保您始終獲得有效回應。

#### 與代理策略整合

您可以將結構化資料處理整合到您的代理策略中：

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
        Response structure:
        $structuredResponse
        """.trimIndent()
    }

    edge(nodeStart forwardTo setup)
    edge(setup forwardTo getStructuredForecast)
    edge(getStructuredForecast forwardTo nodeFinish)
}
```
<!--- KNIT example-structured-data-09.kt -->

### 第 3 層：節點層

節點層提供了代理工作流程中結構化輸出的最高抽象層級。使用 `nodeLLMRequestStructured` 來建立可重複使用且處理結構化資料的代理節點。

這會建立一個代理節點，它會：
-   接受 `String` 輸入 (使用者訊息)
-   將訊息附加到 `LLM` 提示
-   從 `LLM` 請求結構化輸出
-   回傳 `Result<StructuredResponse<MyStruct>>`

#### 節點層範例

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
        "Please provide a weather forecast for Amsterdam"
    }
    
    // Create a structured output node using delegate syntax
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
                "Weather forecast: $forecast"
            }
            result.isFailure -> {
                "Failed to get structured forecast: ${result.exceptionOrNull()?.message}"
            }
            else -> "Unknown result state"
        }
    }

    edge(nodeStart forwardTo setup)
    edge(setup forwardTo getWeatherForecast)
    edge(getWeatherForecast forwardTo processResult)
    edge(processResult forwardTo nodeFinish)
}
```
<!--- KNIT example-structured-data-10.kt -->

#### 完整程式碼範例

以下是使用結構化輸出 API 的完整範例：

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
                requestLLMStructured<SimpleWeatherForecast>()
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

## 進階用法

上述範例展示了簡化 API，它會根據模型功能自動選擇最佳的結構化輸出方法。如需對結構化輸出過程有更多控制，您可以使用進階 API，搭配手動建立 `Schema` 和特定供應商的配置。

### 手動建立 Schema 和配置

您可以不再依賴自動 `Schema` 產生，而是使用 `JsonStructuredData.createJsonStructure` 明確建立 `Schema`，並透過 `StructuredOutput` 類別手動配置結構化輸出行為。

關鍵區別在於，您不再傳遞像 `examples` 和 `fixingParser` 這樣簡單的參數，而是建立一個 `StructuredOutputConfig` 物件，該物件允許對以下方面進行細粒度控制：

-   **Schema 產生**：選擇特定的產生器（標準、基本或特定供應商）
-   **輸出模式**：原生結構化輸出支援 `vs` 手動提示
-   **供應商映射**：針對不同的 `LLM` 供應商採用不同的配置
-   **後備策略**：當特定供應商配置不可用時的預設行為

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
import ai.koog.prompt.executor.clients.openai.base.structure.OpenAIBasicJsonSchemaGenerator
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
// Create different schema structures with different generators
val genericStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = StandardJsonSchemaGenerator,
    examples = exampleForecasts
)

val openAiStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = OpenAIBasicJsonSchemaGenerator,
    examples = exampleForecasts
)

val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// The advanced API uses StructuredOutputConfig instead of simple parameters
val structuredResponse = promptExecutor.executeStructured(
    prompt = prompt("structured-data") {
        system("You are a weather forecasting assistant.")
        user("What is the weather forecast for Amsterdam?")
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

### Schema 產生器

根據您的需求，可以使用不同的 `Schema` 產生器：

-   **StandardJsonSchemaGenerator**：完整的 `JSON Schema`，支援多型、定義和遞迴引用
-   **BasicJsonSchemaGenerator**：簡化後的 `Schema`，不支援多型，與更多模型相容
-   **特定供應商的產生器**：針對特定 `LLM` 供應商（OpenAI、Google 等）優化的 `Schema`

### 跨所有層級的使用

進階配置在 API 的所有三個層級中都能保持一致。方法名稱保持不變，只有參數從簡單參數變為更進階的 `StructuredOutputConfig`：

-   **提示執行器**：`executeStructured(prompt, model, config: StructuredOutputConfig<T>)`
-   **代理 LLM 上下文**：`requestLLMStructured(config: StructuredOutputConfig<T>)`
-   **節點層**：`nodeLLMRequestStructured(config: StructuredOutputConfig<T>)`

簡化 API (僅使用 `examples` 和 `fixingParser` 參數) 推薦用於大多數使用情境，而進階 API 則在需要時提供額外控制。

## 最佳實踐

1.  **使用清晰的描述**：使用 `@LLMDescription` 註解提供清晰詳細的描述，以幫助 `LLM` 理解預期的資料。

2.  **提供範例**：包含有效資料結構的範例，以引導 `LLM`。

3.  **優雅地處理錯誤**：實作適當的錯誤處理，以應對 `LLM` 可能無法產生有效結構的情況。

4.  **使用適當的 Schema 類型**：根據您的需求和您所使用的 `LLM` 的功能選擇適當的 `Schema` 格式和類型。

5.  **使用不同模型進行測試**：不同的 `LLM` 可能在遵循結構化格式方面有不同的能力，因此如果可能，請使用多個模型進行測試。

6.  **從簡單開始**：從簡單的結構開始，並根據需要逐步增加複雜性。

7.  **謹慎使用多型**：儘管 API 支援密封類別的多型，但請注意，對於 `LLM` 來說，正確處理它可能更具挑戰性。