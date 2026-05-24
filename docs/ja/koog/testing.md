# テスト

## 概要

テスト機能は、KoogフレームワークにおけるAIエージェントパイプライン、サブグラフ、およびツールインタラクションをテストするための包括的なフレームワークを提供します。これにより、開発者はモックLLM（大規模言語モデル）エグゼキューター、ツールレジストリ、およびエージェント環境を使用して、制御されたテスト環境を作成できます。

### 目的

この機能の主な目的は、以下の手段によってエージェントベースのAI機能のテストを容易にすることです。

- 特定のプロンプトに対するLLMレスポンスのモック化
- ツールコールとその結果のシミュレーション
- エージェントパイプラインのサブグラフとその構造のテスト
- エージェントノードを通過するデータの正しい流れの検証
- 期待される動作に対するアサーションの提供

## 設定と初期化

### テスト依存関係のセットアップ

テスト環境をセットアップする前に、以下の依存関係を追加していることを確認してください。

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
// build.gradle.kts
dependencies {
   testImplementation("ai.koog:agents-test:LATEST_VERSION")
   testImplementation(kotlin("test"))
}
```
<!--- KNIT example-testing-01.kt -->

### LLMレスポンスのモック化

テストの基本形態は、決定論的な動作を保証するためにLLMレスポンスをモック化することです。`MockLLMBuilder` と関連ユーティリティを使用してこれを行うことができます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.testing.tools.getMockExecutor
    val toolRegistry = ToolRegistry {}
    -->
    ```kotlin
    // モックLLMエグゼキューターの作成
    val mockLLMApi = getMockExecutor {
      // 単純なテキストレスポンスをモック化
      mockLLMAnswer("Hello!") onRequestContains "Hello"

      // デフォルトレスポンスをモック化
      mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
    }
    ```
    <!--- KNIT example-testing-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.core.tools.ToolRegistry;
    import ai.koog.agents.testing.tools.MockExecutor;
    import ai.koog.prompt.executor.model.PromptExecutor;

    // ツールレジストリを作成（空）
    ToolRegistry toolRegistry = ToolRegistry.builder().build();

    // モックLLMエグゼキューターの作成
    PromptExecutor mockLLMApi = MockExecutor.builder()
        .toolRegistry(toolRegistry)
        .mockLLMAnswer("Hello!").onRequestContains("Hello")
        .mockLLMAnswer("I don't know how to answer that.").asDefaultResponse()
        .build();
    ```
    <!--- KNIT example-testing-java-01.java -->

### ツールコールのモック化

