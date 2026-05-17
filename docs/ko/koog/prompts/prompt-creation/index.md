# 프롬프트 생성하기

Koog는 메시지 타입, 순서 및 내용을 제어하여 프롬프트를 생성할 수 있는 구조화된 방법을 제공합니다:

* **Kotlin** 사용자의 경우, 타입 안전(type-safe) Kotlin DSL을 사용합니다.
* **Java** 사용자의 경우, 플루언트 빌더(fluent builder) API를 사용합니다.

## 기본 구조

Kotlin의 `prompt()` 함수 또는 Java의 `Prompt.builder()`는 고유 ID와 메시지 목록을 가진 Prompt 객체를 생성합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // 메시지 목록
    }
    ```
    <!--- KNIT example-creating-prompts-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("unique_prompt_id")
        // 메시지 목록
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-01.java -->

## 메시지 타입

Kotlin DSL과 Java 빌더 API는 대화에서 각각의 특정 역할에 해당하는 다음과 같은 타입의 메시지를 지원합니다:

- **시스템 메시지(System message)**: LLM에 컨텍스트, 지침 및 제약 조건을 제공하여 동작을 정의합니다.
- **사용자 메시지(User message)**: 사용자 입력을 나타냅니다.
- **어시스턴트 메시지(Assistant message)**: 퓨샷 러닝(few-shot learning)이나 대화를 이어가기 위해 사용되는 LLM 응답을 나타냅니다.
- **도구 메시지(Tool message)**: 도구 호출과 그 결과를 나타냅니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // 컨텍스트 설정을 위한 시스템 메시지 추가
        system("You are a helpful assistant with access to tools.")
        // 사용자 메시지 추가
        user("What is 5 + 3 ?")
        // 어시스턴트 메시지 추가
        assistant("The result is 8.")
    }
    ```
    <!--- KNIT example-creating-prompts-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("unique_prompt_id")
        // 컨텍스트 설정을 위한 시스템 메시지 추가
        .system("You are a helpful assistant with access to tools.")
        // 사용자 메시지 추가
        .user("What is 5 + 3 ?")
        // 어시스턴트 메시지 추가
        .assistant("The result is 8.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-02.java -->

### 시스템 메시지

시스템 메시지는 LLM의 동작을 정의하고 전체 대화의 컨텍스트를 설정합니다.
모델의 역할, 어조를 지정할 수 있으며, 응답에 대한 가이드라인과 제약 조건, 응답 예시 등을 제공할 수 있습니다.

시스템 메시지를 생성하려면 Kotlin의 `system()` 함수 또는 Java 메서드에 인자로 문자열을 전달합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("system_message") {
        system("You are a helpful assistant that explains technical concepts.")
    }
    ```
    <!--- KNIT example-creating-prompts-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("system_message")
        .system("You are a helpful assistant that explains technical concepts.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-03.java -->

### 사용자 메시지

사용자 메시지는 사용자의 입력을 나타냅니다.
사용자 메시지를 생성하려면 Kotlin의 `user()` 함수 또는 Java 메서드에 인자로 문자열을 전달합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("user_message") {
        system("You are a helpful assistant.")
        user("What is Koog?")
    }
    ```
    <!--- KNIT example-creating-prompts-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("user_message")
        .system("You are a helpful assistant.")
        .user("What is Koog?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-04.java -->

대부분의 사용자 메시지는 일반 텍스트를 포함하지만, 이미지, 오디오, 비디오 및 문서와 같은 멀티모달(multimodal) 콘텐츠를 포함할 수도 있습니다.
자세한 내용과 예시는 [Multimodal content](multimodal-content.md)를 참고하세요.

### 어시스턴트 메시지

어시스턴트 메시지는 LLM의 응답을 나타내며, 향후 유사한 상호작용을 위한 퓨샷 러닝, 대화 지속 또는 예상되는 출력 구조를 보여주는 데 사용될 수 있습니다.

어시스턴트 메시지를 생성하려면 Kotlin의 `assistant()` 함수 또는 Java 메서드에 인자로 문자열을 전달합니다:

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("article_review")
        .system("Evaluate the article.")

        // 예시 1
        .user("The article is clear and easy to understand.")
        .assistant("positive")

        // 예시 2
        .user("The article is hard to read but it's clear and useful.")
        .assistant("neutral")

        // 예시 3
        .user("The article is confusing and misleading.")
        .assistant("negative")

        // 분류할 새로운 입력
        .user("The article is interesting and helpful.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-05.java -->

### 도구 메시지

도구 메시지는 도구 호출과 그 결과를 나타내며, 도구 호출 이력을 미리 채워 넣는 데 사용될 수 있습니다.

!!! tip
    LLM은 실행 중에 도구 호출을 생성합니다.
    이를 미리 채워 넣는 것은 퓨샷 러닝이나 도구의 예상 사용법을 보여주는 데 유용합니다.

도구 메시지를 생성하려면 Kotlin의 `tool()` 함수를 호출하거나 Java의 `toolCall()` 및 `toolResult()` 메서드를 호출합니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("calculator_example") {
        system("You are a helpful assistant with access to tools.")
        user("What is 5 + 3?")
        // 도구 호출
        toolCall(
            id = "calculator_tool_id",
            tool = "calculator",
            args = """{"operation": "add", "a": 5, "b": 3}"""
        )
        // 도구 결과
        toolResult(
            id = "calculator_tool_id",
            tool = "calculator",
            output = "8"
        )

        // 도구 결과를 바탕으로 한 LLM 응답
        assistant("The result of 5 + 3 is 8.")
        user("What is 4 + 5?")
    }
    ```
    <!--- KNIT example-creating-prompts-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("calculator_example")
        .system("You are a helpful assistant with access to tools.")
        .user("What is 5 + 3?")
        // 도구 호출
        .toolCall("calculator_tool_id", "calculator", "{\"operation\": \"add\", \"a\": 5, \"b\": 3}")
        // 도구 결과
        .toolResult("calculator_tool_id", "calculator", "8")
        // 도구 결과를 바탕으로 한 LLM 응답    
        .assistant("The result of 5 + 3 is 8.")
        .user("What is 4 + 5?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-06.java -->

## 텍스트 메시지 빌더

!!! warning
    텍스트 메시지 빌더는 Kotlin에서만 사용할 수 있습니다.

`system()`, `user()`, 또는 `assistant()` 메시지를 작성할 때, 리치 텍스트 포맷팅을 위해 헬퍼 [텍스트 빌딩 함수](api:prompt-model::ai.koog.prompt.text.TextContentBuilder)를 사용할 수 있습니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("text_example") {
        user {
            +"Review the following code snippet:"
            +"fun greet(name: String) = println(\"Hello, \$name!\")"

            // 단락 구분
            br()
            text("Please include in your explanation:")

            // 콘텐츠 들여쓰기
            padding("  ") {
                +"1. What the function does."
                +"2. How string interpolation works."
            }
        }
    }
    ```
    <!--- KNIT example-creating-prompts-07.kt -->

또한 [Markdown](api:prompt-markdown::ai.koog.prompt.markdown.markdown) 및 [XML](api:prompt-xml::ai.koog.prompt.xml.xml) 빌더를 사용하여 해당 형식으로 콘텐츠를 추가할 수도 있습니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.markdown.markdown
    import ai.koog.prompt.xml.xml
    -->

    ```kotlin
    val prompt = prompt("markdown_xml_example") {
        // Markdown 형식의 사용자 메시지
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
    텍스트 빌딩 함수를 XML 및 Markdown 빌더와 혼합하여 사용할 수 있습니다.

## 프롬프트 파라미터

LLM의 동작을 제어하는 파라미터를 설정하여 프롬프트를 커스터마이징할 수 있습니다.

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 먼저 파라미터 생성
    LLMParams params = new LLMParams(
        0.7,                    // temperature
        null,                   // maxTokens
        1,                      // numberOfChoices
        null,                   // speculation
        null,                   // schema
        LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
        null,                   // user
        null                    // additionalProperties
    );

    Prompt prompt = Prompt.builder("custom_params")
        .system("You are a creative writing assistant.")
        .user("Write a song about winter.")
        .build();
        
    // 생성된 프롬프트에 파라미터 적용
    prompt = prompt.withParams(params);
    ```
    <!--- KNIT example-creating-prompts-java-07.java -->

다음과 같은 파라미터들이 지원됩니다:

- `temperature`: 모델 응답의 무작위성을 제어합니다.
- `toolChoice`: 모델의 도구 호출 동작을 제어합니다.
- `numberOfChoices`: 여러 개의 대체 응답을 요청합니다.
- `schema`: 모델의 응답 형식에 대한 구조를 정의합니다.
- `maxTokens`: 응답의 토큰 수를 제한합니다.
- `speculation`: 예상되는 응답 형식에 대한 힌트를 제공합니다 (특정 모델에서만 지원됨).

자세한 내용은 [LLM parameters](../../llm-parameters.md)를 참고하세요.

## 기존 프롬프트 확장하기

기존 프롬프트를 인자로 하여 Kotlin의 `prompt()` 함수 또는 Java의 `Prompt.builder()`를 호출함으로써 기존 프롬프트를 확장할 수 있습니다:

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt basePrompt = Prompt.builder("base")
        .system("You are a helpful assistant.")
        .user("Hello!")
        .assistant("Hi! How can I help you?")
        .build();

    Prompt extendedPrompt = Prompt.builder(String.valueOf(basePrompt))
        .user("What's the weather like?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-08.java -->

이렇게 하면 `basePrompt`의 모든 메시지와 새로운 사용자 메시지를 포함하는 새 프롬프트가 생성됩니다.

## 다음 단계

- [멀티모달 콘텐츠](multimodal-content.md) 작업 방법을 알아보세요.
- 단일 LLM 제공업체를 사용하는 경우 [LLM 클라이언트](../llm-clients.md)로 프롬프트를 실행해 보세요.
- 여러 LLM 제공업체를 사용하는 경우 [프롬프트 실행기](../prompt-executors.md)로 프롬프트를 실행해 보세요.
- [캐시 제어](cache-control.md)를 통해 LLM 캐시를 사용하는 방법을 알아보세요.