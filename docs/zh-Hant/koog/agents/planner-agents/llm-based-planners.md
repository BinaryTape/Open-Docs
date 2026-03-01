# 以 LLM 為基礎的規劃器

以 LLM 為基礎的規劃器使用 LLM 來產生與評估計畫。
它們在字串型狀態下運作，並透過 LLM 請求執行步驟。
字串型狀態意味著代理狀態是一個單一字串。
在每個步驟中，代理會接受一個初始狀態字串，並傳回最終狀態字串作為結果。

??? note "先決條件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    此頁面上的範例假設您已設定 `OPENAI_API_KEY` 環境變數。

Koog 提供兩種簡單的規劃器：

- [SimpleLLMPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-planner/index.html)
  僅在最開始時產生一次計畫，然後遵循該計畫直到完成。
  若要包含重新規劃，請擴充 `SimpleLLMPlanner` 並覆寫 `assessPlan` 方法，
  指出代理何時應重新規劃。
- [SimpleLLMWithCriticPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-with-critic-planner/index.html)
  實作了 `assessPlan` 方法，該方法使用 LLM 透過 LLM 請求檢查計畫的有效性，
  並評估代理是否應重新規劃。

以下範例顯示如何使用 `SimpleLLMPlanner` 建立一個簡單的規劃器代理：

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
// 建立規劃器
val planner = SimpleLLMPlanner()

// 將其包裝在規劃策略中
val strategy = AIAgentPlannerStrategy(
    name = "simple-planner",
    planner = planner
)

// 設定代理
val agentConfig = AIAgentConfig(
    prompt = prompt("planner") {
        system("You are a helpful planning assistant.")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50
)

// 建立規劃器代理
val agent = PlannerAIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    strategy = strategy,
    agentConfig = agentConfig
)

suspend fun main() {
    // 執行帶有任務的代理
    val result = agent.run("Create a plan to organize a team meeting")
    println(result)
}
```
<!--- KNIT example-llm-based-planners-01.kt -->

## 下一步

- 了解 [GOAP 代理](goap-agents.md)