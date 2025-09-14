# 메모리

## 기능 개요

AgentMemory 기능은 AI 에이전트가 대화 전반에 걸쳐 정보를 저장, 검색 및 사용할 수 있도록 하는 Koog 프레임워크의 한 구성 요소입니다.

### 목적

AgentMemory 기능은 다음과 같은 방법으로 AI 에이전트 상호 작용에서 컨텍스트를 유지하는 문제를 해결합니다.

- 대화에서 추출된 중요한 팩트(Facts) 저장.
- 개념(Concepts), 주제(Subjects) 및 범위(Scopes)별 정보 구성.
- 향후 상호 작용에서 필요할 때 관련 정보 검색.
- 사용자 선호도 및 기록에 기반한 개인화 지원.

### 아키텍처

AgentMemory 기능은 계층적 구조로 구축됩니다.
구조의 요소는 아래 섹션에 나열되고 설명되어 있습니다.

#### 팩트

***팩트(Facts)***는 메모리에 저장되는 개별 정보 조각입니다.
팩트는 실제로 저장된 정보를 나타냅니다.
팩트에는 두 가지 유형이 있습니다.

- **단일 팩트 (SingleFact)**: 하나의 개념과 연관된 단일 값. 예를 들어, IDE 사용자의 현재 선호 테마:
<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.DefaultTimeProvider
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.SingleFact
-->
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
<!--- KNIT example-agent-memory-01.kt -->
- **다중 팩트 (MultipleFacts)**: 하나의 개념과 연관된 다중 값. 예를 들어, 사용자가 아는 모든 언어:
<!--- INCLUDE
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.DefaultTimeProvider
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MultipleFacts
-->
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
<!--- KNIT example-agent-memory-02.kt -->

#### 개념

***개념(Concepts)***은 관련 메타데이터가 있는 정보 카테고리입니다.

- **Keyword**: 개념의 고유 식별자.
- **Description**: 개념이 무엇을 나타내는지에 대한 상세 설명.
- **FactType**: 개념이 단일 또는 다중 팩트(`FactType.SINGLE` 또는 `FactType.MULTIPLE`)를 저장하는지 여부.

#### 주제

***주제(Subjects)***는 팩트를 연관시킬 수 있는 엔티티입니다.

주제(Subject)의 일반적인 예시는 다음과 같습니다:

- **User**: 개인 선호도 및 설정
- **Environment**: 애플리케이션 환경과 관련된 정보

모든 팩트에 대한 기본 주제로 사용할 수 있는 사전 정의된 `MemorySubject.Everything`이 있습니다.
또한, `MemorySubject` 추상 클래스를 확장하여 자신만의 사용자 정의 메모리 주제를 정의할 수 있습니다:

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
            "User information (conversation preferences, issue history, contact details, etc.)"
        override val priorityLevel: Int = 1
    }
}
```
<!--- KNIT example-agent-memory-03.kt -->

#### 범위

***메모리 범위(Memory scopes)***는 팩트가 관련성을 가지는 컨텍스트입니다:

- **Agent**: 에이전트 특정.
- **Feature**: 기능 특정.
- **Product**: 제품 특정.
- **CrossProduct**: 여러 제품에 걸쳐 관련성 있음.

## 구성 및 초기화

이 기능은 `AgentMemory` 클래스를 통해 에이전트 파이프라인과 통합되며, 팩트를 저장하고 로드하는 메서드를 제공하고 에이전트 구성에서 기능으로 설치할 수 있습니다.

### 구성

`AgentMemory.Config` 클래스는 AgentMemory 기능의 구성 클래스입니다.

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

### 설치

AgentMemory 기능을 에이전트에 설치하려면 아래 코드 샘플에 제공된 패턴을 따르십시오.

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

## 예시 및 빠른 시작

### 기본 사용법

다음 코드 스니펫은 메모리 저장소의 기본 설정과 팩트가 메모리에 저장되고 로드되는 방법을 보여줍니다.

1) 메모리 저장소 설정
<!--- INCLUDE
import ai.koog.agents.memory.providers.LocalFileMemoryProvider
import ai.koog.agents.memory.providers.LocalMemoryConfig
import ai.koog.agents.memory.storage.SimpleStorage
import ai.koog.rag.base.files.JVMFileSystemProvider
import kotlin.io.path.Path
-->
```kotlin
// Create a memory provider
val memoryProvider = LocalFileMemoryProvider(
    config = LocalMemoryConfig("customer-support-memory"),
    storage = SimpleStorage(JVMFileSystemProvider.ReadWrite),
    fs = JVMFileSystemProvider.ReadWrite,
    root = Path("path/to/memory/root")
)
```
<!--- KNIT example-agent-memory-06.kt -->

2) 메모리에 팩트 저장
<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.DefaultTimeProvider
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact

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
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app"),
)
```
<!--- KNIT example-agent-memory-07.kt -->

