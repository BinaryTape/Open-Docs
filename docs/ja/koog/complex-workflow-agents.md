# 複雑なワークフローエージェント

単一実行エージェントに加えて、`AIAgent` クラスを使用すると、カスタム戦略、ツール、構成を定義することで、複雑なワークフローを処理するエージェントを構築できます。

このようなエージェントの作成と構成のプロセスには、通常、以下の手順が含まれます。

1.  LLMと通信するためのプロンプトエグゼキュータを提供します。
2.  エージェントのワークフローを制御する戦略を定義します。
3.  エージェントの動作を設定します。
4.  エージェントが使用するツールを実装します。
5.  イベント処理、メモリ、トレーシングなどのオプション機能を追加します。
6.  ユーザー入力でエージェントを実行します。

## 前提条件

-   AIエージェントの実装に使用するLLMプロバイダーから有効なAPIキーを持っていること。利用可能なすべてのプロバイダーのリストについては、「[概要](index.md)」を参照してください。

!!! tip
    APIキーは環境変数または安全な構成管理システムを使用して保存してください。
    ソースコードにAPIキーを直接ハードコーディングすることは避けてください。

## 単一実行エージェントの作成

### 1. 依存関係の追加

`AIAgent` の機能を使用するには、必要なすべての依存関係をビルド構成に含めます。

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

