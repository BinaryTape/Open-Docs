# クラスベースのツール

このセクションでは、柔軟性の強化と動作のカスタマイズが必要なシナリオ向けに設計されたAPIについて説明します。
このアプローチでは、ツールのパラメータ、メタデータ、実行ロジック、登録方法、および呼び出し方法に至るまで、ツールを完全に制御できます。

このレベルの制御は、基本的なユースケースを拡張し、エージェントセッションやワークフローへのシームレスな統合を可能にする、高度なツールを作成するのに理想的です。

このページでは、ツールの実装方法、レジストリを介したツールの管理、ツールの呼び出し、およびノードベースのエージェントアーキテクチャ内での使用方法について説明します。

!!! note
    このAPIはマルチプラットフォームです。これにより、異なるプラットフォーム間で同じツールを使用できます。

## ツール実装

Koogフレームワークは、ツールの実装に関して次のアプローチを提供します。

*   すべてのツールの基底クラスである `Tool` を使用する。テキスト以外の結果を返す必要がある場合や、ツールの動作を完全に制御する必要がある場合にこのクラスを使用します。
*   基底の `Tool` クラスを拡張し、テキスト結果を返すツールの作成を簡素化する `SimpleTool` クラスを使用する。ツールがテキストのみを返す必要があるシナリオでこのアプローチを使用します。

どちらのアプローチも同じコアコンポーネントを使用しますが、実装と返される結果が異なります。

### Tool クラス

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象クラスは、Koogでツールを作成するための基底クラスです。
特定の引数型 (`Args`) を受け入れ、さまざまな型の結果 (`Result`) を返すツールを作成できます。

各ツールは次のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                                                   |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | ツールに必要な引数を定義するシリアライズ可能なデータクラス。                                                                                                                                                                                                                                                                       |
| `Result`                                 | ツールが返す結果のシリアライズ可能な型。ツール結果をカスタムフォーマットで表示したい場合は、[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) クラスを継承し、`textForLLM(): String` メソッドを実装してください。                                                                                                          |
| `argsSerializer`                         | ツールの引数をどのようにデシリアライズするかを定義するオーバーライドされた変数。[argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) も参照してください。                                                                                                                  |
| `resultSerializer`                       | ツールの結果をどのようにデシリアライズするかを定義するオーバーライドされた変数。[resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html) も参照してください。[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) を継承することを選択した場合は、`ToolResultUtils.toTextSerializer()` の使用を検討してください。 |
| `descriptor`                             | ツールメタデータを指定するオーバーライドされた変数:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (デフォルトは空)<br/>- `optionalParameters` (デフォルトは空)<br/>[descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) も参照してください。                        |
| `execute()`                              | ツールのロジックを実装する関数。`Args` 型の引数を受け取り、`Result` 型の結果を返します。[execute()]() も参照してください。                                                                                                                                         |

!!! tip
    LLMがツールを適切に理解して使用できるように、ツールの明確な説明と適切に定義されたパラメータ名があることを確認してください。

#### 使用例

以下は、`Tool` クラスを使用して数値の結果を返すカスタムツール実装の例です。

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription
-->
```kotlin
// Implement a simple calculator tool that adds two digits
object CalculatorTool : Tool<CalculatorTool.Args, Int>() {
    
    // Arguments for the calculator tool
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

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()
    override val resultSerializer = Int.serializer()
    
    // Name of the tool, visible to LLM (by default will be derrived from the class name)
    override val name = "calculator"
    // Description of the tool, visible to LLM. Required
    override val description = "A simple calculator that can add two digits (0-9)."

    // Function to add two digits
    override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
}
```
<!--- KNIT example-class-based-tools-01.kt --> 

ツールを実装したら、それをツールレジストリに追加し、エージェントで使用する必要があります。詳細については、「[ツールレジストリ](tools-overview.md#tool-registry)」を参照してください。

詳細については、「[API リファレンス](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)」を参照してください。

### SimpleTool クラス

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象クラスは `Tool<Args, ToolResult.Text>` を拡張し、テキスト結果を返すツールの作成を簡素化します。

各シンプルツールは次のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                              |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | カスタムツールに必要な引数を定義するシリアライズ可能なデータクラス。                                                                                                                                                                                                                         |
| `argsSerializer`                         | ツールの引数をどのようにシリアライズするかを定義するオーバーライドされた変数。[argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) も参照してください。                                                                                             |
| `descriptor`                             | ツールメタデータを指定するオーバーライドされた変数:<br/>- `name`<br/>- `description`<br/>- `requiredParameters` (デフォルトは空)<br/> - `optionalParameters` (デフォルトは空)<br/> [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) も参照してください。 |
| `doExecute()`                            | ツールによって実行される主要なアクションを記述するオーバーライドされた関数。`Args` 型の引数を受け取り、`String` を返します。[doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html) も参照してください。                                          |

!!! tip
    LLMがツールを適切に理解して使用できるように、ツールの明確な説明と適切に定義されたパラメータ名があることを確認してください。

#### 使用例

以下は、`SimpleTool` を使用したカスタムツール実装の例です。

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.Serializable
-->
```kotlin
// Create a tool that casts a string expression to a double value
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // Define tool arguments
    @Serializable
    data class Args(
        @property:LLMDescription("An expression to case to double")
        val expression: String,
        @property:LLMDescription("A comment on how to process the expression")
        val comment: String
    )

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Description of the tool, visible to LLM
    override val description = "casts the passed expression to double or returns 0.0 if the expression is not castable"
    
    // Function that executes the tool with the provided arguments
    override suspend fun doExecute(args: Args): String {
        return "Result: ${castToDouble(args.expression)}, " + "the comment was: ${args.comment}"
    }
    
    // Function to cast a string expression to a double value
    private fun castToDouble(expression: String): Double {
        return expression.toDoubleOrNull() ?: 0.0
    }
}
```
<!--- KNIT example-class-based-tools-02.kt --> 

### カスタム形式でツール結果をLLMに送信する

LLMに送信されるJSON結果に満足できない場合（たとえば、ツール出力がMarkdownとして構造化されている方がLLMがうまく機能する場合など）、次の手順に従う必要があります。
1. `ToolResult.TextSerializable` インターフェースを実装し、`textForLLM()` メソッドをオーバーライドします。
2. `ToolResultUtils.toTextSerializer<T>()` を使用して `resultSerializer` をオーバーライドします。

#### 例

<!--- INCLUDE
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolResult
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.prompt.markdown.markdown
-->
```kotlin
// A tool that edits file
object EditFile : Tool<EditFile.Args, EditFile.Result>() {
    // Define tool arguments
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

        // Textual output (in Markdown format) that will be visible to the LLM after the tool finishes.
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

    // Serializers for the args and Result class
    override val argsSerializer = Args.serializer()
    override val resultSerializer = Result.serializer()

    // Description of the tool, visible to LLM
    override val description = "Edits the given file"

    // Function that executes the tool with the provided arguments
    override suspend fun execute(args: Args): Result {
        return TODO("Implement file edit")
    }
}
```
<!--- KNIT example-class-based-tools-03.kt -->

ツールを実装したら、それをツールレジストリに追加し、エージェントで使用する必要があります。
詳細については、「[ツールレジストリ](tools-overview.md#tool-registry)」を参照してください。