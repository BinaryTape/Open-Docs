# 클래스 기반 도구 (Class-based tools)

이 섹션에서는 향상된 유연성과 커스텀 동작이 필요한 시나리오를 위해 설계된 API를 설명합니다.
Kotlin에서 이 방식을 사용하면 파라미터, 메타데이터, 실행 로직, 등록 및 호출 방법을 포함하여 도구에 대한 모든 제어 권한을 가질 수 있습니다. Java에서 도구는 리플렉션 기반 등록과 함께 어노테이션 기반 메서드를 사용하여 생성됩니다.

이러한 수준의 제어는 기본 사용 사례를 확장하는 정교한 도구를 제작하는 데 이상적이며, 에이전트 세션 및 워크플로에 원활하게 통합할 수 있도록 해줍니다.

이 페이지에서는 Kotlin과 Java 모두에서 도구를 구현하고, 레지스트리를 통해 도구를 관리하며, 도구를 호출하고 노드 기반 에이전트 아키텍처 내에서 사용하는 방법을 설명합니다.

!!! note
    API는 Kotlin의 경우 멀티플랫폼을 지원합니다. Java 도구는 어노테이션 기반 메서드를 사용하여 구현되며 리플렉션을 통해 등록됩니다. 이를 통해 Kotlin에서는 여러 플랫폼에서 동일한 도구를 사용할 수 있으며, Java는 완전한 JVM 상호운용성(interoperability)을 제공합니다.

## 도구 구현 (Tool implementation)

Koog 프레임워크는 도구 구현을 위해 다음과 같은 접근 방식을 제공합니다:

Kotlin의 경우:

*   모든 도구의 기본 클래스인 `Tool` 사용. 텍스트가 아닌 결과를 반환해야 하거나 도구 동작에 대한 완전한 제어가 필요한 경우 이 클래스를 사용해야 합니다.
*   기본 `Tool` 클래스를 확장하고 텍스트 결과 반환을 단순화하는 `SimpleTool` 클래스 사용. 도구가 텍스트만 반환하면 되는 시나리오에서 이 방식을 사용해야 합니다.

두 방식 모두 동일한 핵심 컴포넌트를 사용하지만 구현 방식과 반환하는 결과가 다릅니다.

Java의 경우:

*   리플렉션 기반 등록과 함께 어노테이션 기반 메서드(`@Tool` 및 `@LLMDescription`) 사용. Java에서 Kotlin의 `Tool` 또는 `SimpleTool`을 상속하는 것은 일시 중단 함수(suspend function) 제한으로 인해 지원되지 않으므로, 이것이 Java 상호운용성을 위한 권장 방식입니다.

### Tool 클래스 (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 추상 클래스는 Kotlin에서 도구를 만들기 위한 기본 클래스입니다.
이를 통해 특정 인자 타입(`Args`)을 허용하고 다양한 타입의 결과(`Result`)를 반환하는 도구를 만들 수 있습니다.

각 도구는 다음과 같은 컴포넌트로 구성됩니다:

| <div style="width:110px">컴포넌트</div> | 설명                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 도구에 필요한 인자(arguments)를 정의하는 직렬화 가능한(serializable) 데이터 클래스입니다.                                                                                                                                                                                                                                                                                                                                                            |
| `Result`                                 | 도구가 반환하는 결과의 직렬화 가능한 타입입니다. 도구 결과를 커스텀 형식으로 표시하려면 [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) 클래스를 상속하고 `textForLLM(): String` 메서드를 구현하세요.                                                                                                          |
| `argsSerializer`                         | 도구의 인자가 역직렬화(deserialized)되는 방식을 정의하는 오버라이드된 변수입니다. [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)를 참조하세요.                                                                                                                          |
| `resultSerializer`                       | 도구의 결과가 역직렬화되는 방식을 정의하는 오버라이드된 변수입니다. [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html)를 참조하세요. [ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html)을 상속하기로 한 경우 `ToolResultUtils.toTextSerializer()` 사용을 고려해 보세요. |
| `descriptor`                             | 다음과 같은 도구 메타데이터를 지정하는 오버라이드된 변수입니다:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (기본값은 비어 있음)<br/>- `optionalParameters` (기본값은 비어 있음)<br/>[descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)를 참조하세요.                                                                                                                               |
| `execute()`                              | 도구의 로직을 구현하는 함수입니다. `Args` 타입의 인자를 받아 `Result` 타입의 결과를 반환합니다. [execute()]()를 참조하세요.                                                                                                                                                                                                                                                                                 |

