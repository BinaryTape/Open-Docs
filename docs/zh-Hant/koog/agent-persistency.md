# 代理程式持久性

代理程式持久性 (Agent Persistency) 是 Koog framework 中為 AI 代理程式提供檢查點 (checkpoint) 功能的特性。
它讓您能夠在執行期間的特定點儲存及還原代理程式的狀態，從而實現以下功能：

- 從特定點恢復代理程式執行
- 回溯到先前的狀態
- 在不同會話中保持代理程式狀態的持久性

## 主要概念

### 檢查點

檢查點會擷取代理程式在執行期間特定點的完整狀態，包括：

- 訊息歷史記錄（使用者、系統、助理和工具之間的所有互動）
- 正在執行的當前節點
- 當前節點的輸入資料
- 建立時間戳記

檢查點由唯一 ID 識別，並與特定代理程式關聯。

## 先決條件

代理程式持久性功能要求您的代理程式策略中的所有節點都具有唯一名稱。
這在安裝此功能時強制執行：

<!--- INCLUDE
/*
KNIT ignore this example
-->
<!--- SUFFIX
*/
-->
```kotlin
require(ctx.strategy.metadata.uniqueNames) {
    "檢查點功能要求策略中所有節點都具有唯一名稱"
}
```

<!--- KNIT example-agent-persistency-01.kt -->

請確保為圖中的節點設定唯一名稱。

## 安裝

要使用代理程式持久性功能，請將其添加到您的代理程式配置中：

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
    promptExecutor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistency) {
        // 使用記憶體內存儲快照
        storage = InMemoryPersistencyStorageProvider("in-memory-storage")
        // 啟用自動持久性
        enableAutomaticPersistency = true
    }
}
```

<!--- KNIT example-agent-persistency-02.kt -->

## 配置選項

代理程式持久性功能有兩個主要配置選項：

- **儲存提供者 (Storage provider)**：用於儲存和擷取檢查點的提供者。
- **連續持久性 (Continuous persistence)**：在每個節點運行後自動建立檢查點。

### 儲存提供者

設定將用於儲存和擷取檢查點的儲存提供者：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
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
install(Persistency) {
    storage = InMemoryPersistencyStorageProvider("in-memory-storage")
}
```

<!--- KNIT example-agent-persistency-03.kt -->

此框架包含以下內建提供者：

- `InMemoryPersistencyStorageProvider`: 將檢查點儲存在記憶體中（應用程式重新啟動時丟失）。
- `FilePersistencyStorageProvider`: 將檢查點持久化到檔案系統。
- `NoPersistencyStorageProvider`: 不儲存檢查點的無操作實作。這是預設提供者。

您還可以透過實作 `PersistencyStorageProvider` 介面來實作自訂儲存提供者。
更多資訊，請參閱[自訂儲存提供者](#custom-storage-providers)。

### 連續持久性

連續持久性表示在每個節點運行後會自動建立檢查點。
要啟用連續持久性，請使用以下程式碼：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
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
install(Persistency) {
    enableAutomaticPersistency = true
}
```

<!--- KNIT example-agent-persistency-04.kt -->

啟用後，代理程式將在每個節點執行後自動建立檢查點，
從而實現細粒度恢復。

## 基本用法

### 建立檢查點

要了解如何在代理程式執行的特定點建立檢查點，請參閱下面的程式碼範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistency
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 使用當前狀態建立檢查點
    val checkpoint = context.persistency().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
    )

    // 檢查點 ID 可以儲存供以後使用
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistency-05.kt -->

### 從檢查點還原

要從特定檢查點還原代理程式的狀態，請按照下面的程式碼範例操作：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistency
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 回溯到特定檢查點
    context.persistency().rollbackToCheckpoint(checkpointId, context)

    // 或回溯到最新的檢查點
    context.persistency().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistency-06.kt -->

### 使用擴充函數

代理程式持久性功能提供方便的擴充函數，用於處理檢查點：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistency05.inputData
import ai.koog.agents.example.exampleAgentPersistency05.inputType
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.agents.snapshot.feature.withPersistency
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 存取檢查點功能
    val checkpointFeature = context.persistency()

    // 或使用檢查點功能執行操作
    context.withPersistency(context) { ctx ->
        // 'this' 是檢查點功能
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

## 進階用法

### 自訂儲存提供者

您可以透過實作 `PersistencyStorageProvider` 介面來實作自訂儲存提供者：

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
        // Implementation
    }
    
    override suspend fun saveCheckpoint(agentCheckpointData: AgentCheckpointData) {
        // Implementation
    }
    
    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        // Implementation
    }
}
```

<!--- KNIT example-agent-persistency-08.kt -->

要在功能配置中使用您的自訂提供者，請在代理程式中配置代理程式持久性功能時將其設定為儲存。

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
    promptExecutor = simpleOllamaAIExecutor(),
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

### 設定執行點

為了進行進階控制，您可以直接設定代理程式的執行點：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.prompt.message.Message.User
import kotlinx.serialization.json.JsonPrimitive

val customInput = JsonPrimitive("custom-input")
val customMessageHistory = emptyList<User>()
-->

```kotlin
fun example(context: AIAgentContext) {
    context.persistency().setExecutionPoint(
        agentContext = context,
        nodeId = "target-node-id",
        messageHistory = customMessageHistory,
        input = customInput
    )
}

```

<!--- KNIT example-agent-persistency-10.kt -->

這允許對代理程式的狀態進行更細粒度的控制，而不僅僅是從檢查點還原。