# 核心概念

## Agent

- **Agent**：一个 AI 实体，可以与工具交互、处理复杂工作流并与用户通信。

- **LLM (Large Language Model)**：为 Agent 能力提供支持的底层 AI 模型。

- **Message**：Agent 系统中的一个通信单元，表示从用户、助手或系统传递的数据。

- **Prompt**：提供给 LLM 的对话历史，由用户、助手和系统消息组成。

- **System prompt**：提供给 Agent 的指令，用于指导其行为、定义其角色并提供其任务所需的关键信息。

- **Context**：LLM 交互发生的环境，可访问对话历史和工具。

- **LLM session**：与 LLM 交互的结构化方式，包括对话历史、可用工具以及发起请求的方法。

## Agent 工作流

- **Strategy**：为 Agent 定义的工作流，由顺序子图组成。
该策略定义了 Agent 如何处理输入、与工具交互并生成输出。
策略图由通过边连接的节点组成，这些边表示节点之间的转换。

### 策略图

- **Graph**：由通过边连接的节点组成的结构，定义了 Agent 策略工作流。

- **Node**：Agent 策略工作流的基本构建块，表示特定的操作或转换。

- **Edge**：Agent 图中节点之间的连接，定义了操作流，通常带有条件，用于指定何时沿着每条边行进。

- **Conditions**：决定何时沿着特定边行进的规则。

- **Subgraph**：Agent 策略中自包含的处理单元，拥有自己的一组工具、上下文和职责。关于子图操作的信息可以封装在子图内部，也可以使用 AgentMemory 特性在子图之间传递。

## 工具

- **Tool**：Agent 可用于执行特定任务或访问外部系统的函数。Agent 了解可用的工具及其实参，但不知道它们的实现细节。

- **Tool call**：LLM 发出的请求，用于使用提供的实参运行特定工具。其功能类似于函数调用。

- **Tool descriptor**：工具元数据，包括其名称、描述和形参。

- **Tool registry**：Agent 可用工具的 list。该注册表告知 Agent 可用的工具。

- **Tool result**：运行工具产生的输出。例如，如果工具是一个方法，结果将是其返回值。

## 历史压缩

- **History compression**：通过应用各种压缩策略来减少对话历史的大小以管理 token 用量的过程。
关于详情，请参见 [历史压缩](history-compression.md)。

## 特性

- **Feature**：扩展和增强 AI Agent 功能的组件。

### EventHandler 特性

- **EventHandler**：一种特性，能够监控和响应各种 Agent 事件，提供用于跟踪 Agent 生命周期、处理错误以及在整个工作流中处理工具调用的挂钩。

### AgentMemory 特性

- **AgentMemory**：一种特性，使 AI Agent 能够在对话中存储、检索和使用信息。关于详情，请参见 [AgentMemory](agent-memory.md)。

- **Concept**：AgentMemory 特性中关联元数据的信息类别，包括关键词、描述和事实类型。概念是 AgentMemory 系统的基本构建块，Agent 可以记住和回忆它们。
关于详情，请参见 [AgentMemory](agent-memory.md)。

- **Fact**：存储在 AgentMemory 系统中的独立信息片段。
事实与概念关联，可以具有单个值或多个值。
关于详情，请参见 [AgentMemory](agent-memory.md)。

- **Memory scope**：事实相关的上下文。关于详情，请参见 [AgentMemory](agent-memory.md)。