!!! note "Java 구현"
    Java에서는 `Tool<Args, Result>`를 상속하는 대신 `@Tool` 및 `@LLMDescription`을 사용한 어노테이션 기반 메서드를 사용하세요. 프레임워크는 리플렉션을 통해 직렬화 및 등록을 자동으로 처리합니다. 자세한 내용은 아래의 [어노테이션 기반 메서드 (Java)](#annotation-based-methods-java) 섹션을 참조하세요.

!!! tip
    LLM이 도구를 제대로 이해하고 사용할 수 있도록 도구에 명확한 설명과 잘 정의된 파라미터 이름을 지정해야 합니다. Kotlin에서는 `descriptor` 속성을 사용하고, Java에서는 `@LLMDescription` 어노테이션을 사용하세요.

#### 사용 예시

다음은 숫자 결과를 반환하는 `Tool` 클래스를 사용한 커스텀 도구 구현 예시입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.Tool
    import ai.koog.agents.core.tools.ToolDescriptor
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    -->
    ```kotlin
    // 두 자릿수를 더하는 간단한 계산기 도구 구현
    object CalculatorTool : Tool<CalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "calculator",
        description = "A simple calculator that can add two digits (0-9)."
    ) {

        // 계산기 도구를 위한 인자
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

        // 두 자릿수를 더하는 함수
        override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
    }
    ```
    <!--- KNIT example-class-based-tools-01.kt -->

도구를 구현한 후에는 도구 레지스트리에 추가한 다음 에이전트와 함께 사용해야 합니다. 자세한 내용은 [도구 레지스트리(Tool registry)](tools-overview.md#tool-registry)를 참조하세요.

자세한 내용은 [API 레퍼런스](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)를 참조하세요.

### SimpleTool 클래스 (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 추상 클래스는 `Tool<Args, ToolResult.Text>`를 확장하며 텍스트 결과를 반환하는 도구의 생성을 단순화합니다.

각 simple 도구는 다음과 같은 컴포넌트로 구성됩니다:

| <div style="width:110px">컴포넌트</div> | 설명                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | 커스텀 도구에 필요한 인자를 정의하는 직렬화 가능한 데이터 클래스입니다.                                                                                                                                                                                                                         |
| `argsSerializer`                         | 도구의 인자가 직렬화되는 방식을 정의하는 오버라이드된 변수입니다. [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)를 참조하세요.                                                                                             |
| `descriptor`                             | 다음과 같은 도구 메타데이터를 지정하는 오버라이드된 변수입니다:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (기본값은 비어 있음)<br/> - `optionalParameters` (기본값은 비어 있음)<br/> [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)를 참조하세요. |
| `doExecute()`                            | 도구에 의해 수행되는 주요 동작을 설명하는 오버라이드된 함수입니다. `Args` 타입의 인자를 받아 `String`을 반환합니다. [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)를 참조하세요.                                          |

!!! note "Java 구현"
    Java에서 이에 상응하는 방식은 `String`을 반환하는 어노테이션 기반 메서드를 사용하는 것입니다. 프레임워크가 텍스트 결과 래핑을 자동으로 처리합니다. 자세한 내용은 아래의 [어노테이션 기반 메서드 (Java)](#annotation-based-methods-java) 섹션을 참조하세요.

!!! tip
    LLM이 도구를 제대로 이해하고 사용할 수 있도록 도구에 명확한 설명과 잘 정의된 파라미터 이름을 지정해야 합니다. Kotlin에서는 `descriptor` 및 생성자 파라미터를 사용하고, Java에서는 `@Tool` 및 `@LLMDescription` 어노테이션을 사용하세요.

#### 사용 예시 

다음은 Kotlin에서 `SimpleTool`을 사용한 커스텀 도구 구현 예시입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.SimpleTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 문자열 표현식을 double 값으로 변환하는 도구 생성
    object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
        argsType = typeToken<Args>(),
        name = "cast_to_double",
        description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
    ) {
        // 도구 인자 정의
        @Serializable
        data class Args(
            @property:LLMDescription("An expression to case to double")
            val expression: String,
            @property:LLMDescription("A comment on how to process the expression")
            val comment: String
        )

        // 제공된 인자로 도구를 실행하는 함수
        override suspend fun execute(args: Args): String {
            return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
        }

        // 문자열 표현식을 double 값으로 변환하는 함수
        private fun castToDouble(expression: String): Double {
            return expression.toDoubleOrNull() ?: 0.0
        }
    }
    ```
    <!--- KNIT example-class-based-tools-02.kt -->

### 어노테이션 기반 메서드 (Java)

Java에서 도구를 구현하려면 `Tool`이나 `SimpleTool`을 상속하는 대신 `@Tool` 및 `@LLMDescription`을 사용한 어노테이션 기반 메서드를 사용하세요. Koog는 리플렉션을 통해 직렬화 및 등록을 자동으로 처리합니다. 구현에 대해 자세히 알아보려면 아래의 Java 예시를 참조하세요.

#### 사용 예시

다음은 Kotlin의 `Tool` 클래스 사용과 상응하는 Java의 도구 구현 예시입니다.

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Java 상응 예시: 도구를 Java 메서드로 구현하고 ToolRegistry.builder()를 통해 등록합니다.
    // 이는 Kotlin의 Tool 베이스 클래스를 상속하는 대신 권장되는 Java 상호운용 경로입니다.
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "A simple calculator that can add two digits (0-9).")
        public static int calculator(
                @LLMDescription(description = "The first digit to add (0-9)") int digit1,
                @LLMDescription(description = "The second digit to add (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 must be a single digit (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 must be a single digit (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 참고: Java에서 Kotlin의 Tool<TArgs, TResult>를 상속하고 suspend execute(...)를 오버라이드하는 것은 지원되지 않습니다.
    // Java 상호운용성은 Java 메서드를 도구로 등록하기 위해 리플렉션 기반 등록을 사용합니다.
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

다음은 Kotlin의 `SimpleTool` 클래스 사용과 상응하는 Java의 도구 구현 예시입니다. 이 예시는 텍스트 결과를 반환하는 간단한 도구를 구현합니다.

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleTool에 상응하는 Java 예시: Java 메서드를 제공하고 이를 도구로 등록합니다.
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "casts the passed expression to double or returns 0.0 if the expression is not castable")
        public static String castToDouble(
                @LLMDescription(description = "An expression to case to double") String expression,
                @LLMDescription(description = "A comment on how to process the expression") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "Result: " + value + ", the comment was: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 참고: Java에서 Kotlin의 SimpleTool<TArgs>를 확장할 필요는 없으며, Java 메서드를 등록하는 것이 관용적인 접근 방식입니다.
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### 커스텀 형식으로 LLM에 도구 결과 전송하기

Kotlin의 경우:

LLM에 전송되는 JSON 결과가 만족스럽지 않은 경우(예를 들어, 도구 출력이 마크다운으로 구조화되었을 때 LLM이 더 잘 작동하는 경우), 다음 단계를 따라야 합니다:

1. `ToolResult.TextSerializable` 인터페이스를 구현하고 `textForLLM()` 메서드를 오버라이드합니다.
2. `ToolResultUtils.toTextSerializer<T>()`를 사용하여 `resultSerializer`를 오버라이드합니다.

Java의 경우:

어노테이션이 지정된 메서드에서 포맷된 텍스트(예: 마크다운)를 `String`으로 직접 반환하세요. 프레임워크가 이를 자동으로 처리합니다.

#### 예시

다음은 Kotlin과 Java 모두에서 커스텀 포맷 출력을 보여주는 예시입니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.Tool
    import ai.koog.agents.core.tools.ToolDescriptor
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.prompt.markdown.markdown
    -->
    ```kotlin
    // 파일을 편집하는 도구
    object EditFile : Tool<EditFile.Args, EditFile.Result>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Result>(),
        name = "edit_file",
        description = "Edits the given file"
    ) {
        // 도구 인자 정의
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

            // 도구가 종료된 후 LLM에게 보여질 텍스트 출력(마크다운 형식)입니다.
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

        // 제공된 인자로 도구를 실행하는 함수
        override suspend fun execute(args: Args): Result {
            return TODO("Implement file edit")
        }
    }
    ```
    <!--- KNIT example-class-based-tools-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;

    // Java 상응 예시: Java 메서드에서 LLM으로 마크다운 텍스트를 직접 반환하고 이를 도구로 등록합니다.
    // 이를 통해 커스텀 직렬화 가능 Result 타입(Kotlin 직렬화 지원이 필요함)을 사용할 필요가 없습니다.
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "Edits the given file")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: 파일 편집 로직 구현; 아래는 마크다운 출력을 보여주는 플레이스홀더입니다.
            boolean success = false;
            if (success) {
                return "**Successfully** edited file (patch applied)";
            } else {
                return "File was **not** modified (patch application failed: reason)";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 참고: Java에서 구조화된 커스텀 Result 객체가 필요한 경우, Kotlin @Serializable 타입이나
    // 다른 직렬화 도구 인식 타입을 노출해야 합니다. String 반환은 Koog의 Java 상호운용성에서 즉시 작동합니다.
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

Kotlin 또는 Java로 도구를 구현한 후에는 도구 레지스트리에 추가한 다음 에이전트와 함께 사용해야 합니다.
자세한 내용은 [도구 레지스트리(Tool registry)](tools-overview.md#tool-registry)를 참조하세요.