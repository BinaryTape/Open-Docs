# GOAP 에이전트

GOAP는 [A* 탐색][A* search]을 사용하여 전체 비용을 최소화하면서 목표 조건을 충족하는 최적의 액션 시퀀스(action sequences)를 찾는 알고리즘 기반 설계 접근 방식입니다.
LLM을 사용하여 계획을 생성하는 [LLM 기반 플래너](llm-based-planners.md)와 달리,
GOAP 에이전트는 사전에 정의된 목표와 액션을 바탕으로 알고리즘을 통해 액션 시퀀스를 찾아냅니다.

GOAP 플래너는 세 가지 주요 개념을 중심으로 작동합니다:

- **상태 (State)**: 세상의 현재 상태를 나타냅니다.
- **액션 (Actions)**: 전제 조건(preconditions), 효과(믿음, beliefs), 비용 및 실행 로직을 포함하여 수행할 수 있는 작업을 정의합니다.
- **목표 (Goals)**: 타겟 조건, 휴리스틱 비용(heuristic costs) 및 가치 함수를 정의합니다.

??? note "Prerequisites"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    이 페이지의 예제들은 `OPENAI_API_KEY` 환경 변수가 설정되어 있다고 가정합니다.

Koog에서는 DSL을 사용하여 목표와 액션을 선언적으로 지정함으로써 GOAP 에이전트를 정의합니다.

GOAP 에이전트를 생성하려면 다음 단계가 필요합니다:

1. 목표에 특화된 다양한 측면을 나타내는 프로퍼티를 가진 데이터 클래스로 상태(state)를 정의합니다.
2. [goap()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/goap.html) 함수를 사용하여 [GOAPPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner/index.html) 인스턴스를 생성합니다.
    1. [action()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/action.html) 함수를 사용하여 전제 조건과 믿음을 가진 액션을 정의합니다.
    2. [goal()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/goal.html) 함수를 사용하여 완료 조건을 가진 목표를 정의합니다.
3. 플래너를 [AIAgentPlannerStrategy](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-strategy/index.html)로 감싸고 이를 [PlannerAIAgent](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-planner-a-i-agent/index.html) 생성자에 전달합니다.

