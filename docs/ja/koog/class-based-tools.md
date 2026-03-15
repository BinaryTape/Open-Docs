# クラスベースのツール

このセクションでは、高い柔軟性とカスタマイズされた動作を必要とするシナリオ向けに設計されたAPIについて説明します。
このアプローチでは、パラメータ、メタデータ、実行ロジック、およびツールの登録と呼び出し方法を含め、ツールを完全に制御できます。

このレベルの制御は、基本的なユースケースを拡張する高度なツールを作成し、エージェントのセッションやワークフローへのシームレスな統合を可能にするのに最適です。

このページでは、ツールの実装方法、レジストリによるツールの管理、ツールの呼び出し、およびノードベースのエージェントアーキテクチャ内での使用方法について説明します。

!!! note
    このAPIはマルチプラットフォームです。これにより、異なるプラットフォーム間で同じツールを使用できます。

## ツールの実装

Koogフレームワークは、ツールを実装するために以下のアプローチを提供します。

*   すべてのツールのベースクラスである `Tool` を使用する方法。テキスト以外の結果を返す必要がある場合や、ツールの動作を完全に制御する必要がある場合に、このクラスを使用してください。
*   ベースクラスの `Tool` を拡張し、テキスト結果を返すツールの作成を簡素化する `SimpleTool` クラスを使用する方法。ツールがテキストのみを返す必要があるシナリオでは、このアプローチを使用してください。

どちらのアプローチも同じコアコンポーネントを使用しますが、実装と返される結果が異なります。

### Tool クラス

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象クラスは、Koogでツールを作成するためのベースクラスです。
これにより、特定の引数タイプ（`Args`）を受け取り、さまざまなタイプ（`Result`）の結果を返すツールを作成できます。

各ツールは以下のコンポーネントで構成されています。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                                                                                                                                                          |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | ツールに必要な引数を定義する、シリアライズ可能なデータクラス。                                                                                                                                                                                                                                                                                                                                                            |
| `Result`                                 | ツールが返す結果のシリアライズ可能な型。ツール結果をカスタムフォーマットで表示したい場合は、[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) クラスを継承し、`textForLLM(): String` メソッドを実装してください。                                                                                                          |
| `argsSerializer`                         | ツールの引数がどのようにデシリアライズされるかを定義するオーバーライド変数。詳細は [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) を参照してください。                                                                                                                                                                                                                       |
| `resultSerializer`                       | ツールの結果がどのようにデシリアライズされるかを定義するオーバーライド変数。詳細は [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html) を参照してください。[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) を継承することを選択した場合は、`ToolResultUtils.toTextSerializer()` の使用を検討してください。 |
| `descriptor`                             | ツールのメタデータを指定するオーバーライド変数：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトは空）<br/>- `optionalParameters`（デフォルトは空）<br/>詳細は [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) を参照してください。                                                                                                                               |
| `execute()`                              | ツールのロジックを実装する関数。`Args` 型の引数を受け取り、`Result` 型の結果を返します。詳細は [execute()]() を参照してください。                                                                                                                                                                                                                                                                                 |

!!! tip
    LLMがツールを正しく理解して使用できるように、ツールには明確な説明（description）と適切に定義されたパラメータ名を設定してください。

#### 使用例

