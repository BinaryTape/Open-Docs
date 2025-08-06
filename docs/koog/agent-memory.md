# 内存

## 特性概述

AgentMemory 特性是 Koog 框架的一个组件，它使 AI 代理能够在对话中存储、检索和使用信息。

### 目的

AgentMemory 特性通过以下方式解决在 AI 代理交互中保持上下文的挑战：

- 存储从对话中提取的重要事实。
- 按概念、主题和作用域组织信息。
- 在未来的交互中需要时检索相关信息。
- 基于用户偏好和历史实现个性化。

### 架构

AgentMemory 特性建立在分层结构之上。该结构的元素在以下章节中列出并解释。

#### 事实

***事实 (Facts)*** 是存储在内存中的独立信息片段。事实代表实际存储的信息。事实有两种类型：

- **SingleFact**：与一个概念关联的单个值。例如，IDE 用户当前偏好的主题：
```kotlin
// 存储偏好的 IDE 主题（单个值）
val themeFact = SingleFact(
    concept = Concept(
        "ide-theme", 
        "User's preferred IDE theme", 
        factType = FactType.SINGLE),
    value = "Dark Theme",
    timestamp = DefaultTimeProvider.getCurrentTimestamp()
)
```
- **MultipleFacts**：与一个概念关联的多个值。例如，用户了解的所有语言：
```kotlin
// 存储编程语言（多个值）
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

***概念 (Concepts)*** 是带有相关元信息的信息类别。

- **Keyword**：概念的唯一标识符。
- **Description**：概念所代表内容的详细解释。
- **FactType**：概念存储单个事实还是多个事实（`FactType.SINGLE` 或 `FactType.MULTIPLE`）。

#### 主题

***主题 (Subjects)*** 是事实可以与之关联的实体。

常见的主题示例包括：

- **User**：个人偏好和设置
- **Environment**：与应用程序环境相关的信息

有一个预定义的 `MemorySubject.Everything`，您可以将其用作所有事实的默认主题。此外，您可以通过扩展 `MemorySubject` 抽象类来定义自己的自定义内存主题：

```kotlin
object MemorySubjects {
    /**
     * 本地机器环境特有的信息
     * 示例：已安装的工具、SDK、操作系统配置、可用命令
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
#### 作用域

***内存作用域 (Memory scopes)*** 是事实相关的上下文：

- **Agent**：代理特有。
- **Feature**：特性特有。
- **Product**：产品特有。
- **CrossProduct**：跨多个产品相关。

## 配置与初始化

该特性通过 `AgentMemory` 类与代理流水线集成，该类提供了保存和加载事实的方法，并且可以作为特性安装在代理配置中。

### 配置

`AgentMemory.Config` 类是 AgentMemory 特性的配置类。

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

### 安装

要在代理中安装 AgentMemory 特性，请遵循以下代码示例中提供的模式。

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

## 示例与快速入门

### 基本用法

以下代码片段演示了内存存储的基本设置以及事实如何保存到内存和从内存加载。

1. 设置内存存储
```kotlin
// 创建内存提供者
val memoryProvider = LocalFileMemoryProvider(
    config = LocalMemoryConfig("customer-support-memory"),
    storage = SimpleStorage(JVMFileSystemProvider.ReadWrite),
    fs = JVMFileSystemProvider.ReadWrite,
    root = Path("path/to/memory/root")
)
```

2. 将事实存储到内存中
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
3. 检索事实
```kotlin
// 获取存储的信息
try {
    val greeting = memoryProvider.load(
        concept = Concept("greeting", "User's name", FactType.SINGLE),
        subject = MemorySubjects.User
    )
    println("Retrieved: $greeting")
} catch (e: MemoryNotFoundException) {
    println("信息未找到。是第一次来吗？")
} catch (e: Exception) {
    println("访问内存出错：${e.message}")
}
```

#### 使用内存节点

AgentMemory 特性提供了以下预定义内存节点，可用于代理策略：

* [nodeLoadAllFactsFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-all-facts-from-memory.html)：从内存中加载给定概念的所有主题相关事实。
* [nodeLoadFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-from-memory.html)：从内存中加载给定概念的特定事实。
* [nodeSaveToMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory.html)：将事实保存到内存中。
* [nodeSaveToMemoryAutoDetectFacts](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory-auto-detect-facts.html)：自动检测并从聊天历史中提取事实并保存到内存中。使用 LLM 识别概念。

以下是如何在代理策略中实现节点的示例：

```kotlin
val strategy = strategy("example-agent") {
        // 自动检测并保存事实的节点
        val detectFacts by nodeSaveToMemoryAutoDetectFacts<Unit>(
            subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
        )

        // 加载特定事实的节点
        val loadPreferences by node<Unit, Unit> {
            withMemory {
                loadFactsToAgent(
                    concept = Concept("user-preference", "User's preferred programming language", FactType.SINGLE),
                    subjects = listOf(MemorySubjects.User)
                )
            }
        }

        // 在策略中连接节点
        edge(nodeStart forwardTo detectFacts)
        edge(detectFacts forwardTo loadPreferences)
        edge(loadPreferences forwardTo nodeFinish)
}
```

#### 确保内存安全

您可以使用加密来确保敏感信息在内存提供者使用的加密存储中受到保护。

```kotlin
// 简单的加密存储设置
val secureStorage = EncryptedStorage(
    fs = JVMFileSystemProvider.ReadWrite,
    encryption = Aes256GCMEncryption("your-secret-key")
)
```

#### 示例：记住用户偏好

以下是 AgentMemory 在实际场景中如何用于记住用户偏好的示例，特别是用户偏好的编程语言。

```kotlin
memoryProvider.save(
    fact = SingleFact(
        concept = Concept("preferred-language", "用户偏好的编程语言是什么？", FactType.SINGLE),
        value = "Kotlin",
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubjects.User
)
```

### 高级用法

#### 带有内存的自定义节点

您还可以从任何节点内的 `withMemory` 子句中使用内存。即用型 `loadFactsToAgent` 和 `saveFactsFromHistory` 等更高级别的抽象将事实保存到历史记录、从中加载事实并更新 LLM 聊天：

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

#### 自动事实检测

您还可以使用 `nodeSaveToMemoryAutoDetectFacts` 方法要求 LLM 检测代理历史记录中的所有事实：

```kotlin
val saveAutoDetect by nodeSaveToMemoryAutoDetectFacts<Unit>(
    subjects = listOf(MemorySubjects.User, MemorySubjects.Project)
)
```
在上述示例中，LLM 将搜索用户相关事实和项目相关事实，确定概念，并将它们保存到内存中。

## 最佳实践

1. **循序渐进**
    - 从不带加密的基本存储开始
    - 在使用多个事实之前，先使用单个事实

2. **良好组织**
    - 使用清晰的概念名称
    - 添加有用的描述
    - 将相关信息置于同一主题下

3. **错误处理**
   ```kotlin
   try {
       memoryProvider.save(fact, subject)
   } catch (e: Exception) {
       println("哎呀！无法保存：${e.message}")
   }
   ```
   有关错误处理的更多详细信息，请参见 [错误处理和边缘情况](#error-handling-and-edge-cases)。

## 错误处理和边缘情况

AgentMemory 特性包含多种机制来处理边缘情况：

1. **NoMemory 提供者**：当未指定内存提供者时，使用的默认实现，它不存储任何内容。

2. **主题特异性处理**：加载事实时，该特性会根据其定义的 `priorityLevel` 优先处理来自更具体主题的事实。

3. **作用域过滤**：事实可以按作用域过滤，以确保只加载相关信息。

4. **时间戳跟踪**：事实随时间戳存储，以跟踪它们的创建时间。

5. **事实类型处理**：该特性支持单个事实和多个事实，并对每种类型进行适当处理。

## API 文档

有关 AgentMemory 特性完整的 API 参考，请参见 [agents-features-memory](https://api.koog.ai/agents/agents-features/agents-features-memory/index.html) 模块的参考文档。

特定包的 API 文档：

- [ai.koog.agents.local.memory.feature](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature/index.html)：包括 `AgentMemory` 类和 AI 代理内存特性的核心实现。
- [ai.koog.agents.local.memory.feature.nodes](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/index.html)：包括可在子图中使用的预定义内存相关节点。
- [ai.koog.agents.local.memory.config](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.config/index.html)：提供了用于内存操作的内存作用域定义。
- [ai.koog.agents.local.memory.model](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.model/index.html)：包括核心数据结构和接口的定义，这些结构和接口使代理能够跨不同上下文和时间段存储、组织和检索信息。
- [ai.koog.agents.local.memory.feature.history](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.history/index.html)：提供了历史压缩策略，用于从过去的会话活动或存储的内存中检索和整合关于特定概念的事实知识。
- [ai.koog.agents.local.memory.providers](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.providers/index.html)：提供了核心接口，该接口定义了以结构化、上下文感知方式存储和检索知识的基本操作及其实现。
- [ai.koog.agents.local.memory.storage](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.storage/index.html)：提供了核心接口和特定实现，用于跨不同平台和存储后端进行文件操作。

## 常见问题与故障排除

### 如何实现自定义内存提供者？

要实现自定义内存提供者，请创建一个实现 `AgentMemoryProvider` 接口的类：

```kotlin
class MyCustomMemoryProvider : AgentMemoryProvider {
    override suspend fun save(fact: Fact, subject: MemorySubject, scope: MemoryScope) {
        // 保存事实的实现
    }

    override suspend fun load(concept: Concept, subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // 按概念加载事实的实现
    }

    override suspend fun loadAll(subject: MemorySubject, scope: MemoryScope): List<Fact> {
        // 加载所有事实的实现
    }

    override suspend fun loadByDescription(
        description: String,
        subject: MemorySubject,
        scope: MemoryScope
    ): List<Fact> {
        // 按描述加载事实的实现
    }
}
```

### 从多个主题加载事实时，如何确定事实的优先级？

事实根据主题特异性确定优先级。加载事实时，如果同一个概念有来自多个主题的事实，将使用最具体主题的事实。

### 我可以为同一个概念存储多个值吗？

可以，通过使用 `MultipleFacts` 类型。定义概念时，将其 `factType` 设置为 `FactType.MULTIPLE`：

```kotlin
val concept = Concept(
    keyword = "user-skills",
    description = "用户擅长的编程语言",
    factType = FactType.MULTIPLE
)
```

这让您可以为该概念存储多个值，这些值将作为 list 检索。