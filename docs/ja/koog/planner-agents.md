# プランナーエージェント

プランナーエージェントは、反復的な計画サイクルを通じて多段階のタスクを計画・実行できるAIエージェントです。これらは継続的に計画を構築または更新し、ステップを実行し、目標が達成されたかどうかを確認します。

プランナーエージェントは、高レベルの目標をより小さく実行可能なステップに分解し、各ステップの結果に基づいて計画を適応させる必要がある複雑なタスクに適しています。

## 前提条件

始める前に、以下が揃っていることを確認してください。

- 動作するKotlin/JVMプロジェクト。
- Java 17以降がインストールされていること。
- AIエージェントの実装に使用するLLMプロバイダーからの有効なAPIキー。利用可能なすべてのプロバイダーのリストについては、[LLMプロバイダー](llm-providers.md)を参照してください。

!!! tip
    APIキーは、環境変数または安全な設定管理システムを使用して保存してください。
    ソースコードにAPIキーを直接ハードコードすることは避けてください。

## 依存関係の追加

プランナーエージェントを使用するには、以下の依存関係をビルド設定に含めてください。

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    implementation("ai.koog.agents:agents-planner:$koog_version")
    // Include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

すべての利用可能なインストール方法については、[Koogのインストール](getting-started.md#install-koog)を参照してください。

## プランナーエージェントの仕組み

プランナーエージェントは、反復的な計画サイクルを通じて動作します。

1.  **計画の構築**: プランナーは現在の状態に基づいて計画を作成または更新します
2.  **ステップの実行**: プランナーは計画から単一のステップを実行し、状態を更新します
3.  **完了の確認**: プランナーは、状態を目標条件と照合することで、目標が達成されたかどうかを判断します
4.  **繰り返し**: 目標が達成されていない場合、サイクルはステップ1から繰り返されます

## シンプルなLLMベースのプランナー

シンプルなLLMベースのプランナーは、LLMを使用して計画を生成および評価します。これらは文字列状態、つまり単一の`String`で動作し、LLMリクエストを通じてステップを実行します。Koogは、すぐに使える状態で2つのシンプルなプランナー、`SimpleLLMPlanner`と`SimpleLLMWithCriticPlanner`を提供します。

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.planner.AIAgentPlannerStrategy
import ai.koog.agents.planner.PlannerAIAgent
import ai.koog.agents.planner.llm.SimpleLLMPlanner
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// Create the planner
val planner = SimpleLLMPlanner()

// Wrap it in a planner strategy
val strategy = AIAgentPlannerStrategy(
    name = "simple-planner",
    planner = planner
)

// Configure the agent
val agentConfig = AIAgentConfig(
    prompt = prompt("planner") {
        system("You are a helpful planning assistant.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50
)

// Create the planner agent
val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

// Run the agent with a task
val result = agent.run("Create a plan to organize a team meeting")
println(result)
```
<!--- KNIT example-planner-01.kt -->

## GOAP (Goal-Oriented Action Planning)

GOAPは、A*探索を使用して最適なアクションシーケンスを見つけるアルゴリズム的計画アプローチです。LLMを使用して計画を生成する代わりに、GOAPは、事前に定義された目標とアクションに基づいてアクションシーケンスを自動的に発見します。

### 主要な概念

GOAPプランナーは、主に3つの概念を扱います。

-   **状態**: 世界の現在の状態を表します
-   **アクション**: 事前条件、効果（信念）、コスト、実行ロジックなど、何ができるかを定義します
-   **目標**: 目標条件、ヒューリスティックコスト、および価値関数を定義します

プランナーはA*探索を使用して、総コストを最小限に抑えながら目標条件を満たすアクションシーケンスを見つけます。

### GOAPエージェントの作成

GOAPエージェントを作成するには、次のことを行う必要があります。

1.  状態タイプを定義します
2.  事前条件と効果を持つアクションを定義します
3.  完了条件を持つ目標を定義します
4.  DSLを使用してGOAPプランナーを作成します
5.  それをプランナーストラテジーとエージェントにラップします

次の例では、GOAPが高レベルの計画（概要 → 下書き → レビュー → 公開）を処理し、LLMが各アクション内で実際のコンテンツ生成を実行します。

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.context.AIAgentFunctionalContext
import ai.koog.agents.planner.AIAgentPlannerStrategy
import ai.koog.agents.planner.PlannerAIAgent
import ai.koog.agents.planner.goap.goap
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
import kotlin.reflect.typeOf

suspend fun main() {
-->
<!--- SUFFIX
}
-->
```kotlin
// Define a state for content creation
data class ContentState(
    val topic: String,
    val hasOutline: Boolean = false,
    val outline: String = "",
    val hasDraft: Boolean = false,
    val draft: String = "",
    val hasReview: Boolean = false,
    val isPublished: Boolean = false
)

// Create GOAP planner with LLM-powered actions
val planner = goap<ContentState>(typeOf<ContentState>()) {
    action(
        name = "Create outline",
        precondition = { state -> !state.hasOutline },
        belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
        cost = { 1.0 }
    ) { ctx, state ->
        // Use LLM to create the outline
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Create a detailed outline for an article about: ${state.topic}")
            }
            requestLLM()
        }
        state.copy(hasOutline = true, outline = response.content)
    }

    action(
        name = "Write draft",
        precondition = { state -> state.hasOutline && !state.hasDraft },
        belief = { state -> state.copy(hasDraft = true, draft = "Draft") },
        cost = { 2.0 }
    ) { ctx, state ->
        // Use LLM to write the draft
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Write an article based on this outline:
${state.outline}")
            }
            requestLLM()
        }
        state.copy(hasDraft = true, draft = response.content)
    }

    action(
        name = "Review content",
        precondition = { state -> state.hasDraft && !state.hasReview },
        belief = { state -> state.copy(hasReview = true) },
        cost = { 1.0 }
    ) { ctx, state ->
        // Use LLM to review the draft
        val response = ctx.llm.writeSession {
            appendPrompt {
                user("Review this article and suggest improvements:
${state.draft}")
            }
            requestLLM()
        }
        println("Review feedback: ${response.content}")
        state.copy(hasReview = true)
    }

    action(
        name = "Publish",
        precondition = { state -> state.hasReview && !state.isPublished },
        belief = { state -> state.copy(isPublished = true) },
        cost = { 1.0 }
    ) { ctx, state ->
        println("Publishing article...")
        state.copy(isPublished = true)
    }

    goal(
        name = "Published article",
        description = "Complete and publish the article",
        condition = { state -> state.isPublished }
    )
}

