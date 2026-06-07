# クラスベースのツール

このセクションでは、高度な柔軟性とカスタマイズされた動作が必要なシナリオ向けに設計されたAPIについて説明します。
Kotlinでのこのアプローチでは、パラメータ、メタデータ、実行ロジック、および登録と呼び出しの方法を含め、ツールを完全に制御できます。Javaでは、アノテーションベースの手法とリフレクションベースの登録を使用してツールを作成します。

このレベルの制御は、基本的なユースケースを拡張する高度なツールを作成するのに最適であり、エージェントのセッションやワークフローへのシームレスな統合を可能にします。

このページでは、KotlinとJavaの両方でツールを実装する方法、レジストリを介してツールを管理する方法、ツールを呼び出す方法、およびノードベースのエージェントアーキテクチャ内でツールを使用する方法について説明します。

!!! note
    このAPIはKotlin向けにマルチプラットフォーム対応しています。Javaのツールは、アノテーションベースの手法で実装され、リフレクションを介して登録されます。これにより、Kotlinでは異なるプラットフォーム間で同じツールを使用でき、Javaでは完全なJVM相互運用性が提供されます。

## ツールの実装

Koogフレームワークは、ツールを実装するための以下のアプローチを提供します。

Kotlinの場合：

* すべてのツールのベースクラスである `Tool` を使用する。テキスト以外の結果を返す必要がある場合や、ツールの動作を完全に制御する必要がある場合に、このクラスを使用してください。
* ベースの `Tool` クラスを継承し、テキストの結果を返すツールの作成を簡素化する `SimpleTool` クラスを使用する。ツールがテキストのみを返す必要があるシナリオでは、このアプローチを使用してください。

どちらのアプローチも同じコアコンポーネントを使用しますが、実装方法と返される結果が異なります。

Javaの場合：

* アノテーションベースのメソッド（`@Tool` および `@LLMDescription`）とリフレクションベースの登録を使用する。JavaからKotlinの `Tool` や `SimpleTool` をサブクラス化することは、`suspend` 関数の制限によりサポートされていないため、これがJava相互運用に推奨されるアプローチです。

### Toolクラス (Kotlin)

