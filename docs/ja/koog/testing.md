# テスト

## 概要

KoogフレームワークにおけるAIエージェントのパイプライン、サブグラフ、およびツール連携をテストするための包括的なフレームワークを提供します。これにより、開発者はモックLLM（大規模言語モデル）エグゼキューター、ツールレジストリ、およびエージェント環境を備えた、制御されたテスト環境を構築できます。

### 目的

この機能の主な目的は、以下の方法でエージェントベースのAI機能のテストを容易にすることです。

- 特定のプロンプトに対するLLM応答のモック
- ツール呼び出しとその結果のシミュレーション
- エージェントパイプラインのサブグラフとその構造のテスト
- エージェントノードを介したデータの正しいフローの検証
- 期待される動作に対するアサーションの提供

## 設定と初期化

### テスト依存関係の設定

テスト環境を設定する前に、以下の依存関係を追加していることを確認してください。
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
### LLM応答のモック

テストの基本的な形式は、決定論的な動作を保証するためにLLM応答をモックすることです。これは `MockLLMBuilder` および関連ユーティリティを使用して行うことができます。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.testing.tools.getMockExecutor

val toolRegistry = ToolRegistry {}

-->
```kotlin
// モックLLMエグゼキューターを作成
val mockLLMApi = getMockExecutor(toolRegistry) {
  // シンプルなテキスト応答をモックする
  mockLLMAnswer("Hello!") onRequestContains "Hello"

  // デフォルト応答をモックする
  mockLLMAnswer("I don't know how to answer that.").asDefaultResponse
}
```
<!--- KNIT example-testing-02.kt -->

### ツール呼び出しのモック

入力パターンに基づいて、LLMが特定のツールを呼び出すようにモックできます。
<!--- INCLUDE
import ai.koog.agents.core.tools.*
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.agents.testing.tools.getMockExecutor
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

public object CreateTool : Tool<CreateTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
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
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
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
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
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
// ツール呼び出しの応答をモックする
mockLLMToolCall(CreateTool, CreateTool.Args("solve")) onRequestEquals "Solve task"

// ツールの動作をモックする - ラムダなしの最もシンプルな形式
mockTool(PositiveToneTool) alwaysReturns "The text has a positive tone."

// 追加のアクションを実行する必要がある場合はラムダを使用する
mockTool(NegativeToneTool) alwaysTells {
  // 追加のアクションを実行する
  println("Negative tone tool called")

  // 結果を返す
  "The text has a negative tone."
}

// 特定の引数に基づいたツールの動作をモックする
mockTool(AnalyzeTool) returns "Detailed analysis" onArguments AnalyzeTool.Args("analyze deeply")

// 条件付き引数マッチングによるツールの動作をモックする
mockTool(SearchTool) returns "Found results" onArgumentsMatching { args ->
  args.query.contains("important")
}
```
<!--- KNIT example-testing-03.kt -->

上記の例は、シンプルなものからより複雑なものまで、ツールをモックするさまざまな方法を示しています。

1.  `alwaysReturns`: ラムダなしで値を直接返す最もシンプルな形式。
2.  `alwaysTells`: 追加のアクションを実行する必要がある場合にラムダを使用します。
3.  `returns...onArguments`: 正確な引数の一致に対して特定の値を返します。
4.  `returns...onArgumentsMatching`: カスタム引数条件に基づいて結果を返します。

### テストモードの有効化

エージェントでテストモードを有効にするには、`AIAgent` コンストラクタブロック内で `withTesting()` 関数を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.withTesting
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

// Create the agent with testing enabled
fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// テストが有効なエージェントを作成
AIAgent(
    promptExecutor = mockLLMApi,
    toolRegistry = toolRegistry,
    llmModel = llmModel
) {
    // テストモードを有効にする
    withTesting()
}
```
<!--- KNIT example-testing-04.kt -->

## 高度なテスト

### グラフ構造のテスト

詳細なノードの動作とエッジ接続をテストする前に、エージェントのグラフ全体の構造を検証することが重要です。これには、必要なすべてのノードが存在し、期待されるサブグラフ内で適切に接続されていることを確認することが含まれます。

テスト機能は、エージェントのグラフ構造をテストするための包括的な方法を提供します。このアプローチは、複数のサブグラフと相互接続されたノードを持つ複雑なエージェントにとって特に価値があります。

