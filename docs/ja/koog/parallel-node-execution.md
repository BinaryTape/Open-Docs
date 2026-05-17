## 概要

ノードの並列実行により、複数のAIエージェントノードを同時に実行できるようになり、パフォーマンスの向上と複雑なワークフローの実現が可能になります。この機能は、特に以下のような場合に役立ちます：

- 同じ入力を異なるモデルや手法で同時に処理する場合
- 複数の独立した操作を並列に実行する場合
- 複数のソリューションを生成して比較する、競争型の評価パターンを実装する場合

## 主要コンポーネント

Koogにおけるノードの並列実行は、以下のメソッドとデータ構造で構成されています。

### メソッド

- `parallel()`: 複数のノードを並列に実行し、その結果を収集します。

### データ構造

- `ParallelResult`: 並列ノード実行の完了した結果を表します。
- `NodeExecutionResult`: ノード実行の出力とコンテキストを含みます。

## 基本的な使い方

### ノードの並列実行

ノードの並列実行を開始するには、以下の形式で `parallel` メソッドを使用します：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

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
   firstNode, secondNode, thirdNode /* 必要に応じてノードを追加 */
) {
   // ここにマージ戦略を記述します。例： 
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

以下は、3つのノードを並列に実行し、最大長のテキストの結果を選択する実際の例です：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

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

上記のコードは、`nodeCalcTokens`、`nodeCalcSymbols`、および `nodeCalcWords` ノードを並列に実行し、最大値を持つ結果を返します。

### マージ戦略

ノードを並列に実行した後、結果をどのようにマージするかを指定する必要があります。Koogは以下のマージ戦略を提供しています：

- `selectBy()`: 述語関数（predicate function）に基づいて結果を選択します。
- `selectByMax()`: 比較関数に基づいて最大値を持つ結果を選択します。
- `selectByIndex()`: 選択関数から返されるインデックスに基づいて結果を選択します。
- `fold()`: 演算関数を使用して、結果を単一の値に畳み込みます。

#### selectBy

述語関数に基づいて結果を選択します：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

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

比較関数に基づいて最大値を持つ結果を選択します：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

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

これは、最大長のジョークを選択します。

#### selectByIndex

選択関数から返されるインデックスに基づいて結果を選択します：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel
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
      // 別のLLMを使用して最適なジョークを決定する
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

演算関数を使用して、結果を単一の値に畳み込みます：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel

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

これは、すべてのジョークを1つの文字列に結合します。

## 例：ベストジョークエージェント

以下は、並列実行を使用して異なるLLMモデルからジョークを生成し、最適なものを選択する完全な例です：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.agents.core.dsl.builder.parallel
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.message.MessagePart
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
   // 異なるLLMモデルのノードを定義する
   val nodeOpenAI by node<String, String> { topic ->
      llm.writeSession {
         model = OpenAIModels.Chat.GPT4o
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text }
      }
   }

   val nodeAnthropicSonnet by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Sonnet_4_5
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text }
      }
   }

   val nodeAnthropicOpus by node<String, String> { topic ->
      llm.writeSession {
         model = AnthropicModels.Opus_4_6
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text }
      }
   }

   // ジョーク生成を並列に実行し、最適なジョークを選択する
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // 別のLLM（例：GPT4o）が最も面白いジョークを見つける：
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

   // ノードを接続する
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## ベストプラクティス

1. **リソース制約の考慮**: ノードを並列に実行する場合、特に複数のLLM API呼び出しを同時に行う際は、リソースの使用量に注意してください。

2. **コンテキスト管理**: 各並列実行は、フォークされたコンテキストを作成します。結果をマージする際には、どのコンテキストを保持するか、あるいは異なる実行からのコンテキストをどのように組み合わせるかを選択してください。

3. **ユースケースに合わせた最適化**:
    - 競争型の評価（上記のジョークの例など）には、`selectByIndex` を使用して最適な結果を選択します。
    - 最大値を見つけるには、`selectByMax` を使用します。
    - 条件に基づいてフィルタリングするには、`selectBy` を使用します。
    - 集約には、`fold` を使用してすべての結果を複合的な出力に結合します。

## パフォーマンスに関する考慮事項

並列実行はスループットを大幅に向上させることができますが、いくつかのオーバーヘッドが伴います：

- 各並列ノードは新しいコルーチンを作成します。
- コンテキストのフォークとマージにより、計算コストが追加されます。
- 多数の並列実行により、リソースの競合が発生する可能性があります。

最適なパフォーマンスを得るためには、以下のような操作を並列化してください：

- 互いに独立している。
- 実行時間が長い。
- ミュータブルな（可変の）状態を共有しない。