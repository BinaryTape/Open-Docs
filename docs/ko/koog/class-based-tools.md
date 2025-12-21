# 클래스 기반 도구

이 섹션에서는 향상된 유연성과 사용자 정의 동작이 필요한 시나리오를 위해 설계된 API를 설명합니다.
이 접근 방식을 통해 도구의 매개변수, 메타데이터, 실행 로직, 등록 및 호출 방식 등 도구에 대한 완벽한 제어권을 가질 수 있습니다.

이러한 제어 수준은 기본적인 사용 사례를 확장하는 정교한 도구를 생성하여 에이전트 세션 및 워크플로에 원활하게 통합할 수 있도록 하는 데 이상적입니다.

이 페이지에서는 도구를 구현하고, 레지스트리를 통해 도구를 관리하며, 도구를 호출하고, 노드 기반 에이전트 아키텍처 내에서 사용하는 방법을 설명합니다.

!!! note
    이 API는 멀티플랫폼입니다. 이를 통해 다양한 플랫폼에서 동일한 도구를 사용할 수 있습니다.

## 도구 구현

Koog 프레임워크는 도구를 구현하기 위한 다음 접근 방식을 제공합니다.

*   모든 도구의 기본 클래스인 `Tool`을 사용하는 방법. 텍스트가 아닌 결과를 반환해야 하거나 도구 동작에 대한 완벽한 제어가 필요한 경우 이 클래스를 사용해야 합니다.
*   기본 `Tool` 클래스를 확장하고 텍스트 결과를 반환하는 도구 생성을 단순화하는 `SimpleTool` 클래스를 사용하는 방법. 도구가 텍스트만 반환하면 되는 시나리오에는 이 접근 방식을 사용해야 합니다.

두 접근 방식 모두 동일한 핵심 구성 요소를 사용하지만 구현 및 반환하는 결과에서 차이가 있습니다.

### Tool 클래스

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 추상 클래스는 Koog에서 도구를 생성하기 위한 기본 클래스입니다.
이 클래스를 사용하면 특정 인자 타입(`Args`)을 허용하고 다양한 타입의 결과(`Result`)를 반환하는 도구를 생성할 수 있습니다.

각 도구는 다음 구성 요소로 구성됩니다.

| <div style="width:110px">구성 요소</div> | 설명                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 도구에 필요한 인자를 정의하는 직렬화 가능한 데이터 클래스입니다.                                                                                                                                                                                                                                                                                                                                                                                           |
| `Result`                                 | 도구가 반환하는 직렬화 가능한 결과 타입입니다. 사용자 정의 형식으로 도구 결과를 표시하려면 [`ToolResult.TextSerializable`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 클래스를 상속하고 `textForLLM(): String` 메서드를 구현하세요.                                                                                                          |
| `argsSerializer`                         | 도구의 인자가 역직렬화되는 방식을 정의하는 오버라이드된 변수입니다. 또한 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)를 참조하세요.                                                                                                                                                                                                                       |
| `resultSerializer`                       | 도구의 결과가 역직렬화되는 방식을 정의하는 오버라이드된 변수입니다. 또한 [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)를 참조하세요. [`ToolResult.TextSerializable`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)을 상속하기로 선택했다면 `ToolResultUtils.toTextSerializer()` 사용을 고려하세요. |
| `descriptor`                             | 도구 메타데이터를 지정하는 오버라이드된 변수입니다:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (기본값은 비어 있음)<br/>- `optionalParameters` (기본값은 비어 있음)<br/>또한 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)를 참조하세요.                                                                                                                               |
| `execute()`                              | 도구의 로직을 구현하는 함수입니다. `Args` 타입의 인자를 받고 `Result` 타입의 결과를 반환합니다. 또한 [execute()]()를 참조하세요.                                                                                                                                                                                                                                                                                 |

!!! tip
    LLM이 도구를 올바르게 이해하고 사용하기 쉽도록 도구에 명확한 설명과 잘 정의된 매개변수 이름을 지정하세요.

#### 사용 예시

