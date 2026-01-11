# 創建提示

Koog 使用型別安全的 Kotlin DSL 來創建提示，可控制訊息類型、順序和內容。

這些提示可讓您預先配置包含多個訊息的對話歷史，並提供多模態內容、範例、工具呼叫及其結果。

## 基本結構

`prompt()` 函式會創建一個具有唯一 ID 和訊息列表的 Prompt 物件：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 訊息列表
}
```
<!--- KNIT example-creating-prompts-01.kt -->

## 訊息類型

Kotlin DSL 支援以下訊息類型，每種類型都對應對話中的特定角色：

- **系統訊息**：為 LLM 提供上下文、指令和約束，定義其行為。
- **使用者訊息**：代表使用者輸入。
- **助理訊息**：代表用於少樣本學習或繼續對話的 LLM 回應。
- **工具訊息**：代表工具呼叫及其結果。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 新增系統訊息以設定上下文
    system("您是一位可存取工具的樂於助人助理。")
    // 新增使用者訊息
    user("5 + 3 是多少？")
    // 新增助理訊息
    assistant("結果是 8。")
}
```
<!--- KNIT example-creating-prompts-02.kt -->

### 系統訊息

系統訊息定義 LLM 行為並設定整個對話的上下文。它可以指定模型的角色、語氣，提供回應的指導方針和約束，並提供回應範例。

若要創建系統訊息，請將字串作為引數傳遞給 `system()` 函式：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("您是一位可解釋技術概念的樂於助人助理。")
}
```
<!--- KNIT example-creating-prompts-03.kt -->

### 使用者訊息

使用者訊息代表來自使用者的輸入。
若要創建使用者訊息，請將字串作為引數傳遞給 `user()` 函式：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("question") {
    system("您是一位樂於助人助理。")
    user("Koog 是什麼？")
}
```
<!--- KNIT example-creating-prompts-04.kt -->

大多數使用者訊息包含純文字，但它們也可以包含多模態內容，例如圖片、音訊、視訊和文件。
有關詳細資訊和範例，請參閱 [多模態內容](multimodal-content.md)。

### 助理訊息

助理訊息代表 LLM 回應，可用於未來類似互動中的少樣本學習、繼續對話，或示範預期的輸出結構。

若要創建助理訊息，請將字串作為引數傳遞給 `assistant()` 函式：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("article_review") {
    system("評估這篇文章。")

    // 範例 1
    user("這篇文章清晰易懂。")
    assistant("正面")

    // 範例 2
    user("這篇文章難以閱讀，但清晰且有用。")
    assistant("中性")

    // 範例 3
    user("這篇文章令人困惑且具誤導性。")
    assistant("負面")

    // 要分類的新輸入
    user("這篇文章有趣且有幫助。")
}
```
<!--- KNIT example-creating-prompts-05.kt -->

### 工具訊息

工具訊息代表工具呼叫及其結果，可用於預先填入工具呼叫歷史。

!!! tip
    LLM 在執行期間生成工具呼叫。
    預先填入它們有助於少樣本學習或示範工具的預期使用方式。

若要創建工具訊息，請呼叫 `tool()` 函式：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("calculator_example") {
    system("您是一位可存取工具的樂於助人助理。")
    user("5 + 3 是多少？")
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
    assistant("5 + 3 的結果是 8。")
    user("4 + 5 是多少？")
}
```
<!--- KNIT example-creating-prompts-06.kt -->

## 文字訊息建構器

建立 `system()`、`user()` 或 `assistant()` 訊息時，您可以使用輔助 [文字建構函式](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html) 進行富文字格式設定。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("text_example") {
    user {
        +"檢閱以下程式碼片段："
        +"fun greet(name: String) = println(\"Hello, \$name!\")"

        // 段落換行
        br()
        text("請在您的解釋中包含：")

        // 縮排內容
        padding("  ") {
            +"1. 函式功能。"
            +"2. 字串內插的工作方式。"
        }
    }
}
```
<!--- KNIT example-creating-prompts-07.kt -->

您也可以使用 [Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 和 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 建構器以相應的格式新增內容。

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
            h2("使用以下標準評估文章：")
            bulleted {
                item { +"清晰度和可讀性" }
                item { +"資訊準確性" }
                item { +"對讀者的實用性" }
            }
        }
    }
    // XML 格式的助理訊息
    assistant {
        xml {
            xmlDeclaration()
            tag("review") {
                tag("clarity") { text("正面") }
                tag("accuracy") { text("中性") }
                tag("usefulness") { text("正面") }
            }
        }
    }
}
```
<!--- KNIT example-creating-prompts-08.kt -->

!!! tip
    您可以將文字建構函式與 XML 和 Markdown 建構器混合使用。

## 提示參數

提示可以透過配置控制 LLM 行為的參數來自訂。

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
    system("您是一位有創意的寫作助理。")
    user("寫一首關於冬天的歌。")
}
```
<!--- KNIT example-creating-prompts-09.kt -->

支援以下參數：

- `temperature`：控制模型回應的隨機性。
- `toolChoice`：控制模型的工具呼叫行為。
- `numberOfChoices`：請求多個替代回應。
- `schema`：定義模型回應格式的結構。
- `maxTokens`：限制回應中的 Token 數量。
- `speculation`：提供有關預期回應格式的提示（僅支援特定模型）。

有關詳細資訊，請參閱 [LLM 參數](../../llm-parameters.md)。

## 擴展現有提示

您可以透過將現有提示作為引數呼叫 `prompt()` 函式來擴展現有提示：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val basePrompt = prompt("base") {
    system("您是一位樂於助人助理。")
    user("哈囉！")
    assistant("嗨！我能為您提供什麼幫助？")
}

val extendedPrompt = prompt(basePrompt) {
    user("天氣怎麼樣？")
}
```
<!--- KNIT example-creating-prompts-10.kt -->

這會創建一個新提示，其中包含來自 `basePrompt` 的所有訊息和新的使用者訊息。

## 後續步驟

- 了解如何使用 [多模態內容](multimodal-content.md)。
- 如果您使用單一 LLM 供應商，請使用 [LLM 用戶端](../llm-clients.md) 執行提示。
- 如果您使用多個 LLM 供應商，請使用 [提示執行器](../prompt-executors.md) 執行提示。