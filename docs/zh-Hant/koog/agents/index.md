# Agent

AI Agent 是能夠進行推理、做出決策、與環境互動並採取行動以達成特定目標的自主系統。
在 Koog 中，AI Agent 不僅僅是 LLM 的包裝函式 (wrapper)；
它是一個為 JVM 生態系統設計的結構化、型別安全 (type-safe) 的狀態機。

Koog Agent 是圍繞以下核心概念建構的：

- [Prompt 執行器](../prompts/prompt-executors.md) 管理並執行 Prompt，
  使 Agent 能夠與 LLM 互動以進行推理和決策。
- [策略 (strategy)](../nodes-and-components.md) 定義了 Agent 的工作流程。
  它可以是有向圖、函式或規劃器 (planner) 的形式。
  請參閱 [Agent 類型](#agent-types)。
- Agent 可以使用 [工具 (tools)](../tools/index.md) 與外部資料源和服務互動。
- 您可以使用 [功能 (features)](../features/index.md) 來擴展和增強 AI Agent 的功能性。

!!! tip

    有關建立與執行最簡 Agent 的資訊，請參閱 [快速入門](../quickstart.md)。

## Agent 類型

根據您需要執行的任務，Koog 提供了多種 Agent 類型：

- [基礎 Agent (Basic agents)](basic-agents.md) 非常適合不需要任何自訂邏輯的簡單任務。
  這些 Agent 實作了適用於大多數常見使用案例的預定義策略。
- [基於圖的 Agent (Graph-based agents)](graph-based-agents.md) 提供對 Agent 工作流程、狀態管理和視覺化的完全控制與靈活性。
- [函數式 Agent (Functional agents)](functional-agents.md) 讓您能快速將自訂邏輯原型化為一個可存取 Agent 上下文的函式。
- [規劃器 Agent (Planner agents)](planner-agents/index.md) 可以透過疊代週期自主規劃並執行多步驟任務，直到達到所需的最終狀態。

## Agent 配置

Agent 配置 (configuration) 定義了 Agent 的執行參數，
包括初始 Prompt、語言模型和疊代限制。

!!! tip

    有關建立與執行最簡 Agent 的資訊，請參閱 [快速入門](../quickstart.md)。

對於簡單的 Agent，除了必要的 Prompt 執行器和語言模型外，
您可以直接在 Agent 建構函式中指定初始系統 Prompt 和其他一些參數：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a helpful assistant.",
        temperature = 0.7,
        maxIterations = 10
    )
    ```
    <!--- KNIT example-agent-config-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")))
        .llmModel(OpenAIModels.Chat.GPT4o)
        .systemPrompt("You are a helpful assistant.")
        .temperature(0.7)
        .maxIterations(10)
        .build();
    ```
    <!--- KNIT example-agent-config-java-01.java -->

或者，您可以建立 [`AIAgentConfig`](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.config/-a-i-agent-config/index.html) 的執行個體，
以更細粒度地定義 Agent 的行為和參數，然後將其傳遞給 Agent 建構函式。
這使您能夠定義包含多條訊息、對話歷史記錄、LLM 參數以及額外執行參數的複雜 Prompt。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.config.AIAgentConfig
    import ai.koog.prompt.dsl.prompt
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.prompt.params.LLMParams
    -->
    ```kotlin
    val agentConfig = AIAgentConfig(
        prompt = prompt(
            id = "assistant",
            params = LLMParams(
                temperature = 0.7
            )
        ) {
            system("You are a helpful assistant.")
        },
        model = OpenAIModels.Chat.GPT4o,
        maxAgentIterations = 10
    )

    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        agentConfig = agentConfig
    )
    ```
    <!--- KNIT example-agent-config-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    Prompt prompt = Prompt.builder("assistant")
        .system("You are a helpful assistant.")
        .build()
        .withParams(new LLMParams(
            0.7,         // temperature
            null,        // maxTokens
            1,           // numberOfChoices
            null,        // speculation
            null,        // schema
            LLMParams.ToolChoice.Auto.INSTANCE, // toolChoice
            null,        // user
            null         // additionalProperties
        ));

    AIAgentConfig agentConfig = AIAgentConfig.builder(OpenAIModels.Chat.GPT4o)
        .prompt(prompt)
        .maxAgentIterations(10)
        .build();

    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .agentConfig(agentConfig)
        .build();
    ```
    <!--- KNIT example-agent-config-java-02.java -->

以下是 `AIAgentConfig` 的參數：

- `prompt` 定義初始 [Prompt](../prompts/prompt-creation/index.md) 和 [LLM 參數](../llm-parameters.md)。

- `model` 指定 Agent 與之互動的語言模型。
  您可以使用預定義模型之一，或 [建立自訂模型配置](../model-capabilities.md#creating-a-model-llmodel-configuration)。

- `maxAgentIterations` 限制 Agent 在終止前可以執行的最大步數。
  每一步都是 Agent 工作流程中的一個 [節點 (node)](../nodes-and-components.md)。

- `missingToolsConversionStrategy` 定義 Agent 執行期間處理缺失工具的策略。

[//]: # (TODO 在工具章節中編寫關於缺失工具的內容，並從此處連結)

- `responseProcessor` 可用於定義自訂回應處理器。
  例如，它可以審核並驗證回應內容、更改回應格式或記錄回應。

[//]: # (TODO 在某處編寫關於回應處理的內容？)