3) 팩트 검색
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
// Get the stored information
val greeting = memoryProvider.load(
    concept = Concept("greeting", "User's name", FactType.SINGLE),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app")
)
if (greeting.size > 1) {
    println("Memories found: ${greeting.joinToString(", ")}")
} else {
    println("Information not found. First time here?")
}
```
<!--- KNIT example-agent-memory-08.kt -->

#### 메모리 노드 사용하기

AgentMemory 기능은 에이전트 전략에서 사용할 수 있는 다음 사전 정의된 메모리 노드를 제공합니다.

*   [nodeLoadAllFactsFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-all-facts-from-memory.html): 주어진 개념에 대해 주제에 대한 모든 팩트를 메모리에서 로드합니다.
*   [nodeLoadFromMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-load-from-memory.html): 주어진 개념에 대해 메모리에서 특정 팩트를 로드합니다.
*   [nodeSaveToMemory](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory.html): 팩트를 메모리에 저장합니다.
*   [nodeSaveToMemoryAutoDetectFacts](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/node-save-to-memory-auto-detect-facts.html): 채팅 기록에서 팩트를 자동으로 감지 및 추출하여 메모리에 저장합니다. LLM을 사용하여 개념을 식별합니다.

다음은 에이전트 전략에서 노드를 구현하는 예시입니다:

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
    // Node to automatically detect and save facts
    val detectFacts by nodeSaveToMemoryAutoDetectFacts<Unit>(
        subjects = listOf(MemorySubjects.User, MemorySubjects.Machine)
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
<!--- KNIT example-agent-memory-09.kt -->

#### 메모리 보안 설정

암호화를 사용하여 민감한 정보가 메모리 공급자에서 사용하는 암호화된 저장소 내에서 보호되도록 보장할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.memory.storage.EncryptedStorage
import ai.koog.rag.base.files.JVMFileSystemProvider
import ai.koog.agents.memory.storage.Aes256GCMEncryptor
-->
```kotlin
// Simple encrypted storage setup
val secureStorage = EncryptedStorage(
    fs = JVMFileSystemProvider.ReadWrite,
    encryption = Aes256GCMEncryptor("your-secret-key")
)
```
<!--- KNIT example-agent-memory-10.kt -->

#### 예시: 사용자 선호도 기억하기

다음은 AgentMemory가 실제 시나리오에서 사용자 선호도, 특히 사용자가 가장 좋아하는 프로그래밍 언어를 기억하는 데 사용되는 예시입니다.

<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.DefaultTimeProvider
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact

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
        timestamp = DefaultTimeProvider.getCurrentTimestamp()
    ),
    subject = MemorySubjects.User,
    scope = MemoryScope.Product("my-app")
)
```
<!--- KNIT example-agent-memory-11.kt -->

### 고급 사용법

#### 메모리를 사용하는 사용자 정의 노드

어떤 노드 내부에서든 `withMemory` 절을 사용하여 메모리를 사용할 수도 있습니다. 바로 사용 가능한 `loadFactsToAgent` 및 `saveFactsFromHistory` 상위 수준 추상화는 팩트를 기록에 저장하고, 기록에서 팩트를 로드하며, LLM 채팅을 업데이트합니다:

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
        loadFactsToAgent(Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE))
    }
}

val saveProjectInfo by node<Unit, Unit> {
    withMemory {
        saveFactsFromHistory(Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
            subject = MemorySubjects.User,
            scope = MemoryScope.Product("my-app")
        )
    }
}
```
<!--- KNIT example-agent-memory-12.kt -->

#### 자동 팩트 감지

`nodeSaveToMemoryAutoDetectFacts` 메서드를 사용하여 LLM이 에이전트 기록에서 모든 팩트를 감지하도록 요청할 수도 있습니다:

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

위 예시에서 LLM은 사용자 관련 팩트와 프로젝트 관련 팩트를 검색하고, 개념을 결정하며, 메모리에 저장합니다.

## 모범 사례

1.  **간단하게 시작하기**
    -   암호화 없이 기본 저장소부터 시작
    -   다중 팩트(MultipleFacts)로 넘어가기 전에 단일 팩트(SingleFacts) 사용

2.  **잘 정리하기**
    -   명확한 개념 이름 사용
    -   도움이 되는 설명 추가
    -   관련 정보를 동일한 주제(Subject) 아래에 유지

3.  **오류 처리**
<!--- INCLUDE
import ai.koog.agents.example.exampleAgentMemory03.MemorySubjects
import ai.koog.agents.example.exampleAgentMemory06.memoryProvider
import ai.koog.agents.memory.model.Concept
import ai.koog.agents.memory.model.DefaultTimeProvider
import ai.koog.agents.memory.model.FactType
import ai.koog.agents.memory.model.MemoryScope
import ai.koog.agents.memory.model.SingleFact
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val fact = SingleFact(
            concept = Concept("preferred-language", "What programming language is preferred by the user?", FactType.SINGLE),
            value = "Kotlin",
            timestamp = DefaultTimeProvider.getCurrentTimestamp()
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
    println("Oops! Couldn't save: ${e.message}")
}
```
<!--- KNIT example-agent-memory-14.kt -->

