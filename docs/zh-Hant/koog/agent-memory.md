# 記憶體

## 功能概述

AgentMemory 功能是 Koog 框架的一個元件，可讓 AI 代理程式在不同的對話中儲存、檢索和使用資訊。

### 目的

AgentMemory 功能透過以下方式解決了在 AI 代理程式互動中維持上下文的挑戰：

- 儲存從對話中提取的重要事實。
- 依概念、主題和範圍組織資訊。
- 在未來互動中需要時檢索相關資訊。
- 根據使用者偏好和歷史紀錄啟用個人化。

### 架構

AgentMemory 功能建立在一個階層式結構上。該結構的元素在以下各節中列出並解釋。

#### 事實

***事實 (Facts)*** 是儲存在記憶體中的獨立資訊片段。事實代表實際儲存的資訊。事實有兩種型別：

- **SingleFact**：與概念相關聯的單一值。例如，IDE 使用者目前偏好的主題：
```kotlin
// Storing favorite IDE theme (single value)
val themeFact = SingleFact(
    concept = Concept(
        "ide-theme", 
        "User's preferred IDE theme", 
        factType = FactType.SINGLE),
    value = "Dark Theme",
    timestamp = DefaultTimeProvider.getCurrentTimestamp()
)
```
- **MultipleFacts**：與概念相關聯的多個值。例如，使用者已知的所有語言：
```kotlin
// Storing programming languages (multiple values)
val languagesFact = MultipleFacts(
    concept = Concept(
        "programming-languages",
        "Languages the user knows",
        factType = FactType.MULTIPLE
    ),
    values = listOf("Kotlin", "Java", "Python"),
    timestamp = DefaultTimeProvider.getCurrentTimestamp()
)
```

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

```kotlin
object MemorySubjects {
    /**
     * 與本地機器環境相關的資訊
     * 範例：已安裝的工具、SDK、作業系統配置、可用指令
     */
    @Serializable
    data object Machine : MemorySubject() {
        override val name: String = "machine"
        override val promptDescription: String =
            "Technical environment (installed tools, package managers, packages, SDKs, OS, etc.)"
        override val priorityLevel: Int = 1
    }
}
```
#### 範圍

***記憶體範圍 (Memory scopes)*** 是事實相關的上下文：

- **Agent**：特定於代理程式。
- **Feature**：特定於功能。
- **Product**：特定於產品。
- **CrossProduct**：適用於多個產品。

## 配置與初始化

該功能透過 `AgentMemory` 類別與代理程式管線整合，`AgentMemory` 類別提供儲存和載入事實的方法，並可作為代理程式配置中的一個功能進行安裝。

### 配置

`AgentMemory.Config` 類別是 AgentMemory 功能的配置類別。

```kotlin
class Config : FeatureConfig() {
    var memoryProvider: AgentMemoryProvider = NoMemory
    var scopesProfile: MemoryScopesProfile = MemoryScopesProfile()

    var agentName: String
    var featureName: String
    var organizationName: String
    var productName: String
}
```

### 安裝

要在代理程式中安裝 AgentMemory 功能，請遵循以下程式碼範例中提供的模式。

```kotlin
val agent = AIAgent(...) {
    install(AgentMemory) {
        memoryProvider = memoryProvider
        agentName = "your-agent-name"
        featureName = "your-feature-name"
        organizationName = "your-organization-name"
        productName = "your-product-name"
    }
}
```

## 範例與快速入門

### 基本用法

以下程式碼片段展示了記憶體儲存的基本設定，以及事實如何儲存到記憶體中和從記憶體中載入。

1. 設定記憶體儲存
```kotlin
// Create a memory provider
val memoryProvider = LocalFileMemoryProvider(
    config = LocalMemoryConfig("customer-support-memory"),
    storage = SimpleStorage(JVMFileSystemProvider.ReadWrite),
    fs = JVMFileSystemProvider.ReadWrite,
    root = Path("path/to/memory/root")
)
```

2. 將事實儲存到記憶體中
```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        value = "John",
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubject.User
)
```
3. 檢索事實
```kotlin
// Get the stored information
try {
    val greeting = memoryProvider.load(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        subject = MemorySubjects.User
    )
    println("Retrieved: $greeting")
} catch (e: MemoryNotFoundException) {
    println("Information not found. First time here?")
} catch (e: Exception) {
    println("Error accessing memory: ${e.message}")
}
```

#### 使用記憶體節點

AgentMemory 功能提供以下預定義的記憶體節點，這些節點可以用於代理程式策略中：

* [nodeLoadAllFactsFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-all-facts-from-memory.html)：從記憶體中為給定概念載入有關主題的所有事實。
* [nodeLoadFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-from-memory.html)：從記憶體中為給定概念載入特定事實。
* [nodeSaveToMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory.html)：將事實儲存到記憶體中。
* [nodeSaveToMemoryAutoDetectFacts](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory-auto-detect-facts.html)：自動偵測並從聊天歷史中提取事實，並將其儲存到記憶體中。使用 LLM 識別概念。

以下是節點如何在代理程式策略中實作的範例：

```kotlin
val strategy = strategy("example-agent") {
        // Node to automatically detect and save facts
        val detectFacts by nodeSaveToMemoryAutoDetectFacts<Unit>(
            subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
        )

        // Node to load specific facts
        val loadPreferences by node<Unit, Unit> {
            withMemory {
                loadFactsToAgent(
                    concept = Concept("user-preference", "User's preferred programming language", FactType.SINGLE),
                    subjects = listOf(MemorySubjects.User)
                )
            }
        }

        // Connect nodes in the strategy
        edge(nodeStart forwardTo detectFacts)
        edge(detectFacts forwardTo loadPreferences)
        edge(loadPreferences forwardTo nodeFinish)
}
```

