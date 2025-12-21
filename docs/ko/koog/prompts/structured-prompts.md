# 구조화된 프롬프트

Koog는 타입 세이프(type-safe) Kotlin DSL을 사용하여 메시지 유형, 순서, 내용에 대한 제어를 통해 구조화된 프롬프트를 생성합니다.

구조화된 프롬프트를 사용하면 여러 메시지로 대화 기록을 사전 구성하고, 다중 모달 콘텐츠, 예시, 도구 호출 및 그 결과를 제공할 수 있습니다.

## 기본 구조

`prompt()` 함수는 고유 ID와 메시지 목록을 가진 Prompt 객체를 생성합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // List of messages
}
```
<!--- KNIT example-structured-prompts-01.kt -->

## 메시지 유형

Kotlin DSL은 다음 메시지 유형을 지원하며, 각 유형은 대화에서 특정 역할에 해당합니다:

-   **시스템 메시지**: LLM에 컨텍스트, 지침, 제약 조건을 제공하여 LLM의 동작을 정의합니다.
-   **사용자 메시지**: 텍스트, 이미지, 오디오, 비디오 또는 문서를 포함할 수 있는 사용자 입력을 나타냅니다.
-   **어시스턴트 메시지**: 퓨샷 학습(few-shot learning)에 사용되거나 대화를 계속하는 데 사용되는 LLM 응답을 나타냅니다.
-   **도구 메시지**: 도구 호출과 그 결과를 나타냅니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // Add a system message to set the context
    system("You are a helpful assistant with access to tools.")
    // Add a user message
    user("What is 5 + 3 ?")
    // Add an assistant message
    assistant("The result is 8.")
}
```
<!--- KNIT example-structured-prompts-02.kt -->

### 시스템 메시지

시스템 메시지는 LLM 동작을 정의하고 전체 대화의 컨텍스트를 설정합니다. 모델의 역할, 어조를 지정하고, 응답에 대한 지침 및 제약 조건을 제공하며, 응답 예시를 제공할 수 있습니다.

시스템 메시지를 생성하려면 `system()` 함수에 문자열을 인수로 제공합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-structured-prompts-03.kt -->

### 사용자 메시지

사용자 메시지는 사용자로부터의 입력을 나타냅니다. 일반 텍스트 또는 다중 모달(multimodal) 콘텐츠(예: 이미지, 오디오, 비디오 및 문서)를 포함할 수 있습니다.

사용자 메시지를 생성하려면 `user()` 함수에 문자열을 인수로 제공합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("question") {
    system("You are a helpful assistant.")
    user("What is Koog?")
}
```
<!--- KNIT example-structured-prompts-04.kt -->

다중 모달 콘텐츠에 대한 자세한 내용은 [다중 모달 입력](#multimodal-inputs)을 참조하세요.

### 어시스턴트 메시지

어시스턴트 메시지는 LLM 응답을 나타내며, 향후 유사한 상호 작용에서 퓨샷 학습을 위해 사용되거나, 대화를 계속하거나, 예상되는 출력 구조를 보여주기 위해 사용될 수 있습니다.

어시스턴트 메시지를 생성하려면 `assistant()` 함수에 문자열을 인수로 제공합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("article_review") {
    system("Evaluate the article.")

    // Example 1
    user("The article is clear and easy to understand.")
    assistant("positive")

    // Example 2
    user("The article is hard to read but it's clear and useful.")
    assistant("neutral")

    // Example 3
    user("The article is confusing and misleading.")
    assistant("negative")

    // New input to classify
    user("The article is interesting and helpful.")
}
```
<!--- KNIT example-structured-prompts-05.kt -->

### 도구 메시지

도구 메시지는 도구 호출과 그 결과를 나타내며, 도구 호출 기록을 미리 채우는 데 사용될 수 있습니다.

!!! tip
    LLM은 실행 중에 도구 호출을 생성합니다. 이를 미리 채워두는 것은 퓨샷 학습에 유용하거나 도구가 어떻게 사용될 것으로 예상되는지 보여주는 데 도움이 됩니다.