#### 基本的な構造テスト

まず、エージェントのグラフの基本的な構造を検証します。

<!--- INCLUDE

import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
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

        // サブグラフの接続をアサートする
        assertEdges {
            startNode() alwaysGoesTo firstSubgraph
            firstSubgraph alwaysGoesTo secondSubgraph
            secondSubgraph alwaysGoesTo finishNode()
        }

        // 最初のサブグラフを検証する
        verifySubgraph(firstSubgraph) {
            val start = startNode()
            val finish = finishNode()

            // 名前でノードをアサートする
            val askLLM = assertNodeByName<String, Message.Response>("callLLM")
            val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")

            // ノードの到達可能性をアサートする
            assertReachable(start, askLLM)
            assertReachable(askLLM, callTool)
        }
    }
}
```
<!--- KNIT example-testing-05.kt -->

### ノードの動作テスト

ノードの動作テストでは、エージェントのグラフ内のノードが、与えられた入力に対して期待される出力を生成することを確認できます。これは、エージェントのロジックがさまざまなシナリオで正しく機能することを保証するために不可欠です。

#### 基本的なノードテスト

個々のノードに対するシンプルな入力と出力の検証から始めます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {

    // 基本的なテキスト応答をテストする
    askLLM withInput "Hello" outputs assistantMessage("Hello!")

    // ツール呼び出しの応答をテストする
    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))
}
```
<!--- KNIT example-testing-06.kt -->

上記の例は、以下の動作をテストする方法を示しています。
1.  LLMノードが入力として `Hello` を受け取ると、シンプルなテキストメッセージで応答します。
2.  `Solve task` を受け取ると、ツール呼び出しで応答します。

#### ツール実行ノードのテスト

ツールを実行するノードもテストできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import ai.koog.agents.core.tools.annotations.LLMDescription

object SolveTool : SimpleTool<SolveTool.Args>(
    argsSerializer = Args.serializer(),
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
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
    
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 特定の引数でツール実行をテストする
    callTool withInput toolCallMessage(
        SolveTool,
        SolveTool.Args("solve")
    ) outputs toolResult(SolveTool, SolveTool.Args("solve"), "solved")
}
```
<!--- KNIT example-testing-07.kt -->

これにより、ツール実行ノードが特定のツール呼び出しシグネチャを受け取ったときに、期待されるツール結果を生成することを確認できます。

#### 高度なノードテスト

より複雑なシナリオでは、構造化された入力と出力を持つノードをテストできます。
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.serializer
import ai.koog.agents.core.tools.annotations.LLMDescription

object AnalyzeTool : Tool<AnalyzeTool.Args, String>(
    argsSerializer = Args.serializer(),
    resultSerializer = String.serializer(),
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
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 同じノードに対する異なる入力でテストする
    askLLM withInput "Simple query" outputs assistantMessage("Simple response")

    // 複雑なパラメータでテストする
    askLLM withInput "Complex query with parameters" outputs toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3)
    )
}
```
<!--- KNIT example-testing-08.kt -->

また、詳細な結果構造を持つ複雑なツール呼び出しシナリオをテストすることもできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