入力パターンに基づいて、特定のツールを呼び出すようにLLMをモック化できます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.ext.tool.SayToUser
    import ai.koog.agents.testing.tools.getMockExecutor
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    public object CreateTool : Tool<CreateTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
            val message: String
        )
        override suspend fun execute(args: Args): String = args.message
    }
    public object SearchTool : Tool<SearchTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
            val query: String
        )
        override suspend fun execute(args: Args): String = args.query
    }
    public object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        /**
        * Represents the arguments for the [AskUser] tool
        *
        * @property message The message to be used as an argument for the tool's execution.
        */
        @Serializable
        public data class Args(
            @property:LLMDescription("Message from the agent")
            val query: String
        )
        override suspend fun execute(args: Args): String = args.query
    }
    typealias PositiveToneTool = SayToUser
    typealias NegativeToneTool = SayToUser
    val mockLLMApi = getMockExecutor {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // ツールコールレスポンスをモック化
    mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

    // ツールの動作をモック化 - ラムダを使用しない最も単純な形式
    mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

    // 追加のアクションを実行する必要がある場合にラムダを使用
    mockTool(NegativeToneTool) alwaysTells {
      // 追加のアクションを実行
      println("Negative tone tool called")

      // 結果を返す
      "The text has a negative tone."
    }

    // 特定の引数に基づいてツールの動作をモック化
    mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

    // 条件付き引数マッチングによるツールの動作のモック化
    mockTool(SearchTool) returns "Found results" onArgumentsMatching { args ->
      args.query.contains("important")
    }
    ```
    <!--- KNIT example-testing-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-02.java -->

上記の例は、単純なものから複雑なものまで、ツールをモック化するさまざまな方法を示しています。

1. `alwaysReturns`: 最も単純な形式で、ラムダなしで直接値を返します。
2. `alwaysTells`: 追加のアクションを実行する必要がある場合にラムダを使用します。
3. `returns...onArguments`: 正確な引数の一致に対して特定の結果を返します。
4. `returns...onArgumentsMatching`: カスタム引数条件に基づいて結果を返します。

### テストモードの有効化

エージェントでテストモードを有効にするには、`AIAgent` コンストラクタブロック内で `withTesting()` 関数を使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.withTesting
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    val llmModel = OpenAIModels.Chat.GPT4o
    // テストを有効にしてエージェントを作成
    fun main() {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    // テストを有効にしてエージェントを作成
    AIAgent(
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        // テストモードを有効化
        withTesting()
    }
    ```
    <!--- KNIT example-testing-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-03.java -->

## 高度なテスト

### グラフ構造のテスト

詳細なノードの動作やエッジの接続をテストする前に、エージェントのグラフの全体構造を検証することが重要です。これには、必要なすべてのノードが存在し、期待されるサブグラフ内で適切に接続されていることの確認が含まれます。

テスト機能は、エージェントのグラフ構造をテストするための包括的な方法を提供します。このアプローチは、複数のサブグラフと相互接続されたノードを持つ複雑なエージェントにとって特に価値があります。

#### 基本構造のテスト

エージェントのグラフの基本的な構造を検証することから始めます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    AIAgent(
        // コンストラクタ引数
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            val firstSubgraph = assertSubgraphByName<String, String>("first")
            val secondSubgraph = assertSubgraphByName<String, String>("second")

            // サブグラフの接続をアサート
            assertEdges {
                startNode() alwaysGoesTo firstSubgraph
                firstSubgraph alwaysGoesTo secondSubgraph
                secondSubgraph alwaysGoesTo finishNode()
            }

            // 最初のサブグラフを検証
            verifySubgraph(firstSubgraph) {
                val start = startNode()
                val finish = finishNode()

                // 名前でノードをアサート
                val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")

                // ノードの到達可能性をアサート
                assertReachable(start, askLLM)
                assertReachable(askLLM, callTool)
            }
        }
    }
    ```
    <!--- KNIT example-testing-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-04.java -->

### テストノードの動作

ノード動作テストでは、エージェントのグラフ内のノードが、特定の入力に対して期待される出力を生成することを検証できます。これは、さまざまなシナリオでエージェントのロジックが正しく機能することを確認するために不可欠です。

#### 基本的なノードテスト

個々のノードに対する単純な入力と出力の検証から始めます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting03.CreateTool
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {

        // 基本的なテキストレスポンスをテスト
        askLLM withInput "Hello" outputs assistantMessage("Hello!")

        // ツールコールレスポンスをテスト
        askLLM withInput "Solve task" outputs assistantMessage(CreateTool, CreateTool.Args("solve"))
    }
    ```
    <!--- KNIT example-testing-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-05.java -->

上記の例は、以下の動作をテストする方法を示しています。
1. LLMノードが入力として `Hello` を受け取ると、単純なテキストメッセージで応答します。
2. `Solve task` を受け取ると、ツールコールで応答します。

#### ツール実行ノードのテスト

ツールを実行するノードもテストできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    object SolveTool : SimpleTool<SolveTool.Args>(
        argsType = typeToken<Args>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("Message from the agent")
            val message: String
        )
        override suspend fun execute(args: Args): String {
            return args.message
        }
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 特定の引数でのツール実行をテスト
        callTool withInput ToolCalls(listOf(toolCallMessagePart(
            SolveTool,
            SolveTool.Args("solve")
        ))) outputs ReceivedToolResults(listOf(toolResult(SolveTool, SolveTool.Args("solve"), "solved")))
    }
    ```
    <!--- KNIT example-testing-07.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-06.java -->

これは、ツール実行ノードが特定のツールコールシグネチャを受け取ったときに、期待されるツールの結果を生成することを検証します。

#### 高度なノードテスト

より複雑なシナリオでは、構造化された入力と出力を持つノードをテストできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.ext.tool.AskUser
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    import ai.koog.agents.core.tools.annotations.LLMDescription
    object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
        argsType = typeToken<Args>(),
        resultType = typeToken<String>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            @property:LLMDescription("Message from the agent")
            val query: String,
            val depth: Int
        )
        override suspend fun execute(args: Args): String = args.query
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 同じノードへの異なる入力でのテスト
        askLLM withInput "Simple query" outputs assistantMessage("Simple response")

        // 複雑なパラメータでのテスト
        askLLM withInput "Complex query with parameters" outputs assistantMessage(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3)
        )
    }
    ```
    <!--- KNIT example-testing-08.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-07.java -->

