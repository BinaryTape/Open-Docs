# 功能型代理

功能型代理（Functional agents）是輕量級的 AI 代理，其運作無需建構複雜的策略圖。
相反地，代理邏輯被實作為一個 lambda 函式，用於處理使用者輸入、與 LLM 互動、
選擇性地呼叫工具，並產生最終輸出。它可以執行單一 LLM 呼叫，依序處理多個 LLM 呼叫，或者根據使用者輸入以及 LLM 和工具的輸出進行迴圈。

!!! tip
    - 如果您已有一個 [基本代理 (basic agent)](basic-agents.md) 作為您的第一個 MVP，但遇到了任務限制，請使用功能型代理來原型化自訂邏輯。您可以實作純 Kotlin 中的自訂控制流，同時仍使用大多數 Koog 功能，包括歷史壓縮和自動狀態管理。
    - 對於生產環境需求，請將您的功能型代理重構為具有策略圖的 [複雜工作流程代理 (complex workflow agent)](complex-workflow-agents.md)。這提供了持久性與可控的復原功能，以實現容錯，以及帶有巢狀圖事件的進階 OpenTelemetry 追蹤。

本頁將引導您完成建立最小功能型代理並使用工具擴展它的必要步驟。

## 前置條件

在您開始之前，請確保您具備以下項目：

- 一個可運作的 Kotlin/JVM 專案。
- 已安裝 Java 17+。
- 來自用於實作 AI 代理的 LLM 供應商的有效 API 金鑰。有關所有可用供應商的列表，請參閱 [LLM 供應商 (LLM providers)](llm-providers.md)。
- （可選）如果您使用 Ollama，請安裝並在本機運行它。

!!! tip
    使用環境變數或安全的配置管理系統來儲存您的 API 金鑰。
    避免將 API 金鑰直接硬編碼在您的原始碼中。

## 新增依賴

`AIAgent` 類別是 Koog 中用於建立代理的主要類別。
在您的建構配置中包含以下依賴，以使用該類別的功能：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
所有可用的安裝方法，請參閱 [安裝 Koog (Install Koog)](getting-started.md#install-koog)。

## 建立最小功能型代理

若要建立最小功能型代理，請執行以下操作：

1.  選擇代理要處理的輸入和輸出類型，並建立對應的 `AIAgent<Input, Output>` 實例。
    在本指南中，我們使用 `AIAgent<String, String>`，這表示代理接收並傳回 `String`。
2.  提供所需參數，包括系統提示（system prompt）、提示執行器（prompt executor）和 LLM。
3.  使用包裝在 `functionalStrategy {...}` DSL 方法中的 lambda 函式定義代理邏輯。

以下是一個最小功能型代理的範例，它將使用者文字發送到指定的 LLM 並傳回單一助理訊息。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an AIAgent instance and provide a system prompt, prompt executor, and LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // Define the agent logic
        // Make one LLM call
        val response = requestLLM(input)
        // Extract and return the assistant message content from the response
        response.asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

代理可以產生以下輸出：

```
The answer to 12 × 9 is 108.
```

這個代理執行單一 LLM 呼叫並傳回助理訊息內容。
您可以擴展代理邏輯以處理多個依序的 LLM 呼叫。例如：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.requestLLM
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// Create an AIAgent instance and provide a system prompt, prompt executor, and LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // Define the agent logic
        // The first LLM call to produce an initial draft based on the user input
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // The second LLM call to improve the draft by prompting the LLM again with the draft content
        val improved = requestLLM("Improve and clarify: $draft").asAssistantMessage().content
        // The final LLM call to format the improved text and return the final formatted result
        requestLLM("Format the result as bold: $improved").asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-02.kt -->

代理可以產生以下輸出：

```
When multiplying 12 by 9, we can break it down as follows:

**12 (tens) × 9 = 108**

Alternatively, we can also use the distributive property to calculate this:

**(10 + 2) × 9**
= **10 × 9 + 2 × 9**
= **90 + 18**
= **108**
```

## 新增工具

在許多情況下，功能型代理需要完成特定任務，例如讀取和寫入資料或呼叫 API。
在 Koog 中，您可以將這些功能作為工具公開，並讓 LLM 在代理邏輯中呼叫它們。

本章將以上面建立的最小功能型代理為例，示範如何使用工具擴展代理邏輯。

1) 建立一個基於註解的工具。有關更多詳細資訊，請參閱 [基於註解的工具 (Annotation-based tools)](annotation-based-tools.md)。

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
@LLMDescription("Simple multiplier")
class MathTools : ToolSet {
    @Tool
    @LLMDescription("Multiplies two numbers and returns the result")
    fun multiply(a: Int, b: Int): Int {
        val result = a * b
        return result
    }
}
```
<!--- KNIT example-functional-agent-03.kt -->

要了解有關可用工具的更多資訊，請參閱 [工具概覽 (Tool overview)](tools-overview.md)。

2) 註冊該工具以使其可供代理使用。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val toolRegistry = ToolRegistry {
    tools(MathTools())
}
```
<!--- KNIT example-functional-agent-04.kt -->

3) 將工具註冊表傳遞給代理，以使 LLM 能夠請求和使用可用工具。

4) 擴展代理邏輯以識別工具呼叫、執行請求的工具、將其結果傳回給 LLM，並重複該過程直到沒有工具呼叫為止。

!!! note
    僅在 LLM 繼續發出工具呼叫時才使用迴圈。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.agents.core.dsl.extension.asAssistantMessage
import ai.koog.agents.core.dsl.extension.containsToolCalls
import ai.koog.agents.core.dsl.extension.executeMultipleTools
import ai.koog.agents.core.dsl.extension.extractToolCalls
import ai.koog.agents.core.dsl.extension.requestLLMMultiple
import ai.koog.agents.core.dsl.extension.sendMultipleToolResults
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.llm.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
        val toolRegistry = ToolRegistry {
            tools(MathTools())
        }
-->
<!--- SUFFIX
    }
}
-->
```kotlin
val mathWithTools = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant. When multiplication is needed, use the multiplication tool.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    toolRegistry = toolRegistry,
    strategy = functionalStrategy { input -> // Define the agent logic extended with tool calls
        // Send the user input to the LLM
        var responses = requestLLMMultiple(input)

        // Only loop while the LLM requests tools
        while (responses.containsToolCalls()) {
            // Extract tool calls from the response
            val pendingCalls = extractToolCalls(responses)
            // Execute the tools and return the results
            val results = executeMultipleTools(pendingCalls)
            // Send the tool results back to the LLM. The LLM may call more tools or return a final output
            responses = sendMultipleToolResults(results)
        }

        // When no tool calls remain, extract and return the assistant message content from the response
        responses.single().asAssistantMessage().content
    }
)

// Run the agent with a user input and print the result
val reply = mathWithTools.run("Please multiply 12.5 and 4, then add 10 to the result.")
println(reply)
```
<!--- KNIT example-functional-agent-05.kt -->

代理可以產生以下輸出：

```
Here is the step-by-step solution:

1. Multiply 12.5 and 4:
   12.5 × 4 = 50

2. Add 10 to the result:
   50 + 10 = 60
```

## 接下來

- 了解如何使用 [結構化輸出 API (Structured output API)](structured-output.md) 傳回結構化資料。
- 嘗試為代理新增更多 [工具 (tools-overview.md)]。
- 使用 [EventHandler](agent-events.md) 功能提高可觀察性（observability）。
- 了解如何使用 [歷史壓縮 (History compression)](history-compression.md) 處理長期對話。