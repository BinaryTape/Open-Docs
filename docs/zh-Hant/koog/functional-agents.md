# 功能性代理

功能性代理是輕量級的 AI 代理，運作時無需構建複雜的策略圖。
相反，代理邏輯被實作為一個 lambda 函式，用於處理使用者輸入、與 LLM 互動、選擇性地呼叫工具並產生最終輸出。它可以執行單次 LLM 呼叫、按順序處理多次 LLM 呼叫，或根據使用者輸入以及 LLM 和工具的輸出進行迴圈。

!!! tip
    - 如果你已經有一個[基本代理](basic-agents.md)作為你的第一個 MVP，但遇到了特定任務的限制，請使用功能性代理來建立自訂邏輯的原型。你可以在純 Kotlin 中實作自訂控制流，同時仍能使用大多數 Koog 特性，包括歷程記錄壓縮和自動狀態管理。
    - 對於生產級別的需求，請將你的功能性代理重構為具有策略圖的[複雜工作流代理](complex-workflow-agents.md)。這提供了具有可控回復（rollback）功能的持久性以實現容錯，以及具有巢狀圖事件的高階 OpenTelemetry 追蹤。

本頁面將引導你完成建立最簡功能性代理並使用工具進行擴充所需的步驟。

## 前置需求

在開始之前，請確保你具備以下條件：

- 一個運作中的 Kotlin/JVM 專案。
- 已安裝 Java 17+。
- 來自用於實作 AI 代理之 LLM 提供者的有效 API 金鑰。如需所有可用提供者的清單，請參閱 [LLM 提供者](llm-providers.md)。
- （選用）如果你使用此提供者，請在本地安裝並執行 Ollama。

!!! tip
    使用環境變數或安全的組態管理系統來儲存你的 API 金鑰。
    避免直接在原始碼中硬編碼 API 金鑰。

## 新增相依性

`AIAgent` 類別是在 Koog 中建立代理的主要類別。
在你的組建組態中包含以下相依性以使用該類別的功能：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```
如需所有可用的安裝方法，請參閱[安裝 Koog](getting-started.md#install-koog)。

## 建立最簡功能性代理

要建立一個最簡功能性代理，請執行以下操作：

1. 選擇代理處理的輸入和輸出型別，並建立對應的 `AIAgent<Input, Output>` 執行個體。
   在本指南中，我們使用 `AIAgent<String, String>`，這意味著代理接收並傳回 `String`。
2. 提供所需的參數，包括系統提示、提示執行器和 LLM。
3. 使用包裹在 `functionalStrategy {...}` DSL 方法中的 lambda 函式來定義代理邏輯。

以下是一個最簡功能性代理的範例，它將使用者文字傳送到指定的 LLM 並傳回單一助理訊息。

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 建立一個 AIAgent 執行個體並提供系統提示、提示執行器與 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定義代理邏輯
        // 進行一次 LLM 呼叫
        val response = requestLLM(input)
        // 從回應中提取並傳回助理訊息內容
        response.asAssistantMessage().content
    }
)

// 使用使用者輸入執行代理並列印結果
val result = mathAgent.run("What is 12 × 9?")
println(result)
```
<!--- KNIT example-functional-agent-01.kt -->

代理可以產生以下輸出：

```
The answer to 12 × 9 is 108.
```

此代理執行單次 LLM 呼叫並傳回助理訊息內容。
你可以擴充代理邏輯以處理多個連續的 LLM 呼叫。例如：

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
import kotlinx.coroutines.runBlocking

fun main() {
    runBlocking {
-->
<!--- SUFFIX
    }
}
-->
```kotlin
// 建立一個 AIAgent 執行個體並提供系統提示、提示執行器與 LLM
val mathAgent = AIAgent<String, String>(
    systemPrompt = "You are a precise math assistant.",
    promptExecutor = simpleOllamaAIExecutor(),
    llmModel = OllamaModels.Meta.LLAMA_3_2,
    strategy = functionalStrategy { input -> // 定義代理邏輯
        // 第一次 LLM 呼叫，根據使用者輸入產生初步草稿
        val draft = requestLLM("Draft: $input").asAssistantMessage().content
        // 第二次 LLM 呼叫，透過再次使用草稿內容提示 LLM 來改進草稿
        val improved = requestLLM("Improve and clarify.").asAssistantMessage().content
        // 最後一次 LLM 呼叫，格式化改進後的文字並傳回最終格式化結果
        requestLLM("Format the result as bold.").asAssistantMessage().content
    }
)

// 使用使用者輸入執行代理並列印結果
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

在許多情況下，功能性代理需要完成特定任務，例如讀取和寫入資料或呼叫 API。
在 Koog 中，你可以將這些功能公開為工具，並讓 LLM 在代理邏輯中呼叫它們。

本章節採用上面建立的最簡功能性代理，並示範如何使用工具擴充代理邏輯。

1) 建立一個基於註解的工具。如需更多詳細資訊，請參閱[基於註解的工具](annotation-based-tools.md)。

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

若要進一步了解可用工具，請參閱[工具概覽](tools-overview.md)。

2) 註冊工具以使其可供代理使用。

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

3) 將工具註冊表傳遞給代理，以使 LLM 能夠請求並使用可用的工具。

4) 擴充代理邏輯以識別工具呼叫、執行要求的工具、將其結果傳回給 LLM，並重複此程序直到不再有工具呼叫為止。

!!! note
    僅在 LLM 繼續發出工具呼叫時才使用迴圈。

<!--- INCLUDE
import ai.koog.agents.example.exampleFunctionalAgent03.MathTools
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.functionalStrategy
import ai.koog.prompt.executor.llms.all.simpleOllamaAIExecutor
import ai.koog.prompt.executor.ollama.client.OllamaModels
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
    strategy = functionalStrategy { input -> // 定義使用工具呼叫擴充的代理邏輯
        // 將使用者輸入傳送至 LLM
        var responses = requestLLMMultiple(input)

        // 僅在 LLM 要求工具時進行迴圈
        while (responses.containsToolCalls()) {
            // 從回應中提取工具呼叫
            val pendingCalls = extractToolCalls(responses)
            // 執行工具並傳回結果
            val results = executeMultipleTools(pendingCalls)
            // 將工具結果傳回給 LLM。LLM 可能會呼叫更多工具或傳回最終輸出
            responses = sendMultipleToolResults(results)
        }

        // 當不再有工具呼叫時，從回應中提取並傳回助理訊息內容
        responses.single().asAssistantMessage().content
    }
)

// 使用使用者輸入執行代理並列印結果
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

## 後續步驟

- 了解如何使用[結構化輸出 API](structured-output.md) 傳回結構化資料。
- 嘗試為代理新增更多[工具](tools-overview.md)。
- 使用 [EventHandler](agent-events.md) 功能提高可觀察性。
- 了解如何使用[歷程記錄壓縮](history-compression.md)處理長時間運行的對話。