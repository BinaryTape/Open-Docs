# 어노테이션 기반 도구

어노테이션 기반 도구는 대규모 언어 모델(LLM)에 함수를 도구로 노출하는 선언적인 방식을 제공합니다.
어노테이션을 사용하면 어떤 함수든 LLM이 이해하고 사용할 수 있는 도구로 변환할 수 있습니다.

이 접근 방식은 수동으로 도구 설명을 구현하지 않고도 기존 기능을 LLM에 노출해야 할 때 유용합니다.

!!! note
    어노테이션 기반 도구는 JVM 전용이며 다른 플랫폼에서는 사용할 수 없습니다. 멀티플랫폼 지원을 위해서는 [고급 도구 API](advanced-tool-implementation.md)를 사용하세요.

## 주요 어노테이션

프로젝트에서 어노테이션 기반 도구를 사용하려면 다음 주요 어노테이션을 이해해야 합니다:

| 어노테이션        | 설명                                                             |
|-------------------|-------------------------------------------------------------------------|
| `@Tool`           | LLM에 도구로 노출되어야 하는 함수를 표시합니다.                |
| `@LLMDescription` | 도구 및 해당 구성 요소에 대한 설명 정보를 제공합니다. |

## @Tool 어노테이션

`@Tool` 어노테이션은 LLM에 도구로 노출되어야 하는 함수를 표시하는 데 사용됩니다.
`@Tool` 어노테이션이 적용된 함수는 `ToolSet` 인터페이스를 구현하는 객체에서 리플렉션을 통해 수집됩니다. 자세한 내용은 [ToolSet 인터페이스 구현](#implement-the-toolset-interface)을 참조하세요.

### 정의

```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```

### 매개변수

| <div style="width:100px">이름</div> | 필수 | 설명                                                                              |
|-------------------------------------|----------|------------------------------------------------------------------------------------------|
| `customName`                        | 아니요       | 도구의 사용자 지정 이름을 지정합니다. 제공되지 않으면 함수의 이름이 사용됩니다. |

### 사용법

함수를 도구로 표시하려면, `ToolSet` 인터페이스를 구현하는 클래스의 해당 함수에 `@Tool` 어노테이션을 적용하세요:

```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // Tool implementation
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // Tool implementation
        return "Result"
    }
}
```

## @LLMDescription 어노테이션

`@LLMDescription` 어노테이션은 코드 요소(클래스, 함수, 매개변수 등)에 대한 설명 정보를 LLM에 제공합니다.
이는 LLM이 이러한 요소의 목적과 사용법을 이해하는 데 도움이 됩니다.

### 정의

```kotlin
@Target(
    AnnotationTarget.PROPERTY,
    AnnotationTarget.CLASS,
    AnnotationTarget.PROPERTY,
    AnnotationTarget.TYPE,
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.FUNCTION
)
public annotation class LLMDescription(val description: String)
```

### 매개변수

| 이름          | 필수 | 설명                                    |
|---------------|----------|------------------------------------------------|
| `description` | 예      | 어노테이션이 적용된 요소를 설명하는 문자열입니다. |

### 사용법

`@LLMDescription` 어노테이션은 다양한 수준에 적용할 수 있습니다. 예를 들어:

*   함수 레벨:

```kotlin
@Tool
@LLMDescription("Performs a specific operation and returns the result")
fun myTool(): String {
    // Function implementation
    return "Result"
}
```

*   매개변수 레벨:

```kotlin
@Tool
@LLMDescription("Processes input data")
fun processTool(
    @LLMDescription("The input data to process")
    input: String,

    @LLMDescription("Optional configuration parameters")
    config: String = ""
): String {
    // Function implementation
    return "Processed: $input with config: $config"
}
```

## 도구 생성하기

### 1. ToolSet 인터페이스 구현

[`ToolSet`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.reflect/-tool-set/index.html) 인터페이스를 구현하는 클래스를 생성하세요.
이 인터페이스는 클래스를 도구 컨테이너로 표시합니다.

```kotlin
class MyFirstToolSet : ToolSet {
    // Tools will go here
}
```

### 2. 도구 함수 추가

클래스에 함수를 추가하고 `@Tool` 어노테이션을 적용하여 도구로 노출하세요:

```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // In a real implementation, you would call a weather API
        return "The weather in $location is sunny and 72°F"
    }
}
```

### 3. 설명 추가

LLM에 컨텍스트를 제공하기 위해 `@LLMDescription` 어노테이션을 추가하세요:

```kotlin
@LLMDescription("Tools for getting weather information")
class MyFirstToolSet : ToolSet {
    @Tool
    @LLMDescription("Get the current weather for a location")
    fun getWeather(
        @LLMDescription("The city and state/country")
        location: String
    ): String {
        // In a real implementation, you would call a weather API
        return "The weather in $location is sunny and 72°F"
    }
}
```

### 4. 에이전트와 함께 도구 사용

이제 에이전트와 함께 도구를 사용할 수 있습니다:

```kotlin
fun main() = runBlocking {
    // Create your tool set
    val weatherTools = MyFirstToolSet()

    // Create an agent with your tools

    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiToken),
        systemPrompt = "Provide weather information for a given location.",
        llmModel = OpenAIModels.Chat.GPT4o,
        toolRegistry = ToolRegistry {
            tools(weatherTools())
        }
    )

    // The agent can now use your weather tools
    agent.run("What's the weather like in New York?")
}
```

## 사용 예시

다음은 도구 어노테이션의 몇 가지 실제 예시입니다.

### 기본 예시: 스위치 컨트롤러

이 예시는 스위치를 제어하기 위한 간단한 도구 세트를 보여줍니다:

```kotlin
@LLMDescription("Tools for controlling a switch")
class SwitchTools(val switch: Switch) : ToolSet {
    @Tool
    @LLMDescription("Switches the state of the switch")
    fun switch(
        @LLMDescription("The state to set (true for on, false for off)")
        state: Boolean
    ): String {
        switch.switch(state)
        return "Switched to ${if (state) "on" else "off"}"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch")
    fun switchState(): String {
        return "Switch is ${if (switch.isOn()) "on" else "off"}"
    }
}
```

LLM이 스위치를 제어해야 할 때, 제공된 설명에서 다음 정보를 이해할 수 있습니다:

-   도구의 목적 및 기능.
-   도구 사용에 필요한 매개변수.
-   각 매개변수에 허용되는 값.
-   실행 시 예상되는 반환 값.

### 고급 예시: 진단 도구

이 예시는 장치 진단을 위한 더 복잡한 도구 세트를 보여줍니다:

```kotlin
@LLMDescription("Tools for performing diagnostics and troubleshooting on devices")
class DiagnosticToolSet : ToolSet {
    @Tool
    @LLMDescription("Run diagnostic on a device to check its status and identify any issues")
    fun runDiagnostic(
        @LLMDescription("The ID of the device to diagnose")
        deviceId: String,

        @LLMDescription("Additional information for the diagnostic (optional)")
        additionalInfo: String = ""
    ): String {
        // Implementation
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("Analyze an error code to determine its meaning and possible solutions")
    fun analyzeError(
        @LLMDescription("The error code to analyze (e.g., 'E1001')")
        errorCode: String
    ): String {
        // Implementation
        return "Analysis of error code $errorCode"
    }
}
```

## 모범 사례

*   **명확한 설명 제공**: 도구, 매개변수 및 반환 값의 목적과 동작을 설명하는 명확하고 간결한 설명을 작성하십시오.
*   **모든 매개변수 설명**: LLM이 각 매개변수의 용도를 이해하도록 모든 매개변수에 `@LLMDescription`을 추가하십시오.
*   **일관된 명명 사용**: 도구 및 매개변수에 일관된 명명 규칙을 사용하여 더 직관적으로 만드십시오.
*   **관련 도구 그룹화**: 관련 도구를 동일한 `ToolSet` 구현으로 그룹화하고 클래스 수준 설명을 제공하십시오.
*   **유익한 결과 반환**: 도구 반환 값이 작업 결과에 대한 명확한 정보를 제공하도록 하십시오.
*   **오류를 적절하게 처리**: 도구에 오류 처리를 포함하고 유익한 오류 메시지를 반환하십시오.
*   **기본 값 문서화**: 매개변수에 기본 값이 있는 경우, 설명에 이를 문서화하십시오.
*   **도구 집중 유지**: 각 도구는 너무 많은 것을 시도하기보다 특정하고 잘 정의된 작업을 수행해야 합니다.

## 일반적인 문제 해결

도구 어노테이션을 사용할 때 몇 가지 일반적인 문제를 겪을 수 있습니다.

### 도구가 인식되지 않는 경우

에이전트가 도구를 인식하지 못하는 경우 다음을 확인하세요:

-   클래스가 `ToolSet` 인터페이스를 구현하는지 확인합니다.
-   모든 도구 함수에 `@Tool` 어노테이션이 적용되었는지 확인합니다.
-   도구 함수에 적절한 반환 타입이 있는지 확인합니다(`String`은 단순성을 위해 권장됩니다).
-   도구가 에이전트에 올바르게 등록되었는지 확인합니다.

### 불분명한 도구 설명

LLM이 도구를 올바르게 사용하지 않거나 목적을 오해하는 경우 다음을 시도하세요:

-   `@LLMDescription` 어노테이션을 더 구체적이고 명확하게 개선하십시오.
-   적절한 경우 설명에 예시를 포함하십시오.
-   설명에 매개변수 제약 조건을 지정하십시오(예: `"양수여야 합니다"`).
-   설명 전반에 걸쳐 일관된 용어를 사용하십시오.

### 매개변수 타입 문제

LLM이 잘못된 매개변수 타입을 제공하는 경우 다음을 시도하세요:

-   가능하면 간단한 매개변수 타입(`String`, `Boolean`, `Int`)을 사용하십시오.
-   매개변수 설명에 예상 형식을 명확하게 설명하십시오.
-   복잡한 타입의 경우, 특정 형식의 `String` 매개변수를 사용하고 도구에서 이를 파싱하는 것을 고려하십시오.
-   매개변수 설명에 유효한 입력 예시를 포함하십시오.

### 성능 문제

도구가 성능 문제를 유발하는 경우 다음을 시도하세요:

-   도구 구현을 가볍게 유지하십시오.
-   리소스 집약적인 작업의 경우 비동기 처리를 구현하는 것을 고려하십시오.
-   적절한 경우 결과를 캐시하십시오.
-   병목 현상을 식별하기 위해 도구 사용을 로깅하십시오.