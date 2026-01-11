# 規劃代理程式

規劃代理程式 (Planner agents) 是一種 AI 代理程式，能夠透過迭代規劃週期 (iterative planning cycles) 來規劃及執行多步驟任務。它們持續建立或更新計劃、執行步驟，並檢查目標是否已達成。

規劃代理程式適用於需要將高層級目標拆解為更小、可執行步驟，並根據每個步驟的結果調整計劃的複雜任務。

## 先決條件

在開始之前，請確保您已具備以下條件：

-   一個可運作的 Kotlin/JVM 專案。
-   已安裝 Java 17+。
-   從用於實作 AI 代理程式的 LLM 提供者取得的有效 API 密鑰。有關所有可用提供者的列表，請參閱 [LLM 提供者](llm-providers.md)。

!!! tip
    請使用環境變數或安全的組態管理系統來儲存您的 API 密鑰。
    避免將 API 密鑰直接硬編碼在原始碼中。

## 新增依賴項

若要使用規劃代理程式，請在您的建置組態中包含以下依賴項：

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    implementation("ai.koog.agents:agents-planner:$koog_version")
    // Include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

有關所有可用的安裝方法，請參閱 [安裝 Koog](getting-started.md#install-koog)。

## 規劃代理程式的工作原理

規劃代理程式透過迭代規劃週期運作：

1.  **建立計劃**：規劃器根據當前狀態建立或更新計劃。
2.  **執行步驟**：規劃器執行計劃中的單一步驟，更新狀態。
3.  **檢查完成**：規劃器透過比對狀態與目標條件來判斷目標是否已達成。
4.  **重複**：如果目標尚未達成，則從步驟 1 重複此週期。

## 簡單的基於 LLM 的規劃器

簡單的基於 LLM 的規劃器 (Simple LLM-based planners) 使用 LLM 來生成和評估計劃。它們在字串狀態 (即單一 `String`) 上操作，並透過 LLM 請求執行步驟。Koog 開箱即用地提供了兩種簡單的規劃器：`SimpleLLMPlanner` 和 `SimpleLLMWithCriticPlanner`：

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

## GOAP (目標導向行動規劃)

GOAP 是一種演算法規劃方法，使用 A* 搜尋來尋找最佳行動序列。GOAP 不使用 LLM 來生成計劃，而是根據預定義的目標和行動自動發現行動序列。

### 關鍵概念

GOAP 規劃器主要處理三個概念：

-   **狀態 (State)**：表示世界的當前狀態。
-   **行動 (Actions)**：定義可執行的操作，包括前置條件、影響 (信念)、成本和執行邏輯。
-   **目標 (Goals)**：定義目標條件、啟發式成本和價值函數。

規劃器使用 A* 搜尋來尋找滿足目標條件同時最小化總成本的行動序列。

### 建立 GOAP 代理程式

若要建立 GOAP 代理程式，您需要：

1.  定義您的狀態類型。
2.  定義具有前置條件和影響的行動。
3.  定義具有完成條件的目標。
4.  使用 DSL 建立 GOAP 規劃器。
5.  將其包裝在規劃策略和代理程式中。

在以下範例中，GOAP 處理高層級規劃 (大綱 → 草稿 → 審閱 → 發布)，而 LLM 在每個行動中執行實際的內容生成。

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

## 進階 GOAP 功能

### 自訂成本函數

您可以為行動和目標定義自訂成本函數來引導規劃器：

```kotlin
action(
    name = "Expensive operation",
    precondition = { true },
    belief = { state -> state.copy(operationDone = true) },
    cost = { state ->
        // Dynamic cost based on state
        if (state.hasOptimization) 1.0 else 10.0
    }
) { ctx, state ->
    // Execute action
    state.copy(operationDone = true)
}
```

### 狀態信念與實際執行

GOAP 區分信念 (樂觀預測) 和實際執行：

-   **信念**：規劃器認為會發生什麼 (用於規劃)。
-   **執行**：實際發生了什麼 (用於真實狀態更新)。

這使得規劃器能夠根據預期結果制定計劃，同時適當處理實際結果：

```kotlin
action(
    name = "Attempt complex task",
    precondition = { state -> !state.taskComplete },
    belief = { state ->
        // Optimistic belief: task will succeed
        state.copy(taskComplete = true)
    },
    cost = { 5.0 }
) { ctx, state ->
    // Actual execution might fail or have different results
    val success = performComplexTask()
    state.copy(
        taskComplete = success,
        attempts = state.attempts + 1
    )
}