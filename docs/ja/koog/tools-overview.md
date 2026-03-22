# 概要

エージェントは、特定のタスクの実行や外部システムへのアクセスにツールを使用します。

## ツールのワークフロー

Koog フレームワークでは、Kotlin および Java でツールを操作するための以下のワークフローを提供しています：

1. カスタムツールを作成するか、組み込みツールのいずれかを使用します。
2. ツールをツールレジストリに追加します。
3. ツールレジストリをエージェントに渡します。
4. エージェントでツールを使用します。

### 利用可能なツールの種類

Koog フレームワークには 3 種類のツールがあります：

- エージェントとユーザーの対話および会話管理機能を提供する**組み込みツール**。詳細は [Built-in tools](built-in-tools.md) を参照してください。
- 関数をツールとして LLM に公開できる**アノテーションベースのカスタムツール**。詳細は [Annotation-based tools](annotation-based-tools.md) を参照してください。
- ツールのパラメータ、メタデータ、実行ロジック、および登録・呼び出し方法を制御できる**カスタムツール**。詳細は [Class-based tools](class-based-tools.md) を参照してください。

### ツールレジストリ

エージェントでツールを使用するには、まずそのツールをツールレジストリに追加する必要があります。
ツールレジストリは、エージェントが利用可能なすべてのツールを管理します。

ツールレジストリの主な機能：

- ツールの整理。
- 複数のツールレジストリの統合のサポート。
- 名前または型によるツールの取得メソッドの提供。

詳細については、[ToolRegistry](api:agents-tools::ai.koog.agents.core.tools.ToolRegistry) を参照してください。

ツールレジストリを作成し、そこにツールを追加する例を以下に示します：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.reflect.tools
    class MyToolSet : ToolSet {
        @Tool
        fun myTool(): String {
            // ツールの実装
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
    // ToolSet のインスタンスを作成
    MyToolSet myTool = new MyToolSet();

    // ToolRegistry を構築し、ToolSet からツールを登録
    ToolRegistry toolRegistry = ToolRegistry.builder()
        .tools(myTool)
        .build();
    ```
    <!--- KNIT example-tools-overview-java-01.java -->

複数のツールレジストリを統合するには、次のようにします：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.tools.ToolRegistry
    import ai.koog.agents.core.tools.annotations.Tool
    import ai.koog.agents.core.tools.reflect.ToolSet
    import ai.koog.agents.core.tools.reflect.tools
    class FirstToolSet : ToolSet {
        @Tool
        fun firstSampleTool(): String {
            // ツールの実装
            return "First result"
        }
    }
    class SecondToolSet : ToolSet {
        @Tool
        fun secondSampleTool(): String {
            // ツールの実装
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
    // ToolSet のインスタンスを作成
    FirstToolSet firstSampleTool = new FirstToolSet();
    SecondToolSet secondSampleTool = new SecondToolSet();

    // 個別のツールレジストリを構築
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

エージェントがツールを使用できるようにするには、エージェントの作成時に、そのツールを含むツールレジストリを引数として渡す必要があります：

=== "Kotlin"

    <!--- INCLUDE
    import ai.koog.agents.core.agent.AIAgent
    import ai.koog.agents.example.exampleToolsOverview01.toolRegistry
    import ai.koog.prompt.executor.clients.openai.OpenAIModels
    import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
    -->
    ```kotlin
    // エージェントの初期化
    val agent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
        systemPrompt = "You are a helpful assistant with strong mathematical skills.",
        llmModel = OpenAIModels.Chat.GPT4o,
        // ツールレジストリをエージェントに渡す
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

エージェントのコード内でツールを呼び出す方法はいくつかあります。ツールを直接呼び出すのではなく、エージェントコンテキストで提供されるメソッドを使用することをお勧めします。これにより、エージェント環境内でのツール操作が適切に処理されることが保証されます。

!!! tip
    エージェントの失敗を防ぐために、ツールに適切な [エラーハンドリング](features/agent-event-handlers.md) を実装していることを確認してください。

ツールは、`AIAgentLLMWriteSession` によって表される特定のセッションコンテキスト内で呼び出されます。
これにはツールを呼び出すためのいくつかのメソッドが用意されており、以下のことが可能です：

- 指定された引数でツールを呼び出す。
- 名前と指定された引数でツールを呼び出す。
- 提供されたツールクラスと引数でツールを呼び出す。
- 指定された型のツールを指定された引数で呼び出す。
- 生の文字列の結果を返すツールを呼び出す。

詳細については、[AIAgentLLMWriteSession](api:agents-core::ai.koog.agents.core.agent.session.AIAgentLLMWriteSession) の API リファレンスを参照してください。

#### 並列ツール呼び出し

`toParallelToolCallsRaw` 拡張機能を使用して、ツールを並列に呼び出すこともできます。例：

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

#### ノードからのツール呼び出し

ノードを使用してエージェントワークフローを構築する場合、ツールを呼び出すために特別なノードを使用できます：

* **nodeExecuteTool**: 単一のツール呼び出しを行い、その結果を返します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteTool) を参照してください。

* **nodeExecuteSingleTool**: 提供された引数を使用して特定のツールを呼び出します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteSingleTool) を参照してください。

* **nodeExecuteMultipleTools**: 複数のツール呼び出しを実行し、その結果を返します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeExecuteMultipleTools) を参照してください。

* **nodeLLMSendToolResult**: ツールの結果を LLM に送信し、レスポンスを取得します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendToolResult) を参照してください。

* **nodeLLMSendMultipleToolResults**: 複数のツールの結果を LLM に送信します。詳細は [API リファレンス](api:agents-core::ai.koog.agents.core.dsl.extension.nodeLLMSendMultipleToolResults) を参照してください。

## エージェントをツールとして使用する

このフレームワークは、任意の AI エージェントを他のエージェントが使用できるツールに変換する機能を提供します。
この強力な機能により、専門化されたエージェントを上位レベルのオーケストレーションエージェントからツールとして呼び出すことができる、階層的なエージェントアーキテクチャを作成できます。

### エージェントをツールに変換する

エージェントをツールに変換するには、`AIAgentService` と `createAgentTool()` 拡張関数を使用します：

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
    // 財務分析エージェントの作成を担当する、専門化されたエージェントサービスを作成します。
    val analysisAgentService = AIAgentService(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You are a financial analysis specialist.",
        toolRegistry = analysisToolRegistry
    )
    
    // 呼び出されると財務分析エージェントを実行するツールを作成します。
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

ツールに変換されたエージェントツールは、別のエージェントのツールレジストリに追加できます：

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
    // 専門化されたエージェントをツールとして使用できるコーディネーターエージェントを作成します。
    val coordinatorAgent = AIAgent(
        promptExecutor = simpleOpenAIExecutor(apiKey),
        llmModel = OpenAIModels.Chat.GPT4o,
        systemPrompt = "You coordinate different specialized services.",
        toolRegistry = ToolRegistry {
            tool(analysisAgentTool)
            // 必要に応じて他のツールを追加します
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

エージェントツールが呼び出されると：

1. 引数が入力記述子に従ってデシリアライズされます。
2. ラップされたエージェントが、デシリアライズされた入力を使用して実行されます。
3. エージェントの出力がシリアライズされ、ツールの結果として返されます。

### エージェントをツールとして使用する利点

- **モジュール性**: 複雑なワークフローを専門化されたエージェントに分割します。
- **再利用性**: 同じ専門エージェントを複数のコーディネーターエージェントで利用できます。
- **関心の分離**: 各エージェントは自身の特定のドメインに集中できます。