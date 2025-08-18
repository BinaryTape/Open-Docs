# 结构化数据处理

## 简介

结构化数据处理 API 提供了一种方式，可确保大型语言模型（LLM）的响应符合特定的数据结构。
这对于构建需要可预测、格式良好数据而非自由文本的可靠 AI 应用程序至关重要。

本页解释了如何使用结构化数据处理 API 来定义数据结构、生成 Schema，并请求 LLM 返回结构化响应。

## 关键组成部分和概念

结构化数据处理 API 包含几个关键组成部分：

1. **数据结构定义**：使用 kotlinx.serialization 和 LLM 特有注解标注的 Kotlin 数据类。
2. **JSON Schema 生成**：从 Kotlin 数据类生成 JSON Schema 的工具。
3. **结构化 LLM 请求**：请求 LLM 返回符合所定义结构响应的方法。
4. **响应处理**：处理和校验结构化响应。

## 定义数据结构

使用结构化数据处理 API 的第一步是使用 Kotlin 数据类定义你的数据结构。

### 基本结构

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

### 关键注解

- `@Serializable`：kotlinx.serialization 与该类协同工作所需。
- `@SerialName`：指定序列化时使用的名称。
- `@LLMDescription`：为 LLM 提供类的描述。对于字段注解，请使用 `@property:LLMDescription`。

### 支持的特性

此 API 支持广泛的数据结构特性：

#### 嵌套类

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

#### 集合（list 和 map）

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

#### 枚举

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

#### 带密封类的多态

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

## 生成 JSON Schema

定义数据结构后，你可以使用 `JsonStructuredData` 类从它们生成 JSON Schema：

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

### Schema 格式选项

- `JsonSchema`：标准 JSON Schema 格式。
- `Simple`：一种简化的 Schema 格式，可能更适用于某些模型，但存在局限性，例如不支持多态。

### Schema 类型选项

支持以下 Schema 类型：

* `SIMPLE`：一种简化的 Schema 类型：
    - 仅支持标准 JSON 字段
    - 不支持定义、URL 引用和递归检测
    - **不支持多态**
    - 被更多语言模型支持
    - 用于更简单的数据结构

* `FULL`：一种更全面的 Schema 类型：
    - 支持高级 JSON Schema 功能，包括定义、URL 引用和递归检测
    - **支持多态**：可与密封类或接口及其实现协同工作
    - 被较少语言模型支持
    - 用于具有继承层次结构的复杂数据结构

### 提供示例

你可以提供示例来帮助 LLM 理解预期的格式：

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

## 请求结构化响应

在 Koog 中，有两种方式请求结构化响应：

- 使用提示执行器及其 `executeStructured` 或 `executeStructuredOneShot` 方法进行单次 LLM 调用。
- 为代理用例和集成到代理策略中创建结构化输出请求。

### 使用提示执行器

要进行返回结构化输出的单次 LLM 调用，请使用提示执行器及其 `executeStructured` 方法。
此方法通过应用自动输出强制转换来执行提示并确保响应格式正确。此方法通过以下方式增强了结构化输出解析的可靠性：

- 将结构化输出指令注入原始提示。
- 执行丰富后的提示以接收原始响应。
- 如果直接解析失败，则使用单独的 LLM 调用来解析或强制转换响应。

与 `[execute(prompt, structure)]` 仅尝试解析原始响应并在格式不完全匹配时失败不同，此方法通过额外的 LLM 处理，主动将非结构化或格式错误的输出转换为预期结构。

以下是使用 `executeStructured` 方法的示例：

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

该示例依赖于已基于[已定义的数据结构](#defining-data-structures)和[示例](#providing-examples)而[生成 JSON Schema](#generating-json-schemas) 的 `weatherForecastStructure`。

`executeStructured` 方法接受以下实参：

| 名称          | 数据类型      | 必需 | 默认                   | 描述                                                                                                                                    |
|---------------|----------------|----------|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `prompt`      | Prompt         | 是      |                           | 要执行的提示。关于……请参见[提示 API](prompt-api.md)。                                                                  |
| `structure`   | StructuredData | 是      |                           | 具有 Schema 和解析逻辑的结构化数据定义。关于……请参见[定义数据结构](#defining-data-structures)。 |
| `mainModel`   | LLModel        | 是      |                           | 执行提示的主模型。                                                                                                          |
| `retries`     | Integer        | 否       | `1`                       | 将响应解析为正确结构化输出的尝试次数。                                                                                                 |
| `fixingModel` | LLModel        | 否       | `OpenAIModels.Chat.GPT4o` | 处理输出强制转换的模型——将格式错误的输出转换为预期结构。                                      |

除了 `executeStructured`，你还可以将 `executeStructuredOneShot` 方法与提示执行器一起使用。主要区别在于 `executeStructuredOneShot` 不会自动处理强制转换，因此你必须手动将格式错误的输出转换为正确的结构化输出。

`executeStructuredOneShot` 方法接受以下实参：

| 名称        | 数据类型      | 必需 | 默认 | 描述                                                   |
|-------------|----------------|----------|---------|---------------------------------------------------------------|
| `prompt`    | Prompt         | 是      |         | 要执行的提示。                                        |
| `structure` | StructuredData | 是      |         | 具有 Schema 和解析逻辑的结构化数据定义。 |
| `model`     | LLModel        | 是      |         | 执行提示的模型。                              |

### 代理用例的结构化数据响应

要从 LLM 请求结构化响应，请在 `writeSession` 中使用 `requestLLMStructured` 方法：

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

`fixingModel` 形参指定用于在重试期间重新解析或错误校正的语言模型。这有助于确保你始终获得有效响应。

#### 与代理策略集成

你可以将结构化数据处理集成到你的代理策略中：

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

#### 完整代码示例

以下是使用结构化数据处理 API 的完整示例：

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

## 最佳实践

1. **使用清晰的描述**：使用 `@LLMDescription` 注解提供清晰详细的描述，帮助 LLM 理解预期数据。

2. **提供示例**：包含有效数据结构的示例以指导 LLM。

3. **优雅地处理错误**：实现适当的错误处理以应对 LLM 可能无法生成有效结构的情况。

4. **使用适当的 Schema 类型**：根据你的需求和所用 LLM 的能力选择适当的 Schema 格式和类型。

5. **用不同模型进行测试**：不同的 LLM 可能在遵循结构化格式方面的能力各异，因此如果可能，请使用多个模型进行测试。

6. **从简单开始**：从简单的结构开始，并根据需要逐步增加复杂性。

7. **谨慎使用多态**：尽管 API 支持带密封类的多态，但请注意，这对 LLM 来说可能更难正确处理。