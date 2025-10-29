## 概觀

平行節點執行允許您同步執行多個 AI 代理節點，從而提升效能並啟用複雜的工作流程。此功能在以下情境中特別有用：

-   同時透過不同的模型或方法處理相同的輸入
-   平行執行多個獨立操作
-   實作競爭性評估模式，其中會產生多個解決方案然後進行比較

## 關鍵元件

Koog 中的平行節點執行由以下所述的方法和資料結構組成。

### 方法

-   `parallel()`: 平行執行多個節點並收集其結果。

### 資料結構

-   `ParallelResult`: 代表平行節點執行完成的結果。
-   `NodeExecutionResult`: 包含節點執行的輸出和上下文。

## 基本用法

### 平行執行節點

若要啟動節點的平行執行，請使用以下格式的 `parallel` 方法：

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

這是一個實際範例，它平行執行三個節點並選取長度最大的結果：

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

上述程式碼平行執行 `nodeCalcTokens`、`nodeCalcSymbols` 和 `nodeCalcWords` 節點，並返回具有最大值的結果。

### 合併策略

平行執行節點後，您需要指定如何合併結果。Koog 提供以下合併策略：

-   `selectBy()`: 根據謂詞函式選取結果。
-   `selectByMax()`: 根據比較函式選取具有最大值的結果。
-   `selectByIndex()`: 根據選取函式返回的索引選取結果。
-   `fold()`: 使用操作函式將結果折疊成單一值。

#### selectBy

根據謂詞函式選取結果：

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

這會選取第一個包含「programmer」這個字的笑話。

#### selectByMax

根據比較函式選取具有最大值的結果：

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

這會選取長度最大的笑話。

#### selectByIndex

根據選取函式返回的索引選取結果：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.structure.json.JsonStructuredData

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
         response.getOrNull()!!.structure.bestJokeIndex
      }
   }
}
```
<!--- KNIT example-parallel-node-execution-05.kt -->

這會使用另一個 LLM 呼叫來判斷最佳笑話的索引。

#### fold

使用操作函式將結果折疊成單一值：

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

這會將所有笑話組合成一個單一字串。

## 範例：最佳笑話代理

這是一個完整範例，它使用平行執行從不同的 LLM 模型產生笑話並選取最佳笑話：

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

   // 平行執行笑話生成並選取最佳笑話
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // 另一個 LLM (例如 GPT4o) 會找到最有趣的笑話：
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
            val bestJoke = response.getOrNull()!!.structure
            bestJoke.bestJokeIndex
         }
      }
   }

   // 連接節點
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## 最佳實踐

1.  **考慮資源限制**：在平行執行節點時，請注意資源使用情況，尤其是在同時發出多個 LLM API 呼叫時。

2.  **上下文管理**：每個平行執行都會創建一個分叉上下文。合併結果時，請選擇要保留哪個上下文或如何組合來自不同執行的上下文。

3.  **針對您的用例進行最佳化**：
    -   對於競爭性評估（例如笑話範例），請使用 `selectByIndex` 來選取最佳結果。
    -   若要尋找最大值，請使用 `selectByMax`。
    -   若要根據條件進行篩選，請使用 `selectBy`。
    -   若要進行聚合，請使用 `fold` 將所有結果組合成複合輸出。

## 效能考量

平行執行可以顯著提高吞吐量，但會產生一些額外負荷：

-   每個平行節點都會創建一個新的協程。
-   上下文分叉和合併會增加一些計算成本。
-   許多平行執行可能會發生資源爭用。

為獲得最佳效能，請平行處理以下操作：

-   彼此獨立
-   執行時間顯著
-   不共用可變狀態