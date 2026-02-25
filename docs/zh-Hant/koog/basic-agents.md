# 基礎代理

`AIAgent` 類別是在 Kotlin 應用程式中建立 AI 代理的核心元件。

您可以透過定義自訂策略、工具、配置以及自訂輸入/輸出型別，來建立僅需最低配置的簡單代理，或是具有進階功能的複雜代理。

本頁面將引導您完成建立具有可自訂工具和配置的基礎代理所需的步驟。

基礎代理處理單一輸入並提供回應。
它在單次工具呼叫週期內運作以完成其任務並提供回應。
此代理可以傳回訊息或工具結果。
如果為代理提供了工具註冊表，則會傳回工具結果。

如果您的目標是建立一個簡單的代理進行實驗，則在建立時只需提供提示詞執行器和 LLM。
但如果您需要更多的靈活性和自訂性，可以傳遞選用參數來配置代理。
若要進一步了解配置選項，請參閱 [API 參考資料](api:agents-core::ai.koog.agents.core.agent.AIAgent)。

## 前置需求

- 您擁有來自用於實作 AI 代理之 LLM 提供者的有效 API 金鑰。如需所有可用提供者的清單，請參閱 [LLM 提供者](llm-providers.md)。

!!! tip
    使用環境變數或安全的配置管理系統來儲存您的 API 金鑰。
    避免直接在原始碼中硬編碼 API 金鑰。

## 建立基礎代理

### 1. 新增相依性

要使用 `AIAgent` 功能，請在您的組建組態中包含所有必要的相依性：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

如需所有可用的安裝方法，請參閱[安裝 Koog](getting-started.md#install-koog)。

### 2. 建立代理

要建立代理，請建立 `AIAgent` 類別的執行個體並提供 `promptExecutor` 和 `llmModel` 參數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-01.kt -->

### 3. 新增系統提示詞

系統提示詞用於定義代理行為。要提供提示詞，請使用 `systemPrompt` 參數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
)
```
<!--- KNIT example-basic-02.kt -->

### 4. 配置 LLM 輸出

使用 `temperature` 參數提供 LLM 輸出產生的隨機度（Temperature）：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```
<!--- KNIT example-basic-03.kt -->

### 5. 新增工具

代理使用工具來完成特定任務。
您可以根據需要使用內建工具或實作您自己的自訂工具。

要配置工具，請使用 `toolRegistry` 參數，它定義了代理可用的工具：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    }
)
```
<!--- KNIT example-basic-04.kt -->
在範例中，`SayToUser` 是內建工具。若要了解如何建立自訂工具，請參閱[工具](tools-overview.md)。

### 6. 調整代理迭代次數

使用 `maxIterations` 參數提供代理在被迫停止之前可以執行的最大步驟數：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 30
)
```
<!--- KNIT example-basic-05.kt -->

### 7. 處理代理執行期間的事件

基礎代理支援自訂事件處理常式。
雖然建立代理不需要事件處理常式，但它對於測試、偵錯或建立鏈式代理互動的掛鉤（Hooks）可能很有幫助。

如需更多關於如何使用 `EventHandler` 功能監控代理互動的資訊，請參閱[事件處理常式](agent-event-handlers.md)。

### 8. 執行代理

要執行代理，請使用 `run()` 函式：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.ext.tool.SayToUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7,
    toolRegistry = ToolRegistry {
        tool(SayToUser)
    },
    maxIterations = 100
)

fun main() = runBlocking {
    val result = agent.run("Hello! How can you help me?")
}
```
<!--- KNIT example-basic-06.kt -->

代理會產生以下輸出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?