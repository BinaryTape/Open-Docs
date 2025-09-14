# エージェントの永続化

エージェントの永続化（Agent Persistency）は、KoogフレームワークにおけるAIエージェントにチェックポイント機能を提供する機能です。
これにより、実行中の特定ポイントでエージェントの状態を保存・復元できるようになり、以下の機能が利用可能になります。

- 特定ポイントからのエージェント実行の再開
- 以前の状態へのロールバック
- セッションをまたいだエージェント状態の永続化

## 主要な概念

### チェックポイント

チェックポイントは、エージェント実行中の特定時点における完全な状態を捕捉します。これには以下が含まれます。

- メッセージ履歴（ユーザー、システム、アシスタント、ツール間のすべてのやり取り）
- 現在実行中のノード
- 現在のノードに対する入力データ
- 作成日時

チェックポイントは一意のIDで識別され、特定のエージェントに関連付けられます。

## 前提条件

エージェントの永続化機能を利用するには、エージェントのストラテジー内のすべてのノードが一意の名前を持つ必要があります。
これは、機能がインストールされる際に強制されます。

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

グラフ内のノードに一意の名前を設定してください。

## インストール

エージェントの永続化機能を使用するには、エージェントの設定に追加します。

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
        // スナップショットにインメモリストレージを使用
        storage = InMemoryPersistencyStorageProvider("in-memory-storage")
        // 自動永続化を有効にする
        enableAutomaticPersistency = true
    }
}
```

<!--- KNIT example-agent-persistency-02.kt -->

## 設定オプション

エージェントの永続化機能には、主に2つの設定オプションがあります。

- **ストレージプロバイダー**: チェックポイントの保存と取得に使用されるプロバイダー。
- **継続的な永続化**: 各ノードの実行後にチェックポイントを自動的に作成する機能。

### ストレージプロバイダー

チェックポイントの保存と取得に使用されるストレージプロバイダーを設定します。

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

フレームワークには、以下の組み込みプロバイダーが含まれています。

- `InMemoryPersistencyStorageProvider`: チェックポイントをメモリに保存します（アプリケーションの再起動時に失われます）。
- `FilePersistencyStorageProvider`: チェックポイントをファイルシステムに永続化します。
- `NoPersistencyStorageProvider`: チェックポイントを保存しないno-op実装です。これはデフォルトのプロバイダーです。

`PersistencyStorageProvider`インターフェースを実装することで、カスタムストレージプロバイダーを実装することもできます。
詳細については、[カスタムストレージプロバイダー](#custom-storage-providers)を参照してください。

### 継続的な永続化

継続的な永続化とは、各ノードの実行後にチェックポイントが自動的に作成されることを意味します。
継続的な永続化を有効にするには、以下のコードを使用します。

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

有効化すると、エージェントは各ノードの実行後に自動的にチェックポイントを作成し、きめ細かいリカバリを可能にします。

## 基本的な使用方法

### チェックポイントの作成

エージェントの実行中の特定ポイントでチェックポイントを作成する方法については、以下のコードサンプルを参照してください。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistency
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 現在の状態でチェックポイントを作成
    val checkpoint = context.persistency().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
    )

    // チェックポイントIDは後で使用するために保存できます
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistency-05.kt -->

### チェックポイントからの復元

特定チェックポイントからエージェントの状態を復元するには、以下のコードサンプルに従ってください。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistency
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 特定のチェックポイントにロールバック
    context.persistency().rollbackToCheckpoint(checkpointId, context)

    // または最新のチェックポイントにロールバック
    context.persistency().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistency-06.kt -->

### 拡張関数の使用

エージェントの永続化機能は、チェックポイントを操作するための便利な拡張関数を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistency05.inputData
import ai.koog.agents.example.exampleAgentPersistency05.inputType
import ai.koog.agents.snapshot.feature.persistency
import ai.koog.agents.snapshot.feature.withPersistency
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // チェックポイント機能にアクセス
    val checkpointFeature = context.persistency()

    // またはチェックポイント機能でアクションを実行
    context.withPersistency(context) { ctx ->
        // 'this'はチェックポイント機能です
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

## 高度な使用方法

### カスタムストレージプロバイダー

`PersistencyStorageProvider`インターフェースを実装することで、カスタムストレージプロバイダーを実装できます。

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
        // 実装
    }
    
    override suspend fun saveCheckpoint(agentCheckpointData: AgentCheckpointData) {
        // 実装
    }
    
    override suspend fun getLatestCheckpoint(agentId: String): AgentCheckpointData? {
        // 実装
    }
}
```

<!--- KNIT example-agent-persistency-08.kt -->

機能設定でカスタムプロバイダーを使用するには、エージェントでエージェント永続化機能を設定する際に、それをストレージとして設定します。

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

### 実行ポイントの設定

高度な制御のために、エージェントの実行ポイントを直接設定できます。

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

これにより、チェックポイントからの復元だけでなく、エージェントの状態をよりきめ細かく制御できるようになります。