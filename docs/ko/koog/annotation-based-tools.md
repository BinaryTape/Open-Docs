# 애노테이션 기반 도구

애노테이션 기반 도구는 대규모 언어 모델(LLM)에 함수를 도구로 노출하는 선언적인 방법을 제공합니다.
애노테이션을 사용하면 모든 함수를 LLM이 이해하고 사용할 수 있는 도구로 변환할 수 있습니다.

이 방식은 도구 설명을 수동으로 작성하지 않고 기존 기능을 LLM에 노출해야 할 때 유용합니다.

!!! note
    애노테이션 기반 도구는 JVM 전용이며 다른 플랫폼에서는 사용할 수 없습니다. 멀티플랫폼 지원이 필요한 경우 [클래스 기반 도구 API](class-based-tools.md)를 사용하세요.

## 주요 애노테이션

프로젝트에서 애노테이션 기반 도구를 사용하려면 다음 주요 애노테이션을 이해해야 합니다.

| 애노테이션          | 설명                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `@Tool`           | LLM에 도구로 노출할 함수를 표시합니다.                                     |
| `@LLMDescription` | 도구 및 해당 구성 요소에 대한 설명 정보를 제공합니다.                       |

## @Tool 애노테이션

`@Tool` 애노테이션은 LLM에 도구로 노출해야 하는 함수를 표시하는 데 사용됩니다.
`@Tool`이 지정된 함수는 `ToolSet` 인터페이스를 구현하는 객체에서 리플렉션(reflection)을 통해 수집됩니다. 자세한 내용은 [ToolSet 인터페이스 구현](#1-toolset-인터페이스-구현)을 참조하세요.

### 정의

<!--- INCLUDE
-->
```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.kt -->

### 매개변수

| <div style="width:100px">이름</div> | 필수 여부 | 설명                                                                              |
|-------------------------------------|----------|------------------------------------------------------------------------------------------|
| `customName`                        | 아니요    | 도구의 커스텀 이름을 지정합니다. 제공되지 않으면 함수의 이름이 사용됩니다. |

### 사용법

함수를 도구로 표시하려면 `ToolSet` 인터페이스를 구현하는 클래스 내의 해당 함수에 `@Tool` 애노테이션을 적용하세요.
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // 도구 구현
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // 도구 구현
        return "Result"
    }
}
```
<!--- KNIT example-annotation-based-tools-02.kt -->

## @LLMDescription 애노테이션

`@LLMDescription` 애노테이션은 코드 요소(클래스, 함수, 매개변수 등)에 대한 설명 정보를 LLM에 제공합니다.
이는 LLM이 이러한 요소의 목적과 사용법을 이해하는 데 도움이 됩니다.

### 정의

<!--- INCLUDE
-->
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
<!--- KNIT example-annotation-based-tools-03.kt -->

### 매개변수

| 이름          | 필수 여부 | 설명                                    |
|---------------|----------|-----------------------------------------|
| `description` | 예       | 애노테이션이 적용된 요소를 설명하는 문자열입니다. |

### 사용법

`@LLMDescription` 애노테이션은 다양한 수준에서 적용할 수 있습니다. 예를 들어:

* 함수 수준:
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("특정 작업을 수행하고 결과를 반환합니다")
fun myTool(): String {
    // 함수 구현
    return "Result"
}
```
<!--- KNIT example-annotation-based-tools-04.kt -->

* 매개변수 수준:

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("입력 데이터를 처리합니다")
fun processTool(
    @LLMDescription("처리할 입력 데이터")
    input: String,

    @LLMDescription("선택적 구성 매개변수")
    config: String = ""
): String {
    // 함수 구현
    return "Processed: $input with config: $config"
}
```
<!--- KNIT example-annotation-based-tools-05.kt -->

## 도구 만들기

### 1. ToolSet 인터페이스 구현

[`ToolSet`](api:agents-tools::ai.koog.agents.core.tools.reflect.ToolSet) 인터페이스를 구현하는 클래스를 생성합니다.
이 인터페이스는 클래스가 도구의 컨테이너임을 나타냅니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    // 도구가 여기에 들어갑니다
}
```
<!--- KNIT example-annotation-based-tools-06.kt -->

### 2. 도구 함수 추가

클래스에 함수를 추가하고 `@Tool` 애노테이션을 달아 도구로 노출합니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // 실제 구현에서는 날씨 API를 호출합니다
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-07.kt -->

### 3. 설명 추가

LLM에 문맥을 제공하기 위해 `@LLMDescription` 애노테이션을 추가합니다.
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("날씨 정보를 가져오기 위한 도구")
class MyFirstToolSet : ToolSet {
    @Tool
    @LLMDescription("특정 위치의 현재 날씨를 가져옵니다")
    fun getWeather(
        @LLMDescription("도시 및 주/국가")
        location: String
    ): String {
        // 실제 구현에서는 날씨 API를 호출합니다
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-08.kt -->

### 4. 에이전트와 함께 도구 사용하기

이제 에이전트에서 도구를 사용할 수 있습니다.
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.example.exampleAnnotationBasedTools06.MyFirstToolSet
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

const val apiToken = ""
-->
```kotlin
fun main() {
    runBlocking {
        // 도구 세트 생성
        val weatherTools = MyFirstToolSet()

        // 도구를 사용하여 에이전트 생성

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiToken),
            systemPrompt = "Provide weather information for a given location.",
            llmModel = OpenAIModels.Chat.GPT4o,
            toolRegistry = ToolRegistry {
                tools(weatherTools)
            }
        )

        // 이제 에이전트가 날씨 도구를 사용할 수 있습니다
        agent.run("What's the weather like in New York?")
    }
}
```
<!--- KNIT example-annotation-based-tools-09.kt -->

## 사용 사례

다음은 도구 애노테이션의 실제 사용 사례입니다.

### 기본 예제: 스위치 컨트롤러

이 예제는 스위치를 제어하기 위한 간단한 도구 세트를 보여줍니다.
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool

class Switch(private var state: Boolean) {
    fun switch(state: Boolean) {
        this.state = state
    }
    
    fun isOn(): Boolean {
        return state
    }
}
-->
```kotlin
@LLMDescription("스위치 제어를 위한 도구")
class SwitchTools(val switch: Switch) : ToolSet {
    @Tool
    @LLMDescription("스위치의 상태를 전환합니다")
    fun switch(
        @LLMDescription("설정할 상태 (켜짐은 true, 꺼짐은 false)")
        state: Boolean
    ): String {
        switch.switch(state)
        return "Switched to ${if (state) "on" else "off"}"
    }

