# 自定义策略图

策略图是 Koog framework 中代理工作流的核心支柱。它们定义了代理如何处理输入、与工具交互以及生成输出。策略图由通过边连接的节点组成，执行流由条件决定。

创建策略图能让你根据特定需求定制代理的行为，无论是构建一个简单的聊天机器人、一个复杂的数据处理流水线，还是介于两者之间的任何事物。

## 策略图架构

从高层视角看，策略图由以下组件构成：

-   **Strategy**：图的顶层容器，使用 `strategy` 函数创建。
-   **Subgraphs**：图中可以拥有自己工具集和上下文的部分。
-   **Nodes**：工作流中的单个操作或转换。
-   **Edges**：定义转换条件和转换的节点间连接。

策略图从一个名为 `nodeStart` 的特殊节点开始，到 `nodeFinish` 结束。这些节点之间的路径由图中指定的边和条件决定。

## 策略图组件

### 节点

节点是策略图的构建块。每个节点代表一个特定操作。

Koog framework 提供了预定义节点，也允许你使用 `node` 函数创建自定义节点。

详情请参见 [预定义节点和组件](nodes-and-components.md) 和 [自定义节点](custom-nodes.md)。

### 边

边连接节点并定义策略图中的操作流。边通过 `edge` 函数和 `forwardTo` 中缀函数创建：

```kotlin
edge(sourceNode forwardTo targetNode)
```

#### 条件

条件决定了何时跟随策略图中的特定边。条件有以下几种类型：

| 条件类型         | 描述                                                                           |
| :--------------- | :----------------------------------------------------------------------------- |
| onCondition      | 接受一个返回布尔值的 lambda 表达式的通用条件。                                 |
| onToolCall       | 当 LLM 调用工具时匹配的条件。                                                  |
| onAssistantMessage | 当 LLM 响应消息时匹配的条件。                                                  |
| onMultipleToolCalls | 当 LLM 调用多个工具时匹配的条件。                                              |
| onToolNotCalled  | 当 LLM 未调用工具时匹配的条件。                                                |

你可以使用 `transformed` 函数在将输出传递给目标节点之前对其进行转换：

```kotlin
edge(sourceNode forwardTo targetNode 
        onCondition { input -> input.length > 10 }
        transformed { input -> input.uppercase() }
)
```

### 子图

子图是策略图的一部分，它们使用自己的一套工具和上下文进行操作。策略图可以包含多个子图。每个子图通过 `subgraph` 函数定义：

```kotlin
val strategy = strategy("strategy-name") {
    val firstSubgraph by subgraph("first") {
        // Define nodes and edges for this subgraph
    }
    val secondSubgraph by subgraph("second") {
        // Define nodes and edges for this subgraph
    }
}
```
子图可以使用工具注册表中的任何工具。但是，你可以从该注册表中指定一个工具子集，并将其作为实参传递给 `subgraph` 函数，以供子图使用：

```kotlin
val strategy = strategy("strategy-name") {
    val firstSubgraph by subgraph(
        name = "first",
        tools = listOf(someTool)
    ) {
        // Define nodes and edges for this subgraph
    }
   // 定义其他子图
}
```

## 基本策略图创建

基本策略图的运行方式如下：

1.  将输入发送到 LLM。
2.  如果 LLM 响应消息，则结束该过程。
3.  如果 LLM 调用工具，则运行该工具。
4.  将工具结果发送回 LLM。
5.  如果 LLM 响应消息，则结束该过程。
6.  如果 LLM 调用另一个工具，则运行该工具，然后过程从第 4 步重复。

![basic-strategy-graph](img/basic-strategy-graph.png)

以下是基本策略图的示例：

```kotlin
val myStrategy = strategy("my-strategy") {
    val nodeCallLLM by nodeLLMRequest()
    val executeToolCall by nodeExecuteTool()
    val sendToolResult by nodeLLMSendToolResult()

    edge(nodeStart forwardTo nodeCallLLM)
    edge(nodeCallLLM forwardTo nodeFinish onAssistantMessage { true })
    edge(nodeCallLLM forwardTo executeToolCall onToolCall { true })
    edge(executeToolCall forwardTo sendToolResult)
    edge(sendToolResult forwardTo nodeFinish onAssistantMessage { true })
    edge(sendToolResult forwardTo executeToolCall onToolCall { true })
}
```

## 高级策略技术

### 历史记录压缩

对于长期运行的对话，历史记录可能会变得很大并消耗大量 token。关于如何压缩历史记录，请参见 [历史记录压缩](history-compression.md)。

### 并行工具执行

对于需要并行执行多个工具的工作流，你可以使用 `nodeExecuteMultipleTools` 节点：

```kotlin
val executeMultipleTools by nodeExecuteMultipleTools()
val processMultipleResults by nodeLLMSendMultipleToolResults()

edge(someNode forwardTo executeMultipleTools)
edge(executeMultipleTools forwardTo processMultipleResults)
```

