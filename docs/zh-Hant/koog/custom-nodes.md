# 自訂節點實作

本頁提供關於如何在 Koog framework 中實作您自己的自訂節點的詳細說明。自訂節點可讓您透過建立執行特定操作的可重複使用元件，來擴展代理程式工作流程的功能。

若要深入了解什麼是圖形節點、其用途以及現有的預設節點，請參閱 [圖形節點](nodes-and-components.md)。

## 節點架構概觀

在深入探討實作細節之前，了解 Koog framework 中節點的架構至關重要。節點是代理程式工作流程的基本構成要素，每個節點都代表工作流程中的特定操作或轉換。您可以使用邊緣來連接節點，邊緣定義了節點之間的執行流程。

每個節點都有一個 `execute` 方法，該方法接受輸入並產生輸出，然後將該輸出傳遞給工作流程中的下一個節點。

## 實作自訂節點

自訂節點實作的範圍從對輸入資料執行基本邏輯並返回輸出的簡單實作，到接受參數並在多次執行之間保持狀態的更複雜節點實作。

### 基本節點實作

在圖形中實作自訂節點並定義您自己的自訂邏輯的最簡單方法是使用以下模式：

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
    // 處理中
    returnValue
}
```
<!--- KNIT example-custom-nodes-01.kt -->

上述程式碼代表一個自訂節點 `myNode`，它具有預定義的 `Input` 和 `Output` 類型，以及可選的名稱字串參數 (`node_name`)。在實際範例中，這是一個簡單的節點，它接受字串輸入並返回輸入的長度：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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

建立自訂節點的另一種方法是定義 `AIAgentSubgraphBuilderBase` 上的擴充函式，該函式呼叫 `node` 函式：

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
    // 自訂邏輯
    input // 將輸入作為輸出返回 (直通)
}

val myCustomNode by myCustomNode("node_name")
```
<!--- KNIT example-custom-nodes-03.kt -->

這會建立一個直通節點，該節點執行一些自訂邏輯，但將輸入作為輸出返回而不進行修改。

### 具有額外引數的節點

您可以建立接受引數以自訂其行為的節點：

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
    // 在您的自訂邏輯中使用 arg1 和 arg2
    input // 將輸入作為輸出返回
}

val myCustomNode by myNodeWithArguments("node_name", arg1 = "value1", arg2 = 42)
```
<!--- KNIT example-custom-nodes-04.kt -->

### 參數化節點

您可以定義具有輸入和輸出參數的節點：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.AIAgentNodeDelegate
import ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase
import ai.koog.agents.core.dsl.builder.strategy
-->

```kotlin
inline fun <reified T> AIAgentSubgraphBuilderBase<*, *>.myParameterizedNode(
    name: String? = null,
): AIAgentNodeDelegate<T, T> = node(name) { input ->
    // 執行一些額外動作
    // 將輸入作為輸出返回
    input
}

val strategy = strategy<String, String>("strategy_name") {
    val myCustomNode by myParameterizedNode<String>("node_name")
}
```
<!--- KNIT example-custom-nodes-05.kt -->

### 有狀態節點

如果您的節點需要在多次執行之間保持狀態，可以使用閉包變數：

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
        println("節點已執行 $counter 次")
        input
    }
}
```
<!--- KNIT example-custom-nodes-06.kt -->

## 節點輸入與輸出類型

節點可以具有不同的輸入和輸出類型，這些類型被指定為泛型參數：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

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
    輸入和輸出類型決定了節點如何連接到工作流程中的其他節點。只有當來源節點的輸出類型與目標節點的輸入類型相容時，節點才能連接。

## 最佳實踐

實作自訂節點時，請遵循以下最佳實踐：

1.  **保持節點專注**：每個節點應執行單一、定義明確的操作。
2.  **使用描述性名稱**：節點名稱應清楚地表明其用途。
3.  **文件化參數**：為所有參數提供清晰的文件。
4.  **妥善處理錯誤**：實作適當的錯誤處理以防止工作流程失敗。
5.  **讓節點可重複使用**：設計節點以使其在不同工作流程中可重複使用。
6.  **使用型別參數**：在適當的時候使用泛型型別參數，以使節點更靈活。
7.  **提供預設值**：在可能的情況下，為參數提供合理的預設值。

## 常見模式

以下章節提供一些實作自訂節點的常見模式。

### 直通節點

執行操作但將輸入作為輸出返回的節點。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin

val loggingNode by node<String, String>("node_name") { input ->
    println("正在處理輸入: $input")
    input // 將輸入作為輸出返回
}
```
<!--- KNIT example-custom-nodes-08.kt -->

### 轉換節點

將輸入轉換為不同輸出的節點。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val upperCaseNode by node<String, String>("node_name") { input ->
    println("正在處理輸入: $input")
    input.uppercase() // 將輸入轉換為大寫
}
```
<!--- KNIT example-custom-nodes-09.kt -->

### LLM 互動節點

與 LLM 互動的節點。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val strategy = strategy<String, String>("strategy_name") {
-->
<!--- SUFFIX
}
-->
```kotlin
val summarizeTextNode by node<String, String>("node_name") { input ->
    llm.writeSession {
        appendPrompt {
            user("Please summarize the following text: $input")
        }

        val response = requestLLMWithoutTools()
        response.content
    }
}
```
<!--- KNIT example-custom-nodes-10.kt -->

### 工具執行節點

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
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
        content = Json.encodeToString(ToolArgs(arg1 = input, arg2 = 42)) // 使用輸入作為工具引數
    )

    val result = environment.executeTool(toolCall)
    result.content
}
```
<!--- KNIT example-custom-nodes-11.kt -->