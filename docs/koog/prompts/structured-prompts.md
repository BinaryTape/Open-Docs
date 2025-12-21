# 结构化提示

Koog 使用类型安全的 Kotlin DSL 来创建结构化提示，以控制消息类型、它们的顺序和内容。

结构化提示允许您预配置包含多条消息的会话历史，并提供多模态内容、示例、工具调用及其结果。

## 基本结构

`prompt()` 函数创建一个具有唯一 ID 和消息列表的 Prompt 对象：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 消息列表
}
```
<!--- KNIT example-structured-prompts-01.kt -->

## 消息类型

Kotlin DSL 支持以下消息类型，每种类型都对应会话中的特定角色：

- **系统消息**：为 LLM 提供上下文、指令和约束，定义其行为。
- **用户消息**：表示用户输入，可以包含文本、图像、音频、视频或文档。
- **助手消息**：表示 LLM 响应，用于少样本学习或继续会话。
- **工具消息**：表示工具调用及其结果。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // 添加系统消息以设置上下文
    system("You are a helpful assistant with access to tools.")
    // 添加用户消息
    user("What is 5 + 3 ?")
    // 添加助手消息
    assistant("The result is 8.")
}
```
<!--- KNIT example-structured-prompts-02.kt -->

### 系统消息

系统消息定义了 LLM 的行为并设置了整个会话的上下文。它可以指定模型的角色、语气，提供响应的指导方针和约束，以及提供响应示例。

要创建系统消息，请将一个字符串作为实参提供给 `system()` 函数：

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-structured-prompts-03.kt -->

### 用户消息

用户消息表示来自用户的输入。它可以包含纯文本或多模态内容（例如图像、音频、视频和文档）。

要创建用户消息，请将一个字符串作为实参提供给 `user()` 函数：

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

关于多模态内容的详情，请参见 [多模态输入](#multimodal-inputs)。

### 助手消息

助手消息表示 LLM 响应，可用于未来类似交互中的少样本学习、继续会话或演示预期的输出结构。

要创建助手消息，请将一个字符串作为实参提供给 `assistant()` 函数：

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

    // 待分类的新输入
    user("The article is interesting and helpful.")
}
```
<!--- KNIT example-structured-prompts-05.kt -->

### 工具消息

工具消息表示工具调用及其结果，可用于预填充工具调用历史。

!!! tip
    LLM 在执行期间生成工具调用。预填充它们有助于少样本学习，或演示工具的预期使用方式。

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
}
```
<!--- KNIT example-structured-prompts-06.kt -->

## 文本消息构建器

在构建 `system()`、`user()` 或 `assistant()` 消息时，您可以使用辅助 [文本构建函数](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html) 进行富文本格式化。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("text_example") {
    user {
        +"Review the following code snippet:"
        +"fun greet(name: String) = println(\"Hello, \$name!\")"

        // 段落分隔符
        br()
        text("Please include in your explanation:")

        // 缩进内容
        padding("  ") {
            +"1. What the function does."
            +"2. How string interpolation works."
        }
    }
}
```
<!--- KNIT example-structured-prompts-07.kt -->

您还可以使用 [Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html) 和 [XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html) 构建器以相应的格式添加内容。

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
            h2("Evaluate the article using the following criteria:")
            bulleted {
                item { +"Clarity and readability" }
                item { +"Accuracy of information" }
                item { +"Usefulness to the reader" }
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
<!--- KNIT example-structured-prompts-08.kt -->

!!! tip
    您可以将文本构建函数与 XML 和 Markdown 构建器混合使用。

## 提示参数

提示可以通过配置控制 LLM 行为的参数进行自定义。

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

支持以下参数：

- `temperature`：控制随机性（0.0 = 专注/确定性，1.0+ = 创意/多样性）
- `toolChoice`：工具使用策略（`Auto`、`Required`、`Named(toolName)`）
- `numberOfChoices`：请求多个独立响应
- `schema`：定义结构化输出格式（用于结构化输出）

关于更多信息，请参见 [LLM 参数](llm-parameters.md)。

## 扩展现有提示

您可以通过将现有提示作为实参调用 `prompt()` 函数来扩展现有提示：

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

这将创建一个新提示，其中包含来自 `basePrompt` 的所有消息以及新的用户消息。

## 下一步

- 了解如何使用 [多模态内容](multimodal-inputs.md)。
- 如果您使用单个 LLM 提供商，请使用 [LLM 客户端](llm-clients.md) 运行提示。
- 如果您使用多个 LLM 提供商，请使用 [提示执行器](prompt-executors.md) 运行提示。