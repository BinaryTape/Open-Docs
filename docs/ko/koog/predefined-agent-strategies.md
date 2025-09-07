# 미리 정의된 에이전트 전략

에이전트 구현을 더 쉽게 하기 위해, Koog는 일반적인 에이전트 사용 사례를 위한 미리 정의된 에이전트 전략을 제공합니다.
다음 미리 정의된 전략을 사용할 수 있습니다:

- [채팅 에이전트 전략](#chat-agent-strategy)
- [ReAct 전략](#react-strategy)

## 채팅 에이전트 전략

채팅 에이전트 전략은 채팅 상호 작용 프로세스를 실행하도록 설계되었습니다.
이 전략은 다양한 단계, 노드 및 도구 간의 상호 작용을 조율하여 사용자 입력을 처리하고, 도구를 실행하며, 채팅과 유사한 방식으로 응답을 제공합니다.

### 개요

채팅 에이전트 전략은 에이전트가 다음을 수행하는 패턴을 구현합니다:

1. 사용자 입력을 받습니다.
2. LLM을 사용하여 입력을 처리합니다.
3. 도구를 호출하거나 직접 응답을 제공합니다.
4. 도구 결과를 처리하고 대화를 계속합니다.
5. LLM이 도구 사용 대신 일반 텍스트로 응답하려고 시도하는 경우 피드백을 제공합니다.

이러한 접근 방식은 에이전트가 사용자 요청을 이행하기 위해 도구를 사용할 수 있는 대화형 인터페이스를 생성합니다.

### 설정 및 종속성

Koog에서 채팅 에이전트 전략의 구현은 `chatAgentStrategy` 함수를 통해 이루어집니다. 에이전트 코드에서 이 함수를 사용할 수 있도록 하려면 다음 종속성 임포트를 추가하세요:

```
ai.koog.agents.ext.agent.chatAgentStrategy
```

이 전략을 사용하려면 아래 패턴에 따라 AI 에이전트를 생성하세요:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.chatAgentStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor = simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Reasoning.O4Mini
-->
```kotlin
val chatAgent = AIAgent(
    executor = promptExecutor,
    toolRegistry = toolRegistry,
    llmModel = model,
    // Set chatAgentStrategy as the agent strategy
    strategy = chatAgentStrategy()
)
```
<!--- KNIT example-predefined-strategies-01.kt -->

### 채팅 에이전트 전략 사용 시점

채팅 에이전트 전략은 특히 다음 경우에 유용합니다:

- 도구를 사용해야 하는 대화형 에이전트 구축
- 사용자 요청에 따라 작업을 수행할 수 있는 어시스턴트 생성
- 외부 시스템 또는 데이터에 액세스해야 하는 챗봇 구현
- 일반 텍스트 응답보다 도구 사용을 강제하려는 시나리오

### 예시

다음은 미리 정의된 채팅 에이전트 전략(`chatAgentStrategy`)과 에이전트가 사용할 수 있는 도구를 구현하는 AI 에이전트의 코드 샘플입니다:

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
val promptExecutor = simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Reasoning.O4Mini
-->
```kotlin
val chatAgent = AIAgent(
    executor = promptExecutor,
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

## ReAct 전략

ReAct (Reasoning and Acting) 전략은 추론(Reasoning)과 실행(Acting) 단계를 번갈아 수행하여 작업을 동적으로 처리하고 대규모 언어 모델(LLM)로부터 출력을 요청하는 AI 에이전트 전략입니다.

### 개요

ReAct 전략은 에이전트가 다음을 수행하는 패턴을 구현합니다:

1. 현재 상태에 대해 추론하고 다음 단계를 계획합니다.
2. 해당 추론을 기반으로 작업을 수행합니다.
3. 해당 작업의 결과를 관찰합니다.
4. 이 주기를 반복합니다.

이러한 접근 방식은 추론(문제를 단계별로 생각하는 것)과 행동(정보를 수집하거나 작업을 수행하기 위해 도구를 실행하는 것)의 강점을 결합합니다.

### 흐름도

다음은 ReAct 전략의 흐름도입니다:

![Koog flow diagram](img/koog-react-diagram-light.png#only-light)
![Koog flow diagram](img/koog-react-diagram-dark.png#only-dark)

### 설정 및 종속성

Koog에서 ReAct 전략의 구현은 `reActStrategy` 함수를 통해 이루어집니다. 에이전트 코드에서 이 함수를 사용할 수 있도록 하려면 다음 종속성 임포트를 추가하세요:

```
ai.koog.agents.ext.agent.reActStrategy
```
<!--- KNIT example-predefined-strategies-03.kt -->

이 전략을 사용하려면 아래 패턴에 따라 AI 에이전트를 생성하세요:

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import ai.koog.agents.ext.agent.reActStrategy
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.prompt.executor.clients.openai.OpenAIModels

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val promptExecutor = simpleOpenAIExecutor(apiKey)
val toolRegistry = ToolRegistry.EMPTY
val model =  OpenAIModels.Reasoning.O4Mini
-->
```kotlin hl_lines="5-10"
val reActAgent = AIAgent(
    executor = promptExecutor,
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

### 매개변수

`reActStrategy` 함수는 다음 매개변수를 사용합니다:

| Parameter           | Type   | Default  | Description                          |
|---------------------|--------|----------|--------------------------------------|
| `reasoningInterval` | Int    | 1        | 추론 단계의 간격을 지정합니다. 0보다 커야 합니다. |
| `name`              | String | `re_act` | 전략의 이름입니다.                       |

### 예시 사용 사례

다음은 ReAct 전략이 간단한 뱅킹 에이전트와 함께 작동하는 방식의 예시입니다:

#### 1. 사용자 입력

사용자가 초기 프롬프트를 보냅니다. 예를 들어, `지난달에 얼마를 지출했나요?`와 같은 질문일 수 있습니다.

#### 2. 추론

에이전트는 사용자 입력과 추론 프롬프트를 사용하여 초기 추론을 수행합니다. 추론은 다음과 같을 수 있습니다:

```text
I need to follow these steps:
1. Get all transactions from last month
2. Filter out deposits (positive amounts)
3. Calculate total spending
```

#### 3. 행동 및 실행, 1단계

이전 단계에서 에이전트가 정의한 행동 항목을 기반으로, 에이전트는 지난달의 모든 거래를 가져오기 위해 도구를 실행합니다.

이 경우, 실행할 도구는 `get_transactions`이며, 지난달의 모든 거래를 가져오기 위한 요청과 일치하는 `startDate` 및 `endDate` 인수를 포함합니다:

```text
{tool: "get_transactions", args: {startDate: "2025-05-19", endDate: "2025-06-18"}}
```

도구는 다음과 같은 결과를 반환할 수 있습니다:

```text
[
  {date: "2025-05-25", amount: -100.00, description: "Grocery Store"},
  {date: "2025-05-31", amount: +1000.00, description: "Salary Deposit"},
  {date: "2025-06-10", amount: -500.00, description: "Rent Payment"},
  {date: "2025-06-13", amount: -200.00, description: "Utilities"}
]
```

#### 4. 추론

도구가 반환한 결과를 바탕으로, 에이전트는 흐름의 다음 단계를 결정하기 위해 다시 추론을 수행합니다:

```text
I have the transactions. Now I need to:
1. Remove the salary deposit of +1000.00
2. Sum up the remaining transactions
```

#### 5. 행동 및 실행, 2단계

이전 추론 단계를 기반으로, 에이전트는 도구 인수로 제공된 금액을 합산하는 `calculate_sum` 도구를 호출합니다. 추론 결과 거래에서 양수 금액을 제거하는 행동 지점이 도출되었으므로, 도구 인수로 제공되는 금액은 음수 금액뿐입니다:

```text
{tool: "calculate_sum", args: {amounts: [-100.00, -500.00, -200.00]}}
```

도구는 최종 결과를 반환합니다:

```text
-800.00
```

#### 6. 최종 응답

에이전트는 계산된 합계를 포함하는 최종 응답(어시스턴트 메시지)을 반환합니다:

```text
You spent $800.00 last month on groceries, rent, and utilities.
```

### ReAct 전략 사용 시점

ReAct 전략은 특히 다음 경우에 유용합니다:

- 다단계 추론이 필요한 복잡한 작업
- 최종 답변을 제공하기 전에 에이전트가 정보를 수집해야 하는 시나리오
- 더 작은 단계로 분해하여 이점을 얻는 문제
- 분석적 사고와 도구 사용 모두가 필요한 작업

### 예시

다음은 미리 정의된 ReAct 전략(`reActStrategy`)과 에이전트가 사용할 수 있는 도구를 구현하는 AI 에이전트의 코드 샘플입니다:

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
val model =  OpenAIModels.Reasoning.O4Mini
-->
```kotlin
val bankingAgent = AIAgent(
    executor = promptExecutor,
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