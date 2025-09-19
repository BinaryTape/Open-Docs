# 使用 AWS Bedrock 和 Koog 框架构建 AI 智能体

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

欢迎阅读本综合指南，了解如何使用 Koog 框架并集成 AWS Bedrock 来创建智能 AI 智能体。在本 notebook 中，我们将逐步构建一个功能性智能体，它可以通过自然语言命令控制一个简单的开关设备。

## 你将学到什么

- 如何使用 Kotlin 注解为 AI 智能体定义自定义工具
- 为 LLM 驱动的智能体设置 AWS Bedrock 集成
- 创建工具注册表并将其连接到智能体
- 构建可以理解和执行命令的交互式智能体

## 先决条件

- 具有相应权限的 AWS Bedrock 访问
- 已配置的 AWS 凭证（访问密钥和秘密密钥）
- 对 Kotlin 协程的基本理解

让我们深入探讨，构建我们的第一个由 Bedrock 驱动的 AI 智能体！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// 我们智能体将控制的简单状态持有设备
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
 * ToolSet 实现，将开关操作暴露给 AI 智能体。
 *
 * 核心概念：
 * - @Tool 注解将方法标记为可由智能体调用
 * - @LLMDescription 为 LLM 提供自然语言描述
 * - ToolSet 接口允许将相关工具分组
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
    // 将我们的 ToolSet 转换为单个工具并注册它们
    tools(SwitchTools(switch).asTools())
}

println("✅ 工具注册表已创建，包含 ${toolRegistry.tools.size} 个工具：")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 工具注册表已创建，包含 2 个工具：
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// 配置 Bedrock 客户端设置
val bedrockSettings = BedrockClientSettings(
    region = region, // 选择你偏好的 AWS 区域
    maxRetries = maxRetries // 失败请求的最大重试尝试次数
)

println("🌐 Bedrock 已配置区域：$region")
println("🔄 最大重试次数设置为：$maxRetries")
```

    🌐 Bedrock 已配置区域：us-west-2
    🔄 最大重试次数设置为：3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 使用环境变量中的凭证创建 Bedrock LLM 执行器
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrock 执行器初始化成功")
println("💡 专业提示：设置 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 环境变量")
```

    🔐 Bedrock 执行器初始化成功
    💡 专业提示：设置 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 环境变量

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 最先进的推理模型
    systemPrompt = """
        你是一个能控制开关设备的有用助手。

        你可以：
        - 根据请求打开或关闭开关
        - 检查开关的当前状态
        - 解释你正在做什么

        请始终清楚开关的当前状态，并确认所采取的操作。
    """.trimIndent(),
    temperature = 0.1, // 低温度以获得一致、集中的响应
    toolRegistry = toolRegistry
)

println("🤖 AI 智能体创建成功！")
println("📋 系统提示已配置")
println("🛠️  可用工具：${toolRegistry.tools.size}")
println("🎯 模型：${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  温度：0.1（集中响应）")
```

    🤖 AI 智能体创建成功！
    📋 系统提示已配置
    🛠️  可用工具：2
    🎯 模型：LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  温度：0.1（集中响应）

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 带有开关工具的 Bedrock 智能体 – 准备就绪！")
println("💬 你可以要求我：")
println("   • 打开/关闭开关")
println("   • 检查当前开关状态")
println("   • 询问有关开关的问题")
println()
println("💡 示例：“请打开开关”或“当前状态是什么？”")
println("📝 输入你的请求：")

val input = readln()
println("
🤖 正在处理你的请求...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 智能体响应：")
    println(response)
}
```

    🎉 带有开关工具的 Bedrock 智能体 – 准备就绪！
    💬 你可以要求我：
       • 打开/关闭开关
       • 检查当前开关状态
       • 询问有关开关的问题
    
    💡 示例：“请打开开关”或“当前状态是什么？”
    📝 输入你的请求：

    The execution was interrupted

## 刚才发生了什么？🎯

当你运行智能体时，幕后发生的“魔法”如下：

1.  **自然语言处理**：你的输入通过 Bedrock 发送给 Claude 3.5 Sonnet
2.  **意图识别**：模型理解你想要对开关做什么
3.  **工具选择**：根据你的请求，智能体决定调用哪些工具
4.  **动作执行**：在你的开关对象上调用相应的工具方法
5.  **响应生成**：智能体针对发生的事情生成自然语言响应

这展示了 Koog 框架的核心强大之处——自然语言理解与程序化动作之间的无缝集成。

## 后续步骤和扩展

准备好更进一步了吗？以下是一些可供探索的思路：

### 🔧 增强工具

```kotlin
@Tool
@LLMDescription("Sets a timer to automatically turn off the switch after specified seconds")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("Gets the switch usage statistics and history")
fun getUsageStats(): String
```

### 🌐 多设备

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
    // ... other config
    features = listOf(
        MemoryFeature(), // 记住过去的交互
        LoggingFeature()  // 跟踪所有动作
    )
)
```

### 🔄 高级工作流

```kotlin
// 带有条件逻辑的多步工作流
@Tool
@LLMDescription("Executes evening routine: dims lights, locks doors, sets thermostat")
fun eveningRoutine(): String
```

## 主要要点

✅ **工具是函数**：任何 Kotlin 函数都可以成为智能体的能力
✅ **注解驱动行为**：@Tool 和 @LLMDescription 使函数可被发现
✅ **ToolSets 组织能力**：将相关工具逻辑地分组
✅ **注册表是工具箱**：ToolRegistry 包含所有可用的智能体能力
✅ **智能体编排一切**：AIAgent 将 LLM 智能与工具结合起来

Koog 框架使构建能够理解自然语言并执行实际操作的复杂 AI 智能体变得异常简单。从简单开始，然后根据需要添加更多工具和特性来扩展你的智能体能力。

**祝你构建智能体愉快！** 🚀

## 测试智能体

是时候看看我们的智能体实际运行了！智能体现在可以理解自然语言请求，并使用我们提供的工具来控制开关。

**尝试这些命令：**
- “打开开关”
- “当前状态是什么？”
- “请关闭它”
- “开关是开着还是关着？”