[`Tool<Args, Result>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) 抽象クラスは、Kotlinでツールを作成するためのベースクラスです。
これにより、特定の引数型（`Args`）を受け取り、さまざまな型（`Result`）の結果を返すツールを作成できます。

各ツールは以下のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | ツールに必要な引数を定義する、シリアライズ可能なデータクラス。                                                                                                                                                                                                                                                                                                                                                             |
| `Result`                                 | ツールが返す結果のシリアライズ可能な型。ツールの結果をカスタムフォーマットで提示したい場合は、[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) クラスを継承し、`textForLLM(): String` メソッドを実装してください。                                                                                                           |
| `argsSerializer`                         | ツールの引数がどのようにデシリアライズされるかを定義する、オーバーライドされた変数。詳細は [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) を参照してください。                                                                                                                                                                                                                        |
| `resultSerializer`                       | ツールの結果がどのようにデシリアライズされるかを定義する、オーバーライドされた変数。詳細は [resultSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/result-serializer.html) を参照してください。[ToolResult.TextSerializable](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-result/-text-serializable/index.html) を継承することを選択した場合は、`ToolResultUtils.toTextSerializer()` の使用を検討してください。 |
| `descriptor`                             | ツールのメタデータを指定する、オーバーライドされた変数：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトは空）<br/>- `optionalParameters`（デフォルトは空）<br/>詳細は [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) を参照してください。                                                                                                                                |
| `execute()`                              | ツールのロジックを実装する関数。`Args` 型の引数を受け取り、`Result` 型の結果を返します。詳細は [execute()]() を参照してください。                                                                                                                                                                                                                                                                                  |

!!! note "Javaでの実装"
    Javaでは、`Tool<Args, Result>` をサブクラス化する代わりに、`@Tool` および `@LLMDescription` を使用したアノテーションベースのメソッドを使用します。フレームワークはリフレクションを通じてシリアライズと登録を自動的に処理します。詳細については、後述の [アノテーションベースのメソッド (Java)](#annotation-based-methods-java) を参照してください。

!!! tip
    LLMがツールを正しく理解し使用できるように、ツールには明確な説明と適切に定義されたパラメータ名を付けるようにしてください。Kotlinでは `descriptor` プロパティを、Javaでは `@LLMDescription` アノテーションを使用します。

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
        description = "2つの数字（0〜9）を足すことができるシンプルな計算機。"
    ) {

        // 計算機ツールの引数
        @Serializable
        data class Args(
            @property:LLMDescription("足す最初の数字（0〜9）")
            val digit1: Int,
            @property:LLMDescription("足す2番目の数字（0〜9）")
            val digit2: Int
        ) {
            init {
                require(digit1 in 0..9) { "digit1は1桁の数字（0〜9）である必要があります" }
                require(digit2 in 0..9) { "digit2は1桁の数字（0〜9）である必要があります" }
            }
        }

        // 2つの数字を足す関数
        override suspend fun execute(args: Args): Int = args.digit1 + args.digit2
    }
    ```
    <!--- KNIT example-class-based-tools-01.kt -->

ツールを実装した後は、それをツールレジストリに追加してからエージェントで使用する必要があります。詳細については、[ツールレジストリ](../tools/index.md#tool-registry) を参照してください。

詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/index.html) を参照してください。

#### ツールからエージェントコンテキストを読み取る

エージェントの完全な状態（LLMコンテキスト、実行ID、設定、ストレージなど）を必要とするツールは、`Tool<Args, Result>` の代わりに `AgentContextAwareTool<Args, Result>` を継承します。フレームワークは呼び出しを駆動するライブな `AIAgentContext` を注入し、ツールはそれを引数スキーマから読み取るのではなく、型指定されたパラメータとして受け取ります。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.context.AIAgentContext
    import ai.koog.agents.core.agent.tools.AgentContextAwareTool
    import ai.koog.agents.core.tools.annotations.LLMDescription
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    // 呼び出しを駆動するライブなAIAgentContextを読み取るツール。
    object TracingCalculatorTool : AgentContextAwareTool<TracingCalculatorTool.Args, Int>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Int>(),
        name = "tracing_calculator",
        description = "2つの数字を足し、エージェントの実行IDでタグ付けされたログ行を出力します。"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("足す最初の数字（0〜9）")
            val digit1: Int,
            @property:LLMDescription("足す2番目の数字（0〜9）")
            val digit2: Int
        )

        override suspend fun execute(args: Args, context: AIAgentContext): Int {
            val runId = context.runId
            // ... 横断的なコンテキスト（ロギング、トレーシング、相関）にrunIdを使用する
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-01.kt -->

`AgentContextAwareTool` は、フレームワークがツールの代わりに管理する呼び出しごとの `ToolCallMetadata` サイドチャネルを介して、フレームワークによってディスパッチされます。エージェントの実行以外でこのようなツールを呼び出すと、`AIAgentContext` が注入されないため `IllegalStateException` がスローされます。本番コードは常に `ContextualAgentEnvironment` を経由する必要があり、ユニットテストでは `ToolCallMetadata.of(AgentContextAwareTool.AgentContextKey to context)` を介してコンテキストを明示的に指定できます。

#### 呼び出しごとの生メタデータを読み取る

少数のツールでは、エージェントコンテキスト *ではない*、呼び出し元または機能によって提供されたエントリを読み取る必要がある場合があります（例えば、オブザーバビリティ機能によって提供された分散トレーシングのスパンIDなど）。これらのツールは `ToolBase<Args, Result>` を直接継承し、完全な `ToolCallMetadata` バッグを公開します。

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
        description = "2つの数字を足し、呼び出し元または機能のメタデータからトレーシングスパンIDを伝播させます。"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("足す最初の数字（0〜9）")
            val digit1: Int,
            @property:LLMDescription("足す2番目の数字（0〜9）")
            val digit2: Int
        )

        override suspend fun execute(args: Args, metadata: ToolCallMetadata): Int {
            val traceSpanId = metadata["trace.span.id"] as? String
            // ... 横断的なコンテキスト（ロギング、トレーシング、相関）にtraceSpanIdを使用する
            return args.digit1 + args.digit2
        }
    }
    ```
    <!--- KNIT example-class-based-tools-metadata-02.kt -->

呼び出し元は `SafeTool.execute(args, serializer, metadata)` または `AIAgentEnvironment.executeTool(toolCall, metadata)` を通じて直接メタデータを渡すことができます。機能は、インストール中に `pipeline.provideToolCallMetadata(this) { eventContext -> mapOf(...) }` を呼び出すことで、すべてのツール呼び出しに対してメタデータを提供できます。キーの衝突が発生した場合、呼び出し元が指定したメタデータが常に機能による提供よりも優先されます。

`Tool<Args, Result>` を継承して `execute(args)` をオーバーライドしている既存のツールは、変更なしで引き続き機能します。フレームワークはそれらを同じパスでディスパッチし、`ToolCallMetadata` を破棄します。メタデータをオプトインするには、`AgentContextAwareTool`（型指定されたコンテキストアクセス）または `ToolBase`（生のバッグアクセス）に切り替えてください。

### SimpleToolクラス (Kotlin)

[`SimpleTool<Args>`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/index.html) 抽象クラスは `Tool<Args, ToolResult.Text>` を継承しており、テキストの結果を返すツールの作成を簡素化します。

各シンプルツールは以下のコンポーネントで構成されます。

| <div style="width:110px">コンポーネント</div> | 説明                                                                                                                                                                                                                                                                                              |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Args`                                   | カスタムツールに必要な引数を定義する、シリアライズ可能なデータクラス。                                                                                                                                                                                                                         |
| `argsSerializer`                         | ツールの引数がどのようにシリアライズされるかを定義する、オーバーライドされた変数。詳細は [argsSerializer](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/args-serializer.html) を参照してください。                                                                                             |
| `descriptor`                             | ツールのメタデータを指定する、オーバーライドされた変数：<br/>- `name`<br/>- `description`<br/>- `requiredParameters`（デフォルトは空）<br/> - `optionalParameters`（デフォルトは空）<br/> 詳細は [descriptor](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool/descriptor.html) を参照してください。 |
| `doExecute()`                            | ツールによって実行される主要なアクションを記述する、オーバーライドされた関数。`Args` 型の引数を受け取り、`String` を返します。詳細は [doExecute()](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-simple-tool/do-execute.html) を参照してください。                                          |

