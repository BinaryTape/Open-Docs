# 结构化输出

## 简介

结构化输出 API 提供了一种方式，可确保大型语言模型 (LLM) 的响应符合特定的数据结构。
这对于构建可靠的 AI 应用程序至关重要，因为你需要可预测、格式良好的数据，而非自由格式文本。

本文将解释如何使用此 API 定义数据结构、生成模式，并从 LLM 请求结构化响应。

## 关键组件和概念

结构化输出 API 包含几个关键组件：

1.  **数据结构定义**：使用 kotlinx.serialization 和 LLM 特有注解标注的 Kotlin 数据类。
2.  **JSON 模式生成**：从 Kotlin 数据类生成 JSON 模式的工具。
3.  **结构化 LLM 请求**：请求 LLM 响应符合定义结构的方法。
4.  **响应处理**：处理和验证结构化响应。

## 定义数据结构

使用结构化输出 API 的第一步是使用 Kotlin 数据类定义你的数据结构。

### 基本结构

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
@SerialName("WeatherForecast")
@LLMDescription("给定位置的天气预报")
data class WeatherForecast(
    @property:LLMDescription("摄氏温度")
    val temperature: Int,
    @property:LLMDescription("天气状况（例如：晴朗、多云、有雨）")
    val conditions: String,
    @property:LLMDescription("降水概率（百分比）")
    val precipitation: Int
)
```
<!--- KNIT example-structured-data-01.kt -->

### 关键注解

-   `@Serializable`：kotlinx.serialization 用于处理该类所必需的。
-   `@SerialName`：指定在序列化期间使用的名称。
-   `@LLMDescription`：为 LLM 提供类的描述。对于字段注解，请使用 `@property:LLMDescription`。

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
    @property:LLMDescription("位置坐标")
    val latLon: LatLon
) {
    @Serializable
    @SerialName("LatLon")
    data class LatLon(
        @property:LLMDescription("位置纬度")
        val lat: Double,
        @property:LLMDescription("位置经度")
        val lon: Double
    )
}
```
<!--- KNIT example-structured-data-02.kt -->

#### 集合 (list 和 map)

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
    @property:LLMDescription("新闻文章 list")
    val news: List<WeatherNews>,
    @property:LLMDescription("天气源 map")
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

#### 密封类多态

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
        @property:LLMDescription("风速（公里/小时）")
        val windSpeed: Double
    ) : WeatherAlert()

    @Serializable
    @SerialName("FloodAlert")
    data class FloodAlert(
        override val severity: Severity,
        override val message: String,
        @property:LLMDescription("预期降雨量（毫米）")
        val expectedRainfall: Double
    ) : WeatherAlert()
}
```
<!--- KNIT example-structured-data-05.kt -->

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
<!--- KNIT example-structured-data-06.kt -->

## 请求结构化响应

你可以在 Koog 的三个主要层中使用结构化输出：

1.  **提示执行器层**：使用提示执行器进行直接的 LLM 调用
2.  **Agent LLM 上下文层**：在 Agent 会话中使用，用于对话上下文
3.  **节点层**：创建具有结构化输出功能的、可重用的 Agent 节点

### 第 1 层：提示执行器

提示执行器层提供了进行结构化 LLM 调用的最直接方式。对单个、独立的请求使用 `executeStructured` 方法：

此方法执行提示并确保响应的结构化，通过以下方式实现：

-   根据 [模型能力](./model-capabilities.md) 自动选择最佳结构化输出方法
-   在需要时将结构化输出指令注入到原始提示中
-   在可用时使用原生结构化输出支持
-   在解析失败时，通过辅助 LLM 提供自动错误校正

以下是使用 `executeStructured` 方法的示例：

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
// 定义一个简单的、单提供者的提示执行器
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// 进行一个返回结构化响应的 LLM 调用
val structuredResponse = promptExecutor.executeStructured<WeatherForecast>(
        // 定义提示（包括系统和用户消息）
        prompt = prompt("structured-data") {
            system(
                """
                你是一个天气预报助手。
                当被询问天气预报时，提供一个真实但虚构的预报。
                """.trimIndent()
            )
            user(
              "What is the weather forecast for Amsterdam?"
            )
        },
        // 定义执行请求的主模型
        model = OpenAIModels.CostOptimized.GPT4oMini,
        // 可选：提供示例以帮助模型理解格式
        examples = exampleForecasts,
        // 可选：提供一个修复解析器用于错误校正
        fixingParser = StructureFixingParser(
            fixingModel = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
```
<!--- KNIT example-structured-data-07.kt -->

`executeStructured` 方法接受以下实参：

| 名称           | 数据类型              | 必需 | 默认       | 描述                                                                                                     |
| :------------- | :-------------------- | :--- | :---------- | :------------------------------------------------------------------------------------------------------- |
| `prompt`       | Prompt                | 是   |             | 要执行的提示。关于提示的更多信息，请参见 [提示 API](prompt-api.md)。                                     |
| `model`        | LLModel               | 是   |             | 执行提示的主模型。                                                                                       |
| `examples`     | List&lt;T&gt;               | 否   | `emptyList()` | 可选的示例 list，用于帮助模型理解预期格式。                                                              |
| `fixingParser` | StructureFixingParser? | 否   | `null`      | 可选的解析器，它通过使用辅助 LLM 智能修复解析错误来处理格式错误的响应。                                |

该方法返回一个 `Result<StructuredResponse<T>>`，其中包含成功解析的结构化数据或一个错误。

### 第 2 层：Agent LLM 上下文