object AnalyzeTool : Tool<AnalyzeTool.Args, AnalyzeTool.Result>(
    argsSerializer = Args.serializer(),
    resultSerializer = Result.serializer(),
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
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertNodes {
    // 構造化された結果を持つ複雑なツール呼び出しをテストする
    callTool withInput toolCallMessage(
        AnalyzeTool,
        AnalyzeTool.Args(query = "complex", depth = 5)
    ) outputs toolResult(AnalyzeTool, AnalyzeTool.Args(query = "complex", depth = 5), AnalyzeTool.Result(
        analysis = "Detailed analysis",
        confidence = 0.95,
        metadata = mapOf("source" to "database", "timestamp" to "2023-06-15")
    ))
}
```
<!--- KNIT example-testing-09.kt -->

これらの高度なテストは、ノードが複雑なデータ構造を正しく処理することを確認するのに役立ち、これは洗練されたエージェントの動作にとって不可欠です。

### エッジ接続のテスト

エッジ接続のテストにより、エージェントのグラフが、あるノードからの出力を適切な次のノードに正しくルーティングすることを確認できます。これにより、エージェントがさまざまな出力に基づいて意図したワークフローパスをたどることが保証されます。

#### 基本的なエッジテスト

シンプルなエッジ接続テストから始めます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.core.tools.*
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting03.CreateTool
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolCallMessage
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val giveFeedback = assertNodeByName<String, Message.Response>("giveFeedback")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // テキストメッセージのルーティングをテストする
    askLLM withOutput assistantMessage("Hello!") goesTo giveFeedback

    // ツール呼び出しのルーティングをテストする
    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
}
```
<!--- KNIT example-testing-10.kt -->

この例は、以下の動作を確認します。
1.  LLMノードがシンプルなテキストメッセージを出力すると、フローは `giveFeedback` ノードに転送されます。
2.  ツール呼び出しを出力すると、フローは `callTool` ノードに転送されます。

#### 条件付きルーティングのテスト

出力の内容に基づいて、より複雑なルーティングロジックをテストできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.assistantMessage
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val askForInfo = assertNodeByName<String, ReceivedToolResult>("askForInfo")
                val processRequest = assertNodeByName<String, Message.Response>("processRequest")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 異なるテキスト応答は異なるノードにルーティングされる
    askLLM withOutput assistantMessage("Need more information") goesTo askForInfo
    askLLM withOutput assistantMessage("Ready to proceed") goesTo processRequest
}
```
<!--- KNIT example-testing-11.kt -->

#### 高度なエッジテスト

洗練されたエージェントの場合、ツール結果の構造化データに基づいて条件付きルーティングをテストできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val processResult = assertNodeByName<String, Message.Response>("processResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // ツール結果の内容に基づいたルーティングをテストする
    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Needs more processing", confidence = 0.5)
    ) goesTo processResult
}
```
<!--- KNIT example-testing-12.kt -->

また、さまざまな結果プロパティに基づいて複雑な意思決定パスをテストすることもできます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.environment.ReceivedToolResult
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.example.exampleTesting09.AnalyzeTool
import ai.koog.agents.testing.feature.testGraph
import ai.koog.agents.testing.feature.toolResult
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.message.Message

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {

    AIAgent(
        // Constructor arguments
        promptExecutor = mockLLMApi,
        toolRegistry = toolRegistry,
        llmModel = llmModel
    ) {
        testGraph<String, String>("test") {
            assertNodes {
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val finish = assertNodeByName<String, Message.Response>("finish")
                val verifyResult = assertNodeByName<String, Message.Response>("verifyResult")
-->
<!--- SUFFIX
            }
        }
    }
}
-->
```kotlin
assertEdges {
    // 信頼度レベルに基づいて異なるノードにルーティングする
    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Complete", confidence = 0.9)
    ) goesTo finish

    callTool withOutput toolResult(
        AnalyzeTool,
        AnalyzeTool.Args(query = "parameters", depth = 3),
        AnalyzeTool.Result(analysis = "Uncertain", confidence = 0.3)
    ) goesTo verifyResult
}
```
<!--- KNIT example-testing-13.kt -->

これらの高度なエッジテストは、エージェントがノード出力の内容と構造に基づいて正しい決定を行うことを保証するのに役立ち、これはインテリジェントでコンテキストを認識するワークフローを作成するために不可欠です。

## 完全なテスト例

以下に、完全なテストシナリオを示すユーザー事例を示します。

あなたは、テキストのトーンを分析し、フィードバックを提供するトーン分析エージェントを開発しています。このエージェントは、ポジティブ、ネガティブ、ニュートラルのトーンを検出するためのツールを使用します。

このエージェントをテストする方法を以下に示します。

