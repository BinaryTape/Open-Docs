# 預定義的代理策略

為了簡化代理實作，Koog 為常見的代理使用案例提供了預定義的代理策略。
以下為可用的預定義策略：

- [聊天代理策略](#chat-agent-strategy)
- [ReAct 策略](#react-strategy)

## 聊天代理策略

聊天代理策略專為執行聊天互動流程而設計。
它協調不同階段、節點和工具之間的互動，以處理使用者輸入、執行工具並以類似聊天的管道提供回應。

### 概覽

聊天代理策略實作了一種代理會執行以下操作的模式：

1. 接收使用者輸入
2. 使用 LLM 處理輸入
3. 呼叫工具或提供直接回應
4. 處理工具結果並繼續對話
5. 若 LLM 嘗試以純文字而非使用工具回應，則提供回饋

這種方法建立了一個會話介面，代理可以在其中使用工具來滿足使用者請求。

### 設定與依賴項

Koog 中聊天代理策略的實作是透過 `chatAgentStrategy` 函數完成的。為使該函數在您的代理程式碼中可用，請新增以下依賴項匯入：

```
ai.koog.agents.ext.agent.chatAgentStrategy
```

要使用此策略，請建立一個 AI Agent 依照以下模式：

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

### 何時使用聊天代理策略

聊天代理策略特別適用於：

- 建立需要使用工具的對話式代理
- 建立可以根據使用者請求執行動作的助理
- 實作需要存取外部系統或資料的聊天機器人
- 您希望強制使用工具而非純文字回應的場景

### 範例

以下是一個程式碼範例，展示了一個實作預定義的聊天代理策略 (`chatAgentStrategy`) 的 AI Agent 以及該代理可能使用的工具：

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

## ReAct 策略

ReAct（推理與行動）策略是一種 AI Agent 策略，它在推理和執行階段之間交替，以動態處理任務並從大型語言模型 (LLM) 請求輸出。

### 概覽

ReAct 策略實作了一種代理會執行以下操作的模式：

1. 推論當前狀態並規劃下一步
2. 根據該推論採取行動
3. 觀察這些行動的結果
4. 重複此循環

這種方法結合了推理（逐步思考問題）和行動（執行工具以收集資訊或執行操作）的優勢。

### 流程圖

以下為 ReAct 策略的流程圖：

![Koog flow diagram](img/koog-react-diagram-light.png#only-light)
![Koog flow diagram](img/koog-react-diagram-dark.png#only-dark)

### 設定與依賴項

Koog 中 ReAct 策略的實作是透過 `reActStrategy` 函數完成的。為使該函數在您的代理程式碼中可用，請新增以下依賴項匯入：

```
ai.koog.agents.ext.agent.reActStrategy
```
<!--- KNIT example-predefined-strategies-03.kt -->

要使用此策略，請建立一個 AI Agent 依照以下模式：

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

### 參數

`reActStrategy` 函數接受以下參數：

| 參數                | 類型   | 預設值   | 說明                                                            |
|---------------------|--------|----------|-----------------------------------------------------------------|
| `reasoningInterval` | Int    | 1        | 指定推理步驟的間隔。必須大於 0。                                  |
| `name`              | String | `re_act` | 策略的名稱。                                                     |

### 範例使用案例

以下是 ReAct 策略如何與一個簡單的銀行代理運作的範例：

#### 1. 使用者輸入

使用者發送初始提示。例如，這可能是一個問題，例如 `How much did I spend last month?`。

#### 2. 推理

代理透過取得使用者輸入和推理提示來執行初始推理。推理可能如下所示：

```text
I need to follow these steps:
1. Get all transactions from last month
2. Filter out deposits (positive amounts)
3. Calculate total spending
```

#### 3. 行動與執行，階段 1

根據代理在上一步中定義的行動項目，它執行一個工具來取得上個月的所有交易。

在此情況下，要執行的工具是 `get_transactions`，以及定義的 `startDate` 和 `endDate` 參數，它們符合取得上個月所有交易的請求：

```text
{tool: "get_transactions", args: {startDate: "2025-05-19", endDate: "2025-06-18"}}
```

該工具返回的結果可能如下所示：

```text
[
  {date: "2025-05-25", amount: -100.00, description: "Grocery Store"},
  {date: "2025-05-31", amount: +1000.00, description: "Salary Deposit"},
  {date: "2025-06-10", amount: -500.00, description: "Rent Payment"},
  {date: "2025-06-13", amount: -200.00, description: "Utilities"}
]
```

#### 4. 推理

有了工具返回的結果，代理再次執行推理以確定其流程中的下一步：

```text
I have the transactions. Now I need to:
1. Remove the salary deposit of +1000.00
2. Sum up the remaining transactions
```

#### 5. 行動與執行，階段 2

根據先前的推理步驟，代理呼叫 `calculate_sum` 工具，該工具會加總作為工具參數提供的金額。由於推理也產生了從交易中移除正數金額的行動點，因此作為工具參數提供的金額僅為負數：

```text
{tool: "calculate_sum", args: {amounts: [-100.00, -500.00, -200.00]}}
```

該工具返回最終結果：

```text
-800.00
```

#### 6. 最終回應

代理返回最終回應（助理訊息），其中包含計算出的總和：

```text
您上個月在雜貨、租金和公用事業費上花費了 $800.00。
```

### 何時使用 ReAct 策略

ReAct 策略特別適用於：

- 需要多步驟推理的複雜任務
- 代理需要先收集資訊才能提供最終答案的場景
- 受益於分解為較小步驟的問題
- 需要分析性思考和工具使用的任務

### 範例

以下是一個程式碼範例，展示了一個實作預定義的 ReAct 策略 (`reActStrategy`) 的 AI Agent 以及該代理可能使用的工具：

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