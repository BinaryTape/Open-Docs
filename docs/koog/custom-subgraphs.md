## 创建和配置子图

以下章节提供了用于代理工作流的子图创建代码模板和常见模式。

### 基本子图创建

自定义子图通常使用以下模式创建：

* 带有指定工具选择策略的子图：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name",
       toolSelectionStrategy = ToolSelectionStrategy.ALL
   ) {
        // 为此子图定义节点和边
    }
}
```

* 带有指定工具列表的子图（从已定义工具注册表中选择的工具子集）：
```kotlin
strategy("strategy-name") {
   val subgraphIdentifier by subgraph<Input, Output>(
       name = "subgraph-name", 
       tools = listOf(firstToolName, secondToolName)
   ) {
        // 为此子图定义节点和边
    }
}
```

有关参数和参数值的更多信息，请参见 `subgraph` [API 参考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)。有关工具的更多信息，请参见 [Tools](tools-overview.md)。

以下代码示例展示了自定义子图的实际实现：

```kotlin
strategy("my-strategy") {
   val mySubgraph by subgraph<String, String>(
      tools = listOf(myTool1, myTool2)
   ) {
        // 为此子图定义节点和边
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

### 在子图中配置工具

工具可以通过多种方式配置用于子图：

* 直接在子图定义中：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = listOf(AskUser)
 ) {
    // 子图定义
 }
```

* 从工具注册表：
```kotlin
val mySubgraph by subgraph<String, String>(
   tools = toolRegistry.getTool("AskUser")
) {
   // 子图定义
}
```

[//]: # (TODO: @maria.tigina 检查这是否可能)
* 在执行期间动态地：
```kotlin
// 创建一个工具集
val newTools = context.llm.writeSession {
    val selectedTools = this.requestLLMStructured<SelectedTools>(/*...*/)
    tools.filter { it.name in selectedTools.structure.tools.toSet() }
}

// 将工具传递给上下文
val context = context.copyWithTools(newTools)
```

## 高级子图技术

### 多部分策略

复杂工作流可以分解为多个子图，每个子图处理过程中的特定部分：

```kotlin
strategy("complex-workflow") {
   val inputProcessing by subgraph<String, A>(
   ) {
      // 处理初始输入
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 根据处理后的输入执行推理
   }

   val toolRun by subgraph<B, C>(
      // 可选的工具子集，从工具注册表获取
      tools = listOf(tool1, too2)
   ) {
      // 根据推理运行工具
   }

   val responseGeneration by subgraph<C, String>(
   ) {
      // 根据工具结果生成响应
   }

   nodeStart then inputProcessing then reasoning then toolRun then responseGeneration then nodeFinish

}
```

## 最佳实践

使用子图时，请遵循以下最佳实践：

1. **将复杂工作流分解为子图**：每个子图应具有清晰、集中的职责。

2. **仅传递必要的上下文**：仅传递后续子图正确运行所需的信息。

3. **记录子图依赖项**：清晰地记录每个子图期望从前一个子图获得什么，以及它向后续子图提供什么。

4. **独立测试子图**：确保每个子图在集成到策略之前，都能在各种输入下正确运行。

5. **考虑令牌用量**：注意令牌用量，尤其是在子图之间传递大量历史记录时。

## 故障排除

### 工具不可用

如果工具在子图中不可用：

- 检测工具是否已在工具注册表中正确注册。

### 子图未按定义和预期顺序运行

如果子图未按定义的顺序执行：

- 检查策略定义以确保子图按正确顺序排列。
- 验证每个子图都正确地将其输出传递给下一个子图。
- 确保你的子图与其余子图连接，并且可以从开始（和结束）可达。谨慎使用条件边，以确保它们涵盖所有可能的继续条件，从而避免在子图或节点中被阻塞。

## 示例

以下示例展示了如何在真实世界场景中使用子图创建代理策略。该代码示例包含 `researchSubgraph`、`planSubgraph` 和 `executeSubgraph` 三个已定义的子图，其中每个子图在助手流中都具有定义明确且不同的目的。

```kotlin
// 定义代理策略
val strategy = strategy("assistant") {
    // 包含工具调用的子图
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
                            "你得到一个问题以及关于如何解决它的一些研究。" +
                                    "请逐步制定解决给定任务的计划。"
                        )
                        user("研究：$research")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "任务：$agentInput" })
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
                            "你得到一个任务和详细的执行计划。" +
                                    "通过调用相关工具来执行。"
                        )
                        user("执行：$plan")
                        user("计划：$plan")
                    }
                }
            }
        }
        val nodeCallLLM by nodeLLMRequest("call_llm")
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()

        edge(nodeStart forwardTo nodeUpdatePrompt)
        edge(nodeUpdatePrompt forwardTo nodeCallLLM transformed { "任务：$agentInput" })
        edge(nodeCallLLM forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeExecuteTool forwardTo nodeSendToolResult)
        edge(nodeSendToolResult forwardTo nodeExecuteTool onToolCall { true })
        edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    }

    nodeStart then researchSubgraph then planSubgraph then executeSubgraph then nodeFinish
}