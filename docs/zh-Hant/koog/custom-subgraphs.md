## 建立與設定子圖

以下章節提供用於代理式工作流程中建立子圖的程式碼範本與常用模式。

### 基本子圖建立

自訂子圖通常使用以下模式建立：

* 具有指定工具選擇策略的子圖：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name",
       toolSelectionStrategy = ToolSelectionStrategy.ALL
   ) {
        // Define nodes and edges for this subgraph
    }
}
```

* 具有指定工具列表的子圖（來自已定義工具註冊表的工具子集）：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name", 
       tools = listOf(firstToolName, secondToolName)
   ) {
        // Define nodes and edges for this subgraph
    }
}
```

有關參數與參數值的更多資訊，請參閱 `subgraph` [API 參考資料](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)。有關工具的更多資訊，請參閱[工具](tools-overview.md)。

以下程式碼範例展示了自訂子圖的實際實作：

```kotlin
strategy("my-strategy") {
   val mySubgraph by subgraph<String, String>(
      tools = listOf(myTool1, myTool2)
   ) {
        // Define nodes and edges for this subgraph
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

### 在子圖中設定工具

工具可以透過幾種方式為子圖進行設定：

* 直接在子圖定義中：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = listOf(AskUser)
 ) {
    // Subgraph definition
 }
```

* 從工具註冊表：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = toolRegistry.getTool("AskUser")
) {
   // Subgraph definition
}
```

[//]: # (TODO: @maria.tigina to check whether this is possible)
* 在執行時動態地：
```kotlin
// Make a set of tools
val newTools = context.llm.writeSession {
    val selectedTools = this.requestLLMStructured<SelectedTools>(/*...*/)
    tools.filter { it.name in selectedTools.structure.tools.toSet() }
}

// Pass the tools to the context
val context = context.copyWithTools(newTools)
```

## 進階子圖技術

### 多部分策略

複雜的工作流程可以分解為多個子圖，每個子圖處理流程的特定部分：

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
      tools = listOf(tool1, too2)
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

- 檢查工具是否已在工具註冊表中正確註冊。

### 子圖未按定義和預期順序執行

如果子圖未按定義順序執行：

- 檢查策略定義，確保子圖按正確順序排列。
- 驗證每個子圖是否正確地將其輸出傳遞給下一個子圖。
- 確保您的子圖與其餘子圖連接，並且可從開始（和結束）處到達。請注意條件邊緣，確保它們覆蓋所有可能的條件以繼續，以免在子圖或節點中受阻。

## 範例

以下範例展示了如何在真實世界情境中使用子圖建立代理策略。程式碼範例包含三個已定義的子圖：`researchSubgraph`、`planSubgraph` 和 `executeSubgraph`，其中每個子圖在助手流程中都有其已定義且獨特的用途。

```kotlin
// 定義代理策略
val strategy = strategy("assistant") {
    // 包含工具呼叫的子圖
    val researchSubgraph by subgraph<String, String>(
        "name",
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
        "research_subgraph",
        tools = listOf()
    ) {
        val nodeUpdatePrompt by node<String, Unit> { research ->
            llm.writeSession {
                rewritePrompt {
                    prompt("research_prompt") {
                        system(
                            "你將獲得一個問題以及一些關於如何解決它的研究。請逐步制定一個解決給定任務的計劃。"
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
        "research_subgraph",
        tools = listOf(DoAction(), DoAnotherAction()),
    ) {
        val nodeUpdatePrompt by node<String, Unit> { plan ->
            llm.writeSession {
                rewritePrompt {
                    prompt("execute_prompt") {
                        system(
                            "你將獲得一個任務以及詳細的執行計劃。請透過呼叫相關工具來執行。"
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