利用可能なすべてのインストール方法については、「[インストール](index.md#installation)」を参照してください。

### 2. プロンプトエグゼキュータの提供

プロンプトエグゼキュータは、プロンプトを管理し実行します。
使用する予定のLLMプロバイダーに基づいてプロンプトエグゼキュータを選択できます。また、利用可能なLLMクライアントのいずれかを使用してカスタムプロンプトエグゼキュータを作成することもできます。詳細については、「[プロンプトエグゼキュータ](prompt-api.md#prompt-executors)」を参照してください。

たとえば、OpenAIプロンプトエグゼキュータを提供するには、`simpleOpenAIExecutor` 関数を呼び出し、OpenAIサービスでの認証に必要なAPIキーを渡す必要があります。

```kotlin
val promptExecutor = simpleOpenAIExecutor(token)
```

複数のLLMプロバイダーで動作するプロンプトエグゼキュータを作成するには、以下を実行します。

1.  必要なLLMプロバイダーのクライアントを、対応するAPIキーで構成します。たとえば、
```kotlin
val openAIClient = OpenAILLMClient(System.getenv("OPENAI_KEY"))
val anthropicClient = AnthropicLLMClient(System.getenv("ANTHROPIC_KEY"))
val googleClient = GoogleLLMClient(System.getenv("GOOGLE_KEY"))
```
2.  構成されたクライアントを `DefaultMultiLLMPromptExecutor` クラスのコンストラクタに渡して、複数のLLMプロバイダーを持つプロンプトエグゼキュータを作成します。
```kotlin
val multiExecutor = DefaultMultiLLMPromptExecutor(openAIClient, anthropicClient, googleClient)
```

### 3. 戦略の定義

戦略は、ノードとエッジを使用してエージェントのワークフローを定義します。

#### 3.1. ノードとエッジを理解する

ノードとエッジは、戦略の構成要素です。

ノードは、エージェント戦略における処理ステップを表します。

```kotlin
val processNode by node<InputType, OutputType> { input ->
    // 入力を処理して出力を返す
    // llm.writeSession を使用してLLMと対話できます
    // callTool、callToolRaw などを使用してツールを呼び出すことができます
    transformedOutput
}
```
!!! tip
    エージェント戦略で使用できる事前定義されたノードもあります。詳細については、「[事前定義されたノードとコンポーネント](nodes-and-components.md)」を参照してください。

エッジはノード間の接続を定義します。

```kotlin
// 基本エッジ
edge(sourceNode forwardTo targetNode)

// 条件付きエッジ
edge(sourceNode forwardTo targetNode onCondition { output ->
    // このエッジをたどるには true を返し、スキップするには false を返します
    output.contains("specific text")
})

// 変換付きエッジ
edge(sourceNode forwardTo targetNode transformed { output ->
    // 出力をターゲットノードに渡す前に変換します
    "Modified: $output"
})

// 条件と変換の組み合わせ
edge(sourceNode forwardTo targetNode onCondition { it.isNotEmpty() } transformed { it.uppercase() })
```
#### 3.2. 戦略の実装

エージェント戦略を実装するには、`strategy` 関数を呼び出してノードとエッジを定義します。たとえば、

```kotlin
val agentStrategy = strategy("Simple calculator") {
    // 戦略のノードを定義する
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義する
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
!!! tip
    `strategy` 関数を使用すると、それぞれ独自のノードとエッジのセットを含む複数のサブグラフを定義できます。
    このアプローチは、簡易化された戦略ビルダーを使用するよりも、より高い柔軟性と機能性を提供します。
    サブグラフの詳細については、「[サブグラフ](subgraphs-overview.md)」を参照してください。

### 4. エージェントの構成

構成でエージェントの動作を定義します。

```kotlin
val agentConfig = AIAgentConfig.withSystemPrompt(
    prompt = """
        あなたはシンプルな電卓アシスタントです。
        電卓ツールを使用して2つの数値を加算できます。
        ユーザーが入力すると、加算したい数値を抽出します。
        入力は「add 5 and 7」、「5 + 7」、または単に「5 7」のような様々な形式で提供される場合があります。
        2つの数値を抽出し、電卓ツールを使用してそれらを加算します。
        常に、計算と結果を示す明確で親しみやすいメッセージで応答してください。
        """.trimIndent()
)
```

より高度な構成として、エージェントが使用するLLMを指定したり、エージェントが応答のために実行できる最大イテレーション数を設定したりできます。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                あなたはシンプルな電卓アシスタントです。
                電卓ツールを使用して2つの数値を加算できます。
                ユーザーが入力すると、加算したい数値を抽出します。
                入力は「add 5 and 7」、「5 + 7」、または単に「5 7」のような様々な形式で提供される場合があります。
                2つの数値を抽出し、電卓ツールを使用してそれらを加算します。
                常に、計算と結果を示す明確で親しみやすいメッセージで応答してください。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)
```

### 5. ツールの実装とツールレジストリの設定

ツールを使用すると、エージェントが特定のタスクを実行できるようになります。エージェントがツールを利用できるようにするには、それをツールレジストリに追加します。たとえば、

```kotlin
// 2つの数値を加算できるシンプルな電卓ツールを実装する
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// ツールをツールレジストリに追加する
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}
```

ツールの詳細については、「[ツール](tools-overview.md)」を参照してください。

### 6. 機能のインストール

機能を使用すると、エージェントに新しい機能を追加したり、その動作を変更したり、外部システムやリソースへのアクセスを提供したり、エージェントの実行中にイベントをログに記録および監視したりできます。
以下の機能が利用可能です。

-   EventHandler
-   AgentMemory
-   Tracing

機能をインストールするには、`install` 関数を呼び出し、引数としてその機能を提供します。たとえば、イベントハンドラー機能をインストールするには、以下を実行する必要があります。

```kotlin
installFeatures = {
    // EventHandler 機能をインストールする
    install(EventHandler) {
        onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
            println("Starting strategy: ${strategy.name}")
        }
        onAgentFinished { strategyName: String, result: String? ->
            println("Result: $result")
        }
    }
}
```

機能の構成の詳細については、専用ページを参照してください。

### 7. エージェントの実行

前の段階で作成した構成オプションでエージェントを作成し、提供された入力で実行します。

```kotlin
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        install(EventHandler) {
            onBeforeAgentStarted = { strategy: AIAgentStrategy, agent: AIAgent ->
                println("Starting strategy: ${strategy.name}")
            }
            onAgentFinished = { strategyName: String, result: String? ->
                println("Result: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("2つの数値を入力して追加してください（例：「add 5 and 7」または「5 + 7」）：")

    // ユーザー入力を読み取り、エージェントに送信します
    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}
```

## 構造化データの操作

`AIAgent` はLLM出力からの構造化データを処理できます。詳細については、「[ストリーミングAPI](streaming-api.md)」を参照してください。

## 並列ツール呼び出しの使用

`AIAgent` は並列ツール呼び出しをサポートしています。この機能により、複数のツールを同時に処理できるようになり、独立した操作のパフォーマンスが向上します。

詳細については、「[並列ツール呼び出し](tools-overview.md#parallel-tool-calls)」を参照してください。

## 完全なコードサンプル

エージェントの完全な実装を以下に示します。

```kotlin
// 環境変数からのAPIキーを使用してOpenAIエグゼキュータを使用する
val promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY"))

// シンプルな戦略を作成する
val agentStrategy = strategy("Simple calculator") {
    // 戦略のノードを定義する
    val nodeSendInput by nodeLLMRequest()
    val nodeExecuteTool by nodeExecuteTool()
    val nodeSendToolResult by nodeLLMSendToolResult()

    // ノード間のエッジを定義する
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

// エージェントを構成する
val agentConfig = AIAgentConfig(
    prompt = Prompt.build("simple-calculator") {
        system(
            """
                あなたはシンプルな電卓アシスタントです。
                電卓ツールを使用して2つの数値を加算できます。
                ユーザーが入力すると、加算したい数値を抽出します。
                入力は「add 5 and 7」、「5 + 7」、または単に「5 7」のような様々な形式で提供される場合があります。
                2つの数値を抽出し、電卓ツールを使用してそれらを加算します。
                常に、計算と結果を示す明確で親しみやすいメッセージで応答してください。
                """.trimIndent()
        )
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 10
)

// 2つの数値を加算できるシンプルな電卓ツールを実装する
@LLMDescription("Tools for performing basic arithmetic operations")
class CalculatorTools : ToolSet {
    @Tool
    @LLMDescription("Add two numbers together and return their sum")
    fun add(
        @LLMDescription("First number to add (integer value)")
        num1: Int,

        @LLMDescription("Second number to add (integer value)")
        num2: Int
    ): String {
        val sum = num1 + num2
        return "The sum of $num1 and $num2 is: $sum"
    }
}

// ツールをツールレジストリに追加する
val toolRegistry = ToolRegistry {
    tools(CalculatorTools())
}

// エージェントを作成する
val agent = AIAgent(
    promptExecutor = promptExecutor,
    strategy = agentStrategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
    installFeatures = {
        // EventHandler 機能をインストールする
        install(EventHandler) {
            onBeforeAgentStarted { strategy: AIAgentStrategy, agent: AIAgent ->
                println("Starting strategy: ${strategy.name}")
            }
            onAgentFinished { strategyName: String, result: String? ->
                println("Result: $result")
            }
        }
    }
)

suspend fun main() = runBlocking {
    println("2つの数値を入力して追加してください（例：「add 5 and 7」または「5 + 7」）：")

    val userInput = readlnOrNull() ?: ""
    agent.run(userInput)
}