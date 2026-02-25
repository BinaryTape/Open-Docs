# 複雑なワークフローエージェント

基本的なエージェントに加えて、`AIAgent` クラスを使用すると、カスタムストラテジー、ツール、構成、およびカスタムの入出力型を定義することで、複雑なワークフローを処理するエージェントを構築できます。

!!! tip
    Koogを初めて使用し、最もシンプルなエージェントを作成したい場合は、[基本的なエージェント](basic-agents.md)から始めてください。

このようなエージェントを作成して構成するプロセスには、通常、以下のステップが含まれます：

1. LLMと通信するためのプロンプトエグゼキューターを提供します。
2. エージェントのワークフローを制御するストラテジーを定義します。
3. エージェントの動作を構成します。
4. エージェントが使用するツールを実装します。
5. イベントハンドリング、メモリ、トレーシングなどのオプション機能を追加します。
6. ユーザー入力を使用してエージェントを実行します。

## 前提条件

- 使用するLLMプロバイダーの有効なAPIキーを持っていること。利用可能なすべてのプロバイダーの一覧については、[LLMプロバイダー](llm-providers.md)を参照してください。

!!! tip
    APIキーを保存するには、環境変数または安全な構成管理システムを使用してください。
    ソースコードにAPIキーを直接ハードコードすることは避けてください。

## 複雑なワークフローエージェントの作成

### 1. 依存関係の追加

`AIAgent` 機能を使用するには、ビルド構成に必要なすべての依存関係を含めます：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

利用可能なすべてのインストール方法については、[Koogのインストール](getting-started.md#install-koog)を参照してください。

### 2. プロンプトエグゼキューターの提供

プロンプトエグゼキューターは、プロンプトを管理し実行します。
使用予定のLLMプロバイダーに基づいてプロンプトエグゼキューターを選択できます。
また、利用可能なLLMクライアントのいずれかを使用して、カスタムのプロンプトエグゼキューターを作成することもできます。
詳細については、[プロンプトエグゼキューター](prompts/prompt-executors.md)を参照してください。

例えば、OpenAIのプロンプトエグゼキューターを提供するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスとの認証に必要なAPIキーを渡します：

<!--- INCLUDE
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

const val token = ""
-->
```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```
<!--- KNIT example-complex-workflow-agents-01.kt -->

複数のLLMプロバイダーで動作するプロンプトエグゼキューターを作成するには、次のようにします：

1) 対応するAPIキーを使用して、必要なLLMプロバイダーのクライアントを構成します。例：
<!--- INCLUDE
import ai.koog.prompt.executor.clients.openai.OpenAILLMClient
import ai.koog.prompt.executor.clients.anthropic.AnthropicLLMClient
import ai.koog.prompt.executor.clients.google.GoogleLLMClient
-->
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
<!--- KNIT example-complex-workflow-agents-02.kt -->
2) 構成したクライアントを `MultiLLMPromptExecutor` クラスのコンストラクタに渡し、複数のLLMプロバイダーを持つプロンプトエグゼキューターを作成します：
<!--- INCLUDE
import ai.koog.agents.example.exampleComplexWorkflowAgents02.anthropicClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.googleClient
import ai.koog.agents.example.exampleComplexWorkflowAgents02.openAIClient
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
-->
```kotlin
val multiExecutor = MultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```
<!--- KNIT example-complex-workflow-agents-03.kt -->

### 3. ストラテジーの定義

ストラテジーは、ノード（node）とエッジ（edge）を使用してエージェントのワークフローを定義します。任意の入出力型を持つことができ、これらは `strategy` 関数のジェネリックパラメータで指定できます。これらは `AIAgent` の入出力型にもなります。
入出力のデフォルト型はどちらも `String` です。

!!! tip
    ストラテジーの詳細については、[カスタムストラテジーグラフ](custom-strategy-graphs.md)を参照してください。

#### 3.1. ノードとエッジを理解する

ノードとエッジは、ストラテジーを構成するビルディングブロックです。

ノードは、エージェントストラテジーにおける処理ステップを表します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.strategy
class InputType

class OutputType

val transformedOutput = OutputType()
val strategy = strategy<InputType, OutputType>("Simple calculator") {
-->
<!--- SUFFIX
}
-->
```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 入力を処理して出力を返す
    // llm.writeSession を使用して LLM とやり取りできる
    // callTool、callToolRaw などを使用してツールを呼び出せる
    transformedOutput
}
```
<!--- KNIT example-complex-workflow-agents-04.kt -->

!!! tip
    エージェントストラテジーで使用できる定義済みのノードもあります。詳細については、[定義済みノードとコンポーネント](nodes-and-components.md)を参照してください。

エッジは、ノード間の接続を定義します。

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy

const val transformedOutput = "transformed-output"