다음은 숫자 결과를 반환하는 `Tool` 클래스를 사용한 사용자 정의 도구 구현 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// Implement a simple calculator tool that adds two digits
object CalculatorTool : Tool<CalculatorTool.Args, Int>(
    argsSerializer = Args.serializer(),
    resultSerializer = Int.serializer(),
    name = "calculator",
    description = "A simple calculator that can add two digits (0-9)."
) {

    // Arguments for the calculator tool
    @Serializable
    data class Args(
        @property:LLMDescription("The first digit to add (0-9)")
        val digit1: Int,
        @property:LLMDescription("The second digit to add (0-9)")
        val digit2: Int
    ) {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // Function to add two digits
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

도구를 구현한 후에는 도구 레지스트리에 추가한 다음 에이전트와 함께 사용해야 합니다. 자세한 내용은 [도구 레지스트리](tools-overview.md#tool-registry)를 참조하세요.

자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)를 참조하세요.

### SimpleTool 클래스

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 추상 클래스는 `Tool<Args, ToolResult.Text>`를 확장하며 텍스트 결과를 반환하는 도구 생성을 단순화합니다.

각 간단한 도구는 다음 구성 요소로 구성됩니다.

| <div style="width:110px">구성 요소</div> | 설명                                                                                                                                                                                                                                                                                              |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 사용자 정의 도구에 필요한 인자를 정의하는 직렬화 가능한 데이터 클래스입니다.                                                                                                                                                                                                                         |
| `argsSerializer`                         | 도구의 인자가 직렬화되는 방식을 정의하는 오버라이드된 변수입니다. 또한 [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)를 참조하세요.                                                                                             |
| `descriptor`                             | 도구 메타데이터를 지정하는 오버라이드된 변수입니다:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (기본값은 비어 있음)<br/> - `optionalParameters` (기본값은 비어 있음)<br/> 또한 [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)를 참조하세요. |
| `doExecute()`                            | 도구가 수행하는 주요 동작을 설명하는 오버라이드된 함수입니다. `Args` 타입의 인자를 받고 `String`을 반환합니다. 또한 [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)를 참조하세요.                                          |

!!! tip
    LLM이 도구를 올바르게 이해하고 사용하기 쉽도록 도구에 명확한 설명과 잘 정의된 매개변수 이름을 지정하세요.

#### 사용 예시

다음은 `SimpleTool`을 사용한 사용자 정의 도구 구현 예시입니다.

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.Serializable
-->
```kotlin
// Create a tool that casts a string expression to a double value
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
    argsSerializer = Args.serializer(),
    name = "cast_to_double",
    description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
) {
    // Define tool arguments
    @Serializable
    data class Args(
        @property:LLMDescription("An expression to case to double")
        val expression: String,
        @property:LLMDescription("A comment on how to process the expression")
        val comment: String
    )

    // Function that executes the tool with the provided arguments
    override suspend fun execute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }

    // Function to cast a string expression to a double value
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### LLM에 도구 결과를 사용자 정의 형식으로 전송

JSON 결과가 LLM에 전송되는 방식이 만족스럽지 않다면 (예를 들어, 어떤 경우에는 도구 출력이 Markdown으로 구조화될 때 LLM이 더 잘 작동할 수 있습니다) 다음 단계를 따라야 합니다.
1.  `ToolResult.TextSerializable` 인터페이스를 구현하고 `textForLLM()` 메서드를 오버라이드합니다.
2.  `ToolResultUtils.toTextSerializer<T>()`를 사용하여 `resultSerializer`를 오버라이드합니다.

#### 예시

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// A tool that edits file
object EditFile : Tool<EditFile.Args, EditFile.Result>(
    argsSerializer = Args.serializer(),
    resultSerializer = Result.serializer(),
    name = "edit_file",
    description = "Edits the given file"
) {
    // Define tool arguments
    @Serializable
    public data class Args(
        val path: String,
        val original: String,
        val replacement: String
    )

    @Serializable
    public data class Result(
        private val patchApplyResult: PatchApplyResult
    ) {

        @Serializable
        public sealed interface PatchApplyResult {
            @Serializable
            public data class Success(val updatedContent: String) : PatchApplyResult

            @Serializable
            public sealed class Failure(public val reason: String) : PatchApplyResult
        }

        // Textual output (in Markdown format) that will be visible to the LLM after the tool finishes.
        fun textForLLM(): String = markdown {
            if (patchApplyResult is PatchApplyResult.Success) {
                line {
                    bold("Successfully").text(" edited file (patch applied)")
                }
            } else {
                line {
                    text("File was ")
                        .bold("not")
                        .text(" modified (patch application failed: ${(patchApplyResult as PatchApplyResult.Failure).reason})")
                }
            }
        }

        override fun toString(): String = textForLLM()
    }

    // Function that executes the tool with the provided arguments
    override suspend fun execute(args: Args): Result {
        return TODO("Implement file edit")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt --> 

도구를 구현한 후에는 도구 레지스트리에 추가한 다음 에이전트와 함께 사용해야 합니다.
자세한 내용은 [도구 레지스트리](tools-overview.md#tool-registry)를 참조하세요.