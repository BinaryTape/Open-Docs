# GOAP 智能体

GOAP 是一种算法规划方法，它使用 [A* 搜索] 寻找在满足目标条件的同时使总代价最小的最优操作序列。
与使用 LLM 生成方案的 [基于 LLM 的规划器](llm-based-planners.md) 不同，GOAP 智能体根据预定义的目标和操作，通过算法发现操作序列。

GOAP 规划器围绕三个核心概念工作：

- **状态 (State)**：代表世界的当前状态。
- **操作 (Actions)**：定义可以执行的任务，包括前置条件、效果（信念）、代价和执行逻辑。
- **目标 (Goals)**：定义目标条件、启发式代价和价值函数。

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    本页面中的示例假设您已设置 `OPENAI_API_KEY` 环境变量。

在 Koog 中，您可以使用 DSL 通过声明式地指定目标和操作来定义 GOAP 智能体。

要创建一个 GOAP 智能体，您需要：

1. 将状态定义为一个数据类，其属性代表特定于目标的各个方面。
2. 使用 [goap()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/goap.html) 函数创建一个 [GOAPPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner/index.html) 实例。
    1. 使用 [action()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/action.html) 函数定义带有前置条件和信念的操作。
    2. 使用 [goal()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/goal.html) 函数定义带有完成条件的目标。
3. 使用 [AIAgentPlannerStrategy](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-strategy/index.html) 包装规划器，并将其传递给 [PlannerAIAgent](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-planner-a-i-agent/index.html) 构造函数。

