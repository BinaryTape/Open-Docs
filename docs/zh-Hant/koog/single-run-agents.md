# 單次運行代理程式

`AIAgent` 類別是核心元件，可讓您在 Kotlin 應用程式中建立 AI 代理程式。

您可以透過最少配置建立簡單的代理程式，或透過定義自訂策略、工具、配置和自訂輸入/輸出類型，來建立具備進階功能的精密代理程式。

本頁將引導您完成建立具備可自訂工具和配置的單次運行代理程式所需的步驟。

單次運行代理程式處理單一輸入並提供回應。
它在單一工具呼叫循環內運作，以完成其任務並提供回應。
此代理程式可以返回訊息或工具結果。
如果向代理程式提供了工具登錄檔，則會返回工具結果。

如果您的目標是建立一個用於實驗的簡單代理程式，則在建立時只需提供一個提示執行器和 LLM。
但如果您需要更大的彈性和自訂空間，可以傳遞選用參數來配置代理程式。
要了解更多配置選項，請參閱 [API 參考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)。

## 先決條件

- 您有來自用於實作 AI 代理程式的 LLM 提供者的有效 API 金鑰。如需所有可用提供者的清單，請參閱 [概述](index.md)。

!!! tip
    使用環境變數或安全的配置管理系統來儲存您的 API 金鑰。
    避免將 API 金鑰直接硬編碼在您的原始碼中。

## 建立單次運行代理程式

### 1. 新增依賴項

若要使用 `AIAgent` 功能，請在您的建置配置中包含所有必要的依賴項：

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    // include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

如需所有可用的安裝方法，請參閱 [安裝](index.md#installation)。

### 2. 建立代理程式

若要建立代理程式，請建立 `AIAgent` 類別的實例，並提供 `executor` 和 `llmModel` 參數：

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
<!--- KNIT example-single-run-01.kt -->

### 3. 新增系統提示

系統提示用於定義代理程式行為。若要提供提示，請使用 `systemPrompt` 參數：

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
<!--- KNIT example-single-run-02.kt -->

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
<!--- KNIT example-single-run-03.kt -->

### 5. 新增工具

代理程式使用工具來完成特定任務。
您可以根據需要使用內建工具或實作您自己的自訂工具。

若要配置工具，請使用 `toolRegistry` 參數，此參數定義了代理程式可用的工具：

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
<!--- KNIT example-single-run-04.kt -->
在此範例中，`SayToUser` 是內建工具。要了解如何建立自訂工具，請參閱 [工具](tools-overview.md)。

### 6. 調整代理程式迭代次數

使用 `maxIterations` 參數提供代理程式在強制停止前可執行的最大步驟數：

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
<!--- KNIT example-single-run-05.kt -->

### 7. 在代理程式運行時處理事件

單次運行代理程式支援自訂事件處理器。
雖然建立代理程式並非必需事件處理器，但它可能對測試、偵錯或為鏈式代理程式互動建立掛鉤有所幫助。

有關如何使用 `EventHandler` 功能監控您的代理程式互動的更多資訊，請參閱 [事件處理器](agent-event-handlers.md)。

### 8. 執行代理程式

若要執行代理程式，請使用 `run()` 函數：

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
<!--- KNIT example-single-run-06.kt -->

代理程式產生以下輸出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?