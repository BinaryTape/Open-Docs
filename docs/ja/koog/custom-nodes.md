# カスタムノードの実装

このページでは、Koogフレームワークで独自のカスタムノードを実装する方法について詳しく説明します。
カスタムノードを使用すると、特定の操作を実行する再利用可能なコンポーネントを作成し、エージェントワークフローの機能を拡張できます。

グラフノードとは何か、その使用方法、および既存のデフォルトノードの詳細については、[グラフノード](nodes-and-components.md)を参照してください。

## ノードアーキテクチャの概要

実装の詳細に入る前に、Koogフレームワークにおけるノードのアーキテクチャを理解することが重要です。ノードはエージェントワークフローの基本的な構成要素であり、各ノードはワークフローにおける特定の操作や変換を表します。ノード間をエッジ（Edge）で接続することで、ノード間の実行の流れを定義します。

各ノードは、入力を受け取って出力を生成する `execute` メソッドを持っており、その出力はワークフロー内の次のノードへと渡されます。

## カスタムノードの実装

カスタムノードの実装は、入力データに対して基本的なロジックを実行して出力を返す単純なものから、パラメータを受け取り、実行間で状態を保持するより複雑なものまで多岐にわたります。

### 基本的なノードの実装

グラフ内にカスタムノードを実装し、独自のカスタムロジックを定義する最も簡単な方法は、以下のパターンを使用することです。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = Int
    val returnValue = 42
    val str = strategy<Input, Output>("my-strategy") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val myNode by node<Input, Output>("node_name") { input ->
        // 処理
        returnValue
    }
    ```
    <!--- KNIT example-custom-nodes-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava01 {
        static class Input {}
        static class Output {}
        static Output returnValue = new Output();
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(Input.class)
        .withOutput(Output.class)
        .withAction((input, ctx) -> {
            // 処理
            return returnValue;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava01.java -->

上記のコードは、事前定義された `Input` 型と `Output` 型を持ち、オプションで名前文字列パラメータ（`node_name`）を受け取るカスタムノード `myNode` を表しています。Kotlinでは `node` DSL関数を使用します。Javaでは `AIAgentNode.builder()` パターンを使用します。

実際の例として、文字列の入力を受け取り、その文字数を返すシンプルなノードを以下に示します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val str = strategy<String, Int>("my-strategy") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val myNode by node<String, Int>("node_name") { input ->
        // 処理
        input.length
    }
    ```
    <!--- KNIT example-custom-nodes-02.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava02 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 処理
            return input.length();
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava02.java -->

カスタムノードを作成する別の方法として、再利用可能な関数に抽出する方法があります。Kotlinでは、`node` 関数を呼び出す `AIAgentSubgraphBuilderBase` の拡張関数を定義します。Javaでは、ノードビルダーの呼び出しをヘルパーメソッドに抽出します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = String
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    fun AIAgentSubgraphBuilderBase<*, *>.myCustomNode(
        name: String? = null
    ): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
        // カスタムロジック
        input // 入力をそのまま出力として返す（パススルー）
    }

    val myCustomNode by myCustomNode("node_name")
    ```
    <!--- KNIT example-custom-nodes-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava03 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // カスタムロジック
            return input; // 入力をそのまま出力として返す（パススルー）
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava03.java -->

これにより、何らかのカスタムロジックを実行しつつ、入力に変更を加えずに出力として返すパススルーノードが作成されます。

### 追加の引数を持つノード

動作をカスタマイズするための引数を受け取るノードを作成できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = String
    typealias Output = String
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
        fun AIAgentSubgraphBuilderBase<*, *>.myNodeWithArguments(
        name: String? = null,
        arg1: String,
        arg2: Int
    ): AIAgentNodeDelegate<Input, Output> = node(name) { input ->
        // カスタムロジック内で arg1 と arg2 を使用
        input // 入力を出力として返す
    }

    val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
    ```
    <!--- KNIT example-custom-nodes-04.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava04 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    String arg1 = "value1";
    int arg2 = 42;

    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // カスタムロジック内で arg1 と arg2 を使用
            return input; // 入力を出力として返す
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava04.java -->

### パラメータ化されたノード

