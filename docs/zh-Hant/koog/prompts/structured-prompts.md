# 結構化提示

Koog 使用類型安全的 Kotlin DSL 來建立結構化提示，以控制訊息類型、順序和內容。

結構化提示讓您可以預先設定包含多個訊息的對話歷史，提供多模態內容、範例、工具呼叫及其結果。

## 基本結構

`prompt()` 函數會建立一個 `Prompt` 物件，其中包含一個唯一的 ID 和一個訊息列表：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 訊息列表
}
```
<!--- KNIT example-structured-prompts-01.kt -->

## 訊息類型

Kotlin DSL 支援以下訊息類型，每種類型都對應著對話中的特定角色：

- **系統訊息 (System message)**：為 LLM 提供上下文、指令和限制，定義其行為。
- **使用者訊息 (User message)**：代表使用者輸入，可以包含文字、圖片、音訊、視訊或文件。
- **助理訊息 (Assistant message)**：代表 LLM 回應，用於少量樣本學習或繼續對話。
- **工具訊息 (Tool message)**：代表工具呼叫及其結果。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 加入系統訊息以設定上下文
    system("You are a helpful assistant with access to tools.")
    // 加入使用者訊息
    user("What is 5 + 3 ?")
    // 加入助理訊息
    assistant("The result is 8.")
}
```
<!--- KNIT example-structured-prompts-02.kt -->

### 系統訊息

系統訊息定義 LLM 的行為並設定整個對話的上下文。它可以指定模型的角色、語氣，提供回應的準則和限制，並提供回應範例。

要建立系統訊息，請將一個字串作為引數提供給 `system()` 函數：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-structured-prompts-03.kt -->

### 使用者訊息

使用者訊息代表來自使用者的輸入。它可以包含純文字或多模態內容（例如圖片、音訊、視訊和文件）。

要建立使用者訊息，請將一個字串作為引數提供給 `user()` 函數：

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

有關多模態內容的詳細資訊，請參閱 [多模態輸入 (Multimodal inputs)](#multimodal-inputs)。

### 助理訊息

助理訊息代表 LLM 回應，可用於未來類似互動中的少量樣本學習、繼續對話，或展示預期的輸出結構。

要建立助理訊息，請將一個字串作為引數提供給 `assistant()` 函數：

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

    // 待分類的新輸入
    user("The article is interesting and helpful.")
}
```
<!--- KNIT example-structured-prompts-05.kt -->

### 工具訊息

工具訊息代表工具呼叫及其結果，可用於預先填入工具呼叫歷史。

!!! tip
    LLM 在執行期間生成工具呼叫。預先填入它們有助於少量樣本學習或演示工具預期的使用方式。

要建立工具訊息，請呼叫 `tool()` 函數：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("calculator_example") {
    system("You are a helpful assistant with access to tools.")
    user("What is 5 + 3?")
    tool {
        // 工具呼叫
        call(
            id = "calculator_tool_id",
            tool = "calculator",
            content = """{"operation": "add", "a": 5, "b": 3}"""
        )

        // 工具結果
        result(
            id = "calculator_tool_id",
            tool = "calculator",
            content = "8"
        )
    }

    // 基於工具結果的 LLM 回應
    assistant("The result of 5 + 3 is 8.")
}
```
<!--- KNIT example-structured-prompts-06.kt -->

## 文字訊息建構器

在建立 `system()`、`user()` 或 `assistant()` 訊息時，您可以使用輔助 [文字建構函數](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html) 來進行豐富文字格式設定。

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
<!--- KNIT example-structured-prompts-07.kt -->

您還可以使用 [Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 和 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 建構器以對應的格式加入內容。

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
<!--- KNIT example-structured-prompts-08.kt -->

!!! tip
    您可以將文字建構函數與 XML 和 Markdown 建構器混合使用。

## 提示參數

提示可以透過配置控制 LLM 行為的參數來進行客製化。

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

支援以下參數：

- `temperature`：控制隨機性（0.0 = 集中/確定性，1.0+ = 創意/多樣性）
- `toolChoice`：工具使用策略 (`Auto`、`Required`、`Named(toolName)`)
- `numberOfChoices`：請求多個獨立回應
- `schema`：定義結構化輸出格式（用於結構化輸出）

更多資訊，請參閱 [LLM 參數 (LLM parameters)](llm-parameters.md)。

## 擴展現有提示

您可以透過呼叫 `prompt()` 函數並將現有提示作為引數來擴展它：

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

這會建立一個新提示，其中包含來自 `basePrompt` 的所有訊息以及新的使用者訊息。

## 後續步驟

- 了解如何使用 [多模態內容 (multimodal content)](multimodal-inputs.md)。
- 如果您使用單一 LLM 提供者，請使用 [LLM 客戶端 (LLM clients)](llm-clients.md) 執行提示。
- 如果您使用多個 LLM 提供者，請使用 [提示執行器 (prompt executors)](prompt-executors.md) 執行提示。