#### 保護記憶體安全

您可以使用加密來確保敏感資訊在記憶體提供者使用的加密儲存中受到保護。

```kotlin
// Simple encrypted storage setup
val secureStorage = EncryptedStorage(
    fs = JVMFileSystemProvider.ReadWrite,
    encryption = Aes256GCMEncryption("your-secret-key")
)
```

#### 範例：記住使用者偏好

以下是 AgentMemory 如何在實際情境中用於記住使用者偏好（特別是使用者最喜歡的程式語言）的範例。

```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
        value = "Kotlin",
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubjects.User
)
```

### 進階用法

#### 帶記憶體的自訂節點

您也可以在任何節點中使用 `withMemory` 子句中的記憶體。現成的 `loadFactsToAgent` 和 `saveFactsFromHistory` 高階抽象將事實儲存到歷史記錄中，從中載入事實，並更新 LLM 聊天：

```kotlin
val loadProjectInfo by node<Unit, Unit> {
    withMemory {
        loadFactsToAgent(Concept("project-structure", ...))
    }
}

val saveProjectInfo by node<Unit, Unit> {
    withMemory {
        saveFactsFromHistory(Concept("project-structure", ...))
    }
}
```

#### 自動事實偵測

您還可以要求 LLM 使用 `nodeSaveToMemoryAutoDetectFacts` 方法從代理程式的歷史記錄中偵測所有事實：

```kotlin
val saveAutoDetect by nodeSaveToMemoryAutoDetectFacts<Unit>(
    subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
)
```
在上面的範例中，LLM 將搜尋與使用者相關的事實和與專案相關的事實，確定概念，並將它們儲存到記憶體中。

## 最佳實踐

1. **從簡開始**
    - 從沒有加密的基本儲存開始
    - 在轉向多個事實之前先使用單一事實

2. **良好組織**
    - 使用清晰的概念名稱
    - 添加有用的描述
    - 將相關資訊保留在相同主題下

3. **處理錯誤**
   ```kotlin
   try {
       memoryProvider.save(fact, subject)
   } catch (e: Exception) {
       println("Oops! Couldn't save: ${e.message}")
   }
   ```
   有關錯誤處理的更多詳細資訊，請參閱 [錯誤處理與邊緣情況](#error-handling-and-edge-cases)。

## 錯誤處理與邊緣情況

AgentMemory 功能包含多種機制來處理邊緣情況：

1. **NoMemory 提供者**：一個不儲存任何內容的預設實作，在未指定記憶體提供者時使用。

2. **主題特異性處理**：載入事實時，該功能會根據其定義的 `priorityLevel`，優先處理來自更特定主題的事實。

3. **範圍過濾**：事實可以按範圍過濾，以確保只載入相關資訊。

4. **時間戳追蹤**：事實與時間戳一起儲存，以追蹤它們的建立時間。

5. **事實型別處理**：該功能支援單一事實和多個事實，並對每種類型進行適當處理。

## API 文件

有關 AgentMemory 功能的完整 API 參考，請參閱 [agents-features-memory](https://api.koog.ai/agents/agents-features/agents-features-memory/index.html) 模組的參考文件。

特定套件的 API 文件：

- [ai.koog.agents.local.memory.feature](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature/index.html)：包含 `AgentMemory` 類別和 AI 代理程式記憶體功能的核心實作。
- [ai.koog.agents.local.memory.feature.nodes](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/index.html)：包含可用於子圖的預定義記憶體相關節點。
- [ai.koog.agents.local.memory.config](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.config/index.html)：提供用於記憶體操作的記憶體範圍定義。
- [ai.koog.agents.local.memory.model](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.model/index.html)：包含核心資料結構和介面的定義，這些結構和介面使代理程式能夠在不同上下文和時間段內儲存、組織和檢索資訊。
- [ai.koog.agents.local.memory.feature.history](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.history/index.html)：提供歷史記錄壓縮策略，用於從過去的會話活動或儲存的記憶體中檢索和整合有關特定事實知識的概念。
- [ai.koog.agents.local.memory.providers](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.providers/index.html)：提供核心介面，定義了以結構化、上下文感知方式儲存和檢索知識的基本操作及其實作。
- [ai.koog.agents.local.memory.storage](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.storage/index.html)：提供用於跨不同平台和儲存後端進行檔案操作的核心介面和特定實作。

## 常見問題與疑難排解

### 如何實作自訂記憶體提供者？

要實作自訂記憶體提供者，請建立一個實作 `AgentMemoryProvider` 介面的類別：

```kotlin
class MyCustomMemoryProvider : AgentMemoryProvider {
    override suspend fun save(fact: Fact, subject: MemorySubject, scope: MemoryScope) {
        // 儲存事實的實作
    }

    override suspend fun load(concept: Concept, subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // 按概念載入事實的實作
    }

    override suspend fun loadAll(subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // 載入所有事實的實作
    }

    override suspend fun loadByDescription(
        description: String,
        subject: MemorySubject,
        scope: MemoryScope
    ): List<Fact> {
        // 按描述載入事實的實作
    }
}
```

### 從多個主題載入時，事實如何優先排序？

事實根據主題特異性進行優先排序。載入事實時，如果同一個概念有多個主題的事實，則會使用來自最特定主題的事實。

### 我可以為同一個概念儲存多個值嗎？

是的，可以透過使用 `MultipleFacts` 型別。定義概念時，將其 `factType` 設定為 `FactType.MULTIPLE`：

```kotlin
val concept = Concept(
    keyword = "user-skills",
    description = "Programming languages the user is skilled in",
    factType = FactType.MULTIPLE
)
```

這讓您可以為該概念儲存多個值，這些值將作為列表檢索。