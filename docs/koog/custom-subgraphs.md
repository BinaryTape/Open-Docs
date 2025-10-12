## 创建和配置子图

以下章节提供了用于代理工作流的子图创建代码模板和常见模式。

### 基本子图创建

自定义子图通常使用以下模式创建：

* 带有指定工具选择策略的子图：
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
        // 为此子图定义节点和边
    }
}
```
<!--- KNIT example-custom-subgraphs-01.kt -->

* 带有指定工具 list 的子图（从已定义工具注册表中选择的工具子集）：
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
        // 为此子图定义节点和边
    }
}
```
<!--- KNIT example-custom-subgraphs-02.kt -->

关于形参和形参值的更多信息，请参见 `subgraph` [API 参考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.builder/-a-i-agent-subgraph-builder-base/subgraph.html)。关于工具的更多信息，请参见 [Tools](tools-overview.md)。

以下代码示例展示了自定义子图的实际实现：

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
<!--- KNIT example-custom-subgraphs-03.kt -->

### 在子图中配置工具

工具可以通过多种方式配置用于子图：

* 直接在子图定义中：
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
    // 子图定义
 }
```
<!--- KNIT example-custom-subgraphs-04.kt -->

* 从工具注册表：
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
    // 子图定义
}
```
<!--- KNIT example-custom-subgraphs-05.kt -->

* 在执行期间动态地：
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
// 创建一组工具
this.llm.writeSession {
    tools = tools.filter { it.name in listOf("first_tool_name", "second_tool_name") }
}
```
<!--- KNIT example-custom-subgraphs-06.kt -->

## 高级子图技术

### 多部分策略

复杂工作流可以分解为多个子图，每个子图处理过程中的特定部分：
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
      // 处理初始输入
   }

   val reasoning by subgraph<A, B>(
   ) {
      // 基于处理后的输入执行推理
   }

   val toolRun by subgraph<B, C>(
      // 工具注册表中可选的工具子集
      tools = listOf(firstTool, secondTool)
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
<!--- KNIT example-custom-subgraphs-07.kt -->

## 最佳实践

使用子图时，请遵循以下最佳实践：

1.  **将复杂工作流分解为子图**：每个子图应具有清晰、集中的职责。

2.  **仅传递必要的上下文**：仅传递后续子图正确运行所需的信息。

3.  **记录子图依赖项**：清晰地记录每个子图期望从前一个子图获得什么，以及它向后续子图提供什么。

4.  **独立测试子图**：确保每个子图在集成到策略之前，都能在各种输入下正确运行。

5.  **考虑令牌用量**：注意令牌用量，尤其是在子图之间传递大量历史记录时。

## 故障排除

### 工具不可用

如果工具在子图中不可用：

- 检测工具是否已在工具注册表中正确注册。

### 子图未按定义和预期顺序运行

如果子图未按定义的顺序执行：

- 检测策略定义以确保子图按正确顺序排列。
- 验证每个子图都正确地将其输出传递给下一个子图。
- 确保你的子图与其余子图连接，并且可以从开始（和结束）可达。谨慎使用条件边，以确保它们涵盖所有可能的继续条件，从而避免在子图或节点中被阻塞。

## 示例

以下示例展示了如何在真实世界场景中使用子图创建代理策略。
该代码示例包含 `researchSubgraph`、`planSubgraph` 和 `executeSubgraph` 三个已定义的子图，其中每个子图在助手流中都具有定义明确且不同的目的。
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

class WebSearchTool: SimpleTool<WebSearchTool.Args>() {
    @Serializable
    class Args(val query: String)

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val description = "Search on the web"

    override suspend fun doExecute(args: Args): String {
        return "Searching for ${args.query} on the web..."
    }
}

class DoAction: SimpleTool<DoAction.Args>() {
    @Serializable
    class Args(val action: String)

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val description = "Do something"

    override suspend fun doExecute(args: Args): String {
        return "Doing action..."
    }
}

class DoAnotherAction: SimpleTool<DoAnotherAction.Args>() {
    @Serializable
    class Args(val action: String)

    override val argsSerializer: KSerializer<Args> = Args.serializer()

    override val description = "Do something other"

    override suspend fun doExecute(args: Args): String {
        return "Doing another action..."
    }
}
-->
```kotlin
// 定义代理策略
val strategy = strategy<String, String>("assistant") {
    // 包含工具调用的子图

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