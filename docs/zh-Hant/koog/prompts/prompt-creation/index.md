# 建立提示

Koog 提供了一種結構化的方式來建立提示 (prompt)，並可控制訊息類型、其順序與內容：

* 對於 **Kotlin** 使用者，透過型別安全的 Kotlin DSL。
* 對於 **Java** 使用者，透過流暢的 builder API。

## 基本結構

Kotlin 中的 `prompt()` 函式或 Java 中的 `Prompt.builder()` 會建立一個具有唯一 ID 與訊息清單的 Prompt 物件：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // 訊息清單
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
        // 訊息清單
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-01.java -->

## 訊息類型

Kotlin DSL 與 Java builder API 支援以下類型的訊息，每一種都對應到對話中的特定角色：

- **系統訊息 (System message)**：向 LLM 提供上下文、指令和約束，定義其行為。
- **使用者訊息 (User message)**：代表使用者輸入。
- **助理訊息 (Assistant message)**：代表用於少樣本學習或接續對話的 LLM 回應。
- **工具訊息 (Tool message)**：代表工具呼叫及其結果。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // 新增系統訊息以設定上下文
        system("You are a helpful assistant with access to tools.")
        // 新增使用者訊息
        user("What is 5 + 3 ?")
        // 新增助理訊息
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
        // 新增系統訊息以設定上下文
        .system("You are a helpful assistant with access to tools.")
        // 新增使用者訊息
        .user("What is 5 + 3 ?")
        // 新增助理訊息
        .assistant("The result is 8.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-02.java -->

### 系統訊息

系統訊息定義了 LLM 的行為並為整個對話設定上下文。
它可以指定模型的角色、語氣，提供回應的準則與約束，以及提供回應範例。

要建立系統訊息，請將字串作為引數提供給 Kotlin 的 `system()` 函式或 Java 的方法：

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

### 使用者訊息

使用者訊息代表來自使用者的輸入。
要建立使用者訊息，請將字串作為引數提供給 Kotlin 的 `user()` 函式或 Java 的方法：

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

大多數使用者訊息包含純文字，但也可以包含多模態內容，例如圖片、音訊、影片和文件。
有關詳細資訊與範例，請參閱 [多模態內容](multimodal-content.md)。

### 助理訊息

助理訊息代表 LLM 的回應，可用於未來類似互動的少樣本學習、接續對話，或示範預期的輸出結構。

要建立助理訊息，請將字串作為引數提供給 Kotlin 的 `assistant()` 函式或 Java 的方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("article_review") {
        system("Evaluate the article.")

        // 範例 1
        user("The article is clear and easy to understand.")
        assistant("positive")

        // 範例 2
        user("The article is hard to read but it's clear and useful.")
        assistant("neutral")

        // 範例 3
        user("The article is confusing and misleading.")
        assistant("negative")

        // 要分類的新輸入
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

        // 範例 1
        .user("The article is clear and easy to understand.")
        .assistant("positive")

        // 範例 2
        .user("The article is hard to read but it's clear and useful.")
        .assistant("neutral")

        // 範例 3
        .user("The article is confusing and misleading.")
        .assistant("negative")

        // 要分類的新輸入
        .user("The article is interesting and helpful.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-05.java -->

### 工具訊息

工具訊息代表工具呼叫及其結果，可用於預先填入工具呼叫的歷程記錄。

!!! tip
    LLM 在執行期間產生工具呼叫。
    預先填入這些內容對於少樣本學習或示範工具的預期使用方式很有幫助。

要建立工具訊息，請在 Kotlin 中呼叫 `toolCall()` 與 `toolResult()` 函式，或在 Java 中呼叫 `toolCall()` 與 `toolResult()` 方法：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("calculator_example") {
        system("You are a helpful assistant with access to tools.")
        user("What is 5 + 3?")
        // 工具呼叫
        toolCall(
            id = "calculator_tool_id",
            tool = "calculator",
            args = """{"operation": "add", "a": 5, "b": 3}"""
        )
        // 工具結果
        toolResult(
            id = "calculator_tool_id",
            tool = "calculator",
            output = "8"
        )

        // 基於工具結果的 LLM 回應
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
        // 工具呼叫
        .toolCall("calculator_tool_id", "calculator", "{\"operation\": \"add\", \"a\": 5, \"b\": 3}")
        // 工具結果
        .toolResult("calculator_tool_id", "calculator", "8")
        // 基於工具結果的 LLM 回應    
        .assistant("The result of 5 + 3 is 8.")
        .user("What is 4 + 5?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-06.java -->

## 文字訊息建置器

!!! warning
    文字訊息建置器僅提供 Kotlin 版本。

在組建 `system()`、`user()` 或 `assistant()` 訊息時，您可以使用輔助的 [文字建置函式](api:prompt-model::ai.koog.prompt.text.TextContentBuilder) 進行豐富文字格式化。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("text_example") {
        user {
            +"Review the following code snippet:"
            +"fun greet(name: String) = println(\"Hello, \$name!\")"

            // 段落換行
            br()
            text("Please include in your explanation:")

            // 縮排內容
            padding("  ") {
                +"1. What the function does."
                +"2. How string interpolation works."
            }
        }
    }
    ```
    <!--- KNIT example-creating-prompts-07.kt -->

您也可以使用 [Markdown](api:prompt-markdown::ai.koog.prompt.markdown.markdown) 與 [XML](api:prompt-xml::ai.koog.prompt.xml.xml) 建置器來以對應的格式新增內容。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.markdown.markdown
    import ai.koog.prompt.xml.xml
    -->

    ```kotlin
    val prompt = prompt("markdown_xml_example") {
        // Markdown 格式的使用者訊息
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
        // XML 格式的助理訊息
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
    您可以將文字建置函式與 XML 和 Markdown 建置器混合使用。

## 提示參數

提示可以透過配置控制 LLM 行為的參數進行自訂。

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
    // 先建立參數
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
        
    // 將參數套用至組建後的提示
    prompt = prompt.withParams(params);
    ```
    <!--- KNIT example-creating-prompts-java-07.java -->

支援以下參數：

- `temperature`：控制模型回應的隨機性。
- `toolChoice`：控制模型的工具呼叫行為。
- `numberOfChoices`：請求多個替代回應。
- `schema`：定義模型回應格式的結構 (架構)。
- `maxTokens`：限制回應中的 token 數量。
- `speculation`：提供關於預期回應格式的提示（僅特定模型支援）。

若要了解更多，請參閱 [LLM 參數](../../llm-parameters.md)。

## 擴充現有提示

您可以透過呼叫 Kotlin 中的 `prompt()` 函式或 Java 中的 `Prompt.builder()` 並將現有提示作為引數傳入來擴充現有提示：

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

這會建立一個包含 `basePrompt` 中所有訊息以及新使用者訊息的新提示。

## 後續步驟

- 了解如何處理 [多模態內容](multimodal-content.md)。
- 如果您使用單一 LLM 提供者，請使用 [LLM 用戶端](../llm-clients.md) 執行提示。
- 如果您使用多個 LLM 提供者，請使用 [提示執行器](../prompt-executors.md) 執行提示。
- 了解如何透過 [快取控制](cache-control.md) 使用 LLM 快取。