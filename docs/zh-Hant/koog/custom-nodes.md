# 自訂 node 實作

本頁面提供如何在 Koog 架構中實作自訂 node 的詳細說明。自訂 node 可讓您透過建立執行特定作業的可重複使用組件，來擴充 agent 工作流程的功能。

若要進一步了解圖形節點是什麼、其用法以及現有的預設節點，請參閱[圖形節點](nodes-and-components.md)。

## Node 架構總覽

在深入研究實作細節之前，了解 Koog 架構中的 node 架構非常重要。Node 是 agent 工作流程的基本構建區塊，每個 node 代表工作流程中的特定作業或轉換。您可以使用「邊」（edge）來連接 node，這定義了 node 之間的執行流程。

每個 node 都有一個 `execute` 方法，該方法接收輸入並產生輸出，然後傳遞給工作流程中的下一個 node。

## 實作自訂 node

自訂 node 的實作範圍很廣，從對輸入資料執行基本邏輯並回傳輸出的簡單實作，到接受參數並在執行之間維持狀態的複雜 node 實作。

### 基本 node 實作

在圖形中實作自訂 node 並定義自訂邏輯最簡單的方法是使用以下模式：

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
    // 處理中
    returnValue
}
```
<!--- KNIT example-custom-nodes-01.kt -->

上述程式碼代表一個具有預定義 `Input` 和 `Output` 型別的自訂 node `myNode`，並帶有選用的名稱字串參數 (`node_name`)。在實際範例中，這是一個接收字串輸入並回傳輸入長度的簡單 node：

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
    // 處理中
    input.length
}
```
<!--- KNIT example-custom-nodes-02.kt -->

建立自訂 node 的另一種方法是在 `AIAgentSubgraphBuilderBase` 上定義一個呼叫 `node` 函式的擴充函式：

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
    // 自訂邏輯
    input // 將輸入作為輸出回傳（直接傳通）
}

val myCustomNode by myCustomNode("node_name")
```
<!--- KNIT example-custom-nodes-03.kt -->

這會建立一個執行某些自訂邏輯但將輸入作為輸出原樣回傳的傳通 node。

### 帶有額外引數的 node

您可以建立接受引數以自訂其行為的 node：

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
    // 在自訂邏輯中使用 arg1 和 arg2
    input // 將輸入作為輸出回傳
}

val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
```
<!--- KNIT example-custom-nodes-04.kt -->

### 參數化 node

您可以定義具有輸入和輸出參數的 node：

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
    // 執行一些額外操作
    // 將輸入作為輸出回傳
    input
}

val strategy = strategy<String, String>("strategy_name") {
    val myCustomNode by myParameterizedNode<String>("node_name")
}
```
<!--- KNIT example-custom-nodes-05.kt -->

### 具狀態 node

如果您的 node 需要在執行之間維持狀態，您可以使用閉包變數：

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
        println("Node 執行了 $counter 次")
        input
    }
}
```
<!--- KNIT example-custom-nodes-06.kt -->

## Node 輸入與輸出型別

Node 可以具有不同的輸入和輸出型別，這些型別被指定為泛型參數：

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
    // 處理中
    input.toInt() // 將字串轉換為整數
}
```
<!--- KNIT example-custom-nodes-07.kt -->

!!! note
    輸入和輸出型別決定了 node 如何與工作流程中的其他 node 連接。僅當來源 node 的輸出型別與目標 node 的輸入型別相容時，才能連接 node。

## 最佳實務

實作自訂 node 時，請遵循以下最佳實務：

1. **保持 node 功能集中**：每個 node 應執行單一且定義明確的作業。
2. **使用具描述性的名稱**：node 名稱應清楚表明其用途。
3. **編寫參數文件**：為所有參數提供清楚的文件說明。
4. **優雅地處理錯誤**：實作適當的錯誤處理以防止工作流程失敗。
5. **使 node 可重複使用**：設計可在不同工作流程中重複使用的 node。
6. **使用型別參數**：在適當的時候使用泛型型別參數，使 node 更加靈活。
7. **提供預設值**：盡可能為參數提供合理的預設值。

## 常見模式

以下章節提供了一些實作自訂 node 的常見模式。

### 傳通 node

執行作業但將輸入作為輸出回傳的 node。

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
    println("正在處理輸入：$input")
    input // 將輸入作為輸出回傳
}
```
<!--- KNIT example-custom-nodes-08.kt -->

### 轉換 node

將輸入轉換為不同輸出的 node。

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
    println("正在處理輸入：$input")
    input.uppercase() // 將輸入轉換為大寫
}
```
<!--- KNIT example-custom-nodes-09.kt -->

### LLM 互動 node

與 LLM 進行互動的 node。

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
            user("請總結以下文字：$input")
        }

        val response = requestLLMWithoutTools()
        response.content
    }
}
```
<!--- KNIT example-custom-nodes-10.kt -->

### 工具執行 node

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.builder.node
import ai.koog.prompt.message.Message
import ai.koog.prompt.message.ResponseMetaInfo
import kotlin.time.Clock
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
        content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 使用輸入作為工具引數
    )

    val result = environment.executeTool(toolCall)
    result.content
}
```
<!--- KNIT example-custom-nodes-11.kt -->