Agent LLM 上下文层允许你在 Agent 会话中请求结构化响应。这对于构建在特定流程点需要结构化数据的对话型 Agent 非常有用。

在 `writeSession` 中使用 `requestLLMStructured` 方法进行基于 Agent 的交互：

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

`fixingParser` 形参指定了通过辅助 LLM 在重试期间处理格式错误响应的配置。这有助于确保你始终获得有效的响应。

#### 与 Agent 策略集成

你可以将结构化数据处理集成到你的 Agent 策略中：

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

### 第 3 层：节点层

节点层为 Agent 工作流中的结构化输出提供了最高层次的抽象。使用 `nodeLLMRequestStructured` 创建处理结构化数据的可重用 Agent 节点。

这将创建一个 Agent 节点，它会：
- 接受 `String` 输入（用户消息）
- 将消息追加到 LLM 提示中
- 从 LLM 请求结构化输出
- 返回 `Result<StructuredResponse<MyStruct>>`

#### 节点层示例

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
    
    // 使用委托语法创建结构化输出节点
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

#### 完整代码示例

以下是使用结构化输出 API 的完整示例：

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
@LLMDescription("某地的简单天气预报")
data class SimpleWeatherForecast(
    @property:LLMDescription("地点名称")
    val location: String,
    @property:LLMDescription("摄氏温度")
    val temperature: Int,
    @property:LLMDescription("天气状况（例如：晴朗、多云、有雨）")
    val conditions: String
)

val token = System.getenv("OPENAI_KEY") ?: error("Environment variable OPENAI_KEY 未设置")

fun main(): Unit = runBlocking {
    // 创建示例预报
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

    // 生成 JSON 模式
    val forecastStructure = JsonStructuredData.createJsonStructure<SimpleWeatherForecast>(
        schemaGenerator = BasicJsonSchemaGenerator.Default,
        examples = exampleForecasts
    )

    // 定义 Agent 策略
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

    // 配置并运行 Agent
    val agentConfig = AIAgentConfig(
        prompt = prompt("weather-forecast-prompt") {
            system(
                """
                你是一个天气预报助手。
                当被询问天气预报时，提供一个真实但虚构的预报。
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

## 高级用法

上述示例展示了根据模型能力自动选择最佳结构化输出方法的简化 API。
为了更精细地控制结构化输出过程，你可以使用带有手动模式创建和提供者特有配置的高级 API。

### 手动模式创建和配置

你可以不依赖自动模式生成，而是使用 `JsonStructuredData.createJsonStructure` 显式创建模式，并通过 `StructuredOutput` 类手动配置结构化输出行为。

主要区别在于，你不是传递像 `examples` 和 `fixingParser` 这样的简单形参，而是创建一个 `StructuredOutputConfig` 对象，它允许对以下方面进行细粒度控制：

-   **模式生成**：选择特定的生成器（Standard、Basic 或提供者特有的）
-   **输出模式**：原生结构化输出支持与手动提示
-   **提供者映射**：不同 LLM 提供者的不同配置
-   **回退策略**：当提供者特有配置不可用时，默认行为

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
// 使用不同的生成器创建不同的模式结构
val genericStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = StandardJsonSchemaGenerator,
    examples = exampleForecasts
)

val openAiStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaGenerator = OpenAIBasicJsonSchemaGenerator,
    examples = exampleForecasts
)

val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// 高级 API 使用 StructuredOutputConfig 而非简单形参
val structuredResponse = promptExecutor.executeStructured(
    prompt = prompt("structured-data") {
        system("你是一个天气预报助手。")
        user("阿姆斯特丹的天气预报是什么？")
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

### 模式生成器

根据你的需求，可以使用不同的模式生成器：

-   **StandardJsonSchemaGenerator**：完整的 JSON 模式，支持多态、定义和递归引用
-   **BasicJsonSchemaGenerator**：简化的模式，不支持多态，与更多模型兼容
-   **提供者特有生成器**：针对特定 LLM 提供者（OpenAI、Google 等）优化的模式

### 所有层面的使用

高级配置在 API 的所有三层中均保持一致。方法名称保持不变，只有形参从简单的实参变为更高级的 `StructuredOutputConfig`：

-   **提示执行器**：`executeStructured(prompt, model, config: StructuredOutputConfig<T>)`
-   **Agent LLM 上下文**：`requestLLMStructured(config: StructuredOutputConfig<T>)`
-   **节点层**：`nodeLLMRequestStructured(config: StructuredOutputConfig<T>)`

简化 API（仅使用 `examples` 和 `fixingParser` 形参）推荐用于大多数用例，而高级 API 在需要时提供额外控制。

## 最佳实践

1.  **使用清晰的描述**：使用 `@LLMDescription` 注解提供清晰详细的描述，以帮助 LLM 理解预期数据。
2.  **提供示例**：包含有效数据结构的示例以引导 LLM。
3.  **优雅地处理错误**：实现适当的错误处理，以应对 LLM 可能无法生成有效结构的情况。
4.  **使用适当的模式类型**：根据你的需求和你正在使用的 LLM 的能力，选择适当的模式格式和类型。
5.  **使用不同模型进行测试**：不同的 LLM 在遵循结构化格式方面可能能力各异，因此如果可能，请使用多个模型进行测试。
6.  **从简单开始**：从简单结构开始，然后根据需要逐步增加复杂度。
7.  **谨慎使用多态**：虽然 API 支持密封类的多态，但请注意，LLM 处理起来可能更具挑战性。