詳細な結果構造を持つ複雑なツールコールシナリオをテストすることもできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    object AnalyzeTool : Tool<AnalyzeTool.Args, AnalyzeTool.Result>(
        argsType = typeToken<Args>(),
        resultType = typeToken<Result>(),
        name = "message",
        description = "Service tool, used by the agent to talk with user"
    ) {
        @Serializable
        data class Args(
            val query: String,
            val depth: Int
        )
        @Serializable
        data class Result(
            val analysis: String,
            val confidence: Double,
            val metadata: Map<String, String> = mapOf()
        )
        override suspend fun execute(args: Args): Result {
            return Result(
                args.query, 0.95,
                mapOf("source" to "mock", "timestamp" to "2023-06-15")
            )
        }
    }
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertNodes {
        // 構造化された結果を持つ複雑なツールコールをテスト
        callTool withInput ToolCalls(listOf(toolCallMessagePart(
            AnalyzeTool,
            AnalyzeTool.Args(query = "complex", depth = 5)
        ))) outputs ReceivedToolResults(listOf(toolResult(AnalyzeTool, AnalyzeTool.Args(query = "complex", depth = 5), AnalyzeTool.Result(
            analysis = "Detailed analysis",
            confidence = 0.95,
            metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
        ))))
    }
    ```
    <!--- KNIT example-testing-09.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-08.java -->

これらの高度なテストは、ノードが複雑なデータ構造を正しく処理することを確認するのに役立ちます。これは、洗練されたエージェントの動作にとって不可欠です。

### エッジ接続のテスト

エッジ接続テストでは、エージェントのグラフが、あるノードからの出力を適切な次のノードに正しくルーティングすることを検証できます。これにより、エージェントが異なる出力に基づいて、意図したワークフローパスに従うことが保証されます。

#### 基本的なエッジテスト

単純なエッジ接続テストから始めます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.core.tools.*
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting03.CreateTool
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolCallMessagePart
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    import kotlinx.serialization.KSerializer
    import kotlinx.serialization.Serializable
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val giveFeedback = assertNodeByName<String, Message.Assistant>("giveFeedback")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // テキストメッセージのルーティングをテスト
        askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

        // ツールコールのルーティングをテスト
        askLLM withOutput assistantMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
    }
    ```
    <!--- KNIT example-testing-10.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-09.java -->

この例では、以下の動作を検証します。
1. LLMノードが単純なテキストメッセージを出力すると、フローは `giveFeedback` ノードに向けられます。
2. ツールコールを出力すると、フローは `callTool` ノードに向けられます。

#### 条件付きルーティングのテスト

出力の内容に基づいて、より複雑なルーティングロジックをテストできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.environment.ReceivedToolResult
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.assistantMessage
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val askForInfo = assertNodeByName<String, ReceivedToolResult>("askForInfo")
                    val processRequest = assertNodeByName<String, Message.Assistant>("processRequest")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 異なるテキストレスポンスが異なるノードにルーティングされることをテスト
        askLLM withOutput assistantMessage("Need more information") goesTo askForInfo
        askLLM withOutput assistantMessage("Ready to proceed") goesTo processRequest
    }
    ```
    <!--- KNIT example-testing-11.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-10.java -->

#### 高度なエッジテスト

高度なエージェントの場合、ツール結果内の構造化されたデータに基づいた条件付きルーティングをテストできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting09.AnalyzeTool
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val processResult = assertNodeByName<String, Message.Assistant>("processResult")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // ツール結果の内容に基づいたルーティングをテスト
        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
        ))) goesTo processResult
    }
    ```
    <!--- KNIT example-testing-12.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-11.java -->

