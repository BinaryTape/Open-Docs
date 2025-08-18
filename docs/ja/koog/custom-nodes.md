# カスタムノードの実装

このページでは、Koogフレームワークで独自のカスタムノードを実装する方法について、詳細な手順を説明します。カスタムノードを使用すると、特定の操作を実行する再利用可能なコンポーネントを作成することで、エージェントワークフローの機能を拡張できます。

グラフノードとは何か、その使用方法、および既存のデフォルトノードについて詳しく知るには、「[グラフノード](nodes-and-components.md)」を参照してください。

## ノードアーキテクチャの概要

実装の詳細に入る前に、Koogフレームワークにおけるノードのアーキテクチャを理解することが重要です。ノードはエージェントワークフローの基本的な構成要素であり、各ノードはワークフロー内の特定の操作または変換を表します。ノードはエッジを使用して接続され、エッジはノード間の実行フローを定義します。

各ノードには、入力を受け取り、出力を生成する`execute`メソッドがあり、その出力はワークフロー内の次のノードに渡されます。

## カスタムノードの実装

カスタムノードの実装は、入力データに対して基本的なロジックを実行し出力を返すシンプルなものから、パラメーターを受け入れ、実行間で状態を維持するより複雑なものまで多岐にわたります。

### 基本的なノードの実装

グラフにカスタムノードを実装し、独自のカスタムロジックを定義する最も簡単な方法は、次のパターンを使用することです。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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
    // Processing
    returnValue
}
```
<!--- KNIT example-custom-nodes-01.kt -->

上記のコードは、事前に定義された`Input`型と`Output`型を持つカスタムノード`myNode`を表しており、オプションの名前文字列パラメーター（`node_name`）があります。実際の例では、文字列入力を受け取り、その入力の長さを返すシンプルなノードを次に示します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val str = strategy<String, Int>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val myNode by node<String, Int>("node_name") { input ->
    // Processing
    input.length
}
```
<!--- KNIT example-custom-nodes-02.kt -->

カスタムノードを作成するもう1つの方法は、`node`関数を呼び出す`AIAgentSubgraphBuilderBase`の拡張関数を定義することです。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy

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
    // Custom logic
    input // Return the input as output (pass-through)
}

val myCustomNode by myCustomNode("node_name")
```
<!--- KNIT example-custom-nodes-03.kt -->

これにより、カスタムロジックを実行するが、入力を変更せずにそのまま出力として返すパススルーノードが作成されます。

### 追加引数を持つノード

動作をカスタマイズするための引数を受け入れるノードを作成できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy

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
    // Use arg1 and arg2 in your custom logic
    input // Return the input as the output
}

val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
```
<!--- KNIT example-custom-nodes-04.kt -->

### パラメーター化されたノード

入力と出力のパラメーターを持つノードを定義できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy
-->

```kotlin
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
    name: String? = null,
): AIAgentNodeDelegate<T, T> = node(name) { input ->
    // Do some additional actions
    // Return the input as the output
    input
}

val strategy = strategy<String, String>("strategy_name") {
    val myCustomNode by myParameterizedNode<String>("node_name")
}
```
<!--- KNIT example-custom-nodes-05.kt -->

### ステートフルなノード

ノードが実行間で状態を維持する必要がある場合は、クロージャ変数を使用できます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase

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
        println("Node executed $counter times")
        input
    }
}
```
<!--- KNIT example-custom-nodes-06.kt -->

## ノードの入力と出力の型

ノードは異なる入力型と出力型を持つことができ、これらは総称パラメーターとして指定されます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val stringToIntNode by node<String, Int>("node_name") { input: String ->
    // Processing
    input.toInt() // Convert string to integer
}
```
<!--- KNIT example-custom-nodes-07.kt -->

!!! note
    入力と出力の型は、ノードがワークフロー内の他のノードとどのように接続できるかを決定します。ノードは、ソースノードの出力型がターゲットノードの入力型と互換性がある場合にのみ接続できます。

## ベストプラクティス

カスタムノードを実装する際は、以下のベストプラクティスに従ってください。

1.  **ノードの焦点を絞る**: 各ノードは単一の明確に定義された操作を実行する。
2.  **分かりやすい名前を使用する**: ノード名はその目的を明確に示すべきである。
3.  **パラメーターを文書化する**: すべてのパラメーターについて明確なドキュメントを提供する。
4.  **エラーを適切に処理する**: ワークフローの失敗を防ぐために、適切なエラー処理を実装する。
5.  **ノードを再利用可能にする**: さまざまなワークフローで再利用できるようにノードを設計する。
6.  **型パラメーターを使用する**: 適切な場合はジェネリック型パラメーターを使用して、ノードをより柔軟にする。
7.  **デフォルト値を提供する**: 可能な場合は、パラメーターに適切なデフォルト値を提供する。

## 一般的なパターン

以下のセクションでは、カスタムノードを実装するための一般的なパターンをいくつか紹介します。

### パススルーノード

操作を実行するが、入力をそのまま出力として返すノード。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin

val loggingNode by node<String, String>("node_name") { input ->
    println("Processing input: $input")
    input // Return the input as the output
}
```
<!--- KNIT example-custom-nodes-08.kt -->

### 変換ノード

入力を異なる出力に変換するノード。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val upperCaseNode by node<String, String>("node_name") { input ->
    println("Processing input: $input")
    input.uppercase() // Transform the input to uppercase
}
```
<!--- KNIT example-custom-nodes-09.kt -->

### LLMインタラクションノード

LLMと対話するノード。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val summarizeTextNode by node<String, String>("node_name") { input ->
    llm.writeSession {
        updatePrompt {
            user("Please summarize the following text: $input")
        }

        val response = requestLLMWithoutTools()
        response.content
    }
}
```
<!--- KNIT example-custom-nodes-10.kt -->

### ツール実行ノード

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.environment.executeTool
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.ResponseMetaInfo
import kotlinx.datetime.Clock
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
        metaInfo = ResponseMetaInfo.create(Clock.System),
        content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // Use the input as tool arguments
    )

    val result = environment.executeTool(toolCall)
    result.content
}
```
<!--- KNIT example-custom-nodes-11.kt -->