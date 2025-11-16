## 概要

並行ノード実行により、複数のAIエージェントノードを同時に実行できるため、パフォーマンスが向上し、複雑なワークフローが可能になります。この機能は、特に以下のような場合に役立ちます。

- 同じ入力を異なるモデルやアプローチで同時に処理する場合
- 複数の独立した操作を並行して実行する場合
- 複数のソリューションを生成して比較する競合評価パターンを実装する場合

## 主要なコンポーネント

Koogにおける並行ノード実行は、以下のメソッドとデータ構造で構成されます。

### メソッド

- `parallel()`: 複数のノードを並行して実行し、その結果を収集します。

### データ構造

- `ParallelResult`: 並行ノード実行の完了した結果を表します。
- `NodeExecutionResult`: ノード実行の出力とコンテキストを含みます。

## 基本的な使い方

### ノードを並行して実行する

ノードの並行実行を開始するには、`parallel`メソッドを以下の形式で使用します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = Unit
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val firstNode by node<Input, Output>() { "first" }
   val secondNode by node<Input, Output>() { "second" }
   val thirdNode by node<Input, Output>() { "third" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeName by parallel<Input, Output>(
   firstNode, secondNode, thirdNode /* Add more nodes if needed */
) {
   // Merge strategy goes here, for example: 
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

以下は、3つのノードを並行して実行し、最大の長さを持つ結果を選択する実際の例です。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = Int

val strategy = strategy<String, String>("strategy_name") {
   val nodeCalcTokens by node<Input, Output>() { 1 }
   val nodeCalcSymbols by node<Input, Output>() { 2 }
   val nodeCalcWords by node<Input, Output>() { 3 }
-->
<!--- SUFFIX
}
-->
```kotlin
val calc by parallel<String, Int>(
   nodeCalcTokens, nodeCalcSymbols, nodeCalcWords,
) {
   selectByMax { it }
}
```
<!--- KNIT example-parallel-node-execution-02.kt -->

上記のコードは、`nodeCalcTokens`、`nodeCalcSymbols`、および`nodeCalcWords`ノードを並行して実行し、最大値を持つ結果を返します。

### マージ戦略

ノードを並行実行した後、結果をどのようにマージするかを指定する必要があります。Koogは以下のマージ戦略を提供します。

- `selectBy()`: 述語関数に基づいて結果を選択します。
- `selectByMax()`: 比較関数に基づいて最大値を持つ結果を選択します。
- `selectByIndex()`: 選択関数によって返されたインデックスに基づいて結果を選択します。
- `fold()`: 操作関数を使用して結果を単一の値に畳み込みます。

#### selectBy

述語関数に基づいて結果を選択します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeSelectJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectBy { it.contains("programmer") }
}
```
<!--- KNIT example-parallel-node-execution-03.kt -->

これは、「programmer」という単語を含む最初のジョークを選択します。

#### selectByMax

比較関数に基づいて最大値を持つ結果を選択します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeLongestJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-04.kt -->

これは、最大の長さを持つジョークを選択します。

#### selectByIndex

選択関数によって返されたインデックスに基づいて結果を選択します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.json.JsonStructure

typealias Input = String
typealias Output = String

data class JokeRating(
   val bestJokeIndex: Int,
)

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeBestJoke by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   selectByIndex { jokes ->
      // Use another LLM to determine the best joke
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedy critic. Select the best joke.")
            user("Here are three jokes: ${jokes.joinToString("
\n")}")
         }
         val response = requestLLMStructured<JokeRating>()
         response.getOrNull()!!.data.bestJokeIndex
      }
   }
}
```
<!--- KNIT example-parallel-node-execution-05.kt -->

これは、別のLLM呼び出しを使用して、最適なジョークのインデックスを決定します。

#### fold

操作関数を使用して結果を単一の値に畳み込みます。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

typealias Input = String
typealias Output = String

val strategy = strategy<String, String>("strategy_name") {
   val nodeOpenAI by node<Input, Output>() { "openai" }
   val nodeAnthropicSonnet by node<Input, Output>() { "sonnet" }
   val nodeAnthropicOpus by node<Input, Output>() { "opus" }
-->
<!--- SUFFIX
}
-->
```kotlin
val nodeAllJokes by parallel<String, String>(
   nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
) {
   fold("Jokes:
") { result, joke -> "$result
$joke" }
}
```
<!--- KNIT example-parallel-node-execution-06.kt -->

これは、すべてのジョークを単一の文字列に結合します。

## 例: 最適なジョークエージェント

以下は、並行実行を使用して異なるLLMモデルからジョークを生成し、最適なものを選択する完全な例です。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.anthropic.AnthropicModels
import ai.koog.prompt.executor.clients.openai.OpenAIModels

typealias Input = String
typealias Output = String

data class JokeRating(
   val bestJokeIndex: Int,
)
-->
```kotlin
val strategy = strategy("best-joke") {
   // Define nodes for different LLM models
   val nodeOpenAI by node<String, String> { topic ->
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   val nodeAnthropicSonnet by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Sonnet_3_5
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   val nodeAnthropicOpus by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Opus_3
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   // Execute joke generation in parallel and select the best joke
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // Another LLM (e.g., GPT4o) would find the funniest joke:
         llm.writeSession {
            model = OpenAIModels.Chat.GPT4o
            appendPrompt {
               prompt("best-joke-selector") {
                  system("You are a comedy critic. Give a critique for the given joke.")
                  user(
                     """
                            Here are three jokes about the same topic:

                            ${jokes.mapIndexed { index, joke -> "Joke $index:
$joke" }.joinToString("
\n")}

                            Select the best joke and explain why it's the best.
                            """.trimIndent()
                  )
               }
            }

            val response = requestLLMStructured<JokeRating>()
            val bestJoke = response.getOrNull()!!.data
            bestJoke.bestJokeIndex
         }
      }
   }

   // Connect the nodes
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## ベストプラクティス

1.  **リソースの制約を考慮する**: 特に複数のLLM API呼び出しを同時に行う場合、ノードを並行して実行する際のリソース使用量に注意してください。

2.  **コンテキスト管理**: 各並行実行は、フォークされたコンテキストを作成します。結果をマージする際には、どのコンテキストを保持するか、または異なる実行からのコンテキストをどのように結合するかを選択します。

3.  **ユースケースに合わせて最適化する**:
    - 競合評価（ジョークの例など）の場合、最適な結果を選択するために`selectByIndex`を使用します。
    - 最大値を見つける場合は、`selectByMax`を使用します。
    - 条件に基づいてフィルタリングする場合は、`selectBy`を使用します。
    - 集約の場合は、`fold`を使用してすべての結果を結合し、複合的な出力を作成します。

## パフォーマンスに関する考慮事項

並行実行はスループットを大幅に向上させることができますが、いくつかのオーバーヘッドを伴います。

- 各並行ノードは新しいコルーチンを作成します
- コンテキストのフォークとマージには、いくらかの計算コストがかかります
- 多数の並行実行では、リソース競合が発生する可能性があります

最適なパフォーマンスを得るには、以下のような操作を並列化してください。

- 互いに独立している
- 実行にかなりの時間がかかる
- 可変な状態を共有しない