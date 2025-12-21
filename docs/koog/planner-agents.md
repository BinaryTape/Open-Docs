# 规划器代理

规划器代理是 AI 代理，能够通过迭代规划周期来规划和执行多步任务。它们持续构建或更新计划，执行步骤，并检测目标是否已实现。

规划器代理适用于需要将高层目标分解为更小、可操作的步骤，并根据每一步的结果调整计划的复杂任务。

## 先决条件

开始之前，请确保你已具备以下条件：

-   一个正常工作的 Kotlin/JVM 项目。
-   已安装 Java 17+。
-   来自用于实现 AI 代理的 LLM 提供商的有效 API 密钥。有关所有可用提供商的列表，请参考 [LLM providers](llm-providers.md)。

!!! tip
    请使用环境变量或安全的配置管理系统来存储你的 API 密钥。
    避免将 API 密钥直接硬编码到你的源代码中。

## 添加依赖项

要使用规划器代理，请在你的构建配置中包含以下依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    implementation("ai.koog.agents:agents-planner:$koog_version")
    // Include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

有关所有可用安装方法，请参阅 [Install Koog](getting-started.md#install-koog)。

## 规划器代理的工作原理

规划器代理通过迭代规划周期运行：

1.  **构建计划**：规划器根据当前状态创建或更新计划。
2.  **执行步骤**：规划器执行计划中的单个步骤，更新状态。
3.  **检测完成情况**：规划器通过对照目标条件检测状态，确定目标是否已实现。
4.  **重复**：如果目标未实现，则从步骤 1 重复该周期。

## 简单基于 LLM 的规划器

简单基于 LLM 的规划器使用 LLM 来生成和求值计划。它们在字符串状态（即单个 `String`）上操作，并通过 LLM 请求执行步骤。Koog 开箱即用地提供了两种简单规划器：`SimpleLLMPlanner` 和 `SimpleLLMWithCriticPlanner`：

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

## GOAP (目标导向行动规划)

GOAP 是一种算法规划方法，它使用 A* 搜索来查找最优行动序列。GOAP 不使用 LLM 来生成计划，而是根据预定义的目标和行动自动发现行动序列。

### 关键概念

GOAP 规划器使用三个主要概念：

-   **State（状态）**：代表世界的当前状态。
-   **Actions（行动）**：定义可以做什么，包括前置条件、影响（信念）、成本和执行逻辑。
-   **Goals（目标）**：定义目标条件、启发式成本和值函数。

规划器使用 A* 搜索来查找满足目标条件同时最小化总成本的行动序列。

### 创建 GOAP 代理

要创建 GOAP 代理，你需要：

1.  定义你的状态类型。
2.  定义具有前置条件和影响的行动。
3.  定义具有完成条件的目标。
4.  使用 DSL 创建 GOAP 规划器。
5.  将其包装在规划器策略和代理中。

在以下示例中，GOAP 处理高层规划（大纲 → 草稿 → 审阅 → 发布），而 LLM 在每个行动中执行实际的内容生成。

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.agent.context.AIAgentFunctionalContext
import ai.koog.agents.core.dsl.extension.requestLLM
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

## 高级 GOAP 特性

### 自定义成本函数

你可以为行动和目标定义自定义成本函数，以指导规划器：

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

### 状态信念 vs 实际执行

GOAP 区分信念（乐观预测）和实际执行：

-   **Belief（信念）**：规划器认为会发生什么（用于规划）。
-   **Execution（执行）**：实际发生了什么（用于真实状态更新）。

这允许规划器根据预期结果制定计划，同时正确处理实际结果：

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
```