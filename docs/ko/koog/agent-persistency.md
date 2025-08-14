# 에이전트 영속성

에이전트 영속성은 Koog 프레임워크의 AI 에이전트에 체크포인트 기능을 제공하는 기능입니다.
이 기능은 실행 중 특정 시점에서 에이전트의 상태를 저장하고 복원하여 다음과 같은 기능을 가능하게 합니다.

-   특정 지점부터 에이전트 실행 재개
-   이전 상태로 롤백
-   세션 간 에이전트 상태 영속화

## 주요 개념

### 체크포인트

체크포인트는 에이전트 실행 중 특정 시점의 전체 상태를 캡처하며, 다음을 포함합니다.

-   메시지 기록 (사용자, 시스템, 어시스턴트, 도구 간의 모든 상호작용)
-   현재 실행 중인 노드
-   현재 노드에 대한 입력 데이터
-   생성 타임스탬프

체크포인트는 고유 ID로 식별되며 특정 에이전트와 연결됩니다.

## 전제 조건

에이전트 영속성 기능은 에이전트 전략 내의 모든 노드가 고유한 이름을 가져야 합니다.
이는 기능 설치 시 강제됩니다.

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

<!--- KNIT example-agent-persistency-01.kt -->

그래프 내 노드에 고유한 이름을 설정했는지 확인하세요.

## 설치

에이전트 영속성 기능을 사용하려면 에이전트 구성에 추가하세요.

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
    executor = executor,
    llmModel = OllamaModels.Meta.LLAMA_3_2,
) {
    install(Persistency) {
        // 스냅샷에 인메모리 스토리지를 사용합니다.
        storage = InMemoryPersistencyStorageProvider("in-memory-storage")
        // 자동 영속성을 활성화합니다.
        enableAutomaticPersistency = true
    }
}
```

<!--- KNIT example-agent-persistency-02.kt -->

## 구성 옵션

에이전트 영속성 기능에는 두 가지 주요 구성 옵션이 있습니다.

-   **스토리지 제공자**: 체크포인트를 저장하고 검색하는 데 사용되는 제공자.
-   **연속 영속성**: 각 노드 실행 후 체크포인트 자동 생성.

### 스토리지 제공자

체크포인트를 저장하고 검색하는 데 사용될 스토리지 제공자를 설정하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
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

프레임워크에는 다음 내장 제공자가 포함되어 있습니다.

-   `InMemoryPersistencyStorageProvider`: 체크포인트를 메모리에 저장합니다(애플리케이션 재시작 시 손실됨).
-   `FilePersistencyStorageProvider`: 체크포인트를 파일 시스템에 영속화합니다.
-   `NoPersistencyStorageProvider`: 체크포인트를 저장하지 않는 no-op 구현입니다. 이것이 기본 제공자입니다.

`PersistencyStorageProvider` 인터페이스를 구현하여 사용자 지정 스토리지 제공자를 구현할 수도 있습니다.
자세한 내용은 [사용자 지정 스토리지 제공자](#custom-storage-providers)를 참조하세요.

### 연속 영속성

연속 영속성은 각 노드가 실행된 후 체크포인트가 자동으로 생성됨을 의미합니다.
연속 영속성을 활성화하려면 아래 코드를 사용하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.snapshot.feature.Persistency
import ai.koog.agents.snapshot.providers.InMemoryPersistencyStorageProvider
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels

val agent = AIAgent(
    executor = simpleOllamaAIExecutor(),
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

활성화되면 에이전트는 각 노드가 실행된 후 자동으로 체크포인트를 생성하여,
세밀한 복구를 가능하게 합니다.

## 기본 사용법

### 체크포인트 생성

에이전트 실행 중 특정 시점에서 체크포인트를 생성하는 방법을 알아보려면 아래 코드 샘플을 참조하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContextBase) {
    // 현재 상태로 체크포인트를 생성합니다.
    val checkpoint = context.persistency().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
    )

    // 체크포인트 ID는 나중에 사용할 수 있도록 저장할 수 있습니다.
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistency-05.kt -->

### 체크포인트에서 복원

특정 체크포인트에서 에이전트의 상태를 복원하려면 아래 코드 샘플을 따르세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
-->

```kotlin
suspend fun example(context: AIAgentContextBase, checkpointId: String) {
    // 특정 체크포인트로 롤백합니다.
    context.persistency().rollbackToCheckpoint(checkpointId, context)

    // 또는 최신 체크포인트로 롤백합니다.
    context.persistency().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistency-06.kt -->

### 확장 함수 사용

에이전트 영속성 기능은 체크포인트 작업을 위한 편리한 확장 함수를 제공합니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.example.exampleAgentPersistency05.inputData
import ai.koog.agents.example.exampleAgentPersistency05.inputType
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.agents.snapshot.feature.withPersistency
-->

```kotlin
suspend fun example(context: AIAgentContextBase) {
    // 체크포인트 기능에 접근합니다.
    val checkpointFeature = context.persistency()

    // 또는 체크포인트 기능으로 작업을 수행합니다.
    context.withPersistency(context) { ctx ->
        // 'this'는 체크포인트 기능입니다.
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

## 고급 사용법

### 사용자 지정 스토리지 제공자

`PersistencyStorageProvider` 인터페이스를 구현하여 사용자 지정 스토리지 제공자를 구현할 수 있습니다.

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
        // 구현
    }
    
    override suspend fun saveCheckpoint(agentCheckpointData: AgentCheckpointData) {
        // 구현
    }
    
    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        // 구현
    }
}
```

<!--- KNIT example-agent-persistency-08.kt -->

기능 구성에서 사용자 지정 제공자를 사용하려면, 에이전트에서 에이전트 영속성 기능을 구성할 때 이를 스토리지로 설정하세요.

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
    executor = simpleOllamaAIExecutor(),
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

### 실행 지점 설정

고급 제어를 위해 에이전트의 실행 지점을 직접 설정할 수 있습니다.

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContextBase
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.prompt.message.Message.User
import kotlinx.serialization.json.JsonPrimitive

val customInput = JsonPrimitive("custom-input")
val customMessageHistory = emptyList<User>()
-->

```kotlin
fun example(context: AIAgentContextBase) {
    context.persistency().setExecutionPoint(
        agentContext = context,
        nodeId = "target-node-id",
        messageHistory = customMessageHistory,
        input = customInput
    )
}

```

<!--- KNIT example-agent-persistency-10.kt -->

이는 단순히 체크포인트에서 복원하는 것을 넘어 에이전트의 상태에 대한 더 세밀한 제어를 가능하게 합니다.