# 基於註解的工具

基於註解的工具提供了一種宣告式的方法，將函式公開為大型語言模型 (LLM) 的工具。
透過使用註解，您可以將任何函式轉換為 LLM 可以理解和使用的工具。

當您需要將現有功能公開給 LLM 而無需手動實作工具描述時，此方法非常有用。

!!! note
    基於註解的工具僅適用於 JVM，不適用於其他平台。如需多平台支援，請使用 [基於類別的工具 API](class-based-tools.md)。

## 主要註解

若要在專案中開始使用基於註解的工具，您需要了解以下主要註解：

| Annotation        | Description                                                             |
|-------------------|-------------------------------------------------------------------------|
| `@Tool`           | 標記應作為工具公開給 LLM 的函式。                |
| `@LLMDescription` | 提供有關工具及其元件的描述性資訊。 |

## @Tool 註解

`@Tool` 註解用於標記應作為工具公開給 LLM 的函式。
使用 `@Tool` 註解的函式是透過反射從實作 `ToolSet` 介面的物件中收集而來的。詳情請參閱 [實作 ToolSet 介面](#implement-the-toolset-interface)。

### 定義

<!--- INCLUDE
-->
```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.kt -->

### 參數

| <div style="width:100px">名稱</div> | 必填 | 描述                                                                              |
|-------------------------------------|----------|------------------------------------------------------------------------------------------|
| `customName`                        | 否       | 為工具指定一個自訂名稱。如果未提供，則使用函式的名稱。 |

### 用法

若要將函式標記為工具，請在實作 `ToolSet` 介面的類別中將 `@Tool` 註解應用於此函式：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // 工具實作
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // 工具實作
        return "Result"
    }
}
```
<!--- KNIT example-annotation-based-tools-02.kt -->

## @LLMDescription 註解

`@LLMDescription` 註解為 LLM 提供有關程式碼元素（類別、函式、參數等）的描述性資訊。
這有助於 LLM 理解這些元素的用途和用法。

### 定義

<!--- INCLUDE
-->
```kotlin
@Target(
    AnnotationTarget.PROPERTY,
    AnnotationTarget.CLASS,
    AnnotationTarget.PROPERTY,
    AnnotationTarget.TYPE,
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.FUNCTION
)
public annotation class LLMDescription(val description: String)
```
<!--- KNIT example-annotation-based-tools-03.kt -->

### 參數

| 名稱          | 必填 | 描述                                    |
|---------------|----------|------------------------------------------------|
| `description` | 是       | 描述被註解元素的字串。 |

### 用法

`@LLMDescription` 註解可以應用於多個層級。例如：

* 函式層級：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("Performs a specific operation and returns the result")
fun myTool(): String {
    // 函式實作
    return "Result"
}
```
<!--- KNIT example-annotation-based-tools-04.kt -->

* 參數層級：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("Processes input data")
fun processTool(
    @LLMDescription("The input data to process")
    input: String,

    @LLMDescription("Optional configuration parameters")
    config: String = ""
): String {
    // 函式實作
    return "Processed: $input with config: $config"
}
```
<!--- KNIT example-annotation-based-tools-05.kt -->

## 建立工具

### 1. 實作 ToolSet 介面

建立一個實作 [`ToolSet`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.reflect/-tool-set/index.html) 介面的類別。
此介面將您的類別標記為工具的容器。

<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    // 工具將會放在這裡
}
```
<!--- KNIT example-annotation-based-tools-06.kt -->

### 2. 加入工具函式

將函式加入您的類別，並使用 `@Tool` 註解它們，將其公開為工具：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // 在真實的實作中，您會呼叫天氣 API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-07.kt -->

### 3. 加入描述

加入 `@LLMDescription` 註解以提供 LLM 上下文：
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("Tools for getting weather information")
class MyFirstToolSet : ToolSet {
    @Tool
    @LLMDescription("Get the current weather for a location")
    fun getWeather(
        @LLMDescription("The city and state/country")
        location: String
    ): String {
        // 在真實的實作中，您會呼叫天氣 API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-08.kt -->

### 4. 將工具與代理程式搭配使用

現在您可以將工具與代理程式搭配使用：
<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.tools
import ai.koog.agents.example.exampleAnnotationBasedTools06.MyFirstToolSet
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking

const val apiToken = ""
-->
```kotlin
fun main() {
    runBlocking {
        // 建立您的工具集
        val weatherTools = MyFirstToolSet()

        // 建立一個帶有您工具的代理程式

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiToken),
            systemPrompt = "Provide weather information for a given location.",
            llmModel = OpenAIModels.Chat.GPT4o,
            toolRegistry = ToolRegistry {
                tools(weatherTools)
            }
        )

        // 代理程式現在可以使用您的天氣工具
        agent.run("What's the weather like in New York?")
    }
}
```
<!--- KNIT example-annotation-based-tools-09.kt -->

## 使用範例

以下是一些工具註解的實際範例。

### 基本範例：開關控制器

此範例顯示一個用於控制開關的簡單工具集：
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool

class Switch(private var state: Boolean) {
    fun switch(state: Boolean) {
        this.state = state
    }
    
    fun isOn(): Boolean {
        return state
    }
}
-->
```kotlin
@LLMDescription("Tools for controlling a switch")
class SwitchTools(val switch: Switch) : ToolSet {
    @Tool
    @LLMDescription("Switches the state of the switch")
    fun switch(
        @LLMDescription("The state to set (true for on, false for off)")
        state: Boolean
    ): String {
        switch.switch(state)
        return "Switched to ${if (state) "on" else "off"}"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch")
    fun switchState(): String {
        return "Switch is ${if (switch.isOn()) "on" else "off"}"
    }
}
```
<!--- KNIT example-annotation-based-tools-10.kt -->

當 LLM 需要控制開關時，它可以從提供的描述中理解以下資訊：

- 工具的用途和功能。
- 使用工具所需的參數。
- 每個參數可接受的值。
- 執行後預期的回傳值。

### 進階範例：診斷工具

此範例顯示一個更複雜的裝置診斷工具集：
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("Tools for performing diagnostics and troubleshooting on devices")
class DiagnosticToolSet : ToolSet {
    @Tool
    @LLMDescription("Run diagnostic on a device to check its status and identify any issues")
    fun runDiagnostic(
        @LLMDescription("The ID of the device to diagnose")
        deviceId: String,

        @LLMDescription("Additional information for the diagnostic (optional)")
        additionalInfo: String = ""
    ): String {
        // 實作
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("Analyze an error code to determine its meaning and possible solutions")
    fun analyzeError(
        @LLMDescription("The error code to analyze (e.g., 'E1001')")
        errorCode: String
    ): String {
        // 實作
        return "Analysis of error code $errorCode"
    }
}
```
<!--- KNIT example-annotation-based-tools-11.kt -->

## 最佳實踐

*   **提供清晰的描述**：編寫清晰、簡潔的描述，解釋工具、參數和回傳值的目的和行為。
*   **描述所有參數**：為所有參數添加 `@LLMDescription`，以幫助 LLM 理解每個參數的用途。
*   **使用一致的命名**：對工具和參數使用一致的命名約定，使其更直觀。
*   **將相關工具分組**：將相關工具分組到相同的 `ToolSet` 實作中，並提供類別層級的描述。
*   **回傳資訊豐富的結果**：確保工具回傳值提供有關操作結果的清晰資訊。
*   **優雅地處理錯誤**：在您的工具中包含錯誤處理並回傳有用的錯誤訊息。
*   **文件化預設值**：當參數具有預設值時，在描述中記載此資訊。
*   **保持工具專注**：每個工具都應執行特定、定義明確的任務，而不是嘗試做太多事情。

## 常見問題排除

使用工具註解時，您可能會遇到一些常見問題。

### 工具無法識別

如果代理程式無法識別您的工具，請檢查以下事項：

- 您的類別實作了 `ToolSet` 介面。
- 所有工具函式都標記了 `@Tool`。
- 工具函式具有適當的回傳類型（為簡潔起見，建議使用 `String`）。
- 您的工具已正確註冊到代理程式。

### 工具描述不明確

如果 LLM 未正確使用您的工具或誤解其目的，請嘗試以下方法：

- 改善您的 `@LLMDescription` 註解，使其更具體和清晰。
- 如果適用，在您的描述中包含範例。
- 在描述中指定參數限制（例如，`"必須是正數"`）。
- 在您的描述中始終使用一致的術語。

### 參數類型問題

如果 LLM 提供了不正確的參數類型，請嘗試以下方法：

- 盡可能使用簡單的參數類型（`String`、`Boolean`、`Int`）。
- 在參數描述中清楚說明預期的格式。
- 對於複雜類型，考慮使用具有特定格式的 `String` 參數，並在您的工具中解析它們。
- 在您的參數描述中包含有效輸入的範例。

### 效能問題

如果您的工具導致效能問題，請嘗試以下方法：

- 保持工具實作輕量。
- 對於資源密集型操作，考慮實作非同步處理。
- 適時快取結果。
- 記錄工具使用情況以識別瓶頸。