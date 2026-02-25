# 使用 AWS Bedrock 和 Koog 框架构建 AI 代理

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

欢迎阅读这份关于使用集成 AWS Bedrock 的 Koog 框架创建智能 AI 代理的全面指南。在本笔记本中，我们将逐步构建一个功能齐全的代理，它可以通过自然语言命令控制一个简单的开关设备。

## 你将学到什么

- 如何使用 Kotlin 注解为 AI 代理定义自定义工具
- 为基于大语言模型 (LLM) 的代理设置 AWS Bedrock 集成
- 创建工具注册表并将其连接到代理
- 构建可以理解并执行命令的交互式代理

## 前提条件

- 具有相应权限的 AWS Bedrock 访问权限
- 已配置 AWS 凭据（访问密钥和私钥）
- 对 Kotlin 协程有基本了解

让我们开始构建我们的第一个由 Bedrock 驱动的 AI 代理吧！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// 我们的代理将控制的简单状态持有设备
class Switch {
    private var state: Boolean = false

    fun switch(on: Boolean) {
        state = on
    }

    fun isOn(): Boolean {
        return state
    }
}

/**
 * 将开关操作暴露给 AI 代理的 ToolSet 实现。
 *
 * 关键概念：
 * - @Tool 注解将方法标记为代理可调用
 * - @LLMDescription 为大语言模型 (LLM) 提供自然语言描述
 * - ToolSet 接口允许将相关工具组合在一起
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("Switches the state of the switch to on or off")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "Switch turned ${if (state) "on" else "off"} successfully"
    }

    @Tool
    @LLMDescription("Returns the current state of the switch (on or off)")
    fun getCurrentState(): String {
        return "Switch is currently ${if (switch.isOn()) "on" else "off"}"
    }
}
```

```kotlin
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools

// 创建我们的开关实例
val switch = Switch()

// 使用我们的开关工具构建工具注册表
val toolRegistry = ToolRegistry {
    // 将我们的 ToolSet 转换为单个工具并进行注册
    tools(SwitchTools(switch).asTools())
}

println("✅ 已创建包含 ${toolRegistry.tools.size} 个工具的工具注册表：")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 已创建包含 2 个工具的工具注册表：
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// 配置 Bedrock 客户端设置
val bedrockSettings = BedrockClientSettings(
    region = region, // 选择您首选的 AWS 区域
    maxRetries = maxRetries // 失败请求的重试次数
)

println("🌐 Bedrock 已配置区域：$region")
println("🔄 最大重试次数设置为：$maxRetries")
```

    🌐 Bedrock 已配置区域：us-west-2
    🔄 最大重试次数设置为：3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 使用环境变量中的凭据创建 Bedrock LLM 执行器
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrock 执行器初始化成功")
println("💡 专业技巧：设置 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 环境变量")
```

    🔐 Bedrock 执行器初始化成功
    💡 专业技巧：设置 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 环境变量

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 顶尖的推理模型
    systemPrompt = """
        你是一个控制开关设备的得力助手。

        你可以：
        - 根据要求打开或关闭开关
        - 检查开关的当前状态
        - 解释你正在做的事情

        请务必清楚说明开关的当前状态，并确认已执行的操作。
    """.trimIndent(),
    temperature = 0.1, // 较低的 temperature，以获得一致且专注的响应
    toolRegistry = toolRegistry
)

println("🤖 AI 代理创建成功！")
println("📋 系统提示词已配置")
println("🛠️  可用工具：${toolRegistry.tools.size}")
println("🎯 模型：${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  Temperature：0.1（专注响应）")
```

    🤖 AI 代理创建成功！
    📋 系统提示词已配置
    🛠️  可用工具：2
    🎯 模型：LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  Temperature：0.1（专注响应）

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 带有开关工具的 Bedrock 代理 - 准备就绪！")
println("💬 你可以要求我：")
println("   • 打开/关闭开关")
println("   • 检查当前的开关状态")
println("   • 询问有关开关的问题")
println()
println("💡 示例：'请打开开关' 或 '当前状态是什么？'")
println("📝 输入您的请求：")

val input = readln()
println("
🤖 正在处理您的请求...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 代理响应：")
    println(response)
}
```

    🎉 带有开关工具的 Bedrock 代理 - 准备就绪！
    💬 你可以要求我：
       • 打开/关闭开关
       • 检查当前的开关状态
       • 询问有关开关的问题
    
    💡 示例：'请打开开关' 或 '当前状态是什么？'
    📝 输入您的请求：

    执行被中断

## 刚才发生了什么？ 🎯

当你运行代理时，后台发生了以下奇妙的过程：

1. **自然语言处理**：你的输入通过 Bedrock 发送给 Claude 3.5 Sonnet
2. **意图识别**：模型理解你想对开关执行的操作
3. **工具选择**：根据你的请求，代理决定调用哪些工具
4. **操作执行**：在你的开关对象上调用相应的工具方法
5. **响应生成**：代理根据发生的情况组织自然语言响应

这展示了 Koog 框架的核心优势——自然语言理解与程序化操作之间的无缝集成。

## 下一步和扩展

准备好深入探索了吗？这里有一些可以尝试的想法：

### 🔧 增强型工具
```kotlin
@Tool
@LLMDescription("Sets a timer to automatically turn off the switch after specified seconds")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("Gets the switch usage statistics and history")
fun getUsageStats(): String
```

### 🌐 多个设备
```kotlin
class HomeAutomationTools : ToolSet {
    @Tool fun controlLight(room: String, on: Boolean): String
    @Tool fun setThermostat(temperature: Double): String
    @Tool fun lockDoor(doorName: String): String
}
```

### 🧠 内存与上下文
```kotlin
val agent = AIAgent(
    executor = executor,
    // ... 其他配置
    features = listOf(
        MemoryFeature(), // 记住过去的交互
        LoggingFeature()  // 跟踪所有操作
    )
)
```

### 🔄 高级工作流
```kotlin
// 带有条件逻辑的多步骤工作流
@Tool
@LLMDescription("Executes evening routine: dims lights, locks doors, sets thermostat")
fun eveningRoutine(): String
```

## 关键要点

✅ **工具即函数**：任何 Kotlin 函数都可以成为代理的一项功能
✅ **注解驱动行为**：@Tool 和 @LLMDescription 使函数可被发现
✅ **ToolSet 组织功能**：逻辑上将相关工具组合在一起
✅ **注册表即工具箱**：ToolRegistry 包含所有可用的代理功能
✅ **代理编排一切**：AIAgent 将大语言模型 (LLM) 智能与工具结合在一起

Koog 框架使得构建能够理解自然语言并采取现实世界操作的复杂 AI 代理变得异常简单。从简单开始，然后根据需要通过添加更多工具和功能来扩展代理的能力。

**祝你代理构建愉快！** 🚀

## 测试代理

是时候看看我们的代理在行动了！现在，代理可以理解自然语言请求，并使用我们提供的工具来控制开关。

**尝试以下命令：**
- "打开开关"
- "当前状态是什么？"
- "请关闭它"
- "开关是开着还是关着？"