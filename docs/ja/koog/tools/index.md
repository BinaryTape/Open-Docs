# 概要

エージェントは、特定のタスクの実行や外部システムへのアクセスにツールを使用します。

## ツールのワークフロー

Koog フレームワークは、Kotlin および Java でツールを操作するための以下のワークフローを提供しています。

1. カスタムツールを作成するか、ビルトインツールのいずれかを使用します。
2. ツールをツールレジストリに追加します。
3. ツールレジストリをエージェントに渡します。
4. エージェントでツールを使用します。

### 利用可能なツールのタイプ

Koog フレームワークには 3 つのタイプのツールがあります。

- エージェントとユーザーのやり取りや対話管理の機能を提供するビルトインツール。詳細は[ビルトインツール](built-in-tools.md)を参照してください。
- 関数をツールとして LLM に公開できるアノテーションベースのカスタムツール。詳細は[アノテーションベースのツール](annotation-based-tools.md)を参照してください。
- ツールのパラメータ、メタデータ、実行ロジック、および登録と呼び出し方法を制御できるカスタムツール。詳細は[クラスベースのツール](class-based-tools.md)を参照してください。

### ツールレジストリ

エージェントでツールを使用するには、まずそのツールをツールレジストリに追加する必要があります。
ツールレジストリは、エージェントが利用可能なすべてのツールを管理します。

ツールレジストリの主な機能：

- ツールの整理。
- 複数のツールレジストリの統合のサポート。
- 名前またはタイプでツールを取得するメソッドの提供。

詳細は [ToolRegistry](api:agents-tools::ai.koog.agents.core.tools.ToolRegistry) を参照してください。

以下は、ツールレジストリを作成してツールを追加する方法の例です。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    class MyToolSet : ToolSet {
        @Tool
        fun myTool(): String {
            // Tool implementation
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
    // Create an instance of your ToolSet
    MyToolSet myTool = new MyToolSet();

    // Build the ToolRegistry and register tools from the ToolSet
    ToolRegistry toolRegistry = ToolRegistry.builder()
        .tools(myTool)
        .build();
    ```
    <!--- KNIT example-tools-overview-java-01.java -->

複数のツールレジストリを統合するには、次のように行います。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    class FirstToolSet : ToolSet {
        @Tool
        fun firstSampleTool(): String {
            // Tool implementation
            return "First result"
        }
    }
    class SecondToolSet : ToolSet {
        @Tool
        fun secondSampleTool(): String {
            // Tool implementation
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
    // Create instances of your ToolSets
    FirstToolSet firstSampleTool = new FirstToolSet();
    SecondToolSet secondSampleTool = new SecondToolSet();

    // Build separate tool registries
    ToolRegistry firstToolRegistry = ToolRegistry.builder()
        .tools(firstSampleTool)
        .build();

    ToolRegistry secondToolRegistry = ToolRegistry.builder()
        .tools(secondSampleTool)
        .build();

    ToolRegistry newRegistry = firstToolRegistry.plus(secondToolRegistry);
    ```
    <!--- KNIT example-tools-overview-java-02.java -->

### エージェントへのツールの受け渡し

エージェントがツールを使用できるようにするには、エージェントの作成時に、そのツールを含むツールレジストリを引数として提供する必要があります。

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // Agent initialization
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant with strong mathematical skills.",
        llmModel = OpenAIModels.Chat.GPT4o,
        // Pass your tool registry to the agent
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

### ツールの呼び出し

エージェントのコード内でツールを呼び出す方法はいくつかあります。推奨されるアプローチは、ツールを直接呼び出すのではなく、エージェントコンテキストで提供されるメソッドを使用することです。これにより、エージェント環境内でのツール操作の適切な処理が保証されます。

!!! tip "ヒント"
    ツールの失敗によるエージェントの停止を防ぐために、ツール内に適切な[エラーハンドリング](../features/agent-event-handlers.md)を実装していることを確認してください。

ツールは、`AIAgentLLMWriteSession` で表される特定のセッションコンテキスト内で呼び出されます。
これにはツールを呼び出すためのいくつかのメソッドが用意されており、以下のことが可能です。

- 与えられた引数でツールを呼び出す。
- 名前と与えられた引数でツールを呼び出す。
- 提供されたツールクラスと引数でツールを呼び出す。
- 指定されたタイプのツールを与えられた引数で呼び出す。
- 生（raw）の文字列結果を返すツールを呼び出す。

詳細については、[AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) の API リファレンスを参照してください。

#### ツールの並列呼び出し

`toParallelToolCallsRaw` 拡張を使用して、ツールを並列に呼び出すこともできます。例：

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

#### ノードからのツールの呼び出し

ノードを使用してエージェントのワークフローを構築する場合、ツールを呼び出すための特別なノードを使用できます。

* **nodeExecuteTool**: 単一のツール呼び出しを実行し、その結果を返します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool) を参照してください。

* **nodeExecuteSingleTool**: 指定された引数で特定のツールを呼び出します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool) を参照してください。

* **nodeExecuteMultipleTools**: 複数のツール呼び出しを実行し、それらの結果を返します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools) を参照してください。

* **nodeLLMSendToolResult**: ツール実行結果を LLM に送信し、レスポンスを取得します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult) を参照してください。

* **nodeLLMSendMultipleToolResults**: 複数のツール実行結果を LLM に送信します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults) を参照してください。

## エージェントをツールとして使用する

このフレームワークは、あらゆる AI エージェントを他のエージェントが使用できるツールに変換する機能を提供します。
この強力な機能により、専門化されたエージェントを上位のオーケストレーションエージェントからツールとして呼び出すことができる、階層型エージェントアーキテクチャを作成できます。

### エージェントからツールへの変換

エージェントをツールに変換するには、`AIAgentService` と `createAgentTool()` 拡張関数を使用します。

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
    // Create a specialized agent service, responsible for creating financial analysis agents.
    val analysisAgentService = AIAgentService(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a financial analysis specialist.",
        toolRegistry = analysisToolRegistry
    )
    
    // Create a tool that would run financial analysis agent once called.
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

### 他のエージェントでエージェントツールを使用する

ツールに変換した後は、そのエージェントツールを別のエージェントのツールレジストリに追加できます。

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
    // Create a coordinator agent that can use specialized agents as tools
    val coordinatorAgent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You coordinate different specialized services.",
        toolRegistry = ToolRegistry {
            tool(analysisAgentTool)
            // Add other tools as needed
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

### エージェントツールの実行

エージェントツールが呼び出されると、以下の処理が行われます。

1. 引数が入力記述子（input descriptor）に従ってデシリアライズされます。
2. ラップされたエージェントが、デシリアライズされた入力を使用して実行されます。
3. エージェントの出力がシリアライズされ、ツールの結果として返されます。

### エージェントをツールとして使用する利点

- **モジュール性**: 複雑なワークフローを専門化されたエージェントに分割できます。
- **再利用性**: 同じ専門エージェントを複数のコーディネーターエージェントで利用できます。
- **関心の分離**: 各エージェントは特定のドメインに集中できます。