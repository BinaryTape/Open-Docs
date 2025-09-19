# 基于注解的工具

基于注解的工具提供了一种声明式的方式，用于将函数作为工具暴露给大语言模型（LLM）。通过使用注解，你可以将任何函数转换为 LLM 可以理解和使用的工具。

当你需要将现有功能性暴露给 LLM，而无需手动实现工具描述时，这种方法非常有用。

!!! note
    基于注解的工具仅适用于 JVM，不适用于其他平台。对于多平台支持，请使用 [基于类的工具 API](class-based-tools.md)。

## 关键注解

要开始在项目中使用基于注解的工具，你需要了解以下关键注解：

| 注解              | 描述                                          |
|-------------------|-----------------------------------------------|
| `@Tool`           | 标记应作为工具暴露给 LLM 的函数。                 |
| `@LLMDescription` | 提供有关你的工具及其组件的描述性信息。            |

## @Tool 注解

`@Tool` 注解用于标记应作为工具暴露给 LLM 的函数。
带有 `@Tool` 注解的函数通过反射从实现了 `ToolSet` 接口的对象中收集。关于详细信息，请参见[实现 ToolSet 接口](#implement-the-toolset-interface)。

### 定义

<!--- INCLUDE
-->
```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.kt -->

### 形参

| <div style="width:100px">名称</div> | 必需 | 描述                                       |
|-------------------------------------|----|------------------------------------------|
| `customName`                        | 否   | 指定工具的自定义名称。如果未提供，则使用函数名称。 |

### 用法

要将函数标记为工具，请在实现了 `ToolSet` 接口的类中将 `@Tool` 注解应用于此函数：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // Tool implementation
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // Tool implementation
        return "Result"
    }
}
```
<!--- KNIT example-annotation-based-tools-02.kt -->

## @LLMDescription 注解

`@LLMDescription` 注解向 LLM 提供有关代码元素（类、函数、形参等）的描述性信息。
这有助于 LLM 理解这些元素的用途和用法。

### 定义

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

### 形参

| 名称          | 必需 | 描述                 |
|---------------|----|--------------------|
| `description` | 是   | 描述被注解元素的字符串。 |

### 用法

`@LLMDescription` 注解可以应用于不同层级。例如：

*   函数级别：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("Performs a specific operation and returns the result")
fun myTool(): String {
    // Function implementation
    return "Result"
}
```
<!--- KNIT example-annotation-based-tools-04.kt -->

*   形参级别：

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
    // Function implementation
    return "Processed: $input with config: $config"
}
```
<!--- KNIT example-annotation-based-tools-05.kt -->

## 创建工具

### 1. 实现 ToolSet 接口

创建一个实现 [`ToolSet`](https://api.koog.ai/agents/agents-tools/ai.koog.agents.core.tools.reflect/-tool-set/index.html) 接口的类。
此接口将你的类标记为工具的容器。

<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    // Tools will go here
}
```
<!--- KNIT example-annotation-based-tools-06.kt -->

### 2. 添加工具函数

向你的类添加函数，并用 `@Tool` 注解它们以将它们作为工具暴露：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // In a real implementation, you would call a weather API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-07.kt -->

### 3. 添加描述

添加 `@LLMDescription` 注解以向 LLM 提供上下文：
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
        // In a real implementation, you would call a weather API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-08.kt -->

### 4. 将你的工具与代理一起使用

现在你可以将你的工具与代理一起使用：
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
        // Create your tool set
        val weatherTools = MyFirstToolSet()

        // Create an agent with your tools

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiToken),
            systemPrompt = "Provide weather information for a given location.",
            llmModel = OpenAIModels.Chat.GPT4o,
            toolRegistry = ToolRegistry {
                tools(weatherTools)
            }
        )

        // The agent can now use your weather tools
        agent.run("What's the weather like in New York?")
    }
}
```
<!--- KNIT example-annotation-based-tools-09.kt -->

## 使用示例

以下是一些工具注解的实际示例。

### 基本示例：开关控制器

此示例展示了一个用于控制开关的简单工具集：
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

当 LLM 需要控制开关时，它可以从所提供的描述中理解以下信息：

*   工具的用途和功能性。
*   使用工具所需形参。
*   每个形参的可接受值。
*   执行时的预期返回值。

### 高级示例：诊断工具

此示例展示了一个用于设备诊断的更复杂的工具集：
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
        // Implementation
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("Analyze an error code to determine its meaning and possible solutions")
    fun analyzeError(
        @LLMDescription("The error code to analyze (e.g., 'E1001')")
        errorCode: String
    ): String {
        // Implementation
        return "Analysis of error code $errorCode"
    }
}
```
<!--- KNIT example-annotation-based-tools-11.kt -->

## 最佳实践

*   **提供清晰的描述**：编写清晰、简洁的描述，解释工具、形参和返回值的用途和行为。
*   **描述所有形参**：向所有形参添加 `@LLMDescription` 以帮助 LLM 理解每个形参的用途。
*   **使用一致的命名**：对工具和形参使用一致的命名约定，使其更直观。
*   **分组相关工具**：在同一 `ToolSet` 实现中分组相关工具，并提供类级别描述。
*   **返回信息丰富的结果**：确保工具返回值提供关于操作结果的清晰信息。
*   **优雅地处理错误**：在你的工具中包含错误处理，并返回信息丰富的错误消息。
*   **文档默认值**：当形参有默认值时，请在描述中记录这一点。
*   **保持工具专注**：每个工具都应执行一个特定的、定义明确的任务，而不是试图做太多事情。

## 常见问题排查

使用工具注解时，你可能会遇到一些常见问题。

### 工具未被识别

如果代理未识别你的工具，请检测以下内容：

*   你的类实现了 `ToolSet` 接口。
*   所有工具函数都带有 `@Tool` 注解。
*   工具函数具有适当的返回类型（为简单起见，建议使用 `String`）。
*   你的工具已正确注册到代理。

### 工具描述不清晰

如果 LLM 未正确使用你的工具或误解了它们的用途，请尝试以下操作：

*   改进你的 `@LLMDescription` 注解，使其更具体和清晰。
*   如果合适，在描述中包含示例。
*   在描述中指定形参约束（例如，`"必须是正数"`）。
*   在整个描述中保持术语一致性。

### 形参类型问题

如果 LLM 提供了不正确的形参类型，请尝试以下操作：

*   如果可能，使用简单的形参类型（`String`、`Boolean`、`Int`）。
*   在形参描述中清晰描述预期格式。
*   对于复杂类型，考虑使用带有特定格式的 `String` 形参，并在你的工具中解析它们。
*   在形参描述中包含有效输入的示例。

### 性能问题

如果你的工具导致性能问题，请尝试以下操作：

*   保持工具实现轻量级。
*   对于资源密集型操作，考虑实现异步处理。
*   在适当的时候缓存结果。
*   记录工具使用情况以识别瓶颈。