!!! note

    规划器选择单个操作及其序列。
    每个操作都包含一个必须为真才能执行的前置条件，以及一个定义预测结果的信念。
    有关信念的更多信息，请参阅[状态信念与实际执行的比较](#state-beliefs-compared-to-actual-execution)。

在以下示例中，GOAP 处理创建文章的高级规划（大纲 → 草稿 → 审核 → 发布），而 LLM 在每个操作中执行实际的内容生成。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.agents.planner.goap
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.message.MessagePart
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // 为内容创作定义一个状态
    data class ContentState(
        val topic: String,
        val hasOutline: Boolean = false,
        val outline: String = "",
        val hasDraft: Boolean = false,
        val draft: String = "",
        val hasReview: Boolean = false,
        val isPublished: Boolean = false
    ): GoapAgentState<String, String>() {
        override val agentInput = topic
        override fun provideOutput(): String = draft
    }

    // 创建带有 LLM 驱动操作的 GOAP 规划器
    val planner = goap("content-planner", ::ContentState) {
        // 定义带有前置条件和信念的操作
        action(
            name = "Create outline",
            precondition = { state -> !state.hasOutline },
            belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
            cost = { 1.0 }
        ) { ctx, state ->
            // 使用 LLM 创建大纲
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("Create a detailed outline for an article about: ${state.topic}")
                }
                requestLLM()
            }
            state.copy(hasOutline = true, outline = response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text })
        }

        action(
            name = "Write draft",
            precondition = { state -> state.hasOutline && !state.hasDraft },
            belief = { state -> state.copy(hasDraft = true, draft = "Draft") },
            cost = { 2.0 }
        ) { ctx, state ->
            // 使用 LLM 撰写草稿
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("Write an article based on this outline:
${state.outline}")
                }
                requestLLM()
            }
            state.copy(hasDraft = true, draft = response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text })
        }

        action(
            name = "Review content",
            precondition = { state -> state.hasDraft && !state.hasReview },
            belief = { state -> state.copy(hasReview = true) },
            cost = { 1.0 }
        ) { ctx, state ->
            // 使用 LLM 审核草稿
            val response = ctx.llm.writeSession {
                appendPrompt {
                    user("Review this article and suggest improvements:
${state.draft}")
                }
                requestLLM()
            }
            println("Review feedback: ${response.parts.filterIsInstance<MessagePart.Text>().joinToString("
") { it.text }}")
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

        // 定义带有完成条件的目标
        goal(
            name = "Published article",
            description = "Complete and publish the article",
            condition = { state -> state.isPublished }
        )
    }

    // 创建并运行智能体
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
    import ai.koog.agents.planner.Planners;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    import ai.koog.prompt.message.MessagePart;
    import java.util.stream.Collectors;
    class exampleGoapAgents01 {
    -->
    <!--- SUFFIX
    }
    -->
    ```java
    // 为内容创作定义一个状态
    static class ContentState extends GoapAgentState<String, String> {
        public String topic;
        public boolean hasOutline = false;
        public String outline = "";
        public boolean hasDraft = false;
        public String draft = "";
        public boolean hasReview = false;
        public boolean isPublished = false;
    
        public ContentState(String topic) {
            this.topic = topic;
        }

        @Override
        public String getAgentInput() {
            return topic;
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

        var strategy = Planners.goap("content-planner", ContentState::new)
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
                        return session.requestLLM().getParts().stream()
                            .filter(p -> p instanceof MessagePart.Text)
                            .map(p -> ((MessagePart.Text) p).getText())
                            .collect(Collectors.joining());
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
                        return session.requestLLM().getParts().stream()
                            .filter(p -> p instanceof MessagePart.Text)
                            .map(p -> ((MessagePart.Text) p).getText())
                            .collect(Collectors.joining());
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
                        return session.requestLLM().getParts().stream()
                            .filter(p -> p instanceof MessagePart.Text)
                            .map(p -> ((MessagePart.Text) p).getText())
                            .collect(Collectors.joining());
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
    

## 自定义代价函数

由于 [A* 搜索] 使用代价作为寻找最优操作序列的一个因素，您可以为操作和目标定义自定义代价函数来引导规划器：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.agents.planner.goap
    data class MyState(
        val topic: String,
        val operationDone: Boolean = true,
        val hasOptimization: Boolean = true
    ): GoapAgentState<String, String>() {
        override val agentInput = topic
        override fun provideOutput(): String = ""
    }
    val planner = goap("content-planner", ::MyState) {
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
            // 基于状态的动态代价
            if (state.hasOptimization) 1.0 else 10.0
        }
    ) { ctx, state ->
        // 执行操作
        state.copy(operationDone = true)
    }
    ```
    <!--- KNIT example-goap-agents-02.kt -->

=== "Java"
    
    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent;
    import ai.koog.agents.planner.Planners;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleGoapAgents02 {
        public static class MyState extends GoapAgentState<String, String> {
            public String topic;
            public boolean operationDone = false;
            public boolean hasOptimization = true;
            public MyState(String topic) {
                this.topic = topic;
            }
            @Override
            public String getAgentInput() {
                return topic;
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
            var planner = Planners.goap("content-planner", MyState::new)
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
            // 基于状态的动态代价
            return state.hasOptimization ? 1.0 : 10.0;
        })
        .execute((context, state) -> {
            // 执行操作
            return state.copy(true);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava02.java -->

## 状态信念与实际执行的比较

GOAP 区分了信念（乐观预测）和实际执行的概念：

- **信念 (Belief)**：规划器认为会发生什么，用于规划。
- **执行 (Execution)**：实际发生了什么，用于真实的状态更新。

这使得规划器能够根据预期结果制定计划，同时妥善处理实际结果：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.planner.goap.GoapAgentState
    import ai.koog.agents.planner.goap
    data class MyState(
        val topic: String,
        val taskComplete: Boolean = true,
        val attempts: Int = 0
    ): GoapAgentState<String, String>() {
        override val agentInput = topic
        override fun provideOutput(): String = ""
    }
    fun performComplexTask(): Boolean = true
    val planner = goap("content-planner", ::MyState) {
    -->
    <!--- SUFFIX
    }
    -->
    ```kotlin
    action(
        name = "Attempt complex task",
        precondition = { state -> !state.taskComplete },
        belief = { state ->
            // 乐观信念：任务将会成功
            state.copy(taskComplete = true)
        },
        cost = { 5.0 }
    ) { ctx, state ->
        // 实际执行可能会失败或产生不同的结果
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
    import ai.koog.agents.planner.Planners;
    import ai.koog.agents.planner.goap.GoapAgentState;
    import ai.koog.prompt.executor.clients.openai.OpenAIModels;
    import ai.koog.prompt.executor.model.PromptExecutor;
    class exampleGoapAgents03 {
        public static class MyState extends GoapAgentState<String, String> {
            public String topic;
            public boolean taskComplete = false;
            public int attempts = 0;
            public MyState(String topic) {
                this.topic = topic;
            }
            @Override
            public String getAgentInput() {
                return topic;
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
            var planner = Planners.goap("content-planner", MyState::new)
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
            // 乐观信念：任务将会成功
            return state.copy(true, state.attempts);
        })
        .cost(state -> 5.0)
        .execute((context, state) -> {
            // 实际执行可能会失败或产生不同的结果
            boolean success = performComplexTask();
            return state.copy(success, state.attempts + 1);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava03.java -->

[A* 搜索]: https://en.wikipedia.org/wiki/A*_search_algorithm