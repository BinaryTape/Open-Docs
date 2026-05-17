# クラスベースのツール

このセクションでは、高度な柔軟性とカスタマイズされた動作を必要とするシナリオ向けに設計されたAPIについて説明します。
Kotlinでは、このアプローチにより、パラメータ、メタデータ、実行ロジック、およびツールの登録と呼び出し方法を含め、ツールを完全に制御できます。Javaでは、アノテーションベースのメソッドとリフレクションベースの登録を使用してツールを作成します。

このレベルの制御は、基本的なユースケースを拡張する高度なツールを作成し、エージェントのセッションやワークフローへのシームレスな統合を可能にするのに最適です。

このページでは、KotlinとJavaの両方でツールを実装する方法、レジストリによるツールの管理、ツールの呼び出し、およびノードベースのエージェントアーキテクチャ内での使用方法について説明します。

!!! note
    このAPIはKotlin向けにマルチプラットフォーム対応しています。Javaのツールはアノテーションベースのメソッドを使用して実装され、リフレクションを通じて登録されます。これにより、Kotlinでは異なるプラットフォーム間で同じツールを使用でき、Javaでは完全なJVMの相互運用性が提供されます。

## ツールの実装

Koogフレームワークは、ツールを実装するために以下のアプローチを提供します。

Kotlinの場合：

*   すべてのツールのベースクラスである `Tool` を使用する方法。テキスト以外の結果を返す必要がある場合や、ツールの動作を完全に制御する必要がある場合に、このクラスを使用してください。
*   ベースクラスの `Tool` を拡張し、テキスト結果を返すツールの作成を簡素化する `SimpleTool` クラスを使用する方法。ツールがテキストのみを返す必要があるシナリオでは、このアプローチを使用してください。

どちらのアプローチも同じコアコンポーネントを使用しますが、実装と返される結果が異なります。

Javaの場合：

*   アノテーションベースのメソッド（`@Tool` および `@LLMDescription`）とリフレクションベースの登録を使用する方法。JavaからKotlinの `Tool` や `SimpleTool` を継承することは、suspend 関数の制限によりサポートされていないため、Javaの相互運用性にはこのアプローチが推奨されます。

### Tool クラス (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象クラスは、Kotlinでツールを作成するためのベースクラスです。
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

