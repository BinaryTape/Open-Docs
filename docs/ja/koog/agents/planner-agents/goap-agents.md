# GOAPエージェント

GOAPは、総コストを最小限に抑えつつゴール条件を満たす最適なアクションシーケンスを見つけるために[A*サーチ]を使用する、アルゴリズムによるプランニング手法です。
LLMを使用してプランを生成する[LLMベースのプランナー](llm-based-planners.md)とは異なり、
GOAPエージェントは、事前定義されたゴールとアクションに基づいて、アルゴリズム的にアクションシーケンスを発見します。

GOAPプランナーは、主に3つの概念に基づいて動作します：

- **状態 (State)**: 世界の現在の状態を表します。
- **アクション (Actions)**: 前提条件、効果（Beliefs）、コスト、および実行ロジックを含み、実行可能な内容を定義します。
- **ゴール (Goals)**: 目標条件、ヒューリスティックコスト、および評価関数を定義します。

??? note "前提条件"

    --8<-- "quickstart-snippets.md:prerequisites"

    --8<-- "quickstart-snippets.md:dependencies"

    --8<-- "quickstart-snippets.md:api-key"

    このページ内の例は、`OPENAI_API_KEY`環境変数が設定されていることを前提としています。

Koogでは、ゴールとアクションを宣言的に指定するDSLを使用して、GOAPエージェントを定義します。

GOAPエージェントを作成するには、以下の手順が必要です：

1. ゴールに特有の様々な側面を表すプロパティを持つデータクラスとして、状態（State）を定義します。
2. [goap()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/goap.html) 関数を使用して、[GOAPPlanner](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner/index.html) インスタンスを作成します。
    1. [action()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/action.html) 関数を使用して、前提条件（Preconditions）とBeliefsを持つアクションを定義します。
    2. [goal()](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner.goap/-g-o-a-p-planner-builder/goal.html) 関数を使用して、完了条件を持つゴールを定義します。
3. プランナーを [AIAgentPlannerStrategy](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-a-i-agent-planner-strategy/index.html) でラップし、それを [PlannerAIAgent](https://api.koog.ai/agents/agents-planner/ai.koog.agents.planner/-planner-a-i-agent/index.html) コンストラクタに渡します。

!!! note

    プランナーは、個々のアクションとそのシーケンスを選択します。
    各アクションには、アクションが実行されるために満たされている必要がある前提条件と、予測される結果を定義するBeliefが含まれます。
    Beliefの詳細については、[実際の実行と比較した状態のBelief](#state-beliefs-compared-to-actual-execution)を参照してください。

次の例では、GOAPが記事作成（アウトライン → 草稿 → レビュー → 公開）の高レベルなプランニングを処理し、LLMが各アクション内での実際のコンテンツ生成を実行します。

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
    // コンテンツ作成の状態を定義
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

    // LLM駆動のアクションを持つGOAPプランナーを作成
    val planner = goap("content-planner", ::ContentState) {
        // 前提条件とBeliefsを持つアクションを定義
        action(
            name = "Create outline",
            precondition = { state -> !state.hasOutline },
            belief = { state -> state.copy(hasOutline = true, outline = "Outline") },
            cost = { 1.0 }
        ) { ctx, state ->
            // LLMを使用してアウトラインを作成
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
            // LLMを使用して草稿を作成
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
            // LLMを使用して草稿をレビュー
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

        // 完了条件を持つゴールを定義
        goal(
            name = "Published article",
            description = "Complete and publish the article",
            condition = { state -> state.isPublished }
        )
    }

    // エージェントを作成して実行
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
    // コンテンツ作成の状態を定義
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
    

## カスタムコスト関数

[A*サーチ]は最適なアクションシーケンスを見つけるための要素としてコストを使用するため、アクションやゴールに対してカスタムコスト関数を定義してプランナーをガイドすることができます。

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
            // 状態に基づいた動的コスト
            if (state.hasOptimization) 1.0 else 10.0
        }
    ) { ctx, state ->
        // アクションを実行
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
            // 状態に基づいた動的コスト
            return state.hasOptimization ? 1.0 : 10.0;
        })
        .execute((context, state) -> {
            // アクションを実行
            return state.copy(true);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava02.java -->

## 実際の実行と比較した状態のBelief

GOAPは、Belief（楽観的な予測）と実際の実行の概念を区別します。

- **Belief (ビリーフ)**: プランナーが起こると予測していること。プランニングに使用されます。
- **実行 (Execution)**: 実際に起こること。実際の状態更新に使用されます。

これにより、プランナーは実際の結果を適切に処理しながら、期待される成果に基づいてプランを作成できます。

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
            // 楽観的なBelief：タスクは成功する
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
            // 楽観的なBelief：タスクは成功する
            return state.copy(true, state.attempts);
        })
        .cost(state -> 5.0)
        .execute((context, state) -> {
            // 実際の実行は失敗したり、異なる結果になったりする可能性がある
            boolean success = performComplexTask();
            return state.copy(success, state.attempts + 1);
        })
    )
    ```
    <!--- KNIT exampleGoapAgentsJava03.java -->

[A*サーチ]: https://ja.wikipedia.org/wiki/A*サーチアルゴリズム