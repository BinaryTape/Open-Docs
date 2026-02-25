## 建立與配置子圖

以下章節提供在建立代理式工作流程（agentic workflows）子圖時的程式碼範本與常用模式。

### 基本子圖建立

自訂子圖通常使用以下模式建立：

* 具有指定工具選擇策略的子圖：
<!--- INCLUDE
import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
import ai.koog.agents.core.dsl.builder.strategy

typealias StrategyInput = Unit
typealias StrategyOutput = Unit

typealias Input = Unit
typealias Output = Unit

val str = 
-->
```kotlin
strategy<StrategyInput, StrategyOutput>("strategy-name") {
    val subgraphIdentifier by subgraph<Input, Output>(
        name = "subgraph-name",
        toolSelectionStrategy = ToolSelectionStrategy.ALL
    ) {
        // 為此子圖定義節點與邊
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

* 具有指定工具清單（來自定義工具註冊表的工具子集）的子圖：
<!--- INCLUDE
import ai.koog.agents.core.agent.entity.ToolSelectionStrategy
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias StrategyInput = Unit
typealias StrategyOutput = Unit

typealias Input = Unit
typealias Output = Unit

val firstTool = SayToUser
val secondTool = AskUser

val str = 
-->
```kotlin
strategy<StrategyInput, StrategyOutput>("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name", 
       tools = listOf(firstTool, secondTool)
   ) {
        // 為此子圖定義節點與邊
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

若要了解更多關於參數與參數值的資訊，請參閱 `subgraph` [API 參考](api:agents-core::ai.koog.agents.core.dsl.builder.AIAgentSubgraphBuilderBase.subgraph)。若要了解更多關於工具的資訊，請參閱[工具](tools-overview.md)。

以下程式碼範例顯示了自訂子圖的實際實作：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

val firstTool = SayToUser
val secondTool = AskUser

val str = 
-->
```kotlin
strategy<String, String>("my-strategy") {
   val mySubgraph by subgraph<String, String>(
      tools = listOf(firstTool, secondTool)
   ) {
        // 為此子圖定義節點與邊
        val sendInput by nodeLLMRequest()
        val executeToolCall by nodeExecuteTool()
        val sendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo sendInput)
        edge(sendInput forwardTo executeToolCall onToolCall { true })
        edge(executeToolCall forwardTo sendToolResult)
        edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
    }
}
```
<!--- KNIT example-custom-subgraphs-03.kt -->

### 在子圖中配置工具

可以透過幾種方式為子圖配置工具：

* 直接在子圖定義中：
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser

val str = strategy<String, String>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = listOf(AskUser)
 ) {
    // 子圖定義
 }
```
<!--- KNIT example-custom-subgraphs-04.kt -->

* 來自工具註冊表：
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.ToolRegistry

val toolRegistry = ToolRegistry.EMPTY
val str = strategy<String, String>("my-strategy") {
-->
<!--- SUFFIX
}
-->
```kotlin
val mySubgraph by subgraph<String, String>(
    tools = listOf(toolRegistry.getTool("AskUser"))
) {
    // 子圖定義
}
```
<!--- KNIT example-custom-subgraphs-05.kt -->

* 在執行期間動態配置：
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy

val str = strategy<String, String>("my-strategy") {
    val node by node<Unit, Unit>("node_name") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 建立一組工具
this.llm.writeSession {
    tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
}
```
<!--- KNIT example-custom-subgraphs-06.kt -->

## 進階子圖技術

### 多部分策略

複雜的工作流程可以分解為多個子圖，每個子圖處理程序中的特定部分：
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias A = Unit
typealias B = Unit
typealias C = Unit

val firstTool = AskUser
val secondTool = SayToUser

val str =
-->
```kotlin
strategy("complex-workflow") {
   val inputProcessing by subgraph<String, A>(
   ) {
      // 處理初始輸入
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 根據處理後的輸入進行推理
   }

   val toolRun by subgraph<B, C>(
      // 來自工具註冊表的選擇性工具子集
      tools = listOf(firstTool, secondTool)
   ) {
      // 根據推理執行工具
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 根據工具結果產生回應
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```
<!--- KNIT example-custom-subgraphs-07.kt -->

