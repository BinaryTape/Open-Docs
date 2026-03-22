# 创建提示词

Koog 提供了一种结构化的方式来创建提示词，并可控制消息类型、其顺序及内容：

* 对于 **Kotlin** 用户，通过类型安全的 Kotlin DSL。
* 对于 **Java** 用户，通过流畅的构建器 API。

## 基本结构

Kotlin 中的 `prompt()` 函数或 Java 中的 `Prompt.builder()` 会创建一个包含唯一 ID 和消息列表的 Prompt 对象：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // 消息列表
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
        // 消息列表
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-01.java -->

## 消息类型

Kotlin DSL 和 Java 构建器 API 支持以下类型的消息，每种消息对应对话中的一个特定角色：

- **系统消息 (System message)**：为 LLM 提供上下文、指令和约束，定义其行为。
- **用户消息 (User message)**：代表用户输入。
- **助手消息 (Assistant message)**：代表用于少样本学习或继续对话的 LLM 响应。
- **工具消息 (Tool message)**：代表工具调用及其结果。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("unique_prompt_id")
        // 添加一条系统消息以设置上下文
        .system("You are a helpful assistant with access to tools.")
        // 添加一条用户消息
        .user("What is 5 + 3 ?")
        // 添加一条助手消息
        .assistant("The result is 8.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-02.java -->

### 系统消息

系统消息定义了 LLM 的行为，并为整个对话设置上下文。
它可以指定模型的角色、语气，提供响应指南和约束，并提供响应示例。

要创建系统消息，请将字符串作为实参提供给 `system()` Kotlin 函数或 Java 方法：

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

### 用户消息

用户消息代表来自用户的输入。
要创建用户消息，请将字符串作为实参提供给 `user()` Kotlin 函数或 Java 方法：

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

大多数用户消息包含纯文本，但它们也可以包含多模态内容，例如图像、音频、视频和文档。
详情和示例请参阅 [多模态内容](multimodal-content.md)。

### 助手消息

助手消息代表 LLM 响应，可用于未来类似交互中的少样本学习、继续对话或演示预期的输出结构。

要创建助手消息，请将字符串作为实参提供给 `assistant()` Kotlin 函数或 Java 方法：

=== "Kotlin"

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

        // 示例 1
        .user("The article is clear and easy to understand.")
        .assistant("positive")

        // 示例 2
        .user("The article is hard to read but it's clear and useful.")
        .assistant("neutral")

        // 示例 3
        .user("The article is confusing and misleading.")
        .assistant("negative")

        // 待分类的新输入
        .user("The article is interesting and helpful.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-05.java -->

### 工具消息

工具消息代表工具调用及其结果，可用于预填充工具调用的历史记录。

!!! tip "提示"
    LLM 在执行过程中生成工具调用。
    预填充它们有助于进行少样本学习，或演示工具的预期用法。

要创建工具消息，请调用 Kotlin 中的 `tool()` 函数或 Java 中的 `toolCall()` 和 `toolResult()` 方法：

=== "Kotlin"

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
        // 工具调用
        .toolCall("calculator_tool_id", "calculator", "{\"operation\": \"add\", \"a\": 5, \"b\": 3}")
        // 工具结果
        .toolResult("calculator_tool_id", "calculator", "8")
        // 基于工具结果的 LLM 响应    
        .assistant("The result of 5 + 3 is 8.")
        .user("What is 4 + 5?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-06.java -->

## 文本消息构建器

!!! warning "警告"
    文本消息构建器仅在 Kotlin 中可用。

在构建 `system()`、`user()` 或 `assistant()` 消息时，可以使用辅助的 [文本构建函数](api:prompt-model::ai.koog.prompt.text.TextContentBuilder) 进行富文本格式化。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("text_example") {
        user {
            +"Review the following code snippet:"
            +"fun greet(name: String) = println(\"Hello, \$name!\")"

            // 段落换行
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
    <!--- KNIT example-creating-prompts-07.kt -->

您还可以使用 [Markdown](api:prompt-markdown::ai.koog.prompt.markdown.markdown) 和 [XML](api:prompt-xml::ai.koog.prompt.xml.xml) 构建器以相应的格式添加内容。

=== "Kotlin"

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
    <!--- KNIT example-creating-prompts-08.kt -->

!!! tip "提示"
    您可以将文本构建函数与 XML 和 Markdown 构建器混合使用。

## Prompt 参数

可以通过配置控制 LLM 行为的参数来定制提示词。

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
    // 首先创建参数
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
        
    // 将参数应用于构建好的提示词
    prompt = prompt.withParams(params);
    ```
    <!--- KNIT example-creating-prompts-java-07.java -->

支持以下参数：

- `temperature`：控制模型响应的随机性。
- `toolChoice`：控制模型的工具调用行为。
- `numberOfChoices`：请求多个备选响应。
- `schema`：定义模型响应格式的结构。
- `maxTokens`：限制响应中的 token 数量。
- `speculation`：提供有关预期响应格式的提示（仅特定模型支持）。

要了解更多信息，请参阅 [LLM 参数](../../llm-parameters.md)。

## 扩展现有提示词

可以通过调用 Kotlin 中的 `prompt()` 函数或 Java 中的 `Prompt.builder()` 并将现有提示词作为实参传入来扩展它：

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

这将创建一个新提示词，其中包含来自 `basePrompt` 的所有消息以及新的用户消息。

## 后续步骤

- 了解如何处理 [多模态内容](multimodal-content.md)。
- 如果您只与单个 LLM 提供商合作，请使用 [LLM 客户端](../llm-clients.md) 运行提示词。
- 如果您与多个 LLM 提供商合作，请使用 [提示词执行器](../prompt-executors.md) 运行提示词。