# 使用 AWS Bedrock 與 Koog 架構建立 AI 代理

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/BedrockAgent.ipynb
){ .md-button }

歡迎閱讀這份關於使用 Koog 架構整合 AWS Bedrock 建立智慧 AI 代理的綜合指南。在此筆記本中，我們將引導您建置一個功能齊全的代理，它可以透過自然語言指令來控制一個簡單的開關裝置。

## 您將學到什麼

- 如何使用 Kotlin 註解為 AI 代理定義自訂工具
- 為受 LLM 驅動的代理設定 AWS Bedrock 整合
- 建立工具登錄器並將其連接到代理
- 建置能夠理解並執行指令的互動式代理

## 先決條件

- 具備適當權限的 AWS Bedrock 存取權
- 已配置 AWS 憑據（存取金鑰與秘密金鑰）
- 對 Kotlin 協同程式有基本瞭解

讓我們開始建置您的第一個受 Bedrock 驅動的 AI 代理吧！

```kotlin
%useLatestDescriptors
// %use koog
```

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

// 我們的代理將控制的簡單狀態持有裝置
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
 * 讓 AI 代理使用開關操作的 ToolSet 實作。
 *
 * 核心概念：
 * - @Tool 註解將方法標記為可由代理呼叫
 * - @LLMDescription 為 LLM 提供自然語言描述
 * - ToolSet 介面允許將相關工具分組在一起
 */
class SwitchTools(val switch: Switch) : ToolSet {

    @Tool
    @LLMDescription("將開關的狀態切換為開啟或關閉")
    fun switchState(state: Boolean): String {
        switch.switch(state)
        return "Switch turned ${if (state) "on" else "off"} successfully"
    }

    @Tool
    @LLMDescription("傳回開關當前的狀態（開啟或關閉）")
    fun getCurrentState(): String {
        return "Switch is currently ${if (switch.isOn()) "on" else "off"}"
    }
}
```

```kotlin
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools

// 建立我們的開關執行個體
val switch = Switch()

// 使用我們的開關工具建立工具登錄器
val toolRegistry = ToolRegistry {
    // 將我們的 ToolSet 轉換為個別工具並進行註冊
    tools(SwitchTools(switch).asTools())
}

println("✅ 工具登錄器已建立，包含 ${toolRegistry.tools.size} 個工具：")
toolRegistry.tools.forEach { tool ->
    println("  - ${tool.name}")
}
```

    ✅ 工具登錄器已建立，包含 2 個工具：
      - getCurrentState
      - switchState

```kotlin
import ai.koog.prompt.executor.clients.bedrock.BedrockClientSettings
import ai.koog.prompt.executor.clients.bedrock.BedrockRegions

val region = BedrockRegions.US_WEST_2.regionCode
val maxRetries = 3

// 配置 Bedrock 用戶端設定
val bedrockSettings = BedrockClientSettings(
    region = region, // 選擇您偏好的 AWS 區域
    maxRetries = maxRetries // 失敗請求的重試次數
)

println("🌐 Bedrock 已配置區域：$region")
println("🔄 最大重試次數設定為：$maxRetries")
```

    🌐 Bedrock 已配置區域：us-west-2
    🔄 最大重試次數設定為：3

```kotlin
import ai.koog.prompt.executor.llms.all.simpleBedrockExecutor

// 使用環境變數中的憑據建立 Bedrock LLM 執行器
val executor = simpleBedrockExecutor(
    awsAccessKeyId = System.getenv("AWS_BEDROCK_ACCESS_KEY")
        ?: throw IllegalStateException("未設定 AWS_BEDROCK_ACCESS_KEY 環境變數"),
    awsSecretAccessKey = System.getenv("AWS_BEDROCK_SECRET_ACCESS_KEY")
        ?: throw IllegalStateException("未設定 AWS_BEDROCK_SECRET_ACCESS_KEY 環境變數"),
    settings = bedrockSettings
)

