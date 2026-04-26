# プロンプトの作成

Koog は、メッセージタイプ、その順序、および内容を制御しながらプロンプトを作成するための構造化された方法を提供します。

* **Kotlin** ユーザー向けには、型安全な Kotlin DSL を通じて提供されます。
* **Java** ユーザー向けには、流れるようなビルダー API (fluent builder API) を通じて提供されます。

## 基本構造

Kotlin の `prompt()` 関数または Java の `Prompt.builder()` は、一意の ID とメッセージのリストを持つ Prompt オブジェクトを作成します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // メッセージのリスト
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
        // メッセージのリスト
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-01.java -->

## メッセージタイプ

Kotlin DSL と Java ビルダー API は以下のメッセージタイプをサポートしており、それぞれが会話における特定の役割に対応しています。

- **システムメッセージ (System message)**: LLM に対してコンテキスト、指示、および制約を提供し、その振る舞いを定義します。
- **ユーザーメッセージ (User message)**: ユーザー入力を表します。
- **アシスタントメッセージ (Assistant message)**: フューショット学習（few-shot learning）や会話の継続に使用される LLM の応答を表します。
- **ツールメッセージ (Tool message)**: ツール呼び出しとその結果を表します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("unique_prompt_id") {
        // コンテキストを設定するためにシステムメッセージを追加する
        system("You are a helpful assistant with access to tools.")
        // ユーザーメッセージを追加する
        user("What is 5 + 3 ?")
        // アシスタントメッセージを追加する
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
        // コンテキストを設定するためにシステムメッセージを追加する
        .system("You are a helpful assistant with access to tools.")
        // ユーザーメッセージを追加する
        .user("What is 5 + 3 ?")
        // アシスタントメッセージを追加する
        .assistant("The result is 8.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-02.java -->

### システムメッセージ

システムメッセージは、LLM の振る舞いを定義し、会話全体のコンテキストを設定します。
モデルの役割、トーンの指定、応答に関するガイドラインや制約の提供、および応答例の提示が可能です。

システムメッセージを作成するには、`system()` Kotlin 関数または Java メソッドの引数として文字列を渡します。

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

### ユーザーメッセージ

ユーザーメッセージは、ユーザーからの入力を表します。
ユーザーメッセージを作成するには、`user()` Kotlin 関数または Java メソッドの引数として文字列を渡します。

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

ほとんどのユーザーメッセージはプレーンテキストを含みますが、画像、音声、ビデオ、ドキュメントなどのマルチモーダルコンテンツを含めることもできます。
詳細と例については、[マルチモーダルコンテンツ](multimodal-content.md)を参照してください。

### アシスタントメッセージ

アシスタントメッセージは LLM の応答を表します。これは、将来の同様のやり取りにおけるフューショット学習、会話の継続、または期待される出力構造を示すために使用できます。

アシスタントメッセージを作成するには、`assistant()` Kotlin 関数または Java メソッドの引数として文字列を渡します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("article_review") {
        system("Evaluate the article.")

        // 例 1
        user("The article is clear and easy to understand.")
        assistant("positive")

        // 例 2
        user("The article is hard to read but it's clear and useful.")
        assistant("neutral")

        // 例 3
        user("The article is confusing and misleading.")
        assistant("negative")

        // 分類する新しい入力
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

        // 例 1
        .user("The article is clear and easy to understand.")
        .assistant("positive")

        // 例 2
        .user("The article is hard to read but it's clear and useful.")
        .assistant("neutral")

        // 例 3
        .user("The article is confusing and misleading.")
        .assistant("negative")

        // 分類する新しい入力
        .user("The article is interesting and helpful.")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-05.java -->

### ツールメッセージ

ツールメッセージは、ツール呼び出しとその結果を表します。これは、ツール呼び出しの履歴を事前に埋めるために使用できます。

!!! tip
    LLM は実行中にツール呼び出しを生成します。
    これらを事前に埋めておくことは、フューショット学習や、ツールがどのように使用されるべきかを示すのに役立ちます。

ツールメッセージを作成するには、Kotlin では `tool()` 関数を呼び出し、Java では `toolCall()` および `toolResult()` メソッドを呼び出します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("calculator_example") {
        system("You are a helpful assistant with access to tools.")
        user("What is 5 + 3?")
        tool {
            // ツール呼び出し
            call(
                id = "calculator_tool_id",
                tool = "calculator",
                content = """{"operation": "add", "a": 5, "b": 3}"""
            )

            // ツール結果
            result(
                id = "calculator_tool_id",
                tool = "calculator",
                content = "8"
            )
        }

        // ツール結果に基づいた LLM の応答
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
        // ツール呼び出し
        .toolCall("calculator_tool_id", "calculator", "{\"operation\": \"add\", \"a\": 5, \"b\": 3}")
        // ツール結果
        .toolResult("calculator_tool_id", "calculator", "8")
        // ツール結果に基づいた LLM の応答    
        .assistant("The result of 5 + 3 is 8.")
        .user("What is 4 + 5?")
        .build();
    ```
    <!--- KNIT example-creating-prompts-java-06.java -->

## テキストメッセージビルダー

!!! warning "警告"
    テキストメッセージビルダーは Kotlin でのみ利用可能です。

`system()`、`user()`、または `assistant()` メッセージを構築する際、リッチテキスト形式を扱うためのヘルパー [テキスト構築関数 (text-building functions)](api:prompt-model::ai.koog.prompt.text.TextContentBuilder) を使用できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    -->

    ```kotlin
    val prompt = prompt("text_example") {
        user {
            +"Review the following code snippet:"
            +"fun greet(name: String) = println(\"Hello, \$name!\")"

            // 改行（Paragraph break）
            br()
            text("Please include in your explanation:")

            // コンテンツのインデント
            padding("  ") {
                +"1. What the function does."
                +"2. How string interpolation works."
            }
        }
    }
    ```
    <!--- KNIT example-creating-prompts-07.kt -->

また、[Markdown](api:prompt-markdown::ai.koog.prompt.markdown.markdown) および [XML](api:prompt-xml::ai.koog.prompt.xml.xml) ビルダーを使用して、対応する形式でコンテンツを追加することもできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.markdown.markdown
    import ai.koog.prompt.xml.xml
    -->

    ```kotlin
    val prompt = prompt("markdown_xml_example") {
        // Markdown 形式のユーザーメッセージ
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
        // XML 形式のアシスタントメッセージ
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
    テキスト構築関数を XML や Markdown ビルダーと組み合わせて使用することも可能です。

## プロンプトのパラメータ

プロンプトは、LLM の振る舞いを制御するパラメータを構成することでカスタマイズできます。

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
    // 最初にパラメータを作成する
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
        
    // 構築されたプロンプトにパラメータを適用する
    prompt = prompt.withParams(params);
    ```
    <!--- KNIT example-creating-prompts-java-07.java -->

以下のパラメータがサポートされています。

- `temperature`: モデルの応答におけるランダム性を制御します。
- `toolChoice`: モデルのツール呼び出し動作を制御します。
- `numberOfChoices`: 複数の代替応答を要求します。
- `schema`: モデルの応答形式の構造を定義します。
- `maxTokens`: 応答内のトークン数を制限します。
- `speculation`: 期待される応答形式に関するヒントを提供します（特定のモデルでのみサポート）。

詳細については、[LLM パラメータ](../../llm-parameters.md)を参照してください。

## 既存のプロンプトの拡張

既存のプロンプトを引数として、Kotlin の `prompt()` 関数または Java の `Prompt.builder()` を呼び出すことで、既存のプロンプトを拡張できます。

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

これにより、`basePrompt` のすべてのメッセージと、新しいユーザーメッセージを含む新しいプロンプトが作成されます。

## 次のステップ

- [マルチモーダルコンテンツ](multimodal-content.md)の扱い方を学ぶ。
- 単一の LLM プロバイダーを使用する場合は、[LLM クライアント](../llm-clients.md)でプロンプトを実行する。
- 複数の LLM プロバイダーを使用する場合は、[プロンプトエグゼキューター](../prompt-executors.md)でプロンプトを実行する。
- [キャッシュ制御](cache-control.md)による LLM キャッシュの使用方法を学ぶ。