도구 메시지를 생성하려면 `tool()` 함수를 호출합니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("calculator_example") {
    system("You are a helpful assistant with access to tools.")
    user("What is 5 + 3?")
    tool {
        // Tool call
        call(
            id = "calculator_tool_id",
            tool = "calculator",
            content = """{"operation": "add", "a": 5, "b": 3}"""
        )

        // Tool result
        result(
            id = "calculator_tool_id",
            tool = "calculator",
            content = "8"
        )
    }

    // LLM response based on tool result
    assistant("The result of 5 + 3 is 8.")
}
```
<!--- KNIT example-structured-prompts-06.kt -->

## 텍스트 메시지 빌더

`system()`, `user()`, 또는 `assistant()` 메시지를 빌드할 때, 리치 텍스트 서식 지정을 위해 헬퍼 [텍스트 빌딩 함수](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html)를 사용할 수 있습니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("text_example") {
    user {
        +"Review the following code snippet:"
        +"fun greet(name: String) = println(\"Hello, \$name!\")"

        // Paragraph break
        br()
        text("Please include in your explanation:")

        // Indent content
        padding("  ") {
            +"1. What the function does."
            +"2. How string interpolation works."
        }
    }
}
```
<!--- KNIT example-structured-prompts-07.kt -->

또한 [Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 및 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 빌더를 사용하여 해당 형식으로 콘텐츠를 추가할 수 있습니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.markdown.markdown
import ai.koog.prompt.xml.xml
-->
```kotlin
val prompt = prompt("markdown_xml_example") {
    // A user message in Markdown format
    user {
        markdown {
            h2("Evaluate the article using the following criteria:")
            bulleted {
                item { +"Clarity and readability" }
                item { +"Accuracy of information" }
                item { +"Usefulness to the reader" }
            }
        }
    }
    // An assistant message in XML format
    assistant {
        xml {
            xmlDeclaration()
            tag("review") {
                tag("clarity") { text("positive") }
                tag("accuracy") { text("neutral") }
                tag("usefulness") { text("positive") }
            }
        }
    }
}
```
<!--- KNIT example-structured-prompts-08.kt -->

!!! tip
    텍스트 빌딩 함수를 XML 및 Markdown 빌더와 혼합하여 사용할 수 있습니다.

## 프롬프트 매개변수

프롬프트는 LLM의 동작을 제어하는 매개변수를 구성하여 사용자 정의할 수 있습니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.params.LLMParams
import ai.koog.prompt.params.LLMParams.ToolChoice
-->
```kotlin
val prompt = prompt(
    id = "custom_params",
    params = LLMParams(
        temperature = 0.7,
        numberOfChoices = 1,
        toolChoice = LLMParams.ToolChoice.Auto
    )
) {
    system("You are a creative writing assistant.")
    user("Write a song about winter.")
}
```
<!--- KNIT example-structured-prompts-09.kt -->

다음 매개변수가 지원됩니다:

-   `temperature`: 무작위성 제어 (0.0 = 집중/결정론적, 1.0+ = 창의적/다양성)
-   `toolChoice`: 도구 사용 전략 (`Auto`, `Required`, `Named(toolName)`)
-   `numberOfChoices`: 여러 독립적인 응답 요청
-   `schema`: 구조화된 출력 형식 정의 (구조화된 출력용)

더 많은 정보는 [LLM 매개변수](llm-parameters.md)를 참조하세요.

## 기존 프롬프트 확장

기존 프롬프트를 인수로 사용하여 `prompt()` 함수를 호출함으로써 기존 프롬프트를 확장할 수 있습니다:

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val basePrompt = prompt("base") {
    system("You are a helpful assistant.")
    user("Hello!")
    assistant("Hi! How can I help you?")
}

val extendedPrompt = prompt(basePrompt) {
    user("What's the weather like?")
}
```
<!--- KNIT example-structured-prompts-10.kt -->

이렇게 하면 `basePrompt`의 모든 메시지와 새 사용자 메시지를 포함하는 새 프롬프트가 생성됩니다.

## 다음 단계

-   [다중 모달 콘텐츠](multimodal-inputs.md) 작업 방법을 알아보세요.
-   단일 LLM 공급자와 작업하는 경우 [LLM 클라이언트](llm-clients.md)로 프롬프트를 실행하세요.
-   여러 LLM 공급자와 작업하는 경우 [프롬프트 실행기](prompt-executors.md)로 프롬프트를 실행하세요.