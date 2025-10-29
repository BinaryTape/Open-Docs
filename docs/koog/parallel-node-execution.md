## 概述

并行节点执行允许您并发运行多个 AI 智能体节点，从而提高性能并支持复杂的流程。此特性在以下场景中尤其有用：

- 同时通过不同的模型或方法处理相同的输入
- 并行执行多个独立操作
- 实现竞争性求值模式，即生成多个解决方案后进行比较

## 关键组成部分

Koog 中的并行节点执行由下述方法和数据结构组成。

### 方法

- `parallel()`: 并行执行多个节点并收集其结果。

### 数据结构

- `ParallelResult`: 表示并行节点执行的已完成结果。
- `NodeExecutionResult`: 包含节点执行的输出和上下文。

## 基本用法

### 并行运行节点

要启动节点的并行执行，请使用以下格式的 `parallel` 方法：

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
   firstNode, secondNode, thirdNode /* 如有需要，可添加更多节点 */
) {
   // 合并策略在此处，例如： 
   selectByMax { it.length }
}
```
<!--- KNIT example-parallel-node-execution-01.kt -->

以下是并行运行三个节点并选择最大长度结果的实际示例：

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

上述代码并行运行 `nodeCalcTokens`、`nodeCalcSymbols` 和 `nodeCalcWords` 节点，并返回具有最大值的结果。

### 合并策略

在并行执行节点后，您需要指定如何合并结果。Koog 提供以下合并策略：

- `selectBy()`: 基于谓词函数选择结果。
- `selectByMax()`: 基于比较函数选择具有最大值的结果。
- `selectByIndex()`: 基于选择函数返回的索引选择结果。
- `fold()`: 使用操作函数将结果折叠为单个值。

#### selectBy

基于谓词函数选择结果：

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

这会选择第一个包含单词 "programmer" 的笑话。

#### selectByMax

基于比较函数选择具有最大值的结果：

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

这会选择长度最长的笑话。

#### selectByIndex

基于选择函数返回的索引选择结果：

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
      // 使用另一个 LLM 来确定最佳笑话
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

这使用另一个 LLM 调用来确定最佳笑话的索引。

#### fold

使用操作函数将结果折叠为单个值：

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

这会将所有笑话组合成一个字符串。

## 示例：最佳笑话智能体

以下是一个完整示例，它使用并行执行从不同的 LLM 模型生成笑话并选择最佳笑话：

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
   // 为不同的 LLM 模型定义节点
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

   // 并行执行笑话生成并选择最佳笑话
   val nodeGenerateBestJoke by parallel(
      nodeOpenAI, nodeAnthropicSonnet, nodeAnthropicOpus,
   ) {
      selectByIndex { jokes ->
         // 另一个 LLM（例如，GPT4o）将找到最有趣的笑话：
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

   // 连接节点
   nodeStart then nodeGenerateBestJoke then nodeFinish
}
```
<!--- KNIT example-parallel-node-execution-07.kt -->

## 最佳实践

1.  **考量资源限制**：在并行执行节点时，请注意资源使用情况，尤其是在同时进行多个 LLM API 调用时。

2.  **上下文管理**：每次并行执行都会创建一个派生上下文。合并结果时，请选择要保留哪个上下文或如何组合来自不同执行的上下文。

3.  **根据您的用例进行优化**：
    - 对于竞争性求值（如笑话示例），使用 `selectByIndex` 选择最佳结果
    - 对于查找最大值，使用 `selectByMax`
    - 对于基于条件进行过滤，使用 `selectBy`
    - 对于聚合，使用 `fold` 将所有结果组合成一个复合输出

## 性能考量

并行执行可以显著提高吞吐量，但会带来一些开销：

- 每个并行节点都会创建一个新的协程
- 上下文派生和合并会增加一些计算成本
- 存在大量并行执行时可能会出现资源争用

为了获得最佳性能，请并行化符合以下条件的操作：

- 彼此独立
- 具有显著的执行时间
- 不共享可变状态