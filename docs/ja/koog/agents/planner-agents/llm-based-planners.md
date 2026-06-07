---
status: beta
---

# LLMベースのプランナー

--8<-- "versioning-snippets.md:beta"

LLMベースのプランナーは、LLMを使用してプランの生成と評価を行います。
これらは文字列ベースの状態（string-based state）に基づいて動作し、LLMリクエストを通じて各ステップを実行します。
文字列ベースの状態とは、エージェントの状態が単一の文字列であることを意味します。
各ステップにおいて、エージェントは初期状態の文字列を受け取り、結果として最終状態の文字列を返します。

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    このページの例では、環境変数 `OPENAI_API_KEY` が設定されていることを前提としています。

Koogは2つのシンプルなプランナーを提供しています：

- [SimpleLLMPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-planner/index.html)
  は、最初に一度だけプランを生成し、完了するまでそのプランに従います。
  再プランニング（replanning）を含めるには、`SimpleLLMPlanner` を拡張して `assessPlan` メソッドをオーバーライドし、エージェントがいつ再プランニングすべきかを指定します。
- [SimpleLLMWithCriticPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-with-critic-planner/index.html)
  は、LLMリクエストを介してプランの妥当性を確認し、エージェントが再プランニングすべきかどうかを評価するためにLLMを使用する `assessPlan` メソッドを実装しています。

以下の例は、`SimpleLLMPlanner` を使用してシンプルなプランナーエージェントを作成する方法を示しています：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.agents.core.planner.AIAgentPlannerStrategy
    import ai.koog.agents.core.planner.PlannerAIAgent
    import ai.koog.agents.planner.llm.SimpleLLMPlanner
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import kotlinx.coroutines.runBlocking
    -->
    ```kotlin
    // プランナーの作成
    val planner = SimpleLLMPlanner()

    // プランナーストラテジーでラップする
    val strategy = AIAgentPlannerStrategy(
        name = "simple-planner",
        planner = planner
    )

    // エージェントの設定
    val agentConfig = AIAgentConfig(
        prompt = prompt("planner") {
            system("You are a helpful planning assistant.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 50
    )

    // プランナーエージェントの作成
    val agent = PlannerAIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        strategy = strategy,
        agentConfig = agentConfig
    )

    suspend fun main() {
        // タスクを指定してエージェントを実行
        val result = agent.run("Create a plan to organize a team meeting")
        println(result)
    }
    ```
    <!--- KNIT example-llm-based-planners-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.core.planner.AIAgentPlannerStrategy;
    import ai.koog.agents.planner.Planners;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleLLMBasedPlanner01 {
        public static void main(String[] args) {
    -->
    <!--- SUFFIX
        }
    }
    -->
    ```java
    // LLMベースのプランナーを使用してプランナーストラテジーを作成する
    AIAgentPlannerStrategy<String, String> strategy =
        Planners.llmBased("simple-planner")
            .build();

    // OpenAIエグゼキューターの作成
    var promptExecutor = PromptExecutor.builder()
        .openAI("OPENAI_API_KEY")
        .build();

    // AIAgentビルダーを使用してプランナーエージェントを作成する
    AIAgent<String, String> agent = AIAgent.builder()
        .plannerStrategy(strategy)
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful planning assistant.")
        .maxIterations(50)
        .build();

    // タスクを指定してエージェントを実行
    String result = agent.run("Create a plan to organize a team meeting");
    System.out.println(result);
    ```
     <!--- KNIT exampleLLMBasedPlannerJava01.java -->

## 次のステップ

- [GOAPエージェント](goap-agents.md)について学ぶ