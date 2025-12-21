# 基本代理

`AIAgent` 類別是讓您在 Kotlin 應用程式中建立 AI 代理的核心元件。

您可以建立配置最少的基本代理，或透過定義自訂策略、工具、組態以及自訂輸入/輸出類型，來建立具備進階功能的複雜代理。

本頁面將引導您完成建立具備可自訂工具與組態的基本代理所需步驟。

基本代理會處理單一輸入並提供回應。它在單次工具呼叫的週期內完成其任務並提供回應。此代理可以返回訊息或工具結果。如果有為代理提供工具註冊表，則會返回工具結果。

如果您的目標是建立一個簡單的代理進行實驗，那麼在建立時，只需提供一個提示執行器 (prompt executor) 和一個 LLM (大型語言模型) 即可。但如果您想要更大的彈性和自訂性，可以傳遞可選參數來配置代理。若要了解更多組態選項，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)。

## 先決條件

- 您擁有用於實作 AI 代理的 LLM 供應商所提供的有效 API 金鑰。所有可用供應商的列表，請參閱 [LLM 供應商](llm-providers.md)。

!!! tip
    請使用環境變數或安全的組態管理系統來儲存您的 API 金鑰。避免將 API 金鑰直接硬編碼在您的原始碼中。

## 建立基本代理

### 1. 新增依賴項

若要使用 `AIAgent` 功能，請將所有必要的依賴項包含在您的建置組態中：

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
}
```

所有可用的安裝方法，請參閱 [安裝 Koog](getting-started.md#install-koog)。

### 2. 建立代理

若要建立代理，請建立 `AIAgent` 類別的實例，並提供 `executor` 和 `llmModel` 參數：

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

### 3. 新增系統提示

系統提示用於定義代理行為。若要提供提示，請使用 `systemPrompt` 參數：

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

使用 `temperature` 參數提供 LLM 輸出生成的溫度：

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

代理使用工具來完成特定任務。您可以使用內建工具或在需要時實作您自己的自訂工具。

若要配置工具，請使用定義代理可用工具的 `toolRegistry` 參數：

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
在此範例中，`SayToUser` 是內建工具。若要了解如何建立自訂工具，請參閱 [工具](tools-overview.md)。

### 6. 調整代理迭代次數

使用 `maxIterations` 參數提供代理在被迫停止之前可以執行的最大步數：

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

### 7. 處理代理執行時的事件

基本代理支援自訂事件處理器 (event handler)。雖然建立代理不需要事件處理器，但它可能對測試、偵錯或為串聯代理互動建立掛鉤 (hooks) 有所幫助。

有關如何使用 `EventHandler` 功能監控代理互動的更多資訊，請參閱 [事件處理器](agent-event-handlers.md)。

### 8. 執行代理

若要執行代理，請使用 `run()` 函式：

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

代理產生以下輸出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?
```