!!! note

    플래너는 개별 액션과 그 시퀀스를 선택합니다.
    각 액션에는 액션이 실행되기 위해 참이어야 하는 전제 조건(precondition)과 
    예측된 결과를 정의하는 믿음(belief)이 포함됩니다.
    믿음에 대한 자세한 내용은 [실제 실행과 상태 믿음의 비교](#state-beliefs-compared-to-actual-execution)를 참조하세요.

다음 예제에서 GOAP는 기사 작성(개요 → 초안 → 리뷰 → 발행)을 위한 고수준 설계를 담당하고,
LLM은 각 액션 내에서 실제 콘텐츠 생성을 수행합니다.

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.agents.planner.AIAgentPlannerStrategy
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // 콘텐츠 생성을 위한 상태 정의
    data class ContentState(
        val topic: String,
        val hasOutline: Boolean = false,
        val outline: String = "",
        val hasDraft: Boolean = false,
        val draft: String = "",
        val hasReview: Boolean = false,
        val isPublished: Boolean = false
    ): GoapAgentState<String, String>(topic) {
        override fun provideOutput(): String = draft
    }

    // LLM 기반 액션을 포함한 GOAP 플래너 생성
    val planner = AIAgentPlannerStrategy.goap("content-planner", ::ContentState) {
        // 전제 조건과 믿음을 가진 액션 정의
        action(
            name = "Create outline",
            precondition = { state -> !state.hasOutline },
            belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
            cost = { 1.0 }
        ) { ctx, state ->
            // LLM을 사용하여 개요 생성
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
            // LLM을 사용하여 초안 작성
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
            // LLM을 사용하여 초안 리뷰
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

        // 완료 조건을 가진 목표 정의
        goal(
            name = "Published article",
            description = "Complete and publish the article",
            condition = { state -> state.isPublished }
        )
    }

    // 에이전트 생성 및 실행
    val agentConfig = AIAgentConfig(
        prompt = prompt("writer") {
            system("You are a professional content writer.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 20
    )

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        strategy = planner,
        agentConfig = agentConfig
    )

    suspend fun main() {
        val result = agent.run("The Future of AI in Software Development")
        println("Final state: $result")
    }
    ```
    <!--- KNIT example-goap-agents-01.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.planner.AIAgentPlannerStrategy;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleGoapAgents01 {
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    // 콘텐츠 생성을 위한 상태 정의
    static class ContentState extends GoapAgentState<String, String> {
        public String topic;
        public boolean hasOutline = false;
        public String outline = "";
        public boolean hasDraft = false;
        public String draft = "";
        public boolean hasReview = false;
        public boolean isPublished = false;
    
        public ContentState(String topic) {
            super(topic);
            this.topic = topic;
        }

        public ContentState copy(boolean hasOutline, String outline, boolean hasDraft,
                                 String draft, boolean hasReview, boolean isPublished) {
            ContentState state = new ContentState(topic);
            state.hasOutline = hasOutline;
            state.outline = outline;
            state.hasDraft = hasDraft;
            state.draft = draft;
            state.hasReview = hasReview;
            state.isPublished = isPublished;
            return state;
        }

        @Override
        public String provideOutput() {
            return draft;
        }
    }

    public static void main(String[] args) {
        var promptExecutor = PromptExecutor.builder()
            .openAI("OPENAI_API_KEY")
            .build();

        var strategy = AIAgentPlannerStrategy.builder("content-planner")
            .goap(ContentState::new)
            .action("Create outline", builder -> builder
                .precondition(state -> !state.hasOutline)
                .belief(state -> state.copy(true, "Outline", false, "", false, false))
                .cost(state -> 1.0)
                .execute((context, state) -> {
                    String response = context.llm().writeSession(session -> {
                        session.appendPrompt(prompt -> {
                            prompt.user("Create a detailed outline for an article about: " + state.topic);
                            return null;
                        });
                        return session.requestLLM().getContent();
                    });
                    return state.copy(true, response, state.hasDraft, state.draft,
                                    state.hasReview, state.isPublished);
                })
            )
            .action("Write draft", builder -> builder
                .precondition(state -> state.hasOutline && !state.hasDraft)
                .belief(state -> state.copy(state.hasOutline, state.outline, true, "Draft", false, false))
                .cost(state -> 2.0)
                .execute((context, state) -> {
                    String response = context.llm().writeSession(session -> {
                        session.appendPrompt(prompt -> {
                            prompt.user("Write an article based on this outline:
" + state.outline);
                            return null;
                        });
                        return session.requestLLM().getContent();
                    });
                    return state.copy(state.hasOutline, state.outline, true, response,
                                    state.hasReview, state.isPublished);
                })
            )
            .action("Review content", builder -> builder
                .precondition(state -> state.hasDraft && !state.hasReview)
                .belief(state -> state.copy(state.hasOutline, state.outline, state.hasDraft,
                                           state.draft, true, false))
                .cost(state -> 1.0)
                .execute((context, state) -> {
                    String response = context.llm().writeSession(session -> {
                        session.appendPrompt(prompt -> {
                            prompt.user("Review this article and suggest improvements:
" + state.draft);
                            return null;
                        });
                        return session.requestLLM().getContent();
                    });
                    System.out.println("Review feedback: " + response);
                    return state.copy(state.hasOutline, state.outline, state.hasDraft,
                                    state.draft, true, state.isPublished);
                })
            )
            .action("Publish", builder -> builder
                .precondition(state -> state.hasReview && !state.isPublished)
                .belief(state -> state.copy(state.hasOutline, state.outline, state.hasDraft,
                                           state.draft, state.hasReview, true))
                .cost(state -> 1.0)
                .execute((context, state) -> {
                    System.out.println("Publishing article...");
                    return state.copy(state.hasOutline, state.outline, state.hasDraft,
                                    state.draft, state.hasReview, true);
                })
            )
            .goal("Published article", builder -> builder
                .description("Complete and publish the article")
                .condition(state -> state.isPublished)
            )
            .build();

        var agent = AIAgent.builder()
            .plannerStrategy(strategy)
            .promptExecutor(promptExecutor)
            .llmModel(OpenAIModels.Chat.GPT4o)
            .systemPrompt("You are a professional content writer.")
            .maxIterations(20)
            .build();

        String result = agent.run("The Future of AI in Software Development");
        System.out.println("Final state: " + result);
    }
    ```
    <!--- KNIT exampleGoapAgentsJava01.java -->
    

## 사용자 정의 비용 함수

[A* 탐색][A* search]은 최적의 액션 시퀀스를 찾을 때 비용(cost)을 요소로 사용하므로, 플래너를 안내하기 위해 액션과 목표에 대한 사용자 정의 비용 함수를 정의할 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.agents.planner.AIAgentPlannerStrategy
    data class MyState(
        val topic: String,
        val operationDone: Boolean = true,
        val hasOptimization: Boolean = true
    ): GoapAgentState<String, String>(topic) {
        override fun provideOutput(): String = ""
    }
    val planner = AIAgentPlannerStrategy.goap("content-planner", ::MyState) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    action(
        name = "Expensive operation",
        precondition = { true },
        belief = { state -> state.copy(operationDone = true) },
        cost = { state ->
            // 상태에 따른 동적 비용
            if (state.hasOptimization) 1.0 else 10.0
        }
    ) { ctx, state ->
        // 액션 실행
        state.copy(operationDone = true)
    }
    ```
    <!--- KNIT example-goap-agents-02.kt -->

=== "Java"
    
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.planner.AIAgentPlannerStrategy;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleGoapAgents02 {
        public static class MyState extends GoapAgentState<String, String> {
            public String topic;
            public boolean operationDone = false;
            public boolean hasOptimization = true;
            public MyState(String topic) {
                super(topic);
                this.topic = topic;
            }
            public MyState copy(boolean operationDone) {
                MyState state = new MyState(topic);
                state.operationDone = operationDone;
                state.hasOptimization = this.hasOptimization;
                return state;
            }
            @Override
            public String provideOutput() {
                return "";
            }
        }
        public static void main(String[] args) {
            var planner = AIAgentPlannerStrategy.builder("content-planner")
                .goap(MyState::new)
    -->
    <!--- SUFFIX
            .build();
        }
    }
    -->
    ```java
    .action("Expensive operation", builder -> builder
        .precondition(state -> true)
        .belief(state -> state.copy(true))
        .cost(state -> {
            // 상태에 따른 동적 비용
            return state.hasOptimization ? 1.0 : 10.0;
        })
        .execute((context, state) -> {
            // 액션 실행
            return state.copy(true);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava02.java -->

## 실제 실행과 상태 믿음의 비교

GOAP는 믿음(낙관적 예측)과 실제 실행의 개념을 구분합니다:

- **믿음 (Belief)**: 설계를 위해 사용되며, 플래너가 발생할 것이라고 생각하는 결과입니다.
- **실행 (Execution)**: 실제 상태 업데이트를 위해 사용되며, 실제로 발생하는 결과입니다.

이를 통해 플래너는 실제 결과를 적절히 처리하면서도 예상되는 결과를 바탕으로 계획을 세울 수 있습니다:

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.agents.planner.AIAgentPlannerStrategy
    data class MyState(
        val topic: String,
        val taskComplete: Boolean = true,
        val attempts: Int = 0
    ): GoapAgentState<String, String>(topic) {
        override fun provideOutput(): String = ""
    }
    fun performComplexTask(): Boolean = true
    val planner = AIAgentPlannerStrategy.goap("content-planner", ::MyState) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    action(
        name = "Attempt complex task",
        precondition = { state -> !state.taskComplete },
        belief = { state ->
            // 낙관적 믿음: 태스크가 성공할 것임
            state.copy(taskComplete = true)
        },
        cost = { 5.0 }
    ) { ctx, state ->
        // 실제 실행은 실패하거나 다른 결과를 가질 수 있음
        val success = performComplexTask()
        state.copy(
            taskComplete = success,
            attempts = state.attempts + 1
        )
    }
    ```
    <!--- KNIT example-goap-agents-03.kt -->

=== "Java"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.planner.AIAgentPlannerStrategy;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleGoapAgents03 {
        public static class MyState extends GoapAgentState<String, String> {
            public String topic;
            public boolean taskComplete = false;
            public int attempts = 0;
            public MyState(String topic) {
                super(topic);
                this.topic = topic;
            }
            public MyState copy(boolean taskComplete, int attempts) {
                MyState state = new MyState(topic);
                state.taskComplete = taskComplete;
                state.attempts = attempts;
                return state;
            }
            @Override
            public String provideOutput() {
                return "";
            }
        }
        static boolean performComplexTask() {
            return true;
        }
        public static void main(String[] args) {
            var planner = AIAgentPlannerStrategy.builder("content-planner")
                .goap(MyState::new)
    -->
    <!--- SUFFIX
            .build();
        }
    }
    -->
    ```java
    .action("Attempt complex task", builder -> builder
        .precondition(state -> !state.taskComplete)
        .belief(state -> {
            // 낙관적 믿음: 태스크가 성공할 것임
            return state.copy(true, state.attempts);
        })
        .cost(state -> 5.0)
        .execute((context, state) -> {
            // 실제 실행은 실패하거나 다른 결과를 가질 수 있음
            boolean success = performComplexTask();
            return state.copy(success, state.attempts + 1);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava03.java -->

[A* search]: https://en.wikipedia.org/wiki/A*_search_algorithm