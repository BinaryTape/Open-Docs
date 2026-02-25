# 基于注解的工具

基于注解的工具提供了一种声明式方式，将函数作为工具公开给大型语言模型 (LLM)。
通过使用注解，您可以将任何函数转换为 LLM 可以理解并使用的工具。

当您需要将现有功能公开给 LLM 而无需手动实现工具说明时，这种方法非常有用。

!!! note
    基于注解的工具仅限 JVM，不适用于其他平台。对于多平台支持，请使用 [基于类的工具 API](class-based-tools.md)。

## 关键注解

要在项目中使用基于注解的工具，您需要了解以下关键注解：

| 注解                | 说明                                                                  |
|-------------------|---------------------------------------------------------------------|
| `@Tool`           | 将应公开给 LLM 的函数标记为工具。                                                 |
| `@LLMDescription` | 提供有关工具及其组件的说明性信息。                                                   |

## @Tool 注解

`@Tool` 注解用于标记应作为工具公开给 LLM 的函数。
被 `@Tool` 注解的函数是通过反射从实现了 `ToolSet` 接口的对象中收集的。有关详情，请参阅[实现 ToolSet 接口](#implement-the-toolset-interface)。

### 定义

<!--- INCLUDE
-->
```kotlin
@Target(AnnotationTarget.FUNCTION)
public annotation class Tool(val customName: String = "")
```
<!--- KNIT example-annotation-based-tools-01.kt -->

### 形参

| <div style="width:100px">名称</div> | 是否必选 | 说明                                                       |
|-----------------------------------|------|----------------------------------------------------------|
| `customName`                        | 否    | 为工具指定自定义名称。如果未提供，则使用函数名称。                                |

### 用法

要将一个函数标记为工具，请在实现了 `ToolSet` 接口的类中对该函数应用 `@Tool` 注解：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyToolSet : ToolSet {
    @Tool
    fun myTool(): String {
        // 工具实现
        return "Result"
    }

    @Tool(customName = "customToolName")
    fun anotherTool(): String {
        // 工具实现
        return "Result"
    }
}
```
<!--- KNIT example-annotation-based-tools-02.kt -->

## @LLMDescription 注解

`@LLMDescription` 注解为 LLM 提供关于代码元素（类、函数、形参等）的说明信息。
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

| 名称            | 是否必选 | 说明                   |
|---------------|------|----------------------|
| `description` | 是    | 描述被注解元素的字符串。         |

### 用法

`@LLMDescription` 注解可以应用于各个层级。例如：

* 函数级：
<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("执行特定操作并返回结果")
fun myTool(): String {
    // 函数实现
    return "Result"
}
```
<!--- KNIT example-annotation-based-tools-04.kt -->

* 形参级：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@Tool
@LLMDescription("处理输入数据")
fun processTool(
    @LLMDescription("要处理的输入数据")
    input: String,

    @LLMDescription("可选的配置参数")
    config: String = ""
): String {
    // 函数实现
    return "Processed: $input with config: $config"
}
```
<!--- KNIT example-annotation-based-tools-05.kt -->

## 创建工具

### 1. 实现 ToolSet 接口

创建一个实现了 [`ToolSet`](api:agents-tools::ai.koog.agents.core.tools.reflect.ToolSet) 接口的类。
此接口将您的类标记为工具容器。

<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    // 工具将放在这里
}
```
<!--- KNIT example-annotation-based-tools-06.kt -->

### 2. 添加工具函数

向您的类中添加函数，并使用 `@Tool` 对其进行注解以将其作为工具公开：

<!--- INCLUDE
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
-->
```kotlin
class MyFirstToolSet : ToolSet {
    @Tool
    fun getWeather(location: String): String {
        // 在实际实现中，您将调用天气 API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-07.kt -->

### 3. 添加说明

添加 `@LLMDescription` 注解以为 LLM 提供上下文：
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("用于获取天气信息的工具")
class MyFirstToolSet : ToolSet {
    @Tool
    @LLMDescription("获取指定位置的当前天气")
    fun getWeather(
        @LLMDescription("城市和州/国家")
        location: String
    ): String {
        // 在实际实现中，您将调用天气 API
        return "The weather in $location is sunny and 72°F"
    }
}
```
<!--- KNIT example-annotation-based-tools-08.kt -->

### 4. 在智能体中使用工具

现在您可以在智能体中使用您的工具：
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
        // 创建您的工具集
        val weatherTools = MyFirstToolSet()

        // 使用您的工具创建智能体

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiToken),
            systemPrompt = "为给定位置提供天气信息。",
            llmModel = OpenAIModels.Chat.GPT4o,
            toolRegistry = ToolRegistry {
                tools(weatherTools)
            }
        )

        // 智能体现可以使用您的天气工具了
        agent.run("What's the weather like in New York?")
    }
}
```
<!--- KNIT example-annotation-based-tools-09.kt -->

## 用法示例

以下是一些工具注解的实际示例。

### 基础示例：开关控制器

此示例显示了一个用于控制开关的简单工具集：
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
@LLMDescription("用于控制开关的工具")
class SwitchTools(val switch: Switch) : ToolSet {
    @Tool
    @LLMDescription("切换开关的状态")
    fun switch(
        @LLMDescription("要设置的状态（true 为开启，false 为关闭）")
        state: Boolean
    ): String {
        switch.switch(state)
        return "Switched to ${if (state) "on" else "off"}"
    }

    @Tool
    @LLMDescription("返回开关的当前状态")
    fun switchState(): String {
        return "Switch is ${if (switch.isOn()) "on" else "off"}"
    }
}
```
<!--- KNIT example-annotation-based-tools-10.kt -->