!!! note "Javaでの実装"
    Javaでは、`Tool<Args, Result>` を継承する代わりに、`@Tool` と `@LLMDescription` を使用したアノテーションベースのメソッドを使用してください。フレームワークは、リフレクションを通じてシリアライズと登録を自動的に処理します。詳細は、以下の [アノテーションベースのメソッド (Java)](#annotation-based-methods-java) を参照してください。

!!! tip
    LLMがツールを正しく理解して使用できるように、ツールには明確な説明（description）と適切に定義されたパラメータ名を設定してください。Kotlinでは `descriptor` プロパティを使用し、Javaでは `@LLMDescription` アノテーションを使用します。

#### 使用例

以下は、数値の結果を返す `Tool` クラスを使用したカスタムツールの実装例です。

=== "Kotlin"

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

#### ツールからエージェントのコンテキストを読み取る

エージェントの完全な状態（LLMコンテキスト、実行ID、設定、ストレージなど）を必要とするツールは、`Tool<Args, Result>` の代わりに `AgentContextAwareTool<Args, Result>` を継承します。フレームワークは呼び出しを駆動する有効な `AIAgentContext` を注入し、ツールはそれを引数のスキーマから読み取るのではなく、型指定されたパラメータとして受け取ります。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.context.AIAgentContext
    import ai.koog.agents.core.agent.tools.AgentContextAwareTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 呼び出しを駆動する有効な AIAgentContext を読み取るツール。
    object TracingCalculatorTool : AgentContextAwareTool<TracingCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "tracing_calculator",
        description = "Adds two digits and emits a log line tagged with the agent run id."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, context: AIAgentContext): Int {
            val runId = context.runId
            // ... 横断的コンテキスト（ロギング、トレーシング、相関）のために runId を使用する
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-01.kt -->

`AgentContextAwareTool` は、フレームワークがツールの代わりに行うコールごとの `ToolCallMetadata` サイドチャネルを介して、フレームワークによってディスパッチされます。このようなツールをエージェントの実行外で呼び出すと、`AIAgentContext` が注入されていないため `IllegalStateException` がスローされます。本番コードは常に `ContextualAgentEnvironment` を経由する必要があり、ユニットテストでは `ToolCallMetadata.of(AgentContextAwareTool.AgentContextKey to context)` を介して明示的にコンテキストを提供できます。

#### 生のコールごとのメタデータを読み取る

少数のツールでは、エージェントコンテキスト*ではない*、呼び出し元または機能によって提供されたエントリ（例：オブザーバビリティ機能によって提供された分散トレーシングのスパンID）を読み取りたい場合があります。これらのツールは `ToolBase<Args, Result>` を直接継承し、完全な `ToolCallMetadata` バッグを公開します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolBase
    import ai.koog.agents.core.tools.ToolCallMetadata
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    object SpanAwareCalculatorTool : ToolBase<SpanAwareCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "span_aware_calculator",
        description = "Adds two digits, propagating a tracing span id from caller or feature metadata."
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("The first digit to add (0-9)")
            val digit1: Int,
            @property:LLMDescription("The second digit to add (0-9)")
            val digit2: Int
        )

        override suspend fun execute(args: Args, metadata: ToolCallMetadata): Int {
            val traceSpanId = metadata["trace.span.id"] as? String
            // ... 横断的コンテキスト（ロギング、トレーシング、相関）のために traceSpanId を使用する
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-02.kt -->

呼び出し元は `SafeTool.execute(args, serializer, metadata)` を通じて、または直接 `AIAgentEnvironment.executeTool(toolCall, metadata)` を通じてメタデータを渡すことができます。機能は、インストール中に `pipeline.provideToolCallMetadata(this) { eventContext -> mapOf(...) }` を呼び出すことで、すべてのツール呼び出しに対してメタデータを提供できます。キーが衝突した場合、呼び出し元が指定したメタデータが常に機能による提供よりも優先されます。

`Tool<Args, Result>` を継承し、`execute(args)` をオーバーライドしている既存のツールは、変更なしで引き続き動作します。フレームワークはそれらを同じパスを通じてディスパッチし、`ToolCallMetadata` を破棄します。メタデータをオプトインするには、`AgentContextAwareTool`（型指定されたコンテキストアクセス）または `ToolBase`（生のバッグアクセス）に切り替えてください。

### SimpleTool クラス (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象クラスは `Tool<Args, ToolResult.Text>` を拡張し、テキスト結果を返すツールの作成を簡素化します。

各シンプルツールは以下のコンポーネントで構成されています。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | カスタムツールに必要な引数を定義する、シリアライズ可能なデータクラス。                                                                                                                                                                                                                         |
| `argsSerializer`                         | ツールの引数がどのようにシリアライズされるかを定義するオーバーライド変数。詳細は [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) を参照してください。                                                                                             |
| `descriptor`                             | ツールのメタデータを指定するオーバーライド変数：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトは空）<br/> - `optionalParameters`（デフォルトは空）<br/> 詳細は [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) を参照してください。 |
| `doExecute()`                            | ツールによって実行される主要なアクションを記述するオーバーライド関数。`Args` 型の引数を受け取り、`String` を返します。詳細は [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html) を参照してください。                                          |

!!! note "Javaでの実装"
    Javaにおける同等のアプローチは、`String` を返すアノテーションベースのメソッドを使用することです。フレームワークはテキスト結果のラッピングを自動的に処理します。詳細は、以下の [アノテーションベースのメソッド (Java)](#annotation-based-methods-java) を参照してください。

!!! tip
    LLMがツールを正しく理解して使用できるように、ツールには明確な説明（description）と適切に定義されたパラメータ名を設定してください。Kotlinでは `descriptor` とコンストラクタパラメータを使用し、Javaでは `@Tool` と `@LLMDescription` アノテーションを使用します。

#### 使用例 

以下は、Kotlinで `SimpleTool` を使用したカスタムツールの実装例です。

=== "Kotlin"

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

### アノテーションベースのメソッド (Java)

Javaでツールを実装するには、`Tool` や `SimpleTool` を継承する代わりに、`@Tool` と `@LLMDescription` を使用したアノテーションベースのメソッドを使用します。Koogはリフレクションを通じてシリアライズと登録を自動的に処理します。実装の詳細については、以下のJavaの例を参照してください。

#### 使用例

以下は、Kotlinの `Tool` クラスの使用に相当する、Javaでのツール実装例です。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Javaでの同等機能：ツールをJavaメソッドとして実装し、ToolRegistry.builder()を介して登録します。
    // これは、KotlinのToolベースクラスを継承する代わりに推奨されるJava相互運用パスです。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "A simple calculator that can add two digits (0-9).")
        public static int calculator(
                @LLMDescription(description = "The first digit to add (0-9)") int digit1,
                @LLMDescription(description = "The second digit to add (0-9)") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1 must be a single digit (0-9)");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2 must be a single digit (0-9)");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注：JavaからKotlinのTool<TArgs, TResult>を継承し、suspend execute(...)をオーバーライドすることはサポートされていません。
    // Javaの相互運用では、Javaメソッドをツールとして登録するためにリフレクションベースの登録を使用します。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

以下は、Kotlinの `SimpleTool` クラスの使用に相当する、Javaでのツール実装例です。この例では、テキスト結果を返すシンプルなツールを実装しています。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleToolのJavaにおける同等機能：Javaメソッドを提供し、ツールとして登録します。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "casts the passed expression to double or returns 0.0 if the expression is not castable")
        public static String castToDouble(
                @LLMDescription(description = "An expression to case to double") String expression,
                @LLMDescription(description = "A comment on how to process the expression") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "Result: " + value + ", the comment was: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注：JavaからKotlinのSimpleTool<TArgs>を拡張する必要はありません。Javaメソッドを登録するのが慣用的なアプローチです。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### ツールの結果をカスタム形式でLLMに送信する

Kotlinの場合：

LLMに送信されるJSON形式の結果に満足できない場合（例えば、ツールの出力がMarkdown形式で構造化されている方がLLMがうまく機能する場合など）、以下の手順に従う必要があります。

1. `ToolResult.TextSerializable` インターフェースを実装し、`textForLLM()` メソッドをオーバーライドする
2. `ToolResultUtils.toTextSerializer<T>()` を使用して `resultSerializer` をオーバーライドする

Javaの場合：

アノテーション付きメソッドから、フォーマットされたテキスト（Markdownなど）を直接 `String` として返します。フレームワークがこれを自動的に処理します。

#### 例

以下は、KotlinとJavaの両方でカスタムフォーマットされた出力を示す例です。

=== "Kotlin"

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

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.core.tools.annotations.LLMDescription;
    import ai.koog.agents.core.tools.annotations.Tool;

    // Javaでの同等機能：JavaメソッドからLLMに直接Markdownテキストを返し、それをツールとして登録します。
    // これにより、カスタムのシリアライズ可能なResult型（Kotlinのシリアライズサポートが必要）が不要になります。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "Edits the given file")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: ファイル編集ロジックを実装します。以下はMarkdown出力を示すプレースホルダーです。
            boolean success = false;
            if (success) {
                return "**Successfully** edited file (patch applied)";
            } else {
                return "File was **not** modified (patch application failed: reason)";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注：Javaから構造化されたカスタムResultオブジェクトが必要な場合は、Kotlinの@Serializable型
    // または別のシリアライザー対応型を公開する必要があります。Stringを返す方法は、KoogのJava相互運用でそのまま機能します。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

KotlinまたはJavaでツールを実装した後は、それをツールレジストリに追加し、エージェントで使用する必要があります。
詳細は [Tool registry](tools-overview.md#tool-registry) を参照してください。