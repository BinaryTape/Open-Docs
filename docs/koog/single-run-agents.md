# 单次运行代理

`AIAgent` 类是核心组件，它让你在 Kotlin 应用程序中创建 AI 代理。

你既可以通过最少配置构建简单代理，也可以通过定义自定义策略、工具、配置以及自定义输入/输出类型来创建具有高级功能的复杂代理。

本页面将引导你完成创建具有可自定义工具和配置的单次运行代理所需步骤。

单次运行代理处理单个输入并提供响应。它在单个工具调用循环内操作，以完成其任务并提供响应。此代理可以返回消息或工具结果。如果向代理提供了工具注册表，则返回工具结果。

如果你的目标是构建一个简单的代理进行实验，那么在创建时只需提供提示执行器和 LLM 即可。但是，如果你想要更大的灵活性和自定义能力，可以传递可选形参来配置代理。要了解更多配置选项，请参见 [API 参考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)。

## 先决条件

- 你拥有用于实现 AI 代理的 LLM 提供商的有效 API 密钥。有关所有可用提供商的列表，请参见 [概述](index.md)。

!!! 提示
    使用环境变量或安全的配置管理系统来存储你的 API 密钥。
    避免在源代码中直接硬编码 API 密钥。

## 创建单次运行代理

### 1. 添加依赖项

要使用 `AIAgent` 功能，请在你的构建配置中包含所有必要的依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

有关所有可用的安装方法，请参见 [安装](index.md#installation)。

### 2. 创建代理 

要创建代理，请创建 `AIAgent` 类的一个实例，并提供 `promptExecutor` 和 `llmModel` 形参：

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

### 3. 添加系统提示

系统提示用于定义代理行为。要提供该提示，请使用 `systemPrompt` 形参：

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

### 4. 配置 LLM 输出

使用 `temperature` 形参提供 LLM 输出生成的温度：

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

### 5. 添加工具

代理使用工具来完成特定任务。
你可以使用内置工具，也可以根据需要实现你自己的自定义工具。

要配置工具，请使用 `toolRegistry` 形参，它定义了代理可用的工具：

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
在此示例中，`SayToUser` 是内置工具。要了解如何创建自定义工具，请参见 [工具](tools-overview.md)。

### 6. 调整代理迭代次数

使用 `maxIterations` 形参提供代理在被强制停止前可以执行的最大步骤数：

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

### 7. 在代理运行时处理事件

单次运行代理支持自定义事件处理器。
虽然创建代理并非必需事件处理器，但它可能有助于测试、调试或为链式代理交互创建钩子。

有关如何使用 `EventHandler` 特性监控代理交互的更多信息，请参见 [代理事件](agent-events.md)。

### 8. 运行代理

要运行代理，请使用 `run()` 函数：

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

代理产生以下输出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?