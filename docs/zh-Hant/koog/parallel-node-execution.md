## 概觀

並行節點執行（Parallel node execution）可讓您同時執行多個 AI agent 節點，提升效能並實現複雜的工作流程。當您需要執行以下操作時，此功能特別有用：

- 同時透過不同的模型或方法處理相同的輸入
- 並行執行多個獨立操作
- 實作競爭性評估模式，即產生多個解決方案後進行比較

## 關鍵組件

Koog 中的並行節點執行由下列方法與資料結構組成。

### 方法

- `parallel()`：並行執行多個節點並收集其結果。

### 資料結構

- `ParallelResult`：代表並行節點執行的完成結果。
- `NodeExecutionResult`：包含節點執行的輸出與內容（context）。

## 基本用法

### 並行執行節點

若要啟動節點的並行執行，請使用以下格式的 `parallel` 方法：

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
   firstNode, secondNode, thirdNode /* 如果需要，可增加更多節點 */
) {
   // 合併策略放置於此，例如：
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

以下是並行執行三個節點並選擇長度最大之結果的實際範例：

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

上述程式碼並行執行 `nodeCalcTokens`、`nodeCalcSymbols` 和 `nodeCalcWords` 節點，並回傳值最大的結果。

### 合併策略

並行執行節點後，您需要指定如何合併結果。Koog 提供下列合併策略：

- `selectBy()`：根據述詞函式（predicate function）選擇結果。
- `selectByMax()`：根據比較函式選擇具有最大值的結果。
- `selectByIndex()`：根據選擇函式回傳的索引選擇結果。
- `fold()`：使用運算函式將結果摺疊為單一值。

#### selectBy

根據述詞函式選擇結果：

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

這會選擇第一個包含「programmer」單字的笑話。

#### selectByMax

根據比較函式選擇具有最大值的結果：

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

這會選擇長度最長的笑話。

#### selectByIndex

根據選擇函式回傳的索引選擇結果：

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
      // 使用另一個 LLM 來判定最佳笑話
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

這會使用另一個 LLM 呼叫來判定最佳笑話的索引。

#### fold

使用運算函式將結果摺疊為單一值：

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

這會將所有笑話結合成單一字串。

## 範例：最佳笑話 Agent

這是一個完整範例，使用並行執行從不同的 LLM 模型產生笑話並選出最佳笑話：

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
   // 為不同的 LLM 模型定義節點
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
         model = AnthropicModels.Sonnet_4_5
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
         model = AnthropicModels.Opus_4_6
         appendPrompt {
            system("You are a comedian. Generate a funny joke about the given topic.")
            user("Tell me a joke about $topic.")
         }
         val response = requestLLMWithoutTools()
         response.content
      }
   }

   // 並行執行笑話產生並選擇最佳笑話
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // 另一個 LLM（例如 GPT4o）將找出最有趣的笑話：
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

   // 連接節點
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## 最佳實務

1. **考量資源限制**：並行執行節點時，請留意資源使用情況，特別是同時進行多個 LLM API 呼叫時。

2. **上下文管理**：每次並行執行都會建立一個分叉的內容（forked context）。合併結果時，請選擇要保留哪個內容，或如何結合來自不同執行的內容。

3. **針對您的使用案例進行優化**：
    - 對於競爭性評估（如笑話範例），使用 `selectByIndex` 選擇最佳結果
    - 對於尋找最大值，使用 `selectByMax`
    - 對於基於條件的篩選，使用 `selectBy`
    - 對於聚合操作，使用 `fold` 將所有結果結合成複合輸出

## 效能考量

並行執行可顯著提升吞吐量，但也會帶來一些開銷：

- 每個並行節點都會建立一個新的協同程式（coroutine）
- 內容的分叉與合併會增加一些運算成本
- 當並行執行過多時，可能會發生資源爭奪

為了獲得最佳效能，請對以下操作進行並行化：

- 彼此獨立的操作
- 具有顯著執行時間的操作
- 不共享可變狀態的操作