以下は、`Tool` クラスを使用して数値の結果を返すカスタムツールの実装例です。

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// 2つの数字を足すシンプルな計算機ツールを実装する
object CalculatorTool : Tool<CalculatorTool.Args, Int>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Int>(),
    name = "calculator",
    description = "A simple calculator that can add two digits (0-9)."
) {

    // 計算機ツールの引数
    @Serializable
    data class Args(
        @property:LLMDescription("The first digit to add (0-9)")
        val digit1: Int,
        @property:LLMDescription("The second digit to add (0-9)")
        val digit2: Int
    ) {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // 2つの数字を足す関数
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

ツールを実装した後は、それをツールレジストリに追加し、エージェントで使用する必要があります。詳細は [Tool registry](tools-overview.md#tool-registry) を参照してください。

詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) を参照してください。

### SimpleTool クラス

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象クラスは `Tool<Args, ToolResult.Text>` を拡張し、テキスト結果を返すツールの作成を簡素化します。

各シンプルツールは以下のコンポーネントで構成されています。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | カスタムツールに必要な引数を定義する、シリアライズ可能なデータクラス。                                                                                                                                                                                                                         |
| `argsSerializer`                         | ツールの引数がどのようにシリアライズされるかを定義するオーバーライド変数。詳細は [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) を参照してください。                                                                                             |
| `descriptor`                             | ツールのメタデータを指定するオーバーライド変数：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトは空）<br/> - `optionalParameters`（デフォルトは空）<br/> 詳細は [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) を参照してください。 |
| `doExecute()`                            | ツールによって実行される主要なアクションを記述するオーバーライド関数。`Args` 型の引数を受け取り、`String` を返します。詳細は [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html) を参照してください。                                          |

!!! tip
    LLMがツールを正しく理解して使用できるように、ツールには明確な説明（description）と適切に定義されたパラメータ名を設定してください。

#### 使用例 

以下は、`SimpleTool` を使用したカスタムツールの実装例です。

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
-->
```kotlin
// 文字列式を Double 値にキャストするツールを作成する
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
    argsType = typeToken<Args>(),
    name = "cast_to_double",
    description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
) {
    // ツールの引数を定義
    @Serializable
    data class Args(
        @property:LLMDescription("An expression to case to double")
        val expression: String,
        @property:LLMDescription("A comment on how to process the expression")
        val comment: String
    )

    // 提供された引数でツールを実行する関数
    override suspend fun execute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }

    // 文字列式を Double 値にキャストする関数
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### ツールの結果をカスタム形式でLLMに送信する

LLMに送信されるJSON形式の結果に満足できない場合（例えば、ツールの出力がMarkdown形式で構造化されている方がLLMがうまく機能する場合など）、以下の手順に従う必要があります。

1. `ToolResult.TextSerializable` インターフェースを実装し、`textForLLM()` メソッドをオーバーライドする
2. `ToolResultUtils.toTextSerializer<T>()` を使用して `resultSerializer` をオーバーライドする

#### 例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.serialization.typeToken
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// ファイルを編集するツール
object EditFile : Tool<EditFile.Args, EditFile.Result>(
    argsType = typeToken<Args>(),
    resultType = typeToken<Result>(),
    name = "edit_file",
    description = "Edits the given file"
) {
    // ツールの引数を定義
    @Serializable
    public data class Args(
        val path: String,
        val original: String,
        val replacement: String
    )

    @Serializable
    public data class Result(
        private val patchApplyResult: PatchApplyResult
    ) {

        @Serializable
        public sealed interface PatchApplyResult {
            @Serializable
            public data class Success(val updatedContent: String) : PatchApplyResult

            @Serializable
            public sealed class Failure(public val reason: String) : PatchApplyResult
        }

        // ツールの終了後にLLMに表示されるテキスト出力（Markdown形式）。
        fun textForLLM(): String = markdown {
            if (patchApplyResult is PatchApplyResult.Success) {
                line {
                    bold("Successfully").text(" edited file (patch applied)")
                }
            } else {
                line {
                    text("File was ")
                        .bold("not")
                        .text(" modified (patch application failed: ${(patchApplyResult as PatchApplyResult.Failure).reason})")
                }
            }
        }

        override fun toString(): String = textForLLM()
    }

    // 提供された引数でツールを実行する関数
    override suspend fun execute(args: Args): Result {
        return TODO("Implement file edit")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt -->

ツールを実装した後は、それをツールレジストリに追加し、エージェントで使用する必要があります。
詳細は [Tool registry](tools-overview.md#tool-registry) を参照してください。