## 最佳實務

在使用子圖時，請遵循以下最佳實務：

1. **將複雜的工作流程分解為子圖**：每個子圖應具有明確且專一的職責。

2. **僅傳遞必要的上下文**：僅傳遞後續子圖正常運作所需的資訊。

3. **記錄子圖相依性**：清楚記錄每個子圖對前一個子圖的預期，以及它為後續子圖提供的內容。

4. **隔離測試子圖**：在將子圖整合到策略之前，確保每個子圖都能在各種輸入下正確運作。

5. **考慮 Token 使用量**：注意 Token 使用量，尤其是在子圖之間傳遞大型歷程記錄時。

## 疑難排解

### 工具不可用

如果工具在子圖中不可用：

- 檢查工具是否已正確註冊在工具註冊表中。

### 子圖未按定義及預期的順序執行

如果子圖未按定義的順序執行：

- 檢查策略定義以確保子圖按正確順序排列。
- 驗證每個子圖是否已將其輸出正確傳遞給下一個子圖。
- 確保您的子圖與其餘子圖連接，且可從 nodeStart 到達（並可到達 nodeFinish）。請小心使用條件邊，確保它們涵蓋了所有可能的繼續條件，以免在子圖或節點中受阻。

## 範例

以下範例顯示如何使用子圖在真實場景中建立代理策略。
程式碼範例包含三個定義的子圖：`researchSubgraph`、`planSubgraph` 和 `executeSubgraph`，其中每個子圖在助理流程中都有明確且不同的目的。
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.prompt.dsl.prompt
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

class WebSearchTool: SimpleTool<WebSearchTool.Args>(
    argsSerializer = Args.serializer(),
    name = "web_search",
    description = "Search on the web"
) {
    @Serializable
    class Args(val query: String)

    override suspend fun execute(args: Args): String {
        return "Searching for ${args.query} on the web..."
    }
}

class DoAction: SimpleTool<DoAction.Args>(
    argsSerializer = Args.serializer(),
    name = "do_action",
    description = "Do something"
) {
    @Serializable
    class Args(val action: String)

    override suspend fun execute(args: Args): String {
        return "Doing action..."
    }
}

class DoAnotherAction: SimpleTool<DoAnotherAction.Args>(
    argsSerializer = Args.serializer(),
    name = "do_another_action",
    description = "Do something other"
) {
    @Serializable
    class Args(val action: String)

    override suspend fun execute(args: Args): String {
        return "Doing another action..."
    }
}
-->
```kotlin
// 定義代理策略
val strategy = strategy<String, String>("assistant") {
    // 包含工具呼叫的子圖

    val researchSubgraph by subgraph<String, String>(
        "research_subgraph",
        tools = listOf(WebSearchTool())
    ) {
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeCallLLM)
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val planSubgraph by subgraph(
        "plan_subgraph",
        tools = listOf()
    ) {
        val nodeUpdatePrompt by node<String, Unit> { research ->
            llm.writeSession {
                rewritePrompt {
                    prompt("research_prompt") {
                        system(
                            "You are given a problem and some research on how it can be solved." +
                                    "Make step by step a plan on how to solve given task."
                        )
                        user("Research: $research")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    val executeSubgraph by subgraph<String, String>(
        "execute_subgraph",
        tools = listOf(DoAction(), DoAnotherAction()),
    ) {
        val nodeUpdatePrompt by node<String, Unit> { plan ->
            llm.writeSession {
                rewritePrompt {
                    prompt("execute_prompt") {
                        system(
                            "You are given a task and detailed plan how to execute it." +
                                    "Perform execution by calling relevant tools."
                        )
                        user("Execute: $plan")
                        user("Plan: $plan")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "Task: $agentInput" })
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    nodeStart then researchSubgraph then planSubgraph then executeSubgraph then nodeFinish
}
```
<!--- KNIT example-custom-subgraphs-08.kt -->