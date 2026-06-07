# 概覽

代理使用工具來執行特定任務或存取外部系統。

## 工具工作流

Koog 框架為在 Kotlin 和 Java 中使用工具提供了以下工作流：

1. 建立自訂工具或使用內建工具。
2. 將工具新增至工具註冊表。
3. 將工具註冊表傳遞給代理。
4. 在代理中使用該工具。

### 可用的工具類型

Koog 框架中有三種類型的工具：

- 提供代理與使用者互動以及對話管理功能的內建工具。詳情請參閱 [內建工具](built-in-tools.md)。
- 基於註解的自訂工具，讓您可以將函式作為工具公開給 LLM。詳情請參閱 [基於註解的工具](annotation-based-tools.md)。
- 自訂工具，讓您可以控制工具參數、元資料、執行邏輯，以及其註冊與叫用方式。詳情請參閱 [基於類別的工具](class-based-tools.md)。

### 工具註冊表

在代理中使用工具之前，必須先將其新增至工具註冊表。工具註冊表管理代理可用的所有工具。

工具註冊表的主要特性：

- 組織工具。
- 支援合併多個工具註冊表。
- 提供依名稱或型別擷取工具的方法。

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

    // 建置 ToolRegistry 並從 ToolSet 註冊工具
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

    // 建置個別的工具註冊表
    ToolRegistry firstToolRegistry = ToolRegistry.builder()
        .tools(firstSampleTool)
        .build();

    ToolRegistry secondToolRegistry = ToolRegistry.builder()
        .tools(secondSampleTool)
        .build();

    ToolRegistry newRegistry = firstToolRegistry.plus(secondToolRegistry);
    ```
    <!--- KNIT example-tools-overview-java-02.java -->

### 將工具傳遞給代理

為了讓代理能夠使用工具，您需要在建立代理時提供包含該工具的工具註冊表作為引數：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // 代理初始化
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant with strong mathematical skills.",
        llmModel = OpenAIModels.Chat.GPT4o,
        // 將您的工具註冊表傳遞給代理
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

### 叫用工具

在代理程式碼中有幾種叫用工具的方法。建議的方法是使用代理內容中提供的方法，而不是直接叫用工具，因為這可以確保代理環境中工具操作的正確處理。

!!! tip
    確保您已在工具中實作了正確的 [錯誤處理](../features/agent-event-handlers.md)，以防止代理失敗。

工具是在由 `AIAgentLLMWriteSession` 表示的特定工作階段內容中叫用的。它提供了幾種叫用工具的方法，讓您可以：

- 使用指定的引數叫用工具。
- 依名稱及指定的引數叫用工具。
- 依提供的工具類別及引數叫用工具。
- 使用指定的引數叫用指定型別的工具。
- 叫用傳回原始字串結果的工具。

如需更多詳細資訊，請參閱 [AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) 的 API 參考。

#### 並行工具叫用

您也可以使用 `toParallelToolCallsRaw` 擴充來並行叫用工具。例如：

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

#### 從節點叫用工具

在使用節點建置代理工作流時，您可以使用特殊的節點來叫用工具：

* **nodeExecuteTool**：叫用單次工具呼叫並傳回其結果。詳情請參閱 [API 參考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool)。

* **nodeExecuteSingleTool**：使用提供的引數叫用特定工具。詳情請參閱 [API 參考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool)。

* **nodeExecuteMultipleTools**：執行多次工具呼叫並傳回其結果。詳情請參閱 [API 參考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools)。

* **nodeLLMSendToolResult**：將工具結果傳送到 LLM 並獲取回應。詳情請參閱 [API 參考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult)。

* **nodeLLMSendMultipleToolResults**：將多個工具結果傳送到 LLM。詳情請參閱 [API 參考](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults)。

## 將代理用作工具

框架提供了將任何 AI 代理轉換為可供其他代理使用的工具的功能。這項強大的特性讓您可以建立階層式代理架構，其中專用的代理可以被高層級的編排代理作為工具叫用。

### 將代理轉換為工具

若要將代理轉換為工具，請使用 `AIAgentService` 和 `createAgentTool()` 擴充函式：

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
    // 建立專門的代理服務，負責建立財務分析代理。
    val analysisAgentService = AIAgentService(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a financial analysis specialist.",
        toolRegistry = analysisToolRegistry
    )
    
    // 建立一個在被叫用時會執行財務分析代理的工具。
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

### 在其他代理中使用代理工具

轉換為工具後，您可以將該代理工具新增至另一個代理的工具註冊表：

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
    // 建立一個可以使用專門代理作為工具的協調代理
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

### 代理工具執行

當代理工具被叫用時：

1. 引數會根據輸入描述符進行還原序列化。
2. 包裝好的代理會使用還原序列化後的輸入來執行。
3. 代理的輸出會被序列化並作為工具結果傳回。

### 將代理用作工具的優點

- **模組化**：將複雜的工作流拆分為專門的代理。
- **重用性**：在多個協調代理中使用同一個專門代理。
- **關注點分離**：每個代理都可以專注於其特定的領域。