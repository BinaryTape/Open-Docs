# 預定義的 agent 策略

為了讓 agent 實作更簡單，Koog 為常見的 agent 使用案例提供了預定義的 agent 策略。
目前提供以下預定義策略：

- [Chat agent 策略](#chat-agent-strategy)
- [ReAct 策略](#react-strategy)

## Chat agent 策略

Chat agent 策略專為執行對話互動程序而設計。
它協調不同階段、節點與工具之間的互動，以對話方式處理使用者輸入、執行工具並提供回應。

### 概覽

Chat agent 策略實作了一套模式，其中 agent 會：

1. 接收使用者輸入
2. 使用 LLM 處理輸入
3. 呼叫工具或提供直接回應
4. 處理工具結果並繼續對話
5. 如果 LLM 嘗試以純文字而非使用工具進行回應，則提供回饋

這種方法建立了一個對話式介面，讓 agent 可以使用工具來完成使用者要求。

### 設定與相依性

Koog 中的 Chat agent 策略是透過 `chatAgentStrategy` 函式實作的。若要在您的 agent 程式碼中使用該函式，請新增以下相依性匯入：

```
ai.koog.agents.ext.agent.chatAgentStrategy
```
<!--- KNIT example-predefined-strategies-01.txt -->

若要使用該策略，請按照以下模式建立 AI agent：

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
    // 將 chatAgentStrategy 設定為 agent 策略
    strategy = chatAgentStrategy()
)
```
<!--- KNIT example-predefined-strategies-01.kt -->

### 何時使用 Chat agent 策略

Chat agent 策略特別適用於：

- 構建需要使用工具的對話式 agent
- 建立可以根據使用者要求執行操作的助理
- 實作需要存取外部系統或資料的聊天機器人
- 想要強制執行工具使用而非純文字回應的場景

### 範例

以下是實作預定義 Chat agent 策略 (`chatAgentStrategy`) 的 AI agent 以及 agent 可能使用的工具之程式碼範例：

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
    // 使用 chatAgentStrategy 作為 agent 策略
    strategy = chatAgentStrategy(),
    // 新增 agent 可以使用的工具
    toolRegistry = ToolRegistry {
        tool(searchTool)
        tool(weatherTool)
    }
)

suspend fun main() { 
    // 使用使用者查詢執行 agent
    val result = chatAgent.run("What's the weather like today and should I bring an umbrella?")
}
```
<!--- KNIT example-predefined-strategies-02.kt -->

## ReAct 策略

ReAct (Reasoning and Acting，推理與行動) 策略是一種 AI agent 策略，它在推理與執行階段之間交替進行，以動態處理任務並要求大型語言模型 (LLM) 輸出。

### 概覽

ReAct 策略實作了一套模式，其中 agent 會：

1. 針對目前狀態進行推理並規劃後續步驟
2. 根據該推理採取行動
3. 觀察這些行動的結果
4. 重複此循環

這種方法結合了推理（逐步思考問題）與行動（執行工具以收集資訊或執行操作）的優勢。

### 流程圖

這是 ReAct 策略的流程圖：

![Koog flow diagram](img/koog-react-diagram-light.png#only-light)
![Koog flow diagram](img/koog-react-diagram-dark.png#only-dark)

### 設定與相依性

Koog 中的 ReAct 策略是透過 `reActStrategy` 函式實作的。若要在您的 agent 程式碼中使用該函式，請新增以下相依性匯入：

```
ai.koog.agents.ext.agent.reActStrategy
```
<!--- KNIT example-predefined-strategies-02.txt -->

若要使用該策略，請按照以下模式建立 AI agent：

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
    // 將 reActStrategy 設定為 agent 策略
    strategy = reActStrategy(
        // 設定選用參數值
        reasoningInterval = 1,
        name = "react_agent"
    )
)
```
<!--- KNIT example-predefined-strategies-03.kt -->

### 參數

`reActStrategy` 函式接受以下參數：

| 參數 | 型別 | 預設值 | 說明 |
|---------------------|--------|----------|---------------------------------------------------------------------|
| `reasoningInterval` | Int | 1 | 指定推理步驟的間隔。必須大於 0。 |
| `name` | String | `re_act` | 策略的名稱。 |

### 範例使用案例

以下是 ReAct 策略如何與簡單的銀行 agent 協作的範例：

#### 1. 使用者輸入

使用者發送初始提示詞。例如，這可以是一個問題，像是 `How much did I spend last month?`。

#### 2. 推理

agent 結合使用者輸入與推理提示詞進行初始推理。推理過程如下所示：

```text
I need to follow these steps:
1. Get all transactions from last month
2. Filter out deposits (positive amounts)
3. Calculate total spending
```
<!--- KNIT example-predefined-strategies-03.txt -->

#### 3. 行動與執行，第一階段

根據 agent 在上一步定義的行動項目，它會執行工具以獲取上個月的所有交易。

在這種情況下，要執行的工具是 `get_transactions`，連同定義的 `startDate` 與 `endDate` 引數，這些引數符合獲取上個月所有交易的要求：

```text
{tool: "get_transactions", args: {startDate: "2025-05-19", endDate: "2025-06-18"}}
```
<!--- KNIT example-predefined-strategies-04.txt -->

工具傳回的結果可能如下所示：

```text
[
  {date: "2025-05-25", amount: -100.00, description: "Grocery Store"},
  {date: "2025-05-31", amount: +1000.00, description: "Salary Deposit"},
  {date: "2025-06-10", amount: -500.00, description: "Rent Payment"},
  {date: "2025-06-13", amount: -200.00, description: "Utilities"}
]
```
<!--- KNIT example-predefined-strategies-05.txt -->

#### 4. 推理

有了工具傳回的結果，agent 會再次進行推理以確定其流程中的後續步驟：

```text
I have the transactions. Now I need to:
1. Remove the salary deposit of +1000.00
2. Sum up the remaining transactions
```
<!--- KNIT example-predefined-strategies-06.txt -->

#### 5. 行動與執行，第二階段

根據之前的推理步驟，agent 呼叫 `calculate_sum` 工具，對作為工具引數提供的金額進行加總。由於推理結果也包含移除交易中正值金額的行動點，因此作為工具引數提供的金額僅包含負值的金額：

```text
{tool: "calculate_sum", args: {amounts: [-100.00, -500.00, -200.00]}}
```
<!--- KNIT example-predefined-strategies-07.txt -->

工具傳回最終結果：

```text
-800.00
```
<!--- KNIT example-predefined-strategies-08.txt -->

#### 6. 最終回應

agent 傳回包含計算總和的最終回應（助理訊息）：

```text
You spent $800.00 last month on groceries, rent, and utilities.
```
<!--- KNIT example-predefined-strategies-09.txt -->

### 何時使用 ReAct 策略

ReAct 策略特別適用於：

- 需要多步推理的複雜任務
- agent 需要在提供最終答案前收集資訊的場景
- 有利於拆解為較小步驟的問題
- 同時需要分析性思考與工具使用的任務

### 範例

以下是實作預定義 ReAct 策略 (`reActStrategy`) 的 AI agent 以及 agent 可能使用的工具之程式碼範例：

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
    // 使用 reActStrategy 作為 agent 策略
    strategy = reActStrategy(
        reasoningInterval = 1,
        name = "banking_agent"
    ),
    // 新增 agent 可以使用的工具
    toolRegistry = ToolRegistry {
        tool(getTransactions)
        tool(calculateSum)
    }
)

suspend fun main() { 
    // 使用使用者查詢執行 agent
    val result = bankingAgent.run("How much did I spend last month?")
}
```
<!--- KNIT example-predefined-strategies-04.kt -->