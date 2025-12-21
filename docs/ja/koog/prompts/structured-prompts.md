# 構造化プロンプト

Koogは型安全なKotlin DSLを使用し、メッセージの型、順序、内容を制御できる構造化プロンプトを作成します。

構造化プロンプトを使用すると、複数のメッセージを含む会話履歴を事前に構成し、マルチモーダルコンテンツ、例、ツール呼び出し、およびその結果を提供できます。

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
<!--- KNIT example-structured-prompts-01.kt -->

## メッセージの種類

Kotlin DSLは、会話における特定の役割に対応する以下のメッセージタイプをサポートしています。

-   **システムメッセージ**: LLMにコンテキスト、指示、制約を提供し、その挙動を定義します。
-   **ユーザーメッセージ**: テキスト、画像、音声、動画、またはドキュメントを含むことができるユーザー入力を表します。
-   **アシスタントメッセージ**: フューショット学習や会話の継続に使用されるLLMの応答を表します。
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
<!--- KNIT example-structured-prompts-02.kt -->

### システムメッセージ

システムメッセージは、LLMの挙動を定義し、会話全体のコンテキストを設定します。モデルの役割、トーン、応答に関するガイドラインと制約、および応答例を指定できます。

システムメッセージを作成するには、`system()`関数に引数として文字列を渡します。

<!--- INCLUDE
import ai.koog.prompt.dsl.prompt
-->
```kotlin
val prompt = prompt("assistant") {
    system("You are a helpful assistant that explains technical concepts.")
}
```
<!--- KNIT example-structured-prompts-03.kt -->

### ユーザーメッセージ

ユーザーメッセージは、ユーザーからの入力を表します。プレーンテキストまたはマルチモーダルコンテンツ（画像、音声、動画、ドキュメントなど）を含めることができます。

ユーザーメッセージを作成するには、`user()`関数に引数として文字列を渡します。

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

マルチモーダルコンテンツの詳細については、「[マルチモーダル入力](#multimodal-inputs)」を参照してください。

### アシスタントメッセージ

アシスタントメッセージはLLMの応答を表します。これは、将来の同様のインタラクションでのフューショット学習、会話の継続、または期待される出力構造のデモンストレーションに使用できます。

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
<!--- KNIT example-structured-prompts-05.kt -->

### ツールメッセージ

ツールメッセージは、ツール呼び出しとその結果を表し、ツール呼び出しの履歴を事前に埋めるために使用できます。

!!! tip
    LLMは実行中にツール呼び出しを生成します。それらを事前に埋めることは、フューショット学習や、ツールがどのように使用されることを期待されているかを示すのに役立ちます。

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
}
```
<!--- KNIT example-structured-prompts-06.kt -->

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
<!--- KNIT example-structured-prompts-07.kt -->

[Markdown](https://api.koog.ai/prompt/prompt-markdown/ai.koog.prompt.markdown/markdown.html)および[XML](https://api.koog.ai/prompt/prompt-xml/ai.koog.prompt.xml/xml.html)ビルダーを使用して、対応するフォーマットでコンテンツを追加することもできます。

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
    テキスト構築関数をXMLおよびMarkdownビルダーと混在させることができます。

## プロンプトパラメータ

プロンプトは、LLMの挙動を制御するパラメータを設定することでカスタマイズできます。

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

以下のパラメータがサポートされています。

-   `temperature`: ランダム性を制御します（0.0 = 集中的/決定的、1.0以上 = 創造的/多様）
-   `toolChoice`: ツール使用戦略（`Auto`、`Required`、`Named(toolName)`）
-   `numberOfChoices`: 複数の独立した応答を要求します
-   `schema`: 構造化された出力フォーマットを定義します（構造化出力用）

詳細については、「[LLMパラメータ](llm-parameters.md)」を参照してください。

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
<!--- KNIT example-structured-prompts-10.kt -->

これにより、`basePrompt`からのすべてのメッセージと新しいユーザーメッセージを含む新しいプロンプトが作成されます。

## 次のステップ

-   [マルチモーダルコンテンツ](multimodal-inputs.md)の扱い方を学びます。
-   単一のLLMプロバイダを扱う場合は、[LLMクライアント](llm-clients.md)でプロンプトを実行します。
-   複数のLLMプロバイダを扱う場合は、[プロンプトエクゼキュータ](prompt-executors.md)でプロンプトを実行します。