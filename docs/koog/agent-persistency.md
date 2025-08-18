# 智能体持久化

智能体持久化是 Koog 框架中的一个特性，为 AI 智能体提供了检查点功能。
它允许你在执行过程中的特定点保存和恢复智能体的状态，从而实现以下功能，例如：

- 从特定点恢复智能体执行
- 回滚到先前的状态
- 跨会话持久化智能体状态

## 关键概念

### 检查点

检查点捕获智能体在其执行过程中特定点的完整状态，包括：

- 消息历史记录（用户、系统、助手和工具之间的所有交互）
- 当前正在执行的节点
- 当前节点的输入数据
- 创建时间戳

检查点通过唯一 ID 标识，并与特定智能体关联。

## 前提条件

Agent Persistency 特性要求你的智能体策略中的所有节点都具有唯一的名称。
在安装该特性时会强制执行此要求：

<!--- INCLUDE
/*
KNIT ignore this example
-->
<!--- SUFFIX
*/
-->
```kotlin
require(ctx.strategy.metadata.uniqueNames) {
    "Checkpoint feature requires unique node names in the strategy metadata"
}
```

<!--- KNIT example-agent-persistency-01.kt -->

确保为图中的节点设置唯一的名称。

## 安装

要使用 Agent Persistency 特性，请将其添加到智能体的配置中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val executor = simpleOllamaAIExecutor()
-->

```kotlin
val agent = AIAgent(
    executor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistency) {
        // 为快照使用内存存储
        storage = InMemoryPersistencyStorageProvider("in-memory-storage")
        // 启用自动持久化
        enableAutomaticPersistency = true
    }
}
```

<!--- KNIT example-agent-persistency-02.kt -->

## 配置选项

Agent Persistency 特性有两个主要的配置选项：

- **存储提供器**：用于保存和检索检查点的提供器。
- **连续持久化**：在每个节点运行后自动创建检查点。

### 存储提供器

设置将用于保存和检索检查点的存储提供器：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistency) {
    storage = InMemoryPersistencyStorageProvider("in-memory-storage")
}
```

<!--- KNIT example-agent-persistency-03.kt -->

该框架包含以下内置提供器：

- `InMemoryPersistencyStorageProvider`：将检查点存储在内存中（应用程序重启时会丢失）。
- `FilePersistencyStorageProvider`：将检查点持久化到文件系统。
- `NoPersistencyStorageProvider`：一个不存储检查点的无操作实现。这是默认提供器。

你还可以通过实现 `PersistencyStorageProvider` 接口来创建自定义存储提供器。
有关更多信息，请参见 [自定义存储提供器](#custom-storage-providers)。

### 连续持久化

连续持久化意味着在每个节点运行后会自动创建一个检查点。
要激活连续持久化，请使用以下代码：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistency) {
    enableAutomaticPersistency = true
}
```

<!--- KNIT example-agent-persistency-04.kt -->

激活后，智能体将在每个节点执行后自动创建一个检查点，
从而实现细粒度的恢复。

## 基本用法

### 创建检查点

要了解如何在智能体执行过程中的特定点创建检查点，请参见下面的代码示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContextBase) {
    // 使用当前状态创建检查点
    val checkpoint = context.persistency().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
    )

    // 检查点 ID 可以保存供以后使用
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistency-05.kt -->

### 从检查点恢复

要从特定检查点恢复智能体的状态，请遵循以下代码示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
-->

```kotlin
suspend fun example(context: AIAgentContextBase, checkpointId: String) {
    // 回滚到特定检查点
    context.persistency().rollbackToCheckpoint(checkpointId, context)

    // 或回滚到最新的检查点
    context.persistency().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistency-06.kt -->

### 使用扩展函数

Agent Persistency 特性提供了用于处理检查点的便捷扩展函数：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.example.exampleAgentPersistency05.inputData
import ai.koog.agents.example.exampleAgentPersistency05.inputType
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.agents.snapshot.feature.withPersistency
-->

```kotlin
suspend fun example(context: AIAgentContextBase) {
    // 访问检查点特性
    val checkpointFeature = context.persistency()

    // 或使用检查点特性执行操作
    context.withPersistency(context) { ctx ->
        // `this` 是检查点特性
        createCheckpoint(
            agentContext = ctx,
            nodeId = "current-node-id",
            lastInput = inputData,
            lastInputType = inputType,
            checkpointId = ctx.runId,
        )
    }
}
```
<!--- KNIT example-agent-persistency-07.kt -->

## 高级用法

### 自定义存储提供器

你还可以通过实现 `PersistencyStorageProvider` 接口来创建自定义存储提供器：

<!--- INCLUDE
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.providers.PersistencyStorageProvider

/*
// KNIT: Ignore example
-->
<!--- SUFFIX
*/
-->
```kotlin
class MyCustomStorageProvider : PersistencyStorageProvider {
    override suspend fun getCheckpoints(agentId: String): List<AgentCheckpointData> {
        // 实现
    }
    
    override suspend fun saveCheckpoint(agentCheckpointData: AgentCheckpointData) {
        // 实现
    }
    
    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        // 实现
    }
}
```

<!--- KNIT example-agent-persistency-08.kt -->

要在特性配置中使用你的自定义提供器，请在智能体中配置 Agent Persistency 特性时将其设置为存储。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.PersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

class MyCustomStorageProvider : PersistencyStorageProvider {
    override suspend fun getCheckpoints(): List<AgentCheckpointData> {
        TODO("Not yet implemented")
    }

    override suspend fun saveCheckpoint(agentCheckpointData: AgentCheckpointData) {
        TODO("Not yet implemented")
    }

    override suspend fun getLatestCheckpoint(): AgentCheckpointData? {
        TODO("Not yet implemented")
    }
}

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistency) {
    storage = MyCustomStorageProvider()
}
```

<!--- KNIT example-agent-persistency-09.kt -->

### 设置执行点

为了高级控制，你可以直接设置智能体的执行点：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.prompt.message.Message.User
import kotlinx.serialization.json.JsonPrimitive

val customInput = JsonPrimitive("custom-input")
val customMessageHistory = emptyList<User>()
-->

```kotlin
fun example(context: AIAgentContextBase) {
    context.persistency().setExecutionPoint(
        agentContext = context,
        nodeId = "target-node-id",
        messageHistory = customMessageHistory,
        input = customInput
    )
}

```

<!--- KNIT example-agent-persistency-10.kt -->

这允许对智能体的状态进行更细粒度的控制，而不仅仅是从检查点恢复。