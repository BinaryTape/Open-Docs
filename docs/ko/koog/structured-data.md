# 구조화된 데이터 처리

## 소개

구조화된 데이터 처리 API는 대규모 언어 모델(LLM)의 응답이 특정 데이터 구조를 따르도록 보장하는 방법을 제공합니다. 이는 자유 형식 텍스트 대신 예측 가능하고 잘 정돈된 데이터가 필요한 신뢰할 수 있는 AI 애플리케이션을 구축하는 데 중요합니다.

이 페이지에서는 구조화된 데이터 처리 API를 사용하여 데이터 구조를 정의하고, 스키마를 생성하며, LLM으로부터 구조화된 응답을 요청하는 방법을 설명합니다.

## 주요 구성 요소 및 개념

구조화된 데이터 처리 API는 다음과 같은 몇 가지 주요 구성 요소로 구성됩니다:

1.  **데이터 구조 정의**: `kotlinx.serialization` 및 LLM별 어노테이션으로 주석 처리된 Kotlin 데이터 클래스.
2.  **JSON 스키마 생성**: Kotlin 데이터 클래스에서 JSON 스키마를 생성하는 도구.
3.  **구조화된 LLM 요청**: 정의된 구조를 따르는 LLM 응답을 요청하는 메서드.
4.  **응답 처리**: 구조화된 응답을 처리하고 유효성을 검사.

## 데이터 구조 정의

구조화된 데이터 처리 API를 사용하는 첫 번째 단계는 Kotlin 데이터 클래스를 사용하여 데이터 구조를 정의하는 것입니다.

### 기본 구조

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

### 주요 어노테이션

*   `@Serializable`: 클래스가 `kotlinx.serialization`과 함께 작동하는 데 필요합니다.
*   `@SerialName`: 직렬화(serialization) 시 사용할 이름을 지정합니다.
*   `@LLMDescription`: LLM에 대한 클래스 설명을 제공합니다. 필드 어노테이션의 경우 `@property:LLMDescription`을 사용합니다.

### 지원되는 기능

API는 다양한 데이터 구조 기능을 지원합니다:

#### 중첩 클래스

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

#### 컬렉션 (리스트 및 맵)

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

#### 열거형

```kotlin
@Serializable
@SerialName("Pollution")
enum class Pollution { Low, Medium, High }
```

#### 봉인된 클래스를 사용한 다형성

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

## JSON 스키마 생성

데이터 구조를 정의한 후에는 `JsonStructuredData` 클래스를 사용하여 해당 구조로부터 JSON 스키마를 생성할 수 있습니다:

```kotlin
val weatherForecastStructure = JsonStructuredData.createJsonStructure<WeatherForecast>(
    schemaFormat = JsonSchemaGenerator.SchemaFormat.JsonSchema,
    examples = exampleForecasts,
    schemaType = JsonStructuredData.JsonSchemaType.SIMPLE
)
```

### 스키마 형식 옵션

*   `JsonSchema`: 표준 JSON 스키마 형식.
*   `Simple`: 일부 모델에서 더 잘 작동할 수 있는 간소화된 스키마 형식으로, 다형성(polymorphism)을 지원하지 않는 등의 제약이 있습니다.

### 스키마 유형 옵션

다음 스키마 유형이 지원됩니다:

*   `SIMPLE`: 간소화된 스키마 유형:
    *   표준 JSON 필드만 지원
    *   정의, URL 참조 및 재귀 검사를 지원하지 않음
    *   **다형성(polymorphism)을 지원하지 않음**
    *   더 많은 수의 언어 모델에서 지원됨
    *   더 간단한 데이터 구조에 사용됨

*   `FULL`: 더 포괄적인 스키마 유형:
    *   정의, URL 참조 및 재귀 검사를 포함한 고급 JSON 스키마 기능을 지원
    *   **다형성(polymorphism)을 지원**: 봉인된 클래스(sealed classes) 또는 인터페이스 및 해당 구현과 함께 작동할 수 있음
    *   더 적은 수의 언어 모델에서 지원됨
    *   상속 계층(inheritance hierarchies)을 가진 복잡한 데이터 구조에 사용됨

### 예시 제공

LLM이 예상되는 형식을 이해하는 데 도움이 되도록 예시를 제공할 수 있습니다:

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

## 구조화된 응답 요청

Koog에서 구조화된 응답을 요청하는 두 가지 방법이 있습니다:

*   프롬프트 실행기(prompt executor)와 해당 `executeStructured` 또는 `executeStructuredOneShot` 메서드를 사용하여 단일 LLM 호출을 수행합니다.
*   에이전트 사용 사례 및 에이전트 전략과의 통합을 위한 구조화된 출력 요청을 생성합니다.

### 프롬프트 실행기 사용

구조화된 출력을 반환하는 단일 LLM 호출을 수행하려면 프롬프트 실행기와 해당 `executeStructured` 메서드를 사용하십시오. 이 메서드는 프롬프트를 실행하고 자동 출력 강제 변환(automatic output coercion)을 적용하여 응답이 올바르게 구조화되도록 보장합니다. 이 메서드는 다음을 통해 구조화된 출력 파싱의 신뢰성을 향상합니다:

