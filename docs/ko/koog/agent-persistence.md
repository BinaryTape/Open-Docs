# 에이전트 영속성

에이전트 영속성(Agent Persistence)은 Koog 프레임워크에서 AI 에이전트에 체크포인트 기능을 제공하는 기능입니다.
이 기능은 실행 중 특정 시점에 에이전트의 상태를 저장하고 복원하여 다음과 같은 기능을 활성화합니다.

- 특정 지점부터 에이전트 실행 재개
- 이전 상태로 롤백
- 세션 간 에이전트 상태 영속화

## 주요 개념

### 체크포인트

체크포인트는 에이전트 실행의 특정 시점에서 에이전트의 완전한 상태를 캡처하며, 다음을 포함합니다.

- 메시지 기록 (사용자, 시스템, 어시스턴트 및 도구 간의 모든 상호 작용)
- 현재 실행 중인 노드
- 현재 노드의 입력 데이터
- 생성 타임스탬프

체크포인트는 고유 ID로 식별되며 특정 에이전트와 연결됩니다.

## 전제 조건

에이전트 영속성 기능은 에이전트 전략의 모든 노드에 고유한 이름이 있어야 합니다.
이 기능이 설치될 때 다음이 적용됩니다.

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

그래프의 노드에 고유한 이름을 설정해야 합니다.

## 설치

에이전트 영속성 기능을 사용하려면 에이전트 구성에 추가하십시오.

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
        // 스냅샷을 위한 인메모리 스토리지를 사용
        storage = InMemoryPersistenceStorageProvider()
        // 자동 영속성 활성화
        enableAutomaticPersistence = true
    }
}
```

<!--- KNIT example-agent-persistence-02.kt -->

## 구성 옵션

에이전트 영속성 기능에는 두 가지 주요 구성 옵션이 있습니다.

-   **스토리지 제공자(Storage provider)**: 체크포인트를 저장하고 검색하는 데 사용되는 제공자.
-   **연속 영속성(Continuous persistence)**: 각 노드가 실행된 후 자동으로 체크포인트를 생성하는 기능.

### 스토리지 제공자

체크포인트를 저장하고 검색하는 데 사용될 스토리지 제공자를 설정하십시오.

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

프레임워크에는 다음 내장 제공자가 포함되어 있습니다.

-   `InMemoryPersistenceStorageProvider`: 체크포인트를 메모리에 저장합니다 (애플리케이션이 다시 시작되면 손실됨).
-   `FilePersistenceStorageProvider`: 체크포인트를 파일 시스템에 영속화합니다.
-   `NoPersistenceStorageProvider`: 체크포인트를 저장하지 않는 노옵(no-op) 구현입니다. 이것이 기본 제공자입니다.

`PersistenceStorageProvider` 인터페이스를 구현하여 사용자 지정 스토리지 제공자를 구현할 수도 있습니다.
자세한 내용은 [사용자 지정 스토리지 제공자](#custom-storage-providers)를 참조하십시오.

### 연속 영속성

연속 영속성은 각 노드가 실행된 후 체크포인트가 자동으로 생성됨을 의미합니다.
연속 영속성을 활성화하려면 아래 코드를 사용하십시오.

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

활성화되면 에이전트는 각 노드가 실행된 후 자동으로 체크포인트를 생성하여,
세분화된 복구를 가능하게 합니다.

## 기본 사용법

### 체크포인트 생성

에이전트 실행의 특정 지점에서 체크포인트를 생성하는 방법을 알아보려면 아래 코드 샘플을 참조하십시오.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 현재 상태로 체크포인트 생성
    val checkpoint = context.persistence().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
        version = 0L
    )

    // 체크포인트 ID는 나중에 사용하기 위해 저장할 수 있습니다.
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-05.kt -->

### 체크포인트에서 복원

특정 체크포인트에서 에이전트의 상태를 복원하려면 아래 코드 샘플을 따르십시오.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 특정 체크포인트로 롤백
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // 또는 최신 체크포인트로 롤백
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-06.kt -->

#### 도구로 인해 발생한 모든 부수 효과 롤백

일부 도구가 부수 효과를 생성하는 것은 매우 흔한 일입니다. 특히 백엔드에서 에이전트를 실행할 때,
일부 도구는 데이터베이스 트랜잭션을 수행할 가능성이 있습니다. 이로 인해 에이전트가 시간을 거슬러 이동하기가 훨씬 어려워집니다.

데이터베이스에 새 사용자를 생성하는 `createUser` 도구가 있다고 상상해 보십시오. 그리고 에이전트는 시간이 지남에 따라 여러 도구 호출을 수행했습니다.
```
tool call: createUser "Alex"

->>>> checkpoint-1 <<<<-

tool call: createUser "Daniel"
tool call: createUser "Maria"
```

이제 체크포인트로 롤백하고 싶습니다. 에이전트의 상태(메시지 기록 및 전략 그래프 노드 포함)만 복원하는 것으로는
체크포인트 이전의 정확한 세계 상태를 달성하기에 충분하지 않습니다. 도구 호출로 인해 생성된 부수 효과도 복원해야 합니다. 이 예에서는,
이것은 데이터베이스에서 `Maria`와 `Daniel`을 제거하는 것을 의미합니다.

Koog 영속성 기능을 사용하면 `Persistence` 기능 구성에 `RollbackToolRegistry`를 제공하여 이를 달성할 수 있습니다.

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
        // 모든 `createUser` 도구 호출에 대해 원하는 실행 지점으로 롤백할 때 역순으로 `removeUser` 호출이 발생합니다.
        // 참고: `removeUser` 도구는 `createUser`와 동일한 인수를 받아야 합니다.
        // `removeUser` 호출이 `createUser`의 모든 부수 효과를 롤백하는지 확인하는 것은 개발자의 책임입니다.
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-07.kt -->

### 확장 함수 사용

에이전트 영속성 기능은 체크포인트 작업을 위한 편리한 확장 함수를 제공합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence05.inputData
import ai.koog.agents.example.exampleAgentPersistence05.inputType
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.agents.snapshot.feature.withPersistence
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 체크포인트 기능에 접근
    val checkpointFeature = context.persistence()

    // 또는 체크포인트 기능으로 작업 수행
    context.withPersistence { ctx ->
        // 'this'는 체크포인트 기능입니다.
        createCheckpoint(
            agentContext = ctx,
            nodeId = "current-node-id",
            lastInput = inputData,
            lastInputType = inputType,
            checkpointId = ctx.runId,
            version = 0L
        )
    }
}
```
<!--- KNIT example-agent-persistence-08.kt -->

## 고급 사용법

### 사용자 지정 스토리지 제공자

`PersistenceStorageProvider` 인터페이스를 구현하여 사용자 지정 스토리지 제공자를 구현할 수 있습니다.

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

<!--- KNIT example-agent-persistence-09.kt -->

에이전트에서 에이전트 영속성 기능을 구성할 때 스토리지로 설정하여 사용자 지정 제공자를 기능 구성에서 사용할 수 있습니다.

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

<!--- KNIT example-agent-persistence-10.kt -->

### 실행 지점 설정

고급 제어를 위해 에이전트의 실행 지점을 직접 설정할 수 있습니다.

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

이를 통해 체크포인트에서 복원하는 것 외에 에이전트 상태에 대한 더욱 세분화된 제어가 가능합니다.