    @Tool
    @LLMDescription("스위치의 현재 상태를 반환합니다")
    fun switchState(): String {
        return "Switch is ${if (switch.isOn()) "on" else "off"}"
    }
}
```
<!--- KNIT example-annotation-based-tools-10.kt -->

LLM이 스위치를 제어해야 할 때, 제공된 설명을 통해 다음 정보를 이해할 수 있습니다.

- 도구의 목적과 기능.
- 도구 사용에 필요한 매개변수.
- 각 매개변수에 허용되는 값.
- 실행 시 기대되는 반환 값.

### 고급 예제: 진단 도구

이 예제는 장치 진단을 위한 보다 복잡한 도구 세트를 보여줍니다.
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("장치 진단 및 문제 해결을 수행하기 위한 도구")
class DiagnosticToolSet : ToolSet {
    @Tool
    @LLMDescription("장치에 대한 진단을 실행하여 상태를 확인하고 문제를 식별합니다")
    fun runDiagnostic(
        @LLMDescription("진단할 장치의 ID")
        deviceId: String,

        @LLMDescription("진단을 위한 추가 정보 (선택 사항)")
        additionalInfo: String = ""
    ): String {
        // 구현
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("오류 코드를 분석하여 의미와 가능한 해결책을 결정합니다")
    fun analyzeError(
        @LLMDescription("분석할 오류 코드 (예: 'E1001')")
        errorCode: String
    ): String {
        // 구현
        return "Analysis of error code $errorCode"
    }
}
```
<!--- KNIT example-annotation-based-tools-11.kt -->

## 권장 사항 (Best practices)

* **명확한 설명 제공**: 도구, 매개변수 및 반환 값의 목적과 동작을 설명하는 명확하고 간결한 설명을 작성하세요.
* **모든 매개변수 설명**: 모든 매개변수에 `@LLMDescription`을 추가하여 LLM이 각 매개변수의 용도를 이해하도록 돕습니다.
* **일관된 명명 규칙 사용**: 도구와 매개변수에 일관된 명명 규칙을 사용하여 더 직관적으로 만드세요.
* **관련 도구 그룹화**: 관련 도구를 동일한 `ToolSet` 구현으로 그룹화하고 클래스 수준의 설명을 제공하세요.
* **정보가 풍부한 결과 반환**: 도구 반환 값이 작업 결과에 대한 명확한 정보를 제공하도록 하세요.
* **오류를 적절하게 처리**: 도구에 오류 처리를 포함하고 유용한 오류 메시지를 반환하세요.
* **기본값 문서화**: 매개변수에 기본값이 있는 경우 설명에 이를 문서화하세요.
* **도구의 집중도 유지**: 각 도구는 너무 많은 일을 하려고 하기보다 구체적이고 잘 정의된 하나의 작업을 수행해야 합니다.

## 일반적인 문제 해결

도구 애노테이션을 사용할 때 몇 가지 일반적인 문제가 발생할 수 있습니다.

### 도구가 인식되지 않는 경우

에이전트가 도구를 인식하지 못하는 경우 다음 사항을 확인하세요.

- 클래스가 `ToolSet` 인터페이스를 구현하고 있는지 확인합니다.
- 모든 도구 함수에 `@Tool` 애노테이션이 달려 있는지 확인합니다.
- 도구 함수가 적절한 반환 유형을 가지고 있는지 확인합니다 (단순성을 위해 `String`을 권장합니다).
- 도구가 에이전트에 올바르게 등록되었는지 확인합니다.

### 도구 설명이 불분명한 경우

LLM이 도구를 올바르게 사용하지 못하거나 목적을 오해하는 경우 다음을 시도해 보세요.

- `@LLMDescription` 애노테이션을 더 구체적이고 명확하게 개선합니다.
- 적절한 경우 설명에 예시를 포함합니다.
- 설명에 매개변수 제약 조건을 지정합니다 (예: `"양수여야 합니다"`).
- 설명 전반에 걸쳐 일관된 용어를 사용합니다.

### 매개변수 유형 문제

LLM이 잘못된 매개변수 유형을 제공하는 경우 다음을 시도해 보세요.

- 가능한 경우 단순한 매개변수 유형(`String`, `Boolean`, `Int`)을 사용합니다.
- 매개변수 설명에 예상 형식을 명확하게 기술합니다.
- 복잡한 유형의 경우 특정 형식을 가진 `String` 매개변수를 사용하고 도구 내에서 이를 파싱하는 것을 고려하세요.
- 매개변수 설명에 유효한 입력의 예시를 포함합니다.

### 성능 문제

도구로 인해 성능 문제가 발생하는 경우 다음을 시도해 보세요.

- 도구 구현을 가볍게 유지합니다.
- 리소스 집약적인 작업의 경우 비동기 처리 구현을 고려하세요.
- 적절한 경우 결과를 캐싱합니다.
- 도구 사용을 로깅하여 병목 지점을 파악합니다.