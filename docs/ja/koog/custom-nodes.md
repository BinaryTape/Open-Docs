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

```kotlin
val myNode by node<Input, Output>("node_name") { input ->
    // Processing
    returnValue
}
```

上記のコードは、事前に定義された`Input`型と`Output`型を持つカスタムノード`myNode`を表しており、オプションの名前文字列パラメーター（`node_name`）があります。実際の例では、文字列入力を受け取り、その入力の長さを返すシンプルなノードを次に示します。

```kotlin
val myNode by node<String, Int>("node_name") { input ->
    // Processing
    input.length
}
```

カスタムノードを作成するもう1つの方法は、`node`関数を呼び出す`AIAgentSubgraphBuilder`の拡張関数を定義することです。

```kotlin
fun <T> AIAgentSubgraphBuilder<*, *>.myCustomNode(
    name: String? = null
): AIAgentNodeDelegateBase<T, T> = node(name) { input ->
    // Custom logic
    input // Return the input as output (pass-through)
}

val myCustomNode by myCustomNode("node_name")
```

これにより、カスタムロジックを実行するが、入力を変更せずにそのまま出力として返すパススルーノードが作成されます。

### パラメーター化されたノード

パラメーターを受け入れて動作をカスタマイズできるノードを作成できます。

```kotlin
fun <T> AIAgentSubgraphBuilder<*, *>.myParameterizedNode(
    name: String? = null,
    param1: String,
    param2: Int
): AIAgentNodeDelegateBase<T, T> = node(name) { input ->
    // Use param1 and param2 in your custom logic
    input // Return the input as the output
}

val myCustomNode by myParameterizedNode("node_name")
```

### ステートフルなノード

ノードが実行間で状態を維持する必要がある場合は、クロージャ変数を使用できます。

```kotlin
fun <T> AIAgentSubgraphBuilder<*, *>.myStatefulNode(
    name: String? = null
): AIAgentNodeDelegateBase<T, T> {
    var counter = 0

    return node(name) { input ->
        counter++
        println("Node executed $counter times")
        input
    }
}
```

## ノードの入力と出力の型

ノードは異なる入力型と出力型を持つことができ、これらは総称パラメーターとして指定されます。

```kotlin
val stringToIntNode by node<String, Int>("node_name") { input: String ->
    // Processing
    input.toInt() // Convert string to integer
}
```

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

```kotlin

val loggingNode by node<String, String>("node_name") { input ->
    println("Processing input: $input")
    input // Return the input as the output
}
```

### 変換ノード

入力を異なる出力に変換するノード。

```kotlin
val upperCaseNode by node<String, String>("node_name") { input ->
    println("Processing input: $input")
    input.uppercase() // Transform the input to uppercase
}
```

### LLMインタラクションノード

LLMと対話するノード。

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

### ツール実行ノード

```kotlin
val nodeExecuteCustomTool by node<String, String>("node_name") { input ->
    val toolCall = Message.Tool.Call(
        id = UUID.randomUUID().toString(),
        tool = toolName,
        args = mapOf("input" to input) // Use the input as tool arguments
    )

    val result = environment.executeTool(toolCall)
    result.content
}