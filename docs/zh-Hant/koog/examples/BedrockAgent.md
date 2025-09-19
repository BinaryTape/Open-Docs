# 使用 AWS Bedrock 與 Koog 框架建構 AI 代理程式

[:material-github: Open on GitHub](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: Download .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

歡迎閱讀這份關於使用 Koog 框架整合 AWS Bedrock 來建立智慧型 AI 代理程式的綜合指南。在這份筆記本中，我們將逐步引導您建構一個功能齊全的代理程式，它能夠透過自然語言指令控制一個簡單的開關裝置。

## 您將學到什麼

- 如何使用 Kotlin 註釋為 AI 代理程式定義自訂工具
- 設定 AWS Bedrock 整合以建構由 LLM 驅動的代理程式
- 建立工具註冊表並將其連接到代理程式
- 建構能夠理解並執行指令的互動式代理程式

## 先決條件

- 具備適當權限的 AWS Bedrock 存取權限
- 已設定 AWS 憑證 (access key 和 secret key)
- 對 Kotlin 協程有基本了解

讓我們深入了解如何建構第一個由 Bedrock 驅動的 AI 代理程式！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// Simple state-holding device that our agent will control
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
 * ToolSet implementation that exposes switch operations to the AI agent.
 *
 * Key concepts:
 * - @Tool annotation marks methods as callable by the agent
 * - @LLMDescription provides natural language descriptions for the LLM
 * - ToolSet interface allows grouping related tools together
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

// Create our switch instance
val switch = Switch()

// Build the tool registry with our switch tools
val toolRegistry = ToolRegistry {
    // Convert our ToolSet to individual tools and register them
    tools(SwitchTools(switch).asTools())
}

println("✅ Tool registry created with ${toolRegistry.tools.size} tools:")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ Tool registry created with 2 tools:
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// Configure Bedrock client settings
val bedrockSettings = BedrockClientSettings(
    region = region, // Choose your preferred AWS region
    maxRetries = maxRetries // Number of retry attempts for failed requests
)

println("🌐 Bedrock configured for region: $region")
println("🔄 Max retries set to: $maxRetries")
```

    🌐 Bedrock configured for region: us-west-2
    🔄 Max retries set to: 3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// Create the Bedrock LLM executor with credentials from environment
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_ACCESS_KEY environment variable not set"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("AWS_BEDROCK_SECRET_ACCESS_KEY environment variable not set"),
    settings = bedrockSettings
)

println("🔐 Bedrock executor initialized successfully")
println("💡 專業提示：設定 AWS_BEDROCK_ACCESS_KEY 和 AWS_BEDROCK_SECRET_ACCESS_KEY 環境變數")
```

    🔐 Bedrock executor initialized successfully
    💡 Pro tip: Set AWS_BEDROCK_ACCESS_KEY and AWS_BEDROCK_SECRET_ACCESS_KEY environment variables

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // State-of-the-art reasoning model
    systemPrompt = """
        您是一位控制開關裝置的得力助手。

        您可以：
        - 在收到請求時開啟或關閉開關
        - 檢查開關的目前狀態
        - 解釋您正在做什麼

        請務必清楚說明開關的目前狀態並確認已採取的動作。
    """.trimIndent(),
    temperature = 0.1, // Low temperature for consistent, focused responses
    toolRegistry = toolRegistry
)

println("🤖 AI Agent created successfully!")
println("📋 System prompt configured")
println("🛠️  Tools available: ${toolRegistry.tools.size}")
println("🎯 Model: ${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  Temperature: 0.1 (focused responses)")
```

    🤖 AI Agent created successfully!
    📋 System prompt configured
    🛠️  Tools available: 2
    🎯 Model: LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  Temperature: 0.1 (focused responses)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 搭載開關工具的 Bedrock 代理程式 — 準備就緒！")
println("💬 您可以要求我：")
println("   • 開啟/關閉開關")
println("   • 檢查開關的目前狀態")
println("   • 詢問有關開關的問題")
println()
println("💡 範例：「請開啟開關」或「目前狀態是什麼？」")
println("📝 輸入您的請求：")

val input = readln()
println("
🤖 正在處理您的請求...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 代理程式回應：")
    println(response)
}
```

    🎉 Bedrock Agent with Switch Tools - Ready to Go!
    💬 You can ask me to:
       • Turn the switch on/off
       • Check the current switch state
       • Ask questions about the switch
    
    💡 Example: 'Please turn on the switch' or 'What's the current state?'
    📝 Type your request:

執行已中斷

## 剛才發生了什麼事？🎯

當您執行代理程式時，以下是幕後發生的「魔術」：

1.  **自然語言處理 (Natural Language Processing)**：您的輸入透過 Bedrock 傳送至 Claude 3.5 Sonnet
2.  **意圖識別 (Intent Recognition)**：模型了解您想對開關做什麼
3.  **工具選擇 (Tool Selection)**：根據您的請求，代理程式決定要呼叫哪些工具
4.  **動作執行 (Action Execution)**：在您的開關物件上叫用適當的工具方法
5.  **回應生成 (Response Generation)**：代理程式會產生一個關於發生了什麼事的自然語言回應

這展示了 Koog 框架的核心強大之處 — 自然語言理解與程式化動作之間的無縫整合。

## 後續步驟與擴展

準備好進一步探索了嗎？以下是一些您可以嘗試的想法：

### 🔧 強化工具

```kotlin
@Tool
@LLMDescription("Sets a timer to automatically turn off the switch after specified seconds")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("Gets the switch usage statistics and history")
fun getUsageStats(): String
```

### 🌐 多個裝置

```kotlin
class HomeAutomationTools : ToolSet {
    @Tool fun controlLight(room: String, on: Boolean): String
    @Tool fun setThermostat(temperature: Double): String
    @Tool fun lockDoor(doorName: String): String
}
```

### 🧠 記憶與情境

```kotlin
val agent = AIAgent(
    executor = executor,
    // ... other config
    features = listOf(
        MemoryFeature(), // 記憶過去的互動
        LoggingFeature()  // 追蹤所有動作
    )
)
```

### 🔄 進階工作流程

```kotlin
// 具備條件邏輯的多步驟工作流程
@Tool
@LLMDescription("Executes evening routine: dims lights, locks doors, sets thermostat")
fun eveningRoutine(): String
```

## 主要收穫

✅ **工具即函式 (Tools are functions)**：任何 Kotlin 函式都可以成為代理程式的能力
✅ **註釋驅動行為 (Annotations drive behavior)**：@Tool 和 @LLMDescription 使函式可被發現
✅ **ToolSet 組織功能 (ToolSets organize capabilities)**：將相關工具邏輯性地組合在一起
✅ **註冊表是工具箱 (Registries are toolboxes)**：ToolRegistry 包含所有可用的代理程式能力
✅ **代理程式協調一切 (Agents orchestrate everything)**：AIAgent 將 LLM 智慧與工具結合

Koog 框架使建構能夠理解自然語言並採取實際行動的複雜 AI 代理程式變得非常簡單。從簡單開始，然後根據需要添加更多工具和功能來擴展代理程式的功能。

**祝您建構代理程式愉快！** 🚀

## 測試代理程式

是時候看看我們的代理程式實際運作了！代理程式現在可以理解自然語言請求，並使用我們提供的工具來控制開關。

**請嘗試以下指令：**
- 「開啟開關」
- 「目前狀態是什麼？」
- 「請將其關閉」
- 「開關是開著還是關著？」