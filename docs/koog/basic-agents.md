# 基础智能体

`AIAgent` 类是在 Kotlin 应用程序中创建 AI 智能体的核心组件。

您可以通过最少的配置构建简单的智能体，或者通过定义自定义策略、工具、配置以及自定义输入/输出类型来创建具有高级功能的复杂智能体。

本页面将引导您完成创建一个带有可自定义工具和配置的基础智能体所需的步骤。

基础智能体处理单个输入并提供响应。
它在工具调用的单次循环内运行以完成任务并提供响应。
此智能体可以返回消息或工具结果。
如果为智能体提供了工具注册表 (`toolRegistry`)，则会返回工具结果。

如果您的目标是构建一个简单的智能体进行实验，您在创建它时可以仅提供提示执行器 (`promptExecutor`) 和 LLM。
但如果您需要更多的灵活性和自定义，可以传递可选参数来配置智能体。
要了解有关配置选项的更多信息，请参阅 [API 参考](api:agents-core::ai.koog.agents.core.agent.AIAgent)。

## 前提条件

- 您拥有用于实现 AI 智能体的 LLM 提供商提供的有效 API 密钥。有关所有可用提供商的列表，请参阅 [LLM 提供商](llm-providers.md)。

!!! tip
    使用环境变量或安全的配置管理系统来存储您的 API 密钥。
    避免在源代码中直接硬编码 API 密钥。

## 创建基础智能体

### 1. 添加依赖项

要使用 `AIAgent` 功能，请在您的构建配置中包含所有必要的依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:VERSION")
}
```

有关所有可用的安装方法，请参阅 [安装 Koog](getting-started.md#install-koog)。

### 2. 创建智能体

要创建智能体，请创建 `AIAgent` 类的实例并提供 `promptExecutor` 和 `llmModel` 参数：

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

### 3. 添加系统提示

系统提示用于定义智能体行为。要提供该提示，请使用 `systemPrompt` 参数：

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

### 4. 配置 LLM 输出

使用 `temperature` 参数提供 LLM 输出生成的温度：

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

### 5. 添加工具

智能体使用工具来完成特定任务。
如果需要，您可以使用内置工具或实现自己的自定义工具。

要配置工具，请使用 `toolRegistry` 参数，该参数定义了智能体可用的工具：

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
在示例中，`SayToUser` 是内置工具。要了解如何创建自定义工具，请参阅 [工具](tools-overview.md)。

### 6. 调整智能体迭代次数

使用 `maxIterations` 参数提供智能体在被迫停止前可以采取的最大步数：

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

### 7. 处理智能体运行时的事件

基础智能体支持自定义事件处理程序。
虽然创建智能体并不强制要求事件处理程序，但它对于测试、调试或为链式智能体交互创建钩子 (hook) 可能会有所帮助。

有关如何使用 `EventHandler` 功能监控智能体交互的更多信息，请参阅 [事件处理程序](agent-event-handlers.md)。

### 8. 运行智能体

要运行智能体，请使用 `run()` 函数：

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

该智能体生成以下输出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?