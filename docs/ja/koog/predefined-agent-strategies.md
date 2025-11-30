# 事前定義されたエージェント戦略

エージェントの実装を容易にするため、Koogは一般的なエージェントのユースケース向けに事前定義されたエージェント戦略を提供します。
以下の事前定義された戦略が利用可能です。

- [チャットエージェント戦略](#chat-agent-strategy)
- [ReAct戦略](#react-strategy)

## チャットエージェント戦略

チャットエージェント戦略は、チャット対話プロセスを実行するために設計されています。
ユーザー入力を処理し、ツールを実行し、チャット形式で応答を提供するために、さまざまなステージ、ノード、ツールの間のインタラクションをオーケストレーションします。

### 概要

チャットエージェント戦略は、エージェントが以下のパターンを実装します。

1.  ユーザー入力の受信
2.  LLMを使用した入力の処理
3.  ツールの呼び出し、または直接的な応答の提供
4.  ツール結果の処理と会話の継続
5.  LLMがツールを使用せずにプレーンテキストで応答しようとした場合のフィードバック提供

このアプローチにより、エージェントがユーザー要求を満たすためにツールを使用できる会話型インターフェースが作成されます。

### セットアップと依存関係

Koogにおけるチャットエージェント戦略の実装は、`chatAgentStrategy`関数を介して行われます。この関数をエージェントコードで利用できるようにするには、以下の依存関係インポートを追加してください。

```
ai.koog.agents.ext.agent.chatAgentStrategy
```

この戦略を使用するには、以下のパターンに従ってAIエージェントを作成します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.chatAgentStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor =simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Chat.O4Mini
-->
```kotlin
val chatAgent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    llmModel = model,
    // Set chatAgentStrategy as the agent strategy
    strategy = chatAgentStrategy()
)
```
<!--- KNIT example-predefined-strategies-01.kt -->

### チャットエージェント戦略を使用するケース

チャットエージェント戦略は、特に以下の状況で役立ちます。

-   ツールを使用する必要がある会話型エージェントの構築
-   ユーザー要求に基づいてアクションを実行できるアシスタントの作成
-   外部システムやデータにアクセスする必要があるチャットボットの実装
-   プレーンテキストの応答ではなく、ツールの使用を強制したいシナリオ

### 例

以下は、事前定義されたチャットエージェント戦略（`chatAgentStrategy`）と、エージェントが使用できるツールを実装したAIエージェントのコード例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.chatAgentStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias searchTool = AskUser
typealias weatherTool = SayToUser

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor =simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Chat.O4Mini
-->
```kotlin
val chatAgent = AIAgent(
    promptExecutor = promptExecutor,
    llmModel = model,
    // Use chatAgentStrategy as the agent strategy
    strategy = chatAgentStrategy(),
    // Add tools the agent can use
    toolRegistry = ToolRegistry {
        tool(searchTool)
        tool(weatherTool)
    }
)

suspend fun main() { 
    // Run the agent with a user query
    val result = chatAgent.run("What's the weather like today and should I bring an umbrella?")
}
```
<!--- KNIT example-predefined-strategies-02.kt -->

## ReAct戦略

ReAct（Reasoning and Acting）戦略は、推論と実行の段階を交互に繰り返すことで、タスクを動的に処理し、大規模言語モデル（LLM）から出力を要求するAIエージェント戦略です。

### 概要

ReAct戦略は、エージェントが以下のパターンを実装します。

1.  現在の状態について推論し、次のステップを計画する
2.  その推論に基づいて行動を起こす
3.  それらの行動の結果を観察する
4.  サイクルを繰り返す

このアプローチは、推論（問題を段階的に考える）と行動（情報収集や操作実行のためにツールを実行する）の強みを組み合わせています。

### フローダイアグラム

以下はReAct戦略のフローダイアグラムです。

![Koog flow diagram](img/koog-react-diagram-light.png#only-light)
![Koog flow diagram](img/koog-react-diagram-dark.png#only-dark)

### セットアップと依存関係

KoogにおけるReAct戦略の実装は、`reActStrategy`関数を介して行われます。この関数をエージェントコードで利用できるようにするには、以下の依存関係インポートを追加してください。

```
ai.koog.agents.ext.agent.reActStrategy
```
<!--- KNIT example-predefined-strategies-03.kt -->

この戦略を使用するには、以下のパターンに従ってAIエージェントを作成します。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.reActStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor = simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Chat.O4Mini
-->
```kotlin hl_lines="5-10"
val reActAgent = AIAgent(
    promptExecutor = promptExecutor,
    toolRegistry = toolRegistry,
    llmModel = model,
    // Set reActStrategy as the agent strategy
    strategy = reActStrategy(
        // Set optional parameter values
        reasoningInterval = 1,
        name = "react_agent"
    )
)
```
<!--- KNIT example-predefined-strategies-04.kt -->

### パラメーター

`reActStrategy`関数は、以下のパラメーターを受け取ります。

| パラメーター          | 型     | デフォルト | 説明                                                         |
|-------------------|--------|----------|--------------------------------------------------------------|
| `reasoningInterval` | Int    | 1        | 推論ステップの間隔を指定します。0より大きい必要があります。  |
| `name`              | String | `re_act` | 戦略の名前です。                                           |

### 使用例

ここに、シンプルなバンキングエージェントでReAct戦略がどのように機能するかを示す例があります。

#### 1. ユーザー入力

ユーザーが最初のプロンプトを送信します。例えば、`先月はいくら使いましたか？`のような質問です。

#### 2. 推論

エージェントは、ユーザー入力と推論プロンプトを受け取り、初期推論を実行します。推論は次のようになります。

```text
I need to follow these steps:
1. Get all transactions from last month
2. Filter out deposits (positive amounts)
3. Calculate total spending
```

#### 3. アクションと実行、フェーズ1

エージェントが前のステップで定義したアクション項目に基づいて、前月のすべてのトランザクションを取得するツールを実行します。

この場合、実行するツールは`get_transactions`であり、前月のすべてのトランザクションを取得する要求に一致する`startDate`と`endDate`の引数も定義されています。

```text
{tool: "get_transactions", args: {startDate: "2025-05-19", endDate: "2025-06-18"}}
```

ツールは次のような結果を返します。

```text
[
  {date: "2025-05-25", amount: -100.00, description: "Grocery Store"},
  {date: "2025-05-31", amount: +1000.00, description: "Salary Deposit"},
  {date: "2025-06-10", amount: -500.00, description: "Rent Payment"},
  {date: "2025-06-13", amount: -200.00, description: "Utilities"}
]
```

#### 4. 推論

ツールによって返された結果を用いて、エージェントはフローの次のステップを決定するために再度推論を実行します。

```text
I have the transactions. Now I need to:
1. Remove the salary deposit of +1000.00
2. Sum up the remaining transactions
```

#### 5. アクションと実行、フェーズ2

前の推論ステップに基づいて、エージェントはツール引数として提供された金額を合計する`calculate_sum`ツールを呼び出します。推論の結果、トランザクションから正の金額を除外するというアクションポイントも生じたため、ツール引数として提供される金額は負の値のみです。

```text
{tool: "calculate_sum", args: {amounts: [-100.00, -500.00, -200.00]}}
```

ツールは最終結果を返します。

```text
-800.00
```

#### 6. 最終応答

エージェントは、計算された合計を含む最終応答（アシスタントメッセージ）を返します。

```text
You spent $800.00 last month on groceries, rent, and utilities.
```

### ReAct戦略を使用するケース

ReAct戦略は、特に以下の状況で役立ちます。

-   多段階の推論を必要とする複雑なタスク
-   エージェントが最終的な回答を提供する前に情報を収集する必要があるシナリオ
-   小さなステップに分解することで解決が容易になる問題
-   分析的思考とツールの使用の両方を必要とするタスク

### 例

以下は、事前定義されたReAct戦略（`reActStrategy`）と、エージェントが使用できるツールを実装したAIエージェントのコード例です。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.reActStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.agents.ext.tool.AskUser
import ai.koog.agents.ext.tool.SayToUser

typealias Input = String

typealias getTransactions = AskUser
typealias calculateSum = SayToUser

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor = simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Chat.O4Mini
-->
```kotlin
val bankingAgent = AIAgent(
    promptExecutor = promptExecutor,
    llmModel = model,
    // Use reActStrategy as the agent strategy
    strategy = reActStrategy(
        reasoningInterval = 1,
        name = "banking_agent"
    ),
    // Add tools the agent can use
    toolRegistry = ToolRegistry {
        tool(getTransactions)
        tool(calculateSum)
    }
)

suspend fun main() { 
    // Run the agent with a user query
    val result = bankingAgent.run("How much did I spend last month?")
}
```
<!--- KNIT example-predefined-strategies-05.kt -->