入力型と出力型をパラメータとして持つノードを定義できます。Kotlinでは、`reified` 型パラメータを持つ `inline` 関数を使用します。Javaでは、ノードを構築する際に型を明示的に指定します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    -->
    ```kotlin
    inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
        name: String? = null,
    ): AIAgentNodeDelegate<T, T> = node(name) { input ->
        // 追加のアクションを実行
        // 入力を出力として返す
        input
    }

    val strategy = strategy<String, String>("strategy_name") {
        val myCustomNode by myParameterizedNode<String>("node_name")
    }
    ```
    <!--- KNIT example-custom-nodes-05.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava05 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Javaでは、ノードを構築する際に型を明示的に指定します
    var myCustomNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            // 追加のアクションを実行
            // 入力を出力として返す
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava05.java -->

### 状態を持つノード（Stateful nodes）

実行間で状態を保持する必要がある場合は、クロージャ変数を使用できます。Kotlinでは、外側の関数で変数を宣言します。Javaでは、ラムダ内でのキャプチャは実質的にfinalである必要があるため、`AtomicInteger` のようなスレッドセーフなラッパーを使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
    import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
    import ai.koog.agents.core.dsl.builder.node
    typealias Input = Unit
    typealias Output = Unit
    -->
    ```kotlin
    fun AIAgentSubgraphBuilderBase<*, *>.myStatefulNode(
        name: String? = null
    ): AIAgentNodeDelegate<Input, Output> {
        var counter = 0

        return node(name) { input ->
            counter++
            println("ノードが $counter 回実行されました")
            input
        }
    }
    ```
    <!--- KNIT example-custom-nodes-06.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import java.util.concurrent.atomic.AtomicInteger;
    class exampleCustomNodesJava06 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Javaでは、ラムダ内でのキャプチャは実質的にfinalである必要があるため、
    // AtomicInteger（または類似のもの）を使用します
    AtomicInteger counter = new AtomicInteger(0);

    var myStatefulNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            int count = counter.incrementAndGet();
            System.out.println("ノードが " + count + " 回実行されました");
            return input;
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava06.java -->

## ノードの入力型と出力型

ノードは異なる入力型と出力型を持つことができ、これらはKotlinとJavaの両方でジェネリック型パラメータとして指定されます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val stringToIntNode by node<String, Int>("node_name") { input: String ->
        // 処理
        input.toInt() // 文字列を整数に変換
    }
    ```
    <!--- KNIT example-custom-nodes-07.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava07 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var stringToIntNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(Integer.class)
        .withAction((input, ctx) -> {
            // 処理
            return Integer.parseInt(input); // 文字列を整数に変換
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava07.java -->

!!! note
    入力型と出力型によって、ワークフロー内でノードを他のノードとどのように接続できるかが決まります。ノードを接続できるのは、ソースノードの出力型がターゲットノードの入力型と互換性がある場合に限られます。

## ベストプラクティス

カスタムノードを実装する際は、以下のベストプラクティスに従ってください。

1. **ノードの役割を絞る**: 各ノードは、明確に定義された単一の操作のみを実行するようにします。
2. **わかりやすい名前を使用する**: ノード名はその目的を明確に示すものであるべきです。
3. **パラメータをドキュメント化する**: すべてのパラメータに対して明確な説明を提供します。
4. **エラーを適切に処理する**: ワークフローの失敗を防ぐために、適切なエラーハンドリングを実装します。
5. **ノードを再利用可能にする**: 異なるワークフロー間でも再利用できるように設計します。
6. **型パラメータを使用する**: ノードの柔軟性を高めるために、適宜ジェネリック型パラメータを使用します。
7. **デフォルト値を提供する**: 可能な場合は、パラメータに適切なデフォルト値を提供します。

## 一般的なパターン

以下のセクションでは、カスタムノードを実装するための一般的なパターンをいくつか紹介します。

### パススルーノード

操作を実行しつつ、入力をそのまま出力として返すノードです。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val loggingNode by node<String, String>("node_name") { input ->
        println("入力を処理中: $input")
        input // 入力を出力として返す
    }
    ```
    <!--- KNIT example-custom-nodes-08.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava08 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var loggingNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("入力を処理中: " + input);
            return input; // 入力を出力として返す
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava08.java -->

### 変換ノード

