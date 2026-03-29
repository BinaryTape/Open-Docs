# 總覽

Agent 使用工具來執行特定任務或存取外部系統。

## 工具工作流程

Koog 架構為在 Kotlin 與 Java 中使用工具提供了以下工作流程：

1. 建立自訂工具或使用內建工具。
2. 將工具新增至工具註冊表。
3. 將工具註冊表傳遞給 Agent。
4. 在 Agent 中使用該工具。

### 可用的工具型別

Koog 架構中共有三種型別的工具：

- 內建工具：提供 Agent 與使用者互動及對話管理的功能。詳情請參閱[內建工具](built-in-tools.md)。
- 基於註解的自訂工具：讓您能將函式作為工具公開給 LLM。詳情請參閱[基於註解的工具](annotation-based-tools.md)。
- 自訂工具：讓您控制工具參數、元資料、執行邏輯，以及其註冊與調用方式。詳情請參閱[基於類別的工具](class-based-tools.md)。

### 工具註冊表

在 Agent 中使用工具之前，必須先將其新增至工具註冊表。工具註冊表負責管理 Agent 可使用的所有工具。

工具註冊表的主要特性：

- 組織工具。
- 支援合併多個工具註冊表。
- 提供按名稱或型別檢索工具的方法。

若要了解更多，請參閱 [ToolRegistry](api:agents-tools::ai.koog.agents.core.tools.ToolRegistry)。

以下是如何建立工具註冊表並將工具新增至其中的範例：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    class MyToolSet : ToolSet {
        @Tool
        fun myTool(): String {
            // 工具實作
            return "Result"
        }
    }
    val myTool = MyToolSet()
    -->
    ```kotlin
    val toolRegistry = ToolRegistry {
        tools(myTool)
    }
    ```
    <!--- KNIT example-tools-overview-01.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 建立您的 ToolSet 執行個體
    MyToolSet myTool = new MyToolSet();

    // 組建 ToolRegistry 並從 ToolSet 註冊工具
    ToolRegistry toolRegistry = ToolRegistry.builder()
        .tools(myTool)
        .build();
    ```
    <!--- KNIT example-tools-overview-java-01.java -->

若要合併多個工具註冊表，請執行以下操作：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    class FirstToolSet : ToolSet {
        @Tool
        fun firstSampleTool(): String {
            // 工具實作
            return "First result"
        }
    }
    class SecondToolSet : ToolSet {
        @Tool
        fun secondSampleTool(): String {
            // 工具實作
            return "Second result"
        }
    }
    val firstSampleTool = FirstToolSet()
    val secondSampleTool = SecondToolSet()
    -->
    ```kotlin
    val firstToolRegistry = ToolRegistry {
        tools(firstSampleTool)
    }
    
    val secondToolRegistry = ToolRegistry {
        tools(secondSampleTool)
    }
    
    val newRegistry = firstToolRegistry + secondToolRegistry
    ```
    <!--- KNIT example-tools-overview-02.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    // 建立您的 ToolSet 執行個體
    FirstToolSet firstSampleTool = new FirstToolSet();
    SecondToolSet secondSampleTool = new SecondToolSet();

    // 建立獨立的工具註冊表
    ToolRegistry firstToolRegistry = ToolRegistry.builder()
        .tools(firstSampleTool)
        .build();

    ToolRegistry secondToolRegistry = ToolRegistry.builder()
        .tools(secondSampleTool)
        .build();

    ToolRegistry newRegistry = firstToolRegistry.plus(secondToolRegistry);
    ```
    <!--- KNIT example-tools-overview-java-02.java -->

### 將工具傳遞給 Agent

為了讓 Agent 能夠使用工具，您需要在建立 Agent 時，將包含該工具的工具註冊表作為引數傳遞：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // Agent 初始化
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant with strong mathematical skills.",
        llmModel = OpenAIModels.Chat.GPT4o,
        // 將您的工具註冊表傳遞給 Agent
        toolRegistry = toolRegistry
    )
    ```
    <!--- KNIT example-tools-overview-03.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    AIAgent<String, String> agent = AIAgent.builder()
        .promptExecutor(simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")))
        .systemPrompt("You are a helpful assistant with strong mathematical skills.")
        .llmModel(OpenAIModels.Chat.GPT4o)
        .toolRegistry(ToolRegistry.builder()
            .tools(secondSampleTool)
            .build()
        )
        .build();
    ```
    <!--- KNIT example-tools-overview-java-03.java -->

### 調用工具

在 Agent 程式碼中，有幾種調用工具的方式。建議的方法是使用 Agent 上下文中提供的方法，而不是直接調用工具，因為這能確保在 Agent 環境中正確處理工具運作。

!!! tip
    確保您已在工具中實作適當的[錯誤處理](features/agent-event-handlers.md)，以防止 Agent 失敗。

工具會在由 `AIAgentLLMWriteSession` 表示的特定工作階段上下文中被調用。它提供了幾種調用工具的方法，以便您可以：

