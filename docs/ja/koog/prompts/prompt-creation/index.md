# プロンプトの作成

Koogは型安全なKotlin DSLを使用して、メッセージの種類、順序、内容を制御できるプロンプトを作成します。

これらのプロンプトを使用すると、複数のメッセージで会話履歴を事前設定したり、マルチモーダルコンテンツ、例、ツール呼び出し、およびその結果を提供したりできます。

## 基本構造

`prompt()`関数は、一意のIDとメッセージのリストを持つ`Prompt`オブジェクトを作成します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("unique_prompt_id") {
    // List of messages
}
```
<!--- KNIT example-creating-prompts-01.kt -->

## メッセージの種類

Kotlin DSLは以下の種類のメッセージをサポートしており、それぞれが会話における特定の役割に対応しています。

-   **システムメッセージ**: LLMにコンテキスト、指示、制約を提供し、その動作を定義します。
-   **ユーザーメッセージ**: ユーザー入力を表します。
-   **アシスタントメッセージ**: LLMの応答を表し、少数のサンプルからの学習（few-shot learning）や会話の継続に使用されます。
-   **ツールメッセージ**: ツール呼び出しとその結果を表します。

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
<!--- KNIT example-creating-prompts-02.kt -->

### システムメッセージ

システムメッセージは、LLMの動作を定義し、会話全体のコンテキストを設定します。モデルの役割、トーンを指定したり、応答に関するガイドラインと制約を提供したり、応答例を提供したりできます。

システムメッセージを作成するには、`system()`関数に引数として文字列を渡します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-creating-prompts-03.kt -->

### ユーザーメッセージ

ユーザーメッセージは、ユーザーからの入力を表します。ユーザーメッセージを作成するには、`user()`関数に引数として文字列を渡します。

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

ほとんどのユーザーメッセージにはプレーンテキストが含まれますが、画像、音声、動画、ドキュメントなどのマルチモーダルコンテンツを含めることもできます。詳細と例については、[マルチモーダルコンテンツ](multimodal-content.md)を参照してください。

### アシスタントメッセージ

アシスタントメッセージは、LLMの応答を表します。これは、将来の同様のインタラクションでの少数のサンプルからの学習（few-shot learning）、会話の継続、または期待される出力構造を示すために使用できます。

アシスタントメッセージを作成するには、`assistant()`関数に引数として文字列を渡します。

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
<!--- KNIT example-creating-prompts-05.kt -->

### ツールメッセージ

ツールメッセージは、ツール呼び出しとその結果を表し、ツール呼び出しの履歴を事前に入力するために使用できます。

!!! tip
    LLMは実行中にツール呼び出しを生成します。それらを事前に入力することは、少数のサンプルからの学習（few-shot learning）や、ツールがどのように使用されることを期待されているかを示すのに役立ちます。

ツールメッセージを作成するには、`tool()`関数を呼び出します。

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
    user("What is 4 + 5?")
}
```
<!--- KNIT example-creating-prompts-06.kt -->

## テキストメッセージビルダー

`system()`、`user()`、または`assistant()`メッセージを構築する際、リッチテキストフォーマットのためにヘルパー[テキスト構築関数](https://api.koog.ai/prompt/prompt-model/ai.koog.prompt.text/-text-content-builder/index.html)を使用できます。

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
<!--- KNIT example-creating-prompts-07.kt -->

また、[Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html)と[XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html)ビルダーを使用して、対応する形式でコンテンツを追加することもできます。

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
<!--- KNIT example-creating-prompts-08.kt -->

!!! tip
    テキスト構築関数とXMLおよびMarkdownビルダーを混在させることができます。

## プロンプトパラメーター

プロンプトは、LLMの動作を制御するパラメーターを設定することでカスタマイズできます。

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

以下のパラメーターがサポートされています。

-   `temperature`: モデルの応答におけるランダム性を制御します。
-   `toolChoice`: モデルのツール呼び出しの動作を制御します。
-   `numberOfChoices`: 複数の代替応答を要求します。
-   `schema`: モデルの応答形式の構造を定義します。
-   `maxTokens`: 応答内のトークン数を制限します。
-   `speculation`: 期待される応答形式に関するヒントを提供します（特定のモデルのみがサポート）。

詳細については、[LLMパラメーター](../../llm-parameters.md)を参照してください。

## 既存のプロンプトの拡張

既存のプロンプトを引数として`prompt()`関数を呼び出すことで、既存のプロンプトを拡張できます。

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

これにより、`basePrompt`からのすべてのメッセージと新しいユーザーメッセージを含む新しいプロンプトが作成されます。

## 次のステップ

-   [マルチモーダルコンテンツ](multimodal-content.md)の操作方法を学びます。
-   単一のLLMプロバイダーと連携する場合は、[LLMクライアント](../llm-clients.md)を使用してプロンプトを実行します。
-   複数のLLMプロバイダーと連携する場合は、[プロンプトエグゼキューター](../prompt-executors.md)を使用してプロンプトを実行します。