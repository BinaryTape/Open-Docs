# Agent 持久化

Agent 持久化是一項為 Koog 架構中的 AI Agent 提供檢查點（checkpoint）功能的特性。
它讓您可以儲存並在執行過程中的特定點回復 Agent 的狀態，從而實現以下功能：

- 從特定點恢復 Agent 執行
- 回復至先前的狀態
- 在不同工作階段之間持久化 Agent 狀態

## 核心概念

### 檢查點 (Checkpoints)

檢查點會擷取 Agent 在執行過程中特定點的完整狀態，包括：

- 訊息歷程記錄（使用者、系統、小助手與工具之間的所有互動）
- 目前正在執行的節點
- 目前節點的輸入資料
- 建立的時間戳記

檢查點由唯一 ID 識別，並與特定的 Agent 相關聯。

## 安裝

要使用 Agent 持久化特性，請將其新增至您的 Agent 配置中：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.agents.core.agent.context.RollbackStrategy

val executor = simpleOllamaAIExecutor()
-->

```kotlin
val agent = AIAgent(
    promptExecutor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistence) {
        // 使用記憶體內存儲來存放快照
        storage = InMemoryPersistenceStorageProvider()
        // 啟用在每個節點執行後自動持久化
        enableAutomaticPersistence = true
        /* 
         選擇在新 Agent 執行時回復哪種狀態。
     
         可用選項包括：
         1. Default：將 Agent 回復到停止時的確切執行點（策略圖中的節點）。
            這對於建構複雜、具備容錯能力的 Agent 特別有用。
         2. MessageHistoryOnly：僅將訊息歷程記錄回復到最後儲存的狀態。
            Agent 將一律從策略圖中的第一個節點重新開始，但帶有先前執行的歷程記錄。
            這對於建構對話式 Agent 或聊天機器人非常有用。
        */
        rollbackStrategy = RollbackStrategy.MessageHistoryOnly
    }
}
```

!!! tip
    將 `enableAutomaticPersistence = true` 與 `RollbackStrategy.MessageHistoryOnly` 結合使用，可以建立在多個工作階段之間維持對話內容資訊的 Agent。    

<!--- KNIT example-agent-persistence-01.kt -->

## 配置選項

Agent 持久化特性有三個主要的配置選項：

- **儲存提供者 (Storage provider)**：用於儲存與檢索檢查點的提供者。
- **連續持久化 (Continuous persistence)**：在每個節點執行後自動建立檢查點。
- **回復策略 (Rollback strategy)**：決定在回復至檢查點時將回復哪些狀態。

### 儲存提供者 (Storage provider)

設定用於儲存與檢索檢查點的儲存提供者：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

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

該架構包含以下內建提供者：

- `InMemoryPersistenceStorageProvider`：將檢查點儲存在記憶體中（應用程式重啟時會遺失）。
- `FilePersistenceStorageProvider`：將檢查點持久化到檔案系統。
- `NoPersistenceStorageProvider`：不儲存檢查點的無操作 (no-op) 實作。這是預設的提供者。

您也可以透過實作 `PersistenceStorageProvider` 介面來實作自訂儲存提供者。
如需更多資訊，請參閱 [自訂儲存提供者](#自訂儲存提供者)。

### 連續持久化 (Continuous persistence)

連續持久化意味著在每個節點執行後都會自動建立一個檢查點。
要啟動連續持久化，請使用以下程式碼：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

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

啟動後，Agent 將在每個節點執行後自動建立檢查點，以便進行細粒度的復原。

### 回復策略 (Rollback strategy)

回復策略決定了當 Agent 回復到檢查點或啟動新執行時，將回復哪些狀態。
有兩種可用的策略：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.agents.core.agent.context.RollbackStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

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
    // 預設策略：回復完整的 Agent 狀態，包括執行點
    rollbackStrategy = RollbackStrategy.Default
}
```

<!--- KNIT example-agent-persistence-04.kt -->

**`RollbackStrategy.Default`**

將 Agent 回復到其停止時的確切執行點（策略圖中的節點）。
這意味著整個內容資訊都會被回復，包括：

- 訊息歷程記錄
- 目前正在執行的節點
- 任何其他具備狀態的資料

此策略對於建構複雜、具備容錯能力且需要從中斷處精確恢復的 Agent 特別有用。

**`RollbackStrategy.MessageHistoryOnly`**

僅將訊息歷程記錄回復到最後儲存的狀態。Agent 將一律從策略圖中的第一個節點重新開始，但保有先前執行的對話歷程記錄。

此策略適用於建構對話式 Agent 或聊天機器人，它們需要在多個工作階段中維持內容資訊，但應一律從頭開始其執行流程。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.agents.core.agent.context.RollbackStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

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
    // MessageHistoryOnly 策略：保留對話歷程記錄但重新啟動執行
    rollbackStrategy = RollbackStrategy.MessageHistoryOnly
}
```

<!--- KNIT example-agent-persistence-05.kt -->

## 基本用法

### 建立檢查點

若要了解如何在 Agent 執行的特定點建立檢查點，請參閱下方的程式碼範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val outputData = "some-output-data"
val outputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 建立帶有目前狀態的檢查點
    val checkpoint = context.persistence().createCheckpointAfterNode(
        agentContext = context,
        nodePath = context.executionInfo.path(),
        lastOutput = outputData,
        lastOutputType = outputType,
        checkpointId = context.runId,
        version = 0L
    )

    // 檢查點 ID 可以儲存供以後使用
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-06.kt -->

