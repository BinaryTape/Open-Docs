# 智能体持久化

智能体持久化是一种**特性**，它为 Koog framework 中的 **AI 智能体**提供了检查点功能。它允许你在**执行**期间的特定点保存和恢复**智能体**的**状态**，从而实现以下**功能**：

- 从特定点恢复**智能体执行**
- 回滚到以前的**状态**
- 在**会话**间持久化**智能体状态**

## 关键概念

### 检查点

**检查点**捕获了**智能体**在其**执行**中特定点的完整**状态**，包括：

- 消息历史（用户、系统、助手和 tool 之间的所有**交互**）
- 当前正在**执行**的**节点**
- 当前**节点**的输入数据
- **创建时间戳**

**检查点**通过唯一 ID 标识，并与特定**智能体**相关联。

## 安装

要使用**智能体持久化特性**，请将其添加到你的**智能体**的**配置**中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import ai.koog.agents.core.agent.context.RollbackStrategy

val executor = simpleOllamaAIExecutor()
-->

```kotlin
val agent = AIAgent(
    promptExecutor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistence) {
        // 为快照使用内存存储
        storage = InMemoryPersistenceStorageProvider()
        // 在每个节点后启用自动持久化
        enableAutomaticPersistence = true
        /*
         选择在新智能体运行时要恢复的状态。
     
         可用选项有：
         1. Default：将智能体恢复到其停止时的确切执行点（strategy graph 中的节点）。
            这对于构建复杂、容错的智能体特别有用。
         2. MessageHistoryOnly：仅将消息历史恢复到最后保存的状态。
            智能体将始终从 strategy graph 中的第一个节点重新启动，但会带有之前运行的历史记录。
            这对于构建对话式智能体或聊天机器人很有用。
        */
        rollbackStrategy = RollbackStrategy.MessageHistoryOnly
    }
}
```

!!! tip
    将 `enableAutomaticPersistence = true` 与 `RollbackStrategy.MessageHistoryOnly` 结合使用，可创建在多个会话中维护对话上下文的智能体。

<!--- KNIT example-agent-persistence-01.kt -->

## 配置选项

**智能体持久化特性**有三个主要的**配置**选项：

- **存储提供者**：用于保存和检索**检查点**的提供者。
- **持续持久化**：在每个**节点**运行后自动**创建检查点**。
- **回滚策略**：决定回滚到**检查点**时要恢复哪个状态。

### 存储提供者

设置将用于保存和检索**检查点**的**存储提供者**：

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

<!--- KNIT example-agent-persistence-02.kt -->

该 framework 包含以下内置提供者：

- `InMemoryPersistenceStorageProvider`：将**检查点**存储在内存中（**应用程序**重启后会丢失）。
- `FilePersistenceStorageProvider`：将**检查点**持久化到文件系统。
- `NoPersistenceStorageProvider`：一个空操作符实现，不存储**检查点**。这是默认提供者。

你也可以通过实现 `PersistenceStorageProvider` **接口**来**实现自定义存储提供者**。关于更多信息，请参见 [自定义存储提供者](#custom-storage-providers)。

### 持续持久化

**持续持久化**意味着在每个**节点**运行后自动**创建检查点**。要激活**持续持久化**，请使用以下**代码块**：

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

<!--- KNIT example-agent-persistence-03.kt -->

激活后，**智能体**将在每个**节点执行**后自动**创建一个检查点**，从而实现**细粒度恢复**。

### 回滚策略

回滚策略决定了当**智能体**回滚到**检查点**或开始新的运行时，要恢复哪个状态。有两种可用的策略：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.agents.core.agent.context.RollbackStrategy
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
    // 默认策略：恢复包括执行点在内的完整智能体状态
    rollbackStrategy = RollbackStrategy.Default
}
```

<!--- KNIT example-agent-persistence-04.kt -->

**`RollbackStrategy.Default`**

将**智能体**恢复到其停止时的确切执行点（strategy graph 中的**节点**）。这意味着将恢复整个上下文，包括：

- 消息历史
- 当前正在**执行**的**节点**
- 任何其他有状态数据

此策略对于构建需要从其停止的确切点恢复的复杂、容错的**智能体**特别有用。

**`RollbackStrategy.MessageHistoryOnly`**

仅将消息历史恢复到最后保存的**状态**。**智能体**将始终从 strategy graph 中的第一个**节点**重新启动，但会带有之前运行的对话历史记录。

此策略对于构建需要跨多个会话维护上下文，但应始终从头开始执行流的对话式**智能体**或聊天机器人很有用。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.agents.core.agent.context.RollbackStrategy
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
    // MessageHistoryOnly 策略：保留对话历史记录但重新启动执行
    rollbackStrategy = RollbackStrategy.MessageHistoryOnly
}
```

