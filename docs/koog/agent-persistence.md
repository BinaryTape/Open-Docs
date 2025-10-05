# 智能体持久化

智能体持久化是一种特性，它为 Koog 框架中的 AI 智能体提供检查点功能。它允许你在执行期间的特定点保存和恢复智能体的状态，从而实现以下功能：

- 从特定点恢复智能体执行。
- 回滚到以前的状态。
- 在会话间持久化智能体状态。

## 关键概念

### 检查点

检查点捕获了智能体在其执行中特定点的完整状态，包括：

- 消息历史（用户、系统、助手和工具之间的所有交互）。
- 当前正在执行的节点。
- 当前节点的输入数据。
- 创建时间戳。

检查点通过唯一 ID 标识，并与特定智能体相关联。

## 前提条件

智能体持久化特性要求智能体策略中的所有节点都具有唯一名称。在安装此特性时会强制执行此要求：

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

<!--- KNIT example-agent-persistence-01.kt -->

确保为图中的节点设置唯一名称。

## 安装

要使用智能体持久化特性，请将其添加到智能体的配置中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val executor = simpleOllamaAIExecutor()
-->

```kotlin
val agent = AIAgent(
    promptExecutor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistence) {
        // Use in-memory storage for snapshots
        storage = InMemoryPersistenceStorageProvider()
        // Enable automatic persistence
        enableAutomaticPersistence = true
    }
}
```

<!--- KNIT example-agent-persistence-02.kt -->

## 配置选项

智能体持久化特性有两个主要的配置选项：

- **存储提供者**：用于保存和检索检查点的提供者。
- **持续持久化**：在每个节点运行后自动创建检查点。

### 存储提供者

设置将用于保存和检索检查点的存储提供者：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistence) {
    storage = InMemoryPersistenceStorageProvider()
}
```

<!--- KNIT example-agent-persistence-03.kt -->

该框架包含以下内置提供者：

- `InMemoryPersistenceStorageProvider`：将检查点存储在内存中（应用程序重启后会丢失）。
- `FilePersistenceStorageProvider`：将检查点持久化到文件系统。
- `NoPersistenceStorageProvider`：一个空操作实现，不存储检查点。这是默认提供者。

你也可以通过实现 `PersistenceStorageProvider` 接口来实现自定义存储提供者。关于更多信息，请参见 [自定义存储提供者](#custom-storage-providers)。

### 持续持久化

持续持久化意味着在每个节点运行后自动创建一个检查点。要激活持续持久化，请使用以下代码：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistence) {
    enableAutomaticPersistence = true
}
```

<!--- KNIT example-agent-persistence-04.kt -->

激活后，智能体将在每个节点执行后自动创建一个检查点，从而实现细粒度恢复。

## 基本用法

### 创建检查点

要了解如何在智能体执行的特定点创建检查点，请参见以下代码示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // Create a checkpoint with the current state
    val checkpoint = context.persistence().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
    )

    // The checkpoint ID can be stored for later use
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-05.kt -->

### 从检查点恢复

要从特定检查点恢复智能体的状态，请遵循以下代码示例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // Roll back to a specific checkpoint
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // Or roll back to the latest checkpoint
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-06.kt -->

#### 回滚工具产生的所有副作用

某些工具产生副作用是很常见的。具体来说，当你后端运行智能体时，某些工具很可能会执行一些数据库事务。这使得智能体更难“时光倒流”。

想象一下，你有一个名为 `createUser` 的工具，它在数据库中创建一个新用户。并且你的智能体随着时间推移执行了多个工具调用：
```
tool call: createUser "Alex"

->>>> checkpoint-1 <<<<-

tool call: createUser "Daniel"
tool call: createUser "Maria"
```

现在你想回滚到一个检查点。仅仅恢复智能体的状态（包括消息历史和策略图节点）不足以实现检查点之前的确切“世界状态”。你还应该恢复工具调用产生的副作用。在我们的示例中，这意味着从数据库中删除 `Maria` 和 `Daniel`。

通过 Koog 持久化，你可以通过向 `Persistence` 特性配置提供一个 `RollbackToolRegistry` 来实现这一点：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import ai.koog.agents.snapshot.feature.RollbackToolRegistry
import ai.koog.agents.snapshot.feature.registerRollback

fun createUser(name: String) {}

fun removeUser(name: String) {}

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistence) {
    enableAutomaticPersistence = true
    rollbackToolRegistry = RollbackToolRegistry {
        // 对于每次 `createUser` 工具调用，当回滚到期望的执行点时，都将以相反的顺序调用 `removeUser`。
        // 注意：`removeUser` 工具应与 `createUser` 接受完全相同的实参。
        // 开发者有责任确保 `removeUser` 调用回滚 `createUser` 的所有副作用：
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-07.kt -->

### 使用扩展函数

智能体持久化特性提供了方便的扩展函数来处理检查点：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence05.inputData
import ai.koog.agents.example.exampleAgentPersistence05.inputType
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.agents.snapshot.feature.withPersistence
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 访问检查点特性
    val checkpointFeature = context.persistence()

    // 或者使用检查点特性执行操作
    context.withPersistence { ctx ->
        // 'this' 是检查点特性
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
<!--- KNIT example-agent-persistence-08.kt -->

## 高级用法

### 自定义存储提供者

你可以通过实现 `PersistenceStorageProvider` 接口来实现自定义存储提供者：

<!--- INCLUDE
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.providers.PersistenceStorageProvider

/*
// KNIT: Ignore example
-->
<!--- SUFFIX
*/
-->
```kotlin
class MyCustomStorageProvider : PersistenceStorageProvider {
    override suspend fun getCheckpoints(agentId: String): List<AgentCheckpointData> {
        // 实现
    }
    
    override suspend fun saveCheckpoint(agentId: String, agentCheckpointData: AgentCheckpointData) {
        // 实现
    }
    
    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        // 实现
    }
}
```

<!--- KNIT example-agent-persistence-09.kt -->

要在特性配置中使用自定义提供者，请在智能体中配置智能体持久化特性时，将其设置为存储。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.PersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

class MyCustomStorageProvider : PersistenceStorageProvider {
    override suspend fun getCheckpoints(agentId: String): List<AgentCheckpointData> {
        TODO("Not yet implemented")
    }

    override suspend fun saveCheckpoint(agentId: String, agentCheckpointData: AgentCheckpointData) {
        TODO("Not yet implemented")
    }

    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        TODO("Not yet implemented")
    }
}

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
-->
<!--- SUFFIX 
} 
-->

```kotlin
install(Persistence) {
    storage = MyCustomStorageProvider()
}
```

<!--- KNIT example-agent-persistence-10.kt -->

### 设置执行点

为了进行高级控制，你可以直接设置智能体的执行点：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.prompt.message.Message.User
import kotlinx.serialization.json.JsonPrimitive

val customInput = JsonPrimitive("custom-input")
val customMessageHistory = emptyList<User>()
-->

```kotlin
fun example(context: AIAgentContext) {
    context.persistence().setExecutionPoint(
        agentContext = context,
        nodeId = "target-node-id",
        messageHistory = customMessageHistory,
        input = customInput
    )
}

```

<!--- KNIT example-agent-persistence-11.kt -->

这允许对智能体的状态进行更细粒度的控制，而不仅仅是从检查点恢复。