오류 처리에 대한 자세한 내용은 [오류 처리 및 예외 상황](#error-handling-and-edge-cases)을 참조하십시오.

## 오류 처리 및 예외 상황

AgentMemory 기능에는 예외 상황을 처리하기 위한 여러 메커니즘이 포함되어 있습니다.

1.  **NoMemory 공급자**: 메모리 공급자가 지정되지 않았을 때 사용되는, 아무것도 저장하지 않는 기본 구현입니다.

2.  **주제 특이성 처리**: 팩트를 로드할 때, 이 기능은 정의된 `priorityLevel`에 따라 더 구체적인 주제의 팩트에 우선순위를 부여합니다.

3.  **범위 필터링**: 관련 정보만 로드되도록 팩트를 범위별로 필터링할 수 있습니다.

4.  **타임스탬프 추적**: 팩트는 생성 시간을 추적하기 위해 타임스탬프와 함께 저장됩니다.

5.  **팩트 유형 처리**: 이 기능은 단일 팩트와 다중 팩트 모두를 지원하며, 각 유형에 대해 적절하게 처리합니다.

## API 문서

AgentMemory 기능과 관련된 전체 API 참조는 [agents-features-memory](https://api.koog.ai/agents/agents-features/agents-features-memory/index.html) 모듈의 참조 문서를 참조하십시오.

특정 패키지에 대한 API 문서:

-   [ai.koog.agents.local.memory.feature](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature/index.html): `AgentMemory` 클래스와 AI 에이전트 메모리 기능의 핵심 구현을 포함합니다.
-   [ai.koog.agents.local.memory.feature.nodes](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.nodes/index.html): 서브그래프에서 사용할 수 있는 미리 정의된 메모리 관련 노드를 포함합니다.
-   [ai.koog.agents.local.memory.config](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.config/index.html): 메모리 작업에 사용되는 메모리 범위의 정의를 제공합니다.
-   [ai.koog.agents.local.memory.model](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.model/index.html): 에이전트가 다른 컨텍스트와 기간에 걸쳐 정보를 저장, 구성 및 검색할 수 있도록 하는 핵심 데이터 구조 및 인터페이스의 정의를 포함합니다.
-   [ai.koog.agents.local.memory.feature.history](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.feature.history/index.html): 과거 세션 활동 또는 저장된 메모리에서 특정 개념에 대한 사실적 지식을 검색하고 통합하기 위한 기록 압축 전략을 제공합니다.
-   [ai.koog.agents.local.memory.providers](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.providers/index.html): 구조화되고 컨텍스트 인식 방식으로 지식을 저장하고 검색하기 위한 기본 작업을 정의하는 핵심 인터페이스 및 그 구현을 제공합니다.
-   [ai.koog.agents.local.memory.storage](https://api.koog.ai/agents/agents-features/agents-features-memory/ai.koog.agents.local.memory.storage/index.html): 다양한 플랫폼 및 저장소 백엔드에 걸쳐 파일 작업을 위한 핵심 인터페이스 및 특정 구현을 제공합니다.

## FAQ 및 문제 해결

### 사용자 정의 메모리 공급자는 어떻게 구현하나요?

사용자 정의 메모리 공급자를 구현하려면 `AgentMemoryProvider` 인터페이스를 구현하는 클래스를 생성하십시오:

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

### 여러 주제에서 로드할 때 팩트는 어떻게 우선순위가 정해지나요?

팩트는 주제 특이성에 따라 우선순위가 정해집니다. 팩트를 로드할 때, 동일한 개념이 여러 주제에서 팩트를 가지고 있다면, 가장 구체적인 주제의 팩트가 사용됩니다.

### 동일한 개념에 대해 여러 값을 저장할 수 있나요?

예, `MultipleFacts` 유형을 사용하여 가능합니다. 개념을 정의할 때 `factType`을 `FactType.MULTIPLE`로 설정하십시오:
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

이를 통해 개념에 대한 여러 값을 저장할 수 있으며, 이 값은 목록으로 검색됩니다.