<!--- KNIT example-agent-persistence-05.kt -->

## 基本用法

### 创建检查点

要了解如何在**智能体执行**的特定点**创建检查点**，请参见以下**代码块**：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 使用当前状态创建检查点
    val checkpoint = context.persistence().createCheckpoint(
        agentContext = context,
        nodePath = context.executionInfo.path(),
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
        version = 0L
    )

    // 检查点 ID 可以存储以供后续使用
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-06.kt -->

### 从检查点恢复

要从特定**检查点**恢复**智能体**的**状态**，请遵循以下**代码块**：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 回滚到特定检查点
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // 或者回滚到最新检查点
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-07.kt -->

#### 回滚 tool 产生的所有副作用

某些 tool 产生**副作用**是很常见的。具体来说，当你后端运行**智能体**时，某些 tool 很可能会执行一些**数据库事务**。这使得你的**智能体**更难“**时光倒流**”。

想象一下，你有一个名为 `createUser` 的 tool，它在你的**数据库**中**创建**一个新用户。并且你的**智能体**随着时间推移**执行**了多个 tool 调用：
```
tool call: createUser "Alex"

->>>> checkpoint-1 <<<<-

tool call: createUser "Daniel"
tool call: createUser "Maria"
```

现在你想回滚到一个**检查点**。仅仅恢复**智能体**的**状态**（包括消息历史和 strategy graph node）不足以实现**检查点**之前的确切“世界**状态**”。你还应该恢复你的 tool 调用产生的**副作用**。在我们的示例中，这意味着从**数据库**中删除 `Maria` 和 `Daniel`。

通过 Koog Persistence，你可以通过向 `Persistence` **特性配置**提供一个 `RollbackToolRegistry` 来实现这一点：

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
        // 对于每次 `createUser` tool 调用，当回滚到期望的执行点时，都将以相反的顺序调用 `removeUser`。
        // 注意：`removeUser` tool 应该接受与 `createUser` 完全相同的实参。
        // 开发者有责任确保 `removeUser` 调用回滚 `createUser` 的所有副作用：
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-08.kt -->

### 使用扩展函数

**智能体持久化特性**提供了方便的**扩展函数**来处理**检查点**：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence06.inputData
import ai.koog.agents.example.exampleAgentPersistence06.inputType
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
            nodePath = ctx.executionInfo.path(),
            lastInput = inputData,
            lastInputType = inputType,
            checkpointId = ctx.runId,
            version = 0L
        )
    }
}
```
<!--- KNIT example-agent-persistence-09.kt -->

## 高级用法

### 自定义存储提供者

你可以通过实现 `PersistenceStorageProvider` **接口**来**实现自定义存储提供者**：

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
class MyCustomStorageProvider<MyFilterType> : PersistenceStorageProvider<MyFilterType> {
    override suspend fun getCheckpoints(agentId: String, filter: MyFilterType?): List<AgentCheckpointData> {
        TODO("Not yet implemented")
    }

    override suspend fun saveCheckpoint(agentId: String, agentCheckpointData: AgentCheckpointData) {
        TODO("Not yet implemented")
    }

    override suspend fun getLatestCheckpoint(agentId: String, filter: MyFilterType?): AgentCheckpointData? {
        TODO("Not yet implemented")
    }
}

```

<!--- KNIT example-agent-persistence-10.kt -->

要在**特性配置**中使用你的**自定义提供者**，请在你的**智能体**中**配置智能体持久化特性**时，将其设置为**存储**。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.PersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

class MyCustomStorageProvider<MyFilterType> : PersistenceStorageProvider<MyFilterType> {
    override suspend fun getCheckpoints(agentId: String, filter: MyFilterType?): List<AgentCheckpointData> {
        TODO("Not yet implemented")
    }

    override suspend fun saveCheckpoint(agentId: String, agentCheckpointData: AgentCheckpointData) {
        TODO("Not yet implemented")
    }

    override suspend fun getLatestCheckpoint(agentId: String, filter: MyFilterType?): AgentCheckpointData? {
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
    storage = MyCustomStorageProvider<Any>()
}
```

<!--- KNIT example-agent-persistence-11.kt -->

### 设置执行点

为了进行**高级控制**，你可以直接设置**智能体**的**执行点**：

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
        nodePath = context.executionInfo.path(),
        messageHistory = customMessageHistory,
        input = customInput
    )
}

```

<!--- KNIT example-agent-persistence-12.kt -->

这允许对**智能体**的**状态**进行更**细粒度**的**控制**，而不仅仅是从**检查点恢复**。