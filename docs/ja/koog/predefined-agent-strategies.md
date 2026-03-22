# 事前定義されたエージェント戦略

エージェントの実装を容易にするため、Koogは一般的なエージェントのユースケース向けに事前定義されたエージェント戦略（agent strategies）を提供しています。
以下の事前定義された戦略が利用可能です。

- [チャットエージェント戦略](#chat-agent-strategy)
- [ReAct戦略](#react-strategy)

## チャットエージェント戦略（Chat agent strategy）

チャットエージェント戦略は、チャット形式のインタラクションプロセスを実行するために設計されています。
異なるステージ、ノード、およびツールの間の相互作用をオーケストレートし、ユーザー入力の処理、ツールの実行、およびチャット形式でのレスポンス提供を行います。

### 概要

チャットエージェント戦略は、エージェントが以下を行うパターンを実装します。

1. ユーザー入力を受け取る
2. LLMを使用して入力を処理する
3. ツールを呼び出すか、直接レスポンスを返す
4. ツールの結果を処理し、会話を継続する
5. LLMがツールの使用ではなくプレーンテキストで回答しようとした場合に、フィードバックを提供する

このアプローチにより、エージェントがツールを使用してユーザーのリクエストに応える対話型インターフェースが構築されます。

### セットアップと依存関係

Koogにおけるチャットエージェント戦略の実装は `chatAgentStrategy` 関数を通じて行われます。エージェントのコードでこの関数を使用できるようにするには、以下の依存関係のインポートを追加してください。

```
ai.koog.agents.ext.agent.chatAgentStrategy
```
<!--- KNIT example-predefined-strategies-01.txt -->

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
    // chatAgentStrategyをエージェント戦略として設定
    strategy = chatAgentStrategy()
)
```
<!--- KNIT example-predefined-strategies-01.kt -->

### チャットエージェント戦略を使用すべきケース

チャットエージェント戦略は、特に以下の場合に役立ちます。

- ツールを使用する必要がある対話型エージェントを構築する場合
- ユーザーのリクエストに基づいてアクションを実行できるアシスタントを作成する場合
- 外部システムやデータにアクセスする必要があるチャットボットを実装する場合
- プレーンテキストによる回答ではなく、ツールの使用を強制したいシナリオ

### 例

以下は、事前定義されたチャットエージェント戦略（`chatAgentStrategy`）と、エージェントが使用するツールの実装例です。

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
    // chatAgentStrategyをエージェント戦略として使用
    strategy = chatAgentStrategy(),
    // エージェントが使用できるツールを追加
    toolRegistry = ToolRegistry {
        tool(searchTool)
        tool(weatherTool)
    }
)

suspend fun main() { 
    // ユーザーのクエリでエージェントを実行
    val result = chatAgent.run("今日の天気はどうですか？傘を持っていくべきでしょうか？")
}
```
<!--- KNIT example-predefined-strategies-02.kt -->

## ReAct戦略

ReAct（Reasoning and Acting：推論と実行）戦略は、推論ステージと実行ステージを交互に繰り返すことで、タスクを動的に処理し、大規模言語モデル（LLM）に出力を要求するAIエージェント戦略です。

### 概要

ReAct戦略は、エージェントが以下を行うパターンを実装します。

1. 現在の状態について推論し、次のステップを計画する
2. その推論に基づいてアクションを実行する
3. アクションの結果を観察する
4. このサイクルを繰り返す

このアプローチは、推論（問題を段階的に考える）と実行（情報を収集したり操作を行ったりするためにツールを実行する）の長所を組み合わせています。

### フロー図

ReAct戦略のフロー図は以下の通りです。

![Koog flow diagram](img/koog-react-diagram-light.png#only-light)
![Koog flow diagram](img/koog-react-diagram-dark.png#only-dark)

### セットアップと依存関係

KoogにおけるReAct戦略の実装は `reActStrategy` 関数を通じて行われます。エージェントのコードでこの関数を使用できるようにするには、以下の依存関係のインポートを追加してください。

```
ai.koog.agents.ext.agent.reActStrategy
```
<!--- KNIT example-predefined-strategies-02.txt -->

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
    // reActStrategyをエージェント戦略として設定
    strategy = reActStrategy(
        // オプションのパラメータ値を設定
        reasoningInterval = 1,
        name = "react_agent"
    )
)
```
<!--- KNIT example-predefined-strategies-03.kt -->

### パラメータ

`reActStrategy` 関数は以下のパラメータを受け取ります。

| パラメータ | 型 | デフォルト値 | 説明 |
|---------------------|--------|----------|---------------------------------------------------------------------|
| `reasoningInterval` | Int    | 1        | 推論ステップの間隔を指定します。0より大きい必要があります。 |
| `name`              | String | `re_act` | 戦略の名前。 |

### ユースケースの例

以下は、シンプルな銀行業務エージェントでのReAct戦略の仕組みの例です。

#### 1. ユーザー入力

ユーザーが初期プロンプトを送信します。例えば、「先月はいくら使いましたか？」といった質問です。

#### 2. 推論

エージェントは、ユーザー入力と推論プロンプトを受け取り、初期推論を行います。推論は以下のようになります。

```text
以下の手順に従う必要があります：
1. 先月のすべての取引を取得する
2. 入金（正の金額）を除外する
3. 合計支出額を計算する
```
<!--- KNIT example-predefined-strategies-03.txt -->

#### 3. アクションと実行（フェーズ1）

前のステップで定義したアクション項目に基づき、エージェントはツールを実行して前月のすべての取引を取得します。

この場合、実行するツールは `get_transactions` であり、リクエストに合わせて前月の全取引を取得するための `startDate` と `endDate` 引数が指定されます。

```text
{tool: "get_transactions", args: {startDate: "2025-05-19", endDate: "2025-06-18"}}
```
<!--- KNIT example-predefined-strategies-04.txt -->

ツールは、以下のような結果を返します。

```text
[
  {date: "2025-05-25", amount: -100.00, description: "Grocery Store"},
  {date: "2025-05-31", amount: +1000.00, description: "Salary Deposit"},
  {date: "2025-06-10", amount: -500.00, description: "Rent Payment"},
  {date: "2025-06-13", amount: -200.00, description: "Utilities"}
]
```
<!--- KNIT example-predefined-strategies-05.txt -->

#### 4. 推論

ツールから返された結果を基に、エージェントはフローの次のステップを決定するために再び推論を行います。

```text
取引データを入手しました。次は以下を行う必要があります：
1. +1000.00の給与振込を除外する
2. 残りの取引を合計する
```
<!--- KNIT example-predefined-strategies-06.txt -->

#### 5. アクションと実行（フェーズ2）

前の推論ステップに基づき、エージェントはツールの引数として提供された金額を合算する `calculate_sum` ツールを呼び出します。推論の結果、取引から正の金額を除外するというアクションポイントも生じたため、ツールの引数として提供される金額は負のものだけになります。

```text
{tool: "calculate_sum", args: {amounts: [-100.00, -500.00, -200.00]}}
```
<!--- KNIT example-predefined-strategies-07.txt -->

ツールは最終的な結果を返します。

```text
-800.00
```
<!--- KNIT example-predefined-strategies-08.txt -->

#### 6. 最終レスポンス

エージェントは、計算された合計額を含む最終的なレスポンス（アシスタントメッセージ）を返します。

```text
先月は、食料品、家賃、公共料金に合計800.00ドル支出しました。
```
<!--- KNIT example-predefined-strategies-09.txt -->

### ReAct戦略を使用すべきケース

ReAct戦略は、特に以下の場合に役立ちます。

- 多段階の推論を必要とする複雑なタスク
- 最終的な回答を提供する前にエージェントが情報を収集する必要があるシナリオ
- 小さなステップに分解することで解決しやすくなる問題
- 分析的思考とツールの使用の両方を必要とするタスク

### 例

以下は、事前定義されたReAct戦略（`reActStrategy`）と、エージェントが使用するツールの実装例です。

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
    // reActStrategyをエージェント戦略として使用
    strategy = reActStrategy(
        reasoningInterval = 1,
        name = "banking_agent"
    ),
    // エージェントが使用できるツールを追加
    toolRegistry = ToolRegistry {
        tool(getTransactions)
        tool(calculateSum)
    }
)

suspend fun main() { 
    // ユーザーのクエリでエージェントを実行
    val result = bankingAgent.run("先月はいくら使いましたか？")
}
```
<!--- KNIT example-predefined-strategies-04.kt -->