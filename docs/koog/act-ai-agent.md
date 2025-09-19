[//]: # (title: FunctionalAIAgent：如何一步步构建单次运行代理)
# FunctionalAIAgent：如何一步步构建单次运行代理

FunctionalAIAgent 是一种轻量级的非图谱代理，你可以通过一个简单的循环来控制它。当你想执行以下操作时，可以使用它：
- 在自定义循环中一次或多次调用大型语言模型（LLM）；
- 可选地在 LLM 轮次之间调用工具；
- 返回最终值（字符串、数据类等），而无需构建完整的策略图谱。

在本指南中你将完成：
1) 创建一个“Hello, World”FunctionalAIAgent。
2) 添加一个工具并让代理调用它。
3) 添加一个特性（事件处理器）以观察行为。
4) 通过历史压缩控制上下文。
5) 学习常见用法、陷阱和常见问题。

## 1) 前提条件
你需要一个 PromptExecutor（实际与你的 LLM 通信的对象）。对于本地实验，你可以使用 Ollama executor：

```kotlin
val exec = simpleOllamaAIExecutor()
```

你还需要选择一个模型，例如：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

就是这样 — 我们会将两者注入到代理工厂中。

## 2) 你的第一个代理（Hello, World）
目标：将用户的文本发送给大型语言模型（LLM），并返回一条助理消息作为字符串。

```kotlin
val agent = functionalAIAgent<String, String>(
    prompt = "You are a helpful assistant.",
    promptExecutor = exec,
    model = model
) { input ->
    val responses = requestLLMMultiple(input)
    responses.single().asAssistantMessage().content
}

val result = agent.run("Say hi in one sentence")
println(result)
```

发生了什么？
- `requestLLMMultiple(input)` 发送用户输入并接收一条或多条助理消息。
- 我们返回唯一消息的内容（典型的单次执行流）。

提示：如果你想返回结构化数据，请解析内容或使用 Structured Data API。

## 3) 添加工具（代理如何调用你的函数）
目标：让模型通过工具操作一个小型设备。

```kotlin
class Switch {
    private var on = false
    fun on() { on = true }
    fun off() { on = false }
    fun isOn() = on
}

class SwitchTools(private val sw: Switch) {
    fun turn_on() = run { sw.on(); "ok" }
    fun turn_off() = run { sw.off(); "ok" }
    fun state() = if (sw.isOn()) "on" else "off"
}

val sw = Switch()
val tools = ToolRegistry { tools(SwitchTools(sw).asTools()) }

val toolAgent = functionalAIAgent<String, String>(
    prompt = "You're responsible for running a Switch device and perform operations on it by request.",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools
) { input ->
    var responses = requestLLMMultiple(input)

    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }

    responses.single().asAssistantMessage().content
}

val out = toolAgent.run("Turn switch on")
println(out)
println("Switch is ${if (sw.isOn()) "on" else "off"}")
```

工作原理
- `containsToolCalls()` 从大型语言模型（LLM）检测工具调用消息。
- `extractToolCalls(...)` 读取要运行哪些工具以及使用哪些实参。
- `executeMultipleTools(...)` 根据你的 ToolRegistry 运行它们。
- `sendMultipleToolResults(...)` 将结果发送回大型语言模型（LLM）并获取下一个响应。

## 4) 使用特性观察行为 (EventHandler)
目标：将每次工具调用打印到控制台。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCall { e -> println("Tool called: ${'
    ```}{e.tool.name}, args: ${'
    ```}{e.toolArgs}") }
        }
    }
) { input ->
    var responses = requestLLMMultiple(input)
    while (responses.containsToolCalls()) {
        val pending = extractToolCalls(responses)
        val results = executeMultipleTools(pending)
        responses = sendMultipleToolResults(results)
    }
    responses.single().asAssistantMessage().content
}
```

你可以通过这种方式安装的其他特性包括流式传输令牌和跟踪；请参阅侧边栏中相关的文档。

## 5) 控制上下文（历史压缩）
长时间的对话可能会超出模型的上下文窗口。使用令牌用量来决定何时压缩历史记录：

```kotlin
var responses = requestLLMMultiple(input)

while (responses.containsToolCalls()) {
    if (latestTokenUsage() > 100_000) {
        compressHistory()
    }
    val pending = extractToolCalls(responses)
    val results = executeMultipleTools(pending)
    responses = sendMultipleToolResults(results)
}
```

使用适合你的模型和提示大小的阈值。

## 常见用法
- 返回结构化输出
  - 请求大型语言模型（LLM）格式化 JSON 并解析它；或使用 Structured Data API。
- 验证工具输入
  - 在工具函数中执行验证并返回清晰的错误消息。
- 每个请求一个代理实例
  - 每个代理实例在任一时刻都是单次运行的。如果需要并发，请创建新的实例。
- 自定义输出类型
  - 更改 `functionalAIAgent<String, MyResult>` 并从循环中返回一个数据类。

## 故障排除与陷阱
- “代理已在运行”
  - FunctionalAIAgent 防止在同一实例上并发运行。不要在并行协程中共享一个实例；为每次运行创建新的代理或等待其完成。
- 空或意外的模型输出
  - 检查你的系统提示。打印中间响应。考虑添加少量示例。
- 循环永不停止
  - 确保在没有工具调用时跳出；添加防护/超时机制以确保安全。
- 上下文溢出
  - 观察 `latestTokenUsage()` 并调用 `compressHistory()`。

## 参考（速查）
构造函数

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfigBase,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    loop: suspend AIAgentFunctionalContext.(input: Input) -> Output
): AIAgent<Input, Output>

fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    toolRegistry: ToolRegistry = ToolRegistry.EMPTY,
    prompt: String = "",
    model: LLModel = OpenAIModels.Chat.GPT4o,
    featureContext: FeatureContext.() -> Unit = {},
    func: suspend AIAgentFunctionalContext.(input: Input) -> Output,
): AIAgent<Input, Output>
```

重要类型
- FunctionalAIAgent<Input, Output>
- AIAgentFunctionalContext
- AIAgentConfig / AIAgentConfigBase
- PromptExecutor
- ToolRegistry
- FeatureContext and feature interfaces

查看源代码：agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt