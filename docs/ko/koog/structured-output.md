# 구조화된 출력

## 소개

구조화된 출력 API는 대규모 언어 모델(LLM)의 응답이 특정 데이터 구조를 따르도록 보장하는 방법을 제공합니다. 이는 자유 형식 텍스트가 아닌 예측 가능하고 잘 정돈된 데이터가 필요한 신뢰할 수 있는 AI 애플리케이션을 구축하는 데 중요합니다.

이 페이지에서는 이 API를 사용하여 데이터 구조를 정의하고, 스키마를 생성하며, LLM에 구조화된 응답을 요청하는 방법을 설명합니다.

## 주요 구성 요소 및 개념

구조화된 출력 API는 몇 가지 주요 구성 요소로 구성됩니다:

1.  **데이터 구조 정의**: kotlinx.serialization 및 LLM별 어노테이션으로 어노테이션된 Kotlin 데이터 클래스.
2.  **JSON 스키마 생성**: Kotlin 데이터 클래스로부터 JSON 스키마를 생성하는 도구.
3.  **구조화된 LLM 요청**: 정의된 구조를 따르는 LLM으로부터 응답을 요청하는 메서드.
4.  **응답 처리**: 구조화된 응답 처리 및 유효성 검사.

## 데이터 구조 정의

구조화된 출력 API를 사용하는 첫 번째 단계는 Kotlin 데이터 클래스를 사용하여 데이터 구조를 정의하는 것입니다.

### 기본 구조

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

### 주요 어노테이션

-   `@Serializable`: kotlinx.serialization이 클래스와 함께 작동하는 데 필요합니다.
-   `@SerialName`: 직렬화 시 사용할 이름을 지정합니다.
-   `@LLMDescription`: LLM을 위한 클래스 설명을 제공합니다. 필드 어노테이션의 경우 `@property:LLMDescription`을 사용하세요.

### 지원되는 기능

API는 광범위한 데이터 구조 기능을 지원합니다:

#### 중첩 클래스

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

#### 컬렉션 (리스트 및 맵)

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

#### 봉인된 클래스를 사용한 다형성

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

### 예시 제공

LLM이 예상 형식을 이해하는 데 도움이 되도록 예시를 제공할 수 있습니다:

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

## 구조화된 응답 요청

Koog에서 구조화된 출력을 사용할 수 있는 세 가지 주요 계층이 있습니다:

1.  **프롬프트 실행기 계층**: 프롬프트 실행기를 사용하여 직접 LLM 호출을 수행합니다.
2.  **에이전트 LLM 컨텍스트 계층**: 대화형 컨텍스트를 위해 에이전트 세션 내에서 사용합니다.
3.  **노드 계층**: 구조화된 출력 기능을 갖춘 재사용 가능한 에이전트 노드를 생성합니다.

### 계층 1: 프롬프트 실행기

프롬프트 실행기 계층은 구조화된 LLM 호출을 수행하는 가장 직접적인 방법을 제공합니다. 단일, 독립형 요청에는 `executeStructured` 메서드를 사용합니다:

이 메서드는 프롬프트를 실행하고 응답이 다음과 같이 올바르게 구조화되도록 합니다:

-   [모델 기능](./model-capabilities.md)에 따라 가장 적합한 구조화된 출력 접근 방식을 자동으로 선택합니다.
-   필요할 때 구조화된 출력 지시사항을 원래 프롬프트에 주입합니다.
-   사용 가능한 경우 네이티브 구조화된 출력 지원을 사용합니다.
-   구문 분석 실패 시 보조 LLM을 통해 자동 오류 수정을 제공합니다.

`executeStructured` 메서드 사용 예시는 다음과 같습니다:

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
// 단순한 단일 공급자 프롬프트 실행기 정의
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// 구조화된 응답을 반환하는 LLM 호출 생성
val structuredResponse = promptExecutor.executeStructured<WeatherForecast>(
        // 프롬프트 정의 (시스템 및 사용자 메시지 모두)
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
        // 요청을 실행할 주 모델 정의
        model = OpenAIModels.Chat.GPT4oMini,
        // 선택 사항: 모델이 형식을 이해하는 데 도움이 되는 예시 제공
        examples = exampleForecasts,
        // 선택 사항: 오류 수정을 위한 교정 파서 제공
        fixingParser = StructureFixingParser(
            model = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
```
<!--- KNIT example-structured-data-07.kt -->

`executeStructured` 메서드는 다음 인수를 사용합니다:

| 이름           | 데이터 유형             | 필수 | 기본값        | 설명                                                                                                     |
|----------------|-------------------------|------|---------------|-----------------------------------------------------------------------------------------------------------------|
| `prompt`       | Prompt                  | 예   |               | 실행할 프롬프트입니다. 자세한 내용은 [프롬프트](prompts/index.md)를 참조하세요.                                   |
| `model`        | LLModel                 | 예   |               | 프롬프트를 실행할 주 모델입니다.                                                                           |
| `examples`     | List&lt;T&gt;                 | 아니요 | `emptyList()` | 모델이 예상되는 형식을 이해하는 데 도움이 되는 선택적 예시 목록입니다.                                     |
| `fixingParser` | StructureFixingParser?  | 아니요 | `null`        | 구문 분석 오류를 지능적으로 수정하기 위해 보조 LLM을 사용하여 형식이 잘못된 응답을 처리하는 선택적 파서입니다. |

이 메서드는 성공적으로 구문 분석된 구조화된 데이터 또는 오류를 포함하는 `Result<StructuredResponse<T>>`를 반환합니다.

### 계층 2: 에이전트 LLM 컨텍스트

에이전트 LLM 컨텍스트 계층을 사용하면 에이전트 세션 내에서 구조화된 응답을 요청할 수 있습니다. 이는 흐름의 특정 지점에서 구조화된 데이터가 필요한 대화형 에이전트를 구축하는 데 유용합니다.

에이전트 기반 상호작용을 위해 `writeSession` 내에서 `requestLLMStructured` 메서드를 사용하세요:

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
            model = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
}
```
<!--- KNIT example-structured-data-08.kt -->

`fixingParser` 매개변수는 재시도 중 보조 LLM 처리를 통해 형식이 잘못된 응답을 처리하기 위한 구성을 지정합니다. 이는 항상 유효한 응답을 얻는 데 도움이 됩니다.

#### 에이전트 전략과 통합

에이전트 전략에 구조화된 데이터 처리를 통합할 수 있습니다:

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
                    model = OpenAIModels.Chat.GPT4o,
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

### 계층 3: 노드 계층

노드 계층은 에이전트 워크플로에서 구조화된 출력에 대한 최고 수준의 추상화를 제공합니다. `nodeLLMRequestStructured`를 사용하여 구조화된 데이터를 처리하는 재사용 가능한 에이전트 노드를 생성하세요.

이는 다음을 수행하는 에이전트 노드를 생성합니다:
-   `String` 입력(사용자 메시지)을 수락합니다.
-   메시지를 LLM 프롬프트에 추가합니다.
-   LLM에 구조화된 출력을 요청합니다.
-   `Result<StructuredResponse<MyStruct>>`를 반환합니다.

#### 노드 계층 예시

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
    
    // 위임 구문을 사용하여 구조화된 출력 노드 생성
    val getWeatherForecast by nodeLLMRequestStructured<WeatherForecast>(
        name = "forecast-node",
        examples = exampleForecasts,
        fixingParser = StructureFixingParser(
            model = OpenAIModels.Chat.GPT4o,
            retries = 3
        )
    )
    
    val processResult by node<Result<StructuredResponse<WeatherForecast>>, String> { result ->
        when {
            result.isSuccess -> {
                val forecast = result.getOrNull()?.data
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

#### 전체 코드 샘플

다음은 구조화된 출력 API를 사용하는 전체 예시입니다:

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
import ai.koog.prompt.structure.json.JsonStructure
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
    val forecastStructure = JsonStructure.create<SimpleWeatherForecast>(
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

## 고급 사용법

위의 예시는 모델 기능에 따라 최적의 구조화된 출력 접근 방식을 자동으로 선택하는 단순화된 API를 보여줍니다. 구조화된 출력 프로세스를 더 세밀하게 제어하려면 수동 스키마 생성 및 공급자별 구성이 포함된 고급 API를 사용할 수 있습니다.

### 수동 스키마 생성 및 구성

자동 스키마 생성에 의존하는 대신, `JsonStructure.create`를 사용하여 스키마를 명시적으로 생성하고 `StructuredOutput` 클래스를 통해 구조화된 출력 동작을 수동으로 구성할 수 있습니다.

주요 차이점은 `examples` 및 `fixingParser`와 같은 단순 매개변수를 전달하는 대신, 다음과 같은 세밀한 제어를 허용하는 `StructuredRequestConfig` 객체를 생성한다는 것입니다:

-   **스키마 생성**: 특정 생성기(표준, 기본 또는 공급자별) 선택
-   **출력 모드**: 네이티브 구조화된 출력 지원 vs 수동 프롬프트
-   **공급자 매핑**: 다른 LLM 공급자에 대한 다른 구성
-   **대체 전략**: 공급자별 구성이 사용 불가능할 때의 기본 동작

<!--- INCLUDE
import ai.koog.agents.example.exampleStructuredData03.WeatherForecast
import ai.koog.agents.example.exampleStructuredData06.exampleForecasts
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.prompt.structure.executeStructured
import ai.koog.prompt.structure.StructuredRequest
import ai.koog.prompt.structure.StructureFixingParser
import ai.koog.prompt.structure.json.JsonStructure
import ai.koog.prompt.structure.json.generator.StandardJsonSchemaGenerator
import ai.koog.prompt.executor.clients.openai.base.structure.OpenAIBasicJsonSchemaGenerator
import ai.koog.prompt.llm.LLMProvider
import kotlinx.coroutines.runBlocking
import ai.koog.prompt.structure.StructuredRequestConfig

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 다른 생성기로 다른 스키마 구조 생성
val genericStructure = JsonStructure.create<WeatherForecast>(
    schemaGenerator = StandardJsonSchemaGenerator,
    examples = exampleForecasts
)

val openAiStructure = JsonStructure.create<WeatherForecast>(
    schemaGenerator = OpenAIBasicJsonSchemaGenerator,
    examples = exampleForecasts
)

val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_KEY"))

// The advanced API uses StructuredRequestConfig instead of simple parameters
val structuredResponse = promptExecutor.executeStructured(
    prompt = prompt("structured-data") {
        system("You are a weather forecasting assistant.")
        user("What is the weather forecast for Amsterdam?")
    },
    model = OpenAIModels.Chat.GPT4oMini,
    config = StructuredRequestConfig(
        byProvider = mapOf(
            LLMProvider.OpenAI to StructuredRequest.Native(openAiStructure),
        ),
        default = StructuredRequest.Manual(genericStructure),
        fixingParser = StructureFixingParser(
            model = AnthropicModels.Haiku_3_5,
            retries = 2
        )
    )
)
```
<!--- KNIT example-structured-data-12.kt -->

### 스키마 생성기

필요에 따라 다양한 스키마 생성기를 사용할 수 있습니다:

-   **StandardJsonSchemaGenerator**: 다형성, 정의 및 재귀적 참조를 지원하는 전체 JSON 스키마
-   **BasicJsonSchemaGenerator**: 다형성 지원이 없는 단순화된 스키마로, 더 많은 모델과 호환됩니다.
-   **Provider-specific generators**: 특정 LLM 공급자(OpenAI, Google 등)에 최적화된 스키마

### 모든 계층에서의 사용

고급 구성은 API의 세 가지 계층 모두에서 일관되게 작동합니다. 메서드 이름은 동일하게 유지되며, 매개변수만 단순 인수에서 더 고급 `StructuredRequestConfig`로 변경됩니다:

-   **프롬프트 실행기**: `executeStructured(prompt, model, config: StructuredRequestConfig<T>)`
-   **에이전트 LLM 컨텍스트**: `requestLLMStructured(config: StructuredRequestConfig<T>)`
-   **노드 계층**: `nodeLLMRequestStructured(config: StructuredRequestConfig<T>)`

대부분의 사용 사례에서는 단순화된 API(단순히 `examples` 및 `fixingParser` 매개변수 사용)가 권장되며, 고급 API는 필요할 때 추가 제어를 제공합니다.

## 모범 사례

1.  **명확한 설명 사용**: `@LLMDescription` 어노테이션을 사용하여 명확하고 상세한 설명을 제공하여 LLM이 예상되는 데이터를 이해하는 데 도움이 되도록 합니다.

2.  **예시 제공**: 유효한 데이터 구조의 예시를 포함하여 LLM을 안내합니다.

3.  **오류를 적절하게 처리**: LLM이 유효한 구조를 생성하지 못할 수 있는 경우를 대비하여 적절한 오류 처리를 구현합니다.

4.  **적절한 스키마 유형 사용**: 필요에 따라 그리고 사용 중인 LLM의 기능에 따라 적절한 스키마 형식과 유형을 선택합니다.

5.  **다른 모델로 테스트**: 다른 LLM은 구조화된 형식을 따르는 데 다양한 능력을 가질 수 있으므로, 가능하면 여러 모델로 테스트합니다.

6.  **단순하게 시작**: 단순한 구조로 시작하여 필요에 따라 점진적으로 복잡성을 추가합니다.

7.  **다형성을 신중하게 사용**: API는 봉인된 클래스를 사용한 다형성을 지원하지만, LLM이 올바르게 처리하기 더 어려울 수 있음을 인지해야 합니다.