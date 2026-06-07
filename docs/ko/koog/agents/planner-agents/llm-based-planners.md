---
status: beta
---

# LLM 기반 플래너

--8<-- "versioning-snippets.md:beta"

LLM 기반 플래너는 LLM을 사용하여 계획을 생성하고 평가합니다.
이들은 문자열 기반 상태(string-based state)에서 작동하며 LLM 요청을 통해 단계를 실행합니다.
문자열 기반 상태란 에이전트 상태가 단일 문자열임을 의미합니다.
각 단계에서 에이전트는 초기 상태 문자열을 수락하고 결과로 최종 상태 문자열을 반환합니다.

??? note "사전 요구 사항"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    이 페이지의 예제들은 `OPENAI_API_KEY` 환경 변수가 설정되어 있다고 가정합니다.

Koog는 두 가지 간단한 플래너를 제공합니다:

- [SimpleLLMPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-m-planner/index.html)
  처음에 한 번만 계획을 생성하고 완료될 때까지 그 계획을 따릅니다.
  재계획(replanning)을 포함하려면 `SimpleLLMPlanner`를 확장하고 `assessPlan` 메서드를 오버라이드하여,
  에이전트가 언제 재계획을 수행해야 하는지 표시하십시오.
- [SimpleLLMWithCriticPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.llm/-simple-l-l-with-critic-planner/index.html)
  LLM 요청을 통해 계획의 유효성을 확인하고 에이전트가 재계획을 해야 하는지 평가하는 
  LLM을 사용하는 `assessPlan` 메서드를 구현합니다.

다음 예제는 `SimpleLLMPlanner`를 사용하여 간단한 플래너 에이전트를 생성하는 방법을 보여줍니다:

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
    // 플래너 생성
    val planner = SimpleLLMPlanner()

    // 플래너 전략으로 감싸기
    val strategy = AIAgentPlannerStrategy(
        name = "simple-planner",
        planner = planner
    )

    // 에이전트 구성
    val agentConfig = AIAgentConfig(
        prompt = prompt("planner") {
            system("You are a helpful planning assistant.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 50
    )

    // 플래너 에이전트 생성
    val agent = PlannerAIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        strategy = strategy,
        agentConfig = agentConfig
    )

    suspend fun main() {
        // 작업을 사용하여 에이전트 실행
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
    // LLM 기반 플래너를 사용한 플래너 전략 생성
    AIAgentPlannerStrategy<String, String> strategy =
        Planners.llmBased("simple-planner")
            .build();

    // OpenAI 실행기(executor) 생성
    var promptExecutor = PromptExecutor.builder()
        .openAI("OPENAI_API_KEY")
        .build();

    // AIAgent 빌더를 사용하여 플래너 에이전트 생성
    AIAgent<String, String> agent = AIAgent.builder()
        .plannerStrategy(strategy)
        .promptExecutor(promptExecutor)
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful planning assistant.")
        .maxIterations(50)
        .build();

    // 작업을 사용하여 에이전트 실행
    String result = agent.run("Create a plan to organize a team meeting");
    System.out.println(result);
    ```
     <!--- KNIT exampleLLMBasedPlannerJava01.java -->

## 다음 단계

- [GOAP 에이전트](goap-agents.md)에 대해 알아보기