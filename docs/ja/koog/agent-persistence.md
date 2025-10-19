# エージェントの永続化

エージェントの永続化は、KoogフレームワークにおけるAIエージェントにチェックポイント機能を提供する機能です。
これにより、エージェントの実行中の特定の時点で状態を保存および復元することができ、以下のような機能が可能になります。

- 特定の時点からエージェントの実行を再開する
- 以前の状態にロールバックする
- セッション間でエージェントの状態を永続化する

## 主要な概念

### チェックポイント

チェックポイントは、エージェントの実行中の特定の時点における完全な状態を捕捉します。これには以下が含まれます。

- メッセージ履歴（ユーザー、システム、アシスタント、ツール間のすべての対話）
- 現在実行中のノード
- 現在のノードの入力データ
- 作成タイムスタンプ

チェックポイントは一意のIDによって識別され、特定のAIエージェントに関連付けられています。

## 前提条件

エージェントの永続化機能を使用するには、エージェントの戦略内のすべてのノードが一意の名前を持っている必要があります。
これは、機能がインストールされるときに強制されます。

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

グラフ内のノードには必ず一意の名前を設定してください。

## インストール

エージェントの永続化機能を使用するには、エージェントの設定にこの機能を追加します。

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
        // スナップショットにインメモリストレージを使用
        storage = InMemoryPersistenceStorageProvider()
        // 自動永続化を有効にする
        enableAutomaticPersistence = true
    }
}
```

<!--- KNIT example-agent-persistence-02.kt -->

## 設定オプション

エージェントの永続化機能には、主に2つの設定オプションがあります。

-   **ストレージプロバイダー**: チェックポイントを保存および取得するために使用されるプロバイダー。
-   **継続的な永続化**: 各ノードの実行後にチェックポイントを自動的に作成する機能。

### ストレージプロバイダー

チェックポイントを保存および取得するために使用されるストレージプロバイダーを設定します。

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

フレームワークには、以下の組み込みプロバイダーが含まれています。

-   `InMemoryPersistenceStorageProvider`: チェックポイントをメモリに保存します（アプリケーションの再起動時に失われます）。
-   `FilePersistenceStorageProvider`: チェックポイントをファイルシステムに永続化します。
-   `NoPersistenceStorageProvider`: チェックポイントを保存しない何もしない (no-op) 実装です。これがデフォルトのプロバイダーです。

`PersistenceStorageProvider` インターフェースを実装することで、カスタムストレージプロバイダーを実装することもできます。
詳細については、[カスタムストレージプロバイダー](#custom-storage-providers)を参照してください。

### 継続的な永続化

継続的な永続化とは、各ノードの実行後にチェックポイントが自動的に作成されることを意味します。
継続的な永続化を有効にするには、以下のコードを使用します。

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

有効にすると、エージェントは各ノードの実行後に自動的にチェックポイントを作成し、きめ細かいリカバリを可能にします。

## 基本的な使い方

### チェックポイントの作成

エージェントの実行中の特定の時点にチェックポイントを作成する方法については、以下のコードサンプルを参照してください。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
import kotlin.reflect.typeOf

const val inputData = "some-input-data"
val inputType = typeOf<String>()
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // 現在の状態を含むチェックポイントを作成します
    val checkpoint = context.persistence().createCheckpoint(
        agentContext = context,
        nodeId = "current-node-id",
        lastInput = inputData,
        lastInputType = inputType,
        checkpointId = context.runId,
        version = 0L
    )

    // チェックポイントIDは後で使用するために保存できます
    val checkpointId = checkpoint?.checkpointId
}
```

<!--- KNIT example-agent-persistence-05.kt -->

### チェックポイントからの復元

特定のチェックポイントからエージェントの状態を復元するには、以下のコードサンプルに従ってください。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.snapshot.feature.persistence
-->

```kotlin
suspend fun example(context: AIAgentContext, checkpointId: String) {
    // 特定のチェックポイントにロールバックします
    context.persistence().rollbackToCheckpoint(checkpointId, context)

    // または最新のチェックポイントにロールバックします
    context.persistence().rollbackToLatestCheckpoint(context)
}
```

<!--- KNIT example-agent-persistence-06.kt -->

#### ツールによって生成されたすべての副作用のロールバック

ツールによっては副作用を生成することがよくあります。特に、バックエンドでエージェントを実行している場合、
一部のツールはデータベーストランザクションを実行する可能性があります。これにより、エージェントが時間を遡るのがはるかに困難になります。

データベースに新しいユーザーを作成するツール `createUser` があるとします。そして、エージェントが時間の経過とともに複数のツール呼び出しを生成しました。
```
tool call: createUser "Alex"

->>>> checkpoint-1 <<<<-

tool call: createUser "Daniel"
tool call: createUser "Maria"
```

そして、今チェックポイントにロールバックしたいとします。エージェントの状態（メッセージ履歴や戦略グラフノードを含む）を復元するだけでは、
チェックポイント前の正確な状態を達成するには不十分です。ツール呼び出しによって生成された副作用も復元する必要があります。上記の例では、
これはデータベースから`Maria`と`Daniel`を削除することを意味します。

Koog Persistenceでは、`Persistence`機能設定に`RollbackToolRegistry`を提供することで、これを実現できます。

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
        // すべての`createUser`ツール呼び出しに対し、目的の実行ポイントにロールバックする際に、逆順で`removeUser`が呼び出されます。
        // 注: `removeUser`ツールは、`createUser`とまったく同じ引数を取る必要があります。
        // `removeUser`の呼び出しが`createUser`のすべての副作用をロールバックすることを確認するのは開発者の責任です。
        registerRollback(::createUser, ::removeUser)
    }
}
```

<!--- KNIT example-agent-persistence-07.kt -->

### 拡張関数の使用

エージェントの永続化機能は、チェックポイントを操作するための便利な拡張関数を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.context.AIAgentContext
import ai.koog.agents.example.exampleAgentPersistence05.inputData
import ai.koog.agents.example.exampleAgentPersistence05.inputType
import ai.koog.agents.snapshot.feature.persistence
import ai.koog.agents.snapshot.feature.withPersistence
-->

```kotlin
suspend fun example(context: AIAgentContext) {
    // チェックポイント機能にアクセスします
    val checkpointFeature = context.persistence()

    // またはチェックポイント機能を使用してアクションを実行します
    context.withPersistence { ctx ->
        // 'this' はチェックポイント機能です
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

## 高度な使い方

### カスタムストレージプロバイダー

`PersistenceStorageProvider` インターフェースを実装することで、カスタムストレージプロバイダーを実装できます。

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

機能設定でカスタムプロバイダーを使用するには、エージェントの永続化機能をエージェントに設定する際に、それをストレージとして設定します。

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

### 実行ポイントの設定

高度な制御のために、エージェントの実行ポイントを直接設定できます。

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

これにより、チェックポイントからの復元にとどまらず、エージェントの状態をよりきめ細かく制御できます。