入力を変換して、変更された出力を生成するノードです。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val upperCaseNode by node<String, String>("node_name") { input ->
        println("入力を処理中: $input")
        input.uppercase() // 入力を大文字に変換
    }
    ```
    <!--- KNIT example-custom-nodes-09.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    class exampleCustomNodesJava09 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    var upperCaseNode = AIAgentNode.builder("node_name")
        .withInput(String.class)
        .withOutput(String.class)
        .withAction((input, ctx) -> {
            System.out.println("入力を処理中: " + input);
            return input.toUpperCase(); // 入力を大文字に変換
        })
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava09.java -->

### LLMインタラクションノード

LLMとやり取りするノードです。Kotlinでは、LLMセッションをきめ細かく制御できます。Javaでは、プロンプトの構築を自動的に処理する `AIAgentNode.llmRequest()` のような事前構築済みのファクトリメソッドを通常使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val summarizeTextNode by node<String, String>("node_name") { input ->
        llm.writeSession {
            appendPrompt {
                user("以下のテキストを要約してください: $input")
            }

            val response = requestLLMWithoutTools()
            response.content
        }
    }
    ```
    <!--- KNIT example-custom-nodes-10.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentNode;
    import ai.koog.prompt.message.Message;
    class exampleCustomNodesJava10 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Javaでは、LLMインタラクションは事前構築済みのファクトリノードを使用して処理されます。
    // AIAgentNode.llmRequest() は、入力文字列をユーザーメッセージとしてLLMに送信し、
    // レスポンスを返すノードを作成します。プロンプトテキストは、
    // グラフ内で実行される際に入力として提供されます。
    var summarizeTextNode = AIAgentNode.llmRequest(true, "node_name");

    // LLMレスポンスからテキストコンテンツを抽出するには、別のノードをチェーンします：
    var extractContent = AIAgentNode.builder("extract-content")
        .withInput(Message.Response.class)
        .withOutput(String.class)
        .withAction((response, ctx) -> response.getContent())
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava10.java -->

!!! note
    上記のKotlinの例は、LLMセッションに対するきめ細かな制御（カスタムプロンプトの構築、明示的な `requestLLMWithoutTools` の呼び出し）を示しています。Java APIは `AIAgentNode.llmRequest()` のような、プロンプト構築を自動的に処理する（入力文字列がユーザーメッセージになる）より抽象度の高いファクトリメソッドを提供します。高度なプロンプトのカスタマイズが必要な場合は、複数のノードを構成するか、カスタムサブグラフを使用してください。

### ツール実行ノード

ツールを実行するカスタムノードです。Kotlinでは、ツール呼び出しを手動で構築して実行できます。Javaでは、ツール呼び出しのオーケストレーションをLLMに委譲するサブグラフを通常使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.prompt.message.Message
    import ai.koog.prompt.message.ResponseMetaInfo
    import ai.koog.utils.time.KoogClock
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import java.util.*
    val toolName = "my-custom-tool"
    @Serializable
    data class ToolArgs(val arg1: String, val arg2: Int)
    val strategy = strategy<String, String>("strategy_name") {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    val nodeExecuteCustomTool by node<String, String>("node_name") { input ->
        val toolCall = Message.Tool.Call(
            id = UUID.randomUUID().toString(),
            tool = toolName,
            metaInfo = ResponseMetaInfo.create(KoogClock.System),
            content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 入力をツールの引数として使用
        )

        val result = environment.executeTool(toolCall)
        result.content
    }
    ```
    <!--- KNIT example-custom-nodes-11.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.entity.AIAgentSubgraph;
    class exampleCustomNodesJava11 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // Javaでは、（Kotlinの例で示されているような）直接的なツール実行は
    // JavaビルダーAPIを通じては利用できません。代わりに、ツール呼び出しを
    // LLMに委譲するサブグラフを使用します。LLMがツールを呼び出すタイミングと方法を決定します：
    var toolSubgraph = AIAgentSubgraph.builder("tool-subgraph")
        .withInput(String.class)
        .withOutput(String.class)
        .withTask(input -> "Use my_tool with input: " + input)
        .build();
    ```
    <!--- KNIT exampleCustomNodesJava11.java -->

!!! note
    Kotlinの例では、`Message.Tool.Call` を手動で構築し、`environment.executeTool()` を呼び出すことで低レベルのツール実行を行っています。Java APIでは、`withTask()` を備えたサブグラフを使用して、LLMが自動的にツール呼び出しをオーケストレーションする、より高レベルなアプローチを推奨しています。利用可能なツールを制限するには、`.withInput()` の前に `.limitedTools(List.of(myTool))` をチェーンします。