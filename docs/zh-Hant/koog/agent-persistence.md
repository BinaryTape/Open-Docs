# 代理程式持久性

代理程式持久性是 Koog 框架中為 AI 智能體提供檢查點功能的一個特性。它允許您在執行期間的特定時間點儲存和恢復智能體的狀態，從而實現以下功能：

- 從特定點恢復智能體執行
- 回溯到先前的狀態
- 跨會話持久化智能體狀態

## 關鍵概念

### 檢查點

檢查點捕獲智能體在其執行過程中特定時間點的完整狀態，包括：

- 訊息歷史 (使用者、系統、助理和工具之間的所有互動)
- 目前正在執行的節點
- 目前節點的輸入資料
- 建立時間戳記

檢查點由唯一 ID 識別，並與特定智能體關聯。

## 安裝

若要使用代理程式持久性功能，請將其新增至智能體的設定中：

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
        // 將快照儲存在記憶體中
        storage = InMemoryPersistenceStorageProvider()
        // 在每個節點執行後啟用自動持久化
        enableAutomaticPersistence = true
        /* 
         選擇在新智能體執行時要恢復哪個狀態。
     
         可用的選項有：
         1. Default：將智能體恢復到其停止時的確切執行點（策略圖中的節點）。
            這對於建立複雜、容錯的智能體特別有用。
         2. MessageHistoryOnly：僅將訊息歷史恢復到上次儲存的狀態。
            智能體將始終從策略圖中的第一個節點重新啟動，但會帶有先前執行的歷史記錄。
            這對於建立對話式智能體或聊天機器人很有用。
        */
        rollbackStrategy = RollbackStrategy.MessageHistoryOnly
    }
}
```

!!! tip
    將 `enableAutomaticPersistence = true` 與 `RollbackStrategy.MessageHistoryOnly` 結合使用，可建立在多個會話中維持對話上下文的智能體。    

<!--- KNIT example-agent-persistence-01.kt -->

## 設定選項

代理程式持久性功能有三個主要設定選項：

- **儲存提供者**：用於儲存和擷取檢查點的提供者。
- **持續性持久化**：在每個節點執行後自動建立檢查點。
- **回溯策略**：決定在回溯到檢查點時將恢復哪個狀態。

### 儲存提供者

設定將用於儲存和擷取檢查點的儲存提供者：

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

此框架包含以下內建提供者：

- `InMemoryPersistenceStorageProvider`：將檢查點儲存在記憶體中（應用程式重新啟動時會遺失）。
- `FilePersistenceStorageProvider`：將檢查點持久化到檔案系統。
- `NoPersistenceStorageProvider`：一個不執行任何操作的實作，不儲存檢查點。這是預設提供者。

您也可以透過實作 `PersistenceStorageProvider` 介面來實作自訂儲存提供者。有關更多資訊，請參閱 [自訂儲存提供者](#custom-storage-providers)。

### 持續性持久化

持續性持久化表示在每個節點執行後自動建立檢查點。若要啟用持續性持久化，請使用以下程式碼：

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

啟用後，智能體將在每個節點執行後自動建立檢查點，從而實現細粒度的恢復。

### 回溯策略

回溯策略決定了當智能體回溯到檢查點或開始新的執行時，將恢復哪個狀態。有兩種可用的策略：

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
    // 預設策略：恢復完整的智能體狀態，包括執行點
    rollbackStrategy = RollbackStrategy.Default
}
```

<!--- KNIT example-agent-persistence-04.kt -->

**`RollbackStrategy.Default`**

將智能體恢復到其停止時的確切執行點（策略圖中的節點）。這表示將恢復整個上下文，包括：

- 訊息歷史
- 目前正在執行的節點
- 任何其他有狀態資料

這對於建立複雜、容錯的智能體特別有用，這些智能體需要從其離開的確切點恢復執行。

**`RollbackStrategy.MessageHistoryOnly`**

僅將訊息歷史恢復到上次儲存的狀態。智能體將始終從策略圖中的第一個節點重新啟動，但會帶有先前執行的對話歷史記錄。

這對於建立對話式智能體或聊天機器人很有用，這些智能體需要在多個會話中維持上下文，但應始終從頭開始執行流程。

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
    // MessageHistoryOnly 策略：保留對話歷史，但重新啟動執行
    rollbackStrategy = RollbackStrategy.MessageHistoryOnly
}
```

<!--- KNIT example-agent-persistence-05.kt -->

## 基本用法

### 建立檢查點

若要了解如何在智能體執行的特定時間點建立檢查點，請參閱以下程式碼範例：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 建立目前狀態的檢查點
    val checkpoint = context.persistence().createCheckpoint(
        agentContext = context,
        nodePath = context.executionInfo.path(),
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
        version = 0L
    )

    // 檢查點 ID 可以儲存供以後使用
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-06.kt -->

### 從檢查點恢復

若要從特定檢查點恢復智能體的狀態，請依照以下程式碼範例操作：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 回溯到特定檢查點
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // 或回溯到最新的檢查點
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-07.kt -->

#### 回溯工具產生的所有副作用

某些工具產生副作用是很常見的。特別是當您在後端執行智能體時，某些工具可能會執行資料庫交易。這使得智能體很難回溯時間。

想像一下，您有一個 `createUser` 工具，可以在資料庫中建立一個新使用者。而您的智能體在一段時間內發出了多次工具呼叫：
```
tool call: createUser "Alex"

->>>> checkpoint-1 <<<<-

tool call: createUser "Daniel"
tool call: createUser "Maria"
```

現在您想要回溯到一個檢查點。僅恢復智能體的狀態（包括訊息歷史和策略圖節點）不足以達到檢查點之前的確切世界狀態。您還應該恢復工具呼叫產生的副作用。在我們的範例中，這意味著從資料庫中刪除 `Maria` 和 `Daniel`。

透過 Koog 持久性，您可以透過向 `Persistence` 功能設定提供 `RollbackToolRegistry` 來實現這一點：

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
        // 對於每次 `createUser` 工具呼叫，當回溯到所需的執行點時，都會以相反順序呼叫 `removeUser`。
        // 注意：`removeUser` 工具應採用與 `createUser` 相同確切的參數。
        // 確保 `removeUser` 呼叫回溯 `createUser` 的所有副作用是開發人員的責任：
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-08.kt -->

### 使用延伸函式

代理程式持久性功能提供了便利的延伸函式，用於處理檢查點：

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence06.inputData
import ai.koog.agents.example.exampleAgentPersistence06.inputType
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.agents.snapshot.feature.withPersistence
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 存取檢查點功能
    val checkpointFeature = context.persistence()

    // 或使用檢查點功能執行動作
    context.withPersistence { ctx ->
        // 'this' 是檢查點功能
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

若要在功能設定中使用您的自訂提供者，請在為智能體設定代理程式持久性功能時將其設定為儲存。

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

### 設定執行點

對於進階控制，您可以直接設定智能體的執行點：

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

這允許對智能體的狀態進行比僅從檢查點恢復更細粒度的控制。