- 使用指定引數調用工具。
- 按名稱與指定引數調用工具。
- 透過提供的工具類別與引數調用工具。
- 使用指定引數調用指定型別的工具。
- 調用傳回原始字串結果的工具。

如需更多詳情，請參閱 [AIAgentLLMWriteSession 的 API 參考資料](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession)。

#### 並行工具調用

您還可以使用 `toParallelToolCallsRaw` 擴充功能來並行調用工具。例如：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.dsl.builder.strategy
    import ai.koog.agents.core.dsl.builder.node
    import ai.koog.agents.core.tools.SimpleTool
    import kotlinx.coroutines.flow.collect
    import kotlinx.coroutines.flow.flow
    import ai.koog.serialization.typeToken
    import kotlinx.serialization.Serializable
    -->
    ```kotlin
    @Serializable
    data class Book(
        val title: String,
        val author: String,
        val description: String
    )
    
    class BookTool() : SimpleTool<Book>(
        argsType = typeToken<Book>(),
        name = NAME,
        description = "A tool to parse book information from Markdown"
    ) {
        companion object {
            const val NAME = "book"
        }
    
        override suspend fun execute(args: Book): String {
            println("${args.title} by ${args.author}:
 ${args.description}")
            return "Done"
        }
    }
    
    val strategy = strategy<Unit, Unit>("strategy-name") {
    
        /*...*/
    
        val myNode by node<Unit, Unit> { _ ->
            llm.writeSession {
                flow {
                    emit(Book("Book 1", "Author 1", "Description 1"))
                }.toParallelToolCallsRaw(BookTool::class).collect()
            }
        }
    }
    
    ```
    <!--- KNIT example-tools-overview-04.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-04.java -->

#### 從節點調用工具

在使用節點建置 Agent 工作流程時，您可以使用特殊節點來調用工具：

* **nodeExecuteTool**：調用單一工具並傳回其結果。詳情請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool)。

* **nodeExecuteSingleTool**：使用提供的引數調用特定工具。詳情請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool)。

* **nodeExecuteMultipleTools**：執行多個工具調用並傳回其結果。詳情請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools)。

* **nodeLLMSendToolResult**：將工具結果發送給 LLM 並獲取回應。詳情請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult)。

* **nodeLLMSendMultipleToolResults**：將多個工具結果發送給 LLM。詳情請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults)。

## 將 Agent 作為工具使用

該架構提供了將任何 AI Agent 轉換為可供其他 Agent 使用之工具的能力。這項強大的功能讓您可以建立階層式的 Agent 架構，讓專門的 Agent 能被更高級別的協調 Agent 作為工具調用。

### 將 Agent 轉換為工具

要將 Agent 轉換為工具，請使用 `AIAgentService` 和 `createAgentTool()` 擴充函式：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.agent.AIAgentService
    import ai.koog.agents.core.agent.createAgentTool
    import ai.koog.agents.core.tools.ToolParameterDescriptor
    import ai.koog.agents.core.tools.ToolParameterType
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    import ai.koog.serialization.typeToken
    const val apiKey = ""
    val analysisToolRegistry = ToolRegistry {}
    -->
    ```kotlin
    // 建立一個專門的 Agent 服務，負責建立財務分析 Agent。
    val analysisAgentService = AIAgentService(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a financial analysis specialist.",
        toolRegistry = analysisToolRegistry
    )
    
    // 建立一個工具，調用時將執行財務分析 Agent。
    val analysisAgentTool = analysisAgentService.createAgentTool(
        agentName = "analyzeTransactions",
        agentDescription = "Performs financial transaction analysis",
        inputDescription = "Transaction analysis request",
        inputType = typeToken<String>(),
    )
    ```
    <!--- KNIT example-tools-overview-05.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-05.java -->

### 在其他 Agent 中使用 Agent 工具

轉換為工具後，您可以將該 Agent 工具新增至另一個 Agent 的工具註冊表中：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    const val apiKey = ""
    -->
    ```kotlin
    // 建立一個協調 Agent，可以使用專門的 Agent 作為工具
    val coordinatorAgent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You coordinate different specialized services.",
        toolRegistry = ToolRegistry {
            tool(analysisAgentTool)
            // 根據需要新增其他工具
        }
    )
    ```
    <!--- KNIT example-tools-overview-06.kt -->

=== "Java"

    <!--- INCLUDE
    /**
    -->
    <!--- SUFFIX
    **/
    -->
    ```java
    ```
    <!--- KNIT example-tools-overview-java-06.java -->

### Agent 工具執行

當 Agent 工具被調用時：

1. 引數會根據輸入描述符進行反序列化。
2. 封裝的 Agent 會使用反序列化的輸入來執行。
3. Agent 的輸出會被序列化並作為工具結果傳回。

### 將 Agent 作為工具的優點

- **模組化**：將複雜的工作流程分解為專門的 Agent。
- **可重複使用性**：在多個協調 Agent 之間使用相同的專門 Agent。
- **關注點分離**：每個 Agent 都可以專注於其特定的領域。