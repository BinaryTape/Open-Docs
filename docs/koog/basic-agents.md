# 基本代理

`AIAgent` 类是核心组件，可让您在 Kotlin 应用程序中创建 AI 代理。

您可以构建配置极简的简单代理，或通过定义自定义策略、工具、配置以及自定义输入/输出类型来创建具有高级功能的复杂代理。

本页将指导您完成创建具有可定制工具和配置的基本代理所需的步骤。

基本代理处理单个输入并提供响应。它在一个工具调用周期内完成其任务并提供响应。此代理可以返回消息或工具结果。如果向代理提供了工具注册表，则返回工具结果。

如果您的目标是构建一个简单的代理进行实验，您可以在创建它时只提供一个提示执行器和 LLM。但如果您想要更大的灵活性和定制化，可以传递可选参数来配置代理。要了解有关配置选项的更多信息，请参阅 [API 参考](https://api.koog.ai/agents/agents-core/ai.koog.agents.core.agent/-a-i-agent/-a-i-agent.html)。

## 前提条件

- 您拥有用于实现 AI 代理的 LLM 提供商提供的有效 API 密钥。有关所有可用提供商的列表，请参阅 [LLM 提供商](llm-providers.md)。

!!! tip
    使用环境变量或安全的配置管理系统来存储您的 API 密钥。避免直接在源代码中硬编码 API 密钥。

## 创建基本代理

### 1. 添加依赖项

要使用 `AIAgent` 功能，请在您的构建配置中包含所有必要的依赖项：

```
dependencies {
    implementation("ai.koog:koog-agents:$koog_version")
    // include Ktor client dependency explicitly
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

有关所有可用的安装方法，请参阅 [安装 Koog](getting-started.md#install-koog)。

### 2. 创建代理

要创建代理，请创建 `AIAgent` 类的一个实例，并提供 `executor` 和 `llmModel` 参数：

```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
    llmModel = OpenAIModels.Chat.GPT4o
)
```

### 3. 添加系统提示

系统提示用于定义代理行为。要提供提示，请使用 `systemPrompt` 参数：

```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o
)
```

### 4. 配置 LLM 输出

使用 `temperature` 参数提供 LLM 输出生成的温度：

```kotlin
val agent = AIAgent(
    promptExecutor = simpleOpenAIExecutor(System.getenv("YOUR_API_KEY")),
    systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
    llmModel = OpenAIModels.Chat.GPT4o,
    temperature = 0.7
)
```

### 5. 添加工具

代理使用工具来完成特定任务。您可以根据需要使用内置工具或实现自己的自定义工具。

要配置工具，请使用 `toolRegistry` 参数，该参数定义了代理可用的工具：

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
在此示例中，`SayToUser` 是内置工具。要了解如何创建自定义工具，请参阅 [工具](tools-overview.md)。

### 6. 调整代理迭代次数

使用 `maxIterations` 参数提供代理在被迫停止之前可以执行的最大步数：

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

### 7. 在代理运行时处理事件

基本代理支持自定义事件处理器。虽然创建代理不强制要求事件处理器，但它可能有助于测试、调试或为链式代理交互提供钩子。

有关如何使用 `EventHandler` 特性监控代理交互的更多信息，请参阅 [事件处理器](agent-event-handlers.md)。

### 8. 运行代理

要运行代理，请使用 `run()` 函数：

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

代理产生以下输出：

```
Agent says: Hello! I'm here to assist you with a variety of tasks. Whether you have questions, need information, or require help with specific tasks, feel free to ask. How can I assist you today?