また、異なる結果プロパティに基づいた複雑な判断パスをテストすることもできます。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.dsl.extension.ReceivedToolResults
    import ai.koog.agents.core.dsl.extension.ToolCalls
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.example.exampleTesting09.AnalyzeTool
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.agents.testing.feature.toolResult
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.message.Message
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
            testGraph<String, String>("test") {
                assertNodes {
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val finish = assertNodeByName<String, Message.Assistant>("finish")
                    val verifyResult = assertNodeByName<String, Message.Assistant>("verifyResult")
    -->
    <!--- SUFFIX
                }
            }
        }
    }
    -->
    ```kotlin
    assertEdges {
        // 信頼度レベルに基づいて異なるノードにルーティング
        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Complete", confidence = 0.9)
        ))) goesTo finish

        callTool withOutput ReceivedToolResults(listOf(toolResult(
            AnalyzeTool,
            AnalyzeTool.Args(query = "parameters", depth = 3),
            AnalyzeTool.Result(analysis = "Uncertain", confidence = 0.3)
        ))) goesTo verifyResult
    }
    ```
    <!--- KNIT example-testing-13.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-12.java -->

これらの高度なエッジテストは、ノード出力の内容と構造に基づいてエージェントが正しい判断を下すことを保証するのに役立ちます。これは、インテリジェントでコンテキストを認識するワークフローを作成するために不可欠です。

## 完全なテスト例

以下は、完全なテストシナリオを示すユーザーストーリーです。

あなたは、テキストのトーン（語調）を分析し、フィードバックを提供するトーン分析エージェントを開発しています。このエージェントは、ポジティブ、ネガティブ、およびニュートラルなトーンを検出するためのツールを使用します。