当 LLM 需要控制开关时，它可以从提供的说明中理解以下信息：

- 工具的用途和功能。
- 使用工具所需的形参。
- 每个形参的可接受值。
- 执行后预期的返回值。

### 进阶示例：诊断工具

此示例显示了一个用于设备诊断的更复杂的工具集：
<!--- INCLUDE
import ai.koog.agents.core.tools.reflect.ToolSet
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
-->
```kotlin
@LLMDescription("用于对设备执行诊断和故障排除的工具")
class DiagnosticToolSet : ToolSet {
    @Tool
    @LLMDescription("在设备上运行诊断以检查其状态并识别任何问题")
    fun runDiagnostic(
        @LLMDescription("要诊断的设备 ID")
        deviceId: String,

        @LLMDescription("用于诊断的附加信息（可选）")
        additionalInfo: String = ""
    ): String {
        // 实现
        return "Diagnostic results for device $deviceId"
    }

    @Tool
    @LLMDescription("分析错误代码以确定其含义和可能的解决方案")
    fun analyzeError(
        @LLMDescription("要分析的错误代码（例如 'E1001'）")
        errorCode: String
    ): String {
        // 实现
        return "Analysis of error code $errorCode"
    }
}
```
<!--- KNIT example-annotation-based-tools-11.kt -->

## 最佳做法

* **提供清晰的说明**：编写清晰、简洁的说明，解释工具、形参和返回值的用途和行为。
* **说明所有形参**：为所有形参添加 `@LLMDescription`，以帮助 LLM 理解每个形参的作用。
* **使用一致的命名**：为工具和形参使用一致的命名约定，使它们更加直观。
* **将相关工具分组**：在同一个 `ToolSet` 实现中对相关工具进行分组，并提供类级说明。
* **返回具有信息量的结果**：确保工具返回值提供关于操作结果的清晰信息。
* **优雅地处理错误**：在您的工具中包含错误处理并返回具有信息量的错误消息。
* **记录默认值**：当形参具有默认值时，在说明中记录这一点。
* **保持工具功能单一**：每个工具应执行特定的、定义明确的任务，而不是尝试做太多的事情。

## 故障排除常见问题

在使用工具注解时，您可能会遇到一些常见问题。

### 工具未被识别

如果智能体未识别您的工具，请检查以下各项：

- 您的类实现了 `ToolSet` 接口。
- 所有工具函数都已使用 `@Tool` 注解。
- 工具函数具有适当的返回值类型（为简单起见，建议使用 `String`）。
- 您的工具已在智能体中正确注册。

### 工具说明不清晰

如果 LLM 未能正确使用您的工具或误解了其用途，请尝试以下操作：

- 改进您的 `@LLMDescription` 注解，使其更加具体和清晰。
- 如果合适，在说明中包含示例。
- 在说明中指定形参约束（例如，`"必须为正数"`）。
- 在整个说明中使用一致的术语。

### 形参类型问题

如果 LLM 提供了错误的形参类型，请尝试以下操作：

- 尽可能使用简单的形参类型（`String`、`Boolean`、`Int`）。
- 在形参说明中清楚地描述预期的格式。
- 对于复杂类型，考虑使用具有特定格式的 `String` 形参，并在工具中解析它们。
- 在形参说明中包含有效输入的示例。

### 性能问题

如果您的工具导致性能问题，请尝试以下操作：

- 保持工具实现轻量化。
- 对于资源密集型操作，考虑实现异步处理。
- 在适当时缓存结果。
- 记录工具使用情况以识别瓶颈。