// Create and run the agent
val strategy = AIAgentPlannerStrategy("content-planner", planner)
val agentConfig = AIAgentConfig(
    prompt = prompt("writer") {
        system("You are a professional content writer.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 20
)

val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

val result = agent.run(ContentState(topic = "The Future of AI in Software Development"))
println("Final state: $result")
```
<!--- KNIT example-planner-02.kt -->

## 高度なGOAP機能

### カスタムコスト関数

プランナーをガイドするために、アクションと目標にカスタムコスト関数を定義できます。

```kotlin
action(
    name = "Expensive operation",
    precondition = { true },
    belief = { state -> state.copy(operationDone = true) },
    cost = { state ->
        // 状態に基づいて動的にコストを計算
        if (state.hasOptimization) 1.0 else 10.0
    }
) { ctx, state ->
    // アクションを実行
    state.copy(operationDone = true)
}
```

### 状態の信念と実際の実行

GOAPは、信念（楽観的な予測）と実際の実行を区別します。

-   **信念**: プランナーが何が起こると考えるか（計画に使用される）
-   **実行**: 実際に何が起こるか（実際の状態更新に使用される）

これにより、プランナーは期待される結果に基づいて計画を立て、実際の結果を適切に処理できます。

```kotlin
action(
    name = "Attempt complex task",
    precondition = { state -> !state.taskComplete },
    belief = { state ->
        // 楽観的な信念: タスクは成功する
        state.copy(taskComplete = true)
    },
    cost = { 5.0 }
) { ctx, state ->
    // 実際の実行は失敗したり、異なる結果になったりする可能性がある
    val success = performComplexTask()
    state.copy(
        taskComplete = success,
        attempts = state.attempts + 1
    )
}