你也可以使用 `toParallelToolCallsRaw` 扩展函数处理流式数据：

```kotlin
parseMarkdownStreamToBooks(markdownStream).toParallelToolCallsRaw(BookTool::class).collect()
```

要了解更多信息，请参见 [工具](tools-overview.md#parallel-tool-calls)。

### 条件分支

对于需要根据特定条件采取不同路径的复杂工作流，你可以使用条件分支：

```kotlin
val branchA by node<String, String> { input ->
    // 分支 A 的逻辑
    "Branch A: $input"
}

val branchB by node<String, String> { input ->
    // 分支 B 的逻辑
    "Branch B: $input"
}

edge(
    (someNode forwardTo branchA)
            onCondition { input -> input.contains("A") }
)
edge(
    (someNode forwardTo branchB)
            onCondition { input -> input.contains("B") }
)
```

## 最佳实践

创建自定义策略图时，请遵循以下最佳实践：

-   保持简单。从一个简单的图开始，根据需要增加复杂性。
-   给你的节点和边起描述性名称，使图更易于理解。
-   处理所有可能的路径和边缘情况。
-   用各种输入测试你的图，确保其行为符合预期。
-   记录你的图的目的和行为，以备将来参考。
-   使用预定义策略或常见模式作为起点。
-   对于长期运行的对话，使用历史记录压缩以减少 token 使用量。
-   使用子图来组织你的图并管理工具访问。

## 用法示例

### 语气分析策略

语气分析策略是基于工具的策略的一个很好的示例，它包括历史记录压缩：

```kotlin
fun toneStrategy(name: String, toolRegistry: ToolRegistry): AIAgentStrategy {
    return strategy(name) {
        val nodeSendInput by nodeLLMRequest()
        val nodeExecuteTool by nodeExecuteTool()
        val nodeSendToolResult by nodeLLMSendToolResult()
        val nodeCompressHistory by nodeLLMCompressHistory<Message.Tool.Result>()

        // 定义代理的流程
        edge(nodeStart forwardTo nodeSendInput)

        // 如果 LLM 响应消息，则结束
        edge(
            (nodeSendInput forwardTo nodeFinish)
                    onAssistantMessage { true }
        )

        // 如果 LLM 调用工具，则执行它
        edge(
            (nodeSendInput forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // 如果历史记录过大，则压缩它
        edge(
            (nodeExecuteTool forwardTo nodeCompressHistory)
                    onCondition { _ -> llm.readSession { prompt.messages.size > 100 } }
        )

        edge(nodeCompressHistory forwardTo nodeSendToolResult)

        // 否则，直接发送工具结果
        edge(
            (nodeExecuteTool forwardTo nodeSendToolResult)
                    onCondition { _ -> llm.readSession { prompt.messages.size <= 100 } }
        )

        // 如果 LLM 调用另一个工具，则执行它
        edge(
            (nodeSendToolResult forwardTo nodeExecuteTool)
                    onToolCall { true }
        )

        // 如果 LLM 响应消息，则结束
        edge(
            (nodeSendToolResult forwardTo nodeFinish)
                    onAssistantMessage { true }
        )
    }
}
```

此策略执行以下操作：

1.  将输入发送到 LLM。
2.  如果 LLM 响应消息，策略将结束该过程。
3.  如果 LLM 调用工具，策略将运行该工具。
4.  如果历史记录过大（超过 100 条消息），策略将在发送工具结果之前压缩它。
5.  否则，策略将直接发送工具结果。
6.  如果 LLM 调用另一个工具，策略将运行它。
7.  如果 LLM 响应消息，策略将结束该过程。

## 故障排除

创建自定义策略图时，你可能会遇到一些常见问题。以下是一些故障排除技巧：

### 图无法到达结束节点

如果你的图未到达结束节点，请检查以下内容：

-   从开始节点到结束节点的所有路径最终都通向结束节点。
-   你的条件不过于严格，以致阻止边被跟随。
-   图中没有没有退出条件的循环。

### 工具调用未运行

如果工具调用未运行，请检查以下内容：

-   工具是否在工具注册表中正确注册。
-   从 LLM 节点到工具执行节点的边是否具有正确的条件 (`onToolCall { true }`)。

### 历史记录过大

如果你的历史记录过大并消耗过多 token，请考虑以下几点：

-   添加一个历史记录压缩节点。
-   使用条件检测历史记录的大小，并在它过大时压缩它。
-   使用更积极的压缩策略（例如，`FromLastNMessages` 并使用更小的 N 值）。

### 图行为异常

如果你的图采取了意料之外的分支，请检查以下内容：

-   你的条件定义正确。
-   条件的求值顺序符合预期（边的检测顺序与它们的定义顺序一致）。
-   你没有意外覆盖更通用的条件。

### 出现性能问题

如果你的图有性能问题，请考虑以下几点：

-   通过删除不必要的节点和边来简化图。
-   对独立操作使用并行工具执行。
-   压缩历史记录。
-   使用更高效的节点和操作。