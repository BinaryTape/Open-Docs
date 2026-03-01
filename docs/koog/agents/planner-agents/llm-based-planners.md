# 基于 LLM 的规划器

基于 LLM 的规划器使用 LLM 来生成并评估计划。
它们在基于字符串的状态上运行，并通过 LLM 请求执行步骤。
基于字符串的状态意味着智能体状态是一个单一字符串。
在每一步中，智能体接收一个初始状态字符串，并返回最终状态字符串作为结果。

??? note "前置条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    本页中的示例假设你已设置了 `OPENAI_API_KEY` 环境变量。

Koog 提供了两种简单的规划器：

- [SimpleLLMPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-planner/index.html)
  仅在最开始生成一次计划，然后按照该计划执行直至完成。
  要包含重新规划，请扩展 `SimpleLLMPlanner` 并重写 `assessPlan` 方法，以指示智能体何时应该重新规划。
- [SimpleLLMWithCriticPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-with-critic-planner/index.html)
  实现了 `assessPlan` 方法，该方法通过 LLM 请求使用 LLM 检查计划的有效性，并评估智能体是否应该重新规划。

以下示例展示了如何使用 `SimpleLLMPlanner` 创建一个简单的规划器智能体：

<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.planner.AIAgentPlannerStrategy
import ai.koog.agents.planner.PlannerAIAgent
import ai.koog.agents.planner.llm.SimpleLLMPlanner
import ai.koog.prompt.dsl.prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
// 创建规划器
val planner = SimpleLLMPlanner()

// 将其封装在规划器策略中
val strategy = AIAgentPlannerStrategy(
    name = "simple-planner",
    planner = planner
)

// 配置智能体
val agentConfig = AIAgentConfig(
    prompt = prompt("planner") {
        system("You are a helpful planning assistant.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50
)

// 创建规划器智能体
val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

suspend fun main() {
    // 运行智能体以执行任务
    val result = agent.run("Create a plan to organize a team meeting")
    println(result)
}
```
<!--- KNIT example-llm-based-planners-01.kt -->

## 后续步骤

- 了解 [GOAP 智能体](goap-agents.md)