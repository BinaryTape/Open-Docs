# 创建 Prompt

Koog 使用类型安全的 Kotlin DSL 来创建 Prompt，并可控制消息类型、它们的顺序和内容。

这些 Prompt 允许你预配置包含多条消息的对话历史，提供多模态内容、示例、工具调用及其结果。

## 基本结构

`prompt()` 函数会创建一个带有唯一 ID 和消息列表的 Prompt 对象：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 消息列表
}
```
<!--- KNIT example-creating-prompts-01.kt -->

## 消息类型

Kotlin DSL 支持以下消息类型，每种类型都对应对话中的一个特定角色：

- **System message**：为 LLM 提供上下文、指令和约束，定义其行为。
- **User message**：表示用户输入。
- **Assistant message**：表示 LLM 响应，用于小样本学习或继续对话。
- **Tool message**：表示工具调用及其结果。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 添加一条系统消息以设置上下文
    system("You are a helpful assistant with access to tools.")
    // 添加一条用户消息
    user("What is 5 + 3 ?")
    // 添加一条助手消息
    assistant("The result is 8.")
}
```
<!--- KNIT example-creating-prompts-02.kt -->

### System message

系统消息定义 LLM 行为，并为整个对话设置上下文。它可以指定模型的角色、语气，提供关于响应的指导方针和约束，并提供响应示例。

要创建系统消息，请将一个字符串作为实参传递给 `system()` 函数：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-creating-prompts-03.kt -->

### User messages

用户消息表示来自用户的输入。要创建用户消息，请将一个字符串作为实参传递给 `user()` 函数：

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

大多数用户消息包含纯文本，但它们也可以包含多模态内容，例如图像、音频、视频和文档。关于详细信息和示例，请参见 [多模态内容](multimodal-content.md)。

### Assistant messages

助手消息表示 LLM 响应，可用于未来类似交互中的小样本学习、继续对话或演示预期的输出结构。

要创建助手消息，请将一个字符串作为实参传递给 `assistant()` 函数：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("article_review") {
    system("Evaluate the article.")

    // 示例 1
    user("The article is clear and easy to understand.")
    assistant("positive")

    // 示例 2
    user("The article is hard to read but it's clear and useful.")
    assistant("neutral")

    // 示例 3
    user("The article is confusing and misleading.")
    assistant("negative")

    // 要分类的新输入
    user("The article is interesting and helpful.")
}
```
<!--- KNIT example-creating-prompts-05.kt -->

### Tool messages

工具消息表示工具调用及其结果，可用于预填充工具调用的历史记录。

!!! tip
    LLM 在执行期间生成工具调用。预填充它们有助于小样本学习或演示工具的预期使用方式。

要创建工具消息，请调用 `tool()` 函数：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("calculator_example") {
    system("You are a helpful assistant with access to tools.")
    user("What is 5 + 3?")
    tool {
        // 工具调用
        call(
            id = "calculator_tool_id",
            tool = "calculator",
            content = """{"operation": "add", "a": 5, "b": 3}"""
        )

        // 工具结果
        result(
            id = "calculator_tool_id",
            tool = "calculator",
            content = "8"
        )
    }

    // 基于工具结果的 LLM 响应
    assistant("The result of 5 + 3 is 8.")
    user("What is 4 + 5?")
}
```
<!--- KNIT example-creating-prompts-06.kt -->

## 文本消息构建器

构建 `system()`、`user()` 或 `assistant()` 消息时，你可以使用辅助的 [文本构建函数](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html) 进行富文本格式化。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("text_example") {
    user {
        +"审阅以下代码片段："
        +"fun greet(name: String) = println(\"Hello, \$name!\")"

        // 段落中断
        br()
        text("请在你的解释中包含：")

        // 缩进内容
        padding("  ") {
            +"1. 函数的作用。"
            +"2. 字符串内插的工作原理。"
        }
    }
}
```
<!--- KNIT example-creating-prompts-07.kt -->

你还可以使用 [Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 和 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 构建器以相应的格式添加内容。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.markdown.markdown
import ai.koog.prompt.xml.xml
-->
```kotlin
val prompt = prompt("markdown_xml_example") {
    // Markdown 格式的用户消息
    user {
        markdown {
            h2("使用以下标准评估文章：")
            bulleted {
                item { +"清晰度和可读性" }
                item { +"信息的准确性" }
                item { +"对读者的有用性" }
            }
        }
    }
    // XML 格式的助手消息
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
    你可以将文本构建函数与 XML 和 Markdown 构建器混合使用。

## Prompt 形参

Prompt 可以通过配置控制 LLM 行为的形参来定制。

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

支持以下形参：

- `temperature`：控制模型响应中的随机性。
- `toolChoice`：控制模型的工具调用行为。
- `numberOfChoices`：请求多个替代响应。
- `schema`：定义模型的响应格式结构。
- `maxTokens`：限制响应中的 token 数量。
- `speculation`：提供关于预期响应格式的提示（仅由特定模型支持）。

关于更多信息，请参见 [LLM 形参](../../llm-parameters.md)。

## 扩展现有 Prompt

你可以通过将现有 Prompt 作为实参调用 `prompt()` 函数来扩展它：

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

这会创建一个新 Prompt，其中包含 `basePrompt` 中的所有消息以及新的用户消息。

## 后续步骤

- 了解如何使用 [多模态内容](multimodal-content.md)。
- 如果你使用单个 LLM 提供商，请使用 [LLM 客户端](../llm-clients.md) 运行 Prompt。
- 如果你使用多个 LLM 提供商，请使用 [Prompt 执行器](../prompt-executors.md) 运行 Prompt。