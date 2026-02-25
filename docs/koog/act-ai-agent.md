# FunctionalAIAgent：如何分步构建单次运行的 Agent

FunctionalAIAgent 是一个轻量级的非图形化 Agent，你可以通过简单的循环对其进行控制。在以下情况下使用它：
- 在自定义循环中调用一次或多次 LLM；
- 在 LLM 轮次之间可选地调用工具；
- 返回最终值（字符串、数据类等），而无需构建完整的策略图。

你将在本指南中完成的操作：
1) 创建一个 “Hello, World” FunctionalAIAgent。
2) 添加一个工具并让 Agent 调用它。
3) 添加一个功能（EventHandler）来观察行为。
4) 通过历史记录压缩来控制上下文。
5) 学习常用方案、陷阱和常见问题解答。

## 1) 前提条件
你需要一个 PromptExecutor（实际与你的 LLM 进行通信的对象）。对于本地实验，你可以使用 Ollama 执行器：

```kotlin
val exec = simpleOllamaAIExecutor()
```

你还需要选择一个模型，例如：

```kotlin
val model = OllamaModels.Meta.LLAMA_3_2
```

就是这样 —— 我们会将这两者都注入到 Agent 工厂中。

## 2) 你的第一个 Agent (Hello, World)
目标：将用户的文本发送给 LLM，并将单个助手消息作为字符串返回。

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
- requestLLMMultiple(input) 发送用户输入并接收一条或多条助手消息。
- 我们返回唯一消息的内容（典型的 one‑shot 流程）。

提示：如果你想返回结构化数据，请解析内容或使用 Structured Data API。

## 3) 添加工具（Agent 如何调用你的函数）
目标：让模型通过工具操作一个微型设备。

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

它是如何工作的
- containsToolCalls() 检测来自 LLM 的工具调用消息。
- extractToolCalls(...) 读取要运行哪些工具以及使用哪些参数。
- executeMultipleTools(...) 针对你的 ToolRegistry 运行它们。
- sendMultipleToolResults(...) 将结果发送回 LLM 并获取下一个响应。

## 4) 使用功能 (EventHandler) 观察行为
目标：将每次工具调用打印到控制台。

```kotlin
val observed = functionalAIAgent<String, String>(
    prompt = "...",
    promptExecutor = exec,
    model = model,
    toolRegistry = tools,
    featureContext = {
        install(EventHandler) {
            onToolCallStarting { e -> println("Tool called: ${'
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

你可以通过这种方式安装的其他功能包括流式 token 和跟踪；请参阅侧边栏中的相关文档。

## 5) 控制上下文（历史记录压缩）
长对话可能会超过模型的上下文窗口。使用 token 使用情况来决定何时压缩历史记录：

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

请使用适合你的模型和提示词大小的阈值。

## 常用方案
- 返回结构化输出
  - 要求 LLM 格式化 JSON 并对其进行解析；或者使用 Structured Data API。
- 验证工具输入
  - 在工具函数中执行验证并返回清晰的错误消息。
- 每次请求对应一个 Agent 实例
  - 每个 Agent 实例一次仅支持单次运行。如果需要并发，请创建新实例。
- 自定义 Output 类型
  - 更改 functionalAIAgent<String, MyResult> 并在循环中返回一个数据类。

## 故障排除与陷阱
- “Agent 正在运行”
  - FunctionalAIAgent 会阻止在同一实例上进行并发运行。不要在并行协程之间共享同一个实例；请为每次运行创建一个新的 Agent 或等待运行完成。
- 模型输出为空或非预期
  - 检查你的系统提示词。打印中间响应。考虑添加少样本 (few‑shot) 示例。
- 循环永不停止
  - 确保在没有工具调用时跳出循环；为了安全起见，请添加防护/超时机制。
- 上下文溢出
  - 观察 latestTokenUsage() 并调用 compressHistory()。

## 参考（快速）
构造函数

```kotlin
fun <Input, Output> functionalAIAgent(
    promptExecutor: PromptExecutor,
    agentConfig: AIAgentConfig,
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
- FeatureContext 和功能接口

查看源码：agents/agents-core/src/commonMain/kotlin/ai/koog/agents/core/agent/FunctionalAIAgent.kt