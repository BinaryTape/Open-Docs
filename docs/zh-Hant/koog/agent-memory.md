# 記憶體

## 功能概述

`AgentMemory` 功能是 `Koog` 框架的一個元件，可讓 AI 代理程式在不同的對話中儲存、檢索和使用資訊。

### 目的

`AgentMemory` 功能透過以下方式解決了在 AI 代理程式互動中維持上下文的挑戰：

- 儲存從對話中提取的重要事實。
- 依概念、主題和範圍組織資訊。
- 在未來互動中需要時檢索相關資訊。
- 根據使用者偏好和歷史紀錄啟用個人化。

### 架構

`AgentMemory` 功能建立在一個階層式結構上。
該結構的元素在以下各節中列出並解釋。

#### 事實

***事實 (Facts)*** 是儲存在記憶體中的獨立資訊片段。
事實代表實際儲存的資訊。
事實有兩種型別：

- **SingleFact**：與概念相關聯的單一值。例如，IDE 使用者目前偏好的主題：
<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.SingleFact
import kotlinx.datetime.Clock
-->
```kotlin
// 儲存常用 IDE 主題 (單一值)
val themeFact = SingleFact(
    concept = Concept(
        "ide-theme", 
        "User's preferred IDE theme", 
        factType = FactType.SINGLE),
    value = "Dark Theme",
    timestamp = Clock.System.now().toEpochMilliseconds(),
)
```
<!--- KNIT example-agent-memory-01.kt -->
- **MultipleFacts**：與概念相關聯的多個值。例如，使用者已知的所有語言：
<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MultipleFacts
import kotlinx.datetime.Clock
-->
```kotlin
// 儲存程式語言 (多個值)
val languagesFact = MultipleFacts(
    concept = Concept(
        "programming-languages",
        "Languages the user knows",
        factType = FactType.MULTIPLE
    ),
    values = listOf("Kotlin", "Java", "Python"),
    timestamp = Clock.System.now().toEpochMilliseconds(),
)
```
<!--- KNIT example-agent-memory-02.kt -->

#### 概念

***概念 (Concepts)*** 是具有相關中繼資料的資訊類別。

- **Keyword**：概念的唯一識別符號。
- **Description**：對概念所代表內容的詳細解釋。
- **FactType**：概念儲存單一事實還是多個事實（`FactType.SINGLE` 或 `FactType.MULTIPLE`）。

#### 主題

***主題 (Subjects)*** 是事實可與之關聯的實體。

主題的常見範例包括：

- **User**：個人偏好與設定
- **Environment**：與應用程式環境相關的資訊

有一個預定義的 `MemorySubject.Everything`，您可以將其用作所有事實的預設主題。此外，您可以透過擴展 `MemorySubject` 抽象類別來定義自己的自訂記憶體主題：

<!--- INCLUDE
import ai.koog.agents.memory.model.MemorySubject
import kotlinx.serialization.Serializable
-->
```kotlin
object MemorySubjects {
    /**
     * Information specific to the local machine environment
     * Examples: Installed tools, SDKs, OS configuration, available commands
     */
    @Serializable
    data object Machine : MemorySubject() {
        override val name: String = "machine"
        override val promptDescription: String =
            "Technical environment (installed tools, package managers, packages, SDKs, OS, etc.)"
        override val priorityLevel: Int = 1
    }

    /**
     * Information specific to the user
     * Examples: Conversation preferences, issue history, contact information
     */
    @Serializable
    data object User : MemorySubject() {
        override val name: String = "user"
        override val promptDescription: String =
            "使用者資訊（對話偏好、問題歷史紀錄、聯絡詳細資訊等）"
        override val priorityLevel: Int = 1
    }
}
```
<!--- KNIT example-agent-memory-03.kt -->

#### 範圍

***記憶體範圍 (Memory scopes)*** 是事實相關的上下文：

- **Agent**：特定於代理程式。
- **Feature**：特定於功能。
- **Product**：特定於產品。
- **CrossProduct**：適用於多個產品。

## 配置與初始化

