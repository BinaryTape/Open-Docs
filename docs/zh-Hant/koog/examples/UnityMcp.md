# Unity + Koog: 從 Kotlin 代理程式驅動您的遊戲

[:material-github: 在 GitHub 上開啟](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下載 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button }

本筆記本將引導您使用 Model Context Protocol (MCP) 和 Koog 建立一個精通 Unity 的 AI 代理程式。我們將連線到 Unity MCP 伺服器、探索工具、使用 LLM 進行規劃，並對您開啟的場景執行動作。

> 先決條件
> - 一個已安裝 Unity-MCP 伺服器外掛程式的 Unity 專案
> - JDK 17+
> - OPENAI_API_KEY 環境變數中的 OpenAI API 金鑰

```kotlin
%useLatestDescriptors
%use koog

```

```kotlin
lateinit var process: Process

```

## 1) 提供您的 OpenAI API 金鑰
我們從 `OPENAI_API_KEY` 環境變數讀取 API 金鑰，這樣您可以將機密資訊保存在筆記本之外。

```kotlin
val token = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(token)
```

## 2) 配置 Unity 代理程式
我們為 Unity 定義一個簡潔的系統提示和代理程式設定。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("cook_agent_system_prompt") {
        system {
            "您是一個 Unity 助手。您可以透過與 Unity 引擎中的工具互動來執行不同的任務。"
        }
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 1000
)
```

```kotlin

```

## 3) 啟動 Unity MCP 伺服器
我們將從您的 Unity 專案目錄啟動 Unity MCP 伺服器，並透過 stdio 連線。

```kotlin
// https://github.com/IvanMurzak/Unity-MCP
val pathToUnityProject = "path/to/unity/project"
val process = ProcessBuilder(
    "$pathToUnityProject/com.ivanmurzak.unity.mcp.server/bin~/Release/net9.0/com.IvanMurzak.Unity.MCP.Server",
    "60606"
).start()
```

## 4) 從 Koog 連線並執行代理程式
我們從 Unity MCP 伺服器探索工具、建立一個小型「計劃優先」策略，並執行一個僅使用工具來修改您開啟場景的代理程式。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    // 使用來自 MCP 伺服器的工具建立 ToolRegistry
    val toolRegistry = McpToolRegistryProvider.fromTransport(
        transport = McpToolRegistryProvider.defaultStdioTransport(process)
    )

    toolRegistry.tools.forEach {
        println(it.name)
        println(it.descriptor)
    }

    val strategy = strategy<String, String>("unity_interaction") {
        val nodePlanIngredients by nodeLLMRequest(allowToolCalls = false)
        val interactionWithUnity by subgraphWithTask<String, String>(
            // 處理計畫
            tools = toolRegistry.tools,
        ) { input ->
            "根據計畫開始與 Unity 互動：$input"
        }

        edge(
            nodeStart forwardTo nodePlanIngredients transformed {
                "為 " + agentInput + "" +
                    "建立詳細計畫" +
                    "使用以下工具：${toolRegistry.tools.joinToString("
") {
                        it.name + "
description:" + it.descriptor
                    }}"
            }
        )
        edge(nodePlanIngredients forwardTo interactionWithUnity onAssistantMessage { true })
        edge(interactionWithUnity forwardTo nodeFinish)
    }

    val agent = AIAgent(
        promptExecutor = executor,
        strategy = strategy,
        agentConfig = agentConfig,
        toolRegistry = toolRegistry,
        installFeatures = {
            install(Tracing)

            install(EventHandler) {
                onAgentStarting { eventContext ->
                    println("OnAgentStarting 首次 (策略: ${strategy.name})")
                }

                onAgentStarting { eventContext ->
                    println("OnAgentStarting 第二次 (策略: ${strategy.name})")
                }

                onAgentCompleted { eventContext ->
                    println(
                        "OnAgentCompleted (代理程式 ID: ${eventContext.agentId}, 結果: ${eventContext.result})"
                    )
                }
            }
        }
    )

    val result = agent.run(
        " 擴展目前開啟的塔防遊戲場景。 " +
            "為塔樓增加更多放置點，改變敵人的路徑"
    )

    result
}
```

## 5) 關閉 MCP 處理程序
在執行結束時，務必清理外部的 Unity MCP 伺服器處理程序。

```kotlin
// 關閉 Unity MCP 處理程序
process.destroy()