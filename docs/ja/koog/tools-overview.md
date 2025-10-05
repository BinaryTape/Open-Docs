# 概要

エージェントは、特定のタスクを実行したり、外部システムにアクセスしたりするためにツールを使用します。

## ツールワークフロー

Koogフレームワークは、ツールを扱うための以下のワークフローを提供します。

1.  カスタムツールを作成するか、組み込みツールのいずれかを使用します。
2.  ツールをツールレジストリに追加します。
3.  ツールレジストリをエージェントに渡します。
4.  エージェントでツールを使用します。

### 利用可能なツールタイプ

Koogフレームワークには、3種類のツールがあります。

*   エージェントとユーザーの対話、および会話管理の機能を提供する組み込みツール。詳細は、[組み込みツール](built-in-tools.md)を参照してください。
*   関数をLLMにツールとして公開できるアノテーションベースのカスタムツール。詳細は、[アノテーションベースのツール](annotation-based-tools.md)を参照してください。
*   ツールパラメーター、メタデータ、実行ロジック、および登録・呼び出し方法を制御できるカスタムツール。詳細は、[クラスベースのツール](class-based-tools.md)を参照してください。

### ツールレジストリ

エージェントでツールを使用する前に、ツールレジストリに追加する必要があります。
ツールレジストリは、エージェントが利用できるすべてのツールを管理します。

ツールレジストリの主な機能：

*   ツールを整理します。
*   複数のツールレジストリのマージをサポートします。
*   名前またはタイプでツールを取得するメソッドを提供します。

詳細については、[ToolRegistry](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools/-tool-registry/index.html)を参照してください。

以下に、ツールレジストリを作成し、ツールを追加する例を示します。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
-->
```kotlin
val toolRegistry = ToolRegistry {
    tool(SayToUser)
}
```
<!--- KNIT example-tools-overview-01.kt -->

複数のツールレジストリをマージするには、次のようにします。

<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias FirstSampleTool = AskUser
typealias SecondSampleTool = SayToUser
-->
```kotlin
val firstToolRegistry = ToolRegistry {
    tool(FirstSampleTool)
}

val secondToolRegistry = ToolRegistry {
    tool(SecondSampleTool)
}

val newRegistry = firstToolRegistry + secondToolRegistry
```
<!--- KNIT example-tools-overview-02.kt -->

### エージェントへのツールの受け渡し

エージェントがツールを使用できるようにするには、エージェントを作成する際に、このツールを含むツールレジストリを引数として提供する必要があります。

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
    // ツールレジストリをエージェントに渡します
    toolRegistry = toolRegistry
)
```
<!--- KNIT example-tools-overview-03.kt -->

### ツールの呼び出し

エージェントコード内でツールを呼び出す方法はいくつかあります。推奨されるアプローチは、ツールを直接呼び出すのではなく、エージェントコンテキストで提供されるメソッドを使用することです。これにより、エージェント環境内でのツール操作が適切に処理されます。

!!! tip
    エージェントの失敗を防ぐため、ツールに適切な[エラー処理](agent-event-handlers.md)を実装していることを確認してください。

ツールは、`AIAgentLLMWriteSession`で表される特定のセッションコンテキスト内で呼び出されます。
これには、ツールを呼び出すためのいくつかのメソッドが用意されており、次のことができます。

*   指定された引数でツールを呼び出します。
*   その名前と指定された引数でツールを呼び出します。
*   提供されたツールクラスと引数でツールを呼び出します。
*   指定されたタイプのツールを、指定された引数で呼び出します。
*   生の文字列結果を返すツールを呼び出します。

詳細については、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent.session/-a-i-agent-l-l-m-write-session/index.html)を参照してください。

#### 並列ツール呼び出し

`toParallelToolCallsRaw`拡張機能を使用して、ツールを並列で呼び出すこともできます。例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.tools.SimpleTool
import ai.koog.agents.core.tools.ToolArgs
import ai.koog.agents.core.tools.ToolDescriptor
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
-->
```kotlin
@Serializable
data class Book(
    val title: String,
    val author: String,
    val description: String
)

class BookTool() : SimpleTool<Book>() {
    companion object {
        const val NAME = "book"
    }

    override suspend fun doExecute(args: Book): String {
        println("${args.title} by ${args.author}:
 ${args.description}")
        return "Done"
    }

    override val argsSerializer: KSerializer<Book>
        get() = Book.serializer()

    override val name = NAME
    override val description = "A tool to parse book information from Markdown"
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

#### ノードからのツール呼び出し

ノードを使用してエージェントワークフローを構築する場合、特殊なノードを使用してツールを呼び出すことができます。

*   **nodeExecuteTool**: 単一のツール呼び出しを実行し、その結果を返します。詳細は、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-tool.html)を参照してください。

*   **nodeExecuteSingleTool**: 指定された引数で特定のツールを呼び出します。詳細は、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-single-tool.html)を参照してください。

*   **nodeExecuteMultipleTools**: 複数のツール呼び出しを実行し、それらの結果を返します。詳細は、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-execute-multiple-tools.html)を参照してください。

*   **nodeLLMSendToolResult**: ツール結果をLLMに送信し、応答を取得します。詳細は、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-tool-result.html)を参照してください。

*   **nodeLLMSendMultipleToolResults**: 複数のツール結果をLLMに送信します。詳細は、[APIリファレンス](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.dsl.extension/node-l-l-m-send-multiple-tool-results.html)を参照してください。

## ツールとしてのエージェントの利用

このフレームワークは、あらゆるAIエージェントを他のエージェントが使用できるツールに変換する機能を提供します。
この強力な機能により、専門化されたエージェントがより上位のオーケストレーションエージェントによってツールとして呼び出される階層型エージェントアーキテクチャを作成できます。

### エージェントをツールに変換する

エージェントをツールに変換するには、`asTool()`拡張関数を使用します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""
val analysisToolRegistry = ToolRegistry {}

-->
```kotlin
// 財務分析エージェントの作成を担当する、専門のエージェントサービスを作成します。
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
)
```
<!--- KNIT example-tools-overview-05.kt -->

### 他のエージェントでエージェントツールを使用する

ツールに変換した後、エージェントツールを他のエージェントのツールレジストリに追加できます。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.example.exampleToolsOverview05.analysisAgentTool
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val apiKey = ""

-->
```kotlin
// 専門のエージェントをツールとして使用できるコーディネーターエージェントを作成
val coordinatorAgent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(apiKey),
    llmModel = OpenAIModels.Chat.GPT4o,
    systemPrompt = "You coordinate different specialized services.",
    toolRegistry = ToolRegistry {
        tool(analysisAgentTool)
        // 必要に応じて他のツールを追加
    }
)
```
<!--- KNIT example-tools-overview-06.kt -->

### エージェントツールの実行

エージェントツールが呼び出されると：

1.  引数は入力ディスクリプターに従って逆シリアル化されます。
2.  ラップされたエージェントは、逆シリアル化された入力で実行されます。
3.  エージェントの出力はシリアル化され、ツール結果として返されます。

### ツールとしてのエージェントの利点

-   **モジュール性**: 複雑なワークフローを専門化されたエージェントに分割します。
-   **再利用性**: 複数のコーディネーターエージェントで同じ専門化されたエージェントを使用します。
-   **関心の分離**: 各エージェントは自身の特定のドメインに集中できます。