*   원본 프롬프트에 구조화된 출력 지시사항을 주입합니다.
*   원시 응답을 받기 위해 보강된 프롬프트를 실행합니다.
*   직접 파싱에 실패할 경우 응답을 파싱하거나 강제 변환하기 위한 별도의 LLM 호출을 사용합니다.

원시 응답을 단순히 파싱하려고 시도하며 형식이 정확히 일치하지 않으면 실패하는 `[execute(prompt, structure)]`와 달리, 이 메서드는 추가 LLM 처리를 통해 비구조화되거나 잘못된 형식의 출력을 예상되는 구조로 변환하기 위해 적극적으로 작동합니다.

다음은 `executeStructured` 메서드를 사용하는 예시입니다:

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

이 예시는 [정의된 데이터 구조](#defining-data-structures)와 [예시](#providing-examples)를 기반으로 하는 `weatherForecastStructure`라는 이미 [생성된 JSON 스키마](#generating-json-schemas)를 사용합니다.

`executeStructured` 메서드는 다음 인수를 받습니다:

| Name          | Data type      | Required | Default                   | Description                                                                                             |
| :------------ | :------------- | :------- | :------------------------ | :------------------------------------------------------------------------------------------------------ |
| `prompt`      | Prompt         | Yes      |                           | 실행할 프롬프트. 자세한 내용은 [프롬프트 API](prompt-api.md)를 참조하십시오.                        |
| `structure`   | StructuredData | Yes      |                           | 스키마 및 파싱 로직을 포함한 구조화된 데이터 정의. 자세한 내용은 [데이터 구조 정의](#defining-data-structures)를 참조하십시오. |
| `mainModel`   | LLModel        | Yes      |                           | 프롬프트를 실행할 주 모델.                                                                              |
| `retries`     | Integer        | No       | `1`                       | 응답을 적절한 구조화된 출력으로 파싱하기 위한 시도 횟수.                                                 |
| `fixingModel` | LLModel        | No       | `OpenAIModels.Chat.GPT4o` | 손상된 출력을 예상되는 구조로 변환하는 출력 강제 변환(coercion)을 처리하는 모델.                         |

`executeStructured` 외에도, 프롬프트 실행기에서 `executeStructuredOneShot` 메서드를 사용할 수 있습니다. 주요 차이점은 `executeStructuredOneShot`은 강제 변환(coercion)을 자동으로 처리하지 않으므로, 잘못된 형식의 출력을 적절한 구조화된 출력으로 수동으로 변환해야 한다는 것입니다.

`executeStructuredOneShot` 메서드는 다음 인수를 받습니다:

| Name        | Data type      | Required | Default | Description                       |
| :---------- | :------------- | :------- | :------ | :-------------------------------- |
| `prompt`    | Prompt         | Yes      |         | 실행할 프롬프트.                  |
| `structure` | StructuredData | Yes      |         | 스키마 및 파싱 로직을 포함한 구조화된 데이터 정의. |
| `model`     | LLModel        | Yes      |         | 프롬프트를 실행할 모델.           |

### 에이전트 사용 사례를 위한 구조화된 데이터 응답

LLM으로부터 구조화된 응답을 요청하려면 `writeSession` 내에서 `requestLLMStructured` 메서드를 사용하십시오:

```kotlin
val structuredResponse = llm.writeSession {
    this.requestLLMStructured(
        structure = weatherForecastStructure,
        fixingModel = OpenAIModels.Chat.GPT4o,
    )
}
```

`fixingModel` 매개변수는 재시도 중 재파싱(reparsing) 또는 오류 수정에 사용할 언어 모델을 지정합니다. 이는 항상 유효한 응답을 받을 수 있도록 보장하는 데 도움이 됩니다.

#### 에이전트 전략과 통합

구조화된 데이터 처리를 에이전트 전략에 통합할 수 있습니다:

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

#### 전체 코드 예시

다음은 구조화된 데이터 처리 API 사용의 전체 예시입니다:

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

## 모범 사례

1.  **명확한 설명 사용**: LLM이 예상되는 데이터를 이해하는 데 도움이 되도록 `@LLMDescription` 어노테이션을 사용하여 명확하고 상세한 설명을 제공하십시오.
2.  **예시 제공**: LLM을 안내하기 위해 유효한 데이터 구조의 예시를 포함하십시오.
3.  **오류를 적절하게 처리**: LLM이 유효한 구조를 생성하지 못할 수 있는 경우를 처리하기 위해 적절한 오류 처리를 구현하십시오.
4.  **적절한 스키마 유형 사용**: 필요 사항과 사용 중인 LLM의 기능에 따라 적절한 스키마 형식 및 유형을 선택하십시오.
5.  **다양한 모델로 테스트**: 서로 다른 LLM은 구조화된 형식을 따르는 능력이 다를 수 있으므로, 가능하다면 여러 모델로 테스트하십시오.
6.  **간단하게 시작**: 간단한 구조부터 시작하여 필요에 따라 점진적으로 복잡성을 추가하십시오.
7.  **다형성을 신중하게 사용**: API가 봉인된 클래스를 사용한 다형성을 지원하지만, LLM이 올바르게 처리하는 데 더 어려울 수 있다는 점을 인지하십시오.