該功能透過 `AgentMemory` 類別與代理程式管線整合，`AgentMemory` 類別提供儲存和載入事實的方法，並可作為代理程式配置中的一個功能進行安裝。

### 配置

`AgentMemory.Config` 類別是 `AgentMemory` 功能的配置類別。

<!--- INCLUDE
import ai.koog.agents.core.feature.config.FeatureConfig
import ai.koog.agents.memory.config.MemoryScopesProfile
import ai.koog.agents.memory.providers.AgentMemoryProvider
import ai.koog.agents.memory.providers.NoMemory
-->
```kotlin
class Config(
    var memoryProvider: AgentMemoryProvider = NoMemory,
    var scopesProfile: MemoryScopesProfile = MemoryScopesProfile(),

    var agentName: String,
    var featureName: String,
    var organizationName: String,
    var productName: String
) : FeatureConfig()
```
<!--- KNIT example-agent-memory-04.kt -->

### 安裝

要在代理程式中安裝 `AgentMemory` 功能，請遵循以下程式碼範例中提供的模式。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.memory.feature.AgentMemory
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(AgentMemory) {
        memoryProvider = memoryProvider
        agentName = "your-agent-name"
        featureName = "your-feature-name"
        organizationName = "your-organization-name"
        productName = "your-product-name"
    }
}
```
<!--- KNIT example-agent-memory-05.kt -->

## 範例與快速入門

### 基本用法

以下程式碼片段展示了記憶體儲存的基本設定，以及事實如何儲存到記憶體中和從記憶體中載入。

1) 設定記憶體儲存
<!--- INCLUDE
import ai.koog.agents.memory.providers.LocalFileMemoryProvider
import ai.koog.agents.memory.providers.LocalMemoryConfig
import ai.koog.agents.memory.storage.SimpleStorage
import ai.koog.rag.base.files.JVMFileSystemProvider
import kotlin.io.path.Path
-->
```kotlin
// 建立記憶體提供者
val memoryProvider = LocalFileMemoryProvider(
    config = LocalMemoryConfig("customer-support-memory"),
    storage = SimpleStorage(JVMFileSystemProvider.ReadWrite),
    fs = JVMFileSystemProvider.ReadWrite,
    root = Path("path/to/memory/root")
)
```
<!--- KNIT example-agent-memory-06.kt -->

2) 將事實儲存到記憶體中
<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact
import kotlinx.datetime.Clock

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        value = "John",
        timestamp = Clock.System.now().toEpochMilliseconds(),
    ),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app"),
)
```
<!--- KNIT example-agent-memory-07.kt -->