このエージェントをテストする方法は以下の通りです。

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    @Test
    fun testToneAgent() = runTest {
        // ツールコールを追跡するためのリストを作成
        var toolCalls = mutableListOf<String>()
        var result: String? = null

        // ツールレジストリを作成
        val toolRegistry = ToolRegistry {
            // このタイプのエージェントに必要な特別なツール
            tool(SayToUser)

            with(ToneTools) {
                tools()
            }
        }

        // イベントハンドラーを作成
        val eventHandler = EventHandler {
            onToolCallStarting { tool, args ->
                println("[DEBUG_LOG] Tool called: tool ${tool.name}, args $args")
                toolCalls.add(tool.name)
            }

            handleError {
                println("[DEBUG_LOG] An error occurred: ${it.message}
${it.stackTraceToString()}")
                true
            }

            handleResult {
                println("[DEBUG_LOG] Result: $it")
                result = it
            }
        }

        val positiveText = "I love this product!"
        val negativeText = "Awful service, hate the app."
        val defaultText = "I don't know how to answer this question."

        val positiveResponse = "The text has a positive tone."
        val negativeResponse = "The text has a negative tone."
        val neutralResponse = "The text has a neutral tone."

        val mockLLMApi = getMockExecutor(toolRegistry, eventHandler) {
            // 異なる入力テキストに対するLLMレスポンスを設定
            mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
            mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
            mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

            // ツールが結果を返したときに、LLMがツールのレスポンスだけで応答する動作をモック化
            mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
            mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
            mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

            mockLLMAnswer(defaultText).asDefaultResponse

            // ツールのモック
            mockTool(PositiveToneTool) alwaysTells {
                toolCalls += "Positive tone tool called"
                positiveResponse
            }
            mockTool(NegativeToneTool) alwaysTells {
                toolCalls += "Negative tone tool called"
                negativeResponse
            }
            mockTool(NeutralToneTool) alwaysTells {
                toolCalls += "Neutral tone tool called"
                neutralResponse
            }
        }

        // ストラテジーを作成
        val strategy = toneStrategy("tone_analysis")

        // エージェント設定を作成
        val agentConfig = AIAgentConfig(
            prompt = prompt("test-agent") {
                system(
                    """
                    You are an question answering agent with access to the tone analysis tools.
                    You need to answer 1 question with the best of your ability.
                    Be as concise as possible in your answers.
                    DO NOT ANSWER ANY QUESTIONS THAT ARE BESIDES PERFORMING TONE ANALYSIS!
                    DO NOT HALLUCINATE!
                """.trimIndent()
                )
            },
            model = mockk<LLModel>(relaxed = true),
            maxAgentIterations = 10
        )

        // テストを有効にしてエージェントを作成
        val agent = AIAgent(
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            strategy = strategy,
            eventHandler = eventHandler,
            agentConfig = agentConfig,
        ) {
            withTesting()
        }

        // ポジティブなテキストをテスト
        agent.run(positiveText)
        assertEquals("The text has a positive tone.", result, "Positive tone result should match")
        assertEquals(1, toolCalls.size, "One tool is expected to be called")

        // ネガティブなテキストをテスト
        agent.run(negativeText)
        assertEquals("The text has a negative tone.", result, "Negative tone result should match")
        assertEquals(2, toolCalls.size, "Two tools are expected to be called")

        // ニュートラルなテキストをテスト
        agent.run(defaultText)
        assertEquals("The text has a neutral tone.", result, "Neutral tone result should match")
        assertEquals(3, toolCalls.size, "Three tools are expected to be called")
    }
    ```
    <!--- KNIT example-testing-14.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-13.java -->

複数のサブグラフを持つより複雑なエージェントの場合、グラフ構造をテストすることもできます。

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    @Test
    fun testMultiSubgraphAgentStructure() = runTest {
        val strategy = strategy("test") {
            val firstSubgraph by subgraph(
                "first",
                tools = listOf(DummyTool, CreateTool, SolveTool)
            ) {
                val callLLM by nodeLLMRequest(allowToolCalls = false)
                val executeTool by nodeExecuteTools()
                val sendToolResult by nodeLLMSendToolResults()
                val giveFeedback by node<String, String> { input ->
                    llm.writeSession {
                        appendPrompt {
                            user("Call tools! Don't chat!")
                        }
                    }
                    input
                }

                edge(nodeStart forwardTo callLLM)
                edge(callLLM forwardTo executeTool onToolCalls { true })
                edge(callLLM forwardTo giveFeedback onTextMessage { true })
                edge(giveFeedback forwardTo giveFeedback transformed { it })
                edge(executeTool forwardTo nodeFinish transformed { it.toolResults.first().output })
            }

            val secondSubgraph by subgraph<String, String>("second") {
                edge(nodeStart forwardTo nodeFinish)
            }

            edge(nodeStart forwardTo firstSubgraph)
            edge(firstSubgraph forwardTo secondSubgraph)
            edge(secondSubgraph forwardTo nodeFinish)
        }

        val toolRegistry = ToolRegistry {
            tool(DummyTool)
            tool(CreateTool)
            tool(SolveTool)
        }

        val mockLLMApi = getMockExecutor(toolRegistry) {
            mockLLMAnswer("Hello!") onRequestContains "Hello"
            mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"
        }

        val basePrompt = prompt("test") {}

        AIAgent(
            toolRegistry = toolRegistry,
            strategy = strategy,
            eventHandler = EventHandler {},
            agentConfig = AIAgentConfig(prompt = basePrompt, model = OpenAIModels.Chat.GPT4o, maxAgentIterations = 100),
            promptExecutor = mockLLMApi,
        ) {
            testGraph("test") {
                val firstSubgraph = assertSubgraphByName<String, String>("first")
                val secondSubgraph = assertSubgraphByName<String, String>("second")

                assertEdges {
                    startNode() alwaysGoesTo firstSubgraph
                    firstSubgraph alwaysGoesTo secondSubgraph
                    secondSubgraph alwaysGoesTo finishNode()
                }

                verifySubgraph(firstSubgraph) {
                    val start = startNode()
                    val finish = finishNode()

                    val askLLM = assertNodeByName<String, Message.Assistant>("callLLM")
                    val callTool = assertNodeByName<ToolCalls, ReceivedToolResults>("executeTool")
                    val giveFeedback = assertNodeByName<Any?, Any?>("giveFeedback")

                    assertReachable(start, askLLM)
                    assertReachable(askLLM, callTool)

                    assertNodes {
                        askLLM withInput "Hello" outputs assistantMessage("Hello!")
                        askLLM withInput "Solve task" outputs assistantMessage(CreateTool, CreateTool.Args("solve"))

                        callTool withInput ToolCalls(listOf(toolCallMessagePart(
                            SolveTool,
                            SolveTool.Args("solve")
                        ))) outputs ReceivedToolResults(listOf(toolResult(SolveTool, SolveTool.Args("solve"), "solved")))

                        callTool withInput ToolCalls(listOf(toolCallMessagePart(
                            CreateTool,
                            CreateTool.Args("solve")
                        ))) outputs ReceivedToolResults(listOf(toolResult(CreateTool, CreateTool.Args("solve"), "created")))
                    }

                    assertEdges {
                        askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback
                        askLLM withOutput assistantMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
                    }
                }
            }
        }
    }
    ```
    <!--- KNIT example-testing-15.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-14.java -->

## APIリファレンス

テスト機能に関する完全なAPIリファレンスについては、[agents-test](api:agents-test::)モジュールのリファレンスドキュメントを参照してください。

## FAQとトラブルシューティング

#### 特定のツールレスポンスをモック化するにはどうすればよいですか？

`MockLLMBuilder` の `mockTool` メソッドを使用します。

=== "Kotlin"

    <!--- INCLUDE
    /*
    -->
    <!--- SUFFIX
    */
    -->
    ```kotlin
    val mockExecutor = getMockExecutor {
        mockTool(myTool) alwaysReturns myResult

        // または条件付き
        mockTool(myTool) returns myResult onArguments myArgs
    }
    ```
    <!--- KNIT example-testing-16.kt -->

=== "Java"

    <!--- INCLUDE
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-15.java -->

#### 複雑なグラフ構造をテストするにはどうすればよいですか？

サブグラフのアサーション、`verifySubgraph`、およびノード参照を使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleTesting03.mockLLMApi
    import ai.koog.agents.example.exampleTesting02.toolRegistry
    import ai.koog.agents.testing.feature.testGraph
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    val llmModel = OpenAIModels.Chat.GPT4o
    fun main() {
        AIAgent(
            // コンストラクタ引数
            promptExecutor = mockLLMApi,
            toolRegistry = toolRegistry,
            llmModel = llmModel
        ) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```kotlin
    testGraph<Unit, String>("test") {
        val mySubgraph = assertSubgraphByName<Unit, String>("mySubgraph")

        verifySubgraph(mySubgraph) {
            // ノードへの参照を取得
            val nodeA = assertNodeByName<Unit, String>("nodeA")
            val nodeB = assertNodeByName<String, String>("nodeB")

            // 到達可能性をアサート
            assertReachable(nodeA, nodeB)

            // エッジ接続をアサート
            assertEdges {
                nodeA.withOutput("result") goesTo nodeB
            }
        }
    }
    ```
    <!--- KNIT example-testing-17.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-testing-java-16.java -->

#### 入力に基づいて異なるLLMレスポンスをシミュレートするにはどうすればよいですか？

パターンマッチングメソッドを使用します。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.testing.tools.getMockExecutor
    val promptExecutor = 
    -->
    ```kotlin
    getMockExecutor {
        mockLLMAnswer("Response A") onRequestContains "topic A"
        mockLLMAnswer("Response B") onRequestContains "topic B"
        mockLLMAnswer("Exact response") onRequestEquals "exact question"
        mockLLMAnswer("Conditional response") onCondition { it.contains("keyword") && it.length > 10 }
    }
    ```
    <!--- KNIT example-testing-18.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    import ai.koog.agents.testing.tools.MockExecutor;
    import ai.koog.prompt.executor.model.PromptExecutor;

    PromptExecutor promptExecutor = MockExecutor.builder()
        .mockLLMAnswer("Response A").onRequestContains("topic A")
        .mockLLMAnswer("Response B").onRequestContains("topic B")
        .mockLLMAnswer("Exact response").onRequestEquals("exact question")
        .mockLLMAnswer("Conditional response").onCondition(s -> s.contains("keyword") && s.length() > 10)
        .build();
    ```
    <!--- KNIT example-testing-java-17.java -->

### トラブルシューティング

#### モックエグゼキューターが常にデフォルトレスポンスを返す

パターンマッチングが正しいか確認してください。パターンは大文字と小文字を区別し、指定された通りに正確に一致する必要があります。

#### ツールコールがインターセプトされない

以下を確認してください：

1. ツールレジストリが適切にセットアップされていること。
2. ツール名が正確に一致していること。
3. ツールの操作が正しく設定されていること。

#### グラフのアサーションが失敗する

1. ノード名が正しいことを確認してください。
2. グラフ構造が期待通りであることを確認してください。
3. `startNode()` および `finishNode()` メソッドを使用して、正しい開始点と終了点を取得してください。