!!! note "Javaでの実装"
    Javaにおける同等のアプローチは、`String` を返すアノテーションベースのメソッドを使用することです。フレームワークはテキスト結果のラップを自動的に処理します。詳細については、後述の [アノテーションベースのメソッド (Java)](#annotation-based-methods-java) を参照してください。

!!! tip
    LLMがツールを正しく理解し使用できるように、ツールには明確な説明と適切に定義されたパラメータ名を付けるようにしてください。Kotlinでは `descriptor` とコンストラクタパラメータを使用し、Javaでは `@Tool` および `@LLMDescription` アノテーションを使用します。

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
    // 文字列式をdouble値にキャストするツールを作成する
    object CastToDoubleTool : SimpleTool<CastToDoubleTool.Args>(
        argsType = typeToken<Args>(),
        name = "cast_to_double",
        description = "渡された式をdoubleにキャストするか、キャストできない場合は0.0を返します"
    ) {
        // ツールの引数を定義
        @Serializable
        data class Args(
            @property:LLMDescription("doubleにキャストする式")
            val expression: String,
            @property:LLMDescription("式の処理方法に関するコメント")
            val comment: String
        )

        // 指定された引数でツールを実行する関数
        override suspend fun execute(args: Args): String {
            return "結果: ${castToDouble(args.expression)}, " + "コメントは: ${args.comment}"
        }

        // 文字列式をdouble値にキャストする関数
        private fun castToDouble(expression: String): Double {
            return expression.toDoubleOrNull() ?: 0.0
        }
    }
    ```
    <!--- KNIT example-class-based-tools-02.kt -->

### アノテーションベースのメソッド (Java)

Javaでツールを実装する場合、`Tool` や `SimpleTool` をサブクラス化する代わりに、`@Tool` および `@LLMDescription` を使用したアノテーションベースのメソッドを使用します。Koogはリフレクションを通じてシリアライズと登録を自動的に処理します。実装の詳細については、以下のJavaの例を参照してください。

#### 使用例

これは、Kotlinの `Tool` クラスを使用する場合と同等の、Javaでのツール実装の例です。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // Javaの同等物：ツールをJavaメソッドとして実装し、ToolRegistry.builder()を介して登録します。
    // これは、KotlinのToolベースクラスをサブクラス化する代わりに推奨されるJava相互運用のパスです。
    public final class CalculatorTool {
        private CalculatorTool() {}
    
        @Tool(customName = "calculator")
        @LLMDescription(description = "2つの数字（0〜9）を足すことができるシンプルな計算機。")
        public static int calculator(
                @LLMDescription(description = "足す最初の数字（0〜9）") int digit1,
                @LLMDescription(description = "足す2番目の数字（0〜9）") int digit2
        ) {
            if (digit1 < 0 || digit1 > 9) throw new IllegalArgumentException("digit1は1桁の数字（0〜9）である必要があります");
            if (digit2 < 0 || digit2 > 9) throw new IllegalArgumentException("digit2は1桁の数字（0〜9）である必要があります");
            return digit1 + digit2;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CalculatorTool.class.getMethod("calculator", int.class, int.class))
                .build();
        }
    }
    // 注意：JavaからKotlinのTool<TArgs, TResult>をサブクラス化し、suspendなexecute(...)をオーバーライドすることはサポートされていません。
    // Javaの相互運用では、Javaメソッドのツールとしてのリフレクションベースの登録を使用します。
    ```
    <!--- KNIT example-class-based-tools-java-01.java -->

これは、Kotlinの `SimpleTool` クラスを使用する場合と同等の、Javaでのツール実装の例です。この例では、テキストの結果を返すシンプルなツールを実装しています。

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // SimpleToolのJava同等物：Javaメソッドを提供し、ツールとして登録します。
    public final class CastToDoubleTool {
        private CastToDoubleTool() {}
    
        @Tool(customName = "cast_to_double")
        @LLMDescription(description = "渡された式をdoubleにキャストするか、キャストできない場合は0.0を返します")
        public static String castToDouble(
                @LLMDescription(description = "doubleにキャストする式") String expression,
                @LLMDescription(description = "式の処理方法に関するコメント") String comment
        ) {
            double value;
            try {
                value = Double.parseDouble(expression);
            } catch (Exception e) {
                value = 0.0;
            }
            return "結果: " + value + ", コメントは: " + comment;
        }
    
        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(CastToDoubleTool.class.getMethod("castToDouble", String.class, String.class))
                .build();
        }
    }
    // 注意：JavaからKotlinのSimpleTool<TArgs>を拡張する必要はありません。Javaメソッドを登録するのが慣用的です。
    ```
    <!--- KNIT example-class-based-tools-java-02.java -->

### カスタムフォーマットでのLLMへのツール結果の送信

Kotlinの場合：

LLMに送信されるJSON形式の結果に満足できない場合（特定のケースでは、ツールの出力がMarkdownなどで構造化されている方がLLMの動作が良くなることがあります）、以下の手順に従う必要があります。

1. `ToolResult.TextSerializable` インターフェースを実装し、`textForLLM()` メソッドをオーバーライドする。
2. `ToolResultUtils.toTextSerializer<T>()` を使用して `resultSerializer` をオーバーライドする。

Javaの場合：

アノテーションを付けたメソッドから、フォーマットされたテキスト（Markdownなど）を `String` として直接返します。フレームワークがこれを自動的に処理します。

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
        description = "指定されたファイルを編集します"
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

            // ツール終了後にLLMに表示されるテキスト出力（Markdown形式）。
            fun textForLLM(): String = markdown {
                if (patchApplyResult is PatchApplyResult.Success) {
                    line {
                        bold("正常に").text(" ファイルが編集されました（パッチが適用されました）")
                    }
                } else {
                    line {
                        text("ファイルは ")
                            .bold("変更されませんでした")
                            .text("（パッチの適用に失敗しました: ${(patchApplyResult as PatchApplyResult.Failure).reason}）")
                    }
                }
            }

            override fun toString(): String = textForLLM()
        }

        // 指定された引数でツールを実行する関数
        override suspend fun execute(args: Args): Result {
            return TODO("ファイル編集の実装")
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

    // Javaの同等物：JavaメソッドからLLMにMarkdownテキストを直接返し、ツールとして登録します。
    // これにより、カスタムのシリアライズ可能なResult型（Kotlinのシリアライズサポートが必要になる）が不要になります。
    public final class EditFile {
        private EditFile() {}

        @Tool(customName = "edit_file")
        @LLMDescription(description = "指定されたファイルを編集します")
        public static String editFile(
                String path,
                String original,
                String replacement
        ) {
            // TODO: ファイル編集ロジックの実装。以下はMarkdown出力を説明するためのプレースホルダーです
            boolean success = false;
            if (success) {
                return "**正常に** ファイルが編集されました（パッチが適用されました）";
            } else {
                return "ファイルは **変更されませんでした**（パッチの適用に失敗しました: 理由）";
            }
        }

        public static ToolRegistry registry() throws NoSuchMethodException {
            return ToolRegistry.builder()
                .tool(EditFile.class.getMethod("editFile", String.class, String.class, String.class))
                .build();
        }
    }
    // 注意：Javaから構造化されたカスタムResultオブジェクトが必要な場合は、Kotlinの@Serializable型
    // または別のシリアライザーを認識する型を公開する必要があります。Stringを返す場合は、KoogのJava相互運用でそのまま動作します。
    ```
    <!--- KNIT example-class-based-tools-java-03.java -->

KotlinまたはJavaでツールを実装した後は、それをツールレジストリに追加してからエージェントで使用する必要があります。
詳細については、[ツールレジストリ](../tools/index#tool-registry) を参照してください。