### 從檢查點回復

若要從特定檢查點回復 Agent 的狀態，請參考下方的程式碼範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 回復至特定的檢查點
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // 或者回復至最新的檢查點
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-07.kt -->

#### 回復由工具產生的所有副作用

某些工具產生副作用是非常常見的。具體來說，當您在後端執行 Agent 時，某些工具可能會執行一些資料庫交易。這使得您的 Agent 進行時光旅行（回復到過去）變得更加困難。

想像一下，您有一個工具 `createUser` 會在資料庫中建立一個新使用者。而您的 Agent 隨著時間產生了多個工具呼叫：
```
工具呼叫：createUser "Alex"

->>>> 檢查點-1 <<<<-

工具呼叫：createUser "Daniel"
工具呼叫：createUser "Maria"
```

現在您想要回復到某個檢查點。僅僅回復 Agent 的狀態（包括訊息歷程記錄和策略圖節點）不足以實現檢查點之前的確切世界狀態。您還應該回復由工具呼叫產生的副作用。在我們的範例中，這意味著要從資料庫中移除 `Maria` 和 `Daniel`。

使用 Koog Persistence，您可以透過在 `Persistence` 特性配置中提供 `RollbackToolRegistry` 來達成此目的：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.InMemoryPersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import ai.koog.agents.snapshot.feature.RollbackToolRegistry

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
        // 對於每個 `createUser` 工具呼叫，在回復到所需的執行點時，
        // 將以相反的順序調用 `removeUser`。
        // 注意：`removeUser` 工具應採用與 `createUser` 完全相同的引數。
        // 開發人員有責任確保 `removeUser` 的調用能回復 `createUser` 的所有副作用：
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-08.kt -->

### 使用擴充函式

Agent 持久化特性提供了便於操作檢查點的擴充函式：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence06.outputData
import ai.koog.agents.example.exampleAgentPersistence06.outputType
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.agents.snapshot.feature.withPersistence
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 存取檢查點特性
    val checkpointFeature = context.persistence()

    // 或者使用檢查點特性執行操作
    context.withPersistence { ctx ->
        // 'this' 即為檢查點特性
        createCheckpointAfterNode(
            agentContext = ctx,
            nodePath = ctx.executionInfo.path(),
            lastOutput = outputData,
            lastOutputType = outputType,
            checkpointId = ctx.runId,
            version = 0L
        )
    }
}
```
<!--- KNIT example-agent-persistence-09.kt -->

## 進階用法

### 自訂儲存提供者

您可以透過實作 `PersistenceStorageProvider` 介面來實作自訂儲存提供者：

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
    override suspend fun getCheckpoints(sessionId: String, filter: MyFilterType?): List<AgentCheckpointData> {
        TODO("尚未實作")
    }

    override suspend fun saveCheckpoint(sessionId: String, agentCheckpointData: AgentCheckpointData) {
        TODO("尚未實作")
    }

    override suspend fun getLatestCheckpoint(sessionId: String, filter: MyFilterType?): AgentCheckpointData? {
        TODO("尚未實作")
    }
}

```

<!--- KNIT example-agent-persistence-10.kt -->

要在特性配置中使用您的自訂提供者，請在 Agent 中配置 Agent 持久化特性時將其設定為儲存。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.AgentCheckpointData
import ai.koog.agents.snapshot.feature.Persistence
import ai.koog.agents.snapshot.providers.PersistenceStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

class MyCustomStorageProvider<MyFilterType> : PersistenceStorageProvider<MyFilterType> {
    override suspend fun getCheckpoints(sessionId: String, filter: MyFilterType?): List<AgentCheckpointData> {
        TODO("尚未實作")
    }

    override suspend fun saveCheckpoint(sessionId: String, agentCheckpointData: AgentCheckpointData) {
        TODO("尚未實作")
    }

    override suspend fun getLatestCheckpoint(sessionId: String, filter: MyFilterType?): AgentCheckpointData? {
        TODO("尚未實作")
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

### 設定執行點

為了進行進階控制，您可以直接設定 Agent 的執行點：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.prompt.message.Message.User
import kotlinx.serialization.json.JsonPrimitive

val customInput = JsonPrimitive("custom-input")
val customOutput = JsonPrimitive("custom-output")
val customMessageHistory = emptyList<User>()
-->

```kotlin
fun example(context: AIAgentContext) {
    // 您可以在某個節點之前設定執行點，並為其提供輸入：
    context.persistence().setExecutionPoint(
        agentContext = context,
        nodePath = context.executionInfo.path(),
        messageHistory = customMessageHistory,
        input = customInput
    )

    // 或者在某個節點之後設定執行點，並提供該節點的輸出：
    context.persistence().setExecutionPointAfterNode(
        agentContext = context,
        nodePath = context.executionInfo.path(),
        messageHistory = customMessageHistory,
        output = customOutput
    )
}

```

<!--- KNIT example-agent-persistence-12.kt -->

除了僅僅從檢查點回復之外，這還允許對 Agent 的狀態進行更細粒度的控制。