3) 檢索事實
<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// 取得儲存的資訊
val greeting = memoryProvider.load(
    concept = Concept("greeting", "User's name", FactType.SINGLE),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app")
)
if (greeting.size > 1) {
    println("找到記憶：${greeting.joinToString(", ")}")
} else {
    println("找不到資訊。第一次來嗎？")
}
```
<!--- KNIT example-agent-memory-08.kt -->

#### 使用記憶體節點

`AgentMemory` 功能提供以下預定義的記憶體節點，這些節點可以用於代理程式策略中：

*   [nodeLoadAllFactsFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-all-facts-from-memory.html)：從記憶體中為給定概念載入有關主題的所有事實。
*   [nodeLoadFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-from-memory.html)：從記憶體中為給定概念載入特定事實。
*   [nodeSaveToMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory.html)：將事實儲存到記憶體中。
*   [nodeSaveToMemoryAutoDetectFacts](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory-auto-detect-facts.html)：自動偵測並從聊天歷史中提取事實，並將其儲存到記憶體中。使用 LLM 識別概念。

以下是節點如何在代理程式策略中實作的範例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.memory.feature.nodes.nodeSaveToMemoryAutoDetectFacts
import ai.koog.agents.memory.feature.withMemory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
-->
```kotlin
val strategy = strategy("example-agent") {
    // 自動偵測並儲存事實的節點
    val detectFacts by nodeSaveToMemoryAutoDetectFacts<Unit>(
        subjects = listOf(MemorySubjects.User, MemorySubjects.Machine)
    )

    // 載入特定事實的節點
    val loadPreferences by node<Unit, Unit> {
        withMemory {
            loadFactsToAgent(
                llm = llm,
                concept = Concept("user-preference", "User's preferred programming language", FactType.SINGLE),
                subjects = listOf(MemorySubjects.User)
            )
        }
    }

    // 在策略中連接節點
    edge(nodeStart forwardTo detectFacts)
    edge(detectFacts forwardTo loadPreferences)
    edge(loadPreferences forwardTo nodeFinish)
}
```
<!--- KNIT example-agent-memory-09.kt -->

#### 保護記憶體安全

您可以使用加密來確保敏感資訊在記憶體提供者使用的加密儲存中受到保護。

<!--- INCLUDE
import ai.koog.agents.memory.storage.EncryptedStorage
import ai.koog.rag.base.files.JVMFileSystemProvider
import ai.koog.agents.memory.storage.Aes256GCMEncryptor
-->
```kotlin
// 簡單的加密儲存設定
val secureStorage = EncryptedStorage(
    fs = JVMFileSystemProvider.ReadWrite,
    encryption = Aes256GCMEncryptor("your-secret-key")
)
```
<!--- KNIT example-agent-memory-10.kt -->

#### 範例：記住使用者偏好

以下是 `AgentMemory` 如何在實際情境中用於記住使用者偏好（特別是使用者最喜歡的程式語言）的範例。

<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact
import kotlinx.datetime.Clock

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
        value = "Kotlin",
        timestamp = Clock.System.now().toEpochMilliseconds(),
    ),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app")
)
```
<!--- KNIT example-agent-memory-11.kt -->

### 進階用法

#### 帶記憶體的自訂節點

您也可以在任何節點中使用 `withMemory` 子句中的記憶體。現成的 `loadFactsToAgent` 和 `saveFactsFromHistory` 高階抽象將事實儲存到歷史記錄中，從中載入事實，並更新 LLM 聊天：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.memory.feature.withMemory
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope

fun main() {
    val strategy = strategy<Unit, Unit>("example-agent") {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val loadProjectInfo by node<Unit, Unit> {
    withMemory {
        loadFactsToAgent(
            llm = llm,
            concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE)
        )
    }
}

val saveProjectInfo by node<Unit, Unit> {
    withMemory {
        saveFactsFromHistory(
            llm = llm,
            concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
            subject = MemorySubjects.User,
            scope = MemoryScope.Product("my-app")
        )
    }
}
```
<!--- KNIT example-agent-memory-12.kt -->

#### 自動事實偵測

您還可以要求 LLM 使用 `nodeSaveToMemoryAutoDetectFacts` 方法從代理程式的歷史記錄中偵測所有事實：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.memory.feature.nodes.nodeSaveToMemoryAutoDetectFacts

fun main() {
    val strategy = strategy<Unit, Unit>("example-agent") {

-->
<!--- SUFFIX
    }
}
-->
```kotlin
val saveAutoDetect by nodeSaveToMemoryAutoDetectFacts<Unit>(
    subjects = listOf(MemorySubjects.User, MemorySubjects.Machine)
)
```
<!--- KNIT example-agent-memory-13.kt -->

在上面的範例中，LLM 將搜尋與使用者相關的事實和與專案相關的事實，確定概念，並將它們儲存到記憶體中。

## 最佳實踐

1.  **從簡開始**
    - 從沒有加密的基本儲存開始
    - 在轉向多個事實之前先使用單一事實

2.  **良好組織**
    - 使用清晰的概念名稱
    - 添加有用的描述
    - 將相關資訊保留在相同主題下

3.  **處理錯誤**
<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.Clock

fun main() {
    runBlocking {
        val fact = SingleFact(
            concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
            value = "Kotlin",
            timestamp = Clock.System.now().toEpochMilliseconds()
        )
        val subject = MemorySubjects.User
        val scope = MemoryScope.Product("my-app")
-->
<!--- SUFFIX
    }
}
-->
```kotlin
try {
    memoryProvider.save(fact, subject, scope)
} catch (e: Exception) {
    println("糟糕！無法儲存：${e.message}")
}
```
<!--- KNIT example-agent-memory-14.kt -->

有關錯誤處理的更多詳細資訊，請參閱 [錯誤處理與邊緣情況](#error-handling-and-edge-cases)。

## 錯誤處理與邊緣情況

`AgentMemory` 功能包含多種機制來處理邊緣情況：

1.  **NoMemory provider**：一個不儲存任何內容的預設實作，在未指定記憶體提供者時使用。

2.  **Subject specificity handling**：載入事實時，該功能會根據其定義的 `priorityLevel`，優先處理來自更特定主題的事實。

3.  **Scope filtering**：事實可以按範圍過濾，以確保只載入相關資訊。

4.  **Timestamp tracking**：事實與時間戳一起儲存，以追蹤它們的建立時間。

5.  **Fact type handling**：該功能支援單一事實和多個事實，並對每種類型進行適當處理。

## API 文件

有關 `AgentMemory` 功能的完整 API 參考，請參閱 [agents-features-memory](https://api.koog.ai/agents/agents-features/agents-features-memory/index.html) 模組的參考文件。

特定套件的 API 文件：

-   [ai.koog.agents.local.memory.feature](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature/index.html)：包含 `AgentMemory` 類別和 AI 代理程式記憶體功能的核心實作。
-   [ai.koog.agents.local.memory.feature.nodes](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/index.html)：包含可用於子圖的預定義記憶體相關節點。
-   [ai.koog.agents.local.memory.config](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.config/index.html)：提供用於記憶體操作的記憶體範圍定義。
-   [ai.koog.agents.local.memory.model](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.model/index.html)：包含核心資料結構和介面的定義，這些結構和介面使代理程式能夠在不同上下文和時間段內儲存、組織和檢索資訊。
-   [ai.koog.agents.local.memory.feature.history](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.history/index.html)：提供歷史記錄壓縮策略，用於從過去的會話活動或儲存的記憶體中檢索和整合有關特定事實知識的概念。
-   [ai.koog.agents.local.memory.providers](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.providers/index.html)：提供核心介面，定義了以結構化、上下文感知方式儲存和檢索知識的基本操作及其實作。
-   [ai.koog.agents.local.memory.storage](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.storage/index.html)：提供核心介面和特定實作，用於跨不同平台和儲存後端進行檔案操作。

## 常見問題與疑難排解

### 如何實作自訂記憶體提供者？

要實作自訂記憶體提供者，請建立一個實作 `AgentMemoryProvider` 介面的類別：

<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.Fact
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.MemorySubject
import ai.koog.agents.memory.providers.AgentMemoryProvider

/* 
// KNIT: Ignore example
-->
<!--- SUFFIX
*/
-->
```kotlin
class MyCustomMemoryProvider : AgentMemoryProvider {
    override suspend fun save(fact: Fact, subject: MemorySubject, scope: MemoryScope) {
        // Implementation for saving facts
    }

    override suspend fun load(concept: Concept, subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // Implementation for loading facts by concept
    }

    override suspend fun loadAll(subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // Implementation for loading all facts
    }

    override suspend fun loadByDescription(
        description: String,
        subject: MemorySubject,
        scope: MemoryScope
    ): List<Fact> {
        // Implementation for loading facts by description
    }
}
```
<!--- KNIT example-agent-memory-15.kt -->

### 從多個主題載入時，事實如何優先排序？

事實根據主題特異性進行優先排序。載入事實時，如果同一個概念有多個主題的事實，則會使用來自最特定主題的事實。

### 我可以為同一個概念儲存多個值嗎？

是的，可以透過使用 `MultipleFacts` 型別。定義概念時，將其 `factType` 設定為 `FactType.MULTIPLE`：
<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.FactType
-->
```kotlin
val concept = Concept(
    keyword = "user-skills",
    description = "Programming languages the user is skilled in",
    factType = FactType.MULTIPLE
)
```
<!--- KNIT example-agent-memory-16.kt -->

這讓您可以為該概念儲存多個值，這些值將作為列表檢索。