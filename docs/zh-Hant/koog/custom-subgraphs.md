## 建立與設定子圖

以下章節提供用於代理式工作流程中建立子圖的程式碼範本與常用模式。

### 基本子圖建立

自訂子圖通常使用以下模式建立：

*   具有指定工具選擇策略的子圖：
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
        // 定義此子圖的節點和邊緣
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

*   具有指定工具列表的子圖（來自已定義工具註冊表的工具子集）：
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
        // 定義此子圖的節點和邊緣
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

有關參數與參數值的更多資訊，請參閱 `subgraph` [API 參考資料](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)。有關工具的更多資訊，請參閱[工具](tools-overview.md)。

以下程式碼範例展示了自訂子圖的實際實作：

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
        // 定義此子圖的節點和邊緣
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

### 在子圖中設定工具

工具可以透過幾種方式為子圖進行設定：

*   直接在子圖定義中：
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

*   從工具註冊表：
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

*   在執行時動態地：
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

複雜的工作流程可以分解為多個子圖，每個子圖處理流程的特定部分：
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
      // 根據已處理的輸入執行推論
   }

   val toolRun by subgraph<B, C>(
      // 工具註冊表中工具的可選子集
      tools = listOf(firstTool, secondTool)
   ) {
      // 根據推論執行工具
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 根據工具結果生成回應
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```
<!--- KNIT example-custom-subgraphs-07.kt -->

## 最佳實踐

在使用子圖時，請遵循以下最佳實踐：

1.  **將複雜工作流程分解為子圖**：每個子圖應具有清晰、集中的職責。

2.  **僅傳遞必要的上下文**：只傳遞後續子圖正常運作所需的資訊。

3.  **文件化子圖依賴關係**：清楚地記錄每個子圖從前一個子圖預期什麼，以及它向後續子圖提供什麼。

4.  **獨立測試子圖**：在將每個子圖整合到策略中之前，確保它在各種輸入下都能正確運作。

5.  **考慮令牌使用量**：請留意令牌使用量，尤其是在子圖之間傳遞大量歷史記錄時。

## 故障排除

### 工具不可用

如果工具在子圖中不可用：

-   檢查工具是否已在工具註冊表中正確註冊。

### 子圖未按定義和預期順序執行

如果子圖未按定義順序執行：

-   檢查策略定義，確保子圖按正確順序排列。
-   驗證每個子圖是否正確地將其輸出傳遞給下一個子圖。
-   確保您的子圖與其餘子圖連接，並且可從開始（和結束）處到達。請注意條件邊緣，確保它們覆蓋所有可能的條件以繼續，以免在子圖或節點中受阻。

## 範例

以下範例展示了如何在真實世界情境中使用子圖建立代理策略。
程式碼範例包含三個已定義的子圖：`researchSubgraph`、`planSubgraph` 和 `executeSubgraph`，其中每個子圖在助手流程中都有其已定義且獨特的用途。
<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.nodeExecuteTool
import ai.koog.agents.core.dsl.extension.nodeLLMRequest
import ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult
import ai.koog.agents.core.dsl.extension.onAssistantMessage
import ai.koog.agents.core.dsl.extension.onToolCall
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import ai.koog.prompt.dsl.prompt
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable

class WebSearchTool: SimpleTool<WebSearchTool.Args>() {
    @Serializable
    class Args(val query: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("web_search", "Search on the web")
    
    override suspend fun doExecute(args: Args): String {
        return "Searching for ${args.query} on the web..."
    }
}

class DoAction: SimpleTool<DoAction.Args>() {
    @Serializable
    class Args(val action: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("do_action", "Do something")

    override suspend fun doExecute(args: Args): String {
        return "Doing action..."
    }
}

class DoAnotherAction: SimpleTool<DoAnotherAction.Args>() {
    @Serializable
    class Args(val action: String) : ToolArgs

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val descriptor: ToolDescriptor = ToolDescriptor("do_another_action", "Do something other")

    override suspend fun doExecute(args: Args): String {
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
                            "你將獲得一個問題以及一些關於如何解決它的研究。" +
                                    "逐步制定一個解決給定任務的計劃。"
                        )
                        user("研究: $research")
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
                            "你將獲得一個任務以及詳細的執行計劃。" +
                                    "透過呼叫相關工具來執行。"
                        )
                        user("執行: $plan")
                        user("計劃: $plan")
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