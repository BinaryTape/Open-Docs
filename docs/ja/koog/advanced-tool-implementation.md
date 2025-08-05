# 高度な実装

このセクションでは、柔軟性の向上とカスタマイズされた動作が必要なシナリオ向けに設計された、高度なAPIについて説明します。
このアプローチでは、ツールのパラメーター、メタデータ、実行ロジック、およびツールの登録と呼び出し方法を含め、ツールを完全に制御できます。

このレベルの制御は、基本的なユースケースを拡張し、エージェントセッションやワークフローへのシームレスな統合を可能にする、高度なツールを作成するのに理想的です。

このページでは、ツールの実装方法、レジストリによるツールの管理、ツールの呼び出し、およびノードベースのエージェントアーキテクチャ内での使用について説明します。

!!! note
    高度なツールAPIはマルチプラットフォームです。これにより、異なるプラットフォーム間で同じツールを使用できます。

## ツールの実装

Koogフレームワークは、ツールを実装するために以下のいずれかのアプローチを提供します。

* すべてのツールにベースクラス `Tool` を使用する。テキスト以外の結果を返す必要がある場合や、ツールの動作を完全に制御する必要がある場合にこのクラスを使用します。
* ベースの `Tool` クラスを拡張し、テキストの結果を返すツールの作成を簡素化する `SimpleTool` クラスを使用する。ツールがテキストのみを返す必要があるシナリオで、このアプローチを使用します。

どちらのアプローチも同じコアコンポーネントを使用しますが、実装と返す結果が異なります。

### `Tool` クラス

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象クラスは、Koogでツールを作成するためのベースクラスです。
このクラスを使用すると、特定の引数型 (`Args`) を受け取り、さまざまな型の結果 (`Result`) を返すツールを作成できます。

各ツールは以下のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                                                              |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                       | ツールに必要な引数を定義するシリアライズ可能なデータクラスです。このクラスは [`ToolArgs`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/-args/index.html) インターフェースを実装する必要があります。引数を必要としないツールには、組み込みの `ToolArgs.Empty` 実装を使用できます。 |
| `Result`                                     | ツールが返す結果の型です。これは [`ToolResult`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/index.html) インターフェースを実装する必要があり、`ToolResult.Text`、`ToolResult.Boolean`、`ToolResult.Number`、または `ToolResult.JSONSerializable` のカスタム実装のいずれかになります。 |
| `argsSerializer`                             | ツールの引数がどのように逆シリアライズされるかを定義するオーバーライドされた変数です。詳細については、[argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)も参照してください。                                                                           |
| `descriptor`                                 | ツールメタデータを指定するオーバーライドされた変数です。<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトで空）<br/>- `optionalParameters`（デフォルトで空）<br/>詳細については、[descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)も参照してください。 |
| `execute()`                                  | ツールのロジックを実装する関数です。`Args` 型の引数を受け取り、`Result` 型の結果を返します。詳細については、[execute()]()も参照してください。                                                                                                                                                                     |

!!! tip
    LLMがツールを適切に理解し使用できるように、明確な説明と適切に定義されたパラメータ名を持つようにしてください。

#### 使用例

以下は、数値結果を返す `Tool` クラスを使用したカスタムツールの実装例です。

```kotlin
// Implement a simple calculator tool that adds two digits
object CalculatorTool : Tool<CalculatorTool.Args, ToolResult.Number>() {
    
    // Arguments for the calculator tool
    @Serializable
    data class Args(
        val digit1: Int,
        val digit2: Int
    ) : ToolArgs {
        init {
            require(digit1 in 0..9) { "digit1 must be a single digit (0-9)" }
            require(digit2 in 0..9) { "digit2 must be a single digit (0-9)" }
        }
    }

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor: ToolDescriptor = ToolDescriptor(
        name = "calculator",
        description = "A simple calculator that can add two digits (0-9).",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "digit1",
                description = "The first digit to add (0-9)",
                type = ToolParameterType.Integer
            ),
            ToolParameterDescriptor(
                name = "digit2",
                description = "The second digit to add (0-9)",
                type = ToolParameterType.Integer
            )
        )
    )

    // Function to add two digits
    override suspend fun execute(args: Args): ToolResult.Number {
        val sum = args.digit1 + args.digit2
        return ToolResult.Number(sum)
    }
}
```

ツールを実装したら、それをツールレジストリに追加し、エージェントで使用する必要があります。詳細については、[ツールレジストリ](tools-overview.md#tool-registry)を参照してください。

詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html)を参照してください。

### `SimpleTool` クラス

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象クラスは `Tool<Args, ToolResult.Text>` を拡張し、テキスト結果を返すツールの作成を簡素化します。

各シンプルツールは以下のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                                                             |
|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                       | カスタムツールに必要な引数を定義するシリアライズ可能なデータクラスです。                                                                                                                                                                                                                         |
| `argsSerializer`                             | ツールの引数がどのようにシリアライズされるかを定義するオーバーライドされた変数です。詳細については、[argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html)も参照してください。                                                                           |
| `descriptor`                                 | ツールメタデータを指定するオーバーライドされた変数です。<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトで空）<br/> - `optionalParameters`（デフォルトで空）<br/> 詳細については、[descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html)も参照してください。 |
| `doExecute()`                                | ツールによって実行される主要なアクションを記述するオーバーライドされた関数です。`Args` 型の引数を受け取り、`String` を返します。詳細については、[doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html)も参照してください。                                          |

!!! tip
    LLMがツールを適切に理解し使用できるように、明確な説明と適切に定義されたパラメータ名を持つようにしてください。

#### 使用例

以下は、`SimpleTool` を使用したカスタムツールの実装例です。

<!--- INCLUDE
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.Tool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import kotlinx.serialization.Serializable
-->
```kotlin
// Create a tool that casts a string expression to a double value
object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>() {
    // Define tool arguments
    @Serializable
    data class Args(val expression: String, val comment: String) : ToolArgs

    // Serializer for the Args class
    override val argsSerializer = Args.serializer()

    // Tool descriptor
    override val descriptor = ToolDescriptor(
        name = "cast_to_double",
        description = "casts the passed expression to double or returns 0.0 if the expression is not castable",
        requiredParameters = listOf(
            ToolParameterDescriptor(
                name = "expression", description = "An expression to case to double", type = ToolParameterType.String
            )
        ),
        optionalParameters = listOf(
            ToolParameterDescriptor(
                name = "comment",
                description = "A comment on how to process the expression",
                type = ToolParameterType.String
            )
        )
    )
    
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

ツールを実装したら、それをツールレジストリに追加し、エージェントで使用する必要があります。
詳細については、[ツールレジストリ](tools-overview.md#tool-registry)を参照してください。