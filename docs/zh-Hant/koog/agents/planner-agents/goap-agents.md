# GOAP agent

GOAP 是一種演算法規劃方法，使用 [A* 搜尋][A* search] 來尋找最佳操作序列，在滿足目標條件的同時將總成本降至最低。
與使用 LLM 產生計畫的 [基於 LLM 的規劃器](llm-based-planners.md) 不同，GOAP agent 透過演算法根據預定義的目標和操作來發現操作序列。

GOAP 規劃器涉及三個主要概念：

- **狀態**：代表世界的目前狀態。
- **操作**：定義可以執行的內容，包括前提條件、效果（信念）、成本和執行邏輯。
- **目標**：定義目標條件、啟發式成本和值函數。

??? note "先決條件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    本頁面中的範例假設您已設定 `OPENAI_API_KEY` 環境變數。

在 Koog 中，您可以使用 DSL 透過宣告式地指定目標和操作來定義 GOAP agent。

若要建立 GOAP agent，您需要：

1. 將狀態定義為一個 data class，其屬性代表特定於您目標的各個面向。
2. 使用 [goap()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/goap.html) 函式建立 [GOAPPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner/index.html) 執行個體。
    1. 使用 [action()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/action.html) 函式定義具有前提條件和信念的操作。
    2. 使用 [goal()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/goal.html) 函式定義具有完成條件的目標。
3. 使用 [AIAgentPlannerStrategy](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-strategy/index.html) 包裝規劃器，並將其傳遞給 [PlannerAIAgent](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-planner-a-i-agent/index.html) 建構函式。

!!! note

    規劃器選擇單個操作及其序列。
    每個操作都包含一個在執行操作前必須成立的前提條件，以及一個定義預測結果的信念。
    欲了解更多關於信念的資訊，請參閱[狀態信念與實際執行的比較](#state-beliefs-compared-to-actual-execution)。

在以下範例中，GOAP 處理建立文章的高階規劃（大綱 → 草稿 → 審查 → 發佈），而 LLM 則在每個操作中執行實際的內容產生。

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
    // 為內容創作定義狀態
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

    // 建立具有 LLM 驅動操作的 GOAP 規劃器
    val planner = AIAgentPlannerStrategy.goap("content-planner", ::ContentState) {
        // 定義具有前提條件和信念的操作
        action(
            name = "Create outline",
            precondition = { state -> !state.hasOutline },
            belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
            cost = { 1.0 }
        ) { ctx, state ->
            // 使用 LLM 建立大綱
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("為關於以下主題的文章建立詳細大綱：${state.topic}")
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
            // 使用 LLM 撰寫草稿
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("根據此大綱撰寫文章：
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
            // 使用 LLM 審查草稿
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("審查這篇文章並提出改進建議：
${state.draft}")
                }
                requestLLM()
            }
            println("審查回饋：${response.content}")
            state.copy(hasReview = true)
        }

        action(
            name = "Publish",
            precondition = { state -> state.hasReview && !state.isPublished },
            belief = { state -> state.copy(isPublished = true) },
            cost = { 1.0 }
        ) { ctx, state ->
            println("正在發佈文章...")
            state.copy(isPublished = true)
        }

        // 定義具有完成條件的目標
        goal(
            name = "Published article",
            description = "完成並發佈文章",
            condition = { state -> state.isPublished }
        )
    }

    // 建立並執行 agent
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
        println("最終狀態：$result")
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
    // 為內容創作定義狀態
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
                            prompt.user("為關於以下主題的文章建立詳細大綱：" + state.topic);
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
                            prompt.user("根據此大綱撰寫文章：
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
                            prompt.user("審查這篇文章並提出改進建議：
" + state.draft);
                            return null;
                        });
                        return session.requestLLM().getContent();
                    });
                    System.out.println("審查回饋：" + response);
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
                    System.out.println("正在發佈文章...");
                    return state.copy(state.hasOutline, state.outline, state.hasDraft,
                                    state.draft, state.hasReview, true);
                })
            )
            .goal("Published article", builder -> builder
                .description("完成並發佈文章")
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
        System.out.println("最終狀態：" + result);
    }
    ```
    <!--- KNIT exampleGoapAgentsJava01.java -->
    

## 自訂成本函式

由於 [A* 搜尋][A* search] 使用成本作為尋找最佳操作序列的一個因素，您可以為操作和目標定義自訂成本函式來引導規劃器：

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
            // 根據狀態動態計算成本
            if (state.hasOptimization) 1.0 else 10.0
        }
    ) { ctx, state ->
        // 執行操作
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
            // 根據狀態動態計算成本
            return state.hasOptimization ? 1.0 : 10.0;
        })
        .execute((context, state) -> {
            // 執行操作
            return state.copy(true);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava02.java -->

## 狀態信念與實際執行的比較

GOAP 區分了信念（樂觀預測）和實際執行的概念：

- **信念**：規劃器認為會發生的事情，用於規劃。
- **執行**：實際發生的事情，用於真實的狀態更新。

這允許規劃器根據預期結果制定計畫，同時妥善處理實際結果：

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
            // 樂觀信念：任務將成功
            state.copy(taskComplete = true)
        },
        cost = { 5.0 }
    ) { ctx, state ->
        // 實際執行可能會失敗或有不同的結果
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
            // 樂觀信念：任務將成功
            return state.copy(true, state.attempts);
        })
        .cost(state -> 5.0)
        .execute((context, state) -> {
            // 實際執行可能會失敗或有不同的結果
            boolean success = performComplexTask();
            return state.copy(success, state.attempts + 1);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava03.java -->

[A* search]: https://en.wikipedia.org/wiki/A*_search_algorithm