println("🔐 Bedrock 執行器已成功初始化")
println("💡 專業提示：請設定 AWS_BEDROCK_ACCESS_KEY 與 AWS_BEDROCK_SECRET_ACCESS_KEY 環境變數")
```

    🔐 Bedrock 執行器已成功初始化
    💡 專業提示：請設定 AWS_BEDROCK_ACCESS_KEY 與 AWS_BEDROCK_SECRET_ACCESS_KEY 環境變數

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.bedrock.BedrockModels

val agent = AIAgent(
    executor = executor,
    llmModel = BedrockModels.AnthropicClaude35SonnetV2, // 頂尖的推理模型
    systemPrompt = """
        你是一個負責控制開關裝置的得力助手。

        你可以：
        - 根據要求開啟或關閉開關
        - 檢查開關目前的狀態
        - 解釋你正在做的事情

        請務必清楚說明開關目前的狀態並確認已採取的行動。
    """.trimIndent(),
    temperature = 0.1, // 低溫度設定以獲得一致且專注的回應
    toolRegistry = toolRegistry
)

println("🤖 AI 代理已成功建立！")
println("📋 系統提示詞已配置")
println("🛠️  可用工具數量：${toolRegistry.tools.size}")
println("🎯 模型：${BedrockModels.AnthropicClaude35SonnetV2}")
println("🌡️  溫度：0.1（專注的回應）")
```

    🤖 AI 代理已成功建立！
    📋 系統提示詞已配置
    🛠️  可用工具數量：2
    🎯 模型：LLModel(provider=Bedrock, id=us.anthropic.claude-3-5-sonnet-20241022-v2:0, capabilities=[Temperature, Tools, ToolChoice, Image, Document, Completion], contextLength=200000, maxOutputTokens=8192)
    🌡️  溫度：0.1 (focused responses)

```kotlin
import kotlinx.coroutines.runBlocking

println("🎉 具備開關工具的 Bedrock 代理 - 準備就緒！")
println("💬 您可以要求我：")
println("   • 開啟/關閉開關")
println("   • 檢查目前的開關狀態")
println("   • 詢問有關開關的問題")
println()
println("💡 範例：'請開啟開關' 或 '目前的狀態是什麼？'")
println("📝 請輸入您的請求：")

val input = readln()
println("
🤖 正在處理您的請求...")

runBlocking {
    val response = agent.run(input)
    println("
✨ 代理回應：")
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

    執行被中斷

## 剛才發生了什麼？ 🎯

當您執行代理時，幕後發生的魔力如下：

1. **自然語言處理**：您的輸入會透過 Bedrock 傳送至 Claude 3.5 Sonnet
2. **意圖辨識**：模型理解您想對開關執行什麼操作
3. **工具選取**：根據您的請求，代理決定要呼叫哪些工具
4. **動作執行**：在您的開關物件上叫用適當的工具方法
5. **回應產生**：代理根據發生的情況撰寫自然語言回應

這展示了 Koog 架構的核心實力——自然語言理解與程式化動作之間的無縫整合。

## 後續步驟與擴充

準備好進一步探索了嗎？這裡有一些可以嘗試的想法：

### 🔧 增強型工具
```kotlin
@Tool
@LLMDescription("設定計時器，在指定的秒數後自動關閉開關")
fun setAutoOffTimer(seconds: Int): String

@Tool
@LLMDescription("取得開關的使用統計資料與歷程記錄")
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

### 🧠 記憶與上下文
```kotlin
val agent = AIAgent(
    executor = executor,
    // ... 其他配置
    features = listOf(
        MemoryFeature(), // 記住過去的互動
        LoggingFeature()  // 追蹤所有動作
    )
)
```

### 🔄 進階工作流
```kotlin
// 具有條件邏輯的多步驟工作流
@Tool
@LLMDescription("執行晚間例行公事：調暗燈光、鎖門、設定恆溫器")
fun eveningRoutine(): String
```

## 核心要點

✅ **工具即函式**：任何 Kotlin 函式都可以變成代理的功能
✅ **註解驅動行為**：@Tool 與 @LLMDescription 讓功能可被發現
✅ **ToolSet 組織功能**：將相關工具進行邏輯分組
✅ **登錄器即工具箱**：ToolRegistry 包含所有可用的代理功能
✅ **代理協調一切**：AIAgent 將 LLM 智慧與工具結合在一起

Koog 架構使得建置能夠理解自然語言並採取現實世界行動的複雜 AI 代理變得異常簡單。從簡單開始，然後根據需要添加更多工具和功能來擴充您的代理功能。

**祝您代理建置愉快！** 🚀

## 測試代理

是時候看看我們的代理運作了！該代理現在可以理解自然語言請求，並使用我們提供的工具來控制開關。

**試試這些指令：**
- "開啟開關"
- "目前的狀態是什麼？"
- "請幫我關掉它"
- "開關現在是開的還是關的？"