<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
@Test
fun testToneAgent() = runTest {
    // ツール呼び出しを追跡するリストを作成
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

    // イベントハンドラを作成
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
        // 異なる入力テキストに対するLLM応答を設定
        mockLLMToolCall(NeutralToneTool, ToneTool.Args(defaultText)) onRequestEquals defaultText
        mockLLMToolCall(PositiveToneTool, ToneTool.Args(positiveText)) onRequestEquals positiveText
        mockLLMToolCall(NegativeToneTool, ToneTool.Args(negativeText)) onRequestEquals negativeText

        // ツールが結果を返した場合にLLMがツール応答のみで応答する動作をモック
        mockLLMAnswer(positiveResponse) onRequestContains positiveResponse
        mockLLMAnswer(negativeResponse) onRequestContains negativeResponse
        mockLLMAnswer(neutralResponse) onRequestContains neutralResponse

        mockLLMAnswer(defaultText).asDefaultResponse

        // ツールモック
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

    // テストが有効なエージェントを作成
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

複数のサブグラフを持つより複雑なエージェントの場合、グラフ構造をテストすることもできます。

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
            val executeTool by nodeExecuteTool()
            val sendToolResult by nodeLLMSendToolResult()
            val giveFeedback by node<String, String> { input ->
                llm.writeSession {
                    appendPrompt {
                        user("Call tools! Don't chat!")
                    }
                }
                input
            }

            edge(nodeStart forwardTo callLLM)
            edge(callLLM forwardTo executeTool onToolCall { true })
            edge(callLLM forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo giveFeedback onAssistantMessage { true })
            edge(giveFeedback forwardTo executeTool onToolCall { true })
            edge(executeTool forwardTo nodeFinish transformed { it.content })
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

                val askLLM = assertNodeByName<String, Message.Response>("callLLM")
                val callTool = assertNodeByName<Message.Tool.Call, ReceivedToolResult>("executeTool")
                val giveFeedback = assertNodeByName<Any?, Any?>("giveFeedback")

                assertReachable(start, askLLM)
                assertReachable(askLLM, callTool)

                assertNodes {
                    askLLM withInput "Hello" outputs Message.Assistant("Hello!")
                    askLLM withInput "Solve task" outputs toolCallMessage(CreateTool, CreateTool.Args("solve"))

                    callTool withInput toolCallSignature(
                        SolveTool,
                        SolveTool.Args("solve")
                    ) outputs toolResult(SolveTool, "solved")

                    callTool withInput toolCallSignature(
                        CreateTool,
                        CreateTool.Args("solve")
                    ) outputs toolResult(CreateTool, "created")
                }

                assertEdges {
                    askLLM withOutput Message.Assistant("Hello!") goesTo giveFeedback
                    askLLM withOutput toolCallMessage(CreateTool, CreateTool.Args("solve")) goesTo callTool
                }
            }
        }
    }
}
```
<!--- KNIT example-testing-15.kt -->

## APIリファレンス

テスト機能に関連する完全なAPIリファレンスについては、[agents-test](https://api.koog.ai/agents/agents-test/index.html)モジュールのリファレンスドキュメントを参照してください。

## よくある質問とトラブルシューティング

#### 特定のツール応答をモックするにはどうすればよいですか？

`MockLLMBuilder` の `mockTool` メソッドを使用します。
<!--- INCLUDE
/*
-->
<!--- SUFFIX
*/
-->
```kotlin
val mockExecutor = getMockExecutor {
    mockTool(myTool) alwaysReturns myResult

    // あるいは条件付きで
    mockTool(myTool) returns myResult onArguments myArgs
}
```
<!--- KNIT example-testing-16.kt -->

#### 複雑なグラフ構造をテストするにはどうすればよいですか？

サブグラフのアサーション、`verifySubgraph`、およびノード参照を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.example.exampleTesting02.mockLLMApi
import ai.koog.agents.example.exampleTesting02.toolRegistry
import ai.koog.agents.testing.feature.testGraph
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val llmModel = OpenAIModels.Chat.GPT4o

fun main() {
    AIAgent(
        // Constructor arguments
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

#### 入力に基づいて異なるLLM応答をシミュレートするにはどうすればよいですか？

パターンマッチングメソッドを使用します。

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

### トラブルシューティング

#### モックエグゼキューターが常にデフォルト応答を返す

パターンマッチングが正しいことを確認してください。パターンは大文字と小文字を区別し、指定されたとおりに正確に一致する必要があります。

#### ツール呼び出しが傍受されない

以下のことを確認してください。

1.  ツールレジストリが適切に設定されている。
2.  ツール名が正確に一致している。
3.  ツールアクションが正しく設定されている。

#### グラフアサーションが失敗する

1.  ノード名が正しいことを確認してください。
2.  グラフ構造が期待どおりであることを確認してください。
3.  `startNode()` および `finishNode()` メソッドを使用して、正しい開始点と終了点を取得してください。