val strategy = strategy<String, String>("Simple calculator") {

    val sourceNode by node<String, String> { input ->
        // 入力を処理して出力を返す
        // llm.writeSession を使用して LLM とやり取りできる
        // callTool、callToolRaw などを使用してツールを呼び出せる
        transformedOutput
    }

    val targetNode by node<String, String> { input ->
        // 入力を処理して出力を返す
        // llm.writeSession を使用して LLM とやり取りできる
        // callTool、callToolRaw などを使用してツールを呼び出せる
        transformedOutput
    }
-->
<!--- SUFFIX
}
-->
```kotlin
// 基本的なエッジ
edge(sourceNode forwardTo targetNode)

// 条件付きエッジ
edge(sourceNode forwardTo targetNode onCondition { output ->
    // このエッジを辿る場合は true、スキップする場合は false を返す
    output.contains("specific text")
})

// 変換付きエッジ
edge(sourceNode forwardTo targetNode transformed { output ->
    // ターゲットノードに渡す前に出力を変換する
    "Modified: $output"
})

// 条件と変換の組み合わせ
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
<!--- KNIT example-complex-workflow-agents-05.kt -->

#### 3.2. ストラテジーの実装

エージェントストラテジーを実装するには、`strategy` 関数を呼び出し、ノードとエッジを定義します。例：

<!--- INCLUDE
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
-->
```kotlin
val agentStrategy = strategy("Simple calculator") {
    // ストラテジーのノードを定義
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義
    // 開始 -> 入力送信
    edge(nodeStart forwardTo nodeSendInput)

    // 入力送信 -> 終了
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 入力送信 -> ツール実行
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // ツール実行 -> ツール結果送信
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // ツール結果送信 -> 終了
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}
```
<!--- KNIT example-complex-workflow-agents-06.kt -->
!!! tip
    `strategy` 関数を使用すると、それぞれが独自のノードとエッジのセットを含む複数のサブグラフを定義できます。
    このアプローチは、簡略化されたストラテジービルダーを使用する場合と比較して、より高い柔軟性と機能を提供します。
    サブグラフの詳細については、[サブグラフの概要](subgraphs-overview.md)を参照してください。

### 4. エージェントの構成

構成を使用してエージェントの動作を定義します：
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
-->
```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        あなたはシンプルな計算機アシスタントです。
        計算機ツールを使用して、2つの数値を足し合わせることができます。
        ユーザーが入力を行ったら、足したい数値を抽出してください。
        入力は「5と7を足して」、「5 + 7」、あるいは単に「5 7」など、さまざまな形式が考えられます。
        2つの数値を抽出し、計算機ツールを使用して足し合わせてください。
        常に計算内容と結果を示す、明確でフレンドリーなメッセージで回答してください。
        """.trimIndent()
)
```
<!--- KNIT example-complex-workflow-agents-07.kt -->

より高度な構成では、エージェントが使用するLLMを指定したり、エージェントが応答するために実行できる最大反復回数を設定したりできます：
<!--- INCLUDE
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
-->
```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                あなたはシンプルな計算機アシスタントです。
                計算機ツールを使用して、2つの数値を足し合わせることができます。
                ユーザーが入力を行ったら、足したい数値を抽出してください。
                入力は「5と7を足して」、「5 + 7」、あるいは単に「5 7」など、さまざまな形式が考えられます。
                2つの数値を抽出し、計算機ツールを使用して足し合わせてください。
                常に計算内容と結果を示す、明確でフレンドリーなメッセージで回答してください。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```
<!--- KNIT example-complex-workflow-agents-08.kt -->

### 5. ツールの実装とツールレジストリのセットアップ

ツールを使用すると、エージェントは特定のタスクを実行できるようになります。
エージェントがツールを利用できるようにするには、ツールレジストリに追加します。
例：
<!--- INCLUDE
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
-->
```kotlin
// 2つの数値を足すことができるシンプルな計算機ツールを実装
@LLMDescription("基本的な算術演算を実行するためのツール")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("2つの数値を足し合わせ、その合計を返す")
    fun add(
        @LLMDescription("足される最初の数（整数値）")
        num1: Int,

        @LLMDescription("足される2番目の数（整数値）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "$num1 と $num2 の合計は $sum です。"
    }
}

// ツールをツールレジストリに追加
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```
<!--- KNIT example-complex-workflow-agents-09.kt -->

ツールの詳細については、[ツールの概要](tools-overview.md)を参照してください。

### 6. フィーチャーのインストール

フィーチャーを使用すると、エージェントに新しい機能を追加したり、動作を変更したり、外部のシステムやリソースへのアクセスを提供したり、エージェントの実行中にイベントをログに記録して監視したりできます。
以下のフィーチャーが利用可能です：

- EventHandler
- AgentMemory
- Tracing

フィーチャーをインストールするには、`install` 関数を呼び出し、引数としてフィーチャーを提供します。
例えば、EventHandler フィーチャーをインストールするには、次のようにします：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels

val agent = AIAgent(
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
-->
<!--- SUFFIX
)
-->
```kotlin
// EventHandler フィーチャーをインストール
installFeatures = {
    install(EventHandler) {
        onAgentStarting { eventContext: AgentStartingContext ->
            println("エージェントを開始しています: ${eventContext.agent.id}")
        }
        onAgentCompleted { eventContext: AgentCompletedContext ->
            println("結果: ${eventContext.result}")
        }
    }
}
```
<!--- KNIT example-complex-workflow-agents-10.kt -->

フィーチャーの構成の詳細については、専用のページを参照してください。

### 7. エージェントの実行

前の段階で作成した構成オプションを使用してエージェントを作成し、提供された入力で実行します：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.example.exampleComplexWorkflowAgents01.promptExecutor
import ai.koog.agents.example.exampleComplexWorkflowAgents06.agentStrategy
import ai.koog.agents.example.exampleComplexWorkflowAgents07.agentConfig
import ai.koog.agents.example.exampleComplexWorkflowAgents09.toolRegistry
import ai.koog.agents.features.eventHandler.feature.EventHandler
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("エージェントを開始しています: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("結果: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("足し合わせる2つの数値を入力してください（例: 「5と7を足して」や「5 + 7」）:")

        // ユーザー入力を読み取り、エージェントに送信
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("エージェントの返答: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-11.kt -->

## 構造化データの処理

`AIAgent` はLLMの出力から構造化データを処理できます。詳細については、[構造化データの処理](structured-output.md)を参照してください。

## 並列ツール呼び出しの使用

`AIAgent` は並列ツール呼び出しをサポートしています。この機能により、複数のツールを同時に処理できるため、独立した操作のパフォーマンスが向上します。

詳細については、[並列ツール呼び出し](tools-overview.md#parallel-tool-calls)を参照してください。

## 完全なコードサンプル

以下は、エージェントの完全な実装です：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.core.feature.handler.agent.AgentCompletedContext
import ai.koog.agents.core.feature.handler.agent.AgentStartingContext
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.features.eventHandler.feature.EventHandler
import ai.koog.prompt.dsl.Prompt
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

-->
```kotlin
// 環境変数から取得したAPIキーを使用してOpenAIエグゼキューターを使用
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// シンプルなストラテジーを作成
val agentStrategy = strategy("Simple calculator") {
    // ストラテジーのノードを定義
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義
    // 開始 -> 入力送信
    edge(nodeStart forwardTo nodeSendInput)

    // 入力送信 -> 終了
    edge(
        (nodeSendInput forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )

    // 入力送信 -> ツール実行
    edge(
        (nodeSendInput forwardTo nodeExecuteTool)
                onToolCall { true }
    )

    // ツール実行 -> ツール結果送信
    edge(nodeExecuteTool forwardTo nodeSendToolResult)

    // ツール結果送信 -> 終了
    edge(
        (nodeSendToolResult forwardTo nodeFinish)
                transformed { it }
                onAssistantMessage { true }
    )
}

// エージェントを構成
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                あなたはシンプルな計算機アシスタントです。
                計算機ツールを使用して、2つの数値を足し合わせることができます。
                ユーザーが入力を行ったら、足したい数値を抽出してください。
                入力は「5と7を足して」、「5 + 7」、あるいは単に「5 7」など、さまざまな形式が考えられます。
                2つの数値を抽出し、計算機ツールを使用して足し合わせてください。
                常に計算内容と結果を示す、明確でフレンドリーなメッセージで回答してください。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 2つの数値を足すことができるシンプルな計算機ツールを実装
@LLMDescription("基本的な算術演算を実行するためのツール")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("2つの数値を足し合わせ、その合計を返す")
    fun add(
        @LLMDescription("足される最初の数（整数値）")
        num1: Int,

        @LLMDescription("足される2番目の数（整数値）")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "$num1 と $num2 の合計は $sum です。"
    }
}

// ツールをツールレジストリに追加
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// エージェントを作成
val agent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    installFeatures = {
        install(EventHandler) {
            onAgentStarting { eventContext: AgentStartingContext ->
                println("エージェントを開始しています: ${eventContext.agent.id}")
            }
            onAgentCompleted { eventContext: AgentCompletedContext ->
                println("結果: ${eventContext.result}")
            }
        }
    }
)

fun main() {
    runBlocking {
        println("足し合わせる2つの数値を入力してください（例: 「5と7を足して」や「5 + 7」）:")

        // ユーザー入力を読み取り、エージェントに送信
        val userInput = readlnOrNull() ?: ""
        val agentResult = agent.run(userInput)
        println("エージェントの返答: $agentResult")
    }
}
```
<!--- KNIT example-complex-workflow-agents-12.kt -->