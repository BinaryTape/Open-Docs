# 프롬프트 생성

Koog는 타입 안전한 Kotlin DSL을 사용하여 메시지 유형, 순서 및 내용에 대한 제어를 통해 프롬프트를 생성합니다.

이러한 프롬프트를 통해 여러 메시지로 대화 기록을 미리 구성하고, 멀티모달 콘텐츠, 예시, 도구 호출 및 그 결과를 제공할 수 있습니다.

## 기본 구조

`prompt()` 함수는 고유 ID와 메시지 목록을 사용하여 `Prompt` 객체를 생성합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // List of messages
}
```
<!--- KNIT example-creating-prompts-01.kt -->

## 메시지 유형

Kotlin DSL은 다음 유형의 메시지를 지원하며, 각 메시지는 대화에서 특정 역할에 해당합니다.

-   **시스템 메시지**: LLM에 컨텍스트, 지침, 제약 조건을 제공하여 LLM의 동작을 정의합니다.
-   **사용자 메시지**: 사용자 입력을 나타냅니다.
-   **어시스턴트 메시지**: 퓨샷 학습에 사용되거나 대화를 계속하기 위한 LLM 응답을 나타냅니다.
-   **도구 메시지**: 도구 호출 및 그 결과를 나타냅니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 컨텍스트를 설정하는 시스템 메시지 추가
    system("You are a helpful assistant with access to tools.")
    // 사용자 메시지 추가
    user("What is 5 + 3 ?")
    // 어시스턴트 메시지 추가
    assistant("The result is 8.")
}
```
<!--- KNIT example-creating-prompts-02.kt -->

### 시스템 메시지

시스템 메시지는 LLM 동작을 정의하고 전체 대화의 컨텍스트를 설정합니다. 모델의 역할, 어조를 지정하고, 응답에 대한 지침 및 제약 조건을 제공하며, 응답 예시를 제공할 수 있습니다.

시스템 메시지를 생성하려면 `system()` 함수에 문자열을 인자로 제공합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-creating-prompts-03.kt -->

### 사용자 메시지

사용자 메시지는 사용자로부터의 입력을 나타냅니다. 사용자 메시지를 생성하려면 `user()` 함수에 문자열을 인자로 제공합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("question") {
    system("You are a helpful assistant.")
    user("What is Koog?")
}
```
<!--- KNIT example-creating-prompts-04.kt -->

대부분의 사용자 메시지는 일반 텍스트를 포함하지만, 이미지, 오디오, 비디오 및 문서와 같은 멀티모달 콘텐츠를 포함할 수도 있습니다. 자세한 내용 및 예시는 [멀티모달 콘텐츠](multimodal-content.md)를 참조하세요.

### 어시스턴트 메시지

어시스턴트 메시지는 LLM 응답을 나타내며, 향후 유사한 상호작용에서 퓨샷 학습에 사용되거나, 대화를 계속하거나, 예상되는 출력 구조를 시연하는 데 사용될 수 있습니다.

어시스턴트 메시지를 생성하려면 `assistant()` 함수에 문자열을 인자로 제공합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("article_review") {
    system("Evaluate the article.")

    // 예시 1
    user("The article is clear and easy to understand.")
    assistant("positive")

    // 예시 2
    user("The article is hard to read but it's clear and useful.")
    assistant("neutral")

    // 예시 3
    user("The article is confusing and misleading.")
    assistant("negative")

    // 분류할 새로운 입력
    user("The article is interesting and helpful.")
}
```
<!--- KNIT example-creating-prompts-05.kt -->

### 도구 메시지

도구 메시지는 도구 호출 및 그 결과를 나타내며, 도구 호출 기록을 미리 채우는 데 사용될 수 있습니다.

!!! tip
    LLM은 실행 중에 도구 호출을 생성합니다. 이를 미리 채우는 것은 퓨샷 학습에 유용하거나 도구가 어떻게 사용될 것으로 예상되는지 시연하는 데 도움이 됩니다.

도구 메시지를 생성하려면 `tool()` 함수를 호출합니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("calculator_example") {
    system("You are a helpful assistant with access to tools.")
    user("What is 5 + 3?")
    tool {
        // 도구 호출
        call(
            id = "calculator_tool_id",
            tool = "calculator",
            content = """{"operation": "add", "a": 5, "b": 3}"""
        )

        // 도구 결과
        result(
            id = "calculator_tool_id",
            tool = "calculator",
            content = "8"
        )
    }

    // 도구 결과에 따른 LLM 응답
    assistant("The result of 5 + 3 is 8.")
    user("What is 4 + 5?")
}
```
<!--- KNIT example-creating-prompts-06.kt -->

## 텍스트 메시지 빌더

`system()`, `user()`, 또는 `assistant()` 메시지를 빌드할 때, 리치 텍스트 서식을 위해 헬퍼 [텍스트 빌딩 함수](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html)를 사용할 수 있습니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("text_example") {
    user {
        +"Review the following code snippet:"
        +"fun greet(name: String) = println(\"Hello, \$name!\")"

        // 단락 나누기
        br()
        text("Please include in your explanation:")

        // 내용 들여쓰기
        padding("  ") {
            +"1. What the function does."
            +"2. How string interpolation works."
        }
    }
}
```
<!--- KNIT example-creating-prompts-07.kt -->

또한 [마크다운](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 및 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 빌더를 사용하여 해당 형식으로 콘텐츠를 추가할 수 있습니다.

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.markdown.markdown
import ai.koog.prompt.xml.xml
-->
```kotlin
val prompt = prompt("markdown_xml_example") {
    // 마크다운 형식의 사용자 메시지
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
    // XML 형식의 어시스턴트 메시지
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
<!--- KNIT example-creating-prompts-08.kt -->

!!! tip
    텍스트 빌딩 함수를 XML 및 마크다운 빌더와 함께 사용할 수 있습니다.

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
<!--- KNIT example-creating-prompts-09.kt -->

다음 매개변수가 지원됩니다.

-   `temperature`: 모델 응답의 무작위성을 제어합니다.
-   `toolChoice`: 모델의 도구 호출 동작을 제어합니다.
-   `numberOfChoices`: 여러 대체 응답을 요청합니다.
-   `schema`: 모델 응답 형식의 구조를 정의합니다.
-   `maxTokens`: 응답의 토큰 수를 제한합니다.
-   `speculation`: 예상되는 응답 형식에 대한 힌트를 제공합니다 (특정 모델에서만 지원됨).

자세한 내용은 [LLM 매개변수](../../llm-parameters.md)를 참조하세요.

## 기존 프롬프트 확장

기존 프롬프트를 인자로 사용하여 `prompt()` 함수를 호출함으로써 기존 프롬프트를 확장할 수 있습니다.

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
<!--- KNIT example-creating-prompts-10.kt -->

이는 `basePrompt`의 모든 메시지와 새 사용자 메시지를 포함하는 새 프롬프트를 생성합니다.

## 다음 단계

-   [멀티모달 콘텐츠](multimodal-content.md) 작업 방법을 배웁니다.
-   단일 LLM 공급자와 작업하는 경우 [LLM 클라이언트](../llm-clients.md)로 프롬프트를 실행합니다.
-   여러 LLM 공급자와 작업하는 경우 [프롬프트 실행기](../prompt-executors.md)로 프롬프트를 실행합니다.