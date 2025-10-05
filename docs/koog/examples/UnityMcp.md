# Unity + Koog: 使用 Kotlin Agent 驱动你的游戏

[:material-github: 在 GitHub 上打开](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button .md-button--primary }
[:material-download: 下载 .ipynb](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/UnityMcp.ipynb
){ .md-button }

本 Notebook 将引导你使用模型上下文协议 (MCP) 构建一个精通 Unity 的 AI Agent。我们将连接到 Unity MCP 服务器，发现工具，使用 LLM 进行规划，并对你当前打开的场景执行操作。

> 前提条件
> - 一个已安装 Unity-MCP 服务器插件的 Unity 项目
> - JDK 17+
> - 在 `OPENAI_API_KEY` 环境变量中设置 OpenAI API 密钥

```kotlin
%useLatestDescriptors
%use koog

```

```kotlin
lateinit var process: Process

```

## 1) 提供你的 OpenAI API 密钥
我们从 `OPENAI_API_KEY` 环境变量中读取 API 密钥，以便你避免将密钥直接写入 Notebook。

```kotlin
val token = System.getenv("OPENAI_API_KEY") ?: error("OPENAI_API_KEY environment variable not set")
val executor = simpleOpenAIExecutor(token)
```

## 2) 配置 Unity Agent
我们为 Unity 定义了一个简洁的系统提示和 Agent 设置。

```kotlin
val agentConfig = AIAgentConfig(
    prompt = prompt("cook_agent_system_prompt") {
        system {
            "你是一个 Unity 助手。你可以通过与 Unity 引擎中的工具交互来执行不同的任务。"
        }
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 1000
)
```

```kotlin

```

## 3) 启动 Unity MCP 服务器
我们将从你的 Unity 项目目录启动 Unity MCP 服务器，并通过 stdio 进行连接。

```kotlin
// https://github.com/IvanMurzak/Unity-MCP
val pathToUnityProject = "path/to/unity/project"
val process = ProcessBuilder(
    "$pathToUnityProject/com.ivanmurzak.unity.mcp.server/bin~/Release/net9.0/com.IvanMurzak.Unity.MCP.Server",
    "60606"
).start()
```

## 4) 从 Koog 连接并运行 Agent
我们从 Unity MCP 服务器发现工具，构建一个小型计划优先策略，并运行一个仅使用工具来修改你当前打开场景的 Agent。

```kotlin
import kotlinx.coroutines.runBlocking

runBlocking {
    // 使用 MCP 服务器中的工具创建 ToolRegistry
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
            // 处理计划
            tools = toolRegistry.tools,
        ) { input ->
            "根据计划开始与 Unity 交互: $input"
        }

        edge(
            nodeStart forwardTo nodePlanIngredients transformed {
                "为 " + agentInput + "" +
                    "创建详细计划，使用以下工具：${toolRegistry.tools.joinToString("
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
                    println("OnAgentStarting 第一次 (策略: ${strategy.name})")
                }

                onAgentStarting { eventContext ->
                    println("OnAgentStarting 第二次 (策略: ${strategy.name})")
                }

                onAgentCompleted { eventContext ->
                    println(
                        "OnAgentCompleted (Agent ID: ${eventContext.agentId}, 结果: ${eventContext.result})"
                    )
                }
            }
        }
    )

    val result = agent.run(
        " 扩展当前打开的塔防游戏场景。为塔添加更多放置点，改变敌人的路径"
    )

    result
}
```

## 5) 关闭 MCP 进程
在运行结束时，务必清理外部 Unity MCP 服务器进程。

```kotlin
// 关闭 Unity MCP 进程
process.destroy()